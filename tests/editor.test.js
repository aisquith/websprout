// The editor: create, photos, look changes, undo, click-to-edit, autosave and reload.
const { openPage, openStudioWith, previewFrame, sleep, waitFor } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const page = await openPage(browser, { width: 1440 });
  const saves = [];
  page.on('request', (q) => { if (q.url().endsWith('/save') && q.method() === 'POST') { try { saves.push(JSON.parse(q.postData() || '{}')); } catch (e) {} } });
  t.ok(await openStudioWith(page, base, 'Glow Salon', 'Hair salon', { city: 'Austin', phone: '512-555-0100' }), 'studio opens with a new site');
  t.ok(await page.evaluate(() => (document.getElementById('wsEdHost').innerHTML || '').length > 1000), 'edit panel is built');
  const gap = await page.evaluate(() => { const f = document.getElementById('pf'); const d = f.contentDocument; const b = Math.max(...[...d.body.children].filter((e) => getComputedStyle(e).position !== 'fixed' && !/SCRIPT|STYLE/.test(e.tagName)).map((e) => e.getBoundingClientRect().bottom)); return Math.round(f.offsetHeight - b); });
  t.ok(gap >= -1 && gap <= 2, 'preview ends at the footer with no blank strip (' + gap + 'px)');
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

  // logo replaces the name in the header; stock photo credits appear in the footer
  await page.evaluate((p) => { window._wsSiteData.biz.logo = p; const h = window._wsSiteData.pages[0].sections.find((s) => s.type === 'hero'); window._wsSiteData.photoCredits = {}; window._wsSiteData.photoCredits[h.id + '.photo'] = { name: 'Ada Lens', link: 'https://unsplash.com/@ada' }; wsRerender(); }, px);
  await sleep(900);
  t.ok(await page.evaluate(() => /class="mark-logo" src="data:image\/png/.test(gHTML)), 'logo shows in the header');
  t.ok(await page.evaluate(() => /Photos by <a href="https:\/\/unsplash\.com\/@ada\?utm_source=websprout/.test(gHTML)), 'stock photo credit shows in the footer');
  await page.evaluate(() => { const h = window._wsSiteData.pages[0].sections.find((s) => s.type === 'hero'); delete window._wsSiteData.photos[h.id + '.photo']; wsRerender(); }); await sleep(900);
  t.ok(await page.evaluate(() => gHTML.indexOf('Photos by') < 0), 'credit disappears when the photo is removed');
  const ps = await (await fetch(base + '/api/photos?q=haircut')).json();
  t.ok(ps && Array.isArray(ps.results), 'photo search answers (results or a friendly "not set up" message)');

  // Site tab: "Your info" opens structured business info; fields and hours write to site data
  await page.evaluate(() => document.getElementById('yourInfoBtn').click()); await sleep(400);
  t.ok(await page.evaluate(() => window.wsPanelTab === 'site' && document.getElementById('wseBizInfo') && document.getElementById('wseBizInfo').open), 'Your info opens Business info in the Site tab');
  t.ok(await page.evaluate(() => !!document.querySelector('.wse-ring')), 'launch checklist shows a score');
  await page.evaluate(() => { const i = [...document.querySelectorAll('#wseBizInfo input')].find((x) => x.getAttribute('aria-label') === 'Email'); i.value = 'hi@glow.example'; i.dispatchEvent(new Event('input')); });
  await sleep(1200);
  t.eq(await page.evaluate(() => window._wsSiteData.biz.email), 'hi@glow.example', 'email field saves to site data');
  t.ok(await page.evaluate(() => gHTML.indexOf('mailto:hi@glow.example') > -1), 'email appears on the site');
  await page.evaluate(() => { const o = document.querySelector('#wseBizInfo input[aria-label="Mon opens"]'); o.value = '08:30'; o.dispatchEvent(new Event('change')); });
  await sleep(1000);
  t.ok(await page.evaluate(() => (window._wsSiteData.biz.hours || [])[0].open === '08:30' && /8:30 am/.test(gHTML)), 'opening hours save and render');
  // SEO tool stores title/description in site data (survives re-renders)
  await page.evaluate(() => { document.getElementById('seoBtn').click(); document.getElementById('seoTitle').value = 'Glow Salon | Best hair in Austin'; document.getElementById('seoDesc').value = 'Cuts, color and blowouts by friendly stylists in downtown Austin. Book online today.'; document.getElementById('seoSaveBtn').click(); });
  await sleep(900);
  await page.evaluate(() => { window._wsSiteData.palette = 'w_rose'; wsRerender(); }); await sleep(900);
  t.ok(await page.evaluate(() => gHTML.indexOf('<title>Glow Salon | Best hair in Austin</title>') > -1 && gHTML.indexOf('Book online today.') > -1), 'SEO title and description survive a theme change');
  await page.evaluate(() => { window.wsPanelTab = 'edit'; wsOpenEditor(); });

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

  // Getting home and starting over: Home leaves the editor with a "Continue editing" pill; New site asks,
  // then opens a blank setup form; the old site is never lost.
  {
    const h = await openPage(browser, {});
    await openStudioWith(h, base, 'Glow Salon', 'Hair salon', { city: 'Austin' });
    const studioOn = () => h.evaluate(() => document.getElementById('studio').classList.contains('on'));
    await waitFor(async () => h.evaluate(() => !document.getElementById('qaScreen').classList.contains('on')), 8000);
    t.ok(await h.evaluate(() => { const b = document.getElementById('homeBtn'); const r = b.getBoundingClientRect(); return r.width > 20 && r.top < 60 && /Home/.test(b.textContent); }), 'editor shows a Home button top left');
    t.ok(await h.evaluate(() => { const b = document.getElementById('newSiteBtn'); return b && b.offsetParent !== null && /New site/.test(b.textContent); }), 'editor shows a New site button');
    await h.click('#homeBtn'); await sleep(300);
    const home = await h.evaluate(() => { const p = document.getElementById('wsResume'); return { pill: p ? p.innerText : '', top: window.scrollY }; });
    t.ok(!(await studioOn()) && /Continue editing Glow Salon/.test(home.pill) && home.top === 0, 'Home goes to the top of the home page and offers to continue editing ' + JSON.stringify(home));
    await h.evaluate(() => document.querySelector('.ws-resume-go').click()); await sleep(400);
    t.ok((await studioOn()) && !(await h.evaluate(() => document.getElementById('wsResume'))), 'Continue editing reopens the editor');
    t.ok(await h.evaluate(() => /Glow Salon/.test(gHTML)), 'the same site is still there');
    // New site: cancel keeps you in the editor
    await h.click('#newSiteBtn'); await sleep(300);
    t.ok(await h.evaluate(() => /Start a new site\?/.test((document.querySelector('.wsCfm-box') || {}).innerText || '') && /saved in My sites/.test(document.querySelector('.wsCfm-box').innerText)), 'New site asks first and says the current site is saved');
    await h.evaluate(() => [...document.querySelectorAll('.wsCfm-btn')].find((b) => b.textContent === 'Keep editing').click()); await sleep(300);
    t.ok(await studioOn(), 'Keep editing stays in the editor');
    // confirm: blank, focused setup form
    await h.click('#newSiteBtn'); await sleep(300);
    await h.evaluate(() => [...document.querySelectorAll('.wsCfm-btn')].find((b) => b.textContent === 'Start a new site').click()); await sleep(900);
    const fresh = await h.evaluate(() => ({ vals: ['bizName', 'bizType', 'customPrompt', 'bizCity', 'bizPhone'].map((id) => document.getElementById(id).value).join(''), focus: document.activeElement && document.activeElement.id, inView: (() => { const r = document.getElementById('bizName').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })(), pill: !!document.getElementById('wsResume') }));
    t.ok(!(await studioOn()) && fresh.vals === '' && fresh.focus === 'bizName' && fresh.inView && fresh.pill, 'New site opens an empty setup form, ready to type, and the old site can still be reopened ' + JSON.stringify(fresh));
    const lk = await h.evaluate(() => { const ph = document.getElementById('bizPhone'); const opts = [...document.querySelectorAll('#lookPick .look-opt')]; const r = { phoneHidden: ph.type === 'hidden', noPhoneLabel: ![...document.querySelectorAll('#panel1 .field-lbl')].some((l) => /phone/i.test(l.textContent)), opts: opts.map((o) => o.textContent.trim()).join(','), none: window._wsLook || '' };
      opts[1].click(); r.dark = window._wsLook + ':' + opts.map((o) => o.getAttribute('aria-checked')).join(','); opts[2].click(); r.color = window._wsLook; opts[2].click(); r.cleared = window._wsLook; return r; });
    t.ok(lk.phoneHidden && lk.noPhoneLabel && lk.opts === 'Light,Dark,Colorful' && lk.none === '' && lk.dark === 'dark:false,true,false' && lk.color === 'colorful' && lk.cleared === '', 'setup form has a Light / Dark / Colorful picker instead of a phone field ' + JSON.stringify(lk));
    await h.type('#bizName', 'B'); await sleep(100);
    t.ok(await h.evaluate(() => !document.getElementById('wsResume')), 'typing a new business hides the pill so it never covers the form');
    await h.evaluate(() => { document.getElementById('bizName').value = ''; wsShowResume(); });
    // Start over in the tools menu does the same
    await h.evaluate(() => document.querySelector('.ws-resume-go').click()); await sleep(400);
    await h.evaluate(() => document.getElementById('backBtn').click()); await sleep(300);
    t.ok(await h.evaluate(() => !!document.querySelector('.wsCfm-box')), 'Start over in the menu asks the same question');
    await h.evaluate(() => [...document.querySelectorAll('.wsCfm-btn')].find((b) => b.textContent === 'Keep editing').click());
    t.eq(h._wsErrors.length, 0, 'no JS errors going home and starting over ' + h._wsErrors.join('; '));
    await h.close();
  }

  // Site tab: settings, search, leads and tools live in the panel, in one style, with clear status
  {
    const s = await openPage(browser, {}); await s.setViewport({ width: 1440, height: 1000 });
    await openStudioWith(s, base, 'Glow Salon', 'Hair salon', { city: 'Austin', phone: '(512) 555-0100' });
    await waitFor(async () => s.evaluate(() => !document.getElementById('qaScreen').classList.contains('on')), 8000);
    await s.evaluate(() => { window.wsPanelTab = 'site'; wsOpenEditor(); }); await sleep(600);
    const layout = await s.evaluate(() => ({
      dets: [...document.querySelectorAll('details.wse-det')].map((d) => d.id + ':' + (d.querySelector('[data-st]') || { textContent: '' }).textContent),
      labels: [...document.querySelectorAll('.wse-label')].map((l) => l.textContent),
      tools: [...document.querySelectorAll('.wse-trow b')].map((b) => b.textContent),
      oldPills: document.querySelectorAll('.wse-mbtn').length,
    }));
    t.ok(/^wseBizInfo:Done,wseSeo:Needs a description,wseLeads:/.test(layout.dets.join(',')), 'Site tab: Business info, Search & sharing and Leads sections show their status ' + layout.dets.join(','));
    t.ok(layout.tools.includes('Marketing copy') && layout.tools.includes('New look') && layout.tools.includes('Start a new site') && layout.oldPills === 0, 'tools are clear labelled rows, not a grid of emoji buttons ' + layout.tools.join(','));
    t.ok(layout.labels.indexOf('Grow your business') > -1 && layout.labels.indexOf('Start fresh') === layout.labels.length - 1, 'Start fresh sits apart, at the bottom ' + layout.labels.join(','));
    // checklist "Fix" opens the search section in the panel, ready to type
    await s.evaluate(() => { const row = [...document.querySelectorAll('.wse-ck, [class*=check] li, .wse-cl-row, div')].find((x) => /A search description/.test(x.textContent) && x.querySelector && [...x.querySelectorAll('button')].some((b) => /Fix/.test(b.textContent)) && x.textContent.length < 120); [...row.querySelectorAll('button')].find((b) => /Fix/.test(b.textContent)).click(); }); await sleep(500);
    t.ok(await s.evaluate(() => document.getElementById('wseSeo').open && document.activeElement && document.activeElement.id === 'wseSeoDesc' && !document.querySelector('#seoModal.on')), 'checklist Fix opens Search & sharing in the panel with the description focused (no pop-up)');
    await s.type('#wseSeoDesc', 'Relaxed hair salon in Austin for cuts, color and balayage. Book online or call us today.'); await sleep(700);
    const seo = await s.evaluate(() => ({ data: window._wsSiteData.biz.seoDescription, st: document.querySelector('#wseSeo [data-st]').textContent, prev: document.querySelector('.wse-gprev-d').textContent, html: /<meta name="description" content="Relaxed hair salon/.test(gHTML) }));
    t.ok(/^Relaxed hair salon/.test(seo.data || '') && seo.st === 'Ready' && /^Relaxed hair salon/.test(seo.prev) && seo.html, 'typing a description saves it, updates the Google preview and the status ' + JSON.stringify(seo));
    await s.evaluate(() => { const d = document.getElementById('wseSeoDesc'); d.value = ''; d.dispatchEvent(new Event('input')); [...document.querySelectorAll('#wseSeo .wse-link')].find((b) => /Write it/.test(b.textContent)).click(); }); await sleep(700);
    const draft = await s.evaluate(() => document.getElementById('wseSeoDesc').value);
    t.ok(draft.length >= 50 && draft.length <= 160 && /Glow Salon/.test(draft) && /Austin/.test(draft) && /\(512\) 555-0100/.test(draft), 'Write it for me drafts a description from the business details: ' + draft);
    // leads section: numbers, alerts, auto-reply, and a way to the inbox
    await s.evaluate(() => { document.getElementById('wseLeads').open = true; }); await sleep(800);
    t.ok(await s.evaluate(() => document.querySelectorAll('#wseLeads .wse-tile').length === 3 && !!document.querySelector('#wseLeads input[type=email]') && !!document.querySelector('#wseLeads input[type=checkbox]') && /Leads inbox|reply to leads/.test(document.getElementById('wseLeads').innerText)), 'Leads & visitors shows visits, leads, alerts, auto-reply and the inbox link');
    // the open sections survive a panel refresh
    await s.evaluate(() => wsOpenEditor()); await sleep(400);
    t.ok(await s.evaluate(() => document.getElementById('wseSeo').open && document.getElementById('wseLeads').open), 'open sections stay open when the panel refreshes');
    await s.evaluate(() => [...document.querySelectorAll('.wse-trow')].find((b) => /Marketing copy/.test(b.textContent)).click()); await sleep(400);
    t.ok(await s.evaluate(() => [...document.querySelectorAll('[id*=post i], [id*=Post]')].some((m) => m.offsetParent !== null || getComputedStyle(m).display === 'flex' || m.classList.contains('on'))), 'Marketing copy opens its tool');
    t.eq(s._wsErrors.length, 0, 'Site tab has no JS errors ' + s._wsErrors.join('; '));
    await s.close();
  }

  // Dropdown options (drawn by the OS when opened) are readable: solid dark background, light text
  {
    const d = await openPage(browser, {});
    await openStudioWith(d, base, 'Glow Salon', 'Hair salon', {});
    const bad = await d.evaluate(() => {
      const rgb = (s) => (String(s).match(/\d+(\.\d+)?/g) || []).map(Number);
      const lum = (c) => { const f = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
      const out = []; let n = 0;
      document.querySelectorAll('select option').forEach((o) => {
        n++; const cs = getComputedStyle(o); const bg = rgb(cs.backgroundColor), fg = rgb(cs.color);
        const opaque = bg.length === 3 || bg[3] === 1;
        const a = lum(fg), b = lum(bg); const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        if (!opaque || ratio < 4.5) out.push((o.parentNode.getAttribute('aria-label') || o.parentNode.className) + ': ' + o.textContent + ' ' + cs.color + ' on ' + cs.backgroundColor);
      });
      return { n, bad: out.slice(0, 3) };
    });
    t.ok(bad.n > 0 && bad.bad.length === 0, 'editor dropdown options are readable (' + bad.n + ' checked) ' + bad.bad.join(' | '));
    await d.close();
  }

  // Signed in, mid-edit: the account button in the editor opens the account menu on top of the editor
  for (const mobile of [false, true]) {
    const a = await openPage(browser, { mobile });
    await a.setRequestInterception(true);
    a.on('request', (q) => { if (new URL(q.url()).pathname === '/me') return q.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ auth: true, email: 'owner@glow.test', pro: false }) }); q.continue(); });
    await openStudioWith(a, base, 'Glow Salon', 'Hair salon', {});
    await waitFor(async () => a.evaluate(() => document.getElementById('acctBtn').classList.contains('is-authed')), 8000);
    await a.evaluate(() => document.getElementById('acctBtn').click()); await sleep(450);
    const vis = await a.evaluate(() => {
      const m = document.getElementById('acctMenu'); const r = m.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(40, r.height / 2));
      return { open: m.classList.contains('open'), onTop: !!(hit && m.contains(hit)), inView: r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1, items: m.querySelectorAll('[data-act]').length };
    });
    const tag = mobile ? 'phone: ' : '';
    t.ok(vis.open && vis.onTop && vis.inView && vis.items >= 3, tag + 'editor account button opens the account menu on top of the editor ' + JSON.stringify(vis));
    await a.evaluate(() => document.querySelector('.chat, .preview-frame-wrap, body').click()); await sleep(300);
    t.ok(await a.evaluate(() => !document.getElementById('acctMenu').classList.contains('open')), tag + 'clicking elsewhere closes it');
    t.eq(a._wsErrors.length, 0, tag + 'no JS errors ' + a._wsErrors.join('; '));
    await a.close();
  }
};
