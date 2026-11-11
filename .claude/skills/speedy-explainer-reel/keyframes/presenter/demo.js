KF.demo({ name: "presenter", group: "F", line: "The presenter: a pose for every line", dur: 6, build(host) {
  const p = KF.make("presenter", host, { w: 640, y: 180, style: { shirt: "#1D1E23", shirtLine: "#0B0C0F", print: "#D97757", chain: "#F2C14E", lens1: "#F0A585", lens2: "#D97757" }, poses: [[0, "explain"], [1, "point_up"], [2, "three"], [3, "mindblown"], [4, "thumbs"], [5, "point_cam"]] });
  const lab = KF.el("div", "", host); lab.style.cssText = "position:absolute;left:0;right:0;top:60px;text-align:center;font:700 40px 'JetBrains Mono',monospace;color:#F0A585"; const names = ["explain", "point_up", "three", "mindblown", "thumbs", "point_cam"];
  return t => { p.frame(t); lab.textContent = names[Math.min(5, Math.floor(t))]; }; } });
