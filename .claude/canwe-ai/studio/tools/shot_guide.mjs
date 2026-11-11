import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto("http://127.0.0.1:8765/youtube/"); await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close();
