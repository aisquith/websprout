// Websprout test runner.
//   npm test          -> build, start a local worker with empty storage, run every test file
//   npm test -- name  -> only test files whose name contains "name"
//   --quick           -> smaller generation matrix
// Needs Chrome/Chromium. Set CHROME_PATH if it is not in a standard location.
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const lib = require('./lib');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.TEST_PORT || 8799);
const args = process.argv.slice(2);
const quick = args.includes('--quick');
const filter = args.filter((a) => !a.startsWith('--'))[0] || '';

async function main() {
  require(path.join(ROOT, 'build.js')).build();
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-test-'));
  const wranglerBin = path.join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  const cmd = fs.existsSync(wranglerBin) ? [process.execPath, [wranglerBin]] : [process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler']];
  const server = spawn(cmd[0], cmd[1].concat(['dev', '--local', '--port', String(PORT), '--ip', '127.0.0.1', '--persist-to', state, '--var', 'STRIPE_SECRET_KEY:sk_test_websprout_dummy', '--config', path.join(ROOT, 'wrangler.toml')]), { cwd: ROOT, env: Object.assign({}, process.env, { CI: '1' }), shell: process.platform === 'win32' && !fs.existsSync(wranglerBin) });
  let log = '';
  server.stdout.on('data', (d) => { log += d; });
  server.stderr.on('data', (d) => { log += d; });
  const base = 'http://127.0.0.1:' + PORT;
  const up = await lib.waitFor(async () => { try { const r = await fetch(base + '/robots.txt'); return r.ok; } catch (e) { return false; } }, 90000);
  if (!up) { console.error('Local worker did not start.\n' + log.slice(-3000)); server.kill(); process.exit(1); }

  const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('.test.js') && f.includes(filter)).sort();
  const ctx = { base, quick, browser: null };
  let failed = 0, passed = 0;
  const started = Date.now();
  try {
    ctx.browser = await lib.launchBrowser();
    for (const f of files) {
      const t0 = Date.now();
      const t = lib.tracker(f.replace('.test.js', ''));
      try { await require(path.join(__dirname, f))(ctx, t); }
      catch (e) { t.fail('crashed: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e)); }
      passed += t.passed; failed += t.failed.length;
      console.log((t.failed.length ? 'FAIL ' : 'ok   ') + f.padEnd(26) + String(t.passed).padStart(4) + ' passed' + (t.failed.length ? ', ' + t.failed.length + ' failed' : '') + '  (' + ((Date.now() - t0) / 1000).toFixed(1) + 's)');
      t.failed.forEach((m) => console.log('       x ' + m));
    }
  } finally {
    if (ctx.browser) await ctx.browser.close().catch(() => {});
    server.kill();
    if (process.platform === 'win32' && server.pid) { try { require('child_process').execSync('taskkill /pid ' + server.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) {} }
    try { fs.rmSync(state, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n' + passed + ' passed, ' + failed + ' failed in ' + ((Date.now() - started) / 1000).toFixed(0) + 's');
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
