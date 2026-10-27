// Real logos for every public company / product / tool named in a reel (never an emoji or a letter circle).
//   node brand_logos.mjs <reel>/logos OpenAI Claude "Tata Consultancy Services" LinkedIn ...
//   node brand_logos.mjs <reel>/logos --scan <reel>/script.md      # also lists brands found in the text
//   add --wordmark to also fetch the wide name logo (e.g. the full "LinkedIn" lettering) as <slug>-word.svg
// Writes <slug>.svg (official colours), <slug>-white.svg (one-colour white, for dark/brand tiles) when a
// one-colour mark exists, logos.json (name → file, source, brand hex) and sheet.png (contact sheet: READ IT).
// Sources, all offline from npm (installed by setup.sh into $W/logo-src): LobeHub icons (AI brands, colour),
// iconify "logos" (colour marks of dev/tech brands), simple-icons (3,000+ brands incl. TCS, Infosys, Wipro,
// Razorpay, Swiggy… as the official one-colour mark + official brand hex). A miss is reported: then take the
// mark from the brand's own press kit / site and save it as <slug>.svg; never draw a look-alike.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = [process.env.LOGO_SRC, path.join(HERE, "../logo-src"), path.join(process.env.HOME || "", "reel-work/logo-src")]
  .filter(Boolean).find(d => fs.existsSync(path.join(d, "node_modules/simple-icons")));
if (!SRC) { console.error("logo packages missing: run setup.sh (or: cd $W/logo-src && npm i simple-icons@16.36.0 @iconify-json/logos@1.2.18 @iconify-json/simple-icons@1.2.101 @lobehub/icons-static-svg@1.101.0)"); process.exit(1); }
const NM = path.join(SRC, "node_modules");
const require = createRequire(path.join(SRC, "x.js"));
const SI = await import(pathToFileURL(path.join(NM, "simple-icons/index.mjs")).href);
const LOGOS = require("@iconify-json/logos/icons.json");
const SIX = (() => { try { return require("@iconify-json/simple-icons/icons.json"); } catch { return { icons: {} }; } })(); // keeps marks simple-icons later dropped (Excel, Cognizant…)
const logosByNorm = new Map(Object.keys(LOGOS.icons).map(n => [n.replace(/-/g, ""), n]));
const LOBE = path.join(NM, "@lobehub/icons-static-svg/icons");

// spoken / written names → package keys
const ALIAS = {
  chatgpt: "openai", gpt: "openai", gpt4: "openai", gpt5: "openai", openaidevday: "openai",
  claudeai: "claude", claudecode: "claudecode", tataconsultancyservices: "tcs", tataconsultancy: "tcs",
  infosysltd: "infosys", wiprolimited: "wipro", microsoftexcel: "microsoftexcel", excel: "microsoftexcel",
  word: "microsoftword", powerpoint: "microsoftpowerpoint", teams: "microsoftteams", sheets: "googlesheets",
  googlesheet: "googlesheets", gmail: "gmail", googledrive: "googledrive", drive: "googledrive", meet: "googlemeet",
  twitter: "x", xcom: "x", vscode: "visualstudiocode", visualstudiocode: "visualstudiocode", aws: "amazonwebservices",
  amazonwebservices: "amazonwebservices", gcp: "googlecloud", googlecloud: "googlecloud", azure: "microsoftazure",
  gemini: "gemini", googlegemini: "gemini", copilot: "githubcopilot", githubcopilot: "githubcopilot",
  leetcode: "leetcode", hackerrank: "hackerrank", linkedinlearning: "linkedin", ig: "instagram", yt: "youtube",
};
const norm = s => s.toLowerCase().replace(/\+/g, "plus").replace(/\./g, "dot").replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const keyOf = n => { const k = norm(n).replace(/dot(com|ai|io|in)$/, ""); return ALIAS[k] ?? k; };

const siIndex = new Map(Object.values(SI).filter(o => o && o.slug).map(o => [o.slug, o]));
const siByTitle = new Map(Object.values(SI).filter(o => o && o.title).map(o => [norm(o.title), o]));
const siFind = k => siIndex.get(k) ?? siByTitle.get(k) ?? siIndex.get(k.replace(/and/g, ""));

const iconify = (name, set = LOGOS) => {
  const ic = set.icons[set === LOGOS ? logosByNorm.get(name.replace(/-/g, "")) ?? name : name]; if (!ic) return null;
  const w = ic.width ?? set.width ?? 24, h = ic.height ?? set.height ?? 24;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ic.left ?? 0} ${ic.top ?? 0} ${w} ${h}">${ic.body}</svg>`, w, h };
};
const lobe = f => { const p = path.join(LOBE, f); return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null; };
const clean = s => s.replace(/\s(height|width)="1em"/g, "").replace(/\sstyle="[^"]*"/, "").replace(/<title>.*?<\/title>/, "");
const recolor = (s, c) => clean(s).replace(/fill="currentColor"/g, `fill="${c}"`).replace(/<svg /, m => /fill=/.test(s.slice(0, s.indexOf(">"))) ? m : `<svg fill="${c}" `);
const lum = hex => { const v = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };

/** best mark for a name: {svg, white?, word?, source, hex, title} or null */
function find(name, wantWord) {
  const k = keyOf(name), si = siFind(k), out = { title: si?.title ?? name, hex: si ? "#" + si.hex : null };
  let s;
  if ((s = lobe(`${k}-color.svg`))) Object.assign(out, { svg: clean(s), source: `lobehub:${k}-color` });
  else if ((s = iconify(`${k}-icon`))) Object.assign(out, { svg: s.svg, source: `iconify-logos:${k}-icon` });
  else if ((s = iconify(k)) && s.w / s.h <= 1.6) Object.assign(out, { svg: s.svg, source: `iconify-logos:${k}` });
  else if ((s = lobe(`${k}.svg`))) Object.assign(out, { svg: recolor(s, out.hex ?? "#111111"), source: `lobehub:${k}` });
  else if (si) Object.assign(out, { svg: si.svg.replace("<svg ", `<svg fill="#${si.hex}" `), source: `simple-icons:${si.slug}` });
  else if ((s = iconify(k, SIX))) Object.assign(out, { svg: recolor(s.svg, "#111111"), white: recolor(s.svg, "#ffffff"), source: `simple-icons(legacy):${k}` });
  else return null;
  // one-colour white version for dark or brand-coloured tiles
  if (out.white) ;
  else if (si) out.white = si.svg.replace("<svg ", `<svg fill="#ffffff" `);
  else if ((s = lobe(`${k}.svg`))) out.white = recolor(s, "#ffffff");
  out.dark = out.hex ? lum(out.hex.slice(1)) < 0.06 : /lobehub:[^-]+$|legacy/.test(out.source);
  if (wantWord) {
    const w = iconify(k);
    if (w && w.w / w.h > 1.6) out.word = w.svg;
    else if ((s = lobe(`${k}-text.svg`))) out.word = recolor(s, out.hex && !out.dark ? out.hex : "#111111");
  }
  return out;
}

// ---------- CLI ----------
const args = process.argv.slice(2);
const dir = args.shift(); if (!dir) { console.error("usage: node brand_logos.mjs <outdir> [--wordmark] [--scan file] name ..."); process.exit(1); }
const wantWord = args.includes("--wordmark");
let names = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--wordmark") continue;
  if (args[i] === "--scan") { scan(args[++i]); continue; }
  names.push(args[i]);
}

function scan(file) {
  // candidate brands = capitalised words / 2-3 word runs that are a known simple-icons title or LobeHub/iconify name
  const text = fs.readFileSync(file, "utf8").replace(/\{[^}]*\}|[[\]*]/g, " ");
  const STOP = new Set(["the", "and", "this", "that", "watch", "comment", "follow", "think", "act", "observe", "repeat", "loop", "one",
    "sheet", "save", "find", "here", "again", "until", "right", "now", "every", "what", "dm", "ai", "so", "it", "and", "then", "agent", "agents"]);
  const words = text.match(/[A-Za-z][\w.+&-]*/g) || [], hits = new Set();
  for (let i = 0; i < words.length; i++) for (let n = 3; n >= 1; n--) {
    const run = words.slice(i, i + n); if (run.length < n || !/^[A-Z]/.test(run[0])) continue;
    const phrase = run.join(" "), k = keyOf(phrase);
    if (k.length < 3 || STOP.has(k)) continue;
    if (siFind(k) || logosByNorm.has(k) || SIX.icons[k] || lobe(`${k}.svg`)) { hits.add(phrase.replace(/[.,]$/, "")); break; }
  }
  if (hits.size) console.log(`brands named in ${path.basename(file)}: ${[...hits].join(", ")}  (check each; drop false hits)`);
  names.push(...hits);
}

fs.mkdirSync(dir, { recursive: true });
const manPath = path.join(dir, "logos.json");
const man = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, "utf8")) : {};
const miss = [];
for (const n of [...new Set(names)]) {
  const r = find(n, wantWord), slug = keyOf(n);
  if (!r) { miss.push(n); continue; }
  fs.writeFileSync(path.join(dir, slug + ".svg"), r.svg);
  if (r.white) fs.writeFileSync(path.join(dir, slug + "-white.svg"), r.white);
  if (r.word) fs.writeFileSync(path.join(dir, slug + "-word.svg"), r.word);
  man[n] = { file: `logos/${slug}.svg`, white: r.white ? `logos/${slug}-white.svg` : null, word: r.word ? `logos/${slug}-word.svg` : null,
             title: r.title, hex: r.hex, dark: r.dark, source: r.source };
  console.log(`${n.padEnd(28)} → logos/${slug}.svg  [${r.source}${r.hex ? " " + r.hex : ""}${r.dark ? ", dark mark: keep it on a light tile" : ""}]`);
}
fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
if (miss.length) console.log(`MISSING (get the official mark from the brand's press kit/site, save as logos/<slug>.svg): ${miss.join(", ")}`);

// contact sheet: every logo on a light and a dark tile, so wrong/blank marks are caught before the render
try {
  const { chromium } = await import(pathToFileURL(path.join(SRC, "../node_modules/playwright/index.mjs")).href).catch(() => import("playwright"));
  const items = Object.entries(man);
  if (items.length) {
    const cell = ([n, m]) => `<div class=c><div class="t l"><img src="${path.resolve(dir, "..", m.file)}"></div><div class="t d"><img src="${path.resolve(dir, "..", m.white || m.file)}"></div><b>${n}</b><small>${m.source}</small></div>`;
    const html = `<style>body{margin:0;padding:20px;background:#888;font:600 15px sans-serif;display:flex;flex-wrap:wrap;gap:14px;width:1040px}
      .c{width:240px;background:#fff;border-radius:12px;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.c b,.c small{grid-column:1/3}
      .t{height:96px;border-radius:10px;display:grid;place-items:center}.l{background:#f4f4f6}.d{background:#141518}.t img{max-width:78%;max-height:70px}
      small{color:#777;font-size:11px}</style>${items.map(cell).join("")}`;
    const f = path.join(dir, "sheet.html"); fs.writeFileSync(f, html);
    const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 400 } });
    await p.goto(pathToFileURL(f).href); await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(dir, "sheet.png"), fullPage: true }); await b.close();
    console.log(`contact sheet: ${path.join(dir, "sheet.png")} (READ it: every tile must show the real mark)`);
  }
} catch (e) { console.log("(no contact sheet: " + e.message.split("\n")[0] + ")"); }
