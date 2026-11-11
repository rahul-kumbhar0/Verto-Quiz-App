const R = Reel, F = R.fx, U = R.ui, { at, end, prog, clamp, lerp, ease } = R, $ = R.$, E = ease;
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
const T = { gh: at("One free"), term: at("I give"), hum: at("Then the best"), three: at("It also"), post: at("And it never"), star: at("3,000"), cta: at("Comment"), stop: R.voiceEnd() };
window.REEL_DURATION = +(T.stop + 1.8).toFixed(2);
R.setup({ push: 0, scenes: [] });
R.speedy({ emph: window.EMPH, light: [[T.hum, T.three]],
  chapters: [{ label: "the pack", at: T.gh }, { label: "hooks", at: T.term }, { label: "humanizer", at: T.hum }, { label: "you post", at: T.post, end: T.cta }],
  counter: { unit: "skills", steps: [[at("Eleven"), 11, "skills"], [at("21"), 21, "hook formulas"], [at("3,000"), 3000, "GitHub stars"]] },
  avatar: { x: 240, y: 1330, w: 600, in: 0.15, look: "hoodie", style: { shirt: "#D97757", shirtLine: "#B4573A", print: "none" } },
  poses: window.PINS.map(([p, n]) => [at(p), n]), autoPoses: {} });
const DRAFT = "Finding internships used to take me a weekend.\nIt now takes one sentence.";
const ghCam = t => { const base = { s: 0.97, x: -14, y: 668 }, z1 = { s: 1.5, P: [120, 300], Q: [300, 820] }, z2 = { s: 1.6, P: [1210, 190], Q: [640, 900] };
  const zt = E.power2InOut(prog(t, at("Eleven") - 0.3, 0.7)); const tgt = z1;
  const s = lerp(base.s, tgt.s, zt), x = lerp(base.x, tgt.Q[0] - tgt.P[0] * tgt.s, zt), y = lerp(base.y, tgt.Q[1] - tgt.P[1] * tgt.s, zt);
  const pin = E.expoOut(prog(t, T.gh, 0.7)); $("ghw").style.transform = `translate(${x}px,${y + (1 - pin) * 100}px) scale(${s})`; };
window.seek = t => {
  R.frame(t);
  F.slots(t, [["sHook", 0, T.gh], ["sGh", T.gh, T.term], ["sTerm", T.term, T.hum], ["sHum", T.hum, T.three], ["sThree", T.three, T.post], ["sPost", T.post, T.star], ["sStar", T.star, T.cta], ["sCta", T.cta, 99]]);
  F.cutCurve("sHook", "sGh", t, T.gh); F.cutCurve("sGh", "sTerm", t, T.term); F.rackFocus("sTerm", "sHum", t, T.hum);
  F.cutCurve("sHum", "sThree", t, T.three); F.zoomCut("sThree", "sPost", t, T.post); F.cutCurve("sPost", "sStar", t, T.star); F.inverseZoom("sStar", "sCta", t, T.cta);
  R.speedyFrame(t);
  // HOOK — the real LinkedIn composer; Claude drafts the post live
  const hp = E.expoOut(prog(t, 0.05, 0.6)); $("li1").style.transform = `translateY(${(1 - hp) * 80}px)`; $("li1").style.opacity = hp;
  const n = clamp(Math.floor((t - 0.4) * 30), 0, DRAFT.length); $("lib1").innerHTML = DRAFT.slice(0, n).replace(/\n/g, "<br>") + (Math.floor(t * 2.2) % 2 ? '<span class="cur"></span>' : "");
  R.cue("type", 0.4, { t2: 0.4 + DRAFT.length / 30, soft: true });
  // GITHUB — real page, camera dives to the skills folder, 11 skills cascade
  ghCam(t); $("gh-row1").classList.toggle("hi", t >= at("Eleven"));
  [...$("sk").children].forEach((c, i) => { const p = E.power4Out(prog(t, at("Eleven") + 0.15 + i * 0.05, 0.3)); c.style.opacity = p; c.style.transform = `translateY(${(1 - p) * 30}px)`; });
  R.note("fn1", t, T.gh + 0.4, T.term - 0.3);
  // TERMINAL — /li-post: one idea in, three hooks out (formula names from hooks.json), draft ready
  const a = T.term + 0.2;
  U.termPlay("tm", t, [
    { t: a, kind: "cmd", text: "/li-post my job search now takes one sentence" },
    { t: at("three") - 0.1, kind: "claude", text: "3 hooks (from 21 formulas):" },
    { t: at("hooks,"), kind: "out", text: "1 · Time Anchor — \"Finding internships used to take me a weekend. It now takes one sentence.\"" },
    { t: at("from") , kind: "out", text: "2 · The Receipt — \"37 internships. 1 sentence. 0 job portals.\"" },
    { t: at("formulas,") , kind: "out", text: "3 · Myth Bust — \"Applying to 200 jobs is not why you have no interviews.\"" },
    { t: at("full draft."), kind: "ok", text: "Draft ready · humanized before you see it" } ], { cps: 38 });
  R.note("fn2", t, T.term + 0.6, T.hum - 0.3);
  // HUMANIZER (light) — strike the slop on its words, replacement pops in; invisible chars vanish
  [["h1", at("strips") - 0.1], ["h2", at("AI") - 0.05], ["h3", at("words,")], ["h4", at("em")], ["h5", at("dashes,") + 0.2]].forEach(([id, a2]) => {
    const p = prog(t, a2, 0.35), el = $(id); el.querySelector("s").style.opacity = 1 - 0.65 * p; el.querySelector("i").style.opacity = p; el.querySelector("i").style.display = p > 0 ? "" : "none";
    if (p > 0) R.cue("pop", a2, { soft: true }); });
  ["z1", "z2"].forEach((id, k) => { const p = prog(t, at("hidden") + k * 0.15, 0.3); $(id).style.opacity = 1 - p; $(id).style.width = (18 * (1 - p)) + "px"; $(id).style.margin = p >= 1 ? "0" : "0 2px"; });
  [...$("flags").children].forEach((f, i) => { const p = E.power4Out(prog(t, at("characters.") + 0.25 + i * 0.07, 0.3)); f.style.opacity = p; f.style.transform = `translateY(${(1 - p) * 14}px)`; });
  R.note("fn3", t, T.hum + 0.4, T.three - 0.3);
  // THREE SKILLS — staged reveals on their words
  [["c1", at("comments,")], ["c2", at("scores")], ["c3", at("plans")]].forEach(([id, a2]) => { const p = E.power4Out(prog(t, a2 - 0.15, 0.35)); $(id).style.opacity = p; $(id).style.transform = `translateY(${(1 - p) * 30}px)`; });
  [...$("rub").children].forEach((r, i) => r.classList.toggle("on", t >= at("profile") + i * 0.07));
  [...$("wk").children].forEach((d, i) => d.classList.toggle("on", t >= at("whole") + i * 0.1));
  R.note("fn4", t, T.three + 0.4, T.post - 0.3);
  // POST — Claude is locked out of the button; you read (scan line), you press
  const lk = E.backOut(prog(t, at("never") - 0.05, 0.4), 1.5); $("lock").style.opacity = clamp(prog(t, at("never") - 0.05, 0.2) * 5) * (1 - prog(t, at("read") - 0.1, 0.25)); $("lock").style.transform = `scale(${lerp(0.7, 1, lk)})`;
  const sc = prog(t, at("read"), 0.7); $("scan").style.opacity = sc > 0 && sc < 1 ? 1 : 0; $("scan").style.top = (100 + sc * 300) + "px";
  R.press("pbtn", t, at("press") + 0.15); F.flash(t, at("post.") + 0.05, { max: 0.22, sfx: false });
  // STARS — real count + chips
  F.odometer("odo", t, T.star + 0.1, 0.9, 3000); [...$("chips").children].forEach((c, i) => { const p = E.power4Out(prog(t, at("Free.") - 0.1 + i * 0.25, 0.3)); c.style.opacity = p; c.style.transform = `translateY(${(1 - p) * 16}px)`; });
  // CTA — comment POST, DM lands
  [["r1", T.cta + 0.15], ["r2", T.cta + 0.3]].forEach(([id, a2]) => { const p = E.power4Out(prog(t, a2, 0.3)); $(id).style.opacity = p; });
  const tyA = at("Comment") + 0.35, sent = tyA + 0.5;
  if (t < sent) R.type("cty", "POST", t, tyA, 14); else $("cty").textContent = "";
  $("cph").style.display = (t < tyA || t >= sent) ? "" : "none"; R.press("snd", t, sent - 0.1);
  $("r3").style.opacity = E.power4Out(prog(t, sent, 0.3));
  R.sheet("dm", t, at("DM"), { dy: -140, d: 0.5 });
};
window.seek(0);
</script></body></html>
