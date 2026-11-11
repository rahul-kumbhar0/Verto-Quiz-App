KF.demo({ name: "value-strip", line: "Live numbers that roll and light up when they change", dur: 4, build(host) {
  const box = KF.el("div", "kf-host", host); box.style.cssText = "left:40px;top:380px;width:1000px;height:120px";
  const vs = KF.make("value-strip", box, { n: 7, size: 56, keys: [{ t: 0.8, values: [100, 100, 81, 62, 84, 100, 100] }, { t: 2.0, values: [100, 92, 69, 90, 100, 100, 100] }, { t: 3.1, values: i => 100 }] });
  return t => vs.frame(t); } });
