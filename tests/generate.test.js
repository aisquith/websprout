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
  // business-type mapping: service businesses with "shop" in the name are not stores
  for (const [type, shop] of [['Barber shop', false], ['Coffee shop', false], ['Body shop', false], ['Gift shop', true]]) {
    const j = await createSite(base, { name: 'T', type });
    t.eq(j.site.pages.some((p) => p.path === 'shop'), shop, type + (shop ? ' gets' : ' does not get') + ' a Shop page');
  }
};
