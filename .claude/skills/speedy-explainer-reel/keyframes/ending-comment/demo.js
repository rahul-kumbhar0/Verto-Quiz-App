KF.demo({ name: "ending-comment", group: "F", line: "Comment the keyword, get the DM", dur: 5, build(host) {
  const e = KF.make("ending-comment", host, { keyword: "SHORTS", pill: "to get the free setup", dm: "The free setup, every step + settings 👇" }); return t => e.frame(t, { show: KF.prog(t, 0, 0.7), typed: KF.prog(t, 1.2, 0.7), sent: KF.prog(t, 2.3, 0.35), dm: KF.prog(t, 2.9, 1.2) }); } });
