// Generated-site quality: palettes that fit the kind of business, page rhythm (section tones by position), photos
// spread over long text runs, no lonely location block without an address, why points that are never fragments,
// crisper AI copy, a retry when Gemini is busy, and logo icons that fit. Runs the engine + generator in Node with a
// stand-in fetch (Unsplash and Gemini faked).
const fs = require('fs');
const path = require('path');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv() { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); } }; }
const UNS = (n) => ({ results: Array.from({ length: n }, (_, i) => ({ id: 'q' + i, urls: { regular: 'https://images.unsplash.com/photo-q' + i + '?ixid=1' }, user: { name: 'U' + i, links: { html: 'https://unsplash.com/@u' + i } }, links: { download_location: 'https://api.unsplash.com/photos/q' + i + '/download' } })) });

module.exports = async function (ctx, t) {
  const SRC = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, v3UniqueTitle, v3LogoMark, v3Starter, v3AiCheck, WSENGINE };';
  // kit(gemini) → generator whose Unsplash returns 8 photos and whose Gemini answers with gemini(call, n).
  const kit = (gemini) => {
    const calls = [];
    const K = new Function('fetch', SRC)(async (u, o) => {
      u = String(u);
      if (u.indexOf('/search/photos') > -1) return json(UNS(8));
      if (u.indexOf('generativelanguage') > -1) { calls.push(o); const r = gemini ? await gemini(o, calls.length) : {}; return r instanceof Response ? r : json({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] }); }
      return json({}, 404);
    });
    return { K, calls };
  };
  const { K } = kit();
  const W = K.WSENGINE;
  const PH = { UNSPLASH_ACCESS_KEY: 'x' };
  const home = (s) => s.pages[0].sections;
  const homeHtml = (html) => (html.split('data-path=""')[1] || '').split('data-path="')[0];
  const tones = (html) => (homeHtml(html).match(/<section\b[^>]*?\bclass="[^"]*"/g) || []).map((x) => { const c = x.replace(/^.*class="/, ''); return { type: c.split(' ')[0], tone: (c.match(/\bon-(base|alt|pop|soft)\b/) || [])[1] || '' }; });

  // ---- A. palettes fit the business: light for health, professional, family and daytime food; dark only where it suits ----
  {
    const light = ['Dentist', 'Accountant', 'Law firm', 'Daycare', 'House cleaning', 'Florist', 'Bakery', 'Coffee shop', 'Day spa', 'Yoga studio', 'Chiropractor', 'Tax preparer'];
    const bad = [];
    for (const type of light) for (let i = 0; i < 30; i++) { const p = (await K.buildV3Site({ name: 'Biz ' + i, type, city: 'Austin' }, {}, {})).site.palette; if (/^b_/.test(p)) bad.push(type + ' ' + p); }
    t.eq(bad.join(', '), '', 'health, professional, family-care and daytime food businesses never get a dark theme by default');
    const dark = {};
    for (const type of ['Barber', 'Taqueria', 'Tattoo studio', 'Cocktail bar']) { dark[type] = 0; for (let i = 0; i < 30; i++) if (/^b_/.test((await K.buildV3Site({ name: 'Biz ' + i, type, city: 'Austin' }, {}, {})).site.palette)) dark[type]++; }
    t.ok(Object.values(dark).every((n) => n >= 2 && n <= 25), 'barbers, evening food and drink and tattoo studios get a dark theme some of the time (' + JSON.stringify(dark) + ')');
    const fam = { Dentist: /^w_(teal|ocean|emerald)$/, 'Law firm': /^w_(navy|forest|oxblood|slate)$/, Accountant: /^w_(navy|forest|slate)$/, Florist: /^w_(rose|berry|sage|clay)$/, Bakery: /^w_(amber|rust|rose)$/, Daycare: /^w_(amber|rose|teal)$/ };
    const off = [];
    for (const type of Object.keys(fam)) for (let i = 0; i < 12; i++) { const p = (await K.buildV3Site({ name: 'Biz ' + i, type }, {}, {})).site.palette; if (!fam[type].test(p)) off.push(type + ' ' + p); }
    t.eq(off.join(', '), '', 'accents fit the kind of business (dental blues and greens, legal navy, forest and oxblood, warm florists and bakeries)');
    const own = (await K.buildV3Site({ name: 'Biz', type: 'Dentist', look: 'dark' }, {}, {})).site.palette;
    t.ok(/^b_/.test(own), 'the owner’s Dark look still wins (' + own + ')');
    const yoga = (await K.buildV3Site({ name: 'Calm', type: 'Yoga studio' }, {}, {})).site.typeset;
    t.ok(['warm', 'elegant', 'refined'].indexOf(yoga) > -1, 'a yoga studio gets a calm type theme, not the condensed gym one (' + yoga + ')');
  }

  // ---- B. page rhythm: tones alternate by position, a light band breaks up long dark pages ----
  {
    const dk = await K.buildV3Site({ name: 'Brightwater Dental', type: 'Dentist', city: 'Raleigh', phone: '919-555-0123', unique: 'Gentle care for nervous patients, with evening appointments', look: 'dark' }, PH, {});
    const tn = tones(dk.html);
    const free = tn.filter((x) => !/^(hero|cta|trust|announce)$/.test(x.type));
    t.ok(free.some((x) => x.tone === 'soft') && free[0].tone !== 'soft', 'a dark site has a light band in the middle of the page (' + tn.map((x) => x.type + ':' + x.tone).join(' ') + ')');
    t.ok(free.every((x, i) => !i || x.tone !== free[i - 1].tone), 'no two text sections in a row share a tone on a dark site');
    t.ok(/--soft:#[0-9A-F]{6};--soft-text:#[0-9A-F]{6};--soft-ink:#[0-9A-F]{6}/.test(dk.html) && /\.on-soft\{background:var\(--soft\)/.test(dk.html), 'the soft band has its own colors and CSS');
    const p = W.palette(dk.site.palette), st = W.softTone(p);
    t.ok(W.contrast(st.soft, st.softText) >= 7 && W.contrast(st.softInk, st.soft) >= 4.5 && W.contrast(st.soft, p.base) >= 4, 'the light band on a dark theme reads (text ' + W.contrast(st.soft, st.softText).toFixed(1) + ':1) and is clearly different from the base');
    const worst = [];
    for (const type of ['Dentist', 'Barber', 'Taqueria', 'Yoga studio', 'Roofer', 'Accountant', 'Florist', 'Dog groomer']) for (const look of ['light', 'dark']) {
      const r = await K.buildV3Site({ name: 'Rhythm ' + type, type, city: 'Denver', phone: '303-555-0101', unique: 'Small team, careful work', look }, PH, {});
      const seq = tones(r.html).filter((x) => !/^(hero|announce)$/.test(x.type));
      for (let i = 2; i < seq.length; i++) if (seq[i].tone === seq[i - 1].tone && seq[i].tone === seq[i - 2].tone && !/^(cta|trust)$/.test(seq[i].type)) worst.push(type + '/' + look + ' ' + seq.slice(i - 2, i + 1).map((x) => x.type + ':' + x.tone).join(' '));
    }
    t.eq(worst.join(' | '), '', 'never three same-tone sections in a row, on light and dark themes');
    for (const id of ['w_ocean', 'b_ocean', 'b_mono', 'w_mono', 'linen', 'bottle', 'ink']) { const q = W.palette(id), s = W.softTone(q); if (!t.ok(W.contrast(s.soft, s.softText) >= 4.5 && W.contrast(s.softInk, s.soft) >= 4.5 && W.contrast(s.softBtn, s.soft) >= 1.5, id + ': soft band text, accent ink and buttons read')) break; }
    const out = [{ s: { type: 'hero' }, html: '<section class="hero on-base">' }, { s: { type: 'faq', tone: 'on-alt' }, html: '<section class="faq on-alt">' }, { s: { type: 'steps' }, html: '<section class="steps on-base">' }];
    W.toneSeq(out, W.palette('w_ocean'));
    t.ok(out[1].html === '<section class="faq on-alt">' && /on-base/.test(out[2].html), 'a section with an explicit tone keeps it');
  }

  // ---- C. photos go beside the text on long text pages; the story doesn't repeat the why points ----
  {
    const r = await K.buildV3Site({ name: 'Brightwater Dental', type: 'Dentist', city: 'Raleigh', phone: '919-555-0123', unique: 'Gentle care for nervous patients, with evening appointments' }, PH, {});
    const s = r.site, h = home(s);
    const why = h.find((x) => x.type === 'why');
    t.ok(why && why.variant === 'split' && s.photos[why.id + '.photo'], 'with photos, the why points sit beside a photo');
    t.ok(s.photoCredits[why.id + '.photo'] && s.photoCredits[why.id + '.photo'].name, 'a lent photo keeps its photographer credit');
    const pic = (x) => /^(hero|gallery)$/.test(x.type) ? true : !!s.photos[x.id + '.photo'] && /split|offset|feature/.test(x.variant);
    let run = 0, maxRun = 0; h.forEach((x) => { if (/^(cta|trust|announce)$/.test(x.type)) return; run = pic(x) ? 0 : run + 1; maxRun = Math.max(maxRun, run); });
    t.ok(maxRun <= 2, 'never more than two text-only sections in a row when photos exist (' + h.map((x) => x.type + ':' + x.variant).join(' ') + ')');
    const no = await K.buildV3Site({ name: 'Brightwater Dental', type: 'Dentist', city: 'Raleigh', unique: 'Gentle care for nervous patients' }, {}, {});
    t.ok(!Object.keys(no.site.photos).length && home(no.site).every((x) => !(x.type === 'services' && x.variant === 'feature')), 'no photos: nothing lent, and no photo-led services layout without a photo');
    const rep = kit(() => ({ taglines: ['Calm checkups, explained clearly.'], intro: 'We offer gentle care for nervous patients, right here in Raleigh, with evening appointments too.', services: [], why: [{ title: 'Unhurried visits', text: 'Time to talk through every step.' }, { title: 'Calm care for nervous patients', text: 'Gentle care at your pace.' }], faq: [], cta: { title: 'Book a checkup', text: 'Tell us a time that suits you.' }, about: '' }));
    const rs = (await rep.K.buildV3Site({ name: 'Brightwater Dental', type: 'Dentist', city: 'Raleigh', unique: 'Gentle care for nervous patients, with evening appointments' }, { GEMINI_API_KEY: 'K', KV: kv() }, { ai: true })).site;
    const ri = home(rs).find((x) => x.type === 'intro');
    t.ok((rs.copyRejected || []).indexOf('intro:repeat') > -1 && (!ri || !/nervous patients/.test(ri.text)), 'an AI intro restating the owner’s answer (already the first why point) is not used (' + rs.copyRejected + ')');
    const wi = home(rs).find((x) => x.type === 'why').items;
    t.ok(wi.some((x) => x.title === 'Unhurried visits') && !wi.some((x) => x.title === 'Calm care for nervous patients') && (rs.copyRejected || []).some((x) => /^why\.\d:repeat$/.test(x)), 'an AI why point repeating the owner’s answer is skipped');
  }

  // ---- D. no address, no hours: no location block on home, the phone rides with the call to action ----
  {
    const r = await K.buildV3Site({ name: 'La Esquina Taqueria', type: 'Mexican restaurant', city: 'Phoenix, AZ', phone: '(602) 555-0177' }, {}, {});
    const h = home(r.site), cta = h.find((x) => x.type === 'cta');
    t.ok(!h.some((x) => x.type === 'visit') && cta.phone === true, 'no address and no hours: no visit block on home, the call to action carries the phone');
    t.ok(/class="cta [^"]*"[^]*?href="tel:6025550177"/.test(homeHtml(r.html).split('class="cta ')[1] ? 'class="cta ' + homeHtml(r.html).split('class="cta ')[1] : ''), 'the call to action shows a Call button');
    t.ok(r.site.pages.find((p) => p.path === 'contact').sections.some((x) => x.type === 'visit'), 'Contact keeps the details');
    const hrs = [{ d: 'Mon', open: '11:00', close: '21:00' }];
    t.ok(home((await K.buildV3Site({ name: 'La Esquina', type: 'Mexican restaurant', city: 'Phoenix', phone: '602-555-0177', hours: hrs }, {}, {})).site).some((x) => x.type === 'visit'), 'with opening hours the visit block stays (hours shown)');
    t.ok(home((await K.buildV3Site({ name: 'La Esquina', type: 'Mexican restaurant', city: 'Phoenix', phone: '602-555-0177', address: '12 Main St, Phoenix, AZ' }, {}, {})).site).some((x) => x.type === 'visit'), 'with an address the visit block stays');
    const tr = home((await K.buildV3Site({ name: 'Drip', type: 'Plumber', city: 'Tulsa', phone: '918-555-0101' }, {}, {})).site);
    t.ok(tr.some((x) => x.type === 'visit' || x.type === 'area'), 'a business that comes to you keeps its service-area block');
  }

  // ---- E. why points from the owner's answer are never fragments ----
  {
    const u = K.v3UniqueTitle('Gentle care for nervous patients, with evening appointments');
    t.ok(u && u.title === 'Gentle care for nervous patients' && u.text === 'Gentle care for nervous patients, with evening appointments', 'a "with …" remainder: the title is the first clause, the text the whole answer (' + JSON.stringify(u) + ')');
    const v = K.v3UniqueTitle('Free inspections, and photo reports of every job');
    t.ok(v && v.text === 'Free inspections, and photo reports of every job', 'an "and …" remainder is not used on its own');
    const g = K.v3UniqueTitle('The same two-person team every visit, bringing our own supplies');
    t.ok(g && g.text === 'The same two-person team every visit, bringing our own supplies', 'a remainder that opens with an -ing word is not used on its own');
    const x = K.v3UniqueTitle('Family-owned since day one, we answer the phone ourselves and turn up when we say.');
    t.ok(x && x.text === 'we answer the phone ourselves and turn up when we say.', 'a remainder that stands on its own is still used');
    const r = await K.buildV3Site({ name: 'Brightwater Dental', type: 'Dentist', city: 'Raleigh', unique: 'Gentle care for nervous patients, with evening appointments' }, {}, {});
    const w = home(r.site).find((s) => s.type === 'why').items[0];
    t.eq(w.text, 'Gentle care for nervous patients, with evening appointments.', 'the why point says the whole answer as a sentence');
  }

  // ---- F. AI copy style: crisp service lines, taglines that read as lines, more filler caught ----
  {
    const ctx = { text: '', digits: [], name: '', nameWords: [], tpl: [], city: '', cityFull: '' };
    const svc = ['You get corn tortillas and fresh salsa.', 'You’ll get a bath and a trim.', 'These are filling and made to order.', 'This service helps keep coats tidy.', 'This is our most popular cut.', 'We provide comfortable repairs that last.', 'We offer gentle visits for kids.', 'Experience breath-linked movement.', 'Enjoy a slow, quiet hour.', 'Our workshops go deeper into poses.'];
    t.eq(svc.filter((s) => K.v3AiCheck(s, 120, ctx, 'svc').r !== 'opening').join(' | '), '', 'service lines that open with You get / These / This service / We provide / We offer / Experience / Enjoy / Our are rejected');
    t.ok(K.v3AiCheck('Corn tortillas, slow-cooked fillings and fresh salsa.', 120, ctx, 'svc').v && K.v3AiCheck('A bath, custom cut, nail trim and ear cleaning.', 120, ctx, 'svc').v, 'crisp noun-phrase service lines pass');
    const tags = ['Your dog’s calm grooming experience', 'A calm and relaxing grooming experience', 'Friendly local accounting and tax services'];
    t.eq(tags.filter((s) => K.v3AiCheck(s, 70, ctx, 'tagline').r !== 'label').join(' | '), '', 'label taglines (possessive "Your dog’s …", ending in experience / solutions / services) are rejected');
    t.ok(K.v3AiCheck('Sonoran recipes, hand-pressed tortillas.', 70, ctx, 'tagline').v, 'a crisp phrase tagline passes');
    const fil = ['Evening appointments for your convenience.', 'Your one-stop shop for flowers.', 'Look no further for fresh bread.', 'Clean floors in no time.'];
    t.eq(fil.filter((s) => K.v3AiCheck(s, 120, ctx, 'long').r !== 'filler').join(' | '), '', 'more filler is caught (for your convenience, your one-stop, look no further, in no time)');
    const sys = rd('50-generator.js');
    t.ok(/Corn tortillas, slow-cooked fillings and fresh salsa\./.test(sys) && /A bath, custom cut, nail trim and ear cleaning\./.test(sys) && /taglines: 3 different candidates/.test(sys), 'the prompt shows crisp service examples and still asks for 3 tagline candidates');
  }

  // ---- G. Gemini busy: one retry after a short pause, ai:busy only when that fails too ----
  {
    const GOOD = { taglines: ['Careful plumbing for Springfield homes.'], intro: '', about: '', services: [], why: [], faq: [], cta: { title: 'Got a leak?', text: 'Tell us what’s happening and we’ll arrange a visit.' } };
    const B = { name: 'Drip & Sons', type: 'Plumber', city: 'Springfield', phone: '555-010-0123' };
    const one = kit((o, n) => (n === 1 ? new Response('busy', { status: 429 }) : GOOD));
    const t0 = Date.now();
    const s1 = (await one.K.buildV3Site(B, { GEMINI_API_KEY: 'ONLYKEY', KV: kv() }, { ai: true })).site;
    const waited = Date.now() - t0;
    t.ok(one.calls.length === 2 && s1.copySource === 'ai' && !(s1.copyRejected || []).some((x) => /^ai:/.test(x)), 'a 429 with one key is retried once and the retry’s copy is used (' + one.calls.length + ' ' + s1.copySource + ' ' + s1.copyRejected + ')');
    t.ok(waited >= 380, 'the retry waits a short jittered pause first (' + waited + 'ms)');
    const two = kit((o, n) => (n === 1 ? new Response('overloaded', { status: 503 }) : GOOD));
    const s2 = (await two.K.buildV3Site(B, { GEMINI_API_KEY: 'K1,K2', KV: kv() }, { ai: true })).site;
    t.ok(two.calls.length === 2 && two.calls[0].headers['x-goog-api-key'] === 'K1' && two.calls[1].headers['x-goog-api-key'] === 'K2' && s2.copySource === 'ai', 'a 503 retries with the next key');
    const busy = kit(() => new Response('busy', { status: 429 }));
    const s3 = (await busy.K.buildV3Site(B, { GEMINI_API_KEY: 'K1,K2', KV: kv() }, { ai: true })).site;
    t.ok(busy.calls.length === 2 && (s3.copyRejected || []).join() === 'ai:busy' && s3.copySource === 'template', 'busy twice: template copy, recorded as ai:busy after the retry (' + s3.copyRejected + ')');
    const tight = kit(() => new Response('busy', { status: 429 }));
    const s4 = (await tight.K.buildV3Site(B, { GEMINI_API_KEY: 'K1', KV: kv(), AI_TIMEOUT_MS: '1000' }, { ai: true })).site;
    t.ok(tight.calls.length === 1 && (s4.copyRejected || []).join() === 'ai:busy', 'no retry when the time limit leaves no room for it');
  }

  // ---- H. logo icons fit the business ----
  {
    const want = { 'Yoga studio': ['yoga', 'flower', 'sun', 'leaf'], 'Pilates studio': ['yoga', 'flower', 'sun', 'leaf'], Florist: ['flower', 'flower-2', 'leaf'], 'Massage therapist': ['hand-heart', 'leaf', 'flower-2'], 'Dog groomer': ['paw-print', 'dog', 'bone'], Daycare: ['baby', 'blocks', 'smile'], Tutoring: ['graduation-cap', 'book-open', 'pencil-ruler'], 'Music lessons': ['music', 'mic'], Tailor: ['scissors', 'ruler', 'shirt'], Photographer: ['camera'], 'Wedding planner': ['heart', 'calendar-check', 'sparkles'], Barber: ['razor', 'scissors'], Dentist: ['tooth'], Accountant: ['chart-column', 'receipt', 'briefcase'], 'Law firm': ['scale', 'gavel', 'landmark'], 'Coffee shop': ['coffee'], Bakery: ['croissant', 'wheat'], Taqueria: ['utensils-crossed'], 'Pho restaurant': ['soup'], 'Hot dog stand': ['utensils', 'chef-hat'], Gym: ['dumbbell'], 'Financial planner': ['chart-column', 'briefcase', 'landmark'], 'Public accountant': ['chart-column', 'receipt', 'briefcase'] };
    const bad = [];
    for (const type of Object.keys(want)) { const sc = K.v3Starter(type, {}); for (let i = 0; i < 8; i++) { const m = K.v3LogoMark(sc.labels.family, sc.category, type); if (want[type].indexOf(m.icon) < 0 || !W.ICONS[m.icon]) bad.push(type + ' → ' + m.icon); } }
    t.eq(bad.join(', '), '', 'logo icons fit the business and exist in the icon set');
  }
};
