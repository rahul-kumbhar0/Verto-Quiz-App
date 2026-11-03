// render.mjs — frame-by-frame renderer for speedy-devv-visual scenes.
// Usage:
//   node render.mjs scene.html out.mp4 [fps=30]
//   node render.mjs scene.html --stills outdir t1 t2 t3 ...
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(execFileSync('npm', ['root', '-g']).toString().trim() + '/playwright')); }
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const [,, html, out, ...rest] = process.argv;
if (!html || !out) { console.error('usage: render.mjs scene.html out.mp4|--stills ...'); process.exit(1); }

const browser = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(html));
const dur = await page.evaluate(() => window.DUR);

if (out === '--stills') {
  const dir = rest[0]; const times = rest.slice(1).map(Number);
  mkdirSync(dir, { recursive: true });
  for (const t of times) {
    await page.evaluate(t => window.seek(t), t);
    await page.screenshot({ path: `${dir}/t${String(t).padStart(5, '0')}.png` });
  }
  console.log(`stills: ${times.length} -> ${dir}`);
} else {
  const fps = Number(rest[0] || 30);
  const frames = Math.ceil(dur * fps);
  const tmp = out + '.frames'; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => window.seek(t), f / fps);
    await page.screenshot({ path: `${tmp}/f${String(f).padStart(5, '0')}.png` });
    if (f % 60 === 0) console.log(`frame ${f}/${frames}`);
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps),
    '-i', `${tmp}/f%05d.png`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', out]);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`rendered ${out} (${dur}s @ ${fps}fps)`);
}
await browser.close();
