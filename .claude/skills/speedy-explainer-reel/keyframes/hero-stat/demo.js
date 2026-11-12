KF.demo({ name: "hero-stat", group: "C", line: "A real odometer: every digit turns", dur: 5, build(host) {
  const a = KF.make("hero-stat", host, { from: 0, to: 18.2, dec: 1, icon: "play", suffix: "M", label: "views", top: 120 }), b = KF.make("hero-stat", host, { from: 0, to: 39213786, label: "views in 40 days", top: 520, size: 130, glow: KF.C.accent });
  return t => { a.frame(t, { p: KF.prog(t, 0.3, 2.0) }); b.frame(t, { p: KF.prog(t, 1.4, 2.6), show: KF.prog(t, 1.3, 0.3) }); }; } });
