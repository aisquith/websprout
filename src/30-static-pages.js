const SUCCESS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Successful — Websprout</title>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f1a0d;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem}
.card{max-width:480px;width:100%}
.icon{font-size:72px;margin-bottom:1.5rem;animation:pop .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
h1{font-family:'Cabinet Grotesk',sans-serif;font-size:2.5rem;font-weight:900;letter-spacing:-1.5px;margin-bottom:1rem;color:#fff}
p{color:rgba(255,255,255,.72);font-size:16px;line-height:1.6;margin-bottom:2rem}
.btn{display:inline-block;background:#2d7a3a;color:#fff;padding:16px 36px;border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;transition:all .2s}
.btn:hover{background:#4aaa57;transform:translateY(-2px)}
.btn:active{transform:translateY(0) scale(.97)}
.sub{margin-top:1.5rem;font-size:13px;color:rgba(255,255,255,.72)}
</style>
</head>
<body>
<div class="card">
  <div class="icon">🎉</div>
  <h1>Payment successful!</h1>
  <p>Your site is unlocked and ready to download. Head back to Websprout to get your code.</p>
  <a href="/?sub=success" class="btn">Get my code →</a>
  <p class="sub">You'll be redirected to your site automatically.</p>
</div>
<script>
  // Auto redirect after 3 seconds
  setTimeout(function(){ window.location.href='/?sub=success'; }, 3000);
</script>
</body>
</html>`;

const TERMS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service — Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f7f0;color:#0f1a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;padding:4rem 2rem;line-height:1.7}
.wrap{max-width:700px;margin:0 auto}
h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}
.meta{color:#4d5c4a;margin-bottom:3rem;font-size:14px}
ul{margin:.2rem 0 1rem 1.25rem}li{margin-bottom:.4rem;color:#2e3d2b}
h2{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem}
p{margin-bottom:1rem;color:#2e3d2b}
a{color:#2d7a3a}
.back{display:inline-block;margin-bottom:2rem;color:#2d7a3a;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Terms of Service</h1>
<p class="meta">Last updated: November 2026</p>

<p>These Terms of Service ("Terms") govern your use of Websprout (the "Service"), operated by Websprout ("we", "us"). By creating an account, building a site, or using any feature, you agree to these Terms. If you do not agree, do not use the Service.</p>

<h2>1. What Websprout is</h2>
<p>Websprout is a website builder. You can describe a business and automatically generate, preview, edit, and publish a website. Building and previewing are free. A paid (Pro) subscription unlocks removing the Websprout badge, connecting a custom domain, downloading your site's source code, and store features. Some capabilities &mdash; including live product management and payment checkout &mdash; are hosted online services that run on our servers, not files you download (see Sections 4, 5 and 6).</p>

<h2>2. Accounts</h2>
<p>You are responsible for all activity under your account and for keeping your sign-in access secure. You must provide accurate information and be old enough to form a binding contract where you live. You may not impersonate others or build sites you are not authorized to create.</p>

<h2>3. Subscriptions and payment</h2>
<p>Pro may be offered with a free trial (currently seven days). When you start a trial we collect a payment method but do not charge you during the trial period. Unless you cancel before the trial ends, your paid subscription begins automatically when the trial ends and the then-current plan price is charged to your payment method. You can cancel at any time during the trial to avoid being charged. Paid plans are billed in advance through Stripe at the price shown at checkout and renew automatically until cancelled. You can cancel anytime; cancellation stops future charges, and paid features remain available through the end of the current billing period. Fees are non-refundable except where required by law. We may change pricing with reasonable notice, applied to future billing periods.</p>

<h2>4. Your content and ownership of downloaded code</h2>
<p>You own the content you provide and the website source code you download while you have an active paid subscription. Downloaded code is the static files of your site (the HTML, CSS, JavaScript and layout we generated for you) and is yours to host and use for any lawful purpose, personal or commercial.</p>
<p>Downloaded code does <strong>not</strong> include Websprout's hosted services. In particular, the live product catalog, the payment checkout, lead-capture form processing, and similar server-side features are provided by us as an ongoing online service and are not part of the files you download.</p>

<h2>5. Store, products and the checkout service</h2>
<p>Store features let you list products and accept payments. Payment checkout is a hosted service: when a visitor clicks a buy button, a request is made to Websprout's servers, which create the payment session. This service is available only while you maintain an active, paid subscription. If your subscription lapses or is cancelled, the checkout service stops working &mdash; including on any self-hosted or downloaded copy of your site &mdash; and buy buttons will no longer process payments. A downloaded store page works as a product catalog; to take payments you must use the active hosted checkout.</p>
<p>You may not copy, reverse-engineer, reproduce, or build a substitute for the Websprout checkout or other hosted services in order to avoid subscription fees, applicable transaction fees, or these Terms. You are solely responsible for the products you sell, their descriptions and prices, fulfilment, refunds, taxes, and compliance with all laws that apply to your sales. Payments are processed by Stripe and are subject to Stripe's terms; we are not the seller of your goods and are not a party to transactions between you and your customers.</p>

<h2>6. Fees on sales</h2>
<p>Where we charge a per-sale or transaction fee for use of the checkout service, the applicable fee is disclosed to you before you enable payments and is deducted automatically. Payment-processor fees charged by Stripe are separate and set by Stripe.</p>

<h2>7. Acceptable use</h2>
<p>You may not use Websprout to create or distribute content that is illegal, infringes others' rights, promotes hate or violence, facilitates fraud, distributes malware, or violates any applicable law. We may suspend or remove sites, or terminate accounts, that violate these Terms.</p>

<h2>8. Service availability and "as is"</h2>
<p>The Service, including automatically generated output, is provided "as is" and "as available", without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy, or uninterrupted availability. Generated output may contain errors; you are responsible for reviewing your site before you publish or sell.</p>

<h2>9. Limitation of liability</h2>
<p>To the maximum extent permitted by law, Websprout will not be liable for any indirect, incidental, special, or consequential damages, or for lost profits, revenue, data, or goodwill, arising from your use of the Service. Our total liability for any claim relating to the Service will not exceed the amount you paid us in the three months before the claim.</p>

<h2>10. Termination</h2>
<p>You may stop using the Service and cancel at any time. We may suspend or terminate access for violations of these Terms or to comply with law. Provisions that by their nature should survive termination (including ownership, fees owed, disclaimers, indemnification, and limitation of liability) will survive.</p>

<h2>11. Changes to these Terms</h2>
<p>We may update these Terms from time to time. Material changes are reflected by updating the date above; continued use after changes take effect constitutes acceptance.</p>

<h2>12. Governing law</h2>
<p>These Terms are governed by the laws of the State of Georgia, United States, without regard to conflict-of-law rules, and you submit to the exclusive jurisdiction of the state and federal courts located in Georgia, except where mandatory consumer-protection law grants you rights where you live.</p>

<h2>13. Copyright and takedown</h2>
<p>We respect intellectual property rights and expect you to do the same. You must not use Websprout to build or publish content that infringes another person's copyright, trademark, or other rights.</p>
<p>If you believe content published through Websprout infringes a copyright you own or represent, send a notice to <a href="mailto:support@websprout.app">support@websprout.app</a> that includes: (a) your contact information; (b) identification of the work you say is infringed; (c) the URL or location of the material you want removed; (d) a statement that you have a good-faith belief the use is not authorized by the rights holder, its agent, or the law; (e) a statement, under penalty of perjury, that the information in your notice is accurate and that you are the rights holder or authorized to act on their behalf; and (f) your physical or electronic signature.</p>
<p>We will review valid notices and may remove or disable access to the material. We may also remove sites and terminate the accounts of users who repeatedly infringe. If you believe your material was removed in error, you may send a counter-notice to the same address with your contact details and a statement, under penalty of perjury, that you have a good-faith belief the material was removed by mistake.</p>
<h2>14. Indemnification</h2>
<p>You agree to indemnify and hold harmless Websprout and the people who operate it from any claims, damages, losses, liabilities, and reasonable costs (including legal fees) arising from: (a) the content you create, publish, or sell through the Service; (b) your products, their fulfilment, and your transactions with your customers; (c) your use of the Service in violation of these Terms or any law; or (d) your infringement of another party's rights. We will notify you of any such claim and may take part in its defense; you may not settle a claim in a way that creates obligations for us without our consent.</p>
<h2>15. Contact</h2>
<p>Questions about these Terms: <a href="mailto:support@websprout.app">support@websprout.app</a></p>
</div>
</body>
</html>`;

const PRIVACY_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy — Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f7f0;color:#0f1a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;padding:4rem 2rem;line-height:1.7}
.wrap{max-width:700px;margin:0 auto}
h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}
.meta{color:#4d5c4a;margin-bottom:3rem;font-size:14px}
ul{margin:.2rem 0 1rem 1.25rem}li{margin-bottom:.4rem;color:#2e3d2b}
h2{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem}
p{margin-bottom:1rem;color:#2e3d2b}
a{color:#2d7a3a}
.back{display:inline-block;margin-bottom:2rem;color:#2d7a3a;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Privacy Policy</h1>
<p class="meta">Last updated: November 2026</p>
<h2>What we collect</h2>
<p>When you sign in, we store your email address and basic account details (your plan, and a payment reference if you upgrade). We use Stripe for payments — we never see or store your card details. When you build with Websprout, we store the sites you create on our servers so your work is saved to your account and your published sites stay live: this includes your drafts and published pages, any products you add, customer reviews, the contact-form messages (leads) your visitors send you, and basic usage counts.</p>
<p>To operate, secure and improve the service, we also keep a short activity log of visits and key actions (such as signing in, generating a site, and publishing). Each entry includes an approximate location (country, region and city) derived from your IP address, a one-way hashed form of your IP address (we do not store your raw IP address in this log), your browser and device type, and the referring link that brought you to the site. We use this only for our own product analytics, security and understanding how Websprout is used. We do not sell it or share it for advertising.</p>
<h2>What we don't collect</h2>
<p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>
<h2>How your site is generated</h2>
<p>When you describe your business, Websprout builds your site on our own servers using our built-in content engine and templates. The business details you enter are not sent to any third-party AI service for this. We may use the type of business you select to fetch relevant royalty-free stock photos (see "Service providers we use").</p>
<h2>Generated sites</h2>
<p>While you are building, a working copy of your site is kept in your browser. Once you sign in or publish, your site (drafts and published pages) is also stored on our servers so it stays saved to your account and stays live on the web. You can remove any site at any time, or delete everything at once from your account settings (see below).</p>
<h2>Service providers we use</h2>
<p>We rely on a small number of trusted providers to run the Service. Each processes data only to provide its part of the Service:</p>
<ul>
<li><strong>Cloudflare</strong> — hosts Websprout and securely stores your account and the sites you build.</li>
<li><strong>Unsplash</strong> — supplies royalty-free stock photos. When a site is generated, we send only the business category (not your personal details) to Unsplash to find relevant images.</li>
<li><strong>Stripe</strong> — processes subscription and store payments. We never see or store card details.</li>
<li><strong>Resend</strong> — delivers transactional email, such as notifying you when a visitor submits a form on your site.</li>
</ul>
<h2>Payment links you add to your site</h2>
<p>If you add payment buttons (for example deposits, invoices, gift cards or tips) using your own Stripe, PayPal, Venmo, Square or similar links, clicking a button takes your visitor to that provider's own checkout. Those payments are handled entirely by the provider you chose, under their terms and privacy policy. Websprout does not process, receive or store them.</p>
<h2>How long we keep your data</h2>
<p>We keep your account and the sites you build for as long as your account is active. Contact-form submissions (leads) and customer reviews are kept for a limited period and then expire automatically. Activity-log entries (visits and actions) are automatically deleted after 60 days. We may also send you an occasional service email about your own account or sites (for example, a one-time reminder that an unpublished site is saved); every such email includes an unsubscribe link, and we honor opt-outs. When you delete a site or your account, the associated data is removed from our systems, except payment records that Stripe is required to retain by law. You can delete everything at any time (see below).</p>
<h2>Children</h2>
<p>Websprout is not directed to children, and we do not knowingly collect personal information from anyone under 16. If you believe a child has provided us information, contact us and we will delete it.</p>
<h2>Your data and your rights</h2>
<p>You are in control of your data. From <strong>Settings</strong> in the Websprout studio you can, at any time:</p>
<ul>
<li><strong>Download my data</strong> — export everything we hold about you (your account, sites, products, reviews, leads and invoices) as a single JSON file. This covers your right to access and to data portability.</li>
<li><strong>Delete account and all data</strong> — permanently erase your account and every site, draft, product, review, lead and invoice tied to it, and sign you out. This covers your right to erasure (the right to be forgotten / the right to delete).</li>
</ul>
<p>Depending on where you live, laws such as the EU and UK GDPR and the California CCPA give you these rights to access, export and delete your personal data. The tools above let you exercise them yourself, instantly — or you can email us and we will help.</p>
<p>Two things to note. First, payment records held by our payment processor (Stripe) may be kept as required by law even after you delete your account, so we can meet tax and accounting obligations; this data lives with Stripe, not in your Websprout account. Second, if you connected a custom domain, that domain mapping may need to be removed separately — email us and we will clear it for you.</p>
<h2>Contact</h2>
<p>Questions? Email us at <a href="mailto:support@websprout.app">support@websprout.app</a></p>
</div>
</body>
</html>`;


const ACCESSIBILITY_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Accessibility — Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f7f0;color:#0f1a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;padding:4rem 2rem;line-height:1.7}
.wrap{max-width:700px;margin:0 auto}
h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}
.meta{color:#4d5c4a;margin-bottom:3rem;font-size:14px}
h2{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem}
p{margin-bottom:1rem;color:#2e3d2b}
ul{margin:.2rem 0 1rem 1.25rem}li{margin-bottom:.4rem;color:#2e3d2b}
a{color:#2d7a3a}
.back{display:inline-block;margin-bottom:2rem;color:#2d7a3a;text-decoration:none;font-weight:600}
:focus-visible{outline:3px solid #2d7a3a;outline-offset:2px}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Accessibility</h1>
<p class="meta">Last updated: November 2026</p>
<p>We want Websprout to be usable by as many people as possible, including people who use screen readers, keyboard navigation, or other assistive technology. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA, and we are working toward the newer 2.2 criteria.</p>
<h2>What we have done</h2>
<p>Across the Websprout app we use semantic structure and landmarks, a skip-to-content link, labels on form fields, clearly visible keyboard focus indicators, and text that meets AA color-contrast guidance. We review these as the product changes.</p>
<h2>Sites you build</h2>
<p>We also build accessibility into the websites Websprout generates for you: semantic landmarks, a logical heading order, descriptive alternative text for images, labeled form fields, and readable color contrast. Because you can edit your site freely, we encourage you to keep these in mind as you change content — for example, writing meaningful alt text and keeping strong contrast.</p>
<h2>Ongoing work</h2>
<p>Accessibility is an ongoing effort, not a one-time task. Some areas may not yet fully conform, and we are continuing to improve. This statement reflects our current status and good-faith commitment; it is not a certification of compliance.</p>
<h2>Tell us about a barrier</h2>
<p>If you run into anything on Websprout that is hard to use with assistive technology, please tell us — we take accessibility issues seriously and will work to fix them. Email <a href="mailto:support@websprout.app">support@websprout.app</a> and describe the problem and the page or feature where you found it.</p>
</div>
</body>
</html>`;
const DEPLOY_GUIDE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>How to Deploy Your Site — Websprout</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff;color:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
nav{height:56px;border-bottom:1px solid #e8f0e5;display:flex;align-items:center;padding:0 5vw;justify-content:space-between}
.logo{font-size:17px;font-weight:800;color:#0f1a0d;text-decoration:none;display:flex;align-items:center;gap:8px}
.logo-mark{width:28px;height:28px;background:#2d7a3a;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{font-style:normal;color:#2d7a3a}
.back-btn{font-size:14px;color:#2d7a3a;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:6px}
.back-btn:hover{text-decoration:underline}
.hero{background:#f8faf8;border-bottom:1px solid #e8f0e5;padding:60px 5vw}
.hero-inner{max-width:760px;margin:0 auto;text-align:center}
.eyebrow{font-size:12px;font-weight:700;color:#2d7a3a;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
h1{font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#0f1a0d;letter-spacing:-2px;margin-bottom:14px}
.lead{font-size:18px;color:#555;max-width:560px;margin:0 auto}
.wrap{max-width:900px;margin:0 auto;padding:60px 5vw}

/* COMPARISON TABLE */
.compare-title{font-size:1.6rem;font-weight:800;color:#0f1a0d;letter-spacing:-1px;margin-bottom:8px}
.compare-sub{color:#666;font-size:15px;margin-bottom:32px}
.cmp-table{width:100%;border-collapse:separate;border-spacing:0;border:1.5px solid #e8f0e5;border-radius:16px;overflow:hidden;margin-bottom:60px}
.cmp-table th{padding:16px 20px;font-size:13px;font-weight:700;text-align:left;background:#f8faf8;color:#555;text-transform:uppercase;letter-spacing:.8px;border-bottom:1.5px solid #e8f0e5}
.cmp-table td{padding:14px 20px;font-size:14px;border-bottom:1px solid #f0f5f0;vertical-align:top}
.cmp-table tr:last-child td{border-bottom:none}
.cmp-table td:first-child{color:#444;font-weight:500;width:30%}
.netlify-col{background:#fff5f7}
.cf-col{background:#fff8f0}
.badge-n{display:inline-flex;align-items:center;gap:5px;background:#00c7b7;color:#fff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px}
.badge-cf{display:inline-flex;align-items:center;gap:5px;background:#f6821f;color:#fff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px}
.good{color:#2d7a3a;font-weight:600}
.ok{color:#555}
.cmp-table th:nth-child(2){color:#00a89c}
.cmp-table th:nth-child(3){color:#d36b00}
.rec-banner{background:#f0faf2;border:1.5px solid #c8e8c4;border-radius:12px;padding:16px 20px;margin-bottom:40px;display:flex;align-items:center;gap:12px;font-size:14px;color:#1f5c2a}
.rec-icon{font-size:24px;flex-shrink:0}

/* STEP GUIDES */
.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:60px}
.guide-card{border:1.5px solid #e8f0e5;border-radius:20px;overflow:hidden}
.guide-header{padding:24px 24px 20px;border-bottom:1px solid #e8f0e5}
.guide-header h2{font-size:20px;font-weight:800;color:#0f1a0d;margin-bottom:6px;letter-spacing:-.5px}
.guide-header p{font-size:14px;color:#666}
.guide-logo{font-size:28px;margin-bottom:10px}
.guide-body{padding:24px}
.step-list{list-style:none;display:flex;flex-direction:column;gap:18px}
.step-item{display:flex;gap:14px;align-items:flex-start}
.step-num{width:26px;height:26px;border-radius:8px;background:#f0faf2;border:1.5px solid #c8e8c4;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#2d7a3a;flex-shrink:0;margin-top:1px}
.step-content{font-size:14px;color:#333;line-height:1.6}
.step-content strong{color:#0f1a0d;display:block;margin-bottom:2px;font-weight:700}
.step-content code{background:#f5f5f5;border-radius:4px;padding:1px 6px;font-size:12px;font-family:monospace;color:#c41d7f}
.guide-cta{margin-top:20px;display:block;background:#0f1a0d;color:#fff;text-align:center;padding:12px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:all .15s}
.guide-cta.netlify{background:#00c7b7}
.guide-cta.cf{background:#f6821f}
.guide-cta:hover{opacity:.9;transform:translateY(-1px)}

/* FAQ */
.faq-title{font-size:1.4rem;font-weight:800;color:#0f1a0d;letter-spacing:-.8px;margin-bottom:24px}
.faq-list{display:flex;flex-direction:column;gap:12px}
.faq-item{border:1px solid #e8f0e5;border-radius:12px;overflow:hidden}
.faq-q{padding:16px 20px;font-size:14px;font-weight:600;color:#0f1a0d;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}
.faq-q:hover{background:#f8faf8}
.faq-icon{font-size:18px;color:#2d7a3a;transition:transform .2s;flex-shrink:0}
.faq-a{padding:0 20px;max-height:0;overflow:hidden;transition:all .25s ease;font-size:14px;color:#555;line-height:1.7}
.faq-item.open .faq-a{padding:0 20px 16px;max-height:300px}
.faq-item.open .faq-icon{transform:rotate(45deg)}

footer{border-top:1px solid #e8f0e5;padding:28px 5vw;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#f8faf8}
.foot-logo{font-size:15px;font-weight:800;color:#0f1a0d;text-decoration:none;display:flex;align-items:center;gap:7px}
.foot-logo em{font-style:normal;color:#2d7a3a}
.foot-links{display:flex;gap:20px}
.foot-links a{font-size:13px;color:#888;text-decoration:none}
.foot-links a:hover{color:#0f1a0d}

@media(max-width:700px){
  .guide-grid,.cmp-table{display:block}
  .cmp-table{overflow-x:auto;display:block}
}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo"><div class="logo-mark">🌱</div><span class="lw">Web<em>sprout</em></span></a>
  <a href="/" class="back-btn">← Back to Websprout</a>
</nav>

<div class="hero">
  <div class="hero-inner">
    <div class="eyebrow">Deploy Guide</div>
    <h1>Get your site live in minutes</h1>
    <p class="lead">You built your site — now let's get it online. There are three ways to do it, easiest first. Most people never need to look past Option 1.</p>
  </div>
</div>

<div class="wrap">
  <div class="rec-banner"><div class="rec-icon">💡</div><div><strong>New here? Use Option 1.</strong> Publishing on Websprout is free and takes one click — no other accounts, no tokens, no files. The other options are only if you want your own domain or want to host the files yourself.</div></div>

  <div class="guide-card" style="margin-bottom:28px">
    <div class="guide-header">
      <div class="guide-logo">🌐</div>
      <h2>Option 1 — Publish free on Websprout (easiest)</h2>
      <p>The simplest way to go live. Your site gets a free address like <code>yourname.websprout.app</code>, with HTTPS, in one click. No second account, nothing to download.</p>
    </div>
    <div class="guide-body">
      <ol class="step-list">
        <li class="step-item"><div class="step-num">1</div><div class="step-content"><strong>Build your site</strong>Describe your business on the Websprout home page and let it generate the site. Tweak anything with the chat until it looks right.</div></li>
        <li class="step-item"><div class="step-num">2</div><div class="step-content"><strong>Click the Publish button</strong>In the studio toolbar at the top, click <strong>🌐 Publish</strong>.</div></li>
        <li class="step-item"><div class="step-num">3</div><div class="step-content"><strong>Choose your free address</strong>Type the name you want — say <code>joes-tacos</code> — and you will get <code>joes-tacos.websprout.app</code>. If it is taken, try another.</div></li>
        <li class="step-item"><div class="step-num">4</div><div class="step-content"><strong>Hit Publish — you are live</strong>Your site is online instantly at that address with free HTTPS. Share the link right away. A small "Made with Websprout" badge sits in the corner.</div></li>
        <li class="step-item"><div class="step-num">5</div><div class="step-content"><strong>(Optional) Remove the badge</strong>Go Pro ($10/month) to remove the badge, connect your own domain, and unlock downloading the code. Cancel anytime.</div></li>
      </ol>
      <div style="margin-top:18px;font-size:13.5px;color:#666">To update later, edit in Websprout and click Publish again — the same address refreshes instantly.</div>
    </div>
  </div>

  <div class="guide-card" style="margin-bottom:28px">
    <div class="guide-header">
      <div class="guide-logo">🔗</div>
      <h2>Option 2 — Use your own domain (Pro)</h2>
      <p>Want <code>yourbusiness.com</code> instead of a websprout.app address? Point any domain you own at your published site. This is a Pro feature.</p>
    </div>
    <div class="guide-body">
      <ol class="step-list">
        <li class="step-item"><div class="step-num">1</div><div class="step-content"><strong>Publish your site first</strong>Do Option 1 so your site is live at a websprout.app address. Your custom domain will point at that.</div></li>
        <li class="step-item"><div class="step-num">2</div><div class="step-content"><strong>Get a domain (if you do not have one)</strong>Buy one from a registrar such as Namecheap, Cloudflare, or GoDaddy — usually about $10–15 a year. Already own one? Skip ahead.</div></li>
        <li class="step-item"><div class="step-num">3</div><div class="step-content"><strong>Enter your domain in Websprout</strong>Go Pro, open the <strong>Custom domain</strong> box in Websprout, and type your domain (for example <code>yourbusiness.com</code>). Websprout shows you the exact record to add.</div></li>
        <li class="step-item"><div class="step-num">4</div><div class="step-content"><strong>Add one DNS record at your registrar</strong>Log in where you bought the domain, find its <strong>DNS settings</strong>, and add a <strong>CNAME</strong> record pointing to <code>yourslug.websprout.app</code> (Websprout shows your exact target). Save it.</div></li>
        <li class="step-item"><div class="step-num">5</div><div class="step-content"><strong>Wait a little — then you are live</strong>DNS changes take a few minutes to a few hours to spread. Once they do, your site loads on your own domain, with HTTPS set up automatically.</div></li>
      </ol>
      <div style="margin-top:18px;font-size:13.5px;color:#666">Cannot find your DNS settings? Search "[your registrar] add CNAME record" — every registrar has a short help page with screenshots.</div>
    </div>
  </div>

  <div class="compare-title">Option 3 — Host the code yourself (advanced)</div>
  <div class="compare-sub">Prefer to put the downloaded HTML on your own free hosting? Go Pro to download your code, then pick one of these. Both are free forever with HTTPS and custom domains — here is how they compare.</div>
  <table class="cmp-table">
    <thead>
      <tr>
        <th>Feature</th>
        <th><span class="badge-n">● Netlify</span></th>
        <th><span class="badge-cf">● Cloudflare Pages</span></th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Setup time</td><td class="netlify-col"><span class="good">~2 minutes (drag & drop)</span></td><td class="cf-col"><span class="ok">~5 minutes</span></td></tr>
      <tr><td>Free bandwidth</td><td class="netlify-col"><span class="ok">100 GB/month</span></td><td class="cf-col"><span class="good">Unlimited</span></td></tr>
      <tr><td>Free sites</td><td class="netlify-col"><span class="ok">500 sites</span></td><td class="cf-col"><span class="good">Unlimited</span></td></tr>
      <tr><td>Global CDN speed</td><td class="netlify-col"><span class="ok">Fast (Fastly CDN)</span></td><td class="cf-col"><span class="good">Very fast (300+ locations)</span></td></tr>
      <tr><td>Custom domain</td><td class="netlify-col"><span class="good">Free & easy</span></td><td class="cf-col"><span class="good">Free & easy</span></td></tr>
      <tr><td>HTTPS / SSL</td><td class="netlify-col"><span class="good">Automatic</span></td><td class="cf-col"><span class="good">Automatic</span></td></tr>
      <tr><td>Free subdomain</td><td class="netlify-col"><span class="ok">yoursite.netlify.app</span></td><td class="cf-col"><span class="ok">yoursite.pages.dev</span></td></tr>
      <tr><td>Best for</td><td class="netlify-col"><span class="ok">Beginners, quick deploys</span></td><td class="cf-col"><span class="ok">High-traffic, global sites</span></td></tr>
      <tr><td>One-click deploy</td><td class="netlify-col"><span class="good">✓ Built into Websprout</span></td><td class="cf-col"><span class="ok">Manual (5 easy steps)</span></td></tr>
    </tbody>
  </table>

  <div class="guide-grid">
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-logo">🟢</div>
        <h2>Deploy to Netlify</h2>
        <p>The fastest way to get your site live. One click from inside Websprout — no setup required.</p>
      </div>
      <div class="guide-body">
        <ol class="step-list">
          <li class="step-item">
            <div class="step-num">1</div>
            <div class="step-content"><strong>Generate &amp; unlock your site</strong>Build your site on Websprout and go Pro ($10/month) to unlock downloading the source code.</div>
          </li>
          <li class="step-item">
            <div class="step-num">2</div>
            <div class="step-content"><strong>Get your Netlify access token</strong>A one-time key that lets Websprout deploy for you. In Netlify: click your avatar (top right) → <strong>User settings</strong> → <strong>Applications</strong> → scroll to <strong>Personal access tokens</strong> → <strong>New access token</strong> → name it "Websprout" → <strong>Generate</strong> → copy it. Then in the studio open <strong>Deploy → Netlify</strong> and paste it. It is saved on your device only — we never see it.</div>
          </li>
          <li class="step-item">
            <div class="step-num">3</div>
            <div class="step-content"><strong>Get your live URL</strong>In about 10 seconds, your site is live at a <code>*.netlify.app</code> URL. Share it immediately.</div>
          </li>
          <li class="step-item">
            <div class="step-num">4</div>
            <div class="step-content"><strong>Add a custom domain (optional)</strong>In your Netlify dashboard go to Site Settings → Domain Management → Add custom domain. Free with any domain registrar.</div>
          </li>
        </ol>
        <div style="margin-top:16px;font-size:13px;color:#666"><strong>No token, even simpler:</strong> click ⬇ Download in Websprout, then go to <code>app.netlify.com/drop</code> and drag your HTML file onto the page — instantly live.</div>
        <a href="https://app.netlify.com/signup" target="_blank" class="guide-cta netlify">Create free Netlify account →</a>
      </div>
    </div>
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-logo">🟠</div>
        <h2>Deploy to Cloudflare Pages</h2>
        <p>Best for high-traffic sites. Unlimited bandwidth and Cloudflare's blazing-fast global network.</p>
      </div>
      <div class="guide-body">
        <ol class="step-list">
          <li class="step-item">
            <div class="step-num">1</div>
            <div class="step-content"><strong>Download your site</strong>Unlock and download your HTML file from Websprout. It will save as <code>websprout-site.html</code>.</div>
          </li>
          <li class="step-item">
            <div class="step-num">2</div>
            <div class="step-content"><strong>Rename the file</strong>Rename <code>websprout-site.html</code> to <code>index.html</code> — Cloudflare requires this exact name.</div>
          </li>
          <li class="step-item">
            <div class="step-num">3</div>
            <div class="step-content"><strong>Go to Cloudflare Pages</strong>Visit <code>pages.cloudflare.com</code>, sign up free, and click Create a project → Direct Upload.</div>
          </li>
          <li class="step-item">
            <div class="step-num">4</div>
            <div class="step-content"><strong>Upload your file</strong>Name your project, drag in your <code>index.html</code> file, and click Deploy. Done in 60 seconds.</div>
          </li>
          <li class="step-item">
            <div class="step-num">5</div>
            <div class="step-content"><strong>Your site is live</strong>Cloudflare gives you a <code>*.pages.dev</code> URL immediately. Add a custom domain anytime for free.</div>
          </li>
        </ol>
        <a href="https://pages.cloudflare.com" target="_blank" class="guide-cta cf">Go to Cloudflare Pages →</a>
      </div>
    </div>
  </div>

  <div class="faq-title">Frequently asked questions</div>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">Which option should I pick? <span class="faq-icon">+</span></div>
      <div class="faq-a">If you just want your site online, use Option 1 — publishing free on Websprout is the fastest and needs nothing else. Use Option 2 if you own a domain like yourbusiness.com and want to use it. Only use Option 3 if you specifically want the files hosted on your own Netlify or Cloudflare account.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do I have to pay to put my site online? <span class="faq-icon">+</span></div>
      <div class="faq-a">No. Publishing live on Websprout is free, with a small badge. Pro removes the badge, connects your own domain, and lets you download and self-host the code. Pro starts with a 7-day free trial, then $10/month &mdash; cancel anytime.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do I need to pay for hosting? <span class="faq-icon">+</span></div>
      <div class="faq-a">No. Both Netlify and Cloudflare Pages have permanently free tiers that are more than enough for most websites. Netlify gives you 100GB of bandwidth per month for free, and Cloudflare Pages offers unlimited bandwidth.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What is a Personal Access Token? <span class="faq-icon">+</span></div>
      <div class="faq-a">A Personal Access Token is a secret key that lets Websprout talk to Netlify on your behalf to deploy your site. You get it from your Netlify account under User Settings → Applications → Personal Access Tokens. It stays on your device only — we never store it on our servers.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Can I update my site after deploying? <span class="faq-icon">+</span></div>
      <div class="faq-a">Yes. Use the visual editor in Websprout to make changes, re-download your site, and re-deploy. On Netlify, you can drag and drop a new file onto your existing site to update it. On Cloudflare Pages, you can upload a new version through the dashboard.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How do I connect a custom domain? <span class="faq-icon">+</span></div>
      <div class="faq-a">Both platforms make this easy and free. On Netlify: Site Settings → Domain Management → Add custom domain, then follow the DNS instructions from your domain registrar. On Cloudflare Pages: Custom Domains → Add a domain. If your domain is already on Cloudflare, it's automatic.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is my site secure (HTTPS)? <span class="faq-icon">+</span></div>
      <div class="faq-a">Yes, automatically. Both Netlify and Cloudflare Pages issue free SSL certificates via Let's Encrypt the moment your site is deployed. Your site will always serve over HTTPS with no extra configuration.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Which should I choose? <span class="faq-icon">+</span></div>
      <div class="faq-a">For most people, Netlify is easier and faster to get started. If you expect high traffic or already use Cloudflare for a domain, Cloudflare Pages is the better long-term choice because of unlimited bandwidth and faster global delivery.</div>
    </div>
  </div>
</div>

<footer>
  <a href="/" class="foot-logo"><div class="logo-mark" style="width:24px;height:24px;font-size:12px">🌱</div><span class="lw">Web<em>sprout</em></span></a>
  <div class="foot-links">
    <a href="/showcase">Showcase</a>
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a>
    <a href="mailto:support@websprout.app">Contact</a>
  </div>
</footer>

<script>
document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var item=q.parentElement;
    var wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
    if(!wasOpen)item.classList.add('open');
  });
});
</script>
</body>
</html>`;

