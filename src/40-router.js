// The editor script (about 220 KB) is served as its own long-cached file instead of being inlined into
// every page view. It stays a normal blocking <script src> in the same spot, so run order is unchanged.
const _ED_MARK = '<script>/*WS_EDITOR_JS*/';
const _edA = PAGE.indexOf(_ED_MARK);
const _edB = _edA > -1 ? PAGE.indexOf('</script>', _edA) : -1;
const EDITOR_JS = (_edA > -1 && _edB > -1) ? PAGE.slice(_edA + _ED_MARK.length, _edB) : '';
const PAGE_SHELL = EDITOR_JS ? PAGE.slice(0, _edA) + '<script src="/app/editor.js?v=__WS_EDV__"></script>' + PAGE.slice(_edB + 9) : PAGE;
function wsHash(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
const EDITOR_VER = wsHash(EDITOR_JS);
function editorVersion(sub){ return EDITOR_VER + (sub ? '-' + wsHash(sub) : ''); }

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runWeeklyDigest(env));
    ctx.waitUntil(runNudges(env, false));
    ctx.waitUntil(runErrorAlert(env));
    ctx.waitUntil(runAnalyticsDaily(env));
  },
  // Mail to support@ / hello@websprout.app (Cloudflare Email Routing -> "Send to a Worker"): forwarded to a person, plus an instant reply.
  async email(message, env, ctx) {
    await wsHandleEmail(message, env);
  },
  async fetch(request, env, ctx) {
    if (ctx) _wsCtx.set(request, ctx);
    const url = new URL(request.url);
    const _host = wsHostOf(request, env, url);
    let res;
    try { res = await wsRoute(request, env, url, _host); }
    catch (e) { try { console.error((e && e.stack) || e); } catch(_){} res = new Response(JSON.stringify({ error: (e && e.wsNoSecret) ? 'Server is not configured' : 'Something went wrong' }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
    return wsFinish(request, url, _host, res);
  }
};

// The local test server cannot route by Host header; tests (which set WS_TEST_MODE) name the host explicitly.
function wsHostOf(request, env, url){ return (((env && env.WS_TEST_MODE === '1') && request.headers.get('x-ws-test-host')) || url.hostname).toLowerCase(); }
// Hosts that serve the app itself (everything else is a customer's published site or custom domain).
function wsIsAppHost(h){ return h === 'websprout.app' || h === 'www.websprout.app' || h === 'localhost' || h === '127.0.0.1' || /\.workers\.dev$/.test(h); }
function wsAppOrigins(url){ const o = [SITE_ORIGIN, 'https://www.websprout.app']; const h = url.hostname; if (h === 'localhost' || h === '127.0.0.1' || /\.workers\.dev$/.test(h)) o.push(url.origin); return o; }
// The local dev/test server (wrangler dev serves plain http, production never does) also trusts a loopback origin.
function wsIsAppOrigin(o, url){ return wsAppOrigins(url).indexOf(o) > -1 || (url.protocol === 'http:' && (o === url.origin || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(o))); }
// Was this request made by websprout.app itself (or typed/bookmarked)? Customer sites on *.websprout.app are same-SITE
// (cookies flow with SameSite=Lax), so this checks the exact origin. Requests with neither header come from non-browser
// clients, which carry no victim's cookies.
function wsSameOrigin(request, url){
  const f = request.headers.get('sec-fetch-site');
  if (f) return f === 'same-origin' || f === 'none';
  const o = request.headers.get('origin');
  if (o) return wsIsAppOrigin(o, url);
  return true;
}
// CSRF exemptions: the ONLY state-changing endpoints other origins (published sites, Stripe) may call. Each is
// unauthenticated by design (no session or key is honoured from the cookie jar), rate-limited, and validated itself.
const WS_CROSS_ORIGIN_POST = {
  '/api/review': 1,          // review widget on published sites (42 reviewScript) -> stored as "pending" for the owner
  '/cart-checkout': 1,       // shop cart on published sites (47 cartInjection, engine shop; relative URL on site hosts)
  '/api/hit': 1,             // published-site view counter (42 formScript, no-cors beacon)
  '/api/clientlog': 1,       // published-site JS error reports (43 doPublish errJS)
  '/api/stripe/webhook': 1,  // Stripe's servers (signature-verified, 46)
  '/api/resend/webhook': 1,  // Resend's servers: bounces/complaints (Svix-signature-verified, 41)
  '/email-optout': 1         // one-click unsubscribe POST from mail apps (RFC 8058; HMAC token in the URL, 45)
};
function wsCrossOriginOk(p){ return WS_CROSS_ORIGIN_POST[p] === 1 || p.indexOf('/api/form/') === 0; } // + /api/form/<site>: published-site contact forms
// Endpoints that legitimately post a non-JSON body (they do their own checks): the sign-in form and the sandboxed renderer.
const WS_FORM_POST = { '/auth/verify': 1, '/render': 1, '/email-optout': 1, '/api/resend/webhook': 1 };
// Security headers on every response, framing rules on the app's own pages, and the one-time upgrade of an old
// ws_sess cookie to __Host-ws_sess (see getSession).
function wsFinish(request, url, host, res){
  if (!res || res.status === 101) return res;
  let r; try { r = new Response(res.body, res); } catch(e) { return res; }
  const h = r.headers, p = url.pathname, ct = h.get('content-type') || '';
  h.set('X-Content-Type-Options', 'nosniff');
  if (!h.has('Referrer-Policy')) h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!wsIsAppHost(host)) return r;
  h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Clickjacking: the app's pages may not be framed. Framed on purpose: /example (landing page), share previews, the
  // sandboxed renderer, the store preview and /s/ published pages.
  const framable = p === '/example' || p === '/preview' || p === '/render' || p === '/store-preview' || p.indexOf('/s/') === 0;
  if (ct.indexOf('text/html') > -1 && !framable) { if (!h.has('Content-Security-Policy')) h.set('Content-Security-Policy', "frame-ancestors 'none'"); h.set('X-Frame-Options', 'DENY'); }
  if (ct.indexOf('application/json') > -1 && !h.has('Cache-Control')) h.set('Cache-Control', 'no-store');
  const lt = _wsLegacySess.get(request);
  if (lt && (h.get('set-cookie') || '').indexOf(SESS_COOKIE + '=') < 0) { h.append('Set-Cookie', sessionCookie(lt)); clearSessionCookies().slice(1).forEach(function(c){ h.append('Set-Cookie', c); }); }
  return r;
}

async function wsRoute(request, env, url, _host) {
    const _appHosts = ['websprout.app','www.websprout.app'];
    const _m = request.method;
    // ── CSRF gate for every state-changing request (one place, before any handler runs) ──
    if (_m === 'POST' || _m === 'PUT' || _m === 'PATCH' || _m === 'DELETE') {
      if (!wsCrossOriginOk(url.pathname)) {
        // Customer sites and custom domains only ever reach the exempt endpoints above.
        if (!wsIsAppHost(_host) || !wsSameOrigin(request, url)) return new Response('Forbidden', { status: 403 });
        const _ct = (request.headers.get('content-type') || '').toLowerCase();
        if (_ct && !WS_FORM_POST[url.pathname] && _ct.indexOf('application/json') !== 0) return new Response(JSON.stringify({ error: 'Send JSON' }), { status: 415, headers: { 'Content-Type': 'application/json' } });
      }
    }
    // Sign-out is a GET in the app: refuse it when triggered by another page (an <img> on a published site).
    if (url.pathname === '/auth/logout' && !wsSameOrigin(request, url)) return new Response('Forbidden', { status: 403 });
    // Test-only routes exist only on a test server: WS_TEST_MODE (never set in production) AND a local wrangler dev request
    // (plain http, no Cloudflare edge client IP). Every request through Cloudflare's edge carries cf-connecting-ip.
    // Local wrangler dev (Miniflare) fills cf-connecting-ip with the loopback address; the edge always sends the real client IP.
    const _testIp = request.headers.get('cf-connecting-ip');
    const _testOk = env.WS_TEST_MODE === '1' && url.protocol === 'http:' && (!_testIp || _testIp === '127.0.0.1' || _testIp === '::1');
    if (url.pathname === '/checkout' && request.method === 'GET') return doCheckout(request, env);
    if (url.pathname === '/cart-checkout' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/cart-checkout' && request.method === 'POST') { const _cr = await doCartCheckout(request, env); const _ch = new Headers(_cr.headers); _ch.set('Access-Control-Allow-Origin', '*'); return new Response(_cr.body, { status: _cr.status, headers: _ch }); }
    if (request.method === 'GET' && _appHosts.indexOf(_host) === -1 && _host.indexOf('.workers.dev') === -1 && _host.indexOf('localhost') === -1 && !url.pathname.startsWith('/api/')) {
      if (_host.endsWith('.websprout.app')) {
        const _sub = _host.slice(0, _host.length - '.websprout.app'.length);
        if (_sub && _sub.indexOf('.') === -1) {
          if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') { const _m = await servePublishedMeta(_sub, env, url.pathname, 'https://' + _host); if (_m) return _m; }
          const _r = await servePublished(_sub, env, url.pathname, { base: '/', origin: 'https://' + _host });
          return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      } else if (env.KV) {
        const _mapped = await env.KV.get('domain:' + _host);
        if (_mapped) {
          // Custom domains are a Pro feature: when the owner's Pro has ended, send visitors to the free address instead.
          let _off = false; try { _off = !!(JSON.parse((await env.KV.get('pubmeta:' + _mapped)) || '{}').proOff); } catch(e){}
          if (_off) return Response.redirect('https://' + _mapped + '.websprout.app' + url.pathname + url.search, 302);
          if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') { const _m = await servePublishedMeta(_mapped, env, url.pathname, 'https://' + _host); if (_m) return _m; }
          const _r = await servePublished(_mapped, env, url.pathname, { base: '/', origin: 'https://' + _host }); if (_r) return _r;
        }
      }
    }
    if (request.method === 'GET' && (_appHosts.indexOf(_host) > -1 || _host.indexOf('localhost') > -1 || _host.indexOf('127.0.0.1') > -1 || _host.indexOf('.workers.dev') > -1)) wsMaybeLanding(request, env, url);
    if (url.pathname === '/create' && request.method === 'POST') return doCreate(request, env);
    if (url.pathname === '/example' && request.method === 'GET') return doExample(request, env);
    if (url.pathname === '/api/photos' && request.method === 'GET') { if (env.UNSPLASH_ACCESS_KEY) wsCount(env, 'unsplash', wsHour(), request); return doPhotoSearch(request, env); }
    if ((url.pathname === '/api/place' || url.pathname === '/api/place/find' || url.pathname === '/api/place/details') && request.method === 'GET' && env.GOOGLE_PLACES_KEY) wsCount(env, 'places', url.pathname.slice(11) || 'reviews', request);
    // Setup's service chips (read-only): the app's own pages only, never another site or a customer host.
    if (url.pathname === '/api/suggest' && request.method === 'GET') { if (!wsIsAppHost(_host) || !wsSameOrigin(request, url)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } }); return doSuggest(request, env); }
    if (url.pathname === '/api/place' && request.method === 'GET') return doPlace(request, env);
    if (url.pathname === '/api/place/find' && request.method === 'GET') return doPlaceFind(request, env);
    if (url.pathname === '/api/place/details' && request.method === 'GET') return doPlaceDetails(request, env);
    if (url.pathname === '/api/place-photo' && request.method === 'GET') return doPlacePhoto(request, env);
    if (url.pathname === '/api/photos/use' && request.method === 'POST') { if (env.UNSPLASH_ACCESS_KEY) wsCount(env, 'unsplash', wsHour(), request); return doPhotoUse(request, env); }
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
    if (url.pathname === '/render' && request.method === 'POST') return doRender(request, env);
    if (url.pathname.startsWith('/api/form/')) {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doFormSubmit(request, env, decodeURIComponent(url.pathname.slice(10)));
    }
    if (url.pathname === '/api/review') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return wsAfter(request, env, 'review', doReviewSubmit);
    }
    if (url.pathname === '/api/reviews' && request.method === 'GET') return doReviewsGet(new URL(request.url), env);
    if (url.pathname === '/api/clientlog') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doClientLog(request, env);
    }
    if (url.pathname === '/inbox') return new Response(INBOX_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/leads') return new Response(LEADS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    if (url.pathname === '/api/leads' && request.method === 'GET') return doLeadsData(request, env);
    if (url.pathname === '/api/leads/status' && request.method === 'POST') { if (['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') === -1) return new Response('Forbidden', { status: 403 }); return doLeadsUpdate(request, env); }
    if (url.pathname === '/reviews' && request.method === 'GET') return doReviewsPage(request, env);
    if (url.pathname === '/api/reviews/manage') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'GET' || request.method === 'POST') return doReviewsManage(request, env);
    }
    if (url.pathname === '/publish' && request.method === 'POST') return wsAfter(request, env, 'publish', doPublish);
    if (url.pathname === '/unpublish' && request.method === 'POST') return wsAfter(request, env, 'unpublish', doUnpublish);
    if (url.pathname === '/slug-check' && request.method === 'GET') return doSlugCheck(request, env);
    if (url.pathname === '/support' && request.method === 'POST') return doSupport(request, env);
    if (url.pathname === '/admin' && request.method === 'GET') return doAdminPage(request, env);
    if (url.pathname === '/admin/data' && request.method === 'GET') return doAdminData(request, env);
    if (url.pathname === '/admin/funnel' && request.method === 'GET') return doAdminFunnel(request, env);
    if (url.pathname === '/admin/analytics' && request.method === 'GET') return doAdminAnalytics(request, env);
    if (url.pathname === '/admin/customer' && request.method === 'GET') return doAdminCustomer(request, env);
    if (url.pathname === '/admin/activity' && request.method === 'GET') return doAdminActivity(request, env);
    if (url.pathname === '/admin/nudge' && request.method === 'GET' && ['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') > -1) return doAdminNudge(request, env);
    if (url.pathname === '/email-optout' && (request.method === 'GET' || request.method === 'POST')) return doEmailOptout(request, env);
    // State-changing admin links: refuse requests triggered from another page (e.g. an <img> on a published *.websprout.app site)
    if ((url.pathname === '/admin/grant' || url.pathname === '/admin/feature' || url.pathname === '/admin/nudge') && ['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') === -1) return new Response('Forbidden', { status: 403 });
    if (url.pathname === '/admin/grant') return doAdminGrant(request, env);
    if (url.pathname === '/admin/errors/clear' && request.method === 'POST') { if (['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') === -1) return new Response('Forbidden', { status: 403 }); return doAdminErrorsClear(request, env); }
    if (url.pathname === '/admin/feature') return doAdminFeature(request, env);
    if (url.pathname === '/api/resend/webhook' && request.method === 'POST') return doResendWebhook(request, env);
    if (url.pathname === '/report' && request.method === 'GET') return doReportPage(request, env);
    if (url.pathname === '/report' && request.method === 'POST') return doReportSubmit(request, env);
    if (url.pathname === '/admin/moderation' && request.method === 'GET') return doAdminModeration(request, env);
    if ((url.pathname === '/admin/moderation/scan' || url.pathname === '/admin/moderation/dismiss' || url.pathname === '/admin/takedown') && request.method === 'POST') {
      if (['same-origin', 'none', ''].indexOf(request.headers.get('sec-fetch-site') || '') === -1) return new Response('Forbidden', { status: 403 });
      if (url.pathname === '/admin/takedown') return doAdminTakedown(request, env);
      if (url.pathname === '/admin/moderation/scan') return doAdminModScan(request, env);
      return doAdminModDismiss(request, env);
    }
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
    if (url.pathname === '/billing/checkout' && request.method === 'POST') return doBillingCheckout(request, env);
    if (url.pathname === '/account/delete' && request.method === 'POST') return doAccountDelete(request, env);
    if (url.pathname === '/my-sites/claim' && request.method === 'POST') return doMySitesClaim(request, env);
    if (url.pathname === '/my-sites/delete' && request.method === 'POST') return doMySitesDelete(request, env);
    if (url.pathname === '/api/hit' && request.method === 'POST') return doHit(request, env);
    if (url.pathname === '/api/hit' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/api/views' && request.method === 'GET') return doViews(request, env);
    // Published sites served under the app origin run sandboxed (unique origin), so a site's scripts can never use the visitor's WebSprout session.
    if (url.pathname.startsWith('/s/')) { const _parts = url.pathname.slice(3).split('/'); const _sl = slugify(_parts[0]); const _pg = _parts.slice(1).join('/'); const _r = await servePublished(_sl, env, _pg, { base: '/s/' + _sl + '/', origin: 'https://' + _sl + '.websprout.app' }); if (_r) { _r.headers.set('Content-Security-Policy', 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads'); return _r; } return new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/api/domain-check' && request.method === 'GET') return doDomainCheck(request, env);
    if (url.pathname === '/api/connect-domain' && request.method === 'POST') return wsAfter(request, env, 'domain_connected', doConnectDomain);
    if (url.pathname === '/api/inbox' && request.method === 'GET') return doInboxData(request, env);
    if (url.pathname === '/api/inbox/notify' && request.method === 'POST') return doInboxNotify(request, env);
    if (url.pathname === '/api/inbox/autoreply' && request.method === 'POST') return doInboxAutoReply(request, env);
    // Test servers only: read back mail that wsSendMail recorded instead of sending.
    if (url.pathname === '/__test/mail' && _testOk && env.KV) return new Response((await env.KV.get('testmail:' + (url.searchParams.get('to') || '').toLowerCase())) || 'null', { headers: { 'Content-Type': 'application/json' } });
    // Test servers only: seed analytics rows and run the daily analytics job (retention) on demand.
    if (url.pathname === '/__test/analytics' && _testOk && request.method === 'POST') return doTestAnalytics(request, env);
    if (url.pathname === '/api/inbox/clear' && request.method === 'POST') return doInboxClear(request, env);
    if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') return doStripeWebhook(request, env);
    if (url.pathname === '/success') return new Response(SUCCESS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/terms') return new Response(TERMS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/privacy-choices' && typeof PRIVACY_CHOICES_PAGE === 'string') return new Response(PRIVACY_CHOICES_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    if (url.pathname === '/privacy') return new Response(wsAdsOn(env) ? wsPrivacyWithAds(PRIVACY_PAGE) : PRIVACY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/accessibility') return new Response(ACCESSIBILITY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/deploy-guide') return new Response(DEPLOY_GUIDE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/sitemap.xml') return new Response(SITEMAP, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if ((url.pathname === '/for' || url.pathname === '/for/') && request.method === 'GET') return new Response(renderNicheIndex(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    if (url.pathname.startsWith('/for/') && request.method === 'GET') { const _nk = url.pathname.slice(5).replace(/\/+$/,''); const _n = NICHES.find(function(x){ return x.slug === _nk; }); if (_n) return new Response(renderNichePage(_n), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }); return new Response(pubPage404(), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/og.svg') return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/og.png') { try { const _b = Uint8Array.from(atob(OG_PNG_B64), function(c){ return c.charCodeAt(0); }); return new Response(_b, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } }); } catch(e) { return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } }); } }
    if (url.pathname === '/app/editor.js') {
      const _s0 = (env.STRIPE_SUB_LINK || env.SUB_LINK || '').trim();
      const _js = _s0 ? EDITOR_JS.split(SUB_LINK).join(_s0) : EDITOR_JS;
      const _cur = url.searchParams.get('v') === editorVersion(_s0);
      return new Response(_js, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': _cur ? 'public, max-age=31536000, immutable' : 'no-cache' } });
    }
    if (url.pathname === '/robots.txt') return new Response(ROBOTS, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    let _html = PAGE_SHELL;
    // Stripe subscription link comes from an env var so it persists across code updates
    // (a hardcoded link in the file would be overwritten every time worker.js is redeployed).
    const _sub = (env.STRIPE_SUB_LINK || env.SUB_LINK || '').trim();
    if (_sub) _html = _html.split(SUB_LINK).join(_sub);
    _html = _html.split('__WS_EDV__').join(editorVersion(_sub));
    if (env.GOOGLE_PLACES_KEY) _html = _html.split('id="gFillWrap" hidden').join('id="gFillWrap"');
    { const _ads = wsAdsAllowed(request) ? wsAdsTags(env) : ''; if (_ads) _html = _html.replace('</head>', _ads + '</head>'); }
    try { const _sg = await getSitesGrown(env); if (_sg && _sg > 0) _html = _html.split('id="liveCount">&mdash;<').join('id="liveCount">' + fmtThousands(_sg) + '<'); } catch (e) {}
    return new Response(_html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
}


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

async function doRender(request, env) {
  try {
    // User HTML on our origin: signed-in users only, bounded size, always sandboxed.
    const sess = await getSession(request, env);
    if (!sess || !sess.email) return new Response('Please sign in', { status: 401, headers: { 'Content-Type': 'text/plain' } });
    if ((parseInt(request.headers.get('content-length') || '0', 10) || 0) > WS_MAX_HTML_BODY) return new Response('Too large', { status: 413, headers: { 'Content-Type': 'text/plain' } });
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

// Runs a handler, then (after the response) logs the event only if it succeeded. The request body is read from a clone.
async function wsAfter(request, env, type, handler){
  const pc = request.clone();
  const res = await handler(request, env);
  if (res.status !== 200) return res;
  const rc = res.clone();
  wsBg(request, (async function(){
    let j = {}, b = {}; try { j = await rc.json(); } catch(e){} try { b = await pc.json(); } catch(e){}
    if (!j || j.error || j.ok === false) return;
    if (type === 'domain_connected' && !j.verified) return;
    const s = await getSession(request, env).catch(function(){ return null; });
    const props = {};
    if (type === 'publish') { props.slug = String(j.slug || '').slice(0, 63); props.pages = Array.isArray(j.pages) ? j.pages.length : 1; if (b.launch && typeof b.launch === 'object') { props.issues = Math.max(0, Math.min(99, parseInt(b.launch.issues, 10) || 0)); } }
    if (type === 'domain_connected') props.host = String(j.host || '').slice(0, 80);
    await logEvent(request, env, type, { email: s && s.email, site: b.siteId || b.site || '', anon: type === 'review', props: props });
  })());
  return res;
}
async function doTestAnalytics(request, env){
  if (env.WS_TEST_MODE !== '1') return new Response('Not found', { status: 404 });
  const b = await request.json().catch(function(){ return {}; });
  const db = await wsDb(env); if (!db) return succeed({ ok:false, error:'no DB' });
  if (b.cron) return succeed({ ok:true, result: await runAnalyticsDaily(env, b.cron.now || Date.now()) });
  if (b.query) { const r = await db.prepare(String(b.query.sql)).bind(...(b.query.args || [])).all(); return succeed({ ok:true, rows: r.results || [] }); }
  const ins = function(table, row){ const k = Object.keys(row).filter(function(x){ return /^[a-z_]+$/.test(x); }); return db.prepare('INSERT OR REPLACE INTO ' + table + ' (' + k.join(', ') + ') VALUES (' + k.map(function(){ return '?'; }).join(', ') + ')').bind(...k.map(function(x){ return row[x]; })); };
  const st = []; ['events', 'sites', 'activity', 'daily'].forEach(function(tb){ (b[tb] || []).forEach(function(row){ st.push(ins(tb, row)); }); });
  for (let i = 0; i < st.length; i += 50) await db.batch(st.slice(i, i + 50));
  return succeed({ ok:true, inserted: st.length });
}

// Ad conversion tracking on websprout.app itself (never on customers' published sites). Each part turns on only when
// its setting exists in Cloudflare:
//   GOOGLE_TAG_ID             AW-123456789 (Google Ads) or G-XXXXXXX (Google Analytics 4)
//   GOOGLE_ADS_PUBLISH_LABEL  AW-123456789/AbCdEf  conversion: someone published their first site
//   GOOGLE_ADS_TRIAL_LABEL    AW-123456789/GhIjKl  conversion: someone started the Pro trial
//   META_PIXEL_ID             1234567890           Meta (Facebook/Instagram) Pixel: Lead on publish, StartTrial on Pro
function wsAdsCfg(env){
  const g = String((env && env.GOOGLE_TAG_ID) || '').trim(), m = String((env && env.META_PIXEL_ID) || '').trim();
  const lab = function(v){ v = String(v || '').trim(); return /^AW-\d{5,15}\/[A-Za-z0-9_-]{4,40}$/.test(v) ? v : ''; };
  return { g: /^(AW-\d{5,15}|G-[A-Z0-9]{4,15})$/.test(g) ? g : '', meta: /^\d{8,20}$/.test(m) ? m : '', pub: lab(env && env.GOOGLE_ADS_PUBLISH_LABEL), trial: lab(env && env.GOOGLE_ADS_TRIAL_LABEL) };
}
// Ad tags load only for visitors in the US (no consent banner needed there), and never when the browser sends Global
// Privacy Control or the visitor opted out at /privacy-choices (CCPA/CPRA "Do Not Sell or Share").
function wsAdsAllowed(request){
  const h = request.headers;
  if (String(h.get('sec-gpc') || '').trim() === '1') return false;
  if (/(?:^|;\s*)ws_adsoff=1(?:;|$)/.test(h.get('cookie') || '')) return false;
  const c = String(h.get('cf-ipcountry') || '').toUpperCase();
  return c === 'US';
}
function wsAdsOn(env){ const c = wsAdsCfg(env); return !!(c.g || c.meta); }
function wsAdsTags(env){
  const c = wsAdsCfg(env);
  if (!c.g && !c.meta) return '';
  let h = '';
  if (c.g) h += '<script async src="https://www.googletagmanager.com/gtag/js?id=' + c.g + '"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + c.g + '");</script>';
  if (c.meta) h += '<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","' + c.meta + '");fbq("track","PageView");</script>';
  // wsConv("publish", siteId) / wsConv("trial"): each conversion is reported once per site (publish) or once per browser (trial).
  h += '<script>window.wsConv=function(k,id){try{var key="ws_conv_"+k+"_"+(id||"");if(localStorage.getItem(key))return;localStorage.setItem(key,"1");}catch(e){}'
    + 'try{var L=' + JSON.stringify({ publish: c.pub, trial: c.trial }) + ';if(window.gtag&&L[k])gtag("event","conversion",{send_to:L[k]});}catch(e){}'
    + 'try{if(window.fbq)fbq("track",k==="trial"?"StartTrial":"Lead");}catch(e){}};</script>';
  return h;
}
// Privacy page wording when ad measurement is on.
function wsPrivacyWithAds(page){
  return page
    .replace('Websprout measures how the site is used without cookies or third-party trackers:', 'Websprout measures how the site is used without cookies:')
    .replace('<p>We do not track you across other websites. We do not sell your data. We use only the cookies necessary for the service to work, including a sign-in cookie to keep you logged in.</p>',
      '<p>We do not sell your data. Besides the cookies the service needs (including a sign-in cookie to keep you logged in), websprout.app uses Google and Meta advertising tags to measure whether our ads work: they may set cookies and tell those companies when someone who saw an ad publishes a site or starts a Pro trial. These tags never run on the websites our customers publish. You can opt out of personalized ads at <a href="https://adssettings.google.com">adssettings.google.com</a> and in your Facebook or Instagram ad preferences.</p>');
}
function succeed(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
function fail(msg) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}
