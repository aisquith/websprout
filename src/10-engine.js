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
  // Map embeds use Google's official Maps Embed API, which needs a key: WS.mapsKey (set by whoever renders, e.g. the
  // server from GOOGLE_MAPS_EMBED_KEY) or site.mapsEmbedKey. Without one there is no iframe, only a directions link;
  // a published page whose <head> carries <meta name="ws-maps-key" content="KEY"> upgrades that link to a map.
  WS.mapsKey = '';
  WS.mapEmbed = (a = '', key = WS.mapsKey) => (key ? 'https://www.google.com/maps/embed/v1/place?key=' + encodeURIComponent(key) + '&q=' + encodeURIComponent(a) : '');
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
  // Owner-typed text: trimmed string ('' for whitespace-only / missing).
  WS.str = (v) => (v == null || typeof v === 'object' ? '' : String(v).trim());
  WS.titleCase = (s = '') => String(s).replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  // List items with at least one non-blank field (of `keys`); keeps the original index (photo slots are index-based).
  WS.filled = (items, keys) => (Array.isArray(items) ? items : []).map((it, i) => ({ it, i })).filter((x) => x.it && typeof x.it === 'object' && keys.some((k) => WS.str(x.it[k]) !== ''));
  // Owner-typed links: bare domains get https://; only http(s), mailto:, tel:, #anchors, #/pages and relative
  // site paths survive; anything else (javascript:, data:, vbscript:...) returns '' so the link is dropped.
  WS.safeUrl = (u) => {
    const s = WS.str(u);
    if (!s) return '';
    const t = s.replace(/[\s\u0000-\u001f\u007f]+/g, '');
    if (/^#/.test(t)) return s;
    if (/^(https?:\/\/|mailto:|tel:)/i.test(t)) return /^(https?:\/\/)/i.test(t) && t.length < 10 ? '' : s;
    if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return '';
    if (/^\/\//.test(t)) return 'https:' + t;
    const isFile = /^[^/?#]+\.(html?|php|aspx?|jpe?g|png|gif|webp|svg|pdf)([?#].*)?$/i.test(t);
    if (!isFile && /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(:\d+)?([/?#].*)?$/i.test(t)) return 'https://' + t;
    if (/^(\.{0,2}\/)?[a-z0-9._~%-]+(\/[a-z0-9._~%-]*)*([?#].*)?$/i.test(t) || /^\/[^/]?/.test(t)) return t;
    return '';
  };
  // Instagram: accepts @handle, handle or a pasted profile URL; returns the bare handle ('' if not valid).
  WS.igHandle = (v) => {
    let s = WS.str(v).replace(/^https?:\/\//i, '').replace(/^(www\.|m\.)?instagr(am\.com|\.am)\//i, '').replace(/^@+/, '');
    s = s.split(/[/?#]/)[0];
    return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s : '';
  };
  // A price as a positive number (first amount after a currency sign, else the first number), or NaN.
  WS.priceNum = (v) => {
    const s = String(v == null ? '' : v).replace(/(\d),(?=\d{3}\b)/g, '$1');
    const c = s.match(/[$£€]\s*(\d+(?:\.\d{1,2})?)/);
    const m = c ? [c[1]] : s.match(/\d+(?:\.\d{1,2})?/);
    const n = m ? parseFloat(m[0]) : NaN;
    return isFinite(n) && n > 0 ? n : NaN;
  };
  // Business name with a sensible fallback (title-cased slug, then the business type).
  WS.bizName = (site) => { const b = (site && site.biz) || {}; return WS.str(b.name) || WS.titleCase(WS.str(site && site.slug)) || WS.str(b.type) || 'Welcome'; };
  // Automatic logo (no uploaded logo): site.logoMark = { style: 'wordmark'|'icon'|'monogram'|'badge', icon: '<line icon>' }.
  WS.logoStyles = [['wordmark', 'Wordmark'], ['icon', 'Icon + name'], ['monogram', 'Monogram'], ['badge', 'Badge']];
  WS.logoMarkOf = (site) => {
    const m = (site && site.logoMark && typeof site.logoMark === 'object') ? site.logoMark : {};
    const style = /^(wordmark|icon|monogram|badge)$/.test(m.style) ? m.style : 'wordmark';
    const t = String((site && site.biz && site.biz.type) || '').toLowerCase();
    const ty = WS.ICON_TYPES ? WS.ICON_TYPES.find((x) => x[0].test(t)) : null;
    return { style, icon: WS.ICONS && WS.ICONS[m.icon] ? m.icon : (ty ? ty[1] : 'sparkle') };
  };
  // Initials for a monogram: first letters of the first two real words ("Hartley & Reed" -> HR, "Bloom" -> B).
  WS.initials = (name = '') => {
    const w = String(name).replace(/[^\p{L}\p{N}\s'-]/gu, ' ').split(/\s+/).filter((x) => x && !/^(the|and|of|a|an|co|llc|inc|ltd)$/i.test(x));
    const ch = (x) => Array.from(x)[0] || '';
    return (w.length > 1 ? ch(w[0]) + ch(w[1]) : ch(w[0] || String(name).trim() || 'W')).toUpperCase();
  };
  // The pages a site really renders: site.pages when present (even with one page), else null (legacy site.sections).
  WS.pagesOf = (site) => (site && Array.isArray(site.pages) && site.pages.length ? site.pages : null);
  // Sections of the one-page layout (pages[0] when pages exist, else the legacy flat list).
  WS.layoutSections = (site) => { const p = WS.pagesOf(site); return ((p ? p[0] && p[0].sections : site && site.sections) || []).filter((s) => s && !s.hidden); };
  WS.words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  WS.streetOf = (addr = '') =>
    (String(addr).split(',')[0] || '')
      .replace(/^\d+\s+/, '')
      .replace(/^(N|S|E|W|North|South|East|West)\.?\s+/i, '')
      .replace(/\.+$/, '')
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
  WS.contrast = (a, b) => { const x = WS.lum(a), y = WS.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  WS.hexToHsl = (hex) => {
    const h = String(hex || '').replace('#', ''); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const hue = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [hue * 60, s, l];
  };
  WS.hslToHex = (hh, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((hh / 60) % 2) - 1)), m = l - c / 2;
    const [r, g, b] = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
    return '#' + [r, g, b].map((v) => ('0' + Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16)).slice(-2)).join('').toUpperCase();
  };
  // Same hue, lightness nudged (darker on light backgrounds, lighter on dark ones) until it reaches `min` contrast.
  WS.fitContrast = (hex, bg, min) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(String(hex || '')) || !/^#[0-9a-fA-F]{6}$/.test(String(bg || '')) || WS.contrast(hex, bg) >= min) return hex;
    const [h, s, l0] = WS.hexToHsl(hex); const dir = WS.lum(bg) > 0.18 ? -1 : 1;
    for (let l = l0; l >= 0 && l <= 1; l += dir * 0.01) { const c = WS.hslToHex(h, s, l); if (WS.contrast(c, bg) >= min) return c; }
    return dir < 0 ? '#111111' : '#FFFFFF';
  };
  // A custom brand color replaces the theme's accent (buttons, highlights, color bands). Text on it switches
  // between near-black and white; a mid-tone that neither can read on (AA 4.5:1) is nudged until one can.
  // accentInk is the same hue made readable as text/outline on the page background.
  WS.withAccent = (p, hex) => {
    if (!p || !/^#[0-9a-fA-F]{6}$/.test(String(hex || ''))) return p;
    let on = WS.lum(hex) > 0.179 ? '#111111' : '#FFFFFF';
    if (WS.contrast(hex, on) < 4.5) hex = WS.fitContrast(hex, on, 4.5);
    on = WS.lum(hex) > 0.179 ? '#111111' : '#FFFFFF';
    return Object.assign({}, p, { accent: hex, accentText: on, pop: hex, popText: on, price: hex, accentInk: WS.fitContrast(hex, p.base, 4.5) });
  };
  // Mix two colors (t = share of b, 0..1).
  WS.mixHex = (a, b, t) => { const h = (x) => String(x || '').replace('#', ''); const A = h(a), B = h(b); if (A.length !== 6 || B.length !== 6) return a; return '#' + [0, 2, 4].map((i) => ('0' + Math.round(parseInt(A.slice(i, i + 2), 16) * (1 - t) + parseInt(B.slice(i, i + 2), 16) * t).toString(16)).slice(-2)).join('').toUpperCase(); };
  WS.isDark = (p) => WS.lum(p.base) < 0.2;
  // A dark theme whose alt band is barely different from its base (the Noir twins): alt reads as "the same color".
  WS.altWeak = (p) => WS.contrast(p.alt, p.base) < 1.25;
  // Section tones besides base / alt / pop: "soft" is a clearly different band used for page rhythm. On a light theme
  // it's a light tint of the accent; on a dark theme an inverted light band (dark text) so long dark pages break up.
  WS.softTone = (p) => {
    const soft = WS.isDark(p) ? WS.mixHex(p.baseText, p.accent, 0.06) : WS.mixHex(p.base, p.accent, 0.07);
    const softText = WS.isDark(p) ? (WS.contrast(p.base, soft) >= 7 ? p.base : '#141414') : p.baseText;
    // Buttons keep the accent unless it disappears into the band (white accent on a near-white band): then ink.
    const btnOk = WS.contrast(p.accent, soft) >= 2.2;
    return { soft, softText, softInk: WS.fitContrast(p.accent, soft, 4.5), softSurface: WS.mixHex(soft, softText, 0.07), softBtn: btnOk ? p.accent : softText, softBtnText: btnOk ? p.accentText : soft };
  };
  WS.paletteCss = (p) => { const st = WS.softTone(p); const alt = WS.isDark(p) && WS.altWeak(p) ? WS.mixHex(p.base, p.baseText, 0.1) : p.alt; return WS.paletteCss0(Object.assign({}, p, { alt })) + `;--soft:${st.soft};--soft-text:${st.softText};--soft-ink:${st.softInk};--soft-surface:${st.softSurface};--soft-btn:${st.softBtn};--soft-btn-text:${st.softBtnText}`; };
  WS.paletteCss0 = (p) =>
    `--base:${p.base};--base-text:${p.baseText};--alt:${p.alt};--alt-text:${p.altText};--accent:${p.accent};--accent-text:${p.accentText};--accent-ink:${p.accentInk || WS.fitContrast(p.accent, p.base, 4.5)};--pop:${p.pop};--pop-text:${p.popText};--surface:${p.surface};--price:${p.price || p.pop};--alt-ink:${WS.fitContrast(p.accent, p.alt, 4.5)};--pop-ink:${p.pop === p.accent ? p.popText : WS.fitContrast(p.accent, p.pop, 4.5)}`;
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
  function theme(key, name, warm, aLight, aTint, aDark, aDarkText, tint) {
    // tint: an optional lightly colored page (sage paper, warm clay) instead of plain white.
    const wBase = tint || (warm ? '#FCFAF6' : '#FAFBFC'), wSurf = tint ? WS.mixHex(tint, aLight, 0.07) : (warm ? '#F0ECE3' : '#EDEFF2');
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
  // Category colors beyond blue: deep greens for gardens and law, clay and berry for florists and studios, navy for
  // trades, olive and lagoon for wellness and pets, oxblood for barbers and steakhouses (contrast-checked like the rest).
  theme('forest', 'Forest', true, '#2E6844', '#9FD6AE', '#6CC48A', '#06170C', '#F6F7F2');
  theme('sage', 'Sage', true, '#4A6852', '#B9D3BE', '#9CC4A6', '#0C1A10', '#F4F5EF');
  theme('navy', 'Navy', false, '#1E3D6B', '#A8C2EA', '#86AEEB', '#08121F', '#F7F8FA');
  theme('clay', 'Clay', true, '#A04B36', '#F0B19D', '#E8957C', '#2A0F07', '#FBF5F1');
  theme('berry', 'Berry', true, '#962D5B', '#F2A7C6', '#EE8DB6', '#2A0816', '#FCF7F8');
  theme('olive', 'Olive', true, '#5C6A1C', '#C9D68A', '#B5C766', '#151A04', '#F8F8F1');
  theme('lagoon', 'Lagoon', false, '#0A6A7D', '#86D3E2', '#4FC2D8', '#04191E', '#F5FAFA');
  theme('oxblood', 'Oxblood', true, '#7C2333', '#E8A3AE', '#DE7A5E', '#2A0910', '#FBF7F5');

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
  // Named emoji are announced as images; ones without a known name are decorative and hidden from screen readers.
  WS.emoji = (code, cls = '') =>
    code
      ? `<span class="emo ${cls}" ${WS.emojiName(code) ? `role="img" aria-label="${WS.esc(WS.emojiName(code))}"` : 'aria-hidden="true"'}><img src="${WS.emojiUrl(code)}" alt="" loading="lazy" decoding="async" onerror="this.replaceWith(document.createTextNode('${WS.emojiChar(code)}'))"></span>`
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

// Line icons for service / feature cards: a curated subset of Lucide (https://lucide.dev).
//   Lucide License (ISC). Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather
//   (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022. Permission to use, copy, modify,
//   and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above
//   copyright notice and this permission notice appear in all copies. THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR
//   DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.
//   "tooth", "razor" and "yoga" are from Tabler Icons (https://tabler.io/icons), MIT License, Copyright (c) 2020-2024
//   Paweł Kuna: permission is granted free of charge to use, copy, modify, merge, publish and distribute, provided this
//   notice is included; provided "as is", without warranty of any kind.
// All are 24x24 with round strokes, so they share one look. site.iconStyle: 'line' (these icons) or 'emoji'.
// Unset (sites made before icons existed): line only when every card emoji on the site maps to an icon.
(function (WS) {
  WS.ICONS = {
    "anchor": "<path d='M12 22V8'/><path d='M5 12H2a10 10 0 0 0 20 0h-3'/><circle cx='12' cy='5' r='3'/>",
    "app-window": "<rect x='2' y='4' width='20' height='16' rx='2'/><path d='M10 4v4'/><path d='M2 8h20'/><path d='M6 4v4'/>",
    "baby": "<path d='M9 12h.01'/><path d='M15 12h.01'/><path d='M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5'/><path d='M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1'/>",
    "backpack": "<path d='M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'/><path d='M8 10h8'/><path d='M8 18h8'/><path d='M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6'/><path d='M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/>",
    "award": "<path d='m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'/><circle cx='12' cy='8' r='6'/>",
    "badge-check": "<path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z'/><path d='m9 12 2 2 4-4'/>",
    "bath": "<path d='M10 4 8 6'/><path d='M17 19v2'/><path d='M2 12h20'/><path d='M7 19v2'/><path d='M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5'/>",
    "bed-double": "<path d='M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8'/><path d='M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4'/><path d='M12 4v6'/><path d='M2 18h20'/>",
    "beef": "<circle cx='12.5' cy='8.5' r='2.5'/><path d='M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z'/><path d='m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5'/>",
    "beer": "<path d='M17 11h1a3 3 0 0 1 0 6h-1'/><path d='M9 12v6'/><path d='M13 12v6'/><path d='M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z'/><path d='M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8'/>",
    "bike": "<circle cx='18.5' cy='17.5' r='3.5'/><circle cx='5.5' cy='17.5' r='3.5'/><circle cx='15' cy='5' r='1'/><path d='M12 17.5V14l-3-3 4-3 2 3h2'/>",
    "bird": "<path d='M16 7h.01'/><path d='M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20'/><path d='m20 7 2 .5-2 .5'/><path d='M10 18v3'/><path d='M14 17.75V21'/><path d='M7 18a6 6 0 0 0 3.84-10.61'/>",
    "blocks": "<rect width='7' height='7' x='14' y='3' rx='1'/><path d='M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3'/>",
    "bone": "<path d='M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z'/>",
    "book-open": "<path d='M12 7v14'/><path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'/>",
    "brick-wall": "<rect width='18' height='18' x='3' y='3' rx='2'/><path d='M12 9v6'/><path d='M16 15v6'/><path d='M16 3v6'/><path d='M3 15h18'/><path d='M3 9h18'/><path d='M8 15v6'/><path d='M8 3v6'/>",
    "briefcase": "<path d='M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/><rect width='20' height='14' x='2' y='6' rx='2'/>",
    "brush": "<path d='m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08'/><path d='M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z'/>",
    "bug": "<path d='m8 2 1.88 1.88'/><path d='M14.12 3.88 16 2'/><path d='M9 7.13v-1a3.003 3.003 0 1 1 6 0v1'/><path d='M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6'/><path d='M12 20v-9'/><path d='M6.53 9C4.6 8.8 3 7.1 3 5'/><path d='M6 13H2'/><path d='M3 21c0-2.1 1.7-3.9 3.8-4'/><path d='M20.97 5c0 2.1-1.6 3.8-3.5 4'/><path d='M22 13h-4'/><path d='M17.2 17c2.1.1 3.8 1.9 3.8 4'/>",
    "building-2": "<path d='M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z'/><path d='M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2'/><path d='M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2'/><path d='M10 6h4'/><path d='M10 10h4'/><path d='M10 14h4'/><path d='M10 18h4'/>",
    "cake": "<path d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8'/><path d='M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1'/><path d='M2 21h20'/><path d='M7 8v3'/><path d='M12 8v3'/><path d='M17 8v3'/><path d='M7 4h.01'/><path d='M12 4h.01'/><path d='M17 4h.01'/>",
    "cake-slice": "<circle cx='9' cy='7' r='2'/><path d='M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6'/><path d='M16 13H3'/><path d='M16 17H3'/>",
    "calendar": "<path d='M8 2v4'/><path d='M16 2v4'/><rect width='18' height='18' x='3' y='4' rx='2'/><path d='M3 10h18'/>",
    "calendar-check": "<path d='M8 2v4'/><path d='M16 2v4'/><rect width='18' height='18' x='3' y='4' rx='2'/><path d='M3 10h18'/><path d='m9 16 2 2 4-4'/>",
    "camera": "<path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'/><circle cx='12' cy='13' r='3'/>",
    "car": "<path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2'/><circle cx='7' cy='17' r='2'/><path d='M9 17h6'/><circle cx='17' cy='17' r='2'/>",
    "cat": "<path d='M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z'/><path d='M8 14v.5'/><path d='M16 14v.5'/><path d='M11.25 16.25h1.5L12 17l-.75-.75Z'/>",
    "chart-column": "<path d='M3 3v16a2 2 0 0 0 2 2h16'/><path d='M18 17V9'/><path d='M13 17V5'/><path d='M8 17v-3'/>",
    "chef-hat": "<path d='M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z'/><path d='M6 17h12'/>",
    "church": "<path d='m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2'/><path d='M14 22v-4a2 2 0 0 0-4 0v4'/><path d='M18 22V5l-6-3-6 3v17'/><path d='M12 7v5'/><path d='M10 9h4'/>",
    "circle-check": "<circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/>",
    "clipboard-list": "<rect width='8' height='4' x='8' y='2' rx='1' ry='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><path d='M8 11h.01'/><path d='M8 16h.01'/>",
    "clock": "<circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/>",
    "coffee": "<path d='M10 2v2'/><path d='M14 2v2'/><path d='M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1'/><path d='M6 2v2'/>",
    "cog": "<path d='M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z'/><path d='M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'/><path d='M12 2v2'/><path d='M12 22v-2'/><path d='m17 20.66-1-1.73'/><path d='M11 10.27 7 3.34'/><path d='m20.66 17-1.73-1'/><path d='m3.34 7 1.73 1'/><path d='M14 12h8'/><path d='M2 12h2'/><path d='m20.66 7-1.73 1'/><path d='m3.34 17 1.73-1'/><path d='m17 3.34-1 1.73'/><path d='m11 13.73-4 6.93'/>",
    "compass": "<path d='m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z'/><circle cx='12' cy='12' r='10'/>",
    "cookie": "<path d='M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5'/><path d='M8.5 8.5v.01'/><path d='M16 15.5v.01'/><path d='M12 12v.01'/><path d='M11 17v.01'/><path d='M7 14v.01'/>",
    "croissant": "<path d='m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z'/><path d='m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83'/><path d='M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4'/><path d='m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2'/><path d='M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5'/>",
    "cup-soda": "<path d='m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8'/><path d='M5 8h14'/><path d='M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0'/><path d='m12 8 1-6h2'/>",
    "dog": "<path d='M11.25 16.25h1.5L12 17z'/><path d='M16 14v.5'/><path d='M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309'/><path d='M8 14v.5'/><path d='M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5'/>",
    "door-open": "<path d='M13 4h3a2 2 0 0 1 2 2v14'/><path d='M2 20h3'/><path d='M13 20h9'/><path d='M10 12v.01'/><path d='M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z'/>",
    "droplet": "<path d='M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z'/>",
    "droplets": "<path d='M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z'/><path d='M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97'/>",
    "dumbbell": "<path d='M14.4 14.4 9.6 9.6'/><path d='M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z'/><path d='m21.5 21.5-1.4-1.4'/><path d='M3.9 3.9 2.5 2.5'/><path d='M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z'/>",
    "eye": "<path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'/><circle cx='12' cy='12' r='3'/>",
    "fence": "<path d='M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'/><path d='M6 8h4'/><path d='M6 18h4'/><path d='m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'/><path d='M14 8h4'/><path d='M14 18h4'/><path d='m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'/>",
    "file-text": "<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/>",
    "fish": "<path d='M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z'/><path d='M18 12v.5'/><path d='M16 17.93a9.77 9.77 0 0 1 0-11.86'/><path d='M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33'/><path d='M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4'/><path d='m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98'/>",
    "flame": "<path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'/>",
    "flower": "<circle cx='12' cy='12' r='3'/><path d='M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5'/><path d='M12 7.5V9'/><path d='M7.5 12H9'/><path d='M16.5 12H15'/><path d='M12 16.5V15'/><path d='m8 8 1.88 1.88'/><path d='M14.12 9.88 16 8'/><path d='m8 16 1.88-1.88'/><path d='M14.12 14.12 16 16'/>",
    "flower-2": "<path d='M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1'/><circle cx='12' cy='8' r='2'/><path d='M12 10v12'/><path d='M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z'/><path d='M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z'/>",
    "footprints": "<path d='M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z'/><path d='M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z'/><path d='M16 17h4'/><path d='M4 13h4'/>",
    "gavel": "<path d='m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8'/><path d='m16 16 6-6'/><path d='m8 8 6-6'/><path d='m9 7 8 8'/><path d='m21 11-8-8'/>",
    "gem": "<path d='M6 3h12l4 6-10 13L2 9Z'/><path d='M11 3 8 9l4 13 4-13-3-6'/><path d='M2 9h20'/>",
    "gift": "<rect x='3' y='8' width='18' height='4' rx='1'/><path d='M12 8v13'/><path d='M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7'/><path d='M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5'/>",
    "graduation-cap": "<path d='M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z'/><path d='M22 10v6'/><path d='M6 12.5V16a6 3 0 0 0 12 0v-3.5'/>",
    "hammer": "<path d='m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9'/><path d='m18 15 4-4'/><path d='m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5'/>",
    "hand-heart": "<path d='M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16'/><path d='m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9'/><path d='m2 15 6 6'/><path d='M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z'/>",
    "handshake": "<path d='m11 17 2 2a1 1 0 1 0 3-3'/><path d='m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4'/><path d='m21 3 1 11h-2'/><path d='M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3'/><path d='M3 4h8'/>",
    "hard-hat": "<path d='M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5'/><path d='M14 6a6 6 0 0 1 6 6v3'/><path d='M4 15v-3a6 6 0 0 1 6-6'/><rect x='2' y='15' width='20' height='4' rx='1'/>",
    "heart": "<path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/>",
    "heart-pulse": "<path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/><path d='M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27'/>",
    "house": "<path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'/><path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>",
    "ice-cream-cone": "<path d='m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11'/><path d='M17 7A5 5 0 0 0 7 7'/><path d='M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4'/>",
    "key-round": "<path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'/><circle cx='16.5' cy='7.5' r='.5' fill='currentColor'/>",
    "landmark": "<line x1='3' x2='21' y1='22' y2='22'/><line x1='6' x2='6' y1='18' y2='11'/><line x1='10' x2='10' y1='18' y2='11'/><line x1='14' x2='14' y1='18' y2='11'/><line x1='18' x2='18' y1='18' y2='11'/><polygon points='12 2 20 7 4 7'/>",
    "laptop": "<path d='M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16'/>",
    "leaf": "<path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'/><path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'/>",
    "lightbulb": "<path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5'/><path d='M9 18h6'/><path d='M10 22h4'/>",
    "lock": "<rect width='18' height='11' x='3' y='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/>",
    "map": "<path d='M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z'/><path d='M15 5.764v15'/><path d='M9 3.236v15'/>",
    "map-pin": "<path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'/><circle cx='12' cy='10' r='3'/>",
    "megaphone": "<path d='m3 11 18-5v12L3 14v-3z'/><path d='M11.6 16.8a3 3 0 1 1-5.8-1.6'/>",
    "message-circle": "<path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z'/>",
    "mic": "<path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><line x1='12' x2='12' y1='19' y2='22'/>",
    "microscope": "<path d='M6 18h8'/><path d='M3 22h18'/><path d='M14 22a7 7 0 1 0 0-14h-1'/><path d='M9 14h2'/><path d='M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z'/><path d='M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3'/>",
    "moon": "<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/>",
    "music": "<path d='M9 18V5l12-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='16' r='3'/>",
    "package": "<path d='M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'/><path d='M12 22V12'/><path d='m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7'/><path d='m7.5 4.27 9 5.15'/>",
    "paint-roller": "<rect width='16' height='6' x='2' y='2' rx='2'/><path d='M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2'/><rect width='4' height='6' x='8' y='16' rx='1'/>",
    "paintbrush": "<path d='m14.622 17.897-10.68-2.913'/><path d='M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z'/><path d='M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15'/>",
    "palette": "<circle cx='13.5' cy='6.5' r='.5' fill='currentColor'/><circle cx='17.5' cy='10.5' r='.5' fill='currentColor'/><circle cx='8.5' cy='7.5' r='.5' fill='currentColor'/><circle cx='6.5' cy='12.5' r='.5' fill='currentColor'/><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'/>",
    "party-popper": "<path d='M5.8 11.3 2 22l10.7-3.79'/><path d='M4 3h.01'/><path d='M22 8h.01'/><path d='M15 2h.01'/><path d='M22 20h.01'/><path d='m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10'/><path d='m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17'/><path d='m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7'/><path d='M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z'/>",
    "paw-print": "<circle cx='11' cy='4' r='2'/><circle cx='18' cy='8' r='2'/><circle cx='20' cy='16' r='2'/><path d='M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'/>",
    "pen-tool": "<path d='M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z'/><path d='m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18'/><path d='m2.3 2.3 7.286 7.286'/><circle cx='11' cy='11' r='2'/>",
    "pencil-ruler": "<path d='M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13'/><path d='m8 6 2-2'/><path d='m18 16 2-2'/><path d='m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17'/><path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/><path d='m15 5 4 4'/>",
    "phone": "<path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/>",
    "pill": "<path d='m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z'/><path d='m8.5 8.5 7 7'/>",
    "pizza": "<path d='m12 14-1 1'/><path d='m13.75 18.25-1.25 1.42'/><path d='M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12'/><path d='M18.8 9.3a1 1 0 0 0 2.1 7.7'/><path d='M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z'/>",
    "plug": "<path d='M12 22v-5'/><path d='M9 8V2'/><path d='M15 8V2'/><path d='M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z'/>",
    "razor": "<path d='M7 3h10v4h-10z'/><path d='M12 7v4'/><path d='M12 11a2 2 0 0 1 2 2v6a2 2 0 1 1 -4 0v-6a2 2 0 0 1 2 -2z'/>",
    "receipt": "<path d='M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z'/><path d='M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8'/><path d='M12 17.5v-11'/>",
    "refresh-cw": "<path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/><path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'/><path d='M8 16H3v5'/>",
    "rocket": "<path d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'/><path d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'/><path d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'/><path d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'/>",
    "route": "<circle cx='6' cy='19' r='3'/><path d='M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15'/><circle cx='18' cy='5' r='3'/>",
    "ruler": "<path d='M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z'/><path d='m14.5 12.5 2-2'/><path d='m11.5 9.5 2-2'/><path d='m8.5 6.5 2-2'/><path d='m17.5 15.5 2-2'/>",
    "sailboat": "<path d='M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z'/><path d='M21 14 10 2 3 14h18Z'/><path d='M10 2v16'/>",
    "salad": "<path d='M7 21h10'/><path d='M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z'/><path d='M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1'/><path d='m13 12 4-4'/><path d='M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2'/>",
    "sandwich": "<path d='m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777'/><path d='M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25'/><path d='M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9'/><path d='m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2'/><rect width='20' height='4' x='2' y='11' rx='1'/>",
    "scale": "<path d='m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/>",
    "scissors": "<circle cx='6' cy='6' r='3'/><path d='M8.12 8.12 12 12'/><path d='M20 4 8.12 15.88'/><circle cx='6' cy='18' r='3'/><path d='M14.8 14.8 20 20'/>",
    "search": "<circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/>",
    "shield": "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/>",
    "shield-check": "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/><path d='m9 12 2 2 4-4'/>",
    "shirt": "<path d='M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z'/>",
    "shopping-bag": "<path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z'/><path d='M3 6h18'/><path d='M16 10a4 4 0 0 1-8 0'/>",
    "shower-head": "<path d='m4 4 2.5 2.5'/><path d='M13.5 6.5a4.95 4.95 0 0 0-7 7'/><path d='M15 5 5 15'/><path d='M14 17v.01'/><path d='M10 16v.01'/><path d='M13 13v.01'/><path d='M16 10v.01'/><path d='M11 20v.01'/><path d='M17 14v.01'/><path d='M20 11v.01'/>",
    "siren": "<path d='M7 18v-6a5 5 0 1 1 10 0v6'/><path d='M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z'/><path d='M21 12h1'/><path d='M18.5 4.5 18 5'/><path d='M2 12h1'/><path d='M12 2v1'/><path d='m4.929 4.929.707.707'/><path d='M12 12v6'/>",
    "smile": "<circle cx='12' cy='12' r='10'/><path d='M8 14s1.5 2 4 2 4-2 4-2'/><line x1='9' x2='9.01' y1='9' y2='9'/><line x1='15' x2='15.01' y1='9' y2='9'/>",
    "snowflake": "<line x1='2' x2='22' y1='12' y2='12'/><line x1='12' x2='12' y1='2' y2='22'/><path d='m20 16-4-4 4-4'/><path d='m4 8 4 4-4 4'/><path d='m16 4-4 4-4-4'/><path d='m8 20 4-4 4 4'/>",
    "sofa": "<path d='M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3'/><path d='M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z'/><path d='M4 18v2'/><path d='M20 18v2'/><path d='M12 4v9'/>",
    "soup": "<path d='M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z'/><path d='M7 21h10'/><path d='M19.5 12 22 6'/><path d='M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62'/><path d='M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62'/><path d='M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62'/>",
    "sparkle": "<path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'/>",
    "sparkles": "<path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'/><path d='M20 3v4'/><path d='M22 5h-4'/><path d='M4 17v2'/><path d='M5 18H3'/>",
    "spray-can": "<path d='M3 3h.01'/><path d='M7 5h.01'/><path d='M11 7h.01'/><path d='M3 7h.01'/><path d='M7 9h.01'/><path d='M3 11h.01'/><rect width='4' height='4' x='15' y='5'/><path d='m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2'/><path d='m13 14 8-2'/><path d='m13 19 8-2'/>",
    "sprout": "<path d='M7 20h10'/><path d='M10 20c5.5-2.5.8-6.4 3-10'/><path d='M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z'/><path d='M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z'/>",
    "star": "<path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'/>",
    "stethoscope": "<path d='M11 2v2'/><path d='M5 2v2'/><path d='M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1'/><path d='M8 15a6 6 0 0 0 12 0v-3'/><circle cx='20' cy='10' r='2'/>",
    "sun": "<circle cx='12' cy='12' r='4'/><path d='M12 2v2'/><path d='M12 20v2'/><path d='m4.93 4.93 1.41 1.41'/><path d='m17.66 17.66 1.41 1.41'/><path d='M2 12h2'/><path d='M20 12h2'/><path d='m6.34 17.66-1.41 1.41'/><path d='m19.07 4.93-1.41 1.41'/>",
    "syringe": "<path d='m18 2 4 4'/><path d='m17 7 3-3'/><path d='M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5'/><path d='m9 11 4 4'/><path d='m5 19-3 3'/><path d='m14 4 6 6'/>",
    "thermometer": "<path d='M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z'/>",
    "thumbs-up": "<path d='M7 10v12'/><path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z'/>",
    "ticket": "<path d='M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z'/><path d='M13 5v2'/><path d='M13 17v2'/><path d='M13 11v2'/>",
    "toilet": "<path d='M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18'/><path d='M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8'/>",
    "tooth": "<path d='M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5z'/><path d='M12 5.5l3 1.5'/>",
    "traffic-cone": "<path d='M9.3 6.2a4.55 4.55 0 0 0 5.4 0'/><path d='M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3'/><path d='M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z'/><path d='m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8'/>",
    "trash-2": "<path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/><line x1='10' x2='10' y1='11' y2='17'/><line x1='14' x2='14' y1='11' y2='17'/>",
    "tree-deciduous": "<path d='M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z'/><path d='M12 19v3'/>",
    "trees": "<path d='M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z'/><path d='M7 16v6'/><path d='M13 19v3'/><path d='M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5'/>",
    "trophy": "<path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/><path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18'/><path d='M4 22h16'/><path d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'/><path d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'/><path d='M18 2H6v7a6 6 0 0 0 12 0V2Z'/>",
    "truck": "<path d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/><path d='M15 18H9'/><path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/><circle cx='17' cy='18' r='2'/><circle cx='7' cy='18' r='2'/>",
    "user": "<path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>",
    "users": "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>",
    "utensils": "<path d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/><path d='M7 2v20'/><path d='M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/>",
    "utensils-crossed": "<path d='m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8'/><path d='M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7'/><path d='m2.1 21.8 6.4-6.3'/><path d='m19 5-7 7'/>",
    "video": "<path d='m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5'/><rect x='2' y='6' width='14' height='12' rx='2'/>",
    "washing-machine": "<path d='M3 6h3'/><path d='M17 6h.01'/><rect width='18' height='20' x='3' y='2' rx='2'/><circle cx='12' cy='13' r='5'/><path d='M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5'/>",
    "waves": "<path d='M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'/><path d='M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'/><path d='M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'/>",
    "wheat": "<path d='M2 22 16 8'/><path d='M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z'/><path d='M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z'/><path d='M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z'/><path d='M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z'/><path d='M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z'/><path d='M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z'/><path d='M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z'/>",
    "wind": "<path d='M12.8 19.6A2 2 0 1 0 14 16H2'/><path d='M17.5 8a2.5 2.5 0 1 1 2 4H2'/><path d='M9.8 4.4A2 2 0 1 1 11 8H2'/>",
    "wine": "<path d='M8 22h8'/><path d='M7 10h10'/><path d='M12 15v7'/><path d='M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z'/>",
    "wrench": "<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/>",
    "yoga": "<path d='M12 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'/><path d='M4 20h4l1.5 -3'/><path d='M17 20l-1 -5h-5l1 -7'/><path d='M4 10l4 -1l4 -1l4 1.5l4 1.5'/>",
    "zap": "<path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/>"
  };
  WS.EMOJI_ICON = {"2600":"sun","2615":"coffee","2693":"anchor","2696":"scale","2699":"cog","2702":"scissors","2705":"circle-check","2728":"sparkles","2744":"snowflake","2764":"heart","1f488":"razor","1f9d4":"razor","1fa92":"razor","1f466":"smile","1f4cf":"ruler","1f3a8":"palette","1f4a8":"wind","1f9f4":"spray-can","1f4ac":"message-circle","1f490":"flower-2","1f486":"hand-heart","1f9d6":"droplets","1f485":"sparkle","1f338":"flower","1f441":"eye","1f58b":"pen-tool","270d":"pen-tool","1f504":"refresh-cw","1f48e":"gem","1f35e":"wheat","1f950":"croissant","1f382":"cake","1f36a":"cookie","1f96a":"sandwich","1f4cb":"clipboard-list","1f9ca":"snowflake","1f375":"coffee","1f6cd":"shopping-bag","1f37d":"utensils","1f961":"shopping-bag","1f942":"wine","1f373":"chef-hat","1f377":"wine","1f33e":"wheat","1fab4":"sprout","1f342":"leaf","1f333":"tree-deciduous","1f33f":"leaf","1f4a7":"droplet","1f4c5":"calendar","1f4e6":"package","1f3e2":"building-2","1fa9f":"app-window","1f6bf":"shower-head","1f9fa":"washing-machine","1f6a4":"sailboat","1f527":"wrench","1f50d":"search","1f6e2":"car","1f6d1":"car","1f4aa":"dumbbell","1f3cb":"dumbbell","1f331":"sprout","1f957":"salad","1f9d8":"yoga","1f6c1":"bath","1f3e1":"house","1f415":"dog","1f9ae":"dog","1f43e":"paw-print","1f408":"cat","1f4f7":"camera","1f492":"heart","1f389":"party-popper","1f4bc":"briefcase","1f4f8":"camera","1f3a5":"video","1f381":"gift","1f91d":"handshake","1f4cd":"map-pin","1f39f":"ticket","1f6e0":"hammer","1f528":"hammer","1f6a8":"siren","1f4dd":"file-text","1f54a":"bird","1fa65":"shirt","1f9b7":"tooth","1f9d2":"baby","1f601":"smile","1f44b":"smile","1fa7a":"stethoscope","1f4bb":"laptop","1f4c4":"file-text","1f4ca":"chart-column","1f4c8":"chart-column","1f9fe":"receipt","1f3e6":"landmark","1f511":"key-round","1f69a":"truck","1f4da":"book-open","1f465":"users","1f3db":"landmark","1f5fa":"map","1f5d1":"trash-2","1f9ed":"compass","1f680":"rocket","1f4e3":"megaphone","1f5dd":"key-round","1f512":"lock","1f697":"car","1f525":"flame","26a1":"zap","1f9f5":"scissors","1f454":"shirt","1f457":"shirt","1f4d0":"pencil-ruler","1f37c":"baby","1f9f8":"blocks","1f392":"backpack","1f34e":"book-open","1f355":"pizza","1f370":"cake-slice","1f32e":"utensils-crossed","1f32f":"sandwich","1f336":"flame","1f379":"cup-soda","1f363":"fish","1f35c":"soup","1f371":"utensils","1f962":"utensils","1f376":"wine","1f356":"beef","1f3aa":"ticket","1f35d":"utensils","1f9c0":"utensils","1f368":"ice-cream-cone","1f354":"beef","1f35f":"utensils-crossed","1f964":"cup-soda","1f6bd":"toilet","1f4a1":"lightbulb","1f50c":"plug","1f32c":"wind","1f321":"thermometer","1f3e0":"house","1f58c":"paintbrush","1f41c":"bug","1f42d":"bug","1f6e1":"shield","1f3ca":"waves","1f6a7":"traffic-cone","1fab5":"trees","1f6aa":"door-open","1f532":"app-window","1f3d7":"hard-hat","1f9f9":"brush","1f6bb":"toilet","1f9fb":"toilet","1f3c3":"footprints","1f930":"heart-pulse","1faa8":"brick-wall","1f491":"heart","1f319":"moon","1f464":"user","1f94b":"dumbbell","1f94a":"dumbbell","1f489":"syringe","1f3e5":"heart-pulse","1f9b4":"bone","1fa91":"sofa","260e":"phone","1f453":"eye","1f9fd":"spray-can","1f9fc":"droplets","1f3b5":"music","1f3a4":"mic","1f52c":"microscope","1f6e3":"route","1f6cb":"sofa","1f9f1":"brick-wall","1f48d":"gem","1f4d6":"book-open","1f4f1":"phone","1f963":"soup","23f0":"clock","1f4af":"star","1f60e":"smile","1f919":"phone","1f64c":"hand-heart","1f44c":"thumbs-up","1f31f":"star","1f3c6":"trophy","1f6ce":"star","1f929":"star","1f37f":"ticket","1f37e":"wine","1f37b":"beer","1f60b":"smile","1f924":"utensils","1f60d":"heart","1f49d":"gift","1f343":"leaf","1f340":"leaf","1f308":"sparkles","1f31e":"sun","1f41d":"flower","1f98b":"flower-2","1f40c":"leaf","1f305":"sun","1f44d":"thumbs-up","1f44f":"hand-heart","1f4de":"phone","1f4c6":"calendar","1f552":"clock","1f550":"clock","23f1":"clock","1f3b8":"music","1f3b9":"music","1f393":"graduation-cap","1f6b2":"bike","1f4b0":"receipt","1f4b5":"receipt","1f3d8":"house","1f3a7":"mic","1f50a":"megaphone","1f4f9":"video","1f9e0":"lightbulb","1f9ea":"microscope","1f48a":"pill","1f3e8":"building-2","1f455":"shirt","1f45f":"footprints","1f9e1":"heart","1f49b":"heart","1f49a":"heart","1f499":"heart","1f49c":"heart","2b50":"star","1f33b":"flower","1f337":"flower","1f339":"flower","1f33a":"flower","1f332":"trees","1f334":"trees","1f9c1":"cake-slice","1f369":"cookie","1f953":"beef","1f357":"beef","1f36b":"cookie","1f9cb":"cup-soda","1f378":"wine","1f943":"wine","1f37a":"beer","1f699":"car","1f695":"car","1f68c":"truck","26f5":"sailboat","1f3a3":"fish","1f420":"fish","1f41f":"fish","1f436":"dog","1f431":"cat","1f9f0":"wrench","1fa9b":"wrench","1fa9a":"hammer","1f529":"wrench","26cf":"hammer","1f9ef":"flame","1f50b":"zap","1f39e":"video","1f5bc":"palette","1f3ad":"ticket","1f3c0":"trophy","26bd":"trophy","1f6b4":"bike","1f9d7":"dumbbell","1f938":"dumbbell","1f483":"music","1f57a":"music","26ea":"church","1f6cf":"bed-double","1f6cc":"bed-double"};
  // Item names -> icon, for cards without an emoji (or with one we have no icon for). First match wins.
  WS.ICON_WORDS = [
    [/emergenc|24\/7|urgent/, 'siren'], [/consult|advice|question|talk/, 'message-circle'], [/estimate|quote|plan\b|planning|assessment/, 'clipboard-list'],
    [/inspect|diagnos|check-?up|survey/, 'search'], [/deliver|moving|haul|junk/, 'truck'], [/cater|lunch|dinner|brunch|menu|meal/, 'utensils'],
    [/cake|cupcake/, 'cake'], [/coffee|espresso|latte|cafe/, 'coffee'], [/bread|sourdough|loaf|bagel/, 'wheat'], [/pastr|croissant/, 'croissant'],
    [/taco|burrito|grill|bbq/, 'utensils-crossed'], [/pizza/, 'pizza'], [/drink|cocktail|wine|bar\b/, 'wine'],
    [/shave|fade|beard|razor/, 'razor'], [/cut|trim|hair|style|tailor|alteration/, 'scissors'], [/colou?r|dye|highlight/, 'palette'], [/nail|manicure|pedicure/, 'sparkle'],
    [/massage|facial|spa/, 'hand-heart'], [/yoga|pilates|meditat|stretch/, 'yoga'], [/train|gym|fitness|strength|class/, 'dumbbell'],
    [/drain|pipe|leak|water|plumb|faucet|toilet|sewer/, 'droplet'], [/heat|furnace|boiler|thermostat/, 'thermometer'], [/cool|a\/c|\bac\b|air con/, 'snowflake'],
    [/electric|wiring|panel|outlet|light|ev charg/, 'zap'], [/paint/, 'paint-roller'], [/roof|gutter/, 'house'], [/remodel|repair|fix|install|maint|handyman|build|renovat/, 'wrench'],
    [/clean|maid|wash|detail/, 'sparkles'], [/lawn|mow|garden|landscap|hedge|yard/, 'leaf'], [/tree/, 'trees'], [/plant|flower|bouquet|floral/, 'flower-2'],
    [/dog|pet|groom|walk|puppy|cat\b/, 'paw-print'], [/photo|portrait|headshot|shoot/, 'camera'], [/video|film/, 'video'], [/wedding|event|party/, 'party-popper'],
    [/car\b|auto|oil|brake|tire|engine/, 'car'], [/lock|key/, 'key-round'], [/secur|insur|protect|warrant/, 'shield-check'], [/legal|law|contract|will|estate|court|litig/, 'scale'],
    [/tax|account|bookkeep|payroll|financ/, 'chart-column'], [/teeth|dental|clean(ing)? and|whiten|tooth|smile/, 'tooth'], [/child|kid|baby|infant|toddler/, 'baby'],
    [/tutor|lesson|course|school|learn|teach/, 'graduation-cap'], [/music|piano|guitar|voice|sing/, 'music'], [/book|appointment|schedul|calendar/, 'calendar-check'],
    [/cctv|camera system|surveillance/, 'video'], [/alarm/, 'siren'], [/guard|patrol/, 'shield'], [/\btow(ing)?\b|roadside/, 'truck'], [/beer|brew|taproom/, 'beer'], [/prescription|pharmac|medicine|refill/, 'pill'],
    [/gift/, 'gift'], [/home|house|real estate|propert/, 'house'], [/team|group|staff/, 'users'], [/fast|quick|same.day|on time/, 'clock'],
  ];
  // Business type -> default icon (the never-blank fallback).
  WS.ICON_TYPES = [
    [/barber/, 'razor'], [/hair|salon|stylist|tailor|alteration|sew/, 'scissors'], [/nail|beauty|lash|brow|makeup/, 'sparkle'], [/spa|massage/, 'hand-heart'],
    [/bak|pastr|donut|cake/, 'croissant'], [/coffee|caf[eé]|tea/, 'coffee'], [/restaurant|food|kitchen|cater|truck|taco|pizza|grill|diner|bistro/, 'utensils'],
    [/plumb/, 'droplet'], [/electric/, 'zap'], [/hvac|heating|air|cooling/, 'thermometer'], [/paint/, 'paint-roller'], [/roof|contractor|construct|remodel|handyman|carpent|build/, 'hammer'],
    [/clean|maid|janitor|wash|detail/, 'sparkles'], [/lawn|landscap|garden/, 'leaf'], [/tree/, 'trees'], [/flor|flower/, 'flower-2'],
    [/auto|car|mechanic|garage|tire/, 'car'], [/pet|dog|groom|vet|kennel/, 'paw-print'], [/photo|video/, 'camera'], [/gym|fitness|boxing|martial|crossfit|train/, 'dumbbell'],
    [/yoga|pilates/, 'yoga'], [/dent|ortho/, 'tooth'], [/law|attorney|legal/, 'scale'], [/account|tax|cpa|bookkeep|financ|insur/, 'briefcase'],
    [/real ?estate|realt/, 'house'], [/daycare|child|preschool|nanny/, 'baby'], [/tutor|school|lesson|teach/, 'graduation-cap'], [/music|piano|guitar/, 'music'],
    [/lock/, 'key-round'], [/mov|haul|junk|courier/, 'truck'], [/chiro|therap|clinic|medical|health|wellness/, 'heart-pulse'], [/boat|marine/, 'anchor'],
    [/secur|alarm|cctv|guard|patrol/, 'shield'], [/\btow(ing)?\b/, 'truck'], [/pharmac|drugstore/, 'pill'], [/church|chapel|ministr|parish/, 'church'], [/hotel|motel|\binn\b|b ?& ?b|bed and breakfast/, 'bed-double'],
    [/brew|\bpub\b|\bbar\b|tavern|taproom/, 'beer'], [/funeral|cremat|mortuary/, 'flower-2'], [/computer|laptop|\bit (services|support)/, 'laptop'], [/solar/, 'sun'], [/fenc/, 'fence'], [/danc|ballet/, 'music'],
  ];
  WS.iconNames = Object.keys(WS.ICONS);
  WS.iconLabel = (n) => String(n).replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
  // Inline SVG (decorative: the card title says what it is). Unknown names give ''.
  WS.iconSvg = (name, cls = '') => (WS.ICONS[name] ? `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${WS.ICONS[name].replace(/'/g, '"')}</svg>` : '');
  WS.emojiIcon = (code) => { const c = String(code || '').toLowerCase().replace(/_fe0f$/, ''); return WS.EMOJI_ICON[c] || WS.EMOJI_ICON[c.split('_')[0]] || ''; };
  // The icon for a card: the owner's pick, else its emoji's icon, else one matched from its name, else the business type's.
  WS.iconFor = (it, type) => {
    it = it || {};
    if (WS.ICONS[it.icon]) return it.icon;
    const fromEmoji = WS.emojiIcon(it.emoji); if (fromEmoji) return fromEmoji;
    const nm = String(it.name || it.label || '').toLowerCase();
    const w = nm && WS.ICON_WORDS.find((x) => x[0].test(nm)); if (w) return w[1];
    const t = WS.ICON_TYPES.find((x) => x[0].test(String(type || '').toLowerCase()));
    return t ? t[1] : 'circle-check';
  };
  // 'line' or 'emoji' for a site (see the note above).
  WS.iconStyleOf = (site) => {
    const v = site && site.iconStyle;
    if (v === 'line' || v === 'emoji') return v;
    const secs = (WS.allSections ? WS.allSections(site) : []) || [];
    const codes = [];
    secs.forEach((s) => { if (/^(services|steps|stats)$/.test(s.type)) (Array.isArray(s.items) ? s.items : []).forEach((it) => { if (it && WS.str(it.emoji)) codes.push(it.emoji); }); });
    return codes.every((c) => WS.emojiIcon(c)) ? 'line' : 'emoji';
  };
})(globalThis.WS = globalThis.WS || {});

// Section library. Each section: label, blurb, variants, fields (drives the editor forms),
// create(site) -> default content written from the business's own details, render(sec, ctx) -> HTML.
(function (WS) {
  const e = WS.esc;
  const R = WS.register;
  const lines = (txt) => e(txt).replace(/\n/g, '<br>');
  // Small label above a heading (sec.eyebrow overrides the default; '' hides it). Skipped when the title already says it.
  const eyebrow = (sec, def, title) => { const v = sec.eyebrow != null ? WS.str(sec.eyebrow) : WS.str(def); return v && String(title || '').toLowerCase().indexOf(v.toLowerCase()) < 0 ? `<p class="eb">${e(v)}</p>` : ''; };
  const head = (sec, fallback, eb) => { const t = WS.str(sec.title) || WS.str(fallback); return t ? `<div class="sh">${eyebrow(sec, eb, t)}<h2 class="h2">${e(t)}</h2></div>` : ''; };
  // What a business sells, for eyebrows: a menu, a shop or services.
  const offerWord = (c) => (/restaurant|food|kitchen|cafe|café|coffee|bak|taco|pizza|grill|diner|bistro|bar\b|truck|cater/i.test(String((c.biz && c.biz.type) || '')) ? 'Menu' : 'Services');
  // A card's icon: a line icon (site.iconStyle 'line'), or its emoji; never blank (falls back to a line icon).
  const cardIcon = (c, it, cls) => {
    const em = WS.str(it.emoji);
    if (c.iconStyle === 'emoji' && em && !it.icon) return `<span class="ic ic-emo${cls ? ' ' + cls : ''}">${WS.emoji(em)}</span>`;
    return `<span class="ic${cls ? ' ' + cls : ''}">${WS.iconSvg(WS.iconFor(it, c.biz && c.biz.type))}</span>`;
  };
  // Inline/decorative emoji (headings, statements): an icon in line mode when one fits, else the emoji.
  const glyph = (c, code, cls) => { if (!code) return ''; const n = c.iconStyle === 'line' && WS.emojiIcon(code); return n ? `<span class="glyph${cls ? ' ' + cls : ''}">${WS.iconSvg(n)}</span>` : WS.emoji(code, cls || ''); };
  // A "Book" style button: dropped entirely when the site has nowhere to send people.
  const bookBtn = (c, cls, label) => (c.book ? `<a${cls ? ` class="${cls}"` : ''} href="${c.book}">${e(label)}</a>` : '');
  // A linked Google listing's rating is never stored in the site (Google's terms allow caching only the place ID):
  // the page shows it live. Live markup is hidden until the runtime has Google's answer (data-glive), and stays
  // hidden when Google is unavailable; in the editor a plain "Google rating" label stands in.
  WS.googleLinked = (site) => !!WS.str(site && site.biz && site.biz.googlePlaceId);
  WS.gLive = (c, liveHtml, editHtml, tag, attrs) => (c.mode === 'edit' ? `<${tag}${attrs || ''}>${editHtml}</${tag}>` : `<${tag}${attrs || ''} data-glive hidden>${liveHtml}</${tag}>`);
  // Proof for the opening, only from the owner's real answers (never invented): a floating card with the strongest
  // fact (years in business, else licensed and insured) and small chips for the rest (a linked Google rating is a
  // live chip, filled from Google on the page and never stored).
  const heroProof = (c) => {
    const list = WS.trustBadges ? WS.trustBadges(c.site, {}) : [];
    const by = {}; list.forEach((x) => { by[x.k] = x; });
    let card = '', used = '';
    if (by.founded && by.founded.yrs) { used = 'founded'; const y = by.founded.yrs, n = new Date().getFullYear() - y, city = WS.cityName(c.biz.city); card = `<p class="hc-num"><b data-count="${n}" data-src="years" data-founded="${y}">${n}</b><span class="hc-unit">years</span></p><p class="hc-cap">${city ? 'Serving ' + e(city) + ' since ' + y : 'In business since ' + y}</p>`; }
    else if (by.licensed && by.insured) { used = 'li'; card = `<p class="hc-num hc-ico">${WS.iconSvg('shield-check')}</p><p class="hc-cap"><b>Licensed &amp; insured</b>Work done properly, and covered</p>`; }
    const chips = [];
    if (used !== 'li') { if (by.licensed && by.insured) chips.push({ icon: 'shield-check', label: 'Licensed & insured' }); else if (by.licensed) chips.push({ icon: 'shield-check', label: 'Licensed' }); else if (by.insured) chips.push({ icon: 'badge-check', label: 'Insured' }); }
    if (by.founded && used !== 'founded') chips.push({ icon: 'calendar', label: by.founded.label });
    if (by.rating) chips.push({ icon: 'star', label: by.rating.label, live: true });
    if (by.area) chips.push({ icon: 'map-pin', label: by.area.label });
    // A trust band right on the page already says it: the opening doesn't repeat the chips (nor the card, for the
    // bold numbers band).
    const tr = (WS.layoutSections(c.site) || []).find((x) => x && x.type === 'trust' && !x.hidden);
    if (tr && WS.trustBadges(c.site, tr).length >= 2) return { card: tr.variant === 'band' ? '' : card, chips: [] };
    return { card, chips: chips.slice(0, 3) };
  };

  // ---------- Announcement bar ----------
  R('announce', {
    label: 'Announcement bar',
    blurb: 'A thin banner for news, a special or holiday hours.',
    variants: { bar: 'Bar' },
    fields: [{ key: 'text', label: 'Message', type: 'text' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: () => ({ variant: 'bar', text: 'Now taking bookings for this month.', emoji: '1f389' }),
    render: (s) => `<div class="announce on-pop">${WS.emoji(s.emoji)}<span>${e(s.text)}</span></div>`,
  });

  // ---------- Hero ----------
  R('hero', {
    label: 'Opening',
    blurb: 'The first thing visitors see.',
    variants: { cinema: 'Full-screen photo, headline first', collage: 'Headline beside a photo collage', photo: 'Full-screen photo', center: 'Full-screen photo, centered', split: 'Text and photo side by side', frame: 'Text beside a framed photo', minimal: 'Big type with a wide photo below', type: 'Big type with emoji' },
    fields: [
      { key: 'title', label: 'Big title', type: 'text', hint: 'Leave empty to use your business name (or your tagline in the headline-first layouts)' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'sub', label: 'Supporting line', type: 'textarea', only: ['cinema', 'collage'], hint: 'One sentence under the headline' },
      { key: 'emoji', label: 'Emoji', type: 'emoji', only: ['type'] },
      { key: 'status', label: 'Show "Open now" status', type: 'toggle' },
    ],
    create: (site) => ({ variant: 'photo', title: '', tagline: site.biz.tagline || '', emoji: WS.emojiRecsFor(site.biz.type)[0], status: true }),
    render: (s, c) => {
      const name = WS.str(s.title) || c.name;
      const l = WS.twoLines(name);
      const title = `<h1 class="name">${l.map((x, i) => `<span class="ln"><span style="--d:${i}">${e(x)}</span></span>`).join('')}</h1>`;
      const hasHours = (c.biz.hours || []).some((h) => h && h.open && h.close);
      const status = s.status && (hasHours || c.biz.walkIns) ? `<p class="status"><span class="pole" aria-hidden="true"></span><span data-status>${c.biz.walkIns ? 'Walk-ins welcome' : ''}</span></p>` : '';
      const acts = bookBtn(c, 'btn', c.biz.bookLabel || 'Book now') + (c.biz.phone ? `<a class="btn ghost" href="${WS.tel(c.biz.phone)}">${e(c.biz.phone)}</a>` : '');
      const actions = acts ? `<div class="actions">${acts}</div>` : '';
      // Headline-first layouts: the value proposition is the headline, the business name a small label above it.
      if (s.variant === 'cinema' || s.variant === 'collage') {
        const own = WS.str(s.title), tg = WS.str(s.tagline), sub0 = WS.str(s.sub);
        const head1 = own || tg || c.name;
        const sub = own ? (tg || sub0) : sub0;
        const eb = head1 !== c.name ? `<p class="hc-eb">${e(c.name)}${WS.str(c.biz.city) ? `<span class="hc-dot" aria-hidden="true"></span><span class="hc-city">${e(WS.cityName(c.biz.city))}</span>` : ''}</p>` : '';
        const h1 = `<h1 class="hc-h${head1.length > 46 ? ' hc-long' : head1.length < 22 ? ' hc-short' : ''}">${e(head1)}</h1>`;
        const pr = heroProof(c);
        const chips = pr.chips.length ? `<ul class="hc-chips" aria-label="At a glance">${pr.chips.map((x) => (x.live ? WS.gLive(c, `${WS.iconSvg(x.icon)}<span><span data-g="rating"></span> on Google</span>`, `${WS.iconSvg(x.icon)}<span>${e(x.label)}</span>`, 'li') : `<li>${WS.iconSvg(x.icon)}<span>${e(x.label)}</span></li>`)).join('')}</ul>` : '';
        const copy = `${status}${eb}${h1}${sub ? `<p class="hc-sub">${e(sub)}</p>` : ''}${actions}${chips}`;
        if (s.variant === 'collage') {
          const has1 = c.photo('photo'), has2 = c.photo('photo2');
          const art = `<div class="hcl-art${has2 || c.mode === 'edit' ? ' hcl-two' : ''}">${c.slot('photo', { hint: 'Your best photo: you at work, or a finished job', cls: 'hcl-main', alt: '' })}${c.slot('photo2', { hint: 'A second photo (optional)', cls: 'hcl-second', alt: '' })}${pr.card ? `<div class="hc-card hcl-card">${pr.card}</div>` : ''}</div>`;
          return `<section class="hero hero-collage on-base${has1 || c.mode === 'edit' ? '' : ' hs-solo'}"><div class="wrap hcl-grid"><div class="hc-copy">${copy}</div>${has1 || c.mode === 'edit' ? art : ''}</div></section>`;
        }
        return `<section class="hero hero-photo hero-cinema on-base${c.photo('photo') ? '' : ' hero-noimg'}">${c.bg('photo', { hint: 'a cover photo', cls: 'hero-media' })}<div class="hero-in hc-in"><div class="hc-copy">${copy}</div>${pr.card ? `<div class="hc-card">${pr.card}</div>` : ''}</div></section>`;
      }
      if (s.variant === 'split')
        return `<section class="hero hero-split on-base${c.photo('photo') ? '' : ' hs-solo'}"><div class="wrap hs-grid"><div class="hs-copy">${status}${title}<p class="tag">${e(s.tagline)}</p>${actions}</div>${c.slot('photo', { hint: 'Your best photo, tall works best', cls: 'hs-img reveal' })}</div></section>`;
      if (s.variant === 'type')
        return `<section class="hero hero-type on-base"><div class="wrap">${status}<div class="ht-row">${title}${s.emoji ? `<div class="ht-emo">${glyph(c, s.emoji)}</div>` : ''}</div><div class="hero-foot"><p class="tag">${e(s.tagline)}</p>${actions}</div></div></section>`;
      // Framed: text beside a photo set in a frame with an offset accent block (a calmer split).
      if (s.variant === 'frame')
        return `<section class="hero hero-frame on-base${c.photo('photo') ? '' : ' hs-solo'}"><div class="wrap hs-grid"><div class="hs-copy">${status}${title}<p class="tag">${e(s.tagline)}</p>${actions}</div><div class="hf-pic">${c.slot('photo', { hint: 'Your best photo', cls: 'hs-img' })}</div></div></section>`;
      // Minimal: a text-led opening, then the photo as a wide band underneath.
      if (s.variant === 'minimal')
        return `<section class="hero hero-minimal on-base"><div class="wrap"><div class="hm-row"><div>${status}${title}</div><div class="hm-side"><p class="tag">${e(s.tagline)}</p>${actions}</div></div>${c.slot('photo', { hint: 'A wide photo of your place or work', cls: 'hm-img' })}</div></section>`;
      // Centered: full-bleed photo with the name and actions centered over an even scrim.
      if (s.variant === 'center')
        return `<section class="hero hero-photo hero-center on-base${c.photo('photo') ? '' : ' hero-noimg'}">${c.bg('photo', { hint: 'a cover photo', cls: 'hero-media' })}<div class="hero-in">${status}${title}<p class="tag">${e(s.tagline)}</p>${actions}</div></section>`;
      return `<section class="hero hero-photo on-base${c.photo('photo') ? '' : ' hero-noimg'}">${c.bg('photo', { hint: 'a cover photo', cls: 'hero-media' })}<div class="hero-in">${status}${title}<div class="hero-foot"><p class="tag">${e(s.tagline)}</p>${actions}</div></div></section>`;
    },
  });

  // ---------- Intro statement ----------
  R('intro', {
    label: 'About statement',
    blurb: 'One bold paragraph about who you are.',
    variants: { offset: 'Statement with photo', center: 'Centered statement', columns: 'Title and text in two columns' },
    fields: [{ key: 'title', label: 'Title', type: 'text', only: ['columns'], hint: 'Leave empty for "About [your name]"' }, { key: 'text', label: 'Statement', type: 'textarea' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'offset', text: site.biz.about || 'Tell people what makes you different, in one or two sentences.', emoji: WS.emojiRecsFor(site.biz.type)[1] }),
    render: (s, c) => {
      if (s.variant === 'columns') {
        const t = WS.str(s.title) || 'About ' + c.name;
        return `<section class="intro intro-cols on-base"><div class="wrap ic-grid"><div class="sh">${eyebrow(s, 'About', t)}<h2 class="h2">${e(t)}</h2></div><div><p class="ic-text">${lines(s.text)}</p>${c.biz.city ? `<p class="ic-meta">${WS.iconSvg('map-pin')}${e(WS.str(c.biz.type) ? WS.str(c.biz.type) + ' in ' + WS.str(c.biz.city) : WS.str(c.biz.city))}</p>` : ''}</div></div></section>`;
      }
      return s.variant === 'center'
        ? `<section class="intro intro-center on-base"><div class="wrap">${s.emoji ? `<div class="emo-big">${glyph(c, s.emoji)}</div>` : ''}<p class="statement">${lines(s.text)}</p></div></section>`
        : `<section class="intro on-base"><div class="wrap intro-grid"><p class="statement">${s.emoji ? glyph(c, s.emoji) + ' ' : ''}${lines(s.text)}</p>${c.slot('photo', { hint: 'A close-up of your work', cls: 'intro-img reveal' })}</div></section>`;
    },
  });

  // ---------- Page header (top band of a sub-page) ----------
  R('pagehead', {
    label: 'Page header',
    blurb: 'A titled band at the top of a page.',
    variants: { band: 'Centered band' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Subtitle', type: 'textarea' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'band', title: '', text: '', emoji: '' }),
    render: (s, c) =>
      `<section class="pagehead on-base"><div class="wrap">${s.emoji ? `<div class="emo-big">${glyph(c, s.emoji)}</div>` : ''}${WS.str(s.title) ? `<h1 class="pagehead-t">${e(WS.str(s.title))}</h1>` : ''}${s.text ? `<p class="pagehead-s">${lines(s.text)}</p>` : ''}</div></section>`,
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
    create: (site) => ({ variant: 'simple', title: 'Get in touch', text: 'Send us a message and we’ll get back to you soon.', button: 'Send message', success: 'Thanks for your message. We’ll be in touch soon.', showPhone: true }),
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
    variants: { appointment: 'Appointment request', reservation: 'Table reservation', order: 'Order for pickup', quote: 'Quote request', application: 'Job application' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Intro text', type: 'textarea' },
      { key: 'services', label: 'Options people can pick', type: 'list', add: 'Add an option', item: [{ key: 'name', label: 'Option', type: 'text' }] },
      { key: 'button', label: 'Button text', type: 'text' },
      { key: 'success', label: 'Success message', type: 'text' },
    ],
    create: (site) => ({ variant: 'appointment', title: 'Book an appointment', text: 'Choose a time that suits you and we’ll confirm by text or email.', services: (site.biz.services || []).map((x) => ({ name: x.name })).filter((x) => x.name), button: 'Request appointment', success: 'Thanks. We’ll confirm your appointment shortly.' }),
    render: (s, c) => {
      const action = (c.site && c.site.siteId) ? ('https://websprout.app/api/form/' + e(c.site.siteId)) : '';
      const mode = s.variant || 'appointment';
      const names = (s.services || []).map((x) => (typeof x === 'string' ? x : (x && x.name) || '')).filter(Boolean);
      const svcLabel = mode === 'application' ? 'Position' : (mode === 'quote' ? 'What do you need?' : (mode === 'order' ? 'Item' : 'Service'));
      const svc = names.length ? `<label class="wf-l">${svcLabel}<select class="wf-i" name="service">${names.map((x) => `<option>${e(x)}</option>`).join('')}</select></label>` : '';
      let fields = '';
      if (mode === 'reservation') {
        const parties = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12+'];
        fields = `<div class="wf-row"><label class="wf-l">Date<input class="wf-i" type="date" name="date" required></label><label class="wf-l">Time<input class="wf-i" type="time" name="time" required></label></div><label class="wf-l">Party size<select class="wf-i" name="party">${parties.map((p) => `<option>${p}</option>`).join('')}</select></label>`;
      } else if (mode === 'order') {
        fields = `${svc}<label class="wf-l">What would you like?<textarea class="wf-i wf-t" name="details" rows="3" required></textarea></label><div class="wf-row"><label class="wf-l">Pickup date<input class="wf-i" type="date" name="date" required></label><label class="wf-l">Pickup time<input class="wf-i" type="time" name="time"></label></div>`;
      } else if (mode === 'quote') {
        fields = `${svc}<label class="wf-l">Tell us about the job<textarea class="wf-i wf-t" name="details" rows="4" required></textarea></label>`;
      } else if (mode === 'application') {
        fields = `${svc}<label class="wf-l">Relevant experience<textarea class="wf-i wf-t" name="experience" rows="4" required></textarea></label>`;
      } else {
        fields = `${svc}<div class="wf-row"><label class="wf-l">Preferred date<input class="wf-i" type="date" name="date"></label><label class="wf-l">Preferred time<input class="wf-i" type="time" name="time"></label></div>`;
      }
      const notes = (mode === 'quote') ? '' : `<label class="wf-l">${mode === 'application' ? 'Links or anything else (optional)' : 'Anything we should know?'}<textarea class="wf-i wf-t" name="notes" rows="3"></textarea></label>`;
      const reqLabel = mode === 'order' ? 'Pickup order' : mode === 'reservation' ? 'Reservation' : (mode === 'quote' ? 'Quote request' : (mode === 'application' ? 'Application' : 'Appointment'));
      const fallback = mode === 'order' ? 'Order ahead' : mode === 'reservation' ? 'Reserve a table' : (mode === 'quote' ? 'Request a quote' : (mode === 'application' ? 'Apply now' : 'Book an appointment'));
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
    create: (site) => ({ variant: 'check', title: 'Do we serve your area?', note: 'Enter your ZIP code to find out.', zips: '', yes: 'Good news: we cover your area. Get in touch and we’ll get you booked in.', no: 'We don’t cover your area yet, but send us a message and we’ll see what we can do.' }),
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
      const items = WS.filled(s.items, ['name', 'date']).map((x) => x.it);
      if (!items.length && c.mode === 'live') return '';
      const hd = s.title === '' ? '' : head(s, 'Upcoming events', 'Events');
      let body;
      if (!items.length) {
        body = `<p class="ev-empty">More events coming soon — check back shortly.</p>`;
      } else {
        body = `<ul class="ev-list">${items.map((it) => {
          const url = WS.safeUrl(it.url);
          const live = /^https?:\/\//i.test(url);
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
      const okUrl = (it) => /^https?:\/\//i.test(WS.safeUrl(it.url));
      const items = WS.filled(s.items, ['name', 'url', 'desc', 'amount']).map((x) => x.it).filter((it) => c.mode !== 'live' || okUrl(it));
      if (!items.length) return '';
      const cards = items.map((it) => {
        const url = WS.safeUrl(it.url);
        const live = okUrl(it);
        const amt = it.amount ? `<div class="pay-amt">${e(it.amount)}</div>` : '';
        const btn = live
          ? `<a class="btn btn-ink pay-btn" href="${e(url)}" target="_blank" rel="noopener">Pay now</a>`
          : `<span class="pay-soon">Add your link</span>`;
        return `<div class="pay-card"><div class="pay-body"><h3 class="pay-name">${e(WS.str(it.name) || 'Payment')}</h3>${it.desc ? `<p class="pay-desc">${e(it.desc)}</p>` : ''}${amt}</div>${btn}</div>`;
      }).join('');
      const hd = s.title === '' ? '' : head(s, 'Pay online');
      return `<section class="payments on-base" id="pay"><div class="wrap">${hd}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}<div class="pay-grid">${cards}</div><p class="pay-trust">Payments are handled securely by your payment provider.</p></div></section>`;
    },
  });

  // ---------- How it works (process steps) ----------
  R('steps', {
    label: 'How it works',
    blurb: 'A simple numbered walkthrough of your process.',
    variants: { grid: 'Numbered steps', line: 'Timeline' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'items', label: 'Steps', type: 'list', add: 'Add step', item: [{ key: 'name', label: 'Step title', type: 'text' }, { key: 'text', label: 'Detail', type: 'textarea' }] }],
    create: (site) => ({ variant: 'grid', title: 'How it works', items: [{ name: 'Reach out', text: 'Tell us what you need and when works for you.' }, { name: 'We plan it', text: 'We confirm the details and give you a clear, honest price.' }, { name: 'We deliver', text: 'We do the work and check you’re happy with it.' }] }),
    render: (s, c) => {
      const list = WS.filled(s.items, ['name', 'text']).map((x) => x.it);
      if (!list.length) return '';
      const items = list.map((it, i) => `<li class="step reveal"><span class="step-n">${s.variant === 'line' ? i + 1 : String(i + 1).padStart(2, '0')}</span><div><h3 class="step-t">${e(it.name || '')}</h3><p class="step-d">${lines(it.text || '')}</p></div></li>`).join('');
      return `<section class="steps steps-${s.variant === 'line' ? 'line' : 'num'} on-base" id="steps"><div class="wrap">${head(s, 'How it works', 'Process')}<ol class="steps-grid">${items}</ol></div></section>`;
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
          { key: 'value', label: 'Number', type: 'text', hint: 'Used when typed. Google numbers are always shown live, never typed' },
          { key: 'suffix', label: 'After the number', type: 'text', hint: 'e.g. + or ★ or k' },
          { key: 'emoji', label: 'Emoji', type: 'emoji' },
        ],
      },
    ],
    create: (site) => ({
      variant: 'row', title: '',
      items: [
        { label: 'Years on the block', source: 'years', value: site.biz.founded ? String(new Date().getFullYear() - +site.biz.founded) : '10', suffix: '', emoji: '' },
        { label: 'Google rating', source: 'google_rating', value: '', suffix: '★', emoji: '' },
        { label: 'Google reviews', source: 'google_reviews', value: '', suffix: '', emoji: '' },
        { label: 'Cuts this year', source: 'manual', value: '4,800', suffix: '+', emoji: '' },
      ],
    }),
    render: (s, c) => {
      // Google numbers are live only (a stored value is never shown): with no linked listing they're dropped, and on the
      // page they stay hidden until Google answers (data-gstat).
      const gsrc = (it) => /^google_/.test(it.source || '');
      const list = WS.filled(s.items, ['label', 'value']).map((x) => x.it).filter((it) => (gsrc(it) ? WS.googleLinked(c.site) : WS.str(it.value) !== '' || (it.source === 'years' && c.biz.founded)));
      if (!list.length) return '';
      const items = list.map((it) => {
        if (gsrc(it)) return `<div class="stat"${c.mode === 'edit' ? '' : ' data-gstat hidden'}>${it.emoji ? glyph(c, it.emoji, 'stat-emo') : ''}<p class="num"><span data-count="" data-src="${e(it.source)}">${c.mode === 'edit' ? '—' : ''}</span>${it.suffix ? `<small>${e(it.suffix)}</small>` : ''}</p><p class="lbl">${e(it.label)}</p></div>`;
        const val = it.source === 'years' && c.biz.founded ? String(new Date().getFullYear() - +c.biz.founded) : WS.str(it.value);
        return `<div class="stat">${it.emoji ? glyph(c, it.emoji, 'stat-emo') : ''}<p class="num"><span data-count="${e(String(val).replace(/,/g, ''))}" data-src="${e(it.source || 'manual')}" ${it.source === 'years' ? `data-founded="${e(c.biz.founded || '')}"` : ''}>${e(val)}</span>${it.suffix ? `<small>${e(it.suffix)}</small>` : ''}</p><p class="lbl">${e(it.label)}</p></div>`;
      });
      return `<section class="stats stats-${s.variant} ${s.variant === 'band' ? 'on-pop' : 'on-base'}"><div class="wrap">${head(s)}<div class="stat-row">${items.join('')}</div></div></section>`;
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
    create: (site) => ({ variant: 'menu', title: 'Prices', note: '', items: (site.biz.services || []).map((x) => ({ name: x.name, price: x.price, meta: [x.time, x.note].filter(Boolean).join(', ') })) }),
    render: (s, c) => {
      const rows = WS.filled(s.items, ['name', 'price', 'meta']).map((x) => x.it);
      if (!rows.length) return '';
      const list = `<ul class="plist">${rows.map((it) => { const pr = WS.str(it.price); return `<li><span class="svc">${e(it.name)}</span><span class="lead" aria-hidden="true"></span><span class="price">${WS.money(isNaN(+pr) || pr === '' ? pr : +pr)}</span>${bookBtn(c, 'pl-book', c.biz.bookLabel || 'Book')}${WS.str(it.meta) ? `<span class="meta">${e(it.meta)}</span>` : ''}</li>`; }).join('')}</ul>`;
      const top = `${head(s, 'Prices', 'Prices')}${s.note ? `<p class="lede">${lines(s.note)}</p>` : ''}`;
      if (s.variant === 'board') return `<section class="prices prices-board on-alt" id="prices"><div class="wrap">${top}<div class="board">${list}</div>${bookBtn(c, 'btn btn-ink', c.biz.bookLabel || 'Book now')}</div></section>`;
      return `<section class="prices prices-menu on-alt" id="prices">${c.slot('photo', { hint: 'A shave, a cut, or your tools', cls: 'pm-img reveal' })}<div class="pm-body">${top}${list}${bookBtn(c, 'btn btn-ink', c.biz.bookLabel || 'Book now')}</div></section>`;
    },
  });

  // ---------- Services ----------
  R('services', {
    label: 'Services',
    blurb: 'What you offer, each with an icon.',
    variants: { bento: 'Feature card with a photo, plus cards', grid: 'Cards', rows: 'Two-column list with icons', list: 'Big list', numbered: 'Numbered cards', feature: 'List beside a photo' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'Services', type: 'list', add: 'Add a service', item: [{ key: 'icon', label: 'Icon', type: 'select', options: () => [['', 'Automatic']].concat(WS.iconNames.map((n) => [n, WS.iconLabel(n)])) }, { key: 'emoji', label: 'Emoji (when the site uses emoji)', type: 'emoji' }, { key: 'name', label: 'Name', type: 'text' }, { key: 'text', label: 'Description', type: 'textarea' }, { key: 'from', label: 'Starting price', type: 'text' }] },
    ],
    create: (site) => {
      const recs = WS.emojiRecsFor(site.biz.type);
      return { variant: 'grid', title: 'What we do best', items: (site.biz.services || []).slice(0, 4).map((x, i) => ({ emoji: recs[(i + 2) % recs.length], name: x.name, text: x.desc || x.note || '', from: x.price ? String(x.price) : '' })) };
    },
    render: (s, c) => {
      const list = WS.filled(s.items, ['name', 'text', 'from']).map((x) => x.it);
      if (!list.length) return '';
      const v = /^(grid|rows|list|numbered|feature|bento)$/.test(s.variant) ? s.variant : 'grid';
      const from = (it) => (WS.str(it.from) ? `<span class="from">from ${WS.money(isNaN(+it.from) ? it.from : +it.from)}</span>` : '');
      const body = (it) => `${WS.str(it.name) ? `<h3>${e(it.name)}</h3>` : ''}${WS.str(it.text) ? `<p>${lines(it.text)}</p>` : ''}${from(it)}`;
      // Bento: the first service as a large feature card (on the section's photo when there is one), the rest as cards.
      if (v === 'bento') {
        const pic = c.photo('photo') || c.mode === 'edit';
        const [f0, ...rest] = list;
        const feat = `<li class="sb-feat${pic ? '' : ' sb-nopic'}">${pic ? c.slot('photo', { hint: 'A photo of this service', cls: 'sb-img', alt: WS.str(f0.name) }) : `<span class="sb-glyph" aria-hidden="true">${WS.iconSvg(WS.iconFor(f0, c.biz && c.biz.type))}</span>`}<div class="sb-body">${body(f0)}${bookBtn(c, 'sb-go', c.biz.bookLabel || 'Book now')}</div></li>`;
        const cards = rest.map((it, i) => `<li class="sb-card">${cardIcon(c, it)}<span class="sb-n" aria-hidden="true">${String(i + 2).padStart(2, '0')}</span>${body(it)}</li>`).join('');
        return `<section class="services services-bento ${s.tone || 'on-alt'}" id="services"><div class="wrap">${head(s, 'Services', offerWord(c))}<ul class="sv sb sb-n${list.length}" aria-label="${e(WS.str(s.title) || 'Services')}">${feat}${cards}</ul></div></section>`;
      }
      const items = list.map((it, i) => (v === 'numbered'
        ? `<li><span class="sv-n">${String(i + 1).padStart(2, '0')}</span>${body(it)}</li>`
        : v === 'grid' ? `<li>${cardIcon(c, it)}${body(it)}</li>` : `<li>${cardIcon(c, it)}<div class="sv-b">${body(it)}</div></li>`)).join('');
      const hd = head(s, 'Services', offerWord(c));
      if (v === 'feature') {
        const pic = c.slot('photo', { hint: 'A photo of your work', cls: 'svf-img' });
        return `<section class="services services-feature ${s.tone || 'on-alt'}${c.photo('photo') || c.mode === 'edit' ? '' : ' svf-solo'}" id="services"><div class="wrap svf-grid">${pic}<div class="svf-body">${hd}<ul class="sv">${items}</ul>${bookBtn(c, 'btn btn-ink', c.biz.bookLabel || 'Book now')}</div></div></section>`;
      }
      return `<section class="services services-${v} ${s.tone || 'on-alt'}" id="services"><div class="wrap">${hd}<ul class="sv${v === 'grid' || v === 'numbered' ? ' rail' : ''}" aria-label="${e(WS.str(s.title) || 'Services')}">${items}</ul></div></section>`;
    },
  });

  // ---------- Gallery ----------
  R('gallery', {
    label: 'Photo gallery',
    blurb: 'Show off your work. Every spot is an upload box.',
    variants: { strip: 'Three photos in a row', bento: 'One large photo, two beside it', grid: 'Six-photo mosaic' },
    fields: [{ key: 'title', label: 'Title (optional)', type: 'text' }],
    create: () => ({ variant: 'strip', title: '' }),
    render: (s, c) => {
      const hints = ['A client in the chair', 'Your best work', 'The shop itself', 'A detail shot', 'Your team', 'A happy customer'];
      const v = /^(strip|bento|grid)$/.test(s.variant) ? s.variant : 'strip';
      const n = v === 'grid' ? 6 : 3;
      const figs = Array.from({ length: n }, (_, i) => c.slot('p' + i, { hint: hints[i], cls: `g${i}` })).join('');
      const have = Array.from({ length: n }).filter((_, i) => c.photo('p' + i)).length;
      if (c.mode === 'live' && !have) return '';
      return `<section class="gallery gallery-${v} on-base${c.mode === 'live' ? ' gn' + have : ''}" aria-label="Photos"><div class="wrap">${s.title ? head(s, '', 'Gallery') : ''}<div class="g-wrap rail" role="group" aria-label="Photos">${figs}</div></div></section>`;
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
      const people = WS.filled(s.items, ['name', 'text']);
      if (!people.length) return '';
      const items = people.map((x) => x.it);
      if (s.variant === 'portraits')
        return `<section class="team team-portraits on-base" id="team"><div class="wrap">${head(s, 'Team', 'Team')}<ul class="tp">${people.map(({ it, i }) => `<li>${c.slot('m' + i, { hint: `A photo of ${it.name || 'them'}`, cls: 'tp-img reveal' })}<h3>${e(it.name)}</h3><p>${lines(it.text)}</p></li>`).join('')}</ul></div></section>`;
      return `<section class="team team-rows on-base" id="team"><div class="wrap">${head(s, 'Team', 'Team')}<ul class="tr">${items.map((it) => `<li><h3>${e(it.name)}</h3><p>${lines(it.text)}</p>${WS.str(it.name) ? bookBtn(c, '', 'Book with ' + WS.str(it.name)) : ''}</li>`).join('')}</ul></div></section>`;
    },
  });

  // ---------- Reviews ----------
  R('reviews', {
    label: 'Reviews',
    blurb: 'What customers say.',
    variants: { feature: 'One big quote', cards: 'Quote cards', wall: 'Wall of quotes', google: 'Live Google reviews' },
    fields: [{ key: 'title', label: 'Title', type: 'text', only: ['google', 'wall', 'cards'] }, { key: 'items', label: 'Reviews (shown if Google is unavailable)', type: 'list', add: 'Add a review', item: [{ key: 'quote', label: 'Quote', type: 'textarea' }, { key: 'name', label: 'Name', type: 'text' }] }],
    create: (site) => ({ variant: 'feature', items: (site.biz.reviews || []).map((r) => ({ quote: r.quote, name: r.name })) }),
    render: (s, c) => {
      const it = WS.filled(s.items, ['quote']).map((x) => x.it);
      if (s.variant === 'google') {
        // Typed reviews are the fallback; the runtime swaps in live Google reviews when a place is linked.
        const fb = it.map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('');
        if (!c.biz.googlePlaceId && !fb && c.mode !== 'edit') return '';
        // Live with nothing typed: stays hidden until Google reviews actually arrive (never an empty band).
        return `<section class="reviews reviews-wall reviews-google on-base" data-greviews${(c.biz.googleHidden || []).length ? ` data-ghide="${e(c.biz.googleHidden.join(' '))}"` : ''}${!fb && c.mode === 'live' ? ' hidden' : ''}><div class="wrap">${head(s, 'What people say', 'Reviews')}<div class="gr-sum" hidden></div><div class="rw">${fb || (c.mode === 'edit' ? '<blockquote><p>Your latest Google reviews will appear here once your Google Business Profile is linked.</p></blockquote>' : '')}</div><p class="gr-attr" hidden></p></div></section>`;
      }
      if (!it.length) return '';
      if (s.variant === 'wall')
        return `<section class="reviews reviews-wall on-base"><div class="wrap">${head(s, 'What people say', 'Reviews')}<div class="rw">${it.map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('')}</div></div></section>`;
      if (s.variant === 'cards')
        return `<section class="reviews reviews-cards ${s.tone || 'on-alt'}"><div class="wrap">${head(s, 'What people say', 'Reviews')}<ul class="rc rail" aria-label="Reviews">${it.slice(0, 6).map((r) => { const nm = WS.str(r.name); return `<li><blockquote><span class="rc-mark" aria-hidden="true">&ldquo;</span><p>${lines(r.quote)}</p>${nm ? `<footer><span class="rc-av" aria-hidden="true">${e(nm.charAt(0).toUpperCase())}</span>${e(nm)}</footer>` : ''}</blockquote></li>`; }).join('')}</ul></div></section>`;
      return `<section class="reviews reviews-feature on-pop">${c.bg('bg', { hint: 'a background photo', cls: 'rv-media' })}<div class="wrap"><blockquote class="big-q"><p>${lines(it[0].quote)}</p><footer>${e(it[0].name)}</footer></blockquote>${it.length > 1 ? `<div class="more">${it.slice(1, 4).map((r) => `<blockquote><p>${lines(r.quote)}</p><footer>${e(r.name)}</footer></blockquote>`).join('')}</div>` : ''}</div></section>`;
    },
  });

  // ---------- Before / after ----------
  R('beforeafter', {
    label: 'Before & after',
    blurb: 'Drag a slider between two photos. Great for transformations.',
    variants: { slider: 'Slider' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Caption', type: 'textarea' }],
    create: () => ({ variant: 'slider', title: 'Before and after.', text: 'Drag to see the difference.' }),
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
      const items = WS.filled(s.items, ['name', 'price']).map((x) => x.it);
      if (!items.length) return '';
      const cards = items.map((it) => {
        const feats = String(it.features || '').split('\n').map((x) => x.trim()).filter(Boolean);
        return `<article class="plan reveal${it.featured === 'yes' ? ' plan-hot' : ''}">${it.featured === 'yes' ? '<span class="plan-tag">Most popular</span>' : ''}<h3 class="plan-n">${e(it.name || '')}</h3><div class="plan-p"><b>${e(it.price || '')}</b>${it.per ? `<span>${e(it.per)}</span>` : ''}</div>${feats.length ? `<ul class="plan-f">${feats.map((f) => `<li>${e(f)}</li>`).join('')}</ul>` : ''}${bookBtn(c, 'btn' + (it.featured === 'yes' ? '' : ' ghost'), WS.str(it.button) || c.biz.bookLabel || 'Get started')}</article>`;
      }).join('');
      return `<section class="plans on-base" id="plans"><div class="wrap">${head(s, 'Packages', 'Pricing')}${s.text ? `<p class="lede">${lines(s.text)}</p>` : ''}<div class="plans-grid">${cards}</div></div></section>`;
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
    variants: { accordion: 'Expandable list', open: 'All answers shown' },
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
    render: (s) => {
      const list = WS.filled(s.items, ['q']).map((x) => x.it);
      if (!list.length) return '';
      if (s.variant === 'open') return `<section class="faq faq-open ${s.tone || 'on-base'}" id="faq"><div class="wrap faq-grid">${head(s, 'Questions', 'FAQ')}<div class="qa qa-open">${list.map((it) => `<div class="qa-i"><h3>${e(it.q)}</h3>${WS.str(it.a) ? `<p>${lines(it.a)}</p>` : ''}</div>`).join('')}</div></div></section>`;
      return `<section class="faq ${s.tone || 'on-base'}" id="faq"><div class="wrap faq-grid">${head(s, 'Questions', 'FAQ')}<div class="qa">${list.map((it) => `<details><summary>${e(it.q)}</summary>${WS.str(it.a) ? `<p>${lines(it.a)}</p>` : ''}</details>`).join('')}</div></div></section>`;
    },
  });

  // ---------- Call to action ----------
  R('cta', {
    label: 'Call to action',
    blurb: 'A loud band that asks people to book or call.',
    variants: { band: 'Color band', card: 'Rounded color card', split: 'With a photo' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'text', label: 'Text', type: 'textarea' }, { key: 'button', label: 'Button text', type: 'text' }, { key: 'link', label: 'Button link (optional)', type: 'text' }, { key: 'emoji', label: 'Emoji', type: 'emoji' }],
    create: (site) => ({ variant: 'band', title: 'We’d love to see you.', text: 'Book online in under a minute.', button: site.biz.bookLabel || 'Book now', link: '', emoji: WS.emojiRecsFor(site.biz.type)[0] }),
    render: (s, c) => {
      const t = WS.str(s.title), href = c.link(s.link) || c.book;
      const h2 = t ? `<h2 class="h2">${s.emoji ? glyph(c, s.emoji) + ' ' : ''}${e(t)}</h2>` : '';
      const p = WS.str(s.text) ? `<p>${lines(s.text)}</p>` : '';
      const btn = (cls) => (href ? `<a class="btn ${cls}" href="${href}">${e(WS.str(s.button) || 'Book now')}</a>` : '');
      if (c.mode === 'live' && !t && !p && !href) return '';
      const tel = c.biz.phone && !/^tel:/.test(href) ? `<a class="btn btn-line" href="${WS.tel(c.biz.phone)}">${WS.iconSvg('phone')}${e(c.biz.phone)}</a>` : '';
      // s.phone: the page has no location block, so the band carries the phone number next to its button.
      if (s.variant !== 'card' && s.variant !== 'split' && s.phone && tel) return `<section class="cta cta-band on-pop"><div class="wrap cta-row">${h2}<div>${p}<div class="actions">${btn('btn-light')}${tel}</div></div></div></section>`;
      if (s.variant === 'card') {
        return `<section class="cta cta-card on-base"><div class="wrap"><div class="cc-box on-pop"><div class="cc-copy">${h2}${p}</div><div class="actions">${btn('btn-light')}${tel}</div></div></div></section>`;
      }
      return s.variant === 'split'
        ? `<section class="cta cta-split on-alt">${c.slot('photo', { hint: 'A welcoming photo', cls: 'cta-img reveal' })}<div class="cta-body">${h2}${p}${btn('btn-ink')}</div></section>`
        : `<section class="cta cta-band on-pop"><div class="wrap cta-row">${h2}<div>${p}${btn('btn-light')}</div></div></section>`;
    },
  });

  // ---------- Visit ----------
  // A map shows whenever there is an address: the "map" layout embeds Google's keyless map (lazy-loaded); the default
  // layout shows a designed placeholder that loads the same map only when the visitor taps "Show map" (no third-party
  // request until then). Hours get a table with today highlighted and a live open/closed line.
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  R('visit', {
    label: 'Location and hours',
    blurb: 'Address, map, directions and opening hours.',
    variants: { hours: 'Address and hours (map on tap)', map: 'With a map' },
    fields: [{ key: 'title', label: 'Title', type: 'text', hint: 'Leave empty to say "Find us on [your street]"' }],
    create: () => ({ variant: 'hours', title: '' }),
    render: (s, c) => {
      const addr = String(c.biz.address || '').trim();
      const st = WS.streetOf(addr);
      const hrs = (c.biz.hours || []).filter((h) => h && h.d);
      const hasHours = hrs.some((h) => h.open);
      const ig = WS.igHandle(c.biz.instagram);
      const title = WS.str(s.title) || (st ? `Find us on ${st}.` : addr ? 'Come see us.' : (c.biz.city ? `Serving ${WS.cityName(c.biz.city)}.` : 'Get in touch.'));
      const reach = [c.biz.phone ? `<tr><th scope="row">Call</th><td><a href="${WS.tel(c.biz.phone)}">${e(c.biz.phone)}</a></td></tr>` : '', c.biz.email ? `<tr><th scope="row">Email</th><td><a href="mailto:${e(c.biz.email)}">${e(c.biz.email)}</a></td></tr>` : '', ig ? `<tr><th scope="row">Instagram</th><td><a href="https://instagram.com/${e(ig)}">@${e(ig)}</a></td></tr>` : '', c.biz.city ? `<tr><th scope="row">Area</th><td>${e(c.biz.city)}</td></tr>` : ''].join('');
      const dayIx = (d, i) => { const k = DAYS.indexOf(String(d).slice(0, 3).toLowerCase()); return k > -1 ? k : i; };
      const hours = hasHours
        ? `<table class="hours" aria-label="Opening hours">${hrs.map((h, i) => `<tr data-day="${dayIx(h.d, i)}"><th scope="row">${e(h.d)}</th><td>${h.open && h.close ? `${WS.fmtTime(h.open)} to ${WS.fmtTime(h.close)}` : 'Closed'}</td></tr>`).join('')}</table>`
        : '';
      const reachT = reach ? `<table class="hours reach" aria-label="How to reach us">${reach}</table>` : '';
      const status = hasHours ? `<p class="v-status"><span class="v-dot" aria-hidden="true"></span><span data-status></span></p>` : '';
      const callBtn = c.biz.phone ? `<a class="btn ghost" href="${WS.tel(c.biz.phone)}">Call us</a>` : '';
      const acts = `${bookBtn(c, 'btn', c.biz.bookLabel || 'Book now')}${addr ? `<a class="btn ghost" href="${WS.map(addr)}">Get directions</a>` : ''}${callBtn}`;
      const info = `<div class="v-info"><div class="sh">${eyebrow(s, 'Visit', title)}<h2 class="h2">${e(title)}</h2></div>${addr ? `<a class="addr" href="${WS.map(addr)}">${e(addr)}</a>` : ''}${status}${acts ? `<div class="actions">${acts}</div>` : ''}`;
      if (addr) {
        // With a Maps Embed key: the map (now, or on a click). Without one: a directions link, which the page's runtime
        // turns into a "Show map" button when the server gives the page a key (meta ws-maps-key).
        const mkey = WS.str(c.site && c.site.mapsEmbedKey) || WS.str(WS.mapsKey);
        const embed = WS.mapEmbed(addr, mkey);
        const map = embed && s.variant === 'map'
          ? `<iframe class="mapf" title="Map to ${e(c.name)}" src="${e(embed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
          : `<div class="vm-ph" data-ws-map="${e(addr)}"${embed ? ` data-map="${e(embed)}"` : ''}${s.variant === 'map' ? ' data-ws-map-now' : ''} data-map-title="Map to ${e(c.name)}"><span class="vm-pin">${WS.iconSvg('map-pin')}</span><p class="vm-a">${e(addr)}</p><button type="button" class="btn btn-ink vm-load"${embed ? '' : ' hidden'}>Show map</button><a class="btn btn-ink vm-dir" href="${WS.map(addr)}" target="_blank" rel="noopener"${embed ? ' hidden' : ''}>Get directions</a><p class="vm-n"${embed ? '' : ' hidden'}>Loads Google Maps</p></div>`;
        return `<section class="visit visit-geo on-base" id="visit"><div class="wrap visit-grid">${info}${hours || reachT}</div><div class="v-map">${map}</div></div></section>`;
      }
      if (!hours) return `<section class="visit visit-solo on-base" id="visit"><div class="wrap"><div class="v-info v-solo"><div class="sh">${eyebrow(s, 'Contact', title)}<h2 class="h2">${e(title)}</h2></div>${reachT}${acts ? `<div class="actions">${acts}</div>` : ''}</div></div></section>`;
      return `<section class="visit on-base" id="visit"><div class="wrap visit-grid">${info}</div>${hours}</div></section>`;
    },
  });

  // ---------- Trust, why us, service area (built only from the owner's real answers) ----------
  // Towns the business serves: an array or a comma / newline separated string -> up to 12 tidy, de-duplicated names.
  WS.townList = (v) => {
    const raw = Array.isArray(v) ? v : String(v == null ? '' : v).split(/[,;\n]+/);
    const seen = {}, out = [];
    raw.forEach((x) => { const t = WS.str(x).replace(/\s+/g, ' ').replace(/^(and|&)\s+/i, '').slice(0, 40).trim(); const k = t.toLowerCase(); if (t && !seen[k] && out.length < 12) { seen[k] = 1; out.push(t); } });
    return out;
  };
  // The city as said in a sentence: "Asheville, NC" / "Austin, TX 78701" / "Asheville North Carolina" -> "Asheville".
  // Prose uses this; contact details, the footer and structured data keep the full city.
  const ST_ABBR = 'AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC';
  const ST_NAME = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|District of Columbia';
  const CITY_TAIL = new RegExp('\\s+(?:(?:' + ST_ABBR + ')|(?:' + ST_NAME.replace(/(\w)(\w*)/g, (m, a, b) => '[' + a.toUpperCase() + a.toLowerCase() + ']' + b) + '))\\.?$');
  WS.cityName = (v) => {
    const full = WS.str(v).replace(/\s+/g, ' ');
    let c = full.replace(/[\s,]*\b\d{5}(?:-\d{4})?$/, '').trim();
    c = c.indexOf(',') > 0 ? c.slice(0, c.indexOf(',')).trim() : c.replace(CITY_TAIL, '').trim();
    return c || full;
  };
  // A section's own towns when the owner typed some there, else the ones from setup (biz.towns).
  const townsOf = (s, c) => { const own = WS.townList(s && s.towns); return own.length ? own : WS.townList(c.biz && c.biz.towns); };
  // The founding year as a number when it is a real past year (else 0).
  WS.foundedYear = (v) => { const s = WS.str(v), y = parseInt(s, 10), now = new Date().getFullYear(); return /^\d{4}$/.test(s) && y >= 1800 && y <= now ? y : 0; };
  // Trust badges, only from real data. A section toggle (true/false) overrides the setup answer.
  WS.trustBadges = (site, sec) => {
    const b = (site && site.biz) || {}, s = sec || {}, out = [];
    const yes = (k) => (typeof s[k] === 'boolean' ? s[k] : b[k] === true);
    if (yes('licensed')) out.push({ k: 'licensed', icon: 'shield-check', label: 'Licensed', sub: 'Qualified pros' });
    if (yes('insured')) out.push({ k: 'insured', icon: 'badge-check', label: 'Insured', sub: 'For your peace of mind' });
    const y = WS.foundedYear(WS.str(s.founded) || b.founded), yrs = y ? new Date().getFullYear() - y : 0;
    if (y) out.push({ k: 'founded', icon: 'calendar', label: 'Since ' + y, sub: yrs >= 2 ? yrs + ' years in business' : 'Established', yrs: yrs >= 2 ? y : 0 });
    if (s.showRating !== false && WS.googleLinked(site)) out.push({ k: 'rating', icon: 'star', label: 'Google rating', sub: 'Shown live from Google', live: true });
    const t = s.showArea === false ? [] : townsOf(s, { biz: b });
    // "Serving Asheville & 3 nearby towns": the home city leads, and only the other towns are counted.
    const city = WS.cityName(b.city), lc = city.toLowerCase(), near = t.filter((x) => x.toLowerCase() !== lc), lead = city && (near.length < t.length || !WS.townList(s.towns).length) ? city : t[0], more = lead === t[0] ? near.filter((x) => x !== t[0]) : near;
    if (t.length) out.push({ k: 'area', icon: 'map-pin', label: 'Serving ' + lead, sub: more.length ? '& ' + more.length + ' nearby town' + (more.length > 1 ? 's' : '') : '& nearby areas' });
    return out;
  };
  const yrsSpan = (x) => (x.yrs ? `<span data-yrs="${x.yrs}">${new Date().getFullYear() - x.yrs}</span> years in business` : e(x.sub));
  R('trust', {
    label: 'Trust badges',
    blurb: 'Licensed, insured, years in business, your Google rating and where you work, as a slim band.',
    variants: { strip: 'Slim row', cards: 'Cards', band: 'Bold numbers band' },
    fields: [
      { key: 'title', label: 'Title (cards only, optional)', type: 'text', only: ['cards'] },
      { key: 'licensed', label: 'Show "Licensed"', type: 'toggle', fallback: (site) => !!(site && site.biz && site.biz.licensed === true) },
      { key: 'insured', label: 'Show "Insured"', type: 'toggle', fallback: (site) => !!(site && site.biz && site.biz.insured === true) },
      { key: 'founded', label: 'Year you started', type: 'text', hint: 'e.g. 2008', fallback: (site) => WS.str(site && site.biz && site.biz.founded) },
      { key: 'showRating', label: 'Show your Google rating (when linked)', type: 'toggle', fallback: () => true },
      { key: 'showArea', label: 'Show the towns you serve', type: 'toggle', fallback: () => true },
    ],
    create: () => ({ variant: 'strip', title: '' }),
    render: (s, c) => {
      const list = WS.trustBadges(c.site, s);
      if (list.length < 2) return '';
      const v = s.variant === 'cards' ? 'cards' : s.variant === 'band' ? 'band' : 'strip';
      if (v === 'band') {
        // Big figures where there is a real number (years, rating, towns), an icon where it's a yes (licensed, insured).
        const lic = list.filter((x) => x.k === 'licensed' || x.k === 'insured');
        const out = [];
        list.forEach((x) => {
          if (x.k === 'founded') out.push(x.yrs ? `<li><p class="tbb-num"><span data-count="${new Date().getFullYear() - x.yrs}" data-src="years" data-founded="${x.yrs}">${new Date().getFullYear() - x.yrs}</span></p><p class="tbb-l">Years in business</p></li>` : `<li><p class="tbb-num">${e(x.label.replace(/^Since /, ''))}</p><p class="tbb-l">Established</p></li>`);
          else if (x.k === 'rating') out.push(WS.gLive(c, `<p class="tbb-num"><span data-g="rating"></span><small aria-hidden="true">★</small></p><p class="tbb-l" data-g="sub">Google rating</p>`, `<p class="tbb-num tbb-ico">${WS.iconSvg('star')}</p><p class="tbb-l">Google rating (live)</p>`, 'li'));
          else if (x.k === 'area') { const m = /^& (\d+) nearby/.exec(x.sub || ''); const n = m ? +m[1] + 1 : 0; out.push(n >= 2 ? `<li><p class="tbb-num"><span data-count="${n}" data-src="trust">${n}</span></p><p class="tbb-l">Towns served around ${e(x.label.replace(/^Serving /, ''))}</p></li>` : `<li><p class="tbb-num tbb-ico">${WS.iconSvg('map-pin')}</p><p class="tbb-l">${e(x.label)}</p></li>`); }
        });
        if (lic.length) out.unshift(`<li><p class="tbb-num tbb-ico">${WS.iconSvg('shield-check')}</p><p class="tbb-l">${lic.length > 1 ? 'Licensed &amp; insured' : e(lic[0].label)}</p></li>`);
        return `<section class="trust trust-band on-pop" id="trust"><div class="wrap"><ul class="tbb tb-n${out.length}" aria-label="Why you can trust us">${out.join('')}</ul></div></section>`;
      }
      const li = list.map((x) => (x.live
        ? WS.gLive(c, `<span class="tb-ic">${WS.iconSvg(x.icon)}</span><span class="tb-t"><b><span data-g="rating"></span> on Google</b><small data-g="sub">Google rating</small></span>`, `<span class="tb-ic">${WS.iconSvg(x.icon)}</span><span class="tb-t"><b>${e(x.label)}</b><small>${e(x.sub)}</small></span>`, 'li', ` class="tb-${x.k}"`)
        : `<li class="tb-${x.k}"><span class="tb-ic">${WS.iconSvg(x.icon)}</span><span class="tb-t"><b>${e(x.label)}</b><small>${yrsSpan(x)}</small></span></li>`)).join('');
      if (v === 'cards') return `<section class="trust trust-cards on-base" id="trust"><div class="wrap">${WS.str(s.title) ? head(s, '', 'Why trust us') : ''}<ul class="tb-cards tb-n${list.length}" aria-label="Why you can trust us">${li}</ul></div></section>`;
      return `<section class="trust trust-strip on-base" id="trust"><div class="wrap"><ul class="tb-row tb-n${list.length}" aria-label="Why you can trust us">${li}</ul></div></section>`;
    },
  });

  R('why', {
    label: 'Why choose us',
    blurb: 'Three or four short reasons people pick you, each with an icon.',
    variants: { grid: 'Points in a row', split: 'Points beside a photo' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'items', label: 'Reasons', type: 'list', add: 'Add a reason', item: [{ key: 'icon', label: 'Icon', type: 'select', options: () => [['', 'Automatic']].concat(WS.iconNames.map((n) => [n, WS.iconLabel(n)])) }, { key: 'title', label: 'Reason', type: 'text' }, { key: 'text', label: 'One line about it', type: 'textarea' }] },
    ],
    create: (site) => {
      const b = (site && site.biz) || {}, it = [];
      if (WS.str(b.unique)) it.push({ icon: 'sparkles', title: 'What sets us apart', text: WS.str(b.unique).slice(0, 200) });
      if (b.licensed === true || b.insured === true) it.push({ icon: 'shield-check', title: b.licensed === true && b.insured === true ? 'Licensed and insured' : b.licensed === true ? 'Fully licensed' : 'Fully insured', text: 'Work done properly, with the paperwork to back it up.' });
      if (WS.foundedYear(b.founded)) it.push({ icon: 'calendar', title: 'Here since ' + WS.foundedYear(b.founded), text: 'Years of experience, and neighbours who keep coming back.' });
      [['message-circle', 'Straight answers', 'Clear prices and honest advice, before any work starts.'], ['clock', 'On time', 'We turn up when we say we will and keep you posted.'], ['thumbs-up', 'Done right', 'We are not finished until you are happy with it.']].forEach((x) => { if (it.length < 3) it.push({ icon: x[0], title: x[1], text: x[2] }); });
      return { variant: 'grid', title: 'Why people choose us', items: it };
    },
    render: (s, c) => {
      const list = WS.filled(s.items, ['title', 'text']).map((x) => x.it).slice(0, 4);
      if (!list.length) return '';
      const ic = (it) => `<span class="ic">${WS.iconSvg(WS.ICONS[it.icon] ? it.icon : WS.iconFor({ name: it.title }, c.biz && c.biz.type))}</span>`;
      const pts = list.map((it) => `<li>${ic(it)}<div>${WS.str(it.title) ? `<h3>${e(it.title)}</h3>` : ''}${WS.str(it.text) ? `<p>${lines(it.text)}</p>` : ''}</div></li>`).join('');
      const hd = head(s, 'Why people choose us', 'Why us');
      if (s.variant === 'split') {
        const pic = c.photo('photo') || c.mode === 'edit';
        return `<section class="why why-split${pic ? '' : ' why-nopic'} on-base" id="why"><div class="wrap wy-grid">${pic ? c.slot('photo', { hint: 'You at work, or a finished job', cls: 'wy-img' }) : `<div class="wy-side">${hd}</div>`}<div class="wy-body">${pic ? hd : ''}<ul class="wy-list">${pts}</ul></div></div></section>`;
      }
      return `<section class="why why-grid on-base" id="why"><div class="wrap">${hd}<ul class="wy-cols wy-n${list.length}">${pts}</ul></div></section>`;
    },
  });

  R('area', {
    label: 'Areas we serve',
    blurb: 'The towns you cover, with a call and a quote button.',
    variants: { pills: 'Town tags', list: 'Town list in columns' },
    fields: [
      { key: 'title', label: 'Title', type: 'text', hint: 'Leave empty for "Areas we serve"' },
      { key: 'towns', label: 'Towns you serve (one per line or commas)', type: 'textarea', fallback: (site) => WS.townList(site && site.biz && site.biz.towns).join(', ') },
      { key: 'text', label: 'Note', type: 'textarea' },
    ],
    create: (site) => ({ variant: 'pills', title: '', towns: '', text: 'Not sure if we cover you? Give us a call and we will let you know.' }),
    render: (s, c) => {
      const towns = townsOf(s, c);
      if (!towns.length) return '';
      const t = WS.str(s.title) || 'Areas we serve';
      const note = WS.str(s.text) || 'Not sure if we cover you? Give us a call and we will let you know.';
      const tel = WS.str(c.biz.phone).replace(/[^\d+]/g, '').length >= 7 ? `<a class="btn${c.book && !/^tel:/.test(c.book) ? ' ghost' : ''}" href="${WS.tel(c.biz.phone)}">${WS.iconSvg('phone')}Call ${e(c.biz.phone)}</a>` : '';
      const quote = c.book && !/^tel:/.test(c.book) ? `<a class="btn" href="${c.book}">${e(c.biz.bookLabel || 'Get a quote')}</a>` : '';
      const v = s.variant === 'list' ? 'list' : 'pills';
      const items = towns.map((x) => `<li>${WS.iconSvg('map-pin')}<span>${e(x)}</span></li>`).join('') + `<li class="ar-more"><span>and nearby</span></li>`;
      return `<section class="area area-${v} on-base" id="area"><div class="wrap ar-grid"><div class="ar-copy"><div class="sh">${eyebrow(s, 'Service area', t)}<h2 class="h2">${e(t)}</h2></div><p class="ar-note">${lines(note)}</p>${quote || tel ? `<div class="actions">${quote}${tel}</div>` : ''}</div><ul class="ar-towns" aria-label="Towns we serve">${items}</ul></div></section>`;
    },
  });

  // Order the "Add section" library is shown in.
  WS.sectionOrder = ['pagehead', 'hero', 'announce', 'intro', 'stats', 'services', 'steps', 'prices', 'plans', 'embed', 'payments', 'events', 'gallery', 'beforeafter', 'team', 'reviews', 'faq', 'trust', 'why', 'area', 'booking', 'servicearea', 'cta', 'contact', 'visit'];
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
.wsp-ph{position:relative}.wsp-ph .wsp-fb{display:none}.wsp-ph.empty .wsp-fb{display:grid;place-items:center}
.wsp-ask{display:none;align-items:center;font:inherit;font-weight:700;font-size:.86rem;padding:9px 15px;border-radius:9px;border:1px solid currentColor;color:inherit;text-decoration:none;white-space:nowrap}
.wsp-ask.on,.ws-nopay .wsp-ask{display:inline-flex}
.ws-nopay .wsp-buy,.ws-nopay .wsp-cart,.ws-nopay .wsp-draw{display:none!important}
.wsp-tot[hidden]{display:none}
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
    var tt=draw&&draw.querySelector('[data-total]'),tw=draw&&draw.querySelector('.wsp-tot'),sum=total();if(tt)tt.textContent=sum>0?'$'+sum.toFixed(2):'';if(tw)tw.hidden=!(sum>0);
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
      // Keep each product's original index: its photo lives in slot 'p<index>'.
      const list = WS.filled(s.items, ['name', 'price', 'desc']);
      if (!list.length && c.mode !== 'edit') return '';
      // "Ask about this" goes to the site's contact method; it replaces Add to cart for unpriced products, and
      // for every product when the published site cannot take payments (the server adds body.ws-nopay).
      const ask = c.contact;
      let priced = 0;
      const cards = list.map(({ it, i }) => {
        const src = c.photo && c.photo('p' + i);
        const fb = WS.emoji(it.emoji || '1f4e6', 'emo-big');
        const img = src
          ? `<figure class="wsp-ph"><img src="${e(src)}"${WS.srcset(src, '(max-width: 760px) 50vw, 300px')} alt="${e(it.name)}" loading="lazy" decoding="async" onerror="var f=this.parentNode;if(f)f.classList.add('empty');this.remove();"><span class="wsp-fb" aria-hidden="true">${fb}</span></figure>`
          : (c.mode === 'edit'
              ? c.slot('p' + i, { hint: 'Product photo', cls: 'wsp-ph' })
              : `<div class="wsp-ph empty" aria-hidden="true">${fb}</div>`);
        const pr = WS.str(it.price);
        const canBuy = !isNaN(WS.priceNum(pr));
        if (canBuy) priced++;
        const askA = ask ? `<a class="wsp-ask${canBuy ? '' : ' on'}" href="${ask}">Ask about this</a>` : '';
        const buy = canBuy ? `<button class="wsp-buy" type="button" data-n="${e(it.name)}" data-p="${e(pr)}">Add to cart</button>` : '';
        const row = pr || buy || askA ? `<div class="wsp-r">${pr ? `<span class="wsp-pr">${money(pr)}</span>` : ''}${buy}${askA}</div>` : '';
        return `<article class="wsp-card">${img}<div class="wsp-b">${WS.str(it.name) ? `<h3 class="wsp-n">${e(it.name)}</h3>` : ''}${WS.str(it.desc) ? `<p class="wsp-d">${e(it.desc)}</p>` : ''}${row}</div></article>`;
      }).join('');
      const cart = c.mode === 'edit' || !priced ? '' :
        `<button class="wsp-cart" type="button" aria-label="Open cart">Cart &middot; <b>0</b></button><div class="wsp-draw" data-site="${e(c.site.siteId || '')}"><div class="wsp-panel"><button class="wsp-close" type="button" aria-label="Close cart">&times;</button><h3>Your cart</h3><div data-lines></div><div class="wsp-tot" hidden><span>Total</span><span data-total></span></div><button class="wsp-co" type="button">Checkout</button></div></div>` + CART_JS;
      return `<section id="shop" class="shop on-base" data-wsshop>${SHOP_CSS}<div class="wrap"><h2 class="h2">${e(WS.str(s.title) || 'Shop')}</h2><div class="wsp-grid">${cards}</div></div></section>${cart}`;
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
  // Four more pairings (two families each, few weights, same Google Fonts loading as above).
  //   refined: DM Serif Display + DM Sans (warm, upscale: salons, spas, bakeries, florists, boutiques)
  //   grotesk: Inter Tight + Inter (modern, precise: trades, tech-minded services, gyms, studios)
  //   friendly: Nunito + Nunito Sans (soft, rounded: childcare, pets, cleaning, cafés, tutoring)
  //   classic: Playfair Display + Source Sans 3 (traditional editorial: law, finance, real estate, restaurants)
  const tv = (display, body, o) => Object.assign({ '--display': display, '--body': body, '--mono': body, '--h-transform': 'none' }, o);
  const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  Object.assign(WS.typeThemes, {
    refined: { fonts: ['DM+Serif+Display', 'DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600'], vars: tv("'DM Serif Display',Georgia,'Times New Roman',serif", "'DM Sans'," + SANS, { '--h-weight': '400', '--h-tracking': '-.01em', '--h-lh': '1.04', '--name-weight': '400', '--name-lh': '.98', '--name-tracking': '-.02em', '--mark-weight': '400', '--mark-tracking': '0', '--btn-radius': '999px', '--btn-weight': '500' }) },
    grotesk: { fonts: ['Inter+Tight:wght@500;600;700', 'Inter:wght@400;500;600'], vars: tv("'Inter Tight','Inter'," + SANS, "'Inter'," + SANS, { '--h-weight': '600', '--h-tracking': '-.03em', '--h-lh': '1.0', '--name-weight': '600', '--name-lh': '.94', '--name-tracking': '-.045em', '--mark-weight': '700', '--mark-tracking': '-.02em', '--btn-radius': '8px', '--btn-weight': '600' }) },
    friendly: { fonts: ['Nunito:wght@700;800', 'Nunito+Sans:wght@400;600;700'], vars: tv("'Nunito','Nunito Sans'," + SANS, "'Nunito Sans'," + SANS, { '--h-weight': '800', '--h-tracking': '-.015em', '--h-lh': '1.05', '--name-weight': '800', '--name-lh': '.98', '--name-tracking': '-.025em', '--mark-weight': '800', '--mark-tracking': '-.01em', '--btn-radius': '999px', '--btn-weight': '700' }) },
    classic: { fonts: ['Playfair+Display:wght@500;600;700', 'Source+Sans+3:wght@400;600'], vars: tv("'Playfair Display',Georgia,'Times New Roman',serif", "'Source Sans 3'," + SANS, { '--h-weight': '600', '--h-tracking': '-.01em', '--h-lh': '1.06', '--name-weight': '600', '--name-lh': '1.0', '--name-tracking': '-.02em', '--mark-weight': '700', '--mark-tracking': '0', '--btn-radius': '3px', '--btn-weight': '600' }) },
  });
  // Four more with stronger character:
  //   sturdy: Barlow Condensed + Barlow (confident, signage-like: roofers, movers, auto, gyms)
  //   geo: Outfit + Manrope (geometric, modern: plumbers, electricians, cleaners, dentists)
  //   elegant: Cormorant Garamond + Jost (high-contrast serif: florists, spas, law, weddings)
  //   warm: Fraunces + Manrope (soft, characterful serif: groomers, bakeries, cafés, yoga)
  Object.assign(WS.typeThemes, {
    sturdy: { fonts: ['Barlow+Condensed:wght@600;700;800', 'Barlow:wght@400;500;600'], vars: tv("'Barlow Condensed','Arial Narrow'," + SANS, "'Barlow'," + SANS, { '--h-transform': 'uppercase', '--h-weight': '700', '--h-tracking': '.005em', '--h-lh': '.96', '--name-weight': '800', '--name-lh': '.92', '--name-tracking': '0', '--mark-weight': '800', '--mark-tracking': '.02em', '--btn-radius': '4px', '--btn-weight': '600' }) },
    geo: { fonts: ['Outfit:wght@500;600;700', 'Manrope:wght@400;500;600'], vars: tv("'Outfit'," + SANS, "'Manrope'," + SANS, { '--h-weight': '600', '--h-tracking': '-.025em', '--h-lh': '1.0', '--name-weight': '600', '--name-lh': '.96', '--name-tracking': '-.035em', '--mark-weight': '700', '--mark-tracking': '-.01em', '--btn-radius': '10px', '--btn-weight': '600' }) },
    elegant: { fonts: ['Cormorant+Garamond:ital,wght@0,500;0,600;1,500', 'Jost:wght@400;500;600'], vars: tv("'Cormorant Garamond',Georgia,'Times New Roman',serif", "'Jost'," + SANS, { '--h-weight': '600', '--h-tracking': '-.01em', '--h-lh': '1.0', '--name-weight': '500', '--name-lh': '.96', '--name-tracking': '-.02em', '--mark-weight': '600', '--mark-tracking': '.01em', '--btn-radius': '0px', '--btn-weight': '500' }) },
    warm: { fonts: ['Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700', 'Manrope:wght@400;500;600'], vars: tv("'Fraunces',Georgia,'Times New Roman',serif", "'Manrope'," + SANS, { '--h-weight': '600', '--h-tracking': '-.02em', '--h-lh': '1.02', '--name-weight': '600', '--name-lh': '.98', '--name-tracking': '-.03em', '--mark-weight': '700', '--mark-tracking': '-.01em', '--btn-radius': '999px', '--btn-weight': '600' }) },
  });
  // Names for the editor's font picker (in this order).
  WS.typeNames = { bold: 'Bold condensed', sturdy: 'Sturdy condensed', editorial: 'Editorial serif', elegant: 'Elegant serif', warm: 'Warm serif', clean: 'Clean sans', geo: 'Geometric sans', refined: 'Refined serif', grotesk: 'Modern grotesk', friendly: 'Friendly rounded', classic: 'Classic editorial' };
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
.on-soft{background:var(--soft);color:var(--soft-text);--fg:var(--soft-text);--bg:var(--soft);--accent-ink:var(--soft-ink);--surface:var(--soft-surface)}
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
.top nav a{white-space:nowrap;max-width:18ch;overflow:hidden;text-overflow:ellipsis;padding:6px 0;margin:-6px 0}
.top nav a.active::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--accent);border-radius:2px}
main{min-height:55vh}
.ws-padtop{padding-top:clamp(84px,11vh,112px)}
.ws-notice-a{justify-content:center;margin-top:30px}
.ws-nf[hidden]{display:none}
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
.hero .status:has([data-status]:empty){display:none}
.pole{display:none}
.name{font-family:var(--display);font-size:clamp(52px,9.4vw,150px);line-height:var(--name-lh,.84);font-weight:var(--name-weight,900);letter-spacing:var(--name-tracking,.005em);text-transform:var(--h-transform,uppercase);padding-bottom:.02em}
/* monochrome signature: in the bold theme, lines after the first are set in outline */
.wst-bold .hero-split .ln + .ln > span,.wst-bold .hero-type .ln + .ln > span{-webkit-text-stroke:2px var(--accent-ink,var(--accent));color:color-mix(in srgb,var(--accent-ink,var(--accent)),transparent 92%)}
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
.hs-solo .hs-grid,.hs-grid:has(.hs-img[hidden]){grid-template-columns:1fr}
.hs-solo .hs-copy,.hs-grid:has(.hs-img[hidden]) .hs-copy{max-width:900px}
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
.foot-col{display:flex;flex-direction:column;gap:4px;min-width:0}
.foot-col h4{margin:0 0 4px;font:600 11px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.foot-col a,.foot-col span{overflow-wrap:anywhere}.foot-col a{padding:2px 0}td a{display:inline-block;padding:3px 0}
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
.step-n{display:block;width:auto;height:auto;border-radius:0;background:none;color:var(--accent-ink,var(--accent));font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(44px,4.4vw,60px);line-height:1;margin-bottom:16px}
.step-t{font-size:1.5rem;font-weight:var(--h-weight,800);text-transform:var(--h-transform,uppercase);letter-spacing:var(--h-tracking,.004em);margin:0 0 8px;color:var(--fg);font-family:var(--display)}
.step-d{margin:0;opacity:.75;line-height:1.6;color:var(--fg)}
.contactf{padding:clamp(72px,10vw,120px) 0}
.wf-wrap{max-width:720px}
.wf-sub{opacity:.75;margin:12px 0 0;font-size:1.05rem;line-height:1.6;color:var(--fg)}
.wf-form{margin-top:36px;display:flex;flex-direction:column;gap:16px}
.wf-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.wf-l,.wf-i{min-width:0;box-sizing:border-box;max-width:100%}
@media (max-width:560px){.wf-row{grid-template-columns:minmax(0,1fr)}}
.wf-l{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 38%)}
.wf-i{font:inherit;font-size:1rem;padding:13px 15px;border-radius:3px;border:1px solid color-mix(in srgb,var(--fg),transparent 70%);background:color-mix(in srgb,var(--fg),transparent 95%);color:var(--fg);text-transform:none;letter-spacing:0;font-weight:400}
.wf-i:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent),transparent 80%)}
.wf-t{resize:vertical;min-height:120px}
.wf-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.wf-btn{align-self:flex-start;margin-top:6px}
.wf-ok{margin:6px 0 0;font-weight:600;color:var(--accent-ink,var(--accent))}
.wf-err{margin:2px 0 0;padding:11px 14px;font-weight:600;font-size:.95rem;line-height:1.45;color:var(--fg);border-left:3px solid #d93a3a;background:color-mix(in srgb,#d93a3a,transparent 90%)}
.wf-err[hidden]{display:none}
.payments{padding:clamp(72px,10vw,120px) 0}
.pay-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:40px}
.pay-card{display:flex;flex-direction:column;justify-content:space-between;gap:18px;background:var(--surface);border:1px solid var(--hair);border-radius:16px;padding:22px}
.pay-name{font-size:1.18rem;margin:0}
.pay-desc{font-size:.95rem;opacity:.72;margin:6px 0 0;line-height:1.5}
.pay-amt{font:600 1.5rem/1 var(--display);color:var(--accent-ink,var(--accent));margin-top:12px}
.pay-btn{align-self:flex-start}
.pay-soon{align-self:flex-start;font-size:.82rem;opacity:.5;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.pay-trust{text-align:center;margin:28px 0 0;font-size:.82rem;opacity:.55}
.events{padding:clamp(72px,10vw,120px) 0}
.ev-list{list-style:none;padding:0;margin:40px 0 0;display:flex;flex-direction:column;gap:2px}
.ev-row{display:flex;align-items:center;gap:24px;padding:22px 4px;border-top:1px solid var(--hair)}
.ev-row:last-child{border-bottom:1px solid var(--hair)}
.ev-date{flex:none;width:150px;display:flex;flex-direction:column;gap:3px}
.ev-d{font:600 1.05rem/1.2 var(--display);color:var(--accent-ink,var(--accent))}
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
/* a long business name never grows the fixed header over the page: at most two lines */
.mark:not(.has-logo){min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.mark-logo{display:block;height:44px;width:auto;max-width:200px;object-fit:contain}
.top.solid .mark-logo{height:36px}
.credits{margin:0;text-align:center;font:500 11px/1.6 'Work Sans',system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:16px 20px 26px;background:#111;color:rgba(255,255,255,.64)}
.credits a{text-decoration:none;display:inline-block;padding:5px 0}.credits a:hover{text-decoration:underline}

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
.shop .wsp-ask{font:500 11px/1 'Work Sans',system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:11px 16px;border-radius:2px;border:1px solid var(--base-text);color:var(--base-text)}
.shop .wsp-ask:hover{background:var(--base-text);color:var(--base)}
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
.edit .ln>span,.edit .hero-foot,.edit .hero-media img{animation:none!important}
.edit .reveal{opacity:1!important;transform:none!important}

/* desktop with many / long page names: the same full-screen menu as on phones */
@media (min-width:901px){
  .multipage.nav-many .top{grid-template-columns:1fr auto auto}
  .multipage.nav-many .top nav{display:none}
  .multipage.nav-many .navtoggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:none;border:0;cursor:pointer;padding:0;color:inherit;z-index:62}
  .multipage.nav-many.nav-open .top{backdrop-filter:none;-webkit-backdrop-filter:none}
  .multipage.nav-many.nav-open .top nav{display:flex;position:fixed;inset:0;flex-direction:column;justify-content:flex-start;align-items:center;gap:26px;padding:110px 24px 56px;overflow-y:auto;overscroll-behavior:contain;background:color-mix(in srgb,var(--base),transparent 2%);z-index:60}
  .multipage.nav-many.nav-open .top nav a{font-size:24px;color:var(--base-text);max-width:min(90vw,40ch);flex:none}
  .multipage.nav-many.nav-open .top nav a.active::after{display:none}
  .multipage.nav-many.nav-open .navtoggle{position:fixed;top:22px;right:32px}
}
@media (max-width:900px){
  .wrap,.hero-in{padding-left:20px;padding-right:20px}
  .top{grid-template-columns:1fr auto;padding:16px 20px}.top.solid{padding:12px 20px}.top nav{display:none}
  .mark.mark-long:not(.has-logo){font-size:clamp(17px,5.4vw,22px);line-height:1.05}
  .multipage .top{grid-template-columns:1fr auto auto}
  .multipage .navtoggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:none;border:0;cursor:pointer;padding:0;color:inherit;z-index:62}
  .multipage.nav-open .top{backdrop-filter:none;-webkit-backdrop-filter:none}
  .multipage.nav-open .top nav{display:flex;position:fixed;inset:0;flex-direction:column;justify-content:flex-start;align-items:center;gap:26px;padding:96px 24px 48px;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:color-mix(in srgb,var(--base),transparent 2%);z-index:60}
  .multipage.nav-open .top nav a{font-size:22px;color:var(--base-text);max-width:100%;flex:none}
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
.on-base .eyebrow,.on-base .kicker{color:var(--accent-ink,var(--accent));opacity:1;counter-increment:wsec}
.on-base .eyebrow::before,.on-base .kicker::before{content:counter(wsec,decimal-leading-zero) "  \\2014  "}
.on-base .num{color:var(--accent-ink,var(--accent))}
.on-base .qa summary::after,.on-base .faq summary::after{color:var(--accent-ink,var(--accent))}
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
/* ===== design system v4: one spacing scale, eyebrows, line icons, calmer cards, phone carousels ===== */
body{--sp-l:clamp(80px,10vw,136px);--sp-m:clamp(64px,8vw,112px);--sp-s:clamp(48px,6vw,80px);--sp-join:clamp(28px,3.5vw,48px);--gap-h:clamp(28px,3.4vw,48px);--r-card:10px;--r-img:6px}
.wst-bold{--r-card:4px;--r-img:3px}
.wsr-sharp{--r-card:0px;--r-img:0px}.wsr-soft{--r-card:14px;--r-img:12px}.wsr-round{--r-card:24px;--r-img:20px}
.on-base{--ink:var(--accent-ink,var(--accent))}.on-alt{--ink:var(--alt-ink,var(--alt-text))}.on-pop{--ink:var(--pop-ink,var(--pop-text))}.on-soft{--ink:var(--soft-ink)}.on-soft .btn:not(.ghost):not(.btn-ink):not(.btn-line):not(.btn-light){background:var(--soft-btn);color:var(--soft-btn-text)}.on-soft.intro-center .statement::before{background:var(--soft-ink)}
.on-soft .eyebrow,.on-soft .kicker,.on-soft .num{color:var(--soft-ink);opacity:1}.on-soft .qa summary::after,.on-soft .faq summary::after{color:var(--soft-ink)}
/* section rhythm: medium by default, small for short bands, joined when two bands share a colour */
.intro,.services,.stats,.team,.ba,.faq,.reviews-wall,.reviews-cards,.prices-board,.steps,.contactf,.payments,.events,.servicearea,.plans,.embed,.visit,.cta-band{padding:var(--sp-m) 0}
.intro-center,.cta-card,.gallery{padding:var(--sp-s) 0}
.reviews-feature{padding:var(--sp-l) 0 var(--sp-m)}
main>.on-base:not(.hero-photo):not(.pagehead)+.on-base:not(.hero):not(.pagehead),.ws-page>.on-base:not(.hero-photo):not(.pagehead)+.on-base:not(.hero):not(.pagehead),main>.on-alt+.on-alt,.ws-page>.on-alt+.on-alt{padding-top:var(--sp-join)}
.gallery .wrap{padding-top:0;padding-bottom:0}
/* headings: eyebrow + title, one gap to the content below */
.sh{margin:0 0 var(--gap-h)}
.sh .h2{margin:0}
.h2{font-size:clamp(30px,4vw,56px)}
.sh+.lede{margin-top:calc(16px - var(--gap-h))}
.eb{display:flex;align-items:center;gap:10px;margin:0 0 16px;font:600 12px/1.3 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--ink)}
.eb::before{content:"";width:22px;height:2px;border-radius:2px;background:currentColor;opacity:.75;flex:none}
.sv,.steps-grid,.tr,.tp,.rc{margin-top:0}
.plans-grid,.pay-grid,.ev-list,.wsp-grid{margin-top:0}
.sh+.lede+.plans-grid,.sh+.lede+.pay-grid,.sh+.lede+.ev-list{margin-top:8px}
.faq-grid .sh,.ba-grid .sh{margin:0}
.statement{font-size:clamp(22px,2.5vw,34px)}
.intro-center .statement{max-width:30ch}
/* icons */
.ico{display:block;width:100%;height:100%}
.ic{display:inline-grid;place-items:center;flex:none;width:48px;height:48px;margin:0 0 22px;border-radius:calc(var(--r-card) * .8 + 4px);background:color-mix(in srgb,var(--ink),transparent 88%);color:var(--ink)}
.ic .ico{width:24px;height:24px}
.ic-emo{background:none;width:auto;height:auto;font-size:40px;border-radius:0}
.glyph{display:inline-grid;place-items:center;width:1em;height:1em;vertical-align:-.14em;color:var(--ink)}
.glyph .ico{stroke-width:1.6}
.emo-big .glyph,.ht-emo .glyph{vertical-align:middle}.emo-big .glyph .ico,.ht-emo .glyph .ico{stroke-width:1.1}
.emo-big{font-size:clamp(44px,5vw,64px);line-height:1}
.btn .ico{width:17px;height:17px;flex:none}
/* services: cards */
.services-grid .sv{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.services-grid .sv li,.services-numbered .sv li{display:flex;flex-direction:column;align-items:flex-start;padding:30px 28px 28px;border-radius:var(--r-card);background:color-mix(in srgb,var(--fg),transparent 95%);border:1px solid color-mix(in srgb,var(--fg),transparent 89%);transition:transform .3s var(--ease),box-shadow .3s,border-color .3s}
.services-grid .sv li::before{display:none}
.services-grid .sv li:hover,.services-numbered .sv li:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--ink),transparent 55%);box-shadow:0 22px 44px -30px rgba(0,0,0,.5)}
.sv h3{font-size:clamp(19px,1.6vw,22px);font-weight:600;line-height:1.2;margin:0 0 10px;letter-spacing:-.01em}
.wst-bold .sv h3{font-weight:800;letter-spacing:.01em}
.sv p{margin:0;font-size:15px;line-height:1.6;max-width:52ch}
.from{display:block;margin-top:auto;padding-top:16px;font:600 12px/1.2 var(--body);letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg),transparent 25%)}
.services-numbered .sv{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.sv-n{display:block;margin:0 0 26px;font-family:var(--display);font-weight:var(--h-weight,700);font-size:clamp(30px,3vw,42px);line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}
.services-rows .sv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(32px,5vw,72px)}
.services-rows .sv li,.services-feature .sv li{display:flex;gap:20px;align-items:flex-start;padding:26px 0;border-top:1px solid var(--hair)}
.services-rows .ic,.services-feature .ic,.services-list .ic{margin:0;width:44px;height:44px}
.services-rows .ic .ico,.services-feature .ic .ico,.services-list .ic .ico{width:22px;height:22px}
.sv-b{min-width:0;flex:1}
.sv-b h3{margin:9px 0 6px}
.sv-b .from{padding-top:10px}
.services-list .sv li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:24px;align-items:center;padding:24px 0;border-top:1px solid var(--hair)}
.services-list .sv-b{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr) auto;gap:8px 32px;align-items:baseline}
.services-list .sv-b h3{margin:0}.services-list .sv-b .from{padding:0;margin:0}
.svf-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(40px,6vw,88px);align-items:start}
.svf-img{aspect-ratio:4/5;border-radius:var(--r-img);position:sticky;top:96px}
.svf-solo .svf-grid{grid-template-columns:1fr}
.svf-solo .sv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(32px,5vw,72px)}
.svf-body>.btn{margin-top:32px}
/* gallery: aligned, one gutter, one radius */
.g-wrap{display:grid;gap:clamp(8px,1.1vw,14px);align-items:stretch}
.gallery .g-wrap>figure{position:relative;border-radius:var(--r-img);overflow:hidden;height:auto;min-height:0;flex:none}
.g-wrap>figure>img{position:absolute;inset:0}
.g-wrap>figure img{transition:transform .7s var(--ease)}
.g-wrap>figure:hover img{transform:scale(1.035)}
.gallery-strip .g-wrap{grid-template-columns:1.5fr 1fr 1fr;grid-template-rows:clamp(260px,30vw,440px)}
.gallery-strip.gn2 .g-wrap{grid-template-columns:1.4fr 1fr}
.gallery-strip.gn1 .g-wrap,.gallery-bento.gn1 .g-wrap{grid-template-columns:1fr;grid-template-rows:clamp(260px,40vw,520px)}
.gallery-bento .g-wrap{grid-template-columns:1.6fr 1fr;grid-template-rows:repeat(2,clamp(150px,17vw,250px))}
.gallery-bento .g0{grid-row:span 2}
.gallery-bento.gn2 .g-wrap{grid-template-columns:1fr 1fr;grid-template-rows:clamp(240px,30vw,420px)}
.gallery-bento.gn2 .g0{grid-row:auto}
.gallery-grid .g-wrap{grid-template-columns:repeat(4,1fr);grid-auto-rows:clamp(150px,16vw,240px)}
/* steps */
.steps-grid{gap:clamp(24px,3vw,40px)}
.steps-grid .step{border-top:1px solid var(--hair);padding-top:24px}
.steps-grid .step-n{font-size:clamp(28px,2.8vw,38px);margin-bottom:14px;color:var(--ink)}
.step-t{font-size:clamp(19px,1.7vw,23px)}
.step-d{max-width:46ch}
.steps-line .step{position:relative;border-top:0;padding-top:0}
.steps-line .step::before{content:"";position:absolute;top:20px;left:56px;right:0;height:1px;background:color-mix(in srgb,var(--fg),transparent 78%)}
.steps-line .step:last-child::before{display:none}
.steps-line .step-n{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--ink);font:600 15px/1 var(--body);margin-bottom:22px}
/* reviews: cards */
.rc{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.rc blockquote{margin:0;height:100%;display:flex;flex-direction:column;padding:30px 28px 26px;border-radius:var(--r-card);background:color-mix(in srgb,var(--fg),transparent 95%);border:1px solid color-mix(in srgb,var(--fg),transparent 89%)}
.rc-mark{display:block;height:28px;font:700 60px/1 Georgia,'Times New Roman',serif;color:var(--ink)}
.rc p{flex:1;margin:12px 0 24px;font-size:17px;line-height:1.6}
.reviews .rc footer{display:flex;align-items:center;gap:12px;margin:0;font:600 14px/1.3 var(--body);letter-spacing:0;text-transform:none;color:var(--fg)}
.rc-av{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;flex:none;background:var(--accent);color:var(--accent-text);font:700 15px/1 var(--body)}
.reviews-wall .rw blockquote{padding:26px 0}
/* call to action: a rounded card */
.cc-box{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:28px 48px;padding:clamp(36px,5vw,64px);border-radius:calc(var(--r-card) * 1.6)}
.cc-box::before{content:"";position:absolute;inset:0;background:radial-gradient(700px 360px at 90% -20%,color-mix(in srgb,var(--pop-text),transparent 86%),transparent 60%);pointer-events:none}
.cc-copy,.cc-box .actions{position:relative}
.cc-box .h2{font-size:clamp(28px,3.4vw,46px)}
.cta .cc-copy p{margin:14px 0 0}
.btn-line{background:transparent;color:var(--fg);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg),transparent 50%)}
.btn-line:hover{background:color-mix(in srgb,var(--fg),transparent 90%)}
/* intro in two columns */
.ic-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(28px,6vw,96px);align-items:start}
.ic-grid .sh{margin:0}
.ic-text{margin:0;max-width:56ch;font-size:clamp(18px,1.6vw,21px);line-height:1.65;color:var(--fg)}
.ic-meta{display:flex;align-items:center;gap:8px;margin:24px 0 0;font-size:14px;color:color-mix(in srgb,var(--fg),transparent 30%)}
.ic-meta .ico{width:18px;height:18px;color:var(--ink)}
/* visit: address, live status, hours with today, map */
.visit .addr{margin:18px 0 14px}
.v-status{display:flex;align-items:center;gap:10px;margin:0 0 26px;font-size:15px;color:var(--fg)}
.v-status:has([data-status]:empty){display:none}
.v-dot{width:8px;height:8px;border-radius:50%;flex:none;background:color-mix(in srgb,var(--fg),transparent 50%)}
.v-status.is-open .v-dot{background:#2a9d62;box-shadow:0 0 0 4px rgba(42,157,98,.2)}
.v-info .actions{margin:0 0 36px}
.v-info .actions:last-child{margin-bottom:0}
.hours tr.today th::after{content:"Today";display:inline-block;margin-left:10px;padding:4px 7px;border-radius:999px;font:600 10px/1 var(--body);letter-spacing:.08em;text-transform:uppercase;vertical-align:1px;background:var(--accent);color:var(--accent-text)}
.hours tr.today th,.hours tr.today td{font-weight:700}
.v-map{position:relative;min-height:340px;border-radius:var(--r-img);overflow:hidden;background:var(--surface)}
.v-map .mapf{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;margin:0;border-radius:0;filter:grayscale(.3)}
.vm-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:28px;text-align:center;color:var(--fg);background-color:color-mix(in srgb,var(--fg),transparent 95%);background-image:linear-gradient(118deg,transparent 46%,color-mix(in srgb,var(--accent),transparent 78%) 46%,color-mix(in srgb,var(--accent),transparent 78%) 49%,transparent 49%),repeating-linear-gradient(0deg,transparent 0 54px,color-mix(in srgb,var(--fg),transparent 91%) 54px 56px),repeating-linear-gradient(90deg,transparent 0 70px,color-mix(in srgb,var(--fg),transparent 91%) 70px 72px)}
.vm-pin{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;background:var(--accent);color:var(--accent-text);box-shadow:0 12px 26px -10px rgba(0,0,0,.45)}
.vm-pin .ico{width:24px;height:24px}
.vm-a{margin:0;max-width:28ch;font-weight:600;font-size:16px;padding:4px 10px;border-radius:6px;background:color-mix(in srgb,var(--bg),transparent 12%)}
.vm-n{margin:0;font-size:12px;padding:2px 8px;border-radius:6px;background:color-mix(in srgb,var(--bg),transparent 12%);color:color-mix(in srgb,var(--fg),transparent 25%)}
.vm-load,.vm-dir{margin-top:4px}
.vm-ph [hidden],[data-glive][hidden],[data-gstat][hidden]{display:none!important}
.gr-av{width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:8px}
/* heroes: legible text over any photo, new layouts */
.hero-media::after{background:linear-gradient(180deg,rgba(0,0,0,.36) 0%,rgba(0,0,0,0) 24%,rgba(0,0,0,.1) 46%,rgba(0,0,0,.68) 100%),linear-gradient(90deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,.1) 55%,rgba(0,0,0,0) 100%)}
.hero-center .hero-media::after{background:linear-gradient(180deg,rgba(0,0,0,.46) 0%,rgba(0,0,0,.36) 45%,rgba(0,0,0,.52) 100%)}
.hero-photo:not(.hero-noimg) .name,.hero-photo:not(.hero-noimg) .tag,.hero-photo:not(.hero-noimg) .status{text-shadow:0 2px 22px rgba(0,0,0,.3)}
.acc-dark .hero-photo:not(.hero-noimg) .btn:not(.ghost){background:#fff;color:#111}
.acc-dark .hero-photo:not(.hero-noimg) .btn:not(.ghost):hover{background:#f0f0f0}
.hero-center{align-items:center;text-align:center}
.hero-center .hero-in{display:flex;flex-direction:column;align-items:center;padding-top:110px;padding-bottom:clamp(56px,8vh,96px)}
.hero-center .name .ln>span{display:block}
.hero-center .tag{margin:26px auto 32px}
.hero-center .actions{justify-content:center}
.hero-frame{padding:clamp(130px,17vh,170px) 0 var(--sp-m)}
.hero-frame .name{font-size:clamp(46px,6.6vw,108px)}
.hero-frame .tag{margin:26px 0 30px}
.hf-pic{position:relative;padding:0 0 26px 26px}
.hf-pic::before{content:"";position:absolute;left:0;bottom:0;width:70%;height:70%;border-radius:var(--r-img);background:color-mix(in srgb,var(--ink),transparent 82%)}
.hf-pic .hs-img{position:relative;aspect-ratio:4/5;min-height:0;border-radius:var(--r-img);box-shadow:0 34px 60px -34px rgba(0,0,0,.45)}
.hf-pic:has(>.slot[hidden]){display:none}
.hero-minimal{padding:clamp(120px,16vh,170px) 0 var(--sp-s)}
.hm-row{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:24px 56px;align-items:end;margin-bottom:clamp(36px,5vw,64px)}
.hero-minimal .name{font-size:clamp(48px,8vw,128px)}
.hm-side .tag{margin:0 0 24px}
.hm-img{aspect-ratio:21/9;border-radius:var(--r-img)}
/* header over a photo opening: light text on a soft scrim until it turns solid */
.top.over:not(.solid){color:#fff}
.top.over:not(.solid)::before{content:"";position:absolute;inset:0 0 -32px;z-index:-1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.2) 62%,rgba(0,0,0,0))}
.top.over:not(.solid) .mark{text-shadow:0 1px 14px rgba(0,0,0,.3)}
.top.over:not(.solid) nav a{color:rgba(255,255,255,.88)}
.top.over:not(.solid) nav a:hover,.top.over:not(.solid) nav a.active{color:#fff}
.top.over:not(.solid) .pill{color:#fff;border-color:rgba(255,255,255,.7)}
.top.over:not(.solid) .pill:hover{background:#fff;color:#111}
.nav-open .top.over{color:var(--base-text)}.nav-open .top.over::before{display:none}
/* motion: added by the runtime only (content is visible without JS); never in the editor */
.js .reveal{opacity:1;transform:none}
.rv{opacity:0;transform:translateY(18px);transition:opacity .75s var(--ease),transform .75s var(--ease);transition-delay:var(--rv,0ms)}
.rv.in{opacity:1;transform:none}
.edit .rv{opacity:1!important;transform:none!important}
.btn{transition:background .2s,color .2s,transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-1px)}
.plan{transition:transform .3s var(--ease),box-shadow .3s}
.plan:hover{transform:translateY(-3px);box-shadow:0 22px 44px -30px rgba(0,0,0,.45)}
/* phone action bar */
.ws-bar{display:none}
@media (min-width:901px){
  .hero-frame .hs-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
  .visit-grid{grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(40px,6vw,88px)}
  .visit-geo .visit-grid{grid-template-columns:minmax(0,5fr) minmax(0,6fr);align-items:stretch}
}
@media (max-width:900px){
  .ic-grid,.svf-grid,.hm-row{grid-template-columns:1fr}
  .svf-img{position:relative;top:0;aspect-ratio:4/3}
  .services-rows .sv,.svf-solo .sv{grid-template-columns:1fr}
  .services-list .sv-b{grid-template-columns:1fr;gap:4px}
  .hm-img{aspect-ratio:4/3}
  .hf-pic{padding:0}.hf-pic::before{display:none}.hf-pic .hs-img{aspect-ratio:4/3}
  .gallery-grid .g-wrap{grid-template-columns:1fr 1fr}
  .v-map{min-height:280px}
  .steps-line .steps-grid{grid-template-columns:1fr;gap:28px}
  .steps-line .step{padding-left:60px}
  .steps-line .step-n{position:absolute;left:0;top:0;margin:0}
  .steps-line .step::before{top:48px;bottom:-24px;left:20px;right:auto;width:1px;height:auto}
}
@media (max-width:700px){
  .rail{display:grid!important;grid-auto-flow:column;grid-auto-columns:84%;grid-template-columns:none!important;grid-template-rows:none!important;gap:12px;height:auto!important;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin-left:-20px;margin-right:-20px;padding:2px 20px 10px;scroll-padding:0 20px}
  .rail::-webkit-scrollbar{display:none}
  .rail:focus-visible{outline:2px solid var(--ink);outline-offset:4px;border-radius:var(--r-card)}
  .rail>*{scroll-snap-align:start;min-width:0}
  .rail:has(>:only-child){grid-auto-columns:100%}
  .g-wrap.rail>figure{aspect-ratio:4/5;grid-row:auto!important;grid-column:auto!important}
  .services-grid .sv li,.services-numbered .sv li{padding:26px 22px 24px}
  .cc-box{flex-direction:column;align-items:flex-start}
  body.has-bar{--bar-h:calc(64px + env(safe-area-inset-bottom,0px))}
  body.has-bar .credits{padding-bottom:calc(26px + var(--bar-h))}
  .ws-bar{position:fixed;left:0;right:0;bottom:0;z-index:8500;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:8px;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));background:color-mix(in srgb,var(--base),transparent 3%);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid var(--hair);box-shadow:0 -10px 28px -16px rgba(0,0,0,.28)}
  .ws-bar.one{grid-template-columns:1fr}
  .ws-bar a{display:flex;align-items:center;justify-content:center;gap:8px;min-width:0;height:48px;padding:0 12px;border-radius:var(--btn-radius,8px);font:600 15px/1 var(--body);text-decoration:none}
  .ws-bar a span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ws-bar .ico{width:18px;height:18px;flex:none}
  .wb-call{color:var(--base-text);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--base-text),transparent 65%)}
  .wb-main{background:var(--accent);color:var(--accent-text)}
  .wsr-sharp .ws-bar a{border-radius:0}.wsr-soft .ws-bar a{border-radius:10px}.wsr-round .ws-bar a{border-radius:999px}
  body.has-bar .ws-top{bottom:calc(18px + var(--bar-h))}
  body.has-bar .wsp-cart{bottom:calc(20px + var(--bar-h))}
  .nav-open .ws-bar{display:none}
}
.edit .ws-bar{display:none!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.js .reveal{opacity:1;transform:none}}
/* rhythm bands: cards on a soft band are lighter than the band; the story beside a photo is a calm landscape pair */
.on-soft.services-grid .sv li,.on-soft.services-numbered .sv li,.on-soft .rc li,.on-soft .tb-cards li{background:color-mix(in srgb,var(--soft),#fff 62%);border-color:color-mix(in srgb,var(--fg),transparent 88%)}
.intro-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(36px,6vw,88px)}
.intro-grid .statement{margin:0;max-width:24ch}
.intro-grid .intro-img{aspect-ratio:4/3}
@media (max-width:820px){.intro-grid{grid-template-columns:1fr}}
`;
})(globalThis.WS = globalThis.WS || {});

// Page composer: site JSON -> complete HTML document. mode 'live' (published) or 'edit' (inside the editor preview).
// Automatic logo, header-over-photo contrast, trust badges, why us, service area, open FAQ, one-column visit.
(function (WS) {
  WS.styleCss += `
/* automatic logo: wordmark in the heading font, with an optional icon, monogram or badge */
.mark.mk{display:flex;align-items:center;gap:12px;justify-self:start;max-width:100%;overflow:visible;-webkit-line-clamp:unset}
.mk-name{min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-wrap:balance;padding-block:.06em}
.mk-sym{flex:none;display:inline-grid;place-items:center;line-height:1}
.mk-ico{width:1.08em;height:1.08em;color:var(--accent-ink,var(--accent))}
.mk-ico .ico{stroke-width:1.9}
.mk-badge,.mk-mono{width:38px;height:38px;border-radius:clamp(6px,var(--btn-radius,8px),19px);background:var(--accent);color:var(--accent-text);transition:width .35s,height .35s}
.mk-badge .ico{width:21px;height:21px;stroke-width:2}
.mk-mono{font-family:var(--display);font-size:17px;font-weight:var(--mark-weight,700);letter-spacing:.02em;text-transform:uppercase;font-style:normal}
.mk-mono.mk-2{font-size:15px;letter-spacing:.03em}
.wst-bold .mk-mono{font-size:20px}.wst-bold .mk-mono.mk-2{font-size:18px}
.wsr-sharp .mk-badge,.wsr-sharp .mk-mono{border-radius:0}.wsr-round .mk-badge,.wsr-round .mk-mono{border-radius:50%}
.top.solid .mk-badge,.top.solid .mk-mono{width:34px;height:34px}
.top.over:not(.solid) .mk-ico{color:inherit}
.top.over:not(.solid) .mk-badge,.top.over:not(.solid) .mk-mono{box-shadow:0 4px 14px rgba(0,0,0,.28)}
.foot-brand b.mk{display:flex;align-items:center;gap:12px;text-transform:var(--h-transform,none)}
.why .h2,.area .h2{text-wrap:balance}
.foot .mk-ico{color:var(--foot-ink)}
.foot .mk-badge,.foot .mk-mono{width:34px;height:34px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}
.foot .mk-mono{font-size:14px}.foot .mk-badge .ico{width:19px;height:19px}
/* header over a photo: a firmer scrim and a frosted button, so it reads on light and dark photos alike */
.top.over:not(.solid)::before{inset:0 0 -48px;background:linear-gradient(180deg,rgba(0,0,0,.62),rgba(0,0,0,.36) 55%,rgba(0,0,0,0))}
.top.over:not(.solid) nav a,.top.over:not(.solid) .navtoggle{text-shadow:0 1px 10px rgba(0,0,0,.45)}
.top.over:not(.solid) .pill{background:rgba(12,12,14,.4);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2);border-color:rgba(255,255,255,.78)}
.top.over:not(.solid) .pill:hover{background:#fff;color:#111}
/* trust badges */
.trust-strip{padding:clamp(22px,3vw,30px) 0!important;border-bottom:1px solid var(--hair)}
.tb-row{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;gap:14px 0}
.tb-row li{display:flex;align-items:center;gap:12px;padding:2px clamp(18px,2.6vw,36px);border-left:1px solid var(--hair);min-width:0}
.tb-row li:first-child{border-left:0}
.tb-ic{flex:none;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--ink),transparent 90%);color:var(--ink)}
.tb-ic .ico{width:20px;height:20px}
.tb-t{display:flex;flex-direction:column;min-width:0}
.tb-t b{font:600 15px/1.25 var(--body);letter-spacing:-.005em}
.tb-t small{font-size:13px;line-height:1.35;color:color-mix(in srgb,var(--fg),transparent 36%)}
.trust-cards{padding:var(--sp-s) 0}
.tb-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
.tb-cards li{display:flex;align-items:center;gap:16px;padding:24px 22px;border-radius:var(--r-card);background:color-mix(in srgb,var(--fg),transparent 95%);border:1px solid color-mix(in srgb,var(--fg),transparent 89%);min-width:0}
.tb-cards .tb-ic{width:48px;height:48px;border-radius:calc(var(--r-card) * .8 + 4px)}
.tb-cards .tb-ic .ico{width:23px;height:23px}
.tb-cards .tb-t b{font-family:var(--display);font-size:21px;font-weight:var(--h-weight,700);letter-spacing:var(--h-tracking,0);text-transform:var(--h-transform,none);line-height:1.1;margin-bottom:3px}
/* why choose us */
.why{padding:var(--sp-m) 0}
.wy-cols{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(28px,4vw,56px)}
.wy-cols.wy-n4{grid-template-columns:repeat(4,minmax(0,1fr))}.wy-cols.wy-n2{grid-template-columns:repeat(2,minmax(0,1fr))}.wy-cols.wy-n1{grid-template-columns:minmax(0,640px)}
.wy-cols li{position:relative;padding-top:28px;border-top:1px solid var(--hair);min-width:0}
.wy-cols li::before{content:"";position:absolute;top:-1px;left:0;width:44px;height:2px;background:var(--ink)}
.why .ic{margin:0 0 20px}
.why h3{font-size:clamp(19px,1.6vw,22px);font-weight:600;line-height:1.2;margin:0 0 10px;letter-spacing:-.01em}
.wst-bold .why h3{font-weight:800;letter-spacing:.01em}
.why li p{margin:0;font-size:15px;line-height:1.6;color:color-mix(in srgb,var(--fg),transparent 28%);max-width:46ch}
.wy-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(40px,6vw,88px);align-items:center}
.why-nopic .wy-grid{grid-template-columns:minmax(0,4fr) minmax(0,7fr);align-items:start}
.why-nopic .wy-side .sh{margin:0}
.wy-img{aspect-ratio:4/5;border-radius:var(--r-img);overflow:hidden;background:var(--surface)}
.wy-img img{width:100%;height:100%;object-fit:cover}
.wy-list{list-style:none;margin:0;padding:0}
.wy-list li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:20px;padding:24px 0;border-top:1px solid var(--hair)}
.wy-list li:last-child{border-bottom:1px solid var(--hair)}
.wy-list .ic{margin:0}
/* service area */
.area{padding:var(--sp-m) 0}
.ar-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,6vw,96px);align-items:start}
.ar-copy .sh{margin-bottom:20px}
.ar-note{margin:0 0 28px;max-width:40ch;font-size:17px;color:color-mix(in srgb,var(--fg),transparent 28%)}
.ar-copy .actions{margin-top:0}
.ar-towns{list-style:none;margin:0;padding:clamp(22px,3vw,34px);display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start;border-radius:var(--r-card);background:color-mix(in srgb,var(--fg),transparent 95%);border:1px solid color-mix(in srgb,var(--fg),transparent 90%)}
.ar-towns li{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:10px 16px 10px 13px;border-radius:999px;background:var(--bg);border:1px solid color-mix(in srgb,var(--fg),transparent 85%);font-size:15px;font-weight:500;line-height:1.2}
.ar-towns li .ico{width:16px;height:16px;flex:none;color:var(--ink)}
.ar-towns li span{min-width:0;overflow-wrap:anywhere}
.ar-towns .ar-more{background:none;border-style:dashed;color:color-mix(in srgb,var(--fg),transparent 28%)}
.area-list .ar-towns{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0 28px;padding:0;background:none;border:0;border-radius:0}
.area-list .ar-towns li{border:0;border-bottom:1px solid var(--hair);border-radius:0;background:none;padding:15px 2px}
.area-list .ar-towns .ar-more{border-bottom-style:dashed}
/* FAQ with every answer showing */
.qa-i{padding:24px 0;border-top:1px solid var(--hair)}
.qa-i:last-child{border-bottom:1px solid var(--hair)}
.qa-i h3{font:600 19px/1.35 var(--body);letter-spacing:-.005em;text-transform:none;margin:0 0 8px}
.qa-i p{margin:0;max-width:62ch;color:color-mix(in srgb,var(--fg),transparent 25%)}
/* visit with no address and no hours: one column, heading, contact rows and buttons together */
.visit-solo .v-solo{max-width:720px}
.visit-solo .sh{margin-bottom:28px}
.visit-solo .reach{margin:0 0 32px}
@media (max-width:900px){
  .wy-cols.wy-n4{grid-template-columns:repeat(2,minmax(0,1fr))}
  .wy-grid,.why-nopic .wy-grid,.ar-grid{grid-template-columns:1fr;gap:36px}
  .wy-img{aspect-ratio:4/3}
}
@media (max-width:700px){
  .top{gap:16px}
  .mark.mk{gap:9px}
  .mark.mark-long.mk:not(.mks-wordmark){font-size:clamp(15px,4.4vw,18px)}
  .mk-badge,.mk-mono,.top.solid .mk-badge,.top.solid .mk-mono{width:32px;height:32px}
  .mk-mono{font-size:14px}.mk-mono.mk-2{font-size:12.5px}.wst-bold .mk-mono{font-size:17px}.wst-bold .mk-mono.mk-2{font-size:15px}
  .mk-badge .ico{width:18px;height:18px}
  .tb-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px;justify-content:start}
  .tb-row li{padding:0;border:0;gap:10px}
  .tb-ic{width:34px;height:34px}.tb-ic .ico{width:17px;height:17px}
  .tb-t b{font-size:14px}.tb-t small{font-size:12px}
  .wy-cols,.wy-cols.wy-n4,.wy-cols.wy-n2{grid-template-columns:1fr;gap:0}
  .wy-cols li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;padding:22px 0 24px}
  .wy-cols li:last-child{border-bottom:1px solid var(--hair)}
  .wy-cols .ic,.wy-list .ic{width:44px;height:44px;margin:0}
  .ar-towns li{font-size:14px;padding:8px 13px 8px 11px}
}
`;
})(globalThis.WS = globalThis.WS || {});

// Headline-first openings, the bento services grid, the bold numbers band, and polish (hover depth, entrance motion).
// Motion is CSS-only and gated on the .js class the runtime adds, never in the editor, never with reduced motion.
(function (WS) {
  WS.styleCss += `
/* ===== headline-first openings ===== */
.hc-copy{min-width:0;max-width:620px}
.hc-eb{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:0 0 22px;font:600 13px/1.3 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--hc-eb,var(--ink))}
.hc-eb::before{content:"";width:28px;height:2px;border-radius:2px;background:currentColor;flex:none}
.hc-dot{width:4px;height:4px;border-radius:50%;background:currentColor;flex:none}
.hc-h{margin:0;max-width:16ch;font-family:var(--display);font-weight:var(--name-weight,800);font-size:calc(clamp(40px,5.4vw,84px) * var(--hc-k,1));line-height:var(--hc-lh,1.02);letter-spacing:var(--name-tracking,-.01em);text-transform:var(--h-transform,none);text-wrap:balance;color:var(--fg)}
.hc-h.hc-long{font-size:calc(clamp(34px,4.2vw,62px) * var(--hc-k,1));max-width:19ch}
.hc-h.hc-short{font-size:calc(clamp(46px,6.8vw,104px) * var(--hc-k,1))}.wst-elegant{--hc-k:1.16}
.wst-bold{--hc-lh:.94}.wst-refined,.wst-classic,.wst-editorial,.wst-elegant,.wst-warm{--hc-lh:1.04}
.hc-sub{margin:24px 0 0;max-width:44ch;font-size:clamp(17px,1.35vw,20px);line-height:1.55;color:color-mix(in srgb,var(--fg),transparent 12%)}
.hc-copy .actions{margin-top:34px;gap:12px}
.hc-copy .btn{padding:18px 30px;font-size:15px}
.hc-chips{list-style:none;margin:28px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.hc-chips li{display:inline-flex;align-items:center;gap:8px;padding:8px 14px 8px 11px;border-radius:999px;font:600 13px/1.2 var(--body);color:var(--fg);background:var(--hc-chip,color-mix(in srgb,var(--fg),transparent 93%));border:1px solid var(--hc-chip-b,color-mix(in srgb,var(--fg),transparent 84%))}
.hc-chips .ico{width:16px;height:16px;flex:none;color:var(--hc-chip-i,var(--ink))}
.hc-card{min-width:200px;max-width:260px;padding:22px 24px 20px;border-radius:calc(var(--r-card) + 8px);background:var(--hc-card,var(--base));color:var(--hc-card-t,var(--base-text));border:1px solid var(--hc-card-b,var(--hair));box-shadow:0 30px 60px -28px rgba(0,0,0,.5)}
.hc-num{display:flex;align-items:baseline;gap:8px;margin:0;font-family:var(--display);font-weight:var(--h-weight,700);line-height:1}
.hc-num b{font-weight:inherit;font-size:clamp(44px,4.4vw,60px);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.hc-stars{font-size:15px;letter-spacing:2px;color:#F5B301}
.hc-unit{font:600 14px/1 var(--body);letter-spacing:.08em;text-transform:uppercase}
.hc-ico .ico{width:42px;height:42px;color:var(--hc-card-i,var(--accent-ink,var(--accent)))}
.hc-cap{margin:10px 0 0;font-size:14px;line-height:1.45}
.hc-cap b{display:block;font:700 17px/1.25 var(--body);margin-bottom:3px}
/* full-bleed photo, headline over a tinted scrim (strong enough for AA text on any photo) */
.hero-cinema{--hc-scrim:color-mix(in srgb,var(--accent) 12%,#06080B);--hc-edge:max(700px,calc(50% + 130px));height:auto;min-height:clamp(620px,92svh,980px);max-height:none;align-items:center;background:var(--hc-scrim);--fg:#fff;--ink:#fff;--hc-eb:#fff;--hc-chip:rgba(8,10,14,.46);--hc-chip-b:rgba(255,255,255,.3);--hc-chip-i:#fff;--hc-card:rgba(10,12,16,.66);--hc-card-t:#fff;--hc-card-b:rgba(255,255,255,.2);--hc-card-i:#fff}
.hero-cinema .hc-in{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:40px;padding-top:clamp(120px,16vh,170px);padding-bottom:clamp(56px,9vh,96px)}
.hero-cinema .hero-media::after{background:linear-gradient(90deg,color-mix(in srgb,var(--hc-scrim),transparent 12%) 0,color-mix(in srgb,var(--hc-scrim),transparent 22%) calc(var(--hc-edge) - 260px),color-mix(in srgb,var(--hc-scrim),transparent 30%) var(--hc-edge),color-mix(in srgb,var(--hc-scrim),transparent 78%) calc(var(--hc-edge) + 380px),color-mix(in srgb,var(--hc-scrim),transparent 88%) 100%),linear-gradient(0deg,color-mix(in srgb,var(--hc-scrim),transparent 45%) 0,transparent 36%),linear-gradient(180deg,rgba(0,0,0,.42) 0,transparent 24%)}
.hero-cinema:not(.hero-noimg) .hc-h,.hero-cinema:not(.hero-noimg) .hc-sub{text-shadow:0 2px 24px rgba(0,0,0,.35)}
.hero-cinema .hc-card{-webkit-backdrop-filter:blur(14px) saturate(1.2);backdrop-filter:blur(14px) saturate(1.2)}
.acc-dark .hero-cinema:not(.hero-noimg) .btn:not(.ghost){background:#fff;color:#111}
.hero-cinema .btn.ghost{box-shadow:inset 0 0 0 1px rgba(255,255,255,.6);background:rgba(8,10,14,.28)}
.hero-cinema.hero-noimg,.hero-cinema:has(.hero-media.empty){background:var(--base);--fg:var(--base-text);--ink:var(--accent-ink,var(--accent));--hc-eb:var(--accent-ink,var(--accent));--hc-chip:color-mix(in srgb,var(--base-text),transparent 94%);--hc-chip-b:var(--hair);--hc-chip-i:var(--accent-ink,var(--accent));--hc-card:var(--base);--hc-card-t:var(--base-text);--hc-card-b:var(--hair);--hc-card-i:var(--accent-ink,var(--accent))}
.hero-cinema.hero-noimg .btn.ghost,.hero-cinema:has(.hero-media.empty) .btn.ghost{background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--base-text),transparent 60%)}
/* headline beside an offset photo collage */
.hero-collage{position:relative;padding:clamp(124px,16vh,168px) 0 clamp(64px,9vw,112px);overflow:hidden;isolation:isolate}
.hero-collage::before{content:"";position:absolute;z-index:-1;top:0;right:0;bottom:0;width:42%;background:color-mix(in srgb,var(--accent),var(--base) 91%)}
.hs-solo.hero-collage::before{display:none}
.hcl-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(40px,6vw,96px);align-items:center}
.hs-solo .hcl-grid{grid-template-columns:1fr}
.hero-collage .hc-h{font-size:calc(clamp(40px,4.8vw,76px) * var(--hc-k,1))}.hero-collage .hc-h.hc-long{font-size:calc(clamp(34px,3.9vw,58px) * var(--hc-k,1))}.hero-collage .hc-h.hc-short{font-size:calc(clamp(44px,6vw,92px) * var(--hc-k,1))}
.hcl-art{position:relative;padding:0 0 44px}
.hcl-art::before{content:"";position:absolute;right:-28px;top:-28px;width:56%;height:50%;background:radial-gradient(color-mix(in srgb,var(--ink),transparent 50%) 1.4px,transparent 1.6px) 0 0/16px 16px;pointer-events:none}
.hcl-main{position:relative;width:100%;aspect-ratio:4/5;max-height:640px;border-radius:calc(var(--r-img) + 6px);box-shadow:0 44px 80px -40px rgba(0,0,0,.5)}
.hcl-two .hcl-main{width:84%;margin-left:auto}
.hcl-second{position:absolute!important;left:0;bottom:0;width:42%;aspect-ratio:1;border-radius:calc(var(--r-img) + 4px);border:6px solid var(--base);box-shadow:0 30px 50px -24px rgba(0,0,0,.45)}
.hcl-card{position:absolute;right:-18px;top:12%;z-index:2}
.hcl-art:has(.hcl-main[hidden]){display:none}
/* entrance: a short staggered rise (CSS only, after the runtime marks the page; content is visible without it) */
@keyframes wsRise{from{opacity:0;transform:translateY(22px)}}
@keyframes wsUnveil{from{clip-path:inset(12% 0 12% 0 round 12px);transform:scale(1.04)}}
.js:not(.edit) .hc-copy>*,.js:not(.edit) .hc-card{animation:wsRise .9s var(--ease) both}
.js:not(.edit) .hc-copy>:nth-child(2){animation-delay:.08s}.js:not(.edit) .hc-copy>:nth-child(3){animation-delay:.16s}.js:not(.edit) .hc-copy>:nth-child(4){animation-delay:.26s}.js:not(.edit) .hc-copy>:nth-child(5){animation-delay:.36s}.js:not(.edit) .hc-copy>:nth-child(6){animation-delay:.46s}
.js:not(.edit) .hc-card{animation-delay:.6s}
.js:not(.edit) .hcl-main{animation:wsUnveil 1.3s var(--ease) both}.js:not(.edit) .hcl-second{animation:wsRise 1s .45s var(--ease) both}
/* ===== services: bento ===== */
.services-bento .sb{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);grid-auto-rows:minmax(200px,auto);gap:18px}
.sb-n1{grid-template-columns:1fr!important}.sb-n2{grid-template-columns:repeat(2,minmax(0,1fr))!important}
.sb-n4,.sb-n5,.sb-n6,.sb-n7,.sb-n8,.sb-n9{grid-template-columns:minmax(0,1.3fr) repeat(2,minmax(0,1fr))!important}
.sb-n4 .sb-card:last-child,.sb-n7 .sb-card:last-child{grid-column:span 2}.sb-n6 .sb-card:last-child{grid-column:span 3}
.sb-feat{position:relative;grid-row:span 2;display:flex;align-items:flex-end;min-height:440px;overflow:hidden;isolation:isolate;border-radius:calc(var(--r-card) + 8px);color:#fff;--fg:#fff;background:var(--hc-scrim,#14161a)}
.sb-n1 .sb-feat,.sb-n2 .sb-feat{grid-row:auto;min-height:360px}
.sb-img{position:absolute!important;inset:0;z-index:-2;border-radius:0!important}
.sb-img img{transition:transform 1.1s var(--ease)}
.sb-feat:hover .sb-img img{transform:scale(1.05)}
.sb-feat:not(.sb-nopic)::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(0deg,rgba(6,8,11,.9) 0,rgba(6,8,11,.74) 36%,rgba(6,8,11,.2) 70%,rgba(6,8,11,0) 100%)}
.sb-nopic,.sb-feat:has(.sb-img[hidden]){color:var(--accent-text);--fg:var(--accent-text);background:radial-gradient(circle at 88% 8%,color-mix(in srgb,var(--accent-text),transparent 84%),transparent 55%),var(--accent)}
.sb-feat:has(.sb-img[hidden])::after{display:none}
.sb-glyph{position:absolute;right:20px;top:20px;width:min(190px,45%);aspect-ratio:1;color:var(--accent-text);opacity:.16;pointer-events:none}
.sb-glyph .ico{stroke-width:1}
.sb-body{position:relative;padding:clamp(26px,3vw,40px);max-width:560px}
.services .sb-feat h3{font-family:var(--display);font-size:clamp(28px,2.7vw,40px);font-weight:var(--h-weight,700);text-transform:var(--h-transform,none);letter-spacing:var(--h-tracking,0);line-height:1.04;margin:0 0 12px;color:inherit}
.services .sb-feat p{font-size:16px;max-width:42ch;color:color-mix(in srgb,var(--fg),transparent 8%)}
.sb-feat .from{color:inherit}
.sb-go{display:inline-flex;align-items:center;margin-top:22px;padding:13px 20px;border-radius:var(--btn-radius,6px);background:#fff;color:#111;font:600 14px/1 var(--body);text-decoration:none;transition:transform .2s,box-shadow .2s}
.sb-go:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px rgba(0,0,0,.5)}
.sb-nopic .sb-go,.sb-feat:has(.sb-img[hidden]) .sb-go{background:var(--accent-text);color:var(--accent)}
.sb-card{position:relative;display:flex;flex-direction:column;align-items:flex-start;padding:28px 26px 26px;border-radius:calc(var(--r-card) + 2px);background:color-mix(in srgb,var(--fg),transparent 94%);border:1px solid color-mix(in srgb,var(--fg),transparent 88%);transition:transform .3s var(--ease),box-shadow .3s,border-color .3s}
.sb-card:hover{transform:translateY(-4px);box-shadow:0 26px 50px -30px rgba(0,0,0,.5);border-color:color-mix(in srgb,var(--ink),transparent 50%)}
.sb-n{position:absolute;top:24px;right:24px;font:600 13px/1 var(--body);letter-spacing:.08em;color:color-mix(in srgb,var(--fg),transparent 18%)}
.on-soft .sb-card{background:color-mix(in srgb,var(--soft),#fff 62%)}
/* ===== trust: bold numbers band ===== */
.trust-band{position:relative;overflow:hidden;padding:clamp(48px,6vw,76px) 0}
.trust-band::before{content:"";position:absolute;inset:0;background:radial-gradient(800px 380px at 92% -20%,color-mix(in srgb,var(--pop-text),transparent 88%),transparent 62%);pointer-events:none}
.trust-band .wrap{position:relative}
.tbb{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:28px 32px}
.tbb li{min-width:0;padding-left:22px;border-left:1px solid color-mix(in srgb,var(--pop-text),transparent 72%)}
.tbb-num{margin:0;display:flex;align-items:flex-start;min-height:1em;font-family:var(--display);font-weight:var(--h-weight,800);font-size:clamp(46px,5.4vw,78px);line-height:.95;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.tbb-num small{font-size:.42em;margin:.12em 0 0 .1em}
.tbb-ico .ico{width:clamp(42px,4.4vw,60px);height:clamp(42px,4.4vw,60px);stroke-width:1.5}
.tbb-l{margin:14px 0 0;max-width:24ch;font:600 13px/1.45 var(--body);letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--pop-text),transparent 12%)}
/* ===== polish: photo depth on hover ===== */
.wy-img img,.intro-img img,.svf-img img,.tp-img img,.hf-pic .hs-img img,.cta-img img{transition:transform 1s var(--ease)}
.wy-img:hover img,.intro-img:hover img,.svf-img:hover img,.tp-img:hover img,.hf-pic:hover .hs-img img,.cta-img:hover img{transform:scale(1.04)}
.rc blockquote,.tb-cards li{transition:transform .3s var(--ease),box-shadow .3s}
.rc li:hover blockquote,.tb-cards li:hover{transform:translateY(-3px);box-shadow:0 22px 44px -30px rgba(0,0,0,.45)}
.edit .sb-card:hover,.edit .rc li:hover blockquote{transform:none}
@media (max-width:1100px){
  .hero-cinema{display:block;min-height:0}
  .hero-cinema .hero-media{bottom:auto;height:min(64svh,620px)}
  .hero-cinema .hero-media::after{background:linear-gradient(180deg,rgba(0,0,0,.4) 0,transparent 22%,color-mix(in srgb,var(--hc-scrim),transparent 70%) 40%,color-mix(in srgb,var(--hc-scrim),transparent 18%) 66%,var(--hc-scrim) 92%)}
  .hero-cinema .hc-in{grid-template-columns:1fr;gap:28px;padding-top:calc(min(64svh,620px) - 190px);padding-bottom:56px}
  .hero-cinema.hero-noimg .hc-in,.hero-cinema:has(.hero-media.empty) .hc-in{padding-top:clamp(110px,14vh,140px)}
  .hero-cinema.hero-noimg .hero-media,.hero-cinema:has(.hero-media.empty) .hero-media{height:auto;bottom:0}
  .hc-copy{max-width:680px}
  .hc-card{max-width:none;justify-self:start}
}
@media (max-width:900px){
  .hcl-grid{grid-template-columns:1fr;gap:44px}
  .hero-collage{padding-top:112px}
  .hero-collage::before{top:auto;width:100%;height:42%}
  .hcl-main{aspect-ratio:4/3}
  .hcl-card{right:12px;top:auto;bottom:0}
  .hcl-art::before{right:-12px;top:-16px}
}
@media (max-width:700px){
  .hero-cinema .hero-media{height:min(58svh,520px)}
  .hero-cinema .hc-in{padding-top:calc(min(58svh,520px) - 150px);padding-bottom:44px}
  .hc-h,.hero-collage .hc-h{font-size:calc(clamp(34px,10vw,48px) * var(--hc-k,1))}.hc-h.hc-long,.hero-collage .hc-h.hc-long{font-size:calc(clamp(30px,8.4vw,40px) * var(--hc-k,1))}.hc-h.hc-short,.hero-collage .hc-h.hc-short{font-size:calc(clamp(40px,12vw,58px) * var(--hc-k,1))}
  .hc-eb{font-size:12px;margin-bottom:16px}
  .hc-sub{font-size:16.5px;margin-top:18px}
  .hc-copy .actions{margin-top:26px}.hc-copy .btn{padding:16px 22px}
  .hc-chips{margin-top:22px;gap:8px}.hc-chips li{font-size:12.5px;padding:7px 12px 7px 10px}
  .hc-card{padding:18px 20px}
  .hcl-two .hcl-main{width:88%}
  .hcl-second{width:40%;border-width:4px}
  .hcl-card{min-width:0;max-width:58%;padding:14px 16px;right:8px}
  .hcl-card .hc-num b{font-size:36px}.hcl-card .hc-cap{font-size:12.5px;margin-top:6px}.hcl-card .hc-ico .ico{width:30px;height:30px}.hcl-card .hc-cap b{font-size:15px}
  .hcl-art{padding-bottom:56px}
  .services-bento .sb{grid-template-columns:1fr!important;gap:12px}
  .sb-feat{grid-row:auto;min-height:380px}
  .sb-card{grid-column:auto!important;padding:24px 22px}
  .tbb{grid-template-columns:repeat(2,minmax(0,1fr));gap:26px 18px}
  .tb-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.tb-cards li{flex-direction:column;align-items:flex-start;gap:12px;padding:18px 16px}.tb-cards .tb-t b{font-size:18px}
  .tbb li{padding-left:16px}
}
`;
})(globalThis.WS = globalThis.WS || {});

(function (WS) {
  const e = WS.esc;
  const camera =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/></svg>';
  const navFor = { prices: 'Prices', services: 'Services', team: 'Team', faq: 'Questions', visit: 'Visit' };

  // Where "Book" buttons go: the owner's booking link, else (multi-page) the Book/Reserve/Quote or Contact page,
  // else the on-page Visit section. '#visit' on a multi-page site would be read by the router as an unknown page.
  // Never points at a page or anchor that does not exist: booking URL -> book/quote/contact page -> on-page
  // booking / visit / contact section -> phone -> email -> '' (callers then hide the button).
  const hasSec = (secs, type) => secs.some((s) => s.type === type);
  const reach = (b) => (WS.str(b.phone) && WS.str(b.phone).replace(/[^\d+]/g, '') ? WS.tel(b.phone) : (/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(WS.str(b.email)) ? 'mailto:' + WS.str(b.email) : ''));
  WS.bookHref = (site) => {
    const b = (site && site.biz) || {};
    const bu = WS.safeUrl(b.bookingUrl);
    if (bu) return bu;
    const pages = WS.pagesOf(site);
    if (pages && pages.length > 1) {
      const bp = pages.find((pg) => /^(book|reserve|quote|order)$/.test(pg.path || ''));
      const cp = bp || pages.find((pg) => pg.path && /contact|visit|reach/i.test((pg.path || '') + ' ' + (pg.title || '')));
      if (cp) return '#/' + cp.path;
    } else {
      const secs = WS.layoutSections(site);
      if (hasSec(secs, 'booking')) return '#book';
      if (hasSec(secs, 'visit')) return '#visit';
      if (hasSec(secs, 'contact')) return '#contact-form';
    }
    return reach(b);
  };
  // Where "Ask about this" / "get in touch" goes: contact page or form, else phone, else email ('' if none).
  WS.contactHref = (site) => {
    const b = (site && site.biz) || {};
    const pages = WS.pagesOf(site);
    if (pages && pages.length > 1) {
      const cp = pages.find((pg) => pg.path && /contact|reach/i.test((pg.path || '') + ' ' + (pg.title || ''))) || pages.find((pg) => /^(book|reserve|quote|order)$/.test(pg.path || ''));
      if (cp) return '#/' + cp.path;
    } else {
      const secs = WS.layoutSections(site);
      if (hasSec(secs, 'contact')) return '#contact-form';
      if (hasSec(secs, 'booking')) return '#book';
    }
    return reach(b) || WS.safeUrl(b.bookingUrl);
  };
  // Owner redirects (old page address -> new one), cleaned: lower-case page paths, no leading slash.
  WS.redirectsOf = (site) => {
    const out = {}, r = site && site.redirects;
    if (!r || typeof r !== 'object') return out;
    const norm = (p) => String(p == null ? '' : p).toLowerCase().trim().replace(/^[#/]+|\/+$/g, '');
    const live = {}; (WS.pagesOf(site) || []).forEach((pg) => { live[norm(pg.path)] = 1; });
    Object.keys(r).forEach((k) => { const from = norm(k), to = norm(r[k]); if (from && from !== to && /^[a-z0-9/_-]+$/.test(from) && /^[a-z0-9/_-]*$/.test(to) && !live[from]) out[from] = to; });
    return out;
  };
  // A titled band with contact buttons: used for the not-found page and for pages that have no content yet.
  WS.noticeBand = ({ title = '', text = '', home = '', homeLabel = 'Back to home', tel = '', mail = '', contact = '', cls = '' } = {}) => {
    const btns = (home ? `<a class="btn" href="${e(home)}">${e(homeLabel)}</a>` : '') + (contact ? `<a class="btn${home ? ' ghost' : ''}" href="${e(contact)}">Get in touch</a>` : '') + (tel ? `<a class="btn ghost" href="${e(tel)}">Call us</a>` : '') + (mail ? `<a class="btn ghost" href="${e(mail)}">Email us</a>` : '');
    return `<section class="pagehead ws-notice on-base${cls ? ' ' + cls : ''}"><div class="wrap">${title ? `<h1 class="pagehead-t">${e(title)}</h1>` : ''}${text ? `<p class="pagehead-s">${e(text)}</p>` : ''}${btns ? `<div class="actions ws-notice-a">${btns}</div>` : ''}</div></section>`;
  };
  WS.notFoundBand = (o = {}) => WS.noticeBand(Object.assign({ title: 'Page not found', text: 'Sorry, we could not find that page. It may have moved or no longer exists.', cls: 'ws-404' }, o));

  // Responsive widths for resizable photo hosts (Unsplash, Google place photos via our proxy), so phones download a ~480px image, not 1680px.
  WS.srcset = (src, sizes) => {
    const s = String(src || '');
    const place = /^https:\/\/websprout\.app\/api\/place-photo\?/.test(s);
    if (!place && !/^https:\/\/images\.unsplash\.com\//.test(s)) return '';
    const at = (w) => (/[?&]w=\d+/.test(s) ? s.replace(/([?&])w=\d+/, '$1w=' + w) : s + (s.indexOf('?') > -1 ? '&' : '?') + 'w=' + w);
    return ` srcset="${(place ? [400, 800, 1200, 1600] : [480, 800, 1200, 1680]).map((w) => e(at(w)) + ' ' + w + 'w').join(', ')}" sizes="${e(sizes || '100vw')}"`;
  };

  function ctxFor(site, sec, mode) {
    const photos = site.photos || {};
    const key = (k) => sec.id + '.' + k;
    const photo = (k) => photos[key(k)];
    const rd = WS.redirectsOf(site);
    return {
      site, mode, biz: site.biz,
      iconStyle: /^(line|emoji)$/.test(site.iconStyle || '') ? site.iconStyle : WS._icoSite === site ? WS._icoVal : WS.iconStyleOf(site),
      name: WS.bizName(site),
      book: e(WS.bookHref(site)),
      contact: e(WS.contactHref(site)),
      // Owner-typed link, made safe ('' = drop it); #/old-page links follow the site's redirects. Returned escaped.
      link: (u) => { let s = WS.safeUrl(u); if (/^#\//.test(s)) { const p = s.slice(2).toLowerCase(); if (Object.prototype.hasOwnProperty.call(rd, p)) s = '#/' + rd[p]; } return e(s); },
      photo,
      slot: (k, { hint = 'Add a photo', cls = '', alt = '' } = {}) => {
        const src = photo(k);
        if (!src && mode === 'live') return `<figure class="slot ${cls} empty" hidden></figure>`;
        return `<figure class="slot ${cls}${src ? '' : ' empty'}" data-slot="${key(k)}">${src ? `<img src="${e(src)}"${WS.srcset(src, '(max-width: 760px) 100vw, 50vw')} alt="${e(alt)}" loading="lazy" decoding="async"${mode === 'live' ? ` onerror="var f=this.closest('figure');if(f)f.hidden=true;"` : ''}>` : ''}${
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
    var tg=document.querySelector('.navtoggle');
    if(tg)tg.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();var o=document.body.classList.toggle('nav-open');tg.setAttribute('aria-expanded',o?'true':'false');},true);
    var pages=[].slice.call(document.querySelectorAll('.ws-page'));
    if(!pages.length)return;
    var BASE=document.title,BRAND=(BASE.split('|')[0]||BASE).trim(),NF=document.querySelector('[data-nf]'),RD={};
    try{var rde=document.getElementById('ws-redirects');if(rde)RD=JSON.parse(rde.textContent||'{}')||{};}catch(e){}
    function path(){return (location.hash||'').replace(/^#\\/?/,'').split('?')[0];}
    function show(pth,hops){
      var found=false,i,active=null;
      pth=String(pth||'').toLowerCase();
      for(i=0;i<pages.length;i++){if((pages[i].getAttribute('data-path')||'')===pth){found=true;active=pages[i];}}
      // An old page address the owner renamed or deleted: follow the redirect (at most a few hops).
      if(!found&&pth&&Object.prototype.hasOwnProperty.call(RD,pth)&&(hops||0)<5){var to=RD[pth];try{history.replaceState(null,'','#/'+to);}catch(e){}return show(to,(hops||0)+1);}
      var missing=!found&&!!pth&&!!NF;
      if(!found&&!missing)active=pages[0];
      for(i=0;i<pages.length;i++)pages[i].classList.toggle('on',pages[i]===active);
      if(NF)NF.hidden=!missing;
      if(active)pth=active.getAttribute('data-path')||'';
      try{var pt=missing?(NF.getAttribute('data-title')||''):(active?active.getAttribute('data-title'):'');document.title=((pth||missing)&&pt)?(pt+' · '+BRAND):BASE;}catch(e){}
      var links=document.querySelectorAll('[data-page]');
      for(i=0;i<links.length;i++)links[i].classList.toggle('active',(links[i].getAttribute('data-page')||'')===pth);
      try{window.scrollTo(0,0);}catch(e){}
      try{document.body.classList.remove('nav-open');var tgl=document.querySelector('.navtoggle');if(tgl)tgl.setAttribute('aria-expanded','false');}catch(e){}
      try{var t=document.querySelector('[data-top]');if(t){t.classList.remove('solid');t.style.removeProperty('--top-offset');}if(window.__wsOver)window.__wsOver();}catch(e){}
      try{parent.postMessage({ws:true,type:'wsPageShown',path:pth},'*');}catch(e){}
    }
    window.__wsShowPage=show;
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

  // ---- Local search structured data (schema.org LocalBusiness JSON-LD) ----
  // The most specific schema.org type we can read from the business type text (works for any category,
  // including ones added later); first match wins, so specific phrases come before generic words.
  WS.ldTypes = [
    [/nail/, 'NailSalon'], [/barber|hair|salon|stylist|blowout/, 'HairSalon'], [/massage|\bspa\b|day ?spa|wellness/, 'DaySpa'],
    [/beauty|lash|brow|esthetic|makeup|wax/, 'BeautySalon'], [/tattoo|piercing/, 'TattooParlor'],
    [/bakery|bakehouse|cake|pastr|patisserie|donut|doughnut|cupcake/, 'Bakery'], [/coffee|caf[eé]|espresso|tea ?house/, 'CafeOrCoffeeShop'],
    [/ice ?cream|gelato|frozen yogurt/, 'IceCreamShop'], [/brewery|brew ?pub/, 'Brewery'], [/winery|vineyard/, 'Winery'],
    [/\bbar\b|\bpub\b|tavern|lounge|cocktail/, 'BarOrPub'], [/food ?truck|catering|caterer/, 'FoodEstablishment'],
    [/restaurant|pizz|taco|taqueria|grill|diner|bistro|sushi|bbq|barbecue|kitchen|eatery|burger|ramen|noodle|steak|deli\b|trattoria|cantina/, 'Restaurant'],
    [/plumb/, 'Plumber'], [/electric/, 'Electrician'], [/hvac|heating|air ?condition|furnace|cooling/, 'HVACBusiness'], [/roof/, 'RoofingContractor'],
    [/painter|painting/, 'HousePainter'], [/locksmith/, 'Locksmith'], [/moving|movers/, 'MovingCompany'],
    [/contractor|construction|remodel|renovat|builder|handyman|carpent/, 'GeneralContractor'],
    [/car ?wash|detailing|auto ?detail/, 'AutoWash'], [/auto ?body|collision/, 'AutoBodyShop'], [/\btires?\b/, 'TireShop'],
    [/auto|mechanic|car repair|garage|transmission|oil change|brake/, 'AutoRepair'],
    [/dentist|dental|orthodont/, 'Dentist'], [/physical therap|physiotherap/, 'Physiotherapy'], [/optometr|optician|eye care/, 'Optician'],
    [/pharmac/, 'Pharmacy'], [/veterinar|\bvet\b|animal hospital/, 'VeterinaryCare'], [/chiropract|clinic|medical|urgent care/, 'MedicalClinic'],
    [/doctor|physician|pediatric|family medicine/, 'Physician'],
    [/pet (store|shop|supply|supplies)/, 'PetStore'], [/\bpets?\b|\bdogs?\b|\bcats?\b|groom|kennel/, 'LocalBusiness'],
    [/daycare|day care|child ?care|preschool|nursery school/, 'ChildCare'], [/florist|flower/, 'Florist'],
    [/yoga|pilates|gym|fitness|crossfit|boxing|martial|personal train/, 'ExerciseGym'],
    [/\blaw\b|attorney|lawyer|legal/, 'Attorney'], [/accountant|accounting|cpa\b|bookkeep|\btax/, 'AccountingService'], [/real ?estate|realtor|realty/, 'RealEstateAgent'],
    [/insurance/, 'InsuranceAgency'], [/hotel|motel|\binn\b|lodg/, 'Hotel'], [/b ?& ?b|bed and breakfast/, 'BedAndBreakfast'],
    [/clean|maid|janitor|lawn|landscap|garden|tree service|junk|haul|appliance repair|pest control|pressure wash|\bpool/, 'HomeAndConstructionBusiness'],
    [/boutique|clothing|apparel|fashion/, 'ClothingStore'], [/jewel/, 'JewelryStore'], [/book ?store|bookshop/, 'BookStore'],
    [/hardware/, 'HardwareStore'], [/furniture/, 'FurnitureStore'], [/\bbike|bicycle/, 'BikeStore'], [/grocer|market\b/, 'GroceryStore'],
    [/shop|store|retail|gift/, 'Store'],
  ];
  WS.ldType = (type) => { const t = String(type || '').toLowerCase(); const hit = t && WS.ldTypes.find((x) => x[0].test(t)); return hit ? hit[1] : 'LocalBusiness'; };
  // Every section the site shows (all pages), for services/prices/photos.
  WS.allSections = (site) => { const p = WS.pagesOf(site); return (p ? p.reduce((a, pg) => a.concat((pg && pg.sections) || []), []) : (site && site.sections) || []).filter((s) => s && !s.hidden); };
  // opts: { url, image }. Only facts the owner gave: no invented prices. No aggregateRating/review markup:
  // Google's guidelines forbid ratings aggregated from other sites, and business pages can't get review stars.
  WS.businessLd = (site, opts = {}) => {
    const b = (site && site.biz) || {};
    const s = WS.str;
    const ld = { '@context': 'https://schema.org', '@type': WS.ldType(s(b.type) || s(site.category)), name: WS.bizName(site) };
    const url = s(opts.url) || (site.slug ? 'https://' + String(site.slug).toLowerCase().replace(/[^a-z0-9-]/g, '') + '.websprout.app/' : '');
    if (url) { ld['@id'] = url.replace(/#.*$/, '') + '#business'; ld.url = url; }
    const desc = s(b.seoDescription) || s(b.tagline) || s(b.about);
    if (desc) ld.description = desc.slice(0, 300);
    if (s(b.phone).replace(/[^\d]/g, '').length >= 7) ld.telephone = s(b.phone);
    if (/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(s(b.email))) ld.email = s(b.email);
    if (s(b.address) || s(b.city)) {
      ld.address = { '@type': 'PostalAddress' };
      const parts = s(b.address).split(',').map((x) => x.trim()).filter(Boolean);
      if (parts.length) ld.address.streetAddress = parts[0];
      const loc = s(b.city) || (parts.length > 1 ? parts[1] : '');
      if (loc) ld.address.addressLocality = loc.split(',')[0].trim();
      const st = (s(b.city) + ' ' + parts.slice(1).join(' ')).match(/\b([A-Z]{2})\b/), zip = parts.slice(1).join(' ').match(/\b\d{5}(?:-\d{4})?\b/);
      if (st) ld.address.addressRegion = st[1];
      if (zip) ld.address.postalCode = zip[0];
      if (s(b.country)) ld.address.addressCountry = s(b.country);
    }
    if (s(b.address)) ld.hasMap = WS.map(b.address);
    const img = /^https?:\/\//i.test(s(opts.image)) ? s(opts.image) : '';
    if (img) ld.image = img;
    if (/^https:\/\//.test(s(b.logo))) ld.logo = s(b.logo);
    const same = [];
    const ig = WS.igHandle(b.instagram); if (ig) same.push('https://instagram.com/' + ig);
    ['facebook', 'googleUrl', 'yelp', 'tiktok'].forEach((k) => { const u = WS.safeUrl(b[k]); if (/^https:\/\//.test(u) && same.indexOf(u) < 0) same.push(u); });
    if (/^[A-Za-z0-9_-]{10,300}$/.test(s(b.googlePlaceId))) same.push('https://www.google.com/maps/place/?q=place_id:' + s(b.googlePlaceId));
    if (same.length) ld.sameAs = same;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const t24 = (v) => { const m = s(v).match(/^(\d{1,2}):(\d{2})/); return m ? ('0' + m[1]).slice(-2) + ':' + m[2] : ''; };
    if (Array.isArray(b.hours)) {
      const oh = [];
      b.hours.forEach((hr, i) => {
        if (!hr || !t24(hr.open) || !t24(hr.close)) return;
        const d = days.find((x) => s(hr.d) && x.slice(0, 3).toLowerCase() === s(hr.d).slice(0, 3).toLowerCase()) || days[i];
        if (d) oh.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/' + d, opens: t24(hr.open), closes: t24(hr.close) });
      });
      if (oh.length) ld.openingHoursSpecification = oh;
    }
    // Services, price list, plans and products the site shows: names always, prices only when the owner gave one.
    const cur = (v) => (/£/.test(v) ? 'GBP' : /€/.test(v) ? 'EUR' : 'USD');
    const offers = [], seen = {}, nums = [];
    WS.allSections(site).forEach((sec) => {
      if (!/^(services|prices|plans|products)$/.test(sec.type)) return;
      const kind = sec.type === 'products' ? 'Product' : 'Service';
      (Array.isArray(sec.items) ? sec.items : []).forEach((it) => {
        if (!it || typeof it !== 'object') return;
        const nm = s(it.name || it.title); if (!nm || seen[nm.toLowerCase()] || offers.length >= 40) return;
        seen[nm.toLowerCase()] = 1;
        const item = { '@type': kind, name: nm.slice(0, 120) };
        const dsc = s(it.text || it.desc || it.meta); if (dsc) item.description = dsc.slice(0, 200);
        const o = { '@type': 'Offer', itemOffered: item };
        const raw = s(it.price || it.from); const n = WS.priceNum(raw);
        if (n) { nums.push(n); o.priceCurrency = cur(raw); if (/\+|from|start/i.test(raw) || s(it.from)) o.priceSpecification = { '@type': 'PriceSpecification', minPrice: n, priceCurrency: cur(raw) }; else o.price = n; }
        offers.push(o);
      });
    });
    if (offers.length) ld.hasOfferCatalog = { '@type': 'OfferCatalog', name: 'Services', itemListElement: offers };
    if (nums.length) { const lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums); const sym = { GBP: '£', EUR: '€' }[(offers.find((o) => o.priceCurrency) || {}).priceCurrency] || '$'; ld.priceRange = sym + lo + (hi > lo ? '–' + sym + hi : ''); }
    return ld;
  };
  // A JSON-LD <script>; '<' is escaped so owner text can never close the tag.
  WS.ldScript = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, String.fromCharCode(92) + 'u003c') + '</script>';

  // Page rhythm: section tones by position, so a page alternates between clearly different bands instead of a run
  // of same-colored text sections. Fixed: the hero and page header, the trust strip under the hero, forms, call-to-
  // action bands and anything already loud (pop: reviews feature, numbers band) or given an explicit tone. Light
  // themes (and themes whose alt band contrasts): the section's own alt band stays (a dark services band on white),
  // base sections alternate base / soft tint. Dark themes whose alt is nearly the base color alternate base / raised,
  // with one inverted light band in the middle (two on long pages). out: [{ s, html }], html rewritten in place.
  WS.TONE_FIXED = { hero: 1, pagehead: 1, announce: 1, cta: 1, trust: 1, contact: 1, booking: 1, embed: 1, payments: 1, servicearea: 1, events: 1, shopcart: 1 };
  WS.toneSeq = (out, p) => {
    const rx = /^(\s*<section\b[^>]*?\bclass="[^"]*?)\bon-(base|alt|pop)\b/;
    const items = out.map((x) => { const m = rx.exec(x.html || ''); return { x, tone: m ? m[2] : '', fixed: !m || m[2] === 'pop' || !!WS.TONE_FIXED[x.s.type] || !!(x.s && x.s.tone) }; });
    const free = items.filter((it) => !it.fixed);
    if (!free.length) return out;
    const darkWeak = WS.isDark(p) && WS.altWeak(p);
    const softAt = new Set();
    if (darkWeak && free.length >= 3) {
      const pref = ['why', 'steps', 'faq', 'services', 'intro', 'reviews', 'team', 'prices', 'gallery', 'area', 'visit', 'stats'];
      const want = free.length >= 6 ? [free.length / 3, (2 * free.length) / 3] : [(free.length - 1) / 2];
      want.forEach((w) => {
        let best = -1, bs = 1e9;
        free.forEach((it, i) => { if (softAt.has(i) || softAt.has(i - 1) || softAt.has(i + 1) || i === 0 && free.length > 3) return; const r = pref.indexOf(it.x.s.type); const sc = Math.abs(i - w) * 3 + (r < 0 ? 20 : r * 0.4); if (sc < bs) { bs = sc; best = i; } });
        if (best > -1) softAt.add(best);
      });
    }
    let prev = '';
    items.forEach((it) => {
      if (it.fixed) { prev = it.tone || prev; return; }
      const i = free.indexOf(it);
      let t;
      if (darkWeak) t = softAt.has(i) ? 'soft' : (prev === 'base' ? 'alt' : 'base');
      else if (it.tone === 'alt') t = prev === 'alt' ? 'soft' : 'alt';
      else t = prev === 'base' ? 'soft' : 'base';
      if (t !== it.tone) it.x.html = it.x.html.replace(rx, '$1on-' + t);
      prev = t;
    });
    return out;
  };
  WS.renderSite = (site, { mode = 'live', activePath = null } = {}) => {
    const p = WS.withAccent(WS.palette(site.palette), site.accent);
    WS._icoSite = site; WS._icoVal = WS.iconStyleOf(site);
    const b = site.biz || (site.biz = {});
    const name = WS.bizName(site);
    // C1: site.pages is the source of truth whenever present (even a single page); legacy sites use site.sections.
    const allPages = WS.pagesOf(site);
    const multi = !!(allPages && allPages.length > 1);
    const label = (pg) => WS.str(pg.title) || (pg.path ? WS.titleCase(pg.path) : 'Home');
    const ig = WS.igHandle(b.instagram);
    const contactHref = WS.contactHref(site);
    // Render a page's sections; returns { html, pad } (pad: the first band has no room for the fixed header).
    const renderList = (secs, pageTitle) => {
      const out = secs.map((s) => ({ s, html: WS.renderSection(site, s, mode) })).filter((x) => x.html);
      try { WS.toneSeq(out, p); } catch (_t) {}
      if (!out.length && mode === 'live') {
        const tel = WS.str(b.phone).replace(/[^\d+]/g, '') ? WS.tel(b.phone) : '';
        const mail = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(WS.str(b.email)) ? 'mailto:' + WS.str(b.email) : '';
        const cHref = /^#/.test(contactHref) && contactHref !== '#/' + (pageTitle && pageTitle.path) ? contactHref : '';
        return { html: WS.noticeBand({ title: pageTitle ? label(pageTitle) : name, text: 'This page is being updated. In the meantime, we would love to hear from you.', contact: cHref, tel, mail, cls: 'ws-empty' }), pad: false, out };
      }
      return { html: out.map((x) => x.html).join('\n'), pad: !!(out[0] && !/^(hero|pagehead)$/.test(out[0].s.type)), out };
    };
    let body, nav, top, mainPad = false, navCount = 0;
    if (multi) {
      const pages = allPages;
      const home = pages[0] || { sections: [] };
      const annSecs = (home.sections || []).filter((s) => s && s.type === 'announce' && !s.hidden);
      top = annSecs.map((s) => WS.renderSection(site, s, mode)).join('');
      body = pages.map((pg, idx) => {
        const r = renderList((pg.sections || []).filter((s) => s && !s.hidden && s.type !== 'announce'), pg);
        const on = (activePath != null ? (pg.path || '') === activePath : idx === 0) ? ' on' : '';
        return `<div class="ws-page${on}${r.pad ? ' ws-padtop' : ''}" data-path="${e(pg.path || '')}" data-title="${e(label(pg))}" role="region" aria-label="${e(label(pg))}">${r.html}</div>`;
      }).join('\n') + `\n<div class="ws-nf" data-nf data-title="Page not found" hidden>${WS.notFoundBand({ home: '#/', contact: /^#\//.test(contactHref) ? contactHref : '' })}</div>`;
      const navPages = pages.filter((pg) => pg.nav !== false);
      navCount = navPages.length;
      nav = navPages.map((pg) => `<a href="#/${e(pg.path || '')}" data-page="${e(pg.path || '')}" title="${e(label(pg))}">${e(label(pg))}</a>`).join('');
    } else {
      const secs = WS.layoutSections(site);
      const announce = secs.filter((s) => s.type === 'announce');
      const rest = secs.filter((s) => s.type !== 'announce');
      const r = renderList(rest, null);
      body = r.html;
      mainPad = r.pad;
      // Only link to sections that actually rendered (an empty Team section must not leave a dead nav link).
      const seenNav = {};
      nav = r.out.filter((x) => navFor[x.s.type] && !seenNav[x.s.type] && (seenNav[x.s.type] = 1)).map((x) => `<a href="#${x.s.type}">${navFor[x.s.type]}</a>`).join('');
      top = announce.map((s) => WS.renderSection(site, s, mode)).join('');
    }
    const usesEmoji = /notoemoji/.test(body + top);
    const brand = site.brand || 'Websprout';
    const desc = b.seoDescription || b.tagline || '';
    const pillHref = WS.bookHref(site);
    // Stock photos (Unsplash) must credit the photographer; Google place photos credit their author (authorAttributions:
    // name linked to their profile) and "Google Maps" (Google's text attribution where its logo isn't used).
    // Only credit photos the site still uses.
    const _pc = site.photoCredits || {}; const _used = site.photos || {}; const _seenPc = {};
    const _pcl = Object.keys(_pc).filter((k) => _used[k] && _pc[k] && _pc[k].name && !_seenPc[(_pc[k].source || '') + '|' + _pc[k].name] && (_seenPc[(_pc[k].source || '') + '|' + _pc[k].name] = 1));
    const _pcg = _pcl.filter((k) => _pc[k].source === 'google');
    // A Google photo can fall back to an Unsplash backup (site.photoFallbacks[key]) when Google is unavailable, so its
    // backup photographer is credited too: whichever image shows is credited. (Reporting use to Unsplash is server-side.)
    const _pfb = site.photoFallbacks || {};
    const _pcu = _pcl.filter((k) => _pc[k].source !== 'google').map((k) => _pc[k]);
    Object.keys(_pc).forEach((k) => { const f = _pfb[k]; if (_used[k] && _pc[k] && _pc[k].source === 'google' && f && typeof f === 'object' && WS.str(f.name) && !_seenPc['|' + f.name] && (_seenPc['|' + f.name] = 1)) _pcu.push({ name: WS.str(f.name), link: f.link }); });
    const _utm = 'utm_source=websprout&utm_medium=referral';
    const photoCredit = (_pcu.length ? ` &nbsp;·&nbsp; Photos by ${_pcu.slice(0, 8).map((c) => `<a href="${e(String((/^https:\/\//i.test(WS.safeUrl(c.link)) && WS.safeUrl(c.link)) || 'https://unsplash.com').split('?')[0] + '?' + _utm)}">${e(c.name)}</a>`).join(', ')} on <a href="https://unsplash.com/?${_utm}">Unsplash</a>` : '')
      + (_pcg.length ? ` &nbsp;·&nbsp; Photo${_pcg.length > 1 ? 's' : ''}: ${_pcg.slice(0, 6).map((k) => { const u = WS.safeUrl(_pc[k].link); return /^https:\/\//i.test(u) ? `<a href="${e(u)}" target="_blank" rel="nofollow noopener">${e(_pc[k].name)}</a>` : e(_pc[k].name); }).join(', ')} · Google Maps` : '');
    const markHref = multi ? '#/' : '#';
    const routerInit = (multi && activePath != null) ? `window.__wsInitPath=${JSON.stringify(activePath)};` : '';
    const runtime = WS.runtime(site) + (multi ? routerInit + WS.pageRouter : '');
    // Hero photo (for social preview) + a generated favicon monogram + LocalBusiness structured data.
    // Social image: the hero photo, else the first web photo the site uses (data: URIs are useless to crawlers).
    let heroPhoto = '';
    try {
      const webPhoto = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u) : '');
      const photos = site.photos || {};
      const h = WS.layoutSections(site).find((s) => s.type === 'hero');
      heroPhoto = (h && webPhoto(photos[h.id + '.photo'])) || '';
      if (!heroPhoto) {
        const used = {}; (allPages ? allPages.reduce((a, pg) => a.concat(pg.sections || []), []) : (site.sections || [])).forEach((s) => { if (s && !s.hidden) used[s.id] = 1; });
        const k = Object.keys(photos).find((x) => used[x.split('.')[0]] && webPhoto(photos[x])) || Object.keys(photos).find((x) => webPhoto(photos[x]));
        heroPhoto = k ? photos[k] : '';
      }
    } catch (_e) {}
    const initial = e(name.charAt(0).toUpperCase() || 'W');
    const seoTitle = WS.str(b.seoTitle);
    const sub = WS.str(b.city) ? (WS.str(b.type) ? WS.str(b.type) + ' in ' + WS.str(b.city) : WS.str(b.city)) : '';
    const docTitle = seoTitle || [name, sub].filter(Boolean).join(' | ');
    const rd = WS.redirectsOf(site);
    const rdScript = Object.keys(rd).length ? `<script type="application/json" id="ws-redirects">${JSON.stringify(rd).replace(/</g, '\\u003c')}</script>` : '';
    const tt0 = (WS.typeTheme ? WS.typeTheme(site.typeset) : null) || { vars: {} };
    const logoOk = /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/.test(b.logo || '') || /^https:\/\//.test(b.logo || '');
    const navMany = multi && navCount > 6;
    const pageLinks = multi ? allPages.filter((pg) => pg.nav !== false).map((pg) => `<a href="#/${e(pg.path || '')}">${e(label(pg))}</a>`).join('') : '';
    const footSub = WS.str(b.tagline) ? `<p>${e(WS.str(b.tagline))}</p>` : (WS.str(b.type) ? `<p>${e(WS.str(b.type))}${WS.str(b.city) ? ' in ' + e(WS.str(b.city)) : ''}</p>` : '');
    const footReach = (WS.str(b.phone) ? `<a href="${WS.tel(b.phone)}">${e(b.phone)}</a>` : '') + (WS.str(b.email) ? `<a href="mailto:${e(WS.str(b.email))}">${e(b.email)}</a>` : '') + (WS.str(b.address) ? `<a href="${WS.map(b.address)}">${e(b.address)}</a>` : (WS.str(b.city) ? `<span>${e(b.city)}</span>` : '')) + (ig ? `<a href="https://instagram.com/${e(ig)}">Instagram</a>` : '') + (pillHref ? `<a href="${e(pillHref)}">${e(b.bookLabel || 'Get in touch')}</a>` : '');
    // Automatic logo: the business name in the heading font, with an optional mark (icon, monogram or badge).
    const lm = WS.logoMarkOf(site), mono = e(WS.initials(name));
    const sym = lm.style === 'monogram' ? `<span class="mk-sym mk-mono${mono.length > 1 ? ' mk-2' : ''}" aria-hidden="true">${mono}</span>` : lm.style === 'badge' ? `<span class="mk-sym mk-badge" aria-hidden="true">${WS.iconSvg(lm.icon)}</span>` : lm.style === 'icon' ? `<span class="mk-sym mk-ico" aria-hidden="true">${WS.iconSvg(lm.icon)}</span>` : '';
    const markInner = `${sym}<span class="mk-name">${e(name)}</span>`;
    const favMark = lm.style === 'icon' || lm.style === 'badge' ? `<g transform="translate(13 13) scale(1.583)" fill="none" stroke="${p.accentText}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${WS.ICONS[lm.icon].replace(/'/g, '"')}</g>` : `<text x="32" y="${lm.style === 'monogram' && mono.length > 1 ? 42 : 45}" font-family="Inter,Arial,sans-serif" font-size="${lm.style === 'monogram' && mono.length > 1 ? 28 : 38}" font-weight="700" text-anchor="middle" fill="${p.accentText}">${lm.style === 'monogram' && !logoOk ? mono : initial}</text>`;
    const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${lm.style === 'monogram' && /999/.test(String((tt0.vars || {})['--btn-radius'] || '')) ? 32 : 14}" fill="${p.accent}"/>${logoOk ? `<text x="32" y="45" font-family="Inter,Arial,sans-serif" font-size="38" font-weight="700" text-anchor="middle" fill="${p.accentText}">${initial}</text>` : favMark}</svg>`;
    const favicon = `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favSvg)}">`;
    const social = `<meta property="og:type" content="website"><meta property="og:site_name" content="${e(name)}">${heroPhoto ? `<meta property="og:image" content="${e(heroPhoto)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${e(heroPhoto)}">` : `<meta name="twitter:card" content="summary">`}`;
    let ldScript = '';
    try { ldScript = WS.ldScript(WS.businessLd(site, { image: heroPhoto })); } catch (_l) {}
    // Type theme: fonts + CSS custom-prop overrides (bold / editorial / clean), picked per category at generation.
    const tt = (WS.typeTheme ? WS.typeTheme(site.typeset) : null) || { fonts: WS.styleFonts, vars: {} };
    const ttFonts = (tt.fonts && tt.fonts.length) ? tt.fonts : WS.styleFonts;
    const ttVars = Object.keys(tt.vars || {}).map((k) => k + ':' + tt.vars[k]).join(';');
    const ttClass = ' wst-' + (WS.typeThemes && WS.typeThemes[site.typeset] ? site.typeset : 'bold');
    // Header over a photo opening: light text on a soft scrim until it turns solid (the runtime re-checks per page).
    const firstSec = ((allPages ? (allPages[0] && allPages[0].sections) : site.sections) || []).filter((x) => x && !x.hidden && x.type !== 'announce')[0];
    const overHero = !!(firstSec && firstSec.type === 'hero' && /^(photo|center|cinema)$/.test(firstSec.variant || 'photo') && (site.photos || {})[firstSec.id + '.photo']);
    // Phone action bar: Call + the main action (never two buttons that do the same thing). Not in the editor.
    const telHref = WS.str(b.phone).replace(/[^\d+]/g, '').length >= 7 ? WS.tel(b.phone) : '';
    const mainHref = pillHref && pillHref !== telHref ? pillHref : '';
    const mainLabel = WS.str(b.bookLabel).length && WS.str(b.bookLabel).length <= 20 ? WS.str(b.bookLabel) : (WS.str(b.bookShort) || 'Get in touch');
    const bar = mode === 'edit' || (!telHref && !mainHref) ? '' : `<div class="ws-bar${telHref && mainHref ? '' : ' one'}">${telHref ? `<a class="wb-call" href="${e(telHref)}">${WS.iconSvg('phone')}<span>Call</span></a>` : ''}${mainHref ? `<a class="wb-main" href="${e(mainHref)}">${WS.iconSvg(/^mailto:/.test(mainHref) ? 'message-circle' : 'calendar-check')}<span>${e(mainLabel)}</span></a>` : ''}</div>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(docTitle)}</title>
<meta name="description" content="${e(desc)}">
<meta name="theme-color" content="${p.base}">
${favicon}
<meta property="og:title" content="${e(name)}"><meta property="og:description" content="${e(desc)}">
${social}
${ldScript}${rdScript}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${ttFonts.map((f) => 'family=' + f).join('&')}&display=swap">
<style>:root{${WS.paletteCss(p)};--foot-ink:${WS.fitContrast(p.accent, '#111111', 3)};${ttVars}}${WS.styleCss}${WS.emojiCss}${ttVars ? `body{${ttVars};font-family:var(--body)}` : ''}</style>
</head>
<body class="es-${e(site.emojiStyle || 'color')}${ttClass}${/^(sharp|soft|round)$/.test(site.corners || '') ? ' wsr-' + site.corners : ''}${mode === 'edit' ? ' edit' : ''}${multi ? ' multipage' : ''}${navMany ? ' nav-many' : ''}${top ? ' has-announce' : ''}${bar ? ' has-bar' : ''}${WS.contrast(p.accent, '#000000') < 3 ? ' acc-dark' : ''}">
${top}
<header class="top${overHero ? ' over' : ''}" data-top><a class="mark${logoOk ? ' has-logo' : ' mk mks-' + lm.style}${name.length > 18 ? ' mark-long' : ''}" href="${markHref}">${logoOk ? `<img class="mark-logo" src="${e(b.logo)}" alt="${e(name)}" onerror="var a=this.parentNode;if(a)a.classList.remove('has-logo');this.replaceWith(document.createTextNode(this.alt||''));">` : markInner}</a><nav aria-label="Main">${nav}</nav>${pillHref ? `<a class="pill" href="${e(pillHref)}">${e(b.bookShort || 'Book')}</a>` : '<span></span>'}${multi ? '<button class="navtoggle" type="button" aria-label="Menu" aria-expanded="false"><svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true"><path d="M3 7h17M3 11.5h17M3 16h17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' : ''}</header>
<main${mainPad ? ' class="ws-padtop"' : ''}>
${body}
</main>
<footer class="foot"><div class="foot-brand"><b class="mk mks-${logoOk ? 'wordmark' : lm.style}">${logoOk ? `<span class="mk-name">${e(name)}</span>` : markInner}</b>${footSub}</div>${multi ? `<nav class="foot-col" aria-label="Pages"><h4>Pages</h4>${pageLinks}</nav>` : `<div class="foot-col"></div>`}<div class="foot-col">${footReach ? `<h4>Contact</h4>${footReach}` : ''}</div></footer>
<p class="credits"><a href="https://websprout.app/?ref=site">Made with ${e(brand)}</a>${photoCredit}${usesEmoji ? ` &nbsp;·&nbsp; Animated emoji: <a href="https://googlefonts.github.io/noto-emoji-animation/">Noto Emoji by Google</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>` : ''}</p>
${bar}
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
  // Desktop nav that does not fit (many or long page names) folds into the menu button instead of overflowing.
  try{var nvb=document.body,nvn=top.querySelector('nav');var navFit=function(){if(!nvn||!nvb.classList.contains('multipage')||nvb.classList.contains('nav-open')||nvn.querySelectorAll('a').length>6)return;nvb.classList.remove('nav-many');if(window.innerWidth>900&&top.scrollWidth>top.clientWidth+2)nvb.classList.add('nav-many');};navFit();window.addEventListener('resize',navFit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(navFit);}catch(e){}
  function seen(els,fn){if(!('IntersectionObserver' in window)||EDIT){els.forEach(fn);return}var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){fn(x.target);io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px'});els.forEach(function(el){io.observe(el)})}
  // Header over a photo opening (light text until it turns solid), re-checked when a page shows or a photo fails.
  function overCheck(){try{var root=document.querySelector('.ws-page.on')||document.querySelector('main');var f=null,k=root?root.children:[];for(var i=0;i<k.length;i++){if(k[i].offsetHeight>0){f=k[i];break}}top.classList.toggle('over',!!(f&&f.classList.contains('hero-photo')&&!f.classList.contains('hero-noimg')&&!f.querySelector('.hero-media.empty')))}catch(e){}}
  window.__wsOver=function(){overCheck();railKeys()};overCheck();document.addEventListener('error',function(ev){if(ev.target&&ev.target.tagName==='IMG'){setTimeout(overCheck,0);setTimeout(galFix,0)}},true);
  // A gallery photo that fails to load drops out (its figure hides itself): the layout follows the photos that are left,
  // and a gallery with none left disappears, so a visitor never sees an empty tile.
  function galFix(){if(EDIT)return;[].slice.call(document.querySelectorAll('section.gallery')).forEach(function(g){var n=g.querySelectorAll('.g-wrap>figure:not([hidden])').length;for(var i=0;i<7;i++)g.classList.remove('gn'+i);g.classList.add('gn'+n);if(!n)g.hidden=true})}
  galFix();
  // Fade-and-rise on scroll, once: only for things below the first screen, added here so content is visible without JS.
  // Cards in a phone carousel reveal together with their row. Never in the editor or with reduced motion.
  try{var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!EDIT&&!RM&&!navigator.webdriver&&('IntersectionObserver' in window)){
      var vh=window.innerHeight||800,groups=[],rvSel='.v-info,.tbb>li,.wy-cols>li,.wy-list>li,.ar-towns,.tb-cards>li,main section .sh,.sv>li,.steps-grid>li,.plan,.rw>blockquote,.rc>li,.g-wrap>figure,.tp>li,.tr>li,.qa,.v-map,.cc-box,.intro .statement,.ic-grid>div,.reveal,.stat,.wsp-card,.pay-card,.ev-row';
      [].slice.call(document.querySelectorAll(rvSel)).forEach(function(el){if(el.classList.contains('rv')||el.closest('.rv'))return;var r=el.getBoundingClientRect();if(!r.height||r.top<vh*0.92)return;var i=[].indexOf.call(el.parentNode.children,el);el.style.setProperty('--rv',Math.min(i,4)*80+'ms');el.classList.add('rv');var g=el.closest('.rail')||el;if(groups.indexOf(g)<0)groups.push(g);});
      var done=function(el){el.classList.add('in');setTimeout(function(){el.classList.remove('rv','in');el.style.removeProperty('--rv')},1300)};
      var rio=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;rio.unobserve(x.target);if(x.target.classList.contains('rv'))done(x.target);[].slice.call(x.target.querySelectorAll('.rv')).forEach(done)})},{rootMargin:'0px 0px -8% 0px'});
      groups.forEach(function(g){rio.observe(g)});
      var rvPast=function(){var h=window.innerHeight||800;[].slice.call(document.querySelectorAll('.rv:not(.in)')).forEach(function(el){if(el.getBoundingClientRect().top<h*0.6)done(el)})},rvT=0;
      window.addEventListener('scroll',function(){if(!rvT)rvT=setTimeout(function(){rvT=0;rvPast()},150)},{passive:true});
      window.addEventListener('beforeprint',function(){[].slice.call(document.querySelectorAll('.rv')).forEach(done)});
    }}catch(e){}
  // Phone carousels scroll sideways: make them reachable by keyboard while (and only while) they scroll.
  function railKeys(){[].slice.call(document.querySelectorAll('.rail')).forEach(function(r){if(r.scrollWidth>r.clientWidth+2)r.setAttribute('tabindex','0');else r.removeAttribute('tabindex')})}
  railKeys();window.addEventListener('resize',railKeys);window.addEventListener('load',railKeys);
  // Map placeholder: load Google's map only when the visitor asks for it.
  // The map is Google's Maps Embed API, which needs a key: baked in when the renderer had one, else given to the
  // published page by the server as <meta name="ws-maps-key">. No key: the placeholder stays a directions link.
  function loadMap(ph){var src=ph.getAttribute('data-map');if(!src||!ph.parentNode)return;var fr=document.createElement('iframe');fr.className='mapf';fr.title=ph.getAttribute('data-map-title')||'Map';fr.src=src;fr.setAttribute('loading','lazy');fr.setAttribute('referrerpolicy','no-referrer-when-downgrade');fr.setAttribute('allowfullscreen','');ph.parentNode.replaceChild(fr,ph);}
  try{var MK=document.querySelector('meta[name="ws-maps-key"]'),mk=MK?String(MK.getAttribute('content')||'').trim():'';
    if(mk)[].slice.call(document.querySelectorAll('.vm-ph[data-ws-map]')).forEach(function(ph){if(!ph.getAttribute('data-map'))ph.setAttribute('data-map','https://www.google.com/maps/embed/v1/place?key='+encodeURIComponent(mk)+'&q='+encodeURIComponent(ph.getAttribute('data-ws-map')||''));[].slice.call(ph.querySelectorAll('.vm-load,.vm-n')).forEach(function(x){x.hidden=false});var dr=ph.querySelector('.vm-dir');if(dr)dr.hidden=true;});
    [].slice.call(document.querySelectorAll('.vm-ph[data-ws-map-now][data-map]')).forEach(loadMap);}catch(e){}
  document.addEventListener('click',function(ev){var b=ev.target&&ev.target.closest?ev.target.closest('.vm-load'):null;if(!b||EDIT)return;var ph=b.closest('.vm-ph');if(ph)loadMap(ph);});
  // open / closed status
  function f(t){var p=t.split(':'),h=+p[0],m=p[1];var s=h>=12?'pm':'am';h=h%12||12;return h+(m!=='00'?':'+m:'')+' '+s}
  function toM(t){var p=String(t||'0:0').split(':');return (+p[0]||0)*60+(+p[1]||0)}
  var now=new Date(),d=(now.getDay()+6)%7,mins=now.getHours()*60+now.getMinutes();
  document.querySelectorAll('.hours:not(.reach)').forEach(function(t){var r=t.querySelector('tr[data-day="'+d+'"]')||(t.querySelector('tr[data-day]')?null:t.querySelectorAll('tr')[d]);if(r)r.classList.add('today')});
  document.querySelectorAll('[data-status]').forEach(function(el){
    if(!HOURS.length)return;var t=HOURS[d];
    if(t&&t.open&&t.close&&(toM(t.close)>toM(t.open)?(mins>=toM(t.open)&&mins<toM(t.close)):(mins>=toM(t.open)||mins<toM(t.close)))){var vs=el.closest&&el.closest('.v-status');if(vs)vs.classList.add('is-open');el.innerHTML='<b>Open now</b> until '+f(t.close)+(WALKIN?'. Walk-ins welcome':'');return}
    for(var i=0;i<8;i++){var k=(d+i)%7,h=HOURS[k];if(h&&h.open&&(i>0||mins<toM(h.open))){el.innerHTML='<b>Closed now.</b> Opens '+(i===0?'today':i===1?'tomorrow':h.d)+' at '+f(h.open);return}}
  });
  // stats: years update themselves; Google numbers come live from the stats API, typed numbers stay as typed
  var nums=[].slice.call(document.querySelectorAll('[data-count]'));
  [].slice.call(document.querySelectorAll('[data-yrs]')).forEach(function(el){var y=+el.getAttribute('data-yrs');if(y>1800)el.textContent=String(new Date().getFullYear()-y)});
  nums.forEach(function(el){if(el.dataset.src==='years'&&el.dataset.founded){el.dataset.count=String(new Date().getFullYear()-(+el.dataset.founded));el.textContent=el.dataset.count}});
  function fmt(v,dec){return v.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})}
  function count(el){var target=parseFloat(el.dataset.count);if(isNaN(target)||EDIT){return}var dec=(el.dataset.count.split('.')[1]||'').length,t0=null,dur=1400;
    function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),v=target*(1-Math.pow(1-k,3));el.textContent=fmt(v,dec);if(k<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
  function startCounts(){seen(nums,count)}
  // Google content is fetched live on each visit (one request per page, shared) and never stored in the site.
  var GP=null;function gplace(){if(!GP)GP=fetch(STATS_API+'?place='+encodeURIComponent(PLACE)).then(function(r){return r.ok?r.json():null}).catch(function(){return null});return GP}
  var GON=!!(STATS_API&&PLACE&&!EDIT);
  var live=nums.filter(function(el){return /^google_/.test(el.dataset.src)});
  if(live.length&&GON){
    gplace().then(function(j){
      if(j)live.forEach(function(el){var v=el.dataset.src==='google_rating'?j.rating:j.reviews;if(v!=null){el.dataset.count=String(v);el.textContent=fmt(+v,(String(v).split('.')[1]||'').length);var st=el.closest('[data-gstat]');if(st)st.hidden=false}});
    }).then(startCounts);
  } else startCounts();
  // live rating badges and chips (Google): hidden until Google answers, and they stay hidden when it doesn't
  (function(){var gl=[].slice.call(document.querySelectorAll('[data-glive]'));if(!gl.length||!GON)return;
    gplace().then(function(j){if(!j||!(j.rating>=1&&j.rating<=5))return;var n=+j.reviews||0;
      gl.forEach(function(el){[].slice.call(el.querySelectorAll('[data-g="rating"]')).forEach(function(x){x.textContent=(+j.rating).toFixed(1)});if(n)[].slice.call(el.querySelectorAll('[data-g="sub"]')).forEach(function(x){x.textContent=n.toLocaleString('en-US')+' Google review'+(n===1?'':'s')});el.hidden=false});
    });
  })();
  // live Google reviews (needs a linked place; falls back to the typed reviews already on the page)
  (function(){var box=document.querySelector('[data-greviews]');if(!box||EDIT)return;
    // Nothing typed and nothing from Google: drop the whole band rather than show an empty section.
    function none(){if(!box.querySelector('.rw blockquote'))box.remove();}
    if(!STATS_API||!PLACE){none();return;}
    gplace().then(function(j){
      // Reviews the owner chose to hide (by Google review id) are skipped; the attribution then says so.
      var hide=(box.getAttribute('data-ghide')||'').split(' ').filter(Boolean),items=(j&&j.items||[]).filter(function(v){return !(v.id&&hide.indexOf(v.id)>-1)}),cut=j&&j.items&&items.length<j.items.length;
      if(!items.length){none();return;}
      box.hidden=false;
      var rw=box.querySelector('.rw'),sum=box.querySelector('.gr-sum'),at=box.querySelector('.gr-attr');
      function star(n){var o='';for(var i=0;i<5;i++)o+=i<Math.round(n)?'★':'☆';return o}
      function esc(s){return String(s==null?'':s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;')}
      function ok(u){return /^https:\\/\\//.test(u||'')}
      // Each review credits its author as Google requires: their name linked to their Google Maps profile, and their photo.
      rw.innerHTML=items.map(function(v){var who=(ok(v.authorPhoto)?'<img class="gr-av" src="'+esc(v.authorPhoto)+'" alt="" width="28" height="28" loading="lazy" referrerpolicy="no-referrer">':'')+(ok(v.authorUri)?'<a href="'+esc(v.authorUri)+'" target="_blank" rel="nofollow noopener">'+esc(v.name)+'</a>':esc(v.name));
        return '<blockquote><div class="gr-stars" aria-label="'+esc(v.rating)+' out of 5 stars">'+star(v.rating)+'</div><p>'+esc(v.text.length>320?v.text.slice(0,317)+'…':v.text)+'</p><footer>'+who+(v.when?' · '+esc(v.when):'')+(ok(v.link)?' · <a href="'+esc(v.link)+'" target="_blank" rel="nofollow noopener">on Google Maps</a>':'')+'</footer></blockquote>'}).join('');
      if(j.rating&&sum){sum.hidden=false;sum.innerHTML='<b>'+(+j.rating).toFixed(1)+'</b> <span class="gr-stars">'+star(j.rating)+'</span> <span>'+(+j.reviews||0).toLocaleString()+' Google reviews</span>'}
      if(at){at.hidden=false;at.innerHTML=(cut?'Selected reviews from Google Maps, chosen by the business':'Reviews from Google Maps')+(ok(j.url)?' · <a href="'+esc(j.url)+'" target="_blank" rel="nofollow noopener">See all on Google Maps</a>':'')}
    }).catch(none);
  })();
  // before / after sliders
  document.querySelectorAll('[data-ba]').forEach(function(fr){var r=fr.querySelector('.ba-range');if(r)r.addEventListener('input',function(){fr.style.setProperty('--x',r.value+'%')})});
  // contact form -> POST to the owner's inbox (only on the real published site, not the studio preview iframe)
  try{var inFrame=false;try{inFrame=window.self!==window.top;}catch(_f){inFrame=true;}
    if(!inFrame&&!EDIT){document.querySelectorAll('form[data-wsform]').forEach(function(f){
      f.addEventListener('submit',function(ev){ev.preventDefault();
        var url=f.getAttribute('action'),ok=f.querySelector('[data-wfok]'),btn=f.querySelector('button[type=submit]'),ot=btn?btn.textContent:'';
        function err(msg){var m=f.querySelector('[data-wferr]');if(!m){m=document.createElement('p');m.className='wf-err';m.setAttribute('data-wferr','');m.setAttribute('role','alert');if(btn&&btn.parentNode)btn.parentNode.insertBefore(m,btn.nextSibling);else f.appendChild(m);}m.textContent=msg;m.hidden=!msg;}
        err('');
        var fd={};new FormData(f).forEach(function(v,k){fd[k]=v;});
        if(!url){f.reset();if(ok)ok.hidden=false;return;}
        if(btn){btn.disabled=true;btn.textContent='Sending…';}
        fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fd)}).then(function(r){return r.json().catch(function(){return{ok:r.ok};});}).then(function(j){
          if(j&&j.ok){f.reset();if(ok)ok.hidden=false;if(btn)btn.textContent='Sent ✓';}
          else{if(btn){btn.disabled=false;btn.textContent=ot;}err((j&&j.error==='rate')?'Too many messages right now. Please try again later.':'Sorry, that did not go through. Please check your details and try again.');}
        }).catch(function(){if(btn){btn.disabled=false;btn.textContent=ot;}err('Sorry, that did not go through. Please check your connection and try again.');});
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









