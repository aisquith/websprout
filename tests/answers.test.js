// The owner's own answers from setup (what makes them different, founding year, licensed/insured, towns served)
// and the sections built from them: trust badges, "why choose us", areas served, honest FAQs and the logo mark.
// Real answers come first and nothing is ever invented. The generator runs in Node (no photos, no network);
// one site is also built on the real worker to check /create stores the answers.
const fs = require('fs');
const path = require('path');
const { createSite } = require('./lib');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });

module.exports = async function (ctx, t) {
  const K = new Function('fetch', rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, WSENGINE, V3_WHY, v3Towns, v3Year, v3Clean };')(async () => json({}, 404));
  const E = K.WSENGINE;
  const build = async (body) => (await K.buildV3Site(body, {}));
  const site = async (body) => (await build(body)).site;
  const secs = (s) => s.pages.flatMap((p) => p.sections);
  const homeTypes = (s) => s.pages[0].sections.map((x) => x.type);
  const page = (s, p) => s.pages.find((x) => x.path === p) || { sections: [] };
  const base = (type, extra) => Object.assign({ name: 'Maple ' + type, type, city: 'Springfield', phone: '(555) 010-0123' }, extra || {});
  const ANS = { unique: 'Family-owned since day one, we answer the phone ourselves and turn up when we say.', founded: '2004', licensed: true, insured: true, towns: 'Shelbyville, Ogdenville, Capital City' };
  const YRS = String(new Date().getFullYear() - 2004);
  t.ok(['trust', 'why', 'area'].every((k) => E.sections[k]) && E.sections.faq.variants.open, 'the engine offers the trust, why and area sections and the open FAQ');

  // ---- answers are stored and sanitized ----
  {
    const now = String(new Date().getFullYear());
    const yr = (v) => K.v3Year(v);
    t.eq([yr('2004'), yr(2004), yr(' 1999 '), yr(now), yr('1850'), yr('1849'), yr('3020'), yr(String(+now + 1)), yr('20x4'), yr('04'), yr(''), yr(null)].join(','), ['2004', '2004', '1999', now, '1850', '', '', '', '', '', '', ''].join(','), 'only a plausible founding year (1850 to this year) is kept');
    const b = (await site(base('Plumber', { unique: '  <script>alert(1)</script>We <b>fix</b> leaks   fast. ' + 'x'.repeat(400), founded: '1700', licensed: 'true', insured: 1, towns: 'springfield, SHELBYVILLE\nst. louis;  ; <b>Ogden</b>ville, Springfield, "Capital" City, ' + 'a'.repeat(60) }))).biz;
    t.ok(b.unique.indexOf('<') < 0 && b.unique.indexOf('>') < 0 && /^alert\(1\) We fix leaks fast\./.test(b.unique) && b.unique.length <= 200, 'what makes them different: tags stripped, spaces tidied, capped at 200 (' + b.unique.slice(0, 40) + ')');
    t.eq(b.founded, '', 'an impossible founding year is dropped');
    t.ok(b.licensed === false && b.insured === false, 'licensed and insured only when the answer is exactly true');
    t.eq(JSON.stringify(b.towns), JSON.stringify(['Springfield', 'Shelbyville', 'St. Louis', 'Ogden ville', 'Capital City', 'A'.repeat(1) + 'a'.repeat(39)]), 'towns: split on commas and lines, tags stripped, title-cased, de-duplicated, each at most 40 characters');
    const many = K.v3Towns(Array.from({ length: 30 }, (_, i) => 'Town ' + String.fromCharCode(65 + (i % 26)) + i).join(', '));
    t.ok(many.length <= 12 && K.v3Towns('x'.repeat(290) + ', Lateville').indexOf('Lateville') < 0, 'at most 12 towns, from at most 300 characters');
    const ok = (await site(base('Plumber', ANS))).biz;
    t.ok(ok.licensed === true && ok.insured === true && ok.founded === '2004' && ok.towns.join('|') === 'Shelbyville|Ogdenville|Capital City' && ok.unique === ANS.unique, 'good answers are stored as given');
    t.ok(K.v3Clean('<img src=x onerror=alert(1)>Hi "there"', 200) === 'Hi there', 'markup never survives into the answers');
  }

  // ---- trust badges: only from real data, only with two or more ----
  {
    const badges = (s) => { const tr = secs(s).find((x) => x.type === 'trust'); return tr ? E.trustBadges(s, tr).length : 0; };
    const one = await site(base('Plumber', { licensed: true }));
    t.ok(!secs(one).some((x) => x.type === 'trust'), 'one badge (licensed) is not enough for a trust band');
    const two = await site(base('Plumber', { licensed: true, insured: true }));
    t.ok(homeTypes(two)[1] === 'trust' && two.pages[0].sections[1].variant === 'strip' && badges(two) === 2, 'licensed and insured: a slim trust strip right under the hero');
    const ft = await site(base('Electrician', { founded: '2010', towns: 'Shelbyville' }));
    t.ok(homeTypes(ft)[1] === 'trust' && badges(ft) === 2, 'founding year and towns make two badges');
    const law = await site(base('Law firm', { founded: '1990', licensed: true }));
    t.ok(homeTypes(law)[1] === 'trust', 'professional firms get trust badges too');
    const kid = await site(base('Daycare', { licensed: true, insured: true }));
    t.ok(homeTypes(kid)[1] === 'trust', 'childcare gets trust badges');
    const none = await site(base('Plumber'));
    t.ok(!secs(none).some((x) => x.type === 'trust'), 'no answers, no trust band');
    const salon = await site(base('Hair salon', { licensed: true, insured: true, founded: '2001' }));
    const cafe = await site(base('Coffee shop', { licensed: true, insured: true, founded: '2001' }));
    t.ok(!secs(salon).some((x) => x.type === 'trust') && !secs(cafe).some((x) => x.type === 'trust'), 'trust badges are for trades and professionals');
    let all = true;
    for (const type of ['Plumber', 'Roofer', 'House cleaning', 'Accountant', 'Dentist'])
      for (const ex of [{}, { licensed: true }, { founded: '2015' }, { towns: 'Ogdenville' }, { licensed: true, towns: 'Ogdenville' }, ANS]) {
        const s = await site(base(type, ex)); const tr = secs(s).find((x) => x.type === 'trust');
        if (tr ? badges(s) < 2 : false) all = false;
      }
    t.ok(all, 'every trust band the generator adds shows at least two real badges');
  }

  // ---- why choose us: the owner's words first, no invented claims ----
  {
    const s = await site(base('Plumber', ANS));
    const w = secs(s).find((x) => x.type === 'why');
    t.ok(w && w.items.length >= 3 && w.items.length <= 4 && /^grid|split$/.test(w.variant) && w.title, 'a plumber gets a why section with 3 or 4 points');
    t.eq(w.items.map((i) => i.source).join(','), 'unique,starter,starter,starter', 'with the trust strip (licensed, insured, years, towns) and the areas block on the page, the why points don’t repeat them: honest category points fill the rest');
    t.ok(w.items[0].title === 'Family-owned since day one' && w.items[0].text === 'We answer the phone ourselves and turn up when we say.', 'what makes them different: a short lead as the title, their own words as the text');
    t.ok(!w.items.slice(1).some((i) => /licensed|insured|\d|years/i.test(i.title + ' ' + i.text)), 'no why point repeats the licensed, insured or years badges');
    // no trust strip on the page (a salon): the owner's answers fill the points, in order
    const sw = secs(await site(base('Hair salon', ANS))).find((x) => x.type === 'why');
    t.eq(sw.items.map((i) => i.source).join(','), 'unique,licensed,years,local', 'without a trust strip the real answers fill the points first, in order');
    t.ok(sw.items[1].title === 'Licensed and insured' && sw.items[1].text === 'Fully licensed and insured, so you’re covered.', 'licensed and insured, only because both were answered');
    t.ok(sw.items[2].title === YRS + ' years in Springfield' && /since 2004/.test(sw.items[2].text), 'years in the city, from the founding year');
    t.ok(sw.items[3].title === 'Local to Springfield', 'local to the city');
    // trust strip without towns: licensed is left to the strip, the years point only if three points need it
    const tw = secs(await site(base('Plumber', { licensed: true, insured: true, founded: '2004', unique: ANS.unique }))).find((x) => x.type === 'why');
    t.ok(tw.items.map((i) => i.source).join(',') === 'unique,local,starter,starter' && tw.items[1].title === 'Local to Springfield', 'trust strip without towns: no licensed or years point, the local point stays (' + tw.items.map((i) => i.source) + ')');
    // a short title from the owner's own first clause; a neutral one when there's no clean clause
    const fo = secs(await site(base('Plumber', { unique: 'Family-owned, we answer the phone ourselves and show up when we say we will', licensed: true, insured: true }))).find((x) => x.type === 'why');
    t.ok(fo.items[0].title === 'Family-owned' && fo.items[0].text === 'We answer the phone ourselves and show up when we say we will.', 'a one-word hyphenated clause makes the title, the rest their own words (' + fo.items[0].title + ' / ' + fo.items[0].text + ')');
    const lg = secs(await site(base('Plumber', { unique: 'Three generations of the same family working on these old houses, and we still love it' }))).find((x) => x.type === 'why');
    t.ok(/sets us apart|makes us different/.test(lg.items[0].title), 'a first clause over 36 characters keeps a neutral title (' + lg.items[0].title + ')');
    // the city with its state in prose: just the city name
    const stc = await site(base('Plumber', Object.assign({}, ANS, { city: 'Springfield, IL 62701', towns: 'Springfield, Shelbyville, Ogdenville, Capital City' })));
    const sal2 = secs(await site(base('Hair salon', Object.assign({}, ANS, { city: 'Springfield, Illinois' })))).find((x) => x.type === 'why');
    t.ok(sal2.items[2].title === YRS + ' years in Springfield' && sal2.items[2].text === 'Serving Springfield since 2004.' && sal2.items[3].title === 'Local to Springfield', 'why points name the city without the state (' + sal2.items[2].title + ')');
    const ar2 = stc.pages[0].sections.find((x) => x.type === 'area');
    t.ok(/^Serving Springfield and nearby towns including Shelbyville and Ogdenville\./.test(ar2.text), 'the home city is not listed again among the nearby towns (' + ar2.text + ')');
    const prose = JSON.stringify(stc.pages.flatMap((p) => p.sections).map((x) => [x.title, x.text, x.tagline, (x.items || []).map((i) => [i.title, i.text, i.a])]));
    t.ok(!/\bIL\b|62701|Illinois/.test(prose) && /Springfield/.test(prose), 'no state or zip code in the generated prose');
    t.eq(stc.biz.city, 'Springfield, IL 62701', 'the full city is kept for the contact details and structured data');
    const stHtml = (await build(base('Plumber', Object.assign({}, ANS, { city: 'Springfield, IL 62701', towns: 'Springfield, Shelbyville, Ogdenville, Capital City' })))).html;
    const tb = (stHtml.match(/<section[^>]*id="trust"[\s\S]*?<\/section>/) || [''])[0].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    t.ok(/Serving Springfield & 3 nearby towns|4 Towns served around Springfield/.test(tb), 'the trust badge counts only the towns other than the city (' + tb.trim() + ')');
    const hi = homeTypes(s);
    t.ok(hi.indexOf('why') === hi.indexOf('services') + 1, 'why sits right after the services on a trades home page (' + hi + ')');
    const lic = (await site(base('Plumber', { licensed: true }))).pages.flatMap((p) => p.sections).find((x) => x.type === 'why');
    t.ok(lic.items[0].title === 'Fully licensed' && !/insured/i.test(lic.items[0].text), 'licensed only: never says insured');
    const short = secs(await site(base('Hair salon', { unique: 'curly hair specialists' }))).find((x) => x.type === 'why');
    t.ok(short && short.items[0].text === 'Curly hair specialists.' && /sets us apart|makes us different/.test(short.items[0].title), 'a short answer keeps a plain title and the owner’s words, tidied');
    const we = secs(await site(base('Roofer', { unique: 'We still climb up and check every roof ourselves' }))).find((x) => x.type === 'why');
    t.ok(we.items[0].text === 'We still climb up and check every roof ourselves.' && !/^We /.test(we.items[0].title), 'a sentence that starts with "we" is not chopped into a title');
    // no answers: honest category points only
    const BAD = /\d|guarantee|certified|certificat|award|24\/7|warrant|best in|cheapest|#1|free\b|same.day|emergency|years/i;
    const bad = []; const whyFams = new Set(); const noWhy = new Set();
    for (const type of ['Plumber', 'Electrician', 'HVAC repair', 'Roofer', 'Handyman', 'House cleaning', 'Lawn care', 'Moving company', 'Locksmith', 'Appliance repair', 'Auto repair', 'Barber shop', 'Hair salon', 'Nail salon', 'Massage therapist', 'Tattoo studio', 'Yoga studio', 'Dog grooming', 'Tailor', 'Law firm', 'Dentist', 'Chiropractor', 'Accountant', 'Realtor', 'Web design agency', 'Piano lessons', 'Daycare', 'Church', 'Mexican restaurant', 'Bakery', 'Coffee shop', 'Wedding photographer', 'Florist', 'Gift shop']) {
      for (const n of ['North', 'South']) {
        const x = await site(base(type, { name: n + ' ' + type }));
        const wy = secs(x).find((y) => y.type === 'why');
        if (!wy) { noWhy.add(type); continue; }
        whyFams.add(type);
        wy.items.forEach((i) => { if (BAD.test(i.title + ' ' + i.text) || !i.title || !i.text || !E.ICONS[i.icon] || /unique|licensed|insured|years/.test(i.source)) bad.push(type + ': ' + i.title + ' / ' + i.text); });
        if (wy.items.length < 3) bad.push(type + ': only ' + wy.items.length + ' points');
      }
    }
    t.eq(bad.join(' | '), '', 'without answers the why points are honest category points: no numbers, guarantees, awards or certifications, valid icons');
    t.eq(['Mexican restaurant', 'Bakery', 'Coffee shop', 'Wedding photographer', 'Florist', 'Gift shop'].filter((x) => !noWhy.has(x)).join(','), '', 'food, creative and retail home pages have no why section');
    t.eq(['Plumber', 'House cleaning', 'Barber shop', 'Hair salon', 'Law firm', 'Dentist', 'Daycare', 'Accountant'].filter((x) => !whyFams.has(x)).join(','), '', 'trades, professional, beauty and childcare home pages get a why section');
    // with answers: the only digits are the founding year and the years since
    const dig = [];
    for (const type of ['Plumber', 'Accountant', 'Hair salon', 'Daycare']) {
      const wy = secs(await site(base(type, ANS))).find((y) => y.type === 'why');
      wy.items.forEach((i) => { if (i.source !== 'unique' && /\d/.test((i.title + ' ' + i.text).replace(/2004/g, '').replace(new RegExp('\\b' + YRS + '\\b', 'g'), ''))) dig.push(type + ': ' + i.title); if (i.source !== 'unique' && /guarantee|certified|award|24\/7/i.test(i.title + i.text)) dig.push(type + ': ' + i.title); });
    }
    t.eq(dig.join(' | '), '', 'with answers the only numbers are the founding year and years since');
    // starter why copy follows the house style
    const strings = []; Object.values(K.V3_WHY).forEach((pool) => pool.forEach((p) => strings.push(p[1], p[2])));
    const st = strings.filter((x) => /!|'|\d|\b(we will|you are|it is|we are|do not|does not|you will|that is|there is|cannot)\b|guarantee|certif|award|24\/7/i.test(x));
    t.eq(st.join(' | '), '', 'why copy: no exclamation marks, typographic apostrophes, contractions, no numbers or claims');
    t.ok(Object.values(K.V3_WHY).every((pool) => pool.every((p) => E.ICONS[p[0]])), 'every why icon is a real line icon');
    // the same business gets the same points; the page stays readable
    const a1 = secs(await site(base('Plumber', { name: 'Drip Plumbing' }))).find((x) => x.type === 'why');
    const a2 = secs(await site(base('Plumber', { name: 'Drip Plumbing' }))).find((x) => x.type === 'why');
    t.eq(JSON.stringify(a2.items), JSON.stringify(a1.items), 'the same business always gets the same why points');
    let long = '';
    for (const type of ['Plumber', 'Hair salon', 'Law firm', 'Daycare', 'House cleaning']) {
      const x = await site(base(type, Object.assign({ address: '1 Main St, Springfield', reviews: [{ quote: 'Great work, would use again.', name: 'A' }, { quote: 'Friendly and careful.', name: 'B' }, { quote: 'Fair price.', name: 'C' }], team: [{ name: 'Ana' }] }, ANS)));
      const n = x.pages[0].sections.filter((y) => !/^(hero|announce|trust)$/.test(y.type)).length;
      if (n > 7) long += type + ' ' + homeTypes(x) + '; ';
    }
    t.eq(long, '', 'home pages stay at seven sections or fewer below the hero when why is added');
  }

  // ---- areas we serve: towns for businesses that go to their customers ----
  {
    const s = await site(base('Plumber', ANS));
    const h = homeTypes(s);
    const ar = s.pages[0].sections.find((x) => x.type === 'area');
    t.ok(ar && h.indexOf('area') === h.length - 2 && h[h.length - 1] === 'cta', 'a plumber with towns gets an areas block right before the CTA (' + h + ')');
    t.ok(h.indexOf('visit') < 0 && page(s, 'contact').sections.some((x) => x.type === 'visit'), 'the areas block replaces the location band on home; contact details stay on the Contact page');
    t.ok(/Areas we serve|Where we work|Our service area|Springfield/.test(ar.title) && /Serving Springfield and nearby towns including Shelbyville and Ogdenville\./.test(ar.text), 'areas block: a heading and the real towns (' + ar.text + ')');
    const html = (await build(base('Plumber', ANS))).html;
    const blk = (html.match(/<section[^>]*id="area"[\s\S]*?<\/section>/) || [''])[0];
    t.ok(/<h2 class="h2">[^<]+<\/h2>/.test(blk) && /Shelbyville/.test(blk) && /Capital City/.test(blk), 'the rendered areas block has a heading and lists the towns');
    const no = await site(base('Plumber'));
    t.ok(!secs(no).some((x) => x.type === 'area') && homeTypes(no).indexOf('visit') > -1, 'no towns, no areas block (the location band stays)');
    const salon = await site(base('Hair salon', { towns: 'Shelbyville' }));
    t.ok(!secs(salon).some((x) => x.type === 'area'), 'a salon people visit gets no areas block');
    const garage = await site(base('Auto repair', { address: '1 Main St, Springfield', towns: 'Shelbyville' }));
    t.ok(!secs(garage).some((x) => x.type === 'area'), 'a garage with an address gets no areas block');
    const mobile = await site(base('Mobile dog grooming', { towns: 'Shelbyville, Ogdenville' }));
    t.ok(mobile.pages[0].sections.some((x) => x.type === 'area'), 'mobile services get an areas block');
    for (const type of ['House cleaning', 'Lawn care', 'Moving company']) t.ok((await site(base(type, { towns: 'Ogdenville' }))).pages[0].sections.some((x) => x.type === 'area'), type + ' with towns gets an areas block');
  }

  // ---- the plumber example: its location / areas block always has a heading ----
  {
    const ex = { name: 'Maple Street Plumber', type: 'Plumber', city: 'Springfield', phone: '(555) 010-0123' };
    const r = await build(ex);
    const v = r.site.pages[0].sections.find((x) => x.type === 'visit');
    t.ok(v && /Springfield/.test(v.title) && v.eyebrow === 'Service area', 'the plumber example’s location band has a title and a "Service area" label, not "Visit" (' + (v && v.title) + ')');
    const blk = (r.html.match(/<section[^>]*id="visit"[\s\S]*?<\/section>/) || [''])[0];
    t.ok(/<h2 class="h2">[^<]*Springfield[^<]*<\/h2>/.test(blk) && !/<p class="eb">Visit<\/p>/.test(blk), 'the rendered location band shows its heading');
  }

  // ---- the answers in the copy ----
  {
    const s = await site(base('Plumber', ANS));
    const about = page(s, 'about').sections.find((x) => x.type === 'intro');
    t.ok(about.text.indexOf(ANS.unique) === 0, 'the About story opens with what makes them different');
    t.ok(/since 2004/i.test(about.text) && /nearby towns including Shelbyville and Ogdenville/.test(about.text), 'the About story says since when and which towns');
    const cta = s.pages[0].sections.find((x) => x.type === 'cta');
    t.ok(!/licensed|insured/i.test(cta.text), 'with the trust strip on the page the call to action doesn’t repeat licensed and insured (' + cta.text + ')');
    const home = JSON.stringify(s.pages[0].sections.filter((x) => x.type !== 'trust'));
    t.ok(!/licensed|insured/i.test(home), 'licensed and insured is said once on the home page: in the trust strip');
    const lic1 = (await site(base('Plumber', { licensed: true }))).pages[0].sections.find((x) => x.type === 'cta');
    t.ok(/^Fully licensed\. /.test(lic1.text), 'without a trust strip the trades call to action leads with it (' + lic1.text + ')');
    const plain = await site(base('Plumber', { founded: '2004' }));
    t.ok(!/licensed|insured/i.test(JSON.stringify(plain.pages.flatMap((p) => p.sections).filter((x) => x.type !== 'faq'))), 'never licensed or insured unless the owner said so');
    const own = await site(base('Plumber', Object.assign({ about: 'Our own words.' }, ANS)));
    t.ok(secs(own).filter((x) => x.type === 'intro').some((x) => x.text === 'Our own words.') && !secs(own).some((x) => x.type === 'intro' && x.text.indexOf('Our own words.') > 0), 'an About the owner wrote is used exactly as written');
    const tag = await site(base('Plumber', Object.assign({ tagline: 'Pipes, properly.' }, ANS)));
    t.eq(tag.pages[0].sections.find((x) => x.type === 'hero').tagline, 'Pipes, properly.', 'an owner tagline is never overwritten');
    const food = await site(base('Mexican restaurant', { unique: 'Recipes from our grandmother in Oaxaca' }));
    t.ok(food.pages[0].sections.some((x) => x.type === 'intro' && x.text.indexOf('Recipes from our grandmother in Oaxaca.') === 0), 'without a why section the home story opens with what makes them different');
  }

  // ---- FAQs: every answer is real and helpful ----
  {
    const empty = []; const variants = {};
    for (const type of ['Plumber', 'Electrician', 'Roofer', 'Painter', 'Handyman', 'House cleaning', 'Lawn care', 'Moving company', 'Junk removal', 'Locksmith', 'Appliance repair', 'Auto repair', 'Car wash', 'Barber shop', 'Hair salon', 'Nail salon', 'Massage therapist', 'Tattoo studio', 'Yoga studio', 'Gym', 'Dog walker', 'Tailor', 'Law firm', 'Dentist', 'Chiropractor', 'Physical therapist', 'Accountant', 'Realtor', 'Web design agency', 'Piano lessons', 'Math tutor', 'Daycare', 'Church', 'Mexican restaurant', 'Food truck', 'Bakery', 'Coffee shop', 'Wedding photographer', 'Florist', 'Event planner', 'Gift shop', 'Boat dealer']) {
      for (const n of ['North', 'South', 'East']) {
        const s = await site(base(type, { name: n + ' ' + type }));
        secs(s).filter((x) => x.type === 'faq').forEach((f) => {
          (f.items || []).forEach((i) => { if (!String(i.q || '').trim() || String(i.a || '').trim().length < 20) empty.push(type + ': ' + i.q); if (/are you (fully )?(licen|insured)/i.test(i.q)) empty.push(type + ' asks about licensing without an answer: ' + i.q); });
          const fam = s.pages[0].sections.some((x) => x.type === 'trust' || x.type === 'why') ? null : null; void fam;
          (variants[type] = variants[type] || new Set()).add(f.variant);
        });
      }
    }
    t.eq(empty.join(' | '), '', 'every FAQ item has a question and a real answer, and no licensing question is asked without the owner’s answer');
    t.ok([...variants.Plumber].every((v) => v === 'open') && [...variants['Law firm']].every((v) => v === 'open') && [...variants.Daycare].every((v) => v === 'open'), 'short FAQs on trades and professional sites are open');
    t.ok([...variants['Hair salon']].every((v) => v === 'accordion') && [...variants.Bakery].every((v) => v === 'accordion'), 'other FAQs fold (accordion)');
    const own = secs(await site(base('Plumber', { faq: [{ q: 'Do you work weekends?', a: 'Yes, Saturdays.' }, { q: 'Unanswered?', a: '  ' }, { q: '', a: 'No question' }] }))).filter((x) => x.type === 'faq');
    t.ok(own.length && own.every((f) => f.items.every((i) => i.q && i.a)) && own.some((f) => f.items.some((i) => i.q === 'Do you work weekends?')), 'owner questions without an answer are left out');
    let cred = '';
    for (const n of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      const s = await site(base('Handyman', { name: n + ' Handyman', licensed: true, insured: true }));
      secs(s).filter((x) => x.type === 'faq').forEach((f) => f.items.forEach((i) => { if (/licensed and insured/i.test(i.q)) cred = i.a; }));
    }
    t.ok(!cred || /^Yes\. We’re licensed and insured/.test(cred), 'a licensing question is answered from the owner’s answers (' + cred + ')');
    const area = secs(await site(base('Lawn care', { name: 'Area Lawn', towns: 'Shelbyville, Ogdenville' }))).filter((x) => x.type === 'faq').flatMap((f) => f.items).find((i) => /what areas/i.test(i.q));
    t.ok(!area || /Springfield, Shelbyville and Ogdenville/.test(area.a), 'the areas question lists the towns the owner gave');
  }

  // ---- logo mark ----
  {
    const STY = { trades: ['badge', 'icon'], pro: ['wordmark', 'monogram'], beauty: ['wordmark', 'monogram'], food: ['wordmark', 'icon'], creative: ['wordmark'], retail: ['wordmark'] };
    const FAM = { Plumber: 'trades', Electrician: 'trades', 'HVAC repair': 'trades', 'House cleaning': 'trades', 'Lawn care': 'trades', Locksmith: 'trades', 'Moving company': 'trades', 'Law firm': 'pro', Daycare: 'pro', Accountant: 'pro', 'Hair salon': 'beauty', 'Barber shop': 'beauty', Bakery: 'food', 'Coffee shop': 'food', 'Pizza restaurant': 'food', 'Wedding photographer': 'creative', 'Gift shop': 'retail' };
    const bad = []; const styles = {};
    for (const type of Object.keys(FAM)) for (const n of ['North', 'South', 'East', 'West']) {
      const m = (await site(base(type, { name: n + ' ' + type }))).logoMark;
      if (!m || STY[FAM[type]].indexOf(m.style) < 0 || !E.ICONS[m.icon]) bad.push(type + ' ' + JSON.stringify(m));
      (styles[FAM[type]] = styles[FAM[type]] || new Set()).add(m && m.style);
    }
    t.eq(bad.join(' | '), '', 'every site gets a logo mark that fits its family, with a real line icon');
    t.ok(styles.trades.size === 2 && styles.pro.size === 2, 'logo styles vary between businesses');
    const ic = async (type) => (await site(base(type))).logoMark.icon;
    t.ok(/droplet|wrench/.test(await ic('Plumber')) && /zap|plug|lightbulb/.test(await ic('Electrician')) && /leaf|sprout|trees/.test(await ic('Lawn care')) && /key-round|lock/.test(await ic('Locksmith')) && /coffee/.test(await ic('Coffee shop')) && /baby|blocks/.test(await ic('Daycare')), 'logo icons fit the trade');
    const m1 = (await site(base('Plumber', { name: 'Drip' }))).logoMark, m2 = (await site(base('Plumber', { name: 'Drip' }))).logoMark;
    t.eq(JSON.stringify(m2), JSON.stringify(m1), 'the same business always gets the same logo mark');
  }

  // ---- on the real worker: /create stores the answers ----
  {
    const j = await createSite(ctx.base, base('Plumber', { name: 'Answer Plumbing', unique: 'We <i>answer</i> every call', founded: '1700', licensed: true, insured: 'yes', towns: 'shelbyville, Ogdenville' }));
    const b = j.site.biz;
    t.ok(b.unique === 'We answer every call' && b.founded === '' && b.licensed === true && b.insured === false && b.towns.join('|') === 'Shelbyville|Ogdenville', 'the worker stores the answers sanitized (' + JSON.stringify({ u: b.unique, f: b.founded, l: b.licensed, i: b.insured, t: b.towns }) + ')');
    t.ok(/id="why"/.test(j.html) && /id="area"/.test(j.html) && j.site.logoMark && j.site.logoMark.icon, 'the live site renders why and areas, with a logo mark');
  }
};
