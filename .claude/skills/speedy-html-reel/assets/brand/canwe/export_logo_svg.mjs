// Export logo B (mascot in selection box) as a standalone SVG.
import { chromium } from 'playwright';
import fs from 'fs';
const [,, html, out] = process.argv;
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://' + html); await p.waitForTimeout(300);
const inner = await p.evaluate(() => {
  const s = document.querySelector('#av svg').cloneNode(true);
  s.querySelector('.arms')?.remove();
  s.querySelectorAll('.mouthOpen').forEach(e => e.remove());
  return s.innerHTML;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs><radialGradient id="bgB" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#4C8DF8"/><stop offset="1" stop-color="#1E4FD8"/></radialGradient></defs>
<rect width="1080" height="1080" fill="url(#bgB)"/>
<svg x="120" y="150" width="840" height="950" viewBox="120 80 360 400" preserveAspectRatio="xMidYMid meet">${inner}</svg>
<rect x="185" y="155" width="710" height="710" rx="10" fill="none" stroke="#fff" stroke-width="10"/>
<circle cx="185" cy="155" r="32" fill="#fff" stroke="#3B82F6" stroke-width="10"/>
<circle cx="895" cy="865" r="32" fill="#fff" stroke="#3B82F6" stroke-width="10"/>
</svg>`;
fs.writeFileSync(out, svg.replace(/\n\s*/g, '\n').replace(/<!--[\s\S]*?-->/g, ''));
await b.close();
