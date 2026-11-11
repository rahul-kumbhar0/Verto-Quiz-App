KF.demo({ name: "wave-cancel", line: "A wave, its opposite, and the silence left over", dur: 5, build(host) {
  const wv = KF.make("wave-cancel", host, {}); return t => wv.frame(t, { a: KF.ease.out(KF.prog(t, 0, 0.6)), b: KF.ease.inOut(KF.prog(t, 1.4, 1.0)), sum: KF.prog(t, 0.5, 0.5), merge: KF.prog(t, 3.0, 0.9) }); } });
