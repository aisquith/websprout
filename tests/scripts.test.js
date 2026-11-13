// Every inline <script> in the served pages must parse. Catches template-literal escaping mistakes
// (a lost backslash or an unescaped quote breaks the whole page) before they ship.
module.exports = async function (ctx, t) {
  const { base } = ctx;
  for (const p of ['/', '/inbox', '/reviews', '/terms', '/showcase', '/for/restaurant', '/example?i=1']) {
    const html = await (await fetch(base + p)).text();
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let bad = 0;
    scripts.forEach((code, i) => { try { new Function(code); } catch (e) { bad++; t.fail(p + ' inline script #' + i + ' does not parse: ' + e.message + ' near: ' + code.slice(0, 80).replace(/\s+/g, ' ')); } });
    t.ok(bad === 0, p + ': all ' + scripts.length + ' inline scripts parse');
    // JSON-LD blocks must be valid JSON
    [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((m, i) => { try { JSON.parse(m[1]); t.ok(true, ''); } catch (e) { t.fail(p + ' JSON-LD #' + i + ' is invalid: ' + e.message); } });
  }
  // Owner-only panels can't be fetched without signing in, so check their templates straight from the build
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'dist', 'worker.js'), 'utf8');
  for (const name of ['ADMIN_PANEL', 'DEV_PANEL', 'INBOX_PAGE', 'REVIEWS_PAGE']) {
    const st = src.indexOf('const ' + name + ' = `'); const en = src.indexOf('</html>`;', st);
    if (st < 0 || en < 0) { t.fail(name + ' template not found'); continue; }
    const tpl = src.slice(st + ('const ' + name + ' = `').length, en + 7);
    const html = new Function('BUILD_ID', 'SUB_LINK', 'SUPPORT_EMAIL', 'return `' + tpl + '`')('b', 'x', 'e');
    const sc = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let bad = 0; sc.forEach((c) => { try { new Function(c); } catch (e) { bad++; t.fail(name + ' script does not parse: ' + e.message); } });
    t.ok(bad === 0, name + ': scripts parse');
  }
  const eng = await (await fetch(base + '/ws-engine.js')).text();
  try { new Function(eng); t.ok(true, ''); } catch (e) { t.fail('/ws-engine.js does not parse: ' + e.message); }
};
