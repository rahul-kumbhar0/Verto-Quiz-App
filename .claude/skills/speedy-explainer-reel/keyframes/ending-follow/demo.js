KF.demo({ name: "ending-follow", group: "F", line: "Follow, then send it to a friend", dur: 6, build(host) {
  const e = KF.make("ending-follow", host, { handle: "canwe.ai", name: "canwe.ai", stats: [["57", "posts"], ["2.4K", "followers"], ["12", "following"]], message: "no more excuses" });
  return t => e.frame(t, { show: KF.prog(t, 0, 0.6), follow: KF.prog(t, 1.2, 0.35), sheet: KF.prog(t, 2.0, 0.5), picked: KF.prog(t, 2.9, 0.3), typed: KF.prog(t, 3.4, 0.9), sent: KF.prog(t, 4.7, 0.35) }); } });
