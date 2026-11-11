KF.demo({ name: "folder-window", group: "B", line: "A folder whose files appear one by one", dur: 4, build(host) {
  const f = KF.make("folder-window", host, { title: "keyframes", files: [{ name: ".agents", dir: true }, { name: "engine", dir: true }, { name: "workspace", dir: true }, { name: "scenes", dir: true, depth: 1, note: "43 blocks" }, { name: "voice.mp3", depth: 1, note: "0:46" }, { name: "pack.json" }, { name: "SPEC.md" }] });
  return t => f.frame(t, { show: KF.prog(t, 0, 0.5), n: 7 * KF.prog(t, 0.5, 2.2), hot: t > 3 ? 3 : undefined }); } });
