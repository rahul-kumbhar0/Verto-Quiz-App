KF.demo({ name: "repo-card", group: "B", line: "A repo card with a live star count", dur: 4, build(host) {
  const r = KF.make("repo-card", host, { owner: "JayWebtech", name: "AutoShorts", desc: "Long video in → the best moments out, as vertical clips.", stars: 1494, chips: ["Rust", "Tauri", "Free"] });
  return t => r.frame(t, { show: KF.prog(t, 0, 0.7), count: KF.prog(t, 0.5, 1.4), starred: KF.prog(t, 2.6, 0.4) }); } });
