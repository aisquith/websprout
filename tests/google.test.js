// Google reviews: endpoints fail gracefully without a key; the live layout renders reviews with attribution.
const { createSite, openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  let r = await fetch(base + '/api/place?place=ChIJ_test_place_id_123');
  t.eq(r.status, 503, '/api/place reports "not configured" without a Google key');
  t.eq(r.headers.get('access-control-allow-origin'), '*', '/api/place can be called from published sites');
  r = await fetch(base + '/api/place?place=bad<id>');
  t.eq(r.status, 400, '/api/place rejects malformed place ids');
  const f = await (await fetch(base + '/api/place/find?q=Glow%20Salon%20Austin')).json();
  t.ok(f && f.ok === false && /not available/i.test(f.error || ''), 'place lookup explains it is unavailable');

  // A site with a linked place and the Google layout, with Google's answer faked in the browser
  const s = await createSite(base, { name: 'Glow Salon', type: 'Hair salon', city: 'Austin' });
  const site = s.site; site.biz.googlePlaceId = 'ChIJ_test_place_id_123';
  const home = site.pages[0].sections;
  home.splice(1, 0, { id: 'reviews-g1', type: 'reviews', variant: 'google', title: 'What people say', items: [{ quote: 'Typed fallback review', name: 'Owner' }] });
  const page = await openPage(browser, {});
  await page.goto(base + '/terms');
  const html = await page.evaluate(async (sd) => {
    await new Promise((res) => { const sc = document.createElement('script'); sc.src = '/ws-engine.js'; sc.onload = res; document.head.appendChild(sc); });
    return window.WS.renderSite(sd, { mode: 'live' });
  }, site);
  t.ok(/data-greviews/.test(html) && /Typed fallback review/.test(html), 'Google layout renders with the typed fallback');
  await page.setRequestInterception(true);
  page.on('request', (q) => {
    if (q.url().indexOf('/api/place?place=') > -1) return q.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ rating: 4.8, reviews: 213, url: 'https://maps.google.com/?cid=1', items: [{ rating: 5, text: 'Best <b>haircut</b> I have had in years.', name: 'Sam P.', when: '2 weeks ago' }, { rating: 4, text: 'Friendly and fast.', name: 'Rae', when: 'a month ago' }] }) });
    q.continue();
  });
  await page.setContent(html, { waitUntil: 'domcontentloaded' }); await sleep(1200);
  const g = await page.evaluate(() => { const b = document.querySelector('[data-greviews]'); return { txt: b.textContent, html: b.innerHTML }; });
  t.ok(/Best <b>haircut<\/b>|Best haircut/.test(g.txt) && /Sam P\./.test(g.txt), 'live Google reviews replace the fallback');
  t.ok(!/<b>haircut<\/b>/.test(g.html.replace(/&lt;b&gt;haircut&lt;\/b&gt;/, '')), 'review text is escaped (no HTML from reviews)');
  t.ok(/4\.8/.test(g.txt) && /213 Google reviews/.test(g.txt), 'rating and review count show');
  t.ok(/Reviews from Google/.test(g.txt), 'Google attribution shows');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();
};
