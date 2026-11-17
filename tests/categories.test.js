// Business categories: common business types get real, specific starter copy instead of the old generic filler, and a
// type that matches nothing gets copy built around the type itself (never a made-up service list). Runs the generator
// source in Node with a stand-in fetch (no photos, no AI unless a test fakes Gemini).
const fs = require('fs');
const path = require('path');

const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv() { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); } }; }

const COMMON = ['Security company', 'Pest control', 'HVAC', 'Electrician', 'Landscaping', 'Pool cleaning', 'Moving company', 'Towing', 'Auto repair', 'Car detailing', 'Painter', 'Handyman', 'Garage door repair', 'Pressure washing', 'Window cleaning', 'Junk removal', 'Tree service', 'Fencing', 'Concrete contractor', 'General contractor', 'Flooring', 'Solar installer', 'Appliance repair', 'IT services', 'Computer repair', 'Insurance agency', 'Real estate agent', 'Mortgage broker', 'Financial advisor', 'Chiropractor', 'Physical therapist', 'Massage therapist', 'Veterinarian', 'Pet sitter', 'Dog trainer', 'Daycare', 'Tutoring', 'Driving school', 'Martial arts', 'Dance studio', 'Music lessons', 'Wedding planner', 'DJ', 'Event venue', 'Catering', 'Food truck', 'Brewery', 'Bar', 'Pizza', 'Ice cream shop', 'Nail salon', 'Tattoo shop', 'Spa', 'Med spa', 'Optometrist', 'Pharmacy', 'Funeral home', 'Church', 'Hotel', 'Car wash', 'Printing shop', 'Marketing agency', 'Web designer', 'Staffing agency', 'Cleaning service', 'Carpet cleaning', 'Locksmith', 'Roofing', 'Plumbing', 'Photographer', 'Florist', 'Bakery', 'Gym', 'Personal trainer', 'Accountant', 'Law firm', 'Dentist'];
const LESS_COMMON = ['Escape room', 'Axe throwing', 'Doula', 'Land surveyor', 'Beekeeper', 'Kayak and paddleboard rentals', 'Pet cremation', 'Juice bar', 'Bridal shop', 'Chimney sweep', 'Septic service', 'Life coach', 'Piano tuner', 'Dry cleaner', 'Hearing aid center'];

module.exports = async function (ctx, t) {
  const SRC = rd('10-engine.js') + '\n' + rd('49-copy.js') + '\n' + rd('50-generator.js') + '\n;return { buildV3Site, v3StarterBase, v3TypePhrase, PHOTO_QUERY, V3_COLORFUL, V3_COPYBOOK, V3_SUBTYPES, V3_WHY, WSENGINE };';
  const kit = (reply) => {
    const calls = [];
    const K = new Function('fetch', SRC)(async (u, o) => {
      u = String(u);
      if (u.indexOf('generativelanguage.googleapis.com') < 0 || !reply) return json({}, 404);
      calls.push(JSON.parse(o.body));
      return json({ candidates: [{ content: { parts: [{ text: JSON.stringify(typeof reply === 'function' ? reply() : reply) }] } }] });
    });
    return { K, calls };
  };
  const { K } = kit(null);
  const W = K.WSENGINE;
  const build = async (type, extra) => (await K.buildV3Site(Object.assign({ name: 'Maple ' + type, type, city: 'Dallas, TX', phone: '(214) 555-0111' }, extra || {}), {})).site;
  const secs = (s) => s.pages.flatMap((p) => p.sections);
  const svcNames = (s) => secs(s).filter((x) => x.type === 'services').flatMap((x) => x.items.map((i) => i.name));
  const hero = (s) => s.pages[0].sections.find((x) => x.type === 'hero');
  const FILLER_SVC = /^(Friendly service|Tailored to you|Clear pricing|Here when you need us)$/;
  const FILLER_LINE = /Doing good work, every day|Quality service you can count on|Your local experts|Trusted by our neighbors|Friendly, straightforward help/;

  // ---- none of the common (or less common) types gets the old generic filler ----
  {
    const bad = [], generic = [];
    for (const type of COMMON.concat(LESS_COMMON)) {
      const s = await build(type);
      const txt = JSON.stringify(s.pages);
      if (svcNames(s).some((n) => FILLER_SVC.test(n))) bad.push(type + ': services ' + svcNames(s).join('/'));
      if (FILLER_LINE.test(txt)) bad.push(type + ': ' + (txt.match(FILLER_LINE) || [])[0]);
      if (COMMON.indexOf(type) > -1 && K.v3StarterBase(type).category === 'generic') generic.push(type);
    }
    t.eq(bad.join(' | '), '', 'no business type gets the generic service trio or filler tagline (' + (COMMON.length + LESS_COMMON.length) + ' types)');
    t.eq(generic.join(', '), '', 'every one of the ' + COMMON.length + ' common types has a real category');
  }

  // ---- categories and the clear mismatches fixed along the way ----
  {
    const MAP = [['Security company', 'security'], ['Alarm installation', 'security'], ['CCTV installer', 'security'], ['Security guard services', 'security'], ['Access control', 'security'], ['Locksmith', 'locksmith'], ['Locksmith and security', 'locksmith'], ['Gutter guards', 'home'], ['Lifeguard classes', 'education'],
      ['Towing', 'towing'], ['Tow truck service', 'towing'], ['Auto repair', 'auto'], ['Fencing', 'home'], ['Fence company', 'home'], ['Solar installer', 'home'], ['Computer repair', 'tech'], ['Cell phone repair shop', 'tech'], ['IT services', 'tech'], ['Managed IT support', 'tech'],
      ['Dance studio', 'fitness'], ['Ballet school', 'fitness'], ['Brewery', 'bar'], ['Bar', 'bar'], ['Pub', 'bar'], ['Cocktail lounge', 'bar'], ['Winery', 'bar'], ['Juice bar', 'cafe'], ['Nail bar', 'spa'], ['Sushi bar', 'restaurant'], ['Bar and grill', 'restaurant'], ['Beer garden', 'bar'],
      ['Pharmacy', 'pharmacy'], ['Drug store', 'pharmacy'], ['Funeral home', 'funeral'], ['Cremation services', 'funeral'], ['Pet cremation', 'funeral'], ['Church', 'church'], ['Baptist church', 'church'], ['Synagogue', 'church'], ['Church daycare', 'childcare'],
      ['Hotel', 'hotel'], ['Motel', 'hotel'], ['Bed and breakfast', 'hotel'], ['Pet hotel', 'pet'], ['Ice cream shop', 'cafe'], ['Printing shop', 'studio'], ['Pool cleaning', 'home'], ['Event venue', 'events'], ['Banquet hall', 'events'], ['Piano tuner', 'generic'], ['Piano lessons', 'education']];
    const wrong = MAP.filter(([ty, cat]) => K.v3StarterBase(ty).category !== cat).map(([ty, cat]) => ty + '→' + K.v3StarterBase(ty).category + ' (want ' + cat + ')');
    t.eq(wrong.join(', '), '', 'business types map to the right category');
    const NEW = ['security', 'towing', 'tech', 'bar', 'pharmacy', 'funeral', 'church', 'hotel'];
    t.eq(NEW.filter((c) => !(K.PHOTO_QUERY[c] && K.V3_COLORFUL[c] && K.V3_COPYBOOK[c] && K.V3_COPYBOOK[c].photo && K.V3_COPYBOOK[c].services.length >= 6 && K.V3_COPYBOOK[c].faq.length >= 5)).join(','), '', 'new categories have photo searches, colorful themes and full starter copy');
    const noIcon = [];
    NEW.forEach((c) => K.V3_COPYBOOK[c].services.forEach((x) => { if (!W.emojiIcon(x[2])) noIcon.push(c + ': ' + x[0]); }));
    K.V3_SUBTYPES.forEach((s) => (s.services || []).forEach((x) => { if (!W.emojiIcon(x[2])) noIcon.push(s.cat + ' ' + s.re + ': ' + x[0]); }));
    t.eq(noIcon.join(' | '), '', 'every starter service emoji has a line icon');
    const MIS = [['IT services', /IT support|Network setup|Backups/, /Strategy|Build and launch/], ['Med spa', /Consultations|Injectables|Laser/, /Pedicure/], ['Event venue', /Venue tours|Private parties|Weddings/, /On-the-day coordination|Supplier sourcing/], ['Insurance agency', /insurance/i, /Tax preparation|Bookkeeping/], ['Mortgage broker', /Pre-approval|Refinancing|Home purchase/, /Tax preparation/], ['Pool cleaning', /Weekly cleaning|Water balancing/, /Move-in/], ['Tree service', /Tree trimming|Tree removal|Stump/, /Mowing/], ['Garage door repair', /Spring|Opener/, /Free estimates|Renovations/], ['Concrete contractor', /Driveways|Patios|Slabs/, /Kitchens|Bathrooms/], ['Staffing agency', /staffing|hiring|Candidate/i, /Strategy|Design/], ['Printing shop', /Business cards|Banners|Flyers/, /Gift wrapping/], ['Ice cream shop', /Scoops|Sundaes/, /Gift wrapping|Carefully chosen/], ['Carpet cleaning', /Carpet|Upholstery|Stain/, /Move-in and move-out/], ['Personal trainer', /Personal training|Online coaching|Small-group/, /Open gym/]];
    const mis = [];
    for (const [type, want, not] of MIS) { const n = svcNames(await build(type)).join(' / '); if (!want.test(n) || not.test(n)) mis.push(type + ': ' + n); }
    t.eq(mis.join(' | '), '', 'types that used to land in a poor-fit category get their own services');
  }

  // ---- security ----
  {
    const s = await build('Security company');
    const n = svcNames(s);
    t.ok(n.indexOf('Camera systems') > -1 && n.indexOf('Alarm systems') > -1 && !n.some((x) => /Lockout|Rekey/.test(x)), 'a security company gets security services (' + n.slice(0, 4).join(', ') + ')');
    const icons = new Set();
    for (const nm of ['Sentinel', 'Guardian Watch', 'Apex', 'Northside', 'Ironclad', 'Lone Star']) icons.add((await build('Security company', { name: nm + ' Security' })).logoMark.icon);
    t.ok([...icons].every((i) => i === 'shield' || i === 'shield-check'), 'security logo marks use a shield icon (' + [...icons].join(',') + ')');
    t.ok(/^(w|b)_(navy|charcoal|indigo)$/.test(s.palette), 'security gets a strong navy or charcoal palette (' + s.palette + ')');
    const g = await build('Security guard services');
    t.ok(svcNames(g).some((x) => /officers|patrol|Event security/i.test(x)), 'a guarding company leads with officers and patrols (' + svcNames(g).slice(0, 3).join(', ') + ')');
    const steps = secs(g).find((x) => x.type === 'steps');
    t.ok(!steps || !/Installed/.test(JSON.stringify(steps.items)), 'a guarding company’s steps don’t talk about installs');
    const L = await build('Locksmith');
    t.ok(svcNames(L).indexOf('Lockouts') > -1 && /key-round|lock/.test(L.logoMark.icon) && K.v3StarterBase('Locksmith').category === 'locksmith', 'a locksmith still gets locksmith services and a key or lock mark');
  }

  // ---- calm, respectful wording for funeral homes and churches ----
  {
    for (const type of ['Funeral home', 'Church']) {
      for (const nm of ['North', 'South', 'East']) {
        const s = await build(type, { name: nm + ' ' + type });
        const txt = JSON.stringify(s.pages);
        const buttons = secs(s).filter((x) => x.type === 'cta').map((x) => x.button).filter(Boolean);
        t.ok(!/!|Book now|Get a quote|Request a quote|Start a project|fair prices|Clear costs up front/i.test(txt) && !s.pages.some((p) => /quote|book/.test(p.path)), type + ' (' + nm + '): no exclamation marks, sales buttons or price promises');
        if (nm === 'North') t.ok(buttons.every((b) => b === (type === 'Church' ? 'Plan a visit' : 'Speak with us')), type + ': every call-to-action button says ' + (type === 'Church' ? 'Plan a visit' : 'Speak with us') + ' (' + [...new Set(buttons)] + ')');
      }
    }
    const mosque = JSON.stringify((await build('Mosque')).pages);
    t.ok(!/Bible|Jesus|church/i.test(mosque), 'a mosque or synagogue gets faith-neutral wording');
  }

  // ---- the fallback for a type that matches nothing ----
  {
    const s = await build('Underwater basket weaving');
    const txt = JSON.stringify(s.pages);
    t.eq(K.v3StarterBase('Underwater basket weaving').category, 'generic', 'a made-up type still falls through to the fallback');
    t.ok(/underwater basket weaving/i.test(hero(s).tagline), 'the fallback tagline names the type (' + hero(s).tagline + ')');
    t.ok(/underwater basket weaving/i.test(secs(s).filter((x) => x.type === 'intro' || x.type === 'cta' || x.type === 'faq').map((x) => JSON.stringify(x)).join(' ')), 'the fallback copy uses the type in the story, call to action or questions');
    t.ok(!secs(s).some((x) => x.type === 'services' || x.type === 'steps') && !s.pages.some((p) => p.path === 'services'), 'no made-up services (and no services page or steps) when the owner listed none');
    t.ok(!FILLER_LINE.test(txt), 'no filler lines in the fallback');
    const city = (await K.buildV3Site({ name: 'Deep Weave', type: 'Underwater basket weaving' }, {})).site;
    t.ok(!/CITY|\[in|\{T|undefined/.test(JSON.stringify(city.pages)), 'without a city the fallback leaves no placeholders behind');
    const kayak = await build('Kayak and paddleboard rentals');
    t.eq(svcNames(kayak).slice(0, 2).join(','), 'Kayak rentals,Paddleboard rentals', 'a type that lists several things gets those as its services');
    const own = await build('Underwater basket weaving', { servicesText: 'Beginner classes\nPrivate lessons' });
    t.eq(svcNames(own).slice(0, 2).join(','), 'Beginner classes,Private lessons', 'the owner’s own services are used as given');
    const tp = (x) => { const p = K.v3TypePhrase(x); return p ? p.kind + ':' + p.phrase : 'none'; };
    t.eq(['Underwater basket weaving', 'Life coach', 'Escape room', 'Towing company', 'Septic service', 'Local business'].map(tp).join(' | '), 'activity:underwater basket weaving | person:life coach | place:escape room | activity:towing | activity:septic service | none', 'the fallback reads the type as an activity, a person or a place, and drops filler words');
    const vague = await build('Local business');
    t.ok(!/^Local (in|,)/i.test(hero(vague).tagline) && !/local business in/i.test(JSON.stringify(vague.pages)), 'a vague type gets neutral lines, not "Local in Dallas" (' + hero(vague).tagline + ')');
    t.ok(vague.logoMark && vague.logoMark.icon !== 'circle-check', 'the fallback logo mark never uses the generic tick');
  }

  // ---- AI copy may name the services for a type without a template, with the same guard rails ----
  {
    const REPLY = {
      taglines: ['Baskets woven underwater, one at a time.'], intro: 'We teach underwater basket weaving in Dallas.', about: 'A small studio with a big pool.',
      services: [{ name: 'Beginner classes', text: 'The basics, taught in a shallow pool.' }, { name: 'Services', text: 'Everything we do.' }, { name: 'Certified weaving', text: 'Officially approved baskets.' }, { name: 'Private lessons', text: 'One-on-one time in the water.' }, { name: '$20 starter kits', text: 'Reeds and a frame.' }, { name: 'Beginner Classes', text: 'Again.' }, { name: 'Group parties', text: 'Weave with friends for a birthday.' }, { name: 'Gear rental', text: 'Masks and fins for the session.' }, { name: 'Open sessions', text: 'Drop in and weave.' }, { name: 'Basket repair', text: 'Old baskets mended.' }],
      why: [], faq: [], cta: { title: 'Ready to get wet?', text: 'Book a first class and we’ll find you a time.' },
    };
    const F = kit(REPLY);
    const s = (await F.K.buildV3Site({ name: 'Deep Weave', type: 'Underwater basket weaving', city: 'Dallas, TX' }, { GEMINI_API_KEY: 'k', KV: kv() }, { ai: true })).site;
    const sent = JSON.parse(F.calls[0].contents[0].parts[0].text);
    t.ok(sent.suggestServices === true && /suggestServices is true/.test(F.calls[0].systemInstruction.parts[0].text), 'for a type without a template and no owner services, the AI is asked to suggest services');
    const n = svcNames(s.pages.length ? s : s);
    const uniq = [...new Set(n)];
    t.eq(uniq.join(','), 'Beginner classes,Private lessons,Group parties,Gear rental,Open sessions', 'AI service names are used, without vague names, claims, prices or repeats, and at most five');
    t.ok(s.pages.some((p) => p.path === 'services') && (s.copyFields || []).indexOf('services') > -1, 'the suggested services get a Services page and are recorded as AI copy');
    t.ok(['services.1:name_vague', 'services.2:name_claim', 'services.4:name_number', 'services.5:repeat'].every((x) => (s.copyRejected || []).indexOf(x) > -1), 'rejected names are recorded with reasons (' + s.copyRejected + ')');
    const one = kit(Object.assign({}, REPLY, { services: [{ name: 'Beginner classes', text: 'The basics.' }, { name: 'Other', text: 'Anything else.' }] }));
    const s1 = (await one.K.buildV3Site({ name: 'Deep Weave', type: 'Underwater basket weaving', city: 'Dallas, TX' }, { GEMINI_API_KEY: 'k', KV: kv() }, { ai: true })).site;
    t.ok(!secs(s1).some((x) => x.type === 'services') && (s1.copyRejected || []).indexOf('services:few') > -1, 'a single usable service is not enough: no services section');
    const owned = kit(REPLY);
    const s2 = (await owned.K.buildV3Site({ name: 'Deep Weave', type: 'Underwater basket weaving', city: 'Dallas, TX', servicesText: 'Taster sessions' }, { GEMINI_API_KEY: 'k', KV: kv() }, { ai: true })).site;
    t.ok(!JSON.parse(owned.calls[0].contents[0].parts[0].text).suggestServices && svcNames(s2).every((x) => x === 'Taster sessions'), 'with owner services the AI never adds any');
    const plumb = kit(REPLY);
    const s3 = (await plumb.K.buildV3Site({ name: 'Drip', type: 'Plumber', city: 'Dallas, TX' }, { GEMINI_API_KEY: 'k', KV: kv() }, { ai: true })).site;
    t.ok(!JSON.parse(plumb.calls[0].contents[0].parts[0].text).suggestServices && !svcNames(s3).some((x) => /Beginner|Private lessons/.test(x)), 'a matched category keeps its template services; AI names are ignored');
  }
};
