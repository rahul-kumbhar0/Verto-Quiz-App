// node cover.mjs <reel.html> <t> <out.png> [cover.json]  — freeze the reel at t, hide captions, add the cover headline
// Keep key text between y=240 and y=1680: that is the 3:4 crop Instagram shows on the profile grid.
// cover.json (all optional; defaults reproduce the ai-interview cover):
//   {"kicker":"CODING INTERVIEWS", "accent":"#FF5A5F",          small pill above the headline + its colour
//    "line1":"How they {catch}", "line2":"you using AI",        {word} = the word in the blue selection box
//    "stamp":"⚠ FLAGGED", "stampAt":[120,1080],                 rotated stamp (omit or "" for none)
//    "brand":"@canwe.ai", "logo":"canwe-logo.svg",              handle + round logo beside it (path relative to cwd)
//    "light":false,                                              light = dark text for a light frame
//    "hide":["#rail"], "shift":{".plat":"0 110px"}}             CSS selectors to hide / translate
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const [,, html, t, out, cfgPath] = process.argv;
const C = Object.assign({ logo: "", kicker: "CODING INTERVIEWS", accent: "#FF5A5F", line1: "How they {catch}", line2: "you using AI",
  stamp: "⚠ FLAGGED", stampAt: [120, 1080], brand: "@canwe.ai", light: false, hide: [], shift: { ".plat": "0 110px" } },
  cfgPath ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {});
if (C.logo) C.logoData = 'data:' + (C.logo.endsWith('.svg') ? 'image/svg+xml' : 'image/png') + ';base64,' + fs.readFileSync(C.logo).toString('base64');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.resolve(html));
await p.waitForFunction("typeof window.seek === 'function'");
await p.evaluate(() => document.fonts.ready);
for (const x of [0, +t - 0.5, +t]) await p.evaluate(x => window.seek(x), x);
await p.evaluate(C => {
  document.querySelector('#kin')?.style.setProperty('display', 'none');
  for (const s of C.hide) document.querySelectorAll(s).forEach(e => e.style.setProperty('display', 'none'));
  for (const [s, v] of Object.entries(C.shift)) document.querySelectorAll(s).forEach(e => (e.style.translate = v));
  for (const el of document.querySelectorAll('body *')) if (/^Illustration of/.test(el.textContent.trim()) && el.children.length === 0) el.style.display = 'none';
  const fg = C.light ? '#111113' : '#fff', a = C.accent;
  const s = document.createElement('style');
  s.textContent = `
  #cv{position:absolute;inset:0;z-index:50;pointer-events:none;font-family:Inter}
  #cv .kick{position:absolute;left:0;right:0;top:268px;text-align:center}
  #cv .kick span{display:inline-block;font:700 30px Mono;letter-spacing:4px;color:${a};padding:10px 22px;border:2px solid ${a}8C;border-radius:999px;background:${a}14}
  #cv h1{position:absolute;left:40px;right:40px;top:350px;margin:0;text-align:center;font:800 112px/1.06 Inter;letter-spacing:-4px;color:${fg};white-space:nowrap}
  #cv h1 .sel{position:relative;display:inline-block;padding:0 .1em}
  #cv h1 .sel .box{position:absolute;inset:6px -4px 2px -4px;border:4px solid #3B82F6;background:rgba(59,130,246,.18);border-radius:4px}
  #cv h1 .sel .hd{position:absolute;width:20px;height:20px;border-radius:50%;background:#3B82F6}
  #cv h1 .sel .tl{left:-14px;top:-4px}#cv h1 .sel .br{right:-14px;bottom:-8px}
  #cv h1 .sel b{position:relative;font-weight:800}
  #cv .stamp{position:absolute;left:${C.stampAt[0]}px;top:${C.stampAt[1]}px;transform:rotate(-8deg);font:800 64px Inter;letter-spacing:2px;color:${a};border:6px solid ${a};border-radius:18px;padding:6px 26px;background:${C.light ? 'rgba(255,255,255,.95)' : 'rgba(14,16,19,.92)'};box-shadow:0 0 50px ${a}73}
  #cv .brand{position:absolute;right:66px;top:1384px;display:flex;align-items:center;gap:12px;font:600 30px Inter;color:${C.light ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.7)'}}
  #cv .brand img{width:56px;height:56px;border-radius:50%;box-shadow:0 0 0 3px ${C.light ? '#fff' : '#0F0F11'},0 6px 18px rgba(0,0,0,.35)}`;
  document.head.appendChild(s);
  const sel = l => l.replace(/\{([^}]+)\}/, '<span class="sel"><span class="box"></span><i class="hd tl"></i><i class="hd br"></i><b>$1</b></span>');
  const d = document.createElement('div'); d.id = 'cv';
  d.innerHTML = (C.kicker ? `<div class="kick"><span>${C.kicker}</span></div>` : '') +
    `<h1>${sel(C.line1)}<br>${sel(C.line2)}</h1>` + (C.stamp ? `<div class="stamp">${C.stamp}</div>` : '') + (C.brand ? `<div class="brand">${C.logoData ? `<img src="${C.logoData}">` : ''}${C.brand}</div>` : '');
  document.body.appendChild(d);
}, C);
await p.screenshot({ path: out });
await b.close();
