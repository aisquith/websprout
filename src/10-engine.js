// ===== WEBSPROUT v3 ENGINE (build.js also serves this body to the browser as /ws-engine.js) =====
const WSENGINE = (function(){
  const __ws = {};
  const globalThis = { get WS(){return __ws;}, set WS(v){} };
  // Websprout engine v3 — core. Runs in the browser (editor) and on the server (publishing).
(function (WS) {
  WS.esc = (s = '') =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  WS.tel = (p = '') => 'tel:' + String(p).replace(/[^\d+]/g, '');
  WS.map = (a = '') => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
  WS.mapEmbed = (a = '') => 'https://www.google.com/maps?q=' + encodeURIComponent(a) + '&output=embed';
  WS.money = (n) => (n === '' || n == null ? '' : typeof n === 'number' ? '$' + (Number.isInteger(n) ? n : n.toFixed(2)) : WS.esc(n));
  WS.fmtTime = (t) => {
    if (!t) return '';
    const [hh, mm] = String(t).split(':');
    let h = +hh;
    const s = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + (mm && mm !== '00' ? ':' + mm : '') + ' ' + s;
  };
  WS.uid = () => Math.random().toString(36).slice(2, 9);
  WS.words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  WS.streetOf = (addr = '') =>
    (String(addr).split(',')[0] || '')
      .replace(/^\d+\s+/, '')
      .replace(/^(N|S|E|W|North|South|East|West)\.?\s+/i, '')
      .replace(/\s+(Ave|Avenue|St|Street|Rd|Road|Blvd|Dr|Drive|Ln|Lane|Way|Pkwy)\.?$/i, '')
      .trim();
  // Split a name into two balanced lines: "Southside / Fade Co."
  WS.twoLines = (name = '') => {
    const w = String(name).split(' ');
    if (w.length < 2) return [name];
    let split = 1, best = Infinity;
    for (let i = 1; i < w.length; i++) {
      const m = Math.max(w.slice(0, i).join(' ').length, w.slice(i).join(' ').length);
      if (m < best) { best = m; split = i; }
    }
    return [w.slice(0, split).join(' '), w.slice(split).join(' ')];
  };
  WS.sections = {}; // registry: type -> { label, blurb, variants, fields, create, render }
  WS.register = (type, def) => (WS.sections[type] = { type, ...def });
})(globalThis.WS = globalThis.WS || {});

// 20 color palettes. Every site section uses these roles:
//   base/baseText   main sections          alt/altText   contrasting sections (price list, FAQ)
//   accent/accentText  buttons, numbers   pop/popText   loud band (reviews, call-to-action)
//   surface        empty photo spots and cards on base
// Each palette is checked for readable contrast by tools/check-palettes.js.
(function (WS) {
  WS.palettes = [
    { id: 'bottle', name: 'Bottle Green', base: '#0F2A23', baseText: '#ECE4D3', alt: '#ECE4D3', altText: '#14231E', accent: '#C49B4C', accentText: '#14231E', pop: '#7E1D27', popText: '#F6EEE2', surface: '#16382F' },
    { id: 'midnight', name: 'Midnight', base: '#101B31', baseText: '#EDE7DB', alt: '#EDE7DB', altText: '#121A2A', accent: '#D4AE6A', accentText: '#121A2A', pop: '#9B2335', popText: '#F8F0E6', surface: '#182848' },
    { id: 'oxblood', name: 'Oxblood', base: '#3A0E14', baseText: '#F2E9DC', alt: '#F2E9DC', altText: '#2A0D11', accent: '#E0B872', accentText: '#2A0D11', pop: '#1E4A3C', popText: '#F2E9DC', surface: '#4F161E' },
    { id: 'espresso', name: 'Espresso', base: '#2A1C14', baseText: '#F1E6D6', alt: '#F1E6D6', altText: '#2A1C14', accent: '#D9A05B', accentText: '#2A1C14', pop: '#3E5C4A', popText: '#F4ECDF', surface: '#3A281E' },
    { id: 'graphite', name: 'Graphite', base: '#1E2124', baseText: '#EDEDEA', alt: '#EDEDEA', altText: '#1E2124', accent: '#F08A3E', accentText: '#1E2124', pop: '#2F5D8A', popText: '#F4F6F8', surface: '#2A2E32' },
    { id: 'plum', name: 'Plum', base: '#2B1630', baseText: '#F6E8EE', alt: '#F6E8EE', altText: '#2B1630', accent: '#F2A97E', accentText: '#2B1630', pop: '#6B2A5E', popText: '#FBEFF4', surface: '#3A1F41' },
    { id: 'harbor', name: 'Harbor', base: '#0E3438', baseText: '#E8F1EE', alt: '#E8F1EE', altText: '#0E2A2D', accent: '#F08A6E', accentText: '#0E2A2D', pop: '#1F6F78', popText: '#F2FAF8', surface: '#144248' },
    { id: 'forest', name: 'Forest', base: '#16261A', baseText: '#EAF0E2', alt: '#EAF0E2', altText: '#16261A', accent: '#B9D46A', accentText: '#16261A', pop: '#7A3B1F', popText: '#F6ECE2', surface: '#1F3424' },
    { id: 'slate', name: 'Slate', base: '#28323C', baseText: '#EEF0F0', alt: '#EEF0F0', altText: '#1F272F', accent: '#E8C14E', accentText: '#1F272F', pop: '#A13D2D', popText: '#FBF1EC', surface: '#33404C' },
    { id: 'royal', name: 'Royal', base: '#1C1440', baseText: '#EFEAF8', alt: '#EFEAF8', altText: '#1C1440', accent: '#E6C068', accentText: '#1C1440', pop: '#3D2A8C', popText: '#F4F0FC', surface: '#281D57' },
    { id: 'citrus', name: 'Citrus Grove', base: '#183323', baseText: '#F3EFE2', alt: '#F3EFE2', altText: '#183323', accent: '#F29A38', accentText: '#183323', pop: '#E8C547', popText: '#183323', price: '#B04A16', surface: '#21432E' },
    { id: 'ember', name: 'Ember', base: '#211512', baseText: '#F5E9DE', alt: '#F5E9DE', altText: '#211512', accent: '#EE6A3A', accentText: '#211512', pop: '#A83A22', popText: '#FFF4EC', surface: '#30201B' },
    { id: 'linen', name: 'Linen', base: '#F4EEE3', baseText: '#1D2433', alt: '#1D2433', altText: '#F4EEE3', accent: '#1D2433', accentText: '#F4EEE3', pop: '#B8402E', popText: '#FFF6EE', price: '#F08A72', surface: '#E6DDCB' },
    { id: 'butter', name: 'Butter', base: '#F6DE8D', baseText: '#252A6B', alt: '#FFFBF0', altText: '#252A6B', accent: '#252A6B', accentText: '#FFFBF0', pop: '#C0303F', popText: '#FFFBF0', surface: '#EDCF73' },
    { id: 'mint', name: 'Mint', base: '#DDF0E4', baseText: '#13332A', alt: '#13332A', altText: '#DDF0E4', accent: '#13332A', accentText: '#DDF0E4', pop: '#E2603A', popText: '#1A0F0A', surface: '#C8E5D3' },
    { id: 'blush', name: 'Blush', base: '#F7DCDD', baseText: '#3A1426', alt: '#3A1426', altText: '#F7DCDD', accent: '#3A1426', accentText: '#F7DCDD', pop: '#2E59C9', popText: '#FFFFFF', price: '#F4A6B8', surface: '#EFC8CB' },
    { id: 'sky', name: 'Sky', base: '#DCEAF5', baseText: '#13294B', alt: '#13294B', altText: '#DCEAF5', accent: '#13294B', accentText: '#DCEAF5', pop: '#E9772E', popText: '#1A0E05', surface: '#C6DBEC' },
    { id: 'sage', name: 'Sage', base: '#DFE5D6', baseText: '#1F3326', alt: '#1F3326', altText: '#DFE5D6', accent: '#1F3326', accentText: '#DFE5D6', pop: '#9C4A2F', popText: '#FBF1EA', price: '#E9A07E', surface: '#CDD6C1' },
    { id: 'concrete', name: 'Concrete', base: '#E4E4E1', baseText: '#141414', alt: '#141414', altText: '#E4E4E1', accent: '#2246D6', accentText: '#FFFFFF', pop: '#2246D6', popText: '#FFFFFF', price: '#8FA6FF', surface: '#D2D2CE' },
    { id: 'desert', name: 'Desert', base: '#EBDCC4', baseText: '#3B2216', alt: '#3B2216', altText: '#EBDCC4', accent: '#A8431F', accentText: '#FFF6EC', pop: '#2D5A55', popText: '#F3EFE6', price: '#EDA77F', surface: '#DECBAD' },
  ];
  WS.palette = (id) => WS.palettes.find((p) => p.id === id) || WS.palettes[0];
  // A custom brand color replaces the theme's accent (buttons, highlights, color bands); text on it
  // switches between near-black and white for contrast.
  WS.lum = (hex) => { const h = String(hex || '').replace('#', ''); if (h.length !== 6) return 0.5; const c = [0, 2, 4].map((i) => { const v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  WS.withAccent = (p, hex) => {
    if (!p || !/^#[0-9a-fA-F]{6}$/.test(String(hex || ''))) return p;
    const on = WS.lum(hex) > 0.179 ? '#111111' : '#FFFFFF';
    return Object.assign({}, p, { accent: hex, accentText: on, pop: hex, popText: on, price: hex });
  };
  WS.paletteCss = (p) =>
    `--base:${p.base};--base-text:${p.baseText};--alt:${p.alt};--alt-text:${p.altText};--accent:${p.accent};--accent-text:${p.accentText};--pop:${p.pop};--pop-text:${p.popText};--surface:${p.surface};--price:${p.price || p.pop}`;
})(globalThis.WS = globalThis.WS || {});

// Clean single-accent palettes for the Atelier style (contrast-checked via tools/audit.js).
// Each color ships as a LIGHT theme (white base + one accent + near-black contrast bands) and a
// NOIR twin (near-black base + the same accent, brightened for legibility). No clashing second hue.
// Roles: base, alt, accent, pop, surface, price (+ *-text pairs). pop ALWAYS equals accent here, so a
// site reads as "white + one color" (or "black + one color"), never teal-and-brown.
(function (WS) {
  WS.palettes = WS.palettes || [];
  const fresh = [];
  const add = (p) => { if (!WS.palettes.some((x) => x.id === p.id) && !fresh.some((x) => x.id === p.id)) fresh.push(p); };

  // Monochrome (the default look): white base, black as the accent, and black inverted bands via alt/pop.
  // alt stays a near-white so the price list reads light; pop is true black for the dramatic sections.
  add({ id: 'w_mono', name: 'Mono', base: '#FFFFFF', baseText: '#111111', alt: '#F4F4F2', altText: '#111111', accent: '#111111', accentText: '#FFFFFF', pop: '#111111', popText: '#FFFFFF', price: '#111111', surface: '#ECECEA' });
  add({ id: 'b_mono', name: 'Mono Noir', base: '#111111', baseText: '#F3F3F1', alt: '#1A1A1A', altText: '#F3F3F1', accent: '#FFFFFF', accentText: '#111111', pop: '#FFFFFF', popText: '#111111', price: '#FFFFFF', surface: '#1C1C1C' });

  // name, warm?, aLight (accent on white, white text), aTint (light tint for prices on dark bands),
  // aDark (accent on black, dark text), aDarkText
  const INK = '#17171A';
  function theme(key, name, warm, aLight, aTint, aDark, aDarkText) {
    const wBase = warm ? '#FCFAF6' : '#FAFBFC', wSurf = warm ? '#F0ECE3' : '#EDEFF2';
    add({ id: 'w_' + key, name: name, base: wBase, baseText: INK, alt: INK, altText: wBase, accent: aLight, accentText: '#FFFFFF', pop: aLight, popText: '#FFFFFF', price: aTint, surface: wSurf });
    add({ id: 'b_' + key, name: name + ' Noir', base: '#131315', baseText: '#EDEBE7', alt: '#1D1D20', altText: '#EDEBE7', accent: aDark, accentText: aDarkText, pop: aDark, popText: aDarkText, price: aDark, surface: '#1D1D20' });
  }

  theme('indigo', 'Indigo', false, '#3B46C7', '#AEB6FF', '#8E97FF', '#10111E');
  theme('ocean', 'Ocean', false, '#17619A', '#86C4EE', '#54B0E6', '#08161F');
  theme('teal', 'Teal', false, '#0F6E68', '#74D6CE', '#3EC4BA', '#04201D');
  theme('emerald', 'Emerald', false, '#157349', '#78D6A4', '#43C589', '#052015');
  theme('slate', 'Slate', false, '#3A5168', '#A9C0D8', '#90B2D6', '#0A1622');
  theme('plum', 'Plum', false, '#6B4887', '#CBA9E0', '#BE97DB', '#190F24');
  theme('charcoal', 'Charcoal', false, '#2A2A30', '#B8B8C2', '#C9C9D2', '#131315');
  theme('rose', 'Rose', true, '#A84059', '#F2A3B6', '#EC87A0', '#2A0C15');
  theme('crimson', 'Crimson', true, '#B23429', '#F49A90', '#F06E63', '#2A0906');
  theme('rust', 'Terracotta', true, '#A64A26', '#EDA986', '#E08A5E', '#2A1206');
  theme('coffee', 'Coffee', true, '#5F4330', '#D0A985', '#C79A77', '#221208');
  theme('amber', 'Amber', true, '#8A5A10', '#F0C878', '#E8B457', '#241A06');

  // Kept for back-compat with sites created earlier, now fixed to single-accent (pop = accent).
  add({ id: 'porcelain', name: 'Porcelain', base: '#F3F1EC', baseText: '#1C1917', alt: '#1C1917', altText: '#F3F1EC', accent: '#8A5A36', accentText: '#FBF6F0', pop: '#8A5A36', popText: '#FBF6F0', price: '#D7A878', surface: '#E9E6DF' });
  add({ id: 'cream', name: 'Cream', base: '#F6F0E6', baseText: '#2A211A', alt: '#241C15', altText: '#F6F0E6', accent: '#B0543A', accentText: '#FCF4EE', pop: '#B0543A', popText: '#FCF4EE', price: '#EBA487', surface: '#ECE3D2' });
  add({ id: 'ink', name: 'Ink', base: '#141414', baseText: '#ECEAE6', alt: '#1F1F1F', altText: '#ECEAE6', accent: '#D99A3C', accentText: '#141414', pop: '#D99A3C', popText: '#141414', price: '#D99A3C', surface: '#1F1F1F' });

  // Clean themes lead the list; this also makes palettes[0] a clean white theme (a nicer fallback).
  WS.palettes = fresh.concat(WS.palettes);
})(globalThis.WS = globalThis.WS || {});

(function(WS){WS.EMOJI={"cats":[{"id":"smileys","label":"Smileys & Emotion","emojis":["1f600","1f603","1f604","1f601","1f606","1f605","1f602","1f923","1f62d","1f609","1f617","1f619","1f61a","1f618","1f970","1f60d","1f929","1f973","1fae0","1f643","1f642","1f972","1f979","1f60a","263a_fe0f","1f60c","1f642_200d_2195_fe0f","1f642_200d_2194_fe0f","1f60f","1f924","1f60b","1f61b","1f61d","1f61c","1f92a","1f974","1f614","1f97a","1f62c","1f611","1f610","1f636","1f636_200d_1f32b_fe0f","1fae5","1f910","1fae1","1f914","1f92b","1fae2","1f92d","1f971","1f917","1fae3","1f631","1f928","1f9d0","1f612","1f644","1f62e_200d_1f4a8","1f624","1f620","1f621","1f92c","1f61e","1f613","1f61f","1f625","1f622","2639_fe0f","1f641","1fae4","1f615","1f630","1f628","1f627","1f626","1f62e","1f62f","1f632","1f633","1f92f","1f616","1f623","1f629","1f62b","1f635","1f635_200d_1f4ab","1fae8","1f976","1f975","1f922","1f92e","1fae9","1f634","1f62a","1f927","1f912","1f915","1f637","1f925","1f607","1f920","1f911","1f913","1f60e","1f978","1f921","1f4a9","1f608","1f47f","1f47b","1f480","1f916","1f47d","1f47e","1f63a","1f638","1f639","1f63b","1f63c","1f63d","1f640","1f63f","1f63e","1f648","1f649","1f64a","2764_fe0f","1f9e1","1f49b","1f49a","1fa75","1f499","1f49c","1f90e","1f5a4","1fa76","1f90d","1fa77","1f498","1f49d","1f496","1f497","1f493","1f49e","1f495","1f48c","1f49f","2763_fe0f","2764_fe0f_200d_1fa79","1f494","2764_fe0f_200d_1f525","1f48b"]},{"id":"people","label":"People & Body","emojis":["1f44f","1f44d","1f44e","1faf6","1f64c","1f450","1f932","1f91c","1f91b","270a","1f44a","1faf3","1faf4","1faf1","1faf2","1faf8","1faf7","1f44b","1f91a","1f590_fe0f","270b","1f596","1f91f","1f918","270c_fe0f","1f91e","1faf0","1f919","1f90c","1f90f","1f44c","1faf5","1f449","1f448","261d_fe0f","1f446","1f447","1f595","270d_fe0f","1f933","1f64f","1f485","1f91d","1f463","1fac6","1fac0","1fa78","1f9a0","1f440","1f441_fe0f","1fae6","1f443","1f442","1f9bb","1f9b6","1f9b5","1f9bf","1f9be","1f4aa","1f483","1f57a"]},{"id":"animals","label":"Animals & Nature","emojis":["1f42e","1f984","1f98e","1f409","1f996","1f995","1f422","1f40a","1f40d","1f438","1f407","1f400","1f429","1f415","1f9ae","1f415_200d_1f9ba","1f416","1f40e","1facf","1f402","1f410","1f998","1f405","1f412","1f98d","1f9a7","1f43f_fe0f","1f9a6","1f987","1f426","1f426_200d_2b1b","1f413","1f423","1f424","1f425","1f985","1f989","1f54a_fe0f","1fabf","1f99a","1f426_200d_1f525","1f9ad","1f988","1f42c","1f433","1f41f","1f421","1f99e","1f980","1f419","1fabc","1f982","1f577_fe0f","1f40c","1f41c","1f99f","1fab3","1fab0","1f41d","1f41e","1f98b","1f41b","1fab1","1f43e","1f490","1f339","1f940","1f342","1f331","1f343","1f340","1fabe","2744_fe0f","1f30b","1f305","1f304","1f308","1fae7","1f30a","1f32c_fe0f","1f32a_fe0f","1f4a7","1f327_fe0f","1f329_fe0f","1f30d","1f30e","1f30f","2604_fe0f","1f31e","1f31b","1f31c","1f31f","2728","26a1","1f4a5","1f525"]},{"id":"food","label":"Food & Drink","emojis":["1f345","1fadc","1f373","1f32f","1f35d","1f35c","1f37f","2615","1f37b","1f942","1f37e","1f377","1fad7","1f379"]},{"id":"activities","label":"Activities & Sports","emojis":["26bd","26be","1f94e","1f3be","1f3f8","1f94d","1f3cf","1f3d1","1f3d2","26f8_fe0f","1f6fc","1fa70","1f6f9","26f3","1f3af","1f94f","1fa83","1fa81","1f3a3","1f94b","1f3b1","1f3d3","1f3b3","1f3b2","1f3b0","1fa84","1f3c6"]},{"id":"travel","label":"Travel & Places","emojis":["1f6a7","1f6a8","1f6b2","1f697","1f3ce_fe0f","1f695","1f68c","26f5","1f6f6","1f6f8","1f680","1f6eb","1f6ec","1f3a2","1f3a1","1f3d5_fe0f"]},{"id":"objects","label":"Objects","emojis":["1f4f8","1fadf","1f3b7","1f3ba","1f3bb","1fa89","1f941","1fa87","1f3ac","1f50b","1faab","1fa99","1f4b8","1f48e","2696_fe0f","1f4a1","1f393","1f48d","1faad","2602_fe0f","1fa8f","2699_fe0f","26d3_fe0f_200d_1f4a5","270f_fe0f","23f0","1f6ce_fe0f","1f514","1f52e","1f4a3","1faa4","1f512"]},{"id":"symbols","label":"Symbols","emojis":["2648","2649","264a","264b","264c","264d","264e","264f","2650","2651","2652","2653","26ce","2757","2753","2049_fe0f","203c_fe0f","274c","1f198","1f4f4","2622_fe0f","2623_fe0f","26a0_fe0f","2705","1f195","1f193","1f199","1f192","1f6ae","262e_fe0f","262f_fe0f","267e_fe0f","1f3b6","2795","1f4af","1f31f"]},{"id":"celebrations","label":"Celebrations","emojis":["1f388","1f382","1f381","1f386","1fa85","1faa9","1f389","1f38a","1f947","1f948","1f949","1f3c1","1f6a9","1f3f4","1f3f3_fe0f"]}],"kw":{"2615":"hot-beverage","2648":"aries","2649":"taurus","2650":"sagittarius","2651":"capricorn","2652":"aquarius","2653":"pisces","2705":"check-mark check-mark-green","2728":"sparkles","2753":"question question-mark ?","2757":"exclamation exclamation-mark","2795":"plus-sign +","1f600":"smile","1f603":"smile-with-big-eyes","1f604":"grin","1f601":"grinning","1f606":"laughing","1f605":"grin-sweat","1f602":"joy","1f923":"rofl","1f62d":"loudly-crying","1f609":"wink","1f617":"kissing","1f619":"kissing-smiling-eyes","1f61a":"kissing-closed-eyes","1f618":"kissing-heart","1f970":"heart-face 3-hearts","1f60d":"heart-eyes","1f929":"star-struck","1f973":"partying-face","1fae0":"melting","1f643":"upside-down-face","1f642":"slightly-happy","1f972":"happy-cry","1f979":"holding-back-tears","1f60a":"blush","263a_fe0f":"warm-smile","1f60c":"relieved","1f642_200d_2195_fe0f":"head-nod","1f642_200d_2194_fe0f":"head-shake","1f60f":"smirk","1f924":"drool","1f60b":"yum","1f61b":"stuck-out-tongue","1f61d":"squinting-tongue","1f61c":"winky-tongue","1f92a":"zany-face","1f974":"woozy","1f614":"pensive","1f97a":"pleading","1f62c":"grimacing","1f611":"expressionless","1f610":"neutral-face","1f636":"mouth-none","1f636_200d_1f32b_fe0f":"face-in-clouds lost","1fae5":"dotted-line-face invisible","1f910":"zipper-face","1fae1":"salute","1f914":"thinking-face","1f92b":"shushing-face","1fae2":"hand-over-mouth","1f92d":"smiling-eyes-with-hand-over-mouth chuckling","1f971":"yawn","1f917":"hug-face","1fae3":"peeking","1f631":"screaming","1f928":"raised-eyebrow","1f9d0":"monocle","1f612":"unamused","1f644":"rolling-eyes","1f62e_200d_1f4a8":"exhale","1f624":"triumph","1f620":"angry","1f621":"rage","1f92c":"cursing","1f61e":"sad","1f613":"sweat downcast","1f61f":"worried","1f625":"concerned","1f622":"cry","2639_fe0f":"big-frown","1f641":"frown","1fae4":"diagonal-mouth","1f615":"slightly-frowning","1f630":"anxious-with-sweat","1f628":"scared","1f627":"anguished","1f626":"gasp","1f62e":"mouth-open","1f62f":"surprised hushed","1f632":"astonished","1f633":"flushed","1f92f":"mind-blown exploding-head","1f616":"scrunched-mouth confounded zigzag-mouth","1f623":"scrunched-eyes persevering","1f629":"weary","1f62b":"distraught","1f635":"x-eyes","1f635_200d_1f4ab":"dizzy-face","1fae8":"shaking-face","1f976":"cold-face","1f975":"hot-face sweat-face","1f922":"sick nauseated","1f92e":"vomit","1fae9":"tired bags-under-eyes","1f634":"sleep","1f62a":"sleepy","1f927":"sneeze","1f912":"thermometer-face","1f915":"bandage-face","1f637":"mask","1f925":"liar","1f607":"halo innocent","1f920":"cowboy","1f911":"money-face","1f913":"nerd-face","1f60e":"sunglasses-face","1f978":"disguise","1f921":"clown","1f4a9":"poop","1f608":"imp-smile","1f47f":"imp-frown","1f47b":"ghost","1f480":"skull","2603_fe0f":"snowman-with-snow","26c4":"snowman","1f383":"jack-o-lantern","1f916":"robot","1f47d":"alien","1f47e":"alien-monster","1f31e":"sun-with-face","1f31b":"moon-face-first-quarter","1f31c":"moon-face-last-quarter","1f63a":"smiley-cat","1f638":"smile-cat","1f639":"joy-cat","1f63b":"heart-eyes-cat","1f63c":"smirk-cat","1f63d":"kissing-cat","1f640":"scream-cat","1f63f":"crying-cat-face","1f63e":"pouting-cat","1f648":"see-no-evil-monkey","1f649":"hear-no-evil-monkey","1f64a":"speak-no-evil-monkey","1f31f":"glowing-star","26a1":"electricity zap lightning","1f4a5":"collision","1f525":"fire burn lit","1f4af":"100 one-hundred hundred points","1f389":"party-popper","1f38a":"confetti-ball","2764_fe0f":"red-heart","1f9e1":"orange-heart","1f49b":"yellow-heart","1f49a":"green-heart","1fa75":"light-blue-heart","1f499":"blue-heart","1f49c":"purple-heart","1f90e":"brown-heart","1f5a4":"black-heart","1fa76":"grey-heart","1f90d":"white-heart","1fa77":"pink-heart","1f498":"cupid","1f49d":"gift-heart","1f496":"sparkling-heart","1f497":"heart-grow","1f493":"beating-heart","1f49e":"revolving-hearts","1f495":"two-hearts","1f48c":"love-letter","1f49f":"heart-box","2763_fe0f":"heart-exclamation-point","2764_fe0f_200d_1fa79":"bandaged-heart","1f494":"broken-heart","2764_fe0f_200d_1f525":"fire-heart","1f48b":"kiss","1f463":"footprints","1fac6":"fingerprint","1fac0":"anatomical-heart","1fa78":"blood","1f9a0":"microbe virus","1f440":"eyes","1f441_fe0f":"eye","1fae6":"biting-lip","1f443":"nose","1f443_1f3fb":"nose","1f443_1f3fc":"nose","1f443_1f3fd":"nose","1f443_1f3fe":"nose","1f443_1f3ff":"nose","1f442":"ear","1f442_1f3fb":"ear","1f442_1f3fc":"ear","1f442_1f3fd":"ear","1f442_1f3fe":"ear","1f442_1f3ff":"ear","1f9bb":"hearing-aid","1f9bb_1f3fb":"hearing-aid","1f9bb_1f3fc":"hearing-aid","1f9bb_1f3fd":"hearing-aid","1f9bb_1f3fe":"hearing-aid","1f9bb_1f3ff":"hearing-aid","1f9b6":"foot","1f9b6_1f3fb":"foot","1f9b6_1f3fc":"foot","1f9b6_1f3fd":"foot","1f9b6_1f3fe":"foot","1f9b6_1f3ff":"foot","1f9b5":"leg","1f9b5_1f3fb":"leg","1f9b5_1f3fc":"leg","1f9b5_1f3fd":"leg","1f9b5_1f3fe":"leg","1f9b5_1f3ff":"leg","1f9bf":"leg-mechanical","1f9be":"arm-mechanical","1f4aa":"muscle flex bicep strong","1f4aa_1f3fb":"muscle flex bicep strong","1f4aa_1f3fc":"muscle flex bicep strong","1f4aa_1f3fd":"muscle flex bicep strong","1f4aa_1f3fe":"muscle flex bicep strong","1f4aa_1f3ff":"muscle flex bicep strong","1f44f":"clap","1f44f_1f3fb":"clap","1f44f_1f3fc":"clap","1f44f_1f3fd":"clap","1f44f_1f3fe":"clap","1f44f_1f3ff":"clap","1f44d":"thumbs-up +1","1f44d_1f3fb":"thumbs-up +1","1f44d_1f3fc":"thumbs-up +1","1f44d_1f3fd":"thumbs-up +1","1f44d_1f3fe":"thumbs-up +1","1f44d_1f3ff":"thumbs-up +1","1f44e":"thumbs-down","1f44e_1f3fb":"thumbs-down","1f44e_1f3fc":"thumbs-down","1f44e_1f3fd":"thumbs-down","1f44e_1f3fe":"thumbs-down","1f44e_1f3ff":"thumbs-down","1faf6":"heart-hands","1faf6_1f3fb":"heart-hands","1faf6_1f3fc":"heart-hands","1faf6_1f3fd":"heart-hands","1faf6_1f3fe":"heart-hands","1faf6_1f3ff":"heart-hands","1f64c":"raising-hands hooray","1f64c_1f3fb":"raising-hands hooray","1f64c_1f3fc":"raising-hands hooray","1f64c_1f3fd":"raising-hands hooray","1f64c_1f3fe":"raising-hands hooray","1f64c_1f3ff":"raising-hands hooray","1f450":"open-hands","1f450_1f3fb":"open-hands","1f450_1f3fc":"open-hands","1f450_1f3fd":"open-hands","1f450_1f3fe":"open-hands","1f450_1f3ff":"open-hands","1f932":"palms-up","1f932_1f3fb":"palms-up","1f932_1f3fc":"palms-up","1f932_1f3fd":"palms-up","1f932_1f3fe":"palms-up","1f932_1f3ff":"palms-up","1f91c":"fist-rightwards","1f91c_1f3fb":"fist-rightwards","1f91c_1f3fc":"fist-rightwards","1f91c_1f3fd":"fist-rightwards","1f91c_1f3fe":"fist-rightwards","1f91c_1f3ff":"fist-rightwards","1f91b":"fist-leftwards","1f91b_1f3fb":"fist-leftwards","1f91b_1f3fc":"fist-leftwards","1f91b_1f3fd":"fist-leftwards","1f91b_1f3fe":"fist-leftwards","1f91b_1f3ff":"fist-leftwards","270a":"raised-fist","270a_1f3fb":"raised-fist","270a_1f3fc":"raised-fist","270a_1f3fd":"raised-fist","270a_1f3fe":"raised-fist","270a_1f3ff":"raised-fist","1f44a":"fist bump","1f44a_1f3fb":"fist bump","1f44a_1f3fc":"fist bump","1f44a_1f3fd":"fist bump","1f44a_1f3fe":"fist bump","1f44a_1f3ff":"fist bump","1faf3":"palm-down drop","1faf3_1f3fb":"palm-down drop","1faf3_1f3fc":"palm-down drop","1faf3_1f3fd":"palm-down drop","1faf3_1f3fe":"palm-down drop","1faf3_1f3ff":"palm-down drop","1faf4":"palm-up throw","1faf4_1f3fb":"palm-up throw","1faf4_1f3fc":"palm-up throw","1faf4_1f3fd":"palm-up throw","1faf4_1f3fe":"palm-up throw","1faf4_1f3ff":"palm-up throw","1faf1":"rightwards-hand","1faf1_1f3fb":"rightwards-hand","1faf1_1f3fc":"rightwards-hand","1faf1_1f3fd":"rightwards-hand","1faf1_1f3fe":"rightwards-hand","1faf1_1f3ff":"rightwards-hand","1faf2":"leftwards-hand","1faf2_1f3fb":"leftwards-hand","1faf2_1f3fc":"leftwards-hand","1faf2_1f3fd":"leftwards-hand","1faf2_1f3fe":"leftwards-hand","1faf2_1f3ff":"leftwards-hand","1faf8":"push-rightwards","1faf8_1f3fb":"push-rightwards","1faf8_1f3fc":"push-rightwards","1faf8_1f3fd":"push-rightwards","1faf8_1f3fe":"push-rightwards","1faf8_1f3ff":"push-rightwards","1faf7":"push-leftwards","1faf7_1f3fb":"push-leftwards","1faf7_1f3fc":"push-leftwards","1faf7_1f3fd":"push-leftwards","1faf7_1f3fe":"push-leftwards","1faf7_1f3ff":"push-leftwards","1f44b":"wave","1f44b_1f3fb":"wave","1f44b_1f3fc":"wave","1f44b_1f3fd":"wave","1f44b_1f3fe":"wave","1f44b_1f3ff":"wave","1f91a":"back-hand","1f91a_1f3fb":"back-hand","1f91a_1f3fc":"back-hand","1f91a_1f3fd":"back-hand","1f91a_1f3fe":"back-hand","1f91a_1f3ff":"back-hand","1f590_fe0f":"palm","1f590_1f3fb":"palm","1f590_1f3fc":"palm","1f590_1f3fd":"palm","1f590_1f3fe":"palm","1f590_1f3ff":"palm","270b":"raised-hand","270b_1f3fb":"raised-hand","270b_1f3fc":"raised-hand","270b_1f3fd":"raised-hand","270b_1f3fe":"raised-hand","270b_1f3ff":"raised-hand","1f596":"vulcan prosper spock","1f596_1f3fb":"vulcan prosper spock","1f596_1f3fc":"vulcan prosper spock","1f596_1f3fd":"vulcan prosper spock","1f596_1f3fe":"vulcan prosper spock","1f596_1f3ff":"vulcan prosper spock","1f91f":"love-you-gesture","1f91f_1f3fb":"love-you-gesture","1f91f_1f3fc":"love-you-gesture","1f91f_1f3fd":"love-you-gesture","1f91f_1f3fe":"love-you-gesture","1f91f_1f3ff":"love-you-gesture","1f918":"metal horns","1f918_1f3fb":"metal horns","1f918_1f3fc":"metal horns","1f918_1f3fd":"metal horns","1f918_1f3fe":"metal horns","1f918_1f3ff":"metal horns","270c_fe0f":"victory v peace-hand","270c_1f3fb":"victory v peace-hand","270c_1f3fc":"victory v peace-hand","270c_1f3fd":"victory v peace-hand","270c_1f3fe":"victory v peace-hand","270c_1f3ff":"victory v peace-hand","1f91e":"crossed-fingers","1f91e_1f3fb":"crossed-fingers","1f91e_1f3fc":"crossed-fingers","1f91e_1f3fd":"crossed-fingers","1f91e_1f3fe":"crossed-fingers","1f91e_1f3ff":"crossed-fingers","1faf0":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1faf0_1f3fb":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1faf0_1f3fc":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1faf0_1f3fd":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1faf0_1f3fe":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1faf0_1f3ff":"hand-with-index-finger-and-thumb-crossed snap finger-heart","1f919":"call-me-hand","1f919_1f3fb":"call-me-hand","1f919_1f3fc":"call-me-hand","1f919_1f3fd":"call-me-hand","1f919_1f3fe":"call-me-hand","1f919_1f3ff":"call-me-hand","1f90c":"pinched-fingers","1f90c_1f3fb":"pinched-fingers","1f90c_1f3fc":"pinched-fingers","1f90c_1f3fd":"pinched-fingers","1f90c_1f3fe":"pinched-fingers","1f90c_1f3ff":"pinched-fingers","1f90f":"pinch","1f90f_1f3fb":"pinch","1f90f_1f3fc":"pinch","1f90f_1f3fd":"pinch","1f90f_1f3fe":"pinch","1f90f_1f3ff":"pinch","1f44c":"ok","1f44c_1f3fb":"ok","1f44c_1f3fc":"ok","1f44c_1f3fd":"ok","1f44c_1f3fe":"ok","1f44c_1f3ff":"ok","1faf5":"pointing","1faf5_1f3fb":"pointing","1faf5_1f3fc":"pointing","1faf5_1f3fd":"pointing","1faf5_1f3fe":"pointing","1faf5_1f3ff":"pointing","1f449":"point-right","1f449_1f3fb":"point-right","1f449_1f3fc":"point-right","1f449_1f3fd":"point-right","1f449_1f3fe":"point-right","1f449_1f3ff":"point-right","1f448":"point-left","1f448_1f3fb":"point-left","1f448_1f3fc":"point-left","1f448_1f3fd":"point-left","1f448_1f3fe":"point-left","1f448_1f3ff":"point-left","261d_fe0f":"index-finger","261d_1f3fb":"index-finger","261d_1f3fc":"index-finger","261d_1f3fd":"index-finger","261d_1f3fe":"index-finger","261d_1f3ff":"index-finger","1f446":"point-up","1f446_1f3fb":"point-up","1f446_1f3fc":"point-up","1f446_1f3fd":"point-up","1f446_1f3fe":"point-up","1f446_1f3ff":"point-up","1f447":"point-down","1f447_1f3fb":"point-down","1f447_1f3fc":"point-down","1f447_1f3fd":"point-down","1f447_1f3fe":"point-down","1f447_1f3ff":"point-down","1f595":"middle-finger","1f595_1f3fb":"middle-finger","1f595_1f3fc":"middle-finger","1f595_1f3fd":"middle-finger","1f595_1f3fe":"middle-finger","1f595_1f3ff":"middle-finger","270d_fe0f":"writing-hand","270d_1f3fb":"writing-hand","270d_1f3fc":"writing-hand","270d_1f3fd":"writing-hand","270d_1f3fe":"writing-hand","270d_1f3ff":"writing-hand","1f933":"selfie","1f933_1f3fb":"selfie","1f933_1f3fc":"selfie","1f933_1f3fd":"selfie","1f933_1f3fe":"selfie","1f933_1f3ff":"selfie","1f64f":"folded-hands please pray hope wish thank-you high-five","1f64f_1f3fb":"folded-hands please pray hope wish thank-you high-five","1f64f_1f3fc":"folded-hands please pray hope wish thank-you high-five","1f64f_1f3fd":"folded-hands please pray hope wish thank-you high-five","1f64f_1f3fe":"folded-hands please pray hope wish thank-you high-five","1f64f_1f3ff":"folded-hands please pray hope wish thank-you high-five","1f485":"nail-care","1f485_1f3fb":"nail-care","1f485_1f3fc":"nail-care","1f485_1f3fd":"nail-care","1f485_1f3fe":"nail-care","1f485_1f3ff":"nail-care","1f91d":"handshake","1f91d_1f3fb":"handshake","1faf1_1f3fb_200d_1faf2_1f3fc":"handshake","1faf1_1f3fb_200d_1faf2_1f3fd":"handshake","1faf1_1f3fb_200d_1faf2_1f3fe":"handshake","1faf1_1f3fb_200d_1faf2_1f3ff":"handshake","1faf1_1f3fc_200d_1faf2_1f3fb":"handshake","1f91d_1f3fc":"handshake","1faf1_1f3fc_200d_1faf2_1f3fd":"handshake","1faf1_1f3fc_200d_1faf2_1f3fe":"handshake","1faf1_1f3fc_200d_1faf2_1f3ff":"handshake","1faf1_1f3fd_200d_1faf2_1f3fb":"handshake","1faf1_1f3fd_200d_1faf2_1f3fc":"handshake","1f91d_1f3fd":"handshake","1faf1_1f3fd_200d_1faf2_1f3fe":"handshake","1faf1_1f3fd_200d_1faf2_1f3ff":"handshake","1faf1_1f3fe_200d_1faf2_1f3fb":"handshake","1faf1_1f3fe_200d_1faf2_1f3fc":"handshake","1faf1_1f3fe_200d_1faf2_1f3fd":"handshake","1f91d_1f3fe":"handshake","1faf1_1f3fe_200d_1faf2_1f3ff":"handshake","1faf1_1f3ff_200d_1faf2_1f3fb":"handshake","1faf1_1f3ff_200d_1faf2_1f3fc":"handshake","1faf1_1f3ff_200d_1faf2_1f3fd":"handshake","1faf1_1f3ff_200d_1faf2_1f3fe":"handshake","1f91d_1f3ff":"handshake","1f483":"dancer-woman","1f483_1f3fb":"dancer-woman","1f483_1f3fc":"dancer-woman","1f483_1f3fd":"dancer-woman","1f483_1f3fe":"dancer-woman","1f483_1f3ff":"dancer-woman","1f490":"bouquet flowers","1f339":"rose","1f940":"wilted-flower","1f342":"fallen-leaf","1f331":"plant seed","1f343":"leaves","1f340":"luck four-leaf-clover","1fabe":"leafless-tree","2744_fe0f":"snowflake winter cold","1f30b":"volcano","1f305":"sunrise","1f304":"sunrise-over-mountains","1f308":"rainbow","1fae7":"bubbles","1f30a":"ocean","1f32c_fe0f":"wind-face","1f32a_fe0f":"tornado","1f4a7":"droplet","1f327_fe0f":"rain-cloud","1f329_fe0f":"cloud-with-lightning","1f30d":"globe-showing-europe-africa","1f30e":"globe-showing-americas","1f30f":"globe-showing-asia-australia","2604_fe0f":"comet","1f42e":"cow-face","1f984":"unicorn","1f98e":"lizard","1f409":"dragon","1f996":"t-rex","1f995":"dinosaur","1f422":"turtle","1f40a":"crocodile","1f40d":"snake","1f438":"frog","1f407":"rabbit","1f400":"rat","1f429":"poodle","1f415":"dog","1f9ae":"guide-dog","1f415_200d_1f9ba":"service-dog","1f416":"pig","1f40e":"racehorse","1facf":"donkey","1f402":"ox","1f410":"goat","1f998":"kangaroo","1f405":"tiger","1f412":"monkey","1f98d":"gorilla","1f9a7":"orangutan","1f43f_fe0f":"chipmunk","1f9a6":"otter","1f987":"bat","1f426":"bird","1f426_200d_2b1b":"black-bird","1f413":"rooster","1f423":"hatching-chick","1f424":"baby-chick","1f425":"hatched-chick","1f985":"eagle","1f989":"owl","1f54a_fe0f":"peace dove","1fabf":"goose","1f99a":"peacock","1f426_200d_1f525":"phoenix","1f9ad":"seal","1f988":"shark","1f42c":"dolphin","1f433":"whale","1f41f":"fish","1f421":"blowfish","1f99e":"lobster","1f980":"crab","1f419":"octopus","1fabc":"jellyfish","1f982":"scorpion","1f577_fe0f":"spider","1f40c":"snail","1f41c":"ant","1f99f":"mosquito","1fab3":"cockroach","1fab0":"fly","1f41d":"bee","1f41e":"lady-bug","1f98b":"butterfly","1f41b":"bug","1fab1":"worm","1f43e":"paw prints","1f345":"tomato","1fadc":"root-vegetable beet turnip","1f373":"cooking","1f32f":"burrito","1f35d":"spaghetti","1f35c":"steaming-bowl","1f37f":"popcorn","1f37b":"clinking-beer-mugs","1f942":"clinking-glasses","1f37e":"bottle-with-popping-cork","1f377":"wine-glass","1fad7":"pour","1f379":"tropical-drink","1f6a7":"construction","1f6a8":"police-car-light","1f6b2":"bicycle","1f697":"automobile","1f3ce_fe0f":"racing-car","1f695":"taxi","1f68c":"bus","26f5":"sailboat","1f6f6":"canoe","1f6f8":"flying-saucer","1f680":"rocket","1f6eb":"airplane-departure","1f6ec":"airplane-arrival","1f3a2":"roller-coaster","1f3a1":"ferris-wheel","1f3d5_fe0f":"camping","1f388":"balloon","1f382":"birthday-cake","1f381":"wrapped-gift","1f386":"fireworks","1fa85":"piñata","1faa9":"mirror-ball disco-ball","1f947":"gold-medal 1st-place-medal","1f948":"silver-medal 2nd-place-medal","1f949":"bronze-medal 3rd-place-medal","1f3c6":"trophy","26bd":"soccer-ball","26be":"baseball","1f94e":"softball","1f3be":"tennis","1f3f8":"badminton","1f94d":"lacrosse","1f3cf":"cricket-game","1f3d1":"field-hockey","1f3d2":"ice-hockey","26f8_fe0f":"ice-skate","1f6fc":"roller-skates","1fa70":"ballet-shoes","1f6f9":"skateboard","26f3":"flag-in-hole","1f3af":"direct-hit target","1f94f":"flying-disc","1fa83":"boomerang","1fa81":"kite","1f3a3":"fishing-pole","1f94b":"martial-arts-uniform","1f3b1":"8-ball","1f3d3":"ping-pong","1f3b3":"bowling","1f3b2":"die","1f3b0":"slot-machine","1fa84":"wand","1f4f8":"camera-flash","1fadf":"splatter","1f3b7":"saxophone","1f3ba":"trumpet","1f3bb":"violin","1fa89":"harp","1f941":"drum","1fa87":"maracas","1f3ac":"clapper","1f50b":"battery-full","1faab":"battery-low","1fa99":"coin","1f4b8":"money-with-wings","1f48e":"gem-stone","2696_fe0f":"balance-scale","1f4a1":"light-bulb","1f393":"graduation-cap","1f48d":"ring","1faad":"fan","2602_fe0f":"umbrella","1fa8f":"shovel dig","2699_fe0f":"gear","26d3_fe0f_200d_1f4a5":"broken-chain","270f_fe0f":"pencil","23f0":"alarm-clock","1f6ce_fe0f":"bellhop-bell","1f514":"bell","1f52e":"crystal-ball","1f4a3":"bomb","1faa4":"mouse-trap","1f512":"locked","264a":"gemini","264b":"cancer","264c":"leo","264d":"virgo","264e":"libra","264f":"scorpio","26ce":"ophiuchus","2049_fe0f":"exclamation-question-mark !?","203c_fe0f":"exclamation-double !!","274c":"cross-mark x","1f198":"sos","1f4f4":"phone-off","2622_fe0f":"radioactive","2623_fe0f":"biohazard","26a0_fe0f":"warning","1f195":"new","1f193":"free","1f199":"up!","1f192":"cool","1f6ae":"litter","262e_fe0f":"peace-symbol","262f_fe0f":"yin-yang","267e_fe0f":"infinity","1f3b6":"musical-notes","1f3c1":"chequered-flag","1f6a9":"triangular-flag","1f3f4":"black-flag","1f3f3_fe0f":"white-flag"}};WS.EMOJI_RECS={"barber":["1f525","2728","1f4af","1f60e","1f4aa","1f919","1f64c","1f44c","1f31f","1f48e","1f3c6","23f0","1f6ce_fe0f","1f4f8","1f929","1f485"],"food":["2615","1f373","1f382","1f37f","1f37e","1f377","1f37b","1f60b","1f924","1f60d","2728","1f49d","1f35d","1f32f","1f331"],"outdoor":["1f331","1f343","1f340","1f342","1f308","1f4a7","1f31e","1f41d","1f98b","1f40c","1f305","1f6a7","1f44d","2705","2728"],"general":["2728","1f525","1f4af","1f389","1f929","1f44d","1f44f","1f64c","1f31f","2764_fe0f","2705","1f680","1f3c6","1f4a1","1f44b","1f91d"]};})(globalThis.WS=globalThis.WS||{});
// Animated emoji library: Noto Animated Emoji by Google (CC BY 4.0), served free from Google's CDN.
// WS.EMOJI (categories + keywords) and WS.EMOJI_RECS are injected by the build from emoji-data.json.
(function (WS) {
  WS.emojiUrl = (code) => `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`;
  WS.emojiChar = (code = '') =>
    String(code)
      .split('_')
      .map((x) => { const n = parseInt(x, 16); return (n >= 0 && n <= 0x10ffff) ? String.fromCodePoint(n) : ''; })
      .join('');
  WS.emojiName = (code) => ((WS.EMOJI && WS.EMOJI.kw[code]) || '').split(' ')[0].replace(/-/g, ' ');
  // Styles that blend emoji into the site's colors.
  WS.emojiStyles = [
    { id: 'color', name: 'Full color' },
    { id: 'soft', name: 'Soft' },
    { id: 'mono', name: 'Monochrome' },
    { id: 'badge', name: 'In a color badge' },
  ];
  WS.emoji = (code, cls = '') =>
    code
      ? `<span class="emo ${cls}" role="img" aria-label="${WS.esc(WS.emojiName(code))}"><img src="${WS.emojiUrl(code)}" alt="" loading="lazy" decoding="async" onerror="this.replaceWith(document.createTextNode('${WS.emojiChar(code)}'))"></span>`
      : '';
  WS.emojiRecsFor = (type = '') => {
    const t = String(type).toLowerCase();
    const R = WS.EMOJI_RECS || {};
    if (/barber|salon|tattoo|groom|nail|spa|beauty/.test(t)) return R.barber;
    if (/bak|cafe|café|coffee|food|restaurant|kitchen|donut|truck/.test(t)) return R.food;
    if (/lawn|landscap|garden|clean|pressure|pool|window|pest|gutter|handy/.test(t)) return R.outdoor;
    return R.general;
  };
  WS.emojiCss = `
.emo{display:inline-grid;place-items:center;width:1.15em;height:1.15em;vertical-align:-.2em;line-height:1}
.emo img{width:100%;height:100%;object-fit:contain}
.es-soft .emo img{filter:saturate(.55) sepia(.18)}
.es-mono .emo img{filter:grayscale(1) contrast(1.15) brightness(1.05)}
.es-badge .emo{width:1.6em;height:1.6em;border-radius:50%;background:var(--accent);padding:.24em;vertical-align:-.45em}
.emo-big{font-size:clamp(56px,7vw,96px)}
`;
})(globalThis.WS = globalThis.WS || {});

// Section library. Each section: label, blurb, variants, fields (drives the editor forms),
// create(site) -> default content written from the business's own details, render(sec, ctx) -> HTML.
(function (WS) {
  const e = WS.esc;
  const R = WS.register;
  const lines = (txt) => e(txt).replace(/\n/g, '<br>');
  const head = (sec, fallback) => `<h2 class="h2">${e(sec.title || fallback)}</h2>`;

  // ---------- Announcement bar ----------
  R('announce', {
    label: 'Announcement bar',
    blurb: 'A thin banner for news, a special or holiday hours.',
    variants: { bar: 'Bar' },
    fields: [{ key: 'text', label: 'Message', type: 'text' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: () => ({ variant: 'bar', text: 'Now booking Saturdays two weeks out.', emoji: '1f389' }),
    render: (s) => `<div class="announce on-pop">${WS.emoji(s.emoji)}<span>${e(s.text)}</span></div>`,
  });

  // ---------- Hero ----------
  R('hero', {
    label: 'Opening',
    blurb: 'The first thing visitors see.',
    variants: { photo: 'Full-screen photo', split: 'Text and photo side by side', type: 'Big type with emoji' },
    fields: [
      { key: 'title', label: 'Big title', type: 'text', hint: 'Leave empty to use your business name' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'emoji', label: 'Emoji', type: 'emoji', only: ['type'] },
      { key: 'status', label: 'Show "Open now" status', type: 'toggle' },
    ],
    create: (site) => ({ variant: 'photo', title: '', tagline: site.biz.tagline || '', emoji: WS.emojiRecsFor(site.biz.type)[0], status: true }),
    render: (s, c) => {
      const name = s.title || c.biz.name;
      const l = WS.twoLines(name);
      const title = `<h1 class="name">${l.map((x, i) => `<span class="ln"><span style="--d:${i}">${e(x)}</span></span>`).join('')}</h1>`;
      const status = s.status ? `<p class="status"><span class="pole" aria-hidden="true"></span><span data-status>${c.biz.walkIns ? 'Walk-ins welcome' : ''}</span></p>` : '';
      const actions = `<div class="actions"><a class="btn" href="${c.book}">${e(c.biz.bookLabel || 'Book now')}</a>${c.biz.phone ? `<a class="btn ghost" href="${WS.tel(c.biz.phone)}">${e(c.biz.phone)}</a>` : ''}</div>`;
      if (s.variant === 'split')
        return `<section class="hero hero-split on-base"><div class="wrap hs-grid"><div class="hs-copy">${status}${title}<p class="tag">${e(s.tagline)}</p>${actions}</div>${c.slot('photo', { hint: 'Your best photo, tall works best', cls: 'hs-img reveal' })}</div></section>`;
      if (s.variant === 'type')
        return `<section class="hero hero-type on-base"><div class="wrap">${status}<div class="ht-row">${title}${s.emoji ? `<div class="ht-emo">${WS.emoji(s.emoji)}</div>` : ''}</div><div class="hero-foot"><p class="tag">${e(s.tagline)}</p>${actions}</div></div></section>`;
      return `<section class="hero hero-photo on-base${c.photo('photo') ? '' : ' hero-noimg'}">${c.bg('photo', { hint: 'a cover photo', cls: 'hero-media' })}<div class="hero-in">${status}${title}<div class="hero-foot"><p class="tag">${e(s.tagline)}</p>${actions}</div></div></section>`;
    },
  });

  // ---------- Intro statement ----------
  R('intro', {
    label: 'About statement',
    blurb: 'One bold paragraph about who you are.',
    variants: { offset: 'Statement with photo', center: 'Centered statement' },
    fields: [{ key: 'text', label: 'Statement', type: 'textarea' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'offset', text: site.biz.about || 'Tell people what makes you different, in one or two sentences.', emoji: WS.emojiRecsFor(site.biz.type)[1] }),
    render: (s, c) =>
      s.variant === 'center'
        ? `<section class="intro intro-center on-base"><div class="wrap">${s.emoji ? `<div class="emo-big">${WS.emoji(s.emoji)}</div>` : ''}<p class="statement">${lines(s.text)}</p></div></section>`
        : `<section class="intro on-base"><div class="wrap intro-grid"><p class="statement">${s.emoji ? WS.emoji(s.emoji) + ' ' : ''}${lines(s.text)}</p>${c.slot('photo', { hint: 'A close-up of your work', cls: 'intro-img reveal' })}</div></section>`,
  });

  // ---------- Page header (top band of a sub-page) ----------
  R('pagehead', {
    label: 'Page header',
    blurb: 'A titled band at the top of a page.',
    variants: { band: 'Centered band' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Subtitle', type: 'textarea' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'band', title: '', text: '', emoji: '' }),
    render: (s, c) =>
      `<section class="pagehead on-base"><div class="wrap">${s.emoji ? `<div class="emo-big">${WS.emoji(s.emoji)}</div>` : ''}<h1 class="pagehead-t">${e(s.title || '')}</h1>${s.text ? `<p class="pagehead-s">${lines(s.text)}</p>` : ''}</div></section>`,
  });

  // ---------- Contact form (messages go to the owner's inbox via /api/form/<siteId>) ----------
  R('contact', {
    label: 'Contact form',
    blurb: 'A simple form so people can message you — goes straight to your inbox.',
    variants: { simple: 'Name, email, message' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Intro text', type: 'textarea' },
      { key: 'button', label: 'Button text', type: 'text' },
      { key: 'success', label: 'Success message', type: 'text' },
      { key: 'showPhone', label: 'Ask for a phone number', type: 'toggle' },
    ],
    create: (site) => ({ variant: 'simple', title: 'Get in touch', text: 'Send us a message and we will get right back to you.', button: 'Send message', success: 'Thanks! Your message is on its way — we will be in touch soon.', showPhone: true }),
    render: (s, c) => {
      const action = (c.site && c.site.siteId) ? ('https://websprout.app/api/form/' + e(c.site.siteId)) : '';
      const phone = s.showPhone ? `<label class="wf-l">Phone<input class="wf-i" type="tel" name="phone" autocomplete="tel"></label>` : '';
      return `<section class="contactf on-base" id="contact-form"><div class="wrap wf-wrap"><div class="wf-head">${head(s, 'Get in touch')}${s.text ? `<p class="wf-sub">${lines(s.text)}</p>` : ''}</div><form class="wf-form" data-wsform${action ? ` action="${action}"` : ''} method="post" novalidate><div class="wf-row"><label class="wf-l">Name<input class="wf-i" type="text" name="name" required autocomplete="name"></label><label class="wf-l">Email<input class="wf-i" type="email" name="email" required autocomplete="email"></label></div>${phone}<label class="wf-l">Message<textarea class="wf-i wf-t" name="message" rows="4" required></textarea></label><input type="text" name="_ws_hp" tabindex="-1" autocomplete="off" aria-hidden="true" class="wf-hp"><button class="btn btn-ink wf-btn" type="submit">${e(s.button || 'Send message')}</button><p class="wf-ok" data-wfok hidden>${e(s.success || 'Thanks! We will be in touch soon.')}</p></form></div></section>`;
    },
  });

  // ---------- Booking / request (appointment, reservation, or quote → owner's inbox) ----------
  R('booking', {
    label: 'Booking request',
    blurb: 'Let people request an appointment, table, or quote — straight to your inbox.',
    variants: { appointment: 'Appointment request', reservation: 'Table reservation', quote: 'Quote request', application: 'Job application' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Intro text', type: 'textarea' },
      { key: 'services', label: 'Options people can pick', type: 'list', add: 'Add an option', item: [{ key: 'name', label: 'Option', type: 'text' }] },
      { key: 'button', label: 'Button text', type: 'text' },
      { key: 'success', label: 'Success message', type: 'text' },
    ],
    create: (site) => ({ variant: 'appointment', title: 'Book an appointment', text: 'Pick a time that works and we will confirm by text or email.', services: (site.biz.services || []).map((x) => ({ name: x.name })).filter((x) => x.name), button: 'Request appointment', success: 'Request received! We will confirm your appointment shortly.' }),
    render: (s, c) => {
      const action = (c.site && c.site.siteId) ? ('https://websprout.app/api/form/' + e(c.site.siteId)) : '';
      const mode = s.variant || 'appointment';
      const names = (s.services || []).map((x) => (typeof x === 'string' ? x : (x && x.name) || '')).filter(Boolean);
      const svcLabel = mode === 'application' ? 'Position' : (mode === 'quote' ? 'What do you need?' : 'Service');
      const svc = names.length ? `<label class="wf-l">${svcLabel}<select class="wf-i" name="service">${names.map((x) => `<option>${e(x)}</option>`).join('')}</select></label>` : '';
      let fields = '';
      if (mode === 'reservation') {
        const parties = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12+'];
        fields = `<div class="wf-row"><label class="wf-l">Date<input class="wf-i" type="date" name="date" required></label><label class="wf-l">Time<input class="wf-i" type="time" name="time" required></label></div><label class="wf-l">Party size<select class="wf-i" name="party">${parties.map((p) => `<option>${p}</option>`).join('')}</select></label>`;
      } else if (mode === 'quote') {
        fields = `${svc}<label class="wf-l">Tell us about the job<textarea class="wf-i wf-t" name="details" rows="4" required></textarea></label>`;
      } else if (mode === 'application') {
        fields = `${svc}<label class="wf-l">Relevant experience<textarea class="wf-i wf-t" name="experience" rows="4" required></textarea></label>`;
      } else {
        fields = `${svc}<div class="wf-row"><label class="wf-l">Preferred date<input class="wf-i" type="date" name="date"></label><label class="wf-l">Preferred time<input class="wf-i" type="time" name="time"></label></div>`;
      }
      const notes = (mode === 'quote') ? '' : `<label class="wf-l">${mode === 'application' ? 'Links or anything else (optional)' : 'Anything we should know?'}<textarea class="wf-i wf-t" name="notes" rows="3"></textarea></label>`;
      const reqLabel = mode === 'reservation' ? 'Reservation' : (mode === 'quote' ? 'Quote request' : (mode === 'application' ? 'Application' : 'Appointment'));
      const fallback = mode === 'reservation' ? 'Reserve a table' : (mode === 'quote' ? 'Request a quote' : (mode === 'application' ? 'Apply now' : 'Book an appointment'));
      const header = s.title === '' ? '' : `<div class="wf-head">${head(s, fallback)}${s.text ? `<p class="wf-sub">${lines(s.text)}</p>` : ''}</div>`;
      return `<section class="booking contactf on-base" id="book"><div class="wrap wf-wrap">${header}<form class="wf-form" data-wsform${action ? ` action="${action}"` : ''} method="post" novalidate><input type="hidden" name="request" value="${reqLabel}">${fields}<div class="wf-row"><label class="wf-l">Name<input class="wf-i" type="text" name="name" required autocomplete="name"></label><label class="wf-l">Email<input class="wf-i" type="email" name="email" required autocomplete="email"></label></div><label class="wf-l">Phone<input class="wf-i" type="tel" name="phone" autocomplete="tel"></label>${notes}<input type="text" name="_ws_hp" tabindex="-1" autocomplete="off" aria-hidden="true" class="wf-hp"><button class="btn btn-ink wf-btn" type="submit">${e(s.button || fallback)}</button><p class="wf-ok" data-wfok hidden>${e(s.success || 'Request received! We will confirm shortly.')}</p></form></div></section>`;
    },
  });

  // ---------- Service area checker (visitor enters a ZIP → do you cover them?) ----------
  R('servicearea', {
    label: 'Service area check',
    blurb: 'Let visitors type their ZIP code to see instantly if you cover their area.',
    variants: { check: 'ZIP checker' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Intro text', type: 'textarea' },
      { key: 'zips', label: 'ZIP codes you serve (any separator)', type: 'textarea' },
      { key: 'yes', label: 'In-area message', type: 'text' },
      { key: 'no', label: 'Out-of-area message', type: 'text' },
    ],
    create: (site) => ({ variant: 'check', title: 'Do we serve your area?', note: 'Enter your ZIP code to find out.', zips: '', yes: 'Good news — we cover your area! Reach out and we will get you scheduled.', no: 'We are not in your area just yet — send us a message and we will see what we can do.' }),
    render: (s, c) => {
      const zips = String(s.zips || '').match(/\d{5}/g) || [];
      const hd = s.title === '' ? '' : head(s, 'Do we serve your area?');
      return `<section class="servicearea on-base" id="service-area"><div class="wrap sa-wrap">${hd}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}<form class="sa-form" data-sa-check data-sa-zips="${e(JSON.stringify(zips))}" data-sa-yes="${e(s.yes || '')}" data-sa-no="${e(s.no || '')}" novalidate><input class="wf-i sa-input" type="text" inputmode="numeric" name="zip" placeholder="Enter your ZIP" maxlength="5" aria-label="ZIP code"><button class="btn btn-ink sa-btn" type="submit">Check</button></form><p class="sa-result" data-sa-result hidden></p></div></section>`;
    },
  });

  // ---------- Events (upcoming events, classes, specials, live music) ----------
  R('events', {
    label: 'Events',
    blurb: 'Upcoming events, classes or specials with dates — and an optional tickets/RSVP link.',
    variants: { list: 'List with dates' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Intro text', type: 'textarea' },
      { key: 'items', label: 'Events', type: 'list', add: 'Add an event', item: [
        { key: 'date', label: 'Date (e.g. Fri, Jun 14 — or "Every Friday")', type: 'text' },
        { key: 'time', label: 'Time', type: 'text' },
        { key: 'name', label: 'Event', type: 'text' },
        { key: 'desc', label: 'Details', type: 'text' },
        { key: 'url', label: 'Tickets / RSVP link (optional)', type: 'text' },
      ] },
    ],
    create: (site) => ({ variant: 'list', title: 'Upcoming events', note: '', items: [{ date: '', time: '', name: '', desc: '', url: '' }] }),
    render: (s, c) => {
      const items = (s.items || []).filter((it) => it && (it.name || it.date));
      const hd = s.title === '' ? '' : head(s, 'Upcoming events');
      let body;
      if (!items.length) {
        body = `<p class="ev-empty">More events coming soon — check back shortly.</p>`;
      } else {
        body = `<ul class="ev-list">${items.map((it) => {
          const url = String(it.url || '');
          const live = url.indexOf('https://') === 0 || url.indexOf('http://') === 0;
          const btn = live ? `<a class="btn btn-ink ev-btn" href="${e(url)}" target="_blank" rel="noopener">Details</a>` : '';
          return `<li class="ev-row"><div class="ev-date"><span class="ev-d">${e(it.date || 'TBA')}</span>${it.time ? `<span class="ev-t">${e(it.time)}</span>` : ''}</div><div class="ev-body"><h3 class="ev-name">${e(it.name || '')}</h3>${it.desc ? `<p class="ev-desc">${e(it.desc)}</p>` : ''}</div>${btn}</li>`;
        }).join('')}</ul>`;
      }
      return `<section class="events on-base" id="events"><div class="wrap">${hd}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}${body}</div></section>`;
    },
  });

  // ---------- Payments (deposits, invoices, gift cards, tips via the owner's own payment links) ----------
  R('payments', {
    label: 'Payments',
    blurb: 'Let people pay deposits, invoices or tips and buy gift cards with your Stripe, PayPal, Venmo or Square links.',
    variants: { cards: 'Payment cards' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Intro text', type: 'textarea' },
      { key: 'items', label: 'Payment options', type: 'list', add: 'Add a payment option', item: [
        { key: 'name', label: 'Label', type: 'text' },
        { key: 'desc', label: 'Description', type: 'text' },
        { key: 'amount', label: 'Amount (optional)', type: 'text' },
        { key: 'url', label: 'Payment link (Stripe, PayPal, Venmo…)', type: 'text' },
      ] },
    ],
    create: (site) => ({ variant: 'cards', title: 'Pay online', note: 'Quick and secure — choose an option below.', items: [
      { name: 'Leave a deposit', desc: 'Reserve your spot with a deposit.', amount: '', url: '' },
      { name: 'Pay an invoice', desc: 'Already have a quote? Settle up here.', amount: '', url: '' },
      { name: 'Buy a gift card', desc: 'The gift that always fits.', amount: '', url: '' },
    ] }),
    render: (s, c) => {
      const items = (s.items || []).filter((it) => it && (it.name || it.url));
      const cards = items.map((it) => {
        const url = String(it.url || '');
        const live = url.indexOf('https://') === 0 || url.indexOf('http://') === 0;
        const amt = it.amount ? `<div class="pay-amt">${e(it.amount)}</div>` : '';
        const btn = live
          ? `<a class="btn btn-ink pay-btn" href="${e(url)}" target="_blank" rel="noopener">Pay now</a>`
          : `<span class="pay-soon">Add your link</span>`;
        return `<div class="pay-card"><div class="pay-body"><h3 class="pay-name">${e(it.name || 'Payment')}</h3>${it.desc ? `<p class="pay-desc">${e(it.desc)}</p>` : ''}${amt}</div>${btn}</div>`;
      }).join('');
      const hd = s.title === '' ? '' : head(s, 'Pay online');
      return `<section class="payments on-base" id="pay"><div class="wrap">${hd}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}<div class="pay-grid">${cards}</div><p class="pay-trust">Payments are handled securely by your payment provider.</p></div></section>`;
    },
  });

  // ---------- How it works (process steps) ----------
  R('steps', {
    label: 'How it works',
    blurb: 'A simple numbered walkthrough of your process.',
    variants: { grid: 'Numbered steps' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'items', label: 'Steps', type: 'list', add: 'Add step', item: [{ key: 'name', label: 'Step title', type: 'text' }, { key: 'text', label: 'Detail', type: 'textarea' }] }],
    create: (site) => ({ variant: 'grid', title: 'How it works', items: [{ name: 'Reach out', text: 'Tell us what you need and when works for you.' }, { name: 'We plan it', text: 'We confirm the details and give you a clear, honest price.' }, { name: 'We deliver', text: 'We do the work and make sure you are happy with it.' }] }),
    render: (s, c) => {
      const items = (s.items || []).map((it, i) => `<li class="step reveal"><span class="step-n">${i + 1}</span><div><h3 class="step-t">${e(it.name || '')}</h3><p class="step-d">${lines(it.text || '')}</p></div></li>`).join('');
      return `<section class="steps on-base" id="steps"><div class="wrap">${head(s, 'How it works')}<ol class="steps-grid">${items}</ol></div></section>`;
    },
  });

  // ---------- Stats ----------
  WS.statSources = [
    { id: 'manual', name: 'I’ll type the number' },
    { id: 'years', name: 'Years in business (updates itself)' },
    { id: 'google_rating', name: 'Google rating (live)' },
    { id: 'google_reviews', name: 'Google review count (live)' },
  ];
  R('stats', {
    label: 'Numbers',
    blurb: 'Big numbers that count up: reviews, years, customers served.',
    variants: { row: 'Row on your main color', band: 'Bold color band' },
    fields: [
      { key: 'title', label: 'Title (optional)', type: 'text' },
      {
        key: 'items', label: 'Numbers', type: 'list', add: 'Add a number',
        item: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'source', label: 'Where the number comes from', type: 'select', options: () => WS.statSources.map((x) => [x.id, x.name]) },
          { key: 'value', label: 'Number', type: 'text', hint: 'Used when typed, and as the backup for live numbers' },
          { key: 'suffix', label: 'After the number', type: 'text', hint: 'e.g. + or ★ or k' },
          { key: 'emoji', label: 'Emoji', type: 'emoji' },
        ],
      },
    ],
    create: (site) => ({
      variant: 'row', title: '',
      items: [
        { label: 'Years on the block', source: 'years', value: site.biz.founded ? String(new Date().getFullYear() - +site.biz.founded) : '10', suffix: '', emoji: '' },
        { label: 'Google rating', source: 'google_rating', value: '4.9', suffix: '★', emoji: '' },
        { label: 'Five-star reviews', source: 'google_reviews', value: '312', suffix: '', emoji: '' },
        { label: 'Cuts this year', source: 'manual', value: '4,800', suffix: '+', emoji: '' },
      ],
    }),
    render: (s, c) => {
      const items = (s.items || []).map((it) => {
        const val = it.source === 'years' && c.biz.founded ? String(new Date().getFullYear() - +c.biz.founded) : it.value;
        return `<div class="stat">${it.emoji ? WS.emoji(it.emoji, 'stat-emo') : ''}<p class="num"><span data-count="${e(String(val).replace(/,/g, ''))}" data-src="${e(it.source || 'manual')}" ${it.source === 'years' ? `data-founded="${e(c.biz.founded || '')}"` : ''}>${e(val)}</span>${it.suffix ? `<small>${e(it.suffix)}</small>` : ''}</p><p class="lbl">${e(it.label)}</p></div>`;
      });
      return `<section class="stats stats-${s.variant} ${s.variant === 'band' ? 'on-pop' : 'on-base'}"><div class="wrap">${s.title ? head(s) : ''}<div class="stat-row">${items.join('')}</div></div></section>`;
    },
  });

  // ---------- Prices ----------
  R('prices', {
    label: 'Price list',
    blurb: 'Your services and prices, menu style.',
    variants: { menu: 'List next to a photo', board: 'Two-column price board' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Note under the title', type: 'textarea' },
      { key: 'items', label: 'Services', type: 'list', add: 'Add a service', item: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'price', label: 'Price', type: 'text' }, { key: 'meta', label: 'Details', type: 'text' }] },
    ],
    create: (site) => ({ variant: 'menu', title: 'No surprises at the register.', note: '', items: (site.biz.services || []).map((x) => ({ name: x.name, price: x.price, meta: [x.time, x.note].filter(Boolean).join(', ') })) }),
    render: (s, c) => {
      const list = `<ul class="plist">${(s.items || []).map((it) => `<li><span class="svc">${e(it.name)}</span><span class="lead" aria-hidden="true"></span><span class="price">${WS.money(isNaN(+it.price) || it.price === '' ? it.price : +it.price)}</span><a class="pl-book" href="${c.book}">${e(c.biz.bookLabel || 'Book')}</a>${it.meta ? `<span class="meta">${e(it.meta)}</span>` : ''}</li>`).join('')}</ul>`;
      const top = `${head(s, 'Prices')}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}`;
      if (s.variant === 'board') return `<section class="prices prices-board on-alt" id="prices"><div class="wrap">${top}<div class="board">${list}</div><a class="btn btn-ink" href="${c.book}">${e(c.biz.bookLabel || 'Book now')}</a></div></section>`;
      return `<section class="prices prices-menu on-alt" id="prices">${c.slot('photo', { hint: 'A shave, a cut, or your tools', cls: 'pm-img reveal' })}<div class="pm-body">${top}${list}<a class="btn btn-ink" href="${c.book}">${e(c.biz.bookLabel || 'Book now')}</a></div></section>`;
    },
  });

  // ---------- Services ----------
  R('services', {
    label: 'Services',
    blurb: 'What you offer, each with an animated emoji.',
    variants: { grid: 'Grid', list: 'Big list' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'Services', type: 'list', add: 'Add a service', item: [{ key: 'emoji', label: 'Emoji', type: 'emoji' }, { key: 'name', label: 'Name', type: 'text' }, { key: 'text', label: 'Description', type: 'textarea' }, { key: 'from', label: 'Starting price', type: 'text' }] },
    ],
    create: (site) => {
      const recs = WS.emojiRecsFor(site.biz.type);
      return { variant: 'grid', title: 'What we do best', items: (site.biz.services || []).slice(0, 4).map((x, i) => ({ emoji: recs[(i + 2) % recs.length], name: x.name, text: x.desc || x.note || '', from: x.price ? String(x.price) : '' })) };
    },
    render: (s) => `<section class="services services-${s.variant} ${s.tone || 'on-alt'}" id="services"><div class="wrap">${head(s, 'Services')}<ul class="sv">${(s.items || []).map((it) => `<li>${it.emoji ? `<div class="sv-emo">${WS.emoji(it.emoji)}</div>` : ''}<h3>${e(it.name)}</h3>${it.text ? `<p>${lines(it.text)}</p>` : ''}${it.from ? `<span class="from">from ${WS.money(isNaN(+it.from) ? it.from : +it.from)}</span>` : ''}</li>`).join('')}</ul></div></section>`,
  });

  // ---------- Gallery ----------
  R('gallery', {
    label: 'Photo gallery',
    blurb: 'Show off your work. Every spot is an upload box.',
    variants: { strip: 'Three-photo strip', grid: 'Six-photo mosaic' },
    fields: [{ key: 'title', label: 'Title (optional)', type: 'text' }],
    create: () => ({ variant: 'strip', title: '' }),
    render: (s, c) => {
      const hints = ['A client in the chair', 'Your best work', 'The shop itself', 'A detail shot', 'Your team', 'A happy customer'];
      const n = s.variant === 'grid' ? 6 : 3;
      const figs = Array.from({ length: n }, (_, i) => c.slot('p' + i, { hint: hints[i], cls: `g${i} reveal` })).join('');
      if (c.mode === 'live' && !Array.from({ length: n }).some((_, i) => c.photo('p' + i))) return '';
      return `<section class="gallery gallery-${s.variant} on-base" aria-label="Photos">${s.title ? `<div class="wrap">${head(s)}</div>` : ''}<div class="g-wrap">${figs}</div></section>`;
    },
  });

  // ---------- Team ----------
  R('team', {
    label: 'Team',
    blurb: 'The people behind the business.',
    variants: { rows: 'Name rows', portraits: 'Portrait photos' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'People', type: 'list', add: 'Add a person', item: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'text', label: 'About them', type: 'textarea' }] },
    ],
    create: (site) => {
      const t = site.biz.team || [];
      return { variant: 'rows', title: t.length > 1 && t.length < 11 ? `${WS.words[t.length]} chairs. Pick yours.` : 'Meet the team', items: t.map((x) => ({ name: x.name, text: x.specialty })) };
    },
    render: (s, c) => {
      const items = s.items || [];
      if (s.variant === 'portraits')
        return `<section class="team team-portraits on-base" id="team"><div class="wrap">${head(s, 'Team')}<ul class="tp">${items.map((it, i) => `<li>${c.slot('m' + i, { hint: `A photo of ${it.name || 'them'}`, cls: 'tp-img reveal' })}<h3>${e(it.name)}</h3><p>${lines(it.text)}</p></li>`).join('')}</ul></div></section>`;
      return `<section class="team team-rows on-base" id="team"><div class="wrap">${head(s, 'Team')}<ul class="tr">${items.map((it) => `<li><h3>${e(it.name)}</h3><p>${lines(it.text)}</p><a href="${c.book}">Book with ${e(it.name)}</a></li>`).join('')}</ul></div></section>`;
    },
  });

  // ---------- Reviews ----------
  R('reviews', {
    label: 'Reviews',
    blurb: 'What customers say.',
    variants: { feature: 'One big quote', wall: 'Wall of quotes', google: 'Live Google reviews' },
    fields: [{ key: 'title', label: 'Title (Google layout)', type: 'text', only: ['google'] }, { key: 'items', label: 'Reviews (shown if Google is unavailable)', type: 'list', add: 'Add a review', item: [{ key: 'quote', label: 'Quote', type: 'textarea' }, { key: 'name', label: 'Name', type: 'text' }] }],
    create: (site) => ({ variant: 'feature', items: (site.biz.reviews || []).map((r) => ({ quote: r.quote, name: r.name })) }),
    render: (s, c) => {
      const it = s.items || [];
      if (s.variant === 'google') {
        // Typed reviews are the fallback; the runtime swaps in live Google reviews when a place is linked.
        const fb = it.map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('');
        if (!c.biz.googlePlaceId && !fb && c.mode !== 'edit') return '';
        return `<section class="reviews reviews-wall reviews-google on-base" data-greviews><div class="wrap">${head(s, 'What people say')}<div class="gr-sum" hidden></div><div class="rw">${fb || (c.mode === 'edit' ? '<blockquote><p>Your latest Google reviews will appear here once your Google Business Profile is linked.</p></blockquote>' : '')}</div><p class="gr-attr" hidden></p></div></section>`;
      }
      if (!it.length) return '';
      if (s.variant === 'wall')
        return `<section class="reviews reviews-wall on-base"><div class="wrap"><div class="rw">${it.map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('')}</div></div></section>`;
      return `<section class="reviews reviews-feature on-pop">${c.bg('bg', { hint: 'a background photo', cls: 'rv-media' })}<div class="wrap"><blockquote class="big-q"><p>${lines(it[0].quote)}</p><footer>${e(it[0].name)}</footer></blockquote>${it.length > 1 ? `<div class="more">${it.slice(1, 4).map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('')}</div>` : ''}</div></section>`;
    },
  });

  // ---------- Before / after ----------
  R('beforeafter', {
    label: 'Before & after',
    blurb: 'Drag a slider between two photos. Great for transformations.',
    variants: { slider: 'Slider' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Caption', type: 'textarea' }],
    create: () => ({ variant: 'slider', title: 'Same chair, 40 minutes later.', text: 'Drag to see the difference.' }),
    render: (s, c) => {
      if (c.mode === 'live' && !(c.photo('before') && c.photo('after'))) return '';
      return `<section class="ba on-base"><div class="wrap ba-grid"><div>${head(s, 'Before and after')}<p class="lede">${lines(s.text)}</p></div><div class="ba-frame" data-ba style="--x:50%">${c.slot('after', { hint: 'The after photo', cls: 'ba-after' })}${c.slot('before', { hint: 'The before photo', cls: 'ba-before' })}<span class="ba-tag ba-tag-l">Before</span><span class="ba-tag ba-tag-r">After</span><input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Compare before and after"></div></div></section>`;
    },
  });

  // ---------- FAQ ----------
  // ---------- Pricing plans ----------
  R('plans', {
    label: 'Pricing plans',
    blurb: 'Packages side by side, with what each includes.',
    variants: { cards: 'Cards' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Intro (optional)', type: 'textarea' },
      { key: 'items', label: 'Plans', type: 'list', add: 'Add a plan', item: [
        { key: 'name', label: 'Plan name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'per', label: 'Per (e.g. /month, per visit)', type: 'text' },
        { key: 'features', label: 'What is included (one per line)', type: 'textarea' },
        { key: 'button', label: 'Button text', type: 'text' },
        { key: 'featured', label: 'Highlight as most popular', type: 'select', options: [['', 'No'], ['yes', 'Yes']] },
      ] },
    ],
    create: () => ({ variant: 'cards', title: 'Packages', text: '', items: [
      { name: 'Essential', price: '$49', per: 'per visit', features: 'The core service\nFriendly, on-time pros\nSatisfaction guaranteed', button: '' },
      { name: 'Plus', price: '$89', per: 'per visit', features: 'Everything in Essential\nExtra time and attention\nPriority booking', button: '', featured: 'yes' },
      { name: 'Premium', price: '$149', per: 'per visit', features: 'Everything in Plus\nOur most complete service\nFollow-up check-in', button: '' },
    ] }),
    render: (s, c) => {
      const items = (s.items || []).filter((it) => it && (it.name || it.price));
      if (!items.length) return '';
      const cards = items.map((it) => {
        const feats = String(it.features || '').split('\n').map((x) => x.trim()).filter(Boolean);
        return `<article class="plan reveal${it.featured === 'yes' ? ' plan-hot' : ''}">${it.featured === 'yes' ? '<span class="plan-tag">Most popular</span>' : ''}<h3 class="plan-n">${e(it.name || '')}</h3><div class="plan-p"><b>${e(it.price || '')}</b>${it.per ? `<span>${e(it.per)}</span>` : ''}</div>${feats.length ? `<ul class="plan-f">${feats.map((f) => `<li>${e(f)}</li>`).join('')}</ul>` : ''}<a class="btn${it.featured === 'yes' ? '' : ' ghost'}" href="${c.book}">${e(it.button || c.biz.bookLabel || 'Get started')}</a></article>`;
      }).join('');
      return `<section class="plans on-base" id="plans"><div class="wrap">${head(s, 'Packages')}${s.text ? `<p class="lede">${lines(s.text)}</p>` : ''}<div class="plans-grid">${cards}</div></div></section>`;
    },
  });

  // ---------- Booking calendar embed ----------
  // Only well-known booking providers can be embedded (no arbitrary iframes on customer sites).
  WS.bookingEmbedOk = (u) => {
    let h = '';
    try { const x = new URL(String(u || '')); if (x.protocol !== 'https:') return false; h = x.hostname.toLowerCase(); } catch (_e) { return false; }
    return /(^|\.)(calendly\.com|squareup\.com|square\.site|acuityscheduling\.com|as\.me|setmore\.com|booksy\.com|vagaro\.com|fresha\.com|youcanbook\.me|tidycal\.com|cal\.com|zcal\.co|opentable\.com|resy\.com|simplybook\.me|schedulicity\.com|mindbodyonline\.com|calendar\.google\.com|outlook\.office365\.com)$/.test(h);
  };
  R('embed', {
    label: 'Booking calendar',
    blurb: 'Your Calendly, Square, Acuity, Vagaro or similar booking page, right on your site.',
    variants: { framed: 'Framed' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Short note (optional)', type: 'textarea' },
      { key: 'url', label: 'Booking page link', type: 'text', hint: 'Paste the link from Calendly, Square, Acuity, Vagaro, Fresha, OpenTable...' },
      { key: 'height', label: 'Height', type: 'select', options: [['720', 'Standard'], ['560', 'Short'], ['900', 'Tall']] },
    ],
    create: () => ({ variant: 'framed', title: 'Book a time', text: '', url: '', height: '720' }),
    render: (s, c) => {
      const ok = WS.bookingEmbedOk(s.url);
      if (!ok) return c.mode === 'edit' ? `<section class="embed on-base" id="calendar"><div class="wrap">${head(s, 'Book a time')}<div class="embed-ph">Paste your booking page link in the editor to show your calendar here.</div></div></section>` : '';
      const hgt = ['560', '720', '900'].indexOf(String(s.height)) > -1 ? s.height : '720';
      return `<section class="embed on-base" id="calendar"><div class="wrap">${head(s, 'Book a time')}${s.text ? `<p class="lede">${lines(s.text)}</p>` : ''}<div class="embed-box"><iframe src="${e(s.url)}" title="${e(s.title || 'Booking calendar')}" loading="lazy" style="height:${hgt}px" allow="payment" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p class="embed-alt"><a href="${e(s.url)}" target="_blank" rel="noopener">Open the booking page in a new tab</a></p></div></section>`;
    },
  });

  R('faq', {
    label: 'Questions',
    blurb: 'Answer what people always ask.',
    variants: { accordion: 'Expandable list' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'Questions', type: 'list', add: 'Add a question', item: [{ key: 'q', label: 'Question', type: 'text' }, { key: 'a', label: 'Answer', type: 'textarea' }] },
    ],
    create: (site) => ({
      variant: 'accordion', title: 'Good questions',
      items: [
        { q: 'Do I need an appointment?', a: site.biz.walkIns ? 'No. Walk-ins are welcome, but booking ahead guarantees your time.' : 'Yes, please book ahead so we can give you our full attention.' },
        { q: 'How do I pay?', a: 'Cards, Apple Pay, Google Pay and cash.' },
        { q: 'Is there parking?', a: 'Street parking out front, free after 6 pm.' },
      ],
    }),
    render: (s) => `<section class="faq ${s.tone || 'on-base'}" id="faq"><div class="wrap faq-grid">${head(s, 'Questions')}<div class="qa">${(s.items || []).map((it) => `<details><summary>${e(it.q)}</summary><p>${lines(it.a)}</p></details>`).join('')}</div></div></section>`,
  });

  // ---------- Call to action ----------
  R('cta', {
    label: 'Call to action',
    blurb: 'A loud band that asks people to book or call.',
    variants: { band: 'Color band', split: 'With a photo' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Text', type: 'textarea' }, { key: 'button', label: 'Button text', type: 'text' }, { key: 'link', label: 'Button link (optional)', type: 'text' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'band', title: 'Your chair is waiting.', text: 'Book online in under a minute.', button: site.biz.bookLabel || 'Book now', link: '', emoji: WS.emojiRecsFor(site.biz.type)[0] }),
    render: (s, c) =>
      s.variant === 'split'
        ? `<section class="cta cta-split on-alt">${c.slot('photo', { hint: 'A welcoming photo', cls: 'cta-img reveal' })}<div class="cta-body"><h2 class="h2">${s.emoji ? WS.emoji(s.emoji) + ' ' : ''}${e(s.title)}</h2><p>${lines(s.text)}</p><a class="btn btn-ink" href="${s.link ? e(s.link) : c.book}">${e(s.button || 'Book now')}</a></div></section>`
        : `<section class="cta cta-band on-pop"><div class="wrap cta-row"><h2 class="h2">${s.emoji ? WS.emoji(s.emoji) + ' ' : ''}${e(s.title)}</h2><div><p>${lines(s.text)}</p><a class="btn btn-light" href="${s.link ? e(s.link) : c.book}">${e(s.button || 'Book now')}</a></div></div></section>`,
  });

  // ---------- Visit ----------
  R('visit', {
    label: 'Location and hours',
    blurb: 'Address, directions and opening hours.',
    variants: { hours: 'Address and hours', map: 'With a map' },
    fields: [{ key: 'title', label: 'Title', type: 'text', hint: 'Leave empty to say "Find us on [your street]"' }],
    create: () => ({ variant: 'hours', title: '' }),
    render: (s, c) => {
      const addr = String(c.biz.address || '').trim();
      const st = WS.streetOf(addr);
      const hrs = (c.biz.hours || []).filter((h) => h && h.d);
      const hasHours = hrs.some((h) => h.open);
      const title = s.title || (st ? `Find us on ${st}.` : addr ? 'Come see us.' : (c.biz.city ? `Serving ${c.biz.city}.` : 'Get in touch.'));
      const reach = [c.biz.phone ? `<tr><th scope="row">Call</th><td><a href="${WS.tel(c.biz.phone)}">${e(c.biz.phone)}</a></td></tr>` : '', c.biz.email ? `<tr><th scope="row">Email</th><td><a href="mailto:${e(c.biz.email)}">${e(c.biz.email)}</a></td></tr>` : '', c.biz.instagram ? `<tr><th scope="row">Instagram</th><td><a href="https://instagram.com/${e(c.biz.instagram)}">@${e(c.biz.instagram)}</a></td></tr>` : '', c.biz.city ? `<tr><th scope="row">Area</th><td>${e(c.biz.city)}</td></tr>` : ''].join('');
      const hours = hasHours
        ? `<table class="hours" aria-label="Opening hours">${hrs.map((h) => `<tr><th scope="row">${e(h.d)}</th><td>${h.open && h.close ? `${WS.fmtTime(h.open)} to ${WS.fmtTime(h.close)}` : 'Closed'}</td></tr>`).join('')}</table>`
        : (reach ? `<table class="hours" aria-label="How to reach us">${reach}</table>` : '');
      const callBtn = c.biz.phone ? `<a class="btn ghost" href="${WS.tel(c.biz.phone)}">Call us</a>` : '';
      const left = `<div><h2 class="h2">${e(title)}</h2>${addr ? `<a class="addr" href="${WS.map(addr)}">${e(addr)}</a>` : ''}<div class="actions"><a class="btn" href="${c.book}">${e(c.biz.bookLabel || 'Book now')}</a>${addr ? `<a class="btn ghost" href="${WS.map(addr)}">Get directions</a>` : ''}${callBtn}</div></div>`;
      if (s.variant === 'map' && addr)
        return `<section class="visit visit-map on-base" id="visit"><div class="wrap visit-grid">${left}<div><iframe class="mapf" title="Map to ${e(c.biz.name)}" src="${WS.mapEmbed(c.biz.address)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>${hours}</div></div></section>`;
      return `<section class="visit on-base" id="visit"><div class="wrap visit-grid">${left}${hours}</div></section>`;
    },
  });

  // Order the "Add section" library is shown in.
  WS.sectionOrder = ['pagehead', 'hero', 'announce', 'intro', 'stats', 'services', 'steps', 'prices', 'plans', 'embed', 'payments', 'events', 'gallery', 'beforeafter', 'team', 'reviews', 'faq', 'booking', 'servicearea', 'cta', 'contact', 'visit'];
})(globalThis.WS = globalThis.WS || {});

// Shop / products section for ecommerce sites: a grid of purchasable items + a cart drawer.
// Styled entirely from the active palette (no AI, no broken CSS possible).
// In the real app the Checkout button posts to the worker's Stripe Connect endpoint.
(function (WS) {
  const e = WS.esc;
  const money = WS.money;

  const SHOP_CSS = `<style id="ws-shop-css">
.shop .wrap{max-width:1180px}
.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:22px;margin-top:40px}
.wsp-card{display:flex;flex-direction:column;background:var(--surface);border-radius:16px;overflow:hidden;border:1px solid rgba(127,127,127,.14);transition:transform .18s ease,box-shadow .18s ease}
.wsp-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.20)}
.wsp-ph{margin:0;aspect-ratio:1/1;display:grid;place-items:center;background:rgba(127,127,127,.12);overflow:hidden}
.wsp-ph img{width:100%;height:100%;object-fit:cover}
.wsp-ph.empty .emo{font-size:clamp(46px,6vw,76px)}
.wsp-b{padding:16px 16px 18px;display:flex;flex-direction:column;gap:6px;flex:1}
.wsp-n{font-size:1.08rem;margin:0;line-height:1.2}
.wsp-d{font-size:.9rem;opacity:.72;margin:0;flex:1}
.wsp-r{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
.wsp-pr{font-weight:800;font-size:1.12rem;color:var(--base-text)}
.wsp-buy{font:inherit;font-weight:700;font-size:.86rem;padding:9px 15px;border-radius:9px;border:none;cursor:pointer;background:var(--accent);color:var(--accent-text)}
.wsp-buy:hover{filter:brightness(1.08)}
.wsp-cart{position:fixed;right:18px;bottom:18px;z-index:9000;display:none;align-items:center;gap:8px;padding:13px 20px;border-radius:999px;border:none;cursor:pointer;background:var(--accent);color:var(--accent-text);font:inherit;font-weight:800;box-shadow:0 12px 32px rgba(0,0,0,.30)}
.wsp-cart.on{display:inline-flex}
.wsp-draw{position:fixed;inset:0;z-index:9001;display:none;background:rgba(0,0,0,.5)}
.wsp-draw.on{display:block}
.wsp-panel{position:absolute;right:0;top:0;bottom:0;width:min(400px,92vw);background:var(--base);color:var(--base-text);padding:24px;overflow:auto;box-shadow:-12px 0 44px rgba(0,0,0,.34)}
.wsp-panel h3{margin:0 0 16px;font-size:1.35rem}
.wsp-line{display:flex;justify-content:space-between;gap:10px;padding:12px 0;border-bottom:1px solid rgba(127,127,127,.22)}
.wsp-x{background:none;border:none;color:inherit;opacity:.5;cursor:pointer;font-size:1.15rem;line-height:1}
.wsp-tot{display:flex;justify-content:space-between;font-weight:800;font-size:1.18rem;margin:18px 0}
.wsp-co{width:100%;padding:15px;border-radius:12px;border:none;cursor:pointer;background:var(--accent);color:var(--accent-text);font:inherit;font-weight:800;font-size:1rem}
.wsp-close{position:absolute;top:16px;right:18px;background:none;border:none;color:inherit;font-size:1.7rem;cursor:pointer;opacity:.6;line-height:1}
</style>`;

  const CART_JS = `<script>(function(){
  var cart=[];
  // Price as a number: the first amount after a currency sign, else the first number ("2 for $10" is 10, "$15 - $25" is 15).
  function num(s){s=String(s==null?'':s).split(',').join('');var at=s.search(/[$£€]/);var m=(at>-1?s.slice(at):s).match(/[0-9]+([.][0-9]{1,2})?/);return m?parseFloat(m[0]):NaN;}
  function money(n){var s=String(n==null?'':n).trim();if(/^[$£€]?[ ]?[0-9]+([.][0-9]{1,2})?$/.test(s.split(',').join(''))){var p=num(s);return '$'+(p%1?p.toFixed(2):p);}return s;}
  var pill=document.querySelector('.wsp-cart'),draw=document.querySelector('.wsp-draw');
  function note(msg){var pn=draw&&draw.querySelector('.wsp-panel');if(!pn)return;var nt=pn.querySelector('.wsp-note');if(!nt){nt=document.createElement('p');nt.className='wsp-note';nt.setAttribute('role','status');nt.style.cssText='margin:14px 0 0;opacity:.85;line-height:1.5';pn.appendChild(nt);}nt.textContent=msg;}
  function contactLine(){var ca=document.querySelector('a[href^="tel:"]');return ca?' at '+decodeURIComponent(ca.getAttribute('href').slice(4)):'';}
  function checkout(btn){
    if(!cart.length)return;
    var site=(draw&&draw.getAttribute('data-site'))||'';
    var inPreview=(location.protocol==='about:')||(window.parent!==window&&/websprout/.test(document.referrer||''));
    if(inPreview||!site){note('Checkout opens on your published site. Visitors pay securely with Stripe.');return;}
    var q={};cart.forEach(function(i){q[i.name]=(q[i.name]||0)+1;});
    var items=Object.keys(q).map(function(n){return {n:n,qty:q[n]};});
    var label=btn.textContent;btn.disabled=true;btn.textContent='Opening checkout…';
    fetch('/cart-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,items:items})})
      .then(function(r){return r.json();}).then(function(j){
        if(j&&j.url){location.href=j.url;return;}
        btn.disabled=false;btn.textContent=label;
        note((j&&j.error?j.error+'. ':'')+'You can still order by contacting us'+contactLine()+'.');
      }).catch(function(){btn.disabled=false;btn.textContent=label;note('Could not reach checkout. Please try again, or contact us'+contactLine()+'.');});
  }
  try{if(/[?&]ws_paid=1/.test(location.search)){var ok=document.createElement('div');ok.setAttribute('role','status');ok.style.cssText='position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:9100;background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.25)';ok.textContent='Thank you! Your order is confirmed. A receipt is on its way to your email.';document.body.appendChild(ok);setTimeout(function(){ok.remove();},9000);}}catch(e){}
  function total(){var t=0;cart.forEach(function(i){var p=num(i.price);if(!isNaN(p))t+=p;});return t;}
  function paint(){
    if(pill){pill.classList.toggle('on',cart.length>0);var c=pill.querySelector('b');if(c)c.textContent=cart.length;}
    var box=draw&&draw.querySelector('[data-lines]');if(box)box.innerHTML=cart.length?cart.map(function(i,ix){return '<div class="wsp-line"><span>'+String(i.name||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span><span>'+money(i.price)+' <button class="wsp-x" data-rm="'+ix+'" aria-label="Remove">&times;</button></span></div>';}).join(''):'<p style="opacity:.6">Your cart is empty.</p>';
    var tt=draw&&draw.querySelector('[data-total]');if(tt)tt.textContent='$'+total().toFixed(2);
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('.wsp-buy');if(b){cart.push({name:b.getAttribute('data-n'),price:b.getAttribute('data-p')});paint();try{pill.animate([{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1)'}],{duration:260});}catch(e){}return;}
    if(ev.target.closest('.wsp-cart')){if(draw){draw.classList.add('on');paint();}return;}
    if(ev.target.closest('.wsp-close')||ev.target.classList.contains('wsp-draw')){if(draw)draw.classList.remove('on');return;}
    var rm=ev.target.closest('[data-rm]');if(rm){cart.splice(+rm.getAttribute('data-rm'),1);paint();return;}
    if(ev.target.closest('.wsp-co')){checkout(ev.target.closest('.wsp-co'));return;}
  });
  paint();
})();</script>`;

  WS.register('products', {
    label: 'Products',
    blurb: 'A grid of items people can buy, with a cart.',
    variants: { grid: 'Grid' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'Products', type: 'list', add: 'Add a product', item: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'desc', label: 'Short description', type: 'text' },
        { key: 'emoji', label: 'Emoji (shown when there is no photo)', type: 'emoji' },
        { key: 'photo', label: 'Photo', type: 'photo' },
      ] },
    ],
    create: () => ({ variant: 'grid', title: 'Shop', items: [] }),
    render: (s, c) => {
      const items = s.items || [];
      if (!items.length && c.mode !== 'edit') return '';
      const cards = items.map((it, i) => {
        const src = c.photo && c.photo('p' + i);
        const img = src
          ? `<figure class="wsp-ph"><img src="${e(src)}"${WS.srcset(src, '(max-width: 760px) 50vw, 300px')} alt="${e(it.name)}" loading="lazy" decoding="async"></figure>`
          : (c.mode === 'edit'
              ? c.slot('p' + i, { hint: 'Product photo', cls: 'wsp-ph' })
              : `<div class="wsp-ph empty" aria-hidden="true">${WS.emoji(it.emoji || '1f4e6', 'emo-big')}</div>`);
        return `<article class="wsp-card">${img}<div class="wsp-b"><h3 class="wsp-n">${e(it.name)}</h3>${it.desc ? `<p class="wsp-d">${e(it.desc)}</p>` : ''}<div class="wsp-r"><span class="wsp-pr">${money(it.price)}</span><button class="wsp-buy" type="button" data-n="${e(it.name)}" data-p="${e(it.price)}">Add to cart</button></div></div></article>`;
      }).join('');
      const cart = c.mode === 'edit' ? '' :
        `<button class="wsp-cart" type="button" aria-label="Open cart">Cart &middot; <b>0</b></button><div class="wsp-draw" data-site="${e(c.site.siteId || '')}"><div class="wsp-panel"><button class="wsp-close" type="button" aria-label="Close cart">&times;</button><h3>Your cart</h3><div data-lines></div><div class="wsp-tot"><span>Total</span><span data-total>$0.00</span></div><button class="wsp-co" type="button">Checkout</button></div></div>` + CART_JS;
      return `<section id="shop" class="shop on-base">${SHOP_CSS}<div class="wrap"><h2 class="h2">${e(s.title || 'Shop')}</h2><div class="wsp-grid">${cards}</div></div></section>${cart}`;
    },
  });
})(globalThis.WS = globalThis.WS || {});

// "Atelier" design style: quiet-luxury ecommerce. Lots of white space, near-black thin type,
// uppercase letter-spaced eyebrows, hairline borders, flat ink buttons, photography-led. No grain, no bounce, no emoji reliance.
// Drop-in alternative to Pomade: same class + palette-role contract.
(function (WS) {
  // Type themes: font pairing + heading knobs, swapped per business category at generation.
  // 'bold' = the Monochrome look (condensed uppercase); 'editorial' = serif, refined; 'clean' = Plex, professional.
  WS.typeThemes = {
    bold: {
      fonts: ['Big+Shoulders+Display:wght@700;800;900', 'Work+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500'],
      vars: {
        '--display': "'Big Shoulders Display','Arial Narrow',system-ui,sans-serif",
        '--body': "'Work Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        '--mono': "'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
        '--h-transform': 'uppercase', '--h-weight': '800', '--h-tracking': '.004em', '--h-lh': '.92',
        '--name-weight': '900', '--name-lh': '.84', '--name-tracking': '.005em',
        '--mark-weight': '900', '--mark-tracking': '.02em', '--btn-radius': '0px', '--btn-weight': '600',
      },
    },
    editorial: {
      fonts: ['Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400', 'Work+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500'],
      vars: {
        '--display': "'Newsreader',Georgia,'Times New Roman',serif",
        '--body': "'Work Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        '--mono': "'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
        '--h-transform': 'none', '--h-weight': '500', '--h-tracking': '-.02em', '--h-lh': '1.04',
        '--name-weight': '400', '--name-lh': '.98', '--name-tracking': '-.03em',
        '--mark-weight': '500', '--mark-tracking': '.01em', '--btn-radius': '2px', '--btn-weight': '500',
      },
    },
    clean: {
      fonts: ['IBM+Plex+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500'],
      vars: {
        '--display': "'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        '--body': "'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        '--mono': "'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
        '--h-transform': 'none', '--h-weight': '500', '--h-tracking': '-.025em', '--h-lh': '1.0',
        '--name-weight': '500', '--name-lh': '1.0', '--name-tracking': '-.035em',
        '--mark-weight': '600', '--mark-tracking': '.01em', '--btn-radius': '2px', '--btn-weight': '500',
      },
    },
  };
  WS.typeTheme = (id) => WS.typeThemes[id] || WS.typeThemes.bold;
  WS.styleFonts = ['Big+Shoulders+Display:wght@700;800;900', 'Work+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500'];
  WS.styleCss = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--base);color:var(--base-text);font:400 16px/1.6 'Work Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;--ease:cubic-bezier(.22,.61,.36,1);--display:'Big Shoulders Display','Arial Narrow',system-ui,sans-serif;--body:'Work Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;--mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--hair:color-mix(in srgb,var(--fg,var(--base-text)),transparent 82%);counter-reset:wsec}
img{max-width:100%;display:block}
a{color:inherit}
:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px}
h1,h2,h3{font-family:var(--display);font-weight:var(--h-weight,800);margin:0;line-height:var(--h-lh,.92);letter-spacing:var(--h-tracking,.004em);text-transform:var(--h-transform,uppercase)}
h1,h2,h3,h4,p,li,a,blockquote,.mark,.addr{overflow-wrap:break-word}
h1,h2,.mark,.foot-brand b{overflow-wrap:anywhere}
.h2{font-size:clamp(32px,4.4vw,62px);max-width:20ch;font-weight:var(--h-weight,800);line-height:var(--h-lh,.9)}
figure{margin:0}
.on-base{background:var(--base);color:var(--base-text);--fg:var(--base-text);--bg:var(--base)}
.on-alt{background:var(--alt);color:var(--alt-text);--fg:var(--alt-text);--bg:var(--alt)}
.on-pop{background:var(--pop);color:var(--pop-text);--fg:var(--pop-text);--bg:var(--pop)}
.muted{color:color-mix(in srgb,var(--fg),transparent 42%)}
.lede{margin:20px 0 40px;max-width:52ch;font-size:17px;color:color-mix(in srgb,var(--fg),transparent 32%)}
.eyebrow,.kicker{font-family:var(--mono);font-size:13px;font-weight:500;letter-spacing:.01em;text-transform:none;color:color-mix(in srgb,var(--fg),transparent 40%)}

/* buttons: flat ink, tiny radius, no bounce */
.btn{display:inline-flex;align-items:center;gap:.5em;background:var(--accent);color:var(--accent-text);font-family:var(--body);font-weight:var(--btn-weight,600);font-size:14px;line-height:1;letter-spacing:.01em;padding:16px 28px;border-radius:var(--btn-radius,0px);text-decoration:none;transition:background .25s,color .25s,border-color .25s}
.btn:hover{background:color-mix(in srgb,var(--accent),#fff 18%)}
.btn.ghost{background:transparent;color:var(--fg,var(--base-text));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg,var(--base-text)),transparent 60%)}
.btn.ghost:hover{background:color-mix(in srgb,var(--fg,var(--base-text)),transparent 92%)}
.btn-ink{background:var(--fg);color:var(--bg,var(--base))}
.on-pop .btn-light,.btn-light{background:var(--pop-text);color:var(--pop)}
.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px}

/* header: thin, translucent, uppercase wordmark */
.top{position:fixed;left:0;right:0;top:var(--top-offset,0px);z-index:40;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:36px;padding:22px 32px;color:var(--base-text);transition:background .35s,padding .35s,box-shadow .35s}
.top.solid{background:color-mix(in srgb,var(--base),transparent 10%);backdrop-filter:blur(14px) saturate(1.3);padding:14px 32px;box-shadow:0 1px 0 var(--hair)}
.mark{font-family:var(--display);font-weight:var(--mark-weight,900);font-size:26px;line-height:1;letter-spacing:var(--mark-tracking,.02em);text-transform:var(--h-transform,uppercase);text-decoration:none}
.top nav{display:flex;gap:30px;font-size:14px}
.top nav a{text-decoration:none;color:color-mix(in srgb,currentColor,transparent 25%);transition:color .2s;position:relative}.top nav a:hover{color:currentColor}
.top nav a.active{color:currentColor}
.top nav a.active::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;background:var(--accent);border-radius:2px}
.js .ws-page{display:none}.js .ws-page.on{display:block}.ws-page{animation:wsPageIn .4s ease both}
.pagehead{padding:clamp(104px,17vh,180px) 24px clamp(40px,7vh,72px);text-align:center;border-bottom:1px solid var(--hair)}
.pagehead .wrap{max-width:860px;margin:0 auto}
.pagehead .emo-big{margin-bottom:20px}
.pagehead-t{font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(42px,6.8vw,84px);line-height:var(--h-lh,.92);letter-spacing:var(--h-tracking,.004em);text-transform:var(--h-transform,uppercase);margin:0}
.pagehead-s{font-size:clamp(1.05rem,1.8vw,1.3rem);opacity:.72;max-width:60ch;margin:18px auto 0;line-height:1.6;color:var(--fg)}
@keyframes wsPageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pill{font-size:13px;font-weight:500;letter-spacing:.02em;text-decoration:none;padding:11px 22px;border:1px solid color-mix(in srgb,var(--base-text),transparent 65%);border-radius:2px;transition:background .25s,color .25s}
.pill:hover{background:var(--base-text);color:var(--base)}
.navtoggle{display:none;color:inherit}
.announce{position:relative;z-index:41;display:flex;justify-content:center;align-items:center;gap:10px;padding:11px 20px;font-size:12.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;text-align:center}
.announce .emo{width:1.2em;height:1.2em;vertical-align:-.2em}

/* hero */
.hero .status{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;margin:0 0 26px;padding:8px 16px;background:color-mix(in srgb,var(--base),transparent 15%);color:var(--base-text);backdrop-filter:blur(6px);border:1px solid var(--hair);border-radius:2px}
.hero .status b{font-weight:600}
.pole{display:none}
.name{font-family:var(--display);font-size:clamp(52px,9.4vw,150px);line-height:var(--name-lh,.84);font-weight:var(--name-weight,900);letter-spacing:var(--name-tracking,.005em);text-transform:var(--h-transform,uppercase);padding-bottom:.02em}
/* monochrome signature: in the bold theme, lines after the first are set in outline */
.wst-bold .hero-split .ln + .ln > span,.wst-bold .hero-type .ln + .ln > span{-webkit-text-stroke:2px var(--accent);color:color-mix(in srgb,var(--accent),transparent 92%)}
.ln{display:block}
.ln>span{display:block;animation:fade 1.1s var(--ease) both;animation-delay:calc(.15s + var(--d) * .08s)}
@keyframes fade{from{opacity:0;transform:translateY(12px)}}
.hero-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-top:40px;padding-top:28px;border-top:1px solid var(--hair);animation:fade 1s .5s both}
.tag{font-size:18px;max-width:44ch;margin:0;line-height:1.6;color:color-mix(in srgb,var(--fg),transparent 20%)}
.hero .tag:empty{display:none}
.hero-foot:has(.tag:empty){justify-content:flex-start;border-top:0;padding-top:0;margin-top:30px}
.hero-photo{position:relative;height:94svh;min-height:600px;max-height:1040px;overflow:hidden;display:flex;align-items:flex-end;--fg:#fff;color:#fff}
.hero-media{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,var(--surface),var(--base))}
.hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:settle 1.8s var(--ease) both}
.hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.42) 0%,rgba(0,0,0,.05) 32%,rgba(0,0,0,.32) 72%,rgba(0,0,0,.52) 100%)}
.hero-media.empty{background:radial-gradient(1150px 760px at 80% 4%,color-mix(in srgb,var(--accent),transparent 66%),transparent 54%),radial-gradient(1050px 740px at 4% 98%,color-mix(in srgb,var(--pop),transparent 74%),transparent 54%),linear-gradient(158deg,var(--surface),var(--base) 74%)}
.hero-media.empty::after{display:none}
.hero-photo.hero-noimg,.hero-photo:has(.hero-media.empty){--fg:var(--base-text);color:var(--base-text);height:auto;min-height:clamp(468px,64vh,640px);max-height:none;align-items:center}
.hero-photo.hero-noimg .hero-in,.hero-photo:has(.hero-media.empty) .hero-in{padding-top:clamp(92px,12vh,130px);padding-bottom:clamp(40px,5vh,60px)}
.hero-media .slot-chip{top:92px;right:32px}
@keyframes settle{from{transform:scale(1.06)}}
.hero-in{position:relative;z-index:2;width:100%;max-width:1200px;margin:0 auto;padding:0 32px 60px}
.hero-split{padding:160px 0 96px}
.hs-grid{display:grid;grid-template-columns:6fr 6fr;gap:70px;align-items:center}
.hero-split .name{font-size:clamp(48px,7.2vw,118px)}
.hero-split .tag{margin:26px 0 30px}
.hs-img{aspect-ratio:4/5;min-height:440px;border-radius:4px;overflow:hidden}
.hero-type{padding:190px 0 96px}
.ht-row{display:flex;align-items:center;justify-content:space-between;gap:40px}
.ht-emo{font-size:clamp(72px,11vw,168px);line-height:1;flex:none;animation:fade 1s .4s both}
.ht-emo .emo{width:1em;height:1em;vertical-align:middle}

/* intro / statement */
.intro{padding:130px 0}
.intro-center{padding:92px 0 118px}
.intro-grid{display:grid;grid-template-columns:7fr 5fr;gap:80px;align-items:center}
.intro-grid:has(.intro-img[hidden]){grid-template-columns:1fr;max-width:860px;margin:0 auto}
.statement{font:500 clamp(24px,2.8vw,38px)/1.3 var(--body);letter-spacing:-.01em;margin:0;max-width:28ch;color:var(--fg)}
.intro-center .emo-big{margin-bottom:22px}
.intro .statement .emo{width:1.1em;height:1.1em;vertical-align:-.12em;margin-right:.1em}
.intro-img{aspect-ratio:4/5;border-radius:4px;overflow:hidden}
.intro-center{text-align:center}.intro-center .statement{margin:0 auto;max-width:28ch}

/* stats */
.stats{padding:110px 0}
.stats .h2{margin-bottom:54px}
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:0}
.stat{padding:4px 34px;border-left:1px solid var(--hair)}
.stat:first-child{border-left:0;padding-left:0}
.num{font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(42px,5vw,72px);line-height:.92;letter-spacing:var(--h-tracking,.004em);margin:0;color:var(--fg);font-variant-numeric:tabular-nums}
.num small{font-size:.42em;margin-left:.1em;vertical-align:.5em;color:color-mix(in srgb,var(--fg),transparent 40%)}
.lbl{margin:14px 0 0;font-size:12.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 45%)}
.stat-emo{font-size:34px;margin-bottom:14px;display:block;line-height:1}

/* prices */
.prices-menu{display:grid;grid-template-columns:5fr 6fr}
.prices-menu:has(.pm-img[hidden]){grid-template-columns:1fr}
.prices-menu:has(.pm-img[hidden]) .pm-body{max-width:880px;margin:0 auto;width:100%}
.pm-img{position:sticky;top:0;height:100vh;max-height:960px}
.pm-body{padding:120px 6vw}
.prices-board{padding:120px 0}
.board .plist{columns:2;column-gap:72px}
.board .plist li{break-inside:avoid}
.plist{list-style:none;padding:0;margin:0 0 44px}
.plist li{display:grid;grid-template-columns:auto 1fr auto auto;align-items:baseline;gap:14px 18px;padding:20px 0 18px;border-top:1px solid var(--hair)}
.svc{font-family:var(--display);font-weight:var(--h-weight,700);font-size:clamp(21px,2vw,30px);line-height:1.1;letter-spacing:var(--h-tracking,.004em);text-transform:var(--h-transform,uppercase)}
.price{font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(21px,2vw,30px);line-height:1.1;color:var(--price);letter-spacing:var(--h-tracking,.004em)}
.lead{border-bottom:1px dotted color-mix(in srgb,var(--fg),transparent 72%);transform:translateY(-5px)}
.pl-book{align-self:center;font:600 11px/1 var(--body);letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:var(--fg);border:1px solid color-mix(in srgb,var(--fg),transparent 55%);padding:9px 15px;white-space:nowrap;transition:background .2s,color .2s,border-color .2s}
.pl-book:hover{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}
.meta{grid-column:1/-1;font-size:14px;color:color-mix(in srgb,var(--fg),transparent 44%);margin-top:-2px}

/* services */
.services{padding:120px 0}
.sv{list-style:none;padding:0;margin:60px 0 0}
.services-grid .sv{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:52px 44px}
.sv h3{font-size:22px;font-weight:600;margin-bottom:12px;letter-spacing:-.01em}
.sv p{margin:0 0 14px;color:color-mix(in srgb,var(--fg),transparent 28%);font-size:15px}
.sv-emo{font-size:48px;margin-bottom:18px;line-height:1}
.from{font-weight:600;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 25%)}
.services-list .sv li{display:grid;grid-template-columns:1fr 2fr auto;gap:28px;align-items:center;padding:24px 0;border-top:1px solid var(--hair)}
.services-list .sv p{margin:0}

/* gallery */
.gallery .wrap{padding-top:100px;padding-bottom:40px}
.g-wrap{display:flex;gap:14px;align-items:flex-end}
.gallery-strip .g0{flex:5;height:clamp(300px,42vw,600px)}
.gallery-strip .g1{flex:3;height:clamp(360px,50vw,720px)}
.gallery-strip .g2{flex:4;height:clamp(260px,34vw,480px)}
.g-wrap figure{border-radius:4px;overflow:hidden}
.gallery-grid .g-wrap{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:clamp(160px,18vw,270px);align-items:stretch;gap:14px}
.gallery-grid .g0{grid-column:span 2;grid-row:span 2}.gallery-grid .g3{grid-column:span 2}
.gallery-grid .slot[hidden]{display:none}

/* team */
.team{padding:130px 0}
.tr{list-style:none;padding:0;margin:64px 0 0}
.tr li{display:grid;grid-template-columns:3fr 5fr auto;align-items:baseline;gap:40px;padding:28px 0;border-top:1px solid var(--hair);transition:padding .3s var(--ease)}
.tr li:last-child{border-bottom:1px solid var(--hair)}
.tr li:hover{padding-left:14px}
.tr h3{font-size:clamp(26px,2.6vw,36px);font-weight:600;letter-spacing:-.02em}
.tr p{margin:0;max-width:46ch;color:color-mix(in srgb,var(--fg),transparent 28%)}
.tr a{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;text-underline-offset:5px;white-space:nowrap}
.tp{list-style:none;padding:0;margin:60px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:44px 28px}
.tp-img{aspect-ratio:3/4;margin-bottom:20px;border-radius:4px;overflow:hidden}
.tp h3{font-size:22px;font-weight:600}.tp p{margin:8px 0 0;color:color-mix(in srgb,var(--fg),transparent 30%);font-size:15px}

/* reviews */
.reviews-feature{position:relative;padding:170px 0 110px;overflow:hidden;isolation:isolate}
.rv-media{position:absolute;inset:0;z-index:0}
.rv-media img{width:100%;height:100%;object-fit:cover}
.rv-media::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,color-mix(in srgb,var(--pop),transparent 6%),color-mix(in srgb,var(--pop),transparent 28%) 60%,color-mix(in srgb,var(--pop),transparent 62%))}
.rv-media.empty::after{display:none}
.reviews-feature .wrap{position:relative;z-index:1}
.big-q{margin:0}
.big-q p{font:500 clamp(26px,3.6vw,50px)/1.24 var(--body);letter-spacing:-.015em;margin:0;max-width:22ch}
.big-q p::before{content:"\\201C"}.big-q p::after{content:"\\201D"}
.reviews footer{margin-top:22px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 35%)}
.more{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-top:90px;padding-top:36px;border-top:1px solid var(--hair)}
.more blockquote,.rw blockquote{margin:0}.more p{margin:0;font-size:16px}
.reviews-wall{padding:120px 0}
.rw{columns:3 280px;column-gap:48px}
.rw blockquote{break-inside:avoid;padding:28px 0;border-top:1px solid var(--hair)}
.rw p{font:400 19px/1.55 var(--body);letter-spacing:0;margin:0}

/* before / after */
.ba{padding:120px 0}
.ba-grid{display:grid;grid-template-columns:4fr 7fr;gap:64px;align-items:center}
.ba-frame{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--surface);user-select:none;border-radius:4px}
.ba-frame .slot{position:absolute;inset:0}
.ba-before{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.ba-frame::after{content:"";position:absolute;top:0;bottom:0;left:var(--x);width:2px;margin-left:-1px;background:#fff;pointer-events:none;z-index:4}
.ba-range{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;z-index:5;margin:0}
.ba-tag{position:absolute;bottom:14px;z-index:4;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;background:rgba(0,0,0,.6);color:#fff;padding:6px 10px;border-radius:2px;pointer-events:none}
.ba-tag-l{left:14px}.ba-tag-r{right:14px}
.edit .ba-range{pointer-events:none}
.edit .ba-before{clip-path:inset(0 50% 0 0)}

/* faq */
.faq{padding:120px 0}
.faq-grid{display:grid;grid-template-columns:4fr 8fr;gap:64px;align-items:start}
.qa details{border-top:1px solid var(--hair);padding:4px 0}
.qa details:last-child{border-bottom:1px solid var(--hair)}
.qa summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;font:500 20px/1.3 var(--body);letter-spacing:-.005em;padding:22px 0}
.qa summary::-webkit-details-marker{display:none}
.qa summary::after{content:"+";font-size:26px;font-weight:300;line-height:1;transition:transform .3s var(--ease)}
.qa details[open] summary::after{transform:rotate(45deg)}
.qa details p{margin:0 0 24px;max-width:58ch;color:color-mix(in srgb,var(--fg),transparent 25%)}

/* cta */
.cta-band{padding:120px 0}
.cta-row{display:grid;grid-template-columns:7fr 5fr;gap:56px;align-items:end}
.cta p{font-size:17px;margin:0 0 26px;max-width:40ch;color:color-mix(in srgb,var(--fg),transparent 22%)}
.cta-split{display:grid;grid-template-columns:1fr 1fr}
.cta-split:has(.cta-img[hidden]){grid-template-columns:1fr}
.cta-img{min-height:520px}
.cta-body{padding:110px 6vw;display:flex;flex-direction:column;justify-content:center}
.cta-body p{margin-top:22px}

/* visit */
.visit{padding:130px 0 0}
.visit-grid{display:grid;grid-template-columns:6fr 5fr;gap:90px;align-items:start}
.addr{display:block;margin:28px 0 36px;font:600 clamp(19px,1.9vw,26px)/1.3 var(--body);letter-spacing:-.005em;color:var(--fg);text-decoration:none;max-width:24ch}
.addr:hover{text-decoration:underline;text-underline-offset:6px}
.hours{width:100%;border-collapse:collapse}
.hours tr{border-top:1px solid var(--hair)}
.hours tr:last-child{border-bottom:1px solid var(--hair)}
.hours th{text-align:left;font:600 15px/1 var(--body);padding:16px 0}
.hours td{text-align:right;font-variant-numeric:tabular-nums;font-size:15px;color:color-mix(in srgb,var(--fg),transparent 20%)}
.hours tr.today th,.hours tr.today td{color:var(--fg);font-weight:600}
.mapf{width:100%;aspect-ratio:16/10;border:0;margin-bottom:28px;border-radius:4px;filter:grayscale(1) contrast(1.02)}
.foot{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);gap:28px 48px;padding:64px max(32px,calc((100% - 1136px)/2)) 40px;margin:0;font-size:14px;line-height:1.6;background:#111;color:rgba(255,255,255,.66)}
.foot a{text-decoration:none;color:rgba(255,255,255,.72)}.foot a:hover{color:#fff}
.foot-brand b{display:block;font-family:var(--display);font-weight:var(--mark-weight,800);letter-spacing:var(--mark-tracking,.02em);font-size:22px;line-height:1.1;color:#fff;margin-bottom:10px}
.foot-brand p{margin:0;max-width:38ch}
.foot-col{display:flex;flex-direction:column;gap:8px;min-width:0}
.foot-col h4{margin:0 0 4px;font:600 11px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.foot-col a,.foot-col span{overflow-wrap:anywhere}
.ws-top{position:fixed;left:18px;bottom:18px;z-index:8000;width:44px;height:44px;border-radius:50%;border:1px solid var(--hair);background:color-mix(in srgb,var(--base),transparent 6%);color:var(--base-text);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .25s,transform .25s;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ws-top.on{opacity:1;transform:none;pointer-events:auto}
.ws-top:hover{background:var(--base-text);color:var(--base)}
.steps{padding:clamp(72px,10vw,120px) 0}
.gr-sum{display:flex;align-items:baseline;gap:10px;margin:18px 0 6px;font-size:15px}.gr-sum b{font:var(--h-weight,800) 34px/1 var(--display)}
.gr-stars{color:#f5b301;letter-spacing:2px}
.reviews-google .rw blockquote .gr-stars{display:block;margin-bottom:8px}
.gr-attr{margin:18px 0 0;font-size:13px;opacity:.7}.gr-attr a{color:inherit}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:22px;margin-top:44px;align-items:stretch}
.plan{position:relative;display:flex;flex-direction:column;gap:14px;padding:30px 26px;border:1px solid var(--hair);background:color-mix(in srgb,var(--fg),transparent 97%)}
.plan-hot{border-color:var(--accent);box-shadow:0 18px 44px -26px color-mix(in srgb,var(--accent),transparent 30%)}
.plan-tag{position:absolute;top:-11px;left:24px;background:var(--accent);color:var(--accent-text);font:600 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;padding:6px 10px}
.plan-n{font-size:22px;text-transform:var(--h-transform,uppercase)}
.plan-p b{font:var(--h-weight,800) clamp(34px,4vw,48px)/1 var(--display)}.plan-p span{margin-left:8px;color:color-mix(in srgb,var(--fg),transparent 40%);font-size:14px}
.plan-f{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;flex:1}
.plan-f li{padding-left:22px;position:relative;font-size:15px}.plan-f li::before{content:'';position:absolute;left:2px;top:.55em;width:9px;height:5px;border-left:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(-45deg)}
.plan .btn{justify-content:center;margin-top:6px}
.embed-box{margin-top:36px;border:1px solid var(--hair);background:#fff;overflow:hidden}
.embed-box iframe{display:block;width:100%;border:0}
.embed-alt{margin:12px 0 0;font-size:13px}.embed-alt a{color:inherit;opacity:.7}
.embed-ph{margin-top:28px;padding:48px 24px;border:2px dashed var(--hair);text-align:center;opacity:.75}
.steps-grid{list-style:none;padding:0;margin:48px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:36px}
.steps .step{display:block}
.step-n{display:block;width:auto;height:auto;border-radius:0;background:none;color:var(--accent);font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(44px,4.4vw,60px);line-height:1;margin-bottom:16px}
.step-t{font-size:1.5rem;font-weight:var(--h-weight,800);text-transform:var(--h-transform,uppercase);letter-spacing:var(--h-tracking,.004em);margin:0 0 8px;color:var(--fg);font-family:var(--display)}
.step-d{margin:0;opacity:.75;line-height:1.6;color:var(--fg)}
.contactf{padding:clamp(72px,10vw,120px) 0}
.wf-wrap{max-width:720px}
.wf-sub{opacity:.75;margin:12px 0 0;font-size:1.05rem;line-height:1.6;color:var(--fg)}
.wf-form{margin-top:36px;display:flex;flex-direction:column;gap:16px}
.wf-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.wf-l{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 38%)}
.wf-i{font:inherit;font-size:1rem;padding:13px 15px;border-radius:3px;border:1px solid color-mix(in srgb,var(--fg),transparent 70%);background:color-mix(in srgb,var(--fg),transparent 95%);color:var(--fg);text-transform:none;letter-spacing:0;font-weight:400}
.wf-i:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent),transparent 80%)}
.wf-t{resize:vertical;min-height:120px}
.wf-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.wf-btn{align-self:flex-start;margin-top:6px}
.wf-ok{margin:6px 0 0;font-weight:600;color:var(--accent)}
.payments{padding:clamp(72px,10vw,120px) 0}
.pay-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:40px}
.pay-card{display:flex;flex-direction:column;justify-content:space-between;gap:18px;background:var(--surface);border:1px solid var(--hair);border-radius:16px;padding:22px}
.pay-name{font-size:1.18rem;margin:0}
.pay-desc{font-size:.95rem;opacity:.72;margin:6px 0 0;line-height:1.5}
.pay-amt{font:600 1.5rem/1 var(--display);color:var(--accent);margin-top:12px}
.pay-btn{align-self:flex-start}
.pay-soon{align-self:flex-start;font-size:.82rem;opacity:.5;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.pay-trust{text-align:center;margin:28px 0 0;font-size:.82rem;opacity:.55}
.events{padding:clamp(72px,10vw,120px) 0}
.ev-list{list-style:none;padding:0;margin:40px 0 0;display:flex;flex-direction:column;gap:2px}
.ev-row{display:flex;align-items:center;gap:24px;padding:22px 4px;border-top:1px solid var(--hair)}
.ev-row:last-child{border-bottom:1px solid var(--hair)}
.ev-date{flex:none;width:150px;display:flex;flex-direction:column;gap:3px}
.ev-d{font:600 1.05rem/1.2 var(--display);color:var(--accent)}
.ev-t{font-size:.86rem;opacity:.6}
.ev-body{flex:1}
.ev-name{font-size:1.25rem;margin:0}
.ev-desc{margin:5px 0 0;opacity:.72;line-height:1.5}
.ev-btn{flex:none}
.ev-empty{margin:36px 0 0;opacity:.6}
@media (max-width:620px){.ev-row{flex-wrap:wrap;gap:8px}.ev-date{width:100%;flex-direction:row;gap:10px;align-items:baseline}.ev-btn{margin-top:8px}}
.servicearea{padding:clamp(72px,10vw,120px) 0}
.sa-wrap{max-width:560px}
.sa-form{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
.sa-input{flex:1;min-width:180px;font-size:1.05rem;letter-spacing:.12em}
.sa-btn{flex:none}
.sa-result{margin:20px 0 0;font-weight:600;font-size:1.02rem;padding:14px 18px;border-radius:10px}
.sa-result.sa-yes{color:var(--fg);background:color-mix(in srgb,var(--accent),transparent 86%);border:1px solid color-mix(in srgb,var(--accent),transparent 55%)}
.sa-result.sa-no,.sa-result.sa-warn{color:var(--fg);background:color-mix(in srgb,var(--fg),transparent 93%);border:1px solid var(--hair)}
.wsr-sharp .btn,.wsr-sharp .pill{border-radius:0!important}.wsr-sharp :is(input,textarea,select,figure.slot){border-radius:0}
.wsr-soft .btn,.wsr-soft .pill{border-radius:8px!important}.wsr-soft :is(input,textarea,select){border-radius:8px}.wsr-soft figure.slot{border-radius:14px}
.wsr-round .btn,.wsr-round .pill{border-radius:999px!important}.wsr-round :is(input,select){border-radius:999px;padding-left:18px}.wsr-round textarea{border-radius:18px}.wsr-round figure.slot{border-radius:26px}
.mark-logo{display:block;height:44px;width:auto;max-width:200px;object-fit:contain}
.top.solid .mark-logo{height:36px}
.credits{margin:0;text-align:center;font:500 11px/1.6 'Work Sans',system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:16px 20px 26px;background:#111;color:rgba(255,255,255,.64)}
.credits a{text-decoration:none}.credits a:hover{text-decoration:underline}

/* photo slots */
figure.slot{position:relative;overflow:hidden;background:var(--surface);color:var(--base-text);--slot-ink:var(--base-text)}
figure.slot img{width:100%;height:100%;object-fit:cover}
.slot[hidden]{display:none!important}
.slot-bg.empty img{display:none}
.slot-add{all:unset;box-sizing:border-box;position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:24px;cursor:pointer;color:var(--slot-ink);outline:1px dashed color-mix(in srgb,var(--slot-ink),transparent 55%);outline-offset:-10px}
.slot-add b{font-weight:500;font-size:14px;max-width:24ch;line-height:1.3}
.slot-add span{font-size:12px;opacity:.6}
.slot-add:hover,.slot.drag .slot-add{background-color:color-mix(in srgb,var(--slot-ink),transparent 94%);outline-color:var(--slot-ink)}
.slot:not(.empty) .slot-add{display:none}
.slot-tools{position:absolute;top:12px;right:12px;display:none;gap:6px;z-index:6}
.slot:not(.empty):hover .slot-tools,.slot:not(.empty):focus-within .slot-tools{display:flex}
.slot-tools button,.slot-chip{all:unset;cursor:pointer;font:500 12px/1 'Work Sans',system-ui,sans-serif;background:rgba(0,0,0,.72);color:#fff;padding:9px 12px;border-radius:2px;backdrop-filter:blur(6px)}
.slot-tools button:hover,.slot-chip:hover{background:#000}
.slot-chip{position:absolute;z-index:6;display:inline-flex;align-items:center;gap:8px;padding:10px 16px 10px 12px;border:1px dashed rgba(255,255,255,.6)}
.slot-chip svg{width:18px;height:18px}
.slot-bg.drag::before{content:"Drop to use this photo";position:absolute;inset:16px;z-index:7;display:grid;place-items:center;border:2px dashed #fff;font:500 18px 'Work Sans',system-ui;color:#fff;background:rgba(0,0,0,.45)}

/* shop: clean light product cards, hairline borders, flat ink button */
.shop{padding:40px 0 20px}
.shop .wrap{max-width:1200px}
.shop .h2{margin-bottom:6px}
.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:28px;margin-top:44px}
.wsp-card{display:flex;flex-direction:column;background:var(--surface);border-radius:6px;overflow:hidden;border:1px solid var(--hair);transition:border-color .25s}
.wsp-card:hover{border-color:color-mix(in srgb,var(--base-text),transparent 55%)}
.wsp-ph{margin:0;aspect-ratio:1/1;display:grid;place-items:center;background:color-mix(in srgb,var(--base-text),transparent 94%);overflow:hidden}
.wsp-ph img{width:100%;height:100%;object-fit:cover}
.wsp-ph.empty .emo{width:clamp(52px,7vw,84px);height:clamp(52px,7vw,84px)}
.wsp-b{padding:20px 20px 22px;display:flex;flex-direction:column;gap:7px;flex:1;background:var(--base)}
.wsp-n{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin:0;line-height:1.3}
.wsp-d{font-size:14px;color:color-mix(in srgb,var(--base-text),transparent 35%);margin:0;flex:1;line-height:1.5}
.wsp-r{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.wsp-pr{font-weight:500;font-size:16px;color:var(--base-text);font-variant-numeric:tabular-nums}
.wsp-buy{font:500 11px/1 'Work Sans',system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:11px 16px;border-radius:2px;border:1px solid var(--base-text);cursor:pointer;background:transparent;color:var(--base-text);transition:background .2s,color .2s}
.wsp-buy:hover{background:var(--base-text);color:var(--base)}
.wsp-cart{position:fixed;right:20px;bottom:20px;z-index:9000;display:none;align-items:center;gap:8px;padding:14px 22px;border-radius:2px;border:none;cursor:pointer;background:var(--accent);color:var(--accent-text);font:500 13px/1 'Work Sans',system-ui;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.wsp-cart.on{display:inline-flex}
.wsp-draw{position:fixed;inset:0;z-index:9001;display:none;background:rgba(0,0,0,.4)}
.wsp-draw.on{display:block}
.wsp-panel{position:absolute;right:0;top:0;bottom:0;width:min(400px,92vw);background:var(--base);color:var(--base-text);padding:28px;overflow:auto;box-shadow:-12px 0 44px rgba(0,0,0,.2)}
.wsp-panel h3{margin:0 0 18px;font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.wsp-line{display:flex;justify-content:space-between;gap:10px;padding:14px 0;border-bottom:1px solid var(--hair);font-size:15px}
.wsp-x{background:none;border:none;color:inherit;opacity:.5;cursor:pointer;font-size:1.1rem;line-height:1}
.wsp-tot{display:flex;justify-content:space-between;font-weight:500;font-size:16px;margin:20px 0}
.wsp-co{width:100%;padding:16px;border-radius:2px;border:none;cursor:pointer;background:var(--accent);color:var(--accent-text);font:500 12px/1 'Work Sans',system-ui;letter-spacing:.12em;text-transform:uppercase}
.wsp-close{position:absolute;top:18px;right:20px;background:none;border:none;color:inherit;font-size:1.6rem;cursor:pointer;opacity:.6;line-height:1}

/* editor helpers */
.edit [data-sec]{position:relative}
.edit [data-sec]:hover{outline:2px solid color-mix(in srgb,#3B82F6,transparent 30%);outline-offset:-2px}
.edit [data-sec].sel{outline:3px solid #3B82F6;outline-offset:-3px}

/* reveal on scroll: gentle fade only */
.js .reveal{opacity:0;transform:translateY(16px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.js .reveal.in{opacity:1;transform:none}
.edit .ln>span,.edit .hero-foot,.edit .hero-media img{animation:none!important}
.edit .reveal{opacity:1!important;transform:none!important}

@media (max-width:900px){
  .wrap,.hero-in{padding-left:20px;padding-right:20px}
  .top{grid-template-columns:1fr auto;padding:16px 20px}.top.solid{padding:12px 20px}.top nav{display:none}
  .multipage .top{grid-template-columns:1fr auto auto}
  .multipage .navtoggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:none;border:0;cursor:pointer;padding:0;color:inherit;z-index:62}
  .multipage.nav-open .top{backdrop-filter:none;-webkit-backdrop-filter:none}
  .multipage.nav-open .top nav{display:flex;position:fixed;inset:0;flex-direction:column;justify-content:center;align-items:center;gap:30px;background:color-mix(in srgb,var(--base),transparent 2%);z-index:60}
  .multipage.nav-open .top nav a{font-size:22px;color:var(--base-text)}
  .multipage.nav-open .top nav a.active::after{display:none}
  .multipage.nav-open .navtoggle{position:fixed;top:17px;right:18px}
  .hero-photo{height:90svh;min-height:540px}
  .hero-foot,.ht-row{flex-direction:column;align-items:flex-start;gap:24px}
  .hs-grid,.intro-grid,.ba-grid,.faq-grid,.cta-row,.visit-grid{grid-template-columns:1fr;gap:44px}
  .hero-split,.hero-type{padding:120px 0 72px}
  .intro,.services,.stats,.team,.ba,.faq,.cta-band,.reviews-wall,.prices-board{padding:84px 0}
  .intro-img{aspect-ratio:4/3}
  .stat{border-left:0;padding:16px 0 0}
  .stat-row{grid-template-columns:1fr 1fr;gap:24px}
  .prices-menu,.cta-split{grid-template-columns:1fr}
  .pm-img{position:relative;height:52vh}.pm-body{padding:72px 20px}
  .cta-img{min-height:320px}.cta-body{padding:72px 20px}
  .board .plist{columns:1}
  .services-list .sv li{grid-template-columns:1fr;gap:6px}
  .g-wrap{flex-wrap:wrap;gap:10px}
  .gallery-strip .g0{flex:1 1 100%;height:260px}.gallery-strip .g1,.gallery-strip .g2{flex:1 1 40%;height:300px}
  .gallery-grid .g-wrap{grid-template-columns:1fr 1fr}
  .tr li{grid-template-columns:1fr;gap:10px}
  .more{grid-template-columns:1fr;gap:28px;margin-top:60px}
  .visit{padding-top:90px}
  .foot{grid-template-columns:1fr;gap:26px;padding:44px 20px 28px}
  .wsp-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
}
/* ===== colour & depth: make sites feel real, not monochrome ===== */
/* accent-coloured eyebrows, kickers and stat numbers on light/base sections (where the accent reads) */
.ws-page{counter-reset:wsec}
.on-base .eyebrow,.on-base .kicker{color:var(--accent);opacity:1;counter-increment:wsec}
.on-base .eyebrow::before,.on-base .kicker::before{content:counter(wsec,decimal-leading-zero) "  \\2014  "}
.on-base .num{color:var(--accent)}
.on-base .qa summary::after,.on-base .faq summary::after{color:var(--accent)}
/* a thin accent rule under the hero wordmark divider adds a designed, branded touch */
.hero-photo.hero-noimg .hero-foot,.hero-photo:has(.hero-media.empty) .hero-foot{border-top:2px solid color-mix(in srgb,var(--accent),transparent 42%)}
/* services: real cards with depth and an accent spine, instead of plain text in a row */
.services-grid .sv{gap:26px}
.services-grid .sv li{position:relative;background:color-mix(in srgb,var(--fg),transparent 95%);border:1px solid color-mix(in srgb,var(--fg),transparent 90%);border-radius:16px;padding:32px 28px 30px;overflow:hidden;transition:transform .28s var(--ease),border-color .28s,box-shadow .28s}
.services-grid .sv li::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);opacity:.9}
.services-grid .sv li:hover{transform:translateY(-5px);border-color:color-mix(in srgb,var(--accent),transparent 45%);box-shadow:0 26px 52px -30px rgba(0,0,0,.45)}
.services-grid .sv h3{margin-bottom:10px}
.sv-emo{font-size:42px;margin-bottom:14px}
/* intro statement: a short accent lead-rule so the section is not just floating text */
.intro-center .statement{position:relative;padding-top:30px}
.intro-center .statement::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:46px;height:3px;border-radius:3px;background:var(--accent)}
/* cta band: a soft inner glow so the colour block reads as designed */
.cta-band{position:relative;overflow:hidden}
.cta-band::before{content:"";position:absolute;inset:0;background:radial-gradient(900px 420px at 85% -10%,color-mix(in srgb,var(--pop-text),transparent 88%),transparent 60%);pointer-events:none}
.cta-band .wrap{position:relative;z-index:1}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.js .reveal{opacity:1;transform:none}}
`;
})(globalThis.WS = globalThis.WS || {});

// Page composer: site JSON -> complete HTML document. mode 'live' (published) or 'edit' (inside the editor preview).
(function (WS) {
  const e = WS.esc;
  const camera =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/></svg>';
  const navFor = { prices: 'Prices', services: 'Services', team: 'Team', faq: 'Questions', visit: 'Visit' };

  // Where "Book" buttons go: the owner's booking link, else (multi-page) the Book/Reserve/Quote or Contact page,
  // else the on-page Visit section. '#visit' on a multi-page site would be read by the router as an unknown page.
  WS.bookHref = (site) => {
    const b = (site && site.biz) || {};
    if (b.bookingUrl) return b.bookingUrl;
    if (Array.isArray(site.pages) && site.pages.length > 1) {
      const bp = site.pages.find((pg) => /^(book|reserve|quote)$/.test(pg.path || ''));
      const cp = bp || site.pages.find((pg) => /contact|visit|reach/i.test((pg.path || '') + ' ' + (pg.title || '')));
      return '#/' + ((cp && cp.path) || '');
    }
    return '#visit';
  };

  // Responsive widths for resizable photo hosts (Unsplash), so phones download a ~480px image, not 1680px.
  WS.srcset = (src, sizes) => {
    const s = String(src || '');
    if (!/^https:\/\/images\.unsplash\.com\//.test(s)) return '';
    const at = (w) => (/[?&]w=\d+/.test(s) ? s.replace(/([?&])w=\d+/, '$1w=' + w) : s + (s.indexOf('?') > -1 ? '&' : '?') + 'w=' + w);
    return ` srcset="${[480, 800, 1200, 1680].map((w) => e(at(w)) + ' ' + w + 'w').join(', ')}" sizes="${e(sizes || '100vw')}"`;
  };

  function ctxFor(site, sec, mode) {
    const photos = site.photos || {};
    const key = (k) => sec.id + '.' + k;
    const photo = (k) => photos[key(k)];
    return {
      site, mode, biz: site.biz,
      book: e(WS.bookHref(site)),
      photo,
      slot: (k, { hint = 'Add a photo', cls = '', alt = '' } = {}) => {
        const src = photo(k);
        if (!src && mode === 'live') return `<figure class="slot ${cls} empty" hidden></figure>`;
        return `<figure class="slot ${cls}${src ? '' : ' empty'}" data-slot="${key(k)}">${src ? `<img src="${e(src)}"${WS.srcset(src, '(max-width: 760px) 100vw, 50vw')} alt="${e(alt)}" loading="lazy" decoding="async"${mode === 'live' ? ` onerror="var f=this.closest('figure');if(f)f.style.display='none';"` : ''}>` : ''}${
          mode === 'edit'
            ? `<button class="slot-add" type="button">${camera}<b>${e(hint)}</b><span>Click or drag a photo here</span></button><span class="slot-tools"><button type="button" data-act="replace">Replace</button><button type="button" data-act="remove">Remove</button></span>`
            : ''
        }</figure>`;
      },
      bg: (k, { hint = 'a photo', cls = '' } = {}) => {
        const src = photo(k);
        return `<div class="slot slot-bg ${cls}${src ? '' : ' empty'}" data-slot="${key(k)}">${src ? `<img src="${e(src)}"${WS.srcset(src, '100vw')} alt="" decoding="async" onerror="var p=this.parentNode;if(p){p.classList.add('empty');}this.remove();">` : ''}${
          mode === 'edit' ? `<button class="slot-chip" type="button">${camera}<span>${src ? 'Change' : 'Add'} ${e(hint)}</span></button>` : ''
        }</div>`;
      },
    };
  }

  WS.renderSection = (site, sec, mode) => {
    const def = WS.sections[sec.type];
    if (!def) return '';
    let html = def.render(sec, ctxFor(site, sec, mode)) || '';
    if (!html && mode === 'edit')
      html = `<section class="on-base" style="padding:60px 40px;text-align:center;opacity:.7">${e(def.label)}: nothing to show yet. Add content in the panel.</section>`;
    if (html && !/^\s*<\w+[^>]*\sdata-sec=/.test(html)) html = html.replace(/^(\s*<\w+)/, `$1 data-sec="${e(sec.id)}"`);
    return html;
  };

  // A hash router for multi-page sites: one HTML document, pages shown one at a time via #/path.
  // Capture-phase click handler + stopPropagation so it wins over the studio preview's link blocker.
  WS.pageRouter = `
(function(){
  function run(){
    var pages=[].slice.call(document.querySelectorAll('.ws-page'));
    if(!pages.length)return;
    var BASE=document.title,BRAND=(BASE.split('|')[0]||BASE).trim();
    function path(){return (location.hash||'').replace(/^#\\/?/,'').split('?')[0];}
    function show(pth){
      var found=false,i,active=null;
      for(i=0;i<pages.length;i++){var on=(pages[i].getAttribute('data-path')||'')===pth;if(on){found=true;active=pages[i];}pages[i].classList.toggle('on',on);}
      if(!found){for(i=0;i<pages.length;i++)pages[i].classList.toggle('on',i===0);pth=pages[0].getAttribute('data-path')||'';active=pages[0];}
      try{var pt=active?active.getAttribute('data-title'):'';document.title=(pth&&pt)?(pt+' · '+BRAND):BASE;}catch(e){}
      var links=document.querySelectorAll('[data-page]');
      for(i=0;i<links.length;i++)links[i].classList.toggle('active',(links[i].getAttribute('data-page')||'')===pth);
      try{window.scrollTo(0,0);}catch(e){}
      try{document.body.classList.remove('nav-open');var tgl=document.querySelector('.navtoggle');if(tgl)tgl.setAttribute('aria-expanded','false');}catch(e){}
      try{var t=document.querySelector('[data-top]');if(t){t.classList.remove('solid');t.style.removeProperty('--top-offset');}}catch(e){}
      try{parent.postMessage({ws:true,type:'wsPageShown',path:pth},'*');}catch(e){}
    }
    window.__wsShowPage=show;
    var tg=document.querySelector('.navtoggle');
    if(tg)tg.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();var o=document.body.classList.toggle('nav-open');tg.setAttribute('aria-expanded',o?'true':'false');},true);
    document.addEventListener('click',function(e){
      var a=e.target&&e.target.closest?e.target.closest('a[href^="#/"]'):null;if(!a)return;
      e.preventDefault();e.stopPropagation();
      var pth=(a.getAttribute('href')||'#/').replace(/^#\\/?/,'').split('?')[0];
      if(('#/'+pth)!==location.hash){location.hash='#/'+pth;}else{show(pth);}
    },true);
    window.addEventListener('hashchange',function(){show(path());});
    window.addEventListener('message',function(ev){var m=ev&&ev.data;if(m&&m.ws&&m.type==='wsGoPage'){if(('#/'+(m.path||''))!==location.hash){location.hash='#/'+(m.path||'');}else{show(m.path||'');}}});
    var hasHash=/^#\\//.test(location.hash||'');
    show(hasHash?path():(typeof window.__wsInitPath==='string'?window.__wsInitPath:''));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
`;

  WS.renderSite = (site, { mode = 'live', activePath = null } = {}) => {
    const p = WS.withAccent(WS.palette(site.palette), site.accent);
    const b = site.biz;
    const multi = Array.isArray(site.pages) && site.pages.length > 1;
    let body, nav, top;
    if (multi) {
      const pages = site.pages;
      const home = pages[0] || { sections: [] };
      const annSecs = (home.sections || []).filter((s) => s.type === 'announce' && !s.hidden);
      top = annSecs.map((s) => WS.renderSection(site, s, mode)).join('');
      body = pages.map((pg, idx) => {
        const inner = (pg.sections || []).filter((s) => !s.hidden && s.type !== 'announce')
          .map((s) => WS.renderSection(site, s, mode)).join('\n');
        const on = (activePath != null ? (pg.path || '') === activePath : idx === 0) ? ' on' : '';
        return `<div class="ws-page${on}" data-path="${e(pg.path || '')}" data-title="${e(pg.title || '')}" role="region" aria-label="${e(pg.title || 'Page')}">${inner}</div>`;
      }).join('\n');
      nav = pages.filter((pg) => pg.nav !== false)
        .map((pg) => `<a href="#/${e(pg.path || '')}" data-page="${e(pg.path || '')}">${e(pg.title || 'Home')}</a>`).join('');
    } else {
      const secs = (site.sections || []).filter((s) => !s.hidden);
      const announce = secs.filter((s) => s.type === 'announce');
      const rest = secs.filter((s) => s.type !== 'announce');
      body = rest.map((s) => WS.renderSection(site, s, mode)).join('\n');
      nav = rest.filter((s) => navFor[s.type]).map((s) => `<a href="#${s.type}">${navFor[s.type]}</a>`).join('');
      top = announce.map((s) => WS.renderSection(site, s, mode)).join('');
    }
    const usesEmoji = /notoemoji/.test(body + top);
    const brand = site.brand || 'Websprout';
    const desc = b.seoDescription || b.tagline || '';
    const pillHref = WS.bookHref(site);
    // Stock photos (Unsplash) must credit the photographer; only credit photos the site still uses.
    const _pc = site.photoCredits || {}; const _used = site.photos || {}; const _seenPc = {};
    const _pcl = Object.keys(_pc).filter((k) => _used[k] && _pc[k] && _pc[k].name && !_seenPc[_pc[k].name] && (_seenPc[_pc[k].name] = 1));
    const _utm = 'utm_source=websprout&utm_medium=referral';
    const photoCredit = _pcl.length ? ` &nbsp;·&nbsp; Photos by ${_pcl.slice(0, 6).map((k) => `<a href="${e(String(_pc[k].link || 'https://unsplash.com').split('?')[0] + '?' + _utm)}">${e(_pc[k].name)}</a>`).join(', ')} on <a href="https://unsplash.com/?${_utm}">Unsplash</a>` : '';
    const markHref = multi ? '#/' : '#';
    const routerInit = (multi && activePath != null) ? `window.__wsInitPath=${JSON.stringify(activePath)};` : '';
    const runtime = WS.runtime(site) + (multi ? routerInit + WS.pageRouter : '');
    // Hero photo (for social preview) + a generated favicon monogram + LocalBusiness structured data.
    let heroPhoto = '';
    try {
      const allSecs = multi ? (site.pages[0] && site.pages[0].sections) || [] : (site.sections || []);
      const h = allSecs.find((s) => s.type === 'hero');
      if (h) heroPhoto = (site.photos || {})[h.id + '.photo'] || '';
    } catch (_e) {}
    const initial = e((b.name || 'W').trim().charAt(0).toUpperCase() || 'W');
    const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${p.accent}"/><text x="32" y="45" font-family="Inter,Arial,sans-serif" font-size="38" font-weight="700" text-anchor="middle" fill="${p.accentText}">${initial}</text></svg>`;
    const favicon = `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favSvg)}">`;
    const social = `<meta property="og:type" content="website"><meta property="og:site_name" content="${e(b.name)}">${heroPhoto ? `<meta property="og:image" content="${e(heroPhoto)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${e(heroPhoto)}">` : `<meta name="twitter:card" content="summary">`}`;
    let ldScript = '';
    try {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const ld = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: b.name };
      if (desc) ld.description = desc;
      if (b.phone) ld.telephone = b.phone;
      if (b.address || b.city) { ld.address = { '@type': 'PostalAddress' }; if (b.address) ld.address.streetAddress = b.address; if (b.city) ld.address.addressLocality = b.city; }
      if (heroPhoto) ld.image = heroPhoto;
      if (b.instagram) ld.sameAs = ['https://instagram.com/' + b.instagram];
      if (Array.isArray(b.hours) && b.hours.length) {
        const oh = [];
        b.hours.forEach((hr, i) => { if (hr && hr.open && hr.close) oh.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: dayNames[i] || hr.d, opens: hr.open, closes: hr.close }); });
        if (oh.length) ld.openingHoursSpecification = oh;
      }
      ldScript = `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
    } catch (_l) {}
    // Type theme: fonts + CSS custom-prop overrides (bold / editorial / clean), picked per category at generation.
    const tt = (WS.typeTheme ? WS.typeTheme(site.typeset) : null) || { fonts: WS.styleFonts, vars: {} };
    const ttFonts = (tt.fonts && tt.fonts.length) ? tt.fonts : WS.styleFonts;
    const ttVars = Object.keys(tt.vars || {}).map((k) => k + ':' + tt.vars[k]).join(';');
    const ttClass = ' wst-' + e(site.typeset || 'bold');
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${b.seoTitle ? e(b.seoTitle) : e(b.name) + (b.city ? ' | ' + e(b.type || '') + ' in ' + e(b.city) : '')}</title>
<meta name="description" content="${e(desc)}">
<meta name="theme-color" content="${p.base}">
${favicon}
<meta property="og:title" content="${e(b.name)}"><meta property="og:description" content="${e(desc)}">
${social}
${ldScript}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${ttFonts.map((f) => 'family=' + f).join('&')}&display=swap">
<style>:root{${WS.paletteCss(p)};${ttVars}}${WS.styleCss}${WS.emojiCss}${ttVars ? `body{${ttVars};font-family:var(--body)}` : ''}</style>
</head>
<body class="es-${e(site.emojiStyle || 'color')}${ttClass}${/^(sharp|soft|round)$/.test(site.corners || '') ? ' wsr-' + site.corners : ''}${mode === 'edit' ? ' edit' : ''}${multi ? ' multipage' : ''}${top ? ' has-announce' : ''}">
${top}
<header class="top" data-top><a class="mark${b.logo ? ' has-logo' : ''}" href="${markHref}">${/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/.test(b.logo || '') || /^https:\/\//.test(b.logo || '') ? `<img class="mark-logo" src="${e(b.logo)}" alt="${e(b.name)}">` : e(b.name)}</a><nav aria-label="Main">${nav}</nav><a class="pill" href="${e(pillHref)}">${e(b.bookShort || 'Book')}</a>${multi ? '<button class="navtoggle" type="button" aria-label="Menu" aria-expanded="false"><svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true"><path d="M3 7h17M3 11.5h17M3 16h17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' : ''}</header>
<main>
${body}
</main>
<footer class="foot"><div class="foot-brand"><b>${e(b.name)}</b>${b.tagline ? `<p>${e(b.tagline)}</p>` : (b.type ? `<p>${e(b.type)}${b.city ? ' in ' + e(b.city) : ''}</p>` : '')}</div>${multi ? `<nav class="foot-col" aria-label="Pages"><h4>Pages</h4>${site.pages.filter((pg) => pg.nav !== false).map((pg) => `<a href="#/${e(pg.path || '')}">${e(pg.title || 'Home')}</a>`).join('')}</nav>` : `<div class="foot-col"></div>`}<div class="foot-col"><h4>Contact</h4>${b.phone ? `<a href="${WS.tel(b.phone)}">${e(b.phone)}</a>` : ''}${b.email ? `<a href="mailto:${e(b.email)}">${e(b.email)}</a>` : ''}${b.address ? `<a href="${WS.map(b.address)}">${e(b.address)}</a>` : (b.city ? `<span>${e(b.city)}</span>` : '')}${b.instagram ? `<a href="https://instagram.com/${e(b.instagram)}">Instagram</a>` : ''}<a href="${e(pillHref)}">${e(b.bookLabel || 'Get in touch')}</a></div></footer>
<p class="credits"><a href="https://websprout.app/?ref=site">Made with ${e(brand)}</a>${photoCredit}${usesEmoji ? ` &nbsp;·&nbsp; Animated emoji: <a href="https://googlefonts.github.io/noto-emoji-animation/">Noto Emoji by Google</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>` : ''}</p>
<script>${runtime}${mode === 'edit' ? WS.editBridge : ''}</script>
</body>
</html>`;
  };

  // Runs on the published site (and in the preview): hours status, live stats, count-up, sliders, scroll effects.
  WS.runtime = (site) => `
document.documentElement.classList.add('js');document.body.classList.add('js');
(function(){
  var HOURS=${JSON.stringify(site.biz.hours || []).replace(/</g, '\\u003c')},WALKIN=${site.biz.walkIns ? 'true' : 'false'},EDIT=document.body.classList.contains('edit');
  var STATS_API=${JSON.stringify(site.statsApi || (site.biz && site.biz.googlePlaceId ? 'https://websprout.app/api/place' : '')).replace(/</g, '\\u003c')},PLACE=${JSON.stringify(site.biz.googlePlaceId || '').replace(/</g, '\\u003c')};
  var top=document.querySelector('[data-top]'),ann=document.querySelector('.announce');
  function onScroll(){var y=window.scrollY;top.classList.toggle('solid',y>60);if(ann)top.style.setProperty('--top-offset',Math.max(0,ann.offsetHeight-y)+'px')}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
  function seen(els,fn){if(!('IntersectionObserver' in window)||EDIT){els.forEach(fn);return}var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){fn(x.target);io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px'});els.forEach(function(el){io.observe(el)})}
  seen(document.querySelectorAll('.reveal'),function(el){el.classList.add('in')});
  // open / closed status
  function f(t){var p=t.split(':'),h=+p[0],m=p[1];var s=h>=12?'pm':'am';h=h%12||12;return h+(m!=='00'?':'+m:'')+' '+s}
  function toM(t){var p=String(t||'0:0').split(':');return (+p[0]||0)*60+(+p[1]||0)}
  var now=new Date(),d=(now.getDay()+6)%7,mins=now.getHours()*60+now.getMinutes();
  document.querySelectorAll('.hours').forEach(function(t){var r=t.querySelectorAll('tr');if(r[d])r[d].classList.add('today')});
  document.querySelectorAll('[data-status]').forEach(function(el){
    if(!HOURS.length)return;var t=HOURS[d];
    if(t&&t.open&&t.close&&(toM(t.close)>toM(t.open)?(mins>=toM(t.open)&&mins<toM(t.close)):(mins>=toM(t.open)||mins<toM(t.close)))){el.innerHTML='<b>Open now</b> until '+f(t.close)+(WALKIN?'. Walk-ins welcome':'');return}
    for(var i=0;i<8;i++){var k=(d+i)%7,h=HOURS[k];if(h&&h.open&&(i>0||mins<toM(h.open))){el.innerHTML='<b>Closed now.</b> Opens '+(i===0?'today':i===1?'tomorrow':h.d)+' at '+f(h.open);return}}
  });
  // stats: years update themselves; Google numbers come live from the stats API, typed numbers stay as typed
  var nums=[].slice.call(document.querySelectorAll('[data-count]'));
  nums.forEach(function(el){if(el.dataset.src==='years'&&el.dataset.founded){el.dataset.count=String(new Date().getFullYear()-(+el.dataset.founded));el.textContent=el.dataset.count}});
  function fmt(v,dec){return v.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})}
  function count(el){var target=parseFloat(el.dataset.count);if(isNaN(target)||EDIT){return}var dec=(el.dataset.count.split('.')[1]||'').length,t0=null,dur=1400;
    function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),v=target*(1-Math.pow(1-k,3));el.textContent=fmt(v,dec);if(k<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
  function startCounts(){seen(nums,count)}
  var live=nums.filter(function(el){return /^google_/.test(el.dataset.src)});
  if(live.length&&STATS_API&&PLACE&&!EDIT){
    fetch(STATS_API+'?place='+encodeURIComponent(PLACE)).then(function(r){return r.ok?r.json():null}).then(function(j){
      if(j)live.forEach(function(el){var v=el.dataset.src==='google_rating'?j.rating:j.reviews;if(v!=null){el.dataset.count=String(v);el.textContent=fmt(+v,(String(v).split('.')[1]||'').length)}});
    }).catch(function(){}).then(startCounts);
  } else startCounts();
  // live Google reviews (needs a linked place; falls back to the typed reviews already on the page)
  (function(){var box=document.querySelector('[data-greviews]');if(!box||!STATS_API||!PLACE||EDIT)return;
    fetch(STATS_API+'?place='+encodeURIComponent(PLACE)).then(function(r){return r.ok?r.json():null}).then(function(j){
      if(!j||!j.items||!j.items.length)return;
      var rw=box.querySelector('.rw'),sum=box.querySelector('.gr-sum'),at=box.querySelector('.gr-attr');
      function star(n){var o='';for(var i=0;i<5;i++)o+=i<Math.round(n)?'★':'☆';return o}
      function esc(s){return String(s==null?'':s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;')}
      rw.innerHTML=j.items.map(function(v){return '<blockquote><div class="gr-stars" aria-label="'+v.rating+' out of 5 stars">'+star(v.rating)+'</div><p>'+esc(v.text.length>320?v.text.slice(0,317)+'…':v.text)+'</p><footer>'+esc(v.name)+(v.when?' · '+esc(v.when):'')+'</footer></blockquote>'}).join('');
      if(j.rating&&sum){sum.hidden=false;sum.innerHTML='<b>'+j.rating.toFixed(1)+'</b> <span class="gr-stars">'+star(j.rating)+'</span> <span>'+(j.reviews||0).toLocaleString()+' Google reviews</span>'}
      if(at){at.hidden=false;at.innerHTML='Reviews from Google'+(j.url?' · <a href="'+esc(j.url)+'" target="_blank" rel="noopener">See all on Google</a>':'')}
    }).catch(function(){});
  })();
  // before / after sliders
  document.querySelectorAll('[data-ba]').forEach(function(fr){var r=fr.querySelector('.ba-range');if(r)r.addEventListener('input',function(){fr.style.setProperty('--x',r.value+'%')})});
  // contact form -> POST to the owner's inbox (only on the real published site, not the studio preview iframe)
  try{var inFrame=false;try{inFrame=window.self!==window.top;}catch(_f){inFrame=true;}
    if(!inFrame&&!EDIT){document.querySelectorAll('form[data-wsform]').forEach(function(f){
      f.addEventListener('submit',function(ev){ev.preventDefault();
        var url=f.getAttribute('action'),ok=f.querySelector('[data-wfok]'),btn=f.querySelector('button[type=submit]'),ot=btn?btn.textContent:'';
        var fd={};new FormData(f).forEach(function(v,k){fd[k]=v;});
        if(!url){f.reset();if(ok)ok.hidden=false;return;}
        if(btn){btn.disabled=true;btn.textContent='Sending…';}
        fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fd)}).then(function(r){return r.json().catch(function(){return{ok:r.ok};});}).then(function(j){
          if(j&&j.ok){f.reset();if(ok)ok.hidden=false;if(btn)btn.textContent='Sent ✓';}
          else{if(btn){btn.disabled=false;btn.textContent=ot;}alert((j&&j.error==='rate')?'Too many messages right now — please try again later.':'Sorry, that did not go through. Please try again.');}
        }).catch(function(){if(btn){btn.disabled=false;btn.textContent=ot;}alert('Sorry, that did not go through. Please try again.');});
      });
    });}
  }catch(e){}
  // service-area ZIP checker
  try{document.querySelectorAll('[data-sa-check]').forEach(function(f){
    f.addEventListener('submit',function(ev){ev.preventDefault();
      var zips=[];try{zips=JSON.parse(f.getAttribute('data-sa-zips')||'[]');}catch(e){}
      var inp=f.querySelector('input[name=zip]');var v=((inp&&inp.value)||'').replace(/[^0-9]/g,'').slice(0,5);
      var wrap=f.parentNode,res=wrap&&wrap.querySelector('[data-sa-result]');if(!res)return;
      if(v.length<5){res.textContent='Please enter a 5-digit ZIP code.';res.className='sa-result sa-warn';}
      else{var ok=zips.indexOf(v)>-1;res.textContent=ok?(f.getAttribute('data-sa-yes')||'We serve your area!'):(f.getAttribute('data-sa-no')||'Not in your area yet.');res.className='sa-result '+(ok?'sa-yes':'sa-no');}
      res.hidden=false;
    });
  });}catch(e){}
  // back-to-top button (appears after scrolling)
  try{if(!document.querySelector('.ws-top')){var bt=document.createElement('button');bt.className='ws-top';bt.type='button';bt.setAttribute('aria-label','Back to top');bt.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';bt.addEventListener('click',function(){try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){window.scrollTo(0,0)}});document.body.appendChild(bt);var bts=function(){bt.classList.toggle('on',(window.scrollY||window.pageYOffset||0)>700)};window.addEventListener('scroll',bts,{passive:true});bts();}}catch(e){}
})();
`;

  // Editor-only bridge inside the preview frame: photo uploads + section selection go to the editor panel.
  WS.editBridge = `
(function(){
  var picker=document.createElement('input');picker.type='file';picker.accept='image/*';picker.hidden=true;document.body.appendChild(picker);var target=null;
  function send(m){parent.postMessage(Object.assign({ws:true},m),'*')}
  function shrink(file,cb){if(!file||!/^image\\//.test(file.type))return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var max=1800,s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(file)}
  picker.addEventListener('change',function(){var f=picker.files[0];if(f&&target)shrink(f,function(src){send({type:'photo',key:target,src:src})});picker.value=''});
  document.addEventListener('click',function(ev){
    var a=ev.target.closest('a');if(a)ev.preventDefault();
    var slot=ev.target.closest('[data-slot]'),b=ev.target.closest('button');
    if(slot&&b){ev.stopPropagation();if(b.dataset.act==='remove'){send({type:'photo',key:slot.dataset.slot,src:null});return}target=slot.dataset.slot;picker.click();return}
    var sec=ev.target.closest('[data-sec]');if(sec)send({type:'select',id:sec.dataset.sec});
  },true);
  document.querySelectorAll('[data-slot]').forEach(function(el){
    el.addEventListener('dragover',function(e){e.preventDefault();el.classList.add('drag')});
    el.addEventListener('dragleave',function(){el.classList.remove('drag')});
    el.addEventListener('drop',function(e){e.preventDefault();el.classList.remove('drag');shrink(e.dataTransfer.files[0],function(src){send({type:'photo',key:el.dataset.slot,src:src})})});
  });
  window.addEventListener('message',function(ev){var m=ev.data||{};if(!m.wsSel)return;document.querySelectorAll('[data-sec].sel').forEach(function(x){x.classList.remove('sel')});var el=document.querySelector('[data-sec="'+m.id+'"]');if(el){el.classList.add('sel');if(m.scroll)el.scrollIntoView({behavior:'smooth',block:'start'})}});
  send({type:'ready'});
})();
`;

  // Build a starter site for a business: a good default stack of sections written from its own details.
  WS.starterSite = (biz, opts = {}) => {
    const site = { biz, palette: opts.palette || 'bottle', emojiStyle: opts.emojiStyle || 'soft', photos: {}, sections: [], statsApi: opts.statsApi || '' };
    const stack = opts.stack || ['hero', 'intro', 'stats', 'prices', 'gallery', 'team', 'reviews', 'faq', 'cta', 'visit'];
    site.sections = stack.map((type) => ({ id: type + '-' + WS.uid(), type, ...WS.sections[type].create(site) }));
    return site;
  };
})(globalThis.WS = globalThis.WS || {});

  return __ws;
})();
// ===== END v3 ENGINE =====









