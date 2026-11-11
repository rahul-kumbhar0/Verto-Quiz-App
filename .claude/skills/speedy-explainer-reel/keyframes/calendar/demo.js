KF.demo({ name: "calendar", group: "B", line: "Days filling in: streaks, deadlines, \"in 40 days\"", dur: 4, build(host) {
  const c = KF.make("calendar", host, { title: "November 2026", days: 30, offset: 6, big: [16] }); return t => c.frame(t, { show: KF.prog(t, 0, 0.5), fill: 13 * KF.ease.inOut(KF.prog(t, 0.6, 2.2)), today: t > 3 ? 16 : undefined }); } });
