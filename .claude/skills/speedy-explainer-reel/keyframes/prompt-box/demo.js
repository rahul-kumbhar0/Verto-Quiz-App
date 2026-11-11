KF.demo({ name: "prompt-box", group: "B", line: "One sentence typed into Claude and sent", dur: 4, build(host) {
  const p = KF.make("prompt-box", host, { text: "Why does your phone feel your finger?" }); return t => p.frame(t, { show: KF.prog(t, 0, 0.5), typed: KF.prog(t, 0.6, 1.8), send: KF.prog(t, 2.9, 0.35) }); } });
