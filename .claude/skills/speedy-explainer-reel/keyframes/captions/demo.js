KF.demo({ name: "captions", group: "F", line: "Word-by-word captions with the key word boxed", dur: 6, build(host) {
  const txt = "Your phone screen reacts to the lightest touch. But it never feels pressure. It measures a tiny charge in your body.".split(" "), W = txt.map((w, i) => ({ w, s: 0.3 + i * 0.27, e: 0.3 + i * 0.27 + 0.25 }));
  const c = KF.make("captions", host, { words: W, keys: ["lightest", "pressure", "charge"], top: 330, size: 84 }); return t => c.frame(t); } });
