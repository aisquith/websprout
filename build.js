// Builds dist/worker.js from the fragments in src/ (joined in the order listed in src/ORDER).
// Wrangler runs this automatically before `wrangler dev` and `wrangler deploy` (see wrangler.toml).
//
// The fragments are plain slices of one script, NOT modules: a file may start or end in the middle of a
// template literal (the app page is split across 20-23). Inside those, remember the template-literal rules:
// write \\ for a backslash and never write ${ unless you mean server-side interpolation.
//
// The browser copy of the site engine (/ws-engine.js) is generated here from src/10-engine.js, so the two
// can never drift apart.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'dist', 'worker.js');

function build() {
  const order = fs.readFileSync(path.join(SRC, 'ORDER'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  const parts = order.map((f) => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\r\n/g, '\n'));
  let out = parts.join('\n');

  // Browser engine = the engine body (what runs inside the WSENGINE wrapper), base64-encoded.
  const engine = parts[order.indexOf('10-engine.js')];
  const a = engine.indexOf('  // Websprout engine v3');
  const b = engine.indexOf('\n  return __ws;\n})();');
  if (a < 0 || b < 0) throw new Error('build: could not find the engine body in src/10-engine.js');
  const browserEngine = engine.slice(a, b).replace(/^  /, '').replace(/\n+$/, '\n');
  const b64 = Buffer.from(browserEngine, 'utf8').toString('base64');
  if (out.split('__WS_ENGINE_B64__').length !== 2) throw new Error('build: engine placeholder missing or duplicated');
  out = out.replace('__WS_ENGINE_B64__', b64);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  return out;
}

if (require.main === module) {
  const out = build();
  console.log('built dist/worker.js (' + Math.round(out.length / 1024) + ' KB)');
}
module.exports = { build };
