KF.demo({ name: "field-arcs", line: "Energy jumping between points, pulled by a sink", dur: 4, build(host) {
  const ar = KF.make("field-arcs", host, { y: host.clientHeight * 0.7, n: 12, rise: 110, x0: 60, x1: 1020 });
  return t => { const k = KF.ease.inOut(KF.prog(t, 1.2, 0.8)) * (1 - KF.ease.inOut(KF.prog(t, 3.2, 0.6))); ar.frame(t, { power: KF.ease.out(KF.prog(t, 0, 0.8)), sink: { x: 300 + 480 * KF.ease.inOut(KF.prog(t, 1.2, 2.2)), y: host.clientHeight * 0.3, k, r: 240 } }); }; } });
