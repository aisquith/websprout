// Publishing, the live site, contact forms, inbox and reviews.
const { createSite, post, openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const s = await createSite(base, { name: 'Glow Salon', type: 'Hair salon', city: 'Austin', phone: '512-555-0100' });
  const slug = 'qa' + Date.now().toString(36);
  // pretend the owner published while looking at the About page
  const html = s.html.replace('</body>', '<script>window.__wsInitPath="about";</script></body>');
  let r = await post(base, '/publish', { html, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r.status, 200, 'publish succeeds');
  r = await post(base, '/publish', { html, siteId: s.siteId, key: 'wrong', slug });
  t.eq(r.status, 403, 'publish with a wrong key is refused');
  const other = await createSite(base, { name: 'Other', type: 'Bakery' });
  r = await post(base, '/publish', { html: 'x', siteId: other.siteId, key: other.formKey, slug });
  t.eq(r.status, 400, 'another site cannot take a published name');
  r = await post(base, '/unpublish', { slug, siteId: other.siteId, key: other.formKey });
  t.ok(r.status >= 400, 'another site cannot unpublish it');

  const live = await fetch(base + '/s/' + slug);
  t.ok(/sandbox/.test(live.headers.get('content-security-policy') || ''), 'published pages on the app origin are sandboxed');
  const liveHtml = await live.text();
  t.ok(/window\.__wsInitPath="";/.test(liveHtml), 'published home opens on Home, not the page being edited');

  const page = await openPage(browser, { mobile: true });
  const posts = [];
  await page.setRequestInterception(true);
  page.on('request', (q) => { const u = q.url(); if (u.startsWith('https://websprout.app/api/')) { if (q.method() === 'POST') posts.push(u); q.continue({ url: u.replace('https://websprout.app', base) }); } else q.continue(); });
  await page.goto(base + '/s/' + slug, { waitUntil: 'networkidle2' });
  t.eq(await page.evaluate(() => location.hash || ''), '', 'lands on Home');
  const bookLinks = await page.evaluate(() => [...new Set([...document.querySelectorAll('a')].filter((a) => /book|appointment/i.test(a.textContent)).map((a) => a.getAttribute('href')))]);
  t.ok(bookLinks.length && bookLinks.every((h) => new RegExp('^/s/' + slug + '/(book|contact)$').test(h)), 'Book buttons go to the booking page ' + JSON.stringify(bookLinks));
  // phone menu after scrolling covers the screen
  await page.evaluate(() => window.scrollTo(0, 900)); await sleep(400);
  await page.evaluate(() => document.querySelector('.navtoggle').click()); await sleep(300);
  const navH = await page.evaluate(() => Math.round(document.querySelector('.top nav').getBoundingClientRect().height));
  t.ok(navH >= 700, 'phone menu opens full screen after scrolling (' + navH + 'px)');
  await page.evaluate(() => document.querySelector('.navtoggle').click());
  // contact form: one POST, visible confirmation, lead in inbox
  await page.goto(base + '/s/' + slug + '/contact', { waitUntil: 'networkidle2' });
  t.ok(/\/contact$/.test(await page.evaluate(() => location.pathname)), 'contact page has its own URL');
  await page.evaluate(() => {
    const f = [...document.forms].find((x) => x.offsetParent);
    [...f.elements].forEach((e) => { if (e.name === '_ws_hp' || e.type === 'hidden') return; if (e.type === 'email') e.value = 'lead@example.com'; else if (e.tagName === 'TEXTAREA') e.value = 'Hello'; else if (e.type === 'text' || e.type === 'tel') e.value = 'Test'; });
    f.querySelector('[type=submit],button').click();
  });
  await sleep(1800);
  t.eq(posts.filter((u) => u.includes('/api/form/')).length, 1, 'a form submission sends exactly one request');
  t.ok(/sent|thank/i.test(await page.evaluate(() => document.body.innerText)), 'visitor sees a confirmation');
  t.eq(page._wsErrors.length, 0, 'live site runs without JS errors ' + page._wsErrors.join('; '));
  await page.close();
  const inbox = await (await fetch(base + '/api/inbox?site=' + s.siteId + '&key=' + s.formKey)).json();
  t.ok(inbox.submissions.some((x) => x.fields && x.fields.email === 'lead@example.com'), 'lead arrives in the inbox');
  r = await post(base, '/api/form/' + s.siteId, { name: 'Spam', _ws_hp: 'x' });
  t.eq(r.status, 200, 'honeypot submissions are accepted silently');
  // auto-reply to the visitor, from the business
  const mail = async (to) => (await fetch(base + '/__test/mail?to=' + encodeURIComponent(to))).json();
  const lead = 'ana.' + Date.now().toString(36) + '@glow.test';
  r = await post(base, '/api/form/' + s.siteId, { name: 'Ana <b>Ruiz</b>', email: lead, message: 'Buy cheap pills at spam.example' });
  let m = await mail(lead);
  t.ok(m && /Glow Salon/.test(m.from) && /Glow Salon/.test(m.subject), 'visitor gets an auto-reply from the business');
  t.ok(m && /Hi Ana,/.test(m.html) && !/pills|<b>Ruiz/.test(m.html), 'auto-reply greets by first name and never echoes the message');
  await post(base, '/api/inbox/notify', { site: s.siteId, key: s.formKey, email: 'owner@glow.test' });
  const lead2 = 'bo.' + Date.now().toString(36) + '@glow.test';
  await post(base, '/api/form/' + s.siteId, { email: lead2, message: 'Hi' });
  m = await mail(lead2);
  t.eq(m && m.reply_to, 'owner@glow.test', 'replies to the auto-reply go to the owner');
  await post(base, '/api/form/' + s.siteId, { email: lead2, message: 'again' });
  t.eq((await mail(lead2)).n, 1, 'only one auto-reply per address per day');
  r = await post(base, '/api/inbox/autoreply', { site: s.siteId, key: 'wrong', on: false });
  t.eq(r.status, 403, 'auto-reply setting needs the inbox key');
  r = await post(base, '/api/inbox/autoreply', { site: s.siteId, key: s.formKey, on: false });
  t.eq(r.status, 200, 'owner can turn auto-replies off');
  t.eq((await (await fetch(base + '/api/inbox?site=' + s.siteId + '&key=' + s.formKey)).json()).autoreply, false, 'inbox shows auto-reply off');
  const lead3 = 'cy.' + Date.now().toString(36) + '@glow.test';
  await post(base, '/api/form/' + s.siteId, { email: lead3, message: 'Hi' });
  t.eq(await mail(lead3), null, 'no auto-reply once turned off');
  const unpub = await createSite(base, { name: 'Draft Co', type: 'Bakery' });
  const lead4 = 'di.' + Date.now().toString(36) + '@glow.test';
  await post(base, '/api/form/' + unpub.siteId, { email: lead4, message: 'Hi' });
  t.eq(await mail(lead4), null, 'unpublished sites send no auto-reply');
  // reviews
  r = await post(base, '/api/review', { site: s.siteId, name: 'Ann', rating: 5, text: 'Great!' });
  t.eq(r.status, 200, 'a visitor can leave a review');
};
