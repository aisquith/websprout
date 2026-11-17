// What each kind of business gets: labels that fit (a bakery takes orders, a bistro reservations, a plumber
// schedules visits), a page recipe per family, numbers only from real data, and layouts that vary between
// businesses but stay put for the same one. The generator runs in Node (no photos, no network) for speed;
// a few sites are also built on the real worker.
const fs = require('fs');
const path = require('path');
const { createSite } = require('./lib');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
const UNS = (n) => ({ results: Array.from({ length: n }, (_, i) => ({ id: 'u' + i, urls: { regular: 'https://images.unsplash.com/photo-u' + i + '?ixid=1' }, user: { name: 'U' + i, links: { html: 'https://unsplash.com/@u' + i } }, links: { download_location: '' } })) });

module.exports = async function (ctx, t) {
  const src = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, v3Labels, v3StarterBase };';
  const K = new Function('fetch', src)(async () => json({}, 404));
  const P = new Function('fetch', src)(async (u) => (String(u).indexOf('/search/photos') > -1 ? json(UNS(30)) : json({})));
  const build = async (body, withPhotos) => (withPhotos ? (await P.buildV3Site(body, { UNSPLASH_ACCESS_KEY: 'u' })) : (await K.buildV3Site(body, {}))).site;
  const secs = (s) => s.pages.flatMap((p) => p.sections);
  const homeTypes = (s) => s.pages[0].sections.map((x) => x.type);
  const before = (arr, a, b) => arr.indexOf(a) > -1 && arr.indexOf(b) > -1 && arr.indexOf(a) < arr.indexOf(b);
  const sig = (s) => s.pages[0].sections.map((x) => x.type + ':' + (x.variant || '')).join(' ') + '|' + s.typeset + '|' + s.palette + '|' + s.pages.map((p) => p.title).join(',');
  const base = (type, extra) => Object.assign({ name: 'Maple ' + type, type, city: 'Springfield', phone: '(555) 010-0123', address: '2210 India St, Springfield, CA' }, extra || {});

  // ---- labels per business type: header button, main button, nav and page names agree ----
  const LABELS = [
    ['Bakery', 'Order ahead', 'Order', 'Menu'], ['Donut shop', 'Order ahead', 'Order', 'Menu'], ['Mexican restaurant', 'Reserve a table', 'Reserve', 'Menu'], ['Italian restaurant', 'Reserve a table', 'Reserve', 'Menu'],
    ['Taqueria', 'Order ahead', 'Order', 'Menu'], ['Pizza place', 'Order ahead', 'Order', 'Menu'], ['Food truck', 'Book the truck', 'Book the Truck', 'Menu'], ['Coffee shop', 'Visit us', null, 'Menu'],
    ['Plumber', 'Schedule a visit', 'Schedule', 'Services'], ['Electrician', 'Schedule a visit', 'Schedule', 'Services'], ['HVAC repair', 'Schedule a visit', 'Schedule', 'Services'], ['Roofer', 'Request an estimate', 'Estimate', 'Services'],
    ['House cleaning', 'Get a quote', 'Get a Quote', 'Services'], ['Lawn care', 'Get a quote', 'Get a Quote', 'Services'], ['Handyman', 'Get a quote', 'Get a Quote', 'Services'], ['Moving company', 'Get a quote', 'Get a Quote', 'Services'],
    ['Auto repair', 'Book a service', 'Book', 'Services'], ['Barber shop', 'Book a cut', 'Book', 'Services'], ['Nail salon', 'Book an appointment', 'Book', 'Services'], ['Massage therapist', 'Book a massage', 'Book', 'Treatments'],
    ['Yoga studio', 'Book a class', 'Book', 'Classes'], ['Dog grooming', 'Book a groom', 'Book', 'Services'], ['Tattoo studio', 'Book a consultation', 'Consultation', 'Services'], ['Law firm', 'Book a consultation', 'Consultation', 'Practice Areas'],
    ['Dentist', 'Request an appointment', 'Appointments', 'Treatments'], ['Accountant', 'Book a call', 'Book a Call', 'Services'], ['Daycare', 'Book a tour', 'Book a Tour', 'Programs'], ['Piano lessons', 'Book a first lesson', 'Book', 'Lessons'],
    ['Florist', 'Order flowers', 'Order', 'Flowers'], ['Wedding photographer', 'Check availability', 'Availability', 'Services'], ['Web design agency', 'Start a project', 'Start a Project', 'Services'], ['Church', 'Plan a visit', null, 'Get Involved'],
  ];
  const wrong = [];
  for (const [type, btn, page, main] of LABELS) {
    const s = await build(base(type));
    const b = s.biz; const titles = s.pages.map((p) => p.title);
    const bkPage = s.pages.find((p) => /^(book|reserve|quote|order)$/.test(p.path));
    const ctas = secs(s).filter((x) => x.type === 'cta');
    const why = [];
    if (b.bookLabel !== btn) why.push('button ' + b.bookLabel);
    if (page ? (!bkPage || bkPage.title !== page) : !!bkPage) why.push('action page ' + (bkPage && bkPage.title));
    if (titles.indexOf(main) < 0) why.push('main page ' + titles.join(','));
    if (ctas.some((c) => c.button !== b.bookLabel)) why.push('CTA buttons ' + ctas.map((c) => c.button).join(','));
    if (bkPage && ctas.some((c) => c.link !== '#/' + bkPage.path)) why.push('CTA links ' + ctas.map((c) => c.link).join(','));
    if (!bkPage && b.bookShort !== 'Shop' && ctas.some((c) => c.link !== '#/contact')) why.push('CTA links ' + ctas.map((c) => c.link).join(','));
    if (!b.bookShort || b.bookShort.length > 14) why.push('header label ' + b.bookShort);
    if (why.length) wrong.push(type + ': ' + why.join('; '));
  }
  t.eq(wrong.join(' | '), '', 'every business type gets one coherent action across header, buttons, CTAs and page names');

  // bakeries take orders, never table reservations; restaurants get menu wording; trades get quote wording
  for (const type of ['Bakery', 'Vegan bakery', 'Bagel shop', 'Pastry shop']) {
    const s = await build(base(type));
    const txt = JSON.stringify(s);
    t.ok(!/Reserve a table|Book a table|reservation/i.test(txt) && !s.pages.some((p) => p.path === 'reserve'), type + ' never offers a table reservation');
    t.ok(secs(s).some((x) => x.type === 'booking' && x.button === 'Order ahead' && x.variant === 'order') && s.pages.some((p) => p.path === 'order'), type + ' has an order-ahead form (order page, order variant)');
  }
  for (const type of ['Mexican restaurant', 'Pizza restaurant', 'Sushi restaurant', 'Taqueria', 'Restaurant']) {
    const s = await build(base(type));
    const teaser = s.pages[0].sections.find((x) => x.type === 'services');
    t.ok(teaser && /menu|known for|kitchen|favorites|eat with us|at our table/i.test(teaser.title) && !/services/i.test(teaser.title), type + ' home section reads like a menu: "' + (teaser && teaser.title) + '"');
    t.ok(s.pages.some((p) => p.title === 'Menu') && !s.pages.some((p) => p.title === 'Services'), type + ' has a Menu page, not Services');
    t.ok(!/Our services/.test(JSON.stringify(s)), type + ' never says "Our services"');
  }
  for (const type of ['Plumber', 'Roofing', 'House cleaning', 'Lawn care', 'Handyman', 'Junk removal', 'Painter', 'Electrician']) {
    const s = await build(base(type));
    const bk = s.pages.find((p) => p.path === 'quote' || p.path === 'book');
    t.ok(/quote|estimate|schedule a visit/i.test(s.biz.bookLabel) && bk && /quote|estimate|visit/i.test(bk.sections[0].title), type + ' gets quote/estimate wording (' + s.biz.bookLabel + ')');
    t.ok(!/Reserve|Book a table|free quote|free estimate/i.test(JSON.stringify(s)), type + ' never mentions reservations or invents a free offer');
  }
  // a counter-service taqueria does not inherit the restaurant's "Do you take reservations?" FAQ
  {
    const s = await build(base('Taqueria'));
    t.ok(!/reserv/i.test(JSON.stringify(secs(s).filter((x) => x.type === 'faq' || x.type === 'cta'))), 'order-first restaurants have no reservation FAQ or CTA');
  }

  // ---- visit heading: never built from a truncated street ("Find us on India.") ----
  {
    const bad = [];
    for (const type of ['Mexican restaurant', 'Barber shop', 'Law firm', 'Plumber', 'Gift shop', 'Food truck']) {
      const s = await build(base(type));
      secs(s).filter((x) => x.type === 'visit').forEach((v) => { if (!v.title || /Find us on India\.|undefined/.test(v.title)) bad.push(type + ': ' + v.title); });
    }
    t.eq(bad.join(' | '), '', 'location headings are set and read naturally');
    const plumber = await build(base('Plumber'));
    t.ok(secs(plumber).filter((x) => x.type === 'visit').every((v) => /Springfield/.test(v.title)), 'trades describe their service area');
    const truck = await build(base('Food truck', { address: '' }));
    t.ok(secs(truck).filter((x) => x.type === 'visit').every((v) => /Find us around Springfield|Where to find us/.test(v.title)), 'a food truck says where to find it');
  }

  // ---- page recipes by family ----
  {
    const fails = [];
    const check = (label, ok) => { if (!ok) fails.push(label); };
    for (const n of ['A', 'B', 'C', 'D', 'E', 'F']) {
      const food = homeTypes(await build(base('Mexican restaurant', { name: n + ' Cantina' })));
      check('food ' + food, before(food, 'intro', 'visit') && food.indexOf('services') > -1 && before(food, 'services', 'visit') && food.indexOf('steps') < 0 && food[food.length - 1] === 'cta');
      const trade = homeTypes(await build(base('Plumber', { name: n + ' Plumbing' })));
      check('trades ' + trade, before(trade, 'services', 'steps') && before(trade, 'steps', 'visit') && trade.indexOf('intro') < 0 && trade[trade.length - 1] === 'cta');
      const beauty = homeTypes(await build(base('Hair salon', { name: n + ' Salon' })));
      check('beauty ' + beauty, beauty.indexOf('services') > -1 && beauty.indexOf('services') <= 2 && before(beauty, 'services', 'visit') && beauty.indexOf('steps') < 0 && beauty[beauty.length - 1] === 'cta');
      const pro = homeTypes(await build(base('Law firm', { name: n + ' Law' })));
      check('pro ' + pro, before(pro, 'services', 'steps') && before(pro, 'intro', 'steps') && before(pro, 'steps', 'faq') && pro[pro.length - 1] === 'cta');
      const shop = homeTypes(await build(base('Gift shop', { name: n + ' Gifts', ecommerce: true, products: [{ name: 'Mug', price: '$15' }, { name: 'Card', price: '$4' }] })));
      check('retail ' + shop, shop[1] === 'services' && before(shop, 'intro', 'visit'));
    }
    t.eq(fails.join(' | '), '', 'home pages follow their family recipe');
    const law = await build(base('Law firm'));
    t.eq(law.pages.map((p) => p.title).join(','), 'Home,About,Practice Areas,Consultation,Contact', 'professionals lead with About');
    const plumb = await build(base('Plumber'));
    t.eq(plumb.pages.map((p) => p.title).join(','), 'Home,Services,About,Schedule,Contact', 'trades put the request page last');
    const cafe = await build(base('Bakery'));
    t.eq(cafe.pages.map((p) => p.title).join(','), 'Home,Menu,Order,About,Contact', 'food sites: menu, then order');
  }

  // ---- real data only: no invented numbers, team or reviews ----
  {
    const plain = await build(base('Plumber'));
    t.ok(!secs(plain).some((x) => /stats|team|reviews/.test(x.type)), 'no stats, team or reviews without real data');
    t.ok(!/4,800|"312"|"4\.9"|Years on the block|Cuts this year/.test(JSON.stringify(plain)), 'no starter numbers anywhere');
    const one = await build(base('Plumber', { founded: '2004' }));
    t.ok(!secs(one).some((x) => x.type === 'stats'), 'a single real number is not enough for a numbers band');
    const real = await build(base('Plumber', { founded: '2004', googlePlaceId: 'ChIJ_test_place_id_123', rating: '4.7', count: 85 }));
    const st = secs(real).find((x) => x.type === 'stats');
    const yrs = String(new Date().getFullYear() - 2004);
    t.ok(st && st.items.map((i) => i.value).join(',') === yrs + ',4.7,85', 'numbers come straight from the business (' + (st && st.items.map((i) => i.value)) + ')');
    const aboutTypes = real.pages.find((p) => p.path === 'about').sections.map((x) => x.type);
    t.ok(homeTypes(real)[1] === 'trust' && homeTypes(real).indexOf('stats') < 0 && aboutTypes.indexOf('stats') > -1, 'trades show real numbers as trust badges under the hero, the numbers band moves to About (' + homeTypes(real) + ')');
    const fake = await build(base('Plumber', { founded: '3020', rating: 9, count: 'lots' }));
    t.ok(!secs(fake).some((x) => x.type === 'stats'), 'impossible numbers are ignored');
    const team = await build(base('Barber shop', { team: [{ name: 'Ana', role: 'Fades and tapers' }, { name: 'Bo', role: 'Beards' }] }));
    const tm = secs(team).find((x) => x.type === 'team');
    t.ok(tm && tm.items.map((i) => i.name).join(',') === 'Ana,Bo' && tm.variant === 'rows', 'the team shows only the people the owner listed');
    t.ok(homeTypes(team).indexOf('team') > -1, 'beauty businesses show their team on the home page');
    const priced = await build(base('Barber shop', { servicesText: 'Skin fade - $30\nBeard trim: 15\nKids cut $20' }));
    const pr = priced.pages[0].sections.find((x) => x.type === 'prices');
    t.ok(pr && pr.items.map((i) => i.price).join(',') === '$30,$15,$20', 'typed prices become a price list on a beauty home page');
  }

  // ---- variety and stability ----
  {
    const a1 = await build(base('Barber shop', { name: 'Fade & Co' }));
    const a2 = await build(base('Barber shop', { name: 'Fade & Co' }));
    t.eq(sig(a2), sig(a1), 'the same business always gets the same layout');
    t.eq(JSON.stringify(secs(a2).map((x) => x.title || x.text || '')), JSON.stringify(secs(a1).map((x) => x.title || x.text || '')), 'the same business always gets the same copy');
    const sigs = new Set();
    for (const n of ['Fade & Co', 'Sharp Lines', 'Kings Barbers', 'Main Street Cuts', 'Blade Room', 'Hudson Barbers', 'Ace Barbershop', 'Lineup']) sigs.add(sig(await build(base('Barber shop', { name: n }))));
    t.ok(sigs.size >= 3, 'different barbers get different layouts (' + sigs.size + ' of 8)');
    const plumbs = new Set();
    for (const n of ['Drip', 'Flow Pro', 'Pipeline', 'Valve & Son', 'Clear Drain', 'Northside']) plumbs.add(sig(await build(base('Plumber', { name: n + ' Plumbing' }))));
    t.ok(plumbs.size >= 3, 'different plumbers get different layouts (' + plumbs.size + ' of 6)');
    const sd = await build(base('Barber shop', { name: 'Fade & Co', seed: 'other' }));
    t.ok(typeof sd.palette === 'string', 'an explicit seed is accepted');
    // the engine's newer layouts and type themes are used, and fit the family
    const seen = {}; const tsets = {}; let icons = true;
    const fam = { 'Mexican restaurant': 'food', Bakery: 'food', Plumber: 'trades', Roofer: 'trades', 'Hair salon': 'beauty', 'Day spa': 'beauty', 'Law firm': 'pro', Accountant: 'pro', Daycare: 'pro', 'House cleaning': 'trades' };
    for (const type of Object.keys(fam)) for (const n of ['North', 'South', 'East', 'West', 'Old Town', 'Harbor']) {
      const s = await build(base(type, { name: n + ' ' + type }), n === 'East' || n === 'West');
      if (s.iconStyle !== 'line') icons = false;
      (tsets[type] = tsets[type] || new Set()).add(s.typeset);
      secs(s).forEach((x) => { const k = x.type + ':' + x.variant; (seen[k] = seen[k] || new Set()).add(fam[type]); });
    }
    t.ok(icons, 'new sites use line icons');
    const want = ['hero:center', 'hero:frame', 'hero:cinema', 'hero:collage', 'services:bento', 'services:rows', 'services:numbered', 'services:feature', 'steps:line', 'intro:columns', 'cta:card'];
    t.eq(want.filter((k) => !seen[k]).join(','), '', 'new layouts are used across business types');
    t.ok(!seen['hero:frame'] || [...seen['hero:frame']].every((f) => f === 'trades' || f === 'pro'), 'framed hero only for trades and professionals (' + [...(seen['hero:frame'] || [])] + ')');
    t.ok(!seen['intro:columns'] || [...seen['intro:columns']].every((f) => f === 'pro'), 'two-column intro only for professional firms');
    t.ok(!seen['steps:line'] || [...seen['steps:line']].every((f) => f !== 'food' && f !== 'beauty'), 'timeline steps for process-led businesses');
    t.ok([...tsets['Law firm']].every((x) => x === 'classic' || x === 'editorial' || x === 'elegant') && [...tsets.Daycare].every((x) => x === 'friendly' || x === 'clean') && [...tsets['Hair salon']].every((x) => x === 'refined' || x === 'editorial' || x === 'elegant'), 'type themes fit the business: ' + JSON.stringify(Object.fromEntries(Object.entries(tsets).map(([k, v]) => [k, [...v]]))));
    t.ok(new Set(Object.values(tsets).flatMap((v) => [...v])).size >= 5, 'the newer type themes are in use');
    // three or more reviews: quote cards
    const rv = await build(base('Hair salon', { name: 'Gloss', reviews: [{ quote: 'Lovely cut and a warm welcome.', name: 'A' }, { quote: 'Best color I have had in years.', name: 'B' }, { quote: 'Always on time and so friendly.', name: 'C' }] }));
    t.ok(secs(rv).some((x) => x.type === 'reviews' && /^(cards|feature|wall)$/.test(x.variant)), 'typed reviews get a quote layout');
    // photo-led layouts only with a photo
    const bare = new Set(); const shot = new Set();
    for (const n of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      bare.add(((await build(base('Hair salon', { name: n + ' Hair' }))).pages[0].sections.find((x) => x.type === 'hero') || {}).variant);
      const s = await build(base('Hair salon', { name: n + ' Hair' }), true);
      const h = s.pages[0].sections.find((x) => x.type === 'hero');
      shot.add(h.variant + (s.photos[h.id + '.photo'] ? '+photo' : ''));
    }
    t.ok(!bare.has('split'), 'without a photo the hero never uses the side-by-side photo layout (' + [...bare] + ')');
    t.ok([...shot].every((v) => /\+photo$/.test(v)) && [...shot].some((v) => /^collage/.test(v)) && [...shot].some((v) => /^cinema/.test(v)), 'with a photo the hero varies between the headline-first layouts (' + [...shot] + ')');
  }

  // ---- on the real worker ----
  {
    const j1 = await createSite(ctx.base, { name: 'Crumb', type: 'Bakery', city: 'Austin', phone: '512-555-0100' });
    t.ok(!/Reserve a table/.test(j1.html) && /Order ahead/.test(j1.html), 'a live bakery site says "Order ahead", never "Reserve a table"');
    const j2 = await createSite(ctx.base, { name: 'Rosa Verde', type: 'Mexican restaurant', city: 'San Diego', phone: '(619) 555-0187', address: '2210 India St, San Diego, CA' });
    t.ok(!/Find us on India\./.test(j2.html) && !/Our services/.test(j2.html) && /Reserve a table/.test(j2.html), 'a live Mexican restaurant: menu wording, reservations, no truncated street');
    const j3 = await createSite(ctx.base, { name: 'Rosa Verde', type: 'Mexican restaurant', city: 'San Diego', phone: '(619) 555-0187', address: '2210 India St, San Diego, CA' });
    t.eq(sig(j3.site), sig(j2.site), 'regenerating the same business on the worker gives the same layout');
  }
};
