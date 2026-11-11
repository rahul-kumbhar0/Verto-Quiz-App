import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto(url); await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true }); await b.close();
