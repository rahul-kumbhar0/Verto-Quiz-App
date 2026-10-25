// node cover.mjs <reel.html> <t> <out.png>  — freeze the reel at t, hide captions, add the cover headline
// Edit the #cv headline/stamp text per reel. Keep key text between y=240 and y=1680: that is the 3:4 crop Instagram shows on the profile grid.
import { chromium } from 'playwright';
import path from 'path';
const [,, html, t, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.resolve(html));
await p.waitForFunction("typeof window.seek === 'function'");
await p.evaluate(() => document.fonts.ready);
for (const x of [0, +t - 0.5, +t]) await p.evaluate(x => window.seek(x), x);
await p.evaluate(() => {
  document.querySelector('#kin')?.style.setProperty('display', 'none');
  const pl=document.querySelector('.plat'); if(pl) pl.style.translate='0 110px';
  for (const el of document.querySelectorAll('body *')) if (/^Illustration of/.test(el.textContent.trim()) && el.children.length === 0) el.style.display = 'none';
  const s = document.createElement('style');
  s.textContent = `
  #cv{position:absolute;inset:0;z-index:50;pointer-events:none;font-family:Inter}
  #cv .kick{position:absolute;left:0;right:0;top:268px;text-align:center}
  #cv .kick span{display:inline-block;font:700 30px Mono;letter-spacing:4px;color:#FF5A5F;padding:10px 22px;border:2px solid rgba(255,90,95,.55);border-radius:999px;background:rgba(255,90,95,.08)}
  #cv h1{position:absolute;left:40px;right:40px;top:350px;margin:0;text-align:center;font:800 112px/1.06 Inter;letter-spacing:-4px;color:#fff;white-space:nowrap}
  #cv h1 .sel{position:relative;display:inline-block;padding:0 .1em}
  #cv h1 .sel .box{position:absolute;inset:6px -4px 2px -4px;border:4px solid #3B82F6;background:rgba(59,130,246,.18);border-radius:4px}
  #cv h1 .sel .hd{position:absolute;width:20px;height:20px;border-radius:50%;background:#3B82F6}
  #cv h1 .sel .tl{left:-14px;top:-4px}#cv h1 .sel .br{right:-14px;bottom:-8px}
  #cv h1 .sel b{position:relative;font-weight:800}
  #cv .stamp{position:absolute;left:120px;top:1080px;transform:rotate(-8deg);font:800 64px Inter;letter-spacing:2px;color:#FF5A5F;border:6px solid #FF5A5F;border-radius:18px;padding:6px 26px;background:rgba(14,16,19,.92);box-shadow:0 0 50px rgba(255,90,95,.45)}
  #cv .brand{position:absolute;right:66px;top:1392px;font:600 30px Inter;color:rgba(255,255,255,.55)}`;
  document.head.appendChild(s);
  const d = document.createElement('div'); d.id = 'cv';
  d.innerHTML = `<div class="kick"><span>CODING INTERVIEWS</span></div>
  <h1>How they <span class="sel"><span class="box"></span><i class="hd tl"></i><i class="hd br"></i><b>catch</b></span> <br>you using AI</h1>
  <div class="stamp">⚠ FLAGGED</div><div class="brand">@canwe.ai</div>`;
  document.body.appendChild(d);
});
await p.screenshot({ path: out });
await b.close();
