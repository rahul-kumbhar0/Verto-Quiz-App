/* Cartoon presenter puppet for the SPEEDY style. Pure function of t, like everything in engine.js.
 *
 *   Avatar.init(el, {style, mode, png})      build once (svg puppet, or png pose sheets)
 *   Avatar.frame(t, poseName, p, prevPose, mouth)   driven by speedy.js every seek
 *   Avatar.POSES                              the pose library (edit / extend freely)
 *
 * SVG mode draws a generic flat-vector presenter (configurable skin/hair/shirt/lens colours).
 * PNG mode shows your own character: one PNG per pose in png.dir (e.g. avatar/point_up.png),
 * optionally <pose>_open.png for the mouth-open frame so the character lip-flaps while talking. */
(function () {
  const A = (window.Avatar = {});
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, p) => a + (b - a) * p;
  const back = p => (p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(9 * p));

  /* Pose = per-arm [shoulderAngle, elbowAngle, handType, handTilt?, handScale?] (angles in degrees,
     "outward from the body" is positive for both arms), plus head tilt / body lift / extras.
     Hand types: relax fist point palm thumb peace pinch */
  A.POSES = {
    talk:        { L: [10, 18, "relax"], R: [10, 18, "relax"], head: 0 },
    explain:     { L: [38, 95, "palm", -40], R: [38, 95, "palm", 40], head: 0 },
    present:     { L: [70, 40, "palm", -60], R: [10, 18, "relax"], head: -3 },
    point_up:    { L: [10, 18, "relax"], R: [155, 10, "point"], head: -4 },
    one:         { L: [10, 18, "relax"], R: [20, 160, "point"], head: -2 },
    two:         { L: [10, 18, "relax"], R: [25, 158, "peace"], head: -2 },
    point_stage: { L: [10, 18, "relax"], R: [118, 22, "point", 10], head: -5 },
    point_side:  { L: [10, 18, "relax"], R: [85, 6, "point", 15], head: -3 },
    point_cam:   { L: [10, 18, "relax"], R: [58, 118, "point", -30, 1.55], head: 2 },
    thumbs:      { L: [10, 18, "relax"], R: [28, 150, "thumb", 10], head: 3 },
    fist_pump:   { L: [10, 18, "relax"], R: [160, 45, "fist"], head: -6, lift: 8 },
    shrug:       { L: [44, 118, "palm", -70], R: [44, 118, "palm", 70], head: 7, lift: 10 },
    facepalm:    { L: [10, 18, "relax"], R: [-16, 172, "palm", 20], head: 8 },
    hands_head:  { L: [-8, 176, "palm", -20], R: [-8, 176, "palm", 20], head: 0, lift: 4 },
    stop:        { L: [10, 18, "relax"], R: [68, 86, "palm", -95], head: -2 },
    think:       { L: [10, 18, "relax"], R: [-6, 158, "fist"], head: 6 },
    pinch:       { L: [10, 18, "relax"], R: [40, 128, "pinch", 20], head: -3 },
    wave:        { L: [10, 18, "relax"], R: [150, 28, "palm", 10], head: -4, wave: true },
    shh:         { L: [10, 18, "relax"], R: [-4, 166, "point", 30], head: 4 },
    cross:       { L: [-14, 112, "fist", 60], R: [-14, 112, "fist", -60], head: 2 },
  };
  A.names = () => Object.keys(A.POSES);

  const STYLE = { skin: "#F2C19C", skinLine: "#B9825C", hair: "#7B4A2D", hairHi: "#9C6238", shirt: "#E53935", shirtLine: "#B71C1C",
                  lens1: "#2ECC71", lens2: "#26C6DA", frame: "#161616", mouth: "#5A1A1A", teeth: "#FFFFFF", tongue: "#D9534F" };
  let el, cfg, S, parts = {}, mode = "svg";

  // ---------- SVG puppet ----------
  const SX = { L: 172, R: 428 }, SY = 452, UP = 150, FO = 148;
  const capsule = (x, y1, y2, w, fill, line) => `<rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${w / 2}" fill="${fill}" stroke="${line}" stroke-width="3"/>`;
  function hand(type) { // local: wrist at (0,0), forearm axis points +y, fingers extend +y
    const sk = S.skin, ln = S.skinLine, f = (x, y1, y2, w) => capsule(x, y1, y2, w, sk, ln);
    const fist = `<rect x="-27" y="-6" width="54" height="60" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/>`;
    switch (type) {
      case "point": return fist + f(0, 40, 104, 18);
      case "peace": return fist + f(-15, 40, 104, 17) + f(13, 40, 104, 17);
      case "thumb": return `<rect x="-27" y="-6" width="54" height="60" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/>` + f(24, 30, 98, 19);
      case "palm":  return `<rect x="-31" y="-6" width="62" height="64" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/>` + f(-23, 44, 96, 15) + f(-8, 44, 108, 15) + f(8, 44, 106, 15) + f(23, 44, 92, 15) + `<rect x="24" y="2" width="16" height="48" rx="8" transform="rotate(-40 32 2)" fill="${sk}" stroke="${ln}" stroke-width="3"/>`;
      case "pinch": return fist + `<circle cx="0" cy="64" r="19" fill="none" stroke="${ln}" stroke-width="3"/><circle cx="0" cy="64" r="16" fill="none" stroke="${sk}" stroke-width="11"/><circle cx="0" cy="64" r="20" fill="none" stroke="${ln}" stroke-width="3"/>`;
      case "fist":  return fist;
      default:      return `<rect x="-25" y="-6" width="50" height="58" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/><path d="M-16 44 q16 10 32 0" fill="none" stroke="${ln}" stroke-width="3"/>`;
    }
  }
  function arm(side) {
    const x = SX[side];
    return `<g class="up" data-side="${side}">
      ${capsule(x, SY, SY + UP, 58, S.skin, S.skinLine)}
      <path d="M${x - 40} ${SY - 14} q40 -18 80 0 v74 q-40 22 -80 0z" fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
      <g class="fo">${capsule(x, SY + UP, SY + UP + FO, 50, S.skin, S.skinLine)}<g class="hand"><g class="hg"></g></g></g></g>`;
  }
  function svg() {
    return `<svg viewBox="0 0 600 640" xmlns="http://www.w3.org/2000/svg">
    <g class="body">
      <path d="M96 640 V530 q0-76 78-100 l64-20 h124 l64 20 q78 24 78 100 V640z" fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M262 356 h76 v64 q-38 36 -76 0z" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path d="M244 426 q56 52 112 0" fill="none" stroke="${S.shirtLine}" stroke-width="4" opacity=".6"/>
      <g class="head">
        <ellipse cx="196" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
        <ellipse cx="404" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
        <ellipse cx="300" cy="248" rx="108" ry="128" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
        <path class="mouthClosed" d="M266 338 q34 24 68 0" fill="none" stroke="${S.skinLine}" stroke-width="5" stroke-linecap="round"/>
        <g class="mouthOpen" opacity="0"><ellipse class="mo" cx="300" cy="340" rx="32" ry="18" fill="${S.mouth}"/><rect class="teeth" x="272" y="324" width="56" height="12" rx="4" fill="${S.teeth}"/><ellipse class="tg" cx="300" cy="354" rx="17" ry="9" fill="${S.tongue}"/></g>
        <path d="M194 232 q-14-112 110-124 q126 -6 112 134 q-10 -62 -62 -76 q-10 30 -40 26 q-48 -4 -68 -32 q-46 20 -52 72z" fill="${S.hair}" stroke="${S.skinLine}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M228 154 q40-44 108-40 q-54 6 -92 50z" fill="${S.hairHi}" opacity=".8"/>
        <path d="M190 236 q110 -22 220 0 l-8 40 q-22 24 -64 20 q-28 -4 -42 -36 q-14 32 -42 36 q-42 4 -64 -20z" fill="url(#lens)" stroke="${S.frame}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M208 248 q36 -12 62 -6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
        <path d="M330 248 q36 -12 62 -6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      </g>
    </g>
    <defs><linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${S.lens1}"/><stop offset=".55" stop-color="${S.lens2}"/><stop offset="1" stop-color="#1DE9B6"/></linearGradient></defs>
    <g class="arms">${arm("L")}${arm("R")}</g>
  </svg>`;
  }

  A.init = (host, c = {}) => {
    el = typeof host === "string" ? document.getElementById(host) : host; cfg = c; S = { ...STYLE, ...(c.style || {}) }; mode = c.mode || "svg";
    if (mode === "png") {
      el.innerHTML = A.names().map(n => `<img data-pose="${n}" src="${c.png.dir}/${n}.png"><img data-pose="${n}" data-open="1" src="${c.png.dir}/${n}_open.png" onerror="this.remove()">`).join("");
      return;
    }
    el.innerHTML = svg();
    parts = { body: el.querySelector(".body"), head: el.querySelector(".head"), mc: el.querySelector(".mouthClosed"), mo: el.querySelector(".mouthOpen"),
              moE: el.querySelector(".mo"), tg: el.querySelector(".tg"), teeth: el.querySelector(".teeth") };
    ["L", "R"].forEach(s => { const up = el.querySelector(`.up[data-side=${s}]`); parts[s] = { up, fo: up.querySelector(".fo"), hand: up.querySelector(".hand"), hg: up.querySelector(".hg"), type: null }; });
  };

  function armPose(side, P, Q, p, t) {
    const a = P[side], b = Q[side], sgn = side === "R" ? -1 : 1, x = SX[side];
    let a1 = lerp(a[0], b[0], p), a2 = lerp(a[1], b[1], p), tilt = lerp(a[3] || 0, b[3] || 0, p), sc = lerp(a[4] || 1, b[4] || 1, p);
    if (Q.wave && side === "R" && p > 0.6) a2 += 14 * Math.sin(t * 2 * Math.PI * 3);
    const g = parts[side];
    g.up.setAttribute("transform", `rotate(${sgn * a1} ${x} ${SY})`);
    g.fo.setAttribute("transform", `rotate(${sgn * a2} ${x} ${SY + UP})`);
    g.hand.setAttribute("transform", `translate(${x} ${SY + UP + FO - 4}) rotate(${sgn * tilt}) scale(${sc * (side === "L" ? -1 : 1)} ${sc})`);
    const type = p < 0.5 ? a[2] : b[2];
    if (g.type !== type) { g.hg.innerHTML = hand(type); g.type = type; }
  }

  /** t, cur pose name, p = eased progress of the switch (0..1), prev pose name, mouth 0..1 */
  A.frame = (t, cur, p, prev, mouth) => {
    if (!el) return;
    if (mode === "png") {
      el.querySelectorAll("img").forEach(im => {
        const on = im.dataset.pose === cur && ((mouth > 0.5) === !!im.dataset.open || !el.querySelector(`img[data-pose=${cur}][data-open]`) && !im.dataset.open);
        im.style.opacity = on ? 1 : 0; im.style.transform = `scale(${lerp(0.96, 1, back(p))})`;
      });
      return;
    }
    const P = A.POSES[prev] || A.POSES.talk, Q = A.POSES[cur] || A.POSES.talk, e = back(p);
    ["L", "R"].forEach(s => armPose(s, P, Q, e, t));
    // motion smear while the pose cuts (the reference shows a 1-2 frame ghost trail on the moving arm)
    const smear = p > 0 && p < 1 ? Math.sin(Math.PI * clamp(p)) : 0;
    el.querySelector(".arms").style.filter = smear > 0.05 && prev !== cur ? `blur(${smear * 7}px)` : "";
    const lift = lerp(P.lift || 0, Q.lift || 0, e), bob = 3 * Math.sin(t * 1.4);
    parts.body.setAttribute("transform", `translate(0 ${bob - lift})`);
    const tilt = lerp(P.head || 0, Q.head || 0, e) + (mouth > 0 ? 1.6 * Math.sin(t * 2 * Math.PI * 1.7) : 0);
    parts.head.setAttribute("transform", `rotate(${tilt} 300 340)`);
    const m = clamp(mouth);
    parts.mo.setAttribute("opacity", m > 0.08 ? 1 : 0); parts.mc.setAttribute("opacity", m > 0.08 ? 0 : 1);
    parts.moE.setAttribute("ry", 6 + 16 * m); parts.moE.setAttribute("cy", 336 + 8 * m);
    parts.tg.setAttribute("cy", 342 + 14 * m); parts.tg.setAttribute("opacity", m > 0.4 ? 1 : 0);
    parts.teeth.setAttribute("opacity", m > 0.25 ? 1 : 0);
  };
})();
