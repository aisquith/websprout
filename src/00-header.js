// WEBSPROUT — Cloudflare Worker
// Env variables: GEMINI_API_KEY (required), GEMINI_API_KEY2 (optional fallback), RESEND_API_KEY, KV

// $10/mo unlimited subscription — create a RECURRING ($10/month) Payment Link in your
// Stripe dashboard and paste its URL here. Set its success URL to https://websprout.app/?sub=success
const SUB_LINK = 'https://buy.stripe.com/00w00kgq56Bd1ds2Wy6Na00';
// Support inbox — SERVER-SIDE ONLY. Never interpolated into PAGE, so it never appears in page source.
const SUPPORT_EMAIL = 'michael.aisquith@gmail.com';
const SUPPORT_INBOX = 'support@websprout.app';
