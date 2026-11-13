# Websprout

Instant websites for local businesses. One Cloudflare Worker serves the app, the editor and every published site.

## Commands

| | |
|---|---|
| `npm install` | once, installs wrangler and the test browser driver |
| `npm run dev` | local server at http://localhost:8787 (rebuilds when `src/` changes) |
| `npm test` | builds, starts a local server with empty storage, runs every test in a real browser |
| `npm test -- --quick` | same, with a smaller site-generation matrix |
| `npm test -- editor` | only test files whose name contains "editor" |
| `npm run deploy` | build and deploy to websprout.app |

Tests need Chrome (or set `CHROME_PATH`). They also run on GitHub on every push (`.github/workflows/test.yml`).

## Layout

`build.js` joins the files in `src/` (in the order listed in `src/ORDER`) into `dist/worker.js`, the file Cloudflare runs. Wrangler runs the build automatically.

| File | What it holds |
|---|---|
| `00-header.js` | constants (support email, payment link) |
| `10-engine.js` | the site engine: sections, themes, rendering (also served to the browser as `/ws-engine.js`) |
| `11-engine-loader.js`, `12-site-scripts.js` | serves the browser engine; scripts injected into published sites |
| `20`-`23-app-page-*.js` | the main app page (landing + editor): head and CSS, markup, editor script, tail |
| `30-static-pages.js` | terms, privacy, accessibility, deploy guide, success |
| `31`-`32` | stats, share previews, site email, OG image, showcase, `/for/` niche pages, sitemap |
| `40-router.js` | every URL route |
| `41-inbox-forms.js`, `42-reviews.js` | contact forms, inbox, digests, reviews |
| `43-publish-domains.js` | publishing, serving published sites, custom domains |
| `44-auth-billing.js`, `45-admin.js`, `46-account-saves.js` | sign-in, Stripe, admin and developer panels, saves and accounts |
| `47-store.js`, `50-generator.js`, `51-sanitize.js` | shop and checkout, site generation, HTML cleanup |

**The files are slices of one script, not separate modules.** Files 20-23 are one long template literal split in four, so inside them write `\\` for a backslash and never write `${` unless you mean a server-side value.

Secrets (Stripe, Resend, Google, Unsplash, Gemini...) live in the Cloudflare dashboard, not in this repo.
