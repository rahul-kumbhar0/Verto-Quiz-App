KF.demo({ name: "product-page", group: "B", line: "A page loading: skeleton, then content, with a timer", dur: 4, build(host) {
  const p = KF.make("product-page", host, { url: "acme.store/products/air-max" }); return t => { const l = KF.prog(t, 0.6, 1.6); p.frame(t, { show: KF.prog(t, 0, 0.5), load: l, ms: 1400 * l, slow: l > 0.6 }); }; } });
