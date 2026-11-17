// Trust, "why us", service area, open FAQ, the one-column visit band, automatic logos, header contrast over photos,
// and the optional "Tell us a bit more" setup answers.
//  - trust / why / area render nothing without real data; trust needs two badges
//  - visit with no address and no hours: heading, contact rows and buttons in one block (never detached)
//  - automatic logos (wordmark / icon / monogram / badge) fit the header at 390px and 1280px, short and long names
//  - header text and button over a very light and a very dark photo keep AA contrast (measured from pixels)
//  - setup shows credentials / towns only for the right business types and sends them to /create as JSON
const { createSite, openPage, openStudioWith, sleep, waitFor } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const WS = new Function('globalThis', (await (await fetch(base + '/ws-engine.js')).text()) + ';return globalThis.WS;')({});
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const plain = clone((await createSite(base, { name: 'Maple Street Plumber', type: 'Plumber', city: 'Springfield', phone: '555-010-0123', unique: 'Upfront prices and same-day visits.', founded: '2009', licensed: true, insured: true, towns: 'Springfield, Shelbyville\nOgdenville' })).site);
  t.ok(plain && plain.biz, '/create accepts the new optional answers');
  const bare = (biz) => { const s = clone(plain); s.biz = Object.assign({ name: 'Maple Street Plumber', type: 'Plumber', city: 'Springfield', phone: '555-010-0123' }, biz || {}); return s; };
  const R = (site, sec, mode) => WS.renderSection(site, Object.assign({ id: sec.type + '-t' }, sec), mode || 'live');

  // ---- trust / why / area: real data only ----
  t.eq(R(bare(), { type: 'trust', variant: 'strip' }), '', 'trust renders nothing without data');
  t.eq(R(bare({ licensed: true }), { type: 'trust', variant: 'strip' }), '', 'trust renders nothing with a single badge');
  const tr = R(bare({ licensed: true, insured: true, founded: '2009', towns: ['Springfield', 'Shelbyville'] }), { type: 'trust', variant: 'strip' });
  t.ok(/Licensed/.test(tr) && /Insured/.test(tr) && /Since 2009/.test(tr) && /Serving Springfield/.test(tr) && (tr.match(/<li/g) || []).length === 4, 'trust strip shows licensed, insured, since-year and area badges');
  t.ok((tr.match(/<svg class="ico/g) || []).length === 4, 'every trust badge has a line icon');
  t.ok(/trust-cards/.test(R(bare({ licensed: true, insured: true }), { type: 'trust', variant: 'cards' })), 'trust cards variant renders');
  const g = R(bare({ founded: '2001', googlePlaceId: 'ChIJ_test_place_123', googleRating: 4.86, googleReviews: 312 }), { type: 'trust' });
  t.ok(/data-glive hidden[\s\S]*data-g="rating"[\s\S]* on Google/.test(g) && !/4\.9 on|312 review/.test(g), 'trust shows the Google rating live (hidden until Google answers), never a stored number');
  t.ok(!/on Google/.test(R(bare({ founded: '2001', licensed: true, googleRating: 4.86 }), { type: 'trust' })), 'no Google rating badge without a linked listing');
  t.eq(R(bare({ licensed: true, insured: true }), { type: 'trust', licensed: false }), '', 'a section toggle turns a badge off');
  t.eq(R(bare({ founded: '3020', licensed: true }), { type: 'trust' }), '', 'a future founding year is ignored');
  t.eq(R(bare(), { type: 'why', items: [] }), '', 'why renders nothing without points');
  t.eq(R(bare(), { type: 'why', items: [{ icon: '', title: ' ', text: '' }] }), '', 'why ignores blank points');
  const wc = WS.sections.why.create(bare({ unique: 'Same-day visits', licensed: true, founded: '2009' }));
  t.ok(wc.items.length === 3 && /Same-day/.test(wc.items[0].text) && wc.items.every((x) => WS.ICONS[x.icon]), 'why starts from the real answers, three points with icons');
  const wy = R(bare(), Object.assign({ type: 'why', variant: 'split' }, { items: wc.items }));
  t.ok(/why-nopic/.test(wy) && !/<figure/.test(wy), 'why split without a photo falls back to heading beside the points');
  t.eq(R(bare(), { type: 'area' }), '', 'area renders nothing without towns');
  const ar = R(bare({ towns: ['Springfield', 'springfield', ' Shelbyville '] }), { type: 'area' });
  t.ok((ar.match(/<li>/g) || []).length === 2 && /Areas we serve/.test(ar) && /tel:/.test(ar), 'area shows de-duplicated towns, a heading and a call button');
  t.eq(WS.townList('A, B\nC; D,,  ,' + Array.from({ length: 20 }, (_, i) => 'T' + i).join(',')).length, 12, 'town list keeps at most 12 tidy names');
  t.ok(/Ogden/.test(R(bare(), { type: 'area', towns: 'Ogdenville, Brockway' })), 'towns typed in the section are used');

  // ---- FAQ: answers render, open variant shows them all ----
  const fq = [{ q: 'Do you handle emergencies?', a: 'Yes, call us any time.' }, { q: 'Free quotes?', a: 'Always.' }];
  const acc = R(bare(), { type: 'faq', variant: 'accordion', items: fq });
  t.ok((acc.match(/<details>/g) || []).length === 2 && /<p>Yes, call us any time\.<\/p>/.test(acc), 'accordion FAQ items carry their answers');
  const op = R(bare(), { type: 'faq', variant: 'open', items: fq });
  t.ok(!/<details/.test(op) && (op.match(/class="qa-i"/g) || []).length === 2 && /Always\./.test(op), 'open FAQ shows every answer without accordions');

  // ---- visit with no address / hours: one block ----
  const vs = R(bare(), { type: 'visit', title: 'Serving Springfield and nearby.' });
  t.ok(/visit-solo/.test(vs) && /<div class="v-info v-solo"><div class="sh">.*Serving Springfield and nearby\..*<table class="hours reach".*<div class="actions">.*<\/div><\/div><\/div><\/section>$/.test(vs), 'visit without an address or hours keeps heading, contact rows and buttons together');
  t.ok(!/visit-solo/.test(R(bare({ address: '1 Main St, Springfield' }), { type: 'visit' })), 'visit with an address keeps the map layout');

  // ---- browser: visit / area layout, logos, header contrast ----
  const solid = async (pg, hex) => Buffer.from(await pg.evaluate((h) => { const c = document.createElement('canvas'); c.width = 1200; c.height = 800; const x = c.getContext('2d'); x.fillStyle = h; x.fillRect(0, 0, 1200, 800); return c.toDataURL('image/jpeg', 0.9).split(',')[1]; }, hex), 'base64');
  const mk = async (width, mobile) => {
    const p = await browser.newPage();
    await p.setViewport(mobile ? { width, height: 844, isMobile: true, hasTouch: true } : { width, height: 860 });
    await p.goto(base + '/terms');
    const light = await solid(p, '#F7F7F5'), dark = await solid(p, '#0B0B0C');
    await p.setRequestInterception(true);
    p.on('request', (q) => { const u = q.url(); if (/images\.unsplash\.com/.test(u)) return q.respond({ status: 200, contentType: 'image/jpeg', body: /light/.test(u) ? light : dark }); if (u.startsWith(base) || u.startsWith('data:') || /fonts\.(googleapis|gstatic)\.com/.test(u) || u === 'about:blank') return q.continue(); return q.abort(); });
    return p;
  };
  const show = async (pg, html) => {
    await pg.setContent(html, { waitUntil: 'domcontentloaded' });
    await pg.evaluate(async () => { const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}.rv{opacity:1!important;transform:none!important}'; document.head.appendChild(st); await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]); await Promise.race([Promise.all([...document.images].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })))), new Promise((r) => setTimeout(r, 2500))]); window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll')); await new Promise((r) => setTimeout(r, 150)); });
  };
  const phone = await mk(390, true), desk = await mk(1280, false);
  const pages = [[phone, 390], [desk, 1280]];

  // visit + area: the heading, rows and buttons sit together (no heading-less block, no buttons far below)
  {
    const s = bare({ towns: ['Springfield', 'Shelbyville', 'Ogdenville'] }); s.pages = null;
    s.sections = [{ id: 'h1', type: 'hero', variant: 'split' }, { id: 'v1', type: 'visit', title: 'Serving Springfield and nearby.' }, { id: 'a1', type: 'area' }];
    const bad = [];
    for (const [pg, w] of pages) {
      await show(pg, WS.renderSite(s, { mode: 'live' }));
      const r = await pg.evaluate(() => ['.visit', '.area'].map((sel) => {
        const sec = document.querySelector(sel); if (!sec) return sel + ' missing';
        const h = sec.querySelector('h2'), a = sec.querySelector('.actions');
        if (!h || !h.textContent.trim() || h.getBoundingClientRect().height < 10) return sel + ' has no visible heading';
        if (!a) return sel + ' has no buttons';
        const gap = a.getBoundingClientRect().top - h.getBoundingClientRect().bottom;
        const blk = [...sec.querySelectorAll('.wrap > *')].filter((x) => x.getBoundingClientRect().height > 0 && !x.contains(h) && !x.contains(a) && x.querySelector('h1,h2,h3') == null && x.textContent.trim() && !x.matches('.ar-towns'));
        return gap > 260 ? sel + ' buttons are ' + Math.round(gap) + 'px below the heading' : blk.length ? sel + ' has a block without a heading: ' + blk[0].className : '';
      }).filter(Boolean).join(', '));
      if (r) bad.push(w + 'px: ' + r);
    }
    t.eq(bad.join(' | '), '', 'visit and area bands keep their heading, rows and buttons together on phone and desktop');
  }

  // logos: four styles, short and long names, phone and desktop
  {
    const bad = [];
    for (const name of ['Hartley & Reed', 'Greenfield Landscaping & Hardscaping Professionals of Central Texas']) {
      for (const style of ['wordmark', 'icon', 'monogram', 'badge']) {
        for (const ts of ['bold', 'classic']) {
          const s = bare({ name, type: 'Landscaping' }); s.logoMark = { style }; s.typeset = ts;
          const html = WS.renderSite(s, { mode: 'live' });
          for (const [pg, w] of pages) {
            await show(pg, html);
            const r = await pg.evaluate((short) => {
              const m = document.querySelector('header .mark'), n = m && m.querySelector('.mk-name'), sym = m && m.querySelector('.mk-sym');
              if (!m || !n) return 'no automatic logo';
              const mr = m.getBoundingClientRect(), out = [];
              const right = [...document.querySelectorAll('header .pill, header .navtoggle, header nav a')].filter((x) => x.getClientRects().length && getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().width > 0).map((x) => x.getBoundingClientRect().left);
              if (right.length && mr.right > Math.min.apply(null, right) - 4) out.push('logo runs into the header buttons');
              if (mr.left < 0 || mr.right > innerWidth) out.push('logo leaves the screen');
              const lh = parseFloat(getComputedStyle(n).lineHeight) || parseFloat(getComputedStyle(n).fontSize) * 1.1;
              if (n.getBoundingClientRect().height > lh * 2.3) out.push('name takes more than two lines');
              if (short && n.scrollHeight > n.clientHeight + lh * 0.6) out.push('short name is cut off');
              if (m.classList.contains('mks-wordmark') ? !!sym : !(sym && sym.getBoundingClientRect().width >= 14)) out.push('mark symbol wrong');
              const fb = document.querySelector('.foot-brand .mk-name'); if (!fb || fb.textContent.trim() === '') out.push('footer logo missing');
              return out.join(', ');
            }, name.length < 20);
            if (r) bad.push(style + '/' + ts + ' ' + w + 'px "' + name.slice(0, 18) + '": ' + r);
          }
        }
      }
    }
    t.eq(bad.join(' | '), '', 'automatic logos (wordmark, icon, monogram, badge) fit the header at 390px and 1280px');
    const s = bare(); s.logoMark = { style: 'badge', icon: 'droplet' };
    const fav = decodeURIComponent((WS.renderSite(s, { mode: 'live' }).match(/rel="icon" href="data:image\/svg\+xml,([^"]+)"/) || [])[1] || '');
    t.ok(fav.indexOf(WS.ICONS.droplet.replace(/'/g, '"').slice(0, 30)) > -1, 'favicon uses the logo mark when no logo is uploaded');
    s.biz.logo = 'https://example.com/logo.png';
    const up = WS.renderSite(s, { mode: 'live' });
    t.ok(/class="mark has-logo/.test(up) && !/mk-badge/.test((up.match(/<header[\s\S]*?<\/header>/) || [''])[0]), 'an uploaded logo always wins over the automatic one');
  }

  // header over a very light and a very dark photo: text and the outline button keep contrast
  {
    const bad = [];
    const L = (r, g2, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g2) + 0.0722 * f(b); };
    for (const shade of ['light', 'dark']) {
      for (const [variant, pal] of [['photo', 'w_mono'], ['center', 'b_teal'], ['photo', 'butter']]) {
        const s = clone((await createSite(base, { name: 'Hartley & Reed', type: 'Law firm', city: 'Boston', phone: '617-555-0166' })).site); s.palette = pal;
        const hero = WS.allSections(s).find((x) => x.type === 'hero'); hero.variant = variant; s.photos = s.photos || {}; s.photos[hero.id + '.photo'] = 'https://images.unsplash.com/photo-' + shade + '?w=1680';
        for (const [pg, w] of pages) {
          await pg.bringToFront(); await show(pg, WS.renderSite(s, { mode: 'live' }));
          const info = await pg.evaluate(() => {
            const h = document.querySelector('header.top'); if (!h.classList.contains('over')) return { err: 'header is not in over-photo mode' };
            const els = [h.querySelector('.mk-name'), h.querySelector('.pill'), ...[...h.querySelectorAll('nav a')].slice(0, 2)].filter((x) => x && x.getClientRects().length && x.getBoundingClientRect().width > 0 && getComputedStyle(x).display !== 'none');
            const items = els.map((x) => { const r = x.getBoundingClientRect(); return { k: x.className || x.tagName, color: getComputedStyle(x).color, clip: { x: Math.max(0, r.left + 2), y: Math.max(0, r.top + 2), width: Math.max(4, r.width - 4), height: Math.max(4, r.height - 4) } }; });
            const st = document.createElement('style'); st.id = 'qa-hide'; st.textContent = 'header.top *{color:transparent!important;text-shadow:none!important}header.top .pill{border-color:transparent!important}header.top .mk-sym{visibility:hidden}'; document.head.appendChild(st);
            return { items };
          });
          if (info.err) { bad.push(shade + ' ' + variant + ' ' + w + 'px: ' + info.err); continue; }
          for (const it of info.items) {
            const b64 = await pg.screenshot({ clip: it.clip, encoding: 'base64' });
            const max = await pg.evaluate(async (b) => { const im = new Image(); im.src = 'data:image/png;base64,' + b; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; const px = []; for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]); return px; }, b64);
            const lums = max.map((p) => L(p[0], p[1], p[2])).sort((a, b2) => a - b2), bg = lums[Math.floor(lums.length * 0.98)] || 0;
            const fg = (it.color.match(/[0-9.]+/g) || []).slice(0, 3).map(Number), fl = L(fg[0], fg[1], fg[2]);
            const cr = (Math.max(fl, bg) + 0.05) / (Math.min(fl, bg) + 0.05);
            if (cr < 4.5) bad.push(shade + ' photo, ' + variant + '/' + pal + ' ' + w + 'px ' + String(it.k).slice(0, 20) + ' contrast ' + cr.toFixed(2));
          }
          await pg.evaluate(() => { const st = document.getElementById('qa-hide'); if (st) st.remove(); });
        }
      }
    }
    t.eq(bad.join(' | '), '', 'header name, links and button keep 4.5:1 contrast over a very light and a very dark photo');
  }
  await phone.close(); await desk.close();

  // ---- setup: "Tell us a bit more" ----
  {
    const page = await openPage(browser, { width: 1280 });
    await page.goto(base + '/', { waitUntil: 'networkidle2' });
    const vis = (id) => page.evaluate((i) => { const el = document.getElementById(i); return !!el && !el.closest('[hidden]'); }, id);
    t.ok(await page.evaluate(() => !!document.getElementById('moreBox') && !document.getElementById('moreBox').open), 'setup has a collapsed "Tell us a bit more" group');
    await page.evaluate(() => { document.getElementById('moreBox').open = true; });
    await page.type('#bizType', 'Bakery');
    // "Why do customers pick you?" (moreUnique) now sits under the service chips, revealed once the type is entered.
    await waitFor(() => vis('moreUnique'), 8000, 150);
    t.ok(!(await vis('moreLicWrap')) && !(await vis('moreAreaWrap')) && (await vis('moreUnique')) && (await vis('moreFounded')), 'a bakery is asked what makes it different and the year, not credentials or towns');
    await page.evaluate(() => { const el = document.getElementById('bizType'); el.value = ''; });
    await page.type('#bizType', 'Plumber');
    t.ok((await vis('moreLicWrap')) && (await vis('moreAreaWrap')) && (await vis('moreTowns')), 'a plumber is also asked about licence, insurance and towns');
    await page.click('#moreWhere [data-where="come"]');
    t.ok(!(await vis('moreTowns')), '"Customers come to us" hides the towns field');
    await page.click('#moreWhere [data-where="go"]');
    t.ok(!(await page.evaluate(() => /services/i.test(document.getElementById('moreBox').textContent))), 'no services box in setup');
    await page.evaluate(() => { document.getElementById('bizName').value = 'Maple Street Plumber'; document.getElementById('moreUnique').value = 'Same-day visits'; document.getElementById('moreFounded').value = '2009'; document.getElementById('moreLicensed').checked = true; document.getElementById('moreInsured').checked = true; document.getElementById('moreTowns').value = 'Springfield, Shelbyville'; });
    let sent = null;
    await page.setRequestInterception(true);
    page.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') sent = { body: q.postData(), ct: q.headers()['content-type'] || '' }; q.continue(); });
    await page.evaluate(() => doCreateV3());
    await waitFor(async () => !!sent, 15000, 200);
    let body = {}; try { body = JSON.parse((sent && sent.body) || '{}'); } catch (e) {}
    t.ok(sent && /application\/json/.test(sent.ct), '/create is posted as JSON');
    t.ok(body.unique === 'Same-day visits' && body.founded === '2009' && body.licensed === true && body.insured === true && body.towns === 'Springfield, Shelbyville', 'setup sends unique, founded, licensed, insured and towns (' + JSON.stringify(body).slice(0, 200) + ')');
    await page.close();
    const p2 = await openPage(browser, { width: 1280 });
    await p2.goto(base + '/', { waitUntil: 'networkidle2' });
    let sent2 = null; await p2.setRequestInterception(true);
    p2.on('request', (q) => { if (/\/create$/.test(q.url()) && q.method() === 'POST') sent2 = q.postData(); q.continue(); });
    await p2.evaluate(() => { document.getElementById('bizName').value = 'Crumb'; document.getElementById('bizType').value = 'Bakery'; document.getElementById('moreLicensed').checked = true; document.getElementById('moreTowns').value = 'Nowhere'; document.getElementById('moreFounded').value = '1700'; doCreateV3(); });
    await waitFor(async () => !!sent2, 15000, 200);
    let b2 = {}; try { b2 = JSON.parse(sent2 || '{}'); } catch (e) {}
    t.ok(!('licensed' in b2) && !('towns' in b2) && !('founded' in b2), 'answers that do not apply (or an impossible year) are not sent');
    await p2.close();
  }

  // ---- editor: logo style picker ----
  {
    const page = await openPage(browser, { width: 1440 });
    t.ok(await openStudioWith(page, base, 'Hartley & Reed', 'Law firm', { city: 'Boston' }), 'studio opens');
    await page.evaluate(() => { const sd = window._wsSiteData; delete sd.logoMark; if (sd.biz) delete sd.biz.logo; window.wsPanelTab = 'design'; wsRerender(true); wsOpenEditor(); });
    await sleep(300);
    const n = await page.evaluate(() => document.querySelectorAll('#wsEdHost [data-logo-style]').length);
    t.eq(n, 4, 'design tab offers four logo styles');
    await page.evaluate(() => document.querySelector('#wsEdHost [data-logo-style="badge"]').click());
    await sleep(400);
    const st = await page.evaluate(() => ({ m: window._wsSiteData.logoMark, html: /class="mark mk mks-badge/.test(gHTML), icon: !!document.querySelector('#wsEdHost select.wse-logo-icon'), up: [...document.querySelectorAll('#wsEdHost button')].some((b) => /Upload my own/.test(b.textContent)) }));
    t.ok(st.m && st.m.style === 'badge' && st.html, 'picking Badge saves site.logoMark and re-renders the header');
    t.ok(st.icon && st.up, 'badge style shows the icon picker, and "Upload my own" stays available');
    await page.evaluate(() => { const s = document.querySelector('#wsEdHost select.wse-logo-icon'); s.value = 'scale'; s.dispatchEvent(new Event('change')); });
    await sleep(300);
    t.eq(await page.evaluate(() => window._wsSiteData.logoMark.icon), 'scale', 'the logo icon picker changes the mark');
    await page.close();
  }
};
