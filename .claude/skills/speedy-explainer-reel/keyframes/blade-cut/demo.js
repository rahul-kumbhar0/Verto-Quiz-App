KF.demo({ name: "blade-cut", group: "E", line: "Two blades cut a wide shot into a vertical clip", dur: 4, build(host) {
  const b = KF.make("blade-cut", host, {}), cap = KF.el("div", "", b.center, "The first<br>three seconds"); cap.style.cssText = "position:absolute;left:6px;right:6px;bottom:20px;text-align:center;font:900 30px/1.1 Inter;color:#fff;text-shadow:0 3px 0 #000";
  return t => { b.frame(t, { show: KF.prog(t, 0, 0.4), cut: KF.prog(t, 0.9, 0.5), fall: Math.max(0, t - 1.5), grow: KF.prog(t, 1.7, 0.7) }); cap.style.opacity = KF.prog(t, 2.3, 0.3); }; } });
