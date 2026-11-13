// ===== v3 browser engine (served to the studio for live structured editing) =====
const WS_ENGINE_B64 = '__WS_ENGINE_B64__';
let _wsEngineJs = null;
function wsEngineJs(){ if (_wsEngineJs) return _wsEngineJs; try { const bin = atob(WS_ENGINE_B64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); _wsEngineJs = new TextDecoder('utf-8').decode(bytes); } catch (e) { _wsEngineJs = '/* ws engine decode error */'; } return _wsEngineJs; }



// Reveal safety-net: ships inside every generated site (preview AND download).
// Preserves the site's own CSS animations — it watches elements with an
// IntersectionObserver and only force-reveals one if it is STILL hidden ~1.7s after
// scrolling into view (rescuing a broken or absent observer), so scroll-reveal and
// entrance animations play normally while a stuck animation can never leave a blank
// page. Skips positioned overlays (modals, menus, dropdowns) so hidden UI keeps working.