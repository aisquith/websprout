// Visual QA: generated sites for ~40 business types across the three looks (light / dark / colorful), every page on
// a phone (390px) and home + main page on desktop (1280px). Layout checks: no sideways scrolling, no text spilling
// out of its box, no empty or zero-height sections, no broken images, the fixed header never covers the first
// section's text, and text contrast (axe color-contrast, phone home pages only: quality.test.js runs the full axe set).
// Stock photos are stubbed (tests have no Unsplash key): every other site gets photos so photo layouts are covered.
const fs = require('fs');
const path = require('path');
const { createSite, sleep } = require('./lib');

const AXE = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const TYPES = ['Barber shop', 'Hair salon', 'Bakery', 'Coffee shop', 'Italian restaurant', 'Lawn care', 'House cleaning', 'Auto repair', 'Dentist', 'Law firm', 'Fitness gym', 'Pet grooming', 'Photographer', 'Gift shop', 'Boat repair', 'Real estate agent', '',
  'Plumber', 'Electrician', 'HVAC repair', 'Roofing contractor', 'House painter', 'General contractor', 'Locksmith', 'Chiropractor', 'Physical therapy', 'Daycare', 'Tutoring', 'Florist', 'Food truck', 'Pet sitting', 'Massage therapy', 'Yoga studio', 'Nail salon', 'Car detailing', 'Appliance repair', 'Junk removal', 'Tailor', 'Music lessons'];
const QUICK = ['Barber shop', 'Plumber', 'Food truck', 'Law firm', 'Nail salon', ''];
const LOOKS = ['light', 'dark', 'colorful'];
// Real-world stress: long business names, a long single word, long service names.
const STRESS = [
  { type: 'Landscaping', name: 'Greenfield Landscaping & Hardscaping Professionals of Central Texas', servicesText: 'Complete landscape design and installation consultation - $150\nWeekly residential lawn maintenance program - $65\nIrrigation system repair, winterization and seasonal tune-ups' },
  { type: 'Bakery', name: 'Schwarzwaldkirschtorte Konditorei', servicesText: 'Custom celebration cakes - $45\nSourdough' },
  { type: 'Electrician', name: 'Bright Spark Electrical Contractors', servicesText: 'Electrical panel upgrades and replacements - $1,200\nWhole-home surge protection installation - $350\nEV charger installation' },
];

// Runs in the page: layout problems on the page that is showing.
function inspect(opts) {
  const out = [];
  const W = opts.width; // (a phone zooms out to fit wide content, so innerWidth would grow with the bug)
  const root = document.querySelector('.ws-page.on') || document.querySelector('main') || document.body;
  const vis = (el) => { if (!el.getClientRects().length) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05; };
  const name = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) + '"');
  // 1. sideways scrolling
  const sw = document.documentElement.scrollWidth;
  if (sw > W + 1) {
    const wide = [...document.querySelectorAll('body *')].filter((el) => vis(el) && el.getBoundingClientRect().right > W + 1 && !el.closest('nav') && getComputedStyle(el).position !== 'fixed').slice(-1)[0];
    out.push({ k: 'overflow', m: 'page is ' + sw + 'px wide' + (wide ? ', e.g. ' + name(wide) : '') });
  }
  // 2. text spilling out of its box (scrollers like galleries and phone menus are intentional)
  const scrollerOf = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll') return n; } return null; };
  root.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,dt,dd,label,.btn,button,.pill,.tag,.eyebrow,.kicker,td,th').forEach((el) => {
    if (!vis(el) || el.closest('[hidden]') || scrollerOf(el)) return;
    const cs = getComputedStyle(el); if (cs.display === 'inline' || cs.display === 'contents') return;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) out.push({ k: 'text-overflow', m: name(el) + ' content ' + el.scrollWidth + 'px in a ' + el.clientWidth + 'px box' });
    else { const r = el.getBoundingClientRect(); if (r.right > W + 1 || r.left < -1) out.push({ k: 'text-offscreen', m: name(el) + ' spans ' + Math.round(r.left) + '..' + Math.round(r.right) + 'px' }); }
  });
  [...document.querySelectorAll('header.top .pill, header.top .mark')].forEach((el) => { if (vis(el) && el.scrollWidth > el.clientWidth + 1) out.push({ k: 'text-overflow', m: 'header ' + name(el) }); });
  // 3. empty / zero-height sections
  root.querySelectorAll('section').forEach((s) => {
    if (s.hidden || s.closest('[hidden]') || getComputedStyle(s).display === 'none') return;
    if (s.offsetHeight < 8) { out.push({ k: 'empty-section', m: name(s) + ' has zero height' }); return; }
    const hd = s.querySelector('h1,h2,h3');
    if (!hd) return;
    const rest = (s.innerText || '').replace(hd.innerText || '', '').trim();
    const media = s.querySelector('img,iframe,form,input,video,svg,.slot:not(.empty),.btn,a[href]');
    if (rest.length < 3 && !media) out.push({ k: 'empty-section', m: name(s) + ' has a heading but no content' });
  });
  // 4. broken images (emoji images replace themselves with text on error; anything left must have loaded)
  root.querySelectorAll('img').forEach((im) => { if (vis(im) && im.complete && im.naturalWidth === 0) out.push({ k: 'broken-image', m: (im.currentSrc || im.src).slice(0, 90) }); });
  document.querySelectorAll('header img').forEach((im) => { if (vis(im) && im.complete && im.naturalWidth === 0) out.push({ k: 'broken-image', m: 'header ' + (im.currentSrc || im.src).slice(0, 90) }); });
  // 5. the fixed header must not cover the first section's text
  const hdr = document.querySelector('header.top');
  const first = [...root.children].find((x) => vis(x) && x.offsetHeight > 0);
  if (hdr && first && vis(hdr)) {
    const hb = hdr.getBoundingClientRect().bottom;
    const txt = [...first.querySelectorAll('h1,h2,h3,p,.eyebrow,.status,.btn')].find((x) => vis(x) && x.getBoundingClientRect().height > 0);
    if (txt && txt.getBoundingClientRect().top < hb - 1) out.push({ k: 'header-overlap', m: name(txt) + ' top ' + Math.round(txt.getBoundingClientRect().top) + 'px is under the header (bottom ' + Math.round(hb) + 'px)' });
  }
  return out;
}

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const WS = new Function('globalThis', (await (await fetch(base + '/ws-engine.js')).text()) + ';return globalThis.WS;')({});
  const t0 = Date.now();
  const mk = async (width, mobile) => {
    const p = await browser.newPage();
    await p.setViewport(mobile ? { width, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { width, height: 860 });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).split('\n')[0])); p._errs = errs;
    await p.goto(base + '/terms');
    // Stub photos (and anything but fonts and emoji) so the run is offline-safe and fast.
    const photo = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 1200; c.height = 800; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 1200, 800); g.addColorStop(0, '#5a6b7c'); g.addColorStop(1, '#c9b49a'); x.fillStyle = g; x.fillRect(0, 0, 1200, 800); return c.toDataURL('image/jpeg', 0.6).split(',')[1]; });
    const buf = Buffer.from(photo, 'base64');
    await p.setRequestInterception(true);
    p.on('request', (q) => {
      const u = q.url();
      if (/^https:\/\/(images\.unsplash\.com|websprout\.app\/api\/place-photo)/.test(u)) return q.respond({ status: 200, contentType: 'image/jpeg', body: buf });
      if (/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//.test(u) || u.startsWith(base) || u.startsWith('data:') || u === 'about:blank') return q.continue();
      return q.abort();
    });
    return p;
  };
  const phone = await mk(390, true), desk = await mk(1280, false);
  const found = {};
  const note = (k, where, m) => { found[k] = found[k] || []; found[k].push(where + ': ' + m); };
  const prep = async (page, html) => {
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
      const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}.reveal,.rv,[data-reveal]{opacity:1!important;transform:none!important}'; document.head.appendChild(st);
      document.documentElement.classList.add('ws-qa');
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
    });
  };
  const show = async (page, p) => {
    await page.evaluate((h) => { if (document.querySelector('.ws-page')) location.hash = '/' + h; scrollTo(0, 0); }, p);
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 60)); // (not rAF: a background tab gets no frames)
      const imgs = [...document.querySelectorAll('.ws-page.on img, main img, header img')].filter((im) => im.getClientRects().length);
      imgs.forEach((im) => { im.loading = 'eager'; });
      await Promise.race([Promise.all(imgs.map((im) => (im.complete ? 0 : new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', () => setTimeout(r, 30), { once: true }); })))), new Promise((r) => setTimeout(r, 3000))]);
    });
  };
  const types = (ctx.quick ? QUICK : TYPES).map((ty, i) => ({ type: ty, name: ty ? (ty.split(' ')[0] + ' & Sons ' + ['Studio', 'Company', 'Collective'][i % 3]) : 'Northgate Business Co' })).concat(STRESS);
  let checked = 0;
  for (let i = 0; i < types.length; i++) {
    const ty = types[i].type, look = LOOKS[i % 3];
    const j = await createSite(base, { name: types[i].name, type: ty, look, city: 'Austin', address: '1200 Riverside Dr, Austin, TX 78704', phone: '512-555-0100', servicesText: types[i].servicesText || 'Consultation - $40\nFull service package - $120\nSeasonal maintenance visit' });
    const site = JSON.parse(JSON.stringify(j.site));
    if (i % 2) { // photo layouts
      const secs = WS.allSections(site); site.photos = site.photos || {};
      secs.forEach((s, n) => { if (/^(hero|intro|cta|team|gallery)$/.test(s.type)) site.photos[s.id + '.photo'] = 'https://images.unsplash.com/photo-' + (1000 + n) + '?w=1680&q=75'; });
      const h = secs.find((s) => s.type === 'hero'); if (h) h.variant = ['photo', 'split'][(i >> 1) % 2];
    } else { const h = WS.allSections(site).find((s) => s.type === 'hero'); if (h && i % 4 === 0) h.variant = 'type'; }
    const html = WS.renderSite(site, { mode: 'live' });
    if (process.env.WS_VQ_LOG) console.log('  ' + ((Date.now() - t0) / 1000).toFixed(1) + 's ' + (ty || 'generic'));
    const label = (ty || 'generic') + (types[i].servicesText ? ' "' + types[i].name.slice(0, 24) + '"' : '') + ' [' + look + '/' + site.palette + '/' + site.typeset + ']';
    const pages = (site.pages || [{ path: '' }]).map((p) => p.path || '');
    for (const [page, w, list] of [[phone, 390, pages], [desk, 1280, pages.slice(0, 2)]]) {
      await prep(page, html);
      if (page === phone) await page.addScriptTag({ content: AXE });
      for (const p of list) {
        await show(page, p);
        const where = label + ' ' + w + 'px ' + (p || 'home');
        (await page.evaluate(inspect, { width: w })).forEach((x) => note(x.k, where, x.m));
        if (page === phone && !p) {
          const v = await page.evaluate(async () => { const r = await window.axe.run(document.querySelector('.ws-page.on') ? { include: [['.ws-page.on'], ['header'], ['footer']] } : document, { runOnly: { type: 'rule', values: ['color-contrast'] }, resultTypes: ['violations'] }); return r.violations.map((x) => x.nodes.slice(0, 2).map((n) => n.target.join(' ') + ' ' + String(n.failureSummary || '').split('\n').slice(1, 2).join('')).join(' | ')); });
          v.forEach((m) => note('contrast', where, m.slice(0, 220)));
        }
        checked++;
      }
    }
  }
  // Canary: a page with planted faults proves the checks can fail (they are not vacuously green).
  {
    const site = JSON.parse(JSON.stringify((await createSite(base, { name: 'Canary Co', type: 'Plumber' })).site));
    const bad = '<section class="on-base qa-empty"><div class="wrap"><h2>Nothing here</h2></div></section><section class="on-base"><div class="wrap"><p style="width:200px;overflow:hidden;white-space:nowrap">This sentence is much too long to fit inside its little box</p><img src="/no-such-image.png" alt="" style="width:40px;height:40px"></div></section><div style="width:900px;height:4px"></div>';
    const html = WS.renderSite(site, { mode: 'live' }).replace(/(<div class="ws-page on[^>]*>)/, '$1' + bad);
    await prep(phone, html); await show(phone, '');
    const ks = new Set((await phone.evaluate(inspect, { width: 390 })).map((x) => x.k));
    t.eq(['header-overlap', 'empty-section', 'text-overflow', 'overflow', 'broken-image'].filter((k) => !ks.has(k)).join(','), '', 'visual checks catch planted faults (header overlap, empty section, clipped text, sideways scroll, broken image)');
  }
  for (const pg of [phone, desk]) { pg._errs.forEach((m) => note('js-error', 'page', m)); await pg.close(); }
  const kinds = ['overflow', 'text-overflow', 'text-offscreen', 'empty-section', 'broken-image', 'header-overlap', 'contrast', 'js-error'];
  const labels = { overflow: 'no page scrolls sideways', 'text-overflow': 'no text spills out of its box', 'text-offscreen': 'no text runs off the screen', 'empty-section': 'no empty or zero-height sections', 'broken-image': 'no broken images', 'header-overlap': 'the header never covers the first section', contrast: 'text contrast meets AA (axe color-contrast)', 'js-error': 'no JS errors' };
  kinds.forEach((k) => { const f = found[k] || []; t.ok(!f.length, labels[k] + (f.length ? ' (' + f.length + ') e.g. ' + f.slice(0, 4).join(' || ') : '')); });
  t.ok(checked > 0, 'visual QA checked ' + checked + ' page views across ' + types.length + ' business types in ' + Math.round((Date.now() - t0) / 1000) + 's');
};
