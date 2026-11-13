export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runWeeklyDigest(env));
    ctx.waitUntil(runNudges(env, false));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    const _host = url.hostname.toLowerCase();
    const _appHosts = ['websprout.app','www.websprout.app'];
    if (url.pathname === '/checkout' && request.method === 'GET') return doCheckout(request, env);
    if (url.pathname === '/cart-checkout' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/cart-checkout' && request.method === 'POST') { const _cr = await doCartCheckout(request, env); const _ch = new Headers(_cr.headers); _ch.set('Access-Control-Allow-Origin', '*'); return new Response(_cr.body, { status: _cr.status, headers: _ch }); }
    if (request.method === 'GET' && _appHosts.indexOf(_host) === -1 && _host.indexOf('.workers.dev') === -1 && _host.indexOf('localhost') === -1 && !url.pathname.startsWith('/api/')) {
      if (_host.endsWith('.websprout.app')) {
        const _sub = _host.slice(0, _host.length - '.websprout.app'.length);
        if (_sub && _sub.indexOf('.') === -1) {
          const _r = await servePublished(_sub, env, url.pathname);
          return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      } else if (env.KV) {
        const _mapped = await env.KV.get('domain:' + _host);
        if (_mapped) { const _r = await servePublished(_mapped, env, url.pathname); if (_r) return _r; }
      }
    }
    if (url.pathname === '/create' && request.method === 'POST') return doCreate(request, env);
    if (url.pathname === '/example' && request.method === 'GET') return doExample(request, env);
    if (url.pathname === '/api/photos' && request.method === 'GET') return doPhotoSearch(request, env);
    if (url.pathname === '/api/place' && request.method === 'GET') return doPlace(request, env);
    if (url.pathname === '/api/place/find' && request.method === 'GET') return doPlaceFind(request, env);
    if (url.pathname === '/api/photos/use' && request.method === 'POST') return doPhotoUse(request, env);
    if (url.pathname === '/ws-engine.js') return new Response(wsEngineJs(), { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/products') return doProducts(request, env);
    if (url.pathname === '/store-preview') return doStorePreview(request, env);
    if (url.pathname === '/api/post' && request.method === 'POST') return doWritePost(request, env);
    if (url.pathname === '/api/invoice' && request.method === 'POST') return doInvoice(request, env);
    if (url.pathname === '/connect/start' && request.method === 'GET') return doConnectStart(request, env);
    if (url.pathname === '/connect/return' && request.method === 'GET') return doConnectReturn(request, env);
    if (url.pathname === '/track' && request.method === 'POST') return doTrack(request, env);
    if (url.pathname === '/send-email' && request.method === 'POST') return doSendEmail(request, env);
    if (url.pathname === '/stats' && request.method === 'GET') return doStats(request, env);
    if (url.pathname === '/preview' && request.method === 'GET') return doPreviewShare(request, env);
    if (url.pathname === '/preview' && request.method === 'POST') return doSavePreview(request, env);
    if (url.pathname === '/render' && request.method === 'POST') return doRender(request);
    if (url.pathname.startsWith('/api/form/')) {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doFormSubmit(request, env, decodeURIComponent(url.pathname.slice(10)));
    }
    if (url.pathname === '/api/review') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doReviewSubmit(request, env);
    }
    if (url.pathname === '/api/reviews' && request.method === 'GET') return doReviewsGet(new URL(request.url), env);
    if (url.pathname === '/api/clientlog') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doClientLog(request, env);
    }
    if (url.pathname === '/inbox') return new Response(INBOX_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/reviews' && request.method === 'GET') return doReviewsPage(request, env);
    if (url.pathname === '/api/reviews/manage') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'GET' || request.method === 'POST') return doReviewsManage(request, env);
    }
    if (url.pathname === '/publish' && request.method === 'POST') return doPublish(request, env);
    if (url.pathname === '/unpublish' && request.method === 'POST') return doUnpublish(request, env);
    if (url.pathname === '/slug-check' && request.method === 'GET') return doSlugCheck(request, env);
    if (url.pathname === '/support' && request.method === 'POST') return doSupport(request, env);
    if (url.pathname === '/admin' && request.method === 'GET') return doAdminPage(request, env);
    if (url.pathname === '/admin/data' && request.method === 'GET') return doAdminData(request, env);
    if (url.pathname === '/admin/activity' && request.method === 'GET') return doAdminActivity(request, env);
    if (url.pathname === '/admin/nudge' && request.method === 'GET' && ['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') > -1) return doAdminNudge(request, env);
    if (url.pathname === '/email-optout' && request.method === 'GET') return doEmailOptout(request, env);
    // State-changing admin links: refuse requests triggered from another page (e.g. an <img> on a published *.websprout.app site)
    if ((url.pathname === '/admin/grant' || url.pathname === '/admin/feature' || url.pathname === '/admin/nudge') && ['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') === -1) return new Response('Forbidden', { status: 403 });
    if (url.pathname === '/admin/grant') return doAdminGrant(request, env);
    if (url.pathname === '/admin/feature') return doAdminFeature(request, env);
    if (url.pathname === '/showcase') return doShowcasePage(request, env);
    if (url.pathname === '/showcase/data') return doShowcaseData(env);
    if (url.pathname === '/dev' && request.method === 'GET') return doDevPage(request, env);
    if (url.pathname === '/dev/data' && request.method === 'GET') return doDevData(request, env);
    if (url.pathname === '/auth/google' && request.method === 'GET') return doGoogleStart(request, env);
    if (url.pathname === '/auth/google/callback' && request.method === 'GET') return doGoogleCallback(request, env);
    if (url.pathname === '/auth/email' && request.method === 'POST') return doEmailStart(request, env);
    if (url.pathname === '/auth/verify' && request.method === 'GET') return doVerifyPage(request, env);
    if (url.pathname === '/auth/verify' && request.method === 'POST') return doVerify(request, env);
    if (url.pathname === '/me' && request.method === 'GET') return doMe(request, env);
    if (url.pathname === '/auth/logout') return doLogout(request, env);
    if (url.pathname === '/save' && request.method === 'POST') return doSave(request, env);
    if (url.pathname === '/load' && request.method === 'GET') return doLoad(request, env);
    if (url.pathname === '/versions' && request.method === 'GET') return doVersions(request, env);
    if (url.pathname === '/my-sites' && request.method === 'GET') return doMySites(request, env);
    if (url.pathname === '/account/export' && request.method === 'GET') return doAccountExport(request, env);
    if (url.pathname === '/account/billing-portal' && request.method === 'POST') return doBillingPortal(request, env);
    if (url.pathname === '/account/delete' && request.method === 'POST') return doAccountDelete(request, env);
    if (url.pathname === '/my-sites/claim' && request.method === 'POST') return doMySitesClaim(request, env);
    if (url.pathname === '/my-sites/delete' && request.method === 'POST') return doMySitesDelete(request, env);
    if (url.pathname === '/api/hit' && request.method === 'POST') return doHit(request, env);
    if (url.pathname === '/api/hit' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/api/views' && request.method === 'GET') return doViews(request, env);
    // Published sites served under the app origin run sandboxed (unique origin), so a site's scripts can never use the visitor's WebSprout session.
    if (url.pathname.startsWith('/s/')) { const _parts = url.pathname.slice(3).split('/'); const _sl = slugify(_parts[0]); const _pg = _parts.slice(1).join('/'); const _r = await servePublished(_sl, env, _pg); if (_r) { _r.headers.set('Content-Security-Policy', 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads'); return _r; } return new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/api/domain-check' && request.method === 'GET') return doDomainCheck(request, env);
    if (url.pathname === '/api/connect-domain' && request.method === 'POST') return doConnectDomain(request, env);
    if (url.pathname === '/api/inbox' && request.method === 'GET') return doInboxData(request, env);
    if (url.pathname === '/api/inbox/notify' && request.method === 'POST') return doInboxNotify(request, env);
    if (url.pathname === '/api/inbox/clear' && request.method === 'POST') return doInboxClear(request, env);
    if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') return doStripeWebhook(request, env);
    if (url.pathname === '/success') return new Response(SUCCESS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/terms') return new Response(TERMS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/privacy') return new Response(PRIVACY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/accessibility') return new Response(ACCESSIBILITY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/deploy-guide') return new Response(DEPLOY_GUIDE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/sitemap.xml') return new Response(SITEMAP, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if ((url.pathname === '/for' || url.pathname === '/for/') && request.method === 'GET') return new Response(renderNicheIndex(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    if (url.pathname.startsWith('/for/') && request.method === 'GET') { const _nk = url.pathname.slice(5).replace(/\/+$/,''); const _n = NICHES.find(function(x){ return x.slug === _nk; }); if (_n) return new Response(renderNichePage(_n), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }); return new Response(pubPage404(), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/og.svg') return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/og.png') { try { const _b = Uint8Array.from(atob(OG_PNG_B64), function(c){ return c.charCodeAt(0); }); return new Response(_b, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } }); } catch(e) { return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } }); } }
    if (url.pathname === '/robots.txt') return new Response(ROBOTS, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    let _html = PAGE;
    // Stripe subscription link comes from an env var so it persists across code updates
    // (a hardcoded link in the file would be overwritten every time worker.js is redeployed).
    const _sub = (env.STRIPE_SUB_LINK || env.SUB_LINK || '').trim();
    if (_sub) _html = _html.split(SUB_LINK).join(_sub);
    try { const _sg = await getSitesGrown(env); if (_sg && _sg > 0) _html = _html.split('id="liveCount">&mdash;<').join('id="liveCount">' + fmtThousands(_sg) + '<'); } catch (e) {}
    return new Response(_html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
  }
};


// Collect every configured Gemini key (supports GEMINI_API_KEY, _2.._8, and a
// comma-separated GEMINI_API_KEYS), de-dupe, and shuffle so load spreads evenly
// across keys instead of always hammering the first one. Keys on SEPARATE Google
// projects each carry their own free-tier quota, so more keys = more headroom.
function geminiKeys(env) {
  const set = [];
  const add = (v) => { if (v && typeof v === 'string') v.split(',').forEach(k => { k = k.trim(); if (k && set.indexOf(k) === -1) set.push(k); }); };
  add(env.GEMINI_API_KEY);
  add(env.GEMINI_API_KEY2); add(env.GEMINI_API_KEY_2);
  add(env.GEMINI_API_KEY3); add(env.GEMINI_API_KEY4); add(env.GEMINI_API_KEY5);
  add(env.GEMINI_API_KEY6); add(env.GEMINI_API_KEY7); add(env.GEMINI_API_KEY8);
  add(env.GEMINI_API_KEYS);
  for (let i = set.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = set[i]; set[i] = set[j]; set[j] = t; }
  return set;
}

async function doRender(request) {
  try {
    const form = await request.formData();
    const html = form.get('html') || '';
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals'
      }
    });
  } catch(e) {
    return new Response('<h2>Error</h2>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}

function succeed(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
function fail(msg) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}
