// Growing a site needs an account: the server refuses /create when signed out, and in the app "Grow my site" opens
// the sign-in box, keeps the answers, and grows the site by itself once this browser is signed in (the emailed link
// in another tab, or coming back from Google).
const { post, openPage, sleep, waitFor, signIn, browserCookie } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const email = 'gate.' + Date.now().toString(36) + '@shop.test';
  const sess = await signIn(base, email);

  // ---- server ----
  const anon = await post(base, '/create', { name: 'Gate Bakery', type: 'Bakery' }, { 'x-ws-test-auth': '1' });
  t.eq(anon.status, 401, 'signed out, /create is refused');
  t.ok(anon.json && anon.json.signin === true, 'and the answer tells the app to ask for sign-in');
  const ok = await post(base, '/create', { name: 'Gate Bakery', type: 'Bakery' }, { 'x-ws-test-auth': '1', Cookie: '__Host-ws_sess=' + sess });
  t.ok(ok.status === 200 && ok.json && ok.json.html, 'signed in, /create grows the site');

  // ---- app: signed out, then signed in from "another tab" ----
  const page = await openPage(browser);
  let creates = 0;
  page.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') creates++; });
  // Earlier tests share this browser and may have left a sign-in cookie behind.
  await page.goto(base + '/terms', { waitUntil: 'domcontentloaded' });
  const left = await page.cookies(base);
  if (left.length) await page.deleteCookie(...left);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => { document.getElementById('bizName').value = 'Gate Street Bakery'; document.getElementById('bizType').value = 'Bakery'; document.getElementById('next1').click(); });
  const asked = await waitFor(() => page.evaluate(() => document.getElementById('authModal').style.display === 'flex'), 4000, 150);
  t.ok(asked, '"Grow my site" opens the sign-in box when signed out');
  t.ok(/grow your site/i.test(await page.evaluate(() => document.getElementById('authIntro').textContent)), 'the box says signing in grows the site');
  const pend = await page.evaluate(() => JSON.parse(localStorage.getItem('ws_pending_gen') || 'null'));
  t.ok(pend && pend.p && pend.p.name === 'Gate Street Bakery' && pend.p.type === 'Bakery', 'the answers are kept while they sign in');
  t.eq(creates, 0, 'nothing is grown before sign-in');

  await page.setCookie(browserCookie(base, sess));
  const grew = await waitFor(() => page.evaluate(() => !!window._wsSiteData && document.getElementById('studio').classList.contains('on')), 30000, 400);
  t.ok(grew, 'once signed in (in another tab), the site grows here by itself');
  t.eq(await page.evaluate(() => document.getElementById('authModal').style.display), 'none', 'the sign-in box closes');
  t.eq(await page.evaluate(() => localStorage.getItem('ws_pending_gen')), null, 'the kept answers are used up');
  t.eq(await page.evaluate(() => (window._wsSiteData && window._wsSiteData.biz && window._wsSiteData.biz.name) || ''), 'Gate Street Bakery', 'it grew the site they asked for');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();

  // ---- app: coming back from Google (same tab) ----
  const p2 = await openPage(browser);
  await p2.goto(base + '/terms', { waitUntil: 'domcontentloaded' });
  await p2.evaluate(() => { localStorage.clear(); localStorage.setItem('ws_pending_gen', JSON.stringify({ t: Date.now(), w: 0, p: { name: 'Return Trip Cafe', type: 'Cafe' } })); });
  await p2.setCookie(browserCookie(base, sess));
  await p2.goto(base + '/?login=ok', { waitUntil: 'domcontentloaded' });
  const back = await waitFor(() => p2.evaluate(() => !!window._wsSiteData && window._wsSiteData.biz && window._wsSiteData.biz.name === 'Return Trip Cafe'), 30000, 400);
  t.ok(back, 'back from Google, the waiting site grows without another click');
  t.eq(p2._wsErrors.length, 0, 'no JS errors after Google ' + p2._wsErrors.join('; '));
  await p2.close();

  // ---- app: the emailed link opened in a new tab while the first tab is still waiting ----
  const p3 = await openPage(browser);
  let c3 = 0;
  p3.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') c3++; });
  await p3.goto(base + '/terms', { waitUntil: 'domcontentloaded' });
  await p3.evaluate(() => { localStorage.clear(); localStorage.setItem('ws_pending_gen', JSON.stringify({ t: Date.now(), w: Date.now() + 60000, p: { name: 'Other Tab Deli', type: 'Deli' } })); });
  await p3.setCookie(browserCookie(base, sess));
  await p3.goto(base + '/?login=ok', { waitUntil: 'networkidle2' });
  await sleep(1500);
  t.eq(c3, 0, 'the new tab leaves the growing to the tab that is waiting');
  t.ok(await p3.evaluate(() => !!localStorage.getItem('ws_pending_gen')), 'and leaves the kept answers for it');
  await p3.close();
};
