// Security guards and pure helper logic.
const fs = require('fs');
const path = require('path');
const { post, createSite } = require('./lib');

module.exports = async function (ctx, t) {
  const { base } = ctx;
  // Admin GET actions refuse requests triggered by other sites
  for (const site of ['cross-site', 'same-site']) {
    const r = await fetch(base + '/admin/grant?email=x@y.com&plan=pro', { headers: { 'Sec-Fetch-Site': site } });
    t.eq(r.status, 403, 'admin grant refuses ' + site + ' requests');
    t.eq((await r.text()).trim(), 'Forbidden', 'admin grant ' + site + ' is blocked before auth');
  }
  // siteIds with separators are rejected (no writing into another site's keys)
  let r = await post(base, '/api/form/abcd1234:x', { a: 'b' });
  t.eq(r.status, 400, 'form siteId with ":" is rejected');
  r = await post(base, '/api/review', { site: 'abcd1234:x', text: 'spam' });
  t.eq(r.status, 400, 'review siteId with ":" is rejected');
  // user HTML on the app origin is sandboxed
  const fd = new FormData(); fd.append('html', '<b>x</b>');
  r = await fetch(base + '/render', { method: 'POST', body: fd });
  t.ok(/sandbox/.test(r.headers.get('content-security-policy') || ''), '/render is sandboxed');
  const pv = await post(base, '/preview', { html: '<p>hi</p>' });
  const id = (pv.json.url || '').split('id=')[1];
  r = await fetch(base + '/preview?id=' + id);
  t.ok(/sandbox/.test(r.headers.get('content-security-policy') || ''), 'share previews are sandboxed');
  // a domain cannot be pointed at another site without being Pro + owner
  const s = await createSite(base, { name: 'D', type: 'Plumber' });
  r = await post(base, '/api/connect-domain', { domain: 'example.com', slug: 'nope', siteId: s.siteId, key: s.formKey });
  t.ok(r.status >= 400, 'custom domains need a signed-in Pro owner');

  // Sign-in links: opening one never signs in by itself (scanners), bad or used tokens go to "expired"
  r = await fetch(base + '/auth/verify?token=' + 'ab'.repeat(20), { redirect: 'manual' });
  t.ok(r.status === 302 && /login=expired/.test(r.headers.get('location') || ''), 'unknown sign-in token redirects to "expired"');
  r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://evil.example' }, body: 'token=' + 'ab'.repeat(20) });
  t.ok(r.status === 302 && /login=error/.test(r.headers.get('location') || ''), 'cross-site sign-in POST is refused');

  // Pure helpers, loaded from the built worker
  const src = fs.readFileSync(path.join(__dirname, '..', 'dist', 'worker.js'), 'utf8');
  const fnSrc = src.match(/function priceToCents\(v\)\{[\s\S]*?\n\}/)[0];
  const priceToCents = new Function(fnSrc + '; return priceToCents;')();
  const cases = { '$25': 2500, '$15 - $25': 1500, '2 for $10': 1000, '$1,250.00': 125000, '$5.99/ea': 599, 'Free': 0, '12.5': 1250 };
  for (const [k, v] of Object.entries(cases)) t.eq(priceToCents(k), v, 'price "' + k + '"');
};
