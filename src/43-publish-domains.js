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
  html = wsFixCss(html);
  try{var _ne=html.indexOf('</nav>'),_he=html.indexOf('</header>'),_bd=-1;if(_ne>=0)_bd=_ne+6;if(_he>=0&&_he+9>_bd)_bd=_he+9;if(_bd>0&&html.slice(0,_bd).indexOf('<!--WS_PRODUCTS-->')>-1){html=html.slice(0,_bd).split('<!--WS_PRODUCTS-->').join('')+html.slice(_bd);if(html.indexOf('<!--WS_PRODUCTS-->')<0){var _ps='<section id="shop" style="padding:64px 24px"><div style="max-width:1100px;margin:0 auto"><h2 style="text-align:center;margin:0 0 28px;font-size:2rem">Shop</h2><!--WS_PRODUCTS--></div></section>';var _pbi=html.lastIndexOf('</body>');html=_pbi>-1?(html.slice(0,_pbi)+_ps+html.slice(_pbi)):(html+_ps);}}}catch(e){}
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
    if (existing){ let _eo = null; try { _eo = JSON.parse(existing).siteId; } catch(e){} if (_eo !== b.siteId) return fail('That name is already taken — try another'); }
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
        if (/\sdata-sa-check\b/i.test(attrs)) return m;
        let a = attrs;
        if (/\saction\s*=/i.test(a)) a = a.replace(/\saction\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, ' action="' + formAction + '"');
        else a = ' action="' + formAction + '"' + a;
        if (!/\smethod\s*=/i.test(a)) a = a + ' method="POST"';
        return '<form' + a + '>';
      });
      const formJS = "<scr"+"ipt>(function(){var EP=" + JSON.stringify(formAction) + ";function r(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}r(function(){var fs=document.getElementsByTagName('form');Array.prototype.slice.call(fs).forEach(function(f){if(f.hasAttribute('data-wsform')||f.hasAttribute('data-sa-check'))return;f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('[type=submit],button');var o=b?b.textContent:'';if(b){b.disabled=true;b.textContent='Sending\u2026';}fetch(EP,{method:'POST',body:new FormData(f)}).then(d).catch(d);function d(){var n=document.createElement('div');n.textContent='\u2713 Thanks! Your message was sent \u2014 we\u2019ll be in touch soon.';n.setAttribute('style','padding:15px 18px;margin-top:14px;background:#16a34a;color:#fff;border-radius:10px;font-weight:700;font-family:inherit;text-align:center');f.reset();if(b){b.disabled=false;b.textContent=o;}f.parentNode.insertBefore(n,f.nextSibling);setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},9000);}});});});})();</scr"+"ipt>";
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
      // The editor bakes in whichever page the owner was viewing; the published home must open on Home.
      if (!_pp) _h = _h.replace(/window\.__wsInitPath=("(?:[^"\\]|\\.)*");/g, function(m, v){ return v === '""' ? m : 'window.__wsInitPath="";'; });
      await env.KV.put(_pp ? ('pub:' + slug + ':' + _pp) : ('pub:' + slug), prep(_h));
      if (_paths.indexOf(_pp)===-1) _paths.push(_pp);
    }
    // Drop sub-pages from a previous publish that are no longer present.
    try { var _oldIdx = await env.KV.get('pubpages:' + slug); if (_oldIdx){ var _old = JSON.parse(_oldIdx); if (Array.isArray(_old)){ for (var _j=0;_j<_old.length;_j++){ var _op=_old[_j]; if (_op && _paths.indexOf(_op)===-1) { try { await env.KV.delete('pub:' + slug + ':' + _op); } catch(e){} } } } } } catch(e){}
    // Multi-page sites get an index; single-page sites have none (preserves legacy serving).
    if (_paths.length > 1) await env.KV.put('pubpages:' + slug, JSON.stringify(_paths));
    else { try { await env.KV.delete('pubpages:' + slug); } catch(e){} }
    await env.KV.put('pubmeta:' + slug, JSON.stringify({ siteId: b.siteId, updated: Date.now(), nobadge: _pro, pages: _paths }));
    // Structured shops: keep the published products (name, price) server-side so checkout charges these prices,
    // never whatever a visitor's browser sends.
    try {
      if (b.site && typeof b.site === 'object') {
        const _prods = [];
        const _secs = [].concat.apply([], (Array.isArray(b.site.pages) ? b.site.pages : []).map(function(p){ return (p && p.sections) || []; })).concat(Array.isArray(b.site.sections) ? b.site.sections : []);
        const _seen = new Set();
        _secs.forEach(function(s){ if (s && s.type === 'products' && Array.isArray(s.items) && !_seen.has(s.id)) { _seen.add(s.id); s.items.forEach(function(it){ if (it && it.name && _prods.length < 200) _prods.push({ name: String(it.name).slice(0, 120), price: String(it.price || '').slice(0, 40), desc: String(it.desc || '').slice(0, 200) }); }); } });
        if (_prods.length) await env.KV.put('v3products:' + b.siteId, JSON.stringify(_prods)); else await env.KV.delete('v3products:' + b.siteId);
      }
    } catch(e){}
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
    b.slug = slugify(b.slug);
    const m = await env.KV.get('pubmeta:' + b.slug);
    if (!m) return fail('That site is not published');
    let _owner = ''; try { _owner = JSON.parse(m).siteId; } catch(e){}
    if (_owner !== b.siteId) return fail('Not your site');
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
    if (host.indexOf('.') === -1 || !/^[a-z0-9.-]+$/.test(host) || /(^|\.)websprout\.app$/.test(host)) return fail('Enter a valid domain');
    const _cur = await env.KV.get('domain:' + host);
    if (_cur && _cur !== b.slug) { let _co = ''; try { _co = JSON.parse((await env.KV.get('pubmeta:' + _cur)) || '{}').siteId || ''; } catch(e){} if (_co && _co !== b.siteId) return fail('That domain is already connected to another WebSprout site. Contact support if it is yours.'); }
    await env.KV.put('domain:' + host, b.slug);
    await env.KV.put('domain:www.' + host, b.slug);
    return succeed({ ok:true, host: host });
  } catch(e){ return fail(e.message); }
}
