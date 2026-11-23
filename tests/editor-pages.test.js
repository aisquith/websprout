// Editor: draft vs live (explicit "Update site"), pages (rename, address, redirects, delete, one-page sites),
// styled prompts instead of native dialogs, input validation and launch checks.
const { openPage, openStudioWith, sleep, waitFor, signIn, browserCookie } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const page = await openPage(browser, { width: 1440 });
  // Publishing needs an account: sign this browser in before the editor opens (so the site is saved to this account).
  await page.setCookie(browserCookie(base, await signIn(base, 'editor-pages@example.com')));
  const pubs = [];
  page.on('request', (q) => { if (new URL(q.url()).pathname === '/publish' && q.method() === 'POST') pubs.push(q.postData() || ''); });
  t.ok(await openStudioWith(page, base, 'Glow Salon', 'Hair salon', { city: 'Austin', phone: '512-555-0100' }), 'studio opens');
  await waitFor(async () => page.evaluate(() => !document.getElementById('qaScreen').classList.contains('on')), 8000);
  const fresh = await page.evaluate(() => wsSiteProblems().map((p) => p.id + ': ' + p.label));
  t.eq(fresh.length, 0, 'a freshly generated site has no launch problems ' + JSON.stringify(fresh));

  {
    const noisy = [];
    for (const ty of ['Restaurant', 'Plumber', 'Bakery', 'Gym', 'Photographer', 'Dentist', 'Barber shop', 'Yoga studio', 'Coffee shop', 'Landscaping']) {
      const r = await fetch(base + '/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Maple ' + ty, type: ty, city: 'Austin' }) });
      const j = await r.json();
      const ids = await page.evaluate((site) => { const keep = window._wsSiteData; window._wsSiteData = site; const out = wsSiteProblems().map((p) => p.label); window._wsSiteData = keep; return out; }, j.site);
      if (ids.length) noisy.push(ty + ': ' + ids.join('; '));
    }
    t.eq(noisy.length, 0, 'fresh sites of many kinds have no launch problems ' + noisy.join(' | '));
  }
  // ---- publish once, then edits stay a draft until "Update site"
  const slug = 'ed' + Date.now().toString(36);
  const first = await page.evaluate(async (slug) => {
    const r = await fetch('/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wsPublishPayload(slug)) });
    const j = await r.json(); if (!j.error) { localStorage.setItem('ws_slug_' + wsSid(), j.slug); wsAfterPublish(); } return j;
  }, slug);
  t.ok(first && !first.error, 'first publish works ' + JSON.stringify(first).slice(0, 120));
  await sleep(300);
  t.ok(await page.evaluate(() => { const b = document.getElementById('wsUpdBtn'); return b.offsetParent !== null && /up to date/.test(b.textContent); }), 'top bar says the live site is up to date after publishing');
  const n0 = pubs.length;
  await page.evaluate(() => { const h = wsActiveSections().find((s) => s.type === 'hero'); h.tagline = 'Draft tagline only'; wsRerender(); });
  await sleep(3500);
  t.eq(pubs.length - n0, 0, 'an edit on a live site does not publish by itself');
  const st = await page.evaluate(() => ({ un: wsHasUnpub(), txt: document.getElementById('wsUpdBtn').textContent }));
  t.ok(st.un && /Unpublished changes/.test(st.txt) && /Update site/.test(st.txt), 'top bar shows unpublished changes with Update site ' + JSON.stringify(st));
  let live = await (await fetch(base + '/s/' + first.slug)).text();
  t.ok(live.indexOf('Draft tagline only') < 0, 'the live site does not show the draft yet');
  await page.click('#wsUpdBtn'); await sleep(400);
  const modal = await page.evaluate(() => { const b = document.querySelector('.wsCfm-box'); return b ? b.innerText : ''; });
  if (modal) await page.evaluate(() => [...document.querySelectorAll('.wsCfm-btn')].find((b) => b.textContent === 'Publish anyway').click());
  await waitFor(async () => page.evaluate(() => !wsHasUnpub()), 8000);
  t.eq(pubs.length - n0, 1, 'Update site publishes once');
  t.ok(await page.evaluate(() => /up to date/.test(document.getElementById('wsUpdBtn').textContent)), 'after updating, the top bar says the live site is up to date');
  live = await (await fetch(base + '/s/' + first.slug)).text();
  t.ok(live.indexOf('Draft tagline only') > -1, 'the live site shows the edit after Update site');

  // launch problems block with a styled Fix / Publish anyway dialog
  await page.evaluate(() => { window._wsSiteData.biz.bookingUrl = 'javascript:alert(1)'; wsRerender(); });
  await sleep(1200);
  await page.click('#wsUpdBtn'); await sleep(400);
  const blk = await page.evaluate(() => { const b = document.querySelector('.wsCfm-box'); return b ? b.innerText : ''; });
  t.ok(/booking link/i.test(blk) && /Publish anyway/.test(blk) && /Fix/.test(blk), 'problems show in a Fix / Publish anyway dialog: ' + blk.replace(/\s+/g, ' ').slice(0, 160));
  const n1 = pubs.length;
  await page.evaluate(() => [...document.querySelectorAll('.wsCfm-btn')].find((b) => b.textContent === 'Fix').click()); await sleep(500);
  t.ok(pubs.length === n1 && (await page.evaluate(() => window.wsPanelTab === 'site' && document.getElementById('wseBizInfo').open)), 'Fix does not publish and opens the place to fix it');
  await page.evaluate(() => { delete window._wsSiteData.biz.bookingUrl; window.wsPanelTab = 'edit'; wsRerender(); wsOpenEditor(); });

  // ---- business info and link fields
  const biz = await page.evaluate(async () => {
    window.wsPanelTab = 'site'; window._wsDetOpen.wseBizInfo = true; wsOpenEditor();
    const f = (l) => document.querySelector('#wseBizInfo input[aria-label="' + l + '"]');
    const set = (l, v) => { const i = f(l); i.value = v; i.dispatchEvent(new Event('change')); return i; };
    const r = {};
    set('Business name', '   '); r.name = window._wsSiteData.biz.name; r.nameErr = f('Business name').parentNode.querySelector('.wse-err').textContent; r.nameBox = f('Business name').value;
    set('Online booking link (optional)', 'www.vagaro.com/glow'); r.book = window._wsSiteData.biz.bookingUrl;
    set('Online booking link (optional)', 'javascript:alert(1)'); r.book2 = window._wsSiteData.biz.bookingUrl; r.bookErr = f('Online booking link (optional)').parentNode.querySelector('.wse-err').textContent;
    set('Instagram handle', 'https://www.instagram.com/glow.salon/?hl=en'); r.ig = window._wsSiteData.biz.instagram;
    set('Instagram handle', '@glowatx'); r.ig2 = window._wsSiteData.biz.instagram;
    r.max = f('Business name').maxLength;
    r.norm = [wsNormUrl('x.com/path').value, wsNormUrl('(512) 555-0100').value, wsNormUrl('hi@x.co').value, wsNormUrl('#/contact').value, wsNormUrl('data:text/html,x').ok, wsNormUrl(' VBScript:x').ok];
    return r;
  });
  t.ok(biz.name === 'Glow Salon' && biz.nameBox === 'Glow Salon' && /empty/.test(biz.nameErr) && biz.max === 60, 'an empty business name is refused and the old name kept ' + JSON.stringify(biz));
  t.ok(biz.book === 'https://www.vagaro.com/glow' && biz.book2 === 'https://www.vagaro.com/glow' && /allowed/.test(biz.bookErr), 'booking link gets https:// and javascript: links are refused');
  t.ok(biz.ig === 'glow.salon' && biz.ig2 === 'glowatx', 'Instagram accepts a profile link or @handle and stores the handle');
  t.eq(biz.norm.join('|'), 'https://x.com/path|tel:5125550100|mailto:hi@x.co|#/contact|false|false', 'links are normalised (domains, phones, emails, anchors) and script links refused');

  // ---- pages: inline rename keeps the address, address change records a redirect
  await page.evaluate(() => { window.wsPanelTab = 'edit'; const i = window._wsSiteData.pages.findIndex((p) => p.path === 'services'); window._wsPageIdx = i >= 0 ? i : 1; wsRerender(); wsOpenEditor(); });
  await sleep(1500);
  await page.evaluate(() => wsOpenEditor());
  const before = await page.evaluate(() => { const p = window._wsSiteData.pages[wsActivePageIdx()]; return { path: p.path, title: p.title }; });
  await page.evaluate(() => [...document.querySelectorAll('#wsEdHost .wse-link')].find((b) => b.textContent === 'Rename').click()); await sleep(200);
  t.ok(await page.evaluate(() => { const i = document.querySelector('#wsePgTabs input.wse-tabin'); return !!i && document.activeElement === i && i.maxLength === 30; }), 'Rename turns the page tab into a text box (no pop-up)');
  await page.evaluate(() => document.activeElement.select());
  await page.keyboard.type('   '); await page.keyboard.press('Enter'); await sleep(200);
  t.ok(await page.evaluate(() => !!document.querySelector('#wsePgTabs input.wse-tabin') && /name/.test(document.querySelector('#wsEdHost .wse-err').textContent)), 'an empty page name shows an error and keeps editing');
  await page.evaluate(() => document.activeElement.select());
  await page.keyboard.type('Home'); await page.keyboard.press('Enter'); await sleep(200);
  t.ok(await page.evaluate(() => /already have a page/.test(document.querySelector('#wsEdHost .wse-err').textContent)), 'a duplicate page name is refused');
  await page.evaluate(() => document.activeElement.select());
  await page.keyboard.type('What we do'); await page.keyboard.press('Enter'); await sleep(400);
  const after = await page.evaluate(() => { const p = window._wsSiteData.pages[wsActivePageIdx()]; return { path: p.path, title: p.title, red: JSON.stringify(window._wsSiteData.redirects || {}) }; });
  t.ok(after.title === 'What we do' && after.path === before.path && after.red === '{}', 'renaming changes the name but not the address ' + JSON.stringify([before, after]));
  await page.evaluate(() => { const i = document.getElementById('wsePgPath'); i.value = 'Our Work!'; i.dispatchEvent(new Event('change')); }); await sleep(300);
  const moved = await page.evaluate(() => ({ path: window._wsSiteData.pages[wsActivePageIdx()].path, red: window._wsSiteData.redirects }));
  t.ok(moved.path === 'our-work' && moved.red[before.path] === 'our-work', 'changing the address slugifies it and records a redirect ' + JSON.stringify(moved));
  await page.evaluate(() => { const i = document.getElementById('wsePgPath'); i.value = 'admin'; i.dispatchEvent(new Event('change')); }); await sleep(300);
  const moved2 = await page.evaluate(() => ({ path: window._wsSiteData.pages[wsActivePageIdx()].path, red: window._wsSiteData.redirects }));
  t.ok(moved2.path === 'admin-page' && moved2.red[before.path] === 'admin-page' && moved2.red['our-work'] === 'admin-page', 'reserved addresses get a safe variant and redirect chains collapse ' + JSON.stringify(moved2));
  await page.evaluate(() => { const i = document.getElementById('wsePgPath'); i.value = 'our-work'; i.dispatchEvent(new Event('change')); }); await sleep(300);
  t.ok(await page.evaluate(() => !('our-work' in window._wsSiteData.redirects) && window._wsSiteData.redirects['admin-page'] === 'our-work'), 'a redirect is dropped when a page takes that address again');

  // ---- new blank page through the styled prompt; path comes from the title
  await page.evaluate(() => wsAddPageFromTemplate(wsPageTemplates()[0])); await sleep(300);
  t.ok(await page.evaluate(() => { const i = document.getElementById('wsPrIn'); return !!i && document.activeElement === i && i.maxLength === 30; }), 'new blank page asks for a name in a styled dialog');
  await page.keyboard.type('Contact'); await page.keyboard.press('Enter'); await sleep(200);
  t.ok(await page.evaluate(() => /already have a page/.test(document.getElementById('wsPrErr').textContent)), 'the new page dialog refuses a duplicate name');
  await page.evaluate(() => { const i = document.getElementById('wsPrIn'); i.value = '  Gift   cards '; }); await page.keyboard.press('Enter'); await sleep(500);
  const np = await page.evaluate(() => { const p = window._wsSiteData.pages[window._wsSiteData.pages.length - 1]; return p.title + '|' + p.path; });
  t.eq(np, 'Gift cards|gift-cards', 'new page title is trimmed and its address comes from the title');

  // ---- empty pages are prevented; delete page uses a danger confirm and redirects home
  await page.evaluate(() => { const s = wsActiveSections(); s.splice(1); wsRerender(1); wsOpenEditor(); });
  const nsec = await page.evaluate(() => wsActiveSections().length);
  await page.evaluate(() => document.querySelector('#wsEdHost .wse-sec .wse-ico.danger').click()); await sleep(200);
  t.eq(await page.evaluate(() => wsActiveSections().length), nsec, 'the last section on a page cannot be deleted');
  t.ok(await page.evaluate(() => /at least one section/.test(document.getElementById('toast').textContent)), 'deleting the last section explains why');
  await page.evaluate(() => [...document.querySelectorAll('#wsEdHost .wse-link')].find((b) => b.textContent === 'Delete page').click()); await sleep(300);
  const dm = await page.evaluate(() => ({ t: (document.querySelector('.wsCfm-box') || {}).innerText || '', danger: !!document.querySelector('.wsCfm-btn.danger') }));
  t.ok(/Delete the “Gift cards” page\?/.test(dm.t) && dm.danger, 'delete page asks with a styled danger dialog ' + dm.t.slice(0, 120));
  await page.evaluate(() => document.querySelector('.wsCfm-btn.danger').click()); await sleep(500);
  t.ok(await page.evaluate(() => !window._wsSiteData.pages.some((p) => p.path === 'gift-cards') && window._wsSiteData.redirects['gift-cards'] === ''), 'deleted page redirects to home');

  // ---- undo: deleting a section is its own step
  await page.evaluate(() => { window._wsPageIdx = 0; wsOpenEditor(); });
  const cnt = await page.evaluate(() => wsActiveSections().length);
  await page.evaluate(() => [...document.querySelectorAll('#wsEdHost .wse-sec .wse-ico.danger')].pop().click()); await sleep(150);
  t.eq(await page.evaluate(() => wsActiveSections().length), cnt - 1, 'section deleted');
  await page.evaluate(() => doUndo()); await sleep(400);
  t.eq(await page.evaluate(() => wsActiveSections().length), cnt, 'undo brings the deleted section straight back');

  // ---- delete down to one page: content stays in pages[0], "+ Page" is still there
  await page.evaluate(() => { const S = window._wsSiteData; const h = S.pages[0].sections.find((s) => s.type === 'hero'); h.tagline = 'One page left'; S.pages.splice(1); window._wsPageIdx = 0; wsRerender(1); wsOpenEditor(); });
  await sleep(400);
  const one = await page.evaluate(() => ({ add: [...document.querySelectorAll('#wsePgTabs .wse-tab')].map((b) => b.textContent), mirror: window._wsSiteData.sections === window._wsSiteData.pages[0].sections, html: gHTML.indexOf('One page left') > -1 }));
  t.ok(one.add.indexOf('+ Page') > -1 && one.mirror && one.html, 'a one-page site still shows Pages with + Page and keeps its edits ' + JSON.stringify(one));
  await page.evaluate(() => wsAddPageFromTemplate(wsPageTemplates().find((x) => x.id === 'about'))); await sleep(400);
  t.ok(await page.evaluate(() => window._wsSiteData.pages.length === 2 && window._wsSiteData.pages[1].path === 'about'), 'a page can be added back to a one-page site');

  // ---- launch checks flag unfinished content
  const probs = await page.evaluate(() => { const S = window._wsSiteData; S.pages.push({ id: 'pg-x', path: 'x', title: 'About', nav: true, sections: [] }); const ev = Object.assign({ id: 'events-t', type: 'events' }, window.WS.sections.events.create(S)); S.pages[0].sections.push(ev); const ids = wsSiteProblems().map((p) => p.id); S.pages.pop(); S.pages[0].sections.pop(); wsRerender(); return ids; });
  t.ok(probs.indexOf('pempty') > -1 && probs.indexOf('pdup') > -1 && probs.indexOf('blank') > -1, 'launch checks flag empty pages, duplicate names and blank lists ' + probs.join(','));

  // ---- lists: a new item is blank and clearly marked; text limits
  const li = await page.evaluate(async () => {
    window._wsPageIdx = 0; const secs = wsActiveSections(); let ix = secs.findIndex((s) => s.type === 'faq' || s.type === 'services' || s.type === 'reviews');
    if (ix < 0) { secs.push(Object.assign({ id: 'faq-t', type: 'faq' }, window.WS.sections.faq.create(window._wsSiteData))); ix = secs.length - 1; }
    wsEdSel = ix; wsOpenEditor();
    const n = document.querySelectorAll('#wsEdHost .wse-sec.on .wse-item').length;
    document.querySelector('#wsEdHost .wse-sec.on .wse-addi').click();
    await new Promise((r) => setTimeout(r, 120));
    const cards = document.querySelectorAll('#wsEdHost .wse-sec.on .wse-item');
    const last = cards[cards.length - 1];
    const title = [...document.querySelectorAll('#wsEdHost .wse-sec.on input.wse-field')].find((i) => i.getAttribute('aria-label') === 'Title');
    return { added: cards.length === n + 1, blank: last.classList.contains('blank'), hint: getComputedStyle(last.querySelector('.wse-blank-hint')).display !== 'none', focus: last.contains(document.activeElement), titleMax: title ? title.maxLength : -1 };
  });
  t.ok(li.added && li.blank && li.hint && li.focus && li.titleMax === 80, 'Add item creates a clearly marked empty item, ready to type; titles are capped ' + JSON.stringify(li));
  const fr = page.frames().find((f) => f !== page.mainFrame());
  const nameEl = fr && await fr.$('[data-wsf="biz.name"]');
  if (nameEl) {
    await nameEl.click(); await sleep(150);
    await page.keyboard.type('X'.repeat(90)); await page.keyboard.press('Enter'); await sleep(400);
    const nm = await page.evaluate(() => window._wsSiteData.biz.name.length);
    t.ok(nm <= 60, 'click-to-edit text respects the length limit (' + nm + ')');
    await page.evaluate(() => { window._wsSiteData.biz.name = 'Glow Salon'; wsRerender(); });
  } else t.fail('business name is bound for click-to-edit');

  t.eq(page._wsErrors.length, 0, 'no native dialogs or JS errors ' + page._wsErrors.join('; '));
  await page.close();
};
