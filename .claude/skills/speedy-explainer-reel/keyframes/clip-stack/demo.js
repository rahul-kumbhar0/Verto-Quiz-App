KF.demo({ name: "clip-stack", group: "E", line: "Real clips fan out in 3D, then drop onto one stack", dur: 5, build(host) {
  const c = KF.make("clip-stack", host, {}); const fb = KF.box(host, "left:0;top:0;width:1080px;height:1000px"), fin = KF.make("finish", fb, {});
  return t => { c.frame(t, { fan: KF.prog(t, 0.2, 1.9), stack: KF.prog(t, 3.0, 1.2) }); fin.frame(t, {}); }; } });
