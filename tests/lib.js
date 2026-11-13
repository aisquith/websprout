// Shared helpers for the Websprout tests.
const fs = require('fs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, timeout, every) {
  const end = Date.now() + (timeout || 10000);
  while (Date.now() < end) { if (await fn()) return true; await sleep(every || 400); }
  return false;
}

function chromePath() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  for (const p of c) if (fs.existsSync(p)) return p;
  throw new Error('Chrome not found. Set CHROME_PATH.');
}

async function launchBrowser() {
  const puppeteer = require('puppeteer-core');
  return puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
}

// t.ok(cond, msg) / t.eq(a, b, msg) / t.fail(msg)
function tracker(name) {
  const t = { name, passed: 0, failed: [] };
  t.ok = (cond, msg) => { if (cond) t.passed++; else t.failed.push(msg); return !!cond; };
  t.eq = (a, b, msg) => t.ok(a === b, msg + ' (expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a) + ')');
  t.fail = (msg) => t.failed.push(msg);
  return t;
}

async function post(base, p, body, headers) {
  const r = await fetch(base + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}), body: JSON.stringify(body) });
  let j = null; const txt = await r.text(); try { j = JSON.parse(txt); } catch (e) {}
  return { status: r.status, json: j, text: txt, headers: r.headers };
}

async function createSite(base, body) {
  const r = await post(base, '/create', body);
  if (!r.json || !r.json.html) throw new Error('create failed: ' + r.text.slice(0, 200));
  return r.json;
}

// Open a page and collect JS errors / console errors / failed same-origin requests.
async function openPage(browser, opts) {
  const page = await browser.newPage();
  await page.setViewport(opts && opts.mobile ? { width: 375, height: 740, isMobile: true, hasTouch: true } : { width: (opts && opts.width) || 1280, height: 860 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('JS: ' + String(e.message).split('\n')[0]));
  page.on('dialog', (d) => { errors.push('DIALOG: ' + d.message()); d.dismiss().catch(() => {}); });
  page._wsErrors = errors;
  return page;
}

// Render generated HTML in a page (with the dev server as origin).
async function renderHtml(page, base, html) {
  await page.goto(base + '/terms');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await sleep(250);
}

// Build a site in the real editor and wait for the studio to open.
async function openStudioWith(page, base, name, type, extra) {
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.evaluate((n, ty, ex) => {
    try { localStorage.clear(); } catch (e) {}
    document.getElementById('bizName').value = n; document.getElementById('bizType').value = ty;
    if (ex && ex.city && document.getElementById('bizCity')) document.getElementById('bizCity').value = ex.city;
    if (ex && ex.phone && document.getElementById('bizPhone')) document.getElementById('bizPhone').value = ex.phone;
    doCreateV3();
  }, name, type, extra || {});
  const ok = await waitFor(() => page.evaluate(() => !!window._wsSiteData && document.getElementById('studio').classList.contains('on')), 30000, 400);
  await sleep(2200);
  return ok;
}

function previewFrame(page) { return page.frames().find((f) => f !== page.mainFrame() && f.name() !== 'pfFull'); }

module.exports = { sleep, waitFor, launchBrowser, tracker, post, createSite, openPage, renderHtml, openStudioWith, previewFrame };
