KF.demo({ name: "cutaway-stage", line: "A magnified cross-section with one hero object", dur: 5, build(host) {
  const st = KF.make("cutaway-stage", host, { hero: "finger" }), ar = KF.make("field-arcs", host, { y: host.clientHeight * 0.62 + 46 + 17, n: 18, rise: 60 });
  const lb = KF.make("tracked-labels", host, { labels: [{ text: "GLASS", at: 0.6, anchor: () => st.anchor("glass"), dx: 40, dy: -110 }, { text: "WIRES", at: 1.0, anchor: () => st.anchor("wires"), dx: 70, dy: -190 }, { text: "CHARGE", at: 3.0, anchor: () => { const a = st.anchor("tip"); return [a[0] + 30, a[1] - 40]; }, dx: 150, dy: -150 }] });
  const strip = KF.el("div", "kf-host", host); strip.style.cssText = "left:0;top:" + (host.clientHeight * 0.62 + 130) + "px;width:100%;height:70px"; const vs = KF.make("value-strip", strip, { n: 9 });
  return t => { const touch = KF.prog(t, 1.6, 1.3), z = 1 + 0.12 * KF.ease.inOut(KF.prog(t, 0, 5)); st.frame(t, { touch, zoom: z, focus: [540, host.clientHeight * 0.62] });
    const tip = st.anchor("tip"), k = KF.ease.inOut(KF.prog(t, 2.5, 0.6)); ar.frame(t, { power: KF.prog(t, 0.2, 0.6), sink: { x: tip[0], y: tip[1] - 30, k, r: 230 } });
    vs.frame(t, { values: Array.from({ length: 9 }, (_, i) => 100 - 38 * k * Math.exp(-Math.pow(((i + 0.5) / 9 * 1080 - tip[0]) / 190, 2))) }); lb.frame(t); }; } });
