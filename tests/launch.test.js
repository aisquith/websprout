// Launch-readiness fixes: Pro features follow the plan on published sites, unlinked Stripe payments alert the owner,
// reminder and digest emails carry unsubscribe headers and the mailing address, the optional contact-form bot check,
// and the optional ad conversion tags.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createSite, pubPost, signIn, cookie } = require('./lib');

const OWNER = (fs.readFileSync(path.join(__dirname, '../src/00-header.js'), 'utf8').match(/SUPPORT_EMAIL\s*=\s*'([^']+)'/) || [])[1];
const WHSEC = 'whsec_test_websprout';
function stripeSig(body, t) { t = t || Math.floor(Date.now() / 1000); return 't=' + t + ',v1=' + crypto.createHmac('sha256', WHSEC).update(t + '.' + body).digest('hex'); }

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const stamp = Date.now().toString(36);
  const admin = await signIn(base, OWNER);
  const grant = (email, plan) => fetch(base + '/admin/grant?email=' + encodeURIComponent(email) + '&plan=' + plan, { headers: { Cookie: cookie(admin) } });
  const live = async (slug) => (await fetch(base + '/', { headers: { 'x-ws-test-host': slug + '.websprout.app' } })).text();

  // ── Pro features on published sites follow the plan ──
  const buyer = 'plan.' + stamp + '@launch.test';
  t.eq((await grant(buyer, 'pro')).status, 200, 'the owner can give Pro');
  const s = await createSite(base, { name: 'Plan Bakery', type: 'Bakery', city: 'Austin' });
  const slug = 'plan' + stamp;
  let r = await pubPost(base, { html: s.html, siteId: s.siteId, key: s.formKey, slug }, null, buyer);
  t.eq(r.status, 200, 'a Pro account publishes');
  t.ok(r.json && r.json.nobadge === true && !/ws-badge/.test(await live(slug)), 'the Pro site has no Websprout badge');
  await grant(buyer, 'free');
  t.ok(/ws-badge/.test(await live(slug)), 'when Pro ends, the badge comes back on the live site without republishing');
  await grant(buyer, 'pro');
  t.ok(!/ws-badge/.test(await live(slug)), 'when Pro comes back, the badge is hidden again');
  await grant(buyer, 'free');
  r = await pubPost(base, { html: s.html, siteId: s.siteId, key: s.formKey, slug }, null, buyer);
  t.ok(r.status === 200 && /ws-badge/.test(await live(slug)), 'a free account republishing keeps the badge');

  // ── Stripe: a payment with no account reference is recorded and the owner is told ──
  const typed = 'paid.' + stamp + '@launch.test';
  const ev = { id: 'evt_unm_' + stamp, created: Math.floor(Date.now() / 1000), type: 'checkout.session.completed', data: { object: { mode: 'subscription', customer: 'cus_u' + stamp, subscription: 'sub_u' + stamp, customer_details: { email: typed } } } };
  const body = JSON.stringify(ev);
  r = await fetch(base + '/api/stripe/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': stripeSig(body) }, body });
  t.eq(r.status, 200, 'the unmatched payment is acknowledged');
  const mail = await (await fetch(base + '/__test/mail?to=' + encodeURIComponent(OWNER.toLowerCase()))).json();
  t.ok(mail && /not linked to an account/.test(mail.subject || '') && (mail.html || '').indexOf(typed) > -1, 'the owner gets an email naming the address typed at checkout');
  const data = await (await fetch(base + '/admin/data', { headers: { Cookie: cookie(admin) } })).json();
  t.ok(Array.isArray(data.unmatched) && data.unmatched.some((x) => x.typed === typed), 'and it is listed in Admin > Revenue');
  r = await fetch(base + '/api/stripe/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': stripeSig(body) }, body });
  t.eq(r.status, 200, 'a repeat of a handled event is acknowledged (and ignored)');

  // ── Pure helpers from the built worker ──
  const src = fs.readFileSync(path.join(__dirname, '..', 'dist', 'worker.js'), 'utf8');
  const grab = (name) => src.match(new RegExp('(?:async )?function ' + name + '\\([^)]*\\)\\s*\\{[^\\n]*\\}(?=\\n)|(?:async )?function ' + name + '\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}'))[0];
  const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const K = new Function('escHtml', 'WS_POSTAL_ADDRESS', [grab('wsPostalAddress'), grab('wsUnsubHeaders'), grab('wsMailFooter'), grab('wsTurnstileInject'), grab('wsAdsCfg'), grab('wsAdsOn'), grab('wsAdsTags'), grab('wsPrivacyWithAds')].join('\n')
    + '\nreturn { wsPostalAddress, wsUnsubHeaders, wsMailFooter, wsTurnstileInject, wsAdsTags, wsAdsOn, wsPrivacyWithAds };')(esc, '');

  // Email footer
  const u = 'https://websprout.app/email-optout?e=a%40b.c&t=x';
  const h = K.wsUnsubHeaders(u);
  t.ok(h['List-Unsubscribe'] === '<' + u + '>' && h['List-Unsubscribe-Post'] === 'List-Unsubscribe=One-Click', 'reminder and digest emails carry one-click unsubscribe headers');
  const f = K.wsMailFooter({ POSTAL_ADDRESS: '123 Main St, Austin, TX 78701' }, 'Why you got this.', u);
  t.ok(f.indexOf(u) > -1 && /Unsubscribe/.test(f) && /123 Main St, Austin, TX 78701/.test(f), 'the footer has the unsubscribe link and the mailing address');
  t.ok(!/<script/.test(K.wsMailFooter({ POSTAL_ADDRESS: '<script>x</script>' }, '', u)), 'the address is escaped');
  r = await fetch(base + '/email-optout?e=' + encodeURIComponent('a@b.c') + '&t=wrong', { method: 'POST' });
  t.ok(r.status === 200 && /not valid/.test(await r.text()), 'one-click unsubscribe (POST) is accepted and checks the link');

  // Contact-form bot check
  const page = '<html><body><form action="https://websprout.app/api/form/abc123" method="POST"><input name="email"><button>Send</button></form><form data-sa-check><input name="zip"></form></body></html>';
  t.eq(K.wsTurnstileInject(page, {}), page, 'without a Turnstile key, published pages are unchanged');
  const tp = K.wsTurnstileInject(page, { TURNSTILE_SITE_KEY: '0x4AAAAAAAtestkey' });
  t.ok((tp.match(/cf-turnstile/g) || []).length === 1 && /<div class="cf-turnstile"[^>]*><\/div><\/form><form data-sa-check>/.test(tp), 'with a key, only the contact form gets the bot check');
  t.ok((tp.match(/challenges\.cloudflare\.com\/turnstile/g) || []).length === 1, 'and the Turnstile script is added once');
  t.eq(K.wsTurnstileInject(page, { TURNSTILE_SITE_KEY: '"><script>' }), page, 'a malformed key is ignored');
  // The live site: no key on the test server, so forms are untouched and still work.
  r = await fetch(base + '/api/form/' + s.siteId, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Ann', email: 'ann.' + stamp + '@launch.test', message: 'Hi', 'cf-turnstile-response': 'tok' }) });
  t.ok(r.status === 200, 'a contact form submission still works');

  // Ad conversion tags
  t.eq(K.wsAdsTags({}), '', 'no ad tags unless configured');
  const tags = K.wsAdsTags({ GOOGLE_TAG_ID: 'AW-123456789', GOOGLE_ADS_PUBLISH_LABEL: 'AW-123456789/AbCdEf', META_PIXEL_ID: '1234567890' });
  t.ok(/googletagmanager\.com\/gtag\/js\?id=AW-123456789/.test(tags) && /fbq\("init","1234567890"\)/.test(tags) && /AW-123456789\/AbCdEf/.test(tags) && /window\.wsConv=/.test(tags), 'Google and Meta tags and the conversion helper are added when configured');
  t.eq(K.wsAdsTags({ GOOGLE_TAG_ID: 'AW-1"><script>', META_PIXEL_ID: 'abc' }), '', 'malformed IDs are ignored');
  const priv = K.wsPrivacyWithAds('<p>Websprout measures how the site is used without cookies or third-party trackers: x</p><p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>');
  t.ok(/advertising tags/.test(priv) && !/third-party trackers/.test(priv), 'the privacy page explains the ad tags when they are on');
  const home = await (await fetch(base + '/')).text();
  t.ok(!/googletagmanager|fbevents/.test(home), 'the test server (no ad settings) serves no ad tags');
  t.ok(/third-party trackers/.test(await (await fetch(base + '/privacy')).text()), 'and the privacy page keeps the no-trackers wording');
};
