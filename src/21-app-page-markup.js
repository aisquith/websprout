<body>
<a class="ws-skip" href="#wsMain">Skip to main content</a>

<div class="toast" id="toast"></div>

<div class="qa-screen" id="qaScreen" aria-hidden="true" role="status" aria-live="polite">
  <div class="qa-box">
    <div class="qa-logo"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#4ade80" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#4ade80"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#34d399"/></svg></div>
    <div class="qa-title">Growing your site</div>
    <div class="qa-sub">Running it through our quality checks</div>
    <ul class="qa-steps" id="qaSteps">
      <li class="qa-step"><span class="qa-ic"></span><span>Building your layout</span></li>
      <li class="qa-step"><span class="qa-ic"></span><span>Writing your content</span></li>
      <li class="qa-step"><span class="qa-ic"></span><span>Checking colour &amp; contrast</span></li>
      <li class="qa-step"><span class="qa-ic"></span><span>Optimising for mobile</span></li>
      <li class="qa-step"><span class="qa-ic"></span><span>Final visual quality check</span></li>
    </ul>
    <div class="qa-bar"><div class="qa-fill" id="qaFill"></div></div>
  </div>
</div>

<nav>
  <a href="/" class="nav-logo">
    <div class="nav-logo-mark"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    <span class="lw">Web<em>sprout</em></span>
  </a>
  <ul class="nav-links">
    <li><a href="#how" id="howLink">How it works</a></li>
    <li><a href="#pricing" id="pricingLink">Pricing</a></li>
    <li><a href="#" id="mySitesLink">My sites</a></li>
    <li><a href="/deploy-guide" target="_blank">Deploy guide</a></li>
    <li><a href="#" id="supportLink">Support</a></li>
  </ul>
  <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button>
  <span class="acct-wrap" id="acctWrap"><button class="nav-cta" id="signInBtn" aria-haspopup="menu" aria-expanded="false" style="background:transparent;border:1px solid rgba(255,255,255,.18);color:#fff;margin-right:8px;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Sign in</button><div class="acct-menu" id="acctMenu" role="menu" aria-hidden="true"></div></span>
  <button class="nav-cta" id="navCta">Build for free &#8594;</button>
</nav>

<main id="wsMain" tabindex="-1">
<div class="hero" id="hero">
  <div class="hero-pill">
    <div class="hero-pill-dot"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    Free to build &amp; preview
  </div>
  <h1>Plant an idea.<br><em>Grow a website.</em></h1>
  <p class="hero-sub">Describe your business. Get a complete, professional website in seconds.</p>

  <div class="hero-stats">
    <div class="hero-stat">
      <div class="stat-n" id="liveCount">&mdash;</div>
      <div class="stat-l">Sites grown</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">Instant</div>
      <div class="stat-l">to build</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">$10</div>
      <div class="stat-l">per month</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">Free</div>
      <div class="stat-l">to publish</div>
    </div>
  </div>

  <!-- BUILDER CARD -->
  <div class="builder-wrap" id="builder">
    <div class="builder-label">&#8594; Tell us about your business</div>
    <div class="builder-card">
      <div class="step-tabs" style="display:none">
        <button class="step-tab active" id="tab1"><span class="step-n">1</span>Site type</button>
        <button class="step-tab" id="tab2"><span class="step-n">2</span>Details</button>
        <button class="step-tab" id="tab3"><span class="step-n">3</span>Generate</button>
      </div>

      <div class="panel active" id="panel1">
        <div class="panel-q">Tell us about your business</div>
        <div class="detail-grid">
          <div>
            <div class="field-lbl">Business name</div>
            <input id="bizName" aria-label="Business name" class="dark-input" type="text" placeholder="e.g. Marguerite Bakery">
          </div>
          <div>
            <div class="field-lbl">What kind of business?</div>
            <input id="bizType" aria-label="Business type" class="dark-input" type="text" placeholder="Bakery, barber, lawn care...">
          </div>
        </div>
        <div style="margin-top:14px">
          <div class="field-lbl">A few details <span style="color:rgba(255,255,255,.55);font-weight:400">(optional)</span></div>
          <textarea id="customPrompt" aria-label="A few details about your business" class="dark-input" rows="3" placeholder="What you offer, what makes you different, and the feel you want. A sentence or two is plenty."></textarea>
        </div>
        <div class="detail-grid" style="margin-top:14px">
          <div>
            <div class="field-lbl">City <span style="color:rgba(255,255,255,.55);font-weight:400">(optional)</span></div>
            <input id="bizCity" aria-label="City" class="dark-input" type="text" autocomplete="address-level2" placeholder="e.g. Austin">
          </div>
          <div>
            <div class="field-lbl">Phone <span style="color:rgba(255,255,255,.55);font-weight:400">(optional)</span></div>
            <input id="bizPhone" aria-label="Phone number" class="dark-input" type="tel" autocomplete="tel" placeholder="e.g. (512) 555-0100">
          </div>
        </div>
        <div class="panel-foot">
          <span class="p-hint">Free to build &amp; preview</span>
          <button class="gen-btn on" id="next1"><span>Grow my site</span><span>&#127807;</span></button>
        </div>
      </div>

      <div class="panel" id="panel2"></div>

      <div class="panel" id="panel3">
        <div id="gen-area">
          <div class="panel-q">Ready to grow</div>
          <div class="summary-grid" id="summaryGrid"></div>
          <button class="gen-btn" id="gbtn"><span id="gbtnTxt">Grow my site</span><span>&#127807;</span></button>
        </div>
        <div class="loading" id="loading">
          <div class="load-icon">&#127807;</div>
          <div class="load-txt" id="loadTxt">Growing your site...</div>
        </div>
        <div class="load-bar" id="loadBar" style="display:none"><div class="load-fill"></div></div>
        <div class="panel-foot" id="p3foot">
          <button class="btn-back" id="back3">&#8592; Back</button>
          <span class="p-hint">Ready in a moment</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="trust-item"><span class="trust-icon">&#9989;</span> No credit card to preview</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> A complete, ready-to-publish site</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Download the source code</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Deploy anywhere free</div>
</div>

<!-- SHOWCASE -->
<div class="ws-showcase ws-reveal" id="showcase" aria-label="Example website styles">
  <div class="ws-sc-head">Real sites, grown in seconds</div>
  <div class="ws-sc-sub">Every one of these was made by the same builder you are about to use, from just a name and a business type. Click one to look around.</div>
  <div class="ws-ex-grid" id="wsExGrid"></div>
  <div class="ws-sc-note">Example businesses. Every site comes out different: layout, colors, fonts and words.</div>
</div>

<!-- HOW IT WORKS -->
<div class="how" id="how">
  <div class="how-inner">
    <div class="section-eyebrow">How it works</div>
    <div class="section-title">From seed to site in 3 steps.</div>
    <div class="how-grid">
      <div class="how-card">
        <div class="how-step-num">1</div>
        <h3>Plant your idea</h3>
        <p>Enter your business name and type, and add a detail or two if you like. That is all it takes.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">2</div>
        <h3>Watch it grow</h3>
        <p>Your site appears instantly &mdash; real sections, working navigation, and a contact form, all ready to go.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">3</div>
        <h3>Launch your sites</h3>
        <p>Publish your site live for free at name.websprout.app. Try Pro free for 7 days to remove the badge and connect your own domain. Cancel anytime.</p>
      </div>
    </div>
  </div>
</div>

<!-- COMPARE -->
<div class="compare">
  <div class="compare-inner">
    <div class="section-eyebrow">Why Websprout</div>
    <div class="section-title">Grow more for less.</div>
    <div class="compare-grid">
      <div class="cmp-card highlight">
        <div class="cmp-head">&#127807; Websprout <span class="cmp-badge">You're here</span></div>
        <ul class="cmp-list">
          <li class="cmp-item">A complete site, built instantly</li>
          <li class="cmp-item">Publish it live, free</li>
          <li class="cmp-item">7-day free trial, then $10/mo</li>
          <li class="cmp-item">No badge &amp; your own domain on Pro</li>
          <li class="cmp-item">Hosted free on websprout.app</li>
          <li class="cmp-item">Edit it yourself &mdash; no code</li>
        </ul>
      </div>
      <div class="cmp-card">
        <div class="cmp-head" style="color:rgba(255,255,255,.72)">Other builders</div>
        <ul class="cmp-list">
          <li class="cmp-item no">$15-40 per month, forever</li>
          <li class="cmp-item no">Locked into their platform</li>
          <li class="cmp-item no">Can't export your code</li>
          <li class="cmp-item no">Cookie-cutter templates</li>
          <li class="cmp-item no">Slow, fiddly setup</li>
          <li class="cmp-item no">Complex drag-and-drop editor</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- PRICING -->
<div class="pricing" id="pricing">
  <div class="pricing-inner">
    <div class="section-eyebrow">Pricing</div>
    <div class="section-title">Plant for free. Own it for $10.</div>
    <p style="color:rgba(255,255,255,.6);font-size:15px">Build and launch your site live for free. Start a 7-day free trial of Pro to make it fully yours &mdash; your domain, no badge, the code.</p>
    <div class="price-grid">
      <div class="price-card">
        <div class="price-name">Free</div>
        <div class="price-amt">$0</div>
        <div class="price-freq">always free to grow</div>
        <ul class="price-list">
          <li class="price-item">Publish a live website, free</li>
          <li class="price-item">Unlimited websites</li>
          <li class="price-item">Full visual editor</li>
          <li class="price-item dim">Remove the Websprout badge</li>
          <li class="price-item dim">Your own domain &amp; code download</li>
        </ul>
      </div>
      <div class="price-card pick">
        <div class="price-name">Pro</div>
        <div class="price-amt"><sup>$</sup>10</div>
        <div class="price-freq">7 days free, then $10/mo</div>
        <ul class="price-list">
          <li class="price-item">No Websprout badge</li>
          <li class="price-item">Connect your own domain</li>
          <li class="price-item">Unlimited websites</li>
          <li class="price-item">Download &amp; deploy the code</li>
          <li class="price-item">Cancel anytime</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- FAQ -->
<div class="lp-faq" id="faq">
  <div class="lp-faq-inner">
    <div class="section-eyebrow">Questions</div>
    <div class="section-title">Good to know.</div>
    <details><summary>Do I need any design or tech skills?</summary><p>No. Type your business name and what you do, and you get a finished site. To change anything, click the text or photo in the preview and type. Colors, fonts and layouts are one click each.</p></details>
    <details><summary>What do I get for free?</summary><p>A complete multi-page site with a contact form, published live at yourname.websprout.app. Building, editing and publishing are free. Pro removes the small Websprout badge and lets you use your own domain.</p></details>
    <details><summary>Will my site look like everyone else's?</summary><p>No. Each site gets its own mix of layout, colors, fonts and wording based on your type of business, and you can shuffle the look or pick your own brand color at any time.</p></details>
    <details><summary>Where do contact form messages go?</summary><p>Straight to your Websprout inbox, and to your email if you add it. No third-party form service needed.</p></details>
    <details><summary>Can I use my own domain?</summary><p>Yes, with Pro. You can also download the full code and host it anywhere you like.</p></details>
    <details><summary>Can I cancel anytime?</summary><p>Yes. Pro is month to month, and your site stays published on the free plan if you cancel.</p></details>
  </div>
</div>

<!-- CTA BAND -->
<div class="cta-band">
  <h2>Your website is one<br>seed away.</h2>
  <p>Free to build and launch. Start a 7-day free trial to make it yours.</p>
  <button class="btn-white" id="ctaBtn">Plant my website free &#127807;</button>
</div>

</main>
<footer>
  <a href="/" class="foot-logo">
    <div class="nav-logo-mark" style="width:26px;height:26px"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    <span class="lw">Web<em>sprout</em></span>
  </a>
  <div class="foot-links">
    <span style="color:rgba(255,255,255,.72);font-size:13px">&#169; 2026 Websprout</span>
    <a href="/terms" target="_blank">Terms</a>
    <a href="/privacy" target="_blank">Privacy</a>
    <a href="/accessibility" target="_blank">Accessibility</a>
    <a href="/for">For your business</a>
    <a href="/deploy-guide" target="_blank">Deploy guide</a>
    <a href="mailto:support@websprout.app">Contact</a>
  </div>
</footer>
<div class="studio" id="studio"><svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><symbol id="i-edit" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></symbol><symbol id="i-settings" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></symbol><symbol id="i-info" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></symbol><symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></symbol><symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></symbol><symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol><symbol id="i-chart" viewBox="0 0 24 24"><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="18" y1="20" x2="18" y2="4"/></symbol><symbol id="i-megaphone" viewBox="0 0 24 24"><path d="m3 11 15-5v12L3 13Z"/><path d="M11.6 16.8a3 3 0 1 1-5.6-2"/></symbol><symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></symbol><symbol id="i-receipt" viewBox="0 0 24 24"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1Z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></symbol><symbol id="i-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></symbol><symbol id="i-undo" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a4 4 0 0 1 0 8h-3"/></symbol><symbol id="i-redo" viewBox="0 0 24 24"><path d="m15 14 5-5-5-5"/><path d="M20 9H9a4 4 0 0 0 0 8h3"/></symbol><symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="i-folder" viewBox="0 0 24 24"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></symbol><symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol><symbol id="i-share" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></symbol><symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></symbol><symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></symbol><symbol id="i-plus" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></symbol><symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol><symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol><symbol id="i-rocket" viewBox="0 0 24 24"><path d="M5 16c-1.5 1.3-2 5-2 5s3.7-.5 5-2a2.1 2.1 0 0 0-3-3Z"/><path d="M12 15l-3-3a21 21 0 0 1 2-4A12 12 0 0 1 21 3c0 2.7-.8 7-6 11a21 21 0 0 1-3 1Z"/><path d="M9 12H5s.5-2.8 2-4c1.6-1 4 0 4 0"/><path d="M12 15v4s2.8-.5 4-2c1-1.6 0-4 0-4"/></symbol><symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></symbol><symbol id="i-palette" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="16" cy="9" r="1.2"/><path d="M12 21a3 3 0 0 1 0-6 2 2 0 0 0 0-4"/></symbol><symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z"/></symbol><symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/></symbol></svg>
  <div class="s-header">
    <div class="logo-mark" style="width:24px;height:24px;font-size:12px">🌱</div>
    <div class="s-title" id="stitle">Your site</div>
    <div class="live-dot"></div>
    <div class="device-btns">
      <button class="dev-btn active" id="devDesktop" aria-label="Desktop preview" title="Desktop"><svg aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></button>
      <button class="dev-btn" id="devTablet" aria-label="Tablet preview" title="Tablet"><svg aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg></button>
      <button class="dev-btn" id="devMobile" aria-label="Mobile preview" title="Mobile"><svg aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg></button>
    </div>
    <div class="s-actions">
      <span class="edit-counter" id="editCounter"></span>
      <button class="s-btn s-ghost s-icon on" id="panelToggle" type="button" aria-label="Show or hide the editing panel" title="Show/hide panel" onclick="var s=document.getElementById('studio');var off=s.classList.toggle('panel-off');this.classList.toggle('on',!off);"><svg class="ic ic-only" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg></button>
      <button class="s-btn s-ghost edit-mode-btn" id="editModeBtn" data-needs-site="1" title="Click any text to edit it"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-edit"/></svg>Edit text</button>
      <span style="position:relative;display:inline-block">
        <div id="toolsMenu" class="s-menu" style="display:none">
          <div class="gs-head">Set up your site</div>
          <button class="gs-item" data-tool="yourInfoBtn">&#128221; Your info<span class="gs-sub">Name, phone, email &amp; hours — everywhere</span></button>
          <button class="gs-item" data-tool="sectionsBtn">&#9783; Manage sections<span class="gs-sub">Add, remove or reorder</span></button>
          <button class="gs-item" data-tool="seoBtn">&#128269; SEO &amp; sharing<span class="gs-sub">Title, description, social preview</span></button>
          <button class="gs-item" style="display:none" onclick="if(window.wsBuildFullSite){window.wsBuildFullSite();}else{var b=document.getElementById('multiBtn');if(b)b.click();}">&#43; Add pages<span class="gs-sub">Turn this into a multi-page site (About, Shop, Contact...)</span></button>
          <div class="gs-head">Grow your business</div>
          <button class="gs-item" data-tool="leadsBtn">&#128236; Leads<span class="gs-sub">See who contacted you</span></button>
          <button class="gs-item" data-tool="statsBtn">&#128202; Analytics<span class="gs-sub">Your views, leads &amp; reviews</span></button>
          <button class="gs-item" data-tool="postBtn">&#9997; Marketing copy<span class="gs-sub">AI posts, emails &amp; promos</span></button>
          <button class="gs-item" data-tool="payBtn" style="display:none">&#128179; Product payments<span class="gs-sub">Add your own pay links to buttons</span></button>
          <button class="gs-item" onclick="if(window.wsOpenProducts){window.wsOpenProducts();}else{var b=document.getElementById('prodBtn');if(b)b.click();}">&#128722; Products &amp; cart<span class="gs-sub">Build a shop with a cart &amp; checkout</span></button>
          <button class="gs-item" id="invoiceMenuItem" data-tool="invoiceBtn" style="display:none">&#129534; Send an invoice<span class="gs-sub">Get paid with a Stripe link</span></button>
          <div class="gs-head">Start fresh</div>
          <button class="gs-item" data-tool="regenBtn">&#8635; Regenerate the design<span class="gs-sub">Keep your words, new look</span></button>
          <button class="gs-item" data-tool="backBtn">&#8592; Start over<span class="gs-sub">Build a different site</span></button>
        </div>
      </span>
      <span id="editTools" style="display:none">
        <button class="s-btn s-ghost" id="yourInfoBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-info"/></svg>Your info</button>
        <button class="s-btn s-ghost" id="sectionsBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-layers"/></svg>Sections</button>
        <button class="s-btn s-ghost" id="seoBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-search"/></svg>SEO</button>
        <button class="s-btn s-ghost" id="leadsBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-mail"/></svg>Leads</button>
        <button class="s-btn s-ghost" id="statsBtn" data-needs-site="1" style="display:none"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-chart"/></svg>Analytics</button>
        <button class="s-btn s-ghost" id="postBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-megaphone"/></svg>Marketing</button>
        <button class="s-btn s-ghost" id="payBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-card"/></svg>Payments</button>
        <button class="s-btn s-ghost" id="invoiceBtn" style="display:none"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-receipt"/></svg>Invoice</button>
        <button class="s-btn s-ghost" id="backBtn">&#8592; Back</button>
        <button class="s-btn s-ghost" id="regenBtn"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-refresh"/></svg>Regen</button>
      </span>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost" id="undoBtn" disabled><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-undo"/></svg>Undo</button>
      <button class="s-btn s-ghost" id="redoBtn" disabled><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-redo"/></svg>Redo</button>
      <button class="s-btn s-ghost" id="fullscreenBtn" data-needs-site="1" title="Full screen preview"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-eye"/></svg><span class="s-lbl2">Preview</span></button>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost s-icon" id="mySitesBtn" aria-label="Your saved sites" title="Your saved sites"><svg class="ic ic-only" aria-hidden="true" focusable="false"><use href="#i-folder"/></svg></button>
      <button class="s-btn s-ghost" id="acctBtn" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="Your account"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>Sign in</button>
      <span id="outActions" style="display:none">
      <button class="s-btn s-ghost" id="shareBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-share"/></svg>Share</button>
      <button class="s-btn" id="publishBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-globe"/></svg>Publish</button>
      <button class="s-btn s-ghost" id="dlBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-download"/></svg>Download</button>
      <button class="s-btn s-ghost" id="multiBtn" data-needs-site="1" style="display:none" title="Build a full multi-page site (About, Menu, Contact...)"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>Add pages</button>
      <button class="s-btn s-ghost" id="prodBtn" data-needs-site="1" title="Manage your shop products"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-bag"/></svg>Products</button>
      <button class="s-btn s-ghost" id="copyBtn" data-needs-site="1" title="Copy full HTML to clipboard"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-copy"/></svg>Copy code</button>
      <button class="s-btn s-ghost" id="deployBtn" data-needs-site="1"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-rocket"/></svg>Deploy</button>
      </span>
      <style>.gs-item{display:block;width:100%;text-align:left;background:none;border:none;color:#fff;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}.gs-item:hover{background:rgba(45,122,58,.18)}.gs-sub{display:block;font-size:11px;color:rgba(255,255,255,.72);font-weight:400;margin-top:1px}.gs-head{font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:rgba(255,255,255,.72);padding:10px 12px 4px}.gs-head:first-child{padding-top:4px}.s-sep{width:1px;height:20px;background:rgba(255,255,255,.1);margin:0 3px;flex-shrink:0;align-self:center}.s-menu{position:absolute;top:calc(100% + 6px);right:0;background:#0f1a0d;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;min-width:218px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:1000}.s-icon{padding:6px 9px}</style>
      <span id="saveStatus" style="font-size:12px;color:rgba(255,255,255,.72);font-weight:600;margin-right:6px;opacity:0;transition:opacity .3s;white-space:nowrap" title="Your work autosaves as you edit">Saved</span>
      <span style="position:relative;display:inline-block">
        <button class="s-btn" id="getSiteBtn" data-needs-site="1" style="background:#2d7a3a;color:#fff;border-color:#2d7a3a;font-weight:700" title="Publish, download or share your site"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-globe"/></svg>Publish &#9662;</button>
        <div id="getSiteMenu" style="display:none;position:absolute;top:calc(100% + 6px);right:0;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:12px;padding:6px;min-width:266px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:1000">
          <div id="getSiteHint" style="display:none;background:rgba(45,122,58,.12);border:1px solid rgba(61,186,82,.28);border-radius:9px;padding:10px 11px;margin-bottom:6px;font-size:11.5px;line-height:1.55;color:rgba(234,242,232,.85)">
            <div style="font-weight:700;color:#7fe39a;margin-bottom:5px">New here? Two ways to go live:</div>
            <div style="margin-bottom:5px">&#127760; <b>Publish</b> &mdash; the easy way. An instant free link at <b>name.websprout.app</b>, no setup. Best for sharing fast.</div>
            <div>&#8595; <b>Download</b> / &#128640; <b>Deploy</b> &mdash; put the site on your <b>own</b> hosting and custom domain. More control, a few extra steps.</div>
            <div id="getSiteHintX" style="text-align:right;color:#7fe39a;font-weight:700;cursor:pointer;margin-top:8px">Got it &#10003;</div>
          </div>
          <button class="gs-item" data-act="publish">&#127760; Publish online<span class="gs-sub">Easiest &mdash; instant free link, no setup</span></button>
          <button class="gs-item" data-act="download">&#8595; Download code<span class="gs-sub">Raw HTML to host anywhere yourself</span></button>
          <button class="gs-item" data-act="copy">&#128203; Copy code<span class="gs-sub">Copy the HTML to your clipboard</span></button>
          <button class="gs-item" data-act="deploy">&#128640; Deploy to Netlify / Cloudflare<span class="gs-sub">Host on your own free account &amp; domain</span></button>
          <button class="gs-item" data-act="share">&#128279; Share preview link<span class="gs-sub">Private link to show someone first</span></button>
        </div>
      </span>
      <button class="s-btn s-purple" id="unlockBtn" title="Remove the badge and use your own domain">&#10024; Go Pro</button>
    </div>
  </div>
  <!-- Deploy CTA banner (shown after purchase) -->
  <div class="deploy-cta-banner" id="deployCtaBanner">
    <div style="font-size:20px">&#128640;</div>
    <div class="deploy-cta-banner-text"><span>Site unlocked!</span> Publish it live and grab your shareable link in seconds.</div>
    <button class="deploy-cta-banner-btn" id="deployCtaBtn">Publish now &#8594;</button>
    <button class="deploy-cta-dismiss" id="deployCtaDismiss" aria-label="Dismiss">&#10005;</button>
  </div>
  <div class="pub-modal" id="pubModal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
    <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
        <div style="font-size:17px;font-weight:800;color:#fff">&#127760; Publish your site</div>
        <button id="pubClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
      </div>
      <div style="padding:22px">
        <div id="pubStep1">
          <label style="display:block;font-size:13px;font-weight:600;color:rgba(255,255,255,.72);margin-bottom:8px">Choose your free web address</label>
          <div style="display:flex;align-items:center;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;overflow:hidden">
            <input id="pubSlug" aria-label="Site address" type="text" placeholder="your-business" autocomplete="off" style="flex:1;background:none;border:none;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;min-width:0">
            <span style="color:rgba(255,255,255,.72);padding:0 14px;font-size:14px;white-space:nowrap">.websprout.app</span>
          </div>
          <div id="pubAvail" style="font-size:13px;margin-top:8px;min-height:18px"></div>
          <button id="pubGo" style="width:100%;margin-top:14px;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit">Publish live &#8594;</button>
        </div>
        <div id="pubStep2" style="display:none">
          <div style="background:rgba(45,122,58,.1);border:1px solid rgba(45,122,58,.25);border-radius:14px;padding:18px;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#4ade80;font-weight:700;letter-spacing:.4px;text-transform:uppercase;margin-bottom:11px"><span style="width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.16)"></span>Live now</div>
            <a id="pubUrl" href="#" target="_blank" style="display:block;color:#fff;font-size:18px;font-weight:800;text-decoration:none;word-break:break-all;line-height:1.3"></a>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <button id="pubOpen" style="flex:1;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Visit site &#8599;</button>
            <button id="pubCopy" style="flex:1;background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Copy link</button>
          </div>
          <button id="pubUpdate" style="width:100%;background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">&#8635; Re-publish my latest edits</button>
          <a id="pubReviews" href="#" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:8px;background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px;font-size:13px;font-weight:600;text-decoration:none;font-family:inherit;box-sizing:border-box">&#11088; Manage reviews</a>
          <div id="pubBadgeNudge" style="display:none;background:linear-gradient(180deg,rgba(45,122,58,.14),rgba(45,122,58,.04));border:1px solid rgba(74,222,128,.22);border-radius:12px;padding:14px 16px;margin-top:14px">
            <div style="font-size:13.5px;color:#fff;font-weight:700;margin-bottom:3px">&#127793; Your site is live &mdash; with a small Websprout badge</div>
            <div style="font-size:12.5px;color:rgba(255,255,255,.72);line-height:1.5;margin-bottom:11px">Try Pro free for 7 days to remove the badge and connect your own domain. Then $10/mo, cancel anytime.</div>
            <button id="pubBadgeGoPro" class="s-btn s-purple" style="width:100%;padding:10px;border-radius:9px;font-size:13.5px;font-weight:700;cursor:pointer">&#10024; Start free trial &mdash; remove the badge</button>
          </div>
          <div id="pubDomainLocked" style="display:none;border-top:1px solid rgba(255,255,255,.07);margin-top:18px;padding-top:18px">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">&#128274; Use your own domain</div>
            <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:10px">Connecting a custom domain is a Pro feature.</div>
            <button id="pubDomGoPro" style="width:100%;background:rgba(109,40,217,.18);color:#c4b5fd;border:1px solid rgba(109,40,217,.4);border-radius:9px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Start free trial to use your domain</button>
          </div>
          <div id="pubDomainPro" style="border-top:1px solid rgba(255,255,255,.07);margin-top:18px;padding-top:18px">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">Use your own domain</div>
            <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:10px">Already own one? Connect it. Need one? Check if it is available.</div>
            <div style="display:flex;gap:8px">
              <input id="domInput" aria-label="Custom domain" type="text" placeholder="yourbusiness.com" autocomplete="off" style="flex:1;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:9px;color:#fff;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;min-width:0">
              <button id="domConnect" style="background:#2f9e4f;color:#fff;border:1px solid #2f9e4f;border-radius:9px;padding:10px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Connect</button>
              <button id="domCheck" style="background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Find</button>
            </div>
            <div id="domResult" style="font-size:13px;margin-top:10px;line-height:1.5"></div>
          </div>
          <div style="text-align:center;margin-top:16px"><button id="pubUnpub" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:12px;cursor:pointer;font-family:inherit">Take this site offline</button></div>
        </div>
      </div>
    </div>
  </div>
  <script>
  (function(){
    function $(id){return document.getElementById(id);}
    var modal=$('pubModal');if(!modal)return;
    var slugIn=$('pubSlug'),avail=$('pubAvail'),goBtn=$('pubGo');
    function site(){return window._wsSite||localStorage.getItem('ws_site')||'';}
    function key(){return window._wsKey||localStorage.getItem('ws_key')||'';}
    function curHtml(){try{return localStorage.getItem('wsh')||'';}catch(e){return '';}}
    function isUnlocked(){try{if(sessionStorage.getItem('wsu')==='1')return true;}catch(e){}if(window._wsUser&&window._wsUser.pro)return true;try{if(typeof unlocked!=='undefined'&&unlocked)return true;}catch(e){}return false;}
    function pslug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);}
    function bizName(){
      try{var info=JSON.parse(localStorage.getItem('ws_info_'+site())||'{}');if(info.brand)return info.brand;}catch(e){}
      try{var pf=$('pf');var d=pf&&(pf.contentDocument||pf.contentWindow.document);if(d){var bd=d.querySelector('[data-ws-field="brand"]');if(bd&&bd.textContent.trim())return bd.textContent.trim();}}catch(e){}
      var h=curHtml();var a=h.indexOf('<title>'),z=h.indexOf('</title>');if(a>-1&&z>a){var tt=h.slice(a+7,z).split('|')[0].trim();if(tt)return tt;}
      var st=$('stitle');return st?st.textContent:'';
    }
    function defSlug(){return pslug(bizName())||'my-site';}
    function savedSlug(){try{return localStorage.getItem('ws_slug_'+site())||'';}catch(e){return '';}}
    function showLive(slug){
      window._wsSlug=slug;
      var pathUrl='https://websprout.app/s/'+slug,subUrl='https://'+slug+'.websprout.app';
      window._wsSub=subUrl;window._wsLive=pathUrl;
      var u=$('pubUrl');u.textContent=pathUrl.replace('https://','');u.href=pathUrl;
      $('pubStep1').style.display='none';$('pubStep2').style.display='block';
      var _pro=isUnlocked();
      var _bn=$('pubBadgeNudge');if(_bn)_bn.style.display=_pro?'none':'block';
      var _dp=$('pubDomainPro');if(_dp)_dp.style.display=_pro?'block':'none';
      var _dl=$('pubDomainLocked');if(_dl)_dl.style.display=_pro?'none':'block';
      var _rv=$('pubReviews');if(_rv)_rv.href='/reviews?site='+encodeURIComponent(site());
      var probed=false;var pto=setTimeout(function(){probed=true;},3500);
      fetch(subUrl,{mode:'no-cors',cache:'no-store'}).then(function(){if(probed)return;probed=true;clearTimeout(pto);window._wsLive=subUrl;u.textContent=subUrl.replace('https://','');u.href=subUrl;}).catch(function(){});
    }
    var pubBtn=$('publishBtn');
    if(pubBtn)pubBtn.addEventListener('click',function(){
      if(!curHtml()||curHtml().length<50){if(window.toast)toast('Generate a site first');return;}
      modal.style.display='flex';
      var sv=savedSlug();
      if(sv){showLive(sv);}
      else{$('pubStep1').style.display='block';$('pubStep2').style.display='none';if(!slugIn.value)slugIn.value=defSlug();checkSlug();}
    });
    $('pubClose').addEventListener('click',function(){modal.style.display='none';});
    var _bgp=$('pubBadgeGoPro');if(_bgp)_bgp.addEventListener('click',function(){var u=$('unlockBtn');if(u)u.click();});
    var _dgp=$('pubDomGoPro');if(_dgp)_dgp.addEventListener('click',function(){var u=$('unlockBtn');if(u)u.click();});
    modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
    var tmr=null;
    slugIn.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(checkSlug,350);});
    function checkSlug(){
      var s=pslug(slugIn.value);
      if(s!==slugIn.value)slugIn.value=s;
      if(s.length<3){avail.innerHTML='<span style="color:rgba(255,255,255,.72)">At least 3 characters</span>';goBtn.disabled=true;return;}
      avail.innerHTML='<span style="color:rgba(255,255,255,.72)">Checking...</span>';
      fetch('/slug-check?slug='+encodeURIComponent(s)+'&siteId='+encodeURIComponent(site())).then(function(r){return r.json();}).then(function(j){
        if(j.available){avail.innerHTML='<span style="color:#4ade80">&#10003; '+s+'.websprout.app is yours</span>';goBtn.disabled=false;}
        else{
          goBtn.disabled=true;
          var ideas=[s+'-co',s+'-online',s+'-'+Math.random().toString(36).slice(2,4)];
          var chips='';for(var ci=0;ci<ideas.length;ci++){chips+='<button class="slug-sug" data-s="'+ideas[ci]+'" style="background:rgba(45,122,58,.16);border:1px solid rgba(45,122,58,.32);color:#4ade80;border-radius:6px;padding:3px 9px;font-size:12px;cursor:pointer;font-family:inherit;margin:0 4px 0 0">'+ideas[ci]+'</button>';}
          avail.innerHTML='<span style="color:#f87171">'+(j.reason==='reserved'?'That name is reserved':'That name is taken')+'</span> <span style="color:rgba(255,255,255,.72)">— try one of these:</span><div style="margin-top:6px">'+chips+'</div>';
          var sgs=avail.querySelectorAll('.slug-sug');for(var sk=0;sk<sgs.length;sk++){sgs[sk].addEventListener('click',function(){slugIn.value=this.getAttribute('data-s');checkSlug();});}
        }
      }).catch(function(){avail.innerHTML='';goBtn.disabled=false;});
    }
    goBtn.addEventListener('click',function(){
      var s=slugIn.value;if(s.length<3)return;
      // If anon, prompt signup first — publishing requires an account so we can save it to their sites list.
      if(!window._wsUser||!window._wsUser.auth){
        try{localStorage.setItem('ws_pending_slug',s);localStorage.setItem('ws_pending_html',curHtml());}catch(e){}
        if(window.toast)toast('Sign in to save this site to your account and publish it live — takes 5 seconds. \uD83C\uDF31',6000);
        try{if(window.openAuth)window.openAuth();}catch(e){}
        return;
      }
      goBtn.textContent='Publishing...';goBtn.disabled=true;
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:window._wsSiteData||undefined,html:curHtml(),slug:s,siteId:site(),key:key(),pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){
        goBtn.textContent='Publish live \u2192';goBtn.disabled=false;
        if(j.error){avail.innerHTML='<span style="color:#f87171">'+j.error+'</span>';return;}
        try{localStorage.setItem('ws_slug_'+site(),j.slug);}catch(e){}
        showLive(j.slug);
      }).catch(function(){goBtn.textContent='Publish live \u2192';goBtn.disabled=false;avail.innerHTML='<span style="color:#f87171">Could not publish — please try again</span>';});
    });
    $('pubCopy').addEventListener('click',function(){var u=window._wsLive||$('pubUrl').textContent;if(navigator.clipboard)navigator.clipboard.writeText(u);if(window.toast)toast('Link copied!');});
    $('pubOpen').addEventListener('click',function(){window.open(window._wsLive||$('pubUrl').textContent,'_blank');});
    $('pubUpdate').addEventListener('click',function(){
      var btn=this,orig=btn.innerHTML;btn.textContent='Re-publishing...';
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:window._wsSiteData||undefined,html:curHtml(),slug:window._wsSlug,siteId:site(),key:key(),pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){btn.innerHTML=orig;if(window.toast)toast(j.error?j.error:'\u2713 Updated — your live site now shows your latest edits.');}).catch(function(){btn.innerHTML=orig;if(window.toast)toast('Could not update — please try again');});
    });
    var unpubBtn=$('pubUnpub');
    if(unpubBtn)unpubBtn.addEventListener('click',async function(){
      var __ok=await wsConfirm({title:'Take your site offline?',message:'The link will stop working until you publish it again. Your site stays saved to your account.',okLabel:'Take offline',cancelLabel:'Keep live',danger:true});if(!__ok)return;
      var self=this;self.textContent='Taking offline...';
      fetch('/unpublish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:window._wsSlug,siteId:site(),key:key()})}).then(function(r){return r.json();}).then(function(j){
        self.textContent='Take this site offline';
        if(j&&j.ok){try{localStorage.removeItem('ws_slug_'+site());}catch(e){}modal.style.display='none';if(window.toast)toast('Your site is now offline.');}
        else if(window.toast)toast((j&&j.error)||'Could not take it offline');
      }).catch(function(){self.textContent='Take this site offline';if(window.toast)toast('Could not take it offline');});
    });
    // Connect a domain the owner already has: show the two DNS records, then verify with "Check again".
    function domEsc(s){return String(s==null?'':s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');}
    function domRow(label,host,value){return '<div style="display:grid;grid-template-columns:70px 1fr;gap:4px 10px;background:#060d05;border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px 12px;margin:8px 0;font-size:12.5px"><span style="color:rgba(255,255,255,.55)">Type</span><b style="color:#fff">'+label+'</b><span style="color:rgba(255,255,255,.55)">Name</span><code style="color:#fff;user-select:all">'+domEsc(host)+'</code><span style="color:rgba(255,255,255,.55)">Value</span><code style="color:#7fe39a;user-select:all;word-break:break-all">'+domEsc(value)+'</code></div>';}
    function domConnect(){
      var d=$('domInput').value.trim();var res=$('domResult');if(!d){$('domInput').focus();return;}
      if(!window._wsSlug){res.innerHTML='<span style="color:#fca5a5">Publish your site first, then connect your domain.</span>';return;}
      res.innerHTML='<span style="color:rgba(255,255,255,.72)">Checking your domain...</span>';
      fetch('/api/connect-domain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:d,slug:window._wsSlug,siteId:site(),key:key()})})
      .then(function(r){return r.json();}).then(function(j){
        if(!j||j.error){res.innerHTML='<span style="color:#fca5a5">'+domEsc((j&&j.error)||'Could not connect that domain.')+'</span>';return;}
        var st=j.steps||{};
        if(!j.verified){
          res.innerHTML='<div style="color:#fff;font-weight:700;margin-bottom:4px">Add these 2 records where you bought '+domEsc(j.host)+'</div>'
            +'<div style="font-size:12px;color:rgba(255,255,255,.7)">In the DNS settings at your domain provider (GoDaddy, Namecheap, Squarespace...), add:</div>'
            +domRow('TXT',st.txtHost,st.txtValue)+domRow('CNAME',st.cnameHost,st.cnameTarget)
            +'<div style="font-size:12px;color:rgba(255,255,255,.7);line-height:1.5">The TXT record proves the domain is yours. Then set your provider to forward <b style="color:#fff">'+domEsc(j.host)+'</b> to <b style="color:#fff">www.'+domEsc(j.host)+'</b>. Changes can take a few minutes to an hour.</div>'
            +'<button id="domRecheck" style="margin-top:10px;width:100%;background:#2f9e4f;color:#fff;border:none;border-radius:9px;padding:10px;font-weight:700;cursor:pointer;font-family:inherit">I added them. Check again</button>';
          var rc=$('domRecheck');if(rc)rc.addEventListener('click',domConnect);
          return;
        }
        var msg='<div style="color:#7fe39a;font-weight:700">&#10003; '+domEsc(j.host)+' is verified and connected to your site.</div>';
        if(!j.pointed)msg+='<div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:6px">Last step: make sure this record exists, then give it up to an hour.</div>'+domRow('CNAME',st.cnameHost,st.cnameTarget);
        if(j.https==='manual')msg+='<div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:6px">We are finishing the secure (HTTPS) setup on our side. You will get an email when it is live, usually within a business day.</div>';
        else if(j.https==='error')msg+='<div style="font-size:12px;color:#fca5a5;margin-top:6px">Secure setup hit a snag ('+domEsc(j.httpsError)+'). Email support@websprout.app and we will sort it out.</div>';
        else msg+='<div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:6px">Your secure certificate is being issued. <a href="'+domEsc(j.url)+'" target="_blank" style="color:#7fe39a">Open '+domEsc('www.'+j.host)+' &#8594;</a></div>';
        res.innerHTML=msg;
      }).catch(function(){res.innerHTML='<span style="color:#fca5a5">Could not reach Websprout. Please try again.</span>';});
    }
    $('domConnect').addEventListener('click',domConnect);
    $('domCheck').addEventListener('click',function(){
      var d=$('domInput').value.trim();var res=$('domResult');if(!d)return;
      res.innerHTML='<span style="color:rgba(255,255,255,.72)">Checking...</span>';
      fetch('/api/domain-check?domain='+encodeURIComponent(d)).then(function(r){return r.json();}).then(function(j){
        var buy='<a href="'+(j.buyUrl||'https://www.godaddy.com')+'" target="_blank" style="color:#4ade80;font-weight:700;text-decoration:none">Buy on GoDaddy &#8594;</a>';
        var status='';
        if(j.available===true)status='<span style="color:#4ade80">&#10003; '+j.domain+' is available'+(j.price?(' (about $'+j.price.toFixed(2)+'/yr)'):'')+'</span><br>';
        else if(j.available===false)status='<span style="color:#f87171">'+j.domain+' is taken</span><br>';
        res.innerHTML=status+buy+'<div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:8px">After buying it, come back here and press <b style="color:#fff">Connect</b>.</div>';
      }).catch(function(){res.innerHTML='<a href="https://www.godaddy.com/domainsearch/find?domainToCheck='+encodeURIComponent(d)+'" target="_blank" style="color:#4ade80;font-weight:700">Search on GoDaddy &#8594;</a>';});
    });
  })();
  </script>
  <div class="s-mobtabs" id="sMobTabs">
    <button class="s-mobtab active" data-mob="preview"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-eye"/></svg>Preview</button>
    <button class="s-mobtab" data-mob="chat"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-edit"/></svg>Edit your site</button>
  </div>
  <script>
  (function(){
    var tabs=document.getElementById('sMobTabs');if(!tabs)return;
    var studio=document.getElementById('studio');
    var body=studio?studio.querySelector('.s-body'):null;
    var bs=tabs.querySelectorAll('.s-mobtab');
    for(var i=0;i<bs.length;i++){bs[i].addEventListener('click',function(){
      var mode=this.getAttribute('data-mob');
      for(var j=0;j<bs.length;j++)bs[j].classList.remove('active');
      this.classList.add('active');
      // Look the panel container up on click: this script runs before .s-body exists in the page.
      body=body||(studio?studio.querySelector('.s-body'):null)||document.querySelector('.s-body');
      if(body){if(mode==='chat')body.classList.add('mob-chat');else body.classList.remove('mob-chat');}
    });}
  })();
  </script>
  <div class="s-body">
    <div class="preview-frame-wrap" id="previewWrap">
      <iframe id="pf" title="Live site preview" style="width:100%;height:4000px;border:none;display:block;background:#fff"></iframe>
      <div class="preview-label">live preview</div>
      <!-- Loading skeleton -->
      <div class="skeleton-wrap" id="skelWrap">
        <div class="skel-inner">
          <div class="skel-logo">
            <div class="skel-logo-mark">&#127807;</div>
            <div class="skel-logo-text"><span class="lw">Web<em>sprout</em></span></div>
          </div>
          <div class="skel-msg" id="skelMsg">Planting your prompt...</div>
          <div class="skel-progress-track">
            <div class="skel-progress-fill" id="skelProgress"></div>
          </div>
          <div class="skel-build">
            <div class="skel-section">
              <div class="skel-nav-bar">
                <div class="skel-nav-dot"></div>
                <div class="skel-nav-links">
                  <div class="skel-nav-link"></div>
                  <div class="skel-nav-link"></div>
                  <div class="skel-nav-link"></div>
                </div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-hero-bar">
                <div class="skel-hero-lines">
                  <div class="skel-hero-h"></div>
                  <div class="skel-hero-sub"></div>
                </div>
                <div class="skel-hero-btn"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-cards-row">
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-text-row">
                <div class="skel-text-line w90"></div>
                <div class="skel-text-line w70"></div>
                <div class="skel-text-line w55"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-cards-row">
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drop-overlay" id="dropOverlay"><div class="drop-overlay-txt">🌱 Drop photo to add to site</div></div>
      <div class="lock-badge" id="lkbadge">
        <button class="lock-title" type="button" onclick="this.parentNode.classList.toggle('open')">&#10024; Remove the Websprout badge</button>
        <div class="lock-sub">Try Pro free for 7 days &mdash; no badge and your own domain. Then $10/mo, cancel anytime.</div>
        <input type="email" id="emailCapture" aria-label="Email address" class="lock-email" placeholder="your@email.com">
        <button class="s-btn s-purple" style="width:100%;padding:10px;border-radius:8px;font-size:13px" id="lockPayBtn">Start 7-day free trial</button>
      </div>
    </div>

      <div class="fl-modal" id="freeLimitModal" style="display:none;position:fixed;inset:0;z-index:100000;background:rgba(4,8,4,.78);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:20px">
        <div style="max-width:430px;width:100%;background:linear-gradient(180deg,#12200f,#0c140a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:30px 26px;box-shadow:0 30px 80px -20px rgba(0,0,0,.8);text-align:center">
          <div style="width:54px;height:54px;margin:0 auto 16px;border-radius:15px;background:linear-gradient(150deg,#4ade80,#1f5f2a);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 8px 22px -6px rgba(74,222,128,.6)">&#127793;</div>
          <h2 style="margin:0 0 8px;font-size:21px;color:#fff;font-weight:800;letter-spacing:-.02em">You've used all your free builds</h2>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:rgba(234,251,230,.62)">Your sites are still yours &mdash; keep editing and exploring what you made. Go Pro to keep building sites like these and put them online for real.</p>
          <div style="text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px 16px;margin-bottom:18px">
            <div style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:rgba(234,251,230,.85);margin-bottom:9px"><span style="color:#4ade80">&#10003;</span> Unlimited new sites, top-quality AI</div>
            <div style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:rgba(234,251,230,.85);margin-bottom:9px"><span style="color:#4ade80">&#10003;</span> Publish live with no Websprout badge</div>
            <div style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:rgba(234,251,230,.85);margin-bottom:9px"><span style="color:#4ade80">&#10003;</span> Connect your own custom domain</div>
            <div style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:rgba(234,251,230,.85)"><span style="color:#4ade80">&#10003;</span> Leads, edits and updates anytime</div>
          </div>
          <button id="flmGoPro" class="s-btn s-purple" style="width:100%;padding:13px;border-radius:11px;font-size:15px;font-weight:700;margin-bottom:10px">&#10024; Start my free trial</button>
          <button id="flmKeep" style="width:100%;padding:10px;background:none;border:none;color:rgba(234,251,230,.5);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Keep editing my site</button>
        </div>
      </div>

    <!-- Fullscreen overlay -->
    <div class="fs-overlay" id="fsOverlay">
      <div class="fs-bar">
        <div class="logo-mark" style="width:22px;height:22px;font-size:11px">🌱</div>
        <div class="fs-title" id="fsTitle">Full screen preview</div>
        <button class="fs-close" id="fsNewTab" style="margin-left:auto">&#8599; Open in new tab</button>
        <button class="fs-close" id="fsClose">✕ Exit full screen</button>
      </div>
      <iframe id="pfFull" style="border:none;width:100%;flex:1"></iframe>
    </div>

    <div class="chat">
      <div class="chat-head">
        <div class="chat-head-title"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-spark"/></svg>Edit your site</div>
        <div class="chat-head-sub">Edit text, photos, colors and sections — every change applies live.</div>
      </div>
      <div class="chat-msgs" id="cms">
        <div class="msg msg-ai"><div class="msg-name">Websprout</div><div class="msg-body" id="introMsg">Building your site… one moment 🌱</div></div>
      </div>
      <div class="typing" id="tw"><div class="typing-bub"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>
      <div id="wsEdHost" class="ws-ed-host"></div>
      <!-- Image Library -->
      <div class="img-library collapsed" id="imgLibrary">
        <button class="img-lib-toggle" id="imgLibToggle" type="button">
          <span class="img-lib-label"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-image"/></svg>Add photos</span>
          <span class="img-lib-caret">▾</span>
        </button>
        <div class="img-lib-body" id="imgLibBody">
        <div class="img-lib-actions">
          <button class="img-upload-btn" id="imgUploadBtn">+ Add photo</button>
        </div>
        <!-- Mobile tap-to-upload (hidden on desktop) -->
        <div class="img-mobile-upload" id="imgMobileUpload" style="display:none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Tap to upload photo from gallery
        </div>
        <div class="img-dropzone empty" id="imgDropzone">
          📷 Drop photo here<br><span style="font-size:10px;opacity:.6">or use Add photo above</span>
        </div>
        <div class="img-grid" id="imgGrid" style="display:none"></div>
        <div class="img-actions" id="imgActions">
          <button class="img-action-btn" data-action="hero">🖼 Use as hero background</button>
          <button class="img-action-btn" data-action="about">👤 Use in about section</button>
          <button class="img-action-btn" data-action="section">📌 Add as section image</button>
          <button class="img-action-btn" data-action="cancel" style="color:rgba(255,255,255,.72)">✕ Cancel</button>
        </div>
        <input type="file" id="imgFileInput" aria-label="Upload an image" accept="image/*" multiple>
        </div>
      </div>

      <!-- Business Info Panel -->
      <div class="biz-panel">
        <div class="biz-panel-header" id="bizPanelHeader">
          <span class="biz-panel-title">&#128222; Your business info</span>
          <span class="biz-panel-toggle" id="bizPanelToggle">&#9660;</span>
        </div>
        <div class="biz-fields" id="bizFields">
          <div class="biz-field">
            <label>Business name</label>
            <input class="biz-input" id="bizInfoName" aria-label="Business name" placeholder="Acme Co.">
          </div>
          <div class="biz-field">
            <label>Email address</label>
            <input class="biz-input" id="bizInfoEmail" aria-label="Business email" type="email" placeholder="hello@yourbusiness.com">
          </div>
          <div class="biz-field">
            <label>Phone number</label>
            <input class="biz-input" id="bizInfoPhone" aria-label="Business phone" placeholder="(555) 123-4567">
          </div>
          <div class="biz-field">
            <label>Address</label>
            <input class="biz-input" id="bizInfoAddress" aria-label="Business address" placeholder="123 Main St, City, ST">
          </div>
          <div class="biz-field">
            <label>Booking link (Calendly, Cal.com, Square…)</label>
            <input class="biz-input" id="bizInfoBooking" aria-label="Booking link" placeholder="https://calendly.com/yourname">
            <span style="font-size:10px;color:rgba(255,255,255,.72);margin-top:2px;line-height:1.4">Paste your scheduler link — your "Book now" buttons will open it so visitors pick a real time slot</span>
          </div>
          <div class="biz-field">
            <label>Online ordering link (Toast, Square, DoorDash&hellip;)</label>
            <input class="biz-input" id="bizInfoOrdering" aria-label="Online ordering link" placeholder="https://order.toasttab.com/...">
            <span style="font-size:10px;color:rgba(255,255,255,.72);margin-top:2px;line-height:1.4">For food businesses — your "Order online" buttons open this. Leave blank and they jump to your menu instead.</span>
          </div>
          <div class="biz-field">
            <label>Business hours</label>
            <input class="biz-input" id="bizInfoHours" aria-label="Business hours" placeholder="Mon–Fri 9–5, Sat 10–2">
          </div>
          <div class="biz-field">
            <label>Form submissions go to</label>
            <input class="biz-input" id="bizInfoForm" aria-label="Contact form email" type="email" placeholder="you@email.com">
            <span style="font-size:10px;color:rgba(255,255,255,.72);margin-top:2px;line-height:1.4">Every contact-form submission on your published site is emailed here instantly and saved to your leads inbox. Leave blank to use your account email.</span>
          </div>
          <button class="biz-apply" id="bizApplyBtn">&#10003; Apply to site</button>
        </div>
      </div>

      <!-- Design tools drawer (colors + fonts, collapsed by default) -->
      <div class="design-drawer collapsed" id="designDrawer">
      <button class="dd-toggle" id="ddToggle" type="button">
        <span class="palette-label" style="margin-bottom:0"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-palette"/></svg>Colors &amp; fonts</span>
        <span class="dd-caret">&#9660;</span>
      </button>
      <div class="dd-body">
      <!-- Live Color Panel (palette now handled by the structured LOOK editor above) -->
      <div class="live-color-panel" style="display:none">
        <div class="palette-label">&#127912; Site colors</div>
        <div class="live-color-grid" id="liveColorPanel">
          <div style="font-size:11px;color:rgba(255,255,255,.72)">Generate a site first</div>
        </div>
      </div>

      <!-- Font Picker -->
      <div class="font-section">
        <div class="palette-label">🔤 Typography</div>
        <div class="font-grid">
          <button class="font-btn" data-font="modern" data-stack="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
            <span class="font-btn-name">Modern</span><span class="font-btn-sample">Clean & minimal</span>
          </button>
          <button class="font-btn" data-font="humanist" data-stack="Optima,Candara,Geneva,Calibri,sans-serif">
            <span class="font-btn-name">Humanist</span><span class="font-btn-sample">Warm & friendly</span>
          </button>
          <button class="font-btn" data-font="classic" data-stack="Georgia,'Times New Roman',Times,serif">
            <span class="font-btn-name">Classic</span><span class="font-btn-sample">Editorial serif</span>
          </button>
          <button class="font-btn" data-font="mono" data-stack="'Courier New',Courier,monospace">
            <span class="font-btn-name">Monospace</span><span class="font-btn-sample">Technical & bold</span>
          </button>
          <button class="font-btn" data-font="rounded" data-stack="'Trebuchet MS',Verdana,Geneva,sans-serif">
            <span class="font-btn-name">Rounded</span><span class="font-btn-sample">Playful & soft</span>
          </button>
          <button class="font-btn" data-font="elegant" data-stack="Palatino,'Palatino Linotype',Book Antiqua,Georgia,serif">
            <span class="font-btn-name">Elegant</span><span class="font-btn-sample">Luxury & refined</span>
          </button>
        </div>
      </div>

      <!-- Color palette picker (palette now handled by the structured LOOK editor above) -->
      <div class="palette-section" style="display:none">
        <div class="palette-label">Quick color palette</div>
        <div class="palette-grid">
          <button class="pal" style="background:#2563eb" data-palette="ocean blue" title="Ocean Blue"></button>
          <button class="pal" style="background:#7c3aed" data-palette="deep purple" title="Deep Purple"></button>
          <button class="pal" style="background:#dc2626" data-palette="bold red" title="Bold Red"></button>
          <button class="pal" style="background:#d97706" data-palette="warm amber" title="Warm Amber"></button>
          <button class="pal" style="background:#059669" data-palette="emerald green" title="Emerald Green"></button>
          <button class="pal" style="background:#db2777" data-palette="hot pink" title="Hot Pink"></button>
          <button class="pal" style="background:#0891b2" data-palette="teal cyan" title="Teal Cyan"></button>
          <button class="pal" style="background:#ea580c" data-palette="burnt orange" title="Burnt Orange"></button>
          <button class="pal" style="background:#4f46e5" data-palette="indigo" title="Indigo"></button>
          <button class="pal" style="background:#0f172a" data-palette="dark slate" title="Dark Slate"></button>
          <button class="pal" style="background:#be185d" data-palette="deep rose" title="Deep Rose"></button>
          <button class="pal" style="background:#1d4ed8" data-palette="royal blue" title="Royal Blue"></button>
        </div>
      </div>
      <!-- Global style controls -->
      <div class="style-section" id="styleSection">
        <div class="palette-label">&#10022; Style</div>
        <div class="ds-row"><span class="ds-label">Corners</span><div class="ds-seg" data-style="corners"><button type="button" data-v="sharp">Sharp</button><button type="button" data-v="default" class="on">Default</button><button type="button" data-v="rounded">Rounded</button></div></div>
        <div class="ds-row"><span class="ds-label">Text size</span><div class="ds-seg" data-style="text"><button type="button" data-v="small">Small</button><button type="button" data-v="default" class="on">Default</button><button type="button" data-v="large">Large</button></div></div>
        <div class="ds-row"><span class="ds-label">Buttons</span><div class="ds-seg" data-style="btn"><button type="button" data-v="default" class="on">Default</button><button type="button" data-v="pill">Pill</button></div></div>
        <div class="ds-row"><span class="ds-label">Mobile call bar</span><div class="ds-seg" id="callBarSeg"><button type="button" data-cb="off" class="on">Off</button><button type="button" data-cb="on">On</button></div></div>
      </div>
      </div>
      </div>
      <div id="edFirstHint" class="ed-hint" style="display:none">
        <span class="ed-hint-txt">Click <b>Edit text</b> to change any wording on the page. The <b>Editor</b> panel handles your theme, sections, pages, and <b>Manage</b> tools — your info, SEO, leads &amp; more.</span>
        <button class="ed-hint-x" id="edHintX" type="button" title="Got it">&times;</button>
      </div>
      <div class="quick-edits" style="display:none">
        <div class="qe-label"><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-zap"/></svg>Tap a quick change — or type your own below</div>
        <button class="qe" id="regenSectionBtn" title="Regenerate one section with fresh AI">↻ Redo a section</button>
        <div class="sec-pick" id="secPick">
          <button class="qe" data-sec="hero">Hero</button>
          <button class="qe" data-sec="navigation">Navigation</button>
          <button class="qe" data-sec="features">Features</button>
          <button class="qe" data-sec="about">About</button>
          <button class="qe" data-sec="reviews">Reviews</button>
          <button class="qe" data-sec="pricing">Pricing</button>
          <button class="qe" data-sec="contact">Contact</button>
          <button class="qe" data-sec="footer">Footer</button>
        </div>
        <button class="qe" data-msg="Make the color scheme darker and more premium">Darker</button>
        <button class="qe" data-msg="Make the hero section bigger and more dramatic">Bigger hero</button>
        <button class="qe" data-msg="Add an image gallery section showcasing the work">Add gallery</button>
        <button class="qe" data-msg="Change the accent color to deep blue">Blue theme</button>
        <button class="qe" data-msg="Make it more minimal with more whitespace">Minimal</button>
        <button class="qe" data-msg="Add a FAQ section with 5 relevant questions">Add FAQ</button>
        <button class="qe" data-msg="Add a pricing section with 3 tiers">Add pricing</button>
        <button class="qe" data-msg="Make the typography bigger and bolder">Bolder text</button>
      </div>
      <div class="chat-input" style="display:none">
        <div class="chat-row">
          <textarea class="chat-ta" id="ci" aria-label="Describe a change" placeholder="Describe a change — e.g. “make it blue” or “add a pricing section”" rows="1"></textarea>
          <button class="chat-send" id="csb" aria-label="Send message"><svg viewBox="0 0 24 24" fill="white" width="16" height="16" aria-hidden="true" focusable="false"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>
        </div>
        <div class="chat-hint">Press Enter to send · Shift+Enter for a new line</div>
      </div>
    </div>
  </div>
</div>

<!-- Deploy Modal -->
<div class="deploy-modal" id="deployModal">
  <div class="deploy-box">
    <div class="deploy-header">
      <div>
        <h2>🚀 Deploy your site</h2>
        <p>Get your site live in seconds — both are free forever.</p>
      </div>
    </div>
    <div class="deploy-tabs">
      <button class="d-tab active" id="dtab-netlify">🟢 Netlify</button>
      <button class="d-tab" id="dtab-cf">🟠 Cloudflare Pages</button>
    </div>

    <!-- Netlify Pane - Step by step wizard -->
    <div class="deploy-pane active" id="dpane-netlify">

      <!-- Step 1: Create account -->
      <div class="d-wizard-step" id="nstep1">
        <div class="d-step-badge">Step 1 of 3</div>
        <div class="d-step-title">Create a free Netlify account</div>
        <div class="d-step-desc">Netlify hosts your site for free forever. No credit card needed.</div>
        <a href="https://app.netlify.com/signup" target="_blank" class="d-btn d-btn-n" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">Open Netlify signup →</a>
        <div style="font-size:12px;color:#888;text-align:center;margin-bottom:16px">Already have an account? Skip ahead.</div>
        <button class="d-step-next" id="nstep1nextBtn">I have an account — Next →</button>
      </div>

      <!-- Step 2: Get token -->
      <div class="d-wizard-step" id="nstep2" style="display:none">
        <div class="d-step-badge">Step 2 of 3</div>
        <div class="d-step-title">Get your access token</div>
        <div class="d-step-desc">This lets Websprout deploy to your Netlify account. Takes 30 seconds.</div>
        <ol class="d-steps" style="margin-bottom:16px">
          <li class="d-step"><div class="d-step-n">1</div><div class="d-step-txt">Click the button below to open Netlify settings</div></li>
          <li class="d-step"><div class="d-step-n">2</div><div class="d-step-txt">Scroll to <strong>"Personal access tokens"</strong></div></li>
          <li class="d-step"><div class="d-step-n">3</div><div class="d-step-txt">Click <strong>"New access token"</strong>, name it "Websprout", click Generate</div></li>
          <li class="d-step"><div class="d-step-n">4</div><div class="d-step-txt">Copy the token and paste it below</div></li>
        </ol>
        <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" class="d-btn d-btn-n" style="display:block;text-align:center;text-decoration:none;margin-bottom:16px">Open Netlify → Personal access tokens</a>
        <div class="d-input-row">
          <div class="d-label">Paste your token here</div>
          <input class="d-input" id="netlifyToken" aria-label="Netlify access token" type="password" placeholder="netlify_pat_xxxxxxxx...">
          <div style="font-size:11px;color:#888;margin-top:4px">🔒 Saved on your device only. We never see or store it.</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="d-step-back" id="nstep2backBtn">← Back</button>
          <button class="d-step-next" id="step2nextBtn">Verify token →</button>
        </div>
        <div class="d-error" id="tokenError" style="margin-top:8px"></div>
      </div>

      <!-- Step 3: Name + Deploy -->
      <div class="d-wizard-step" id="nstep3" style="display:none">
        <div class="d-step-badge">Step 3 of 3</div>
        <div class="d-step-title">Name your site and deploy!</div>
        <div class="d-step-desc">Choose a name for your site URL, then hit deploy. You'll be live in ~10 seconds.</div>
        <div class="d-input-row">
          <div class="d-label">Site name <span style="font-weight:400;color:#888">(optional)</span></div>
          <input class="d-input" id="netlifySiteName" aria-label="Netlify site name" type="text" placeholder="my-coffee-shop">
          <div style="font-size:11px;color:#888;margin-top:4px">Your site will be at: <span id="sitePreviewUrl" style="color:#00c7b7">yoursite.netlify.app</span></div>
        </div>
        <button class="d-btn d-btn-n" id="netlifyDeployBtn" style="margin-top:12px">🚀 Deploy my site live!</button>
        <div class="d-result" id="netlifyResult" style="margin-top:12px">
          <div style="font-size:22px;text-align:center;margin-bottom:8px">🎉</div>
          <div class="d-result-url" style="text-align:center">Your site is live at:<br><a id="netlifyLiveUrl" href="#" target="_blank" style="font-size:15px;font-weight:700"></a></div>
          <div class="d-result-sub" style="text-align:center;margin-top:8px">Copy the link and share it! Add a custom domain anytime in your Netlify dashboard for free.</div>
        </div>
        <div class="d-error" id="netlifyError"></div>
        <button class="d-step-back" id="nstep3backBtn" style="margin-top:10px">← Back</button>
      </div>
    </div>

    <!-- Cloudflare Pages Pane -->
    <div class="deploy-pane" id="dpane-cf">
      <div class="d-provider-card">
        <div class="d-prov-head">
          <span class="d-prov-logo">🟠</span>
          <div><div class="d-prov-name">Cloudflare Pages</div><div class="d-prov-sub">Unlimited bandwidth, blazing fast CDN</div></div>
        </div>
        <ul class="d-features">
          <li>Unlimited free bandwidth</li>
          <li>300+ global locations</li>
          <li>Free HTTPS + custom domain</li>
          <li>Perfect for high-traffic sites</li>
        </ul>
        <ol class="d-steps">
          <li class="d-step"><div class="d-step-n">1</div><div class="d-step-txt"><strong>Download your site</strong>Click ⬇ Download in the studio header to save your HTML file.</div></li>
          <li class="d-step"><div class="d-step-n">2</div><div class="d-step-txt"><strong>Rename to index.html</strong>Rename the downloaded file from <code>websprout-site.html</code> to <code>index.html</code>.</div></li>
          <li class="d-step"><div class="d-step-n">3</div><div class="d-step-txt"><strong>Go to Cloudflare Pages</strong>Visit <a href="https://pages.cloudflare.com" target="_blank" style="color:#f6821f">pages.cloudflare.com</a>, sign up free, click Create project → Direct Upload.</div></li>
          <li class="d-step"><div class="d-step-n">4</div><div class="d-step-txt"><strong>Upload and deploy</strong>Name your project, drag in <code>index.html</code>, click Deploy. Done in 60 seconds.</div></li>
        </ol>
        <a href="https://pages.cloudflare.com" target="_blank" class="d-btn d-btn-cf" style="display:block;text-align:center;text-decoration:none;margin-top:16px">Open Cloudflare Pages →</a>
      </div>
      <a href="/deploy-guide" target="_blank" class="d-guide-link">📖 Read the full deploy guide</a>
    </div>

    <div style="text-align:right;padding:12px 24px 16px;border-top:1px solid #e5e7eb">
      <button id="deployModalClose" style="background:none;border:none;color:#888;font-size:14px;cursor:pointer">Close</button>
    </div>
  </div>
</div>

<!-- Image Slot Picker Modal -->
<div class="slot-modal" id="slotModal">
  <div class="slot-box">
    <div class="slot-header">
      <div>
        <h3 id="slotModalTitle">Add photo</h3>
        <div class="slot-header-sub">This will replace the placeholder in your site</div>
      </div>
      <button class="slot-close-x" id="slotModalClose" aria-label="Close">&#10005;</button>
    </div>
    <div class="slot-body">
      <div class="slot-ai" style="display:none">
        <div class="slot-ai-row">
          <input type="text" id="slotAiPrompt" aria-label="Describe an image" placeholder="Describe an image&hellip;" autocomplete="off">
          <button id="slotAiBtn">&#10024; Generate</button>
        </div>
        <div class="slot-ai-msg" id="slotAiMsg"></div>
      </div>
      <div class="slot-divider" style="display:none"><span>or upload your own</span></div>
      <div class="slot-search">
        <div class="slot-search-row"><input type="search" id="slotSearch" aria-label="Search free stock photos" placeholder="Search free photos, e.g. haircut, tacos, garden" autocomplete="off"><button id="slotSearchBtn" type="button">Search</button></div>
        <div class="slot-search-grid" id="slotSearchGrid"></div>
        <div class="slot-search-note" id="slotSearchNote">Free photos from Unsplash. The photographer is credited in your site footer.</div>
      </div>
      <div class="slot-divider"><span>or use your own</span></div>
      <div class="slot-drop" id="slotDrop">
        <span class="slot-drop-icon">&#128247;</span>
        <div class="slot-drop-text">Drop your photo here</div>
        <div class="slot-drop-sub">PNG, JPG up to 10MB &mdash; compressed automatically</div>
      </div>
      <div class="slot-divider"><span>or choose from your uploads</span></div>
      <div class="slot-lib-grid" id="slotLibGrid">
        <div class="slot-lib-empty" style="grid-column:1/-1">No photos uploaded yet</div>
      </div>
      <button class="slot-upload-btn" id="slotUploadBtn">&#128247; Choose from device</button>
      <input type="file" id="slotFileInput" aria-label="Upload an image" accept="image/*" style="display:none">
    </div>
  </div>
</div>

<!-- Edit Mode Indicator -->
<div class="edit-indicator" id="editIndicator">&#9998; Edit mode — click anything on your site to edit it</div>
<div id="wsCanvaBar" style="display:none;position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9000;background:#0f1a0d;border:1px solid rgba(45,122,58,.45);border-radius:14px;box-shadow:0 16px 50px rgba(0,0,0,.55);padding:8px 10px;align-items:center;gap:8px;max-width:94vw;overflow-x:auto">
  <span id="wsBarLabel" style="font-size:12px;font-weight:700;color:#7fe39a;white-space:nowrap;padding:0 4px 0 6px">Editing</span>
  <div id="wsBarActions" style="display:flex;gap:6px;align-items:center"></div>
</div>

<!-- Section Manager Modal -->
<div class="sec-modal" id="secModal">
  <div class="sec-box">
    <div class="sec-header">
      <div>
        <h3>&#9783; Section Manager</h3>
        <div class="sec-header-sub">Show/hide and reorder sections on your site</div>
      </div>
      <button class="sec-close-x" id="secClose" aria-label="Close">&#10005;</button>
    </div>
    <div class="sec-list" id="secList">
      <div style="font-size:13px;color:rgba(255,255,255,.72);text-align:center;padding:20px">Generate a site to manage its sections</div>
    </div>
    <div class="sec-footer">
      <button class="sec-refresh" id="secRefresh">&#8635; Refresh sections</button>
    </div>
  </div>
</div>

<!-- SEO Editor Modal -->
<div class="seo-modal" id="seoModal">
  <div class="seo-box">
    <div class="seo-header">
      <h3>🔍 SEO Settings</h3>
      <button class="seo-close" id="seoClose">✕</button>
    </div>
    <div class="seo-body">
      <div class="seo-field">
        <div class="seo-label">Page Title <span>Appears in browser tab and Google</span></div>
        <input class="seo-input" id="seoTitle" aria-label="Page title" type="text" placeholder="My Business — Home" maxlength="60">
      </div>
      <div class="seo-field">
        <div class="seo-label">Meta Description <span>Shown in Google search results</span></div>
        <textarea class="seo-input" id="seoDesc" aria-label="Meta description" rows="3" placeholder="A short description of your site (150-160 chars)" maxlength="160"></textarea>
      </div>
      <div class="seo-preview">
        <div class="seo-preview-title" id="seoPrevTitle">Your Page Title</div>
        <div class="seo-preview-url">websprout.app › your-site</div>
        <div class="seo-preview-desc" id="seoPrevDesc">Your meta description will appear here in Google results.</div>
      </div>
    </div>
    <div class="seo-footer">
      <button class="seo-close btn-back" id="seoCancelBtn" style="padding:9px 16px;border-radius:8px">Cancel</button>
      <button class="seo-save" id="seoSaveBtn">Apply to site →</button>
    </div>
  </div>
</div>

<!-- Share Preview Modal -->
<div class="share-modal" id="shareModal">
  <div class="share-box">
    <h3>🔗 Share your preview</h3>
    <p>Anyone with this link can view your site preview for 7 days — no account needed.</p>
    <div class="share-url-wrap">
      <input class="share-url" id="shareUrlInput" aria-label="Share link" readonly value="Generating link...">
      <button class="share-copy" id="shareCopyBtn">Copy</button>
    </div>
    <div class="share-note">Link expires in 7 days. They can view but not edit your site.</div>
    <button class="share-close-btn" id="shareCloseBtn">Close</button>
  </div>
</div>

<script>
(function(){
  var btn=document.getElementById('getSiteBtn'),menu=document.getElementById('getSiteMenu');
  if(btn&&menu){
    btn.addEventListener('click',function(e){e.stopPropagation();var show=menu.style.display==='none';menu.style.display=show?'block':'none';if(show){var hint=document.getElementById('getSiteHint');if(hint){var seen='';try{seen=localStorage.getItem('ws_getsite_hint');}catch(_){}hint.style.display=seen?'none':'block';}}});
    document.addEventListener('click',function(){menu.style.display='none';});
    menu.addEventListener('click',function(e){e.stopPropagation();});
    var gsx=document.getElementById('getSiteHintX');
    if(gsx)gsx.addEventListener('click',function(e){e.stopPropagation();try{localStorage.setItem('ws_getsite_hint','1');}catch(_){}var h=document.getElementById('getSiteHint');if(h)h.style.display='none';});
    var map={publish:'publishBtn',download:'dlBtn',copy:'copyBtn',deploy:'deployBtn',share:'shareBtn'};
    var items=menu.querySelectorAll('.gs-item');
    for(var i=0;i<items.length;i++){items[i].addEventListener('click',function(){var t=document.getElementById(map[this.getAttribute('data-act')]);if(t)t.click();menu.style.display='none';});}
  }
  var tbtn=document.getElementById('toolsBtn'),tmenu=document.getElementById('toolsMenu');
  if(tbtn&&tmenu){
    tbtn.addEventListener('click',function(e){e.stopPropagation();tmenu.style.display=tmenu.style.display==='none'?'block':'none';});
    document.addEventListener('click',function(){tmenu.style.display='none';});
    tmenu.addEventListener('click',function(e){e.stopPropagation();});
    var titems=tmenu.querySelectorAll('.gs-item');
    for(var k=0;k<titems.length;k++){titems[k].addEventListener('click',function(){var t=document.getElementById(this.getAttribute('data-tool'));if(t)t.click();tmenu.style.display='none';});}
  }
})();
</script>
<div id="supportModal" style="display:none;position:fixed;inset:0;z-index:10003;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:440px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128172; Contact support</div>
      <button id="supportClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:22px">
      <div style="font-size:13px;color:rgba(255,255,255,.72);margin-bottom:16px;line-height:1.5">Have a question or hit a snag? Send us a message and we&rsquo;ll get back to you by email.</div>
      <input id="supName" aria-label="Your name" type="text" placeholder="Your name (optional)" style="width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;margin-bottom:10px">
      <input id="supEmail" aria-label="Your email" type="email" placeholder="Your email (so we can reply)" autocomplete="email" style="width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;margin-bottom:10px">
      <textarea id="supMsg" aria-label="Your message" rows="4" placeholder="How can we help?" style="width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;resize:vertical;margin-bottom:10px"></textarea>
      <button id="supSend" style="width:100%;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit">Send message</button>
      <div id="supMsgOut" style="font-size:13px;min-height:18px;margin-top:10px;text-align:center"></div>
    </div>
  </div>
</div>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var m=$('supportModal');
  function openS(){if(!m)return;$('supMsgOut').textContent='';m.style.display='flex';var u=window._wsUser;if(u&&u.email&&$('supEmail')&&!$('supEmail').value)$('supEmail').value=u.email;}
  function closeS(){if(m)m.style.display='none';}
  window.openSupport=openS;
  if($('supportClose'))$('supportClose').addEventListener('click',closeS);
  if(m)m.addEventListener('click',function(e){if(e.target===m)closeS();});
  var lnk=$('supportLink');if(lnk)lnk.addEventListener('click',function(e){e.preventDefault();openS();});
  document.addEventListener('click',function(e){
    var a=(e.target&&e.target.closest)?e.target.closest('a'):null;if(!a)return;
    if(a.id==='howLink'||a.id==='pricingLink'){
      e.preventDefault();
      var t=document.getElementById(a.id==='howLink'?'how':'pricing');
      if(t){if(t.scrollIntoView)t.scrollIntoView({behavior:'smooth',block:'start'});else window.scrollTo(0,(t.getBoundingClientRect().top+(window.pageYOffset||0))-58);}
    }else if(a.id==='mySitesLink'){
      e.preventDefault();
      try{if(typeof window.openMySites==='function')window.openMySites();else if(window.toast)toast('Your sites are loading\\u2026');}catch(err){}
    }
  });
  try{var cs=document.querySelectorAll('a[href="mailto:support@websprout.app"]');for(var i=0;i<cs.length;i++){cs[i].addEventListener('click',function(e){e.preventDefault();openS();});}}catch(e){}
  var sb=$('supSend');
  if(sb)sb.addEventListener('click',function(){
    var email=($('supEmail').value||'').trim(),msg=($('supMsg').value||'').trim(),nm=($('supName').value||'').trim(),out=$('supMsgOut');
    if(!email||email.indexOf('@')<1){out.style.color='#fca5a5';out.textContent='Please enter your email so we can reply.';return;}
    if(msg.length<5){out.style.color='#fca5a5';out.textContent='Please write a short message.';return;}
    sb.disabled=true;sb.textContent='Sending\u2026';out.textContent='';
    fetch('/support',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nm,email:email,message:msg})}).then(function(r){return r.json();}).then(function(j){
      sb.disabled=false;sb.textContent='Send message';
      if(j&&j.ok){out.style.color='#7fe39a';out.textContent='\u2713 Message sent \u2014 we\u2019ll reply by email soon.';$('supMsg').value='';setTimeout(closeS,1800);}
      else{out.style.color='#fca5a5';out.textContent=(j&&j.error)||'Could not send \u2014 please try again.';}
    }).catch(function(){sb.disabled=false;sb.textContent='Send message';out.style.color='#fca5a5';out.textContent='Could not send \u2014 please try again.';});
  });
})();
</script>
<div id="authModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:400px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="display:flex;align-items:center;gap:9px"><div class="nav-logo-mark" style="width:26px;height:26px"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div><div style="font-size:17px;font-weight:800;color:#fff">Sign in to Websprout</div></div>
      <button id="authClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:22px">
      <div style="font-size:13px;color:rgba(255,255,255,.72);margin-bottom:16px;line-height:1.5">Sign in to save your sites to your account and open them from any device.</div>
      <a href="/auth/google" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;color:#1a1a1a;border-radius:10px;padding:12px;font-size:15px;font-weight:600;text-decoration:none">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-3.9 6.2-9.6 7.2-17.4z"/><path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7.3-5.7c-2 1.4-4.7 2.3-8 2.3-6.3 0-11.7-3.7-13.6-9.1l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/></svg>
        Continue with Google
      </a>
      <div style="display:flex;align-items:center;gap:10px;margin:18px 0;color:rgba(255,255,255,.72);font-size:12px"><div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>or<div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div></div>
      <input id="authEmail" aria-label="Email address" type="email" placeholder="you@email.com" autocomplete="email" style="width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;margin-bottom:10px">
      <button id="authEmailBtn" style="width:100%;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit">Email me a sign-in link</button>
      <div id="authMsg" style="font-size:13px;min-height:18px;margin-top:10px;text-align:center"></div>
    </div>
  </div>
</div>
<div id="profileModal" style="display:none;position:fixed;inset:0;z-index:10002;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:420px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">Settings</div>
      <button id="profileClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:22px">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
        <div id="pfAvatar" style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#2d9e4a,#1c6e32);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:800;flex-shrink:0">Y</div>
        <div style="min-width:0;flex:1">
          <div id="pfName" style="font-size:17px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">You</div>
          <div id="pfEmail" style="font-size:13px;color:rgba(255,255,255,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
        </div>
        <span id="pfPlanBadge" style="font-size:11px;font-weight:800;letter-spacing:.5px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.72);flex-shrink:0">FREE</span>
      </div>
      <div class="pf-tabs">
        <button class="pf-tab active" data-pane="paneAccount">Account</button>
        <button class="pf-tab" data-pane="panePlan">Plan</button>
        <button class="pf-tab" data-pane="panePrivacy">Privacy</button>
        <button class="pf-tab" data-pane="panePrefs">Display</button>
      </div>
      <div id="paneAccount" class="pf-pane active">
        <div class="set-h" style="margin-top:4px">Sign-in &amp; security</div>
        <div class="set-note">Websprout uses passwordless sign-in &mdash; your Google account or a one-time email link &mdash; so there&rsquo;s no password to set or change.</div>
        <a class="set-link" href="https://myaccount.google.com/security" target="_blank" rel="noopener">If you use Google, manage 2-step verification there &#8594;</a>
        <div style="height:16px"></div>
        <button id="pfMySites" style="width:100%;margin-bottom:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#eaf2e8;border-radius:10px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px">&#128194; My sites<span id="pfSitesCount" style="font-size:12px;color:rgba(255,255,255,.72);font-weight:500"></span></button>
        <button id="pfSignOut" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);border-radius:10px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Sign out</button>
      </div>
      <div id="panePlan" class="pf-pane">
        <div id="pfActions" style="margin-bottom:14px"></div>
        <div class="set-h">What Pro includes</div>
        <div class="set-note" style="margin-bottom:0">Remove the &ldquo;Made with Websprout&rdquo; badge, connect your own custom domain, download your full source code, and unlock multi-page sites and the built-in store. Start with a 7-day free trial, then $10/month. Cancel anytime.</div>
      </div>
      <div id="panePrivacy" class="pf-pane">
        <div class="set-h" style="margin-top:4px">Your data</div>
        <div class="set-note">Download everything Websprout stores about you, or permanently delete your account and all your sites and data.</div>
        <button id="pfExport" style="display:block;width:100%;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#eaf2e8;border-radius:10px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:8px">&#11015; Download my data</button>
        <button id="pfDeleteAcct" style="display:block;width:100%;text-align:center;background:rgba(220,60,60,.12);border:1px solid rgba(220,60,60,.42);color:#ff9b9b;border-radius:10px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">&#128465; Delete account &amp; all data</button>
        <div style="margin-top:14px;font-size:12.5px;color:rgba(255,255,255,.55);line-height:1.5">Read our <a href="/privacy" target="_blank" style="color:#7fe39a;text-decoration:none">Privacy Policy</a> and <a href="/accessibility" target="_blank" style="color:#7fe39a;text-decoration:none">Accessibility statement</a>.</div>
      </div>
      <div id="panePrefs" class="pf-pane">
        <div class="set-h" style="margin-top:4px">Display &amp; accessibility</div>
        <div class="set-row" id="rowMotion"><span class="set-lbl"><b>Reduce motion</b><em>Turn off animations and transitions</em></span><span class="set-tog" id="togMotion"></span></div>
        <div class="set-row" id="rowFocus"><span class="set-lbl"><b>Always show focus outlines</b><em>Clear keyboard focus rings</em></span><span class="set-tog" id="togFocus"></span></div>
      </div>
    </div>
  </div>
</div>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var pm=$('profileModal');
  function closePf(){if(pm)pm.style.display='none';}
  function goPro(){
    var link='${SUB_LINK}';
    if(!link||link.indexOf('PASTE_YOUR')>-1){if(window.toast)toast('Payments are not set up yet.',5000);return;}
    var email=(window._wsUser&&window._wsUser.email)||'';
    window.location.href=link+'?client_reference_id='+encodeURIComponent(email)+'&prefilled_email='+encodeURIComponent(email);
  }
  function openBilling(){
    var b=$('pfBilling'); if(b){b.disabled=true;b.textContent='Opening Stripe...';}
    fetch('/account/billing-portal',{method:'POST'}).then(function(r){return r.json();}).then(function(j){
      if(j&&j.url){window.location.href=j.url;}
      else{if(b){b.disabled=false;b.innerHTML='Manage billing &amp; cancel plan';}if(window.toast)toast((j&&j.error)||'Could not open billing right now.',5000);}
    }).catch(function(){if(b){b.disabled=false;b.innerHTML='Manage billing &amp; cancel plan';}if(window.toast)toast('Could not open billing right now.',5000);});
  }
  window.openProfile=function(){
    var me=window._wsUser||{};
    var nm=((me.name||'').trim())||(me.email?me.email.split('@')[0]:'You');
    if($('pfName'))$('pfName').textContent=nm;
    if($('pfEmail'))$('pfEmail').textContent=me.email||'';
    if($('pfAvatar'))$('pfAvatar').textContent=(nm||'Y').charAt(0).toUpperCase();
    var pro=!!me.pro, badge=$('pfPlanBadge');
    if(badge){
      badge.textContent=pro?'\u2726 PRO':'FREE';
      badge.style.background=pro?'linear-gradient(135deg,#f5c542,#2d9e4a)':'rgba(255,255,255,.1)';
      badge.style.color=pro?'#06120a':'rgba(255,255,255,.6)';
    }
    var act=$('pfActions');
    if(act){
      if(pro){
        act.innerHTML='<div style="background:rgba(45,158,74,.12);border:1px solid rgba(45,158,74,.3);border-radius:12px;padding:14px 16px;font-size:13px;color:rgba(255,255,255,.7);line-height:1.55">\u2713 <b style="color:#7fe39a">Pro is active.</b> You can download, deploy, and edit across all of your sites.</div><button id="pfBilling" style="width:100%;margin-top:10px;background:transparent;border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);border-radius:10px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Manage billing &amp; cancel plan</button><div style="font-size:11.5px;color:rgba(255,255,255,.5);text-align:center;margin-top:7px;line-height:1.45">Opens Stripe to update payment or cancel your subscription.</div>';
        var pb=$('pfBilling');if(pb)pb.addEventListener('click',openBilling);
      }else{
        act.innerHTML='<button id="pfGoPro" style="width:100%;background:linear-gradient(135deg,#2d9e4a,#1c6e32);color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(45,158,74,.35)">\u2726 Start free trial</button><div style="font-size:12px;color:rgba(255,255,255,.72);text-align:center;margin-top:9px;line-height:1.5">7 days free, then $10/mo. Cancel anytime.</div>';
        var gp=$('pfGoPro');if(gp)gp.addEventListener('click',goPro);
      }
      if(me&&me.owner){act.innerHTML+='<a href="/admin" style="display:block;text-align:center;margin-top:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#cfe;border-radius:10px;padding:11px;font-size:14px;font-weight:600;text-decoration:none">\uD83D\uDCCA Admin dashboard</a>';}
    }
    try{var _ps=JSON.parse(localStorage.getItem('ws_projects')||'[]');var _pc=$('pfSitesCount');if(_pc)_pc.textContent=_ps.length?('('+_ps.length+')'):'';}catch(e){}
    if(pm)pm.style.display='flex';
  };
  if($('profileClose'))$('profileClose').addEventListener('click',closePf);
  var _pft=document.querySelectorAll(".pf-tab");
  _pft.forEach(function(t){t.addEventListener("click",function(){_pft.forEach(function(x){x.classList.remove("active");});t.classList.add("active");document.querySelectorAll(".pf-pane").forEach(function(p){p.classList.remove("active");});var pane=$(t.getAttribute("data-pane"));if(pane)pane.classList.add("active");});});
  var _pfms=$('pfMySites');if(_pfms)_pfms.addEventListener('click',function(){closePf();if(window.openMySites)window.openMySites();else if(window.toast)toast('Loading your sites...');});
  if(pm)pm.addEventListener('click',function(e){if(e.target===pm)closePf();});
  var _pfe=$('pfExport');
  if(_pfe)_pfe.addEventListener('click',function(){
    if(window.toast)window.toast('Preparing your data...');
    fetch('/account/export').then(function(r){ if(!r.ok) throw 0; return r.blob(); }).then(function(b){ var u=URL.createObjectURL(b); var a=document.createElement('a'); a.href=u; a.download='websprout-my-data.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(u);},3000); if(window.toast)window.toast('Your data downloaded'); }).catch(function(){ if(window.toast)window.toast('Could not export your data'); });
  });
  var _pfd=$('pfDeleteAcct');
  if(_pfd)_pfd.addEventListener('click',async function(){
    var em=(window._wsUser&&window._wsUser.email)?window._wsUser.email:'your account';
    var __ok=await wsConfirm({title:'Permanently delete your account?',message:'This will delete '+em+' and ALL your sites, drafts, products and data. This cannot be undone.',okLabel:'Delete everything',cancelLabel:'Cancel',danger:true});if(!__ok) return;
    var typed=prompt('This is permanent and cannot be undone. Type DELETE to confirm.');
    if(typed!=='DELETE'){ if(window.toast)window.toast('Deletion cancelled'); return; }
    fetch('/account/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({confirm:'DELETE'})}).then(function(r){return r.json();}).then(function(j){ if(j&&j.ok){ try{localStorage.clear();}catch(e){} alert('Your account and all your data have been permanently deleted.'); location.href='/'; } else { if(window.toast)window.toast((j&&j.error)||'Could not delete account'); } }).catch(function(){ if(window.toast)window.toast('Could not delete account'); });
  });
  var so=$('pfSignOut');
  if(so)so.addEventListener('click',async function(){
    var __ok=await wsConfirm({title:'Sign out?',message:'You can sign back in anytime with the same email'+((window._wsUser&&window._wsUser.email)?(': '+window._wsUser.email):'')+'.',okLabel:'Sign out',cancelLabel:'Stay signed in'});if(__ok){
      try{if(window.wsClearSiteState)window.wsClearSiteState();}catch(e){}
      fetch('/auth/logout').then(function(){location.href='/';}).catch(function(){location.href='/';});
    }
  });
  function setTog(id,key,cls){
    var el=$(id);if(!el)return;
    var on=localStorage.getItem(key)==='1';
    el.classList.toggle('on',on);
    document.documentElement.classList.toggle(cls,on);
    var row=$('row'+id.slice(3));
    function flip(){on=!on;try{localStorage.setItem(key,on?'1':'0');}catch(e){}el.classList.toggle('on',on);document.documentElement.classList.toggle(cls,on);}
    el.addEventListener('click',flip);
    if(row)row.addEventListener('click',function(e){if(e.target!==el)flip();});
  }
  setTog('togMotion','ws_rm','ws-rm');
  setTog('togFocus','ws_focus','ws-focus');
})();
</script>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var modal=$('authModal');
  function openAuth(){if(modal){$('authMsg').textContent='';modal.style.display='flex';}}
  window.openAuth=openAuth;
  if($('authClose'))$('authClose').addEventListener('click',function(){modal.style.display='none';});
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  if($('authEmailBtn'))$('authEmailBtn').addEventListener('click',function(){
    var em=$('authEmail').value.trim(),msg=$('authMsg'),self=this;
    if(!em||em.indexOf('@')<1){msg.innerHTML='<span style="color:#f87171">Enter a valid email</span>';return;}
    self.disabled=true;self.textContent='Sending...';
    fetch('/auth/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em})}).then(function(r){return r.json();}).then(function(j){
      self.disabled=false;self.textContent='Email me a sign-in link';
      if(j.error){msg.innerHTML='<span style="color:#f87171">'+j.error+'</span>';}
      else{msg.innerHTML='<span style="color:#4ade80">Check your email for the sign-in link.</span>';}
    }).catch(function(){self.disabled=false;self.textContent='Email me a sign-in link';msg.innerHTML='<span style="color:#f87171">Could not send — try again</span>';});
  });
  function displayName(me){
    var n=(me&&me.name||'').trim();
    if(n)return n.split(' ')[0];
    var em=(me&&me.email||'').trim();
    if(em){var lp=em.split('@')[0].split(/[._+]/)[0];if(lp)return lp.charAt(0).toUpperCase()+lp.slice(1);}
    return 'there';
  }
  function applyAuthBtn(btn,me,prefix){
    if(!btn)return;
    if(me&&me.auth){var dn=displayName(me);btn.textContent='';var nmS=document.createElement('span');nmS.className='auth-name';nmS.textContent='Hello, '+dn;var avS=document.createElement('span');avS.className='auth-ava';avS.textContent=(dn?dn.charAt(0):'?').toUpperCase();btn.appendChild(nmS);btn.appendChild(avS);btn.title='Signed in as '+(me.email||'')+' — account menu';btn.onclick=function(ev){if(ev&&ev.stopPropagation)ev.stopPropagation();if(window.wsToggleAcctMenu)window.wsToggleAcctMenu(me);else if(window.openProfile)window.openProfile();};btn.classList.add('is-authed');}
    else{btn.textContent='';var nmG=document.createElement("span");nmG.className="auth-name";nmG.textContent=(prefix||"")+"Sign in";var avG=document.createElement("span");avG.className="auth-ava-guest";avG.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true"><path d="M12 12.2a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Zm0 1.6c-4.3 0-7.8 2.2-7.8 5v1.4h15.6V18.8c0-2.8-3.5-5-7.8-5Z"/></svg>';btn.appendChild(nmG);btn.appendChild(avG);btn.title="Sign in to save your sites to your account";btn.onclick=openAuth;btn.classList.remove("is-authed");}
  }
  function setAuthUI(me){
    window._wsUser=me;
    try{
      if(me&&me.auth&&me.email){
        var _own=localStorage.getItem('ws_owner');
        if(_own&&_own!==me.email){if(window.wsClearSiteState)window.wsClearSiteState();location.reload();return;}
        if(!_own&&localStorage.getItem('wsh'))localStorage.setItem('ws_owner',me.email);
      }
    }catch(e){}
    applyAuthBtn($('signInBtn'),me,'');
    applyAuthBtn($('acctBtn'),me,'\uD83D\uDC64 ');
    if(me&&me.pro){try{if(typeof unlocked!=='undefined')unlocked=true;if(typeof applyUnlock==='function')applyUnlock();}catch(e){}}
  }
  fetch('/me').then(function(r){return r.json();}).then(setAuthUI).catch(function(){});
  try{var P=new URLSearchParams(location.search);var lg=P.get('login');if(lg){history.replaceState(null,'',location.pathname);setTimeout(function(){if(window.toast){if(lg==='ok')toast('\u2713 Signed in!');else if(lg==='expired')toast('That link expired — please request a new one',6000);else if(lg==='error')toast('Sign-in failed — please try again',6000);}},400);}}catch(e){}
})();
</script>
<div id="yourInfoModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:460px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128221; Your business info</div>
      <button id="yiClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:20px 22px">
      <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:14px;line-height:1.5">Fill these in and we'll place them across your whole site at once — replacing the placeholder name, phone, email, address and hours everywhere they appear.</div>
      <label class="yi-l">Business name</label>
      <input id="yiBrand" aria-label="Business name" class="yi-i" type="text" placeholder="e.g. Coastal Marine Detailing" autocomplete="off">
      <label class="yi-l">Phone</label>
      <input id="yiPhone" aria-label="Phone" class="yi-i" type="text" placeholder="(555) 123-4567" autocomplete="off">
      <label class="yi-l">Email</label>
      <input id="yiEmail" aria-label="Email" class="yi-i" type="text" placeholder="hello@yourbusiness.com" autocomplete="off">
      <label class="yi-l">Address</label>
      <input id="yiAddr" aria-label="Address" class="yi-i" type="text" placeholder="123 Harbor Way, Your City" autocomplete="off">
      <label class="yi-l">Hours</label>
      <input id="yiHours" aria-label="Hours" class="yi-i" type="text" placeholder="Mon-Fri 9am-5pm" autocomplete="off">
      <div id="yiMsg" style="font-size:12px;min-height:16px;margin-top:10px"></div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button id="yiCancel" style="flex:1;background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
        <button id="yiApply" style="flex:2;background:#2d7a3a;color:#fff;border:none;border-radius:9px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Apply to my site</button>
      </div>
    </div>
  </div>
</div>
<style>.yi-l{display:block;font-size:12px;font-weight:600;color:rgba(255,255,255,.72);margin:12px 0 5px}.yi-i{width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:9px;color:#fff;padding:11px 13px;font-size:14px;outline:none;font-family:inherit}.yi-i:focus{border-color:rgba(45,122,58,.7)}</style>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var modal=$('yourInfoModal');if(!modal)return;
  var TOKENS={brand:'',phone:'[Your Phone]',email:'[your@email.com]',address:'[Your Address]',hours:'[Your Hours]'};
  function site(){return window._wsSite||localStorage.getItem('ws_site')||'';}
  function curHtml(){return (typeof window.gHTML==='string'&&window.gHTML)||localStorage.getItem('wsh')||'';}
  function stored(){try{return JSON.parse(localStorage.getItem('ws_info_'+site())||'{}');}catch(e){return {};}}
  function setStored(o){try{localStorage.setItem('ws_info_'+site(),JSON.stringify(o));}catch(e){}}
  function detectBrand(){
    try{var pf=$('pf');var d=pf&&(pf.contentDocument||pf.contentWindow.document);if(d){var bd=d.querySelector('[data-ws-field="brand"]');if(bd&&bd.textContent.trim())return bd.textContent.trim();}}catch(e){}
    var h=curHtml();var a=h.indexOf('<title>'),b=h.indexOf('</title>');if(a>-1&&b>a){var t=h.slice(a+7,b);return t.split('|')[0].split(' - ')[0].split(' \u2013 ')[0].trim();}
    return '';
  }
  function openYI(){
    if(window._wsSiteData&&window.wsOpenEditor){window.wsPanelTab='site';window._wsOpenBiz=true;try{document.getElementById('studio').classList.remove('panel-off');}catch(e){}try{var sb=document.querySelector('.s-body');if(sb&&window.innerWidth<=860)sb.classList.add('mob-chat');}catch(e){}window.wsOpenEditor();setTimeout(function(){var d=document.getElementById('wseBizInfo');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);return;}
    var s=stored();
    $('yiBrand').value=s.brand||detectBrand()||'';
    $('yiPhone').value=s.phone||'';$('yiEmail').value=s.email||'';$('yiAddr').value=s.address||'';$('yiHours').value=s.hours||'';
    $('yiMsg').textContent='';modal.style.display='flex';
  }
  window.openYourInfo=openYI;
  var yb=$('yourInfoBtn');if(yb)yb.addEventListener('click',openYI);
  $('yiClose').addEventListener('click',function(){modal.style.display='none';});
  $('yiCancel').addEventListener('click',function(){modal.style.display='none';});
  modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  function replaceAll(h,oldV,newV){if(!oldV||oldV===newV)return h;return h.split(oldV).join(newV);}
  $('yiApply').addEventListener('click',function(){
    var h=curHtml();if(!h){return;}
    var s=stored(),changed=0;
    var fields=[['brand',$('yiBrand').value.trim()],['phone',$('yiPhone').value.trim()],['email',$('yiEmail').value.trim()],['address',$('yiAddr').value.trim()],['hours',$('yiHours').value.trim()]];
    for(var i=0;i<fields.length;i++){
      var f=fields[i][0],nv=fields[i][1];if(!nv)continue;
      var ov=(f==='brand')?(s.brand||detectBrand()):(s[f]||TOKENS[f]);
      if(!ov)continue;
      var before=h;h=replaceAll(h,ov,nv);if(h!==before)changed++;
      s[f]=nv;
    }
    if(!changed){$('yiMsg').innerHTML='<span style="color:rgba(255,255,255,.72)">Nothing matched — those spots may already be filled. Use Edit text to change values that are already set.</span>';return;}
    setStored(s);window.gHTML=h;try{localStorage.setItem('wsh',h);}catch(e){}
    if(window.pushUndo)window.pushUndo(h);
    if(window.setPreview){window.setPreview(h);}else{sessionStorage.setItem('ws_studio','1');location.reload();return;}
    if(window.bumpEditCount)window.bumpEditCount();
    modal.style.display='none';
    if(window.toast)toast('\u2713 Your info added across the site!');
  });
})();
</script>
<div id="payModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0c160a;border:1px solid rgba(45,122,58,.3);border-radius:16px;max-width:560px;width:100%;max-height:88vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div><div style="font-size:17px;font-weight:800;color:#fff">&#128179; Product payments</div><div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:2px">Paste your own checkout link for each product &mdash; money goes straight to you</div></div>
      <button id="payClose" aria-label="Close" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1">&#10005;</button>
    </div>
    <div style="padding:14px 18px;overflow-y:auto">
      <div id="payList"></div>
      <button id="paySave" style="width:100%;margin-top:6px;background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;border:none;border-radius:9px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Save payment links</button>
      <div id="payMsg" style="font-size:12px;color:rgba(234,242,232,.5);margin-top:9px;min-height:13px"></div>
      <details style="margin-top:14px;border-top:1px solid rgba(255,255,255,.07);padding-top:12px">
        <summary style="cursor:pointer;font-size:13px;color:#7fe39a;font-weight:600;list-style:none">&#10067; How do I get a payment link?</summary>
        <div style="font-size:12.5px;color:rgba(234,242,232,.7);line-height:1.65;margin-top:10px">
          A payment link is a checkout page hosted by a payment provider. You create one per product on their site, copy the URL, and paste it above. The customer pays the provider, and the money lands in <b>your</b> account &mdash; Websprout never touches it.
          <div style="margin-top:10px"><b style="color:#eaf2e8">Stripe</b> &mdash; in your <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener" style="color:#7fe39a">Stripe dashboard</a>, open Payment Links, create one for the product, and copy it.</div>
          <div style="margin-top:8px"><b style="color:#eaf2e8">PayPal</b> &mdash; in <a href="https://www.paypal.com/" target="_blank" rel="noopener" style="color:#7fe39a">PayPal</a>, look under &ldquo;Pay &amp; Get Paid&rdquo; for payment links / buttons, create one, and copy the link.</div>
          <div style="margin-top:8px"><b style="color:#eaf2e8">Square</b> &mdash; in <a href="https://squareup.com/" target="_blank" rel="noopener" style="color:#7fe39a">Square</a>, use Online checkout to create a payment link, then copy it.</div>
          <div style="margin-top:8px"><b style="color:#eaf2e8">Gumroad</b> &mdash; on <a href="https://gumroad.com/" target="_blank" rel="noopener" style="color:#7fe39a">Gumroad</a>, create a product and copy its share URL.</div>
          <div style="margin-top:10px;color:rgba(234,242,232,.5)">Tip: most providers let you set &ldquo;buyer chooses the amount&rdquo; if you want one reusable link instead of one per price.</div>
        </div>
      </details>
    </div>
  </div>
</div>
<div id="invoiceModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0c160a;border:1px solid rgba(45,122,58,.3);border-radius:16px;max-width:520px;width:100%;max-height:88vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div><div style="font-size:17px;font-weight:800;color:#fff">&#129534; Send an invoice</div><div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:2px">Create a Stripe payment link and email it to your client</div></div>
      <button id="invClose" aria-label="Close" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1">&#10005;</button>
    </div>
    <div style="padding:14px 18px;overflow-y:auto">
      <div id="invConnect" style="display:none;text-align:center;padding:8px 4px 4px">
        <div style="font-size:13px;color:rgba(234,242,232,.7);line-height:1.6;margin-bottom:14px">To send invoices, connect your own Stripe account. Your clients pay <b>you</b> directly &mdash; Websprout never touches the money.</div>
        <a id="invConnectBtn" href="/connect/start" style="display:inline-block;background:linear-gradient(135deg,#635bff,#4b45c6);color:#fff;border-radius:9px;padding:12px 22px;font-size:14px;font-weight:700;text-decoration:none;font-family:inherit">Connect Stripe</a>
        <div style="font-size:11px;color:rgba(255,255,255,.72);margin-top:10px">Takes about a minute &mdash; you can come right back here after.</div>
      </div>
      <div id="invForm">
      <label style="font-size:12px;color:rgba(255,255,255,.72);display:block;margin-bottom:5px">Amount (USD)</label>
      <input id="invAmount" aria-label="Invoice amount" type="number" min="0.50" step="0.01" placeholder="150.00" style="width:100%;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:9px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none;margin-bottom:12px">
      <label style="font-size:12px;color:rgba(255,255,255,.72);display:block;margin-bottom:5px">What&#39;s it for?</label>
      <input id="invDesc" aria-label="Invoice description" type="text" placeholder="e.g. Logo design \u2014 final payment" style="width:100%;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:9px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none;margin-bottom:12px">
      <label style="font-size:12px;color:rgba(255,255,255,.72);display:block;margin-bottom:5px">Client email (optional \u2014 we&#39;ll email them the link)</label>
      <input id="invEmail" aria-label="Customer email" type="email" placeholder="client@example.com" style="width:100%;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:9px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none;margin-bottom:14px">
      <div id="invFeeNote" style="display:none;font-size:11.5px;color:rgba(234,242,232,.45);margin-bottom:12px;line-height:1.5"></div>
      <button id="invGen" style="width:100%;background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;border:none;border-radius:9px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Create payment link</button>
      <div id="invResultWrap" style="display:none;margin-top:14px">
        <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:5px">Payment link</div>
        <div style="display:flex;gap:7px"><input id="invResult" aria-label="Invoice link" readonly style="flex:1;min-width:0;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#7dd88f;border-radius:9px;padding:10px 12px;font-size:13px;font-family:inherit"><button id="invCopy" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap">Copy</button></div>
      </div>
      </div>
      <div id="invMsg" style="font-size:12px;color:rgba(234,242,232,.5);margin-top:10px;min-height:14px"></div>
    </div>
  </div>
</div>
<div id="postModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0c160a;border:1px solid rgba(45,122,58,.3);border-radius:16px;max-width:600px;width:100%;max-height:88vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div><div style="font-size:17px;font-weight:800;color:#fff">&#9997; Marketing copy</div><div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:2px">AI-written posts, emails &amp; promos from your site</div></div>
      <button id="postClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1">&#10005;</button>
    </div>
    <div style="padding:14px 18px;overflow-y:auto">
      <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:7px">What do you need?</div>
      <div id="postKinds" style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px">
        <button class="post-kind active" data-kind="social">Social post</button>
        <button class="post-kind" data-kind="promo">Promo</button>
        <button class="post-kind" data-kind="email">Email</button>
        <button class="post-kind" data-kind="blog">Blog post</button>
        <button class="post-kind" data-kind="sms">Text blast</button>
      </div>
      <input id="postTopic" aria-label="Post topic" type="text" placeholder="Optional: what's it about? (e.g. weekend special, new hours)" style="width:100%;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:9px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none;margin-bottom:12px">
      <button id="postGen" style="width:100%;background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;border:none;border-radius:9px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">&#10024; Write it</button>
      <div id="postResultWrap" style="display:none;margin-top:14px">
        <textarea id="postResult" aria-label="Generated post" style="width:100%;min-height:170px;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:9px;padding:12px 13px;font-size:14px;line-height:1.5;font-family:inherit;resize:vertical"></textarea>
        <button id="postCopy" style="margin-top:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">&#128203; Copy</button>
      </div>
      <div id="postMsg" style="font-size:12px;color:rgba(234,242,232,.5);margin-top:10px;min-height:14px"></div>
    </div>
  </div>
</div>
<div id="leadsModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0c160a;border:1px solid rgba(45,122,58,.3);border-radius:16px;max-width:620px;width:100%;max-height:85vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div><div style="font-size:17px;font-weight:800;color:#fff">&#128236; Leads</div><div id="leadsSub" style="font-size:12px;color:rgba(255,255,255,.72);margin-top:2px">Contact-form submissions from your site</div></div>
      <button id="leadsClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1">&#10005;</button>
    </div>
    <div style="padding:12px 18px;border-bottom:1px solid rgba(255,255,255,.06)">
      <label style="font-size:12px;color:rgba(255,255,255,.72);display:block;margin-bottom:6px">Email me when a new lead arrives</label>
      <div style="display:flex;gap:8px">
        <input id="leadsNotify" aria-label="Notification email" type="email" placeholder="you@email.com" style="flex:1;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:8px;padding:9px 11px;font-size:13px;font-family:inherit;outline:none">
        <button id="leadsNotifySave" style="background:rgba(45,158,74,.18);border:1px solid rgba(45,158,74,.4);color:#7fe39a;border-radius:8px;padding:0 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Save</button>
      </div>
    </div>
    <div id="leadsStats" style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.06);display:none">
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <div style="flex:1;background:#0f1a0d;border:1px solid rgba(45,122,58,.25);border-radius:10px;padding:10px 12px"><div id="stViews" style="font-size:22px;font-weight:800;color:#fff;line-height:1">0</div><div style="font-size:11px;color:rgba(255,255,255,.72);margin-top:3px">Total views</div></div>
        <div style="flex:1;background:#0f1a0d;border:1px solid rgba(45,122,58,.25);border-radius:10px;padding:10px 12px"><div id="stWeek" style="font-size:22px;font-weight:800;color:#fff;line-height:1">0</div><div style="font-size:11px;color:rgba(255,255,255,.72);margin-top:3px">This week</div></div>
        <div style="flex:1;background:#0f1a0d;border:1px solid rgba(45,122,58,.25);border-radius:10px;padding:10px 12px"><div id="stLeads" style="font-size:22px;font-weight:800;color:#7fe39a;line-height:1">0</div><div style="font-size:11px;color:rgba(255,255,255,.72);margin-top:3px">Leads</div></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px"><div style="font-size:11px;color:rgba(255,255,255,.72)">Last 7 days</div><div id="stToday" style="font-size:11px;color:rgba(255,255,255,.72)"></div></div>
      <div id="stSpark" style="display:flex;align-items:flex-end;gap:5px"></div>
    </div>
    <div id="leadsList" style="padding:14px 18px 20px;overflow-y:auto;flex:1"></div>
  </div>
</div>
<div id="mySitesModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128194; My sites</div>
      <button id="msClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div id="msList" style="padding:14px 18px 22px"></div>
  </div>
</div>
<div id="statsModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:480px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128202; Site analytics</div>
      <button id="statsClose" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div id="statsBody" style="padding:18px 20px 22px"></div>
  </div>
</div>
<script>
(function(){
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function sSite(){return window._wsSite||lsGet('ws_site')||'';}
  function sKey(){return window._wsKey||lsGet('ws_key')||'';}
  var modal=document.getElementById('statsModal'), body=document.getElementById('statsBody');
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function dow(ymd){ try{ var y=+ymd.slice(0,4),m=+ymd.slice(4,6)-1,d=+ymd.slice(6,8); return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(y,m,d).getDay()]; }catch(e){return '';} }
  function statCard(num,label,accent){ return '<div style="flex:1;min-width:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 10px;text-align:center"><div style="font-size:26px;font-weight:800;color:'+(accent||'#fff')+';line-height:1">'+num+'</div><div style="font-size:11px;color:rgba(255,255,255,.72);margin-top:5px">'+label+'</div></div>'; }
  function chart(days){
    if(!days||!days.length) return '';
    var max=1; for(var i=0;i<days.length;i++){ if((days[i].c||0)>max)max=days[i].c; }
    var bars='',labels='';
    for(var j=0;j<days.length;j++){
      var c=days[j].c||0; var h=Math.round((c/max)*60); if(c>0&&h<4)h=4;
      bars+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><div style="font-size:10px;color:rgba(255,255,255,.72);margin-bottom:3px;height:12px">'+(c||'')+'</div><div style="width:62%;height:'+h+'px;background:linear-gradient(180deg,#5fe08a,#2d7a3a);border-radius:4px 4px 2px 2px"></div></div>';
      labels+='<div style="flex:1;text-align:center;font-size:9px;color:rgba(255,255,255,.72)">'+dow(days[j].d)+'</div>';
    }
    return '<div style="margin-top:18px"><div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.72);margin-bottom:12px">Views \u2014 last 7 days</div><div style="display:flex;align-items:flex-end;gap:6px;height:84px">'+bars+'</div><div style="display:flex;gap:6px;margin-top:6px">'+labels+'</div></div>';
  }
  function open(){
    if(!modal)return;
    var sid=sSite(), k=sKey();
    body.innerHTML='<div style="text-align:center;color:rgba(255,255,255,.72);padding:40px 10px">Loading your numbers\u2026</div>';
    modal.style.display='flex';
    if(!sid){ body.innerHTML='<div style="text-align:center;color:rgba(255,255,255,.72);padding:40px 10px;line-height:1.6">Create or open a site first to see its analytics.</div>'; return; }
    var slug=lsGet('ws_slug_'+sid)||'';
    var stats={total:0,week:0,today:0,leads:0,days:[],reviews:0,pending:0,live:!!slug,slug:slug};
    var done=0, need=2;
    function paint(){
      var liveLine = stats.live
        ? '<div style="display:inline-flex;align-items:center;gap:7px;background:rgba(61,186,82,.14);border:1px solid rgba(61,186,82,.4);border-radius:8px;padding:6px 12px;font-size:12px;color:#7fe39a;font-weight:600">\u25CF Live at '+esc(stats.slug)+'.websprout.app</div>'
        : '<div style="display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px 12px;font-size:12px;color:rgba(255,255,255,.72);font-weight:600">Not published yet</div>';
      var revLabel = stats.pending>0 ? ('Reviews <span style="color:#f5a623">('+stats.pending+' to approve)</span>') : 'Reviews';
      var h = liveLine
        + '<div style="display:flex;gap:8px;margin-top:16px">' + statCard(stats.total,'Total views','#fff') + statCard(stats.week,'This week','#5fe08a') + '</div>'
        + '<div style="display:flex;gap:8px;margin-top:8px">' + statCard(stats.leads,'Leads','#fff') + statCard(stats.reviews,revLabel,'#fff') + '</div>'
        + chart(stats.days);
      h += '<div style="display:flex;gap:8px;margin-top:18px">'
        + '<a href="/inbox?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(k)+'" target="_blank" rel="noopener" style="flex:1;text-align:center;background:rgba(255,255,255,.05);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px;font-size:12px;font-weight:600;text-decoration:none">View leads \u2192</a>'
        + '<a href="/reviews?site='+encodeURIComponent(sid)+'" target="_blank" rel="noopener" style="flex:1;text-align:center;background:rgba(255,255,255,.05);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px;font-size:12px;font-weight:600;text-decoration:none">Manage reviews \u2192</a>'
        + '</div>';
      if(!stats.total && !stats.leads){ h += '<div style="text-align:center;color:rgba(255,255,255,.72);font-size:12px;margin-top:16px;line-height:1.6">'+(stats.live?'No visits yet. Share your link to start getting traffic!':'Publish your site to start tracking views.')+'</div>'; }
      body.innerHTML=h;
    }
    function tick(){ done++; if(done>=need) paint(); }
    fetch('/api/inbox?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(k)).then(function(r){return r.json();}).then(function(j){
      if(j){ stats.total=j.total||0; stats.week=j.week||0; stats.today=j.today||0; stats.leads=(typeof j.count==='number'?j.count:0); stats.days=j.days||[]; }
    }).catch(function(){}).then(tick);
    fetch('/api/reviews/manage?site='+encodeURIComponent(sid)).then(function(r){return r.json();}).then(function(j){
      if(j&&j.reviews){ stats.reviews=j.reviews.length; stats.pending=j.reviews.filter(function(x){return x.status==='pending';}).length; }
    }).catch(function(){}).then(tick);
  }
  var sb=document.getElementById('statsBtn'); if(sb)sb.addEventListener('click',open);
  var sc=document.getElementById('statsClose'); if(sc)sc.addEventListener('click',function(){modal.style.display='none';});
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
})();
</script>
<script>
(function(){
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function site(){return window._wsSite||lsGet('ws_site')||'';}
  function key(){return window._wsKey||lsGet('ws_key')||'';}
  function curHtml(){var L=window._wsLiveHtml;return (typeof L==='string'&&L.length>100?L:(lsGet('wsh')||''))||'';}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function nameFrom(h){var a=h.indexOf('<title>'),b=h.indexOf('</title>');var n=(a>-1&&b>-1)?h.slice(a+7,b):'';n=n.replace(/\\s*\\|.*$/,'').trim();return n.slice(0,60)||'My site';}
  function getProjects(){try{return JSON.parse(lsGet('ws_projects')||'[]');}catch(e){return [];}}
  function setProjects(p){try{localStorage.setItem('ws_projects',JSON.stringify(p.slice(0,40)));}catch(e){}}
  function mergeServer(serverSites){
    if(!serverSites||!serverSites.length)return;
    var local=getProjects(),map={};
    local.forEach(function(p){map[p.siteId]=p;});
    serverSites.forEach(function(s){
      var ex=map[s.siteId];
      if(!ex||(s.ts||0)>(ex.ts||0))map[s.siteId]={siteId:s.siteId,key:s.key||(ex&&ex.key)||'',name:s.name||(ex&&ex.name)||'My site',ts:s.ts||Date.now()};
      else if(ex&&!ex.key&&s.key)ex.key=s.key;
    });
    var merged=Object.keys(map).map(function(k){return map[k];});
    merged.sort(function(a,b){return (b.ts||0)-(a.ts||0);});
    setProjects(merged);
  }
  function modalOpen(){return modal&&modal.style.display==='flex';}
  function accountSync(){
    fetch('/my-sites').then(function(r){return r.json();}).then(function(j){
      if(!j||!j.auth)return;
      var local=getProjects().filter(function(p){return p.key;});
      if(local.length){
        fetch('/my-sites/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sites:local})}).then(function(r){return r.json();}).then(function(){
          fetch('/my-sites').then(function(r){return r.json();}).then(function(j2){if(j2&&j2.sites){mergeServer(j2.sites);if(modalOpen())render();}});
        }).catch(function(){mergeServer(j.sites);if(modalOpen())render();});
      }else{mergeServer(j.sites);if(modalOpen())render();}
    }).catch(function(){});
  }
  function upsert(sid,k,nm){var p=getProjects(),f=null;for(var i=0;i<p.length;i++){if(p[i].siteId===sid){f=p[i];break;}}if(f){f.name=nm;f.key=k||f.key;f.ts=Date.now();}else{p.push({siteId:sid,key:k,name:nm,ts:Date.now()});}p.sort(function(a,b){return b.ts-a.ts;});setProjects(p);}
  var lastSite='',lastHtml='';
  function _wsSaveData(h){var mp=false;try{mp=!!(window._wsPages&&window._wsPages.length>1);}catch(e){}if(!mp)return {html:h,pages:undefined};try{if(window.wsSyncPages)window.wsSyncPages();}catch(e){}var home=(window._wsPages[0]&&window._wsPages[0].html)||h;var pgs=window._wsPages.map(function(p){return{path:p.path,title:p.title,html:p.html};});return {html:home,pages:pgs};}
  function tick(){
    if(window._wsSaveReady===false)return;
    var s=site(),k=key(),h=curHtml();
    if(!s||!h||h.length<100)return;
    if(s===lastSite&&h===lastHtml)return;
    lastSite=s;lastHtml=h;var nm=nameFrom(h);upsert(s,k,nm);
    var _ss=document.getElementById('saveStatus');
    if(_ss){_ss.textContent='Saving\u2026';_ss.style.color='rgba(255,255,255,.55)';_ss.style.opacity='1';}
    var _sd=_wsSaveData(h);fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:s,key:k,html:_sd.html,name:nm,pages:_sd.pages,site:window._wsSiteData||undefined})}).then(function(r){
      if(!r.ok)throw new Error('save '+r.status);
      try{sessionStorage.removeItem('ws_freshgen');}catch(_fg){}  // confirmed on the server now
      if(_ss){_ss.textContent='Saved \u2713';_ss.style.color='rgba(127,227,154,.9)';_ss.style.opacity='1';setTimeout(function(){if(_ss&&_ss.textContent.indexOf('Saved')===0)_ss.style.opacity='.45';},1500);}
    }).catch(function(){
      lastHtml='';                 // failed — clear dedup so the next heartbeat/interval retries
      if(_ss){_ss.textContent='Not saved \u2014 retrying';_ss.style.color='rgba(240,170,90,.95)';_ss.style.opacity='1';}
    });
  }
  setInterval(tick,12000);setTimeout(tick,4000);window._wsTrackNow=tick;
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')tick();});
  function _wsBeacon(){if(window._wsSaveReady===false)return;try{var s=site(),k=key(),h=curHtml();if(!s||!h||h.length<100)return;var nm=nameFrom(h);var _sd=_wsSaveData(h);var payload=JSON.stringify({siteId:s,key:k,html:_sd.html,name:nm,pages:_sd.pages,site:window._wsSiteData||undefined});if(navigator.sendBeacon){var blob=new Blob([payload],{type:'application/json'});if(navigator.sendBeacon('/save',blob)){lastSite=s;lastHtml=h;upsert(s,k,nm);return;}}try{fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true});lastSite=s;lastHtml=h;upsert(s,k,nm);}catch(e){}}catch(e){}}
  window.addEventListener('pagehide',_wsBeacon);window.addEventListener('beforeunload',_wsBeacon);
  var modal=document.getElementById('mySitesModal'),listEl=document.getElementById('msList');
  function fmt(ts){try{return new Date(ts).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}catch(e){return '';}}
  function render(){
    var p=getProjects();
    if(!p.length){listEl.innerHTML='<div style="text-align:center;color:rgba(255,255,255,.72);padding:40px 10px;line-height:1.6">No saved sites yet.<br>Sites you create are saved here automatically so you can come back and edit them.</div>';return;}
    var h='';
    for(var i=0;i<p.length;i++){var it=p[i];
      var _live=false;try{_live=!!localStorage.getItem('ws_slug_'+it.siteId);}catch(e){}
      var _badge=_live?'<span id="msb_'+esc(it.siteId)+'" style="flex-shrink:0;font-size:10px;font-weight:800;color:#4ade80;background:rgba(61,186,82,.16);border:1px solid rgba(61,186,82,.42);border-radius:5px;padding:1px 7px;letter-spacing:.4px">\u25CF LIVE</span>':'<span id="msb_'+esc(it.siteId)+'" style="flex-shrink:0;font-size:10px;font-weight:700;color:rgba(255,255,255,.72);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:5px;padding:1px 7px">In progress</span>';
      h+='<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:10px">'
       +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:7px;min-width:0"><span style="color:#fff;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.name)+'</span>'+_badge+'</div><div style="color:rgba(255,255,255,.72);font-size:12px">Saved '+fmt(it.ts)+' <span id="msv_'+esc(it.siteId)+'" style="color:rgba(255,255,255,.72)"></span></div></div>'
       +'<button class="ms-edit" data-sid="'+esc(it.siteId)+'" style="background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Edit</button>'
       +'<button class="ms-del" data-sid="'+esc(it.siteId)+'" title="Remove from list" style="background:none;border:none;color:rgba(255,255,255,.72);font-size:18px;cursor:pointer;line-height:1">&times;</button>'
       +'</div>';
    }
    listEl.innerHTML=h;
    var eds=listEl.querySelectorAll('.ms-edit');for(var j=0;j<eds.length;j++){eds[j].addEventListener('click',function(){openProject(this.getAttribute('data-sid'),this);});}
    var dls=listEl.querySelectorAll('.ms-del');for(var m=0;m<dls.length;m++){dls[m].addEventListener('click',async function(){
      var sid=this.getAttribute('data-sid');
      var nm='this site',pkey='';try{var pp=getProjects();for(var z=0;z<pp.length;z++){if(pp[z].siteId===sid){nm=pp[z].name||nm;pkey=pp[z].key||'';break;}}}catch(e){}
      var slug='';try{slug=localStorage.getItem('ws_slug_'+sid)||'';}catch(e){}
      if(slug){
        var typed=prompt('\u26A0\uFE0F \u201C'+nm+'\u201D is LIVE at '+slug+'.websprout.app \u2014 deleting is permanent and takes it offline. To confirm, type the site name exactly:');
        if(typed===null)return;
        if((typed||'').trim().toLowerCase()!==(nm||'').trim().toLowerCase()){alert('That did not match \u2014 your site was NOT deleted.');return;}
        try{fetch('/unpublish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:slug,siteId:sid,key:pkey})}).catch(function(){});localStorage.removeItem('ws_slug_'+sid);}catch(e){}
      } else {
        var __ok=await wsConfirm({title:'Remove this site?',message:'Remove \u201C'+nm+'\u201D from your sites? You can rebuild it anytime.',okLabel:'Remove',cancelLabel:'Keep',danger:true});if(!__ok)return;
      }
      setProjects(getProjects().filter(function(x){return x.siteId!==sid;}));
      fetch('/my-sites/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:sid})}).catch(function(){});
      render();
    });}
    for(var v=0;v<p.length;v++){(function(it){fetch('/api/views?site='+encodeURIComponent(it.siteId)+'&key='+encodeURIComponent(it.key||'')).then(function(r){return r.json();}).then(function(j){var el=document.getElementById('msv_'+it.siteId);if(el&&j&&typeof j.total==='number'&&j.total>0)el.textContent='· '+j.total+' view'+(j.total===1?'':'s')+(j.week?(' ('+j.week+' this week)'):'');
      if(j&&typeof j.live==='boolean'){
        try{ if(j.live&&j.slug){localStorage.setItem('ws_slug_'+it.siteId,j.slug);}else{localStorage.removeItem('ws_slug_'+it.siteId);} }catch(e){}
        var bg=document.getElementById('msb_'+it.siteId);
        if(bg){ if(j.live){bg.style.cssText='flex-shrink:0;font-size:10px;font-weight:800;color:#4ade80;background:rgba(61,186,82,.16);border:1px solid rgba(61,186,82,.42);border-radius:5px;padding:1px 7px;letter-spacing:.4px';bg.textContent='\u25CF LIVE';} else {bg.style.cssText='flex-shrink:0;font-size:10px;font-weight:700;color:rgba(255,255,255,.72);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:5px;padding:1px 7px';bg.textContent='In progress';} }
      }
    }).catch(function(){});})(p[v]);}
  }
  function openProject(sid,b){
    var p=getProjects(),it=null;for(var i=0;i<p.length;i++){if(p[i].siteId===sid){it=p[i];break;}}
    if(!it)return;if(b)b.textContent='Loading...';
    fetch('/load?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(it.key||'')).then(function(r){return r.json();}).then(function(j){
      if(j.error||!j.html){if(b)b.textContent='Edit';alert('Could not load this site. It may have expired.');return;}
      try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',sid);localStorage.setItem('ws_key',it.key||'');sessionStorage.setItem('ws_studio','1');if(j.site&&j.site.sections)localStorage.setItem('ws_sd',JSON.stringify(j.site));else localStorage.removeItem('ws_sd');}catch(e){}
      window._wsSite=sid;window._wsKey=it.key||'';location.href='/';
    }).catch(function(){if(b)b.textContent='Edit';alert('Could not load this site.');});
  }
  window.openMySites=function(){render();modal.style.display='flex';accountSync();};
  var msBtn=document.getElementById('mySitesBtn');if(msBtn)msBtn.addEventListener('click',window.openMySites);
  if(document.getElementById('msClose'))document.getElementById('msClose').addEventListener('click',function(){modal.style.display='none';});
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  try{
    var Q=new URLSearchParams(location.search);
    if(Q.get('site')&&Q.get('key')){
      var dsid=Q.get('site'),dk=Q.get('key');
      fetch('/load?site='+encodeURIComponent(dsid)+'&key='+encodeURIComponent(dk)).then(function(r){return r.json();}).then(function(j){
        if(j&&j.html){try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',dsid);localStorage.setItem('ws_key',dk);sessionStorage.setItem('ws_studio','1');if(j.site&&j.site.sections)localStorage.setItem('ws_sd',JSON.stringify(j.site));else localStorage.removeItem('ws_sd');}catch(e){}window._wsSite=dsid;window._wsKey=dk;history.replaceState(null,'',location.pathname);location.reload();}
      }).catch(function(){});
    }
  }catch(e){}
  setTimeout(accountSync,1600);
})();
</script>
