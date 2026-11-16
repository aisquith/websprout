// Admin dashboard: owner-only endpoints, funnel / aggregate maths and insights on seeded D1 data (an old date window
// no other test touches), the page renders without errors on desktop and phone, and the daily job's retention cleanup.
const fs = require('fs');
const path = require('path');
const { post, openPage, sleep, waitFor, signIn, cookie, browserCookie } = require('./lib');

const OWNER = (fs.readFileSync(path.join(__dirname, '../src/00-header.js'), 'utf8').match(/SUPPORT_EMAIL\s*=\s*'([^']+)'/) || [])[1];
const get = (base, p, sess) => fetch(base + p, { headers: sess ? { Cookie: cookie(sess) } : {} });
const ts = (day, h) => Date.parse(day + 'T' + String(h || 12).padStart(2, '0') + ':00:00Z');
const dayAdd = (day, n) => new Date(Date.parse(day + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);

// Window 2025-03-01..2025-03-30 (30 days), previous 2025-01-30..2025-02-28.
function seed() {
  const events = [], sites = [], activity = [];
  const S = '2025-03-01', P = '2025-01-30';
  const ev = (o) => events.push(Object.assign({ props: null }, o));
  let v = 0;
  // Visitors: instagram 80, facebook 80, direct 100 (current); 130 in the previous period.
  [['instagram', 'social', 80], ['facebook', 'social', 80], ['direct', '(none)', 100]].forEach(([src, med, n]) => {
    for (let i = 0; i < n; i++) { const d = dayAdd(S, i % 30), vis = 'v' + (v++); ev({ ts: ts(d), day: d, type: 'landing', visitor: vis, source: src, medium: med, landing: i % 4 ? '/' : '/for/plumber', campaign: src === 'instagram' && i < 40 ? 'spring' : null });
      if (i < Math.round(n * 150 / 260)) ev({ ts: ts(d) + 60000, day: d, type: 'setup_start', visitor: vis, source: src, medium: med }); }
  });
  for (let i = 0; i < 130; i++) { const d = dayAdd(P, i % 30); ev({ ts: ts(d), day: d, type: 'landing', visitor: 'p' + i, source: 'direct', medium: '(none)', landing: '/' }); }
  // 60 sites: 20 plumbers (2 published), 20 bakeries (12 published), 20 generic (6 published).
  const plan = [];
  for (let i = 0; i < 20; i++) plan.push(['plumber', 'trades', i < 2]);
  for (let i = 0; i < 20; i++) plan.push(['bakery', 'food', i < 12]);
  for (let i = 0; i < 20; i++) plan.push([i < 8 ? 'dog groomer' : i < 14 ? 'axe throwing' : 'misc', 'generic', i < 6]);
  plan.forEach(([type, cat, pub], i) => {
    const d = dayAdd(S, i % 30), c = ts(d, 10), src = i % 6 < 3 ? 'instagram' : i % 6 === 3 ? 'facebook' : 'direct';
    const sid = 'wsseed' + i;
    sites.push({ site_id: sid, created_ts: c, biz_type: type, category: cat, look: 'light', google: i % 2, shop: 0, gen_ms: 2000 + i * 100, source: src, medium: src === 'direct' ? '(none)' : 'social', landing: '/', device: i % 3 ? 'desktop' : 'mobile',
      first_edit_ts: i < 34 || pub ? c + 60000 : null, account_ts: pub || (i >= 46 && i < 56) ? c + 120000 : null, published_ts: pub ? c + 3 * 3600000 : null, pro_ts: pub && i % 7 === 0 ? c + 86400000 : null });
    ev({ ts: c, day: d, type: 'generate', visitor: 'g' + i, site_id: sid, biz_type: type, category: cat, source: src, props: JSON.stringify({ ms: 2000 }) });
  });
  for (let i = 0; i < 30; i++) { const d = dayAdd(P, i); ev({ ts: ts(d), day: d, type: 'generate', site_id: 'wsprev' + i }); sites.push({ site_id: 'wsprev' + i, created_ts: ts(d), category: 'food', biz_type: 'bakery', published_ts: i < 6 ? ts(d) + 1000 : null }); }
  for (let i = 0; i < 3; i++) ev({ ts: ts(dayAdd(S, 5 + i)), day: dayAdd(S, 5 + i), type: 'pro_start', email: 'pro' + i + '@seed.test' });
  ev({ ts: ts(dayAdd(S, 20)), day: dayAdd(S, 20), type: 'pro_cancel', email: 'pro0@seed.test' });
  for (let i = 0; i < 7; i++) ev({ ts: ts(dayAdd(S, i)), day: dayAdd(S, i), type: 'lead', site_id: 'wsseed' + (20 + i) });
  for (let i = 0; i < 4; i++) ev({ ts: ts(dayAdd(S, i)), day: dayAdd(S, i), type: 'generate_fail', props: JSON.stringify({ err: 'Gemini timeout' }) });
  ev({ ts: ts(dayAdd(S, 3)), day: dayAdd(S, 3), type: 'store_checkout', site_id: 'wsseed21', props: JSON.stringify({ amount: 2500, fee: 50 }) });
  // Cohort: 10 sign-ups on Mon 2025-02-17; 4 back in week 1, 2 back in week 4.
  for (let i = 0; i < 10; i++) { const em = 'c' + i + '@seed.test'; ev({ ts: ts('2025-02-17'), day: '2025-02-17', type: 'signup', email: em }); activity.push({ k: 'u:' + em, day: '2025-02-17' });
    if (i < 4) activity.push({ k: 'u:' + em, day: '2025-02-25' }); if (i < 2) activity.push({ k: 'u:' + em, day: '2025-03-18' }); }
  return { events, sites, activity };
}

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  t.ok(!!OWNER, 'owner email found in src/00-header.js');
  // 1) Every admin endpoint refuses visitors and ordinary accounts.
  const user = await signIn(base, 'not-the-owner@example.com');
  t.ok(!!user, 'an ordinary account can sign in');
  for (const p of ['/admin', '/admin/data', '/admin/analytics?days=30', '/admin/activity', '/admin/funnel', '/admin/customer?email=x@y.z', '/admin/grant?email=x@y.z&plan=pro']) {
    t.eq((await get(base, p)).status, 403, p + ' rejects signed-out visitors');
    t.eq((await get(base, p, user)).status, 403, p + ' rejects non-admin accounts');
  }
  const owner = await signIn(base, OWNER);
  t.ok(!!owner, 'the owner can sign in');

  // 2) Seed the old window and check the maths.
  const s = seed();
  const sr = await post(base, '/__test/analytics', s);
  t.ok(sr.json && sr.json.ok && sr.json.inserted === s.events.length + s.sites.length + s.activity.length, 'seed rows inserted into local D1');
  const a = await (await get(base, '/admin/analytics?days=30&end=2025-03-30', owner)).json();
  t.ok(a && a.kpis && !a.error, 'analytics endpoint answers for the owner' + (a && a.error ? ': ' + a.error : ''));
  if (!a || !a.kpis) return;
  const K = {}; a.kpis.forEach((k) => { K[k.id] = k; });
  t.eq([a.range.start, a.range.end, a.range.prevStart, a.range.prevEnd].join(' '), '2025-03-01 2025-03-30 2025-01-30 2025-02-28', 'range and comparison period');
  t.eq([K.visitors.value, K.visitors.prev, K.visitors.delta].join('|'), '260|130|100', 'visitors with trend vs previous period');
  t.eq([K.generated.value, K.generated.prev, K.generated.delta].join('|'), '60|30|100', 'sites generated with trend');
  t.eq([K.publishRate.value, K.publishRate.prev].join('|'), '33.3|20', 'publish rate (current vs previous cohort)');
  t.eq([K.newPro.value, K.churn.value, K.leads.value].join('|'), '3|1|7', 'new Pro, cancellations and leads');
  t.eq(K.visitors.spark.length, 30, 'one sparkline point per day');
  const f = a.funnel.steps.map((x) => x.n).join(',');
  t.eq(f, '260,150,60,40,30,20,' + a.funnel.steps[6].n, 'funnel step counts');
  t.eq([a.funnel.steps[2].conv, a.funnel.steps[2].drop, a.funnel.steps[3].conv].join('|'), '40|90|66.7', 'step conversion and drop-off');
  t.eq(a.funnel.medianHoursToPublish, 3, 'median time to publish (hours)');
  const fi = await (await get(base, '/admin/analytics?days=30&end=2025-03-30&source=instagram', owner)).json();
  t.eq(fi.funnel.steps.slice(0, 3).map((x) => x.n).join(','), '80,46,30', 'funnel filtered by source');
  const fc = await (await get(base, '/admin/analytics?days=30&end=2025-03-30&category=trades', owner)).json();
  t.eq([fc.funnel.steps[0].n, fc.funnel.steps[2].n, fc.funnel.steps[5].n].join(','), ',20,2', 'funnel filtered by category (visitor steps n/a)');
  const ig = a.acquisition.sources.find((x) => x.key === 'instagram / social'), fb = a.acquisition.sources.find((x) => x.key === 'facebook / social');
  t.ok(ig && ig.visitors === 80 && ig.generated === 30 && ig.genRate === 37.5, 'acquisition row: instagram visitors -> generated');
  t.ok(fb && fb.genRate === 12.5, 'acquisition row: facebook');
  t.ok(a.acquisition.campaigns.some((x) => x.key === 'spring' && x.visitors === 40), 'campaigns table');
  t.ok(a.acquisition.landings.some((x) => x.key === '/for/plumber'), 'landing pages table');
  const pl = a.business.categories.find((x) => x.key === 'trades'), bk = a.business.types.find((x) => x.key === 'bakery');
  t.ok(pl && pl.pubRate === 10 && pl.under === true, 'underperforming category is flagged');
  t.ok(bk && bk.pubRate === 60 && !bk.under, 'strong type is not flagged');
  t.eq([a.business.genericShare, a.business.genericTypes[0].key, a.business.genericTypes[0].n].join('|'), '33.3|dog groomer|8', 'generic share and the types behind it');
  const co = a.retention.cohorts.find((x) => x.week === '2025-02-17');
  t.ok(co && co.size === 10 && co.w1 === 40 && co.w4 === 20, 'weekly cohort with week-1 / week-4 return: ' + JSON.stringify(co));
  t.eq([a.quality.fails, a.quality.failReasons[0] && a.quality.failReasons[0].err].join('|'), '4|Gemini timeout', 'generation failures and reasons');
  t.eq([a.revenue.storeCheckouts, a.revenue.storeAmount, a.revenue.storeFees].join('|'), '1|2500|50', 'store checkouts, amount and fees');
  const ins = (a.insights || []).map((x) => x.text).join('\n');
  t.ok(/Plumber sites publish at 10% vs 33\.3% average/.test(ins), 'insight: underperforming type');
  t.ok(/Bakery sites publish at 60%/.test(ins), 'insight: strong niche');
  t.ok(/generic category is 33\.3% of new sites.*dog groomer \(8\)/.test(ins), 'insight: generic category with missing types');
  t.ok(/Instagram traffic converts 3× better than Facebook/.test(ins), 'insight: source comparison');
  t.ok(/Biggest drop-off: only 40% reach .Site generated/.test(ins), 'insight: biggest funnel drop');
  t.ok(/Site generation failed 4 times/.test(ins), 'insight: generation failures');
  t.ok(!/Google listing/.test(ins), 'no insight from segments that do not differ enough');
  t.ok(!/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(JSON.stringify(a)), 'no IP addresses in the analytics response');

  // 3) Activity log from D1, filters, no visitor hashes or IPs.
  const act = await (await get(base, '/admin/activity?type=generate_fail', owner)).json();
  t.ok(act.db && act.events.length >= 4 && act.events.every((e) => e.type === 'generate_fail'), 'activity log filters by event type');
  t.ok(act.events.every((e) => !('visitor' in e) && !('session' in e)), 'activity log never exposes visitor hashes');
  const act2 = await (await get(base, '/admin/activity?q=seed.test', owner)).json();
  t.ok(act2.events.length > 0 && act2.events.every((e) => /seed\.test/.test(e.email || '')), 'activity log search');
  const dd = await (await get(base, '/admin/data', owner)).json();
  t.ok(Array.isArray(dd.users) && dd.users.some((u) => u.email === OWNER.toLowerCase() && 'lastActive' in u && 'leads' in u && 'mrr' in u), 'customers carry last active, leads and MRR');

  // 4) The dashboard: pages + navigation, remembered page, sortable tables, customer drawer with actions that hit the
  //    same admin endpoints, styled confirmations and toasts; works on a 390px phone without horizontal scroll.
  const cu = await (await get(base, '/admin/customer?email=' + encodeURIComponent('not-the-owner@example.com'), owner)).json();
  t.ok(cu.user && cu.user.email === 'not-the-owner@example.com' && Array.isArray(cu.events) && Array.isArray(cu.sites), 'customer profile endpoint (plan, sites, timeline)');
  t.ok(cu.events.some((e) => e.type === 'signup'), 'customer timeline includes their sign-up');
  {
    const page = await openPage(browser, {});
    const hits = []; page.on('request', (r) => { if (/\/admin\/(grant|feature|errors)/.test(r.url())) hits.push(r.method() + ' ' + r.url().replace(base, '')); });
    await page.setCookie(browserCookie(base, owner));
    await page.goto(base + '/admin', { waitUntil: 'networkidle2' });
    t.ok(await waitFor(() => page.evaluate(() => document.querySelectorAll('#kpis .kpi .n').length === 7), 15000), 'overview shows the 7 KPI cards');
    t.ok(await page.evaluate(() => document.querySelectorAll('#kpis .kpi .x').length === 7 && /recurring revenue/i.test(document.getElementById('kpis').textContent)), 'every KPI has a plain-English explanation');
    t.ok(await page.evaluate(() => document.getElementById('attList').children.length > 0 && !document.querySelector('#attList .sk')), '"What needs your attention" list renders');
    t.ok(await page.evaluate(() => !!document.querySelector('#ovChart svg text')), 'daily chart has axis labels');
    for (const p of ['growth', 'customers', 'sites', 'revenue', 'health', 'activity', 'overview']) {
      await page.click('#nav button[data-p="' + p + '"]');
      const vis = await page.evaluate((pp) => { const s = document.querySelector('.pg[data-pg="' + pp + '"]'); return !s.hidden && [].filter.call(document.querySelectorAll('.pg'), (x) => !x.hidden).length === 1 && document.querySelector('#nav button[aria-current="page"]').getAttribute('data-p') === pp; }, p);
      t.ok(vis, 'sidebar opens the ' + p + ' page');
    }
    await page.click('#nav button[data-p="customers"]');
    await page.reload({ waitUntil: 'networkidle2' });
    t.ok(await page.evaluate(() => !document.querySelector('.pg[data-pg="customers"]').hidden), 'last page is remembered after a reload');
    await waitFor(() => page.evaluate(() => !!document.querySelector('#custT tr[data-open]')), 10000);
    await page.click('#custT th button[data-sort="email"]');
    t.eq(await page.evaluate(() => document.querySelector('#custT th button[data-sort="email"]').parentNode.getAttribute('aria-sort')), 'ascending', 'clicking a column header sorts the table');
    await page.type('#custQ', 'not-the-owner');
    t.eq(await page.evaluate(() => document.querySelectorAll('#custT tr[data-open]').length), 1, 'customer search filters the table');
    await page.click('#custT tr[data-open]');
    t.ok(await waitFor(() => page.evaluate(() => document.getElementById('drawer').classList.contains('on') && !!document.querySelector('#dBody button[data-act="plan"]')), 8000), 'clicking a customer opens their profile drawer');
    await page.click('#dBody button[data-act="plan"]');
    await waitFor(() => page.evaluate(() => !!document.getElementById('confirmOk')), 3000);
    await page.click('#confirmOk');
    t.ok(await waitFor(() => page.evaluate(() => { const x = document.querySelector('.toast.ok'); return !!x && /Pro granted/.test(x.textContent); }), 6000), 'success toast after granting Pro');
    let dd2 = await (await get(base, '/admin/data', owner)).json();
    t.ok(dd2.users.some((u) => u.email === 'not-the-owner@example.com' && u.plan === 'pro'), 'grant still goes through /admin/grant and takes effect');
    await waitFor(() => page.evaluate(() => /Remove Pro/.test(document.getElementById('dBody').textContent)), 6000);
    await page.click('#dBody button[data-act="plan"]'); await waitFor(() => page.evaluate(() => !!document.getElementById('confirmOk')), 3000); await page.click('#confirmOk');
    await waitFor(async () => (await (await get(base, '/admin/data', owner)).json()).users.some((u) => u.email === 'not-the-owner@example.com' && u.plan === 'free'), 6000);
    await waitFor(() => page.evaluate(() => /Make developer/.test(document.getElementById('dBody').textContent)), 6000);
    await page.click('#dBody button[data-act="dev"]'); await waitFor(() => page.evaluate(() => !!document.getElementById('confirmOk')), 3000); await page.click('#confirmOk');
    await sleep(800);
    dd2 = await (await get(base, '/admin/data', owner)).json();
    t.ok(dd2.users.some((u) => u.email === 'not-the-owner@example.com' && u.plan === 'free' && u.dev === true), 'revoke Pro and developer role work from the drawer');
    t.ok(hits.filter((h) => /\/admin\/grant\?email=not-the-owner/.test(h)).length === 3, 'drawer actions call the existing /admin/grant endpoint (' + hits.join(', ') + ')');
    await page.keyboard.press('Escape');
    t.ok(await page.evaluate(() => !document.getElementById('drawer').classList.contains('on')), 'Escape closes the drawer');
    await page.click('#nav button[data-p="activity"]');
    t.ok(await waitFor(() => page.evaluate(() => document.querySelectorAll('#actT tbody tr').length > 0), 8000), 'activity page lists events');
    t.eq(page._wsErrors.join(' | '), '', 'no script errors on the dashboard');
    await page.close();
  }
  {
    const page = await openPage(browser, { mobile: true, width: 390 });
    await page.setViewport({ width: 390, height: 800, isMobile: true, hasTouch: true });
    await page.setCookie(browserCookie(base, owner));
    await page.goto(base + '/admin#overview', { waitUntil: 'networkidle2' });
    await waitFor(() => page.evaluate(() => document.querySelectorAll('#kpis .kpi .n').length === 7), 15000);
    t.ok(await page.evaluate(() => getComputedStyle(document.getElementById('menuBtn')).display !== 'none'), 'phone: menu button shown instead of the sidebar');
    await page.click('#menuBtn'); await sleep(300);
    await page.click('#nav button[data-p="growth"]'); await sleep(300);
    t.ok(await page.evaluate(() => !document.querySelector('.pg[data-pg="growth"]').hidden && !document.getElementById('side').classList.contains('open')), 'phone: menu navigates and closes');
    for (const p of ['growth', 'customers', 'revenue', 'health', 'overview']) { await page.evaluate((pp) => { location.hash = pp; }, p); await sleep(250); t.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'phone (390px): no horizontal scroll on ' + p); }
    t.eq(page._wsErrors.join(' | '), '', 'no script errors on the phone dashboard');
    await page.close();
  }

  // 5) Retention: the daily job rolls old days up into `daily`, then deletes raw events older than ~400 days.
  const today = new Date().toISOString().slice(0, 10);
  await post(base, '/track', { event: 'visit', url: base + '/?utm_source=retention-check' }, { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0 retention' });
  await sleep(500);
  const cr = await post(base, '/__test/analytics', { cron: { now: Date.now() } });
  t.ok(cr.json && cr.json.ok && cr.json.result.deleted >= s.events.length, 'daily job deletes raw events older than 400 days (' + (cr.json && JSON.stringify(cr.json.result)) + ')');
  const q = async (sql, args) => ((await post(base, '/__test/analytics', { query: { sql, args: args || [] } })).json || {}).rows || [];
  t.eq((await q("SELECT COUNT(*) n FROM events WHERE day < '2025-10-01'"))[0].n, 0, 'no raw events past the retention window remain');
  t.eq((await q("SELECT COUNT(*) n FROM activity WHERE day < '2025-10-01'"))[0].n, 0, 'old activity rows are removed too');
  const roll = await q("SELECT metric, n FROM daily WHERE day = '2025-03-02' AND dim = '' ORDER BY metric");
  t.ok(roll.some((r) => r.metric === 'ev:generate' && r.n >= 2) && roll.some((r) => r.metric === 'visitors' && r.n > 0), 'daily aggregates are kept after raw events are deleted');
  t.ok((await q('SELECT COUNT(*) n FROM events WHERE day >= ?', [today]))[0].n > 0, 'recent events are kept');
  t.ok((await q("SELECT COUNT(*) n FROM daily WHERE metric = 'paid_pro'"))[0].n >= 1, 'daily job snapshots paid Pro / MRR');
};
