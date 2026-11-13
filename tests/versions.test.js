// Version history: saves keep snapshots that can be listed and loaded back; keys protect them.
const { createSite, post } = require('./lib');

module.exports = async function (ctx, t) {
  const { base } = ctx;
  const s = await createSite(base, { name: 'Versions Co', type: 'Bakery' });
  let r = await post(base, '/save', { siteId: s.siteId, key: s.formKey, html: '<html>v1 ' + 'x'.repeat(200) + '</html>', name: 'V1', site: s.site });
  t.eq(r.status, 200, 'first save works');
  r = await post(base, '/save', { siteId: s.siteId, key: s.formKey, html: '<html>v2 ' + 'x'.repeat(200) + '</html>', name: 'V2', site: s.site });
  t.eq(r.status, 200, 'second save works');
  r = await post(base, '/save', { siteId: s.siteId, key: s.formKey, html: '<html>v3 ' + 'x'.repeat(200) + '</html>', name: 'V3', snapshot: true, label: 'Before restore' });
  let list = await (await fetch(base + '/versions?site=' + s.siteId + '&key=' + s.formKey)).json();
  t.ok(list.versions && list.versions.length === 2, 'one snapshot per 10 minutes, plus forced ones (' + (list.versions || []).length + ')');
  t.ok(list.versions[0].ts >= list.versions[1].ts, 'newest first');
  t.eq(list.versions[0].label, 'Before restore', 'forced snapshot keeps its label');
  const v = await (await fetch(base + '/versions?site=' + s.siteId + '&key=' + s.formKey + '&ts=' + list.versions[1].ts)).json();
  t.ok(/v1/.test(v.html || ''), 'an older version loads back with its HTML');
  t.ok(v.site && v.site.sections, 'and its site data');
  const bad = await fetch(base + '/versions?site=' + s.siteId + '&key=nope');
  t.eq(bad.status, 403, 'versions need the site key');
};
