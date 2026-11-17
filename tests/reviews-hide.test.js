// Owners can hide individual Google reviews: hidden ones never render, the attribution then says the reviews
// are selected (Google's policy requires saying how reviews are filtered), each review links to its source on
// Google Maps, each author is credited (name linked to their profile, their photo), Google's order and ratings are
// kept (no star filter), and hiding every review drops the band instead of leaving it empty.
const { createSite, openPage, sleep } = require('./lib');

module.exports = async function (ctx, t) {
  const { base, browser } = ctx;
  const s = await createSite(base, { name: 'Glow Salon', type: 'Hair salon', city: 'Austin' });
  const site = s.site; site.biz.googlePlaceId = 'ChIJ_test_place_id_123';
  site.pages[0].sections.splice(1, 0, { id: 'reviews-g1', type: 'reviews', variant: 'google', title: 'What people say', items: [] });
  const google = { rating: 4.6, reviews: 98, url: 'https://maps.google.com/?cid=1', items: [
    { id: 'rvA', link: 'https://www.google.com/maps/reviews/rvA', rating: 5, text: 'Loved my cut, Jess is amazing', name: 'Ana R.', authorUri: 'https://www.google.com/maps/contrib/111', authorPhoto: 'https://lh3.googleusercontent.com/a/ana', when: '2 weeks ago' },
    { id: 'rvB', link: 'https://www.google.com/maps/reviews/rvB', rating: 2, text: 'Waited forty minutes past my booking', name: 'Bo T.', when: 'a month ago' },
    { id: 'rvC', link: 'https://www.google.com/maps/reviews/rvC', rating: 5, text: 'Best color I have ever had', name: 'Cy L.', when: '3 months ago' },
  ] };

  const render = async (hidden) => {
    const sd = JSON.parse(JSON.stringify(site)); if (hidden) sd.biz.googleHidden = hidden;
    const page = await openPage(browser, {});
    await page.goto(base + '/terms');
    const html = await page.evaluate(async (d) => {
      await new Promise((res) => { const sc = document.createElement('script'); sc.src = '/ws-engine.js'; sc.onload = res; document.head.appendChild(sc); });
      return window.WS.renderSite(d, { mode: 'live' });
    }, sd);
    await page.setRequestInterception(true);
    page.on('request', (q) => (q.url().indexOf('/api/place?place=') > -1
      ? q.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(google) })
      : q.continue()));
    await page.setContent(html, { waitUntil: 'domcontentloaded' }); await sleep(1000);
    const out = await page.evaluate(() => { const b = document.querySelector('[data-greviews]'); return b ? { txt: b.textContent, links: [...b.querySelectorAll('.rw a')].map((a) => a.href), author: [...b.querySelectorAll('.rw a')].filter((a) => /contrib\/111$/.test(a.href)).map((a) => [a.textContent, a.rel, a.target].join('|')), av: [...b.querySelectorAll('img.gr-av')].map((i) => [i.getAttribute('src'), i.getAttribute('alt'), i.getAttribute('loading')].join('|')) } : null; });
    const errs = page._wsErrors.slice(); await page.close();
    return { html, out, errs };
  };

  let r = await render(null);
  t.ok(r.out && /Loved my cut/.test(r.out.txt) && /forty minutes/.test(r.out.txt) && /Best color/.test(r.out.txt), 'with nothing hidden, every Google review shows');
  t.ok(/Reviews from Google Maps/.test(r.out.txt) && !/Selected reviews/.test(r.out.txt), 'unfiltered attribution says "Reviews from Google Maps"');
  t.eq((r.out.author || []).join(), 'Ana R.|nofollow noopener|_blank', 'the author\'s name links to their Google Maps profile');
  t.eq((r.out.av || []).join(), 'https://lh3.googleusercontent.com/a/ana||lazy', 'the author\'s photo shows (decorative, lazy-loaded)');
  t.ok(/Waited forty minutes/.test(r.out.txt), 'low-rated reviews are not filtered out');
  t.eq((r.out.links || []).filter((h) => /\/maps\/reviews\/rv[ABC]$/.test(h)).length, 3, 'each review links to its source on Google');
  t.ok(!/data-ghide="/.test(r.html), 'no hide list in the page when nothing is hidden');
  t.eq(r.errs.length, 0, 'no JS errors ' + r.errs.join('; '));

  r = await render(['rvB']);
  t.ok(/data-ghide="rvB"/.test(r.html), 'the hide list is in the published markup');
  t.ok(r.out && !/forty minutes/.test(r.out.txt) && !/Bo T\./.test(r.out.txt), 'the hidden review does not render');
  t.ok(/Loved my cut/.test(r.out.txt) && /Best color/.test(r.out.txt), 'the other reviews still show');
  t.ok(/Selected reviews from Google Maps, chosen by the business/.test(r.out.txt), 'attribution discloses that reviews were selected');
  t.ok(/4\.6/.test(r.out.txt) && /98 Google reviews/.test(r.out.txt), 'the overall Google rating and count still show unchanged');
  t.eq(r.errs.length, 0, 'no JS errors ' + r.errs.join('; '));

  r = await render(['rvA', 'rvB', 'rvC']);
  t.eq(r.out, null, 'hiding every review removes the band (never an empty section)');
  t.eq(r.errs.length, 0, 'no JS errors ' + r.errs.join('; '));

  r = await render(['x" onmouseover="alert(1)']);
  t.ok(!/onmouseover="alert/.test(r.html), 'hide-list ids are escaped in the markup');
};
