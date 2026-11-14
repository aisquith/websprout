// ── Leads: one inbox for every form submission across all of an owner's sites ──
// Signed-in owners see contact, booking, quote and reservation requests from all their sites in one place,
// and reply from their OWN email app or phone (mailto: / sms: / tel:), so customers see the owner's real
// address and number. Websprout sends nothing on the owner's behalf here.

const LEAD_ID_RE = /^form:[A-Za-z0-9_-]{4,40}:\d{10,16}:[a-z0-9]{1,10}$/;

async function leadsOwnerSites(env, email) {
  let list = [];
  try { list = JSON.parse((await env.KV.get('usersites:' + email)) || '[]'); } catch (e) {}
  return Array.isArray(list) ? list.filter(function (s) { return s && s.siteId; }).slice(0, 100) : [];
}

// Pull the visitor's email, phone and name out of whatever fields the form had.
function leadContact(fields) {
  const out = { email: '', phone: '', name: '' };
  for (const k in (fields || {})) {
    const v = String(fields[k] || '').trim();
    if (!out.email && /e-?mail/i.test(k) && isRealEmail(v)) out.email = v.toLowerCase();
    else if (!out.phone && /phone|tel|mobile|cell|number/i.test(k) && (v.replace(/\D/g, '').length >= 7)) out.phone = v.slice(0, 30);
    else if (!out.name && /^(full[ _-]?|first[ _-]?|your[ _-]?)?name$/i.test(k)) out.name = v.slice(0, 60);
  }
  if (!out.email) { for (const k in (fields || {})) { const m = String(fields[k] || '').match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/); if (m && isRealEmail(m[0])) { out.email = m[0].toLowerCase(); break; } } }
  return out;
}

async function doLeadsData(request, env) {
  const s = await getSession(request, env);
  if (!s || !s.email) return jsonR({ auth: false, leads: [], sites: [] }, 401);
  if (!env.KV) return jsonR({ auth: true, leads: [], sites: [] });
  const sites = await leadsOwnerSites(env, s.email);
  const leads = [];
  let reads = 0;
  for (const st of sites) {
    let names = [];
    try { names = (await kvAllKeys(env, 'form:' + st.siteId + ':')).map(function (k) { return k.name; }).sort().reverse().slice(0, 200); } catch (e) {}
    for (const nm of names) {
      if (reads >= 600) break;
      reads++;
      try {
        const o = JSON.parse((await env.KV.get(nm)) || 'null');
        if (!o || !o.fields) continue;
        leads.push({ id: nm, siteId: st.siteId, site: String(st.name || 'My site').slice(0, 80), ts: o.ts || 0, fields: o.fields, status: o.status || 'new', repliedAt: o.repliedAt || 0, contact: leadContact(o.fields) });
      } catch (e) {}
    }
  }
  leads.sort(function (a, b) { return b.ts - a.ts; });
  return jsonR({ auth: true, email: s.email, sites: sites.map(function (x) { return { siteId: x.siteId, name: String(x.name || 'My site').slice(0, 80) }; }), leads: leads });
}

async function doLeadsUpdate(request, env) {
  const s = await getSession(request, env);
  if (!s || !s.email) return jsonR({ ok: false, error: 'Not signed in' }, 401);
  let b; try { b = await request.json(); } catch (e) { return jsonR({ ok: false, error: 'Bad request' }, 400); }
  const id = String((b && b.id) || '');
  const status = String((b && b.status) || '');
  if (!LEAD_ID_RE.test(id) || ['new', 'replied', 'archived'].indexOf(status) < 0) return jsonR({ ok: false, error: 'Bad request' }, 400);
  const siteId = id.split(':')[1];
  const owned = (await leadsOwnerSites(env, s.email)).some(function (x) { return x.siteId === siteId; });
  if (!owned) return jsonR({ ok: false, error: 'Not your site' }, 403);
  const raw = await env.KV.get(id);
  if (!raw) return jsonR({ ok: false, error: 'Not found' }, 404);
  let o; try { o = JSON.parse(raw); } catch (e) { return jsonR({ ok: false, error: 'Not found' }, 404); }
  o.status = status;
  if (status === 'replied') o.repliedAt = Date.now();
  // Keep the original 120-day lifetime of the lead.
  const ttl = Math.max(86400, Math.floor(((o.ts || Date.now()) + 120 * 86400000 - Date.now()) / 1000));
  await env.KV.put(id, JSON.stringify(o), { expirationTtl: ttl });
  return jsonR({ ok: true, status: status });
}

const LEADS_PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Leads | Websprout</title><meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%232d7a3a'/><path d='M12 21V12' stroke='%23fff' stroke-width='2.3' stroke-linecap='round'/><path d='M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z' fill='%23fff'/><path d='M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z' fill='%23fff'/></svg>">
<style>
:root{color-scheme:dark;--bg:#0b120a;--card:#111b10;--line:rgba(255,255,255,.09);--fg:#eaf2e8;--mut:rgba(234,242,232,.62);--acc:#4ade80;--acc2:#2d7a3a}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
a{color:var(--acc)}
.top{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(11,18,10,.94);backdrop-filter:blur(8px);z-index:5}
.top .brand{display:flex;align-items:center;gap:9px;color:#fff;text-decoration:none;font-weight:800;letter-spacing:-.3px}
.top .brand i{width:26px;height:26px;border-radius:8px;background:linear-gradient(145deg,#3ea04e,#22692e);display:inline-flex;align-items:center;justify-content:center}
.top .sp{flex:1}
.top .who{color:var(--mut);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:45vw}
.wrap{max-width:860px;margin:0 auto;padding:22px 16px 60px}
h1{font-size:26px;margin:0 0 4px;letter-spacing:-.5px}
.sub{color:var(--mut);margin:0 0 18px;font-size:14px}
.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.tabs{display:flex;gap:4px;background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:10px;padding:3px}
.tab{background:none;border:0;color:var(--mut);padding:7px 12px;border-radius:7px;font-weight:600;font-size:13px;line-height:1;font-family:inherit;cursor:pointer}
.tab.on{background:var(--acc2);color:#fff}
.tab b{font-weight:700;margin-left:4px;opacity:.85}
select,input[type=search]{background:#141f13;color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:8px 11px;font-size:14px;line-height:1.2;font-family:inherit;min-height:36px}
select option{background:#1b1d21;color:#f2f2f4}
input[type=search]{flex:1;min-width:160px}
.lead{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 16px 14px;margin-bottom:12px}
.lead.new{border-color:rgba(74,222,128,.35)}
.lhead{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:8px}
.lname{font-weight:700;font-size:16px}
.chip{font-size:12px;color:var(--mut);border:1px solid var(--line);border-radius:999px;padding:2px 9px}
.chip.st-new{color:#0b120a;background:var(--acc);border-color:var(--acc);font-weight:700}
.chip.st-replied{color:var(--acc);border-color:rgba(74,222,128,.4)}
.when{color:var(--mut);font-size:13px;margin-left:auto}
.fields{display:grid;grid-template-columns:max-content 1fr;gap:4px 14px;font-size:14px;margin:6px 0 12px}
.fields dt{color:var(--mut);text-transform:capitalize}
.fields dd{margin:0;white-space:pre-wrap;word-break:break-word}
.acts{display:flex;gap:8px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.06);color:var(--fg);border:1px solid var(--line);border-radius:9px;padding:8px 12px;font-weight:600;font-size:13px;line-height:1;font-family:inherit;text-decoration:none;cursor:pointer}
.btn:hover,.btn:focus-visible{border-color:var(--acc)}
.btn.pri{background:var(--acc2);border-color:var(--acc2);color:#fff}
.btn.ghost{background:none}
.linkbtn{background:none;border:0;padding:0;color:var(--acc);font:inherit;text-decoration:underline;cursor:pointer}
.pick-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:20}
.pick{background:#121c11;border:1px solid var(--line);border-radius:16px;width:360px;max-width:100%;padding:10px;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.pick-h{font-size:13px;color:var(--mut);padding:8px 10px 10px}
.pick-o{display:flex;flex-direction:column;gap:2px;width:100%;text-align:left;background:none;border:1px solid transparent;border-radius:10px;padding:10px 12px;color:var(--fg);font-family:inherit;font-size:14px;cursor:pointer}
.pick-o span{font-size:12px;color:var(--mut)}
.pick-o:hover,.pick-o:focus-visible{background:rgba(255,255,255,.06);border-color:rgba(74,222,128,.4);outline:none}
.pick-copy{border-top:1px solid var(--line);border-radius:0 0 10px 10px;margin-top:4px}
.pick-rem{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mut);padding:10px 12px 6px;cursor:pointer}
@media(max-width:560px){.pick-ov{align-items:flex-end;padding:0}.pick{width:100%;border-radius:16px 16px 0 0;padding-bottom:18px}}
.empty{text-align:center;color:var(--mut);padding:50px 16px;border:1px dashed var(--line);border-radius:14px}
.gate{max-width:420px;margin:70px auto;text-align:center}
.msg{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#1d2a1b;border:1px solid var(--line);color:var(--fg);padding:10px 16px;border-radius:10px;font-size:14px;display:none;z-index:9}
@media(max-width:560px){.fields{grid-template-columns:1fr}.fields dt{margin-top:6px}.when{margin-left:0;width:100%}.top .who{display:none}}
</style></head><body>
<div class="top"><a class="brand" href="/"><i><svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></i>Websprout</a><span class="sp"></span><span class="who" id="who"></span><a class="btn ghost" href="/">Back to editor</a></div>
<div class="wrap" id="app"><p class="sub">Loading your leads&hellip;</p></div>
<div class="msg" id="msg" role="status" aria-live="polite"></div>
<script>
(function(){
  var app=document.getElementById('app'),D={leads:[],sites:[]},F={status:'new',site:'',q:''};
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
  function toast(t){var m=document.getElementById('msg');m.textContent=t;m.style.display='block';clearTimeout(m._t);m._t=setTimeout(function(){m.style.display='none';},2600);}
  function ago(ts){var s=Math.max(1,Math.round((Date.now()-ts)/1000));if(s<60)return 'just now';var m=Math.round(s/60);if(m<60)return m+' min ago';var h=Math.round(m/60);if(h<24)return h+' h ago';var d=Math.round(h/24);if(d<7)return d+' day'+(d>1?'s':'')+' ago';return new Date(ts).toLocaleDateString();}
  function first(n){return String(n||'').trim().split(' ')[0]||'';}
  function msgText(f){var keys=Object.keys(f||{});for(var i=0;i<keys.length;i++){if(/message|details|notes|comment|request|job|about/i.test(keys[i]))return String(f[keys[i]]);}return '';}
  function digits(p){var d=String(p||'').replace(/[^0-9+]/g,'');return d;}
  function draft(L){var c=L.contact,hi=first(c.name);var orig=msgText(L.fields);
    return {to:c.email,subject:'Re: your message to '+L.site,body:(hi?'Hi '+hi+',':'Hi,')+'\\n\\nThanks for reaching out to '+L.site+'. \\n\\n\\n'+L.site+(orig?'\\n\\n> '+orig.split('\\n').join('\\n> '):'')};}
  function mailto(L){var d=draft(L);return 'mailto:'+encodeURIComponent(d.to)+'?subject='+encodeURIComponent(d.subject)+'&body='+encodeURIComponent(d.body);}
  // Where "Reply by email" can open. Web services open a filled-in compose window in a new tab.
  var MAIL=[
    {id:'gmail',label:'Gmail',url:function(d){return 'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(d.to)+'&su='+encodeURIComponent(d.subject)+'&body='+encodeURIComponent(d.body);}},
    {id:'outlook',label:'Outlook.com',hint:'Hotmail, Live, Outlook.com',url:function(d){return 'https://outlook.live.com/mail/0/deeplink/compose?to='+encodeURIComponent(d.to)+'&subject='+encodeURIComponent(d.subject)+'&body='+encodeURIComponent(d.body);}},
    {id:'office',label:'Outlook for work or school',hint:'Microsoft 365',url:function(d){return 'https://outlook.office.com/mail/deeplink/compose?to='+encodeURIComponent(d.to)+'&subject='+encodeURIComponent(d.subject)+'&body='+encodeURIComponent(d.body);}},
    {id:'yahoo',label:'Yahoo Mail',url:function(d){return 'https://compose.mail.yahoo.com/?to='+encodeURIComponent(d.to)+'&subject='+encodeURIComponent(d.subject)+'&body='+encodeURIComponent(d.body);}},
    {id:'app',label:'Email app on this device',hint:'Mail, Outlook desktop, Apple Mail',app:true,url:function(d,L){return mailto(L);}}
  ];
  function pref(v){try{if(v===undefined)return localStorage.getItem('ws_mail_app')||'';if(v)localStorage.setItem('ws_mail_app',v);else localStorage.removeItem('ws_mail_app');}catch(e){}return '';}
  function svcById(id){for(var i=0;i<MAIL.length;i++)if(MAIL[i].id===id)return MAIL[i];return null;}
  function openWith(svc,L){var u=svc.url(draft(L),L);if(svc.app){location.href=u;}else{window.open(u,'_blank','noopener');}if(L.status==='new')setStatus(L,'replied',true);}
  function closePicker(){var o=document.getElementById('mailPick');if(o&&o.parentNode)o.parentNode.removeChild(o);document.removeEventListener('keydown',pickKey,true);}
  function pickKey(e){if(e.key==='Escape')closePicker();}
  function pickMail(L){
    closePicker();var last=pref();
    var ov=el('div','pick-ov');ov.id='mailPick';var box=el('div','pick');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Reply by email with');
    box.appendChild(el('div','pick-h','Reply to '+(L.contact.name||L.contact.email)+' with'));
    var rem=el('input');rem.type='checkbox';rem.id='pickRem';
    MAIL.forEach(function(svc){var b=el('button','pick-o');b.type='button';b.setAttribute('data-svc',svc.id);b.appendChild(el('b',null,svc.label));if(svc.hint)b.appendChild(el('span',null,svc.hint));
      b.addEventListener('click',function(){if(rem.checked)pref(svc.id);closePicker();openWith(svc,L);if(rem.checked)render();});box.appendChild(b);});
    var cp=el('button','pick-o pick-copy');cp.type='button';cp.appendChild(el('b',null,'Copy email address'));cp.appendChild(el('span',null,L.contact.email));
    cp.addEventListener('click',function(){try{navigator.clipboard.writeText(L.contact.email);toast('Email address copied');}catch(e){toast(L.contact.email);}closePicker();});box.appendChild(cp);
    var rl=el('label','pick-rem');rl.appendChild(rem);rl.appendChild(document.createTextNode(' Remember my choice'));box.appendChild(rl);
    ov.appendChild(box);ov.addEventListener('click',function(e){if(e.target===ov)closePicker();});document.body.appendChild(ov);document.addEventListener('keydown',pickKey,true);
    var f=box.querySelector('.pick-o');if(f)f.focus();}
  function replyEmail(L){var svc=svcById(pref());if(svc)openWith(svc,L);else pickMail(L);}
  function smsto(L){var hi=first(L.contact.name);return 'sms:'+digits(L.contact.phone)+'?&body='+encodeURIComponent((hi?'Hi '+hi+', ':'Hi, ')+'this is '+L.site+' replying to your message. ');}
  function setStatus(L,st,quiet){var prev=L.status;L.status=st;render();
    fetch('/api/leads/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:L.id,status:st})}).then(function(r){return r.json();}).then(function(j){if(!j.ok){L.status=prev;render();toast(j.error||'Could not save');}else if(!quiet){toast(st==='archived'?'Archived':st==='replied'?'Marked as replied':'Moved back to New');}}).catch(function(){L.status=prev;render();toast('Could not save');});}
  function counts(){var c={new:0,replied:0,archived:0,all:0};D.leads.forEach(function(L){if(F.site&&L.siteId!==F.site)return;c[L.status]=(c[L.status]||0)+1;c.all++;});return c;}
  function match(L){if(F.site&&L.siteId!==F.site)return false;if(F.status!=='all'&&L.status!==F.status)return false;if(F.q){var hay=(L.site+' '+JSON.stringify(L.fields)).toLowerCase();if(hay.indexOf(F.q.toLowerCase())<0)return false;}return true;}
  function card(L){
    var c=el('article','lead'+(L.status==='new'?' new':''));
    var h=el('div','lhead');h.appendChild(el('span','lname',L.contact.name||L.contact.email||L.contact.phone||'New lead'));
    h.appendChild(el('span','chip st-'+L.status,L.status==='new'?'New':L.status==='replied'?'Replied':'Archived'));
    if(D.sites.length>1)h.appendChild(el('span','chip',L.site));
    h.appendChild(el('span','when',ago(L.ts)));c.appendChild(h);
    var dl=el('dl','fields');Object.keys(L.fields).forEach(function(k){dl.appendChild(el('dt',null,k.replace(/[_-]+/g,' ')));dl.appendChild(el('dd',null,L.fields[k]));});c.appendChild(dl);
    var a=el('div','acts');
    if(L.contact.email){var m=el('button','btn pri','Reply by email');m.type='button';m.setAttribute('aria-haspopup','dialog');m.addEventListener('click',function(){replyEmail(L);});a.appendChild(m);}
    if(L.contact.phone){var s=el('a','btn'+(L.contact.email?'':' pri'),'Text');s.href=smsto(L);s.addEventListener('click',function(){if(L.status==='new')setStatus(L,'replied',true);});a.appendChild(s);
      var t=el('a','btn','Call');t.href='tel:'+digits(L.contact.phone);t.addEventListener('click',function(){if(L.status==='new')setStatus(L,'replied',true);});a.appendChild(t);}
    if(!L.contact.email&&!L.contact.phone)a.appendChild(el('span','chip','No email or phone given'));
    if(L.status!=='replied'){var r=el('button','btn ghost','Mark as replied');r.type='button';r.addEventListener('click',function(){setStatus(L,'replied');});a.appendChild(r);}
    if(L.status!=='new'){var n=el('button','btn ghost','Move to New');n.type='button';n.addEventListener('click',function(){setStatus(L,'new');});a.appendChild(n);}
    if(L.status!=='archived'){var x=el('button','btn ghost','Archive');x.type='button';x.addEventListener('click',function(){setStatus(L,'archived');});a.appendChild(x);}
    c.appendChild(a);return c;}
  function render(){
    app.innerHTML='';var cn=counts();
    app.appendChild(el('h1',null,'Leads'));
    app.appendChild(el('p','sub',cn.new?(cn.new+' new '+(cn.new===1?'lead':'leads')+' waiting for a reply. Replies open your own email app or phone, so customers see your real address and number.'):'Every message from your sites\\u2019 contact, booking and quote forms. Replies open your own email app or phone.'));
    var sv=svcById(pref());if(sv){var ch=el('p','sub');ch.appendChild(document.createTextNode('Email replies open in '+sv.label+'. '));var cl=el('button','linkbtn','Change email app');cl.type='button';cl.addEventListener('click',function(){pref('');render();toast('You will be asked next time');});ch.appendChild(cl);app.appendChild(ch);}
    var bar=el('div','bar');var tabs=el('div','tabs');tabs.setAttribute('role','tablist');
    [['new','New'],['replied','Replied'],['archived','Archived'],['all','All']].forEach(function(p){var b=el('button','tab'+(F.status===p[0]?' on':''),p[1]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',F.status===p[0]?'true':'false');var k=el('b',null,String(cn[p[0]]||0));b.appendChild(k);b.addEventListener('click',function(){F.status=p[0];render();});tabs.appendChild(b);});
    bar.appendChild(tabs);
    if(D.sites.length>1){var sel=el('select');sel.setAttribute('aria-label','Site');var o0=el('option',null,'All sites');o0.value='';sel.appendChild(o0);D.sites.forEach(function(s){var o=el('option',null,s.name);o.value=s.siteId;if(F.site===s.siteId)o.selected=true;sel.appendChild(o);});sel.addEventListener('change',function(){F.site=sel.value;render();});bar.appendChild(sel);}
    var q=el('input');q.type='search';q.placeholder='Search leads';q.setAttribute('aria-label','Search leads');q.value=F.q;q.addEventListener('input',function(){F.q=q.value;var pos=q.selectionStart;render();var nq=app.querySelector('input[type=search]');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}});bar.appendChild(q);
    app.appendChild(bar);
    var list=D.leads.filter(match);
    if(!D.sites.length){app.appendChild(el('div','empty','No sites on this account yet. Build and save a site, and its leads will show up here.'));return;}
    if(!list.length){app.appendChild(el('div','empty',F.status==='new'&&!F.q?'You are all caught up. New messages from your sites will appear here.':'Nothing here.'));return;}
    list.forEach(function(L){app.appendChild(card(L));});
  }
  fetch('/api/leads',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
    if(!j||!j.auth){app.innerHTML='';var g=el('div','gate');g.appendChild(el('h1',null,'Your leads'));g.appendChild(el('p','sub','Sign in to see messages from all your sites in one place.'));var a=el('a','btn pri','Sign in');a.href='/?signin=1';g.appendChild(a);app.appendChild(g);return;}
    D=j;document.getElementById('who').textContent=j.email||'';if(!j.leads.some(function(L){return L.status==='new';})&&j.leads.length)F.status='all';render();
  }).catch(function(){app.innerHTML='';app.appendChild(el('div','empty','Could not load your leads. Refresh to try again.'));});
})();
</script></body></html>`;
