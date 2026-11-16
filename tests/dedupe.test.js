// Repetition guards in generated copy: an AI paraphrase of the owner's answer next to the answer itself is
// dropped, distinct sentences are kept, and why points that restate the owner's answer are skipped.
const fs = require('fs');
const path = require('path');

module.exports = async function (ctx, t) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', '50-generator.js'), 'utf8');
  const i = src.indexOf('const V3_STOP'), j = src.indexOf('function v3Sentence(s) {');
  t.ok(i > -1 && j > i, 'dedupe helpers found in the generator');
  const lib = new Function(src.slice(i, j) + ';return { v3Dedupe, v3Overlap, v3SigWords };')();

  const plumber = "Family-owned, we answer the phone ourselves and show up when we say we will. Ridgeline Plumbing has been helping folks in Asheville since 2009. We're a family-owned business, and we make it a point to answer the phone ourselves. When we say we'll be there, we show up. We're licensed and insured.";
  const out = lib.v3Dedupe(plumber);
  t.eq((out.match(/answer the phone/g) || []).length, 1, 'the owner\'s answer appears once, not paraphrased again');
  t.ok(!/When we say we.ll be there/.test(out), 'a near-repeat of "show up when we say" is dropped');
  t.ok(/since 2009/.test(out) && /licensed and insured/.test(out), 'distinct sentences are kept');

  const bakery = "We're Flour & Ember, baking wood-fired sourdough before sunrise here in Portland. You'll also find a rotating weekend pastry, always something new to try. We bake in small batches every morning, using good flour, real butter and slow fermentation.";
  t.eq(lib.v3Dedupe(bakery), bakery, 'a text without repeats is left exactly as it was');

  t.ok(lib.v3Overlap('Consultation first. We talk through what you want before we start.', 'Lived-in color specialists, every appointment starts with a real consultation') > 0, 'a why point restating the owner\'s answer shares a distinctive word with it');
  t.eq(lib.v3Dedupe(''), '', 'empty text stays empty');
};
