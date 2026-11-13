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
<h2>Funnel <span style="font-size:12px;color:rgba(234,242,232,.4);font-weight:400">unique visitors per step &middot; <a href="#" data-fd="7" style="color:#7fe39a">7 days</a> &middot; <a href="#" data-fd="30" style="color:#7fe39a">30 days</a></span></h2>
<div class="wrap" id="funnel" style="padding:14px 16px"><span class="muted">Loading...</span></div>
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
<h2>Errors on sites <span id="errCount" style="font-size:12px;color:rgba(234,242,232,.4);font-weight:400"></span> <button id="errClear" onclick="clearErrors()" style="display:none;margin-left:8px;background:none;border:1px solid rgba(255,255,255,.2);color:#eaf2e8;border-radius:6px;padding:3px 10px;font-size:12px;cursor:pointer">Clear all</button></h2>
<div class="wrap"><table><thead><tr><th>Last seen</th><th>Where</th><th>Error and affected sites</th><th>Hits (24h / total)</th></tr></thead><tbody id="ebody"><tr><td colspan="4" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<script>
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '<span class="muted">&mdash;</span>';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function card(n,l,cls){return '<div class="card '+(cls||'')+'"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';}
function clearErrors(){if(!confirm('Clear all logged errors?'))return;fetch('/admin/errors/clear',{method:'POST'}).then(function(r){return r.json();}).then(function(){load();});}
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
    var gs=j.errorGroups||[],eb='';
    if(!gs.length)eb='<tr><td colspan="4" class="muted" style="padding:18px">No errors reported \uD83C\uDF89</td></tr>';
    for(var x=0;x<gs.length;x++){var er=gs[x];
      eb+='<tr><td class="muted" style="white-space:nowrap">'+dt(er.last)+'</td><td>'+esc(er.where||'')+'</td><td style="max-width:480px"><div style="color:#fca5a5;font-size:12px;word-break:break-word">'+esc(er.msg||'')+(er.line?' <span class="muted">(line '+er.line+')</span>':'')+'</div>'+(er.sites&&er.sites.length?'<div class="muted" style="font-size:11px;word-break:break-all">'+er.sites.map(esc).join(', ')+'</div>':(er.url?'<div class="muted" style="font-size:11px;word-break:break-all">'+esc(er.url)+'</div>':''))+'</td><td style="white-space:nowrap'+(er.last24?';color:#fca5a5;font-weight:700':'')+'">'+er.last24+' / '+er.count+'</td></tr>';}
    document.getElementById('ebody').innerHTML=eb;
    var ec=document.getElementById('errCount');if(ec)ec.textContent=gs.length?('('+gs.length+' distinct, '+((j.totals&&j.totals.errors24)||0)+' in the last 24h)'):'';
    var cb=document.getElementById('errClear');if(cb)cb.style.display=gs.length?'':'none';
  }).catch(function(){document.getElementById('cards').innerHTML='<div class="err">Could not load \u2014 make sure you are signed in as the owner.</div>';});
}
document.getElementById('ubody').addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-act]');if(!b)return;var act=b.getAttribute('data-act');if(act==='plan')setPlan(b.getAttribute('data-email'),b.getAttribute('data-v'));else if(act==='dev')setDev(b.getAttribute('data-email'),b.getAttribute('data-v'));});
document.getElementById('pbody').addEventListener('click',function(e){var fb=e.target.closest&&e.target.closest('button[data-feat]');if(!fb)return;setFeature(fb.getAttribute('data-slug'),fb.getAttribute('data-feat'));});
document.getElementById('refresh').addEventListener('click',load);
function loadFunnel(d){
  fetch('/admin/funnel?days='+(d||30)).then(function(r){return r.json();}).then(function(j){
    var el=document.getElementById('funnel');if(!el)return;if(j.error){el.innerHTML='<span class="muted">'+esc(j.error)+'</span>';return;}
    var top=(j.steps[0]&&j.steps[0].n)||0,prev=null,h='';
    j.steps.forEach(function(s){var pct=top?Math.round(s.n*100/top):0;var step=prev?(prev?Math.round(s.n*100/prev):0)+'% of previous':'';
      h+='<div style="display:grid;grid-template-columns:180px 1fr 140px;gap:12px;align-items:center;margin:6px 0"><span>'+esc(s.label)+'</span><div style="background:rgba(255,255,255,.06);border-radius:6px;height:22px;overflow:hidden"><div style="width:'+Math.max(pct,s.n?2:0)+'%;height:100%;background:linear-gradient(90deg,#2f9e4f,#4ade80)"></div></div><span><b>'+s.n+'</b> <span class="muted">'+step+'</span></span></div>';prev=s.n||0;});
    var src=Object.keys(j.sources||{}).sort(function(a,b){return j.sources[b]-j.sources[a];}).slice(0,6).map(function(k){return esc(k)+' '+j.sources[k];}).join(' &middot; ');
    el.innerHTML=h+'<div class="muted" style="margin-top:10px;font-size:12px">Last '+j.days+' days.'+(src?' Landing visits by source: '+src:'')+'</div>';
  }).catch(function(){});
}
document.querySelectorAll('[data-fd]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();loadFunnel(a.getAttribute('data-fd'));});});
loadFunnel(30);
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
    const meta = { t:ev.t, ts:ev.ts, c:ev.country, ci:ev.city, e:ev.email, s:ev.src, d:ev.device, ih:String(iph||'').slice(0,16) };
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
// Conversion funnel: unique visitors (hashed IP) reaching each step in the last N days.
const FUNNEL_STEPS = [['visit', 'Visited the landing page'], ['create_v3', 'Built a site'], ['first_edit', 'Edited it'], ['publish', 'Published'], ['upgrade_click', 'Opened Go Pro'], ['pro_start', 'Started Pro']];
async function doAdminFunnel(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  const days = Math.max(1, Math.min(60, parseInt(new URL(request.url).searchParams.get('days') || '30', 10) || 30));
  const since = Date.now() - days * 86400000;
  const sets = {}; FUNNEL_STEPS.forEach(function(st){ sets[st[0]] = new Set(); });
  const bySrc = {};
  try {
    let cur, g = 0;
    do {
      const r = await env.KV.list({ prefix:'evt:', cursor:cur, limit:1000 });
      for (const k of r.keys) {
        const m = k.metadata || {}; const ts = m.ts || parseInt(k.name.split(':')[1], 10) || 0;
        if (ts < since || !sets[m.t]) continue;
        const who = (m.e || '') || k.name; // events are keyed by hashed IP in the record; metadata keeps email when known
        sets[m.t].add(m.ih || who);
        if (m.t === 'visit') { const src = m.s || 'direct'; bySrc[src] = (bySrc[src] || 0) + 1; }
      }
      cur = r.list_complete ? null : r.cursor; g++;
    } while (cur && g < 40);
  } catch(e){}
  const steps = FUNNEL_STEPS.map(function(st){ return { id: st[0], label: st[1], n: sets[st[0]].size }; });
  return succeed({ days: days, steps: steps, sources: bySrc });
}
// Client errors grouped by what went wrong, so one broken script on 30 sites reads as one row with 30 hits.
function groupClientErrors(errors){
  const now=Date.now(), map={};
  (errors||[]).forEach(function(er){
    if(!er||!er.msg) return;
    const sig=(er.where||'')+'|'+String(er.msg).replace(/\d+/g,'#').slice(0,160);
    let g=map[sig];
    if(!g){ g=map[sig]={ msg:er.msg, where:er.where||'', count:0, last24:0, first:er.ts||0, last:er.ts||0, sites:[], url:er.url||'', src:er.src||'', line:er.line||0 }; }
    g.count++; if(er.ts>now-86400000) g.last24++;
    if(er.ts<g.first) g.first=er.ts; if(er.ts>g.last){ g.last=er.ts; g.url=er.url||g.url; }
    let host=''; try{ const u=new URL(er.url); host=u.hostname+(u.hostname==='websprout.app'&&/^\/s\//.test(u.pathname)?u.pathname.split('/').slice(0,3).join('/'):''); }catch(e){}
    if(host && g.sites.indexOf(host)===-1 && g.sites.length<8) g.sites.push(host);
  });
  return Object.keys(map).map(function(k){return map[k];}).sort(function(a,b){ return (b.last24-a.last24)||(b.last-a.last); });
}
async function doAdminErrorsClear(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  let n=0;
  try{ let cur, g=0; do{ const r=await env.KV.list({ prefix:'clienterr:', cursor:cur, limit:1000 }); for(const k of r.keys){ await env.KV.delete(k.name); n++; } cur=r.list_complete?null:r.cursor; g++; }while(cur && g<10); }catch(e){}
  return succeed({ ok:true, cleared:n });
}
// Daily: email the owner when errors appeared that were not there at the last alert.
async function runErrorAlert(env){
  try{
    if(!env.KV || !env.RESEND_API_KEY) return;
    const last=parseInt((await env.KV.get('erralert:last'))||'0',10)||0;
    if(Date.now()-last < 20*3600000) return;
    const r=await env.KV.list({ prefix:'clienterr:', limit:1000 });
    const names=r.keys.map(function(k){return k.name;}).filter(function(nm){ return (parseInt(nm.split(':')[1],10)||0) > last; }).sort().reverse().slice(0,200);
    await env.KV.put('erralert:last', String(Date.now()));
    if(!names.length) return;
    const errs=[]; for(const nm of names){ try{ errs.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} }
    const groups=groupClientErrors(errs);
    const rows=groups.slice(0,10).map(function(g){ return '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700">'+g.count+'x</td><td style="padding:6px 10px;border-bottom:1px solid #eee">'+escHtml(g.msg)+'<div style="color:#888;font-size:12px">'+escHtml(g.where)+' &middot; '+escHtml(g.sites.join(', '))+'</div></td></tr>'; }).join('');
    const html='<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px"><p>'+errs.length+' JavaScript error'+(errs.length===1?'':'s')+' were reported since the last alert ('+groups.length+' distinct):</p><table style="border-collapse:collapse;font-size:14px">'+rows+'</table><p><a href="https://websprout.app/admin">Open the admin dashboard</a></p></div>';
    await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[SUPPORT_EMAIL], subject:'Websprout: '+groups.length+' new error'+(groups.length===1?'':'s')+' on sites', html: html }) });
  }catch(e){}
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
  try{ const r3=await env.KV.list({ prefix:'clienterr:', limit:1000 }); const names=r3.keys.map(function(k){return k.name;}).sort().reverse().slice(0,300); for(const nm of names){ try{ errors.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} } }catch(e){}
  const errorGroups=groupClientErrors(errors);
  let visits=0; try{ visits=parseInt(await env.KV.get('stat:visit')||'0',10)||0; }catch(e){}
  return succeed({ totals:{ visits, visitConv: visits?Math.round(buildTotal/visits*1000)/10:0, accounts:users.length, paid, comped, pro:paid+comped, free, conversion: users.length?Math.round(paid/users.length*1000)/10:0, mrr: paid*10, published:pub.length, generations:buildTotal, leads:leadTotal, domains:domains.length, devs, signups7, errors:errors.length, errors24: errorGroups.reduce(function(a,g){return a+g.last24;},0), invoices:invoices.length, invoiced:invTotal, feeBilled, feesCollected, feesCount, feesOk }, users, published:pub, errors: errors.slice(0,60), errorGroups: errorGroups.slice(0,40), domains, invoices: invoices.slice(0,40) });
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
const BUILD_ID = '2026-11-13-r322';
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
