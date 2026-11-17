// AI-written copy (Gemini) for new sites: one call per /create, checked field by field, with the template copy
// as the fallback for anything slow, missing, capped or unsafe. Gemini is faked by running the generator source
// in Node with a stand-in fetch (the test server can't reach the internet).
const fs = require('fs');
const path = require('path');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv(init) { const m = new Map(Object.entries(init || {})); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); } }; }
const MONTH = () => 'ai:count:' + new Date().toISOString().slice(0, 7);

module.exports = async function (ctx, t) {
  const SRC = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, v3AiSim, V3_AI_RULES };';
  // fake(reply) → a kit whose Gemini answers with `reply` (an object, a function of the request, or a Response).
  const fake = (reply) => {
    const calls = [];
    const K = new Function('fetch', SRC)(async (u, o) => {
      u = String(u);
      if (u.indexOf('generativelanguage.googleapis.com') < 0) return json({}, 404);
      calls.push({ u, o, body: JSON.parse(o.body) });
      const r = typeof reply === 'function' ? await reply(calls[calls.length - 1], calls.length) : reply;
      if (r instanceof Response) return r;
      return json({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] });
    });
    return { calls, K, build: (body, env, opts) => K.buildV3Site(body, env, opts === undefined ? { ai: true } : opts) };
  };
  const env = (ex) => Object.assign({ GEMINI_API_KEY: 'TESTKEY', KV: kv() }, ex || {});
  const biz = (ex) => Object.assign({ name: 'Drip & Sons', type: 'Plumber', city: 'Springfield', phone: '(555) 010-0123', servicesText: 'Leak repairs - $90\nDrain clearing - $120\nToilet repairs', unique: 'Family-owned, and we answer the phone ourselves.', founded: '2004', licensed: true, insured: true, towns: 'Shelbyville, Ogdenville' }, ex || {});
  const YRS = String(new Date().getFullYear() - 2004);
  const GOOD = {
    tagline: 'Careful plumbing for Springfield homes.',
    intro: 'A family plumbing business that answers its own phone.',
    about: 'We look after homes in Springfield, Shelbyville and Ogdenville, and we’ve done it since 2004. ' + YRS + ' years of leaks, drains and tidy work.',
    services: [{ name: 'Leak repairs', text: 'Dripping taps and leaking pipes found and fixed properly.' }, { name: 'Drain clearing', text: 'Slow or blocked drains cleared without the mess.' }, { name: 'Gold Package', text: 'An invented service.' }],
    why: [{ title: 'We protect your floors', text: 'Covers down before we start, and a clean finish.' }, { title: 'Straight talk', text: 'We tell you what we found in plain words.' }],
    faq: [{ q: 'Can you fix a leak today?', a: 'Call us and we’ll tell you how soon we can come.' }, { q: 'Will I know the price first?', a: 'Yes. We explain the fix and the cost before we start.' }, { q: 'Do you work in Shelbyville?', a: 'Yes, Shelbyville is one of the towns we cover.' }],
    cta: { title: 'Got a leak?', text: 'Tell us what’s happening and we’ll arrange a visit.' },
  };
  const secs = (s) => s.pages.flatMap((p) => p.sections);
  const hero = (s) => s.pages[0].sections.find((x) => x.type === 'hero');
  const homeCta = (s) => s.pages[0].sections.find((x) => x.type === 'cta');
  const tpl = (await fake({}).build(biz(), {}, null)).site;

  // ---- valid AI copy is applied ----
  {
    const F = fake(GOOD);
    const r = await F.build(biz(), env());
    const s = r.site;
    t.eq(F.calls.length, 1, 'one Gemini call per new site');
    const c = F.calls[0];
    t.ok(/models\/gemini-2\.5-flash:generateContent$/.test(c.u) && c.o.headers['x-goog-api-key'] === 'TESTKEY' && c.u.indexOf('TESTKEY') < 0, 'calls gemini-2.5-flash generateContent with the key in a header, not the URL');
    t.ok(c.body.generationConfig.responseMimeType === 'application/json' && c.body.generationConfig.responseSchema && c.body.generationConfig.responseSchema.properties.faq, 'asks for JSON with a response schema');
    const sent = JSON.parse(c.body.contents[0].parts[0].text);
    t.ok(sent.facts.whatMakesUsDifferent === 'Family-owned, and we answer the phone ourselves.' && sent.facts.licensed === true && sent.facts.towns.join(',') === 'Shelbyville,Ogdenville' && sent.facts.yearStarted === '2004' && sent.draft && sent.draft.tagline, 'sends the business facts and the template draft');
    t.ok(!/@|email/i.test(c.o.body), 'no email addresses are sent');
    t.eq(s.copySource, 'ai', 'the site records that its copy came from the AI');
    t.ok(['tagline', 'about', 'services', 'faq', 'cta'].every((k) => (s.copyFields || []).indexOf(k) > -1), 'records which fields came from the AI (' + s.copyFields + ')');
    t.eq(hero(s).tagline, GOOD.tagline, 'AI tagline applied');
    t.eq(homeCta(s).text, GOOD.cta.text, 'AI call to action applied, without a licensed and insured lead (the trust strip already says it)');
    const lic = (await fake(GOOD).build(biz({ insured: false, founded: '', towns: '' }), env())).site;
    t.eq(homeCta(lic).text, 'Fully licensed. ' + GOOD.cta.text, 'without a trust strip the AI call to action keeps the licensed lead');
    const about = s.pages.find((p) => p.path === 'about').sections.find((x) => x.type === 'intro');
    t.ok(about.text.indexOf('Family-owned, and we answer the phone ourselves.') === 0 && about.text.indexOf(GOOD.about) > 0, 'AI About story applied, still opening with the owner’s own words');
    const svc = secs(s).filter((x) => x.type === 'services').flatMap((x) => x.items);
    t.ok(svc.some((i) => i.name === 'Leak repairs' && i.text === GOOD.services[0].text) && !svc.some((i) => /Gold Package/.test(i.name + i.text)), 'AI service descriptions applied by name; invented services ignored');
    const why = secs(s).find((x) => x.type === 'why');
    t.ok(why.items[0].source === 'unique' &&why.items.slice(1, 3).map((i) => i.source + ':' + i.title).join(',') === 'ai:We protect your floors,ai:Straight talk', 'the owner’s own point stays; the AI fills the honest category points (licensed, years and towns are on the trust strip) (' + why.items.map((i) => i.source) + ')');
    const own = secs((await fake(GOOD).build(biz({ licensed: false, insured: false, towns: '' }), env())).site).find((x) => x.type === 'why');
    t.ok(own.items.slice(0, 3).map((i) => i.source).join(',') === 'unique,years,local' && own.items[3].source === 'ai' && own.items[3].title === 'We protect your floors', 'the owner’s own why points stay as written; AI fills only the honest category points (' + own.items.map((i) => i.source) + ')');
    t.ok(secs(s).filter((x) => x.type === 'faq').every((f) => f.items[0].q === GOOD.faq[0].q), 'AI FAQ applied');
    t.ok(r.html.indexOf(GOOD.tagline) > -1, 'the AI copy is rendered');
    // never changed by the AI
    t.ok(s.biz.name === 'Drip & Sons' && s.biz.phone === '(555) 010-0123' && r.html.indexOf('(555) 010-0123') > -1, 'business name and phone untouched');
    const names = (x) => secs(x).filter((y) => y.type === 'services').map((y) => y.items.map((i) => i.name + '|' + i.from).join(',')).join(';');
    t.eq(names(s), names(tpl), 'service names and prices untouched');
    t.eq(s.pages.map((p) => p.path + ':' + p.sections.map((x) => x.type).join(',')).join(' '), tpl.pages.map((p) => p.path + ':' + p.sections.map((x) => x.type).join(',')).join(' '), 'page and section structure untouched');
    t.eq(env().KV.m.size, 0, 'sanity: a fresh KV is empty');
    const e2 = env(); await fake(GOOD).build(biz(), e2);
    t.eq(e2.KV.m.get(MONTH()), '1', 'each call is counted against the monthly cap');
  }

  // ---- unsafe fields fall back, field by field ----
  {
    const BAD = Object.assign({}, GOOD, {
      tagline: 'The best plumbers in Springfield',
      intro: 'Fast help 🚿',
      about: 'Serving you 24/7 with guaranteed results.',
      services: [{ name: 'Leak repairs', text: 'Fixed within 2 hours, from $49.' }, { name: 'Drain clearing', text: '<b>Drains</b> **cleared** properly.' }],
      why: [{ title: 'Certified pros', text: 'Award-winning service.' }, { title: 'Straight talk', text: 'We tell you what we found in plain words.' }],
      faq: [{ q: 'Do you offer free estimates?', a: 'Yes, always free.' }, GOOD.faq[1], GOOD.faq[2]],
      cta: { title: 'Call now!', text: 'We’re here.' },
    });
    const s = (await fake(BAD).build(biz(), env())).site;
    t.eq(hero(s).tagline, hero(tpl).tagline, 'a superlative tagline falls back to the template');
    t.ok(homeCta(s).title === homeCta(tpl).title && homeCta(s).text === homeCta(tpl).text, 'an exclamation mark in the CTA falls back to the template CTA');
    const about = s.pages.find((p) => p.path === 'about').sections.find((x) => x.type === 'intro');
    t.ok(!/24\/7|guarantee/.test(about.text) && about.text === tpl.pages.find((p) => p.path === 'about').sections.find((x) => x.type === 'intro').text, '24/7 and guarantees fall back to the template About');
    const svc = secs(s).filter((x) => x.type === 'services').flatMap((x) => x.items);
    const tsvc = secs(tpl).filter((x) => x.type === 'services').flatMap((x) => x.items);
    t.ok(svc.find((i) => i.name === 'Leak repairs').text === tsvc.find((i) => i.name === 'Leak repairs').text, 'invented numbers and prices fall back (per service)');
    t.eq(svc.find((i) => i.name === 'Drain clearing').text, 'Drains cleared properly.', 'HTML and markdown are stripped from an otherwise good field');
    const why = secs((await fake(BAD).build(biz({ founded: '' }), env())).site).find((x) => x.type === 'why');
    t.ok(!why.items.some((i) => /certif|award/i.test(i.title + i.text)) && why.items.some((i) => i.title === 'Straight talk'), 'certified/award why points are dropped, good ones kept');
    t.ok(secs(s).filter((x) => x.type === 'faq').every((f) => !/free/i.test(JSON.stringify(f.items))), '"free" (not given by the owner) falls back to the template FAQ');
    t.ok((s.copyFields || []).indexOf('tagline') < 0 && (s.copyFields || []).indexOf('services') > -1, 'only the fields that passed are recorded as AI');
    // licensed/insured only when true; digits only from the facts
    const noLic = (await fake(Object.assign({}, GOOD, { tagline: 'Licensed plumbing in Springfield.', cta: { title: 'Insured and ready', text: 'Call us.' } })).build(biz({ licensed: false, insured: false }), env())).site;
    const tnl = (await fake({}).build(biz({ licensed: false, insured: false }), {}, null)).site;
    t.ok(hero(noLic).tagline === hero(tnl).tagline && homeCta(noLic).title === homeCta(tnl).title, 'licensed or insured copy is rejected unless the owner said so');
    const yrs = (await fake(Object.assign({}, GOOD, { tagline: 'Plumbing in Springfield since 2004.', cta: { title: YRS + ' years of plumbing', text: 'Call us.' } })).build(biz(), env())).site;
    t.ok(hero(yrs).tagline === 'Plumbing in Springfield since 2004.' && homeCta(yrs).title === YRS + ' years of plumbing', 'the founding year and years in business are allowed');
    const odd = (await fake(Object.assign({}, GOOD, { tagline: 'Plumbing since 1998.' })).build(biz(), env())).site;
    t.eq(hero(odd).tagline, hero(tpl).tagline, 'a year the owner never gave is rejected');
    const own = (await fake(GOOD).build(biz({ tagline: 'Pipes, properly.', faq: [{ q: 'Weekends?', a: 'Saturdays, yes.' }] }), env())).site;
    t.ok(hero(own).tagline === 'Pipes, properly.' && secs(own).filter((x) => x.type === 'faq').every((f) => f.items[0].q === 'Weekends?'), 'an owner tagline and owner FAQ are never replaced');
    const junk = (await fake(new Response('not json', { status: 200 })).build(biz(), env())).site;
    t.eq(junk.copySource, 'template', 'an unreadable answer falls back to the template');
  }

  // ---- speed and cost safety ----
  {
    const slow = fake(() => new Promise(() => {}));
    const t0 = Date.now();
    const s = (await slow.build(biz(), env({ AI_TIMEOUT_MS: '300' }))).site;
    t.ok(s.copySource === 'template' && Date.now() - t0 < 3000 && hero(s).tagline === hero(tpl).tagline, 'a slow Gemini times out and the template copy is used (' + (Date.now() - t0) + 'ms)');
    const capped = fake(GOOD);
    const s2 = (await capped.build(biz(), env({ KV: kv({ [MONTH()]: '30000' }) }))).site;
    t.ok(capped.calls.length === 0 && s2.copySource === 'template', 'monthly cap reached (default 30000): no AI call');
    const cap0 = fake(GOOD); await cap0.build(biz(), env({ AI_MONTHLY_CAP: '0' }));
    t.eq(cap0.calls.length, 0, 'AI_MONTHLY_CAP sets the cap');
    const nokey = fake(GOOD); const s3 = (await nokey.build(biz(), { KV: kv() })).site;
    t.ok(nokey.calls.length === 0 && s3.copySource === 'template', 'no Gemini key: no AI call, template copy');
    const nokv = fake(GOOD); await nokv.build(biz(), { GEMINI_API_KEY: 'k' });
    t.eq(nokv.calls.length, 0, 'no KV counter: no AI call');
    const ex = fake(GOOD); const s4 = (await ex.build(biz(), env(), null)).site;
    t.ok(ex.calls.length === 0 && s4.copySource === 'template', 'builds without the AI option (examples) never call Gemini');
    t.ok(/buildV3Site\(input, env\)/.test(rd('50-generator.js')) && /buildV3Site\(body \|\| \{\}, env, \{ ai: true \}\)/.test(rd('50-generator.js')), 'only /create asks for AI copy; /example stays on the template');
    const rot = fake((c, n) => (n === 1 ? new Response('busy', { status: 429 }) : GOOD));
    const s5 = (await rot.build(biz(), env({ GEMINI_API_KEY: 'K1,K2' }))).site;
    t.ok(rot.calls.length === 2 && rot.calls[0].o.headers['x-goog-api-key'] !== rot.calls[1].o.headers['x-goog-api-key'] && s5.copySource === 'ai', 'a rate-limited key rolls over to the next one');
    const err = fake(new Response('bad', { status: 400 })); const s6 = (await err.build(biz(), env())).site;
    t.ok(err.calls.length === 1 && s6.copySource === 'template', 'a Gemini error falls back to the template');
    t.ok((s.copyRejected || []).join() === 'ai:timeout' && (s6.copyRejected || []).join() === 'ai:error', 'a failed call is recorded as one reason code (' + s.copyRejected + ' / ' + s6.copyRejected + ')');
    t.ok(!s2.copyRejected && !s3.copyRejected, 'no call (cap, no key): nothing recorded');
  }

  // ---- the brief: who they are, the owner's differentiator, the city as said in a sentence, good vs bad lines ----
  {
    const F = fake(GOOD);
    await F.build(biz({ city: 'Asheville, NC', towns: 'Asheville, Weaverville, Black Mountain' }), env());
    const c = F.calls[0], sent = JSON.parse(c.body.contents[0].parts[0].text), sys = c.body.systemInstruction.parts[0].text;
    t.ok(sent.facts.city === 'Asheville' && sent.facts.towns.join(',') === 'Weaverville,Black Mountain', 'the AI gets the city without its state, and the other towns (' + sent.facts.city + ' / ' + sent.facts.towns + ')');
    t.ok(/^Drip & Sons is a plumber in Asheville \(also working in Weaverville and Black Mountain\)\./.test(sent.brief) && sent.brief.indexOf('"Family-owned, and we answer the phone ourselves."') > -1 && /since 2004/.test(sent.brief) && !/, NC/.test(c.o.body), 'the brief says who they are, where, since when and the owner’s own words (' + sent.brief.slice(0, 90) + ')');
    t.ok(/Good: /.test(sys) && /Bad: /.test(sys) && /you can count on/.test(sys) && /look no further/.test(sys) && /taglines: 3 different candidates, 4–9 words/.test(sys) && /exactly one crisp noun-phrase line per service/.test(sys) && /Never start one with You get/.test(sys), 'the rules show good and bad lines and ask for 3 tagline candidates and one-sentence services');
    t.ok(c.body.generationConfig.responseSchema.properties.taglines.type === 'ARRAY' && sent.counts.taglines === 3, 'the schema asks for tagline candidates');
    t.ok(c.body.generationConfig.maxOutputTokens <= 1024 && c.body.generationConfig.thinkingConfig.thinkingBudget === 0, 'no thinking, output capped near 900 tokens');
    const nc = (await fake(Object.assign({}, GOOD, { cta: { title: 'Got a leak?', text: 'We cover Asheville, NC and the towns around it.' } })).build(biz({ city: 'Asheville, NC' }), env())).site;
    t.eq(homeCta(nc).text, 'We cover Asheville and the towns around it.', 'the city with its state in AI text is shortened to the city');
  }

  // ---- stricter checks: filler, near-template taglines, candidates, one-sentence services, rejection reasons ----
  {
    const tplTag = hero(tpl).tagline.replace(/\.$/, '');
    const F1 = fake(Object.assign({}, GOOD, { tagline: undefined, taglines: ['Plumbing you can count on, every time.', 'Quality service for every home.', 'Top-notch plumbing for Springfield homes.'], services: [{ name: 'Leak repairs', text: 'Trusted solutions for every leak.' }, { name: 'Drain clearing', text: 'Slow or blocked drains cleared without the mess.' }] }));
    const s1 = (await F1.build(biz(), env())).site;
    t.eq(hero(s1).tagline, hero(tpl).tagline, 'filler taglines ("you can count on", "quality service", "top-notch") fall back to the template');
    const svc1 = secs(s1).filter((x) => x.type === 'services').flatMap((x) => x.items);
    t.ok(svc1.find((i) => i.name === 'Leak repairs').text !== 'Trusted solutions for every leak.' && svc1.find((i) => i.name === 'Drain clearing').text === 'Slow or blocked drains cleared without the mess.', 'a filler service text falls back, the good one is kept');
    t.ok(s1.copyRejected.indexOf('tagline:filler') > -1 && s1.copyRejected.indexOf('services.0:filler') > -1, 'rejections are recorded with short reason codes (' + s1.copyRejected + ')');
    const fill = ['Look no further for plumbing.', 'We pride ourselves on tidy work.', 'Your one-stop plumbing shop here.', 'Plumbing that is second to none.', 'All your plumbing needs, handled well.'];
    const fr = [];
    for (const x of fill) { const sx = (await fake(Object.assign({}, GOOD, { tagline: x })).build(biz(), env())).site; if (hero(sx).tagline === x) fr.push(x); }
    t.eq(fr.join(' | '), '', 'every filler phrase is rejected');
    const s2 = (await fake(Object.assign({}, GOOD, { tagline: tplTag + ' in Springfield.' })).build(biz(), env())).site;
    t.ok(hero(s2).tagline === hero(tpl).tagline && s2.copyRejected.indexOf('tagline:template') > -1, 'the template tagline plus the city is rejected as near-template (' + tplTag + ' in Springfield.)');
    t.ok(F1.K.v3AiSim('Reliable plumbing, clearly priced.', 'Reliable plumbing, fairly priced.') > 0.7 && F1.K.v3AiSim('Reliable plumbing, clearly priced.', 'We answer our own phone, every time.') < 0.4, 'near-identical lines score above 0.7, different ones well below');
    const s3 = (await fake(Object.assign({}, GOOD, { tagline: undefined, taglines: ['Drip & Sons, plumbing done right.', 'Fixed.', 'We answer our own phone, every time.'] })).build(biz(), env())).site;
    t.ok(hero(s3).tagline === 'We answer our own phone, every time.' && (s3.copyRejected || []).every((x) => !/^tagline/.test(x)), 'the first tagline candidate that passes is used (not the business name, not too short)');
    const s4 = (await fake(Object.assign({}, GOOD, { tagline: undefined, taglines: ['Drip & Sons, plumbing done right.'] })).build(biz(), env())).site;
    t.ok(hero(s4).tagline === hero(tpl).tagline && s4.copyRejected.indexOf('tagline:name') > -1, 'a tagline repeating the business name is rejected');
    const s5 = (await fake(Object.assign({}, GOOD, { services: [{ name: 'Leak repairs', text: 'Dripping taps fixed. We work with all kinds of pipes to make sure it lasts.' }, { name: 'Drain clearing', text: 'Slow or blocked drains in kitchens, bathrooms, laundry rooms and basements cleared carefully with the right tools and no mess left.' }] })).build(biz(), env())).site;
    t.ok(!(s5.copyFields || []).includes('services') && s5.copyRejected.indexOf('services.0:sentences') > -1 && s5.copyRejected.indexOf('services.1:long') > -1, 'a second sentence or more than 120 characters in a service text falls back (' + s5.copyRejected + ')');
  }

  // ---- intro and FAQ are used where those sections exist; reasons say why not ----
  {
    const s = (await fake(GOOD).build(biz(), env())).site;
    t.ok(!s.pages[0].sections.some((x) => x.type === 'intro') && s.copyRejected.indexOf('intro:no_section') > -1, 'a plumber’s home page has no intro section: recorded as intro:no_section');
    const acc = (await fake(Object.assign({}, GOOD, { intro: 'We keep the books for small firms in Springfield, and we explain every number in plain words.' })).build(biz({ name: 'Ledger Lane', type: 'Accountant', servicesText: 'Bookkeeping\nTax returns' }), env())).site;
    const ai = acc.pages[0].sections.find((x) => x.type === 'intro');
    t.ok(ai && /^We keep the books/.test(ai.text) && acc.copyFields.indexOf('intro') > -1, 'where the home page has an intro the AI intro is used (' + (ai && ai.text.slice(0, 40)) + ')');
    const half = Object.assign({}, GOOD, { faq: [{ q: 'Do you handle emergencies?', a: 'Yes, emergency call-outs any time.' }, GOOD.faq[1], GOOD.faq[2]] });
    const sh = (await fake(half).build(biz(), env())).site;
    const cf = sh.pages.find((p) => p.path === 'contact').sections.find((x) => x.type === 'faq');
    t.ok(sh.copyFields.indexOf('faq') > -1 && cf.items[1].q === GOOD.faq[1].q && cf.items[2].a === GOOD.faq[2].a && !/emergency call-outs/.test(JSON.stringify(cf.items)) && sh.copyRejected.indexOf('faq.0:claim') > -1, 'one bad FAQ answer keeps the template’s question in its place; the good AI answers are still used (' + sh.copyRejected + ')');
    const tl = (await fake(Object.assign({}, GOOD, { faq: GOOD.faq.slice(0, 1) })).build(biz(), env())).site;
    t.ok(tl.copyFields.indexOf('faq') > -1 && tl.pages.find((p) => p.path === 'contact').sections.find((x) => x.type === 'faq').items[0].q === GOOD.faq[0].q, 'fewer AI answers than questions: the rest stay template');
    const nos = (await fake(Object.assign({}, GOOD, { why: [{ title: 'Straight talk', text: 'We tell you what we found.' }] })).build(biz({ licensed: false, insured: false, unique: '', towns: 'A, B, C' }), env())).site;
    t.ok(nos.copyFields.indexOf('why') > -1, 'why points are applied to honest category slots');
  }
  // ---- privacy page says what is sent ----
  {
    const p = rd('30-static-pages.js');
    t.ok(/Gemini API/.test(p) && !/not sent to any third-party AI service/.test(p) && /Account emails and visitor data are never sent|account email and your visitors/i.test(p), 'the privacy page explains what is sent to Gemini');
  }
};
