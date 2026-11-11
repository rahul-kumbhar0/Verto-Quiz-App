import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
await p.goto("file://" + process.argv[2]); await p.evaluate(() => window.seek(3)); console.log(errs.length ? errs : "no JS errors");
await b.close();
