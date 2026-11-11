#!/usr/bin/env python3
"""reelqa.py - the canwe.ai pro-reel QA gate: measure what we can't watch or hear.

Our own implementation of the checks studied in (all MIT, credit in the skill):
  win4r/video-director  qa_video.py   frame 0, single-frame flashes, pops, cuts, frozen stretches,
                                      loudness/true peak, silence before the loudest moment, sheets
  alchaincyf/huashu-motion rhythm.md  dead time (> ~2 bars with nothing new), energy curve,
                                      burst position (~30-60 % of length), hook onset within 3 s
  vincentsch/explainroo + SallyRS     Reels safe zone + minimum text size (done in reeltext.mjs)
  Leonxlnx/earshot launch kit         SFX density per 10 s by film type

usage: python3 reelqa.py film.mp4 --out qa_dir [--cues cues.json] [--type explainer|music_led]
writes qa_dir/report.md + report.json + hook_sheet.jpg + phone_sheet.jpg + energy.png
"""
import argparse, json, math, re, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

AW = 192  # analysis width (tiny greyscale frames)


def sh(cmd, binary=False):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]}: {r.stderr.decode(errors='replace')[-400:]}")
    return r.stdout if binary else r.stdout.decode()


def probe(p):
    o = json.loads(sh(["ffprobe", "-v", "error", "-show_entries",
                       "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", p]))
    v = next(s for s in o["streams"] if s["codec_type"] == "video")
    n, d = (int(x) for x in v["r_frame_rate"].split("/"))
    return {"w": v["width"], "h": v["height"], "fps": n / d, "dur": float(o["format"]["duration"]),
            "audio": any(s["codec_type"] == "audio" for s in o["streams"])}


def runs(mask):
    out, s = [], None
    for i, m in enumerate(mask):
        if m and s is None: s = i
        elif not m and s is not None: out.append((s, i)); s = None
    if s is not None: out.append((s, len(mask)))
    return out


def picture(p, info):
    ah = max(2, int(round(AW * info["h"] / info["w"] / 2)) * 2); size = AW * ah
    pr = subprocess.Popen(["ffmpeg", "-v", "error", "-i", p, "-vf", f"scale={AW}:{ah}:flags=area,format=gray",
                           "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    mean, std, d, skip = [], [], [], []
    prev = prev2 = None
    while True:
        b = pr.stdout.read(size)
        if len(b) < size: break
        f = np.frombuffer(b, np.uint8).reshape(ah, AW).astype(np.int16)
        mean.append(float(f.mean())); std.append(float(f.std()))
        d.append(float(np.abs(f - prev).mean()) if prev is not None else 0.0)
        if prev2 is not None: skip.append(float(np.abs(f - prev2).mean()))
        prev2, prev = prev, f
    pr.wait()
    n = len(d); d = np.array(d); skip = np.array([math.nan] + skip + [math.nan])[:n]
    return n, np.array(mean), np.array(std), d, skip


def analyse_picture(n, mean, std, d, skip, fps):
    med = float(np.median(d[1:]))
    tf = max(2.0, 4 * med)
    flashes = [i for i in range(1, n - 1) if d[i] > tf and d[i + 1] > tf and skip[i] < 0.35 * min(d[i], d[i + 1])]
    ff = set(flashes) | {i + 1 for i in flashes}
    cuts = []
    for i in range(1, n):
        if i in ff: continue
        loc = np.concatenate([d[max(1, i - 15):i], d[i + 1:min(n, i + 16)]])
        if d[i] > max(6.0, 3.5 * (float(np.median(loc)) + 0.5)): cuts.append(i)
    pops = [i for i in range(1, n - 1) if i not in ff and i not in cuts and d[i] > 2.0 and d[i] > 3 * max(d[i - 1], d[i + 1])]
    # energy per second (mean abs frame diff) -> huashu energy curve; dead = a second with almost no change
    sec = int(math.ceil(n / fps)); energy = []
    for s in range(sec):
        seg = d[int(s * fps) + (1 if s == 0 else 0):int((s + 1) * fps)]
        energy.append(float(seg.mean()) if seg.size else 0.0)
    energy = np.array(energy)
    still = d < 0.25; still[0] = False
    frozen = [(a / fps, b / fps) for a, b in runs(still) if (b - a) / fps >= 1.0]
    # dead time = >= 2 s where per-frame change stays under 15 % of the film's median motion
    low = d < max(0.35, 0.15 * med); low[0] = False
    dead = [(round(a / fps, 2), round(b / fps, 2)) for a, b in runs(low) if (b - a) / fps >= 2.0]
    # burst: densest 5 s window by count of cuts + pops (events)
    ev = np.zeros(n); ev[cuts] = 1; ev[pops] = 0.5
    w = int(5 * fps); dens = np.convolve(ev, np.ones(w), "valid") if n > w else ev
    bi = int(np.argmax(dens)); burst_at = (bi + w / 2) / fps
    hook_onset = next((i / fps for i in range(1, n) if d[i] > 2.5), None)  # absolute: independent of later motion
    return {"frame0": {"mean": round(mean[0], 1), "contrast": round(std[0], 1)}, "median_step": round(med, 3),
            "flashes": [round(i / fps, 2) for i in flashes], "pops": [round(i / fps, 2) for i in pops],
            "cuts": [round(i / fps, 2) for i in cuts], "frozen": [(round(a, 2), round(b, 2)) for a, b in frozen],
            "dead": dead, "energy": [round(x, 2) for x in energy], "burst_at": round(burst_at, 2),
            "burst_events": float(dens[bi]), "hook_onset": None if hook_onset is None else round(hook_onset, 2)}


def audio(p, rel=15.0, ab=-30.0):
    log = subprocess.run(["ffmpeg", "-nostats", "-i", p, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"],
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE).stderr.decode(errors="replace")
    sm = log[log.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+)\s+LUFS", sm); tp = re.search(r"Peak:\s+(-?[\d.]+)\s+dBFS", sm)
    sr = 16000; x = np.frombuffer(sh(["ffmpeg", "-v", "error", "-i", p, "-map", "0:a:0", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], True), np.float32)
    win, hop = int(0.1 * sr), int(0.05 * sr); nw = 1 + (x.size - win) // hop
    db = np.array([20 * math.log10(math.sqrt(float(np.mean(x[k * hop:k * hop + win] ** 2)) + 1e-12)) for k in range(nw)])
    k = int(np.argmax(db)); tpk = (k * hop + win / 2) / sr; p90 = float(np.percentile(db, 90))
    th = min(p90 - rel, ab)
    sil = [((a * hop) / sr, ((b - 1) * hop + win) / sr) for a, b in runs(db < th)]
    sil = [(round(a, 2), round(b, 2)) for a, b in sil if b - a >= 0.4]
    # music "stop-down" (earshot/huashu): any 0.3 s+ dip >= 6 dB under the local level before the loudest moment
    dips = []
    for j in range(10, nw - 6):
        if db[j] < np.median(db[max(0, j - 30):j]) - 6 and db[j + 6] > db[j] + 8: dips.append(round(j * hop / sr, 2))
    return {"lufs": float(i.group(1)) if i else None, "true_peak": float(tp.group(1)) if tp else None,
            "loudest_at": round(tpk, 2), "silences": sil,
            "silence_before_peak": any(b <= tpk + 0.05 and tpk - b <= 4 for _, b in sil), "stop_downs": sorted(set(dips))[:20]}


def grab(p, t, w, tmp):
    o = tmp / f"g{t:07.3f}.png"
    sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, t):.3f}", "-i", p, "-frames:v", "1", "-vf", f"scale={w}:-2", str(o)])
    return Image.open(o).convert("RGB")


def contact(p, times, w, cols, dest, tmp):
    tiles = []
    for t in times:
        im = grab(p, t, w, tmp); dr = ImageDraw.Draw(im); dr.rectangle([0, 0, im.width, 22], fill=(0, 0, 0))
        dr.text((6, 5), f"{t:.1f}s", fill=(255, 255, 255)); tiles.append(im)
    tw, th = tiles[0].size; rows = math.ceil(len(tiles) / cols)
    c = Image.new("RGB", (cols * tw + (cols - 1) * 4, rows * th + (rows - 1) * 4), (40, 40, 40))
    for i, im in enumerate(tiles): c.paste(im, ((i % cols) * (tw + 4), (i // cols) * (th + 4)))
    c.save(dest, quality=86)


def energy_png(energy, cuts, dur, dest):
    W, H = 900, 220; im = Image.new("RGB", (W, H), (250, 247, 242)); dr = ImageDraw.Draw(im)
    mx = max(energy) or 1; n = len(energy)
    for i, e in enumerate(energy):
        x0 = int(i * W / n); x1 = int((i + 1) * W / n) - 2; h = int((H - 30) * e / mx)
        dr.rectangle([x0, H - 20 - h, x1, H - 20], fill=(217, 119, 87))
    for c in cuts: x = int(c / dur * W); dr.line([x, 0, x, H - 20], fill=(30, 30, 30), width=1)
    dr.text((6, H - 16), "energy per second (bars) · cuts (lines)", fill=(60, 60, 60)); im.save(dest)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("--out", default="qa")
    ap.add_argument("--cues"); ap.add_argument("--type", default="explainer", choices=["explainer", "music_led"])
    ap.add_argument("--text", help="reeltext.json from reeltext.mjs (safe zone + text size)")
    ap.add_argument("--music", help="the music stem as mixed (checks the stop-down before each hit)")
    a = ap.parse_args(); out = Path(a.out); out.mkdir(parents=True, exist_ok=True); tmp = out / "_tmp"; tmp.mkdir(exist_ok=True)
    info = probe(a.video); fps = info["fps"]
    P = analyse_picture(*picture(a.video, info), fps); A = audio(a.video) if info["audio"] else {}
    R = []  # (status, check, detail)
    add = lambda s, c, d: R.append((s, c, d))
    add("PASS" if P["frame0"]["contrast"] > 18 else "FAIL", "frame 0 is a finished picture", f"contrast {P['frame0']['contrast']}")
    ho = P["hook_onset"]; add("PASS" if ho is not None and ho <= 3 else "FAIL", "hook: visible change within 3 s", f"first onset {ho}s")
    add("PASS" if not P["flashes"] else "WARN", "no single-frame flashes", str(P["flashes"][:8]))
    add("PASS" if len(P["pops"]) <= 6 else "WARN", "few single-frame pops", f"{len(P['pops'])}: {P['pops'][:10]}")
    add("PASS" if not P["frozen"] else "WARN", "no frozen stretches >= 1 s", str(P["frozen"]))
    add("PASS" if not P["dead"] else "FAIL", "no dead time >= 2 s (huashu: nothing new for 2 bars)", str(P["dead"]))
    bp = P["burst_at"] / info["dur"]
    add("PASS" if 0.25 <= bp <= 0.65 else "WARN", "densest 5 s burst sits at 30-60 % of length", f"{P['burst_at']}s = {bp:.0%}")
    cpm = len(P["cuts"]) / info["dur"] * 60
    add("PASS" if cpm >= 10 else "WARN", "cut rate >= 10/min (21 launch films: 15-33)", f"{len(P['cuts'])} cuts = {cpm:.1f}/min")
    if A:
        add("PASS" if A["lufs"] is not None and abs(A["lufs"] + 14) <= 1 else "FAIL", "loudness -14 LUFS ±1", f"{A['lufs']} LUFS")
        add("PASS" if A["true_peak"] is not None and A["true_peak"] <= -1.0 else "FAIL", "true peak <= -1 dBTP", f"{A['true_peak']} dBTP")
        if a.music and a.cues:
            import soundfile as sf
            m, sr = sf.read(a.music, always_2d=True); m = m.mean(1)
            rms = lambda t0, t1: 20 * math.log10(math.sqrt(float(np.mean(m[max(0, int(t0 * sr)):max(1, int(t1 * sr))] ** 2)) + 1e-12))
            cl = json.load(open(a.cues)); hits = sorted({round(c["t"], 2) for c in cl if c.get("type") in ("impact", "bigwhoosh", "swell")})
            deep = [h for h in hits if h > 1.2 and rms(h - 1.0, h - 0.5) - rms(h - 0.33, h - 0.05) >= 6]
            add("PASS" if hits and len(deep) >= 0.8 * len(hits) else "WARN", "music steps down >= 6 dB before each hit (earshot/huashu)", f"{len(deep)}/{len(hits)} hits: {deep[:8]}")
        else:
            add("WARN", "music steps down >= 6 dB before each hit (earshot/huashu)", "not measured: pass --music <stem> --cues")
    if a.cues:
        cues = json.load(open(a.cues)); cl = cues if isinstance(cues, list) else cues.get("cues", [])
        # count audible effects: a "type" cue is a run of keys (one per ~0.1 s), impact = hit + drop
        nfx = sum(max(1, int((c.get("t2", c["t"] + 0.6) - c["t"]) / 0.1) + 1) if c.get("type") == "type" else 2 if c.get("type") == "impact" else 1 for c in cl)
        dens = nfx / info["dur"] * 10; lo, hi = (18, 30) if a.type == "explainer" else (3, 13)
        add("PASS" if lo <= dens <= hi else "WARN", f"SFX density {lo}-{hi} per 10 s (earshot launch kit, {a.type})", f"{nfx} effects from {len(cl)} cues = {dens:.1f}/10 s")
    if a.text:
        T = json.load(open(a.text)); bad = T.get("unsafe", []); small = T.get("small", [])
        add("PASS" if not bad else "FAIL", "text inside the Reels safe zone (top 15 %, bottom 35 %, right 20 %, left 6 %)", f"{len(bad)} violations: " + "; ".join(f"{u['t']}s '{u['text'][:28]}' {u['why']}" for u in bad[:6]))
        add("PASS" if not small else "WARN", "readable text >= 3 % of frame height (58 px), hook >= 4 %", f"{len(small)} small: " + "; ".join(f"{u['t']}s '{u['text'][:24]}' {u['px']}px" for u in small[:6]))
    contact(a.video, [i * 0.5 for i in range(7)], 360, 7, out / "hook_sheet.jpg", tmp)
    contact(a.video, list(range(0, int(info["dur"]), 2)), 240, 8, out / "phone_sheet.jpg", tmp)
    energy_png(P["energy"], P["cuts"], info["dur"], out / "energy.png")
    for f in tmp.iterdir(): f.unlink()
    tmp.rmdir()
    sc = {"PASS": 0, "WARN": 0, "FAIL": 0}
    for s, _, _ in R: sc[s] += 1
    score = round(100 * (sc["PASS"] + 0.5 * sc["WARN"]) / len(R))
    md = [f"# reelqa: {Path(a.video).name}", f"{info['w']}x{info['h']} {fps:.0f} fps {info['dur']:.1f} s · **score {score}/100** "
          f"({sc['PASS']} pass, {sc['WARN']} warn, {sc['FAIL']} fail)", "", "| | check | measured |", "|---|---|---|"]
    md += [f"| {s} | {c} | {d} |" for s, c, d in R]
    md += ["", f"energy per second: {P['energy']}", f"cuts: {P['cuts']}"]
    (out / "report.md").write_text("\n".join(md)); json.dump({"score": score, "checks": R, "picture": P, "audio": A}, open(out / "report.json", "w"), indent=1)
    print("\n".join(md[:2] + md[4:4 + len(R) + 1]))
    sys.exit(1 if sc["FAIL"] else 0)


if __name__ == "__main__":
    main()
