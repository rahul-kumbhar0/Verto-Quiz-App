# Follow cam (explainroo 0.4 idea, our code) + argo cursor

Needs speedy.js to expose the stage targets (template already does): in `buildStage()` after `N.EX = ex`:
`R.stageEX = ex;` → `[{el, t, end, cx}]` = what the narration points at, and when.

```js
const FC_CENTER = {};
function followCam(t) {               // returns {s, x, y}: push scale and the point to push toward
  const EX = R.stageEX || []; let w = 0, x = 540, y = 700;
  for (const e of EX) {
    const a = e.t - 0.15, b = e.end; if (t < a - 0.01 || t > b + 0.6) continue;
    const pin = R.ease.power2InOut(prog(t, a, 0.7)), pout = 1 - R.ease.power2InOut(prog(t, b, 0.55)), ww = Math.min(pin, pout);
    if (ww > w) { w = ww;
      if (!FC_CENTER[e.t]) { const cam = $("cam3dIn"), keep = cam.style.transform; cam.style.transform = "none";
        const r = e.el.getBoundingClientRect(); FC_CENTER[e.t] = [r.left - SR.left + r.width / 2, r.top - SR.top + r.height / 2]; cam.style.transform = keep; }
      [x, y] = FC_CENTER[e.t]; }
  }
  x = clamp(x, 300, 780); y = clamp(y, 520, 1100);          // never push toward the frame edges
  return { s: 1 + 0.05 * w, x: lerp(540, x, w), y: lerp(700, y, w) };
}
// in seek(), on the camera wrapper (combine with the punch rhythm; fixed origin O, moving focus P):
const pz = F.punchS(t, PSTOPS, { seq: [1, 1.04, 1, 1.055] }), fc = followCam(t), O = [540, 700];
cam.style.transformOrigin = `${O[0]}px ${O[1]}px`;
cam.style.transform = `translate(${(O[0]-fc.x)*(fc.s-1)}px,${(O[1]-fc.y)*(fc.s-1)}px) … scale(${pz * fc.s})`;
```
Zooming about a MOVING point with a fixed origin (translate = (O − P)(s − 1)) keeps the frame continuous; changing
transform-origin while scaled would jump. Keep the push ≤ 5 % (7 % pushed edge labels out of the safe zone).
Measure each target's centre once with the camera transform cleared (cached per target).

## argo cursor
```html
#cur .halo{position:absolute;left:-18px;top:-18px;width:100px;height:100px;border-radius:50%;
  background:radial-gradient(circle,rgba(240,165,133,.38),rgba(240,165,133,0) 70%)}
#cur .rip{position:absolute;left:-30px;top:-30px;width:124px;height:124px;border-radius:50%;border:4px solid #D97757;opacity:0}
```
On each press at `kb`: `rp = prog(t, kb, 0.5)`; ripple opacity `1 − rp`, scale `lerp(0.3, 1.4, expoOut(rp))`, and
`R.cue("click", kb)` so the click is heard 11 ms before it is seen.
