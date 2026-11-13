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
};
