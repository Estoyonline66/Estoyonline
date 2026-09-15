import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "parse5";

// Runs against either the local production build or the deployed domain.
// It deliberately never executes page JavaScript, like a text-only crawler.
const base = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const origin = "https://estoyonline.es";
const routes = ["", "/courses", "/teachers", "/videos", "/price", "/contact", "/freecourse"];
const normalize = (value) => value.replace(/\s+/g, " ").trim();

function inspect(html) {
  const result = { title: [], meta: [], links: [], scripts: [], headings: [], images: [], text: [], lang: undefined };
  function text(node) {
    if (node.nodeName === "#text") return node.value;
    if (["script", "style", "head"].includes(node.tagName)) return "";
    return (node.childNodes || []).map(text).join(" ");
  }
  function walk(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
    if (node.tagName === "html") result.lang = attrs.lang;
    if (node.tagName === "title") result.title.push(text(node));
    if (node.tagName === "h1") result.headings.push(normalize(text(node)));
    if (node.tagName === "img") result.images.push(attrs);
    if (node.tagName === "meta") result.meta.push(attrs);
    if (node.tagName === "link") result.links.push(attrs);
    if (node.tagName === "script" && attrs.type === "application/ld+json") {
      result.scripts.push(JSON.parse(node.childNodes.map((child) => child.value || "").join("")));
    }
    if (node.tagName === "body") result.text.push(text(node));
    for (const child of node.childNodes || []) walk(child);
  }
  walk(parse(html));
  result.text = normalize(result.text.join(" "));
  return result;
}

async function request(path, headers = {}) {
  return fetch(`${base}${path}`, { headers, redirect: "manual", signal: AbortSignal.timeout(120000) });
}

for (const locale of ["en", "tr"]) {
  const data = JSON.parse(readFileSync(new URL(`../public/locales/${locale}.json`, import.meta.url), "utf8"));
  for (const route of routes) {
    const path = `/${locale}${route}`;
    const response = await request(path, { "User-Agent": "OAI-SearchBot/1.0" });
    assert.equal(response.status, 200, `${path}: HTTP status`);
    assert.equal(response.headers.get("content-language"), locale, `${path}: Content-Language`);
    const page = inspect(await response.text());
    assert.equal(page.lang, locale, `${path}: HTML language`);
    assert.equal(page.title.length, 1, `${path}: exactly one title`);
    assert.equal(page.headings.length, 1, `${path}: exactly one H1`);
    assert.ok(page.headings[0], `${path}: non-empty H1`);
    assert.ok(page.images.every((image) => Object.hasOwn(image, "alt")), `${path}: every image has an alt attribute`);
    assert.equal(page.meta.filter((meta) => meta.name === "description").length, 1, `${path}: exactly one description`);
    const robots = page.meta.filter((meta) => meta.name === "robots").map((meta) => meta.content).join(",");
    assert.match(robots, /\bindex\b/, `${path}: indexable`);
    assert.doesNotMatch(robots, /noindex|nofollow|nosnippet/, `${path}: no conflicting restrictions`);
    assert.match(robots, /max-snippet:-1/, `${path}: unrestricted text preview`);
    assert.deepEqual(page.links.filter((link) => link.rel === "canonical").map((link) => link.href), [`${origin}${path}`]);
    for (const language of ["en", "tr", "x-default"]) {
      assert.equal(page.links.find((link) => link.hreflang === language)?.href, `${origin}/${language === "x-default" ? "en" : language}${route}`, `${path}: ${language} alternate`);
    }
    assert.equal(page.scripts.length, 1, `${path}: one JSON-LD graph`);
    const graph = page.scripts[0]["@graph"];
    assert.equal(graph.find((item) => item["@id"] === `${origin}${path}#webpage`)?.inLanguage, locale);
    const includes = (value) => assert.ok(page.text.includes(normalize(value)), `${path}: missing body text: ${value.slice(0, 90)}`);
    for (const label of Object.keys(data.navbar.links)) includes(label);
    if (!route) {
      const description = page.meta.find((meta) => meta.name === "description").content;
      assert.ok(description.length >= 120 && description.length <= 160, `${path}: concise homepage search description`);
      assert.equal(page.headings[0], normalize(`${data.home.HeroTitle} ${data.home.HeroYellowTitle} ${data.home.HeroTitle2}`), `${path}: preserve visible headline`);
      for (const key of ["HeroTitle", "HeroYellowTitle", "HeroTitle2", "LearnSpanishtitle", "LearnSpanishdescription", "homeAboutDescription", "homeAboutDescription2", "homeSubAboutTitle"]) includes(data.home[key]);
      for (const item of data.testimonials.items) { includes(item.personName); includes(item.firstComment); }
    }
    if (route === "/courses") {
      for (const item of data.courses.accordionData) {
        includes(item.title);
        for (const section of item.content) { includes(section.contentTitle); includes(section.contentDescription); }
      }
      for (const level of data.courses.levels) includes(level.title);
      assert.ok(page.text.includes(data.courses.cardCourses[0].lesson), `${path}: server-rendered schedule`);
    }
    if (route === "/teachers") for (const teacher of data.teachers.teacher) { includes(teacher.name); includes(teacher.about); }
    if (route === "/videos") for (const video of data.videos.videos) { includes(video.title); includes(video.description); }
    if (route === "/price") {
      for (const rows of Object.values(data.price.courses)) {
        for (const row of rows) for (const value of Object.values(row)) if (typeof value === "string" && value) includes(value);
      }
    }
    if (route === "/contact") { includes(data.contact.contactDescription); includes(data.contact.officeAddressDescription); }
    if (route === "/freecourse") includes("Free Online Spanish Course");
    console.log(`PASS ${path}: language, metadata, links, JSON-LD and HTML content`);
  }
}

const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
assert.equal((sitemap.match(/<loc>/g) || []).length, 14);
for (const locale of ["en", "tr"]) for (const route of routes) assert.ok(sitemap.includes(`<loc>${origin}/${locale}${route}</loc>`));
assert.doesNotMatch(sitemap, /payment|_res|studio|Organizarcourses|lastmod/);
assert.equal((sitemap.match(/hreflang="tr"/g) || []).length, 14);
console.log("PASS bilingual sitemap: 14 canonical pages with reciprocal alternates");

const robotsResponse = await request("/robots.txt");
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \/\s/);
assert.doesNotMatch(robots, /Disallow: \/(?:en|tr|_next)\b/);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const llms = await request("/llms.txt");
assert.equal(llms.status, 200);
assert.match(llms.headers.get("content-type"), /text\/plain.*charset=utf-8/);
const guide = await llms.text();
assert.ok(guide.includes("## Türkçe") && guide.includes("## English"));
console.log("PASS robots.txt and bilingual llms.txt");

// These requests never fetch application results or submit a form.
for (const path of ["/en/payment", "/tr/payment", "/tr/Organizarcourses342X", "/en/does-not-exist", "/fr/courses"]) {
  const response = await request(path);
  const page = inspect(await response.text());
  if (path.includes("does-not-exist") || path.startsWith("/fr")) assert.equal(response.status, 404);
  assert.ok(page.meta.some((meta) => meta.name === "robots" && meta.content.includes("noindex")), `${path}: noindex`);
}
for (const cookie of ["", "language=tr", "language=invalid"]) {
  const response = await request("/?g=1", cookie ? { Cookie: cookie } : {});
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")).pathname, cookie === "language=tr" ? "/tr" : "/en");
  assert.equal(new URL(response.headers.get("location")).search, "?g=1");
}
console.log("PASS private/invalid routes and locale redirects");

const bodies = [];
for (const agent of ["Mozilla/5.0", "Googlebot", "GPTBot", "ClaudeBot", "PerplexityBot"]) {
  const response = await request("/tr", { "User-Agent": agent });
  assert.equal(response.status, 200, agent);
  bodies.push(inspect(await response.text()).text);
}
assert.ok(bodies.every((body) => body === bodies[0]), "Crawlers and visitors receive the same content");
console.log("PASS identical page text for visitors, Googlebot, GPTBot, ClaudeBot and PerplexityBot");
