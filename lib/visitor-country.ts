import { BlockList, isIP } from "node:net";

// Official ranges checked 2026-10-10: https://www.cloudflare.com/ips-v4
// and https://www.cloudflare.com/ips-v6. Recheck when proxy ranges change.
const cloudflare = new BlockList();
for (const cidr of [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
  "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
  "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
  "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
]) {
  const [address, prefix] = cidr.split("/");
  cloudflare.addSubnet(address, Number(prefix), isIP(address) === 6 ? "ipv6" : "ipv4");
}

function countryCode(value: string | null): string | null {
  return value && /^[A-Z]{2}$/.test(value) && !["XX", "ZZ", "EU", "UN", "AP"].includes(value) ? value : null;
}

export function visitorCountry(headers: Headers): { country: string; countrySource: "cloudflare" | "vercel" | "unknown" } {
  const unknown = { country: "Unknown", countrySource: "unknown" as const };
  if (process.env.VERCEL !== "1") return unknown;
  // Vercel overwrites this with the connecting IP; unverified CF headers
  // must not override it. Do not store any IP addresses in the event.
  const peer = headers.get("x-vercel-forwarded-for")?.trim() || "";
  const family = isIP(peer);
  if (family && cloudflare.check(peer, family === 6 ? "ipv6" : "ipv4")) {
    const country = countryCode(headers.get("cf-ipcountry"));
    return country ? { country, countrySource: "cloudflare" } : unknown;
  }
  // Never fall back to a proxy's country if its visitor country is missing.
  if (!family || headers.has("cf-ray") || headers.has("cf-connecting-ip")) return unknown;
  const country = countryCode(headers.get("x-vercel-ip-country"));
  return country ? { country, countrySource: "vercel" } : unknown;
}
