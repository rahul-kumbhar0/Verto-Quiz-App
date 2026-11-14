KF.demo({ name: "face-fx", group: "E", line: "Effects that follow a face: orbit, spotlight, lock-on, stamp", dur: 8, build(host) {
  const back = KF.el("div", "kf-host", host), head = KF.el("div", "", host), front = KF.el("div", "kf-host", host); [back, front].forEach(e => (e.style.cssText = "left:0;top:0;width:100%;height:100%"));
  head.style.cssText = "position:absolute;left:50%;top:430px;width:300px;height:360px;margin-left:-150px;border-radius:150px 150px 130px 130px;background:linear-gradient(#f0c8a0,#d9a577);box-shadow:0 300px 0 60px #7c2d12";
  const fx = KF.make("face-fx", back, { front }), K = ["orbit", "spotlight", "locked", "stamp"];
  return t => { const i = Math.min(3, Math.floor(t / 2)), u = t - i * 2; fx.frame(t, { fx: K[i], p: KF.prog(u, 0.1, 0.5) * (1 - KF.prog(u, 1.85, 0.15)), face: [host.clientWidth / 2, 600], r: 150, t0: 6.8, at: [host.clientWidth / 2, 860] }); }; } });
