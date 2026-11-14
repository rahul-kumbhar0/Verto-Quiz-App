KF.demo({ name: "real-screen", group: "B", line: "A real screenshot in a real phone or laptop: scroll, zoom, highlight", dur: 8, build(host) {
  const a = KF.box(host, "left:0;top:0;width:1080px;height:1000px"), b = KF.box(host, "left:0;top:0;width:1080px;height:1000px");
  const r = KF.make("real-screen", a, { src: KF.asset("guide-free.png"), natural: [860, 4800], frame: "phone", w: 430, vh: 860, top: 20 });
  const l = KF.make("real-screen", b, { src: KF.asset("guide-free.png"), natural: [860, 4800], frame: "laptop", w: 800, top: 190 });
  return t => { const u = t - 4; a.style.display = t < 4 ? "" : "none"; b.style.display = t < 4 ? "none" : "";
    r.frame(t, { show: KF.prog(t, 0, 0.5), zoom: KF.keys(t, [[0.8, 1], [1.6, 1.4, "inOut"], [3.4, 1.4]]), focus: KF.keys(t, [[0.8, [430, 600]], [1.6, [430, 320], "inOut"], [3.4, [430, 320]]]),
      boxes: [{ x: 30, y: 210, w: 800, h: 230, p: KF.prog(t, 1.7, 0.4), color: "#4b8bff", label: "the headline", side: "bottom" }] });
    l.frame(u, { show: KF.prog(u, 0, 0.5), scroll: KF.keys(u, [[0.8, 0], [2, 1400, "inOut"], [4, 1400]]), boxes: [{ x: 30, y: 1560, w: 800, h: 260, p: KF.prog(u, 2.2, 0.4), color: "#3ECF8E", label: "step by step" }] }); }; } });
