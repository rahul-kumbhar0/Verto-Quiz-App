// reeltext.mjs — text placement QA for seek(t) reels (idea from explainroo's layout/readability checks
// and SallyRS/video-director's Reels safe zone; our own code).
// usage: node reeltext.mjs page.html out.json [step=0.5]
// For every sampled time: every visible text run → its box in stage px and its rendered font size.
//  unsafe: text outside the 9:16 Reels safe box (top 15 %, bottom 35 %, left 6 %, right 20 %)
//  small : must-read text under 3 % of frame height (58 px) — captions/headline/labels, not UI texture
// Opt out per element with data-qa="texture" (fake UI, phone screens) or data-qa="ok" (deliberate).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [page, out, stepArg] = process.argv.slice(2);
const step = +(stepArg || 0.5);
const root = "/opt/pw-browsers";
const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? undefined : undefined });

const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto("file://" + path.resolve(page));
await p.waitForFunction("typeof window.seek === 'function'");
await p.evaluate(() => document.fonts.ready);
const dur = await p.evaluate(() => window.REEL_DURATION || 45);
const SAFE = { top: 0.15 * 1920, bottom: 0.65 * 1920, left: 0.06 * 1080, right: 0.80 * 1080 };
const unsafe = [], small = [], seen = new Set();
for (let t = 0; t <= dur; t += step) {
  const runs = await p.evaluate(tt => {
    window.seek(tt);
    const st = document.getElementById("stage").getBoundingClientRect();
    const res = [];
    const walker = document.createTreeWalker(document.getElementById("stage"), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const txt = n.textContent.replace(/\s+/g, " ").trim();
      if (txt.length < 2) continue;
      const el = n.parentElement;
      if (el.closest('[data-qa="texture"],[data-qa="ok"],.phone,.vd-ph,#tp,#phone,#ph5,svg')) continue;
      // effective visibility: walk up opacity / visibility / display
      let a = 1, e = el, hidden = false;
      while (e && e.id !== "stage") { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") { hidden = true; break; } a *= +cs.opacity; e = e.parentElement; }
      if (hidden || a < 0.5) continue;
      const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      const k = 1080 / st.width, x0 = (b.left - st.left) * k, y0 = (b.top - st.top) * k, x1 = (b.right - st.left) * k, y1 = (b.bottom - st.top) * k;
      if (x1 < 0 || y1 < 0 || x0 > 1080 || y0 > 1920) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize) * (b.height / Math.max(1, el.getBoundingClientRect().height || b.height)) * k;
      const scale = b.height / Math.max(1, parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2);
      res.push({ text: txt, id: el.id || el.className || el.tagName, x0, y0, x1, y1, px: Math.round(parseFloat(getComputedStyle(el).fontSize) * Math.min(1.5, Math.max(0.2, scale)) * k) });
    }
    return res;
  }, t);
  for (const r of runs) {
    const why = [];
    if (r.y0 < SAFE.top) why.push("top"); if (r.y1 > SAFE.bottom) why.push("bottom"); const lowHalf = r.y1 > 1000;
    if (r.x0 < SAFE.left) why.push("left"); if (lowHalf && r.x1 > SAFE.right) why.push("right");
    const key = r.text.slice(0, 40) + "|" + why.join(",");
    if (why.length && !seen.has(key)) { seen.add(key); unsafe.push({ t: +t.toFixed(2), text: r.text, id: String(r.id), why: why.join("+"), box: [r.x0, r.y0, r.x1, r.y1].map(Math.round) }); }
    const k2 = r.text.slice(0, 40) + "|small";
    if (r.px < 34 && r.text.length > 3 && !seen.has(k2)) { seen.add(k2); small.push({ t: +t.toFixed(2), text: r.text, id: String(r.id), px: r.px }); }
  }
}
fs.writeFileSync(out, JSON.stringify({ step, safe: SAFE, unsafe, small }, null, 1));
console.log(`reeltext: ${unsafe.length} unsafe text runs, ${small.length} small → ${out}`);
await browser.close();
