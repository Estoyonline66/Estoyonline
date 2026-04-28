import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";
import { Client } from "basic-ftp";

const FTP_LOG_FILE = "google-from-g1.ndjson";
const LOG_PREFIX = "[google-g1]";

type LogLineEntry = {
  ts: string;
  sid: string;
  ip: string;
  kind: "entry";
  path: string;
  location?: string;
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

type ClientExtrasBody = {
  sw?: unknown;
  sh?: unknown;
  vw?: unknown;
  vh?: unknown;
  dpr?: unknown;
  lang?: unknown;
};

type GoogleG1SessionSummary = {
  sessionId: string;
  ip: string;
  location: string;
  deviceSummary: string;
  arrival: string;
  landingPath: string;
  navigations: { path: string; time: string; deviceSummary: string }[];
};

function hasFtpConfig(): boolean {
  return Boolean(
    process.env.FTP_HOST &&
      process.env.FTP_USER &&
      process.env.FTP_PASSWORD
  );
}

function getFtpPort(): number {
  return process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21;
}

async function withFtpClient<T>(cb: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      secureOptions: { rejectUnauthorized: false },
      port: getFtpPort(),
    });
    return await cb(client);
  } finally {
    client.close();
  }
}

function isFtpMissingFile(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("550") || msg.toLowerCase().includes("file not found");
}

async function readLogRaw(): Promise<string> {
  return withFtpClient(async (client) => {
    const tmpPath = path.join(
      os.tmpdir(),
      `google-g1-${Date.now()}-${Math.random().toString(36).slice(2)}.ndjson`
    );
    try {
      await client.downloadTo(tmpPath, FTP_LOG_FILE);
      const { promises: fs } = await import("fs");
      const text = await fs.readFile(tmpPath, "utf8");
      console.info(`${LOG_PREFIX} readLogRaw storage=ftp bytes=${text.length}`);
      return text;
    } catch (err) {
      if (isFtpMissingFile(err)) {
        console.info(`${LOG_PREFIX} readLogRaw storage=ftp file-missing`);
        return "";
      }
      throw err;
    } finally {
      const { promises: fs } = await import("fs");
      await fs.unlink(tmpPath).catch(() => undefined);
    }
  });
}

async function writeLogRaw(content: string): Promise<void> {
  await withFtpClient(async (client) => {
    const tmpPath = path.join(
      os.tmpdir(),
      `google-g1-${Date.now()}-${Math.random().toString(36).slice(2)}.ndjson`
    );
    const { promises: fs } = await import("fs");
    await fs.writeFile(tmpPath, content, "utf8");
    try {
      await client.uploadFrom(tmpPath, FTP_LOG_FILE);
      console.info(`${LOG_PREFIX} writeLogRaw storage=ftp bytes=${content.length}`);
    } finally {
      await fs.unlink(tmpPath).catch(() => undefined);
    }
  });
}

async function appendLogLine(line: string): Promise<void> {
  const existing = await readLogRaw();
  const content = existing + line + "\n";
  await writeLogRaw(content);
}

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
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return "";
    const j = (await res.json()) as Record<string, unknown>;

    const city = typeof j.city === "string" ? j.city.trim() : "";
    const region =
      typeof j.region === "string"
        ? j.region.trim()
        : typeof j.region_name === "string"
          ? j.region_name.trim()
          : "";
    const country = typeof j.country === "string" ? j.country.trim() : "";
    const cc =
      typeof j.country_code === "string"
        ? j.country_code.trim().toUpperCase()
        : "";
    const org =
      typeof j.organization_name === "string"
        ? j.organization_name.trim()
        : "";
    const tz = typeof j.timezone === "string" ? j.timezone.trim() : "";

    const locality = [city, region].filter(Boolean).join(", ");
    if (locality && country) return `${locality}, ${country}`;
    if (country && cc && country !== cc) return `${country} (${cc})`;
    if (country) return country;
    if (cc) return cc;
    if (org && tz) return `${org} · ${tz}`;
    if (org) return org;
    if (tz) return tz;
    return "";
  } catch (err) {
    console.warn(`${LOG_PREFIX} lookupIpLocation failed`, err);
    return "";
  }
}

function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf && cf.trim()) return cf.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

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
  if (!ua) return "Browser";
  if (/Edg\//i.test(ua)) return "Microsoft Edge";
  if (/\bwv\b.*Chrome/i.test(ua) || /\bVersion\/[^\s]+\sChrome\//i.test(ua)) return "Chrome (webview)";
  if (/OPR\/|Opera\b/i.test(ua)) return "Opera";
  if (/Firefox\/\d+/i.test(ua)) return "Firefox";
  if (/CriOS/i.test(ua)) return "Chrome (iOS)";
  if (/\bChrome\/\d+/i.test(ua) && /Safari\/\d+/i.test(ua)) return "Chrome";
  if (/Version\/[^\s]+\sSafari/i.test(ua) && !/Chrom(e|ium)/i.test(ua)) return "Safari";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/Brave/i.test(ua)) return "Brave";
  return ua.length > 80 ? ua.slice(0, 77) + "..." : ua;
}

function sniffOsFromUa(ua: string): string {
  if (!ua) return "";
  if (/Windows NT 10/i.test(ua)) return "Windows 10/11";
  if (/Windows NT/i.test(ua)) return "Windows";
  const android = ua.match(/\bAndroid\s+([\d.]+)/i);
  if (android?.[1]) return `Android ${android[1]}`;
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
  if (ch === "?1") return "Mobile";
  if (ch === "?0") return "Desktop";
  if (/\biPad\b/i.test(ua)) return "Tablet";
  if (/Mobi|Android.+Mobile|\biPhone\b/i.test(ua)) return "Mobile";
  return "Desktop";
}

function formatScreenExtras(c?: ClientExtrasBody): string {
  const sw = clampDim(c?.sw);
  const sh = clampDim(c?.sh);
  const vw = clampDim(c?.vw);
  const vh = clampDim(c?.vh);
  const dpr = Number(c?.dpr);
  const parts: string[] = [];
  if (sw && sh) parts.push(`screen ${sw}x${sh}`);
  if (vw && vh && (vw !== sw || vh !== sh)) parts.push(`viewport ${vw}x${vh}`);
  if (Number.isFinite(dpr) && dpr > 0) parts.push(`dpr ${Math.min(4, Math.max(1, dpr)).toFixed(2)}`);
  return parts.join(", ");
}

function summarizeClientFromRequest(req: NextRequest, extras?: ClientExtrasBody): string {
  const ua = req.headers.get("user-agent") || "";
  const lang =
    extras && typeof extras.lang === "string" && extras.lang.trim()
      ? extras.lang.trim().slice(0, 48)
      : (req.headers.get("accept-language") || "")
          .split(",")[0]
          ?.split(";")[0]
          ?.trim()
          ?.slice(0, 48) || "";
  const platform = parseClientHintValue(req.headers.get("sec-ch-ua-platform")) || sniffOsFromUa(ua);
  const browser = sniffBrandFromSecChUa(req.headers.get("sec-ch-ua")) || sniffBrowserFromUa(ua);
  const formFactor = guessFormFactor(req.headers.get("sec-ch-ua-mobile"), ua);
  const screen = formatScreenExtras(extras);
  const parts = [browser, platform || "OS?", formFactor];
  const suffix = [screen, lang ? `lang ${lang}` : ""].filter(Boolean).join(", ");
  const text = suffix ? `${parts.join(" · ")} · ${suffix}` : parts.join(" · ");
  return text.length > 512 ? text.slice(0, 511) + "…" : text;
}

export async function POST(req: NextRequest) {
  try {
    if (!hasFtpConfig()) {
      console.error(`${LOG_PREFIX} POST missing FTP config`);
      return NextResponse.json(
        { error: "FTP config missing (FTP_HOST/FTP_USER/FTP_PASSWORD)" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { sessionId: sid, kind, path: pagePath, client: rawClient } = body as {
      sessionId?: string;
      kind?: string;
      path?: string;
      client?: ClientExtrasBody;
    };
    const clientExtras =
      rawClient != null && typeof rawClient === "object" ? rawClient : undefined;

    if (!sid || typeof sid !== "string" || sid.length > 128) {
      console.warn(`${LOG_PREFIX} POST invalid-session`, { sidType: typeof sid });
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const safePath =
      typeof pagePath === "string" && pagePath.length > 0 && pagePath.length < 2048
        ? pagePath
        : "/";
    const ts = new Date().toISOString();
    const deviceSummary = summarizeClientFromRequest(req, clientExtras);

    console.info(`${LOG_PREFIX} POST start`, {
      kind,
      sid,
      path: safePath,
      storage: "ftp",
    });

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
      console.warn(`${LOG_PREFIX} POST invalid-kind`, { kind });
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    await appendLogLine(JSON.stringify(line));
    console.info(`${LOG_PREFIX} POST ok`, { kind: line.kind, sid });
    return NextResponse.json({ ok: true, storage: "ftp" });
  } catch (e) {
    console.error(`${LOG_PREFIX} POST error`, e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!hasFtpConfig()) {
      console.error(`${LOG_PREFIX} GET missing FTP config`);
      return NextResponse.json(
        { error: "FTP config missing (FTP_HOST/FTP_USER/FTP_PASSWORD)" },
        { status: 500 }
      );
    }

    console.info(`${LOG_PREFIX} GET start`, {
      storage: "ftp",
    });
    const raw = await readLogRaw();
    if (!raw.trim()) {
      console.info(`${LOG_PREFIX} GET empty-log`);
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
    console.info(`${LOG_PREFIX} GET ok`, {
      lines: lines.length,
      sessions: sessions.length,
    });
    return NextResponse.json({ sessions, storage: "ftp" });
  } catch (e) {
    console.error(`${LOG_PREFIX} GET error`, e);
    return NextResponse.json({ error: "Could not read log" }, { status: 500 });
  }
}
