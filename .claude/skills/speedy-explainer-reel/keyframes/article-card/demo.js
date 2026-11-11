KF.demo({ name: "article-card", group: "B", line: "The source on screen, with the key words marked", dur: 4, build(host) {
  const a = KF.make("article-card", host, { site: "OpenAI", date: "August 26, 2026", headline: "The *Hugging Face incident* and the road ahead", tags: ["Research", "Security"], lines: 6 });
  return t => a.frame(t, { show: KF.prog(t, 0, 0.6), body: KF.prog(t, 0.4, 0.9), mark: KF.ease.inOut(KF.prog(t, 1.4, 0.9)), scroll: 40 * KF.ease.inOut(KF.prog(t, 2.6, 1.2)) }); } });
