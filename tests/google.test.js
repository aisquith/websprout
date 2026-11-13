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

  // ---- Start from your Google listing ----
  r = await fetch(base + '/api/place/details?place=ChIJ_test_place_id_123');
  t.ok(/not available/i.test((await r.json()).error || ''), 'listing details explain they are unavailable without a key');
  t.eq((await fetch(base + '/api/place/details?place=x<y')).status, 400, 'listing details reject malformed ids');
  t.ok(/id="gFillWrap" hidden/.test(await (await fetch(base + '/')).text()), 'the "fill from Google" link stays hidden without a key');

  // mapping a recorded Places (New) response
  const src = require('fs').readFileSync(require('path').join(__dirname, '../src/50-generator.js'), 'utf8');
  const placeToSetup = new Function(src.slice(src.indexOf('function placeToSetup'), src.indexOf('async function doPlaceDetails')) + ';return placeToSetup;')();
  const PLACE = {
    id: 'ChIJ_test_place_id_123', displayName: { text: 'Glow Salon' }, primaryTypeDisplayName: { text: 'Hair salon' },
    shortFormattedAddress: '12 Elm St, Austin', addressComponents: [{ longText: 'Austin', types: ['locality', 'political'] }],
    nationalPhoneNumber: '(512) 555-0142', editorialSummary: { text: 'Bright neighborhood salon for cuts and color.' }, rating: 4.7, userRatingCount: 88,
    regularOpeningHours: { periods: [
      { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 12, minute: 0 } }, { open: { day: 1, hour: 13, minute: 0 }, close: { day: 1, hour: 18, minute: 30 } },
      { open: { day: 5, hour: 17, minute: 0 }, close: { day: 6, hour: 2, minute: 0 } }, { open: { day: 6, hour: 10, minute: 0 }, close: { day: 6, hour: 16, minute: 0 } }] },
    reviews: [{ rating: 5, text: { text: 'Best color I have had in years, so friendly.' }, authorAttribution: { displayName: 'Ana R.' } }, { rating: 2, text: { text: 'Waited forty minutes past my appointment.' }, authorAttribution: { displayName: 'Bo' } }],
  };
  const m = placeToSetup(PLACE);
  t.eq([m.name, m.type, m.city, m.phone, m.address].join('|'), 'Glow Salon|Hair salon|Austin|(512) 555-0142|12 Elm St, Austin', 'listing: name, type, city, phone, address');
  t.eq(JSON.stringify(m.hours[0]), '{"d":"Mon","open":"09:00","close":"18:30"}', 'listing: split shift becomes one day');
  t.eq(JSON.stringify(m.hours[4]), '{"d":"Fri","open":"17:00","close":"02:00"}', 'listing: past-midnight close kept');
  t.ok(!m.hours[6].open && m.hours[6].d === 'Sun', 'listing: days without hours are closed');
  t.eq(m.reviews.map((x) => x.name).join(','), 'Ana R.', 'listing: only good reviews are used as starters');
  t.eq(JSON.stringify(placeToSetup({}).hours), '[]', 'listing: no hours on Google means none invented');

  // a site created from the listing: hours, address, linked Google reviews
  const gs = await createSite(base, Object.assign({}, m, { hours: m.hours.concat([{ d: 'X', open: '<b>', close: '9' }]) }));
  const allSecs = gs.site.pages.flatMap((p) => p.sections);
  t.eq(gs.site.biz.googlePlaceId, 'ChIJ_test_place_id_123', 'listing site keeps the Google place');
  t.ok(allSecs.some((s) => s.type === 'reviews' && s.variant === 'google'), 'listing site shows live Google reviews');
  t.ok(/6:30 pm/.test(gs.html) && /12 Elm St/.test(gs.html) && /Best color I have had/.test(gs.html), 'listing site shows hours, address and a starter review');
  t.ok(!/<b>/.test(JSON.stringify(gs.site.biz.hours)), 'bad hours values are dropped');

  // setup UI with Google faked: pick a listing, form fills, /create carries the listing
  const up = await openPage(browser, {});
  let created = null;
  await up.setRequestInterception(true);
  up.on('request', (q) => {
    const u = q.url();
    if (u.includes('/api/place/find')) return q.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, results: [{ id: PLACE.id, name: 'Glow Salon', address: '12 Elm St, Austin', rating: 4.7, count: 88 }] }) });
    if (u.includes('/api/place/details')) return q.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(Object.assign({ ok: true }, m)) });
    if (u.endsWith('/create') && q.method() === 'POST') created = JSON.parse(q.postData());
    q.continue();
  });
  await up.goto(base + '/', { waitUntil: 'networkidle2' });
  await up.evaluate(() => { document.getElementById('gFillWrap').hidden = false; });
  await up.click('#gFillBtn'); await up.type('#gFillQ', 'Glow Salon Austin'); await up.click('#gFillGo'); await sleep(400);
  await up.click('.gfill-opt'); await sleep(500);
  const filled = await up.evaluate(() => ['bizName', 'bizType', 'bizCity', 'bizPhone'].map((id) => document.getElementById(id).value).join('|') + '|' + document.getElementById('gFillDone').textContent);
  t.ok(/^Glow Salon\|Hair salon\|Austin\|\(512\) 555-0142\|Using your Google listing/.test(filled), 'picking a listing fills the setup form ' + filled);
  await up.evaluate(() => doCreateV3()); await sleep(1500);
  t.ok(created && created.googlePlaceId === PLACE.id && created.hours.length === 7 && created.reviews.length === 1, 'the new site is built from the listing');
  t.eq(up._wsErrors.length, 0, 'setup page has no JS errors ' + up._wsErrors.join('; '));
  await up.close();
};
