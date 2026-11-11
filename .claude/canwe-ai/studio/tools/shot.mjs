import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 860 } });
await p.goto("http://localhost:7863/"); await p.waitForFunction(() => document.querySelectorAll("#va option").length > 10);
await p.selectOption("#vb", "am_fenrir"); await p.fill("#nm", "house");
await p.click("#go"); await p.waitForFunction(() => document.getElementById("st").textContent.startsWith("Done"), null, { timeout: 60000 });
console.log(await p.textContent("#st"));
await p.screenshot({ path: process.argv[2] }); await b.close();
