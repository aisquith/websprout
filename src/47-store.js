function priceToCents(v){
  if (v == null) return 0;
  // The first number after a currency sign ("2 for $10" -> 10), else the first number ("$15 - $25" -> 15).
  var _s = String(v).replace(/(\d),(?=\d{3}\b)/g, '$1');
  var _c = _s.match(/[$£€]\s*(\d+(?:\.\d{1,2})?)/);
  var m = _c ? [_c[1]] : _s.match(/\d+(?:\.\d{1,2})?/);
  if (!m) return 0;
  var n = parseFloat(m[0]);
  if (!isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
async function doCheckout(request, env){
  var url = new URL(request.url);
  var siteId = (url.searchParams.get('site') || '').trim();
  var pIdx = parseInt(url.searchParams.get('p') || '-1', 10);
  function back(slug){ return slug ? ('https://' + slug + '.websprout.app/') : 'https://websprout.app/'; }
  function errPage(msg, slug){
    var b = back(slug);
    var h = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Checkout</title>'
      + '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:460px;margin:80px auto;padding:0 22px;text-align:center;color:#1a1a1a">'
      + '<div style="font-size:2rem;margin-bottom:8px">\ud83d\uded2</div>'
      + '<h2 style="margin:0 0 10px;font-size:1.3rem">Checkout unavailable</h2>'
      + '<p style="opacity:.65;line-height:1.6">' + msg + '</p>'
      + '<p style="margin-top:24px"><a href="' + b + '" style="color:#2e7d32;font-weight:600;text-decoration:none">Back to the shop</a></p></div>';
    return new Response(h, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  if (!env.KV) return errPage('Storage is not configured.', '');
  if (!siteId || pIdx < 0) return errPage('This product link is incomplete.', '');
  var sk = (env.STRIPE_SECRET_KEY || '').trim();
  if (!sk) return errPage('Payments are not configured yet.', '');
  var slug = ''; try { slug = (await env.KV.get('slugof:' + siteId)) || ''; } catch(e){}
  var products = []; try { var raw = await env.KV.get('products:' + siteId); if (raw) products = JSON.parse(raw); } catch(e){}
  if (!Array.isArray(products) || pIdx >= products.length) return errPage('That product is no longer available.', slug);
  var product = products[pIdx];
  if (!product || !product.name) return errPage('That product is no longer available.', slug);
  var owner = ''; try { owner = ((await env.KV.get('notify:' + siteId)) || '').toLowerCase(); } catch(e){}
  if (!owner) return errPage('This store is not set up to take payments yet.', slug);
  var u = null; try { u = JSON.parse(await env.KV.get('user:' + owner) || 'null'); } catch(e){}
  var isPlatformOwner = owner === SUPPORT_EMAIL.toLowerCase();
  var isPro = isPlatformOwner || (u && u.plan === 'pro');
  if (!isPro) return errPage('This store is not currently accepting online payments.', slug);
  var stripeAccount = '';
  if (!isPlatformOwner) {
    if (!(u && u.stripeConnect && u.stripeConnectReady)) return errPage('This store has not finished connecting its payment account.', slug);
    stripeAccount = u.stripeConnect;
  }
  var amount = priceToCents(product.price);
  if (!amount || amount < 50) return errPage('This product is not priced for online checkout.', slug);
  var appFee = 0;
  if (stripeAccount) { appFee = Math.round(amount * 0.02); if (appFee > amount - 1) appFee = amount - 1; if (appFee < 0) appFee = 0; }
  var currency = 'usd';
  var origin = slug ? ('https://' + slug + '.websprout.app') : 'https://websprout.app';
  var successUrl = origin + '/?ws_paid=1';
  var cancelUrl = origin + '/';
  var enc = encodeURIComponent;
  var sHeaders = { 'Authorization': 'Bearer ' + sk, 'Content-Type': 'application/x-www-form-urlencoded' };
  if (stripeAccount) sHeaders['Stripe-Account'] = stripeAccount;
  var bodyStr = 'mode=payment'
    + '&success_url=' + enc(successUrl)
    + '&cancel_url=' + enc(cancelUrl)
    + '&line_items[0][quantity]=1'
    + '&line_items[0][price_data][currency]=' + enc(currency)
    + '&line_items[0][price_data][unit_amount]=' + amount
    + '&line_items[0][price_data][product_data][name]=' + enc(String(product.name).slice(0, 120));
  if (product.desc) bodyStr += '&line_items[0][price_data][product_data][description]=' + enc(String(product.desc).slice(0, 200));
  if (appFee > 0) bodyStr += '&payment_intent_data[application_fee_amount]=' + appFee;
  try {
    var r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: sHeaders, body: bodyStr });
    var j = await r.json();
    if (!r.ok || j.error || !j.url) return errPage('We could not start checkout. Please try again in a moment.', slug);
    return new Response(null, { status: 302, headers: { 'Location': j.url } });
  } catch(e) { return errPage('We could not start checkout. Please try again in a moment.', slug); }
}
function cartInjection(products, siteId, preview){
  function _cl(x){ return String(x||'').split('<').join('').split('>').join(''); }
  var pdata = products.map(function(p){ return { n:_cl(p.name), pr:_cl(p.price), im:_cl(p.img) }; });
  var dataJson = JSON.stringify(pdata);
  return `
<script>
(function(){
  try{
    var SITE=${JSON.stringify(siteId)};
    var P=${dataJson};
    var PREVIEW=${preview?'true':'false'}; var KEY="wscart_"+SITE;
    function gv(){ try{ return JSON.parse(localStorage.getItem(KEY)||"{}")||{}; }catch(e){ return {}; } }
    function sv(c){ try{ localStorage.setItem(KEY,JSON.stringify(c)); }catch(e){} render(); }
    function cents(s){ var t=String(s).replace(/(\\d),(?=\\d{3}\\b)/g,"$1"); var c=t.match(/[$£€]\\s*(\\d+(?:\\.\\d{1,2})?)/); var m=c?[c[1]]:t.match(/\\d+(?:\\.\\d{1,2})?/); var n=m?parseFloat(m[0]):0; return (isFinite(n)&&n>0)?Math.round(n*100):0; }
    function money(c){ return "$"+(c/100).toFixed(2); }
    function esc(s){ return String(s).replace(/[<>&"']/g,function(ch){ return ch==="<"?"&lt;":ch===">"?"&gt;":ch==="&"?"&amp;":ch==='"'?"&quot;":"&#39;"; }); }
    var btn,ov,panel,itemsEl,totEl,ctEl;
    function count(c){ var n=0; for(var k in c){ n+=c[k]; } return n; }
    function open(){ if(ov){ ov.style.display="block"; render(); } }
    function close(){ if(ov){ ov.style.display="none"; } }
    function render(){
      if(!itemsEl) return;
      var c=gv(); var n=count(c);
      if(ctEl) ctEl.textContent=n;
      if(btn) btn.style.display=n>0?"inline-flex":"none";
      var html="", total=0, any=false;
      for(var k in c){
        var i=parseInt(k,10); var q=c[k]; if(!P[i]||q<1) continue; any=true;
        total+=cents(P[i].pr)*q;
        html+="<div style='display:flex;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--wsc-line)'>";
        html+=(P[i].im?("<img src='"+esc(P[i].im)+"' style='width:46px;height:46px;object-fit:cover;border-radius:8px;flex-shrink:0'>"):"");
        html+="<div style='flex:1;min-width:0'><div style='font-weight:600;color:var(--wsc-fg)'>"+esc(P[i].n)+"</div><div style='color:var(--wsc-sub);font-size:12px'>"+esc(P[i].pr)+"</div></div>";
        html+="<div style='display:flex;align-items:center;gap:6px'><button type='button' data-d='"+i+"' style='width:26px;height:26px;border:1px solid var(--wsc-line);background:transparent;color:var(--wsc-fg);border-radius:6px;cursor:pointer;font-size:15px'>-</button><span style='min-width:18px;text-align:center;color:var(--wsc-fg)'>"+q+"</span><button type='button' data-a='"+i+"' style='width:26px;height:26px;border:1px solid var(--wsc-line);background:transparent;color:var(--wsc-fg);border-radius:6px;cursor:pointer;font-size:15px'>+</button></div>";
        html+="</div>";
      }
      itemsEl.innerHTML=any?html:"<div style='color:var(--wsc-sub);text-align:center;padding:56px 20px'><div style='font-size:34px;margin-bottom:10px'>🛒</div><div style='font-weight:600;color:var(--wsc-sub)'>Your cart is empty</div></div>";
      if(totEl) totEl.textContent=money(total);
      var bs=itemsEl.querySelectorAll("button");
      for(var b=0;b<bs.length;b++){ bs[b].onclick=function(){ var a=this.getAttribute("data-a"), d=this.getAttribute("data-d"); var cc=gv(); if(a!==null){ cc[a]=(cc[a]||0)+1; } else if(d!==null){ cc[d]=(cc[d]||0)-1; if(cc[d]<1){ delete cc[d]; } } sv(cc); }; }
    }
    function checkout(){ if(PREVIEW){ alert("Publish your site to accept payments. Checkout is disabled in preview."); return; }
      var c=gv(); var items=[]; for(var k in c){ if(c[k]>0){ items.push({p:parseInt(k,10),qty:c[k]}); } }
      if(!items.length) return;
      var co=document.getElementById("wsCartCo"); if(co){ co.disabled=true; co.textContent="Starting checkout..."; }
      fetch("/cart-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:SITE,items:items})}).then(function(r){ return r.json(); }).then(function(j){
        if(j&&j.url){ location.href=j.url; } else { if(co){ co.disabled=false; co.textContent="Checkout"; } alert((j&&j.error)||"Could not start checkout. Please try again."); }
      }).catch(function(){ if(co){ co.disabled=false; co.textContent="Checkout"; } alert("Could not start checkout. Please try again."); });
    }
    function build(){
      if(document.getElementById("wsCartBtn")) return; function _prgb(c){c=c||"";var i=c.indexOf("(");if(i<0)return null;var j=c.indexOf(")");var a=c.slice(i+1,j).split(",");var o=[];for(var k=0;k<a.length;k++)o.push(parseFloat(a[k]));return o.length>=3?o:null;} function _lum(pp){if(!pp)return -1;if(pp.length>3&&pp[3]<0.05)return -1;function ch(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*ch(pp[0])+0.7152*ch(pp[1])+0.0722*ch(pp[2]);} function _themeDark(){var el=document.body;while(el){var st=getComputedStyle(el);var pc=_prgb(st.backgroundColor);if(pc&&(pc.length<4||pc[3]>0.5)){return _lum(pc)<0.42;}var bi=st.backgroundImage||"";if(bi.indexOf("gradient")>-1){var qq=bi.indexOf("rgb");if(qq>-1){var ee=bi.indexOf(")",qq);var gp=_prgb(bi.slice(qq,ee+1));if(gp)return _lum(gp)<0.42;}}if(el===document.documentElement)break;el=el.parentElement;}return false;} var DARK=_themeDark(); var VARS=DARK?"--wsc-fg:#fff;--wsc-sub:rgba(255,255,255,.55);--wsc-line:rgba(255,255,255,.12);--wsc-foot:rgba(255,255,255,.04);--wsc-btn:#fff;--wsc-btnfg:#111;":"--wsc-fg:#111;--wsc-sub:#999;--wsc-line:#efefef;--wsc-foot:#fafafa;--wsc-btn:#111;--wsc-btnfg:#fff;"; var CBG=DARK?"#1a1a1e":"#ffffff"; var CSH=DARK?"0 24px 70px rgba(0,0,0,.6)":"0 24px 70px rgba(0,0,0,.22)";
      btn=document.createElement("div"); btn.id="wsCartBtn";
      btn.style.cssText="position:fixed;right:18px;bottom:18px;z-index:2147483000;background:"+(DARK?"#fff":"#111")+";color:"+(DARK?"#111":"#fff")+";border-radius:100px;padding:13px 20px;font:700 15px system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3);cursor:pointer;display:none;align-items:center;gap:8px";
      btn.innerHTML="🛒 Cart (<span id='wsCartCt'>0</span>)";
      btn.onclick=open; document.body.appendChild(btn);
      ov=document.createElement("div"); ov.id="wsCartOv";
      ov.style.cssText="position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.15);display:none";
      ov.onclick=function(e){ if(e.target===ov){ close(); } };
      panel=document.createElement("div");
      panel.style.cssText="position:absolute;right:18px;bottom:88px;width:360px;max-width:calc(100vw - 36px);max-height:72vh;"+VARS+"background:"+CBG+";color:var(--wsc-fg);border:1px solid var(--wsc-line);border-radius:18px;box-shadow:"+CSH+";display:flex;flex-direction:column;overflow:hidden;font:14px system-ui,-apple-system,sans-serif";
      panel.innerHTML="<div style='padding:20px;border-bottom:1px solid var(--wsc-line);display:flex;justify-content:space-between;align-items:center'><b style='font-size:17px;font-weight:800;letter-spacing:-.02em'>Your Cart</b><span id='wsCartX' style='cursor:pointer;font-size:24px;line-height:1;color:var(--wsc-sub);padding:0 4px'>×</span></div><div id='wsCartItems' style='flex:1;overflow:auto;padding:8px 20px'></div><div style='padding:20px;border-top:1px solid var(--wsc-line);background:var(--wsc-foot)'><div style='display:flex;justify-content:space-between;font-weight:800;font-size:17px;margin-bottom:14px'><span>Total</span><span id='wsCartTot'>$0.00</span></div><button type='button' id='wsCartCo' style='width:100%;background:var(--wsc-btn);color:var(--wsc-btnfg);border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer'>Checkout →</button><div style='text-align:center;font-size:11px;color:var(--wsc-sub);margin-top:10px'>Secure checkout · powered by Stripe</div></div>";
      ov.appendChild(panel); document.body.appendChild(ov);
      itemsEl=document.getElementById("wsCartItems"); totEl=document.getElementById("wsCartTot"); ctEl=document.getElementById("wsCartCt");
      var x=document.getElementById("wsCartX"); if(x){ x.onclick=close; }
      var co=document.getElementById("wsCartCo"); if(co){ co.onclick=checkout; }
      render();
    }
    window.wsAddToCart=function(i){ if(!ov){ build(); } var c=gv(); c[i]=(c[i]||0)+1; sv(c); open(); };
    if(document.readyState!=="loading"){ build(); } else { document.addEventListener("DOMContentLoaded",build); }
  }catch(e){}
})();
</script>`;
}
async function doCartCheckout(request, env){
  try{
    if(!env.KV) return fail('Storage not configured');
    var b = await request.json();
    var siteId = (b.site||'').trim();
    var items = Array.isArray(b.items) ? b.items : [];
    if(!siteId || !items.length) return fail('Your cart is empty');
    var sk = (env.STRIPE_SECRET_KEY||'').trim();
    if(!sk) return fail('Payments are not configured yet');
    var products = [];
    try{ var raw = await env.KV.get('products:'+siteId); if(raw){ products = JSON.parse(raw); } }catch(e){}
    if(!products.length){ try{ var raw3 = await env.KV.get('v3products:'+siteId); if(raw3){ products = JSON.parse(raw3); } }catch(e){} }
    if(!products.length) return fail('This store has no products');
    var owner = '';
    try{ owner = ((await env.KV.get('notify:'+siteId))||'').toLowerCase(); }catch(e){}
    if(!owner) return fail('This store is not set up to take payments yet');
    var u = null;
    try{ u = JSON.parse(await env.KV.get('user:'+owner)||'null'); }catch(e){}
    var isPlatformOwner = owner === SUPPORT_EMAIL.toLowerCase();
    var isPro = isPlatformOwner || (u && u.plan==='pro');
    if(!isPro) return fail('This store is not currently accepting online payments');
    var stripeAccount = '';
    if(!isPlatformOwner){
      if(!(u && u.stripeConnect && u.stripeConnectReady)) return fail('This store has not finished connecting its payment account');
      stripeAccount = u.stripeConnect;
    }
    var lines = []; var total = 0;
    for(var i=0;i<items.length;i++){
      var idx = parseInt(items[i].p,10);
      // Structured shops send the product name; look it up in the stored list (prices always come from the server).
      if(isNaN(idx) && items[i].n){ var nm=String(items[i].n); for(var pi=0;pi<products.length;pi++){ if(products[pi] && String(products[pi].name)===nm){ idx=pi; break; } } }
      var qty = parseInt(items[i].qty,10)||1; if(qty<1){ qty=1; } if(qty>99){ qty=99; }
      if(isNaN(idx)||idx<0||idx>=products.length) continue;
      var prod = products[idx]; if(!prod) continue;
      var amount = priceToCents(prod.price);
      if(!amount || amount<50) continue;
      total += amount*qty;
      lines.push({ name:String(prod.name||'Item').slice(0,120), amount:amount, qty:qty, desc:prod.desc?String(prod.desc).slice(0,200):'' });
    }
    if(!lines.length || total<50) return fail('Nothing in your cart can be purchased online');
    var appFee = 0;
    if(stripeAccount){ appFee = Math.round(total*0.02); if(appFee>total-1){ appFee=total-1; } if(appFee<0){ appFee=0; } }
    var slug = '';
    try{ slug = (await env.KV.get('slugof:'+siteId))||''; }catch(e){}
    var origin = slug ? ('https://'+slug+'.websprout.app') : 'https://websprout.app';
    var enc = encodeURIComponent;
    var sHeaders = { 'Authorization':'Bearer '+sk, 'Content-Type':'application/x-www-form-urlencoded' };
    if(stripeAccount){ sHeaders['Stripe-Account'] = stripeAccount; }
    var body = 'mode=payment&success_url='+enc(origin+'/?ws_paid=1')+'&cancel_url='+enc(origin+'/');
    for(var li=0;li<lines.length;li++){
      body += '&line_items['+li+'][quantity]='+lines[li].qty;
      body += '&line_items['+li+'][price_data][currency]=usd';
      body += '&line_items['+li+'][price_data][unit_amount]='+lines[li].amount;
      body += '&line_items['+li+'][price_data][product_data][name]='+enc(lines[li].name);
      if(lines[li].desc){ body += '&line_items['+li+'][price_data][product_data][description]='+enc(lines[li].desc); }
    }
    if(appFee>0){ body += '&payment_intent_data[application_fee_amount]='+appFee; }
    var r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method:'POST', headers:sHeaders, body:body });
    var j = await r.json();
    if(!r.ok || j.error || !j.url) return fail('We could not start checkout. Please try again.');
    return succeed({ url:j.url });
  }catch(e){ return fail(e.message); }
}
function renderProductGrid(products, siteId, checkoutEnabled){
  if (!Array.isArray(products) || !products.length) return '<div style="text-align:center;opacity:.6;padding:40px 0;font-size:1rem">Products coming soon.</div>';
  var esc = function(x){ return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var cards = products.map(function(p, i){
    var img = p.img ? ('<div class="wsp-img" style="background-image:url(' + esc(p.img) + ')"></div>') : '<div class="wsp-img wsp-noimg"></div>';
    var price = p.price ? ('<div class="wsp-price">' + esc(p.price) + '</div>') : '';
    var desc = p.desc ? ('<div class="wsp-desc">' + esc(p.desc) + '</div>') : '';
    var buy;
    if (p.payUrl && /^https:\/\//i.test(p.payUrl)) buy = '<a class="wsp-buy" href="' + esc(p.payUrl) + '" target="_blank" rel="noopener">Buy now</a>';
    else if (checkoutEnabled && siteId) buy = '<button class="wsp-buy" type="button" onclick="wsAddToCart(' + i + ')">Add to cart</button>';
    else buy = '<a class="wsp-buy" href="#contact">Inquire</a>';
    return '<div class="wsp-card" data-category="' + esc(p.category||'') + '">' + img + '<div class="wsp-body"><div class="wsp-name">' + esc(p.name||'Product') + '</div>' + price + desc + buy + '</div></div>';
  }).join('');
  var css = '<style>.wsp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;max-width:1100px;margin:0 auto;padding:8px 0}.wsp-card{border:1px solid rgba(128,128,128,.18);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;background:rgba(128,128,128,.04)}.wsp-img{aspect-ratio:4/3;background-size:cover;background-position:center}.wsp-noimg{background:linear-gradient(135deg,rgba(128,128,128,.12),rgba(128,128,128,.05))}.wsp-body{padding:16px;display:flex;flex-direction:column;gap:6px}.wsp-name{font-weight:700;font-size:1.05rem}.wsp-price{font-weight:700;opacity:.85}.wsp-desc{font-size:.9rem;opacity:.7;line-height:1.5}.wsp-buy{margin-top:8px;display:inline-block;text-align:center;padding:10px 16px;border:1px solid currentColor;border-radius:10px;text-decoration:none;color:inherit;font-weight:600}.wsp-buy:hover{opacity:.8}.wsp-tabs{position:relative;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:1100px;margin:0 auto 26px;padding-bottom:12px}.wsp-tab{background:none;border:none;font:inherit;font-weight:700;font-size:.9rem;letter-spacing:.03em;text-transform:uppercase;color:inherit;opacity:.45;cursor:pointer;padding:6px 14px;transition:opacity .2s}.wsp-tab.wsp-tab-on{opacity:1}.wsp-tab-ind{position:absolute;bottom:0;height:2px;background:currentColor;border-radius:2px;transition:left .28s ease,width .28s ease;left:0;width:0}</style>';
  var _cats=[]; products.forEach(function(pp){ var cc=String(pp.category||'').trim(); if(cc && _cats.indexOf(cc)<0) _cats.push(cc); }); var _tabs=''; if(_cats.length>=2){ _tabs='<div class="wsp-tabs"><button type="button" class="wsp-tab wsp-tab-on" data-cat="">All</button>'; _cats.forEach(function(cc){ _tabs+='<button type="button" class="wsp-tab" data-cat="'+esc(cc)+'">'+esc(cc)+'</button>'; }); _tabs+='<span class="wsp-tab-ind"></span></div>'; } return css + _tabs + '<div class="wsp-grid">' + cards + '</div>';
}
async function doProducts(request, env){
  try {
    if (!env.KV) return fail('Storage not configured');
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const siteId = url.searchParams.get('siteId') || '';
      const key = url.searchParams.get('key') || '';
      if (!siteId || key !== (await siteKey(siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
      let products = [];
      try { const raw = await env.KV.get('products:' + siteId); if (raw) products = JSON.parse(raw); } catch(e){}
      return succeed({ ok:true, products: products });
    }
    const b = await request.json();
    if (!b.siteId || !b.key) return fail('Missing data');
    if (b.key !== (await siteKey(b.siteId, env))) return new Response(JSON.stringify({ error:'Invalid key' }), { status:403, headers:{'Content-Type':'application/json'} });
    let _pro = false;
    try { const _s = await getSession(request, env); if (_s){ const _u = JSON.parse((await env.KV.get('user:'+(_s.email||'').toLowerCase()))||'{}'); _pro = !!(_u && _u.plan==='pro') || ((_s.email||'').toLowerCase()===SUPPORT_EMAIL.toLowerCase()); } } catch(e){}
    if (!_pro) return fail('PRO_REQUIRED');
    let products = Array.isArray(b.products) ? b.products.slice(0,200) : [];
    products = products.map(function(p){ var pu=String(p.payUrl||'').trim().slice(0,600); if(!/^https:\/\//i.test(pu)) pu=''; return { name:String(p.name||'').slice(0,140), price:String(p.price||'').slice(0,40), img:String(p.img||'').slice(0,600), desc:String(p.desc||'').slice(0,500), payUrl:pu, category:String(p.category||'').slice(0,40) }; }).filter(function(p){ return p.name; });
    await env.KV.put('products:' + b.siteId, JSON.stringify(products));
    return succeed({ ok:true, products: products });
  } catch(e){ return fail(e.message); }
}
async function doStorePreview(request, env){
  try {
    if (!env.KV) return new Response("", {status:200, headers:{"Content-Type":"text/html"}});
    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId") || "";
    const key = url.searchParams.get("key") || "";
    if (!siteId || key !== (await siteKey(siteId, env))) return new Response("", {status:403});
    let products = [];
    try { const raw = await env.KV.get("products:" + siteId); if (raw) products = JSON.parse(raw); } catch(e){}
    const cart = (products && products.length) ? cartInjection(products, siteId, true) : "";
    return new Response(cart, {status:200, headers:{"Content-Type":"text/html; charset=utf-8"}});
  } catch(e){ return new Response("", {status:200, headers:{"Content-Type":"text/html"}}); }
}