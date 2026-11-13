// ── Main HTML page ────────────────────────────────────────────
const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Websprout: Build a Professional Website in Seconds, Free</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<meta name="description" content="Websprout turns your business details into a complete, professional website instantly — no prompts, no waiting. Build and publish live for free. Try Pro free for 7 days to remove the badge, connect your own domain, and download the code. Then $10/month, cancel anytime.">
<link rel="canonical" href="https://websprout.app/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="keywords" content="website builder, free website builder, small business website, instant website, no-code website, website maker, make a website, local business website">
<meta name="author" content="Websprout">
<meta name="theme-color" content="#060d05">
<meta name="ws-build" content="2026-11-13-r322">
<script src="/ws-engine.js" defer></script>
<script>window._wsBuild="2026-11-13-r322";console.log("%c[Websprout] build 2026-11-13-r322 — fully no-AI: deterministic creation + structured visual editor (fields, sections, palette); Gemini generation and chat editing removed","color:#4ade80;font-weight:700")</script>
<style id="wsCfmStyle">.wsCfm-back{position:fixed;inset:0;background:rgba(6,13,5,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:2147483647;opacity:0;transition:opacity .16s ease;padding:22px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.wsCfm-back.on{opacity:1}.wsCfm-box{background:#0f1a0d;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 24px 64px rgba(0,0,0,.5);padding:24px;max-width:420px;width:100%;color:#eaf2e8;transform:translateY(6px) scale(.985);transition:transform .16s ease}.wsCfm-back.on .wsCfm-box{transform:translateY(0) scale(1)}.wsCfm-title{font-size:17px;font-weight:800;letter-spacing:-.3px;color:#fff;margin:0 0 8px}.wsCfm-msg{font-size:14px;color:rgba(255,255,255,.72);line-height:1.6;margin:0 0 20px}.wsCfm-actions{display:flex;gap:10px;justify-content:flex-end}.wsCfm-btn{border:1px solid rgba(255,255,255,.14);background:transparent;color:#eaf2e8;font-weight:700;font-size:14px;padding:10px 18px;border-radius:10px;cursor:pointer;font-family:inherit}.wsCfm-btn:hover{background:rgba(255,255,255,.06)}.wsCfm-btn.primary{background:#2d7a3a;border-color:#2d7a3a;color:#fff}.wsCfm-btn.primary:hover{background:#3ea04e}.wsCfm-btn.danger{background:#c9372c;border-color:#c9372c;color:#fff}.wsCfm-btn.danger:hover{background:#dc4b3f}</style>
<script>
window.wsConfirm=function(opts){
  return new Promise(function(resolve){
    opts=opts||{};
    var title=opts.title||"Are you sure?";
    var message=opts.message||"";
    var okLabel=opts.okLabel||"Confirm";
    var cancelLabel=opts.cancelLabel||"Cancel";
    var danger=!!opts.danger;
    var back=document.createElement("div"); back.className="wsCfm-back"; back.setAttribute("role","dialog"); back.setAttribute("aria-modal","true"); back.setAttribute("aria-labelledby","wsCfmT");
    var box=document.createElement("div"); box.className="wsCfm-box";
    var h=document.createElement("div"); h.className="wsCfm-title"; h.id="wsCfmT"; h.textContent=title;
    var p=document.createElement("div"); p.className="wsCfm-msg"; p.textContent=message;
    var row=document.createElement("div"); row.className="wsCfm-actions";
    var c=document.createElement("button"); c.type="button"; c.className="wsCfm-btn"; c.textContent=cancelLabel;
    var k=document.createElement("button"); k.type="button"; k.className="wsCfm-btn "+(danger?"danger":"primary"); k.textContent=okLabel;
    row.appendChild(c); row.appendChild(k); box.appendChild(h); box.appendChild(p); box.appendChild(row); back.appendChild(box); document.body.appendChild(back);
    var prev=document.activeElement;
    requestAnimationFrame(function(){ back.classList.add("on"); k.focus(); });
    function close(ans){
      back.classList.remove("on");
      setTimeout(function(){ if(back.parentNode) back.parentNode.removeChild(back); try{ if(prev&&prev.focus) prev.focus(); }catch(e){} }, 160);
      document.removeEventListener("keydown", onKey, true);
      resolve(ans);
    }
    function onKey(e){ if(e.key==="Escape"){ e.preventDefault(); close(false); } else if(e.key==="Enter"){ e.preventDefault(); close(true); } else if(e.key==="Tab"){ var els=[c,k]; var i=els.indexOf(document.activeElement); e.preventDefault(); els[(i+ (e.shiftKey?els.length-1:1) )%els.length].focus(); } }
    c.addEventListener("click", function(){ close(false); });
    k.addEventListener("click", function(){ close(true); });
    back.addEventListener("click", function(e){ if(e.target===back) close(false); });
    document.addEventListener("keydown", onKey, true);
  });
};
</script>

<meta name="application-name" content="Websprout">
<meta name="apple-mobile-web-app-title" content="Websprout">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Websprout">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="Websprout: Build a Professional Website in Seconds">
<meta property="og:description" content="Enter your business details and get a complete, professional website instantly. Free to build and publish, $10/month to use your own domain and download the code.">
<meta property="og:url" content="https://websprout.app/">
<meta property="og:image" content="https://websprout.app/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Websprout - Website Builder">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Websprout: Build a Professional Website in Seconds">
<meta name="twitter:description" content="Enter your business details and get a complete, professional website instantly. Free to build and publish, $10/month to use your own domain and download the code.">
<meta name="twitter:image" content="https://websprout.app/og.png">
<meta name="twitter:image:alt" content="Websprout - Website Builder">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":"Websprout","url":"https://websprout.app/","description":"Website builder that turns your business details into a complete, professional website instantly.","applicationCategory":"DesignApplication","operatingSystem":"Web browser","browserRequirements":"Requires JavaScript","offers":{"@type":"Offer","price":"10.00","priceCurrency":"USD","description":"$10/month Pro subscription. Building and publishing your site live is free; Pro removes the Websprout badge, connects your own domain, and lets you download the source code. Cancel anytime."},"featureList":["Instant website generation","Live preview before paying","Visual editor — no code","Download full HTML source code","Free one-click deploy to Netlify or Cloudflare Pages"]},{"@type":"Organization","name":"Websprout","url":"https://websprout.app/","logo":"https://websprout.app/og.svg","sameAs":[]},{"@type":"WebSite","name":"Websprout","url":"https://websprout.app/"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need to pay for hosting?","acceptedAnswer":{"@type":"Answer","text":"No. Both Netlify and Cloudflare Pages have permanently free tiers that are more than enough for most websites. Netlify gives you 100GB of bandwidth per month free, and Cloudflare Pages offers unlimited bandwidth."}},{"@type":"Question","name":"Can I update my site after deploying?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the visual editor in Websprout to make changes, re-download your site, and re-deploy. On Netlify you can drag and drop a new file onto your existing site to update it, and on Cloudflare Pages you upload a new version through the dashboard."}},{"@type":"Question","name":"How do I connect a custom domain?","acceptedAnswer":{"@type":"Answer","text":"Both platforms make this easy and free. On Netlify, go to Site Settings, Domain Management, Add custom domain, then follow the DNS instructions from your registrar. On Cloudflare Pages, use Custom Domains, Add a domain."}},{"@type":"Question","name":"Is my site secure with HTTPS?","acceptedAnswer":{"@type":"Answer","text":"Yes, automatically. Both Netlify and Cloudflare Pages issue free SSL certificates the moment your site is deployed, so your site always serves over HTTPS with no extra configuration."}},{"@type":"Question","name":"How much does Websprout cost?","acceptedAnswer":{"@type":"Answer","text":"Building and publishing your website live is completely free, with a small Websprout badge. Go Pro for $10 per month to remove the badge, connect your own custom domain, and download the source code. You can cancel anytime."}},{"@type":"Question","name":"How long does it take to build a website?","acceptedAnswer":{"@type":"Answer","text":"Instantly. You enter your business details and get a complete, professional website that you can preview live and edit visually."}}]}]}</script>
<style>
*:focus-visible{outline:3px solid #3dba52 !important;outline-offset:2px !important;}
.ws-skip{position:absolute;left:-9999px;top:0;z-index:100000;background:#0f1a0d;color:#fff;padding:10px 16px;border-radius:0 0 8px 0;text-decoration:none;font-weight:600}.ws-skip:focus{left:0}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;background:#060d05;color:#fff}
.hero h1,.section-title,.nav-logo,.stat-n,.price-amt,.how-step-num{font-family:'Sora',-apple-system,BlinkMacSystemFont,sans-serif}

/* ---- NAV ---- */
nav{position:sticky;top:0;z-index:100;height:58px;background:transparent;border-bottom:1px solid transparent;display:flex;align-items:center;padding:0 5vw;gap:20px;transition:background .25s ease,backdrop-filter .25s ease,border-color .25s ease}
nav.scrolled{background:rgba(6,13,5,.9);backdrop-filter:blur(16px);border-bottom-color:rgba(255,255,255,.72)}
.nav-logo{font-size:18px;font-weight:800;color:#fff;text-decoration:none;display:flex;align-items:center;gap:9px;letter-spacing:-.6px;margin-right:auto}
.lw{white-space:nowrap}
.nav-logo-mark{width:30px;height:30px;background:linear-gradient(145deg,#3ea04e,#22692e);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 14px rgba(45,122,58,.4)}
.nav-logo-mark svg{display:block}
.nav-logo em{font-style:normal;color:#4ade80}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:14px;color:rgba(255,255,255,.72);text-decoration:none;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#fff}
.nav-burger{display:none;border:none;background:transparent;cursor:pointer;padding:6px;align-items:center;justify-content:center;border-radius:8px;line-height:0}
.nav-burger:hover{background:rgba(255,255,255,.06)}
.nav-burger svg{display:block}
/* account settings */
.set-sec{margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08)}
.set-h{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.72);font-weight:700;margin-bottom:10px}
.set-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 0;cursor:pointer;user-select:none}
.set-row .set-lbl{display:flex;flex-direction:column;gap:2px;min-width:0}
.set-row .set-lbl b{font-size:14px;color:#eaf2e8;font-weight:600}
.set-row .set-lbl em{font-size:12px;color:rgba(255,255,255,.72);font-style:normal;line-height:1.4}
.set-tog{position:relative;width:40px;height:23px;border-radius:999px;background:rgba(255,255,255,.14);flex-shrink:0;transition:background .18s}
.set-tog::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:left .18s}
.set-tog.on{background:#2d9e4a}
.set-tog.on::after{left:20px}
.set-note{font-size:12.5px;color:rgba(255,255,255,.72);line-height:1.55;margin-bottom:10px}
.set-link{display:inline-block;font-size:13px;color:#7fe39a;text-decoration:none;font-weight:600}
.set-link:hover{text-decoration:underline}
.pf-tabs{display:flex;gap:3px;margin:18px 0 14px;background:rgba(255,255,255,.05);border-radius:11px;padding:4px;overflow-x:auto}
.pf-tab{flex:1;white-space:nowrap;text-align:center;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,.6);background:transparent;border:none;cursor:pointer;font-family:inherit;transition:background .15s,color .15s}
.pf-tab.active{background:rgba(255,255,255,.12);color:#fff}
.pf-tab:hover{color:#fff}
.pf-pane{display:none}
.pf-pane.active{display:block;animation:pfFade .2s ease}
@keyframes pfFade{from{opacity:0}to{opacity:1}}
/* accessibility effects */
html.ws-rm *,html.ws-rm *::before,html.ws-rm *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}
html.ws-focus :focus{outline:2px solid #4ade80 !important;outline-offset:2px}
.nav-cta{background:#2d7a3a;color:#fff;padding:8px 18px;border-radius:7px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:transform .2s cubic-bezier(.34,1.5,.64,1),background .15s,box-shadow .15s;white-space:nowrap}
.nav-cta:hover{background:#3dba52;transform:translateY(-1px)}
.nav-cta:active{transform:scale(.92)}

/* ---- HERO ---- */
.hero{padding:130px 5vw 60px;text-align:center;position:relative;overflow:hidden;background:#060d05;margin-top:-58px}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(45,122,58,.18) 0%,transparent 70%);pointer-events:none}
.hero-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(45,122,58,.12);color:#4ade80;border:1px solid rgba(45,122,58,.3);border-radius:100px;padding:5px 14px 5px 8px;font-size:12px;font-weight:600;margin-bottom:28px}
.hero-pill-dot{width:20px;height:20px;background:#2d7a3a;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:10px}
.hero h1{font-size:clamp(2.8rem,5.5vw,4.6rem);font-weight:800;line-height:1.05;letter-spacing:-2px;color:#fff;margin-bottom:18px}
.hero h1 em{font-style:normal;color:#4ade80}
.hero-sub{font-size:18px;color:rgba(255,255,255,.72);max-width:480px;margin:0 auto 40px;line-height:1.7}
.hero-stats{display:flex;gap:0;justify-content:center;margin-bottom:48px;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;max-width:520px;margin-left:auto;margin-right:auto;margin-top:0}
.hero-stat{flex:1;padding:16px 20px;text-align:center;border-right:1px solid rgba(255,255,255,.08)}
.hero-stat:last-child{border-right:none}
.stat-n{font-size:22px;font-weight:800;letter-spacing:-1px;background:linear-gradient(120deg,#eafff1,#4ade80);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.stat-l{font-size:11px;color:rgba(255,255,255,.72);margin-top:2px;font-weight:500}

/* ---- BUILDER CARD (in hero) ---- */
.builder-wrap{max-width:760px;margin:0 auto}
.builder-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:2px;margin-bottom:14px}
.builder-card{background:#0f1a0d;border:1px solid rgba(45,122,58,.2);border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(45,122,58,.08),0 32px 80px rgba(0,0,0,.5);max-height:560px;overflow-y:auto}

/* ---- STEP TABS ---- */
.step-tabs{display:none;background:#080f07;border-bottom:1px solid rgba(255,255,255,.06)}
.step-tab{flex:1;padding:13px 8px;text-align:center;font-size:12px;font-weight:600;color:rgba(255,255,255,.72);border:none;background:transparent;cursor:default;position:relative;transition:color .2s;border-right:1px solid rgba(255,255,255,.05);font-family:inherit}
.step-tab:last-child{border-right:none}
.step-tab.active{color:#4ade80;background:rgba(255,255,255,.02)}
.step-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#2d7a3a}
.step-tab.done{color:#4ade80}
.step-n{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:currentColor;color:#080f07;font-size:9px;font-weight:900;margin-right:5px}
.panel{display:none;padding:20px 22px}
.panel.active{display:block}
.panel-q{font-size:14px;color:rgba(255,255,255,.72);margin-bottom:4px;font-weight:600}

/* ---- TYPE GRID ---- */
.type-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:16px}
.type-btn{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:10px;padding:12px 6px 10px;cursor:pointer;text-align:center;font-family:inherit;transition:all .15s;color:rgba(255,255,255,.72)}
.type-btn:hover{border-color:rgba(61,186,82,.4);background:rgba(45,122,58,.1);color:rgba(255,255,255,.85)}
.type-btn.sel{border-color:#3dba52;background:rgba(45,122,58,.18);color:#fff;box-shadow:0 0 0 3px rgba(61,186,82,.12)}
.type-icon{font-size:20px;display:block;margin-bottom:4px}
.type-lbl{font-size:10px;font-weight:600;line-height:1.3}
#customWrap{display:none;margin-bottom:16px}
.dark-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:9px 12px;color:#e8f5e4;font-family:inherit;font-size:14px;outline:none;transition:border .15s}
.dark-input:focus{border-color:rgba(45,122,58,.5)}
.dark-input::placeholder{color:rgba(255,255,255,.72)}
textarea.dark-input{resize:vertical;min-height:76px;line-height:1.6}
.describe-box{min-height:124px;font-size:15px;line-height:1.65;padding:14px 16px}
.describe-vibe{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0 2px}
.describe-vibe-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:.6px}
.panel-foot{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);margin-top:12px}
.p-hint{font-size:12px;color:rgba(255,255,255,.72)}
.btn-next{background:#2d7a3a;color:#fff;padding:8px 20px;border-radius:7px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .15s;opacity:.35;pointer-events:none}
.btn-next.on{opacity:1;pointer-events:all}
.btn-next.on:hover{background:#3dba52}
.btn-back{background:rgba(255,255,255,.05);color:rgba(255,255,255,.72);padding:8px 16px;border-radius:7px;font-size:13px;border:1px solid rgba(255,255,255,.08);cursor:pointer;font-family:inherit;transition:all .15s}
.btn-back:hover{color:rgba(255,255,255,.7);background:rgba(255,255,255,.08)}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.detail-grid .span2{grid-column:1/-1}
.field-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.vibe-row{display:flex;flex-wrap:wrap;gap:6px}
.vibe-chip{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.72);border-radius:100px;padding:5px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s}
.vibe-chip:hover{border-color:rgba(45,122,58,.4);color:rgba(255,255,255,.75)}
.vibe-chip.sel{background:rgba(45,122,58,.15);border-color:#2d7a3a;color:#4ade80}
.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;margin-bottom:18px}
.s-row{display:flex;flex-direction:column;gap:2px}
.s-lbl{font-size:10px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:.6px}
.s-val{font-size:13px;color:rgba(255,255,255,.7);font-weight:500}
.gen-btn{background:linear-gradient(135deg,#4ade80 0%,#22c55e 48%,#16a34a 100%);color:#06210f;padding:12px 28px;border-radius:10px;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:transform .22s cubic-bezier(.34,1.55,.64,1),box-shadow .2s,filter .2s;box-shadow:0 6px 22px -4px rgba(34,197,94,.5)}
.gen-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px -6px rgba(34,197,94,.7);filter:brightness(1.05)}
.gen-btn:active:not(:disabled){transform:translateY(1px) scale(.95);box-shadow:0 2px 10px -4px rgba(34,197,94,.45)}
.gen-btn:disabled{opacity:.5;cursor:not-allowed}
.loading{display:none;padding:32px 22px;text-align:center}
.loading.on{display:block}
.load-icon{font-size:28px;animation:spin 1.8s ease-in-out infinite;display:inline-block}
@keyframes spin{0%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(10deg) scale(1.15)}100%{transform:rotate(-10deg) scale(1)}}
.load-txt{font-size:13px;color:rgba(255,255,255,.72);margin-top:8px}
.load-bar{height:2px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:12px 22px 0}
.load-fill{height:100%;background:#2d7a3a;animation:sweep 2s ease-in-out infinite}
@keyframes sweep{0%{width:0%;margin-left:0}50%{width:55%;margin-left:20%}100%{width:0%;margin-left:100%}}

/* ---- HOME PAGE WOW UPGRADES ---- */
.hero{isolation:isolate}
.hero::before{z-index:-1;width:1200px;height:820px;top:-280px;background:radial-gradient(ellipse 46% 60% at 32% 38%,rgba(45,122,58,.30),transparent 62%),radial-gradient(ellipse 42% 54% at 70% 30%,rgba(16,185,129,.22),transparent 62%),radial-gradient(ellipse 40% 50% at 52% 74%,rgba(34,197,94,.16),transparent 66%);filter:blur(6px);animation:wsAurora 18s ease-in-out infinite alternate}
.hero::after{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at 82% 8%,rgba(16,185,129,.10),transparent 42%),radial-gradient(circle at 12% 82%,rgba(45,122,58,.10),transparent 45%);animation:wsAurora2 24s ease-in-out infinite alternate}
@keyframes wsAurora{0%{transform:translateX(-50%) translateY(0) scale(1) rotate(0deg)}50%{transform:translateX(-47%) translateY(22px) scale(1.07) rotate(2deg)}100%{transform:translateX(-53%) translateY(-12px) scale(1.04) rotate(-2deg)}}
@keyframes wsAurora2{0%{opacity:.5;transform:scale(1)}100%{opacity:1;transform:scale(1.12) translateY(12px)}}
.hero h1 em{background:linear-gradient(100deg,#4ade80 0%,#22d3ee 50%,#4ade80 100%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:wsShimmer 7s linear infinite}
@keyframes wsShimmer{to{background-position:220% center}}
.builder-card{position:relative;background:rgba(13,26,12,.55);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.16),0 0 58px -12px rgba(74,222,128,.4),inset 0 1px 0 rgba(255,255,255,.07);animation:wsCardPulse 5.5s ease-in-out infinite}
@keyframes wsCardPulse{0%,100%{box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.14),0 0 52px -14px rgba(74,222,128,.32),inset 0 1px 0 rgba(255,255,255,.07)}50%{box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.24),0 0 78px -8px rgba(74,222,128,.55),inset 0 1px 0 rgba(255,255,255,.07)}}
.type-btn{transition:transform .18s cubic-bezier(.2,.7,.2,1),border-color .18s,background .18s,box-shadow .18s}
.type-btn:hover{transform:translateY(-3px);box-shadow:0 12px 26px -12px rgba(45,122,58,.55)}
.nav-cta{box-shadow:0 6px 18px -6px rgba(45,122,58,.6)}
#navCta{background:linear-gradient(135deg,#4ade80,#16a34a);color:#06210f;font-weight:700;box-shadow:0 4px 16px -2px rgba(34,197,94,.5)}
#navCta:hover{transform:translateY(-1px);box-shadow:0 7px 22px -4px rgba(34,197,94,.65);filter:brightness(1.04)}
/* staggered entrance */
.hero-pill,.hero h1,.hero-sub,.hero-stats,.builder-wrap{animation:wsRise .7s cubic-bezier(.2,.7,.2,1) both}
.hero h1{animation-delay:.05s}
.hero-sub{animation-delay:.11s}
.hero-stats{animation-delay:.21s}
.builder-wrap{animation-delay:.27s}
@keyframes wsRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.hero::before,.hero::after,.hero h1 em,.hero-pill,.hero h1,.hero-sub,.hero-stats,.builder-wrap,.builder-card{animation:none}}

/* ---- TRUST BAR ---- */
.trust-bar{background:#060d05;border-top:1px solid rgba(255,255,255,.06);padding:28px 5vw;display:flex;align-items:center;justify-content:center;gap:32px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.72);font-weight:500}
.trust-icon{font-size:16px}

/* ---- HOW IT WORKS ---- */
.how{background:#000;padding:88px 5vw}
.how-inner{max-width:960px;margin:0 auto}
.section-eyebrow{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;background:linear-gradient(90deg,#16a34a,#0e7490);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.section-title{font-size:clamp(1.7rem,2.8vw,2.4rem);font-weight:800;color:#0a0a0a;letter-spacing:-1.5px;margin-bottom:40px;line-height:1.1}
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.how-card{border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:28px;background:rgba(255,255,255,.02);transition:all .2s;position:relative;overflow:hidden}
.how-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,122,58,.08),transparent);opacity:0;transition:opacity .2s}
.how-card:hover{border-color:rgba(45,122,58,.35);box-shadow:0 8px 32px rgba(0,0,0,.25);transform:translateY(-3px)}
.how-card:hover::before{opacity:1}
.how-step-num{width:36px;height:36px;background:rgba(45,122,58,.15);border:1.5px solid rgba(45,122,58,.4);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#4ade80;margin-bottom:18px}
.how-card h3{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px;letter-spacing:-.3px}
.how-card p{font-size:14px;color:rgba(255,255,255,.7);line-height:1.7}

/* ---- COMPARE ---- */
.compare{background:#060d05;padding:88px 5vw}
.compare-inner{max-width:780px;margin:0 auto}
.compare-inner .section-eyebrow,.how-inner .section-eyebrow,.pricing-inner .section-eyebrow{background:linear-gradient(90deg,#4ade80,#22d3ee);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.compare-inner .section-title,.how-inner .section-title,.pricing-inner .section-title,.lp-faq-inner .section-title{color:#fff}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cmp-card{border-radius:16px;padding:26px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}
.cmp-card.highlight{border-color:rgba(45,122,58,.35);background:rgba(45,122,58,.07)}
.cmp-head{font-size:14px;font-weight:700;color:#fff;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.cmp-badge{background:#2d7a3a;color:#fff;font-size:10px;font-weight:700;padding:2px 9px;border-radius:100px}
.cmp-list{list-style:none;display:flex;flex-direction:column;gap:10px}
.cmp-item{font-size:13px;color:rgba(255,255,255,.72);display:flex;align-items:flex-start;gap:8px;line-height:1.5}
.cmp-item::before{content:'v';color:#4ade80;font-weight:900;font-size:11px;flex-shrink:0;margin-top:2px}
.cmp-item.no{color:rgba(255,255,255,.72)}
.cmp-item.no::before{content:'x';color:rgba(255,255,255,.72)}

/* ---- PRICING ---- */
.pricing{background:#000;padding:88px 5vw}
.pricing-inner{max-width:640px;margin:0 auto}
.price-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
.price-card{border:1.5px solid rgba(255,255,255,.1);border-radius:18px;padding:28px;background:rgba(255,255,255,.02)}
.price-card.pick{border-color:#3ea04e;box-shadow:0 0 0 4px rgba(45,122,58,.15)}
.price-name{font-size:13px;font-weight:700;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
.price-amt{font-size:44px;font-weight:800;color:#fff;letter-spacing:-2px;line-height:1}
.price-amt sup{font-size:20px;font-weight:700;vertical-align:top;margin-top:8px;display:inline-block}
.price-freq{font-size:13px;color:rgba(255,255,255,.5);margin:6px 0 20px}
.price-list{list-style:none;display:flex;flex-direction:column;gap:9px}
.price-item{font-size:14px;color:rgba(255,255,255,.8);display:flex;align-items:center;gap:7px}
.price-item::before{content:'v';color:#4ade80;font-weight:900;font-size:11px}
.price-item.dim{color:rgba(255,255,255,.38)}
.price-item.dim::before{content:'-';color:rgba(255,255,255,.3)}

/* ---- CTA BAND ---- */
.cta-band{background:linear-gradient(135deg,#0a1f0a 0%,#1a4025 40%,#2d7a3a 100%);padding:88px 5vw;text-align:center;position:relative;overflow:hidden}
.cta-band::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(61,186,82,.2) 0%,transparent 70%);pointer-events:none}
.cta-band h2{font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-2px;margin-bottom:12px;position:relative}
.cta-band p{font-size:18px;color:rgba(255,255,255,.72);margin-bottom:32px;position:relative}
.btn-white{background:#fff;color:#1a4025;padding:15px 36px;border-radius:10px;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:inherit;transition:all .2s;position:relative;letter-spacing:-.2px}
.btn-white:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.2)}

/* ---- FOOTER ---- */
footer{background:#030804;border-top:1px solid rgba(255,255,255,.05);padding:32px 5vw;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
.foot-logo{font-size:15px;font-weight:800;color:#fff;text-decoration:none;display:flex;align-items:center;gap:7px}
.foot-logo em{font-style:normal;color:#4ade80}
.foot-links{display:flex;gap:20px;flex-wrap:wrap}
.foot-links a{font-size:13px;color:rgba(255,255,255,.72);text-decoration:none;transition:color .15s}
.foot-links a:hover{color:rgba(255,255,255,.72)}

/* ---- TOAST ---- */
.toast{position:fixed;bottom:24px;right:24px;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#e8f5e4;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,.35);z-index:99999;transform:translateY(80px);opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none;max-width:320px}
.toast.on{transform:translateY(0);opacity:1}

/* ---- SKELETON ---- */
.skeleton-wrap{position:absolute;inset:0;background:#060d05;z-index:5;overflow:hidden;display:none;flex-direction:column;align-items:center;justify-content:center}
.skeleton-wrap.show{display:flex}
.skel-inner{width:100%;max-width:640px;padding:0 28px;display:flex;flex-direction:column;align-items:center}
.skel-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px}
.skel-logo-mark{width:36px;height:36px;background:#2d7a3a;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;animation:skel-bob 2s ease-in-out infinite}
@keyframes skel-bob{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.12) rotate(3deg)}}
.skel-logo-text{font-size:18px;font-weight:800;color:#fff;letter-spacing:-.3px}
.skel-logo-text em{font-style:normal;color:#4ade80}
.skel-msg{font-size:14px;color:rgba(255,255,255,.72);font-weight:500;margin-bottom:28px;min-height:20px;text-align:center;transition:opacity .3s}
.skel-progress-track{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:100px;margin-bottom:36px;overflow:hidden}
.skel-progress-fill{height:100%;background:linear-gradient(90deg,#2d7a3a,#4ade80);border-radius:100px;width:0%;transition:width .9s cubic-bezier(.2,.8,.2,1)}
@keyframes skel-prog{0%{width:0%}30%{width:35%}60%{width:62%}85%{width:82%}100%{width:92%}}
.skel-build{width:100%;display:flex;flex-direction:column;gap:8px}
.skel-section{border-radius:10px;overflow:hidden;animation:skel-appear .4s ease forwards;opacity:0}
@keyframes skel-appear{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.skel-section:nth-child(1){animation-delay:.1s}
.skel-section:nth-child(2){animation-delay:.5s}
.skel-section:nth-child(3){animation-delay:.9s}
.skel-section:nth-child(4){animation-delay:1.3s}
.skel-section:nth-child(5){animation-delay:1.7s}
.skel-nav-bar{height:42px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;display:flex;align-items:center;padding:0 16px;gap:10px}
.skel-nav-dot{width:24px;height:24px;background:rgba(45,122,58,.3);border-radius:5px}
.skel-nav-links{display:flex;gap:8px;margin-left:auto}
.skel-nav-link{height:8px;border-radius:4px;background:rgba(255,255,255,.07);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-nav-link:nth-child(1){width:44px}.skel-nav-link:nth-child(2){width:36px;animation-delay:.2s}.skel-nav-link:nth-child(3){width:40px;animation-delay:.4s}
.skel-hero-bar{height:80px;background:linear-gradient(135deg,rgba(45,122,58,.12),rgba(61,186,82,.06));border:1px solid rgba(45,122,58,.2);border-radius:10px;display:flex;align-items:center;padding:0 18px;gap:14px}
.skel-hero-lines{flex:1;display:flex;flex-direction:column;gap:7px}
.skel-hero-h{height:14px;border-radius:6px;background:rgba(255,255,255,.12);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-hero-sub{height:8px;width:70%;border-radius:4px;background:rgba(255,255,255,.06);animation:skel-pulse 1.8s ease-in-out .2s infinite}
.skel-hero-btn{width:72px;height:28px;border-radius:100px;background:rgba(45,122,58,.4);flex-shrink:0;animation:skel-pulse 1.8s ease-in-out .4s infinite}
.skel-cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.skel-card-item{height:52px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;animation:skel-pulse 1.8s ease-in-out infinite}
.skel-card-item:nth-child(2){animation-delay:.15s}.skel-card-item:nth-child(3){animation-delay:.3s}
.skel-text-row{display:flex;flex-direction:column;gap:6px;padding:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px}
.skel-text-line{height:7px;border-radius:4px;background:rgba(255,255,255,.06);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-text-line.w90{width:90%}.skel-text-line.w70{width:70%;animation-delay:.2s}.skel-text-line.w55{width:55%;animation-delay:.4s}
@keyframes skel-pulse{0%,100%{opacity:.6}50%{opacity:1}}
/* ---- STUDIO ---- */
.studio{display:none;position:fixed;inset:0;z-index:9999;flex-direction:column;background:#0f1a0d}
.studio.on{display:flex}
.s-header{height:52px;background:#0a1208;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 16px;gap:10px;flex-shrink:0}
.s-title{font-size:14px;font-weight:700;color:#fff;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.live-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.device-btns{display:flex;gap:2px;background:rgba(255,255,255,.06);border-radius:8px;padding:3px;flex-shrink:0}
.dev-btn{background:transparent;border:none;color:rgba(255,255,255,.72);width:26px;height:26px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.dev-btn:hover{color:rgba(255,255,255,.7)}.dev-btn.active{background:rgba(255,255,255,.12);color:#fff}
.edit-counter{font-size:11px;color:rgba(255,255,255,.72);font-weight:600;padding:4px 8px;background:rgba(255,255,255,.05);border-radius:6px;white-space:nowrap}
.s-actions{display:flex;gap:6px;flex-shrink:0;margin-left:auto}
.s-btn{border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.s-ghost{background:rgba(255,255,255,.06);color:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.09)}
.s-ghost:hover{background:rgba(255,255,255,.11);color:#fff}
.s-manage{background:rgba(61,186,82,.16);color:#5fe08a;border:1px solid rgba(61,186,82,.5);font-weight:700}
.s-manage:hover{background:rgba(61,186,82,.26);color:#8af0ab;border-color:rgba(61,186,82,.72);box-shadow:0 2px 14px rgba(61,186,82,.3)}
.studio.studio-loading [data-needs-site]{opacity:.3;pointer-events:none;cursor:not-allowed}
.studio.studio-loading .chat{opacity:.2;pointer-events:none;position:relative}
.studio.studio-loading .chat::after{content:"";position:absolute;inset:0;z-index:10;cursor:not-allowed}
.studio.studio-loading .preview-frame-wrap{overflow:hidden}
.s-green{background:#2d7a3a;color:#fff}.s-green:hover{background:#3dba52}
.s-deploy-hero{background:linear-gradient(135deg,#00c7b7,#00a89c)!important;color:#fff!important;border:none!important;animation:deploy-pulse 2s ease-in-out infinite;font-size:13px!important;padding:7px 16px!important}
@keyframes deploy-pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,199,183,.4)}50%{box-shadow:0 0 0 8px rgba(0,199,183,0)}}
.deploy-cta-banner{background:linear-gradient(135deg,#0a1f0a,#1a4025);border-bottom:1px solid rgba(0,199,183,.3);padding:12px 16px;display:none;align-items:center;gap:12px;flex-shrink:0}
.deploy-cta-banner.on{display:flex}
.deploy-cta-banner-text{flex:1;font-size:13px;color:#fff;font-weight:600}
.deploy-cta-banner-text span{color:#4ade80}
.deploy-cta-banner-btn{background:#00c7b7;color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s}
.deploy-cta-banner-btn:hover{background:#00a89c;transform:translateY(-1px)}
.deploy-cta-dismiss{background:none;border:none;color:rgba(255,255,255,.72);font-size:16px;cursor:pointer;padding:0 4px}
.s-purple{background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff}
.s-purple:hover{box-shadow:0 4px 16px rgba(109,40,217,.4)}
.s-body{display:flex;flex:1;overflow:hidden}
.preview-frame-wrap{flex:1;position:relative;display:flex;flex-wrap:wrap;justify-content:center;background:#fff;overflow-y:auto;overflow-x:auto;transition:background .3s}
.preview-frame-wrap.tablet,.preview-frame-wrap.mobile{background:#1a1a1a;padding:20px}
.preview-frame-wrap.tablet iframe{width:768px!important;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);flex-shrink:0}
.preview-frame-wrap.mobile iframe{width:390px!important;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.5);flex-shrink:0}
.preview-label{position:absolute;bottom:12px;left:12px;background:rgba(0,0,0,.45);color:rgba(255,255,255,.72);font-size:11px;padding:4px 10px;border-radius:6px;pointer-events:none;z-index:10}
.lock-badge{position:absolute;bottom:16px;right:16px;background:#0f0a2e;border:1px solid rgba(109,40,217,.3);border-radius:14px;padding:16px;max-width:240px;box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:10}
.lock-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:4px}
.lock-sub{font-size:11px;color:rgba(255,255,255,.72);margin-bottom:10px;line-height:1.5}
.lock-email{width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:7px 11px;color:#fff;font-size:12px;outline:none;margin-bottom:8px;font-family:inherit}
.fs-overlay{display:none;position:fixed;inset:0;z-index:99997;background:#fff;flex-direction:column}
.fs-overlay.on{display:flex}
.fs-overlay iframe{flex:1;border:none;width:100%}
.fs-bar{height:44px;background:#0f1a0d;display:flex;align-items:center;padding:0 16px;gap:10px;flex-shrink:0}
.fs-close{background:#2d7a3a;color:#fff;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.fs-close:hover{background:#3dba52}
.fs-title{font-size:13px;color:rgba(255,255,255,.72);flex:1}
.drop-overlay{position:absolute;inset:0;background:rgba(45,122,58,.15);border:3px dashed #2d7a3a;border-radius:4px;z-index:20;display:none;align-items:center;justify-content:center;pointer-events:none}
.drop-overlay.show{display:flex}
.drop-overlay-txt{background:#0f1a0d;color:#4ade80;font-size:16px;font-weight:700;padding:16px 32px;border-radius:12px}

/* ---- BIZ INFO PANEL ---- */
.biz-panel{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.biz-panel-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:0}
.biz-panel-title{font-size:10px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:5px}
.biz-panel-toggle{font-size:10px;color:rgba(255,255,255,.72);transition:transform .2s}
.biz-panel-toggle.open{transform:rotate(180deg)}
.biz-fields{display:none;flex-direction:column;gap:7px;margin-top:10px}
.biz-fields.open{display:flex}
.biz-field{display:flex;flex-direction:column;gap:3px}
.biz-field label{font-size:10px;color:rgba(255,255,255,.72);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.biz-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:7px;padding:7px 10px;color:#e8f5e4;font-family:inherit;font-size:12px;outline:none;transition:border .15s;width:100%}
.biz-input:focus{border-color:rgba(45,122,58,.5)}
.biz-input::placeholder{color:rgba(255,255,255,.72)}
.biz-apply{width:100%;background:rgba(45,122,58,.2);border:1px solid rgba(45,122,58,.35);color:#4ade80;border-radius:8px;padding:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;margin-top:4px}
.biz-apply:hover{background:rgba(45,122,58,.35)}

/* ---- CHAT ---- */
.chat{width:332px;flex-shrink:0;display:flex;flex-direction:column;background:#0a1208;border-left:1px solid rgba(255,255,255,.06)}
.chat-head{padding:14px 15px 12px;border-bottom:1px solid rgba(255,255,255,.06);background:linear-gradient(180deg,rgba(45,122,58,.1),transparent)}
.chat-head-title{font-size:13px;font-weight:700;color:#eafbe6;letter-spacing:.2px;display:flex;align-items:center;gap:6px}
.chat-head-sub{font-size:11px;color:rgba(255,255,255,.72);margin-top:3px;line-height:1.4}
.chat-msgs{flex:0 1 auto;max-height:200px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:0}
.chat{overflow-y:auto}
.chat-msgs::-webkit-scrollbar{width:3px}
.chat-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}
.msg{max-width:92%}
.msg-ai{align-self:flex-start}.msg-me{align-self:flex-end}
.msg-name{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px}
.msg-ai .msg-name{color:#4ade80}.msg-me .msg-name{color:rgba(255,255,255,.72);text-align:right}
.msg-body{padding:9px 12px;border-radius:12px;font-size:13px;line-height:1.55}
.msg-ai .msg-body{background:rgba(255,255,255,.06);color:rgba(255,255,255,.78);border-radius:4px 12px 12px 12px}
.msg-me .msg-body{background:#2d7a3a;color:#fff;border-radius:12px 4px 12px 12px}
.typing{padding:0 14px 8px;display:none}.typing.on{display:block}
.typing-bub{background:rgba(255,255,255,.06);border-radius:4px 12px 12px 12px;padding:9px 14px;display:inline-flex;gap:4px;align-items:center}
.t-dot{width:5px;height:5px;background:rgba(255,255,255,.28);border-radius:50%;animation:tdot 1.2s infinite}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}
.img-library{border-top:1px solid rgba(255,255,255,.05);padding:10px 12px}
.img-lib-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;padding:1px 0;cursor:pointer;font-family:inherit}
.img-lib-caret{font-size:10px;color:rgba(255,255,255,.72);transition:transform .18s}
.img-library:not(.collapsed) .img-lib-caret{transform:rotate(180deg)}
.img-library.collapsed .img-lib-body{display:none}
.img-lib-body{margin-top:9px}
.img-lib-actions{display:flex;justify-content:flex-end;margin-bottom:8px}
.img-lib-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.img-lib-label{font-size:10px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:1px}
.img-upload-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.72);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.img-upload-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.img-dropzone{border:1.5px dashed rgba(255,255,255,.12);border-radius:10px;padding:14px;text-align:center;font-size:12px;color:rgba(255,255,255,.72);cursor:pointer;transition:all .2s;display:none}
.img-dropzone.empty{display:block}.img-dropzone.drag{border-color:#2d7a3a;background:rgba(45,122,58,.1);color:#4ade80}
.img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}
.img-thumb{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer;border:1.5px solid transparent;transition:all .15s}
.img-thumb:hover{border-color:#2d7a3a;transform:scale(1.04)}
.img-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.img-thumb-del{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:50%;font-size:9px;cursor:pointer;display:none;align-items:center;justify-content:center;line-height:1}
.img-thumb:hover .img-thumb-del{display:flex}
.img-actions{display:flex;flex-direction:column;gap:4px;padding:6px;background:rgba(0,0,0,.4);border-radius:6px;display:none}
.img-action-btn{background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.7);border-radius:5px;padding:5px 8px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;text-align:left;transition:all .15s}
.img-action-btn:hover{background:rgba(45,122,58,.3);color:#4ade80}
#imgFileInput{display:none}
.img-mobile-upload{display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(45,122,58,.15);border:1.5px solid rgba(45,122,58,.3);border-radius:10px;padding:12px;color:#4ade80;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;transition:all .15s}
.img-mobile-upload:hover{background:rgba(45,122,58,.25)}
.palette-section{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.design-drawer .live-color-panel,.design-drawer .font-section,.design-drawer .palette-section{border-bottom:none}
.dd-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;cursor:pointer;font-family:inherit;padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.dd-caret{font-size:10px;color:rgba(255,255,255,.72);transition:transform .18s}
.design-drawer:not(.collapsed) .dd-caret{transform:rotate(180deg)}
.design-drawer:not(.collapsed){border-bottom:1px solid rgba(255,255,255,.05)}
.design-drawer.collapsed .dd-body{display:none}
.style-section{padding:10px 12px;border-top:1px solid rgba(255,255,255,.05)}
.ds-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}
.ds-label{font-size:11px;color:rgba(255,255,255,.72);flex-shrink:0}
.ds-seg{display:flex;background:rgba(255,255,255,.05);border-radius:7px;padding:2px;gap:2px}
.ds-seg button{background:none;border:none;color:rgba(255,255,255,.72);font-size:11px;font-family:inherit;padding:4px 9px;border-radius:5px;cursor:pointer;transition:all .15s;white-space:nowrap}
.ds-seg button:hover{color:#fff}
.ds-seg button.on{background:#2d7a3a;color:#fff;font-weight:600}
.palette-label{font-size:10px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.palette-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.pal{width:100%;aspect-ratio:1;border-radius:7px;border:2px solid transparent;cursor:pointer;transition:all .15s;position:relative}
.pal:hover{transform:scale(1.18);border-color:rgba(255,255,255,.72);z-index:1}
.font-section{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.font-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-top:8px}
.font-btn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.72);border-radius:8px;padding:8px 10px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:left}
.font-btn:hover{background:rgba(45,122,58,.15);border-color:rgba(45,122,58,.4);color:#4ade80}
.font-btn-name{font-size:13px;font-weight:600;display:block}
.font-btn-sample{font-size:10px;color:rgba(255,255,255,.72);display:block;margin-top:1px}
.quick-edits{padding:12px 14px 4px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.012)}
.qe{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.72);border-radius:100px;padding:4px 11px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.qe:hover{background:rgba(45,122,58,.15);border-color:rgba(45,122,58,.4);color:#4ade80}
.font-btn.sel{background:rgba(45,122,58,.18);border-color:#2d7a3a;color:#4ade80}
.font-btn.sel .font-btn-sample{color:rgba(74,222,128,.6)}
.sec-pick{display:none;flex-wrap:wrap;gap:6px;width:100%;padding:8px 0 2px}
.sec-pick.on{display:flex}
.sec-pick .qe{color:rgba(255,255,255,.72)}
.qe.on{background:rgba(45,122,58,.2);border-color:#2d7a3a;color:#4ade80}
.qe-label{flex-basis:100%;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.72);margin-bottom:1px}
.chat-input{padding:8px 14px 14px;background:rgba(255,255,255,.012)}
.chat-row{display:flex;gap:7px;align-items:flex-end;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:13px;padding:6px 6px 6px 13px;transition:border-color .15s,box-shadow .15s}
.chat-row:focus-within{border-color:rgba(74,222,128,.5);box-shadow:0 0 0 3px rgba(45,122,58,.16)}
.chat-ta{flex:1;background:transparent;border:none;border-radius:0;padding:6px 0;color:#eafbe6;font-family:inherit;font-size:14px;line-height:1.5;resize:none;outline:none;min-height:34px;max-height:120px}
.chat-ta::placeholder{color:rgba(255,255,255,.72)}
.chat-send{width:38px;height:38px;background:#2d7a3a;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s,transform .1s}
.chat-send:hover:not(:disabled){background:#3dba52}
.chat-send:active:not(:disabled){transform:scale(.93)}
.chat-send:disabled{opacity:.35;cursor:not-allowed}
.chat-hint{font-size:10px;color:rgba(255,255,255,.72);margin-top:7px;text-align:center}
.ed-hint{display:flex;align-items:flex-start;gap:8px;margin:10px 14px 2px;padding:10px 12px;background:rgba(61,186,82,.12);border:1px solid rgba(61,186,82,.3);border-radius:11px;font-size:12px;line-height:1.5;color:rgba(234,242,232,.85)}
.ed-hint-txt{flex:1}.ed-hint-txt b{color:#7fe39a;font-weight:700}
.ed-hint-x{background:none;border:none;color:rgba(255,255,255,.72);font-size:18px;line-height:1;cursor:pointer;padding:0 2px;font-family:inherit;flex-shrink:0}
.ed-hint-x:hover{color:#fff}

/* ---- SEO MODAL ---- */
.seo-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.seo-modal.on{display:flex}
.seo-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.seo-header{padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.seo-header h3{font-size:16px;font-weight:700;color:#fff}
.seo-close{background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1}
.seo-body{padding:20px 24px}
.seo-field{margin-bottom:16px}
.seo-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:flex;justify-content:space-between}
.seo-label span{color:rgba(255,255,255,.72);font-weight:400;text-transform:none;letter-spacing:0}
.seo-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:9px 12px;color:#e8f5e4;font-family:inherit;font-size:13px;outline:none;transition:border .15s}
.seo-input:focus{border-color:rgba(45,122,58,.5)}
.seo-input::placeholder{color:rgba(255,255,255,.72)}
.seo-preview{background:#1a2e19;border-radius:8px;padding:12px;margin-top:16px;font-size:12px}
.seo-preview-title{color:#4285f4;font-size:14px;font-weight:500;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.seo-preview-url{color:#3c8b3c;font-size:11px;margin-bottom:4px}
.seo-preview-desc{color:rgba(255,255,255,.72);line-height:1.5}
.seo-footer{padding:16px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;justify-content:flex-end}
.seo-save{background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.seo-save:hover{background:#3dba52}

/* ---- SHARE MODAL ---- */
.share-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.share-modal.on{display:flex}
.share-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.4);padding:28px}
.share-box h3{font-size:18px;font-weight:800;color:#fff;margin-bottom:6px}
.share-box p{font-size:14px;color:rgba(255,255,255,.72);margin-bottom:20px}
.share-url-wrap{display:flex;gap:8px}
.share-url{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 12px;color:#4ade80;font-size:12px;font-family:monospace;outline:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.share-copy{background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
.share-copy:hover{background:#3dba52}
.share-note{font-size:12px;color:rgba(255,255,255,.72);margin-top:12px}
.share-close-btn{display:block;margin-top:16px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.72);border:none;border-radius:8px;padding:8px;font-size:13px;cursor:pointer;font-family:inherit;width:100%}

/* ---- EDIT MODE ---- */
.edit-mode-btn{background:rgba(255,255,255,.06);color:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.09)}
.edit-mode-btn.on{background:rgba(61,186,82,.2);color:#3dba52;border-color:rgba(61,186,82,.4)}
.edit-indicator{position:fixed;top:58px;left:50%;transform:translateX(-50%);background:#0f1a0d;border:1px solid rgba(61,186,82,.4);color:#4ade80;font-size:12px;font-weight:600;padding:6px 16px;border-radius:100px;z-index:99998;pointer-events:none;display:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.3)}
.edit-indicator.on{display:block}

/* ---- LIVE COLOR PANEL ---- */
.live-color-panel{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.live-color-grid{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.live-color-swatch{width:32px;height:32px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .15s;position:relative;overflow:hidden;flex-shrink:0}
.live-color-swatch:hover{transform:scale(1.15);border-color:rgba(255,255,255,.72);z-index:1}
.color-input-hidden{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}

/* ---- SECTION MANAGER MODAL ---- */
.sec-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.sec-modal.on{display:flex}
.sec-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:460px;max-height:80%;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.sec-header{padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.sec-header h3{font-size:15px;font-weight:700;color:#fff}
.sec-header-sub{font-size:12px;color:rgba(255,255,255,.72);margin-top:2px}
.sec-close-x{background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1}
.sec-list{flex:1;overflow-y:auto;padding:10px 12px}
.sec-list::-webkit-scrollbar{width:3px}
.sec-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
.sec-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.06);margin-bottom:6px;background:rgba(255,255,255,.02);transition:background .15s}
.sec-item:hover{background:rgba(255,255,255,.04)}
.sec-name{flex:1;font-size:13px;font-weight:600;color:rgba(255,255,255,.7)}
.sec-tag{font-size:10px;color:rgba(255,255,255,.72);background:rgba(255,255,255,.05);padding:2px 7px;border-radius:4px;font-family:monospace}
.sec-btn{background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.72);border-radius:6px;width:26px;height:26px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.sec-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.sec-btn.eye-off{color:rgba(255,255,255,.72)}
.sec-item.hidden-sec .sec-name{opacity:.35;text-decoration:line-through}
.sec-footer{padding:12px 16px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}
.sec-refresh{width:100%;background:rgba(45,122,58,.15);border:1px solid rgba(45,122,58,.3);color:#4ade80;border-radius:8px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.sec-refresh:hover{background:rgba(45,122,58,.25)}

/* Image slot picker modal */
.slot-modal{display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);align-items:center;justify-content:center;padding:20px}
.slot-modal.on{display:flex}
.slot-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.5)}
.slot-header{padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.slot-header h3{font-size:16px;font-weight:700;color:#fff;letter-spacing:-.3px}
.slot-header-sub{font-size:12px;color:rgba(255,255,255,.72);margin-top:2px}
.slot-close-x{background:none;border:none;color:rgba(255,255,255,.72);font-size:20px;cursor:pointer;line-height:1;padding:0}
.slot-body{padding:20px 24px}
.slot-drop{border:2px dashed rgba(45,122,58,.4);border-radius:14px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(45,122,58,.04);margin-bottom:14px}
.slot-drop:hover,.slot-drop.drag{border-color:#3dba52;background:rgba(45,122,58,.12)}
.slot-drop-icon{font-size:36px;display:block;margin-bottom:10px}
.slot-drop-text{font-size:14px;font-weight:600;color:rgba(255,255,255,.72);margin-bottom:4px}
.slot-drop-sub{font-size:12px;color:rgba(255,255,255,.72)}
.slot-divider{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.slot-divider::before,.slot-divider::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.07)}
.slot-divider span{font-size:11px;color:rgba(255,255,255,.72);font-weight:600}
.slot-lib-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px}
.slot-lib-thumb{aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s}
.slot-lib-thumb:hover{border-color:#3dba52;transform:scale(1.05)}
.slot-lib-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.slot-lib-empty{font-size:12px;color:rgba(255,255,255,.72);text-align:center;padding:8px 0}
.slot-ai{margin-bottom:14px}
.slot-ai-row{display:flex;gap:8px}
.slot-ai-row input{flex:1;background:#0f1a0d;border:1px solid rgba(45,122,58,.32);color:#eaf2e8;border-radius:9px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none}
.slot-ai-row input:focus{border-color:#3dba52}
.slot-ai-row button{white-space:nowrap;background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;border:none;border-radius:9px;padding:0 16px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.slot-ai-row button:hover{filter:brightness(1.08)}
.slot-ai-row button:disabled{opacity:.6;cursor:default}
.slot-ai-msg{font-size:12px;color:rgba(234,242,232,.45);margin-top:7px;min-height:14px}
.post-kind{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.75);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.post-kind:hover{background:rgba(255,255,255,.12)}
.post-kind.active{background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;border-color:transparent}
.slot-upload-btn{width:100%;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.slot-upload-btn:hover{background:#3dba52}

/* ---- DEPLOY MODAL ---- */
.deploy-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:20px}
.deploy-modal.on{display:flex}
.deploy-box{background:#fff;border-radius:20px;width:100%;max-width:580px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.2);max-height:90%;overflow-y:auto}
.deploy-header{padding:24px 28px 20px;border-bottom:1px solid #e5e7eb}
.deploy-header h2{font-size:20px;font-weight:800;color:#0f1a0d;letter-spacing:-.5px;margin-bottom:4px}
.deploy-header p{font-size:14px;color:#666}
.deploy-tabs{display:flex;border-bottom:1px solid #e5e7eb;background:#f9fafb}
.d-tab{flex:1;padding:12px;text-align:center;font-size:13px;font-weight:600;color:#888;border:none;background:transparent;cursor:pointer;font-family:inherit;position:relative;transition:color .15s}
.d-tab.active{color:#2d7a3a;background:#fff}
.d-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#2d7a3a}
.deploy-pane{display:none;padding:24px 28px}
.deploy-pane.active{display:block}
.d-wizard-step{padding:0}
.d-step-badge{display:inline-block;background:#e8f5e9;color:#2d7a3a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.d-step-title{font-size:17px;font-weight:800;color:#0f1a0d;margin-bottom:6px;letter-spacing:-.3px}
.d-step-desc{font-size:14px;color:#555;margin-bottom:18px;line-height:1.6}
.d-step-next{background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;width:100%}
.d-step-next:hover{background:#3dba52}
.d-step-next:disabled{opacity:.5;cursor:not-allowed}
.d-step-back{background:#f5f5f5;color:#555;border:none;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;font-family:inherit}
.d-step-back:hover{background:#e8e8e8}
.d-input-row{margin-bottom:12px}
.d-label{font-size:12px;font-weight:600;color:#555;margin-bottom:5px;display:flex;align-items:center;gap:6px}
.d-label a{color:#2d7a3a;font-size:11px}
.d-input{width:100%;border:1.5px solid #ddd;border-radius:8px;padding:9px 12px;font-size:14px;font-family:inherit;color:#111;outline:none;transition:border .15s}
.d-input:focus{border-color:#2d7a3a;box-shadow:0 0 0 3px rgba(45,122,58,.1)}
.d-btn{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.d-btn-n{background:#00c7b7;color:#fff}.d-btn-n:hover:not(:disabled){background:#00a89c;transform:translateY(-1px)}
.d-btn-cf{background:#f6821f;color:#fff}.d-btn-cf:hover:not(:disabled){background:#d86e15;transform:translateY(-1px)}
.d-btn:disabled{opacity:.5;cursor:not-allowed}
.d-result{background:#f0faf2;border:1.5px solid #c8e8c4;border-radius:10px;padding:14px;margin-top:12px;display:none}
.d-result.on{display:block}
.d-result-url{font-size:14px;font-weight:700;color:#0f1a0d;word-break:break-all;text-align:center}
.d-result-url a{color:#2d7a3a;text-decoration:none}
.d-result-url a:hover{text-decoration:underline}
.d-result-sub{font-size:12px;color:#666;margin-top:4px;text-align:center}
.d-error{background:#fff5f5;border:1.5px solid #fca5a5;border-radius:10px;padding:12px;margin-top:12px;font-size:13px;color:#dc2626;display:none}
.d-error.on{display:block}
.d-steps{list-style:none;display:flex;flex-direction:column;gap:14px}
.d-step{display:flex;gap:12px;align-items:flex-start}
.d-step-n{width:24px;height:24px;border-radius:7px;background:#f0faf2;border:1.5px solid #c8e8c4;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#2d7a3a;flex-shrink:0}
.d-step-txt{font-size:14px;color:#333;line-height:1.6}
.d-step-txt strong{display:block;font-weight:700;color:#0f1a0d;margin-bottom:1px}
.d-step-txt code{background:#f5f5f5;border-radius:4px;padding:1px 6px;font-size:12px;font-family:monospace;color:#c41d7f}
.d-guide-link{display:block;text-align:center;margin-top:16px;font-size:13px;color:#2d7a3a;text-decoration:none;font-weight:600}
.d-guide-link:hover{text-decoration:underline}
.d-provider-card{border:1.5px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:16px;position:relative}
.d-provider-card.recommended{border-color:#2d7a3a;background:#f0faf2}
.d-rec-badge{position:absolute;top:-1px;right:14px;background:#2d7a3a;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:0 0 8px 8px}
.d-prov-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.d-prov-logo{font-size:22px}
.d-prov-name{font-size:16px;font-weight:800;color:#0f1a0d}
.d-prov-sub{font-size:12px;color:#888;margin-top:1px}
.d-features{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.d-features li{font-size:13px;color:#444;display:flex;align-items:center;gap:7px}
.d-features li::before{content:'v';color:#2d7a3a;font-weight:700;font-size:12px}

/* ---- DEPLOY WIZARD STEP URL PREVIEW ---- */
#sitePreviewUrl{color:#00c7b7}

/* ---- RESPONSIVE ---- */
.s-mobtabs{display:none;gap:6px;padding:8px 10px;background:#0a1208;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}
.s-mobtab{flex:1;background:rgba(255,255,255,.05);color:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px}
.s-mobtab.active{background:rgba(45,122,58,.2);color:#4ade80;border-color:rgba(45,122,58,.4)}
.auth-ava{display:none;width:30px;height:30px;border-radius:50%;background:#2d7a3a;color:#fff;align-items:center;justify-content:center;font-weight:700;font-size:13px;line-height:1}
.auth-ava-guest{display:none;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12);align-items:center;justify-content:center;line-height:0}
@media(max-width:860px){
  .nav-burger{display:inline-flex}
  nav{gap:12px}
  .nav-links{display:none;position:absolute;top:calc(100% + 6px);right:5vw;flex-direction:column;gap:2px;background:#0b1709;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;min-width:190px;box-shadow:0 14px 36px rgba(0,0,0,.55);z-index:120}
  .nav-links.open{display:flex}
  .nav-links li{width:100%}
  .nav-links a{display:block;padding:11px 13px;border-radius:8px;color:rgba(255,255,255,.82);font-size:15px}
  .nav-links a:hover,.nav-links a:active{background:rgba(255,255,255,.06);color:#fff}
  .how-grid,.compare-grid,.price-grid{grid-template-columns:1fr 1fr}
  .type-grid{grid-template-columns:repeat(5,1fr)}
  .detail-grid{grid-template-columns:1fr}
  .detail-grid .span2{grid-column:1}
  .summary-grid{grid-template-columns:1fr}
  .s-header{gap:6px;padding:0 8px}
  .s-title{display:none}
  .s-sep{display:none}
  .s-actions{margin-left:0;flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
  .s-actions::-webkit-scrollbar{display:none}
  .s-mobtabs{display:flex}
  .s-body{flex-direction:column}
  .chat{width:100%;border-left:none;border-top:1px solid rgba(255,255,255,.06)}
  .s-body .chat{display:none}
  .s-body.mob-chat .chat{display:flex;flex:1}
  .s-body.mob-chat .preview-frame-wrap{display:none}
  .preview-frame-wrap{flex:1}
  .hero-stat{padding:12px 14px}
  .hero-stats{max-width:100%}
  .img-mobile-upload{display:flex}
}
@media(max-width:600px){
  .type-grid{grid-template-columns:repeat(3,1fr)}
  .how-grid,.compare-grid,.price-grid{grid-template-columns:1fr}
  nav{gap:8px;padding:0 12px}
  #signInBtn.is-authed{border:none !important;background:transparent !important;padding:0 !important;margin-right:4px;max-width:none;min-width:0}
  #signInBtn.is-authed .auth-name{display:none}
  #signInBtn.is-authed .auth-ava{display:inline-flex}
  #signInBtn:not(.is-authed){border:none !important;background:transparent !important;padding:0 !important;margin-right:4px;max-width:none;min-width:0}
  #signInBtn:not(.is-authed) .auth-name{display:none}
  #signInBtn:not(.is-authed) .auth-ava-guest{display:inline-flex}
}

/* ===== WS LIVELINESS (r272) ===== */
.ws-reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.ws-reveal.ws-in{opacity:1;transform:none}
#loading .load-icon{animation:wsGrowSway 2.4s ease-in-out infinite;transform-origin:50% 92%}
@keyframes wsGrowSway{0%{transform:scale(.72) rotate(-7deg)}50%{transform:scale(1.12) rotate(7deg)}100%{transform:scale(.72) rotate(-7deg)}}
.load-fill{background:linear-gradient(90deg,#2d7a3a,#4ade80)}
@keyframes wsBreathe{0%{box-shadow:0 6px 22px -4px rgba(34,197,94,.42)}50%{box-shadow:0 12px 36px -2px rgba(34,197,94,.9)}100%{box-shadow:0 6px 22px -4px rgba(34,197,94,.42)}}
.gen-btn:not(:disabled):not(:hover){animation:wsBreathe 3.6s ease-in-out infinite}
.hero-stat:last-child .stat-n{background:linear-gradient(120deg,#ffe3b3,#ff9e5e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.ws-showcase{padding:48px 5vw 6px;text-align:center;position:relative;overflow:hidden}
.ws-sc-head{font-family:'Sora',-apple-system,sans-serif;font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-1px;color:#fff;margin-bottom:8px}
.ws-sc-sub{color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;max-width:580px;margin:0 auto 26px}
.lp-faq{padding:96px 5vw;background:#050a04;border-top:1px solid rgba(255,255,255,.05)}
.lp-faq-inner{max-width:760px;margin:0 auto}
.lp-faq details{border-bottom:1px solid rgba(255,255,255,.08);padding:4px 0}
.lp-faq details:first-of-type{margin-top:28px;border-top:1px solid rgba(255,255,255,.08)}
.lp-faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;font-size:16px;font-weight:600;color:#fff}
.lp-faq summary::-webkit-details-marker{display:none}
.lp-faq summary::after{content:'+';font-size:22px;font-weight:400;color:#4ade80;transition:transform .2s}
.lp-faq details[open] summary::after{transform:rotate(45deg)}
.lp-faq details p{margin:0 0 20px;color:rgba(255,255,255,.66);font-size:15px;line-height:1.7;max-width:62ch}
.ws-ex-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;max-width:1120px;margin:0 auto;text-align:left}
.ws-ex{display:block;text-decoration:none;color:inherit;background:#0c160a;border:1px solid rgba(255,255,255,.09);border-radius:14px;overflow:hidden;box-shadow:0 18px 44px -22px rgba(0,0,0,.8);transition:transform .25s,border-color .25s,box-shadow .25s}
.ws-ex:hover,.ws-ex:focus-visible{transform:translateY(-4px);border-color:rgba(74,222,128,.45);box-shadow:0 26px 60px -24px rgba(0,0,0,.9)}
.ws-ex-bar{display:flex;align-items:center;gap:5px;height:26px;padding:0 10px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06)}
.ws-ex-bar span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.18)}
.ws-ex-bar em{font-style:normal;font-size:10.5px;color:rgba(255,255,255,.42);margin-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ws-ex-vp{position:relative;aspect-ratio:16/10;overflow:hidden;background:#f4f4f2}
.ws-ex-vp iframe{position:absolute;top:0;left:0;width:1280px;height:800px;border:0;transform-origin:0 0;transform:scale(var(--s,.27));pointer-events:none}
.ws-ex-cap{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:12px 14px}
.ws-ex-cap b{font-size:14px;color:#fff;font-weight:700}
.ws-ex-cap span{font-size:12px;color:rgba(255,255,255,.5)}
.ws-sc-note{font-size:12px;color:rgba(255,255,255,.4);margin:18px auto 0}
@media(max-width:900px){.ws-ex-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.ws-ex-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 -5vw;padding:4px 5vw 10px;scrollbar-width:none}.ws-ex-grid::-webkit-scrollbar{display:none}.ws-ex{flex:0 0 80%;scroll-snap-align:center}}
.ws-sc-viewport{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.ws-sc-track{display:flex;gap:18px;width:max-content;animation:wsMarquee 48s linear infinite}
.ws-sc-viewport:hover .ws-sc-track{animation-play-state:paused}
@keyframes wsMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.ws-sc-card{width:216px;flex:0 0 auto;background:#0c160a;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;box-shadow:0 16px 42px -20px rgba(0,0,0,.75)}
.ws-sc-bar{height:22px;display:flex;align-items:center;gap:5px;padding:0 10px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06)}
.ws-sc-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2)}
.ws-sc-hero{height:66px;background:linear-gradient(135deg,var(--h,#4ade80),transparent)}
.ws-sc-body{padding:13px 13px 16px;text-align:left}
.ws-sc-ln{height:7px;border-radius:4px;background:rgba(255,255,255,.1);margin-bottom:7px}
.ws-sc-pill{height:16px;width:66px;border-radius:8px;margin-top:11px;background:var(--h,#4ade80)}
.ws-sc-tag{font-size:11px;font-weight:700;letter-spacing:.4px;color:rgba(255,255,255,.55);text-transform:uppercase;margin-top:11px}
.ws-petal{position:fixed;z-index:2147483600;pointer-events:none;will-change:transform,opacity;animation:wsPetal 1.5s cubic-bezier(.2,.6,.2,1) forwards}
@keyframes wsPetal{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px))) rotate(var(--dr,0deg)) scale(1)}}
@media(prefers-reduced-motion:reduce){#loading .load-icon{animation:none}.gen-btn:not(:disabled):not(:hover){animation:none}.ws-sc-track{animation:none}.ws-reveal{opacity:1;transform:none}.ws-petal{display:none}}
.ic{width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.ic-only{margin-right:0}.chat-head-title .ic{margin-right:0}</style>
<script>try{var _wsDE=document.documentElement;if(localStorage.getItem('ws_rm')==='1')_wsDE.classList.add('ws-rm');if(localStorage.getItem('ws_focus')==='1')_wsDE.classList.add('ws-focus');}catch(_e){}
window.wsClearSiteState=function(){try{var _keep={ws_rm:1,ws_focus:1,ws_theme:1,ws_edhint:1};var _rm=[];for(var _i=0;_i<localStorage.length;_i++){var _k=localStorage.key(_i);if(_k&&_k.indexOf('ws')===0&&!_keep[_k])_rm.push(_k);}for(var _j=0;_j<_rm.length;_j++)localStorage.removeItem(_rm[_j]);}catch(_e2){}try{sessionStorage.clear();}catch(_e3){}};</script>
<style id="ws-revamp">
:root{--wsg:#34d399;--wsg2:#22c55e;--wscy:#22d3ee}
body{background:#050a04}
nav.scrolled{background:rgba(6,12,5,.78)!important;backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);border-bottom:1px solid rgba(255,255,255,.07)!important}
.nav-links a{position:relative;color:rgba(255,255,255,.7);font-weight:500;transition:color .18s}
.nav-links a:hover{color:#fff}
.nav-links a::after{content:"";position:absolute;left:0;right:100%;bottom:-5px;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--wsg),var(--wscy));transition:right .28s cubic-bezier(.2,.7,.2,1)}
.nav-links a:hover::after{right:0}
.hero{background:radial-gradient(1200px 720px at 50% -14%,rgba(52,211,153,.22),transparent 62%),radial-gradient(900px 560px at 86% 4%,rgba(34,211,238,.13),transparent 56%),radial-gradient(840px 600px at 8% 30%,rgba(34,197,94,.13),transparent 56%),#050a04!important}
.hero::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.055) 1px,transparent 1.1px);background-size:36px 36px;-webkit-mask-image:radial-gradient(1000px 600px at 50% 16%,#000,transparent 72%);mask-image:radial-gradient(1000px 600px at 50% 16%,#000,transparent 72%);opacity:.55}
.hero::after{content:"";position:absolute;left:50%;top:-60px;width:860px;height:480px;transform:translateX(-50%);z-index:0;pointer-events:none;background:radial-gradient(closest-side,rgba(52,211,153,.16),transparent 70%);filter:blur(6px)}
.hero>*{position:relative;z-index:1}
.hero-pill{background:rgba(52,211,153,.1)!important;border:1px solid rgba(52,211,153,.28)!important;color:#7ef2b8!important;box-shadow:0 0 0 4px rgba(52,211,153,.05),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(6px)}
.hero h1{font-size:clamp(3rem,6vw,5.2rem);letter-spacing:-2.6px;line-height:1.02;text-shadow:0 2px 46px rgba(52,211,153,.14)}
.hero-sub{font-size:19px;max-width:520px;color:rgba(255,255,255,.66)}
.hero-stats{border:1px solid rgba(255,255,255,.1)!important;border-radius:16px!important;background:rgba(255,255,255,.015);backdrop-filter:blur(6px);box-shadow:0 22px 54px -22px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04)}
.hero-stat{transition:background .2s}
.hero-stat:hover{background:rgba(52,211,153,.05)}
.stat-n{font-size:22px;letter-spacing:-.5px}
.builder-label{color:rgba(255,255,255,.5);letter-spacing:2.5px}
.dark-input:focus{border-color:rgba(52,211,153,.6)!important;box-shadow:0 0 0 3px rgba(52,211,153,.14)}
.gen-btn{box-shadow:0 10px 30px -8px rgba(34,197,94,.6),inset 0 1px 0 rgba(255,255,255,.3)}
.gen-btn:hover{transform:translateY(-2px);box-shadow:0 16px 42px -8px rgba(34,197,94,.72)}
.how-card,.cmp-card,.price-card{transition:transform .25s cubic-bezier(.2,.7,.2,1),border-color .25s,box-shadow .25s}
.how-card:hover,.cmp-card:hover,.price-card:hover{transform:translateY(-4px);border-color:rgba(52,211,153,.4);box-shadow:0 26px 54px -26px rgba(0,0,0,.72)}
.section-title{letter-spacing:-1px}
#signInBtn.is-authed{display:inline-flex;align-items:center;gap:8px}
#signInBtn.is-authed::after{content:"";width:7px;height:7px;border-right:2px solid rgba(255,255,255,.5);border-bottom:2px solid rgba(255,255,255,.5);transform:rotate(45deg) translate(-1px,-1px);transition:transform .2s;flex:none}
#signInBtn.is-authed[aria-expanded="true"]::after{transform:rotate(-135deg)}
.acct-wrap{position:relative;display:inline-flex}
.acct-menu{position:absolute;top:calc(100% + 12px);right:0;width:304px;background:linear-gradient(180deg,rgba(16,27,14,.98),rgba(9,16,8,.98));border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 30px 70px -20px rgba(0,0,0,.75),0 0 0 1px rgba(52,211,153,.08),inset 0 1px 0 rgba(255,255,255,.05);padding:7px;opacity:0;transform:translateY(-8px) scale(.97);transform-origin:top right;pointer-events:none;transition:opacity .18s ease,transform .18s cubic-bezier(.2,.8,.2,1);z-index:300;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.acct-menu.open{opacity:1;transform:none;pointer-events:auto}
.acct-head{display:flex;align-items:center;gap:11px;padding:11px 10px 12px}
.acct-ava-lg{width:42px;height:42px;flex:none;border-radius:12px;background:linear-gradient(135deg,#4ade80,#16a34a);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#06210f;box-shadow:0 4px 14px -4px rgba(34,197,94,.6)}
.acct-id{min-width:0;flex:1}
.acct-name{font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acct-email{font-size:12px;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acct-plan{font-size:10px;font-weight:800;letter-spacing:.5px;padding:3px 8px;border-radius:100px;flex:none}
.acct-plan.free{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6)}
.acct-plan.pro{background:linear-gradient(135deg,#f5c542,#2d9e4a);color:#06120a}
.acct-upsell{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;text-align:left;margin:2px 0 4px;padding:11px 13px;border:1px solid rgba(52,211,153,.3);border-radius:11px;background:linear-gradient(135deg,rgba(52,211,153,.16),rgba(34,197,94,.06));color:#eafff2;cursor:pointer;font-family:inherit;transition:border-color .18s,background .18s}
.acct-upsell:hover{border-color:rgba(52,211,153,.6);background:linear-gradient(135deg,rgba(52,211,153,.24),rgba(34,197,94,.1))}
.acct-upsell b{font-size:13.5px;font-weight:700;display:block}
.acct-upsell-sub{font-size:11.5px;color:rgba(255,255,255,.6)}
.acct-upsell-arrow{font-size:16px;color:#7ef2b8}
.acct-sep{height:1px;background:rgba(255,255,255,.08);margin:5px 6px}
.acct-item{display:flex;align-items:center;gap:11px;width:100%;text-align:left;padding:9px 11px;border:none;border-radius:9px;background:transparent;color:rgba(255,255,255,.82);font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;text-decoration:none;transition:background .14s,color .14s}
.acct-item:hover{background:rgba(255,255,255,.06);color:#fff}
.acct-item .ami-ic{flex:none;color:rgba(255,255,255,.5);transition:color .14s}
.acct-item:hover .ami-ic{color:var(--wsg)}
.acct-item span{flex:1}
.acct-count{flex:none!important;font-size:11px;font-weight:700;color:rgba(255,255,255,.5);background:rgba(255,255,255,.08);padding:1px 8px;border-radius:100px}
.acct-item.danger{color:#ff9b8a}
.acct-item.danger:hover{background:rgba(220,80,60,.14);color:#ffb3a5}
.acct-item.danger .ami-ic{color:#ff9b8a}
.price-card.pick{border-color:rgba(52,211,153,.45)!important;box-shadow:0 0 0 1px rgba(52,211,153,.22),0 28px 64px -26px rgba(34,197,94,.42)!important}
.cmp-card.highlight{border-color:rgba(52,211,153,.4)!important;box-shadow:0 0 56px -22px rgba(34,197,94,.4)!important}
.how-step-num{background:linear-gradient(135deg,rgba(52,211,153,.22),rgba(34,197,94,.08))!important;border:1px solid rgba(52,211,153,.35)!important;color:#7ef2b8!important;box-shadow:0 6px 18px -8px rgba(34,197,94,.4)}
.trust-bar{background:#050a04!important;border-top:1px solid rgba(255,255,255,.06)}
@media(max-width:600px){.acct-menu{position:fixed;top:60px;right:3vw;left:3vw;width:auto}}
.ws-ed-host{padding:4px 14px 14px;border-bottom:1px solid rgba(255,255,255,.06)}
.ws-ed-host:empty{display:none}
.qa-screen{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:24px;background:radial-gradient(1200px 720px at 50% -12%,rgba(52,211,153,.16),transparent 60%),radial-gradient(900px 560px at 85% 110%,rgba(34,211,238,.1),transparent 55%),#050a04;opacity:0;transition:opacity .32s ease}
.qa-screen.on{display:flex;opacity:1}
.qa-box{width:100%;max-width:400px;text-align:center;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif}
.qa-logo{display:inline-flex;width:64px;height:64px;align-items:center;justify-content:center;border-radius:19px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.26);box-shadow:0 0 0 7px rgba(52,211,153,.045),0 14px 40px -12px rgba(34,197,94,.5);margin-bottom:22px;animation:qaPulse 2.4s ease-in-out infinite}
@keyframes qaPulse{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.05)}}
.qa-title{font-size:24px;font-weight:800;color:#fff;letter-spacing:-.5px;margin:0 0 6px}
.qa-sub{font-size:14px;color:rgba(255,255,255,.52);margin:0 0 30px}
.qa-steps{list-style:none;margin:0 auto 26px;padding:0;max-width:286px;text-align:left;display:flex;flex-direction:column;gap:2px}
.qa-step{display:flex;align-items:center;gap:13px;padding:9px 6px;font-size:14px;font-weight:500;color:rgba(255,255,255,.38);transition:color .3s}
.qa-step.active{color:#fff}
.qa-step.done{color:rgba(255,255,255,.78)}
.qa-ic{flex:none;width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,.17);position:relative;box-sizing:border-box;transition:border-color .3s,background .3s}
.qa-step.active .qa-ic{border-color:#4ade80;border-top-color:transparent;animation:qaSpin .7s linear infinite}
@keyframes qaSpin{to{transform:rotate(360deg)}}
.qa-step.done .qa-ic{border-color:#34d399;background:#34d399;animation:none}
.qa-step.done .qa-ic::after{content:"";position:absolute;left:6px;top:2.5px;width:5px;height:9px;border:solid #06210f;border-width:0 2px 2px 0;transform:rotate(45deg)}
.qa-bar{height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;max-width:286px;margin:0 auto}
.qa-fill{height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,#34d399,#22d3ee);transition:width .45s cubic-bezier(.3,.7,.3,1)}
@media(prefers-reduced-motion:reduce){.qa-logo{animation:none}.qa-step.active .qa-ic{animation:none;border-top-color:#4ade80}}
</style>
<script id="ws-qa">
(function(){
  var START=0, DUR=2500;
  window.wsQaShow=function(){
    var sc=document.getElementById('qaScreen');if(!sc)return;
    var steps=sc.querySelectorAll('.qa-step');var fill=document.getElementById('qaFill');
    for(var k=0;k<steps.length;k++)steps[k].className='qa-step';
    if(fill)fill.style.width='0%';
    sc.classList.add('on');sc.setAttribute('aria-hidden','false');
    START=Date.now();
    var n=steps.length;var per=n?Math.max(300,Math.floor(DUR/n)):400;var i=0;
    (function tick(){
      if(i>0){steps[i-1].classList.remove('active');steps[i-1].classList.add('done');}
      if(i<n){steps[i].classList.add('active');if(fill)fill.style.width=Math.round(((i+1)/n)*94)+'%';i++;setTimeout(tick,per);}
      else{if(fill)fill.style.width='97%';}
    })();
  };
  window.wsQaHide=function(cb){
    var sc=document.getElementById('qaScreen');
    if(!sc||!sc.classList.contains('on')){if(typeof cb==='function')cb();return;}
    var wait=Math.max(0,DUR-(Date.now()-(START||Date.now())));
    setTimeout(function(){
      var steps=sc.querySelectorAll('.qa-step');for(var k=0;k<steps.length;k++){steps[k].classList.remove('active');steps[k].classList.add('done');}
      var fill=document.getElementById('qaFill');if(fill)fill.style.width='100%';
      setTimeout(function(){
        sc.classList.remove('on');sc.setAttribute('aria-hidden','true');
        if(typeof cb==='function')cb();
      },320);
    },wait);
  };
})();
</script>
<script id="ws-acctmenu">
(function(){
  function dn(me){var n=((me&&me.name)||'').trim();if(n)return n.split(' ')[0];var em=((me&&me.email)||'').trim();if(em){var lp=em.split('@')[0].split(/[._+]/)[0];if(lp)return lp.charAt(0).toUpperCase()+lp.slice(1);}return 'there';}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function ic(p){return '<svg class="ami-ic" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
  function build(me){
    var el=document.getElementById('acctMenu');if(!el)return;
    var full=(((me&&me.name)||'').trim())||dn(me);var email=(me&&me.email)||'';var pro=!!(me&&me.pro);var ini=(full||'Y').charAt(0).toUpperCase();
    var sites=0;try{sites=JSON.parse(localStorage.getItem('ws_projects')||'[]').length;}catch(e){}
    var h='';
    h+='<div class="acct-head"><div class="acct-ava-lg">'+esc(ini)+'</div><div class="acct-id"><div class="acct-name">'+esc(full)+'</div><div class="acct-email">'+esc(email)+'</div></div><span class="acct-plan '+(pro?'pro':'free')+'">'+(pro?'PRO':'FREE')+'</span></div>';
    if(!pro)h+='<button class="acct-upsell" data-act="billing"><span><b>Upgrade to Pro</b><span class="acct-upsell-sub">Your domain, no badge, the code</span></span><span class="acct-upsell-arrow">&#8594;</span></button>';
    h+='<div class="acct-sep"></div>';
    h+='<button class="acct-item" data-act="sites" role="menuitem">'+ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>')+'<span>My sites</span>'+(sites?'<span class="acct-count">'+sites+'</span>':'')+'</button>';
    h+='<button class="acct-item" data-act="account" role="menuitem">'+ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')+'<span>Account &amp; settings</span></button>';
    h+='<button class="acct-item" data-act="billing" role="menuitem">'+ic('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>')+'<span>'+(pro?'Billing &amp; plan':'Plans &amp; pricing')+'</span></button>';
    h+='<a class="acct-item" href="/deploy-guide" target="_blank" rel="noopener" role="menuitem">'+ic('<path d="M12 3v13"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/>')+'<span>Deploy guide</span></a>';
    h+='<button class="acct-item" data-act="help" role="menuitem">'+ic('<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.4 2.4 0 1 1 3.2 2.3c-.8.3-1.3 1-1.3 1.9"/><circle cx="12" cy="16.6" r=".6" fill="currentColor"/>')+'<span>Help &amp; support</span></button>';
    if(me&&me.owner)h+='<a class="acct-item" href="/admin" role="menuitem">'+ic('<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="5"/><rect x="13" y="8" width="3" height="9"/>')+'<span>Admin dashboard</span></a>';
    h+='<div class="acct-sep"></div>';
    h+='<button class="acct-item danger" data-act="signout" role="menuitem">'+ic('<path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>')+'<span>Sign out</span></button>';
    el.innerHTML=h;
  }
  function close(){var el=document.getElementById('acctMenu');if(el){el.classList.remove('open');el.setAttribute('aria-hidden','true');}var b=document.getElementById('signInBtn');if(b)b.setAttribute('aria-expanded','false');}
  window.wsCloseAcctMenu=close;
  window.wsToggleAcctMenu=function(me){var el=document.getElementById('acctMenu');if(!el)return;if(el.classList.contains('open')){close();return;}build(me||window._wsUser||{});el.classList.add('open');el.setAttribute('aria-hidden','false');var b=document.getElementById('signInBtn');if(b)b.setAttribute('aria-expanded','true');};
  function act(a){
    close();
    if(a==='sites'){if(window.openMySites)window.openMySites();else{var ml=document.getElementById('mySitesLink');if(ml)ml.click();}}
    else if(a==='account'){if(window.openProfile)window.openProfile();}
    else if(a==='billing'){if(window.openProfile)window.openProfile();}
    else if(a==='help'){var sl=document.getElementById('supportLink');if(sl)sl.click();}
    else if(a==='signout'){
      var go=function(){try{if(window.wsClearSiteState)window.wsClearSiteState();}catch(e){}fetch('/auth/logout').then(function(){location.href='/';}).catch(function(){location.href='/';});};
      if(window.wsConfirm){window.wsConfirm({title:'Sign out?',message:'You can sign back in anytime with the same email.',okLabel:'Sign out',cancelLabel:'Stay signed in'}).then(function(ok){if(ok)go();});}else{go();}
    }
  }
  document.addEventListener('click',function(e){
    var el=document.getElementById('acctMenu');if(!el)return;
    var t=e.target;
    var item=(t&&t.closest)?t.closest('[data-act]'):null;
    if(item&&el.contains(item)){e.preventDefault();act(item.getAttribute('data-act'));return;}
    if(el.classList.contains('open')){var wrap=document.getElementById('acctWrap');if(wrap&&!wrap.contains(t))close();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.keyCode===27)close();});
})();
</script>
<style id="wsStudioV4">
/* ===== Studio v4: the site is the star; the tools stay small, quiet and out of the way ===== */
.studio{background:#0c0e0d}
.s-header{height:48px;padding:0 10px 0 14px;gap:8px;background:#0c0e0d;border-bottom:1px solid rgba(255,255,255,.06)}
.s-header .live-dot,.edit-counter,.preview-label{display:none!important}
.s-title{font-size:13px;font-weight:600;color:rgba(255,255,255,.88);flex:0 1 auto;max-width:240px}
.s-header .logo-mark{opacity:.9}
.device-btns{margin:0 auto 0 12px}
.s-actions{gap:4px;align-items:center}
.s-btn{border-radius:8px;padding:7px 10px;font-size:12.5px;line-height:1;display:inline-flex;align-items:center;gap:6px}
.s-btn .ic{margin-right:0}
.s-ghost{background:transparent!important;border:1px solid transparent!important;color:rgba(255,255,255,.72)!important}
.s-ghost:hover:not(:disabled){background:rgba(255,255,255,.07)!important;color:#fff!important}
.s-ghost:disabled{opacity:.32}
#undoBtn .s-lbl,#redoBtn .s-lbl,#fullscreenBtn .s-lbl{display:none}
#undoBtn,#redoBtn,#mySitesBtn,#panelToggle{padding:7px 8px}
.s-sep{width:1px;height:20px;background:rgba(255,255,255,.08);margin:0 4px}
#getSiteBtn{background:#2f9e4f!important;border-color:#2f9e4f!important;padding:8px 14px;font-weight:700}
#getSiteBtn:hover{background:#38b25b!important}
#unlockBtn{background:transparent!important;color:#c4b5fd!important;border:1px solid rgba(167,139,250,.35)!important;padding:7px 11px;box-shadow:none!important}
#unlockBtn:hover{background:rgba(167,139,250,.12)!important;color:#fff!important}
#saveStatus{font-weight:500!important;color:rgba(255,255,255,.5)!important}
body.ws-v3 #editModeBtn{display:none!important}
.s-body{background:#1a1c1b}
.preview-frame-wrap{background:#e9eae8}
.chat{width:308px;background:#111312;border-left:1px solid rgba(255,255,255,.06)}
body.ws-v3 .chat-head,body.ws-v3 .chat-msgs,body.ws-v3 .typing,body.ws-v3 .img-library,body.ws-v3 .biz-panel{display:none!important}
body.ws-v3 .ws-ed-host{padding:10px 12px 18px;border-bottom:none}
body.ws-v3 #designDrawer,body.ws-v3 #edFirstHint{display:none!important}
.studio.panel-off .chat{display:none}
#panelToggle.on{color:#fff!important;background:rgba(255,255,255,.08)!important}
/* panel tabs + controls */
.wse-ptabs{display:flex;gap:2px;background:rgba(255,255,255,.05);border-radius:10px;padding:3px;margin:0 0 12px;position:sticky;top:0;z-index:2;backdrop-filter:blur(8px)}
.wse-ptab{flex:1;background:none;border:none;color:rgba(255,255,255,.6);font:600 12.5px/1 system-ui,-apple-system,sans-serif;padding:9px 0;border-radius:8px;cursor:pointer}
.wse-ptab:hover{color:#fff}
.wse-ptab.on{background:#2a2d2b;color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4)}
.wse-hint{font-size:11.5px;line-height:1.45;color:rgba(255,255,255,.5)}
.wse-tip{background:rgba(55,193,94,.08);border:1px solid rgba(55,193,94,.18);border-radius:9px;padding:9px 11px;margin:0 0 4px;color:rgba(214,245,222,.8)}
.wse-row{display:flex;align-items:center;gap:10px}
.wse-wide{width:100%}
.wse-color{width:44px;height:36px;flex:none;border:1px solid rgba(255,255,255,.14);border-radius:9px;background:none;padding:2px;cursor:pointer}
.wse-seg{display:flex;gap:2px;background:rgba(255,255,255,.05);border-radius:9px;padding:3px}
.wse-segb{flex:1;background:none;border:none;color:rgba(255,255,255,.62);font:600 12px/1 system-ui,sans-serif;padding:8px 0;border-radius:7px;cursor:pointer}
.wse-segb.on{background:#2a2d2b;color:#fff}
.wse-pals{max-height:none!important}
.wse-photos{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.wse-photo{width:64px;height:48px;border-radius:8px;border:1px dashed rgba(255,255,255,.25);background:rgba(255,255,255,.04) center/cover no-repeat;color:rgba(255,255,255,.6);font:600 11px/1 system-ui,sans-serif;cursor:pointer}
.wse-photo.has{border-style:solid;border-color:rgba(255,255,255,.18)}
.wse-photo:hover{border-color:#37c15e;color:#fff}
.slot-search{margin-bottom:6px}
.slot-search-row{display:flex;gap:8px}
.slot-search-row input{flex:1;min-width:0;background:#0b0f0c;border:1px solid rgba(255,255,255,.14);border-radius:9px;color:#fff;padding:10px 12px;font:14px/1.2 inherit;outline:none}
.slot-search-row input:focus{border-color:#37c15e}
.slot-search-row button{background:#2f9e4f;color:#fff;border:0;border-radius:9px;padding:0 16px;font-weight:700;cursor:pointer;font-family:inherit}
.slot-search-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px;max-height:300px;overflow-y:auto}
.slot-search-grid:empty{display:none}
.slot-search-grid button{all:unset;cursor:pointer;position:relative;aspect-ratio:4/3;border-radius:8px;overflow:hidden;background:#1c1f1d}
.slot-search-grid img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .2s}
.slot-search-grid button:hover img,.slot-search-grid button:focus-visible img{transform:scale(1.05)}
.slot-search-grid button:focus-visible{outline:2px solid #37c15e;outline-offset:2px}
.slot-search-grid span{position:absolute;left:0;right:0;bottom:0;padding:3px 6px;font-size:10px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.7));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.slot-search-note{font-size:11px;color:rgba(255,255,255,.5);margin-top:8px}
.wse-logo{display:flex;align-items:center;gap:10px}
.wse-logo-prev{width:88px;height:44px;border-radius:8px;border:1px dashed rgba(255,255,255,.25);background:#fff center/contain no-repeat;flex:none}
.wse-ver{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,.06);font-size:12.5px;color:rgba(255,255,255,.82)}
.wse-det{border:1px solid rgba(255,255,255,.08);border-radius:11px;margin:14px 0 0;background:rgba(255,255,255,.02)}
.wse-det>summary{cursor:pointer;list-style:none;padding:12px;font:600 13px/1 system-ui,sans-serif;color:#fff;display:flex;justify-content:space-between}
.wse-det>summary::-webkit-details-marker{display:none}
.wse-det>summary::after{content:'+';color:#6fd389;font-size:16px}
.wse-det[open]>summary::after{content:'−'}
.wse-detb{padding:0 12px 12px}
.wse-hours{display:flex;flex-direction:column;gap:5px}
.wse-hrow{display:grid;grid-template-columns:30px minmax(0,1fr) minmax(0,1fr) auto;gap:5px;align-items:center}
.wse-hrow input[type=time]{min-width:0;width:100%;padding:7px 4px}
.wse-hrow .wse-field{padding:7px 8px;font-size:12px}
.wse-hrow .wse-field:disabled{opacity:.35}
.wse-hday{font:600 12px/1 system-ui,sans-serif;color:rgba(255,255,255,.75)}
.wse-hclosed{font-size:11.5px;color:rgba(255,255,255,.6);white-space:nowrap;cursor:pointer}
.wse-score{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.wse-ring{--p:0;width:48px;height:48px;border-radius:50%;flex:none;display:grid;place-items:center;background:conic-gradient(#37c15e calc(var(--p)*1%),rgba(255,255,255,.1) 0)}
.wse-ring b{width:38px;height:38px;border-radius:50%;background:#151816;display:grid;place-items:center;font:700 14px/1 system-ui,sans-serif;color:#fff}
.wse-score-t{font:700 14px/1.3 system-ui,sans-serif;color:#fff}
.wse-chk{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-top:1px solid rgba(255,255,255,.06);font-size:12.5px;color:rgba(255,255,255,.85)}
.wse-chk-i{width:16px;height:16px;flex:none;border-radius:50%;border:1.5px solid rgba(255,255,255,.3);display:grid;place-items:center;font-size:10px;color:#0c0e0d;margin-top:1px}
.wse-chk.ok .wse-chk-i{background:#37c15e;border-color:#37c15e}
.wse-chk.ok .wse-chk-l{color:rgba(255,255,255,.5)}
.wse-chk-l{flex:1}
.wse-glist{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.wse-gopt{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:2px;padding:9px 10px;border:1px solid rgba(255,255,255,.1);border-radius:9px;font-size:12.5px;color:#fff}
.wse-gopt span{color:rgba(255,255,255,.55);font-size:11.5px}
.wse-gopt:hover,.wse-gopt:focus-visible{border-color:#37c15e;background:rgba(55,193,94,.08)}
.wse-card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:12px}
.wse-ok{font:700 13px/1.3 system-ui,sans-serif;color:#7fe39a;margin-bottom:6px}
.wse-ok::before{content:'✓  '}
/* Pro upsell: a small pill in the corner instead of a card over the site */
.lock-badge{position:fixed!important;left:14px!important;right:auto!important;bottom:14px!important;padding:0!important;background:transparent!important;border:none!important;box-shadow:none!important;max-width:280px;z-index:20}
.lock-badge .lock-title{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:#1b1530;color:#ddd6fe;border:1px solid rgba(167,139,250,.35);border-radius:999px;padding:8px 13px;font:600 12px/1 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25)}
.lock-badge:not(.open) .lock-sub,.lock-badge:not(.open) .lock-email,.lock-badge:not(.open) #lockPayBtn{display:none}
.lock-badge.open{background:#0f0a2e!important;border:1px solid rgba(109,40,217,.3)!important;border-radius:14px;padding:14px!important;box-shadow:0 8px 32px rgba(0,0,0,.5)!important}
.lock-badge.open .lock-title{background:none;border:none;box-shadow:none;padding:0 0 8px}
@media(max-width:860px){
  .s-header{padding:0 8px}
  #unlockBtn,#saveStatus,#panelToggle{display:none!important}
  .chat{width:100%;border-left:none}
  .studio.panel-off .chat{display:flex}
  .device-btns{display:none}
}
</style>
</head>