const lib = require('./lib');
// Analytics: browser events are allowlisted, events land in local D1 (server-side landing, generation, first edit,
// publish, leads, published-site views), attribution and insight thresholds, and no response ever sets a cookie.
const fs = require('fs');
const path = require('path');
const { post, createSite, waitFor } = require('./lib');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 an' + Date.now();
const nav = (extra) => Object.assign({ 'User-Agent': UA, 'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate', Accept: 'text/html' }, extra || {});
const src45 = fs.readFileSync(path.join(__dirname, '../src/45-admin.js'), 'utf8');
const slice = (a, b) => src45.slice(src45.indexOf(a), src45.indexOf(b));

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const q = async (sql, args) => ((await post(base, '/__test/analytics', { query: { sql, args: args || [] } })).json || {}).rows || [];
  const cookies = [];
  const noCookie = (r, what) => { cookies.push(what); t.ok(!r.headers.get('set-cookie'), 'no cookie set by ' + what); };

  let r = await post(base, '/track', { event: 'visit', url: base + '/' });
  t.ok(r.json && r.json.ok === true, 'landing visits are tracked');
  noCookie(r, '/track');
  r = await post(base, '/track', { event: 'first_edit' });
  t.ok(r.json && r.json.ok === true, 'first edit is tracked');
  r = await post(base, '/track', { event: 'pro_start' });
  t.ok(r.json && r.json.ok === false, 'server-only funnel steps cannot be posted from outside');
  r = await post(base, '/track', { event: 'generate' });
  t.ok(r.json && r.json.ok === false, 'generation cannot be posted from outside');
  r = await post(base, '/track', { event: 'x'.repeat(500) });
  t.ok(r.json && r.json.ok === false, 'unknown events are ignored');
  t.eq((await fetch(base + '/admin/funnel?days=7')).status, 403, 'the funnel is owner-only');

  // Server-side landing with UTM attribution, one row per visit (a reload is not a new visit), bots ignored.
  let g = await fetch(base + '/for/plumber?utm_source=testnews&utm_medium=email&utm_campaign=fall26', { headers: nav() });
  noCookie(g, 'a /for/ landing page');
  await waitFor(async () => (await q("SELECT COUNT(*) n FROM events WHERE type = 'landing' AND campaign = 'fall26'"))[0].n >= 1, 8000);
  g = await fetch(base + '/for/plumber?utm_source=testnews&utm_medium=email&utm_campaign=fall26', { headers: nav() });
  await new Promise((res) => setTimeout(res, 700));
  await fetch(base + '/?utm_source=botcheck', { headers: nav({ 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }) });
  const g2 = await fetch(base + '/', { headers: nav({ 'User-Agent': UA + 'g', Referer: 'https://www.google.com/' }) });
  noCookie(g2, 'the landing page');
  const land = await waitFor(async () => (await q("SELECT COUNT(*) n FROM events WHERE type = 'landing' AND campaign = 'fall26'"))[0].n >= 1, 8000);
  const lr = await q("SELECT source, medium, campaign, landing, device, visitor, country FROM events WHERE type = 'landing' AND campaign = 'fall26'");
  t.ok(land && lr.length === 1, 'landing written to D1 once per visit (' + lr.length + ' rows)');
  t.ok(lr[0] && lr[0].source === 'testnews' && lr[0].medium === 'email' && lr[0].landing === '/for/plumber' && lr[0].device === 'desktop', 'landing carries source / medium / campaign / landing path / device');
  t.ok(lr[0] && /^[0-9a-f]{16}$/.test(lr[0].visitor || ''), 'visitor is a short salted hash, never an IP');
  await waitFor(async () => (await q("SELECT COUNT(*) n FROM events WHERE type = 'landing' AND referrer = 'google.com'"))[0].n >= 1, 5000);
  const gr = await q("SELECT source, medium FROM events WHERE type = 'landing' AND referrer = 'google.com' ORDER BY id DESC LIMIT 1");
  t.ok(gr[0] && gr[0].source === 'google' && gr[0].medium === 'organic', 'search referrer becomes google / organic');
  t.eq((await q("SELECT COUNT(*) n FROM events WHERE source = 'botcheck'"))[0].n, 0, 'bots are not counted');
  r = await post(base, '/track', { event: 'setup_start', step: 'name' }, { 'User-Agent': UA });
  t.ok(r.json && r.json.ok === true, 'setup start is accepted');

  // Generation (same visitor) inherits the landing attribution; the first edit is linked to that site.
  const cr = await post(base, '/create', { name: 'Analytics Pipes', type: 'Plumber', city: 'Austin', look: 'dark' }, { 'User-Agent': UA });
  noCookie(cr, '/create');
  const site = cr.json || {};
  t.ok(!!site.siteId, 'site generated');
  await waitFor(async () => (await q('SELECT COUNT(*) n FROM sites WHERE site_id = ?', [site.siteId]))[0].n === 1, 8000);
  const sr = (await q('SELECT * FROM sites WHERE site_id = ?', [site.siteId]))[0] || {};
  t.ok(sr.biz_type === 'plumber' && sr.category && sr.category !== '' && sr.look === 'dark' && sr.gen_ms > 0, 'generate records type, category, look and duration (' + sr.category + ')');
  t.eq([sr.source, sr.campaign, sr.landing].join('|'), 'testnews|fall26|/for/plumber', 'generated site inherits the visit attribution');
  const ge = (await q("SELECT props FROM events WHERE type = 'generate' AND site_id = ?", [site.siteId]))[0];
  t.ok(ge && JSON.parse(ge.props).google === 0, 'generate event notes whether a Google listing was linked');
  await post(base, '/track', { event: 'first_edit', url: base + '/' }, { 'User-Agent': UA });
  t.ok(await waitFor(async () => !!((await q('SELECT first_edit_ts FROM sites WHERE site_id = ?', [site.siteId]))[0] || {}).first_edit_ts, 6000), 'first edit is linked to the visitor’s site');
  r = await post(base, '/track', { event: 'launch_check', issues: 3, kinds: ['missing phone', 'no photo<script>'] }, { 'User-Agent': UA });
  await waitFor(async () => (await q("SELECT COUNT(*) n FROM events WHERE type = 'launch_check'"))[0].n >= 1, 5000);
  const lc = JSON.parse(((await q("SELECT props FROM events WHERE type = 'launch_check' ORDER BY id DESC LIMIT 1"))[0] || {}).props || '{}');
  t.ok(lc.issues === 3 && lc.kinds.join(',') === 'missing phone,no photoscript', 'launch-check problems are recorded and sanitised');

  // Publish -> publish event + published_ts; published site sets no cookie; views + leads are counted.
  const slug = 'antest' + Date.now().toString(36).slice(-5);
  const pr = await lib.pubPost(base, { html: site.html, siteId: site.siteId, key: site.formKey, slug: slug }, { 'User-Agent': UA });
  t.ok(pr.json && pr.json.ok, 'site published');
  t.ok(await waitFor(async () => !!((await q('SELECT published_ts FROM sites WHERE site_id = ?', [site.siteId]))[0] || {}).published_ts, 6000), 'publish is recorded on the site');
  const ps = await fetch(base + '/', { headers: { 'x-ws-test-host': slug + '.websprout.app', 'User-Agent': UA } });
  t.eq(ps.status, 200, 'published site is served');
  noCookie(ps, 'a published site');
  for (let i = 0; i < 3; i++) { const h = await post(base, '/api/hit', { site: site.siteId }); if (!i) noCookie(h, '/api/hit'); }
  await waitFor(async () => ((await q("SELECT n FROM daily WHERE metric = 'site_views' AND dim = ?", [site.siteId]))[0] || {}).n >= 3, 6000);
  const vw = await (await fetch(base + '/api/views?site=' + site.siteId + '&key=' + encodeURIComponent(site.formKey))).json();
  t.ok(vw.today >= 3 && vw.total >= 3, 'published-site views come from D1 counters (' + vw.today + ')');
  const fr = await post(base, '/api/form/' + site.siteId, { name: 'Ana', message: 'Leaky tap' });
  noCookie(fr, 'a site form submission');
  t.ok(await waitFor(async () => (await q("SELECT COUNT(*) n FROM events WHERE type = 'lead' AND site_id = ?", [site.siteId]))[0].n === 1, 6000), 'form submission becomes a lead event');
  t.ok(cookies.length >= 7, 'cookie checks covered landing, /track, published site and more');

  // Site errors: reported, grouped for the owner, clearing is owner-only
  r = await post(base, '/api/clientlog', { msg: 'TypeError: x is undefined at 12', where: 'published', url: 'https://glow.websprout.app/about' });
  t.ok(r.json && r.json.ok === true, 'published sites can report errors');
  t.eq((await post(base, '/admin/errors/clear', {})).status, 403, 'clearing errors is owner-only');
  const group = new Function(slice('function groupClientErrors', 'async function doAdminErrorsClear') + ';return groupClientErrors;')();
  const now = Date.now();
  const gg = group([
    { ts: now - 1000, msg: 'TypeError: a is undefined at 12', where: 'published', url: 'https://glow.websprout.app/' },
    { ts: now - 2000, msg: 'TypeError: a is undefined at 15', where: 'published', url: 'https://bake.websprout.app/menu' },
    { ts: now - 3 * 86400000, msg: 'TypeError: a is undefined at 9', where: 'published', url: 'https://glow.websprout.app/' },
    { ts: now - 5000, msg: 'Other', where: 'editor', url: 'not a url' },
  ]);
  t.eq(gg.length, 2, 'errors that differ only by numbers are grouped');
  t.eq([gg[0].count, gg[0].last24, gg[0].sites.join(',')].join('|'), '3|2|glow.websprout.app,bake.websprout.app', 'groups count hits and list affected sites');

  // Attribution rules (pure function).
  const attr = new Function(slice('function wsLandingPath', 'function wsCount') .replace(/\/\/ Counters[^\n]*\n?$/, '') + ';return wsAttribution;')();
  const A = (u, rf, ua) => { const o = attr(u, rf, ua || ''); return [o.source, o.medium, o.campaign || '', o.landing].join('|'); };
  t.eq(A('https://websprout.app/?utm_source=FB&utm_medium=paid&utm_campaign=Spring', ''), 'fb|paid|spring|/', 'UTM tags win');
  t.eq(A('https://websprout.app/for/bakery?gclid=x', 'https://www.google.com/'), 'google|cpc||/for/bakery', 'Google Ads click id');
  t.eq(A('https://websprout.app/?fbclid=x', '', 'Mozilla Instagram 300'), 'instagram|social||/', 'fbclid inside Instagram');
  t.eq(A('https://websprout.app/', 'https://l.instagram.com/'), 'instagram|social||/', 'referrer host mapping');
  t.eq(A('https://websprout.app/', 'https://chatgpt.com/'), 'chatgpt|ai||/', 'AI assistants are their own medium');
  t.eq(A('https://websprout.app/example', 'https://blog.example.org/post'), 'blog.example.org|referral||/example', 'unknown referrers are referrals');
  t.eq(A('https://websprout.app/', ''), 'direct|(none)||/', 'no referrer = direct');
  t.ok(attr('https://websprout.app/', 'https://websprout.app/for/x').internal, 'own pages are internal, not a source');

  // Insight thresholds: the same rates on tiny samples produce no type insights.
  const assemble = new Function(slice('function wsAssemble', 'async function doAdminAnalytics') + ';return wsAssemble;')();
  const mk = (n, perType) => { const sites = []; for (let i = 0; i < n; i++) { const ty = ['plumber', 'bakery', 'florist'][i % 3]; sites.push({ created_ts: Date.parse('2025-03-10T10:00:00Z'), biz_type: ty, category: ty, published_ts: (ty === 'bakery' || (ty === 'florist' && i % 2)) ? 1 : null, source: 'direct' }); } return { days: 30, S: '2025-03-01', E: '2025-03-30', PS: '2025-01-30', PE: '2025-02-28', sites, events: [], visitors: [], acq: [], setup: [], fails: [], launch: [], store: [], leadsBySite: [], viewsBySite: [], snaps: [], sitesActive: [], owners: [], cohort: [], counters: [], proBySource: [], hasSetupHook: false }; };
  const small = assemble(mk(12), {}).insights.map((x) => x.text).join('\n');
  t.ok(!/Plumber sites publish/.test(small), 'no type insight below the minimum sample (4 per type)');
  const big = assemble(mk(60), {});
  t.ok(/Plumber sites publish at 0% vs/.test(big.insights.map((x) => x.text).join('\n')), 'type insight appears once the sample is large enough');
  t.ok(big.business.types.find((x) => x.key === 'plumber').under === true, 'underperformer flag needs >= 8 sites');
  t.eq(big.funnel.steps[1].n, null, 'setup step is n/a until the editor sends setup_start');
  const ins = new Function(slice('function wsInsights', 'async function doAdminAnalytics') + ';return wsInsights;')();
  t.eq(ins({ costs: { gphotoUsed: 700, gphotoCap: 900, unsplashEstHour: 10, emailToday: 3 } }).length, 0, 'cost insights stay quiet below 80%');
  t.ok(/Google photo cap 89% used/.test(ins({ costs: { gphotoUsed: 800, gphotoCap: 900 } }).map((x) => x.text).join()), 'Google photo cap warning at 80%+');
  t.ok(/2 paying Pro customers haven’t been active/.test(ins({ churnRisk: 2 }).map((x) => x.text).join()), 'churn-risk insight');

  // The migration file and the schema the worker creates lazily must match.
  const mig = fs.readFileSync(path.join(__dirname, '../migrations/0001_analytics.sql'), 'utf8').replace(/--[^\n]*/g, '').split(';').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const schema = new Function(slice('const WS_SCHEMA', '// Request -> ctx') + ';return WS_SCHEMA;')().map((s) => s.replace(/\s+/g, ' ').trim());
  t.eq(JSON.stringify(mig), JSON.stringify(schema), 'migrations/0001_analytics.sql matches WS_SCHEMA');
};
