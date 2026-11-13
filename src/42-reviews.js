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
    if(!siteId || !/^[A-Za-z0-9_-]{4,40}$/.test(siteId)) return jsonR({ ok:false, error:'bad site' }, 400);
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
