import { chromium } from 'playwright';
const [,, html, outdir] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 3440, height: 2400 } });
await p.goto('file://' + html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
for (const id of ['A','B','C','W1','W2']) await p.locator('#'+id).screenshot({ path: `${outdir}/${id}.png` });
await b.close();
