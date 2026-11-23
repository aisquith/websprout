// Anyone can grow a site and look at it: signed out, the server allows a few sites a day per connection and the
// studio opens look-only (a bar asks for sign-in; editing and publishing open the sign-in box). Signing in, here or in
// another tab, unlocks it. Past the daily allowance "Grow my site" asks for sign-in, keeps the answers, and grows the
// site by itself once this browser is signed in (the emailed link in another tab, or coming back from Google).
const { post, openPage, sleep, waitFor, signIn, browserCookie } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const email = 'gate.' + Date.now().toString(36) + '@shop.test';
  const sess = await signIn(base, email);
  const ip = () => '10.77.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250);

  // ---- server ----
  const anonIp = ip(), codes = [];
  for (let i = 0; i < 4; i++) { const r = await post(base, '/create', { name: 'Gate Bakery', type: 'Bakery' }, { 'x-ws-test-auth': '1', 'x-ws-test-ip': anonIp }); codes.push(r.status); if (i === 0) t.ok(r.json && r.json.html, 'signed out, /create grows a site'); if (i === 3) t.ok(r.json && r.json.signin === true, 'past the allowance the answer tells the app to ask for sign-in'); }
  t.eq(codes.join(','), '200,200,200,401', 'signed out: three sites a day per connection, then sign-in');
  const ok = await post(base, '/create', { name: 'Gate Bakery', type: 'Bakery' }, { 'x-ws-test-auth': '1', 'x-ws-test-ip': anonIp, Cookie: '__Host-ws_sess=' + sess });
  t.ok(ok.status === 200 && ok.json && ok.json.html, 'signed in, /create keeps growing sites');
  const meOut = await (await fetch(base + '/me', { headers: { 'x-ws-test-auth': '1' } })).json();
  t.ok(meOut.auth === false && meOut.lock === true, 'signed out, /me says the studio is look-only');

  // ---- app: signed out, the site grows and the studio is look-only; signing in (in "another tab") unlocks it ----
  const page = await openPage(browser);
  await page.setExtraHTTPHeaders({ 'x-ws-test-auth': '1', 'x-ws-test-ip': ip() });
  let creates = 0;
  page.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') creates++; });
  // Earlier tests share this browser and may have left a sign-in cookie behind.
  await page.goto(base + '/terms', { waitUntil: 'domcontentloaded' });
  const left = await page.cookies(base);
  if (left.length) await page.deleteCookie(...left);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => { document.getElementById('bizName').value = 'Gate Street Bakery'; document.getElementById('bizType').value = 'Bakery'; document.getElementById('next1').click(); });
  const grew = await waitFor(() => page.evaluate(() => !!window._wsSiteData && document.getElementById('studio').classList.contains('on')), 30000, 400);
  t.ok(grew, 'signed out, "Grow my site" grows the site straight away');
  t.eq(creates, 1, 'with one request');
  t.ok(await page.evaluate(() => document.getElementById('authModal').style.display !== 'flex'), 'and no sign-in box in the way');
  t.eq(await page.evaluate(() => (window._wsSiteData && window._wsSiteData.biz && window._wsSiteData.biz.name) || ''), 'Gate Street Bakery', 'it grew the site they asked for');
  await waitFor(() => page.evaluate(() => document.getElementById('studio').classList.contains('ws-locked')), 5000, 150);
  t.ok(await page.evaluate(() => document.getElementById('studio').classList.contains('ws-locked') && !document.getElementById('wsLockBar').hidden), 'the studio is look-only, with a bar asking for sign-in');
  await page.evaluate(() => { const el = document.querySelector('#studio .s-actions button, #studio .s-actions a'); if (el) el.click(); });
  const asked = await waitFor(() => page.evaluate(() => document.getElementById('authModal').style.display === 'flex'), 4000, 150);
  t.ok(asked, 'using an editor button opens the sign-in box');
  t.ok(/edit and publish/i.test(await page.evaluate(() => document.getElementById('authIntro').textContent)), 'the box says signing in unlocks editing and publishing');

  await page.setCookie(browserCookie(base, sess));
  const unlocked = await waitFor(() => page.evaluate(() => !document.getElementById('studio').classList.contains('ws-locked') && document.getElementById('wsLockBar').hidden), 15000, 300);
  t.ok(unlocked, 'once signed in (in another tab), the studio unlocks by itself');
  t.eq(await page.evaluate(() => document.getElementById('authModal').style.display), 'none', 'the sign-in box closes');
  t.eq(await page.evaluate(() => (window._wsSiteData && window._wsSiteData.biz && window._wsSiteData.biz.name) || ''), 'Gate Street Bakery', 'and the site is still theirs');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();

  // ---- app: past the allowance, the answers are kept and the site grows after sign-in ----
  const pw = await openPage(browser);
  const usedIp = ip();
  for (let i = 0; i < 3; i++) await post(base, '/create', { name: 'Used Up', type: 'Cafe' }, { 'x-ws-test-auth': '1', 'x-ws-test-ip': usedIp });
  await pw.setExtraHTTPHeaders({ 'x-ws-test-auth': '1', 'x-ws-test-ip': usedIp });
  await pw.goto(base + '/terms', { waitUntil: 'domcontentloaded' });
  const left2 = await pw.cookies(base);
  if (left2.length) await pw.deleteCookie(...left2);
  await pw.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await pw.goto(base + '/', { waitUntil: 'networkidle2' });
  await pw.evaluate(() => { document.getElementById('bizName').value = 'Fourth Street Deli'; document.getElementById('bizType').value = 'Deli'; document.getElementById('next1').click(); });
  const asked2 = await waitFor(() => pw.evaluate(() => document.getElementById('authModal').style.display === 'flex'), 15000, 200);
  t.ok(asked2, 'past the allowance, "Grow my site" opens the sign-in box');
  const pend = await pw.evaluate(() => JSON.parse(localStorage.getItem('ws_pending_gen') || 'null'));
  t.ok(pend && pend.p && pend.p.name === 'Fourth Street Deli' && pend.p.type === 'Deli', 'the answers are kept while they sign in');
  await pw.setCookie(browserCookie(base, sess));
  const grew2 = await waitFor(() => pw.evaluate(() => !!window._wsSiteData && document.getElementById('studio').classList.contains('on') && window._wsSiteData.biz.name === 'Fourth Street Deli'), 30000, 400);
  t.ok(grew2, 'once signed in, the waiting site grows by itself');
  t.eq(await pw.evaluate(() => localStorage.getItem('ws_pending_gen')), null, 'the kept answers are used up');
  t.eq(pw._wsErrors.length, 0, 'no JS errors past the allowance ' + pw._wsErrors.join('; '));
  await pw.close();

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
