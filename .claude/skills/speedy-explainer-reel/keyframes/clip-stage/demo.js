KF.demo({ name: "clip-stage", group: "B", line: "Your video as a framed clip with a timeline range", dur: 5, build(host) {
  const room = KF.el("div", "kf-host", host), chrome = KF.el("div", "kf-host", host); [room, chrome].forEach(e => (e.style.cssText = "left:60px;top:40px;width:960px;height:900px"));
  const c = KF.make("clip-stage", room, { chrome }); return t => c.frame(t, { show: KF.prog(t, 0, 0.4), range: t > 1 ? [3, 6] : null, sel: KF.prog(t, 1, 0.5), play: t > 1.6 ? KF.prog(t, 1.6, 2.4) : null, done: KF.prog(t, 4.1, 0.3) }); } });
