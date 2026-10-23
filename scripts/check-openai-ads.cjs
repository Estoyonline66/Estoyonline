// Isolated browser mocks: no Pixel requests or real conversion events.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync('components/OpenAIAdsTracker.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
let states = [], index = 0, effects = [], cleanups = [], pathname = '/tr';
const handlers = new Map(), storage = new Map(), scripts = [];
global.window = { location: { href: 'https://estoyonline.es/tr?oppref=test' } };
global.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v) };
global.document = {
  createElement: () => ({}), head: { appendChild: s => scripts.push(s) },
  addEventListener: (n, cb) => handlers.set(n, cb), removeEventListener: n => handlers.delete(n),
};
global.Element = class { constructor(href) { this.href = href; } closest() { return { getAttribute: () => this.href }; } };
const mod = { exports: {} };
new Function('require','module','exports',code)(name => {
  if (name === 'react') return {
    useState: initial => { const i = index++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; },
    useEffect: fn => effects.push(fn),
  };
  if (name === 'next/navigation') return { usePathname: () => pathname };
  return require(name);
}, mod, mod.exports);
function render() {
  cleanups.forEach(fn => fn?.()); index = 0; effects = [];
  const tree = mod.exports.default(); cleanups = effects.map(fn => fn()); return tree;
}
function click(href, type='click', button=0) { handlers.get(type)?.({ type, button, target: new Element(href) }); }
render(); render();
assert.equal(scripts.length, 0, 'Do not load SDK before consent');
states[0] = false; render(); assert.equal(scripts.length, 0);
states[0] = true; render();
assert.equal(scripts.length, 1);
const events = () => window.oaiq.q.filter(x => x[0] === 'measure');
click('https://wa.me/123');
assert.equal(events().length, 1);
assert.deepEqual(events()[0], ['measure','lead_created',{type:'customer_action'}]);
click('https://wa.me.evil.example/123'); click('https://example.com');
click('https://wa.me/123', 'auxclick', 2);
assert.equal(events().length, 1);
pathname = '/en/contact'; render(); click('https://api.whatsapp.com/send?phone=123');
render(); click('whatsapp://send?phone=123');
assert.equal(events().length, 3, 'Cross-page clicks and effect replay must not duplicate events');
assert.equal(scripts.length, 1);
states[0] = false; render(); click('https://wa.me/123');
assert.equal(events().length, 3, 'Revoked consent stops conversion tracking');
states[0] = true; pathname = '/admin'; render(); click('https://wa.me/123');
assert.equal(events().length, 3);
console.log('PASS: consent, single SDK load, cross-page tracking, WhatsApp URL validation, effect replay, withdrawal and non-public routes.');
