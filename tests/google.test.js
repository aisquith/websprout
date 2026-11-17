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
  home.splice(1, 0, { id: 'reviews-g1', type: 'reviews', variant: 'google', title: 'What people say', items: [{ quote: 'Typed fallback review', name: 'Owner' }] }, { id: 'trust-g1', type: 'trust', variant: 'strip' });
  site.biz.founded = '2009'; site.biz.googleRating = 3.1; // a stale stored number (older sites) is never shown
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
  t.ok(/Reviews from Google Maps/.test(g.txt), 'Google attribution shows ("Google Maps")');
  t.ok(!/3\.1 on/.test(html) && /data-glive hidden/.test(html), 'the rating badge is live-only in the markup');
  const badge = await page.evaluate(() => { const b = document.querySelector('.tb-rating'); return b && !b.hidden ? b.textContent : ''; });
  t.ok(/4\.8 on Google/.test(badge) && /213 Google reviews/.test(badge), 'the trust badge shows the live Google rating ' + badge);
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
  t.ok(!('reviews' in m) && !/Best color|Waited forty|Ana R\./.test(JSON.stringify(m)), 'listing: Google review text and authors are never copied into setup');
  t.eq(JSON.stringify(placeToSetup({}).hours), '[]', 'listing: no hours on Google means none invented');

  // a site created from the listing: hours, address, linked Google reviews
  const gs = await createSite(base, Object.assign({}, m, { hours: m.hours.concat([{ d: 'X', open: '<b>', close: '9' }]) }));
  const allSecs = gs.site.pages.flatMap((p) => p.sections);
  t.eq(gs.site.biz.googlePlaceId, 'ChIJ_test_place_id_123', 'listing site keeps the Google place');
  t.ok(allSecs.some((s) => s.type === 'reviews' && s.variant === 'google'), 'listing site shows live Google reviews');
  t.ok(/6:30 pm/.test(gs.html) && /12 Elm St/.test(gs.html), 'listing site shows hours and address');
  t.ok(!/Best color I have had/.test(JSON.stringify(gs.site) + gs.html) && !/googleRating|googleReviews|"4\.7"|"88"/.test(JSON.stringify(gs.site)), 'no Google review text, rating or count is stored in the site');
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
  await up.evaluate(() => document.getElementById('gFillBtn').click()); await up.type('#gFillQ', 'Glow Salon Austin'); await up.evaluate(() => document.getElementById('gFillGo').click()); await sleep(400);
  await up.evaluate(() => document.querySelector('.gfill-opt').click()); await sleep(500);
  const filled = await up.evaluate(() => ['bizName', 'bizType', 'bizCity', 'bizPhone'].map((id) => document.getElementById(id).value).join('|') + '|' + document.getElementById('gFillDone').textContent);
  t.ok(/^Glow Salon\|Hair salon\|Austin\|\(512\) 555-0142\|Using your Google listing/.test(filled), 'picking a listing fills the setup form ' + filled);
  await up.evaluate(() => doCreateV3()); await sleep(1500);
  t.ok(created && created.googlePlaceId === PLACE.id && created.hours.length === 7 && !(created.reviews || []).length, 'the new site is built from the listing (no Google reviews copied)');
  t.eq(up._wsErrors.length, 0, 'setup page has no JS errors ' + up._wsErrors.join('; '));
  await up.close();

  // ---- /api/place with Google faked (Node): short-lived dedupe only, authors credited, no star filter, bounded cost ----
  {
    const rd = (f) => require('fs').readFileSync(require('path').join(__dirname, '../src', f), 'utf8');
    const kv = () => { const m = new Map(), ttl = {}; return { m, ttl, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v, o) => { m.set(k, v); ttl[k] = o && o.expirationTtl; } }; };
    const calls = [];
    const G = { displayName: { text: 'Glow' }, rating: 4.2, userRatingCount: 40, googleMapsUri: 'https://maps.google.com/?cid=9', reviews: [
      { name: 'places/X/reviews/r1', rating: 1, text: { text: 'Not for me.' }, googleMapsUri: 'https://www.google.com/maps/reviews/r1', authorAttribution: { displayName: 'Lo', uri: '//www.google.com/maps/contrib/1', photoUri: '//lh3.googleusercontent.com/a/lo' }, relativePublishTimeDescription: 'a week ago' },
      { name: 'places/X/reviews/r2', rating: 5, text: { text: 'Great.' }, authorAttribution: { displayName: 'Hi', uri: 'javascript:alert(1)' } }] };
    const wsStub = 'async function wsRate(env, key, max, ttl){ const n = parseInt((await env.KV.get(key)) || "0", 10) || 0; if (n >= max) return false; await env.KV.put(key, String(n + 1), { expirationTtl: ttl }); return true; } function wsClientIp(){ return "1.2.3.4"; }\n';
    const K = new Function('fetch', wsStub + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { doPlace, v3AiFacts };')(async (u, o) => { calls.push({ u: String(u), mask: o && o.headers && o.headers['X-Goog-FieldMask'] }); return new Response(JSON.stringify(G), { headers: { 'Content-Type': 'application/json' } }); });
    const env = { GOOGLE_PLACES_KEY: 'k', KV: kv(), PLACES_PER_PLACE_DAILY: '2' };
    const ask = (id) => K.doPlace(new Request('https://websprout.app/api/place?place=' + id), env);
    let res = await ask('ChIJ_place_aaaaaa'); const j = await res.json();
    t.ok(/\breviews\b/.test(calls[0].mask), 'the field mask asks for reviews (with their authorAttribution)');
    t.eq(j.items.map((v) => v.rating).join(','), '1,5', 'reviews come back as Google returns them, low ratings included');
    t.eq([j.items[0].authorUri, j.items[0].authorPhoto].join(' '), 'https://www.google.com/maps/contrib/1 https://lh3.googleusercontent.com/a/lo', 'each review carries its author link and photo');
    t.eq(j.items[1].authorUri, '', 'unsafe author links are dropped');
    t.eq(env.KV.ttl['place3:ChIJ_place_aaaaaa'], 600, 'Google\'s answer is kept 10 minutes at most (dedupe only)');
    t.ok(/max-age=600$/.test(res.headers.get('cache-control') || ''), 'browsers and the edge keep it 10 minutes at most');
    res = await ask('ChIJ_place_aaaaaa');
    t.ok(res.status === 200 && calls.length === 1, 'a repeat within the window makes no Google call');
    env.KV.m.delete('place3:ChIJ_place_aaaaaa'); await ask('ChIJ_place_aaaaaa'); env.KV.m.delete('place3:ChIJ_place_aaaaaa');
    res = await ask('ChIJ_place_aaaaaa');
    t.ok(res.status === 429 && calls.length === 2, 'a per-place daily ceiling bounds the cost of a busy site');
    const facts = K.v3AiFacts({ name: 'Glow', type: 'Hair salon', city: 'Austin', googlePlaceId: 'ChIJ_place_aaaaaa', reviews: [{ quote: 'Typed by the owner', name: 'A' }] }, { category: 'beauty', labels: {} }, []);
    t.ok(!('reviewSnippets' in facts) && !/Typed by the owner/.test(JSON.stringify(facts)), 'the AI is never sent reviews');
  }

  // ---- the map: Google's Maps Embed API with a key, else a directions link ----
  {
    const page = await openPage(browser, {});
    await page.goto(base + '/terms');
    const out = await page.evaluate(async (sd) => {
      await new Promise((res) => { const sc = document.createElement('script'); sc.src = '/ws-engine.js'; sc.onload = res; document.head.appendChild(sc); });
      const WS = window.WS; sd.biz.address = '12 Elm St, Austin';
      const visit = (v) => WS.renderSection(sd, { id: 'visit-x', type: 'visit', variant: v }, 'live');
      const noKey = [visit('map'), visit('hours')];
      WS.mapsKey = 'TESTKEY';
      const withKey = [visit('map'), visit('hours')];
      WS.mapsKey = '';
      return { noKey, withKey };
    }, JSON.parse(JSON.stringify(site)));
    t.ok(out.noKey.every((h) => !/<iframe/.test(h) && /class="btn btn-ink vm-dir" href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=12%20Elm%20St%2C%20Austin"/.test(h)), 'without a key: no map iframe, a "Get directions" link instead');
    t.ok(!/output=embed|maps\?q=/.test(out.noKey.join('') + out.withKey.join('')), 'the keyless Google Maps embed is never used');
    t.ok(/<iframe class="mapf"[^>]*src="https:\/\/www\.google\.com\/maps\/embed\/v1\/place\?key=TESTKEY&amp;q=12%20Elm%20St%2C%20Austin"/.test(out.withKey[0]), 'with a key: the official Maps Embed API');
    t.ok(/data-map="https:\/\/www\.google\.com\/maps\/embed\/v1\/place\?key=TESTKEY/.test(out.withKey[1]) && !/<iframe/.test(out.withKey[1]), 'click-to-load layout keeps the map until asked');
    // a published page given the key by the server (<meta name="ws-maps-key">) upgrades the directions link
    const sd2 = JSON.parse(JSON.stringify(site)); sd2.biz.address = '12 Elm St, Austin';
    const vis = sd2.pages[0].sections.find((x) => x.type === 'visit'); if (vis) vis.variant = 'map'; else sd2.pages[0].sections.push({ id: 'visit-m', type: 'visit', variant: 'map' });
    const html = await page.evaluate((d) => window.WS.renderSite(d, { mode: 'live' }), sd2);
    await page.setRequestInterception(true);
    page.on('request', (q) => (/google\.com\/maps\/embed/.test(q.url()) ? q.respond({ status: 200, contentType: 'text/html', body: '<p>map</p>' }) : q.continue()));
    await page.setContent(html.replace('<head>', '<head><meta name="ws-maps-key" content="SRVKEY">'), { waitUntil: 'domcontentloaded' }); await sleep(400);
    const fr = await page.evaluate(() => { const f = document.querySelector('.v-map iframe'); return f ? f.getAttribute('src') : ''; });
    t.ok(/^https:\/\/www\.google\.com\/maps\/embed\/v1\/place\?key=SRVKEY&q=12%20Elm%20St/.test(fr), 'the page turns the server-given key into the embedded map ' + fr);
    await page.close();
  }
};
