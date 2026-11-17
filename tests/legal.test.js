// Terms, privacy policy and the privacy-choices page: key legal statements are present and the strings the router's
// wsPrivacyWithAds() replaces still exist in PRIVACY_PAGE.
const fs = require('fs');
const path = require('path');

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const text = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ');

  const tr = await fetch(base + '/terms');
  t.eq(tr.status, 200, '/terms loads');
  const terms = await tr.text();
  const tt = text(terms);
  t.ok(/at least 18 years old/.test(tt), 'terms: users must be 18+');
  t.ok(/7-day free trial/.test(tt), 'terms: trial length stated');
  t.ok(/renews automatically every month at \$10\/month until you cancel/.test(tt), 'terms: Pro renews automatically at $10/month');
  t.ok(/Manage billing/.test(tt), 'terms: how to cancel online');
  t.ok(/stays live on the free plan/.test(tt), 'terms: site stays live on the free plan after cancelling');
  t.ok(/Content checks and moderation/.test(tt) && /refuse to publish, take down/.test(tt), 'terms: moderation section');
  t.ok(/fake reviews/.test(tt), 'terms: no fake reviews');
  t.ok(/showcase, examples and marketing/.test(tt), 'terms: showcase license');
  t.ok(terms.indexOf('mailto:abuse@websprout.app') > -1, 'terms: abuse@ contact');
  t.ok(/consent to the jurisdiction of the Federal District Court/.test(tt), 'terms: DMCA counter-notice jurisdiction consent');
  t.ok(/will terminate, in appropriate circumstances/.test(tt), 'terms: repeat-infringer policy');

  const pr = await fetch(base + '/privacy');
  t.eq(pr.status, 200, '/privacy loads');
  const priv = await pr.text();
  const pt = text(priv);
  t.ok(/120 days/.test(pt), 'privacy: leads kept 120 days');
  t.ok(/Global Privacy Control/.test(pt), 'privacy: Global Privacy Control');
  t.ok(/18 or older/.test(pt) && /under 13/.test(pt) && !/under 16/.test(pt), 'privacy: 18+, not directed at under-13s');
  t.ok(/Content checks/.test(pt) && /Gemini/.test(pt), 'privacy: content moderation by Gemini disclosed');
  t.ok(/California/.test(pt) && /Correct/.test(pt) && /Limit/.test(pt), 'privacy: CCPA rights');
  t.ok(/data protection authority/.test(pt), 'privacy: right to complain (GDPR/UK)');
  t.ok(/on behalf of the business that owns the site/.test(pt), 'privacy: visitor data processed for the owner');
  t.ok(priv.indexOf('href="/privacy-choices"') > -1, 'privacy: links to /privacy-choices');
  t.ok(!/share it for advertising/.test(pt), 'privacy: no "never share for advertising" claim');
  t.ok(!/after 60 days\. We may/.test(pt) && /400 days/.test(pt), 'privacy: analytics retention is consistent');

  // The two exact strings wsPrivacyWithAds (40-router.js) replaces must stay in PRIVACY_PAGE.
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', '30-static-pages.js'), 'utf8');
  const pp = src.slice(src.indexOf('const PRIVACY_PAGE'), src.indexOf('</html>`;', src.indexOf('const PRIVACY_PAGE')));
  t.ok(pp.indexOf('Websprout measures how the site is used without cookies or third-party trackers:') > -1, 'PRIVACY_PAGE keeps the analytics sentence the ads variant replaces');
  t.ok(pp.indexOf('<p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>') > -1, 'PRIVACY_PAGE keeps the cookies paragraph the ads variant replaces');

  // /privacy-choices is not routed yet: check the constant made it into the build.
  const worker = fs.readFileSync(path.join(__dirname, '..', 'dist', 'worker.js'), 'utf8');
  t.ok(worker.indexOf('const PRIVACY_CHOICES_PAGE') > -1, 'PRIVACY_CHOICES_PAGE is in dist/worker.js');
  t.ok(worker.indexOf('ws_adsoff=1; Max-Age=31536000; Path=/; Secure; SameSite=Lax') > -1, 'privacy choices sets the ws_adsoff cookie');
};
