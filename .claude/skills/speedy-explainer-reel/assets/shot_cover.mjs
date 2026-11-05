import { chromium } from "playwright";
const [page, out] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on("pageerror", e => console.log("ERR", e.message));
await p.goto("file://" + page); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: out }); await b.close(); console.log("wrote", out);
