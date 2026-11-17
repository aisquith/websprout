// Automatic support replies: the support form and inbound email (Email Routing) both forward to a person and send
// the sender one instant reply. The AI answer is used only when it passes the checks; money, bugs and account
// questions get the plain acknowledgment; robots, lists and our own mail never get a reply.
// The support source runs in Node with a stand-in fetch and KV (the test server can't reach Gemini or Resend).
const fs = require('fs');
const path = require('path');

const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
function kv() { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); }, delete: async (k) => { m.delete(k); } }; }

module.exports = async function (ctx, t) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', '52-support.js'), 'utf8');
  const make = (gemini) => {
    const sent = [], calls = [];
    const fetchStub = async (u, o) => {
      calls.push(String(u));
      if (String(u).indexOf('generativelanguage') > -1) {
        const r = typeof gemini === 'function' ? gemini(JSON.parse(o.body)) : gemini;
        if (r instanceof Response) return r;
        return json({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] });
      }
      return json({}, 404);
    };
    const L = new Function('fetch', 'SUPPORT_INBOX', 'SUPPORT_EMAIL', 'geminiKeys', 'wsMailCapOk', 'wsSendMail', 'wsMailCount',
      src + ';return { wsSupportReplyOk, wsSupportAi, wsSupportAutoReply, wsParseInbound, wsInboundIsAuto, wsSupportAddrOk, wsHandleEmail, wsStripQuoted, wsDecodeWords };')(
      fetchStub, 'support@websprout.app', 'owner@example.com', (env) => (env.GEMINI_API_KEY ? [env.GEMINI_API_KEY] : []), async () => true,
      async (env, msg) => { sent.push(msg); return true; }, async () => {});
    return { L, sent, calls };
  };
  const env = () => ({ GEMINI_API_KEY: 'K', KV: kv() });

  // Reply checks
  const { L } = make({});
  t.ok(L.wsSupportReplyOk('Pro is $10 per month and starts with a 7-day free trial. You can cancel anytime from Settings.'), 'a factual answer passes');
  t.ok(!L.wsSupportReplyOk('Pro is $5 per month for you.'), 'a made-up price is rejected');
  t.ok(!L.wsSupportReplyOk('I have refunded your last payment, it will show in a few days.'), 'a promise of a refund is rejected');
  t.ok(!L.wsSupportReplyOk('Go to https://evil.example/login and enter your details there.'), 'an outside link is rejected');
  t.ok(L.wsSupportReplyOk('You can start at https://websprout.app and click Plant my website to begin.'), 'a websprout.app link is allowed');
  t.ok(!L.wsSupportReplyOk('Email billing@other.com for that, they will help.'), 'an email address is rejected');
  t.ok(!L.wsSupportReplyOk('Your domain will be ready in 30 days, guaranteed.'), 'an invented timeline is rejected');
  t.ok(!L.wsSupportReplyOk('<b>Hi</b> there, here is the answer to your question.'), 'markup is rejected');

  // AI answer path
  let k = make({ answerable: true, reply: 'Yes. With Pro you can connect your own domain from the editor\'s domain settings, and HTTPS is set up for you.' });
  let e = env();
  let r = await k.L.wsSupportAutoReply(e, { to: 'Pat@Example.com', name: 'Pat Smith', subject: 'Domain question', message: 'Can I use my own domain name with my site?' });
  t.ok(r.sent && r.answer, 'an answerable question gets an AI answer');
  t.eq(k.sent[0].to[0], 'pat@example.com', 'sent to the sender');
  t.ok(/Hi Pat,/.test(k.sent[0].html) && /own domain/.test(k.sent[0].html) && /written by AI/.test(k.sent[0].html), 'greets by first name, includes the answer and says it is AI-written');
  t.eq(k.sent[0].subject, 'Re: Domain question', 'subject threads with theirs');
  t.eq(k.sent[0].headers['Auto-Submitted'], 'auto-replied', 'marked as an auto-reply (prevents loops)');
  t.eq(k.sent[0].reply_to, 'support@websprout.app', 'replies go to support');
  r = await k.L.wsSupportAutoReply(e, { to: 'pat@example.com', name: 'Pat', subject: '', message: 'Another question about my domain please' });
  t.ok(!r.sent && r.skip === 'recent', 'one auto-reply per sender per 12 hours');

  // Human-only topics: no AI call
  k = make({ answerable: true, reply: 'should not be used at all here' });
  r = await k.L.wsSupportAutoReply(env(), { to: 'a@b.co', name: '', subject: '', message: 'I was charged twice this month and want a refund' });
  t.ok(r.sent && !r.answer && r.skip === 'human', 'billing questions get only the acknowledgment');
  t.ok(!k.calls.some((u) => u.indexOf('generativelanguage') > -1), 'and Gemini is not called for them');
  t.ok(/Hi,/.test(k.sent[0].html) && /a person will read it/i.test(k.sent[0].html), 'acknowledgment says a person will reply');

  // Unanswerable, rejected, failing AI -> acknowledgment
  k = make({ answerable: false, reply: '' });
  r = await k.L.wsSupportAutoReply(env(), { to: 'c@d.co', message: 'Do you integrate with my point of sale system?' });
  t.ok(r.sent && !r.answer, 'questions outside the facts get the acknowledgment');
  k = make({ answerable: true, reply: 'Sure, it is $3 a month for you.' });
  r = await k.L.wsSupportAutoReply(env(), { to: 'c@d.co', message: 'How much does Pro cost for a small shop?' });
  t.ok(r.sent && !r.answer && r.skip === 'rejected', 'a bad AI answer is dropped, the acknowledgment still goes');
  k = make(new Response('busy', { status: 500 }));
  r = await k.L.wsSupportAutoReply(env(), { to: 'c@d.co', message: 'How do I change the colors on my site?' });
  t.ok(r.sent && !r.answer, 'Gemini errors fall back to the acknowledgment');
  const capped = env(); capped.SUPPORT_AI_MONTHLY_CAP = '0';
  k = make({ answerable: true, reply: 'Click any color swatch in the editor to change it.' });
  r = await k.L.wsSupportAutoReply(capped, { to: 'c@d.co', message: 'How do I change the colors on my site?' });
  t.ok(r.sent && r.skip === 'cap', 'the monthly AI cap is respected');

  // Addresses that never get a reply
  ['noreply@shop.com', 'mailer-daemon@mx.google.com', 'hello@websprout.app', 'x@abc.websprout.app', 'not-an-email'].forEach((a) => t.ok(!L.wsSupportAddrOk(a), 'no reply to ' + a));
  t.ok(L.wsSupportAddrOk('jane.doe+site@gmail.com'), 'normal addresses are fine');

  // Inbound email parsing
  const raw = [
    'From: =?UTF-8?Q?Jos=C3=A9_P=C3=A9rez?= <jose@example.org>',
    'Subject: =?UTF-8?B?' + Buffer.from('Pregunta sobre el dominio').toString('base64') + '?=',
    'Message-ID: <abc123@mail.example.org>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="BND"',
    '',
    '--BND',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    '=C2=BFPuedo usar mi propio dominio?',
    '',
    'On Mon, Nov 10, 2026 at 9:00 AM Websprout <hello@websprout.app> wrote:',
    '> earlier text',
    '--BND',
    'Content-Type: text/html; charset=UTF-8',
    '',
    '<p>html version</p>',
    '--BND--',
    '',
  ].join('\r\n');
  const m = L.wsParseInbound(raw);
  t.eq(m.from.addr, 'jose@example.org', 'sender address parsed');
  t.eq(m.from.name, 'José Pérez', 'encoded sender name decoded');
  t.eq(m.subject, 'Pregunta sobre el dominio', 'encoded subject decoded');
  t.eq(m.text, '¿Puedo usar mi propio dominio?', 'plain text part decoded, quoted reply dropped');
  t.eq(m.messageId, '<abc123@mail.example.org>', 'message id kept for threading');
  const htmlOnly = L.wsParseInbound('From: a@b.co\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n' + Buffer.from('<div>Hello &amp; thanks<br>How do I publish?</div>').toString('base64'));
  t.ok(/Hello & thanks\s*\nHow do I publish\?/.test(htmlOnly.text), 'an HTML-only base64 email becomes text');
  t.ok(L.wsInboundIsAuto({ 'auto-submitted': 'auto-replied' }) && L.wsInboundIsAuto({ precedence: 'bulk' }) && L.wsInboundIsAuto({ 'list-unsubscribe': '<x>' }), 'auto-replies, bulk mail and newsletters are recognised');
  t.ok(!L.wsInboundIsAuto({ 'auto-submitted': 'no' }) && !L.wsInboundIsAuto({}), 'a normal email is not');

  // The email handler: always forwards, then replies (and never to an auto-reply)
  const msgOf = (rawText) => {
    const bytes = new TextEncoder().encode(rawText);
    const fwd = [];
    return { fwd, m: { from: 'bounce@x.org', to: 'support@websprout.app', rawSize: bytes.length, raw: new Blob([bytes]).stream(), forward: async (a) => { fwd.push(a); } } };
  };
  k = make({ answerable: true, reply: 'Yes, with Pro you can connect your own domain from the editor.' });
  let em = msgOf(raw);
  await k.L.wsHandleEmail(em.m, env());
  t.eq(em.fwd[0], 'owner@example.com', 'inbound email is forwarded to a person');
  t.ok(k.sent.length === 1 && k.sent[0].to[0] === 'jose@example.org' && k.sent[0].headers['In-Reply-To'] === '<abc123@mail.example.org>', 'and the sender gets a threaded reply');
  k = make({ answerable: true, reply: 'unused reply text that is long enough' });
  em = msgOf('From: someone@shop.com\r\nAuto-Submitted: auto-replied\r\nSubject: Out of office\r\n\r\nI am away.');
  await k.L.wsHandleEmail(em.m, env());
  t.ok(em.fwd.length === 1 && k.sent.length === 0, 'an out-of-office reply is forwarded but never answered');
  const off = env(); off.SUPPORT_EMAIL_AUTOREPLY = 'off';
  k = make({}); em = msgOf(raw);
  await k.L.wsHandleEmail(em.m, off);
  t.ok(em.fwd.length === 1 && k.sent.length === 0, 'SUPPORT_EMAIL_AUTOREPLY=off forwards only');

  // Live worker: the support form still succeeds (the reply goes out in the background).
  const res = await fetch(ctx.base + '/support', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ctx.base }, body: JSON.stringify({ email: 'tester@example.com', name: 'Tess', message: 'How do I add a page to my site?' }) });
  const body = await res.json().catch(() => ({}));
  t.ok(res.status === 200 || /not configured/i.test(body.error || ''), 'support form responds (' + res.status + ')');
};
