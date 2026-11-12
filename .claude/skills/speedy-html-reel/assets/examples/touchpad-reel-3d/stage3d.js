/* stage3d.js — REAL 3D hero objects for speedy reels (three.js r170; GPU WebGL through render.mjs' ANGLE flags).
 * Why: the reference 3D-hero reels (tires, glove+phone, DRAM) are crisp renders with a camera that never stops
 * (moves 52–59 % of frames). Upscaled AI stills look soft and flat CSS props look cheap; this renders at 1080×1920
 * natively, with real reflections, soft shadows and TRUE motion blur (MBLUR sub-frames re-render the camera).
 * Pure function of t, like the rest of the kit: S.render(t) poses everything from t — no clocks, no randomness.
 *
 *   import { stage, ease, prog, lerp, clamp } from "./stage3d.js";
 *   const S = await stage(document.getElementById("gl"));        // <canvas id="gl" width=1080 height=1920>
 *   const lap = S.laptop(); S.scene.add(lap.group);
 *   S.shots([{ t: 0, pos: [0, 2, 4], look: [0, 0, 0] }, { t: 3, pos: [...], look: [...], ease: "expoInOut" }]);
 *   window.seek = t => { R.frame(t); R.speedyFrame(t); ...; S.render(t); };   // define seek AFTER await stage()
 *   S.project([x, y, z]) -> [px, py] in stage pixels: anchor 2D labels, arcs and callouts to 3D points.
 * Look (look.md): graphite materials, ONE terracotta rim light, transparent canvas over the page grid.
 * Builders: laptop() · finger() · sensorGrid(cols, rows, w, d) · explodedPad() — see references/stage3d.md.
 */
import * as THREE from "./three.module.js";
import { RoomEnvironment } from "./RoomEnvironment.js";
import { RoundedBoxGeometry } from "./RoundedBoxGeometry.js";

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const prog = (t, a, d) => clamp((t - a) / Math.max(1e-6, d));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = {
  linear: p => p,
  inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  out3: p => 1 - Math.pow(1 - p, 3),
  expoOut: p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  expoInOut: p => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
  power2InOut: p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
  backOut: p => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
};
export { THREE };

export async function stage(canvas, o = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  r.setPixelRatio(1); r.setSize(1080, 1920, false); r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = o.exposure ?? 1.05;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(r);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = o.env ?? 0.5;
  const camera = new THREE.PerspectiveCamera(o.fov ?? 30, 1080 / 1920, 0.01, 200);

  // lights: warm key with soft shadows · ONE terracotta rim from behind · faint cool fill
  const key = new THREE.SpotLight(0xfff1e4, o.key ?? 140, 0, 0.5, 0.8, 2); key.position.set(2.4, 6.5, 3.2);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.radius = 8; key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  const rim = new THREE.SpotLight(0xd97757, o.rim ?? 120, 0, 0.7, 0.9, 2); rim.position.set(-3.2, 2.6, -3.8);
  const fill = new THREE.DirectionalLight(0x8fa3bf, 0.35); fill.position.set(-4, 3, 5);
  scene.add(key, key.target, rim, rim.target, fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = o.floorY ?? -0.001; floor.receiveShadow = true; scene.add(floor);

  // materials (graphite + terracotta; copper only where it IS copper)
  const phys = p => new THREE.MeshPhysicalMaterial(p);
  const mat = {
    alu: phys({ color: 0x9c9fa5, metalness: 1, roughness: 0.34 }),
    aluDark: phys({ color: 0x4b4e54, metalness: 1, roughness: 0.38 }),
    glass: phys({ color: 0x1c1e22, metalness: 0, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true }),
    key: phys({ color: 0x131417, metalness: 0.1, roughness: 0.62 }),
    screen: phys({ color: 0x050506, metalness: 0, roughness: 0.12, clearcoat: 1 }),
    pcb: phys({ color: 0x0d2219, metalness: 0.1, roughness: 0.55 }),
    copper: () => phys({ color: 0xc27a45, metalness: 1, roughness: 0.28, emissive: 0x000000 }),
    skin: phys({ color: 0xe6ae86, metalness: 0, roughness: 0.52, sheen: 1, sheenColor: 0xffc6a2, sheenRoughness: 0.5, clearcoat: 0.15 }),
    nail: phys({ color: 0xf4d0c0, metalness: 0, roughness: 0.22, clearcoat: 1 }),
    metal: phys({ color: 0x6f7277, metalness: 1, roughness: 0.42 }),
    glow: c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  };
  const sh = m => { m.castShadow = true; m.receiveShadow = true; return m; };
  const rbox = (w, h, d, rad, m, seg = 4) => sh(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(rad, h / 2 - 1e-4, w / 2, d / 2)), m));

  // ---------- builders ----------
  /** laptop: aluminium base, keyboard, glass trackpad, open lid. Units ≈ dm. Returns parts + the pad's top centre. */
  const laptop = (lo = {}) => {
    const g = new THREE.Group(), W = 3.1, D = 2.15, H = 0.12;
    const base = rbox(W, H, D, 0.06, lo.dark ? mat.aluDark : mat.alu); base.position.y = H / 2; g.add(base);
    const kb = new THREE.InstancedMesh(new RoundedBoxGeometry(0.17, 0.03, 0.17, 2, 0.025), mat.key, 14 * 5 + 1);
    const m4 = new THREE.Matrix4(); let n = 0;
    for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 14; c++) { m4.makeTranslation(-1.3 + c * 0.2, H + 0.012, -0.92 + rr * 0.2); kb.setMatrixAt(n++, m4); }
    m4.compose(new THREE.Vector3(0, H + 0.012, 0.1), new THREE.Quaternion(), new THREE.Vector3(5.6, 1, 1)); kb.setMatrixAt(n++, m4);   // space bar
    kb.castShadow = true; kb.receiveShadow = true; g.add(kb);
    const pad = rbox(1.35, 0.012, 0.85, 0.05, mat.glass.clone(), 3); pad.position.set(0, H + 0.004, 0.62); g.add(pad);
    const hinge = new THREE.Group(); hinge.position.set(0, H, -D / 2 + 0.02); g.add(hinge);
    const lid = rbox(W, 0.06, D - 0.05, 0.05, lo.dark ? mat.aluDark : mat.alu); lid.position.set(0, 0.03, -(D - 0.05) / 2); hinge.add(lid);
    const scr = rbox(W - 0.16, 0.01, D - 0.25, 0.03, mat.screen); scr.position.set(0, 0.066, -(D - 0.05) / 2); hinge.add(scr);
    hinge.rotation.x = -(lo.open ?? 1.92);                       // lid open ~110°
    return { group: g, base, keys: kb, pad, lid: hinge, padTop: new THREE.Vector3(0, H + 0.011, 0.62), padSize: [1.35, 0.85] };
  };
  /** finger: stylised 3D index finger with sheen skin + clear-coat nail. The TIP is the group origin; it points down -Y. */
  const finger = () => {
    const g = new THREE.Group(), R0 = 0.082, L = 2.2;            // ~1.6 cm finger at laptop scale (1 unit = 10 cm)
    const body = sh(new THREE.Mesh(new THREE.CapsuleGeometry(R0, L, 12, 32), mat.skin)); body.position.y = R0 + L / 2; g.add(body);
    const nail = sh(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat.nail)); nail.scale.set(0.06, 0.11, 0.022); nail.position.set(0, 0.155, R0 - 0.009); g.add(nail);
    [0.46, 0.7].forEach(y => { const c = new THREE.Mesh(new THREE.TorusGeometry(R0 + 0.001, 0.004, 6, 40, Math.PI * 0.9), new THREE.MeshStandardMaterial({ color: 0xb87a5c, roughness: 0.8 }));
      c.rotation.set(Math.PI / 2, 0, Math.PI * 0.05); c.position.y = y; g.add(c); });
    return g;
  };
  /** projected-capacitive sensor: PCB, row electrodes (diamond chains along x) + column electrodes (along z) and a glowing
   *  node at every crossing. Animate with setRow(i, v) / setCol(j, v) / setNode(i, v), v 0..1 (terracotta rows, cool columns). */
  const sensorGrid = (cols = 9, rows = 6, w = 1.3, d = 0.82, so = {}) => {
    const g = new THREE.Group(), y0 = so.y ?? 0;
    const board = rbox(w * 1.06, 0.03, d * 1.1, 0.02, mat.pcb, 2); board.position.y = y0 - 0.015; g.add(board);
    const xs = Array.from({ length: cols }, (_, i) => -w / 2 + (i + 0.5) * (w / cols)), zs = Array.from({ length: rows }, (_, i) => -d / 2 + (i + 0.5) * (d / rows));
    const dia = new THREE.BoxGeometry(1, 1, 1), rowMats = [], colMats = [];
    const pieceRow = (m, x, z, s) => { const p = new THREE.Mesh(dia, m); p.scale.set(s, 0.006, s); p.rotation.y = Math.PI / 4; p.position.set(x, y0 + 0.003, z); p.receiveShadow = true; return p; };
    zs.forEach(z => { const m = mat.copper(); rowMats.push(m); const tr = new THREE.Mesh(dia, m); tr.scale.set(w, 0.004, 0.01); tr.position.set(0, y0 + 0.002, z); g.add(tr);
      for (let i = 0; i < cols - 1; i++) g.add(pieceRow(m, (xs[i] + xs[i + 1]) / 2, z, (w / cols) * 0.4)); });
    xs.forEach(x => { const m = mat.copper(); m.color.set(0x6a625a); m.roughness = 0.36; colMats.push(m); const tr = new THREE.Mesh(dia, m); tr.scale.set(0.01, 0.004, d); tr.position.set(x, y0 + 0.007, 0); g.add(tr);
      for (let j = 0; j < rows - 1; j++) { const p = pieceRow(m, x, (zs[j] + zs[j + 1]) / 2, (d / rows) * 0.4); p.position.y = y0 + 0.007; g.add(p); } });
    const nodes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.013, 0.013, 0.01, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }), cols * rows);
    const nodePos = [], m4 = new THREE.Matrix4(), col = new THREE.Color();
    zs.forEach(z => xs.forEach(x => { m4.makeTranslation(x, y0 + 0.012, z); nodes.setMatrixAt(nodePos.length, m4); nodes.setColorAt(nodePos.length, col.setRGB(0.05, 0.05, 0.05)); nodePos.push(new THREE.Vector3(x, y0 + 0.012, z)); }));
    g.add(nodes);
    const halo = new THREE.Mesh(new THREE.CircleGeometry(0.05, 32), mat.glow(0xf0a585)); halo.rotation.x = -Math.PI / 2; g.add(halo);
    const ROW = new THREE.Color(0xd97757), COL = new THREE.Color(0x8fa3bf), WHITE = new THREE.Color(0xfff3e8);
    return { group: g, xs, zs, nodePos, nodes, halo,
      setRow: (i, v) => rowMats[i].emissive.copy(ROW).multiplyScalar(v * 1.15),
      setCol: (j, v) => colMats[j].emissive.copy(COL).multiplyScalar(v * 0.75),
      setNode: (i, v) => { nodes.setColorAt(i, col.setRGB(0.05, 0.05, 0.05).lerp(WHITE, v)); nodes.instanceColor.needsUpdate = true; } };
  };
  /** Force-Touch-style trackpad stack: glass · sensor grid · frame with 4 force sensors · Taptic Engine · base.
   *  setExplode(e) spreads the layers (0 assembled → 1 exploded); sensors[i].emissive / taptic.position animate the story. */
  const explodedPad = () => {
    const g = new THREE.Group(), W = 1.35, D = 0.85;
    const glass = rbox(W, 0.025, D, 0.05, mat.glass.clone(), 3);
    const grid = sensorGrid(16, 10, W * 0.94, D * 0.9);
    const frame = new THREE.Group(); const fr = rbox(W * 0.98, 0.02, D * 0.96, 0.04, mat.metal, 2); frame.add(fr);
    const sensors = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => { const m = phys({ color: 0x3a3c40, metalness: 0.6, roughness: 0.4, emissive: 0x000000 });
      const s = rbox(0.13, 0.04, 0.13, 0.02, m, 2); s.position.set(sx * (W / 2 - 0.12), 0.03, sz * (D / 2 - 0.11)); frame.add(s); return m; });
    const taptic = new THREE.Group(); const tb = rbox(0.62, 0.09, 0.18, 0.03, mat.metal, 2); taptic.add(tb);
    const coil = sh(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 32), mat.copper())); coil.rotation.z = Math.PI / 2; coil.position.y = 0.06; taptic.add(coil);
    const tapticGlow = coil.material;
    const base = rbox(W * 1.02, 0.02, D * 1.02, 0.05, mat.aluDark, 2);
    const layers = [glass, grid.group, frame, taptic, base]; layers.forEach(l => g.add(l));
    const rest = [0.225, 0.195, 0.17, 0.06, 0.0];   // assembled stack: nothing pokes through the glass
    const setExplode = (e, gap = 0.36) => layers.forEach((l, i) => { l.position.y = rest[i] + (layers.length - 1 - i) * gap * e; });
    setExplode(0);
    return { group: g, layers, glass, grid, frame, sensors, taptic, tapticGlow, base, setExplode };
  };

  // ---------- camera with intent ----------
  let SHOTS = [{ t: 0, pos: [0, 3, 5], look: [0, 0, 0], fov: o.fov ?? 30 }];
  const shots = k => (SHOTS = k.map(s => ({ fov: o.fov ?? 30, ...s })));
  const camAt = t => {
    let i = 0; for (let j = 0; j < SHOTS.length; j++) if (t >= SHOTS[j].t) i = j;
    const a = SHOTS[i], b = SHOTS[Math.min(i + 1, SHOTS.length - 1)];
    const e = a === b ? 1 : (ease[b.ease || "power2InOut"] || ease.power2InOut)(prog(t, a.t, b.t - a.t));
    const L = (p, q) => p.map((v, k) => lerp(v, q[k], e));
    return { pos: L(a.pos, b.pos), look: L(a.look, b.look), fov: lerp(a.fov, b.fov, e) };
  };
  // beat nudges: on every beat the camera eases (0.7 s) to a new small dolly/orbit offset — a distinct move every
  // ~1.5–2 s like the reference, without ever leaving the keyed path. S.nudges(times, {amp}) (amp in scene units)
  let NB = [], NA = 0.06;
  const nudges = (times, no = {}) => { NB = times.slice().sort((x, y) => x - y); NA = no.amp ?? 0.06; };
  const nudgeAt = t => { let k = -1; for (let j = 0; j < NB.length; j++) if (t >= NB[j]) k = j;
    const N = j => j < 0 ? [0, 0, 0] : [Math.cos(j * 2.39) * NA, Math.sin(j * 1.71) * NA * 0.5, Math.sin(j * 0.9 + 1) * NA];
    const e = k < 0 ? 0 : ease.power2InOut(clamp((t - NB[k]) / 0.7)), A = N(k - 1), B = N(k); return A.map((v, i) => lerp(v, B[i], e)); };
  const tmp = new THREE.Vector3();
  const render = t => {
    const c = camAt(t), dr = o.drift ?? 1, nz = nudgeAt(t);
    c.pos = c.pos.map((v, i) => v + nz[i] * Math.max(0.4, Math.hypot(...c.pos.map((q, k) => q - c.look[k])) / 3));                         // micro hand-held drift: the camera is never locked
    camera.position.set(c.pos[0] + Math.sin(t * 0.71) * 0.012 * dr, c.pos[1] + Math.sin(t * 0.53 + 1.3) * 0.009 * dr, c.pos[2] + Math.sin(t * 0.37 + 2.1) * 0.01 * dr);
    camera.lookAt(tmp.set(c.look[0] + Math.sin(t * 0.43 + 0.7) * 0.006 * dr, c.look[1], c.look[2]));
    if (camera.fov !== c.fov) { camera.fov = c.fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld(); r.render(scene, camera);
  };
  const project = v => { tmp.set(v[0] ?? v.x, v[1] ?? v.y, v[2] ?? v.z).project(camera); return [(tmp.x + 1) / 2 * 1080, (1 - tmp.y) / 2 * 1920, tmp.z]; };
  const S = { THREE, renderer: r, scene, camera, lights: { key, rim, fill }, floor, mat, rbox, laptop, finger, sensorGrid, explodedPad, shots, camAt, render, project, nudges };
  window.S3 = S;
  return S;
}
