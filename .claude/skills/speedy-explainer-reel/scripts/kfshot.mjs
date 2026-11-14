// node kfshot.mjs <block> <t1,t2,..|N> <outdir>   → stills of one keyframe block (slot only)
import { chromium } from 'playwright'; import fs from 'fs';
const [,, name, ts, out] = process.argv; fs.mkdirSync(out, { recursive: true });
const G = (process.env.KF_GALLERY || 'file:///home/user/Verto-Quiz-App/.claude/skills/speedy-explainer-reel/keyframes/gallery.html') + '?only=' + name;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(G); await p.waitForTimeout(900);
const dur = await p.evaluate(() => window.REEL_DURATION);
const T = ts.includes(',') || ts.includes('.') ? ts.split(',').map(Number) : Array.from({ length: +ts }, (_, i) => dur * (i + 0.5) / +ts);
for (const t of T) { await p.evaluate(t => window.seek(t), t); await p.waitForTimeout(120); await p.screenshot({ path: `${out}/${name}_${t.toFixed(2)}.png`, clip: { x: 0, y: 340, width: 1080, height: 1000 } }); }
console.log(name, 'dur', dur, T.map(t => t.toFixed(2)).join(' ')); await b.close();
