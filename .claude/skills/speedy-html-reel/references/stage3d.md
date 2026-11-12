# Real 3D heroes (stage3d.js) — when a product must look like the reference renders

The 3D-hero reference reels (tires, glove + phone, DRAM) are crisp 3D renders filmed by a camera that never
stops. Upscaled AI stills look soft and CSS props look flat; `stage3d.js` renders real 3D (three.js r170,
MIT, vendored as `three.module.js` + `RoomEnvironment.js` + `RoundedBoxGeometry.js`) at 1080×1920 natively,
with environment reflections, soft contact shadows and TRUE motion blur (each MBLUR sub-frame re-renders the
camera). Worked example: `assets/examples/touchpad-reel-3d/` (laptop, finger, sensor grid, exploded Force Touch pad).

## Setup (once per machine)
- `render.mjs` launches Chromium with GPU WebGL: on Windows `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`
  (measured 1.6 ms/frame on a GTX 1650 vs 190 ms in SwiftShader), plus `--allow-file-access-from-files` so ES
  modules load from file://. `NO_GPU=1` forces software GL; `CHROME_ARGS` adds flags.
- ALWAYS look at one 3D still before a full render (a blank/white canvas = no GL).

## Page contract
```html
<section class="scene" id="s3" style="display:block"><canvas id="gl" width="1080" height="1920"></canvas><div class="ov">…2D overlays…</div></section>
<script src="captions.js"></script> … <script src="speedy.js"></script>
<script type="module">
import { stage, ease as E3, prog as P3 } from "./stage3d.js";
const S = await stage(document.getElementById("gl"));          // define window.seek AFTER this await
const lap = S.laptop(); S.scene.add(lap.group);
S.shots([{ t: 0, pos: [x,y,z], look: [x,y,z], fov: 30 }, { t: 3.9, pos: […], look: […], ease: "expoInOut" }, …]);
window.seek = t => { R.frame(t); R.speedyFrame(t); slots(t); /* pose objects from t */ S.render(t); /* 2D overlays via S.project */ };
</script>
```
- The canvas is transparent: the page canvas + dot grid stay the backdrop and theme flips still work.
- Units ≈ decimetres (laptop 3.1 wide). Keep real proportions (a finger is ~0.16 across) or it reads cartoonish.
- `S.project([x,y,z])` → stage pixels: pin callouts, leader lines, arcs and portal boxes to 3D points.
- Camera keys are eased (`power2InOut` default, `expoInOut` for reveals/dives, `linear` for slow drifts) and a
  micro hand-held drift is always added: the camera is never locked.
- Look: graphite materials, ONE terracotta rim light (`S.lights.rim`), warm key with soft shadows, cool fill.

## Builders
| call | gives | animate with |
|---|---|---|
| `S.laptop({dark, open})` | aluminium base, instanced keys, glass pad (`pad`), hinged lid; `padTop`, `padSize` | `pad.material.opacity` (dive through the glass) |
| `S.finger()` | stylised finger, sheen skin, clear-coat nail; TIP = group origin, points down −Y | `position` / `rotation` per t |
| `S.sensorGrid(cols, rows, w, d)` | PCB + row/column diamond electrodes + a node per crossing + `halo` | `setRow(i,v)` terracotta · `setCol(j,v)` cool · `setNode(k,v)` · `nodePos[k]` |
| `S.explodedPad()` | glass · sensor grid · frame with 4 force sensors · Taptic Engine · base | `setExplode(e)` · `sensors[i].emissive` · `taptic.position.x` · `tapticGlow` |
| `S.rbox(w,h,d,r,mat)` + `S.mat.*` | any other product: rounded boxes in alu / aluDark / glass / key / screen / pcb / copper() / skin / nail / metal / glow(c) | — |

## Rules
- 3D carries the PRODUCT beats (hook, "inside the thing", exploded view, recap beauty); data/UI beats stay 2D
  cards on the light canvas — exactly how the reference alternates.
- One canvas for all 3D sets: toggle `group.visible` per time window and move the camera between sets during
  a portal/settle seam (the seam hides the jump).
- Overlays that live on the 3D layer must be gated by time (`pop` has no `until` in this engine).
