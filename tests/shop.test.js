// Shops: products published with the site, checkout charges server-side prices, the live cart works.
const { createSite, post, openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const s = await createSite(base, { name: 'Thread & Co', type: 'Clothing boutique', ecommerce: true, products: [{ name: 'Linen Shirt', price: '$48', desc: 'Breathable linen' }, { name: 'Canvas Tote', price: '2 for $30' }] });
  t.ok(s.site.pages.some((p) => p.path === 'shop'), 'store gets a Shop page');
  const slug = 'shop' + Date.now().toString(36);
  let r = await post(base, '/publish', { html: s.html, site: s.site, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r.status, 200, 'shop publishes with its site data');

  // Without an owner who can take payments, checkout explains instead of failing silently
  r = await post(base, '/cart-checkout', { site: s.siteId, items: [{ n: 'Linen Shirt', qty: 1 }] });
  t.ok(r.status === 400 && /not set up|not currently|payment/i.test((r.json && r.json.error) || ''), 'checkout explains when payments are not set up: ' + r.text.slice(0, 100));
  t.eq(r.headers.get('access-control-allow-origin'), '*', 'checkout answers sandboxed published pages (CORS)');

  // Owner able to take payments (the platform account): a real product reaches Stripe, an unknown one never does
  await post(base, '/api/inbox/notify', { site: s.siteId, key: s.formKey, email: 'michael.aisquith@gmail.com' });
  r = await post(base, '/cart-checkout', { site: s.siteId, items: [{ n: 'Nonexistent', qty: 1, price: '$0.01' }] });
  t.ok(/Nothing in your cart/i.test((r.json && r.json.error) || ''), 'items that are not in the published shop are refused: ' + r.text.slice(0, 100));
  r = await post(base, '/cart-checkout', { site: s.siteId, items: [{ n: 'Linen Shirt', qty: 2 }] });
  t.ok(/could not start checkout/i.test((r.json && r.json.error) || ''), 'published products go on to Stripe (rejected only because the test key is fake): ' + r.text.slice(0, 100));

  // Live cart in a browser
  const page = await openPage(browser, {});
  await page.goto(base + '/s/' + slug + '#/shop', { waitUntil: 'networkidle2' });
  await sleep(500);
  const buys = await page.$$('.wsp-buy');
  t.ok(buys.length >= 2, 'shop shows buy buttons');
  await page.evaluate(() => { document.querySelectorAll('.ws-page.on .wsp-buy')[1].click(); document.querySelectorAll('.ws-page.on .wsp-buy')[1].click(); });
  await page.evaluate(() => document.querySelector('.wsp-cart').click()); await sleep(200);
  const tot = await page.evaluate(() => document.querySelector('[data-total]').textContent);
  t.eq(tot, '$60.00', 'cart totals "2 for $30" twice correctly');
  await page.evaluate(() => document.querySelector('.wsp-co').click()); await sleep(2500);
  const note = await page.evaluate(() => (document.querySelector('.wsp-note') || {}).textContent || '');
  t.ok(/could not start checkout|contact us/i.test(note), 'checkout result is shown to the shopper: ' + note.slice(0, 80));
  t.eq(page._wsErrors.length, 0, 'shop runs without JS errors ' + page._wsErrors.join('; '));
  await page.close();

  // Preview inside the editor never sends shoppers to checkout
  const p2 = await openPage(browser, {});
  // the editor shows the site in an iframe built from srcdoc, exactly like this
  await p2.goto(base + '/terms');
  await p2.evaluate((h) => { const f = document.createElement('iframe'); f.id = 'pv'; f.style.cssText = 'width:1200px;height:800px'; f.srcdoc = h; document.body.appendChild(f); }, s.html);
  await sleep(800);
  const fr = p2.frames().find((f) => f !== p2.mainFrame());
  await fr.evaluate(() => { location.hash = '/shop'; }); await sleep(300);
  await fr.evaluate(() => { document.querySelector('.ws-page.on .wsp-buy').click(); document.querySelector('.wsp-co').click(); }); await sleep(300);
  t.ok(/published site/i.test(await fr.evaluate(() => (document.querySelector('.wsp-note') || {}).textContent || '')), 'preview explains checkout opens on the published site');
  await p2.close();
};
