import { chromium } from 'playwright';
const [,, svg, out, size] = process.argv; const n = +size || 1080;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: n, height: n } });
await p.goto('file://' + svg); await p.screenshot({ path: out }); await b.close();
