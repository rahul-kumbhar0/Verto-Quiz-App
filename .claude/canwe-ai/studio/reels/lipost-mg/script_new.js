const R = Reel, F = R.fx, U = R.ui, M = R.mg, { at, end, prog, clamp, lerp, ease } = R, $ = R.$, E = ease;
$("spk1").outerHTML = U.spark(22);
// REAL repo page (live, 1 Nov 2026)
U.github("gh", { owner: "Jakeschincariol", repo: "linkedin-agent-skill", stars: "3k", forks: "480", watch: "30", issues: 7, prs: 9, branches: 3, tags: 0,
  about: "Eleven free Claude skills that run a LinkedIn account: posts off 21 hook formulas, comments, replies, profile score, weekly plan, and a humanizer.", url: "opusjake.ai/r/linkedin-agent",
  topics: ["agent-skills", "ai-humanizer", "claude", "claude-code", "claude-skills", "content-marketing", "linkedin"],
  commit: { who: "Jakeschincariol", msg: "The LinkedIn agent skill: 11 Claude skills", sha: "add2c23", when: "2 months ago", count: "1" },
  files: [[".claude-plugin", "The LinkedIn agent skill: 11 Claude skills…", "2 months ago"], ["skills", "The LinkedIn agent skill: 11 Claude skills…", "2 months ago"], ["templates", "The LinkedIn agent skill: 11 Claude skills…", "2 months ago"], ["LICENSE", "The LinkedIn agent skill: 11 Claude skills…", "2 months ago"], ["README.md", "The LinkedIn agent skill: 11 Claude skills…", "2 months ago"]] });
U.browser("ghw", { url: "github.com/Jakeschincariol/linkedin-agent-skill" });
const SK = ["/li-post", "/li-comment", "/li-reply", "/li-profile", "/li-plan", "/li-human", "/li-carousel", "/li-repurpose", "/li-dm", "/li-inbox", "/li-audit"];
$("sk").innerHTML = SK.map((s, i) => `<span class="m-chip${i === 0 || i === 5 ? " acc" : ""}">${s}</span>`).join("");
U.terminal("tm", { title: "~/linkedin — claude" });
$("rub").innerHTML = Array.from({ length: 12 }, () => "<i></i>").join("");
const PICK = [2, 9, 15];
$("tiles").innerHTML = Array.from({ length: 21 }, (_, i) => `<i class="${PICK.includes(i) ? "pk0" : ""}"></i>`).join("");
const T = { gh: at("One free"), term: at("I give"), hum: at("Then the best"), three: at("It also"), post: at("And it never"), star: at("3,000"), cta: at("Comment"), stop: R.voiceEnd() };
window.REEL_DURATION = +(T.stop + 1.8).toFixed(2);

// ---- layout probes (taken once, before any transform): stage-space centres of things the graphics connect ----
const SR = $("stage").getBoundingClientRect(), K = SR.width / 1080;
const box = id => { const r = $(id).getBoundingClientRect(); return { x: (r.left - SR.left) / K, y: (r.top - SR.top) / K, w: r.width / K, h: r.height / K }; };
const ctr = id => { const b = box(id); return [b.x + b.w / 2, b.y + b.h / 2]; };
["sHook", "sGh", "sTerm", "sHum", "sThree", "sPost", "sStar", "sCta"].forEach(s => { $(s).style.visibility = "visible"; });
const LI = box("li1"), CLAUDE = ctr("lic1"), CHIPS = [...$("sk").children].map(c => { const b = box(c.id || (c.id = "chip" + [...$("sk").children].indexOf(c))); return [b.x + b.w / 2, b.y + b.h / 2]; });
const ZW = ["z1", "z2"].map(ctr), LOCK = ctr("lock"), PBTN = ctr("pbtn"), SND = ctr("snd"), DMAV = ctr("dm"), STAR = [540, box("odo").y + 95];   // centre of the 190 px hero line
const DMI = (() => { const b = box("dm"); return [b.x + 48, b.y + b.h / 2]; })();
["sHook", "sGh", "sTerm", "sHum", "sThree", "sPost", "sStar", "sCta"].forEach(s => { $(s).style.visibility = "hidden"; });

// music grid: song beat enters at 2.36 s, drop at 26.10 s (54 beats) → 136.5 BPM; the breakdown (21.3–26.1) has no pulse
F.beats({ bpm: 136.5, groove_in: 2.36, dur: 40 });
R.setup({ push: 0, scenes: [] });
R.speedy({ emph: window.EMPH, light: [[T.hum, T.three]],
  chapters: [{ label: "the pack", at: T.gh }, { label: "hooks", at: T.term }, { label: "humanizer", at: T.hum }, { label: "you post", at: T.post, end: T.cta }],
  counter: { unit: "skills", steps: [[at("Eleven"), 11, "skills"], [at("21"), 21, "hook formulas"], [at("3,000"), 3000, "GitHub stars"]] },
  avatar: { x: 240, y: 1330, w: 600, in: 0.15, look: "hoodie", style: { shirt: "#D97757", shirtLine: "#B4573A", print: "none" } },
  poses: window.PINS.map(([p, n]) => [at(p), n]), autoPoses: {} });
const DRAFT = "Finding internships used to take me a weekend.\nIt now takes one sentence.";
const ghCam = t => { const base = { s: 0.97, x: -14, y: 668 }, tgt = { s: 1.5, P: [120, 300], Q: [300, 820] };
  const zt = E.power2InOut(prog(t, at("Eleven") - 0.3, 0.7));
  const s = lerp(base.s, tgt.s, zt), x = lerp(base.x, tgt.Q[0] - tgt.P[0] * tgt.s, zt), y = lerp(base.y, tgt.Q[1] - tgt.P[1] * tgt.s, zt);
  const pin = E.expoOut(prog(t, T.gh, 0.7)); $("ghw").style.transform = `translate(${x}px,${y + (1 - pin) * 100}px) scale(${s})`; };
const sP = (id) => { const r = $(id).getBoundingClientRect(); return [(r.left - SR.left) / K + 40, (r.top - SR.top + r.height / 2) / K]; };

window.seek = t => {
  R.frame(t);
  F.slots(t, [["sHook", 0, T.gh], ["sGh", T.gh, T.term], ["sTerm", T.term, T.hum], ["sHum", T.hum, T.three], ["sThree", T.three, T.post], ["sPost", T.post, T.star], ["sStar", T.star, T.cta], ["sCta", T.cta, 99]]);
  // seams: IRIS out of the Claude chip into the repo, then cut-the-curve / rack / zoom as before
  M.iris("sHook", "sGh", t, T.gh - 0.12, { x: CLAUDE[0], y: CLAUDE[1], d: 0.5 }); F.cutCurve("sGh", "sTerm", t, T.term); F.rackFocus("sTerm", "sHum", t, T.hum);
  F.cutCurve("sHum", "sThree", t, T.three); F.zoomCut("sThree", "sPost", t, T.post); F.cutCurve("sPost", "sStar", t, T.star); F.inverseZoom("sStar", "sCta", t, T.cta);
  R.speedyFrame(t);
  F.shake("cam", t, T.star + 0.02, { amp: 14, d: 0.5, sfx: false });

  // LIVING GRID — beat pulse (not in the breakdown), shockwaves on the big moments, warm focus follows the hero
  const inBreak = t > 21.3 && t < T.star, pulse = t > 2.36 && !inBreak ? F.pulse(t, { decay: 7 }) : 0;
  M.grid("mgGrid", t, { pulse, light: t >= T.hum && t < T.three, drift: 8,
    waves: [[0.2, 540, 960, 0.8], [T.gh - 0.12, CLAUDE[0], CLAUDE[1]], [at("press") + 0.15, PBTN[0], PBTN[1], 1.1], [T.star + 0.02, 540, STAR[1], 1.7], [at("DM") + 0.35, DMI[0], DMI[1]]],
    focus: t < T.gh ? [540, 900] : t < T.star ? [540, 960] : [540, STAR[1]] });

  // HOOK — the LinkedIn mark pops, then MORPHS into the real composer (shared-element move); Claude drafts live
  const pop = M.spring(t, 0, { f: 2.6, z: 0.5 }), A = { x: 540 - 66, y: 900 - 66, w: 132, h: 132, r: 30 }, B = { x: LI.x, y: LI.y, w: LI.w, h: LI.h, r: 14 };
  const mp = M.morph("plate", t, 0.32, A, B, { f: 1.7, z: 0.74, sfx: false });
  $("plate").style.transform = t < 0.32 ? `scale(${lerp(0.3, 1, pop)})` : "";
  $("plate").style.background = `color-mix(in srgb,#0A66C2 ${Math.round((1 - clamp(mp * 1.6)) * 100)}%,#1b1f23)`;
  $("plIn").style.opacity = 1 - clamp(mp * 3); $("plIn").style.transform = `scale(${1 + mp * 0.8})`;
  const ci = clamp((t - 0.6) / 0.18); $("li1").style.opacity = ci; $("li1").style.transform = "";
  $("plate").style.opacity = t > 0.9 ? 0 : 1;
  const n = clamp(Math.floor((t - 0.62) * 34), 0, DRAFT.length); $("lib1").innerHTML = DRAFT.slice(0, n).replace(/\n/g, "<br>") + (Math.floor(t * 2.2) % 2 ? '<span class="cur"></span>' : "");
  R.cue("type", 0.62, { t2: 0.62 + DRAFT.length / 34, soft: true }); R.cue("whoosh", 0.3);

  // GITHUB — real page; camera dives to /skills; a connector DRAWS from the folder row to the panel,
  // packets flow down it and the 11 skills FLY out of the folder on springs with echo trails
  ghCam(t); $("gh-row1").classList.toggle("hi", t >= at("Eleven"));
  if (t >= T.gh - 0.2 && t < T.term + 0.4) {
    const [rx, ry] = sP("gh-row1"), d = M.curve(rx, ry + 20, 540, 1120, 0.55);
    const ln = M.path("ghsvg", "ghln", d, "mg-line acc"); M.draw(ln, t, at("Eleven") - 0.05, 0.45, { head: "ghHead" });
    M.flow(ln, t, { n: 5, speed: 1.3, from: at("Eleven") + 0.35, to: T.term });
    SK.forEach((_, i) => { const c = $("chip" + i), a2 = at("Eleven") + 0.2 + i * 0.045, from = { x: rx - CHIPS[i][0], y: ry - CHIPS[i][1], r: F.hash(i) * 25, s: 0.35 };
      c.style.opacity = t < a2 ? 0 : 1; M.trail(c, t, tt => M.flyT(tt, a2, from, { f: 2.1, z: 0.6 }), { n: 3, lag: 0.03, a: 0.3 }); });
  }
  R.note("fn1", t, T.gh + 0.4, T.term - 0.3);

  // TERMINAL — /li-post; the 21 formulas cascade in as tiles, 3 get PICKED (accent + lift), the rest dim
  const a = T.term + 0.2;
  U.termPlay("tm", t, [
    { t: a, kind: "cmd", text: "/li-post my job search now takes one sentence" },
    { t: at("three") - 0.1, kind: "claude", text: "3 hooks (from 21 formulas):" },
    { t: at("hooks,"), kind: "out", text: "1 · Time Anchor — \"Finding internships used to take me a weekend. It now takes one sentence.\"" },
    { t: at("from"), kind: "out", text: "2 · The Receipt — \"37 internships. 1 sentence. 0 job portals.\"" },
    { t: at("formulas,"), kind: "out", text: "3 · Myth Bust — \"Applying to 200 jobs is not why you have no interviews.\"" },
    { t: at("full draft."), kind: "ok", text: "Draft ready · humanized before you see it" } ], { cps: 38 });
  const pk = at("formulas,") + 0.15;
  [...$("tiles").children].forEach((c, i) => { const isP = PICK.includes(i), a2 = at("21") - 0.25 + i * 0.022;
    M.fly(c, t, a2, { y: 50, s: 0.4, r: F.hash(i + 3) * 30 }, { f: 2.6, z: 0.5 });
    const sel = clamp((t - pk - PICK.indexOf(i) * 0.08) / 0.2);
    if (isP) { c.classList.toggle("pk", t >= pk + PICK.indexOf(i) * 0.08); c.style.transform += ` translateY(${-12 * M.spring(t, pk + PICK.indexOf(i) * 0.08, { f: 3, z: 0.4 })}px)`; }
    else c.style.opacity = Math.min(+c.style.opacity, 1 - 0.6 * clamp((t - pk) / 0.3)); });
  $("flab").style.opacity = clamp((t - pk) / 0.25);
  R.note("fn2", t, T.term + 0.6, T.hum - 0.3);

  // HUMANIZER (light) — highlighter sweeps the slop, a red stroke DRAWS through it, the clean word SPRINGS in;
  // invisible characters pop with a ring as they vanish
  [["h1", at("strips") - 0.1], ["h2", at("AI") - 0.05], ["h3", at("words,")], ["h4", at("em")], ["h5", at("dashes,") + 0.2]].forEach(([id, a2]) => {
    const el = $(id), s = el.querySelector("s"), r = el.querySelector("i");
    M.marker(s, t, a2 - 0.22, { d: 0.22, cool: true }); M.strike(s, t, a2 - 0.02, { d: 0.22 });
    s.style.opacity = 1 - 0.55 * prog(t, a2 + 0.1, 0.3);
    r.style.display = t >= a2 + 0.08 ? "" : "none"; M.fly(r, t, a2 + 0.08, { y: -26, s: 0.5 }, { f: 2.8, z: 0.45 });
    if (t >= a2) R.cue("pop", a2 + 0.08, { soft: true }); });
  ["z1", "z2"].forEach((id, k) => { const a2 = at("hidden") + k * 0.15, p = prog(t, a2, 0.3); $(id).style.opacity = 1 - p; $(id).style.width = (18 * (1 - p)) + "px"; $(id).style.margin = p >= 1 ? "0" : "0 2px";
    M.ring("mgFx", t, a2 + 0.05, { x: ZW[k][0], y: ZW[k][1], r: 70, d: 0.55 }); });
  [...$("flags").children].forEach((f, i) => M.fly(f, t, at("characters.") + 0.2 + i * 0.07, { y: 40, r: (i % 2 ? 6 : -6), s: 0.6 }, { f: 2.6, z: 0.5 }));
  R.note("fn3", t, T.hum + 0.4, T.three - 0.3);

  // THREE SKILLS — cards DEALT on springs; the profile score is an arc GAUGE; the week is a line DRAWN through the days
  [["c1", at("comments,")], ["c2", at("scores")], ["c3", at("plans")]].forEach(([id, a2], i) => M.fly(id, t, a2 - 0.18, { x: (i - 1) * 60, y: 160, r: (i - 1) * -5, s: 0.86 }, { f: 2.1, z: 0.62 }));
  const sc = M.gauge("gArc", t, at("profile"), 0.9, 78); $("gNum").firstChild.nodeValue = sc;
  [...$("rub").children].forEach((r, i) => r.classList.toggle("on", i < Math.round(sc / 100 * 12)));
  M.draw("wkp", t, at("whole") - 0.05, 0.6, { head: "wkh", ease: "power2InOut" });
  [...$("wk").children].forEach((d, i) => d.classList.toggle("on", t >= at("whole") - 0.05 + 0.06 + i * 0.12));
  R.note("fn4", t, T.three + 0.4, T.post - 0.3);

  // POST — lock slams on with a ring; you read (scan); your press sends a shockwave through the grid
  const lk = E.backOut(prog(t, at("never") - 0.05, 0.4), 1.5); $("lock").style.opacity = clamp(prog(t, at("never") - 0.05, 0.2) * 5) * (1 - prog(t, at("read") - 0.1, 0.25)); $("lock").style.transform = `scale(${lerp(0.7, 1, lk)})`;
  M.ring("mgFx", t, at("never"), { x: LOCK[0], y: LOCK[1], r: 120, d: 0.6, cool: true });
  const scn = prog(t, at("read"), 0.7); $("scan").style.opacity = scn > 0 && scn < 1 ? 1 : 0; $("scan").style.top = (100 + scn * 300) + "px";
  R.press("pbtn", t, at("press") + 0.15); M.ring("mgFx", t, at("press") + 0.15, { x: PBTN[0], y: PBTN[1], r: 200, d: 0.7 });
  F.flash(t, at("post.") + 0.05, { max: 0.18, sfx: false });

  // STARS — the DROP: shake + rays + double shockwave + grid wave; odometer; chips spring in
  F.odometer("odo", t, T.star + 0.1, 0.9, 3000);
  M.rays("stsvg", t, T.star + 0.04, { x: 540, y: STAR[1], r0: 230, len: 110, n: 16, d: 0.65 });
  M.ring("mgFx", t, T.star + 0.02, { x: 540, y: STAR[1], r: 560, d: 0.9, sfx: true });
  [...$("chips").children].forEach((c, i) => M.fly(c, t, at("Free.") - 0.1 + i * 0.22, { y: 50, s: 0.5, r: (i - 1) * 8 }, { f: 2.5, z: 0.5 }));

  // CTA — comments spring in; your POST fires a packet along a drawn path into the DM banner
  [["r1", T.cta + 0.15], ["r2", T.cta + 0.3]].forEach(([id, a2]) => M.fly(id, t, a2, { x: -60, s: 0.9 }, { f: 2.4, z: 0.6 }));
  const tyA = at("Comment") + 0.35, sent = tyA + 0.5;
  if (t < sent) R.type("cty", "POST", t, tyA, 14); else $("cty").textContent = "";
  $("cph").style.display = (t < tyA || t >= sent) ? "" : "none"; R.press("snd", t, sent - 0.1);
  M.fly("r3", t, sent, { y: 40, s: 0.9 }, { f: 2.6, z: 0.55 });
  const dmA = at("DM");
  const ln2 = M.path("ctsvg", "ctln", M.curve(SND[0], SND[1], DMI[0], DMI[1], 0.6), "mg-line acc");
  M.draw(ln2, t, sent, Math.max(0.3, dmA - sent), { head: "ctHead", ease: "power2InOut", out: dmA + 0.2, outD: 0.35 });
  R.sheet("dm", t, dmA, { dy: -140, d: 0.5 });
  M.ring("mgFx", t, dmA + 0.35, { x: DMI[0], y: DMI[1], r: 140, d: 0.6 });
};
window.seek(0);
