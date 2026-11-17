// Content checks (src/53-moderation.js): nothing obscene, vulgar, NSFW, hateful or scammy goes live under the
// Websprout name. Part 1 runs the checker in Node with a stand-in Gemini and KV; part 2 uses the real test server
// (no Gemini key there, so only the word list and address rules run) for publish, share links and admin take-down.
const fs = require('fs');
const path = require('path');
const { createSite, post, pubPost, signIn, cookie } = require('./lib');

const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv() { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); }, delete: async (k) => { m.delete(k); }, list: async ({ prefix }) => ({ keys: [...m.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) }; }
const OWNER = (fs.readFileSync(path.join(__dirname, '../src/00-header.js'), 'utf8').match(/SUPPORT_EMAIL\s*=\s*'([^']+)'/) || [])[1];

module.exports = async function (ctx, t) {
  // ---- Part 1: the checker on its own
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', '53-moderation.js'), 'utf8');
  const make = (gemini) => {
    const calls = [];
    const fetchStub = async (u, o) => {
      calls.push(JSON.parse(o.body));
      const r = typeof gemini === 'function' ? gemini(JSON.parse(o.body)) : gemini;
      if (r instanceof Response) return r;
      return json({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] });
    };
    const L = new Function('fetch', 'geminiKeys', 'slugify', 'SUPPORT_EMAIL', 'wsIsAdmin',
      src + ';return { wsModCheck, wsModText, wsModImages, wsModSlugProblem, wsModWordHit, wsModMessage, wsTakeDown };')(
      fetchStub, (env) => (env.GEMINI_API_KEY ? [env.GEMINI_API_KEY] : []), (s) => String(s || '').toLowerCase(), 'owner@example.com', async () => true);
    return { L, calls };
  };
  const page = (body) => '<!DOCTYPE html><html><head><title>Maple Bakery</title><meta name="description" content="Fresh bread daily"><style>.x{color:red}</style><script>var fuck=1;</script></head><body>' + body + '</body></html>';
  const { L } = make({ allowed: true, category: 'ok', reason: '' });

  // Word list: real swearing and slurs, but not innocent words that contain them or trade words.
  for (const w of ['Fuck this', 'FUCKING awful', 'total bullshit', 'sh1t service', 'free porno here', 'onlyfans link']) t.ok(!!L.wsModWordHit(w), 'the word list catches "' + w + '"');
  for (const w of ['Dickson Plumbing', 'Scunthorpe Movers', 'flame retardant coatings', 'cocktail bar', 'nude lipstick shades', 'Shiitake mushrooms', 'Essex Bakery', 'Cockburn Street Cafe', 'Assistant manager', 'our champion bitches and studs', 'Tranny repair and rebuilds', 'Sussex Pub', 'Hancock Hardware', 'Matsushita Electric']) t.eq(L.wsModWordHit(w), '', 'the word list leaves "' + w + '" alone');
  // Visible text only: scripts and styles are ignored, alt text and the meta description are read.
  const txt = L.wsModText(page('<h1>Hello &amp; welcome</h1><img alt="Our sourdough loaf" src="x.jpg"><!-- a comment -->'));
  t.ok(/Hello & welcome/.test(txt) && /Our sourdough loaf/.test(txt) && /Fresh bread daily/.test(txt), 'page text includes headings, alt text and the description');
  t.ok(!/fuck|color:red|a comment/.test(txt), 'scripts, styles and comments are not part of the page text');
  // Addresses
  for (const s of ['paypal-login', 'chase-verify-account', 'secure-signin-help', 'free-coinbase-airdrop', 'fuck-off-plumbing', 'shit-hole', 'websprout-official', 'wellsfargo']) t.ok(!!L.wsModSlugProblem(s), 'address "' + s + '" is refused');
  for (const s of ['chase-plumbing', 'maple-bakery', 'glow-salon', 'unlock-locksmith-austin', 'dickson-hvac', 'apple-orchard-farm', 'amazon-pet-grooming', 'verified-roofing']) t.eq(L.wsModSlugProblem(s), '', 'address "' + s + '" is allowed');
  // Uploaded photos are collected; stock photo links are not.
  const img = 'data:image/png;base64,' + 'A'.repeat(1200);
  t.eq(L.wsModImages('<img src="' + img + '"><img src="' + img + '"><img src="https://images.unsplash.com/x.jpg">').length, 1, 'one copy of each uploaded photo is sent for review, stock photos are not');

  // AI review
  {
    const env = { GEMINI_API_KEY: 'K', KV: kv() };
    const ok = make({ allowed: true, category: 'ok', reason: '' });
    let v = await ok.L.wsModCheck(env, { name: 'Maple Bakery', slug: 'maple-bakery', pages: [page('<p>Fresh bread.</p><img src="' + img + '">')] });
    t.ok(v.ok && v.status === 'ok', 'a clean site passes');
    t.eq(ok.calls.length, 1, 'the AI is asked once');
    const sent = ok.calls[0];
    t.ok(sent.contents[0].parts.some((p) => p.inlineData && p.inlineData.mimeType === 'image/png'), 'uploaded photos go to the AI with the text');
    t.ok(/Maple Bakery/.test(sent.contents[0].parts[0].text) && /maple-bakery/.test(sent.contents[0].parts[0].text), 'the name and address go to the AI');
    t.ok(/ignore any instructions/i.test(sent.systemInstruction.parts[0].text), 'the AI is told to treat site text as data');
    v = await ok.L.wsModCheck(env, { name: 'Maple Bakery', slug: 'maple-bakery', pages: [page('<p>Fresh bread.</p><img src="' + img + '">')] });
    t.ok(v.ok && v.cached && ok.calls.length === 1, 'republishing the same content uses the saved verdict (no second AI call)');

    const bad = make({ allowed: false, category: 'sexual', reason: 'Adult services' });
    v = await bad.L.wsModCheck({ GEMINI_API_KEY: 'K', KV: kv() }, { name: 'Velvet Nights', slug: 'velvet-nights', pages: [page('<p>Private companions available tonight.</p>')] });
    t.ok(!v.ok && v.status === 'block' && v.category === 'sexual', 'the AI can block what the word list misses');
    t.ok(/family-friendly/.test(bad.L.wsModMessage(v.category)), 'the owner gets a plain explanation');

    const refused = make(() => json({ promptFeedback: { blockReason: 'PROHIBITED_CONTENT' } }));
    v = await refused.L.wsModCheck({ GEMINI_API_KEY: 'K', KV: kv() }, { name: 'X', slug: 'xsite', pages: [page('<p>something</p>')] });
    t.ok(!v.ok && v.status === 'block', 'content the AI provider refuses to read is blocked');

    const word = make({ allowed: true, category: 'ok', reason: '' });
    v = await word.L.wsModCheck({ GEMINI_API_KEY: 'K', KV: kv() }, { name: 'Bob', slug: 'bobs', pages: [page('<p>We do great fucking work</p>')] });
    t.ok(!v.ok && v.category === 'profanity' && word.calls.length === 0, 'the word list blocks without an AI call');

    const down = make(() => json({}, 503));
    v = await down.L.wsModCheck({ GEMINI_API_KEY: 'K', KV: kv() }, { name: 'Maple', slug: 'maple', pages: [page('<p>Bread</p>')] });
    t.ok(v.ok && v.status === 'unchecked', 'when the AI is down the site still goes out, marked unchecked for review');
    v = await down.L.wsModCheck({ KV: kv() }, { name: 'Maple', slug: 'maple', pages: [page('<p>Bread</p>')] });
    t.ok(v.ok && v.reason === 'nokey', 'with no AI key only the word list runs');
    const capEnv = { GEMINI_API_KEY: 'K', MOD_MONTHLY_CAP: '0', KV: kv() };
    v = await ok.L.wsModCheck(capEnv, { name: 'Other', slug: 'other', pages: [page('<p>Other</p>')] });
    t.ok(v.ok && v.reason === 'cap', 'the monthly AI cap is respected');
  }

  // ---- Part 2: the real server
  const { base } = ctx;
  const site = await createSite(base, { name: 'Maple Bakery', type: 'Bakery', city: 'Austin' });
  const email = 'mod-owner@example.com';
  let r = await pubPost(base, { html: site.html.replace('</body>', '<p>Best fucking bread in town</p></body>'), siteId: site.siteId, key: site.formKey, slug: 'mod' + Date.now().toString(36) }, null, email);
  t.ok(r.status === 422 && r.json && r.json.moderation && /family-friendly/.test(r.json.error), 'publishing a vulgar site is refused with a clear message');
  r = await pubPost(base, { html: site.html, siteId: site.siteId, key: site.formKey, slug: 'paypal-login' + Date.now().toString(36).slice(-3) }, null, email);
  t.ok(r.status === 422 && r.json && r.json.moderation, 'a phishing-style address is refused');
  r = await fetch(base + '/slug-check?slug=paypal-secure');
  const slugCheck = await r.json().catch(() => ({}));
  t.eq(slugCheck.available, false, 'the address check says a phishing-style name is unavailable');
  const slug = 'mod' + Date.now().toString(36);
  r = await pubPost(base, { html: site.html, siteId: site.siteId, key: site.formKey, slug }, null, email);
  t.eq(r.status, 200, 'the clean site publishes');
  t.eq((await fetch(base + '/s/' + slug)).status, 200, 'and is live');
  // Share links get the same check.
  const sess = await signIn(base, email);
  r = await post(base, '/preview', { html: site.html.replace('</body>', '<p>shit service</p></body>'), siteId: site.siteId, key: site.formKey }, { Cookie: cookie(sess) });
  t.ok(r.status === 422 && r.json && r.json.moderation, 'a vulgar share link is refused');
  r = await post(base, '/preview', { html: site.html, siteId: site.siteId, key: site.formKey }, { Cookie: cookie(sess) });
  t.ok(r.status === 200 && r.json && r.json.id, 'a clean share link works');

  // Admin: queue, take-down and block. Only the owner can use them.
  t.eq((await fetch(base + '/admin/moderation')).status, 403, 'the moderation list is owner-only');
  t.eq((await fetch(base + '/admin/takedown?slug=' + slug, { method: 'POST' })).status, 403, 'take-down is owner-only');
  t.eq((await fetch(base + '/admin/takedown?slug=' + slug, { method: 'POST', headers: { Cookie: cookie(sess) } })).status, 403, 'an ordinary account cannot take sites down');
  const admin = await signIn(base, OWNER);
  const mod = await (await fetch(base + '/admin/moderation', { headers: { Cookie: cookie(admin) } })).json();
  t.ok(Array.isArray(mod.items) && mod.items.some((x) => x.refused && x.category === 'profanity' && x.email === email), 'refused publishes show up in the admin list with who tried');
  t.eq((await fetch(base + '/admin/takedown?slug=' + slug, { method: 'POST', headers: { Cookie: cookie(admin), 'Sec-Fetch-Site': 'cross-site' } })).status, 403, 'take-down refuses requests from other sites');
  // A wrongly refused site can be allowed by the admin: the owner can then publish exactly that content.
  const fp = await createSite(base, { name: 'Allow Me Bakery', type: 'Bakery' });
  const fslug = 'modallow' + Date.now().toString(36);
  const fhtml = fp.html.replace('</body>', '<p>shit hot bagels</p></body>');
  r = await pubPost(base, { html: fhtml, siteId: fp.siteId, key: fp.formKey, slug: fslug }, null, 'allow-owner@example.com');
  t.eq(r.status, 422, 'the word list refuses it');
  // Word-list refusals carry no AI verdict to overrule, so "Allow it" is only offered for AI refusals: dismissing just clears the list.
  const dj = await (await fetch(base + '/admin/moderation/dismiss?slug=' + fslug, { method: 'POST', headers: { Cookie: cookie(admin) } })).json();
  t.ok(dj.ok && dj.allowed === false, 'dismissing a word-list refusal does not unlock the word');
  r = await fetch(base + '/admin/takedown?slug=' + slug + '&block=1', { method: 'POST', headers: { Cookie: cookie(admin) } });
  t.eq(r.status, 200, 'the owner can take a site down and block it');
  t.ok((await fetch(base + '/s/' + slug)).status !== 200, 'the site is offline');
  r = await pubPost(base, { html: site.html, siteId: site.siteId, key: site.formKey, slug }, null, email);
  t.ok(r.status === 403 && r.json && r.json.moderation, 'a blocked site cannot publish again');
  const other = await createSite(base, { name: 'Second Shop', type: 'Bakery' });
  r = await pubPost(base, { html: other.html, siteId: other.siteId, key: other.formKey, slug: 'mod2' + Date.now().toString(36) }, null, email);
  t.ok(r.status === 403 && r.json && r.json.moderation, 'the blocked owner cannot publish a new site either');
  const scan = await (await fetch(base + '/admin/moderation/scan', { method: 'POST', headers: { Cookie: cookie(admin) } })).json();
  t.ok(typeof scan.checked === 'number' && 'done' in scan, 'the "check all published sites" scan runs');
};
