KF.demo({ name: "dashboard", group: "B", line: "A gauge, a rolling total and bars", dur: 4, build(host) {
  const b = KF.box(host, "left:0;top:20px;width:1080px;height:940px"), db = KF.make("dashboard", b, { total: 497295, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Peak"] }); return t => db.frame(t, { p: KF.prog(t, 0.2, 2.6) }); } });
