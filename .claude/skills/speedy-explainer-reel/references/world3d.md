# world3d.js — the 3D world camera (used first on SHORTS, 11 Nov 2026)

Use when a reel should feel like the camera FLIES through a world of real 3D objects (stations), instead of 2D cards sliding in. Full working example: `assets/examples/shorts-world3d.html`.

## API
- `W3.init("world", { persp: 1400, origin: [540, 930] })` — the stage div.
- `W3.box(id, { w, h, d, r, face, side })` → solid slab with 6 faces; returns the FRONT face (your HTML moves into it).
- `W3.extrude(id, html, { depth, layers, front, side })` → chunky 3D type ("Shorts", "FREE").
- `W3.obj(id, { x, y, z, rx, ry, rz, s, dof, fog })` → registers the object; `W3.set(o, {...})` per frame.
- `W3.dust(n)` + `W3.dustFrame(t)` — floating particles for depth. `W3.floor` is OFF (layer artefacts).
- `W3.camera(t, KEYS, { shake, dofK, dofMax })` — keys `{ t, x, y, z, rx, ry, focus, ease }`; ease "expoInOut" for the flight between stations, plain drift keys while a station talks. Eased lerp per segment (Catmull-Rom overshoots).

## Layout rules (learned from QA)
- One station every 2,400 px on x; the camera flies on beat words (step names, "But here's the catch").
- Keep readable content inside x 65–864 and y ≤ 1248 at rest; widths ≤ 700; arcs ≤ 12° apart; push camera y + to lift low content.
- CSS filter (the DOF blur) flattens preserve-3d → back faces show mirrored. Anything that flips/spins: `dof: false`.
- Fake UI text (chips, tabs, transcript rows, flying clips) → `data-qa="texture"`; footnotes → `data-qa="ok"`.
- Engine collisions: never use class `.scene` (speedy.css hides it) or ids `b0…`.
- Cues inside `if (t >= a)` never export: call `R.cue` unconditionally. Add ticks per row/item to reach 18–30 fx/10 s.

## Real footage inside the world (foot.js + foot_prep.py, SHORTS v2)
- `python3 tools/foot_prep.py foot/spec.json foot` cuts any MP4 into 15 fps JPG sets (`wide`, `strip` stills, moments `m0…m4`, `duo` two-person wide shot) + `foot/manifest.js` (title, length, credit, caps per moment).
- Page: `<script src="foot/manifest.js"></script><script src="foot.js"></script>`; frames are preloaded + decoded (`window.__ready`, render.mjs waits for it). `FOOT.paint(el, "m2", t - start)` per frame; `FOOT.still(set, i)` for thumbnails.
- Explainer beats built on it: player → editor-timeline film strip scrolling under Claude's playhead (transcript chips pop out, moments light up with scores, lift into a 2×2 grid) → two glowing blade cuts + flash, the 16:9 sides fall with gravity, the centre becomes a 9:16 Short, captions burn in word by word → fan → stack. Catch: crop window over the `duo` shot.
- Captions on real people must be their real words (transcribe the clip); never invent quotes.
