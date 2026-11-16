// Editor security: an untrusted draft (legacy raw HTML with <script>) must never run on the editor's origin, a shared
// ?site=&key= link must ask before loading, and the legacy editing tools keep working over the sandboxed channel.
const { createSite, post, openPage, openStudioWith, previewFrame, sleep, waitFor } = require('./lib');

const EVIL = '<!DOCTYPE html><html><head><title>Evil draft</title></head><body>'
  + '<h1 id="evh">Hello evil</h1><p id="evp">Some ordinary looking paragraph text for the page.</p>'
  + '<div class="ws-img-slot" data-slot="hero" data-label="Hero photo" style="height:220px;background:#ddd">slot</div>'
  + '<div style="height:900px">tall</div>'
  + '<script>var hits=[];'
  + 'try{hits.push("pc:"+parent.document.cookie);}catch(e){}'
  + 'try{parent.localStorage.setItem("PWNED","1");hits.push("pls");}catch(e){}'
  + 'try{top.localStorage.setItem("PWNED","1");hits.push("tls");}catch(e){}'
  + 'try{localStorage.setItem("PWNED","1");hits.push("ls");}catch(e){}'
  + 'try{hits.push("c:"+document.cookie);}catch(e){}'
  + 'try{parent.PWNED=1;hits.push("pw");}catch(e){}'
  + 'try{parent.wsNavClick("x");hits.push("pf");}catch(e){}'
  + 'try{fetch("/my-sites",{credentials:"include"}).then(function(r){return r.text();}).then(function(t){parent.postMessage({type:"evil",t:t},"*");}).catch(function(){});}catch(e){}'
  + 'document.title="EVIL:"+hits.join(",");</script></body></html>';

async function newContext(browser) { return browser.createBrowserContext ? browser.createBrowserContext() : browser.createIncognitoBrowserContext(); }
async function ctxPage(ctx) {
  const page = await ctx.newPage(); await page.setViewport({ width: 1440, height: 860 });
  const errors = []; page.on('dialog', (d) => { errors.push('DIALOG: ' + d.message()); d.dismiss().catch(() => {}); });
  // Record anything the draft manages to send back to the editor window.
  await page.evaluateOnNewDocument(() => { window.__evil = []; window.addEventListener('message', (e) => { if (e.data && e.data.type === 'evil') window.__evil.push(String(e.data.t || '')); }); });
  page._wsErrors = errors; return page;
}
function frameOf(page, id) { return page.frames().find((f) => f.parentFrame() === page.mainFrame() && f.name() !== 'pfFull' && f !== page.mainFrame()); }
async function mainState(page) {
  return page.evaluate(() => { const f = document.getElementById('pf'); let cd = 'x'; try { cd = f.contentDocument; } catch (e) { cd = null; } let ls = null; try { ls = localStorage.getItem('PWNED'); } catch (e) {}
    return { sandbox: f.getAttribute('sandbox'), cdNull: cd === null, pwned: ls, pw: typeof window.PWNED, evil: (window.__evil || []).length }; });
}

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const s = await createSite(base, { name: 'Shared Evil Co', type: 'Bakery' });
  const sv = await post(base, '/save', { siteId: s.siteId, key: s.formKey, html: EVIL, name: 'Evil', site: null });
  t.eq(sv.status, 200, 'attacker draft saved');
  const ld = await (await fetch(base + '/load?site=' + s.siteId + '&key=' + encodeURIComponent(s.formKey))).json();
  t.ok(ld && ld.html && ld.html.indexOf('EVIL:') > -1 && !(ld.site && ld.site.sections), 'draft is legacy raw HTML');

  // ---- 1. shared link: Cancel keeps the victim's browser untouched ----
  let c1 = await newContext(browser);
  try {
    const p = await ctxPage(c1);
    await p.goto(base + '/?site=' + s.siteId + '&key=' + encodeURIComponent(s.formKey), { waitUntil: 'networkidle2' });
    t.ok(await waitFor(() => p.evaluate(() => !!document.querySelector('.wsCfm-back')), 6000, 200), 'shared link asks for confirmation');
    t.ok(/someone shared/i.test(await p.evaluate(() => (document.querySelector('.wsCfm-back') || {}).textContent || '')), 'confirmation explains a shared site');
    t.ok(!/key=/.test(await p.evaluate(() => location.href)), 'site key is stripped from the address bar');
    t.ok(await p.evaluate(() => localStorage.getItem('ws_site') === null && !localStorage.getItem('wsh')), 'nothing loaded before confirming');
    await p.evaluate(() => { const b = [...document.querySelectorAll('.wsCfm-back .wsCfm-btn')].find((x) => !/primary|danger/.test(x.className)); b.click(); });
    await sleep(1500);
    t.ok(await p.evaluate(() => localStorage.getItem('ws_site') === null && !document.getElementById('studio').classList.contains('on')), 'Cancel does not load the shared site');
  } finally { await c1.close().catch(() => {}); }

  // ---- 2. shared link: confirm -> draft opens, but sandboxed (opaque origin) ----
  c1 = await newContext(browser);
  try {
    const p = await ctxPage(c1);
    await p.goto(base + '/terms'); await p.evaluate(() => { document.cookie = 'wsvictim=secret123; path=/'; localStorage.setItem('victim_token', 'tok'); });
    await p.goto(base + '/?site=' + s.siteId + '&key=' + encodeURIComponent(s.formKey), { waitUntil: 'networkidle2' });
    await waitFor(() => p.evaluate(() => !!document.querySelector('.wsCfm-back')), 6000, 200);
    await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}), p.evaluate(() => document.querySelector('.wsCfm-back .wsCfm-btn.primary').click())]);
    t.ok(await waitFor(() => p.evaluate(() => document.getElementById('studio').classList.contains('on')), 15000, 300), 'confirmed shared site opens in the studio');
    let fr = null;
    t.ok(await waitFor(async () => { fr = frameOf(p); if (!fr) return false; try { return /^EVIL:/.test(await fr.evaluate(() => document.title)); } catch (e) { return false; } }, 15000, 300), 'draft rendered in the preview');
    const title = fr ? await fr.evaluate(() => document.title) : '';
    t.eq(title, 'EVIL:', 'draft scripts reach neither the editor window, cookies nor storage');
    await sleep(1500);
    const st = await mainState(p);
    t.ok(st.sandbox && st.sandbox.indexOf('allow-scripts') > -1 && st.sandbox.indexOf('allow-same-origin') < 0, 'preview is sandboxed without allow-same-origin (' + st.sandbox + ')');
    t.ok(st.cdNull, 'editor cannot reach into the preview document (opaque origin)');
    t.ok(st.pwned === null && st.pw === 'undefined', 'no marker written to the editor origin');
    t.eq(st.evil, 0, 'draft could not read /my-sites');
    t.ok(await fr.evaluate(() => { try { return location.origin; } catch (e) { return 'err'; } }) === 'null', 'preview origin is opaque');
    // height still fits the content via the message channel
    t.ok(await waitFor(() => p.evaluate(() => { const h = parseInt(document.getElementById('pf').style.height, 10); return h > 900 && h < 2000; }), 6000, 300), 'preview height fits the sandboxed page');
    // spoofed messages (wrong source / no nonce) are ignored
    await p.evaluate(() => window.postMessage({ type: 'wsSlotClick', slotId: 'x', label: 'spoof' }, '*')); await sleep(300);
    t.ok(!(await p.evaluate(() => document.getElementById('slotModal').classList.contains('on'))), 'messages without the session nonce are ignored');
    // photo slot click -> picker opens; filling it updates the draft through the channel
    await fr.evaluate(() => document.querySelector('.ws-img-slot').click());
    t.ok(await waitFor(() => p.evaluate(() => document.getElementById('slotModal').classList.contains('on')), 4000, 200), 'photo slot click opens the picker');
    const px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    await p.evaluate((x) => fillSlot(x), px);
    t.ok(await waitFor(() => p.evaluate(() => /data-slot-filled="hero"/.test(gHTML) && gHTML.indexOf('_wsInject') < 0), 5000, 200), 'photo placed in the sandboxed preview is saved to the draft');
    // legacy canvas toolbar: select + delete via commands
    await p.evaluate(() => toggleEditMode()); await sleep(300);
    await fr.evaluate(() => document.getElementById('evp').click());
    t.ok(await waitFor(() => p.evaluate(() => document.getElementById('wsCanvaBar').style.display === 'flex'), 4000, 200), 'clicking text in edit mode shows the toolbar');
    await p.evaluate(() => wsCvDelete());
    t.ok(await waitFor(() => p.evaluate(() => gHTML.indexOf('evp') < 0 && gHTML.indexOf('Hello evil') > -1), 5000, 200), 'toolbar delete edits the draft through the channel');
    // fullscreen preview is sandboxed too
    await p.evaluate(() => document.getElementById('fullscreenBtn').click()); await sleep(800);
    t.ok(await p.evaluate(() => { const f = document.getElementById('pfFull'); return (f.getAttribute('sandbox') || '').indexOf('allow-same-origin') < 0 && f.contentDocument === null; }), 'fullscreen preview is opaque-origin');
    // open in new tab: the page sits in a sandboxed frame inside the tab
    const popP = new Promise((r) => p.once('popup', r));
    await p.evaluate(() => document.getElementById('fsNewTab').click());
    const pop = await Promise.race([popP, sleep(5000).then(() => null)]);
    if (pop) {
      await sleep(800);
      const pr = await pop.evaluate(() => { const f = document.querySelector('iframe'); return f ? { sb: f.getAttribute('sandbox') || '', cd: f.contentDocument === null, ls: (() => { try { return localStorage.getItem('PWNED'); } catch (e) { return 'err'; } })() } : null; });
      t.ok(pr && pr.sb.indexOf('allow-same-origin') < 0 && pr.cd && pr.ls === null, 'new-tab preview is opaque-origin');
      await pop.close().catch(() => {});
    } else t.fail('new-tab preview did not open');
    t.eq((await mainState(p)).pwned, null, 'still no marker on the editor origin');
  } finally { await c1.close().catch(() => {}); }

  // ---- 3. setPreview directly ----
  const page = await openPage(browser, { width: 1440 });
  try {
    t.ok(await openStudioWith(page, base, 'Trusty Bakery', 'Bakery'), 'studio opens with a structured site');
    // structured site: stored/remote HTML is ignored, the preview is rebuilt from site data (same-origin, editable)
    await page.evaluate((h) => { gHTML = h; setPreview(h); }, EVIL); await sleep(1500);
    let fr = previewFrame(page);
    t.ok(!/^EVIL/.test(await fr.evaluate(() => document.title)) && await page.evaluate(() => { const d = document.getElementById('pf').contentDocument; return !!d && !d.getElementById('evh') && d.querySelectorAll('[data-sec]').length > 2; }), 'structured site preview is rebuilt from site data, not raw HTML');
    t.eq(await page.evaluate(() => localStorage.getItem('PWNED')), null, 'no marker after structured setPreview');
    // legacy (no site data): sandboxed
    await page.evaluate((h) => { window._wsSiteData = null; gHTML = h; setPreview(h); }, EVIL); await sleep(1500);
    fr = previewFrame(page);
    t.eq(await fr.evaluate(() => document.title), 'EVIL:', 'legacy setPreview runs the draft without editor access');
    const st = await mainState(page);
    t.ok(st.cdNull && st.pwned === null && st.pw === 'undefined' && (st.sandbox || '').indexOf('allow-same-origin') < 0, 'legacy setPreview preview is opaque-origin');
  } finally { await page.close().catch(() => {}); }
};
