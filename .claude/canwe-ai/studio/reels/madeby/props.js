/* Drivers for props.css (load after speedy.js). All pure functions of t.
 *
 *   R.stack(el,t,{at,discs,core,base,explode,spin})  build + raise + split the database stack
 *   R.callout(el,t,at,{from})                        label + leader line flies in
 *   R.rays(el,t,at) · R.rings(el,t,[times])          floor petals · shockwaves
 *   R.bolt(el,t,at) · R.bokehDrift(el,t)             glyph pop + glow · backdrop drift
 *   R.fans(el,t) · R.dial(el,t,{at,dur,label})       spinning fans · countdown dial
 *   R.rack(el... )  (rackbar uses R.card)            —
 *   R.fibers(svg,t,{at,n,x1,y1,x2,y2,sweep})         fiber stream with flowing particles
 *   R.lanes(el,t,{at,busy:[[lane,a,b],…]})           connection lanes light up while borrowed
 *   R.lg(slugOrFile,{s,cls})                         html for a REAL brand logo tile (logos/<slug>.svg)
 *   R.xview(el,t,{parts,at,explode,focus,…})         exploded view: layers split, a part pulls out, leader-line labels
 *   R.xpoint(el,i,fx,fy) · R.lens(el,t,{…})          point on a part (for arrows) · magnified detail circle + cone
 *   R.steps(el,t,{steps,…})                          "how X works": numbered steps light up, a token travels the path
 *   R.analogy(el,t,{left,right,rows})                everyday analogy (left) = the tech (right), row by row
 *   R.zoom(el,t,{levels})                            camera dives through nested levels (phone → chip → core …)
 *   R.bars(el,t,{bars,max})                          bar chart that grows on the spoken numbers, with a highlight
 */
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;
  const rnd = (seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)(42);

  // ---------- database stack ----------
  /** o: {discs:5, dh:86, overlap:58, coreH:120, at, explode, spin:12, core:"🐘" (icon on the core)} — builds once, then:
      discs rise in bottom-up at `at`, split apart at `explode` (gap grows), slats slowly scroll */
  R.stack = (el, t, o = {}) => {
    el = $(el);
    const n = o.discs ?? 5, dh = o.dh ?? 96, ov = o.overlap ?? 50, coreH = o.coreH ?? 130, baseH = o.baseH ?? 100;
    if (!el.dataset.built) {
      let html = `<div class="base"><i class="side"></i><i class="top"></i></div>`;
      html += `<div class="core"><i class="side"></i><i class="top"></i><span class="pg">${o.core ?? "🐘"}</span></div>`;
      for (let i = 0; i < n; i++) {
        let leds = "";
        for (let k = 0; k < 4; k++) leds += `<i class="led" style="left:${12 + rnd() * 76}%;top:${58 + rnd() * 30}%"></i>`;
        html += `<div class="disc" data-i="${i}"><i class="side"></i><i class="top"></i>${leds}</div>`;
      }
      el.innerHTML = html; el.dataset.built = 1;
    }
    const a = o.at ?? 0, ex = o.explode != null ? E.inOut(prog(t, o.explode, 0.6)) : 1, gap = (o.gap ?? 20) * ex;
    const H = +el.style.width.replace("px", "") || 420;    // disc ellipse height scales with width
    const topE = dh * 0.56;
    const baseY = 0;                                        // we lay out bottom-up from el's bottom
    const put = (node, y, h, pin, dy) => {
      node.style.bottom = y + "px"; node.style.height = h + "px";
      node.style.opacity = pin;
      node.style.transform = `translateY(${(1 - pin) * (dy ?? 60)}px) scaleY(${lerp(0.6, 1, pin)})`;
    };
    const base = el.querySelector(".base"), core = el.querySelector(".core");
    put(base, 0, baseH, E.out3(prog(t, a, 0.5)), 40);
    put(core, baseH - 34 + gap, coreH, E.out3(prog(t, a + 0.12, 0.5)), 60);
    el.querySelectorAll(".disc").forEach(d => {
      const i = +d.dataset.i, pin = E.spring(prog(t, a + 0.22 + i * 0.09, 0.5));
      put(d, baseH - 34 + coreH - 30 + i * (dh - ov) + gap * (2 + i), dh, clamp(pin * 1.4), 90);
      // slats drift sideways slowly so the stack feels alive
      d.querySelector(".side").style.backgroundPosition = `${(t * (o.spin ?? 10)) % 13}px 0`;
    });
    base.querySelector(".side").style.backgroundPosition = `${(t * (o.spin ?? 10) * 0.7) % 15}px 0`;
  };

  /** label + leader line + dot flying in from its side ("from" = "left"|"right") */
  R.callout = (el, t, a, o = {}) => {
    el = $(el); const p = E.out3(prog(t, a, 0.45));
    const from = o.from ?? (el.classList.contains("r") ? "right" : "left"), s = from === "left" ? -1 : 1;
    el.style.opacity = p;
    el.style.transform = `translateX(${(1 - p) * s * 90}px)`;
    el.style.filter = p < 1 ? `blur(${(1 - p) * 8}px)` : "";
    if (p > 0) R.cue("pop", a, { soft: true });
  };

  /** floor petals fan out around the base */
  R.rays = (el, t, a) => {
    el = $(el);
    if (!el.dataset.built) {
      let h = `<i class="pool"></i>`;
      for (let i = 0; i < 10; i++) h += `<i class="ray" data-a="${i * 36 + 8}"></i>`;
      el.innerHTML = h; el.dataset.built = 1;
    }
    el.querySelectorAll(".ray").forEach((r, i) => {
      const p = E.out3(prog(t, a + i * 0.04, 0.5));
      r.style.opacity = p * 0.8;
      r.style.transform = `rotate(${+r.dataset.a}deg) scaleY(0.34) scaleX(${lerp(0.3, 1, p)})`;
    });
    el.querySelector(".pool").style.opacity = E.out3(prog(t, a, 0.6));
  };

  /** expanding shockwave rings on the floor */
  R.rings = (el, t, times) => {
    el = $(el);
    if (!el.dataset.rings) { el.insertAdjacentHTML("beforeend", times.map(() => `<i class="ring"></i>`).join("")); el.dataset.rings = 1; }
    el.querySelectorAll(".ring").forEach((r, i) => {
      const p = prog(t, times[i], 0.9);
      r.style.opacity = p > 0 && p < 1 ? (1 - p) * 0.8 : 0;
      r.style.transform = `scale(${lerp(0.4, 2.6, E.out3(p))})`;
      R.cue("whoosh", times[i]);
    });
  };

  const BOLT = `<svg viewBox="0 0 109 113" xmlns="http://www.w3.org/2000/svg"><path d="M63.7 110.3c-2.8 3.6-8.6 1.6-8.7-3l-1-67h45.1c8.2 0 12.7 9.4 7.7 15.9z" fill="#3ECF8E"/><path d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.5 67H9.8C1.6 72.1-3 62.7 2.1 56.2z" fill="#4EE39E"/></svg>`;
  /** bolt glyph pop with glow bloom; add class "refl" on the mirrored copy */
  R.bolt = (el, t, a) => {
    el = $(el); if (!el.dataset.built) { el.innerHTML = BOLT; el.dataset.built = 1; }
    const p = E.spring(prog(t, a, 0.5));
    el.style.opacity = clamp(p * 1.6) * (el.classList.contains("refl") ? 0.35 : 1);
    const base = el.classList.contains("refl") ? "scaleY(-1) " : "";
    el.style.transform = base + `scale(${lerp(0.4, 1, p)}) rotate(${(1 - p) * -20}deg)`;
    if (!el.classList.contains("refl")) R.cue("ding", a);
  };

  /** bokeh glyph backdrop: builds once from a seeded layout, drifts very slowly */
  R.bokehDrift = (el, t) => {
    el = $(el);
    if (!el.dataset.built) {
      const G = ["id", "42", "sql", "{ }", "0x1A", "row", "::", "key", "01", "ack", "fk", "db"];
      let h = "";
      for (let i = 0; i < 26; i++) {
        const big = i % 5 === 0;
        h += `<i class="${big ? "big" : ""}" data-s="${(rnd() * 2 - 1).toFixed(2)}" style="left:${rnd() * 92}%;top:${rnd() * 70}%">${G[i % G.length]}</i>`;
      }
      el.innerHTML = h; el.dataset.built = 1;
    }
    el.querySelectorAll("i").forEach((g, i) => { g.style.transform = `translateY(${8 * Math.sin(t * 0.3 + i)}px)`; });
  };

  // ---------- server tray ----------
  R.fans = (el, t) => { $(el).querySelectorAll(".fan i").forEach((f, i) => (f.style.transform = `rotate(${t * (260 + i * 40)}deg)`)); };

  /** countdown dial: fills over dur after at, label = mm:ss remaining */
  R.dial = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) { el.innerHTML = `<i></i><span></span>`; el.dataset.built = 1; }
    const p = clamp(prog(t, o.at, o.dur ?? 2));
    el.style.opacity = E.out3(prog(t, o.show ?? o.at - 0.3, 0.4)) * (1 - prog(t, o.hide ?? 1e9, 0.3));
    el.querySelector("i").style.setProperty("--p", p * 100 + "%");
    const left = Math.max(0, Math.round((o.secs ?? 120) * (1 - p)));
    el.querySelector("span").textContent = o.label ?? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  };

  // ---------- pooler fiber stream ----------
  /** svg el sized/positioned absolutely; o = {at, n:14, x1,y1 (grid right edge), x2,y2 (ring centre), spreadY} */
  R.fibers = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      let defs = `<defs><linearGradient id="figrad" gradientUnits="userSpaceOnUse" x1="${o.x1}" y1="0" x2="${o.x2}" y2="0"><stop offset="0" stop-color="rgba(62,207,142,.1)"/><stop offset="1" stop-color="rgba(62,207,142,.8)"/></linearGradient></defs>`;
      let paths = "", dots = "";
      const n = o.n ?? 14;
      for (let i = 0; i < n; i++) {
        const y1 = o.y1 + (i - n / 2) * (o.spreadY ?? 36) / (n / 14), c = (o.x1 + o.x2) / 2;
        paths += `<path data-i="${i}" d="M${o.x1} ${y1} C ${c} ${y1}, ${c} ${o.y2}, ${o.x2} ${o.y2}"/>`;
        dots += `<circle data-i="${i}" r="${3 + rnd() * 2.5}"/>`;
      }
      el.innerHTML = defs + paths + dots; el.dataset.built = 1;
      el.querySelectorAll("path").forEach(p => { p.dataset.len = p.getTotalLength(); });
    }
    const pin = E.out3(prog(t, o.at, 0.7));
    el.style.opacity = pin;
    el.querySelectorAll("path").forEach(p => {
      const L = +p.dataset.len; p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - pin);
      p.style.opacity = 0.35 + 0.3 * Math.sin(t * 2 + +p.dataset.i);
    });
    el.querySelectorAll("circle").forEach(c => {
      const i = +c.dataset.i, path = el.querySelector(`path[data-i="${i}"]`), L = +path.dataset.len;
      const u = ((t * (0.55 + (i % 5) * 0.12) + i * 0.17) % 1) * pin;
      const pt = path.getPointAtLength(u * L);
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y);
      c.style.opacity = pin * (0.4 + 0.6 * Math.sin(Math.PI * u));
    });
  };

  /** connection lanes: lane `i` lights + pulses while borrowed (busy windows) */
  R.lanes = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      el.innerHTML = `<div style="display:flex;align-items:center;gap:14px;font:700 34px Mono;color:#3ECF8E;padding:4px 6px 10px"><span style="font-size:30px">🐘</span><span style="margin-left:auto" class="cnt">0</span></div>` +
        Array.from({ length: o.count ?? 8 }, (_, i) => `<div class="lane" data-i="${i}"><span>${i + 1}</span><i class="pulse"></i><b></b></div>`).join("");
      el.dataset.built = 1;
    }
    R.card(el, t, { in: o.at });
    (o.busy || []).forEach(([i, a, b]) => {
      const lane = el.querySelector(`.lane[data-i="${i}"]`); if (!lane) return;
      const on = t >= a && t < b;
      lane.classList.toggle("busy", on);
      const pl = lane.querySelector(".pulse"), u = ((t - a) * 1.6) % 1;
      pl.style.opacity = on ? 0.9 : 0;
      pl.style.transform = `translateX(${u * (lane.offsetWidth + 60) - 60}px)`;
      if (on) R.cue("pop", a, { soft: true });
    });
    if (o.cnt != null) el.querySelector(".cnt").textContent = o.cnt(t);
  };
})();

/* ---------- generic any-topic primitives (appended) ---------- */
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;

  /** 3D box. o:{at, w,h,d (px), label, icon, side, spin}. Assembles with a spring, idles with a slow sway. */
  R.box = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s0 = o.w ?? o.size ?? 230;                      // a true cube: one size for every face
      el.style.width = s0 + "px"; el.style.height = s0 + "px";
      el.innerHTML = `<div class="cube">
        <div class="f front">${o.icon ? (/\.(svg|png|webp)$/.test(o.icon) ? R.lg(o.icon, { s: s0 * 0.42 }) : `<span class="ic">${o.icon}</span>`) : o.label ?? ""}</div>
        <div class="f top"></div><div class="f side">${o.side ?? ""}</div></div>`;
      const c = el.querySelector(".cube");
      c.querySelector(".front").style.transform = `translateZ(${s0 / 2}px)`;
      c.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${s0 / 2}px)`;
      c.querySelector(".side").style.transform = `rotateY(-90deg) translateZ(${s0 / 2}px)`;
      el.dataset.built = 1;
    }
    const p = E.spring(prog(t, o.at, 0.55));
    el.style.opacity = clamp(p * 1.6);
    el.querySelector(".cube").style.transform =
      `rotateX(${-24 + 2 * Math.sin(t * 0.7)}deg) rotateY(${32 + (o.spin ? t * o.spin : 3 * Math.sin(t * 0.5))}deg) scale(${lerp(0.5, 1, p)}) translateY(${(1 - p) * 60}px)`;
    if (p > 0) R.cue("pop", o.at);
  };

  /** chip (CPU/GPU/model). o:{at, size, label, pins} */
  R.chip = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s = o.size ?? 260, n = o.pins ?? 7; el.style.width = s + "px"; el.style.height = s + "px";
      let pins = "";
      for (let i = 0; i < n; i++) {
        const u = 18 + (i * (s - 36 - 8)) / (n - 1);
        pins += `<i class="pin" style="left:${u}px;top:-14px"></i><i class="pin" style="left:${u}px;bottom:-14px"></i>` +
                `<i class="pin" style="top:${u}px;left:-14px;width:16px;height:8px"></i><i class="pin" style="top:${u}px;right:-14px;width:16px;height:8px"></i>`;
      }
      el.innerHTML = pins + `<div class="body"><div class="die">${o.label ?? ""}</div></div>`;
      el.dataset.built = 1;
    }
    const p = E.spring(prog(t, o.at, 0.5));
    el.style.opacity = clamp(p * 1.6);
    el.style.transform = `scale(${lerp(0.6, 1, p)}) rotate(${(1 - p) * -8}deg)`;
    const die = el.querySelector(".die");
    die.style.boxShadow = `0 0 ${26 + 10 * Math.sin(t * 3)}px rgba(62,207,142,.45), inset 0 0 18px rgba(62,207,142,.3)`;
    if (p > 0) R.cue("pop", o.at);
  };

  /** globe. o:{at, size, pins:[{x,y,alt,at}], arc:{from:i,to:j,at}, spinBg} — x,y in % of the globe */
  R.globe = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s = o.size ?? 480; el.style.width = s + "px"; el.style.height = s + "px";
      el.innerHTML = `<i class="dots"></i><i class="shade"></i>` +
        (o.pins || []).map((p, i) => `<i class="pin ${p.alt ? "alt" : ""}" data-i="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join("") +
        `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path id="${el.id}_arc" d=""/><circle r="2.2" opacity="0"/></svg>`;
      el.dataset.built = 1;
    }
    const pin = E.out3(prog(t, o.at, 0.6));
    el.style.opacity = pin;
    el.style.transform = `scale(${lerp(0.92, 1, pin)})`;
    el.querySelector(".dots").style.backgroundPosition = `${(t * (o.spinBg ?? 6)) % 17}px 0`;
    (o.pins || []).forEach((p, i) => {
      const e = E.spring(prog(t, p.at ?? o.at + 0.3 + i * 0.15, 0.4));
      const n = el.querySelector(`.pin[data-i="${i}"]`);
      n.style.opacity = clamp(e * 2); n.style.transform = `translate(-50%,-50%) scale(${lerp(0.3, 1, e)})`;
      if (e > 0) R.cue("pop", p.at ?? o.at + 0.3 + i * 0.15, { soft: true });
    });
    if (o.arc) {
      const A = o.pins[o.arc.from], B = o.pins[o.arc.to];
      const path = el.querySelector("path");
      const mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - (o.arc.lift ?? 26);
      path.setAttribute("d", `M${A.x} ${A.y} Q ${mx} ${my}, ${B.x} ${B.y}`);
      path.setAttribute("vector-effect", "non-scaling-stroke");
      if (!path.dataset.len) path.dataset.len = path.getTotalLength();
      const L = +path.dataset.len, dp = E.inOut(prog(t, o.arc.at, o.arc.d ?? 0.9));
      path.style.strokeDasharray = L; path.style.strokeDashoffset = L * (1 - dp);
      path.style.strokeWidth = 1.6;                       // viewBox units
      const dot = el.querySelector("circle");
      const u = clamp(dp) * 0.999, pt = L ? path.getPointAtLength(u * L) : { x: 0, y: 0 };
      dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
      dot.setAttribute("opacity", dp > 0 && dp < 1 ? 1 : 0);
    }
  };

  /** packets flowing along an arbitrary SVG path. o:{at, path:"M…", n, speed, doc, size, hide} */
  R.flow = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      el.innerHTML = `<svg style="position:absolute;inset:0;overflow:visible" width="100%" height="100%"><path class="track" d="${o.path}"/></svg>` +
        Array.from({ length: o.n ?? 5 }, () => `<i class="pk ${o.doc ? "doc" : ""}"></i>`).join("");
      const p = el.querySelector("path"); el.dataset.len = p.getTotalLength(); el.dataset.built = 1;
    }
    const pin = E.out3(prog(t, o.at, 0.5)) * (1 - prog(t, o.hide ?? 1e9, 0.3));
    const path = el.querySelector("path"), L = +el.dataset.len;
    path.style.opacity = pin;
    el.querySelectorAll(".pk").forEach((k, i) => {
      const u = ((t * (o.speed ?? 0.35) + i / (o.n ?? 5)) % 1);
      const pt = path.getPointAtLength(u * L), pt2 = path.getPointAtLength(Math.min(L, u * L + 2));
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      k.style.opacity = pin * (u < 0.06 || u > 0.94 ? 0 : 1);
      k.style.transform = `translate(${pt.x - 13}px, ${pt.y - 9}px) rotate(${ang}deg) scale(${o.size ?? 1})`;
    });
  };
})();

// ---------- real logos · exploded view · detail lens ----------
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;

  /** html for a real brand logo tile. slug "openai" → logos/openai.svg (from scripts/brand_logos.mjs), or a file path.
      o:{s: px size, cls: "round"|"bare"|"dk", white: true → logos/<slug>-white.svg (pair with cls "dk")} */
  R.lg = (slug, o = {}) => {
    const src = /\.(svg|png|webp)$/.test(slug) ? slug : `logos/${slug}${o.white ? "-white" : ""}.svg`;
    return `<span class="lgo ${o.cls ?? ""}" style="--s:${o.s ?? 72}px"><img src="${src}" alt=""></span>`;
  };

  // local coords of a client-space point inside `host` (survives scene scale/blur transforms)
  const toLocal = (host, x, y) => { const r = host.getBoundingClientRect(), k = r.width / host.offsetWidth || 1; return [(x - r.left) / k, (y - r.top) / k]; };
  const env = (t, on, off, din = 0.5, dout = 0.45) => E.inOut(prog(t, on, din)) * (1 - E.inOut(prog(t, off, dout)));

  /** Exploded view of a layered product (phone, laptop, chip, server, battery, your app's stack…).
      o: { at, w, d (footprint px), tilt:[rx,rz] (default [58,-36]), sway (deg),
           parts: [{ name, gloss, more, th, skin, html, w, d, x, y, r, at }]   ← parts[0] = TOP layer
                 name/gloss = label text, more = the explanation shown while that part is pulled out,
                 skin = glass|screen|metal|frame|battery|pcb|chip|back|plastic (or your own .sk-x), html = art on its top face,
                 at = when its label lands (its spoken word)
           explode: time the layers split apart (gap px between layers, default 70), axis: true (dashed assembly axis),
           focus: [[t, i], [t2, j], [t3, -1]]  ← part i PULLS OUT of the stack (pull:[dx,dy,dz]) and lights up, others dim,
           labels: { x, y0, y1, w } label column inside el (default: right side), cx, cy: model centre inside el
           (default: middle of the space left of the labels), orbit: {at, d, to} turn the model }
      Call every frame. Labels + leader lines are drawn from the projected position of each part, so they
      follow the explode / pull-out / sway exactly. */
  R.xview = (el, t, o) => {
    el = $(el); const P = o.parts, n = P.length, W = o.w ?? 420, D = o.d ?? 300;
    const L = Object.assign({ x: el.offsetWidth - 310, y0: 20, y1: el.offsetHeight - 120, w: 300 }, o.labels || {});
    if (!el.dataset.built) {
      let h = `<svg class="xlines" width="${el.offsetWidth}" height="${el.offsetHeight}"><path class="axis" d=""/>` +
        P.map((_, i) => `<path data-i="${i}" pathLength="1" d=""/><circle data-i="${i}" r="7"/>`).join("") + `</svg>` +
        `<div class="xs" style="left:${o.cx ?? L.x / 2}px;top:${o.cy ?? el.offsetHeight / 2}px;width:${W}px;height:${D}px;margin:${-D / 2}px 0 0 ${-W / 2}px"><div class="xfloor"></div><div class="xglow"></div>`;
      P.forEach((p, i) => {
        const w = p.w ?? W, d = p.d ?? D, th = p.th ?? 14, x = p.x ?? (W - w) / 2, y = p.y ?? (D - d) / 2;
        const f = (st) => `<div class="xf sd" style="${st}"></div>`;
        h += `<div class="xp sk-${p.skin ?? "plastic"}" data-i="${i}" style="width:${w}px;height:${d}px;left:${x}px;top:${y}px;--r:${p.r ?? 18}px">` +
          f(`width:${w}px;height:${th}px;top:${d - th}px;transform-origin:0 100%;transform:rotateX(-90deg)`) +      // front (+y)
          f(`width:${w}px;height:${th}px;top:0;transform-origin:0 0;transform:rotateX(90deg)`) +                   // back (-y)
          f(`width:${th}px;height:${d}px;left:${w - th}px;transform-origin:100% 0;transform:rotateY(90deg)`) +     // right (+x)
          f(`width:${th}px;height:${d}px;left:0;transform-origin:0 0;transform:rotateY(-90deg)`) +                  // left (-x)
          `<div class="xf top" style="width:${w}px;height:${d}px;transform:translateZ(${th}px)">${p.html ?? ""}</div></div>`;
      });
      h += `</div>` + P.map((p, i) => `<div class="xlab" data-i="${i}" style="left:${L.x}px;width:${L.w}px"><i class="n">${i + 1}</i><b>${p.name}</b>` +
        `${p.gloss ? `<span>${p.gloss}</span>` : ""}${p.more ? `<div class="more">${p.more}</div>` : ""}</div>`).join("");
      el.innerHTML = h; el.dataset.built = 1;
    }
    const a = o.at ?? 0, ex = o.explode != null ? E.inOut(prog(t, o.explode, 0.8)) : 0, gap = (o.gap ?? 70) * ex;
    if (o.explode != null) R.cue("whoosh", o.explode);
    // stage rotation: tilt + gentle sway (+ optional orbit turn)
    const [rx, rz0] = o.tilt ?? [58, -36];
    const rz = rz0 + (o.orbit ? (o.orbit.to - rz0) * E.inOut(prog(t, o.orbit.at, o.orbit.d ?? 1.2)) : 0) + (o.sway ?? 2.5) * Math.sin(t * 0.45);
    const pin0 = E.out3(prog(t, a, 0.5));
    el.querySelector(".xs").style.transform = `rotateX(${rx}deg) rotateZ(${rz}deg) scale(${lerp(0.86, 1, pin0)})`;
    el.querySelector(".xfloor").style.opacity = pin0 * (1 - 0.5 * ex);
    // focus segments → per-part pull-out envelope and dimming of the others
    const F = o.focus || [], pull = o.pull ?? [-W * 0.28, -D * 0.12, 170];
    const fp = new Array(n).fill(0); let dim = 0;
    F.forEach(([ft, fi], k) => {
      const nxt = F[k + 1] ? F[k + 1][0] : 1e9; if (fi < 0) return;
      const e = env(t, ft, nxt - 0.05); fp[fi] = Math.max(fp[fi], e); dim = Math.max(dim, e);
      R.cue("whoosh", ft, { soft: true });
    });
    el.querySelector(".xglow").style.opacity = dim * 0.9;
    // stack bottom-up: assembled z = sum of thicknesses below; exploded adds gap per rank
    let zAcc = 0; const z = new Array(n);
    for (let i = n - 1; i >= 0; i--) { z[i] = P[i].z ?? zAcc; zAcc = z[i] + (P[i].th ?? 14); }
    el.querySelectorAll(".xp").forEach(node => {
      const i = +node.dataset.i, rank = n - 1 - i, pin = E.spring(prog(t, a + 0.1 + rank * 0.09, 0.55));
      const zz = z[i] + gap * rank + (1 - pin) * 260 + fp[i] * pull[2];
      node.style.transform = `translate3d(${fp[i] * pull[0]}px,${fp[i] * pull[1]}px,${zz}px)`;
      node.style.setProperty("--o", clamp(pin * 2) * lerp(1, 0.3, dim * (1 - fp[i])));
      node.classList.toggle("on", fp[i] > 0.5);
    });
    // labels + leader lines from each part's projected top face
    const svg = el.querySelector("svg.xlines"), tops = [...el.querySelectorAll(".xf.top")], labs = [...el.querySelectorAll(".xlab")];
    // the pulled-out part's label opens its explanation; the column re-flows so nothing overlaps
    labs.forEach((lab, i) => { const m = lab.querySelector(".more"); if (m) { m.style.maxHeight = fp[i] * 220 + "px"; m.style.marginTop = fp[i] * 8 + "px"; m.style.opacity = fp[i]; } });
    const hs = labs.map(l => l.offsetHeight), sum = hs.reduce((x, y) => x + y, 0);
    const lgap = n > 1 ? Math.max(12, (L.y1 + (hs[n - 1] || 0) - L.y0 - sum) / (n - 1)) : 0;
    let yAcc = L.y0;
    P.forEach((p, i) => {
      const la = p.at ?? (o.explode ?? a) + 0.9 + i * 0.25, lp = E.out3(prog(t, la, 0.45));
      const lab = labs[i], path = svg.querySelector(`path[data-i="${i}"]`), dot = svg.querySelector(`circle[data-i="${i}"]`);
      const ly = yAcc; yAcc += hs[i] + lgap;
      lab.style.top = ly + "px"; lab.style.opacity = lp * lerp(1, 0.4, dim * (1 - fp[i]));
      lab.style.transform = `translateX(${(1 - lp) * 50}px)`; lab.classList.toggle("on", fp[i] > 0.5);
      if (lp > 0) R.cue("pop", la, { soft: true });
      const r = tops[i].getBoundingClientRect(), [ax, ay] = toLocal(el, r.left + r.width * 0.8, r.top + r.height * 0.5);
      const tx = L.x, ty = ly + lab.offsetHeight / 2;
      path.setAttribute("d", `M${ax} ${ay} L${tx - 46} ${ty} L${tx} ${ty}`);
      path.style.strokeDasharray = 1; path.style.strokeDashoffset = 1 - lp;
      path.style.opacity = lab.style.opacity; path.classList.toggle("on", fp[i] > 0.5);
      dot.setAttribute("cx", ax); dot.setAttribute("cy", ay); dot.style.opacity = lp > 0.05 ? lab.style.opacity : 0; dot.classList.toggle("on", fp[i] > 0.5);
    });
    // dashed assembly axis through the stack while it is exploded
    const ax = svg.querySelector("path.axis");
    if (o.axis !== false && n > 1) {
      const c = node => { const r = node.getBoundingClientRect(); return toLocal(el, r.left + r.width / 2, r.top + r.height / 2); };
      const [x1, y1] = c(tops[0]), [x2, y2] = c(tops[n - 1]);
      ax.setAttribute("d", `M${x1} ${y1 - 60} L${x2} ${y2 + 60}`); ax.style.opacity = ex * (1 - dim) * 0.9;
    }
  };

  /** point (in el's PARENT coordinates) on part i's top face; fx,fy = fractions of its projected box. Use as R.lens `from`. */
  R.xpoint = (el, i, fx = 0.5, fy = 0.5) => {
    el = $(el); const r = el.querySelectorAll(".xf.top")[i].getBoundingClientRect();
    return toLocal(el.parentElement, r.left + r.width * fx, r.top + r.height * fy);
  };

  /** Detail lens: a magnified circle tied to a spot by a light cone (technical-illustration callout).
      el = <div class="lens" style="left:0;top:0;width:1080px;height:1920px"> in the same scene.
      o: { at, out, from:[x,y] (or a function returning it, e.g. () => R.xpoint("xv", 3, .4, .5)),
           c:[x,y] lens centre, r: lens radius (150), r0: spot radius (20), html: the magnified art (authored),
           title, text: the explanation under the lens, zoom: start scale of the art (1.6 → 1) } */
  R.lens = (el, t, o) => {
    el = $(el); const r = o.r ?? 150, r0 = o.r0 ?? 20;
    if (!el.dataset.built) {
      el.innerHTML = `<svg width="${el.offsetWidth}" height="${el.offsetHeight}"><polygon points=""/></svg><i class="dot"></i>` +
        `<div class="ring" style="width:${2 * r}px;height:${2 * r}px"><div class="in">${o.html ?? ""}</div></div>` +
        `<div class="cap">${o.title ? `<b>${o.title}</b>` : ""}${o.text ? `<span>${o.text}</span>` : ""}</div>`;
      el.dataset.built = 1;
    }
    const vis = 1 - E.out3(prog(t, o.out ?? 1e9, 0.35));
    const pd = E.spring(prog(t, o.at, 0.4)), pc = E.out3(prog(t, o.at + 0.12, 0.45)), pr = E.spring(prog(t, o.at + 0.18, 0.55)), pt = E.out3(prog(t, o.at + 0.5, 0.45));
    el.style.opacity = vis * clamp(pd * 3);
    if (pd > 0) { R.cue("pop", o.at); R.cue("whoosh", o.at + 0.18, { soft: true }); }
    const [px, py] = typeof o.from === "function" ? o.from() : o.from, [cx0, cy0] = o.c;
    // the lens grows out of the spot along the cone
    const cx = lerp(px, cx0, pc), cy = lerp(py, cy0, pc), R2 = lerp(r0, r, pr);
    const dot = el.querySelector(".dot"), ring = el.querySelector(".ring");
    Object.assign(dot.style, { left: px - r0 + "px", top: py - r0 + "px", width: 2 * r0 + "px", height: 2 * r0 + "px", transform: `scale(${lerp(0.3, 1, pd)})` });
    Object.assign(ring.style, { left: cx - r + "px", top: cy - r + "px", transform: `scale(${R2 / r})` });
    ring.querySelector(".in").style.transform = `scale(${lerp(o.zoom ?? 1.6, 1, E.out3(prog(t, o.at + 0.18, 0.9)))})`;
    const dx = cx - px, dy = cy - py, d = Math.hypot(dx, dy) || 1, th = Math.atan2(dy, dx), b = Math.acos(clamp((r0 - R2) / d, -1, 1));
    const P = (x, y, rr, s) => [x + rr * Math.cos(th + s * b), y + rr * Math.sin(th + s * b)];
    const pts = [P(px, py, r0, 1), P(cx, cy, R2, 1), P(cx, cy, R2, -1), P(px, py, r0, -1)];
    el.querySelector("polygon").setAttribute("points", pts.map(p => p.join(",")).join(" "));
    el.querySelector("polygon").style.opacity = pc;
    const cap = el.querySelector(".cap");
    Object.assign(cap.style, { left: cx0 - 210 + "px", top: cy0 + r + 22 + "px", opacity: pt, transform: `translateY(${(1 - pt) * 24}px)` });
  };
})();

// ---------- explanation kit: process steps · analogy split · zoom-through · bar chart ----------
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;
  const icon = x => !x ? "" : /^logo:/.test(x) ? R.lg(x.slice(5), { s: 54 }) : x;

  /** "How X works" in steps. o: { at, steps:[{icon ("🔒" or "logo:phonepe"), title, gloss, at}], w (card width 420),
      layout: "zig" (default, alternating sides) | "col" }. Each step lights up on its `at` (its spoken word): the token
      travels the path from the previous step, earlier steps turn ✓ done, the current one glows and shows its gloss. */
  R.steps = (el, t, o) => {
    el = $(el); const S = o.steps, n = S.length, W = el.offsetWidth, H = el.offsetHeight, cw = o.w ?? 420;
    if (!el.dataset.built) {
      const rowH = n > 1 ? (H - 130) / (n - 1) : 0;
      const pos = S.map((_, i) => ({ x: o.layout === "col" ? (W - cw) / 2 : (i % 2 ? W - cw : 0), y: i * rowH }));
      el._pos = pos;
      let h = `<svg width="${W}" height="${H}">` + S.slice(1).map((_, i) => `<path data-i="${i + 1}" pathLength="1"/>`).join("") + `</svg><i class="tok"></i>`;
      h += S.map((s, i) => `<div class="st" data-i="${i}" style="left:${pos[i].x}px;top:${pos[i].y}px;width:${cw}px"><i class="no">${i + 1}</i>` +
        `<div class="ic">${icon(s.icon)}</div><b>${s.title}</b>${s.gloss ? `<span>${s.gloss}</span>` : ""}</div>`).join("");
      el.innerHTML = h; el.dataset.built = 1;
      // connectors from card i to card i+1 (bottom-centre → top-centre, smooth S-curve)
      const cards = el.querySelectorAll(".st");
      el.querySelectorAll("svg path").forEach(pa => {
        const i = +pa.dataset.i, a = pos[i - 1], b = pos[i], ha = cards[i - 1].offsetHeight;
        const x1 = a.x + cw / 2, y1 = a.y + ha, x2 = b.x + cw / 2, y2 = b.y, my = (y1 + y2) / 2;
        pa.setAttribute("d", `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`);
      });
    }
    let cur = -1; S.forEach((s, i) => { if (t >= (s.at ?? o.at + i)) cur = i; });
    el.querySelectorAll(".st").forEach(c => {
      const i = +c.dataset.i, a = S[i].at ?? o.at + i, p = E.spring(prog(t, a - 0.12, 0.45));
      c.style.opacity = clamp(p * 2) * (cur >= 0 && i > cur ? 0 : 1);
      c.style.transform = `scale(${lerp(0.8, i === cur ? 1.04 : 1, p)})`;
      c.classList.toggle("on", i === cur); c.classList.toggle("done", i < cur);
      if (p > 0) R.cue("pop", a - 0.12, { soft: i > 0 });
    });
    const tok = el.querySelector(".tok"); tok.style.opacity = 0;
    el.querySelectorAll("svg path").forEach(pa => {
      const i = +pa.dataset.i, a = S[i].at ?? o.at + i, p = E.inOut(prog(t, a - 0.55, 0.5));
      pa.style.strokeDasharray = 1; pa.style.strokeDashoffset = 1 - p; pa.classList.toggle("on", p > 0);
      if (p > 0 && p < 1) { const L = pa.getTotalLength(), pt = pa.getPointAtLength(p * L); tok.style.opacity = 1; tok.style.left = pt.x + "px"; tok.style.top = pt.y + "px"; R.cue("whoosh", a - 0.55, { soft: true }); }
    });
  };

  /** Analogy split. o: { at, left:{title, sub}, right:{title, sub}, rows:[{l:{icon,title,gloss}, r:{icon,title,gloss}, at}], rowH }
      Left = the everyday thing (warm), right = the tech (blue); each row: left pops → dashed line + "=" → right pops. */
  R.analogy = (el, t, o) => {
    el = $(el); const rows = o.rows, rh = o.rowH ?? 136;
    if (!el.dataset.built) {
      const card = (c, side) => `<div class="c ${side}">${c.icon ? `<i>${icon(c.icon)}</i>` : ""}<div><b>${c.title}</b>${c.gloss ? `<span>${c.gloss}</span>` : ""}</div></div>`;
      el.innerHTML = `<div class="hd l"><small>${o.left.sub ?? "THINK OF IT AS"}</small>${o.left.title}</div><div class="hd r"><small>${o.right.sub ?? "IN TECH"}</small>${o.right.title}</div>` +
        rows.map((r, i) => `<div class="row" data-i="${i}" style="top:${90 + i * rh}px">${card(r.l, "l")}<i class="ln"></i><i class="eq">=</i>${card(r.r, "r")}</div>`).join("");
      el.dataset.built = 1;
    }
    el.querySelectorAll(".hd").forEach((h, k) => R.rise(h, t, o.at + k * 0.15, { dy: 20 }));
    el.querySelectorAll(".row").forEach(rw => {
      const i = +rw.dataset.i, a = rows[i].at ?? o.at + 0.6 + i;
      R.pop(rw.querySelector(".c.l"), t, a, { from: 0.7 });
      rw.querySelector(".ln").style.transform = `scaleX(${E.out3(prog(t, a + 0.25, 0.3))})`;
      R.pop(rw.querySelector(".eq"), t, a + 0.4, { from: 0.4, sfx: false });
      R.pop(rw.querySelector(".c.r"), t, a + 0.5, { from: 0.7 });
    });
  };

  /** Zoom-through. o: { at, levels:[{ html, label, cap, gloss, scale ("×10"), focus:[fx,fy], box (fraction 0.1–0.3), at }] }
      Level k's `focus`/`box` mark where level k+1 lives inside it (a glowing target shows first); on level k+1's `at`
      the camera dives: k scales up around the target while k+1 grows out of it to fill the frame. */
  R.zoom = (el, t, o) => {
    el = $(el); const L = o.levels, n = L.length, W = el.offsetWidth, H = el.offsetHeight;
    if (!el.dataset.built) {
      el.innerHTML = L.map((l, i) => `<div class="lv" data-i="${i}">${l.html}</div>`).join("") +
        L.map((l, i) => i < n - 1 ? `<i class="tgt" data-i="${i}"></i>` : "").join("") +
        `<div class="cap"></div><div class="tag"></div><div class="crumb">${L.map(l => `<span>${l.label}</span>`).join("")}</div>`;
      el.dataset.built = 1;
    }
    const D = 1.0;                                            // dive duration (s)
    let k = 0, p = 0;                                         // transition from level k to k+1 at progress p
    for (let i = 1; i < n; i++) { const T = L[i].at ?? o.at + i * 3; if (t >= T - D) { k = i - 1; p = E.inOut(prog(t, T - D, D)); } }
    const lv = [...el.querySelectorAll(".lv")], C = [W / 2, H / 2];
    lv.forEach((d, i) => { d.style.opacity = 0; d.style.transform = ""; });
    const pin = E.out3(prog(t, o.at, 0.5));
    const A = L[k], box = A.box ?? 0.18, Z = 1 / box, F = [A.focus[0] * W, A.focus[1] * H], S = Math.pow(Z, p), u = p;
    const a = lv[k]; a.style.transformOrigin = `${F[0]}px ${F[1]}px`;
    a.style.transform = `translate(${u * (C[0] - F[0])}px,${u * (C[1] - F[1])}px) scale(${S})`;
    a.style.opacity = pin * (1 - prog(p, 0.75, 0.25));
    if (k + 1 < n) {
      const b = lv[k + 1], cx = F[0] + u * (C[0] - F[0]), cy = F[1] + u * (C[1] - F[1]);
      b.style.transformOrigin = "50% 50%"; b.style.transform = `translate(${cx - C[0]}px,${cy - C[1]}px) scale(${box * S})`;
      b.style.opacity = prog(p, 0.12, 0.4);
      if (p >= 1) { b.style.transform = ""; b.style.opacity = 1; a.style.opacity = 0; }
    }
    const cur = p >= 0.6 ? k + 1 : k;
    // target box on the current level, pulsing before the dive
    el.querySelectorAll(".tgt").forEach(g => {
      const i = +g.dataset.i, l = L[i], bx = l.box ?? 0.18, T = L[i + 1].at ?? o.at + (i + 1) * 3, show = i === k && p === 0 ? E.out3(prog(t, T - D - 0.9, 0.3)) : 0;
      Object.assign(g.style, { left: l.focus[0] * W - bx * W / 2 + "px", top: l.focus[1] * H - bx * H / 2 + "px", width: bx * W + "px", height: bx * H + "px",
        opacity: show * (0.7 + 0.3 * Math.sin(t * 9)) });
      if (show > 0) R.cue("ding", T - D - 0.9);
      if (i === k && p > 0) R.cue("whoosh", T - D);
    });
    const cap = el.querySelector(".cap"), lc = L[cur];
    cap.innerHTML = `${lc.cap ?? lc.label}${lc.gloss ? `<small>${lc.gloss}</small>` : ""}`; cap.style.opacity = pin * (p > 0 && p < 1 ? 1 - Math.sin(Math.PI * p) : 1);
    const tag = el.querySelector(".tag"); tag.textContent = lc.scale ?? ""; tag.style.opacity = lc.scale ? pin : 0;
    el.querySelectorAll(".crumb span").forEach((c, i) => { c.className = i === cur ? "on" : i < cur ? "done" : ""; });
    el.style.opacity = pin;
  };

  /** Bar chart. o: { at, max, bars:[{label, sub, value, show (text, default value), logo, at, hi}], rowH, fmt, ticks:[…] }
      Each bar grows on its `at` and its number counts up; `hi:true` bars glow green (the point you're making). */
  R.bars = (el, t, o) => {
    el = $(el); const B = o.bars, rh = o.rowH ?? 104, fmt = o.fmt ?? (x => Math.round(x));
    if (!el.dataset.built) {
      el.innerHTML = B.map((b, i) => `<div class="br ${b.hi ? "hi" : ""}" data-i="${i}" style="top:${i * rh}px"><div class="lb">${b.logo ? R.lg(b.logo, { s: 40 }) + " " : ""}${b.label}${b.sub ? `<small>${b.sub}</small>` : ""}</div>` +
        `<div class="tr"><i class="fl"></i><span class="v"></span></div></div>`).join("") +
        (o.ticks ? `<div class="ax" style="top:${B.length * rh - 10}px">${o.ticks.map(x => `<span>${x}</span>`).join("")}</div>` : "");
      el.dataset.built = 1;
    }
    el.querySelectorAll(".br").forEach(r => {
      const i = +r.dataset.i, b = B[i], a = b.at ?? o.at + i * 0.4, p = E.out3(prog(t, a, 0.8));
      r.style.opacity = clamp(prog(t, a - 0.15, 0.25)); r.style.transform = `translateX(${(1 - E.out3(prog(t, a - 0.15, 0.4))) * -30}px)`;
      const w = (b.value / o.max) * 100 * p; r.querySelector(".fl").style.width = w + "%";
      const v = r.querySelector(".v"); v.style.left = `calc(${w}% )`; v.textContent = p > 0 ? (b.show && p >= 1 ? b.show : fmt(b.value * p)) : "";
      if (p > 0) R.cue("pop", a, { soft: true });
    });
  };
})();
