# loop-back

The reel ends on its own first frame, so Instagram's auto-replay looks seamless and people watch twice.

It is a helper, not a block: `KF.loopBack(t, duration, tail)` (in `kf.js`) → `{ t0, mix }`.
During the last `tail` seconds, draw your opening scene again at time `t0` (it runs from `-tail` up to 0, so it arrives exactly at frame 0) with opacity `mix`, on top of the ending.

```js
const lb = KF.loopBack(t, DUR, 1.2);
openingHost.style.opacity = t < 3 ? 1 : lb.mix;          // opening scene visible at the start and again at the very end
if (lb.t0 != null) opening.frame(Math.max(0, lb.t0), stateAtZero);
```

Keep the last spoken word before the tail starts, and make the opening scene's first frame a finished picture (not an empty stage).
Working example: `demo.js` (`../gallery.html?only=loop-back`).
