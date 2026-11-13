// Public pages load without errors on desktop and phone, internal links resolve, routes answer correctly.
const { openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const pages = ['/', '/terms', '/privacy', '/accessibility', '/deploy-guide', '/success', '/for', '/for/restaurant', '/showcase', '/inbox', '/reviews'];
  for (const mobile of [false, true]) {
    for (const p of pages) {
      const page = await openPage(browser, { mobile });
      const bad = [];
      page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base) && !/\/(me|my-sites|load)\b/.test(r.url())) bad.push(r.status() + ' ' + r.url().slice(base.length)); });
      await page.goto(base + p, { waitUntil: 'networkidle2', timeout: 45000 });
      await sleep(300);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const tag = (mobile ? 'phone ' : 'desktop ') + p;
      t.eq(page._wsErrors.length, 0, tag + ' has no JS errors ' + page._wsErrors.join('; '));
      t.ok(ov <= 1, tag + ' has no sideways scroll (' + ov + 'px)');
      t.eq(bad.length, 0, tag + ' loads all its resources ' + bad.join(', '));
      await page.close();
    }
  }
  // Every internal link on the public pages resolves
  const links = new Set();
  for (const p of ['/', '/terms', '/privacy', '/for', '/showcase']) {
    const html = await (await fetch(base + p)).text();
    (html.match(/href="\/[^"#?]*/g) || []).forEach((h) => links.add(h.slice(6)));
  }
  for (const l of links) {
    if (/^\/(admin|auth\/google|connect\/start|example)/.test(l)) continue; // need auth, secrets or query params
    const r = await fetch(base + l, { redirect: 'manual' });
    t.ok(r.status < 400, 'internal link ' + l + ' resolves (' + r.status + ')');
  }
  // Sitemap URLs
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const locs = (sm.match(/<loc>[^<]+/g) || []).map((s) => s.slice(5).replace('https://websprout.app', ''));
  t.ok(locs.length > 10, 'sitemap lists pages');
  for (const l of locs) { const r = await fetch(base + l); t.ok(r.status === 200, 'sitemap url ' + l + ' is 200'); }
  // Status codes of key routes
  const expect = { '/admin': 403, '/dev': 403, '/s/no-such-site': 404, '/load': 400, '/robots.txt': 200, '/ws-engine.js': 200, '/og.png': 200, '/example?i=0': 200 };
  for (const [p, code] of Object.entries(expect)) { const r = await fetch(base + p); t.eq(r.status, code, 'GET ' + p); }
};
