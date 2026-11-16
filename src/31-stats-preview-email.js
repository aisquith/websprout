// ── Feature 3: Analytics ──────────────────────────────────────
function fmtThousands(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
async function getSitesGrown(env){
  try{
    if(!env.KV) return 0;
    const v = await env.KV.get('stat:sitesgrown');
    if(v !== null){ const n = parseInt(v,10); return isNaN(n)?0:n; }
    let total = 0, cur, g = 0;
    do {
      const r = await env.KV.list({ prefix:'bcount:', cursor:cur, limit:1000 });
      for(const k of r.keys){ try{ total += (parseInt(await env.KV.get(k.name)||'0',10)||0); }catch(e){} }
      cur = r.list_complete ? null : r.cursor; g++;
    } while(cur && g < 20);
    await env.KV.put('stat:sitesgrown', String(total));
    return total;
  }catch(e){ return 0; }
}
async function doTrack(request, env) {
  // Analytics - completely optional, won't break if storage is missing. No cookies are read or set.
  try {
    if (!env.KV && !env.DB) return succeed({ ok: false });
    const body = await request.json();
    // Only events a browser legitimately sends. Server-side steps (generate, publish, login, pro_start, lead...) are
    // logged by the server itself, so they cannot be inflated from outside.
    const event = String(body.event || '');
    if (WS_TRACK_EVENTS.indexOf(event) === -1) return succeed({ ok: false });
    if (!env.DB) {
      // KV fallback only: running counters (with D1 these come from the events table instead).
      const key = 'stat:' + event;
      const cur = parseInt(await env.KV.get(key) || '0');
      await env.KV.put(key, String(cur + 1));
      const today = new Date().toISOString().slice(0,10);
      const dayKey = 'stat:' + event + ':' + today;
      const dayCur = parseInt(await env.KV.get(dayKey) || '0');
      await env.KV.put(dayKey, String(dayCur + 1), { expirationTtl: 60*60*24*30 });
    }
    const props = {};
    if (event === 'launch_check') { props.issues = Math.max(0, Math.min(99, parseInt(body.issues, 10) || 0)); props.kinds = (Array.isArray(body.kinds) ? body.kinds : []).slice(0, 8).map(function(k){ return String(k).replace(/[^a-z0-9_ -]/gi, '').slice(0, 32); }).filter(Boolean); }
    if (event === 'setup_start' && body.step) props.step = String(body.step).replace(/[^a-z0-9_-]/gi, '').slice(0, 20);
    let email = ''; if (event !== 'visit') { try { const s = await getSession(request, env); email = (s && s.email) || ''; } catch(e){} }
    await logEvent(request, env, event, { url: body.url, ref: body.ref, site: body.site, email: email, props: props });
    return succeed({ ok: true });
  } catch(e) { return succeed({ ok: false }); }
}
// Browser events /track accepts (setup_start and launch_check need the editor hooks listed in the analytics notes).
const WS_TRACK_EVENTS = ['visit', 'share', 'deploy_netlify', 'first_edit', 'upgrade_click', 'setup_start', 'launch_check'];

async function doStats(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const [gen, pay, share] = await Promise.all([
      env.KV.get('stat:generate'),
      env.KV.get('stat:payment'),
      env.KV.get('stat:share')
    ]);
    const today = new Date().toISOString().slice(0,10);
    const [genDay, payDay] = await Promise.all([
      env.KV.get('stat:generate:' + today),
      env.KV.get('stat:payment:' + today)
    ]);
    return succeed({
      total: { generates: parseInt(gen||'0'), payments: parseInt(pay||'0'), shares: parseInt(share||'0') },
      today: { generates: parseInt(genDay||'0'), payments: parseInt(payDay||'0') },
      conversion: gen > 0 ? ((parseInt(pay||'0')/parseInt(gen||'1'))*100).toFixed(1)+'%' : '0%'
    });
  } catch(e) { return wsErr(e); }
}

// ── Feature 8: Shareable preview link ────────────────────────
const WS_MAX_HTML_BODY = 1024 * 1024 * 4; // request body cap for user-HTML endpoints (a full site is well under this)
async function doSavePreview(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    // Only signed-in users, or the holder of a site's key, can create share links (they serve user HTML on our origin, sandboxed).
    if ((parseInt(request.headers.get('content-length') || '0', 10) || 0) > WS_MAX_HTML_BODY) return fail('Site is too large to share');
    const raw = await request.text();
    if (raw.length > WS_MAX_HTML_BODY) return fail('Site is too large to share');
    let body = {}; try { body = JSON.parse(raw); } catch(e) { return fail('Invalid request'); }
    if (!body.html || typeof body.html !== 'string') return fail('No HTML provided');
    const sess = await getSession(request, env);
    if (!(sess && sess.email) && !(body.siteId && await siteKeyOk(String(body.siteId), body.key, env))) return new Response(JSON.stringify({ error:'Please sign in to share a preview.' }), { status:401, headers:{ 'Content-Type':'application/json' } });
    if (!(await wsRate(env, 'pvrate:' + wsClientIp(request, env), 30, 3600))) return fail('Too many share links right now. Please try again later.');
    const id = randToken(12);
    // Store for 7 days
    await env.KV.put('preview:' + id, body.html, { expirationTtl: 60*60*24*7 });
    return succeed({ id: id, url: 'https://websprout.app/preview?id=' + id });
  } catch(e) { return wsErr(e); }
}

async function doPreviewShare(request, env) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    if (!env.KV) return new Response('KV not configured', { status: 500 });
    const html = await env.KV.get('preview:' + id);
    if (!html) return new Response('<html><body style="font-family:sans-serif;padding:2rem;text-align:center"><h2>🌱 Preview expired</h2><p>This preview link has expired or does not exist.</p><a href="/">Build your own at websprout.app</a></body></html>', { status: 404, headers: {'Content-Type':'text/html'} });
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals' } });
  } catch(e) { try { console.error(e); } catch(_){} return new Response('Something went wrong', { status: 500 }); }
}


// ── Feature 2: Email delivery via Resend ──────────────────────
async function doSendEmail(request, env) {
  try {
    if (!env.RESEND_API_KEY) return fail('Email not configured');
    // Not a relay: only a signed-in user, and only to their own account address.
    const sess = await getSession(request, env);
    if (!sess || !sess.email) return new Response(JSON.stringify({ error:'Please sign in first.' }), { status:401, headers:{ 'Content-Type':'application/json' } });
    if ((parseInt(request.headers.get('content-length') || '0', 10) || 0) > WS_MAX_HTML_BODY) return fail('Site is too large to email');
    const body = await request.json();
    const { html, title } = body;
    const email = String(sess.email).toLowerCase();
    if (!html || typeof html !== 'string') return fail('Missing html');
    if (html.length > WS_MAX_HTML_BODY) return fail('Site is too large to email');
    if (body.email && String(body.email).trim().toLowerCase() !== email) return fail('Sites can only be emailed to your own account address.');
    if (!isRealEmail(email)) return fail('Enter a valid email');
    if (env.KV) {
      const _ip = request.headers.get('cf-connecting-ip') || '0';
      const _ki = 'semrate:ip:' + _ip, _ke = 'semrate:to:' + String(email).toLowerCase();
      const _ni = parseInt((await env.KV.get(_ki)) || '0', 10) || 0, _ne = parseInt((await env.KV.get(_ke)) || '0', 10) || 0;
      if (_ni >= 5 || _ne >= 3) return fail('Too many emails sent. Please try again later.');
      await env.KV.put(_ki, String(_ni + 1), { expirationTtl: 3600 }); await env.KV.put(_ke, String(_ne + 1), { expirationTtl: 86400 });
    }

    // Base64 encode the HTML for attachment (chunked: spreading a large array overflows the call stack)
    const htmlBytes = new TextEncoder().encode(html);
    let _bin = ''; for (let _i = 0; _i < htmlBytes.length; _i += 0x8000) _bin += String.fromCharCode.apply(null, htmlBytes.subarray(_i, _i + 0x8000));
    const base64Html = btoa(_bin);

    if (!(await wsMailCapOk(env, 'site_email'))) return fail('Email is busy right now. Please try again later.');
    const siteName = String(title || 'your-website');
    const filename = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '.html';

    const emailBody = {
      from: 'Websprout <hello@websprout.app>',
      to: [email],
      subject: 'Your website is ready to grow! 🌱',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
          <div style="background:#0f1a0d;padding:28px 32px;text-align:center">
            <div style="font-size:32px;margin-bottom:8px">🌱</div>
            <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-1px">Websprout</div>
          </div>
          <div style="padding:36px 32px">
            <h1 style="color:#0f1a0d;font-size:24px;font-weight:800;margin:0 0 12px;letter-spacing:-1px">Your site is attached and ready!</h1>
            <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px">Your website has been attached to this email as an HTML file. Here's how to get it live:</p>
            <div style="background:#f8faf8;border:1px solid #e8f0e5;border-radius:12px;padding:20px;margin-bottom:24px">
              <div style="font-weight:700;color:#0f1a0d;margin-bottom:12px">Deploy free in 2 minutes:</div>
              <ol style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:2">
                <li>Go to <a href="https://app.netlify.com/signup" style="color:#2d7a3a">netlify.com</a> and create a free account</li>
                <li>Click <strong>Add new site</strong> → <strong>Deploy manually</strong></li>
                <li>Drag the attached HTML file onto the upload area</li>
                <li>Your site is live at a free <code style="background:#e8f0e5;padding:1px 6px;border-radius:4px">*.netlify.app</code> URL!</li>
              </ol>
            </div>
            <p style="color:#888;font-size:13px;margin:0 0 24px">Need to make changes? Go back to <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a> — your site is saved and ready to edit.</p>
            <div style="text-align:center">
              <a href="https://websprout.app" style="display:inline-block;background:#2d7a3a;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none">Back to Websprout</a>
            </div>
          </div>
          <div style="background:#f8faf8;border-top:1px solid #e8f0e5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:12px;margin:0">You're receiving this because you purchased a site on <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: base64Html
        }
      ]
    };

    await wsMailCount(env, 'site_email');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    const result = await res.json();
    if (!res.ok) { try { console.error('send-email failed', result && result.message); } catch(_){} return fail('Email failed to send'); }
    return succeed({ sent: true, id: result.id });
  } catch(e) {
    return wsErr(e);
  }
}

