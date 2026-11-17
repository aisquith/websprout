// "Wow" round: headline-first openings (cinema / collage) as the default for most families, proof chips only from
// real facts, the bento services grid with a real photo, the bold numbers band, richer palettes and type, specific
// section headings, never a title-only service card, motion that respects reduced motion and never hides content
// without JS, and AA text over the cinema scrim even on a pure white photo. Engine + generator in Node with a
// stand-in fetch (Unsplash faked); rendering checks in Chrome.
const fs = require('fs');
const path = require('path');
const { sleep } = require('./lib');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
const UNS = (n) => ({ results: Array.from({ length: n }, (_, i) => ({ id: 'w' + i, urls: { regular: 'https://images.unsplash.com/photo-w' + i + '?ixid=1' }, user: { name: 'U' + i, links: { html: 'https://unsplash.com/@u' + i } }, links: { download_location: 'https://api.unsplash.com/photos/w' + i + '/download' } })) });
const WHITE = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'><rect width='1600' height='1000' fill='#fff'/></svg>");

module.exports = async function (ctx, t) {
  const SRC = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, v3PhotoScore, v3PhotoRel, v3Starter, WSENGINE };';
  const K = new Function('fetch', SRC)(async (u) => (String(u).indexOf('/search/photos') > -1 ? json(UNS(8)) : json({}, 404)));
  const W = K.WSENGINE;
  const PH = { UNSPLASH_ACCESS_KEY: 'x' };
  const home = (s) => s.pages[0].sections;
  const hero = (s) => home(s).find((x) => x.type === 'hero');

  // ---- A. headline-first openings are the default for most families, and only with a photo ----
  {
    const fams = { Plumber: 'trades', Roofer: 'trades', 'Dog groomer': 'beauty', 'Hair salon': 'beauty', 'Mexican restaurant': 'food', 'Law firm': 'pro', Accountant: 'pro', Florist: 'creative' };
    const by = {}; let bare = 0;
    for (const type of Object.keys(fams)) for (let i = 0; i < 8; i++) {
      const s = (await K.buildV3Site({ name: 'Biz ' + i, type, city: 'Tulsa, OK' }, PH, {})).site;
      const h = hero(s); (by[type] = by[type] || []).push(h.variant);
      if (!s.photos[h.id + '.photo'] && /^(cinema|collage)$/.test(h.variant)) bare++;
      const s2 = (await K.buildV3Site({ name: 'Biz ' + i, type, city: 'Tulsa, OK' }, {}, {})).site;
      if (/^(cinema|collage)$/.test(hero(s2).variant)) bare++;
    }
    const share = Object.keys(by).map((k) => [k, by[k].filter((v) => /^(cinema|collage)$/.test(v)).length / by[k].length]);
    t.ok(share.every((x) => x[1] >= 0.5), 'with a photo most openings are headline-first (' + share.map((x) => x[0] + ' ' + Math.round(x[1] * 100) + '%').join(', ') + ')');
    t.ok(new Set(Object.values(by).flat()).size >= 3 && Object.values(by).some((v) => v.indexOf('cinema') > -1) && Object.values(by).some((v) => v.indexOf('collage') > -1), 'different businesses get different openings (' + [...new Set(Object.values(by).flat())] + ')');
    t.eq(bare, 0, 'without a photo the headline-first layouts are never picked');
  }

  // ---- B. the cinema opening: tagline headline, name as a label, proof only from real facts ----
  {
    const mk = (biz, variant) => { const site = W.starterSite(Object.assign({ name: 'Summit Roofing', type: 'Roofer', city: 'Tulsa, OK', phone: '918-555-0188', tagline: 'Roofs built to last.' }, biz), { stack: ['hero', 'cta'] }); site.palette = 'w_navy'; const h = site.sections[0]; h.variant = variant || 'cinema'; h.tagline = 'Roofs built to last.'; h.sub = 'Serving homes across Tulsa.'; site.photos[h.id + '.photo'] = 'https://images.unsplash.com/photo-x?w=1600'; return site; };
    const html = W.renderSite(mk({}), { mode: 'live' });
    t.ok(/<h1 class="hc-h[^"]*">Roofs built to last\.<\/h1>/.test(html) && /<p class="hc-eb">Summit Roofing/.test(html), 'the tagline is the headline and the business name a small label above it');
    t.ok(!/class="hc-chips|class="hc-card/.test(html), 'no facts given: no proof chips and no proof card (nothing invented)');
    t.ok(/class="top over"/.test(html), 'the header sits over the full-bleed photo');
    const real = W.renderSite(mk({ founded: '2009', licensed: true, insured: true, towns: 'Jenks, Owasso' }), { mode: 'live' });
    const yrs = new Date().getFullYear() - 2009;
    t.ok(new RegExp('data-founded="2009">' + yrs + '</b>').test(real) && /Licensed &amp; insured/.test(real) && /Serving Tulsa/.test(real), 'real facts become the proof card (years, counting up) and chips (licensed and insured, area)');
    t.ok(!/Google rating|class="hc-stars/.test(real), 'never a rating without a linked Google listing');
    const g = W.renderSite(mk({ googlePlaceId: 'ChIJ_abcdefghij', googleRating: 4.8, googleReviews: 132 }), { mode: 'live' });
    t.ok(/data-count="4\.8"/.test(g) && /132 reviews/.test(g), 'a linked listing’s real rating leads the proof card');
    const own = mk({}); own.sections[0].title = 'Storm damage? We can help.';
    const oh = W.renderSite(own, { mode: 'live' });
    t.ok(/<h1 class="hc-h[^"]*">Storm damage\? We can help\.<\/h1>/.test(oh) && /<p class="hc-sub">Roofs built to last\.<\/p>/.test(oh), 'an owner title wins, with the tagline under it');
    const ed = W.renderSite(mk({}, 'collage'), { mode: 'edit' });
    t.ok(/data-slot="[^"]+\.photo"/.test(ed) && /data-slot="[^"]+\.photo2"/.test(ed) && /data-sec=/.test(ed), 'the collage keeps editable photo slots (main and second) and the section hook in the editor');
    t.ok(W.sections.hero.fields.some((f) => f.key === 'sub' && f.only && f.only.indexOf('cinema') > -1), 'the supporting line is an editable field for the new layouts');
    const noimg = mk({}); noimg.photos = {};
    t.ok(/hero-cinema on-base hero-noimg/.test(W.renderSite(noimg, { mode: 'live' })), 'switching to cinema without a photo falls back to the designed gradient');
  }

  // ---- C. services: bento with a real photo, never a title-only card ----
  {
    let titleOnly = 0, bento = 0, bentoPic = 0;
    for (const type of ['Plumber', 'Roofer', 'Dog groomer', 'Law firm', 'Florist', 'Barber', 'Yoga studio', 'Mexican restaurant']) for (let i = 0; i < 5; i++) {
      const s = (await K.buildV3Site({ name: 'Shop ' + i, type, city: 'Austin, TX', servicesText: 'Alpha thing\nBeta thing\nGamma thing\nDelta thing' }, PH, {})).site;
      s.pages.forEach((p) => p.sections.forEach((x) => { if (x.type === 'services') (x.items || []).forEach((it) => { if (!String(it.text || '').trim()) titleOnly++; }); }));
      const b = home(s).find((x) => x.type === 'services' && x.variant === 'bento');
      if (b) { bento++; if (s.photos[b.id + '.photo']) bentoPic++; }
    }
    t.eq(titleOnly, 0, 'every service card has a line of text, even when the owner typed only names');
    t.ok(bento >= 10 && bentoPic / bento >= 0.6, 'the bento grid is common on home and usually shows a real photo (' + bentoPic + ' of ' + bento + ')');
    const site = W.starterSite({ name: 'X', type: 'Plumber' }, { stack: ['services'] });
    site.sections[0].variant = 'bento'; site.sections[0].items = [{ name: 'Leaks', text: 'Fixed.' }, { name: 'Heaters', text: 'Fitted.' }, { name: 'Drains', text: 'Cleared.' }];
    const h1 = W.renderSite(site, { mode: 'live' });
    t.ok(/sb-feat sb-nopic/.test(h1) && (h1.match(/class="sb-card"/g) || []).length === 2, 'without a photo the feature card is a designed color card, plus the other services as cards');
  }

  // ---- D. trust band only from real data; headings sound like the business ----
  {
    const s = W.starterSite({ name: 'R', type: 'Roofer', city: 'Tulsa, OK', founded: '2009', licensed: true, insured: true, towns: 'Jenks, Owasso, Bixby' }, { stack: ['trust'] });
    s.sections[0].variant = 'band';
    const h = (W.renderSite(s, { mode: 'live' }).match(/<section[^>]*trust-band[\s\S]*?<\/section>/) || [''])[0];
    t.ok(/trust-band on-pop/.test(h) && /data-src="years" data-founded="2009"/.test(h) && /Licensed &amp; insured/.test(h) && />4<\/span><\/p><p class="tbb-l">Towns served/.test(h) && !/★/.test(h), 'the numbers band shows real years, towns and licensing, and no rating without Google');
    const why = [], area = [];
    for (let i = 0; i < 10; i++) { const x = (await K.buildV3Site({ name: 'Roof ' + i, type: 'Roofer', city: 'Tulsa, OK', towns: 'Jenks, Owasso', licensed: true, insured: true, unique: 'Free inspections with photo reports' }, {}, {})).site; x.pages.forEach((p) => p.sections.forEach((y) => { if (y.type === 'why') why.push(y.title); if (y.type === 'area') area.push(y.title); })); }
    t.ok(why.length && why.every((x) => x !== 'Why choose us') && why.some((x) => /Tulsa/.test(x)), 'why headings are specific to the business and town (' + [...new Set(why)].join(' / ') + ')');
    t.ok(area.length && area.some((x) => /Tulsa/.test(x)), 'service-area headings name the town (' + [...new Set(area)].join(' / ') + ')');
  }

  // ---- E. identity: wider palettes and type, light where it must be ----
  {
    const pals = new Set(), types = new Set(); let darkBad = 0;
    for (const type of ['Plumber', 'Roofer', 'Dog groomer', 'Yoga studio', 'Florist', 'Law firm', 'Barber', 'Mexican restaurant', 'Landscaping', 'Day spa']) for (let i = 0; i < 6; i++) {
      const s = (await K.buildV3Site({ name: 'Co ' + i, type, city: 'Austin' }, {}, {})).site; pals.add(s.palette.replace(/^[wb]_/, '')); types.add(s.typeset);
      if (/Yoga|Florist|Law|spa/.test(type) && /^b_/.test(s.palette)) darkBad++;
    }
    const blue = [...pals].filter((p) => /indigo|ocean|navy|slate|lagoon|teal/.test(p)).length;
    t.ok(pals.size >= 12 && blue / pals.size < 0.4, 'colors vary well beyond blue (' + [...pals].join(', ') + ')');
    t.ok(['sturdy', 'geo', 'elegant', 'warm'].every((x) => types.has(x)), 'the new type pairings are used (' + [...types].join(', ') + ')');
    t.eq(darkBad, 0, 'yoga, florists, law firms and spas stay light by default');
    const bad = W.palettes.filter((p) => /^[wb]_(forest|sage|navy|clay|berry|olive|lagoon|oxblood)$/.test(p.id) && (W.contrast(p.accent, p.accentText) < 4.5 || W.contrast(p.accent, p.base) < 3 || W.contrast(p.baseText, p.base) < 7)).map((p) => p.id);
    t.eq(bad.join(','), '', 'the new palettes pass contrast (buttons, accents, body text)');
  }

  // ---- F. photos: people at work beat textures ----
  {
    const sc = K.v3Starter('Roofer', {});
    const rel = K.v3PhotoRel({ type: 'Roofer', services: [] }, sc);
    const work = K.v3PhotoScore({ txt: 'roofer working on a roof with shingles' }, rel), tex = K.v3PhotoScore({ txt: 'close-up texture of brown roof shingles' }, rel);
    t.ok(work > tex, 'a roofer at work outranks a close-up of shingles (' + work + ' vs ' + tex + ')');
    t.ok(/working|installing|contractor/.test(String(sc.photoQuery)), 'roofer searches ask for people at work (' + sc.photoQuery + ')');
  }

  // ---- C2. galleries never render an empty tile (after the bento/collage borrow photos too) ----
  {
    const bad = []; let seen = 0;
    for (const type of ['Mexican restaurant', 'Plumber', 'Roofer', 'Dog groomer', 'Hair salon', 'Florist', 'Yoga studio', 'Law firm', 'Barber', 'Bakery']) for (let i = 0; i < 5; i++) {
      const r = await K.buildV3Site({ name: 'Gal ' + i, type, city: 'Austin, TX' }, PH, {});
      (r.html.match(/<section[^>]*class="gallery[^"]*"[\s\S]*?<\/section>/g) || []).forEach((g) => {
        seen++;
        const figs = g.match(/<figure class="slot g\d[^"]*"[^>]*>[\s\S]*?<\/figure>/g) || [];
        const shown = figs.filter((f) => !/\shidden[\s>]/.test(f.slice(0, f.indexOf('>') + 1)));
        const empty = shown.filter((f) => !/<img src="[^"]+"/.test(f));
        const gn = +((g.match(/\bgn(\d)\b/) || [])[1]);
        if (empty.length || !shown.length || gn !== shown.length) bad.push(type + ' ' + i + ': ' + shown.length + ' shown, ' + empty.length + ' empty, gn' + gn);
      });
    }
    t.ok(seen >= 10, 'galleries are generated (' + seen + ')');
    t.eq(bad.join(' | '), '', 'every gallery tile that renders has a photo, and the layout matches the photo count');
  }

  // ---- G. in Chrome: AA text over the scrim on a white photo; reduced motion; content visible without JS ----
  if (ctx.browser) {
    const sharp = require('sharp');
    const site = W.starterSite({ name: 'Summit Roofing', type: 'Roofer', city: 'Tulsa, OK', phone: '918-555-0188', founded: '2009', licensed: true, insured: true, towns: 'Jenks' }, { stack: ['hero', 'intro', 'cta'] });
    site.palette = 'w_clay'; site.typeset = 'sturdy';
    const h = site.sections[0]; h.variant = 'cinema'; h.tagline = 'Roofs built to last, and storm repairs done fast.'; h.sub = 'Serving homes across Tulsa, with careful work and a tidy finish.';
    site.photos[h.id + '.photo'] = WHITE;
    const html = W.renderSite(site, { mode: 'live' });
    const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    for (const vp of [{ width: 1280, height: 860 }, { width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844, isMobile: true, hasTouch: true }]) {
      const page = await ctx.browser.newPage();
      try {
        await page.setViewport(vp);
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await page.goto(ctx.base + '/terms');
        await page.setContent(html, { waitUntil: 'load' });
        await sleep(300);
        const boxes = await page.evaluate(() => {
          document.querySelectorAll('.top,.ws-bar,.ws-top').forEach((x) => x.remove());
          const st = document.createElement('style'); st.textContent = '.hero *{color:transparent!important;text-shadow:none!important} .hero svg{visibility:hidden}'; document.head.appendChild(st);
          window.scrollTo(0, 0);
          return [...document.querySelectorAll('.hc-eb,.hc-h,.hc-sub,.hc-chips span,.hc-cap,.hc-num b')].map((el) => { const r = el.getBoundingClientRect(); return { k: el.className || el.tagName, x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), w: Math.ceil(r.width), h: Math.ceil(r.height), big: parseFloat(getComputedStyle(el).fontSize) >= 24 }; }).filter((b) => b.w > 2 && b.h > 2);
        });
        const shot = await page.screenshot({ fullPage: true });
        const img = sharp(shot); const meta = await img.metadata(); const raw = await img.raw().toBuffer(); const ch = meta.channels;
        const worst = [];
        boxes.forEach((b) => {
          let mx = 0;
          for (let y = b.y; y < Math.min(meta.height, b.y + b.h); y += 2) for (let x = b.x; x < Math.min(meta.width, b.x + b.w); x += 2) { const i = (y * meta.width + x) * ch; const L = lum(raw[i], raw[i + 1], raw[i + 2]); if (L > mx) mx = L; }
          const c = 1.05 / (mx + 0.05);
          if (c < (b.big ? 3 : 4.5)) worst.push(b.k + ' ' + c.toFixed(2));
        });
        t.ok(boxes.length >= 5 && !worst.length, 'white hero text stays AA over a pure white photo at ' + vp.width + 'px (' + (worst.join(', ') || boxes.length + ' text boxes ok') + ')');
      } finally { await page.close(); }
    }
    // reduced motion: no entrance animation, everything at full opacity at once
    {
      const page = await ctx.browser.newPage();
      try {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await page.goto(ctx.base + '/terms'); await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const r = await page.evaluate(() => { const el = document.querySelector('.hc-h'); const cs = getComputedStyle(el); return { an: cs.animationName, op: cs.opacity, js: document.body.classList.contains('js') }; });
        t.ok(r.js && r.an === 'none' && r.op === '1', 'with reduced motion the opening shows at once, unanimated (' + JSON.stringify(r) + ')');
      } finally { await page.close(); }
    }
    // normal motion: the staggered entrance runs (and only because the runtime marked the page)
    {
      const page = await ctx.browser.newPage();
      try {
        await page.goto(ctx.base + '/terms'); await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const an = await page.evaluate(() => getComputedStyle(document.querySelector('.hc-h')).animationName);
        t.eq(an, 'wsRise', 'the opening has a staggered entrance');
      } finally { await page.close(); }
    }
    // a gallery photo that fails to load: the tile drops out and the layout follows; none left, no gallery
    for (const broken of [1, 3]) {
      const s3 = W.starterSite({ name: 'G', type: 'Bakery' }, { stack: ['gallery'] });
      const g = s3.sections[0]; g.variant = 'bento';
      ['p0', 'p1', 'p2'].forEach((k, i) => { s3.photos[g.id + '.' + k] = i < broken ? 'data:image/png;base64,AAAA' : WHITE; });
      for (const vp of [{ width: 1280, height: 860 }, { width: 390, height: 844, isMobile: true }]) {
        const page = await ctx.browser.newPage();
        try {
          await page.setViewport(vp);
          await page.goto(ctx.base + '/terms'); await page.setContent(W.renderSite(s3, { mode: 'live' }), { waitUntil: 'load' });
          await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
          await sleep(500);
          const r = await page.evaluate(() => { const sec = document.querySelector('section.gallery'); const vis = sec && !sec.hidden && sec.getBoundingClientRect().height > 0; const empty = [...document.querySelectorAll('.gallery figure')].filter((f) => f.getBoundingClientRect().height > 0 && !(f.querySelector('img') && f.querySelector('img').naturalWidth > 0)).length; return { vis, empty, cls: sec ? sec.className : '' }; });
          t.ok(r.empty === 0 && (broken === 3 ? !r.vis : r.vis && /\bgn2\b/.test(r.cls)), 'a gallery with ' + broken + ' broken photo(s) shows no empty tile at ' + vp.width + 'px (' + JSON.stringify(r) + ')');
        } finally { await page.close(); }
      }
    }
    // no JavaScript: every part of the opening and the bento cards are visible
    {
      const s2 = W.starterSite({ name: 'X', type: 'Plumber', city: 'Austin' }, { stack: ['hero', 'services', 'trust'] });
      s2.sections[0].variant = 'collage'; s2.sections[0].tagline = 'Leaks fixed.'; s2.photos[s2.sections[0].id + '.photo'] = WHITE;
      s2.sections[1].variant = 'bento'; s2.sections[1].items = [{ name: 'A', text: 'a' }, { name: 'B', text: 'b' }, { name: 'C', text: 'c' }];
      const page = await ctx.browser.newPage();
      try {
        await page.setJavaScriptEnabled(false);
        await page.goto(ctx.base + '/terms'); await page.setContent(W.renderSite(s2, { mode: 'live' }), { waitUntil: 'domcontentloaded' });
        await sleep(200);
        const r = await page.evaluate(() => [...document.querySelectorAll('.hc-copy>*,.hcl-main,.sb>li')].map((el) => { const cs = getComputedStyle(el); return cs.opacity === '1' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0; }));
        t.ok(r.length >= 6 && r.every(Boolean), 'without JavaScript the opening and the service cards are fully visible (' + r.filter(Boolean).length + '/' + r.length + ')');
      } finally { await page.close(); }
    }
  }
};
