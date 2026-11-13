function sanitizeGenerated(html){
  try{
    const ids = new Set();
    const idRe = /\sid\s*=\s*["']([^"']+)["']/gi;
    let mm;
    while((mm = idRe.exec(html))){ ids.add(mm[1].trim().toLowerCase()); }
    function pick(cands){
      for(const c of cands){ if(ids.has(c)) return c; }
      for(const id of ids){ for(const c of cands){ if(id.indexOf(c) > -1) return id; } }
      return null;
    }
    const target = pick(['contact','quote','book','booking','order','reserve','cta','getstarted','signup']);
    if(!target) return html;
    html = html.replace(/<a\b([^>]*?)\shref\s*=\s*"([^"]*)"([^>]*)>/gi, function(full, pre, href, post){
      const attrs = pre + ' ' + post;
      const h = (href||'').trim();
      if(/^(https?:|mailto:|tel:|javascript:|\/\/)/i.test(h)) return full;       // external / protocol
      if(h.charAt(0) === '[') return full;                                        // [Your Booking Link] etc.
      if(/data-ws-field\s*=\s*["']brand["']/i.test(attrs)) return full;           // logo/brand
      if(/class\s*=\s*["'][^"']*(logo|brand)/i.test(attrs)) return full;
      let dead = false;
      if(h === '' || h === '#') dead = true;
      else if(h.charAt(0) === '#'){ if(!ids.has(h.slice(1).toLowerCase())) dead = true; }
      return dead ? ('<a' + pre + ' href="#' + target + '"' + post + '>') : full;
    });
  }catch(e){}
  return html;
}

// Guarantee mobile baseline: a viewport tag (without it phones render the desktop layout zoomed out)
// plus a minimal, non-destructive safety stylesheet so nothing overflows sideways on a phone.
// Deterministic post-generation cleanup for issues prompts keep missing:
// (1) collapse a nav that ended up with the same CTA twice down to one, and
// (2) strip empty trailing elements that leave a gap at the bottom.
// Guarantee a branded favicon (the little tab icon). If the model didn't include one,
// inject a clean monogram of the brand's initial in a colour derived from the brand name.
function ensureFavicon(html){
  try{
    if(/<link[^>]+rel=["'][^"']*icon/i.test(html)) return html;
    let brand='';
    let m = html.match(/data-ws-field=["']brand["'][^>]*>([^<]{1,40})</i);
    if(m) brand = m[1];
    if(!brand){ const t = html.match(/<title>([^<]{1,60})<\/title>/i); if(t) brand = t[1].split('|')[0].split(' - ')[0]; }
    brand = (brand||'W').trim();
    const letter = ((brand.replace(/[^A-Za-z0-9]/g,'').charAt(0))||'W').toUpperCase();
    let h=0; for(let i=0;i<brand.length;i++){ h=(h*31 + brand.charCodeAt(i))>>>0; }
    const bg = 'hsl('+(h % 360)+',62%,46%)';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="'+bg+'"/><text x="32" y="45" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#ffffff" text-anchor="middle">'+letter+'</text></svg>';
    const link = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+encodeURIComponent(svg)+'">';
    if(/<\/head>/i.test(html)) return html.replace(/<\/head>/i, link+'</head>');
    if(/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, mm=>mm+link);
    return link+html;
  }catch(e){ return html; }
}

function tidyGenerated(html){
  try{ html = dedupeNavCta(html); html = stripTrailingEmpty(html); }catch(e){}
  return html;
}
function dedupeNavCta(html){
  let open = html.search(/<nav\b/i), tag='nav';
  if(open<0){ open = html.search(/<header\b/i); tag='header'; }
  if(open<0) return html;
  const closeStr='</'+tag+'>';
  const rel = html.slice(open).search(new RegExp(closeStr,'i'));
  if(rel<0) return html;
  const closeEnd = open + rel + closeStr.length;
  const navBlock = html.slice(open, closeEnd);
  const anchors = navBlock.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  if(anchors.length < 2) return html;
  const txt = a => a.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  const counts = {};
  anchors.forEach(a=>{ const t=txt(a); if(t&&t.length<30) counts[t]=(counts[t]||0)+1; });
  let newNav = navBlock;
  Object.keys(counts).forEach(t=>{
    if(counts[t]>1){
      const matching = anchors.filter(a=>txt(a)===t);
      for(let i=0;i<matching.length-1;i++){
        const idx = newNav.indexOf(matching[i]);
        if(idx>-1) newNav = newNav.slice(0,idx) + newNav.slice(idx+matching[i].length);
      }
    }
  });
  if(newNav===navBlock) return html;
  return html.slice(0,open) + newNav + html.slice(closeEnd);
}
function stripTrailingEmpty(html){
  let prev;
  do{ prev = html; html = html.replace(/<(div|section|span|p)\b[^>]*>\s*<\/\1>\s*(?=<\/body>)/i, ''); }while(html!==prev);
  return html;
}

function ensureMobile(html){
  try{
    if(!/<meta[^>]+name=["']viewport["']/i.test(html)){
      const vp = '<meta name="viewport" content="width=device-width, initial-scale=1">';
      if(/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, function(m){ return m + vp; });
      else if(/<html[^>]*>/i.test(html)) html = html.replace(/<html[^>]*>/i, function(m){ return m + '<head>' + vp + '</head>'; });
      else html = vp + html;
    }
    if(html.indexOf('ws-mobile-safety') === -1){
      const css = '<style id="ws-mobile-safety">html,body{margin:0}body>*:last-child{margin-bottom:0}img,svg,video{max-width:100%}@media(max-width:600px){html,body{overflow-x:hidden;max-width:100vw}img,svg,video{height:auto}table,pre,code{max-width:100%;overflow-x:auto}}</style>';
      if(/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, css + '</head>');
      else html = css + html;
    }
  }catch(e){}
  return html;
}

// Repair invalid CSS the model sometimes emits (SASS/LESS funcs + hex-in-rgba),
// which silently break whole declarations (e.g. buttons lose their background).
function wsFixCss(h){
  try{
    // darken()/lighten()/mix()/saturate() as 2-arg preprocessor calls are NOT valid CSS -> use the base color
    h=h.replace(/\b(?:darken|lighten|saturate|desaturate|mix)\s*\(\s*([^,()]+(?:\([^()]*\))?[^,()]*)\s*,[^)]*\)/g,"$1");
    // rgba(var(--hexvar), a) is invalid -> convert the hex to real rgba channels
    var _m2={},_re2=/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*[;}]/g,_mm;
    while((_mm=_re2.exec(h))){_m2[_mm[1]]=_mm[2];}
    h=h.replace(/rgba?\(\s*var\(\s*--([\w-]+)\s*\)\s*,\s*([0-9.]+)\s*\)/g,function(_f,_n,_a){
      var _hx=_m2[_n];if(!_hx)return _f;
      var _c=_hx.replace("#","");if(_c.length===3)_c=_c[0]+_c[0]+_c[1]+_c[1]+_c[2]+_c[2];
      var _r=parseInt(_c.slice(0,2),16),_g=parseInt(_c.slice(2,4),16),_b=parseInt(_c.slice(4,6),16);
      if(_r!==_r||_g!==_g||_b!==_b)return _f;
      return "rgba("+_r+","+_g+","+_b+","+_a+")";});
  }catch(e){}
  return h;
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



