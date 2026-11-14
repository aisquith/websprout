// Leads: a signed-in owner sees every form submission from all their sites in one inbox, replies from their
// own email app or phone (mailto: / sms: / tel:), and can mark leads replied or archived. Other people cannot.
const { createSite, post, openPage, sleep } = require('./lib');

async function signIn(base, email) {
  await post(base, '/auth/email', { email });
  const m = await (await fetch(base + '/__test/mail?to=' + encodeURIComponent(email))).json();
  const token = ((m && m.html) || '').match(/token=([A-Za-z0-9_-]+)/)[1];
  const r = await fetch(base + '/auth/verify', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'token=' + token });
  const c = (r.headers.get('set-cookie') || '').match(/ws_sess=([^;]+)/);
  return c ? c[1] : '';
}
const api = (base, path, sess, body) => fetch(base + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'ws_sess=' + sess }, body: JSON.stringify(body) } : { headers: { Cookie: 'ws_sess=' + sess } });

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const stamp = Date.now().toString(36);
  const owner = 'owner.' + stamp + '@glow.test';
  const sess = await signIn(base, owner);
  t.ok(!!sess, 'owner can sign in (sign-in email works on the test server)');

  // two sites on the account, one lead each, plus a site that is not theirs
  const a = await createSite(base, { name: 'Glow Salon', type: 'Hair salon' });
  const b = await createSite(base, { name: 'Glow Spa', type: 'Day spa' });
  const other = await createSite(base, { name: 'Not Mine', type: 'Bakery' });
  let r = await api(base, '/my-sites/claim', sess, { sites: [{ siteId: a.siteId, key: a.formKey, name: 'Glow Salon', ts: 1 }, { siteId: b.siteId, key: b.formKey, name: 'Glow Spa', ts: 2 }] });
  t.eq(r.status, 200, 'sites are saved to the account');
  await post(base, '/api/form/' + a.siteId, { name: 'Ana Ruiz', email: 'ana.' + stamp + '@glow.test', phone: '(512) 555-0142', message: 'Can I book a cut Friday?\nAround 3pm.' });
  await sleep(20);
  await post(base, '/api/form/' + b.siteId, { name: 'Bo', phone: '512-555-0199', message: 'Price for a facial?' });
  await post(base, '/api/form/' + other.siteId, { name: 'Stranger', email: 'x.' + stamp + '@glow.test', message: 'not for this owner' });

  r = await fetch(base + '/api/leads');
  t.eq(r.status, 401, 'leads need sign-in');
  let j = await (await api(base, '/api/leads', sess)).json();
  t.eq(j.leads.length, 2, 'owner sees leads from both their sites, and only theirs');
  t.eq(j.leads.map((x) => x.site).join(','), 'Glow Spa,Glow Salon', 'newest first, labelled by site');
  const ana = j.leads.find((x) => x.contact.name === 'Ana Ruiz');
  t.ok(ana && /^ana\./.test(ana.contact.email) && ana.contact.phone === '(512) 555-0142', 'email, phone and name are picked out of the form');
  t.eq(j.leads.find((x) => x.contact.name === 'Bo').contact.email, '', 'a lead with only a phone has no email');

  // status changes: owner yes, others no
  r = await api(base, '/api/leads/status', sess, { id: ana.id, status: 'replied' });
  t.eq(r.status, 200, 'owner can mark a lead replied');
  j = await (await api(base, '/api/leads', sess)).json();
  t.ok(j.leads.find((x) => x.id === ana.id).status === 'replied' && j.leads.find((x) => x.id === ana.id).repliedAt > 0, 'replied status is saved');
  const intruder = await signIn(base, 'intruder.' + stamp + '@glow.test');
  r = await api(base, '/api/leads/status', intruder, { id: ana.id, status: 'archived' });
  t.eq(r.status, 403, "someone else cannot change another owner's leads");
  t.eq((await (await api(base, '/api/leads', intruder)).json()).leads.length, 0, "someone else sees none of the owner's leads");
  r = await api(base, '/api/leads/status', sess, { id: 'form:../x', status: 'replied' });
  t.eq(r.status, 400, 'malformed lead ids are refused');
  r = await fetch(base + '/api/leads/status', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'ws_sess=' + sess, 'Sec-Fetch-Site': 'cross-site' }, body: JSON.stringify({ id: ana.id, status: 'new' }) });
  t.eq(r.status, 403, 'other websites cannot change lead status');
  await api(base, '/api/leads/status', sess, { id: ana.id, status: 'new' });

  // the page, signed in, on desktop and phone
  for (const mobile of [false, true]) {
    const page = await openPage(browser, { mobile });
    await page.setCookie({ name: 'ws_sess', value: sess, url: base });
    await page.goto(base + '/leads', { waitUntil: 'networkidle2' });
    const info = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.lead')];
      const mail = document.querySelector('a[href^="mailto:"]'); const sms = document.querySelector('a[href^="sms:"]'); const tel = document.querySelector('a[href^="tel:"]');
      return { n: cards.length, mail: mail && mail.getAttribute('href'), sms: sms && sms.getAttribute('href'), tel: tel && tel.getAttribute('href'), txt: document.body.innerText, ov: document.documentElement.scrollWidth - innerWidth };
    });
    const tag = mobile ? 'phone: ' : '';
    t.eq(info.n, 2, tag + 'leads page lists both new leads');
    const mu = decodeURIComponent(info.mail || '');
    t.ok(/^mailto:ana\./.test(mu) && /subject=Re: your message to Glow Salon/.test(mu) && /Hi Ana,/.test(mu) && /> Can I book a cut Friday\?\n> Around 3pm\./.test(mu), tag + 'Reply by email opens their email app, addressed, with a greeting and the quoted message');
    t.ok(/^sms:\(?\+?[0-9]/.test(info.sms || 'x') && /^sms:[0-9+]+\?&body=/.test(info.sms) && /^tel:[0-9+]+$/.test(info.tel || ''), tag + 'Text and Call open the phone with the number ' + info.sms + ' ' + info.tel);
    t.ok(info.ov <= 1, tag + 'no sideways scroll');
    t.eq(page._wsErrors.length, 0, tag + 'no JS errors ' + page._wsErrors.join('; '));
    await page.close();
  }
  // archive from the page; it leaves the New tab and stays archived after reload
  const page = await openPage(browser, {});
  await page.setCookie({ name: 'ws_sess', value: sess, url: base });
  await page.goto(base + '/leads', { waitUntil: 'networkidle2' });
  await page.evaluate(() => { const c = [...document.querySelectorAll('.lead')].find((x) => /Bo/.test(x.innerText)); [...c.querySelectorAll('button')].find((x) => x.textContent === 'Archive').click(); });
  await sleep(700);
  t.eq(await page.evaluate(() => document.querySelectorAll('.lead').length), 1, 'archived lead leaves the New list');
  j = await (await api(base, '/api/leads', sess)).json();
  t.eq(j.leads.find((x) => x.contact.name === 'Bo').status, 'archived', 'archive is saved');
  // signed out: a sign-in prompt, not an error
  const out = await openPage(browser, {});
  await out.deleteCookie({ name: 'ws_sess', url: base });
  await out.goto(base + '/leads', { waitUntil: 'networkidle2' });
  t.ok(await out.evaluate(() => /Sign in/.test(document.body.innerText) && !!document.querySelector('a[href="/?signin=1"]')), 'signed-out visitors get a sign-in button');
  await out.close();
  await page.close();
};
