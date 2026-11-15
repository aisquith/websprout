// Logo colors: uploading a logo in the editor picks its brand color as the site accent (made readable on the theme),
// shows "Matched your colors to your logo · Undo", Undo restores the previous accent, and a color the owner picked
// by hand is never replaced.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { openPage, openStudioWith, sleep, waitFor } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const page = await openPage(browser, { width: 1440 });
  t.ok(await openStudioWith(page, base, 'Red Door Bakery', 'Bakery', { city: 'Austin' }), 'studio opens');
  // A solid red logo on white with a transparent margin and a near-black wordmark strip (both must be ignored).
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 200; c.height = 100; const x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.fillRect(10, 10, 180, 80); x.fillStyle = '#D62828'; x.fillRect(30, 20, 100, 60); x.fillStyle = '#111111'; x.fillRect(140, 30, 40, 40);
    return c.toDataURL('image/png').split(',')[1];
  });
  const file = path.join(os.tmpdir(), 'ws-logo-' + Date.now() + '.png');
  fs.writeFileSync(file, Buffer.from(png, 'base64'));
  const upload = async () => {
    await page.evaluate(() => { window.wsPanelTab = 'design'; wsOpenEditor(); });
    await sleep(200);
    const input = await page.$('#wsEdHost input[type=file][accept*="svg"]');
    if (!input) return false;
    await input.uploadFile(file); // fires the input's change event
    return true;
  };
  await page.evaluate(() => { const sd = window._wsSiteData; sd.palette = 'w_mono'; delete sd.accent; delete sd.accentLogo; wsRerender(true); });
  await sleep(500);
  t.ok(await upload(), 'design tab has a logo upload input');
  t.ok(await waitFor(() => page.evaluate(() => !!window._wsSiteData.accent), 6000, 200), 'logo upload sets a brand accent');
  const st = await page.evaluate(() => ({ accent: window._wsSiteData.accent, logo: !!window._wsSiteData.biz.logo, html: gHTML.indexOf('--accent:' + window._wsSiteData.accent) > -1, toast: document.getElementById('toast').textContent, on: document.getElementById('toast').classList.contains('on') }));
  const hue = await page.evaluate((h) => window.WS.hexToHsl(h)[0], st.accent);
  t.ok(hue < 12 || hue > 348, 'accent is the logo red (' + st.accent + ', hue ' + Math.round(hue) + ')');
  t.ok(st.logo && st.html, 'logo and accent are on the rendered site');
  t.ok(st.on && /Matched your colors to your logo/.test(st.toast) && /Undo/.test(st.toast), 'toast offers Undo (' + st.toast + ')');
  const ok = await page.evaluate((a) => { const W = window.WS, p = W.withAccent(W.palette('w_mono'), a); return W.contrast(p.accent, p.accentText) >= 4.5 && W.contrast(p.accent, p.base) >= 3; }, st.accent);
  t.ok(ok, 'button text on the accent meets AA and the button stands out from the page');
  await page.evaluate(() => document.querySelector('#toast .toast-act').click());
  await sleep(900);
  t.ok(await page.evaluate(() => !window._wsSiteData.accent && !!window._wsSiteData.biz.logo), 'Undo restores the previous accent and keeps the logo');

  // pale logo color on a light theme is darkened until readable
  const fit = await page.evaluate(() => { const W = window.WS, pal = W.palette('w_mono'); return W.withAccent(pal, W.fitContrast('#FFE14D', pal.base, 3)); });
  t.ok(await page.evaluate((p) => window.WS.contrast(p.accent, p.base) >= 3 && window.WS.contrast(p.accent, p.accentText) >= 4.5, fit), 'a pale yellow logo color is adjusted for contrast (' + fit.accent + ')');

  // an accent the owner picked by hand is kept
  await page.evaluate(() => { const sd = window._wsSiteData; sd.accent = '#1D4ED8'; delete sd.accentLogo; wsRerender(true); });
  await sleep(400);
  await upload();
  await sleep(1500);
  t.eq(await page.evaluate(() => window._wsSiteData.accent), '#1D4ED8', 'hand-picked accent is not replaced by a logo upload');
  // unreadable images fail quietly
  t.eq(await page.evaluate(() => new Promise((r) => wsLogoColor('data:image/png;base64,AAAA', r))), '', 'a broken logo yields no color');
  t.eq(page._wsErrors.length, 0, 'no JS errors ' + page._wsErrors.join('; '));
  await page.close();
  try { fs.unlinkSync(file); } catch (e) {}
};
