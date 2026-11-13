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
  function restorePages(){ try{ var raw=localStorage.getItem("ws_pages"); if(!raw) return; var o=JSON.parse(raw); var sid=window._wsSite||localStorage.getItem("ws_site")||""; if(o&&o.pages&&o.pages.length>1&&o.site&&o.site===sid){ window._wsPages=o.pages; window._wsCurPage=Math.min(o.cur||0,o.pages.length-1); if(window._wsPages[window._wsCurPage]){ var hc=curDoc(); if(hc) window._wsPages[window._wsCurPage].html=hc; } renderTabs(window._wsCurPage); } }catch(e){} }
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
  function makeRow(p){ p=p||{}; var row=document.createElement("div"); row.className="wsProdRow"; row.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:12px;margin-bottom:10px;background:rgba(255,255,255,.02)"; fld(row,"Product name",p.name,"name"); var _prF=fld(row,"Price (e.g. $24)",p.price,"price"); _prF.addEventListener("input",function(){ var d=_prF.value.replace(/[^0-9.]/g,""); _prF.value=d?("$"+d):""; }); _prF.addEventListener("blur",function(){ var d=_prF.value.replace(/[^0-9.]/g,""); if(d!==""){ var n=parseFloat(d); _prF.value="$"+((isFinite(n))?((n%1===0)?String(n):n.toFixed(2)):d); } }); var _imgF=fld(row,"Image URL, or use Upload below",p.img,"img",true); var _upB=document.createElement("button"); _upB.type="button"; _upB.textContent="📷 Upload photo"; _upB.style.cssText="grid-column:1/-1;justify-self:start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:8px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;padding:7px 12px;margin:-2px 0 2px"; var _upI=document.createElement("input"); _upI.type="file"; _upI.accept="image/*"; _upI.style.display="none"; _upB.onclick=function(){ _upI.click(); }; _upI.onchange=function(){ var f=_upI.files&&_upI.files[0]; if(!f)return; if(typeof compressImage!=="function"){ if(typeof toast==="function")toast("Photo upload unavailable here",3000); return; } _upB.textContent="Uploading..."; try{ compressImage(f,function(u){ _imgF.value=u; _upB.textContent="✓ Photo added"; setTimeout(function(){ _upB.textContent="📷 Change photo"; },1500); }); }catch(e){ _upB.textContent="📷 Upload photo"; } }; row.appendChild(_upB); row.appendChild(_upI); fld(row,"Short description",p.desc,"desc",true); fld(row,"Category, e.g. Tees (optional)",p.category,"category",true); fld(row,"Stripe payment link (optional)",p.payUrl,"payUrl",true); var del=document.createElement("button"); del.type="button"; del.textContent="Remove"; del.style.cssText="grid-column:1/-1;justify-self:start;background:transparent;border:none;color:#ff9b9b;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;padding:2px 0"; del.onclick=function(){ row.remove(); }; row.appendChild(del); return row; }
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
      try{ if(j&&j.products) window._wsProducts=j.products; fetch("/store-preview?siteId="+encodeURIComponent(s)+"&key="+encodeURIComponent(k)).then(function(r){return r.text();}).then(function(t){ window._wsCartHtml=t||""; if(typeof setPreview==="function") setPreview(gHTML); }).catch(function(){ if(typeof setPreview==="function") setPreview(gHTML); }); }catch(e){ if(typeof setPreview==="function") setPreview(gHTML); }
    })
    .catch(function(){ tt("Could not save products"); });
  }
  function openProducts(){
    buildModal();
    var s=sid(), k=skey(); var w=$("wsProdRows"); if(w) w.innerHTML=""; if(s){ try{ fetch("/store-preview?siteId="+encodeURIComponent(s)+"&key="+encodeURIComponent(k)).then(function(r){return r.text();}).then(function(t){ window._wsCartHtml=t||""; try{ if(typeof gHTML!=="undefined"&&typeof setPreview==="function") setPreview(gHTML); }catch(e){} }).catch(function(){}); }catch(e){} }
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
<script>
(function(){
  try{
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    /* #1 count up the live site total */
    (function(){
      var el=document.getElementById('liveCount'); if(!el)return;
      var t=el.textContent||''; var n=''; for(var i=0;i<t.length;i++){var ch=t.charAt(i); if(ch>='0'&&ch<='9')n+=ch;}
      var target=parseInt(n,10); if(!target||target<1||reduce)return;
      function fmt(x){x=String(x);var o='';var c=0;for(var i=x.length-1;i>=0;i--){o=x.charAt(i)+o;c++;if(c%3===0&&i>0)o=','+o;}return o;}
      var done=false;
      function run(){ if(done)return; done=true; var start=null,dur=1300;
        function step(ts){ if(start===null)start=ts; var pr=Math.min(1,(ts-start)/dur); var e=1-Math.pow(1-pr,3); el.textContent=fmt(Math.round(target*e)); if(pr<1)requestAnimationFrame(step); else el.textContent=fmt(target);}
        requestAnimationFrame(step); }
      if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ for(var k=0;k<es.length;k++){ if(es[k].isIntersecting){ run(); io.disconnect(); break; } } }); io.observe(el); }
      else run();
    })();

    /* #4 vibe chips tint the builder card glow */
    (function(){
      var card=document.querySelector('.builder-card'); if(!card)return;
      var vibe={'modern and minimal':'#4ade80','bold and colorful':'#ec4899','warm and friendly':'#f59e0b','dark and premium':'#8b5cf6','clean and professional':'#38bdf8','fun and playful':'#f472b6'};
      var base=''; try{ base=getComputedStyle(card).boxShadow; if(base==='none')base=''; }catch(e){}
      var chips=document.querySelectorAll('.vibe-chip');
      function tint(c){ var col=vibe[c.getAttribute('data-style')]||'#4ade80'; card.style.transition='box-shadow .45s ease'; card.style.boxShadow=(base?base+', ':'')+'0 0 52px -8px '+col; }
      for(var i=0;i<chips.length;i++){ (function(c){ c.addEventListener('mouseenter',function(){tint(c);}); c.addEventListener('click',function(){tint(c);}); })(chips[i]); }
    })();

    /* #2 live examples: real generated sites, scaled down, loaded only when scrolled near */
    (function(){
      var grid=document.getElementById('wsExGrid'); if(!grid)return;
      var items=[['Fade & Co.','Barber shop'],['Rosa Verde','Restaurant'],['Spotless Pros','House cleaning'],['Hartley & Reed','Law firm'],['Still Water Yoga','Yoga studio'],['Petal & Stem','Wedding florist']];
      items.forEach(function(it,i){
        var a=document.createElement('a');a.className='ws-ex';a.href='/example?i='+i;a.target='_blank';a.rel='noopener';
        a.setAttribute('aria-label','Open the example site for '+it[0]+', a '+it[1].toLowerCase());
        var bar=document.createElement('div');bar.className='ws-ex-bar';bar.innerHTML='<span></span><span></span><span></span>';
        var url=document.createElement('em');url.textContent=it[0].toLowerCase().replace(/[^a-z0-9]+/g,'')+'.websprout.app';bar.appendChild(url);
        var vp=document.createElement('div');vp.className='ws-ex-vp';
        var fr=document.createElement('iframe');fr.setAttribute('tabindex','-1');fr.setAttribute('aria-hidden','true');fr.setAttribute('loading','lazy');fr.title=it[0];fr.dataset.src='/example?i='+i;
        vp.appendChild(fr);
        var cap=document.createElement('div');cap.className='ws-ex-cap';cap.innerHTML='<b></b><span></span>';cap.firstChild.textContent=it[0];cap.lastChild.textContent=it[1];
        a.appendChild(bar);a.appendChild(vp);a.appendChild(cap);grid.appendChild(a);
      });
      function fit(){grid.querySelectorAll('.ws-ex-vp').forEach(function(v){if(v.clientWidth)v.style.setProperty('--s',(v.clientWidth/1280).toFixed(4));});}
      fit();window.addEventListener('resize',fit);setTimeout(fit,300);
      function load(f){if(f.dataset.src){f.src=f.dataset.src;f.removeAttribute('data-src');}}
      var frames=grid.querySelectorAll('iframe');
      if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){load(en.target);io.unobserve(en.target);}});},{rootMargin:'400px'});frames.forEach(function(f){io.observe(f);});}
      else frames.forEach(load);
    })();

    /* #5 scroll reveal (only hide what is below the fold, so no flash) */
    (function(){
      var sels=['#showcase','.how','.pricing','.cta-band','.compare','.faq'];
      var vh=window.innerHeight||800;
      for(var s2=0;s2<sels.length;s2++){ var list=document.querySelectorAll(sels[s2]);
        for(var i=0;i<list.length;i++){ var el=list[i];
          if(el.classList.contains('ws-reveal'))continue;
          var r=el.getBoundingClientRect();
          if(r.top>vh*0.85)el.classList.add('ws-reveal');
        } }
      var revEls=document.querySelectorAll('.ws-reveal');
      if(!revEls.length)return;
      if(reduce||!('IntersectionObserver' in window)){ for(var j=0;j<revEls.length;j++)revEls[j].classList.add('ws-in'); return; }
      var io=new IntersectionObserver(function(es){ for(var k=0;k<es.length;k++){ if(es[k].isIntersecting){ es[k].target.classList.add('ws-in'); io.unobserve(es[k].target); } } },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
      for(var m=0;m<revEls.length;m++)io.observe(revEls[m]);
    })();

    /* #8 bloom burst, fired on a successful fresh generation */
    window.wsBloom=function(){
      try{
        if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
        var g=['🌸','🌿','🍃','✨','🌱','🌼']; var n=16;
        for(var i=0;i<n;i++){
          var sp=document.createElement('div'); sp.className='ws-petal'; sp.textContent=g[i%g.length];
          var dx=(Math.random()*2-1)*240; var dy=-(130+Math.random()*230); var dr=(Math.random()*2-1)*160;
          sp.style.left='50%'; sp.style.top='44%'; sp.style.fontSize=(14+Math.random()*16).toFixed(0)+'px';
          sp.style.setProperty('--dx',dx.toFixed(0)+'px'); sp.style.setProperty('--dy',dy.toFixed(0)+'px'); sp.style.setProperty('--dr',dr.toFixed(0)+'deg');
          sp.style.animationDelay=(Math.random()*140).toFixed(0)+'ms';
          document.body.appendChild(sp);
          (function(node){ setTimeout(function(){ if(node&&node.parentNode)node.parentNode.removeChild(node); },1800); })(sp);
        }
      }catch(e){}
    };

  }catch(e){}
})();
</script>
</body>
</html>`;
