KF.demo({ name: "multiply-field", group: "C", line: "One becomes many: \"that's 180 full stadiums\"", dur: 6, build(host) {
  const m = KF.make("multiply-field", host, { n: 180, glyph: "stadium" }), num = KF.el("div", "", host); num.style.cssText = "position:absolute;left:0;right:0;top:6px;text-align:center;font:900 120px Inter;color:#fff;text-shadow:0 0 40px rgba(0,0,0,.9)";
  return t => { const s = { p: KF.prog(t, 1.0, 3.6) }; m.frame(t, s); num.innerHTML = m.count(s) + '<span style="font:800 36px Inter;color:#8b8f98"> stadiums</span>'; }; } });
