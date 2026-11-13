// Site generation is complete and safe for many business types and awkward inputs, on desktop and phone.
const { createSite, openPage, renderHtml, sleep } = require('./lib');

const TYPES = ['Barber shop', 'Hair salon', 'Nail spa', 'Tattoo studio', 'Bakery', 'Coffee shop', 'Mexican restaurant', 'Food truck', 'Lawn care', 'House cleaning', 'Handyman', 'Plumber', 'Roofing', 'Auto repair', 'Boat dealer', 'Gym', 'Yoga studio', 'Dog grooming', 'Wedding photographer', 'Gift shop', 'Clothing boutique', 'Law firm', 'Dentist', 'Chiropractor', 'Accountant', 'Real estate agent', 'Piano lessons', 'Wedding planner', 'Moving company', 'Web design agency', 'Church', '', 'Pink Bakery', 'Spanish tapas bar'];
const QUICK = ['Barber shop', 'Mexican restaurant', 'House cleaning', 'Law firm', 'Clothing boutique', ''];
const ODD = [
  { name: '', type: '' },
  { name: 'A'.repeat(200), type: 'B'.repeat(200) },
  { name: '<img src=x onerror=alert(1)>', type: '"><script>alert(2)</script>' },
  { name: 'Café Ñandú & Sons — "The Best"', type: 'Café', city: 'São Paulo', phone: '+55 11 5555-0000', address: 'Rua Augusta, 1500' },
  { name: '名古屋ラーメン', type: 'Ramen restaurant' },
  { name: 'X', type: 'Plumber', hours: [{ d: 'Mon', open: '17:00', close: '02:00' }, { d: 'Tue' }] },
  { name: 'Shop', type: 'store', ecommerce: true, products: [{ name: '<3 Mug', price: '$15 - $25', emoji: '🎉' }] },
];
const PLACEHOLDER = /\bundefined\b|\bnull\b|\bNaN\b|\[object|Lorem|Tell people what|Your Business Name|TODO/;

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const cases = (ctx.quick ? QUICK : TYPES).map((ty) => ({ name: (ty || 'Business') + ' Co', type: ty, city: 'Austin', phone: '512-555-0100' })).concat(ODD);
  const layouts = new Set();
  for (const body of cases) {
    const j = await createSite(base, body);
    const label = JSON.stringify(body).slice(0, 48);
    t.ok(Array.isArray(j.site.pages) && j.site.pages.length >= 3, label + ' has 3+ pages');
    layouts.add(j.site.pages[0].sections.map((s) => s.type).join(','));
    // section ids are unique across the site
    const ids = []; j.site.pages.forEach((p) => p.sections.forEach((s) => ids.push(s.id)));
    t.eq(new Set(ids).size, ids.length, label + ' has unique section ids');
    for (const mobile of [false, true]) {
      const page = await openPage(browser, { mobile });
      await renderHtml(page, base, j.html);
      for (const pg of j.site.pages) {
        await page.evaluate((h) => { location.hash = '/' + h; }, pg.path || '');
        await sleep(100);
        const info = await page.evaluate(() => {
          const root = document.querySelector('.ws-page.on') || document.body; const txt = root.innerText || '';
          const empty = [...root.querySelectorAll('section')].filter((s) => s.innerText.trim().length < 3 && !s.querySelector('img,iframe')).length;
          return { len: txt.trim().length, ov: document.documentElement.scrollWidth - innerWidth, empty, txt };
        });
        const tag = label + (mobile ? ' [phone] ' : ' [desktop] ') + (pg.path || 'home');
        t.ok(info.len >= 80, tag + ' has real content');
        t.ok(info.ov <= 1, tag + ' has no sideways scroll (' + info.ov + 'px)');
        t.eq(info.empty, 0, tag + ' has no empty sections');
        const m = info.txt.match(PLACEHOLDER); t.ok(!m, tag + ' shows no placeholder text ' + (m ? '"' + m[0] + '"' : ''));
      }
      t.eq(page._wsErrors.length, 0, label + (mobile ? ' [phone]' : '') + ' runs without JS errors/dialogs ' + page._wsErrors.join('; '));
      await page.close();
    }
  }
  t.ok(layouts.size >= (ctx.quick ? 2 : 4), 'home layouts vary (' + layouts.size + ' different)');
  // a known booking provider link becomes an embedded calendar on the booking page; unknown links do not
  let j = await createSite(base, { name: 'Zen', type: 'Yoga studio', bookingUrl: 'https://calendly.com/zen/class' });
  const bookPg = j.site.pages.find((p) => p.path === 'book');
  t.ok(bookPg && bookPg.sections.some((s) => s.type === 'embed'), 'booking link from Calendly becomes an embedded calendar');
  t.ok(/<iframe src="https:\/\/calendly\.com\/zen\/class"/.test(j.html), 'calendar iframe renders');
  j = await createSite(base, { name: 'Zen', type: 'Yoga studio', bookingUrl: 'https://evil.example/x' });
  t.ok(!/<iframe src="https:\/\/evil/.test(j.html), 'unknown booking sites are never embedded');
  // new sections can be added and render on a phone without overflow
  const page = await openPage(browser, { mobile: true });
  await page.goto(base + '/terms');
  const html = await page.evaluate(async () => {
    await new Promise((r) => { const s = document.createElement('script'); s.src = '/ws-engine.js'; s.onload = r; document.head.appendChild(s); });
    const W = window.WS; const site = { biz: { name: 'Gym', type: 'Gym', hours: [] }, palette: 'w_mono', typeset: 'bold', photos: {}, sections: [] };
    ['hero', 'plans', 'embed'].forEach((ty) => site.sections.push(Object.assign({ id: ty + '-1', type: ty }, W.sections[ty].create(site))));
    site.sections[2].url = 'https://calendly.com/gym/intro';
    return W.renderSite(site, { mode: 'live' });
  });
  await page.setContent(html, { waitUntil: 'domcontentloaded' }); await sleep(300);
  t.eq(await page.evaluate(() => document.querySelectorAll('.plan').length), 3, 'pricing plans render');
  t.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 1), 'plans and calendar fit a phone screen');
  await page.close();

  // business-type mapping: service businesses with "shop" in the name are not stores
  for (const [type, shop] of [['Barber shop', false], ['Coffee shop', false], ['Body shop', false], ['Gift shop', true]]) {
    const j = await createSite(base, { name: 'T', type });
    t.eq(j.site.pages.some((p) => p.path === 'shop'), shop, type + (shop ? ' gets' : ' does not get') + ' a Shop page');
  }

  // services typed during setup become the site's services, with prices, on the Services page and the booking form
  {
    const j = await createSite(base, { name: 'Sharp', type: 'Barber shop', servicesText: 'Skin fade - $30\nBeard trim: 15\n- Kids cut $20\nHot towel shave\nColor from $85+' });
    const main = j.site.pages.find((p) => p.path === 'services');
    const sv = main && main.sections.find((s) => s.type === 'services');
    t.ok(!!sv, 'setup services: Services page has a services section');
    const items = (sv && sv.items) || [];
    t.eq(items.map((x) => x.name).join('|'), 'Skin fade|Beard trim|Kids cut|Hot towel shave|Color', 'setup services: names parsed in order');
    t.eq(items.map((x) => x.from).join('|'), '$30|$15|$20||$85+', 'setup services: prices parsed');
    t.ok(/Beard trim/.test(j.html) && /\$85\+/.test(j.html) && !/Pour Over|Espresso/.test(j.html), 'setup services: rendered on the site');
    t.ok(items.find((x) => x.name === 'Beard trim').text.length > 10, 'setup services: a known service borrows starter wording');
    const bk = j.site.pages.find((p) => p.path === 'book');
    const bs = bk && bk.sections.find((s) => s.type === 'booking');
    t.ok(!!bs && bs.services.some((x) => x.name === 'Kids cut'), 'setup services: offered on the booking form');
    const j2 = await createSite(base, { name: 'Sharp', type: 'Barber shop', servicesText: 'haircuts, beard trims, fades' });
    t.eq(j2.site.pages.find((p) => p.path === 'services').sections.find((s) => s.type === 'services').items.length, 3, 'setup services: comma-separated list works');
    const j3 = await createSite(base, { name: 'Sharp', type: 'Barber shop', servicesText: '<img src=x onerror=alert(1)> - $5' });
    t.ok(!/<img src=x/.test(j3.html), 'setup services: markup in a service name is escaped');
  }
};
