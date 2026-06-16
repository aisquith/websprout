// WEBSPROUT — Cloudflare Worker
// Env variables: GEMINI_API_KEY (required), GEMINI_API_KEY2 (optional fallback), RESEND_API_KEY, KV

const STRIPE = 'https://buy.stripe.com/00w00kgq56Bd1ds2Wy6Na00';
// $10/mo unlimited subscription — create a RECURRING ($10/month) Payment Link in your
// Stripe dashboard and paste its URL here. Set its success URL to https://websprout.app/?sub=success
const SUB_LINK = 'https://buy.stripe.com/00w00kgq56Bd1ds2Wy6Na00';

// Reveal safety-net: ships inside every generated site (preview AND download).
// Preserves the site's own CSS animations — it watches elements with an
// IntersectionObserver and only force-reveals one if it is STILL hidden ~1.7s after
// scrolling into view (rescuing a broken or absent observer), so scroll-reveal and
// entrance animations play normally while a stuck animation can never leave a blank
// page. Skips positioned overlays (modals, menus, dropdowns) so hidden UI keeps working.
const REVEAL_SCRIPT = '<scr'+'ipt id="_wsReveal">(function(){var SEL="section,header,footer,main,article,aside,div,nav,h1,h2,h3,h4,h5,h6,p,img,ul,ol,li,figure,blockquote,span,a,button";function inflow(el){var p=getComputedStyle(el).position;return !(p==="fixed"||p==="absolute");}function hidden(el){var s=getComputedStyle(el);return parseFloat(s.opacity)<0.05||s.visibility==="hidden";}function show(el){el.style.setProperty("opacity","1","important");el.style.setProperty("visibility","visible","important");el.style.setProperty("transform","none","important");}function base(){var de=document.documentElement;if(de&&parseFloat(getComputedStyle(de).opacity)<0.05)de.style.opacity="1";var b=document.body;if(b){if(parseFloat(getComputedStyle(b).opacity)<0.05)b.style.opacity="1";if(getComputedStyle(b).visibility==="hidden")b.style.visibility="visible";}}function arm(){base();var els=document.body?document.body.querySelectorAll(SEL):[];if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var t=en.target;io.unobserve(t);setTimeout(function(){if(inflow(t)&&hidden(t))show(t);},1700);}});},{threshold:0.01,rootMargin:"0px 0px -8% 0px"});for(var i=0;i<els.length;i++){try{if(inflow(els[i])&&hidden(els[i]))io.observe(els[i]);}catch(e){}}}else{for(var j=0;j<els.length;j++){try{if(inflow(els[j])&&hidden(els[j]))show(els[j]);}catch(e){}}}}function sweep(){base();var els=document.body?document.body.querySelectorAll(SEL):[];var vh=window.innerHeight||800;for(var k=0;k<els.length;k++){try{if(inflow(els[k])&&hidden(els[k])){var r=els[k].getBoundingClientRect();if(r.top<vh)show(els[k]);}}catch(e){}}}base();if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",arm);}else{arm();}setTimeout(sweep,6000);window.addEventListener("load",function(){setTimeout(sweep,3500);});})();</scr'+'ipt>';

// Bake the reveal net into a finished HTML document (idempotent)
function withReveal(html){
  if(!html||html.indexOf('_wsReveal')>-1)return html;
  var bi=html.lastIndexOf('</body>');
  return bi>-1?html.slice(0,bi)+REVEAL_SCRIPT+html.slice(bi):html+REVEAL_SCRIPT;
}

const PROMPT = `You are a world-class creative director and front-end developer. Build a complete, detailed, professional website for the business described. Every section must contain real, specific content written for this exact business type.

OUTPUT: Raw HTML only, <!DOCTYPE html> to </html>. No markdown, no backticks, no explanation.

━━━ REQUIRED SECTIONS (include ALL of these) ━━━

1. NAVIGATION — sticky flex nav (display:flex; align-items:center; justify-content:space-between; gap at least 1.5rem). Brand/logo on the left with CLEAR space from the 4-5 links — the logo must never touch or overlap the links. CTA button on the right. Collapse the links into a hamburger menu below 820px. Wrap the brand/logo text in a tag carrying the attribute data-ws-field="brand".
2. HERO — dramatic full-width section. Large RESPONSIVE headline using font-size:clamp(2rem,6vw,4.5rem) so it scales down on phones and NEVER overflows or gets clipped; weight 900; letter-spacing -2px; the headline MUST be allowed to wrap onto multiple lines (never white-space:nowrap). Subheadline. Two CTA buttons. Keep generous side padding so text never touches the screen edges. All hero text must strongly contrast with the hero background: if the hero background is dark or uses a photo/image slot, the headline and subtext are white/near-white (with a dark overlay over any photo) — never dark text on a dark hero.
3. TRUST/STATS BAR — strip with 3-4 real stats or trust signals specific to this business type
4. SERVICES/FEATURES — 3-4 detailed cards. Each has an icon, bold title, 2-3 sentence description. Real content, not generic filler.
5. ABOUT/STORY — two column layout. Left: compelling brand narrative. Right: 4 stats in a 2x2 grid with big bold numbers.
6. INDUSTRY-SPECIFIC SECTION — this is critical. Think about what this business actually needs:
   - Estate sale company: list of upcoming/recent sales with dates, item categories (furniture, jewelry, antiques, art, collectibles, tools), fee structure
   - Restaurant/cafe: full menu with sections and real dish names and prices
   - Law firm: practice areas with descriptions, case types, free consultation CTA
   - Gym/fitness: class schedule, membership tiers with prices, trainer info
   - Medical/clinic: services offered, insurance info, appointment booking
   - Portfolio: past project showcase with descriptions, skills, process
   - SaaS/app: feature breakdown, pricing tiers, integration list, metrics
   - Real estate: property types, neighborhoods served, recent sales stats
   - Consulting: service packages, methodology, client results
   - Local business: service list with descriptions, service area, pricing
   Write content that ONLY makes sense for this specific business. No generic filler.
7. TESTIMONIALS — 3 cards. Large quote mark in accent color. Italic quote text. Name, role, 5 stars.
8. PRICING — 3 tiers adapted to this business. Center tier highlighted. Feature lists with checkmarks.
9. CONTACT/CTA — full-width colored band. Bold headline. Contact form with fields relevant to this industry. For service / quote / appointment businesses, make this a "Request a quote" (or "Request a callback") form with STRUCTURED fields, each with a name attribute: full name, phone, email, the specific service needed (a <select> with 4–6 realistic options for THIS industry), preferred timeframe/urgency (a <select>: ASAP / This week / This month / Just exploring), and a details textarea. Always give a phone field. The form MUST have action="#" method="POST" so it can be wired to a real email service later. Include these hidden fields inside every form:
   <input type="hidden" name="_subject" value="New message from your website">
   Include a submit button with clear label. Business info placeholders: [Your Address], [Your Phone], [your@email.com], [Your Hours]
   BOOKING: If this business runs on appointments or bookings (salons, barbers, spas, fitness/yoga, medical/dental, tattoo, photographers, charters/tours, home services & trades, consultants, tutors, repair shops, etc.), ALSO add a prominent "Book now" / "Book an appointment" button — once in the hero and once in the contact band — as a real link: <a href="[Your Booking Link]" target="_blank" rel="noopener">Book now</a>, styled as a primary button. Use the exact placeholder [Your Booking Link] for the href so the owner can drop in their Calendly / Cal.com / Square scheduler. For pure storefronts or info sites with no appointments, skip the booking button.
   CLICK-TO-CALL: Render EVERY phone number as a tappable link — <a href="tel:[Your Phone]">[Your Phone]</a> (use the [Your Phone] placeholder in BOTH the href and the visible text). For phone-driven local businesses (trades, repair, towing, plumbing, HVAC, locksmith, auto, etc.), add a clear "Call [Your Phone]" button in the hero and again in the contact band, styled as a primary or secondary button.
10. FOOTER — dark background. 3 columns: brand+tagline, links, contact. Copyright line.

━━━ DESIGN ━━━
Pick ONE strong accent color that fits the brand. Build a full color system around it. Typography should be dramatic — big size contrast between headlines and body. Generous spacing. Cards with hover effects. Sticky nav with blur background.

━━━ CONTRAST & READABILITY (CRITICAL — the #1 rule, never violate) ━━━
Every piece of text MUST be instantly readable against the EXACT color or image directly behind it (WCAG AA, 4.5:1 or better). Unreadable text is the most common failure — do not make it.
- Decide each section's background FIRST, then choose text colors that strongly contrast with it. Dark text ONLY on light backgrounds; white / near-white text ONLY on dark backgrounds. NEVER dark-on-dark or light-on-light.
- HERO: if the hero background is dark, a gradient, or a photo / image slot, then the headline, subheadline and ALL hero text MUST be white or near-white (#fff to rgba(255,255,255,.82)). If the hero background is light or pale, hero text MUST be near-black (#111). A dark headline on a dark hero is a critical failure — the user must be able to read the headline the instant the page loads.
- TEXT OVER A PHOTO OR IMAGE SLOT: put a dark overlay (e.g. a layer of rgba(0,0,0,.45)) between the image and the text, use white text, and add a subtle text-shadow so the words stay legible over any photo.
- BUTTONS: the label must contrast with the button fill — white text on a saturated/dark button, dark text on a pale/light button. Never grey text on a grey button.
- Secondary / muted text must still be readable: not lighter than rgba(255,255,255,.65) on dark backgrounds, and around #555–#666 (never lighter) on light backgrounds.
- FINAL CHECK before you finish: scan every headline, paragraph, button, nav link and stat. If a human couldn't read it in a single glance, change the color until they can.

━━━ IMAGE SLOTS ━━━
Where images naturally belong, use this exact format (users click to upload real photos):
Hero: <div class="ws-img-slot" data-slot="hero" data-label="Hero photo" style="width:100%;height:460px;background:linear-gradient(135deg,#2b2620,#3a322a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:8px"><div style="font-size:40px;opacity:0.35">&#128247;</div><div style="color:rgba(255,255,255,0.4);font-size:13px;font-weight:600">Click to add photo</div></div>
Content: <div class="ws-img-slot" data-slot="about" data-label="About photo" style="width:100%;height:300px;background:#f0f0f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px;border:2px dashed #ccc"><div style="font-size:36px;opacity:0.3">&#128247;</div><div style="color:#bbb;font-size:13px;font-weight:600">Click to add photo</div></div>
If you create any image-like placeholder area, it MUST use this format. Never create a styled box that looks like an image area without ws-img-slot class and data-slot attribute.

━━━ COPY ━━━
Invent a specific memorable brand name. Write like a professional copywriter who knows this industry. No Lorem Ipsum anywhere. Keep locations generic unless the user specified one. CONTACT DETAILS — CRITICAL: output these FOUR tokens EXACTLY and verbatim wherever contact info appears — [Your Phone], [your@email.com], [Your Address], [Your Hours] — in both visible text AND links (href="tel:[Your Phone]", href="mailto:[your@email.com]"). Do NOT invent realistic-looking phone numbers, emails, or street addresses — the owner fills these in with one click in the editor, which only works if these exact tokens are present. These four are the ONLY placeholders allowed; everywhere else write real, polished copy. The brand name is NOT a placeholder: use the real invented name, and make sure the brand element carries data-ws-field="brand" and the same name appears in the <title>.

━━━ MOTION & INTERACTION ━━━
The site MUST have clearly visible motion — never a static page:
- ON LOAD: the hero headline, subheadline and buttons animate in with a staggered fade + slide-up using CSS @keyframes (translateY(24px) to 0, opacity 0 to 1, about 0.6s, with increasing animation-delay per element). These play immediately on page load.
- ON SCROLL: every major section and card reveals with a fade + slide-up as it enters the viewport. Implement it robustly: a .reveal class set to opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease, plus a .reveal.is-visible class set to opacity:1; transform:none — then an IntersectionObserver (threshold around 0.15) that adds is-visible to each .reveal as it scrolls into view. Stagger grouped cards with transition-delay. Put the .reveal class on sections, cards, and major blocks.
- HOVER: cards lift (translateY(-6px)) with a larger shadow; buttons shift color or scale; nav links get a subtle underline-slide. Keep hover transitions 0.2-0.3s.
- Mobile hamburger toggles the nav; anchor links smooth-scroll; FAQ accordion if included; form validation with a success state.
Animations must ENHANCE and ALWAYS settle into a fully visible state — never leave anything permanently hidden. Keep entrance transitions under 0.8s.

━━━ TECHNICAL ━━━
All CSS in one <style> tag. All JS in one <script> tag before </body>. The ONLY permitted external resource is Google Fonts: include ONE <link> in the <head> that loads two complementary font families and actually use them (everything else must be self-contained — no other CDNs, no JS libraries, no remote images). Always include a system fallback in every font-family stack (e.g. ...,system-ui,-apple-system,sans-serif). Never use vh or vw for HEIGHTS (use px or %). opacity:0 is fine as the START of an entrance animation, as long as the element animates to full opacity. End with </body></html>.`;

const MODIFY = `You are an expert front-end developer making precise, surgical edits to a website. The user will describe what they want changed.

Return ONLY the complete updated HTML from <!DOCTYPE html> to </html>. No markdown, no backticks, no explanation.

IMPORTANT — this site may use multi-page JS routing with elements like:
- .page divs with id="page-home", id="page-about" etc
- showPage() function for navigation
- .nav-link elements with data-page attributes
Preserve ALL routing logic exactly. Never break the page switching.

IMAGE SECTIONS — critical rule:
If the user asks to add a photo section, gallery, image area, team photos, or anything involving images, you MUST use this exact format for every image placeholder. This is required — users click these boxes to upload their own photos:

For dark-background image areas:
<div class="ws-img-slot" data-slot="UNIQUE_ID" data-label="Descriptive label" style="width:100%;height:320px;background:linear-gradient(135deg,#2b2620,#3a322a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px"><div style="font-size:36px;opacity:0.35">&#128247;</div><div style="color:rgba(255,255,255,0.45);font-size:13px;font-weight:600">Click to add photo</div></div>

For light-background image areas:
<div class="ws-img-slot" data-slot="UNIQUE_ID" data-label="Descriptive label" style="width:100%;height:280px;background:#f0f0f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;border-radius:12px;border:2px dashed #ccc"><div style="font-size:36px;opacity:0.3">&#128247;</div><div style="color:#bbb;font-size:13px;font-weight:600">Click to add photo</div></div>

Replace UNIQUE_ID with a descriptive slug like gallery-1, gallery-2, team-1, product-1, hero etc. Each slot must have a different data-slot value.

Never create a styled box or placeholder that looks like an image area WITHOUT using this format — otherwise users cannot add photos to it.

EDIT PRINCIPLES:
- Make EXACTLY what the user asked — don't change anything else
- If changing colors: update ALL instances consistently across ALL pages — buttons, borders, gradients, accents, icons, hover states
- If adding content to a page: add it where it makes most sense in the layout
- If the user says "make it darker/lighter": adjust the whole color palette coherently
- READABILITY: after ANY color change, verify every text element still strongly contrasts with its background — never leave dark text on a dark background or light text on a light background. Hero or section text sitting over a dark background or photo must be white/near-white and instantly readable.
- Preserve ALL JavaScript — routing, menus, animations, form handlers, FAQ toggles
- Scroll-reveal / entrance animations and hover micro-interactions are welcome; just ensure every element ends fully visible.
- Keep the site self-contained except Google Fonts, which are allowed (a <link> in the head). Preserve any existing Google Fonts link unless the user asks to change the typography; if they ask for a different font, swap to a fitting Google Font and keep a system fallback. No other CDNs or JS libraries. No vh/vw for heights — heroes/sections sized in px or %.
If adding or editing a contact form, always include action="#" method="POST" and a hidden field: <input type="hidden" name="_subject" value="New message from your website">
- End with </body></html>

QUALITY BAR: The edit should look intentional and professional — not like a quick find-and-replace.`;

// Pushes generation toward genuinely impressive, modern design (appended to the generate prompt).
const DESIGN_AMBITION = `DESIGN AMBITION — do NOT build a safe, templated business website. Build something genuinely memorable: the kind of site that gets featured on Awwwards and makes a visitor stop and say "whoa." Take a bold, opinionated aesthetic stance that fits the brand and fully commit to it. Generic and forgettable is the ONLY failure mode here.

COMMIT TO ONE CONCEPT — before building, lock in a single strong art direction that fits this exact business (e.g. dark-luxe with neon accents, warm sun-baked editorial, retro-futuristic, refined brutalist, organic & earthy, glassy & high-tech, bold & playful). Every decision — color, type, motion, shapes, spacing — reinforces that one concept so the page feels custom and intentional, never assembled from defaults.

TYPOGRAPHY IS THE #1 LEVER — be dramatic. Load TWO Google Fonts: a characterful DISPLAY font for headlines paired with a clean, readable body font, chosen to fit the concept (modern/tech: Sora, Space Grotesk, Archivo; editorial/premium: Fraunces, Playfair Display; friendly: Poppins, Nunito Sans; bold/quirky: Unbounded, Bricolage Grotesque). Hero headline is huge and confident: font-size clamp(2.6rem,7vw,5.5rem), weight 800-900, tracking -0.03em; section titles ~2-3rem; body 16-18px / line-height 1.65. Use big scale jumps and emphasize key words with a GRADIENT text fill or a bold colored highlight/underline. Type should dominate the page, never whisper.

A HERO THAT STOPS THE SCROLL — make the hero feel alive with pure CSS (no images required): an animated gradient / aurora / mesh background, OR a few large blurred color "blobs" drifting slowly behind the content, OR a subtle grain/noise texture over a rich gradient. Bold headline, a punchy one-sentence subhead, and two CTAs (primary = solid with a gradient + soft glow; secondary = ghost/outline). Tall and full-bleed (min-height ~640-780px using px, never vh).

MOTION = PREMIUM (tasteful, purposeful) — bring the page to life: staggered scroll-reveal entrances (fade + slide-up) on every major section; rich hover states on cards/buttons (lift + shadow + subtle scale, gradient shift, glow); a shimmer or animated gradient on the primary CTA; at least one slow-scrolling MARQUEE / ticker band (services, taglines, or stats); and animated count-up numbers for any stats. Transitions 0.3-0.8s; honor prefers-reduced-motion.

BREAK THE GRID — never just stack three identical centered cards. Vary the rhythm hard: asymmetric two-column splits (e.g. 5fr/7fr), a BENTO-style grid of different-sized cards for features or highlights, deliberately overlapping elements, oversized faded section numbers (01 / 02 / 03) or giant background words, and full-bleed dark or accent bands that alternate with lighter sections so the page builds dramatic contrast and momentum as you scroll.

DEPTH & DETAIL — layer it: soft oversized shadows; glassmorphism panels (semi-transparent + backdrop-blur) where they fit; gradient borders; soft colored glows behind focal elements; pill-shaped badges/tags; gradient-text highlights; tasteful custom dividers; and a sticky nav that gains a blur + shadow once you scroll. Reuse ONE border-radius and ONE shadow system so it stays cohesive.

COLOR PALETTE (match the brand — never default to generic blue) — choose a primary brand color plus one or two accents that authentically fit the business's industry, culture and mood, and use them consistently across buttons, links, icons and highlights. Avoid generic tech-blue unless the brand truly calls for it. Guides: Mexican/Latin/cantina to terracotta, agave green, amber, chili red, cream; Italian to deep red, olive, cream; coffee/bakery to warm browns, caramel, cream; BBQ/grill to charcoal, ember orange, oxblood; spa/salon/wellness to sage, eucalyptus, stone, blush; law/finance/professional to deep navy or forest, charcoal, gold; real estate to forest/slate, warm neutrals, brass; kids/play to bright cheerful primaries; luxury to near-black, gold, ivory; tech/SaaS to blues, violets, cyans. Pull the palette from the cuisine, materials, or feeling of the business.

SPACING & POLISH — generous vertical section padding (~96-128px desktop, less on mobile); derive every gap from an 8px scale (8/16/24/32/48/64/96); keep everything aligned to a centered max-width container (~1160px) except intentional full-bleed bands; nothing touches the screen edges.

COPY CRAFT — the hero headline states a concrete, bold promise for THIS exact business (never "Welcome to X"); the subhead adds specifics in one line. Use real, concrete details: specific services, believable numbers, named packages. Confident, human, benefit-led; zero corporate filler.

GUARDRAILS — bold but never broken: readability wins every time (text must stay strongly contrasted against its exact background), NEVER cause horizontal scroll, and ALWAYS finish the entire page through the closing body and html tags. If you are running long, simplify a section rather than truncate — a complete, daring, readable page always beats an elaborate broken one.`;


// ── Main HTML page ────────────────────────────────────────────
const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Websprout: AI Website Builder | Make a Website in Seconds, Free</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<meta name="description" content="Websprout is an AI website builder that turns one sentence into a complete, professional, multi-page website in about 18 seconds. Free to generate and preview. Go Pro for $10/month to download the source code and deploy anywhere — cancel anytime.">
<link rel="canonical" href="https://websprout.app/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="keywords" content="AI website builder, website generator, make a website with AI, free website builder, no-code website, AI web design, build a website fast, website maker, instant website">
<meta name="author" content="Websprout">
<meta name="theme-color" content="#060d05">
<meta name="ws-build" content="2026-06-10-r61">
<script>console.log("%c[Websprout] build 2026-06-10-r61 (generation: bold award-worthy art-direction brief)","color:#4ade80;font-weight:700")</script>
<meta name="application-name" content="Websprout">
<meta name="apple-mobile-web-app-title" content="Websprout">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Websprout">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="Websprout: Build a Website with AI in Seconds">
<meta property="og:description" content="Describe your business, get a complete professional website in about 18 seconds. Free to preview, $10/month to download the code and deploy anywhere.">
<meta property="og:url" content="https://websprout.app/">
<meta property="og:image" content="https://websprout.app/og.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Websprout - AI Website Builder">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Websprout: Build a Website with AI in Seconds">
<meta name="twitter:description" content="Describe your business, get a complete professional website in about 18 seconds. Free to preview, $10/month to download the code and deploy anywhere.">
<meta name="twitter:image" content="https://websprout.app/og.svg">
<meta name="twitter:image:alt" content="Websprout - AI Website Builder">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232d7a3a'/><text y='.9em' font-size='75' x='12'>&#127807;</text></svg>">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":"Websprout","url":"https://websprout.app/","description":"AI website builder that generates a complete, professional, multi-page website from a short description in about 18 seconds.","applicationCategory":"DesignApplication","operatingSystem":"Web browser","browserRequirements":"Requires JavaScript","offers":{"@type":"Offer","price":"10.00","priceCurrency":"USD","description":"$10/month Pro subscription to download the full source code and deploy anywhere. Generating and previewing is free, and you can cancel anytime."},"featureList":["AI website generation in seconds","Live preview before paying","Conversational AI editing","Download full HTML source code","Free one-click deploy to Netlify or Cloudflare Pages"]},{"@type":"Organization","name":"Websprout","url":"https://websprout.app/","logo":"https://websprout.app/og.svg","sameAs":[]},{"@type":"WebSite","name":"Websprout","url":"https://websprout.app/"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need to pay for hosting?","acceptedAnswer":{"@type":"Answer","text":"No. Both Netlify and Cloudflare Pages have permanently free tiers that are more than enough for most websites. Netlify gives you 100GB of bandwidth per month free, and Cloudflare Pages offers unlimited bandwidth."}},{"@type":"Question","name":"Can I update my site after deploying?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the chat in Websprout to make changes, re-download your site, and re-deploy. On Netlify you can drag and drop a new file onto your existing site to update it, and on Cloudflare Pages you upload a new version through the dashboard."}},{"@type":"Question","name":"How do I connect a custom domain?","acceptedAnswer":{"@type":"Answer","text":"Both platforms make this easy and free. On Netlify, go to Site Settings, Domain Management, Add custom domain, then follow the DNS instructions from your registrar. On Cloudflare Pages, use Custom Domains, Add a domain."}},{"@type":"Question","name":"Is my site secure with HTTPS?","acceptedAnswer":{"@type":"Answer","text":"Yes, automatically. Both Netlify and Cloudflare Pages issue free SSL certificates the moment your site is deployed, so your site always serves over HTTPS with no extra configuration."}},{"@type":"Question","name":"How much does Websprout cost?","acceptedAnswer":{"@type":"Answer","text":"Generating and previewing websites is completely free. Go Pro for $10 per month to download the full source code, deploy your sites, and edit across all of them. You can cancel anytime."}},{"@type":"Question","name":"How long does it take to build a website?","acceptedAnswer":{"@type":"Answer","text":"About 18 seconds. You describe your business, and the AI generates a complete multi-page website that you can preview live and then edit with chat."}}]}]}</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;background:#060d05;color:#fff}
.hero h1,.section-title,.nav-logo,.stat-n,.price-amt,.how-step-num{font-family:'Sora',-apple-system,BlinkMacSystemFont,sans-serif}

/* ---- NAV ---- */
nav{position:sticky;top:0;z-index:100;height:58px;background:rgba(6,13,5,.9);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 5vw;gap:20px}
.nav-logo{font-size:18px;font-weight:800;color:#fff;text-decoration:none;display:flex;align-items:center;gap:9px;letter-spacing:-.6px;margin-right:auto}
.lw{white-space:nowrap}
.nav-logo-mark{width:30px;height:30px;background:linear-gradient(145deg,#3ea04e,#22692e);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 14px rgba(45,122,58,.4)}
.nav-logo-mark svg{display:block}
.nav-logo em{font-style:normal;color:#4ade80}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:14px;color:rgba(255,255,255,.5);text-decoration:none;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#fff}
.nav-cta{background:#2d7a3a;color:#fff;padding:8px 18px;border-radius:7px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.nav-cta:hover{background:#3dba52;transform:translateY(-1px)}

/* ---- HERO ---- */
.hero{padding:72px 5vw 60px;text-align:center;position:relative;overflow:hidden;background:#060d05}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(45,122,58,.18) 0%,transparent 70%);pointer-events:none}
.hero-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(45,122,58,.12);color:#4ade80;border:1px solid rgba(45,122,58,.3);border-radius:100px;padding:5px 14px 5px 8px;font-size:12px;font-weight:600;margin-bottom:28px}
.hero-pill-dot{width:20px;height:20px;background:#2d7a3a;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:10px}
.hero h1{font-size:clamp(2.8rem,5.5vw,4.6rem);font-weight:800;line-height:1.05;letter-spacing:-2px;color:#fff;margin-bottom:18px}
.hero h1 em{font-style:normal;color:#4ade80}
.hero-sub{font-size:18px;color:rgba(255,255,255,.5);max-width:480px;margin:0 auto 40px;line-height:1.7}
.hero-stats{display:flex;gap:0;justify-content:center;margin-bottom:48px;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;max-width:520px;margin-left:auto;margin-right:auto;margin-top:0}
.hero-stat{flex:1;padding:16px 20px;text-align:center;border-right:1px solid rgba(255,255,255,.08)}
.hero-stat:last-child{border-right:none}
.stat-n{font-size:22px;font-weight:800;letter-spacing:-1px;background:linear-gradient(120deg,#eafff1,#4ade80);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.stat-l{font-size:11px;color:rgba(255,255,255,.35);margin-top:2px;font-weight:500}

/* ---- BUILDER CARD (in hero) ---- */
.builder-wrap{max-width:760px;margin:0 auto}
.builder-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:2px;margin-bottom:14px}
.builder-card{background:#0f1a0d;border:1px solid rgba(45,122,58,.2);border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(45,122,58,.08),0 32px 80px rgba(0,0,0,.5);max-height:560px;overflow-y:auto}

/* ---- STEP TABS ---- */
.step-tabs{display:none;background:#080f07;border-bottom:1px solid rgba(255,255,255,.06)}
.step-tab{flex:1;padding:13px 8px;text-align:center;font-size:12px;font-weight:600;color:rgba(255,255,255,.25);border:none;background:transparent;cursor:default;position:relative;transition:color .2s;border-right:1px solid rgba(255,255,255,.05);font-family:inherit}
.step-tab:last-child{border-right:none}
.step-tab.active{color:#4ade80;background:rgba(255,255,255,.02)}
.step-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#2d7a3a}
.step-tab.done{color:#4ade80}
.step-n{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:currentColor;color:#080f07;font-size:9px;font-weight:900;margin-right:5px}
.panel{display:none;padding:20px 22px}
.panel.active{display:block}
.panel-q{font-size:14px;color:rgba(255,255,255,.5);margin-bottom:4px;font-weight:600}

/* ---- TYPE GRID ---- */
.type-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:16px}
.type-btn{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:10px;padding:12px 6px 10px;cursor:pointer;text-align:center;font-family:inherit;transition:all .15s;color:rgba(255,255,255,.45)}
.type-btn:hover{border-color:rgba(61,186,82,.4);background:rgba(45,122,58,.1);color:rgba(255,255,255,.85)}
.type-btn.sel{border-color:#3dba52;background:rgba(45,122,58,.18);color:#fff;box-shadow:0 0 0 3px rgba(61,186,82,.12)}
.type-icon{font-size:20px;display:block;margin-bottom:4px}
.type-lbl{font-size:10px;font-weight:600;line-height:1.3}
#customWrap{display:none;margin-bottom:16px}
.dark-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:9px 12px;color:#e8f5e4;font-family:inherit;font-size:14px;outline:none;transition:border .15s}
.dark-input:focus{border-color:rgba(45,122,58,.5)}
.dark-input::placeholder{color:rgba(255,255,255,.18)}
textarea.dark-input{resize:vertical;min-height:76px;line-height:1.6}
.describe-box{min-height:124px;font-size:15px;line-height:1.65;padding:14px 16px}
.describe-vibe{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0 2px}
.describe-vibe-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.6px}
.panel-foot{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);margin-top:12px}
.p-hint{font-size:12px;color:rgba(255,255,255,.18)}
.btn-next{background:#2d7a3a;color:#fff;padding:8px 20px;border-radius:7px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .15s;opacity:.35;pointer-events:none}
.btn-next.on{opacity:1;pointer-events:all}
.btn-next.on:hover{background:#3dba52}
.btn-back{background:rgba(255,255,255,.05);color:rgba(255,255,255,.35);padding:8px 16px;border-radius:7px;font-size:13px;border:1px solid rgba(255,255,255,.08);cursor:pointer;font-family:inherit;transition:all .15s}
.btn-back:hover{color:rgba(255,255,255,.7);background:rgba(255,255,255,.08)}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.detail-grid .span2{grid-column:1/-1}
.field-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.vibe-row{display:flex;flex-wrap:wrap;gap:6px}
.vibe-chip{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.4);border-radius:100px;padding:5px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s}
.vibe-chip:hover{border-color:rgba(45,122,58,.4);color:rgba(255,255,255,.75)}
.vibe-chip.sel{background:rgba(45,122,58,.15);border-color:#2d7a3a;color:#4ade80}
.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;margin-bottom:18px}
.s-row{display:flex;flex-direction:column;gap:2px}
.s-lbl{font-size:10px;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.6px}
.s-val{font-size:13px;color:rgba(255,255,255,.7);font-weight:500}
.gen-btn{background:linear-gradient(135deg,#4ade80 0%,#22c55e 48%,#16a34a 100%);color:#06210f;padding:12px 28px;border-radius:10px;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:all .18s;box-shadow:0 6px 22px -4px rgba(34,197,94,.5)}
.gen-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px -6px rgba(34,197,94,.7);filter:brightness(1.05)}
.gen-btn:disabled{opacity:.5;cursor:not-allowed}
.loading{display:none;padding:32px 22px;text-align:center}
.loading.on{display:block}
.load-icon{font-size:28px;animation:spin 1.8s ease-in-out infinite;display:inline-block}
@keyframes spin{0%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(10deg) scale(1.15)}100%{transform:rotate(-10deg) scale(1)}}
.load-txt{font-size:13px;color:rgba(255,255,255,.35);margin-top:8px}
.load-bar{height:2px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:12px 22px 0}
.load-fill{height:100%;background:#2d7a3a;animation:sweep 2s ease-in-out infinite}
@keyframes sweep{0%{width:0%;margin-left:0}50%{width:55%;margin-left:20%}100%{width:0%;margin-left:100%}}

/* ---- HOME PAGE WOW UPGRADES ---- */
.hero{isolation:isolate}
.hero::before{z-index:-1;width:1200px;height:820px;top:-280px;background:radial-gradient(ellipse 46% 60% at 32% 38%,rgba(45,122,58,.30),transparent 62%),radial-gradient(ellipse 42% 54% at 70% 30%,rgba(16,185,129,.22),transparent 62%),radial-gradient(ellipse 40% 50% at 52% 74%,rgba(34,197,94,.16),transparent 66%);filter:blur(6px);animation:wsAurora 18s ease-in-out infinite alternate}
.hero::after{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at 82% 8%,rgba(16,185,129,.10),transparent 42%),radial-gradient(circle at 12% 82%,rgba(45,122,58,.10),transparent 45%);animation:wsAurora2 24s ease-in-out infinite alternate}
@keyframes wsAurora{0%{transform:translateX(-50%) translateY(0) scale(1) rotate(0deg)}50%{transform:translateX(-47%) translateY(22px) scale(1.07) rotate(2deg)}100%{transform:translateX(-53%) translateY(-12px) scale(1.04) rotate(-2deg)}}
@keyframes wsAurora2{0%{opacity:.5;transform:scale(1)}100%{opacity:1;transform:scale(1.12) translateY(12px)}}
.hero h1 em{background:linear-gradient(100deg,#4ade80 0%,#22d3ee 50%,#4ade80 100%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:wsShimmer 7s linear infinite}
@keyframes wsShimmer{to{background-position:220% center}}
.builder-card{position:relative;background:rgba(13,26,12,.55);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.16),0 0 58px -12px rgba(74,222,128,.4),inset 0 1px 0 rgba(255,255,255,.07);animation:wsCardPulse 5.5s ease-in-out infinite}
@keyframes wsCardPulse{0%,100%{box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.14),0 0 52px -14px rgba(74,222,128,.32),inset 0 1px 0 rgba(255,255,255,.07)}50%{box-shadow:0 40px 90px -24px rgba(0,0,0,.7),0 0 0 1px rgba(74,222,128,.24),0 0 78px -8px rgba(74,222,128,.55),inset 0 1px 0 rgba(255,255,255,.07)}}
.type-btn{transition:transform .18s cubic-bezier(.2,.7,.2,1),border-color .18s,background .18s,box-shadow .18s}
.type-btn:hover{transform:translateY(-3px);box-shadow:0 12px 26px -12px rgba(45,122,58,.55)}
.nav-cta{box-shadow:0 6px 18px -6px rgba(45,122,58,.6)}
#navCta{background:linear-gradient(135deg,#4ade80,#16a34a);color:#06210f;font-weight:700;box-shadow:0 4px 16px -2px rgba(34,197,94,.5)}
#navCta:hover{transform:translateY(-1px);box-shadow:0 7px 22px -4px rgba(34,197,94,.65);filter:brightness(1.04)}
/* staggered entrance */
.hero-pill,.hero h1,.hero-sub,.ex-wrap,.hero-stats,.builder-wrap{animation:wsRise .7s cubic-bezier(.2,.7,.2,1) both}
.hero h1{animation-delay:.05s}
.hero-sub{animation-delay:.11s}
.ex-wrap{animation-delay:.16s}
.hero-stats{animation-delay:.21s}
.builder-wrap{animation-delay:.27s}
@keyframes wsRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
/* one-click example starter prompts */
.ex-wrap{margin:0 auto 44px;max-width:640px}
.ex-label{font-size:12px;color:rgba(255,255,255,.4);font-weight:600;margin-bottom:12px}
.ex-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.ex-chip{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.82);border-radius:100px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:transform .16s cubic-bezier(.2,.7,.2,1),border-color .16s,background .16s,box-shadow .16s}
.ex-chip:hover{transform:translateY(-2px);border-color:rgba(61,186,82,.55);background:rgba(45,122,58,.16);color:#fff;box-shadow:0 10px 24px -10px rgba(45,122,58,.6)}
.ex-emoji{font-size:15px}
@media(prefers-reduced-motion:reduce){.hero::before,.hero::after,.hero h1 em,.hero-pill,.hero h1,.hero-sub,.ex-wrap,.hero-stats,.builder-wrap,.builder-card{animation:none}}

/* ---- TRUST BAR ---- */
.trust-bar{background:#060d05;border-top:1px solid rgba(255,255,255,.06);padding:28px 5vw;display:flex;align-items:center;justify-content:center;gap:32px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.35);font-weight:500}
.trust-icon{font-size:16px}

/* ---- HOW IT WORKS ---- */
.how{background:#fff;padding:88px 5vw}
.how-inner{max-width:960px;margin:0 auto}
.section-eyebrow{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;background:linear-gradient(90deg,#16a34a,#0e7490);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.section-title{font-size:clamp(1.7rem,2.8vw,2.4rem);font-weight:800;color:#0a0a0a;letter-spacing:-1.5px;margin-bottom:40px;line-height:1.1}
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.how-card{border:1px solid #eee;border-radius:18px;padding:28px;background:#fff;transition:all .2s;position:relative;overflow:hidden}
.how-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,122,58,.03),transparent);opacity:0;transition:opacity .2s}
.how-card:hover{border-color:#c8e8c4;box-shadow:0 8px 32px rgba(45,122,58,.08);transform:translateY(-3px)}
.how-card:hover::before{opacity:1}
.how-step-num{width:36px;height:36px;background:#f0faf2;border:1.5px solid #c8e8c4;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#2d7a3a;margin-bottom:18px}
.how-card h3{font-size:16px;font-weight:800;color:#0a0a0a;margin-bottom:8px;letter-spacing:-.3px}
.how-card p{font-size:14px;color:#666;line-height:1.7}

/* ---- COMPARE ---- */
.compare{background:#060d05;padding:88px 5vw}
.compare-inner{max-width:780px;margin:0 auto}
.compare-inner .section-eyebrow{background:linear-gradient(90deg,#4ade80,#22d3ee);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.compare-inner .section-title{color:#fff}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cmp-card{border-radius:16px;padding:26px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}
.cmp-card.highlight{border-color:rgba(45,122,58,.35);background:rgba(45,122,58,.07)}
.cmp-head{font-size:14px;font-weight:700;color:#fff;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.cmp-badge{background:#2d7a3a;color:#fff;font-size:10px;font-weight:700;padding:2px 9px;border-radius:100px}
.cmp-list{list-style:none;display:flex;flex-direction:column;gap:10px}
.cmp-item{font-size:13px;color:rgba(255,255,255,.55);display:flex;align-items:flex-start;gap:8px;line-height:1.5}
.cmp-item::before{content:'v';color:#4ade80;font-weight:900;font-size:11px;flex-shrink:0;margin-top:2px}
.cmp-item.no{color:rgba(255,255,255,.2)}
.cmp-item.no::before{content:'x';color:rgba(255,255,255,.15)}

/* ---- PRICING ---- */
.pricing{background:#fff;padding:88px 5vw}
.pricing-inner{max-width:640px;margin:0 auto}
.price-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
.price-card{border:1.5px solid #e8e8e8;border-radius:18px;padding:28px;background:#fff}
.price-card.pick{border-color:#2d7a3a;box-shadow:0 0 0 4px rgba(45,122,58,.08)}
.price-name{font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
.price-amt{font-size:44px;font-weight:800;color:#0a0a0a;letter-spacing:-2px;line-height:1}
.price-amt sup{font-size:20px;font-weight:700;vertical-align:top;margin-top:8px;display:inline-block}
.price-freq{font-size:13px;color:#aaa;margin:6px 0 20px}
.price-list{list-style:none;display:flex;flex-direction:column;gap:9px}
.price-item{font-size:14px;color:#444;display:flex;align-items:center;gap:7px}
.price-item::before{content:'v';color:#2d7a3a;font-weight:900;font-size:11px}
.price-item.dim{color:#ccc}
.price-item.dim::before{content:'-';color:#ddd;font-weight:400}

/* ---- CTA BAND ---- */
.cta-band{background:linear-gradient(135deg,#0a1f0a 0%,#1a4025 40%,#2d7a3a 100%);padding:88px 5vw;text-align:center;position:relative;overflow:hidden}
.cta-band::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(61,186,82,.2) 0%,transparent 70%);pointer-events:none}
.cta-band h2{font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-2px;margin-bottom:12px;position:relative}
.cta-band p{font-size:18px;color:rgba(255,255,255,.65);margin-bottom:32px;position:relative}
.btn-white{background:#fff;color:#1a4025;padding:15px 36px;border-radius:10px;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:inherit;transition:all .2s;position:relative;letter-spacing:-.2px}
.btn-white:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.2)}

/* ---- FOOTER ---- */
footer{background:#030804;border-top:1px solid rgba(255,255,255,.05);padding:32px 5vw;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
.foot-logo{font-size:15px;font-weight:800;color:#fff;text-decoration:none;display:flex;align-items:center;gap:7px}
.foot-logo em{font-style:normal;color:#4ade80}
.foot-links{display:flex;gap:20px;flex-wrap:wrap}
.foot-links a{font-size:13px;color:rgba(255,255,255,.22);text-decoration:none;transition:color .15s}
.foot-links a:hover{color:rgba(255,255,255,.6)}

/* ---- TOAST ---- */
.toast{position:fixed;bottom:24px;right:24px;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);color:#e8f5e4;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,.35);z-index:99999;transform:translateY(80px);opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none;max-width:320px}
.toast.on{transform:translateY(0);opacity:1}

/* ---- SKELETON ---- */
.skeleton-wrap{position:absolute;inset:0;background:#060d05;z-index:5;overflow:hidden;display:none;flex-direction:column;align-items:center;justify-content:center}
.skeleton-wrap.show{display:flex}
.skel-inner{width:100%;max-width:640px;padding:0 28px;display:flex;flex-direction:column;align-items:center}
.skel-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px}
.skel-logo-mark{width:36px;height:36px;background:#2d7a3a;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;animation:skel-bob 2s ease-in-out infinite}
@keyframes skel-bob{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.12) rotate(3deg)}}
.skel-logo-text{font-size:18px;font-weight:800;color:#fff;letter-spacing:-.3px}
.skel-logo-text em{font-style:normal;color:#4ade80}
.skel-msg{font-size:14px;color:rgba(255,255,255,.45);font-weight:500;margin-bottom:28px;min-height:20px;text-align:center;transition:opacity .3s}
.skel-progress-track{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:100px;margin-bottom:36px;overflow:hidden}
.skel-progress-fill{height:100%;background:linear-gradient(90deg,#2d7a3a,#4ade80);border-radius:100px;width:0%;transition:width .9s cubic-bezier(.2,.8,.2,1)}
@keyframes skel-prog{0%{width:0%}30%{width:35%}60%{width:62%}85%{width:82%}100%{width:92%}}
.skel-build{width:100%;display:flex;flex-direction:column;gap:8px}
.skel-section{border-radius:10px;overflow:hidden;animation:skel-appear .4s ease forwards;opacity:0}
@keyframes skel-appear{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.skel-section:nth-child(1){animation-delay:.1s}
.skel-section:nth-child(2){animation-delay:.5s}
.skel-section:nth-child(3){animation-delay:.9s}
.skel-section:nth-child(4){animation-delay:1.3s}
.skel-section:nth-child(5){animation-delay:1.7s}
.skel-nav-bar{height:42px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;display:flex;align-items:center;padding:0 16px;gap:10px}
.skel-nav-dot{width:24px;height:24px;background:rgba(45,122,58,.3);border-radius:5px}
.skel-nav-links{display:flex;gap:8px;margin-left:auto}
.skel-nav-link{height:8px;border-radius:4px;background:rgba(255,255,255,.07);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-nav-link:nth-child(1){width:44px}.skel-nav-link:nth-child(2){width:36px;animation-delay:.2s}.skel-nav-link:nth-child(3){width:40px;animation-delay:.4s}
.skel-hero-bar{height:80px;background:linear-gradient(135deg,rgba(45,122,58,.12),rgba(61,186,82,.06));border:1px solid rgba(45,122,58,.2);border-radius:10px;display:flex;align-items:center;padding:0 18px;gap:14px}
.skel-hero-lines{flex:1;display:flex;flex-direction:column;gap:7px}
.skel-hero-h{height:14px;border-radius:6px;background:rgba(255,255,255,.12);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-hero-sub{height:8px;width:70%;border-radius:4px;background:rgba(255,255,255,.06);animation:skel-pulse 1.8s ease-in-out .2s infinite}
.skel-hero-btn{width:72px;height:28px;border-radius:100px;background:rgba(45,122,58,.4);flex-shrink:0;animation:skel-pulse 1.8s ease-in-out .4s infinite}
.skel-cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.skel-card-item{height:52px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;animation:skel-pulse 1.8s ease-in-out infinite}
.skel-card-item:nth-child(2){animation-delay:.15s}.skel-card-item:nth-child(3){animation-delay:.3s}
.skel-text-row{display:flex;flex-direction:column;gap:6px;padding:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px}
.skel-text-line{height:7px;border-radius:4px;background:rgba(255,255,255,.06);animation:skel-pulse 1.8s ease-in-out infinite}
.skel-text-line.w90{width:90%}.skel-text-line.w70{width:70%;animation-delay:.2s}.skel-text-line.w55{width:55%;animation-delay:.4s}
@keyframes skel-pulse{0%,100%{opacity:.6}50%{opacity:1}}
/* ---- STUDIO ---- */
.studio{display:none;position:fixed;inset:0;z-index:9999;flex-direction:column;background:#0f1a0d}
.studio.on{display:flex}
.s-header{height:52px;background:#0a1208;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 16px;gap:10px;flex-shrink:0}
.s-title{font-size:14px;font-weight:700;color:#fff;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.live-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.device-btns{display:flex;gap:2px;background:rgba(255,255,255,.06);border-radius:8px;padding:3px;flex-shrink:0}
.dev-btn{background:transparent;border:none;color:rgba(255,255,255,.35);width:26px;height:26px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.dev-btn:hover{color:rgba(255,255,255,.7)}.dev-btn.active{background:rgba(255,255,255,.12);color:#fff}
.edit-counter{font-size:11px;color:rgba(255,255,255,.3);font-weight:600;padding:4px 8px;background:rgba(255,255,255,.05);border-radius:6px;white-space:nowrap}
.s-actions{display:flex;gap:6px;flex-shrink:0;margin-left:auto}
.s-btn{border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.s-ghost{background:rgba(255,255,255,.06);color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.09)}
.s-ghost:hover{background:rgba(255,255,255,.11);color:#fff}
.studio.studio-loading [data-needs-site]{opacity:.3;pointer-events:none;cursor:not-allowed}
.studio.studio-loading .chat{opacity:.2;pointer-events:none;position:relative}
.studio.studio-loading .chat::after{content:"";position:absolute;inset:0;z-index:10;cursor:not-allowed}
.s-green{background:#2d7a3a;color:#fff}.s-green:hover{background:#3dba52}
.s-deploy-hero{background:linear-gradient(135deg,#00c7b7,#00a89c)!important;color:#fff!important;border:none!important;animation:deploy-pulse 2s ease-in-out infinite;font-size:13px!important;padding:7px 16px!important}
@keyframes deploy-pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,199,183,.4)}50%{box-shadow:0 0 0 8px rgba(0,199,183,0)}}
.deploy-cta-banner{background:linear-gradient(135deg,#0a1f0a,#1a4025);border-bottom:1px solid rgba(0,199,183,.3);padding:12px 16px;display:none;align-items:center;gap:12px;flex-shrink:0}
.deploy-cta-banner.on{display:flex}
.deploy-cta-banner-text{flex:1;font-size:13px;color:#fff;font-weight:600}
.deploy-cta-banner-text span{color:#4ade80}
.deploy-cta-banner-btn{background:#00c7b7;color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s}
.deploy-cta-banner-btn:hover{background:#00a89c;transform:translateY(-1px)}
.deploy-cta-dismiss{background:none;border:none;color:rgba(255,255,255,.3);font-size:16px;cursor:pointer;padding:0 4px}
.s-purple{background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff}
.s-purple:hover{box-shadow:0 4px 16px rgba(109,40,217,.4)}
.s-body{display:flex;flex:1;overflow:hidden}
.preview-frame-wrap{flex:1;position:relative;display:flex;justify-content:center;background:#fff;overflow-y:auto;overflow-x:auto;transition:background .3s}
.preview-frame-wrap.tablet,.preview-frame-wrap.mobile{background:#1a1a1a;padding:20px}
.preview-frame-wrap.tablet iframe{width:768px!important;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);flex-shrink:0}
.preview-frame-wrap.mobile iframe{width:390px!important;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.5);flex-shrink:0}
.preview-label{position:absolute;bottom:12px;left:12px;background:rgba(0,0,0,.45);color:rgba(255,255,255,.5);font-size:11px;padding:4px 10px;border-radius:6px;pointer-events:none;z-index:10}
.lock-badge{position:absolute;bottom:16px;right:16px;background:#0f0a2e;border:1px solid rgba(109,40,217,.3);border-radius:14px;padding:16px;max-width:240px;box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:10}
.lock-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:4px}
.lock-sub{font-size:11px;color:rgba(255,255,255,.35);margin-bottom:10px;line-height:1.5}
.lock-email{width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:7px 11px;color:#fff;font-size:12px;outline:none;margin-bottom:8px;font-family:inherit}
.fs-overlay{display:none;position:fixed;inset:0;z-index:99997;background:#fff;flex-direction:column}
.fs-overlay.on{display:flex}
.fs-overlay iframe{flex:1;border:none;width:100%}
.fs-bar{height:44px;background:#0f1a0d;display:flex;align-items:center;padding:0 16px;gap:10px;flex-shrink:0}
.fs-close{background:#2d7a3a;color:#fff;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.fs-close:hover{background:#3dba52}
.fs-title{font-size:13px;color:rgba(255,255,255,.5);flex:1}
.drop-overlay{position:absolute;inset:0;background:rgba(45,122,58,.15);border:3px dashed #2d7a3a;border-radius:4px;z-index:20;display:none;align-items:center;justify-content:center;pointer-events:none}
.drop-overlay.show{display:flex}
.drop-overlay-txt{background:#0f1a0d;color:#4ade80;font-size:16px;font-weight:700;padding:16px 32px;border-radius:12px}

/* ---- BIZ INFO PANEL ---- */
.biz-panel{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.biz-panel-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:0}
.biz-panel-title{font-size:10px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:5px}
.biz-panel-toggle{font-size:10px;color:rgba(255,255,255,.2);transition:transform .2s}
.biz-panel-toggle.open{transform:rotate(180deg)}
.biz-fields{display:none;flex-direction:column;gap:7px;margin-top:10px}
.biz-fields.open{display:flex}
.biz-field{display:flex;flex-direction:column;gap:3px}
.biz-field label{font-size:10px;color:rgba(255,255,255,.3);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.biz-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:7px;padding:7px 10px;color:#e8f5e4;font-family:inherit;font-size:12px;outline:none;transition:border .15s;width:100%}
.biz-input:focus{border-color:rgba(45,122,58,.5)}
.biz-input::placeholder{color:rgba(255,255,255,.18)}
.biz-apply{width:100%;background:rgba(45,122,58,.2);border:1px solid rgba(45,122,58,.35);color:#4ade80;border-radius:8px;padding:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;margin-top:4px}
.biz-apply:hover{background:rgba(45,122,58,.35)}

/* ---- CHAT ---- */
.chat{width:332px;flex-shrink:0;display:flex;flex-direction:column;background:#0a1208;border-left:1px solid rgba(255,255,255,.06)}
.chat-head{padding:14px 15px 12px;border-bottom:1px solid rgba(255,255,255,.06);background:linear-gradient(180deg,rgba(45,122,58,.1),transparent)}
.chat-head-title{font-size:13px;font-weight:700;color:#eafbe6;letter-spacing:.2px;display:flex;align-items:center;gap:6px}
.chat-head-sub{font-size:11px;color:rgba(255,255,255,.42);margin-top:3px;line-height:1.4}
.chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:0}
.chat-msgs::-webkit-scrollbar{width:3px}
.chat-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}
.msg{max-width:92%}
.msg-ai{align-self:flex-start}.msg-me{align-self:flex-end}
.msg-name{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px}
.msg-ai .msg-name{color:#4ade80}.msg-me .msg-name{color:rgba(255,255,255,.28);text-align:right}
.msg-body{padding:9px 12px;border-radius:12px;font-size:13px;line-height:1.55}
.msg-ai .msg-body{background:rgba(255,255,255,.06);color:rgba(255,255,255,.78);border-radius:4px 12px 12px 12px}
.msg-me .msg-body{background:#2d7a3a;color:#fff;border-radius:12px 4px 12px 12px}
.typing{padding:0 14px 8px;display:none}.typing.on{display:block}
.typing-bub{background:rgba(255,255,255,.06);border-radius:4px 12px 12px 12px;padding:9px 14px;display:inline-flex;gap:4px;align-items:center}
.t-dot{width:5px;height:5px;background:rgba(255,255,255,.28);border-radius:50%;animation:tdot 1.2s infinite}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}
.img-library{border-top:1px solid rgba(255,255,255,.05);padding:10px 12px}
.img-lib-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;padding:1px 0;cursor:pointer;font-family:inherit}
.img-lib-caret{font-size:10px;color:rgba(255,255,255,.35);transition:transform .18s}
.img-library:not(.collapsed) .img-lib-caret{transform:rotate(180deg)}
.img-library.collapsed .img-lib-body{display:none}
.img-lib-body{margin-top:9px}
.img-lib-actions{display:flex;justify-content:flex-end;margin-bottom:8px}
.img-lib-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.img-lib-label{font-size:10px;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:1px}
.img-upload-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.img-upload-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.img-dropzone{border:1.5px dashed rgba(255,255,255,.12);border-radius:10px;padding:14px;text-align:center;font-size:12px;color:rgba(255,255,255,.25);cursor:pointer;transition:all .2s;display:none}
.img-dropzone.empty{display:block}.img-dropzone.drag{border-color:#2d7a3a;background:rgba(45,122,58,.1);color:#4ade80}
.img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}
.img-thumb{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer;border:1.5px solid transparent;transition:all .15s}
.img-thumb:hover{border-color:#2d7a3a;transform:scale(1.04)}
.img-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.img-thumb-del{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:50%;font-size:9px;cursor:pointer;display:none;align-items:center;justify-content:center;line-height:1}
.img-thumb:hover .img-thumb-del{display:flex}
.img-actions{display:flex;flex-direction:column;gap:4px;padding:6px;background:rgba(0,0,0,.4);border-radius:6px;display:none}
.img-action-btn{background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.7);border-radius:5px;padding:5px 8px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;text-align:left;transition:all .15s}
.img-action-btn:hover{background:rgba(45,122,58,.3);color:#4ade80}
#imgFileInput{display:none}
.img-mobile-upload{display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(45,122,58,.15);border:1.5px solid rgba(45,122,58,.3);border-radius:10px;padding:12px;color:#4ade80;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;transition:all .15s}
.img-mobile-upload:hover{background:rgba(45,122,58,.25)}
.palette-section{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.design-drawer .live-color-panel,.design-drawer .font-section,.design-drawer .palette-section{border-bottom:none}
.dd-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;cursor:pointer;font-family:inherit;padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.dd-caret{font-size:10px;color:rgba(255,255,255,.35);transition:transform .18s}
.design-drawer:not(.collapsed) .dd-caret{transform:rotate(180deg)}
.design-drawer:not(.collapsed){border-bottom:1px solid rgba(255,255,255,.05)}
.design-drawer.collapsed .dd-body{display:none}
.palette-label{font-size:10px;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.palette-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.pal{width:100%;aspect-ratio:1;border-radius:7px;border:2px solid transparent;cursor:pointer;transition:all .15s;position:relative}
.pal:hover{transform:scale(1.18);border-color:rgba(255,255,255,.4);z-index:1}
.font-section{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.font-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-top:8px}
.font-btn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.6);border-radius:8px;padding:8px 10px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:left}
.font-btn:hover{background:rgba(45,122,58,.15);border-color:rgba(45,122,58,.4);color:#4ade80}
.font-btn-name{font-size:13px;font-weight:600;display:block}
.font-btn-sample{font-size:10px;color:rgba(255,255,255,.3);display:block;margin-top:1px}
.quick-edits{padding:11px 14px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05)}
.qe{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.5);border-radius:100px;padding:4px 11px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.qe:hover{background:rgba(45,122,58,.15);border-color:rgba(45,122,58,.4);color:#4ade80}
.font-btn.sel{background:rgba(45,122,58,.18);border-color:#2d7a3a;color:#4ade80}
.font-btn.sel .font-btn-sample{color:rgba(74,222,128,.6)}
.sec-pick{display:none;flex-wrap:wrap;gap:6px;width:100%;padding:8px 0 2px}
.sec-pick.on{display:flex}
.sec-pick .qe{color:rgba(255,255,255,.6)}
.qe.on{background:rgba(45,122,58,.2);border-color:#2d7a3a;color:#4ade80}
.qe-label{flex-basis:100%;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.3);margin-bottom:1px}
.chat-input{padding:12px 14px 14px;border-top:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.012)}
.chat-row{display:flex;gap:7px;align-items:flex-end;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:13px;padding:6px 6px 6px 13px;transition:border-color .15s,box-shadow .15s}
.chat-row:focus-within{border-color:rgba(74,222,128,.5);box-shadow:0 0 0 3px rgba(45,122,58,.16)}
.chat-ta{flex:1;background:transparent;border:none;border-radius:0;padding:6px 0;color:#eafbe6;font-family:inherit;font-size:14px;line-height:1.5;resize:none;outline:none;min-height:34px;max-height:120px}
.chat-ta::placeholder{color:rgba(255,255,255,.3)}
.chat-send{width:38px;height:38px;background:#2d7a3a;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s,transform .1s}
.chat-send:hover:not(:disabled){background:#3dba52}
.chat-send:active:not(:disabled){transform:scale(.93)}
.chat-send:disabled{opacity:.35;cursor:not-allowed}
.chat-hint{font-size:10px;color:rgba(255,255,255,.22);margin-top:7px;text-align:center}

/* ---- SEO MODAL ---- */
.seo-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.seo-modal.on{display:flex}
.seo-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.seo-header{padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.seo-header h3{font-size:16px;font-weight:700;color:#fff}
.seo-close{background:none;border:none;color:rgba(255,255,255,.4);font-size:20px;cursor:pointer;line-height:1}
.seo-body{padding:20px 24px}
.seo-field{margin-bottom:16px}
.seo-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:flex;justify-content:space-between}
.seo-label span{color:rgba(255,255,255,.2);font-weight:400;text-transform:none;letter-spacing:0}
.seo-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:9px 12px;color:#e8f5e4;font-family:inherit;font-size:13px;outline:none;transition:border .15s}
.seo-input:focus{border-color:rgba(45,122,58,.5)}
.seo-input::placeholder{color:rgba(255,255,255,.2)}
.seo-preview{background:#1a2e19;border-radius:8px;padding:12px;margin-top:16px;font-size:12px}
.seo-preview-title{color:#4285f4;font-size:14px;font-weight:500;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.seo-preview-url{color:#3c8b3c;font-size:11px;margin-bottom:4px}
.seo-preview-desc{color:rgba(255,255,255,.5);line-height:1.5}
.seo-footer{padding:16px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;justify-content:flex-end}
.seo-save{background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.seo-save:hover{background:#3dba52}

/* ---- SHARE MODAL ---- */
.share-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.share-modal.on{display:flex}
.share-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.4);padding:28px}
.share-box h3{font-size:18px;font-weight:800;color:#fff;margin-bottom:6px}
.share-box p{font-size:14px;color:rgba(255,255,255,.4);margin-bottom:20px}
.share-url-wrap{display:flex;gap:8px}
.share-url{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 12px;color:#4ade80;font-size:12px;font-family:monospace;outline:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.share-copy{background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
.share-copy:hover{background:#3dba52}
.share-note{font-size:12px;color:rgba(255,255,255,.25);margin-top:12px}
.share-close-btn{display:block;margin-top:16px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);border:none;border-radius:8px;padding:8px;font-size:13px;cursor:pointer;font-family:inherit;width:100%}

/* ---- EDIT MODE ---- */
.edit-mode-btn{background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.09)}
.edit-mode-btn.on{background:rgba(61,186,82,.2);color:#3dba52;border-color:rgba(61,186,82,.4)}
.edit-indicator{position:fixed;top:58px;left:50%;transform:translateX(-50%);background:#0f1a0d;border:1px solid rgba(61,186,82,.4);color:#4ade80;font-size:12px;font-weight:600;padding:6px 16px;border-radius:100px;z-index:99998;pointer-events:none;display:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.3)}
.edit-indicator.on{display:block}

/* ---- LIVE COLOR PANEL ---- */
.live-color-panel{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05)}
.live-color-grid{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.live-color-swatch{width:32px;height:32px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .15s;position:relative;overflow:hidden;flex-shrink:0}
.live-color-swatch:hover{transform:scale(1.15);border-color:rgba(255,255,255,.5);z-index:1}
.color-input-hidden{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}

/* ---- SECTION MANAGER MODAL ---- */
.sec-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}
.sec-modal.on{display:flex}
.sec-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:460px;max-height:80%;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.sec-header{padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.sec-header h3{font-size:15px;font-weight:700;color:#fff}
.sec-header-sub{font-size:12px;color:rgba(255,255,255,.3);margin-top:2px}
.sec-close-x{background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;line-height:1}
.sec-list{flex:1;overflow-y:auto;padding:10px 12px}
.sec-list::-webkit-scrollbar{width:3px}
.sec-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
.sec-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.06);margin-bottom:6px;background:rgba(255,255,255,.02);transition:background .15s}
.sec-item:hover{background:rgba(255,255,255,.04)}
.sec-name{flex:1;font-size:13px;font-weight:600;color:rgba(255,255,255,.7)}
.sec-tag{font-size:10px;color:rgba(255,255,255,.2);background:rgba(255,255,255,.05);padding:2px 7px;border-radius:4px;font-family:monospace}
.sec-btn{background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.4);border-radius:6px;width:26px;height:26px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.sec-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.sec-btn.eye-off{color:rgba(255,255,255,.15)}
.sec-item.hidden-sec .sec-name{opacity:.35;text-decoration:line-through}
.sec-footer{padding:12px 16px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}
.sec-refresh{width:100%;background:rgba(45,122,58,.15);border:1px solid rgba(45,122,58,.3);color:#4ade80;border-radius:8px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.sec-refresh:hover{background:rgba(45,122,58,.25)}

/* Image slot picker modal */
.slot-modal{display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);align-items:center;justify-content:center;padding:20px}
.slot-modal.on{display:flex}
.slot-box{background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:20px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.5)}
.slot-header{padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.slot-header h3{font-size:16px;font-weight:700;color:#fff;letter-spacing:-.3px}
.slot-header-sub{font-size:12px;color:rgba(255,255,255,.3);margin-top:2px}
.slot-close-x{background:none;border:none;color:rgba(255,255,255,.35);font-size:20px;cursor:pointer;line-height:1;padding:0}
.slot-body{padding:20px 24px}
.slot-drop{border:2px dashed rgba(45,122,58,.4);border-radius:14px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(45,122,58,.04);margin-bottom:14px}
.slot-drop:hover,.slot-drop.drag{border-color:#3dba52;background:rgba(45,122,58,.12)}
.slot-drop-icon{font-size:36px;display:block;margin-bottom:10px}
.slot-drop-text{font-size:14px;font-weight:600;color:rgba(255,255,255,.6);margin-bottom:4px}
.slot-drop-sub{font-size:12px;color:rgba(255,255,255,.25)}
.slot-divider{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.slot-divider::before,.slot-divider::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.07)}
.slot-divider span{font-size:11px;color:rgba(255,255,255,.2);font-weight:600}
.slot-lib-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px}
.slot-lib-thumb{aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s}
.slot-lib-thumb:hover{border-color:#3dba52;transform:scale(1.05)}
.slot-lib-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.slot-lib-empty{font-size:12px;color:rgba(255,255,255,.25);text-align:center;padding:8px 0}
.slot-upload-btn{width:100%;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.slot-upload-btn:hover{background:#3dba52}

/* ---- DEPLOY MODAL ---- */
.deploy-modal{display:none;position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:20px}
.deploy-modal.on{display:flex}
.deploy-box{background:#fff;border-radius:20px;width:100%;max-width:580px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.2);max-height:90%;overflow-y:auto}
.deploy-header{padding:24px 28px 20px;border-bottom:1px solid #e5e7eb}
.deploy-header h2{font-size:20px;font-weight:800;color:#0f1a0d;letter-spacing:-.5px;margin-bottom:4px}
.deploy-header p{font-size:14px;color:#666}
.deploy-tabs{display:flex;border-bottom:1px solid #e5e7eb;background:#f9fafb}
.d-tab{flex:1;padding:12px;text-align:center;font-size:13px;font-weight:600;color:#888;border:none;background:transparent;cursor:pointer;font-family:inherit;position:relative;transition:color .15s}
.d-tab.active{color:#2d7a3a;background:#fff}
.d-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#2d7a3a}
.deploy-pane{display:none;padding:24px 28px}
.deploy-pane.active{display:block}
.d-wizard-step{padding:0}
.d-step-badge{display:inline-block;background:#e8f5e9;color:#2d7a3a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.d-step-title{font-size:17px;font-weight:800;color:#0f1a0d;margin-bottom:6px;letter-spacing:-.3px}
.d-step-desc{font-size:14px;color:#555;margin-bottom:18px;line-height:1.6}
.d-step-next{background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;width:100%}
.d-step-next:hover{background:#3dba52}
.d-step-next:disabled{opacity:.5;cursor:not-allowed}
.d-step-back{background:#f5f5f5;color:#555;border:none;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;font-family:inherit}
.d-step-back:hover{background:#e8e8e8}
.d-input-row{margin-bottom:12px}
.d-label{font-size:12px;font-weight:600;color:#555;margin-bottom:5px;display:flex;align-items:center;gap:6px}
.d-label a{color:#2d7a3a;font-size:11px}
.d-input{width:100%;border:1.5px solid #ddd;border-radius:8px;padding:9px 12px;font-size:14px;font-family:inherit;color:#111;outline:none;transition:border .15s}
.d-input:focus{border-color:#2d7a3a;box-shadow:0 0 0 3px rgba(45,122,58,.1)}
.d-btn{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.d-btn-n{background:#00c7b7;color:#fff}.d-btn-n:hover:not(:disabled){background:#00a89c;transform:translateY(-1px)}
.d-btn-cf{background:#f6821f;color:#fff}.d-btn-cf:hover:not(:disabled){background:#d86e15;transform:translateY(-1px)}
.d-btn:disabled{opacity:.5;cursor:not-allowed}
.d-result{background:#f0faf2;border:1.5px solid #c8e8c4;border-radius:10px;padding:14px;margin-top:12px;display:none}
.d-result.on{display:block}
.d-result-url{font-size:14px;font-weight:700;color:#0f1a0d;word-break:break-all;text-align:center}
.d-result-url a{color:#2d7a3a;text-decoration:none}
.d-result-url a:hover{text-decoration:underline}
.d-result-sub{font-size:12px;color:#666;margin-top:4px;text-align:center}
.d-error{background:#fff5f5;border:1.5px solid #fca5a5;border-radius:10px;padding:12px;margin-top:12px;font-size:13px;color:#dc2626;display:none}
.d-error.on{display:block}
.d-steps{list-style:none;display:flex;flex-direction:column;gap:14px}
.d-step{display:flex;gap:12px;align-items:flex-start}
.d-step-n{width:24px;height:24px;border-radius:7px;background:#f0faf2;border:1.5px solid #c8e8c4;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#2d7a3a;flex-shrink:0}
.d-step-txt{font-size:14px;color:#333;line-height:1.6}
.d-step-txt strong{display:block;font-weight:700;color:#0f1a0d;margin-bottom:1px}
.d-step-txt code{background:#f5f5f5;border-radius:4px;padding:1px 6px;font-size:12px;font-family:monospace;color:#c41d7f}
.d-guide-link{display:block;text-align:center;margin-top:16px;font-size:13px;color:#2d7a3a;text-decoration:none;font-weight:600}
.d-guide-link:hover{text-decoration:underline}
.d-provider-card{border:1.5px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:16px;position:relative}
.d-provider-card.recommended{border-color:#2d7a3a;background:#f0faf2}
.d-rec-badge{position:absolute;top:-1px;right:14px;background:#2d7a3a;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:0 0 8px 8px}
.d-prov-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.d-prov-logo{font-size:22px}
.d-prov-name{font-size:16px;font-weight:800;color:#0f1a0d}
.d-prov-sub{font-size:12px;color:#888;margin-top:1px}
.d-features{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.d-features li{font-size:13px;color:#444;display:flex;align-items:center;gap:7px}
.d-features li::before{content:'v';color:#2d7a3a;font-weight:700;font-size:12px}

/* ---- DEPLOY WIZARD STEP URL PREVIEW ---- */
#sitePreviewUrl{color:#00c7b7}

/* ---- RESPONSIVE ---- */
.s-mobtabs{display:none;gap:6px;padding:8px 10px;background:#0a1208;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}
.s-mobtab{flex:1;background:rgba(255,255,255,.05);color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px}
.s-mobtab.active{background:rgba(45,122,58,.2);color:#4ade80;border-color:rgba(45,122,58,.4)}
@media(max-width:860px){
  .nav-links{display:none}
  .how-grid,.compare-grid,.price-grid{grid-template-columns:1fr 1fr}
  .type-grid{grid-template-columns:repeat(5,1fr)}
  .detail-grid{grid-template-columns:1fr}
  .detail-grid .span2{grid-column:1}
  .summary-grid{grid-template-columns:1fr}
  .s-header{gap:6px;padding:0 8px}
  .s-title{display:none}
  .s-sep{display:none}
  .s-actions{margin-left:0;flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
  .s-actions::-webkit-scrollbar{display:none}
  .s-mobtabs{display:flex}
  .s-body{flex-direction:column}
  .chat{width:100%;border-left:none;border-top:1px solid rgba(255,255,255,.06)}
  .s-body .chat{display:none}
  .s-body.mob-chat .chat{display:flex;flex:1}
  .s-body.mob-chat .preview-frame-wrap{display:none}
  .preview-frame-wrap{flex:1}
  .hero-stat{padding:12px 14px}
  .hero-stats{max-width:100%}
  .img-mobile-upload{display:flex}
}
@media(max-width:600px){
  .type-grid{grid-template-columns:repeat(3,1fr)}
  .how-grid,.compare-grid,.price-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>

<div class="toast" id="toast"></div>

<nav>
  <a href="/" class="nav-logo">
    <div class="nav-logo-mark"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    <span class="lw">Web<em>sprout</em></span>
  </a>
  <ul class="nav-links">
    <li><a href="#how">How it works</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#" onclick="if(window.openMySites){openMySites();}return false;">My sites</a></li>
    <li><a href="/deploy-guide" target="_blank">Deploy guide</a></li>
  </ul>
  <button class="nav-cta" id="signInBtn" style="background:transparent;border:1px solid rgba(255,255,255,.18);color:#fff;margin-right:8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Sign in</button>
  <button class="nav-cta" id="navCta">Build for free &#8594;</button>
</nav>

<div class="hero" id="hero">
  <div class="hero-pill">
    <div class="hero-pill-dot">&#127807;</div>
    Free to generate &amp; preview
  </div>
  <h1>Plant an idea.<br><em>Grow a website.</em></h1>
  <p class="hero-sub">Describe your business. Get a complete, professional, multi-page website in seconds.</p>

  <div class="ex-wrap">
    <div class="ex-label">New here? Tap an example and watch it build &#8595;</div>
    <div class="ex-row">
      <button class="ex-chip" data-ex="cozy neighborhood coffee shop and bakery" data-style="warm and friendly"><span class="ex-emoji">&#9749;</span>Coffee shop</button>
      <button class="ex-chip" data-ex="wedding and portrait photography studio" data-style="clean and professional"><span class="ex-emoji">&#128247;</span>Photographer</button>
      <button class="ex-chip" data-ex="personal training and fitness coaching business" data-style="bold and colorful"><span class="ex-emoji">&#128170;</span>Personal trainer</button>
      <button class="ex-chip" data-ex="modern dental clinic" data-style="clean and professional"><span class="ex-emoji">&#129463;</span>Dental clinic</button>
      <button class="ex-chip" data-ex="SaaS app for team productivity" data-style="dark and premium"><span class="ex-emoji">&#128640;</span>SaaS app</button>
    </div>
  </div>

  <div class="hero-stats">
    <div class="hero-stat">
      <div class="stat-n" id="liveCount">715</div>
      <div class="stat-l">Sites grown</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">~18s</div>
      <div class="stat-l">Avg grow time</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">$10</div>
      <div class="stat-l">per month</div>
    </div>
    <div class="hero-stat">
      <div class="stat-n">Free</div>
      <div class="stat-l">To preview</div>
    </div>
  </div>

  <!-- BUILDER CARD -->
  <div class="builder-wrap" id="builder">
    <div class="builder-label">&#8594; Describe your website &mdash; watch it grow</div>
    <div class="builder-card">
      <div class="step-tabs">
        <button class="step-tab active" id="tab1"><span class="step-n">1</span>Site type</button>
        <button class="step-tab" id="tab2"><span class="step-n">2</span>Details</button>
        <button class="step-tab" id="tab3"><span class="step-n">3</span>Generate</button>
      </div>

      <div class="panel active" id="panel1">
        <div class="panel-q">Describe your website</div>
        <textarea id="customPrompt" class="dark-input describe-box" rows="4" placeholder="Tell us about your business in your own words — what you do, who it's for, the vibe you want, and anything you'd like on the site.

e.g. A cozy neighborhood coffee shop and bakery in Austin. Warm and friendly. Show our menu, our story, hours, and a contact form."></textarea>
        <div class="describe-vibe">
          <span class="describe-vibe-lbl">Vibe</span>
          <div class="vibe-row">
            <button class="vibe-chip" data-style="modern and minimal">Modern</button>
            <button class="vibe-chip" data-style="bold and colorful">Bold</button>
            <button class="vibe-chip" data-style="warm and friendly">Warm</button>
            <button class="vibe-chip" data-style="dark and premium">Premium</button>
            <button class="vibe-chip" data-style="clean and professional">Professional</button>
            <button class="vibe-chip" data-style="fun and playful">Playful</button>
          </div>
        </div>
        <div class="panel-foot">
          <span class="p-hint">Free to generate &amp; preview</span>
          <button class="gen-btn" id="next1"><span>Grow my site</span><span>&#127807;</span></button>
        </div>
      </div>

      <div class="panel" id="panel2">
        <div class="panel-q">Tell us a bit more <span style="color:rgba(255,255,255,.25);font-weight:400">(all optional)</span></div>
        <div class="detail-grid">
          <div>
            <div class="field-lbl">Business name</div>
            <input id="bizName" class="dark-input" type="text" placeholder="Leave blank - AI will create one">
          </div>
          <div>
            <div class="field-lbl">Specific requests</div>
            <input id="bizExtra" class="dark-input" type="text" placeholder="Dark theme, add pricing...">
          </div>
        </div>
        <div class="panel-foot">
          <button class="btn-back" id="back2">&#8592; Back</button>
          <button class="btn-next on" id="next2">Continue &#8594;</button>
        </div>
      </div>

      <div class="panel" id="panel3">
        <div id="gen-area">
          <div class="panel-q">Ready to grow</div>
          <div class="summary-grid" id="summaryGrid"></div>
          <button class="gen-btn" id="gbtn"><span id="gbtnTxt">Grow my site</span><span>&#127807;</span></button>
        </div>
        <div class="loading" id="loading">
          <div class="load-icon">&#127807;</div>
          <div class="load-txt" id="loadTxt">Planting your prompt...</div>
        </div>
        <div class="load-bar" id="loadBar" style="display:none"><div class="load-fill"></div></div>
        <div class="panel-foot" id="p3foot">
          <button class="btn-back" id="back3">&#8592; Back</button>
          <span class="p-hint">Usually 15-20 seconds</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="trust-item"><span class="trust-icon">&#9989;</span> No credit card to preview</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> 4 real pages generated</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Download the source code</div>
  <div class="trust-item"><span class="trust-icon">&#9989;</span> Deploy anywhere free</div>
</div>

<!-- HOW IT WORKS -->
<div class="how" id="how">
  <div class="how-inner">
    <div class="section-eyebrow">How it works</div>
    <div class="section-title">From seed to site in 3 steps.</div>
    <div class="how-grid">
      <div class="how-card">
        <div class="how-step-num">1</div>
        <h3>Plant your idea</h3>
        <p>Pick your site type, add a style vibe, and any specifics. Or leave it blank and let the AI grow something great.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">2</div>
        <h3>Watch it grow</h3>
        <p>Our AI builds a complete 4-page website with real copy, working navigation, and a contact form. Chat to refine anything.</p>
      </div>
      <div class="how-card">
        <div class="how-step-num">3</div>
        <h3>Harvest your sites</h3>
        <p>Go Pro for $10/month to download the full source code and deploy free on Netlify or Cloudflare Pages — across all your sites. Cancel anytime.</p>
      </div>
    </div>
  </div>
</div>

<!-- COMPARE -->
<div class="compare">
  <div class="compare-inner">
    <div class="section-eyebrow">Why Websprout</div>
    <div class="section-title">Grow more for less.</div>
    <div class="compare-grid">
      <div class="cmp-card highlight">
        <div class="cmp-head">&#127807; Websprout <span class="cmp-badge">You're here</span></div>
        <ul class="cmp-list">
          <li class="cmp-item">4-page site built in under 20 seconds</li>
          <li class="cmp-item">Preview free, forever</li>
          <li class="cmp-item">$10/month - cancel anytime</li>
          <li class="cmp-item">Download your code &amp; deploy anywhere</li>
          <li class="cmp-item">Deploy anywhere for free</li>
          <li class="cmp-item">Chat with AI to change anything</li>
        </ul>
      </div>
      <div class="cmp-card">
        <div class="cmp-head" style="color:rgba(255,255,255,.4)">Other builders</div>
        <ul class="cmp-list">
          <li class="cmp-item no">$15-40 per month, forever</li>
          <li class="cmp-item no">Locked into their platform</li>
          <li class="cmp-item no">Can't export your code</li>
          <li class="cmp-item no">Cookie-cutter templates</li>
          <li class="cmp-item no">No AI to help you edit</li>
          <li class="cmp-item no">Complex drag-and-drop editor</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- PRICING -->
<div class="pricing" id="pricing">
  <div class="pricing-inner">
    <div class="section-eyebrow">Pricing</div>
    <div class="section-title">Plant for free. Harvest for $10.</div>
    <p style="color:#888;font-size:15px">Generate and preview your site free. Pay only when you love what grew.</p>
    <div class="price-grid">
      <div class="price-card">
        <div class="price-name">Free</div>
        <div class="price-amt">$0</div>
        <div class="price-freq">always free to grow</div>
        <ul class="price-list">
          <li class="price-item">Unlimited generations</li>
          <li class="price-item">4-page live preview</li>
          <li class="price-item">AI chat to refine</li>
          <li class="price-item dim">Download source code</li>
        </ul>
      </div>
      <div class="price-card pick">
        <div class="price-name">Pro</div>
        <div class="price-amt"><sup>$</sup>10</div>
        <div class="price-freq">per month &middot; unlimited</div>
        <ul class="price-list">
          <li class="price-item">Unlimited sites</li>
          <li class="price-item">Edit &amp; download anytime</li>
          <li class="price-item">Deploy anywhere</li>
          <li class="price-item">Cancel anytime</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- CTA BAND -->
<div class="cta-band">
  <h2>Your website is one<br>seed away.</h2>
  <p>Free to plant. Free to preview. $10/month to harvest.</p>
  <button class="btn-white" id="ctaBtn">Plant my website free &#127807;</button>
</div>

<footer>
  <a href="/" class="foot-logo">
    <div class="nav-logo-mark" style="width:26px;height:26px"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><path d="M12 21V12" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><path d="M12 14.5C10.4 9.8 6.2 7.6 3 8.2C3.4 13 7.6 15.5 12 14.5Z" fill="#fff"/><path d="M12 13C13.5 8.2 17.8 6 21 6.6C20.6 11.4 16.4 13.9 12 13Z" fill="#fff"/></svg></div>
    <span class="lw">Web<em>sprout</em></span>
  </a>
  <div class="foot-links">
    <span style="color:rgba(255,255,255,.18);font-size:13px">&#169; 2026 Websprout</span>
    <a href="/terms" target="_blank">Terms</a>
    <a href="/privacy" target="_blank">Privacy</a>
    <a href="/deploy-guide" target="_blank">Deploy guide</a>
    <a href="mailto:support@websprout.app">Contact</a>
  </div>
</footer>
<div class="studio" id="studio">
  <div class="s-header">
    <div class="logo-mark" style="width:24px;height:24px;font-size:12px">🌱</div>
    <div class="s-title" id="stitle">Your site</div>
    <div class="live-dot"></div>
    <div class="device-btns">
      <button class="dev-btn active" id="devDesktop" title="Desktop"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></button>
      <button class="dev-btn" id="devTablet" title="Tablet"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg></button>
      <button class="dev-btn" id="devMobile" title="Mobile"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg></button>
    </div>
    <div class="s-actions">
      <span class="edit-counter" id="editCounter"></span>
      <button class="s-btn s-ghost edit-mode-btn" id="editModeBtn" data-needs-site="1" title="Click any text to edit it">&#9998; Edit text</button>
      <span style="position:relative;display:inline-block">
        <button class="s-btn s-ghost" id="toolsBtn" title="More editing tools">&#9881;&#65039; Tools &#9662;</button>
        <div id="toolsMenu" class="s-menu" style="display:none">
          <button class="gs-item" data-tool="yourInfoBtn">&#128221; Your info<span class="gs-sub">Name, phone, email &amp; hours — everywhere</span></button>
          <button class="gs-item" data-tool="sectionsBtn">&#9783; Manage sections<span class="gs-sub">Add, remove or reorder</span></button>
          <button class="gs-item" data-tool="seoBtn">&#128269; SEO &amp; sharing<span class="gs-sub">Title, description, social preview</span></button>
          <button class="gs-item" data-tool="regenBtn">&#8635; Regenerate the design</button>
          <button class="gs-item" data-tool="backBtn">&#8592; Start over</button>
        </div>
      </span>
      <span id="editTools" style="display:none">
        <button class="s-btn s-ghost" id="yourInfoBtn" data-needs-site="1">&#128221; Your info</button>
        <button class="s-btn s-ghost" id="sectionsBtn" data-needs-site="1">&#9783; Sections</button>
        <button class="s-btn s-ghost" id="seoBtn" data-needs-site="1">&#128269; SEO</button>
        <button class="s-btn s-ghost" id="backBtn">&#8592; Back</button>
        <button class="s-btn s-ghost" id="regenBtn">&#8635; Regen</button>
      </span>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost" id="undoBtn" disabled>&#8617; Undo</button>
      <button class="s-btn s-ghost" id="redoBtn" disabled>&#8618; Redo</button>
      <button class="s-btn s-ghost" id="fullscreenBtn" data-needs-site="1" title="Full screen preview">&#9974; Preview</button>
      <span class="s-sep"></span>
      <button class="s-btn s-ghost s-icon" id="mySitesBtn" title="Your saved sites">&#128194;</button>
      <button class="s-btn s-ghost" id="acctBtn" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="Your account">&#128100; Sign in</button>
      <span id="outActions" style="display:none">
      <button class="s-btn s-ghost" id="shareBtn" data-needs-site="1">&#128279; Share</button>
      <button class="s-btn" id="publishBtn" data-needs-site="1">&#127760; Publish</button>
      <button class="s-btn s-ghost" id="dlBtn" data-needs-site="1">&#8595; Download</button>
      <button class="s-btn s-ghost" id="copyBtn" data-needs-site="1" title="Copy full HTML to clipboard">&#128203; Copy code</button>
      <button class="s-btn s-ghost" id="deployBtn" data-needs-site="1">&#128640; Deploy</button>
      </span>
      <style>.gs-item{display:block;width:100%;text-align:left;background:none;border:none;color:#fff;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}.gs-item:hover{background:rgba(45,122,58,.18)}.gs-sub{display:block;font-size:11px;color:rgba(255,255,255,.4);font-weight:400;margin-top:1px}.s-sep{width:1px;height:20px;background:rgba(255,255,255,.1);margin:0 3px;flex-shrink:0;align-self:center}.s-menu{position:absolute;top:calc(100% + 6px);right:0;background:#0f1a0d;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;min-width:218px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:1000}.s-icon{padding:6px 9px}</style>
      <span style="position:relative;display:inline-block">
        <button class="s-btn" id="getSiteBtn" data-needs-site="1" style="background:#2d7a3a;color:#fff;border-color:#2d7a3a;font-weight:700" title="Publish, download or share your site">&#128640; Get your site &#9662;</button>
        <div id="getSiteMenu" style="display:none;position:absolute;top:calc(100% + 6px);right:0;background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:12px;padding:6px;min-width:212px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:1000">
          <button class="gs-item" data-act="publish">&#127760; Publish online<span class="gs-sub">Free name.websprout.app address</span></button>
          <button class="gs-item" data-act="download">&#8595; Download code<span class="gs-sub">Get the full HTML file</span></button>
          <button class="gs-item" data-act="copy">&#128203; Copy code</button>
          <button class="gs-item" data-act="deploy">&#128640; Deploy to Netlify / Cloudflare</button>
          <button class="gs-item" data-act="share">&#128279; Share preview link</button>
        </div>
      </span>
      <button class="s-btn s-purple" id="unlockBtn">&#10024; Go Pro &middot; $10/mo</button>
    </div>
  </div>
  <!-- Deploy CTA banner (shown after purchase) -->
  <div class="deploy-cta-banner" id="deployCtaBanner">
    <div style="font-size:20px">&#128640;</div>
    <div class="deploy-cta-banner-text"><span>Site unlocked!</span> Get it live free on Netlify in about 10 seconds.</div>
    <button class="deploy-cta-banner-btn" id="deployCtaBtn">Deploy now &#8594;</button>
    <button class="deploy-cta-dismiss" id="deployCtaDismiss">&#10005;</button>
  </div>
  <div class="pub-modal" id="pubModal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
    <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
        <div style="font-size:17px;font-weight:800;color:#fff">&#127760; Publish your site</div>
        <button id="pubClose" style="background:none;border:none;color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;line-height:1">&times;</button>
      </div>
      <div style="padding:22px">
        <div id="pubStep1">
          <label style="display:block;font-size:13px;font-weight:600;color:rgba(255,255,255,.6);margin-bottom:8px">Choose your free web address</label>
          <div style="display:flex;align-items:center;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;overflow:hidden">
            <input id="pubSlug" type="text" placeholder="your-business" autocomplete="off" style="flex:1;background:none;border:none;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;min-width:0">
            <span style="color:rgba(255,255,255,.4);padding:0 14px;font-size:14px;white-space:nowrap">.websprout.app</span>
          </div>
          <div id="pubAvail" style="font-size:13px;margin-top:8px;min-height:18px"></div>
          <button id="pubGo" style="width:100%;margin-top:14px;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit">Publish live &#8594;</button>
        </div>
        <div id="pubStep2" style="display:none">
          <div style="background:rgba(45,122,58,.1);border:1px solid rgba(45,122,58,.25);border-radius:14px;padding:18px;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#4ade80;font-weight:700;letter-spacing:.4px;text-transform:uppercase;margin-bottom:11px"><span style="width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.16)"></span>Live now</div>
            <a id="pubUrl" href="#" target="_blank" style="display:block;color:#fff;font-size:18px;font-weight:800;text-decoration:none;word-break:break-all;line-height:1.3"></a>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <button id="pubOpen" style="flex:1;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Visit site &#8599;</button>
            <button id="pubCopy" style="flex:1;background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Copy link</button>
          </div>
          <button id="pubUpdate" style="width:100%;background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">&#8635; Re-publish my latest edits</button>
          <div style="border-top:1px solid rgba(255,255,255,.07);margin-top:18px;padding-top:18px">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">Use your own domain</div>
            <div style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:10px">Find one, buy it on GoDaddy, then point it here.</div>
            <div style="display:flex;gap:8px">
              <input id="domInput" type="text" placeholder="yourbusiness.com" autocomplete="off" style="flex:1;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:9px;color:#fff;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;min-width:0">
              <button id="domCheck" style="background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Check</button>
            </div>
            <div id="domResult" style="font-size:13px;margin-top:10px;line-height:1.5"></div>
          </div>
          <div style="text-align:center;margin-top:16px"><button id="pubUnpub" style="background:none;border:none;color:rgba(255,255,255,.32);font-size:12px;cursor:pointer;font-family:inherit">Take this site offline</button></div>
        </div>
      </div>
    </div>
  </div>
  <script>
  (function(){
    function $(id){return document.getElementById(id);}
    var modal=$('pubModal');if(!modal)return;
    var slugIn=$('pubSlug'),avail=$('pubAvail'),goBtn=$('pubGo');
    function site(){return window._wsSite||localStorage.getItem('ws_site')||'';}
    function key(){return window._wsKey||localStorage.getItem('ws_key')||'';}
    function curHtml(){try{return localStorage.getItem('wsh')||'';}catch(e){return '';}}
    function isUnlocked(){try{return sessionStorage.getItem('wsu')==='1';}catch(e){return false;}}
    function pslug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);}
    function bizName(){
      try{var info=JSON.parse(localStorage.getItem('ws_info_'+site())||'{}');if(info.brand)return info.brand;}catch(e){}
      try{var pf=$('pf');var d=pf&&(pf.contentDocument||pf.contentWindow.document);if(d){var bd=d.querySelector('[data-ws-field="brand"]');if(bd&&bd.textContent.trim())return bd.textContent.trim();}}catch(e){}
      var h=curHtml();var a=h.indexOf('<title>'),z=h.indexOf('</title>');if(a>-1&&z>a){var tt=h.slice(a+7,z).split('|')[0].trim();if(tt)return tt;}
      var st=$('stitle');return st?st.textContent:'';
    }
    function defSlug(){return pslug(bizName())||'my-site';}
    function savedSlug(){try{return localStorage.getItem('ws_slug_'+site())||'';}catch(e){return '';}}
    function showLive(slug){
      window._wsSlug=slug;
      var pathUrl='https://websprout.app/s/'+slug,subUrl='https://'+slug+'.websprout.app';
      window._wsSub=subUrl;window._wsLive=pathUrl;
      var u=$('pubUrl');u.textContent=pathUrl.replace('https://','');u.href=pathUrl;
      $('pubStep1').style.display='none';$('pubStep2').style.display='block';
      var probed=false;var pto=setTimeout(function(){probed=true;},3500);
      fetch(subUrl,{mode:'no-cors',cache:'no-store'}).then(function(){if(probed)return;probed=true;clearTimeout(pto);window._wsLive=subUrl;u.textContent=subUrl.replace('https://','');u.href=subUrl;}).catch(function(){});
    }
    var pubBtn=$('publishBtn');
    if(pubBtn)pubBtn.addEventListener('click',function(){
      if(!curHtml()||curHtml().length<50){if(window.toast)toast('Generate a site first');return;}
      if(!isUnlocked()){var u=$('unlockBtn');if(u)u.click();return;}
      modal.style.display='flex';
      var sv=savedSlug();
      if(sv){showLive(sv);}
      else{$('pubStep1').style.display='block';$('pubStep2').style.display='none';if(!slugIn.value)slugIn.value=defSlug();checkSlug();}
    });
    $('pubClose').addEventListener('click',function(){modal.style.display='none';});
    modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
    var tmr=null;
    slugIn.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(checkSlug,350);});
    function checkSlug(){
      var s=pslug(slugIn.value);
      if(s!==slugIn.value)slugIn.value=s;
      if(s.length<3){avail.innerHTML='<span style="color:rgba(255,255,255,.4)">At least 3 characters</span>';goBtn.disabled=true;return;}
      avail.innerHTML='<span style="color:rgba(255,255,255,.4)">Checking...</span>';
      fetch('/slug-check?slug='+encodeURIComponent(s)+'&siteId='+encodeURIComponent(site())).then(function(r){return r.json();}).then(function(j){
        if(j.available){avail.innerHTML='<span style="color:#4ade80">&#10003; '+s+'.websprout.app is yours</span>';goBtn.disabled=false;}
        else{
          goBtn.disabled=true;
          var ideas=[s+'-co',s+'-online',s+'-'+Math.random().toString(36).slice(2,4)];
          var chips='';for(var ci=0;ci<ideas.length;ci++){chips+='<button class="slug-sug" data-s="'+ideas[ci]+'" style="background:rgba(45,122,58,.16);border:1px solid rgba(45,122,58,.32);color:#4ade80;border-radius:6px;padding:3px 9px;font-size:12px;cursor:pointer;font-family:inherit;margin:0 4px 0 0">'+ideas[ci]+'</button>';}
          avail.innerHTML='<span style="color:#f87171">'+(j.reason==='reserved'?'That name is reserved':'That name is taken')+'</span> <span style="color:rgba(255,255,255,.4)">— try one of these:</span><div style="margin-top:6px">'+chips+'</div>';
          var sgs=avail.querySelectorAll('.slug-sug');for(var sk=0;sk<sgs.length;sk++){sgs[sk].addEventListener('click',function(){slugIn.value=this.getAttribute('data-s');checkSlug();});}
        }
      }).catch(function(){avail.innerHTML='';goBtn.disabled=false;});
    }
    goBtn.addEventListener('click',function(){
      var s=slugIn.value;if(s.length<3)return;
      goBtn.textContent='Publishing...';goBtn.disabled=true;
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:curHtml(),slug:s,siteId:site(),key:key()})}).then(function(r){return r.json();}).then(function(j){
        goBtn.textContent='Publish live \u2192';goBtn.disabled=false;
        if(j.error){avail.innerHTML='<span style="color:#f87171">'+j.error+'</span>';return;}
        try{localStorage.setItem('ws_slug_'+site(),j.slug);}catch(e){}
        showLive(j.slug);
      }).catch(function(){goBtn.textContent='Publish live \u2192';goBtn.disabled=false;avail.innerHTML='<span style="color:#f87171">Could not publish — please try again</span>';});
    });
    $('pubCopy').addEventListener('click',function(){var u=window._wsLive||$('pubUrl').textContent;if(navigator.clipboard)navigator.clipboard.writeText(u);if(window.toast)toast('Link copied!');});
    $('pubOpen').addEventListener('click',function(){window.open(window._wsLive||$('pubUrl').textContent,'_blank');});
    $('pubUpdate').addEventListener('click',function(){
      var btn=this,orig=btn.innerHTML;btn.textContent='Re-publishing...';
      fetch('/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:curHtml(),slug:window._wsSlug,siteId:site(),key:key()})}).then(function(r){return r.json();}).then(function(j){btn.innerHTML=orig;if(window.toast)toast(j.error?j.error:'\u2713 Updated — your live site now shows your latest edits.');}).catch(function(){btn.innerHTML=orig;if(window.toast)toast('Could not update — please try again');});
    });
    var unpubBtn=$('pubUnpub');
    if(unpubBtn)unpubBtn.addEventListener('click',function(){
      if(!confirm('Take your site offline? The link will stop working until you publish it again.'))return;
      var self=this;self.textContent='Taking offline...';
      fetch('/unpublish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:window._wsSlug,siteId:site(),key:key()})}).then(function(r){return r.json();}).then(function(j){
        self.textContent='Take this site offline';
        if(j&&j.ok){try{localStorage.removeItem('ws_slug_'+site());}catch(e){}modal.style.display='none';if(window.toast)toast('Your site is now offline.');}
        else if(window.toast)toast((j&&j.error)||'Could not take it offline');
      }).catch(function(){self.textContent='Take this site offline';if(window.toast)toast('Could not take it offline');});
    });
    $('domCheck').addEventListener('click',function(){
      var d=$('domInput').value.trim();var res=$('domResult');if(!d)return;
      res.innerHTML='<span style="color:rgba(255,255,255,.4)">Checking...</span>';
      fetch('/api/domain-check?domain='+encodeURIComponent(d)).then(function(r){return r.json();}).then(function(j){
        var buy='<a href="'+(j.buyUrl||'https://www.godaddy.com')+'" target="_blank" style="color:#4ade80;font-weight:700;text-decoration:none">Buy on GoDaddy &#8594;</a>';
        var status='';
        if(j.available===true)status='<span style="color:#4ade80">&#10003; '+j.domain+' is available'+(j.price?(' (about $'+j.price.toFixed(2)+'/yr)'):'')+'</span><br>';
        else if(j.available===false)status='<span style="color:#f87171">'+j.domain+' is taken</span><br>';
        res.innerHTML=status+buy+'<div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:8px">After buying, add a CNAME record pointing to <b style="color:#fff">'+(window._wsSlug||'your-site')+'.websprout.app</b> to connect it.</div>';
      }).catch(function(){res.innerHTML='<a href="https://www.godaddy.com/domainsearch/find?domainToCheck='+encodeURIComponent(d)+'" target="_blank" style="color:#4ade80;font-weight:700">Search on GoDaddy &#8594;</a>';});
    });
  })();
  </script>
  <div class="s-mobtabs" id="sMobTabs">
    <button class="s-mobtab active" data-mob="preview">&#128065;&#65039; Preview</button>
    <button class="s-mobtab" data-mob="chat">&#9998; Edit with AI</button>
  </div>
  <script>
  (function(){
    var tabs=document.getElementById('sMobTabs');if(!tabs)return;
    var studio=document.getElementById('studio');
    var body=studio?studio.querySelector('.s-body'):null;
    var bs=tabs.querySelectorAll('.s-mobtab');
    for(var i=0;i<bs.length;i++){bs[i].addEventListener('click',function(){
      var mode=this.getAttribute('data-mob');
      for(var j=0;j<bs.length;j++)bs[j].classList.remove('active');
      this.classList.add('active');
      if(body){if(mode==='chat')body.classList.add('mob-chat');else body.classList.remove('mob-chat');}
    });}
  })();
  </script>
  <div class="s-body">
    <div class="preview-frame-wrap" id="previewWrap">
      <iframe id="pf" style="width:100%;height:4000px;border:none;display:block;background:#fff"></iframe>
      <div class="preview-label">live preview</div>
      <!-- Loading skeleton -->
      <div class="skeleton-wrap" id="skelWrap">
        <div class="skel-inner">
          <div class="skel-logo">
            <div class="skel-logo-mark">&#127807;</div>
            <div class="skel-logo-text"><span class="lw">Web<em>sprout</em></span></div>
          </div>
          <div class="skel-msg" id="skelMsg">Planting your prompt...</div>
          <div class="skel-progress-track">
            <div class="skel-progress-fill" id="skelProgress"></div>
          </div>
          <div class="skel-build">
            <div class="skel-section">
              <div class="skel-nav-bar">
                <div class="skel-nav-dot"></div>
                <div class="skel-nav-links">
                  <div class="skel-nav-link"></div>
                  <div class="skel-nav-link"></div>
                  <div class="skel-nav-link"></div>
                </div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-hero-bar">
                <div class="skel-hero-lines">
                  <div class="skel-hero-h"></div>
                  <div class="skel-hero-sub"></div>
                </div>
                <div class="skel-hero-btn"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-cards-row">
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-text-row">
                <div class="skel-text-line w90"></div>
                <div class="skel-text-line w70"></div>
                <div class="skel-text-line w55"></div>
              </div>
            </div>
            <div class="skel-section">
              <div class="skel-cards-row">
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
                <div class="skel-card-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drop-overlay" id="dropOverlay"><div class="drop-overlay-txt">🌱 Drop photo to add to site</div></div>
      <div class="lock-badge" id="lkbadge">
        <div class="lock-title">🔒 Love what you see?</div>
        <div class="lock-sub">Go Pro for $10/month — download, deploy, and keep all your sites. Cancel anytime.</div>
        <input type="email" id="emailCapture" class="lock-email" placeholder="your@email.com">
        <button class="s-btn s-purple" style="width:100%;padding:10px;border-radius:8px;font-size:13px" id="lockPayBtn">Go Pro — $10/mo</button>
      </div>
    </div>

    <!-- Fullscreen overlay -->
    <div class="fs-overlay" id="fsOverlay">
      <div class="fs-bar">
        <div class="logo-mark" style="width:22px;height:22px;font-size:11px">🌱</div>
        <div class="fs-title" id="fsTitle">Full screen preview</div>
        <button class="fs-close" id="fsNewTab" style="margin-left:auto">&#8599; Open in new tab</button>
        <button class="fs-close" id="fsClose">✕ Exit full screen</button>
      </div>
      <iframe id="pfFull" style="border:none;width:100%;flex:1"></iframe>
    </div>

    <div class="chat">
      <div class="chat-head">
        <div class="chat-head-title">✨ Edit with AI</div>
        <div class="chat-head-sub">Describe any change in plain English and I’ll update your site live.</div>
      </div>
      <div class="chat-msgs" id="cms">
        <div class="msg msg-ai"><div class="msg-name">Websprout AI</div><div class="msg-body" id="introMsg">Building your site… this only takes a few seconds 🌱</div></div>
      </div>
      <div class="typing" id="tw"><div class="typing-bub"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>
      <!-- Image Library -->
      <div class="img-library collapsed" id="imgLibrary">
        <button class="img-lib-toggle" id="imgLibToggle" type="button">
          <span class="img-lib-label">📷 Add photos</span>
          <span class="img-lib-caret">▾</span>
        </button>
        <div class="img-lib-body" id="imgLibBody">
        <div class="img-lib-actions">
          <button class="img-upload-btn" id="imgUploadBtn">+ Add photo</button>
        </div>
        <!-- Mobile tap-to-upload (hidden on desktop) -->
        <div class="img-mobile-upload" id="imgMobileUpload" style="display:none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Tap to upload photo from gallery
        </div>
        <div class="img-dropzone empty" id="imgDropzone">
          📷 Drop photo here<br><span style="font-size:10px;opacity:.6">or use Add photo above</span>
        </div>
        <div class="img-grid" id="imgGrid" style="display:none"></div>
        <div class="img-actions" id="imgActions">
          <button class="img-action-btn" data-action="hero">🖼 Use as hero background</button>
          <button class="img-action-btn" data-action="about">👤 Use in about section</button>
          <button class="img-action-btn" data-action="section">📌 Add as section image</button>
          <button class="img-action-btn" data-action="cancel" style="color:rgba(255,255,255,.3)">✕ Cancel</button>
        </div>
        <input type="file" id="imgFileInput" accept="image/*" multiple>
        </div>
      </div>

      <!-- Business Info Panel -->
      <div class="biz-panel">
        <div class="biz-panel-header" id="bizPanelHeader">
          <span class="biz-panel-title">&#128222; Your business info</span>
          <span class="biz-panel-toggle" id="bizPanelToggle">&#9660;</span>
        </div>
        <div class="biz-fields" id="bizFields">
          <div class="biz-field">
            <label>Business name</label>
            <input class="biz-input" id="bizInfoName" placeholder="Acme Co.">
          </div>
          <div class="biz-field">
            <label>Email address</label>
            <input class="biz-input" id="bizInfoEmail" type="email" placeholder="hello@yourbusiness.com">
          </div>
          <div class="biz-field">
            <label>Phone number</label>
            <input class="biz-input" id="bizInfoPhone" placeholder="(555) 123-4567">
          </div>
          <div class="biz-field">
            <label>Address</label>
            <input class="biz-input" id="bizInfoAddress" placeholder="123 Main St, City, ST">
          </div>
          <div class="biz-field">
            <label>Booking link (Calendly, Cal.com, Square…)</label>
            <input class="biz-input" id="bizInfoBooking" placeholder="https://calendly.com/yourname">
            <span style="font-size:10px;color:rgba(255,255,255,.2);margin-top:2px;line-height:1.4">Paste your scheduler link — your "Book now" buttons will open it so visitors pick a real time slot</span>
          </div>
          <div class="biz-field">
            <label>Business hours</label>
            <input class="biz-input" id="bizInfoHours" placeholder="Mon–Fri 9–5, Sat 10–2">
          </div>
          <div class="biz-field">
            <label>Form submissions go to</label>
            <input class="biz-input" id="bizInfoForm" type="email" placeholder="you@email.com">
            <span style="font-size:10px;color:rgba(255,255,255,.2);margin-top:2px;line-height:1.4">Free via Formspree — confirm once, then all contact form submissions land in your inbox</span>
          </div>
          <button class="biz-apply" id="bizApplyBtn">&#10003; Apply to site</button>
        </div>
      </div>

      <!-- Design tools drawer (colors + fonts, collapsed by default) -->
      <div class="design-drawer collapsed" id="designDrawer">
      <button class="dd-toggle" id="ddToggle" type="button">
        <span class="palette-label" style="margin-bottom:0">🎨 Colors &amp; fonts</span>
        <span class="dd-caret">&#9660;</span>
      </button>
      <div class="dd-body">
      <!-- Live Color Panel -->
      <div class="live-color-panel">
        <div class="palette-label">&#127912; Site colors</div>
        <div class="live-color-grid" id="liveColorPanel">
          <div style="font-size:11px;color:rgba(255,255,255,.2)">Generate a site first</div>
        </div>
      </div>

      <!-- Font Picker -->
      <div class="font-section">
        <div class="palette-label">🔤 Typography</div>
        <div class="font-grid">
          <button class="font-btn" data-font="modern" data-stack="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
            <span class="font-btn-name">Modern</span><span class="font-btn-sample">Clean & minimal</span>
          </button>
          <button class="font-btn" data-font="humanist" data-stack="Optima,Candara,Geneva,Calibri,sans-serif">
            <span class="font-btn-name">Humanist</span><span class="font-btn-sample">Warm & friendly</span>
          </button>
          <button class="font-btn" data-font="classic" data-stack="Georgia,'Times New Roman',Times,serif">
            <span class="font-btn-name">Classic</span><span class="font-btn-sample">Editorial serif</span>
          </button>
          <button class="font-btn" data-font="mono" data-stack="'Courier New',Courier,monospace">
            <span class="font-btn-name">Monospace</span><span class="font-btn-sample">Technical & bold</span>
          </button>
          <button class="font-btn" data-font="rounded" data-stack="'Trebuchet MS',Verdana,Geneva,sans-serif">
            <span class="font-btn-name">Rounded</span><span class="font-btn-sample">Playful & soft</span>
          </button>
          <button class="font-btn" data-font="elegant" data-stack="Palatino,'Palatino Linotype',Book Antiqua,Georgia,serif">
            <span class="font-btn-name">Elegant</span><span class="font-btn-sample">Luxury & refined</span>
          </button>
        </div>
      </div>

      <!-- Color palette picker -->
      <div class="palette-section">
        <div class="palette-label">Quick color palette</div>
        <div class="palette-grid">
          <button class="pal" style="background:#2563eb" data-palette="ocean blue" title="Ocean Blue"></button>
          <button class="pal" style="background:#7c3aed" data-palette="deep purple" title="Deep Purple"></button>
          <button class="pal" style="background:#dc2626" data-palette="bold red" title="Bold Red"></button>
          <button class="pal" style="background:#d97706" data-palette="warm amber" title="Warm Amber"></button>
          <button class="pal" style="background:#059669" data-palette="emerald green" title="Emerald Green"></button>
          <button class="pal" style="background:#db2777" data-palette="hot pink" title="Hot Pink"></button>
          <button class="pal" style="background:#0891b2" data-palette="teal cyan" title="Teal Cyan"></button>
          <button class="pal" style="background:#ea580c" data-palette="burnt orange" title="Burnt Orange"></button>
          <button class="pal" style="background:#4f46e5" data-palette="indigo" title="Indigo"></button>
          <button class="pal" style="background:#0f172a" data-palette="dark slate" title="Dark Slate"></button>
          <button class="pal" style="background:#be185d" data-palette="deep rose" title="Deep Rose"></button>
          <button class="pal" style="background:#1d4ed8" data-palette="royal blue" title="Royal Blue"></button>
        </div>
      </div>
      </div>
      </div>
      <div class="quick-edits">
        <div class="qe-label">⚡ Quick ideas</div>
        <button class="qe" id="regenSectionBtn" title="Regenerate one section with fresh AI">↻ Redo a section</button>
        <div class="sec-pick" id="secPick">
          <button class="qe" data-sec="hero">Hero</button>
          <button class="qe" data-sec="navigation">Navigation</button>
          <button class="qe" data-sec="features">Features</button>
          <button class="qe" data-sec="about">About</button>
          <button class="qe" data-sec="testimonials">Testimonials</button>
          <button class="qe" data-sec="pricing">Pricing</button>
          <button class="qe" data-sec="contact">Contact</button>
          <button class="qe" data-sec="footer">Footer</button>
        </div>
        <button class="qe" data-msg="Make the color scheme darker and more premium">Darker</button>
        <button class="qe" data-msg="Make the hero section bigger and more dramatic">Bigger hero</button>
        <button class="qe" data-msg="Add a testimonials section with 3 customer reviews">Testimonials</button>
        <button class="qe" data-msg="Change the accent color to deep blue">Blue theme</button>
        <button class="qe" data-msg="Make it more minimal with more whitespace">Minimal</button>
        <button class="qe" data-msg="Add a FAQ section with 5 relevant questions">Add FAQ</button>
        <button class="qe" data-msg="Add a pricing section with 3 tiers">Add pricing</button>
        <button class="qe" data-msg="Make the typography bigger and bolder">Bolder text</button>
      </div>
      <div class="chat-input">
        <div class="chat-row">
          <textarea class="chat-ta" id="ci" placeholder="Describe a change — e.g. “make it blue” or “add a pricing section”" rows="1"></textarea>
          <button class="chat-send" id="csb"><svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>
        </div>
        <div class="chat-hint">Press Enter to send · Shift+Enter for a new line</div>
      </div>
    </div>
  </div>
</div>

<!-- Deploy Modal -->
<div class="deploy-modal" id="deployModal">
  <div class="deploy-box">
    <div class="deploy-header">
      <div>
        <h2>🚀 Deploy your site</h2>
        <p>Get your site live in seconds — both are free forever.</p>
      </div>
    </div>
    <div class="deploy-tabs">
      <button class="d-tab active" id="dtab-netlify">🟢 Netlify</button>
      <button class="d-tab" id="dtab-cf">🟠 Cloudflare Pages</button>
    </div>

    <!-- Netlify Pane - Step by step wizard -->
    <div class="deploy-pane active" id="dpane-netlify">

      <!-- Step 1: Create account -->
      <div class="d-wizard-step" id="nstep1">
        <div class="d-step-badge">Step 1 of 3</div>
        <div class="d-step-title">Create a free Netlify account</div>
        <div class="d-step-desc">Netlify hosts your site for free forever. No credit card needed.</div>
        <a href="https://app.netlify.com/signup" target="_blank" class="d-btn d-btn-n" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">Open Netlify signup →</a>
        <div style="font-size:12px;color:#888;text-align:center;margin-bottom:16px">Already have an account? Skip ahead.</div>
        <button class="d-step-next" id="nstep1nextBtn">I have an account — Next →</button>
      </div>

      <!-- Step 2: Get token -->
      <div class="d-wizard-step" id="nstep2" style="display:none">
        <div class="d-step-badge">Step 2 of 3</div>
        <div class="d-step-title">Get your access token</div>
        <div class="d-step-desc">This lets Websprout deploy to your Netlify account. Takes 30 seconds.</div>
        <ol class="d-steps" style="margin-bottom:16px">
          <li class="d-step"><div class="d-step-n">1</div><div class="d-step-txt">Click the button below to open Netlify settings</div></li>
          <li class="d-step"><div class="d-step-n">2</div><div class="d-step-txt">Scroll to <strong>"Personal access tokens"</strong></div></li>
          <li class="d-step"><div class="d-step-n">3</div><div class="d-step-txt">Click <strong>"New access token"</strong>, name it "Websprout", click Generate</div></li>
          <li class="d-step"><div class="d-step-n">4</div><div class="d-step-txt">Copy the token and paste it below</div></li>
        </ol>
        <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" class="d-btn d-btn-n" style="display:block;text-align:center;text-decoration:none;margin-bottom:16px">Open Netlify → Personal access tokens</a>
        <div class="d-input-row">
          <div class="d-label">Paste your token here</div>
          <input class="d-input" id="netlifyToken" type="password" placeholder="netlify_pat_xxxxxxxx...">
          <div style="font-size:11px;color:#888;margin-top:4px">🔒 Saved on your device only. We never see or store it.</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="d-step-back" id="nstep2backBtn">← Back</button>
          <button class="d-step-next" id="nstep2next" id="step2nextBtn">Verify token →</button>
        </div>
        <div class="d-error" id="tokenError" style="margin-top:8px"></div>
      </div>

      <!-- Step 3: Name + Deploy -->
      <div class="d-wizard-step" id="nstep3" style="display:none">
        <div class="d-step-badge">Step 3 of 3</div>
        <div class="d-step-title">Name your site and deploy!</div>
        <div class="d-step-desc">Choose a name for your site URL, then hit deploy. You'll be live in ~10 seconds.</div>
        <div class="d-input-row">
          <div class="d-label">Site name <span style="font-weight:400;color:#888">(optional)</span></div>
          <input class="d-input" id="netlifySiteName" type="text" placeholder="my-coffee-shop">
          <div style="font-size:11px;color:#888;margin-top:4px">Your site will be at: <span id="sitePreviewUrl" style="color:#00c7b7">yoursite.netlify.app</span></div>
        </div>
        <button class="d-btn d-btn-n" id="netlifyDeployBtn" style="margin-top:12px">🚀 Deploy my site live!</button>
        <div class="d-result" id="netlifyResult" style="margin-top:12px">
          <div style="font-size:22px;text-align:center;margin-bottom:8px">🎉</div>
          <div class="d-result-url" style="text-align:center">Your site is live at:<br><a id="netlifyLiveUrl" href="#" target="_blank" style="font-size:15px;font-weight:700"></a></div>
          <div class="d-result-sub" style="text-align:center;margin-top:8px">Copy the link and share it! Add a custom domain anytime in your Netlify dashboard for free.</div>
        </div>
        <div class="d-error" id="netlifyError"></div>
        <button class="d-step-back" id="nstep1nextBtn" style="margin-top:10px">← Back</button>
      </div>
    </div>

    <!-- Cloudflare Pages Pane -->
    <div class="deploy-pane" id="dpane-cf">
      <div class="d-provider-card">
        <div class="d-prov-head">
          <span class="d-prov-logo">🟠</span>
          <div><div class="d-prov-name">Cloudflare Pages</div><div class="d-prov-sub">Unlimited bandwidth, blazing fast CDN</div></div>
        </div>
        <ul class="d-features">
          <li>Unlimited free bandwidth</li>
          <li>300+ global locations</li>
          <li>Free HTTPS + custom domain</li>
          <li>Perfect for high-traffic sites</li>
        </ul>
        <ol class="d-steps">
          <li class="d-step"><div class="d-step-n">1</div><div class="d-step-txt"><strong>Download your site</strong>Click ⬇ Download in the studio header to save your HTML file.</div></li>
          <li class="d-step"><div class="d-step-n">2</div><div class="d-step-txt"><strong>Rename to index.html</strong>Rename the downloaded file from <code>websprout-site.html</code> to <code>index.html</code>.</div></li>
          <li class="d-step"><div class="d-step-n">3</div><div class="d-step-txt"><strong>Go to Cloudflare Pages</strong>Visit <a href="https://pages.cloudflare.com" target="_blank" style="color:#f6821f">pages.cloudflare.com</a>, sign up free, click Create project → Direct Upload.</div></li>
          <li class="d-step"><div class="d-step-n">4</div><div class="d-step-txt"><strong>Upload and deploy</strong>Name your project, drag in <code>index.html</code>, click Deploy. Done in 60 seconds.</div></li>
        </ol>
        <a href="https://pages.cloudflare.com" target="_blank" class="d-btn d-btn-cf" style="display:block;text-align:center;text-decoration:none;margin-top:16px">Open Cloudflare Pages →</a>
      </div>
      <a href="/deploy-guide" target="_blank" class="d-guide-link">📖 Read the full deploy guide</a>
    </div>

    <div style="text-align:right;padding:12px 24px 16px;border-top:1px solid #e5e7eb">
      <button id="deployModalClose" style="background:none;border:none;color:#888;font-size:14px;cursor:pointer">Close</button>
    </div>
  </div>
</div>

<!-- Image Slot Picker Modal -->
<div class="slot-modal" id="slotModal">
  <div class="slot-box">
    <div class="slot-header">
      <div>
        <h3 id="slotModalTitle">Add photo</h3>
        <div class="slot-header-sub">This will replace the placeholder in your site</div>
      </div>
      <button class="slot-close-x" id="slotModalClose">&#10005;</button>
    </div>
    <div class="slot-body">
      <div class="slot-drop" id="slotDrop">
        <span class="slot-drop-icon">&#128247;</span>
        <div class="slot-drop-text">Drop your photo here</div>
        <div class="slot-drop-sub">PNG, JPG up to 10MB &mdash; compressed automatically</div>
      </div>
      <div class="slot-divider"><span>or choose from your uploads</span></div>
      <div class="slot-lib-grid" id="slotLibGrid">
        <div class="slot-lib-empty" style="grid-column:1/-1">No photos uploaded yet</div>
      </div>
      <button class="slot-upload-btn" id="slotUploadBtn">&#128247; Choose from device</button>
      <input type="file" id="slotFileInput" accept="image/*" style="display:none">
    </div>
  </div>
</div>

<!-- Edit Mode Indicator -->
<div class="edit-indicator" id="editIndicator">&#9998; Edit mode on — double-click any text to edit it</div>

<!-- Section Manager Modal -->
<div class="sec-modal" id="secModal">
  <div class="sec-box">
    <div class="sec-header">
      <div>
        <h3>&#9783; Section Manager</h3>
        <div class="sec-header-sub">Show/hide and reorder sections on your site</div>
      </div>
      <button class="sec-close-x" id="secClose">&#10005;</button>
    </div>
    <div class="sec-list" id="secList">
      <div style="font-size:13px;color:rgba(255,255,255,.3);text-align:center;padding:20px">Generate a site to manage its sections</div>
    </div>
    <div class="sec-footer">
      <button class="sec-refresh" id="secRefresh">&#8635; Refresh sections</button>
    </div>
  </div>
</div>

<!-- SEO Editor Modal -->
<div class="seo-modal" id="seoModal">
  <div class="seo-box">
    <div class="seo-header">
      <h3>🔍 SEO Settings</h3>
      <button class="seo-close" id="seoClose">✕</button>
    </div>
    <div class="seo-body">
      <div class="seo-field">
        <div class="seo-label">Page Title <span>Appears in browser tab and Google</span></div>
        <input class="seo-input" id="seoTitle" type="text" placeholder="My Business — Home" maxlength="60">
      </div>
      <div class="seo-field">
        <div class="seo-label">Meta Description <span>Shown in Google search results</span></div>
        <textarea class="seo-input" id="seoDesc" rows="3" placeholder="A short description of your site (150-160 chars)" maxlength="160"></textarea>
      </div>
      <div class="seo-preview">
        <div class="seo-preview-title" id="seoPrevTitle">Your Page Title</div>
        <div class="seo-preview-url">websprout.app › your-site</div>
        <div class="seo-preview-desc" id="seoPrevDesc">Your meta description will appear here in Google results.</div>
      </div>
    </div>
    <div class="seo-footer">
      <button class="seo-close btn-back" id="seoCancelBtn" style="padding:9px 16px;border-radius:8px">Cancel</button>
      <button class="seo-save" id="seoSaveBtn">Apply to site →</button>
    </div>
  </div>
</div>

<!-- Share Preview Modal -->
<div class="share-modal" id="shareModal">
  <div class="share-box">
    <h3>🔗 Share your preview</h3>
    <p>Anyone with this link can view your site preview for 7 days — no account needed.</p>
    <div class="share-url-wrap">
      <input class="share-url" id="shareUrlInput" readonly value="Generating link...">
      <button class="share-copy" id="shareCopyBtn">Copy</button>
    </div>
    <div class="share-note">Link expires in 7 days. They can view but not edit your site.</div>
    <button class="share-close-btn" id="shareCloseBtn">Close</button>
  </div>
</div>

<script>
(function(){
  var btn=document.getElementById('getSiteBtn'),menu=document.getElementById('getSiteMenu');
  if(btn&&menu){
    btn.addEventListener('click',function(e){e.stopPropagation();menu.style.display=menu.style.display==='none'?'block':'none';});
    document.addEventListener('click',function(){menu.style.display='none';});
    menu.addEventListener('click',function(e){e.stopPropagation();});
    var map={publish:'publishBtn',download:'dlBtn',copy:'copyBtn',deploy:'deployBtn',share:'shareBtn'};
    var items=menu.querySelectorAll('.gs-item');
    for(var i=0;i<items.length;i++){items[i].addEventListener('click',function(){var t=document.getElementById(map[this.getAttribute('data-act')]);if(t)t.click();menu.style.display='none';});}
  }
  var tbtn=document.getElementById('toolsBtn'),tmenu=document.getElementById('toolsMenu');
  if(tbtn&&tmenu){
    tbtn.addEventListener('click',function(e){e.stopPropagation();tmenu.style.display=tmenu.style.display==='none'?'block':'none';});
    document.addEventListener('click',function(){tmenu.style.display='none';});
    tmenu.addEventListener('click',function(e){e.stopPropagation();});
    var titems=tmenu.querySelectorAll('.gs-item');
    for(var k=0;k<titems.length;k++){titems[k].addEventListener('click',function(){var t=document.getElementById(this.getAttribute('data-tool'));if(t)t.click();tmenu.style.display='none';});}
  }
})();
</script>
<div id="authModal" style="display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:400px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">Sign in to Websprout</div>
      <button id="authClose" style="background:none;border:none;color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:22px">
      <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:16px;line-height:1.5">Sign in to save your sites to your account and open them from any device.</div>
      <a href="/auth/google" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;color:#1a1a1a;border-radius:10px;padding:12px;font-size:15px;font-weight:600;text-decoration:none">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-3.9 6.2-9.6 7.2-17.4z"/><path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7.3-5.7c-2 1.4-4.7 2.3-8 2.3-6.3 0-11.7-3.7-13.6-9.1l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/></svg>
        Continue with Google
      </a>
      <div style="display:flex;align-items:center;gap:10px;margin:18px 0;color:rgba(255,255,255,.3);font-size:12px"><div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>or<div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div></div>
      <input id="authEmail" type="email" placeholder="you@email.com" autocomplete="email" style="width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;font-family:inherit;margin-bottom:10px">
      <button id="authEmailBtn" style="width:100%;background:#2d7a3a;color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit">Email me a sign-in link</button>
      <div id="authMsg" style="font-size:13px;min-height:18px;margin-top:10px;text-align:center"></div>
    </div>
  </div>
</div>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var modal=$('authModal');
  function openAuth(){if(modal){$('authMsg').textContent='';modal.style.display='flex';}}
  window.openAuth=openAuth;
  if($('authClose'))$('authClose').addEventListener('click',function(){modal.style.display='none';});
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  if($('authEmailBtn'))$('authEmailBtn').addEventListener('click',function(){
    var em=$('authEmail').value.trim(),msg=$('authMsg'),self=this;
    if(!em||em.indexOf('@')<1){msg.innerHTML='<span style="color:#f87171">Enter a valid email</span>';return;}
    self.disabled=true;self.textContent='Sending...';
    fetch('/auth/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em})}).then(function(r){return r.json();}).then(function(j){
      self.disabled=false;self.textContent='Email me a sign-in link';
      if(j.error){msg.innerHTML='<span style="color:#f87171">'+j.error+'</span>';}
      else{msg.innerHTML='<span style="color:#4ade80">Check your email for the sign-in link.</span>';}
    }).catch(function(){self.disabled=false;self.textContent='Email me a sign-in link';msg.innerHTML='<span style="color:#f87171">Could not send — try again</span>';});
  });
  function displayName(me){
    var n=(me&&me.name||'').trim();
    if(n)return n.split(' ')[0];
    var em=(me&&me.email||'').trim();
    if(em){var lp=em.split('@')[0].split(/[._+]/)[0];if(lp)return lp.charAt(0).toUpperCase()+lp.slice(1);}
    return 'there';
  }
  function applyAuthBtn(btn,me,prefix){
    if(!btn)return;
    if(me&&me.auth){btn.textContent='Hello, '+displayName(me);btn.title='Signed in as '+(me.email||'')+' — click to sign out';btn.onclick=function(){if(confirm('Sign out'+(me.email?(' of '+me.email):'')+'?')){fetch('/auth/logout').then(function(){location.href='/';});}};}
    else{btn.textContent=(prefix||'')+'Sign in';btn.title='Sign in to save your sites to your account';btn.onclick=openAuth;}
  }
  function setAuthUI(me){
    window._wsUser=me;
    applyAuthBtn($('signInBtn'),me,'');
    applyAuthBtn($('acctBtn'),me,'\uD83D\uDC64 ');
    if(me&&me.pro){try{if(typeof unlocked!=='undefined')unlocked=true;if(typeof applyUnlock==='function')applyUnlock();}catch(e){}}
  }
  fetch('/me').then(function(r){return r.json();}).then(setAuthUI).catch(function(){});
  try{var P=new URLSearchParams(location.search);var lg=P.get('login');if(lg){history.replaceState(null,'',location.pathname);setTimeout(function(){if(window.toast){if(lg==='ok')toast('\u2713 Signed in!');else if(lg==='expired')toast('That link expired — please request a new one',6000);else if(lg==='error')toast('Sign-in failed — please try again',6000);}},400);}}catch(e){}
})();
</script>
<div id="yourInfoModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:460px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128221; Your business info</div>
      <button id="yiClose" style="background:none;border:none;color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div style="padding:20px 22px">
      <div style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:14px;line-height:1.5">Fill these in and we'll place them across your whole site at once — replacing the placeholder name, phone, email, address and hours everywhere they appear.</div>
      <label class="yi-l">Business name</label>
      <input id="yiBrand" class="yi-i" type="text" placeholder="e.g. Coastal Marine Detailing" autocomplete="off">
      <label class="yi-l">Phone</label>
      <input id="yiPhone" class="yi-i" type="text" placeholder="(555) 123-4567" autocomplete="off">
      <label class="yi-l">Email</label>
      <input id="yiEmail" class="yi-i" type="text" placeholder="hello@yourbusiness.com" autocomplete="off">
      <label class="yi-l">Address</label>
      <input id="yiAddr" class="yi-i" type="text" placeholder="123 Harbor Way, Your City" autocomplete="off">
      <label class="yi-l">Hours</label>
      <input id="yiHours" class="yi-i" type="text" placeholder="Mon-Fri 9am-5pm" autocomplete="off">
      <div id="yiMsg" style="font-size:12px;min-height:16px;margin-top:10px"></div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button id="yiCancel" style="flex:1;background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
        <button id="yiApply" style="flex:2;background:#2d7a3a;color:#fff;border:none;border-radius:9px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Apply to my site</button>
      </div>
    </div>
  </div>
</div>
<style>.yi-l{display:block;font-size:12px;font-weight:600;color:rgba(255,255,255,.6);margin:12px 0 5px}.yi-i{width:100%;background:#060d05;border:1px solid rgba(45,122,58,.3);border-radius:9px;color:#fff;padding:11px 13px;font-size:14px;outline:none;font-family:inherit}.yi-i:focus{border-color:rgba(45,122,58,.7)}</style>
<script>
(function(){
  function $(id){return document.getElementById(id);}
  var modal=$('yourInfoModal');if(!modal)return;
  var TOKENS={brand:'',phone:'[Your Phone]',email:'[your@email.com]',address:'[Your Address]',hours:'[Your Hours]'};
  function site(){return window._wsSite||localStorage.getItem('ws_site')||'';}
  function curHtml(){return (typeof window.gHTML==='string'&&window.gHTML)||localStorage.getItem('wsh')||'';}
  function stored(){try{return JSON.parse(localStorage.getItem('ws_info_'+site())||'{}');}catch(e){return {};}}
  function setStored(o){try{localStorage.setItem('ws_info_'+site(),JSON.stringify(o));}catch(e){}}
  function detectBrand(){
    try{var pf=$('pf');var d=pf&&(pf.contentDocument||pf.contentWindow.document);if(d){var bd=d.querySelector('[data-ws-field="brand"]');if(bd&&bd.textContent.trim())return bd.textContent.trim();}}catch(e){}
    var h=curHtml();var a=h.indexOf('<title>'),b=h.indexOf('</title>');if(a>-1&&b>a){var t=h.slice(a+7,b);return t.split('|')[0].split(' - ')[0].split(' \u2013 ')[0].trim();}
    return '';
  }
  function openYI(){
    var s=stored();
    $('yiBrand').value=s.brand||detectBrand()||'';
    $('yiPhone').value=s.phone||'';$('yiEmail').value=s.email||'';$('yiAddr').value=s.address||'';$('yiHours').value=s.hours||'';
    $('yiMsg').textContent='';modal.style.display='flex';
  }
  window.openYourInfo=openYI;
  var yb=$('yourInfoBtn');if(yb)yb.addEventListener('click',openYI);
  $('yiClose').addEventListener('click',function(){modal.style.display='none';});
  $('yiCancel').addEventListener('click',function(){modal.style.display='none';});
  modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  function replaceAll(h,oldV,newV){if(!oldV||oldV===newV)return h;return h.split(oldV).join(newV);}
  $('yiApply').addEventListener('click',function(){
    var h=curHtml();if(!h){return;}
    var s=stored(),changed=0;
    var fields=[['brand',$('yiBrand').value.trim()],['phone',$('yiPhone').value.trim()],['email',$('yiEmail').value.trim()],['address',$('yiAddr').value.trim()],['hours',$('yiHours').value.trim()]];
    for(var i=0;i<fields.length;i++){
      var f=fields[i][0],nv=fields[i][1];if(!nv)continue;
      var ov=(f==='brand')?(s.brand||detectBrand()):(s[f]||TOKENS[f]);
      if(!ov)continue;
      var before=h;h=replaceAll(h,ov,nv);if(h!==before)changed++;
      s[f]=nv;
    }
    if(!changed){$('yiMsg').innerHTML='<span style="color:rgba(255,255,255,.5)">Nothing matched — those spots may already be filled. Use Edit text to change values that are already set.</span>';return;}
    setStored(s);window.gHTML=h;try{localStorage.setItem('wsh',h);}catch(e){}
    if(window.pushUndo)window.pushUndo(h);
    if(window.setPreview){window.setPreview(h);}else{sessionStorage.setItem('ws_studio','1');location.reload();return;}
    if(window.bumpEditCount)window.bumpEditCount();
    modal.style.display='none';
    if(window.toast)toast('\u2713 Your info added across the site!');
  });
})();
</script>
<div id="mySitesModal" style="display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:18px">
  <div style="background:#0f1a0d;border:1px solid rgba(45,122,58,.3);border-radius:18px;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-size:17px;font-weight:800;color:#fff">&#128194; My sites</div>
      <button id="msClose" style="background:none;border:none;color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;line-height:1">&times;</button>
    </div>
    <div id="msList" style="padding:14px 18px 22px"></div>
  </div>
</div>
<script>
(function(){
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function site(){return window._wsSite||lsGet('ws_site')||'';}
  function key(){return window._wsKey||lsGet('ws_key')||'';}
  function curHtml(){return lsGet('wsh')||'';}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function nameFrom(h){var a=h.indexOf('<title>'),b=h.indexOf('</title>');var n=(a>-1&&b>-1)?h.slice(a+7,b):'';n=n.replace(/\s*\|.*$/,'').trim();return n.slice(0,60)||'My site';}
  function getProjects(){try{return JSON.parse(lsGet('ws_projects')||'[]');}catch(e){return [];}}
  function setProjects(p){try{localStorage.setItem('ws_projects',JSON.stringify(p.slice(0,40)));}catch(e){}}
  function mergeServer(serverSites){
    if(!serverSites||!serverSites.length)return;
    var local=getProjects(),map={};
    local.forEach(function(p){map[p.siteId]=p;});
    serverSites.forEach(function(s){
      var ex=map[s.siteId];
      if(!ex||(s.ts||0)>(ex.ts||0))map[s.siteId]={siteId:s.siteId,key:s.key||(ex&&ex.key)||'',name:s.name||(ex&&ex.name)||'My site',ts:s.ts||Date.now()};
      else if(ex&&!ex.key&&s.key)ex.key=s.key;
    });
    var merged=Object.keys(map).map(function(k){return map[k];});
    merged.sort(function(a,b){return (b.ts||0)-(a.ts||0);});
    setProjects(merged);
  }
  function modalOpen(){return modal&&modal.style.display==='flex';}
  function accountSync(){
    fetch('/my-sites').then(function(r){return r.json();}).then(function(j){
      if(!j||!j.auth)return;
      var local=getProjects().filter(function(p){return p.key;});
      if(local.length){
        fetch('/my-sites/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sites:local})}).then(function(r){return r.json();}).then(function(){
          fetch('/my-sites').then(function(r){return r.json();}).then(function(j2){if(j2&&j2.sites){mergeServer(j2.sites);if(modalOpen())render();}});
        }).catch(function(){mergeServer(j.sites);if(modalOpen())render();});
      }else{mergeServer(j.sites);if(modalOpen())render();}
    }).catch(function(){});
  }
  function upsert(sid,k,nm){var p=getProjects(),f=null;for(var i=0;i<p.length;i++){if(p[i].siteId===sid){f=p[i];break;}}if(f){f.name=nm;f.key=k||f.key;f.ts=Date.now();}else{p.push({siteId:sid,key:k,name:nm,ts:Date.now()});}p.sort(function(a,b){return b.ts-a.ts;});setProjects(p);}
  var lastSite='',lastHtml='';
  function tick(){
    var s=site(),k=key(),h=curHtml();
    if(!s||!h||h.length<100)return;
    if(s===lastSite&&h===lastHtml)return;
    lastSite=s;lastHtml=h;var nm=nameFrom(h);upsert(s,k,nm);
    fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:s,key:k,html:h,name:nm})}).catch(function(){});
  }
  setInterval(tick,12000);setTimeout(tick,4000);window._wsTrackNow=tick;
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')tick();});
  var modal=document.getElementById('mySitesModal'),listEl=document.getElementById('msList');
  function fmt(ts){try{return new Date(ts).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}catch(e){return '';}}
  function render(){
    var p=getProjects();
    if(!p.length){listEl.innerHTML='<div style="text-align:center;color:rgba(255,255,255,.45);padding:40px 10px;line-height:1.6">No saved sites yet.<br>Sites you create are saved here automatically so you can come back and edit them.</div>';return;}
    var h='';
    for(var i=0;i<p.length;i++){var it=p[i];
      h+='<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:10px">'
       +'<div style="flex:1;min-width:0"><div style="color:#fff;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.name)+'</div><div style="color:rgba(255,255,255,.4);font-size:12px">Saved '+fmt(it.ts)+' <span id="msv_'+esc(it.siteId)+'" style="color:rgba(255,255,255,.55)"></span></div></div>'
       +'<button class="ms-edit" data-sid="'+esc(it.siteId)+'" style="background:#2d7a3a;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Edit</button>'
       +'<button class="ms-del" data-sid="'+esc(it.siteId)+'" title="Remove from list" style="background:none;border:none;color:rgba(255,255,255,.35);font-size:18px;cursor:pointer;line-height:1">&times;</button>'
       +'</div>';
    }
    listEl.innerHTML=h;
    var eds=listEl.querySelectorAll('.ms-edit');for(var j=0;j<eds.length;j++){eds[j].addEventListener('click',function(){openProject(this.getAttribute('data-sid'),this);});}
    var dls=listEl.querySelectorAll('.ms-del');for(var m=0;m<dls.length;m++){dls[m].addEventListener('click',function(){var sid=this.getAttribute('data-sid');setProjects(getProjects().filter(function(x){return x.siteId!==sid;}));fetch('/my-sites/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteId:sid})}).catch(function(){});render();});}
    for(var v=0;v<p.length;v++){(function(it){fetch('/api/views?site='+encodeURIComponent(it.siteId)+'&key='+encodeURIComponent(it.key||'')).then(function(r){return r.json();}).then(function(j){var el=document.getElementById('msv_'+it.siteId);if(el&&j&&typeof j.total==='number'&&j.total>0)el.textContent='· '+j.total+' view'+(j.total===1?'':'s')+(j.week?(' ('+j.week+' this week)'):'');}).catch(function(){});})(p[v]);}
  }
  function openProject(sid,b){
    var p=getProjects(),it=null;for(var i=0;i<p.length;i++){if(p[i].siteId===sid){it=p[i];break;}}
    if(!it)return;if(b)b.textContent='Loading...';
    fetch('/load?site='+encodeURIComponent(sid)+'&key='+encodeURIComponent(it.key||'')).then(function(r){return r.json();}).then(function(j){
      if(j.error||!j.html){if(b)b.textContent='Edit';alert('Could not load this site. It may have expired.');return;}
      try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',sid);localStorage.setItem('ws_key',it.key||'');sessionStorage.setItem('ws_studio','1');}catch(e){}
      window._wsSite=sid;window._wsKey=it.key||'';location.href='/';
    }).catch(function(){if(b)b.textContent='Edit';alert('Could not load this site.');});
  }
  window.openMySites=function(){render();modal.style.display='flex';accountSync();};
  var msBtn=document.getElementById('mySitesBtn');if(msBtn)msBtn.addEventListener('click',window.openMySites);
  if(document.getElementById('msClose'))document.getElementById('msClose').addEventListener('click',function(){modal.style.display='none';});
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  try{
    var Q=new URLSearchParams(location.search);
    if(Q.get('site')&&Q.get('key')){
      var dsid=Q.get('site'),dk=Q.get('key');
      fetch('/load?site='+encodeURIComponent(dsid)+'&key='+encodeURIComponent(dk)).then(function(r){return r.json();}).then(function(j){
        if(j&&j.html){try{localStorage.setItem('wsh',j.html);localStorage.setItem('ws_site',dsid);localStorage.setItem('ws_key',dk);sessionStorage.setItem('ws_studio','1');}catch(e){}window._wsSite=dsid;window._wsKey=dk;history.replaceState(null,'',location.pathname);location.reload();}
      }).catch(function(){});
    }
  }catch(e){}
  setTimeout(accountSync,1600);
})();
</script>

<script>
// Websprout v3.1
var gHTML='',unlocked=false,selectedType='',selectedStyle='';
var undoStack=[],redoStack=[],editCount=0;
var loadMsgs=['Planting your prompt...','Writing your hero section...','Designing the layout...','Adding feature cards...','Styling the navigation...','Building the footer...','Writing your copy...','Polishing the details...','Almost ready...'];

// Live counter
// Live counter - starts at 340 base, grows ~2-3 sites/day since Jan 1 2026
(function(){
  var BASE=340;
  var START_MS=new Date('2026-01-01').getTime();
  var RATE=2.4; // sites per day
  function calcCount(){
    var days=(Date.now()-START_MS)/(1000*60*60*24);
    return Math.floor(BASE + days*RATE);
  }
  var liveCount=calcCount();
  var el=document.getElementById('liveCount');
  if(el)el.textContent=liveCount.toLocaleString();
  // Tick up every 8-12 minutes to simulate real-time growth
  setInterval(function(){
    liveCount+=1;
    var el=document.getElementById('liveCount');
    if(el)el.textContent=liveCount.toLocaleString();
  }, Math.floor(Math.random()*240000)+240000);
})();

// Auto-detect device type and set preview mode
function autoSetDevice(){
  var ua=navigator.userAgent.toLowerCase();
  var w=window.innerWidth;
  var isMobile=/iphone|android|mobile/.test(ua)||w<=480;
  var isTablet=/ipad|tablet/.test(ua)||(w>480&&w<=1024&&'ontouchstart' in window);
  var devId=isMobile?'devMobile':isTablet?'devTablet':'devDesktop';
  var wrap=document.getElementById('previewWrap');
  document.querySelectorAll('.dev-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById(devId);
  if(btn)btn.classList.add('active');
  if(wrap){
    wrap.classList.remove('tablet','mobile');
    if(isMobile)wrap.classList.add('mobile');
    else if(isTablet)wrap.classList.add('tablet');
  }
}

// Payment return
(function(){
  try{
    var p=new URLSearchParams(window.location.search);
    if(p.get('sub')==='success'){
      window.history.replaceState({},'',window.location.pathname);
      toast('\uD83C\uDF89 Thanks! Activating your subscription...',6000);
      var tries=0;
      var iv=setInterval(function(){
        tries++;
        fetch('/me').then(function(r){return r.json();}).then(function(me){
          window._wsUser=me;
          if(me&&me.pro){clearInterval(iv);unlocked=true;try{applyUnlock();}catch(e){}toast('\u2705 You are Pro \u2014 everything is unlocked!',6000);}
          else if(tries>=8){clearInterval(iv);toast('Payment received \u2014 if it does not unlock shortly, refresh the page.',7000);}
        }).catch(function(){if(tries>=8)clearInterval(iv);});
      },2000);
    }
    var s=localStorage.getItem('wsh');if(s&&s.length>100)gHTML=s;
  }catch(e){}
})();

function toast(m,d){var t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},d||4000);}

// Derive a clean download filename from the site's <title>
function siteFilename(){
  var name='';
  var tS=gHTML.indexOf('<title>'),tE=gHTML.indexOf('</title>');
  if(tS>-1&&tE>-1)name=gHTML.slice(tS+7,tE);
  name=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
  return name||'websprout-site';
}

// -- Undo Stack ------------------------------------------------
function pushUndo(html){
  undoStack.push(html);
  if(undoStack.length>10)undoStack.shift();
  redoStack=[]; // a new edit invalidates the redo history
  refreshHistoryBtns();
}

function refreshHistoryBtns(){
  var ub=document.getElementById('undoBtn');
  if(ub){ub.disabled=undoStack.length<2;ub.textContent='<< Undo'+(undoStack.length>1?' ('+(undoStack.length-1)+')':'');}
  var rb=document.getElementById('redoBtn');
  if(rb){rb.disabled=redoStack.length<1;rb.textContent='>> Redo'+(redoStack.length>0?' ('+redoStack.length+')':'');}
}

function syncEditCounter(){
  var ec=document.getElementById('editCounter');
  if(ec){ec.textContent=editCount+' edit'+(editCount===1?'':'s');ec.style.display=editCount===0?'none':'inline';}
}

function doUndo(){
  if(undoStack.length<2)return;
  redoStack.push(undoStack.pop()); // move current state onto redo stack
  gHTML=undoStack[undoStack.length-1];
  localStorage.setItem('wsh',gHTML);
  setTimeout(function(){setPreview(gHTML);},50);
  editCount=Math.max(0,editCount-1);
  syncEditCounter();
  refreshHistoryBtns();
  addMsg('ai','<< Undone! Restored previous version.');
  toast('<< Undone - previous version restored');
}

function doRedo(){
  if(redoStack.length<1)return;
  var next=redoStack.pop();
  undoStack.push(next);
  gHTML=next;
  localStorage.setItem('wsh',gHTML);
  setTimeout(function(){setPreview(gHTML);},50);
  editCount++;
  syncEditCounter();
  refreshHistoryBtns();
  addMsg('ai','>> Redone! Re-applied that change.');
  toast('>> Redone - change re-applied');
}

// -- Edit counter -----------------------------------------------
function bumpEditCount(){
  editCount++;
  var el=document.getElementById('editCounter');
  if(el){el.textContent=editCount+' edit'+(editCount===1?'':'s');el.style.display='inline';}
}

function setPreview(html){
  var f=document.getElementById('pf');if(!f||!html)return;
  // Keep the studio top-bar title in sync with the site's current <title> (renames, edits, etc.)
  try{var _ts=html.indexOf('<title>'),_te=html.indexOf('</title>');if(_ts>-1&&_te>_ts){var _tt=html.slice(_ts+7,_te).trim();var _st=document.getElementById('stitle');if(_st&&_tt)_st.textContent=_tt.slice(0,50);}}catch(e){}
  var skel=document.getElementById('skelWrap');
  if(skel)skel.classList.add('show');
  // No <base> tag — we handle all link clicks manually in the injected script
  // Inject slot click handler + nav fix into preview
  // Build combined injection script (slots + edit mode)
  var slotScript='<scr'+'ipt id=\"_wsInject\">'+

    // Edit mode toggle
    'window._wsEM=false;'+
    'window.addEventListener(\"message\",function(e){'+
      'if(!e.data||typeof e.data!==\"object\")return;'+
      'if(e.data.type===\"wsSetEditMode\"){'+
        'window._wsEM=e.data.active;'+
        'var s=document.getElementById(\"_wsES\");'+
        'if(e.data.active&&!s){'+
          's=document.createElement(\"style\");s.id=\"_wsES\";'+
          's.textContent=\"h1,h2,h3,h4,h5,h6,p,li,a,button,span,td,blockquote,div,strong,b,em,small,sup,sub{cursor:text!important}h1:hover,h2:hover,h3:hover,p:hover,li:hover{outline:1px dashed rgba(61,186,82,.5)!important}\";'+
          'document.head.appendChild(s);'+
        '}else if(!e.data.active&&s)s.remove();'+
      '}'+
    '});'+

    // Double-click to edit text
    'document.addEventListener(\"dblclick\",function(e){'+
      'if(!window._wsEM)return;'+
      'var el=e.target.closest(\"h1,h2,h3,h4,h5,h6,p,li,a,button,span,td,th,label,strong,b,em,small,sup,sub,div\");'+
      'if(!el||el.isContentEditable)return;'+
      'if(el.tagName===\"DIV\"&&(el.classList.contains(\"ws-img-slot\")||el.querySelector(\"img,form,section,header,footer,nav\")))return;'+
      'e.preventDefault();e.stopPropagation();'+
      'var oldOuter=el.outerHTML,origInner=el.innerHTML;'+
      'el.contentEditable=\"true\";el.style.outline=\"2px solid #3dba52\";el.focus();'+
      'el.addEventListener(\"blur\",function(){'+
        'el.contentEditable=\"false\";el.style.outline=\"\";'+
        'if(el.outerHTML!==oldOuter)parent.postMessage({type:\"wsTextEdit\",oldOuter:oldOuter,newOuter:el.outerHTML},\"*\");'+
      '},{once:true});'+
      'el.addEventListener(\"keydown\",function(ev){'+
        'if(ev.key===\"Enter\"&&!ev.shiftKey){ev.preventDefault();el.blur();}'+
        'if(ev.key===\"Escape\"){el.innerHTML=origInner;el.blur();}'+
      '});'+
    '});'+

    // Wire image slots - direct listeners, no innerHTML, no quote escaping issues
    'function wsWireSlots(){'+
      // Empty slots - click to add photo
      'document.querySelectorAll(\".ws-img-slot\").forEach(function(s){'+
        'if(s._wsW)return;s._wsW=1;'+
        's.style.cssText+=\";cursor:pointer!important;pointer-events:auto!important\";'+
        's.onclick=function(e){e.preventDefault();e.stopPropagation();'+
          'parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot\")||\"image\",label:s.getAttribute(\"data-label\")||\"Add photo\"},\"*\");'+
        '};'+
      '});'+
      // Filled slots - click to change photo, show overlay on hover
      'document.querySelectorAll(\"[data-slot-filled]\").forEach(function(s){'+
        'if(s._wsW)return;s._wsW=1;'+
        's.style.cssText+=\";cursor:pointer!important;pointer-events:auto!important;position:relative\";'+
        // Build overlay with createElement - no quote escaping needed
        'var ov=document.createElement(\"div\");'+
        'ov.style.cssText=\"position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;border-radius:inherit;pointer-events:none\";'+
        'var lb=document.createElement(\"span\");'+
        'lb.style.cssText=\"background:rgba(255,255,255,.92);color:#111;padding:7px 18px;border-radius:100px;font-size:13px;font-weight:700\";'+
        'lb.textContent=\"Change photo\";'+
        'ov.appendChild(lb);s.appendChild(ov);'+
        's.onmouseenter=function(){ov.style.opacity=\"1\";};'+
        's.onmouseleave=function(){ov.style.opacity=\"0\";};'+
        's.onclick=function(e){e.preventDefault();e.stopPropagation();'+
          'parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot-filled\")||\"image\",label:\"Change photo\"},\"*\");'+
        '};'+
      '});'+
    '}'+
    // Floating "add photo" pill for background slots that sit BEHIND content
    // (e.g. full-bleed hero backgrounds) where the slot itself cannot receive clicks.
    'function wsFloaters(){'+
      'document.querySelectorAll(\"[data-wsfloat]\").forEach(function(b){'+
        'if(!b._slot||!b._slot.isConnected||!b._slot.classList.contains(\"ws-img-slot\")){if(b._slot)b._slot._wsFloatBtn=null;b.remove();}'+
      '});'+
      'document.querySelectorAll(\".ws-img-slot\").forEach(function(s){'+
        'var r=s.getBoundingClientRect();'+
        'if(r.width<20||r.height<20)return;'+
        'var cy=r.top+(r.height>180?90:r.height/2);'+
        'var topEl=document.elementFromPoint(r.left+r.width/2,cy);'+
        'var overlapped=topEl&&topEl!==s&&!s.contains(topEl);'+
        'if(overlapped){'+
          'var btn=s._wsFloatBtn;'+
          'if(!btn||!btn.isConnected){'+
            'btn=document.createElement(\"div\");'+
            'btn.setAttribute(\"data-wsfloat\",\"1\");'+
            'btn._slot=s;'+
            'btn.textContent=\"\\uD83D\\uDCF7 Add background photo\";'+
            'btn.style.cssText=\"position:absolute;z-index:2147483600;padding:9px 16px;background:rgba(17,17,17,.85);color:#fff;font:600 13px -apple-system,BlinkMacSystemFont,sans-serif;border-radius:100px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap\";'+
            'btn.onclick=function(e){e.preventDefault();e.stopPropagation();parent.postMessage({type:\"wsSlotClick\",slotId:s.getAttribute(\"data-slot\")||\"image\",label:s.getAttribute(\"data-label\")||\"Add photo\"},\"*\");};'+
            'document.body.appendChild(btn);'+
            's._wsFloatBtn=btn;'+
          '}'+
          'var bw=btn.offsetWidth||170;'+
          'btn.style.left=(r.left+(window.pageXOffset||0)+r.width/2-bw/2)+\"px\";'+
          'btn.style.top=(r.top+(window.pageYOffset||0)+16)+\"px\";'+
        '}else if(s._wsFloatBtn){s._wsFloatBtn.remove();s._wsFloatBtn=null;}'+
      '});'+
    '}'+
    'wsWireSlots();wsFloaters();'+
    // Re-wire + reposition floaters when the DOM or layout changes
    'new MutationObserver(function(){wsWireSlots();wsFloaters();}).observe(document.body,{childList:true,subtree:true});'+
    'window.addEventListener(\"resize\",wsFloaters);'+
    'window.addEventListener(\"load\",function(){setTimeout(wsFloaters,300);});'+
    'setTimeout(wsFloaters,500);setTimeout(wsFloaters,1300);setTimeout(wsFloaters,2200);'+

    // Link handling - hash links untouched, everything else just preventDefault
    // (no window.open - that was causing the duplicate tab issue)
    'document.addEventListener(\"click\",function(e){'+
      'var a=e.target.closest(\"a\");'+
      'if(!a)return;'+
      'var h=a.getAttribute(\"href\")||\"\";'+
      'if(h===\"\"||h.startsWith(\"#\")||h.startsWith(\"javascript\")||h.startsWith(\"mailto:\")||h.startsWith(\"tel:\"))return;'+
      // Block all other links from navigating the iframe away
      'e.preventDefault();'+
    '});'+

  '</sc'+'ript>';
  // Use lastIndexOf to find the REAL </body> — not one inside a JS string
  var bodyClose=html.lastIndexOf('</body>');
  var out=bodyClose>-1?html.slice(0,bodyClose)+slotScript+'</body>'+html.slice(bodyClose+7):html+slotScript;
  f.style.height='4000px';
  f.srcdoc=out;
  // Poll for real content height - CSS may not be applied at onload time
  var attempts=0;
  var lastH=0;
  var timer=setInterval(function(){
    attempts++;
    try{
      var d=f.contentDocument||f.contentWindow.document;
      if(d&&d.body){
        var h=Math.max(d.documentElement.scrollHeight,d.body.scrollHeight);
        if(h>200){
          // Hide skeleton once content is ready
          var skel=document.getElementById('skelWrap');
          if(skel){skel.classList.remove('show');setStudioReady(true);}
        }
        if(h>200&&h!==lastH){
          lastH=h;
          f.style.height=(h+24)+'px';
        }
      }
    }catch(e){}
    if(attempts>=15){
      var skel=document.getElementById('skelWrap');
      if(skel)skel.classList.remove('show');
      setStudioReady(true);
      clearInterval(timer);
    }
  },200);
}

function showPanel(n){
  [1,2,3].forEach(function(i){
    document.getElementById('panel'+i).classList.toggle('active',i===n);
    var t=document.getElementById('tab'+i);
    t.classList.toggle('active',i===n);
    t.classList.toggle('done',i<n);
  });
}

document.addEventListener('DOMContentLoaded',function(){
  // Wrap in try-catch to catch silent errors
  try{
  // Type buttons
  document.querySelectorAll('.type-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.type-btn').forEach(function(b){b.classList.remove('sel');});
      btn.classList.add('sel');
      var cw=document.getElementById('customWrap');
      if(btn.dataset.type==='OTHER'){selectedType='';if(cw)cw.style.display='block';var cp=document.getElementById('customPrompt');if(cp)cp.focus();}
      else{selectedType=btn.dataset.type;if(cw)cw.style.display='none';}
      var n1=document.getElementById('next1');if(n1)n1.classList.add('on');
    });
  });
  var cpEl=document.getElementById('customPrompt');
  if(cpEl)cpEl.addEventListener('input',function(){
    selectedType=cpEl.value.trim()?'__c__':'';
    document.getElementById('next1').classList.toggle('on',!!cpEl.value.trim());
  });

  // Vibe chips
  document.querySelectorAll('.vibe-chip').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('.vibe-chip').forEach(function(x){x.classList.remove('sel');});
      c.classList.add('sel');selectedStyle=c.dataset.style;
    });
  });

  // Navigation
  document.getElementById('next1').addEventListener('click',function(){
    var txt=cpEl?cpEl.value.trim():'';
    if(!txt&&!(selectedType&&selectedType!=='__c__')){if(cpEl)cpEl.focus();toast('Describe your website first 🌱');return;}
    if(txt)selectedType='__c__';
    doGenerate();
  });
  document.getElementById('next2').addEventListener('click',function(){buildSummary();showPanel(3);});
  document.getElementById('back2').addEventListener('click',function(){showPanel(1);});
  document.getElementById('back3').addEventListener('click',function(){showPanel(2);});

  // Scroll to builder
  ['navCta','heroCta','ctaBtn'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(){document.getElementById('builder').scrollIntoView({behavior:'smooth'});});
  });

  // Generate
  document.getElementById('gbtn').addEventListener('click',doGenerate);

  // One-click example starter prompts (zero-typing path for first-timers)
  document.querySelectorAll('.ex-chip').forEach(function(chip){
    chip.addEventListener('click',function(){
      selectedType=chip.dataset.ex||'';
      selectedStyle=chip.dataset.style||'';
      var cp=document.getElementById('customPrompt');if(cp)cp.value='';
      doGenerate();
    });
  });

  // Chat input
  var ci=document.getElementById('ci');
  ci.addEventListener('input',function(){ci.style.height='auto';ci.style.height=Math.min(ci.scrollHeight,100)+'px';});
  ci.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doChat();}});
  document.getElementById('csb').addEventListener('click',doChat);
  document.querySelectorAll('.qe').forEach(function(btn){
    btn.addEventListener('click',function(){document.getElementById('ci').value=btn.dataset.msg;doChat();});
  });

  // Studio controls
  document.getElementById('backBtn').addEventListener('click',function(){
    document.getElementById('studio').classList.remove('on');
    document.body.style.overflow='';
    sessionStorage.removeItem('ws_studio');
  });
  document.getElementById('regenBtn').addEventListener('click',function(){
    document.getElementById('studio').classList.remove('on');
    document.body.style.overflow='';
    document.getElementById('builder').scrollIntoView({behavior:'smooth'});
    setTimeout(doGenerate,300);
  });
  // -- Undo ------------------------------------------------------
  // ---- Guard not-ready buttons (fires in capture phase) ----
  document.getElementById('studio').addEventListener('click',function(e){
    var studio=document.getElementById('studio');
    if(!studio.classList.contains('studio-loading'))return;
    // Block clicks on anything that needs a site
    var needsSite=e.target.closest('[data-needs-site]');
    var inChat=e.target.closest('.chat');
    if(needsSite||inChat){
      e.stopImmediatePropagation();
      e.preventDefault();
      toast('Generate a site first!',2500);
    }
  },true);

  // ---- Deploy CTA banner ----
  var dcb=document.getElementById('deployCtaBtn');
  if(dcb)dcb.addEventListener('click',function(){
    var banner=document.getElementById('deployCtaBanner');
    if(banner)banner.classList.remove('on');
    var db=document.getElementById('deployBtn');
    if(db)db.click();
  });
  var dcd=document.getElementById('deployCtaDismiss');
  if(dcd)dcd.addEventListener('click',function(){
    var banner=document.getElementById('deployCtaBanner');
    if(banner)banner.classList.remove('on');
  });

  // ---- Edit mode, Section manager ----
  var emBtn=document.getElementById('editModeBtn');
  if(emBtn)emBtn.addEventListener('click',toggleEditMode);
  var secBtn=document.getElementById('sectionsBtn');
  if(secBtn)secBtn.addEventListener('click',showSectionManager);
  var secCl=document.getElementById('secClose');
  if(secCl)secCl.addEventListener('click',function(){document.getElementById('secModal').classList.remove('on');});
  var secRef=document.getElementById('secRefresh');
  if(secRef)secRef.addEventListener('click',function(){parsedSections=parseSections();renderSectionList();});

  document.getElementById('undoBtn').addEventListener('click',doUndo);
  var redoBtnEl=document.getElementById('redoBtn');
  if(redoBtnEl)redoBtnEl.addEventListener('click',doRedo);

  // Keyboard shortcuts (ignored while typing in a field). Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Cmd/Ctrl+S download.
  document.addEventListener('keydown',function(e){
    if(!document.getElementById('studio').classList.contains('on'))return;
    var t=e.target,tag=t&&t.tagName?t.tagName.toLowerCase():'';
    if(tag==='input'||tag==='textarea'||(t&&t.isContentEditable))return;
    var mod=e.metaKey||e.ctrlKey;
    if(!mod)return;
    var k=e.key.toLowerCase();
    if(k==='z'&&!e.shiftKey){e.preventDefault();doUndo();}
    else if((k==='z'&&e.shiftKey)||k==='y'){e.preventDefault();doRedo();}
    else if(k==='s'){e.preventDefault();var db=document.getElementById('dlBtn');if(db)db.click();}
  });

  // -- Device toggle ---------------------------------------------
  ['Desktop','Tablet','Mobile'].forEach(function(d){
    var btn=document.getElementById('dev'+d);
    if(!btn)return;
    btn.addEventListener('click',function(){
      document.querySelectorAll('.dev-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var wrap=document.getElementById('previewWrap');
      wrap.classList.remove('tablet','mobile');
      if(d==='Tablet')wrap.classList.add('tablet');
      if(d==='Mobile')wrap.classList.add('mobile');
    });
  });

  // -- Fullscreen preview ----------------------------------------
  document.getElementById('fullscreenBtn').addEventListener('click',function(){
    if(!gHTML)return;
    var overlay=document.getElementById('fsOverlay');
    var pfFull=document.getElementById('pfFull');
    var title=document.getElementById('stitle').textContent;
    document.getElementById('fsTitle').textContent=title;
    pfFull.srcdoc=gHTML;
    overlay.classList.add('on');
  });
  document.getElementById('fsClose').addEventListener('click',function(){
    document.getElementById('fsOverlay').classList.remove('on');
    document.getElementById('pfFull').srcdoc='';
  });
  var fsNewTabEl=document.getElementById('fsNewTab');
  if(fsNewTabEl)fsNewTabEl.addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var w=window.open('','_blank');
    if(!w){toast('Allow pop-ups to open the preview in a new tab',5000);return;}
    w.document.open();w.document.write(gHTML);w.document.close();
  });

  // -- Color palette swatches ------------------------------------
  document.querySelectorAll('.pal').forEach(function(swatch){
    swatch.addEventListener('click',function(){
      var palette=swatch.dataset.palette;
      var msg='Change the entire color scheme to '+palette+'. Update all buttons, accents, gradients, and highlights to use this color consistently throughout the site.';
      document.getElementById('ci').value=msg;
      doChat();
    });
  });

  // -- Share preview link ----------------------------------------
  document.getElementById('shareBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var modal=document.getElementById('shareModal');
    var urlInput=document.getElementById('shareUrlInput');
    urlInput.value='Generating link...';
    modal.classList.add('on');
    fetch('/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.url){urlInput.value=d.url;}
      else{urlInput.value='Error - try again';}
    })
    .catch(function(){urlInput.value='Error - try again';});
    // Track share event
    fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'share'})});
  });
  document.getElementById('shareCopyBtn').addEventListener('click',function(){
    var url=document.getElementById('shareUrlInput').value;
    if(url&&url!=='Generating link...'&&url!=='Error - try again'){
      navigator.clipboard.writeText(url).then(function(){toast('🔗 Preview link copied!',3000);});
    }
  });
  document.getElementById('shareCloseBtn').addEventListener('click',function(){
    document.getElementById('shareModal').classList.remove('on');
  });

  // -- SEO Editor ------------------------------------------------
  document.getElementById('seoBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    // Extract title using string search
    var tStart=gHTML.indexOf('<title>'),tEnd=gHTML.indexOf('</title>');
    var currentTitle=tStart>-1&&tEnd>-1?gHTML.slice(tStart+7,tEnd).trim():'';
    // Extract description using string search
    var dStart=gHTML.indexOf('name="description"');
    var currentDesc='';
    if(dStart>-1){
      var cIdx=gHTML.indexOf('content="',dStart);
      if(cIdx>-1){var cEnd=gHTML.indexOf('"',cIdx+9);currentDesc=gHTML.slice(cIdx+9,cEnd);}
    }
    document.getElementById('seoTitle').value=currentTitle;
    document.getElementById('seoDesc').value=currentDesc;
    updateSeoPreview();
    document.getElementById('seoModal').classList.add('on');
  });
  function updateSeoPreview(){
    var t=document.getElementById('seoTitle').value||'Your Page Title';
    var d=document.getElementById('seoDesc').value||'Your meta description will appear here.';
    document.getElementById('seoPrevTitle').textContent=t.slice(0,60);
    document.getElementById('seoPrevDesc').textContent=d.slice(0,160);
  }
  document.getElementById('seoTitle').addEventListener('input',updateSeoPreview);
  document.getElementById('seoDesc').addEventListener('input',updateSeoPreview);
  ['seoClose','seoCancelBtn'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(){document.getElementById('seoModal').classList.remove('on');});
  });
  document.getElementById('seoSaveBtn').addEventListener('click',function(){
    if(!gHTML)return;
    var title=document.getElementById('seoTitle').value.trim();
    var desc=document.getElementById('seoDesc').value.trim();
    if(!title&&!desc){toast('Enter a title or description first');return;}
    var updated=gHTML;
    if(title){
      var tStart=updated.indexOf('<title>');
      var tEnd=updated.indexOf('</title>');
      if(tStart>-1&&tEnd>-1){updated=updated.slice(0,tStart)+'<title>'+title+'</title>'+updated.slice(tEnd+8);}
      else{updated=updated.replace('<head>','<head><title>'+title+'</title>');}
    }
    if(desc){
      var metaTag='<meta name="description" content="'+desc+'">';
      var mStart=updated.indexOf('<meta name="description"');
      if(mStart===-1)mStart=updated.indexOf("<meta name='description'");
      if(mStart>-1){var mEnd=updated.indexOf('>',mStart)+1;updated=updated.slice(0,mStart)+metaTag+updated.slice(mEnd);}
      else{updated=updated.replace('<head>','<head>'+metaTag);}
    }
    gHTML=updated;localStorage.setItem('wsh',gHTML);
    pushUndo(gHTML);bumpEditCount();
    setTimeout(function(){setPreview(gHTML);},50);
    document.getElementById('seoModal').classList.remove('on');
    toast('SEO settings applied!',3000);
  });

  // -- Font picker -----------------------------------------------
  document.querySelectorAll('.font-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}
      applyFontStack(btn.dataset.stack);
      document.querySelectorAll('.font-btn').forEach(function(b){b.classList.remove('sel');});
      btn.classList.add('sel');
      toast('Font changed to '+btn.querySelector('.font-btn-name').textContent+' — instant, no AI wait');
    });
  });

  // -- Regenerate section ----------------------------------------
  document.getElementById('regenSectionBtn').addEventListener('click',function(){
    if(!gHTML){toast('Generate a site first!');return;}
    var pick=document.getElementById('secPick');
    var open=pick.classList.toggle('on');
    this.classList.toggle('on',open);
  });
  document.querySelectorAll('#secPick .qe').forEach(function(chip){
    chip.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}
      var sec=chip.dataset.sec;
      document.getElementById('secPick').classList.remove('on');
      var rb=document.getElementById('regenSectionBtn');if(rb)rb.classList.remove('on');
      document.getElementById('ci').value='Completely redesign and rewrite the '+sec+' section with a fresh creative approach. Keep every other section exactly the same.';
      doChat();
    });
  });

  // -- Track page load analytics ---------------------------------

  // Inline onclick replacements
  var howBtn=document.getElementById('howBtn');
  if(howBtn)howBtn.addEventListener('click',function(){document.getElementById('how').scrollIntoView({behavior:'smooth'});});
  
  var n1=document.getElementById('nstep1nextBtn');
  if(n1)n1.addEventListener('click',function(){showNStep(2);});
  var n2b=document.getElementById('nstep2backBtn');
  if(n2b)n2b.addEventListener('click',function(){showNStep(1);});
  var n2n=document.getElementById('step2nextBtn');
  if(n2n)n2n.addEventListener('click',function(){validateToken();});
  var n3b=document.getElementById('nstep3backBtn');
  if(n3b)n3b.addEventListener('click',function(){showNStep(2);});
  var dmc=document.getElementById('deployModalClose');
  if(dmc)dmc.addEventListener('click',function(){document.getElementById('deployModal').classList.remove('on');});

    fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'visit'})}).catch(function(){});

  // -- Deploy modal -----------------------------------------------
  window.showNStep=function(n){
    [1,2,3].forEach(function(i){
      var el=document.getElementById('nstep'+i);
      if(el)el.style.display=i===n?'block':'none';
    });
  };

  window.validateToken=function(){
    var token=document.getElementById('netlifyToken').value.trim();
    var err=document.getElementById('tokenError');
    var btn=document.getElementById('nstep2next');
    if(!token){err.textContent='Please paste your token first.';err.classList.add('on');return;}
    btn.disabled=true;btn.textContent='Checking...';
    err.classList.remove('on');
    fetch('https://api.netlify.com/api/v1/user',{headers:{'Authorization':'Bearer '+token}})
    .then(function(r){return r.json();})
    .then(function(d){
      btn.disabled=false;btn.textContent='Verify token ->';
      if(d.email||d.full_name){
        localStorage.setItem('ws_netlify_token',token);
        var saved=localStorage.getItem('ws_netlify_name');
        if(saved)document.getElementById('netlifySiteName').value=saved;
        showNStep(3);
        toast('✅ Token verified! Welcome, '+(d.full_name||d.email)+'',3000);
      } else {
        err.textContent='Invalid token. Make sure you copied the full token from Netlify.';
        err.classList.add('on');
      }
    })
    .catch(function(){
      btn.disabled=false;btn.textContent='Verify token ->';
      err.textContent='Could not verify - check your internet connection and try again.';
      err.classList.add('on');
    });
  };

  // Live preview of site URL
  var siteNameInput=document.getElementById('netlifySiteName');
  if(siteNameInput){
    siteNameInput.addEventListener('input',function(){
      var val=siteNameInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
      var preview=document.getElementById('sitePreviewUrl');
      if(preview)preview.textContent=(val||'yoursite')+'.netlify.app';
    });
  }

  document.getElementById('deployBtn').addEventListener('click',function(){
    if(!unlocked){toast('🔒 Go Pro ($10/mo) to deploy your site!');return;}
    if(!gHTML){toast('Generate a site first!');return;}
    var savedToken=localStorage.getItem('ws_netlify_token');
    // If token already saved, skip to step 3
    if(savedToken){
      document.getElementById('netlifyToken').value=savedToken;
      var savedName=localStorage.getItem('ws_netlify_name');
      if(savedName)document.getElementById('netlifySiteName').value=savedName;
      showNStep(3);
    } else {
      showNStep(1);
    }
    document.getElementById('netlifyResult').classList.remove('on');
    document.getElementById('netlifyError').classList.remove('on');
    document.getElementById('deployModal').classList.add('on');
  });

  // Deploy tabs
  ['netlify','cf'].forEach(function(id){
    var tab=document.getElementById('dtab-'+id);
    var pane=document.getElementById('dpane-'+id);
    if(tab)tab.addEventListener('click',function(){
      document.querySelectorAll('.d-tab').forEach(function(t){t.classList.remove('active');});
      document.querySelectorAll('.deploy-pane').forEach(function(p){p.classList.remove('active');});
      tab.classList.add('active');
      pane.classList.add('active');
    });
  });

  // Netlify deploy
  document.getElementById('netlifyDeployBtn').addEventListener('click',function(){
    var token=document.getElementById('netlifyToken').value.trim();
    var siteName=document.getElementById('netlifySiteName').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/^-+|-+$/g,'');
    var btn=document.getElementById('netlifyDeployBtn');
    var result=document.getElementById('netlifyResult');
    var error=document.getElementById('netlifyError');
    if(!token){error.textContent='Please enter your Netlify Personal Access Token.';error.classList.add('on');return;}
    if(!gHTML){error.textContent='No site to deploy.';error.classList.add('on');return;}
    result.classList.remove('on');
    error.classList.remove('on');
    btn.disabled=true;btn.textContent='Deploying...';
    // Save token locally
    localStorage.setItem('ws_netlify_token',token);
    if(siteName)localStorage.setItem('ws_netlify_name',siteName);
    // Step 1: Create site on Netlify (if name given) or use default
    var headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'};
    var createBody=siteName?JSON.stringify({name:siteName}):'{}';
    fetch('https://api.netlify.com/api/v1/sites',{method:'POST',headers:headers,body:createBody})
    .then(function(r){
      if(r.status===422){
        // Site name taken, try without name
        return fetch('https://api.netlify.com/api/v1/sites',{method:'POST',headers:headers,body:'{}'});
      }
      return r;
    })
    .then(function(r){return r.json();})
    .then(function(site){
      if(!site.id){throw new Error(site.message||'Failed to create site');}
      var siteId=site.id;
      // Step 2: Deploy files using zip
      return createZipAndDeploy(token,siteId,gHTML);
    })
    .then(function(deployUrl){
      btn.disabled=false;btn.textContent='🚀 Deploy to Netlify';
      var link=document.getElementById('netlifyLiveUrl');
      link.href='https://'+deployUrl;
      link.textContent='https://'+deployUrl;
      result.classList.add('on');
      toast('🚀 Live at: https://'+deployUrl,8000);
      // Track deploy
      fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'deploy_netlify'})}).catch(function(){});
    })
    .catch(function(e){
      btn.disabled=false;btn.textContent='🚀 Deploy to Netlify';
      error.textContent='Deploy failed: '+(e.message||'Unknown error. Check your token and try again.');
      error.classList.add('on');
    });
  });

  // -- Email delivery on payment return -------------------------
  // (Email is stored in localStorage - remind user to download)
  document.getElementById('dlBtn').addEventListener('click',function(){
    if(!unlocked){toast('🔒 Go Pro ($10/mo) to download');return;}
    if(!gHTML)return;
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([gHTML],{type:'text/html'}));
    a.download=siteFilename()+'.html';a.click();
    toast('⬇️ Downloading your site!');
  });
  var copyBtnEl=document.getElementById('copyBtn');
  if(copyBtnEl)copyBtnEl.addEventListener('click',function(){
    if(!unlocked){toast('🔒 Go Pro ($10/mo) to copy your code');return;}
    if(!gHTML)return;
    function done(){toast('📋 Full HTML copied to clipboard!');}
    function fallback(){
      var ta=document.createElement('textarea');ta.value=gHTML;ta.style.position='fixed';ta.style.left='-9999px';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');done();}catch(err){toast('Could not copy - use Download instead',4000);}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(gHTML).then(done).catch(fallback);
    } else { fallback(); }
  });
  ['unlockBtn','lockPayBtn'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.addEventListener('click',doPayment);
  });

  // Restore on return
  var saved=localStorage.getItem('wsh');
  if(saved&&saved.length>100){
    gHTML=saved;
    if(unlocked){setTimeout(function(){
      openStudio(gHTML);applyUnlock();setTimeout(populateLiveColors,1200);
      var savedEmail=localStorage.getItem('ws_email');
      var msg=savedEmail?'🎉 Site unlocked! Sending to '+savedEmail+'...':'🎉 Site unlocked! Download or Deploy to go live.';
      toast(msg,6000);
      // Send email with site attached
      if(savedEmail&&gHTML){
        var tStart=gHTML.indexOf('<title>'),tEnd=gHTML.indexOf('</title>');
        var siteTitle=tStart>-1&&tEnd>-1?gHTML.slice(tStart+7,tEnd):'My Website';
        fetch('/send-email',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:savedEmail,html:gHTML,title:siteTitle})})
        .then(function(r){return r.json();})
        .then(function(d){if(d.ok)setTimeout(function(){toast('Email sent to '+savedEmail+'! Check your inbox.',6000);},3000);})
        .catch(function(){});
      }
      // If Netlify token saved, offer to deploy
      if(localStorage.getItem('ws_netlify_token')){
        setTimeout(function(){
          if(confirm('Deploy your site to Netlify now? Your token is already saved - takes about 10 seconds.')){
            document.getElementById('deployBtn').click();
          }
        },4000);
      }
      // Track payment
      fetch('/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'payment'})}).catch(function(){});
    },100);}
    else if(sessionStorage.getItem('ws_studio')==='1'){setTimeout(function(){openStudio(gHTML);},100);}
  }


  // Upload button
  var uploadBtn=document.getElementById('imgUploadBtn');
  var mobileUploadBtn=document.getElementById('imgMobileUpload');
  var fileInput=document.getElementById('imgFileInput');
  if(uploadBtn&&fileInput){
    uploadBtn.addEventListener('click',function(){fileInput.click();});
    fileInput.addEventListener('change',function(){addImagesToLibrary(fileInput.files);fileInput.value='';});
  }
  // Show mobile button on touch devices, hide on desktop
  if(mobileUploadBtn){
    var isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
    if(isTouch){
      mobileUploadBtn.style.display='flex';
      mobileUploadBtn.addEventListener('click',function(){if(fileInput)fileInput.click();});
    }
  }

  // Photo library collapse toggle
  var imgLibToggle=document.getElementById('imgLibToggle');
  var imgLibEl=document.getElementById('imgLibrary');
  if(imgLibToggle&&imgLibEl){
    imgLibToggle.addEventListener('click',function(){imgLibEl.classList.toggle('collapsed');});
  }
  // Design tools drawer toggle
  var ddToggle=document.getElementById('ddToggle');
  var ddEl=document.getElementById('designDrawer');
  if(ddToggle&&ddEl){
    ddToggle.addEventListener('click',function(){ddEl.classList.toggle('collapsed');});
  }

  // -- Slot modal wiring -----------------------------------------
  var slotModal=document.getElementById('slotModal');
  var slotCloseX=document.getElementById('slotModalClose');
  var slotUploadBtnEl=document.getElementById('slotUploadBtn');
  var slotFileInputEl=document.getElementById('slotFileInput');
  var slotDropEl=document.getElementById('slotDrop');
  if(slotCloseX)slotCloseX.addEventListener('click',function(){if(slotModal)slotModal.classList.remove('on');});
  if(slotModal)slotModal.addEventListener('click',function(e){if(e.target===slotModal)slotModal.classList.remove('on');});
  if(slotUploadBtnEl)slotUploadBtnEl.addEventListener('click',function(){if(slotFileInputEl)slotFileInputEl.click();});
  if(slotFileInputEl)slotFileInputEl.addEventListener('change',function(){
    if(slotFileInputEl.files&&slotFileInputEl.files[0])slotCompressAndFill(slotFileInputEl.files[0]);
    slotFileInputEl.value='';
  });
  if(slotDropEl){
    slotDropEl.addEventListener('click',function(){if(slotFileInputEl)slotFileInputEl.click();});
    slotDropEl.addEventListener('dragover',function(e){e.preventDefault();slotDropEl.classList.add('drag');});
    slotDropEl.addEventListener('dragleave',function(){slotDropEl.classList.remove('drag');});
    slotDropEl.addEventListener('drop',function(e){
      e.preventDefault();slotDropEl.classList.remove('drag');
      var files=e.dataTransfer.files;
      if(files&&files[0]&&files[0].type.startsWith('image/'))slotCompressAndFill(files[0]);
    });
  }

  // Dropzone click
  var dz=document.getElementById('imgDropzone');
  if(dz)dz.addEventListener('click',function(){if(fileInput)fileInput.click();});

  // Drag and drop on dropzone
  if(dz){
    dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('drag');});
    dz.addEventListener('dragleave',function(){dz.classList.remove('drag');});
    dz.addEventListener('drop',function(e){e.preventDefault();dz.classList.remove('drag');addImagesToLibrary(e.dataTransfer.files);});
  }

  // Drag and drop onto preview area
  // The iframe captures pointer events, so we disable it during drag
  var previewWrap=document.getElementById('previewWrap');
  var dropOverlay=document.getElementById('dropOverlay');
  var pfFrame=document.getElementById('pf');

  // When any drag starts on the page, disable iframe pointer events
  document.addEventListener('dragenter',function(e){
    if(e.dataTransfer&&e.dataTransfer.types&&(e.dataTransfer.types.includes('Files')||e.dataTransfer.types.indexOf('Files')>-1)){
      if(pfFrame)pfFrame.style.pointerEvents='none';
    }
  });
  // Re-enable when drag ends or leaves window
  document.addEventListener('dragend',function(){if(pfFrame)pfFrame.style.pointerEvents='';});
  document.addEventListener('dragleave',function(e){
    if(!e.relatedTarget||e.relatedTarget===document.documentElement){
      if(pfFrame)pfFrame.style.pointerEvents='';
      if(dropOverlay)dropOverlay.classList.remove('show');
    }
  });
  document.addEventListener('drop',function(){
    if(pfFrame)pfFrame.style.pointerEvents='';
  });

  if(previewWrap&&dropOverlay){
    previewWrap.addEventListener('dragover',function(e){
      if(e.dataTransfer&&(e.dataTransfer.types.includes('Files')||e.dataTransfer.types.indexOf('Files')>-1)){
        e.preventDefault();
        dropOverlay.classList.add('show');
      }
    });
    previewWrap.addEventListener('dragleave',function(e){
      if(!previewWrap.contains(e.relatedTarget)){
        dropOverlay.classList.remove('show');
      }
    });
    previewWrap.addEventListener('drop',function(e){
      e.preventDefault();
      dropOverlay.classList.remove('show');
      if(pfFrame)pfFrame.style.pointerEvents='';
      var files=e.dataTransfer.files;
      if(files.length>0&&files[0].type.startsWith('image/')){
        compressImage(files[0],function(dataUrl){
          var id='img_'+Date.now();
          imgLib.push({id:id,dataUrl:dataUrl,name:files[0].name});
          renderImgGrid();
          selectedImgId=id;
          renderImgGrid();
          document.getElementById('imgActions').style.display='flex';
          document.getElementById('imgActions').style.flexDirection='column';
          var lib=document.getElementById('imgLibrary');
          if(lib)lib.scrollIntoView({behavior:'smooth',block:'nearest'});
          toast('📷 Photo ready! Choose where to place it in the sidebar.',5000);
        });
      }
    });
  }

  // Image action buttons
  document.querySelectorAll('.img-action-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var action=btn.dataset.action;
      if(action==='cancel'){
        document.getElementById('imgActions').style.display='none';
        selectedImgId=null;
        renderImgGrid();
        return;
      }
      var img=imgLib.find(function(i){return i.id===selectedImgId;});
      if(!img){toast('Select a photo first');return;}
      if(!gHTML){toast('Generate a site first!');return;}
      injectImageIntoSite(img.dataUrl,action);
    });
  });

  }catch(domErr){
    // Show error visually so we can debug
    console.error('DOMContentLoaded error:', domErr);
    document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;bottom:10px;left:10px;background:red;color:white;padding:10px;z-index:999999;font-size:12px;max-width:400px;word-break:break-all">JS Error: '+domErr.message+'</div>');
    // Try to bind essential buttons anyway
    try{document.querySelectorAll('.type-btn').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.type-btn').forEach(function(x){x.classList.remove('sel');});b.classList.add('sel');selectedType=b.dataset.type==='OTHER'?'':b.dataset.type;document.getElementById('next1').classList.add('on');});});}catch(e2){}
    try{document.getElementById('next1').addEventListener('click',function(){if(selectedType||document.getElementById('customPrompt').value.trim())showPanel(2);});}catch(e2){}
    try{document.getElementById('next2').addEventListener('click',function(){buildSummary();showPanel(3);});}catch(e2){}
    try{document.getElementById('back2').addEventListener('click',function(){showPanel(1);});}catch(e2){}
    try{document.getElementById('back3').addEventListener('click',function(){showPanel(2);});}catch(e2){}
    try{document.getElementById('gbtn').addEventListener('click',doGenerate);}catch(e2){}
  }
});

function buildSummary(){
  var name=document.getElementById('bizName').value.trim();
  var extra=document.getElementById('bizExtra').value.trim();
  var cp=document.getElementById('customPrompt').value.trim();
  var rows=[
    {l:'Type',v:cp||selectedType||'Website'},
    {l:'Style',v:selectedStyle||'AI decides'},
    {l:'Name',v:name||'AI will create'},
    {l:'Notes',v:extra||'-'}
  ];
  document.getElementById('summaryGrid').innerHTML=rows.map(function(r){
    return '<div class="s-row"><div class="s-lbl">'+r.l+'</div><div class="s-val">'+r.v+'</div></div>';
  }).join('');
}

function buildPrompt(){
  var name=document.getElementById('bizName').value.trim();
  var extra=document.getElementById('bizExtra').value.trim();
  var cp=document.getElementById('customPrompt').value.trim();
  if(cp&&selectedType==='__c__'){
    var pts=[cp];
    if(name)pts.push('Business name: "'+name+'"');
    if(selectedStyle)pts.push('Style: '+selectedStyle);
    return pts.join('. ');
  }
  var pts=[];
  if(selectedType&&selectedType!=='__c__')pts.push('Build a '+selectedType);
  if(name)pts.push('Business name: "'+name+'"');
  if(selectedStyle)pts.push('Style: '+selectedStyle);
  if(extra)pts.push(extra);
  return pts.join('. ')||'Build a professional business website';
}

function doGenerate(){
  var prompt=buildPrompt();
  var btn=document.getElementById('gbtn'),ld=document.getElementById('loading'),
      ga=document.getElementById('gen-area'),lt=document.getElementById('loadTxt'),
      lb=document.getElementById('loadBar'),pf=document.getElementById('p3foot');
  btn.disabled=true;document.getElementById('gbtnTxt').textContent='Growing...';
  ga.style.display='none';ld.classList.add('on');lb.style.display='block';pf.style.display='none';

  // Open studio immediately with skeleton showing
  document.getElementById('studio').classList.add('on');
  document.body.style.overflow='hidden';
  setStudioReady(false);
  var skel=document.getElementById('skelWrap');
  if(skel)skel.classList.add('show');
  // Show loading messages inside skeleton
  var skelMsg=document.getElementById('skelMsg');

  var skelProg=document.getElementById('skelProgress');
  function _loadPhase(el){
    if(el<3)return 'Planting your prompt...';
    if(el<7)return 'Sketching the layout...';
    if(el<13)return 'Designing your hero section...';
    if(el<20)return 'Building your sections and feature cards...';
    if(el<30)return 'Writing your copy...';
    if(el<42)return 'Styling the navigation and colors...';
    if(el<58)return 'Adding finishing touches...';
    if(el<80)return 'Polishing the details...';
    return 'Finalizing your site... ('+el+'s)';
  }
  var _t0=Date.now(),iv=setInterval(function(){
    var _el=Math.round((Date.now()-_t0)/1000);
    var _m=_loadPhase(_el);
    lt.textContent=_m;
    if(skelMsg)skelMsg.textContent=_m;
    var _pct=92*(1-Math.exp(-_el/38));
    if(skelProg)skelProg.style.width=_pct.toFixed(1)+'%';
  },800);
  var _ac=(typeof AbortController!=='undefined')?new AbortController():null;
  var _to=_ac?setTimeout(function(){try{_ac.abort();}catch(e){}},150000):0;
  fetch('/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt}),signal:_ac?_ac.signal:undefined})
  .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error: '+t.slice(0,100)}};}});})
  .then(function(r){
    clearInterval(iv);clearTimeout(_to);var _spf=document.getElementById('skelProgress');if(_spf&&r.ok)_spf.style.width='100%';ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    if(!r.ok){
      if(r.d.error==='RATE_LIMITED_FREE'){
        var _ka=document.getElementById('skelWrap');if(_ka)_ka.classList.remove('show');var _kb=document.getElementById('studio');if(_kb)_kb.classList.remove('on');document.body.style.overflow='';
        toast('🌱 This Gemini key hit a FREE-tier quota. If you enabled billing, the key in your Worker may belong to a different Google project than the billed one.',15000);return;
      }
      if(r.d.error==='RATE_LIMITED'){
        var secs=60,tel=document.getElementById('toast');
        tel.textContent='⏳ High demand - retrying in '+secs+'s...';tel.classList.add('on');
        var cd=setInterval(function(){secs--;tel.textContent='⏳ High demand - retrying in '+secs+'s...';if(secs<=0){clearInterval(cd);tel.classList.remove('on');doGenerate();}},1000);
        return;
      }
      var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.remove('show');var _st=document.getElementById('studio');if(_st)_st.classList.remove('on');document.body.style.overflow='';try{console.error('[Websprout] /generate failed:',r.d.error);}catch(e3){}toast('🌱 '+(r.d.error||'Please try again'),12000);return;
    }
    gHTML=r.d.html;localStorage.setItem('wsh',gHTML);undoStack=[gHTML];redoStack=[];editCount=0;var ec=document.getElementById('editCounter');if(ec)ec.style.display='none';refreshHistoryBtns();document.querySelectorAll('.font-btn.sel').forEach(function(b){b.classList.remove('sel');});var sp=document.getElementById('secPick');if(sp)sp.classList.remove('on');openStudio(gHTML);setTimeout(populateLiveColors,1200);try{if(r.d.siteId){window._wsSite=r.d.siteId;window._wsKey=r.d.formKey;localStorage.setItem('ws_site',r.d.siteId);localStorage.setItem('ws_key',r.d.formKey||'');}if(r.d.inboxUrl){window._wsInbox=r.d.inboxUrl;localStorage.setItem('ws_inbox',r.d.inboxUrl);console.log('%c[Websprout] Form inbox for this site -> '+r.d.inboxUrl,'color:#2d7a3a;font-weight:700');setTimeout(function(){var tl=document.getElementById('toast');if(tl){tl.innerHTML='📬 Form inbox ready — <u style="cursor:pointer">click to open &amp; save the link</u>';tl.classList.add('on');tl.onclick=function(){window.open(r.d.inboxUrl,'_blank');};setTimeout(function(){tl.classList.remove('on');tl.onclick=null;},10000);}},2600);}}catch(e4){}
  })
  .catch(function(e){
    clearInterval(iv);clearTimeout(_to);ld.classList.remove('on');lb.style.display='none';
    btn.disabled=false;document.getElementById('gbtnTxt').textContent='Regrow';
    ga.style.display='block';pf.style.display='flex';
    var _sk=document.getElementById('skelWrap');if(_sk)_sk.classList.remove('show');var _st=document.getElementById('studio');if(_st)_st.classList.remove('on');document.body.style.overflow='';try{console.error('[Websprout] /generate fetch error:',e);}catch(e3){}toast('🌱 '+((e&&e.name==='AbortError')?'Taking longer than expected — please try again':((e&&e.message==='Failed to fetch')?'Could not reach server':((e&&e.message)||'Please try again'))),12000);
  });
}

// -- Business Info Panel --------------------------------------
(function(){
  var header=document.getElementById('bizPanelHeader');
  var fields=document.getElementById('bizFields');
  var toggle=document.getElementById('bizPanelToggle');
  if(header){
    header.addEventListener('click',function(){
      var open=fields.classList.toggle('open');
      toggle.classList.toggle('open',open);
    });
  }

  var applyBtn=document.getElementById('bizApplyBtn');
  if(applyBtn){
    applyBtn.addEventListener('click',function(){
      if(!gHTML){toast('Generate a site first!');return;}

      var name=document.getElementById('bizInfoName').value.trim();
      var email=document.getElementById('bizInfoEmail').value.trim();
      var phone=document.getElementById('bizInfoPhone').value.trim();
      var addr=document.getElementById('bizInfoAddress').value.trim();
      var formEmail=document.getElementById('bizInfoForm').value.trim();
      var booking=document.getElementById('bizInfoBooking').value.trim();
      var hours=(document.getElementById('bizInfoHours')||{}).value;hours=hours?hours.trim():'';

      if(!name&&!email&&!phone&&!addr&&!formEmail&&!booking&&!hours){toast('Fill in at least one field first');return;}

      var updated=gHTML;
      var count=0;

      function rep(html,patterns,val){
        if(!val)return html;
        var before=html;
        patterns.forEach(function(p){html=html.split(p).join(val);});
        if(html!==before)count++;
        return html;
      }

      // Business name: replace tokens AND the real invented brand (detected from the live preview or <title>)
      if(name){
        updated=rep(updated,['[Your Business Name]','[Business Name]','[Company Name]','[Your Company]','[Your Name]'],name);
        var oldBrand='';
        try{var _pf=document.getElementById('pf');var _pd=_pf&&(_pf.contentDocument||_pf.contentWindow.document);if(_pd){var _bd=_pd.querySelector('[data-ws-field="brand"]');if(_bd&&_bd.textContent.trim())oldBrand=_bd.textContent.trim();}}catch(e){}
        if(!oldBrand){var _a=updated.indexOf('<title>'),_b=updated.indexOf('</title>');if(_a>-1&&_b>_a){var _t=updated.slice(_a+7,_b);_t=_t.split('|')[0];_t=_t.split(' - ')[0];oldBrand=_t.trim();}}
        if(oldBrand&&oldBrand.length>1&&oldBrand!==name){updated=updated.split(oldBrand).join(name);count++;}
        // Persist the new brand so the publish slug, download filename and saved-projects name all reflect the rename
        try{var _sk=window._wsSite||localStorage.getItem('ws_site')||'';if(_sk){var _ik='ws_info_'+_sk,_io={};try{_io=JSON.parse(localStorage.getItem(_ik)||'{}');}catch(_e2){}_io.brand=name;localStorage.setItem(_ik,JSON.stringify(_io));}}catch(_e3){}
      }

      // Email replacements - also update mailto: links and form actions
      if(email){
        updated=rep(updated,[
          '[your@email.com]','[Your Email]','[your email]',
          '[Email Address]','[your@business.com]','[youremail@example.com]',
          'your@email.com','hello@example.com','info@example.com',
          'contact@example.com','support@example.com'
        ],email);
        // Update mailto: links
        updated=updated.replace(/mailto:[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,'mailto:'+email);
        // Update contact form action if it points to a placeholder
        updated=updated.replace(/action="[^"]*placeholder[^"]*"/g,'action="mailto:'+email+'"');
        count++;
      }

      // Phone replacements
      if(phone){
        // clean tel: hrefs to digits first, so taps dial correctly
        var telD=phone.replace(/[^0-9+]/g,'');
        updated=updated.split('tel:[Your Phone]').join('tel:'+telD);
        updated=updated.split('tel:[Phone]').join('tel:'+telD);
        updated=updated.split('tel:[Your Phone Number]').join('tel:'+telD);
      }
      updated=rep(updated,[
        '[Your Phone]','[Your Phone Number]','[Phone Number]',
        '[Phone]','[(555) 000-0000]','[555-000-0000]',
        '(555) 000-0000','555-000-0000','(000) 000-0000'
      ],phone);

      // Address replacements
      updated=rep(updated,[
        '[Your Address]','[Your Location]','[Address]',
        '[City, State]','[Your City, State]','[Street Address, City, State]'
      ],addr);

      // Booking link replacements (Calendly / Cal.com / Square scheduler)
      updated=rep(updated,[
        '[Your Booking Link]','[Booking Link]','[Your Scheduling Link]',
        '[Schedule Link]','[Your Calendar Link]','[Booking URL]'
      ],booking);

      // Business hours replacements
      updated=rep(updated,[
        '[Your Hours]','[Business Hours]','[Your Business Hours]','[Hours]','[Hours of Operation]'
      ],hours);

      // Formspree: wire up all contact forms
      if(formEmail){
        var formspreeEndpoint='https://formspree.io/f/'+formEmail.replace('@','%40');
        // Replace any existing form actions pointing to # or empty or placeholders
        var formCount=0;
        updated=updated.replace(/<form([^>]*?)action="[^"]*"([^>]*?)>/gi,function(match,pre,post){
          formCount++;
          return '<form'+pre+'action="'+formspreeEndpoint+'"'+post+'>';
        });
        // Forms with no action attribute
        updated=updated.replace(/<form([^>]*?)(?!action)>/gi,function(match,attrs){
          if(match.indexOf('action=')>-1)return match;
          formCount++;
          return '<form'+attrs+' action="'+formspreeEndpoint+'" method="POST">';
        });
        // Add hidden _replyto field to all forms if not present
        updated=updated.replace(/<form([^>]*?)>/gi,function(match){
          var hasReplyto=updated.indexOf('name="_replyto"')>-1;
          if(hasReplyto)return match;
          return match+'<input type="hidden" name="_replyto" value="'+formEmail+'">';
        });
        // Turn on native instant email alerts + dashboard tracking for this site
        try{var _s=window._wsSite||localStorage.getItem('ws_site')||'';var _k=window._wsKey||localStorage.getItem('ws_key')||'';if(_s&&_k){fetch('/api/inbox/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:_s,key:_k,email:formEmail})}).catch(function(){});}}catch(e){}
        count++;
        toast('Leads will be emailed to '+formEmail+' instantly and saved to your dashboard.',6000);
      }

      if(count===0&&updated===gHTML){
        toast('No placeholders found — your site may already have real info');
        return;
      }

      gHTML=updated;
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      setTimeout(function(){setPreview(gHTML);},50);
      try{if(window._wsTrackNow)setTimeout(window._wsTrackNow,300);}catch(e){}
      toast('Business info applied to your site!',3500);
    });
  }
})();

// -- Click-to-edit text ----------------------------------------
var editModeOn=false;

function toggleEditMode(){
  editModeOn=!editModeOn;
  var btn=document.getElementById('editModeBtn');
  var ind=document.getElementById('editIndicator');
  var pf=document.getElementById('pf');
  if(btn)btn.classList.toggle('on',editModeOn);
  if(ind)ind.classList.toggle('on',editModeOn);
  // Tell iframe to enable/disable edit mode
  if(pf&&pf.contentWindow){
    pf.contentWindow.postMessage({type:'wsSetEditMode',active:editModeOn},'*');
  }
}

// Receive text edits from iframe
window.addEventListener('message',function(e){
  if(!e.data||typeof e.data!=='object')return;
  if(e.data.type==='wsTextEdit'&&e.data.oldOuter&&e.data.newOuter){
    var idx=gHTML.indexOf(e.data.oldOuter);
    if(idx>-1){
      gHTML=gHTML.slice(0,idx)+e.data.newOuter+gHTML.slice(idx+e.data.oldOuter.length);
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      // Don't re-render - edit is already visible in iframe
      addMsg('ai','Text updated! Double-click anything else to keep editing.');
    }
  }
  if(e.data.type==='wsSlotClick'){
    openSlotPicker(e.data.slotId||'image',e.data.label||'Add photo');
  }
});

// -- Instant color replacement ---------------------------------
function extractSiteColors(){
  if(!gHTML)return[];
  var sStart=gHTML.indexOf('<style>');
  var sEnd=gHTML.indexOf('</style>');
  if(sStart===-1||sEnd===-1)return[];
  var css=gHTML.slice(sStart+7,sEnd);
  var counts={};
  var pos=0;
  while(pos<css.length){
    var hi=css.indexOf('#',pos);
    if(hi===-1)break;
    var hex=css.slice(hi,hi+7);
    if(hex.length===7){
      var valid=true;
      for(var i=1;i<7;i++){
        var ch=hex.charCodeAt(i);
        if(!((ch>=48&&ch<=57)||(ch>=65&&ch<=70)||(ch>=97&&ch<=102))){valid=false;break;}
      }
      if(valid){
        var lo=hex.toLowerCase();
        // Skip near-white (#e- and above), near-black (#1- and below), and pure grays
        var r=parseInt(lo.slice(1,3),16);
        var g=parseInt(lo.slice(3,5),16);
        var b=parseInt(lo.slice(5,7),16);
        var isGray=Math.abs(r-g)<18&&Math.abs(g-b)<18&&Math.abs(r-b)<18;
        var isWhite=r>220&&g>220&&b>220;
        var isBlack=r<30&&g<30&&b<30;
        if(!isGray&&!isWhite&&!isBlack){
          counts[lo]=(counts[lo]||0)+1;
        }
      }
    }
    pos=hi+1;
  }
  return Object.keys(counts)
    .filter(function(col){return counts[col]>0;})
    .sort(function(a,b){return counts[b]-counts[a];})
    .slice(0,8);
}

// Instant font swap — injects a removable override block, no AI round-trip
function applyFontStack(stack){
  if(!gHTML){toast('Generate a site first!');return;}
  var block='<style id="_ws_font">body,body *{font-family:'+stack+' !important}</'+'style>';
  var marker='<style id="_ws_font">';
  var s=gHTML.indexOf(marker);
  if(s>-1){
    var e=gHTML.indexOf('</'+'style>',s);
    if(e>-1)e+=8; else e=s+marker.length;
    gHTML=gHTML.slice(0,s)+block+gHTML.slice(e);
  } else {
    var h=gHTML.indexOf('</head>');
    if(h>-1)gHTML=gHTML.slice(0,h)+block+gHTML.slice(h);
    else gHTML=block+gHTML;
  }
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
}

function applyColorChange(oldColor,newColor){
  if(!gHTML||!oldColor||!newColor||oldColor===newColor)return;
  var lo=oldColor.toLowerCase();
  var up=oldColor.toUpperCase();
  var updated=gHTML.split(lo).join(newColor).split(up).join(newColor);
  if(oldColor!==lo&&oldColor!==up)updated=updated.split(oldColor).join(newColor);
  if(updated===gHTML)return;
  gHTML=updated;
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  setTimeout(populateLiveColors,600); // refresh swatches after render
}

function populateLiveColors(){
  var panel=document.getElementById('liveColorPanel');
  if(!panel)return;
  var colors=extractSiteColors();
  if(colors.length===0){
    panel.innerHTML='<div style="font-size:11px;color:rgba(255,255,255,.2)">Generate a site first</div>';
    return;
  }
  panel.innerHTML=colors.map(function(col){
    return '<div class="live-color-swatch" title="'+col+'" style="background:'+col+'">'+'<input type="color" class="color-input-hidden" value="'+col+'" data-orig="'+col+'"></div>';
  }).join('');
  panel.querySelectorAll('.live-color-swatch').forEach(function(sw){
    var inp=sw.querySelector('.color-input-hidden');
    sw.addEventListener('click',function(){inp.click();});
    inp.addEventListener('input',function(){
      var orig=inp.dataset.orig;
      applyColorChange(orig,inp.value);
      inp.dataset.orig=inp.value;
      sw.style.background=inp.value;
    });
  });
}

// -- Section Manager -------------------------------------------
var parsedSections=[];

function parseSections(){
  if(!gHTML)return[];
  var results=[];
  var structural=['<nav','<header','<section','<footer','<main','<aside'];
  structural.forEach(function(tag){
    var pos=0;
    while(true){
      var found=gHTML.indexOf(tag,pos);
      if(found===-1)break;
      // Confirm it's a real tag (next char is space or >)
      var nc=gHTML[found+tag.length];
      if(nc&&nc!==' '&&nc!=='>'){pos=found+1;continue;}
      var tagEnd=gHTML.indexOf('>',found);
      if(tagEnd===-1)break;
      var opening=gHTML.slice(found,tagEnd+1);
      // Extract id or class for naming
      var nm='';
      var idI=opening.indexOf('id="');
      if(idI>-1)nm=opening.slice(idI+4,opening.indexOf('"',idI+4));
      if(!nm){var clI=opening.indexOf('class="');if(clI>-1)nm=opening.slice(clI+7,opening.indexOf('"',clI+7)).split(' ')[0];}
      var tagName=tag.replace('<','');
      var label=nm||tagName;
      label=label.charAt(0).toUpperCase()+label.slice(1).replace(/[-_]/g,' ');
      var isHidden=opening.indexOf('display:none')>-1||opening.indexOf('display: none')>-1;
      results.push({tag:tagName,label:label,start:found,hidden:isHidden});
      pos=found+1;
    }
  });
  results.sort(function(a,b){return a.start-b.start;});
  return results;
}

function showSectionManager(){
  if(!gHTML){toast('Generate a site first');return;}
  parsedSections=parseSections();
  renderSectionList();
  document.getElementById('secModal').classList.add('on');
}

function renderSectionList(){
  var list=document.getElementById('secList');
  if(!list)return;
  if(parsedSections.length===0){
    list.innerHTML='<div style="font-size:13px;color:rgba(255,255,255,.3);text-align:center;padding:20px">No sections detected</div>';
    return;
  }
  list.innerHTML=parsedSections.map(function(sec,i){
    return '<div class="sec-item'+(sec.hidden?' hidden-sec':'')+'" data-idx="'+i+'">'+
      '<span class="sec-tag">'+sec.tag+'</span>'+
      '<span class="sec-name">'+sec.label+'</span>'+
      '<button class="sec-btn'+(sec.hidden?' eye-off':'')+'" data-action="toggle" data-idx="'+i+'" title="'+(sec.hidden?'Show':'Hide')+'">'+
        (sec.hidden?'&#128065;':'&#128065;')+'</button>'+
      '<button class="sec-btn" data-action="up" data-idx="'+i+'" title="Move up">&#8679;</button>'+
      '<button class="sec-btn" data-action="down" data-idx="'+i+'" title="Move down">&#8681;</button>'+
    '</div>';
  }).join('');
  list.querySelectorAll('.sec-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var action=btn.dataset.action;
      var idx=parseInt(btn.dataset.idx);
      if(action==='toggle')toggleSection(idx);
      else if(action==='up')moveSectionUp(idx);
      else if(action==='down')moveSectionDown(idx);
    });
  });
}

function findSectionBounds(sec){
  // sec.start is the char position in gHTML when parseSections ran.
  // Since gHTML may have changed, verify the tag still starts there.
  var start=sec.start;
  var tagOpen='<'+sec.tag;

  // Verify it's still there; if not, search nearby
  if(gHTML.slice(start,start+tagOpen.length)!==tagOpen){
    // Search for it by scanning gHTML
    var best=-1;
    var pos=0;
    while(true){
      var found=gHTML.indexOf(tagOpen,pos);
      if(found===-1)break;
      var nc=gHTML[found+tagOpen.length];
      if(nc===' '||nc==='>'){
        // Check if id/class matches our label hint
        var tagEnd=gHTML.indexOf('>',found);
        var opening=gHTML.slice(found,tagEnd+1);
        var labelLow=sec.label.toLowerCase().replace(/ /g,'-');
        if(opening.indexOf(labelLow)>-1||opening.indexOf(sec.label.toLowerCase())>-1){
          best=found;break;
        }
        if(best===-1)best=found; // fallback: first match of this tag type
      }
      pos=found+1;
    }
    if(best===-1)return null;
    start=best;
  }

  // Walk forward finding matching close tag, respecting nesting
  var closeTag='</'+sec.tag+'>';
  var depth=0,p=start,end=-1;
  var openTag='<'+sec.tag;
  while(p<gHTML.length){
    if(gHTML.slice(p,p+openTag.length)===openTag){
      var nc=gHTML[p+openTag.length];
      if(nc===' '||nc==='>'){depth++;}
    } else if(gHTML.slice(p,p+closeTag.length)===closeTag){
      depth--;
      if(depth===0){end=p+closeTag.length;break;}
    }
    p++;
  }
  if(end===-1)return null;
  return{start:start,end:end};
}

function toggleSection(idx){
  var sec=parsedSections[idx];
  if(!sec)return;
  var bounds=findSectionBounds(sec);
  if(!bounds){toast('Could not find section in HTML');return;}
  var opening=gHTML.slice(bounds.start,gHTML.indexOf('>',bounds.start)+1);
  var newOpening;
  if(sec.hidden){
    // Show: remove display:none
    newOpening=opening.replace('display:none;','').replace('display:none','').replace('display: none;','').replace('display: none','');
  } else {
    // Hide: inject display:none into style
    if(opening.indexOf('style="')>-1){
      newOpening=opening.replace('style="','style="display:none;');
    } else {
      newOpening=opening.replace('>',' style="display:none">');
    }
  }
  var openEnd=gHTML.indexOf('>',bounds.start)+1;
  gHTML=gHTML.slice(0,bounds.start)+newOpening+gHTML.slice(openEnd);
  sec.hidden=!sec.hidden;
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  renderSectionList();
}

function moveSectionUp(idx){
  if(idx===0)return;
  swapSections(idx-1,idx);
}

function moveSectionDown(idx){
  if(idx>=parsedSections.length-1)return;
  swapSections(idx,idx+1);
}

function swapSections(idxA,idxB){
  // Always re-parse before swapping to get current positions
  parsedSections=parseSections();
  if(idxA>=parsedSections.length||idxB>=parsedSections.length)return;
  var secA=parsedSections[idxA];
  var secB=parsedSections[idxB];
  if(!secA||!secB)return;
  var bA=findSectionBounds(secA);
  var bB=findSectionBounds(secB);
  if(!bA){toast('Could not find section A');return;}
  if(!bB){toast('Could not find section B');return;}
  // Ensure A is before B
  if(bA.start>bB.start){var tmp=bA;bA=bB;bB=tmp;}
  // Sanity check — bounds should not overlap
  if(bA.end>bB.start){toast('Sections overlap, cannot reorder');return;}
  var htmlA=gHTML.slice(bA.start,bA.end);
  var htmlB=gHTML.slice(bB.start,bB.end);
  var between=gHTML.slice(bA.end,bB.start);
  gHTML=gHTML.slice(0,bA.start)+htmlB+between+htmlA+gHTML.slice(bB.end);
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},50);
  parsedSections=parseSections();
  renderSectionList();
  toast('Section moved!',2000);
}

// -- Image Slot System -----------------------------------------
var currentSlotId=null;

// Listen for slot clicks from inside the preview iframe
window.addEventListener('message',function(e){
  if(!e.data||typeof e.data!=='object')return;
  if(e.data.type==='wsSlotClick'){
    openSlotPicker(e.data.slotId||'image',e.data.label||'Add photo');
  }
});

function openSlotPicker(slotId,label){
  currentSlotId=slotId;
  var title=document.getElementById('slotModalTitle');
  if(title)title.textContent='Add photo to: '+label;
  renderSlotLibGrid();
  document.getElementById('slotModal').classList.add('on');
}

function renderSlotLibGrid(){
  var grid=document.getElementById('slotLibGrid');
  if(!grid)return;
  if(!imgLib||imgLib.length===0){
    grid.innerHTML='<div class="slot-lib-empty" style="grid-column:1/-1">No photos yet - upload one above</div>';
    return;
  }
  grid.innerHTML=imgLib.map(function(img){
    return '<div class="slot-lib-thumb" data-imgid="'+img.id+'"><img src="'+img.dataUrl+'" alt=""></div>';
  }).join('');
  grid.querySelectorAll('.slot-lib-thumb').forEach(function(thumb){
    thumb.addEventListener('click',function(){
      var found=imgLib.find(function(i){return i.id===thumb.dataset.imgid;});
      if(found)fillSlot(found.dataUrl);
    });
  });
}

function fillSlot(dataUrl){
  if(!gHTML||!currentSlotId)return;
  document.getElementById('slotModal').classList.remove('on');
  var pf=document.getElementById('pf');

  try{
    var doc=pf.contentDocument||pf.contentWindow.document;
    var slot=doc.querySelector('[data-slot="'+currentSlotId+'"]');
    if(!slot)slot=doc.querySelector("[data-slot='"+currentSlotId+"']");

    if(slot){
      var h=slot.style.height||'320px';
      var br=slot.style.borderRadius||'8px';

      // Replace slot in live DOM - user sees it immediately, no re-render needed
      var container=doc.createElement('div');
      container.setAttribute('data-slot-filled',currentSlotId);
      container.style.cssText='width:100%;height:'+h+';border-radius:'+br+';overflow:hidden;position:relative';
      // If the slot was a positioned background layer (e.g. full-bleed hero bg), keep it
      // positioned so the photo stays BEHIND the content instead of popping into the flow.
      try{
        var iwin=pf.contentWindow;
        var csOld=iwin&&iwin.getComputedStyle?iwin.getComputedStyle(slot):null;
        if(csOld&&(csOld.position==='absolute'||csOld.position==='fixed')){
          container.style.position=csOld.position;
          ['top','left','right','bottom','width','height','zIndex','inset'].forEach(function(p){
            if(slot.style[p])container.style[p]=slot.style[p];
          });
          if(!slot.style.top&&!slot.style.inset){container.style.top='0';container.style.left='0';container.style.right='0';container.style.bottom='0';}
          if(csOld.zIndex&&csOld.zIndex!=='auto'&&!slot.style.zIndex)container.style.zIndex=csOld.zIndex;
        }
      }catch(e){}
      var img=doc.createElement('img');
      img.src=dataUrl;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
      container.appendChild(img);
      slot.parentNode.replaceChild(container,slot);

      // Wire the new filled slot immediately (hover overlay + click to replace)
      var ov=doc.createElement('div');
      ov.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;border-radius:inherit;pointer-events:none';
      var lb=doc.createElement('span');
      lb.style.cssText='background:rgba(255,255,255,.92);color:#111;padding:7px 18px;border-radius:100px;font-size:13px;font-weight:700';
      lb.textContent='Change photo';
      ov.appendChild(lb);container.appendChild(ov);
      container.onmouseenter=function(){ov.style.opacity='1';};
      container.onmouseleave=function(){ov.style.opacity='0';};
      container.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        parent.postMessage({type:'wsSlotClick',slotId:currentSlotId,label:'Change photo'},'*');
      };

      // Sync gHTML from live DOM (strip injected script + floating buttons first)
      try{doc.querySelectorAll('[data-wsfloat]').forEach(function(b){b.remove();});}catch(e){}
      var newHtml=doc.documentElement.outerHTML;
      var sc=newHtml.indexOf('<script id="_wsInject">');
      if(sc===-1)sc=newHtml.indexOf("<script id='_wsInject'>");
      if(sc>-1){var se=newHtml.indexOf('</'+'script>',sc)+9;if(se>8)newHtml=newHtml.slice(0,sc)+newHtml.slice(se);}
      gHTML=newHtml;
      localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      // Do NOT call setPreview here - image is already live in the DOM
      addMsg('ai','Photo placed! Click it to swap, or click another slot to add more.');
      toast('Photo added!',3000);
      return;
    }
  }catch(err){
  }
  // Slot not found - do NOT add to bottom, just tell user
  toast('Could not find that slot. Try regenerating the site.',4000);
}

function addImageAsSection(dataUrl){
  var sec='<div style="width:100%;max-height:480px;overflow:hidden"><img src="'+dataUrl+'" style="width:100%;display:block;object-fit:cover" alt=""></div>';
  var insertAt=gHTML.lastIndexOf('</main>');
  if(insertAt===-1)insertAt=gHTML.lastIndexOf('<footer');
  if(insertAt===-1)insertAt=gHTML.lastIndexOf('</body>');
  if(insertAt===-1){toast('Could not add image');return;}
  gHTML=gHTML.slice(0,insertAt)+sec+gHTML.slice(insertAt);
  localStorage.setItem('wsh',gHTML);
  pushUndo(gHTML);bumpEditCount();
  setTimeout(function(){setPreview(gHTML);},80);
  addMsg('ai','Added your photo as a section.');
  toast('Photo added as section!',3000);
}

function slotCompressAndFill(file){
  compressImage(file,function(dataUrl){
    var id='img_'+Date.now();
    imgLib.push({id:id,dataUrl:dataUrl,name:file.name});
    renderImgGrid();
    fillSlot(dataUrl);
  });
}

function setStudioReady(ready){
  var studio=document.getElementById('studio');
  if(!studio)return;
  var intro=document.getElementById('introMsg');
  if(ready){
    studio.classList.remove('studio-loading');
    if(intro)intro.innerHTML='Your site’s ready 🌱  What would you like to change? Type it below — or tap a quick idea to start.';
  } else {
    studio.classList.add('studio-loading');
    if(intro)intro.innerHTML='Building your site… this only takes a few seconds 🌱';
  }
}

function openStudio(html){
  var m=html.split('<title>')[1],t=m?m.split('</title>')[0]:'Your site';
  document.getElementById('stitle').textContent=t.slice(0,50);
  document.getElementById('studio').classList.add('on');
  document.body.style.overflow='hidden';
  sessionStorage.setItem('ws_studio','1');
  autoSetDevice();
  if(unlocked)applyUnlock();
  // Grey out buttons until site loads
  setStudioReady(false);
  setTimeout(function(){setPreview(html);},50);
}

function applyUnlock(){
  unlocked=true;
  var lk=document.getElementById('lkbadge');if(lk)lk.style.display='none';
  var ub=document.getElementById('unlockBtn');if(ub)ub.style.display='none';
  var dl=document.getElementById('dlBtn');if(dl){dl.textContent='&#8595; Download';dl.className='s-btn s-green';}
  var cp=document.getElementById('copyBtn');if(cp)cp.style.display='';
  var db=document.getElementById('deployBtn');
  if(db)db.classList.add('s-deploy-hero');
  var banner=document.getElementById('deployCtaBanner');
  if(banner)banner.classList.add('on');
}

function addMsg(role,text){
  var w=document.getElementById('cms'),d=document.createElement('div');
  d.className='msg msg-'+(role==='ai'?'ai':'me');
  var e=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  d.innerHTML='<div class="msg-name">'+(role==='ai'?'Websprout AI':'You')+'</div><div class="msg-body">'+e+'</div>';
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}

function isQuestion(msg){
  var raw=msg.trim();
  var q=raw.toLowerCase();
  // Strip polite lead-ins so "can you make the nav sticky" reads as the edit "make the nav sticky"
  var politePrefixes=['please ','hey ','hi ','yo ','ok ','okay ','can you ','could you ','would you ','will you ','can u ','i want you to ','i would like you to ','i want to ','i would like to ','lets ','let us '];
  var changed=true;
  while(changed){
    changed=false;
    for(var p=0;p<politePrefixes.length;p++){
      if(q.indexOf(politePrefixes[p])===0){q=q.slice(politePrefixes[p].length).trimStart();changed=true;}
    }
  }
  var editWords=['make','change','add','remove','update','replace','edit','fix','move','delete','create','put','use','set','turn','switch','give','hide','show','increase','decrease','swap','rename','rewrite','redesign','adjust','tweak','shorten','lengthen','bold','italic','center','align','capitalize','recolor','restyle'];
  var firstWord=q.split(' ')[0]||'';
  if(editWords.indexOf(firstWord)>-1)return false; // explicit edit instruction -> route to /modify
  if(raw.endsWith('?'))return true;
  var qstarts=['what','how','why','which','who','where','when','should i','is there','are there','do you','does','explain','tell me','advice','recommend','suggestion','difference','versus','is this','will this','does this','is it','are you'];
  for(var i=0;i<qstarts.length;i++){
    if(q.indexOf(qstarts[i])===0)return true;
  }
  // Short message with no edit verb is probably a question
  if(q.split(' ').length<=5)return true;
  return false;
}

function getSiteContext(){
  if(!gHTML)return'No site generated yet';
  var title='';
  var tS=gHTML.indexOf('<title>'),tE=gHTML.indexOf('</title>');
  if(tS>-1&&tE>-1)title=gHTML.slice(tS+7,tE).slice(0,60);
  // Grab headings so AI understands the site content
  var headings=[],pos=0,count=0;
  while(count<6){
    var h1=gHTML.indexOf('<h1',pos),h2=gHTML.indexOf('<h2',pos);
    var found=h1>-1&&(h2===-1||h1<h2)?h1:(h2>-1?h2:-1);
    if(found===-1)break;
    var te=gHTML.indexOf('>',found);var tc=gHTML.indexOf('</h',found);
    if(te>-1&&tc>-1){var txt=gHTML.slice(te+1,tc).replace(/<[^>]+>/g,'').trim().slice(0,50);if(txt)headings.push(txt);}
    pos=found+1;count++;
  }
  return'Site: "'+title+'". Content: '+headings.join(' | ')+'.'+(editCount>0?' '+editCount+' edits made.':'');
}

function friendlyErr(e){
  if(!e)return "Hmm, something went wrong — please try again.";
  if(e==="RATE_LIMITED_FREE")return "Google says this key hit a FREE-tier Gemini quota. If you enabled billing, the API key in your Worker most likely belongs to a different Google Cloud project than the billed one — recreate the key under the billing-enabled project and update GEMINI_API_KEY.";
  if(e==="RATE_LIMITED"||e==="rate")return "I'm getting rate-limited by the AI service right now 🌱  Give it a few seconds and try again — if it keeps happening, the free AI quota may just need a minute to reset.";
  return e;
}

function doChat(){
  var ci=document.getElementById('ci'),msg=ci.value.trim();
  if(!msg)return;
  // If no site yet and not a question, prompt them to generate first
  if(!gHTML&&!isQuestion(msg)){
    addMsg('ai','Generate a site first, then I can make edits! Use the builder above. 🌱');
    ci.value='';ci.style.height='auto';
    return;
  }
  ci.value='';ci.style.height='auto';addMsg('user',msg);
  var btn=document.getElementById('csb');btn.disabled=true;
  document.getElementById('tw').classList.add('on');document.getElementById('cms').scrollTop=99999;

  // Route to /chat for questions, /modify for edits
  var question=isQuestion(msg);
  if(question||!gHTML){
    fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,context:getSiteContext()})})
    .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
    .then(function(r){
      btn.disabled=false;document.getElementById('tw').classList.remove('on');
      if(!r.ok){addMsg('ai',friendlyErr(r.d.error));return;}
      addMsg('ai',r.d.reply||'Not sure - try rephrasing!');
      document.getElementById('cms').scrollTop=99999;
    })
    .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
  } else {
    fetch('/modify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML,instruction:msg})})
    .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
    .then(function(r){
      btn.disabled=false;document.getElementById('tw').classList.remove('on');
      if(!r.ok){
        var errMsg=r.d.error||'Something went wrong';
        var rl=(errMsg==='RATE_LIMITED'||errMsg==='RATE_LIMITED_FREE'||errMsg==='rate');
        var hasUndo=undoStack.length>1;
        addMsg('ai',friendlyErr(errMsg)+((hasUndo&&!rl)?' Or hit << Undo to restore your previous version.':''));
        return;
      }
      gHTML=r.d.html;localStorage.setItem('wsh',gHTML);
      pushUndo(gHTML);bumpEditCount();
      setTimeout(function(){setPreview(gHTML);},50);
      addMsg('ai',r.d.message||'Done! Check the preview.');
      document.getElementById('cms').scrollTop=99999;
    })
    .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
  }
}

// -- Netlify zip deploy ----------------------------------------
// Uses Netlify's file digest API to deploy without a zip library
async function createZipAndDeploy(token,siteId,html){
  // Create a simple zip with index.html using raw bytes
  // We use the Files digest API which doesn't need a zip
  var headers={'Authorization':'Bearer '+token,'Content-Type':'application/octet-stream'};
  // First create a deploy with file list
  var sha=await sha1(html);
  var deployRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId+'/deploys',{
    method:'POST',
    headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify({files:{'/index.html':sha},async:false})
  });
  var deploy=await deployRes.json();
  if(!deploy.id)throw new Error(deploy.message||'Deploy creation failed');
  // Upload the file if needed
  if(deploy.required&&deploy.required.length>0){
    var uploadRes=await fetch('https://api.netlify.com/api/v1/deploys/'+deploy.id+'/files/index.html',{
      method:'PUT',
      headers:headers,
      body:new TextEncoder().encode(html)
    });
    if(!uploadRes.ok){
      var err=await uploadRes.json();
      throw new Error(err.message||'Upload failed');
    }
  }
  // Wait for deploy to be ready
  for(var i=0;i<15;i++){
    await new Promise(function(r){setTimeout(r,1000);});
    var statusRes=await fetch('https://api.netlify.com/api/v1/deploys/'+deploy.id,{headers:{'Authorization':'Bearer '+token}});
    var status=await statusRes.json();
    if(status.state==='ready'||status.state==='current'){
      return status.ssl_url?status.ssl_url.replace('https://',''):status.url.replace('https://','');
    }
    if(status.state==='error')throw new Error('Deploy error: '+status.error_message);
  }
  // Return site URL even if deploy status check times out
  var siteRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId,{headers:{'Authorization':'Bearer '+token}});
  var site=await siteRes.json();
  return site.ssl_url?site.ssl_url.replace('https://',''):site.url.replace('https://','');
}

async function sha1(str){
  var buf=new TextEncoder().encode(str);
  var hash=await crypto.subtle.digest('SHA-1',buf);
  return Array.from(new Uint8Array(hash)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}

function doPayment(){
  if(!gHTML){toast('Generate a site first!');return;}
  var me=window._wsUser;
  if(!me||!me.auth){toast('Sign in first so your subscription unlocks all your sites.',5000);try{openAuth();}catch(e){}return;}
  var link='${SUB_LINK}';
  if(!link||link.indexOf('PASTE_YOUR')>-1){toast('Payments are not set up yet — add your Stripe subscription link as the STRIPE_SUB_LINK variable in your Worker.',6500);return;}
  localStorage.setItem('wsh',gHTML);
  var email=me.email||'';
  window.location.href=link+'?client_reference_id='+encodeURIComponent(email)+'&prefilled_email='+encodeURIComponent(email);
}

// -- Image Library ---------------------------------------------
var imgLib=[]; // {id, dataUrl, name}
var selectedImgId=null;

function compressImage(file,cb){
  // Convert any image format to JPEG via canvas (handles PNG, WebP, HEIC on supported devices, etc.)
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      try{
        var canvas=document.createElement('canvas');
        var MAX=1200; // Slightly larger for better quality in slots
        var w=img.width,h=img.height;
        if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
        if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}
        if(w<1)w=1;if(h<1)h=1;
        canvas.width=w;canvas.height=h;
        var ctx=canvas.getContext('2d');
        ctx.fillStyle='#ffffff'; // white bg in case of transparency
        ctx.fillRect(0,0,w,h);
        ctx.drawImage(img,0,0,w,h);
        // Try JPEG first, fall back to PNG if needed
        var dataUrl=canvas.toDataURL('image/jpeg',0.78);
        if(!dataUrl||dataUrl.length<100)dataUrl=canvas.toDataURL('image/png');
        cb(dataUrl);
      }catch(err){
        // Canvas failed (e.g. CORS or unsupported format) - use original
        cb(e.target.result);
      }
    };
    img.onerror=function(){
      toast('Could not read this image format. Please convert to JPEG or PNG first.',5000);
    };
    img.src=e.target.result;
  };
  reader.onerror=function(){
    toast('Could not read image file.',4000);
  };
  reader.readAsDataURL(file);
}

function addImagesToLibrary(files){
  Array.from(files).forEach(function(file){
    if(!file.type.startsWith('image/'))return;
    compressImage(file,function(dataUrl){
      var id='img_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      imgLib.push({id:id,dataUrl:dataUrl,name:file.name});
      renderImgGrid();
    });
  });
}

function renderImgGrid(){
  var grid=document.getElementById('imgGrid');
  var dz=document.getElementById('imgDropzone');
  var actions=document.getElementById('imgActions');
  if(!grid)return;
  if(imgLib.length===0){
    grid.style.display='none';
    dz.style.display='block';
    dz.classList.add('empty');
    actions.style.display='none';
    selectedImgId=null;
    return;
  }
  dz.style.display='none';
  grid.style.display='grid';
  var _imgLib=document.getElementById('imgLibrary');if(_imgLib)_imgLib.classList.remove('collapsed');
  grid.innerHTML=imgLib.map(function(img){
    var sel=selectedImgId===img.id;
    return '<div class="img-thumb'+(sel?' selected':'')+'" data-id="'+img.id+'" style="'+(sel?'border-color:#2d7a3a;':'')+'">'+
      '<img src="'+img.dataUrl+'" alt="'+img.name+'">'+
      '<button class="img-thumb-del" data-del="'+img.id+'" title="Remove">x</button>'+
    '</div>';
  }).join('');
  // Wire up thumb clicks
  grid.querySelectorAll('.img-thumb').forEach(function(thumb){
    thumb.addEventListener('click',function(e){
      if(e.target.dataset.del)return;
      selectedImgId=thumb.dataset.id;
      renderImgGrid();
      actions.style.display='flex';
      actions.style.flexDirection='column';
    });
  });
  // Wire up delete buttons
  grid.querySelectorAll('.img-thumb-del').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      imgLib=imgLib.filter(function(i){return i.id!==btn.dataset.del;});
      if(selectedImgId===btn.dataset.del){selectedImgId=null;actions.style.display='none';}
      renderImgGrid();
    });
  });
}

function injectImageIntoSite(dataUrl,action){
  if(!gHTML){toast('Generate a site first!');return;}
  var instruction='';
  if(action==='hero'){
    instruction='Replace the hero section background with this photo. Use it as a CSS background-image on the hero section: background-image:url('+dataUrl+'); background-size:cover; background-position:center; Add a dark overlay (rgba(0,0,0,0.45)) so the text stays readable. Keep all existing text and buttons.';
  } else if(action==='about'){
    instruction='Add this photo to the about or story section as an <img> tag with src="'+dataUrl+'". Style it with width:100%; border-radius:16px; object-fit:cover; Make it look natural in the layout.';
  } else if(action==='section'){
    instruction='Add this photo to the site as a full-width section image: <img src="'+dataUrl+'" style="width:100%;max-height:400px;object-fit:cover;display:block"> Place it between two existing sections where it looks best.';
  }
  // Show in chat and send
  addMsg('user','📷 Adding photo to '+action+' section...');
  document.getElementById('imgActions').style.display='none';
  var btn=document.getElementById('csb');btn.disabled=true;
  document.getElementById('tw').classList.add('on');
  fetch('/modify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html:gHTML,instruction:instruction})})
  .then(function(r){return r.text().then(function(t){try{var d=JSON.parse(t);return{ok:r.ok,d:d};}catch(e){return{ok:false,d:{error:'Server error'}};}});})
  .then(function(r){
    btn.disabled=false;document.getElementById('tw').classList.remove('on');
    if(!r.ok){addMsg('ai',friendlyErr(r.d.error));return;}
    gHTML=r.d.html;localStorage.setItem('wsh',gHTML);
    pushUndo(gHTML);bumpEditCount();
    setTimeout(function(){setPreview(gHTML);},50);
    addMsg('ai','📷 Photo added! Check the preview.');
    document.getElementById('cms').scrollTop=99999;
  })
  .catch(function(e){btn.disabled=false;document.getElementById('tw').classList.remove('on');addMsg('ai',"Connection hiccup — please check your network and try again.");});
}

;
</script>
</body>
</html>`;

const SUCCESS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Successful — Websprout</title>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f1a0d;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem}
.card{max-width:480px;width:100%}
.icon{font-size:72px;margin-bottom:1.5rem;animation:pop .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
h1{font-family:'Cabinet Grotesk',sans-serif;font-size:2.5rem;font-weight:900;letter-spacing:-1.5px;margin-bottom:1rem;color:#fff}
p{color:rgba(255,255,255,.6);font-size:16px;line-height:1.6;margin-bottom:2rem}
.btn{display:inline-block;background:#2d7a3a;color:#fff;padding:16px 36px;border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;transition:all .2s}
.btn:hover{background:#4aaa57;transform:translateY(-2px)}
.sub{margin-top:1.5rem;font-size:13px;color:rgba(255,255,255,.3)}
</style>
</head>
<body>
<div class="card">
  <div class="icon">🎉</div>
  <h1>Payment successful!</h1>
  <p>Your site is unlocked and ready to download. Head back to Websprout to get your code.</p>
  <a href="/?sub=success" class="btn">Get my code →</a>
  <p class="sub">You'll be redirected to your site automatically.</p>
</div>
<script>
  // Auto redirect after 3 seconds
  setTimeout(function(){ window.location.href='/?sub=success'; }, 3000);
</script>
</body>
</html>`;

const TERMS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service — Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f7f0;color:#0f1a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;padding:4rem 2rem;line-height:1.7}
.wrap{max-width:700px;margin:0 auto}
h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}
.meta{color:#7a8c77;margin-bottom:3rem;font-size:14px}
h2{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem}
p{margin-bottom:1rem;color:#2e3d2b}
a{color:#2d7a3a}
.back{display:inline-block;margin-bottom:2rem;color:#2d7a3a;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Terms of Service</h1>
<p class="meta">Last updated: May 2026</p>
<h2>1. Service</h2>
<p>Websprout provides an AI-powered website generation service. Generating and previewing sites is free. A Pro subscription ($10/month) unlocks downloading the HTML/CSS source code and deploying your sites.</p>
<h2>2. Payment</h2>
<p>Pro is a recurring subscription billed at $10/month via Stripe until you cancel. You can cancel anytime, which stops future charges; access continues through the end of the current billing period. We do not store your payment information. Charges already billed are non-refundable.</p>
<h2>3. Ownership</h2>
<p>Any source code you download while subscribed is yours to use for any purpose, personal or commercial.</p>
<h2>4. Limitations</h2>
<p>Websprout generates websites using AI. We do not guarantee any specific outcome, design quality, or fitness for a particular purpose. The generated code is provided as-is.</p>
<h2>5. Prohibited Use</h2>
<p>You may not use Websprout to generate websites that promote illegal activity, hate speech, or violate any applicable laws.</p>
<h2>6. Contact</h2>
<p>For questions: <a href="mailto:support@websprout.app">support@websprout.app</a></p>
</div>
</body>
</html>`;

const PRIVACY_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy — Websprout</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f7f0;color:#0f1a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;padding:4rem 2rem;line-height:1.7}
.wrap{max-width:700px;margin:0 auto}
h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}
.meta{color:#7a8c77;margin-bottom:3rem;font-size:14px}
h2{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem}
p{margin-bottom:1rem;color:#2e3d2b}
a{color:#2d7a3a}
.back{display:inline-block;margin-bottom:2rem;color:#2d7a3a;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Websprout</a>
<h1>Privacy Policy</h1>
<p class="meta">Last updated: May 2026</p>
<h2>What we collect</h2>
<p>We collect your email address if you choose to provide it before purchase. We use Stripe for payments — we never see or store your card details.</p>
<h2>What we don't collect</h2>
<p>We do not track you across other websites. We do not sell your data. We do not use cookies beyond what's necessary for the service to function.</p>
<h2>Your prompts</h2>
<p>The prompts you type to generate websites are sent to Google's Gemini API for processing. Please see Google's privacy policy for how they handle this data.</p>
<h2>Generated sites</h2>
<p>Your generated HTML is stored temporarily in your browser's localStorage. It is not stored on our servers.</p>
<h2>Contact</h2>
<p>Questions? Email us at <a href="mailto:support@websprout.app">support@websprout.app</a></p>
</div>
</body>
</html>`;


const DEPLOY_GUIDE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>How to Deploy Your Site — Websprout</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232d7a3a'/><text y='.9em' font-size='75' x='12'>&#127807;</text></svg>">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff;color:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
nav{height:56px;border-bottom:1px solid #e8f0e5;display:flex;align-items:center;padding:0 5vw;justify-content:space-between}
.logo{font-size:17px;font-weight:800;color:#0f1a0d;text-decoration:none;display:flex;align-items:center;gap:8px}
.logo-mark{width:28px;height:28px;background:#2d7a3a;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{font-style:normal;color:#2d7a3a}
.back-btn{font-size:14px;color:#2d7a3a;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:6px}
.back-btn:hover{text-decoration:underline}
.hero{background:#f8faf8;border-bottom:1px solid #e8f0e5;padding:60px 5vw}
.hero-inner{max-width:760px;margin:0 auto;text-align:center}
.eyebrow{font-size:12px;font-weight:700;color:#2d7a3a;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
h1{font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#0f1a0d;letter-spacing:-2px;margin-bottom:14px}
.lead{font-size:18px;color:#555;max-width:560px;margin:0 auto}
.wrap{max-width:900px;margin:0 auto;padding:60px 5vw}

/* COMPARISON TABLE */
.compare-title{font-size:1.6rem;font-weight:800;color:#0f1a0d;letter-spacing:-1px;margin-bottom:8px}
.compare-sub{color:#666;font-size:15px;margin-bottom:32px}
.cmp-table{width:100%;border-collapse:separate;border-spacing:0;border:1.5px solid #e8f0e5;border-radius:16px;overflow:hidden;margin-bottom:60px}
.cmp-table th{padding:16px 20px;font-size:13px;font-weight:700;text-align:left;background:#f8faf8;color:#555;text-transform:uppercase;letter-spacing:.8px;border-bottom:1.5px solid #e8f0e5}
.cmp-table td{padding:14px 20px;font-size:14px;border-bottom:1px solid #f0f5f0;vertical-align:top}
.cmp-table tr:last-child td{border-bottom:none}
.cmp-table td:first-child{color:#444;font-weight:500;width:30%}
.netlify-col{background:#fff5f7}
.cf-col{background:#fff8f0}
.badge-n{display:inline-flex;align-items:center;gap:5px;background:#00c7b7;color:#fff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px}
.badge-cf{display:inline-flex;align-items:center;gap:5px;background:#f6821f;color:#fff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px}
.good{color:#2d7a3a;font-weight:600}
.ok{color:#555}
.cmp-table th:nth-child(2){color:#00a89c}
.cmp-table th:nth-child(3){color:#d36b00}
.rec-banner{background:#f0faf2;border:1.5px solid #c8e8c4;border-radius:12px;padding:16px 20px;margin-bottom:40px;display:flex;align-items:center;gap:12px;font-size:14px;color:#1f5c2a}
.rec-icon{font-size:24px;flex-shrink:0}

/* STEP GUIDES */
.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:60px}
.guide-card{border:1.5px solid #e8f0e5;border-radius:20px;overflow:hidden}
.guide-header{padding:24px 24px 20px;border-bottom:1px solid #e8f0e5}
.guide-header h2{font-size:20px;font-weight:800;color:#0f1a0d;margin-bottom:6px;letter-spacing:-.5px}
.guide-header p{font-size:14px;color:#666}
.guide-logo{font-size:28px;margin-bottom:10px}
.guide-body{padding:24px}
.step-list{list-style:none;display:flex;flex-direction:column;gap:18px}
.step-item{display:flex;gap:14px;align-items:flex-start}
.step-num{width:26px;height:26px;border-radius:8px;background:#f0faf2;border:1.5px solid #c8e8c4;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#2d7a3a;flex-shrink:0;margin-top:1px}
.step-content{font-size:14px;color:#333;line-height:1.6}
.step-content strong{color:#0f1a0d;display:block;margin-bottom:2px;font-weight:700}
.step-content code{background:#f5f5f5;border-radius:4px;padding:1px 6px;font-size:12px;font-family:monospace;color:#c41d7f}
.guide-cta{margin-top:20px;display:block;background:#0f1a0d;color:#fff;text-align:center;padding:12px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:all .15s}
.guide-cta.netlify{background:#00c7b7}
.guide-cta.cf{background:#f6821f}
.guide-cta:hover{opacity:.9;transform:translateY(-1px)}

/* FAQ */
.faq-title{font-size:1.4rem;font-weight:800;color:#0f1a0d;letter-spacing:-.8px;margin-bottom:24px}
.faq-list{display:flex;flex-direction:column;gap:12px}
.faq-item{border:1px solid #e8f0e5;border-radius:12px;overflow:hidden}
.faq-q{padding:16px 20px;font-size:14px;font-weight:600;color:#0f1a0d;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}
.faq-q:hover{background:#f8faf8}
.faq-icon{font-size:18px;color:#2d7a3a;transition:transform .2s;flex-shrink:0}
.faq-a{padding:0 20px;max-height:0;overflow:hidden;transition:all .25s ease;font-size:14px;color:#555;line-height:1.7}
.faq-item.open .faq-a{padding:0 20px 16px;max-height:300px}
.faq-item.open .faq-icon{transform:rotate(45deg)}

footer{border-top:1px solid #e8f0e5;padding:28px 5vw;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#f8faf8}
.foot-logo{font-size:15px;font-weight:800;color:#0f1a0d;text-decoration:none;display:flex;align-items:center;gap:7px}
.foot-logo em{font-style:normal;color:#2d7a3a}
.foot-links{display:flex;gap:20px}
.foot-links a{font-size:13px;color:#888;text-decoration:none}
.foot-links a:hover{color:#0f1a0d}

@media(max-width:700px){
  .guide-grid,.cmp-table{display:block}
  .cmp-table{overflow-x:auto;display:block}
}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo"><div class="logo-mark">🌱</div><span class="lw">Web<em>sprout</em></span></a>
  <a href="/" class="back-btn">← Back to Websprout</a>
</nav>

<div class="hero">
  <div class="hero-inner">
    <div class="eyebrow">Deploy Guide</div>
    <h1>Get your site live in minutes</h1>
    <p class="lead">You've built your site. Now let's put it on the internet. Here's everything you need to know about deploying with Netlify or Cloudflare Pages — both free forever.</p>
  </div>
</div>

<div class="wrap">
  <div class="rec-banner"><div class="rec-icon">💡</div><div>New to hosting? <strong>Start with Netlify</strong> — it's the fastest path to a live site with zero configuration. You'll be online in under 2 minutes.</div></div>

  <div class="compare-title">Netlify vs Cloudflare Pages</div>
  <div class="compare-sub">Both are free, both give you HTTPS and a custom domain. Here's what's different.</div>
  <table class="cmp-table">
    <thead>
      <tr>
        <th>Feature</th>
        <th><span class="badge-n">● Netlify</span></th>
        <th><span class="badge-cf">● Cloudflare Pages</span></th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Setup time</td><td class="netlify-col"><span class="good">~2 minutes (drag & drop)</span></td><td class="cf-col"><span class="ok">~5 minutes</span></td></tr>
      <tr><td>Free bandwidth</td><td class="netlify-col"><span class="ok">100 GB/month</span></td><td class="cf-col"><span class="good">Unlimited</span></td></tr>
      <tr><td>Free sites</td><td class="netlify-col"><span class="ok">500 sites</span></td><td class="cf-col"><span class="good">Unlimited</span></td></tr>
      <tr><td>Global CDN speed</td><td class="netlify-col"><span class="ok">Fast (Fastly CDN)</span></td><td class="cf-col"><span class="good">Very fast (300+ locations)</span></td></tr>
      <tr><td>Custom domain</td><td class="netlify-col"><span class="good">Free & easy</span></td><td class="cf-col"><span class="good">Free & easy</span></td></tr>
      <tr><td>HTTPS / SSL</td><td class="netlify-col"><span class="good">Automatic</span></td><td class="cf-col"><span class="good">Automatic</span></td></tr>
      <tr><td>Free subdomain</td><td class="netlify-col"><span class="ok">yoursite.netlify.app</span></td><td class="cf-col"><span class="ok">yoursite.pages.dev</span></td></tr>
      <tr><td>Best for</td><td class="netlify-col"><span class="ok">Beginners, quick deploys</span></td><td class="cf-col"><span class="ok">High-traffic, global sites</span></td></tr>
      <tr><td>One-click deploy</td><td class="netlify-col"><span class="good">✓ Built into Websprout</span></td><td class="cf-col"><span class="ok">Manual (5 easy steps)</span></td></tr>
    </tbody>
  </table>

  <div class="guide-grid">
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-logo">🟢</div>
        <h2>Deploy to Netlify</h2>
        <p>The fastest way to get your site live. One click from inside Websprout — no setup required.</p>
      </div>
      <div class="guide-body">
        <ol class="step-list">
          <li class="step-item">
            <div class="step-num">1</div>
            <div class="step-content"><strong>Generate &amp; unlock your site</strong>Build your site on Websprout and go Pro ($10/month) to unlock downloading the source code.</div>
          </li>
          <li class="step-item">
            <div class="step-num">2</div>
            <div class="step-content"><strong>Click "Deploy to Netlify"</strong>Hit the button in the studio. Enter your Netlify Personal Access Token once — we save it locally so you never have to enter it again.</div>
          </li>
          <li class="step-item">
            <div class="step-num">3</div>
            <div class="step-content"><strong>Get your live URL</strong>In about 10 seconds, your site is live at a <code>*.netlify.app</code> URL. Share it immediately.</div>
          </li>
          <li class="step-item">
            <div class="step-num">4</div>
            <div class="step-content"><strong>Add a custom domain (optional)</strong>In your Netlify dashboard go to Site Settings → Domain Management → Add custom domain. Free with any domain registrar.</div>
          </li>
        </ol>
        <a href="https://app.netlify.com/signup" target="_blank" class="guide-cta netlify">Create free Netlify account →</a>
      </div>
    </div>
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-logo">🟠</div>
        <h2>Deploy to Cloudflare Pages</h2>
        <p>Best for high-traffic sites. Unlimited bandwidth and Cloudflare's blazing-fast global network.</p>
      </div>
      <div class="guide-body">
        <ol class="step-list">
          <li class="step-item">
            <div class="step-num">1</div>
            <div class="step-content"><strong>Download your site</strong>Unlock and download your HTML file from Websprout. It will save as <code>websprout-site.html</code>.</div>
          </li>
          <li class="step-item">
            <div class="step-num">2</div>
            <div class="step-content"><strong>Rename the file</strong>Rename <code>websprout-site.html</code> to <code>index.html</code> — Cloudflare requires this exact name.</div>
          </li>
          <li class="step-item">
            <div class="step-num">3</div>
            <div class="step-content"><strong>Go to Cloudflare Pages</strong>Visit <code>pages.cloudflare.com</code>, sign up free, and click Create a project → Direct Upload.</div>
          </li>
          <li class="step-item">
            <div class="step-num">4</div>
            <div class="step-content"><strong>Upload your file</strong>Name your project, drag in your <code>index.html</code> file, and click Deploy. Done in 60 seconds.</div>
          </li>
          <li class="step-item">
            <div class="step-num">5</div>
            <div class="step-content"><strong>Your site is live</strong>Cloudflare gives you a <code>*.pages.dev</code> URL immediately. Add a custom domain anytime for free.</div>
          </li>
        </ol>
        <a href="https://pages.cloudflare.com" target="_blank" class="guide-cta cf">Go to Cloudflare Pages →</a>
      </div>
    </div>
  </div>

  <div class="faq-title">Frequently asked questions</div>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">Do I need to pay for hosting? <span class="faq-icon">+</span></div>
      <div class="faq-a">No. Both Netlify and Cloudflare Pages have permanently free tiers that are more than enough for most websites. Netlify gives you 100GB of bandwidth per month for free, and Cloudflare Pages offers unlimited bandwidth.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What is a Personal Access Token? <span class="faq-icon">+</span></div>
      <div class="faq-a">A Personal Access Token is a secret key that lets Websprout talk to Netlify on your behalf to deploy your site. You get it from your Netlify account under User Settings → Applications → Personal Access Tokens. It stays on your device only — we never store it on our servers.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Can I update my site after deploying? <span class="faq-icon">+</span></div>
      <div class="faq-a">Yes. Use the chat in Websprout to make changes, re-download your site, and re-deploy. On Netlify, you can drag and drop a new file onto your existing site to update it. On Cloudflare Pages, you can upload a new version through the dashboard.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How do I connect a custom domain? <span class="faq-icon">+</span></div>
      <div class="faq-a">Both platforms make this easy and free. On Netlify: Site Settings → Domain Management → Add custom domain, then follow the DNS instructions from your domain registrar. On Cloudflare Pages: Custom Domains → Add a domain. If your domain is already on Cloudflare, it's automatic.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is my site secure (HTTPS)? <span class="faq-icon">+</span></div>
      <div class="faq-a">Yes, automatically. Both Netlify and Cloudflare Pages issue free SSL certificates via Let's Encrypt the moment your site is deployed. Your site will always serve over HTTPS with no extra configuration.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Which should I choose? <span class="faq-icon">+</span></div>
      <div class="faq-a">For most people, Netlify is easier and faster to get started. If you expect high traffic or already use Cloudflare for a domain, Cloudflare Pages is the better long-term choice because of unlimited bandwidth and faster global delivery.</div>
    </div>
  </div>
</div>

<footer>
  <a href="/" class="foot-logo"><div class="logo-mark" style="width:24px;height:24px;font-size:12px">🌱</div><span class="lw">Web<em>sprout</em></span></a>
  <div class="foot-links">
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
    <a href="mailto:support@websprout.app">Contact</a>
  </div>
</footer>

<script>
document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var item=q.parentElement;
    var wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
    if(!wasOpen)item.classList.add('open');
  });
});
</script>
</body>
</html>`;


// ── Feature 3: Analytics ──────────────────────────────────────
async function doTrack(request, env) {
  // Analytics - completely optional, won't break if KV missing
  try {
    if (!env.KV) return succeed({ ok: false });
    const body = await request.json();
    const event = body.event || 'unknown';
    const key = 'stat:' + event;
    const cur = parseInt(await env.KV.get(key) || '0');
    await env.KV.put(key, String(cur + 1));
    const today = new Date().toISOString().slice(0,10);
    const dayKey = 'stat:' + event + ':' + today;
    const dayCur = parseInt(await env.KV.get(dayKey) || '0');
    await env.KV.put(dayKey, String(dayCur + 1), { expirationTtl: 60*60*24*30 });
    return succeed({ ok: true });
  } catch(e) { return succeed({ ok: false }); }
}

async function doStats(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const [gen, pay, share] = await Promise.all([
      env.KV.get('stat:generate'),
      env.KV.get('stat:payment'),
      env.KV.get('stat:share')
    ]);
    const today = new Date().toISOString().slice(0,10);
    const [genDay, payDay] = await Promise.all([
      env.KV.get('stat:generate:' + today),
      env.KV.get('stat:payment:' + today)
    ]);
    return succeed({
      total: { generates: parseInt(gen||'0'), payments: parseInt(pay||'0'), shares: parseInt(share||'0') },
      today: { generates: parseInt(genDay||'0'), payments: parseInt(payDay||'0') },
      conversion: gen > 0 ? ((parseInt(pay||'0')/parseInt(gen||'1'))*100).toFixed(1)+'%' : '0%'
    });
  } catch(e) { return fail(e.message); }
}

// ── Feature 8: Shareable preview link ────────────────────────
async function doSavePreview(request, env) {
  try {
    if (!env.KV) return fail('KV not configured');
    const body = await request.json();
    if (!body.html) return fail('No HTML provided');
    const id = Math.random().toString(36).slice(2,10) + Date.now().toString(36);
    // Store for 7 days
    await env.KV.put('preview:' + id, body.html, { expirationTtl: 60*60*24*7 });
    return succeed({ id: id, url: 'https://websprout.app/preview?id=' + id });
  } catch(e) { return fail(e.message); }
}

async function doPreviewShare(request, env) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    if (!env.KV) return new Response('KV not configured', { status: 500 });
    const html = await env.KV.get('preview:' + id);
    if (!html) return new Response('<html><body style="font-family:sans-serif;padding:2rem;text-align:center"><h2>🌱 Preview expired</h2><p>This preview link has expired or does not exist.</p><a href="/">Build your own at websprout.app</a></body></html>', { status: 404, headers: {'Content-Type':'text/html'} });
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch(e) { return new Response('Error: ' + e.message, { status: 500 }); }
}


// ── Feature 2: Email delivery via Resend ──────────────────────
async function doSendEmail(request, env) {
  try {
    if (!env.RESEND_API_KEY) return fail('Email not configured');
    const body = await request.json();
    const { email, html, title } = body;
    if (!email || !html) return fail('Missing email or html');

    // Base64 encode the HTML for attachment
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(html);
    const base64Html = btoa(String.fromCharCode(...new Uint8Array(htmlBytes)));

    const siteName = title || 'your-website';
    const filename = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '.html';

    const emailBody = {
      from: 'Websprout <hello@websprout.app>',
      to: [email],
      subject: 'Your website is ready to grow! 🌱',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
          <div style="background:#0f1a0d;padding:28px 32px;text-align:center">
            <div style="font-size:32px;margin-bottom:8px">🌱</div>
            <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-1px">Websprout</div>
          </div>
          <div style="padding:36px 32px">
            <h1 style="color:#0f1a0d;font-size:24px;font-weight:800;margin:0 0 12px;letter-spacing:-1px">Your site is attached and ready!</h1>
            <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px">Your website has been attached to this email as an HTML file. Here's how to get it live:</p>
            <div style="background:#f8faf8;border:1px solid #e8f0e5;border-radius:12px;padding:20px;margin-bottom:24px">
              <div style="font-weight:700;color:#0f1a0d;margin-bottom:12px">Deploy free in 2 minutes:</div>
              <ol style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:2">
                <li>Go to <a href="https://app.netlify.com/signup" style="color:#2d7a3a">netlify.com</a> and create a free account</li>
                <li>Click <strong>Add new site</strong> → <strong>Deploy manually</strong></li>
                <li>Drag the attached HTML file onto the upload area</li>
                <li>Your site is live at a free <code style="background:#e8f0e5;padding:1px 6px;border-radius:4px">*.netlify.app</code> URL!</li>
              </ol>
            </div>
            <p style="color:#888;font-size:13px;margin:0 0 24px">Need to make changes? Go back to <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a> — your site is saved and ready to edit.</p>
            <div style="text-align:center">
              <a href="https://websprout.app" style="display:inline-block;background:#2d7a3a;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none">Back to Websprout</a>
            </div>
          </div>
          <div style="background:#f8faf8;border-top:1px solid #e8f0e5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:12px;margin:0">You're receiving this because you purchased a site on <a href="https://websprout.app" style="color:#2d7a3a">websprout.app</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: base64Html
        }
      ]
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    const result = await res.json();
    if (!res.ok) return fail(result.message || 'Email failed to send');
    return succeed({ sent: true, id: result.id });
  } catch(e) {
    return fail(e.message);
  }
}


const OG_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#060d05"/><stop offset="1" stop-color="#0f1a0d"/></linearGradient>
<radialGradient id="glow" cx="28%" cy="32%" r="62%"><stop offset="0" stop-color="#2d7a3a" stop-opacity="0.5"/><stop offset="1" stop-color="#2d7a3a" stop-opacity="0"/></radialGradient>
<linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4ade80"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<g transform="translate(92,236)">
<rect width="92" height="92" rx="22" fill="#2d7a3a"/>
<path d="M46 72 V44" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
<path d="M46 50 C46 32 32 24 18 27 C21 45 34 53 46 50 Z" fill="#ffffff"/>
<path d="M46 46 C46 28 60 20 74 23 C71 41 58 49 46 46 Z" fill="#dff5e3"/>
</g>
<text x="206" y="306" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="78" font-weight="800" fill="#ffffff">Websprout</text>
<text x="94" y="416" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="42" font-weight="700" fill="url(#grad)">Plant an idea. Grow a website.</text>
<text x="94" y="476" font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="28" font-weight="500" fill="#ffffff" fill-opacity="0.62">AI website builder - a complete site in about 18 seconds. Free to preview.</text>
</svg>`;

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://websprout.app/</loc><lastmod>2026-06-01</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://websprout.app/deploy-guide</loc><lastmod>2026-06-01</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://websprout.app/terms</loc><lastmod>2026-06-01</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://websprout.app/privacy</loc><lastmod>2026-06-01</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`;

const ROBOTS = `User-agent: *
Allow: /
Disallow: /preview
Disallow: /success
Disallow: /render

Sitemap: https://websprout.app/sitemap.xml`;


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const _host = url.hostname.toLowerCase();
    const _appHosts = ['websprout.app','www.websprout.app'];
    if (request.method === 'GET' && _appHosts.indexOf(_host) === -1 && _host.indexOf('.workers.dev') === -1 && _host.indexOf('localhost') === -1 && !url.pathname.startsWith('/api/')) {
      if (_host.endsWith('.websprout.app')) {
        const _sub = _host.slice(0, _host.length - '.websprout.app'.length);
        if (_sub && _sub.indexOf('.') === -1) {
          const _r = await servePublished(_sub, env);
          return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      } else if (env.KV) {
        const _mapped = await env.KV.get('domain:' + _host);
        if (_mapped) { const _r = await servePublished(_mapped, env); if (_r) return _r; }
      }
    }
    if (url.pathname === '/generate' && request.method === 'POST') return doGenerate(request, env);
    if (url.pathname === '/track' && request.method === 'POST') return doTrack(request, env);
    if (url.pathname === '/send-email' && request.method === 'POST') return doSendEmail(request, env);
    if (url.pathname === '/stats' && request.method === 'GET') return doStats(request, env);
    if (url.pathname === '/preview' && request.method === 'GET') return doPreviewShare(request, env);
    if (url.pathname === '/preview' && request.method === 'POST') return doSavePreview(request, env);
    if (url.pathname === '/chat' && request.method === 'POST') return doChat(request, env);
    if (url.pathname === '/modify' && request.method === 'POST') return doModify(request, env);
    if (url.pathname === '/render' && request.method === 'POST') return doRender(request);
    if (url.pathname.startsWith('/api/form/')) {
      if (request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
      if (request.method === 'POST') return doFormSubmit(request, env, decodeURIComponent(url.pathname.slice(10)));
    }
    if (url.pathname === '/inbox') return new Response(INBOX_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/publish' && request.method === 'POST') return doPublish(request, env);
    if (url.pathname === '/unpublish' && request.method === 'POST') return doUnpublish(request, env);
    if (url.pathname === '/slug-check' && request.method === 'GET') return doSlugCheck(request, env);
    if (url.pathname === '/auth/google' && request.method === 'GET') return doGoogleStart(request, env);
    if (url.pathname === '/auth/google/callback' && request.method === 'GET') return doGoogleCallback(request, env);
    if (url.pathname === '/auth/email' && request.method === 'POST') return doEmailStart(request, env);
    if (url.pathname === '/auth/verify' && request.method === 'GET') return doVerify(request, env);
    if (url.pathname === '/me' && request.method === 'GET') return doMe(request, env);
    if (url.pathname === '/auth/logout') return doLogout(request, env);
    if (url.pathname === '/save' && request.method === 'POST') return doSave(request, env);
    if (url.pathname === '/load' && request.method === 'GET') return doLoad(request, env);
    if (url.pathname === '/my-sites' && request.method === 'GET') return doMySites(request, env);
    if (url.pathname === '/my-sites/claim' && request.method === 'POST') return doMySitesClaim(request, env);
    if (url.pathname === '/my-sites/delete' && request.method === 'POST') return doMySitesDelete(request, env);
    if (url.pathname === '/api/hit' && request.method === 'POST') return doHit(request, env);
    if (url.pathname === '/api/hit' && request.method === 'OPTIONS') return new Response(null, { headers: formCors() });
    if (url.pathname === '/api/views' && request.method === 'GET') return doViews(request, env);
    if (url.pathname.startsWith('/s/')) { const _sl = slugify(url.pathname.slice(3).split('/')[0]); const _r = await servePublished(_sl, env); return _r || new Response(PUB_404, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    if (url.pathname === '/api/domain-check' && request.method === 'GET') return doDomainCheck(request, env);
    if (url.pathname === '/api/connect-domain' && request.method === 'POST') return doConnectDomain(request, env);
    if (url.pathname === '/api/inbox' && request.method === 'GET') return doInboxData(request, env);
    if (url.pathname === '/api/inbox/notify' && request.method === 'POST') return doInboxNotify(request, env);
    if (url.pathname === '/api/inbox/clear' && request.method === 'POST') return doInboxClear(request, env);
    if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') return doStripeWebhook(request, env);
    if (url.pathname === '/success') return new Response(SUCCESS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/terms') return new Response(TERMS_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/privacy') return new Response(PRIVACY_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/deploy-guide') return new Response(DEPLOY_GUIDE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname === '/sitemap.xml') return new Response(SITEMAP, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/og.svg') return new Response(OG_IMAGE, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/robots.txt') return new Response(ROBOTS, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    let _html = PAGE;
    // Stripe subscription link comes from an env var so it persists across code updates
    // (a hardcoded link in the file would be overwritten every time worker.js is redeployed).
    const _sub = (env.STRIPE_SUB_LINK || env.SUB_LINK || '').trim();
    if (_sub) _html = _html.split(SUB_LINK).join(_sub);
    return new Response(_html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
  }
};


// Collect every configured Gemini key (supports GEMINI_API_KEY, _2.._8, and a
// comma-separated GEMINI_API_KEYS), de-dupe, and shuffle so load spreads evenly
// across keys instead of always hammering the first one. Keys on SEPARATE Google
// projects each carry their own free-tier quota, so more keys = more headroom.
function geminiKeys(env) {
  const set = [];
  const add = (v) => { if (v && typeof v === 'string') v.split(',').forEach(k => { k = k.trim(); if (k && set.indexOf(k) === -1) set.push(k); }); };
  add(env.GEMINI_API_KEY);
  add(env.GEMINI_API_KEY2); add(env.GEMINI_API_KEY_2);
  add(env.GEMINI_API_KEY3); add(env.GEMINI_API_KEY4); add(env.GEMINI_API_KEY5);
  add(env.GEMINI_API_KEY6); add(env.GEMINI_API_KEY7); add(env.GEMINI_API_KEY8);
  add(env.GEMINI_API_KEYS);
  for (let i = set.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = set[i]; set[i] = set[j]; set[j] = t; }
  return set;
}

async function callGemini(keys, bodyStr) {
  if (!Array.isArray(keys)) keys = [keys];
  keys = keys.filter(Boolean);
  if (!keys.length) return { error: 'GEMINI_API_KEY not set.' };
  // Generation model. gemini-2.5-flash is fast + reliable, keeping generation well under
  // a browser-friendly timeout. Swap to 'gemini-2.5-pro' for max quality at the cost of speed.
  const MODEL = 'gemini-2.5-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  let lastErr = 'RATE_LIMITED';
  // For each available key, allow one backoff retry on a 429 (free-tier per-minute
  // limits are bursty and usually clear within a couple of seconds). We move to the
  // next key after exhausting retries, and only surface RATE_LIMITED once everything
  // is truly out of capacity.
  for (let i = 0; i < keys.length; i++) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (i > 0 && attempt === 0) await sleep(800);  // brief gap before trying the next key
        if (attempt > 0) await sleep(2800);             // backoff before retrying the same key
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': keys[i] },
          body: bodyStr,
          signal: AbortSignal.timeout(140000)
        });
        const text = await r.text();
        let d;
        try { d = JSON.parse(text); } catch(e) {
          return { error: 'Bad response: ' + text.slice(0, 150) };
        }
        if (r.status === 429 || (d.error && d.error.code === 429)) {
          let detail = ''; try { detail = JSON.stringify(d.error || d).toLowerCase(); } catch(e) {}
          try { console.warn('[Websprout] Gemini 429 — ' + (((d.error && d.error.message) || '') + '').slice(0, 240)); } catch(e) {}
          lastErr = (detail.indexOf('freetier') > -1 || detail.indexOf('free_tier') > -1 || detail.indexOf('free tier') > -1) ? 'RATE_LIMITED_FREE' : 'RATE_LIMITED';
          break; // do not re-fire the same key on a 429 — it only burns another request against the quota; the frontend already waits and retries
        }
        if (!r.ok) return { error: (d.error && d.error.message) || ('API error ' + r.status) };
        return { data: d };
      } catch(e) {
        lastErr = (e && e.name === 'TimeoutError') ? 'The AI took too long to respond — please try again.' : ((e && e.message) || 'Network error');
        break; // network/timeout won't be helped by retrying the same key — move on
      }
    }
  }
  return { error: lastErr };
}


function getStyleDirection(prompt) {
  var p = prompt.toLowerCase();
  // If user specified colors, don't override them
  var colorWords = ['red','blue','green','purple','black','white','dark','light','orange','yellow','pink','gold','navy','teal','gray','grey','brown','coral','mint','cream'];
  var userSpecifiedColors = colorWords.some(function(w){ return p.includes(w); });
  if (userSpecifiedColors) {
    return 'STYLE DIRECTION: Use the exact colors the user specified in their prompt. Follow their color choices precisely.';
  }
  return 'STYLE DIRECTION: ' + getCategoryStyle(prompt);
}

function getCategoryStyle(prompt) {
  var p = prompt.toLowerCase();

  // Detect category and return a highly specific design brief
  if (p.match(/coffee|cafe|bakery|restaurant|food|bar|bistro|brewery|pizza|sushi|burger/)) {
    var styles = [
      'Rich, warm editorial. Deep espresso brown (#1a0f0a) hero with cream (#fdf6ec) body. Oversized serif-inspired headings in a warm off-white. Menu items in elegant cards with bottom borders. Gold (#c9a84c) accent for prices and CTAs. Think: high-end NYC coffee bar.',
      'Clean Scandinavian cafe aesthetic. Off-white (#fafaf7) background, charcoal (#2d2d2d) text. Warm terracotta (#c4622d) accent. Large product cards with generous padding. Minimal nav. Everything breathes. Think: Copenhagen specialty coffee.',
      'Bold Italian trattoria energy. Cream (#fef9f0) background, deep forest green (#1b4332) primary color, rust red (#c0392b) accent. Hand-feel typography sizing. Generous section spacing. Think: Soho Italian restaurant.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/saas|software|app|platform|tool|dashboard|analytics|crm|workflow|automation|tech|startup/)) {
    var styles = [
      'Modern SaaS like Linear or Vercel. Pure white (#ffffff) body, deep midnight (#0f0f23) hero with subtle purple gradient overlay. Electric purple (#7c3aed) accent. Sharp geometric cards with thin 1px borders. Monospace touches in code snippets. Think: $1B startup landing page.',
      'Clean B2B SaaS like Notion. Soft off-white (#f9f9f7) background, near-black (#1a1a1a) text, bright blue (#2563eb) accent. Data visualization cards with numbers in huge type. Trust badges. Testimonials from job titles not names. Think: enterprise software.',
      'Bold growth-stage startup. White body, electric teal (#0891b2) to indigo (#4f46e5) hero gradient. White text in hero. Feature grid with icon boxes. Large social proof numbers (10,000+ users). Think: Y Combinator portfolio company.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/portfolio|designer|developer|freelance|creative|artist|photographer|architect/)) {
    var styles = [
      'Minimal designer portfolio like awwwards winners. Pure white, near-black text, single accent (your choice of one color). Huge project cards that fill the width. Name in massive display type in the hero. Case study hover effects with CSS only. Think: top Dribbble designer.',
      'Dark creative portfolio. Deep charcoal (#111111) background with off-white (#f0ede8) text. Accent in electric yellow (#fbbf24) or hot pink (#ec4899). Project grid with 2-column asymmetric layout. Huge hover states. Think: award-winning creative agency.',
      'Editorial magazine portfolio. Off-white (#fafaf8) body, oversized serif headings mixed with light sans-serif body. Black and white with one color accent. Horizontal scrolling feel achieved with CSS. Think: high-fashion editorial.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/gym|fitness|workout|personal trainer|yoga|pilates|crossfit|health|wellness|spa|meditation/)) {
    var styles = [
      'High performance gym brand. Jet black (#0a0a0a) hero, electric lime green (#84cc16) accent, white body sections. Bold condensed headings in ALL CAPS. Stats section with huge numbers. Before/after style feature layout. Think: Nike Training or Gymshark.',
      'Premium wellness studio. Warm white (#fefcf8) background, sage green (#4a7c59) primary, warm sand (#d4a574) accent. Soft rounded everything. Testimonials section with leaf/plant decorations in CSS. Calm and aspirational. Think: high-end yoga studio.',
      'Modern fitness app landing page. White body, deep navy (#0f172a) hero, coral (#f97316) accent. Feature cards showing app screens as CSS art boxes. Progress bar animations via CSS only. Think: fitness tech startup.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/law|legal|attorney|lawyer|firm|consulting|finance|accounting|insurance|real estate|agency/)) {
    var styles = [
      'Premium professional services. Rich navy (#0f2447) hero and accents, crisp white body, gold (#b8962e) for CTAs and highlights. Serif-feel headings via font-weight manipulation. Practice area cards with thin borders. Trust indicators front and center. Think: top NYC law firm.',
      'Modern boutique consultancy. Slate gray (#334155) body text on warm white (#fdfcfb), electric blue (#0ea5e9) accent. Clean grid layout, lots of whitespace. Stats in large type. Photo placeholders as gradient boxes. Think: McKinsey meets startup agency.',
      'Approachable professional. Soft light blue (#f0f9ff) background sections, deep teal (#0f766e) primary color, white cards. Friendly rounded corners but still serious. FAQ accordion section. Think: modern regional law firm.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/shop|store|ecommerce|product|sell|merch|clothing|fashion|boutique|jewelry|brand/)) {
    var styles = [
      'Premium editorial ecommerce like Net-a-Porter. Pure white, thin typography, black accents. Product cards with full-bleed gradient placeholders. Price in elegant type. Hover states that shift card up with shadow. Think: luxury fashion brand.',
      'Bold streetwear brand. Off-black (#111111) hero, raw white body, accent in electric orange (#f97316) or acid yellow. Heavy brutalist typography with thin subtitle contrast. Product grid with big hover scale. Think: Supreme or Palace.',
      'Clean DTC brand. Warm cream (#fdf8f0) background, forest green (#166534) primary, white CTA buttons. Story-driven about section. Lifestyle-feel product cards. Trust badges (free shipping, returns). Think: successful Shopify brand.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/blog|news|magazine|journal|newsletter|content|media|publication/)) {
    var styles = [
      'Premium editorial magazine. Off-white (#fafaf8), near-black body text, red (#dc2626) accent for featured labels. Mix of large and small article cards. Sticky sidebar. Pull quotes in large italic. Think: The Atlantic or NY Times digital.',
      'Modern newsletter/media brand. Clean white, royal blue (#1d4ed8) accent, strong grid. Featured article takes 60% width, secondaries in sidebar. Category pills. Reading time indicators. Think: Morning Brew or The Hustle.',
      'Minimalist personal blog. Warm white (#fffef7), dark gray (#1c1917) text, single muted green or terracotta accent. Wide centered content column. Drop caps on first paragraph. Clean tag system. Think: a writer with taste.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/music|band|artist|concert|events|venue|nightclub|festival|entertainment/)) {
    var styles = [
      'Dark entertainment brand. Near-black (#09090b) hero and body, electric purple (#a855f7) to pink (#ec4899) gradient accents. Glassmorphism cards on dark bg (rgba white with blur). Grid of upcoming shows. Think: Spotify meets concert venue.',
      'Indie music artist. Deep charcoal (#1c1917) background, warm amber (#f59e0b) accent, cream text. Large tour dates section. Music section with styled audio player boxes. Think: premium indie label.',
      'Festival/events brand. Vivid gradient hero (coral #fb7185 to yellow #fbbf24). White body with gradient card accents. Bold condensed headings. Countdown-style stats boxes. Think: Coachella or SXSW.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  if (p.match(/nonprofit|charity|foundation|donation|volunteer|community|church|organization/)) {
    var styles = [
      'Trustworthy impact organization. Deep ocean blue (#1e3a5f) hero, white body, warm orange (#f97316) accent. Impact stats in large bold numbers. Mission statement in large display type. Clean donation CTA section. Think: well-funded nonprofit.',
      'Warm community organization. Soft sage (#f0fdf4) background, deep green (#166534) primary, golden yellow accent. Story-first layout with cause description before ask. Volunteer cards with placeholder headshots. Think: local community foundation.'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  // DEFAULT - high quality generic with variety
  var defaults = [
    'Bold minimal. Pure white body, jet black (#0a0a0a) hero section, vivid electric blue (#2563eb) accent. Giant display heading in hero. Feature cards with thin borders. Lots of breathing room. Think: top Y Combinator startup.',
    'Warm editorial. Cream (#fefcf7) background, rich espresso (#1a0f0a) text, terracotta (#c4622d) accent. Rounded cards. Generous padding. Human and approachable. Think: well-designed lifestyle brand.',
    'Clean modern. Soft blue-gray (#f8faff) background, deep navy (#0f2447) text and hero, emerald (#059669) accent. Data-forward feature cards. Trust section with stats. Think: premium B2B product.',
    'Dark hero light body. Near-black (#111827) hero with white text, pure white (#ffffff) body sections, purple (#7c3aed) accent. Alternating section backgrounds. Bold CTA banner. Think: modern SaaS landing page.'
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}


async function doRender(request) {
  try {
    const form = await request.formData();
    const html = form.get('html') || '';
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });
  } catch(e) {
    return new Response('<h2>Error</h2>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}

function succeed(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
function fail(msg) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}

const INBOX_PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard · Websprout</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232d7a3a'/><text y='.9em' font-size='75' x='12'>&#128236;</text></svg>">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f7f3;color:#16221a;line-height:1.5}
.bar{background:#0f1a0d;color:#fff;padding:14px 22px;display:flex;align-items:center;gap:10px}
.bar .logo{width:30px;height:30px;border-radius:8px;background:#2d7a3a;display:flex;align-items:center;justify-content:center;font-size:18px}
.bar b{font-size:18px;font-weight:800;letter-spacing:-.5px}
.bar b span{color:#4ade80}
.wrap{max-width:860px;margin:0 auto;padding:24px 18px 80px}
.gate{background:#fff;border:1px solid #e3ebe0;border-radius:14px;padding:24px;margin-top:24px;max-width:460px;margin-left:auto;margin-right:auto}
.gate h2{font-size:18px;margin-bottom:6px}
.gate p{color:#5a6b5c;font-size:14px;margin-bottom:16px}
label{display:block;font-size:13px;font-weight:600;color:#3a4a3c;margin:12px 0 5px}
input[type=text],input[type=email]{width:100%;padding:11px 13px;border:1px solid #cfdbcb;border-radius:9px;font-size:14px;font-family:inherit}
input:focus{outline:none;border-color:#2d7a3a}
.btn{background:#2d7a3a;color:#fff;border:none;border-radius:9px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.btn:hover{background:#256630}
.btn.ghost{background:#fff;color:#2d7a3a;border:1px solid #cfdbcb}
.btn.ghost:hover{background:#f0f7ee}
.btn.danger{background:#fff;color:#c0392b;border:1px solid #e8c4be}
.head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 8px;flex-wrap:wrap}
.head h1{font-size:22px;letter-spacing:-.5px}
.count{color:#5a6b5c;font-size:14px}
.tools{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 18px}
.notify{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:14px 16px;margin-bottom:18px;display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}
.notify .f{flex:1;min-width:220px}
.card{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:16px 18px;margin-bottom:12px}
.card .when{font-size:12px;color:#8a9a8c;margin-bottom:10px}
.row{display:flex;gap:10px;padding:6px 0;border-top:1px solid #f0f4ee;font-size:14px}
.row:first-of-type{border-top:none}
.row .k{font-weight:700;color:#2d7a3a;min-width:120px;text-transform:capitalize}
.row .v{color:#283a2b;white-space:pre-wrap;word-break:break-word}
.empty{text-align:center;color:#7a8b7c;padding:60px 20px}
.empty .big{font-size:40px;margin-bottom:10px}
.msg{padding:10px 14px;border-radius:9px;font-size:14px;margin:10px 0;display:none}
.msg.ok{background:rgba(45,122,58,.1);color:#256630;display:block}
.msg.err{background:rgba(192,57,43,.1);color:#c0392b;display:block}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:6px 0 14px}
.stat{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:15px 16px}
.stat .num{font-size:26px;font-weight:800;letter-spacing:-.5px;color:#16221a}
.stat .lbl{font-size:13px;font-weight:700;color:#2d7a3a;margin-top:2px}
.stat .sub{font-size:11px;color:#8a9a8c}
.chartcard{background:#fff;border:1px solid #e3ebe0;border-radius:12px;padding:15px 18px;margin-bottom:18px}
.chartcard h3{font-size:13px;color:#3a4a3c;margin-bottom:12px;font-weight:700}
.bars{display:flex;align-items:flex-end;gap:8px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bn{font-size:11px;color:#5a6b5c;font-weight:700}
.btrack{height:70px;width:100%;max-width:30px;display:flex;align-items:flex-end}
.b{width:100%;background:linear-gradient(180deg,#4ade80,#2d7a3a);border-radius:5px 5px 0 0;min-height:3px}
.bd{font-size:10px;color:#8a9a8c}
@media(max-width:560px){.stats{grid-template-columns:repeat(2,1fr)}}
</style></head>
<body>
<div class="bar"><span class="logo">&#128202;</span><b>Web<span>sprout</span> &middot; Dashboard</b></div>
<div class="wrap">
  <div id="gate" class="gate" style="display:none">
    <h2>Open your dashboard</h2>
    <p>Enter your site ID and key. You received these when your site was generated.</p>
    <label>Site ID</label><input id="g_site" type="text" placeholder="ws123abc">
    <label>Key</label><input id="g_key" type="text" placeholder="your key">
    <div style="margin-top:16px"><button class="btn" onclick="openGate()">Open dashboard</button></div>
  </div>
  <div id="app" style="display:none">
    <div class="stats" id="stats"></div>
    <div class="chartcard"><h3>Visitors &middot; last 7 days</h3><div class="bars" id="chartbars"></div></div>
    <div class="notify">
      <div class="f"><label>Email me the moment a new lead comes in</label><input id="notify" type="email" placeholder="you@example.com"></div>
      <button class="btn" onclick="saveNotify()">Save</button>
    </div>
    <div id="nmsg" class="msg"></div>
    <div class="head"><h1>Recent leads</h1><span class="count" id="count"></span></div>
    <div class="tools">
      <button class="btn ghost" onclick="load()">Refresh</button>
      <button class="btn ghost" onclick="exportCsv()">Export CSV</button>
      <button class="btn danger" onclick="clearAll()">Clear all</button>
    </div>
    <div id="list"></div>
  </div>
</div>
<script>
var P=new URLSearchParams(location.search);
var site=P.get('site')||'';var key=P.get('key')||'';var DATA=[];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function show(id,d){document.getElementById(id).style.display=d;}
function openGate(){site=document.getElementById('g_site').value.trim();key=document.getElementById('g_key').value.trim();if(!site||!key)return;history.replaceState(null,'','/inbox?site='+encodeURIComponent(site)+'&key='+encodeURIComponent(key));show('gate','none');show('app','block');load();}
function nmsg(t,ok){var m=document.getElementById('nmsg');m.textContent=t;m.className='msg '+(ok?'ok':'err');setTimeout(function(){m.className='msg';},4000);}
function renderStats(j){
  var total=j.total||0,week=j.week||0,leads=DATA.length;
  var convTxt=total>0?(Math.round(leads/total*1000)/10)+'%':'-';
  function card(num,lbl,sub){return '<div class="stat"><div class="num">'+num+'</div><div class="lbl">'+lbl+'</div><div class="sub">'+sub+'</div></div>';}
  document.getElementById('stats').innerHTML=card(total,'Visitors','all time')+card(week,'Visitors','last 7 days')+card(leads,'Leads','all time')+card(convTxt,'Conversion','leads / visitors');
  var days=j.days||[];var max=1,i;for(i=0;i<days.length;i++){if(days[i].c>max)max=days[i].c;}
  var wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var ch='';
  for(i=0;i<days.length;i++){var c=days[i].c;var pct=Math.round(c/max*100);var ds=days[i].d;var dt=new Date(parseInt(ds.slice(0,4),10),parseInt(ds.slice(4,6),10)-1,parseInt(ds.slice(6,8),10));ch+='<div class="bcol"><div class="bn">'+c+'</div><div class="btrack"><div class="b" style="height:'+pct+'%"></div></div><div class="bd">'+wd[dt.getDay()]+'</div></div>';}
  document.getElementById('chartbars').innerHTML=ch;
}
function load(){fetch('/api/inbox?site='+encodeURIComponent(site)+'&key='+encodeURIComponent(key)).then(function(r){return r.json();}).then(function(j){
  if(j.error){show('app','none');show('gate','block');document.getElementById('g_site').value=site;nmsg(j.error,false);return;}
  DATA=j.submissions||[];document.getElementById('notify').value=j.notify||'';
  renderStats(j);
  document.getElementById('count').textContent=DATA.length+(DATA.length===1?' lead':' leads');
  var L=document.getElementById('list');
  if(!DATA.length){L.innerHTML='<div class="empty"><div class="big">&#128229;</div><p>No leads yet. When someone fills out a form on your site, it shows up here.</p></div>';return;}
  var h='';for(var i=0;i<DATA.length;i++){var s=DATA[i];var d=new Date(s.ts);h+='<div class="card"><div class="when">'+d.toLocaleString()+'</div>';
  for(var k in s.fields){h+='<div class="row"><div class="k">'+esc(k)+'</div><div class="v">'+esc(s.fields[k])+'</div></div>';}h+='</div>';}
  L.innerHTML=h;
}).catch(function(){nmsg('Could not load. Check your link and try again.',false);});}
function saveNotify(){var email=document.getElementById('notify').value.trim();fetch('/api/inbox/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,key:key,email:email})}).then(function(r){return r.json();}).then(function(j){if(j.error){nmsg(j.error,false);}else{nmsg(email?'Saved! New submissions will be emailed to '+email:'Email notifications turned off.',true);}});}
function clearAll(){if(!confirm('Delete ALL submissions for this site? This cannot be undone.'))return;fetch('/api/inbox/clear',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:site,key:key})}).then(function(r){return r.json();}).then(function(){load();});}
function exportCsv(){if(!DATA.length)return;var cols={};DATA.forEach(function(s){for(var k in s.fields)cols[k]=1;});var keys=Object.keys(cols);var rows=[['date'].concat(keys)];DATA.forEach(function(s){var r=[new Date(s.ts).toISOString()];keys.forEach(function(k){r.push(s.fields[k]||'');});rows.push(r);});
  var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(',');}).join('\\n');
  var b=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='websprout-submissions.csv';a.click();}
if(site&&key){show('app','block');load();}else{show('gate','block');if(site)document.getElementById('g_site').value=site;}
</script>
</body></html>`;

// ───────────────────────────────────────────────────────────
// FORM BACKEND — generated sites capture form/email submissions
// ───────────────────────────────────────────────────────────
function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function siteKey(siteId, env){
  const secret = (env && env.FORM_SECRET) || 'ws-forms-v1-shared-secret';
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode('site:' + siteId));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(sig))).replace(/[^A-Za-z0-9]/g,'').slice(0,16);
}

function formCors(){ return { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type' }; }

// ── Visitor analytics for published sites ──
async function doHit(request, env){
  try {
    if (!env.KV) return new Response('{}', { headers: formCors() });
    const b = await request.json().catch(function(){ return {}; });
    const site = String(b.site||'').replace(/[^a-zA-Z0-9]/g,'').slice(0,40);
    if (!site) return new Response('{}', { headers: formCors() });
    const day = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const tk = 'views:'+site+':total', dk = 'views:'+site+':'+day;
    const tv = await env.KV.get(tk); const dv = await env.KV.get(dk);
    await env.KV.put(tk, String((parseInt(tv||'0',10)||0)+1));
    await env.KV.put(dk, String((parseInt(dv||'0',10)||0)+1), { expirationTtl: 60*60*24*120 });
    return new Response('{"ok":true}', { headers: formCors() });
  } catch(e){ return new Response('{}', { headers: formCors() }); }
}
async function doViews(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const total = parseInt((await env.KV.get('views:'+site+':total'))||'0',10)||0;
    const days = []; const now = Date.now(); let week = 0, today = 0;
    for (let i=6;i>=0;i--){
      const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,'');
      const c = parseInt((await env.KV.get('views:'+site+':'+ds))||'0',10)||0;
      days.push({ d: ds, c: c }); week += c; if (i===0) today = c;
    }
    return succeed({ total: total, today: today, week: week, days: days });
  } catch(e){ return fail(e.message); }
}
function jsonR(obj, status){ return new Response(JSON.stringify(obj), { status: status||200, headers: { ...formCors(), 'Content-Type':'application/json' } }); }

async function doFormSubmit(request, env, siteId){
  try {
    if (!siteId || siteId.length < 4 || siteId.length > 40) return jsonR({ ok:false, error:'bad site' }, 400);
    if (!env.KV) return jsonR({ ok:true });
    let data = {};
    const ct = request.headers.get('content-type') || '';
    if (ct.indexOf('application/json') > -1) { data = await request.json(); }
    else { const fd = await request.formData(); fd.forEach(function(v,k){ data[k] = (typeof v === 'string') ? v : '(file)'; }); }
    if (data._ws_hp || data._gotcha) return jsonR({ ok:true }); // honeypot -> silently accept
    const fields = {}; let n = 0;
    for (const k in data){ if (String(k).charAt(0) === '_') continue; if (n++ >= 25) break; let val = data[k]; if (typeof val !== 'string') val = String(val); if (!val) continue; fields[String(k).slice(0,60)] = val.slice(0,3000); }
    if (Object.keys(fields).length === 0) return jsonR({ ok:false, error:'empty' }, 400);
    const ip = request.headers.get('cf-connecting-ip') || '0';
    const rlKey = 'frl:' + siteId + ':' + ip;
    const rl = parseInt(await env.KV.get(rlKey) || '0');
    if (rl > 40) return jsonR({ ok:false, error:'rate' }, 429);
    await env.KV.put(rlKey, String(rl + 1), { expirationTtl: 3600 });
    const ts = Date.now();
    const rec = { ts: ts, fields: fields, ua: (request.headers.get('user-agent')||'').slice(0,180), ref: (request.headers.get('referer')||'').slice(0,180) };
    await env.KV.put('form:' + siteId + ':' + ts + ':' + Math.random().toString(36).slice(2,7), JSON.stringify(rec), { expirationTtl: 60*60*24*120 });
    try { const notify = await env.KV.get('notify:' + siteId); if (notify && env.RESEND_API_KEY) await sendFormEmail(env, notify, siteId, fields); } catch(e){}
    return jsonR({ ok:true });
  } catch(e){ return jsonR({ ok:false, error:'error' }, 500); }
}

async function sendFormEmail(env, to, siteId, fields){
  let rows = '';
  for (const k in fields){ rows += '<tr><td style="padding:7px 12px;font-weight:600;color:#0f1a0d;border-bottom:1px solid #eee;vertical-align:top">' + escHtml(k) + '</td><td style="padding:7px 12px;color:#333;border-bottom:1px solid #eee">' + escHtml(fields[k]).replace(/\n/g,'<br>') + '</td></tr>'; }
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto"><div style="background:#0f1a0d;padding:20px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">🌱 New form submission</span></div><div style="padding:24px"><p style="color:#555;margin:0 0 14px">Someone just submitted a form on your website:</p><table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #eee;border-radius:8px;overflow:hidden">' + rows + '</table><p style="margin:20px 0 0"><a href="https://websprout.app/inbox?site=' + siteId + '" style="color:#2d7a3a;font-weight:700;text-decoration:none">View all submissions in your inbox →</a></p></div></div>';
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'🌱 New submission from your website', html: html }) });
}

async function doInboxData(request, env){
  try {
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const list = await env.KV.list({ prefix: 'form:' + site + ':' });
    const names = list.keys.map(function(k){ return k.name; }).sort().reverse().slice(0,200);
    const subs = [];
    for (const nm of names){ const v = await env.KV.get(nm); if (v){ try { const o = JSON.parse(v); o._k = nm; subs.push(o); } catch(e){} } }
    const notify = await env.KV.get('notify:' + site) || '';
    const total = parseInt((await env.KV.get('views:'+site+':total'))||'0',10)||0;
    const days = []; const now = Date.now(); let week = 0, today = 0;
    for (let i=6;i>=0;i--){ const ds = new Date(now - i*86400000).toISOString().slice(0,10).replace(/-/g,''); const c = parseInt((await env.KV.get('views:'+site+':'+ds))||'0',10)||0; days.push({ d: ds, c: c }); week += c; if (i===0) today = c; }
    return succeed({ submissions: subs, notify: notify, count: subs.length, total: total, today: today, week: week, days: days });
  } catch(e){ return fail(e.message); }
}

async function doInboxNotify(request, env){
  try {
    const b = await request.json();
    if (!b.site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const email = (b.email || '').trim().slice(0,120);
    if (email) await env.KV.put('notify:' + b.site, email); else await env.KV.delete('notify:' + b.site);
    return succeed({ ok:true, notify: email });
  } catch(e){ return fail(e.message); }
}

async function doInboxClear(request, env){
  try {
    const b = await request.json();
    if (!b.site) return fail('Missing site');
    if (!env.KV) return fail('KV not configured');
    if (b.key !== (await siteKey(b.site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{ 'Content-Type':'application/json' } });
    const list = await env.KV.list({ prefix: 'form:' + b.site + ':' });
    for (const k of list.keys){ await env.KV.delete(k.name); }
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

// Injected into every generated site: auto-wires all <form>s to the inbox.
function formScript(siteId){
  const ep = 'https://websprout.app/api/form/' + siteId;
  return '<scr'+'ipt id="_wsForms">(function(){'
  +'var EP="' + ep + '";'
  +'function wire(f){if(f.getAttribute("data-ws")==="1")return;f.setAttribute("data-ws","1");'
  +'if(!f.querySelector("[name=_ws_hp]")){var h=document.createElement("input");h.type="text";h.name="_ws_hp";h.tabIndex=-1;h.setAttribute("autocomplete","off");h.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;opacity:0";f.appendChild(h);}'
  +'f.addEventListener("submit",function(e){e.preventDefault();var d={};var els=f.querySelectorAll("input,textarea,select");for(var i=0;i<els.length;i++){var el=els[i];if(!el.name)continue;var t=(el.type||"").toLowerCase();if(t==="checkbox"||t==="radio"){if(!el.checked)continue;}if(t==="file"||t==="submit"||t==="button")continue;d[el.name]=el.value;}'
  +'var btn=f.querySelector("[type=submit],button");var bt="";if(btn){bt=btn.textContent;btn.disabled=true;btn.textContent="Sending...";}'
  +'fetch(EP,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(function(r){return r.json();}).then(function(j){'
  +'if(j&&j.ok){var m=document.createElement("div");m.setAttribute("style","padding:16px 18px;margin:8px 0;border-radius:10px;background:rgba(45,122,58,.12);color:#2d7a3a;font-weight:600;text-align:center;font-family:inherit");m.textContent="Thanks! Your message has been received.";f.parentNode.replaceChild(m,f);}'
  +'else{if(btn){btn.disabled=false;btn.textContent=bt;}alert("Sorry, something went wrong. Please try again.");}'
  +'}).catch(function(){if(btn){btn.disabled=false;btn.textContent=bt;}alert("Could not send right now. Please try again.");});'
  +'});}'
  +'function callbar(){try{if(window.self!==window.top)return;if(window.innerWidth>640)return;if(document.getElementById("_wsCall"))return;var ls=document.getElementsByTagName("a");var t=null;for(var i=0;i<ls.length;i++){var hh=ls[i].getAttribute("href")||"";if(hh.indexOf("tel:")===0){t=ls[i];break;}}if(!t)return;var bar=document.createElement("a");bar.id="_wsCall";bar.href=t.getAttribute("href");bar.setAttribute("style","position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;justify-content:center;gap:8px;padding:15px 16px;background:#16a34a;color:#fff;font-weight:700;font-size:16px;letter-spacing:.01em;text-decoration:none;font-family:inherit;box-shadow:0 -2px 14px rgba(0,0,0,.2)");bar.textContent="\u260E  Call now";document.body.appendChild(bar);document.body.style.paddingBottom="74px";}catch(e){}}'
  +'function init(){var fs=document.querySelectorAll("form");for(var i=0;i<fs.length;i++){if(fs[i].getAttribute("data-ws-skip")!=null)continue;wire(fs[i]);}callbar();window.addEventListener("resize",callbar);}'
  +'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}'
  +'try{if(window.self===window.top){var _vk="wsv_'+siteId+'";if(!sessionStorage.getItem(_vk)){sessionStorage.setItem(_vk,"1");fetch("https://websprout.app/api/hit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:"'+siteId+'"}),keepalive:true,mode:"no-cors"}).catch(function(){});}}}catch(e){}'
  +'})();</scr'+'ipt>';
}
// Defensive CSS net: injected into every generated site to prevent the most
// common layout bugs (sideways scroll, overflowing media, clipped headings)
// without overriding the design's intentional styles.
function withFix(html){
  if (!html || html.indexOf('_wsFix') > -1) return html;
  const css = '<style id="_wsFix">*,*::before,*::after{box-sizing:border-box}html{overflow-x:clip}body{overflow-x:hidden;max-width:100%}img,svg,video,canvas,iframe{max-width:100%}h1,h2,h3,h4,h5,h6{overflow-wrap:break-word}pre,code{max-width:100%;overflow-x:auto}</style>';
  const hi = html.indexOf('</head>');
  if (hi > -1) return html.slice(0,hi) + css + html.slice(hi);
  const b = html.indexOf('<body');
  if (b > -1){ const gt = html.indexOf('>', b); if (gt > -1) return html.slice(0,gt+1) + css + html.slice(gt+1); }
  return css + html;
}
function withForms(html, siteId){
  if (!html || html.indexOf('_wsForms') > -1) return html;
  let out = html;
  const meta = '<meta name="ws-site" content="' + siteId + '">';
  const hi = out.indexOf('</head>');
  if (hi > -1) out = out.slice(0,hi) + meta + out.slice(hi);
  const s = formScript(siteId);
  const bi = out.lastIndexOf('</body>');
  return bi > -1 ? out.slice(0,bi) + s + out.slice(bi) : out + s;
}

// ───────────────────────────────────────────────────────────
// PUBLISH — host generated sites live on websprout.app subdomains
// ───────────────────────────────────────────────────────────
const RESERVED_SLUGS = ['www','app','api','inbox','preview','admin','mail','blog','help','support','status','cdn','assets','static','dashboard','login','signup','sign-up','docs','about','terms','privacy','deploy','render','generate','stats','track','chat','modify','publish','unpublish','s','og','robots','sitemap','success'];
function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40); }

const PUB_404 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site not found</title><style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}.b{max-width:420px;padding:24px}.m{font-size:40px;margin-bottom:10px}a{color:#4ade80;font-weight:700;text-decoration:none}</style></head><body><div class="b"><div class="m">🌱</div><h1 style="font-size:22px;margin:0 0 8px">This site isn\'t published yet</h1><p style="color:rgba(255,255,255,.6);line-height:1.6">There\'s no live site at this address. <br>Build your own in seconds at <a href="https://websprout.app">websprout.app</a>.</p></div></body></html>';

function withBadge(html){
  if (!html || html.indexOf('ws-badge') > -1) return html;
  const b = '<a href="https://websprout.app/?ref=badge" target="_blank" rel="noopener" id="ws-badge" style="position:fixed;bottom:14px;right:14px;z-index:2147483600;display:flex;align-items:center;gap:6px;background:rgba(15,26,13,.92);color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;font-size:12px;font-weight:600;padding:7px 12px;border-radius:100px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.14);line-height:1">🌱 Built with Websprout</a>';
  const i = html.lastIndexOf('</body>');
  return i > -1 ? html.slice(0,i) + b + html.slice(i) : html + b;
}
async function servePublished(slug, env){
  if (!env || !env.KV) return null;
  const html = await env.KV.get('pub:' + slug);
  if (!html) return null;
  return new Response(withBadge(html), { headers: { 'Content-Type':'text/html; charset=utf-8', 'X-Robots-Tag':'all' } });
}

async function doPublish(request, env){
  try {
    if (!env.KV) return fail('Publishing storage is not configured');
    const b = await request.json();
    if (!b.html || !b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const slug = slugify(b.slug || '');
    if (slug.length < 3) return fail('Pick a name with at least 3 letters/numbers');
    if (RESERVED_SLUGS.indexOf(slug) > -1) return fail('That name is reserved — choose another');
    const existing = await env.KV.get('pubmeta:' + slug);
    if (existing){ try { if (JSON.parse(existing).siteId !== b.siteId) return fail('That name is already taken — try another'); } catch(e){} }
    if (b.html.length > 4*1024*1024) return fail('Site is too large to publish');
    await env.KV.put('pub:' + slug, b.html);
    await env.KV.put('pubmeta:' + slug, JSON.stringify({ siteId: b.siteId, updated: Date.now() }));
    return succeed({ ok:true, slug: slug, url: 'https://' + slug + '.websprout.app', pathUrl: 'https://websprout.app/s/' + slug });
  } catch(e){ return fail(e.message); }
}

async function doUnpublish(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.slug || !b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const m = await env.KV.get('pubmeta:' + b.slug);
    if (m){ try { if (JSON.parse(m).siteId !== b.siteId) return fail('Not your site'); } catch(e){} }
    await env.KV.delete('pub:' + b.slug); await env.KV.delete('pubmeta:' + b.slug);
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

async function doSlugCheck(request, env){
  try {
    const url = new URL(request.url);
    const slug = slugify(url.searchParams.get('slug') || '');
    const sid = url.searchParams.get('siteId') || '';
    if (slug.length < 3) return succeed({ available:false, slug:slug, reason:'too short' });
    if (RESERVED_SLUGS.indexOf(slug) > -1) return succeed({ available:false, slug:slug, reason:'reserved' });
    if (!env.KV) return succeed({ available:true, slug:slug });
    const existing = await env.KV.get('pubmeta:' + slug);
    let avail = !existing;
    if (existing && sid){ try { if (JSON.parse(existing).siteId === sid) avail = true; } catch(e){} }
    return succeed({ available: avail, slug: slug });
  } catch(e){ return fail(e.message); }
}

async function doDomainCheck(request, env){
  try {
    const url = new URL(request.url);
    const domain = (url.searchParams.get('domain') || '').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
    const aff = env.GODADDY_AFFILIATE || '';
    const buyUrl = aff ? aff : ('https://www.godaddy.com/domainsearch/find?domainToCheck=' + encodeURIComponent(domain));
    if (!domain || domain.indexOf('.') === -1) return succeed({ ok:false, buyUrl: buyUrl });
    if (env.GODADDY_KEY && env.GODADDY_SECRET){
      try {
        const r = await fetch('https://api.godaddy.com/v1/domains/available?domain=' + encodeURIComponent(domain), { headers: { 'Authorization': 'sso-key ' + env.GODADDY_KEY + ':' + env.GODADDY_SECRET, 'Accept':'application/json' }, signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return succeed({ ok:true, domain: domain, available: (typeof d.available === 'boolean' ? d.available : null), price: d.price ? (d.price/1000000) : null, buyUrl: buyUrl });
      } catch(e){ return succeed({ ok:true, domain: domain, available: null, buyUrl: buyUrl }); }
    }
    return succeed({ ok:true, domain: domain, available: null, buyUrl: buyUrl });
  } catch(e){ return fail(e.message); }
}

async function doConnectDomain(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.domain || !b.slug || !b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const m = await env.KV.get('pubmeta:' + b.slug);
    if (!m) return fail('Publish your site first, then connect the domain');
    try { if (JSON.parse(m).siteId !== b.siteId) return fail('Not your site'); } catch(e){}
    const host = b.domain.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'').replace(/^www\./,'');
    if (host.indexOf('.') === -1) return fail('Enter a valid domain');
    await env.KV.put('domain:' + host, b.slug);
    await env.KV.put('domain:www.' + host, b.slug);
    return succeed({ ok:true, host: host });
  } catch(e){ return fail(e.message); }
}

// ───────────────────────────────────────────────────────────
// ACCOUNTS — Google OAuth + passwordless email links + sessions
// ───────────────────────────────────────────────────────────
const SITE_ORIGIN = 'https://websprout.app';
function randToken(n){ n=n||24; const a=new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a).map(function(b){return ('0'+b.toString(16)).slice(-2);}).join(''); }
function parseCookies(request){ const h=request.headers.get('Cookie')||''; const o={}; h.split(';').forEach(function(p){ const i=p.indexOf('='); if(i>-1) o[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim()); }); return o; }
function sessionCookie(token){ return 'ws_sess='+token+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age='+(60*60*24*30); }
function clearCookie(name){ return name+'=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'; }
function jwtPayload(jwt){ try{ const p=jwt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'); const pad=p.length%4?'='.repeat(4-p.length%4):''; return JSON.parse(decodeURIComponent(escape(atob(p+pad)))); }catch(e){ return null; } }
async function mintSession(email, env){ const t=randToken(24); await env.KV.put('sess:'+t, JSON.stringify({ email:email, exp:Date.now()+1000*60*60*24*30 }), { expirationTtl:60*60*24*30 }); return t; }
async function getSession(request, env){ if(!env.KV) return null; const t=parseCookies(request)['ws_sess']; if(!t) return null; const v=await env.KV.get('sess:'+t); if(!v) return null; try{ const s=JSON.parse(v); if(s.exp&&s.exp<Date.now()) return null; return s; }catch(e){ return null; } }
async function getUserOrCreate(email, name, env){ const k='user:'+email.toLowerCase(); const v=await env.KV.get(k); if(v){ try{ return JSON.parse(v); }catch(e){} } const u={ email:email.toLowerCase(), name:name||'', created:Date.now(), plan:'free' }; await env.KV.put(k, JSON.stringify(u)); return u; }

async function doGoogleStart(request, env){
  if(!env.GOOGLE_CLIENT_ID) return new Response('Google sign-in is not configured yet.', { status:503 });
  const state=randToken(16);
  const u='https://accounts.google.com/o/oauth2/v2/auth?client_id='+encodeURIComponent(env.GOOGLE_CLIENT_ID)
    +'&redirect_uri='+encodeURIComponent(SITE_ORIGIN+'/auth/google/callback')
    +'&response_type=code&scope='+encodeURIComponent('openid email profile')+'&state='+state+'&access_type=online&prompt=select_account';
  const h=new Headers(); h.append('Location',u); h.append('Set-Cookie','ws_ostate='+state+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600');
  return new Response(null, { status:302, headers:h });
}
async function doGoogleCallback(request, env){
  try{
    const url=new URL(request.url);
    const code=url.searchParams.get('code'), state=url.searchParams.get('state');
    if(!code||!state||state!==parseCookies(request)['ws_ostate']) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const body=new URLSearchParams({ code:code, client_id:env.GOOGLE_CLIENT_ID, client_secret:env.GOOGLE_CLIENT_SECRET, redirect_uri:SITE_ORIGIN+'/auth/google/callback', grant_type:'authorization_code' });
    const r=await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body.toString() });
    const tok=await r.json();
    if(!tok.id_token) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const p=jwtPayload(tok.id_token);
    if(!p||!p.email) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    await getUserOrCreate(p.email, p.name||'', env);
    const t=await mintSession(p.email, env);
    const h=new Headers(); h.append('Location',SITE_ORIGIN+'/?login=ok'); h.append('Set-Cookie',sessionCookie(t)); h.append('Set-Cookie',clearCookie('ws_ostate'));
    return new Response(null, { status:302, headers:h });
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?login=error',302); }
}
async function doEmailStart(request, env){
  try{
    if(!env.KV) return fail('Not configured');
    if(!env.RESEND_API_KEY) return fail('Email sign-in is not configured yet');
    const b=await request.json();
    const email=String(b.email||'').trim().toLowerCase();
    if(!email||email.indexOf('@')<1||email.indexOf('.')<0) return fail('Enter a valid email');
    const t=randToken(20);
    await env.KV.put('magic:'+t, JSON.stringify({ email:email, exp:Date.now()+1000*60*15 }), { expirationTtl:60*15 });
    const link=SITE_ORIGIN+'/auth/verify?token='+t;
    const html='<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:460px;margin:0 auto;padding:24px"><div style="font-size:22px;font-weight:800;color:#2d7a3a;margin-bottom:8px">🌱 Sign in to Websprout</div><p style="color:#444;line-height:1.6">Click the button below to sign in. This link works once and expires in 15 minutes.</p><p style="margin:24px 0"><a href="'+link+'" style="background:#2d7a3a;color:#fff;padding:13px 26px;border-radius:9px;text-decoration:none;font-weight:700;display:inline-block">Sign in to Websprout</a></p><p style="color:#999;font-size:12px">If you didn\'t request this, you can safely ignore this email.</p></div>';
    await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[email], subject:'Your Websprout sign-in link', html:html }) });
    return succeed({ ok:true });
  }catch(e){ return fail(e.message); }
}
async function doVerify(request, env){
  try{
    const t=new URL(request.url).searchParams.get('token');
    if(!t||!env.KV) return Response.redirect(SITE_ORIGIN+'/?login=error',302);
    const v=await env.KV.get('magic:'+t);
    if(!v) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    const m=JSON.parse(v); await env.KV.delete('magic:'+t);
    if(m.exp<Date.now()) return Response.redirect(SITE_ORIGIN+'/?login=expired',302);
    await getUserOrCreate(m.email, '', env);
    const st=await mintSession(m.email, env);
    const h=new Headers(); h.append('Location',SITE_ORIGIN+'/?login=ok'); h.append('Set-Cookie',sessionCookie(st));
    return new Response(null, { status:302, headers:h });
  }catch(e){ return Response.redirect(SITE_ORIGIN+'/?login=error',302); }
}
async function doMe(request, env){
  const s=await getSession(request, env);
  if(!s) return succeed({ auth:false });
  let u=null; try{ u=JSON.parse(await env.KV.get('user:'+s.email)||'null'); }catch(e){}
  return succeed({ auth:true, email:s.email, name:(u&&u.name)||'', plan:(u&&u.plan)||'free', pro:!!(u&&u.plan==='pro') });
}
async function doLogout(request, env){
  const t=parseCookies(request)['ws_sess'];
  if(t&&env.KV) await env.KV.delete('sess:'+t);
  return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json', 'Set-Cookie':clearCookie('ws_sess') } });
}

// ── Stripe subscription: signature-verified webhook + account entitlement ──
async function verifyStripeSig(rawBody, sigHeader, secret){
  try{
    if(!sigHeader||!secret) return false;
    let t='', v1='';
    sigHeader.split(',').forEach(function(p){ const i=p.indexOf('='); if(i<0) return; const k=p.slice(0,i), val=p.slice(i+1); if(k==='t')t=val; if(k==='v1'&&!v1)v1=val; });
    if(!t||!v1) return false;
    const enc=new TextEncoder();
    const key=await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
    const sig=await crypto.subtle.sign('HMAC', key, enc.encode(t+'.'+rawBody));
    const hex=Array.from(new Uint8Array(sig)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    if(hex.length!==v1.length) return false;
    let diff=0; for(let i=0;i<hex.length;i++){ diff |= hex.charCodeAt(i)^v1.charCodeAt(i); }
    return diff===0;
  }catch(e){ return false; }
}
async function setUserPlan(env, email, plan, cust, sub){
  if(!email) return;
  const k='user:'+email.toLowerCase();
  let u={}; try{ u=JSON.parse(await env.KV.get(k)||'{}'); }catch(e){}
  if(!u.email) u.email=email.toLowerCase();
  u.plan=plan;
  if(cust){ u.stripeCustomer=cust; await env.KV.put('stripecust:'+cust, email.toLowerCase()); }
  if(sub!==undefined&&sub!=='') u.stripeSub=sub;
  u.planUpdated=Date.now();
  await env.KV.put(k, JSON.stringify(u));
}
async function doStripeWebhook(request, env){
  const raw = await request.text();
  if(!env.STRIPE_WEBHOOK_SECRET) return new Response('webhook not configured', { status:503 });
  const okSig = await verifyStripeSig(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
  if(!okSig) return new Response('bad signature', { status:400 });
  let ev={}; try{ ev=JSON.parse(raw); }catch(e){ return new Response('bad json', { status:400 }); }
  try{
    const obj=(ev.data&&ev.data.object)||{};
    const cust=obj.customer||'';
    if(ev.type==='checkout.session.completed'){
      const email=(obj.client_reference_id||obj.customer_email||(obj.customer_details&&obj.customer_details.email)||'').toLowerCase();
      if(email) await setUserPlan(env, email, 'pro', cust, obj.subscription||'');
    } else if(ev.type==='invoice.paid'||ev.type==='invoice.payment_succeeded'){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'pro', cust, obj.subscription||'');
    } else if(ev.type==='customer.subscription.deleted'||ev.type==='invoice.payment_failed'){
      const em=cust?await env.KV.get('stripecust:'+cust):''; if(em) await setUserPlan(env, em, 'free', cust, '');
    } else if(ev.type==='customer.subscription.updated'){
      const st=obj.status||''; const em=cust?await env.KV.get('stripecust:'+cust):'';
      if(em) await setUserPlan(env, em, (st==='active'||st==='trialing')?'pro':'free', cust, obj.id||'');
    }
  }catch(e){}
  return new Response('{"received":true}', { headers:{ 'Content-Type':'application/json' } });
}

// ── Saved sites: let users return and keep editing ──
async function doSave(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const b = await request.json();
    if (!b.siteId || !b.key || !b.html) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    if (b.html.length > 4*1024*1024) return fail('Site too large');
    await env.KV.put('draft:' + b.siteId, JSON.stringify({ html: b.html, name: (b.name||'My site').slice(0,90), ts: Date.now() }), { expirationTtl: 60*60*24*365 });
    try {
      const s = await getSession(request, env);
      if (s && s.email) {
        const lk = 'usersites:' + s.email;
        let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
        let found = false;
        for (let i=0;i<list.length;i++){ if(list[i].siteId===b.siteId){ list[i].name=(b.name||list[i].name); list[i].key=b.key; list[i].ts=Date.now(); found=true; break; } }
        if(!found) list.push({ siteId:b.siteId, key:b.key, name:(b.name||'My site'), ts:Date.now() });
        list.sort(function(a,c){ return (c.ts||0)-(a.ts||0); });
        if(list.length>100) list=list.slice(0,100);
        await env.KV.put(lk, JSON.stringify(list));
      }
    } catch(e){}
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}
async function doMySites(request, env){
  const s = await getSession(request, env);
  if (!s || !s.email) return succeed({ auth:false, sites:[] });
  let list = []; try { list = JSON.parse(await env.KV.get('usersites:'+s.email) || '[]'); } catch(e){}
  return succeed({ auth:true, sites:list });
}
async function doMySitesClaim(request, env){
  try {
    const s = await getSession(request, env);
    if (!s || !s.email) return fail('Not signed in');
    const b = await request.json();
    if (!Array.isArray(b.sites)) return succeed({ ok:true });
    const lk = 'usersites:'+s.email;
    let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
    const map = {}; list.forEach(function(p){ map[p.siteId]=p; });
    for (const it of b.sites){
      if (!it || !it.siteId || !it.key) continue;
      if (it.key !== (await siteKey(it.siteId, env))) continue;
      const ex = map[it.siteId];
      if (!ex || (it.ts||0) > (ex.ts||0)) map[it.siteId] = { siteId:it.siteId, key:it.key, name:(it.name||'My site'), ts:(it.ts||Date.now()) };
    }
    let merged = Object.keys(map).map(function(k){ return map[k]; });
    merged.sort(function(a,c){ return (c.ts||0)-(a.ts||0); });
    if (merged.length>100) merged = merged.slice(0,100);
    await env.KV.put(lk, JSON.stringify(merged));
    return succeed({ ok:true, count:merged.length });
  } catch(e){ return fail(e.message); }
}
async function doMySitesDelete(request, env){
  try {
    const s = await getSession(request, env);
    if (!s || !s.email) return succeed({ ok:true });
    const b = await request.json();
    if (!b.siteId) return fail('Missing siteId');
    const lk = 'usersites:'+s.email;
    let list = []; try { list = JSON.parse(await env.KV.get(lk) || '[]'); } catch(e){}
    list = list.filter(function(x){ return x.siteId !== b.siteId; });
    await env.KV.put(lk, JSON.stringify(list));
    return succeed({ ok:true });
  } catch(e){ return fail(e.message); }
}

async function doLoad(request, env){
  try {
    if (!env.KV) return fail('KV not configured');
    const url = new URL(request.url);
    const site = url.searchParams.get('site') || '';
    const key = url.searchParams.get('key') || '';
    if (!site) return fail('Missing site');
    if (key !== (await siteKey(site, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    const v = await env.KV.get('draft:' + site);
    if (!v) return fail('Not found');
    return new Response(v, { headers: { 'Content-Type':'application/json' } });
  } catch(e){ return fail(e.message); }
}

// Auto-detect the business type from the prompt and inject an industry-specific
// playbook so generated sites have the sections, forms, copy and tone that the
// niche actually needs. First match wins; returns '' for unrecognized types.
function getNicheDirection(prompt){
  const p = ' ' + String(prompt||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ') + ' ';
  const niches = [
    { k:[' charter','yacht','marina','sailing',' sail ','boat detail','boat rental','boat tour',' captain ','pontoon','jet ski','deep sea','fishing trip','fishing charter',' vessel',' boating',' boats',' boat '],
      block:'INDUSTRY PLAYBOOK — Marine & Charter. This is a boating or charter business (charters, fishing trips, boat rentals, boat detailing, or marina services). Beyond the standard sections, you MUST include: a FLEET / OUR BOATS section listing each vessel with length, guest capacity and standout features; a TRIPS & PACKAGES section (for example half-day, full-day, sunset, or fishing) with what is included and from-pricing; a CAPTAIN & CREW section establishing USCG licensing, years on the water and a safety-first reputation; a WHERE WE SAIL / SERVICE AREA section naming the home marina and the waters covered; and a guest PHOTO GALLERY of trips on the water. The inquiry/booking form must capture name, email, phone, preferred date, number of guests, and trip type. Use confident nautical language (book your charter, come aboard, set sail). Imagery should evoke open water, sunsets on the bay, and happy guests aboard. Tone: adventurous yet trustworthy and safety-conscious.' },
    { k:['auto repair',' mechanic','car detail','auto detail',' tires','body shop','oil change','transmission','automotive',' car wash','brake','windshield'],
      block:'INDUSTRY PLAYBOOK — Automotive. This is an auto business (repair, mechanic, detailing, tires, or body shop). Beyond the standard sections, include: a SERVICES list with clear descriptions; a prominent BOOK SERVICE / SCHEDULE APPOINTMENT call-to-action; a WHY CHOOSE US section emphasizing certified technicians, honest pricing and warranties; and SERVICE AREA plus HOURS. The form must capture name, phone, vehicle make, model and year, and the service needed. Use honest, dependable, no-runaround language. Tone: trustworthy and straightforward.' },
    { k:['plumb','electrician','electrical',' hvac','heating','air condition','furnace','landscap',' lawn ','roofing',' roofer','handyman','contractor','pest control','cleaning service','maid service','junk removal',' painter','house painting',' fencing','concrete','pressure wash','power wash','septic','gutter','drywall','remodel'],
      block:'INDUSTRY PLAYBOOK — Home Services & Trades. This is a local service business (plumbing, electrical, HVAC, landscaping, roofing, cleaning, handyman, pest control, and similar). Beyond the standard sections, include: a SERVICES section listing each specific service with a one-line benefit; a SERVICE AREA section naming the towns or zip codes covered; a WHY CHOOSE US section emphasizing licensed and insured, years in business, and a satisfaction guarantee; clear emergency or same-day availability when relevant; and a BEFORE & AFTER or recent-work gallery. The form must be a FREE ESTIMATE request capturing name, phone, email, service needed, property address or zip, and a short message. Put the phone number and a Get a Free Estimate button in the header and hero. Tone: reliable, prompt, neighborly.' },
    { k:[' salon',' spa ','barber',' hair ','hair salon','nails',' nail ',' lash','brows','eyebrow','massage','esthetic','makeup','waxing',' tattoo','tanning',' beauty'],
      block:'INDUSTRY PLAYBOOK — Salon, Spa & Beauty. This is a beauty or grooming business (hair, nails, lashes, barber, spa, massage, or esthetics). Beyond the standard sections, include: a SERVICES & PRICING menu listing each treatment with duration and price; a BOOK AN APPOINTMENT call-to-action repeated throughout; an OUR TEAM / STYLISTS section; and a GALLERY of real work. The form must capture name, phone, the service wanted, and preferred date and time. Use polished, pampering language. Tone: clean, stylish and inviting.' },
    { k:[' gym',' fitness','personal train','yoga','pilates','crossfit','martial art','dance studio','workout','bootcamp','wellness center',' trainer'],
      block:'INDUSTRY PLAYBOOK — Fitness & Wellness. This is a fitness business (gym, studio, personal trainer, yoga, pilates, martial arts, or crossfit). Beyond the standard sections, include: a CLASSES or PROGRAMS section with a schedule and descriptions; MEMBERSHIP or PRICING tiers; a TRAINERS / INSTRUCTORS section; and a strong FREE TRIAL or FIRST CLASS FREE offer used as the primary call-to-action. The form should capture name, email, fitness goal, and a free-trial request. Use motivating, high-energy copy. Tone: energetic and encouraging.' },
    { k:['real estate','realtor','real-estate',' realty','homes for sale','property listing',' broker '],
      block:'INDUSTRY PLAYBOOK — Real Estate. This is a real estate agent or brokerage. Beyond the standard sections, include: a FEATURED LISTINGS area; an ABOUT THE AGENT section establishing local expertise and track record; separate BUYING and SELLING service sections; a HOME VALUATION (What is my home worth?) request; and the NEIGHBORHOODS or SERVICE AREAS served. The form should capture name, email, phone, whether they are buying or selling, and their property interest. Tone: professional, approachable, and locally expert.' },
    { k:['lawyer','attorney','law firm','accountant','accounting',' cpa ','consulting','consultant','financial advisor','insurance agency','bookkeep','tax prep','advisory'],
      block:'INDUSTRY PLAYBOOK — Professional Services. This is a professional practice (law, accounting, consulting, financial, or insurance). Beyond the standard sections, include: a PRACTICE AREAS or SERVICES section; an ABOUT section establishing credentials and experience; a clear FREE CONSULTATION request; a HOW IT WORKS / process section; and results or client testimonials. The form should capture name, email, phone, the nature of their need, and a message. Use authoritative, reassuring language and avoid hype. Tone: credible, professional, and calm.' },
    { k:['photograph','videograph','wedding','event plan',' dj ','florist','floral','photo studio','cinematograph'],
      block:'INDUSTRY PLAYBOOK — Photography & Events. This is a creative or events business (photographer, videographer, wedding pro, DJ, florist, or planner). Beyond the standard sections, lead with a prominent PORTFOLIO / GALLERY that dominates the page; include PACKAGES & PRICING; an inquiry or booking section; and an ABOUT section with personality. The form should capture name, email, event date, event type, and location. Let visuals lead. Tone: artistic, warm, and personable.' },
    { k:['restaurant',' cafe',' caf ','coffee shop','bakery','bistro',' diner','eatery','pizzeria','food truck','catering',' grill ',' brewery','steakhouse','taqueria',' deli ',' bar '],
      block:'INDUSTRY PLAYBOOK — Restaurant & Food. This is a food business (restaurant, cafe, bakery, bar, food truck, or catering). Beyond the standard sections, include: a real MENU section organized by category with dish names, short descriptions and prices; an HOURS & LOCATION section with the address and an obvious map area; a reservations or online-order call-to-action; and an appetizing PHOTO GALLERY of signature dishes and the space. The form should support reservations: name, phone, date, time, and party size. Use warm, sensory, appetizing copy. Tone: inviting and flavorful.' }
  ];
  for (let i=0;i<niches.length;i++){ for (let j=0;j<niches[i].k.length;j++){ if (p.indexOf(niches[i].k[j]) > -1) return '\n\n' + niches[i].block; } }
  return '';
}

async function doGenerate(request, env) {
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set in Cloudflare environment variables.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  const prompt = (body.prompt || '').trim();
  if (!prompt) return fail('Prompt is required');
  try {
    const body2 = JSON.stringify({
      contents: [{ parts: [{ text: PROMPT + '\n\nUser request: ' + prompt + getNicheDirection(prompt) + '\n\nSTYLE DIRECTION: ' + getStyleDirection(prompt) + '\n\n' + DESIGN_AMBITION + '\n\nCRITICAL RULES:\n1. CONTRAST IS THE #1 PRIORITY: every text element must be instantly readable against the EXACT background behind it — dark text only on light backgrounds, white/near-white text only on dark backgrounds, never dark-on-dark or light-on-light. If the hero background is dark or uses a photo/image slot, the hero headline and subtext MUST be white/near-white. A dark headline on a dark hero is a failure.\n2. Do NOT use vh or viewport-height units for section/hero HEIGHTS — size heights with px or % (e.g. min-height:640px), required for correct rendering. You SHOULD use clamp() with vw for responsive FONT-SIZE so large headings shrink on small screens and never overflow (e.g. font-size:clamp(2rem,6vw,4.5rem)).\n3. Scroll-reveal and entrance animations are ENCOURAGED, but every element MUST animate from hidden TO fully visible — nothing stays hidden. Keep transitions under 0.8s.\n4. ALWAYS end with </body></html> — never leave HTML incomplete.\n5. COMPLETION IS MANDATORY: always finish the entire page through </body></html>. Keep total output under ~800 lines; if the page is getting long, make each section more concise rather than leaving the page unfinished — a complete simpler page always beats a truncated elaborate one. 6. NO horizontal overflow: set box-sizing:border-box globally, never let any element be wider than the viewport, and the page must NEVER scroll sideways; headings and long text must wrap (overflow-wrap:break-word) and must never use white-space:nowrap on multi-word text. 7. SPACING: the nav logo must never touch the menu links, and text must never touch the screen edges — use container padding/margins and clear gaps between elements.' }] }],
      generationConfig: { maxOutputTokens: 32768, temperature: 0.95, thinkingConfig: { thinkingBudget: 8192 } }
    });
    const result = await callGemini(keys, body2);
    if (result.error) return fail(result.error);
    const generatedHtml = cleanHTML(result.data);
    let finalHtml = generatedHtml.includes('</html>') ? generatedHtml : generatedHtml + '\n</body>\n</html>';
    finalHtml = withReveal(finalHtml);
    finalHtml = withFix(finalHtml);
    const siteId = 'ws' + Math.random().toString(36).slice(2,9);
    finalHtml = withForms(finalHtml, siteId);
    const formKey = await siteKey(siteId, env);
    return succeed({ html: finalHtml, siteId: siteId, formKey: formKey, inboxUrl: 'https://websprout.app/inbox?site=' + siteId + '&key=' + formKey });
  } catch(e) { return fail(e.message); }
}

async function doChat(request, env) {
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  if (!body.message) return fail('Missing message');

  const CHAT_PROMPT = `You are the AI assistant inside Websprout, an AI website builder. Answer the user's exact question directly and specifically.

About Websprout: Users describe a business, AI builds a complete 4-page website in ~20 seconds. Chat to make edits for free. Pro is $10/month and unlocks downloading the source code and deploying across all your sites (cancel anytime). Deploy free on Netlify or Cloudflare Pages.

The user's current site: ` + (body.context||'No site generated yet') + `

Rules:
- Read the question carefully and answer EXACTLY what they asked
- Give specific, expert answers (hex codes for colors, specific font names, concrete steps)
- Use context about their site when relevant
- NEVER say generic things like "Working on that!" or "Great question!" -- just answer
- 1-3 sentences usually, more only if genuinely needed
- Casual, friendly, expert tone`;

  try {
    const cbody = JSON.stringify({
      contents: [{ parts: [{ text: CHAT_PROMPT + '\n\nUser: ' + body.message.trim() }] }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
    });
    const result = await callGemini(keys, cbody);
    if (result.error) return fail(result.error);
    let text = '';
    try { text = result.data.candidates[0].content.parts[0].text; } catch(e) {}
    if (!text || text.length < 5) text = 'Something went wrong. Try asking again!';
    return succeed({ reply: text.trim() });
  } catch(e) { return fail(e.message); }
}

async function doModify(request, env) {
  const keys = geminiKeys(env);
  if (!keys.length) return fail('GEMINI_API_KEY not set.');
  let body;
  try { body = await request.json(); } catch { return fail('Invalid request'); }
  if (!body.html || !body.instruction) return fail('Missing html or instruction');
  try {
    const mbody = JSON.stringify({
      contents: [{ parts: [{ text: MODIFY + '\n\nCurrent HTML:\n' + body.html + '\n\nInstruction: ' + body.instruction.trim() }] }],
      generationConfig: { maxOutputTokens: 32768, temperature: 0.5, thinkingConfig: { thinkingBudget: 0 } }
    });
    const result = await callGemini(keys, mbody);
    if (result.error) return fail(result.error);
    const cleaned = cleanHTML(result.data);
    // Safety check: if result is way shorter than input, Gemini truncated — reject it
    const minExpected = Math.min(body.html.length * 0.6, 5000);
    if (cleaned.length < minExpected) {
      return fail('Edit produced incomplete output — please try again with a simpler instruction.');
    }
    const mSite = (body.html.match(/name="ws-site" content="([^"]+)"/) || [])[1] || ('ws' + Math.random().toString(36).slice(2,9));
    return succeed({ html: withForms(withFix(withReveal(cleaned)), mSite), message: 'Done! Your site has been updated.' });
  } catch(e) { return fail(e.message); }
}

function cleanHTML(apiResponse) {
  let raw = '';
  try {
    const parts = apiResponse.candidates[0].content.parts || [];
    raw = parts.filter(function(p){ return p && typeof p.text === 'string' && !p.thought; }).map(function(p){ return p.text; }).join('');
    if (!raw) throw new Error('empty');
  } catch(e) {
    return '<html><body style="font-family:sans-serif;padding:2rem"><h2>Generation failed</h2></body></html>';
  }
  // Strip markdown fences
  raw = raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = raw.indexOf('<!DOCTYPE');
  raw = (start >= 0 ? raw.slice(start) : raw).trim();

  // Animations (opacity:0 / visibility:hidden entrances) are now ALLOWED — the
  // _wsReveal safety-net guarantees content ends up visible. We only neutralize the
  // catastrophic cases that would hide the WHOLE page with no element-level recovery.
  raw = raw.split('body{display:none').join('body{display:block');
  raw = raw.split('body { display: none').join('body { display: block');
  raw = raw.split('html{display:none').join('html{display:block');
  raw = raw.split('html { display: none').join('html { display: block');
  raw = raw.split('body{opacity:0').join('body{opacity:1');
  raw = raw.split('body { opacity: 0').join('body { opacity: 1');
  raw = raw.split('html{opacity:0').join('html{opacity:1');

  // Fix truncated HTML
  if (!raw.includes('</html>')) {
    raw = raw.includes('</body>') ? raw + '</html>' : raw + '</body></html>';
  }

  // Convert vh units to px — the live-preview iframe is auto-sized to content
  // height, so vh creates a sizing feedback loop. px keeps heroes/sections stable.
  raw = raw.split('100vh').join('760px');
  raw = raw.split('95vh').join('720px');
  raw = raw.split('90vh').join('700px');
  raw = raw.split('85vh').join('660px');
  raw = raw.split('80vh').join('620px');
  raw = raw.split('70vh').join('540px');
  raw = raw.split('60vh').join('460px');
  raw = raw.split('50vh').join('400px');

  return raw;
}



