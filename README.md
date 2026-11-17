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
| `52-support.js`, `53-moderation.js` | support auto-replies, content checks on publish and share links |

**The files are slices of one script, not separate modules.** Files 20-23 are one long template literal split in four, so inside them write `\\` for a backslash and never write `${` unless you mean a server-side value.

Secrets (Stripe, Resend, Google, Unsplash, Gemini...) live in the Cloudflare dashboard, not in this repo.

## Optional setup (features turn on when the key exists)

Add these in Cloudflare → Workers & Pages → websprout → Settings → Variables and Secrets.

| Secret | Turns on |
|---|---|
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Pro subscriptions, shop checkout, Stripe Connect payouts |
| `RESEND_API_KEY` | sign-in emails, lead notifications, digests |
| `RESEND_WEBHOOK_SECRET` | bounce/complaint suppression (Resend → Webhooks → `https://websprout.app/api/resend/webhook`, events `email.bounced`, `email.complained`) |
| `UNSPLASH_ACCESS_KEY` | photos on generated sites and the photo search in the editor |
| `GOOGLE_PLACES_KEY` | live Google rating and reviews (enable "Places API (New)" in Google Cloud) |
| `CF_API_TOKEN`, `CF_ZONE_ID` | automatic HTTPS for customers' own domains (Cloudflare for SaaS) |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | bot check on published contact forms (failed checks still reach the owner but get no auto-reply) |
| `GOOGLE_TAG_ID`, `GOOGLE_ADS_PUBLISH_LABEL`, `GOOGLE_ADS_TRIAL_LABEL` | Google Ads / GA4 conversion tracking on websprout.app (publish, trial start) |
| `GOOGLE_MAPS_EMBED_KEY` | map on published sites' Visit/Contact section (Maps Embed API, free; restrict the key by HTTP referrer to `*.websprout.app` and customer domains). Without it sites show a "Get directions" link |
| `META_PIXEL_ID` | Meta Pixel on websprout.app (Lead on publish, StartTrial on Pro) |
| `POSTAL_ADDRESS` | mailing address in the footer of reminder and weekly summary emails; **those two emails are paused until it's set** (CAN-SPAM). Overrides `WS_POSTAL_ADDRESS` in `00-header.js` |

**Limits you can change** (Variables): `AI_MONTHLY_CAP` (AI site copy, default 30,000/month), `MOD_MONTHLY_CAP` (AI content checks, default 20,000/month), `MODERATION_AI=off` (word list only), `UNSPLASH_HOURLY_CAP` (default 45; raise after Unsplash production approval).

**Content checks:** every publish and share link is checked (`53-moderation.js`) for obscene, vulgar, NSFW, hateful or scam content. Admin → Moderation lists refused or unchecked sites, can check every published site at once, and can take a site down (and block it).

**Custom domains (one-time):** in the websprout.app zone, open SSL/TLS → Custom Hostnames, enable Cloudflare for SaaS and set the fallback origin to `sites.websprout.app`. Then add a Worker route `*/*` for the zone so customer domains reach the Worker. The API token needs the "SSL and Certificates: Edit" permission on the zone.
