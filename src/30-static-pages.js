const SUCCESS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Free Trial Started — Websprout</title>
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
  <h1>Your free trial has started</h1>
  <p>Pro features are on: no Websprout badge, your own custom domain, code download and more. Your trial lasts 7 days. After that, Pro renews automatically at $10/month until you cancel. You can cancel anytime in Settings &gt; Manage billing. A confirmation email is on its way.</p>
  <a href="/?sub=success" class="btn">Back to my site →</a>
  <p class="sub">Taking you back to your site in a few seconds.</p>
</div>
<script>
  // Long enough to read the trial terms above; the button goes back right away.
  setTimeout(function(){ window.location.href='/?sub=success'; }, 15000);
</script>
</body>
</html>`;

// TODO(owner): DMCA safe harbor (17 USC 512(c)(2)) needs a designated agent registered with the US Copyright Office
// (dmca.copyright.gov) and that agent's contact details published in Section 16 below. Not done yet.
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
<p>Websprout is a website builder. You can describe a business and automatically generate, preview, edit, and publish a website. Building, editing and publishing a site is free. A paid Pro subscription unlocks removing the Websprout badge, connecting a custom domain, downloading your site's source code, and store features. Some capabilities &mdash; including live product management and payment checkout &mdash; are hosted online services that run on our servers, not files you download (see Sections 7, 8 and 9).</p>

<h2>2. Who can use Websprout, and your account</h2>
<p>You must be at least 18 years old to use Websprout. If you use Websprout for a business, you confirm that you are allowed to act for that business.</p>
<p>You are responsible for all activity under your account and for keeping your sign-in access secure. You must give accurate information. You may not impersonate anyone or build a site for a business you are not authorized to represent.</p>

<h2>3. Pro subscription, free trial and cancelling</h2>
<p>The free plan costs nothing. Pro costs <strong>$10 per month</strong> (plus any tax that applies) and starts with a <strong>7-day free trial</strong>. Payments are handled by Stripe.</p>
<ul>
<li><strong>Free trial.</strong> To start the trial you add a payment method. You are not charged during the 7 days.</li>
<li><strong>Automatic renewal.</strong> If you do not cancel before the trial ends, your first charge of $10 is made when the trial ends. After that, Pro <strong>renews automatically every month at $10/month until you cancel</strong>. Each month is charged in advance to your payment method.</li>
<li><strong>How to cancel.</strong> You can cancel online at any time. In the Websprout studio, open <strong>Settings</strong> and choose <strong>"Manage billing &amp; cancel plan"</strong>. This opens Stripe's secure billing page, where you can cancel, see invoices and update your card. You can also email <a href="mailto:support@websprout.app">support@websprout.app</a> and we will cancel for you.</li>
<li><strong>What happens when you cancel.</strong> No more charges are made. If you cancel during the trial, you are not charged and Pro ends when the trial ends. If you cancel after a paid month has started, Pro stays on until the end of that month. When Pro ends, Pro features stop: the Websprout badge comes back, your custom domain stops showing your site, and source-code download and store checkout turn off. Your site stays live on the free plan at its websprout.app address.</li>
<li><strong>Refunds.</strong> Fees are non-refundable except where required by law. If you think you were charged by mistake, email us and we will review it.</li>
<li><strong>Price changes.</strong> If we change the Pro price, we will tell you before the new price applies to your next billing period. You can cancel before then.</li>
</ul>

<h2>4. Your content and ownership of downloaded code</h2>
<p>You own the content you provide and the website source code you download while you have an active paid subscription. Downloaded code is the static files of your site (the HTML, CSS, JavaScript and layout we generated for you) and is yours to host and use for any lawful purpose, personal or commercial.</p>
<p>Downloaded code does <strong>not</strong> include Websprout's hosted services. In particular, the live product catalog, the payment checkout, lead-capture form processing, and similar server-side features are provided by us as an ongoing online service and are not part of the files you download.</p>
<p><strong>Permission to run and show your site.</strong> You give Websprout a non-exclusive, worldwide, royalty-free license to host, store, copy, display and adapt your content as needed to run the Service. You also allow us to show your published site (for example its name, link and screenshots) in our showcase, examples and marketing. If you do not want your site shown, email <a href="mailto:support@websprout.app">support@websprout.app</a> and we will remove it from the showcase and stop using it in new marketing.</p>

<h2>5. Your responsibilities as a site owner</h2>
<p>You are responsible for everything on your site, including text and images Websprout generated for you that you choose to publish. Please review your site before you publish it. In particular:</p>
<ul>
<li><strong>Claims.</strong> Everything you say about your business must be true and up to date. This includes licenses, insurance, certifications, awards, guarantees, prices, hours and service areas.</li>
<li><strong>Reviews and testimonials.</strong> Reviews and testimonials on your site must be genuine and from real customers. Do not post fake reviews, write reviews yourself, or edit reviews to change their meaning. Do not hide that a review was paid for or rewarded.</li>
<li><strong>Laws for your business.</strong> You are responsible for following the laws that apply to your business and your site, such as advertising, consumer protection, licensing and privacy laws.</li>
<li><strong>Your visitors' data.</strong> When visitors send messages through your site's contact form, Websprout processes them on your behalf so we can deliver them to you. You are responsible for your visitors' data and how you use it, and for having any privacy notice your business needs.</li>
</ul>

<h2>6. Acceptable use</h2>
<p>You may not use Websprout to create, publish or share content that:</p>
<ul>
<li>is illegal, or helps someone break the law;</li>
<li>is sexual, pornographic or otherwise adult content;</li>
<li>is obscene, profane or vulgar;</li>
<li>promotes hate, harassment or discrimination against people based on who they are;</li>
<li>threatens, promotes or glorifies violence or self-harm;</li>
<li>sells or promotes illegal drugs, weapons, or other illegal or regulated goods without the required authorization;</li>
<li>is a scam, phishing or fraud, or impersonates another person, business or brand;</li>
<li>infringes someone else's copyright, trademark, privacy or other rights;</li>
<li>contains malware or tries to harm visitors, their devices, or Websprout.</li>
</ul>

<h2>7. Content checks and moderation</h2>
<p>Websprout checks content automatically. Every time a site is published or a share link is created, its text and the photos you uploaded are checked by a word list and by an automated review using Google's Gemini AI. People at Websprout may also review sites.</p>
<p>We may refuse to publish, take down, or hide any site, and suspend or block any account, at our discretion &mdash; for example when we believe content breaks these Terms, could harm people, or puts the Service at risk. Automated checks can make mistakes. If you think we got it wrong, email <a href="mailto:support@websprout.app">support@websprout.app</a> and we will take another look.</p>

<h2>8. Store, products and the checkout service</h2>
<p>Store features let you list products and accept payments. Payment checkout is a hosted service: when a visitor clicks a buy button, a request is made to Websprout's servers, which create the payment session. This service is available only while you maintain an active, paid subscription. If your subscription lapses or is cancelled, the checkout service stops working &mdash; including on any self-hosted or downloaded copy of your site &mdash; and buy buttons will no longer process payments. A downloaded store page works as a product catalog; to take payments you must use the active hosted checkout.</p>
<p>You may not copy, reverse-engineer, reproduce, or build a substitute for the Websprout checkout or other hosted services in order to avoid subscription fees, applicable transaction fees, or these Terms. You are solely responsible for the products you sell, their descriptions and prices, fulfilment, refunds, taxes, and compliance with all laws that apply to your sales. Payments are processed by Stripe and are subject to Stripe's terms; we are not the seller of your goods and are not a party to transactions between you and your customers.</p>

<h2>9. Fees on sales</h2>
<p>Where we charge a per-sale or transaction fee for use of the checkout service, the applicable fee is disclosed to you before you enable payments and is deducted automatically. Payment-processor fees charged by Stripe are separate and set by Stripe.</p>

<h2>10. Reporting abuse</h2>
<p>To report a site built with Websprout that breaks these Terms (for example a scam, harmful content or a fake business), email <a href="mailto:abuse@websprout.app">abuse@websprout.app</a>, or <a href="mailto:support@websprout.app">support@websprout.app</a>. Please include the site's address and what is wrong. For copyright complaints, see Section 16.</p>

<h2>11. Service availability and "as is"</h2>
<p>The Service, including automatically generated output, is provided "as is" and "as available", without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy, or uninterrupted availability. Generated output may contain errors; you are responsible for reviewing your site before you publish or sell.</p>

<h2>12. Limitation of liability</h2>
<p>To the maximum extent permitted by law, Websprout will not be liable for any indirect, incidental, special, or consequential damages, or for lost profits, revenue, data, or goodwill, arising from your use of the Service. Our total liability for any claim relating to the Service will not exceed the amount you paid us in the three months before the claim.</p>

<h2>13. Termination</h2>
<p>You may stop using the Service and cancel at any time. We may suspend or terminate access for violations of these Terms, as described in Section 7, or to comply with law. Provisions that by their nature should survive termination (including ownership, fees owed, disclaimers, indemnification, and limitation of liability) will survive.</p>

<h2>14. Changes to these Terms</h2>
<p>We may update these Terms from time to time. Material changes are reflected by updating the date above; continued use after changes take effect constitutes acceptance.</p>

<h2>15. Governing law</h2>
<p>These Terms are governed by the laws of the State of Georgia, United States, without regard to conflict-of-law rules, and you submit to the exclusive jurisdiction of the state and federal courts located in Georgia, except where mandatory consumer-protection law grants you rights where you live.</p>

<h2>16. Copyright and takedown (DMCA)</h2>
<p>We respect intellectual property rights and expect you to do the same. You must not use Websprout to build or publish content that infringes another person's copyright, trademark, or other rights.</p>
<p><strong>Notice of infringement.</strong> If you believe content published through Websprout infringes a copyright you own or represent, send a notice to <a href="mailto:support@websprout.app">support@websprout.app</a> that includes: (a) your name, address, phone number and email address; (b) identification of the work you say is infringed; (c) the URL or location of the material you want removed; (d) a statement that you have a good-faith belief the use is not authorized by the rights holder, its agent, or the law; (e) a statement that the information in your notice is accurate and, under penalty of perjury, that you are the rights holder or authorized to act on their behalf; and (f) your physical or electronic signature.</p>
<p>We will review valid notices and may remove or disable access to the material. We will tell the site owner when we do.</p>
<p><strong>Counter-notice.</strong> If you believe your material was removed by mistake, you may send a counter-notice to the same address that includes: (a) your physical or electronic signature; (b) identification of the material that was removed and where it appeared before it was removed; (c) a statement, under penalty of perjury, that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification; and (d) your name, address and phone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or, if your address is outside the United States, any judicial district in which Websprout may be found), and that you will accept service of process from the person who sent the original notice or their agent. If we receive a valid counter-notice, we will send a copy to the person who sent the original notice. We may restore the material in 10 to 14 business days unless that person tells us they have filed a court action to stop the infringement.</p>
<p><strong>Repeat infringers.</strong> We will terminate, in appropriate circumstances, the accounts of users who are repeat infringers.</p>

<h2>17. Indemnification</h2>
<p>You agree to indemnify and hold harmless Websprout and the people who operate it from any claims, damages, losses, liabilities, and reasonable costs (including legal fees) arising from: (a) the content you create, publish, or sell through the Service; (b) your products, their fulfilment, and your transactions with your customers; (c) your use of the Service in violation of these Terms or any law; or (d) your infringement of another party's rights. We will notify you of any such claim and may take part in its defense; you may not settle a claim in a way that creates obligations for us without our consent.</p>

<h2>18. Contact</h2>
<p>Questions about these Terms: <a href="mailto:support@websprout.app">support@websprout.app</a>. To report abuse: <a href="mailto:abuse@websprout.app">abuse@websprout.app</a>.</p>
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
<h2>Who we are</h2>
<p>Websprout is a website builder for local businesses, run from the United States at websprout.app. This policy explains what personal information we collect, why, who we share it with, how long we keep it, and the choices you have. It covers people who use Websprout (business owners) and people who visit websprout.app. If you have questions, email <a href="mailto:support@websprout.app">support@websprout.app</a>.</p>
<h2>Notice at collection: a summary</h2>
<p><strong>What we collect.</strong></p>
<ul>
<li><strong>Identifiers:</strong> your email address, your name if you give it, a payment reference from Stripe, a one-way hashed form of your IP address, and a daily visitor code that changes every day.</li>
<li><strong>Commercial information:</strong> your plan, trial and subscription status, and records of store sales and invoices you make through Websprout.</li>
<li><strong>Internet activity:</strong> pages you visit on websprout.app, key actions (such as signing in, generating, saving and publishing a site), the referring link or campaign, and your browser and device type.</li>
<li><strong>Approximate location:</strong> country, and sometimes region and city, worked out from your IP address. We do not collect precise location.</li>
<li><strong>Content you give us:</strong> your business details, the text and photos on your sites, products, reviews, and messages you send to support.</li>
<li><strong>Data from your website visitors:</strong> messages and contact details that visitors send through your site's contact form, and reviews they leave (see &ldquo;Data from your website visitors&rdquo;).</li>
</ul>
<p><strong>Where it comes from.</strong> From you; from your browser or device when you use Websprout; from visitors to your published site; from Stripe when you pay; and, if you choose, from your public Google business listing.</p>
<p><strong>Why we use it.</strong> To provide the service (accounts, building, saving, publishing and hosting your sites, sending you leads); to take payments; to answer support requests; to check content and keep the service safe and free of abuse; to understand and improve how Websprout is used; and, when ad measurement is on, to measure whether our ads work (see &ldquo;Advertising&rdquo;).</p>
<p><strong>Who we disclose it to.</strong> Only the service providers listed under &ldquo;Service providers we use&rdquo; (Cloudflare, Stripe, Resend, Google, Unsplash and, when ad measurement is on, Google and Meta ad tags), and authorities when the law requires it. We do not sell personal information. We do not use sensitive personal information to infer things about you.</p>
<h2>What we collect</h2>
<p>When you sign in, we store your email address and basic account details (your plan, and a payment reference if you upgrade). We use Stripe for payments — we never see or store your card details. When you build with Websprout, we store the sites you create on our servers so your work is saved to your account and your published sites stay live: this includes your drafts and published pages, any products you add, customer reviews, the contact-form messages (leads) your visitors send you, and basic usage counts.</p>
<p>To operate, secure and improve the service, we also keep a log of visits and key actions (such as signing in, generating a site, and publishing). Entries can include an approximate location derived from your IP address, a one-way hashed form of your IP address or a daily visitor code (we do not store your raw IP address in this log), your browser and device type, and the referring link that brought you to the site. We use this for our own product analytics, security and understanding how Websprout is used. We do not sell it. See &ldquo;Advertising&rdquo; below.</p>
<h2>Analytics</h2>
<p>Websprout measures how the site is used without cookies or third-party trackers: we record pages visited, the referring site or campaign, country and device type, counted with an anonymous identifier that changes every day and cannot be traced back to your IP address. If you are signed in we link your editing and publishing activity to your account; raw analytics events are deleted after about 13 months.</p>
<h2>What we don't collect</h2>
<p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>
<h2>Advertising</h2>
<p>We may advertise Websprout on Google and Meta (Facebook and Instagram). To see whether those ads work, we can turn on ad measurement on websprout.app. When it is on, websprout.app loads Google Ads / Google Analytics 4 tags and the Meta Pixel. These tags may set cookies and tell Google or Meta when someone who saw an ad visits, publishes a site or starts a Pro trial.</p>
<ul>
<li>These tags run only on websprout.app. They never run on the websites our customers publish.</li>
<li>They load only for visitors in the United States.</li>
<li>They do not load if your browser sends a <strong>Global Privacy Control</strong> (GPC) signal, or if you opted out on our <a href="/privacy-choices">Your privacy choices</a> page.</li>
</ul>
<p>We do not sell personal information. When ad measurement is on, using Google and Meta ad tags may count as &ldquo;sharing&rdquo; personal information for cross-context behavioral advertising under California law. You can opt out at <a href="/privacy-choices">/privacy-choices</a>, and we honor Global Privacy Control.</p>
<h2>How your site is generated</h2>
<p>When you describe your business, Websprout builds your site on our own servers from our built-in templates. To draft the site&rsquo;s wording, the business details you enter in setup (the business name, type, city and towns you serve, your &ldquo;what makes you different&rdquo; answer, the year you started, whether you are licensed or insured, and any tagline, about text or services you typed) are sent to Google&rsquo;s Gemini API. Reviews from a linked Google listing are never sent; they are shown live from Google Maps. Your account email and your visitors&rsquo; data are never sent for drafting. If the AI draft is unavailable or does not pass our checks, the template wording is used instead. We may use the type of business you select to fetch relevant royalty-free stock photos (see "Service providers we use").</p>
<h2>Content checks</h2>
<p>To keep Websprout free of abuse, every site is checked automatically each time it is published or a share link is created. We check the site&rsquo;s text against a word list, and we send the site&rsquo;s text and the photos you uploaded to Google&rsquo;s Gemini API for an automated review. Your account email is not sent. Based on the result, a site may be refused, taken down or blocked (see our <a href="/terms">Terms</a>).</p>
<h2>Generated sites</h2>
<p>While you are building, a working copy of your site is kept in your browser. Once you sign in or publish, your site (drafts and published pages) is also stored on our servers so it stays saved to your account and stays live on the web. You can remove any site at any time, or delete everything at once from your account settings (see below).</p>
<h2>Service providers we use</h2>
<p>We rely on a small number of trusted providers to run the Service. Each processes data only to provide its part of the Service:</p>
<ul>
<li><strong>Cloudflare</strong> — hosts Websprout and securely stores your account and the sites you build. If a site owner turns it on, Cloudflare Turnstile checks that contact-form messages come from a person, not a bot.</li>
<li><strong>Unsplash</strong> — supplies royalty-free stock photos. When a site is generated, we send Unsplash a short search made from the business type and up to two of its service names (for example, &ldquo;vegan bakery sourdough&rdquo;), never your personal details, to find relevant images.</li>
<li><strong>Google (Places)</strong> — if you choose to fill in your site from your Google listing, the business name and city you search for are sent to Google to find it. Sites linked to a Google listing then show that listing's public rating, reviews and photos, which our servers look up from Google (photos are then loaded by the visitor's browser directly from Google) and credit to their authors. Your personal details are never sent.</li>
<li><strong>Google (Gemini API)</strong> — does three things: (1) drafts the wording of a newly generated site from the business details entered in setup (see &ldquo;How your site is generated&rdquo;); (2) drafts instant replies to messages you send Websprout support (only the subject and text of your message are sent, not your email address, and a person still reads every message); and (3) checks the text and uploaded photos of sites when they are published or shared (see &ldquo;Content checks&rdquo;). Account emails are never sent.</li>
<li><strong>Google Fonts</strong> — published sites load their fonts from Google Fonts, so Google receives the visitor&rsquo;s IP address and browser details under Google&rsquo;s own privacy policy.</li>
<li><strong>Google Maps</strong> — sites with an address can show a map of it. The map is Google&rsquo;s free embedded map (no account or key) and loads from Google only when a visitor taps &ldquo;Show map&rdquo;, or as they scroll to it if the owner chose the always-on map layout; Google then receives that visitor&rsquo;s IP address and browser details under Google&rsquo;s own privacy policy.</li>
<li><strong>Google Ads and Meta</strong> — only when ad measurement is on, and only on websprout.app (see &ldquo;Advertising&rdquo;).</li>
<li><strong>Stripe</strong> — processes subscription and store payments, and pays out store sales to owners through Stripe Connect. We never see or store card details.</li>
<li><strong>Resend</strong> — delivers email, such as sign-in links and notices when a visitor submits a form on your site.</li>
</ul>
<h2>Data from your website visitors</h2>
<p>When people visit a site built with Websprout and send a message through its contact form, leave a review, or buy something, Websprout processes that information <strong>on behalf of the business that owns the site</strong>, so we can deliver it to them. The business owner decides how to use it and is responsible for it. If you sent a message to a business, please contact that business about your data. We will help the business answer requests. We do not use visitors&rsquo; data for our own marketing.</p>
<h2>Payment links you add to your site</h2>
<p>If you add payment buttons (for example deposits, invoices, gift cards or tips) using your own Stripe, PayPal, Venmo, Square or similar links, clicking a button takes your visitor to that provider's own checkout. Those payments are handled entirely by the provider you chose, under their terms and privacy policy. Websprout does not process, receive or store them.</p>
<h2>How long we keep your data</h2>
<ul>
<li><strong>Your account and published sites:</strong> while your account is active, until you delete them.</li>
<li><strong>Saved drafts:</strong> 365 days after the draft was last saved.</li>
<li><strong>Version history snapshots:</strong> 60 days each.</li>
<li><strong>Contact-form messages (leads):</strong> 120 days, then deleted automatically.</li>
<li><strong>Reviews left on your site:</strong> 400 days (about 13 months) after they were submitted or last approved, then deleted automatically.</li>
<li><strong>Share-preview links:</strong> 7 days.</li>
<li><strong>Invoices you send through Websprout:</strong> 365 days.</li>
<li><strong>Analytics and activity events:</strong> raw events are deleted after 400 days (about 13 months). After that we keep only daily totals that contain no personal information. If our main analytics database is unavailable, events go to a backup log that is deleted after 60 days.</li>
<li><strong>Technical error reports from the app:</strong> 30 days.</li>
<li><strong>Payment records:</strong> kept by Stripe as the law requires.</li>
</ul>
<p>We may also send you an occasional service email about your own account or sites (for example, a one-time reminder that an unpublished site is saved); every such email includes an unsubscribe link, and we honor opt-outs. When you delete a site or your account, the associated data is removed from our systems, except payment records that Stripe is required to retain by law. You can delete everything at any time (see below).</p>
<h2>Children</h2>
<p>Websprout is for adults: you must be 18 or older to use it. Websprout is not directed at children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has given us personal information, contact us and we will delete it.</p>
<h2>Your data and your rights</h2>
<p>You are in control of your data. From <strong>Settings</strong> in the Websprout studio you can, at any time:</p>
<ul>
<li><strong>Download my data</strong> — export everything we hold about you (your account, sites, products, reviews, leads and invoices) as a single JSON file. This covers your right to access and to data portability.</li>
<li><strong>Delete account and all data</strong> — permanently erase your account and every site, draft, product, review, lead and invoice tied to it, and sign you out. This covers your right to erasure (the right to be forgotten / the right to delete).</li>
</ul>
<p>Two things to note. First, payment records held by our payment processor (Stripe) may be kept as required by law even after you delete your account, so we can meet tax and accounting obligations; this data lives with Stripe, not in your Websprout account. Second, if you connected a custom domain, that domain mapping may need to be removed separately — email us and we will clear it for you.</p>
<h2>California and other US state privacy rights</h2>
<p>If you live in California (CCPA/CPRA) or another US state with a similar law, you have the right to:</p>
<ul>
<li><strong>Know</strong> what personal information we collect, use and disclose, and get a copy of it;</li>
<li><strong>Delete</strong> your personal information;</li>
<li><strong>Correct</strong> inaccurate personal information;</li>
<li><strong>Opt out of the sale or sharing</strong> of your personal information;</li>
<li><strong>Limit</strong> the use of sensitive personal information. We do not use sensitive personal information for anything that would give you this right.</li>
</ul>
<p>We do not sell personal information. When ad measurement is on, using Google and Meta ad tags may count as &ldquo;sharing&rdquo; for cross-context behavioral advertising. You can opt out at <a href="/privacy-choices">/privacy-choices</a>. We honor Global Privacy Control as an opt-out.</p>
<p><strong>How to use these rights.</strong> Use <strong>Download my data</strong> and <strong>Delete account and all data</strong> in Settings, edit your details in the studio, or email <a href="mailto:support@websprout.app">support@websprout.app</a>. We may need to confirm it is you, usually by checking you can sign in or reply from your account email. You can use an authorized agent; we may ask for proof that they act for you. We will not treat you differently, charge you more or give you a lower level of service for using your rights.</p>
<h2>If you are in the EU, EEA or UK</h2>
<p><strong>Lawful bases.</strong> We use your data to perform our contract with you (running your account and sites, taking payment); for our legitimate interests (keeping the service secure, checking content for abuse, answering support, and privacy-friendly analytics to improve Websprout); with your consent for advertising tags (these load only for visitors in the United States); and to meet legal obligations (for example, tax records).</p>
<p><strong>International transfers.</strong> Websprout is run from the United States, and our service providers process data in the United States and other countries. When we transfer personal data out of the EU, EEA or UK, we rely on our providers&rsquo; legal transfer safeguards, such as the EU Standard Contractual Clauses or the EU-US Data Privacy Framework.</p>
<p><strong>Your rights.</strong> You can ask to access, correct, delete, export or restrict the use of your data, and object to our use of it based on legitimate interests. Use the tools in Settings or email us. You also have the right to complain to your local data protection authority.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy. When we do, we change the date at the top. If a change is significant, we will tell you by email or in the app.</p>
<h2>Contact</h2>
<p>Questions or requests? Email us at <a href="mailto:support@websprout.app">support@websprout.app</a>. To report abuse, email <a href="mailto:abuse@websprout.app">abuse@websprout.app</a>.</p>
</div>
</body>
</html>`;

// Your privacy choices (/privacy-choices): opt out of ad measurement on websprout.app. Sets the ws_adsoff cookie that
// the server checks before adding the Google/Meta ad tags; also shows whether the browser sends Global Privacy Control.
const PRIVACY_CHOICES_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Privacy Choices — Websprout</title>
<meta name="robots" content="noindex">
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
.box{background:#fff;border:1px solid #d6e3d2;border-radius:14px;padding:1.25rem 1.5rem;margin:1.5rem 0}
.btns{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem}
button{font:inherit;font-weight:700;font-size:15px;border-radius:100px;padding:12px 24px;cursor:pointer;border:2px solid #2d7a3a}
.primary{background:#2d7a3a;color:#fff}
.secondary{background:#fff;color:#2d7a3a}
button:focus-visible{outline:3px solid #0f1a0d;outline-offset:2px}
#status{font-weight:700;color:#0f1a0d;margin:0}
#gpc{margin:0}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Your privacy choices</h1>
<p class="meta">Last updated: November 2026</p>
<h2>What is ad measurement?</h2>
<p>We may advertise Websprout on Google and Meta (Facebook and Instagram). To see whether those ads work, websprout.app can load Google Ads / Google Analytics 4 tags and the Meta Pixel. These tags may set cookies and tell Google or Meta when someone who saw an ad visits, publishes a site or starts a Pro trial.</p>
<ul>
<li>The tags run only on websprout.app, never on the websites our customers publish.</li>
<li>They load only for visitors in the United States.</li>
<li>Under California law this may count as &ldquo;sharing&rdquo; personal information for cross-context behavioral advertising. We do not sell personal information.</li>
</ul>
<p>You can turn ad measurement off for this browser below. It does not affect your account, your sites or our cookie-free analytics.</p>
<div class="box" aria-live="polite">
<p id="gpc">Checking for a Global Privacy Control signal&hellip;</p>
<p id="status">Checking your choice&hellip;</p>
<div class="btns">
<button type="button" class="primary" id="optout">Opt out of ad measurement</button>
<button type="button" class="secondary" id="optin">Undo opt-out</button>
</div>
</div>
<h2>Global Privacy Control</h2>
<p>Global Privacy Control (GPC) is a setting in some browsers and extensions that tells websites not to sell or share your personal information. If your browser sends it, we treat it as an opt-out and do not load ad tags. You do not need to do anything else.</p>
<h2>Good to know</h2>
<p>Your choice is saved in a cookie in this browser for one year. If you clear cookies, or use another browser or device, make the choice again there. To use your other privacy rights, see our <a href="/privacy">Privacy Policy</a> or email <a href="mailto:support@websprout.app">support@websprout.app</a>.</p>
</div>
<script>
(function(){
  var gpc = navigator.globalPrivacyControl === true;
  function isOff(){ return ('; ' + document.cookie).indexOf('; ws_adsoff=1') > -1; }
  function render(){
    document.getElementById('gpc').textContent = gpc
      ? 'Your browser is sending a Global Privacy Control signal, so ad tags are already off for you.'
      : 'Your browser is not sending a Global Privacy Control signal.';
    var off = isOff();
    document.getElementById('status').textContent = off
      ? 'You have opted out. Ad measurement is off in this browser.'
      : (gpc ? 'Ad measurement is off because of Global Privacy Control.' : 'You have not opted out. Ad measurement may be on in this browser.');
    document.getElementById('optout').disabled = off;
    document.getElementById('optin').disabled = !off;
  }
  document.getElementById('optout').addEventListener('click', function(){
    document.cookie = 'ws_adsoff=1; Max-Age=31536000; Path=/; Secure; SameSite=Lax';
    render();
  });
  document.getElementById('optin').addEventListener('click', function(){
    document.cookie = 'ws_adsoff=; Max-Age=0; Path=/; Secure; SameSite=Lax';
    render();
  });
  render();
})();
</script>
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
  <div class="compare-sub">Prefer to put the downloaded HTML on your own free hosting? Go Pro to download your code, then pick one of these. Both have free plans with HTTPS and custom domains (plans and limits change, so check their current pricing) — here is how they compare.</div>
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
      <tr><td>Free bandwidth</td><td class="netlify-col"><span class="ok">Free plan; check current limits</span></td><td class="cf-col"><span class="ok">Free plan; check current limits</span></td></tr>
      <tr><td>Free sites</td><td class="netlify-col"><span class="ok">Free plan; check current limits</span></td><td class="cf-col"><span class="ok">Free plan; check current limits</span></td></tr>
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
        <p>Best for high-traffic sites, on Cloudflare's fast global network.</p>
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
      <div class="faq-a">Usually not. Netlify and Cloudflare Pages both have a free plan that is enough for most small business websites. Their limits change from time to time, so check their current pricing pages.</div>
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
      <div class="faq-a">For most people, Netlify is easier and faster to get started. If you expect high traffic or already use Cloudflare for a domain, Cloudflare Pages is a strong long-term choice because of its large global network.</div>
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

