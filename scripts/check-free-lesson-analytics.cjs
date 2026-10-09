// Isolated checks: never connect to the live FTP server or create real analytics.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { randomUUID } = require("node:crypto");

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", code)(name => name in mocks ? mocks[name] : require(name), mod, mod.exports);
  return mod.exports;
}

async function main() {
  const analytics = load("lib/free-lesson-analytics.ts");
  const files = new Map();
  class FakeFtp {
    async access() {}
    async ensureDir() {}
    close() {}
    async uploadFrom(stream, name) {
      let content = "";
      for await (const chunk of stream) content += chunk;
      files.set(name, content);
    }
    async rename(from, to) { files.set(to, files.get(from)); files.delete(from); }
    async list() { return [...files.keys()].map(name => ({ name })); }
    async downloadTo(stream, name) { stream.end(files.get(name)); }
  }
  Object.assign(process.env, { FTP_HOST: "test", FTP_USER: "test", FTP_PASSWORD: "test", COURSES_ADMIN_PASSWORD: "test-only-password", VERCEL: "1" });
  const auth = load("lib/courses-admin-auth.ts");
  const api = load("app/api/free-lesson-events/route.ts", {
    "basic-ftp": { Client: FakeFtp },
    "@/lib/free-lesson-analytics": analytics,
    "@/lib/courses-admin-auth": auth,
  });
  const { NextRequest } = require("next/server");
  const sessionId = randomUUID();
  const visit = { id: randomUUID(), sessionId, kind: "visit", path: "/en/free-lesson" };
  const request = (body, extra = {}) => new NextRequest("https://estoyonline.es/api/free-lesson-events", {
    method: "POST", headers: { origin: "https://estoyonline.es", "x-vercel-ip-country": "GB", ...extra }, body: JSON.stringify(body),
  });
  assert.equal((await api.POST(request(visit, { origin: "https://example.com" }))).status, 403);
  assert.equal((await api.POST(request({ ...visit, path: "/en/contact" }))).status, 400);
  assert.equal((await api.POST(request({ ...visit, id: "../bad" }))).status, 400);
  const valid = [visit, { ...visit, id: randomUUID() }, ...analytics.lessonPaths.map(page => ({ ...visit, id: randomUUID(), kind: "whatsapp", path: page }))];
  await Promise.all(valid.map(async event => assert.equal((await api.POST(request(event))).status, 200)));
  // Replay is idempotent and concurrent requests cannot overwrite each other.
  assert.equal((await api.POST(request(visit))).status, 200);
  assert.equal(files.size, 5);
  const get = headers => new NextRequest("https://estoyonline.es/api/free-lesson-events", { headers });
  assert.equal((await api.GET(get({}))).status, 401);
  assert.equal((await api.GET(get({ authorization: "Bearer wrong" }))).status, 401);
  const result = await api.GET(get({ authorization: "Bearer test-only-password" }));
  assert.equal(result.status, 200);
  assert.match(result.headers.get("cache-control"), /no-store/);
  const report = await result.json();
  assert.deepEqual(report.countries, [{ country: "GB", views: 2, sessions: 1, clicks: 3 }]);
  assert.equal(report.events.length, 5);
  assert.ok(report.events.every(event => !Object.hasOwn(event, "ip") && !Number.isNaN(Date.parse(event.time))));
  assert.equal(analytics.summarizeLessonEvents([...report.events, report.events[0]]).events.length, 5);
  assert.equal((await api.POST(request({ ...visit, campaignId: "invalid" }))).status, 400);
  const campaignVisit = { ...visit, id: randomUUID(), campaignId: "cht" };
  assert.equal((await api.POST(request(campaignVisit))).status, 200);
  const campaignReport = await (await api.GET(get({ authorization: "Bearer test-only-password" }))).json();
  assert.equal(analytics.summarizeLessonEvents(campaignReport.events, "cht").events.length, 1);
  assert.equal(analytics.summarizeLessonEvents(campaignReport.events, "other").events.length, 5);
  assert.equal(analytics.summarizeLessonEvents(campaignReport.events, "cht").countries[0].views, 1);
  for (const page of ["/tr", "/tr/contact", "/en/courses", "/any-page"]) {
    assert.equal((await api.POST(request({ ...visit, id: randomUUID(), path: page, campaignId: "tr" }))).status, 200);
  }
  assert.equal((await api.POST(request({ ...visit, id: randomUUID(), kind: "whatsapp", path: "/tr/contact", campaignId: "tr" }))).status, 200);
  for (const page of ["https://example.com", "//example.com", "/tr?secret=value", "/tr#hash"]) {
    assert.equal((await api.POST(request({ ...visit, path: page, campaignId: "tr" }))).status, 400);
  }
  const combined = await (await api.GET(get({ authorization: "Bearer test-only-password" }))).json();
  assert.deepEqual(analytics.summarizeLessonEvents(combined.events, "tr").countries, [{ country: "GB", views: 4, sessions: 1, clicks: 1 }]);
  assert.equal(analytics.summarizeLessonEvents(combined.events, "cht").events.length, 1);
  assert.equal(analytics.summarizeLessonEvents(combined.events, "other").events.length, 5);

  // Exercise the tracker across navigation, Strict Mode effect replay and reload.
  const sent = [];
  const storage = new Map();
  const handlers = new Map();
  global.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  global.window = { location: { href: "https://estoyonline.es/en" } };
  global.document = { addEventListener: (name, cb) => handlers.set(name, cb), removeEventListener: name => handlers.delete(name) };
  global.fetch = async (_url, options) => { sent.push(JSON.parse(options.body)); };
  global.Element = class { closest() { return { getAttribute: () => "https://wa.me/34633452268" }; } };
  let pathname = "/en";
  let search = "";
  let refs = [], index = 0, cleanup;
  const tracker = load("components/FreeLessonTracker.tsx", {
    react: { useRef: initial => refs[index++] ?? (refs[index - 1] = { current: initial }), useEffect: effect => { cleanup = effect(); } },
    "next/navigation": { usePathname: () => pathname, useSearchParams: () => new URLSearchParams(search) },
    "@/lib/free-lesson-analytics": analytics,
  }).default;
  function render(next) { cleanup?.(); pathname = next; index = 0; tracker(); }
  function click() { handlers.get("click")({ type: "click", target: new Element() }); }
  render("/en"); click(); assert.equal(sent.length, 0);
  render("/en/free-lesson"); render("/en/free-lesson"); assert.equal(sent.length, 1);
  click(); render("/en"); click(); render("/en/contact"); click();
  render("/en/teachers"); click(); assert.equal(sent.length, 4);
  render("/en/free-lesson"); assert.equal(sent.length, 5);
  refs = []; render("/en/free-lesson"); assert.equal(sent.length, 6);
  assert.equal(new Set(sent.map(event => event.sessionId)).size, 1);
  assert.equal(sent.filter(event => event.kind === "whatsapp").length, 3);
  assert.ok(sent.every(event => !event.campaignId));
  search = "campaign_id=cht";
  render("/en/free-lesson"); // Query-only navigation is tracked, too.
  assert.equal(sent.length, 7);
  render("/en/free-lesson"); assert.equal(sent.length, 7);
  click();
  search = "";
  render("/en"); click(); render("/en/contact"); click();
  refs = []; render("/en/contact"); click(); // Attribution survives reloads.
  assert.ok(sent.slice(6).every(event => event.campaignId === "cht"));
  assert.equal(sent.slice(6).filter(event => event.kind === "whatsapp").length, 4);
  storage.clear(); refs = []; search = "campaign_id=cht";
  render("/en"); search = ""; render("/en/free-lesson"); click();
  assert.equal(sent.at(-1).campaignId, undefined); // Only the lesson landing may set attribution.
  const filtered = analytics.summarizeLessonEvents(sent.map(event => ({ ...event, country: "GB", time: new Date().toISOString() })), "cht");
  assert.equal(filtered.countries[0].views, 1);
  assert.equal(filtered.countries[0].clicks, 4);
  storage.clear(); refs = []; search = "campaign_id=tr";
  const trStart = sent.length;
  render("/tr"); render("/tr");
  assert.equal(sent.length, trStart + 1); // No duplicate on effect replay.
  click(); search = ""; render("/tr/contact"); click();
  refs = []; render("/en/courses"); click();
  assert.ok(sent.slice(trStart).every(event => event.campaignId === "tr"));
  assert.equal(sent.slice(trStart).filter(event => event.kind === "visit").length, 1);
  assert.equal(sent.slice(trStart).filter(event => event.kind === "whatsapp").length, 3);
  search = "campaign_id=tr"; render("/en/courses");
  assert.equal(sent.at(-1).kind, "visit"); // Query-only campaign arrival.
  refs = []; render("/en/courses");
  assert.equal(sent.slice(trStart).filter(event => event.kind === "visit").length, 3);
  search = "campaign_id=cht"; render("/en/free-lesson"); click();
  assert.equal(sent.at(-1).campaignId, "cht");
  assert.equal(sent[trStart].campaignId, "tr"); // No retroactive reassignment.
  search = "campaign_id=tr"; render("/en/free-lesson"); click();
  assert.equal(sent.at(-1).campaignId, "tr");
  console.log("PASS: TR campaign landings on arbitrary pages, cross-page clicks, reloads, query-only navigation, campaign switching and separate filters.");
  console.log("PASS: campaign persistence, query-only landing, filtered counts, older records and campaign validation.");
  console.log("PASS: validation, authentication, concurrent storage, replay, country counts, timestamps, attribution, all three click paths, Strict Mode and reloads.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
