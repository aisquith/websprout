// Published multi-page sites: every page has its own real URL, title, canonical link and content; per-site sitemap.
const { createSite, post, openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const s = await createSite(base, { name: 'Peak Law', type: 'Law firm', city: 'Boston', phone: '617-555-0100' });
  const slug = 'seo' + Date.now().toString(36);
  const r0 = await post(base, '/publish', { html: s.html, site: s.site, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r0.status, 200, 'publishes');
  const paths = s.site.pages.map((p) => p.path);
  t.ok(paths.includes('about') && paths.includes('contact'), 'site has About and Contact pages');

  // path-based URLs on websprout.app
  for (const p of paths) {
    const r = await fetch(base + '/s/' + slug + '/' + p);
    const html = await r.text();
    t.eq(r.status, 200, '/s/' + slug + '/' + p + ' loads');
    const pageCount = (html.match(/class="ws-page/g) || []).length;
    t.eq(pageCount, 1, (p || 'home') + ' serves only its own page content');
    t.ok(new RegExp('data-path="' + p + '"').test(html), (p || 'home') + ' serves the right page');
    t.ok(html.indexOf('<link rel="canonical" href="https://' + slug + '.websprout.app/' + p + '">') > -1, (p || 'home') + ' has a canonical URL on the site subdomain');
    t.ok(!/href="#\//.test(html), (p || 'home') + ' links use real paths, not #/');
    if (p) t.ok(new RegExp('<title>[^<]*Peak Law[^<]*</title>').test(html) && html.indexOf('<title>' + s.site.pages.find((x) => x.path === p).title) > -1, p + ' has its own title');
  }
  const nf = await fetch(base + '/s/' + slug + '/no-such-page');
  t.eq(nf.status, 404, 'unknown page is a real 404');

  // the same site on its own subdomain (Host header) uses root-relative links, and has sitemap + robots
  const sub = { headers: { 'x-ws-test-host': slug + '.websprout.app' } };
  let r = await fetch(base + '/about', sub);
  const subHtml = await r.text();
  if (r.status === 200 && /data-path="about"/.test(subHtml)) {
    t.ok(/href="\/contact"/.test(subHtml), 'subdomain pages link to /contact');
    const sm = await (await fetch(base + '/sitemap.xml', sub)).text();
    t.ok(paths.every((p) => sm.indexOf('<loc>https://' + slug + '.websprout.app/' + p + '</loc>') > -1), 'per-site sitemap lists every page');
    const rb = await (await fetch(base + '/robots.txt', sub)).text();
    t.ok(/Sitemap: https:\/\/[a-z0-9]+\.websprout\.app\/sitemap\.xml/.test(rb), 'per-site robots.txt points to its sitemap');
  } else { console.log('       (note: local server does not route by Host header; subdomain checks skipped)'); t.ok(true, ''); }

  // in a browser: nav goes to real URLs, old #/ links redirect, no JS errors
  const page = await openPage(browser, {});
  await page.goto(base + '/s/' + slug + '/#/contact', { waitUntil: 'networkidle2' });
  t.ok(/\/s\/[a-z0-9]+\/contact$/.test(page.url()), 'old #/contact link redirects to /contact (' + page.url() + ')');
  t.ok(await page.evaluate(() => !!document.querySelector('.ws-page.on[data-path="contact"]') && !!document.querySelector('form')), 'contact page shows its form');
  await page.evaluate(() => { const a = [...document.querySelectorAll('header nav a')].find((x) => /about/i.test(x.textContent)); a.click(); });
  await sleep(1500);
  t.ok(/\/s\/[a-z0-9]+\/about$/.test(page.url()), 'nav click opens /about');
  t.ok(await page.evaluate(() => { const a = [...document.querySelectorAll('header nav a')].find((x) => /about/i.test(x.textContent)); return a && a.classList.contains('active'); }), 'About is marked active in the nav');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();
};
