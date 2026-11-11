/* phone-frame: a phone with real-looking screens (lock screen, incoming call, settings page, or your own content).
 * opts:  { w, h, screens: [{ kind: "lock", time, date, notif: { app, text } } | { kind: "call", name, sub } | { kind: "settings", title, rows: [{ label, value, toggle }] } | { kind: "custom" }] }
 * state: { show: 0..1, screen: 0..n-1 (fractions cross-fade), notif: 0..1, slide: 0..1 (answer slider), toggles: [0..1 per row], tilt: degrees, glove: bool }
 * api:   frame(t, state) · screen(i) → the element of screen i (put your own content into a "custom" one) */
KF.define("phone-frame", (host, o) => {
  KF.css("phone", `.kf-ph{position:absolute;border-radius:66px;background:#0b0b0d;box-shadow:0 0 0 4px #2c2e36,0 0 0 11px #0f1013,0 60px 120px -30px rgba(0,0,0,.85);transform-origin:50% 60%}
.kf-ph .scr{position:absolute;inset:14px;border-radius:54px;overflow:hidden;background:#000}.kf-ph .isl{position:absolute;left:50%;top:28px;width:124px;height:36px;margin-left:-62px;border-radius:18px;background:#000;z-index:5}
.kf-ph .s{position:absolute;inset:0;font-family:Inter;color:#fff}.kf-ph .lock{background:radial-gradient(120% 80% at 30% 10%,#3a4b7a,#141a2e 60%,#07080d)}
.kf-ph .lock .d{position:absolute;left:0;right:0;top:110px;text-align:center;font:600 26px Inter;opacity:.85}.kf-ph .lock .t{position:absolute;left:0;right:0;top:140px;text-align:center;font:800 124px Inter;letter-spacing:-4px}
.kf-ph .nt{position:absolute;left:18px;right:18px;top:330px;padding:18px 20px;border-radius:26px;background:rgba(255,255,255,.2);backdrop-filter:blur(12px);font:600 24px/1.3 Inter}.kf-ph .nt b{display:block;font:800 22px Inter;opacity:.8;margin-bottom:4px}
.kf-ph .call{background:linear-gradient(170deg,#6b5a4c,#2b241f 70%)}.kf-ph .call .av{position:absolute;left:50%;top:150px;width:150px;height:150px;margin-left:-75px;border-radius:50%;background:linear-gradient(140deg,#F0A585,#D97757);display:grid;place-items:center;font:900 64px Inter;color:#1a0e08}
.kf-ph .call .n{position:absolute;left:0;right:0;top:330px;text-align:center;font:800 52px Inter}.kf-ph .call .u{position:absolute;left:0;right:0;top:400px;text-align:center;font:600 26px Inter;opacity:.7}
.kf-ph .sl{position:absolute;left:26px;right:26px;bottom:70px;height:92px;border-radius:46px;background:rgba(255,255,255,.2);font:600 26px Inter;display:grid;place-items:center;color:rgba(255,255,255,.75)}.kf-ph .kn{position:absolute;left:8px;top:8px;width:76px;height:76px;border-radius:50%;background:#3ddc6b;display:grid;place-items:center;font-size:36px}
.kf-ph .set{background:#0f1013}.kf-ph .set h3{margin:96px 26px 18px;font:900 46px Inter}.kf-ph .row{margin:0 18px 10px;padding:0 20px;height:84px;border-radius:22px;background:#1c1e24;display:flex;align-items:center;font:600 28px Inter}
.kf-ph .row i{margin-left:auto;font-style:normal;color:#8b8f98}.kf-ph .tg{margin-left:auto;width:76px;height:44px;border-radius:22px;background:#3a3d46;position:relative}.kf-ph .tg b{position:absolute;top:4px;left:4px;width:36px;height:36px;border-radius:50%;background:#fff}`);
  const w = o.w || 440, h = o.h || 900, ph = KF.el("div", "kf-ph", host), scr = KF.el("div", "scr", ph); KF.el("div", "isl", ph);
  ph.style.cssText = `width:${w}px;height:${h}px;left:${(host.clientWidth - w) / 2}px;top:${(host.clientHeight - h) / 2}px`;
  const S = (o.screens || [{ kind: "lock" }]).map(c => { const e = KF.el("div", "s " + (c.kind === "settings" ? "set" : c.kind), scr); e.dataset.qa = "texture";
    if (c.kind === "lock") { e.innerHTML = `<div class="d">${c.date || "Saturday, January 17"}</div><div class="t">${c.time || "7:42"}</div>` + (c.notif ? `<div class="nt"><b>${c.notif.app}</b>${c.notif.text}</div>` : ""); }
    if (c.kind === "call") e.innerHTML = `<div class="av">${(c.name || "S")[0]}</div><div class="n">${c.name || "Sofia"}</div><div class="u">${c.sub || "mobile"}</div><div class="sl">slide to answer<div class="kn">📞</div></div>`;
    if (c.kind === "settings") e.innerHTML = `<h3>${c.title || "Settings"}</h3>` + (c.rows || []).map(r => `<div class="row">${r.label}${r.toggle != null ? '<span class="tg"><b></b></span>' : `<i>${r.value || ""}</i>`}</div>`).join("");
    return { c, e }; });
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), sp = KF.ease.back(a), cur = s.screen ?? 0;
      ph.style.opacity = Math.min(1, a * 2); ph.style.transform = `translateY(${((1 - sp) * 240).toFixed(1)}px) rotate(${(s.tilt ?? 0).toFixed(2)}deg)`;
      S.forEach(({ c, e }, i) => { e.style.opacity = KF.clamp(1 - Math.abs(cur - i)); e.style.zIndex = Math.abs(cur - i) < 0.5 ? 2 : 1;
        if (c.kind === "lock" && c.notif) { const n = e.querySelector(".nt"), p = KF.clamp(s.notif ?? 0); n.style.opacity = p; n.style.transform = `translateY(${((1 - KF.ease.back(p)) * 60).toFixed(1)}px)`; }
        if (c.kind === "call") e.querySelector(".kn").style.transform = `translateX(${(KF.clamp(s.slide ?? 0) * (w - 28 - 52 - 92)).toFixed(1)}px)`;
        if (c.kind === "settings") e.querySelectorAll(".tg").forEach((g, k) => { const p = KF.clamp((s.toggles || [])[k] ?? 0); g.style.background = p > 0.5 ? "#3ddc6b" : "#3a3d46"; g.firstChild.style.transform = `translateX(${(p * 32).toFixed(1)}px)`; }); }); },
    screen: i => S[i].e };
});
