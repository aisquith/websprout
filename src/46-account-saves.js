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
      if(obj.mode!=='subscription') return new Response('{"received":true}', { headers:{ 'Content-Type':'application/json' } });
      const email=(obj.client_reference_id||obj.customer_email||(obj.customer_details&&obj.customer_details.email)||'').toLowerCase();
      if(email) await setUserPlan(env, email, 'pro', cust, obj.subscription||'');
    } else if((ev.type==='invoice.paid'||ev.type==='invoice.payment_succeeded') && obj.subscription){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'pro', cust, obj.subscription||'');
    } else if(ev.type==='customer.subscription.deleted'){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'free', cust, '');
    } else if(ev.type==='customer.subscription.updated'){
      const st=obj.status||''; const em=cust?await env.KV.get('stripecust:'+cust):'';
      if(em) await setUserPlan(env, em, (st==='active'||st==='trialing'||st==='past_due')?'pro':'free', cust, obj.id||'');
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
    if (b.site && typeof b.site === 'object' && Array.isArray(b.site.sections)) { try { const _sj = JSON.stringify(b.site); if (_sj.length <= 6*1024*1024) _dft.site = b.site; } catch(e){} }
    else { try { const _prev = JSON.parse((await env.KV.get('draft:' + b.siteId)) || 'null'); if (_prev && _prev.site && !('site' in b)) _dft.site = _prev.site; } catch(e){} }
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
  // Stop billing first: cancel any Stripe subscription and unlink the customer so later webhooks can't recreate the account.
  try{
    const _u = JSON.parse((await gt('user:'+eml)) || '{}');
    const _sk = (env.STRIPE_SECRET_KEY||'').trim();
    if(_u.stripeSub && _sk){
      const _cr = await fetch('https://api.stripe.com/v1/subscriptions/'+encodeURIComponent(_u.stripeSub), { method:'DELETE', headers:{ 'Authorization':'Bearer '+_sk } });
      if(!_cr.ok && _cr.status !== 404){ return fail('We could not cancel your subscription automatically. Please cancel it in Billing first, or email support@websprout.app.'); }
    }
    if(_u.stripeCustomer) await del('stripecust:'+_u.stripeCustomer);
  }catch(e){}
  let _domKeys=[]; try{ _domKeys = await kvAllKeys(env, 'domain:', 10); }catch(e){}
  let list=[]; try{ list = JSON.parse((await gt('usersites:'+em)) || (await gt('usersites:'+eml)) || '[]'); }catch(e){}
  let n=0;
  for(const it of list){
    const sid = it && it.siteId; if(!sid) continue;
    const slug = await gt('slugof:'+sid);
    if(slug){
      try{ const paths=JSON.parse((await gt('pubpages:'+slug))||'[]'); for(const p of paths){ await del('pub:'+slug+':'+p); } }catch(e){}
      await del('pub:'+slug); await del('pubpages:'+slug); await del('pubmeta:'+slug); await del('slugof:'+sid); await del('featured:'+slug);
      for(const _dk of _domKeys){ try{ if((await gt(_dk.name))===slug) await del(_dk.name); }catch(e){} }
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
function pageNavBrief(pages, currentPath){
  var links = pages.map(function(pg){ return (pg.path===''?'/':'/'+pg.path)+' ('+pg.title+')'; }).join(', ');
  var cur=''; for (var i=0;i<pages.length;i++){ if(pages[i].path===(currentPath||'')){ cur=pages[i].title; break; } }
  return 'PAGES & NAV: this site has these pages and the nav bar MUST link to all of them with these EXACT hrefs: ' + links + '. Use real anchor hrefs (e.g. href="/about", href="/" for home) for cross-page links, NOT in-page #anchors. Mark the current page (' + (cur||'Home') + ') as the active nav item. The mobile menu must contain the same links.';
}

var PAGE_GEN_PROMPT = 'You are building ONE additional page of an existing multi-page website. You are given the complete HTML of the site home page as your design reference. Build the requested page so it clearly belongs to the SAME website.\n\nNON-NEGOTIABLE CONSISTENCY RULES:\n- Reuse the EXACT same <head>: the same fonts and Google Fonts links, the same full CSS style block (so colors, typography, spacing and components match precisely), and the same meta and viewport tags.\n- Reuse the EXACT same top nav bar and the same footer markup and styling as the home page, so they are identical across pages (only the active nav item changes).\n- Match the same color system, button shapes, corner radii, shadows and overall design personality. The new page must be visually indistinguishable in style from the home page.\n- Build BRAND-NEW main content between the nav and the footer that fits THIS page purpose. Do not copy the home page body content.\n- Output ONE complete standalone HTML document (from <!DOCTYPE html> through </html>) with everything inline, because it is served on its own URL.';

var PAGE_GEN_RULES = 'CRITICAL RULES (same standards as the rest of the site):\n1. CONTRAST: every text element must be readable against its exact background - white or near-white text on dark, dark text on light, never dark-on-dark or light-on-light.\n2. Do NOT use vh or viewport-height units for section heights - use px or %. You MAY use clamp() with vw for responsive font-size.\n3. Entrance and scroll-reveal animations must always animate from hidden TO fully visible - nothing stays hidden. Keep transitions under 0.8s.\n4. NO horizontal overflow: set box-sizing:border-box globally, never let anything be wider than the viewport, and wrap long text. Never use white-space:nowrap on multi-word text.\n5. Every button and link must do something real. Cross-page nav uses real hrefs like href="/about". In-page links may use #ids that exist on THIS page. The primary call to action points to the contact or shop page.\n6. If you include a hamburger or mobile menu, hide it on desktop and wire it with a few lines of JS to toggle a real menu of the page links.\n7. Keep the page tight and focused - roughly 250-450 lines. ALWAYS finish through </body></html>. A shorter complete page beats a long or truncated one.';
