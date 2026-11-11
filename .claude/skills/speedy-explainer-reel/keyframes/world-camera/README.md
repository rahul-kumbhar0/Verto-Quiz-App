# world-camera

A real 3D world: solid slabs, thick 3D lettering, and one camera that flies between "stations" with depth-of-field and fog. Use it when the whole reel should feel like one continuous flight instead of cards sliding in.

It is an engine, not a single block: `world3d.js` (copy in this folder; the live one is `../../assets/template/world3d.js`).
- Full guide and layout rules: `../../references/world3d.md`
- Working reel that uses it: `../../assets/examples/shorts-world3d.html` (the SHORTS reel)

Other keyframes can sit inside the world: build the block in a host element, then hand that element to `W3.box(...)` / `W3.obj(...)`.
Not for flips: CSS blur flattens 3D, so anything that spins needs `dof: false`.
