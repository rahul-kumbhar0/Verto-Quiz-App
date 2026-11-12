KF.demo({ name: "before-after", group: "C", line: "Two versions behind a real comparison slider", dur: 5, build(host) {
  const ba = KF.make("before-after", host, { labels: ["Still loading", "Loaded"], w: 760, h: 860, top: 60 }), A = KF.make("product-page", ba.a, { top: 0, w: 760 }), B = KF.make("product-page", ba.b, { top: 0, w: 760 });
  return t => { A.frame(t, { load: 0.1, ms: 1400, slow: true }); B.frame(t, { load: 1, ms: 180 }); ba.frame(t, { show: KF.prog(t, 0, 0.5), x: 0.5 + 0.36 * Math.sin((t - 0.6) * 1.4) * KF.prog(t, 0.6, 0.5) }); }; } });
