// Published-site hardening: single-page sites render pages[0], owner redirects (301), branded 404s that keep the
// site's own look and link back to its base, empty pages/lists never render blank, owner links are made safe.
const { createSite, post, openPage, renderHtml, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  // The engine exactly as the editor runs it (served to browsers as /ws-engine.js).
  const src = await (await fetch(base + '/ws-engine.js')).text();
  const WS = new Function('globalThis', src + '\nreturn globalThis.WS;')({});
  t.ok(WS && typeof WS.renderSite === 'function', 'engine loads');

  // URL normalization
  const u = (x) => WS.safeUrl(x);
  t.eq(u('www.example.com'), 'https://www.example.com', 'bare www domain gets https');
  t.eq(u('example.com/book'), 'https://example.com/book', 'bare domain with path gets https');
  t.eq(u('javascript:alert(1)'), '', 'javascript: links are dropped');
  t.eq(u(' java\tscript:alert(1)'), '', 'obfuscated javascript: links are dropped');
  t.eq(u('data:text/html,hi'), '', 'data: links are dropped');
  t.eq(u('#/contact') + u('mailto:a@b.co') + u('tel:+15125550100'), '#/contactmailto:a@b.cotel:+15125550100', 'anchors, mailto and tel are kept');
  t.eq(WS.igHandle('https://www.instagram.com/glow.salon/?hl=en') + ',' + WS.igHandle('@glow'), 'glow.salon,glow', 'Instagram URLs and @handles reduce to the handle');

  const s = await createSite(base, { name: 'Glow Salon', type: 'Hair salon', city: 'Austin', phone: '512-555-0100' });
  const site = JSON.parse(JSON.stringify(s.site));
  t.ok(Array.isArray(site.pages) && site.pages.some((p) => p.path === 'about'), 'generated site has an About page');

  // Empty lists and pages
  const home = site.pages[0];
  home.sections.push({ id: 'svc-blank', type: 'services', title: 'Blank', items: [{ name: ' ', text: '' }, { name: '', text: '   ' }] });
  home.sections.push({ id: 'cta-bad', type: 'cta', title: 'Click', text: 'x', button: 'Go', link: 'javascript:alert(1)' });
  site.pages.push({ id: 'pg-empty', path: 'coming-soon', title: 'Coming soon', nav: true, sections: [] });
  site.redirects = { 'old-about': 'about', gone: '' };
  let html = WS.renderSite(site, { mode: 'live' });
  t.ok(!/data-sec="svc-blank"/.test(html), 'a list section with only blank items is hidden');
  t.ok(!/javascript:/i.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), 'unsafe owner links never reach the page');
  t.ok(/data-path="coming-soon"[^>]*>\s*<section[^>]*ws-empty/.test(html) && /being updated/.test(html), 'a page with no sections gets a branded "being updated" band');
  const edit = WS.renderSite(site, { mode: 'edit' });
  t.ok(/Services: nothing to show yet/.test(edit), 'the editor still shows the "nothing to show yet" placeholder');

  const slug = 'hd' + Date.now().toString(36);
  let r = await post(base, '/publish', { html, site, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r.status, 200, 'publishes');
  r = await fetch(base + '/s/' + slug + '/old-about', { redirect: 'manual' });
  t.ok(r.status === 301 && r.headers.get('location') === '/s/' + slug + '/about', 'renamed page redirects (301) under /s/<slug>/ (' + r.status + ' ' + r.headers.get('location') + ')');
  r = await fetch(base + '/s/' + slug + '/gone', { redirect: 'manual' });
  t.ok(r.status === 301 && r.headers.get('location') === '/s/' + slug + '/', 'deleted page redirects home');
  r = await fetch(base + '/s/' + slug + '/no-such-page');
  let body = await r.text();
  t.eq(r.status, 404, 'unknown page is a 404');
  t.ok(/Page not found/.test(body) && /class="top" data-top/.test(body) && /class="foot"/.test(body) && /--base:/.test(body), 'the 404 uses the site\'s own header, footer and colours');
  t.ok(body.indexOf('href="/s/' + slug + '/">Back to home') > -1, '"Back to home" links to the site base');
  t.ok(!/href="#\//.test(body), '404 page links are real paths');
  r = await fetch(base + '/s/' + slug + '/logo.png');
  t.eq(r.status, 404, 'missing files 404');

  // Single-page sites: pages[0] is the content, not stale site.sections
  const one = JSON.parse(JSON.stringify(s.site));
  one.pages = [one.pages[0]];
  one.pages[0].sections = one.pages[0].sections.concat([{ id: 'fresh-intro', type: 'intro', variant: 'center', text: 'FRESH-PAGE-CONTENT' }]);
  one.sections = [{ id: 'stale', type: 'intro', variant: 'center', text: 'STALE-SECTIONS-CONTENT' }];
  html = WS.renderSite(one, { mode: 'live' });
  t.ok(/FRESH-PAGE-CONTENT/.test(html) && !/STALE-SECTIONS-CONTENT/.test(html), 'a one-page site renders pages[0]');
  const slug2 = 'hs' + Date.now().toString(36);
  r = await post(base, '/publish', { html, site: one, siteId: s.siteId, key: s.formKey, slug: slug2 });
  t.eq(r.status, 200, 'one-page site publishes');
  r = await fetch(base + '/s/' + slug2 + '/');
  t.ok(r.status === 200 && /FRESH-PAGE-CONTENT/.test(await r.text()), 'one-page home serves');
  r = await fetch(base + '/s/' + slug2 + '/whatever');
  body = await r.text();
  t.ok(r.status === 404 && /Page not found/.test(body) && body.indexOf('href="/s/' + slug2 + '/">Back to home') > -1, 'one-page sites 404 unknown paths (branded) instead of serving home');

  // In the browser: an unknown #/path shows the not-found view; an old #/path follows the redirect
  const page = await openPage(browser, {});
  await renderHtml(page, base, WS.renderSite(site, { mode: 'live' }));
  await page.evaluate(() => { location.hash = '/nowhere'; }); await sleep(200);
  t.ok(await page.evaluate(() => !document.querySelector('[data-nf]').hidden && !document.querySelector('.ws-page.on')), 'client router shows not-found for a missing page');
  await page.evaluate(() => { location.hash = '/old-about'; }); await sleep(200);
  t.ok(await page.evaluate(() => { const a = document.querySelector('.ws-page.on'); return !!a && a.getAttribute('data-path') === 'about'; }), 'client router follows redirects');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();
};
