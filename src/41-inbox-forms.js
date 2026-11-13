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
      <label class="arow" style="flex-basis:100%;display:flex;gap:8px;align-items:center;font-size:13px;color:#3d4a3a;order:9"><input type="checkbox" id="autoreply" checked onchange="saveAutoReply()"> Send people an automatic &ldquo;thanks, we got your message&rdquo; email</label>
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
  DATA=j.submissions||[];document.getElementById('notify').value=j.notify||'';document.getElementById('autoreply').checked=j.autoreply!==false;
  renderStats(j);
  document.getElementById('count').textContent=DATA.length+(DATA.length===1?' lead':' leads');
  var L=document.getElementById('list');
  if(!DATA.length){L.innerHTML='<div class="empty"><div class="big">&#128229;</div><p>No leads yet. When someone fills out a form on your site, it shows up here.</p></div>';return;}
  var h='';for(var i=0;i<DATA.length;i++){var s=DATA[i];var d=new Date(s.ts);h+='<div class="card"><div class="when">'+d.toLocaleString()+'</div>';
  for(var k in s.fields){h+='<div class="row"><div class="k">'+esc(k)+'</div><div class="v">'+esc(s.fields[k])+'</div></div>';}h+='</div>';}
  L.innerHTML=h;
}).catch(function(){nmsg('Could not load. Check your link and try again.',false);});}
function saveAutoReply(){var on=document.getElementById('autoreply').checked;fetch('/api/inbox/autoreply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,key:key,on:on})}).then(function(r){return r.json();}).then(function(j){nmsg(j.error?j.error:(on?'Auto-reply on':'Auto-reply off'),!j.error);}).catch(function(){nmsg('Could not save',false);});}
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
    if (!siteId || !/^[A-Za-z0-9_-]{4,40}$/.test(siteId)) return jsonR({ ok:false, error:'bad site' }, 400);
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
    let notify = '';
    try { notify = await env.KV.get('notify:' + siteId) || ''; if (notify && env.RESEND_API_KEY) await sendFormEmail(env, notify, siteId, fields); } catch(e){}
    try { await sendAutoReply(env, siteId, fields, notify); } catch(e){}
    return jsonR({ ok:true });
  } catch(e){ return jsonR({ ok:false, error:'error' }, 500); }
}

async function runWeeklyDigest(env){
  if(!env.KV || !env.RESEND_API_KEY) return;
  // The cron may fire more often than weekly (nudges share it) - send the digest at most once every 6 days.
  try{ const _last = parseInt((await env.KV.get('digest:lastrun'))||'0',10)||0; if(Date.now() - _last < 6*86400000) return; await env.KV.put('digest:lastrun', String(Date.now())); }catch(e){ return; }
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
        const frk = await kvAllKeys(env, 'form:'+siteId+':');
        for(const fk of frk){ const parts = fk.name.split(':'); const ts = parseInt(parts[2],10)||0; if(ts >= cutoff) weekLeads++; }
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
// Business name for emails, from a published page's <title> ("Name | Barber shop in Austin").
function siteNameFromHtml(html){
  const t = extractTitle(html).split(' | ')[0].replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;|&gt;/g,'');
  return t.replace(/[\r\n<>"]/g,'').trim().slice(0,60);
}
// One place to send mail. Test servers (WS_TEST_MODE, never set in production) record it instead.
async function wsSendMail(env, msg){
  if (env.WS_TEST_MODE === '1') { try { const k = 'testmail:' + msg.to[0]; const prev = JSON.parse((await env.KV.get(k)) || '{}'); await env.KV.put(k, JSON.stringify(Object.assign({}, msg, { n: (prev.n || 0) + 1 })), { expirationTtl: 600 }); } catch(e){} return true; }
  if (!env.RESEND_API_KEY) return false;
  const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify(msg) });
  return r.ok;
}
// "Thanks, we got your message" to the visitor, from the business. On by default; the owner can turn it off
// in the inbox. Anti-abuse: fixed wording (nothing the visitor typed is echoed except a plain first name),
// one reply per address per site per day, at most 40 per site per day.
async function sendAutoReply(env, siteId, fields, ownerEmail){
  if (!env.KV) return false;
  let to = '';
  for (const k in fields){ if (/e-?mail/i.test(k) && isRealEmail(fields[k])) { to = String(fields[k]).trim().toLowerCase(); break; } }
  if (!to) return false;
  if ((await env.KV.get('autoreply:' + siteId)) === 'off') return false;
  if (ownerEmail && to === String(ownerEmail).toLowerCase()) return false;
  const dk = 'arsent:' + siteId + ':' + to;
  if (await env.KV.get(dk)) return false;
  const day = new Date().toISOString().slice(0,10), ck = 'arcount:' + siteId + ':' + day;
  const cnt = parseInt((await env.KV.get(ck)) || '0', 10) || 0;
  if (cnt >= 40) return false;
  let name = '';
  try { const slug = await env.KV.get('slugof:' + siteId); if (slug) { const m = JSON.parse((await env.KV.get('pubmeta:' + slug)) || '{}'); name = m.name || ''; if (!name) name = siteNameFromHtml(await env.KV.get('pub:' + slug) || ''); } } catch(e){}
  name = String(name || '').replace(/[\r\n<>"]/g,'').trim().slice(0,60);
  if (!name) return false; // unpublished or unknown site: no reply rather than a nameless one
  let first = '';
  for (const k in fields){ if (/^(first[ _-]?)?name$/i.test(k)) { const w = String(fields[k]).trim().split(/\s+/)[0] || ''; if (/^[A-Za-z\u00C0-\u024F'-]{1,30}$/.test(w)) first = w; break; } }
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#222;font-size:15px;line-height:1.55">'
    + '<p style="margin:0 0 14px">' + (first ? 'Hi ' + escHtml(first) + ',' : 'Hi,') + '</p>'
    + '<p style="margin:0 0 14px">Thanks for getting in touch with ' + escHtml(name) + '. We got your message and will get back to you soon.</p>'
    + (ownerEmail ? '<p style="margin:0 0 14px">If you need to add anything, just reply to this email.</p>' : '')
    + '<p style="margin:0">' + escHtml(name) + '</p>'
    + '<p style="margin:24px 0 0;color:#999;font-size:12px">You are getting this because you sent a message through ' + escHtml(name) + '&#39;s website. Website by Websprout.</p></div>';
  const msg = { from: name + ' <hello@websprout.app>', to: [to], subject: 'We got your message - ' + name, html: html };
  if (ownerEmail && isRealEmail(ownerEmail)) msg.reply_to = String(ownerEmail).trim();
  const ok = await wsSendMail(env, msg);
  if (ok) { await env.KV.put(dk, '1', { expirationTtl: 86400 }); await env.KV.put(ck, String(cnt + 1), { expirationTtl: 2 * 86400 }); }
  return ok;
}
async function doInboxAutoReply(request, env){
  try {
    const b = await request.json();
    if (!b.site || !env.KV) return fail('Missing site');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    if (b.on) await env.KV.delete('autoreply:' + b.site); else await env.KV.put('autoreply:' + b.site, 'off');
    return succeed({ ok:true, autoreply: !!b.on });
  } catch(e){ return fail('Could not save'); }
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
    const keys = await kvAllKeys(env, 'form:' + site + ':');
    const names = keys.map(function(k){ return k.name; }).sort().reverse().slice(0,200);
    const subs = [];
    for (const nm of names){ const v = await env.KV.get(nm); if (v){ try { const o = JSON.parse(v); o._k = nm; subs.push(o); } catch(e){} } }
    const notify = await env.KV.get('notify:' + site) || '';
    const total = parseInt((await env.KV.get('views:'+site+':total'))||'0',10)||0;
    const days = []; const now = Date.now(); let week = 0, today = 0;
    for (let i=6;i>=0;i--){ const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,''); const c = parseInt((await env.KV.get('views:'+site+':'+ds))||'0',10)||0; days.push({ d: ds, c: c }); week += c; if (i===0) today = c; }
    const autoreply = (await env.KV.get('autoreply:' + site)) !== 'off';
    return succeed({ submissions: subs, notify: notify, autoreply: autoreply, count: subs.length, total: total, today: today, week: week, days: days });
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

// List every key under a prefix (KV.list returns at most 1000 per call).
async function kvAllKeys(env, prefix, maxPages){
  const out = []; let cur, g = 0;
  do { const r = await env.KV.list({ prefix: prefix, cursor: cur, limit: 1000 }); for (const k of r.keys) out.push(k); cur = r.list_complete ? null : r.cursor; g++; } while (cur && g < (maxPages || 20));
  return out;
}
async function doInboxClear(request, env){
  try {
    const b = await request.json();
    if (!b.site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const keys = await kvAllKeys(env, 'form:' + b.site + ':');
    for (const k of keys){ await env.KV.delete(k.name); }
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

// Injected into every generated site: auto-wires all <form>s to the inbox.