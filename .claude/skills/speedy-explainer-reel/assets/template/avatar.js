/* Cartoon presenter puppet for the SPEEDY style. Pure function of t, like everything in engine.js.
 *
 *   Avatar.init(el, {look, style, mode, png})           build once (svg puppet, or png pose sheets)
 *   Avatar.frame(t, poseName, p, prevPose, mouth, o)    driven by speedy.js every seek; o = {beat, expr}
 *   Avatar.POSES                                        the pose library (edit / extend freely)
 *   Avatar.EXPR                                         facial expressions (brows + mouth): neutral happy
 *                                                       excited surprised think serious unsure
 * Life: breathing, per-pose body lean, a head nod + arm beat on stressed words (o.beat 0..1), expression
 * per pose (pose.expr) unless o.expr overrides. Animated poses: wave, wag, clap, typing.
 *
 * Two built-in SVG looks:
 *   look:"street"  (default) — oversized drop-shoulder tee, chest print, chain, messy hair,
 *                   rounded shades. The house character.
 *   look:"classic" — fitted red tee + sport sunglasses (the first-generation puppet).
 *   look:"hoodie"  — the street head (mop hair, rounded shades) in a hoodie with drawstrings + front pocket.
 * Both recolour through `style` tokens. PNG mode shows your own character instead:
 * one PNG per pose in png.dir (e.g. avatar/point_up.png), optional <pose>_open.png for lip flap. */
(function () {
  const A = (window.Avatar = {});
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, p) => a + (b - a) * p;
  const back = p => (p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(9 * p));

  /* Pose = per-arm [shoulderAngle, elbowAngle, handType, handTilt?, handScale?] (degrees, outward
     positive for both arms), plus head tilt / body lift / extras.
     Hands: relax fist point palm thumb peace pinch */
  A.POSES = {
    talk:        { L: [10, 18, "relax"], R: [10, 18, "relax"], head: 0 },
    explain:     { L: [38, 95, "palm", -40], R: [38, 95, "palm", 40], head: 0 },
    present:     { L: [70, 40, "palm", -60], R: [10, 18, "relax"], head: -3, lean: -2, expr: "happy" },
    point_up:    { L: [10, 18, "relax"], R: [155, 10, "point"], head: -4 },
    one:         { L: [10, 18, "relax"], R: [20, 160, "point"], head: -2 },
    two:         { L: [10, 18, "relax"], R: [25, 158, "peace"], head: -2 },
    three:       { L: [10, 18, "relax"], R: [25, 158, "three"], head: -2 },
    point_stage: { L: [10, 18, "relax"], R: [118, 22, "point", 10], head: -5, lean: 2 },
    point_side:  { L: [10, 18, "relax"], R: [85, 6, "point", 15], head: -3, lean: 2 },
    point_cam:   { L: [10, 18, "relax"], R: [58, 118, "point", -30, 1.55], head: 2, expr: "happy" },
    lean_in:     { L: [10, 18, "relax"], R: [58, 118, "point", -30, 1.6], head: 4, lean: 0, scale: 1.05, expr: "excited" },
    thumbs:      { L: [10, 18, "relax"], R: [28, 150, "thumb", 10], head: 3, expr: "happy" },
    fist_pump:   { L: [10, 18, "relax"], R: [160, 45, "fist"], head: -6, lift: 8, expr: "excited" },
    celebrate:   { L: [138, 4, "fist"], R: [138, 4, "fist"], head: -6, lift: 12, expr: "excited" },
    shrug:       { L: [44, 118, "palm", -70], R: [44, 118, "palm", 70], head: 7, lift: 10, expr: "unsure" },
    facepalm:    { L: [10, 18, "relax"], R: [-16, 172, "palm", 20], head: 8, expr: "serious" },
    hands_head:  { L: [-8, 176, "palm", -20], R: [-8, 176, "palm", 20], head: 0, lift: 4, expr: "surprised" },
    big:         { L: [36, 108, "palm", -55], R: [36, 108, "palm", 55], head: -3, lift: 6, expr: "surprised" },
    small:       { L: [14, -122, "pinch", -20], R: [14, -122, "pinch", 20], head: 5, expr: "think" },
    stop:        { L: [10, 18, "relax"], R: [68, 86, "palm", -95], head: -2, expr: "serious" },
    wag:         { L: [10, 18, "relax"], R: [140, 30, "point", 0], head: 4, expr: "serious", wag: true },
    think:       { L: [10, 18, "relax"], R: [-6, 158, "fist"], head: 6, expr: "think" },
    pinch:       { L: [10, 18, "relax"], R: [40, 128, "pinch", 20], head: -3 },
    typing:      { L: [12, -92, "relax", -10], R: [12, -92, "relax", 10], head: 6, expr: "think", typing: true },
    clap:        { L: [34, -108, "palm", -75], R: [34, -108, "palm", 75], head: -2, expr: "excited", clap: true },
    wave:        { L: [10, 18, "relax"], R: [150, 28, "palm", 10], head: -4, wave: true, expr: "happy" },
    hold:        { L: [10, 18, "relax"], R: [52, 92, "fist", -10], head: 3, expr: "happy" },          // shows a prop at chest height
    double_thumbs: { L: [28, 150, "thumb", -10], R: [28, 150, "thumb", 10], head: 3, lift: 6, expr: "excited" },   // signature sign-off
    shh:         { L: [10, 18, "relax"], R: [-4, 166, "point", 30], head: 4, expr: "think" },
    cross:       { L: [-14, 112, "fist", 60], R: [-14, 112, "fist", -60], head: 2, expr: "serious" },
  };
  /* Expressions: brow lift (px, negative = up), brow angle (deg, positive = inner ends down = frown),
     per-side extra lift for one raised brow, and the closed-mouth shape. */
  A.EXPR = {
    neutral:   { by: 0, ba: 0, mouth: "M266 338 q34 24 68 0" },
    happy:     { by: -5, ba: -4, mouth: "M260 332 q40 42 80 0" },
    excited:   { by: -12, ba: -6, mouth: "M258 330 q42 48 84 0" },
    surprised: { by: -16, ba: -8, mouth: "o" },
    think:     { by: 2, ba: 4, byL: -9, mouth: "M270 344 q26 4 54 -8" },
    serious:   { by: 5, ba: 12, mouth: "M270 344 q30 0 60 0" },
    unsure:    { by: -8, ba: -10, mouth: "M268 344 q32 -8 64 0" },
  };
  A.names = () => Object.keys(A.POSES);

  const STYLES = {
    street:  { skin: "#F0BE97", skinLine: "#B07F58", hair: "#26211E", hairHi: "#4A4138", shirt: "#23252B", shirtLine: "#101115",
               print: "#3ECF8E", chain: "#F2C14E", lens1: "#36E2A0", lens2: "#27C4E8", frame: "#17181B", under: "#15161A",
               mouth: "#5A1A1A", teeth: "#FFFFFF", tongue: "#D9534F" },
    hoodie:  { skin: "#F0BE97", skinLine: "#B07F58", hair: "#26211E", hairHi: "#4A4138", shirt: "#6D28D9", shirtLine: "#3B0F80",
               print: "none", chain: "none", lens1: "#F472B6", lens2: "#A855F7", frame: "#17181B", under: "#5B21B6",
               mouth: "#5A1A1A", teeth: "#FFFFFF", tongue: "#D9534F", string: "#F5F3FF" },
    classic: { skin: "#F2C19C", skinLine: "#B9825C", hair: "#7B4A2D", hairHi: "#9C6238", shirt: "#E53935", shirtLine: "#B71C1C",
               print: "none", chain: "none", lens1: "#2ECC71", lens2: "#26C6DA", frame: "#161616", under: "#B71C1C",
               mouth: "#5A1A1A", teeth: "#FFFFFF", tongue: "#D9534F" },
  };
  let el, cfg, S, LOOK, parts = {}, mode = "svg";

  // ---------- accessories (avatar:{accessory:"grad"|"headset"|"detective"}), reaction FX, hand props ----------
  const ACC = {
    grad: `<g><path d="M300 92 l150 52 -150 52 -150 -52z" fill="#1F2937" stroke="#0B0F19" stroke-width="4"/><path d="M220 160 v40 q80 40 160 0 v-40" fill="#111827" stroke="#0B0F19" stroke-width="4"/>
           <path d="M430 150 v62" stroke="#F2C14E" stroke-width="6"/><circle cx="430" cy="218" r="10" fill="#F2C14E"/></g>`,
    headset: `<g><path d="M186 250 q-6 -170 114 -176 q120 6 114 176" fill="none" stroke="#1F2937" stroke-width="16" stroke-linecap="round"/>
           <rect x="164" y="230" width="34" height="64" rx="14" fill="#374151"/><rect x="402" y="230" width="34" height="64" rx="14" fill="#374151"/>
           <path d="M180 292 q10 60 92 66" fill="none" stroke="#374151" stroke-width="7"/><circle cx="276" cy="358" r="10" fill="#111827"/></g>`,
    detective: `<g><ellipse cx="300" cy="150" rx="176" ry="30" fill="#7C5A3A" stroke="#4A3422" stroke-width="4"/><path d="M196 150 q-4 -90 104 -96 q108 6 104 96z" fill="#8B6844" stroke="#4A3422" stroke-width="4"/>
           <path d="M200 138 q100 18 200 0" fill="none" stroke="#3B2A1A" stroke-width="12"/></g>`,
  };
  const FX_SVG = `
    <g class="fx-bulb" opacity="0"><circle cx="300" cy="10" r="46" fill="#FDE68A" opacity=".35"/><text x="300" y="34" font-size="72" text-anchor="middle">💡</text></g>
    <g class="fx-q" opacity="0"><text x="300" y="40" font-size="80" font-weight="900" text-anchor="middle" fill="#60A5FA" font-family="Inter" stroke="#1E3A8A" stroke-width="3">???</text></g>
    <g class="fx-sweat" opacity="0"><path d="M430 170 q-20 34 0 46 q20 -12 0 -46z" fill="#7DD3FC" stroke="#0369A1" stroke-width="3"/></g>
    <g class="fx-spark" opacity="0"><text x="150" y="120" font-size="56">✨</text><text x="420" y="80" font-size="44">✨</text><text x="470" y="200" font-size="36">✨</text></g>
    <g class="fx-steam" opacity="0"><text x="150" y="250" font-size="54" text-anchor="middle">💨</text><text x="455" y="250" font-size="54" text-anchor="middle" transform="scale(-1 1) translate(-910 0)">💨</text></g>`;
  const PROP = {
    paper: `<g transform="translate(-60 -110) rotate(-6)"><rect width="120" height="158" rx="8" fill="#fff" stroke="#9CA3AF" stroke-width="3"/><rect x="14" y="14" width="60" height="12" rx="4" fill="#1F2937"/>
            <rect x="14" y="40" width="92" height="7" rx="3" fill="#D1D5DB"/><rect x="14" y="56" width="80" height="7" rx="3" fill="#D1D5DB"/><rect x="14" y="78" width="92" height="7" rx="3" fill="#BDEBD4"/><rect x="14" y="94" width="70" height="7" rx="3" fill="#D1D5DB"/><rect x="14" y="116" width="86" height="7" rx="3" fill="#D1D5DB"/>
            <text x="60" y="150" font-family="Inter" font-weight="800" font-size="14" text-anchor="middle" fill="#6B7280">RESUME</text></g>`,
    phone: `<g transform="translate(-40 -120)"><rect width="80" height="150" rx="16" fill="#111827" stroke="#374151" stroke-width="4"/><rect x="7" y="12" width="66" height="122" rx="9" fill="#3B82F6"/>
            <rect x="16" y="26" width="48" height="10" rx="5" fill="#fff" opacity=".9"/><rect x="16" y="44" width="40" height="10" rx="5" fill="#fff" opacity=".6"/></g>`,
    chai: `<g transform="translate(-44 -96)"><path d="M0 20 h78 l-8 70 q-2 10 -12 10 h-38 q-10 0 -12 -10z" fill="#FDF6E3" stroke="#92400E" stroke-width="4"/><path d="M78 36 q24 4 18 26 q-4 14 -22 12" fill="none" stroke="#92400E" stroke-width="6"/>
            <path d="M6 26 h66" stroke="#B45309" stroke-width="8"/><path d="M22 10 q-8 -12 2 -22 M44 10 q-8 -12 2 -22" fill="none" stroke="#D1D5DB" stroke-width="5" stroke-linecap="round" class="steam"/></g>`,
    magnifier: `<g transform="translate(-20 -120)"><circle cx="40" cy="40" r="38" fill="#BFDBFE" fill-opacity=".45" stroke="#1F2937" stroke-width="10"/><path d="M64 68 l34 40" stroke="#1F2937" stroke-width="16" stroke-linecap="round"/></g>`,
  };

  // ---------- SVG puppet ----------
  const SX = { L: 168, R: 432 }, SY = 452, UP = 150, FO = 148;
  const capsule = (x, y1, y2, w, fill, line) => `<rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${w / 2}" fill="${fill}" stroke="${line}" stroke-width="3"/>`;
  function hand(type) { // wrist at (0,0), fingers extend +y
    const sk = S.skin, ln = S.skinLine, f = (x, y1, y2, w) => capsule(x, y1, y2, w, sk, ln);
    const fist = `<rect x="-27" y="-6" width="54" height="60" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/>`;
    switch (type) {
      case "point": return fist + f(0, 40, 104, 18);
      case "peace": return fist + f(-15, 40, 104, 17) + f(13, 40, 104, 17);
      case "three": return fist + f(-18, 40, 98, 15) + f(0, 40, 106, 15) + f(18, 40, 98, 15);
      case "thumb": return fist + f(24, 30, 98, 19);
      case "palm":  return `<rect x="-31" y="-6" width="62" height="64" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/>` + f(-23, 44, 96, 15) + f(-8, 44, 108, 15) + f(8, 44, 106, 15) + f(23, 44, 92, 15) + `<rect x="24" y="2" width="16" height="48" rx="8" transform="rotate(-40 32 2)" fill="${sk}" stroke="${ln}" stroke-width="3"/>`;
      case "pinch": return fist + `<circle cx="0" cy="64" r="16" fill="none" stroke="${sk}" stroke-width="11"/><circle cx="0" cy="64" r="21" fill="none" stroke="${ln}" stroke-width="3"/><circle cx="0" cy="64" r="11" fill="none" stroke="${ln}" stroke-width="3"/>`;
      case "fist":  return fist;
      default:      return `<rect x="-25" y="-6" width="50" height="58" rx="20" fill="${sk}" stroke="${ln}" stroke-width="3"/><path d="M-16 44 q16 10 32 0" fill="none" stroke="${ln}" stroke-width="3"/>`;
    }
  }
  function arm(side) {
    const x = SX[side], sgn = side === "R" ? 1 : -1;
    const longSleeve = LOOK === "hoodie";
    const sleeve = LOOK === "street" || longSleeve
      // oversized drop sleeve: rounded shoulder cap draping to a wide cuff above the elbow
      ? `<path d="M${x - 54} ${SY - 6} q-4 -36 32 -44 q22 -4 44 0 q36 8 32 44 l9 102 q-63 30 -126 0z"
           fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
         <path d="M${x - 58} ${SY + 92} q58 26 116 0" fill="none" stroke="${S.shirtLine}" stroke-width="4" opacity=".65"/>
         <path d="M${x - 34} ${SY + 10} q-8 40 -4 66 M${x + 30} ${SY + 10} q8 40 4 66" fill="none" stroke="${S.shirtLine}" stroke-width="2.5" opacity=".3"/>`
      : `<path d="M${x - 44} ${SY - 20} h88 l6 96 h-100z" fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>`;
    // hoodie: the sleeve runs to the wrist (shirt-coloured upper arm + forearm, ribbed cuff above the hand)
    const upper = longSleeve ? capsule(x, SY, SY + UP, 58, S.shirt, S.shirtLine) : capsule(x, SY, SY + UP, LOOK === "street" ? 50 : 58, S.skin, S.skinLine);
    const fore = longSleeve
      ? capsule(x, SY + UP, SY + UP + FO, 54, S.shirt, S.shirtLine) + `<rect x="${x - 27}" y="${SY + UP + FO - 34}" width="54" height="20" rx="8" fill="${S.under}" stroke="${S.shirtLine}" stroke-width="3"/>`
      : capsule(x, SY + UP, SY + UP + FO, 46, S.skin, S.skinLine);
    return `<g class="up" data-side="${side}">
      ${upper}
      ${sleeve}
      <g class="fo">${fore}<g class="hand"><g class="hg"></g></g></g></g>`;
  }
  function bodyStreet() {
    return `
      <path d="M86 640 V560 q0-86 86-114 l66-24 h124 l66 24 q86 28 86 114 V640z"
        fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M196 448 l-16 60 M404 448 l16 60" stroke="${S.shirtLine}" stroke-width="3.5" opacity=".65"/>  <!-- drop-shoulder seams -->
      <path d="M150 596 q150 26 300 0" fill="none" stroke="${S.shirtLine}" stroke-width="3" opacity=".35"/>   <!-- hem fold -->
      <path d="M262 356 h76 v64 q-38 36 -76 0z" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path d="M236 430 q64 54 128 0 l-6 22 q-58 44 -116 0z" fill="${S.under}" stroke="${S.shirtLine}" stroke-width="3"/>  <!-- ribbed collar -->
      ${S.chain === "none" ? "" : `<path class="chain" d="M254 462 q46 44 92 0" fill="none" stroke="${S.chain}" stroke-width="7" stroke-dasharray="2 7" stroke-linecap="round"/>
      <circle cx="300" cy="505" r="9" fill="${S.chain}" stroke="#A97C18" stroke-width="2"/>`}
      ${S.print === "none" ? "" : `<g class="print" transform="translate(272 520) scale(0.52)" opacity=".92">
        <path d="M63.7 110.3c-2.8 3.6-8.6 1.6-8.7-3l-1-67h45.1c8.2 0 12.7 9.4 7.7 15.9z" fill="${S.print}"/>
        <path d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.5 67H9.8C1.6 72.1-3 62.7 2.1 56.2z" fill="${S.print}" opacity=".85"/></g>`}`;
  }
  function bodyHoodie() {
    return `
      <path d="M86 640 V560 q0-86 86-114 l66-24 h124 l66 24 q86 28 86 114 V640z"
        fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M196 448 l-16 60 M404 448 l16 60" stroke="${S.shirtLine}" stroke-width="3.5" opacity=".55"/>
      <path d="M262 356 h76 v64 q-38 36 -76 0z" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path d="M188 452 q112 -110 224 0 q-22 52 -112 56 q-90 -4 -112 -56z" fill="${S.under}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>  <!-- hood folded behind the neck -->
      <path d="M236 432 q64 50 128 0 q-10 30 -64 34 q-54 -4 -64 -34z" fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3"/>  <!-- neck opening -->
      <path d="M282 466 q-4 40 -8 74 M318 466 q4 40 8 74" stroke="${S.string ?? "#fff"}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="274" cy="544" r="6" fill="${S.string ?? "#fff"}"/><circle cx="326" cy="544" r="6" fill="${S.string ?? "#fff"}"/>
      <path d="M212 640 v-34 q88 -26 176 0 v34" fill="none" stroke="${S.shirtLine}" stroke-width="3" opacity=".55"/>  <!-- front pocket -->`;
  }
  function bodyClassic() {
    return `
      <path d="M96 640 V530 q0-76 78-100 l64-20 h124 l64 20 q78 24 78 100 V640z" fill="${S.shirt}" stroke="${S.shirtLine}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M262 356 h76 v64 q-38 36 -76 0z" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path d="M244 426 q56 52 112 0" fill="none" stroke="${S.shirtLine}" stroke-width="4" opacity=".6"/>`;
  }
  function headStreet() {
    return `
      <ellipse cx="196" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <ellipse cx="404" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <circle cx="404" cy="282" r="6" fill="${S.chain === "none" ? S.skinLine : S.chain}"/>          <!-- earring -->
      <ellipse cx="300" cy="248" rx="108" ry="128" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path class="mouthClosed" d="M266 338 q34 24 68 0" fill="none" stroke="${S.skinLine}" stroke-width="5" stroke-linecap="round"/>
      <g class="mouthOpen" opacity="0"><ellipse class="mo" cx="300" cy="340" rx="32" ry="18" fill="${S.mouth}"/><rect class="teeth" x="272" y="324" width="56" height="12" rx="4" fill="${S.teeth}"/><ellipse class="tg" cx="300" cy="354" rx="17" ry="9" fill="${S.tongue}"/></g>
      <path d="M268 384 q32 14 64 0" fill="none" stroke="${S.skinLine}" stroke-width="3" opacity=".4"/>  <!-- chin -->
      <!-- messy mop hair: big rounded mass, choppy fringe hanging toward the shades, side chunks over the ears -->
      <path d="M180 252 q-34 -158 120 -162 q158 -4 124 166 q-8 -62 -46 -86 q8 28 -12 38 q-2 -34 -30 -48 q8 28 -14 38 q-8 -32 -38 -42 q4 28 -20 36 q-12 -26 -38 -28 q-24 16 -26 52 q-16 12 -20 36z"
        fill="${S.hair}" stroke="#15120F" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M186 234 q-14 34 2 62 q-20 -10 -26 -40z" fill="${S.hair}" stroke="#15120F" stroke-width="3" stroke-linejoin="round"/>
      <path d="M414 234 q14 34 -2 62 q20 -10 26 -40z" fill="${S.hair}" stroke="#15120F" stroke-width="3" stroke-linejoin="round"/>
      <path d="M210 150 q48 -46 126 -40 q-66 4 -108 48z" fill="${S.hairHi}" opacity=".85"/>
      <path d="M356 124 q40 18 54 60 q-26 -30 -60 -40z" fill="${S.hairHi}" opacity=".6"/>
      <g class="brows"><path class="brow" data-s="L" d="M204 214 q36 -14 74 -2" fill="none" stroke="#15120F" stroke-width="11" stroke-linecap="round"/>
        <path class="brow" data-s="R" d="M322 212 q38 -12 74 2" fill="none" stroke="#15120F" stroke-width="11" stroke-linecap="round"/></g>
      <g class="eyes" opacity="0"><ellipse cx="242" cy="256" rx="34" ry="40" fill="#fff" stroke="#15120F" stroke-width="4"/><ellipse cx="358" cy="256" rx="34" ry="40" fill="#fff" stroke="#15120F" stroke-width="4"/>
        <circle class="pup" cx="246" cy="262" r="15" fill="#15120F"/><circle class="pup" cx="354" cy="262" r="15" fill="#15120F"/><circle cx="251" cy="255" r="5" fill="#fff"/><circle cx="359" cy="255" r="5" fill="#fff"/></g>
      <!-- rounded shades -->
      <g class="shades">
        <rect x="192" y="226" width="100" height="62" rx="30" fill="url(#lens)" stroke="${S.frame}" stroke-width="7"/>
        <rect x="308" y="226" width="100" height="62" rx="30" fill="url(#lens)" stroke="${S.frame}" stroke-width="7"/>
        <path d="M292 252 h16" stroke="${S.frame}" stroke-width="8" stroke-linecap="round"/>
        <path d="M192 250 h-14 M408 250 h14" stroke="${S.frame}" stroke-width="7" stroke-linecap="round"/>
        <path d="M206 244 q28 -10 50 -4" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
        <path d="M322 244 q28 -10 50 -4" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
      </g>`;
  }
  function headClassic() {
    return `
      <ellipse cx="196" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <ellipse cx="404" cy="258" rx="20" ry="28" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <ellipse cx="300" cy="248" rx="108" ry="128" fill="${S.skin}" stroke="${S.skinLine}" stroke-width="3"/>
      <path class="mouthClosed" d="M266 338 q34 24 68 0" fill="none" stroke="${S.skinLine}" stroke-width="5" stroke-linecap="round"/>
      <g class="mouthOpen" opacity="0"><ellipse class="mo" cx="300" cy="340" rx="32" ry="18" fill="${S.mouth}"/><rect class="teeth" x="272" y="324" width="56" height="12" rx="4" fill="${S.teeth}"/><ellipse class="tg" cx="300" cy="354" rx="17" ry="9" fill="${S.tongue}"/></g>
      <path d="M194 232 q-14-112 110-124 q126 -6 112 134 q-10 -62 -62 -76 q-10 30 -40 26 q-48 -4 -68 -32 q-46 20 -52 72z" fill="${S.hair}" stroke="${S.skinLine}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M228 154 q40-44 108-40 q-54 6 -92 50z" fill="${S.hairHi}" opacity=".8"/>
      <g class="brows"><path class="brow" data-s="L" d="M204 220 q36 -14 74 -2" fill="none" stroke="#15120F" stroke-width="11" stroke-linecap="round"/>
        <path class="brow" data-s="R" d="M322 218 q38 -12 74 2" fill="none" stroke="#15120F" stroke-width="11" stroke-linecap="round"/></g>
      <g class="eyes" opacity="0"><ellipse cx="242" cy="256" rx="34" ry="40" fill="#fff" stroke="#15120F" stroke-width="4"/><ellipse cx="358" cy="256" rx="34" ry="40" fill="#fff" stroke="#15120F" stroke-width="4"/>
        <circle class="pup" cx="246" cy="262" r="15" fill="#15120F"/><circle class="pup" cx="354" cy="262" r="15" fill="#15120F"/><circle cx="251" cy="255" r="5" fill="#fff"/><circle cx="359" cy="255" r="5" fill="#fff"/></g>
      <path class="shades" d="M190 236 q110 -22 220 0 l-8 40 q-22 24 -64 20 q-28 -4 -42 -36 q-14 32 -42 36 q-42 4 -64 -20z" fill="url(#lens)" stroke="${S.frame}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M208 248 q36 -12 62 -6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      <path d="M330 248 q36 -12 62 -6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>`;
  }
  function svg() {
    return `<svg viewBox="0 0 600 640" xmlns="http://www.w3.org/2000/svg" overflow="visible" style="overflow:visible">
    <g class="body">
      ${LOOK === "street" ? bodyStreet() : LOOK === "hoodie" ? bodyHoodie() : bodyClassic()}
      <g class="head">${LOOK === "classic" ? headClassic() : headStreet()}${ACC[cfg.accessory] || ""}</g>
    </g>
    <defs><linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${S.lens1}"/><stop offset=".55" stop-color="${S.lens2}"/><stop offset="1" stop-color="#1DE9B6"/></linearGradient></defs>
    <g class="arms">${arm("L")}${arm("R")}</g>
    <g class="prop"></g>
    <g class="fx">${FX_SVG}</g>
  </svg>`;
  }

  A.init = (host, c = {}) => {
    el = typeof host === "string" ? document.getElementById(host) : host; cfg = c;
    LOOK = c.look || "street";
    S = { ...(STYLES[LOOK] || STYLES.street), ...(c.style || {}) }; mode = c.mode || "svg";
    if (mode === "png") {
      el.innerHTML = A.names().map(n => `<img data-pose="${n}" src="${c.png.dir}/${n}.png"><img data-pose="${n}" data-open="1" src="${c.png.dir}/${n}_open.png" onerror="this.remove()">`).join("");
      return;
    }
    el.innerHTML = svg();
    parts = { body: el.querySelector(".body"), head: el.querySelector(".head"), mc: el.querySelector(".mouthClosed"), mo: el.querySelector(".mouthOpen"),
              moE: el.querySelector(".mo"), tg: el.querySelector(".tg"), teeth: el.querySelector(".teeth"),
              bL: el.querySelector('.brow[data-s="L"]'), bR: el.querySelector('.brow[data-s="R"]'),
              shades: el.querySelector(".shades"), eyes: el.querySelector(".eyes"), prop: el.querySelector(".prop"), fx: el.querySelector(".fx") };
    ["L", "R"].forEach(s => { const up = el.querySelector(`.up[data-side=${s}]`); parts[s] = { up, fo: up.querySelector(".fo"), hand: up.querySelector(".hand"), hg: up.querySelector(".hg"), type: null }; });
  };

  function armPose(side, P, Q, p, t, beat) {
    const a = P[side], b = Q[side], sgn = side === "R" ? -1 : 1, x = SX[side];
    let a1 = lerp(a[0], b[0], p), a2 = lerp(a[1], b[1], p), tilt = lerp(a[3] || 0, b[3] || 0, p), sc = lerp(a[4] || 1, b[4] || 1, p);
    const live = p > 0.6 ? 1 : 0;
    if (Q.wave && side === "R") a2 += live * 14 * Math.sin(t * 2 * Math.PI * 3);
    if (Q.wag && side === "R") tilt += live * 22 * Math.sin(t * 2 * Math.PI * 3.2);              // "no no" finger wag
    if (Q.clap) a1 -= live * 9 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 3.4));                 // hands meet and part
    if (Q.typing) a2 += live * 7 * Math.sin(t * 2 * Math.PI * (side === "R" ? 5.3 : 4.7) + (side === "R" ? 1 : 0));
    // beat: the gesturing arm (the one away from rest) bumps on stressed words
    const active = b[0] > 20 || b[1] > 60;
    if (active) { a1 += 7 * beat; a2 -= 5 * beat; }
    const g = parts[side];
    g.up.setAttribute("transform", `rotate(${sgn * a1} ${x} ${SY})`);
    g.fo.setAttribute("transform", `rotate(${sgn * a2} ${x} ${SY + UP})`);
    g.hand.setAttribute("transform", `translate(${x} ${SY + UP + FO - 4}) rotate(${sgn * tilt}) scale(${sc * (side === "L" ? -1 : 1)} ${sc})`);
    const type = p < 0.5 ? a[2] : b[2];
    if (g.type !== type) { g.hg.innerHTML = hand(type); g.type = type; }
    const r = Math.PI / 180, t1 = sgn * a1 * r, t2 = sgn * (a1 + a2) * r;
    const ex = x - UP * Math.sin(t1), ey = SY + UP * Math.cos(t1), wx = ex - (FO - 4) * Math.sin(t2), wy = ey + (FO - 4) * Math.cos(t2);
    return [wx - 30 * Math.sin(t2), wy + 30 * Math.cos(t2)];
  }

  /** t, cur pose name, p = eased progress of the switch (0..1), prev pose name, mouth 0..1 */
  A.frame = (t, cur, p, prev, mouth, o = {}) => {
    if (!el) return;
    if (mode === "png") {
      el.querySelectorAll("img").forEach(im => {
        const on = im.dataset.pose === cur && ((mouth > 0.5) === !!im.dataset.open || !el.querySelector(`img[data-pose=${cur}][data-open]`) && !im.dataset.open);
        im.style.opacity = on ? 1 : 0; im.style.transform = `scale(${lerp(0.96, 1, back(p))})`;
      });
      return;
    }
    const P = A.POSES[prev] || A.POSES.talk, Q = A.POSES[cur] || A.POSES.talk, e = back(p), beat = clamp(o.beat || 0);
    const handR = armPose("R", P, Q, e, t, beat); armPose("L", P, Q, e, t, beat);
    // motion smear while the pose cuts (the reference shows a 1-2 frame ghost trail on the moving arm)
    const smear = p > 0 && p < 1 ? Math.sin(Math.PI * clamp(p)) : 0;
    el.querySelector(".arms").style.filter = smear > 0.05 && prev !== cur ? `blur(${smear * 7}px)` : "";
    const lift = lerp(P.lift || 0, Q.lift || 0, e), bob = 3 * Math.sin(t * 1.4) + 4 * beat;
    const lean = lerp(P.lean || 0, Q.lean || 0, e), sc = lerp(P.scale || 1, Q.scale || 1, e), breathe = 1 + 0.008 * Math.sin(t * 2 * Math.PI * 0.25);
    parts.body.setAttribute("transform", `translate(0 ${bob - lift}) rotate(${lean} 300 640) translate(300 640) scale(${sc} ${sc * breathe}) translate(-300 -640)`);
    const tilt = lerp(P.head || 0, Q.head || 0, e) + (mouth > 0 ? 1.6 * Math.sin(t * 2 * Math.PI * 1.7) : 0) + 3.5 * beat;   // nod on stressed words
    parts.head.setAttribute("transform", `rotate(${tilt} 300 340)`);
    // expression: brows + resting mouth (talking mouth still flaps over it)
    const XP = A.EXPR[o.exprPrev || P.expr || "neutral"] || A.EXPR.neutral, XQ = A.EXPR[o.expr || Q.expr || "neutral"] || A.EXPR.neutral, xe = o.expr ? clamp(o.exprP ?? e) : e;
    if (parts.bL) {
      const by = lerp(XP.by, XQ.by, xe) - 3 * beat, ba = lerp(XP.ba, XQ.ba, xe);
      parts.bL.setAttribute("transform", `translate(0 ${by + lerp(XP.byL || 0, XQ.byL || 0, xe)}) rotate(${ba} 241 207)`);
      parts.bR.setAttribute("transform", `translate(0 ${by + lerp(XP.byR || 0, XQ.byR || 0, xe)}) rotate(${-ba} 359 207)`);
    }
    const XM = xe < 0.5 ? XP : XQ;
    let m = clamp(mouth);
    if (XM.mouth === "o") m = Math.max(m, 0.55);                      // surprised: mouth stays an "o" between words
    else parts.mc.setAttribute("d", XM.mouth);
    parts.mo.setAttribute("opacity", m > 0.08 ? 1 : 0); parts.mc.setAttribute("opacity", m > 0.08 ? 0 : 1);
    parts.moE.setAttribute("ry", 6 + 16 * m); parts.moE.setAttribute("cy", 336 + 8 * m);
    parts.tg.setAttribute("cy", 342 + 14 * m); parts.tg.setAttribute("opacity", m > 0.4 ? 1 : 0);
    parts.teeth.setAttribute("opacity", m > 0.25 ? 1 : 0);
    // shades-slide gag: shades drop to the chin, cartoon eyes pop (o.shades 0..1)
    const sh = clamp(o.shades || 0);
    if (parts.shades) {
      const fl = clamp(o.flip || 0), up = Math.sin(Math.PI * fl);          // signature flip: shades lift and drop back
      parts.shades.setAttribute("transform", `translate(0 ${86 * back(sh) - 58 * up}) rotate(${-6 * sh + 8 * up} 300 256)`);
      parts.shades.style.filter = fl > 0.55 && fl < 0.95 ? `drop-shadow(0 0 ${14 * Math.sin(Math.PI * (fl - 0.55) / 0.4)}px #fff)` : "";
      parts.eyes.setAttribute("opacity", sh > 0.05 || up > 0.25 ? 1 : 0);
      parts.eyes.setAttribute("transform", `translate(300 256) scale(${sh > 0.05 ? lerp(0.6, 1.18, back(sh)) : 0.62}) translate(-300 -256)`);
    }
    // reaction FX above the head (o.fx = [[name, p 0..1]]): bulb ??? sweat spark steam
    if (parts.fx) {
      ["bulb", "q", "sweat", "spark", "steam"].forEach(n => {
        const g = parts.fx.querySelector(".fx-" + n), f = (o.fx || []).find(x => x[0] === n), q = f ? f[1] : 0;
        const vis = q <= 0 || q >= 1 ? 0 : Math.min(1, q * 5, (1 - q) * 4), pop = back(clamp(q * 3));
        g.setAttribute("opacity", vis);
        const dy = n === "sweat" ? 40 * q : n === "steam" ? -14 * Math.sin(q * 20) : -8 * Math.sin(q * 12), sc = lerp(0.5, 1, pop);
        g.setAttribute("transform", `translate(300 120) scale(${sc}) translate(-300 -120) translate(0 ${dy})`);
      });
    }
    // prop in the right hand (o.prop = [name, p]): drawn upright at the hand position
    if (parts.prop) {
      const pr = o.prop && o.prop[0], pp = o.prop ? clamp(o.prop[1]) : 0;
      if (parts.prop.dataset.n !== (pr || "")) { parts.prop.innerHTML = pr ? PROP[pr] || "" : ""; parts.prop.dataset.n = pr || ""; }
      parts.prop.setAttribute("opacity", pr ? Math.min(1, pp * 4) : 0);
      parts.prop.setAttribute("transform", `translate(${handR[0]} ${handR[1]}) scale(${lerp(0.4, 1, back(clamp(pp * 2.5)))}) rotate(${4 * Math.sin(t * 2)})`);
      const st = parts.prop.querySelector(".steam"); if (st) st.setAttribute("transform", `translate(0 ${-6 * ((t * 1.5) % 1)})`);
    }
  };
})();
