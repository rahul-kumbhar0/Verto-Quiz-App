/* world3d.js — a true 3D world for seek(t) reels (canwe.ai kit, Nov 2026).
 * One continuous space, a flying camera, solid objects, extruded type, depth of field, fog, 3D dust.
 * Pure function of t (deterministic) so it renders frame-exact with render.mjs (+ MBLUR for motion blur).
 *
 *   W3.init("w3root", { persp: 1100, origin: [540, 860] })
 *   const o = W3.obj(el, { x, y, z, rx, ry, rz, s, dof: true })   // register + place (el is any absolutely-sized element)
 *   W3.set(o, { x, y, z, ry, ... })                                 // move it (every frame)
 *   W3.box(el, { w, h, d, face, side })                             // turn el into a solid slab; returns its front face
 *   W3.extrude(el, html, { depth, layers, front, side })            // 3D type with real thickness
 *   W3.dust(n, { spread })  W3.floor({ y, size })  W3.shadow(o, { y })
 *   W3.camera(t, keys)  keys = [{ t, x, y, z, rx, ry, rz, focus, ease }]  — call once per frame, AFTER moving objects
 */
(function () {
  const W = (window.W3 = {});
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, p) => a + (b - a) * p;
  const EZ = {
    linear: p => p,
    inOut: p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
    expoInOut: p => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
    out: p => 1 - Math.pow(1 - p, 3), in: p => p * p * p,
  };
  W.ease = EZ;
  let root, world, P = 1100, objs = [], cam = { x: 0, y: 0, z: 1100, rx: 0, ry: 0, rz: 0, focus: 1100 };
  const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  W.init = (id, o = {}) => {
    root = typeof id === "string" ? document.getElementById(id) : id; P = o.persp || 1100;
    const [ox, oy] = o.origin || [540, 860];
    root.style.cssText += `;position:absolute;inset:0;overflow:hidden;perspective:${P}px;perspective-origin:${ox}px ${oy}px;`;
    world = document.createElement("div"); world.className = "w3-world";
    world.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:0;height:0;transform-style:preserve-3d;`;
    root.appendChild(world); cam.z = P; cam.focus = P; return world;
  };
  W.world = () => world;
  /** register an element as a world object (it is moved into the world) */
  W.obj = (el, o = {}) => {
    el = typeof el === "string" ? document.getElementById(el) : el;
    world.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    el.style.position = "absolute"; el.style.left = `${-w / 2}px`; el.style.top = `${-h / 2}px`; el.style.transformStyle = "preserve-3d";
    const ob = { el, w, h, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, op: 1, dof: o.dof !== false, fog: o.fog !== false, ...o };
    objs.push(ob); W.set(ob, {}); return ob;
  };
  W.set = (ob, v) => { Object.assign(ob, v);
    ob.el.style.transform = `translate3d(${ob.x.toFixed(2)}px,${ob.y.toFixed(2)}px,${ob.z.toFixed(2)}px) rotateY(${ob.ry.toFixed(3)}deg) rotateX(${ob.rx.toFixed(3)}deg) rotateZ(${ob.rz.toFixed(3)}deg) scale(${ob.s.toFixed(4)})`; };

  /** solid slab: el gets 6 faces; returns the FRONT face element to put content in */
  W.box = (el, o = {}) => {
    el = typeof el === "string" ? document.getElementById(el) : el;
    const w = o.w, h = o.h, d = o.d ?? 24, face = o.face || "#16181d", side = o.side || "#0c0d10", r = o.r ?? 0;
    el.style.width = w + "px"; el.style.height = h + "px"; el.style.transformStyle = "preserve-3d";
    const kids = [...el.childNodes];
    const f = (cls, ww, hh, tr, bg, rad = 0) => { const e = document.createElement("div"); e.className = "w3-face " + cls;
      e.style.cssText = `position:absolute;left:${(w - ww) / 2}px;top:${(h - hh) / 2}px;width:${ww}px;height:${hh}px;background:${bg};transform:${tr};backface-visibility:hidden;border-radius:${rad}px;overflow:hidden;`;
      el.appendChild(e); return e; };
    const front = f("w3-front", w, h, `translateZ(${d / 2}px)`, face, r);
    f("w3-back", w, h, `rotateY(180deg) translateZ(${d / 2}px)`, side, r);
    f("w3-l", d, h - 2 * r, `rotateY(-90deg) translateZ(${w / 2}px)`, side);
    f("w3-r", d, h - 2 * r, `rotateY(90deg) translateZ(${w / 2}px)`, side);
    f("w3-t", w - 2 * r, d, `rotateX(90deg) translateZ(${h / 2}px)`, side);
    f("w3-b", w - 2 * r, d, `rotateX(-90deg) translateZ(${h / 2}px)`, side);
    kids.forEach(k => front.appendChild(k));
    return front;
  };

  /** extruded 3D type: `layers` stacked copies; the front one keeps its colour, the rest form the sides */
  W.extrude = (el, html, o = {}) => {
    el = typeof el === "string" ? document.getElementById(el) : el;
    const n = o.layers ?? 14, d = o.depth ?? 28, front = o.front || "#fff", side = o.side || "#7a3a26";
    el.style.transformStyle = "preserve-3d"; el.style.position = el.style.position || "absolute";
    let s = "";
    for (let i = n; i >= 0; i--) {
      const z = -(i / n) * d, c = i === 0 ? front : side, shade = i === 0 ? 1 : 0.55 + 0.45 * (1 - i / n);
      s += `<div class="w3-ex" style="position:${i === 0 ? "relative" : "absolute"};left:0;top:0;transform:translateZ(${z.toFixed(1)}px);color:${c};filter:brightness(${shade.toFixed(2)});white-space:nowrap">${html}</div>`;
    }
    el.innerHTML = s; return el;
  };

  /** 3D dust / bokeh field */
  W.dust = (n = 70, o = {}) => {
    const sp = o.spread || [3600, 1800, 3000], c = o.center || [0, 0, -600], list = [];
    for (let i = 0; i < n; i++) {
      const e = document.createElement("i"), sz = 3 + hash(i + 3) * 7;
      e.style.cssText = `display:block;width:${sz}px;height:${sz}px;border-radius:50%;background:${o.color || "rgba(255,214,180,.85)"};box-shadow:0 0 ${sz * 2}px ${o.glow || "rgba(255,170,120,.6)"}`;
      document.body.appendChild(e);
      const ob = W.obj(e, { x: c[0] + (hash(i) - 0.5) * sp[0], y: c[1] + (hash(i + 7) - 0.5) * sp[1], z: c[2] + (hash(i + 13) - 0.5) * sp[2], dust: true, ph: hash(i + 21) * 6.28 });
      list.push(ob);
    }
    W._dust = list; return list;
  };
  W.dustFrame = t => (W._dust || []).forEach(d => { if (d.x0 === undefined) { d.x0 = d.x; d.y0 = d.y; } W.set(d, { x: d.x0 + Math.cos(t * 0.3 + d.ph) * 14, y: d.y0 + Math.sin(t * 0.4 + d.ph) * 22 }); });

  /** floor grid plane */
  W.floor = (o = {}) => {
    const e = document.createElement("div"), size = o.size || 9000;
    e.style.cssText = `width:${size}px;height:${size}px;background-image:linear-gradient(${o.line || "rgba(255,255,255,.07)"} 2px,transparent 2px),linear-gradient(90deg,${o.line || "rgba(255,255,255,.07)"} 2px,transparent 2px);background-size:160px 160px;-webkit-mask-image:radial-gradient(closest-side,#000 30%,transparent 100%);mask-image:radial-gradient(closest-side,#000 30%,transparent 100%)`;
    document.body.appendChild(e);
    return W.obj(e, { x: o.x || 0, y: o.y ?? 520, z: o.z ?? -1500, rx: 90, dof: false, fog: false, floor: true });
  };
  /** soft contact shadow under an object (follows it on the floor) */
  W.shadow = (ob, o = {}) => {
    const e = document.createElement("div"), w = (o.w || ob.w) * 0.9;
    e.style.cssText = `width:${w}px;height:${w * 0.42}px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,${o.a ?? 0.55}),transparent)`;
    document.body.appendChild(e);
    const sh = W.obj(e, { rx: 90, dof: false, fog: false });
    sh.follow = ob; sh.fy = o.y ?? 520; return sh;
  };

  // ---- camera ----
  const cat = (a, b, c, d, p) => { const p2 = p * p, p3 = p2 * p; return 0.5 * (2 * b + (-a + c) * p + (2 * a - 5 * b + 4 * c - d) * p2 + (-a + 3 * b - 3 * c + d) * p3); };
  const camAt = (t, K) => {
    if (t <= K[0].t) return { ...K[0] }; const L = K.length - 1; if (t >= K[L].t) return { ...K[L] };
    let i = 0; while (i < L && t >= K[i + 1].t) i++;
    const k0 = K[Math.max(0, i - 1)], k1 = K[i], k2 = K[i + 1], k3 = K[Math.min(L, i + 2)];
    const p = (EZ[k2.ease || "inOut"] || EZ.inOut)(cl((t - k1.t) / Math.max(1e-3, k2.t - k1.t)));
    const g = (k, def) => (k[def] ?? (def === "z" ? P : def === "focus" ? null : 0));
    const out = {};
    ["x", "y", "z"].forEach(a => (out[a] = lerp(g(k1, a), g(k2, a), p)));   // eased per segment (Catmull-Rom overshot on long jumps)
    ["rx", "ry", "rz"].forEach(a => (out[a] = lerp(g(k1, a), g(k2, a), p)));
    const f1 = k1.focus ?? P, f2 = k2.focus ?? P; out.focus = lerp(f1, f2, p);
    return out;
  };
  W.camAt = camAt;
  W.camera = (t, keys, o = {}) => {
    const c = camAt(t, keys); Object.assign(cam, c);
    if (o.shake) { cam.x += o.shake[0]; cam.y += o.shake[1]; }
    world.style.transform = `translateZ(${P}px) rotateZ(${(-cam.rz).toFixed(3)}deg) rotateX(${(-cam.rx).toFixed(3)}deg) rotateY(${(-cam.ry).toFixed(3)}deg) translate3d(${(-cam.x).toFixed(2)}px,${(-cam.y).toFixed(2)}px,${(-cam.z).toFixed(2)}px)`;
    // depth of field + fog + culling, from each object's camera-space depth
    const cy = Math.cos(-cam.ry * Math.PI / 180), sy = Math.sin(-cam.ry * Math.PI / 180), cx = Math.cos(-cam.rx * Math.PI / 180), sx = Math.sin(-cam.rx * Math.PI / 180);
    const k = o.dofK ?? 0.0075, mx = o.dofMax ?? 14, fogN = o.fogNear ?? 1800, fogF = o.fogFar ?? 5200;
    objs.forEach(ob => {
      if (ob.follow) { W.set(ob, { x: ob.follow.x, z: ob.follow.z, y: ob.fy }); ob.el.style.opacity = (ob.follow.el.style.opacity === "" ? 1 : +ob.follow.el.style.opacity) * cl(1 - (ob.fy - ob.follow.y - ob.follow.h / 2) / 900); }
      const px = ob.x - cam.x, py = ob.y - cam.y, pz = ob.z - cam.z;
      const x1 = px * cy + pz * sy, z1 = -px * sy + pz * cy;      // yaw
      const z2 = py * sx + z1 * cx;                                 // pitch
      const depth = -z2;                                            // distance in front of the eye
      ob.depth = depth;
      if (ob.floor) return;
      if (depth < 60) { ob.el.style.visibility = "hidden"; return; }
      ob.el.style.visibility = ob.hide ? "hidden" : "visible";
      const fl = [];
      if (ob.dof) { const b = Math.min(mx, Math.abs(depth - cam.focus) * k); if (b > 0.4) fl.push(`blur(${b.toFixed(1)}px)`); }
      if (ob.fog) { const f = cl((depth - fogN) / (fogF - fogN)); if (f > 0.01) fl.push(`brightness(${(1 - 0.75 * f).toFixed(2)})`); }
      ob.el.style.filter = fl.join(" ");
    });
    return cam;
  };
  W.cam = () => cam;
  /** screen position of a world point (for 2D overlays that must sit on a 3D object) */
  W.project = (x, y, z) => {
    const cy = Math.cos(-cam.ry * Math.PI / 180), sy = Math.sin(-cam.ry * Math.PI / 180), cx = Math.cos(-cam.rx * Math.PI / 180), sx = Math.sin(-cam.rx * Math.PI / 180);
    const px = x - cam.x, py = y - cam.y, pz = z - cam.z, x1 = px * cy + pz * sy, z1 = -px * sy + pz * cy, y2 = py * cx - z1 * sx, z2 = py * sx + z1 * cx;
    const d = -z2, f = P / Math.max(1, d), o = root.style.perspectiveOrigin.split(" ").map(parseFloat);
    return [o[0] + x1 * f, o[1] + y2 * f, d];
  };
})();
