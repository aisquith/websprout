const lib = require('./lib');
// Local search structured data: every published page (home and sub-pages, multi- and single-page sites) carries a
// valid schema.org LocalBusiness JSON-LD with the most specific type, the site's canonical URL, contact details,
// hours and services; sub-pages add a BreadcrumbList. Ratings only ever come from Google, never owner-typed reviews.
// Also: Google place photos are credited to their author and Google (not Unsplash) and get responsive widths.
const { createSite, post } = require('./lib');

const ldOf = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch (e) { return { __bad: m[1].slice(0, 120) }; } });

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const WS = new Function('globalThis', (await (await fetch(base + '/ws-engine.js')).text()) + ';return globalThis.WS;')({});

  // Type mapping works from the free-text business type, including categories added later.
  const map = { 'Barber shop': 'HairSalon', 'Hair salon': 'HairSalon', 'Nail salon': 'NailSalon', 'Bakery': 'Bakery', 'Coffee shop': 'CafeOrCoffeeShop', 'Mexican restaurant': 'Restaurant', 'Plumber': 'Plumber', 'Electrician': 'Electrician', 'HVAC repair': 'HVACBusiness', 'Roofing': 'RoofingContractor', 'House painter': 'HousePainter', 'General contractor': 'GeneralContractor', 'Locksmith': 'Locksmith', 'Auto repair': 'AutoRepair', 'Car wash': 'AutoWash', 'Dentist': 'Dentist', 'Physical therapy': 'Physiotherapy', 'Daycare': 'ChildCare', 'Florist': 'Florist', 'Pet store': 'PetStore', 'Dog grooming': 'LocalBusiness', 'Law firm': 'Attorney', 'Yoga studio': 'ExerciseGym', 'Food truck': 'FoodEstablishment', 'Tutoring': 'LocalBusiness', '': 'LocalBusiness' };
  const wrong = Object.keys(map).filter((k) => WS.ldType(k) !== map[k]).map((k) => k + '=' + WS.ldType(k));
  t.eq(wrong.join(', '), '', 'business types map to the most specific schema.org type');

  // A real generated, published multi-page site
  const s = await createSite(base, { name: 'Pipe <Pros>', type: 'Plumber', city: 'Austin, TX', address: '12 Main St, Austin, TX 78701', phone: '512-555-0100', instagram: 'pipepros', servicesText: 'Drain cleaning - $120\nLeak repair from $90\nWater heaters' });
  const site = JSON.parse(JSON.stringify(s.site));
  const slug = 'ld' + Date.now().toString(36);
  let r = await lib.pubPost(base, { html: s.html, site: s.site, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r.status, 200, 'publishes');
  const origin = 'https://' + slug + '.websprout.app';
  const paths = site.pages.map((p) => p.path);
  for (const p of paths) {
    const html = await (await fetch(base + '/s/' + slug + '/' + p)).text();
    const lds = ldOf(html);
    const where = (p || 'home') + ': ';
    t.ok(lds.length && lds.every((x) => !x.__bad), where + 'JSON-LD is valid JSON');
    const biz = lds.find((x) => x['@type'] === 'Plumber');
    if (!t.ok(!!biz, where + 'has a Plumber (LocalBusiness) JSON-LD ' + JSON.stringify(lds.map((x) => x['@type'])))) continue;
    t.eq(biz['@context'], 'https://schema.org', where + '@context');
    t.eq(biz.name, 'Pipe <Pros>', where + 'name');
    t.eq(biz.url, origin + '/', where + 'url is the canonical site URL');
    t.eq(biz.telephone, '512-555-0100', where + 'telephone');
    t.ok(biz.address && biz.address['@type'] === 'PostalAddress' && biz.address.streetAddress === '12 Main St' && biz.address.addressLocality === 'Austin' && biz.address.addressRegion === 'TX' && biz.address.postalCode === '78701', where + 'PostalAddress ' + JSON.stringify(biz.address));
    t.ok((biz.sameAs || []).includes('https://instagram.com/pipepros'), where + 'sameAs has Instagram');
    const offers = (biz.hasOfferCatalog && biz.hasOfferCatalog.itemListElement) || [];
    const byName = (n) => offers.find((o) => o.itemOffered && o.itemOffered.name === n);
    const dc = byName('Drain cleaning'); // services show "from $120", so it is a starting price
    t.ok(dc && dc.priceCurrency === 'USD' && (dc.price === 120 || (dc.priceSpecification && dc.priceSpecification.minPrice === 120)), where + 'service with a price ' + JSON.stringify(dc));
    t.ok(byName('Leak repair') && byName('Leak repair').priceSpecification && byName('Leak repair').priceSpecification.minPrice === 90, where + '"from" price is a minimum');
    t.ok(byName('Water heaters') && byName('Water heaters').price == null, where + 'service without a price has no invented price');
    t.eq(biz.priceRange, '$90–$120', where + 'priceRange from real prices');
    t.ok(!biz.aggregateRating && !biz.review, where + 'no rating markup without Google data');
    t.ok(!/<\/script>[^<]*Pros/.test(html) && html.indexOf('"Pipe \\u003cPros>"') > -1, where + '< is escaped inside the JSON-LD');
    const bc = lds.find((x) => x['@type'] === 'BreadcrumbList');
    if (p) t.ok(bc && bc.itemListElement.length === 2 && bc.itemListElement[1].item === origin + '/' + p && bc.itemListElement[0].item === origin + '/', where + 'BreadcrumbList Home > page');
    else t.ok(!bc, 'home has no breadcrumb');
  }

  // Hours, email, logo, Google listing and rating (Google data only), single-page site
  const one = JSON.parse(JSON.stringify(site));
  one.pages = [one.pages[0]];
  Object.assign(one.biz, { email: 'hi@pipepros.test', logo: 'https://example.com/logo.png', googlePlaceId: 'ChIJ_test_place_123', googleRating: 4.7, googleReviews: 88, hours: [{ d: 'Mon', open: '08:00', close: '17:00' }, { d: 'Tue', open: '8:30', close: '17:00' }, { d: 'Sun' }] });
  one.pages[0].sections.push({ id: 'rv-own', type: 'reviews', variant: 'wall', items: [{ quote: 'Best ever', name: 'Mom' }] });
  const slug1 = 'ld1' + Date.now().toString(36);
  r = await lib.pubPost(base, { html: WS.renderSite(one, { mode: 'live' }), site: one, siteId: s.siteId, key: s.formKey, slug: slug1 });
  t.eq(r.status, 200, 'single-page site publishes');
  const h1 = await (await fetch(base + '/s/' + slug1)).text();
  const b1 = ldOf(h1).find((x) => x['@type'] === 'Plumber') || {};
  t.eq(b1.url, 'https://' + slug1 + '.websprout.app/', 'single-page site: canonical url');
  t.eq(b1.email, 'hi@pipepros.test', 'public email');
  t.eq(b1.logo, 'https://example.com/logo.png', 'logo');
  t.eq(JSON.stringify((b1.openingHoursSpecification || []).map((o) => [o.dayOfWeek.replace('https://schema.org/', ''), o.opens, o.closes])), '[["Monday","08:00","17:00"],["Tuesday","08:30","17:00"]]', 'openingHoursSpecification from hours (closed days left out)');
  t.ok((b1.sameAs || []).some((u) => /place_id:ChIJ_test_place_123/.test(u)), 'sameAs has the Google listing');
  t.ok(!b1.aggregateRating && !b1.review, 'no rating markup even with Google rating data (Google forbids aggregated ratings)');
  t.ok(!b1.review && !JSON.stringify(b1).includes('Best ever'), 'owner-typed reviews never become review markup');
  delete one.biz.googlePlaceId;
  t.ok(!WS.businessLd(one).aggregateRating, 'no rating markup without a linked Google listing');

  // Google place photos: credited "Photo: name · Google" with nofollow, never as Unsplash; responsive widths via w=
  const g = JSON.parse(JSON.stringify(site));
  const hero = g.pages[0].sections.find((x) => x.type === 'hero'); hero.variant = 'photo';
  const gurl = 'https://websprout.app/api/place-photo?pid=ChIJ_test&i=0&w=1600';
  g.photos = { [hero.id + '.photo']: gurl };
  g.photoCredits = { [hero.id + '.photo']: { name: 'Ana Ruiz', link: 'https://maps.google.com/maps/contrib/123', source: 'google' } };
  let gh = WS.renderSite(g, { mode: 'live' });
  const credits = (gh.match(/<p class="credits">([\s\S]*?)<\/p>/) || [])[1] || '';
  t.ok(/Photo: <a href="https:\/\/maps\.google\.com\/maps\/contrib\/123" rel="nofollow noopener">Ana Ruiz<\/a> · Google/.test(credits), 'Google photo credited to its author and Google ' + credits.slice(0, 200));
  t.ok(!/unsplash/i.test(credits), 'Google photo is not credited to Unsplash');
  t.ok(/srcset="[^"]*place-photo\?pid=ChIJ_test&amp;i=0&amp;w=400 400w/.test(gh) && /w=1600 1600w/.test(gh), 'place photo gets responsive widths (400-1600)');
  t.ok((ldOf(gh)[0] || {}).image === gurl, 'JSON-LD image is the hero photo');
  g.photoCredits[hero.id + '.photo'].link = '';
  g.photos.extra = 'https://images.unsplash.com/photo-1?w=1680'; g.photoCredits.extra = { name: 'Jo Lens', link: 'https://unsplash.com/@jo' };
  gh = WS.renderSite(g, { mode: 'live' });
  t.ok(/Photo: Ana Ruiz · Google/.test(gh) && /Photos by <a href="https:\/\/unsplash\.com\/@jo\?utm_source=websprout&amp;utm_medium=referral">Jo Lens<\/a> on <a href="https:\/\/unsplash\.com\/\?utm_source/.test(gh), 'Unsplash credits unchanged next to Google credits');
  g.photoFallbacks = { [hero.id + '.photo']: { url: 'https://images.unsplash.com/photo-2?w=1680', name: 'Kai Backup', link: 'https://unsplash.com/@kai' } };
  gh = WS.renderSite(g, { mode: 'live' });
  t.ok(/Photos by <a[^>]*>Jo Lens<\/a>, <a href="https:\/\/unsplash\.com\/@kai\?utm_source=websprout&amp;utm_medium=referral">Kai Backup<\/a> on <a href="https:\/\/unsplash\.com/.test(gh) && /Photo: Ana Ruiz · Google/.test(gh), 'a Google photo\'s Unsplash backup photographer is credited too');
  delete g.photos[hero.id + '.photo'];
  t.ok(!/Kai Backup/.test(WS.renderSite(g, { mode: 'live' })), 'backup credit goes when the photo is removed');
};
