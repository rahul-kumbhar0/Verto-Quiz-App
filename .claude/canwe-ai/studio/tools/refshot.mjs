import { chromium } from "playwright";
const [url, out, w = 1280, h = 1600] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(e => console.log("goto:", e.message.slice(0, 120)));
await p.screenshot({ path: out }); console.log("ok", await p.title()); await b.close();
