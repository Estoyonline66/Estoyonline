const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { NextRequest } = require("next/server");
const { unstable_getResponseFromNextConfig, unstable_doesMiddlewareMatch } = require("next/experimental/testing/server");

function load(file) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", code)(require, mod, mod.exports);
  return mod.exports;
}

async function main() {
  const { middleware, config } = load("middleware.ts");
  const nextConfig = load("next.config.ts").default;
  for (const [headers, locale] of [
    [{ "accept-language": "en-US,en;q=0.9,tr;q=0.5", "x-vercel-ip-country": "ES" }, "tr"],
    [{ "accept-language": "TR-tr", "x-vercel-ip-country": "ES" }, "tr"],
    [{ "accept-language": "en", "x-vercel-ip-country": "TR" }, "tr"],
    [{ "accept-language": "es", "x-vercel-ip-country": "ES" }, "en"],
    [{}, "en"],
    [{ cookie: "language=tr", "accept-language": "en" }, "en"],
    [{ cookie: "language=en", "accept-language": "tr" }, "tr"],
    [{ "cf-ipcountry": "TR", "x-vercel-ip-country": "ES" }, "en"],
  ]) {
    const response = middleware(new NextRequest("https://estoyonline.es/?test=1", { headers }));
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), `https://estoyonline.es/${locale}`);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.match(response.headers.get("vary"), /Accept-Language/);
  }
  for (const locale of ["tr", "en"]) {
    const response = middleware(new NextRequest(`https://estoyonline.es/${locale}/price`, {
      headers: { "accept-language": "tr", "x-vercel-ip-country": "TR", "x-site-locale": "spoofed" },
    }));
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("Content-Language"), locale);
    assert.equal(response.headers.get("x-middleware-request-x-site-locale"), locale);
  }
  for (const suffix of ["/", "/tr/price?utm_source=test", "/api/free-lesson-events"]) {
    const response = await unstable_getResponseFromNextConfig({ url: `https://www.estoyonline.es${suffix}`, nextConfig });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), `https://estoyonline.es${suffix}`);
  }
  const direct = await unstable_getResponseFromNextConfig({ url: "https://estoyonline.es/en", nextConfig });
  assert.equal(direct.headers.get("location"), null);
  for (const url of ["/", "/tr/price", "/en"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), true);
  }
  for (const url of ["/api/free-lesson-events", "/_next/static/test.js", "/robots.txt"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), false);
  }
  console.log("PASS: Worker language/country parity, explicit routes, no-cache redirects, canonical host and middleware scope.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
