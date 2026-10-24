// Deterministic frame renderer for seek(t)-driven HTML reels.
//   node render.mjs page.html out.mp4 <duration|auto> [fps=30] [workers=6]   full render (video only);
//        "auto" reads window.REEL_DURATION from the page
//   node render.mjs page.html --stills <dir> t1 t2 ...                   PNG stills for layout checks
//   node render.mjs page.html --cues <cues.json>                         export SFX cues registered by engine.js
// Run from a folder where `playwright` is installed (see setup.sh).
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const root = "/opt/pw-browsers";
  if (fs.existsSync(root)) {
    const d = fs.readdirSync(root).filter(x => /^chromium-\d+$/.test(x)).sort().pop();
    const p = d && path.join(root, d, "chrome-linux", "chrome");
    if (p && fs.existsSync(p)) return p;
  }
  return undefined; // let playwright use its own browser
}

const [page, mode, ...rest] = process.argv.slice(2);
const url = "file://" + path.resolve(page);
const browser = await chromium.launch({ executablePath: chromePath() });

async function open() {
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = [];
  p.on("pageerror", e => errors.push(e.message));
  await p.goto(url);
  await p.waitForFunction("typeof window.seek === 'function'", null, { timeout: 15000 }).catch(() => {});
  if (errors.length) { console.error("PAGE ERROR:", errors.join("\n")); process.exit(2); }
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  return p;
}

if (mode === "--stills") {
  const [dir, ...times] = rest;
  fs.mkdirSync(dir, { recursive: true });
  const p = await open();
  for (const t of times) {
    await p.evaluate(x => window.seek(x), +t);
    await p.screenshot({ path: `${dir}/t${(+t).toFixed(2).padStart(6, "0")}.png` });
  }
  console.log(`wrote ${times.length} stills to ${dir}`);
} else if (mode === "--cues") {
  const p = await open();
  for (const t of [0, 1]) await p.evaluate(x => window.seek(x), t);
  const cues = await p.evaluate(() => window.__cues || []);
  fs.writeFileSync(rest[0], JSON.stringify(cues, null, 1));
  console.log(`wrote ${cues.length} cues to ${rest[0]}`);
} else {
  const out = mode, fps = +(rest[1] || 30), workers = +(rest[2] || 6);
  let dur = +rest[0];
  if (!dur) { const p = await open(); dur = await p.evaluate(() => window.REEL_DURATION); await p.close(); }
  if (!dur) throw new Error("pass a duration or set window.REEL_DURATION in the page");
  const n = Math.round(dur * fps), dir = out + ".frames", t0 = Date.now();
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let done = 0;
  await Promise.all([...Array(workers).keys()].map(async w => {
    const p = await open();
    for (let i = w; i < n; i += workers) {
      await p.evaluate(x => window.seek(x), i / fps);
      await p.screenshot({ path: `${dir}/${String(i).padStart(5, "0")}.jpg`, type: "jpeg", quality: 95 });
      if (++done % 300 === 0) console.log(`${done}/${n} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", `${dir}/%05d.jpg`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "9M", "-bufsize", "18M", "-pix_fmt", "yuv420p", out], { stdio: "inherit" });
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`wrote ${out}: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
