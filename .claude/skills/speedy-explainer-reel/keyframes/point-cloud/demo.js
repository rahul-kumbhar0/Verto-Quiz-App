KF.demo({ name: "point-cloud", line: "Similar things sit together in 3D space", dur: 6, build(host) {
  const pc = KF.make("point-cloud", host, {}); return t => pc.frame(t, { rot: 0.4 + t * 0.22, show: KF.prog(t, 0, 1.2), names: KF.prog(t, 1.2, 0.4) * (1 - KF.prog(t, 4.2, 0.3)),
    arrow: { from: [0.1, 0.1, 0], to: [0.15, -0.95, -0.1], p: KF.prog(t, 2.2, 0.6), label: "refusal direction" }, squash: KF.ease.inOut(KF.prog(t, 4.3, 1.0)) }); } });
