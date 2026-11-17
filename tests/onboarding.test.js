// Setup onboarding: "What do you offer?" service chips and "Why do customers pick you?".
//  - /api/suggest runs the generator's own category matching: real services for known trades, none for nonsense,
//    trade examples for the "why" field, input validated and capped, same-origin only
//  - in Chrome: typing a business type shows chips with the top three picked; chips toggle (aria-pressed), the owner can
//    add their own, and /create carries the picked chips as servicesText (the generated site lists them)
//  - the why field sits under the chips, feeds `unique`, and rotates trade examples as its placeholder
//  - phone (390px): chips wrap with 44px tap targets and nothing scrolls sideways; axe passes on the new controls
//  - a bridal shop gets bridal copy, not generic retail ("Gift wrapping", "Click and collect")
const fs = require('fs');
const path = require('path');
const { createSite, openPage, sleep, waitFor } = require('./lib');
const AXE = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const sug = async (type, headers) => { const r = await fetch(base + '/api/suggest?type=' + encodeURIComponent(type), { headers: headers || {} }); let j = null; try { j = await r.json(); } catch (e) {} return { status: r.status, j, h: r.headers }; };

  // ---- /api/suggest ----
  {
    const p = await sug('Plumber');
    t.ok(p.status === 200 && p.j && p.j.ok && p.j.category === 'home', 'suggest answers for a plumber (' + p.status + ' ' + JSON.stringify(p.j && p.j.category) + ')');
    const ps = (p.j && p.j.services) || [];
    t.ok(ps.length >= 6 && ps.length <= 10 && ps.indexOf('Leak repairs') > -1 && ps.indexOf('Drain clearing') > -1 && !ps.some((s) => /Free Estimates|Quality Work/.test(s)), 'a plumber gets plumbing services, not generic trade filler: ' + ps.join(' / '));
    t.ok(new Set(ps.map((s) => s.toLowerCase())).size === ps.length, 'suggested services have no duplicates');
    t.ok(Array.isArray(p.j.why) && p.j.why.length >= 2 && p.j.why.length <= 3 && p.j.why.every((w) => typeof w === 'string' && w.length > 8 && w.length < 90), 'a plumber gets 2-3 example "why" lines: ' + JSON.stringify(p.j.why));
    t.ok(/application\/json/.test(p.h.get('content-type') || '') && /max-age/.test(p.h.get('cache-control') || ''), 'suggest is JSON and cacheable');
    const s = await sug('Security company');
    const ss = (s.j && s.j.services) || [];
    t.ok(s.j && s.j.category === 'security' && ss.length >= 6 && ss.indexOf('Camera systems') > -1 && ss.indexOf('Alarm systems') > -1, 'a security company gets security services: ' + ss.join(' / '));
    t.ok((s.j.why || []).some((w) => /site survey|install/i.test(w)), 'a security company gets security examples for "why": ' + JSON.stringify(s.j.why));
    const b = await sug('bakery');
    const bs = (b.j && b.j.services) || [];
    t.ok(b.j && b.j.category === 'bakery' && bs.length >= 6 && bs.some((x) => /bread/i.test(x)) && bs.some((x) => /cake/i.test(x)), 'a bakery gets bakery services: ' + bs.join(' / '));
    const n = await sug('xqzvv blorptastic');
    t.ok(n.status === 200 && n.j && n.j.ok && Array.isArray(n.j.services) && n.j.services.length === 0 && n.j.category === 'generic', 'a nonsense type gets no made-up services (' + JSON.stringify(n.j) + ')');
    const e = await sug('');
    t.ok(e.status === 200 && e.j && e.j.services.length === 0 && e.j.why.length === 0, 'an empty type gets nothing');
    const long = await sug('Plumber '.repeat(30));
    t.ok(long.status === 400 && long.j && long.j.ok === false && long.j.services.length === 0, 'an over-long type is refused (' + long.status + ')');
    const tags = await sug('<script>alert(1)</script> plumber');
    t.ok(tags.status === 200 && !/<script/i.test(JSON.stringify(tags.j)), 'markup in the type never comes back');
    const xo = await sug('Plumber', { 'sec-fetch-site': 'cross-site' });
    t.ok(xo.status === 403, 'a cross-site request is refused (' + xo.status + ')');
    const cust = await fetch(base + '/api/suggest?type=Plumber', { headers: { 'x-ws-test-host': 'joes.websprout.app' } });
    t.ok(cust.status === 403, 'customer sites cannot call it (' + cust.status + ')');
    const post = await fetch(base + '/api/suggest?type=Plumber', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    t.ok(!/json/.test(post.headers.get('content-type') || ''), 'only GET answers (' + post.status + ' ' + post.headers.get('content-type') + ')');
    // Rate limit (test servers apply it only to requests that name a test IP).
    const ip = { 'x-ws-test-ip': '10.77.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250) };
    let last = 0; for (let i = 0; i < 241; i++) { last = (await sug('Bakery', ip)).status; if (last === 429) break; }
    t.eq(last, 429, 'suggest is rate-limited per IP');
    // Bridal: a proper sub-type, not generic retail.
    const br = await sug('Bridal shop');
    const brs = (br.j && br.j.services) || [];
    t.ok(br.j && br.j.category === 'retail' && brs.indexOf('Bridal gowns') > -1 && brs.indexOf('Alterations') > -1 && brs.some((x) => /accessor/i.test(x)) && brs.some((x) => /appointment/i.test(x)) && !brs.some((x) => /Gift wrapping|Click and collect/.test(x)), 'a bridal shop gets bridal services: ' + brs.join(' / '));
  }

  // ---- the generator: bridal copy, and picked chips become the site's services ----
  {
    const j = await createSite(base, { name: 'Ivory Lane', type: 'Bridal shop', city: 'Austin' });
    const txt = JSON.stringify(j.site.pages);
    t.ok(!/Gift wrapping|Click and collect/.test(txt) && /Bridal gowns/.test(txt) && /Alterations/.test(txt), 'a bridal shop site has bridal services, not gift wrapping or click and collect');
    t.ok(j.site.biz.bookLabel === 'Book an appointment' && !/Shop the collection|order online/i.test(txt), 'a bridal shop books appointments instead of selling online (' + j.site.biz.bookLabel + ')');
    const own = await createSite(base, { name: 'Lock & Key Security', type: 'Security company', servicesText: 'Camera systems\nAccess control\nGate intercoms', unique: 'Free site survey, and we install everything ourselves' });
    const svc = own.site.pages.flatMap((p) => p.sections).filter((s) => s.type === 'services')[0];
    const names = svc ? svc.items.map((i) => i.name) : [];
    t.ok(names.join('|') === 'Camera systems|Access control|Gate intercoms', 'the owner-confirmed services are the site\'s services: ' + names.join(' / '));
    t.ok(svc && svc.items[0].text && svc.items[0].emoji && svc.items[2].text, 'a picked starter service keeps its description and icon; a custom one still gets a line');
    // A services list plus servicesText merge, without repeats.
    const mix = await createSite(base, { name: 'Drip', type: 'Plumber', services: [{ name: 'Leak repairs' }], servicesText: 'leak repairs\nWater heaters' });
    const mixN = mix.site.pages.flatMap((p) => p.sections).filter((s) => s.type === 'services')[0].items.map((i) => i.name);
    t.ok(mixN.join('|') === 'Leak repairs|Water heaters', 'services and servicesText merge without duplicates: ' + mixN.join(' / '));
  }

  // ---- the setup form in Chrome ----
  const setup = async (page) => { await page.goto(base + '/', { waitUntil: 'networkidle2' }); await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); };
  const state = (page) => page.evaluate(() => {
    const w = document.getElementById('svcWrap');
    const chips = [...document.querySelectorAll('#svcChips .svc-chip')].map((b) => ({ name: b.textContent, on: b.getAttribute('aria-pressed') === 'true', tag: b.tagName, type: b.type }));
    return { shown: !!w && !w.hidden && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().height > 0, chips, picked: chips.filter((c) => c.on).map((c) => c.name), hint: (document.getElementById('svcHint') || {}).textContent || '', why: !!document.getElementById('moreUnique') && !document.getElementById('moreUnique').closest('[hidden]') && !document.getElementById('moreUnique').closest('details'), ph: (document.getElementById('moreUnique') || {}).placeholder || '' };
  });
  {
    const page = await openPage(browser, { width: 1280 });
    await setup(page);
    t.ok(!(await state(page)).shown, 'no chips before a business type is entered');
    await page.type('#bizName', 'Maple Street Plumbing');
    await page.type('#bizType', 'Plumber');
    await waitFor(async () => (await state(page)).chips.length > 0, 8000, 150);
    let st = await state(page);
    t.ok(st.shown && st.chips.length >= 6 && st.chips.every((c) => c.tag === 'BUTTON' && c.type === 'button'), 'typing a business type shows a row of chip buttons (' + st.chips.length + ')');
    t.eq(st.picked.length, 3, 'the top three suggestions are picked');
    t.ok(st.picked[0] === 'Leak repairs', 'chips come from the plumber suggestions: ' + st.picked.join(' / '));
    t.ok(st.why, '"Why do customers pick you?" is visible right under the chips, not in the collapsed box');
    t.ok(/^e\.g\. /.test(st.ph) && /same-day|Licensed|Emergency/i.test(st.ph), 'the why field shows a trade example as its placeholder: ' + st.ph);
    // toggle: unpick the first, pick the fifth
    await page.click('#svcChips .svc-chip[data-i="0"]');
    await page.click('#svcChips .svc-chip[data-i="4"]');
    st = await state(page);
    t.ok(!st.chips[0].on && st.chips[4].on && st.picked.length === 3, 'tapping a chip toggles it (aria-pressed)');
    // keyboard: focus a chip and press space
    await page.focus('#svcChips .svc-chip[data-i="5"]'); await page.keyboard.press('Space');
    st = await state(page);
    t.ok(st.chips[5].on, 'chips toggle from the keyboard');
    // add your own (Enter), and a duplicate is not added twice
    await page.type('#svcAdd', 'Sump pumps'); await page.keyboard.press('Enter');
    await page.type('#svcAdd', 'sump pumps'); await page.keyboard.press('Enter');
    st = await state(page);
    t.ok(st.chips.filter((c) => c.name.toLowerCase() === 'sump pumps').length === 1 && st.picked.indexOf('Sump pumps') > -1, 'Enter adds your own chip, picked, without duplicates');
    t.ok(await page.evaluate(() => document.getElementById('svcAdd').value === '' && document.activeElement && document.activeElement.id === 'svcAdd'), 'the add box clears and keeps focus for the next one');
    // the cap
    await page.evaluate(() => { const a = document.getElementById('svcAdd'); ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].forEach((x) => { a.value = x; a.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }); });
    st = await state(page);
    t.ok(st.picked.length === 8 && /up to 8/.test(st.hint), 'no more than 8 can be picked, and the form says so (' + st.picked.length + ', ' + st.hint + ')');
    t.ok(await page.evaluate(() => document.getElementById('svcAdd').maxLength === 40), 'your own chip is capped at 40 characters');
    // the same type typed again keeps the picks; the why answer is sent as `unique`
    await page.evaluate(() => { document.getElementById('bizType').value = 'Plumbers'; document.getElementById('bizType').dispatchEvent(new Event('input', { bubbles: true })); });
    await sleep(900);
    const kept = (await state(page)).picked;
    t.ok(kept.join('|') === st.picked.join('|'), 'a small change to the type keeps the picks (' + kept.join(' / ') + ')');
    await page.type('#moreUnique', 'Same-day visits and upfront prices');
    let sent = null;
    await page.setRequestInterception(true);
    page.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') sent = q.postData(); q.continue(); });
    await page.evaluate(() => doCreateV3());
    await waitFor(async () => !!sent, 15000, 150);
    let body = {}; try { body = JSON.parse(sent || '{}'); } catch (e) {}
    const lines = String(body.servicesText || '').split('\n');
    t.ok(lines.join('|') === kept.join('|'), '/create carries the picked chips as servicesText (' + JSON.stringify(body.servicesText) + ')');
    t.ok(body.unique === 'Same-day visits and upfront prices' && body.type === 'Plumbers' && body.name === 'Maple Street Plumbing', '/create still sends name, type and the why answer as unique');
    const built = await waitFor(() => page.evaluate(() => !!window._wsSiteData), 30000, 300);
    const siteSvc = built ? await page.evaluate(() => { const S = window._wsSiteData; const secs = (S.pages || [{ sections: S.sections }]).flatMap((p) => p.sections).filter((s) => s.type === 'services').sort((a, b) => b.items.length - a.items.length); return secs[0] ? secs[0].items.map((i) => i.name) : []; }) : [];
    t.ok(siteSvc.join('|') === kept.join('|'), 'the generated site lists the picked services: ' + siteSvc.join(' / '));
    // New site clears the chips
    await page.evaluate(() => { try { wsLeaveStudio(); wsSvcReset(); } catch (e) {} });
    t.ok(!(await state(page)).shown && (await state(page)).chips.length === 0, 'starting over clears the chips');
    t.eq(page._wsErrors.join(' | '), '', 'no JS errors in setup');
    await page.close();
  }
  // unknown type: only "add your own", with a friendly prompt; nothing picked is sent
  {
    const page = await openPage(browser, { width: 1280 });
    await setup(page);
    await page.type('#bizType', 'Xqzvv blorptastic');
    await page.evaluate(() => document.getElementById('bizName').focus());
    await waitFor(async () => (await state(page)).shown, 8000, 150);
    const st = await state(page);
    t.ok(st.shown && st.chips.length === 0 && /Add the main things you offer/.test(st.hint) && st.why, 'an unknown type shows only "add your own" with a friendly prompt (' + st.hint + ')');
    t.ok(await page.evaluate(() => /Add something you offer/.test(document.getElementById('svcAdd').placeholder)), 'the add box asks what you offer');
    let sent = null;
    await page.setRequestInterception(true);
    page.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') { sent = q.postData(); q.abort(); } else q.continue(); });
    await page.evaluate(() => doCreateV3());
    await waitFor(async () => !!sent, 15000, 150);
    t.ok(sent && !('servicesText' in JSON.parse(sent)), 'with nothing picked, no servicesText is sent');
    await page.close();
  }
  // phone: wraps, 44px targets, no sideways scroll; axe on the new controls
  {
    const page = await openPage(browser, { mobile: true });
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await setup(page);
    await page.type('#bizType', 'Security company');
    await waitFor(async () => (await state(page)).chips.length > 0, 8000, 150);
    await sleep(500);
    const m = await page.evaluate(() => {
      const chips = [...document.querySelectorAll('#svcChips .svc-chip')];
      const r = chips.map((c) => c.getBoundingClientRect());
      const card = document.querySelector('.builder-card').getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, w: innerWidth, minH: Math.min(...r.map((x) => x.height)), rows: new Set(r.map((x) => Math.round(x.top))).size, inside: r.every((x) => x.left >= card.left - 1 && x.right <= card.right + 1), add: document.getElementById('svcAdd').getBoundingClientRect().height, why: document.getElementById('moreUnique').getBoundingClientRect().height };
    });
    t.ok(m.sw <= m.w, 'no horizontal overflow at 390px (' + m.sw + ' > ' + m.w + ')');
    t.ok(m.minH >= 44 && m.add >= 44 && m.why >= 44, 'chips, the add box and the why field are at least 44px tall (' + m.minH + ', ' + m.add + ', ' + m.why + ')');
    t.ok(m.rows >= 2 && m.inside, 'chips wrap onto several rows inside the card (' + m.rows + ' rows)');
    await page.addScriptTag({ content: AXE });
    const v = await page.evaluate(async () => { const r = await window.axe.run({ include: [['#svcWrap']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }, resultTypes: ['violations'] }); return r.violations.map((x) => x.id + ' (' + x.nodes.length + ')'); });
    t.eq(v.join(', '), '', 'axe finds no WCAG A/AA problems in the chips and why field');
    t.eq(page._wsErrors.join(' | '), '', 'no JS errors on the phone');
    await page.close();
  }
};
