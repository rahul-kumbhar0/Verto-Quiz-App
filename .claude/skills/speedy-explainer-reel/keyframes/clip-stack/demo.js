KF.demo({ name: "clip-stack", group: "E", line: "Clips fan out, then drop onto one stack", dur: 4, build(host) {
  const c = KF.make("clip-stack", host, { captions: ["I automated<br>my YouTube", "The whole<br>channel?", "The first<br>three seconds", "Claude picks<br>the moments", "A whole<br>stack"] }); return t => c.frame(t, { fan: KF.prog(t, 0.2, 1.6), stack: KF.prog(t, 2.6, 0.7) }); } });
