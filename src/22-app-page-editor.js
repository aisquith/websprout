<script>/*WS_EDITOR_JS*/
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
      toast('\uD83C\uDF89 Thanks! Starting your free trial...',6000);
      var tries=0;
      var iv=setInterval(function(){
        tries++;
        fetch('/me').then(function(r){return r.json();}).then(function(me){
          window._wsUser=me;
          if(me&&me.pro){clearInterval(iv);unlocked=true;try{applyUnlock();}catch(e){}toast('\u2705 You are Pro \u2014 everything is unlocked!',6000);}
          else if(tries>=8){clearInterval(iv);toast('All set \u2014 if it does not unlock shortly, refresh the page.',7000);}
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
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:window._wsSiteData||undefined,html:html,slug:slug,siteId:sid,key:k,pages:(window._wsPages&&window._wsPages.length>1)?(window.wsSyncPages&&window.wsSyncPages(),window._wsPages.map(function(p){return{path:p.path,html:p.html};})):undefined})}).then(function(r){return r.json();}).then(function(j){
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
// Structured-site data snapshot for each undo state, so Undo/Redo also restores what the Edit panel renders from.
var _wsSdSnaps=new Map();
function wsSnapSiteData(html){try{if(window._wsSiteData&&typeof html==='string')_wsSdSnaps.set(html,JSON.stringify(window._wsSiteData));if(_wsSdSnaps.size>40){_wsSdSnaps.forEach(function(v,k){if(undoStack.indexOf(k)<0&&redoStack.indexOf(k)<0)_wsSdSnaps.delete(k);});}}catch(e){}}
function wsRestoreSiteData(html){try{var s=_wsSdSnaps.get(html);if(s){window._wsSiteData=JSON.parse(s);try{wsPersistSiteData();}catch(e){}try{if(document.getElementById('wsEdHost'))wsOpenEditor();}catch(e){}}}catch(e){}}
function wsPersistSiteData(){try{if(window._wsSiteData)localStorage.setItem('ws_sd',JSON.stringify(window._wsSiteData));}catch(e){}}
function wsLoadSiteData(sid){try{if(window._wsSiteData)return;var raw=localStorage.getItem('ws_sd');if(!raw)return;var o=JSON.parse(raw);if(o&&o.sections&&(!sid||!o.siteId||o.siteId===sid))window._wsSiteData=o;}catch(e){}}
function wsTrackOnce(ev,scope){try{var k='ws_tr_'+ev+'_'+(scope||'');if(localStorage.getItem(k))return;localStorage.setItem(k,'1');}catch(e){}try{fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:ev,url:location.href,ref:document.referrer})});}catch(e){}}
function pushUndo(html){
  wsSnapSiteData(html);
  if(undoStack.length>=1)wsTrackOnce('first_edit',window._wsSite||localStorage.getItem('ws_site')||'');
  undoStack.push(html);
  if(undoStack.length>10)undoStack.shift();
  redoStack=[]; // a new edit invalidates the redo history
  refreshHistoryBtns();
  autoSyncLive();
  scheduleSave();
}

function refreshHistoryBtns(){
  var ub=document.getElementById('undoBtn');
  if(ub){ub.disabled=undoStack.length<2;ub.innerHTML='<svg class="ic" aria-hidden="true" focusable="false"><use href="#i-undo"/></svg><span class="s-lbl">Undo</span>';ub.title='Undo'+(undoStack.length>1?' ('+(undoStack.length-1)+')':'')+'  Ctrl+Z';}
  var rb=document.getElementById('redoBtn');
  if(rb){rb.disabled=redoStack.length<1;rb.innerHTML='<svg class="ic" aria-hidden="true" focusable="false"><use href="#i-redo"/></svg><span class="s-lbl">Redo</span>';rb.title='Redo'+(redoStack.length>0?' ('+redoStack.length+')':'')+'  Ctrl+Shift+Z';}
}

function syncEditCounter(){
  var ec=document.getElementById('editCounter');
  if(ec){ec.textContent=editCount+' edit'+(editCount===1?'':'s');ec.style.display=editCount===0?'none':'inline';}
}

function doUndo(){
  if(undoStack.length<2)return;
  redoStack.push(undoStack.pop()); // move current state onto redo stack
  gHTML=undoStack[undoStack.length-1];
  wsRestoreSiteData(gHTML);
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
  wsRestoreSiteData(gHTML);
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

// True content height of a preview document: the lowest bottom edge among the body's own children,
// ignoring scripts/styles and position:fixed chrome. Immune to the iframe's placeholder height.
function wsFrameContentH(d){
  try{
    var max=0,kids=d.body.children;
    for(var i=0;i<kids.length;i++){
      var el=kids[i];var tn=el.tagName;
      if(tn==='SCRIPT'||tn==='STYLE'||tn==='LINK')continue;
      var cs=el.ownerDocument.defaultView.getComputedStyle(el);
      if(cs&&cs.position==='fixed')continue;
      var r=el.getBoundingClientRect();var mb=(cs&&parseFloat(cs.marginBottom))||0;
      if(r.height>0&&r.bottom+mb>max)max=r.bottom+mb;
    }
    return Math.ceil(max)||d.body.scrollHeight||0;
  }catch(e){return (d&&d.body&&d.body.scrollHeight)||0;}
}
// Continuous resize: the preview posts its height on any layout change (edits, page switches); fit to it.
if(!window._wsHWired){window._wsHWired=true;window.addEventListener('message',function(ev){
  var m=ev&&ev.data;if(!m||typeof m.wsH!=='number')return;
  var f=document.getElementById('pf');if(f&&m.wsH>80)f.style.height=m.wsH+'px';
});}
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
        'var ov=document.createElement(\"div\");ov.setAttribute(\"data-wsov\",\"1\");'+
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

    // Auto-resize: report true content height to the parent on any layout change (edits, page switches).
    'function wsCH(){try{var max=0,kids=document.body.children;for(var i=0;i<kids.length;i++){var el=kids[i],tn=el.tagName;if(tn===\"SCRIPT\"||tn===\"STYLE\"||tn===\"LINK\")continue;var cs=getComputedStyle(el);if(cs&&cs.position===\"fixed\")continue;var r=el.getBoundingClientRect();var mb=parseFloat(cs.marginBottom)||0;if(r.height>0&&r.bottom+mb>max)max=r.bottom+mb;}return Math.ceil(max)||document.body.scrollHeight||0;}catch(e){return document.body.scrollHeight||0;}}'+
    'var _wsLH=0;function wsPostH(){try{var h=wsCH();if(h>60&&Math.abs(h-_wsLH)>1){_wsLH=h;parent.postMessage({wsH:h},\"*\");}}catch(e){}}'+
    'if(window.ResizeObserver){try{new ResizeObserver(wsPostH).observe(document.body);}catch(e){}}'+
    'window.addEventListener(\"load\",wsPostH);window.addEventListener(\"hashchange\",function(){setTimeout(wsPostH,60);setTimeout(wsPostH,450);});'+
    'setTimeout(wsPostH,80);setTimeout(wsPostH,400);setTimeout(wsPostH,1000);setTimeout(wsPostH,2200);'+

  '</sc'+'ript>';
  // Use lastIndexOf to find the REAL </body> — not one inside a JS string
  function wsRenderProducts(list){var esc=function(x){x=String(x==null?"":x);return x.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(String.fromCharCode(34)).join("&quot;");};var css='<style>.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;max-width:1100px;margin:0 auto;padding:8px 0}.wsp-card{border:1px solid rgba(128,128,128,.18);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;background:rgba(128,128,128,.04)}.wsp-img{aspect-ratio:4/3;background-size:cover;background-position:center}.wsp-noimg{background:linear-gradient(135deg,rgba(128,128,128,.12),rgba(128,128,128,.05))}.wsp-body{padding:16px;display:flex;flex-direction:column;gap:6px}.wsp-name{font-weight:700;font-size:1.05rem}.wsp-price{font-weight:700;opacity:.85}.wsp-desc{font-size:.9rem;opacity:.7;line-height:1.5}.wsp-buy{margin-top:8px;display:inline-block;text-align:center;padding:10px 16px;border:1px solid currentColor;border-radius:10px;text-decoration:none;color:inherit;font-weight:600}.wsp-tabs{position:relative;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:1100px;margin:0 auto 26px;padding-bottom:12px}.wsp-tab{background:none;border:none;font:inherit;font-weight:700;font-size:.9rem;letter-spacing:.03em;text-transform:uppercase;color:inherit;opacity:.45;cursor:pointer;padding:6px 14px;transition:opacity .2s}.wsp-tab.wsp-tab-on{opacity:1}.wsp-tab-ind{position:absolute;bottom:0;height:2px;background:currentColor;border-radius:2px;transition:left .28s ease,width .28s ease;left:0;width:0}</style>';if(!list||!list.length){return css+'<div style="text-align:center;opacity:.55;padding:44px 0;font-size:1rem">Your products show here - add them from the Manage menu (Products &amp; cart).</div>';}var cards="";for(var i=0;i<list.length;i++){var p=list[i]||{};var img=p.img?('<div class="wsp-img" style="background-image:url('+esc(p.img)+')"></div>'):'<div class="wsp-img wsp-noimg"></div>';var price=p.price?('<div class="wsp-price">'+esc(p.price)+'</div>'):"";var desc=p.desc?('<div class="wsp-desc">'+esc(p.desc)+'</div>'):"";var pu=String(p.payUrl||"");var buy=(pu.indexOf("https://")===0)?('<a class="wsp-buy" href="'+esc(pu)+'" target="_blank" rel="noopener">Buy now</a>'):('<button class="wsp-buy" type="button" onclick="if(window.wsAddToCart)wsAddToCart('+i+')">Add to cart</button>');cards+='<div class="wsp-card" data-category="'+esc(p.category||"")+'">'+img+'<div class="wsp-body"><div class="wsp-name">'+esc(p.name||"Product")+'</div>'+price+desc+buy+'</div></div>';}var _cats=[];for(var _ci=0;_ci<list.length;_ci++){var _cc=String((list[_ci]||{}).category||"").trim();if(_cc&&_cats.indexOf(_cc)<0)_cats.push(_cc);}var _tabs="";if(_cats.length>=2){_tabs='<div class="wsp-tabs"><button type="button" class="wsp-tab wsp-tab-on" data-cat="">All</button>';for(var _ti=0;_ti<_cats.length;_ti++){_tabs+='<button type="button" class="wsp-tab" data-cat="'+esc(_cats[_ti])+'">'+esc(_cats[_ti])+'</button>';}_tabs+='<span class="wsp-tab-ind"></span></div>';}return css+_tabs+'<div class="wsp-grid">'+cards+'</div>';}
  var bodyClose=html.lastIndexOf('</body>');
  var out=bodyClose>-1?html.slice(0,bodyClose)+slotScript+'</body>'+html.slice(bodyClose+7):html+slotScript;
  try{var _ne=out.indexOf('</nav>'),_he=out.indexOf('</header>'),_bd=-1;if(_ne>=0)_bd=_ne+6;if(_he>=0&&_he+9>_bd)_bd=_he+9;if(_bd>0&&out.slice(0,_bd).indexOf('<!--WS_PRODUCTS-->')>-1){out=out.slice(0,_bd).split('<!--WS_PRODUCTS-->').join('')+out.slice(_bd);if(out.indexOf('<!--WS_PRODUCTS-->')<0){var _ps='<section id="shop" style="padding:64px 24px"><div style="max-width:1100px;margin:0 auto"><h2 style="text-align:center;margin:0 0 28px;font-size:2rem">Shop</h2><!--WS_PRODUCTS--></div></section>';var _pbi=out.lastIndexOf('</body>');out=_pbi>-1?(out.slice(0,_pbi)+_ps+out.slice(_pbi)):(out+_ps);}}}catch(e){}
  try{if(out.indexOf('<!--WS_PRODUCTS-->')>-1){out=out.split('<!--WS_PRODUCTS-->').join('<!--WSP_S-->'+wsRenderProducts(window._wsProducts||[])+'<!--WSP_E-->');}}catch(e){}
  try{ if(window._wsCartHtml){ var _cbi=out.lastIndexOf('</body>'); out=_cbi>-1?(out.slice(0,_cbi)+'<!--WSC_S-->'+window._wsCartHtml+'<!--WSC_E-->'+out.slice(_cbi)):(out+'<!--WSC_S-->'+window._wsCartHtml+'<!--WSC_E-->'); } }catch(e){}
  f.style.height='4000px';
  f.onload=function(){try{wsBindPreview();}catch(e){}};
  f.srcdoc=out;
  // Poll for real content height - CSS may not be applied at onload time
  var attempts=0;
  var lastH=0;
  var timer=setInterval(function(){
    attempts++;
    try{
      var d=f.contentDocument||f.contentWindow.document;
      if(d&&d.body){
        // Measure the true content height from the bottom edge of the body's own children. This is
        // immune to the 4000px placeholder inflating documentElement.scrollHeight on short pages.
        var h=wsFrameContentH(d);
        if(h>120){
          var skel=document.getElementById('skelWrap');
          if(skel){skel.classList.remove('show');setStudioReady(true);}
        }
        if(h>80&&h!==lastH){
          lastH=h;
          f.style.height=h+'px';
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
    document.getElementById('next1').classList.add('on');
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
    var ty=(document.getElementById('bizType')||{}).value||'';
    if(!ty.trim()){var bt=document.getElementById('bizType');if(bt)bt.focus();toast('What kind of business is it? 🌱');return;}
    doCreateV3();
  });
  var _n2e=document.getElementById('next2');if(_n2e)_n2e.addEventListener('click',function(){buildSummary();showPanel(3);});
  var _b2e=document.getElementById('back2');if(_b2e)_b2e.addEventListener('click',function(){showPanel(1);});
  document.getElementById('back3').addEventListener('click',function(){showPanel(2);});

  // Scroll to builder
  ['navCta','heroCta','ctaBtn'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(){document.getElementById('builder').scrollIntoView({behavior:'smooth'});});
  });

  // Generate
  document.getElementById('gbtn').addEventListener('click',doCreateV3);

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
    var sd=window._wsSiteData;
    if(sd&&window.WS&&window.WS.palettes){wsShuffleLook();return;}
    document.getElementById('studio').classList.remove('on');
    document.body.style.overflow='';
    document.getElementById('builder').scrollIntoView({behavior:'smooth'});
    setTimeout(doCreateV3,300);
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
    if(window._wsSiteData&&window.WS){
      var _b=window._wsSiteData.biz=window._wsSiteData.biz||{};
      if(title)_b.seoTitle=title.slice(0,90);else delete _b.seoTitle;
      if(desc)_b.seoDescription=desc.slice(0,300);else delete _b.seoDescription;
      wsRerender();document.getElementById('seoModal').classList.remove('on');toast('Search settings saved',3000);
      try{if(window.wsPanelTab==='site')wsOpenEditor();}catch(e){}
      return;
    }
    var _esc=function(s){return String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');};
    title=_esc(title);desc=_esc(desc);
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
    try{}catch(e2){}
    try{document.getElementById('next2').addEventListener('click',function(){buildSummary();showPanel(3);});}catch(e2){}
    try{document.getElementById('back2').addEventListener('click',function(){showPanel(1);});}catch(e2){}
    try{document.getElementById('back3').addEventListener('click',function(){showPanel(2);});}catch(e2){}
    try{document.getElementById('gbtn').addEventListener('click',doCreateV3);}catch(e2){}
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

function wsSoftRetry(){
  window._wsGenTries=(window._wsGenTries||0)+1;
  var tries=window._wsGenTries;
  if(tries>4){wsGenGiveUpFriendly();return;}
  try{var _st=document.getElementById('studio');if(_st)_st.classList.add('on');document.body.style.overflow='hidden';var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.add('show');}catch(e){}
  var delays=[0,7,13,20,28];
  var wait=delays[tries<delays.length?tries:delays.length-1];
  var msgs=['High demand right now — reserving your spot and trying again','Still growing your site — thanks for hanging on','Almost there — giving it another go','One more try — we are nearly there'];
  var baseMsg=msgs[(tries-1)<msgs.length?(tries-1):(msgs.length-1)];
  var secs=wait;
  var sm=document.getElementById('skelMsg');
  var tel=document.getElementById('toast');
  function paint(){var t=baseMsg+(secs>0?(' in '+secs+'s'):'...');if(sm)sm.textContent=t;if(tel){tel.textContent=t;tel.classList.add('on');}}
  paint();
  var cd=setInterval(function(){secs--;if(secs<=0){clearInterval(cd);if(tel)tel.classList.remove('on');if(sm)sm.textContent=baseMsg+'...';try{doGenerate();}catch(e){wsGenGiveUpFriendly();}}else{paint();}},1000);
}
function wsGenGiveUpFriendly(){
  window._wsGenTries=0;
  try{var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.remove('show');var _st=document.getElementById('studio');if(_st)_st.classList.remove('on');document.body.style.overflow='';}catch(e){}
  try{var b=document.getElementById('gbtn');if(b)b.disabled=false;var gt=document.getElementById('gbtnTxt');if(gt)gt.textContent='Grow my site';var ga2=document.getElementById('gen-area');if(ga2)ga2.style.display='block';var pf2=document.getElementById('p3foot');if(pf2)pf2.style.display='flex';var ld3=document.getElementById('loading');if(ld3)ld3.classList.remove('on');}catch(e){}
  try{var tel=document.getElementById('toast');if(tel){tel.innerHTML='🌱 We are growing a lot of sites right now and yours is taking a little longer than usual. Give it a few seconds, then tap <b>Grow my site</b> again.';tel.classList.add('on');setTimeout(function(){tel.classList.remove('on');},13000);}}catch(e){}
}
function parseList(txt){var out=[];var NL=String.fromCharCode(10);(txt||'').split(NL).forEach(function(line){line=(line||'').trim();if(line.charAt(0)==='-'||line.charAt(0)==='*')line=line.slice(1).trim();if(!line)return;var parts=line.split(' - ');var name=(parts[0]||'').trim();var price=((parts[1]||'')+'').replace(/[^0-9.]/g,'').trim();var desc=(parts[2]||'').trim();if(name)out.push({name:name.slice(0,80),price:price.slice(0,20),desc:desc.slice(0,160)});});return out;}
// v3 structured editor drawer. Edits the in-memory site (window._wsSiteData) and re-renders live.
// Escape-safe for the PAGE literal: no backticks, no dollar-brace, no backslash escapes.
var wsEdSel = 0;
// ---- Multi-page editor helpers: the editor edits ONE page at a time (the active page's sections). ----
if(typeof window._wsPageIdx!=='number')window._wsPageIdx=0;
function wsIsMulti(){return !!(window._wsSiteData&&window._wsSiteData.pages&&window._wsSiteData.pages.length>1);}
function wsActivePageIdx(){if(!wsIsMulti())return -1;var n=window._wsSiteData.pages.length;if(window._wsPageIdx>=n||window._wsPageIdx<0)window._wsPageIdx=0;return window._wsPageIdx;}
function wsActiveSections(){if(wsIsMulti()){var p=window._wsSiteData.pages[wsActivePageIdx()];if(!p.sections)p.sections=[];return p.sections;}if(!window._wsSiteData.sections)window._wsSiteData.sections=[];return window._wsSiteData.sections;}
function wsActivePath(){if(wsIsMulti()){var p=window._wsSiteData.pages[wsActivePageIdx()];return p?(p.path||''):'';}return null;}
function wsGotoPreviewPage(path){try{var f=document.getElementById('pf');if(f&&f.contentWindow)f.contentWindow.postMessage({ws:true,type:'wsGoPage',path:path||''},'*');}catch(e){}}
// Keep the editor's active page in sync when the user clicks the nav inside the live preview.
if(!window._wsPageMsgWired){window._wsPageMsgWired=true;window.addEventListener('message',function(ev){var m=ev&&ev.data;if(!m||!m.ws||m.type!=='wsPageShown'||!wsIsMulti())return;var pth=m.path||'',idx=-1,pgs=window._wsSiteData.pages;for(var i=0;i<pgs.length;i++){if((pgs[i].path||'')===pth){idx=i;break;}}if(idx>=0&&idx!==window._wsPageIdx){window._wsPageIdx=idx;wsEdSel=-1;try{if(document.getElementById('wsEdHost'))wsOpenEditor();}catch(e){}}});}
function wsRerender(){
  try{
    if(!window.WS||!window._wsSiteData)return;
    if(!window._wsSiteData.siteId&&(window._wsSite||localStorage.getItem('ws_site')))window._wsSiteData.siteId=window._wsSite||localStorage.getItem('ws_site');
    var h=window.WS.renderSite(window._wsSiteData,{mode:'live',activePath:wsActivePath()});
    gHTML=h;try{localStorage.setItem('wsh',h);}catch(e){}
    wsPersistSiteData();
    setPreview(h);
    if(typeof bumpEditCount==='function')bumpEditCount();
    // Record an undo step for structured edits (debounced so rapid typing collapses into one step).
    if(window.pushUndo){clearTimeout(window._wsUndoT);window._wsUndoT=setTimeout(function(){try{pushUndo(gHTML);}catch(e){}},650);}
    else if(typeof scheduleSave==='function')scheduleSave();
  }catch(e){}
}
function wsMk(tag,style,txt){var el=document.createElement(tag);if(style)el.setAttribute('style',style);if(txt!=null)el.textContent=txt;return el;}
function wsFieldDefs(type){try{var s=window.WS.sections[type];return (s&&s.fields)||[];}catch(e){return [];}}
// Build one control for a field; on change mutate the object key and re-render (no drawer rebuild, keeps focus).
// Modern editor UI: one injected stylesheet + a class-based element helper.
function wseEl(tag,cls,txt){var el=document.createElement(tag);if(cls)el.className=cls;if(txt!=null)el.textContent=txt;return el;}
function wsEditorCss(){
  if(document.getElementById('wse-css'))return;
  var css=".wse{color:#e9e9ec;font:13px/1.45 system-ui,-apple-system,sans-serif;color-scheme:dark}"
   +".wse-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}"
   +".wse-title{font-size:13px;font-weight:700;letter-spacing:.02em;color:#fff}"
   +".wse-label{font-size:10px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:rgba(255,255,255,.38);margin:14px 2px 8px}"
   +".wse-label:first-child{margin-top:2px}"
   +".wse-manage{display:flex;flex-wrap:wrap;gap:6px}"
   +".wse-mbtn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);color:#cfcfd4;border-radius:8px;padding:7px 11px;cursor:pointer;font:600 11.5px/1 system-ui,sans-serif;transition:background .15s,border-color .15s,color .15s}"
   +".wse-mbtn:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2);color:#fff}"
   +".wse-mbtn.danger{color:rgba(239,106,106,.85)}.wse-mbtn.danger:hover{background:rgba(239,106,106,.12);border-color:rgba(239,106,106,.3);color:#ff8a8a}"
   +".wse-pals{display:flex;flex-wrap:wrap;gap:7px;max-height:106px;overflow-y:auto;padding:3px;margin:0 -3px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}"
   +".wse-pals::-webkit-scrollbar{width:8px}.wse-pals::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:4px}.wse-pals::-webkit-scrollbar-track{background:transparent}"
   +".wse-sw{width:26px;height:26px;border-radius:8px;padding:0;cursor:pointer;flex:none;border:2px solid rgba(255,255,255,.14);transition:transform .15s,border-color .15s,box-shadow .15s}"
   +".wse-sw:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.4)}"
   +".wse-sw.on{border-color:#fff;box-shadow:0 0 0 2px rgba(53,184,90,.65)}"
   +".wse-field{width:100%;background:rgba(255,255,255,.045);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;font:13px/1.3 system-ui,sans-serif;transition:border-color .15s,background .15s;box-sizing:border-box}"
   +".wse-field:focus{outline:none;border-color:rgba(53,184,90,.7);background:rgba(255,255,255,.07)}"
   +"textarea.wse-field{min-height:70px;resize:vertical}"
   +".wse-tabs{display:flex;flex-wrap:wrap;gap:7px}"
   +".wse-tab{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#d6d6da;border-radius:999px;padding:7px 14px;cursor:pointer;font:600 12px/1 system-ui,sans-serif;transition:background .15s,color .15s,box-shadow .15s,border-color .15s}"
   +".wse-tab:hover{background:rgba(255,255,255,.1);color:#fff}"
   +".wse-tab.on{background:linear-gradient(135deg,#37c15e,#2a9a4a);border-color:transparent;color:#fff;box-shadow:0 5px 14px rgba(42,154,74,.4)}"
   +".wse-tab.add{border-style:dashed;color:rgba(255,255,255,.5);font-weight:700}"
   +".wse-tab.add:hover{color:#fff;border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.04)}"
   +".wse-tools{display:flex;flex-wrap:wrap;gap:16px;margin:11px 2px 2px}"
   +".wse-link{background:none;border:none;cursor:pointer;font:600 11px/1 system-ui,sans-serif;padding:0;color:rgba(255,255,255,.5);transition:color .15s}"
   +".wse-link:hover{color:#fff}.wse-link.go{color:#6fd389}.wse-link.go:hover{color:#8fe6a6}.wse-link.danger{color:#ef6a6a}.wse-link.danger:hover{color:#ff8a8a}"
   +".wse-sec{border:1px solid rgba(255,255,255,.08);border-radius:11px;margin-bottom:6px;overflow:hidden;background:rgba(255,255,255,.022);transition:border-color .15s,background .15s}"
   +".wse-sec:hover{border-color:rgba(255,255,255,.16)}"
   +".wse-sec.on{border-color:rgba(53,184,90,.5);background:rgba(53,184,90,.07)}"
   +".wse-bar{display:flex;align-items:center;gap:2px;padding:8px 9px 8px 12px}"
   +".wse-name{flex:1;text-align:left;background:none;border:none;color:#fff;cursor:pointer;font:600 13px/1.2 system-ui,sans-serif;display:flex;align-items:center;gap:9px}"
   +".wse-name .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.22);flex:none;transition:background .15s,box-shadow .15s}"
   +".wse-sec.on .wse-name .dot{background:#37c15e;box-shadow:0 0 0 3px rgba(55,193,94,.2)}"
   +".wse-ico{width:28px;height:28px;display:grid;place-items:center;background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:14px;border-radius:7px;transition:background .15s,color .15s;flex:none}"
   +".wse-ico:hover{background:rgba(255,255,255,.1);color:#fff}.wse-ico.danger:hover{background:rgba(239,106,106,.16);color:#ff8a8a}"
   +".wse-body{padding:2px 13px 13px;border-top:1px solid rgba(255,255,255,.06);margin-top:2px}"
   +".wse-ctl{margin:10px 0}.wse-ctl-label{font-size:10px;color:rgba(255,255,255,.44);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;font-weight:600}"
   +".wse-item{border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:11px 12px;margin:9px 0;background:rgba(255,255,255,.02)}"
   +".wse-rm{background:none;border:none;color:#ef6a6a;cursor:pointer;font:600 12px/1 system-ui,sans-serif;padding:5px 0;margin-top:4px}.wse-rm:hover{color:#ff8a8a}"
   +".wse-addi{background:rgba(53,184,90,.14);border:1px solid rgba(53,184,90,.32);color:#9fe6b4;border-radius:9px;padding:8px 14px;cursor:pointer;font:600 12px/1 system-ui,sans-serif;margin-top:6px;transition:background .15s}.wse-addi:hover{background:rgba(53,184,90,.24)}"
   +".wse-add{display:flex;gap:8px;margin-top:16px}.wse-add .wse-field{flex:1}"
   +".wse-btn{background:linear-gradient(135deg,#37c15e,#2a9a4a);border:none;color:#fff;border-radius:10px;padding:10px 18px;cursor:pointer;font:700 13px/1 system-ui,sans-serif;transition:filter .15s,transform .08s;box-shadow:0 5px 14px rgba(42,154,74,.32)}.wse-btn:hover{filter:brightness(1.08)}.wse-btn:active{transform:translateY(1px)}"
   +".wse-emoji{display:flex;align-items:center;gap:10px}"
   +".wse-emoji-prev{width:42px;height:42px;flex:none;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:rgba(255,255,255,.04);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:border-color .15s,background .15s}"
   +".wse-emoji-prev:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.07)}"
   +".wse-emoji-add{color:rgba(255,255,255,.45);font-size:21px;line-height:1}";
  var st=document.createElement('style');st.id='wse-css';st.textContent=css;document.head.appendChild(st);
}
function wsControl(obj,f){
  var wrap=wseEl('div','wse-ctl');
  if(f.label)wrap.appendChild(wseEl('div','wse-ctl-label',f.label));
  var val=obj[f.key];
  if(f.type==='textarea'){
    var ta=wseEl('textarea','wse-field');ta.value=(val==null?'':val);ta.addEventListener('input',function(){obj[f.key]=ta.value;wsRerender();});wrap.appendChild(ta);return wrap;
  }
  if(f.type==='select'){
    var sel=wseEl('select','wse-field');
    var opts=typeof f.options==='function'?f.options():(f.options||[]);
    opts.forEach(function(o){var id=Array.isArray(o)?o[0]:o;var nm=Array.isArray(o)?o[1]:o;var op=wseEl('option',null,nm);op.value=id;if(id===val)op.selected=true;sel.appendChild(op);});
    sel.addEventListener('change',function(){obj[f.key]=sel.value;wsRerender();});wrap.appendChild(sel);return wrap;
  }
  if(f.type==='list'){
    var items=obj[f.key]||(obj[f.key]=[]);
    items.forEach(function(it,ix){
      var card=wseEl('div','wse-item');
      (f.item||[]).forEach(function(sf){card.appendChild(wsControl(it,sf));});
      var rm=wseEl('button','wse-rm','Remove');rm.type='button';
      rm.addEventListener('click',function(){items.splice(ix,1);wsRerender();wsOpenEditor();});
      card.appendChild(rm);wrap.appendChild(card);
    });
    var addb=wseEl('button','wse-addi',(f.add||'Add item'));addb.type='button';
    addb.addEventListener('click',function(){var blank={};(f.item||[]).forEach(function(sf){blank[sf.key]='';});items.push(blank);wsRerender();wsOpenEditor();});
    wrap.appendChild(addb);return wrap;
  }
  if(f.type==='toggle'){
    var tg=wseEl('select','wse-field');
    [['true','Yes'],['false','No']].forEach(function(o){var op=wseEl('option',null,o[1]);op.value=o[0];if((val?'true':'false')===o[0])op.selected=true;tg.appendChild(op);});
    tg.addEventListener('change',function(){obj[f.key]=(tg.value==='true');wsRerender();});wrap.appendChild(tg);return wrap;
  }
  if(f.type==='emoji'){
    var ebox=wseEl('div','wse-emoji');
    var eprev=wseEl('button','wse-emoji-prev');eprev.type='button';
    var setEprev=function(){eprev.innerHTML='';var cv=obj[f.key];if(cv){eprev.appendChild(wsEmoImg(cv,24));}else{eprev.appendChild(wseEl('span','wse-emoji-add','+'));}};
    setEprev();
    var elab=wseEl('button','wse-link go','Pick an emoji');elab.type='button';
    var eclr=wseEl('button','wse-link danger','Clear');eclr.type='button';eclr.style.marginLeft='auto';
    var openPick=function(ev){if(ev&&ev.stopPropagation)ev.stopPropagation();wsEmojiPicker(eprev,function(code){obj[f.key]=code;setEprev();wsRerender();});};
    eprev.addEventListener('click',openPick);elab.addEventListener('click',openPick);
    eclr.addEventListener('click',function(ev){ev.stopPropagation();obj[f.key]='';setEprev();wsRerender();});
    ebox.appendChild(eprev);ebox.appendChild(elab);ebox.appendChild(eclr);wrap.appendChild(ebox);return wrap;
  }
  var inp=wseEl('input','wse-field');
  inp.type='text';inp.value=(val==null?'':val);
  if(f.type==='photo')inp.placeholder='Image URL';
  inp.addEventListener('input',function(){obj[f.key]=inp.value;wsRerender();});
  wrap.appendChild(inp);return wrap;
}
function wsEmoImg(code,size){var im=document.createElement('img');try{im.src=window.WS.emojiUrl(code);}catch(e){}im.alt='';im.style.cssText='width:'+size+'px;height:'+size+'px;object-fit:contain';im.addEventListener('error',function(){try{this.replaceWith(document.createTextNode(window.WS.emojiChar(code)));}catch(e){}});return im;}
function wsEmojiPicker(anchor,onPick){
  var old=document.getElementById('wsEmojiPop');if(old)old.remove();
  var pop=wsMk('div','position:fixed;z-index:2147483100;width:306px;max-height:352px;background:#17181c;border:1px solid rgba(255,255,255,.1);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.6);padding:11px;display:flex;flex-direction:column;gap:9px;font-family:system-ui,sans-serif;color-scheme:dark');
  pop.id='wsEmojiPop';
  var search=wsMk('input','width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;outline:none;font-family:inherit;box-sizing:border-box');search.type='text';search.placeholder='Search emoji...';
  var grid=wsMk('div','display:grid;grid-template-columns:repeat(7,1fr);gap:3px;overflow-y:auto;padding-right:2px');
  pop.appendChild(search);pop.appendChild(grid);
  var kw=(window.WS&&window.WS.EMOJI&&window.WS.EMOJI.kw)||{};
  var codes=Object.keys(kw);
  var render=function(q){
    grid.innerHTML='';q=(q||'').toLowerCase().trim();var shown=0;
    for(var i=0;i<codes.length&&shown<140;i++){var c=codes[i];if(q&&(kw[c]||'').toLowerCase().indexOf(q)<0)continue;
      var bt=wsMk('button','width:100%;aspect-ratio:1;border:none;border-radius:7px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0');bt.type='button';bt.title=window.WS.emojiName(c);
      bt.appendChild(wsEmoImg(c,22));
      (function(code){bt.addEventListener('click',function(ev){ev.stopPropagation();onPick(code);pop.remove();});})(c);
      bt.addEventListener('mouseover',function(){this.style.background='#2a2a2a';});bt.addEventListener('mouseout',function(){this.style.background='transparent';});
      grid.appendChild(bt);shown++;
    }
    if(!shown){var ne=wsMk('div','grid-column:1/-1;color:#888;font-size:12px;padding:14px;text-align:center','No matches');grid.appendChild(ne);}
  };
  render('');
  search.addEventListener('input',function(){render(search.value);});
  document.body.appendChild(pop);
  var r=anchor.getBoundingClientRect();
  var top=Math.min(r.bottom+6,window.innerHeight-360);var left=Math.min(r.left,window.innerWidth-316);
  pop.style.top=Math.max(8,top)+'px';pop.style.left=Math.max(8,left)+'px';
  setTimeout(function(){try{search.focus();}catch(e){}},30);
  var close=function(e){if(!pop.contains(e.target)&&e.target!==anchor){pop.remove();document.removeEventListener('mousedown',close,true);document.removeEventListener('keydown',onKey,true);}};
  var onKey=function(e){if(e.key==='Escape'){pop.remove();document.removeEventListener('mousedown',close,true);document.removeEventListener('keydown',onKey,true);}};
  setTimeout(function(){document.addEventListener('mousedown',close,true);document.addEventListener('keydown',onKey,true);},0);
}
// ---- Page templates: "+ Page" opens a picker of ready-made pages (blank, contact, scheduling, applications, and more). ----
function wsMkSec(type,ov){return Object.assign({id:type+'-'+window.WS.uid(),type:type},window.WS.sections[type].create(window._wsSiteData),ov||{});}
function wsPH(title,text){return wsMkSec('pagehead',{title:title,text:text||''});}
function wsPageTemplates(){
  return [
    {id:'blank',label:'Blank page',desc:'Start from scratch',make:function(n){return [wsPH(n||'New page','')];}},
    {id:'about',label:'About',desc:'Your story and team',title:'About',path:'about',make:function(){return [wsPH('About us',''),wsMkSec('intro',{variant:'center'}),wsMkSec('team',{})];}},
    {id:'services',label:'Services',desc:'What you offer',title:'Services',path:'services',make:function(){return [wsPH('Services',''),wsMkSec('services',{variant:'grid'}),wsMkSec('cta',{variant:'band'})];}},
    {id:'pricing',label:'Pricing',desc:'A clear price list',title:'Pricing',path:'pricing',make:function(){return [wsPH('Pricing',''),wsMkSec('prices',{variant:'board'})];}},
    {id:'menu',label:'Menu',desc:'Food and drink menu',title:'Menu',path:'menu',make:function(){return [wsPH('Menu',''),wsMkSec('prices',{variant:'board'})];}},
    {id:'shop',label:'Shop',desc:'Products with a cart',title:'Shop',path:'shop',make:function(){return [wsPH('Shop',''),wsMkSec('products',{variant:'grid'})];}},
    {id:'gallery',label:'Gallery',desc:'Show off your work',title:'Gallery',path:'gallery',make:function(){return [wsPH('Gallery',''),wsMkSec('gallery',{variant:'strip'})];}},
    {id:'reviews',label:'Reviews',desc:'What clients say',title:'Reviews',path:'reviews',make:function(){return [wsPH('Reviews',''),wsMkSec('reviews',{variant:'wall'})];}},
    {id:'faq',label:'FAQ',desc:'Answer common questions',title:'FAQ',path:'faq',make:function(){return [wsPH('FAQ',''),wsMkSec('faq',{variant:'accordion'})];}},
    {id:'team',label:'Team',desc:'Meet the people',title:'Team',path:'team',make:function(){return [wsPH('Our team',''),wsMkSec('team',{})];}},
    {id:'steps',label:'How it works',desc:'A step-by-step guide',title:'How it works',path:'how-it-works',make:function(){return [wsPH('How it works',''),wsMkSec('steps',{})];}},
    {id:'contact',label:'Contact',desc:'Form, hours and map',title:'Contact',path:'contact',make:function(){return [wsPH('Contact',''),wsMkSec('contact',{showPhone:true}),wsMkSec('visit',{variant:'hours'})];}},
    {id:'scheduling',label:'Scheduling',desc:'Appointment booking',title:'Book',path:'book',make:function(){return [wsPH('Book an appointment',''),wsMkSec('booking',{variant:'appointment',title:'',text:''})];}},
    {id:'reservations',label:'Reservations',desc:'Table reservations',title:'Reserve',path:'reserve',make:function(){return [wsPH('Reserve a table',''),wsMkSec('booking',{variant:'reservation',title:'',text:''})];}},
    {id:'quote',label:'Get a quote',desc:'Estimate requests',title:'Quote',path:'quote',make:function(){return [wsPH('Get a quote',''),wsMkSec('booking',{variant:'quote',title:'',text:''})];}},
    {id:'payments',label:'Payments',desc:'Deposits, invoices, gift cards',title:'Pay',path:'pay',make:function(){return [wsPH('Pay online',''),wsMkSec('payments',{title:'',note:''})];}},
    {id:'events',label:'Events',desc:'Upcoming events & specials',title:'Events',path:'events',make:function(){return [wsPH('Upcoming events',''),wsMkSec('events',{title:'',note:''})];}},
    {id:'servicearea',label:'Service area',desc:'ZIP-code coverage checker',title:'Service Area',path:'service-area',make:function(){return [wsPH('Do we serve your area?',''),wsMkSec('servicearea',{title:'',note:'Enter your ZIP code to find out.'})];}},
    {id:'applications',label:'Applications',desc:'Job application form',title:'Careers',path:'careers',make:function(){return [wsPH('Join our team',''),wsMkSec('booking',{variant:'application',title:'',text:''})];}},
    {id:'landing',label:'Landing page',desc:'Hero, highlights and a CTA',title:'Welcome',path:'welcome',make:function(){return [wsMkSec('hero',{variant:'photo'}),wsMkSec('services',{variant:'grid'}),wsMkSec('cta',{variant:'band'})];}}
  ];
}
function wsAddPageFromTemplate(tpl){
  try{
    var S=window._wsSiteData;if(!S||!S.pages)return;
    var title=tpl.title,path=tpl.path;
    if(tpl.id==='blank'){title=prompt('Page name:','New page');if(!title)return;title=title.slice(0,40);path='';}
    if(!path){path=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||('page'+Date.now());}
    var base=path,k=2;while(S.pages.some(function(p){return (p.path||'')===path;})){path=base+'-'+k;k++;}
    var secs=tpl.make(title)||[];
    S.pages.push({id:'pg-'+window.WS.uid(),path:path,title:title,nav:true,sections:secs});
    window._wsPageIdx=S.pages.length-1;wsEdSel=0;wsRerender();wsOpenEditor();
  }catch(e){}
}
function wsAddPagePicker(anchor){
  var old=document.getElementById('wsPagePop');if(old&&old.parentNode)old.parentNode.removeChild(old);
  // Centered modal so every template is always on-screen and reachable (the old anchored popup could
  // open below the fold, putting lower templates off-screen where clicks never registered).
  var ov=wsMk('div','position:fixed;inset:0;z-index:2147483200;background:rgba(6,8,10,.55);display:flex;align-items:center;justify-content:center;padding:20px;color-scheme:dark;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)');ov.id='wsPagePop';
  var pop=wsMk('div','background:#17181c;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 30px 70px rgba(0,0,0,.6);width:340px;max-width:100%;max-height:82vh;overflow:auto;padding:10px;font-family:system-ui,sans-serif');
  pop.appendChild(wsMk('div','font-size:10px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.11em;padding:8px 10px 10px','Add a page'));
  var remove=function(){if(ov.parentNode)ov.parentNode.removeChild(ov);document.removeEventListener('keydown',onKey,true);};
  var onKey=function(e){if(e.key==='Escape')remove();};
  wsPageTemplates().forEach(function(tpl){
    var row=wsMk('button','display:block;width:100%;text-align:left;background:none;border:none;border-radius:10px;padding:10px 11px;cursor:pointer;color:#eee');
    row.type='button';
    row.onmouseover=function(){row.style.background='rgba(255,255,255,.07)';};row.onmouseout=function(){row.style.background='none';};
    row.appendChild(wsMk('div','font-size:13px;font-weight:600',tpl.label));
    row.appendChild(wsMk('div','font-size:11px;color:#8a8a8a;margin-top:1px',tpl.desc));
    row.addEventListener('click',function(){remove();wsAddPageFromTemplate(tpl);});
    pop.appendChild(row);
  });
  ov.appendChild(pop);
  ov.addEventListener('click',function(e){if(e.target===ov)remove();});
  document.body.appendChild(ov);
  document.addEventListener('keydown',onKey,true);
}
// Manage toolbar inside the editor — mirrors the (now-removed) top-bar "Manage" menu by triggering the
// same hidden handler buttons, so site-wide tools live in the edit bar instead of a separate top dropdown.
function wsRenderManage(pad){
  var menu=document.getElementById('toolsMenu');if(!menu)return;
  var shortMap={yourInfoBtn:'Your info',seoBtn:'SEO',leadsBtn:'Leads',statsBtn:'Analytics',postBtn:'Marketing',payBtn:'Payments',invoiceBtn:'Invoice',regenBtn:'Redesign',backBtn:'Start over'};
  var items=menu.querySelectorAll('.gs-item');var list=[];
  for(var i=0;i<items.length;i++){
    var it=items[i];
    if(it.style.display==='none')continue;
    var tool=it.getAttribute('data-tool')||'';
    if(tool==='sectionsBtn')continue; // sections are edited inline below
    var raw=((it.firstChild&&it.firstChild.textContent)||'').replace(/\\s+/g,' ').trim();
    var sp=raw.indexOf(' ');var emoji=sp>0?raw.slice(0,sp):'';var rest=sp>0?raw.slice(sp+1):raw;
    var name=shortMap[tool]||((/Products/.test(rest))?'Products':rest);
    list.push({it:it,tool:tool,label:(emoji?emoji+' ':'')+name,danger:(tool==='backBtn')});
  }
  if(!list.length)return;
  pad.appendChild(wseEl('div','wse-label','Manage'));
  var g=wseEl('div','wse-manage');
  list.forEach(function(o){
    var b=wseEl('button','wse-mbtn'+(o.danger?' danger':''),o.label);b.type='button';
    // Trigger the hidden handler button directly (data-tool target), or the menu item's own onclick.
    b.addEventListener('click',function(){try{var t=o.tool&&document.getElementById(o.tool);if(t)t.click();else o.it.click();}catch(e){}});
    g.appendChild(b);
  });
  pad.appendChild(g);
}
// ---- Click-to-edit in the preview (structured sites) ---------------------------------------------
// Text you click in the preview is edited in place and written straight back to the site data, so it
// survives every later change. Clicking a photo opens the photo picker; clicking anywhere else in a
// section opens that section's settings in the panel.
var WS_TXT_KEYS=['title','text','tagline','button','name','quote','q','a','from','price','desc','label','sub','success','specialty','role','note','headline'];
function wsAllSections(){var sd=window._wsSiteData;if(!sd)return [];var out=[];(sd.pages||[]).forEach(function(p){(p.sections||[]).forEach(function(s){out.push(s);});});(sd.sections||[]).forEach(function(s){if(out.indexOf(s)<0)out.push(s);});return out;}
function wsFindSec(id){var a=wsAllSections();for(var i=0;i<a.length;i++){if(a[i]&&a[i].id===id)return a[i];}return null;}
function wsSqueeze(s){s=String(s==null?'':s);var o='';for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);if(c!==32&&c!==9&&c!==10&&c!==13&&c!==160)o+=s[i];}return o;}
function wsTextPaths(obj,prefix,out){
  Object.keys(obj||{}).forEach(function(k){var v=obj[k];
    if(typeof v==='string'){if(WS_TXT_KEYS.indexOf(k)>-1&&v.trim())out.push([prefix+k,v]);}
    else if(Array.isArray(v)){v.forEach(function(it,i){if(it&&typeof it==='object')wsTextPaths(it,prefix+k+'.'+i+'.',out);});}
  });
  return out;
}
function wsGetPath(root,path){var p=path.split('.'),o=root;for(var i=0;i<p.length;i++){if(o==null)return undefined;o=o[p[i]];}return o;}
function wsSetPath(root,path,val){var p=path.split('.'),o=root;for(var i=0;i<p.length-1;i++){if(o[p[i]]==null)return false;o=o[p[i]];}o[p[p.length-1]]=val;return true;}
function wsPreviewCss(d){
  if(d.getElementById('_wsBindCss'))return;
  var st=d.createElement('style');st.id='_wsBindCss';
  st.textContent='[data-wsf]{cursor:text;transition:outline-color .12s}'
    +'[data-wsf]:hover{outline:2px dashed rgba(55,193,94,.85);outline-offset:4px;border-radius:2px}'
    +'[data-wsf][contenteditable]{outline:2px solid #37c15e!important;outline-offset:4px;background:rgba(55,193,94,.06)}'
    +'[data-sec]{cursor:default}'
    +'[data-sec].wsb-sel{box-shadow:inset 0 0 0 2px #37c15e}'
    +'[data-slot]{cursor:pointer}'
    +'figure[data-slot]:hover,[data-slot].slot-bg:hover{outline:2px dashed rgba(55,193,94,.85);outline-offset:-4px}'
    +'.wsb-tip{position:fixed;z-index:2147483000;pointer-events:none;background:#111;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:6px 9px;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.3);opacity:0;transition:opacity .12s}'
    +'.wsb-tip.on{opacity:1}';
  d.head.appendChild(st);
}
function wsBindPreview(){
  var sd=window._wsSiteData;var f=document.getElementById('pf');if(!sd||!f)return;
  var d;try{d=f.contentDocument||f.contentWindow.document;}catch(e){return;}
  if(!d||!d.body)return;
  wsPreviewCss(d);
  // Label every editable piece of text with the data path it came from.
  d.querySelectorAll('[data-sec]').forEach(function(el){
    var sec=wsFindSec(el.getAttribute('data-sec'));if(!sec)return;
    var paths=wsTextPaths(sec,'',[]);
    var bz=sd.biz||{};['name','tagline','phone'].forEach(function(k){if(typeof bz[k]==='string'&&bz[k].trim())paths.push(['biz.'+k,bz[k]]);});
    var cands=el.querySelectorAll('h1,h2,h3,h4,h5,p,span,a,button,li,blockquote,strong,em,b,small,div,dt,dd,figcaption,label,td,th,summary,cite');
    paths.forEach(function(pv){
      var key=wsSqueeze(pv[1]);if(!key)return;
      for(var i=0;i<cands.length;i++){
        var c=cands[i];if(c.hasAttribute('data-wsf'))continue;
        if(c.closest('form')&&c.tagName!=='BUTTON'&&c.tagName!=='LABEL'&&!c.closest('.contactf-head'))continue;
        if(wsSqueeze(c.textContent)!==key)continue;
        // deepest match only: skip if a child element carries the whole text
        var deeper=false;for(var j=0;j<c.children.length;j++){if(wsSqueeze(c.children[j].textContent)===key){deeper=true;break;}}
        if(deeper)continue;
        c.setAttribute('data-wsf',pv[0]);c.setAttribute('data-wssec',sec.id);
      }
    });
  });
  if(d._wsBound)return;d._wsBound=true;
  var tip=d.createElement('div');tip.className='wsb-tip';d.body.appendChild(tip);
  d.addEventListener('mousemove',function(ev){
    var t=ev.target;if(!t||!t.closest){tip.classList.remove('on');return;}
    var label=t.closest('[data-wsf]')?'Click to edit text':(t.closest('[data-slot]')?'Click to change photo':'');
    if(!label||t.closest('[contenteditable]')){tip.classList.remove('on');return;}
    tip.textContent=label;tip.style.left=(ev.clientX+14)+'px';tip.style.top=(ev.clientY+16)+'px';tip.classList.add('on');
  });
  d.addEventListener('mouseleave',function(){tip.classList.remove('on');});
  d.addEventListener('click',function(ev){
    if(window._wsEM)return; // the legacy canvas toolbar is active
    var t=ev.target;if(!t||!t.closest)return;
    if(t.closest('[contenteditable]'))return;
    var txt=t.closest('[data-wsf]');
    if(txt){ev.preventDefault();ev.stopPropagation();wsInlineEdit(txt);return;}
    var slot=t.closest('[data-slot]');
    if(slot&&!t.closest('a,button')){ev.preventDefault();ev.stopPropagation();openSlotPicker(slot.getAttribute('data-slot'),'this spot');return;}
    var secEl=t.closest('[data-sec]');
    if(secEl){
      if(t.closest('a'))ev.preventDefault();
      if(t.closest('form'))return;
      wsSelectSection(secEl.getAttribute('data-sec'));
    }
  },true);
  // Follow the preview when the owner clicks through the site's own navigation.
  try{f.contentWindow.addEventListener('hashchange',function(){
    var h=String(f.contentWindow.location.hash||'');var path=h.indexOf('#/')===0?h.slice(2):'';
    var pages=(sd.pages||[]);for(var i=0;i<pages.length;i++){if((pages[i].path||'')===path&&i!==wsActivePageIdx()){window._wsPageIdx=i;wsEdSel=-1;wsOpenEditor();break;}}
  });}catch(e){}
}
function wsSelectSection(id){
  var secs=wsActiveSections()||[];var idx=-1;for(var i=0;i<secs.length;i++){if(secs[i].id===id){idx=i;break;}}
  if(idx<0)return;
  wsEdSel=idx;window.wsPanelTab='edit';
  try{document.querySelector('.studio').classList.remove('panel-off');}catch(e){}
  try{var sb=document.querySelector('.s-body');if(sb&&window.innerWidth<=860)sb.classList.add('mob-chat');}catch(e){}
  wsOpenEditor();
  wsMarkSelected(id);
  setTimeout(function(){try{var c=document.querySelector('#wsEdHost .wse-sec.on');if(c)c.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){}},30);
}
function wsMarkSelected(id){try{var d=wsPfDoc();if(!d)return;d.querySelectorAll('.wsb-sel').forEach(function(x){x.classList.remove('wsb-sel');});if(id){var el=d.querySelector('[data-sec="'+id+'"]');if(el)el.classList.add('wsb-sel');}}catch(e){}}
function wsInlineEdit(el){
  var path=el.getAttribute('data-wsf'),sid=el.getAttribute('data-wssec');
  var isBiz=path.indexOf('biz.')===0;var sec=isBiz?null:wsFindSec(sid);
  if(!isBiz&&!sec)return;
  var root=isBiz?window._wsSiteData:sec;var before=wsGetPath(root,path);
  try{el.contentEditable='plaintext-only';}catch(e){el.contentEditable='true';}
  if(el.contentEditable!=='plaintext-only')el.contentEditable='true';
  el.focus();
  try{var d=el.ownerDocument,r=d.createRange();r.selectNodeContents(el);var s=d.defaultView.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}
  var done=false;
  function finish(save){
    if(done)return;done=true;
    el.removeAttribute('contenteditable');el.removeEventListener('keydown',onKey);
    var val=String(el.innerText||'').trim();
    if(!save||!val||val===String(before).trim()){if(!val||!save){el.textContent=before;}return;}
    wsSetPath(root,path,val);
    if(isBiz){wsRerender();}
    else{
      // The preview already shows the new text; just bring the saved HTML and history up to date.
      try{gHTML=window.WS.renderSite(window._wsSiteData,{mode:'live',activePath:wsActivePath()});localStorage.setItem('wsh',gHTML);}catch(e){}
      wsPersistSiteData();pushUndo(gHTML);if(typeof bumpEditCount==='function')bumpEditCount();
    }
    try{var on=document.querySelector('#wsEdHost .wse-sec.on');if(on)wsOpenEditor();}catch(e){}
  }
  function onKey(ev){
    if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();el.blur();}
    else if(ev.key==='Escape'){ev.preventDefault();finish(false);el.blur();}
  }
  el.addEventListener('keydown',onKey);
  el.addEventListener('blur',function(){finish(true);},{once:true});
}
function wsShuffleLook(){
  var sd=window._wsSiteData;if(!sd||!window.WS)return;
  var pals=window.WS.palettes.map(function(p){return p.id;}).filter(function(id){return /^[wb]_/.test(id)&&id!==sd.palette;});
  var tts=Object.keys(window.WS.typeThemes||{}).filter(function(id){return id!==sd.typeset;});
  if(pals.length)sd.palette=pals[Math.floor(Math.random()*pals.length)];
  if(tts.length&&Math.random()<0.6)sd.typeset=tts[Math.floor(Math.random()*tts.length)];
  var cs=['','sharp','soft','round'];sd.corners=cs[Math.floor(Math.random()*cs.length)];
  delete sd.accent;
  wsRerender();wsOpenEditor();
  try{toast('New look applied. Not keen? Undo brings it back.',3200);}catch(e){}
}
// ---- Stock photo search in the photo picker ----
function wsPhotoSearch(q){
  var grid=document.getElementById('slotSearchGrid'),note=document.getElementById('slotSearchNote');if(!grid)return;
  q=String(q||'').trim();if(!q)return;
  grid.innerHTML='';if(note)note.textContent='Searching...';
  fetch('/api/photos?q='+encodeURIComponent(q)).then(function(r){return r.json();}).then(function(j){
    var res=(j&&j.results)||[];
    if(!res.length){if(note)note.textContent=(j&&j.error)||'No photos found. Try a simpler word.';return;}
    if(note)note.textContent='Free photos from Unsplash. The photographer is credited in your site footer.';
    res.forEach(function(p){
      var b=document.createElement('button');b.type='button';b.title=(p.alt||'Photo')+' by '+p.name;b.setAttribute('aria-label',(p.alt||'Photo')+', by '+p.name);
      var im=document.createElement('img');im.src=p.thumb;im.alt='';im.loading='lazy';b.appendChild(im);
      var cr=document.createElement('span');cr.textContent=p.name;b.appendChild(cr);
      b.addEventListener('click',function(){
        var key=currentSlotId;
        try{var sd=window._wsSiteData;if(sd&&key){sd.photoCredits=sd.photoCredits||{};sd.photoCredits[key]={name:p.name,link:p.link};}}catch(e){}
        try{if(p.download)fetch('/api/photos/use',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({download:p.download})});}catch(e){}
        fillSlot(p.url);
      });
      grid.appendChild(b);
    });
  }).catch(function(){if(note)note.textContent='Photo search is unavailable right now.';});
}
(function(){
  function wire(){
    var inp=document.getElementById('slotSearch'),btn=document.getElementById('slotSearchBtn');if(!inp||!btn)return;
    btn.addEventListener('click',function(){wsPhotoSearch(inp.value);});
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();wsPhotoSearch(inp.value);}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
// ---- Logo upload (Design tab) ----
function wsLogoFile(file,done){
  if(!file||!/^image[/]/.test(file.type))return;
  var rd=new FileReader();rd.onload=function(){
    if(file.type==='image/svg+xml'){done(rd.result);return;}
    var im=new Image();im.onload=function(){
      var h=Math.min(160,im.height),w=Math.round(im.width*(h/im.height));if(w>640){w=640;h=Math.round(im.height*(w/im.width));}
      var c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);
      done(c.toDataURL('image/png'));
    };im.src=rd.result;
  };rd.readAsDataURL(file);
}
function wsRenderLogo(pad){
  var sd=window._wsSiteData;
  pad.appendChild(wseEl('div','wse-label','Logo'));
  var row=wseEl('div','wse-logo');
  var prev=wseEl('div','wse-logo-prev');if(sd.biz&&sd.biz.logo)prev.style.backgroundImage='url("'+sd.biz.logo+'")';
  var fi=document.createElement('input');fi.type='file';fi.accept='image/png,image/jpeg,image/webp,image/svg+xml';fi.style.display='none';
  var up=wseEl('button','wse-link go',sd.biz&&sd.biz.logo?'Replace':'Upload logo');up.type='button';up.addEventListener('click',function(){fi.click();});
  fi.addEventListener('change',function(){wsLogoFile(fi.files[0],function(url){sd.biz.logo=url;wsRerender();wsOpenEditor();});});
  row.appendChild(prev);row.appendChild(up);row.appendChild(fi);
  if(sd.biz&&sd.biz.logo){var rm=wseEl('button','wse-link danger','Remove');rm.type='button';rm.addEventListener('click',function(){delete sd.biz.logo;wsRerender();wsOpenEditor();});row.appendChild(rm);}
  pad.appendChild(row);
  pad.appendChild(wseEl('div','wse-hint','PNG with a transparent background looks best. It replaces your name in the header.'));
}
// ---- Version history (Site tab) ----
function wsAgo(ts){var s=Math.max(0,(Date.now()-ts)/1000);if(s<90)return 'just now';var m=Math.round(s/60);if(m<60)return m+' min ago';var h=Math.round(m/60);if(h<24)return h+' hour'+(h>1?'s':'')+' ago';var d=new Date(ts);return d.toLocaleDateString(undefined,{month:'short',day:'numeric'})+', '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});}
function wsRenderVersions(pad){
  var sid=window._wsSite||localStorage.getItem('ws_site')||'',key=window._wsKey||localStorage.getItem('ws_key')||'';
  pad.appendChild(wseEl('div','wse-label','Version history'));
  var box=wseEl('div','wse-card');pad.appendChild(box);
  if(!sid||!key){box.appendChild(wseEl('div','wse-hint','Versions appear once your site has been saved.'));return;}
  box.appendChild(wseEl('div','wse-hint','Loading...'));
  fetch('/versions?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(key)).then(function(r){return r.json();}).then(function(j){
    box.innerHTML='';var vs=(j&&j.versions)||[];
    if(!vs.length){box.appendChild(wseEl('div','wse-hint','No saved versions yet. A snapshot is kept every 10 minutes while you edit.'));return;}
    box.appendChild(wseEl('div','wse-hint','A snapshot is kept every 10 minutes while you edit, for 60 days.'));
    vs.slice(0,12).forEach(function(v,i){
      var row=wseEl('div','wse-ver');
      row.appendChild(wseEl('span',null,(i===0?'Latest: ':'')+wsAgo(v.ts)+(v.label?' ('+v.label+')':'')));
      var b=wseEl('button','wse-link go','Restore');b.type='button';
      b.addEventListener('click',function(){wsRestoreVersion(sid,key,v.ts,b);});
      row.appendChild(b);box.appendChild(row);
    });
  }).catch(function(){box.innerHTML='';box.appendChild(wseEl('div','wse-hint','Could not load versions.'));});
}
function wsRestoreVersion(sid,key,ts,btn){
  var go=function(){
    if(btn)btn.textContent='Restoring...';
    // Keep the current state as its own version first, so a restore is never a one-way door.
    try{if(gHTML&&gHTML.length>100)fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:sid,key:key,html:gHTML,name:(document.getElementById('stitle')||{}).textContent||'My site',site:window._wsSiteData||undefined,snapshot:true,label:'Before restore'})});}catch(e){}
    fetch('/versions?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(key)+'&ts='+ts).then(function(r){return r.json();}).then(function(v){
      if(!v||!v.html){if(btn)btn.textContent='Restore';try{toast((v&&v.error)||'That version could not be loaded');}catch(e){}return;}
      try{if(v.site&&v.site.sections){window._wsSiteData=v.site;wsPersistSiteData();}}catch(e){}
      gHTML=v.html;try{localStorage.setItem('wsh',gHTML);}catch(e){}
      if(window._wsSiteData&&window.WS){wsRerender();}else{setPreview(gHTML);pushUndo(gHTML);}
      try{wsOpenEditor();}catch(e){}
      try{toast('Version restored. Undo takes you back.',3200);}catch(e){}
    }).catch(function(){if(btn)btn.textContent='Restore';});
  };
  if(window.wsConfirm)window.wsConfirm({title:'Restore this version?',message:'Your site will go back to how it looked '+wsAgo(ts)+'. You can undo this.',okLabel:'Restore',cancelLabel:'Cancel'}).then(function(ok){if(ok)go();});
  else if(confirm('Restore this version?'))go();
}
// ---- Business info (Site tab): the details every page uses ----
var WS_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function wsBizField(box,label,key,ph,type){
  var sd=window._wsSiteData,b=sd.biz=sd.biz||{};
  var w=wseEl('div','wse-ctl');w.appendChild(wseEl('div','wse-ctl-label',label));
  var i=document.createElement('input');i.className='wse-field';i.type=type||'text';i.placeholder=ph||'';i.value=b[key]||'';i.setAttribute('aria-label',label);
  var tm;i.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){var v=i.value.trim();if(v)b[key]=v;else delete b[key];wsRerender();},450);});
  w.appendChild(i);box.appendChild(w);return i;
}
function wsRenderBizInfo(pad,open){
  var sd=window._wsSiteData;var b=sd.biz=sd.biz||{};
  var det=document.createElement('details');det.className='wse-det';det.id='wseBizInfo';if(open)det.open=true;
  var sm=document.createElement('summary');sm.textContent='Business info';det.appendChild(sm);
  var box=wseEl('div','wse-detb');
  box.appendChild(wseEl('div','wse-hint','Used everywhere on your site: header, footer, contact page, buttons and search results.'));
  wsBizField(box,'Business name','name','Your business name');
  wsBizField(box,'Tagline','tagline','One short line about you');
  wsBizField(box,'Phone','phone','(555) 123-4567','tel');
  wsBizField(box,'Email','email','hello@yourbusiness.com','email');
  wsBizField(box,'Street address','address','123 Main St, Your City');
  wsBizField(box,'City or service area','city','e.g. Austin');
  wsBizField(box,'Instagram handle','instagram','yourbusiness');
  wsBizField(box,'Online booking link (optional)','bookingUrl','https://...','url');
  // Google Business Profile: link it once to show the live rating and reviews.
  var gw=wseEl('div','wse-ctl');gw.appendChild(wseEl('div','wse-ctl-label','Google Business Profile'));
  if(b.googlePlaceId){
    var lk=wseEl('div','wse-hint','Linked: '+(b.googleName||'your Google listing'));gw.appendChild(lk);
    var hasG=wsAllSections().some(function(s){return s.type==='reviews'&&s.variant==='google';});
    if(!hasG){var add=wseEl('button','wse-btn wse-wide','Show my Google reviews');add.type='button';add.style.marginTop='8px';add.addEventListener('click',function(){
      var home=(sd.pages&&sd.pages[0])?sd.pages[0].sections:sd.sections;var at=home.length;for(var k=0;k<home.length;k++){if(home[k].type==='cta'){at=k;break;}}
      var rv=home.find(function(s){return s.type==='reviews';});
      if(rv){rv.variant='google';}else{home.splice(at,0,Object.assign({id:'reviews-'+window.WS.uid(),type:'reviews'},window.WS.sections.reviews.create(sd),{variant:'google',title:'What people say'}));}
      wsRerender();wsOpenEditor();try{toast('Google reviews added to your home page',3000);}catch(e){}
    });gw.appendChild(add);}
    var ul=wseEl('button','wse-link danger','Unlink');ul.type='button';ul.style.marginTop='8px';ul.addEventListener('click',function(){delete b.googlePlaceId;delete b.googleName;wsRerender();wsOpenEditor();var d2=document.getElementById('wseBizInfo');if(d2)d2.open=true;});gw.appendChild(ul);
  } else {
    var gr=wseEl('div','wse-row');var gq=document.createElement('input');gq.className='wse-field';gq.placeholder='Business name and city';gq.value=[b.name||'',b.city||''].filter(Boolean).join(' ');gq.setAttribute('aria-label','Find your business on Google');
    var gb=wseEl('button','wse-btn','Find');gb.type='button';gr.appendChild(gq);gr.appendChild(gb);gw.appendChild(gr);
    var gl=wseEl('div','wse-glist');gw.appendChild(gl);
    gw.appendChild(wseEl('div','wse-hint','Shows your live Google rating and recent reviews on your site.'));
    var find=function(){gl.innerHTML='';gl.appendChild(wseEl('div','wse-hint','Searching Google...'));
      fetch('/api/place/find?q='+encodeURIComponent(gq.value)).then(function(r){return r.json();}).then(function(j){gl.innerHTML='';
        var res=(j&&j.results)||[];if(!res.length){gl.appendChild(wseEl('div','wse-hint',(j&&j.error)||'No match. Try the exact name on your Google listing.'));return;}
        res.forEach(function(p){var o=wseEl('button','wse-gopt');o.type='button';o.appendChild(wseEl('b',null,p.name));o.appendChild(wseEl('span',null,p.address+(p.rating?' · '+p.rating+' stars ('+p.count+')':'')));
          o.addEventListener('click',function(){b.googlePlaceId=p.id;b.googleName=p.name;wsRerender();wsOpenEditor();var d2=document.getElementById('wseBizInfo');if(d2)d2.open=true;});gl.appendChild(o);});
      }).catch(function(){gl.innerHTML='';gl.appendChild(wseEl('div','wse-hint','Google lookup is unavailable right now.'));});};
    gb.addEventListener('click',find);gq.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();find();}});
  }
  box.appendChild(gw);
  // Hours
  var hw=wseEl('div','wse-ctl');hw.appendChild(wseEl('div','wse-ctl-label','Opening hours'));
  var hours=(Array.isArray(b.hours)&&b.hours.length===7)?b.hours:WS_DAYS.map(function(d){var h=(b.hours||[]).find(function(x){return x&&x.d===d;});return h||{d:d};});
  var save=function(){b.hours=hours;wsRerender();};
  var tbl=wseEl('div','wse-hours');
  hours.forEach(function(h,ix){
    var row=wseEl('div','wse-hrow');row.appendChild(wseEl('span','wse-hday',h.d));
    var o=document.createElement('input');o.type='time';o.className='wse-field';o.value=h.open||'';o.setAttribute('aria-label',h.d+' opens');
    var c=document.createElement('input');c.type='time';c.className='wse-field';c.value=h.close||'';c.setAttribute('aria-label',h.d+' closes');
    var cl=document.createElement('label');cl.className='wse-hclosed';var cb=document.createElement('input');cb.type='checkbox';cb.checked=!h.open;cl.appendChild(cb);cl.appendChild(document.createTextNode(' Closed'));
    var sync=function(){o.disabled=c.disabled=cb.checked;};sync();
    cb.addEventListener('change',function(){if(cb.checked){delete h.open;delete h.close;}else{h.open=o.value||'09:00';h.close=c.value||'17:00';o.value=h.open;c.value=h.close;}sync();save();});
    o.addEventListener('change',function(){if(o.value){h.open=o.value;if(!h.close){h.close='17:00';c.value=h.close;}}save();});
    c.addEventListener('change',function(){if(c.value){h.close=c.value;if(!h.open){h.open='09:00';o.value=h.open;}}save();});
    row.appendChild(o);row.appendChild(c);row.appendChild(cl);tbl.appendChild(row);
  });
  hw.appendChild(tbl);
  var cp=wseEl('button','wse-link go','Copy Monday to Tuesday-Friday');cp.type='button';
  cp.addEventListener('click',function(){var m=hours[0];for(var k=1;k<5;k++){if(m.open){hours[k].open=m.open;hours[k].close=m.close;}else{delete hours[k].open;delete hours[k].close;}}save();wsOpenEditor();var d2=document.getElementById('wseBizInfo');if(d2)d2.open=true;});
  hw.appendChild(cp);
  if(hours.some(function(h){return h.open;})){var ch=wseEl('button','wse-link danger','Clear hours');ch.type='button';ch.style.marginLeft='14px';ch.addEventListener('click',function(){delete b.hours;wsRerender();wsOpenEditor();var d2=document.getElementById('wseBizInfo');if(d2)d2.open=true;});hw.appendChild(ch);}
  box.appendChild(hw);
  det.appendChild(box);pad.appendChild(det);
}
// ---- Launch checklist + search readiness (Site tab) ----
function wsSiteChecks(){
  var sd=window._wsSiteData||{},b=sd.biz||{},secs=wsAllSections();
  var hero=secs.find(function(s){return s.type==='hero';});
  var photos=sd.photos||{};
  var txt='';try{var d=wsPfDoc();txt=(d&&d.body&&d.body.innerText)||'';}catch(e){}
  var words=txt.split(' ').filter(function(w){return w.length>1;}).length;
  var slug=window._wsSlug||'';try{slug=slug||localStorage.getItem('ws_slug_'+(window._wsSite||localStorage.getItem('ws_site')||''))||'';}catch(e){}
  var desc=b.seoDescription||b.tagline||'';
  var openBiz=function(){window.wsPanelTab='site';wsOpenEditor();var d2=document.getElementById('wseBizInfo');if(d2){d2.open=true;d2.scrollIntoView({block:'start',behavior:'smooth'});}};
  return [
    {id:'name',label:'Your business name',ok:!!(b.name&&b.name!=='Your Business'),pts:10,fix:openBiz},
    {id:'contact',label:'A phone number or email',ok:!!(b.phone||b.email),pts:15,fix:openBiz},
    {id:'where',label:'Where you are (address or city)',ok:!!(b.address||b.city),pts:15,fix:openBiz},
    {id:'hours',label:'Opening hours',ok:(b.hours||[]).some(function(h){return h&&h.open;}),pts:10,fix:openBiz,optional:true},
    {id:'photo',label:'A photo at the top of your home page',ok:!!(hero&&photos[hero.id+'.photo']),pts:10,fix:function(){if(hero){window.wsPanelTab='edit';window._wsPageIdx=0;wsGotoPreviewPage('');openSlotPicker(hero.id+'.photo','your home page');}}},
    {id:'seo',label:'A search description (50-160 characters)',ok:desc.length>=50&&desc.length<=160,pts:15,fix:function(){var s=document.getElementById('seoBtn');if(s)s.click();}},
    {id:'words',label:'Enough words on your home page (300+)',ok:words>=300,pts:10,fix:null,info:words+' words now. Add detail to your services and About page.'},
    {id:'live',label:'Published online',ok:!!slug,pts:15,fix:function(){var p=document.getElementById('publishBtn')||document.getElementById('getSiteBtn');if(p)p.click();}},
  ];
}
function wsRenderChecklist(pad){
  var checks=wsSiteChecks();var score=0,max=0;checks.forEach(function(c){max+=c.pts;if(c.ok)score+=c.pts;});
  var pct=Math.round(score*100/max);
  var done=checks.filter(function(c){return c.ok;}).length;
  pad.appendChild(wseEl('div','wse-label','Launch checklist'));
  var box=wseEl('div','wse-card');
  var head=wseEl('div','wse-score');
  var ring=wseEl('div','wse-ring');ring.style.setProperty('--p',pct);ring.appendChild(wseEl('b',null,String(pct)));head.appendChild(ring);
  var ht=wseEl('div');ht.appendChild(wseEl('div','wse-score-t',pct>=85?'Ready to grow':(pct>=60?'Almost there':'A few things to add')));ht.appendChild(wseEl('div','wse-hint',done+' of '+checks.length+' done. Search readiness '+pct+'/100.'));head.appendChild(ht);
  box.appendChild(head);
  checks.forEach(function(c){
    var row=wseEl('div','wse-chk'+(c.ok?' ok':''));
    row.appendChild(wseEl('span','wse-chk-i',c.ok?'✓':''));
    var lab=wseEl('div','wse-chk-l',c.label+(c.optional&&!c.ok?' (if you have them)':''));if(c.info&&!c.ok)lab.appendChild(wseEl('div','wse-hint',c.info));row.appendChild(lab);
    if(!c.ok&&c.fix){var f=wseEl('button','wse-link go','Fix');f.type='button';f.addEventListener('click',c.fix);row.appendChild(f);}
    box.appendChild(row);
  });
  pad.appendChild(box);
}
function wsRenderDesign(pad){
  var sd=window._wsSiteData;
  var top=wseEl('div','wse-row');
  var sh=wseEl('button','wse-btn wse-wide','Shuffle the look');sh.type='button';sh.title='Try a new color, type and corner style. Your words and photos stay.';
  sh.addEventListener('click',wsShuffleLook);top.appendChild(sh);pad.appendChild(top);
  var groups=[['Light',function(p){return /^w_/.test(p.id);}],['Dark',function(p){return /^b_/.test(p.id);}]];
  var cur=window.WS.palette?window.WS.palette(sd.palette):null;
  if(cur&&!/^[wb]_/.test(cur.id))groups.push(['Current',function(p){return p.id===cur.id;}]);
  groups.forEach(function(g){
    pad.appendChild(wseEl('div','wse-label',g[0]+' themes'));
    var row=wseEl('div','wse-pals');
    window.WS.palettes.filter(g[1]).forEach(function(p){
      var on=sd.palette===p.id;var sw=wseEl('button','wse-sw'+(on?' on':''));sw.type='button';
      sw.style.background='linear-gradient(135deg,'+p.base+' 50%,'+p.accent+' 50%)';sw.title=p.name||p.id;sw.setAttribute('aria-label',(p.name||p.id)+' theme');
      sw.addEventListener('click',function(){sd.palette=p.id;wsRerender();wsOpenEditor();});
      row.appendChild(sw);
    });
    pad.appendChild(row);
  });
  wsRenderLogo(pad);
  pad.appendChild(wseEl('div','wse-label','Brand color'));
  var bc=wseEl('div','wse-row');
  var ci=document.createElement('input');ci.type='color';ci.className='wse-color';ci.setAttribute('aria-label','Brand color');
  ci.value=(/^#[0-9a-fA-F]{6}$/.test(sd.accent||'')?sd.accent:((cur&&cur.accent)||'#37c15e')).toLowerCase();
  var ct;ci.addEventListener('input',function(){sd.accent=ci.value;clearTimeout(ct);ct=setTimeout(wsRerender,120);});
  bc.appendChild(ci);
  var bcl=wseEl('div','wse-hint',sd.accent?'Your color is used for buttons and highlights.':'Using the theme color. Pick your own to match your logo.');bc.appendChild(bcl);
  if(sd.accent){var rs=wseEl('button','wse-link','Reset');rs.type='button';rs.addEventListener('click',function(){delete sd.accent;wsRerender();wsOpenEditor();});bc.appendChild(rs);}
  pad.appendChild(bc);
  pad.appendChild(wseEl('div','wse-label','Fonts'));
  var tsSel=wseEl('select','wse-field');tsSel.setAttribute('aria-label','Fonts');
  [['bold','Bold condensed'],['editorial','Editorial serif'],['clean','Clean sans']].forEach(function(o){var op=wseEl('option',null,o[1]);op.value=o[0];if((sd.typeset||'bold')===o[0])op.selected=true;tsSel.appendChild(op);});
  tsSel.addEventListener('change',function(){sd.typeset=tsSel.value;wsRerender();});
  pad.appendChild(tsSel);
  pad.appendChild(wseEl('div','wse-label','Corners'));
  var seg=wseEl('div','wse-seg');
  [['','Theme'],['sharp','Sharp'],['soft','Soft'],['round','Round']].forEach(function(o){
    var b=wseEl('button','wse-segb'+(((sd.corners||'')===o[0])?' on':''),o[1]);b.type='button';
    b.addEventListener('click',function(){if(o[0])sd.corners=o[0];else delete sd.corners;wsRerender();wsOpenEditor();});seg.appendChild(b);
  });
  pad.appendChild(seg);
  pad.appendChild(wseEl('div','wse-label','Icons'));
  var esSel=wseEl('select','wse-field');esSel.setAttribute('aria-label','Icon style');
  [['color','Full color'],['soft','Soft'],['mono','Monochrome'],['badge','Badge']].forEach(function(o){var op=wseEl('option',null,o[1]);op.value=o[0];if((sd.emojiStyle||'color')===o[0])op.selected=true;esSel.appendChild(op);});
  esSel.addEventListener('change',function(){sd.emojiStyle=esSel.value;wsRerender();});
  pad.appendChild(esSel);
}
function wsHasShop(){return wsAllSections().some(function(s){return s&&s.type==='products'&&(s.items||[]).length;});}
// Site tab: whether visitors can pay online, and the one next step to get there.
function wsRenderPayments(pad){
  if(!wsHasShop())return;
  pad.appendChild(wseEl('div','wse-label','Online payments'));
  var box=wseEl('div','wse-card');box.appendChild(wseEl('div','wse-hint','Checking your payment setup...'));pad.appendChild(box);
  var now=Date.now();
  var got=function(me){
    box.innerHTML='';
    var line=function(txt){box.appendChild(wseEl('div','wse-hint',txt));};
    var act=function(label,fn){var b=wseEl('button','wse-btn wse-wide',label);b.type='button';b.style.marginTop='10px';b.addEventListener('click',fn);box.appendChild(b);};
    if(!me||!me.auth){line('Sign in so customers can pay you online. Until then, the cart asks visitors to contact you to order.');act('Sign in',function(){var a=document.getElementById('acctBtn');if(a)a.click();});return;}
    if(me.owner||(me.pro&&me.connectReady)){box.appendChild(wseEl('div','wse-ok','Payments are on'));line('Visitors check out securely with Stripe on your published site. Money goes to your Stripe account (Websprout keeps a 2% fee).');return;}
    if(!me.pro){line('Online checkout comes with Pro. Until then, the cart asks visitors to contact you to order.');act('Go Pro',function(){var u=document.getElementById('unlockBtn');if(u)u.click();});return;}
    line(me.connectStarted?'Finish setting up your Stripe account so payments can go through.':'Connect a Stripe account to get paid. It takes a few minutes.');
    act(me.connectStarted?'Finish Stripe setup':'Connect Stripe',function(){location.href='/connect/start';});
  };
  if(window._wsMeCache&&now-window._wsMeCache.t<30000){got(window._wsMeCache.me);return;}
  fetch('/me',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(me){window._wsMeCache={t:Date.now(),me:me};got(me);}).catch(function(){got(null);});
}
function wsSlotKeysFor(sec){var out=[];try{var d=wsPfDoc();if(!d)return out;var el=d.querySelector('[data-sec="'+sec.id+'"]');if(!el)return out;el.querySelectorAll('[data-slot]').forEach(function(s){var k=s.getAttribute('data-slot');if(k&&out.indexOf(k)<0)out.push(k);});}catch(e){}return out;}
function wsOpenEditor(){
  if(!window.WS||!window.WS.palettes||!window._wsSiteData)return;
  try{document.body.classList.add('ws-v3');}catch(e){}
  var tab=window.wsPanelTab||'edit';
  wsEditorCss();
  var host=document.getElementById('wsEdHost');var inline=!!host;var dr,pad;
  if(inline){host.innerHTML='';pad=wseEl('div','wse');pad.style.cssText='padding:2px 2px 20px';host.appendChild(pad);}
  else{var old=document.getElementById('wsEd');if(old)old.parentNode.removeChild(old);dr=wseEl('div','wse');dr.id='wsEd';dr.style.cssText='position:fixed;right:0;top:0;bottom:0;width:min(400px,100vw);z-index:99999;background:#131417;overflow-y:auto;-webkit-overflow-scrolling:touch;box-shadow:-12px 0 48px rgba(0,0,0,.5)';pad=wseEl('div',null);pad.style.cssText='padding:18px 18px 44px';dr.appendChild(pad);}
  if(!inline){
    var head=wseEl('div','wse-head');
    head.appendChild(wseEl('div','wse-title','Editor'));
    var cls=wseEl('button','wse-ico','×');cls.addEventListener('click',function(){dr.style.display='none';var t=document.getElementById('wsEdToggle');if(t)t.style.display='block';});head.appendChild(cls);
    pad.appendChild(head);
  }
  var tabs=wseEl('div','wse-ptabs');tabs.setAttribute('role','tablist');
  [['edit','Edit'],['design','Design'],['site','Site']].forEach(function(t){
    var b=wseEl('button','wse-ptab'+(tab===t[0]?' on':''),t[1]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',tab===t[0]?'true':'false');
    b.addEventListener('click',function(){window.wsPanelTab=t[0];wsOpenEditor();});tabs.appendChild(b);
  });
  pad.appendChild(tabs);
  if(tab==='site'){wsRenderChecklist(pad);wsRenderBizInfo(pad,!!window._wsOpenBiz);window._wsOpenBiz=false;wsRenderPayments(pad);wsRenderVersions(pad);wsRenderManage(pad);}
  if(tab==='design'){wsRenderDesign(pad);}
  if(false){
  pad.appendChild(wseEl('div','wse-label','Theme'));
  var palRow=wseEl('div','wse-pals');
  window.WS.palettes.forEach(function(p){
    var sel=window._wsSiteData.palette===p.id;
    var sw=wseEl('button','wse-sw'+(sel?' on':''));sw.style.background='linear-gradient(135deg,'+p.base+' 50%,'+p.accent+' 50%)';
    sw.title=p.name||p.id;sw.addEventListener('click',function(){window._wsSiteData.palette=p.id;wsRerender();wsOpenEditor();});
    palRow.appendChild(sw);
  });
  pad.appendChild(palRow);
  var esSel=wseEl('select','wse-field');esSel.style.marginTop='12px';
  [['color','Emoji: full color'],['soft','Emoji: soft'],['mono','Emoji: monochrome'],['badge','Emoji: badge']].forEach(function(o){var op=wseEl('option',null,o[1]);op.value=o[0];if((window._wsSiteData.emojiStyle||'color')===o[0])op.selected=true;esSel.appendChild(op);});
  esSel.addEventListener('change',function(){window._wsSiteData.emojiStyle=esSel.value;wsRerender();});
  pad.appendChild(esSel);
  // Type style: swap the whole font system (bold condensed / editorial serif / clean sans).
  var tsSel=wseEl('select','wse-field');tsSel.style.marginTop='9px';
  [['bold','Type: Bold condensed'],['editorial','Type: Editorial serif'],['clean','Type: Clean sans']].forEach(function(o){var op=wseEl('option',null,o[1]);op.value=o[0];if((window._wsSiteData.typeset||'bold')===o[0])op.selected=true;tsSel.appendChild(op);});
  tsSel.addEventListener('change',function(){window._wsSiteData.typeset=tsSel.value;wsRerender();});
  pad.appendChild(tsSel);
  }
  if(tab==='edit'){
  pad.appendChild(wseEl('div','wse-hint wse-tip','Tip: click any text in the preview to edit it, or click a photo to change it.'));
  // Pages (multi-page site): tabs to switch which page you're editing, plus add / rename / delete.
  if(wsIsMulti()){
    pad.appendChild(wseEl('div','wse-label','Pages'));
    var pgRow=wseEl('div','wse-tabs');
    window._wsSiteData.pages.forEach(function(pg,pi){
      var on=pi===wsActivePageIdx();
      var tb=wseEl('button','wse-tab'+(on?' on':''),(pg.title||(pg.path||'Home')));
      tb.addEventListener('click',function(){window._wsPageIdx=pi;wsEdSel=-1;wsGotoPreviewPage(pg.path||'');wsOpenEditor();});
      pgRow.appendChild(tb);
    });
    var addP=wseEl('button','wse-tab add','+ Page');
    addP.addEventListener('click',function(){wsAddPagePicker(addP);});
    pgRow.appendChild(addP);
    pad.appendChild(pgRow);
    var ap=window._wsSiteData.pages[wsActivePageIdx()];
    if(ap){
      var tools=wseEl('div','wse-tools');
      var ren=wseEl('button','wse-link','Rename');
      ren.addEventListener('click',function(){var nt=prompt('Page name:',ap.title||'');if(nt==null)return;ap.title=nt.slice(0,40)||ap.title;if((ap.path||'')!==''){var _np=(nt.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''))||ap.path,_base=_np,_n=2;while(window._wsSiteData.pages.some(function(p){return p!==ap&&p.path===_np;})){_np=_base+'-'+(_n++);}ap.path=_np;}wsRerender();wsOpenEditor();});
      tools.appendChild(ren);
      var _pi=wsActivePageIdx(),_pgs=window._wsSiteData.pages;
      var mvPage=function(dir){var j=_pi+dir;if(j<1||j>=_pgs.length)return;var t=_pgs[j];_pgs[j]=_pgs[_pi];_pgs[_pi]=t;window._wsPageIdx=j;wsRerender();wsOpenEditor();};
      if(_pi>1){var ml=wseEl('button','wse-link','◀ Move');ml.addEventListener('click',function(){mvPage(-1);});tools.appendChild(ml);}
      if(_pi>=1&&_pi<_pgs.length-1){var mr=wseEl('button','wse-link','Move ▶');mr.addEventListener('click',function(){mvPage(1);});tools.appendChild(mr);}
      if((ap.path||'')!==''){
        var delp=wseEl('button','wse-link danger','Delete page');
        delp.addEventListener('click',function(){if(!confirm('Delete the "'+(ap.title||'this')+'" page?'))return;window._wsSiteData.pages.splice(wsActivePageIdx(),1);window._wsPageIdx=0;wsEdSel=-1;wsRerender();wsOpenEditor();});
        tools.appendChild(delp);
      }
      pad.appendChild(tools);
    }
  }
  // Sections
  pad.appendChild(wseEl('div','wse-label',wsIsMulti()?'Sections on this page':'Sections'));
  var secs=wsActiveSections();
  secs.forEach(function(sec,i){
    var row=wseEl('div','wse-sec'+(i===wsEdSel?' on':''));
    var bar=wseEl('div','wse-bar');
    var def=window.WS.sections[sec.type]||{};
    var nm=wseEl('button','wse-name');nm.appendChild(wseEl('span','dot'));nm.appendChild(document.createTextNode(def.label||sec.type));
    nm.addEventListener('click',function(){wsEdSel=(wsEdSel===i?-1:i);wsOpenEditor();if(wsEdSel===i){try{var d=wsPfDoc();var el=d&&d.querySelector('[data-sec="'+sec.id+'"]');if(el){var wrap=document.getElementById('previewWrap');var f=document.getElementById('pf');if(wrap&&f){wrap.scrollTo({top:Math.max(0,el.getBoundingClientRect().top-40),behavior:'smooth'});}}}catch(e){}}});
    bar.appendChild(nm);
    var up=wseEl('button','wse-ico','↑');up.title='Move up';
    up.addEventListener('click',function(){if(i>0){var t=secs[i-1];secs[i-1]=secs[i];secs[i]=t;if(wsEdSel===i)wsEdSel=i-1;wsRerender();wsOpenEditor();}});
    var dn=wseEl('button','wse-ico','↓');dn.title='Move down';
    dn.addEventListener('click',function(){if(i<secs.length-1){var t=secs[i+1];secs[i+1]=secs[i];secs[i]=t;if(wsEdSel===i)wsEdSel=i+1;wsRerender();wsOpenEditor();}});
    var cp=wseEl('button','wse-ico','⧉');cp.title='Duplicate';
    cp.addEventListener('click',function(){try{var clone=JSON.parse(JSON.stringify(secs[i]));var oldId=clone.id;var newId=sec.type+'-'+window.WS.uid();clone.id=newId;var ph=window._wsSiteData.photos||{};Object.keys(ph).forEach(function(k){if(k.indexOf(oldId+'.')===0)ph[newId+k.slice(oldId.length)]=ph[k];});secs.splice(i+1,0,clone);wsEdSel=i+1;wsRerender();wsOpenEditor();}catch(e){}});
    var dl=wseEl('button','wse-ico danger','×');dl.title='Delete';
    dl.addEventListener('click',function(){secs.splice(i,1);if(wsEdSel>=secs.length)wsEdSel=secs.length-1;wsRerender();wsOpenEditor();});
    bar.appendChild(up);bar.appendChild(dn);bar.appendChild(cp);bar.appendChild(dl);row.appendChild(bar);
    if(i===wsEdSel){
      var body=wseEl('div','wse-body');
      var _vd=window.WS.sections[sec.type];
      if(_vd&&_vd.variants&&Object.keys(_vd.variants).length>1){
        body.appendChild(wsControl(sec,{key:'variant',label:'Layout',type:'select',options:Object.keys(_vd.variants).map(function(k){return [k,_vd.variants[k]];})}));
      }
      wsFieldDefs(sec.type).forEach(function(f){if(f.only&&f.only.indexOf(sec.variant)<0)return;body.appendChild(wsControl(sec,f));});
      var _slots=wsSlotKeysFor(sec);
      if(_slots.length){
        var pc=wseEl('div','wse-ctl');pc.appendChild(wseEl('div','wse-ctl-label',_slots.length>1?'Photos':'Photo'));
        var pr=wseEl('div','wse-photos');
        _slots.forEach(function(k,ki){var has=!!((window._wsSiteData.photos||{})[k]);var pb=wseEl('button','wse-photo'+(has?' has':''));pb.type='button';
          if(has){pb.style.backgroundImage='url("'+window._wsSiteData.photos[k]+'")';}else{pb.textContent='+ Add';}
          pb.title=has?'Change photo':'Add a photo';pb.addEventListener('click',function(){openSlotPicker(k,_slots.length>1?('photo '+(ki+1)):'this section');});pr.appendChild(pb);
          if(has){var rm=wseEl('button','wse-link danger','Remove');rm.type='button';rm.addEventListener('click',function(){delete window._wsSiteData.photos[k];wsRerender();wsOpenEditor();});pr.appendChild(rm);}
        });
        pc.appendChild(pr);body.appendChild(pc);
      }
      row.appendChild(body);
    }
    pad.appendChild(row);
  });
  // Add section
  var addRow=wseEl('div','wse-add');
  var addSel=wseEl('select','wse-field');
  var _ord=window.WS.sectionOrder||[];
  Object.keys(window.WS.sections).sort(function(a,b){var oa=_ord.indexOf(a),ob=_ord.indexOf(b);return (oa<0?99:oa)-(ob<0?99:ob);}).forEach(function(t){var op=wseEl('option',null,(window.WS.sections[t].label||t));op.value=t;addSel.appendChild(op);});
  var addBtn=wseEl('button','wse-btn','Add');
  addBtn.addEventListener('click',function(){var t=addSel.value;try{var ns=Object.assign({id:t+'-'+window.WS.uid(),type:t},window.WS.sections[t].create(window._wsSiteData));var oi=_ord.indexOf(t);var pos=secs.length;if(oi>=0){for(var k=0;k<secs.length;k++){var ki=_ord.indexOf(secs[k].type);if(ki>oi){pos=k;break;}}}secs.splice(pos,0,ns);wsEdSel=pos;wsRerender();wsOpenEditor();}catch(e){}});
  addRow.appendChild(addSel);addRow.appendChild(addBtn);pad.appendChild(addRow);
  }
  setTimeout(function(){try{wsMarkSelected(wsEdSel>=0&&wsActiveSections()[wsEdSel]?wsActiveSections()[wsEdSel].id:'');}catch(e){}},60);
  if(!inline){
    document.body.appendChild(dr);
    var tog=document.getElementById('wsEdToggle');
    if(!tog){tog=wseEl('button',null,'EDIT');tog.style.cssText='position:fixed;right:0;top:120px;z-index:99998;background:linear-gradient(135deg,#37c15e,#2a9a4a);color:#fff;border:none;border-radius:10px 0 0 10px;padding:13px 10px;cursor:pointer;font:700 12px/1 system-ui;writing-mode:vertical-rl;display:none;box-shadow:-4px 4px 16px rgba(0,0,0,.3)';tog.id='wsEdToggle';tog.addEventListener('click',function(){tog.style.display='none';wsOpenEditor();});document.body.appendChild(tog);}
    tog.style.display='none';
  }
}
// entry point used by the create flow
function wsBuildPaletteBar(){ wsEdSel = (typeof wsEdSel==='number'?wsEdSel:0); wsOpenEditor(); }

function doCreateV3(){
  var val=function(id){var el=document.getElementById(id);return el?(el.value||''):'';};
  var type=val('bizType').trim()||((typeof selectedType!=='undefined'&&selectedType)?selectedType:'');
  var payload={name:val('bizName').trim(),type:type,about:val('customPrompt').trim().slice(0,400),city:val('bizCity').trim().slice(0,80),phone:val('bizPhone').trim().slice(0,40),servicesText:val('bizServices').trim().slice(0,1500)};
  var btn=document.getElementById('gbtn'),gt=document.getElementById('gbtnTxt'),ld=document.getElementById('loading');
  if(btn)btn.disabled=true;if(gt)gt.textContent='Growing...';if(ld)ld.classList.add('on');
  if(window.wsQaShow)try{wsQaShow();}catch(e){}
  fetch('/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(x){return x.json().then(function(dd){return {ok:x.ok,d:dd};});})
    .then(function(r){
      if(btn)btn.disabled=false;if(gt)gt.textContent='Regrow';if(ld)ld.classList.remove('on');
      if(!r.ok||!r.d||r.d.error||!r.d.html){if(window.wsQaHide)wsQaHide();if(typeof toast==='function')toast('Something went wrong - please try again',3000);return;}
      gHTML=r.d.html;window._wsPrompt=payload.tagline||'';window._wsSiteData=r.d.site||null;try{if(window._wsSiteData){wsPersistSiteData();}else{localStorage.removeItem('ws_sd');}}catch(e){}setTimeout(function(){try{wsBuildPaletteBar();}catch(e){}},400);try{localStorage.setItem('wsh',gHTML);}catch(e){}undoStack=[gHTML];redoStack=[];editCount=0;
      try{window._wsPages=null;window._wsCurPage=0;localStorage.removeItem('ws_pages');var _pt=document.getElementById('wsPageTabs');if(_pt&&_pt.parentNode)_pt.parentNode.removeChild(_pt);}catch(e){}
      try{sessionStorage.setItem('ws_freshgen','1');if(window.wsBloom){try{wsBloom();}catch(_wb){}}}catch(e){}
      var ec=document.getElementById('editCounter');if(ec)ec.style.display='none';if(typeof refreshHistoryBtns==='function')refreshHistoryBtns();
      openStudio(gHTML);setTimeout(populateLiveColors,1200);
      try{if(r.d.siteId){window._wsSite=r.d.siteId;window._wsKey=r.d.formKey;localStorage.setItem('ws_site',r.d.siteId);localStorage.setItem('ws_key',r.d.formKey||'');}if(r.d.inboxUrl){window._wsInbox=r.d.inboxUrl;localStorage.setItem('ws_inbox',r.d.inboxUrl);}}catch(e){}
      if(window.wsQaHide)wsQaHide();
    })
    .catch(function(e){if(window.wsQaHide)wsQaHide();if(btn)btn.disabled=false;if(gt)gt.textContent='Regrow';if(ld)ld.classList.remove('on');if(typeof toast==='function')toast('Something went wrong - please try again',3000);});
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
  var _to=_ac?setTimeout(function(){try{_ac.abort();}catch(e){}},150000):0;
  fetch('/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt}),signal:_ac?_ac.signal:undefined})
  .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error: '+t.slice(0,100)}};}});})
  .then(function(r){
    clearInterval(iv);clearTimeout(_to);var _spf=document.getElementById('skelProgress');if(_spf&&r.ok)_spf.style.width='100%';ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    if(!r.ok){
      if(r.d.error==='RATE_LIMITED_FREE'){wsSoftRetry();return;}
      if(r.d.error==='RATE_LIMITED'){wsSoftRetry();return;}
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
      try{console.warn('[Websprout] /generate soft-fail:',r.d.error);}catch(e3){}wsSoftRetry();return;
    }
    window._wsGenTries=0;gHTML=r.d.html;window._wsPrompt=(typeof prompt==="string"?prompt:(window._wsPrompt||""));localStorage.setItem('wsh',gHTML);try{if(window._wsUser&&window._wsUser.email)localStorage.setItem('ws_owner',window._wsUser.email);}catch(_o){}undoStack=[gHTML];redoStack=[];editCount=0;try{sessionStorage.setItem('ws_freshgen','1');if(window.wsBloom){try{wsBloom();}catch(_wb){}}}catch(_fg){}var ec=document.getElementById('editCounter');if(ec)ec.style.display='none';refreshHistoryBtns();document.querySelectorAll('.font-btn.sel').forEach(function(b){b.classList.remove('sel');});var sp=document.getElementById('secPick');if(sp)sp.classList.remove('on');openStudio(gHTML);setTimeout(populateLiveColors,1200);try{if(r.d.siteId){window._wsSite=r.d.siteId;window._wsKey=r.d.formKey;localStorage.setItem('ws_site',r.d.siteId);localStorage.setItem('ws_key',r.d.formKey||'');}if(r.d.inboxUrl){window._wsInbox=r.d.inboxUrl;localStorage.setItem('ws_inbox',r.d.inboxUrl);console.log('%c[Websprout] Form inbox for this site -> '+r.d.inboxUrl,'color:#2d7a3a;font-weight:700');setTimeout(function(){var tl=document.getElementById('toast');if(tl){tl.innerHTML='📬 Form inbox ready — <u style="cursor:pointer">click to open &amp; save the link</u>';tl.classList.add('on');tl.onclick=function(){window.open(r.d.inboxUrl,'_blank');};setTimeout(function(){tl.classList.remove('on');tl.onclick=null;},10000);}},2600);}}catch(e4){}
  })
  .catch(function(e){
    clearInterval(iv);clearTimeout(_to);ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    try{console.warn('[Websprout] /generate fetch soft-fail:',e&&e.message);}catch(e3){}wsSoftRetry();
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
    // Save from the live preview DOM. (Matching oldOuter against gHTML missed whenever the element had
    // just been click-selected — the selection outline is part of its outerHTML — so edits were dropped.)
    wsSyncFromFrame();
    // Don't re-render - edit is already visible in iframe
    addMsg('ai','Text updated! Double-click anything else to keep editing.');
  }
  if(e.data.type==='wsSlotClick'){
    openSlotPicker(e.data.slotId||'image',e.data.label||'Add photo');
  }
});

// ── Canva-style click-to-edit (parent side: all the real editing lives here) ──
var wsBarKind=null, wsBarSlot='';
function wsPfDoc(){var pf=document.getElementById('pf');return (pf&&(pf.contentDocument||(pf.contentWindow&&pf.contentWindow.document)))||null;}
function wsSelEl(){var d=wsPfDoc();return d?d.querySelector('[data-wssel]'):null;}
// Serialize the preview document WITHOUT anything the editor added (edit-mode CSS, selection outlines,
// photo-slot hover overlays, injected scripts, preview-only product grid / cart), keeping the doctype.
function wsCleanDocHtml(d){
  var root=d.documentElement.cloneNode(true);
  root.querySelectorAll('#_wsInject,#_wsES,[data-wsfloat],[data-wsov],#_wsBindCss,.wsb-tip').forEach(function(x){x.remove();});
  root.querySelectorAll('[data-wsf]').forEach(function(x){x.removeAttribute('data-wsf');x.removeAttribute('data-wssec');});
  root.querySelectorAll('.wsb-sel').forEach(function(x){x.classList.remove('wsb-sel');if(!x.getAttribute('class'))x.removeAttribute('class');});
  root.querySelectorAll('[data-wssel]').forEach(function(x){x.removeAttribute('data-wssel');x.style.outline='';x.style.outlineOffset='';});
  root.querySelectorAll('[data-ws-active]').forEach(function(x){x.removeAttribute('data-ws-active');});
  root.querySelectorAll('[contenteditable]').forEach(function(x){x.removeAttribute('contenteditable');});
  root.querySelectorAll('.ws-img-slot,[data-slot-filled]').forEach(function(x){var s=(x.getAttribute('style')||'').split(';').filter(function(p){p=p.trim();return p&&p.indexOf('cursor: pointer')!==0&&p.indexOf('pointer-events: auto')!==0;}).join(';');if(s)x.setAttribute('style',s);else x.removeAttribute('style');});
  root.querySelectorAll('[style=""]').forEach(function(x){x.removeAttribute('style');});
  var h=root.outerHTML;
  function cut(a,b,rep){var i;while((i=h.indexOf(a))>-1){var j=h.indexOf(b,i);if(j<0)break;h=h.slice(0,i)+rep+h.slice(j+b.length);}}
  cut('<!--WSP_S-->','<!--WSP_E-->','<!--WS_PRODUCTS-->');
  cut('<!--WSC_S-->','<!--WSC_E-->','');
  return '<!DOCTYPE html>'+String.fromCharCode(10)+h;
}
function wsSyncFromFrame(){
  var d=wsPfDoc();if(!d)return;
  try{
    var sel=d.querySelector('[data-wssel]'),so='',sf='';
    if(sel){so=sel.style.outline;sf=sel.style.outlineOffset;sel.style.outline='';sel.style.outlineOffset='';sel.removeAttribute('data-wssel');}
    try{d.querySelectorAll('[data-wsfloat]').forEach(function(b){b.remove();});}catch(e){}
    var h=wsCleanDocHtml(d);
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
  try{var _si=document.getElementById('slotSearch'),_sg=document.getElementById('slotSearchGrid');if(_si&&_sg&&!_sg.children.length){var _bt=(window._wsSiteData&&window._wsSiteData.biz&&window._wsSiteData.biz.type)||'';_si.value=_bt;if(_bt)wsPhotoSearch(_bt);}}catch(e){}
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
  // Structured (v3) sites: store the photo in the site data so later edits (colors, fonts, sections) keep it.
  try{
    var _sd=window._wsSiteData;
    if(_sd&&currentSlotId.indexOf('.')>0&&window.WS){
      _sd.photos=_sd.photos||{};_sd.photos[currentSlotId]=dataUrl;
      if(_sd.photoCredits&&String(dataUrl).indexOf('https://images.unsplash.com/')!==0)delete _sd.photoCredits[currentSlotId];
      wsRerender();toast('Photo added');return;
    }
  }catch(e){}
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
      var ov=doc.createElement('div');ov.setAttribute('data-wsov','1');
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
      var newHtml=wsCleanDocHtml(doc);
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
    if(intro)intro.innerHTML='Your site is ready 🌱 Open the visual editor below to change text, sections, colors and photos — or use the tools here for business info. Everything applies live.';
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
            try{if(j.site&&j.site.sections){window._wsSiteData=j.site;wsPersistSiteData();try{if(document.getElementById('wsEdHost'))wsOpenEditor();}catch(_e){}}}catch(e){}
            try{undoStack=[gHTML];redoStack=[];wsSnapSiteData(gHTML);refreshHistoryBtns();}catch(e){}
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
  try{var _hadSd=!!window._wsSiteData;wsLoadSiteData(window._wsSite||localStorage.getItem('ws_site')||'');if(!_hadSd&&window._wsSiteData)setTimeout(function(){try{wsBuildPaletteBar();}catch(e){}},400);}catch(e){}
  try{if(!undoStack.length&&typeof html==='string'){undoStack=[html];wsSnapSiteData(html);refreshHistoryBtns();}}catch(e){}
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
  var dl=document.getElementById('dlBtn');if(dl){dl.textContent='↓ Download';dl.className='s-btn s-green';}
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
  d.innerHTML='<div class="msg-name">'+(role==='ai'?'Websprout':'You')+'</div><div class="msg-body">'+e+'</div>';
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
  if(e==="RATE_LIMITED_FREE"||e==="RATE_LIMITED"||e==="rate")return "Too many requests right now 🌱  Give it a few seconds and try again.";
  if(/token count exceeds|exceeds the maximum|too large|request payload size/i.test(e))return "Your site has gotten very large to handle in one pass — usually from several big uploaded photos baked into the page. Try removing or replacing a couple of the largest images, then try again. (Smaller photos also make your live site load faster.)";
  return e;
}

function doChat(){
  try{var _c=document.getElementById('ci');if(_c){_c.value='';_c.style.height='auto';}if(window._wsSiteData){wsBuildPaletteBar();addMsg('ai','Editing is now visual — use the Edit panel on the right to change text, sections, colors and photos. Your changes apply live.');}else{addMsg('ai','Editing is now visual. Create a site with the builder to use the new editor.');}}catch(e){}return;
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
  try{fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'upgrade_click',url:location.href})});}catch(e){}
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
        // Adaptive: a heavy photo bloats the saved HTML (images embed inline), so re-encode
        // smaller and leaner when the first pass is still large. Keeps published sites fast.
        if(dataUrl&&dataUrl.length>700000){
          var MAX2=1000,w2=img.width,h2=img.height;
          if(w2>MAX2){h2=Math.round(h2*MAX2/w2);w2=MAX2;}
          if(h2>MAX2){w2=Math.round(w2*MAX2/h2);h2=MAX2;}
          if(w2<1)w2=1;if(h2<1)h2=1;
          canvas.width=w2;canvas.height=h2;
          ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w2,h2);
          ctx.drawImage(img,0,0,w2,h2);
          dataUrl=canvas.toDataURL('image/jpeg',0.62);
        }
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
  // Structured (v3) sites: place the photo straight into the site data — no server round-trip.
  try{
    var sd=window._wsSiteData;
    if(sd&&window.WS){
      var secs=(typeof wsActiveSections==='function'&&wsActiveSections())||sd.sections||[];
      sd.photos=sd.photos||{};
      var PH=['hero','intro','prices','cta'];
      var target=null;
      if(action==='hero')target=secs.find(function(s){return s.type==='hero';});
      else if(action==='about'){target=secs.find(function(s){return s.type==='intro';});if(target&&target.variant==='center')target.variant='offset';}
      if(!target)target=secs.find(function(s){return PH.indexOf(s.type)>-1&&(s.type!=='intro'||s.variant!=='center')&&!sd.photos[s.id+'.photo'];});
      if(!target)target=secs.find(function(s){return s.type==='hero';});
      document.getElementById('imgActions').style.display='none';
      if(!target){toast('No photo spot on this page — add a section with a photo first');return;}
      sd.photos[target.id+'.photo']=dataUrl;
      wsRerender();toast('Photo placed');return;
    }
  }catch(e){}
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
  // Older (pre-v3) sites have no structured data and the old AI /modify endpoint no longer exists.
  addMsg('ai','To add this photo, click a photo spot in the preview and choose it from your library.');
}

;
</script>