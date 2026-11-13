// Quality guarantees: generated sites pass automated accessibility checks (axe-core, WCAG 2 A/AA, serious and
// critical issues) on every page, desktop and phone, and stay within a page-weight budget.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createSite, openPage, renderHtml, sleep } = require('./lib');

const AXE = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const TYPES = ['Barber shop', 'Mexican restaurant', 'House cleaning', 'Law firm', 'Clothing boutique', 'Dentist', 'Yoga studio', 'Auto repair', 'Bakery', 'Photographer', ''];
const QUICK = ['Barber shop', 'Mexican restaurant', 'Law firm', 'Clothing boutique'];
// Budgets (bytes). Generated site = the whole multi-page HTML document, gzipped as served.
const SITE_GZ_BUDGET = 60 * 1024;
const LANDING_GZ_BUDGET = 110 * 1024;

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const found = {};
  let worstGz = 0, strokeChecked = 0;
  for (const ty of (ctx.quick ? QUICK : TYPES)) {
    const j = await createSite(base, { name: (ty || 'Business') + ' Co', type: ty, city: 'Austin', phone: '512-555-0100', servicesText: 'Consultation - $40\nFull service - $120' });
    const gz = zlib.gzipSync(Buffer.from(j.html)).length;
    worstGz = Math.max(worstGz, gz);
    t.ok(gz <= SITE_GZ_BUDGET, (ty || 'generic') + ': site is ' + Math.round(gz / 1024) + ' KB gzipped (budget ' + SITE_GZ_BUDGET / 1024 + ' KB)');
    for (const mobile of [false, true]) {
      const page = await openPage(browser, { mobile });
      await renderHtml(page, base, j.html);
      await page.addScriptTag({ content: AXE });
      for (const pg of j.site.pages) {
        await page.evaluate((h) => { location.hash = '/' + h; }, pg.path || '');
        await sleep(150);
        const v = await page.evaluate(async () => {
          // Reveal-on-scroll animations start transparent; check the settled page, as a reader sees it.
          document.querySelectorAll('*').forEach((el) => { el.style.transition = 'none'; el.style.animation = 'none'; });
          document.documentElement.classList.add('ws-qa');
          const st = document.createElement('style'); st.textContent = '.reveal,.rv,[data-reveal]{opacity:1!important;transform:none!important}'; document.head.appendChild(st);
          // Outlined headline words are read by their stroke, which axe cannot see: check the stroke ourselves.
          const rgb = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)|color\(srgb ([^)]+)\)/); if (!m) return null; const p = (m[1] || m[2]).split(/[ ,/]+/).filter(Boolean).map(Number); return m[2] ? p.slice(0, 3).map((x) => x * 255) : p.slice(0, 3); };
          const lum = (c) => { const f = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
          const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; const v = rgb(c); if (v && !/, 0\)$|\/ 0\)$/.test(c) && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return v; } return [255, 255, 255]; };
          const strokeBad = [];
          document.querySelectorAll('.ws-page.on *, header *').forEach((el) => {
            const cs = getComputedStyle(el); if (!(parseFloat(cs.webkitTextStrokeWidth) > 0) || !el.textContent.trim()) return;
            const sc = rgb(cs.webkitTextStrokeColor); if (!sc) return; const a = lum(sc), b = lum(bgOf(el));
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            if (ratio < 3) strokeBad.push({ id: 'outline-text-contrast', n: 1, ex: el.className + ' :: stroke contrast ' + ratio.toFixed(2) + ' (needs 3)' });
            el.setAttribute('data-qa-stroke', '1'); window.__qaStroke = (window.__qaStroke || 0) + 1;
          });
          const r = await window.axe.run(document.querySelector('.ws-page.on') ? { include: [['.ws-page.on'], ['header'], ['footer']], exclude: [['[data-qa-stroke]']] } : document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }, resultTypes: ['violations'] });
          return strokeBad.concat(r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical').map((x) => ({ id: x.id, n: x.nodes.length, ex: x.nodes[0] && (x.nodes[0].target.join(' ') + ' :: ' + String(x.nodes[0].failureSummary || '').split('\n').slice(1, 2).join('')).slice(0, 220) })));
        });
        v.forEach((x) => { const k = x.id; found[k] = found[k] || { n: 0, where: [] }; found[k].n += x.n; if (found[k].where.length < 4) found[k].where.push((ty || 'generic') + (mobile ? ' [phone] ' : ' ') + (pg.path || 'home') + ': ' + x.ex); });
      }
      strokeChecked += await page.evaluate(() => window.__qaStroke || 0);
      await page.close();
    }
  }
  if (!ctx.quick) t.ok(strokeChecked > 0, 'outlined headline text was found and its stroke contrast checked (' + strokeChecked + ')');
  const ids = Object.keys(found);
  ids.forEach((k) => t.fail('accessibility: ' + k + ' (' + found[k].n + ' elements) e.g. ' + found[k].where.join(' | ')));
  t.ok(ids.length === 0, 'generated sites have no serious accessibility issues on any page, desktop or phone');

  // Landing page budget (HTML as served; the editor script is a separate cached file)
  const landing = await (await fetch(base + '/')).text();
  const lgz = zlib.gzipSync(Buffer.from(landing)).length;
  t.ok(lgz <= LANDING_GZ_BUDGET, 'landing page is ' + Math.round(lgz / 1024) + ' KB gzipped (budget ' + LANDING_GZ_BUDGET / 1024 + ' KB)');
  // Published sites never block rendering on third-party scripts
  const j = await createSite(base, { name: 'Glow', type: 'Hair salon' });
  const blocking = [...j.html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].filter((m) => !/\b(async|defer)\b/.test(m[0]) && !/type="module"/.test(m[0])).map((m) => m[1]);
  t.eq(blocking.join(', '), '', 'generated sites load no render-blocking external scripts');
  t.ok(true, 'largest generated site: ' + Math.round(worstGz / 1024) + ' KB gzipped');
};
