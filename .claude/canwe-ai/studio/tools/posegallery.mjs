// node posegallery.mjs <avatar.js dir> out.png [pose[:prop],...]   — one still per pose, tiled with labels
import { chromium } from "playwright";
import fs from "node:fs"; import path from "node:path";
const [dir, out, list] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 600, height: 900 } });
const html = `<!doctype html><html><body style="margin:0;background:#F7F4EF"><div id="a" style="width:600px;height:900px"></div>
<script src="file://${path.resolve(dir)}/avatar.js"></script></body></html>`;
fs.writeFileSync("/tmp/claude-0/pg.html", html);
await p.goto("file:///tmp/claude-0/pg.html");
const names = list ? list.split(",") : await p.evaluate(() => Avatar.names());
const defs = process.env.POSEDEFS ? JSON.parse(fs.readFileSync(process.env.POSEDEFS, "utf8")) : {};
await p.evaluate(d => Object.assign(Avatar.POSES, d), defs);
const shots = [];
for (const n of names) {
  const [pose, prop] = n.split(":");
  await p.evaluate(([pose, prop]) => { Avatar.init("a", { look: "street" });  Avatar.frame(2, pose, 1, pose, 0, prop ? { prop: [prop, 1] } : {}); }, [pose, prop]);
  const f = `/tmp/claude-0/pg_${n.replace(":", "_")}.png`; await p.screenshot({ path: f }); shots.push([n, f]);
}
await b.close();
fs.writeFileSync("/tmp/claude-0/pg_list.json", JSON.stringify(shots));
