// The editor: create, photos, look changes, undo, click-to-edit, autosave and reload.
const { openPage, openStudioWith, previewFrame, sleep, waitFor } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const page = await openPage(browser, { width: 1440 });
  const saves = [];
  page.on('request', (q) => { if (q.url().endsWith('/save') && q.method() === 'POST') { try { saves.push(JSON.parse(q.postData() || '{}')); } catch (e) {} } });
  t.ok(await openStudioWith(page, base, 'Glow Salon', 'Hair salon', { city: 'Austin', phone: '512-555-0100' }), 'studio opens with a new site');
  t.ok(await page.evaluate(() => (document.getElementById('wsEdHost').innerHTML || '').length > 1000), 'edit panel is built');
  t.eq(await page.evaluate(() => window._wsSiteData.biz.city), 'Austin', 'city from the form reaches the site');

  // photo into a hero slot is stored in the site data
  const heroKey = await page.evaluate(() => window._wsSiteData.pages[0].sections.find((s) => s.type === 'hero').id + '.photo');
  const px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  await page.evaluate((k, p) => { currentSlotId = k; fillSlot(p); }, heroKey, px); await sleep(1200);
  t.ok(await page.evaluate((k) => !!window._wsSiteData.photos[k], heroKey), 'photo saved to site data');

  // shuffle the look keeps the photo; undo restores the look
  const before = await page.evaluate(() => window._wsSiteData.palette + '/' + window._wsSiteData.typeset + '/' + (window._wsSiteData.corners || ''));
  await page.evaluate(() => wsShuffleLook()); await sleep(1300);
  const after = await page.evaluate(() => window._wsSiteData.palette + '/' + window._wsSiteData.typeset + '/' + (window._wsSiteData.corners || ''));
  t.ok(before !== after, 'shuffle changes the look');
  t.ok(await page.evaluate(() => gHTML.indexOf('iVBORw0KGgo') > -1), 'photo survives a look change');
  await page.evaluate(() => doUndo()); await sleep(1200);
  t.eq(await page.evaluate(() => window._wsSiteData.palette + '/' + window._wsSiteData.typeset + '/' + (window._wsSiteData.corners || '')), before, 'undo restores the previous look');

  // click-to-edit text in the preview
  let fr = previewFrame(page);
  t.ok(await fr.evaluate(() => document.querySelectorAll('[data-wsf]').length) > 20, 'preview text is bound for editing');
  const tag = await fr.$('[data-wsf="tagline"]');
  await tag.click(); await sleep(150);
  await page.keyboard.type('Color, cuts and care in Austin'); await page.keyboard.press('Enter'); await sleep(500);
  t.eq(await page.evaluate(() => window._wsSiteData.pages[0].sections.find((s) => s.type === 'hero').tagline), 'Color, cuts and care in Austin', 'inline edit writes to site data');
  await page.evaluate(() => { window._wsSiteData.palette = 'w_teal'; wsRerender(); }); await sleep(1300);
  t.ok(await page.evaluate(() => gHTML.indexOf('Color, cuts and care in Austin') > -1), 'inline edit survives a theme change');
  fr = previewFrame(page);
  await fr.evaluate(() => { const s = [...document.querySelectorAll('[data-sec]')][1]; s.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  await sleep(400);
  t.ok(await page.evaluate(() => !!document.querySelector('#wsEdHost .wse-sec.on')), 'clicking a section opens it in the panel');

  // design tab controls
  await page.evaluate(() => { window.wsPanelTab = 'design'; wsOpenEditor(); });
  t.ok(await page.evaluate(() => !!document.querySelector('.wse-color') && document.querySelectorAll('.wse-segb').length === 4), 'design tab has brand color and corners');
  await page.evaluate(() => { window._wsSiteData.accent = '#ff8800'; window._wsSiteData.corners = 'round'; wsRerender(); }); await sleep(900);
  t.ok(await page.evaluate(() => gHTML.indexOf('--accent:#ff8800') > -1 && gHTML.indexOf('wsr-round') > -1), 'brand color and corners render');

  // saved HTML is clean
  await page.evaluate(() => { const d = wsPfDoc(); const s = d.createElement('style'); s.id = '_wsES'; d.head.appendChild(s); wsSyncFromFrame(); });
  const g = await page.evaluate(() => gHTML);
  t.ok(g.startsWith('<!DOCTYPE html>'), 'saved HTML keeps the doctype');
  { const leak = (g.match(/_wsES|_wsInject|data-wsf=|data-wssec|_wsBindCss/) || [])[0]; t.ok(!leak, 'no editor-only markup in saved HTML' + (leak ? ' (found ' + leak + ' near: ' + g.slice(Math.max(0, g.indexOf(leak) - 80), g.indexOf(leak) + 60).replace(/s+/g, ' ') + ')' : '')); }

  // autosave carries site data, reload restores the editor
  await waitFor(() => saves.length > 0, 8000);
  t.ok(saves.length && saves[saves.length - 1].site && saves[saves.length - 1].site.sections, 'autosave includes the site data');
  await page.reload({ waitUntil: 'networkidle2' }); await sleep(4000);
  t.ok(await page.evaluate(() => !!window._wsSiteData && (document.getElementById('wsEdHost').innerHTML || '').length > 1000), 'editor panel is back after a reload');
  const sid = await page.evaluate(() => localStorage.getItem('ws_site')), key = await page.evaluate(() => localStorage.getItem('ws_key'));
  const draft = await (await fetch(base + '/load?site=' + sid + '&key=' + key)).json();
  t.ok(draft.site && draft.site.sections, 'server draft stores the site data');
  t.eq(page._wsErrors.filter((e) => !/Failed to fetch/.test(e)).length, 0, 'editor runs without JS errors ' + page._wsErrors.join('; '));
  await page.close();

  // phone: the edit panel opens
  const m = await openPage(browser, { mobile: true });
  await openStudioWith(m, base, 'Fade Factory', 'Barber shop');
  await m.evaluate(() => document.querySelector('.s-mobtab[data-mob="chat"]').click()); await sleep(400);
  t.ok(await m.evaluate(() => getComputedStyle(document.querySelector('.chat')).display !== 'none' && document.querySelector('.chat').getBoundingClientRect().width > 350), 'phone: Edit opens the full-width panel');
  t.ok(await m.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 1), 'phone: studio has no sideways scroll');
  await m.close();
};
