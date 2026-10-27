# Real logos for every public name (house rule)

Whenever a reel names a real company, product, tool, app, site, college brand or publication
(OpenAI, Claude, GitHub, LinkedIn, TCS, Infosys, TechCrunch, Instagram, Razorpay…), the frame
shows its **real logo**: never an emoji (🤖 💼), never a letter circle, never a look-alike you drew.
The only exceptions: generic things with no brand ("a browser", "a sheet", "an AI") and the
canwe.ai mascot, which comes from `assets/brand/canwe/`.

## Get them (offline, ~1 s)
```bash
node $W/tools/brand_logos.mjs $P/logos --scan $P/script.md          # lists the brands it found in the script
node $W/tools/brand_logos.mjs $P/logos OpenAI Claude TCS "Google Sheets" LinkedIn   # fetch by name
```
Writes `logos/<slug>.svg` (official colours), `logos/<slug>-white.svg` (one-colour white for dark or
brand-coloured tiles), `logos.json`, and `logos/sheet.png`: **READ the sheet** (every tile must be the
real mark, and readable on light and dark). Sources are npm icon sets installed by `setup.sh`:
LobeHub (AI brands in colour), iconify `logos` (colour marks of tech brands), simple-icons
(3,000+ brands incl. Indian IT/fintech, official brand hex). `--wordmark` also saves the wide
lettering version (`<slug>-word.svg`) where one exists.
A name it prints as MISSING (e.g. Naukri, CNBC, Deloitte, a small GitHub project) → take the mark
from the brand's own site or press kit and save it as `logos/<slug>.svg`; if that is impossible,
show the name as a plain text chip (`.brandchip` without the tile). Never substitute an emoji.

## Show them
```html
<span class="brandchip">${R.lg("openai")}ChatGPT</span>          <!-- pill: logo tile + name -->
<div class="launch">${R.lg("openai", { s: 54 })} Agent mode<i>NEW</i></div>
<div class="src">${R.lg("techcrunch", { s: 34 })} TechCrunch, 29 Sep 2026</div>  <!-- source footnotes too -->
```
`R.lg(slug, {s, cls, white})` returns a white rounded **tile** with the mark centred, so black marks
(OpenAI, GitHub, Vercel, Notion) read on the dark canvas too. `cls:"round"` circle, `cls:"bare"` no tile
(only on a light card), `cls:"dk", white:true` for a dark tile with the white mark. `R.box(…, {icon:
"logos/openai.svg"})` puts a logo on a 3D box face. Static HTML can use `<span class="lgo"><img
src="logos/x.svg"></span>` directly.

## Where logos go in the speedy format
- Hero objects about a product: the logo on the card / box / device (e.g. the launch cards, the repo
  card, a chat window's header, the "app" box in a flow).
- News and sources: logo + outlet + date in the footnote ("TechCrunch, 29 Sep 2026").
- Comparisons and lists (TCS vs Infosys vs Wipro bands, "every AI company is launching one"): one
  logo per row/card, same tile size, aligned.
- Captions stay text only; logos never go inside the caption band.

## Rules
- Unmodified marks: no recolouring (except the provided `-white` version), no stretching, no
  cropping, no effects beyond the tile shadow. Keep clear space (the tile does this).
- Use a logo only to name the thing (news, comparisons, "works with"). Never put another brand's
  logo next to ours in a way that suggests a partnership or sponsorship, and never in our own brand
  mark, profile picture or cover branding.
- One size per row; minimum 40 px on a 1080 canvas so it survives phone compression.
