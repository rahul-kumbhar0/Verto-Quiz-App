KF.demo({ name: "hero-stat", group: "C", line: "One huge glowing number that rolls up", dur: 4, build(host) {
  const h = KF.make("hero-stat", host, { from: 0, to: 18.2, dec: 1, prefix: "▶ ", suffix: "M", label: "views" }); return t => h.frame(t, { p: KF.prog(t, 0.3, 2.2) }); } });
