KF.demo({ name: "real-screen", group: "B", line: "A real screenshot: scroll, zoom and highlight exact spots", dur: 6, build(host) {
  const r = KF.make("real-screen", host, { src: KF.asset("guide-free.png"), natural: [860, 4800], frame: "phone", w: 560, vh: 640, top: 10 });
  return t => r.frame(t, { show: KF.prog(t, 0, 0.5), zoom: KF.keys(t, [[0.8, 1], [1.6, 1.4, "inOut"], [3.4, 1.4], [4.2, 1.2, "inOut"]]), focus: KF.keys(t, [[0.8, [430, 400]], [1.6, [430, 300], "inOut"], [3.4, [430, 300]], [4.4, [430, 1700], "inOut"]]),
    boxes: [{ x: 30, y: 210, w: 800, h: 230, p: KF.prog(t, 1.7, 0.4) * (1 - KF.prog(t, 3.3, 0.2)), color: "#4b8bff", label: "the headline" }, { x: 30, y: 1560, w: 800, h: 260, p: KF.prog(t, 4.5, 0.4), color: "#3ECF8E", label: "step by step" }] }); } });
