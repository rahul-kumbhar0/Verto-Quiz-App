import { chromium } from 'playwright'; import fs from 'fs';
const out = '/root/reel-work/reels/channel/real';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
const p = await ctx.newPage(); await p.goto('https://github.com/Jakeschincariol/youtube-agent-skill', { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.documentElement.scrollHeight); console.log('height', H);
await p.screenshot({ path: out + '/gh-full.png', fullPage: true });
const find = async (txt) => p.evaluate(txt => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, r = []; while ((n = w.nextNode())) if (n.textContent.includes(txt)) { const e = n.parentElement.getBoundingClientRect(); if (e.width > 0) r.push([Math.round((e.left) * 2), Math.round((e.top + scrollY) * 2), Math.round(e.width * 2), Math.round(e.height * 2), n.parentElement.tagName]); } return r.slice(0, 4); }, txt);
for (const t of ['youtube-agent-skill', 'Eleven Claude skills that run', 'Install this skill', 'It does not publish', 'is a heuristic, not a predictor', 'The fine print', 'stars', '/yt-script', 'Nothing gets published until you do it']) console.log(JSON.stringify(t), JSON.stringify(await find(t)));
await b.close();
