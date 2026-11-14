// node kfall.mjs <outdir>  → one still per block (at 70% of its demo) + any page errors
import { chromium } from 'playwright'; import fs from 'fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); let errs = 0;
p.on('pageerror', e => { errs++; console.log('ERR', e.message.slice(0, 200)); }); p.on('console', m => { if (m.type() === 'error') console.log('CON', m.text().slice(0, 200)); });
await p.goto((process.env.KF_GALLERY || 'file:///home/user/Verto-Quiz-App/.claude/skills/speedy-explainer-reel/keyframes/gallery.html')); await p.evaluate(() => window.__ready); await p.waitForTimeout(1200);
const idx = await p.evaluate(() => window.KF_INDEX);
for (const d of idx) { for (const f of [0.3, 0.72]) { const t = d.t0 + d.dur * f; try { await p.evaluate(t => window.seek(t), t); } catch (e) { console.log('SEEK ERR', d.name, e.message.slice(0, 160)); } await p.waitForTimeout(60); if (f > 0.5) await p.screenshot({ path: `${out}/${d.name}.png`, clip: { x: 0, y: 340, width: 1080, height: 1000 } }); } }
console.log('blocks', idx.length, 'errors', errs); await b.close();
