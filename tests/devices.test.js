// Every page fits every screen: phones (small, regular, large, sideways), tablets (upright and sideways) and desktops.
// On each one: no sideways scrolling, nothing sticking out past the edge of the screen, readable text on phones,
// and buttons big enough to tap. Covers the public pages, a published site, the studio, and the pop-ups.
const { openPage, sleep, waitFor, signIn, browserCookie, openStudioWith } = require('./lib');

const VIEWPORTS = [
  { name: 'phone-320', width: 320, height: 568, isMobile: true, hasTouch: true },
  { name: 'phone-375', width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: 'phone-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'phone-430', width: 430, height: 932, isMobile: true, hasTouch: true },
  { name: 'phone-landscape', width: 844, height: 390, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'tablet-landscape', width: 1024, height: 768, isMobile: true, hasTouch: true },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];
const PAGES = ['/', '/terms', '/privacy', '/privacy-choices', '/accessibility', '/deploy-guide', '/for', '/for/barbershop', '/showcase', '/example?i=0', '/example?i=3'];

// Runs in the page. Returns a list of problems.
function inspect(opts) {
  const W = window.innerWidth, out = [];
  const de = document.documentElement;
  if (Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0) > W + 1) out.push('page scrolls sideways (' + Math.max(de.scrollWidth, document.body.scrollWidth) + 'px wide on a ' + W + 'px screen)');
  const label = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); const t = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30); return s + (t ? ' "' + t + '"' : ''); };
  const shown = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  // Is the element's sticking-out part hidden by a parent that clips (overflow hidden/auto/scroll)?
  const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(o.overflowX) || /(hidden|auto|scroll|clip)/.test(o.overflow)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 1 && pr.left >= -1) return true; } if (getComputedStyle(p).position === 'fixed') break; } return false; };
  const root = opts.root ? document.querySelector(opts.root) : document.body;
  if (!root) return ['root ' + opts.root + ' not found'];
  const all = root.querySelectorAll('*');
  let n = 0;
  for (const el of all) {
    if (n > 6) break;
    if (/^(SCRIPT|STYLE|svg|path|BR|OPTION|TEMPLATE)$/i.test(el.tagName)) continue;
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right < 0) continue; // parked off-screen on purpose (e.g. the "Skip to main content" link until it gets focus)
    if ((r.right > W + 2 || r.left < -2) && r.width < W * 3 && !clipped(el)) {
      // Only report the outermost offender.
      let parentAlso = false; for (let p = el.parentElement; p && p !== root; p = p.parentElement) { const pr = p.getBoundingClientRect(); if ((pr.right > W + 2 || pr.left < -2) && !clipped(p)) { parentAlso = true; break; } }
      if (!parentAlso) { out.push('sticks out of the screen: ' + label(el) + ' (left ' + Math.round(r.left) + ', right ' + Math.round(r.right) + ')'); n++; }
    }
  }
  if (opts.mobile) {
    let small = [], tiny = [];
    for (const el of root.querySelectorAll('a,button,input,select,textarea,[role="button"],summary,label[for]')) {
      if (!shown(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > document.documentElement.scrollHeight) continue;
      // Links inside a sentence are fine at text size (WCAG 2.5.8 "inline" exception).
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') {
        let blk = el.parentElement; while (blk && getComputedStyle(blk).display === 'inline') blk = blk.parentElement;
        if (blk && (blk.innerText || '').trim().length > (el.innerText || '').trim().length + 15) continue;
      }
      if (el.type === 'hidden' || el.type === 'checkbox' || el.type === 'radio') continue;
      if (r.height < 24 || r.width < 24) small.push(label(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const tn = walker.currentNode; if (!tn.nodeValue.trim() || tn.nodeValue.trim().length < 3) continue;
      const el = tn.parentElement; if (!el || seen.has(el) || !shown(el)) continue; seen.add(el);
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 11) tiny.push(label(el) + ' ' + fs + 'px');
    }
    if (small.length) out.push(small.length + ' tap targets under 24px: ' + small.slice(0, 5).join(' | '));
    if (tiny.length) out.push(tiny.length + ' texts under 11px: ' + tiny.slice(0, 5).join(' | '));
  }
  return out;
}

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const report = [];
  const check = async (page, vp, where, root) => {
    const probs = await page.evaluate(inspect, { mobile: !!vp.isMobile && vp.width < 700, root: root || '' });
    probs.forEach((p) => report.push(vp.name + ' ' + where + ': ' + p));
    t.eq(probs.length, 0, vp.name + ' ' + where + ' fits the screen ' + probs.join(' || '));
  };

  for (const vp of VIEWPORTS) {
    const page = await openPage(browser);
    await page.setViewport(Object.assign({ deviceScaleFactor: 1 }, vp));
    for (const p of PAGES) {
      await page.goto(base + p, { waitUntil: 'networkidle2' }).catch(() => {});
      await sleep(400);
      await check(page, vp, p);
    }
    // Pop-ups on the home page: sign-in box.
    await page.goto(base + '/', { waitUntil: 'networkidle2' });
    await page.evaluate(() => window.openAuth && window.openAuth({ intro: 'Sign in to grow your site. It is free, your answers are saved, and your site starts growing the moment you are in.' }));
    await sleep(300);
    await check(page, vp, 'sign-in box', '#authModal');
    await page.close();
  }

  // Signed in: the studio and its panels, on a phone, a tablet and a laptop.
  const email = 'devices.' + Date.now().toString(36) + '@shop.test';
  const sess = await signIn(base, email);
  for (const vp of VIEWPORTS.filter((v) => ['phone-320', 'phone-390', 'phone-landscape', 'tablet', 'laptop'].includes(v.name))) {
    const page = await openPage(browser);
    await page.setViewport(Object.assign({ deviceScaleFactor: 1 }, vp));
    await page.setCookie(browserCookie(base, sess));
    const ok = await openStudioWith(page, base, 'Maple Street Bakery', 'Bakery', { city: 'Austin' });
    t.ok(ok, vp.name + ' studio opens');
    if (ok) {
      await check(page, vp, 'studio', '#studio');
      await page.evaluate(() => window.openProfile && window.openProfile());
      await sleep(300);
      await check(page, vp, 'settings box', '#profileModal');
      await page.evaluate(() => { const c = document.getElementById('profileClose'); if (c) c.click(); });
    }
    t.eq(page._wsErrors.length, 0, vp.name + ' studio has no JS errors ' + page._wsErrors.join('; '));
    await page.close();
  }
  if (process.env.WS_DEVICE_REPORT) require('fs').writeFileSync(process.env.WS_DEVICE_REPORT, report.join('\n'));
};
