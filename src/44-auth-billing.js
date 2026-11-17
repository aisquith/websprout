// ───────────────────────────────────────────────────────────
// ACCOUNTS — Google OAuth + passwordless email links + sessions
// ───────────────────────────────────────────────────────────
const SITE_ORIGIN = 'https://websprout.app';
// The session cookie is __Host- prefixed: Secure, Path=/, no Domain, so a customer's *.websprout.app site can neither
// read it nor plant/overwrite one (cookie tossing). Session and sign-in tokens are stored in KV only as SHA-256 hashes.
const SESS_COOKIE = '__Host-ws_sess';
const SESS_TTL = 60*60*24*30;
function randToken(n){ n=n||24; const a=new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a).map(function(b){return ('0'+b.toString(16)).slice(-2);}).join(''); }
async function sha256hex(s){ const d=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s))); return Array.from(new Uint8Array(d)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join(''); }
function parseCookies(request){ const h=request.headers.get('Cookie')||''; const o={}; h.split(';').forEach(function(p){ const i=p.indexOf('='); if(i>-1){ let v=p.slice(i+1).trim(); try{ v=decodeURIComponent(v); }catch(e){} o[p.slice(0,i).trim()]=v; } }); return o; }
// Every value sent for one cookie name (a planted duplicate shows up as a second value).
function cookieValues(request, name){ const h=request.headers.get('Cookie')||''; const out=[]; h.split(';').forEach(function(p){ const i=p.indexOf('='); if(i>-1 && p.slice(0,i).trim()===name){ let v=p.slice(i+1).trim(); try{ v=decodeURIComponent(v); }catch(e){} out.push(v); } }); return out; }
function sessionCookie(token){ return SESS_COOKIE+'='+token+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age='+SESS_TTL; }
function clearCookie(name){ return name+'=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'; }
// Clears the session cookie and both forms of the old ws_sess cookie (host-only, and one planted for the whole domain).
function clearSessionCookies(){ return [clearCookie(SESS_COOKIE), clearCookie('ws_sess'), 'ws_sess=; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=websprout.app; Max-Age=0']; }
function jwtPayload(jwt){ try{ const p=jwt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'); const pad=p.length%4?'='.repeat(4-p.length%4):''; return JSON.parse(decodeURIComponent(escape(atob(p+pad)))); }catch(e){ return null; } }
// New tokens: 64 hex, stored as sess:<sha256>. Old tokens (48 hex) were stored in plain and are honoured until they expire.
async function mintSession(email, env){ const t=randToken(32); const now=Date.now(); await env.KV.put('sess:'+(await sha256hex(t)), JSON.stringify({ email:email, created:now, exp:now+SESS_TTL*1000 }), { expirationTtl:SESS_TTL }); return t; }
const _wsLegacySess = new WeakMap();
async function wsSessRecord(env, key){ const v=await env.KV.get(key); if(!v) return null; try{ const s=JSON.parse(v); if(!s||!s.email||(s.exp&&s.exp<Date.now())) return null; return s; }catch(e){ return null; } }
async function wsSessLookup(env, t){
  if(/^[a-f0-9]{64}$/.test(t)) return wsSessRecord(env, 'sess:'+(await sha256hex(t)));
  if(/^[a-f0-9]{48}$/.test(t)) return wsSessRecord(env, 'sess:'+t);
  return null;
}
async function getSession(request, env){
  if(!env.KV) return null;
  const hv=cookieValues(request, SESS_COOKIE);
  // More than one session cookie means one was planted: treat the request as signed out.
  if(hv.length>1) return null;
  let s=null;
  if(hv.length===1) s=await wsSessLookup(env, hv[0]);
  else {
    // Migration: an old ws_sess cookie is honoured only alone, only for an old-format (pre-__Host-) session, and only on a
    // request from websprout.app itself or a typed/bookmarked visit. The router then re-issues it as __Host-ws_sess.
    const lv=cookieValues(request, 'ws_sess'); const sfs=request.headers.get('sec-fetch-site')||'';
    if(lv.length!==1 || (sfs!=='same-origin' && sfs!=='none') || !/^[a-f0-9]{48}$/.test(lv[0])) return null;
    s=await wsSessRecord(env, 'sess:'+lv[0]); if(s) _wsLegacySess.set(request, lv[0]);
  }
  if(!s) return null;
  try{ const rv=parseInt((await env.KV.get('sessrevoke:'+String(s.email).toLowerCase()))||'0',10)||0; if(rv && (s.created || ((s.exp||0)-SESS_TTL*1000)) <= rv) return null; }catch(e){}
  return s;
}
// Account deletion: every session of this account created up to now stops working.
async function wsRevokeSessions(env, email){ try{ await env.KV.put('sessrevoke:'+String(email).toLowerCase(), String(Date.now()), { expirationTtl: SESS_TTL + 86400 }); }catch(e){} }
async function wsDropSessionCookie(request, env){
  for(const t of cookieValues(request, SESS_COOKIE).concat(cookieValues(request, 'ws_sess'))){
    if(/^[a-f0-9]{64}$/.test(t)) await env.KV.delete('sess:'+(await sha256hex(t)));
    else if(/^[a-f0-9]{48}$/.test(t)) await env.KV.delete('sess:'+t);
  }
}
// Client IP for rate limits. Test servers (WS_TEST_MODE) may name one so tests can exercise limits independently.
function wsClientIp(request, env){ return ((env && env.WS_TEST_MODE === '1') && request.headers.get('x-ws-test-ip')) || request.headers.get('cf-connecting-ip') || '0'; }
// Fixed-window counter: true while under max; counts this hit.
async function wsRate(env, key, max, ttl){
  if(!env || !env.KV) return true;
  try{ const n=parseInt((await env.KV.get(key))||'0',10)||0; if(n>=max) return false; await env.KV.put(key, String(n+1), { expirationTtl: Math.max(60, ttl) }); }catch(e){}
  return true;
}
async function getUserOrCreate(email, name, env){ const k='user:'+email.toLowerCase(); const v=await env.KV.get(k); if(v){ try{ return JSON.parse(v); }catch(e){} } const u={ email:email.toLowerCase(), name:name||'', created:Date.now(), plan:'free' }; await env.KV.put(k, JSON.stringify(u)); Object.defineProperty(u, 'isNew', { value:true }); return u; }

async function doGoogleStart(request, env){
  if(!env.GOOGLE_CLIENT_ID) return new Response('Google sign-in is not configured yet.', { status:503 });
  const state=randToken(16);
  const u='https://accounts.google.com/o/oauth2/v2/auth?client_id='+encodeURIComponent(env.GOOGLE_CLIENT_ID)
    +'&redirect_uri='+encodeURIComponent(SITE_ORIGIN+'/auth/google/callback')
    +'&response_type=code&scope='+encodeURIComponent('openid email profile')+'&state='+state+'&access_type=online&prompt=select_account';
  const h=new Headers(); h.append('Location',u); h.append('Set-Cookie','__Host-ws_ostate='+state+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600');
  return new Response(null, { status:302, headers:h });
}
async function doGoogleCallback(request, env){
  try{
    const url=new URL(request.url);
    const code=url.searchParams.get('code'), state=url.searchParams.get('state');
    const _st=cookieValues(request, '__Host-ws_ostate');
    if(!code||!state||_st.length!==1||!wsSafeEq(state, _st[0])) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const body=new URLSearchParams({ code:code, client_id:env.GOOGLE_CLIENT_ID, client_secret:env.GOOGLE_CLIENT_SECRET, redirect_uri:SITE_ORIGIN+'/auth/google/callback', grant_type:'authorization_code' });
    const r=await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body.toString() });
    const tok=await r.json();
    if(!tok.id_token) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const p=jwtPayload(tok.id_token);
    if(!p||!p.email||p.email_verified!==true) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const _gu=await getUserOrCreate(p.email, p.name||'', env);
    const t=await mintSession(p.email, env);
    try{ await logEvent(request, env, _gu.isNew ? 'signup' : 'login', { email: p.email, props:{ via:'google' } }); }catch(e){}
    const h=new Headers(); h.append('Location',SITE_ORIGIN+'/?login=ok'); h.append('Set-Cookie',sessionCookie(t)); h.append('Set-Cookie',clearCookie('__Host-ws_ostate'));
    return new Response(null, { status:302, headers:h });
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?login=error',302); }
}
async function doEmailStart(request, env){
  try{
    if(!env.KV) return fail('Not configured');
    if(!env.RESEND_API_KEY && env.WS_TEST_MODE!=='1') return fail('Email sign-in is not configured yet');
    const b=await request.json();
    const email=String(b.email||'').trim().toLowerCase();
    if(!email||email.indexOf('@')<1||email.indexOf('.')<0) return fail('Enter a valid email');
    if(email.length>160||/[\s<>"',;:()\[\]\\]/.test(email)) return fail('Enter a valid email');
    // Sign-in mail bombing: per address 3 per 15 minutes and 10 a day; per IP 10 per 15 minutes and 30 a day.
    { const _ip=wsClientIp(request, env), _d=new Date().toISOString().slice(0,10);
      const _ok=(await wsRate(env, 'mlrate:em:'+email, 3, 900)) && (await wsRate(env, 'mlrate:emd:'+_d+':'+email, 10, 86400)) && (await wsRate(env, 'mlrate:ip:'+_ip, 10, 900)) && (await wsRate(env, 'mlrate:ipd:'+_d+':'+_ip, 30, 86400));
      if(!_ok) return fail('Too many sign-in emails. Please wait a few minutes and try again.'); }
    if(!(await wsMailCapOk(env, 'signin'))) return fail('Sign-in email is busy right now. Please try again later.');
    const t=randToken(20);
    await env.KV.put('magic:'+(await sha256hex(t)), JSON.stringify({ email:email, exp:Date.now()+1000*60*15 }), { expirationTtl:60*15 });
    const link=SITE_ORIGIN+'/auth/verify?token='+t;
    const html='<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:460px;margin:0 auto;padding:24px"><div style="font-size:22px;font-weight:800;color:#2d7a3a;margin-bottom:8px">🌱 Sign in to Websprout</div><p style="color:#444;line-height:1.6">Click the button below to sign in. This link works once and expires in 15 minutes.</p><p style="margin:24px 0"><a href="'+link+'" style="background:#2d7a3a;color:#fff;padding:13px 26px;border-radius:9px;text-decoration:none;font-weight:700;display:inline-block">Sign in to Websprout</a></p><p style="color:#999;font-size:12px">If you didn\'t request this, you can safely ignore this email.</p></div>';
    await wsSendMail(env, { from:'Websprout <hello@websprout.app>', to:[email], subject:'Your Websprout sign-in link', html:html });
    return succeed({ ok:true });
  }catch(e){ return wsErr(e); }
}
// Opening the emailed link (GET) only shows a "Sign in" button; pressing it (POST) uses the one-time token.
// Email security scanners open links but do not submit forms, so they can no longer burn the link.
// Sign-in tokens are stored hashed (magic:<sha256>); a link minted before that change is still found by its plain key.
async function wsMagicGet(env, t){
  if(!/^[a-f0-9]{16,80}$/.test(t)) return null;
  const h=await sha256hex(t);
  if(await env.KV.get('mused:'+h)) return null;
  let k='magic:'+h, v=await env.KV.get(k);
  if(!v){ k='magic:'+t; v=await env.KV.get(k); }
  return v ? { k:k, v:v, h:h } : null;
}
async function doVerifyPage(request, env){
  const t=new URL(request.url).searchParams.get('token')||'';
  if(!/^[a-f0-9]{16,80}$/.test(t)||!env.KV) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
  const _mg=await wsMagicGet(env, t); const v=_mg&&_mg.v;
  if(!v) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
  let m={}; try{ m=JSON.parse(v); }catch(e){}
  if(!m.exp||m.exp<Date.now()) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
  const em=String(m.email||'').replace(/[<>&"]/g,'');
  const html='<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Sign in to Websprout</title>'
    +'<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#060d05;color:#eaf2e8;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding:20px}'
    +'.c{max-width:380px;width:100%;background:#0f1a0d;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:30px 26px;text-align:center}'
    +'h1{font-size:22px;margin:0 0 6px}p{color:rgba(234,242,232,.7);margin:0 0 22px;font-size:14px}'
    +'button{width:100%;background:#2f9e4f;color:#fff;border:0;border-radius:10px;padding:14px;font:700 15px/1 inherit;cursor:pointer}button:hover{background:#38b25b}</style></head>'
    +'<body><form class="c" method="POST" action="/auth/verify"><div style="font-size:30px">&#127793;</div><h1>Sign in to Websprout</h1><p>'+(em?'Continue as <b style="color:#fff">'+em+'</b>':'Continue to your account')+'</p>'
    +'<input type="hidden" name="token" value="'+t+'"><button type="submit">Sign in</button></form></body></html>';
  return new Response(html, { headers:{ 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer', 'X-Frame-Options':'DENY' } });
}
async function doVerify(request, env){
  try{
    // Login CSRF: the sign-in form must be submitted from websprout.app itself (a missing or "null" Origin is refused).
    const _o=request.headers.get('origin')||'', _sf=request.headers.get('sec-fetch-site')||'';
    if(!wsIsAppOrigin(_o, new URL(request.url)) && _sf!=='same-origin') return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    let t='';
    try{ const fd=await request.formData(); t=String(fd.get('token')||''); }catch(e){}
    if(!t||!env.KV) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const _mg=await wsMagicGet(env, t);
    if(!_mg) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    // Single use: mark it used first (checked before any lookup), then delete it.
    await env.KV.put('mused:'+_mg.h, '1', { expirationTtl: 3600 });
    const m=JSON.parse(_mg.v); await env.KV.delete(_mg.k);
    if(m.exp<Date.now()) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    const _eu=await getUserOrCreate(m.email, '', env);
    const st=await mintSession(m.email, env);
    try{ await logEvent(request, env, _eu.isNew ? 'signup' : 'login', { email: m.email, props:{ via:'email' } }); }catch(e){}
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
  try{ if(env.KV) await wsDropSessionCookie(request, env); }catch(e){}
  const h=new Headers({ 'Content-Type':'application/json', 'Cache-Control':'no-store' }); clearSessionCookies().forEach(function(c){ h.append('Set-Cookie', c); });
  return new Response(JSON.stringify({ ok:true }), { headers:h });
}
// Pro checkout for the SIGNED-IN account. The Stripe client_reference_id is an opaque one-time reference stored here
// (proref:<ref> -> account email); the webhook resolves the account only from it, never from an email typed at checkout.
// With STRIPE_PRO_PRICE set, a Checkout Session is created through the API; otherwise the existing Payment Link is used
// (same price) with the reference attached.
async function doBillingCheckout(request, env){
  const s=await getSession(request, env);
  if(!s||!s.email) return new Response(JSON.stringify({ error:'Please sign in first.' }), { status:401, headers:{ 'Content-Type':'application/json' } });
  if(!env.KV) return fail('Billing is not set up yet.');
  const em=String(s.email).toLowerCase();
  let u={}; try{ u=JSON.parse((await env.KV.get('user:'+em))||'{}'); }catch(e){}
  if(u.plan==='pro') return succeed({ pro:true });
  if(!(await wsRate(env, 'prorate:'+em, 20, 3600))) return fail('Too many attempts. Please try again later.');
  const ref='wsp_'+randToken(16);
  await env.KV.put('proref:'+ref, em, { expirationTtl: 30*86400 });
  const sk=(env.STRIPE_SECRET_KEY||'').trim(), price=(env.STRIPE_PRO_PRICE||'').trim();
  if(sk && price){
    try{
      let body='mode=subscription&line_items[0][price]='+encodeURIComponent(price)+'&line_items[0][quantity]=1&client_reference_id='+ref+'&metadata[ws_ref]='+ref+'&subscription_data[metadata][ws_ref]='+ref
        +'&success_url='+encodeURIComponent(SITE_ORIGIN+'/?sub=success')+'&cancel_url='+encodeURIComponent(SITE_ORIGIN+'/');
      body += u.stripeCustomer ? '&customer='+encodeURIComponent(u.stripeCustomer) : '&customer_email='+encodeURIComponent(em);
      // The advertised 7-day free trial (first subscription only; Checkout ignores trials set on the Price).
      if(!u.stripeCustomer && !u.trialUsed) body += '&subscription_data[trial_period_days]=7&payment_method_collection=always';
      const r=await fetch('https://api.stripe.com/v1/checkout/sessions', { method:'POST', headers:{ 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' }, body:body });
      const j=await r.json();
      if(r.ok && j && j.url) return succeed({ url:j.url });
      console.error('pro checkout session failed', (j && j.error && j.error.message) || r.status);
    }catch(e){ console.error('pro checkout session failed', (e && e.message) || e); }
    return fail('Could not start checkout. Please try again.');
  }
  const link=(env.STRIPE_SUB_LINK||env.SUB_LINK||SUB_LINK||'').trim();
  if(!/^https:\/\//.test(link)||link.indexOf('PASTE_YOUR')>-1) return fail('Payments are not set up yet.');
  return succeed({ url: link+(link.indexOf('?')>-1?'&':'?')+'client_reference_id='+ref+'&prefilled_email='+encodeURIComponent(em) });
}

// ── Stripe subscription: signature-verified webhook + account entitlement ──
async function verifyStripeSig(rawBody, sigHeader, secret){
  try{
    if(!sigHeader||!secret) return false;
    let t=''; const v1s=[];
    sigHeader.split(',').forEach(function(p){ const i=p.indexOf('='); if(i<0) return; const k=p.slice(0,i).trim(), val=p.slice(i+1).trim(); if(k==='t')t=val; if(k==='v1')v1s.push(val); });
    if(!t||!v1s.length) return false;
    if(Math.abs(Date.now()/1000 - parseInt(t,10)) > 300) return false;
    const enc=new TextEncoder();
    const key=await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
    const sig=await crypto.subtle.sign('HMAC', key, enc.encode(t+'.'+rawBody));
    const hex=Array.from(new Uint8Array(sig)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    // Stripe may send several v1 signatures (e.g. while a secret is being rolled): any one matching is enough.
    let ok=false; for(const v1 of v1s){ if(wsSafeEq(hex, v1)) ok=true; }
    return ok;
  }catch(e){ return false; }
}
async function setUserPlan(env, email, plan, cust, sub){
  if(!email) return;
  const k='user:'+email.toLowerCase();
  let u={}; try{ u=JSON.parse(await env.KV.get(k)||'{}'); }catch(e){}
  if(!u.email) u.email=email.toLowerCase();
  const _wasPro = u.plan==='pro';
  u.plan=plan;
  // Distinguish a real paying customer (came in with a Stripe customer) from a comped/gifted account
  u.proSource = (plan==='pro') ? ((cust || u.stripeCustomer) ? 'paid' : 'comp') : '';
  if(cust){
    // Never silently move an account to a different Stripe customer, or a customer to a different account: log the conflict.
    const _mapped=await env.KV.get('stripecust:'+cust);
    if(_mapped && _mapped!==email.toLowerCase()){ console.warn('stripe customer conflict', cust); try{ await env.KV.put('stripeconflict:'+email.toLowerCase(), JSON.stringify({ ts:Date.now(), customer:cust, mappedTo:_mapped }), { expirationTtl:90*86400 }); }catch(e){} }
    else if(!_mapped) await env.KV.put('stripecust:'+cust, email.toLowerCase());
    if(u.stripeCustomer && u.stripeCustomer!==cust){ console.warn('stripe customer conflict', email.toLowerCase()); u.stripeConflict=cust; try{ await env.KV.put('stripeconflict:'+email.toLowerCase(), JSON.stringify({ ts:Date.now(), customer:cust, kept:u.stripeCustomer }), { expirationTtl:90*86400 }); }catch(e){} }
    else u.stripeCustomer=cust;
  }
  if(sub!==undefined&&sub!=='') u.stripeSub=sub;
  u.planUpdated=Date.now();
  await env.KV.put(k, JSON.stringify(u));
  // Pro features on published sites follow the plan: losing Pro brings the badge back and points custom domains at the
  // free address; getting Pro back restores both (the domain setup is kept, so nothing needs reconnecting).
  if(_wasPro !== (plan==='pro')){ try{ await wsPlanSites(env, email, plan==='pro'); }catch(e){ try{ console.error('plan sites', (e && e.message) || e); }catch(_){} } }
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
    if(!(await wsMailCapOk(env, 'support'))) return fail('Support email is busy right now. Please email support@websprout.app directly.');
    const esc = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
    const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6">'
      + '<h2 style="margin:0 0 6px">New support message</h2>'
      + '<p style="margin:0 0 4px"><b>From:</b> ' + esc(name||'(no name)') + ' &lt;' + esc(email) + '&gt;</p>'
      + '<hr style="border:none;border-top:1px solid #eee;margin:12px 0">'
      + '<p style="white-space:pre-wrap;margin:0">' + esc(message) + '</p></div>';
    const r = await wsResend(env, {
      method:'POST',
      headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ from:'Websprout Support <hello@websprout.app>', to:[SUPPORT_INBOX], reply_to: email, subject:'🛟 Support: '+(name||email), html: html })
    });
    if(!r.ok) return fail('Could not send right now — please try again');
    await wsMailCount(env, 'support');
    // Instant reply to the sender (acknowledgment, plus an AI answer when our help facts cover it), after the response.
    await wsBg(request, wsSupportAutoReply(env, { to: email, name: name, subject: '', message: message }).then(function(r){
      if (env.KV) return env.KV.put('supportlog:' + Date.now() + ':' + Math.random().toString(36).slice(2, 6), JSON.stringify({ via: 'form', to: email, sent: r.sent, ai: !!r.answer, person: !!r.person, skip: r.skip || '' }), { expirationTtl: 30 * 86400 });
    }));
    return succeed({ ok:true });
  }catch(e){ return fail('Could not send'); }
}