// No invented credentials (FTC: unsubstantiated claims). Template copy (the copybook in 49-copy.js and the starter
// fallbacks in 50-generator.js) never claims a license, certification, insurance, bond, guarantee, warranty, award,
// ranking, "free" offer, years of experience or family ownership. Those only appear when the owner said so (the
// licensed / insured / founded answers). Runs in Node, no server needed.
const fs = require('fs');
const path = require('path');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const CLAIM = /\b(licen[sc]ed|certified|certification|bonded|insured|guarantee[ds]?|warrant(?:y|ies)|award[- ]?winning|awards?|#1|number one|best in|top[- ]rated|five[- ]star|5[- ]star|accredited|qualified|years of experience|family[- ]owned|free (?:estimates?|quotes?|consultations?|calls?|inspections?)|is free)\b|#1/i;

module.exports = async function (ctx, t) {
  // ---- A. every line of template copy ----
  const copy = rd('49-copy.js');
  const K = new Function(copy + '\n;return { V3_COPYBOOK, V3_GENERIC, V3_SUBTYPES, V3_WHY, V3_WHY_LOCAL, V3_HERO_SUB, V3_WHY_TITLE, V3_HERO_SUB_CAT, V3_WHY_TITLE_CAT, V3_MAIN_HEAD_CAT, V3_SVC_FILL_CAT, V3_AREA_TITLE, V3_SVC_FILL };')();
  // V3_UNIQUE_EX* are left out on purpose: they are placeholder examples in the setup field ("Why do customers pick
  // you?"), shown greyed out and never put on a site. FAQ questions are left out too: a question asserts nothing,
  // and the starter answers to credential questions are neutral unless the owner said yes (v3FaqFit).
  const hits = [];
  const walk = (v, p, inFaq) => {
    if (typeof v === 'string') { if (CLAIM.test(v)) hits.push(p + ': ' + v); return; }
    if (!v || typeof v !== 'object' || v instanceof RegExp) return;
    if (inFaq && Array.isArray(v) && typeof v[0] === 'string' && typeof v[1] === 'string') { walk(v[1], p + '.a'); return; }
    Object.keys(v).forEach((k) => walk(v[k], p + '.' + k, inFaq || k === 'faq'));
  };
  Object.keys(K).forEach((k) => walk(K[k], k, false));
  t.eq(hits.length, 0, 'copybook has no invented credentials, guarantees, rankings or free offers' + (hits.length ? ': ' + hits.slice(0, 6).join(' | ') : ''));

  // ---- B. the generator's own starter fallbacks (v3StarterBase) ----
  const gen = rd('50-generator.js');
  const base = new Function(gen.slice(0, gen.indexOf('\n// Per-category default palette')) + ';return v3StarterBase;')();
  const TYPES = ['Plumber', 'Electrician', 'Roofer', 'HVAC', 'Painter', 'Handyman', 'Hair salon', 'Barber', 'Bakery', 'Restaurant', 'Cafe', 'Law firm', 'Dentist', 'Chiropractor', 'Accountant', 'Real estate agent', 'Wedding planner', 'Movers', 'Web design agency', 'Dog groomer', 'Daycare', 'Auto repair', 'Cleaning service', 'Lawn care', 'Boutique', 'Church', 'Funeral home', 'Security company', 'Yoga studio', 'Tutor', 'Something unusual'];
  const fb = [];
  TYPES.forEach((ty) => {
    const r = base(ty);
    const strs = [r.tagline, r.about, r.servicesTitle, r.ctaTitle, r.ctaText].concat((r.services || []).flat()).concat((r.faq || []).map((x) => x[1]));
    strs.forEach((x) => { if (typeof x === 'string' && CLAIM.test(x)) fb.push(ty + ': ' + x); });
  });
  t.eq(fb.length, 0, 'generator fallbacks make no credential claims' + (fb.length ? ': ' + fb.slice(0, 6).join(' | ') : ''));

  // ---- C. whole generated sites: claims only when the owner gave them ----
  const SRC = rd('10-engine.js') + '\n' + copy + '\n' + gen + '\n;return { buildV3Site, WSENGINE };';
  const B = new Function('fetch', SRC)(async () => new Response('{}', { status: 404 }));
  const text = (site) => B.WSENGINE.renderSite(site, { mode: 'live' }).replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  const bad = [];
  for (const ty of ['Plumber', 'Electrician', 'Roofer', 'Auto repair', 'Daycare', 'Movers', 'Hair salon', 'Law firm', 'Wedding planner', 'Driving school', 'Handyman']) {
    for (let i = 0; i < 4; i++) {
      const s = (await B.buildV3Site({ name: 'Biz ' + i, type: ty, city: 'Tulsa, OK' }, {}, {})).site;
      // A question (an FAQ heading: "Are my belongings insured?") asserts nothing; statements are checked.
      const m = (text(s).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]?/g) || []).find((x) => CLAIM.test(x) && !/\?\s*$/.test(x));
      if (m) bad.push(ty + ' #' + i + ': "' + m.trim().slice(0, 80) + '"');
    }
  }
  t.eq(bad.length, 0, 'sites built without the owner\'s answers claim no credentials' + (bad.length ? ': ' + bad.slice(0, 6).join(', ') : ''));
  const lic = (await B.buildV3Site({ name: 'Volt Co', type: 'Electrician', city: 'Tulsa, OK', licensed: true, insured: true }, {}, {})).site;
  t.ok(/licensed/i.test(text(lic)) && /insured/i.test(text(lic)), 'the owner\'s own licensed and insured answers still show');
};
