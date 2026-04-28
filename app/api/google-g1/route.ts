import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "google-from-g1.ndjson");

type LogLineEntry = {
  ts: string;
  sid: string;
  ip: string;
  kind: "entry";
  path: string;
  /** City/region/country özeti */
  location?: string;
  /** UA + İstemci görüntüsü özeti */
  deviceSummary?: string;
};

type LogLineNav = {
  ts: string;
  sid: string;
  kind: "nav";
  path: string;
  deviceSummary?: string;
};

type LogLine = LogLineEntry | LogLineNav;

/** geojs HTTPS — kota/limit uygunluğu için sadece entry ve GET eksikleri için kullanılıyor */
async function lookupIpLocation(ip: string): Promise<string> {
  if (!ip || ip === "unknown") return "";
  const trimmed = ip.trim();
  if (
    trimmed === "::1" ||
    trimmed.startsWith("127.") ||
    trimmed.startsWith("10.") ||
    trimmed.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(trimmed)
  ) {
    return "Local / private";
  }

  try {
    const res = await fetch(
      `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(trimmed)}.json`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return "";
    const j = (await res.json()) as Record<string, unknown>;

    const city = typeof j.city === "string" ? j.city.trim() : "";
    const regionRaw =
      typeof j.region === "string"
        ? j.region.trim()
        : typeof j.region_name === "string"
          ? j.region_name.trim()
          : "";
    const region = regionRaw;
    const country = typeof j.country === "string" ? j.country.trim() : "";
    const cc =
      typeof j.country_code === "string"
        ? (j.country_code as string).trim().toUpperCase()
        : "";
    const org =
      typeof j.organization_name === "string"
        ? (j.organization_name as string).trim()
        : "";
    const tz = typeof j.timezone === "string" ? (j.timezone as string).trim() : "";

    const locality = [city, region].filter(Boolean).join(", ");
    if (locality && country) return `${locality}, ${country}`;
    if (country && cc && country !== cc) return `${country} (${cc})`;
    if (country) return country;
    if (cc) return cc;
    if (org && tz) return `${org} · ${tz}`;
    if (org) return org;
    if (tz) return tz;
    return "";
  } catch {
    return "";
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

type ClientExtrasBody = {
  sw?: unknown;
  sh?: unknown;
  vw?: unknown;
  vh?: unknown;
  dpr?: unknown;
  lang?: unknown;
};

function clampDim(v: unknown, max = 8192): number | undefined {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(Math.min(max, n));
}

function parseClientHintValue(h: string | null): string {
  if (!h) return "";
  const t = h.trim();
  try {
    return JSON.parse(t) as string;
  } catch {
    return t.replace(/^"|"$/g, "");
  }
}

function sniffBrandFromSecChUa(secChUa: string | null): string {
  if (!secChUa) return "";
  for (const part of secChUa.split(",").map((p) => p.trim())) {
    const m = /^"([^"]+)"\s*;\s*v=/.exec(part);
    const name = m?.[1]?.trim();
    if (!name) continue;
    const low = name.toLowerCase();
    if (low === "chromium" || low.includes("not a brand")) continue;
    return name.includes("_Not") ? name.replace(/_/g, " ") : name;
  }
  return "";
}

function sniffBrowserFromUa(ua: string): string {
  if (!ua) return "Tarayıcı";
  if (/Edg\//i.test(ua)) return "Microsoft Edge";
  if (/\bwv\b.*Chrome/i.test(ua) || /\bVersion\/[^\s]+\sChrome\//i.test(ua))
    return "Chrome (webview)";
  if (/OPR\/|Opera\b/i.test(ua)) return "Opera";
  if (/Firefox\/\d+/i.test(ua)) return "Firefox";
  if (/CriOS/i.test(ua)) return "Chrome (iOS)";
  if (/\bChrome\/\d+/i.test(ua) && /Safari\/\d+/i.test(ua)) return "Chrome";
  if (/Version\/[^\s]+\sSafari/i.test(ua) && !/Chrom(e|ium)/i.test(ua))
    return "Safari";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/Brave/i.test(ua)) return "Brave";
  return ua.length > 80 ? ua.slice(0, 77) + "…" : ua;
}

function sniffOsFromUa(ua: string): string {
  if (!ua) return "";
  if (/Windows NT 10/i.test(ua)) return "Windows 10/11";
  if (/Windows NT/i.test(ua)) return "Windows";
  const Android = ua.match(/\bAndroid\s+([\d.]+)/i);
  if (Android?.[1]) return `Android ${Android[1]}`;
  const ios =
    ua.match(/\biPhone\s+OS\s+([\d_]+)/i) ||
    ua.match(/\b(?:CPU\s+)?(?:iPhone\s)?OS\s+([\d_]+)/i) ||
    ua.match(/;\s*iPad[^;]*?OS\s+([\d_]+)/i);
  if (ios?.[1]) return `iOS/iPadOS ${ios[1].replace(/_/g, ".")}`;
  const mac = ua.match(/Mac OS X (\d+[._]\d+)/i);
  if (mac?.[1]) return `macOS (${mac[1].replace(/_/g, ".")})`;
  if (/Macintosh.*Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "Linux";
  return "";
}

function guessFormFactor(secUaMobile: string | null | undefined, ua: string): string {
  const ch = secUaMobile?.trim();
  if (ch === "?1") return "Mobil";
  if (ch === "?0") return "Masaüstü";
  if (/\biPad\b/i.test(ua)) return "Tablet";
  if (/Mobi|Android.+Mobile|\biPhone\b/i.test(ua)) return "Mobil";
  return "Masaüstü";
}

function formatScreenExtras(c?: ClientExtrasBody): string {
  const sw = clampDim(c?.sw);
  const sh = clampDim(c?.sh);
  const vw = clampDim(c?.vw);
  const vh = clampDim(c?.vh);
  const rawDpr = clampDim(c?.dpr, 8);
  const parts: string[] = [];
  if (sw && sh) parts.push(`ekran ${sw}×${sh}`);
  if (vw && vh && (vw !== sw || vh !== sh)) parts.push(`görünüm ${vw}×${vh}`);
  if (rawDpr && rawDpr > 0) parts.push(`DPR ×${Math.min(4, Math.round(rawDpr * 100) / 100)}`);
  return parts.filter(Boolean).join(", ");
}

/**
 * UA, Sec-CH-* ve opsiyonel ekran + dil (istemci ile).
 * Metin kullanıcı arayüzünde görülen etiket (Türkçe kısa terimler).
 */
function summarizeClientFromRequest(
  req: NextRequest,
  extras?: ClientExtrasBody
): string {
  const ua = req.headers.get("user-agent") || "";
  const acc =
    extras && typeof extras.lang === "string" && extras.lang.trim()
      ? extras.lang.trim().slice(0, 48)
      : (req.headers.get("accept-language") || "").split(",")[0]?.split(";")[0]?.trim()?.slice(
          0,
          48
        ) ||
        "";
  const platform =
    parseClientHintValue(req.headers.get("sec-ch-ua-platform")) || sniffOsFromUa(ua);
  const chromeBrand = sniffBrandFromSecChUa(req.headers.get("sec-ch-ua"));
  const browser = chromeBrand || sniffBrowserFromUa(ua);
  const formFactor = guessFormFactor(req.headers.get("sec-ch-ua-mobile"), ua);

  let head = [
    browser,
    platform.trim() ? platform : sniffOsFromUa(ua),
    formFactor,
  ].join(" · ");

  const extra: string[] = [];
  const scr = formatScreenExtras(extras);
  if (scr) extra.push(scr);
  if (acc) extra.push(`dil ${acc}`);

  if (extra.length > 0) head += ` · ${extra.join(", ")}`;

  const maxLen = 512;
  const out = head.trim();
  return out.length > maxLen ? out.slice(0, maxLen - 1) + "…" : out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId: sid,
      kind,
      path: pagePath,
      client: rawClient,
    } = body as {
      sessionId?: string;
      kind?: string;
      path?: string;
      client?: ClientExtrasBody;
    };

    let clientExtras: ClientExtrasBody | undefined;
    if (rawClient != null && typeof rawClient === "object") clientExtras = rawClient;

    if (!sid || typeof sid !== "string" || sid.length > 128) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const safePath =
      typeof pagePath === "string" && pagePath.length > 0 && pagePath.length < 2048
        ? pagePath
        : "/";

    await fs.mkdir(LOG_DIR, { recursive: true });

    const ts = new Date().toISOString();
    const deviceSummary = summarizeClientFromRequest(req, clientExtras);
    let line: LogLine;

    if (kind === "entry") {
      const ip = getClientIp(req);
      const location = (await lookupIpLocation(ip)) || undefined;

      line = {
        ts,
        sid,
        ip,
        kind: "entry",
        path: safePath,
        deviceSummary,
        ...(location ? { location } : {}),
      };
    } else if (kind === "nav") {
      line = {
        ts,
        sid,
        kind: "nav",
        path: safePath,
        deviceSummary,
      };
    } else {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    await fs.appendFile(LOG_FILE, JSON.stringify(line) + "\n", "utf8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("google-g1 POST:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

type GoogleG1SessionSummary = {
  sessionId: string;
  ip: string;
  /** Konum özeti — eski kayıtlarda eksik olabilir (GET sırasında doldurulur) */
  location: string;
  /** Girişteki cihaz/tarayıcı özeti */
  deviceSummary: string;
  arrival: string;
  landingPath: string;
  navigations: { path: string; time: string; deviceSummary: string }[];
};

export async function GET() {
  try {
    let raw = "";
    try {
      raw = await fs.readFile(LOG_FILE, "utf8");
    } catch {
      return NextResponse.json({ sessions: [] as GoogleG1SessionSummary[] });
    }

    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const bySid = new Map<string, LogLine[]>();
    for (const line of lines) {
      try {
        const obj = JSON.parse(line) as LogLine;
        if (!obj?.sid || !obj?.ts || !obj?.kind) continue;
        const list = bySid.get(obj.sid) || [];
        list.push(obj);
        bySid.set(obj.sid, list);
      } catch {
        continue;
      }
    }

    const sessions: GoogleG1SessionSummary[] = [];
    /** GET içinde IP başına tek coğrafya çağrısı */
    const locationCache = new Map<string, string>();

    for (const [, events] of bySid) {
      events.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
      const entry = events.find((e): e is LogLineEntry => e.kind === "entry");
      if (!entry) continue;

      const navigations = events
        .filter((e): e is LogLineNav => e.kind === "nav")
        .map((e) => ({
          path: e.path,
          time: e.ts,
          deviceSummary:
            typeof e.deviceSummary === "string" && e.deviceSummary.trim()
              ? e.deviceSummary.trim()
              : "—",
        }));

      let location = typeof entry.location === "string" ? entry.location.trim() : "";
      if (!location && entry.ip) {
        let resolved = locationCache.get(entry.ip);
        if (resolved === undefined) {
          resolved = (await lookupIpLocation(entry.ip)) || "—";
          locationCache.set(entry.ip, resolved);
        }
        location = resolved;
      }
      if (!location) location = "—";

      const deviceSummary =
        typeof entry.deviceSummary === "string" && entry.deviceSummary.trim()
          ? entry.deviceSummary.trim()
          : "—";

      sessions.push({
        sessionId: entry.sid,
        ip: entry.ip,
        location,
        deviceSummary,
        arrival: entry.ts,
        landingPath: entry.path,
        navigations,
      });
    }

    sessions.sort((a, b) => new Date(b.arrival).getTime() - new Date(a.arrival).getTime());

    return NextResponse.json({ sessions });
  } catch (e) {
    console.error("google-g1 GET:", e);
    return NextResponse.json({ error: "Could not read log" }, { status: 500 });
  }
}
