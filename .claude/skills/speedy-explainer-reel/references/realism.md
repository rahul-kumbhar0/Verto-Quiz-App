# Realism: draw every keyframe after the real thing

Rule (set by the owner, 14 Nov 2026): every keyframe, from the laptop to the smallest prop, must look like the real product or object. Before building or changing a block, look at the real thing first, list what it has that ours lacks, then draw those details.

## How to check a block

1. **Get references.** Physical objects: photos from Openverse (`https://api.openverse.org/v1/images/?q=…`, add `&license=cc0,pdm` for public domain) or Unsplash. Screens: a real screenshot taken with the headless browser (github.com works), or the product's own docs.
2. **Render ours** next to them: `node scripts/kfshot.mjs <block> <t1,t2|N> <outdir>` (stills of one block) or `node scripts/kfall.mjs <outdir>` (every block + error check), then `python3 scripts/kfsheet.py out.jpg "<dir>/*.png" <cols>`.
3. **List the gaps** (shape, parts, materials, text, lighting), fix them, render again.
4. Reference photos are for study only. Don't commit them and don't paste them into a reel unless the licence allows it (CC0 / public domain, or our own screenshots).

## What real things have (checked against photos and real screens)

| Thing | Details that make it read as real |
|---|---|
| iPhone | Brushed titanium band with antenna breaks, side buttons (action + 2 volume left, power right), even black bezel, Dynamic Island with a camera lens, status bar (9:41, signal, wifi, battery), home bar, soft diagonal glass reflection. Corner radius ≈ 15% of width. |
| iOS screens | Lock: date over a huge clock, notification with app icon + "now", flashlight and camera buttons. Settings: pure black, blue back link, big bold title, ONE grouped list with hairlines and coloured icon squares, green #30d158 toggles. Call: name on top, Remind Me / Message, white knob with a green phone. |
| MacBook | Thin black bezel, camera notch, 16:10 screen, aluminium front lip wider than the lid with a thumb scoop, soft shadow, screen glow on the desk. macOS menu bar with Apple logo, wifi, battery and clock. |
| Chrome | Traffic lights, a rounded tab with favicon and ✕, +, toolbar with back / forward / reload, pill URL (domain bright, path dim), star, profile dot, ⋮. |
| macOS window | Gradient title bar, traffic lights with a dark rim, centred bold title, hairline + big soft shadow. |
| GitHub repo | #0d1117 page, #010409 header, #30363d borders, blue #4493f8 owner / **name**, grey "Public" pill, Watch · Fork · Star buttons with count pills (star turns #e3b341 and says "Starred"), topic pills in blue, licence · stars · watching row, language bar with legend. |
| Finder | Sidebar (Favourites, iCloud) with blue line icons, Name / Date Modified / Size header, striped rows, blue folder icons, document icons with a type colour, ▸ ▾ disclosure, blue #0a5fff selection, status bar "N items, … available". |
| Claude Code | Dark warm terminal, orange-bordered "✻ Welcome to Claude Code", grey "> request" bar, "● Tool(target)" with a green dot when done and "⎿ result" under it, orange "✻ Working… (12s · ↓ 2.7k tokens · esc to interrupt)", bordered input, "? for shortcuts". |
| Claude chat box | Warm dark #30302e box, 32px corners, + and tools buttons with thin borders, model name with a chevron, orange #c6613f send button (dim until there is text), ivory text. |
| Calendar (iOS/macOS) | Bold month + red year, red ‹ Today ›, MON…SUN row with greyed weekend, hairline above each week, plain numbers, event dots, today in a red circle. |
| Store page | Brand + nav + search + bag with a count, breadcrumbs, thumbnail rail with the first selected, big picture on light grey, "Highly Rated" chip, title + price, ★ rating with review count, size chips with one selected, black "Add to Bag" pill + ♡. |
| Article | Site bar with logo, nav, Subscribe pill; section label in colour; headline; byline with avatar, date, read time; real sentences, not grey bars. |
| Deployments list | Black panel, ▲ title, filter chips, hairline rows, env pill + branch + commit hash, status dot + label, age + avatar, amber progress line while building. |
| Dashboard | Title + range tabs (24h selected) + Live chip, gauge with a tick scale and values, dashed grid lines behind bars, gradient bars. |
| VS Code | #323233 title bar, tab row with file-type badges and a blue top line on the active tab, breadcrumbs, #1e1e1e editor with Dark+ colours, blue #007acc status bar with branch, errors, "Ln, Col", language. |
| Instagram profile | Handle + icons, avatar in the gradient story ring, bold stats, name, category, bio, link, Follow (blue #0095f6 → grey "Following ⌄") · Message · add-person, tab icons, 3-column grid. Verified badge only if the account really has one. |
| Instagram comments / DM | Sheet with grabber and "Comments", emoji row, avatar + pill input "Add a comment for …", blue round send. The DM arrives as an iOS notification with the Instagram icon, name and "now". |
| DSLR | Left grip bulge with leatherette grain, pentaprism hump with pop-up flash and brand, shutter button, knurled mode dial, chrome mount, ribbed zoom ring, red ring, engraved front ring text, 7 aperture blades, green / magenta / amber coating reflections, window reflection. |
| Vault / safe | Door studs all round, spoked wheel, combination dial with ticks and numbers, hinge barrels, bolts, rating plate, brushed steel. |
| Server rack | Mounting rails with square holes, U numbers, 1U units with vents and LEDs, coloured patch cables down one side. |
| Smoke alarm | White dome, radial vents, centre TEST button, moulded text round the rim, a screw, one red LED. |
| Padlock | Brushed brass grain, stamped text, corner rivets, chrome cylinder, steel shackle. |
| Magnifying glass | Chrome rim, glass with an arc highlight and a thin colour fringe, shadow on the page, ferrule, ribbed black handle. |
| Fingertip | Skin gradient with a dark terminator, blush at the tip, nail on the back edge, knuckle creases, faint print ridges, cool rim light from the screen. |
| World map | Dots follow real coastlines (land mask made from public-domain country outlines). |

## Limits (be honest about these)

- Text is larger than in the real apps so it stays readable on a phone (Reels minimum). Layout, colours, icons and order follow the real thing; sizes don't.
- No real brand names or logos on props (camera says "canwe"); screens of real products (GitHub, Instagram, Claude) are shown to explain them, never to pretend a post comes from them.
- Demo content must not put invented news under a real organisation's name.
- For the exact page, use `real-screen` with a real screenshot. The drawn blocks are for when no screenshot fits or the content must animate.
