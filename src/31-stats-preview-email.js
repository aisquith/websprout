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
  // Analytics - completely optional, won't break if KV missing
  try {
    if (!env.KV) return succeed({ ok: false });
    const body = await request.json();
    // Only events a browser legitimately sends. Server-side steps (create_v3, publish, login, pro_start) are
    // logged by the server itself, so they cannot be inflated from outside.
    const event = String(body.event || '');
    if (['visit', 'share', 'deploy_netlify', 'first_edit', 'upgrade_click'].indexOf(event) === -1) return succeed({ ok: false });
    const key = 'stat:' + event;
    const cur = parseInt(await env.KV.get(key) || '0');
    await env.KV.put(key, String(cur + 1));
    const today = new Date().toISOString().slice(0,10);
    const dayKey = 'stat:' + event + ':' + today;
    const dayCur = parseInt(await env.KV.get(dayKey) || '0');
    await env.KV.put(dayKey, String(dayCur + 1), { expirationTtl: 60*60*24*30 });
    await logEvent(request, env, event, { ref: body.ref, src: deriveSource(body.url, body.ref) });
    return succeed({ ok: true });
  } catch(e) { return succeed({ ok: false }); }
}

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
  } catch(e) { return fail(e.message); }
}

// ── Feature 8: Shareable preview link ────────────────────────
async function doSavePreview(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const body = await request.json();
    if (!body.html) return fail('No HTML provided');
    const id = Math.random().toString(36).slice(2,10) + Date.now().toString(36);
    // Store for 7 days
    await env.KV.put('preview:' + id, body.html, { expirationTtl: 60*60*24*7 });
    return succeed({ id: id, url: 'https://websprout.app/preview?id=' + id });
  } catch(e) { return fail(e.message); }
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
  } catch(e) { return new Response('Error: ' + e.message, { status: 500 }); }
}


// ── Feature 2: Email delivery via Resend ──────────────────────
async function doSendEmail(request, env) {
  try {
    if (!env.RESEND_API_KEY) return fail('Email not configured');
    const body = await request.json();
    const { email, html, title } = body;
    if (!email || !html) return fail('Missing email or html');
    if (!isRealEmail(String(email))) return fail('Enter a valid email');
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

    const siteName = title || 'your-website';
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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    const result = await res.json();
    if (!res.ok) return fail(result.message || 'Email failed to send');
    return succeed({ sent: true, id: result.id });
  } catch(e) {
    return fail(e.message);
  }
}

