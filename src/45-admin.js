const ADMIN_PANEL = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Websprout Admin</title>
<style>
:root{--bg:#050a07;--side:#070e0a;--card:#0c1510;--card2:#0a120d;--raise:#121f17;--line:rgba(74,222,128,.18);--soft:rgba(255,255,255,.07);--hair:rgba(255,255,255,.12);--tx:#eaf2e8;--mut:rgba(234,242,232,.74);--dim:rgba(234,242,232,.6);--ac:#4ade80;--ac2:#34d399;--cy:#22d3ee;--warn:#fca5a5;--info:#8fd8ff;--focus:#ffd166;--r:14px;--edge:linear-gradient(155deg,rgba(74,222,128,.3),rgba(255,255,255,.07) 32%,rgba(255,255,255,.05) 68%,rgba(34,211,238,.2))}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg)}
body{background:radial-gradient(900px 520px at 88% -8%,rgba(34,211,238,.07),transparent 62%),radial-gradient(820px 520px at 18% -6%,rgba(74,222,128,.09),transparent 62%),var(--bg);background-attachment:fixed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:var(--tx);font-size:14px;line-height:1.5}
a{color:var(--ac);text-decoration:none}a:hover{text-decoration:underline}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px;border-radius:6px}
button{font-family:inherit;color:inherit}
kbd{font-family:inherit;font-size:11px;font-weight:700;color:var(--mut);border:1px solid var(--hair);border-bottom-width:2px;border-radius:5px;padding:1px 5px;background:rgba(255,255,255,.04);white-space:nowrap}
.ic{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.skip{position:absolute;left:-999px;top:8px;background:var(--ac);color:#04210f;font-weight:700;padding:8px 12px;border-radius:8px;z-index:100}.skip:focus{left:8px}
.app{display:grid;grid-template-columns:232px 1fr;min-height:100vh}
.side{background:linear-gradient(180deg,rgba(74,222,128,.05),transparent 240px),var(--side);border-right:1px solid var(--soft);padding:18px 12px;position:sticky;top:0;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
.brand{font-weight:800;font-size:16.5px;padding:2px 8px 18px;display:flex;align-items:center;gap:10px;letter-spacing:-.2px}
.brand .logo{width:30px;height:30px;border-radius:9px;background:linear-gradient(140deg,#4ade80,#22d3ee);display:grid;place-items:center;color:#04210f;box-shadow:0 0 0 1px rgba(255,255,255,.14) inset,0 8px 22px -8px rgba(74,222,128,.7)}
.brand .logo .ic{stroke-width:2.2}
.brand small{display:block;font-weight:650;font-size:11px;color:var(--dim);letter-spacing:.6px;text-transform:uppercase;margin-top:-2px}
.side nav{display:grid;gap:2px}
.side nav button{position:relative;display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:0;color:var(--mut);padding:10px 12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s,color .15s}
.side nav button:hover{background:var(--soft);color:var(--tx)}
.side nav button[aria-current="page"]{background:linear-gradient(90deg,rgba(74,222,128,.2),rgba(74,222,128,.05));color:#fff;box-shadow:inset 0 0 0 1px rgba(74,222,128,.2)}
.side nav button[aria-current="page"]::before{content:"";position:absolute;left:-12px;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0;background:var(--ac);box-shadow:0 0 12px var(--ac)}
.side nav button[aria-current="page"] .ic{color:var(--ac)}
.side nav .cnt{margin-left:auto;background:#c9372c;color:#fff;font-size:11px;font-weight:700;border-radius:999px;padding:1px 7px;font-variant-numeric:tabular-nums}
.side .foot{margin-top:auto;padding:14px 10px 0;border-top:1px solid var(--soft);font-size:12.5px;color:var(--dim);display:grid;gap:8px}
.side .foot a{padding:2px 0}
.sideScrim{display:none}
.main{min-width:0}
.head{position:sticky;top:0;z-index:30;background:rgba(5,10,7,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--soft);padding:12px 24px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.head h1{font-size:19px;font-weight:800;flex:1;min-width:110px;letter-spacing:-.3px}
.menuBtn{display:none;background:none;border:1px solid var(--hair);border-radius:10px;padding:8px;cursor:pointer;line-height:0}
.cmdBtn{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.04);border:1px solid var(--hair);border-radius:10px;padding:7px 9px 7px 11px;font-size:13px;color:var(--mut);cursor:pointer;min-width:250px;transition:border-color .15s,background .15s}
.cmdBtn span{flex:1;text-align:left}
.cmdBtn:hover{border-color:rgba(74,222,128,.5);background:rgba(255,255,255,.06);color:var(--tx)}
.seg{display:inline-flex;border:1px solid var(--hair);border-radius:10px;padding:2px;gap:2px;background:rgba(255,255,255,.03)}
.seg button{background:none;border:0;color:var(--mut);padding:6px 11px;font-size:13px;font-weight:700;cursor:pointer;min-width:44px;border-radius:8px}
.seg button:hover{color:var(--tx)}
.seg button[aria-pressed="true"]{background:var(--ac);color:#04210f}
.upd{font-size:12px;color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
.btn{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--tx);cursor:pointer;border:1px solid var(--hair);border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.03);white-space:nowrap;text-decoration:none;transition:background .15s,border-color .15s}
.btn:hover{background:var(--soft);border-color:rgba(255,255,255,.24);text-decoration:none}
.btn[disabled]{opacity:.6;cursor:default}
.btn.sm{padding:5px 10px;font-size:12.5px;border-radius:8px}
.btn.sm[aria-pressed="true"]{border-color:rgba(74,222,128,.55);color:var(--ac)}
.btn.pri{background:var(--ac);border-color:transparent;color:#04210f;font-weight:700}.btn.pri:hover{background:#6ee79a}
.btn.dng{border-color:rgba(252,165,165,.45);color:var(--warn)}.btn.dng:hover{background:rgba(201,55,44,.18)}
.rf[aria-busy="true"] .ic{animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.lnk{background:none;border:0;color:var(--ac);font-size:12.5px;font-weight:700;cursor:pointer;padding:5px 2px;min-height:24px}.lnk:hover{text-decoration:underline}
.content{padding:20px 24px 80px;max-width:1380px}
.pg[hidden]{display:none}
.lead{color:var(--mut);margin:-4px 0 16px;font-size:13.5px}
h2{font-size:15px;font-weight:750;margin:24px 0 10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;letter-spacing:-.1px}
h2:first-child{margin-top:0}
h2 .sp{margin-left:auto}
.help{font-size:12.5px;color:var(--dim);font-weight:400}
.card,.kpi,.tw,.pulse{border:1px solid transparent;border-radius:var(--r);background:linear-gradient(var(--card),var(--card)) padding-box,var(--edge) border-box;box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 14px 34px -22px rgba(0,0,0,.9)}
.card{padding:16px 18px}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.kpi,.pulse{position:relative;padding:14px 16px 12px;min-width:0;transition:transform .18s,box-shadow .18s}
.kpi:hover{transform:translateY(-2px);box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 18px 36px -20px rgba(74,222,128,.35)}
.kpi.hero{background:radial-gradient(260px 120px at 100% 0,rgba(74,222,128,.13),transparent 70%) padding-box,linear-gradient(var(--card),var(--card)) padding-box,var(--edge) border-box}
.kpi .l,.pulse .l{font-size:12.5px;color:var(--mut);font-weight:650;display:flex;align-items:center;gap:6px;min-height:24px}
.kpi .l>span:first-child{flex:1;min-width:0}
.kpi .i{flex-shrink:0;width:24px;height:24px;border-radius:50%;border:1px solid var(--hair);background:none;color:var(--dim);font-size:11.5px;font-weight:800;font-style:italic;font-family:Georgia,serif;cursor:help;line-height:1;margin:0 -4px 0 0}
.kpi .i:hover,.kpi .i:focus-visible{color:var(--tx);border-color:var(--ac)}
.kpi .x{position:absolute;left:10px;right:10px;top:42px;z-index:5;background:var(--raise);border:1px solid var(--hair);border-radius:10px;padding:9px 11px;font-size:12.5px;font-weight:400;color:var(--tx);line-height:1.4;box-shadow:0 14px 30px -10px rgba(0,0,0,.8);opacity:0;visibility:hidden;transform:translateY(-3px);transition:opacity .12s,transform .12s,visibility .12s;pointer-events:none}
.kpi .i:hover+.x,.kpi .i:focus+.x{opacity:1;visibility:visible;transform:none}
.kpi .n{font-size:28px;font-weight:800;margin-top:2px;letter-spacing:-.6px;line-height:1.2;font-variant-numeric:tabular-nums}
.kpi .d{font-size:12.5px;font-variant-numeric:tabular-nums}
.kpi svg.spk{display:block;width:100%;height:32px;margin-top:8px}
.pulse .live{width:8px;height:8px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 0 rgba(74,222,128,.6);animation:live 2s infinite}
@keyframes live{70%{box-shadow:0 0 0 7px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
.pulse table{font-size:12.5px;margin-top:6px}
.pulse th{font-size:10.5px;padding:0 0 4px;border:0;text-align:right}
.pulse td{padding:5px 0;border:0;border-top:1px solid var(--soft);text-align:right;font-variant-numeric:tabular-nums;color:var(--mut)}
.pulse td:first-child,.pulse th:first-child{text-align:left}
.pulse td.t{color:var(--tx);font-weight:800;font-size:15px}
.pulse tbody tr:hover td{background:none}
.up{color:var(--ac)}.down{color:var(--warn)}.flat{color:var(--dim)}
.ovGrid{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:16px;margin-top:24px;align-items:start}
.att{list-style:none;display:grid;gap:8px}
.att li{display:flex;gap:10px;align-items:flex-start;background:var(--card);border:1px solid var(--soft);border-left:3px solid var(--info);border-radius:10px;padding:10px 12px;font-size:13.5px;flex-wrap:wrap}
.att li>span:not(.tag){flex:1;min-width:150px}
.att li.warn{border-left-color:var(--warn)}.att li.good{border-left-color:var(--ac)}
.tag{flex-shrink:0;font-size:10.5px;font-weight:800;letter-spacing:.5px;border-radius:999px;padding:3px 9px;margin-top:1px}
.tag.warn{background:rgba(252,165,165,.16);color:var(--warn)}.tag.good{background:rgba(74,222,128,.15);color:var(--ac)}.tag.info{background:rgba(143,216,255,.13);color:var(--info)}
.att .go{margin-left:auto;flex-shrink:0;font-size:12.5px;background:none;border:0;color:var(--ac);cursor:pointer;font-weight:700;min-height:24px;padding:2px 0}
.conv{display:flex;align-items:stretch;gap:0}
.conv .cs{flex:1;min-width:0;background:var(--card2);border:1px solid var(--soft);border-radius:12px;padding:12px 14px}
.conv .cs span{display:block;font-size:12.5px;color:var(--mut);font-weight:650}
.conv .cs b{display:block;font-size:24px;font-weight:800;letter-spacing:-.5px;font-variant-numeric:tabular-nums;line-height:1.25}
.conv .cs em{font-style:normal;font-size:12px;color:var(--dim);font-variant-numeric:tabular-nums}
.conv .cx{flex:0 0 132px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:12px;position:relative;padding:0 6px}
.conv .cx::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(74,222,128,.5),transparent);z-index:0}
.conv .cx b{position:relative;z-index:1;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:13px;font-variant-numeric:tabular-nums}
.conv .cx span{position:relative;z-index:1;background:var(--card);padding:0 4px;margin-top:3px;font-variant-numeric:tabular-nums}
.conv .cx small{position:relative;z-index:1;color:var(--dim);background:var(--card);padding:0 4px;font-size:11.5px;margin-bottom:3px}
.rank{list-style:none;display:grid;gap:12px}
.rank .rk{display:flex;justify-content:space-between;gap:10px;font-size:13.5px;margin-bottom:5px}
.rank .rn{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.rank .rv{flex-shrink:0;color:var(--dim);font-size:12.5px;font-variant-numeric:tabular-nums}.rank .rv b{color:var(--tx);font-size:13.5px}
.rank .rb{background:var(--soft);height:8px;border-radius:4px;overflow:hidden}
.rank .rb i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#1fa968,#4ade80)}
.fun{display:grid;gap:8px}.fstep{display:grid;grid-template-columns:minmax(120px,200px) 1fr minmax(100px,160px);gap:4px 12px;align-items:center}
.fbar{background:var(--soft);border-radius:6px;height:24px;overflow:hidden}
.fbar i{display:block;height:100%;background:linear-gradient(90deg,#1fa968,var(--ac));border-radius:0 4px 4px 0}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center}
select,input[type=search]{background:#0a1210;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:var(--tx);padding:8px 10px;font-size:13.5px;font-family:inherit;max-width:100%}
input[type=search]{flex:1;min-width:180px}
.tabs{display:inline-flex;gap:2px;background:var(--card2);border:1px solid var(--soft);border-radius:9px;padding:2px}
.tabs button{background:none;border:0;color:var(--mut);padding:6px 11px;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer}
.tabs button[aria-selected="true"]{background:rgba(74,222,128,.15);color:var(--ac)}
.tw{overflow-x:auto}
.tw.flat{background:none;border:1px solid var(--soft);box-shadow:none;max-height:320px;overflow-y:auto}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th{text-align:left;color:var(--dim);font-weight:650;padding:0;border-bottom:1px solid rgba(255,255,255,.1);font-size:11.5px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}
th button{all:unset;cursor:pointer;display:block;padding:10px 12px;box-sizing:border-box;width:100%}
th button:focus-visible{outline:2px solid var(--focus);outline-offset:-2px}
th[aria-sort="ascending"] button::after{content:" ▲";color:var(--ac)}th[aria-sort="descending"] button::after{content:" ▼";color:var(--ac)}
th.r,td.r{text-align:right;font-variant-numeric:tabular-nums}
td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:middle}
tbody tr.click{cursor:pointer}
tbody tr:hover td{background:rgba(74,222,128,.06)}
tr.under td:first-child{box-shadow:inset 3px 0 0 var(--warn)}
.empty{padding:26px 16px;text-align:center;color:var(--dim)}
.badge{display:inline-block;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:999px;letter-spacing:.4px}
.badge.pro{background:linear-gradient(135deg,#f5c542,#2d9e4a);color:#06120a}
.badge.free{background:rgba(255,255,255,.12);color:rgba(255,255,255,.8)}
.badge.comp{background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff}
.badge.owner{background:#1f2937;color:#cbd5e1;border:1px solid #475569}
.badge.dev{background:rgba(92,200,255,.16);color:#7fd3ff;border:1px solid rgba(92,200,255,.4);margin-left:5px}
.meter{margin:4px 0 14px}.meter .ml{display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;gap:8px;font-variant-numeric:tabular-nums}
.meter .mb{background:var(--soft);height:9px;border-radius:5px;overflow:hidden}.meter .mb i{display:block;height:100%;background:linear-gradient(90deg,#1fa968,var(--ac));border-radius:5px}
.meter.hot .mb i{background:#e05a4f}
.stat{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13.5px}.stat:last-child{border:0}
.stat b{font-variant-numeric:tabular-nums;text-align:right}.stat small{display:block;color:var(--dim);font-size:11.5px}
.muted{color:var(--dim)}.note{font-size:12.5px;color:var(--mut);margin-top:12px}
.cg td{text-align:center;font-variant-numeric:tabular-nums;font-weight:700}
.sk{display:block;height:14px;border-radius:6px;background:linear-gradient(90deg,rgba(255,255,255,.05),rgba(255,255,255,.11),rgba(255,255,255,.05));background-size:200% 100%;animation:sk 1.2s infinite linear;margin:6px 0}
.sk.big{height:64px;border-radius:12px}.sk.tall{height:250px;border-radius:12px}
@keyframes sk{to{background-position:-200% 0}}
.chart{position:relative}
.chHead{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.chTools{display:flex;gap:6px;margin-left:auto}
.legend{display:flex;gap:6px 8px;font-size:12.5px;color:var(--mut);flex-wrap:wrap}
.legend .lg{display:inline-flex;align-items:center;gap:7px;background:none;border:1px solid var(--soft);border-radius:999px;padding:4px 11px;min-height:28px;font-size:12.5px;color:var(--mut)}
.legend button.lg{cursor:pointer}.legend button.lg:hover{border-color:rgba(255,255,255,.3);color:var(--tx)}
.legend .lg i{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.legend .lg b{color:var(--tx);font-variant-numeric:tabular-nums}
.legend .lg[aria-pressed="false"]{opacity:.62;text-decoration:line-through}.legend .lg[aria-pressed="false"] i{background:transparent!important;box-shadow:inset 0 0 0 1.5px var(--dim)}
.plot{position:relative;border-radius:8px;touch-action:pan-y}
.plot svg{display:block;width:100%;height:auto;overflow:visible}
.plot text{font-variant-numeric:tabular-nums}
.tip{position:absolute;top:6px;z-index:4;background:var(--raise);border:1px solid var(--hair);border-radius:10px;padding:8px 11px;font-size:12.5px;min-width:150px;pointer-events:none;box-shadow:0 14px 30px -10px rgba(0,0,0,.85)}
.tip[hidden]{display:none}
.tip .td{font-weight:700;margin-bottom:4px}
.tip .tr{display:flex;align-items:center;gap:7px;color:var(--mut);padding:1px 0}.tip .tr i{width:9px;height:9px;border-radius:3px;flex-shrink:0}.tip .tr b{margin-left:auto;padding-left:14px;color:var(--tx);font-variant-numeric:tabular-nums}
.drawer{position:fixed;inset:0;z-index:60;display:none}
.drawer.on{display:block}
.scrim{position:absolute;inset:0;background:rgba(2,6,3,.7);backdrop-filter:blur(2px)}
.drawer .panel{position:absolute;top:0;right:0;bottom:0;width:min(520px,100%);background:#0a130e;border-left:1px solid var(--line);overflow-y:auto;padding:18px 20px 40px;box-shadow:-20px 0 40px rgba(0,0,0,.5)}
.drawer .dh{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px}
.drawer .dh h3{font-size:17px;font-weight:800;flex:1;word-break:break-all}
.drawer .x{background:none;border:1px solid rgba(255,255,255,.2);border-radius:9px;padding:6px 10px;cursor:pointer;font-size:14px}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 4px}
.tl{list-style:none;border-left:2px solid var(--soft);margin:8px 0 0 6px;padding-left:14px;display:grid;gap:10px}
.tl li{font-size:13px;position:relative}.tl li::before{content:"";position:absolute;left:-20px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--ac2)}
.tl .t{color:var(--dim);font-size:12px}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:11px 18px;border-radius:10px;font-weight:700;font-size:13.5px;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:calc(100% - 32px)}
.toast.ok{background:#1f7a3c;color:#fff}.toast.bad{background:#c9372c;color:#fff}
.cmdk{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-start;justify-content:center;padding:12vh 16px 16px}
.cmdk[hidden]{display:none}
.cmdp{position:relative;width:min(620px,100%);max-height:min(560px,76vh);display:flex;flex-direction:column;border:1px solid transparent;border-radius:16px;background:linear-gradient(var(--raise),var(--raise)) padding-box,linear-gradient(155deg,rgba(74,222,128,.6),rgba(255,255,255,.12) 40%,rgba(34,211,238,.45)) border-box;box-shadow:0 30px 80px -20px rgba(0,0,0,.9),0 0 60px -30px rgba(74,222,128,.6);overflow:hidden}
.cmdi{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--soft);color:var(--mut)}
.cmdi input{flex:1;min-width:0;background:none;border:0;color:var(--tx);font-size:16px;font-family:inherit;outline:none}
.cmdi input::placeholder{color:var(--dim)}
.cmdi:focus-within{box-shadow:inset 0 -2px 0 var(--ac)}
#cmdList{list-style:none;overflow-y:auto;padding:6px;flex:1}
#cmdList .cmdh{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--dim);padding:10px 10px 4px}
#cmdList [role=option]{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:9px;cursor:pointer;color:var(--mut);min-height:40px}
#cmdList [role=option] .ct{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--tx);font-weight:600}
#cmdList [role=option] .csub{color:var(--dim);font-size:12.5px;flex-shrink:0;max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#cmdList [role=option][aria-selected="true"]{background:rgba(74,222,128,.14);box-shadow:inset 0 0 0 1px rgba(74,222,128,.3)}
#cmdList [role=option][aria-selected="true"] .ic{color:var(--ac)}
#cmdList .cmde{padding:26px 12px;text-align:center;color:var(--dim)}
.cmdf{display:flex;gap:16px;flex-wrap:wrap;padding:9px 14px;border-top:1px solid var(--soft);font-size:12px;color:var(--dim)}
.nodb .ndb{display:none}
@media (prefers-reduced-motion:no-preference){
 .pg:not([hidden])>*{animation:rise .32s cubic-bezier(.2,.7,.2,1) backwards}
 .pg:not([hidden])>*:nth-child(2){animation-delay:.03s}.pg:not([hidden])>*:nth-child(3){animation-delay:.06s}.pg:not([hidden])>*:nth-child(4){animation-delay:.09s}.pg:not([hidden])>*:nth-child(n+5){animation-delay:.12s}
 .cmdp{animation:pop .16s cubic-bezier(.2,.7,.2,1) both}
 .ln{stroke-dasharray:1;stroke-dashoffset:1;animation:draw .7s ease-out forwards}
}
@keyframes rise{from{opacity:0;transform:translateY(8px)}}
@keyframes pop{from{opacity:0;transform:translateY(-8px) scale(.985)}}
@keyframes draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.sk,.pulse .live,.rf[aria-busy="true"] .ic{animation:none}.kpi,.kpi:hover{transition:none;transform:none}.kpi .x{transition:none}}
@media (max-width:1180px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ovGrid{grid-template-columns:1fr}.cmdBtn{min-width:0}.cmdBtn span{display:none}}
@media (max-width:899px){
 .app{grid-template-columns:1fr}
 .side{position:fixed;left:0;top:0;bottom:0;width:260px;z-index:70;transform:translateX(-100%);transition:transform .2s;box-shadow:20px 0 40px rgba(0,0,0,.5)}
 .side.open{transform:none}
 .side.open+.sideScrim{display:block;position:fixed;inset:0;z-index:65;background:rgba(2,6,3,.6)}
 .menuBtn{display:inline-block}
 .head{padding:10px 16px}.content{padding:16px 16px 80px}
 .head .rf span,.cmdBtn kbd{display:none}
 .head .rf,.cmdBtn{padding:8px}
}
@media (max-width:640px){.fstep{grid-template-columns:1fr auto}.fstep .fbar{grid-column:1 / -1;order:3}.kpis{gap:10px}.kpi,.pulse{padding:12px 12px 10px}.kpi .n{font-size:23px}.grid2{grid-template-columns:1fr}.head h1{font-size:17px;min-width:0}.head .seg{order:5;flex:1 0 100%}.head .seg button{flex:1;padding:7px 4px;white-space:nowrap}.pulse{grid-column:1 / -1}.head .upd{order:6}
 .conv{flex-direction:column}.conv .cx{flex:0 0 auto;flex-direction:row;gap:8px;padding:8px 0}.conv .cx::before{left:50%;right:auto;top:0;bottom:0;width:1px;height:auto;background:linear-gradient(180deg,transparent,rgba(74,222,128,.5),transparent)}.conv .cx span,.conv .cx small{margin:0}
 .cmdk{padding-top:8vh}.cmdf span:last-child{display:none}.h2x .help{flex-basis:100%}}
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 21v-9"/><path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.2-2.5 6.5-7 6.500z"/><path d="M12 15c0-3-2-5-6-5 0 3.2 2 5 6 5z"/></symbol>
<symbol id="i-overview" viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="9" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.8"/><rect x="13.5" y="12" width="7.5" height="9" rx="1.8"/><rect x="3" y="16" width="7.5" height="5" rx="1.8"/></symbol>
<symbol id="i-growth" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></symbol>
<symbol id="i-customers" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.6 3-5.5 6.5-5.500s6 1.9 6.5 5.5"/><path d="M16 4.700a3.5 3.5 0 0 1 0 6.6"/><path d="M18.5 14.800c1.8.8 2.8 2.5 3 5.2"/></symbol>
<symbol id="i-sites" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></symbol>
<symbol id="i-moderation" viewBox="0 0 24 24"><path d="M12 3l7.5 3v5.500c0 4.6-3 8.3-7.5 9.5-4.5-1.2-7.5-4.9-7.5-9.500V6z"/><path d="M9 12l2.2 2.2 3.8-4.2"/></symbol>
<symbol id="i-revenue" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M6.5 15h4"/></symbol>
<symbol id="i-health" viewBox="0 0 24 24"><path d="M3 12h4l2.5-7 4.5 14 2.5-7H21"/></symbol>
<symbol id="i-activity" viewBox="0 0 24 24"><path d="M9 6h12"/><path d="M9 12h12"/><path d="M9 18h12"/><path d="M4 6h.01"/><path d="M4 12h.01"/><path d="M4 18h.01"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></symbol>
<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.5-4L4 8.5"/><path d="M4 4v4.500h4.5"/><path d="M4 13a8 8 0 0 0 14.5 4l1.5-1.5"/><path d="M20 20v-4.500h-4.5"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 3L5 13.500h6L10 21l8-10.500h-6z"/></symbol>
</defs></svg>
<a class="skip" href="#content">Skip to content</a>
<div class="app">
<aside class="side" id="side" aria-label="Admin sections"><div class="brand"><span class="logo"><svg class="ic" aria-hidden="true"><use href="#i-sprout"/></svg></span><span>Websprout<small>Admin</small></span></div>
<nav id="nav">
<button data-p="overview"><svg class="ic" aria-hidden="true"><use href="#i-overview"/></svg>Overview<span class="cnt" id="attCnt" hidden></span></button>
<button data-p="growth"><svg class="ic" aria-hidden="true"><use href="#i-growth"/></svg>Growth</button>
<button data-p="customers"><svg class="ic" aria-hidden="true"><use href="#i-customers"/></svg>Customers</button>
<button data-p="sites"><svg class="ic" aria-hidden="true"><use href="#i-sites"/></svg>Sites</button>
<button data-p="moderation"><svg class="ic" aria-hidden="true"><use href="#i-moderation"/></svg>Moderation<span class="cnt" id="modCnt" hidden></span></button>
<button data-p="revenue"><svg class="ic" aria-hidden="true"><use href="#i-revenue"/></svg>Revenue</button>
<button data-p="health"><svg class="ic" aria-hidden="true"><use href="#i-health"/></svg>Health &amp; costs</button>
<button data-p="activity"><svg class="ic" aria-hidden="true"><use href="#i-activity"/></svg>Activity</button>
</nav>
<div class="foot"><a href="/dev">Developer panel &rarr;</a><a href="/admin/nudge" target="_blank" rel="noopener">Re-engagement emails (preview)</a><span>No cookies or third-party trackers are used for analytics.</span></div></aside><div class="sideScrim" id="sideScrim"></div>
<div class="main">
<header class="head"><button class="menuBtn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="side"><svg class="ic" aria-hidden="true"><use href="#i-menu"/></svg></button><h1 id="pgTitle">Overview</h1>
<button class="cmdBtn" id="cmdBtn" aria-haspopup="dialog" aria-label="Search customers, sites and pages"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg><span>Search or jump to&hellip;</span><kbd id="cmdKey">Ctrl K</kbd></button>
<div class="seg" id="range" role="group" aria-label="Date range"><button data-d="7" aria-pressed="false">7 days</button><button data-d="30" aria-pressed="true">30 days</button><button data-d="90" aria-pressed="false">90 days</button></div>
<span class="upd" id="upd" role="status"></span>
<button class="btn rf" id="refresh" aria-label="Refresh data"><svg class="ic" aria-hidden="true"><use href="#i-refresh"/></svg><span>Refresh</span></button></header>
<main class="content" id="content" tabindex="-1">
<div id="nodb" class="card" hidden style="margin-bottom:16px;border-color:rgba(245,197,66,.4)"></div>

<section class="pg" data-pg="overview" aria-labelledby="pgTitle">
<p class="lead" id="ovLead">How Websprout did in the selected period, compared with the period before.</p>
<div class="kpis ndb" id="kpis"><div class="pulse"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div><div class="kpi"><span class="sk big"></span></div></div>
<div class="ovGrid"><div class="ndb"><h2>Visitors and sites per day</h2><div class="card chart" id="ovChart"><span class="sk tall"></span></div></div>
<div><h2>What needs your attention</h2><ul class="att" id="attList"><li><span class="sk" style="width:70%"></span></li><li><span class="sk" style="width:55%"></span></li></ul><div id="attMore" style="margin-top:6px"></div></div></div>
<h2 class="ndb h2x">From visitor to Pro <span class="help">how many made it through each step, and the change from the period before</span></h2><div class="card ndb" id="convStrip"><span class="sk big"></span></div>
<div class="grid2 ndb" style="margin-top:24px"><div><h2>Top traffic sources <span class="help">by visitors</span><button class="lnk sp" data-go="growth">All sources &rarr;</button></h2><div class="card" id="topSrc"><span class="sk"></span><span class="sk"></span><span class="sk"></span></div></div>
<div><h2>Top business types <span class="help">by sites made</span><button class="lnk sp" data-go="growth">All types &rarr;</button></h2><div class="card" id="topBiz"><span class="sk"></span><span class="sk"></span><span class="sk"></span></div></div></div>
<h2 class="ndb">Good news &amp; notes</h2><ul class="att ndb" id="winList"></ul>
</section>

<section class="pg" data-pg="growth" hidden>
<p class="lead">Where people come from and how far they get, from first visit to paying for Pro.</p>
<h2>Activation funnel <span class="help">each step as a share of the step before</span></h2>
<div class="card"><div class="filters"><label class="help" for="fSrc">Source</label><select id="fSrc"><option value="">All sources</option></select><label class="help" for="fCat">Business category</label><select id="fCat"><option value="">All categories</option></select></div><div class="fun" id="fun"><span class="sk"></span></div><p class="note" id="funNote"></p></div>
<h2>Traffic sources <span class="tabs" role="tablist" id="acqTabs"><button role="tab" data-k="sources" aria-selected="true">Sources</button><button role="tab" data-k="campaigns" aria-selected="false">Campaigns</button><button role="tab" data-k="landings" aria-selected="false">Landing pages</button></span><button class="btn sm sp" data-csv="acqT" data-name="traffic">Export CSV</button></h2>
<p class="help" style="margin:-4px 0 8px">&ldquo;Visit &rarr; site&rdquo; = share of visitors who generated a site. &ldquo;Publish rate&rdquo; = share of generated sites that went live.</p>
<div class="tw" id="acqT"></div>
<h2>Business types <span class="tabs" role="tablist" id="bizTabs"><button role="tab" data-k="categories" aria-selected="true">Categories</button><button role="tab" data-k="types" aria-selected="false">What people typed</button></span> <span class="help" id="bizSub"></span><button class="btn sm sp" data-csv="bizT" data-name="business-types">Export CSV</button></h2>
<div class="tw" id="bizT"></div><p class="note" id="genericNote"></p>
<h2>Do new owners come back? <span class="help">weekly sign-up groups (&ldquo;cohorts&rdquo;): share who signed in, saved or published again</span></h2>
<div class="grid2"><div class="tw" id="cohT"></div><div class="card" id="engage"></div></div>
</section>

<section class="pg" data-pg="customers" hidden>
<p class="lead">Everyone with an account. Click a customer to see their sites, leads and history, and to change their plan or access.</p>
<div class="filters"><input type="search" id="custQ" placeholder="Search by email or name" aria-label="Search customers"><select id="custPlan" aria-label="Filter by plan"><option value="">All plans</option><option value="paid">Paying Pro</option><option value="comp">Comped Pro</option><option value="free">Free</option><option value="risk">Paying but inactive</option></select><button class="btn" data-csv="custT" data-name="customers">Export CSV</button></div>
<div class="tw" id="custT"><div style="padding:12px"><span class="sk"></span><span class="sk"></span><span class="sk"></span></div></div>
</section>

<section class="pg" data-pg="sites" hidden>
<p class="lead">Published websites, their visits and leads. Click a site for details and to feature it on the showcase.</p>
<div class="filters"><input type="search" id="siteQ" placeholder="Search address" aria-label="Search sites"><button class="btn" data-csv="siteT" data-name="sites">Export CSV</button></div>
<div class="tw" id="siteT"></div>
<h2>Custom domains</h2><div class="tw" id="domT"></div>
</section>

<section class="pg" data-pg="moderation" hidden>
<p class="lead">Every publish and share link is checked for obscene, vulgar, NSFW, hateful or scam content before it goes live. Sites that were refused, or went out while the AI check was unavailable, show up here. You can also check every published site at once.</p>
<div class="acts" style="margin-bottom:12px"><button class="btn pri" id="modScan">Check all published sites</button><span class="muted" id="modScanMsg" role="status" style="align-self:center"></span></div>
<p class="muted" id="modAi" hidden></p>
<div class="tw" id="modT"><div style="padding:12px"><span class="sk"></span><span class="sk"></span></div></div>
</section>

<section class="pg" data-pg="revenue" hidden>
<p class="lead">Subscription revenue, store sales on customer sites, and invoices.</p>
<div class="kpis" id="revK"></div>
<h2>Monthly recurring revenue over time <span class="help">from the daily snapshot</span></h2><div class="card chart" id="mrrChart"></div>
<div class="grid2" style="margin-top:16px"><div class="card" id="revPanel"></div><div class="card" id="valPanel"></div></div>
<h2>Invoices <span class="help" id="invSub"></span></h2><div class="tw" id="invT"></div>
<h2>Payments not linked to an account <span class="help">someone paid for Pro but we could not tell which account &mdash; find them in Customers and use Give Pro, or refund in Stripe</span></h2><div class="tw" id="unmT"></div>
</section>

<section class="pg" data-pg="health" hidden>
<p class="lead">Free-plan limits, product quality and errors on customer sites.</p>
<div class="grid2"><div class="card" id="costPanel"></div><div class="card" id="qualPanel"></div></div>
<h2>Errors on sites <span class="help" id="errCount"></span> <button class="btn dng" id="errClear" hidden>Clear all errors</button></h2>
<div class="tw" id="errT"></div>
</section>

<section class="pg" data-pg="activity" hidden>
<p class="lead">Every recorded event, newest first. Visitors are anonymous; signed-in owners show their email.</p>
<div class="filters"><select id="actType" aria-label="Event type"><option value="">All events</option></select><input type="search" id="actSearch" placeholder="Search email, site, source, campaign, country" aria-label="Search activity"><button class="btn" data-csv="actT" data-name="activity">Export CSV</button></div>
<div class="tw" id="actT"></div><div style="text-align:center;margin-top:12px"><button class="btn" id="actMore" hidden>Load older events</button></div>
</section>
</main></div></div>
<div class="drawer" id="drawer" aria-hidden="true"><div class="scrim" data-close="1"></div><div class="panel" role="dialog" aria-modal="true" aria-labelledby="dTitle"><div class="dh"><h3 id="dTitle"></h3><button class="x" data-close="1" aria-label="Close">&#10005;</button></div><div id="dBody"></div></div></div>
<div class="cmdk" id="cmdk" hidden><div class="scrim" data-cmdx="1"></div><div class="cmdp" role="dialog" aria-modal="true" aria-label="Search and jump"><div class="cmdi"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg><input id="cmdIn" type="text" role="combobox" aria-expanded="true" aria-controls="cmdList" aria-autocomplete="list" aria-label="Search customers, sites and pages" placeholder="Search customers, sites, pages&hellip;" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div><ul id="cmdList" role="listbox" aria-label="Results"></ul><div class="cmdf"><span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>G</kbd> then a letter jumps to a page</span></div></div></div>
<script>
var S={days:30,page:'overview',src:'',cat:'',acq:'sources',biz:'categories',A:null,D:null,sort:{},attAll:false,anim:false};
var GK={overview:'o',growth:'g',customers:'c',sites:'s',moderation:'m',revenue:'r',health:'h',activity:'a'};
var RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var TB={},CH={};
var EMPTY='No data yet \u2014 this fills in as people use Websprout.';
var PAGES={overview:'Overview',growth:'Growth',customers:'Customers',sites:'Sites',moderation:'Moderation',revenue:'Revenue',health:'Health & costs',activity:'Activity'};
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '<span class="muted">&mdash;</span>';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function ago(day){if(!day)return '<span class="muted">never</span>';var n=Math.round((Date.now()-Date.parse(day+'T12:00:00Z'))/864e5);return n<=0?'today':n===1?'yesterday':n+' days ago';}
function num(n){return (n==null?0:n).toLocaleString();}
function usd(c){return '$'+((c||0)/100).toFixed(2);}
function pc(v){return v==null?'<span class="muted">&mdash;</span>':(Math.round(v*10)/10)+'%';}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function toast(msg,ok){var n=document.createElement('div');n.className='toast '+(ok===false?'bad':'ok');n.setAttribute('role','status');n.textContent=msg;document.body.appendChild(n);setTimeout(function(){n.remove();},3200);}
function confirmBox(msg,ok,danger){return new Promise(function(res){var b=document.createElement('div');b.setAttribute('role','alertdialog');b.setAttribute('aria-modal','true');b.setAttribute('aria-label','Confirm');b.style.cssText='position:fixed;inset:0;background:rgba(6,13,5,.75);display:flex;align-items:center;justify-content:center;z-index:99;padding:20px';var x=document.createElement('div');x.style.cssText='background:#0f1a0d;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:20px;max-width:400px;width:100%;color:#eaf2e8;font-size:14.5px';var m=document.createElement('p');m.textContent=msg;m.style.marginBottom='16px';var r=document.createElement('div');r.style.cssText='display:flex;gap:8px;justify-content:flex-end';var c=document.createElement('button');c.className='btn';c.textContent='Cancel';var k=document.createElement('button');k.className='btn '+(danger?'dng':'pri');k.textContent=ok||'Confirm';k.id='confirmOk';r.appendChild(c);r.appendChild(k);x.appendChild(m);x.appendChild(r);b.appendChild(x);document.body.appendChild(b);k.focus();var done=function(v){document.removeEventListener('keydown',kd,true);b.remove();res(v);};var kd=function(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();done(false);}};document.addEventListener('keydown',kd,true);c.onclick=function(){done(false);};k.onclick=function(){done(true);};b.onclick=function(e){if(e.target===b)done(false);};});}
/* Sortable, searchable tables. cols: [{k,label,num,fmt(row),sort(row)}] */
function table(id,cols,rows,opt){opt=opt||{};var el=$(id);if(!el)return;var st=S.sort[id]||{k:opt.sortKey||cols[0].k,dir:opt.sortDir||(cols.filter(function(c){return c.k===(opt.sortKey||cols[0].k);})[0]||{}).num?-1:1};S.sort[id]=st;
  var col=cols.filter(function(c){return c.k===st.k;})[0]||cols[0];var val=function(r){var v=col.sort?col.sort(r):r[col.k];return v==null?(col.num?-Infinity:''):v;};
  var rs=rows.slice().sort(function(a,b){var x=val(a),y=val(b);if(typeof x==='string'||typeof y==='string'){x=String(x).toLowerCase();y=String(y).toLowerCase();}return x<y?-st.dir:x>y?st.dir:0;});TB[id]={cols:cols,rows:rs};
  var h='<table'+(opt.cls?' class="'+opt.cls+'"':'')+'><thead><tr>'+cols.map(function(c){var s=c.k===st.k?(st.dir>0?'ascending':'descending'):'none';return '<th'+(c.num?' class="r"':'')+' aria-sort="'+s+'"><button type="button" data-sort="'+c.k+'">'+c.label+'</button></th>';}).join('')+'</tr></thead><tbody>';
  if(!rs.length)h+='<tr><td colspan="'+cols.length+'" class="empty">'+(opt.empty||EMPTY)+'</td></tr>';
  h+=rs.slice(0,opt.limit||500).map(function(r,i){var attrs=opt.rowAttr?opt.rowAttr(r):'';return '<tr'+attrs+'>'+cols.map(function(c){return '<td'+(c.num?' class="r"':'')+'>'+(c.fmt?c.fmt(r):esc(r[c.k]))+'</td>';}).join('')+'</tr>';}).join('');
  el.innerHTML=h+'</tbody></table>';
  el.onclick=function(e){var b=e.target.closest('button[data-sort]');if(b){var k=b.getAttribute('data-sort');var cc=cols.filter(function(c){return c.k===k;})[0];S.sort[id]=st.k===k?{k:k,dir:-st.dir}:{k:k,dir:cc&&cc.num?-1:1};table(id,cols,rows,opt);var nb=el.querySelector('button[data-sort="'+k+'"]');if(nb)nb.focus();return;}var tr=e.target.closest('tr[data-open]');if(tr&&opt.onOpen&&!e.target.closest('a,button'))opt.onOpen(tr.getAttribute('data-open'));};
  el.onkeydown=function(e){var tr=e.target.closest&&e.target.closest('tr[data-open]');if(tr&&(e.key==='Enter'||e.key===' ')&&opt.onOpen){e.preventDefault();opt.onOpen(tr.getAttribute('data-open'));}};}
function spark(vals,color){if(!vals||!vals.length)return '';color=color||'#4ade80';var w=160,h=32,mx=Math.max.apply(null,vals.concat([1])),n=vals.length,pts=vals.map(function(v,i){return [n>1?i*(w-4)/(n-1)+2:w/2,h-3-(v/mx)*(h-8)];});var d=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');var l=pts[pts.length-1];return '<svg class="spk" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><path d="'+d+' L'+l[0].toFixed(1)+' '+h+' L2 '+h+' Z" fill="'+color+'" fill-opacity=".1"/><path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';}
/* Line chart with labeled axes, a legend that shows/hides each line, a hover/keyboard tooltip and a table view.
   series: [{key,label,color,vals}] over days. opt: {fmt, last (legend shows the latest value instead of the total), name} */
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function dLabel(d){return MON[parseInt(d.slice(5,7),10)-1]+' '+parseInt(d.slice(8),10);}
function dLong(d){return DOW[new Date(d+'T12:00:00Z').getUTCDay()]+', '+dLabel(d);}
function lineChart(id,days,series,opt){var st=CH[id]=CH[id]||{hide:{},table:false};st.days=days;st.series=series;st.opt=opt||{};drawChart(id);}
function drawChart(id){var st=CH[id],el=$(id);if(!st||!el||!st.days)return;var days=st.days,all=st.series,opt=st.opt,n=days.length,fmt=opt.fmt||num;
  var on=all.filter(function(s){return !st.hide[s.key];});
  var tot=function(s){return opt.last?(s.vals[n-1]||0):s.vals.reduce(function(a,v){return a+v;},0);};
  var h='<div class="chHead"><div class="legend"'+(all.length>1?' role="group" aria-label="Show or hide lines"':'')+'>'+all.map(function(s){var inner='<i style="background:'+s.color+'"></i>'+esc(s.label)+' <b>'+fmt(tot(s))+'</b>';return all.length>1?'<button type="button" class="lg" data-s="'+s.key+'" aria-pressed="'+(st.hide[s.key]?'false':'true')+'">'+inner+'</button>':'<span class="lg">'+inner+'</span>';}).join('')+'</div><div class="chTools">'+(st.table?'<button type="button" class="btn sm" data-csv="'+id+'Tbl" data-name="'+(opt.name||'daily')+'">Export CSV</button>':'')+'<button type="button" class="btn sm" data-chv="1" aria-pressed="'+(st.table?'true':'false')+'">Table</button></div></div>';
  el.onclick=function(e){var b=e.target.closest('button[data-s]');if(b){var k=b.getAttribute('data-s');if(!st.hide[k]&&on.length<2)return;st.hide[k]=!st.hide[k];drawChart(id);var nb=el.querySelector('button[data-s="'+k+'"]');if(nb)nb.focus();return;}if(e.target.closest('button[data-chv]')){st.table=!st.table;drawChart(id);var tb=el.querySelector('button[data-chv]');if(tb)tb.focus();}};
  if(st.table){el.innerHTML=h+'<div class="tw flat" id="'+id+'Tbl"></div>';st.w=el.clientWidth;table(id+'Tbl',[{k:'day',label:'Day'}].concat(all.map(function(s,j){return {k:'s'+j,label:esc(s.label),num:1,fmt:function(r){return fmt(r['s'+j]);}};})),days.map(function(d,i){var r={day:d};all.forEach(function(s,j){r['s'+j]=s.vals[i]||0;});return r;}),{sortKey:'day',sortDir:-1});return;}
  el.innerHTML=h+'<div class="plot" tabindex="0" role="group" aria-label="'+esc('Daily chart, '+dLabel(days[0])+' to '+dLabel(days[n-1])+'. '+all.map(function(s){return s.label+' '+(opt.last?'now ':'total ')+tot(s);}).join(', ')+'. Use the left and right arrow keys to read each day.')+'"></div>';
  var pl=el.querySelector('.plot'),W=Math.max(260,pl.clientWidth||720),H=W<520?200:250;st.w=el.clientWidth;
  var mx=0;on.forEach(function(s){s.vals.forEach(function(v){if(v>mx)mx=v;});});var any=mx>0,raw=(mx||4)/4,mag=Math.pow(10,Math.floor(Math.log10(raw))),stp=[1,2,5,10].filter(function(s){return s*mag>=raw;})[0]*mag;if(stp<1)stp=1;mx=stp*4;
  var L=String(fmt(mx)).length*7+14,R=14,T=12,B=28,pw=W-L-R,ph=H-T-B,X=function(i){return n>1?L+i*pw/(n-1):L+pw/2;},Y=function(v){return T+ph*(1-v/mx);};
  var g='';for(var t=0;t<=4;t++){var y=T+ph*(1-t/4);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="rgba(255,255,255,'+(t?'.07':'.18')+')"/><text x="'+(L-8)+'" y="'+(y+4)+'" fill="rgba(234,242,232,.62)" font-size="11" text-anchor="end">'+fmt(mx*t/4)+'</text>';}
  var cnt=Math.min(n,W<520?4:7),seen={},lab='';for(var c=0;c<cnt;c++){var xi=cnt>1?Math.round(c*(n-1)/(cnt-1)):0;if(seen[xi])continue;seen[xi]=1;lab+='<text x="'+X(xi).toFixed(1)+'" y="'+(H-8)+'" fill="rgba(234,242,232,.62)" font-size="11" text-anchor="'+(n>1&&xi===0?'start':n>1&&xi===n-1?'end':'middle')+'">'+dLabel(days[xi])+'</text>';}
  var p='',dots='',hd='';on.forEach(function(s,j){var d=s.vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v||0).toFixed(1);}).join(' ');if(!j&&any&&n>1)p+='<linearGradient id="'+id+'G" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+s.color+'" stop-opacity=".28"/><stop offset="1" stop-color="'+s.color+'" stop-opacity="0"/></linearGradient><path d="'+d+' L'+X(n-1).toFixed(1)+' '+(T+ph)+' L'+X(0).toFixed(1)+' '+(T+ph)+' Z" fill="url(#'+id+'G)"/>';
    p+='<path class="ln" pathLength="1" d="'+d+(n===1?' l.01 0':'')+'" fill="none" stroke="'+s.color+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';dots+='<circle cx="'+X(n-1).toFixed(1)+'" cy="'+Y(s.vals[n-1]||0).toFixed(1)+'" r="4" fill="'+s.color+'" stroke="#0c1510" stroke-width="2"/>';hd+='<circle r="5" fill="'+s.color+'" stroke="#0c1510" stroke-width="2"/>';});
  pl.innerHTML='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+g+lab+p+dots+(any?'':'<text x="'+(L+pw/2)+'" y="'+(T+ph/2)+'" fill="rgba(234,242,232,.62)" font-size="13" text-anchor="middle">Nothing recorded in this period yet</text>')+'<g class="hv" style="display:none"><line y1="'+T+'" y2="'+(T+ph)+'" stroke="rgba(255,255,255,.4)" stroke-dasharray="3 3"/>'+hd+'</g></svg><div class="tip" role="status" aria-live="polite" hidden></div>';
  var tip=pl.querySelector('.tip'),hv=pl.querySelector('.hv'),ln=hv.querySelector('line'),cur=-1;
  var show=function(i){i=Math.max(0,Math.min(n-1,i));if(i===cur)return;cur=i;var x=X(i);hv.style.display='';ln.setAttribute('x1',x);ln.setAttribute('x2',x);[].forEach.call(hv.querySelectorAll('circle'),function(ci,j){ci.setAttribute('cx',x);ci.setAttribute('cy',Y(on[j].vals[i]||0));});
    tip.innerHTML='<div class="td">'+dLong(days[i])+'</div>'+on.map(function(s){return '<div class="tr"><i style="background:'+s.color+'"></i><span>'+esc(s.label)+'</span><b>'+fmt(s.vals[i]||0)+'</b></div>';}).join('');tip.hidden=false;var cw=pl.clientWidth,tw=tip.offsetWidth,px=x*cw/W;tip.style.left=Math.max(0,Math.min(cw-tw,px+14+tw>cw?px-14-tw:px+14))+'px';};
  var hide=function(){hv.style.display='none';tip.hidden=true;cur=-1;};
  var at=function(e){var r=pl.getBoundingClientRect(),xx=(e.clientX-r.left)*W/(r.width||W);show(n>1?Math.round((xx-L)/(pw/(n-1))):0);};
  pl.onpointermove=at;pl.onpointerdown=at;pl.onpointerleave=function(){if(document.activeElement!==pl)hide();};
  pl.onfocus=function(){if(cur<0)show(n-1);};pl.onblur=hide;
  pl.onkeydown=function(e){var k=e.key;if(k==='ArrowLeft'||k==='ArrowRight'||k==='Home'||k==='End'){e.preventDefault();show(k==='Home'?0:k==='End'?n-1:(cur<0?n-1:cur)+(k==='ArrowLeft'?-1:1));}};}
function redrawCharts(){Object.keys(CH).forEach(function(id){var el=$(id);if(el&&el.offsetParent!==null&&CH[id].w!==el.clientWidth)drawChart(id);});}
var _rz;window.addEventListener('resize',function(){clearTimeout(_rz);_rz=setTimeout(redrawCharts,150);});
/* CSV export of any table rendered by table(): what is on screen (same filter and sort), plain values. */
function csvOf(id){var t=TB[id];if(!t)return '';var tmp=document.createElement('div'),plain=function(h){tmp.innerHTML=h;return tmp.textContent;},cols=t.cols.filter(function(c){return c.label;});
  var cell=function(v){if(v==null)v='';if(typeof v==='string'&&/^[=+@-]/.test(v))v="'"+v;v=String(v);return /[",\\r\\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
  var val=function(c,r){if(c.csv)return c.csv(r);var v=r[c.k];if(typeof v==='number'&&v>1e11&&/^(ts|updated|created|last)$/.test(c.k))return new Date(v).toISOString();if(v!==undefined&&v!==null&&typeof v!=='object'&&typeof v!=='boolean')return v;return c.fmt?plain(c.fmt(r)).trim():'';};
  return [cols.map(function(c){return cell(plain(c.label));}).join(',')].concat(t.rows.map(function(r){return cols.map(function(c){return cell(val(c,r));}).join(',');})).join('\\r\\n');}
function download(name,text){var b=new Blob([text],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},2000);}
document.addEventListener('click',function(e){var b=e.target.closest('button[data-csv]');if(!b)return;var id=b.getAttribute('data-csv'),t=TB[id];if(!t||!t.rows.length){toast('Nothing to export yet',false);return;}download('websprout-'+b.getAttribute('data-name')+'-'+new Date().toISOString().slice(0,10)+'.csv',csvOf(id));toast('Exported '+t.rows.length+' row'+(t.rows.length===1?'':'s'),true);});
function dayList(a){var o=[],t=Date.parse(a.range.start+'T00:00:00Z');for(var i=0;i<a.range.days;i++)o.push(new Date(t+i*864e5).toISOString().slice(0,10));return o;}
function delta(k){if(k.delta==null)return '<span class="flat">no earlier data</span>';var bad=k.id==='churn'?k.delta>0:k.delta<0;var cls=k.delta===0?'flat':(bad?'down':'up');return '<span class="'+cls+'">'+(k.delta>0?'&#9650; ':k.delta<0?'&#9660; ':'')+Math.abs(k.delta)+'%</span> <span class="flat">vs previous '+S.days+' days</span>';}
var HELP={visitors:'Unique people who landed on websprout.app (counted per day, no cookies).',generated:'Websites created with the generator.',publishRate:'Share of sites made in this period that have gone live.',newPro:'New Pro subscriptions, including free trials.',mrr:'Monthly recurring revenue: paying Pro customers \u00d7 the monthly price.',churn:'Pro subscriptions cancelled. Lower is better.',leads:'Contact-form messages delivered to owners from their sites.'};
function fmtK(k){return k.fmt==='pct'?pc(k.value):k.fmt==='usd'?'$'+num(k.value):num(k.value);}
function stat(l,v,help){return '<div class="stat"><span>'+l+(help?'<small>'+help+'</small>':'')+'</span><b>'+v+'</b></div>';}
function meter(l,used,cap,extra){var p=cap?Math.min(100,Math.round(used/cap*100)):0;return '<div class="meter'+(p>=80?' hot':'')+'"><div class="ml"><span>'+l+'</span><span><b>'+num(used)+'</b> of '+num(cap)+(extra?' '+extra:'')+'</span></div><div class="mb" role="progressbar" aria-label="'+esc(l)+'" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+p+'%"></i></div></div>';}
function badge(u){var b='free',t='FREE';if(u.owner){b='owner';t='OWNER';}else if(u.plan==='pro'&&u.source==='paid'){b='pro';t='PAYING';}else if(u.plan==='pro'){b='comp';t='COMPED';}return '<span class="badge '+b+'">'+t+'</span>'+(u.dev?'<span class="badge dev">DEV</span>':'');}
/* ---------- navigation ---------- */
function go(p,noFocus){if(!PAGES[p])p='overview';S.page=p;lsSet('wsAdmPage',p);[].forEach.call(document.querySelectorAll('.pg'),function(s){s.hidden=s.getAttribute('data-pg')!==p;});[].forEach.call(document.querySelectorAll('#nav button'),function(b){if(b.getAttribute('data-p')===p)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('pgTitle').textContent=PAGES[p];document.title=PAGES[p]+' \u00b7 Websprout Admin';if(location.hash!=='#'+p)history.replaceState(null,'','#'+p);closeMenu();if(!noFocus)$('content').focus({preventScroll:true});window.scrollTo(0,0);redrawCharts();}
function closeMenu(){$('side').classList.remove('open');$('menuBtn').setAttribute('aria-expanded','false');}
$('sideScrim').addEventListener('click',closeMenu);
$('nav').addEventListener('click',function(e){var b=e.target.closest('button[data-p]');if(b)go(b.getAttribute('data-p'));});
$('menuBtn').addEventListener('click',function(){var o=$('side').classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false');if(o){var f=$('nav').querySelector('button');if(f)f.focus();}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if($('drawer').classList.contains('on'))closeDrawer();else closeMenu();}});
/* ---------- drawer ---------- */
var _dLast=null;
function openDrawer(title,html){_dLast=document.activeElement;$('dTitle').textContent=title;$('dBody').innerHTML=html;var d=$('drawer');d.classList.add('on');d.setAttribute('aria-hidden','false');d.querySelector('.x').focus();}
function closeDrawer(){var d=$('drawer');d.classList.remove('on');d.setAttribute('aria-hidden','true');if(_dLast&&_dLast.focus)_dLast.focus();}
$('drawer').addEventListener('click',function(e){if(e.target.closest('[data-close]'))closeDrawer();var b=e.target.closest('button[data-act]');if(b)doAct(b);});
$('drawer').addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=[].filter.call($('drawer').querySelectorAll('button,a,input,select'),function(x){return x.offsetParent!==null;});if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();}});
function req(url,opt,okMsg){return fetch(url,opt).then(function(r){if(!r.ok)throw new Error(r.status);return r.text();}).then(function(){toast(okMsg,true);loadD();return true;}).catch(function(){toast('That did not work \u2014 please try again',false);return false;});}
function doAct(b){var a=b.getAttribute('data-act'),em=b.getAttribute('data-email')||'',v=b.getAttribute('data-v')||'',slug=b.getAttribute('data-slug')||'';
  var run=function(){
    if(a==='plan')return req('/admin/grant?email='+encodeURIComponent(em)+'&plan='+v,{},v==='pro'?'Pro granted to '+em:'Pro removed from '+em).then(function(ok){if(ok)openCustomer(em);});
    if(a==='dev')return req('/admin/grant?email='+encodeURIComponent(em)+'&role='+v,{},v==='dev'?'Developer access granted':'Developer access removed').then(function(ok){if(ok)openCustomer(em);});
    if(a==='down'||a==='block')return req('/admin/takedown?slug='+encodeURIComponent(slug)+(a==='block'?'&block=1':''),{method:'POST'},slug+(a==='block'?' taken down and blocked':' taken down')).then(function(ok){if(ok){closeDrawer();loadMod();}});
    if(a==='okmod')return req('/admin/moderation/dismiss?slug='+encodeURIComponent(slug),{method:'POST'},slug+' marked as fine').then(function(ok){if(ok)loadMod();});
    if(a==='feat')return req('/admin/feature?slug='+encodeURIComponent(slug)+'&on='+v,{},v==='1'?slug+' is now featured on the showcase':slug+' removed from the showcase').then(function(ok){if(ok){closeDrawer();}});
  };
  var msg=a==='down'?'Take '+slug+' offline? The owner can fix it and publish again.':a==='block'?'Take '+slug+' offline and block it? The owner will not be able to publish or share this site again.':a==='okmod'?'Mark '+slug+' as fine? If it was refused, the owner can then publish exactly this content (later edits are checked again).':a==='plan'&&v==='free'?'Remove Pro from '+em+'? Their badge comes back and custom domains stop working.':a==='plan'?'Give '+em+' Pro for free (comp)?':a==='dev'&&v==='user'?'Remove developer access from '+em+'?':a==='dev'?'Give '+em+' access to the developer panel?':a==='feat'&&v==='1'?'Feature '+slug+' on the public showcase?':'Remove '+slug+' from the showcase?';
  confirmBox(msg,a==='down'?'Take down':a==='block'?'Take down and block':a==='plan'&&v==='free'?'Remove Pro':a==='dev'&&v==='user'?'Remove access':'Confirm',(a==='down'||a==='block'||v==='free'||v==='user'||v==='0')).then(function(ok){if(ok)run();});}
function openCustomer(email){var u=((S.D&&S.D.users)||[]).filter(function(x){return x.email===email;})[0]||{email:email};
  openDrawer(email,'<span class="sk"></span><span class="sk" style="width:60%"></span><span class="sk big"></span>');
  fetch('/admin/customer?email='+encodeURIComponent(email)).then(function(r){return r.json();}).then(function(j){if(j.error){$('dBody').innerHTML='<p class="down">'+esc(j.error)+'</p>';return;}var c=j.user||u;
    var h='<div>'+badge(c)+(c.name?' <b style="margin-left:6px">'+esc(c.name)+'</b>':'')+'</div>';
    h+='<div class="card" style="margin-top:12px">'+stat('Plan',c.plan==='pro'?(c.source==='paid'?'Paying Pro ($'+(j.price||10)+'/mo)':'Pro (comped)'):'Free')+stat('Joined',c.created?new Date(c.created).toLocaleDateString():'&mdash;')+stat('Last active',ago(j.lastActive))+stat('Active days',num(j.activeDays))+stat('Leads received',num(j.leads))+stat('Site visits',num(j.visits))+'</div>';
    if(!c.owner){h+='<div class="acts">'+(c.plan==='pro'?'<button class="btn dng" data-act="plan" data-email="'+esc(email)+'" data-v="free">Remove Pro</button>':'<button class="btn pri" data-act="plan" data-email="'+esc(email)+'" data-v="pro">Give Pro (comp)</button>')+(c.dev?'<button class="btn dng" data-act="dev" data-email="'+esc(email)+'" data-v="user">Remove developer access</button>':'<button class="btn" data-act="dev" data-email="'+esc(email)+'" data-v="dev">Make developer</button>')+'</div>';}
    h+='<h2>Sites ('+(j.sites||[]).length+')</h2>'+((j.sites||[]).length?'<div class="tw"><table><thead><tr><th style="padding:9px 12px">Site</th><th class="r" style="padding:9px 12px">Visits</th><th class="r" style="padding:9px 12px">Leads</th></tr></thead><tbody>'+j.sites.map(function(s){return '<tr><td>'+(s.slug?'<a href="https://'+esc(s.slug)+'.websprout.app" target="_blank" rel="noopener">'+esc(s.slug)+'.websprout.app</a>':esc(s.name||s.siteId)+' <span class="muted">(not published)</span>')+(s.category?'<div class="muted" style="font-size:12px">'+esc(s.bizType||'')+' &middot; '+esc(s.category)+'</div>':'')+'</td><td class="r">'+num(s.views)+'</td><td class="r">'+num(s.leads)+'</td></tr>';}).join('')+'</tbody></table></div>':'<p class="muted">No saved sites.</p>');
    h+='<h2>Timeline</h2>'+((j.events||[]).length?'<ul class="tl">'+j.events.map(function(e){return '<li><b>'+esc(evLabel(e.type))+'</b>'+(e.site_id?' <span class="muted">'+esc(e.site_id)+'</span>':'')+'<div class="t">'+dt(e.ts)+(e.source?' &middot; via '+esc(e.source):'')+'</div></li>';}).join('')+'</ul>':'<p class="muted">No recorded events yet.</p>');
    $('dBody').innerHTML=h;}).catch(function(){$('dBody').innerHTML='<p class="down">Could not load this customer.</p>';});}
function openSite(slug){var p=((S.D&&S.D.published)||[]).filter(function(x){return x.slug===slug;})[0];if(!p)return;
  openDrawer(slug+'.websprout.app','<div class="card">'+stat('Address','<a href="https://'+esc(slug)+'.websprout.app" target="_blank" rel="noopener">Open site &#8599;</a>')+stat('Visits (all time)',num(p.views))+stat('Leads',num(p.leads))+stat('Last updated',dt(p.updated))+stat('Websprout badge',p.nobadge?'Hidden (Pro)':'Shown')+stat('Showcase',p.featured?'Featured':'Not featured')+'</div><div class="acts">'+(p.featured?'<button class="btn dng" data-act="feat" data-slug="'+esc(slug)+'" data-v="0">Remove from showcase</button>':'<button class="btn pri" data-act="feat" data-slug="'+esc(slug)+'" data-v="1">Feature on showcase</button>')+'<button class="btn dng" data-act="down" data-slug="'+esc(slug)+'">Take down</button><button class="btn dng" data-act="block" data-slug="'+esc(slug)+'">Take down and block</button></div>');}
var EVL={landing:'Visited a landing page',visit:'Opened the builder',setup_start:'Started setup',generate:'Generated a site',generate_fail:'Generation failed',first_edit:'First edit',signup:'Created an account',login:'Signed in',publish:'Published',unpublish:'Unpublished',launch_check:'Ran the launch check',upgrade_click:'Opened Go Pro',pro_start:'Started Pro',pro_cancel:'Cancelled Pro',pro_cancel_scheduled:'Scheduled a cancellation',payment_failed:'Payment failed',pro_comp:'Given Pro (comp)',pro_revoke:'Pro removed by admin',lead:'Received a lead',review:'Received a review',domain_connected:'Connected a domain',store_checkout:'Store checkout',share:'Shared a preview',deploy_netlify:'Exported to Netlify',account_delete:'Deleted account'};
function evLabel(t){return EVL[t]||t;}
/* ---------- renderers ---------- */
function attentionItems(){var a=S.A,d=S.D,o=[],grp=null;if(a&&a.insights)a.insights.forEach(function(i){if(i.level!=='warn')return;var m=/^(.+) sites publish at ([0-9.]+)% vs ([0-9.]+)% average/.exec(i.text);
    if(m){if(!grp){grp={lv:'warn',t:i.text,p:'growth',g:[]};o.push(grp);}grp.g.push(m[1]+' ('+m[2]+'%)');grp.avg=m[3];return;}
    o.push({lv:'warn',t:i.text,p:/churn|Pro customer/.test(i.text)?'customers':/cap|Unsplash|emails sent/.test(i.text)?'health':'growth'});});
  if(grp&&grp.g.length>1)grp.t=grp.g.length+' business types publish well below the '+grp.avg+'% average: '+grp.g.join(', ')+'. Review their templates and starter copy.';
  if(d&&d.totals&&d.totals.errors24)o.push({lv:'warn',t:d.totals.errors24+' JavaScript error'+(d.totals.errors24===1?'':'s')+' on customer sites in the last 24 hours.',p:'health'});
  if(a&&a.costs&&a.costs.cronLast&&Date.now()-a.costs.cronLast>36*36e5)o.push({lv:'warn',t:'The daily job has not run for over a day \u2014 digests, nudges and cleanup are paused.',p:'health'});return o;}
function fmtV(v,f){return f==='pct'?(Math.round(v*10)/10)+'%':f==='usd'?'$'+num(Math.round(v)):num(Math.round(v));}
function countUp(root){if(RM||!window.requestAnimationFrame)return;[].forEach.call(root.querySelectorAll('.n[data-v]'),function(el){var v=parseFloat(el.getAttribute('data-v')),f=el.getAttribute('data-f'),fin=el.innerHTML,t0=null;if(!v)return;var step=function(t){if(!el.isConnected)return;if(t0===null)t0=t;var p=Math.min(1,(t-t0)/650),e=1-Math.pow(1-p,3);if(p<1){el.textContent=fmtV(v*e,f);requestAnimationFrame(step);}else el.innerHTML=fin;};requestAnimationFrame(step);});}
function kpiCard(k,o){o=o||{};var id=o.id||k.id,help=o.help||HELP[k.id]||'';return '<div class="kpi'+(o.hero?' hero':'')+'"><div class="l"><span>'+esc(k.label)+'</span><button type="button" class="i" aria-label="About '+esc(k.label)+'" aria-describedby="kx-'+id+'">i</button><span class="x" role="tooltip" id="kx-'+id+'">'+esc(help)+'</span></div><div class="n"'+(typeof k.value==='number'?' data-v="'+k.value+'" data-f="'+(k.fmt||'n')+'"':'')+'>'+fmtK(k)+'</div>'+(o.noDelta?'':'<div class="d">'+delta(k)+'</div>')+(o.spark===false?'':spark(k.spark,k.id==='churn'?'#fca5a5':k.id==='mrr'||k.id==='newPro'?'#22d3ee':'#4ade80'))+'</div>';}
function rate(a,b){return b?a/b*100:null;}
function rfmt(v){return v==null?'&mdash;':(v>0&&v<1?v.toFixed(2):String(Math.round(v*10)/10))+'%';}
function pts(c,p){if(c==null||p==null)return '<span class="flat">no earlier data</span>';var d=Math.round((c-p)*10)/10;return d===0?'<span class="flat">same as before</span>':'<span class="'+(d>0?'up':'down')+'">'+(d>0?'&#9650; ':'&#9660; ')+Math.abs(d)+' pts</span>';}
function rankList(rows,val,label,sub){if(!rows.length)return '<p class="empty">'+EMPTY+'</p>';var mx=Math.max.apply(null,rows.map(val).concat([1]));return '<ol class="rank">'+rows.map(function(r){var v=val(r);return '<li><div class="rk"><span class="rn">'+esc(label(r))+'</span><span class="rv"><b>'+num(v)+'</b> '+sub(r)+'</span></div><div class="rb"><i style="width:'+Math.max(v?2:0,Math.round(v*100/mx))+'%"></i></div></li>';}).join('')+'</ol>';}
function renderPulse(a){var dl=a.daily;if(!dl)return '';var n=dl.days.length,live=a.range.end===new Date().toISOString().slice(0,10),row=function(l,arr){return '<tr><td>'+l+'</td><td class="t">'+num(arr[n-1]||0)+'</td><td>'+(n>1?num(arr[n-2]||0):'&mdash;')+'</td></tr>';};
  return '<div class="pulse"><div class="l">'+(live?'<span class="live" aria-hidden="true"></span>Today so far':esc(dLabel(dl.days[n-1])))+'</div><table><thead><tr><th><span class="muted" title="Days are counted in UTC">UTC day</span></th><th>'+(live?'Today':'Day')+'</th><th>'+(live?'Yesterday':'Day before')+'</th></tr></thead><tbody>'+row('Visitors',dl.visitors)+row('Sites made',dl.generated)+row('Published',dl.published)+'</tbody></table></div>';}
function renderConv(a){var c=a.conversion,el=$('convStrip');if(!c){el.innerHTML='<p class="empty">'+EMPTY+'</p>';return;}var cu=c.cur,pv=c.prev,hasPrev=pv.visitors>0||pv.generated>0;
  var st=[['visitors','Visitors',''],['generated','Sites generated','made a site'],['published','Published','published'],['pro','Started Pro','went Pro']],h='';
  st.forEach(function(s,i){if(i){var pk=st[i-1][0],r=rate(cu[s[0]],cu[pk]),pr=hasPrev?rate(pv[s[0]],pv[pk]):null;h+='<div class="cx"><small>'+s[2]+'</small><b>'+rfmt(r)+'</b>'+pts(r,pr)+'</div>';}h+='<div class="cs"><span>'+s[1]+'</span><b>'+num(cu[s[0]])+'</b><em>'+(hasPrev?'before: '+num(pv[s[0]]):'no earlier data')+'</em></div>';});
  var all=rate(cu.pro,cu.visitors),allP=hasPrev?rate(pv.pro,pv.visitors):null;
  el.innerHTML='<div class="conv">'+h+'</div><p class="note">Overall, <b>'+rfmt(all)+'</b> of visitors started Pro'+(allP!=null?' (before: '+rfmt(allP)+') '+pts(all,allP):'')+'. Published and Pro follow the sites generated in each period, so the newest sites may still convert. <button class="lnk" data-go="growth">Full funnel &rarr;</button></p>';}
function renderOverview(){var a=S.A;if(!a||a.noDb||a.error)return;var att=attentionItems(),lim=S.attAll?att.length:3;
  $('attList').innerHTML=att.length?att.slice(0,lim).map(function(i){return '<li class="warn"><span>'+esc(i.t)+'</span><button class="go" data-go="'+i.p+'" aria-label="View in '+esc(PAGES[i.p])+'">View &rarr;</button></li>';}).join(''):'<li class="good"><span class="tag good">ALL GOOD</span><span>Nothing needs your attention right now.</span></li>';
  $('attMore').innerHTML=att.length>3?'<button class="lnk" id="attTog" aria-expanded="'+(S.attAll?'true':'false')+'" aria-controls="attList">'+(S.attAll?'Show fewer':'Show all '+att.length)+'</button>':'';
  var c=$('attCnt');c.hidden=!att.length;c.textContent=att.length;
  var wins=(a.insights||[]).filter(function(i){return i.level!=='warn';});$('winList').innerHTML=wins.length?wins.map(function(i){return '<li class="'+(i.level==='good'?'good':'')+'"><span class="tag '+i.level+'">'+(i.level==='good'?'WIN':'NOTE')+'</span><span>'+esc(i.text)+'</span></li>';}).join(''):'<li><span class="muted">Insights appear here once there is enough data (small samples are ignored on purpose).</span></li>';
  var kv={};a.kpis.forEach(function(k){kv[k.id]=k;});
  $('kpis').innerHTML=renderPulse(a)+a.kpis.map(function(k){return kpiCard(k,{hero:k.id==='visitors'||k.id==='mrr'});}).join('');if(S.anim)countUp($('kpis'));
  var dl=a.daily||{days:dayList(a),visitors:kv.visitors.spark,generated:kv.generated.spark,published:[]};
  lineChart('ovChart',dl.days,[{key:'visitors',label:'Visitors',color:'#3b93e0',vals:dl.visitors},{key:'generated',label:'Sites generated',color:'#1fa968',vals:dl.generated},{key:'published',label:'Sites published',color:'#c4811c',vals:dl.published}],{name:'daily'});
  renderConv(a);
  $('topSrc').innerHTML=rankList(((a.acquisition||{}).sources||[]).filter(function(r){return r.visitors>0;}).slice(0,5),function(r){return r.visitors;},function(r){return r.key;},function(r){return r.genRate==null?'':'&middot; '+pc(r.genRate)+' made a site';});
  $('topBiz').innerHTML=rankList(((a.business||{}).types||[]).slice(0,5),function(r){return r.generated;},function(r){return r.key;},function(r){return '&middot; '+pc(r.pubRate)+' published';});
  $('ovLead').textContent=dLabel(a.range.start)+' to '+dLabel(a.range.end)+', compared with '+dLabel(a.range.prevStart)+' to '+dLabel(a.range.prevEnd)+' (the '+a.range.days+' days before).';}
document.addEventListener('click',function(e){if(e.target.closest('#attTog')){S.attAll=!S.attAll;renderOverview();var b=$('attTog');if(b)b.focus();}});
function renderGrowth(){var a=S.A;if(!a||!a.funnel)return;var f=a.funnel,top=null;f.steps.forEach(function(s){if(top===null&&s.n)top=s.n;});
  $('fun').innerHTML=f.steps.map(function(s){if(s.n==null)return '<div class="fstep"><span>'+esc(s.label)+'</span><div class="fbar"></div><span class="muted">'+(s.id==='setup'&&f.setupNeedsHook?'waiting for editor update':'not available with this filter')+'</span></div>';var w=top?Math.max(s.n?2:0,Math.round(s.n*100/top)):0;return '<div class="fstep"><span>'+esc(s.label)+'</span><div class="fbar" role="img" aria-label="'+esc(s.label+': '+s.n)+'"><i style="width:'+w+'%"></i></div><span><b>'+num(s.n)+'</b>'+(s.conv!=null?' <span class="muted">'+s.conv+'% kept</span>':'')+'</span></div>';}).join('');
  $('funNote').innerHTML='Visitors are counted once per day without cookies. From &ldquo;Site generated&rdquo; on, each step follows the sites made in this period. Typical time from generating to publishing: <b>'+(f.medianHoursToPublish==null?'&mdash;':(f.medianHoursToPublish<48?f.medianHoursToPublish+' hours':(Math.round(f.medianHoursToPublish/2.4)/10)+' days'))+'</b>.';
  $('fSrc').innerHTML='<option value="">All sources</option>'+f.sources.map(function(x){return '<option'+(x===S.src?' selected':'')+'>'+esc(x)+'</option>';}).join('');$('fCat').innerHTML='<option value="">All categories</option>'+f.categories.map(function(x){return '<option'+(x===S.cat?' selected':'')+'>'+esc(x)+'</option>';}).join('');
  table('acqT',[{k:'key',label:{sources:'Source',campaigns:'Campaign',landings:'Landing page'}[S.acq]},{k:'visitors',label:'Visitors',num:1,fmt:function(r){return num(r.visitors);}},{k:'generated',label:'Sites made',num:1,fmt:function(r){return num(r.generated);}},{k:'genRate',label:'Visit &rarr; site',num:1,fmt:function(r){return pc(r.genRate);}},{k:'published',label:'Published',num:1,fmt:function(r){return num(r.published);}},{k:'pubRate',label:'Publish rate',num:1,fmt:function(r){return pc(r.pubRate);}},{k:'pro',label:'Pro',num:1,fmt:function(r){return num(r.pro);}}],a.acquisition[S.acq]||[],{sortKey:'visitors'});
  var b=a.business;$('bizSub').textContent='average publish rate '+b.overallPubRate+'%';
  table('bizT',[{k:'key',label:'Business type',fmt:function(r){return esc(r.key)+(r.under?' <span class="down" style="font-size:12px">&#9660; below average</span>':'');}},{k:'generated',label:'Sites made',num:1,fmt:function(r){return num(r.generated);}},{k:'published',label:'Published',num:1,fmt:function(r){return num(r.published);}},{k:'pubRate',label:'Publish rate',num:1,fmt:function(r){return pc(r.pubRate);}},{k:'google',label:'Google linked',num:1,fmt:function(r){return num(r.google);}},{k:'pro',label:'Pro',num:1,fmt:function(r){return num(r.pro);}}],b[S.biz]||[],{sortKey:'generated',rowAttr:function(r){return r.under?' class="under"':'';}});
  $('genericNote').innerHTML='<b>'+pc(b.genericShare)+'</b> of new sites landed in the &ldquo;generic&rdquo; category (no tailored template)'+(b.genericTypes.length?'. Most common: '+b.genericTypes.slice(0,8).map(function(g){return esc(g.key)+' ('+g.n+')';}).join(', '):'')+'.';
  var rt=a.retention;table('cohT',[{k:'week',label:'Signed up week of'},{k:'size',label:'People',num:1},{k:'w1',label:'Back in week 1',num:1,fmt:function(r){return heat(r.w1);}},{k:'w4',label:'Back in week 4',num:1,fmt:function(r){return heat(r.w4);}}],rt.cohorts,{sortKey:'week',sortDir:-1,cls:'cg',empty:'No sign-ups recorded yet \u2014 this fills in as people create accounts.'});
  $('engage').innerHTML='<h2>Engagement</h2>'+stat('Owners active in this period',num(rt.activeOwners),'signed in, saved or published')+stat('Average active days per owner',rt.avgActiveDays)+stat('Sites edited in the last 7 days',num(rt.sitesUpdated7))+stat('Sites edited in the last 30 days',num(rt.sitesUpdated30));}
function heat(v){if(v==null)return '<span class="muted" title="Too early to tell">&mdash;</span>';return '<span style="display:inline-block;min-width:48px;padding:2px 6px;border-radius:6px;background:rgba(74,222,128,'+Math.min(.7,.08+v/100).toFixed(2)+')">'+v+'%</span>';}
function renderRevenue(){var a=S.A;if(!a||!a.revenue)return;var rv=a.revenue,v=a.value,kv={};a.kpis.forEach(function(k){kv[k.id]=k;});
  $('revK').innerHTML=['mrr','newPro','churn'].map(function(id){return kpiCard(kv[id],{id:'r-'+id,hero:id==='mrr',spark:false});}).join('')+kpiCard({id:'paid',label:'Paying customers',value:rv.paid,fmt:'n'},{id:'r-paid',help:'Pro subscribers with a Stripe card (comped accounts excluded).',noDelta:true,spark:false});if(S.anim)countUp($('revK'));
  var mv=kv.mrr.spark;if(mv.some(function(x){return x;}))lineChart('mrrChart',dayList(a),[{key:'mrr',label:'MRR',color:'#1fa968',vals:mv}],{fmt:function(v){return '$'+num(Math.round(v));},last:true,name:'mrr'});else{delete CH.mrrChart;$('mrrChart').innerHTML='<p class="empty">'+EMPTY+' (the daily job records MRR once a day)</p>';}
  $('revPanel').innerHTML='<h2>Subscriptions</h2>'+stat('Cancellations',num(rv.cancels)+(rv.churnRate?' ('+rv.churnRate+'%)':''),'share of paying customers at the start of the period')+stat('Cancellations scheduled',num(rv.cancelScheduled),'will end at the close of the billing period')+stat('Failed payments',rv.paymentFailed?'<span class="down">'+rv.paymentFailed+'</span>':'0','cards Stripe could not charge')+stat('&ldquo;Go Pro&rdquo; opened',num(rv.upgradeClicks))+(rv.proBySource.length?stat('New Pro by source',rv.proBySource.map(function(x){return esc(x.source)+' '+x.n;}).join(', ')):'');
  $('valPanel').innerHTML='<h2>Store sales &amp; customer value</h2>'+stat('Store checkouts started',num(rv.storeCheckouts),'on customers&rsquo; shop sites')+stat('Store checkout value',usd(rv.storeAmount))+stat('Platform fees on those checkouts',usd(rv.storeFees))+stat('Fees collected (Stripe, all time)',S.D&&S.D.totals?(S.D.totals.feesOk?usd(S.D.totals.feesCollected):'&mdash;'):'&hellip;')+stat('Leads delivered',num(v.leads))+stat('Published-site visits',num(v.publishedViews))+stat('Busy sites with no leads',num(v.quietSites),'50+ visits, no contact-form message')+stat('Custom domains connected',num(v.domainsConnected));}
function renderHealth(){var a=S.A;if(!a||!a.costs)return;var c=a.costs,q=a.quality;
  $('costPanel').innerHTML='<h2>Free-plan limits</h2>'+meter('Google photos this month',c.gphotoUsed||0,c.gphotoCap||900)+meter('Unsplash calls this hour (estimate)',c.unsplashEstHour||0,50,c.unsplashKey?'':'<span class="muted">(no key)</span>')+meter('Emails sent today',c.emailToday||0,100)+meter('Emails sent this month',c.emailMonth||0,3000)+stat('Google Places lookups',num(c.placesPeriod)+' <span class="muted">('+num(c.placesMonth)+' this month)</span>')+stat('Emails by kind',Object.keys(c.emailPeriod||{}).map(function(k){return esc(k)+' '+c.emailPeriod[k];}).join(', ')||'&mdash;')+stat('Daily job last ran',c.cronLast?dt(c.cronLast):'<span class="down">not yet</span>','sends digests and nudges, cleans up old data');
  $('qualPanel').innerHTML='<h2>Product quality</h2>'+stat('Failed site generations',(q.fails?'<span class="down">'+q.fails+'</span>':'0')+' <span class="muted">('+q.failRate+'%)</span>')+stat('Generation time (typical / slowest 5%)',q.genMsP50?(q.genMsP50/1000).toFixed(1)+'s / '+(q.genMsP95/1000).toFixed(1)+'s':'&mdash;')+stat('Launch checks run',q.launchChecks?num(q.launchChecks)+' <span class="muted">(avg '+q.avgIssues+' problems)</span>':'<span class="muted">waiting for editor update</span>')+stat('Sites in the generic category',pc(a.business.genericShare),'no tailored template for their business type')+(q.failReasons.length?'<p class="note">Why generations failed: '+q.failReasons.map(function(x){return esc(x.err||'unknown')+' ('+x.n+')';}).join(', ')+'</p>':'')+(q.topIssues.length?'<p class="note">Top launch problems: '+q.topIssues.map(function(x){return esc(x.key)+' ('+x.n+')';}).join(', ')+'</p>':'');}
function renderA(){var a=S.A;if(!a)return;$('content').classList.toggle('nodb',!!(a.noDb||a.error));$('nodb').hidden=!a.noDb;
  if(a.noDb){$('nodb').innerHTML='<b>The analytics database is not connected yet.</b> <span class="muted">Bind Cloudflare D1 as DB (see wrangler.toml). Until then only accounts, sites and errors are shown.</span>';var at=attentionItems();$('attList').innerHTML=at.length?at.map(function(i){return '<li class="warn"><span>'+esc(i.t)+'</span><button class="go" data-go="'+i.p+'">View &rarr;</button></li>';}).join(''):'<li><span class="tag info">NOTE</span><span>Traffic and conversion numbers appear here once the analytics database is connected.</span></li>';$('attMore').innerHTML='';
    ['fun','acqT','bizT','cohT','engage','revK','mrrChart','revPanel','valPanel','costPanel','qualPanel'].forEach(function(id){$(id).innerHTML='<p class="empty">Needs the analytics database.</p>';});return;}
  if(a.error){$('attList').innerHTML='<li class="warn"><span class="tag warn">ERROR</span><span>'+esc(a.error)+'</span></li>';$('attMore').innerHTML='';return;}
  renderOverview();renderGrowth();renderRevenue();renderHealth();}
function renderCustomers(){var d=S.D;if(!d||!d.users)return;var q=($('custQ').value||'').toLowerCase(),pl=$('custPlan').value;var rows=d.users.filter(function(u){if(q&&(u.email+' '+(u.name||'')).toLowerCase().indexOf(q)<0)return false;if(pl==='paid')return u.plan==='pro'&&u.source==='paid';if(pl==='comp')return u.plan==='pro'&&u.source!=='paid';if(pl==='free')return u.plan!=='pro';if(pl==='risk')return u.stale;return true;});
  table('custT',[{k:'email',label:'Customer',fmt:function(u){return '<b>'+esc(u.email)+'</b>'+(u.name?'<div class="muted" style="font-size:12px">'+esc(u.name)+'</div>':'');}},{k:'plan',label:'Plan',sort:function(u){return u.owner?3:u.plan==='pro'?(u.source==='paid'?2:1):0;},fmt:badge},{k:'sites',label:'Sites',num:1,sort:function(u){return u.sites||u.gens||0;},fmt:function(u){return num(u.sites||u.gens||0)+(u.published?' <span class="muted">('+u.published+' live)</span>':'');}},{k:'lastActive',label:'Last active',sort:function(u){return u.lastActive||'';},fmt:function(u){return '<span'+(u.stale?' class="down" title="Paying but inactive 30+ days"':'')+'>'+ago(u.lastActive)+'</span>';}},{k:'leads',label:'Leads',num:1,fmt:function(u){return num(u.leads);}},{k:'visits',label:'Site visits',num:1,fmt:function(u){return num(u.visits);}},{k:'mrr',label:'MRR',num:1,fmt:function(u){return u.mrr?'$'+u.mrr:'<span class="muted">&mdash;</span>';}},{k:'created',label:'Joined',num:1,fmt:function(u){return u.created?new Date(u.created).toLocaleDateString():'&mdash;';}}],rows,{sortKey:'created',empty:d.users.length?'No customers match this search.':'No accounts yet \u2014 this fills in as people sign up.',rowAttr:function(u){return ' class="click" tabindex="0" data-open="'+esc(u.email)+'" aria-label="Open '+esc(u.email)+'"';},onOpen:openCustomer});}
function renderSites(){var d=S.D;if(!d)return;var q=($('siteQ').value||'').toLowerCase();var rows=(d.published||[]).filter(function(p){return !q||p.slug.indexOf(q)>-1;});
  table('siteT',[{k:'slug',label:'Address',fmt:function(p){return '<a href="https://'+esc(p.slug)+'.websprout.app" target="_blank" rel="noopener">'+esc(p.slug)+'</a>'+(p.featured?' <span class="badge dev">FEATURED</span>':'');}},{k:'views',label:'Visits',num:1,fmt:function(p){return num(p.views);}},{k:'leads',label:'Leads',num:1,fmt:function(p){return num(p.leads);}},{k:'updated',label:'Updated',num:1,fmt:function(p){return dt(p.updated);}},{k:'nobadge',label:'Badge',fmt:function(p){return p.nobadge?'<span class="muted">hidden (Pro)</span>':'shown';}}],rows,{sortKey:'updated',empty:(d.published||[]).length?'No sites match this search.':'No published sites yet \u2014 this fills in as owners publish.',rowAttr:function(p){return ' class="click" tabindex="0" data-open="'+esc(p.slug)+'" aria-label="Open '+esc(p.slug)+'"';},onOpen:openSite});
  table('domT',[{k:'host',label:'Domain',fmt:function(x){return '<a href="https://'+esc(x.host)+'" target="_blank" rel="noopener">'+esc(x.host)+'</a>';}},{k:'slug',label:'Points to'}],d.domains||[],{empty:'No custom domains yet.'});}
function renderData(){var d=S.D;if(!d)return;if(d.error){$('custT').innerHTML='<p class="empty down">'+esc(d.error)+'</p>';return;}var t=d.totals||{};renderCustomers();renderSites();
  table('unmT',[{k:'ts',label:'When',num:1,fmt:function(x){return dt(x.ts);}},{k:'typed',label:'Email typed at checkout',fmt:function(x){return esc(x.typed||'(none)');}},{k:'customer',label:'Stripe customer',fmt:function(x){return esc(x.customer||'');}}],(d.unmatched||[]),{sortKey:'ts',empty:'None. Every payment was linked to its account.'});
  table('invT',[{k:'ts',label:'When',num:1,fmt:function(x){return dt(x.ts);}},{k:'desc',label:'For'},{k:'amount',label:'Amount',num:1,fmt:function(x){return esc((x.currency||'usd').toUpperCase())+' '+((x.amount||0)/100).toFixed(2);}},{k:'fee',label:'Fee',num:1,fmt:function(x){return x.fee?usd(x.fee):'&mdash;';}},{k:'client',label:'Client'}],d.invoices||[],{sortKey:'ts',empty:'No invoices yet.'});
  $('invSub').textContent=(t.invoices||0)+' created \u00b7 '+(t.feesOk?usd(t.feesCollected)+' fees collected':usd(t.feeBilled)+' fees billed');
  var gs=d.errorGroups||[];table('errT',[{k:'last',label:'Last seen',num:1,fmt:function(e){return dt(e.last);}},{k:'where',label:'Where'},{k:'msg',label:'Error and affected sites',fmt:function(e){return '<div style="color:#fca5a5;font-size:12.5px;word-break:break-word;max-width:460px">'+esc(e.msg)+(e.line?' <span class="muted">(line '+e.line+')</span>':'')+'</div>'+(e.sites&&e.sites.length?'<div class="muted" style="font-size:11.5px;word-break:break-all">'+e.sites.map(esc).join(', ')+'</div>':'');}},{k:'last24',label:'Last 24h / total',num:1,fmt:function(e){return '<span'+(e.last24?' class="down"':'')+'>'+e.last24+'</span> / '+e.count;}}],gs,{sortKey:'last24',empty:'No errors reported &#127881;'});
  $('errCount').textContent=gs.length?gs.length+' distinct, '+(t.errors24||0)+' in the last 24 hours':'';$('errClear').hidden=!gs.length;
  if(S.A)renderA();}
var _acts=[],_actLast=0,_actDb=false;
function evDetail(e){var p=e.props||{},o=[];if(e.biz_type)o.push(esc(e.biz_type)+(e.category?' ('+esc(e.category)+')':''));['look','slug','amount','fee','issues','err','host','reason'].forEach(function(k){if(p[k]!=null&&p[k]!=='')o.push(k+': '+esc(p[k]));});if(p.ms)o.push((p.ms/1000).toFixed(1)+'s');if(p.google)o.push('Google listing');if(e.landing)o.push('landed on '+esc(e.landing));return o.join(' &middot; ')||'<span class="muted">&mdash;</span>';}
function renderActs(){table('actT',[{k:'ts',label:'When',num:1,fmt:function(e){return dt(e.ts);}},{k:'type',label:'What happened',fmt:function(e){return '<b>'+esc(evLabel(e.type))+'</b>';}},{k:'email',label:'Who',fmt:function(e){return e.email?'<a href="#" data-cust="'+esc(e.email)+'">'+esc(e.email)+'</a>':'<span class="muted">anonymous visitor</span>';}},{k:'source',label:'Came from',fmt:function(e){return e.source?esc(e.source)+(e.campaign?' <span class="muted">'+esc(e.campaign)+'</span>':''):'<span class="muted">&mdash;</span>';}},{k:'details',label:'Details',sort:function(e){return e.biz_type||'';},fmt:evDetail},{k:'country',label:'Where',fmt:function(e){return '<span class="muted">'+esc([e.country,e.device].filter(Boolean).join(' \u00b7 '))+'</span>';}}],_acts,{sortKey:'ts',empty:'No matching activity yet.'});}
$('actT').addEventListener('click',function(e){var a=e.target.closest('a[data-cust]');if(a){e.preventDefault();openCustomer(a.getAttribute('data-cust'));}},true);
function loadActs(more){var q=$('actSearch').value||'',ty=$('actType').value||'';if(!more)$('actT').innerHTML='<div style="padding:12px"><span class="sk"></span><span class="sk"></span></div>';
  return fetch('/admin/activity?type='+encodeURIComponent(ty)+'&q='+encodeURIComponent(q)+(more&&_actLast?'&before='+_actLast:'')).then(function(r){return r.json();}).then(function(j){var ev=(j&&j.events)||[];_actDb=!!j.db;_acts=more?_acts.concat(ev):ev;_actLast=ev.length?ev[ev.length-1].id:0;$('actMore').hidden=!(j.db&&ev.length>=200);
    if(j.types&&!more)$('actType').innerHTML='<option value="">All events</option>'+j.types.map(function(t){return '<option value="'+esc(t)+'"'+(t===ty?' selected':'')+'>'+esc(evLabel(t))+'</option>';}).join('');
    if(!j.db){var ql=q.toLowerCase();_acts=_acts.filter(function(a){return (!ql||JSON.stringify(a).toLowerCase().indexOf(ql)>-1)&&(!ty||a.type===ty);});}
    renderActs();return true;}).catch(function(){$('actT').innerHTML='<p class="empty down">Could not load activity.</p>';});}
var MODCAT={sexual:'Sexual / NSFW',profanity:'Vulgar language',hate:'Hate or harassment',violence:'Violence',drugs:'Drugs',weapons:'Weapons',scam:'Scam or phishing',impersonation:'Impersonates a brand',other:'Not family-friendly'};
function renderMod(items,aiOn){var c=$('modCnt'),n=items.filter(function(x){return x.status==='block'&&!x.refused;}).length;c.hidden=!items.length;c.textContent=items.length;
  var ai=$('modAi');ai.hidden=!!aiOn;ai.innerHTML=aiOn?'':'<b>The AI check is off</b> (no Gemini key, or MODERATION_AI=off). Only the word list is running.';
  table('modT',[{k:'slug',label:'Site',fmt:function(x){var live=!x.refused&&!x.preview;return (live?'<a href="https://'+esc(x.slug)+'.websprout.app" target="_blank" rel="noopener">'+esc(x.slug)+'</a>':esc(x.slug))+(x.email?'<div class="muted" style="font-size:12px">'+esc(x.email)+'</div>':'');}},
    {k:'status',label:'Result',fmt:function(x){return x.status==='report'?'<span class="badge pro" style="background:#78350f;color:#fde68a">REPORTED'+(x.reports>1?' ('+x.reports+')':'')+'</span>'+(x.reporter?'<div class="muted" style="font-size:12px">by '+esc(x.reporter)+'</div>':''):x.status==='block'?(x.refused?'<span class="badge">REFUSED</span>':'<span class="badge pro" style="background:#7f1d1d;color:#fecaca">LIVE &mdash; FLAGGED</span>'):'<span class="badge">NOT CHECKED</span>';}},
    {k:'category',label:'Why',fmt:function(x){return esc(MODCAT[x.category]||(x.status==='unchecked'?'AI check unavailable ('+(x.reason||'')+')':x.category||''))+((x.status==='block'||x.status==='report')&&x.reason?'<div class="muted" style="font-size:12px">'+esc(x.reason)+'</div>':'');}},
    {k:'ts',label:'When',num:1,fmt:function(x){return dt(x.ts);}},
    {k:'act',label:'',fmt:function(x){var live=!x.refused&&!x.preview;return '<span class="acts" style="margin:0">'+(live?'<button class="btn dng" data-act="down" data-slug="'+esc(x.slug)+'">Take down</button><button class="btn dng" data-act="block" data-slug="'+esc(x.slug)+'">Block</button>':'')+'<button class="btn" data-act="okmod" data-slug="'+esc(x.slug)+'">'+(live?'Looks fine':(x.status==='block'&&x.hash?'Allow it':'Dismiss'))+'</button></span>';}}],
    items,{sortKey:'ts',empty:'Nothing to review. Every checked site passed.'});}
function loadMod(){return fetch('/admin/moderation').then(function(r){return r.json();}).then(function(j){renderMod(j.items||[],j.aiOn);}).catch(function(){$('modT').innerHTML='<p class="empty down">Could not load the moderation list.</p>';});}
function scanAll(){var b=$('modScan'),m=$('modScanMsg'),checked=0,flagged=0,unchecked=0;b.disabled=true;
  var step=function(cur){m.textContent='Checking… '+checked+' sites so far';fetch('/admin/moderation/scan'+(cur?'?cursor='+encodeURIComponent(cur):''),{method:'POST'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(j){checked+=j.checked||0;flagged+=(j.flagged||[]).length;unchecked+=j.unchecked||0;if(!j.done&&j.cursor)return step(j.cursor);
    b.disabled=false;m.textContent='Done: checked '+checked+' sites, '+flagged+' flagged'+(unchecked?', '+unchecked+' could not be checked by the AI':'')+'.';loadMod();}).catch(function(){b.disabled=false;m.textContent='The check stopped early ('+checked+' sites checked). Run it again to continue.';loadMod();});};
  step('');}
$('modT').addEventListener('click',function(e){var b=e.target.closest('button[data-act]');if(b)doAct(b);});
$('modScan').addEventListener('click',function(){confirmBox('Check every published site now? This reviews each site with the AI and can take a few minutes.','Check all sites',false).then(function(ok){if(ok)scanAll();});});
function loadA(){return fetch('/admin/analytics?days='+S.days+(S.src?'&source='+encodeURIComponent(S.src):'')+(S.cat?'&category='+encodeURIComponent(S.cat):'')).then(function(r){return r.json();}).then(function(j){S.A=j;S.anim=true;renderA();S.anim=false;return !(j&&j.error);}).catch(function(){$('attList').innerHTML='<li class="warn"><span class="tag warn">ERROR</span><span>Could not load analytics &mdash; make sure you are signed in as the owner.</span></li>';});}
function loadD(){return fetch('/admin/data').then(function(r){return r.json();}).then(function(j){S.D=j;renderData();return !(j&&j.error);}).catch(function(){$('custT').innerHTML='<p class="empty down">Could not load &mdash; make sure you are signed in as the owner.</p>';});}
document.addEventListener('click',function(e){var g=e.target.closest('[data-go]');if(g)go(g.getAttribute('data-go'));});
function setDays(n){S.days=n;[].forEach.call($('range').querySelectorAll('button'),function(x){x.setAttribute('aria-pressed',x.getAttribute('data-d')===String(n)?'true':'false');});lsSet('wsAdmDays',String(n));loadA().then(function(ok){if(ok)stamp();});}
$('range').addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)setDays(parseInt(b.getAttribute('data-d'),10));});
$('fSrc').addEventListener('change',function(){S.src=this.value;loadA();});$('fCat').addEventListener('change',function(){S.cat=this.value;loadA();});
function tabs(id,key,fn){$(id).addEventListener('click',function(e){var b=e.target.closest('button[data-k]');if(!b)return;S[key]=b.getAttribute('data-k');[].forEach.call(this.querySelectorAll('button'),function(x){x.setAttribute('aria-selected',x===b?'true':'false');});fn();});}
tabs('acqTabs','acq',renderGrowth);tabs('bizTabs','biz',renderGrowth);
$('custQ').addEventListener('input',renderCustomers);$('custPlan').addEventListener('change',renderCustomers);$('siteQ').addEventListener('input',renderSites);
var _at;$('actSearch').addEventListener('input',function(){clearTimeout(_at);_at=setTimeout(function(){loadActs(false);},300);});$('actType').addEventListener('change',function(){loadActs(false);});$('actMore').addEventListener('click',function(){loadActs(true);});
$('errClear').addEventListener('click',function(){confirmBox('Clear all logged errors? This cannot be undone.','Clear errors',true).then(function(ok){if(ok)req('/admin/errors/clear',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'},'Errors cleared');});});
function stamp(){var d=new Date(),u=$('upd');u.textContent='Updated '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});u.title='Last updated '+d.toLocaleString();}
function refreshAll(say){var b=$('refresh');if(b.getAttribute('aria-busy')==='true')return;b.setAttribute('aria-busy','true');b.disabled=true;var done=function(r){b.removeAttribute('aria-busy');b.disabled=false;var ok=r&&r[0]&&r[1];if(ok)stamp();if(say)toast(ok?'Refreshed':'Could not refresh everything \u2014 please try again',!!ok);};Promise.all([loadA(),loadD(),loadActs(false),loadMod()]).then(done,function(){done(null);});}
$('refresh').addEventListener('click',function(){refreshAll(true);});
window.addEventListener('hashchange',function(){var h=location.hash.slice(1);if(PAGES[h]&&h!==S.page)go(h,true);});
/* ---------- command palette (Ctrl/Cmd+K or /) and "g then letter" page shortcuts ---------- */
var CK={items:[],i:0,last:null};
function cmdItems(q){q=(q||'').toLowerCase().trim();var o=[],m=function(s){return !q||String(s||'').toLowerCase().indexOf(q)>-1;};
  Object.keys(PAGES).forEach(function(p){if(m(PAGES[p])||m('go to '+PAGES[p]))o.push({g:'Pages',ic:p,t:PAGES[p],k:'G '+GK[p].toUpperCase(),run:function(){go(p);}});});
  if(q&&S.D){(S.D.users||[]).filter(function(u){return m(u.email)||m(u.name);}).slice(0,6).forEach(function(u){o.push({g:'Customers',ic:'customers',t:u.email,s:(u.name?u.name+' · ':'')+(u.owner?'owner':u.plan==='pro'?(u.source==='paid'?'paying Pro':'comped Pro'):'free'),run:function(){go('customers');openCustomer(u.email);}});});
    (S.D.published||[]).filter(function(p){return m(p.slug);}).slice(0,6).forEach(function(p){o.push({g:'Sites',ic:'sites',t:p.slug+'.websprout.app',s:num(p.views)+' visits · '+num(p.leads)+' leads',run:function(){go('sites');openSite(p.slug);}});});}
  [['Refresh data','refresh',function(){refreshAll(true);}],['Show the last 7 days','bolt',function(){setDays(7);}],['Show the last 30 days','bolt',function(){setDays(30);}],['Show the last 90 days','bolt',function(){setDays(90);}],['Open the developer panel','bolt',function(){location.href='/dev';}],['Preview re-engagement emails','bolt',function(){window.open('/admin/nudge','_blank','noopener');}]].forEach(function(a){if(m(a[0]))o.push({g:'Actions',ic:a[1],t:a[0],run:a[2]});});
  return o;}
function renderCmd(){var inp=$('cmdIn'),q=inp.value,its=CK.items=cmdItems(q),g='',h='';if(CK.i>=its.length)CK.i=Math.max(0,its.length-1);
  its.forEach(function(it,i){if(it.g!==g){g=it.g;h+='<li class="cmdh" role="presentation">'+g+'</li>';}h+='<li role="option" id="cmdo'+i+'" data-i="'+i+'" aria-selected="'+(i===CK.i?'true':'false')+'"><svg class="ic" aria-hidden="true"><use href="#i-'+it.ic+'"/></svg><span class="ct">'+esc(it.t)+'</span>'+(it.s?'<span class="csub">'+esc(it.s)+'</span>':'')+(it.k?'<kbd>'+it.k+'</kbd>':'')+'</li>';});
  $('cmdList').innerHTML=h||'<li class="cmde" role="presentation">No customers, sites or pages match &ldquo;'+esc(q)+'&rdquo;.</li>';if(its.length)inp.setAttribute('aria-activedescendant','cmdo'+CK.i);else inp.removeAttribute('aria-activedescendant');}
function cmdSel(i){var its=CK.items;if(!its.length)return;CK.i=(i+its.length)%its.length;[].forEach.call($('cmdList').querySelectorAll('[role=option]'),function(li){var on=li.getAttribute('data-i')===String(CK.i);li.setAttribute('aria-selected',on?'true':'false');if(on&&li.scrollIntoView)li.scrollIntoView({block:'nearest'});});$('cmdIn').setAttribute('aria-activedescendant','cmdo'+CK.i);}
function cmdOpen(){var c=$('cmdk');if(!c.hidden)return;CK.last=document.activeElement;closeMenu();c.hidden=false;$('cmdIn').value='';CK.i=0;renderCmd();$('cmdIn').focus();}
function cmdClose(){var c=$('cmdk');if(c.hidden)return;c.hidden=true;if(CK.last&&CK.last.focus)CK.last.focus();CK.last=null;}
function cmdRun(i){var it=CK.items[i];if(!it)return;cmdClose();it.run();}
$('cmdBtn').addEventListener('click',cmdOpen);
$('cmdIn').addEventListener('input',function(){CK.i=0;renderCmd();});
$('cmdIn').addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowDown'){e.preventDefault();cmdSel(CK.i+1);}else if(k==='ArrowUp'){e.preventDefault();cmdSel(CK.i-1);}else if(k==='Home'&&CK.items.length){e.preventDefault();cmdSel(0);}else if(k==='End'&&CK.items.length){e.preventDefault();cmdSel(CK.items.length-1);}else if(k==='Enter'){e.preventDefault();cmdRun(CK.i);}else if(k==='Escape'){e.preventDefault();e.stopPropagation();cmdClose();}else if(k==='Tab'){e.preventDefault();}});
$('cmdk').addEventListener('click',function(e){if(e.target.closest('[data-cmdx]')){cmdClose();return;}var li=e.target.closest('[role=option]');if(li)cmdRun(parseInt(li.getAttribute('data-i'),10));else $('cmdIn').focus();});
$('cmdList').addEventListener('mousemove',function(e){var li=e.target.closest('[role=option]');if(li&&li.getAttribute('aria-selected')!=='true')cmdSel(parseInt(li.getAttribute('data-i'),10));});
if(/Mac|iPhone|iPad/.test(navigator.platform||''))$('cmdKey').textContent='⌘K';
var _gT=0;
document.addEventListener('keydown',function(e){var k=e.key||'';if((e.metaKey||e.ctrlKey)&&!e.altKey&&k.toLowerCase()==='k'){e.preventDefault();if($('cmdk').hidden)cmdOpen();else cmdClose();return;}
  var t=e.target,typing=t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable);if(typing||e.metaKey||e.ctrlKey||e.altKey||!$('cmdk').hidden||$('drawer').classList.contains('on')||document.querySelector('[role=alertdialog]'))return;
  if(k==='/'){e.preventDefault();cmdOpen();return;}
  if(k==='g'||k==='G'){if(Date.now()-_gT<1500){_gT=0;go('growth');}else _gT=Date.now();return;}
  if(Date.now()-_gT<1500){_gT=0;var p=Object.keys(GK).filter(function(x){return GK[x]===k.toLowerCase();})[0];if(p){e.preventDefault();go(p);}}});
(function(){var d=parseInt(lsGet('wsAdmDays'),10);if([7,30,90].indexOf(d)>-1){S.days=d;[].forEach.call($('range').querySelectorAll('button'),function(x){x.setAttribute('aria-pressed',x.getAttribute('data-d')===String(d)?'true':'false');});}var h=location.hash.slice(1);go(PAGES[h]?h:(lsGet('wsAdmPage')||'overview'),true);})();
refreshAll(false);
</script></body></html>`;


// ── Re-engagement: one-time "you built but didn't publish" nudge ──
async function nudgeToken(email, env){
  const secret = wsSecret(env);
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode('nudge:' + String(email||'').toLowerCase()));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(sig))).replace(/[^A-Za-z0-9]/g,'').slice(0,20);
}
async function sendNudgeEmail(env, to, siteName, token){
  const optout = 'https://websprout.app/email-optout?e=' + encodeURIComponent(to) + '&t=' + encodeURIComponent(token);
  const nm = siteName ? escHtml(siteName) : 'Your website';
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto">'
    + '<div style="background:#0f1a0d;padding:24px;text-align:center"><span style="color:#fff;font-size:20px;font-weight:800">🌱 Websprout</span></div>'
    + '<div style="padding:28px 26px">'
    + '<h1 style="color:#0f1a0d;font-size:21px;font-weight:800;margin:0 0 10px;letter-spacing:-.5px">' + nm + ' is still saved — and one click from live</h1>'
    + '<p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 18px">You built a site on Websprout but never published it. It is saved to your account, exactly where you left it. Publishing is free — you pick a free address like <strong>yourname.websprout.app</strong> and you are live in seconds.</p>'
    + '<div style="text-align:center;margin:22px 0"><a href="https://websprout.app/?utm_source=nudge&utm_medium=email" style="display:inline-block;background:#2d7a3a;color:#fff;padding:13px 30px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">Open my site →</a></div>'
    + '<p style="color:#888;font-size:13px;margin:0">Sign in with this email address, then open <strong>Settings → My sites</strong>.</p>'
    + '</div>'
    + wsMailFooter(env, 'You are receiving this one-time reminder because you built a site on <a href="https://websprout.app" style="color:#2d7a3a">Websprout</a>.', optout)
    + '</div>';
  const r = await wsResend(env, { method:'POST', headers:{ 'Authorization':'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[to], subject:'Your website is saved — publish it free in one click', html: html, headers: wsUnsubHeaders(optout) }) });
  return r && r.ok;
}
async function runNudges(env, dry){
  const out = { candidates:[], sent:0, skipped:0, errors:0 };
  try{
    if(!env || !env.KV) return out;
    if(!dry && !env.RESEND_API_KEY){ out.errors++; return out; }
    // Reminder emails need a mailing address in the footer (CAN-SPAM): paused until POSTAL_ADDRESS is set.
    if(!dry && !wsPostalAddress(env)){ out.paused = 'Set POSTAL_ADDRESS (or WS_POSTAL_ADDRESS in 00-header.js) to send reminder emails.'; return out; }
    const cutoffNew = Date.now() - 48*3600*1000;
    const cutoffOld = Date.now() - 30*86400000;
    let cursor, guard=0;
    do{
      const r = await env.KV.list({ prefix:'user:', cursor, limit:1000 });
      for(const k of r.keys){
        if(out.sent >= 20) break;
        const eml = k.name.slice(5);
        if(!eml || eml.indexOf('@') < 1) continue;
        try{
          if(await env.KV.get('nudged:'+eml)){ out.skipped++; continue; }
          if(await env.KV.get('emailoptout:'+eml)){ out.skipped++; continue; }
          let list=[]; try{ list=JSON.parse((await env.KV.get('usersites:'+eml))||'[]'); }catch(e){}
          if(!list.length){ try{ const u=JSON.parse((await env.KV.get(k.name))||'{}'); if(u.email && u.email!==eml){ list=JSON.parse((await env.KV.get('usersites:'+u.email))||'[]'); } }catch(e){} }
          if(!list.length) continue;
          let unpub=null, anyPub=false;
          for(const it of list){
            const sid = it && it.siteId; if(!sid) continue;
            const slug = await env.KV.get('slugof:'+sid);
            if(slug){ anyPub=true; break; }
            const ts = (it.ts||0);
            if(ts && ts < cutoffNew && ts > cutoffOld && !unpub) unpub = it;
          }
          if(anyPub || !unpub) continue;
          out.candidates.push({ email: eml, site: unpub.name||unpub.siteId, savedAt: unpub.ts });
          if(!dry){
            const tok = await nudgeToken(eml, env);
            const ok = await sendNudgeEmail(env, eml, unpub.name||'', tok);
            if(ok){ out.sent++; await env.KV.put('nudged:'+eml, String(Date.now())); await wsMailCount(env, 'nudge'); }
            else out.errors++;
          }
        }catch(e){ out.errors++; }
      }
      cursor = r.list_complete ? null : r.cursor; guard++;
    } while(cursor && guard<5 && out.sent<20);
  }catch(e){ out.errors++; }
  return out;
}
async function doEmailOptout(request, env){
  const u = new URL(request.url);
  const e = (u.searchParams.get('e')||'').toLowerCase().trim();
  const t = u.searchParams.get('t')||'';
  const page = function(msg){ return new Response('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email preferences</title></head><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#eaf2e8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center"><div style="max-width:420px;padding:24px"><div style="font-size:36px;margin-bottom:10px">🌱</div><p style="line-height:1.7">'+msg+'</p><p style="margin-top:14px"><a href="/" style="color:#4ade80;font-weight:700;text-decoration:none">Back to Websprout</a></p></div></body></html>', { headers:{ 'Content-Type':'text/html; charset=utf-8' } }); };
  if(!e || !t || !env.KV) return page('That unsubscribe link is not valid.');
  const expect = await nudgeToken(e, env);
  if(!wsSafeEq(t, expect)) return page('That unsubscribe link is not valid.');
  await env.KV.put('emailoptout:'+e, String(Date.now()));
  if(request.method === 'POST') return new Response('ok', { headers:{ 'Content-Type':'text/plain' } });
  return page('Done — <strong>'+escHtml(e)+'</strong> will not receive reminder or weekly summary emails from Websprout.');
}
async function doAdminNudge(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  const dry = new URL(request.url).searchParams.get('dry') !== '0';
  const res = await runNudges(env, dry);
  return new Response(JSON.stringify({ dryRun: dry, hint: dry ? 'Add ?dry=0 to actually send.' : 'Emails sent.', result: res }, null, 2), { headers:{ 'Content-Type':'application/json' } });
}
// ── Analytics: Cloudflare D1 (env.DB), cookieless, first-party only ──
// Visitor = HMAC(secret + daily random salt, IP|user-agent), truncated. The salt lives in KV for two days and is then
// gone, so yesterday's hashes can never be recomputed or linked to today's (the Plausible approach). Signed-in owners
// are identified by email only. No cookies, no third parties. Without a DB binding, events go to the old KV log.
const WS_PRO_PRICE = 10; // USD per month: the Pro subscription (see 00-header.js and the pricing copy)
function wsProPrice(env){ const n = parseFloat(env && env.PRO_PRICE_USD); return isFinite(n) && n > 0 ? n : WS_PRO_PRICE; }
const WS_RETENTION_DAYS = 400;
const WS_SCHEMA = [
  'CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL, type TEXT NOT NULL, visitor TEXT, session TEXT, email TEXT, site_id TEXT, biz_type TEXT, category TEXT, source TEXT, medium TEXT, campaign TEXT, landing TEXT, referrer TEXT, country TEXT, device TEXT, props TEXT)',
  'CREATE INDEX IF NOT EXISTS ev_day_type ON events(day, type)',
  'CREATE INDEX IF NOT EXISTS ev_visitor ON events(visitor, day)',
  'CREATE INDEX IF NOT EXISTS ev_site ON events(site_id, type)',
  'CREATE INDEX IF NOT EXISTS ev_email ON events(email, day) WHERE email IS NOT NULL',
  'CREATE TABLE IF NOT EXISTS sites (site_id TEXT PRIMARY KEY, created_ts INTEGER, legacy INTEGER DEFAULT 0, email TEXT, biz_type TEXT, category TEXT, look TEXT, google INTEGER DEFAULT 0, shop INTEGER DEFAULT 0, gen_ms INTEGER, source TEXT, medium TEXT, campaign TEXT, landing TEXT, country TEXT, device TEXT, first_edit_ts INTEGER, account_ts INTEGER, published_ts INTEGER, pro_ts INTEGER, slug TEXT)',
  'CREATE INDEX IF NOT EXISTS sites_created ON sites(created_ts)',
  'CREATE INDEX IF NOT EXISTS sites_email ON sites(email) WHERE email IS NOT NULL',
  'CREATE TABLE IF NOT EXISTS activity (k TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY (k, day)) WITHOUT ROWID',
  "CREATE TABLE IF NOT EXISTS daily (metric TEXT NOT NULL, dim TEXT NOT NULL DEFAULT '', day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (metric, dim, day)) WITHOUT ROWID"
];
// Request -> ctx, so logging can run after the response (ctx.waitUntil) without threading ctx through every handler.
const _wsCtx = new WeakMap();
function wsBg(request, p){ p = Promise.resolve(p).catch(function(){}); const c = request && _wsCtx.get(request); if (c && c.waitUntil) { try { c.waitUntil(p); return Promise.resolve(); } catch(e){} } return p; }
let _wsDbReady = null;
function wsDb(env){
  if (!env || !env.DB) return Promise.resolve(null);
  if (!_wsDbReady) _wsDbReady = env.DB.batch(WS_SCHEMA.map(function(s){ return env.DB.prepare(s); })).catch(function(e){ _wsDbReady = null; throw e; });
  return _wsDbReady.then(function(){ return env.DB; });
}
function wsDay(ts){ return new Date(ts).toISOString().slice(0, 10); }
const _wsHk = {};
async function wsHmac(secret, msg){
  const enc = new TextEncoder();
  let k = _wsHk[secret]; if (!k) k = _wsHk[secret] = await crypto.subtle.importKey('raw', enc.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, enc.encode(msg));
  return [...new Uint8Array(s)].slice(0, 8).map(function(b){ return b.toString(16).padStart(2, '0'); }).join('');
}
const _wsSalt = {};
async function wsDailySalt(env, day){
  if (_wsSalt[day]) return _wsSalt[day];
  let s = '';
  try { if (env.KV) { s = (await env.KV.get('asalt:' + day)) || ''; if (!s) { s = randToken(16); await env.KV.put('asalt:' + day, s, { expirationTtl: 2 * 86400 }); } } } catch(e){ s = ''; }
  if (!s) s = 'nokv'; for (const d in _wsSalt) delete _wsSalt[d]; _wsSalt[day] = s; return s;
}
async function wsVisitor(request, env, day){
  const ip = request.headers.get('cf-connecting-ip') || '', ua = request.headers.get('user-agent') || '';
  if (!ip && !ua) return null;
  return wsHmac((env.ANALYTICS_SECRET || env.IP_SALT || env.FORM_SECRET || '') + '|' + (await wsDailySalt(env, day)), day + '|' + ip + '|' + ua);
}
function wsIsBot(ua){ return !ua || /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|curl|wget|python|httpclient|java\/|go-http|okhttp|axios|node-fetch|undici|^node$|monitor|uptime|scan/i.test(ua); }
function wsDevice(ua){ ua = ua || ''; return /iPad|Tablet|Android(?!.*Mobi)/i.test(ua) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'mobile' : 'desktop'; }
function wsLandingPath(p){ p = String(p || '/'); if (p === '/' || !p) return '/'; const m = p.match(/^\/for\/([a-z0-9-]{1,40})/); if (m) return '/for/' + m[1]; if (/^\/example/.test(p)) return '/example'; return p.slice(0, 40); }
const WS_REFS = [[/(^|\.)gemini\.google\.com$/, 'gemini', 'ai'], [/(^|\.)google\.[a-z.]+$/, 'google', 'organic'], [/(^|\.)bing\.com$/, 'bing', 'organic'], [/duckduckgo\.com$/, 'duckduckgo', 'organic'], [/(^|\.)yahoo\.[a-z.]+$/, 'yahoo', 'organic'], [/(^|\.)(ecosia\.org|brave\.com)$/, 'search', 'organic'], [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, 'facebook', 'social'], [/(^|\.)instagram\.com$/, 'instagram', 'social'], [/(^|\.)(t\.co|twitter\.com|x\.com)$/, 'x', 'social'], [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin', 'social'], [/(^|\.)reddit\.com$/, 'reddit', 'social'], [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube', 'social'], [/(^|\.)tiktok\.com$/, 'tiktok', 'social'], [/(^|\.)pinterest\.[a-z.]+$/, 'pinterest', 'social'], [/(^|\.)nextdoor\.com$/, 'nextdoor', 'social'], [/(^|\.)(chatgpt\.com|openai\.com)$/, 'chatgpt', 'ai'], [/(^|\.)perplexity\.ai$/, 'perplexity', 'ai'], [/(^|\.)claude\.ai$/, 'claude', 'ai'], [/(^|\.)copilot\.microsoft\.com$/, 'copilot', 'ai']];
// Source / medium / campaign from UTM tags, ad click ids, the referrer host, or in-app browsers. internal = came from our own pages.
function wsAttribution(urlStr, refStr, ua){
  const cl = function(s){ return s ? String(s).toLowerCase().trim().replace(/[^a-z0-9 ._\/+-]/g, '').slice(0, 40) || null : null; };
  const o = { source:null, medium:null, campaign:null, ref:null, landing:null, internal:false };
  let u = null; try { u = new URL(urlStr); } catch(e){}
  if (u) {
    o.landing = wsLandingPath(u.pathname); const q = u.searchParams;
    o.campaign = cl(q.get('utm_campaign'));
    if (q.get('utm_source')) { o.source = cl(q.get('utm_source')); o.medium = cl(q.get('utm_medium')) || '(none)'; }
    else if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) { o.source = 'google'; o.medium = 'cpc'; }
    else if (q.get('msclkid')) { o.source = 'bing'; o.medium = 'cpc'; }
    else if (q.get('ttclid')) { o.source = 'tiktok'; o.medium = 'paid'; }
    else if (q.get('fbclid')) { o.source = /Instagram/i.test(ua || '') ? 'instagram' : 'facebook'; o.medium = 'social'; }
  }
  let h = ''; try { h = new URL(refStr).hostname.toLowerCase().replace(/^www\./, ''); } catch(e){}
  if (h && (/(^|\.)websprout\.app$/.test(h) || (u && h === u.hostname.replace(/^www\./, '')))) { h = ''; if (!o.source) o.internal = true; }
  o.ref = h ? h.slice(0, 60) : null;
  if (!o.source && h) { const m = WS_REFS.find(function(r){ return r[0].test(h); }); if (m) { o.source = m[1]; o.medium = m[2]; } else { o.source = h.slice(0, 40); o.medium = 'referral'; } }
  if (!o.source && !o.internal) { if (/Instagram/i.test(ua || '')) { o.source = 'instagram'; o.medium = 'social'; } else if (/FBAN|FBAV|FB_IAB/i.test(ua || '')) { o.source = 'facebook'; o.medium = 'social'; } }
  if (!o.source && !o.internal) { o.source = 'direct'; o.medium = '(none)'; }
  return o;
}
// Counters that do not need a row per hit (published-site views, API calls, emails): one upsert per (metric, dim, day).
function wsCount(env, metric, dim, request, by){
  if (!env || !env.DB) return Promise.resolve();
  const job = wsDb(env).then(function(db){ if (!db) return; return db.prepare('INSERT INTO daily (metric, dim, day, n) VALUES (?, ?, ?, ?) ON CONFLICT (metric, dim, day) DO UPDATE SET n = n + excluded.n').bind(String(metric).slice(0, 40), String(dim || '').slice(0, 80), wsDay(Date.now()), by || 1).run(); });
  return request ? wsBg(request, job) : job.catch(function(){});
}
function wsMailCount(env, kind){ return wsCount(env, 'email', kind || 'other'); }
function wsHour(){ return new Date().toISOString().slice(11, 13); }
const WS_SITE_RE = /^[A-Za-z0-9_-]{4,40}$/;
async function wsWriteEvent(request, env, type, x){
  const db = await wsDb(env); if (!db) return;
  const ts = x.ts || Date.now(), day = wsDay(ts);
  const ua = request ? (request.headers.get('user-agent') || '') : '';
  const cf = (request && request.cf) || {};
  const server = !!x.server || !request, anon = server || !!x.anon;
  const visitor = anon ? null : await wsVisitor(request, env, day);
  const att = (x.url !== undefined || x.ref !== undefined) ? wsAttribution(x.url, x.ref, ua) : null;
  let last = null, first = null, session = null;
  if (visitor) {
    const rs = await db.batch([db.prepare('SELECT session, ts FROM events WHERE visitor = ? AND day = ? ORDER BY id DESC LIMIT 1').bind(visitor, day), db.prepare('SELECT source, medium, campaign, landing, referrer FROM events WHERE visitor = ? AND day = ? AND source IS NOT NULL ORDER BY id LIMIT 1').bind(visitor, day)]);
    last = (rs[0].results || [])[0] || null; first = (rs[1].results || [])[0] || null;
    const live = last && ts - last.ts < 30 * 60000;
    // One landing per visit: page reloads and in-app navigation within a session are not new visits (a new ad click is).
    if ((type === 'landing' || type === 'visit') && (live || (att && att.internal)) && !(att && att.campaign && att.campaign !== (first && first.campaign))) return;
    session = live ? last.session : visitor.slice(0, 6) + ts.toString(36);
  }
  const a = (att && att.source && (type === 'landing' || type === 'visit' || !first)) ? { source:att.source, medium:att.medium, campaign:att.campaign, landing:att.landing, referrer:att.ref } : (first || {});
  const email = x.email ? String(x.email).toLowerCase().trim().slice(0, 120) : null;
  let site = x.site && WS_SITE_RE.test(String(x.site)) ? String(x.site) : null;
  if (type === 'first_edit' && visitor) {
    // The editor names the site when it can; otherwise it is the site this visitor generated today.
    if (site) { const ok = await db.prepare('SELECT 1 FROM sites WHERE site_id = ?').bind(site).first(); if (!ok) site = null; }
    if (!site) { const g = await db.prepare("SELECT site_id FROM events WHERE visitor = ? AND day = ? AND type = 'generate' ORDER BY id DESC LIMIT 1").bind(visitor, day).first(); site = g ? g.site_id : null; }
  }
  if (x.dedupe) { const d = await db.prepare("SELECT 1 FROM events WHERE day >= ? AND type = ? AND json_extract(props, '$.eid') = ?").bind(wsDay(ts - 3 * 86400000), type, String(x.dedupe)).first(); if (d) return; }
  const props = Object.assign({}, x.props || {}); if (x.dedupe) props.eid = String(x.dedupe).slice(0, 80);
  if (!server && ua) props.ua = uaShort(ua);
  const pj = JSON.stringify(props);
  const country = server ? null : (String(cf.country || '').slice(0, 4) || null), device = server ? null : wsDevice(ua);
  const st = [db.prepare('INSERT INTO events (ts, day, type, visitor, session, email, site_id, biz_type, category, source, medium, campaign, landing, referrer, country, device, props) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(ts, day, String(type).slice(0, 24), visitor, session, email, site, x.bizType ? String(x.bizType).toLowerCase().trim().slice(0, 60) : null, x.category ? String(x.category).slice(0, 24) : null, a.source || null, a.medium || null, a.campaign || null, a.landing || null, a.referrer || null, country, device, pj.length > 2 ? pj.slice(0, 1000) : null)];
  if (type === 'generate' && site) st.push(db.prepare('INSERT OR IGNORE INTO sites (site_id, created_ts, email, account_ts, biz_type, category, look, google, shop, gen_ms, source, medium, campaign, landing, country, device) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(site, ts, email, email ? ts : null, x.bizType ? String(x.bizType).toLowerCase().trim().slice(0, 60) : null, x.category || null, props.look || null, props.google ? 1 : 0, props.shop ? 1 : 0, props.ms || null, a.source || null, a.medium || null, a.campaign || null, a.landing || null, country, device));
  if (type === 'first_edit' && site) st.push(db.prepare('UPDATE sites SET first_edit_ts = COALESCE(first_edit_ts, ?) WHERE site_id = ?').bind(ts, site));
  if (type === 'publish' && site) st.push(db.prepare('INSERT INTO sites (site_id, legacy, published_ts, slug, email, account_ts) VALUES (?, 1, ?, ?, ?, ?) ON CONFLICT (site_id) DO UPDATE SET published_ts = COALESCE(sites.published_ts, excluded.published_ts), slug = excluded.slug, email = COALESCE(sites.email, excluded.email), account_ts = COALESCE(sites.account_ts, excluded.account_ts)').bind(site, ts, props.slug || null, email, email ? ts : null));
  if (type === 'pro_start' && email) st.push(db.prepare('UPDATE sites SET pro_ts = COALESCE(pro_ts, ?) WHERE email = ?').bind(ts, email));
  if ((type === 'login' || type === 'signup' || type === 'publish') && email) st.push(db.prepare('INSERT OR IGNORE INTO activity (k, day) VALUES (?, ?)').bind('u:' + email, day));
  if (type === 'publish' && site) st.push(db.prepare('INSERT OR IGNORE INTO activity (k, day) VALUES (?, ?)').bind('s:' + site, day));
  await db.batch(st);
}
// KV fallback (no D1 binding): the original event log, unchanged.
async function hashIP(ip, env){
  try{
    const salt = (env && (env.IP_SALT || env.FORM_SECRET)) || '';
    if (!salt) return '';
    const buf = new TextEncoder().encode(salt + '|' + (ip||''));
    const d = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(d)].map(function(b){return b.toString(16).padStart(2,'0');}).join('').slice(0,16);
  }catch(e){ return ''; }
}
function uaShort(ua){
  ua = ua || '';
  var os = /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Mac OS X|Macintosh/i.test(ua) ? 'Mac' : /Windows/i.test(ua) ? 'Windows' : /Linux/i.test(ua) ? 'Linux' : '';
  var br = /Instagram/i.test(ua) ? 'Instagram' : /FBAN|FBAV|FB_IAB/i.test(ua) ? 'Facebook' : /Edg\//i.test(ua) ? 'Edge' : /Chrome/i.test(ua) ? 'Chrome' : /Firefox/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : '';
  return [br, os].filter(Boolean).join(' / ');
}
function deriveSource(url, ref){
  try{ if(url){ var u=new URL(url); var sc=u.searchParams.get('utm_source'); var md=u.searchParams.get('utm_medium'); if(sc) return (sc + (md ? ('/'+md) : '')).slice(0,40); if(u.searchParams.get('fbclid')) return 'facebook/ad'; } }catch(e){}
  try{ if(ref){ var h=new URL(ref).hostname.replace(/^www\./,''); if(h) return h.slice(0,40); } }catch(e){}
  return 'direct';
}
async function logEventKV(request, env, type, extra){
  try{
    if(!env || !env.KV || !request) return;
    const cf = request.cf || {};
    const iph = await hashIP(request.headers.get('cf-connecting-ip') || '', env);
    const src = extra.src || ((extra.url || extra.ref) ? deriveSource(extra.url, extra.ref) : '');
    const ev = { t:String(type||'event').slice(0,24), ts:Date.now(), iph:iph, country:(cf.country||'').slice(0,4), region:(cf.region||'').slice(0,40), city:(cf.city||'').slice(0,60), email:extra.email?String(extra.email).toLowerCase().trim().slice(0,120):'', src:src?String(src).slice(0,40):'', ref:extra.ref?String(extra.ref).slice(0,300):'', device:uaShort(request.headers.get('user-agent')||'') };
    const key = 'evt:' + ev.ts + ':' + Math.random().toString(36).slice(2,8);
    const meta = { t:ev.t, ts:ev.ts, c:ev.country, ci:ev.city, e:ev.email, s:ev.src, d:ev.device, ih:String(iph||'').slice(0,16) };
    await env.KV.put(key, JSON.stringify(ev), { expirationTtl: 60*60*24*60, metadata: meta });
  }catch(e){}
}
// logEvent(request, env, type, { email, site, bizType, category, props, url, ref, anon, server, dedupe })
// With D1 the write runs after the response (ctx.waitUntil); browser-only types skip bots.
async function logEvent(request, env, type, extra){
  try{
    if (!env) return;
    extra = extra || {};
    if (request && (type === 'landing' || type === 'visit' || type === 'setup_start') && wsIsBot(request.headers.get('user-agent') || '')) return;
    if (!env.DB) { if (type === 'landing') return; return logEventKV(request, env, type, extra); }
    return wsBg(request, wsWriteEvent(request, env, type, extra));
  }catch(e){}
}
// Landing pages are logged server-side (top-level navigations only, never internal clicks), so /for/<niche> pages count too.
function wsMaybeLanding(request, env, url){
  try{
    if (!env || !env.DB || request.method !== 'GET') return;
    const p = url.pathname; if (!(p === '/' || p === '/example' || /^\/for\/[a-z0-9-]+\/?$/.test(p))) return;
    const h = request.headers, dest = h.get('sec-fetch-dest');
    if (dest ? dest !== 'document' : (h.get('accept') || '').indexOf('text/html') < 0) return;
    logEvent(request, env, 'landing', { url: request.url, ref: h.get('referer') || '' });
  }catch(e){}
}
// A signed-in save/claim ties sites to the owner; activity rows (one per key per day) drive retention and "sites updated".
function wsTouchSites(request, env, email, siteIds){
  if (!env || !env.DB) return Promise.resolve();
  return wsBg(request, (async function(){
    const db = await wsDb(env); if (!db) return; const ts = Date.now(), day = wsDay(ts), st = [];
    (siteIds || []).filter(function(s){ return WS_SITE_RE.test(String(s || '')); }).slice(0, 100).forEach(function(s){
      st.push(db.prepare('INSERT OR IGNORE INTO activity (k, day) VALUES (?, ?)').bind('s:' + s, day));
      if (email) st.push(db.prepare('INSERT INTO sites (site_id, legacy, email, account_ts) VALUES (?, 1, ?, ?) ON CONFLICT (site_id) DO UPDATE SET email = COALESCE(sites.email, excluded.email), account_ts = COALESCE(sites.account_ts, excluded.account_ts) WHERE sites.email IS NULL').bind(s, String(email).toLowerCase(), ts));
    });
    if (email) st.push(db.prepare('INSERT OR IGNORE INTO activity (k, day) VALUES (?, ?)').bind('u:' + String(email).toLowerCase(), day));
    if (st.length) await db.batch(st);
  })());
}
// Published-site views: D1 counter rows plus whatever the old KV counters hold (kept read-only).
async function wsSiteViews(env, site, ndays){
  const now = Date.now(), byDay = {}; let total = 0;
  try { total = parseInt((env.KV && await env.KV.get('views:' + site + ':total')) || '0', 10) || 0; } catch(e){}
  try { const db = await wsDb(env); if (db) { const r = await db.prepare("SELECT day, n FROM daily WHERE metric = 'site_views' AND dim = ?").bind(site).all(); (r.results || []).forEach(function(x){ total += x.n; byDay[x.day.replace(/-/g, '')] = x.n; }); } } catch(e){}
  const days = [];
  for (let i = (ndays || 7) - 1; i >= 0; i--) {
    const ds = new Date(now - i * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    let c = byDay[ds] || 0; try { if (env.KV) c += parseInt((await env.KV.get('views:' + site + ':' + ds)) || '0', 10) || 0; } catch(e){}
    days.push({ d: ds, c: c });
  }
  return { total: total, days: days };
}
// Daily job: roll raw events up into `daily` (kept forever), snapshot MRR, drop raw events older than ~400 days.
async function runAnalyticsDaily(env, nowTs){
  const now = nowTs || Date.now(), out = { rolled:0, deleted:0, activityDeleted:0, mrr:null };
  try { if (env.KV) await env.KV.put('cron:last', String(Date.now())); } catch(e){}
  const db = await wsDb(env).catch(function(){ return null; }); if (!db) return out;
  const cutoff = wsDay(now - WS_RETENTION_DAYS * 86400000);
  try {
    const old = await db.prepare('SELECT DISTINCT day FROM events WHERE day < ? ORDER BY day LIMIT 90').bind(cutoff).all();
    const days = [wsDay(now - 86400000), wsDay(now - 2 * 86400000)].concat((old.results || []).map(function(r){ return r.day; }));
    for (const d of days) {
      await db.batch([
        db.prepare("INSERT OR REPLACE INTO daily (metric, dim, day, n) SELECT 'ev:' || type, '', day, COUNT(*) FROM events WHERE day = ? GROUP BY type").bind(d),
        db.prepare("INSERT OR REPLACE INTO daily (metric, dim, day, n) SELECT 'visitors', '', ?, COUNT(DISTINCT visitor) FROM events WHERE day = ? AND type IN ('landing', 'visit') HAVING COUNT(*) > 0").bind(d, d)
      ]); out.rolled++;
    }
  } catch(e){ out.error = String(e && e.message || e); }
  try { const u = await wsUserSnapshot(env, true); const day = wsDay(now); out.mrr = u.mrr; await db.batch([db.prepare("INSERT OR REPLACE INTO daily (metric, dim, day, n) VALUES ('mrr', '', ?, ?)").bind(day, u.mrr), db.prepare("INSERT OR REPLACE INTO daily (metric, dim, day, n) VALUES ('paid_pro', '', ?, ?)").bind(day, u.paid)]); } catch(e){}
  try {
    for (let i = 0; i < 40; i++) { const r = await db.prepare('DELETE FROM events WHERE id IN (SELECT id FROM events WHERE day < ? LIMIT 5000)').bind(cutoff).run(); const n = (r.meta && r.meta.changes) || 0; out.deleted += n; if (n < 5000) break; }
    const r2 = await db.prepare('DELETE FROM activity WHERE day < ?').bind(cutoff).run(); out.activityDeleted = (r2.meta && r2.meta.changes) || 0;
  } catch(e){ out.error = String(e && e.message || e); }
  return out;
}
// Accounts from KV (plan, paid vs comped), cached for a minute so the dashboard's two endpoints share one scan.
let _wsUsers = null;
async function wsUserSnapshot(env, fresh){
  if (!fresh && _wsUsers && Date.now() - _wsUsers.at < 60000) return _wsUsers;
  const users = []; let cursor, guard = 0;
  if (env.KV) do {
    const r = await env.KV.list({ prefix:'user:', cursor, limit:1000 });
    for (const k of r.keys) { try { const u = JSON.parse(await env.KV.get(k.name) || '{}'); const em = (u.email || k.name.slice(5)).toLowerCase(); const src = (u.plan === 'pro') ? (u.proSource || (u.stripeCustomer ? 'paid' : 'comp')) : ''; users.push({ email:em, name:u.name || '', plan:u.plan || 'free', created:u.created || 0, source:src, owner: em === SUPPORT_EMAIL.toLowerCase(), dev:!!u.dev, planUpdated:u.planUpdated || 0 }); } catch(e){} }
    cursor = r.list_complete ? null : r.cursor; guard++;
  } while (cursor && guard < 10);
  const paid = users.filter(function(u){ return u.plan === 'pro' && u.source === 'paid' && !u.owner; }).length;
  _wsUsers = { at: Date.now(), users: users, paid: paid, mrr: paid * wsProPrice(env) };
  return _wsUsers;
}
async function wsIsAdmin(request, env){ const s = await getSession(request, env); return !!(s && (s.email || '').toLowerCase() === SUPPORT_EMAIL.toLowerCase()); }
function wsDenied(){ return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json', 'Cache-Control':'no-store' } }); }

// ── Dashboard numbers. The SQL returns small grouped results; wsAssemble (pure, unit-tested) does the maths. ──
async function wsAnalyticsRaw(env, q){
  const db = await wsDb(env);
  const days = [7, 30, 90].indexOf(q.days) > -1 ? q.days : 30;
  const endTs = q.end ? Date.parse(q.end + 'T23:59:59.999Z') : Date.now();
  const D = function(n){ return wsDay(endTs - n * 86400000); };
  const r = { days: days, S: D(days - 1), E: D(0), PS: D(2 * days - 1), PE: D(days), endTs: endTs };
  const sTs = Date.parse(r.PS + 'T00:00:00Z');
  const run = function(sql){ const st = db.prepare(sql); return st.bind.apply(st, [].slice.call(arguments, 1)).all().then(function(x){ return x.results || []; }); };
  const cohortFrom = D(7 * 10);
  const res = await Promise.all([
    run('SELECT day, type, COUNT(*) n FROM events WHERE day BETWEEN ? AND ? GROUP BY day, type', r.PS, r.E),
    run("SELECT day, COUNT(DISTINCT visitor) v FROM events WHERE day BETWEEN ? AND ? AND type IN ('landing', 'visit') GROUP BY day", r.PS, r.E),
    run('SELECT site_id, created_ts, biz_type, category, look, google, shop, gen_ms, source, medium, campaign, landing, device, first_edit_ts, account_ts, published_ts, pro_ts FROM sites WHERE created_ts >= ? AND created_ts <= ?', sTs, endTs),
    run("SELECT COALESCE(source, 'direct') source, COALESCE(medium, '') medium, COALESCE(campaign, '') campaign, COALESCE(landing, '/') landing, COUNT(DISTINCT visitor) v FROM events WHERE day BETWEEN ? AND ? AND type IN ('landing', 'visit') GROUP BY 1, 2, 3, 4", r.S, r.E),
    run("SELECT COALESCE(source, 'direct') source, COUNT(DISTINCT visitor) v FROM events WHERE day BETWEEN ? AND ? AND type = 'setup_start' GROUP BY 1", r.S, r.E),
    run("SELECT json_extract(props, '$.err') err, COUNT(*) n FROM events WHERE day BETWEEN ? AND ? AND type = 'generate_fail' GROUP BY 1 ORDER BY n DESC LIMIT 8", r.S, r.E),
    run("SELECT props FROM events WHERE day BETWEEN ? AND ? AND type = 'launch_check' ORDER BY id DESC LIMIT 2000", r.S, r.E),
    run("SELECT COUNT(*) n, COALESCE(SUM(json_extract(props, '$.amount')), 0) amount, COALESCE(SUM(json_extract(props, '$.fee')), 0) fee FROM events WHERE day BETWEEN ? AND ? AND type = 'store_checkout'", r.S, r.E),
    run("SELECT e.site_id, COUNT(*) n, s.slug FROM events e LEFT JOIN sites s ON s.site_id = e.site_id WHERE e.day BETWEEN ? AND ? AND e.type = 'lead' GROUP BY e.site_id ORDER BY n DESC LIMIT 300", r.S, r.E),
    run("SELECT d.dim site_id, SUM(d.n) n, s.slug FROM daily d LEFT JOIN sites s ON s.site_id = d.dim WHERE d.metric = 'site_views' AND d.day BETWEEN ? AND ? GROUP BY d.dim ORDER BY n DESC LIMIT 300", r.S, r.E),
    run("SELECT day, metric, n FROM daily WHERE metric IN ('mrr', 'paid_pro') AND dim = '' AND day BETWEEN ? AND ?", r.PS, r.E),
    run("SELECT COUNT(DISTINCT CASE WHEN day >= ? THEN k END) s7, COUNT(DISTINCT k) s30 FROM activity WHERE k >= 's:' AND k < 's;' AND day >= ? AND day <= ?", D(6), D(29), r.E),
    run("SELECT COUNT(DISTINCT k) owners, COUNT(*) ownerDays FROM activity WHERE k >= 'u:' AND k < 'u;' AND day BETWEEN ? AND ?", r.S, r.E),
    run("SELECT s.email, s.day sday, a.day aday FROM (SELECT email, MIN(day) day FROM events WHERE type = 'signup' AND email IS NOT NULL AND day >= ? AND day <= ? GROUP BY email) s LEFT JOIN activity a ON a.k = 'u:' || s.email AND a.day > s.day", cohortFrom, r.E),
    run("SELECT metric, dim, day, SUM(n) n FROM daily WHERE ((metric = 'email' OR metric = 'places') AND day >= ?) OR (metric IN ('unsplash', 'unsplash_gen') AND day >= ?) GROUP BY metric, dim, day", r.S < r.E.slice(0, 8) + '01' ? r.S : r.E.slice(0, 8) + '01', D(1)),
    run("SELECT COALESCE(source, 'direct') source, COUNT(*) n FROM events WHERE day BETWEEN ? AND ? AND type = 'pro_start' GROUP BY 1", r.S, r.E),
    // First publishes per day (a site counts once, on the day it first went live), whenever the site was created.
    run("SELECT strftime('%Y-%m-%d', published_ts / 1000, 'unixepoch') day, COUNT(*) n FROM sites WHERE published_ts >= ? AND published_ts <= ? GROUP BY 1", Date.parse(r.S + 'T00:00:00Z'), endTs)
  ]);
  ['events', 'visitors', 'sites', 'acq', 'setup', 'fails', 'launch', 'store', 'leadsBySite', 'viewsBySite', 'snaps', 'sitesActive', 'owners', 'cohort', 'counters', 'proBySource', 'pubDays'].forEach(function(k, i){ r[k] = res[i]; });
  r.hasSetupHook = !!(await db.prepare("SELECT 1 FROM events WHERE type = 'setup_start' LIMIT 1").first());
  return r;
}
// Pure: raw query results (+ users, costs) -> every dashboard section. No I/O, so tests can call it on seeded rows.
function wsAssemble(r, opt){
  opt = opt || {};
  const DAY = 86400000, pct = function(a, b){ return b ? Math.round(a / b * 1000) / 10 : 0; };
  const dayList = function(from, n){ const o = []; const t = Date.parse(from + 'T00:00:00Z'); for (let i = 0; i < n; i++) o.push(new Date(t + i * DAY).toISOString().slice(0, 10)); return o; };
  const cur = dayList(r.S, r.days), prev = dayList(r.PS, r.days);
  const inCur = function(d){ return d >= r.S && d <= r.E; };
  const ev = Object.create(null); (r.events || []).forEach(function(x){ (ev[x.type] = ev[x.type] || {})[x.day] = x.n; });
  const vis = Object.create(null); (r.visitors || []).forEach(function(x){ vis[x.day] = x.v; });
  const series = function(map, days){ return days.map(function(d){ return (map && map[d]) || 0; }); };
  const sum = function(a){ return a.reduce(function(s, v){ return s + v; }, 0); };
  const sTs = Date.parse(r.S + 'T00:00:00Z');
  const sitesAll = r.sites || [], sitesCur = sitesAll.filter(function(s){ return s.created_ts >= sTs; }), sitesPrev = sitesAll.filter(function(s){ return s.created_ts < sTs; });
  const pubRate = function(list){ return pct(list.filter(function(s){ return s.published_ts; }).length, list.length); };
  const snap = { mrr:{}, paid_pro:{} }; (r.snaps || []).forEach(function(x){ snap[x.metric][x.day] = x.n; });
  const users = opt.users || { paid:0, mrr:0, users:[] };
  const kpi = function(id, label, c, p, spark, fmt){ return { id:id, label:label, value:c, prev:p, delta: (p === null || p === undefined) ? null : (p ? Math.round((c - p) / p * 1000) / 10 : (c ? 100 : 0)), spark:spark, fmt:fmt || 'n' }; };
  const byDayPub = Object.create(null), byDayGen = Object.create(null); sitesCur.forEach(function(s){ const d = new Date(s.created_ts).toISOString().slice(0, 10); byDayGen[d] = (byDayGen[d] || 0) + 1; if (s.published_ts) byDayPub[d] = (byDayPub[d] || 0) + 1; });
  const newPro = sum(series(ev.pro_start, cur)), cancels = sum(series(ev.pro_cancel, cur));
  const mrrSpark = series(snap.mrr, cur); let lastM = null; for (let i = 0; i < mrrSpark.length; i++) { if (snap.mrr[cur[i]] === undefined) mrrSpark[i] = lastM === null ? 0 : lastM; else lastM = mrrSpark[i]; }
  const price = opt.price || 10;
  const mrrPrev = snap.mrr[r.PE] !== undefined ? snap.mrr[r.PE] : Math.max(0, (users.paid - newPro + cancels) * price);
  const paidStart = Math.max(users.paid - newPro + cancels, 0);
  const out = { range:{ days:r.days, start:r.S, end:r.E, prevStart:r.PS, prevEnd:r.PE }, price:price };
  out.kpis = [
    kpi('visitors', 'Visitors', sum(series(vis, cur)), sum(series(vis, prev)), series(vis, cur)),
    kpi('generated', 'Sites generated', sum(series(ev.generate, cur)), sum(series(ev.generate, prev)), series(ev.generate, cur)),
    kpi('publishRate', 'Publish rate', pubRate(sitesCur), sitesPrev.length ? pubRate(sitesPrev) : null, cur.map(function(d){ return byDayGen[d] ? Math.round((byDayPub[d] || 0) / byDayGen[d] * 100) : 0; }), 'pct'),
    kpi('newPro', 'New Pro', newPro, sum(series(ev.pro_start, prev)), series(ev.pro_start, cur)),
    kpi('mrr', 'MRR', users.mrr, mrrPrev, mrrSpark, 'usd'),
    kpi('churn', 'Pro cancellations', cancels, sum(series(ev.pro_cancel, prev)), series(ev.pro_cancel, cur)),
    kpi('leads', 'Leads delivered', sum(series(ev.lead, cur)), sum(series(ev.lead, prev)), series(ev.lead, cur))
  ];
  out.kpis[5].rate = pct(cancels, paidStart || cancels);
  // Daily series for the overview chart, and stage counts (this period vs the one before) for the conversion strip.
  const pubD = Object.create(null); (r.pubDays || []).forEach(function(x){ pubD[x.day] = x.n; });
  out.daily = { days: cur, visitors: series(vis, cur), generated: series(ev.generate, cur), published: series(pubD, cur), pro: series(ev.pro_start, cur), leads: series(ev.lead, cur) };
  const stage = function(v, list){ return { visitors: v, generated: list.length, published: list.filter(function(s){ return s.published_ts; }).length, pro: list.filter(function(s){ return s.pro_ts; }).length }; };
  out.conversion = { cur: stage(sum(series(vis, cur)), sitesCur), prev: stage(sum(series(vis, prev)), sitesPrev) };
  // Funnel: visitors -> setup -> generated (sites) -> edited -> account -> published -> Pro. Optional source/category filter.
  const fSrc = opt.source || '', fCat = opt.category || '';
  const fs = sitesCur.filter(function(s){ return (!fSrc || (s.source || 'direct') === fSrc) && (!fCat || (s.category || 'generic') === fCat); });
  const acq = r.acq || [];
  const visN = fCat ? null : (fSrc ? sum(acq.filter(function(a){ return a.source === fSrc; }).map(function(a){ return a.v; })) : sum(series(vis, cur)));
  const setupN = (fCat || !r.hasSetupHook) ? null : sum((r.setup || []).filter(function(a){ return !fSrc || a.source === fSrc; }).map(function(a){ return a.v; }));
  const cnt = function(f){ return fs.filter(f).length; };
  const steps = [['visitors', 'Visited a landing page', visN], ['setup', 'Started setup', setupN], ['generated', 'Site generated', fs.length], ['edited', 'Made a first edit', cnt(function(s){ return s.first_edit_ts; })], ['account', 'Signed in / account', cnt(function(s){ return s.account_ts; })], ['published', 'Published', cnt(function(s){ return s.published_ts; })], ['pro', 'Started Pro', cnt(function(s){ return s.pro_ts; })]];
  let prevN = null; out.funnel = { steps: steps.map(function(st){ const o = { id:st[0], label:st[1], n:st[2] }; if (st[2] !== null && prevN !== null) { o.conv = pct(st[2], prevN); o.drop = Math.max(prevN - st[2], 0); } if (st[2] !== null) prevN = st[2]; return o; }), source:fSrc, category:fCat, setupNeedsHook: !r.hasSetupHook };
  const ttp = fs.filter(function(s){ return s.published_ts && s.created_ts; }).map(function(s){ return (s.published_ts - s.created_ts) / 3600000; }).sort(function(a, b){ return a - b; });
  out.funnel.medianHoursToPublish = ttp.length ? Math.round(ttp[Math.floor((ttp.length - 1) / 2)] * 10) / 10 : null;
  out.funnel.sources = Array.from(new Set(acq.map(function(a){ return a.source; }).concat(sitesCur.map(function(s){ return s.source || 'direct'; })))).sort();
  out.funnel.categories = Array.from(new Set(sitesCur.map(function(s){ return s.category || 'generic'; }))).sort();
  // Acquisition: visitors -> generated -> published -> Pro, per source / campaign / landing page.
  const group = function(keyV, keyS){
    const m = Object.create(null);
    acq.forEach(function(a){ const k = keyV(a); if (!k) return; (m[k] = m[k] || { key:k, visitors:0, generated:0, published:0, pro:0 }).visitors += a.v; });
    sitesCur.forEach(function(s){ const k = keyS(s); if (!k) return; const g = (m[k] = m[k] || { key:k, visitors:0, generated:0, published:0, pro:0 }); g.generated++; if (s.published_ts) g.published++; if (s.pro_ts) g.pro++; });
    return Object.keys(m).map(function(k){ const g = m[k]; g.genRate = g.visitors ? pct(g.generated, g.visitors) : null; g.pubRate = pct(g.published, g.generated); return g; }).sort(function(a, b){ return (b.visitors - a.visitors) || (b.generated - a.generated); }).slice(0, 15);
  };
  out.acquisition = {
    sources: group(function(a){ return a.source + (a.medium ? ' / ' + a.medium : ''); }, function(s){ return (s.source || 'direct') + (s.medium ? ' / ' + s.medium : ''); }),
    campaigns: group(function(a){ return a.campaign || ''; }, function(s){ return s.campaign || ''; }),
    landings: group(function(a){ return a.landing || '/'; }, function(s){ return s.landing || ''; })
  };
  // Business types: categories and the raw type strings people typed.
  const overall = pubRate(sitesCur);
  const bt = function(keyF, limit){
    const m = Object.create(null); sitesCur.forEach(function(s){ const k = keyF(s); const g = (m[k] = m[k] || { key:k, generated:0, published:0, pro:0, google:0 }); g.generated++; if (s.published_ts) g.published++; if (s.pro_ts) g.pro++; if (s.google) g.google++; });
    return Object.keys(m).map(function(k){ const g = m[k]; g.pubRate = pct(g.published, g.generated); g.under = g.generated >= 8 && sitesCur.length >= 20 && g.pubRate < overall * 0.6; return g; }).sort(function(a, b){ return b.generated - a.generated; }).slice(0, limit);
  };
  const generic = sitesCur.filter(function(s){ return (s.category || 'generic') === 'generic'; });
  const gt = Object.create(null); generic.forEach(function(s){ const k = s.biz_type || '(blank)'; gt[k] = (gt[k] || 0) + 1; });
  out.business = { total: sitesCur.length, overallPubRate: overall, categories: bt(function(s){ return s.category || 'generic'; }, 40), types: bt(function(s){ return s.biz_type || '(blank)'; }, 30), genericShare: pct(generic.length, sitesCur.length), genericCount: generic.length, genericTypes: Object.keys(gt).map(function(k){ return { key:k, n:gt[k] }; }).sort(function(a, b){ return b.n - a.n; }).slice(0, 12) };
  const seg = function(f){ const a = sitesCur.filter(f); return { n:a.length, pubRate: pubRate(a) }; };
  out.segments = { google: seg(function(s){ return s.google; }), noGoogle: seg(function(s){ return !s.google; }), mobile: seg(function(s){ return s.device === 'mobile'; }), desktop: seg(function(s){ return s.device === 'desktop'; }), shop: seg(function(s){ return s.shop; }) };
  // Retention: weekly signup cohorts with week-1 / week-4 return (any later sign-in, save or publish).
  const coh = Object.create(null); const endT = Date.parse(r.E + 'T00:00:00Z');
  (r.cohort || []).forEach(function(x){
    const sd = Date.parse(x.sday + 'T00:00:00Z'); const wk = new Date(sd - ((new Date(sd).getUTCDay() + 6) % 7) * DAY).toISOString().slice(0, 10);
    const c = (coh[wk] = coh[wk] || { week:wk, users:{}, w1:{}, w4:{}, start: Date.parse(wk + 'T00:00:00Z') }); c.users[x.email] = 1;
    if (x.aday) { const off = Math.floor((Date.parse(x.aday + 'T00:00:00Z') - sd) / DAY); if (off >= 7 && off < 14) c.w1[x.email] = 1; if (off >= 28 && off < 35) c.w4[x.email] = 1; }
  });
  out.retention = { cohorts: Object.keys(coh).sort().reverse().map(function(k){ const c = coh[k], n = Object.keys(c.users).length; return { week:k, size:n, w1: endT - c.start >= 14 * DAY ? pct(Object.keys(c.w1).length, n) : null, w4: endT - c.start >= 35 * DAY ? pct(Object.keys(c.w4).length, n) : null }; }).slice(0, 10) };
  const sa = (r.sitesActive || [])[0] || {}, ow = (r.owners || [])[0] || {};
  out.retention.sitesUpdated7 = sa.s7 || 0; out.retention.sitesUpdated30 = sa.s30 || 0; out.retention.activeOwners = ow.owners || 0; out.retention.avgActiveDays = ow.owners ? Math.round(ow.ownerDays / ow.owners * 10) / 10 : 0;
  // Revenue
  const st = (r.store || [])[0] || {};
  out.revenue = { mrr: users.mrr, paid: users.paid, newPro: newPro, cancels: cancels, churnRate: out.kpis[5].rate, paymentFailed: sum(series(ev.payment_failed, cur)), cancelScheduled: sum(series(ev.pro_cancel_scheduled, cur)), upgradeClicks: sum(series(ev.upgrade_click, cur)), storeCheckouts: st.n || 0, storeAmount: st.amount || 0, storeFees: st.fee || 0, proBySource: r.proBySource || [] };
  // Customer value
  const views = r.viewsBySite || [], leads = r.leadsBySite || [];
  const lm = Object.create(null); leads.forEach(function(x){ lm[x.site_id] = x.n; });
  const quiet = views.filter(function(v){ return v.n >= 50 && !lm[v.site_id]; });
  out.value = { leads: sum(series(ev.lead, cur)), sitesWithLeads: leads.length, publishedViews: sum(views.map(function(v){ return v.n; })), topSites: views.slice(0, 12).map(function(v){ return { site:v.site_id, slug:v.slug || '', views:v.n, leads:lm[v.site_id] || 0 }; }), quietSites: quiet.length, domainsConnected: sum(series(ev.domain_connected, cur)), reviews: sum(series(ev.review, cur)) };
  // Product quality
  const fails = sum(series(ev.generate_fail, cur)), gens = sitesCur.length;
  const ms = sitesCur.map(function(s){ return s.gen_ms; }).filter(function(v){ return v > 0; }).sort(function(a, b){ return a - b; });
  const kinds = Object.create(null); let checks = 0, issues = 0;
  (r.launch || []).forEach(function(x){ let p = {}; try { p = JSON.parse(x.props || '{}'); } catch(e){} checks++; issues += (p.issues || 0); (p.kinds || []).forEach(function(k){ kinds[k] = (kinds[k] || 0) + 1; }); });
  out.quality = { fails: fails, failRate: pct(fails, fails + gens), failReasons: r.fails || [], genMsP50: ms.length ? ms[Math.floor((ms.length - 1) / 2)] : null, genMsP95: ms.length ? ms[Math.min(ms.length - 1, Math.floor(ms.length * 0.95))] : null, launchChecks: checks, avgIssues: checks ? Math.round(issues / checks * 10) / 10 : null, topIssues: Object.keys(kinds).map(function(k){ return { key:k, n:kinds[k] }; }).sort(function(a, b){ return b.n - a.n; }).slice(0, 8) };
  // Costs and limits
  const month = r.E.slice(0, 7), cs = { emailMonth:0, emailToday:0, emailPeriod:Object.create(null), placesMonth:0, placesPeriod:0, unsplashHour:0, unsplashGenHour:0 };
  const hr = opt.hour || '', today = opt.today || r.E;
  (r.counters || []).forEach(function(x){
    if (x.metric === 'email') { if (x.day.slice(0, 7) === month) cs.emailMonth += x.n; if (x.day === today) cs.emailToday += x.n; if (inCur(x.day)) cs.emailPeriod[x.dim] = (cs.emailPeriod[x.dim] || 0) + x.n; }
    if (x.metric === 'places') { if (x.day.slice(0, 7) === month) cs.placesMonth += x.n; if (inCur(x.day)) cs.placesPeriod += x.n; }
    if (x.metric === 'unsplash' && x.day === today && x.dim === hr) cs.unsplashHour += x.n;
    if (x.metric === 'unsplash_gen' && x.day === today && x.dim === hr) cs.unsplashGenHour += x.n;
  });
  cs.unsplashEstHour = cs.unsplashHour + cs.unsplashGenHour * 3; // each generation: 1-2 searches + download pings
  out.costs = Object.assign(cs, opt.costs || {});
  out.insights = wsInsights(out);
  return out;
}
// Plain-English, actionable observations. Every rule has a minimum sample so small numbers do not cause noise.
function wsInsights(a){
  const out = [], f1 = function(n){ return Math.round(n * 10) / 10; }, cap = function(s){ s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  const MIN_TYPE = 8, MIN_ALL = 20, MIN_SRC = 30;
  const b = a.business || {}, avg = b.overallPubRate || 0, total = b.total || 0;
  if (total >= MIN_ALL) {
    (b.types || []).concat(b.categories || []).forEach(function(t){
      if (t.generated < MIN_TYPE || t.key === '(blank)') return;
      if (t.pubRate < avg * 0.6) out.push({ level:'warn', score: (avg - t.pubRate) * t.generated, text: cap(t.key) + ' sites publish at ' + f1(t.pubRate) + '% vs ' + f1(avg) + '% average (' + t.generated + ' generated) — review the ' + t.key + ' template and starter copy.' });
      else if (t.pubRate > avg * 1.5 && t.pubRate - avg >= 10) out.push({ level:'good', score: (t.pubRate - avg) * t.generated / 2, text: cap(t.key) + ' sites publish at ' + f1(t.pubRate) + '% vs ' + f1(avg) + '% average — a strong niche to feature in ads, examples and /for/ pages.' });
    });
    if (b.genericShare >= 15 && b.genericCount >= 5) { const tops = (b.genericTypes || []).filter(function(g){ return g.n >= 2 && g.key !== '(blank)'; }).slice(0, 5).map(function(g){ return g.key + ' (' + g.n + ')'; }); out.push({ level:'warn', score: b.genericShare * 3, text: 'The generic category is ' + f1(b.genericShare) + '% of new sites' + (tops.length ? ' — consider adding categories for: ' + tops.join(', ') + '.' : ' — check which business types are missing a category.') }); }
  }
  const srcs = ((a.acquisition || {}).sources || []).filter(function(s){ return s.visitors >= MIN_SRC && s.genRate !== null; }).sort(function(x, y){ return y.genRate - x.genRate; });
  if (srcs.length >= 2) { const hi = srcs[0], lo = srcs[srcs.length - 1]; if (lo.genRate > 0 ? hi.genRate / lo.genRate >= 2 : hi.genRate >= 5) out.push({ level:'info', score: 40, text: cap(hi.key.split(' / ')[0]) + ' traffic converts ' + (lo.genRate > 0 ? f1(hi.genRate / lo.genRate) + '×' : 'far') + ' better than ' + cap(lo.key.split(' / ')[0]) + ' (' + f1(hi.genRate) + '% vs ' + f1(lo.genRate) + '% of visitors generate a site) — shift effort toward ' + hi.key.split(' / ')[0] + '.' }); }
  const steps = ((a.funnel || {}).steps || []).filter(function(s){ return s.conv !== undefined; });
  let worst = null; steps.forEach(function(s, i){ const prevN = s.n + (s.drop || 0); if (prevN >= MIN_ALL && s.id !== 'pro' && (!worst || s.conv < worst.conv)) worst = s; });
  if (worst && worst.conv < 50) out.push({ level:'info', score: 30, text: 'Biggest drop-off: only ' + f1(worst.conv) + '% reach “' + worst.label + '” from the step before (' + worst.drop + ' lost). That is the step to work on first.' });
  const q = a.quality || {};
  if (q.fails >= 3 && q.failRate >= 3) out.push({ level:'warn', score: 60 + q.failRate, text: 'Site generation failed ' + q.fails + ' times (' + f1(q.failRate) + '%)' + (q.failReasons && q.failReasons[0] && q.failReasons[0].err ? ' — most common error: “' + String(q.failReasons[0].err).slice(0, 80) + '”.' : '.') });
  if (q.genMsP95 && q.genMsP95 > 15000 && total >= MIN_ALL) out.push({ level:'warn', score: 25, text: 'Slowest 5% of generations take ' + f1(q.genMsP95 / 1000) + 's — people may leave before their site appears.' });
  if (q.launchChecks >= 10 && q.topIssues && q.topIssues[0]) out.push({ level:'info', score: 15, text: 'Most common launch-check problem: “' + q.topIssues[0].key + '” (' + q.topIssues[0].n + ' of ' + q.launchChecks + ' checks) — fix it in the template or the editor.' });
  const sg = a.segments || {};
  if (sg.google && sg.noGoogle && sg.google.n >= 10 && sg.noGoogle.n >= 10 && sg.google.pubRate >= sg.noGoogle.pubRate * 1.4 && sg.google.pubRate - sg.noGoogle.pubRate >= 8) out.push({ level:'good', score: 35, text: 'Sites with a linked Google listing publish at ' + f1(sg.google.pubRate) + '% vs ' + f1(sg.noGoogle.pubRate) + '% without — make the Google step more prominent in setup.' });
  if (sg.mobile && sg.desktop && sg.mobile.n >= 10 && sg.desktop.n >= 10 && sg.desktop.pubRate >= sg.mobile.pubRate * 1.5 && sg.desktop.pubRate - sg.mobile.pubRate >= 8) out.push({ level:'warn', score: 35, text: 'Phone users publish at ' + f1(sg.mobile.pubRate) + '% vs ' + f1(sg.desktop.pubRate) + '% on desktop — test the editor and publish flow on a phone.' });
  const fn = a.funnel || {};
  if (fn.medianHoursToPublish !== null && fn.medianHoursToPublish > 24) out.push({ level:'info', score: 12, text: 'Median time from generating to publishing is ' + f1(fn.medianHoursToPublish / 24) + ' days — a same-day reminder could shorten it.' });
  const rv = a.revenue || {};
  if (rv.paymentFailed >= 1) out.push({ level:'warn', score: 50, text: rv.paymentFailed + ' Pro payment' + (rv.paymentFailed === 1 ? '' : 's') + ' failed in this period — check Stripe for cards to recover.' });
  if (rv.cancels >= 3 && rv.churnRate >= 10) out.push({ level:'warn', score: 45, text: 'Pro churn is ' + f1(rv.churnRate) + '% this period (' + rv.cancels + ' cancellations) — ask leavers why.' });
  if (rv.upgradeClicks >= 20 && rv.newPro / rv.upgradeClicks < 0.05) out.push({ level:'info', score: 20, text: rv.upgradeClicks + ' people opened Go Pro but only ' + rv.newPro + ' started — review the pricing step.' });
  const risk = a.churnRisk || 0; if (risk >= 1) out.push({ level:'warn', score: 55, text: risk + ' paying Pro customer' + (risk === 1 ? ' hasn’t' : 's haven’t') + ' been active for 30+ days — churn risk; reach out.' });
  const v = a.value || {}; if (v.quietSites >= 2) out.push({ level:'info', score: 18, text: v.quietSites + ' published sites got 50+ visits but no leads — check their contact form and call-to-action placement.' });
  const k0 = (a.kpis || [])[0]; if (k0 && k0.prev >= 50 && k0.delta !== null && Math.abs(k0.delta) >= 30) out.push({ level: k0.delta > 0 ? 'good' : 'warn', score: 22, text: 'Visitors are ' + (k0.delta > 0 ? 'up ' : 'down ') + Math.abs(k0.delta) + '% vs the previous ' + ((a.range || {}).days || '') + ' days.' });
  const c = a.costs || {};
  if (c.gphotoCap && c.gphotoUsed >= c.gphotoCap * 0.8) out.push({ level:'warn', score: 48, text: 'Google photo cap ' + Math.round(c.gphotoUsed / c.gphotoCap * 100) + '% used this month (' + c.gphotoUsed + '/' + c.gphotoCap + ') — new sites fall back to stock photos at 100%.' });
  if (c.unsplashEstHour >= 40) out.push({ level:'warn', score: 46, text: 'Unsplash is near its 50 requests/hour demo limit (~' + c.unsplashEstHour + ' this hour) — apply for production access.' });
  if (c.emailToday >= 80) out.push({ level:'warn', score: 40, text: c.emailToday + ' emails sent today — close to the Resend free plan’s 100/day.' });
  const order = { warn:0, good:1, info:2 };
  return out.sort(function(x, y){ return (order[x.level] - order[y.level]) || (y.score - x.score); }).slice(0, 12).map(function(x){ return { level:x.level, text:x.text }; });
}
async function doAdminAnalytics(request, env){
  if (!(await wsIsAdmin(request, env))) return wsDenied();
  const u = new URL(request.url), sp = u.searchParams;
  if (!env.DB) return succeed({ noDb:true });
  try {
    const q = { days: parseInt(sp.get('days') || '30', 10), end: /^\d{4}-\d{2}-\d{2}$/.test(sp.get('end') || '') ? sp.get('end') : '' };
    const [raw, users, data] = await Promise.all([wsAnalyticsRaw(env, q), wsUserSnapshot(env), wsCustomerStats(env)]);
    const gk = 'gphoto:count:' + (q.end || wsDay(Date.now())).slice(0, 7);
    let gUsed = 0; try { gUsed = parseInt((env.KV && await env.KV.get(gk)) || '0', 10) || 0; } catch(e){}
    let cronLast = 0; try { cronLast = parseInt((env.KV && await env.KV.get('cron:last')) || '0', 10) || 0; } catch(e){}
    const now = q.end ? Date.parse(q.end + 'T12:00:00Z') : Date.now();
    const risk = users.users.filter(function(x){ if (x.plan !== 'pro' || x.source !== 'paid' || x.owner) return false; const la = data.lastActive[x.email]; const t = la ? Date.parse(la + 'T00:00:00Z') : (x.planUpdated || x.created || 0); return now - t > 30 * 86400000; }).length;
    const out = wsAssemble(raw, { users: users, price: wsProPrice(env), source: sp.get('source') || '', category: sp.get('category') || '', hour: wsHour(), today: wsDay(Date.now()), costs: { gphotoUsed: gUsed, gphotoCap: (typeof gphotoCap === 'function') ? gphotoCap(env) : 900, cronLast: cronLast, unsplashKey: !!env.UNSPLASH_ACCESS_KEY, placesKey: !!env.GOOGLE_PLACES_KEY, resendKey: !!env.RESEND_API_KEY } });
    out.churnRisk = risk; out.insights = wsInsights(out);
    return new Response(JSON.stringify(out), { headers:{ 'Content-Type':'application/json', 'Cache-Control':'no-store' } });
  } catch(e){ return succeed({ error: 'Analytics query failed: ' + String(e && e.message || e).slice(0, 200) }); }
}
// Per-customer value from D1: sites, published, last active day, leads and published-site visits.
async function wsCustomerStats(env){
  const out = { sites:Object.create(null), lastActive:Object.create(null), activeDays:Object.create(null), leads:Object.create(null), visits:Object.create(null), siteViews:Object.create(null) };
  try {
    const db = await wsDb(env); if (!db) return out;
    const res = await Promise.all([
      db.prepare('SELECT email, COUNT(*) n, SUM(published_ts IS NOT NULL) p FROM sites WHERE email IS NOT NULL GROUP BY email').all(),
      db.prepare("SELECT substr(k, 3) email, MAX(day) d, COUNT(*) n FROM activity WHERE k >= 'u:' AND k < 'u;' GROUP BY k").all(),
      db.prepare("SELECT s.email, COUNT(*) n FROM events e JOIN sites s ON s.site_id = e.site_id WHERE e.type = 'lead' AND s.email IS NOT NULL GROUP BY s.email").all(),
      db.prepare("SELECT dim, SUM(n) n FROM daily WHERE metric = 'site_views' GROUP BY dim").all(),
      db.prepare('SELECT site_id, email FROM sites WHERE email IS NOT NULL AND published_ts IS NOT NULL').all()
    ]);
    (res[0].results || []).forEach(function(x){ out.sites[x.email] = { n:x.n, p:x.p || 0 }; });
    (res[1].results || []).forEach(function(x){ out.lastActive[x.email] = x.d; out.activeDays[x.email] = x.n; });
    (res[2].results || []).forEach(function(x){ out.leads[x.email] = x.n; });
    (res[3].results || []).forEach(function(x){ out.siteViews[x.dim] = x.n; });
    (res[4].results || []).forEach(function(x){ out.visits[x.email] = (out.visits[x.email] || 0) + (out.siteViews[x.site_id] || 0); });
  } catch(e){}
  return out;
}
async function doAdminActivity(request, env){
  if (!(await wsIsAdmin(request, env))) return wsDenied();
  const sp = new URL(request.url).searchParams;
  if (env.DB) {
    try {
      const db = await wsDb(env); const type = (sp.get('type') || '').replace(/[^a-z_0-9]/g, '').slice(0, 24); const q = (sp.get('q') || '').trim().toLowerCase().slice(0, 80); const before = parseInt(sp.get('before') || '0', 10) || 0;
      const where = ['1 = 1'], b = [];
      if (type) { where.push('type = ?'); b.push(type); }
      if (before) { where.push('id < ?'); b.push(before); }
      if (q) { where.push("(email LIKE ? OR site_id LIKE ? OR source LIKE ? OR campaign LIKE ? OR country = ? OR biz_type LIKE ? OR category = ? OR landing LIKE ?)"); const lk = '%' + q.replace(/[%_]/g, '') + '%'; b.push(lk, lk, lk, lk, q.toUpperCase(), lk, q, lk); }
      const st = db.prepare('SELECT id, ts, type, email, site_id, biz_type, category, source, medium, campaign, landing, referrer, country, device, props FROM events WHERE ' + where.join(' AND ') + ' ORDER BY id DESC LIMIT 200');
      const r = await st.bind.apply(st, b).all();
      const types = await db.prepare('SELECT DISTINCT type FROM events WHERE day >= ? ORDER BY type').bind(wsDay(Date.now() - 90 * 86400000)).all();
      return succeed({ db:true, events: (r.results || []).map(function(e){ let p = {}; try { p = JSON.parse(e.props || '{}'); } catch(x){} delete p.eid; e.props = p; return e; }), types: (types.results || []).map(function(t){ return t.type; }) });
    } catch(e){ return succeed({ db:true, events:[], error: String(e && e.message || e).slice(0, 200) }); }
  }
  if(!env.KV) return succeed({ events:[] });
  const events=[]; let cursor=undefined, guard=0;
  do{
    const r = await env.KV.list({ prefix:'evt:', cursor, limit:1000 });
    for(const k of r.keys){ if(k.metadata) events.push(k.metadata); }
    cursor = r.list_complete ? null : r.cursor; guard++;
  } while(cursor && guard<5 && events.length<4000);
  events.sort(function(a,b){ return (b.ts||0)-(a.ts||0); });
  return succeed({ events: events.slice(0,500).map(function(a){ return { ts:a.ts, type:a.t, email:a.e, country:a.c, source:a.s, device:a.d, props:{} }; }), total: events.length });
}
// One customer's profile for the admin drawer: plan, sites (with live address, visits, leads) and their event timeline.
async function doAdminCustomer(request, env){
  if (!(await wsIsAdmin(request, env))) return wsDenied();
  const email = (new URL(request.url).searchParams.get('email') || '').toLowerCase().trim();
  if (email.indexOf('@') < 1 || !env.KV) return succeed({ error:'Unknown customer' });
  let u = null; try { u = JSON.parse((await env.KV.get('user:' + email)) || 'null'); } catch(e){}
  if (!u) return succeed({ error:'No account for ' + email });
  const user = { email: email, name: u.name || '', plan: u.plan || 'free', created: u.created || 0, source: u.plan === 'pro' ? (u.proSource || (u.stripeCustomer ? 'paid' : 'comp')) : '', owner: email === SUPPORT_EMAIL.toLowerCase(), dev: !!u.dev };
  let list = []; try { list = JSON.parse((await env.KV.get('usersites:' + email)) || '[]'); } catch(e){}
  const db = await wsDb(env).catch(function(){ return null; });
  const sites = []; let leads = 0, visits = 0;
  for (const it of list.slice(0, 25)) {
    const sid = it && it.siteId; if (!sid) continue;
    const s = { siteId: sid, name: it.name || '', slug: '', views: 0, leads: 0 };
    try { s.slug = (await env.KV.get('slugof:' + sid)) || ''; } catch(e){}
    try { s.views = (await wsSiteViews(env, sid, 1)).total; } catch(e){}
    try { const fl = await env.KV.list({ prefix: 'form:' + sid + ':', limit: 1000 }); s.leads = fl.keys.length; } catch(e){}
    if (db) { try { const r = await db.prepare('SELECT biz_type, category FROM sites WHERE site_id = ?').bind(sid).first(); if (r) { s.bizType = r.biz_type || ''; s.category = r.category || ''; } } catch(e){} }
    leads += s.leads; visits += s.views; sites.push(s);
  }
  let events = [], lastActive = '', activeDays = 0;
  if (db) {
    try {
      const ids = sites.map(function(s){ return s.siteId; });
      const inSites = ids.length ? " OR (site_id IN (" + ids.map(function(){ return '?'; }).join(', ') + ") AND type IN ('generate', 'first_edit', 'publish', 'unpublish', 'domain_connected'))" : '';
      const st = db.prepare('SELECT ts, type, site_id, source FROM events WHERE email = ?' + inSites + ' ORDER BY id DESC LIMIT 60');
      events = (await st.bind.apply(st, [email].concat(ids)).all()).results || [];
      const ad = await db.prepare('SELECT MAX(day) d, COUNT(*) n FROM activity WHERE k = ?').bind('u:' + email).first();
      if (ad) { lastActive = ad.d || ''; activeDays = ad.n || 0; }
    } catch(e){}
  }
  return succeed({ user: user, sites: sites, leads: leads, visits: visits, events: events, lastActive: lastActive, activeDays: activeDays, price: wsProPrice(env) });
}
// Legacy funnel over the KV event log (used only when D1 is not bound).
const FUNNEL_STEPS = [['visit', 'Visited the landing page'], ['generate', 'Built a site'], ['first_edit', 'Edited it'], ['publish', 'Published'], ['upgrade_click', 'Opened Go Pro'], ['pro_start', 'Started Pro']];
async function doAdminFunnel(request, env){
  if (!(await wsIsAdmin(request, env))) return wsDenied();
  const days = Math.max(1, Math.min(60, parseInt(new URL(request.url).searchParams.get('days') || '30', 10) || 30));
  const since = Date.now() - days * 86400000;
  const sets = {}; FUNNEL_STEPS.forEach(function(st){ sets[st[0]] = new Set(); });
  const bySrc = Object.create(null);
  try {
    let cur, g = 0;
    do {
      const r = await env.KV.list({ prefix:'evt:', cursor:cur, limit:1000 });
      for (const k of r.keys) {
        const m = k.metadata || {}; const ts = m.ts || parseInt(k.name.split(':')[1], 10) || 0; const t = m.t === 'create_v3' ? 'generate' : m.t;
        if (ts < since || !sets[t]) continue;
        sets[t].add(m.ih || m.e || k.name);
        if (t === 'visit') { const src = m.s || 'direct'; bySrc[src] = (bySrc[src] || 0) + 1; }
      }
      cur = r.list_complete ? null : r.cursor; g++;
    } while (cur && g < 40);
  } catch(e){}
  const steps = FUNNEL_STEPS.map(function(st){ return { id: st[0], label: st[1], n: sets[st[0]].size }; });
  return succeed({ days: days, steps: steps, sources: bySrc });
}
// Client errors grouped by what went wrong, so one broken script on 30 sites reads as one row with 30 hits.
function groupClientErrors(errors){
  const now=Date.now(), map = Object.create(null);
  (errors||[]).forEach(function(er){
    if(!er||!er.msg) return;
    const sig=(er.where||'')+'|'+String(er.msg).replace(/\d+/g,'#').slice(0,160);
    let g=map[sig];
    if(!g){ g=map[sig]={ msg:er.msg, where:er.where||'', count:0, last24:0, first:er.ts||0, last:er.ts||0, sites:[], url:er.url||'', src:er.src||'', line:er.line||0 }; }
    g.count++; if(er.ts>now-86400000) g.last24++;
    if(er.ts<g.first) g.first=er.ts; if(er.ts>g.last){ g.last=er.ts; g.url=er.url||g.url; }
    let host=''; try{ const u=new URL(er.url); host=u.hostname+(u.hostname==='websprout.app'&&/^\/s\//.test(u.pathname)?u.pathname.split('/').slice(0,3).join('/'):''); }catch(e){}
    if(host && g.sites.indexOf(host)===-1 && g.sites.length<8) g.sites.push(host);
  });
  return Object.keys(map).map(function(k){return map[k];}).sort(function(a,b){ return (b.last24-a.last24)||(b.last-a.last); });
}
async function doAdminErrorsClear(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  let n=0;
  try{ let cur, g=0; do{ const r=await env.KV.list({ prefix:'clienterr:', cursor:cur, limit:1000 }); for(const k of r.keys){ await env.KV.delete(k.name); n++; } cur=r.list_complete?null:r.cursor; g++; }while(cur && g<10); }catch(e){}
  return succeed({ ok:true, cleared:n });
}
// Daily: email the owner when errors appeared that were not there at the last alert.
async function runErrorAlert(env){
  try{
    if(!env.KV || !env.RESEND_API_KEY) return;
    const last=parseInt((await env.KV.get('erralert:last'))||'0',10)||0;
    if(Date.now()-last < 20*3600000) return;
    const r=await env.KV.list({ prefix:'clienterr:', limit:1000 });
    const names=r.keys.map(function(k){return k.name;}).filter(function(nm){ return (parseInt(nm.split(':')[1],10)||0) > last; }).sort().reverse().slice(0,200);
    await env.KV.put('erralert:last', String(Date.now()));
    if(!names.length) return;
    const errs=[]; for(const nm of names){ try{ errs.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} }
    const groups=groupClientErrors(errs);
    const rows=groups.slice(0,10).map(function(g){ return '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700">'+g.count+'x</td><td style="padding:6px 10px;border-bottom:1px solid #eee">'+escHtml(g.msg)+'<div style="color:#888;font-size:12px">'+escHtml(g.where)+' &middot; '+escHtml(g.sites.join(', '))+'</div></td></tr>'; }).join('');
    const html='<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px"><p>'+errs.length+' JavaScript error'+(errs.length===1?'':'s')+' were reported since the last alert ('+groups.length+' distinct):</p><table style="border-collapse:collapse;font-size:14px">'+rows+'</table><p><a href="https://websprout.app/admin">Open the admin dashboard</a></p></div>';
    await wsResend(env, { method:'POST', headers:{ 'Authorization':'Bearer '+env.RESEND_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'Websprout <hello@websprout.app>', to:[SUPPORT_EMAIL], subject:'Websprout: '+groups.length+' new error'+(groups.length===1?'':'s')+' on sites', html: html }) });
    await wsMailCount(env, 'admin');
  }catch(e){}
}

async function doAdminData(request, env){
  if(!(await wsIsAdmin(request, env))) return wsDenied();
  if(!env.KV) return succeed({ totals:{}, users:[], published:[], errors:[], domains:[] });
  // generations per account
  const genMap = Object.create(null); let genTotal=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'gencount:', cursor:cur, limit:1000 }); for(const k of r.keys){ const em=k.name.slice(9); let n=0; try{ n=parseInt(await env.KV.get(k.name)||'0',10)||0; }catch(e){} genMap[em]=n; genTotal+=n; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  // total builds across ALL plans; falls back to the historical free count for accounts not yet migrated
  const bMap = Object.create(null);
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'bcount:', cursor:cur, limit:1000 }); for(const k of r.keys){ const em=k.name.slice(7); let n=0; try{ n=parseInt(await env.KV.get(k.name)||'0',10)||0; }catch(e){} bMap[em]=n; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  const buildMap = Object.create(null); let buildTotal=0;
  { const _u = Object.create(null); for(const e in genMap)_u[e]=1; for(const e in bMap)_u[e]=1; for(const e in _u){ const v=(bMap[e]!==undefined)?bMap[e]:(genMap[e]||0); buildMap[e]=v; buildTotal+=v; } }
  // accounts
  const users=[]; let cursor=undefined, guard=0;
  do{
    const r = await env.KV.list({ prefix:'user:', cursor, limit:1000 });
    for(const k of r.keys){ try{ const u=JSON.parse(await env.KV.get(k.name)||'{}'); const em=(u.email||k.name.slice(5)); const src=(u.plan==='pro')?(u.proSource||(u.stripeCustomer?'paid':'comp')):''; users.push({ email:em, name:u.name||'', plan:u.plan||'free', created:u.created||0, source:src, owner: em.toLowerCase()===SUPPORT_EMAIL.toLowerCase(), dev:!!u.dev, gens: buildMap[em.toLowerCase()]||0 }); }catch(e){} }
    cursor = r.list_complete ? null : r.cursor; guard++;
  } while(cursor && guard<10);
  // leads grouped by siteId
  const leadMap = Object.create(null); let leadTotal=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'form:', cursor:cur, limit:1000 }); for(const k of r.keys){ const sid=(k.name.split(':')[1])||''; leadMap[sid]=(leadMap[sid]||0)+1; leadTotal++; } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<25); }catch(e){}
  // published sites with views + leads
  const featuredSet=new Set(); try{ const fr=await env.KV.list({ prefix:'featured:', limit:1000 }); for(const fk of fr.keys){ featuredSet.add(fk.name.slice(9)); } }catch(e){}
  const pub=[]; { let c2=undefined, g2=0; do{ const r2=await env.KV.list({ prefix:'pubmeta:', cursor:c2, limit:1000 }); for(const k of r2.keys){ const slug=k.name.slice(8); try{ const m=JSON.parse(await env.KV.get(k.name)||'{}'); const sid=m.siteId||''; let views=0; try{ views=parseInt(await env.KV.get('views:'+sid+':total')||'0',10)||0; }catch(e){} pub.push({ slug, siteId:sid, updated:m.updated||0, nobadge:!!m.nobadge, views, leads:leadMap[sid]||0, featured:featuredSet.has(slug) }); }catch(e){} } c2=r2.list_complete?null:r2.cursor; g2++; } while(c2 && g2<10); }
  // custom domains
  const domains=[];
  try{ const r=await env.KV.list({ prefix:'domain:', limit:1000 }); for(const k of r.keys){ try{ const sl=await env.KV.get(k.name); domains.push({ host:k.name.slice(7), slug:sl||'' }); }catch(e){} } }catch(e){}
  // invoices created (KV) - amounts + fees configured at creation time
  const unmatched=[]; try{ const r=await env.KV.list({ prefix:'prounmatched:', limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); unmatched.push({ ts:o.ts||0, typed:o.typed||'', customer:o.customer||'' }); }catch(e){} } }catch(e){}
  const invoices=[]; let invTotal=0, feeBilled=0;
  try{ let cur=undefined,g=0; do{ const r=await env.KV.list({ prefix:'invoice:', cursor:cur, limit:1000 }); for(const k of r.keys){ try{ const o=JSON.parse(await env.KV.get(k.name)||'{}'); invoices.push({ ts:o.ts||0, owner:(k.name.split(':')[1])||'', amount:o.amount||0, fee:o.fee||0, currency:(o.currency||'usd'), desc:o.desc||'', client:o.clientEmail||'' }); invTotal+=(o.amount||0); feeBilled+=(o.fee||0); }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur&&g<15); }catch(e){}
  invoices.sort((a,b)=>(b.ts||0)-(a.ts||0));
  // real platform fees collected (Stripe application_fees, net of refunds)
  let feesCollected=0, feesCount=0, feesOk=false;
  try{ const sk=(env.STRIPE_SECRET_KEY||'').trim(); if(sk){ let starting=undefined, pages=0; do{ const u2='https://api.stripe.com/v1/application_fees?limit=100'+(starting?('&starting_after='+encodeURIComponent(starting)):''); const r=await fetch(u2,{ headers:{ 'Authorization':'Bearer '+sk } }); const j=await r.json(); if(!j||!Array.isArray(j.data)) break; for(const af of j.data){ feesCollected += ((af.amount||0)-(af.amount_refunded||0)); feesCount++; } feesOk=true; if(j.has_more && j.data.length){ starting=j.data[j.data.length-1].id; } else { starting=undefined; } pages++; } while(starting && pages<5); } }catch(e){ feesOk=false; }
  const cst = await wsCustomerStats(env);
  pub.forEach(function(p){ p.views += (cst.siteViews[p.siteId]||0); delete p.siteId; });
  const now=Date.now(); let paid=0, comped=0, free=0, signups7=0, devs=0; const price=wsProPrice(env);
  for(const u of users){ const e=u.email.toLowerCase(), si=cst.sites[e]; u.sites=si?si.n:0; u.published=si?si.p:0; u.lastActive=cst.lastActive[e]||''; u.activeDays=cst.activeDays[e]||0; u.leads=cst.leads[e]||0; u.visits=cst.visits[e]||0; u.mrr=(u.plan==='pro'&&u.source==='paid'&&!u.owner)?price:0; const la=u.lastActive?Date.parse(u.lastActive+'T00:00:00Z'):(u.created||0); u.stale=!!(u.mrr && now-la>30*86400000); }
  for(const u of users){ if(u.plan==='pro'){ if(u.source==='paid')paid++; else comped++; } else free++; if(u.created>now-7*86400000)signups7++; if(u.dev)devs++; }
  users.sort((a,b)=>(b.created||0)-(a.created||0));
  pub.sort((a,b)=>(b.updated||0)-(a.updated||0));
  const errors=[];
  try{ const r3=await env.KV.list({ prefix:'clienterr:', limit:1000 }); const names=r3.keys.map(function(k){return k.name;}).sort().reverse().slice(0,300); for(const nm of names){ try{ errors.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} } }catch(e){}
  const errorGroups=groupClientErrors(errors);
  let visits=0; try{ visits=parseInt(await env.KV.get('stat:visit')||'0',10)||0; }catch(e){}
  return succeed({ unmatched, totals:{ visits, visitConv: visits?Math.round(buildTotal/visits*1000)/10:0, accounts:users.length, paid, comped, pro:paid+comped, free, conversion: users.length?Math.round(paid/users.length*1000)/10:0, mrr: paid*price, published:pub.length, generations:buildTotal, leads:leadTotal, domains:domains.length, devs, signups7, errors:errors.length, errors24: errorGroups.reduce(function(a,g){return a+g.last24;},0), invoices:invoices.length, invoiced:invTotal, feeBilled, feesCollected, feesCount, feesOk }, users, published:pub, errors: errors.slice(0,60), errorGroups: errorGroups.slice(0,40), domains, invoices: invoices.slice(0,40) });
}
async function doAdminPage(request, env){
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()){
    return new Response('<!DOCTYPE html><meta charset="utf-8"><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;text-align:center;padding:60px"><h2>Admin access only</h2><p style="color:#9bb">Sign in as the owner account, then return to <a href="/admin" style="color:#4ade80">/admin</a>.</p></body>', { status:403, headers:{ 'Content-Type':'text/html; charset=utf-8' } });
  }
  return new Response(ADMIN_PANEL, { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
}
async function doAdminGrant(request, env){
  // Owner-only comp tool: grant/revoke Pro without Stripe. Gated to the owner's signed-in account.
  const s = await getSession(request, env);
  if(!s || (s.email||'').toLowerCase() !== SUPPORT_EMAIL.toLowerCase()){
    return new Response('Not authorized. Sign in as the owner account first.', { status:403, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  }
  const url = new URL(request.url);
  const target = ((url.searchParams.get('email') || s.email) || '').toLowerCase().trim();
  if(target.indexOf('@') < 1) return new Response('Provide a valid ?email=', { status:400, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  const role = url.searchParams.get('role');
  if(role === 'dev' || role === 'user'){
    let u = {}; try { u = JSON.parse((await env.KV.get('user:' + target)) || '{}'); } catch(e){}
    u.email = u.email || target; u.dev = (role === 'dev'); if(!u.created) u.created = Date.now();
    await env.KV.put('user:' + target, JSON.stringify(u));
    return new Response('\u2713 ' + target + ' developer access ' + (role==='dev' ? 'GRANTED \uD83D\uDEE0\uFE0F' : 'revoked') + '.\n\nThey can open /dev once signed in.\n\nTo revoke: add &role=user to this URL.', { headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
  }
  const plan = url.searchParams.get('plan') === 'free' ? 'free' : 'pro';
  await setUserPlan(env, target, plan, '', '');
  try{ await logEvent(request, env, plan==='pro' ? 'pro_comp' : 'pro_revoke', { email: target, server: true }); }catch(e){}
  _wsUsers = null;
  const body = '\u2713 ' + target + ' is now ' + (plan==='pro' ? 'PRO \uD83C\uDF89' : 'Free') + '.\n\nRefresh Websprout (or sign out and back in) to see it.\n\nTo revoke: add &plan=free to this URL.';
  return new Response(body, { headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
}
const BUILD_ID = '2026-11-13-r322';
const DEV_PANEL = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Websprout Developer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#06090c;color:#d7e3ea;padding:24px;max-width:1180px;margin:0 auto}
h1{font-size:21px;font-weight:800;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.sub{color:rgba(215,227,234,.45);font-size:12px}
.top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.rl{font-size:13px;color:rgba(215,227,234,.6);cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.rl:hover{background:rgba(255,255,255,.06)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(124px,1fr));gap:10px;margin-bottom:22px}
.card{background:#0c1218;border:1px solid rgba(56,139,189,.22);border-radius:12px;padding:14px}
.card .n{font-size:24px;font-weight:800;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.card .l{font-size:10px;color:rgba(215,227,234,.45);margin-top:2px;text-transform:uppercase;letter-spacing:.6px}
h2{font-size:14px;font-weight:700;margin:24px 0 10px;font-family:-apple-system,Segoe UI,Arial,sans-serif}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.chip{font-size:12px;padding:6px 11px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#0c1218;display:flex;align-items:center;gap:7px}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ok{background:#34d399}.no{background:#f87171}
.wrap{background:#0c1218;border:1px solid rgba(56,139,189,.16);border-radius:12px;padding:4px;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12.5px}
th{text-align:left;color:rgba(215,227,234,.4);font-weight:600;padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.08);font-size:10px;text-transform:uppercase;letter-spacing:.5px}
td{padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}
tr:hover td{background:rgba(56,139,189,.06)}
a{color:#5cc8ff;text-decoration:none}.muted{color:rgba(215,227,234,.34)}.err{color:#fca5a5;padding:20px;text-align:center}
.mono{font-family:ui-monospace,Menlo,Consolas,monospace}
</style></head><body>
<div class="top"><div><h1>&#128736;&#65039; Websprout Developer</h1><div class="sub">System, integrations, logs &amp; data store &middot; developer access</div></div><div class="rl" id="refresh">&#8635; Refresh</div></div>
<div id="sysline" class="sub" style="margin-bottom:16px">Loading&hellip;</div>
<h2>Integrations</h2>
<div id="ints" class="chips"></div>
<h2>Data store</h2>
<div id="cards" class="cards"></div>
<h2>Recent errors <span id="errCount" class="muted" style="font-weight:400;font-size:12px"></span></h2>
<div class="wrap"><table><thead><tr><th>When</th><th>Where</th><th>Message</th><th>Source</th><th>Build</th></tr></thead><tbody id="ebody"><tr><td colspan="5" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Published sites</h2>
<div class="wrap"><table><thead><tr><th>Address</th><th>Site ID</th><th>Size</th><th>Updated</th><th>Badge</th></tr></thead><tbody id="pbody"><tr><td colspan="5" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<h2>Custom domains</h2>
<div class="wrap"><table><thead><tr><th>Domain</th><th>Points to</th></tr></thead><tbody id="dbody"><tr><td colspan="2" class="muted" style="padding:18px">Loading&hellip;</td></tr></tbody></table></div>
<script>
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dt(ms){if(!ms)return '<span class="muted">&mdash;</span>';var d=new Date(ms);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function kb(n){if(!n)return '<span class="muted">&mdash;</span>';return (n/1024).toFixed(1)+' KB';}
function card(n,l){return '<div class="card"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';}
function chip(label,on){return '<div class="chip"><span class="dot '+(on?'ok':'no')+'"></span>'+label+'</div>';}
function fileOf(p){p=String(p||'');var parts=p.split('/');return parts[parts.length-1];}
function load(){
  fetch('/dev/data').then(function(r){return r.json();}).then(function(j){
    if(j.error){document.getElementById('cards').innerHTML='<div class="err">'+esc(j.error)+'</div>';return;}
    var sy=j.system||{},c=j.counts||{},mo=sy.models||{};
    document.getElementById('sysline').innerHTML='Build <b class="mono" style="color:#5cc8ff">'+esc(j.build||'?')+'</b> &middot; '+(sy.geminiKeys||0)+' Gemini key(s) &middot; free-gen limit '+(sy.freeGenLimit||0)+' &middot; models: free '+esc(mo.free||'')+', pro '+esc(mo.pro||'')+' &middot; loaded '+new Date(j.now||Date.now()).toLocaleString();
    var ig=sy.integrations||{};
    document.getElementById('ints').innerHTML=chip('KV store',ig.kv)+chip('Gemini ('+(sy.geminiKeys||0)+')',(sy.geminiKeys||0)>0)+chip('Resend email',ig.resend)+chip('Stripe secret',ig.stripeSecret)+chip('Stripe webhook',ig.stripeWebhook)+chip('Google OAuth',ig.googleOAuth);
    document.getElementById('cards').innerHTML=card(c.users||0,'Users')+card(c.published||0,'Published')+card(c.leads||0,'Leads')+card(c.views||0,'View keys')+card(c.sessions||0,'Sessions')+card(c.drafts||0,'Drafts')+card(c.gencounts||0,'Gen counters')+card(c.invoices||0,'Invoices')+card(c.domains||0,'Domains')+card(c.errors||0,'Error logs');
    var es=j.errors||[],eb='';
    if(!es.length)eb='<tr><td colspan="5" class="muted" style="padding:18px">No errors logged \uD83C\uDF89</td></tr>';
    for(var x=0;x<es.length;x++){var er=es[x];eb+='<tr><td class="muted" style="white-space:nowrap">'+dt(er.ts)+'</td><td>'+esc(er.where||'')+'</td><td style="max-width:400px"><div style="color:#fca5a5;word-break:break-word">'+esc(er.msg||'')+'</div>'+(er.url?'<div class="muted" style="font-size:11px;word-break:break-all">'+esc(er.url)+'</div>':'')+'</td><td class="muted mono" style="font-size:11px;white-space:nowrap">'+esc(fileOf(er.src))+(er.line?(':'+esc(er.line)):'')+'</td><td class="muted mono" style="font-size:11px">'+esc(String(er.build||'').replace('2026-06-10-',''))+'</td></tr>';}
    document.getElementById('ebody').innerHTML=eb;
    var ec=document.getElementById('errCount');if(ec)ec.textContent=es.length?('('+es.length+' shown)'):'';
    var ps=j.published||[],pb='';
    if(!ps.length)pb='<tr><td colspan="5" class="muted" style="padding:18px">None yet</td></tr>';
    for(var k=0;k<ps.length;k++){var p=ps[k];pb+='<tr><td><a href="https://'+esc(p.slug)+'.websprout.app" target="_blank">'+esc(p.slug)+'</a></td><td class="muted mono" style="font-size:11px">'+esc(p.siteId||'')+'</td><td class="muted">'+kb(p.size)+'</td><td class="muted">'+dt(p.updated)+'</td><td>'+(p.nobadge?'<span class="muted">none (Pro)</span>':'shown')+'</td></tr>';}
    document.getElementById('pbody').innerHTML=pb;
    var ds=j.domains||[],db='';
    if(!ds.length)db='<tr><td colspan="2" class="muted" style="padding:18px">None yet</td></tr>';
    for(var d2=0;d2<ds.length;d2++){var dm=ds[d2];db+='<tr><td>'+esc(dm.host)+'</td><td class="muted mono">'+esc(dm.slug)+'</td></tr>';}
    document.getElementById('dbody').innerHTML=db;
  }).catch(function(){document.getElementById('cards').innerHTML='<div class="err">Could not load &mdash; confirm you have developer access and are signed in.</div>';});
}
document.getElementById('refresh').addEventListener('click',load);
load();
</script></body></html>`;

async function isDeveloper(s, env){
  if(!s) return false;
  const em = (s.email||'').toLowerCase();
  if(em === SUPPORT_EMAIL.toLowerCase()) return true;
  try { const u = JSON.parse((env.KV && await env.KV.get('user:' + em)) || '{}'); return !!(u && u.dev); } catch(e){ return false; }
}
async function doDevPage(request, env){
  const s = await getSession(request, env);
  if(!(await isDeveloper(s, env))){
    return new Response('<!DOCTYPE html><meta charset="utf-8"><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060d05;color:#fff;text-align:center;padding:60px"><h2>Developer access only</h2><p style="color:#9bb">Ask the owner to grant your account developer access, then return to <a href="/dev" style="color:#4ade80">/dev</a>.</p></body>', { status:403, headers:{ 'Content-Type':'text/html; charset=utf-8' } });
  }
  return new Response(DEV_PANEL, { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
}
async function doDevData(request, env){
  const s = await getSession(request, env);
  if(!(await isDeveloper(s, env))) return new Response(JSON.stringify({ error:'Not authorized' }), { status:403, headers:{ 'Content-Type':'application/json' } });
  if(!env.KV) return succeed({ build: BUILD_ID, now: Date.now(), system:{}, counts:{}, errors:[], published:[], domains:[] });
  async function kvCount(prefix){ let c=0, cur=undefined, g=0; do{ const r=await env.KV.list({ prefix, cursor:cur, limit:1000 }); c+=r.keys.length; cur=r.list_complete?null:r.cursor; g++; } while(cur && g<25); return c; }
  const counts = {
    users: await kvCount('user:'),
    sessions: await kvCount('sess:'),
    drafts: await kvCount('draft:'),
    published: await kvCount('pubmeta:'),
    leads: await kvCount('form:'),
    views: await kvCount('views:'),
    errors: await kvCount('clienterr:'),
    invoices: await kvCount('invoice:'),
    domains: await kvCount('domain:'),
    gencounts: await kvCount('gencount:')
  };
  const errors=[];
  try{ const r=await env.KV.list({ prefix:'clienterr:', limit:1000 }); const names=r.keys.map(function(k){return k.name;}).sort().reverse().slice(0,80); for(const nm of names){ try{ errors.push(JSON.parse(await env.KV.get(nm)||'{}')); }catch(e){} } }catch(e){}
  const published=[];
  try{ let cur=undefined, g=0; do{ const r=await env.KV.list({ prefix:'pubmeta:', cursor:cur, limit:1000 }); for(const k of r.keys){ const slug=k.name.slice(8); try{ const m=JSON.parse(await env.KV.get(k.name)||'{}'); let size=0; try{ const h=await env.KV.get('pub:'+slug); size=h?h.length:0; }catch(e){} published.push({ slug, siteId:m.siteId||'', updated:m.updated||0, nobadge:!!m.nobadge, size }); }catch(e){} } cur=r.list_complete?null:r.cursor; g++; } while(cur && g<10); }catch(e){}
  published.sort(function(a,b){return (b.updated||0)-(a.updated||0);});
  const domains=[];
  try{ const r=await env.KV.list({ prefix:'domain:', limit:1000 }); for(const k of r.keys){ try{ const sl=await env.KV.get(k.name); domains.push({ host:k.name.slice(7), slug:sl||'' }); }catch(e){} } }catch(e){}
  let geminiCount=0; try{ geminiCount=geminiKeys(env).length; }catch(e){}
  const system = {
    geminiKeys: geminiCount,
    freeGenLimit: FREE_GEN_LIMIT,
    models: { free:'gemini-2.5-flash', pro:'gemini-2.5-pro' },
    integrations: {
      kv: !!env.KV,
      resend: !!env.RESEND_API_KEY,
      stripeSecret: !!env.STRIPE_SECRET_KEY,
      stripeWebhook: !!(env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET_TEST),
      googleOAuth: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
    }
  };
  return succeed({ build: BUILD_ID, now: Date.now(), system, counts, errors, published, domains });
}
