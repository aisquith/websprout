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
  const SRC = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site };';
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
    return { calls, build: (body, env, opts) => K.buildV3Site(body, env, opts === undefined ? { ai: true } : opts) };
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
    t.eq(homeCta(s).text, 'Licensed and insured. ' + GOOD.cta.text, 'AI call to action applied, keeping the licensed and insured lead');
    const about = s.pages.find((p) => p.path === 'about').sections.find((x) => x.type === 'intro');
    t.ok(about.text.indexOf('Family-owned, and we answer the phone ourselves.') === 0 && about.text.indexOf(GOOD.about) > 0, 'AI About story applied, still opening with the owner’s own words');
    const svc = secs(s).filter((x) => x.type === 'services').flatMap((x) => x.items);
    t.ok(svc.some((i) => i.name === 'Leak repairs' && i.text === GOOD.services[0].text) && !svc.some((i) => /Gold Package/.test(i.name + i.text)), 'AI service descriptions applied by name; invented services ignored');
    const why = secs(s).find((x) => x.type === 'why');
    t.eq(why.items.map((i) => i.source).join(','), 'unique,licensed,years,local', 'the owner’s own why points stay as written (all four slots are real answers here)');
    const few = secs((await fake(GOOD).build(biz({ founded: '' }), env())).site).find((x) => x.type === 'why');
    t.ok(few.items.slice(0, 3).map((i) => i.source).join(',') === 'unique,licensed,local' && few.items[3].source === 'ai' && few.items[3].title === 'We protect your floors', 'AI fills only the honest category why points');
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
    const s2 = (await capped.build(biz(), env({ KV: kv({ [MONTH()]: '3000' }) }))).site;
    t.ok(capped.calls.length === 0 && s2.copySource === 'template', 'monthly cap reached (default 3000): no AI call');
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
  }
  // ---- privacy page says what is sent ----
  {
    const p = rd('30-static-pages.js');
    t.ok(/Gemini API/.test(p) && !/not sent to any third-party AI service/.test(p) && /Account emails and visitor data are never sent|account email and your visitors/i.test(p), 'the privacy page explains what is sent to Gemini');
  }
};
