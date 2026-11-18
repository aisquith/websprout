// Coming back from Stripe checkout: an "Activating Pro" screen until the payment notice arrives, then a "Welcome to
// Pro" screen, and every place that shows the plan switches to PRO without a page reload.
const fs = require('fs');
const path = require('path');
const { openPage, sleep, waitFor, signIn, browserCookie } = require('./lib');

const OWNER = (fs.readFileSync(path.join(__dirname, '../src/00-header.js'), 'utf8').match(/SUPPORT_EMAIL\s*=\s*'([^']+)'/) || [])[1];

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const email = 'newpro.' + Date.now().toString(36) + '@shop.test';
  const sess = await signIn(base, email);
  const admin = await signIn(base, OWNER);
  // The admin grant stands in for Stripe's webhook here (a same-origin fetch, like the admin panel's buttons).
  const grant = (plan) => fetch(base + '/admin/grant?email=' + encodeURIComponent(email) + '&plan=' + plan, { headers: { Cookie: '__Host-ws_sess=' + admin, 'Sec-Fetch-Site': 'same-origin', 'Sec-Fetch-Mode': 'cors' } });

  const page = await openPage(browser);
  await page.setCookie(browserCookie(base, sess));
  await page.goto(base + '/?sub=success', { waitUntil: 'domcontentloaded' });
  const shown = await waitFor(() => page.evaluate(() => !!document.querySelector('#wsProWel .wpw-card')), 6000, 200);
  t.ok(shown, 'returning from checkout opens the Pro screen');
  t.ok(/Activating Pro/.test(await page.evaluate(() => document.getElementById('wsProWel').innerText)), 'it says Pro is activating while the payment notice is on its way');
  t.eq(await page.evaluate(() => location.search), '', 'the ?sub=success marker is removed from the address');

  if (process.env.WS_SHOT) await page.screenshot({ path: process.env.WS_SHOT + '-activating.png' });
  const g = await grant('pro');
  t.eq(g.status, 200, 'Pro granted on the server (stands in for the Stripe webhook)');
  const welcomed = await waitFor(() => page.evaluate(() => /Welcome to Pro/.test((document.getElementById('wsProWel') || {}).innerText || '')), 8000, 250);
  t.ok(welcomed, 'the screen turns into "Welcome to Pro" by itself, no refresh');
  if (process.env.WS_SHOT) { await sleep(120); await page.screenshot({ path: process.env.WS_SHOT + '-welcome.png' }); await sleep(1800); await page.screenshot({ path: process.env.WS_SHOT + '-welcome-settled.png' }); }
  const txt = await page.evaluate(() => document.getElementById('wsProWel').innerText);
  t.ok(/badge is gone/i.test(txt) && /own domain/i.test(txt) && /code/i.test(txt), 'it lists what Pro unlocked');
  t.eq(await page.evaluate(() => !!(window._wsUser && window._wsUser.pro)), true, 'the page now knows the account is Pro');

  // Close it; the account menu shows PRO straight away.
  await page.evaluate(() => document.getElementById('wpwGo').click());
  await sleep(500);
  t.eq(await page.evaluate(() => !!document.getElementById('wsProWel')), false, '"Start using Pro" closes the screen');
  const plan = await page.evaluate(() => { const b = document.getElementById('signInBtn'); if (window.wsToggleAcctMenu) window.wsToggleAcctMenu(window._wsUser, b); const p = document.querySelector('#acctMenu .acct-plan'); return p ? p.textContent : ''; });
  t.eq(plan, 'PRO', 'the account menu says PRO without a page reload');
  t.ok(await page.evaluate(() => { if (window.openProfile) window.openProfile(); const b = document.getElementById('pfPlanBadge'); return !!b && /PRO/.test(b.textContent); }), 'the profile shows PRO without a page reload');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();
  await grant('free');
};
