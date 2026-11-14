KF.demo({ name: "plug-cable", group: "A", line: "A cable plugs in, sparks, and data starts flowing", dur: 5, build(host) {
  const a = KF.make("plug-cable", host, { from: [120, 300], to: [900, 300], color: "#4285F4", sag: 70 }), b = KF.make("plug-cable", host, { from: [120, 620], to: [900, 620], color: "#3ECF8E", sag: 70, thick: 22 });
  return t => { a.frame(t, { at: 1.2, out: 4.6 }); b.frame(t, { at: 2.2, back: true }); }; } });
