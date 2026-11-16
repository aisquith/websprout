// Generator photos and business types: Google listing photos (via the /api/place-photo redirect), Unsplash
// searches built from the business itself, and the trades added to the starter content. Google and Unsplash
// are faked by running the generator source in Node with a stand-in fetch.
const fs = require('fs');
const path = require('path');
const { createSite } = require('./lib');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const PID = 'ChIJ_test_place_id_123';
const UNS = (n, tag) => ({ results: Array.from({ length: n }, (_, i) => ({ id: (tag || 'u') + i, urls: { regular: 'https://images.unsplash.com/photo-' + (tag || 'u') + i + '?ixid=1' }, user: { name: 'U' + i, links: { html: 'https://unsplash.com/@u' + i } }, links: { download_location: 'https://api.unsplash.com/photos/' + (tag || 'u') + i + '/download' } })) });
const GPHOTOS = { photos: [
  { name: 'places/P1/photos/tall1', widthPx: 600, heightPx: 900, authorAttributions: [{ displayName: 'Ann Owner', uri: '//maps.google.com/maps/contrib/1' }] },
  { name: 'places/P1/photos/wide2', widthPx: 1600, heightPx: 1000, authorAttributions: [{ displayName: 'Bo Visitor', uri: 'https://maps.google.com/maps/contrib/2' }] },
  { name: 'places/P1/photos/wide3', widthPx: 1400, heightPx: 900, authorAttributions: [{ displayName: 'Cy', uri: 'https://maps.google.com/maps/contrib/3' }] },
] };
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv() { const m = new Map(), ttl = {}; return { m, ttl, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v, o) => { m.set(k, v); ttl[k] = o && o.expirationTtl; } }; }
function edgeCache() { const m = new Map(); return { m, default: { match: async (q) => m.get(q.url), put: async (q, r) => { m.set(q.url, r); } } }; }

module.exports = async function (ctx, t) {
  const { base } = ctx;

  // ---- /api/place-photo on the real worker (no Google key in tests) ----
  let r = await fetch(base + '/api/place-photo?pid=bad<id>&i=0&w=800', { redirect: 'manual' });
  t.eq(r.status, 400, 'place-photo rejects a malformed place id');
  r = await fetch(base + '/api/place-photo?pid=' + PID + '&i=12&w=800', { redirect: 'manual' });
  t.eq(r.status, 400, 'place-photo rejects an index outside 0-9');
  r = await fetch(base + '/api/place-photo?pid=' + PID + '&i=1&w=800', { redirect: 'manual' });
  t.eq(r.status, 404, 'place-photo answers 404 without a Google key (image falls back)');
  t.eq(r.headers.get('access-control-allow-origin'), '*', 'place-photo can be used from published sites');

  // ---- the route with Google faked ----
  const genSrc = rd('49-copy.js') + '\n' + rd('50-generator.js');
  const routeKit = (fetchFn, cachesObj) => new Function('fetch', 'caches', genSrc + '\n;return { doPlacePhoto, v3Hash, v3PhotoQueries, v3StarterBase, PHOTO_QUERY, V3_COLORFUL, V3_COPYBOOK };')(fetchFn, cachesObj);
  {
    const calls = [];
    const gfetch = async (u, o) => {
      u = String(u); calls.push({ u, h: (o && o.headers) || {} });
      if (/\/v1\/places\/[^/]+$/.test(u)) return json(GPHOTOS);
      if (/\/media\?/.test(u)) return json({ name: u, photoUri: 'https://lh3.googleusercontent.com/p/' + u.split('/photos/')[1].split('/')[0] + '=w' + u.match(/maxWidthPx=(\d+)/)[1] });
      return json({}, 404);
    };
    const C = edgeCache();
    const env = { GOOGLE_PLACES_KEY: 'SECRET_KEY_123', KV: kv() };
    const K = routeKit(gfetch, C);
    const go = (q) => K.doPlacePhoto(new Request('https://websprout.app/api/place-photo?' + q), env);
    let res = await go('pid=' + PID + '&i=1&w=5000');
    t.eq(res.status, 302, 'place-photo redirects to the photo');
    t.eq(res.headers.get('location'), 'https://lh3.googleusercontent.com/p/wide2=w1600', 'redirect goes to the right photo, width clamped to 1600');
    t.ok(!/SECRET_KEY/.test(JSON.stringify([...res.headers])), 'the API key never reaches the browser');
    t.ok(/max-age=604800/.test(res.headers.get('cache-control') || ''), 'redirect is cached for 7 days');
    t.eq(env.KV.ttl['pphotos:' + PID], 86400, 'the photo list is kept for 24 hours');
    t.eq(env.KV.m.get('gphoto:count:' + new Date().toISOString().slice(0, 7)), '2', 'each billed Google call is counted for the month');
    t.eq(calls[0].h['X-Goog-FieldMask'], 'photos', 'photo list asks Google only for the photos field');
    t.ok(/\/v1\/places\/P1\/photos\/wide2\/media\?maxWidthPx=1600&skipHttpRedirect=true$/.test(calls[1].u), 'media call uses skipHttpRedirect ' + calls[1].u);
    const n = calls.length;
    res = await go('pid=' + PID + '&i=1&w=5000');
    t.ok(res.status === 302 && calls.length === n, 'a repeat view is served from the edge cache (no Google call)');
    res = await go('pid=' + PID + '&i=0&w=10');
    t.ok(res.status === 302 && /tall1=w1600$/.test(res.headers.get('location')) && calls.length === n + 1, 'a new photo reuses the cached list; always fetched at one size (1600)');
    const kWide = K.v3Hash('places/P1/photos/wide2'); const n2 = calls.length;
    await go('pid=' + PID + '&i=1&w=1600&k=' + kWide);
    const otherDc = routeKit(gfetch, edgeCache());
    res = await otherDc.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=1&w=1600&k=' + kWide), env);
    t.ok(res.status === 302 && /wide2=w1600$/.test(res.headers.get('location')) && calls.length === n2, 'another data center reuses the stored image URL with no Google call');
    res = await go('pid=' + PID + '&i=7&w=800');
    t.eq(res.status, 404, 'a photo index the listing does not have is a 404');
    // Google reordered the list: the photo hash still finds the same photo
    const C2 = edgeCache(), env2 = { GOOGLE_PLACES_KEY: 'k', KV: kv() };
    const K2 = routeKit(async (u) => (/\/media\?/.test(String(u)) ? json({ photoUri: 'https://lh3.googleusercontent.com/p/' + String(u).split('/photos/')[1].split('/')[0] }) : json({ photos: GPHOTOS.photos.slice().reverse() })), C2);
    res = await K2.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=1&w=1600&k=' + K.v3Hash('places/P1/photos/wide3')), env2);
    t.eq(res.headers.get('location'), 'https://lh3.googleusercontent.com/p/wide3', 'the photo hash finds the right photo after Google reorders');
    const K3 = routeKit(async () => json({ error: 'quota' }, 429), edgeCache());
    res = await K3.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=0&w=800'), { GOOGLE_PLACES_KEY: 'k' });
    t.eq(res.status, 404, 'a Google error is a 404, so the image collapses');
    // monthly cap: no Google call; the Unsplash backup (fb) is shown instead
    const capCalls = []; const K4 = routeKit(async (u) => { capCalls.push(u); return json(GPHOTOS); }, edgeCache());
    const capEnv = { GOOGLE_PLACES_KEY: 'k', KV: kv(), GPHOTO_MONTHLY_CAP: '5' };
    await capEnv.KV.put('gphoto:count:' + new Date().toISOString().slice(0, 7), '5');
    const fbUrl = 'https://images.unsplash.com/photo-9?ixid=1&w=1680&q=75&auto=format&fit=crop';
    res = await K4.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=0&w=1600&fb=' + encodeURIComponent(fbUrl)), capEnv);
    t.ok(res.status === 302 && res.headers.get('location') === fbUrl && capCalls.length === 0, 'at the monthly cap: no Google call, redirect to the Unsplash backup');
    res = await K4.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=0&w=1600'), capEnv);
    t.ok(res.status === 404 && capCalls.length === 0, 'at the cap without a backup: 404');
    res = await K4.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=0&w=1600&fb=' + encodeURIComponent('https://evil.example/x.jpg')), capEnv);
    t.eq(res.status, 400, 'a backup that is not an Unsplash image is rejected');
    // default cap is 900
    const env900 = { GOOGLE_PLACES_KEY: 'k', KV: kv() }; await env900.KV.put('gphoto:count:' + new Date().toISOString().slice(0, 7), '900');
    res = await K4.doPlacePhoto(new Request('https://websprout.app/api/place-photo?pid=' + PID + '&i=0&w=1600'), env900);
    t.ok(res.status === 404 && capCalls.length === 0, 'the default monthly cap is 900 calls');
  }

  // ---- buildV3Site with Google and Unsplash faked ----
  const fullSrc = rd('10-engine.js') + '\n' + genSrc + '\n;return { buildV3Site };';
  const builder = (handler) => { const calls = []; const f = async (u, o) => { u = String(u); calls.push(u); return handler(u, o); }; return { calls, build: new Function('fetch', fullSrc)(f).buildV3Site }; };
  const KEYS = () => ({ GOOGLE_PLACES_KEY: 'k', UNSPLASH_ACCESS_KEY: 'u', KV: kv() });
  const both = (u) => (u.indexOf('places.googleapis.com') > -1 ? json(GPHOTOS) : (u.indexOf('/search/photos') > -1 ? json(UNS(30)) : json({})));
  {
    const B = builder(both);
    const s = (await B.build({ name: 'Glow', type: 'Vegan bakery', servicesText: 'Sourdough\nCustom cakes', googlePlaceId: PID }, KEYS())).site;
    const keys = Object.keys(s.photos); const heroK = keys.find((k) => /^hero-/.test(k));
    t.ok(/^https:\/\/websprout\.app\/api\/place-photo\?pid=ChIJ_test_place_id_123&i=1&w=1600&k=/.test(s.photos[heroK]), 'linked Google listing: hero is the business’s own (landscape) photo ' + s.photos[heroK]);
    t.eq(JSON.stringify(s.photoCredits[heroK]), JSON.stringify({ name: 'Bo Visitor', link: 'https://maps.google.com/maps/contrib/2', source: 'google' }), 'Google photo credit names the author and source');
    const g = keys.filter((k) => /^gallery-/.test(k)).map((k) => s.photos[k]);
    t.ok(g.length === 3 && g.filter((u) => /place-photo/.test(u)).length === 2 && g.filter((u) => /^https:\/\/images\.unsplash\.com\//.test(u)).length === 1, 'gallery uses the other Google photos, Unsplash fills the rest');
    const k0 = keys.find((k) => /&i=0&/.test(s.photos[k]));
    t.eq(k0 && s.photoCredits[k0].link, 'https://maps.google.com/maps/contrib/1', 'protocol-relative author links become https');
    const fbs = s.photoFallbacks || {};
    const gKeys = keys.filter((k) => /place-photo/.test(s.photos[k]));
    t.ok(gKeys.length === 3 && gKeys.every((k) => fbs[k] && /^https:\/\/images\.unsplash\.com\//.test(fbs[k].url) && s.photos[k].indexOf('&fb=' + encodeURIComponent(fbs[k].url)) > -1), 'each Google photo carries an Unsplash backup (photoFallbacks + fb)');
    t.eq(new Set(Object.values(s.photos).filter((u) => /^https:\/\/images\.unsplash\.com\//.test(u)).concat(Object.values(fbs).map((f) => f.url))).size, 4, 'backups are different from the Unsplash photos already shown');
    const dl = B.calls.filter((u) => /\/download$/.test(u));
    t.eq(dl.length, 1, 'only the Unsplash photo used is reported to Unsplash, never the Google ones');
    t.ok(B.calls.indexOf('https://places.googleapis.com/v1/places/' + PID) > -1 && B.calls.some((u) => /query=vegan%20bakery%20sourdough%20custom%20cakes/.test(u)), 'Google and Unsplash are both asked, Unsplash with the business’s own words');
  }
  {
    const B = builder(both);
    const s = (await B.build({ name: 'Glow', type: 'Vegan bakery' }, KEYS())).site;
    t.ok(!B.calls.some((u) => /googleapis/.test(u)) && Object.values(s.photos).every((u) => /images\.unsplash\.com/.test(u)) && Object.values(s.photoCredits).every((c) => !c.source), 'no Google listing: Unsplash only');
    t.eq(new Set(Object.values(s.photos)).size, Object.keys(s.photos).length, 'no photo is used twice on one site');
  }
  {
    const B = builder((u) => (u.indexOf('googleapis') > -1 ? json({ error: 1 }, 500) : both(u)));
    const s = (await B.build({ name: 'Glow', type: 'Bakery', googlePlaceId: PID }, KEYS())).site;
    t.ok(Object.keys(s.photos).length === 4 && Object.values(s.photos).every((u) => /^https:\/\/images\.unsplash\.com\//.test(u)), 'Google error: falls back to Unsplash for everything');
  }
  {
    const B = builder(both); const env = KEYS();
    await env.KV.put('pphotos:' + PID, JSON.stringify([{ name: 'places/P1/photos/x', w: 2, h: 1, by: 'A', link: '' }]));
    await env.KV.put('gphoto:count:' + new Date().toISOString().slice(0, 7), '900');
    const s = (await B.build({ name: 'Glow', type: 'Bakery', googlePlaceId: PID }, env)).site;
    t.ok(!B.calls.some((u) => /googleapis/.test(u)) && Object.values(s.photos).every((u) => /^https:\/\/images\.unsplash\.com\//.test(u)) && !s.photoFallbacks, 'at the monthly cap the generator skips Google photos entirely');
  }
  {
    const slow = (u, o) => (u.indexOf('googleapis') > -1 ? new Promise((res, rej) => { const tm = setTimeout(() => res(json(GPHOTOS)), 8000); if (o && o.signal) o.signal.addEventListener('abort', () => { clearTimeout(tm); rej(new Error('aborted')); }); }) : both(u));
    const B = builder(slow); const t0 = Date.now();
    const s = (await B.build({ name: 'Glow', type: 'Bakery', googlePlaceId: PID }, KEYS())).site;
    const ms = Date.now() - t0;
    t.ok(ms < 4500 && Object.values(s.photos).every((u) => /^https:\/\/images\.unsplash\.com\//.test(u)), 'a slow Google lookup is cut off (~3s) and Unsplash is used (' + ms + 'ms)');
  }
  {
    // too few results for the specific search → retry with the category search
    const B = builder((u) => (u.indexOf('/search/photos') > -1 ? json(/query=artisan/.test(u) ? UNS(30, 'c') : UNS(2, 's')) : json({})));
    const s = (await B.build({ name: 'Glow', type: 'Gluten free bakery', servicesText: 'Teff loaves' }, KEYS())).site;
    const q = B.calls.filter((u) => /search\/photos/.test(u)).map((u) => decodeURIComponent(u.split('query=')[1]));
    t.eq(q.join(' | '), 'gluten free bakery teff loaves | artisan bakery bread pastries', 'few results: retried with the category search');
    t.eq(Object.keys(s.photos).length, 4, 'retry results fill the hero and gallery');
    const heroes = new Set();
    for (let i = 0; i < 12; i++) { const B2 = builder(both); const s2 = (await B2.build({ name: 'Glow', type: 'Bakery' }, KEYS())).site; heroes.add(Object.entries(s2.photos).find(([k]) => /^hero-/.test(k))[1]); }
    t.ok(heroes.size >= 4, 'two sites of the same type usually get different hero photos (' + heroes.size + ' of 12)');
    t.ok([...heroes].every((u) => +u.match(/photo-u(\d+)/)[1] < 10), 'heroes come from the 10 most relevant results');
  }
  {
    // relevance check: Unsplash's words for each photo (alt text, description, tags) decide what fits
    const ph = (id, words) => Object.assign({ id, urls: { regular: 'https://images.unsplash.com/photo-' + id + '?ixid=1' }, user: { name: 'U', links: { html: 'https://unsplash.com/@u' } }, links: { download_location: 'https://api.unsplash.com/photos/' + id + '/download' } }, words);
    const PLUMB = { results: [ph('elec1', { alt_description: 'electrician working on an electrical panel' }), ph('elec2', { alt_description: 'man installing wiring in a breaker box', tags: [{ title: 'electrician' }] }), ph('desk', { alt_description: 'woman typing on a laptop in an office' }), ph('pose', { alt_description: 'smiling man posing for a portrait' }),
      ph('pl1', { alt_description: 'man fixing a pipe under the kitchen sink' }), ph('pl2', { description: 'Plumber repairing a leaking faucet with a wrench' }), ph('pl3', { alt_description: 'copper pipes', tags: [{ title: 'plumbing' }] }), ph('pl4', { alt_description: 'bathroom toilet and sink being installed' }), ph('pl5', { alt_description: 'water heater in a basement' })] };
    const heroes = new Set(), used = new Set(); let qs = [];
    for (let i = 0; i < 12; i++) {
      const B = builder((u) => (u.indexOf('/search/photos') > -1 ? json(PLUMB) : json({})));
      const s = (await B.build({ name: 'Ridgeline Plumbing ' + i, type: 'Plumber', city: 'Asheville, NC', servicesText: 'Leak repairs\nDrain cleaning' }, KEYS())).site;
      heroes.add(Object.entries(s.photos).find(([k]) => /^hero-/.test(k))[1].match(/photo-(\w+)/)[1]);
      Object.values(s.photos).forEach((u) => used.add(u.match(/photo-(\w+)/)[1]));
      qs = B.calls.filter((u) => /search\/photos/.test(u));
    }
    t.ok([...heroes].every((h) => /^pl/.test(h)) && heroes.size >= 2, 'electrician photos listed first, plumbing photos later: a plumber always gets a plumbing hero, with variety (' + [...heroes] + ')');
    t.ok(![...used].some((h) => /elec|desk|pose/.test(h)), 'electrician, office and posed-portrait photos are never used for a plumber (' + [...used] + ')');
    t.ok(/query=(plumber%20fixing%20pipe%20under%20sink|plumbing%20pipes%20wrench|plumber%20repair%20sink)/.test(qs[0]) && qs.every((u) => /content_filter=high/.test(u)), 'a plumber searches a hand-written plumbing scene first, still with content_filter=high (' + decodeURIComponent(qs[0].split('query=')[1]) + ')');
    const ELEC = { results: [ph('p1', { alt_description: 'plumber fixing pipe under sink' }), ph('e1', { alt_description: 'electrician wiring a panel' }), ph('e2', { alt_description: 'electrical outlet repair' }), ph('e3', { alt_description: 'man installing light switch' }), ph('e4', { description: 'circuit breaker panel' })] };
    const Be = builder((u) => (u.indexOf('/search/photos') > -1 ? json(ELEC) : json({})));
    const se = (await Be.build({ name: 'Spark', type: 'Electrician' }, KEYS())).site;
    t.ok(new Set(Object.values(se.photos)).size === 4 && !Object.values(se.photos).some((u) => /photo-p1/.test(u)), 'an electrician never gets the plumbing photo');
    const BAKE = { results: [ph('pz', { alt_description: 'pepperoni pizza on a wooden table' }), ph('b1', { alt_description: 'fresh bread loaves' }), ph('b2', { alt_description: 'croissants and pastries in a bakery' }), ph('b3', { alt_description: 'baker shaping sourdough' }), ph('b4', { alt_description: 'cakes in a bakery window' })] };
    const bk = (await builder((u) => (u.indexOf('/search/photos') > -1 ? json(BAKE) : json({}))).build({ name: 'Crumb', type: 'Bakery' }, KEYS())).site;
    t.ok(!Object.values(bk.photos).some((u) => /photo-pz/.test(u)), 'a bakery doesn’t get a pizza photo');
    // exactly four usable photos, so the (allowed) pizza photo is always among the ones picked
    const BAKE4 = { results: BAKE.results.slice(0, 4) };
    const pzb = (await builder((u) => (u.indexOf('/search/photos') > -1 ? json(BAKE4) : json({}))).build({ name: 'Crust', type: 'Pizza bakery' }, KEYS())).site;
    t.ok(Object.values(pzb.photos).some((u) => /photo-pz/.test(u)), '…unless the type says pizza');
    // reporting: only the photos actually used are pinged, and the hourly cap still holds
    const Bd = builder((u) => (u.indexOf('/search/photos') > -1 ? json(PLUMB) : json({})));
    const sd = (await Bd.build({ name: 'Drip', type: 'Plumber' }, KEYS())).site;
    const pinged = Bd.calls.filter((u) => /\/download$/.test(u)).map((u) => u.split('/photos/')[1].split('/')[0]);
    t.ok(pinged.length === new Set(Object.values(sd.photos)).size && pinged.every((id) => /^pl/.test(id)), 'download events go to the photos used (' + pinged + ')');
    const capped = builder((u) => (u.indexOf('/search/photos') > -1 ? json(PLUMB) : json({})));
    const K0 = KEYS(); K0.UNSPLASH_HOURLY_CAP = '0';
    const sc0 = (await capped.build({ name: 'Drip', type: 'Plumber' }, K0)).site;
    t.ok(!capped.calls.some((u) => /search\/photos/.test(u)) && !Object.keys(sc0.photos).length, 'the hourly Unsplash cap still stops searches');
  }
  {
    const K = routeKit(fetch, undefined);
    const sc = (type) => ({ photoQuery: K.v3StarterBase(type) && (K.V3_COPYBOOK[K.v3StarterBase(type).category] || {}).photo });
    t.eq(K.v3PhotoQueries({ type: 'Local Business', services: [] }, sc('')).join('|'), 'small business owner shop', 'a vague type uses the category search');
    t.eq(K.v3PhotoQueries({ type: 'Plumbing services', services: [{ name: 'Free estimates' }, { name: 'Repairs - $90' }, { name: 'Drain cleaning' }] }, { photoQuery: 'plumber repair sink' }).join('|'), 'plumbing drain cleaning|plumber repair sink', 'generic service names are skipped, specific ones used');
    t.eq(K.v3PhotoQueries({ type: 'Café', services: [] }, { photoQuery: 'cozy coffee shop interior' }).join('|'), 'cafe|cozy coffee shop interior', 'accents are dropped from searches');

    // ---- business types ----
    const MAP = [['Plumber', 'home'], ['Electrician', 'home'], ['Heating & air', 'home'], ['Air conditioning repair', 'home'], ['Roofer', 'home'], ['House painting', 'home'], ['General contractor', 'home'], ['Kitchen remodeling', 'home'], ['Garage door repair', 'home'],
      ['Locksmith', 'locksmith'], ['Lock and key', 'locksmith'], ['Chiropractor', 'health'], ['Physical therapy', 'health'], ['Daycare', 'childcare'], ['Child care center', 'childcare'], ['Preschool', 'childcare'], ['Dog daycare', 'pet'],
      ['Tutoring', 'education'], ['Music lessons', 'education'], ['Boarding school', 'education'], ['Florist', 'events'], ['Flower shop', 'events'], ['Food truck', 'restaurant'], ['Dog walking', 'pet'], ['Pet sitting', 'pet'],
      ['Massage therapist', 'spa'], ['Yoga studio', 'fitness'], ['Pilates studio', 'fitness'], ['Nail salon', 'spa'], ['Hair salon', 'salon'], ['Hair and nail salon', 'salon'], ['Pet groomer', 'pet'], ['Pet grooming salon', 'pet'],
      ['Car wash', 'auto'], ['Mobile car detailing', 'auto'], ['Appliance repair', 'appliance'], ['Washer and dryer repair', 'appliance'], ['Appliance repair shop', 'appliance'], ['Junk removal', 'moving'], ['Tailor', 'tailor'], ['Tailor shop', 'tailor'], ['Alterations', 'tailor'],
      ['Barber shop', 'barber'], ['Coffee shop', 'cafe'], ['Gift shop', 'retail'], ['Body shop', 'auto'], ['Bakery', 'bakery'], ['Mexican restaurant', 'restaurant'], ['House cleaning', 'cleaning']];
    const wrong = MAP.filter(([ty, cat]) => K.v3StarterBase(ty).category !== cat).map(([ty, cat]) => ty + '→' + K.v3StarterBase(ty).category + ' (want ' + cat + ')');
    t.eq(wrong.join(', '), '', 'business types map to the right category');
    t.ok(K.v3StarterBase('Hot dog stand').category !== 'pet', 'a hot dog stand is not a pet business');
    const NEW = ['locksmith', 'appliance', 'tailor', 'childcare'];
    t.eq(NEW.filter((c) => !(K.PHOTO_QUERY[c] && K.V3_COLORFUL[c] && K.V3_COPYBOOK[c] && K.V3_COPYBOOK[c].photo)).join(','), '', 'new categories have photo searches, colorful themes and starter copy');
  }
  // new types generate complete sites, with the right action page
  const B = builder(() => json({}));
  for (const [type, cat, action] of [['Locksmith', 'locksmith', 'quote'], ['Appliance repair', 'appliance', 'book'], ['Tailor', 'tailor', 'book'], ['Daycare', 'childcare', 'book'], ['Car wash', 'auto', 'contact'], ['Junk removal', 'moving', 'quote']]) {
    const s = (await B.build({ name: 'Maple ' + type, type, city: 'Springfield' }, {})).site;
    const svc = s.pages.flatMap((p) => p.sections).find((x) => x.type === 'services');
    t.ok(s.pages.some((p) => p.path === action) && svc && svc.items.length >= 3 && s.pages.flatMap((p) => p.sections).some((x) => x.type === 'faq'), type + ' gets services, FAQ and a ' + action + ' page');
  }
  const live = await createSite(base, { name: 'Keyed Up', type: 'Locksmith', city: 'Austin' });
  t.ok(/Lockouts|Rekeying|Lock changes|Key cutting/.test(live.html), 'a locksmith site shows locksmith services');
};
