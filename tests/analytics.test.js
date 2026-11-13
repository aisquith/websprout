// Funnel analytics: browser events are allowlisted, the funnel is owner-only.
const { post } = require('./lib');

module.exports = async function (ctx, t) {
  const { base } = ctx;
  let r = await post(base, '/track', { event: 'visit', url: base + '/' });
  t.ok(r.json && r.json.ok === true, 'landing visits are tracked');
  r = await post(base, '/track', { event: 'first_edit' });
  t.ok(r.json && r.json.ok === true, 'first edit is tracked');
  r = await post(base, '/track', { event: 'pro_start' });
  t.ok(r.json && r.json.ok === false, 'server-only funnel steps cannot be posted from outside');
  r = await post(base, '/track', { event: 'x'.repeat(500) });
  t.ok(r.json && r.json.ok === false, 'unknown events are ignored');
  const f = await fetch(base + '/admin/funnel?days=7');
  t.eq(f.status, 403, 'the funnel is owner-only');

  // Site errors: reported, grouped for the owner, clearing is owner-only
  r = await post(base, '/api/clientlog', { msg: 'TypeError: x is undefined at 12', where: 'published', url: 'https://glow.websprout.app/about' });
  t.ok(r.json && r.json.ok === true, 'published sites can report errors');
  t.eq((await post(base, '/admin/errors/clear', {})).status, 403, 'clearing errors is owner-only');
  const src = require('fs').readFileSync(require('path').join(__dirname, '../src/45-admin.js'), 'utf8');
  const group = new Function(src.slice(src.indexOf('function groupClientErrors'), src.indexOf('async function doAdminErrorsClear')) + ';return groupClientErrors;')();
  const now = Date.now();
  const g = group([
    { ts: now - 1000, msg: 'TypeError: a is undefined at 12', where: 'published', url: 'https://glow.websprout.app/' },
    { ts: now - 2000, msg: 'TypeError: a is undefined at 15', where: 'published', url: 'https://bake.websprout.app/menu' },
    { ts: now - 3 * 86400000, msg: 'TypeError: a is undefined at 9', where: 'published', url: 'https://glow.websprout.app/' },
    { ts: now - 5000, msg: 'Other', where: 'editor', url: 'not a url' },
  ]);
  t.eq(g.length, 2, 'errors that differ only by numbers are grouped');
  t.eq([g[0].count, g[0].last24, g[0].sites.join(',')].join('|'), '3|2|glow.websprout.app,bake.websprout.app', 'groups count hits and list affected sites');
};
