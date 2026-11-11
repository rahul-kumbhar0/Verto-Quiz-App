KF.demo({ name: "before-after", group: "C", line: "Two versions behind a sliding divider", dur: 5, build(host) {
  const ba = KF.make("before-after", host, { labels: ["Noise", "Cancelled"] }), A = KF.make("wave-cancel", ba.a, {}), B = KF.make("wave-cancel", ba.b, {});
  return t => { A.frame(t, { a: 1, b: 0, sum: 1 }); B.frame(t, { a: 1, b: 1, sum: 1 }); ba.frame(t, { show: KF.prog(t, 0, 0.5), x: 0.5 + 0.38 * Math.sin((t - 0.5) * 1.5) * KF.prog(t, 0.5, 0.5) }); }; } });
