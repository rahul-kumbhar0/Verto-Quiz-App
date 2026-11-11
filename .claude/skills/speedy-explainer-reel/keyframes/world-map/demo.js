KF.demo({ name: "world-map", group: "B", line: "Cities and routes lighting up on a dotted map", dur: 5, build(host) {
  const m = KF.make("world-map", host, { cities: [{ name: "Mumbai", lon: 72.8, lat: 19, at: 0.8, color: KF.C.accent }, { name: "Frankfurt", lon: 8.7, lat: 50.1, at: 1.5 }, { name: "Virginia", lon: -77.5, lat: 39, at: 2.2 }, { name: "Tokyo", lon: 139.7, lat: 35.7, at: 2.9 }, { name: "São Paulo", lon: -46.6, lat: -23.5, at: 3.4 }],
    routes: [{ from: 0, to: 1, at: 1.5 }, { from: 1, to: 2, at: 2.2 }, { from: 0, to: 3, at: 2.9, color: KF.C.sky }, { from: 2, to: 4, at: 3.4, color: KF.C.green }] });
  return t => m.frame(t, { show: KF.prog(t, 0, 1), zoom: 1 + 0.12 * KF.ease.inOut(KF.prog(t, 0, 5)) }); } });
