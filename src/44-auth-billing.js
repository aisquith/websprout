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
    if(!p||!p.email||p.email_verified===false||p.email_verified==='false') return Response.redirect(SITE_ORIGIN+'/?login=error',302);
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
    { const _ip=request.headers.get('cf-connecting-ip')||'0'; const _ki='mlrate:ip:'+_ip, _ke='mlrate:em:'+email;
      const _ni=parseInt((await env.KV.get(_ki))||'0',10)||0, _ne=parseInt((await env.KV.get(_ke))||'0',10)||0;
      if(_ni>=10||_ne>=5) return fail('Too many sign-in emails. Please wait a few minutes and try again.');
      await env.KV.put(_ki,String(_ni+1),{expirationTtl:900}); await env.KV.put(_ke,String(_ne+1),{expirationTtl:900}); }
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
  return succeed({ auth:true, email:s.email, name:(u&&u.name)||'', plan:(u&&u.plan)||'free', pro:!!(u&&u.plan==='pro'), owner:_owner, connectReady:!!(u&&u.stripeConnectReady), connectStarted:!!(u&&u.stripeConnect) });
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
    if(Math.abs(Date.now()/1000 - parseInt(t,10)) > 300) return false;
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
      body: JSON.stringify({ from:'Websprout Support <hello@websprout.app>', to:[SUPPORT_INBOX], reply_to: email, subject:'🛟 Support: '+(name||email), html: html })
    });
    if(!r.ok) return fail('Could not send right now — please try again');
    return succeed({ ok:true });
  }catch(e){ return fail('Could not send'); }
}