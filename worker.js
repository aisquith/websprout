// WEBSPROUT — Cloudflare Worker
// Env variables: GEMINI_API_KEY (required), GEMINI_API_KEY2 (optional fallback), RESEND_API_KEY, KV

// $10/mo unlimited subscription — create a RECURRING ($10/month) Payment Link in your
// Stripe dashboard and paste its URL here. Set its success URL to https://websprout.app/?sub=success
const SUB_LINK = 'https://buy.stripe.com/00w00kgq56Bd1ds2Wy6Na00';
// Support inbox — SERVER-SIDE ONLY. Never interpolated into PAGE, so it never appears in page source.
const SUPPORT_EMAIL = 'michael.aisquith@gmail.com';

// Reveal safety-net: ships inside every generated site (preview AND download).
// Preserves the site's own CSS animations — it watches elements with an
// IntersectionObserver and only force-reveals one if it is STILL hidden ~1.7s after
// scrolling into view (rescuing a broken or absent observer), so scroll-reveal and
// entrance animations play normally while a stuck animation can never leave a blank
// page. Skips positioned overlays (modals, menus, dropdowns) so hidden UI keeps working.
const NAV_CONTRAST_SCRIPT = '<scr'+'ipt id="_wsNavContrast">(function(){function prgb(c){c=c||"";var i=c.indexOf("(");if(i<0)return null;var j=c.indexOf(")");var a=c.slice(i+1,j).split(",");var o=[];for(var k=0;k<a.length;k++)o.push(parseFloat(a[k]));return o.length>=3?o:null;}function al(p){return p.length>3?p[3]:1;}function lum(p){if(!p||al(p)<0.05)return -1;function ch(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*ch(p[0])+0.7152*ch(p[1])+0.0722*ch(p[2]);}function gradLum(bi){var i=0,sum=0,n=0;while(true){var a=bi.indexOf("rgb",i);if(a<0)break;var b=bi.indexOf(")",a);if(b<0)break;var p=prgb(bi.slice(a,b+1));if(p){var l=lum(p);if(l>=0){sum+=l;n++;}}i=b+1;}return n?sum/n:-1;}function bgLumOf(el){while(el){var s=getComputedStyle(el);var p=prgb(s.backgroundColor);if(p&&al(p)>0.5){var l=lum(p);if(l>=0)return l;}var bi=s.backgroundImage||"";if(bi.indexOf("gradient")>-1){var gl=gradLum(bi);if(gl>=0)return gl;}if(el===document.documentElement)break;el=el.parentElement;}return -1;}function behind(nav){var r=nav.getBoundingClientRect();var x=r.left+r.width/2,y=r.top+r.height/2;var pe=nav.style.pointerEvents,vs=nav.style.visibility;nav.style.pointerEvents="none";nav.style.visibility="hidden";var el=document.elementFromPoint(x,y);nav.style.pointerEvents=pe;nav.style.visibility=vs;return el;}function fix(){var nav=document.querySelector("header nav")||document.querySelector("header")||document.querySelector("nav");if(!nav)return;var sy=getComputedStyle(nav);var np=prgb(sy.backgroundColor);var bgL;if(np&&al(np)>0.5){bgL=lum(np);}else{var u=behind(nav);bgL=u?bgLumOf(u):-1;if(bgL<0)bgL=bgLumOf(nav);}if(bgL<0)return;var wantDark=bgL>0.5;var targets=nav.querySelectorAll("a,button,span,strong,em,li,div,h1,h2,h3,h4,h5,h6,p");for(var i=0;i<targets.length;i++){var t=targets[i];if(t.children.length&&t.textContent.trim()===(t.children[0].textContent||"").trim())continue;var isBtn=t.tagName==="BUTTON"||(t.tagName==="A"&&t.className&&(String(t.className).indexOf("btn")>-1||String(t.className).indexOf("button")>-1||String(t.className).indexOf("cta")>-1));if(isBtn)continue;var cl=lum(prgb(getComputedStyle(t).color));if(cl<0)continue;if(Math.abs(cl-bgL)<0.3){t.style.setProperty("color",wantDark?"#111":"#fff","important");}}}fix();setTimeout(fix,400);setTimeout(fix,1200);window.addEventListener("scroll",function(){fix();},{passive:true});window.addEventListener("resize",function(){fix();},{passive:true});})();</scr'+'ipt>';
const REVEAL_SCRIPT = '<scr'+'ipt id="_wsReveal">(function(){var SEL="section,header,footer,main,article,aside,div,nav,h1,h2,h3,h4,h5,h6,p,img,ul,ol,li,figure,blockquote,span,a,button";function inflow(el){var p=getComputedStyle(el).position;return !(p==="fixed"||p==="absolute");}function hidden(el){var s=getComputedStyle(el);return parseFloat(s.opacity)<0.05||s.visibility==="hidden";}function show(el){el.style.setProperty("opacity","1","important");el.style.setProperty("visibility","visible","important");el.style.setProperty("transform","none","important");}function base(){var de=document.documentElement;if(de&&parseFloat(getComputedStyle(de).opacity)<0.05)de.style.opacity="1";var b=document.body;if(b){if(parseFloat(getComputedStyle(b).opacity)<0.05)b.style.opacity="1";if(getComputedStyle(b).visibility==="hidden")b.style.visibility="visible";}}function arm(){base();var els=document.body?document.body.querySelectorAll(SEL):[];if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var t=en.target;io.unobserve(t);setTimeout(function(){if(inflow(t)&&hidden(t))show(t);},1700);}});},{threshold:0.01,rootMargin:"0px 0px -8% 0px"});for(var i=0;i<els.length;i++){try{if(inflow(els[i])&&hidden(els[i]))io.observe(els[i]);}catch(e){}}}else{for(var j=0;j<els.length;j++){try{if(inflow(els[j])&&hidden(els[j]))show(els[j]);}catch(e){}}}}function sweep(){base();var els=document.body?document.body.querySelectorAll(SEL):[];var vh=window.innerHeight||800;for(var k=0;k<els.length;k++){try{if(inflow(els[k])&&hidden(els[k])){var r=els[k].getBoundingClientRect();if(r.top<vh)show(els[k]);}}catch(e){}}}base();if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",arm);}else{arm();}setTimeout(sweep,6000);window.addEventListener("load",function(){setTimeout(sweep,3500);});})();</scr'+'ipt>';

// Bake the reveal net into a finished HTML document (idempotent)
const CTA_EDGE_SCRIPT = '<scr'+'ipt id="_wsCtaEdge">(function(){function prgb(c){c=c||"";var i=c.indexOf("(");if(i<0)return null;var j=c.indexOf(")");var a=c.slice(i+1,j).split(",");var o=[];for(var k=0;k<a.length;k++)o.push(parseFloat(a[k]));return o.length>=3?o:null;}function al(p){return p.length>3?p[3]:1;}function lum(p){if(!p||al(p)<0.05)return -1;function ch(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*ch(p[0])+0.7152*ch(p[1])+0.0722*ch(p[2]);}function dist(a,b){if(!a||!b)return 999;var dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2];return Math.sqrt(dr*dr+dg*dg+db*db);}function opBg(el){while(el&&el!==document.documentElement){var p=prgb(getComputedStyle(el).backgroundColor);if(p&&al(p)>0.5)return p;el=el.parentElement;}return prgb(getComputedStyle(document.body).backgroundColor)||[255,255,255,1];}function behind(el){var r=el.getBoundingClientRect();var x=r.left+r.width/2,y=r.top+r.height/2;var pe=el.style.pointerEvents,vs=el.style.visibility;el.style.pointerEvents="none";el.style.visibility="hidden";var t=document.elementFromPoint(x,y);el.style.pointerEvents=pe;el.style.visibility=vs;return t;}function below(el){var r=el.getBoundingClientRect();var y=r.bottom+6;if(y>=(window.innerHeight||800))return null;return document.elementFromPoint(r.left+r.width/2,y);}function near(a,b){return !!a&&!!b&&dist(a,b)<72;}function run(){var vh=window.innerHeight||800;var els=document.querySelectorAll("a,button");for(var i=0;i<els.length;i++){var el=els[i];if(el.getAttribute("data-wsedge"))continue;var s=getComputedStyle(el);var bg=prgb(s.backgroundColor);if(!bg||al(bg)<0.6)continue;var bw=parseFloat(s.borderTopWidth)||0;var bc=prgb(s.borderTopColor);if(bw>0.6&&bc&&al(bc)>0.3)continue;var r=el.getBoundingClientRect();if(r.width<90||r.width>560||r.height<34||r.height>96)continue;if(r.top<0||r.top>vh*1.6)continue;var bel=opBg(below(el)||document.body);var beh=opBg(behind(el)||document.body);if(near(bg,bel)||near(bg,beh)){var edge=lum(bg)>0.5?"rgba(0,0,0,.4)":"rgba(255,255,255,.55)";el.style.setProperty("box-shadow","0 0 0 1.5px "+edge+", 0 6px 20px rgba(0,0,0,.22)","important");el.setAttribute("data-wsedge","1");}}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run);}else{run();}setTimeout(run,500);setTimeout(run,1400);window.addEventListener("resize",run,{passive:true});})();</scr'+'ipt>';
const NAV_DEDUPE_SCRIPT = '<scr'+'ipt id="_wsNavDedupe">(function(){function txt(a){return (a.textContent||"").trim().toLowerCase();}function vis(el){if(!el)return false;var s=getComputedStyle(el);if(s.display==="none"||s.visibility==="hidden"||parseFloat(s.opacity||"1")<0.05)return false;var r=el.getBoundingClientRect();return r.width>1&&r.height>1;}function links(g){var a=g.querySelectorAll("a"),r=[];for(var i=0;i<a.length;i++){if(txt(a[i]))r.push(a[i]);}return r;}function orient(ls){var t=[],l=[];for(var i=0;i<ls.length;i++){var r=ls[i].getBoundingClientRect();t.push(r.top);l.push(r.left);}var cs=Math.max.apply(null,t)-Math.min.apply(null,t),rs=Math.max.apply(null,l)-Math.min.apply(null,l);return cs>rs?"v":"h";}function tset(ls){var o={};for(var i=0;i<ls.length;i++)o[txt(ls[i])]=1;return o;}function jac(a,b){var u={},c=0,n=0;for(var k in a){u[k]=1;if(b[k])c++;}for(var k2 in b)u[k2]=1;for(var k3 in u)n++;return n?c/n:0;}function inHeader(el){var q=el;while(q){if(q.tagName==="HEADER")return true;q=q.parentElement;}return false;}function idx(arr,o){for(var i=0;i<arr.length;i++)if(arr[i]===o)return i;return -1;}function score(g,iw){var r=g.el.getBoundingClientRect(),s2=0;if(r.left>=-2&&r.right<=iw+2)s2+=1000;if(g.o==="h")s2+=500;if(inHeader(g.el))s2+=200;return s2-r.top;}function underlined(ls){var u=0;for(var i=0;i<ls.length;i++){var s2=getComputedStyle(ls[i]);var td=(s2.textDecorationLine||"")+" "+(s2.textDecoration||"");if(td.indexOf("underline")>-1)u++;}return u*2>=ls.length;}function bullets(){var q=document.querySelectorAll("header ul,header ol,nav ul,nav ol,ul[class*=nav],ul[class*=menu]");for(var i=0;i<q.length;i++)q[i].style.setProperty("list-style","none","important");}function restore(){var h=document.querySelectorAll("[data-wshid]");for(var i=0;i<h.length;i++){h[i].style.removeProperty("display");h[i].removeAttribute("data-wshid");}var nf=document.querySelectorAll("[data-wsnavfix]");for(var j=0;j<nf.length;j++){var e=nf[j];var P=["display","flex-wrap","align-items","column-gap","row-gap","list-style"];for(var k=0;k<P.length;k++)e.style.removeProperty(P[k]);var al=e.querySelectorAll("a");for(var m=0;m<al.length;m++)al[m].style.removeProperty("text-decoration");e.removeAttribute("data-wsnavfix");}}function run(){try{bullets();if((window.innerWidth||0)<900){restore();return;}var iw=window.innerWidth;var burg=document.querySelectorAll("[class*=burger],[class*=Burger],[class*=hamburger],[class*=Hamburger]");for(var b=0;b<burg.length;b++){if(vis(burg[b])){burg[b].style.setProperty("display","none","important");burg[b].setAttribute("data-wshid","1");}}var raw=document.querySelectorAll("nav,ul"),g=[];for(var i=0;i<raw.length;i++){var ls=links(raw[i]);if(ls.length>=2&&vis(raw[i]))g.push({el:raw[i],o:orient(ls),t:tset(ls)});}for(var v=0;v<g.length;v++){var best=null;for(var w=0;w<g.length;w++){if(w===v)continue;if(g[v].el.contains(g[w].el)||g[w].el.contains(g[v].el))continue;if(jac(g[v].t,g[w].t)<0.5)continue;if(best===null||score(g[w],iw)>score(best,iw))best=g[w];}if(best!==null){var sv=score(g[v],iw),sb=score(best,iw);if(sb>sv||(sb===sv&&idx(g,best)<v)){g[v].el.style.setProperty("display","none","important");g[v].el.setAttribute("data-wshid","1");}}}for(var q2=0;q2<g.length;q2++){var G=g[q2].el;if(G.getAttribute("data-wshid")||G.getAttribute("data-wsnavfix"))continue;var ll=links(G);if(ll.length<2||!underlined(ll))continue;if(G.childElementCount<=ll.length+2){var SP=[["display","flex"],["flex-wrap","wrap"],["align-items","center"],["column-gap","24px"],["row-gap","8px"],["list-style","none"]];for(var z=0;z<SP.length;z++)G.style.setProperty(SP[z][0],SP[z][1],"important");}for(var z2=0;z2<ll.length;z2++)ll[z2].style.setProperty("text-decoration","none","important");G.setAttribute("data-wsnavfix","1");}var kept=[];for(var kk=0;kk<g.length;kk++){if(!g[kk].el.getAttribute("data-wshid"))kept.push(g[kk].el);}if(kept.length){var bt=Infinity,bb=-Infinity;for(var kn=0;kn<kept.length;kn++){var nr=kept[kn].getBoundingClientRect();if(nr.top-20<bt)bt=nr.top-20;if(nr.bottom+150>bb)bb=nr.bottom+150;}var inKept=function(el){for(var q=0;q<kept.length;q++){if(kept[q].contains(el))return true;}return false;};var ct=document.querySelectorAll("a[class*=btn],button"),grp={};for(var ci=0;ci<ct.length;ci++){var cb=ct[ci];if(cb.getAttribute("data-wshid"))continue;if(!vis(cb))continue;var cr=cb.getBoundingClientRect();if(cr.top<bt||cr.top>bb)continue;var tk=txt(cb);if(!tk)continue;if(!grp[tk])grp[tk]=[];grp[tk].push(cb);}for(var key in grp){var arr=grp[key];if(arr.length<2)continue;var keep=null,ks=-1;for(var ai=0;ai<arr.length;ai++){var rr=arr[ai].getBoundingClientRect();var sc=(inKept(arr[ai])?2000:0)+((rr.left>=-2&&rr.right<=iw+2)?1000:0)+rr.left;if(sc>ks){ks=sc;keep=arr[ai];}}for(var a2=0;a2<arr.length;a2++){if(arr[a2]!==keep){arr[a2].style.setProperty("display","none","important");arr[a2].setAttribute("data-wshid","1");}}}}var hn=[];for(var e1=0;e1<g.length;e1++){var ge=g[e1];if(ge.el.getAttribute("data-wshid"))continue;if(ge.o!=="h")continue;if(ge.el.getBoundingClientRect().top>=300)continue;hn.push(ge.el);}if(hn.length){var navTexts={},bandBottom=0;for(var e2=0;e2<hn.length;e2++){var rr2=hn[e2].getBoundingClientRect();if(rr2.bottom>bandBottom)bandBottom=rr2.bottom;var aa=hn[e2].querySelectorAll("a");for(var e3=0;e3<aa.length;e3++){var tt2=txt(aa[e3]);if(tt2)navTexts[tt2]=1;}}var band=bandBottom+260,alla=document.querySelectorAll("a"),cand=[];for(var e4=0;e4<alla.length;e4++){var la=alla[e4];if(la.getAttribute("data-wshid"))continue;var lt=txt(la);if(!lt||!navTexts[lt])continue;var innav=false;for(var e5=0;e5<hn.length;e5++){if(hn[e5].contains(la)){innav=true;break;}}if(innav)continue;var lr=la.getBoundingClientRect();if(lr.top<0||lr.top>band||!vis(la))continue;cand.push(la);}for(var e6=0;e6<cand.length;e6++){var par=cand[e6].parentElement,cnt=0;for(var e7=0;e7<cand.length;e7++){if(cand[e7].parentElement===par)cnt++;}if(cnt>=2){cand[e6].style.setProperty("display","none","important");cand[e6].setAttribute("data-wshid","1");}}}}catch(e){}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run);}else{run();}setTimeout(run,400);setTimeout(run,1200);setTimeout(run,2500);window.addEventListener("resize",run,{passive:true});})();</scr'+'ipt>';
const TEXT_CONTRAST_SCRIPT = '<scr'+'ipt id="_wsTextContrast">(function(){function prgb(c){c=c||"";var i=c.indexOf("(");if(i<0)return null;var j=c.indexOf(")");var a=c.slice(i+1,j).split(",");var o=[];for(var k=0;k<a.length;k++)o.push(parseFloat(a[k]));return o.length>=3?o:null;}function al(p){return p.length>3?p[3]:1;}function lum(p){if(!p||al(p)<0.05)return -1;function ch(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*ch(p[0])+0.7152*ch(p[1])+0.0722*ch(p[2]);}function gradLum(bi){var i=0,sum=0,n=0;while(true){var a=bi.indexOf("rgb",i);if(a<0)break;var b=bi.indexOf(")",a);if(b<0)break;var p=prgb(bi.slice(a,b+1));if(p){var l=lum(p);if(l>=0){sum+=l;n++;}}i=b+1;}return n?sum/n:-1;}function bgLumOf(el){while(el){var s=getComputedStyle(el);var p=prgb(s.backgroundColor);if(p&&al(p)>0.5){var l=lum(p);if(l>=0)return l;}var bi=s.backgroundImage||"";if(bi.indexOf("gradient")>-1){var gl=gradLum(bi);if(gl>=0)return gl;}if(el===document.documentElement)break;el=el.parentElement;}return -1;}function inNav(el){var q=el;while(q){var t=q.tagName;if(t==="NAV"||t==="HEADER")return true;q=q.parentElement;}return false;}function directText(el){for(var i=0;i<el.childNodes.length;i++){var n=el.childNodes[i];if(n.nodeType===3&&n.textContent.trim())return true;}return false;}function fix(){var els=document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,button,span,strong,em,blockquote,td,th,label,figcaption");for(var i=0;i<els.length;i++){var el=els[i];if(inNav(el))continue;if(!directText(el))continue;var r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;var s2=getComputedStyle(el);if(s2.visibility==="hidden"||parseFloat(s2.opacity||"1")<0.05)continue;var cl=lum(prgb(s2.color));if(cl<0)continue;var bgl=bgLumOf(el);if(bgl<0)continue;if(Math.abs(cl-bgl)<0.22){el.style.setProperty("color",bgl>0.5?"#111":"#fff","important");}}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",fix);}else{fix();}setTimeout(fix,400);setTimeout(fix,1200);window.addEventListener("resize",fix,{passive:true});})();</scr'+'ipt>';
function withReveal(html){
  if(!html||html.indexOf('_wsReveal')>-1)return html;
  var bi=html.lastIndexOf('</body>');
  var _both = NAV_CONTRAST_SCRIPT + CTA_EDGE_SCRIPT + NAV_DEDUPE_SCRIPT + TEXT_CONTRAST_SCRIPT + REVEAL_SCRIPT;
  return bi>-1?html.slice(0,bi)+_both+html.slice(bi):html+_both;
}

// Interactive-section vocabulary shared by both the initial-build PROMPT and the
// chat-edit MODIFY prompt. The AI can produce ANY of these on request via chat;
// each one has one canonical, consistent markup so results don't vary per site.
const INTERACTIVE_BEHAVIORS = `━━━ INTERACTIVE-BEHAVIOR VOCABULARY (shared) ━━━
Users edit their site by chatting with you. You must be able to add or restore any of the following behaviors on request — always using the canonical pattern below so results are consistent every time. Match the site's existing palette/typography; do not copy example colors.

1) STICKY / FLOATING HEADER — the nav stays pinned at the top of the viewport as the user scrolls. THIS IS THE DEFAULT for every site unless the user has specifically asked for something else. Canonical pattern:
   CSS: header,nav.site-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: background-color .25s ease, backdrop-filter .25s ease, box-shadow .25s ease; }
   Optional scroll-fade class (adds a solid background once the user has scrolled past ~40px):
   .site-nav.scrolled { background: rgba(<footer-color>, 0.92); backdrop-filter: blur(10px); box-shadow: 0 1px 0 rgba(255,255,255,.06); }
   JS (5 lines): window.addEventListener("scroll", function(){ document.querySelector(".site-nav").classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
   REMEMBER: if you add the .scrolled class, its rule MUST also set the link/logo color to contrast with THAT solid background (this is Rule #1 in reverse — the scroll-state colors matter as much as the load-state colors).

2) SMOOTH SCROLL — nav links jump smoothly to their target section, not instantly. Pattern: html { scroll-behavior: smooth; } — that single line is enough for modern browsers. No JS needed. Every nav link must use href="#idOfExistingSection".

3) SCROLL-TO-TOP / BACK-TO-TOP BUTTON — floating circular button, bottom-right, appears after ~500px of scroll. Pattern:
   HTML at end of body: <button id="wsToTop" aria-label="Back to top" style="position:fixed;bottom:24px;right:24px;width:48px;height:48px;border-radius:50%;border:none;background:<brand-primary>;color:#fff;font-size:20px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:90">↑</button>
   JS: var b=document.getElementById("wsToTop"); window.addEventListener("scroll", function(){ var v=window.scrollY>500; b.style.opacity=v?"1":"0"; b.style.pointerEvents=v?"auto":"none"; }, {passive:true}); b.addEventListener("click", function(){ window.scrollTo({ top:0, behavior:"smooth" }); });

4) MOBILE HAMBURGER MENU — required whenever the nav has more than 2-3 links. Hidden on desktop, shown below ~820px. Pattern:
   HTML: <button class="ws-hamb" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
   CSS: .ws-hamb{display:none} @media (max-width:820px){.ws-hamb{display:flex;flex-direction:column;gap:5px;background:none;border:none;padding:8px;cursor:pointer} .ws-hamb span{width:24px;height:2px;background:currentColor;transition:transform .2s} .site-nav .nav-links{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:<solid-bg>;padding:20px;gap:16px} .site-nav.menu-open .nav-links{display:flex}}
   JS: var h=document.querySelector(".ws-hamb"); if(h) h.addEventListener("click", function(){ var n=document.querySelector(".site-nav"); var open=n.classList.toggle("menu-open"); h.setAttribute("aria-expanded", open?"true":"false"); });

5) SCROLL-REVEAL ANIMATIONS — sections fade+rise into view as they scroll into the viewport. Websprout already injects a global reveal system automatically (opacity:0 elements become visible on scroll); you can simply set initial opacity:0 and transform:translateY(20px) with a transition, and the injected system will trigger the reveal. Do not build your own IntersectionObserver — the injected system covers it.

6) IMAGE LIGHTBOX — click a gallery image to view it full-screen. Pattern:
   HTML: wrap gallery images in <a href="LARGE.jpg" class="ws-lightbox"><img src="THUMB.jpg" alt=""></a>
   CSS + JS (~15 lines): create one shared overlay div, on click intercept, show the href image centered on a dark backdrop, click overlay to close. Keep to plain vanilla JS.

7) DARK-MODE TOGGLE — only when the user asks. Pattern: a button in the nav that toggles document.documentElement.classList("dark") and persists the choice in localStorage. Define :root { --bg:...; --text:...; } and .dark { --bg:...; --text:...; } CSS variables so every color follows automatically.

8) SCROLL PROGRESS BAR — thin colored bar across the top that fills as the user scrolls. Pattern:
   HTML: <div id="wsProg" style="position:fixed;top:0;left:0;height:3px;width:0;background:<brand-primary>;z-index:200;transition:width .1s ease"></div>
   JS: window.addEventListener("scroll", function(){ var h=document.documentElement; var s=h.scrollTop/(h.scrollHeight-h.clientHeight); document.getElementById("wsProg").style.width=(s*100)+"%"; }, {passive:true});

GENERAL RULES for behaviors:
- Always wrap JS in a DOMContentLoaded check OR place the script at the end of <body> so elements exist when the script runs.
- Use { passive: true } on all scroll listeners for performance.
- Never leave a click handler on a control that does nothing.
- Every behavior above must be idempotent — the site should not double-wire the same behavior if a user asks for it twice.
- If the user asks to "add X" and X already exists in the HTML, restore/repair the missing pieces rather than duplicating.`;

const INTERACTIVE_SECTIONS = `━━━ INTERACTIVE-SECTION VOCABULARY (shared) ━━━
Users edit their site by chatting with you. You must be able to add or restyle any of the following on request — always using the standard patterns below so the result is consistent every time. Match the current site's color palette, typography and spacing; do not copy these exact colors.

1) FAQ / DROPDOWN — an accordion of question/answer pairs (or generic label/content pairs). MANDATORY MARKUP: use native <details> with a <summary>, no JS required:
   <div class="ws-faq">
     <details class="ws-faq-item"><summary>Question here?</summary><div class="ws-faq-body">Answer paragraph here.</div></details>
     <details class="ws-faq-item"><summary>Another question?</summary><div class="ws-faq-body">Answer.</div></details>
   </div>
   Style .ws-faq-item as bordered/rounded rows with generous padding; rotate a chevron on summary via [open]. Never build a JS accordion — always <details>/<summary>. Works for FAQs, "our process" steps, service descriptions, product specs, or any expandable list.

2) HOURS & LOCATION — a card or band showing days + times and address. Use a semantic list:
   <div class="ws-hours"><div class="ws-hours-title">Hours</div><ul class="ws-hours-list"><li><span>Monday</span><span>9–5</span></li>...</ul></div>
   Pair with a "Get directions" link: <a href="https://maps.google.com/?q=[Your Address]" target="_blank" rel="noopener">Get directions</a>. Keep [Your Address] and [Your Phone] as placeholders.

3) MENU WITH PRICES (food/services) — a two-column list styled like a printed menu, grouped by section:
   <div class="ws-menu"><h3 class="ws-menu-group">Starters</h3><ul class="ws-menu-list"><li class="ws-menu-row"><div><div class="ws-menu-name">Item name</div><div class="ws-menu-desc">Short description</div></div><div class="ws-menu-price">$00</div></li>...</ul></div>
   Group headings, item + description on the left, price on the right, aligned. Use real dishes/services for the business.

4) TESTIMONIALS — carousel-free grid or column of quote cards:
   <div class="ws-testimonials"><figure class="ws-testimonial"><blockquote>"Quote text."</blockquote><figcaption>— Name, role/location</figcaption></figure>...</div>
   Real business-appropriate quotes; never fabricate specific people/companies. For the built-in reviews container use <div data-ws-reviews></div> (Websprout injects real reviews there).

5) GALLERY — a responsive image grid using the ws-img-slot format so users can upload their own photos:
   <div class="ws-gallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
     <div class="ws-img-slot" data-slot="gallery-1" data-label="Gallery image 1" style="width:100%;height:220px;background:linear-gradient(135deg,#2b2620,#3a322a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px"><div style="font-size:36px;opacity:.35">&#128247;</div><div style="color:rgba(255,255,255,.72);font-size:13px;font-weight:600">Click to add photo</div></div>
     (repeat with unique data-slot ids — gallery-2, gallery-3…)
   </div>
   Use the LIGHT variant instead when the section background is light. NEVER render a plain colored div as a photo placeholder — every uploadable spot MUST be a ws-img-slot with a unique data-slot.

6) TEAM MEMBERS — grid of cards, each with a photo slot, name, role, one-line bio:
   <div class="ws-team"><div class="ws-team-card"><div class="ws-img-slot" data-slot="team-1" data-label="Team photo 1" style="...(dark or light variant, ~180px round)"></div><div class="ws-team-name">Name</div><div class="ws-team-role">Role</div><p class="ws-team-bio">One-line bio.</p></div>...</div>

7) PRICING TABLE — up to 3 tiers, center one highlighted, checkmark feature lists (same shape as the initial-build pricing section).

8) CONTACT FORM — action="#" method="POST", real named fields relevant to the business, plus this hidden field: <input type="hidden" name="_subject" value="New message from your website">. Add tap-to-call links for phone-driven local businesses.

9) NEWSLETTER SIGNUP — a single-row email form styled like a hero CTA:
   <form class="ws-newsletter" action="#" method="POST"><input type="email" name="email" required placeholder="you@example.com"><button type="submit">Subscribe</button><input type="hidden" name="_subject" value="New newsletter signup"></form>

10) STATS BAND — 3–4 big-number stats in a row (real, plausible for the business — no invented percentages).

11) VIDEO EMBED — only if the user provides a URL. Use a responsive 16:9 wrapper with the given YouTube/Vimeo embed URL. Never invent one.

12) CALL-TO-ACTION BAND — full-width colored band, headline + subhead + one primary button, button links to #contact (or the existing quote/book/order section).

GENERAL RULES for these:
- Match the SITE'S existing palette, type scale, radius and spacing — do not copy the example colors.
- When ADDING to an existing site (chat-edit), place the new section where it fits the page's flow, keep all existing routing/JS intact, and update any nav that lists top-level sections.
- Use semantic HTML (details/summary, ul/li, figure/blockquote, form) — no click handlers required for FAQ, hours, menu, testimonials, gallery, team, pricing, or CTA.
- Every button/link must actually do something (href="#realId" or a real URL). Never a dead control.`;

const PROMPT = `You are a world-class creative director and front-end developer. Build a complete, detailed, professional website for the business described. Every section must contain real, specific content written for this exact business type.

OUTPUT: Raw HTML only, <!DOCTYPE html> to </html>. No markdown, no backticks, no explanation.

━━━ REQUIRED SECTIONS (include ALL of these) ━━━

1. NAVIGATION — output exactly ONE sticky flex nav bar (display:flex; align-items:center; justify-content:space-between; gap at least 1.5rem). Brand/logo on the left with CLEAR space from the 4-5 links — the logo must never touch or overlap the links. Exactly ONE CTA button on the right. RESPONSIVE RULES (critical, the #1 cause of broken navs): above 820px show the inline links + the single CTA and KEEP THE HAMBURGER BUTTON HIDDEN (display:none). The collapsible mobile menu element MUST be display:none by default and may ONLY become visible inside a @media (max-width:820px) block when it is toggled open — it must NEVER render above 820px. Two stacked rows of links, two visible CTA buttons, or any duplicated nav at the same screen width is a BUG: never produce it. Put the show/hide entirely in CSS media queries, not just JS, so the desktop view is correct before any script runs. Wrap the brand/logo text in a tag carrying the attribute data-ws-field="brand". CONTRAST — the nav must be readable the instant the page loads: the nav link text AND the nav CTA button must each clearly contrast with whatever sits directly behind or within them. If the nav floats over a light or pale hero, the links and the button label are dark (#111); over a dark hero they are white/near-white. A nav button must NEVER have its label the same colour as its own fill — white text on a white/pale button, or dark text on a dark button, is invisible and is a critical failure. A solid white (or pale) nav button needs dark text; a dark/accent button needs white text. If the nav bar has its OWN solid background in any state — including the background it fades in once the user scrolls past the hero — the link text, the brand/logo text and any non-CTA labels MUST contrast with THAT nav background, not with the hero behind it: a white or pale nav bar needs dark (#111) links and logo; a dark nav bar needs white/near-white links and logo. THE MOST COMMON AND WORST FAILURE: leaving the link and logo text white (carried over from the transparent-over-dark-hero state) after the nav fades to a white or light background on scroll, which produces invisible white-on-white text. So whenever the nav background changes on scroll, you MUST also change the link colour, the logo colour and any non-CTA text to a colour that clearly contrasts with the new background — set the scrolled-state text colour explicitly in the same CSS rule that sets the scrolled-state background. Re-check every nav link and the nav button before finishing.
2. HERO — dramatic full-width section. Large RESPONSIVE headline using font-size:clamp(2rem,6vw,4.5rem) so it scales down on phones and NEVER overflows or gets clipped; weight 900; letter-spacing -2px; the headline MUST be allowed to wrap onto multiple lines (never white-space:nowrap). Subheadline. Two CTA buttons. Let the hero content float cleanly on the section background - never wrap the headline, subheadline or buttons in a visible card, panel or bordered box; they sit directly on the background. Keep generous side padding so text never touches the screen edges. All hero text must strongly contrast with the hero background: if the hero background is dark or uses a photo/image slot, the headline and subtext are white/near-white (with a dark overlay over any photo) — never dark text on a dark hero.
3. TRUST/STATS BAR — a SINGLE horizontal strip with 3-4 real stats or trust signals specific to this business type, shown ONCE. Never repeat the same stat twice and never stack a second identical copy of the bar. On phones the items wrap cleanly into a column. If you make this a scrolling ticker, build it exactly per the MARQUEE rule below.
4. SERVICES/FEATURES — 3-4 detailed cards. Each has an icon, bold title, 2-3 sentence description. Real content, not generic filler.
5. ABOUT/STORY — two column layout. Left: compelling brand narrative. Right: 4 stats in a 2x2 grid with big bold numbers.
6. INDUSTRY-SPECIFIC SECTION — this is critical. Think about what this business actually needs:
   - Estate sale company: list of upcoming/recent sales with dates, item categories (furniture, jewelry, antiques, art, collectibles, tools), fee structure
   - Restaurant/cafe: full menu with sections and real dish names and prices
   - Law firm: practice areas with descriptions, case types, free consultation CTA
   - Gym/fitness: class schedule, membership tiers with prices, trainer info
   - Medical/clinic: services offered, insurance info, appointment booking
   - Portfolio: past project showcase with descriptions, skills, process
   - SaaS/app: feature breakdown, pricing tiers, integration list, metrics
   - Real estate: property types, neighborhoods served, recent sales stats
   - Consulting: service packages, methodology, client results
   - Local business: service list with descriptions, service area, pricing
   Write content that ONLY makes sense for this specific business. No generic filler.
7. REVIEWS — a "Reviews" or "What our customers say" section styled to match the site (heading, accent color, generous padding, a background that fits the page rhythm). Do NOT invent fake customers, names, quotes, or star ratings. Instead place exactly ONE empty container in this section and nothing else inside the reviews area: <div data-ws-reviews></div> — Websprout injects the business's real reviews plus a "Leave a review" form into that div at publish time. You may add one short subheading line under the heading inviting visitors to share their experience, but never output fabricated testimonial cards.
8. PRICING — 3 tiers adapted to this business. Center tier highlighted. Feature lists with checkmarks.
9. CONTACT/CTA — full-width colored band. Bold headline. Contact form with fields relevant to this industry. For service / quote / appointment businesses, make this a "Request a quote" (or "Request a callback") form with STRUCTURED fields, each with a name attribute: full name, phone, email, the specific service needed (a <select> with 4–6 realistic options for THIS industry), preferred timeframe/urgency (a <select>: ASAP / This week / This month / Just exploring), and a details textarea. Always give a phone field. The form MUST have action="#" method="POST" so it can be wired to a real email service later. Include these hidden fields inside every form:
   <input type="hidden" name="_subject" value="New message from your website">
   Include a submit button with clear label. Business info placeholders: [Your Address], [Your Phone], [your@email.com], [Your Hours]
   BOOKING: If this business runs on appointments or bookings (salons, barbers, spas, fitness/yoga, medical/dental, tattoo, photographers, charters/tours, home services & trades, consultants, tutors, repair shops, etc.), ALSO add a prominent "Book now" / "Book an appointment" button — once in the hero and once in the contact band — as a real link: <a href="[Your Booking Link]" target="_blank" rel="noopener">Book now</a>, styled as a primary button. Use the exact placeholder [Your Booking Link] for the href so the owner can drop in their Calendly / Cal.com / Square scheduler. For pure storefronts or info sites with no appointments, skip the booking button.
   ORDERING: If this is a restaurant, cafe, food truck, bakery, bar, or any food business with online ordering or delivery, render every "Order online" / "Order now" / "Get delivery" button as a real link: <a href="[Your Ordering Link]" target="_blank" rel="noopener">Order online</a>, styled as a primary button. Use the exact placeholder [Your Ordering Link] for the href so the owner drops in their Toast / Square / DoorDash / Uber Eats ordering URL. Never point an order button at "#".
   PRODUCTS: If the business sells purchasable items - a shop or store, a maker selling products, paid menu items, digital downloads, classes or passes, or service packages with set prices - do NOT hand-build product cards and do NOT invent products or prices. Instead render the products area as a section heading (Shop, Featured Products, Our Collection, etc.) immediately followed by the EXACT html comment <!--WS_PRODUCTS--> on its OWN line, placed where the product grid belongs. The owner real products, added in the Store editor, are injected there automatically as a consistent grid whose Buy and Add-to-cart buttons are already wired to checkout. Put that comment exactly once per products section. NEVER build fake product cards, hard-coded price lists, or [Pay Link] buttons - the injected grid replaces all of that.
   CLICK-TO-CALL: Render EVERY phone number as a tappable link — <a href="tel:[Your Phone]">[Your Phone]</a> (use the [Your Phone] placeholder in BOTH the href and the visible text). For phone-driven local businesses (trades, repair, towing, plumbing, HVAC, locksmith, auto, etc.), add a clear "Call [Your Phone]" button in the hero and again in the contact band, styled as a primary or secondary button.
10. FOOTER — dark background. 3 columns: brand+tagline, links, contact. Copyright line.

━━━ DESIGN ━━━
Pick ONE strong accent color that fits the brand. Build a full color system around it. Typography should be dramatic — big size contrast between headlines and body. Generous spacing. Cards with hover effects. Sticky nav that floats transparently over the hero - NO solid bar or strip at the top. The hero background MUST extend up behind the nav so nothing dark shows above it; keep the nav text high-contrast against the hero; fade in a subtle blur/background only once the user scrolls past the hero.

━━━ CONTRAST & READABILITY (CRITICAL — the #1 rule, never violate) ━━━
Every piece of text MUST be instantly readable against the EXACT color or image directly behind it (WCAG AA, 4.5:1 or better). Unreadable text is the most common failure — do not make it.
- Decide each section's background FIRST, then choose text colors that strongly contrast with it. Dark text ONLY on light backgrounds; white / near-white text ONLY on dark backgrounds. NEVER dark-on-dark or light-on-light.
- HERO: if the hero background is dark, a gradient, or a photo / image slot, then the headline, subheadline and ALL hero text MUST be white or near-white (#fff to rgba(255,255,255,.82)). If the hero background is light or pale, hero text MUST be near-black (#111). A dark headline on a dark hero is a critical failure — the user must be able to read the headline the instant the page loads.
- TEXT OVER A PHOTO OR IMAGE SLOT: put a dark overlay (e.g. a layer of rgba(0,0,0,.45)) between the image and the text, use white text, and add a subtle text-shadow so the words stay legible over any photo.
- BUTTONS: the label must contrast with the button fill — white text on a saturated/dark button, dark text on a pale/light button. Never grey text on a grey button.
- WORKING LINKS & BUTTONS (critical): every nav link and every CTA/button that is meant to jump somewhere MUST use href="#id" pointing to an id that ACTUALLY EXISTS on the page. Give each major section a matching id (id="solutions", id="services", id="pricing", id="about", id="contact", etc.) and point the nav links and buttons at those exact ids. If a button names content the site should contain ("Browse Catalog", "View Menu", "Our Work", "See Pricing", "View Plans"), BUILD that section and link the button to it. Conversion buttons ("Get a quote", "Get started", "Order online", "Sign up", "Contact us", "Open an account") link to the contact form section via href="#contact". NEVER output href="#", href="", or a link whose target id does not exist on the page — every button must lead somewhere real.
- Secondary / muted text must still be readable: not lighter than rgba(255,255,255,.65) on dark backgrounds, and around #555–#666 (never lighter) on light backgrounds.
- FINAL CHECK before you finish: scan every headline, paragraph, button, nav link and stat. If a human couldn't read it in a single glance, change the color until they can.
- MOBILE-FIRST (most visitors are on phones — the page MUST look great at 375px wide): every multi-column layout (feature grids, pricing tables, the hero split, footer columns) collapses to a SINGLE column on phones via media queries. The nav links collapse into a hamburger that actually toggles — include the small JS to open/close it. Tap targets (buttons, links) are at least 44px tall with comfortable spacing between them. Body text is never smaller than 16px on mobile; headlines use clamp() so they shrink but stay bold and never clip. Reduce section padding on phones so content breathes without giant empty gaps. NOTHING may overflow horizontally — the page must never scroll sideways on a phone, and images never exceed their container.
- NO WHITE BANDS AT ANY EDGE — the browser must NEVER show a strip of html/body background at the TOP (above the nav), BOTTOM (below the footer), or SIDES of the page. This is one of the most common and unacceptable generation failures. HARD REQUIREMENTS: (1) always start the CSS with * { box-sizing: border-box; } html, body { margin: 0; padding: 0; } — the default 8px body margin is what causes the white strip; you MUST zero it. (2) Set both html AND body backgrounds to a color that will not clash with any section that touches an edge — the SAME color as the FOOTER is the safest choice, because footers touch the bottom and this also fixes the bottom band. (3) The <nav>/<header> is the FIRST element in <body>, the <footer> is the LAST, and neither has an outer margin. (4) Never use min-height: 100vh on <html>/<body> alone (it can leave the top edge exposed on mobile with the URL bar); use min-height: 100% on html,body and let content grow naturally. If you skip zeroing the body margin, a thin white band appears at the top of every deployed site — do not skip it.

━━━ IMAGE SLOTS ━━━
HERO IS NEVER AN EMPTY IMAGE SLOT: the hero MUST have a rich, finished, DESIGNED background — a bold gradient or layered color treatment in the brand palette, optionally with subtle texture, shapes or a soft mesh — so it looks striking and complete the instant the page loads. Do NOT put a ws-img-slot in the hero or leave a "click to add photo" box as the hero; the owner can swap in a real hero photo later from the editor.
For genuine CONTENT photo areas (about, gallery, team, products) where photos naturally belong, use this exact format (users click to upload real photos):
Large area: <div class="ws-img-slot" data-slot="feature" data-label="Feature photo" style="width:100%;height:460px;background:linear-gradient(135deg,#2b2620,#3a322a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:8px"><div style="font-size:40px;opacity:0.35">&#128247;</div><div style="color:rgba(255,255,255,.72);font-size:13px;font-weight:600">Click to add photo</div></div>
Content: <div class="ws-img-slot" data-slot="about" data-label="About photo" style="width:100%;height:300px;background:#f0f0f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px;border:2px dashed #ccc"><div style="font-size:36px;opacity:0.3">&#128247;</div><div style="color:#bbb;font-size:13px;font-weight:600">Click to add photo</div></div>
If you create any image-like placeholder area, it MUST use this format. Never create a styled box that looks like an image area without ws-img-slot class and data-slot attribute.

━━━ COPY ━━━
Invent a specific memorable brand name. Write like a professional copywriter who knows this industry. No Lorem Ipsum anywhere. Keep locations generic unless the user specified one. CONTACT DETAILS — CRITICAL: output these FOUR tokens EXACTLY and verbatim wherever contact info appears — [Your Phone], [your@email.com], [Your Address], [Your Hours] — in both visible text AND links (href="tel:[Your Phone]", href="mailto:[your@email.com]"). Do NOT invent realistic-looking phone numbers, emails, or street addresses — the owner fills these in with one click in the editor, which only works if these exact tokens are present. These four are the ONLY placeholders allowed; everywhere else write real, polished copy. The brand name is NOT a placeholder: use the real invented name, and make sure the brand element carries data-ws-field="brand" and the same name appears in the <title>. FAVICON: also give the site a branded tab icon — a simple, bold SVG logo mark (a monogram of the brand's initial or a minimal emblem that fits the business) in the brand's main color, placed in the <head> as <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,..."> with the inline SVG URL-encoded; keep it crisp and instantly readable at 16px.

━━━ MOTION & INTERACTION ━━━
The site MUST have clearly visible motion — never a static page:
- ON LOAD: the hero headline, subheadline and buttons animate in with a staggered fade + slide-up using CSS @keyframes (translateY(24px) to 0, opacity 0 to 1, about 0.6s, with increasing animation-delay per element). These play immediately on page load.
- ON SCROLL: every major section and card reveals with a fade + slide-up as it enters the viewport. Implement it robustly: a .reveal class set to opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease, plus a .reveal.is-visible class set to opacity:1; transform:none — then an IntersectionObserver (threshold around 0.15) that adds is-visible to each .reveal as it scrolls into view. Stagger grouped cards with transition-delay. Put the .reveal class on sections, cards, and major blocks.
- HOVER: cards lift (translateY(-6px)) with a larger shadow; buttons shift color or scale; nav links get a subtle underline-slide. Keep hover transitions 0.2-0.3s.
- PREMIUM CTA BUTTONS: primary buttons feel tactile and floating - give them a soft drop shadow so they lift off the background, a gentle hover lift, and a springy press animation. Use transition:transform .18s cubic-bezier(.34,1.56,.64,1) and an :active rule that scales to about .96 with translateY(1px), so the button visibly depresses and springs back when tapped. Wrap this in @media(prefers-reduced-motion:reduce){ transition:none } too.
- Mobile hamburger toggles the nav; anchor links smooth-scroll; FAQ accordion if included; form validation with a success state.
Animations must ENHANCE and ALWAYS settle into a fully visible state — never leave anything permanently hidden. Keep entrance transitions under 0.8s.

━━━ SEO & DISCOVERY ━━━
The site MUST be search- and share-ready. Set <html lang="en">. In <head>, in order: <meta charset="utf-8">; a responsive viewport meta; the brand <title> (about 50–60 chars: brand name + what the business does); and a <meta name="description"> of 140–160 chars written specifically for THIS business (benefit-led, naming the business type, and the location only if the user gave one). Add Open Graph tags (og:type=website, og:title, og:description, og:site_name = brand name) and Twitter tags (twitter:card=summary_large_image, twitter:title, twitter:description), reusing the title and description. Add ONE <script type="application/ld+json"> describing the business with the most fitting schema.org @type — a specific LocalBusiness subtype when one fits (Restaurant, Plumber, Dentist, Bakery, Electrician, Store, ProfessionalService, etc.), otherwise LocalBusiness, or Organization only if truly none apply — including name (the brand), description, url, telephone "[Your Phone]", email "[your@email.com]", an address object containing "[Your Address]", and openingHours "[Your Hours]". Keep those four contact values as the EXACT placeholder tokens so the owner's one-click contact fill updates the structured data too. Every <img> MUST have a descriptive, business-specific alt attribute — never empty, never just "image". Do NOT add a canonical or og:url tag (the final domain is unknown at build time). ACCESSIBILITY (WCAG 2.1 AA) — build it accessible from the start: structure the page with semantic landmarks (a <header> holding the <nav>, ONE <main> wrapping the primary content, and a <footer>); use exactly one <h1> (the hero headline) with correctly ordered <h2>/<h3> below it — never skip heading levels or fake a heading with a styled <div>. Every interactive control is a real <button> or <a> with a clear text label; an icon-only control gets an aria-label. Every form field has a <label> linked by for/id (or an aria-label) — placeholder text is NOT a label. All text meets 4.5:1 contrast against its actual background; never use faint low-opacity text that is hard to read. Decorative images use alt=""; informative images keep a descriptive alt. Do not set outline:none on focusable elements unless you provide a clearly visible :focus-visible style. Never rely on color alone to convey meaning (add text, icons, or underlines).

━━━ LOCAL BUSINESS ESSENTIALS ━━━
For any business that serves customers at a place or by appointment, include a clear, visible "Visit us" / "Hours & location" block (its own section, or part of the contact band) showing the address as "[Your Address]" and hours as "[Your Hours]", plus a directions link that opens a map: <a href="https://maps.google.com/?q=[Your Address]" target="_blank" rel="noopener">Get directions</a> (keep the [Your Address] token in the href so it works the moment the owner fills it in). Do NOT embed a live map iframe — the address is a placeholder at build time, so the directions link is the right call.

━━━ TECHNICAL ━━━
All CSS in one <style> tag. All JS in one <script> tag before </body>. The ONLY permitted external resource is Google Fonts: include ONE <link> in the <head> that loads two complementary font families and actually use them (everything else must be self-contained — no other CDNs, no JS libraries, no remote images). Always include a system fallback in every font-family stack (e.g. ...,system-ui,-apple-system,sans-serif). Never use vh or vw for HEIGHTS (use px or %). opacity:0 is fine as the START of an entrance animation, as long as the element animates to full opacity. End with </body></html>.`;

const MODIFY = `You are an expert front-end developer making precise, surgical edits to a website. The user will describe what they want changed.

Return ONLY the complete updated HTML from <!DOCTYPE html> to </html>. No markdown, no backticks, no explanation.

IMPORTANT — this site may use multi-page JS routing with elements like:
- .page divs with id="page-home", id="page-about" etc
- showPage() function for navigation
- .nav-link elements with data-page attributes
Preserve ALL routing logic exactly. Never break the page switching.

IMAGE SECTIONS — critical rule:
If the user asks to add a photo section, gallery, image area, team photos, or anything involving images, you MUST use this exact format for every image placeholder. This is required — users click these boxes to upload their own photos:

For dark-background image areas:
<div class="ws-img-slot" data-slot="UNIQUE_ID" data-label="Descriptive label" style="width:100%;height:320px;background:linear-gradient(135deg,#2b2620,#3a322a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px"><div style="font-size:36px;opacity:0.35">&#128247;</div><div style="color:rgba(255,255,255,.72);font-size:13px;font-weight:600">Click to add photo</div></div>

For light-background image areas:
<div class="ws-img-slot" data-slot="UNIQUE_ID" data-label="Descriptive label" style="width:100%;height:280px;background:#f0f0f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px;border:2px dashed #ccc"><div style="font-size:36px;opacity:0.3">&#128247;</div><div style="color:#bbb;font-size:13px;font-weight:600">Click to add photo</div></div>

Replace UNIQUE_ID with a descriptive slug like gallery-1, gallery-2, team-1, product-1, hero etc. Each slot must have a different data-slot value.

Never create a styled box or placeholder that looks like an image area WITHOUT using this format — otherwise users cannot add photos to it.

When the user asks to make an existing area or element uploadable, or to "add a picture here" / "let me add a photo where X is", CONVERT that exact element into the ws-img-slot format above with a NEW unique data-slot id (and keep its existing size/position). Do not leave a plain colored div — any region meant to hold a user photo MUST be a ws-img-slot carrying a data-slot attribute, or the upload click cannot target it.

PRECISION IS THE POINT — this is surgical work, not a redesign. Do EXACTLY the one thing the user asked and NOTHING ELSE. Do not "improve" copy, colors, spacing, layout, images, or wording that the user did not point at. If the user asked for a green button, only the button changes color; the section next to it does not get "warmer", the hero copy does not get "crisper", the nav does not get "cleaner". Preserve every id, class, data-attribute, inline style, image src (including any WSIMGREF placeholders), form action/name attributes, script, and href on elements you were not asked to touch. If the instruction is ambiguous, pick the smallest possible interpretation. The success test: a diff against the original should show ONLY the changes the user asked for.

EDIT PRINCIPLES:
- Make EXACTLY what the user asked — don't change anything else
- If changing colors: update ALL instances consistently across ALL pages — buttons, borders, gradients, accents, icons, hover states. When a color change targets nav links, the logo/brand mark, headline text, or button text on a solid background, ALWAYS include !important on that color declaration to defeat any more-specific existing selector — e.g. nav a, nav .brand, nav .logo, header a { color: #ffffff !important; }. The single most common failure is 'AI said Done! but nothing changed' because the existing CSS is more specific — !important on the exact target selectors prevents that.
- If adding content to a page: add it where it makes most sense in the layout
- If the user says "make it darker/lighter": adjust the whole color palette coherently
- READABILITY: after ANY color change, verify every text element still strongly contrasts with its background — never leave dark text on a dark background or light text on a light background. Hero or section text sitting over a dark background or photo must be white/near-white and instantly readable.
- Preserve ALL JavaScript — routing, menus, animations, form handlers, FAQ toggles
- ANIMATION REQUESTS: when the user asks to animate something (text, a headline, a button, a section), make it OBVIOUSLY and continuously animated — never rely on a one-time entrance they may have already missed, and never just claim it's done. Define real CSS @keyframes and apply them directly to the element the user pointed at with an animation: rule that loops (animation-iteration-count:infinite). Good options: an animated gradient sweep across headline text (color:transparent; background:linear-gradient(...); -webkit-background-clip:text; background-clip:text; with a keyframe that moves background-position), a gentle infinite glow/pulse, a slow float, or a shimmer. Make sure the @keyframes are actually present in the page CSS and the selector truly targets that element, and do NOT leave it hidden behind a scroll-reveal class. Keep it tasteful (1.5-4s, ease-in-out) and add @media(prefers-reduced-motion:reduce){ animation:none } for it. If you ever animate a headline word letter-by-letter (a typewriter / type-and-delete effect) or otherwise change its visible width while it plays, RESERVE the word’s FINAL width up front — size the animated span to the complete word (e.g. an inline-block span with a min-width matching the full word, or a hidden full-text sizer beneath it) — so the headline NEVER reflows, jumps or drifts off-center mid-animation. The line must stay locked in the exact position of the finished text the whole time it types. When the effect cycles through MULTIPLE words, do NOT hardcode them in a JS array: store the word list in a data-ws-rotate attribute on the animated span (pipe-separated, e.g. data-ws-rotate="Bold|Refined|Timeless"), set that span's initial text to the first word, and have the script read its words from el.getAttribute("data-ws-rotate").split("|"), re-reading at the start of every cycle, so the owner can edit the words from the on-page editor.
- Keep the site self-contained except Google Fonts, which are allowed (a <link> in the head). Preserve any existing Google Fonts link unless the user asks to change the typography; if they ask for a different font, swap to a fitting Google Font and keep a system fallback. No other CDNs or JS libraries. No vh/vw for heights — heroes/sections sized in px or %.
If adding or editing a contact form, always include action="#" method="POST" and a hidden field: <input type="hidden" name="_subject" value="New message from your website">
- End with </body></html>

QUALITY BAR: The edit should look intentional and professional — not like a quick find-and-replace.`;

// Pushes generation toward genuinely impressive, modern design (appended to the generate prompt).
const DESIGN_AMBITION = `DESIGN AMBITION — TAKE CREATIVE RISKS. The single worst thing you can produce is a competent, forgettable, template-shaped business website. Nothing here is a suggestion; the following are creative demands. Do NOT build a safe, templated business website. Build something genuinely memorable: the kind of site that gets featured on Awwwards and makes a visitor stop and say "whoa." Take a bold, opinionated aesthetic stance that fits the brand and fully commit to it. Generic and forgettable is the ONLY failure mode here.

COMMIT TO ONE CONCEPT — before building, lock in a single strong art direction that fits this exact business (e.g. dark-luxe with neon accents, warm sun-baked editorial, retro-futuristic, refined brutalist, organic & earthy, glassy & high-tech, bold & playful). Every decision — color, type, motion, shapes, spacing — reinforces that one concept so the page feels custom and intentional, never assembled from defaults.

TYPOGRAPHY IS THE #1 LEVER — be dramatic. Load TWO Google Fonts: a characterful DISPLAY font for headlines paired with a clean, readable body font, chosen to fit the concept (modern/tech: Sora, Space Grotesk, Archivo; editorial/premium: Fraunces, Playfair Display; friendly: Poppins, Nunito Sans; bold/quirky: Unbounded, Bricolage Grotesque). Hero headline is huge and confident: font-size clamp(2.6rem,7vw,5.5rem), weight 800-900, tracking -0.03em; section titles ~2-3rem; body 16-18px / line-height 1.65. Use big scale jumps and emphasize key words with a GRADIENT text fill or a bold colored highlight/underline. Type should dominate the page, never whisper. If you ever animate a headline word letter-by-letter (a typewriter / type-and-delete effect) or otherwise change its visible width while it plays, RESERVE the word’s FINAL width up front — size the animated span to the complete word (e.g. an inline-block span with a min-width matching the full word, or a hidden full-text sizer beneath it) — so the headline NEVER reflows, jumps or drifts off-center mid-animation. The line must stay locked in the exact position of the finished text the whole time it types. When the effect cycles through MULTIPLE words, do NOT hardcode them in a JS array: store the word list in a data-ws-rotate attribute on the animated span (pipe-separated, e.g. data-ws-rotate="Bold|Refined|Timeless"), set that span's initial text to the first word, and have the script read its words from el.getAttribute("data-ws-rotate").split("|"), re-reading at the start of every cycle, so the owner can edit the words from the on-page editor.

A HERO THAT STOPS THE SCROLL — make the hero feel alive with pure CSS (no images required): an animated gradient / aurora / mesh background, OR a few large blurred color "blobs" drifting slowly behind the content, OR a subtle grain/noise texture over a rich gradient. Bold headline, a punchy one-sentence subhead, and two CTAs (primary = solid with a gradient + soft glow; secondary = ghost/outline). Tall and full-bleed (min-height ~640-780px using px, never vh).

MOTION = PREMIUM (tasteful, purposeful) — bring the page to life: staggered scroll-reveal entrances (fade + slide-up) on every major section; rich hover states on cards/buttons (lift + shadow + subtle scale, gradient shift, glow); a shimmer or animated gradient on the primary CTA; and only if this site's CREATIVE DIRECTION calls for it, a slow-scrolling MARQUEE / ticker band (services, taglines, or stats) — built as a SINGLE horizontal line that genuinely scrolls: the wrapper has overflow:hidden, and the inner track uses display:flex; flex-wrap:nowrap; white-space:nowrap; width:max-content and is animated with transform:translateX. Duplicate the item set ONCE only for a seamless loop, and the duplicated items must NEVER wrap onto a second visible row (a non-scrolling marquee that shows its content twice stacked is a bug — fix the CSS so it scrolls on one line). Don't reuse the exact trust-bar stats verbatim in any marquee. Transitions 0.3-0.8s; honor prefers-reduced-motion.

BREAK THE GRID — never just stack three identical centered cards. Vary the rhythm hard: asymmetric two-column splits (e.g. 5fr/7fr), a BENTO-style grid of different-sized cards for features or highlights, deliberately overlapping elements, oversized faded section numbers (01 / 02 / 03) or giant background words, and full-bleed dark or accent bands that alternate with lighter sections so the page builds dramatic contrast and momentum as you scroll.

DEPTH & DETAIL — layer it: soft oversized shadows; glassmorphism panels (semi-transparent + backdrop-blur) where they fit; gradient borders; soft colored glows behind focal elements; pill-shaped badges/tags; gradient-text highlights; tasteful custom dividers; and a sticky nav that gains a blur + shadow once you scroll. Reuse ONE border-radius and ONE shadow system so it stays cohesive.

COLOR PALETTE (match the brand — never default to generic blue) — choose a primary brand color plus one or two accents that authentically fit the business's industry, culture and mood, and use them consistently across buttons, links, icons and highlights. Avoid generic tech-blue unless the brand truly calls for it. Guides: Mexican/Latin/cantina to terracotta, agave green, amber, chili red, cream; Italian to deep red, olive, cream; coffee/bakery to warm browns, caramel, cream; BBQ/grill to charcoal, ember orange, oxblood; spa/salon/wellness to sage, eucalyptus, stone, blush; law/finance/professional to deep navy or forest, charcoal, gold; real estate to forest/slate, warm neutrals, brass; kids/play to bright cheerful primaries; luxury to near-black, gold, ivory; tech/SaaS to blues, violets, cyans. Pull the palette from the cuisine, materials, or feeling of the business.

SPACING & POLISH — generous vertical section padding (~96-128px desktop, less on mobile); derive every gap from an 8px scale (8/16/24/32/48/64/96); keep everything aligned to a centered max-width container (~1160px) except intentional full-bleed bands; nothing touches the screen edges.

COPY CRAFT — the hero headline states a concrete, bold promise for THIS exact business (never "Welcome to X"); the subhead adds specifics in one line. Use real, concrete details: specific services, believable numbers, named packages. Confident, human, benefit-led; zero corporate filler.

BANNED CLICHÉS (instant fail) — avoid the default "AI website" look entirely: a centered hero followed by three identical centered cards; Inter/Roboto/Open Sans as the HEADLINE font; a generic blue-to-purple gradient when the brand is not tech; emoji used as feature icons; "Welcome to [Business]" or "Your trusted partner" headlines; a plain white page with evenly-spaced grey cards and one flat accent; timid undersized headlines. If a draft looks like a free template, commit harder to the concept and the typography.

SIGNATURE MOVES — keep the page feeling premium with these, most of which are pure CSS so they cost little. ALWAYS include: (1) an animated hero background — CSS gradient/aurora/mesh or a few slowly drifting blurred color blobs, NEVER a flat fill; (2) a striking headline treatment matched to the design personality - an accent or gradient highlight word for expressive or editorial styles, or a bold single-color weight-contrast headline for minimal, geometric, Swiss or brutalist styles; (3) staggered scroll-reveal (fade + slide-up) on major sections, in your own CSS, every element ending fully visible; (4) rich hover states on cards and buttons (lift + shadow + slight scale or glow); (5) a transparent sticky nav that floats over the hero (the hero background fills behind it, no bar or strip at the top) and gains a blur + subtle background only once you scroll. Add a marquee/ticker, animated count-up stats, or a bento/asymmetric layout ONLY where one fits naturally — do not cram all of them in. A tight, fast, polished page with a strong on-brand palette beats piling on every effect; pick the right concept and commit, but keep it lean.

GUARDRAILS — bold but never broken: readability wins every time (text must stay strongly contrasted against its exact background), NEVER cause horizontal scroll, and ALWAYS finish the entire page through the closing body and html tags. If you are running long, simplify a section rather than truncate — a complete, daring, readable page always beats an elaborate broken one.`;


// ── Main HTML page ────────────────────────────────────────────
const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Websprout: AI Website Builder | Make a Website in Seconds, Free</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<meta name="description" content="Websprout is an AI website builder that turns one sentence into a complete, professional website in about 90 seconds. Build and publish your site live for free. Go Pro for $10/month to remove the badge, connect your own domain, and download the code — cancel anytime.">
<link rel="canonical" href="https://websprout.app/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="keywords" content="AI website builder, website generator, make a website with AI, free website builder, no-code website, AI web design, build a website fast, website maker, instant website">
<meta name="author" content="Websprout">
<meta name="theme-color" content="#060d05">
<meta name="ws-build" content="2026-06-10-r255">
<script>window._wsBuild="2026-06-10-r255";console.log("%c[Websprout] build 2026-06-10-r255 — store empty-state points at Products and cart; dormant pay-links entry hidden","color:#4ade80;font-weight:700")</script>
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
<meta property="og:title" content="Websprout: Build a Website with AI in Seconds">
<meta property="og:description" content="Describe your business, get a complete professional website in about 90 seconds. Free to preview, $10/month to download the code and deploy anywhere.">
<meta property="og:url" content="https://websprout.app/">
<meta property="og:image" content="https://websprout.app/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Websprout - AI Website Builder">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Websprout: Build a Website with AI in Seconds">
<meta name="twitter:description" content="Describe your business, get a complete professional website in about 90 seconds. Free to preview, $10/month to download the code and deploy anywhere.">
<meta name="twitter:image" content="https://websprout.app/og.png">
<meta name="twitter:image:alt" content="Websprout - AI Website Builder">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":"Websprout","url":"https://websprout.app/","description":"AI website builder that generates a complete, professional website from a short description in about 90 seconds.","applicationCategory":"DesignApplication","operatingSystem":"Web browser","browserRequirements":"Requires JavaScript","offers":{"@type":"Offer","price":"10.00","priceCurrency":"USD","description":"$10/month Pro subscription. Building and publishing your site live is free; Pro removes the Websprout badge, connects your own domain, and lets you download the source code. Cancel anytime."},"featureList":["AI website generation in seconds","Live preview before paying","Conversational AI editing","Download full HTML source code","Free one-click deploy to Netlify or Cloudflare Pages"]},{"@type":"Organization","name":"Websprout","url":"https://websprout.app/","logo":"https://websprout.app/og.svg","sameAs":[]},{"@type":"WebSite","name":"Websprout","url":"https://websprout.app/"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need to pay for hosting?","acceptedAnswer":{"@type":"Answer","text":"No. Both Netlify and Cloudflare Pages have permanently free tiers that are more than enough for most websites. Netlify gives you 100GB of bandwidth per month free, and Cloudflare Pages offers unlimited bandwidth."}},{"@type":"Question","name":"Can I update my site after deploying?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the chat in Websprout to make changes, re-download your site, and re-deploy. On Netlify you can drag and drop a new file onto your existing site to update it, and on Cloudflare Pages you upload a new version through the dashboard."}},{"@type":"Question","name":"How do I connect a custom domain?","acceptedAnswer":{"@type":"Answer","text":"Both platforms make this easy and free. On Netlify, go to Site Settings, Domain Management, Add custom domain, then follow the DNS instructions from your registrar. On Cloudflare Pages, use Custom Domains, Add a domain."}},{"@type":"Question","name":"Is my site secure with HTTPS?","acceptedAnswer":{"@type":"Answer","text":"Yes, automatically. Both Netlify and Cloudflare Pages issue free SSL certificates the moment your site is deployed, so your site always serves over HTTPS with no extra configuration."}},{"@type":"Question","name":"How much does Websprout cost?","acceptedAnswer":{"@type":"Answer","text":"Building and publishing your website live is completely free, with a small Websprout badge. Go Pro for $10 per month to remove the badge, connect your own custom domain, and download the source code. You can cancel anytime."}},{"@type":"Question","name":"How long does it take to build a website?","acceptedAnswer":{"@type":"Answer","text":"About 90 seconds. You describe your business, and the AI generates a complete, professional website that you can preview live and then edit with chat."}}]}]}</script>
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
.compare-inner .section-title,.how-inner .section-title,.pricing-inner .section-title{color:#fff}
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
.chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:0}
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
</style>
<script>try{var _wsDE=document.documentElement;if(localStorage.getItem('ws_rm')==='1')_wsDE.classList.add('ws-rm');if(localStorage.getItem('ws_focus')==='1')_wsDE.classList.add('ws-focus');}catch(_e){}
window.wsClearSiteState=function(){try{var _keep={ws_rm:1,ws_focus:1,ws_theme:1,ws_edhint:1};var _rm=[];for(var _i=0;_i<localStorage.length;_i++){var _k=localStorage.key(_i);if(_k&&_k.indexOf('ws')===0&&!_keep[_k])_rm.push(_k);}for(var _j=0;_j<_rm.length;_j++)localStorage.removeItem(_rm[_j]);}catch(_e2){}try{sessionStorage.clear();}catch(_e3){}};</script>
</head>
<body>
<a class="ws-skip" href="#wsMain">Skip to main content</a>

<div class="toast" id="toast"></div>

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
  <button class="nav-cta" id="signInBtn" style="background:transparent;border:1px solid rgba(255,255,255,.18);color:#fff;margin-right:8px;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Sign in</button>
  <button class="nav-cta" id="navCta">Build for free &#8594;</button>
</nav>

<main id="wsMain" tabindex="-1">
<div class="hero" id="hero">
  <div class="hero-pill">
    <div class="hero-pill-dot"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    Free to generate &amp; preview
  </div>
  <h1>Plant an idea.<br><em>Grow a website.</em></h1>
  <p class="hero-sub">Describe your business. Get a complete, professional website in seconds.</p>

  <div class="hero-stats">
    <div class="hero-stat">
      <div class="stat-n" id="liveCount">&mdash;</div>
      <div class="stat-l">Sites grown</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">~90s</div>
      <div class="stat-l">Avg grow time</div>
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
    <div class="builder-label">&#8594; Describe your website &mdash; watch it grow</div>
    <div class="builder-card">
      <div class="step-tabs">
        <button class="step-tab active" id="tab1"><span class="step-n">1</span>Site type</button>
        <button class="step-tab" id="tab2"><span class="step-n">2</span>Details</button>
        <button class="step-tab" id="tab3"><span class="step-n">3</span>Generate</button>
      </div>

      <div class="panel active" id="panel1">
        <div class="panel-q">Describe your website</div>
        <textarea id="customPrompt" class="dark-input describe-box" rows="4" placeholder="Tell us about your business in your own words — what you do, who it's for, the vibe you want, and anything you'd like on the site.

e.g. A cozy neighborhood coffee shop and bakery in Austin. Warm and friendly. Show our menu, our story, hours, and a contact form."></textarea>
        <div class="describe-vibe">
          <span class="describe-vibe-lbl">Vibe</span>
          <div class="vibe-row">
            <button class="vibe-chip" data-style="modern and minimal">Modern</button>
            <button class="vibe-chip" data-style="bold and colorful">Bold</button>
            <button class="vibe-chip" data-style="warm and friendly">Warm</button>
            <button class="vibe-chip" data-style="dark and premium">Premium</button>
            <button class="vibe-chip" data-style="clean and professional">Professional</button>
            <button class="vibe-chip" data-style="fun and playful">Playful</button>
          </div>
        </div>
        <div class="panel-foot">
          <span class="p-hint">Free to generate &amp; preview</span>
          <button class="gen-btn" id="next1"><span>Grow my site</span><span>&#127807;</span></button>
        </div>
      </div>

      <div class="panel" id="panel2">
        <div class="panel-q">Tell us a bit more <span style="color:rgba(255,255,255,.72);font-weight:400">(all optional)</span></div>
        <div class="detail-grid">
          <div>
            <div class="field-lbl">Business name</div>
            <input id="bizName" aria-label="Business name" class="dark-input" type="text" placeholder="Leave blank - AI will create one">
          </div>
          <div>
            <div class="field-lbl">Specific requests</div>
            <input id="bizExtra" aria-label="Style or extra details" class="dark-input" type="text" placeholder="Dark theme, add pricing...">
          </div>
        </div>
        <div class="panel-foot">
          <button class="btn-back" id="back2">&#8592; Back</button>
          <button class="btn-next on" id="next2">Continue &#8594;</button>
        </div>
      </div>

      <div class="panel" id="panel3">
        <div id="gen-area">
          <div class="panel-q">Ready to grow</div>
          <div class="summary-grid" id="summaryGrid"></div>
          <button class="gen-btn" id="gbtn"><span id="gbtnTxt">Grow my site</span><span>&#127807;</span></button>
        </div>
        <div class="loading" id="loading">
          <div class="load-icon">&#127807;</div>
          <div class="load-txt" id="loadTxt">Planting your prompt...</div>
        </div>
        <div class="load-bar" id="loadBar" style="display:none"><div class="load-fill"></div></div>
        <div class="panel-foot" id="p3foot">
          <button class="btn-back" id="back3">&#8592; Back</button>
          <span class="p-hint">Usually 15-20 seconds</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="trust-item"><span class="trust-icon">&#9989;</span> No credit card to preview</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> 4 real pages generated</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Download the source code</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Deploy anywhere free</div>
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
        <p>Pick your site type, add a style vibe, and any specifics. Or leave it blank and let the AI grow something great.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">2</div>
        <h3>Watch it grow</h3>
        <p>Our AI builds a complete 4-page website with real copy, working navigation, and a contact form. Chat to refine anything.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">3</div>
        <h3>Launch your sites</h3>
        <p>Publish your site live for free at name.websprout.app. Go Pro to remove the badge, connect your own domain, and download the code. Cancel anytime.</p>
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
          <li class="cmp-item">4-page site built in under 20 seconds</li>
          <li class="cmp-item">Publish it live, free</li>
          <li class="cmp-item">$10/month - cancel anytime</li>
          <li class="cmp-item">No badge &amp; your own domain on Pro</li>
          <li class="cmp-item">Hosted free on websprout.app</li>
          <li class="cmp-item">Chat with AI to change anything</li>
        </ul>
      </div>
      <div class="cmp-card">
        <div class="cmp-head" style="color:rgba(255,255,255,.72)">Other builders</div>
        <ul class="cmp-list">
          <li class="cmp-item no">$15-40 per month, forever</li>
          <li class="cmp-item no">Locked into their platform</li>
          <li class="cmp-item no">Can't export your code</li>
          <li class="cmp-item no">Cookie-cutter templates</li>
          <li class="cmp-item no">No AI to help you edit</li>
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
    <p style="color:rgba(255,255,255,.6);font-size:15px">Build and launch your site live for free. Go Pro to make it fully yours &mdash; your domain, no badge, the code.</p>
    <div class="price-grid">
      <div class="price-card">
        <div class="price-name">Free</div>
        <div class="price-amt">$0</div>
        <div class="price-freq">always free to grow</div>
        <ul class="price-list">
          <li class="price-item">Publish a live website, free</li>
          <li class="price-item">10 free AI site builds</li>
          <li class="price-item">AI chat editing</li>
          <li class="price-item dim">Remove the Websprout badge</li>
          <li class="price-item dim">Your own domain &amp; code download</li>
        </ul>
      </div>
      <div class="price-card pick">
        <div class="price-name">Pro</div>
        <div class="price-amt"><sup>$</sup>10</div>
        <div class="price-freq">per month &middot; unlimited</div>
        <ul class="price-list">
          <li class="price-item">No Websprout badge</li>
          <li class="price-item">Connect your own domain</li>
          <li class="price-item">Unlimited AI builds</li>
          <li class="price-item">Download &amp; deploy the code</li>
          <li class="price-item">Cancel anytime</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- CTA BAND -->
<div class="cta-band">
  <h2>Your website is one<br>seed away.</h2>
  <p>Free to build and launch. $10/month to make it yours.</p>
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
<div class="studio" id="studio">
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
      <button class="s-btn s-ghost edit-mode-btn" id="editModeBtn" data-needs-site="1" title="Click any text to edit it">&#9998; Edit text</button>
      <span style="position:relative;display:inline-block">
        <button class="s-btn s-manage" id="toolsBtn" title="Your info, SEO, leads, payments & more">&#9881;&#65039; Manage &#9662;</button>
        <div id="toolsMenu" class="s-menu" style="display:none">
          <div class="gs-head">Set up your site</div>
          <button class="gs-item" data-tool="yourInfoBtn">&#128221; Your info<span class="gs-sub">Name, phone, email &amp; hours — everywhere</span></button>
          <button class="gs-item" data-tool="sectionsBtn">&#9783; Manage sections<span class="gs-sub">Add, remove or reorder</span></button>
          <button class="gs-item" data-tool="seoBtn">&#128269; SEO &amp; sharing<span class="gs-sub">Title, description, social preview</span></button>
          <button class="gs-item" onclick="if(window.wsBuildFullSite){window.wsBuildFullSite();}else{var b=document.getElementById('multiBtn');if(b)b.click();}">&#43; Add pages<span class="gs-sub">Turn this into a multi-page site (About, Shop, Contact...)</span></button>
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
        <button class="s-btn s-ghost" id="yourInfoBtn" data-needs-site="1">&#128221; Your info</button>
        <button class="s-btn s-ghost" id="sectionsBtn" data-needs-site="1">&#9783; Sections</button>
        <button class="s-btn s-ghost" id="seoBtn" data-needs-site="1">&#128269; SEO</button>
        <button class="s-btn s-ghost" id="leadsBtn" data-needs-site="1">&#128236; Leads</button>
        <button class="s-btn s-ghost" id="statsBtn" data-needs-site="1" style="display:none">&#128202; Analytics</button>
        <button class="s-btn s-ghost" id="postBtn" data-needs-site="1">&#9997; Marketing</button>
        <button class="s-btn s-ghost" id="payBtn" data-needs-site="1">&#128179; Payments</button>
        <button class="s-btn s-ghost" id="invoiceBtn" style="display:none">&#129534; Invoice</button>
        <button class="s-btn s-ghost" id="backBtn">&#8592; Back</button>
        <button class="s-btn s-ghost" id="regenBtn">&#8635; Regen</button>
      </span>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost" id="undoBtn" disabled>&#8617; Undo</button>
      <button class="s-btn s-ghost" id="redoBtn" disabled>&#8618; Redo</button>
      <button class="s-btn s-ghost" id="fullscreenBtn" data-needs-site="1" title="Full screen preview">&#9974; Preview</button>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost s-icon" id="mySitesBtn" aria-label="Your saved sites" title="Your saved sites">&#128194;</button>
      <button class="s-btn s-ghost" id="acctBtn" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="Your account">&#128100; Sign in</button>
      <span id="outActions" style="display:none">
      <button class="s-btn s-ghost" id="shareBtn" data-needs-site="1">&#128279; Share</button>
      <button class="s-btn" id="publishBtn" data-needs-site="1">&#127760; Publish</button>
      <button class="s-btn s-ghost" id="dlBtn" data-needs-site="1">&#8595; Download</button>
      <button class="s-btn s-ghost" id="multiBtn" data-needs-site="1" title="Build a full multi-page site (About, Menu, Contact...)">&#43; Add pages</button>
      <button class="s-btn s-ghost" id="prodBtn" data-needs-site="1" title="Manage your shop products">&#128722; Products</button>
      <button class="s-btn s-ghost" id="copyBtn" data-needs-site="1" title="Copy full HTML to clipboard">&#128203; Copy code</button>
      <button class="s-btn s-ghost" id="deployBtn" data-needs-site="1">&#128640; Deploy</button>
      </span>
      <style>.gs-item{display:block;width:100%;text-align:left;background:none;border:none;color:#fff;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}.gs-item:hover{background:rgba(45,122,58,.18)}.gs-sub{display:block;font-size:11px;color:rgba(255,255,255,.72);font-weight:400;margin-top:1px}.gs-head{font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:rgba(255,255,255,.72);padding:10px 12px 4px}.gs-head:first-child{padding-top:4px}.s-sep{width:1px;height:20px;background:rgba(255,255,255,.1);margin:0 3px;flex-shrink:0;align-self:center}.s-menu{position:absolute;top:calc(100% + 6px);right:0;background:#0f1a0d;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;min-width:218px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:1000}.s-icon{padding:6px 9px}</style>
      <span id="saveStatus" style="font-size:12px;color:rgba(255,255,255,.72);font-weight:600;margin-right:6px;opacity:0;transition:opacity .3s;white-space:nowrap" title="Your work autosaves as you edit">Saved</span>
      <span style="position:relative;display:inline-block">
        <button class="s-btn" id="getSiteBtn" data-needs-site="1" style="background:#2d7a3a;color:#fff;border-color:#2d7a3a;font-weight:700" title="Publish, download or share your site">&#128640; Get your site &#9662;</button>
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
      <button class="s-btn s-purple" id="unlockBtn">&#10024; Go Pro &middot; $10/mo</button>
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
            <div style="font-size:12.5px;color:rgba(255,255,255,.72);line-height:1.5;margin-bottom:11px">Go Pro to remove the badge, connect your own domain, and download the code.</div>
            <button id="pubBadgeGoPro" class="s-btn s-purple" style="width:100%;padding:10px;border-radius:9px;font-size:13.5px;font-weight:700;cursor:pointer">&#10024; Go Pro &mdash; remove the badge</button>
          </div>
          <div id="pubDomainLocked" style="display:none;border-top:1px solid rgba(255,255,255,.07);margin-top:18px;padding-top:18px">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">&#128274; Use your own domain</div>
            <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:10px">Connecting a custom domain is a Pro feature.</div>
            <button id="pubDomGoPro" style="width:100%;background:rgba(109,40,217,.18);color:#c4b5fd;border:1px solid rgba(109,40,217,.4);border-radius:9px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Go Pro to use your domain</button>
          </div>
          <div id="pubDomainPro" style="border-top:1px solid rgba(255,255,255,.07);margin-top:18px;padding-top:18px">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">Use your own domain</div>
            <div style="font-size:12px;color:rgba(255,255,255,.72);margin-bottom:10px">Find one, buy it on GoDaddy, then point it here.</div>
            <div style="display:flex;gap:8px">
              <input id="domInput" aria-label="Custom domain" type="text" placeholder="yourbusiness.com" autocomplete="off" style="flex:1;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:9px;color:#fff;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;min-width:0">
              <button id="domCheck" style="background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Check</button>
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
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:curHtml(),slug:s,siteId:site(),key:key(),pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){
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
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:curHtml(),slug:window._wsSlug,siteId:site(),key:key(),pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){btn.innerHTML=orig;if(window.toast)toast(j.error?j.error:'\u2713 Updated — your live site now shows your latest edits.');}).catch(function(){btn.innerHTML=orig;if(window.toast)toast('Could not update — please try again');});
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
    $('domCheck').addEventListener('click',function(){
      var d=$('domInput').value.trim();var res=$('domResult');if(!d)return;
      res.innerHTML='<span style="color:rgba(255,255,255,.72)">Checking...</span>';
      fetch('/api/domain-check?domain='+encodeURIComponent(d)).then(function(r){return r.json();}).then(function(j){
        var buy='<a href="'+(j.buyUrl||'https://www.godaddy.com')+'" target="_blank" style="color:#4ade80;font-weight:700;text-decoration:none">Buy on GoDaddy &#8594;</a>';
        var status='';
        if(j.available===true)status='<span style="color:#4ade80">&#10003; '+j.domain+' is available'+(j.price?(' (about $'+j.price.toFixed(2)+'/yr)'):'')+'</span><br>';
        else if(j.available===false)status='<span style="color:#f87171">'+j.domain+' is taken</span><br>';
        res.innerHTML=status+buy+'<div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:8px">After buying, add a CNAME record pointing to <b style="color:#fff">'+(window._wsSlug||'your-site')+'.websprout.app</b> to connect it.</div>';
      }).catch(function(){res.innerHTML='<a href="https://www.godaddy.com/domainsearch/find?domainToCheck='+encodeURIComponent(d)+'" target="_blank" style="color:#4ade80;font-weight:700">Search on GoDaddy &#8594;</a>';});
    });
  })();
  </script>
  <div class="s-mobtabs" id="sMobTabs">
    <button class="s-mobtab active" data-mob="preview">&#128065;&#65039; Preview</button>
    <button class="s-mobtab" data-mob="chat">&#9998; Edit with AI</button>
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
      if(body){if(mode==='chat')body.classList.add('mob-chat');else body.classList.remove('mob-chat');}
    });}
  })();
  </script>
  <div class="s-body">
    <div class="preview-frame-wrap" id="previewWrap">
      <iframe id="pf" style="width:100%;height:4000px;border:none;display:block;background:#fff"></iframe>
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
        <div class="lock-title">🔒 Love what you see?</div>
        <div class="lock-sub">Go Pro to remove the Websprout badge, use your own domain, and download the code. Cancel anytime.</div>
        <input type="email" id="emailCapture" aria-label="Email address" class="lock-email" placeholder="your@email.com">
        <button class="s-btn s-purple" style="width:100%;padding:10px;border-radius:8px;font-size:13px" id="lockPayBtn">Go Pro — $10/mo</button>
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
          <button id="flmGoPro" class="s-btn s-purple" style="width:100%;padding:13px;border-radius:11px;font-size:15px;font-weight:700;margin-bottom:10px">&#10024; Go Pro &mdash; $10/mo</button>
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
        <div class="chat-head-title">✨ Edit with AI</div>
        <div class="chat-head-sub">Describe any change in plain English and I’ll update your site live.</div>
      </div>
      <div class="chat-msgs" id="cms">
        <div class="msg msg-ai"><div class="msg-name">Websprout AI</div><div class="msg-body" id="introMsg">Designing your site… this can take up to a minute 🌱</div></div>
      </div>
      <div class="typing" id="tw"><div class="typing-bub"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>
      <!-- Image Library -->
      <div class="img-library collapsed" id="imgLibrary">
        <button class="img-lib-toggle" id="imgLibToggle" type="button">
          <span class="img-lib-label">📷 Add photos</span>
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
        <span class="palette-label" style="margin-bottom:0">🎨 Colors &amp; fonts</span>
        <span class="dd-caret">&#9660;</span>
      </button>
      <div class="dd-body">
      <!-- Live Color Panel -->
      <div class="live-color-panel">
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

      <!-- Color palette picker -->
      <div class="palette-section">
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
        <span class="ed-hint-txt">👋 New here? <b>Tap a quick change</b> below, <b>type any request</b>, or hit <b>✎ Edit text</b> to edit on the page. For your info, SEO, leads &amp; payments, open <b>&#9881;&#65039; Manage</b> up top.</span>
        <button class="ed-hint-x" id="edHintX" type="button" title="Got it">&times;</button>
      </div>
      <div class="quick-edits">
        <div class="qe-label">⚡ Tap a quick change — or type your own below</div>
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
      <div class="chat-input">
        <div class="chat-row">
          <textarea class="chat-ta" id="ci" aria-label="Describe a change" placeholder="Describe a change — e.g. “make it blue” or “add a pricing section”" rows="1"></textarea>
          <button class="chat-send" id="csb"><svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>
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
      <div class="slot-ai">
        <div class="slot-ai-row">
          <input type="text" id="slotAiPrompt" aria-label="Describe an image to generate" placeholder="Describe an image to generate with AI&hellip;" autocomplete="off">
          <button id="slotAiBtn">&#10024; Generate</button>
        </div>
        <div class="slot-ai-msg" id="slotAiMsg"></div>
      </div>
      <div class="slot-divider"><span>or upload your own</span></div>
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
        <div class="set-note" style="margin-bottom:0">Remove the &ldquo;Made with Websprout&rdquo; badge, connect your own custom domain, download your full source code, and unlock multi-page sites and the built-in store. $10/month, cancel anytime.</div>
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
        act.innerHTML='<button id="pfGoPro" style="width:100%;background:linear-gradient(135deg,#2d9e4a,#1c6e32);color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(45,158,74,.35)">\u2726 Go Pro \u2014 $10/mo</button><div style="font-size:12px;color:rgba(255,255,255,.72);text-align:center;margin-top:9px;line-height:1.5">Unlock downloads, deploys, and editing across all of your sites.</div>';
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
    if(me&&me.auth){var dn=displayName(me);btn.textContent='';var nmS=document.createElement('span');nmS.className='auth-name';nmS.textContent='Hello, '+dn;var avS=document.createElement('span');avS.className='auth-ava';avS.textContent=(dn?dn.charAt(0):'?').toUpperCase();btn.appendChild(nmS);btn.appendChild(avS);btn.title='Signed in as '+(me.email||'')+' — view your account';btn.onclick=function(){if(window.openProfile)window.openProfile();};btn.classList.add('is-authed');}
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
  function nameFrom(h){var a=h.indexOf('<title>'),b=h.indexOf('</title>');var n=(a>-1&&b>-1)?h.slice(a+7,b):'';n=n.replace(/\s*\|.*$/,'').trim();return n.slice(0,60)||'My site';}
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
    var _sd=_wsSaveData(h);fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:s,key:k,html:_sd.html,name:nm,pages:_sd.pages})}).then(function(r){
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
  function _wsBeacon(){if(window._wsSaveReady===false)return;try{var s=site(),k=key(),h=curHtml();if(!s||!h||h.length<100)return;var nm=nameFrom(h);var _sd=_wsSaveData(h);var payload=JSON.stringify({siteId:s,key:k,html:_sd.html,name:nm,pages:_sd.pages});if(navigator.sendBeacon){var blob=new Blob([payload],{type:'application/json'});if(navigator.sendBeacon('/save',blob)){lastSite=s;lastHtml=h;upsert(s,k,nm);return;}}try{fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true});lastSite=s;lastHtml=h;upsert(s,k,nm);}catch(e){}}catch(e){}}
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
      try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',sid);localStorage.setItem('ws_key',it.key||'');sessionStorage.setItem('ws_studio','1');}catch(e){}
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
        if(j&&j.html){try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',dsid);localStorage.setItem('ws_key',dk);sessionStorage.setItem('ws_studio','1');}catch(e){}window._wsSite=dsid;window._wsKey=dk;history.replaceState(null,'',location.pathname);location.reload();}
      }).catch(function(){});
    }
  }catch(e){}
  setTimeout(accountSync,1600);
})();
</script>

<script>
// Websprout v3.1
var gHTML='',unlocked=false,selectedType='',selectedStyle='';
// ── Error visibility: report studio JS errors so breakage is seen, not guessed ──
(function(){
  var _errSent=0,_errSeen={};
  window._wsReport=function(o){
    try{
      if(_errSent>15)return;
      var _ign=['_AutofillCallbackHandler','webkit.messageHandlers','ResizeObserver loop','Non-Error promise rejection'];
      for(var _ii=0;_ii<_ign.length;_ii++){ if((o.msg||'').indexOf(_ign[_ii])>-1) return; }
      var key=(o.msg||'')+'|'+(o.line||'');
      if(_errSeen[key])return;_errSeen[key]=1;_errSent++;
      o.where=o.where||'studio';o.url=location.href;
      try{o.build=window._wsBuild||'';}catch(e){}
      fetch('/api/clientlog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o),keepalive:true}).catch(function(){});
    }catch(e){}
  };
  window.addEventListener('error',function(e){window._wsReport({msg:(e&&e.message)||'error',src:(e&&e.filename)||'',line:(e&&e.lineno)||0,stack:(e&&e.error&&e.error.stack)||''});});
  window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;window._wsReport({msg:('promise: '+((r&&r.message)||String(r||''))).slice(0,200),stack:(r&&r.stack)||''});});
})();
var undoStack=[],redoStack=[],editCount=0;

// "Sites grown" is the REAL total (sum of all builds), rendered server-side into #liveCount.

// Auto-detect device type and set preview mode
function autoSetDevice(){
  var ua=navigator.userAgent.toLowerCase();
  var w=window.innerWidth;
  var isMobile=/iphone|android|mobile/.test(ua)||w<=480;
  var isTablet=/ipad|tablet/.test(ua)||(w>480&&w<=1024&&'ontouchstart' in window);
  var devId=isMobile?'devMobile':isTablet?'devTablet':'devDesktop';
  var wrap=document.getElementById('previewWrap');
  document.querySelectorAll('.dev-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById(devId);
  if(btn)btn.classList.add('active');
  if(wrap){
    wrap.classList.remove('tablet','mobile');
    if(isMobile)wrap.classList.add('mobile');
    else if(isTablet)wrap.classList.add('tablet');
  }
}

// Payment return
(function(){
  try{
    var p=new URLSearchParams(window.location.search);
    if(p.get('sub')==='success'){
      window.history.replaceState({},'',window.location.pathname);
      toast('\uD83C\uDF89 Thanks! Activating your subscription...',6000);
      var tries=0;
      var iv=setInterval(function(){
        tries++;
        fetch('/me').then(function(r){return r.json();}).then(function(me){
          window._wsUser=me;
          if(me&&me.pro){clearInterval(iv);unlocked=true;try{applyUnlock();}catch(e){}toast('\u2705 You are Pro \u2014 everything is unlocked!',6000);}
          else if(tries>=8){clearInterval(iv);toast('Payment received \u2014 if it does not unlock shortly, refresh the page.',7000);}
        }).catch(function(){if(tries>=8)clearInterval(iv);});
      },2000);
    }
    var s=localStorage.getItem('wsh');if(s&&s.length>100)gHTML=s;
  }catch(e){}
})();

function toast(m,d){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');if(t._wsTo)clearTimeout(t._wsTo);t._wsTo=setTimeout(function(){t.classList.remove('on');t._wsTo=null;},d||4000);}

// Derive a clean download filename from the site's <title>
function siteFilename(){
  var name='';
  var tS=gHTML.indexOf('<title>'),tE=gHTML.indexOf('</title>');
  if(tS>-1&&tE>-1)name=gHTML.slice(tS+7,tE);
  name=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
  return name||'websprout-site';
}

// -- Undo Stack ------------------------------------------------
var _wsLiveSyncTimer=null,_wsSyncToastAt=0,_wsSyncErrAt=0;
function autoSyncLive(){
  try{
    var sid=window._wsSite||localStorage.getItem('ws_site')||'';
    if(!sid)return;
    var slug=localStorage.getItem('ws_slug_'+sid)||'';
    if(!slug)return; // only auto-update sites that are actually published/live
    if(_wsLiveSyncTimer)clearTimeout(_wsLiveSyncTimer);
    _wsLiveSyncTimer=setTimeout(function(){
      var html=(typeof gHTML==='string'&&gHTML)||localStorage.getItem('wsh')||'';
      if(!html)return;
      var k=window._wsKey||localStorage.getItem('ws_key')||'';
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:html,slug:slug,siteId:sid,key:k,pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){
        if(j&&!j.error){var n=Date.now();if(n-_wsSyncToastAt>7000){_wsSyncToastAt=n;if(window.toast)toast('\u2713 Live site updated',1600);}}
        else{var n2=Date.now();if(n2-_wsSyncErrAt>20000){_wsSyncErrAt=n2;if(window.toast)toast('Could not update your live site \u2014 use Update in the publish panel',2800);}}
      }).catch(function(){var n3=Date.now();if(n3-_wsSyncErrAt>20000){_wsSyncErrAt=n3;if(window.toast)toast('Could not update your live site \u2014 use Update in the publish panel',2800);}});
    },1600);
  }catch(e){}
}
var _wsSaveTimer=null;
function scheduleSave(){
  try{window._wsLiveHtml=gHTML;}catch(e){}
  if(_wsSaveTimer)clearTimeout(_wsSaveTimer);
  _wsSaveTimer=setTimeout(function(){ try{ if(window._wsTrackNow)window._wsTrackNow(); }catch(e){} },1200);
}
// Real-time autosave heartbeat: every 2s, if the live editor buffer changed at all,
// mirror it to localStorage and push it to the server — no matter which edit path made
// the change. This is the safety net so EVERY edit persists quickly, not just ones that
// happen to call scheduleSave().
var _wsHbLast='';
setInterval(function(){
  try{
    if(typeof gHTML==='string'&&gHTML.length>100&&gHTML!==_wsHbLast){
      _wsHbLast=gHTML;
      window._wsLiveHtml=gHTML;
      try{localStorage.setItem('wsh',gHTML);}catch(e){}
      if(window._wsTrackNow)window._wsTrackNow();
    }
  }catch(e){}
},2000);
function pushUndo(html){
  undoStack.push(html);
  if(undoStack.length>10)undoStack.shift();
  redoStack=[]; // a new edit invalidates the redo history
  refreshHistoryBtns();
  autoSyncLive();
  scheduleSave();
}

function refreshHistoryBtns(){
  var ub=document.getElementById('undoBtn');
  if(ub){ub.disabled=undoStack.length<2;ub.textContent='<< Undo'+(undoStack.length>1?' ('+(undoStack.length-1)+')':'');}
  var rb=document.getElementById('redoBtn');
  if(rb){rb.disabled=redoStack.length<1;rb.textContent='>> Redo'+(redoStack.length>0?' ('+redoStack.length+')':'');}
}

function syncEditCounter(){
  var ec=document.getElementById('editCounter');
  if(ec){ec.textContent=editCount+' edit'+(editCount===1?'':'s');ec.style.display=editCount===0?'none':'inline';}
}

function doUndo(){
  if(undoStack.length<2)return;
  redoStack.push(undoStack.pop()); // move current state onto redo stack
  gHTML=undoStack[undoStack.length-1];
  localStorage.setItem('wsh',gHTML);
  setTimeout(function(){setPreview(gHTML);},50);
  editCount=Math.max(0,editCount-1);
  syncEditCounter();
  refreshHistoryBtns();
  addMsg('ai','<< Undone! Restored previous version.');
  toast('<< Undone - previous version restored');
  autoSyncLive();
  scheduleSave();
}

function doRedo(){
  if(redoStack.length<1)return;
  var next=redoStack.pop();
  undoStack.push(next);
  gHTML=next;
  localStorage.setItem('wsh',gHTML);
  setTimeout(function(){setPreview(gHTML);},50);
  editCount++;
  syncEditCounter();
  refreshHistoryBtns();
  addMsg('ai','>> Redone! Re-applied that change.');
  toast('>> Redone - change re-applied');
  autoSyncLive();
  scheduleSave();
}

// -- Edit counter -----------------------------------------------
function bumpEditCount(){
  editCount++;
  var el=document.getElementById('editCounter');
  if(el){el.textContent=editCount+' edit'+(editCount===1?'':'s');el.style.display='inline';}
}

function setPreview(html){
  var f=document.getElementById('pf');if(!f||!html)return;
  // Keep the studio top-bar title in sync with the site's current <title> (renames, edits, etc.)
  try{var _ts=html.indexOf('<title>'),_te=html.indexOf('</title>');if(_ts>-1&&_te>_ts){var _tt=html.slice(_ts+7,_te).trim();var _st=document.getElementById('stitle');if(_st&&_tt)_st.textContent=_tt.slice(0,50);}}catch(e){}
  var skel=document.getElementById('skelWrap');
  if(skel)skel.classList.add('show');
  // No <base> tag — we handle all link clicks manually in the injected script
  // Inject slot click handler + nav fix into preview
  // Build combined injection script (slots + edit mode)
  var slotScript='<scr'+'ipt id=\"_wsInject\">'+

    // Edit mode toggle
    'window._wsEM=false;'+
    'window.addEventListener(\"message\",function(e){'+
      'if(!e.data||typeof e.data!==\"object\")return;'+
      'if(e.data.type===\"wsSetEditMode\"){'+
        'window._wsEM=e.data.active;'+
        'var s=document.getElementById(\"_wsES\");'+
        'if(e.data.active&&!s){'+
          's=document.createElement(\"style\");s.id=\"_wsES\";'+
          's.textContent=\"h1,h2,h3,h4,h5,h6,p,li,a,button,span,img,blockquote,section,header,footer,div{cursor:pointer!important}h1:hover,h2:hover,h3:hover,h4:hover,h5:hover,h6:hover,p:hover,li:hover,a:hover,button:hover,img:hover,blockquote:hover{outline:2px solid rgba(61,186,82,.75)!important;outline-offset:2px!important}\";'+
          'document.head.appendChild(s);'+
        '}else if(!e.data.active&&s)s.remove();'+
      '}'+
    '});'+

    // Double-click to edit text
    'document.addEventListener(\"dblclick\",function(e){'+
      'if(!window._wsEM)return;'+
      'var el=e.target.closest(\"h1,h2,h3,h4,h5,h6,p,li,a,button,span,td,th,label,strong,b,em,small,sup,sub,div\");'+
      'if(!el||el.isContentEditable)return;'+
      'if(el.tagName===\"DIV\"&&(el.classList.contains(\"ws-img-slot\")||el.querySelector(\"img,form,section,header,footer,nav\")))return;'+
      'e.preventDefault();e.stopPropagation();'+
      'var oldOuter=el.outerHTML,origInner=el.innerHTML;'+
      'el.contentEditable=\"true\";el.style.outline=\"2px solid #3dba52\";el.focus();'+
      'el.addEventListener(\"blur\",function(){'+
        'el.contentEditable=\"false\";el.style.outline=\"\";'+
        'if(el.outerHTML!==oldOuter)parent.postMessage({type:\"wsTextEdit\",oldOuter:oldOuter,newOuter:el.outerHTML},\"*\");'+
      '},{once:true});'+
      'el.addEventListener(\"keydown\",function(ev){'+
        'if(ev.key===\"Enter\"&&!ev.shiftKey){ev.preventDefault();el.blur();}'+
        'if(ev.key===\"Escape\"){el.innerHTML=origInner;el.blur();}'+
      '});'+
    '});'+

    // Single-click select (Canva-style) — mark the clicked element + report it to the parent
    'document.addEventListener("click",function(e){'+
      'if(!window._wsEM)return;'+
      'var el=e.target;'+
      'if(!el||el===document.body||el===document.documentElement)return;'+
      'if(el.closest&&el.closest("[data-wsfloat]"))return;'+
      'e.preventDefault();e.stopPropagation();'+
      'var prev=document.querySelector("[data-wssel]");if(prev){prev.removeAttribute("data-wssel");prev.style.outline="";prev.style.outlineOffset="";}'+
      'el.setAttribute("data-wssel","1");el.style.outline="2px solid #3dba52";el.style.outlineOffset="1px";'+
      'var kind="text";'+
      'if(el.classList.contains("ws-img-slot")||el.hasAttribute("data-slot-filled")||el.tagName==="IMG")kind="image";'+
      'else if(el.tagName==="SECTION"||el.tagName==="HEADER"||el.tagName==="FOOTER")kind="section";'+
      'else if(el.tagName==="DIV"){var rr=el.getBoundingClientRect();if(rr.height>160&&el.children.length>=2)kind="section";}'+
      'var cs=getComputedStyle(el);'+
      'parent.postMessage({type:"wsSelect",kind:kind,tag:el.tagName,fontSize:parseInt(cs.fontSize)||16,slotId:(el.getAttribute("data-slot")||el.getAttribute("data-slot-filled")||"")},"*");'+
    '},true);'+

    // Wire image slots - direct listeners, no innerHTML, no quote escaping issues
    'function wsWireSlots(){'+
      // Empty slots - click to add photo
      'document.querySelectorAll(\".ws-img-slot\").forEach(function(s){'+
        'if(s._wsW)return;s._wsW=1;'+
        's.style.cssText+=\";cursor:pointer!important;pointer-events:auto!important\";'+
        's.onclick=function(e){e.preventDefault();e.stopPropagation();'+
          'try{document.querySelectorAll(\"[data-ws-active]\").forEach(function(x){x.removeAttribute(\"data-ws-active\")});s.setAttribute(\"data-ws-active\",\"1\");}catch(_e){}'+
          'parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot\")||\"image\",label:s.getAttribute(\"data-label\")||\"Add photo\"},\"*\");'+
        '};'+
      '});'+
      // Filled slots - click to change photo, show overlay on hover
      'document.querySelectorAll(\"[data-slot-filled]\").forEach(function(s){'+
        'if(s._wsW)return;s._wsW=1;'+
        's.style.cssText+=\";cursor:pointer!important;pointer-events:auto!important;position:relative\";'+
        // Build overlay with createElement - no quote escaping needed
        'var ov=document.createElement(\"div\");'+
        'ov.style.cssText=\"position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;border-radius:inherit;pointer-events:none\";'+
        'var lb=document.createElement(\"span\");'+
        'lb.style.cssText=\"background:rgba(255,255,255,.92);color:#111;padding:7px 18px;border-radius:100px;font-size:13px;font-weight:700\";'+
        'lb.textContent=\"Change photo\";'+
        'ov.appendChild(lb);s.appendChild(ov);'+
        's.onmouseenter=function(){ov.style.opacity=\"1\";};'+
        's.onmouseleave=function(){ov.style.opacity=\"0\";};'+
        's.onclick=function(e){e.preventDefault();e.stopPropagation();'+
          'try{document.querySelectorAll(\"[data-ws-active]\").forEach(function(x){x.removeAttribute(\"data-ws-active\")});s.setAttribute(\"data-ws-active\",\"1\");}catch(_e){}'+
          'parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot-filled\")||\"image\",label:\"Change photo\"},\"*\");'+
        '};'+
      '});'+
    '}'+
    // Floating "add photo" pill for background slots that sit BEHIND content
    // (e.g. full-bleed hero backgrounds) where the slot itself cannot receive clicks.
    'function wsFloaters(){'+
      'document.querySelectorAll(\"[data-wsfloat]\").forEach(function(b){'+
        'if(!b._slot||!b._slot.isConnected||!b._slot.classList.contains(\"ws-img-slot\")){if(b._slot)b._slot._wsFloatBtn=null;b.remove();}'+
      '});'+
      'document.querySelectorAll(\".ws-img-slot\").forEach(function(s){'+
        'var r=s.getBoundingClientRect();'+
        'if(r.width<20||r.height<20)return;'+
        'var cy=r.top+(r.height>180?90:r.height/2);'+
        'var topEl=document.elementFromPoint(r.left+r.width/2,cy);'+
        'var overlapped=topEl&&topEl!==s&&!s.contains(topEl);'+
        'if(overlapped){'+
          'var btn=s._wsFloatBtn;'+
          'if(!btn||!btn.isConnected){'+
            'btn=document.createElement(\"div\");'+
            'btn.setAttribute(\"data-wsfloat\",\"1\");'+
            'btn._slot=s;'+
            'btn.textContent=\"\\uD83D\\uDCF7 Add background photo\";'+
            'btn.style.cssText=\"position:absolute;z-index:2147483600;padding:9px 16px;background:rgba(17,17,17,.85);color:#fff;font:600 13px -apple-system,BlinkMacSystemFont,sans-serif;border-radius:100px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap\";'+
            'btn.onclick=function(e){e.preventDefault();e.stopPropagation();try{document.querySelectorAll(\"[data-ws-active]\").forEach(function(x){x.removeAttribute(\"data-ws-active\")});s.setAttribute(\"data-ws-active\",\"1\");}catch(_e){}parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot\")||\"image\",label:s.getAttribute(\"data-label\")||\"Add photo\"},\"*\");};'+
            'document.body.appendChild(btn);'+
            's._wsFloatBtn=btn;'+
          '}'+
          'var bw=btn.offsetWidth||170;'+
          'btn.style.left=(r.left+(window.pageXOffset||0)+r.width/2-bw/2)+\"px\";'+
          'btn.style.top=(r.top+(window.pageYOffset||0)+16)+\"px\";'+
        '}else if(s._wsFloatBtn){s._wsFloatBtn.remove();s._wsFloatBtn=null;}'+
      '});'+
    '}'+
    'wsWireSlots();wsFloaters();'+
    // Re-wire + reposition floaters when the DOM or layout changes
    'new MutationObserver(function(){wsWireSlots();wsFloaters();}).observe(document.body,{childList:true,subtree:true});'+
    'window.addEventListener(\"resize\",wsFloaters);'+
    'window.addEventListener(\"load\",function(){setTimeout(wsFloaters,300);});'+
    'setTimeout(wsFloaters,500);setTimeout(wsFloaters,1300);setTimeout(wsFloaters,2200);'+

    // Link handling - hash links untouched, everything else just preventDefault
    // (no window.open - that was causing the duplicate tab issue)
    'document.addEventListener(\"click\",function(e){'+
      'var a=e.target.closest(\"a\");'+
      'if(!a)return;'+
      'var h=a.getAttribute(\"href\")||\"\";'+
      'if(h.indexOf(\"mailto:\")===0||h.indexOf(\"tel:\")===0||h.indexOf(\"javascript:\")===0)return;'+
      // Block EVERYTHING else from navigating the srcdoc preview away — empty, "#", "/", and full URLs
      // all resolve to websprout.app inside an srcdoc iframe and would load the whole app in the preview.
      // For genuine in-page hash links, scroll to the target manually instead of letting it navigate.
      'e.preventDefault();'+
      // External links (DoorDash, Toast, booking pages, socials) go to a DIFFERENT origin — open them in a
      // new tab so they visibly work; they never cause the srcdoc recursion. Same-origin/relative/# links
      // would resolve to websprout.app and load the app, so we keep them in-page: scroll to the matching
      // section, or fall back to the contact form so the button always does something.
      'if((h.indexOf(\"http://\")===0||h.indexOf(\"https://\")===0)&&h.indexOf(\"websprout.app\")===-1){try{window.open(h,\"_blank\",\"noopener\");}catch(err){}return;}'+
      'try{if(window.parent.wsNavClick&&window.parent.wsNavClick(h,(a.textContent||\"\"))){return;}}catch(_pe){}'+
      'try{var t=(h.length>1&&h.charAt(0)===\"#\")?document.getElementById(h.slice(1)):null;if(!t)t=document.querySelector(\"form\");if(t&&t.scrollIntoView)t.scrollIntoView({behavior:\"smooth\"});}catch(err){}'+
    '},true);'+
    // Never let a form submission navigate the preview away (it was loading the whole app inside the preview)
    'document.addEventListener(\"submit\",function(e){e.preventDefault();},true);'+

  '</sc'+'ript>';
  // Use lastIndexOf to find the REAL </body> — not one inside a JS string
  function wsRenderProducts(list){var esc=function(x){x=String(x==null?"":x);return x.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(String.fromCharCode(34)).join("&quot;");};var css='<style>.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;max-width:1100px;margin:0 auto;padding:8px 0}.wsp-card{border:1px solid rgba(128,128,128,.18);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;background:rgba(128,128,128,.04)}.wsp-img{aspect-ratio:4/3;background-size:cover;background-position:center}.wsp-noimg{background:linear-gradient(135deg,rgba(128,128,128,.12),rgba(128,128,128,.05))}.wsp-body{padding:16px;display:flex;flex-direction:column;gap:6px}.wsp-name{font-weight:700;font-size:1.05rem}.wsp-price{font-weight:700;opacity:.85}.wsp-desc{font-size:.9rem;opacity:.7;line-height:1.5}.wsp-buy{margin-top:8px;display:inline-block;text-align:center;padding:10px 16px;border:1px solid currentColor;border-radius:10px;text-decoration:none;color:inherit;font-weight:600}</style>';if(!list||!list.length){return css+'<div style="text-align:center;opacity:.55;padding:44px 0;font-size:1rem">Your products show here - add them from the Manage menu (Products &amp; cart).</div>';}var cards="";for(var i=0;i<list.length;i++){var p=list[i]||{};var img=p.img?('<div class="wsp-img" style="background-image:url('+esc(p.img)+')"></div>'):'<div class="wsp-img wsp-noimg"></div>';var price=p.price?('<div class="wsp-price">'+esc(p.price)+'</div>'):"";var desc=p.desc?('<div class="wsp-desc">'+esc(p.desc)+'</div>'):"";var pu=String(p.payUrl||"");var buy=(pu.indexOf("https://")===0)?'<a class="wsp-buy">Buy now</a>':'<a class="wsp-buy">Add to cart</a>';cards+='<div class="wsp-card">'+img+'<div class="wsp-body"><div class="wsp-name">'+esc(p.name||"Product")+'</div>'+price+desc+buy+'</div></div>';}return css+'<div class="wsp-grid">'+cards+'</div>';}
  var bodyClose=html.lastIndexOf('</body>');
  var out=bodyClose>-1?html.slice(0,bodyClose)+slotScript+'</body>'+html.slice(bodyClose+7):html+slotScript;
  try{if(out.indexOf('<!--WS_PRODUCTS-->')>-1){out=out.split('<!--WS_PRODUCTS-->').join(wsRenderProducts(window._wsProducts||[]));}}catch(e){}
  f.style.height='4000px';
  f.srcdoc=out;
  // Poll for real content height - CSS may not be applied at onload time
  var attempts=0;
  var lastH=0;
  var timer=setInterval(function(){
    attempts++;
    try{
      var d=f.contentDocument||f.contentWindow.document;
      if(d&&d.body){
        var sh=Math.max(d.documentElement.scrollHeight,d.body.scrollHeight);
        var lb=0,kids=d.body.children;
        for(var ki=kids.length-1;ki>=0;ki--){var kr=kids[ki].getBoundingClientRect();if(kr.height>0){lb=Math.ceil(kr.bottom);break;}}
        var h=(lb>200&&lb<=sh)?lb:sh;
        if(h>200){
          // Hide skeleton once content is ready
          var skel=document.getElementById('skelWrap');
          if(skel){skel.classList.remove('show');setStudioReady(true);}
        }
        if(h>200&&h!==lastH){
          lastH=h;
          f.style.height=(h+24)+'px';
        }
      }
    }catch(e){}
    if(attempts>=15){
      var skel=document.getElementById('skelWrap');
      if(skel)skel.classList.remove('show');
      setStudioReady(true);
      clearInterval(timer);
    }
  },200);
}

function showPanel(n){
  [1,2,3].forEach(function(i){
    document.getElementById('panel'+i).classList.toggle('active',i===n);
    var t=document.getElementById('tab'+i);
    t.classList.toggle('active',i===n);
    t.classList.toggle('done',i<n);
  });
}

document.addEventListener('DOMContentLoaded',function(){
  // Wrap in try-catch to catch silent errors
  try{
  // Transparent nav that gains a background once you scroll (keeps it readable over light sections)
  (function(){var nav=document.querySelector('nav');if(nav){var os=function(){if(window.scrollY>16)nav.classList.add('scrolled');else nav.classList.remove('scrolled');};os();window.addEventListener('scroll',os,{passive:true});}})();
  // Mobile nav dropdown toggle
  (function(){
    var burger=document.getElementById('navBurger');
    var links=document.querySelector('.nav-links');
    if(burger&&links){
      burger.addEventListener('click',function(e){
        e.stopPropagation();
        var open=links.classList.toggle('open');
        burger.setAttribute('aria-expanded',open?'true':'false');
      });
      links.addEventListener('click',function(e){
        if(e.target.closest('a')){links.classList.remove('open');burger.setAttribute('aria-expanded','false');}
      });
      document.addEventListener('click',function(e){
        if(links.classList.contains('open')&&!links.contains(e.target)&&!burger.contains(e.target)){
          links.classList.remove('open');burger.setAttribute('aria-expanded','false');
        }
      });
    }
  })();
  // Type buttons
  document.querySelectorAll('.type-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.type-btn').forEach(function(b){b.classList.remove('sel');});
      btn.classList.add('sel');
      var cw=document.getElementById('customWrap');
      if(btn.dataset.type==='OTHER'){selectedType='';if(cw)cw.style.display='block';var cp=document.getElementById('customPrompt');if(cp)cp.focus();}
      else{selectedType=btn.dataset.type;if(cw)cw.style.display='none';}
      var n1=document.getElementById('next1');if(n1)n1.classList.add('on');
    });
  });
  var cpEl=document.getElementById('customPrompt');
  try{var _pp=localStorage.getItem('ws_pending_prompt');if(_pp&&cpEl&&!cpEl.value){cpEl.value=_pp;localStorage.removeItem('ws_pending_prompt');selectedType='__c__';var _n1=document.getElementById('next1');if(_n1)_n1.classList.add('on');}}catch(e){}
  if(cpEl)cpEl.addEventListener('input',function(){
    selectedType=cpEl.value.trim()?'__c__':'';
    document.getElementById('next1').classList.toggle('on',!!cpEl.value.trim());
  });

  // Vibe chips
  document.querySelectorAll('.vibe-chip').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('.vibe-chip').forEach(function(x){x.classList.remove('sel');});
      c.classList.add('sel');selectedStyle=c.dataset.style;
    });
  });

  // Navigation
  document.getElementById('next1').addEventListener('click',function(){
    var txt=cpEl?cpEl.value.trim():'';
    if(!txt&&!(selectedType&&selectedType!=='__c__')){if(cpEl)cpEl.focus();toast('Describe your website first 🌱');return;}
    if(txt)selectedType='__c__';
    doGenerate();
  });
  document.getElementById('next2').addEventListener('click',function(){buildSummary();showPanel(3);});
  document.getElementById('back2').addEventListener('click',function(){showPanel(1);});
  document.getElementById('back3').addEventListener('click',function(){showPanel(2);});

  // Scroll to builder
  ['navCta','heroCta','ctaBtn'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(){document.getElementById('builder').scrollIntoView({behavior:'smooth'});});
  });

  // Generate
  document.getElementById('gbtn').addEventListener('click',doGenerate);

  // One-click example starter prompts (zero-typing path for first-timers)
  // Chat input
  var ci=document.getElementById('ci');
  ci.addEventListener('input',function(){ci.style.height='auto';ci.style.height=Math.min(ci.scrollHeight,100)+'px';});
  ci.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doChat();}});
  document.getElementById('csb').addEventListener('click',doChat);
  var _edx=document.getElementById('edHintX');if(_edx)_edx.addEventListener('click',dismissEdHint);
  document.querySelectorAll('.qe').forEach(function(btn){
    btn.addEventListener('click',function(){document.getElementById('ci').value=btn.dataset.msg;doChat();});
  });

  // Studio controls
  document.getElementById('backBtn').addEventListener('click',function(){
    document.getElementById('studio').classList.remove('on');
    document.body.style.overflow='';
    sessionStorage.removeItem('ws_studio');
  });
  document.getElementById('regenBtn').addEventListener('click',function(){
    document.getElementById('studio').classList.remove('on');
    document.body.style.overflow='';
    document.getElementById('builder').scrollIntoView({behavior:'smooth'});
    setTimeout(doGenerate,300);
  });
  // -- Undo ------------------------------------------------------
  // ---- Guard not-ready buttons (fires in capture phase) ----
  document.getElementById('studio').addEventListener('click',function(e){
    var studio=document.getElementById('studio');
    if(!studio.classList.contains('studio-loading'))return;
    // Block clicks on anything that needs a site
    var needsSite=e.target.closest('[data-needs-site]');
    var inChat=e.target.closest('.chat');
    if(needsSite||inChat){
      e.stopImmediatePropagation();
      e.preventDefault();
      toast('Generate a site first!',2500);
    }
  },true);

  // ---- Deploy CTA banner ----
  var dcb=document.getElementById('deployCtaBtn');
  if(dcb)dcb.addEventListener('click',function(){
    var banner=document.getElementById('deployCtaBanner');
    if(banner)banner.classList.remove('on');
    var pb=document.getElementById('publishBtn');
    if(pb)pb.click();
  });
  var dcd=document.getElementById('deployCtaDismiss');
  if(dcd)dcd.addEventListener('click',function(){
    var banner=document.getElementById('deployCtaBanner');
    if(banner)banner.classList.remove('on');
  });

  // ---- Edit mode, Section manager ----
  var emBtn=document.getElementById('editModeBtn');
  if(emBtn)emBtn.addEventListener('click',toggleEditMode);
  var secBtn=document.getElementById('sectionsBtn');
  if(secBtn)secBtn.addEventListener('click',showSectionManager);
  var secCl=document.getElementById('secClose');
  if(secCl)secCl.addEventListener('click',function(){document.getElementById('secModal').classList.remove('on');});
  var secRef=document.getElementById('secRefresh');
  if(secRef)secRef.addEventListener('click',function(){parsedSections=parseSections();renderSectionList();});

  document.getElementById('undoBtn').addEventListener('click',doUndo);
  var redoBtnEl=document.getElementById('redoBtn');
  if(redoBtnEl)redoBtnEl.addEventListener('click',doRedo);

  // Keyboard shortcuts (ignored while typing in a field). Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Cmd/Ctrl+S download.
  document.addEventListener('keydown',function(e){
    if(!document.getElementById('studio').classList.contains('on'))return;
    var t=e.target,tag=t&&t.tagName?t.tagName.toLowerCase():'';
    if(tag==='input'||tag==='textarea'||(t&&t.isContentEditable))return;
    var mod=e.metaKey||e.ctrlKey;
    if(!mod)return;
    var k=e.key.toLowerCase();
    if(k==='z'&&!e.shiftKey){e.preventDefault();doUndo();}
    else if((k==='z'&&e.shiftKey)||k==='y'){e.preventDefault();doRedo();}
    else if(k==='s'){e.preventDefault();var db=document.getElementById('dlBtn');if(db)db.click();}
  });

  // -- Device toggle ---------------------------------------------
  ['Desktop','Tablet','Mobile'].forEach(function(d){
    var btn=document.getElementById('dev'+d);
    if(!btn)return;
    btn.addEventListener('click',function(){
      document.querySelectorAll('.dev-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var wrap=document.getElementById('previewWrap');
      wrap.classList.remove('tablet','mobile');
      if(d==='Tablet')wrap.classList.add('tablet');
      if(d==='Mobile')wrap.classList.add('mobile');
    });
  });

  // -- Fullscreen preview ----------------------------------------
  document.getElementById('fullscreenBtn').addEventListener('click',function(){
    if(!gHTML)return;
    var overlay=document.getElementById('fsOverlay');
    var pfFull=document.getElementById('pfFull');
    var title=document.getElementById('stitle').textContent;
    document.getElementById('fsTitle').textContent=title;
    pfFull.srcdoc=gHTML;
    overlay.classList.add('on');
  });
  document.getElementById('fsClose').addEventListener('click',function(){
    document.getElementById('fsOverlay').classList.remove('on');
    document.getElementById('pfFull').srcdoc='';
  });
  var fsNewTabEl=document.getElementById('fsNewTab');
  if(fsNewTabEl)fsNewTabEl.addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var w=window.open('','_blank');
    if(!w){toast('Allow pop-ups to open the preview in a new tab',5000);return;}
    w.document.open();w.document.write(gHTML);w.document.close();
  });

  // -- Color palette swatches ------------------------------------
  document.querySelectorAll('.pal').forEach(function(swatch){
    swatch.addEventListener('click',function(){
      var palette=swatch.dataset.palette;
      var msg='Change the entire color scheme to '+palette+'. Update all buttons, accents, gradients, and highlights to use this color consistently throughout the site.';
      document.getElementById('ci').value=msg;
      doChat();
    });
  });

  // -- Share preview link ----------------------------------------
  document.getElementById('shareBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var modal=document.getElementById('shareModal');
    var urlInput=document.getElementById('shareUrlInput');
    urlInput.value='Generating link...';
    modal.classList.add('on');
    fetch('/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.url){urlInput.value=d.url;}
      else{urlInput.value='Error - try again';}
    })
    .catch(function(){urlInput.value='Error - try again';});
    // Track share event
    fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'share'})});
  });
  document.getElementById('shareCopyBtn').addEventListener('click',function(){
    var url=document.getElementById('shareUrlInput').value;
    if(url&&url!=='Generating link...'&&url!=='Error - try again'){
      navigator.clipboard.writeText(url).then(function(){toast('🔗 Preview link copied!',3000);});
    }
  });
  document.getElementById('shareCloseBtn').addEventListener('click',function(){
    document.getElementById('shareModal').classList.remove('on');
  });

  // -- SEO Editor ------------------------------------------------
  document.getElementById('seoBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    // Extract title using string search
    var tStart=gHTML.indexOf('<title>'),tEnd=gHTML.indexOf('</title>');
    var currentTitle=tStart>-1&&tEnd>-1?gHTML.slice(tStart+7,tEnd).trim():'';
    // Extract description using string search
    var dStart=gHTML.indexOf('name="description"');
    var currentDesc='';
    if(dStart>-1){
      var cIdx=gHTML.indexOf('content="',dStart);
      if(cIdx>-1){var cEnd=gHTML.indexOf('"',cIdx+9);currentDesc=gHTML.slice(cIdx+9,cEnd);}
    }
    document.getElementById('seoTitle').value=currentTitle;
    document.getElementById('seoDesc').value=currentDesc;
    updateSeoPreview();
    document.getElementById('seoModal').classList.add('on');
  });
  function updateSeoPreview(){
    var t=document.getElementById('seoTitle').value||'Your Page Title';
    var d=document.getElementById('seoDesc').value||'Your meta description will appear here.';
    document.getElementById('seoPrevTitle').textContent=t.slice(0,60);
    document.getElementById('seoPrevDesc').textContent=d.slice(0,160);
  }
  document.getElementById('seoTitle').addEventListener('input',updateSeoPreview);
  document.getElementById('seoDesc').addEventListener('input',updateSeoPreview);
  ['seoClose','seoCancelBtn'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(){document.getElementById('seoModal').classList.remove('on');});
  });
  document.getElementById('seoSaveBtn').addEventListener('click',function(){
    if(!gHTML)return;
    var title=document.getElementById('seoTitle').value.trim();
    var desc=document.getElementById('seoDesc').value.trim();
    if(!title&&!desc){toast('Enter a title or description first');return;}
    var updated=gHTML;
    if(title){
      var tStart=updated.indexOf('<title>');
      var tEnd=updated.indexOf('</title>');
      if(tStart>-1&&tEnd>-1){updated=updated.slice(0,tStart)+'<title>'+title+'</title>'+updated.slice(tEnd+8);}
      else{updated=updated.replace('<head>','<head><title>'+title+'</title>');}
    }
    if(desc){
      var metaTag='<meta name="description" content="'+desc+'">';
      var mStart=updated.indexOf('<meta name="description"');
      if(mStart===-1)mStart=updated.indexOf("<meta name='description'");
      if(mStart>-1){var mEnd=updated.indexOf('>',mStart)+1;updated=updated.slice(0,mStart)+metaTag+updated.slice(mEnd);}
      else{updated=updated.replace('<head>','<head>'+metaTag);}
    }
    gHTML=updated;localStorage.setItem('wsh',gHTML);
    pushUndo(gHTML);bumpEditCount();
    setTimeout(function(){setPreview(gHTML);},50);
    document.getElementById('seoModal').classList.remove('on');
    toast('SEO settings applied!',3000);
  });

  // -- Font picker -----------------------------------------------
  document.querySelectorAll('.font-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}
      applyFontStack(btn.dataset.stack);
      document.querySelectorAll('.font-btn').forEach(function(b){b.classList.remove('sel');});
      btn.classList.add('sel');
      toast('Font changed to '+btn.querySelector('.font-btn-name').textContent+' — instant, no AI wait');
    });
  });

  // -- Regenerate section ----------------------------------------
  document.getElementById('regenSectionBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var pick=document.getElementById('secPick');
    var open=pick.classList.toggle('on');
    this.classList.toggle('on',open);
  });
  document.querySelectorAll('#secPick .qe').forEach(function(chip){
    chip.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}
      var sec=chip.dataset.sec;
      document.getElementById('secPick').classList.remove('on');
      var rb=document.getElementById('regenSectionBtn');if(rb)rb.classList.remove('on');
      document.getElementById('ci').value='Completely redesign and rewrite the '+sec+' section with a fresh creative approach. Keep every other section exactly the same.';
      doChat();
    });
  });

  // -- Track page load analytics ---------------------------------

  // Inline onclick replacements
  var howBtn=document.getElementById('howBtn');
  if(howBtn)howBtn.addEventListener('click',function(){document.getElementById('how').scrollIntoView({behavior:'smooth'});});
  
  var n1=document.getElementById('nstep1nextBtn');
  if(n1)n1.addEventListener('click',function(){showNStep(2);});
  var n2b=document.getElementById('nstep2backBtn');
  if(n2b)n2b.addEventListener('click',function(){showNStep(1);});
  var n2n=document.getElementById('step2nextBtn');
  if(n2n)n2n.addEventListener('click',function(){validateToken();});
  var n3b=document.getElementById('nstep3backBtn');
  if(n3b)n3b.addEventListener('click',function(){showNStep(2);});
  var dmc=document.getElementById('deployModalClose');
  if(dmc)dmc.addEventListener('click',function(){document.getElementById('deployModal').classList.remove('on');});

    try{var _qi=new URLSearchParams(location.search).get('idea');if(_qi){var _cp=document.getElementById('customPrompt');if(_cp)_cp.value=String(_qi).slice(0,500);}}catch(e){}
    fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'visit',url:location.href,ref:document.referrer})}).catch(function(){});

  // -- Deploy modal -----------------------------------------------
  window.showNStep=function(n){
    [1,2,3].forEach(function(i){
      var el=document.getElementById('nstep'+i);
      if(el)el.style.display=i===n?'block':'none';
    });
  };

  window.validateToken=function(){
    var token=document.getElementById('netlifyToken').value.trim();
    var err=document.getElementById('tokenError');
    var btn=document.getElementById('step2nextBtn');
    if(!token){err.textContent='Please paste your token first.';err.classList.add('on');return;}
    btn.disabled=true;btn.textContent='Checking...';
    err.classList.remove('on');
    fetch('https://api.netlify.com/api/v1/user',{headers:{'Authorization':'Bearer '+token}})
    .then(function(r){return r.json();})
    .then(function(d){
      btn.disabled=false;btn.textContent='Verify token →';
      if(d.email||d.full_name){
        localStorage.setItem('ws_netlify_token',token);
        var saved=localStorage.getItem('ws_netlify_name');
        if(saved)document.getElementById('netlifySiteName').value=saved;
        showNStep(3);
        toast('✅ Token verified! Welcome, '+(d.full_name||d.email)+'',3000);
      } else {
        err.textContent='Invalid token. Make sure you copied the full token from Netlify.';
        err.classList.add('on');
      }
    })
    .catch(function(){
      btn.disabled=false;btn.textContent='Verify token →';
      err.textContent='Could not verify - check your internet connection and try again.';
      err.classList.add('on');
    });
  };

  // Live preview of site URL
  var siteNameInput=document.getElementById('netlifySiteName');
  if(siteNameInput){
    siteNameInput.addEventListener('input',function(){
      var val=siteNameInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
      var preview=document.getElementById('sitePreviewUrl');
      if(preview)preview.textContent=(val||'yoursite')+'.netlify.app';
    });
  }

  document.getElementById('deployBtn').addEventListener('click',function(){
    if(!unlocked){reverifyPro('deployBtn','🔒 Go Pro ($10/mo) to deploy your site!');return;}
    if(!gHTML){toast('Generate a site first!');return;}
    var savedToken=localStorage.getItem('ws_netlify_token');
    // If token already saved, skip to step 3
    if(savedToken){
      document.getElementById('netlifyToken').value=savedToken;
      var savedName=localStorage.getItem('ws_netlify_name');
      if(savedName)document.getElementById('netlifySiteName').value=savedName;
      showNStep(3);
    } else {
      showNStep(1);
    }
    document.getElementById('netlifyResult').classList.remove('on');
    document.getElementById('netlifyError').classList.remove('on');
    document.getElementById('deployModal').classList.add('on');
  });

  // Deploy tabs
  ['netlify','cf'].forEach(function(id){
    var tab=document.getElementById('dtab-'+id);
    var pane=document.getElementById('dpane-'+id);
    if(tab)tab.addEventListener('click',function(){
      document.querySelectorAll('.d-tab').forEach(function(t){t.classList.remove('active');});
      document.querySelectorAll('.deploy-pane').forEach(function(p){p.classList.remove('active');});
      tab.classList.add('active');
      pane.classList.add('active');
    });
  });

  // Netlify deploy
  document.getElementById('netlifyDeployBtn').addEventListener('click',function(){
    var token=document.getElementById('netlifyToken').value.trim();
    var siteName=document.getElementById('netlifySiteName').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/^-+|-+$/g,'');
    var btn=document.getElementById('netlifyDeployBtn');
    var result=document.getElementById('netlifyResult');
    var error=document.getElementById('netlifyError');
    if(!token){error.textContent='Please enter your Netlify Personal Access Token.';error.classList.add('on');return;}
    if(!gHTML){error.textContent='No site to deploy.';error.classList.add('on');return;}
    result.classList.remove('on');
    error.classList.remove('on');
    btn.disabled=true;btn.textContent='Deploying...';
    // Save token locally
    localStorage.setItem('ws_netlify_token',token);
    if(siteName)localStorage.setItem('ws_netlify_name',siteName);
    // Step 1: Create site on Netlify (if name given) or use default
    var headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'};
    var createBody=siteName?JSON.stringify({name:siteName}):'{}';
    fetch('https://api.netlify.com/api/v1/sites',{method:'POST',headers:headers,body:createBody})
    .then(function(r){
      if(r.status===422){
        // Site name taken, try without name
        return fetch('https://api.netlify.com/api/v1/sites',{method:'POST',headers:headers,body:'{}'});
      }
      return r;
    })
    .then(function(r){return r.json();})
    .then(function(site){
      if(!site.id){throw new Error(site.message||'Failed to create site');}
      var siteId=site.id;
      // Step 2: Deploy files using zip
      return createZipAndDeploy(token,siteId,gHTML);
    })
    .then(function(deployUrl){
      btn.disabled=false;btn.textContent='🚀 Deploy to Netlify';
      var link=document.getElementById('netlifyLiveUrl');
      link.href='https://'+deployUrl;
      link.textContent='https://'+deployUrl;
      result.classList.add('on');
      toast('🚀 Live at: https://'+deployUrl,8000);
      // Track deploy
      fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'deploy_netlify'})}).catch(function(){});
    })
    .catch(function(e){
      btn.disabled=false;btn.textContent='🚀 Deploy to Netlify';
      error.textContent='Deploy failed: '+(e.message||'Unknown error. Check your token and try again.');
      error.classList.add('on');
    });
  });

  // -- Email delivery on payment return -------------------------
  // (Email is stored in localStorage - remind user to download)
  document.getElementById('dlBtn').addEventListener('click',function(){
    if(!unlocked){reverifyPro('dlBtn','🔒 Go Pro ($10/mo) to download');return;}
    if(!gHTML)return;
    if(!window._wsDlOk){ if(window.wsDownloadGate){ window.wsDownloadGate(); return; } }
    window._wsDlOk=false;
    if(window._wsPages&&window._wsPages.length>1&&window.wsDownloadSite){ if(window.wsDownloadSite()){ return; } }
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([gHTML],{type:'text/html'}));
    a.download=siteFilename()+'.html';a.click();
    toast('⬇️ Downloading your site!');
  });
  var copyBtnEl=document.getElementById('copyBtn');
  if(copyBtnEl)copyBtnEl.addEventListener('click',function(){
    if(!unlocked){reverifyPro('copyBtn','🔒 Go Pro ($10/mo) to copy your code');return;}
    if(!gHTML)return;
    function done(){toast('📋 Full HTML copied to clipboard!');}
    function fallback(){
      var ta=document.createElement('textarea');ta.value=gHTML;ta.style.position='fixed';ta.style.left='-9999px';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');done();}catch(err){toast('Could not copy - use Download instead',4000);}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(gHTML).then(done).catch(fallback);
    } else { fallback(); }
  });
  ['unlockBtn','lockPayBtn'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.addEventListener('click',doPayment);
  });

  // Restore on return
  var saved=localStorage.getItem('wsh');
  if(saved&&saved.length>100){
    gHTML=saved;
    if(unlocked){setTimeout(function(){
      openStudio(gHTML);applyUnlock();setTimeout(populateLiveColors,1200);
      var savedEmail=localStorage.getItem('ws_email');
      var msg=savedEmail?'🎉 Site unlocked! Sending to '+savedEmail+'...':'🎉 Site unlocked! Download or Deploy to go live.';
      toast(msg,6000);
      // Send email with site attached
      if(savedEmail&&gHTML){
        var tStart=gHTML.indexOf('<title>'),tEnd=gHTML.indexOf('</title>');
        var siteTitle=tStart>-1&&tEnd>-1?gHTML.slice(tStart+7,tEnd):'My Website';
        fetch('/send-email',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:savedEmail,html:gHTML,title:siteTitle})})
        .then(function(r){return r.json();})
        .then(function(d){if(d.ok)setTimeout(function(){toast('Email sent to '+savedEmail+'! Check your inbox.',6000);},3000);})
        .catch(function(){});
      }
      // If Netlify token saved, offer to deploy
      if(localStorage.getItem('ws_netlify_token')){
        setTimeout(async function(){
          var __ok=await wsConfirm({title:'Deploy to Netlify now?',message:'Your token is already saved and this takes about 10 seconds.',okLabel:'Deploy',cancelLabel:'Not yet'});if(__ok){
            document.getElementById('deployBtn').click();
          }
        },4000);
      }
      // Track payment
      fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'payment'})}).catch(function(){});
    },100);}
    else if(sessionStorage.getItem('ws_studio')==='1'){window._wsSaveReady=false;setTimeout(function(){openStudio(gHTML);_wsRecoverDraft();},100);}
  }


  // Upload button
  var uploadBtn=document.getElementById('imgUploadBtn');
  var mobileUploadBtn=document.getElementById('imgMobileUpload');
  var fileInput=document.getElementById('imgFileInput');
  if(uploadBtn&&fileInput){
    uploadBtn.addEventListener('click',function(){fileInput.click();});
    fileInput.addEventListener('change',function(){addImagesToLibrary(fileInput.files);fileInput.value='';});
  }
  // Show mobile button on touch devices, hide on desktop
  if(mobileUploadBtn){
    var isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
    if(isTouch){
      mobileUploadBtn.style.display='flex';
      mobileUploadBtn.addEventListener('click',function(){if(fileInput)fileInput.click();});
    }
  }

  // Photo library collapse toggle
  var imgLibToggle=document.getElementById('imgLibToggle');
  var imgLibEl=document.getElementById('imgLibrary');
  if(imgLibToggle&&imgLibEl){
    imgLibToggle.addEventListener('click',function(){imgLibEl.classList.toggle('collapsed');});
  }
  // Design tools drawer toggle
  var ddToggle=document.getElementById('ddToggle');
  var ddEl=document.getElementById('designDrawer');
  if(ddToggle&&ddEl){
    ddToggle.addEventListener('click',function(){ddEl.classList.toggle('collapsed');if(!ddEl.classList.contains('collapsed')){try{loadStyleOpts();}catch(e){}try{reflectCallBar();}catch(e){}}});
  }
  var styleSec=document.getElementById('styleSection');
  if(styleSec){
    styleSec.addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('.ds-seg button[data-v]');if(!b)return;
      var seg=b.closest('.ds-seg');if(!seg)return;
      var key=seg.getAttribute('data-style');
      wsStyleOpts[key]=b.getAttribute('data-v');
      reflectStyleUI();applyGlobalStyle();
    });
  }
  var callBarSeg=document.getElementById('callBarSeg');
  if(callBarSeg){
    callBarSeg.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-cb]');if(!b)return;setCallBar(b.getAttribute('data-cb')==='on');reflectCallBar();});
  }

  // -- Slot modal wiring -----------------------------------------
  var slotModal=document.getElementById('slotModal');
  var slotCloseX=document.getElementById('slotModalClose');
  var slotUploadBtnEl=document.getElementById('slotUploadBtn');
  var slotFileInputEl=document.getElementById('slotFileInput');
  var slotDropEl=document.getElementById('slotDrop');
  if(slotCloseX)slotCloseX.addEventListener('click',function(){if(slotModal)slotModal.classList.remove('on');});
  if(slotModal)slotModal.addEventListener('click',function(e){if(e.target===slotModal)slotModal.classList.remove('on');});
  if(slotUploadBtnEl)slotUploadBtnEl.addEventListener('click',function(){if(slotFileInputEl)slotFileInputEl.click();});
  var slotAiBtnEl=document.getElementById('slotAiBtn');
  if(slotAiBtnEl)slotAiBtnEl.addEventListener('click',function(){
    var inp=document.getElementById('slotAiPrompt'),msg=document.getElementById('slotAiMsg');
    var p=((inp&&inp.value)||'').trim();
    if(!p){if(msg){msg.style.color='#fca5a5';msg.textContent='Type what you want to see first.';}return;}
    var old=slotAiBtnEl.innerHTML;slotAiBtnEl.disabled=true;slotAiBtnEl.innerHTML='Generating\\u2026';
    if(msg){msg.style.color='rgba(234,242,232,.55)';msg.textContent='Creating your image \\u2014 this can take ~10s\\u2026';}
    fetch('/genimage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}).then(function(r){return r.json();}).then(function(j){
      slotAiBtnEl.disabled=false;slotAiBtnEl.innerHTML=old;
      if(j&&j.image){if(msg)msg.textContent='';if(inp)inp.value='';fillSlot(j.image);}
      else{if(msg){msg.style.color='#fca5a5';msg.textContent=(j&&j.error)||'Could not generate. Try a simpler description.';}}
    }).catch(function(){slotAiBtnEl.disabled=false;slotAiBtnEl.innerHTML=old;if(msg){msg.style.color='#fca5a5';msg.textContent='Something went wrong. Try again.';}});
  });
  // ── Leads dashboard (in-app) ──
  function _leadEsc(s){var d=document.createElement('div');d.textContent=String(s==null?'':s);return d.innerHTML;}
  function _leadStats(j){
    var stWrap=document.getElementById('leadsStats');if(!stWrap)return;
    stWrap.style.display='block';
    var sv=document.getElementById('stViews');if(sv)sv.textContent=(j.total||0);
    var sw=document.getElementById('stWeek');if(sw)sw.textContent=(j.week||0);
    var sl=document.getElementById('stLeads');if(sl)sl.textContent=(j.count||0);
    var stt=document.getElementById('stToday');if(stt)stt.textContent=(j.today||0)+' today';
    var sp=document.getElementById('stSpark');if(!sp)return;
    var ds=j.days||[],mx=1,di;
    for(di=0;di<ds.length;di++){if((ds[di].c||0)>mx)mx=ds[di].c;}
    var lbl=['S','M','T','W','T','F','S'],sh='';
    for(di=0;di<ds.length;di++){
      var c=ds[di].c||0,pct=Math.round((c/mx)*100);if(c>0&&pct<8)pct=8;
      var dd=ds[di].d||'',dn='';
      try{dn=lbl[new Date(dd.slice(0,4)+'-'+dd.slice(4,6)+'-'+dd.slice(6,8)+'T00:00').getDay()];}catch(e){}
      sh+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px"><div style="width:100%;display:flex;align-items:flex-end;justify-content:center;height:36px"><div title="'+c+' views" style="width:70%;height:'+pct+'%;min-height:2px;background:linear-gradient(180deg,#3dba52,#2d7a3a);border-radius:3px 3px 0 0"></div></div><div style="font-size:9px;color:rgba(255,255,255,.72)">'+(dn||'')+'</div></div>';
    }
    sp.innerHTML=sh;
  }
  window.openLeads=function(){
    var sid=window._wsSite||localStorage.getItem('ws_site')||'';
    var k=window._wsKey||localStorage.getItem('ws_key')||'';
    var modal=document.getElementById('leadsModal'),list=document.getElementById('leadsList');
    if(!modal)return;
    modal.style.display='flex';
    var _sw0=document.getElementById('leadsStats');if(_sw0)_sw0.style.display='none';
    if(!sid||!k){if(list)list.innerHTML='<div style="color:rgba(255,255,255,.72);text-align:center;padding:32px 14px;line-height:1.6">Generate or open a site first \\u2014 your leads will appear here.</div>';return;}
    if(list)list.innerHTML='<div style="color:rgba(255,255,255,.72);text-align:center;padding:30px 0">Loading\\u2026</div>';
    fetch('/api/inbox?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(k)).then(function(r){return r.json();}).then(function(j){
      if(j.error){if(list)list.innerHTML='<div style="color:#fca5a5;text-align:center;padding:30px 0">'+_leadEsc(j.error)+'</div>';return;}
      var ni=document.getElementById('leadsNotify');if(ni&&j.notify)ni.value=j.notify;
      var sub=document.getElementById('leadsSub');if(sub)sub.textContent=(j.count||0)+' lead'+(j.count===1?'':'s')+' \\u00b7 '+(j.total||0)+' page views';
      _leadStats(j);
      var subs=j.submissions||[];
      if(!subs.length){if(list)list.innerHTML='<div style="color:rgba(255,255,255,.72);text-align:center;padding:34px 14px;line-height:1.6">No leads yet.<br><span style="font-size:13px">Publish your site and share the link \\u2014 every contact-form submission shows up here.</span></div>';return;}
      var html='';
      for(var i=0;i<subs.length;i++){var s=subs[i],f=s.fields||{};var when=new Date(s.ts||0).toLocaleString();var rows='';for(var key in f){rows+='<div style="display:flex;gap:10px;margin-top:4px"><span style="color:rgba(255,255,255,.72);min-width:88px;font-size:12px;flex-shrink:0">'+_leadEsc(key)+'</span><span style="color:#eaf2e8;font-size:13px;word-break:break-word">'+_leadEsc(f[key])+'</span></div>';}
        html+='<div style="background:#0f1a0d;border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:12px 14px;margin-bottom:10px"><div style="font-size:11px;color:rgba(255,255,255,.72);margin-bottom:5px">'+_leadEsc(when)+'</div>'+rows+'</div>';}
      if(list)list.innerHTML=html;
    }).catch(function(){if(list)list.innerHTML='<div style="color:#fca5a5;text-align:center;padding:30px 0">Could not load leads. Try again.</div>';});
  };
  var _lb=document.getElementById('leadsBtn');if(_lb)_lb.addEventListener('click',window.openLeads);
  var _lc=document.getElementById('leadsClose');if(_lc)_lc.addEventListener('click',function(){var m=document.getElementById('leadsModal');if(m)m.style.display='none';});
  var _lmod=document.getElementById('leadsModal');if(_lmod)_lmod.addEventListener('click',function(e){if(e.target===_lmod)_lmod.style.display='none';});
  var _lns=document.getElementById('leadsNotifySave');if(_lns)_lns.addEventListener('click',function(){
    var sid=window._wsSite||localStorage.getItem('ws_site')||'';var k=window._wsKey||localStorage.getItem('ws_key')||'';
    var em=((document.getElementById('leadsNotify')||{}).value||'').trim();
    if(!sid||!k){if(window.toast)toast('Publish or generate a site first.');return;}
    fetch('/api/inbox/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:sid,key:k,email:em})}).then(function(){if(window.toast)toast('Saved \\u2014 leads will be emailed to '+(em||'your account email'));}).catch(function(){if(window.toast)toast('Could not save. Try again.');});
  });
  // ── Marketing copy (AI post writer) ──
  var _postKind='social';
  function postContext(){
    try{
      var doc=new DOMParser().parseFromString(gHTML||'','text/html');
      var title=((doc.querySelector('title')||{}).textContent||'').trim();
      var sc=doc.querySelectorAll('script,style');for(var i=0;i<sc.length;i++)sc[i].remove();
      var txt=((doc.body?doc.body.textContent:'')||'').replace(/\\s+/g,' ').trim().slice(0,1500);
      return (title?('Business / site title: '+title+'\\n'):'')+txt;
    }catch(e){return '';}
  }
  window.openPost=function(){
    var m=document.getElementById('postModal');if(!m)return;
    if(!gHTML){if(window.toast)toast('Generate a site first.');return;}
    m.style.display='flex';
    var rw=document.getElementById('postResultWrap');if(rw)rw.style.display='none';
    var msg=document.getElementById('postMsg');if(msg)msg.textContent='';
  };
  var _pk=document.getElementById('postKinds');
  if(_pk)_pk.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.post-kind');if(!b)return;_postKind=b.getAttribute('data-kind');var all=_pk.querySelectorAll('.post-kind');for(var i=0;i<all.length;i++)all[i].classList.remove('active');b.classList.add('active');});
  var _pg=document.getElementById('postGen');
  if(_pg)_pg.addEventListener('click',function(){
    var msg=document.getElementById('postMsg'),rw=document.getElementById('postResultWrap'),res=document.getElementById('postResult');
    var topic=((document.getElementById('postTopic')||{}).value||'').trim();
    var old=_pg.innerHTML;_pg.disabled=true;_pg.innerHTML='Writing\\u2026';if(msg){msg.style.color='rgba(234,242,232,.55)';msg.textContent='Drafting your copy\\u2026';}
    fetch('/api/post',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:_postKind,topic:topic,context:postContext()})}).then(function(r){return r.json();}).then(function(j){
      _pg.disabled=false;_pg.innerHTML=old;
      if(j&&j.text){if(res)res.value=j.text;if(rw)rw.style.display='block';if(msg)msg.textContent='';}
      else{if(msg){msg.style.color='#fca5a5';msg.textContent=(j&&j.error)||'Could not generate. Try again.';}}
    }).catch(function(){_pg.disabled=false;_pg.innerHTML=old;if(msg){msg.style.color='#fca5a5';msg.textContent='Something went wrong. Try again.';}});
  });
  var _pc2=document.getElementById('postClose');if(_pc2)_pc2.addEventListener('click',function(){var m=document.getElementById('postModal');if(m)m.style.display='none';});
  var _pm=document.getElementById('postModal');if(_pm)_pm.addEventListener('click',function(e){if(e.target===_pm)_pm.style.display='none';});
  var _pcopy=document.getElementById('postCopy');if(_pcopy)_pcopy.addEventListener('click',function(){var res=document.getElementById('postResult');if(!res)return;res.select();try{navigator.clipboard.writeText(res.value);if(window.toast)toast('Copied!');}catch(e){try{document.execCommand('copy');if(window.toast)toast('Copied!');}catch(e2){}}});
  var _pbtn=document.getElementById('postBtn');if(_pbtn)_pbtn.addEventListener('click',window.openPost);
  // ── Invoicing ──
  window.openInvoice=function(){
    var m=document.getElementById('invoiceModal');if(!m)return;
    m.style.display='flex';
    var rw=document.getElementById('invResultWrap');if(rw)rw.style.display='none';
    var msg=document.getElementById('invMsg');if(msg)msg.textContent='';
    // Owner bills on the platform account; everyone else must connect their own Stripe first.
    var u=window._wsUser||{};
    var canBill=u.owner||u.connectReady;
    var fEl=document.getElementById('invForm'),cEl=document.getElementById('invConnect');
    if(fEl)fEl.style.display=canBill?'':'none';
    if(cEl)cEl.style.display=canBill?'none':'block';
    var fn=document.getElementById('invFeeNote');
    if(fn){ if(canBill && !u.owner){ fn.style.display='block'; fn.innerHTML='Websprout keeps a 1% platform fee (minimum $0.50, maximum $5.00) on each paid invoice. Your client pays the full amount; the fee comes out of your payout.'; } else { fn.style.display='none'; } }
  };
  var _ig=document.getElementById('invGen');
  if(_ig)_ig.addEventListener('click',function(){
    var msg=document.getElementById('invMsg'),rw=document.getElementById('invResultWrap'),res=document.getElementById('invResult');
    var amount=((document.getElementById('invAmount')||{}).value||'').trim();
    var desc=((document.getElementById('invDesc')||{}).value||'').trim();
    var email=((document.getElementById('invEmail')||{}).value||'').trim();
    if(!amount||parseFloat(amount)<0.5){if(msg){msg.style.color='#fca5a5';msg.textContent='Enter an amount of at least $0.50.';}return;}
    var old=_ig.innerHTML;_ig.disabled=true;_ig.innerHTML='Creating\\u2026';if(msg){msg.style.color='rgba(234,242,232,.55)';msg.textContent='Talking to Stripe\\u2026';}
    fetch('/api/invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amount,desc:desc,email:email})}).then(function(r){return r.json();}).then(function(j){
      _ig.disabled=false;_ig.innerHTML=old;
      if(j&&j.url){if(res)res.value=j.url;if(rw)rw.style.display='block';if(msg){msg.style.color='#7dd88f';var _b=j.emailed?('Sent to '+email+' \\u2014 link is below to copy too.'):'Link ready \\u2014 copy it and send it to your client.';var _f=(j.fee&&j.fee>0)?(' Websprout fee: $'+(j.fee/100).toFixed(2)+'.'):'';msg.textContent=_b+_f;}}
      else{if(msg){msg.style.color='#fca5a5';msg.textContent=(j&&j.error)||'Could not create the invoice.';}}
    }).catch(function(){_ig.disabled=false;_ig.innerHTML=old;if(msg){msg.style.color='#fca5a5';msg.textContent='Something went wrong. Try again.';}});
  });
  var _ic=document.getElementById('invClose');if(_ic)_ic.addEventListener('click',function(){var m=document.getElementById('invoiceModal');if(m)m.style.display='none';});
  var _im=document.getElementById('invoiceModal');if(_im)_im.addEventListener('click',function(e){if(e.target===_im)_im.style.display='none';});
  var _icp=document.getElementById('invCopy');if(_icp)_icp.addEventListener('click',function(){var res=document.getElementById('invResult');if(!res)return;res.select();try{navigator.clipboard.writeText(res.value);if(window.toast)toast('Copied!');}catch(e){try{document.execCommand('copy');if(window.toast)toast('Copied!');}catch(e2){}}});
  var _ibtn=document.getElementById('invoiceBtn');if(_ibtn)_ibtn.addEventListener('click',window.openInvoice);
  // ── Product payments: paste your own checkout link per product ──
  function _paySiteKey(){return 'ws_pay_'+(window._wsSite||localStorage.getItem('ws_site')||'default');}
  function _getPayMap(){try{return JSON.parse(localStorage.getItem(_paySiteKey())||'{}');}catch(e){return {};}}
  function _setPayMap(m){try{localStorage.setItem(_paySiteKey(),JSON.stringify(m));}catch(e){}}
  function _payEsc(s){var d=document.createElement('div');d.textContent=String(s==null?'':s);return d.innerHTML.split('"').join('&quot;');}
  function _scanPayItems(){
    var items=[],seen={},map=_getPayMap(),h=gHTML||'',i=0;
    while(true){var a=h.indexOf('[Pay Link: ',i);if(a<0)break;var b=h.indexOf(']',a);if(b<0)break;var nm=h.slice(a+11,b).trim();if(nm&&!seen[nm]){seen[nm]=1;items.push({name:nm,url:map[nm]||''});}i=b+1;}
    for(var k in map){if(!seen[k]){seen[k]=1;items.push({name:k,url:map[k]||''});}}
    return items;
  }
  function _renderPayList(){
    var list=document.getElementById('payList');if(!list)return;
    var items=_scanPayItems();
    if(!items.length){list.innerHTML='<div style="color:rgba(255,255,255,.72);text-align:center;padding:24px 10px;line-height:1.6;font-size:13px">No product buttons found yet.<br>Ask the editor for a product or pricing section with \\u201cBuy\\u201d buttons, then come back to add your links.</div>';return;}
    var h='';
    for(var i=0;i<items.length;i++){
      h+='<div class="pay-row" data-name="'+_payEsc(items[i].name)+'" style="margin-bottom:11px"><label style="font-size:13px;color:#eaf2e8;font-weight:600;display:block;margin-bottom:5px">'+_payEsc(items[i].name)+'</label><input type="url" value="'+_payEsc(items[i].url)+'" placeholder="https://buy.stripe.com/\\u2026 (Stripe, PayPal, Square\\u2026)" style="width:100%;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#eaf2e8;border-radius:8px;padding:9px 11px;font-size:13px;font-family:inherit;outline:none"></div>';
    }
    list.innerHTML=h;
  }
  window.openPay=function(){var m=document.getElementById('payModal');if(!m)return;if(!gHTML){if(window.toast)toast('Generate a site first.');return;}_renderPayList();var msg=document.getElementById('payMsg');if(msg)msg.textContent='';m.style.display='flex';};
  function _savePayLinks(){
    var rows=document.querySelectorAll('#payList .pay-row'),map=_getPayMap(),updated=gHTML||'',changed=0;
    for(var i=0;i<rows.length;i++){
      var nm=rows[i].getAttribute('data-name'),inp=rows[i].querySelector('input'),url=((inp&&inp.value)||'').trim(),oldUrl=map[nm]||'',ph='[Pay Link: '+nm+']';
      if(updated.indexOf(ph)>-1){updated=updated.split(ph).join(url||'#');if(url)changed++;}
      else if(oldUrl&&url&&url!==oldUrl&&updated.indexOf(oldUrl)>-1){updated=updated.split(oldUrl).join(url);changed++;}
      if(url)map[nm]=url;else delete map[nm];
    }
    var msg=document.getElementById('payMsg');
    if(!changed){if(msg){msg.style.color='rgba(234,242,232,.5)';msg.textContent='Nothing to save yet \\u2014 paste a link first.';}return;}
    _setPayMap(map);gHTML=updated;localStorage.setItem('wsh',gHTML);pushUndo(gHTML);bumpEditCount();
    setTimeout(function(){setPreview(gHTML);},50);
    if(msg){msg.style.color='#7fe39a';msg.textContent='Saved \\u2014 your buy buttons now point to your checkout.';}
  }
  var _payS=document.getElementById('paySave');if(_payS)_payS.addEventListener('click',_savePayLinks);
  var _payC=document.getElementById('payClose');if(_payC)_payC.addEventListener('click',function(){var m=document.getElementById('payModal');if(m)m.style.display='none';});
  var _payM=document.getElementById('payModal');if(_payM)_payM.addEventListener('click',function(e){if(e.target===_payM)_payM.style.display='none';});
  var _payB=document.getElementById('payBtn');if(_payB)_payB.addEventListener('click',window.openPay);
  // Invoicing routes funds to the platform's own Stripe account, so it's owner-only until per-user Connect exists.
  (function(){var _ot=setInterval(function(){var u=window._wsUser;if(u){clearInterval(_ot);if(u.owner||u.pro){var b=document.getElementById('invoiceBtn');if(b)b.style.display='';var mi=document.getElementById('invoiceMenuItem');if(mi)mi.style.display='';}}},400);setTimeout(function(){try{clearInterval(_ot);}catch(e){}},15000);})();
  if(slotFileInputEl)slotFileInputEl.addEventListener('change',function(){
    if(slotFileInputEl.files&&slotFileInputEl.files[0])slotCompressAndFill(slotFileInputEl.files[0]);
    slotFileInputEl.value='';
  });
  if(slotDropEl){
    slotDropEl.addEventListener('click',function(){if(slotFileInputEl)slotFileInputEl.click();});
    slotDropEl.addEventListener('dragover',function(e){e.preventDefault();slotDropEl.classList.add('drag');});
    slotDropEl.addEventListener('dragleave',function(){slotDropEl.classList.remove('drag');});
    slotDropEl.addEventListener('drop',function(e){
      e.preventDefault();slotDropEl.classList.remove('drag');
      var files=e.dataTransfer.files;
      if(files&&files[0]&&files[0].type.startsWith('image/'))slotCompressAndFill(files[0]);
    });
  }

  // Dropzone click
  var dz=document.getElementById('imgDropzone');
  if(dz)dz.addEventListener('click',function(){if(fileInput)fileInput.click();});

  // Drag and drop on dropzone
  if(dz){
    dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('drag');});
    dz.addEventListener('dragleave',function(){dz.classList.remove('drag');});
    dz.addEventListener('drop',function(e){e.preventDefault();dz.classList.remove('drag');addImagesToLibrary(e.dataTransfer.files);});
  }

  // Drag and drop onto preview area
  // The iframe captures pointer events, so we disable it during drag
  var previewWrap=document.getElementById('previewWrap');
  var dropOverlay=document.getElementById('dropOverlay');
  var pfFrame=document.getElementById('pf');

  // When any drag starts on the page, disable iframe pointer events
  document.addEventListener('dragenter',function(e){
    if(e.dataTransfer&&e.dataTransfer.types&&(e.dataTransfer.types.includes('Files')||e.dataTransfer.types.indexOf('Files')>-1)){
      if(pfFrame)pfFrame.style.pointerEvents='none';
    }
  });
  // Re-enable when drag ends or leaves window
  document.addEventListener('dragend',function(){if(pfFrame)pfFrame.style.pointerEvents='';});
  document.addEventListener('dragleave',function(e){
    if(!e.relatedTarget||e.relatedTarget===document.documentElement){
      if(pfFrame)pfFrame.style.pointerEvents='';
      if(dropOverlay)dropOverlay.classList.remove('show');
    }
  });
  document.addEventListener('drop',function(){
    if(pfFrame)pfFrame.style.pointerEvents='';
  });

  if(previewWrap&&dropOverlay){
    previewWrap.addEventListener('dragover',function(e){
      if(e.dataTransfer&&(e.dataTransfer.types.includes('Files')||e.dataTransfer.types.indexOf('Files')>-1)){
        e.preventDefault();
        dropOverlay.classList.add('show');
      }
    });
    previewWrap.addEventListener('dragleave',function(e){
      if(!previewWrap.contains(e.relatedTarget)){
        dropOverlay.classList.remove('show');
      }
    });
    previewWrap.addEventListener('drop',function(e){
      e.preventDefault();
      dropOverlay.classList.remove('show');
      if(pfFrame)pfFrame.style.pointerEvents='';
      var files=e.dataTransfer.files;
      if(files.length>0&&files[0].type.startsWith('image/')){
        compressImage(files[0],function(dataUrl){
          var id='img_'+Date.now();
          imgLib.push({id:id,dataUrl:dataUrl,name:files[0].name});
          renderImgGrid();
          selectedImgId=id;
          renderImgGrid();
          document.getElementById('imgActions').style.display='flex';
          document.getElementById('imgActions').style.flexDirection='column';
          var lib=document.getElementById('imgLibrary');
          if(lib)lib.scrollIntoView({behavior:'smooth',block:'nearest'});
          toast('📷 Photo ready! Choose where to place it in the sidebar.',5000);
        });
      }
    });
  }

  // Image action buttons
  document.querySelectorAll('.img-action-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var action=btn.dataset.action;
      if(action==='cancel'){
        document.getElementById('imgActions').style.display='none';
        selectedImgId=null;
        renderImgGrid();
        return;
      }
      var img=imgLib.find(function(i){return i.id===selectedImgId;});
      if(!img){toast('Select a photo first');return;}
      if(!gHTML){toast('Generate a site first!');return;}
      injectImageIntoSite(img.dataUrl,action);
    });
  });

  }catch(domErr){
    // Show error visually so we can debug
    console.error('DOMContentLoaded error:', domErr);
    document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;bottom:10px;left:10px;background:red;color:white;padding:10px;z-index:999999;font-size:12px;max-width:400px;word-break:break-all">JS Error: '+domErr.message+'</div>');
    // Try to bind essential buttons anyway
    try{document.querySelectorAll('.type-btn').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.type-btn').forEach(function(x){x.classList.remove('sel');});b.classList.add('sel');selectedType=b.dataset.type==='OTHER'?'':b.dataset.type;document.getElementById('next1').classList.add('on');});});}catch(e2){}
    try{document.getElementById('next1').addEventListener('click',function(){if(selectedType||document.getElementById('customPrompt').value.trim())showPanel(2);});}catch(e2){}
    try{document.getElementById('next2').addEventListener('click',function(){buildSummary();showPanel(3);});}catch(e2){}
    try{document.getElementById('back2').addEventListener('click',function(){showPanel(1);});}catch(e2){}
    try{document.getElementById('back3').addEventListener('click',function(){showPanel(2);});}catch(e2){}
    try{document.getElementById('gbtn').addEventListener('click',doGenerate);}catch(e2){}
  }
});

function buildSummary(){
  var name=document.getElementById('bizName').value.trim();
  var extra=document.getElementById('bizExtra').value.trim();
  var cp=document.getElementById('customPrompt').value.trim();
  var rows=[
    {l:'Type',v:cp||selectedType||'Website'},
    {l:'Style',v:selectedStyle||'AI decides'},
    {l:'Name',v:name||'AI will create'},
    {l:'Notes',v:extra||'-'}
  ];
  document.getElementById('summaryGrid').innerHTML=rows.map(function(r){
    return '<div class="s-row"><div class="s-lbl">'+r.l+'</div><div class="s-val">'+r.v+'</div></div>';
  }).join('');
}

function buildPrompt(){
  var name=document.getElementById('bizName').value.trim();
  var extra=document.getElementById('bizExtra').value.trim();
  var cp=document.getElementById('customPrompt').value.trim();
  if(cp&&selectedType==='__c__'){
    var pts=[cp];
    if(name)pts.push('Business name: "'+name+'"');
    if(selectedStyle)pts.push('Style: '+selectedStyle);
    return pts.join('. ');
  }
  var pts=[];
  if(selectedType&&selectedType!=='__c__')pts.push('Build a '+selectedType);
  if(name)pts.push('Business name: "'+name+'"');
  if(selectedStyle)pts.push('Style: '+selectedStyle);
  if(extra)pts.push(extra);
  return pts.join('. ')||'Build a professional business website';
}

function doGenerate(){
  // Anonymous users get 1 free generation to see the wow moment. Signup prompts happen AFTER they see their site,
  // gated on save/publish/edit actions — not before the first generation.
  try{var _cp=document.getElementById('customPrompt');if(_cp&&_cp.value.trim())localStorage.setItem('ws_pending_prompt',_cp.value);}catch(e){}
  var prompt=buildPrompt();
  var btn=document.getElementById('gbtn'),ld=document.getElementById('loading'),
      ga=document.getElementById('gen-area'),lt=document.getElementById('loadTxt'),
      lb=document.getElementById('loadBar'),pf=document.getElementById('p3foot');
  btn.disabled=true;document.getElementById('gbtnTxt').textContent='Growing...';
  ga.style.display='none';ld.classList.add('on');lb.style.display='block';pf.style.display='none';

  // Open studio immediately with skeleton showing
  document.getElementById('studio').classList.add('on');
  document.body.style.overflow='hidden';
  setStudioReady(false);
  var skel=document.getElementById('skelWrap');
  if(skel)skel.classList.add('show');
  // Show loading messages inside skeleton
  var skelMsg=document.getElementById('skelMsg');

  var skelProg=document.getElementById('skelProgress');
  function _loadPhase(el){
    if(el<2)return 'Planting your prompt...';
    if(el<5)return 'Sketching the layout...';
    if(el<9)return 'Designing your hero section...';
    if(el<14)return 'Building your sections and feature cards...';
    if(el<20)return 'Writing your copy...';
    if(el<27)return 'Styling the navigation and colors...';
    if(el<34)return 'Adding finishing touches...';
    if(el<46)return 'Polishing the details...';
    return 'Finalizing your site... ('+el+'s)';
  }
  var _t0=Date.now(),iv=setInterval(function(){
    var _el=Math.round((Date.now()-_t0)/1000);
    var _m=_loadPhase(_el);
    lt.textContent=_m;
    if(skelMsg)skelMsg.textContent=_m;
    var _pct=93*(1-Math.exp(-_el/17));
    if(skelProg)skelProg.style.width=_pct.toFixed(1)+'%';
  },800);
  var _ac=(typeof AbortController!=='undefined')?new AbortController():null;
  var _to=_ac?setTimeout(function(){try{_ac.abort();}catch(e){}},115000):0;
  fetch('/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt}),signal:_ac?_ac.signal:undefined})
  .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error: '+t.slice(0,100)}};}});})
  .then(function(r){
    clearInterval(iv);clearTimeout(_to);var _spf=document.getElementById('skelProgress');if(_spf&&r.ok)_spf.style.width='100%';ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    if(!r.ok){
      if(r.d.error==='RATE_LIMITED_FREE'){
        var _ka=document.getElementById('skelWrap');if(_ka)_ka.classList.remove('show');var _kb=document.getElementById('studio');if(_kb)_kb.classList.remove('on');document.body.style.overflow='';
        toast('🌱 This Gemini key hit a FREE-tier quota. If you enabled billing, the key in your Worker may belong to a different Google project than the billed one.',15000);return;
      }
      if(r.d.error==='RATE_LIMITED'){
        var secs=60,tel=document.getElementById('toast');
        tel.textContent='⏳ High demand - retrying in '+secs+'s...';tel.classList.add('on');
        var cd=setInterval(function(){secs--;tel.textContent='⏳ High demand - retrying in '+secs+'s...';if(secs<=0){clearInterval(cd);tel.classList.remove('on');doGenerate();}},1000);
        return;
      }
      if(r.d.error==='FREE_LIMIT_REACHED'){
        var _kw=document.getElementById('skelWrap');if(_kw)_kw.classList.remove('show');
        var _ld2=document.getElementById('loading');if(_ld2)_ld2.classList.remove('on');
        var _lb2=document.getElementById('loadBar');if(_lb2)_lb2.style.display='none';
        var _flm=document.getElementById('freeLimitModal');
        if(_flm){
          if(!window._flmWired){window._flmWired=true;
            var _gp=document.getElementById('flmGoPro');if(_gp)_gp.addEventListener('click',function(){_flm.style.display='none';var _u=document.getElementById('unlockBtn');if(_u)_u.click();});
            var _kp=document.getElementById('flmKeep');if(_kp)_kp.addEventListener('click',function(){_flm.style.display='none';document.body.style.overflow='';try{var _st2=document.getElementById('studio');if(gHTML&&_st2&&!_st2.classList.contains('on'))openStudio(gHTML);}catch(e){}});
            _flm.addEventListener('click',function(e){if(e.target===_flm){_flm.style.display='none';document.body.style.overflow='';}});
          }
          _flm.style.display='flex';document.body.style.overflow='';
        }
        return;
      }
      var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.remove('show');var _st=document.getElementById('studio');if(_st)_st.classList.remove('on');document.body.style.overflow='';try{console.error('[Websprout] /generate failed:',r.d.error);}catch(e3){}toast('🌱 '+(r.d.error||'Please try again'),12000);return;
    }
    gHTML=r.d.html;window._wsPrompt=(typeof prompt==="string"?prompt:(window._wsPrompt||""));localStorage.setItem('wsh',gHTML);try{if(window._wsUser&&window._wsUser.email)localStorage.setItem('ws_owner',window._wsUser.email);}catch(_o){}undoStack=[gHTML];redoStack=[];editCount=0;try{sessionStorage.setItem('ws_freshgen','1');}catch(_fg){}var ec=document.getElementById('editCounter');if(ec)ec.style.display='none';refreshHistoryBtns();document.querySelectorAll('.font-btn.sel').forEach(function(b){b.classList.remove('sel');});var sp=document.getElementById('secPick');if(sp)sp.classList.remove('on');openStudio(gHTML);setTimeout(populateLiveColors,1200);try{if(r.d.siteId){window._wsSite=r.d.siteId;window._wsKey=r.d.formKey;localStorage.setItem('ws_site',r.d.siteId);localStorage.setItem('ws_key',r.d.formKey||'');}if(r.d.inboxUrl){window._wsInbox=r.d.inboxUrl;localStorage.setItem('ws_inbox',r.d.inboxUrl);console.log('%c[Websprout] Form inbox for this site -> '+r.d.inboxUrl,'color:#2d7a3a;font-weight:700');setTimeout(function(){var tl=document.getElementById('toast');if(tl){tl.innerHTML='📬 Form inbox ready — <u style="cursor:pointer">click to open &amp; save the link</u>';tl.classList.add('on');tl.onclick=function(){window.open(r.d.inboxUrl,'_blank');};setTimeout(function(){tl.classList.remove('on');tl.onclick=null;},10000);}},2600);}}catch(e4){}
  })
  .catch(function(e){
    clearInterval(iv);clearTimeout(_to);ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.remove('show');var _st=document.getElementById('studio');if(_st)_st.classList.remove('on');document.body.style.overflow='';try{console.error('[Websprout] /generate fetch error:',e);}catch(e3){}toast('🌱 '+((e&&e.name==='AbortError')?'Taking longer than expected — please try again':((e&&e.message==='Failed to fetch')?'Could not reach server':((e&&e.message)||'Please try again'))),12000);
  });
}

// -- Business Info Panel --------------------------------------
(function(){
  var header=document.getElementById('bizPanelHeader');
  var fields=document.getElementById('bizFields');
  var toggle=document.getElementById('bizPanelToggle');
  if(header){
    header.addEventListener('click',function(){
      var open=fields.classList.toggle('open');
      toggle.classList.toggle('open',open);
    });
  }

  var applyBtn=document.getElementById('bizApplyBtn');
  if(applyBtn){
    applyBtn.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}

      var name=document.getElementById('bizInfoName').value.trim();
      var email=document.getElementById('bizInfoEmail').value.trim();
      var phone=document.getElementById('bizInfoPhone').value.trim();
      var addr=document.getElementById('bizInfoAddress').value.trim();
      var formEmail=document.getElementById('bizInfoForm').value.trim();
      var booking=document.getElementById('bizInfoBooking').value.trim();
      var ordering=(document.getElementById('bizInfoOrdering')||{}).value;ordering=ordering?ordering.trim():'';
      var hours=(document.getElementById('bizInfoHours')||{}).value;hours=hours?hours.trim():'';

      if(!name&&!email&&!phone&&!addr&&!formEmail&&!booking&&!ordering&&!hours){toast('Fill in at least one field first');return;}

      var _skb=window._wsSite||localStorage.getItem('ws_site')||'';
      var prev={};try{prev=JSON.parse(localStorage.getItem('ws_info_'+_skb)||'{}');}catch(e){}

      var updated=gHTML;
      var count=0;

      function rep(html,patterns,val){
        if(!val)return html;
        var before=html;
        patterns.forEach(function(p){html=html.split(p).join(val);});
        if(html!==before)count++;
        return html;
      }

      // Business name: replace tokens AND the real invented brand (detected from the live preview or <title>)
      if(name){
        updated=rep(updated,['[Your Business Name]','[Business Name]','[Company Name]','[Your Company]','[Your Name]'],name);
        var oldBrand='';
        try{var _pf=document.getElementById('pf');var _pd=_pf&&(_pf.contentDocument||_pf.contentWindow.document);if(_pd){var _bd=_pd.querySelector('[data-ws-field="brand"]');if(_bd&&_bd.textContent.trim())oldBrand=_bd.textContent.trim();}}catch(e){}
        if(!oldBrand){var _a=updated.indexOf('<title>'),_b=updated.indexOf('</title>');if(_a>-1&&_b>_a){var _t=updated.slice(_a+7,_b);_t=_t.split('|')[0];_t=_t.split(' - ')[0];oldBrand=_t.trim();}}
        if(oldBrand&&oldBrand.length>1&&oldBrand!==name){updated=updated.split(oldBrand).join(name);count++;}
        // Refresh the tab favicon so it matches the new name (mirrors the server monogram)
        try{
          var _fl=(name.replace(/[^A-Za-z0-9]/g,'').charAt(0)||'W').toUpperCase();
          var _fh=0;for(var _fi=0;_fi<name.length;_fi++){_fh=(_fh*31+name.charCodeAt(_fi))>>>0;}
          var _fsvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="hsl('+(_fh%360)+',62%,46%)"/><text x="32" y="45" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#ffffff" text-anchor="middle">'+_fl+'</text></svg>';
          var _flink='<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+encodeURIComponent(_fsvg)+'">';
          if(/<link[^>]+rel=["'][^"']*icon[^>]*>/i.test(updated)){updated=updated.replace(/<link[^>]+rel=["'][^"']*icon[^>]*>/i,_flink);count++;}
          else if(updated.indexOf('</head>')>-1){updated=updated.replace('</head>',_flink+'</head>');count++;}
        }catch(_efe){}
        // Persist the new brand so the publish slug, download filename and saved-projects name all reflect the rename
        try{var _sk=window._wsSite||localStorage.getItem('ws_site')||'';if(_sk){var _ik='ws_info_'+_sk,_io={};try{_io=JSON.parse(localStorage.getItem(_ik)||'{}');}catch(_e2){}_io.brand=name;localStorage.setItem(_ik,JSON.stringify(_io));}}catch(_e3){}
      }

      // Email replacements - also update mailto: links and form actions
      if(email){
        updated=rep(updated,[
          '[your@email.com]','[Your Email]','[your email]',
          '[Email Address]','[your@business.com]','[youremail@example.com]',
          'your@email.com','hello@example.com','info@example.com',
          'contact@example.com','support@example.com'
        ].concat((prev.email&&prev.email!==email)?[prev.email]:[]),email);
        // Update mailto: links
        updated=updated.replace(/mailto:[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,'mailto:'+email);
        // Update contact form action if it points to a placeholder
        updated=updated.replace(/action="[^"]*placeholder[^"]*"/g,'action="mailto:'+email+'"');
        count++;
      }

      // Phone replacements
      if(phone){
        // clean tel: hrefs to digits first, so taps dial correctly
        var telD=phone.replace(/[^0-9+]/g,'');
        updated=updated.split('tel:[Your Phone]').join('tel:'+telD);
        updated=updated.split('tel:[Phone]').join('tel:'+telD);
        updated=updated.split('tel:[Your Phone Number]').join('tel:'+telD);
        if(prev.phone){var _otd=prev.phone.replace(/[^0-9+]/g,'');if(_otd&&_otd!==telD)updated=updated.split('tel:'+_otd).join('tel:'+telD);}
      }
      updated=rep(updated,[
        '[Your Phone]','[Your Phone Number]','[Phone Number]',
        '[Phone]','[(555) 000-0000]','[555-000-0000]',
        '(555) 000-0000','555-000-0000','(000) 000-0000'
      ].concat((phone&&prev.phone&&prev.phone!==phone)?[prev.phone]:[]),phone);

      // Address replacements
      updated=rep(updated,[
        '[Your Address]','[Your Location]','[Address]',
        '[City, State]','[Your City, State]','[Street Address, City, State]'
      ].concat((addr&&prev.addr&&prev.addr!==addr)?[prev.addr]:[]),addr);

      // Booking link replacements (Calendly / Cal.com / Square scheduler)
      updated=rep(updated,[
        '[Your Booking Link]','[Booking Link]','[Your Scheduling Link]',
        '[Schedule Link]','[Your Calendar Link]','[Booking URL]'
      ].concat((booking&&prev.booking&&prev.booking!==booking)?[prev.booking]:[]),booking);

      // Online ordering link replacements (Toast / Square / DoorDash) — empty falls back to the menu section
      updated=rep(updated,[
        '[Your Ordering Link]','[Ordering Link]','[Your Order Link]','[Order Link]','[Order Online Link]','[Your Online Ordering Link]'
      ].concat((ordering&&prev.ordering&&prev.ordering!==ordering)?[prev.ordering]:[]),ordering||'#menu');

      // Business hours replacements
      updated=rep(updated,[
        '[Your Hours]','[Business Hours]','[Your Business Hours]','[Hours]','[Hours of Operation]'
      ].concat((hours&&prev.hours&&prev.hours!==hours)?[prev.hours]:[]),hours);

      // Formspree: wire up all contact forms
      if(formEmail){
        var formspreeEndpoint='https://formspree.io/f/'+formEmail.replace('@','%40');
        // Replace any existing form actions pointing to # or empty or placeholders
        var formCount=0;
        updated=updated.replace(/<form([^>]*?)action="[^"]*"([^>]*?)>/gi,function(match,pre,post){
          formCount++;
          return '<form'+pre+'action="'+formspreeEndpoint+'"'+post+'>';
        });
        // Forms with no action attribute
        updated=updated.replace(/<form([^>]*?)(?!action)>/gi,function(match,attrs){
          if(match.indexOf('action=')>-1)return match;
          formCount++;
          return '<form'+attrs+' action="'+formspreeEndpoint+'" method="POST">';
        });
        // Add hidden _replyto field to all forms if not present
        updated=updated.replace(/<form([^>]*?)>/gi,function(match){
          var hasReplyto=updated.indexOf('name="_replyto"')>-1;
          if(hasReplyto)return match;
          return match+'<input type="hidden" name="_replyto" value="'+formEmail+'">';
        });
        // Turn on native instant email alerts + dashboard tracking for this site
        try{var _s=window._wsSite||localStorage.getItem('ws_site')||'';var _k=window._wsKey||localStorage.getItem('ws_key')||'';if(_s&&_k){fetch('/api/inbox/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:_s,key:_k,email:formEmail})}).catch(function(){});}}catch(e){}
        count++;
        toast('Leads will be emailed to '+formEmail+' instantly and saved to your dashboard.',6000);
      }

      if(count===0&&updated===gHTML){
        toast('No placeholders found — your site may already have real info');
        return;
      }

      try{if(_skb){var _iob=prev||{};if(name)_iob.brand=name;if(email)_iob.email=email;if(phone)_iob.phone=phone;if(addr)_iob.addr=addr;if(booking)_iob.booking=booking;if(ordering)_iob.ordering=ordering;if(hours)_iob.hours=hours;if(formEmail)_iob.formEmail=formEmail;localStorage.setItem('ws_info_'+_skb,JSON.stringify(_iob));}}catch(e){}

      gHTML=updated;
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      setTimeout(function(){setPreview(gHTML);},50);
      try{if(window._wsTrackNow)setTimeout(window._wsTrackNow,300);}catch(e){}
      toast('Business info applied to your site!',3500);
    });
  }
})();

// -- Click-to-edit text ----------------------------------------
var editModeOn=false;

function toggleEditMode(){
  editModeOn=!editModeOn;
  var btn=document.getElementById('editModeBtn');
  var ind=document.getElementById('editIndicator');
  var pf=document.getElementById('pf');
  if(btn)btn.classList.toggle('on',editModeOn);
  if(ind)ind.classList.toggle('on',editModeOn);
  // Tell iframe to enable/disable edit mode
  if(pf&&pf.contentWindow){
    pf.contentWindow.postMessage({type:'wsSetEditMode',active:editModeOn},'*');
  }
  if(!editModeOn){try{wsCvDeselect();}catch(e){}}
}

// Receive text edits from iframe
window.addEventListener('message',function(e){
  if(!e.data||typeof e.data!=='object')return;
  if(e.data.type==='wsTextEdit'&&e.data.oldOuter&&e.data.newOuter){
    var idx=gHTML.indexOf(e.data.oldOuter);
    if(idx>-1){
      gHTML=gHTML.slice(0,idx)+e.data.newOuter+gHTML.slice(idx+e.data.oldOuter.length);
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      // Don't re-render - edit is already visible in iframe
      addMsg('ai','Text updated! Double-click anything else to keep editing.');
    }
  }
  if(e.data.type==='wsSlotClick'){
    openSlotPicker(e.data.slotId||'image',e.data.label||'Add photo');
  }
});

// ── Canva-style click-to-edit (parent side: all the real editing lives here) ──
var wsBarKind=null, wsBarSlot='';
function wsPfDoc(){var pf=document.getElementById('pf');return (pf&&(pf.contentDocument||(pf.contentWindow&&pf.contentWindow.document)))||null;}
function wsSelEl(){var d=wsPfDoc();return d?d.querySelector('[data-wssel]'):null;}
function wsSyncFromFrame(){
  var d=wsPfDoc();if(!d)return;
  try{
    var sel=d.querySelector('[data-wssel]'),so='',sf='';
    if(sel){so=sel.style.outline;sf=sel.style.outlineOffset;sel.style.outline='';sel.style.outlineOffset='';sel.removeAttribute('data-wssel');}
    try{d.querySelectorAll('[data-wsfloat]').forEach(function(b){b.remove();});}catch(e){}
    var h=d.documentElement.outerHTML;
    var sc=h.indexOf('<script id="_wsInject">');
    if(sc===-1)sc=h.indexOf("<script id='_wsInject'>");
    if(sc>-1){var se=h.indexOf('</'+'script>',sc)+9;if(se>8)h=h.slice(0,sc)+h.slice(se);}
    gHTML=h;localStorage.setItem('wsh',gHTML);pushUndo(gHTML);bumpEditCount();
    if(sel){sel.setAttribute('data-wssel','1');sel.style.outline=so||'2px solid #3dba52';sel.style.outlineOffset=sf||'1px';}
  }catch(e){}
}
function wsCvLabel(kind,tag){
  if(kind==='image')return '\uD83D\uDDBC Image';
  if(kind==='section')return '\uD83E\uDDE9 Section';
  var t=(tag||'').toUpperCase();
  if(t.charAt(0)==='H'&&t.length===2)return 'Heading';
  if(t==='A'||t==='BUTTON')return 'Button';
  return 'Text';
}
function wsCvBtn(host,html,fn,title){
  var b=document.createElement('button');b.innerHTML=html;if(title)b.title=title;
  b.style.cssText='background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:9px;padding:7px 11px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap';
  b.onmouseenter=function(){b.style.background='rgba(255,255,255,.16)';};
  b.onmouseleave=function(){b.style.background='rgba(255,255,255,.08)';};
  b.onclick=fn;host.appendChild(b);return b;
}
function wsShowBar(kind,tag,slotId){
  var bar=document.getElementById('wsCanvaBar');if(!bar)return;
  wsBarKind=kind;wsBarSlot=slotId||'';
  var lbl=document.getElementById('wsBarLabel');if(lbl)lbl.textContent='Editing: '+wsCvLabel(kind,tag);
  var acts=document.getElementById('wsBarActions');if(!acts)return;acts.innerHTML='';
  if(kind==='image'){
    if(slotId)wsCvBtn(acts,'\uD83D\uDDBC Replace',function(){openSlotPicker(slotId,'Change photo');},'Swap this photo');
    wsCvBtn(acts,'\uD83D\uDDD1 Delete',wsCvDelete,'Remove this');
  }else if(kind==='section'){
    wsCvBtn(acts,'\uD83C\uDFA8 Background',wsCvBg,'Section background colour');
    wsCvBtn(acts,'\u2B06',function(){wsCvMove(-1);},'Move up');
    wsCvBtn(acts,'\u2B07',function(){wsCvMove(1);},'Move down');
    wsCvBtn(acts,'\uD83D\uDDD1 Delete',wsCvDelete,'Delete section');
  }else{
    var _selR=wsSelEl();if(_selR&&_selR.getAttribute&&_selR.getAttribute('data-ws-rotate')!==null){wsCvBtn(acts,'\u270F Edit words',wsCvRotate,'Edit the typing words');}else{wsCvBtn(acts,'\u270F Edit',wsCvEdit,'Edit the words');}
    var _T=(tag||'').toUpperCase();
    if(_T==='A'||_T==='BUTTON')wsCvBtn(acts,'\uD83D\uDD17 Link',wsCvLink,'Set where this button goes');
    wsCvBtn(acts,'A+',function(){wsCvFont(1);},'Bigger');
    wsCvBtn(acts,'A\u2212',function(){wsCvFont(-1);},'Smaller');
    wsCvBtn(acts,'\u2630 Align',wsCvAlign,'Align left / center / right');
    wsCvBtn(acts,'<b>B</b>',wsCvBold,'Bold');
    wsCvBtn(acts,'\uD83C\uDFA8 Colour',wsCvColor,'Text colour');
    wsCvBtn(acts,'\uD83D\uDDD1',wsCvDelete,'Delete');
  }
  wsCvBtn(acts,'\u2713 Done',wsCvDeselect,'Finish editing this');
  bar.style.display='flex';
}
function wsCvDeselect(){var el=wsSelEl();if(el){el.style.outline='';el.style.outlineOffset='';el.removeAttribute('data-wssel');}var bar=document.getElementById('wsCanvaBar');if(bar)bar.style.display='none';}
function wsCvDelete(){var el=wsSelEl();if(!el)return;if(el.parentNode)el.parentNode.removeChild(el);wsSyncFromFrame();wsCvDeselect();toast('Deleted',2500);}
function wsCvFont(dir){var el=wsSelEl();if(!el)return;var d=wsPfDoc();var px=parseInt(d.defaultView.getComputedStyle(el).fontSize)||16;px=Math.max(9,Math.min(180,px+dir*3));el.style.fontSize=px+'px';wsSyncFromFrame();}
function wsCvBold(){var el=wsSelEl();if(!el)return;var d=wsPfDoc();var w=d.defaultView.getComputedStyle(el).fontWeight;var bold=(w==='700'||w==='bold'||parseInt(w)>=600);el.style.fontWeight=bold?'400':'800';wsSyncFromFrame();}
function wsCvColorInput(cb){var i=document.createElement('input');i.type='color';i.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(i);i.addEventListener('input',function(){cb(i.value);});i.addEventListener('change',function(){cb(i.value);setTimeout(function(){if(i.parentNode)i.parentNode.removeChild(i);},60);});i.click();}
function wsCvColor(){var el=wsSelEl();if(!el)return;wsCvColorInput(function(v){el.style.color=v;wsSyncFromFrame();});}
function wsCvBg(){var el=wsSelEl();if(!el)return;wsCvColorInput(function(v){el.style.background=v;wsSyncFromFrame();});}
function wsCvMove(dir){var el=wsSelEl();if(!el||!el.parentNode)return;var p=el.parentNode;if(dir<0){var pv=el.previousElementSibling;if(pv)p.insertBefore(el,pv);}else{var nx=el.nextElementSibling;if(nx)p.insertBefore(nx,el);}wsSyncFromFrame();if(el.scrollIntoView)el.scrollIntoView({block:'center'});}
function wsCvEdit(){var el=wsSelEl();if(!el)return;el.contentEditable='true';el.focus();var done=function(){el.removeAttribute('contenteditable');el.removeEventListener('blur',done);wsSyncFromFrame();};el.addEventListener('blur',done);toast('Type to edit — click away when done',3500);}
function wsCvRotate(){var el=wsSelEl();if(!el)return;var NL=String.fromCharCode(10);var raw=el.getAttribute('data-ws-rotate')||'';var cur=[];raw.split('|').forEach(function(w){w=w.trim();if(w)cur.push(w);});if(!cur.length){var t=(el.textContent||'').trim();if(t)cur.push(t);}var v=prompt('Typewriter words (one per line). These type out and cycle in your headline:',cur.join(NL));if(v===null)return;var words=[];v.split(NL).join('|').split('|').forEach(function(w){w=w.trim();if(w)words.push(w);});if(!words.length){toast('Add at least one word',2500);return;}el.setAttribute('data-ws-rotate',words.join('|'));el.textContent=words[0];wsSyncFromFrame();try{if(window.setPreview)window.setPreview(gHTML);}catch(e){}toast('Typewriter words updated',2500);}
function wsCvAlign(){var el=wsSelEl();if(!el)return;var d=wsPfDoc();if(!d)return;var cur=d.defaultView.getComputedStyle(el).textAlign;var order=['left','center','right'];var idx=order.indexOf(cur);var next=order[(idx+1)%3];if(idx===-1)next='center';el.style.textAlign=next;wsSyncFromFrame();toast('Aligned '+next,1600);}
function wsCvLink(){
  var el=wsSelEl();if(!el)return;
  var cur=el.getAttribute('href')||'';
  var v=prompt('Where should this button go?  Examples:  https://calendly.com/you   ·   tel:5551234567   ·   mailto:you@email.com   ·   #contact',cur);
  if(v===null)return;
  v=(''+v).trim();
  if(v===''){el.removeAttribute('href');wsSyncFromFrame();toast('Link cleared',2000);return;}
  var low=v.toLowerCase();
  var scheme=(low.indexOf('http:')===0||low.indexOf('https:')===0||low.indexOf('tel:')===0||low.indexOf('mailto:')===0||v.charAt(0)==='#'||v.charAt(0)==='/');
  if(!scheme){
    if(v.indexOf('@')>-1&&v.indexOf(' ')===-1){v='mailto:'+v;}
    else{var raw=v.replace(/[ ().+-]/g,'');var allDigits=raw.length>=7&&raw.length<=15;for(var ci=0;ci<raw.length&&allDigits;ci++){var cc=raw.charCodeAt(ci);if(cc<48||cc>57)allDigits=false;}if(allDigits){v='tel:'+v.replace(/[^0-9+]/g,'');}else{v='https://'+v;}}
  }
  el.setAttribute('href',v);
  if((el.tagName||'').toUpperCase()==='A'&&v.toLowerCase().indexOf('http')===0){el.setAttribute('target','_blank');el.setAttribute('rel','noopener');}
  wsSyncFromFrame();toast('Link set \u2713',2200);
}
window.addEventListener('message',function(e){if(e.data&&e.data.type==='wsSelect'){wsShowBar(e.data.kind,e.data.tag,e.data.slotId);}});

// -- Instant color replacement ---------------------------------
function extractSiteColors(){
  if(!gHTML)return[];
  var sStart=gHTML.indexOf('<style>');
  var sEnd=gHTML.indexOf('</style>');
  if(sStart===-1||sEnd===-1)return[];
  var css=gHTML.slice(sStart+7,sEnd);
  var counts={};
  var pos=0;
  while(pos<css.length){
    var hi=css.indexOf('#',pos);
    if(hi===-1)break;
    var hex=css.slice(hi,hi+7);
    if(hex.length===7){
      var valid=true;
      for(var i=1;i<7;i++){
        var ch=hex.charCodeAt(i);
        if(!((ch>=48&&ch<=57)||(ch>=65&&ch<=70)||(ch>=97&&ch<=102))){valid=false;break;}
      }
      if(valid){
        var lo=hex.toLowerCase();
        // Skip near-white (#e- and above), near-black (#1- and below), and pure grays
        var r=parseInt(lo.slice(1,3),16);
        var g=parseInt(lo.slice(3,5),16);
        var b=parseInt(lo.slice(5,7),16);
        var isGray=Math.abs(r-g)<18&&Math.abs(g-b)<18&&Math.abs(r-b)<18;
        var isWhite=r>220&&g>220&&b>220;
        var isBlack=r<30&&g<30&&b<30;
        if(!isGray&&!isWhite&&!isBlack){
          counts[lo]=(counts[lo]||0)+1;
        }
      }
    }
    pos=hi+1;
  }
  return Object.keys(counts)
    .filter(function(col){return counts[col]>0;})
    .sort(function(a,b){return counts[b]-counts[a];})
    .slice(0,8);
}

// Instant font swap — injects a removable override block, no AI round-trip
function applyFontStack(stack){
  if(!gHTML){toast('Generate a site first!');return;}
  var block='<style id="_ws_font">body,body *{font-family:'+stack+' !important}</'+'style>';
  var marker='<style id="_ws_font">';
  var s=gHTML.indexOf(marker);
  if(s>-1){
    var e=gHTML.indexOf('</'+'style>',s);
    if(e>-1)e+=8; else e=s+marker.length;
    gHTML=gHTML.slice(0,s)+block+gHTML.slice(e);
  } else {
    var h=gHTML.indexOf('</head>');
    if(h>-1)gHTML=gHTML.slice(0,h)+block+gHTML.slice(h);
    else gHTML=block+gHTML;
  }
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
}

var wsStyleOpts={corners:'default',text:'default',btn:'default'};
function wsStyleSid(){return window._wsSite||localStorage.getItem('ws_site')||'';}
function buildStyleCSS(o){
  var sel='button,input,select,textarea,img,[class*="card"],[class*="Card"],[class*="btn"],[class*="button"],[class*="box"],[class*="tile"],[class*="feature"]';
  var css='';
  if(o.corners==='sharp')css+=sel+'{border-radius:0 !important}';
  else if(o.corners==='rounded')css+=sel+'{border-radius:16px !important}';
  if(o.text==='small')css+='html{font-size:91% !important}';
  else if(o.text==='large')css+='html{font-size:112% !important}';
  if(o.btn==='pill')css+='button,[class*="btn"],[class*="button"],a[class*="cta"],a[class*="Cta"],input[type="submit"]{border-radius:999px !important}';
  return css;
}
function callBarOn(){try{return !!gHTML && gHTML.indexOf('<meta name="ws-callbar" content="on">')>-1;}catch(e){return false;}}
function setCallBar(on){
  if(!gHTML){toast('Generate a site first!');return;}
  var marker='<meta name="ws-callbar" content="on">';
  gHTML=gHTML.split(marker).join('');
  if(on){var h=gHTML.indexOf('</head>');if(h>-1)gHTML=gHTML.slice(0,h)+marker+gHTML.slice(h);else gHTML=marker+gHTML;}
  localStorage.setItem('wsh',gHTML);pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  toast(on?'Mobile call bar ON \u2014 shows on phones when your site has a phone number':'Mobile call bar removed',3500);
}
function reflectCallBar(){var seg=document.getElementById('callBarSeg');if(!seg)return;var on=callBarOn();seg.querySelectorAll('button').forEach(function(b){if((b.getAttribute('data-cb')==='on')===on)b.classList.add('on');else b.classList.remove('on');});}
function applyGlobalStyle(){
  if(!gHTML){toast('Generate a site first!');return;}
  var css=buildStyleCSS(wsStyleOpts);
  var marker='<style id="_ws_style">';
  var s=gHTML.indexOf(marker);
  if(s>-1){var e=gHTML.indexOf('</'+'style>',s);if(e>-1)e+=8;else e=s+marker.length;gHTML=gHTML.slice(0,s)+gHTML.slice(e);}
  if(css){var block=marker+css+'</'+'style>';var h=gHTML.indexOf('</head>');if(h>-1)gHTML=gHTML.slice(0,h)+block+gHTML.slice(h);else gHTML=block+gHTML;}
  localStorage.setItem('wsh',gHTML);
  try{localStorage.setItem('ws_style_'+wsStyleSid(),JSON.stringify(wsStyleOpts));}catch(e){}
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);try{flashPreview();}catch(e){}},50);
}
function reflectStyleUI(){
  var sec=document.getElementById('styleSection');if(!sec)return;
  sec.querySelectorAll('.ds-seg').forEach(function(seg){
    var key=seg.getAttribute('data-style');var val=wsStyleOpts[key]||'default';
    seg.querySelectorAll('button').forEach(function(b){if(b.getAttribute('data-v')===val)b.classList.add('on');else b.classList.remove('on');});
  });
}
function loadStyleOpts(){
  wsStyleOpts={corners:'default',text:'default',btn:'default'};
  try{var raw=localStorage.getItem('ws_style_'+wsStyleSid());if(raw){var o=JSON.parse(raw);if(o&&typeof o==='object'){wsStyleOpts.corners=o.corners||'default';wsStyleOpts.text=o.text||'default';wsStyleOpts.btn=o.btn||'default';}}}catch(e){}
  reflectStyleUI();
}

function applyColorChange(oldColor,newColor){
  if(!gHTML||!oldColor||!newColor||oldColor===newColor)return;
  var lo=oldColor.toLowerCase();
  var up=oldColor.toUpperCase();
  var updated=gHTML.split(lo).join(newColor).split(up).join(newColor);
  if(oldColor!==lo&&oldColor!==up)updated=updated.split(oldColor).join(newColor);
  if(updated===gHTML)return;
  gHTML=updated;
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  setTimeout(populateLiveColors,600); // refresh swatches after render
}

function populateLiveColors(){
  var panel=document.getElementById('liveColorPanel');
  if(!panel)return;
  var colors=extractSiteColors();
  if(colors.length===0){
    panel.innerHTML='<div style="font-size:11px;color:rgba(255,255,255,.72)">Generate a site first</div>';
    return;
  }
  panel.innerHTML=colors.map(function(col){
    return '<div class="live-color-swatch" title="'+col+'" style="background:'+col+'">'+'<input type="color" class="color-input-hidden" value="'+col+'" data-orig="'+col+'"></div>';
  }).join('');
  panel.querySelectorAll('.live-color-swatch').forEach(function(sw){
    var inp=sw.querySelector('.color-input-hidden');
    sw.addEventListener('click',function(){inp.click();});
    inp.addEventListener('input',function(){
      var orig=inp.dataset.orig;
      applyColorChange(orig,inp.value);
      inp.dataset.orig=inp.value;
      sw.style.background=inp.value;
    });
  });
}

// -- Section Manager -------------------------------------------
var parsedSections=[];

function parseSections(){
  if(!gHTML)return[];
  var results=[];
  var structural=['<nav','<header','<section','<footer','<main','<aside'];
  structural.forEach(function(tag){
    var pos=0;
    while(true){
      var found=gHTML.indexOf(tag,pos);
      if(found===-1)break;
      // Confirm it's a real tag (next char is space or >)
      var nc=gHTML[found+tag.length];
      if(nc&&nc!==' '&&nc!=='>'){pos=found+1;continue;}
      var tagEnd=gHTML.indexOf('>',found);
      if(tagEnd===-1)break;
      var opening=gHTML.slice(found,tagEnd+1);
      // Extract id or class for naming
      var nm='';
      var idI=opening.indexOf('id="');
      if(idI>-1)nm=opening.slice(idI+4,opening.indexOf('"',idI+4));
      if(!nm){var clI=opening.indexOf('class="');if(clI>-1)nm=opening.slice(clI+7,opening.indexOf('"',clI+7)).split(' ')[0];}
      var tagName=tag.replace('<','');
      var label=nm||tagName;
      label=label.charAt(0).toUpperCase()+label.slice(1).replace(/[-_]/g,' ');
      var isHidden=opening.indexOf('display:none')>-1||opening.indexOf('display: none')>-1;
      results.push({tag:tagName,label:label,start:found,hidden:isHidden});
      pos=found+1;
    }
  });
  results.sort(function(a,b){return a.start-b.start;});
  return results;
}

function showSectionManager(){
  if(!gHTML){toast('Generate a site first');return;}
  parsedSections=parseSections();
  renderSectionList();
  document.getElementById('secModal').classList.add('on');
}

function renderSectionList(){
  var list=document.getElementById('secList');
  if(!list)return;
  if(parsedSections.length===0){
    list.innerHTML='<div style="font-size:13px;color:rgba(255,255,255,.72);text-align:center;padding:20px">No sections detected</div>';
    return;
  }
  list.innerHTML=parsedSections.map(function(sec,i){
    return '<div class="sec-item'+(sec.hidden?' hidden-sec':'')+'" data-idx="'+i+'">'+
      '<span class="sec-tag">'+sec.tag+'</span>'+
      '<span class="sec-name">'+sec.label+'</span>'+
      '<button class="sec-btn'+(sec.hidden?' eye-off':'')+'" data-action="toggle" data-idx="'+i+'" title="'+(sec.hidden?'Show':'Hide')+'">'+
        (sec.hidden?'&#128065;':'&#128065;')+'</button>'+
      '<button class="sec-btn" data-action="up" data-idx="'+i+'" title="Move up">&#8679;</button>'+
      '<button class="sec-btn" data-action="down" data-idx="'+i+'" title="Move down">&#8681;</button>'+
    '</div>';
  }).join('');
  list.querySelectorAll('.sec-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var action=btn.dataset.action;
      var idx=parseInt(btn.dataset.idx);
      if(action==='toggle')toggleSection(idx);
      else if(action==='up')moveSectionUp(idx);
      else if(action==='down')moveSectionDown(idx);
    });
  });
}

function findSectionBounds(sec){
  // sec.start is the char position in gHTML when parseSections ran.
  // Since gHTML may have changed, verify the tag still starts there.
  var start=sec.start;
  var tagOpen='<'+sec.tag;

  // Verify it's still there; if not, search nearby
  if(gHTML.slice(start,start+tagOpen.length)!==tagOpen){
    // Search for it by scanning gHTML
    var best=-1;
    var pos=0;
    while(true){
      var found=gHTML.indexOf(tagOpen,pos);
      if(found===-1)break;
      var nc=gHTML[found+tagOpen.length];
      if(nc===' '||nc==='>'){
        // Check if id/class matches our label hint
        var tagEnd=gHTML.indexOf('>',found);
        var opening=gHTML.slice(found,tagEnd+1);
        var labelLow=sec.label.toLowerCase().replace(/ /g,'-');
        if(opening.indexOf(labelLow)>-1||opening.indexOf(sec.label.toLowerCase())>-1){
          best=found;break;
        }
        if(best===-1)best=found; // fallback: first match of this tag type
      }
      pos=found+1;
    }
    if(best===-1)return null;
    start=best;
  }

  // Walk forward finding matching close tag, respecting nesting
  var closeTag='</'+sec.tag+'>';
  var depth=0,p=start,end=-1;
  var openTag='<'+sec.tag;
  while(p<gHTML.length){
    if(gHTML.slice(p,p+openTag.length)===openTag){
      var nc=gHTML[p+openTag.length];
      if(nc===' '||nc==='>'){depth++;}
    } else if(gHTML.slice(p,p+closeTag.length)===closeTag){
      depth--;
      if(depth===0){end=p+closeTag.length;break;}
    }
    p++;
  }
  if(end===-1)return null;
  return{start:start,end:end};
}

function toggleSection(idx){
  var sec=parsedSections[idx];
  if(!sec)return;
  var bounds=findSectionBounds(sec);
  if(!bounds){toast('Could not find section in HTML');return;}
  var opening=gHTML.slice(bounds.start,gHTML.indexOf('>',bounds.start)+1);
  var newOpening;
  if(sec.hidden){
    // Show: remove display:none
    newOpening=opening.replace('display:none;','').replace('display:none','').replace('display: none;','').replace('display: none','');
  } else {
    // Hide: inject display:none into style
    if(opening.indexOf('style="')>-1){
      newOpening=opening.replace('style="','style="display:none;');
    } else {
      newOpening=opening.replace('>',' style="display:none">');
    }
  }
  var openEnd=gHTML.indexOf('>',bounds.start)+1;
  gHTML=gHTML.slice(0,bounds.start)+newOpening+gHTML.slice(openEnd);
  sec.hidden=!sec.hidden;
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  renderSectionList();
}

function moveSectionUp(idx){
  if(idx===0)return;
  swapSections(idx-1,idx);
}

function moveSectionDown(idx){
  if(idx>=parsedSections.length-1)return;
  swapSections(idx,idx+1);
}

function swapSections(idxA,idxB){
  // Always re-parse before swapping to get current positions
  parsedSections=parseSections();
  if(idxA>=parsedSections.length||idxB>=parsedSections.length)return;
  var secA=parsedSections[idxA];
  var secB=parsedSections[idxB];
  if(!secA||!secB)return;
  var bA=findSectionBounds(secA);
  var bB=findSectionBounds(secB);
  if(!bA){toast('Could not find section A');return;}
  if(!bB){toast('Could not find section B');return;}
  // Ensure A is before B
  if(bA.start>bB.start){var tmp=bA;bA=bB;bB=tmp;}
  // Sanity check — bounds should not overlap
  if(bA.end>bB.start){toast('Sections overlap, cannot reorder');return;}
  var htmlA=gHTML.slice(bA.start,bA.end);
  var htmlB=gHTML.slice(bB.start,bB.end);
  var between=gHTML.slice(bA.end,bB.start);
  gHTML=gHTML.slice(0,bA.start)+htmlB+between+htmlA+gHTML.slice(bB.end);
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  parsedSections=parseSections();
  renderSectionList();
  toast('Section moved!',2000);
}

// -- Image Slot System -----------------------------------------
var currentSlotId=null;

// Listen for slot clicks from inside the preview iframe
window.addEventListener('message',function(e){
  if(!e.data||typeof e.data!=='object')return;
  if(e.data.type==='wsSlotClick'){
    openSlotPicker(e.data.slotId||'image',e.data.label||'Add photo');
  }
});

function openSlotPicker(slotId,label){
  currentSlotId=slotId;
  var title=document.getElementById('slotModalTitle');
  if(title)title.textContent='Add photo to: '+label;
  renderSlotLibGrid();
  document.getElementById('slotModal').classList.add('on');
}

function renderSlotLibGrid(){
  var grid=document.getElementById('slotLibGrid');
  if(!grid)return;
  if(!imgLib||imgLib.length===0){
    grid.innerHTML='<div class="slot-lib-empty" style="grid-column:1/-1">No photos yet - upload one above</div>';
    return;
  }
  grid.innerHTML=imgLib.map(function(img){
    return '<div class="slot-lib-thumb" data-imgid="'+img.id+'"><img src="'+img.dataUrl+'" alt=""></div>';
  }).join('');
  grid.querySelectorAll('.slot-lib-thumb').forEach(function(thumb){
    thumb.addEventListener('click',function(){
      var found=imgLib.find(function(i){return i.id===thumb.dataset.imgid;});
      if(found)fillSlot(found.dataUrl);
    });
  });
}

function fillSlot(dataUrl){
  if(!gHTML||!currentSlotId)return;
  document.getElementById('slotModal').classList.remove('on');
  var pf=document.getElementById('pf');

  try{
    var doc=pf.contentDocument||pf.contentWindow.document;
    var slot=doc.querySelector('[data-ws-active]');
    if(!slot)slot=doc.querySelector('[data-slot="'+currentSlotId+'"]');
    if(!slot)slot=doc.querySelector("[data-slot='"+currentSlotId+"']");
    if(!slot){
      // The AI may have created the slot with a different id than what was clicked.
      // If exactly one unfilled image slot exists, fill that one rather than erroring.
      try{var cands=doc.querySelectorAll('[data-slot]');if(cands.length===1)slot=cands[0];}catch(e){}
    }

    if(slot){
      var h=slot.style.height||'320px';
      var br=slot.style.borderRadius||'8px';

      // Replace slot in live DOM - user sees it immediately, no re-render needed
      var container=doc.createElement('div');
      container.setAttribute('data-slot-filled',currentSlotId);
      container.style.cssText='width:100%;height:'+h+';border-radius:'+br+';overflow:hidden;position:relative';
      // If the slot was a positioned background layer (e.g. full-bleed hero bg), keep it
      // positioned so the photo stays BEHIND the content instead of popping into the flow.
      try{
        var iwin=pf.contentWindow;
        var csOld=iwin&&iwin.getComputedStyle?iwin.getComputedStyle(slot):null;
        if(csOld&&(csOld.position==='absolute'||csOld.position==='fixed')){
          container.style.position=csOld.position;
          ['top','left','right','bottom','width','height','zIndex','inset'].forEach(function(p){
            if(slot.style[p])container.style[p]=slot.style[p];
          });
          if(!slot.style.top&&!slot.style.inset){container.style.top='0';container.style.left='0';container.style.right='0';container.style.bottom='0';}
          if(csOld.zIndex&&csOld.zIndex!=='auto'&&!slot.style.zIndex)container.style.zIndex=csOld.zIndex;
        }
      }catch(e){}
      var img=doc.createElement('img');
      img.src=dataUrl;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
      container.appendChild(img);
      slot.parentNode.replaceChild(container,slot);

      // Wire the new filled slot immediately (hover overlay + click to replace)
      var ov=doc.createElement('div');
      ov.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;border-radius:inherit;pointer-events:none';
      var lb=doc.createElement('span');
      lb.style.cssText='background:rgba(255,255,255,.92);color:#111;padding:7px 18px;border-radius:100px;font-size:13px;font-weight:700';
      lb.textContent='Change photo';
      ov.appendChild(lb);container.appendChild(ov);
      container.onmouseenter=function(){ov.style.opacity='1';};
      container.onmouseleave=function(){ov.style.opacity='0';};
      container.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        parent.postMessage({type:'wsSlotClick',slotId:currentSlotId,label:'Change photo'},'*');
      };

      // Sync gHTML from live DOM (strip injected script + floating buttons first)
      try{doc.querySelectorAll('[data-wsfloat]').forEach(function(b){b.remove();});}catch(e){}
      var newHtml=doc.documentElement.outerHTML;
      var sc=newHtml.indexOf('<script id="_wsInject">');
      if(sc===-1)sc=newHtml.indexOf("<script id='_wsInject'>");
      if(sc>-1){var se=newHtml.indexOf('</'+'script>',sc)+9;if(se>8)newHtml=newHtml.slice(0,sc)+newHtml.slice(se);}
      gHTML=newHtml;
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      // Do NOT call setPreview here - image is already live in the DOM
      addMsg('ai','Photo placed! Click it to swap, or click another slot to add more.');
      toast('Photo added!',3000);
      return;
    }
  }catch(err){
  }
  // Slot not found - do NOT add to bottom, just tell user
  toast('Could not find that slot. Try regenerating the site.',4000);
}

function addImageAsSection(dataUrl){
  var sec='<div style="width:100%;max-height:480px;overflow:hidden"><img src="'+dataUrl+'" style="width:100%;display:block;object-fit:cover" alt=""></div>';
  var insertAt=gHTML.lastIndexOf('</main>');
  if(insertAt===-1)insertAt=gHTML.lastIndexOf('<footer');
  if(insertAt===-1)insertAt=gHTML.lastIndexOf('</body>');
  if(insertAt===-1){toast('Could not add image');return;}
  gHTML=gHTML.slice(0,insertAt)+sec+gHTML.slice(insertAt);
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},80);
  addMsg('ai','Added your photo as a section.');
  toast('Photo added as section!',3000);
}

function slotCompressAndFill(file){
  compressImage(file,function(dataUrl){
    var id='img_'+Date.now();
    imgLib.push({id:id,dataUrl:dataUrl,name:file.name});
    renderImgGrid();
    fillSlot(dataUrl);
  });
}

function dismissEdHint(){try{localStorage.setItem('ws_edhint','1');}catch(e){}var _h=document.getElementById('edFirstHint');if(_h)_h.style.display='none';}
function flashPreview(){try{var wrap=document.querySelector('.preview-frame-wrap');if(!wrap)return;var fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;background:rgba(61,186,82,.18);pointer-events:none;z-index:40;opacity:0;transition:opacity .2s ease';wrap.appendChild(fl);requestAnimationFrame(function(){fl.style.opacity='1';});setTimeout(function(){fl.style.opacity='0';},280);setTimeout(function(){if(fl.parentNode)fl.parentNode.removeChild(fl);},760);}catch(e){}}
function setStudioReady(ready){
  var studio=document.getElementById('studio');
  if(!studio)return;
  var intro=document.getElementById('introMsg');
  if(ready){
    studio.classList.remove('studio-loading');
    if(intro)intro.innerHTML='Your site’s ready 🌱  Tap ✎ Edit text up top to change wording right on the page — or just describe any change below.';
    try{editModeOn=false;var _eb=document.getElementById('editModeBtn');if(_eb)_eb.classList.remove('on');var _ei=document.getElementById('editIndicator');if(_ei)_ei.classList.remove('on');var _pf=document.getElementById('pf');var _em=function(){if(_pf&&_pf.contentWindow)_pf.contentWindow.postMessage({type:'wsSetEditMode',active:false},'*');};setTimeout(_em,300);setTimeout(_em,900);}catch(e){}
    try{ if(!localStorage.getItem('ws_edhint')){ var _efh=document.getElementById('edFirstHint'); if(_efh)_efh.style.display='flex'; } }catch(e){}
  } else {
    studio.classList.add('studio-loading');
    if(intro)intro.innerHTML='Designing your site… this can take up to a minute 🌱';
  }
}

// Restore the latest COMPLETE copy from the server after a refresh. Browser storage is
// capped (~5MB), so a photo-heavy site can lose its newest images locally; the server has
// the full copy (saved straight from memory). If the server draft is meaningfully larger
// than what we restored locally, adopt it. Runs ONLY on refresh-restore, never after a
// fresh generation (which would risk pulling back an older draft). Saving stays paused
// (window._wsSaveReady=false) until this settles so a stale local copy can't overwrite it.
function _wsRecoverDraft(){
  var done=function(){window._wsSaveReady=true;};
  setTimeout(done,5000); // safety net: never block saving indefinitely
  try{
    // A just-generated site that hasn't confirmed its first save yet is authoritative
    // locally — never let recovery pull an older server draft back over it.
    if(sessionStorage.getItem('ws_freshgen')==='1'){done();return;}
    var sid=window._wsSite||localStorage.getItem('ws_site')||'';
    var k=window._wsKey||localStorage.getItem('ws_key')||'';
    if(!sid||!k){done();return;}
    fetch('/load?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(k)).then(function(r){return r.json();}).then(function(j){
      try{
        if(j&&j.html&&j.html.length>100){
          var localLen=(typeof gHTML==='string'?gHTML.length:0);
          if(localLen<100||j.html.length>localLen+1000){
            gHTML=j.html;window._wsLiveHtml=j.html;
            try{localStorage.setItem('wsh',j.html);}catch(e){}
            try{undoStack=[gHTML];redoStack=[];refreshHistoryBtns();}catch(e){}
            try{setPreview(gHTML);}catch(e){}
            try{toast('Restored your latest saved version \u2713',3000);}catch(e){}
          }
          try{ if(j.pages&&j.pages.length>1&&window.wsRestorePages&&!(window._wsPages&&window._wsPages.length>1))window.wsRestorePages(j.pages); }catch(_pe){}
        }
      }catch(e){}
      done();
    }).catch(function(){done();});
  }catch(e){done();}
}
function openStudio(html){
  try{if(typeof html==='string'&&html.length>100)window._wsLiveHtml=html;}catch(e){}
  var m=html.split('<title>')[1],t=m?m.split('</title>')[0]:'Your site';
  document.getElementById('stitle').textContent=t.slice(0,50);
  document.getElementById('studio').classList.add('on');
  document.body.style.overflow='hidden';
  sessionStorage.setItem('ws_studio','1');
  autoSetDevice();
  if(unlocked)applyUnlock();
  // Grey out buttons until site loads
  setStudioReady(false);
  setTimeout(function(){setPreview(html);},50);
}

function applyUnlock(){
  unlocked=true;
  var lk=document.getElementById('lkbadge');if(lk)lk.style.display='none';
  var ub=document.getElementById('unlockBtn');if(ub)ub.style.display='none';
  var dl=document.getElementById('dlBtn');if(dl){dl.textContent='&#8595; Download';dl.className='s-btn s-green';}
  var cp=document.getElementById('copyBtn');if(cp)cp.style.display='';
  var db=document.getElementById('deployBtn');
  if(db)db.classList.add('s-deploy-hero');
  var banner=document.getElementById('deployCtaBanner');
  if(banner)banner.classList.add('on');
}

// Before paywalling a gated action, re-confirm Pro status live — fixes stale/cross-session
// cases where /me wasn't re-checked after sign-in. If genuinely Pro, unlock and re-run the action.
var _reverifying=false;
function reverifyPro(btnId, lockMsg){
  if(_reverifying)return; _reverifying=true;
  fetch('/me').then(function(r){return r.json();}).then(function(me){
    _reverifying=false;
    window._wsUser=me;
    if(me&&me.pro){
      unlocked=true; try{applyUnlock();}catch(e){}
      var b=document.getElementById(btnId); if(b)b.click();
    }else{
      toast(lockMsg);
    }
  }).catch(function(){ _reverifying=false; toast(lockMsg); });
}

function addMsg(role,text){
  var w=document.getElementById('cms'),d=document.createElement('div');
  d.className='msg msg-'+(role==='ai'?'ai':'me');
  var e=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  d.innerHTML='<div class="msg-name">'+(role==='ai'?'Websprout AI':'You')+'</div><div class="msg-body">'+e+'</div>';
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}

function isQuestion(msg){
  var raw=msg.trim();
  var q=raw.toLowerCase();
  // Strip polite lead-ins so "can you make the nav sticky" reads as the edit "make the nav sticky"
  var politePrefixes=['please ','hey ','hi ','yo ','ok ','okay ','can you ','could you ','would you ','will you ','can u ','i want you to ','i would like you to ','i want to ','i would like to ','lets ','let us '];
  var changed=true;
  while(changed){
    changed=false;
    for(var p=0;p<politePrefixes.length;p++){
      if(q.indexOf(politePrefixes[p])===0){q=q.slice(politePrefixes[p].length).trimStart();changed=true;}
    }
  }
  var editWords=['make','change','add','remove','update','replace','edit','fix','move','delete','create','put','use','set','turn','switch','give','hide','show','increase','decrease','swap','rename','rewrite','redesign','adjust','tweak','shorten','lengthen','bold','italic','center','align','capitalize','recolor','restyle'];
  var firstWord=q.split(' ')[0]||'';
  // Exploration / brainstorming phrasings go to chat even when they open with an edit-ish verb (give, suggest...)
  var ideaStarts=['give me ideas','give me some ideas','come up with','brainstorm','suggest','any ideas','some ideas','more ideas','need ideas','ideas for','idea for','what if','help me brainstorm','help me think','thoughts on','what would you','what do you','do you think','options for','what are some','what should i','what could i','can you think of'];
  for(var ix=0;ix<ideaStarts.length;ix++){if(q.indexOf(ideaStarts[ix])===0)return true;}
  if(q.indexOf('thinking about')>-1)return true;
  if(editWords.indexOf(firstWord)>-1)return false; // explicit edit instruction -> route to /modify
  if(raw.endsWith('?'))return true;
  var qstarts=['what','how','why','which','who','where','when','should i','is there','are there','do you','does','explain','tell me','advice','recommend','suggestion','difference','versus','is this','will this','does this','is it','are you'];
  for(var i=0;i<qstarts.length;i++){
    if(q.indexOf(qstarts[i])===0)return true;
  }
  // Short message with no edit verb is probably a question
  if(q.split(' ').length<=5)return true;
  return false;
}

function getSiteContext(){
  if(!gHTML)return'No site generated yet';
  var title='';
  var tS=gHTML.indexOf('<title>'),tE=gHTML.indexOf('</title>');
  if(tS>-1&&tE>-1)title=gHTML.slice(tS+7,tE).slice(0,60);
  // Grab headings so AI understands the site content
  var headings=[],pos=0,count=0;
  while(count<6){
    var h1=gHTML.indexOf('<h1',pos),h2=gHTML.indexOf('<h2',pos);
    var found=h1>-1&&(h2===-1||h1<h2)?h1:(h2>-1?h2:-1);
    if(found===-1)break;
    var te=gHTML.indexOf('>',found);var tc=gHTML.indexOf('</h',found);
    if(te>-1&&tc>-1){var txt=gHTML.slice(te+1,tc).replace(/<[^>]+>/g,'').trim().slice(0,50);if(txt)headings.push(txt);}
    pos=found+1;count++;
  }
  return'Site: "'+title+'". Content: '+headings.join(' | ')+'.'+(editCount>0?' '+editCount+' edits made.':'');
}

function friendlyErr(e){
  if(!e)return "Hmm, something went wrong — please try again.";
  if(e==="RATE_LIMITED_FREE")return "Google says this key hit a FREE-tier Gemini quota. If you enabled billing, the API key in your Worker most likely belongs to a different Google Cloud project than the billed one — recreate the key under the billing-enabled project and update GEMINI_API_KEY.";
  if(e==="RATE_LIMITED"||e==="rate")return "I'm getting rate-limited by the AI service right now 🌱  Give it a few seconds and try again — if it keeps happening, the free AI quota may just need a minute to reset.";
  if(/token count exceeds|exceeds the maximum|too large|request payload size/i.test(e))return "Your site has gotten very large for the AI to edit in one pass — usually from several big uploaded photos baked into the page. Try removing or replacing a couple of the largest images, then edit again. (Smaller photos also make your live site load faster.)";
  return e;
}

function doChat(){
  var ci=document.getElementById('ci'),msg=ci.value.trim();
  if(!msg)return;
  // If no site yet and not a question, prompt them to generate first
  if(!gHTML&&!isQuestion(msg)){
    addMsg('ai','Generate a site first, then I can make edits! Use the builder above. 🌱');
    ci.value='';ci.style.height='auto';
    return;
  }
  ci.value='';ci.style.height='auto';addMsg('user',msg);
  var btn=document.getElementById('csb');btn.disabled=true;
  document.getElementById('tw').classList.add('on');document.getElementById('cms').scrollTop=99999;

  // Route to /chat for questions, /modify for edits
  var question=isQuestion(msg);
  if(question||!gHTML){
    fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,context:getSiteContext()})})
    .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
    .then(function(r){
      btn.disabled=false;document.getElementById('tw').classList.remove('on');
      if(!r.ok){addMsg('ai',friendlyErr(r.d.error));return;}
      addMsg('ai',r.d.reply||'Not sure - try rephrasing!');
      document.getElementById('cms').scrollTop=99999;
    })
    .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
  } else {
    fetch('/modify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML,instruction:msg})})
    .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
    .then(function(r){
      btn.disabled=false;document.getElementById('tw').classList.remove('on');
      if(!r.ok){
        var errMsg=r.d.error||'Something went wrong';
        var rl=(errMsg==='RATE_LIMITED'||errMsg==='RATE_LIMITED_FREE'||errMsg==='rate');
        var hasUndo=undoStack.length>1;
        addMsg('ai',friendlyErr(errMsg)+((hasUndo&&!rl)?' Or hit << Undo to restore your previous version.':''));
        return;
      }
      gHTML=r.d.html;localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      setTimeout(function(){setPreview(gHTML);flashPreview();},50);
      try{dismissEdHint();}catch(e){}
      addMsg('ai',r.d.message||'Done! Check the preview.');
      document.getElementById('cms').scrollTop=99999;
    })
    .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
  }
}

// -- Netlify zip deploy ----------------------------------------
// Uses Netlify's file digest API to deploy without a zip library
async function createZipAndDeploy(token,siteId,html){
  // Create a simple zip with index.html using raw bytes
  // We use the Files digest API which doesn't need a zip
  var headers={'Authorization':'Bearer '+token,'Content-Type':'application/octet-stream'};
  // First create a deploy with file list
  var sha=await sha1(html);
  var deployRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId+'/deploys',{
    method:'POST',
    headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify({files:{'/index.html':sha},async:false})
  });
  var deploy=await deployRes.json();
  if(!deploy.id)throw new Error(deploy.message||'Deploy creation failed');
  // Upload the file if needed
  if(deploy.required&&deploy.required.length>0){
    var uploadRes=await fetch('https://api.netlify.com/api/v1/deploys/'+deploy.id+'/files/index.html',{
      method:'PUT',
      headers:headers,
      body:new TextEncoder().encode(html)
    });
    if(!uploadRes.ok){
      var err=await uploadRes.json();
      throw new Error(err.message||'Upload failed');
    }
  }
  // Wait for deploy to be ready
  for(var i=0;i<15;i++){
    await new Promise(function(r){setTimeout(r,1000);});
    var statusRes=await fetch('https://api.netlify.com/api/v1/deploys/'+deploy.id,{headers:{'Authorization':'Bearer '+token}});
    var status=await statusRes.json();
    if(status.state==='ready'||status.state==='current'){
      return status.ssl_url?status.ssl_url.replace('https://',''):status.url.replace('https://','');
    }
    if(status.state==='error')throw new Error('Deploy error: '+status.error_message);
  }
  // Return site URL even if deploy status check times out
  var siteRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId,{headers:{'Authorization':'Bearer '+token}});
  var site=await siteRes.json();
  return site.ssl_url?site.ssl_url.replace('https://',''):site.url.replace('https://','');
}

async function sha1(str){
  var buf=new TextEncoder().encode(str);
  var hash=await crypto.subtle.digest('SHA-1',buf);
  return Array.from(new Uint8Array(hash)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}

function doPayment(){
  if(!gHTML){toast('Generate a site first!');return;}
  var me=window._wsUser;
  if(!me||!me.auth){toast('Sign in first so your subscription unlocks all your sites.',5000);try{openAuth();}catch(e){}return;}
  function goStripe(em){
    var link='${SUB_LINK}';
    if(!link||link.indexOf('PASTE_YOUR')>-1){toast('Payments are not set up yet — add your Stripe subscription link as the STRIPE_SUB_LINK variable in your Worker.',6500);return;}
    localStorage.setItem('wsh',gHTML);
    window.location.href=link+'?client_reference_id='+encodeURIComponent(em)+'&prefilled_email='+encodeURIComponent(em);
  }
  function unlockNow(){unlocked=true;try{sessionStorage.setItem('wsu','1');}catch(e){}try{applyUnlock();}catch(e){}toast('You are already Pro. Everything is unlocked!',5000);}
  // Never send an already-Pro or comped member to Stripe.
  if(me.pro){unlockNow();return;}
  // _wsUser may be stale (comped account on a fresh session) — confirm live before charging anyone.
  fetch('/me').then(function(r){return r.json();}).then(function(m){
    if(m){window._wsUser=m;}
    if(m&&m.pro){unlockNow();return;}
    goStripe((m&&m.email)||me.email||'');
  }).catch(function(){goStripe(me.email||'');});
}

// -- Image Library ---------------------------------------------
var imgLib=[]; // {id, dataUrl, name}
var selectedImgId=null;

function compressImage(file,cb){
  // Convert any image format to JPEG via canvas (handles PNG, WebP, HEIC on supported devices, etc.)
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      try{
        var canvas=document.createElement('canvas');
        var MAX=1200; // Slightly larger for better quality in slots
        var w=img.width,h=img.height;
        if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
        if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}
        if(w<1)w=1;if(h<1)h=1;
        canvas.width=w;canvas.height=h;
        var ctx=canvas.getContext('2d');
        ctx.fillStyle='#ffffff'; // white bg in case of transparency
        ctx.fillRect(0,0,w,h);
        ctx.drawImage(img,0,0,w,h);
        // Try JPEG first, fall back to PNG if needed
        var dataUrl=canvas.toDataURL('image/jpeg',0.78);
        if(!dataUrl||dataUrl.length<100)dataUrl=canvas.toDataURL('image/png');
        cb(dataUrl);
      }catch(err){
        // Canvas failed (e.g. CORS or unsupported format) - use original
        cb(e.target.result);
      }
    };
    img.onerror=function(){
      toast('Could not read this image format. Please convert to JPEG or PNG first.',5000);
    };
    img.src=e.target.result;
  };
  reader.onerror=function(){
    toast('Could not read image file.',4000);
  };
  reader.readAsDataURL(file);
}

function addImagesToLibrary(files){
  Array.from(files).forEach(function(file){
    if(!file.type.startsWith('image/'))return;
    compressImage(file,function(dataUrl){
      var id='img_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      imgLib.push({id:id,dataUrl:dataUrl,name:file.name});
      renderImgGrid();
    });
  });
}

function renderImgGrid(){
  var grid=document.getElementById('imgGrid');
  var dz=document.getElementById('imgDropzone');
  var actions=document.getElementById('imgActions');
  if(!grid)return;
  if(imgLib.length===0){
    grid.style.display='none';
    dz.style.display='block';
    dz.classList.add('empty');
    actions.style.display='none';
    selectedImgId=null;
    return;
  }
  dz.style.display='none';
  grid.style.display='grid';
  var _imgLib=document.getElementById('imgLibrary');if(_imgLib)_imgLib.classList.remove('collapsed');
  grid.innerHTML=imgLib.map(function(img){
    var sel=selectedImgId===img.id;
    return '<div class="img-thumb'+(sel?' selected':'')+'" data-id="'+img.id+'" style="'+(sel?'border-color:#2d7a3a;':'')+'">'+
      '<img src="'+img.dataUrl+'" alt="'+img.name+'">'+
      '<button class="img-thumb-del" data-del="'+img.id+'" title="Remove">x</button>'+
    '</div>';
  }).join('');
  // Wire up thumb clicks
  grid.querySelectorAll('.img-thumb').forEach(function(thumb){
    thumb.addEventListener('click',function(e){
      if(e.target.dataset.del)return;
      selectedImgId=thumb.dataset.id;
      renderImgGrid();
      actions.style.display='flex';
      actions.style.flexDirection='column';
    });
  });
  // Wire up delete buttons
  grid.querySelectorAll('.img-thumb-del').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      imgLib=imgLib.filter(function(i){return i.id!==btn.dataset.del;});
      if(selectedImgId===btn.dataset.del){selectedImgId=null;actions.style.display='none';}
      renderImgGrid();
    });
  });
}

function injectImageIntoSite(dataUrl,action){
  if(!gHTML){toast('Generate a site first!');return;}
  var instruction='';
  if(action==='hero'){
    instruction='Replace the hero section background with this photo. Use it as a CSS background-image on the hero section: background-image:url('+dataUrl+'); background-size:cover; background-position:center; Add a dark overlay (rgba(0,0,0,0.45)) so the text stays readable. Keep all existing text and buttons.';
  } else if(action==='about'){
    instruction='Add this photo to the about or story section as an <img> tag with src="'+dataUrl+'". Style it with width:100%; border-radius:16px; object-fit:cover; Make it look natural in the layout.';
  } else if(action==='section'){
    instruction='Add this photo to the site as a full-width section image: <img src="'+dataUrl+'" style="width:100%;max-height:400px;object-fit:cover;display:block"> Place it between two existing sections where it looks best.';
  }
  // Show in chat and send
  addMsg('user','📷 Adding photo to '+action+' section...');
  document.getElementById('imgActions').style.display='none';
  var btn=document.getElementById('csb');btn.disabled=true;
  document.getElementById('tw').classList.add('on');
  fetch('/modify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML,instruction:instruction})})
  .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
  .then(function(r){
    btn.disabled=false;document.getElementById('tw').classList.remove('on');
    if(!r.ok){addMsg('ai',friendlyErr(r.d.error));return;}
    gHTML=r.d.html;localStorage.setItem('wsh',gHTML);
    pushUndo(gHTML);bumpEditCount();
    setTimeout(function(){setPreview(gHTML);},50);
    addMsg('ai','📷 Photo added! Check the preview.');
    document.getElementById('cms').scrollTop=99999;
  })
  .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
}

;
</script>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  function tt(m){ if(window.toast) window.toast(m); }
  function homeHtml(){ return (typeof window.gHTML==="string"&&window.gHTML)||localStorage.getItem("wsh")||""; }
  function curDoc(){ return (typeof window.gHTML==="string"&&window.gHTML)||localStorage.getItem("wsh")||""; }
  function persist(){ try{ if(window._wsPages&&window._wsPages.length>1){ localStorage.setItem("ws_pages", JSON.stringify({ site:(window._wsSite||localStorage.getItem("ws_site")||""), pages:window._wsPages, cur:(window._wsCurPage||0) })); } }catch(e){} }
  function saveCur(){ try{ if(window._wsPages&&window._wsPages.length){ var i=window._wsCurPage||0; var h=curDoc(); if(h&&window._wsPages[i]) window._wsPages[i].html=h; try{wsSyncNames();}catch(_s){} persist(); } }catch(e){} }
  window.wsSyncPages=saveCur;
  function loadPage(i){ var pages=window._wsPages||[]; if(!pages[i]) return; window._wsCurPage=i; var h=pages[i].html; window.gHTML=h; try{ localStorage.setItem("wsh",h); }catch(e){} if(window.undoStack){ window.undoStack=[h]; window.redoStack=[]; } if(window.setPreview) window.setPreview(h); renderTabs(i); }
  function restorePages(){ try{ var raw=localStorage.getItem("ws_pages"); if(!raw) return; var o=JSON.parse(raw); var sid=window._wsSite||localStorage.getItem("ws_site")||""; if(o&&o.pages&&o.pages.length>1&&o.site&&o.site===sid){ window._wsPages=o.pages; window._wsCurPage=o.cur||0; if(window._wsPages[0]){ var hc=curDoc(); if(hc) window._wsPages[0].html=hc; } renderTabs(window._wsCurPage); } }catch(e){} }
  (function(){ var st=document.createElement("style"); st.textContent=".ws-pagetabs{flex:0 0 100%;box-sizing:border-box;position:sticky;top:0;z-index:6;display:flex;gap:6px;flex-wrap:nowrap;overflow-x:auto;align-items:center;padding:8px 10px;background:rgba(6,13,5,.92);border-bottom:1px solid rgba(255,255,255,.06)}.ws-pagetabs .lbl{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:rgba(255,255,255,.72);margin-right:2px}.ws-ptab{flex:0 0 auto;white-space:nowrap;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.72);border-radius:8px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}.ws-ptab.on{background:rgba(45,122,58,.25);border-color:#2d7a3a;color:#7fe39a}"; document.head.appendChild(st); })();
  function renderTabs(active){
    var pages=window._wsPages||[];
    var wrap=$("previewWrap"); var bar=$("wsPageTabs");
    if(pages.length<2){ if(bar&&bar.parentNode) bar.parentNode.removeChild(bar); return; }
    if(!wrap) return;
    if(!bar){ bar=document.createElement("div"); bar.id="wsPageTabs"; bar.className="ws-pagetabs"; wrap.insertBefore(bar, wrap.firstChild); }
    bar.innerHTML="";
    var lab=document.createElement("span"); lab.className="lbl"; lab.textContent="Pages"; bar.appendChild(lab);
    pages.forEach(function(p,i){
      var b=document.createElement("button");
      b.className="ws-ptab"+(i===active?" on":"");
      b.textContent=p.title||(p.path||"Home");
      b.onclick=function(){ saveCur(); loadPage(i); };
      bar.appendChild(b);
    });
  }
  window.wsRenderPageTabs=renderTabs;
  window.wsNavClick=function(href, text){
    try{
      var pages=window._wsPages||[]; if(pages.length<2) return false;
      var idx=-1;
      if(href && href.charAt(0)==="/"){ var p=wsNormPath(href.slice(1)); for(var k=0;k<pages.length;k++){ if((pages[k].path||"")===p){ idx=k; break; } } }
      if(idx<0 && text){ var t=(text||"").replace(/[ ]+/g," ").trim().toLowerCase(); for(var m=0;m<pages.length;m++){ if((pages[m].title||"").toLowerCase()===t){ idx=m; break; } } }
      if(idx<0) return false;
      if(idx===(window._wsCurPage||0)) return true;
      saveCur(); loadPage(idx);
      return true;
    }catch(e){ return false; }
  };
  window.wsGoToPath=function(path){
    try{
      var pages=window._wsPages||[]; if(pages.length<2) return;
      path=(path||"");
      var hh=path.indexOf("#"); if(hh>-1) path=path.slice(0,hh);
      var qq=path.indexOf("?"); if(qq>-1) path=path.slice(0,qq);
      if(path.length && path.charAt(path.length-1)==="/") path=path.slice(0,-1);
      if(path==="index"||path==="index.html") path="";
      if(path.length>5 && path.slice(-5)===".html") path=path.slice(0,-5);
      var idx=-1;
      for(var k=0;k<pages.length;k++){ if((pages[k].path||"")===path){ idx=k; break; } }
      if(idx<0){ var t2=path.toLowerCase().split("-").join(" "); for(var m=0;m<pages.length;m++){ if((pages[m].title||"").toLowerCase()===t2){ idx=m; break; } } }
      if(idx<0 || idx===(window._wsCurPage||0)) return;
      saveCur(); loadPage(idx);
    }catch(e){}
  };
  window.wsRestorePages=function(pgs){try{if(!pgs||pgs.length<2)return;window._wsPages=pgs.map(function(p){return{path:p.path||"",title:p.title||(p.path?p.path:"Home"),html:p.html||""};});window._wsCurPage=0;renderTabs(0);persist();}catch(e){}};
  function wsCrc32(bytes){ var c,table=wsCrc32.t; if(!table){ table=[]; for(var n=0;n<256;n++){ c=n; for(var k=0;k<8;k++){ c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1); } table[n]=c>>>0; } wsCrc32.t=table; } var crc=0xFFFFFFFF; for(var i=0;i<bytes.length;i++){ crc=(crc>>>8)^table[(crc^bytes[i])&0xFF]; } return (crc^0xFFFFFFFF)>>>0; }
  function wsZip(files){ var parts=[],central=[],offset=0; function u16(n){ return [n&0xFF,(n>>>8)&0xFF]; } function u32(n){ n=n>>>0; return [n&0xFF,(n>>>8)&0xFF,(n>>>16)&0xFF,(n>>>24)&0xFF]; } var enc=new TextEncoder(); files.forEach(function(fl){ var nameBytes=enc.encode(fl.name); var crc=wsCrc32(fl.bytes); var sz=fl.bytes.length; var local=[].concat([0x50,0x4b,0x03,0x04],u16(20),u16(0),u16(0),u16(0),u16(33),u32(crc),u32(sz),u32(sz),u16(nameBytes.length),u16(0)); parts.push(new Uint8Array(local)); parts.push(nameBytes); parts.push(fl.bytes); var cen=[].concat([0x50,0x4b,0x01,0x02],u16(20),u16(20),u16(0),u16(0),u16(0),u16(33),u32(crc),u32(sz),u32(sz),u16(nameBytes.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset)); central.push(new Uint8Array(cen)); central.push(nameBytes); offset+=local.length+nameBytes.length+sz; }); var cstart=offset,clen=0; central.forEach(function(a){clen+=a.length;}); var end=[].concat([0x50,0x4b,0x05,0x06],u16(0),u16(0),u16(files.length),u16(files.length),u32(clen),u32(cstart),u16(0)); var all=parts.concat(central); all.push(new Uint8Array(end)); var total=0; all.forEach(function(a){total+=a.length;}); var out=new Uint8Array(total),pos=0; all.forEach(function(a){out.set(a,pos);pos+=a.length;}); return out; }
  function wsRewriteLinks(html,paths){ var out=html; out=out.split('href="/"').join('href="index.html"'); out=out.split("href='/'").join("href='index.html'"); paths.forEach(function(p){ if(!p) return; out=out.split('href="/'+p+'"').join('href="'+p+'.html"'); out=out.split("href='/"+p+"'").join("href='"+p+".html'"); }); return out; }
  function wsDownloadSite(){ try{ saveCur(); }catch(e){} var pages=window._wsPages||[]; if(pages.length<2) return false; var paths=pages.map(function(p){return p.path;}); var enc=new TextEncoder(); var files=pages.map(function(p){ var nm=p.path?(p.path.split("/").join("_")+".html"):"index.html"; return { name:nm, bytes:enc.encode(wsRewriteLinks(p.html||"",paths)) }; }); var zipped=wsZip(files); var blob=new Blob([zipped],{type:"application/zip"}); var a=document.createElement("a"); a.href=URL.createObjectURL(blob); var t=(homeHtml().split("<title>")[1]||"website"); t=t.split("</title>")[0].split("|")[0].split(" - ")[0].trim()||"website"; a.download=t.split(" ").join("-").toLowerCase()+".zip"; a.click(); if(window.toast) window.toast("Downloaded your full site as a .zip"); return true; }
  window.wsDownloadSite=wsDownloadSite;
  function wsNormPath(path){
    path=(path||"");
    var hh=path.indexOf("#"); if(hh>-1) path=path.slice(0,hh);
    var qq=path.indexOf("?"); if(qq>-1) path=path.slice(0,qq);
    if(path.length && path.charAt(path.length-1)==="/") path=path.slice(0,-1);
    if(path==="index"||path==="index.html") path="";
    if(path.length>5 && path.slice(-5)===".html") path=path.slice(0,-5);
    return path;
  }
  function wsApplyNames(html, nameByPath){
    try{
      var doc=new DOMParser().parseFromString(html,"text/html");
      var nav=doc.querySelector("nav")||doc.querySelector("header");
      if(!nav) return null;
      var links=nav.getElementsByTagName("a"); var changed=false;
      for(var i=0;i<links.length;i++){
        var a=links[i]; if(a.children && a.children.length) continue;
        var href=(a.getAttribute("href")||"");
        if(!href||href.charAt(0)!=="/") continue;
        var p=wsNormPath(href.slice(1));
        if(!nameByPath.hasOwnProperty(p)) continue;
        var want=nameByPath[p];
        var cur=(a.textContent||"").replace(/[ ]+/g," ").trim();
        if(cur!==want){ a.textContent=want; changed=true; }
      }
      if(!changed) return null;
      return "<!DOCTYPE html>"+doc.documentElement.outerHTML;
    }catch(e){ return null; }
  }
  function wsSyncNames(){
    try{
      var pages=window._wsPages||[]; if(pages.length<2) return false;
      var cur=window._wsCurPage||0;
      var src=pages[cur] && pages[cur].html; if(!src) return false;
      var sdoc=new DOMParser().parseFromString(src,"text/html");
      var snav=sdoc.querySelector("nav")||sdoc.querySelector("header");
      if(!snav) return false;
      var nameByPath={}; var sl=snav.getElementsByTagName("a");
      for(var i=0;i<sl.length;i++){
        var a=sl[i]; if(a.children && a.children.length) continue;
        var href=(a.getAttribute("href")||"");
        if(!href||href.charAt(0)!=="/") continue;
        var p=wsNormPath(href.slice(1));
        var t=(a.textContent||"").replace(/[ ]+/g," ").trim();
        if(t) nameByPath[p]=t;
      }
      var changed=false;
      for(var k=1;k<pages.length;k++){ var pp=pages[k].path||""; if(nameByPath.hasOwnProperty(pp) && pages[k].title!==nameByPath[pp]){ pages[k].title=nameByPath[pp]; changed=true; } }
      for(var m=0;m<pages.length;m++){ var nh=wsApplyNames(pages[m].html, nameByPath); if(nh){ pages[m].html=nh; changed=true; } }
      if(changed){ try{ renderTabs(window._wsCurPage||0); }catch(_r){} }
      return changed;
    }catch(e){ return false; }
  }
  function navPlanFromHome(html){
    try{
      var doc=new DOMParser().parseFromString(html,"text/html");
      var nav=doc.querySelector("nav")||doc.querySelector("header");
      if(!nav) return null;
      function slug(t){ return (t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+/,"").replace(/-+$/,""); }
      var links=nav.getElementsByTagName("a"); var seen={}, out=[];
      for(var i=0;i<links.length;i++){
        var a=links[i];
        var cls=(a.getAttribute("class")||"").toLowerCase();
        if(cls.indexOf("logo")>-1||cls.indexOf("brand")>-1||cls.indexOf("btn")>-1||cls.indexOf("button")>-1||cls.indexOf("cta")>-1) continue;
        if(a.getElementsByTagName("img").length) continue;
        var href=(a.getAttribute("href")||"");
        if(href.indexOf("http")===0 && href.indexOf("websprout")===-1) continue;
        if(href.indexOf("mailto:")===0||href.indexOf("tel:")===0) continue;
        var txt=(a.textContent||"").replace(/[ ]+/g," ").trim();
        if(!txt||txt.length>22) continue;
        var sl=slug(txt);
        if(!sl||sl==="home"||sl==="index") continue;
        var dup=false; for(var ss in seen){ if(seen.hasOwnProperty(ss)&&(sl===ss||sl.indexOf(ss+"-")===0||ss.indexOf(sl+"-")===0)){ dup=true; break; } }
        if(dup) continue;
        seen[sl]=1; out.push({path:sl,title:txt,role:txt});
        if(out.length>=7) break;
      }
      return out;
    }catch(e){ return null; }
  }
  function buildFullSite(){
    var home=homeHtml();
    if(!home||home.length<50){ tt("Generate your site first"); return; }
    var siteId=window._wsSite||localStorage.getItem("ws_site")||"";
    var btn=$("multiBtn"); if(btn) btn.disabled=true;
    tt("Planning your pages...");
    fetch("/plan-pages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:(window._wsPrompt||"")})})
    .then(function(r){return r.json();})
    .then(function(j){
      if(j&&j.error==="PRO_REQUIRED"){ if(btn) btn.disabled=false; tt("Multi-page sites are a Pro feature - upgrade to add pages"); var ub=$("unlockBtn"); if(ub) ub.click(); return; }
      var plan=(j&&j.pages)||[];
      var navPlan=navPlanFromHome(home);
      var rest;
      if(navPlan && navPlan.length>=2){ rest=navPlan; }
      else { if(plan.length<2){ tt("Could not plan pages for this site"); if(btn) btn.disabled=false; return; } rest=plan.slice(1); }
      var homeTitle=(plan[0]&&plan[0].title)||"Home";
      var navPages=[{path:"",title:homeTitle}].concat(rest.map(function(p){return {path:p.path,title:p.title};}));
      var pages=[{path:"",title:homeTitle,html:home}];
      var total=navPages.length; var i=0; var tries=0;
      function step(){
        if(i>=rest.length){
          try{ pages[0].html=wsLinkHomeNav(pages[0].html, navPages); }catch(_e){} window._wsPages=pages; window._wsCurPage=0; renderTabs(0); persist();
          if(btn){ btn.disabled=false; btn.textContent="Pages ("+pages.length+")"; }
          tt("Built "+pages.length+" pages - use the tabs above the preview, then Publish");
          return;
        }
        var pg=rest[i];
        var t0=Date.now();
        function hb(){ tt("Building "+(pg.title||"page")+" ("+(i+2)+"/"+total+")... "+Math.round((Date.now()-t0)/1000)+"s"); }
        hb(); var beat=setInterval(hb,3000);
        var ctrl=(typeof AbortController!=="undefined")?new AbortController():null;
        var to=setTimeout(function(){ if(ctrl){ try{ctrl.abort();}catch(_a){} } },105000);
        function fin(){ clearInterval(beat); clearTimeout(to); }
        function advance(ok){ fin(); if(ok){ i++; tries=0; } else if(tries<1){ tries++; } else { pages.push({path:pg.path,title:pg.title,html:home}); i++; tries=0; } step(); }
        var opts={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({home:home,page:pg,pages:navPages,siteId:siteId})};
        if(ctrl) opts.signal=ctrl.signal;
        fetch("/generate-page",opts)
        .then(function(r){return r.json();})
        .then(function(res){ if(res&&res.html){ pages.push({path:pg.path,title:pg.title,html:res.html}); advance(true); } else { advance(false); } })
        .catch(function(){ advance(false); });
      }
      step();
    })
    .catch(function(){ tt("Could not plan pages"); if(btn) btn.disabled=false; });
  }
  function wsLinkHomeNav(homeHtml, navPages){
    try{
      if(!homeHtml || !navPages || navPages.length<2) return homeHtml;
      function nrm(x){ return (x||"").replace(/[ ]+/g," ").trim().toLowerCase(); }
      var syn={ "":["home"], about:["about","about us","our story","story","who we are"], shop:["shop","store","products","shop now","shop all","browse","catalog"], menu:["menu","our menu"], contact:["contact","contact us","get in touch"], work:["work","portfolio","projects","case studies"], services:["services","what we do"], pricing:["pricing","plans"] };
      function pathFor(text){
        var t=nrm(text); if(!t) return null;
        for(var k=0;k<navPages.length;k++){ if(nrm(navPages[k].title)===t) return navPages[k].path; }
        for(var m=0;m<navPages.length;m++){ var bucket=syn[navPages[m].path]; if(bucket){ for(var b=0;b<bucket.length;b++){ if(bucket[b]===t) return navPages[m].path; } } }
        return null;
      }
      var doc=new DOMParser().parseFromString(homeHtml,"text/html");
      var nav=doc.querySelector("nav")||doc.querySelector("header");
      if(!nav) return homeHtml;
      var changed=0;
      var logoA=nav.querySelector("a.logo,a.brand,a.navbar-brand,a[class*=logo],a[class*=brand]");
      if(!logoA){ var fimg=nav.querySelector("a img"); if(fimg&&fimg.closest) logoA=fimg.closest("a"); }
      if(logoA){ logoA.setAttribute("href","/"); changed++; }
      var links=nav.getElementsByTagName("a");
      for(var i=0;i<links.length;i++){
        var a=links[i]; if(a===logoA) continue;
        var href=a.getAttribute("href")||"";
        if(href && href.charAt(0)!=="#" && href!=="/") continue;
        var p=pathFor(a.textContent);
        if(p!==null){ a.setAttribute("href", p===""?"/":"/"+p); changed++; }
      }
      if(!changed) return homeHtml;
      return "<!DOCTYPE html>"+doc.documentElement.outerHTML;
    }catch(_e){ return homeHtml; }
  }
  window.wsBuildFullSite=buildFullSite;
  function wire(){ var b=$("multiBtn"); if(b&&!b._wsWired){ b._wsWired=true; b.addEventListener("click", buildFullSite); } try{ restorePages(); }catch(e){} }
  if(document.readyState!=="loading") wire(); else document.addEventListener("DOMContentLoaded", wire);
})();
</script>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  function tt(m){ if(window.toast) window.toast(m); }
  function sid(){ return window._wsSite||localStorage.getItem("ws_site")||""; }
  function skey(){ return window._wsKey||localStorage.getItem("ws_key")||""; }
  var NL=String.fromCharCode(10);
  var modal=null;
  function buildModal(){
    if(modal) return modal;
    modal=document.createElement("div"); modal.id="wsProdModal";
    modal.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px";
    var box=document.createElement("div");
    box.style.cssText="background:#0f1a0d;border:1px solid rgba(255,255,255,.12);border-radius:16px;max-width:560px;width:100%;padding:22px;color:#fff;font-family:inherit;box-shadow:0 30px 80px rgba(0,0,0,.5)";
    box.innerHTML="<div style='font-size:18px;font-weight:800;margin-bottom:4px'>Your products</div><div style='font-size:13px;color:rgba(255,255,255,.72);margin-bottom:14px;line-height:1.6'>Add each product below. To sell, paste a <b>Stripe payment link</b> - its Buy button sends customers straight to your Stripe checkout, no Stripe Connect needed. Leave the link blank to use the built-in cart. Products show on your Shop page automatically.</div>";
    var rowsBox=document.createElement("div"); rowsBox.id="wsProdRows"; rowsBox.style.cssText="max-height:48vh;overflow-y:auto;margin-bottom:8px";
    box.appendChild(rowsBox);
    var addBtn=document.createElement("button"); addBtn.type="button"; addBtn.textContent="+ Add product";
    addBtn.style.cssText="width:100%;background:rgba(255,255,255,.06);border:1px dashed rgba(255,255,255,.2);color:#eaf2e8;border-radius:10px;padding:11px;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px";
    addBtn.onclick=function(){ addRow({}); };
    box.appendChild(addBtn);
    var row=document.createElement("div"); row.style.cssText="display:flex;gap:10px;margin-top:16px;justify-content:flex-end";
    var cancel=document.createElement("button"); cancel.textContent="Close";
    cancel.style.cssText="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:10px;padding:10px 18px;font-weight:600;cursor:pointer;font-family:inherit";
    cancel.onclick=function(){ modal.style.display="none"; };
    var save=document.createElement("button"); save.textContent="Save products";
    save.style.cssText="background:#2d7a3a;border:none;color:#fff;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;font-family:inherit";
    save.onclick=doSave;
    row.appendChild(cancel); row.appendChild(save); box.appendChild(row);
    modal.appendChild(box);
    modal.onclick=function(e){ if(e.target===modal) modal.style.display="none"; };
    document.body.appendChild(modal);
    return modal;
  }
  function fld(row,ph,val,key,full){ var i=document.createElement("input"); i.type="text"; i.placeholder=ph; i.value=val||""; i.setAttribute("data-k",key); i.setAttribute("aria-label",ph); i.style.cssText="box-sizing:border-box;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;padding:9px 10px;font-family:inherit;font-size:13px"+(full?";grid-column:1/-1":""); row.appendChild(i); return i; }
  function makeRow(p){ p=p||{}; var row=document.createElement("div"); row.className="wsProdRow"; row.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:12px;margin-bottom:10px;background:rgba(255,255,255,.02)"; fld(row,"Product name",p.name,"name"); fld(row,"Price (e.g. $24)",p.price,"price"); fld(row,"Image URL (optional)",p.img,"img",true); fld(row,"Short description",p.desc,"desc",true); fld(row,"Stripe payment link (optional)",p.payUrl,"payUrl",true); var del=document.createElement("button"); del.type="button"; del.textContent="Remove"; del.style.cssText="grid-column:1/-1;justify-self:start;background:transparent;border:none;color:#ff9b9b;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;padding:2px 0"; del.onclick=function(){ row.remove(); }; row.appendChild(del); return row; }
  function addRow(p){ var w=$("wsProdRows"); if(w) w.appendChild(makeRow(p)); }
  function readRows(){ var out=[]; var rows=document.querySelectorAll(".wsProdRow"); for(var r=0;r<rows.length;r++){ var ins=rows[r].querySelectorAll("input"); var o={}; for(var n=0;n<ins.length;n++){ o[ins[n].getAttribute("data-k")]=(ins[n].value||"").trim(); } if(o.name) out.push(o); } return out; }
  function doSave(){
    var products=readRows(); try{window._wsProducts=products;}catch(e){} var s=sid(), k=skey();
    if(!s){ tt("Publish or save your site first"); return; }
    tt("Saving products...");
    fetch("/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:s,key:k,products:products})})
    .then(function(r){return r.json();})
    .then(function(j){
      if(j&&j.error==="PRO_REQUIRED"){ tt("The store is a Pro feature - upgrade to add products"); var ub=$("unlockBtn"); if(ub) ub.click(); return; }
      if(j&&j.error){ tt(j.error); return; }
      tt("Saved "+((j&&j.products&&j.products.length)||0)+" products - live on your Shop page");
      if(modal) modal.style.display="none";
    })
    .catch(function(){ tt("Could not save products"); });
  }
  function openProducts(){
    buildModal();
    var s=sid(), k=skey(); var w=$("wsProdRows"); if(w) w.innerHTML="";
    if(s){ fetch("/products?siteId="+encodeURIComponent(s)+"&key="+encodeURIComponent(k)).then(function(r){return r.json();}).then(function(j){ try{window._wsProducts=(j&&j.products)?j.products:[];}catch(e){} var prods=(j&&j.products&&j.products.length)?j.products:[{}]; for(var n=0;n<prods.length;n++) addRow(prods[n]); }).catch(function(){ addRow({}); }); }
    else { addRow({}); }
    modal.style.display="flex";
  }
  window.wsOpenProducts=openProducts;
  function wire(){ var b=$("prodBtn"); if(b&&!b._wsPW){ b._wsPW=true; b.addEventListener("click", openProducts); } }
  if(document.readyState!=="loading") wire(); else document.addEventListener("DOMContentLoaded", wire);
})();
</script>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var m=null;
  function build(){
    if(m) return m;
    m=document.createElement("div"); m.id="wsDlWarn";
    m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.62);display:none;align-items:center;justify-content:center;z-index:10000;padding:16px";
    var box=document.createElement("div");
    box.style.cssText="background:#0f1a0d;border:1px solid rgba(255,255,255,.12);border-radius:16px;max-width:520px;width:100%;padding:24px;color:#fff;font-family:inherit;box-shadow:0 30px 80px rgba(0,0,0,.5)";
    box.innerHTML="<div style='font-size:19px;font-weight:800;margin-bottom:10px'>Before you download</div><div style='font-size:14px;color:rgba(255,255,255,.72);line-height:1.65'><p style='margin:0 0 10px'>Your download is your <b>site code</b> - the pages, design and content. It is yours to host anywhere.</p><p style='margin:0 0 10px'>It does <b>not</b> include the Websprout store checkout. Buy buttons work by calling Websprout servers, which need an <b>active subscription</b>.</p><p style='margin:0 0 10px'>If you cancel your plan, checkout stops working - even on a self-hosted copy - and your shop page becomes a <b>catalog</b> (Buy links to your contact section) until you subscribe again.</p><p style='margin:0'>Everything else works on its own.</p></div>";
    var row=document.createElement("div"); row.style.cssText="display:flex;gap:10px;margin-top:18px;justify-content:flex-end";
    var cancel=document.createElement("button"); cancel.textContent="Cancel";
    cancel.style.cssText="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:10px;padding:10px 18px;font-weight:600;cursor:pointer;font-family:inherit";
    cancel.onclick=function(){ m.style.display="none"; };
    var go=document.createElement("button"); go.textContent="Download my code";
    go.style.cssText="background:#2d7a3a;border:none;color:#fff;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;font-family:inherit";
    go.onclick=function(){ m.style.display="none"; window._wsDlOk=true; var d=$("dlBtn"); if(d) d.click(); };
    row.appendChild(cancel); row.appendChild(go); box.appendChild(row); m.appendChild(box);
    m.onclick=function(e){ if(e.target===m) m.style.display="none"; };
    document.body.appendChild(m); return m;
  }
  function gate(){ build(); m.style.display="flex"; }
  window.wsDownloadGate=gate;
})();
</script>
</body>
</html>`;

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
<p class="meta">Last updated: June 2026</p>

<p>These Terms of Service ("Terms") govern your use of Websprout (the "Service"), operated by Websprout ("we", "us"). By creating an account, building a site, or using any feature, you agree to these Terms. If you do not agree, do not use the Service.</p>

<h2>1. What Websprout is</h2>
<p>Websprout is an AI-powered website builder. You can describe a business and generate, preview, edit, and publish a website. Building and previewing are free. A paid (Pro) subscription unlocks removing the Websprout badge, connecting a custom domain, downloading your site's source code, and store features. Some capabilities &mdash; including live product management and payment checkout &mdash; are hosted online services that run on our servers, not files you download (see Sections 4, 5 and 6).</p>

<h2>2. Accounts</h2>
<p>You are responsible for all activity under your account and for keeping your sign-in access secure. You must provide accurate information and be old enough to form a binding contract where you live. You may not impersonate others or build sites you are not authorized to create.</p>

<h2>3. Subscriptions and payment</h2>
<p>Paid plans are billed in advance through Stripe at the price shown at checkout and renew automatically until cancelled. You can cancel anytime; cancellation stops future charges, and paid features remain available through the end of the current billing period. Fees are non-refundable except where required by law. We may change pricing with reasonable notice, applied to future billing periods.</p>

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
<p>The Service, including AI-generated output, is provided "as is" and "as available", without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy, or uninterrupted availability. AI output may contain errors; you are responsible for reviewing your site before you publish or sell.</p>

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
<p class="meta">Last updated: June 2026</p>
<h2>What we collect</h2>
<p>When you sign in, we store your email address and basic account details (your plan, and a payment reference if you upgrade). We use Stripe for payments — we never see or store your card details. When you build with Websprout, we store the sites you create on our servers so your work is saved to your account and your published sites stay live: this includes your drafts and published pages, any products you add, customer reviews, the contact-form messages (leads) your visitors send you, and basic usage counts.</p>
<p>To operate, secure and improve the service, we also keep a short activity log of visits and key actions (such as signing in, generating a site, and publishing). Each entry includes an approximate location (country, region and city) derived from your IP address, a one-way hashed form of your IP address (we do not store your raw IP address in this log), your browser and device type, and the referring link that brought you to the site. We use this only for our own product analytics, security and understanding how Websprout is used. We do not sell it or share it for advertising.</p>
<h2>What we don't collect</h2>
<p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>
<h2>Your prompts</h2>
<p>The prompts you type to generate websites are sent to Google's Gemini API for processing. Please see Google's privacy policy for how they handle this data.</p>
<h2>Generated sites</h2>
<p>While you are building, a working copy of your site is kept in your browser. Once you sign in or publish, your site (drafts and published pages) is also stored on our servers so it stays saved to your account and stays live on the web. You can remove any site at any time, or delete everything at once from your account settings (see below).</p>
<h2>Service providers we use</h2>
<p>We rely on a small number of trusted providers to run the Service. Each processes data only to provide its part of the Service:</p>
<ul>
<li><strong>Cloudflare</strong> — hosts Websprout and securely stores your account and the sites you build.</li>
<li><strong>Google (Gemini API)</strong> — generates websites from the prompts you write.</li>
<li><strong>Stripe</strong> — processes subscription and store payments. We never see or store card details.</li>
<li><strong>Resend</strong> — delivers transactional email, such as notifying you when a visitor submits a form on your site.</li>
</ul>
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
<p class="meta">Last updated: June 2026</p>
<p>We want Websprout to be usable by as many people as possible, including people who use screen readers, keyboard navigation, or other assistive technology. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA.</p>
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
      <div class="faq-a">No. Publishing live on Websprout is free, with a small badge. You only need Pro ($10/month) to remove the badge, use your own domain, or download and self-host the code.</div>
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
      <div class="faq-a">Yes. Use the chat in Websprout to make changes, re-download your site, and re-deploy. On Netlify, you can drag and drop a new file onto your existing site to update it. On Cloudflare Pages, you can upload a new version through the dashboard.</div>
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


// ── Feature 3: Analytics ──────────────────────────────────────
function fmtThousands(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
async function getSitesGrown(env){
  try{
    if(!env.KV) return 0;
    const v = await env.KV.get('stat:sitesgrown');
    if(v !== null){ const n = parseInt(v,10); return isNaN(n)?0:n; }
    let total = 0, cur, g = 0;
    do {
      const r = await env.KV.list({ prefix:'bcount:', cursor:cur, limit:1000 });
      for(const k of r.keys){ try{ total += (parseInt(await env.KV.get(k.name)||'0',10)||0); }catch(e){} }
      cur = r.list_complete ? null : r.cursor; g++;
    } while(cur && g < 20);
    await env.KV.put('stat:sitesgrown', String(total));
    return total;
  }catch(e){ return 0; }
}
async function doTrack(request, env) {
  // Analytics - completely optional, won't break if KV missing
  try {
    if (!env.KV) return succeed({ ok: false });
    const body = await request.json();
    const event = body.event || 'unknown';
    const key = 'stat:' + event;
    const cur = parseInt(await env.KV.get(key) || '0');
    await env.KV.put(key, String(cur + 1));
    const today = new Date().toISOString().slice(0,10);
    const dayKey = 'stat:' + event + ':' + today;
    const dayCur = parseInt(await env.KV.get(dayKey) || '0');
    await env.KV.put(dayKey, String(dayCur + 1), { expirationTtl: 60*60*24*30 });
    await logEvent(request, env, event, { ref: body.ref, src: deriveSource(body.url, body.ref) });
    return succeed({ ok: true });
  } catch(e) { return succeed({ ok: false }); }
}

async function doStats(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const [gen, pay, share] = await Promise.all([
      env.KV.get('stat:generate'),
      env.KV.get('stat:payment'),
      env.KV.get('stat:share')
    ]);
    const today = new Date().toISOString().slice(0,10);
    const [genDay, payDay] = await Promise.all([
      env.KV.get('stat:generate:' + today),
      env.KV.get('stat:payment:' + today)
    ]);
    return succeed({
      total: { generates: parseInt(gen||'0'), payments: parseInt(pay||'0'), shares: parseInt(share||'0') },
      today: { generates: parseInt(genDay||'0'), payments: parseInt(payDay||'0') },
      conversion: gen > 0 ? ((parseInt(pay||'0')/parseInt(gen||'1'))*100).toFixed(1)+'%' : '0%'
    });
  } catch(e) { return fail(e.message); }
}

// ── Feature 8: Shareable preview link ────────────────────────
async function doSavePreview(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const body = await request.json();
    if (!body.html) return fail('No HTML provided');
    const id = Math.random().toString(36).slice(2,10) + Date.now().toString(36);
    // Store for 7 days
    await env.KV.put('preview:' + id, body.html, { expirationTtl: 60*60*24*7 });
    return succeed({ id: id, url: 'https://websprout.app/preview?id=' + id });
  } catch(e) { return fail(e.message); }
}

async function doPreviewShare(request, env) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    if (!env.KV) return new Response('KV not configured', { status: 500 });
    const html = await env.KV.get('preview:' + id);
    if (!html) return new Response('<html><body style="font-family:sans-serif;padding:2rem;text-align:center"><h2>🌱 Preview expired</h2><p>This preview link has expired or does not exist.</p><a href="/">Build your own at websprout.app</a></body></html>', { status: 404, headers: {'Content-Type':'text/html'} });
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch(e) { return new Response('Error: ' + e.message, { status: 500 }); }
}


// ── Feature 2: Email delivery via Resend ──────────────────────
async function doSendEmail(request, env) {
  try {
    if (!env.RESEND_API_KEY) return fail('Email not configured');
    const body = await request.json();
    const { email, html, title } = body;
    if (!email || !html) return fail('Missing email or html');

    // Base64 encode the HTML for attachment
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(html);
    const base64Html = btoa(String.fromCharCode(...new Uint8Array(htmlBytes)));

    const siteName = title || 'your-website';
    const filename = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '.html';

    const emailBody = {
      from: 'Websprout <hello@websprout.app>',
      to: [email],
      subject: 'Your website is ready to grow! 🌱',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
          <div style="background:#0f1a0d;padding:28px 32px;text-align:center">
            <div style="font-size:32px;margin-bottom:8px">🌱</div>
            <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-1px">Websprout</div>
          </div>
          <div style="padding:36px 32px">
            <h1 style="color:#0f1a0d;font-size:24px;font-weight:800;margin:0 0 12px;letter-spacing:-1px">Your site is attached and ready!</h1>
            <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px">Your website has been attached to this email as an HTML file. Here's how to get it live:</p>
            <div style="background:#f8faf8;border:1px solid #e8f0e5;border-radius:12px;padding:20px;margin-bottom:24px">
              <div style="font-weight:700;color:#0f1a0d;margin-bottom:12px">Deploy free in 2 minutes:</div>
              <ol style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:2">
                <li>Go to <a href="https://app.netlify.com/signup" style="color:#2d7a3a">netlify.com</a> and create a free account</li>
                <li>Click <strong>Add new site</strong> → <strong>Deploy manually</strong></li>
                <li>Drag the attached HTML file onto the upload area</li>
                <li>Your site is live at a free <code style="background:#e8f0e5;padding:1px 6px;border-radius:4px">*.netlify.app</code> URL!</li>
              </ol>
            </div>
            <p style="color:#888;font-size:13px;margin:0 0 24px">Need to make changes? Go back to <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a> — your site is saved and ready to edit.</p>
            <div style="text-align:center">
              <a href="https://websprout.app" style="display:inline-block;background:#2d7a3a;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none">Back to Websprout</a>
            </div>
          </div>
          <div style="background:#f8faf8;border-top:1px solid #e8f0e5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:12px;margin:0">You're receiving this because you purchased a site on <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: base64Html
        }
      ]
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    const result = await res.json();
    if (!res.ok) return fail(result.message || 'Email failed to send');
    return succeed({ sent: true, id: result.id });
  } catch(e) {
    return fail(e.message);
  }
}


const OG_PNG_B64='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';
const OG_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#060d05"/><stop offset="1" stop-color="#0f1a0d"/></linearGradient>
<radialGradient id="glow" cx="28%" cy="32%" r="62%"><stop offset="0" stop-color="#2d7a3a" stop-opacity="0.5"/><stop offset="1" stop-color="#2d7a3a" stop-opacity="0"/></radialGradient>
<linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4ade80"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<g transform="translate(92,236)">
<rect width="92" height="92" rx="22" fill="#2d7a3a"/>
<path d="M46 72 V44" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
<path d="M46 50 C46 32 32 24 18 27 C21 45 34 53 46 50 Z" fill="#ffffff"/>
<path d="M46 46 C46 28 60 20 74 23 C71 41 58 49 46 46 Z" fill="#dff5e3"/>
</g>
<text x="206" y="306" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="78" font-weight="800" fill="#ffffff">Websprout</text>
<text x="94" y="416" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="42" font-weight="700" fill="url(#grad)">Plant an idea. Grow a website.</text>
<text x="94" y="476" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="28" font-weight="500" fill="#ffffff" fill-opacity="0.62">AI website builder - a complete site in about 90 seconds. Free to preview.</text>
</svg>`;

const SHOWCASE_PAGE = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Showcase — Real websites made with Websprout</title>
<meta name="description" content="See real websites built with Websprout in about 90 seconds. Describe your business, get a complete professional site, and publish it live for free.">
<link rel="canonical" href="https://websprout.app/showcase">
<meta property="og:title" content="Made with Websprout — website showcase">
<meta property="og:description" content="Real businesses, real websites, built in seconds with Websprout.">
<meta property="og:url" content="https://websprout.app/showcase">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;background:#060d05;color:#eaf2e8;line-height:1.6}
a{color:inherit;text-decoration:none}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 26px;max-width:1200px;margin:0 auto}
.brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:18px}
.brand em{color:#4ade80;font-style:normal}
.nav-cta{background:#2d7a3a;color:#fff;padding:9px 18px;border-radius:9px;font-size:14px;font-weight:700}
.nav-cta:hover{background:#3dba52}
.hero{text-align:center;max-width:760px;margin:0 auto;padding:54px 24px 26px}
.hero h1{font-size:clamp(2rem,6vw,3.4rem);font-weight:900;letter-spacing:-1.5px;line-height:1.1}
.hero h1 em{color:#4ade80;font-style:normal}
.hero p{color:rgba(234,242,232,.62);font-size:18px;margin-top:16px}
.hero-cta{display:inline-block;margin-top:24px;background:linear-gradient(135deg,#3dba52,#2d7a3a);color:#fff;padding:13px 28px;border-radius:11px;font-size:16px;font-weight:700;box-shadow:0 10px 30px -8px rgba(45,122,58,.7)}
.hero-cta:hover{transform:translateY(-2px)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;max-width:1200px;margin:30px auto 60px;padding:0 24px}
.card{display:block;background:#0f1a0d;border:1px solid rgba(45,122,58,.22);border-radius:15px;overflow:hidden;transition:transform .18s,border-color .18s,box-shadow .18s}
.card:hover{transform:translateY(-4px);border-color:rgba(61,186,82,.5);box-shadow:0 18px 40px -16px rgba(0,0,0,.7)}
.thumb{position:relative;width:100%;height:222px;overflow:hidden;background:#fff}
.thumb iframe{position:absolute;top:0;left:0;width:1200px;height:900px;border:0;transform:scale(.305);transform-origin:top left;pointer-events:none}
.thumb-shade{position:absolute;inset:0;z-index:2}
.card-foot{display:flex;align-items:center;justify-content:space-between;padding:13px 16px}
.card-name{font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-visit{color:#4ade80;font-size:13px;font-weight:600;flex-shrink:0;margin-left:10px}
.empty{grid-column:1/-1;text-align:center;color:rgba(234,242,232,.5);padding:50px 20px;font-size:16px}
.empty a{color:#4ade80;font-weight:700}
.loading{grid-column:1/-1;text-align:center;color:rgba(234,242,232,.35);padding:40px}
footer{border-top:1px solid rgba(255,255,255,.07);margin-top:30px;padding:26px;text-align:center;color:rgba(234,242,232,.4);font-size:13px}
footer a{margin:0 9px}footer a:hover{color:#4ade80}
</style></head><body>
<div class="nav"><a class="brand" href="/">🌱 Web<em>sprout</em></a><a class="nav-cta" href="/">Build yours free</a></div>
<div class="hero">
  <h1>Real sites, <em>built with Websprout</em></h1>
  <p>Every one of these started as a sentence. Describe your business, get a complete website in about 90 seconds, and publish it live — free.</p>
  <a class="hero-cta" href="/">🌱 Build your site free</a>
</div>
<div class="grid" id="grid"><div class="loading">Loading the showcase…</div></div>
<footer><a href="/">Home</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a><a href="mailto:support@websprout.app">Contact</a></footer>
<script>
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
fetch('/showcase/data').then(function(r){return r.json();}).then(function(j){
  var sites=(j&&j.sites)||[];var g=document.getElementById('grid');
  if(!sites.length){g.innerHTML='<div class="empty">The showcase is just getting started. <a href="/">Build your site free</a> — yours could be here.</div>';return;}
  var h='';
  for(var i=0;i<sites.length;i++){var s=sites[i];var u='https://'+esc(s.slug)+'.websprout.app';
    h+='<a class="card" href="'+u+'" target="_blank" rel="noopener"><div class="thumb"><div class="thumb-shade"></div><iframe src="'+u+'" loading="lazy" scrolling="no" tabindex="-1" title="'+esc(s.name)+'"></iframe></div><div class="card-foot"><span class="card-name">'+esc(s.name)+'</span><span class="card-visit">Visit &#8594;</span></div></a>';}
  g.innerHTML=h;
}).catch(function(){document.getElementById('grid').innerHTML='<div class="empty">Could not load the showcase right now.</div>';});
</script></body></html>`;

async function doShowcasePage(request, env){
  return new Response(SHOWCASE_PAGE, { headers:{ 'Content-Type':'text/html; charset=utf-8', 'X-Robots-Tag':'all' } });
}
async function doShowcaseData(env){
  if(!env || !env.KV) return jsonR({ sites:[] });
  const sites=[];
  try{ const r=await env.KV.list({ prefix:'featured:', limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); if(o && o.slug) sites.push({ slug:o.slug, name:o.name||o.slug, added:o.added||0 }); }catch(e){} } }catch(e){}
  sites.sort(function(a,b){return (b.added||0)-(a.added||0);});
  return jsonR({ sites });
}
async function doAdminFeature(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ ok:false, error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  const url = new URL(request.url);
  const slug = String(url.searchParams.get('slug')||'').toLowerCase().trim();
  const on = url.searchParams.get('on') !== '0';
  if(!slug) return jsonR({ ok:false, error:'no slug' }, 400);
  if(!env.KV) return jsonR({ ok:false });
  if(on){
    let name = slug;
    try{ const html = await env.KV.get('pub:'+slug); if(html){ const a=html.indexOf('<title>'), z=html.indexOf('</title>'); if(a>-1 && z>a){ let t=html.slice(a+7,z); t=t.split('|')[0].split(' - ')[0].trim(); if(t) name=t; } } }catch(e){}
    await env.KV.put('featured:'+slug, JSON.stringify({ slug, name:name.slice(0,80), added:Date.now() }));
  } else {
    try{ await env.KV.delete('featured:'+slug); }catch(e){}
  }
  return jsonR({ ok:true, featured:on });
}

// ── Niche landing pages (SEO) ─────────────────────────────────
const NICHES = [
 { slug:'barbershop', name:'Barbershop', prompt:'A modern barbershop offering fades, beard trims and walk-ins, with a classic feel, price list and online booking info', features:['Your services and prices','Hours and walk-in policy','Photos of your best cuts','A map and directions','A booking or contact section'] },
 { slug:'hair-salon', name:'Hair Salon', prompt:'A warm, upscale hair salon offering cuts, color and styling, with a service menu, stylist bios and booking info', features:['A full service menu with prices','Stylist bios and photos','Before-and-after gallery','Hours and location','An easy booking section'] },
 { slug:'nail-salon', name:'Nail Salon', prompt:'A bright, friendly nail salon offering manicures, pedicures and nail art, with a price list and walk-in hours', features:['Services and prices','Nail art gallery','Hours and walk-in policy','Hygiene and safety notes','A contact and booking section'] },
 { slug:'tattoo-studio', name:'Tattoo Studio', prompt:'A bold tattoo studio showcasing artist portfolios, custom work and flash, with consultation booking and aftercare info', features:['Artist portfolios','How custom bookings work','Flash and style examples','Aftercare guidance','Studio location and hours'] },
 { slug:'restaurant', name:'Restaurant', prompt:'A cozy neighborhood restaurant with a seasonal menu, warm inviting feel, hours, location and reservation info', features:['Your menu with prices','Hours and location','Photos of the food and space','Reservation or order info','Your story'] },
 { slug:'cafe', name:'Cafe', prompt:'A friendly local coffee shop with specialty espresso, fresh pastries and a cozy vibe, showing the menu, hours and location', features:['Menu and prices','Hours and location','Photos of drinks and the space','Wifi and seating info','A little of your story'] },
 { slug:'food-truck', name:'Food Truck', prompt:'A vibrant food truck with a bold street-food menu, weekly location schedule and catering info', features:['Your menu','This week\u2019s locations and hours','Photos that make people hungry','Catering and event booking','Social links'] },
 { slug:'bakery', name:'Bakery', prompt:'A charming bakery known for sourdough and custom cakes, with a daily menu, order info and warm rustic feel', features:['Daily menu and specials','Custom order info','Photos of your bakes','Hours and location','Allergen notes'] },
 { slug:'plumber', name:'Plumber', prompt:'A reliable 24/7 emergency plumbing company serving homes and businesses, with services, service area and a prominent phone number', features:['A phone number visitors can tap','Your services','Service area','Emergency availability','Licensing and reviews'] },
 { slug:'electrician', name:'Electrician', prompt:'A licensed residential and commercial electrician offering repairs, installs and inspections, with service area and fast quotes', features:['Services and specialties','A tap-to-call phone number','Service area','License and insurance info','A quote request form'] },
 { slug:'hvac', name:'HVAC Company', prompt:'A trusted heating and cooling company offering repair, installation and maintenance plans, with emergency service and free estimates', features:['Repair and install services','Emergency availability','Maintenance plans','Service area','A fast estimate form'] },
 { slug:'landscaper', name:'Landscaping Business', prompt:'A professional landscaping company offering design, lawn care and seasonal cleanups, with a project gallery and free quotes', features:['Your services by season','A before-and-after gallery','Service area','A free quote form','Reviews'] },
 { slug:'cleaning-service', name:'Cleaning Service', prompt:'A dependable home and office cleaning service with clear packages, satisfaction guarantee and easy quote requests', features:['Cleaning packages and prices','What is included','Service area','Trust signals like insurance and vetting','An instant quote form'] },
 { slug:'handyman', name:'Handyman', prompt:'A skilled local handyman for repairs, assembly and small projects, with a services list, service area and quick contact', features:['The jobs you take','A tap-to-call number','Service area','Photos of past work','Simple pricing guidance'] },
 { slug:'roofer', name:'Roofing Company', prompt:'A licensed roofing company offering inspections, repairs and full replacements, with financing info and free estimates', features:['Repair vs replacement services','Free inspection offer','Financing options','License and insurance','Storm damage guidance'] },
 { slug:'auto-repair', name:'Auto Repair Shop', prompt:'An honest neighborhood auto repair shop offering diagnostics, brakes, oil changes and inspections, with hours and a quote line', features:['Your services','Hours and location','A tap-to-call number','Warranty or guarantee info','Reviews'] },
 { slug:'personal-trainer', name:'Personal Trainer', prompt:'A motivating personal trainer offering 1-on-1 and small group training, with programs, client results and a free consult offer', features:['Your programs and pricing','Client transformations','Your certifications','A free consult call-to-action','Training location or online options'] },
 { slug:'yoga-studio', name:'Yoga Studio', prompt:'A calming yoga studio with a weekly class schedule, teacher bios, pricing and a welcoming new-student offer', features:['Weekly class schedule','Pricing and passes','Teacher bios','New student offer','Studio location and what to bring'] },
 { slug:'photographer', name:'Photographer', prompt:'A creative photographer specializing in portraits and events, with a stunning portfolio, packages and booking info', features:['A portfolio gallery','Packages and pricing','Your style and approach','Booking process','Testimonials'] },
 { slug:'real-estate-agent', name:'Real Estate Agent', prompt:'A dedicated local real estate agent helping buyers and sellers, with listings, testimonials, local expertise and contact info', features:['About you and your track record','Testimonials','Your market area','Buyer and seller guidance','Easy contact options'] },
 { slug:'pet-groomer', name:'Pet Groomer', prompt:'A gentle, professional pet grooming salon with services by size and breed, photos of happy clients and easy booking', features:['Services and prices by pet size','Photos of freshly groomed pets','Hours and booking info','Safety and handling approach','Location'] },
 { slug:'tutor', name:'Tutor', prompt:'An experienced tutor offering personalized lessons online and in person, with subjects, rates, results and a free intro session', features:['Subjects and levels you teach','Rates and packages','Your qualifications','Results and testimonials','A free intro session offer'] },
 { slug:'wedding-planner', name:'Wedding Planner', prompt:'A detail-obsessed wedding planner offering full planning and day-of coordination, with a portfolio, packages and consult booking', features:['Your packages','A gallery of past weddings','Testimonials','Your planning process','A consultation call-to-action'] },
 { slug:'florist', name:'Florist', prompt:'A boutique florist creating arrangements for weddings, events and everyday, with a gallery, ordering info and delivery area', features:['A gallery of arrangements','Ordering and delivery info','Wedding and event services','Hours and location','Seasonal specials'] }
];
function nichePageShell(title, desc, canonical, bodyHtml, ld){
  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
   + '<title>' + title + '</title>'
   + '<meta name="description" content="' + desc + '">'
   + '<link rel="canonical" href="' + canonical + '">'
   + '<meta name="robots" content="index, follow">'
   + '<meta name="theme-color" content="#060d05">'
   + '<meta property="og:type" content="website"><meta property="og:title" content="' + title + '"><meta property="og:description" content="' + desc + '"><meta property="og:url" content="' + canonical + '"><meta property="og:image" content="https://websprout.app/og.png">'
   + '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://websprout.app/og.png">'
   + (ld ? '<script type="application/ld+json">' + ld + '</scr' + 'ipt>' : '')
   + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:#060d05;color:#eaf2e8;line-height:1.7}a{color:#4ade80}.wrap{max-width:760px;margin:0 auto;padding:28px 20px 64px}.topnav{display:flex;align-items:center;gap:9px;margin-bottom:44px;text-decoration:none}.mark{width:30px;height:30px;background:#2d7a3a;border-radius:8px;display:flex;align-items:center;justify-content:center}.lw{color:#fff;font-weight:800;font-size:17px;letter-spacing:-.4px}.lw em{color:#4ade80;font-style:normal}h1{font-size:clamp(28px,5.5vw,40px);font-weight:800;letter-spacing:-1.4px;line-height:1.15;color:#fff;margin-bottom:14px}.sub{color:rgba(255,255,255,.72);font-size:17px;margin-bottom:26px}.cta{display:inline-block;background:#2d7a3a;color:#fff;font-weight:800;font-size:16px;padding:14px 28px;border-radius:12px;text-decoration:none}.cta:hover{background:#3ea04e}.try{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:18px 20px;margin:30px 0}.try .lbl{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#4ade80;margin-bottom:8px}.try p{color:rgba(255,255,255,.85);font-size:15px;font-style:italic}h2{font-size:20px;font-weight:800;letter-spacing:-.5px;color:#fff;margin:38px 0 12px}ol,ul{padding-left:22px;color:rgba(255,255,255,.8)}li{margin-bottom:8px;font-size:15px}.faq h3{font-size:15.5px;color:#fff;margin:18px 0 4px}.faq p{color:rgba(255,255,255,.72);font-size:14.5px}.grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.grid a{font-size:13px;border:1px solid rgba(255,255,255,.14);border-radius:100px;padding:6px 13px;text-decoration:none;color:rgba(255,255,255,.8)}.grid a:hover{border-color:#4ade80;color:#fff}.foot{margin-top:52px;padding-top:18px;border-top:1px solid rgba(255,255,255,.08);font-size:12.5px;color:rgba(255,255,255,.45)}.foot a{color:rgba(255,255,255,.6);margin-right:14px}</style></head><body><div class="wrap">'
   + '<a class="topnav" href="/"><span class="mark"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></span><span class="lw">Web<em>sprout</em></span></a>'
   + bodyHtml
   + '<div class="foot"><a href="/">Home</a><a href="/for">All business types</a><a href="/showcase">Showcase</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a><div style="margin-top:8px">&#169; 2026 Websprout</div></div>'
   + '</div></body></html>';
}
function renderNichePage(n){
  const nl = n.name.toLowerCase();
  const faq = [
    { q:'What should a ' + nl + ' website include?', a:'At minimum: ' + n.features.join(', ').toLowerCase() + '. Websprout generates all of this automatically from one sentence, and you can adjust anything just by asking.' },
    { q:'Is it really free?', a:'Yes. Building, previewing and publishing your site live at yourname.websprout.app are free, with a small Websprout badge. Pro is $10/month if you want your own domain, no badge, or to download the code.' },
    { q:'Do I need any technical skills?', a:'No. If you can describe your ' + nl + ' in one sentence, that is the whole skill. The AI builds the site and you edit it by talking to it.' }
  ];
  const ld = JSON.stringify({ '@context':'https://schema.org', '@type':'FAQPage', mainEntity: faq.map(function(f){ return { '@type':'Question', name:f.q, acceptedAnswer:{ '@type':'Answer', text:f.a } }; }) });
  const ideaHref = '/?idea=' + encodeURIComponent(n.prompt);
  const others = NICHES.filter(function(x){ return x.slug !== n.slug; }).map(function(x){ return '<a href="/for/' + x.slug + '">' + x.name + '</a>'; }).join('');
  const body = '<h1>A free ' + nl + ' website, grown by AI in about 90 seconds</h1>'
   + '<p class="sub">Describe your ' + nl + ' in one sentence. Websprout builds the whole site &mdash; then you tweak it by simply talking to it. Free to build, preview and publish.</p>'
   + '<a class="cta" href="' + ideaHref + '">Build my free ' + nl + ' site &rarr;</a>'
   + '<div class="try"><div class="lbl">Try typing this</div><p>&ldquo;' + n.prompt + '&rdquo;</p></div>'
   + '<h2>How it works</h2><ol><li><strong>Describe it</strong> &mdash; one sentence about your ' + nl + ' is enough.</li><li><strong>Watch it grow</strong> &mdash; a complete, professional site appears in about 90 seconds.</li><li><strong>Publish free</strong> &mdash; go live instantly at yourname.websprout.app, or connect your own domain with Pro.</li></ol>'
   + '<h2>What your ' + nl + ' website should include</h2><ul>' + n.features.map(function(f){ return '<li>' + f + '</li>'; }).join('') + '</ul>'
   + '<h2>Common questions</h2><div class="faq">' + faq.map(function(f){ return '<h3>' + f.q + '</h3><p>' + f.a + '</p>'; }).join('') + '</div>'
   + '<p style="margin-top:26px"><a class="cta" href="' + ideaHref + '">Start free &rarr;</a></p>'
   + '<h2>Other business types</h2><div class="grid">' + others + '</div>';
  return nichePageShell('Free ' + n.name + ' Website \u2014 AI Builds It in ~90 Seconds | Websprout',
    'Get a professional ' + nl + ' website free. Describe your business in one sentence and AI builds the whole site \u2014 preview free, publish free, no code.',
    'https://websprout.app/for/' + n.slug, body, ld);
}
function renderNicheIndex(){
  const links = NICHES.map(function(x){ return '<a href="/for/' + x.slug + '">' + x.name + '</a>'; }).join('');
  const body = '<h1>A free AI-built website for every kind of business</h1>'
   + '<p class="sub">Pick your business type to see how Websprout builds your site from one sentence &mdash; free to build, preview and publish.</p>'
   + '<div class="grid" style="margin-top:18px">' + links + '</div>'
   + '<p style="margin-top:34px"><a class="cta" href="/">Just start building &rarr;</a></p>';
  return nichePageShell('Free AI Website Builder for Any Business | Websprout',
    'Free AI-built websites for barbershops, restaurants, plumbers, salons, trainers and more. One sentence in, a full website out in about 90 seconds.',
    'https://websprout.app/for', body, '');
}

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://websprout.app/</loc><lastmod>2026-06-01</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://websprout.app/showcase</loc><lastmod>2026-06-01</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://websprout.app/deploy-guide</loc><lastmod>2026-06-01</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://websprout.app/terms</loc><lastmod>2026-06-01</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://websprout.app/privacy</loc><lastmod>2026-06-01</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://websprout.app/for</loc><lastmod>2026-07-09</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
${NICHES.map(function(n){ return '  <url><loc>https://websprout.app/for/' + n.slug + '</loc><lastmod>2026-07-09</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>'; }).join('\n')}
</urlset>`;

const ROBOTS = `User-agent: *
Allow: /
Disallow: /preview
Disallow: /success
Disallow: /render

Sitemap: https://websprout.app/sitemap.xml`;


export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runWeeklyDigest(env));
    ctx.waitUntil(runNudges(env, false));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    const _host = url.hostname.toLowerCase();
    const _appHosts = ['websprout.app','www.websprout.app'];
    if (url.pathname === '/checkout' && request.method === 'GET') return doCheckout(request, env);
    if (url.pathname === '/cart-checkout' && request.method === 'POST') return doCartCheckout(request, env);
    if (request.method === 'GET' && _appHosts.indexOf(_host) === -1 && _host.indexOf('.workers.dev') === -1 && _host.indexOf('localhost') === -1 && !url.pathname.startsWith('/api/')) {
      if (_host.endsWith('.websprout.app')) {
        const _sub = _host.slice(0, _host.length - '.websprout.app'.length);
        if (_sub && _sub.indexOf('.') === -1) {
          const _r = await servePublished(_sub, env, url.pathname);
          return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      } else if (env.KV) {
        const _mapped = await env.KV.get('domain:' + _host);
        if (_mapped) { const _r = await servePublished(_mapped, env, url.pathname); if (_r) return _r; }
      }
    }
    if (url.pathname === '/generate' && request.method === 'POST') return doGenerate(request, env);
    if (url.pathname === '/generate-page' && request.method === 'POST') return doGeneratePage(request, env);
    if (url.pathname === '/plan-pages' && request.method === 'POST') return doPlanPages(request, env);
    if (url.pathname === '/products') return doProducts(request, env);
    if (url.pathname === '/genimage' && request.method === 'POST') return doGenImage(request, env);
    if (url.pathname === '/api/post' && request.method === 'POST') return doWritePost(request, env);
    if (url.pathname === '/api/invoice' && request.method === 'POST') return doInvoice(request, env);
    if (url.pathname === '/connect/start' && request.method === 'GET') return doConnectStart(request, env);
    if (url.pathname === '/connect/return' && request.method === 'GET') return doConnectReturn(request, env);
    if (url.pathname === '/track' && request.method === 'POST') return doTrack(request, env);
    if (url.pathname === '/send-email' && request.method === 'POST') return doSendEmail(request, env);
    if (url.pathname === '/stats' && request.method === 'GET') return doStats(request, env);
    if (url.pathname === '/preview' && request.method === 'GET') return doPreviewShare(request, env);
    if (url.pathname === '/preview' && request.method === 'POST') return doSavePreview(request, env);
    if (url.pathname === '/chat' && request.method === 'POST') return doChat(request, env);
    if (url.pathname === '/modify' && request.method === 'POST') return doModify(request, env);
    if (url.pathname === '/render' && request.method === 'POST') return doRender(request);
    if (url.pathname.startsWith('/api/form/')) {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doFormSubmit(request, env, decodeURIComponent(url.pathname.slice(10)));
    }
    if (url.pathname === '/api/review') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doReviewSubmit(request, env);
    }
    if (url.pathname === '/api/reviews' && request.method === 'GET') return doReviewsGet(new URL(request.url), env);
    if (url.pathname === '/api/clientlog') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doClientLog(request, env);
    }
    if (url.pathname === '/inbox') return new Response(INBOX_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/reviews' && request.method === 'GET') return doReviewsPage(request, env);
    if (url.pathname === '/api/reviews/manage') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'GET' || request.method === 'POST') return doReviewsManage(request, env);
    }
    if (url.pathname === '/publish' && request.method === 'POST') return doPublish(request, env);
    if (url.pathname === '/unpublish' && request.method === 'POST') return doUnpublish(request, env);
    if (url.pathname === '/slug-check' && request.method === 'GET') return doSlugCheck(request, env);
    if (url.pathname === '/support' && request.method === 'POST') return doSupport(request, env);
    if (url.pathname === '/admin' && request.method === 'GET') return doAdminPage(request, env);
    if (url.pathname === '/admin/data' && request.method === 'GET') return doAdminData(request, env);
    if (url.pathname === '/admin/activity' && request.method === 'GET') return doAdminActivity(request, env);
    if (url.pathname === '/admin/nudge' && request.method === 'GET') return doAdminNudge(request, env);
    if (url.pathname === '/email-optout' && request.method === 'GET') return doEmailOptout(request, env);
    if (url.pathname === '/admin/grant') return doAdminGrant(request, env);
    if (url.pathname === '/admin/feature') return doAdminFeature(request, env);
    if (url.pathname === '/showcase') return doShowcasePage(request, env);
    if (url.pathname === '/showcase/data') return doShowcaseData(env);
    if (url.pathname === '/dev' && request.method === 'GET') return doDevPage(request, env);
    if (url.pathname === '/dev/data' && request.method === 'GET') return doDevData(request, env);
    if (url.pathname === '/auth/google' && request.method === 'GET') return doGoogleStart(request, env);
    if (url.pathname === '/auth/google/callback' && request.method === 'GET') return doGoogleCallback(request, env);
    if (url.pathname === '/auth/email' && request.method === 'POST') return doEmailStart(request, env);
    if (url.pathname === '/auth/verify' && request.method === 'GET') return doVerify(request, env);
    if (url.pathname === '/me' && request.method === 'GET') return doMe(request, env);
    if (url.pathname === '/auth/logout') return doLogout(request, env);
    if (url.pathname === '/save' && request.method === 'POST') return doSave(request, env);
    if (url.pathname === '/load' && request.method === 'GET') return doLoad(request, env);
    if (url.pathname === '/my-sites' && request.method === 'GET') return doMySites(request, env);
    if (url.pathname === '/account/export' && request.method === 'GET') return doAccountExport(request, env);
    if (url.pathname === '/account/billing-portal' && request.method === 'POST') return doBillingPortal(request, env);
    if (url.pathname === '/account/delete' && request.method === 'POST') return doAccountDelete(request, env);
    if (url.pathname === '/my-sites/claim' && request.method === 'POST') return doMySitesClaim(request, env);
    if (url.pathname === '/my-sites/delete' && request.method === 'POST') return doMySitesDelete(request, env);
    if (url.pathname === '/api/hit' && request.method === 'POST') return doHit(request, env);
    if (url.pathname === '/api/hit' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/api/views' && request.method === 'GET') return doViews(request, env);
    if (url.pathname.startsWith('/s/')) { const _parts = url.pathname.slice(3).split('/'); const _sl = slugify(_parts[0]); const _pg = _parts.slice(1).join('/'); const _r = await servePublished(_sl, env, _pg); return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/api/domain-check' && request.method === 'GET') return doDomainCheck(request, env);
    if (url.pathname === '/api/connect-domain' && request.method === 'POST') return doConnectDomain(request, env);
    if (url.pathname === '/api/inbox' && request.method === 'GET') return doInboxData(request, env);
    if (url.pathname === '/api/inbox/notify' && request.method === 'POST') return doInboxNotify(request, env);
    if (url.pathname === '/api/inbox/clear' && request.method === 'POST') return doInboxClear(request, env);
    if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') return doStripeWebhook(request, env);
    if (url.pathname === '/success') return new Response(SUCCESS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/terms') return new Response(TERMS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/privacy') return new Response(PRIVACY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/accessibility') return new Response(ACCESSIBILITY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/deploy-guide') return new Response(DEPLOY_GUIDE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/sitemap.xml') return new Response(SITEMAP, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if ((url.pathname === '/for' || url.pathname === '/for/') && request.method === 'GET') return new Response(renderNicheIndex(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    if (url.pathname.startsWith('/for/') && request.method === 'GET') { const _nk = url.pathname.slice(5).replace(/\/+$/,''); const _n = NICHES.find(function(x){ return x.slug === _nk; }); if (_n) return new Response(renderNichePage(_n), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }); return new Response(pubPage404(), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/og.svg') return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/og.png') { try { const _b = Uint8Array.from(atob(OG_PNG_B64), function(c){ return c.charCodeAt(0); }); return new Response(_b, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } }); } catch(e) { return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } }); } }
    if (url.pathname === '/robots.txt') return new Response(ROBOTS, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    let _html = PAGE;
    // Stripe subscription link comes from an env var so it persists across code updates
    // (a hardcoded link in the file would be overwritten every time worker.js is redeployed).
    const _sub = (env.STRIPE_SUB_LINK || env.SUB_LINK || '').trim();
    if (_sub) _html = _html.split(SUB_LINK).join(_sub);
    try { const _sg = await getSitesGrown(env); if (_sg && _sg > 0) _html = _html.split('id="liveCount">&mdash;<').join('id="liveCount">' + fmtThousands(_sg) + '<'); } catch (e) {}
    return new Response(_html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
  }
};


// Collect every configured Gemini key (supports GEMINI_API_KEY, _2.._8, and a
// comma-separated GEMINI_API_KEYS), de-dupe, and shuffle so load spreads evenly
// across keys instead of always hammering the first one. Keys on SEPARATE Google
// projects each carry their own free-tier quota, so more keys = more headroom.
function geminiKeys(env) {
  const set = [];
  const add = (v) => { if (v && typeof v === 'string') v.split(',').forEach(k => { k = k.trim(); if (k && set.indexOf(k) === -1) set.push(k); }); };
  add(env.GEMINI_API_KEY);
  add(env.GEMINI_API_KEY2); add(env.GEMINI_API_KEY_2);
  add(env.GEMINI_API_KEY3); add(env.GEMINI_API_KEY4); add(env.GEMINI_API_KEY5);
  add(env.GEMINI_API_KEY6); add(env.GEMINI_API_KEY7); add(env.GEMINI_API_KEY8);
  add(env.GEMINI_API_KEYS);
  for (let i = set.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = set[i]; set[i] = set[j]; set[j] = t; }
  return set;
}

async function callGemini(keys, bodyStr, model, timeoutMs, budgetMs) {
  if (!Array.isArray(keys)) keys = [keys];
  keys = keys.filter(Boolean);
  if (!keys.length) return { error: 'GEMINI_API_KEY not set.' };
  // Generation model. gemini-2.5-flash is fast + reliable, keeping generation well under
  // a browser-friendly timeout. Swap to 'gemini-2.5-pro' for max quality at the cost of speed.
  const MODEL = model || 'gemini-2.5-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const FETCH_TIMEOUT = timeoutMs || 60000;   // per-request abort, kept well under Cloudflare's ~100s edge limit
  const START = Date.now();                     // overall budget guard so multiple slow keys can't cumulatively 524
  let lastErr = 'RATE_LIMITED';
  // For each available key, allow one backoff retry on a 429 (free-tier per-minute
  // limits are bursty and usually clear within a couple of seconds). We move to the
  // next key after exhausting retries, and only surface RATE_LIMITED once everything
  // is truly out of capacity.
  for (let i = 0; i < keys.length; i++) {
    if (budgetMs && (Date.now() - START) > budgetMs) break;  // out of time budget — stop before risking a 524
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (i > 0 && attempt === 0) await sleep(800);  // brief gap before trying the next key
        if (attempt > 0) await sleep(2800);             // backoff before retrying the same key
        if (budgetMs && (Date.now() - START) > budgetMs) { lastErr = 'The AI took too long to respond — please try again.'; break; }
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': keys[i] },
          body: bodyStr,
          signal: AbortSignal.timeout(FETCH_TIMEOUT)
        });
        const text = await r.text();
        let d;
        try { d = JSON.parse(text); } catch(e) {
          return { error: 'Bad response: ' + text.slice(0, 150) };
        }
        if (r.status === 429 || (d.error && d.error.code === 429)) {
          let detail = ''; try { detail = JSON.stringify(d.error || d).toLowerCase(); } catch(e) {}
          try { console.warn('[Websprout] Gemini 429 — ' + (((d.error && d.error.message) || '') + '').slice(0, 240)); } catch(e) {}
          lastErr = (detail.indexOf('freetier') > -1 || detail.indexOf('free_tier') > -1 || detail.indexOf('free tier') > -1) ? 'RATE_LIMITED_FREE' : 'RATE_LIMITED';
          break; // do not re-fire the same key on a 429 — it only burns another request against the quota; the frontend already waits and retries
        }
        if (!r.ok) return { error: (d.error && d.error.message) || ('API error ' + r.status) };
        return { data: d };
      } catch(e) {
        lastErr = (e && e.name === 'TimeoutError') ? 'The AI took too long to respond — please try again.' : ((e && e.message) || 'Network error');
        break; // network/timeout won't be helped by retrying the same key — move on
      }
    }
  }
  return { error: lastErr };
}


function getStyleDirection(prompt) {
  var p = prompt.toLowerCase();
  // If user specified colors, don't override them
  var colorWords = ['red','blue','green','purple','black','white','dark','light','orange','yellow','pink','gold','navy','teal','gray','grey','brown','coral','mint','cream'];
  var userSpecifiedColors = colorWords.some(function(w){ return p.includes(w); });
  if (userSpecifiedColors) {
    return 'STYLE DIRECTION: Use the exact colors the user specified in their prompt. Follow their color choices precisely.';
  }
  return 'STYLE DIRECTION: ' + getCategoryStyle(prompt);
}

function getCategoryStyle(prompt) {
  var p = prompt.toLowerCase();

  // Detect category and return a highly specific design brief
  if (p.match(/coffee|cafe|bakery|restaurant|food|bar|bistro|brewery|pizza|sushi|burger/)) {
    var styles = [
      'Rich, warm editorial. Deep espresso brown (#1a0f0a) hero with cream (#fdf6ec) body. Oversized serif-inspired headings in a warm off-white. Menu items in elegant cards with bottom borders. Gold (#c9a84c) accent for prices and CTAs. Think: high-end NYC coffee bar.',
      'Clean Scandinavian cafe aesthetic. Off-white (#fafaf7) background, charcoal (#2d2d2d) text. Warm terracotta (#c4622d) accent. Large product cards with generous padding. Minimal nav. Everything breathes. Think: Copenhagen specialty coffee.',
      'Bold Italian trattoria energy. Cream (#fef9f0) background, deep forest green (#1b4332) primary color, rust red (#c0392b) accent. Hand-feel typography sizing. Generous section spacing. Think: Soho Italian restaurant.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/saas|software|app|platform|tool|dashboard|analytics|crm|workflow|automation|tech|startup/)) {
    var styles = [
      'Modern SaaS like Linear or Vercel. Pure white (#ffffff) body, deep midnight (#0f0f23) hero with subtle purple gradient overlay. Electric purple (#7c3aed) accent. Sharp geometric cards with thin 1px borders. Monospace touches in code snippets. Think: $1B startup landing page.',
      'Clean B2B SaaS like Notion. Soft off-white (#f9f9f7) background, near-black (#1a1a1a) text, bright blue (#2563eb) accent. Data visualization cards with numbers in huge type. Trust badges. Testimonials from job titles not names. Think: enterprise software.',
      'Bold growth-stage startup. White body, electric teal (#0891b2) to indigo (#4f46e5) hero gradient. White text in hero. Feature grid with icon boxes. Large social proof numbers (10,000+ users). Think: Y Combinator portfolio company.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/portfolio|designer|developer|freelance|creative|artist|photographer|architect/)) {
    var styles = [
      'Minimal designer portfolio like awwwards winners. Pure white, near-black text, single accent (your choice of one color). Huge project cards that fill the width. Name in massive display type in the hero. Case study hover effects with CSS only. Think: top Dribbble designer.',
      'Dark creative portfolio. Deep charcoal (#111111) background with off-white (#f0ede8) text. Accent in electric yellow (#fbbf24) or hot pink (#ec4899). Project grid with 2-column asymmetric layout. Huge hover states. Think: award-winning creative agency.',
      'Editorial magazine portfolio. Off-white (#fafaf8) body, oversized serif headings mixed with light sans-serif body. Black and white with one color accent. Horizontal scrolling feel achieved with CSS. Think: high-fashion editorial.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/gym|fitness|workout|personal trainer|yoga|pilates|crossfit|health|wellness|spa|meditation/)) {
    var styles = [
      'High performance gym brand. Jet black (#0a0a0a) hero, electric lime green (#84cc16) accent, white body sections. Bold condensed headings in ALL CAPS. Stats section with huge numbers. Before/after style feature layout. Think: Nike Training or Gymshark.',
      'Premium wellness studio. Warm white (#fefcf8) background, sage green (#4a7c59) primary, warm sand (#d4a574) accent. Soft rounded everything. Testimonials section with leaf/plant decorations in CSS. Calm and aspirational. Think: high-end yoga studio.',
      'Modern fitness app landing page. White body, deep navy (#0f172a) hero, coral (#f97316) accent. Feature cards showing app screens as CSS art boxes. Progress bar animations via CSS only. Think: fitness tech startup.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/law|legal|attorney|lawyer|firm|consulting|finance|accounting|insurance|real estate|agency/)) {
    var styles = [
      'Premium professional services. Rich navy (#0f2447) hero and accents, crisp white body, gold (#b8962e) for CTAs and highlights. Serif-feel headings via font-weight manipulation. Practice area cards with thin borders. Trust indicators front and center. Think: top NYC law firm.',
      'Modern boutique consultancy. Slate gray (#334155) body text on warm white (#fdfcfb), electric blue (#0ea5e9) accent. Clean grid layout, lots of whitespace. Stats in large type. Photo placeholders as gradient boxes. Think: McKinsey meets startup agency.',
      'Approachable professional. Soft light blue (#f0f9ff) background sections, deep teal (#0f766e) primary color, white cards. Friendly rounded corners but still serious. FAQ accordion section. Think: modern regional law firm.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/shop|store|ecommerce|product|sell|merch|clothing|fashion|boutique|jewelry|brand/)) {
    var styles = [
      'Premium editorial ecommerce like Net-a-Porter. Pure white, thin typography, black accents. Product cards with full-bleed gradient placeholders. Price in elegant type. Hover states that shift card up with shadow. Think: luxury fashion brand.',
      'Bold streetwear brand. Off-black (#111111) hero, raw white body, accent in electric orange (#f97316) or acid yellow. Heavy brutalist typography with thin subtitle contrast. Product grid with big hover scale. Think: Supreme or Palace.',
      'Clean DTC brand. Warm cream (#fdf8f0) background, forest green (#166534) primary, white CTA buttons. Story-driven about section. Lifestyle-feel product cards. Trust badges (free shipping, returns). Think: successful Shopify brand.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/blog|news|magazine|journal|newsletter|content|media|publication/)) {
    var styles = [
      'Premium editorial magazine. Off-white (#fafaf8), near-black body text, red (#dc2626) accent for featured labels. Mix of large and small article cards. Sticky sidebar. Pull quotes in large italic. Think: The Atlantic or NY Times digital.',
      'Modern newsletter/media brand. Clean white, royal blue (#1d4ed8) accent, strong grid. Featured article takes 60% width, secondaries in sidebar. Category pills. Reading time indicators. Think: Morning Brew or The Hustle.',
      'Minimalist personal blog. Warm white (#fffef7), dark gray (#1c1917) text, single muted green or terracotta accent. Wide centered content column. Drop caps on first paragraph. Clean tag system. Think: a writer with taste.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/music|band|artist|concert|events|venue|nightclub|festival|entertainment/)) {
    var styles = [
      'Dark entertainment brand. Near-black (#09090b) hero and body, electric purple (#a855f7) to pink (#ec4899) gradient accents. Glassmorphism cards on dark bg (rgba white with blur). Grid of upcoming shows. Think: Spotify meets concert venue.',
      'Indie music artist. Deep charcoal (#1c1917) background, warm amber (#f59e0b) accent, cream text. Large tour dates section. Music section with styled audio player boxes. Think: premium indie label.',
      'Festival/events brand. Vivid gradient hero (coral #fb7185 to yellow #fbbf24). White body with gradient card accents. Bold condensed headings. Countdown-style stats boxes. Think: Coachella or SXSW.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/nonprofit|charity|foundation|donation|volunteer|community|church|organization/)) {
    var styles = [
      'Trustworthy impact organization. Deep ocean blue (#1e3a5f) hero, white body, warm orange (#f97316) accent. Impact stats in large bold numbers. Mission statement in large display type. Clean donation CTA section. Think: well-funded nonprofit.',
      'Warm community organization. Soft sage (#f0fdf4) background, deep green (#166534) primary, golden yellow accent. Story-first layout with cause description before ask. Volunteer cards with placeholder headshots. Think: local community foundation.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  // DEFAULT - high quality generic with variety
  var defaults = [
    'Bold minimal. Pure white body, jet black (#0a0a0a) hero section, vivid electric blue (#2563eb) accent. Giant display heading in hero. Feature cards with thin borders. Lots of breathing room. Think: top Y Combinator startup.',
    'Warm editorial. Cream (#fefcf7) background, rich espresso (#1a0f0a) text, terracotta (#c4622d) accent. Rounded cards. Generous padding. Human and approachable. Think: well-designed lifestyle brand.',
    'Clean modern. Soft blue-gray (#f8faff) background, deep navy (#0f2447) text and hero, emerald (#059669) accent. Data-forward feature cards. Trust section with stats. Think: premium B2B product.',
    'Dark hero light body. Near-black (#111827) hero with white text, pure white (#ffffff) body sections, purple (#7c3aed) accent. Alternating section backgrounds. Bold CTA banner. Think: modern SaaS landing page.'
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}


async function doRender(request) {
  try {
    const form = await request.formData();
    const html = form.get('html') || '';
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });
  } catch(e) {
    return new Response('<h2>Error</h2>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}

function succeed(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
function fail(msg) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}

const INBOX_PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard · Websprout</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f7f3;color:#16221a;line-height:1.5}
.bar{background:#0f1a0d;color:#fff;padding:14px 22px;display:flex;align-items:center;gap:10px}
.bar .logo{width:30px;height:30px;border-radius:8px;background:#2d7a3a;display:flex;align-items:center;justify-content:center;font-size:18px}
.bar b{font-size:18px;font-weight:800;letter-spacing:-.5px}
.bar b span{color:#4ade80}
.wrap{max-width:860px;margin:0 auto;padding:24px 18px 80px}
.gate{background:#fff;border:1px solid #e3ebe0;border-radius:14px;padding:24px;margin-top:24px;max-width:460px;margin-left:auto;margin-right:auto}
.gate h2{font-size:18px;margin-bottom:6px}
.gate p{color:#5a6b5c;font-size:14px;margin-bottom:16px}
label{display:block;font-size:13px;font-weight:600;color:#3a4a3c;margin:12px 0 5px}
input[type=text],input[type=email]{width:100%;padding:11px 13px;border:1px solid #cfdbcb;border-radius:9px;font-size:14px;font-family:inherit}
input:focus{outline:none;border-color:#2d7a3a}
.btn{background:#2d7a3a;color:#fff;border:none;border-radius:9px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.btn:hover{background:#256630}
.btn.ghost{background:#fff;color:#2d7a3a;border:1px solid #cfdbcb}
.btn.ghost:hover{background:#f0f7ee}
.btn.danger{background:#fff;color:#c0392b;border:1px solid #e8c4be}
.head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 8px;flex-wrap:wrap}
.head h1{font-size:22px;letter-spacing:-.5px}
.count{color:#5a6b5c;font-size:14px}
.tools{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 18px}
.notify{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:14px 16px;margin-bottom:18px;display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}
.notify .f{flex:1;min-width:220px}
.card{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:16px 18px;margin-bottom:12px}
.card .when{font-size:12px;color:#8a9a8c;margin-bottom:10px}
.row{display:flex;gap:10px;padding:6px 0;border-top:1px solid #f0f4ee;font-size:14px}
.row:first-of-type{border-top:none}
.row .k{font-weight:700;color:#2d7a3a;min-width:120px;text-transform:capitalize}
.row .v{color:#283a2b;white-space:pre-wrap;word-break:break-word}
.empty{text-align:center;color:#7a8b7c;padding:60px 20px}
.empty .big{font-size:40px;margin-bottom:10px}
.msg{padding:10px 14px;border-radius:9px;font-size:14px;margin:10px 0;display:none}
.msg.ok{background:rgba(45,122,58,.1);color:#256630;display:block}
.msg.err{background:rgba(192,57,43,.1);color:#c0392b;display:block}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:6px 0 14px}
.stat{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:15px 16px}
.stat .num{font-size:26px;font-weight:800;letter-spacing:-.5px;color:#16221a}
.stat .lbl{font-size:13px;font-weight:700;color:#2d7a3a;margin-top:2px}
.stat .sub{font-size:11px;color:#8a9a8c}
.chartcard{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:15px 18px;margin-bottom:18px}
.chartcard h3{font-size:13px;color:#3a4a3c;margin-bottom:12px;font-weight:700}
.bars{display:flex;align-items:flex-end;gap:8px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bn{font-size:11px;color:#5a6b5c;font-weight:700}
.btrack{height:70px;width:100%;max-width:30px;display:flex;align-items:flex-end}
.b{width:100%;background:linear-gradient(180deg,#4ade80,#2d7a3a);border-radius:5px 5px 0 0;min-height:3px}
.bd{font-size:10px;color:#8a9a8c}
@media(max-width:560px){.stats{grid-template-columns:repeat(2,1fr)}}
</style></head>
<body>
<div class="bar"><span class="logo">&#128202;</span><b>Web<span>sprout</span> &middot; Dashboard</b></div>
<div class="wrap">
  <div id="gate" class="gate" style="display:none">
    <h2>Open your dashboard</h2>
    <p>Enter your site ID and key. You received these when your site was generated.</p>
    <label>Site ID</label><input id="g_site" aria-label="Site ID" type="text" placeholder="ws123abc">
    <label>Key</label><input id="g_key" aria-label="API key" type="text" placeholder="your key">
    <div style="margin-top:16px"><button class="btn" onclick="openGate()">Open dashboard</button></div>
  </div>
  <div id="app" style="display:none">
    <div class="stats" id="stats"></div>
    <div class="chartcard"><h3>Visitors &middot; last 7 days</h3><div class="bars" id="chartbars"></div></div>
    <div class="notify">
      <div class="f"><label>Email me the moment a new lead comes in</label><input id="notify" aria-label="Notification email" type="email" placeholder="you@example.com"></div>
      <button class="btn" onclick="saveNotify()">Save</button>
    </div>
    <div id="nmsg" class="msg"></div>
    <div class="head"><h1>Recent leads</h1><span class="count" id="count"></span></div>
    <div class="tools">
      <button class="btn ghost" onclick="load()">Refresh</button>
      <button class="btn ghost" onclick="exportCsv()">Export CSV</button>
      <button class="btn danger" onclick="clearAll()">Clear all</button>
    </div>
    <div id="list"></div>
  </div>
</div>
<script>
var P=new URLSearchParams(location.search);
var site=P.get('site')||'';var key=P.get('key')||'';var DATA=[];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function show(id,d){document.getElementById(id).style.display=d;}
function openGate(){site=document.getElementById('g_site').value.trim();key=document.getElementById('g_key').value.trim();if(!site||!key)return;history.replaceState(null,'','/inbox?site='+encodeURIComponent(site)+'&key='+encodeURIComponent(key));show('gate','none');show('app','block');load();}
function nmsg(t,ok){var m=document.getElementById('nmsg');m.textContent=t;m.className='msg '+(ok?'ok':'err');setTimeout(function(){m.className='msg';},4000);}
function renderStats(j){
  var total=j.total||0,week=j.week||0,leads=DATA.length;
  var convTxt=total>0?(Math.round(leads/total*1000)/10)+'%':'-';
  function card(num,lbl,sub){return '<div class="stat"><div class="num">'+num+'</div><div class="lbl">'+lbl+'</div><div class="sub">'+sub+'</div></div>';}
  document.getElementById('stats').innerHTML=card(total,'Visitors','all time')+card(week,'Visitors','last 7 days')+card(leads,'Leads','all time')+card(convTxt,'Conversion','leads / visitors');
  var days=j.days||[];var max=1,i;for(i=0;i<days.length;i++){if(days[i].c>max)max=days[i].c;}
  var wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var ch='';
  for(i=0;i<days.length;i++){var c=days[i].c;var pct=Math.round(c/max*100);var ds=days[i].d;var dt=new Date(parseInt(ds.slice(0,4),10),parseInt(ds.slice(4,6),10)-1,parseInt(ds.slice(6,8),10));ch+='<div class="bcol"><div class="bn">'+c+'</div><div class="btrack"><div class="b" style="height:'+pct+'%"></div></div><div class="bd">'+wd[dt.getDay()]+'</div></div>';}
  document.getElementById('chartbars').innerHTML=ch;
}
function load(){fetch('/api/inbox?site='+encodeURIComponent(site)+'&key='+encodeURIComponent(key)).then(function(r){return r.json();}).then(function(j){
  if(j.error){show('app','none');show('gate','block');document.getElementById('g_site').value=site;nmsg(j.error,false);return;}
  DATA=j.submissions||[];document.getElementById('notify').value=j.notify||'';
  renderStats(j);
  document.getElementById('count').textContent=DATA.length+(DATA.length===1?' lead':' leads');
  var L=document.getElementById('list');
  if(!DATA.length){L.innerHTML='<div class="empty"><div class="big">&#128229;</div><p>No leads yet. When someone fills out a form on your site, it shows up here.</p></div>';return;}
  var h='';for(var i=0;i<DATA.length;i++){var s=DATA[i];var d=new Date(s.ts);h+='<div class="card"><div class="when">'+d.toLocaleString()+'</div>';
  for(var k in s.fields){h+='<div class="row"><div class="k">'+esc(k)+'</div><div class="v">'+esc(s.fields[k])+'</div></div>';}h+='</div>';}
  L.innerHTML=h;
}).catch(function(){nmsg('Could not load. Check your link and try again.',false);});}
function saveNotify(){var email=document.getElementById('notify').value.trim();fetch('/api/inbox/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,key:key,email:email})}).then(function(r){return r.json();}).then(function(j){if(j.error){nmsg(j.error,false);}else{nmsg(email?'Saved! New submissions will be emailed to '+email:'Email notifications turned off.',true);}});}
function clearAll(){if(!confirm('Delete ALL submissions for this site? This cannot be undone.'))return;fetch('/api/inbox/clear',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,key:key})}).then(function(r){return r.json();}).then(function(){load();});}
function exportCsv(){if(!DATA.length)return;var cols={};DATA.forEach(function(s){for(var k in s.fields)cols[k]=1;});var keys=Object.keys(cols);var rows=[['date'].concat(keys)];DATA.forEach(function(s){var r=[new Date(s.ts).toISOString()];keys.forEach(function(k){r.push(s.fields[k]||'');});rows.push(r);});
  var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(',');}).join('\\n');
  var b=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='websprout-submissions.csv';a.click();}
if(site&&key){show('app','block');load();}else{show('gate','block');if(site)document.getElementById('g_site').value=site;}
</script>
</body></html>`;

// ───────────────────────────────────────────────────────────
// FORM BACKEND — generated sites capture form/email submissions
// ───────────────────────────────────────────────────────────
function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function siteKey(siteId, env){
  const secret = (env && env.FORM_SECRET) || 'ws-forms-v1-shared-secret';
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode('site:' + siteId));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(sig))).replace(/[^A-Za-z0-9]/g,'').slice(0,16);
}

function formCors(){ return { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type' }; }

async function doClientLog(request, env){
  try{
    let b; try{ b = await request.json(); }catch(e){ return new Response('{}', { headers: formCors() }); }
    if(!env.KV) return new Response('{}', { headers: formCors() });
    const ip = request.headers.get('cf-connecting-ip') || '0';
    const rlKey = 'errrate:' + ip;
    const n = parseInt((await env.KV.get(rlKey))||'0',10) || 0;
    if(n > 60) return new Response('{}', { headers: formCors() });
    await env.KV.put(rlKey, String(n+1), { expirationTtl: 3600 });
    const rec = {
      ts: Date.now(),
      msg: String(b.msg||'').slice(0,400),
      src: String(b.src||'').slice(0,200),
      line: parseInt(b.line,10)||0,
      stack: String(b.stack||'').slice(0,700),
      url: String(b.url||'').slice(0,300),
      where: String(b.where||'').slice(0,30),
      build: String(b.build||'').slice(0,30),
      ua: (request.headers.get('user-agent')||'').slice(0,180)
    };
    if(!rec.msg) return new Response('{}', { headers: formCors() });
    await env.KV.put('clienterr:' + Date.now() + ':' + Math.random().toString(36).slice(2,8), JSON.stringify(rec), { expirationTtl: 30*86400 });
    return new Response('{"ok":true}', { headers: formCors() });
  }catch(e){ return new Response('{}', { headers: formCors() }); }
}

// ── Visitor analytics for published sites ──
async function doHit(request, env){
  try {
    if (!env.KV) return new Response('{}', { headers: formCors() });
    const b = await request.json().catch(function(){ return {}; });
    const site = String(b.site||'').replace(/[^a-zA-Z0-9]/g,'').slice(0,40);
    if (!site) return new Response('{}', { headers: formCors() });
    const day = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const tk = 'views:'+site+':total', dk = 'views:'+site+':'+day;
    const tv = await env.KV.get(tk); const dv = await env.KV.get(dk);
    await env.KV.put(tk, String((parseInt(tv||'0',10)||0)+1));
    await env.KV.put(dk, String((parseInt(dv||'0',10)||0)+1), { expirationTtl: 60*60*24*120 });
    return new Response('{"ok":true}', { headers: formCors() });
  } catch(e){ return new Response('{}', { headers: formCors() }); }
}
async function doViews(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const total = parseInt((await env.KV.get('views:'+site+':total'))||'0',10)||0;
    const days = []; const now = Date.now(); let week = 0, today = 0;
    for (let i=6;i>=0;i--){
      const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,'');
      const c = parseInt((await env.KV.get('views:'+site+':'+ds))||'0',10)||0;
      days.push({ d: ds, c: c }); week += c; if (i===0) today = c;
    }
    let liveSlug = ''; try { liveSlug = (await env.KV.get('slugof:'+site)) || ''; } catch(e){}
    return succeed({ total: total, today: today, week: week, days: days, live: !!liveSlug, slug: liveSlug });
  } catch(e){ return fail(e.message); }
}
function jsonR(obj, status){ return new Response(JSON.stringify(obj), { status: status||200, headers: { ...formCors(), 'Content-Type':'application/json' } }); }

async function doFormSubmit(request, env, siteId){
  try {
    if (!siteId || siteId.length < 4 || siteId.length > 40) return jsonR({ ok:false, error:'bad site' }, 400);
    if (!env.KV) return jsonR({ ok:true });
    let data = {};
    const ct = request.headers.get('content-type') || '';
    if (ct.indexOf('application/json') > -1) { data = await request.json(); }
    else { const fd = await request.formData(); fd.forEach(function(v,k){ data[k] = (typeof v === 'string') ? v : '(file)'; }); }
    if (data._ws_hp || data._gotcha) return jsonR({ ok:true }); // honeypot -> silently accept
    const fields = {}; let n = 0;
    for (const k in data){ if (String(k).charAt(0) === '_') continue; if (n++ >= 25) break; let val = data[k]; if (typeof val !== 'string') val = String(val); if (!val) continue; fields[String(k).slice(0,60)] = val.slice(0,3000); }
    if (Object.keys(fields).length === 0) return jsonR({ ok:false, error:'empty' }, 400);
    const ip = request.headers.get('cf-connecting-ip') || '0';
    const rlKey = 'frl:' + siteId + ':' + ip;
    const rl = parseInt(await env.KV.get(rlKey) || '0');
    if (rl > 40) return jsonR({ ok:false, error:'rate' }, 429);
    await env.KV.put(rlKey, String(rl + 1), { expirationTtl: 3600 });
    const ts = Date.now();
    const rec = { ts: ts, fields: fields, ua: (request.headers.get('user-agent')||'').slice(0,180), ref: (request.headers.get('referer')||'').slice(0,180) };
    await env.KV.put('form:' + siteId + ':' + ts + ':' + Math.random().toString(36).slice(2,7), JSON.stringify(rec), { expirationTtl: 60*60*24*120 });
    try { const notify = await env.KV.get('notify:' + siteId); if (notify && env.RESEND_API_KEY) await sendFormEmail(env, notify, siteId, fields); } catch(e){}
    return jsonR({ ok:true });
  } catch(e){ return jsonR({ ok:false, error:'error' }, 500); }
}

async function runWeeklyDigest(env){
  if(!env.KV || !env.RESEND_API_KEY) return;
  const seen = new Set();
  const sites = [];
  let cursor, guard = 0;
  do{
    const r = await env.KV.list({ prefix:'pubmeta:', cursor, limit:1000 });
    for(const k of r.keys){
      try{ const m = JSON.parse((await env.KV.get(k.name))||'{}'); if(m.siteId && !seen.has(m.siteId)){ seen.add(m.siteId); sites.push(m.siteId); } }catch(e){}
    }
    cursor = r.list_complete ? null : r.cursor; guard++;
  }while(cursor && guard < 5);
  const now = Date.now();
  const cutoff = now - 7*86400000;
  let sent = 0;
  for(const siteId of sites){
    if(sent >= 300) break;
    try{
      const notify = await env.KV.get('notify:'+siteId);
      if(!notify) continue;
      let weekViews = 0;
      for(let i=0;i<7;i++){ const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,''); weekViews += parseInt((await env.KV.get('views:'+siteId+':'+ds))||'0',10)||0; }
      const totalViews = parseInt((await env.KV.get('views:'+siteId+':total'))||'0',10)||0;
      let weekLeads = 0;
      try{
        const fr = await env.KV.list({ prefix:'form:'+siteId+':', limit:1000 });
        for(const fk of fr.keys){ const parts = fk.name.split(':'); const ts = parseInt(parts[2],10)||0; if(ts >= cutoff) weekLeads++; }
      }catch(e){}
      if(weekViews === 0 && weekLeads === 0) continue;
      await sendDigestEmail(env, notify, siteId, weekViews, weekLeads, totalViews);
      sent++;
    }catch(e){}
  }
}
async function sendDigestEmail(env, to, siteId, weekViews, weekLeads, totalViews){
  const inboxUrl = 'https://websprout.app/inbox?site=' + encodeURIComponent(siteId);
  const leadLine = weekLeads > 0
    ? ('<p style="margin:0 0 6px;font-size:15px;color:#0f1a0d"><b>' + weekLeads + '</b> new ' + (weekLeads===1?'lead':'leads') + ' this week \u2014 don\u2019t leave them waiting.</p>')
    : '<p style="margin:0 0 6px;font-size:15px;color:#555">No new leads this week \u2014 a quick share of your link can help.</p>';
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto">'
    + '<div style="background:#0f1a0d;padding:20px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">\uD83C\uDF31 Your week on Websprout</span></div>'
    + '<div style="padding:24px">'
    + '<p style="color:#555;margin:0 0 16px">Here is how your website did over the last 7 days:</p>'
    + '<div style="display:flex;gap:12px;margin-bottom:16px">'
    + '<div style="flex:1;background:#f4f8f3;border-radius:10px;padding:14px;text-align:center"><div style="font-size:26px;font-weight:800;color:#0f1a0d">' + weekViews + '</div><div style="font-size:12px;color:#777">views this week</div></div>'
    + '<div style="flex:1;background:#f4f8f3;border-radius:10px;padding:14px;text-align:center"><div style="font-size:26px;font-weight:800;color:#1a7a32">' + weekLeads + '</div><div style="font-size:12px;color:#777">new leads</div></div>'
    + '</div>'
    + leadLine
    + '<p style="margin:0 0 22px;font-size:13px;color:#999">' + totalViews + ' total views all-time</p>'
    + '<p style="margin:0"><a href="' + inboxUrl + '" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">View your leads</a></p>'
    + '</div></div>';
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'\uD83C\uDF31 Your website got ' + weekViews + ' views this week', html: html }) });
}
async function sendFormEmail(env, to, siteId, fields){
  let rows = '';
  for (const k in fields){ rows += '<tr><td style="padding:7px 12px;font-weight:600;color:#0f1a0d;border-bottom:1px solid #eee;vertical-align:top">' + escHtml(k) + '</td><td style="padding:7px 12px;color:#333;border-bottom:1px solid #eee">' + escHtml(fields[k]).replace(/\n/g,'<br>') + '</td></tr>'; }
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto"><div style="background:#0f1a0d;padding:20px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">🌱 New form submission</span></div><div style="padding:24px"><p style="color:#555;margin:0 0 14px">Someone just submitted a form on your website:</p><table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #eee;border-radius:8px;overflow:hidden">' + rows + '</table><p style="margin:20px 0 0"><a href="https://websprout.app/inbox?site=' + siteId + '" style="color:#2d7a3a;font-weight:700;text-decoration:none">View all submissions in your inbox →</a></p></div></div>';
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'🌱 New submission from your website', html: html }) });
}

async function sendReviewEmail(env, to, siteId, siteName, rev){
  let stars=''; const full=(rev&&rev.rating)||5; for(let i=0;i<5;i++) stars += (i<full?'\u2605':'\u2606');
  const safeName = escHtml((rev&&rev.name)||'A visitor');
  const safeText = escHtml(((rev&&rev.text)||'').slice(0,600)).replace(/\n/g,'<br>');
  const title = siteName ? escHtml(siteName) : 'your website';
  const url = 'https://websprout.app/reviews?site=' + encodeURIComponent(siteId);
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto">'
    + '<div style="background:#0f1a0d;padding:20px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">\u2B50 New review waiting</span></div>'
    + '<div style="padding:24px">'
    + '<p style="color:#555;margin:0 0 14px">Someone left a review on ' + title + '. It is waiting for your approval \u2014 nothing appears on your site until you say so:</p>'
    + '<div style="background:#f4f8f3;border-radius:10px;padding:16px;margin-bottom:18px">'
    + '<div style="font-size:18px;color:#f5a623;letter-spacing:3px;margin-bottom:6px">' + stars + '</div>'
    + '<div style="font-weight:700;color:#0f1a0d;margin-bottom:6px">' + safeName + '</div>'
    + '<div style="color:#333;font-size:14px;line-height:1.5">' + safeText + '</div>'
    + '</div>'
    + '<p style="margin:0"><a href="' + url + '" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Review &amp; approve \u2192</a></p>'
    + '<p style="margin:18px 0 0;font-size:12px;color:#999">Approve it to publish it, or reject it \u2014 your call.</p>'
    + '</div></div>';
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'\u2B50 New review waiting for your approval', html: html }) });
}
function isRealEmail(e){
  if(!e) return false;
  e=String(e).toLowerCase().trim();
  const at=e.indexOf('@');
  if(at<1 || e.indexOf(' ')>-1 || e.indexOf('[')>-1 || e.indexOf(']')>-1) return false;
  if(!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(e)) return false;
  const dom=e.slice(at+1);
  if(dom==='email.com'||dom==='example.com'||dom==='domain.com'||dom==='yourdomain.com'||dom==='yoursite.com'||dom==='website.com') return false;
  if(e.indexOf('your@')>-1||e.indexOf('youremail')>-1||e.indexOf('yourname')>-1) return false;
  return true;
}
function extractContactEmail(html){
  if(!html) return '';
  try{
    let m; const re=/mailto:([^"'?>\s]+)/gi;
    while((m=re.exec(html))){ let e=m[1]||''; try{ e=decodeURIComponent(e); }catch(_){ } if(isRealEmail(e)) return String(e).toLowerCase().trim(); }
    const re2=/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g;
    while((m=re2.exec(html))){ if(isRealEmail(m[0])) return String(m[0]).toLowerCase().trim(); }
  }catch(e){}
  return '';
}
function extractTitle(html){
  if(!html) return '';
  try{ const i=html.indexOf('<title>'), j=html.indexOf('</title>'); if(i>-1&&j>i) return html.slice(i+7,j).trim().slice(0,60); }catch(e){}
  return '';
}

async function doConnectStart(request, env){
  const s = await getSession(request, env);
  if(!s) return Response.redirect(SITE_ORIGIN+'/?connect=signin',302);
  const sk = (env.STRIPE_SECRET_KEY||'').trim();
  if(!sk) return Response.redirect(SITE_ORIGIN+'/?connect=error',302);
  const email = (s.email||'').toLowerCase();
  let u=null; try{ u=JSON.parse(await env.KV.get('user:'+email)||'null'); }catch(e){}
  if(!u) return Response.redirect(SITE_ORIGIN+'/?connect=error',302);
  try{
    let acct = u.stripeConnect||'';
    if(!acct){
      const ar = await fetch('https://api.stripe.com/v1/accounts', { method:'POST', headers:{ 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' }, body:'type=express&email='+encodeURIComponent(email) });
      const aj = await ar.json();
      if(!ar.ok || aj.error || !aj.id) return Response.redirect(SITE_ORIGIN+'/?connect=error',302);
      acct = aj.id;
      u.stripeConnect = acct; u.stripeConnectReady = false;
      await env.KV.put('user:'+email, JSON.stringify(u));
    }
    const lr = await fetch('https://api.stripe.com/v1/account_links', { method:'POST', headers:{ 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' }, body:'account='+encodeURIComponent(acct)+'&refresh_url='+encodeURIComponent(SITE_ORIGIN+'/connect/start')+'&return_url='+encodeURIComponent(SITE_ORIGIN+'/connect/return')+'&type=account_onboarding' });
    const lj = await lr.json();
    if(!lr.ok || lj.error || !lj.url) return Response.redirect(SITE_ORIGIN+'/?connect=error',302);
    return Response.redirect(lj.url, 302);
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?connect=error',302); }
}
async function doConnectReturn(request, env){
  const s = await getSession(request, env);
  if(!s) return Response.redirect(SITE_ORIGIN+'/?connect=signin',302);
  const sk = (env.STRIPE_SECRET_KEY||'').trim();
  const email = (s.email||'').toLowerCase();
  let u=null; try{ u=JSON.parse(await env.KV.get('user:'+email)||'null'); }catch(e){}
  let ready=false;
  try{
    if(sk && u && u.stripeConnect){
      const ar = await fetch('https://api.stripe.com/v1/accounts/'+encodeURIComponent(u.stripeConnect), { headers:{ 'Authorization':'Bearer '+sk } });
      const aj = await ar.json();
      if(ar.ok && aj && aj.charges_enabled) ready=true;
      u.stripeConnectReady = ready;
      await env.KV.put('user:'+email, JSON.stringify(u));
    }
  }catch(e){}
  return Response.redirect(SITE_ORIGIN+'/?connect='+(ready?'ok':'pending'),302);
}
async function doInvoice(request, env){
  const s = await getSession(request, env);
  if(!s) return fail('Please sign in.');
  const ownerEmail = (s.email||'').toLowerCase();
  const sk = (env.STRIPE_SECRET_KEY||'').trim();
  if(!sk) return fail('Invoicing isn\u2019t configured yet.');
  const isOwner = ownerEmail === SUPPORT_EMAIL.toLowerCase();
  let u=null; try{ u=JSON.parse(await env.KV.get('user:'+ownerEmail)||'null'); }catch(e){}
  const isPro = isOwner || (u && u.plan==='pro');
  if(!isPro) return fail('Invoicing is a Pro feature \u2014 go Pro to unlock it.');
  // Account routing: the owner bills on the platform account; everyone else bills on THEIR OWN
  // connected Stripe account (via Stripe Connect) so client payments go to them, never the platform.
  let stripeAccount = '';
  if(!isOwner){
    if(!(u && u.stripeConnect && u.stripeConnectReady)) return fail('Connect your Stripe account first so payments go to you.');
    stripeAccount = u.stripeConnect;
  }
  let body; try{ body=await request.json(); }catch(e){ return fail('Invalid request'); }
  const amount = Math.round(parseFloat(body.amount||'0')*100);
  if(!amount || amount<50) return fail('Enter an amount of at least $0.50.');
  // Websprout platform fee: 1% per invoice, $0.50 floor, $5.00 cap. Applied only to connected-account
  // (non-owner) invoices, which are direct charges - the fee transfers to the platform automatically.
  let appFee = 0;
  if(stripeAccount){
    appFee = Math.round(amount * 0.01);
    if(appFee < 50) appFee = 50;
    if(appFee > 500) appFee = 500;
    if(appFee > amount - 1) appFee = amount - 1;
    if(appFee < 0) appFee = 0;
  }
  const desc = (String(body.desc||'Invoice').slice(0,200).trim()) || 'Invoice';
  const clientEmail = String(body.email||'').trim().slice(0,120);
  const currency = (String(body.currency||'usd').toLowerCase().replace(/[^a-z]/g,'').slice(0,3)) || 'usd';
  const sHeaders = { 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' };
  if(stripeAccount) sHeaders['Stripe-Account'] = stripeAccount;
  try{
    const pr = await fetch('https://api.stripe.com/v1/prices', { method:'POST', headers:sHeaders, body:'unit_amount='+amount+'&currency='+encodeURIComponent(currency)+'&product_data[name]='+encodeURIComponent(desc) });
    const prj = await pr.json();
    if(!pr.ok || prj.error) return fail('Stripe: '+((prj.error&&prj.error.message)||'could not create price'));
    const plBody = 'line_items[0][price]='+encodeURIComponent(prj.id)+'&line_items[0][quantity]=1' + (appFee>0 ? ('&application_fee_amount='+appFee) : '');
    const pl = await fetch('https://api.stripe.com/v1/payment_links', { method:'POST', headers:sHeaders, body:plBody });
    const plj = await pl.json();
    if(!pl.ok || plj.error || !plj.url) return fail('Stripe: '+((plj.error&&plj.error.message)||'could not create payment link'));
    const url = plj.url;
    try{ if(env.KV) await env.KV.put('invoice:'+ownerEmail+':'+Date.now()+':'+Math.random().toString(36).slice(2,7), JSON.stringify({ ts:Date.now(), amount:amount, fee:appFee, currency:currency, desc:desc, clientEmail:clientEmail, url:url }), { expirationTtl: 365*86400 }); }catch(e){}
    let emailed=false;
    if(clientEmail && env.RESEND_API_KEY){ try{ await sendInvoiceEmail(env, clientEmail, s.email, desc, amount, currency, url); emailed=true; }catch(e){} }
    return succeed({ url:url, emailed:emailed, fee:appFee });
  }catch(e){ return fail('Could not create the invoice. Please try again.'); }
}
async function sendInvoiceEmail(env, to, fromOwner, desc, amount, currency, url){
  const amt = (amount/100).toFixed(2);
  const cur = currency.toUpperCase();
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto"><div style="background:#0f1a0d;padding:20px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">Invoice</span></div><div style="padding:24px"><p style="color:#555;margin:0 0 6px">' + escHtml(desc) + '</p><p style="font-size:28px;font-weight:800;color:#0f1a0d;margin:0 0 18px">' + cur + ' ' + amt + '</p><p style="margin:0 0 22px"><a href="' + url + '" style="display:inline-block;background:#16a34a;color:#fff;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700">Pay now</a></p><p style="color:#999;font-size:12px;margin:0">Sent via Websprout on behalf of ' + escHtml(fromOwner) + '. Reply to this email to reach them directly.</p></div></div>';
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout Invoices <hello@websprout.app>', to:[to], reply_to:fromOwner, subject:'Invoice: '+desc+' ('+cur+' '+amt+')', html:html }) });
}

async function doInboxData(request, env){
  try {
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const list = await env.KV.list({ prefix: 'form:' + site + ':' });
    const names = list.keys.map(function(k){ return k.name; }).sort().reverse().slice(0,200);
    const subs = [];
    for (const nm of names){ const v = await env.KV.get(nm); if (v){ try { const o = JSON.parse(v); o._k = nm; subs.push(o); } catch(e){} } }
    const notify = await env.KV.get('notify:' + site) || '';
    const total = parseInt((await env.KV.get('views:'+site+':total'))||'0',10)||0;
    const days = []; const now = Date.now(); let week = 0, today = 0;
    for (let i=6;i>=0;i--){ const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,''); const c = parseInt((await env.KV.get('views:'+site+':'+ds))||'0',10)||0; days.push({ d: ds, c: c }); week += c; if (i===0) today = c; }
    return succeed({ submissions: subs, notify: notify, count: subs.length, total: total, today: today, week: week, days: days });
  } catch(e){ return fail(e.message); }
}

async function doInboxNotify(request, env){
  try {
    const b = await request.json();
    if (!b.site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const email = (b.email || '').trim().slice(0,120);
    if (email) await env.KV.put('notify:' + b.site, email); else await env.KV.delete('notify:' + b.site);
    return succeed({ ok:true, notify: email });
  } catch(e){ return fail(e.message); }
}

async function doInboxClear(request, env){
  try {
    const b = await request.json();
    if (!b.site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const list = await env.KV.list({ prefix: 'form:' + b.site + ':' });
    for (const k of list.keys){ await env.KV.delete(k.name); }
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

// Injected into every generated site: auto-wires all <form>s to the inbox.
async function rebuildReviewsPub(env, siteId){
  if(!env || !env.KV || !siteId) return;
  const out=[];
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'review:'+siteId+':', cursor:cur, limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); if(o && o.status==='approved'){ out.push({ name:o.name||'', rating:o.rating||5, text:o.text||'', ts:o.ts||0 }); } }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<10); }catch(e){}
  out.sort(function(a,b){return (b.ts||0)-(a.ts||0);});
  try{ await env.KV.put('reviewsPub:'+siteId, JSON.stringify(out.slice(0,60))); }catch(e){}
}
async function doReviewSubmit(request, env){
  try{
    let b; try{ b = await request.json(); }catch(e){ return jsonR({ ok:false, error:'bad' }, 400); }
    const siteId = String(b.site||'').slice(0,40).trim();
    if(!siteId || siteId.length < 4) return jsonR({ ok:false, error:'bad site' }, 400);
    if(b._ws_hp) return jsonR({ ok:true });
    if(!env.KV) return jsonR({ ok:true });
    let rating = parseInt(b.rating,10); if(!(rating>=1 && rating<=5)) rating=5;
    const name = String(b.name||'').slice(0,80).trim();
    const text = String(b.text||'').slice(0,1500).trim();
    if(text.length < 2) return jsonR({ ok:false, error:'empty' }, 400);
    const ip = request.headers.get('cf-connecting-ip') || '0';
    const rlKey = 'rrl:' + siteId + ':' + ip;
    const rl = parseInt(await env.KV.get(rlKey) || '0', 10) || 0;
    if(rl > 15) return jsonR({ ok:false, error:'rate' }, 429);
    await env.KV.put(rlKey, String(rl+1), { expirationTtl: 3600 });
    const id = Date.now() + ':' + Math.random().toString(36).slice(2,8);
    await env.KV.put('review:'+siteId+':'+id, JSON.stringify({ id, name, rating, text, ts:Date.now(), status:'pending', source:'visitor' }), { expirationTtl: 400*86400 });
    // Best-effort: email the owner that a review is waiting (throttled per site so a flood can't spam them)
    try{
      if(env.RESEND_API_KEY){
        const tk='revnotify:'+siteId;
        if(!(await env.KV.get(tk))){
          let to='', siteName='';
          try{ const slug=await env.KV.get('slugof:'+siteId); if(slug){ const ph=await env.KV.get('pub:'+slug); to=extractContactEmail(ph); siteName=extractTitle(ph); } }catch(e){}
          if(!to){ try{ to=(await env.KV.get('notify:'+siteId))||''; }catch(e){} }
          if(to){ await env.KV.put(tk, '1', { expirationTtl: 900 }); try{ await sendReviewEmail(env, to, siteId, siteName, { name:name, rating:rating, text:text }); }catch(e){} }
        }
      }
    }catch(e){}
    return jsonR({ ok:true });
  }catch(e){ return jsonR({ ok:false, error:'error' }, 500); }
}
async function doReviewsGet(url, env){
  const siteId = String((url.searchParams.get('site')||'')).slice(0,40).trim();
  if(!siteId || !env.KV) return jsonR({ reviews:[] });
  let reviews=[]; try{ const raw=await env.KV.get('reviewsPub:'+siteId); if(raw) reviews=JSON.parse(raw)||[]; }catch(e){}
  return jsonR({ reviews });
}
function reviewScript(siteId){
  const sub = 'https://websprout.app/api/review';
  const get = 'https://websprout.app/api/reviews?site=' + encodeURIComponent(siteId);
  return '<scr'+'ipt id="_wsReviews">(function(){'
  +'var MOUNT=document.querySelector("[data-ws-reviews]");if(!MOUNT)return;'
  +'var SITE="'+siteId+'";var SUB="'+sub+'";var GET="'+get+'";'
  +'function el(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;}'
  +'function starRow(n,size){var w=el("div","letter-spacing:2px;font-size:"+(size||15)+"px;line-height:1");for(var i=0;i<5;i++){var s=el("span",null,"\\u2605");s.style.color=(i<n?"#f5b301":"rgba(127,127,127,.35)");w.appendChild(s);}return w;}'
  +'function card(r){var c=el("div","background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.16);border-radius:12px;padding:18px;text-align:left");c.appendChild(starRow(r.rating|0,15));c.appendChild(el("div","font-size:15px;line-height:1.6;opacity:.9;margin:10px 0",r.text||""));c.appendChild(el("div","font-weight:700;font-size:14px",(r.name&&String(r.name).trim())?r.name:"Verified customer"));return c;}'
  +'function render(list){MOUNT.innerHTML="";var wrap=el("div","font-family:inherit;color:inherit");'
  +'if(list&&list.length){var grid=el("div","display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:22px");for(var i=0;i<list.length;i++){grid.appendChild(card(list[i]));}wrap.appendChild(grid);}'
  +'else{wrap.appendChild(el("div","opacity:.6;font-size:15px;margin-bottom:20px","No reviews yet \\u2014 be the first to share your experience."));}'
  +'var cta=el("div","text-align:center");var btn=el("button","font-family:inherit;font-size:15px;font-weight:700;padding:11px 22px;border-radius:10px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;opacity:.85","Leave a review");btn.type="button";cta.appendChild(btn);wrap.appendChild(cta);MOUNT.appendChild(wrap);'
  +'btn.addEventListener("click",function(){showForm();});}'
  +'function showForm(){MOUNT.innerHTML="";var sel=0;'
  +'var f=el("div","max-width:520px;margin:0 auto;text-align:left;background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.16);border-radius:12px;padding:20px");'
  +'f.appendChild(el("div","font-weight:700;margin-bottom:12px;font-size:16px","Leave a review"));'
  +'var pick=el("div","font-size:30px;letter-spacing:6px;margin-bottom:14px;cursor:pointer;user-select:none;line-height:1");'
  +'function paint(){pick.innerHTML="";for(var i=0;i<5;i++){var s=el("span",null,"\\u2605");s.style.color=(i<sel?"#f5b301":"rgba(127,127,127,.4)");s.setAttribute("data-i",String(i));pick.appendChild(s);}}paint();'
  +'pick.addEventListener("click",function(e){var t=e.target;if(t&&t.getAttribute("data-i")!=null){sel=(parseInt(t.getAttribute("data-i"),10)|0)+1;paint();}});f.appendChild(pick);'
  +'var nm=el("input","width:100%;font-family:inherit;font-size:15px;padding:11px 12px;margin-bottom:10px;border-radius:9px;border:1px solid rgba(127,127,127,.3);background:rgba(127,127,127,.06);color:inherit;box-sizing:border-box");nm.placeholder="Your name";f.appendChild(nm);'
  +'var tx=el("textarea","width:100%;font-family:inherit;font-size:15px;padding:11px 12px;margin-bottom:12px;border-radius:9px;border:1px solid rgba(127,127,127,.3);background:rgba(127,127,127,.06);color:inherit;box-sizing:border-box;resize:vertical");tx.rows=4;tx.placeholder="Tell others about your experience";f.appendChild(tx);'
  +'var send=el("button","font-family:inherit;font-size:15px;font-weight:700;padding:11px 24px;border-radius:10px;border:none;background:#2d7a3a;color:#fff;cursor:pointer","Submit review");send.type="button";f.appendChild(send);MOUNT.appendChild(f);'
  +'send.addEventListener("click",function(){var text=(tx.value||"").trim();if(text.length<2){alert("Please write a short review.");return;}if(!sel)sel=5;send.disabled=true;send.textContent="Sending...";'
  +'fetch(SUB,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:SITE,name:nm.value||"",rating:sel,text:text})}).then(function(r){return r.json();}).then(function(j){'
  +'if(j&&(j.ok||j.success)){f.innerHTML="";f.appendChild(el("div","padding:18px;text-align:center;font-weight:600;color:#2d7a3a","Thank you! Your review has been submitted and will appear once approved."));}'
  +'else{send.disabled=false;send.textContent="Submit review";alert("Sorry, something went wrong. Please try again.");}'
  +'}).catch(function(){send.disabled=false;send.textContent="Submit review";alert("Could not submit right now. Please try again.");});});}'
  +'fetch(GET).then(function(r){return r.json();}).then(function(j){render((j&&j.reviews)||[]);}).catch(function(){render([]);});'
  +'})();</scr'+'ipt>';
}
function withReviews(html, siteId){
  if (!html || html.indexOf('_wsReviews') > -1) return html;
  if (html.indexOf('data-ws-reviews') === -1) return html;
  const s = reviewScript(siteId);
  const bi = html.lastIndexOf('</body>');
  return bi > -1 ? html.slice(0,bi) + s + html.slice(bi) : html + s;
}

async function ownsSite(s, env, siteId){
  if(!s || !s.email || !siteId || !env || !env.KV) return false;
  const em = s.email.toLowerCase();
  if(em === SUPPORT_EMAIL.toLowerCase()) return true;
  try{ const owner = (await env.KV.get('notify:'+siteId) || '').toLowerCase(); return !!owner && owner === em; }catch(e){ return false; }
}
async function listAllReviews(env, siteId){
  const out=[];
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'review:'+siteId+':', cursor:cur, limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); if(o && o.id) out.push({ id:o.id, name:o.name||'', rating:o.rating||5, text:o.text||'', ts:o.ts||0, status:o.status||'pending', source:o.source||'visitor' }); }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  out.sort(function(a,b){ var ap=(a.status==='pending'), bp=(b.status==='pending'); if(ap!==bp) return ap?-1:1; return (b.ts||0)-(a.ts||0); });
  return out;
}
async function doReviewsManage(request, env){
  const s = await getSession(request, env);
  const url = new URL(request.url);
  if(request.method === 'GET'){
    const siteId = String(url.searchParams.get('site')||'').slice(0,40).trim();
    if(!siteId) return jsonR({ ok:false, owner:false, error:'no site' }, 400);
    if(!(await ownsSite(s, env, siteId))) return jsonR({ ok:false, owner:false, error:'not authorized' }, 403);
    return jsonR({ ok:true, owner:true, reviews: await listAllReviews(env, siteId) });
  }
  let b; try{ b = await request.json(); }catch(e){ return jsonR({ ok:false, error:'bad' }, 400); }
  const siteId = String(b.site||'').slice(0,40).trim();
  if(!(await ownsSite(s, env, siteId))) return jsonR({ ok:false, owner:false, error:'not authorized' }, 403);
  const action = String(b.action||'');
  if(action === 'add'){
    let rating = parseInt(b.rating,10); if(!(rating>=1 && rating<=5)) rating=5;
    const name = String(b.name||'').slice(0,80).trim();
    const text = String(b.text||'').slice(0,1500).trim();
    if(text.length < 1) return jsonR({ ok:false, error:'empty' }, 400);
    const id = Date.now() + ':' + Math.random().toString(36).slice(2,8);
    await env.KV.put('review:'+siteId+':'+id, JSON.stringify({ id, name, rating, text, ts:Date.now(), status:'approved', source:'owner' }), { expirationTtl: 400*86400 });
  } else if(action === 'approve' || action === 'delete'){
    const id = String(b.id||''); if(!id) return jsonR({ ok:false, error:'no id' }, 400);
    const key = 'review:'+siteId+':'+id;
    if(action === 'delete'){ try{ await env.KV.delete(key); }catch(e){} }
    else { try{ const o=JSON.parse(await env.KV.get(key)||'{}'); if(o && o.id){ o.status='approved'; await env.KV.put(key, JSON.stringify(o), { expirationTtl: 400*86400 }); } }catch(e){} }
  } else { return jsonR({ ok:false, error:'bad action' }, 400); }
  await rebuildReviewsPub(env, siteId);
  return jsonR({ ok:true, owner:true, reviews: await listAllReviews(env, siteId) });
}
async function doReviewsPage(request, env){
  return new Response(REVIEWS_PAGE, { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
}
const REVIEWS_PAGE = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Manage reviews &middot; Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#070d06;color:#eaf2e8;padding:24px;max-width:820px;margin:0 auto}
h1{font-size:22px;font-weight:800}
.sub{color:rgba(234,242,232,.5);font-size:13px;margin-top:2px}
.top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.rl{font-size:13px;color:rgba(234,242,232,.55);cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;background:none;font-family:inherit}
.rl:hover{background:rgba(255,255,255,.06)}
h2{font-size:14px;font-weight:700;margin:24px 0 10px;display:flex;align-items:center;gap:8px}
.pill{font-size:11px;font-weight:700;background:rgba(245,179,1,.16);color:#f5b301;border:1px solid rgba(245,179,1,.35);border-radius:999px;padding:2px 9px}
.card{background:#0f1a0d;border:1px solid rgba(45,122,58,.22);border-radius:14px;padding:16px;margin-bottom:12px}
.stars{font-size:16px;letter-spacing:2px;line-height:1}
.st-on{color:#f5b301}.st-off{color:rgba(127,127,127,.4)}
.rtext{font-size:14.5px;line-height:1.6;opacity:.92;margin:9px 0}
.rmeta{font-size:12.5px;color:rgba(234,242,232,.5);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.rname{font-weight:700;color:#eaf2e8;opacity:1}
.src{font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.72)}
.src.owner{background:rgba(45,122,58,.2);color:#7fe39a}
.acts{margin-top:12px;display:flex;gap:8px}
.btn{font-family:inherit;font-size:13px;font-weight:700;padding:8px 16px;border-radius:9px;border:none;cursor:pointer}
.ok{background:#2d7a3a;color:#fff}.ok:hover{background:#349244}
.del{background:rgba(255,255,255,.07);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.13)}.del:hover{background:rgba(248,113,113,.14);color:#fca5a5;border-color:rgba(248,113,113,.3)}
.add{background:#0f1a0d;border:1px solid rgba(45,122,58,.22);border-radius:14px;padding:18px;margin-bottom:8px}
.add input,.add textarea{width:100%;font-family:inherit;font-size:14px;padding:11px 12px;margin-bottom:10px;border-radius:9px;border:1px solid rgba(45,122,58,.3);background:#060d05;color:#fff;outline:none}
.add textarea{resize:vertical}
.pickr{font-size:28px;letter-spacing:5px;cursor:pointer;user-select:none;margin-bottom:12px;line-height:1}
.muted{color:rgba(234,242,232,.4)}.empty{color:rgba(234,242,232,.4);font-size:14px;padding:14px 2px}
.err{color:#fca5a5;text-align:center;padding:40px 16px;line-height:1.6}
a{color:#4ade80;text-decoration:none}
</style></head><body>
<div class="top"><div><h1>&#11088; Reviews</h1><div class="sub" id="sub">Loading&hellip;</div></div><button class="rl" id="refresh">&#8635; Refresh</button></div>
<div id="main" style="display:none">
  <div class="add">
    <div style="font-weight:700;margin-bottom:12px;font-size:15px">Add a review</div>
    <div style="font-size:12px;color:rgba(234,242,232,.5);margin-bottom:10px">Add a real review you collected elsewhere, or a placeholder to get started. These appear on your site right away.</div>
    <div class="pickr" id="addStars"></div>
    <input id="addName" aria-label="Reviewer name" placeholder="Name (e.g. Sarah M.)" maxlength="80">
    <textarea id="addText" aria-label="Review text" rows="3" placeholder="What did they say?" maxlength="1500"></textarea>
    <button class="btn ok" id="addBtn">Add review</button>
  </div>
  <h2>Pending approval <span class="pill" id="pendCount" style="display:none">0</span></h2>
  <div id="pending"></div>
  <h2>Published on your site</h2>
  <div id="published"></div>
</div>
<div id="denied" class="err" style="display:none"></div>
<script>
var SITE = new URLSearchParams(location.search).get('site') || '';
function qs(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function starsHtml(n){n=Math.max(0,Math.min(5,n|0));var o='';for(var i=0;i<5;i++){o+='<span class="'+(i<n?'st-on':'st-off')+'">\\u2605</span>';}return o;}
var addSel=5;
function paintAdd(){var p=qs('addStars');var o='';for(var i=0;i<5;i++){o+='<span data-i="'+i+'" class="'+(i<addSel?'st-on':'st-off')+'">\\u2605</span>';}p.innerHTML=o;}
function rcard(r,pending){
  var src=(r.source==='owner')?'<span class="src owner">Added by you</span>':'<span class="src">Visitor</span>';
  var acts=pending
    ? '<div class="acts"><button class="btn ok" data-act="approve" data-id="'+esc(r.id)+'">Approve</button><button class="btn del" data-act="delete" data-id="'+esc(r.id)+'">Reject</button></div>'
    : '<div class="acts"><button class="btn del" data-act="delete" data-id="'+esc(r.id)+'">Remove</button></div>';
  return '<div class="card"><div class="stars">'+starsHtml(r.rating)+'</div><div class="rtext">'+esc(r.text)+'</div><div class="rmeta"><span class="rname">'+(esc(r.name)||'Anonymous')+'</span>'+src+'<span>'+dt(r.ts)+'</span></div>'+acts+'</div>';
}
function render(list){
  var pend=[],pub=[];
  for(var i=0;i<list.length;i++){ if(list[i].status==='pending') pend.push(list[i]); else pub.push(list[i]); }
  var pc=qs('pendCount'); if(pend.length){pc.style.display='inline-block';pc.textContent=pend.length;} else {pc.style.display='none';}
  qs('pending').innerHTML = pend.length ? pend.map(function(r){return rcard(r,true);}).join('') : '<div class="empty">No reviews waiting. New visitor reviews show up here for you to approve.</div>';
  qs('published').innerHTML = pub.length ? pub.map(function(r){return rcard(r,false);}).join('') : '<div class="empty">Nothing published yet. Approve a pending review or add one above.</div>';
}
function act(action,id){
  fetch('/api/reviews/manage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:SITE,action:action,id:id})}).then(function(r){return r.json();}).then(function(j){ if(j&&j.reviews) render(j.reviews); }).catch(function(){alert('Something went wrong. Try again.');});
}
function load(){
  if(!SITE){ qs('denied').style.display='block'; qs('denied').innerHTML='No site specified. Open this from the publish panel in your studio.'; return; }
  fetch('/api/reviews/manage?site='+encodeURIComponent(SITE)).then(function(r){return r.json();}).then(function(j){
    if(!j||!j.ok||j.owner===false){ qs('denied').style.display='block'; qs('denied').innerHTML='You need to be signed in as the owner of this site to manage its reviews.<br><br><a href="https://websprout.app">Go to Websprout</a>'; return; }
    qs('main').style.display='block';
    qs('sub').innerHTML='Approve what visitors leave, or add your own &middot; <a href="https://'+esc(SITE)+'.websprout.app" target="_blank">view site</a>';
    render(j.reviews||[]);
  }).catch(function(){ qs('denied').style.display='block'; qs('denied').textContent='Could not load reviews. Please refresh.'; });
}
qs('addStars').addEventListener('click',function(e){var t=e.target;if(t&&t.getAttribute('data-i')!=null){addSel=(parseInt(t.getAttribute('data-i'),10)|0)+1;paintAdd();}});
qs('addBtn').addEventListener('click',function(){
  var text=(qs('addText').value||'').trim(); if(text.length<1){alert('Write the review text first.');return;}
  var btn=qs('addBtn');btn.disabled=true;btn.textContent='Adding...';
  fetch('/api/reviews/manage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:SITE,action:'add',name:qs('addName').value||'',rating:addSel,text:text})}).then(function(r){return r.json();}).then(function(j){
    btn.disabled=false;btn.textContent='Add review';
    if(j&&j.reviews){ qs('addName').value='';qs('addText').value='';addSel=5;paintAdd();render(j.reviews); } else { alert('Could not add. Try again.'); }
  }).catch(function(){btn.disabled=false;btn.textContent='Add review';alert('Could not add. Try again.');});
});
document.addEventListener('click',function(e){var b=e.target;if(b&&b.getAttribute&&b.getAttribute('data-act')){act(b.getAttribute('data-act'),b.getAttribute('data-id'));}});
qs('refresh').addEventListener('click',load);
paintAdd(); load();
</script></body></html>`;

function formScript(siteId){
  const ep = 'https://websprout.app/api/form/' + siteId;
  return '<scr'+'ipt id="_wsForms">(function(){'
  +'var EP="' + ep + '";'
  +'function wire(f){if(f.getAttribute("data-ws")==="1")return;f.setAttribute("data-ws","1");'
  +'if(!f.querySelector("[name=_ws_hp]")){var h=document.createElement("input");h.type="text";h.name="_ws_hp";h.tabIndex=-1;h.setAttribute("autocomplete","off");h.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;opacity:0";f.appendChild(h);}'
  +'f.addEventListener("submit",function(e){e.preventDefault();var d={};var els=f.querySelectorAll("input,textarea,select");for(var i=0;i<els.length;i++){var el=els[i];if(!el.name)continue;var t=(el.type||"").toLowerCase();if(t==="checkbox"||t==="radio"){if(!el.checked)continue;}if(t==="file"||t==="submit"||t==="button")continue;d[el.name]=el.value;}'
  +'var btn=f.querySelector("[type=submit],button");var bt="";if(btn){bt=btn.textContent;btn.disabled=true;btn.textContent="Sending...";}'
  +'fetch(EP,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(function(r){return r.json();}).then(function(j){'
  +'if(j&&j.ok){var m=document.createElement("div");m.setAttribute("style","padding:16px 18px;margin:8px 0;border-radius:10px;background:rgba(45,122,58,.12);color:#2d7a3a;font-weight:600;text-align:center;font-family:inherit");m.textContent="Thanks! Your message has been received.";f.parentNode.replaceChild(m,f);}'
  +'else{if(btn){btn.disabled=false;btn.textContent=bt;}alert("Sorry, something went wrong. Please try again.");}'
  +'}).catch(function(){if(btn){btn.disabled=false;btn.textContent=bt;}alert("Could not send right now. Please try again.");});'
  +'});}'
  +'function callbar(){try{if(window.self!==window.top)return;if(window.innerWidth>640)return;if(document.getElementById("_wsCall"))return;var mt=document.querySelector("meta[name=ws-callbar]");if(!mt||mt.getAttribute("content")!=="on")return;if(sessionStorage.getItem("_wsCallX"))return;var ls=document.getElementsByTagName("a");var t=null;for(var i=0;i<ls.length;i++){var hh=ls[i].getAttribute("href")||"";if(hh.indexOf("tel:")===0){t=ls[i];break;}}if(!t)return;var bar=document.createElement("a");bar.id="_wsCall";bar.href=t.getAttribute("href");bar.setAttribute("style","position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;justify-content:center;gap:8px;padding:15px 16px;background:#16a34a;color:#fff;font-weight:700;font-size:16px;letter-spacing:.01em;text-decoration:none;font-family:inherit;box-shadow:0 -2px 14px rgba(0,0,0,.2)");bar.textContent="\u260E  Call now";document.body.appendChild(bar);document.body.style.paddingBottom="74px";}catch(e){}}'
  +'function init(){var fs=document.querySelectorAll("form");for(var i=0;i<fs.length;i++){if(fs[i].getAttribute("data-ws-skip")!=null)continue;wire(fs[i]);}callbar();window.addEventListener("resize",callbar);}'
  +'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}'
  +'try{if(window.self===window.top){var _vk="wsv_'+siteId+'";if(!sessionStorage.getItem(_vk)){sessionStorage.setItem(_vk,"1");fetch("https://websprout.app/api/hit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:"'+siteId+'"}),keepalive:true,mode:"no-cors"}).catch(function(){});}}}catch(e){}'
  +'})();</scr'+'ipt>';
}
// Defensive CSS net: injected into every generated site to prevent the most
// common layout bugs (sideways scroll, overflowing media, clipped headings)
// without overriding the design's intentional styles.
function withFix(html){
  if (!html || html.indexOf('_wsFix') > -1) return html;
  const css = '<style id="_wsFix">*,*::before,*::after{box-sizing:border-box}html{overflow-x:clip}body{overflow-x:hidden;max-width:100%}img,svg,video,canvas,iframe{max-width:100%}h1,h2,h3,h4,h5,h6{overflow-wrap:break-word}pre,code{max-width:100%;overflow-x:auto}</style>';
  const hi = html.indexOf('</head>');
  if (hi > -1) return html.slice(0,hi) + css + html.slice(hi);
  const b = html.indexOf('<body');
  if (b > -1){ const gt = html.indexOf('>', b); if (gt > -1) return html.slice(0,gt+1) + css + html.slice(gt+1); }
  return css + html;
}
function withForms(html, siteId){
  if (!html || html.indexOf('_wsForms') > -1) return html;
  let out = html;
  const meta = '<meta name="ws-site" content="' + siteId + '">';
  const hi = out.indexOf('</head>');
  if (hi > -1) out = out.slice(0,hi) + meta + out.slice(hi);
  const s = formScript(siteId);
  const bi = out.lastIndexOf('</body>');
  return bi > -1 ? out.slice(0,bi) + s + out.slice(bi) : out + s;
}

// ───────────────────────────────────────────────────────────
// PUBLISH — host generated sites live on websprout.app subdomains
// ───────────────────────────────────────────────────────────
const RESERVED_SLUGS = ['www','app','api','inbox','preview','admin','mail','blog','help','support','status','cdn','assets','static','dashboard','login','signup','sign-up','docs','about','terms','privacy','deploy','render','generate','stats','track','chat','modify','publish','unpublish','s','og','robots','sitemap','success'];
function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40); }

const PUB_404 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site not found</title><style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}.b{max-width:420px;padding:24px}.m{font-size:40px;margin-bottom:10px}a{color:#4ade80;font-weight:700;text-decoration:none}</style></head><body><div class="b"><div class="m">🌱</div><h1 style="font-size:22px;margin:0 0 8px">This site isn\'t published yet</h1><p style="color:rgba(255,255,255,.72);line-height:1.6">There\'s no live site at this address. <br>Build your own in seconds at <a href="https://websprout.app">websprout.app</a>.</p></div></body></html>';

function withBadge(html){
  if (!html || html.indexOf('ws-badge') > -1) return html;
  const b = '<a href="https://websprout.app/?utm_source=badge&utm_medium=referral&ref=badge" target="_blank" rel="noopener" id="ws-badge" style="position:fixed;bottom:14px;right:14px;z-index:2147483600;display:flex;align-items:center;gap:6px;background:rgba(15,26,13,.92);color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;font-size:12px;font-weight:600;padding:7px 12px;border-radius:100px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.14);line-height:1">🌱 Built with Websprout — make yours free</a>';
  const i = html.lastIndexOf('</body>');
  return i > -1 ? html.slice(0,i) + b + html.slice(i) : html + b;
}
function normalizePagePath(p){
  if (!p) return '';
  p = String(p).toLowerCase().trim();
  while (p.charAt(0) === '/') p = p.slice(1);
  while (p.length && p.charAt(p.length-1) === '/') p = p.slice(0, -1);
  return p;
}
function pubPage404(){
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title><style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}.b{max-width:420px;padding:24px}.m{font-size:40px;margin-bottom:10px}a{color:#4ade80;font-weight:700;text-decoration:none}</style></head><body><div class="b"><div class="m">&#127793;</div><h1 style="font-size:22px;margin:0 0 8px">Page not found</h1><p style="color:rgba(255,255,255,.72);line-height:1.6">This page does not exist on this site. <br><a href="/">Back to home</a>.</p></div></body></html>';
}
// Multi-page aware. A legacy single-page site (no pubpages index) serves its home for ANY path - unchanged behavior.
// A multi-page site (pubpages index present) resolves pub:slug:path and 404s on unknown pages.
async function servePublished(slug, env, path){
  if (!env || !env.KV) return null;
  const home = await env.KV.get('pub:' + slug);
  if (!home) return null;
  let html = home;
  const pg = normalizePagePath(path);
  if (pg) {
    let pages = null;
    try { const idx = await env.KV.get('pubpages:' + slug); if (idx) { const a = JSON.parse(idx); if (Array.isArray(a)) pages = a; } } catch(e){}
    if (pages) {
      if (pages.indexOf(pg) > -1) { html = (await env.KV.get('pub:' + slug + ':' + pg)) || home; }
      else { return new Response(pubPage404(), { status: 404, headers: { 'Content-Type':'text/html; charset=utf-8' } }); }
    }
  }
  if (html.indexOf('<!--WS_PRODUCTS-->') > -1) {
    try {
      let _sid = ''; const _m0 = await env.KV.get('pubmeta:' + slug); if (_m0) { try { _sid = (JSON.parse(_m0).siteId) || ''; } catch(e){} }
      let _prods = []; if (_sid) { const _pr = await env.KV.get('products:' + _sid); if (_pr) { try { _prods = JSON.parse(_pr); } catch(e){} } }
      let _ckEnabled = false;
      if (_sid) {
        try {
          const _own = ((await env.KV.get('notify:' + _sid)) || '').toLowerCase();
          if (_own) {
            if (_own === SUPPORT_EMAIL.toLowerCase()) _ckEnabled = true;
            else { const _u = JSON.parse((await env.KV.get('user:' + _own)) || 'null'); if (_u && _u.plan === 'pro' && _u.stripeConnect && _u.stripeConnectReady) _ckEnabled = true; }
          }
        } catch(e){}
      }
      html = html.split('<!--WS_PRODUCTS-->').join(renderProductGrid(_prods, _sid, _ckEnabled));
      if (_ckEnabled && _prods.length) { try { var _cartHtml = cartInjection(_prods, _sid); var _bi = html.lastIndexOf('</body>'); if (_bi > -1) { html = html.slice(0,_bi) + _cartHtml + html.slice(_bi); } else { html += _cartHtml; } } catch(e){} }
    } catch(e){}
  }
  let nobadge = false; try { const m = await env.KV.get('pubmeta:' + slug); if (m) nobadge = !!JSON.parse(m).nobadge; } catch(e){}
  return new Response(nobadge ? html : withBadge(html), { headers: { 'Content-Type':'text/html; charset=utf-8', 'X-Robots-Tag':'all' } });
}

async function doPublish(request, env){
  try{ const _ps=await getSession(request,env); await logEvent(request, env, 'publish', { email:_ps&&_ps.email }); }catch(e){}
  try {
    if (!env.KV) return fail('Publishing storage is not configured');
    const b = await request.json();
    if (!b.html || !b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const slug = slugify(b.slug || '');
    if (slug.length < 3) return fail('Pick a name with at least 3 letters/numbers');
    if (RESERVED_SLUGS.indexOf(slug) > -1) return fail('That name is reserved — choose another');
    const existing = await env.KV.get('pubmeta:' + slug);
    if (existing){ try { if (JSON.parse(existing).siteId !== b.siteId) return fail('That name is already taken — try another'); } catch(e){} }
    if (b.html.length > 4*1024*1024) return fail('Site is too large to publish');
    let _pro = false; try { const _s = await getSession(request, env); if (_s) { const _u = JSON.parse(await env.KV.get('user:' + _s.email) || '{}'); _pro = !!(_u && _u.plan === 'pro'); } } catch(e){}
    try { const _ps2 = await getSession(request, env); const _po = !!(_ps2 && ((_ps2.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase())); if (!_pro && !_po) b.pages = null; } catch(e){}
    // Capture leads through Websprout's own backend: point every form at our endpoint AND inject a
    // tiny handler that submits via fetch + shows an inline thank-you (no third party, no raw JSON page).
    const prep = (html) => {
     let pubHtml = html;
     try {
      const formAction = 'https://websprout.app/api/form/' + b.siteId;
      pubHtml = html.replace(/<form\b([^>]*)>/gi, function(m, attrs){
        let a = attrs;
        if (/\saction\s*=/i.test(a)) a = a.replace(/\saction\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, ' action="' + formAction + '"');
        else a = ' action="' + formAction + '"' + a;
        if (!/\smethod\s*=/i.test(a)) a = a + ' method="POST"';
        return '<form' + a + '>';
      });
      const formJS = "<scr"+"ipt>(function(){var EP=" + JSON.stringify(formAction) + ";function r(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}r(function(){var fs=document.getElementsByTagName('form');Array.prototype.slice.call(fs).forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('[type=submit],button');var o=b?b.textContent:'';if(b){b.disabled=true;b.textContent='Sending\u2026';}fetch(EP,{method:'POST',body:new FormData(f)}).then(d).catch(d);function d(){var n=document.createElement('div');n.textContent='\u2713 Thanks! Your message was sent \u2014 we\u2019ll be in touch soon.';n.setAttribute('style','padding:15px 18px;margin-top:14px;background:#16a34a;color:#fff;border-radius:10px;font-weight:700;font-family:inherit;text-align:center');f.reset();if(b){b.disabled=false;b.textContent=o;}f.parentNode.insertBefore(n,f.nextSibling);setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},9000);}});});});})();</scr"+"ipt>";
      const errJS = "<scr"+"ipt>window.addEventListener('error',function(ev){try{fetch('https://websprout.app/api/clientlog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg:(ev&&ev.message)||'error',src:(ev&&ev.filename)||'',line:(ev&&ev.lineno)||0,where:'published',url:location.href}),keepalive:true}).catch(function(){});}catch(e){}});</scr"+"ipt>";
      pubHtml = pubHtml.replace(/href="\[Pay Link:[^\]]*\]"/g, 'href="#"');
      if (pubHtml.indexOf('</body>') > -1) pubHtml = pubHtml.replace('</body>', formJS + errJS + '</body>'); else pubHtml = pubHtml + formJS + errJS;
    } catch(e){ pubHtml = html; } return pubHtml; };
    // Default the lead-notification email to the owner's account email (only if not already set)
    try { const _s2 = await getSession(request, env); if (_s2 && _s2.email) { const _cur = await env.KV.get('notify:' + b.siteId); if (!_cur) await env.KV.put('notify:' + b.siteId, _s2.email); } } catch(e){}
    // Multi-page if b.pages provided, else single home page (backward compatible).
    var _pages = (Array.isArray(b.pages) && b.pages.length) ? b.pages.slice() : [{ path:'', html: b.html }];
    if (!_pages.some(function(p){ return normalizePagePath(p.path)===''; })) _pages.unshift({ path:'', html: b.html });
    var _paths = [];
    for (var _i=0; _i<_pages.length; _i++){
      var _pg = _pages[_i]; var _pp = normalizePagePath(_pg.path); var _h = (_pg.html||'');
      if (!_h) continue;
      if (_h.length > 4*1024*1024) return fail('A page is too large to publish');
      await env.KV.put(_pp ? ('pub:' + slug + ':' + _pp) : ('pub:' + slug), prep(_h));
      if (_paths.indexOf(_pp)===-1) _paths.push(_pp);
    }
    // Drop sub-pages from a previous publish that are no longer present.
    try { var _oldIdx = await env.KV.get('pubpages:' + slug); if (_oldIdx){ var _old = JSON.parse(_oldIdx); if (Array.isArray(_old)){ for (var _j=0;_j<_old.length;_j++){ var _op=_old[_j]; if (_op && _paths.indexOf(_op)===-1) { try { await env.KV.delete('pub:' + slug + ':' + _op); } catch(e){} } } } } } catch(e){}
    // Multi-page sites get an index; single-page sites have none (preserves legacy serving).
    if (_paths.length > 1) await env.KV.put('pubpages:' + slug, JSON.stringify(_paths));
    else { try { await env.KV.delete('pubpages:' + slug); } catch(e){} }
    await env.KV.put('pubmeta:' + slug, JSON.stringify({ siteId: b.siteId, updated: Date.now(), nobadge: _pro, pages: _paths }));
    try { await env.KV.put('slugof:' + b.siteId, slug); } catch(e){}
    return succeed({ ok:true, slug: slug, url: 'https://' + slug + '.websprout.app', pathUrl: 'https://websprout.app/s/' + slug, nobadge: _pro, pages: _paths });
  } catch(e){ return fail(e.message); }
}

async function doUnpublish(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.slug || !b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const m = await env.KV.get('pubmeta:' + b.slug);
    if (m){ try { if (JSON.parse(m).siteId !== b.siteId) return fail('Not your site'); } catch(e){} }
    try { var _idx = await env.KV.get('pubpages:' + b.slug); if (_idx){ var _arr = JSON.parse(_idx); if (Array.isArray(_arr)){ for (var _k=0;_k<_arr.length;_k++){ var _p=_arr[_k]; if (_p) { try { await env.KV.delete('pub:' + b.slug + ':' + _p); } catch(e){} } } } } } catch(e){}
    try { await env.KV.delete('pubpages:' + b.slug); } catch(e){}
    await env.KV.delete('pub:' + b.slug); await env.KV.delete('pubmeta:' + b.slug); try { await env.KV.delete('slugof:' + b.siteId); } catch(e){}
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

async function doSlugCheck(request, env){
  try {
    const url = new URL(request.url);
    const slug = slugify(url.searchParams.get('slug') || '');
    const sid = url.searchParams.get('siteId') || '';
    if (slug.length < 3) return succeed({ available:false, slug:slug, reason:'too short' });
    if (RESERVED_SLUGS.indexOf(slug) > -1) return succeed({ available:false, slug:slug, reason:'reserved' });
    if (!env.KV) return succeed({ available:true, slug:slug });
    const existing = await env.KV.get('pubmeta:' + slug);
    let avail = !existing;
    if (existing && sid){ try { if (JSON.parse(existing).siteId === sid) avail = true; } catch(e){} }
    return succeed({ available: avail, slug: slug });
  } catch(e){ return fail(e.message); }
}

async function doDomainCheck(request, env){
  try {
    const url = new URL(request.url);
    const domain = (url.searchParams.get('domain') || '').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
    const aff = env.GODADDY_AFFILIATE || '';
    const buyUrl = aff ? aff : ('https://www.godaddy.com/domainsearch/find?domainToCheck=' + encodeURIComponent(domain));
    if (!domain || domain.indexOf('.') === -1) return succeed({ ok:false, buyUrl: buyUrl });
    if (env.GODADDY_KEY && env.GODADDY_SECRET){
      try {
        const r = await fetch('https://api.godaddy.com/v1/domains/available?domain=' + encodeURIComponent(domain), { headers: { 'Authorization': 'sso-key ' + env.GODADDY_KEY + ':' + env.GODADDY_SECRET, 'Accept':'application/json' }, signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return succeed({ ok:true, domain: domain, available: (typeof d.available === 'boolean' ? d.available : null), price: d.price ? (d.price/1000000) : null, buyUrl: buyUrl });
      } catch(e){ return succeed({ ok:true, domain: domain, available: null, buyUrl: buyUrl }); }
    }
    return succeed({ ok:true, domain: domain, available: null, buyUrl: buyUrl });
  } catch(e){ return fail(e.message); }
}

async function doConnectDomain(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.domain || !b.slug || !b.siteId || !b.key) return fail('Missing data');
    let _dpro = false; try { const _ds = await getSession(request, env); if (_ds) { const _du = JSON.parse((await env.KV.get('user:' + (_ds.email||'').toLowerCase())) || '{}'); _dpro = !!(_du && _du.plan === 'pro') || ((_ds.email||'').toLowerCase() === SUPPORT_EMAIL.toLowerCase()); } } catch(e){}
    if (!_dpro) return fail('Custom domains are a Pro feature.');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const m = await env.KV.get('pubmeta:' + b.slug);
    if (!m) return fail('Publish your site first, then connect the domain');
    try { if (JSON.parse(m).siteId !== b.siteId) return fail('Not your site'); } catch(e){}
    const host = b.domain.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'').replace(/^www\./,'');
    if (host.indexOf('.') === -1) return fail('Enter a valid domain');
    await env.KV.put('domain:' + host, b.slug);
    await env.KV.put('domain:www.' + host, b.slug);
    return succeed({ ok:true, host: host });
  } catch(e){ return fail(e.message); }
}

// ───────────────────────────────────────────────────────────
// ACCOUNTS — Google OAuth + passwordless email links + sessions
// ───────────────────────────────────────────────────────────
const SITE_ORIGIN = 'https://websprout.app';
function randToken(n){ n=n||24; const a=new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a).map(function(b){return ('0'+b.toString(16)).slice(-2);}).join(''); }
function parseCookies(request){ const h=request.headers.get('Cookie')||''; const o={}; h.split(';').forEach(function(p){ const i=p.indexOf('='); if(i>-1) o[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim()); }); return o; }
function sessionCookie(token){ return 'ws_sess='+token+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age='+(60*60*24*30); }
function clearCookie(name){ return name+'=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'; }
function jwtPayload(jwt){ try{ const p=jwt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'); const pad=p.length%4?'='.repeat(4-p.length%4):''; return JSON.parse(decodeURIComponent(escape(atob(p+pad)))); }catch(e){ return null; } }
async function mintSession(email, env){ const t=randToken(24); await env.KV.put('sess:'+t, JSON.stringify({ email:email, exp:Date.now()+1000*60*60*24*30 }), { expirationTtl:60*60*24*30 }); return t; }
async function getSession(request, env){ if(!env.KV) return null; const t=parseCookies(request)['ws_sess']; if(!t) return null; const v=await env.KV.get('sess:'+t); if(!v) return null; try{ const s=JSON.parse(v); if(s.exp&&s.exp<Date.now()) return null; return s; }catch(e){ return null; } }
async function getUserOrCreate(email, name, env){ const k='user:'+email.toLowerCase(); const v=await env.KV.get(k); if(v){ try{ return JSON.parse(v); }catch(e){} } const u={ email:email.toLowerCase(), name:name||'', created:Date.now(), plan:'free' }; await env.KV.put(k, JSON.stringify(u)); return u; }

async function doGoogleStart(request, env){
  if(!env.GOOGLE_CLIENT_ID) return new Response('Google sign-in is not configured yet.', { status:503 });
  const state=randToken(16);
  const u='https://accounts.google.com/o/oauth2/v2/auth?client_id='+encodeURIComponent(env.GOOGLE_CLIENT_ID)
    +'&redirect_uri='+encodeURIComponent(SITE_ORIGIN+'/auth/google/callback')
    +'&response_type=code&scope='+encodeURIComponent('openid email profile')+'&state='+state+'&access_type=online&prompt=select_account';
  const h=new Headers(); h.append('Location',u); h.append('Set-Cookie','ws_ostate='+state+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600');
  return new Response(null, { status:302, headers:h });
}
async function doGoogleCallback(request, env){
  try{
    const url=new URL(request.url);
    const code=url.searchParams.get('code'), state=url.searchParams.get('state');
    if(!code||!state||state!==parseCookies(request)['ws_ostate']) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const body=new URLSearchParams({ code:code, client_id:env.GOOGLE_CLIENT_ID, client_secret:env.GOOGLE_CLIENT_SECRET, redirect_uri:SITE_ORIGIN+'/auth/google/callback', grant_type:'authorization_code' });
    const r=await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body.toString() });
    const tok=await r.json();
    if(!tok.id_token) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const p=jwtPayload(tok.id_token);
    if(!p||!p.email) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    await getUserOrCreate(p.email, p.name||'', env);
    const t=await mintSession(p.email, env);
    const h=new Headers(); h.append('Location',SITE_ORIGIN+'/?login=ok'); h.append('Set-Cookie',sessionCookie(t)); h.append('Set-Cookie',clearCookie('ws_ostate'));
    return new Response(null, { status:302, headers:h });
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?login=error',302); }
}
async function doEmailStart(request, env){
  try{
    if(!env.KV) return fail('Not configured');
    if(!env.RESEND_API_KEY) return fail('Email sign-in is not configured yet');
    const b=await request.json();
    const email=String(b.email||'').trim().toLowerCase();
    if(!email||email.indexOf('@')<1||email.indexOf('.')<0) return fail('Enter a valid email');
    const t=randToken(20);
    await env.KV.put('magic:'+t, JSON.stringify({ email:email, exp:Date.now()+1000*60*15 }), { expirationTtl:60*15 });
    const link=SITE_ORIGIN+'/auth/verify?token='+t;
    const html='<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:460px;margin:0 auto;padding:24px"><div style="font-size:22px;font-weight:800;color:#2d7a3a;margin-bottom:8px">🌱 Sign in to Websprout</div><p style="color:#444;line-height:1.6">Click the button below to sign in. This link works once and expires in 15 minutes.</p><p style="margin:24px 0"><a href="'+link+'" style="background:#2d7a3a;color:#fff;padding:13px 26px;border-radius:9px;text-decoration:none;font-weight:700;display:inline-block">Sign in to Websprout</a></p><p style="color:#999;font-size:12px">If you didn\'t request this, you can safely ignore this email.</p></div>';
    await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[email], subject:'Your Websprout sign-in link', html:html }) });
    return succeed({ ok:true });
  }catch(e){ return fail(e.message); }
}
async function doVerify(request, env){
  try{
    const t=new URL(request.url).searchParams.get('token');
    if(!t||!env.KV) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const v=await env.KV.get('magic:'+t);
    if(!v) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    const m=JSON.parse(v); await env.KV.delete('magic:'+t);
    if(m.exp<Date.now()) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    await getUserOrCreate(m.email, '', env);
    const st=await mintSession(m.email, env);
    try{ await logEvent(request, env, 'login', { email: m.email }); }catch(e){}
    const h=new Headers(); h.append('Location',SITE_ORIGIN+'/?login=ok'); h.append('Set-Cookie',sessionCookie(st));
    return new Response(null, { status:302, headers:h });
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?login=error',302); }
}
async function doMe(request, env){
  const s=await getSession(request, env);
  if(!s) return succeed({ auth:false });
  let u=null; try{ u=JSON.parse(await env.KV.get('user:'+s.email)||'null'); }catch(e){}
  // Founder/owner account is always Pro — persist it to the accounts database so every plan check agrees
  if((s.email||'').toLowerCase() === SUPPORT_EMAIL.toLowerCase() && (!u || u.plan !== 'pro')){
    try{ await setUserPlan(env, s.email, 'pro', '', ''); u=JSON.parse(await env.KV.get('user:'+s.email)||'null'); }catch(e){}
  }
  const _owner = (s.email||'').toLowerCase() === SUPPORT_EMAIL.toLowerCase();
  return succeed({ auth:true, email:s.email, name:(u&&u.name)||'', plan:(u&&u.plan)||'free', pro:!!(u&&u.plan==='pro'), owner:_owner, connectReady:!!(u&&u.stripeConnectReady) });
}
async function doLogout(request, env){
  const t=parseCookies(request)['ws_sess'];
  if(t&&env.KV) await env.KV.delete('sess:'+t);
  return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json', 'Set-Cookie':clearCookie('ws_sess') } });
}

// ── Stripe subscription: signature-verified webhook + account entitlement ──
async function verifyStripeSig(rawBody, sigHeader, secret){
  try{
    if(!sigHeader||!secret) return false;
    let t='', v1='';
    sigHeader.split(',').forEach(function(p){ const i=p.indexOf('='); if(i<0) return; const k=p.slice(0,i), val=p.slice(i+1); if(k==='t')t=val; if(k==='v1'&&!v1)v1=val; });
    if(!t||!v1) return false;
    const enc=new TextEncoder();
    const key=await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
    const sig=await crypto.subtle.sign('HMAC', key, enc.encode(t+'.'+rawBody));
    const hex=Array.from(new Uint8Array(sig)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    if(hex.length!==v1.length) return false;
    let diff=0; for(let i=0;i<hex.length;i++){ diff |= hex.charCodeAt(i)^v1.charCodeAt(i); }
    return diff===0;
  }catch(e){ return false; }
}
async function setUserPlan(env, email, plan, cust, sub){
  if(!email) return;
  const k='user:'+email.toLowerCase();
  let u={}; try{ u=JSON.parse(await env.KV.get(k)||'{}'); }catch(e){}
  if(!u.email) u.email=email.toLowerCase();
  u.plan=plan;
  // Distinguish a real paying customer (came in with a Stripe customer) from a comped/gifted account
  u.proSource = (plan==='pro') ? ((cust || u.stripeCustomer) ? 'paid' : 'comp') : '';
  if(cust){ u.stripeCustomer=cust; await env.KV.put('stripecust:'+cust, email.toLowerCase()); }
  if(sub!==undefined&&sub!=='') u.stripeSub=sub;
  u.planUpdated=Date.now();
  await env.KV.put(k, JSON.stringify(u));
}
async function doSupport(request, env){
  try{
    if(!env.RESEND_API_KEY) return fail('Support email is not configured yet');
    const ip = request.headers.get('cf-connecting-ip') || '';
    if(ip && env.KV){ const rk='suprate:'+ip; const n=parseInt(await env.KV.get(rk)||'0',10)||0; if(n>=6) return fail('Too many messages right now — please try again later'); await env.KV.put(rk, String(n+1), { expirationTtl: 3600 }); }
    const b = await request.json();
    const email = String(b.email||'').trim().slice(0,160);
    const name = String(b.name||'').trim().slice(0,120);
    const message = String(b.message||'').trim().slice(0,5000);
    if(email.indexOf('@') < 1) return fail('A valid email is required');
    if(message.length < 5) return fail('Please include a message');
    const esc = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
    const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6">'
      + '<h2 style="margin:0 0 6px">New support message</h2>'
      + '<p style="margin:0 0 4px"><b>From:</b> ' + esc(name||'(no name)') + ' &lt;' + esc(email) + '&gt;</p>'
      + '<hr style="border:none;border-top:1px solid #eee;margin:12px 0">'
      + '<p style="white-space:pre-wrap;margin:0">' + esc(message) + '</p></div>';
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ from:'Websprout Support <hello@websprout.app>', to:[SUPPORT_EMAIL], reply_to: email, subject:'🛟 Support: '+(name||email), html: html })
    });
    if(!r.ok) return fail('Could not send right now — please try again');
    return succeed({ ok:true });
  }catch(e){ return fail('Could not send'); }
}
const ADMIN_PANEL = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Websprout Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#070d06;color:#eaf2e8;padding:24px;max-width:1180px;margin:0 auto}
h1{font-size:22px;font-weight:800}
.sub{color:rgba(234,242,232,.5);font-size:13px}
.top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.rl{font-size:13px;color:rgba(234,242,232,.55);cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px}
.rl:hover{background:rgba(255,255,255,.06)}
.devlink{font-size:13px;color:#5cc8ff;border:1px solid rgba(92,200,255,.3);border-radius:8px;padding:7px 12px;text-decoration:none}
.devlink:hover{background:rgba(92,200,255,.08)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:26px}
.card{background:#0f1a0d;border:1px solid rgba(45,122,58,.25);border-radius:14px;padding:16px}
.card .n{font-size:26px;font-weight:800}
.card .l{font-size:11px;color:rgba(234,242,232,.5);margin-top:2px;text-transform:uppercase;letter-spacing:.5px}
.card.pro .n{color:#f5c542}
.card.mrr .n{color:#4ade80}
.card.comp .n{color:#a78bfa}
h2{font-size:15px;font-weight:700;margin:22px 0 10px}
.wrap{background:#0f1a0d;border:1px solid rgba(45,122,58,.18);border-radius:14px;padding:4px;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;color:rgba(234,242,232,.4);font-weight:600;padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.08);font-size:11px;text-transform:uppercase;letter-spacing:.5px}
td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:middle}
tr:hover td{background:rgba(45,122,58,.06)}
.badge{display:inline-block;font-size:10px;font-weight:800;padding:3px 9px;border-radius:999px;letter-spacing:.4px}
.badge.pro{background:linear-gradient(135deg,#f5c542,#2d9e4a);color:#06120a}
.badge.free{background:rgba(255,255,255,.1);color:rgba(255,255,255,.72)}
.badge.comp{background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff}
.badge.owner{background:#1f2937;color:#cbd5e1;border:1px solid #475569}
.badge.dev{background:rgba(92,200,255,.16);color:#5cc8ff;border:1px solid rgba(92,200,255,.4);margin-left:5px}
.act{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:7px;padding:5px 11px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;margin-right:5px}
.act:hover{background:rgba(255,255,255,.16)}
.act.mk{background:rgba(45,158,74,.18);border-color:rgba(45,158,74,.4);color:#7fe39a}
.act.dv{background:rgba(92,200,255,.14);border-color:rgba(92,200,255,.35);color:#7fd3ff}
a{color:#4ade80;text-decoration:none}.muted{color:rgba(234,242,232,.38)}.err{color:#fca5a5;padding:20px;text-align:center}
</style></head><body>
<div class="top"><div><h1>&#128202; Websprout Admin</h1><div class="sub">Accounts, revenue &amp; insights &middot; owner only</div></div><div style="display:flex;gap:8px"><a class="devlink" href="/dev">&#128736;&#65039; Developer</a><div class="rl" id="refresh">&#8635; Refresh</div></div></div>
<div id="cards" class="cards"></div>
<h2>Accounts</h2>
<div class="wrap"><table><thead><tr><th>Email</th><th>Name</th><th>Plan</th><th>Builds</th><th>Joined</th><th>Actions</th></tr></thead><tbody id="ubody"><tr><td colspan="6" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Published sites</h2>
<div class="wrap"><table><thead><tr><th>Address</th><th>Views</th><th>Leads</th><th>Updated</th><th>Badge</th><th>Showcase</th></tr></thead><tbody id="pbody"><tr><td colspan="6" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Custom domains</h2>
<div class="wrap"><table><thead><tr><th>Domain</th><th>Points to</th></tr></thead><tbody id="dbody"><tr><td colspan="2" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Invoices <span id="invSub" style="font-size:12px;color:rgba(234,242,232,.4);font-weight:400"></span></h2>
<div class="wrap"><table><thead><tr><th>When</th><th>For</th><th>Amount</th><th>Fee</th><th>Client</th></tr></thead><tbody id="ibody"><tr><td colspan="5" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Activity log <span id="actCount" style="font-size:12px;color:rgba(234,242,232,.4);font-weight:400"></span></h2>
<input id="actSearch" placeholder="Search email, country, city, event, source" style="width:100%;box-sizing:border-box;background:#0c1218;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#eaf2e8;padding:9px 12px;font-size:13px;margin-bottom:8px;font-family:inherit"/>
<div class="wrap"><table><thead><tr><th>When</th><th>Event</th><th>Location</th><th>User</th><th>Source</th><th>Device</th></tr></thead><tbody id="abody"><tr><td colspan="6" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Recent errors <span id="errCount" style="font-size:12px;color:rgba(234,242,232,.4);font-weight:400"></span></h2>
<div class="wrap"><table><thead><tr><th>When</th><th>Where</th><th>Message</th><th>Build</th></tr></thead><tbody id="ebody"><tr><td colspan="4" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<script>
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '<span class="muted">&mdash;</span>';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function card(n,l,cls){return '<div class="card '+(cls||'')+'"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';}
function setPlan(email,plan){
  if(plan==='free'&&!confirm('Revoke Pro from '+email+'?'))return;
  fetch('/admin/grant?email='+encodeURIComponent(email)+'&plan='+plan).then(function(r){return r.text();}).then(function(){load();}).catch(function(){alert('Failed \u2014 try again');});
}
function setDev(email,role){
  if(role==='user'&&!confirm('Revoke developer access from '+email+'?'))return;
  fetch('/admin/grant?email='+encodeURIComponent(email)+'&role='+role).then(function(r){return r.text();}).then(function(){load();}).catch(function(){alert('Failed \u2014 try again');});
}
function setFeature(slug,on){
  fetch('/admin/feature?slug='+encodeURIComponent(slug)+'&on='+on).then(function(r){return r.json();}).then(function(){load();}).catch(function(){alert('Failed \u2014 try again');});
}
function load(){
  fetch('/admin/data').then(function(r){return r.json();}).then(function(j){
    if(j.error){document.getElementById('cards').innerHTML='<div class="err">'+esc(j.error)+'</div>';return;}
    var t=j.totals||{};
    var feesTxt=t.feesOk?('$'+((t.feesCollected||0)/100).toFixed(2)):'\u2014';
    document.getElementById('cards').innerHTML=card(t.accounts||0,'Accounts')+card(t.paid||0,'Paid Pro','pro')+card('$'+(t.mrr||0),'MRR','mrr')+card(feesTxt,'Fees collected','mrr')+card(t.comped||0,'Comped','comp')+card(t.free||0,'Free')+card((t.conversion||0)+'%','Paid conv.')+card(t.published||0,'Published')+card(t.generations||0,'Builds')+card(t.leads||0,'Leads')+card(t.invoices||0,'Invoices')+card(t.signups7||0,'New (7d)')+card(t.visits||0,'Visits')+card((t.visitConv||0)+'%','Visit&rarr;Build');
    var us=j.users||[],ub='';
    if(!us.length)ub='<tr><td colspan="6" class="muted" style="padding:18px">No accounts yet</td></tr>';
    for(var i=0;i<us.length;i++){var u=us[i],isPro=u.plan==='pro';
      var bcls='free',btxt='FREE';
      if(u.owner){bcls='owner';btxt='OWNER';}else if(u.source==='paid'){bcls='pro';btxt='PAID';}else if(isPro){bcls='comp';btxt='COMPED';}
      var devBadge=u.dev?'<span class="badge dev">DEV</span>':'';
      var planBtn=isPro?'<button class="act" data-act="plan" data-email="'+esc(u.email)+'" data-v="free">Revoke Pro</button>':'<button class="act mk" data-act="plan" data-email="'+esc(u.email)+'" data-v="pro">Comp Pro</button>';
      var devBtn=u.owner?'':(u.dev?'<button class="act dv" data-act="dev" data-email="'+esc(u.email)+'" data-v="user">Revoke Dev</button>':'<button class="act dv" data-act="dev" data-email="'+esc(u.email)+'" data-v="dev">Make Dev</button>');
      ub+='<tr><td>'+esc(u.email)+'</td><td>'+(u.name?esc(u.name):'<span class="muted">&mdash;</span>')+'</td><td><span class="badge '+bcls+'">'+btxt+'</span>'+devBadge+'</td><td>'+(u.gens||0)+'</td><td class="muted">'+dt(u.created)+'</td><td style="white-space:nowrap">'+planBtn+devBtn+'</td></tr>';}
    document.getElementById('ubody').innerHTML=ub;
    var ps=j.published||[],pb='';
    if(!ps.length)pb='<tr><td colspan="5" class="muted" style="padding:18px">No published sites yet</td></tr>';
    for(var k=0;k<ps.length;k++){var p=ps[k];pb+='<tr><td><a href="https://'+esc(p.slug)+'.websprout.app" target="_blank">'+esc(p.slug)+'</a></td><td>'+(p.views||0)+'</td><td>'+(p.leads||0)+'</td><td class="muted">'+dt(p.updated)+'</td><td>'+(p.nobadge?'<span class="muted">hidden (Pro)</span>':'shown')+'</td><td>'+(p.featured?'<button class="act dv" data-feat="0" data-slug="'+esc(p.slug)+'">&#9733; Featured</button>':'<button class="act" data-feat="1" data-slug="'+esc(p.slug)+'">Feature</button>')+'</td></tr>';}
    document.getElementById('pbody').innerHTML=pb;
    var ds=j.domains||[],db='';
    if(!ds.length)db='<tr><td colspan="2" class="muted" style="padding:18px">No custom domains yet</td></tr>';
    for(var y=0;y<ds.length;y++){var dm=ds[y];db+='<tr><td><a href="https://'+esc(dm.host)+'" target="_blank">'+esc(dm.host)+'</a></td><td class="muted">'+esc(dm.slug)+'</td></tr>';}
    document.getElementById('dbody').innerHTML=db;
    var ivs=j.invoices||[],ib='';
    if(!ivs.length)ib='<tr><td colspan="5" class="muted" style="padding:18px">No invoices yet</td></tr>';
    for(var z=0;z<ivs.length;z++){var iv=ivs[z];var icur=(iv.currency||'usd').toUpperCase();
      ib+='<tr><td class="muted" style="white-space:nowrap">'+dt(iv.ts)+'</td><td>'+(iv.desc?esc(iv.desc):'<span class="muted">&mdash;</span>')+'</td><td>'+icur+' '+((iv.amount||0)/100).toFixed(2)+'</td><td'+(iv.fee?' style="color:#4ade80"':' class="muted"')+'>'+(iv.fee?('$'+((iv.fee||0)/100).toFixed(2)):'&mdash;')+'</td><td class="muted">'+(iv.client?esc(iv.client):'&mdash;')+'</td></tr>';}
    document.getElementById('ibody').innerHTML=ib;
    var isub=document.getElementById('invSub');if(isub)isub.textContent=(t.invoices||0)+' created \u00b7 '+(t.feesOk?('$'+((t.feesCollected||0)/100).toFixed(2)+' collected'):('$'+((t.feeBilled||0)/100).toFixed(2)+' billed'));
    var es=j.errors||[],eb='';
    if(!es.length)eb='<tr><td colspan="4" class="muted" style="padding:18px">No errors reported \uD83C\uDF89</td></tr>';
    for(var x=0;x<es.length;x++){var er=es[x];
      eb+='<tr><td class="muted" style="white-space:nowrap">'+dt(er.ts)+'</td><td>'+esc(er.where||'')+'</td><td style="max-width:440px"><div style="color:#fca5a5;font-size:12px;word-break:break-word">'+esc(er.msg||'')+'</div>'+(er.url?'<div class="muted" style="font-size:11px;word-break:break-all">'+esc(er.url)+'</div>':'')+'</td><td class="muted" style="font-size:11px">'+esc(String(er.build||'').replace('2026-06-10-',''))+'</td></tr>';}
    document.getElementById('ebody').innerHTML=eb;
    var ec=document.getElementById('errCount');if(ec)ec.textContent=es.length?('('+es.length+' most recent)'):'';
  }).catch(function(){document.getElementById('cards').innerHTML='<div class="err">Could not load \u2014 make sure you are signed in as the owner.</div>';});
}
document.getElementById('ubody').addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-act]');if(!b)return;var act=b.getAttribute('data-act');if(act==='plan')setPlan(b.getAttribute('data-email'),b.getAttribute('data-v'));else if(act==='dev')setDev(b.getAttribute('data-email'),b.getAttribute('data-v'));});
document.getElementById('pbody').addEventListener('click',function(e){var fb=e.target.closest&&e.target.closest('button[data-feat]');if(!fb)return;setFeature(fb.getAttribute('data-slug'),fb.getAttribute('data-feat'));});
document.getElementById('refresh').addEventListener('click',load);
load();
var _acts=[];
function renderActs(){
  var q=(document.getElementById('actSearch').value||'').toLowerCase();
  var rows=_acts.filter(function(a){ if(!q)return true; return ((a.t||'')+' '+(a.e||'')+' '+(a.c||'')+' '+(a.ci||'')+' '+(a.s||'')+' '+(a.d||'')).toLowerCase().indexOf(q)>-1; });
  var ac=document.getElementById('actCount'); if(ac) ac.textContent=rows.length+' events';
  var b=document.getElementById('abody');
  if(!rows.length){ b.innerHTML='<tr><td colspan="6" class="muted" style="padding:18px">No activity yet</td></tr>'; return; }
  b.innerHTML=rows.slice(0,500).map(function(a){
    var loc=[a.ci,a.c].filter(Boolean).join(', ')||'<span class="muted">&mdash;</span>';
    return '<tr><td class="muted" style="white-space:nowrap">'+dt(a.ts)+'</td><td>'+esc(a.t||'')+'</td><td>'+loc+'</td><td>'+(a.e?esc(a.e):'<span class="muted">&mdash;</span>')+'</td><td>'+(a.s?esc(a.s):'<span class="muted">&mdash;</span>')+'</td><td class="muted">'+esc(a.d||'')+'</td></tr>';
  }).join('');
}
function loadActivity(){
  fetch('/admin/activity').then(function(r){return r.json();}).then(function(j){ _acts=(j&&j.events)||[]; renderActs(); }).catch(function(){ var b=document.getElementById('abody'); if(b) b.innerHTML='<tr><td colspan="6" class="err">Failed to load</td></tr>'; });
}
var _as=document.getElementById('actSearch'); if(_as) _as.addEventListener('input',renderActs);
loadActivity();
</script></body></html>`;


// ── Re-engagement: one-time "you built but didn't publish" nudge ──
async function nudgeToken(email, env){
  const secret = (env && env.FORM_SECRET) || 'ws-forms-v1-shared-secret';
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode('nudge:' + String(email||'').toLowerCase()));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(sig))).replace(/[^A-Za-z0-9]/g,'').slice(0,20);
}
async function sendNudgeEmail(env, to, siteName, token){
  const optout = 'https://websprout.app/email-optout?e=' + encodeURIComponent(to) + '&t=' + encodeURIComponent(token);
  const nm = siteName ? escHtml(siteName) : 'Your website';
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto">'
    + '<div style="background:#0f1a0d;padding:24px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">🌱 Websprout</span></div>'
    + '<div style="padding:28px 26px">'
    + '<h1 style="color:#0f1a0d;font-size:21px;font-weight:800;margin:0 0 10px;letter-spacing:-.5px">' + nm + ' is still saved — and one click from live</h1>'
    + '<p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 18px">You built a site on Websprout but never published it. It is saved to your account, exactly where you left it. Publishing is free — you pick a free address like <strong>yourname.websprout.app</strong> and you are live in seconds.</p>'
    + '<div style="text-align:center;margin:22px 0"><a href="https://websprout.app/?utm_source=nudge&utm_medium=email" style="display:inline-block;background:#2d7a3a;color:#fff;padding:13px 30px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">Open my site →</a></div>'
    + '<p style="color:#888;font-size:13px;margin:0">Sign in with this email address, then open <strong>Settings → My sites</strong>.</p>'
    + '</div>'
    + '<div style="background:#f8faf8;border-top:1px solid #e8f0e5;padding:16px 26px;text-align:center"><p style="color:#aaa;font-size:12px;margin:0">You are receiving this one-time reminder because you built a site on <a href="https://websprout.app" style="color:#2d7a3a">Websprout</a>. <a href="' + optout + '" style="color:#888">Unsubscribe</a></p></div>'
    + '</div>';
  const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'Your website is saved — publish it free in one click', html: html }) });
  return r && r.ok;
}
async function runNudges(env, dry){
  const out = { candidates:[], sent:0, skipped:0, errors:0 };
  try{
    if(!env || !env.KV) return out;
    if(!dry && !env.RESEND_API_KEY){ out.errors++; return out; }
    const cutoffNew = Date.now() - 48*3600*1000;
    const cutoffOld = Date.now() - 30*86400000;
    let cursor, guard=0;
    do{
      const r = await env.KV.list({ prefix:'user:', cursor, limit:1000 });
      for(const k of r.keys){
        if(out.sent >= 20) break;
        const eml = k.name.slice(5);
        if(!eml || eml.indexOf('@') < 1) continue;
        try{
          if(await env.KV.get('nudged:'+eml)){ out.skipped++; continue; }
          if(await env.KV.get('emailoptout:'+eml)){ out.skipped++; continue; }
          let list=[]; try{ list=JSON.parse((await env.KV.get('usersites:'+eml))||'[]'); }catch(e){}
          if(!list.length){ try{ const u=JSON.parse((await env.KV.get(k.name))||'{}'); if(u.email && u.email!==eml){ list=JSON.parse((await env.KV.get('usersites:'+u.email))||'[]'); } }catch(e){} }
          if(!list.length) continue;
          let unpub=null, anyPub=false;
          for(const it of list){
            const sid = it && it.siteId; if(!sid) continue;
            const slug = await env.KV.get('slugof:'+sid);
            if(slug){ anyPub=true; break; }
            const ts = (it.ts||0);
            if(ts && ts < cutoffNew && ts > cutoffOld && !unpub) unpub = it;
          }
          if(anyPub || !unpub) continue;
          out.candidates.push({ email: eml, site: unpub.name||unpub.siteId, savedAt: unpub.ts });
          if(!dry){
            const tok = await nudgeToken(eml, env);
            const ok = await sendNudgeEmail(env, eml, unpub.name||'', tok);
            if(ok){ out.sent++; await env.KV.put('nudged:'+eml, String(Date.now())); }
            else out.errors++;
          }
        }catch(e){ out.errors++; }
      }
      cursor = r.list_complete ? null : r.cursor; guard++;
    } while(cursor && guard<5 && out.sent<20);
  }catch(e){ out.errors++; }
  return out;
}
async function doEmailOptout(request, env){
  const u = new URL(request.url);
  const e = (u.searchParams.get('e')||'').toLowerCase().trim();
  const t = u.searchParams.get('t')||'';
  const page = function(msg){ return new Response('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email preferences</title></head><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#eaf2e8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center"><div style="max-width:420px;padding:24px"><div style="font-size:36px;margin-bottom:10px">🌱</div><p style="line-height:1.7">'+msg+'</p><p style="margin-top:14px"><a href="/" style="color:#4ade80;font-weight:700;text-decoration:none">Back to Websprout</a></p></div></body></html>', { headers:{ 'Content-Type':'text/html; charset=utf-8' } }); };
  if(!e || !t || !env.KV) return page('That unsubscribe link is not valid.');
  const expect = await nudgeToken(e, env);
  if(t !== expect) return page('That unsubscribe link is not valid.');
  await env.KV.put('emailoptout:'+e, String(Date.now()));
  return page('Done — <strong>'+escHtml(e)+'</strong> will not receive reminder emails from Websprout.');
}
async function doAdminNudge(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  const dry = new URL(request.url).searchParams.get('dry') !== '0';
  const res = await runNudges(env, dry);
  return new Response(JSON.stringify({ dryRun: dry, hint: dry ? 'Add ?dry=0 to actually send.' : 'Emails sent.', result: res }, null, 2), { headers:{ 'Content-Type':'application/json' } });
}
async function hashIP(ip, env){
  try{
    const salt = (env && env.IP_SALT) || 'ws-analytics-v1';
    const buf = new TextEncoder().encode(salt + '|' + (ip||''));
    const d = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(d)].map(function(b){return b.toString(16).padStart(2,'0');}).join('').slice(0,16);
  }catch(e){ return ''; }
}
function uaShort(ua){
  ua = ua || '';
  var os = /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Mac OS X|Macintosh/i.test(ua) ? 'Mac' : /Windows/i.test(ua) ? 'Windows' : /Linux/i.test(ua) ? 'Linux' : '';
  var br = /Instagram/i.test(ua) ? 'Instagram' : /FBAN|FBAV|FB_IAB/i.test(ua) ? 'Facebook' : /Edg\//i.test(ua) ? 'Edge' : /Chrome/i.test(ua) ? 'Chrome' : /Firefox/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : '';
  return [br, os].filter(Boolean).join(' / ');
}
function deriveSource(url, ref){
  try{ if(url){ var u=new URL(url); var sc=u.searchParams.get('utm_source'); var md=u.searchParams.get('utm_medium'); if(sc) return (sc + (md ? ('/'+md) : '')).slice(0,40); if(u.searchParams.get('fbclid')) return 'facebook/ad'; } }catch(e){}
  try{ if(ref){ var h=new URL(ref).hostname.replace(/^www\./,''); if(h) return h.slice(0,40); } }catch(e){}
  return 'direct';
}
async function logEvent(request, env, type, extra){
  try{
    if(!env || !env.KV) return;
    extra = extra || {};
    const cf = request.cf || {};
    const iph = await hashIP(request.headers.get('cf-connecting-ip') || '', env);
    const ev = { t:String(type||'event').slice(0,24), ts:Date.now(), iph:iph, country:(cf.country||'').slice(0,4), region:(cf.region||'').slice(0,40), city:(cf.city||'').slice(0,60), email:extra.email?String(extra.email).toLowerCase().trim().slice(0,120):'', src:extra.src?String(extra.src).slice(0,40):'', ref:extra.ref?String(extra.ref).slice(0,300):'', device:uaShort(request.headers.get('user-agent')||'') };
    const key = 'evt:' + ev.ts + ':' + Math.random().toString(36).slice(2,8);
    const meta = { t:ev.t, ts:ev.ts, c:ev.country, ci:ev.city, e:ev.email, s:ev.src, d:ev.device };
    await env.KV.put(key, JSON.stringify(ev), { expirationTtl: 60*60*24*60, metadata: meta });
  }catch(e){}
}
async function doAdminActivity(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  if(!env.KV) return succeed({ events:[] });
  const events=[]; let cursor=undefined, guard=0;
  do{
    const r = await env.KV.list({ prefix:'evt:', cursor, limit:1000 });
    for(const k of r.keys){ if(k.metadata) events.push(k.metadata); }
    cursor = r.list_complete ? null : r.cursor; guard++;
  } while(cursor && guard<5 && events.length<4000);
  events.sort(function(a,b){ return (b.ts||0)-(a.ts||0); });
  return succeed({ events: events.slice(0,2000), total: events.length });
}
async function doAdminData(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  if(!env.KV) return succeed({ totals:{}, users:[], published:[], errors:[], domains:[] });
  // generations per account
  const genMap={}; let genTotal=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'gencount:', cursor:cur, limit:1000 }); for(const k of r.keys){ const em=k.name.slice(9); let n=0; try{ n=parseInt(await env.KV.get(k.name)||'0',10)||0; }catch(e){} genMap[em]=n; genTotal+=n; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  // total builds across ALL plans; falls back to the historical free count for accounts not yet migrated
  const bMap={};
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'bcount:', cursor:cur, limit:1000 }); for(const k of r.keys){ const em=k.name.slice(7); let n=0; try{ n=parseInt(await env.KV.get(k.name)||'0',10)||0; }catch(e){} bMap[em]=n; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  const buildMap={}; let buildTotal=0;
  { const _u={}; for(const e in genMap)_u[e]=1; for(const e in bMap)_u[e]=1; for(const e in _u){ const v=(bMap[e]!==undefined)?bMap[e]:(genMap[e]||0); buildMap[e]=v; buildTotal+=v; } }
  // accounts
  const users=[]; let cursor=undefined, guard=0;
  do{
    const r = await env.KV.list({ prefix:'user:', cursor, limit:1000 });
    for(const k of r.keys){ try{ const u=JSON.parse(await env.KV.get(k.name)||'{}'); const em=(u.email||k.name.slice(5)); const src=(u.plan==='pro')?(u.proSource||(u.stripeCustomer?'paid':'comp')):''; users.push({ email:em, name:u.name||'', plan:u.plan||'free', created:u.created||0, source:src, owner: em.toLowerCase()===SUPPORT_EMAIL.toLowerCase(), dev:!!u.dev, gens: buildMap[em.toLowerCase()]||0 }); }catch(e){} }
    cursor = r.list_complete ? null : r.cursor; guard++;
  } while(cursor && guard<10);
  // leads grouped by siteId
  const leadMap={}; let leadTotal=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'form:', cursor:cur, limit:1000 }); for(const k of r.keys){ const sid=(k.name.split(':')[1])||''; leadMap[sid]=(leadMap[sid]||0)+1; leadTotal++; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<25); }catch(e){}
  // published sites with views + leads
  const featuredSet=new Set(); try{ const fr=await env.KV.list({ prefix:'featured:', limit:1000 }); for(const fk of fr.keys){ featuredSet.add(fk.name.slice(9)); } }catch(e){}
  const pub=[]; { let c2=undefined, g2=0; do{ const r2=await env.KV.list({ prefix:'pubmeta:', cursor:c2, limit:1000 }); for(const k of r2.keys){ const slug=k.name.slice(8); try{ const m=JSON.parse(await env.KV.get(k.name)||'{}'); const sid=m.siteId||''; let views=0; try{ views=parseInt(await env.KV.get('views:'+sid+':total')||'0',10)||0; }catch(e){} pub.push({ slug, updated:m.updated||0, nobadge:!!m.nobadge, views, leads:leadMap[sid]||0, featured:featuredSet.has(slug) }); }catch(e){} } c2=r2.list_complete?null:r2.cursor; g2++; } while(c2 && g2<10); }
  // custom domains
  const domains=[];
  try{ const r=await env.KV.list({ prefix:'domain:', limit:1000 }); for(const k of r.keys){ try{ const sl=await env.KV.get(k.name); domains.push({ host:k.name.slice(7), slug:sl||'' }); }catch(e){} } }catch(e){}
  // invoices created (KV) - amounts + fees configured at creation time
  const invoices=[]; let invTotal=0, feeBilled=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'invoice:', cursor:cur, limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); invoices.push({ ts:o.ts||0, owner:(k.name.split(':')[1])||'', amount:o.amount||0, fee:o.fee||0, currency:(o.currency||'usd'), desc:o.desc||'', client:o.clientEmail||'' }); invTotal+=(o.amount||0); feeBilled+=(o.fee||0); }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  invoices.sort((a,b)=>(b.ts||0)-(a.ts||0));
  // real platform fees collected (Stripe application_fees, net of refunds)
  let feesCollected=0, feesCount=0, feesOk=false;
  try{ const sk=(env.STRIPE_SECRET_KEY||'').trim(); if(sk){ let starting=undefined, pages=0; do{ const u2='https://api.stripe.com/v1/application_fees?limit=100'+(starting?('&starting_after='+encodeURIComponent(starting)):''); const r=await fetch(u2,{ headers:{ 'Authorization':'Bearer '+sk } }); const j=await r.json(); if(!j||!Array.isArray(j.data)) break; for(const af of j.data){ feesCollected += ((af.amount||0)-(af.amount_refunded||0)); feesCount++; } feesOk=true; if(j.has_more && j.data.length){ starting=j.data[j.data.length-1].id; } else { starting=undefined; } pages++; } while(starting && pages<5); } }catch(e){ feesOk=false; }
  const now=Date.now(); let paid=0, comped=0, free=0, signups7=0, devs=0;
  for(const u of users){ if(u.plan==='pro'){ if(u.source==='paid')paid++; else comped++; } else free++; if(u.created>now-7*86400000)signups7++; if(u.dev)devs++; }
  users.sort((a,b)=>(b.created||0)-(a.created||0));
  pub.sort((a,b)=>(b.updated||0)-(a.updated||0));
  const errors=[];
  try{ const r3=await env.KV.list({ prefix:'clienterr:', limit:1000 }); const names=r3.keys.map(function(k){return k.name;}).sort().reverse().slice(0,60); for(const nm of names){ try{ errors.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} } }catch(e){}
  let visits=0; try{ visits=parseInt(await env.KV.get('stat:visit')||'0',10)||0; }catch(e){}
  return succeed({ totals:{ visits, visitConv: visits?Math.round(buildTotal/visits*1000)/10:0, accounts:users.length, paid, comped, pro:paid+comped, free, conversion: users.length?Math.round(paid/users.length*1000)/10:0, mrr: paid*10, published:pub.length, generations:buildTotal, leads:leadTotal, domains:domains.length, devs, signups7, errors:errors.length, invoices:invoices.length, invoiced:invTotal, feeBilled, feesCollected, feesCount, feesOk }, users, published:pub, errors, domains, invoices: invoices.slice(0,40) });
}
async function doAdminPage(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()){
    return new Response('<!DOCTYPE html><meta charset="utf-8"><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;text-align:center;padding:60px"><h2>Admin access only</h2><p style="color:#9bb">Sign in as the owner account, then return to <a href="/admin" style="color:#4ade80">/admin</a>.</p></body>', { status:403, headers:{ 'Content-Type':'text/html; charset=utf-8' } });
  }
  return new Response(ADMIN_PANEL, { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
}
async function doAdminGrant(request, env){
  // Owner-only comp tool: grant/revoke Pro without Stripe. Gated to the owner's signed-in account.
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()){
    return new Response('Not authorized. Sign in as the owner account first.', { status:403, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  }
  const url = new URL(request.url);
  const target = ((url.searchParams.get('email') || s.email) || '').toLowerCase().trim();
  if(target.indexOf('@') < 1) return new Response('Provide a valid ?email=', { status:400, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  const role = url.searchParams.get('role');
  if(role === 'dev' || role === 'user'){
    let u = {}; try { u = JSON.parse((await env.KV.get('user:' + target)) || '{}'); } catch(e){}
    u.email = u.email || target; u.dev = (role === 'dev'); if(!u.created) u.created = Date.now();
    await env.KV.put('user:' + target, JSON.stringify(u));
    return new Response('\u2713 ' + target + ' developer access ' + (role==='dev' ? 'GRANTED \uD83D\uDEE0\uFE0F' : 'revoked') + '.\n\nThey can open /dev once signed in.\n\nTo revoke: add &role=user to this URL.', { headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  }
  const plan = url.searchParams.get('plan') === 'free' ? 'free' : 'pro';
  await setUserPlan(env, target, plan, '', '');
  const body = '\u2713 ' + target + ' is now ' + (plan==='pro' ? 'PRO \uD83C\uDF89' : 'Free') + '.\n\nRefresh Websprout (or sign out and back in) to see it.\n\nTo revoke: add &plan=free to this URL.';
  return new Response(body, { headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
}
const BUILD_ID = '2026-06-10-r255';
const DEV_PANEL = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Websprout Developer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#06090c;color:#d7e3ea;padding:24px;max-width:1180px;margin:0 auto}
h1{font-size:21px;font-weight:800;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.sub{color:rgba(215,227,234,.45);font-size:12px}
.top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.rl{font-size:13px;color:rgba(215,227,234,.6);cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.rl:hover{background:rgba(255,255,255,.06)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(124px,1fr));gap:10px;margin-bottom:22px}
.card{background:#0c1218;border:1px solid rgba(56,139,189,.22);border-radius:12px;padding:14px}
.card .n{font-size:24px;font-weight:800;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.card .l{font-size:10px;color:rgba(215,227,234,.45);margin-top:2px;text-transform:uppercase;letter-spacing:.6px}
h2{font-size:14px;font-weight:700;margin:24px 0 10px;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.chip{font-size:12px;padding:6px 11px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#0c1218;display:flex;align-items:center;gap:7px}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ok{background:#34d399}.no{background:#f87171}
.wrap{background:#0c1218;border:1px solid rgba(56,139,189,.16);border-radius:12px;padding:4px;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12.5px}
th{text-align:left;color:rgba(215,227,234,.4);font-weight:600;padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.08);font-size:10px;text-transform:uppercase;letter-spacing:.5px}
td{padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}
tr:hover td{background:rgba(56,139,189,.06)}
a{color:#5cc8ff;text-decoration:none}.muted{color:rgba(215,227,234,.34)}.err{color:#fca5a5;padding:20px;text-align:center}
.mono{font-family:ui-monospace,Menlo,Consolas,monospace}
</style></head><body>
<div class="top"><div><h1>&#128736;&#65039; Websprout Developer</h1><div class="sub">System, integrations, logs &amp; data store &middot; developer access</div></div><div class="rl" id="refresh">&#8635; Refresh</div></div>
<div id="sysline" class="sub" style="margin-bottom:16px">Loading&hellip;</div>
<h2>Integrations</h2>
<div id="ints" class="chips"></div>
<h2>Data store</h2>
<div id="cards" class="cards"></div>
<h2>Recent errors <span id="errCount" class="muted" style="font-weight:400;font-size:12px"></span></h2>
<div class="wrap"><table><thead><tr><th>When</th><th>Where</th><th>Message</th><th>Source</th><th>Build</th></tr></thead><tbody id="ebody"><tr><td colspan="5" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Published sites</h2>
<div class="wrap"><table><thead><tr><th>Address</th><th>Site ID</th><th>Size</th><th>Updated</th><th>Badge</th></tr></thead><tbody id="pbody"><tr><td colspan="5" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Custom domains</h2>
<div class="wrap"><table><thead><tr><th>Domain</th><th>Points to</th></tr></thead><tbody id="dbody"><tr><td colspan="2" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<script>
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '<span class="muted">&mdash;</span>';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function kb(n){if(!n)return '<span class="muted">&mdash;</span>';return (n/1024).toFixed(1)+' KB';}
function card(n,l){return '<div class="card"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';}
function chip(label,on){return '<div class="chip"><span class="dot '+(on?'ok':'no')+'"></span>'+label+'</div>';}
function fileOf(p){p=String(p||'');var parts=p.split('/');return parts[parts.length-1];}
function load(){
  fetch('/dev/data').then(function(r){return r.json();}).then(function(j){
    if(j.error){document.getElementById('cards').innerHTML='<div class="err">'+esc(j.error)+'</div>';return;}
    var sy=j.system||{},c=j.counts||{},mo=sy.models||{};
    document.getElementById('sysline').innerHTML='Build <b class="mono" style="color:#5cc8ff">'+esc(j.build||'?')+'</b> &middot; '+(sy.geminiKeys||0)+' Gemini key(s) &middot; free-gen limit '+(sy.freeGenLimit||0)+' &middot; models: free '+esc(mo.free||'')+', pro '+esc(mo.pro||'')+' &middot; loaded '+new Date(j.now||Date.now()).toLocaleString();
    var ig=sy.integrations||{};
    document.getElementById('ints').innerHTML=chip('KV store',ig.kv)+chip('Gemini ('+(sy.geminiKeys||0)+')',(sy.geminiKeys||0)>0)+chip('Resend email',ig.resend)+chip('Stripe secret',ig.stripeSecret)+chip('Stripe webhook',ig.stripeWebhook)+chip('Google OAuth',ig.googleOAuth);
    document.getElementById('cards').innerHTML=card(c.users||0,'Users')+card(c.published||0,'Published')+card(c.leads||0,'Leads')+card(c.views||0,'View keys')+card(c.sessions||0,'Sessions')+card(c.drafts||0,'Drafts')+card(c.gencounts||0,'Gen counters')+card(c.invoices||0,'Invoices')+card(c.domains||0,'Domains')+card(c.errors||0,'Error logs');
    var es=j.errors||[],eb='';
    if(!es.length)eb='<tr><td colspan="5" class="muted" style="padding:18px">No errors logged \uD83C\uDF89</td></tr>';
    for(var x=0;x<es.length;x++){var er=es[x];eb+='<tr><td class="muted" style="white-space:nowrap">'+dt(er.ts)+'</td><td>'+esc(er.where||'')+'</td><td style="max-width:400px"><div style="color:#fca5a5;word-break:break-word">'+esc(er.msg||'')+'</div>'+(er.url?'<div class="muted" style="font-size:11px;word-break:break-all">'+esc(er.url)+'</div>':'')+'</td><td class="muted mono" style="font-size:11px;white-space:nowrap">'+esc(fileOf(er.src))+(er.line?(':'+esc(er.line)):'')+'</td><td class="muted mono" style="font-size:11px">'+esc(String(er.build||'').replace('2026-06-10-',''))+'</td></tr>';}
    document.getElementById('ebody').innerHTML=eb;
    var ec=document.getElementById('errCount');if(ec)ec.textContent=es.length?('('+es.length+' shown)'):'';
    var ps=j.published||[],pb='';
    if(!ps.length)pb='<tr><td colspan="5" class="muted" style="padding:18px">None yet</td></tr>';
    for(var k=0;k<ps.length;k++){var p=ps[k];pb+='<tr><td><a href="https://'+esc(p.slug)+'.websprout.app" target="_blank">'+esc(p.slug)+'</a></td><td class="muted mono" style="font-size:11px">'+esc(p.siteId||'')+'</td><td class="muted">'+kb(p.size)+'</td><td class="muted">'+dt(p.updated)+'</td><td>'+(p.nobadge?'<span class="muted">none (Pro)</span>':'shown')+'</td></tr>';}
    document.getElementById('pbody').innerHTML=pb;
    var ds=j.domains||[],db='';
    if(!ds.length)db='<tr><td colspan="2" class="muted" style="padding:18px">None yet</td></tr>';
    for(var d2=0;d2<ds.length;d2++){var dm=ds[d2];db+='<tr><td>'+esc(dm.host)+'</td><td class="muted mono">'+esc(dm.slug)+'</td></tr>';}
    document.getElementById('dbody').innerHTML=db;
  }).catch(function(){document.getElementById('cards').innerHTML='<div class="err">Could not load &mdash; confirm you have developer access and are signed in.</div>';});
}
document.getElementById('refresh').addEventListener('click',load);
load();
</script></body></html>`;

async function isDeveloper(s, env){
  if(!s) return false;
  const em = (s.email||'').toLowerCase();
  if(em === SUPPORT_EMAIL.toLowerCase()) return true;
  try { const u = JSON.parse((env.KV && await env.KV.get('user:' + em)) || '{}'); return !!(u && u.dev); } catch(e){ return false; }
}
async function doDevPage(request, env){
  const s = await getSession(request, env);
  if(!(await isDeveloper(s, env))){
    return new Response('<!DOCTYPE html><meta charset="utf-8"><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;text-align:center;padding:60px"><h2>Developer access only</h2><p style="color:#9bb">Ask the owner to grant your account developer access, then return to <a href="/dev" style="color:#4ade80">/dev</a>.</p></body>', { status:403, headers:{ 'Content-Type':'text/html; charset=utf-8' } });
  }
  return new Response(DEV_PANEL, { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
}
async function doDevData(request, env){
  const s = await getSession(request, env);
  if(!(await isDeveloper(s, env))) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  if(!env.KV) return succeed({ build: BUILD_ID, now: Date.now(), system:{}, counts:{}, errors:[], published:[], domains:[] });
  async function kvCount(prefix){ let c=0, cur=undefined, g=0; do{ const r=await env.KV.list({ prefix, cursor:cur, limit:1000 }); c+=r.keys.length; cur=r.list_complete?null:r.cursor; g++; } while(cur && g<25); return c; }
  const counts = {
    users: await kvCount('user:'),
    sessions: await kvCount('sess:'),
    drafts: await kvCount('draft:'),
    published: await kvCount('pubmeta:'),
    leads: await kvCount('form:'),
    views: await kvCount('views:'),
    errors: await kvCount('clienterr:'),
    invoices: await kvCount('invoice:'),
    domains: await kvCount('domain:'),
    gencounts: await kvCount('gencount:')
  };
  const errors=[];
  try{ const r=await env.KV.list({ prefix:'clienterr:', limit:1000 }); const names=r.keys.map(function(k){return k.name;}).sort().reverse().slice(0,80); for(const nm of names){ try{ errors.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} } }catch(e){}
  const published=[];
  try{ let cur=undefined, g=0; do{ const r=await env.KV.list({ prefix:'pubmeta:', cursor:cur, limit:1000 }); for(const k of r.keys){ const slug=k.name.slice(8); try{ const m=JSON.parse(await env.KV.get(k.name)||'{}'); let size=0; try{ const h=await env.KV.get('pub:'+slug); size=h?h.length:0; }catch(e){} published.push({ slug, siteId:m.siteId||'', updated:m.updated||0, nobadge:!!m.nobadge, size }); }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur && g<10); }catch(e){}
  published.sort(function(a,b){return (b.updated||0)-(a.updated||0);});
  const domains=[];
  try{ const r=await env.KV.list({ prefix:'domain:', limit:1000 }); for(const k of r.keys){ try{ const sl=await env.KV.get(k.name); domains.push({ host:k.name.slice(7), slug:sl||'' }); }catch(e){} } }catch(e){}
  let geminiCount=0; try{ geminiCount=geminiKeys(env).length; }catch(e){}
  const system = {
    geminiKeys: geminiCount,
    freeGenLimit: FREE_GEN_LIMIT,
    models: { free:'gemini-2.5-flash', pro:'gemini-2.5-pro' },
    integrations: {
      kv: !!env.KV,
      resend: !!env.RESEND_API_KEY,
      stripeSecret: !!env.STRIPE_SECRET_KEY,
      stripeWebhook: !!(env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET_TEST),
      googleOAuth: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
    }
  };
  return succeed({ build: BUILD_ID, now: Date.now(), system, counts, errors, published, domains });
}

async function doStripeWebhook(request, env){
  const raw = await request.text();
  const secrets = [env.STRIPE_WEBHOOK_SECRET, env.STRIPE_WEBHOOK_SECRET_TEST].filter(Boolean);
  if(!secrets.length) return new Response('webhook not configured', { status:503 });
  const sig = request.headers.get('stripe-signature');
  let okSig = false;
  for(const sec of secrets){ if(await verifyStripeSig(raw, sig, sec)){ okSig = true; break; } }
  if(!okSig) return new Response('bad signature', { status:400 });
  let ev={}; try{ ev=JSON.parse(raw); }catch(e){ return new Response('bad json', { status:400 }); }
  try{
    const obj=(ev.data&&ev.data.object)||{};
    const cust=obj.customer||'';
    if(ev.type==='checkout.session.completed'){
      const email=(obj.client_reference_id||obj.customer_email||(obj.customer_details&&obj.customer_details.email)||'').toLowerCase();
      if(email) await setUserPlan(env, email, 'pro', cust, obj.subscription||'');
    } else if(ev.type==='invoice.paid'||ev.type==='invoice.payment_succeeded'){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'pro', cust, obj.subscription||'');
    } else if(ev.type==='customer.subscription.deleted'||ev.type==='invoice.payment_failed'){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'free', cust, '');
    } else if(ev.type==='customer.subscription.updated'){
      const st=obj.status||''; const em=cust?await env.KV.get('stripecust:'+cust):'';
      if(em) await setUserPlan(env, em, (st==='active'||st==='trialing')?'pro':'free', cust, obj.id||'');
    }
  }catch(e){}
  return new Response('{"received":true}', { headers:{ 'Content-Type':'application/json' } });
}

// ── Saved sites: let users return and keep editing ──
async function doSave(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.siteId || !b.key || !b.html) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    if (b.html.length > 4*1024*1024) return fail('Site too large');
    var _dft = { html: b.html, name: (b.name||'My site').slice(0,90), ts: Date.now() };
    if (Array.isArray(b.pages) && b.pages.length > 1) {
      var _pgs = b.pages.slice(0,12).map(function(p){ return { path: String(p.path||''), title: String(p.title||'').slice(0,60), html: String(p.html||'') }; });
      var _tot = 0; for (var _pi=0; _pi<_pgs.length; _pi++) _tot += _pgs[_pi].html.length;
      if (_tot <= 12*1024*1024) _dft.pages = _pgs;
    }
    await env.KV.put('draft:' + b.siteId, JSON.stringify(_dft), { expirationTtl: 60*60*24*365 });
    try {
      const s = await getSession(request, env);
      if (s && s.email) {
        const lk = 'usersites:' + s.email;
        let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
        let found = false;
        for (let i=0;i<list.length;i++){ if(list[i].siteId===b.siteId){ list[i].name=(b.name||list[i].name); list[i].key=b.key; list[i].ts=Date.now(); found=true; break; } }
        if(!found) list.push({ siteId:b.siteId, key:b.key, name:(b.name||'My site'), ts:Date.now() });
        list.sort(function(a,c){ return (c.ts||0)-(a.ts||0); });
        if(list.length>100) list=list.slice(0,100);
        await env.KV.put(lk, JSON.stringify(list));
      }
    } catch(e){}
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}
async function doMySites(request, env){
  const s = await getSession(request, env);
  if (!s || !s.email) return succeed({ auth:false, sites:[] });
  let list = []; try { list = JSON.parse(await env.KV.get('usersites:'+s.email) || '[]'); } catch(e){}
  return succeed({ auth:true, sites:list });
}
async function doMySitesClaim(request, env){
  try {
    const s = await getSession(request, env);
    if (!s || !s.email) return fail('Not signed in');
    const b = await request.json();
    if (!Array.isArray(b.sites)) return succeed({ ok:true });
    const lk = 'usersites:'+s.email;
    let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
    const map = {}; list.forEach(function(p){ map[p.siteId]=p; });
    for (const it of b.sites){
      if (!it || !it.siteId || !it.key) continue;
      if (it.key !== (await siteKey(it.siteId, env))) continue;
      const ex = map[it.siteId];
      if (!ex || (it.ts||0) > (ex.ts||0)) map[it.siteId] = { siteId:it.siteId, key:it.key, name:(it.name||'My site'), ts:(it.ts||Date.now()) };
    }
    let merged = Object.keys(map).map(function(k){ return map[k]; });
    merged.sort(function(a,c){ return (c.ts||0)-(a.ts||0); });
    if (merged.length>100) merged = merged.slice(0,100);
    await env.KV.put(lk, JSON.stringify(merged));
    return succeed({ ok:true, count:merged.length });
  } catch(e){ return fail(e.message); }
}
async function doMySitesDelete(request, env){
  try {
    const s = await getSession(request, env);
    if (!s || !s.email) return succeed({ ok:true });
    const b = await request.json();
    if (!b.siteId) return fail('Missing siteId');
    const lk = 'usersites:'+s.email;
    let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
    list = list.filter(function(x){ return x.siteId !== b.siteId; });
    await env.KV.put(lk, JSON.stringify(list));
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

async function doBillingPortal(request, env){
  const sess = await getSession(request, env);
  if(!sess || !sess.email) return fail('Please sign in.');
  const sk = (env.STRIPE_SECRET_KEY||'').trim();
  if(!sk) return fail('Billing is not set up yet.');
  const eml = (sess.email||'').toLowerCase();
  let u={}; try{ u = JSON.parse(await env.KV.get('user:'+eml) || '{}'); }catch(e){}
  const cust = u && u.stripeCustomer;
  if(!cust) return fail('No paid subscription is attached to this account. If this seems wrong, email support@websprout.app.');
  try{
    const origin = new URL(request.url).origin;
    const params = 'customer='+encodeURIComponent(cust)+'&return_url='+encodeURIComponent(origin+'/');
    const r = await fetch('https://api.stripe.com/v1/billing_portal/sessions', { method:'POST', headers:{ 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' }, body: params });
    const j = await r.json();
    if(j && j.url) return succeed({ url: j.url });
    return fail((j && j.error && j.error.message) || 'Could not open the billing portal.');
  }catch(e){ return fail('Could not reach Stripe. Please try again.'); }
}

async function doAccountExport(request, env){
  const sess = await getSession(request, env);
  if(!sess || !sess.email) return fail('Please sign in.');
  if(!env.KV) return fail('Storage not configured.');
  const em = sess.email; const eml = (em||'').toLowerCase();
  async function gj(k){ try{ const v=await env.KV.get(k); return v?JSON.parse(v):null; }catch(e){ return null; } }
  async function gt(k){ try{ return await env.KV.get(k); }catch(e){ return null; } }
  const out = { format:'websprout-data-export-v1', exportedAt:new Date().toISOString(), email: em, account:null, usage:{}, sites:[], invoices:[] };
  out.account = (await gj('user:'+eml)) || (await gj('user:'+em));
  out.usage.generations = parseInt((await gt('gencount:'+eml)) || (await gt('gencount:'+em)) || '0', 10) || 0;
  out.usage.sitesPublished = parseInt((await gt('bcount:'+eml)) || (await gt('bcount:'+em)) || '0', 10) || 0;
  try{ const inv = await env.KV.list({ prefix:'invoice:'+eml+':', limit:1000 }); for(const k of inv.keys){ const v=await gj(k.name); if(v) out.invoices.push(v); } }catch(e){}
  let list=[]; try{ list = JSON.parse((await gt('usersites:'+em)) || (await gt('usersites:'+eml)) || '[]'); }catch(e){}
  for(const it of list){
    const sid = it && it.siteId; if(!sid) continue;
    const site = { siteId:sid, name:(it.name||''), savedAt:(it.ts||null) };
    site.draft = await gj('draft:'+sid);
    site.products = await gj('products:'+sid);
    site.leadsNotifyEmail = await gt('notify:'+sid);
    const slug = await gt('slugof:'+sid);
    if(slug){
      site.publishedSlug = slug;
      site.publishedMeta = await gj('pubmeta:'+slug);
      site.publishedHtml = await gt('pub:'+slug);
      const paths = await gj('pubpages:'+slug);
      if(Array.isArray(paths) && paths.length){ site.publishedPages={}; for(const p of paths){ site.publishedPages[p] = await gt('pub:'+slug+':'+p); } }
    }
    try{ const fl = await env.KV.list({ prefix:'form:'+sid+':', limit:1000 }); if(fl.keys.length){ site.leads=[]; for(const k of fl.keys){ const v=await gj(k.name); if(v) site.leads.push(v); } } }catch(e){}
    try{ const rl = await env.KV.list({ prefix:'review:'+sid+':', limit:1000 }); if(rl.keys.length){ site.reviews=[]; for(const k of rl.keys){ const v=await gj(k.name); if(v) site.reviews.push(v); } } }catch(e){}
    out.sites.push(site);
  }
  try{ out.activity=[]; let _c=undefined,_g=0; do{ const _r=await env.KV.list({ prefix:'evt:', cursor:_c, limit:1000 }); for(const _k of _r.keys){ if(_k.metadata && (_k.metadata.e||'')===eml) out.activity.push(_k.metadata); } _c=_r.list_complete?null:_r.cursor; _g++; }while(_c && _g<5 && out.activity.length<2000); }catch(e){}
  return new Response(JSON.stringify(out, null, 2), { status:200, headers:{ 'Content-Type':'application/json; charset=utf-8', 'Content-Disposition':'attachment; filename="websprout-my-data.json"', 'Cache-Control':'no-store' } });
}

async function doAccountDelete(request, env){
  const sess = await getSession(request, env);
  if(!sess || !sess.email) return fail('Please sign in.');
  if(!env.KV) return fail('Storage not configured.');
  let body={}; try{ body = await request.json(); }catch(e){}
  if(((body && body.confirm)||'') !== 'DELETE') return fail('Type DELETE to confirm.');
  const em = sess.email; const eml = (em||'').toLowerCase();
  async function gt(k){ try{ return await env.KV.get(k); }catch(e){ return null; } }
  async function del(k){ try{ await env.KV.delete(k); }catch(e){} }
  async function delPrefix(prefix){ try{ let cur, g=0; do{ const r=await env.KV.list({ prefix, cursor:cur, limit:1000 }); for(const k of r.keys){ await env.KV.delete(k.name); } cur=r.list_complete?null:r.cursor; g++; }while(cur && g<25); }catch(e){} }
  let list=[]; try{ list = JSON.parse((await gt('usersites:'+em)) || (await gt('usersites:'+eml)) || '[]'); }catch(e){}
  let n=0;
  for(const it of list){
    const sid = it && it.siteId; if(!sid) continue;
    const slug = await gt('slugof:'+sid);
    if(slug){
      try{ const paths=JSON.parse((await gt('pubpages:'+slug))||'[]'); for(const p of paths){ await del('pub:'+slug+':'+p); } }catch(e){}
      await del('pub:'+slug); await del('pubpages:'+slug); await del('pubmeta:'+slug); await del('slugof:'+sid);
    }
    await del('draft:'+sid); await del('products:'+sid); await del('notify:'+sid); await del('revnotify:'+sid); await del('reviewsPub:'+sid);
    await delPrefix('form:'+sid+':'); await delPrefix('review:'+sid+':'); await delPrefix('views:'+sid+':');
    n++;
  }
  await delPrefix('invoice:'+eml+':'); await delPrefix('invoice:'+em+':');
  try{ let _c=undefined,_g=0; do{ const _r=await env.KV.list({ prefix:'evt:', cursor:_c, limit:1000 }); for(const _k of _r.keys){ if(_k.metadata && (_k.metadata.e||'')===eml){ await del(_k.name); } } _c=_r.list_complete?null:_r.cursor; _g++; }while(_c && _g<6); }catch(e){}
  await del('user:'+eml); await del('user:'+em);
  await del('gencount:'+eml); await del('gencount:'+em);
  await del('bcount:'+eml); await del('bcount:'+em);
  await del('usersites:'+em); await del('usersites:'+eml);
  try{ const t=parseCookies(request)['ws_sess']; if(t) await del('sess:'+t); }catch(e){}
  return new Response(JSON.stringify({ ok:true, deletedSites:n }), { status:200, headers:{ 'Content-Type':'application/json', 'Set-Cookie':'ws_sess=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0', 'Cache-Control':'no-store' } });
}

async function doLoad(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const v = await env.KV.get('draft:' + site);
    if (!v) return fail('Not found');
    return new Response(v, { headers: { 'Content-Type':'application/json' } });
  } catch(e){ return fail(e.message); }
}

// Auto-detect the business type from the prompt and inject an industry-specific
// playbook so generated sites have the sections, forms, copy and tone that the
// niche actually needs. First match wins; returns '' for unrecognized types.
function getNicheDirection(prompt){
  const p = ' ' + String(prompt||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ') + ' ';
  const niches = [
    { k:[' charter','yacht','marina','sailing',' sail ','boat detail','boat rental','boat tour',' captain ','pontoon','jet ski','deep sea','fishing trip','fishing charter',' vessel',' boating',' boats',' boat '],
      block:'INDUSTRY PLAYBOOK — Marine & Charter. This is a boating or charter business (charters, fishing trips, boat rentals, boat detailing, or marina services). Beyond the standard sections, you MUST include: a FLEET / OUR BOATS section listing each vessel with length, guest capacity and standout features; a TRIPS & PACKAGES section (for example half-day, full-day, sunset, or fishing) with what is included and from-pricing; a CAPTAIN & CREW section establishing USCG licensing, years on the water and a safety-first reputation; a WHERE WE SAIL / SERVICE AREA section naming the home marina and the waters covered; and a guest PHOTO GALLERY of trips on the water. The inquiry/booking form must capture name, email, phone, preferred date, number of guests, and trip type. Use confident nautical language (book your charter, come aboard, set sail). Imagery should evoke open water, sunsets on the bay, and happy guests aboard. Tone: adventurous yet trustworthy and safety-conscious.' },
    { k:['auto repair',' mechanic','car detail','auto detail',' tires','body shop','oil change','transmission','automotive',' car wash','brake','windshield'],
      block:'INDUSTRY PLAYBOOK — Automotive. This is an auto business (repair, mechanic, detailing, tires, or body shop). Beyond the standard sections, include: a SERVICES list with clear descriptions; a prominent BOOK SERVICE / SCHEDULE APPOINTMENT call-to-action; a WHY CHOOSE US section emphasizing certified technicians, honest pricing and warranties; and SERVICE AREA plus HOURS. The form must capture name, phone, vehicle make, model and year, and the service needed. Use honest, dependable, no-runaround language. Tone: trustworthy and straightforward.' },
    { k:['plumb','electrician','electrical',' hvac','heating','air condition','furnace','landscap',' lawn ','roofing',' roofer','handyman','contractor','pest control','cleaning service','maid service','junk removal',' painter','house painting',' fencing','concrete','pressure wash','power wash','septic','gutter','drywall','remodel'],
      block:'INDUSTRY PLAYBOOK — Home Services & Trades. This is a local service business (plumbing, electrical, HVAC, landscaping, roofing, cleaning, handyman, pest control, and similar). Beyond the standard sections, include: a SERVICES section listing each specific service with a one-line benefit; a SERVICE AREA section naming the towns or zip codes covered; a WHY CHOOSE US section emphasizing licensed and insured, years in business, and a satisfaction guarantee; clear emergency or same-day availability when relevant; and a BEFORE & AFTER or recent-work gallery. The form must be a FREE ESTIMATE request capturing name, phone, email, service needed, property address or zip, and a short message. Put the phone number and a Get a Free Estimate button in the header and hero. Tone: reliable, prompt, neighborly.' },
    { k:[' salon',' spa ','barber',' hair ','hair salon','nails',' nail ',' lash','brows','eyebrow','massage','esthetic','makeup','waxing',' tattoo','tanning',' beauty'],
      block:'INDUSTRY PLAYBOOK — Salon, Spa & Beauty. This is a beauty or grooming business (hair, nails, lashes, barber, spa, massage, or esthetics). Beyond the standard sections, include: a SERVICES & PRICING menu listing each treatment with duration and price; a BOOK AN APPOINTMENT call-to-action repeated throughout; an OUR TEAM / STYLISTS section; and a GALLERY of real work. The form must capture name, phone, the service wanted, and preferred date and time. Use polished, pampering language. Tone: clean, stylish and inviting.' },
    { k:[' gym',' fitness','personal train','yoga','pilates','crossfit','martial art','dance studio','workout','bootcamp','wellness center',' trainer'],
      block:'INDUSTRY PLAYBOOK — Fitness & Wellness. This is a fitness business (gym, studio, personal trainer, yoga, pilates, martial arts, or crossfit). Beyond the standard sections, include: a CLASSES or PROGRAMS section with a schedule and descriptions; MEMBERSHIP or PRICING tiers; a TRAINERS / INSTRUCTORS section; and a strong FREE TRIAL or FIRST CLASS FREE offer used as the primary call-to-action. The form should capture name, email, fitness goal, and a free-trial request. Use motivating, high-energy copy. Tone: energetic and encouraging.' },
    { k:['real estate','realtor','real-estate',' realty','homes for sale','property listing',' broker '],
      block:'INDUSTRY PLAYBOOK — Real Estate. This is a real estate agent or brokerage. Beyond the standard sections, include: a FEATURED LISTINGS area; an ABOUT THE AGENT section establishing local expertise and track record; separate BUYING and SELLING service sections; a HOME VALUATION (What is my home worth?) request; and the NEIGHBORHOODS or SERVICE AREAS served. The form should capture name, email, phone, whether they are buying or selling, and their property interest. Tone: professional, approachable, and locally expert.' },
    { k:['lawyer','attorney','law firm','accountant','accounting',' cpa ','consulting','consultant','financial advisor','insurance agency','bookkeep','tax prep','advisory'],
      block:'INDUSTRY PLAYBOOK — Professional Services. This is a professional practice (law, accounting, consulting, financial, or insurance). Beyond the standard sections, include: a PRACTICE AREAS or SERVICES section; an ABOUT section establishing credentials and experience; a clear FREE CONSULTATION request; a HOW IT WORKS / process section; and results or client testimonials. The form should capture name, email, phone, the nature of their need, and a message. Use authoritative, reassuring language and avoid hype. Tone: credible, professional, and calm.' },
    { k:['photograph','videograph','wedding','event plan',' dj ','florist','floral','photo studio','cinematograph'],
      block:'INDUSTRY PLAYBOOK — Photography & Events. This is a creative or events business (photographer, videographer, wedding pro, DJ, florist, or planner). Beyond the standard sections, lead with a prominent PORTFOLIO / GALLERY that dominates the page; include PACKAGES & PRICING; an inquiry or booking section; and an ABOUT section with personality. The form should capture name, email, event date, event type, and location. Let visuals lead. Tone: artistic, warm, and personable.' },
    { k:['restaurant',' cafe',' caf ','coffee shop','bakery','bistro',' diner','eatery','pizzeria','food truck','catering',' grill ',' brewery','steakhouse','taqueria',' deli ',' bar '],
      block:'INDUSTRY PLAYBOOK — Restaurant & Food. This is a food business (restaurant, cafe, bakery, bar, food truck, or catering). Beyond the standard sections, include: a real MENU section organized by category with dish names, short descriptions and prices; an HOURS & LOCATION section with the address and an obvious map area; a reservations or online-order call-to-action; and an appetizing PHOTO GALLERY of signature dishes and the space. The form should support reservations: name, phone, date, time, and party size. Use warm, sensory, appetizing copy. Tone: inviting and flavorful.' }
  ];
  for (let i=0;i<niches.length;i++){ for (let j=0;j<niches[i].k.length;j++){ if (p.indexOf(niches[i].k[j]) > -1) return '\n\n' + niches[i].block; } }
  return '';
}

async function doGenImage(request, env) {
  const s = await getSession(request, env);
  if (!s) return fail('Please sign in to generate images.');
  let isPro = false;
  try {
    const isOwner = (s.email||'').toLowerCase() === SUPPORT_EMAIL.toLowerCase();
    const u = JSON.parse((env.KV && await env.KV.get('user:'+(s.email||'').toLowerCase())) || '{}');
    isPro = isOwner || u.plan === 'pro';
  } catch (e) {}
  if (!isPro) return fail('AI image generation is a Pro feature \u2014 go Pro to unlock it.');
  let body; try { body = await request.json(); } catch { return fail('Invalid request'); }
  const prompt = (body.prompt || '').trim();
  if (!prompt) return fail('Describe the image you want.');
  const keys = geminiKeys(env);
  if (!keys.length) return fail('Image generation is not configured.');
  const reqBody = JSON.stringify({
    contents: [{ parts: [{ text: 'A high-quality, professional photographic image suitable for a website. ' + prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] }
  });
  let lastErr = 'Could not generate an image. Try a simpler description.';
  for (let i = 0; i < keys.length; i++) {
    try {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + keys[i], {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: reqBody
      });
      const j = await r.json();
      if (j.error) { lastErr = j.error.message || lastErr; continue; }
      const parts = ((((j.candidates || [])[0] || {}).content) || {}).parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return succeed({ image: 'data:' + (part.inlineData.mimeType || 'image/png') + ';base64,' + part.inlineData.data });
        }
      }
    } catch (e) { lastErr = 'Image service error.'; }
  }
  return fail(lastErr);
}
function buildPostPrompt(kind, topic, ctx){
  const kinds = {
    social: 'a short, punchy social media post (2-4 sentences) with a strong hook and 3-5 relevant hashtags',
    blog: 'a short blog post of about 200-300 words with a clear headline and 2-3 tight paragraphs',
    email: 'a friendly marketing email: a subject line on the first line, then a 120-180 word body ending with a clear call to action',
    promo: 'a promotional announcement of 3-5 sentences highlighting an offer or news, energetic, ending with a call to action',
    sms: 'a very short SMS/text blast under 160 characters with one clear call to action'
  };
  const want = kinds[kind] || kinds.social;
  let p = 'You are a sharp marketing copywriter. Write ' + want + ' for this business. Use a confident, on-brand voice. No cliches, no Lorem Ipsum, no placeholder brackets. Output ONLY the copy itself \u2014 no preamble, no "here is", no explanation.\n\nBusiness context:\n' + (ctx || 'a small local business');
  if(topic) p += '\n\nFocus the piece specifically on: ' + topic;
  return p;
}
async function doWritePost(request, env){
  const s = await getSession(request, env);
  if(!s) return fail('Please sign in.');
  let isPro=false;
  try{ const isOwner=(s.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase(); const u=JSON.parse((env.KV&&await env.KV.get('user:'+(s.email||'').toLowerCase()))||'{}'); isPro=isOwner||u.plan==='pro'; }catch(e){}
  if(!isPro) return fail('Marketing copy is a Pro feature \u2014 go Pro to unlock it.');
  let body; try{ body=await request.json(); }catch(e){ return fail('Invalid request'); }
  const kind=String(body.kind||'social').slice(0,20);
  const topic=String(body.topic||'').slice(0,300);
  const ctx=String(body.context||'').slice(0,2000);
  const keys=geminiKeys(env);
  if(!keys.length) return fail('Not configured.');
  const reqBody = JSON.stringify({ contents:[{ parts:[{ text: buildPostPrompt(kind, topic, ctx) }] }], generationConfig:{ maxOutputTokens:1200, temperature:0.9 } });
  const result = await callGemini(keys, reqBody, 'gemini-2.5-flash');
  if(result.error) return fail(result.error);
  let text='';
  try{ const parts=(((result.data.candidates||[])[0]||{}).content||{}).parts||[]; text=parts.map(function(p){return p.text||'';}).join(''); }catch(e){}
  text=(text||'').trim();
  if(!text) return fail('Could not generate \u2014 try again.');
  return succeed({ text: text });
}
// Free accounts can generate this many sites before Pro is required. Generation is the real
// per-use cost (a metered Gemini call), so this both caps spend and creates the upgrade moment.
const FREE_GEN_LIMIT = 10;
function pickN(arr, n){
  var copy = arr.slice(), out = [];
  for (var i = 0; i < n && copy.length; i++) { out.push(copy.splice(Math.floor(Math.random()*copy.length), 1)[0]); }
  return out;
}
function varietyBrief(prompt){
  var heroes = [
    'AURORA HERO: a dark, rich animated gradient/aurora-mesh background with 2-3 large blurred color blobs drifting slowly. Build: absolutely-positioned blurred (filter:blur(60px)) radial blobs animated with @keyframes slowly translating/scaling behind the content; bold light headline on top.',
    'SPLIT HERO: headline, subhead and CTAs on the left; on the right a framed visual (a stylized stat/quote card, a floating mini UI mockup, or an image slot in a tilted rounded frame). Build: a 2-column grid that stacks on mobile; the right frame uses rounded corners, a soft shadow and a slight rotate for a floating feel.',
    'TYPEWRITER HERO: the headline ends in a word that types and retypes through 3 rotating phrases. Build: a trailing span; JS holds an array of phrases and types then deletes each character on a timer (type ~70ms, delete ~40ms, pause ~1.2s) with a blinking caret.',
    'KINETIC GRADIENT HERO: a huge centered headline where 1-2 key words use an ANIMATED moving gradient text fill. Build: those words get background:linear-gradient(...); -webkit-background-clip:text; background-clip:text; color:transparent; with @keyframes animating background-position; minimal background otherwise.',
    'EDITORIAL HERO: an oversized display headline, lots of whitespace, a thin rule, a small kicker label above, and an asymmetric magazine-like layout.',
    'SPOTLIGHT HERO: a dark hero where a soft radial light follows the cursor; crisp bright headline. Build: a layer with background:radial-gradient(circle at var(--mx) var(--my), rgba(light,.18), transparent 40%); pointermove on the hero sets --mx/--my.',
    'DUOTONE IMAGE HERO: a full-bleed image slot covered by a bold duotone overlay with a crisp contrasting headline and one strong CTA. Build: the image slot with an overlay using a two-color linear-gradient at ~0.7 opacity (or mix-blend-mode) for the duotone wash; headline above with guaranteed contrast.',
    'GRID-MATRIX HERO: a techy hero with a faint animated dot/line grid or a slow scanning beam and a sharp centered headline (great for tech, trades, automotive, fitness). Build: a background layer using repeating-linear-gradient grid lines or a radial dot pattern at low opacity, optionally with a slow translate or a sweeping linear-gradient beam via @keyframes.',
    'CARD-STACK HERO: headline and CTAs on one side; on the other a small stack of slightly rotated overlapping cards/photos that fan out or straighten on load. Build: 3 absolutely-positioned cards with small different rotate()/offsets that animate to a neat fan or upright on load via transition or @keyframes.'
  ];
  var features = [
    'BEFORE/AFTER SLIDER: a draggable divider that wipes between two stacked images to compare results (great for trades, cleaning, beauty, fitness, dental, design). Build: a relative box of fixed px height with both images absolutely filling it; the TOP image lives in a wrapper with overflow:hidden whose width is a % updated on pointermove/touchmove from the cursor X; a vertical handle bar with a round grip sits at that width; start at 50%.',
    'COUNT-UP STATS: key numbers count up from 0 when scrolled into view. Build: each number carries a data-target; an IntersectionObserver fires ONCE on enter, then requestAnimationFrame eases textContent from 0 to target over ~1.4s, preserving any suffix like + or %.',
    'TESTIMONIAL CAROUSEL: one rotating testimonial that auto-advances with dots/arrows. Build: slides in a flex row inside an overflow:hidden frame; a JS index sets transform:translateX(-index*100%); setInterval(5000) advances; dots/arrows set index; clearInterval on mouseenter, restart on mouseleave.',
    'FLIP CARDS: cards that flip to reveal detail on the back (hover desktop, tap mobile). Build: outer card has perspective:1000px; an inner div with transform-style:preserve-3d transitions to rotateY(180deg) on hover and on a .flipped class toggled by click; front and back absolutely stacked, back pre-rotated rotateY(180deg), both backface-visibility:hidden.',
    'SPOTLIGHT CARDS: a card grid where a soft radial glow follows the cursor. Build: on pointermove over a card set CSS vars --mx/--my to the cursor offset in px; a ::before with background:radial-gradient(circle at var(--mx) var(--my), accent, transparent) whose opacity rises on hover.',
    'TILT CARDS: cards that tilt in 3D toward the cursor and spring back. Build: on pointermove read cursor offset from the card center and apply transform:perspective(800px) rotateX(-y*6deg) rotateY(x*6deg); on pointerleave reset transform with a 0.3s transition.',
    'MARQUEE STRIP: one slow horizontal scrolling band of services/taglines on a single line. Build: an overflow:hidden wrapper; an inner track with display:flex; flex-wrap:nowrap; width:max-content animated via @keyframes translateX(0 to -50%); duplicate the item set EXACTLY once for a seamless loop; it must never wrap to a second row.',
    'FAQ ACCORDION: clicking a question smoothly opens its answer, one open at a time. Build: each answer panel has max-height:0; overflow:hidden; transition:max-height .35s; clicking the question sets panel.style.maxHeight to its scrollHeight+px and resets the others to 0; rotate a chevron/plus on the open item.',
    'PRICING TOGGLE: a Monthly/Annual switch that updates prices. Build: a switch toggles an .annual class on the pricing wrapper; each price renders two spans (monthly + annual) and CSS shows only the active one; a sliding knob animates; show a save-X% tag on annual.',
    'LIGHTBOX GALLERY: a photo grid that opens images large in a dark overlay. Build: thumbnails in a grid; clicking opens a position:fixed inset:0 dark overlay showing the large image with a close button and prev/next that change the shown index; clicking the backdrop or pressing Escape closes it.',
    'PROGRESS / SKILL BARS: labeled bars or dials that fill to their value on scroll-in. Build: each bar fill starts at width:0 with a width transition; an IntersectionObserver sets the fill width to its data-value % on enter. Dials use conic-gradient(accent calc(value*1%), track 0) revealed the same way.',
    'SCROLL PROGRESS BAR: a thin accent bar at the very top that fills as you scroll. Build: a fixed top bar; on scroll set its width = scrollY / (document.body.scrollHeight - innerHeight) * 100 + "%".',
    'STICKY REVEAL: a section whose heading stays pinned while its points animate in. Build: a two-column section where the heading column is position:sticky; top:90px; the other column points each get a reveal class that an IntersectionObserver toggles to fade+slide-in as they pass.',
    'MAGNETIC CTA: the primary button pulls toward the cursor, then snaps back. Build: on pointermove within the button plus a small padded zone, translate it by cursor-offset*0.3 in x/y; on pointerleave reset transform with a 0.3s ease.',
    'TABBED SHOWCASE: category tabs that switch content panels. Build: tab buttons carry data-tab ids; clicking sets that button .active (clears siblings) and shows the matching panel while hiding the rest; an underline element animates its left/width to the active tab.',
    'SPLIT-FLAP BOARD: a headline word or stat that flips through characters like a departure board before settling. Build: split the target text into per-character spans; on scroll-in run a per-span setInterval cycling random A-Z/0-9 about 14-18 times at ~45ms, then clearInterval locking the true character; style as monospace dark tiles with a faint center seam line.',
    'PARALLAX DEPTH: background layers drift slower than the foreground on scroll for depth. Build: give bg layers data-speed (0.15-0.4); in a scroll handler wrapped in requestAnimationFrame set transform:translate3d(0, scrollY*speed, 0) on each while foreground stays at normal speed; wrap the effect in a prefers-reduced-motion:no-preference check.',
    'HOVER-REVEAL GRID: a portfolio/team/gallery grid where hovering a tile slides up a detail overlay. Build: each tile is position:relative with the image and an overlay div at transform:translateY(100%);opacity:0; on hover the overlay goes translateY(0);opacity:1 with a .3s transition; toggle a .show class on tap for touch.',
    'SCROLL-SNAP PANELS: a few full-bleed statement panels that snap into place on scroll. Build: a container with scroll-snap-type:y mandatory and overflow-y:auto where each panel has scroll-snap-align:start and a px min-height; one large centered on-brand sentence per panel.',
    'IMAGE-FILL HEADLINE: an oversized headline whose letters are filled with a moving gradient or image. Build: a big headline with background:linear-gradient(...) (or url(image)); -webkit-background-clip:text; background-clip:text; color:transparent; animate background-position with @keyframes for slow movement; include a solid fallback color.',
    'COUNTDOWN TIMER: a live ticking countdown to an event/launch/sale. Build: set a target Date; setInterval(1000) computes remaining days/hours/minutes/seconds and writes them into four labeled boxes; at zero clear the interval and show a final message. Only where the business has a real time element.',
    'SECTION DOT NAV: a vertical dot rail that tracks and jumps between sections. Build: one fixed dot per section id; an IntersectionObserver adds .active to the dot of the section currently in view; clicking a dot calls scrollIntoView({behavior:"smooth"}) on its section.',
    'PROCESS STEPPER: numbered steps along a line that light up one-by-one on scroll. Build: steps along a connecting line (a positioned ::before); an IntersectionObserver adds .active/.done to each step as it enters, coloring the number and filling the line up to it.',
    'GLOW-BORDER CARDS: premium cards with a slowly rotating glowing border. Build: card is position:relative on an opaque background; a ::before slightly larger (inset:-2px) with background:conic-gradient(accent, transparent, accent2, transparent), filter:blur(6px), z-index:-1, animated by @keyframes rotating the gradient or its background-position.'
  ];
  var layouts = [
    'Alternate the visual and text sides down the page in zig-zag rows instead of stacking identical centered blocks.',
    'Use an asymmetric BENTO grid of mixed-size tiles for the features/services section.',
    'Present the process / how-it-works as a vertical TIMELINE with connected steps.',
    'Drop in a bold full-bleed colored statement band with one big sentence between two sections.',
    'Use generous asymmetric whitespace and varied section heights so the page has rhythm instead of uniform centered blocks.',
    'In one major section, keep a short heading or label column pinned (sticky) on one side while the matching content scrolls alongside it.',
    'Let one section pull up over the previous with a rounded top edge and negative margin so sections interlock instead of sitting in flat stacked bands.'
  ];
  var h = heroes[Math.floor(Math.random()*heroes.length)];
  var f = pickN(features, 1 + Math.floor(Math.random()*2));
  var l = layouts[Math.floor(Math.random()*layouts.length)];
  var personalities = [
    'EDITORIAL SERIF: high-contrast serif display headlines (Playfair Display, Fraunces, Cormorant feel) paired with a clean sans body. Refined, magazine-like, generous whitespace. Simple buttons with little or no corner radius. Elegant and timeless.',
    'MODERN GEOMETRIC: a crisp geometric/grotesk sans for everything (Inter, Space Grotesk, Satoshi feel). Build hierarchy with weight and size contrast, not a colored word - keep headlines a single solid color. Rounded-rectangle buttons (8-12px radius). Clean, sharp, confident, product-like.',
    'BOLD CONDENSED: heavy condensed/compressed display headlines, often UPPERCASE (Anton, Oswald, Archivo Black feel) over a clean sans body. Punchy and athletic - big type, tight leading, strong blocks, chunky squared buttons. High-impact and energetic.',
    'WARM ROUNDED: a friendly rounded sans (Poppins, Quicksand, Nunito feel). Large corner radii everywhere, full pill buttons, soft shadows, generous padding. Approachable, human, welcoming.',
    'MINIMAL SWISS: a restrained neutral sans, lots of negative space, a tighter type scale, thin hairline rules and dividers. Near-monochrome - the accent color appears only as a single sparing highlight. Square or minimal buttons. Quiet, precise, expensive-feeling.',
    'BRUTALIST RAW: heavy grotesk type, hard edges and NO rounded corners, thick visible borders and outlines, oversized headlines near the edges, an exposed raw grid, a tight high-contrast palette. Confident and design-forward.',
    'LUXE DARK: an elegant dark base (deep charcoal or ink) with refined serif or high-contrast sans headlines, a jewel-tone or metallic accent, subtle glows and fine detailing, generous spacing. High-end, premium, boutique.'
  ];
  var pp = (prompt || '').toLowerCase();
  function ofp(a){ return a[Math.floor(Math.random()*a.length)]; }
  var ED=personalities[0], GEO=personalities[1], BOLD=personalities[2], WARM=personalities[3], MIN=personalities[4], BRUT=personalities[5], LUXE=personalities[6];
  var per;
  // 1) An explicit vibe chip is a deliberate choice - honor it.
  if (pp.indexOf('modern and minimal')>-1) per = ofp([MIN, GEO]);
  else if (pp.indexOf('bold and colorful')>-1) per = ofp([BOLD, BRUT, WARM]);
  else if (pp.indexOf('warm and friendly')>-1) per = ofp([WARM, ED]);
  else if (pp.indexOf('dark and premium')>-1) per = ofp([LUXE, ED, MIN]);
  else if (pp.indexOf('clean and professional')>-1) per = ofp([GEO, MIN, ED]);
  else if (pp.indexOf('fun and playful')>-1) per = ofp([WARM, BOLD, BRUT]);
  // 2) No chip - fit the personality to the KIND of business (theme fit).
  else if (pp.match(/wedding|bridal|florist|\bflowers\b|event planner/)) per = ofp([ED, WARM, LUXE]);
  else if (pp.match(/jewel|\bluxury\b|boutique|couture|perfume|fine watch/)) per = ofp([LUXE, ED, MIN]);
  else if (pp.match(/coffee|cafe|bakery|restaurant|\bfood\b|bistro|brewery|pizza|sushi|burger|dining|\bchef\b|catering|\bbar\b|eatery|grill|taco|ramen|patisserie/)) per = ofp([ED, WARM, LUXE, MIN]);
  else if (pp.match(/yoga|pilates|wellness|\bspa\b|meditation|mindful|massage|holistic|retreat|therapy|counsel/)) per = ofp([WARM, MIN, ED]);
  else if (pp.match(/\bgym\b|fitness|workout|crossfit|trainer|bootcamp|athletic|martial|boxing|cycling/)) per = ofp([BOLD, GEO]);
  else if (pp.match(/saas|software|\bapp\b|platform|dashboard|analytics|\bcrm\b|\bapi\b|developer|\btech\b|startup|\bai\b|\bcloud\b|\bdata\b|cyber|fintech|automation/)) per = ofp([GEO, MIN, LUXE]);
  else if (pp.match(/portfolio|photograph|\bartist\b|illustrat|creative studio|design studio|architect|filmmaker|\bgallery\b|fashion|\bmodel\b/)) per = ofp([BRUT, ED, MIN, BOLD]);
  else if (pp.match(/\blaw\b|legal|attorney|lawyer|accountant|accounting|finance|financial|insurance|consult|advisor|notary|\bbank\b/)) per = ofp([ED, MIN, GEO]);
  else if (pp.match(/real estate|realtor|property|mortgage|\bbroker\b|realty/)) per = ofp([ED, GEO, LUXE]);
  else if (pp.match(/construction|contractor|plumb|electric|roofing|\bhvac\b|landscap|\bauto\b|mechanic|\btrades\b|welding|excavat|\bmoving\b|junk removal|handyman|pest|paving|concrete/)) per = ofp([BOLD, GEO]);
  else if (pp.match(/beauty|salon|cosmetic|makeup|\bnail\b|\bhair\b|skincare|aesthetic|\blash\b|barber|\bbrow\b/)) per = ofp([ED, LUXE, WARM]);
  else if (pp.match(/\bkids?\b|child|daycare|preschool|nursery|\btoy\b|birthday|\bparty\b|playground|tutor|\bschool\b|\bcamp\b/)) per = ofp([WARM, BOLD]);
  else if (pp.match(/\bmusic\b|\bband\b|\bdj\b|nightclub|festival|concert|record label|podcast|\bclub\b/)) per = ofp([BOLD, BRUT, LUXE]);
  else if (pp.match(/nonprofit|charity|community|church|ministry|volunteer|foundation|\bdonate\b|outreach/)) per = ofp([WARM, ED, GEO]);
  // 3) No chip and no recognizable category, but a style word was typed - lean on it.
  else if (pp.match(/minimal|understated|stripped/)) per = ofp([MIN, GEO]);
  else if (pp.match(/\bbold\b|colorful|vibrant|energetic/)) per = ofp([BOLD, WARM]);
  else if (pp.match(/\bwarm\b|friendly|cozy|inviting/)) per = ofp([WARM, ED]);
  else if (pp.match(/premium|\bluxe\b|elegant|sophisticat|upscale/)) per = ofp([LUXE, ED, MIN]);
  else if (pp.match(/professional|corporate|formal/)) per = ofp([GEO, MIN, ED]);
  else if (pp.match(/playful|\bfun\b|quirky|funky/)) per = ofp([WARM, BOLD]);
  // 4) Truly unknown - safe premium spread (no brutalist on a random business).
  else per = ofp([ED, GEO, BOLD, WARM, MIN, LUXE]);
  return '\n\n=== THIS SITE\'S CREATIVE DIRECTION (make THIS specific site distinct — never fall back to a generic template) ===\n'
    + 'DESIGN PERSONALITY (commit to this fully - it drives the TYPOGRAPHY, the corner and shape language, the button style and the overall mood, and is the main thing that makes this site look different from other Websprout sites; where it conflicts with the style direction above, the personality wins on form, type and shape while the style direction wins on the COLOR palette): ' + per + '\n'
    + 'HERO TREATMENT (build this exact hero style): ' + h + '\n'
    + 'HERO CONTENT IS FRAMELESS (critical): the headline, subheadline and CTA buttons sit DIRECTLY on the hero background and float cleanly. NEVER place the hero text inside a card, panel, glass/frosted box, bordered container or filled content box. Correct = a big headline straight on the gradient or photo with the buttons right below it. Wrong = the words grouped inside a translucent rounded card floating in the middle of the hero. (A side visual in a split or card-stack hero MAY be framed - just never box the words themselves.)\n'
    + 'SIGNATURE INTERACTIVE FEATURES — build ONLY these (skip one only if it truly cannot fit this business; do NOT silently default to a marquee):\n  - ' + f.join('\n  - ') + '\n'
    + 'LAYOUT FLAVOR: ' + l + '\n'
    + 'CRITICAL — make each chosen feature ACTUALLY FUNCTION: follow its "Build:" recipe exactly as the proven technique, and write ALL the CSS and JS it needs so it works on load (and on tap for touch). Test it mentally end-to-end. If you genuinely cannot make a feature fully work inline, build a SIMPLER but fully-working version of THAT SAME feature — never a different feature, and never a static placeholder, a dead control, or a fake that only looks like the feature. A feature that truly works beats an ambitious one that does not.\n'
    + 'Keep everything self-contained inline HTML/CSS/JS that settles into a fully visible state. Choose these features INSTEAD of piling on extra effects, so the page stays tight (~380-520 lines), fast and complete. Two different businesses must never produce the same-looking page.\n';
}

// ===== M1: multi-page generation engine =====================================
// Template-by-type page plan (home always first). Returns [{path,title,role}].
function planPages(prompt, type){
  var p = (prompt||'').toLowerCase();
  if (type==='store' || /\b(shop|store|sell|selling|product|products|ecommerce|e-commerce|merch|boutique|online store|catalog|checkout|buy online)\b/.test(p)) {
    return [
      {path:'', title:'Home', role:'the landing page - the hook and what you sell, with a clear path to the Shop page. If you feature products on the home page, place the EXACT html comment <!--WS_PRODUCTS--> on its own line where the product grid belongs - do NOT hand-build or invent product cards; the owner real products render there.'},
      {path:'shop', title:'Shop', role:'a shop page: a heading, a short intro line, and a products section. Place the EXACT html comment <!--WS_PRODUCTS--> on its own line where the product grid belongs - do NOT invent fake products, the owner real products are injected at that comment. Add a Buy/Inquire call to action that links to the contact section.'},
      {path:'about', title:'About', role:'the story, values and people behind the business, building trust'},
      {path:'contact', title:'Contact', role:'a contact section with a working contact form, plus hours, location and contact details'}
    ];
  }
  if (/\b(restaurant|cafe|coffee|bakery|bistro|brewery|diner|eatery|food|menu|catering|pizzeria|grill|sushi|ramen|taco)\b/.test(p)) {
    return [
      {path:'', title:'Home', role:'the landing page - atmosphere, signature dishes, hours, and a reservation or order call to action'},
      {path:'menu', title:'Menu', role:'a full menu organized in sections (such as starters, mains, drinks) with item names, descriptions and prices'},
      {path:'about', title:'About', role:'the story of the place, the chef or owners, and what makes it special'},
      {path:'contact', title:'Contact', role:'hours, location with directions, phone, and a working reservation or contact form'}
    ];
  }
  if (/\b(portfolio|photographer|photography|designer|artist|illustrator|creative|architect|filmmaker|videographer|studio)\b/.test(p)) {
    return [
      {path:'', title:'Home', role:'a striking landing page introducing the creative and their best work at a glance'},
      {path:'work', title:'Work', role:'a portfolio gallery or grid of projects or pieces, each with a short caption or detail'},
      {path:'about', title:'About', role:'bio, approach, skills or services, and credibility'},
      {path:'contact', title:'Contact', role:'a working contact form and ways to reach the creative for commissions or bookings'}
    ];
  }
  return [
    {path:'', title:'Home', role:'the landing page - hero, what the business does, key benefits, social proof and a primary call to action'},
    {path:'about', title:'About', role:'the story, mission and team behind the business'},
    {path:'services', title:'Services', role:'a clear breakdown of the services or offerings as cards or sections, each with a short description'},
    {path:'contact', title:'Contact', role:'a working contact form plus hours, location and contact details'}
  ];
}

// Nav-link instruction shared by home and each page so cross-page nav is consistent.
function pageNavBrief(pages, currentPath){
  var links = pages.map(function(pg){ return (pg.path===''?'/':'/'+pg.path)+' ('+pg.title+')'; }).join(', ');
  var cur=''; for (var i=0;i<pages.length;i++){ if(pages[i].path===(currentPath||'')){ cur=pages[i].title; break; } }
  return 'PAGES & NAV: this site has these pages and the nav bar MUST link to all of them with these EXACT hrefs: ' + links + '. Use real anchor hrefs (e.g. href="/about", href="/" for home) for cross-page links, NOT in-page #anchors. Mark the current page (' + (cur||'Home') + ') as the active nav item. The mobile menu must contain the same links.';
}

var PAGE_GEN_PROMPT = 'You are building ONE additional page of an existing multi-page website. You are given the complete HTML of the site home page as your design reference. Build the requested page so it clearly belongs to the SAME website.\n\nNON-NEGOTIABLE CONSISTENCY RULES:\n- Reuse the EXACT same <head>: the same fonts and Google Fonts links, the same full CSS style block (so colors, typography, spacing and components match precisely), and the same meta and viewport tags.\n- Reuse the EXACT same top nav bar and the same footer markup and styling as the home page, so they are identical across pages (only the active nav item changes).\n- Match the same color system, button shapes, corner radii, shadows and overall design personality. The new page must be visually indistinguishable in style from the home page.\n- Build BRAND-NEW main content between the nav and the footer that fits THIS page purpose. Do not copy the home page body content.\n- Output ONE complete standalone HTML document (from <!DOCTYPE html> through </html>) with everything inline, because it is served on its own URL.';

var PAGE_GEN_RULES = 'CRITICAL RULES (same standards as the rest of the site):\n1. CONTRAST: every text element must be readable against its exact background - white or near-white text on dark, dark text on light, never dark-on-dark or light-on-light.\n2. Do NOT use vh or viewport-height units for section heights - use px or %. You MAY use clamp() with vw for responsive font-size.\n3. Entrance and scroll-reveal animations must always animate from hidden TO fully visible - nothing stays hidden. Keep transitions under 0.8s.\n4. NO horizontal overflow: set box-sizing:border-box globally, never let anything be wider than the viewport, and wrap long text. Never use white-space:nowrap on multi-word text.\n5. Every button and link must do something real. Cross-page nav uses real hrefs like href="/about". In-page links may use #ids that exist on THIS page. The primary call to action points to the contact or shop page.\n6. If you include a hamburger or mobile menu, hide it on desktop and wire it with a few lines of JS to toggle a real menu of the page links.\n7. Keep the page tight and focused - roughly 250-450 lines. ALWAYS finish through </body></html>. A shorter complete page beats a long or truncated one.';

function priceToCents(v){
  if (v == null) return 0;
  var str = String(v).replace(/[^0-9.]/g, '');
  if (!str) return 0;
  var n = parseFloat(str);
  if (!isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
async function doCheckout(request, env){
  var url = new URL(request.url);
  var siteId = (url.searchParams.get('site') || '').trim();
  var pIdx = parseInt(url.searchParams.get('p') || '-1', 10);
  function back(slug){ return slug ? ('https://' + slug + '.websprout.app/') : 'https://websprout.app/'; }
  function errPage(msg, slug){
    var b = back(slug);
    var h = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Checkout</title>'
      + '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:460px;margin:80px auto;padding:0 22px;text-align:center;color:#1a1a1a">'
      + '<div style="font-size:2rem;margin-bottom:8px">\ud83d\uded2</div>'
      + '<h2 style="margin:0 0 10px;font-size:1.3rem">Checkout unavailable</h2>'
      + '<p style="opacity:.65;line-height:1.6">' + msg + '</p>'
      + '<p style="margin-top:24px"><a href="' + b + '" style="color:#2e7d32;font-weight:600;text-decoration:none">Back to the shop</a></p></div>';
    return new Response(h, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  if (!env.KV) return errPage('Storage is not configured.', '');
  if (!siteId || pIdx < 0) return errPage('This product link is incomplete.', '');
  var sk = (env.STRIPE_SECRET_KEY || '').trim();
  if (!sk) return errPage('Payments are not configured yet.', '');
  var slug = ''; try { slug = (await env.KV.get('slugof:' + siteId)) || ''; } catch(e){}
  var products = []; try { var raw = await env.KV.get('products:' + siteId); if (raw) products = JSON.parse(raw); } catch(e){}
  if (!Array.isArray(products) || pIdx >= products.length) return errPage('That product is no longer available.', slug);
  var product = products[pIdx];
  if (!product || !product.name) return errPage('That product is no longer available.', slug);
  var owner = ''; try { owner = ((await env.KV.get('notify:' + siteId)) || '').toLowerCase(); } catch(e){}
  if (!owner) return errPage('This store is not set up to take payments yet.', slug);
  var u = null; try { u = JSON.parse(await env.KV.get('user:' + owner) || 'null'); } catch(e){}
  var isPlatformOwner = owner === SUPPORT_EMAIL.toLowerCase();
  var isPro = isPlatformOwner || (u && u.plan === 'pro');
  if (!isPro) return errPage('This store is not currently accepting online payments.', slug);
  var stripeAccount = '';
  if (!isPlatformOwner) {
    if (!(u && u.stripeConnect && u.stripeConnectReady)) return errPage('This store has not finished connecting its payment account.', slug);
    stripeAccount = u.stripeConnect;
  }
  var amount = priceToCents(product.price);
  if (!amount || amount < 50) return errPage('This product is not priced for online checkout.', slug);
  var appFee = 0;
  if (stripeAccount) { appFee = Math.round(amount * 0.02); if (appFee > amount - 1) appFee = amount - 1; if (appFee < 0) appFee = 0; }
  var currency = 'usd';
  var origin = slug ? ('https://' + slug + '.websprout.app') : 'https://websprout.app';
  var successUrl = origin + '/?ws_paid=1';
  var cancelUrl = origin + '/';
  var enc = encodeURIComponent;
  var sHeaders = { 'Authorization': 'Bearer ' + sk, 'Content-Type': 'application/x-www-form-urlencoded' };
  if (stripeAccount) sHeaders['Stripe-Account'] = stripeAccount;
  var bodyStr = 'mode=payment'
    + '&success_url=' + enc(successUrl)
    + '&cancel_url=' + enc(cancelUrl)
    + '&line_items[0][quantity]=1'
    + '&line_items[0][price_data][currency]=' + enc(currency)
    + '&line_items[0][price_data][unit_amount]=' + amount
    + '&line_items[0][price_data][product_data][name]=' + enc(String(product.name).slice(0, 120));
  if (product.desc) bodyStr += '&line_items[0][price_data][product_data][description]=' + enc(String(product.desc).slice(0, 200));
  if (appFee > 0) bodyStr += '&payment_intent_data[application_fee_amount]=' + appFee;
  try {
    var r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: sHeaders, body: bodyStr });
    var j = await r.json();
    if (!r.ok || j.error || !j.url) return errPage('We could not start checkout. Please try again in a moment.', slug);
    return new Response(null, { status: 302, headers: { 'Location': j.url } });
  } catch(e) { return errPage('We could not start checkout. Please try again in a moment.', slug); }
}
function cartInjection(products, siteId){
  function _cl(x){ return String(x||'').split('<').join('').split('>').join(''); }
  var pdata = products.map(function(p){ return { n:_cl(p.name), pr:_cl(p.price), im:_cl(p.img) }; });
  var dataJson = JSON.stringify(pdata);
  return `
<script>
(function(){
  try{
    var SITE=${JSON.stringify(siteId)};
    var P=${dataJson};
    var KEY="wscart_"+SITE;
    function gv(){ try{ return JSON.parse(localStorage.getItem(KEY)||"{}")||{}; }catch(e){ return {}; } }
    function sv(c){ try{ localStorage.setItem(KEY,JSON.stringify(c)); }catch(e){} render(); }
    function cents(s){ var n=parseFloat(String(s).replace(/[^0-9.]/g,"")); return (isFinite(n)&&n>0)?Math.round(n*100):0; }
    function money(c){ return "$"+(c/100).toFixed(2); }
    function esc(s){ return String(s).replace(/[<>&"']/g,function(ch){ return ch==="<"?"&lt;":ch===">"?"&gt;":ch==="&"?"&amp;":ch==='"'?"&quot;":"&#39;"; }); }
    var btn,ov,panel,itemsEl,totEl,ctEl;
    function count(c){ var n=0; for(var k in c){ n+=c[k]; } return n; }
    function open(){ if(ov){ ov.style.display="block"; render(); } }
    function close(){ if(ov){ ov.style.display="none"; } }
    function render(){
      if(!itemsEl) return;
      var c=gv(); var n=count(c);
      if(ctEl) ctEl.textContent=n;
      if(btn) btn.style.display=n>0?"inline-flex":"none";
      var html="", total=0, any=false;
      for(var k in c){
        var i=parseInt(k,10); var q=c[k]; if(!P[i]||q<1) continue; any=true;
        total+=cents(P[i].pr)*q;
        html+="<div style='display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f1f1'>";
        html+=(P[i].im?("<img src='"+esc(P[i].im)+"' style='width:46px;height:46px;object-fit:cover;border-radius:8px;flex-shrink:0'>"):"");
        html+="<div style='flex:1;min-width:0'><div style='font-weight:600;color:#111'>"+esc(P[i].n)+"</div><div style='color:#888;font-size:12px'>"+esc(P[i].pr)+"</div></div>";
        html+="<div style='display:flex;align-items:center;gap:6px'><button type='button' data-d='"+i+"' style='width:26px;height:26px;border:1px solid #ddd;background:#fff;color:#111;border-radius:6px;cursor:pointer;font-size:15px'>-</button><span style='min-width:18px;text-align:center;color:#111'>"+q+"</span><button type='button' data-a='"+i+"' style='width:26px;height:26px;border:1px solid #ddd;background:#fff;color:#111;border-radius:6px;cursor:pointer;font-size:15px'>+</button></div>";
        html+="</div>";
      }
      itemsEl.innerHTML=any?html:"<div style='color:#999;text-align:center;padding:46px 0'>Your cart is empty</div>";
      if(totEl) totEl.textContent=money(total);
      var bs=itemsEl.querySelectorAll("button");
      for(var b=0;b<bs.length;b++){ bs[b].onclick=function(){ var a=this.getAttribute("data-a"), d=this.getAttribute("data-d"); var cc=gv(); if(a!==null){ cc[a]=(cc[a]||0)+1; } else if(d!==null){ cc[d]=(cc[d]||0)-1; if(cc[d]<1){ delete cc[d]; } } sv(cc); }; }
    }
    function checkout(){
      var c=gv(); var items=[]; for(var k in c){ if(c[k]>0){ items.push({p:parseInt(k,10),qty:c[k]}); } }
      if(!items.length) return;
      var co=document.getElementById("wsCartCo"); if(co){ co.disabled=true; co.textContent="Starting checkout..."; }
      fetch("/cart-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:SITE,items:items})}).then(function(r){ return r.json(); }).then(function(j){
        if(j&&j.url){ location.href=j.url; } else { if(co){ co.disabled=false; co.textContent="Checkout"; } alert((j&&j.error)||"Could not start checkout. Please try again."); }
      }).catch(function(){ if(co){ co.disabled=false; co.textContent="Checkout"; } alert("Could not start checkout. Please try again."); });
    }
    function build(){
      if(document.getElementById("wsCartBtn")) return;
      btn=document.createElement("div"); btn.id="wsCartBtn";
      btn.style.cssText="position:fixed;right:18px;bottom:18px;z-index:2147483000;background:#111;color:#fff;border-radius:100px;padding:12px 18px;font:600 15px system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;display:none;align-items:center;gap:8px";
      btn.innerHTML="🛒 Cart (<span id='wsCartCt'>0</span>)";
      btn.onclick=open; document.body.appendChild(btn);
      ov=document.createElement("div"); ov.id="wsCartOv";
      ov.style.cssText="position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.45);display:none";
      ov.onclick=function(e){ if(e.target===ov){ close(); } };
      panel=document.createElement("div");
      panel.style.cssText="position:absolute;right:0;top:0;height:100%;width:340px;max-width:88vw;background:#fff;color:#111;box-shadow:-8px 0 30px rgba(0,0,0,.2);display:flex;flex-direction:column;font:14px system-ui,-apple-system,sans-serif";
      panel.innerHTML="<div style='padding:16px 18px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center'><b style='font-size:16px;color:#111'>Your cart</b><span id='wsCartX' style='cursor:pointer;font-size:24px;line-height:1;color:#999'>×</span></div><div id='wsCartItems' style='flex:1;overflow:auto;padding:8px 18px'></div><div style='padding:16px 18px;border-top:1px solid #eee'><div style='display:flex;justify-content:space-between;font-weight:700;font-size:16px;margin-bottom:12px;color:#111'><span>Total</span><span id='wsCartTot'>$0.00</span></div><button type='button' id='wsCartCo' style='width:100%;background:#16a34a;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer'>Checkout</button><div style='text-align:center;font-size:11px;color:#999;margin-top:8px'>Secure checkout via Stripe</div></div>";
      ov.appendChild(panel); document.body.appendChild(ov);
      itemsEl=document.getElementById("wsCartItems"); totEl=document.getElementById("wsCartTot"); ctEl=document.getElementById("wsCartCt");
      var x=document.getElementById("wsCartX"); if(x){ x.onclick=close; }
      var co=document.getElementById("wsCartCo"); if(co){ co.onclick=checkout; }
      render();
    }
    window.wsAddToCart=function(i){ if(!ov){ build(); } var c=gv(); c[i]=(c[i]||0)+1; sv(c); open(); };
    if(document.readyState!=="loading"){ build(); } else { document.addEventListener("DOMContentLoaded",build); }
  }catch(e){}
})();
</script>`;
}
async function doCartCheckout(request, env){
  try{
    if(!env.KV) return fail('Storage not configured');
    var b = await request.json();
    var siteId = (b.site||'').trim();
    var items = Array.isArray(b.items) ? b.items : [];
    if(!siteId || !items.length) return fail('Your cart is empty');
    var sk = (env.STRIPE_SECRET_KEY||'').trim();
    if(!sk) return fail('Payments are not configured yet');
    var products = [];
    try{ var raw = await env.KV.get('products:'+siteId); if(raw){ products = JSON.parse(raw); } }catch(e){}
    if(!products.length) return fail('This store has no products');
    var owner = '';
    try{ owner = ((await env.KV.get('notify:'+siteId))||'').toLowerCase(); }catch(e){}
    if(!owner) return fail('This store is not set up to take payments yet');
    var u = null;
    try{ u = JSON.parse(await env.KV.get('user:'+owner)||'null'); }catch(e){}
    var isPlatformOwner = owner === SUPPORT_EMAIL.toLowerCase();
    var isPro = isPlatformOwner || (u && u.plan==='pro');
    if(!isPro) return fail('This store is not currently accepting online payments');
    var stripeAccount = '';
    if(!isPlatformOwner){
      if(!(u && u.stripeConnect && u.stripeConnectReady)) return fail('This store has not finished connecting its payment account');
      stripeAccount = u.stripeConnect;
    }
    var lines = []; var total = 0;
    for(var i=0;i<items.length;i++){
      var idx = parseInt(items[i].p,10);
      var qty = parseInt(items[i].qty,10)||1; if(qty<1){ qty=1; } if(qty>99){ qty=99; }
      if(isNaN(idx)||idx<0||idx>=products.length) continue;
      var prod = products[idx]; if(!prod) continue;
      var amount = priceToCents(prod.price);
      if(!amount || amount<50) continue;
      total += amount*qty;
      lines.push({ name:String(prod.name||'Item').slice(0,120), amount:amount, qty:qty, desc:prod.desc?String(prod.desc).slice(0,200):'' });
    }
    if(!lines.length || total<50) return fail('Nothing in your cart can be purchased online');
    var appFee = 0;
    if(stripeAccount){ appFee = Math.round(total*0.02); if(appFee>total-1){ appFee=total-1; } if(appFee<0){ appFee=0; } }
    var slug = '';
    try{ slug = (await env.KV.get('slugof:'+siteId))||''; }catch(e){}
    var origin = slug ? ('https://'+slug+'.websprout.app') : 'https://websprout.app';
    var enc = encodeURIComponent;
    var sHeaders = { 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' };
    if(stripeAccount){ sHeaders['Stripe-Account'] = stripeAccount; }
    var body = 'mode=payment&success_url='+enc(origin+'/?ws_paid=1')+'&cancel_url='+enc(origin+'/');
    for(var li=0;li<lines.length;li++){
      body += '&line_items['+li+'][quantity]='+lines[li].qty;
      body += '&line_items['+li+'][price_data][currency]=usd';
      body += '&line_items['+li+'][price_data][unit_amount]='+lines[li].amount;
      body += '&line_items['+li+'][price_data][product_data][name]='+enc(lines[li].name);
      if(lines[li].desc){ body += '&line_items['+li+'][price_data][product_data][description]='+enc(lines[li].desc); }
    }
    if(appFee>0){ body += '&payment_intent_data[application_fee_amount]='+appFee; }
    var r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method:'POST', headers:sHeaders, body:body });
    var j = await r.json();
    if(!r.ok || j.error || !j.url) return fail('We could not start checkout. Please try again.');
    return succeed({ url:j.url });
  }catch(e){ return fail(e.message); }
}
function renderProductGrid(products, siteId, checkoutEnabled){
  if (!Array.isArray(products) || !products.length) return '<div style="text-align:center;opacity:.6;padding:40px 0;font-size:1rem">Products coming soon.</div>';
  var esc = function(x){ return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var cards = products.map(function(p, i){
    var img = p.img ? ('<div class="wsp-img" style="background-image:url(' + esc(p.img) + ')"></div>') : '<div class="wsp-img wsp-noimg"></div>';
    var price = p.price ? ('<div class="wsp-price">' + esc(p.price) + '</div>') : '';
    var desc = p.desc ? ('<div class="wsp-desc">' + esc(p.desc) + '</div>') : '';
    var buy;
    if (p.payUrl && /^https:\/\//i.test(p.payUrl)) buy = '<a class="wsp-buy" href="' + esc(p.payUrl) + '" target="_blank" rel="noopener">Buy now</a>';
    else if (checkoutEnabled && siteId) buy = '<button class="wsp-buy" type="button" onclick="wsAddToCart(' + i + ')">Add to cart</button>';
    else buy = '<a class="wsp-buy" href="#contact">Inquire</a>';
    return '<div class="wsp-card">' + img + '<div class="wsp-body"><div class="wsp-name">' + esc(p.name||'Product') + '</div>' + price + desc + buy + '</div></div>';
  }).join('');
  var css = '<style>.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;max-width:1100px;margin:0 auto;padding:8px 0}.wsp-card{border:1px solid rgba(128,128,128,.18);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;background:rgba(128,128,128,.04)}.wsp-img{aspect-ratio:4/3;background-size:cover;background-position:center}.wsp-noimg{background:linear-gradient(135deg,rgba(128,128,128,.12),rgba(128,128,128,.05))}.wsp-body{padding:16px;display:flex;flex-direction:column;gap:6px}.wsp-name{font-weight:700;font-size:1.05rem}.wsp-price{font-weight:700;opacity:.85}.wsp-desc{font-size:.9rem;opacity:.7;line-height:1.5}.wsp-buy{margin-top:8px;display:inline-block;text-align:center;padding:10px 16px;border:1px solid currentColor;border-radius:10px;text-decoration:none;color:inherit;font-weight:600}.wsp-buy:hover{opacity:.8}</style>';
  return css + '<div class="wsp-grid">' + cards + '</div>';
}
async function doProducts(request, env){
  try {
    if (!env.KV) return fail('Storage not configured');
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const siteId = url.searchParams.get('siteId') || '';
      const key = url.searchParams.get('key') || '';
      if (!siteId || key !== (await siteKey(siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
      let products = [];
      try { const raw = await env.KV.get('products:' + siteId); if (raw) products = JSON.parse(raw); } catch(e){}
      return succeed({ ok:true, products: products });
    }
    const b = await request.json();
    if (!b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    let _pro = false;
    try { const _s = await getSession(request, env); if (_s){ const _u = JSON.parse((await env.KV.get('user:'+(_s.email||'').toLowerCase()))||'{}'); _pro = !!(_u && _u.plan==='pro') || ((_s.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase()); } } catch(e){}
    if (!_pro) return fail('PRO_REQUIRED');
    let products = Array.isArray(b.products) ? b.products.slice(0,200) : [];
    products = products.map(function(p){ var pu=String(p.payUrl||'').trim().slice(0,600); if(!/^https:\/\//i.test(pu)) pu=''; return { name:String(p.name||'').slice(0,140), price:String(p.price||'').slice(0,40), img:String(p.img||'').slice(0,600), desc:String(p.desc||'').slice(0,500), payUrl:pu }; }).filter(function(p){ return p.name; });
    await env.KV.put('products:' + b.siteId, JSON.stringify(products));
    return succeed({ ok:true, products: products });
  } catch(e){ return fail(e.message); }
}
async function doPlanPages(request, env){
  const _s = await getSession(request, env);
  let _pro = false;
  try { if (_s){ const _u = JSON.parse((env.KV && await env.KV.get('user:'+(_s.email||'').toLowerCase())) || '{}'); _pro = !!(_u && _u.plan==='pro') || ((_s.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase()); } } catch(e){}
  if (!_pro) return fail('PRO_REQUIRED');
  let body; try { body = await request.json(); } catch { return fail('Invalid request'); }
  return succeed({ pages: planPages((body.prompt||''), (body.type||'')) });
}

// Generate a single non-home page using the finished home HTML as the design reference.
async function doGeneratePage(request, env){
  const _sess = await getSession(request, env);
  if (!_sess) return fail('Please sign in to generate pages.');
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set in Cloudflare environment variables.');
  let _pro = false;
  try { const _u = JSON.parse((env.KV && await env.KV.get('user:'+(_sess.email||'').toLowerCase())) || '{}'); _pro = !!(_u && _u.plan==='pro') || ((_sess.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase()); } catch(e){}
  if (!_pro) return fail('PRO_REQUIRED');
  let body; try { body = await request.json(); } catch { return fail('Invalid request'); }
  const home = (body.home || '').toString();
  const page = body.page || {};
  const pages = Array.isArray(body.pages) && body.pages.length ? body.pages : [{path:'',title:'Home'}, {path:(page.path||''),title:(page.title||'Page')}];
  const siteId = (body.siteId || '').toString() || ('ws' + Math.random().toString(36).slice(2,9));
  if (!home) return fail('Missing home page reference');
  if (!page || typeof page.title !== 'string') return fail('Missing page spec');
  const ref = stripDataUris(home);
  const navBrief = pageNavBrief(pages, page.path||'');
  const promptText = PAGE_GEN_PROMPT
    + '\n\n=== THE EXISTING HOME PAGE (your design reference - match it exactly) ===\n' + ref.html
    + '\n\n=== THE PAGE TO BUILD ===\nPage title: ' + page.title + '\nPage path: /' + (page.path||'') + '\nWhat this page is for: ' + (page.role || page.title)
    + '\n\n' + navBrief
    + '\n\n' + PAGE_GEN_RULES;
  try {
    const gbody = JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { maxOutputTokens: 32768, temperature: 0.9, thinkingConfig: { thinkingBudget: 1024 } }
    });
    let result = await callGemini(keys, gbody, 'gemini-2.5-flash', 91000, 94000);
    if (result.error) return fail(result.error);
    let html = cleanHTML(result.data);
    html = restoreDataUris(html, ref.map);
    let finalHtml = html.includes('</html>') ? html : html + '\n</body>\n</html>';
    finalHtml = sanitizeGenerated(finalHtml);
    finalHtml = ensureMobile(finalHtml);
    finalHtml = tidyGenerated(finalHtml);
    finalHtml = ensureFavicon(finalHtml);
    finalHtml = withReveal(finalHtml);
    finalHtml = withFix(finalHtml);
    finalHtml = withForms(finalHtml, siteId);
    return succeed({ html: finalHtml, path: page.path||'', title: page.title });
  } catch(e){ return fail(e.message); }
}

async function doGenerate(request, env) {
  try{ const _gs=await getSession(request,env); await logEvent(request, env, 'generate', { email:_gs&&_gs.email }); }catch(e){}
  const _sess = await getSession(request, env);
  // Anonymous "try it free" path: allow 1 gen per IP per day so first-time visitors can see the wow moment before signup.
  // Authed users skip this limit entirely.
  let _isAnon = !_sess;
  if (_isAnon) {
    try {
      // Layer 1: global daily anon cap — hard ceiling on total free generations per day (kill switch on spend).
      // Configurable via env.ANON_DAILY_CAP; default 100/day. At Flash pricing (~$0.03/gen) that's ~$3/day worst case.
      const dayKey = 'anontotal:' + new Date().toISOString().slice(0,10);
      const total = parseInt((env.KV && await env.KV.get(dayKey)) || '0', 10) || 0;
      const cap = parseInt(env.ANON_DAILY_CAP || '100', 10);
      if (total >= cap) return fail('Free trials are at capacity right now. Sign in to keep building - takes 5 seconds and unlocks unlimited use.');
      // Layer 2: per-IP limit — 1 free gen per IP per day.
      const iph = await hashIP(request.headers.get('cf-connecting-ip') || '', env);
      const anonKey = 'anongen:' + iph;
      const cur = parseInt((env.KV && await env.KV.get(anonKey)) || '0', 10) || 0;
      if (cur >= 1) return fail('You have used your free generation for today. Sign in to keep building - it takes 5 seconds and lets you save all your sites.');
      // Layer 3: prompt sanity check — reject obvious abuse patterns (very long prompts, injection attempts)
      try {
        const _body = await request.clone().json();
        const _p = (_body.prompt || '').toString();
        if (_p.length > 800) return fail('Prompt too long for a free trial. Sign in to build with longer prompts.');
      } catch(e){}
      await env.KV.put(anonKey, String(cur + 1), { expirationTtl: 60*60*24 });
      await env.KV.put(dayKey, String(total + 1), { expirationTtl: 60*60*24*2 });
    } catch(e) { /* fail open — never block real users on infra hiccups */ }
  }
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set in Cloudflare environment variables.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  const prompt = (body.prompt || '').trim();
  if (!prompt) return fail('Prompt is required');
  // Paying members (Pro/comped) generate on the higher-quality Pro model; free/anon users stay on fast Flash.
  const _email = (_sess && _sess.email || '').toLowerCase();
  let genModel = 'gemini-2.5-flash';
  let _isPaid = false;
  try {
    const _isOwner = _email === SUPPORT_EMAIL.toLowerCase();
    const _u = JSON.parse((env.KV && await env.KV.get('user:'+_email)) || '{}');
    _isPaid = (_isOwner || _u.plan === 'pro');
    // Paid members generate on the higher-quality Pro model with a generous timeout. Cloudflare imposes
    // no hard wall-clock limit while the client stays connected, so a longer Pro build is fine; and if Pro
    // stalls or errors we fall back to Flash below, so a paid user is never worse off than a free one.
    if (_isPaid) genModel = 'gemini-2.5-pro';
  } catch (e) {}
  // Free tier: cap total generations per account (Pro/owner unlimited). Free generations — including
  // the first — run on the fast Flash model so the make-or-break first impression is quick and reliable.
  // (A ~90s Pro wait loses first-timers, and long Pro generations brush against Cloudflare's request limit.)
  if (!_isPaid && env.KV) {
    try {
      const _gc = parseInt((await env.KV.get('gencount:' + _email)) || '0', 10) || 0;
      if (_gc >= FREE_GEN_LIMIT) return fail('FREE_LIMIT_REACHED');
    } catch (e) {}
  }
  try {
    const body2 = JSON.stringify({
      contents: [{ parts: [{ text: PROMPT + '\n\nUser request: ' + prompt + getNicheDirection(prompt) + '\n\nSTYLE DIRECTION: ' + getStyleDirection(prompt) + '\n\n' + DESIGN_AMBITION + varietyBrief(prompt) + '\n\n' + INTERACTIVE_SECTIONS + '\n\n' + INTERACTIVE_BEHAVIORS + '\n\nCRITICAL RULES:\n1. NAV LINKS AND LOGO MUST BE READABLE IN EVERY STATE — if the nav floats transparent over a dark hero, the links and logo are white; if the nav has ANY solid background (either from load OR after fading in on scroll), the link and logo text MUST contrast with THAT background: dark text (#111) on a light or white nav, light text on a dark nav. White text on a white or pale nav is the #1 most reported bug and is unacceptable. Set the text color inside the SAME CSS rule that sets the scroll-state background. DEFAULT LAYOUT — the nav should FLOAT TRANSPARENTLY OVER THE HERO, not sit above it as its own bar: use position:fixed (or absolute) with top:0, left:0, right:0, background:transparent, z-index:100; the hero begins at the very top of the page (no space above it) and its background color/image extends behind the nav to the top edge of the viewport; add padding-top around 90px inside the hero so its content does not hide under the nav. This produces the modern floating-header look that most sites want. The floating nav MUST ALSO be STICKY BY DEFAULT — position:fixed keeps it pinned to the top of the viewport while the user scrolls; do NOT use position:absolute (which scrolls away) unless the user has explicitly asked for a non-sticky header. When the user scrolls past ~40px, apply a subtle solid background/backdrop-blur to the nav (see INTERACTIVE-BEHAVIOR #1 for the exact pattern) so nav text remains readable over any section that scrolls behind it — and remember Rule #1 in reverse: the scrolled-state text color MUST contrast with the scrolled-state background. EXCEPTION — for business types where a solid opaque nav genuinely reads more trustworthy (law/legal, finance/accounting, medical/dental, corporate B2B, some fine-dining restaurants), a solid nav bar sitting above the hero is acceptable — but this must be a deliberate choice, not the default.\n2. CONTRAST IS THE #1 PRIORITY: every text element must be instantly readable against the EXACT background behind it — dark text only on light backgrounds, white/near-white text only on dark backgrounds, never dark-on-dark or light-on-light. If the hero background is dark or uses a photo/image slot, the hero headline and subtext MUST be white/near-white. A dark headline on a dark hero is a failure.\n3. Do NOT use vh or viewport-height units for section/hero HEIGHTS — size heights with px or % (e.g. min-height:640px), required for correct rendering. You SHOULD use clamp() with vw for responsive FONT-SIZE so large headings shrink on small screens and never overflow (e.g. font-size:clamp(2rem,6vw,4.5rem)).\n4. Scroll-reveal and entrance animations are ENCOURAGED, but every element MUST animate from hidden TO fully visible — nothing stays hidden. Keep transitions under 0.8s.\n5. ALWAYS end with </body></html> — never leave HTML incomplete.\n6. COMPLETION IS MANDATORY: always finish the entire page through </body></html>. Keep the page TIGHT and FOCUSED — aim for roughly 380-520 lines total, favoring 4-6 strong sections over many and keeping each one concise. A shorter, complete, well-designed page always beats a long or truncated one. 7. NO horizontal overflow: set box-sizing:border-box globally, never let any element be wider than the viewport, and the page must NEVER scroll sideways; headings and long text must wrap (overflow-wrap:break-word) and must never use white-space:nowrap on multi-word text. 8. SPACING: the nav logo must never touch the menu links, and text must never touch the screen edges — use container padding/margins and clear gaps between elements. Prominent call-to-action buttons must sit clearly inside their section with visible space beneath them, never flush against the seam where the next section begins; and any solid-filled button must carry a subtle border or shadow so it stays readable if it lands on or beside a section of a similar color. 9. WORKING INTERACTIVITY: every button and nav link must actually do something — nav links use href="#id" and scroll to a real section that has that id, and the primary CTA points to the contact, quote, or inventory section. Do NOT render any clickable-looking control that does nothing. If you include a hamburger/menu icon, it MUST be hidden on desktop (display:none above ~820px, shown only on mobile) AND wired with a few lines of JS to toggle a real mobile menu of the nav links — never an animated icon with no menu behind it.' }] }],
      generationConfig: { maxOutputTokens: 32768, temperature: 0.95, thinkingConfig: { thinkingBudget: 1536 } }
    });
    // Generation budget: give Pro a tight window so that if it stalls we can still fall back to the
    // faster, more reliable Flash model and return a site instead of a Cloudflare 524 timeout.
    let result = await callGemini(keys, body2, genModel, genModel === 'gemini-2.5-pro' ? 140000 : 91000, genModel === 'gemini-2.5-pro' ? 143000 : 94000);
    if (result.error && genModel === 'gemini-2.5-pro') {
      try { console.warn('[Websprout] Pro generation failed (' + result.error + ') — falling back to Flash'); } catch (e) {}
      result = await callGemini(keys, body2, 'gemini-2.5-flash', 91000, 94000);
    }
    if (result.error) return fail(result.error);
    const generatedHtml = cleanHTML(result.data);
    let finalHtml = generatedHtml.includes('</html>') ? generatedHtml : generatedHtml + '\n</body>\n</html>';
    finalHtml = sanitizeGenerated(finalHtml);
    finalHtml = ensureMobile(finalHtml);
    finalHtml = tidyGenerated(finalHtml);
    finalHtml = ensureFavicon(finalHtml);
    finalHtml = withReveal(finalHtml);
    finalHtml = withFix(finalHtml);
    const siteId = 'ws' + Math.random().toString(36).slice(2,9);
    finalHtml = withForms(finalHtml, siteId);
    finalHtml = withReviews(finalHtml, siteId);
    try {
      var _isShopGen = /\b(shop|store|sell|selling|product|products|ecommerce|e-commerce|merch|boutique|online store|catalog|checkout|buy online)\b/i.test(prompt||'');
      if (_isShopGen && finalHtml.indexOf('<!--WS_PRODUCTS-->') === -1) {
        var _shopSec = '\n<section id="shop" style="padding:64px 24px"><div style="max-width:1100px;margin:0 auto"><h2 style="text-align:center;margin:0 0 28px;font-size:2rem">Shop</h2>\n<!--WS_PRODUCTS-->\n</div></section>\n';
        var _bi3 = finalHtml.lastIndexOf('</body>');
        finalHtml = _bi3 > -1 ? (finalHtml.slice(0,_bi3) + _shopSec + finalHtml.slice(_bi3)) : (finalHtml + _shopSec);
      }
    } catch(e){}
    const formKey = await siteKey(siteId, env);
    if (env.KV && _email) { try { let _bcRaw = await env.KV.get('bcount:' + _email); if (_bcRaw === null) { _bcRaw = (await env.KV.get('gencount:' + _email)) || '0'; } await env.KV.put('bcount:' + _email, String((parseInt(_bcRaw, 10) || 0) + 1)); } catch (e) {} }
    try { if (env.KV) { const _sgC = await env.KV.get('stat:sitesgrown'); if (_sgC !== null) await env.KV.put('stat:sitesgrown', String((parseInt(_sgC, 10) || 0) + 1)); } } catch (e) {}
    if (!_isPaid && env.KV) { try { const _gc2 = parseInt((await env.KV.get('gencount:' + _email)) || '0', 10) || 0; await env.KV.put('gencount:' + _email, String(_gc2 + 1)); } catch (e) {} }
    return succeed({ html: finalHtml, siteId: siteId, formKey: formKey, inboxUrl: 'https://websprout.app/inbox?site=' + siteId + '&key=' + formKey });
  } catch(e) { return fail(e.message); }
}

async function doChat(request, env) {
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  if (!body.message) return fail('Missing message');

  const CHAT_PROMPT = `You are the AI assistant inside Websprout, an AI website builder. Answer the user's exact question directly and specifically.

About Websprout: Users describe a business, AI builds a complete 4-page website in ~20 seconds. Chat to make edits for free. Pro is $10/month and unlocks downloading the source code and deploying across all your sites (cancel anytime). Deploy free on Netlify or Cloudflare Pages.

The user's current site: ` + (body.context||'No site generated yet') + `

Rules:
- Read the question carefully and answer EXACTLY what they asked
- If they are exploring or asking for ideas (e.g. "give me ideas", "what if", "suggest", "come up with"), brainstorm WITH them: offer 2-3 concrete, specific options — real headlines, real color pairings with hex codes, real section ideas, never vague categories — each on its own short line. Phrase each option so they can apply it just by replying with a plain instruction (for instance, they might say: make the headline "Fresh by 6am"). End by asking which direction they want.
- Give specific, expert answers (hex codes for colors, specific font names, concrete steps)
- Use context about their site when relevant
- NEVER say generic things like "Working on that!" or "Great question!" -- just answer
- 1-3 sentences usually, more only if genuinely needed
- Casual, friendly, expert tone`;

  try {
    const cbody = JSON.stringify({
      contents: [{ parts: [{ text: CHAT_PROMPT + '\n\nUser: ' + body.message.trim() }] }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
    });
    const result = await callGemini(keys, cbody);
    if (result.error) return fail(result.error);
    let text = '';
    try { text = result.data.candidates[0].content.parts[0].text; } catch(e) {}
    if (!text || text.length < 5) text = 'Something went wrong. Try asking again!';
    return succeed({ reply: text.trim() });
  } catch(e) { return fail(e.message); }
}

// Swap large inline base64 images for tiny placeholders before sending HTML to the model,
// then restore the originals in the response. Keeps image-heavy sites editable without
// blowing past the model's input-token ceiling. (Tiny data URIs like SVG favicons are left alone.)
function stripDataUris(html){
  const map=[];
  const out=(html||'').replace(/data:image\/[a-z0-9.+\-]+;base64,[A-Za-z0-9+\/=]+/gi, function(m){
    if(m.length<=400) return m;
    const tok='data:image/jpeg;base64,WSIMGREF'+map.length+'XEND';
    map.push(m);
    return tok;
  });
  return { html: out, map: map };
}
function restoreDataUris(html, map){
  let out=html||'';
  for(let i=0;i<map.length;i++){
    out = out.split('data:image/jpeg;base64,WSIMGREF'+i+'XEND').join(map[i]);
  }
  return out;
}

// When a modify instruction targets nav text color, append a very-specific override so the
// cascade can never beat the user's request. Deterministic; only fires when intent is clear.
// When a modify instruction asks for a sticky/floating/pinned header, inject a very-specific
// !important rule + scroll listener. Deterministic; only fires when intent is clear.
function forceStickyHeaderFromInstruction(html, instruction){
  try{
    const t = String(instruction||'').toLowerCase();
    if (!/(header|nav)/.test(t)) return html;
    // Only fire if user is asking for stickiness in some form
    if (!/(sticky|stay|pinned|pin\s|fix(ed)?|float|stays?\s+when|when\s+i\s+scroll|top of the page)/.test(t)) return html;
    // Skip if they're asking to REMOVE stickiness
    if (/(remove|no\slonger|stop|un-?stick|not sticky|non-sticky)/.test(t)) return html;
    if (/id=["\x27]_wsStickyHeader/.test(html)) return html; // idempotent
    const rule = '<style id="_wsStickyHeader">header,nav.site-nav,nav.main-nav,.site-header,body>nav:first-of-type,body>header:first-of-type{position:fixed !important;top:0 !important;left:0 !important;right:0 !important;z-index:1000 !important;transition:background-color .25s ease, backdrop-filter .25s ease, box-shadow .25s ease}header.scrolled,nav.scrolled,.site-header.scrolled{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 1px 0 rgba(255,255,255,.06)}</style>';
    const script = '<script id="_wsStickyHeaderJS">(function(){function findHdr(){return document.querySelector("header")||document.querySelector("nav.site-nav")||document.querySelector("nav.main-nav")||document.querySelector(".site-header")||document.querySelector("body>nav")||document.querySelector("body>header");}function apply(){var h=findHdr();if(!h)return;var s=window.scrollY>40;h.classList.toggle("scrolled",s);if(s){var cs=getComputedStyle(document.body).backgroundColor||"rgb(0,0,0)";h.style.backgroundColor=cs;}else{h.style.backgroundColor="";}}apply();window.addEventListener("scroll",apply,{passive:true});})();</script>';
    const hi = html.indexOf('</head>');
    if (hi > -1) html = html.slice(0,hi) + rule + html.slice(hi);
    else html = rule + html;
    const bi = html.lastIndexOf('</body>');
    if (bi > -1) html = html.slice(0,bi) + script + html.slice(bi);
    else html = html + script;
    return html;
  }catch(e){ return html; }
}

function forceNavColorFromInstruction(html, instruction){
  try{
    const t = String(instruction||'').toLowerCase();
    if (!/(nav|header|menu|logo|brand)/.test(t)) return html;
    let color = null;
    if (/\bwhite\b|#fff|#ffffff/.test(t)) color = '#ffffff';
    else if (/\bblack\b|#000\b|#111\b/.test(t)) color = '#111111';
    else {
      const hex = t.match(/#[0-9a-f]{3,8}/); if (hex) color = hex[0];
    }
    if (!color) return html;
    if (!/color\s*:/.test(t)) {
      if (!/(text|color|link|links|make.+(nav|header|menu|logo|brand))/.test(t)) return html;
    }
    const rule = '<style id="_wsNavForced">nav a,nav .brand,nav .logo,nav ul li a,header nav a,header a{color:' + color + ' !important;}</style>';
    const hi = html.indexOf('</head>');
    if (hi > -1) return html.slice(0,hi) + rule + html.slice(hi);
    return rule + html;
  }catch(e){ return html; }
}

// Strip the utility scripts Websprout injects (nav-contrast, reveal, forms, reviews, error logger, forced nav color).
// Chat-edit round-trips the full HTML through Gemini which occasionally corrupts these minified blobs.
// We strip them before sending, and the outer withReveal/withForms/withReviews chain re-injects them clean on the way out.
function stripInjected(html){
  try{
    return html
      .replace(/<script\s+id=["']_ws[^"']*["'][\s\S]*?<\/script>/gi, '')
      .replace(/<style\s+id=["']_ws[^"']*["'][\s\S]*?<\/style>/gi, '');
  }catch(e){ return html; }
}

async function doModify(request, env) {
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  if (!body.html || !body.instruction) return fail('Missing html or instruction');
  try {
    const stripped = stripDataUris(stripInjected(body.html));
    const imgNote = stripped.map.length ? '\n\nIMPORTANT: Some image src values are shortened placeholders shaped like data:image/jpeg;base64,WSIMGREF<N>XEND. Keep every such src EXACTLY as written — never alter, complete, shorten, or remove them.' : '';
    const mbody = JSON.stringify({
      contents: [{ parts: [{ text: MODIFY + '\n\n' + INTERACTIVE_SECTIONS + '\n\n' + INTERACTIVE_BEHAVIORS + imgNote + '\n\nCurrent HTML:\n' + stripped.html + '\n\nInstruction: ' + body.instruction.trim() }] }],
      generationConfig: { maxOutputTokens: 32768, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } }
    });
    const result = await callGemini(keys, mbody, undefined, 90000, 92000);
    if (result.error) return fail(result.error);
    let cleaned = restoreDataUris(cleanHTML(result.data), stripped.map);
    // Safety check: if result is way shorter than input, Gemini truncated — reject it
    const minExpected = Math.min(body.html.length * 0.6, 5000);
    if (cleaned.length < minExpected) {
      return fail('Edit produced incomplete output — please try again with a simpler instruction.');
    }
    const mSite = (body.html.match(/name="ws-site" content="([^"]+)"/) || [])[1] || ('ws' + Math.random().toString(36).slice(2,9));
    cleaned = forceNavColorFromInstruction(cleaned, body.instruction);
    cleaned = forceStickyHeaderFromInstruction(cleaned, body.instruction);
    return succeed({ html: withReviews(withForms(withFix(withReveal(cleaned)), mSite), mSite), message: 'Done! Your site has been updated.' });
  } catch(e) { return fail(e.message); }
}

// Post-generation safety pass: repoint dead / empty / missing-target in-page links to a real
// conversion section so generated sites never ship buttons that go nowhere.
function sanitizeGenerated(html){
  try{
    const ids = new Set();
    const idRe = /\sid\s*=\s*["']([^"']+)["']/gi;
    let mm;
    while((mm = idRe.exec(html))){ ids.add(mm[1].trim().toLowerCase()); }
    function pick(cands){
      for(const c of cands){ if(ids.has(c)) return c; }
      for(const id of ids){ for(const c of cands){ if(id.indexOf(c) > -1) return id; } }
      return null;
    }
    const target = pick(['contact','quote','book','booking','order','reserve','cta','getstarted','signup']);
    if(!target) return html;
    html = html.replace(/<a\b([^>]*?)\shref\s*=\s*"([^"]*)"([^>]*)>/gi, function(full, pre, href, post){
      const attrs = pre + ' ' + post;
      const h = (href||'').trim();
      if(/^(https?:|mailto:|tel:|javascript:|\/\/)/i.test(h)) return full;       // external / protocol
      if(h.charAt(0) === '[') return full;                                        // [Your Booking Link] etc.
      if(/data-ws-field\s*=\s*["']brand["']/i.test(attrs)) return full;           // logo/brand
      if(/class\s*=\s*["'][^"']*(logo|brand)/i.test(attrs)) return full;
      let dead = false;
      if(h === '' || h === '#') dead = true;
      else if(h.charAt(0) === '#'){ if(!ids.has(h.slice(1).toLowerCase())) dead = true; }
      return dead ? ('<a' + pre + ' href="#' + target + '"' + post + '>') : full;
    });
  }catch(e){}
  return html;
}

// Guarantee mobile baseline: a viewport tag (without it phones render the desktop layout zoomed out)
// plus a minimal, non-destructive safety stylesheet so nothing overflows sideways on a phone.
// Deterministic post-generation cleanup for issues prompts keep missing:
// (1) collapse a nav that ended up with the same CTA twice down to one, and
// (2) strip empty trailing elements that leave a gap at the bottom.
// Guarantee a branded favicon (the little tab icon). If the model didn't include one,
// inject a clean monogram of the brand's initial in a colour derived from the brand name.
function ensureFavicon(html){
  try{
    if(/<link[^>]+rel=["'][^"']*icon/i.test(html)) return html;
    let brand='';
    let m = html.match(/data-ws-field=["']brand["'][^>]*>([^<]{1,40})</i);
    if(m) brand = m[1];
    if(!brand){ const t = html.match(/<title>([^<]{1,60})<\/title>/i); if(t) brand = t[1].split('|')[0].split(' - ')[0]; }
    brand = (brand||'W').trim();
    const letter = ((brand.replace(/[^A-Za-z0-9]/g,'').charAt(0))||'W').toUpperCase();
    let h=0; for(let i=0;i<brand.length;i++){ h=(h*31 + brand.charCodeAt(i))>>>0; }
    const bg = 'hsl('+(h % 360)+',62%,46%)';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="'+bg+'"/><text x="32" y="45" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#ffffff" text-anchor="middle">'+letter+'</text></svg>';
    const link = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+encodeURIComponent(svg)+'">';
    if(/<\/head>/i.test(html)) return html.replace(/<\/head>/i, link+'</head>');
    if(/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, mm=>mm+link);
    return link+html;
  }catch(e){ return html; }
}

function tidyGenerated(html){
  try{ html = dedupeNavCta(html); html = stripTrailingEmpty(html); }catch(e){}
  return html;
}
function dedupeNavCta(html){
  let open = html.search(/<nav\b/i), tag='nav';
  if(open<0){ open = html.search(/<header\b/i); tag='header'; }
  if(open<0) return html;
  const closeStr='</'+tag+'>';
  const rel = html.slice(open).search(new RegExp(closeStr,'i'));
  if(rel<0) return html;
  const closeEnd = open + rel + closeStr.length;
  const navBlock = html.slice(open, closeEnd);
  const anchors = navBlock.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  if(anchors.length < 2) return html;
  const txt = a => a.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  const counts = {};
  anchors.forEach(a=>{ const t=txt(a); if(t&&t.length<30) counts[t]=(counts[t]||0)+1; });
  let newNav = navBlock;
  Object.keys(counts).forEach(t=>{
    if(counts[t]>1){
      const matching = anchors.filter(a=>txt(a)===t);
      for(let i=0;i<matching.length-1;i++){
        const idx = newNav.indexOf(matching[i]);
        if(idx>-1) newNav = newNav.slice(0,idx) + newNav.slice(idx+matching[i].length);
      }
    }
  });
  if(newNav===navBlock) return html;
  return html.slice(0,open) + newNav + html.slice(closeEnd);
}
function stripTrailingEmpty(html){
  let prev;
  do{ prev = html; html = html.replace(/<(div|section|span|p)\b[^>]*>\s*<\/\1>\s*(?=<\/body>)/i, ''); }while(html!==prev);
  return html;
}

function ensureMobile(html){
  try{
    if(!/<meta[^>]+name=["']viewport["']/i.test(html)){
      const vp = '<meta name="viewport" content="width=device-width, initial-scale=1">';
      if(/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, function(m){ return m + vp; });
      else if(/<html[^>]*>/i.test(html)) html = html.replace(/<html[^>]*>/i, function(m){ return m + '<head>' + vp + '</head>'; });
      else html = vp + html;
    }
    if(html.indexOf('ws-mobile-safety') === -1){
      const css = '<style id="ws-mobile-safety">html,body{margin:0}body>*:last-child{margin-bottom:0}img,svg,video{max-width:100%}@media(max-width:600px){html,body{overflow-x:hidden;max-width:100vw}img,svg,video{height:auto}table,pre,code{max-width:100%;overflow-x:auto}}</style>';
      if(/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, css + '</head>');
      else html = css + html;
    }
  }catch(e){}
  return html;
}

function cleanHTML(apiResponse) {
  let raw = '';
  try {
    const parts = apiResponse.candidates[0].content.parts || [];
    raw = parts.filter(function(p){ return p && typeof p.text === 'string' && !p.thought; }).map(function(p){ return p.text; }).join('');
    if (!raw) throw new Error('empty');
  } catch(e) {
    return '<html><body style="font-family:sans-serif;padding:2rem"><h2>Generation failed</h2></body></html>';
  }
  // Strip markdown fences
  raw = raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = raw.indexOf('<!DOCTYPE');
  raw = (start >= 0 ? raw.slice(start) : raw).trim();

  // Animations (opacity:0 / visibility:hidden entrances) are now ALLOWED — the
  // _wsReveal safety-net guarantees content ends up visible. We only neutralize the
  // catastrophic cases that would hide the WHOLE page with no element-level recovery.
  raw = raw.split('body{display:none').join('body{display:block');
  raw = raw.split('body { display: none').join('body { display: block');
  raw = raw.split('html{display:none').join('html{display:block');
  raw = raw.split('html { display: none').join('html { display: block');
  raw = raw.split('body{opacity:0').join('body{opacity:1');
  raw = raw.split('body { opacity: 0').join('body { opacity: 1');
  raw = raw.split('html{opacity:0').join('html{opacity:1');

  // Fix truncated HTML
  if (!raw.includes('</html>')) {
    raw = raw.includes('</body>') ? raw + '</html>' : raw + '</body></html>';
  }

  // Convert vh units to px — the live-preview iframe is auto-sized to content
  // height, so vh creates a sizing feedback loop. px keeps heroes/sections stable.
  raw = raw.split('100vh').join('760px');
  raw = raw.split('95vh').join('720px');
  raw = raw.split('90vh').join('700px');
  raw = raw.split('85vh').join('660px');
  raw = raw.split('80vh').join('620px');
  raw = raw.split('70vh').join('540px');
  raw = raw.split('60vh').join('460px');
  raw = raw.split('50vh').join('400px');

  return raw;
}



