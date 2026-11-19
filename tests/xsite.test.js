const lib = require('./lib');
// Cross-site request forgery from customer sites (*.websprout.app is same-SITE), session cookie hardening, login CSRF,
// owner-bound Pro checkout + Stripe webhook, security headers, fail-closed secrets and rate limits.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { post, createSite, signIn, cookie, SESS } = require('./lib');

const EVIL = { 'Sec-Fetch-Site': 'same-site', Origin: 'https://evil.websprout.app' };
const WHSEC = 'whsec_test_websprout';
function stripeSig(body, secret, t) { t = t || Math.floor(Date.now() / 1000); return 't=' + t + ',v1=' + crypto.createHmac('sha256', secret || WHSEC).update(t + '.' + body).digest('hex'); }

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const stamp = Date.now().toString(36);
  const me = async (sess, extra) => (await (await fetch(base + '/me', { headers: Object.assign({ Cookie: cookie(sess) }, extra || {}) })).json());
  const call = (p, sess, body, headers, method) => fetch(base + p, { method: method || 'POST', redirect: 'manual', headers: Object.assign({ 'Content-Type': 'application/json', Cookie: cookie(sess) }, headers || {}), body: method === 'GET' ? undefined : JSON.stringify(body || {}) });

  // ── Session cookie ──
  const email = 'victim.' + stamp + '@xsite.test';
  const sess = await signIn(base, email);
  t.ok(/^[a-f0-9]{64}$/.test(sess), 'sign-in issues a session');
  {
    await post(base, '/auth/email', { email: 'cookie.' + stamp + '@xsite.test' }, { 'x-ws-test-ip': '10.9.9.1' });
    const m = await (await fetch(base + '/__test/mail?to=' + encodeURIComponent('cookie.' + stamp + '@xsite.test'))).json();
    const tok = ((m && m.html) || '').match(/token=([A-Za-z0-9_-]+)/)[1];
    let r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'token=' + tok });
    t.ok(/login=error/.test(r.headers.get('location') || ''), 'sign-in POST without an Origin is refused (login CSRF)');
    r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'null' }, body: 'token=' + tok });
    t.ok(r.status === 403 || /login=error/.test(r.headers.get('location') || ''), 'sign-in POST with Origin "null" is refused');
    r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://evil.websprout.app' }, body: 'token=' + tok });
    t.ok(r.status === 403 || /login=error/.test(r.headers.get('location') || ''), 'sign-in POST from a customer subdomain is refused');
    r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: base }, body: 'token=' + tok });
    const sc = r.headers.get('set-cookie') || '';
    t.ok(/login=(ok|new)/.test(r.headers.get('location') || ''), 'sign-in from the app works');
    t.ok(/__Host-ws_sess=[a-f0-9]{64}/.test(sc) && /Secure/i.test(sc) && /Path=\//.test(sc) && /HttpOnly/i.test(sc) && /SameSite=Lax/i.test(sc) && !/Domain=/i.test(sc), 'session cookie is __Host- prefixed: Secure, HttpOnly, SameSite=Lax, Path=/, no Domain (' + sc.slice(0, 120) + ')');
    r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: base }, body: 'token=' + tok });
    t.ok(/login=expired/.test(r.headers.get('location') || ''), 'a sign-in link works only once');
  }
  t.eq((await me(sess)).auth, true, 'the session works');
  let j = await (await fetch(base + '/me', { headers: { Cookie: SESS + '=' + sess + '; ' + SESS + '=' + 'a'.repeat(64) } })).json();
  t.eq(j.auth, false, 'two session cookies (one planted) = signed out');
  j = await (await fetch(base + '/me', { headers: { Cookie: 'ws_sess=' + sess, 'Sec-Fetch-Site': 'same-origin' } })).json();
  t.eq(j.auth, false, 'a new session token is never accepted under the old (plantable) ws_sess name');
  j = await (await fetch(base + '/me', { headers: { Cookie: 'ws_sess=' + 'b'.repeat(48), 'Sec-Fetch-Site': 'same-site' } })).json();
  t.eq(j.auth, false, 'an old ws_sess cookie is ignored on requests from other sites');

  // ── CSRF from a customer subdomain: refused, no effect ──
  const s1 = await createSite(base, { name: 'Victim Cafe', type: 'Cafe' });
  let r = await call('/my-sites/claim', sess, { sites: [{ siteId: s1.siteId, key: s1.formKey, name: 'Victim Cafe', ts: 1 }] }, EVIL);
  t.eq(r.status, 403, 'cross-site /my-sites/claim is refused');
  t.eq(((await (await fetch(base + '/my-sites', { headers: { Cookie: cookie(sess) } })).json()).sites || []).length, 0, '...and claimed nothing');
  r = await call('/my-sites/claim', sess, { sites: [{ siteId: s1.siteId, key: s1.formKey, name: 'Victim Cafe', ts: 1 }] }, { 'Sec-Fetch-Site': 'same-origin' });
  t.eq(r.status, 200, 'same-origin /my-sites/claim works');
  r = await call('/my-sites/claim', sess, { sites: [{ siteId: 'nosuchsite1', key: 'x', name: 'Bad' }, { siteId: '__proto__', key: 'x' }] }, { 'Sec-Fetch-Site': 'same-origin' });
  t.eq(((await (await fetch(base + '/my-sites', { headers: { Cookie: cookie(sess) } })).json()).sites || []).length, 1, 'claims with a wrong key are not recorded');
  r = await call('/my-sites/delete', sess, { siteId: s1.siteId }, EVIL);
  t.eq(r.status, 403, 'cross-site /my-sites/delete is refused');
  t.eq(((await (await fetch(base + '/my-sites', { headers: { Cookie: cookie(sess) } })).json()).sites || []).length, 1, '...and deleted nothing');
  r = await call('/api/reviews/manage', sess, { site: s1.siteId, action: 'add', text: 'Forged review' }, EVIL);
  t.eq(r.status, 403, 'cross-site /api/reviews/manage is refused');
  r = await call('/api/reviews/manage', sess, { site: s1.siteId, action: 'add', text: 'Real review', name: 'Ana‮evil' }, { 'Sec-Fetch-Site': 'same-origin' });
  j = await r.json();
  t.ok(r.status === 200 && j.reviews.length === 1 && j.reviews[0].text === 'Real review', 'the site owner manages reviews same-origin (no forged review was added)');
  t.eq(j.reviews[0].name, 'Anaevil', 'bidi override characters are stripped from review names');
  r = await call('/api/invoice', sess, { amount: '10', desc: 'x', email: 'a@b.co' }, EVIL);
  t.eq(r.status, 403, 'cross-site /api/invoice is refused');
  r = await call('/account/delete', sess, { confirm: 'DELETE' }, EVIL);
  t.eq(r.status, 403, 'cross-site /account/delete is refused');
  r = await call('/account/delete', sess, { confirm: 'DELETE' }, { Origin: 'https://evil.websprout.app' });
  t.eq(r.status, 403, 'a foreign Origin is refused even without Sec-Fetch-Site (older browsers)');
  r = await call('/auth/logout', sess, null, EVIL, 'GET');
  t.eq(r.status, 403, 'cross-site sign-out (GET) is refused');
  r = await call('/auth/logout', sess, {}, EVIL);
  t.eq(r.status, 403, 'cross-site sign-out (POST) is refused');
  t.eq((await me(sess)).auth, true, 'after all that the victim is still signed in and their account exists');
  r = await fetch(base + '/my-sites/claim', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookie(sess) }, body: 'sites=1' });
  t.eq(r.status, 415, 'form-encoded posts to JSON endpoints are refused');
  r = await call('/my-sites/delete', sess, { siteId: s1.siteId }, { 'x-ws-test-host': 'evil.websprout.app', 'Sec-Fetch-Site': 'same-origin' });
  t.eq(r.status, 403, 'app endpoints are not served on customer hosts');

  // Exempt endpoints (published sites call them from their own origin) still work cross-origin
  r = await post(base, '/api/form/' + s1.siteId, { name: 'Bo', message: 'Hi' }, EVIL);
  t.eq(r.status, 200, 'published-site form submissions work cross-origin');
  r = await post(base, '/api/review', { site: s1.siteId, text: 'Lovely place', rating: 5 }, EVIL);
  t.eq(r.status, 200, 'published-site review submissions work cross-origin');
  r = await post(base, '/api/hit', { site: s1.siteId }, EVIL);
  t.eq(r.status, 200, 'published-site view counts work cross-origin');
  r = await post(base, '/api/clientlog', { msg: 'x' }, EVIL);
  t.eq(r.status, 200, 'published-site error reports work cross-origin');
  r = await post(base, '/cart-checkout', { site: s1.siteId, items: [{ p: 0, qty: 1 }] }, Object.assign({ 'x-ws-test-host': 'victim.websprout.app' }, EVIL));
  t.ok(r.status !== 403 && r.status !== 415, 'cart checkout works from published sites (' + r.status + ')');

  // ── Same-origin sign-out works and ends the session ──
  const s2 = await signIn(base, 'logout.' + stamp + '@xsite.test');
  r = await call('/auth/logout', s2, null, { 'Sec-Fetch-Site': 'same-origin' }, 'GET');
  t.eq(r.status, 200, 'same-origin sign-out works');
  t.eq((await me(s2)).auth, false, '...and the session is gone');

  // ── Account deletion signs out every session ──
  const del = 'delete.' + stamp + '@xsite.test';
  const d1 = await signIn(base, del), d2 = await signIn(base, del, true);
  t.ok(d1 && d2 && d1 !== d2, 'two sessions for one account');
  r = await call('/account/delete', d1, { confirm: 'DELETE' }, { 'Sec-Fetch-Site': 'same-origin' });
  t.eq(r.status, 200, 'account deletes same-origin');
  t.eq((await me(d2)).auth, false, 'deleting the account revokes its other sessions');

  // ── Pro checkout is bound to the signed-in account ──
  r = await call('/billing/checkout', 'x'.repeat(64), {}, { 'Sec-Fetch-Site': 'same-origin' });
  t.eq(r.status, 401, 'Pro checkout needs a signed-in account');
  const buyer = 'buyer.' + stamp + '@xsite.test';
  const bs = await signIn(base, buyer);
  j = await (await call('/billing/checkout', bs, {}, { 'Sec-Fetch-Site': 'same-origin' })).json();
  const ref = ((j.url || '').match(/client_reference_id=(wsp_[a-f0-9]{32})/) || [])[1];
  t.ok(!!ref && /^https:\/\//.test(j.url), 'Pro checkout returns a Stripe URL carrying an opaque account reference');
  t.ok((j.url || '').indexOf(encodeURIComponent(buyer)) === -1 || /prefilled_email/.test(j.url), 'the reference is not the email');
  const hook = async (ev, sig) => { const b = JSON.stringify(ev); return fetch(base + '/api/stripe/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': sig || stripeSig(b) }, body: b }); };
  const now = Math.floor(Date.now() / 1000);
  r = await hook({ id: 'evt_bad_' + stamp, type: 'checkout.session.completed', data: { object: { mode: 'subscription', client_reference_id: ref, customer: 'cus_x' } } }, 't=' + now + ',v1=' + 'f'.repeat(64));
  t.eq(r.status, 400, 'webhook with a bad signature is refused');
  // a typed email never grants Pro
  const typed = 'typed.' + stamp + '@xsite.test'; const ts2 = await signIn(base, typed);
  r = await hook({ id: 'evt_typed_' + stamp, created: now, type: 'checkout.session.completed', data: { object: { mode: 'subscription', client_reference_id: typed, customer: 'cus_t' + stamp, customer_details: { email: typed }, subscription: 'sub_t' + stamp } } });
  t.eq(r.status, 200, 'webhook accepts a correctly signed event');
  t.eq((await me(ts2)).pro, false, 'a checkout naming an email (not our reference) does not grant Pro');
  // the real reference grants Pro; several v1 signatures (one valid) are fine
  const evOk = { id: 'evt_ok_' + stamp, created: now, type: 'checkout.session.completed', data: { object: { mode: 'subscription', client_reference_id: ref, customer: 'cus_b' + stamp, subscription: 'sub_b' + stamp, customer_details: { email: 'someone.else@xsite.test' } } } };
  const bOk = JSON.stringify(evOk); const good = stripeSig(bOk, WHSEC, now);
  r = await fetch(base + '/api/stripe/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 't=' + now + ',v1=' + '0'.repeat(64) + ',' + good.split(',')[1] }, body: bOk });
  t.eq(r.status, 200, 'a signature header with several v1 values is checked against all of them');
  t.eq((await me(bs)).pro, true, 'checkout with our reference grants Pro to the account that started it');
  // out-of-order: cancelled, then a late (older) invoice.paid must not re-grant
  r = await hook({ id: 'evt_del_' + stamp, created: now + 10, type: 'customer.subscription.deleted', data: { object: { id: 'sub_b' + stamp, customer: 'cus_b' + stamp, status: 'canceled' } } });
  t.eq((await me(bs)).pro, false, 'subscription deleted -> back to free');
  r = await hook({ id: 'evt_inv_' + stamp, created: now + 5, type: 'invoice.paid', data: { object: { subscription: 'sub_b' + stamp, customer: 'cus_b' + stamp } } });
  t.eq((await me(bs)).pro, false, 'a late invoice.paid after the cancellation does not re-grant Pro');
  r = await hook({ id: 'evt_inv2_' + stamp, created: now + 20, type: 'invoice.paid', data: { object: { subscription: 'sub_b' + stamp, customer: 'cus_b' + stamp } } });
  t.eq((await me(bs)).pro, false, 'nor does a newer invoice.paid for the dead subscription');
  // replayed event ids are ignored
  r = await fetch(base + '/api/stripe/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': good }, body: bOk });
  t.eq((await me(bs)).pro, false, 'a replayed (duplicate id) checkout event is ignored');

  // ── /send-email is not a relay ──
  r = await post(base, '/send-email', { email: 'anyone@example.org', html: '<p>x</p>' });
  t.ok(r.status === 401 || /not configured/i.test(r.text), '/send-email needs a session (' + r.status + ')');

  // ── Security headers ──
  r = await fetch(base + '/');
  t.ok(r.headers.get('x-frame-options') === 'DENY' && /frame-ancestors 'none'/.test(r.headers.get('content-security-policy') || ''), 'the app cannot be framed');
  t.ok(/max-age=31536000; includeSubDomains/.test(r.headers.get('strict-transport-security') || '') && r.headers.get('x-content-type-options') === 'nosniff' && r.headers.get('referrer-policy') === 'strict-origin-when-cross-origin' && /camera=\(\)/.test(r.headers.get('permissions-policy') || ''), 'HSTS, nosniff, Referrer-Policy and Permissions-Policy on the app');
  for (const p of ['/leads', '/inbox', '/reviews', '/admin']) { r = await fetch(base + p); t.eq(r.headers.get('x-frame-options'), 'DENY', p + ' cannot be framed'); }
  r = await fetch(base + '/example');
  t.ok(!r.headers.get('x-frame-options'), '/example can still be framed by the landing page');
  r = await fetch(base + '/me');
  t.eq(r.headers.get('cache-control'), 'no-store', 'account JSON is not cached');
  const pubSlug = 'xs' + stamp;
  await lib.pubPost(base, { html: s1.html, site: s1.site, siteId: s1.siteId, key: s1.formKey, slug: pubSlug }, null, email);
  r = await fetch(base + '/', { headers: { 'x-ws-test-host': pubSlug + '.websprout.app' } });
  t.ok(r.status === 200 && r.headers.get('x-content-type-options') === 'nosniff' && !!r.headers.get('referrer-policy') && !r.headers.get('x-frame-options'), 'published sites get nosniff + Referrer-Policy but stay frameable');

  // ── Rate limits ──
  const ip = '10.77.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250);
  let last = 0;
  for (let i = 0; i < 21; i++) { r = await post(base, '/create', { name: 'R' + i, type: 'Bakery' }, { 'x-ws-test-ip': ip }); last = r.status; if (i < 20 && r.status !== 200) break; }
  t.eq(last, 429, '/create is limited to 20 an hour per IP');
  const bomb = 'bomb.' + stamp + '@xsite.test'; const res = [];
  for (let i = 0; i < 4; i++) res.push((await post(base, '/auth/email', { email: bomb }, { 'x-ws-test-ip': '10.66.0.' + i })).status);
  t.eq(res.join(','), '200,200,200,400', 'sign-in emails: at most 3 per address per 15 minutes');

  // ── Pure helpers from the built worker ──
  const src = fs.readFileSync(path.join(__dirname, '..', 'dist', 'worker.js'), 'utf8');
  const grab = (name) => src.match(new RegExp('function ' + name + '\\([^)]*\\)\\s*\\{[^\\n]*\\}(?=\\n)|function ' + name + '\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}'))[0];
  const kit = new Function('fail', [grab('wsSecret'), grab('wsSafeEq'), grab('wsClean'), grab('isRealEmail'), grab('leadContact'), 'async ' + grab('siteKey')].join('\n') + '\nreturn { wsSafeEq, leadContact, siteKey };')(() => null);
  let threw = false; try { await kit.siteKey('abcd1234', {}); } catch (e) { threw = !!e.wsNoSecret; }
  t.ok(threw, 'site keys fail closed without FORM_SECRET (no built-in fallback secret)');
  t.ok(kit.wsSafeEq('abc', 'abc') && !kit.wsSafeEq('abc', 'abd') && !kit.wsSafeEq('abc', 'abcd'), 'constant-time compare');
  const t0 = Date.now();
  const lc = kit.leadContact({ message: 'a@' + 'a.'.repeat(1500) + '!', note: 'reach me at ana.ruiz@glow.co thanks', name: 'Ana‮' });
  t.ok(Date.now() - t0 < 200, 'lead contact extraction is fast on hostile input (' + (Date.now() - t0) + 'ms)');
  t.eq(lc.email + '|' + lc.name, 'ana.ruiz@glow.co|Ana', 'lead contact still finds the email (and strips bidi characters)');
};
