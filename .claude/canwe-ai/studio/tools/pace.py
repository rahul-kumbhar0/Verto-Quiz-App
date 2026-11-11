#!/usr/bin/env python3
"""Fast, stop-and-go delivery: tighten a voice take's real silences, insert hard stops, optionally speed the speech.

usage: python3 pace.py voice.wav words.json stops.json out.wav out_words.json
         [--pause 0.20] [--stop 0.55] [--tempo 1.0] [--floor-db -40] [--min-run 0.12]

words.json  = aligned word timings ({"words":[{text,start,end},...]})
stops.json  = {"stops": ["phrase whose LAST word gets the hard stop", ...]}  (raw spoken tokens)

How: silences are found by energy (10 ms RMS windows under --floor-db for >= --min-run s), not by
word gaps, so it works however the aligner drew word boundaries. Every detected pause is trimmed
to --pause s; a pause at a marked stop is set to exactly --stop s (padded if speech runs straight
through). --tempo > 1 then speeds the SPEECH via ffmpeg atempo (pitch kept; 1.05-1.10 is safe).
Writes the re-paced wav + remapped words.json: captions, at() anchors, cues, sfx and music all
re-sync from it. Cuts get 6 ms fades, so nothing clicks.
"""
import json, re, subprocess, sys, wave
from array import array

def die(m): print(m); sys.exit(1)

def main():
    a = sys.argv[1:]
    opts = {"--pause": 0.20, "--stop": 0.55, "--tempo": 1.0, "--floor-db": -40.0, "--min-run": 0.12}
    pos = []
    i = 0
    while i < len(a):
        if a[i] in opts: opts[a[i]] = float(a[i + 1]); i += 2
        else: pos.append(a[i]); i += 1
    if len(pos) != 5: die(__doc__)
    vin, wjs, sjs, vout, wout = pos

    words = json.load(open(wjs))["words"]
    norm = lambda t: re.sub(r"[^\w']+", "", t.lower())
    toks = [norm(w["text"]) for w in words]
    stop_times = []                                   # source time where each hard stop belongs
    for ph in json.load(open(sjs)).get("stops", []):
        pt = [norm(x) for x in ph.split()]
        hit = next((j for j in range(len(toks) - len(pt) + 1) if toks[j:j + len(pt)] == pt), None)
        if hit is None: die(f'pace.py: stop phrase not found in words.json: "{ph}"')
        stop_times.append(words[hit + len(pt) - 1]["end"])

    # pcm mono s16
    try:
        w = wave.open(vin); assert w.getnchannels() == 1 and w.getsampwidth() == 2
    except Exception:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", vin, "-ac", "1", "-ar", "44100",
                        "-c:a", "pcm_s16le", vout + ".tmp.wav"], check=True)
        vin = vout + ".tmp.wav"; w = wave.open(vin)
    sr = w.getframerate(); pcm = array("h"); pcm.frombytes(w.readframes(w.getnframes())); w.close()

    # silence runs by 10 ms RMS
    win = sr // 100
    import math
    rms = []
    for s in range(0, len(pcm) - win, win):
        seg = pcm[s:s + win]; rms.append(math.sqrt(sum(x * x for x in seg) / win) / 32768 + 1e-9)
    thr = 10 ** (opts["--floor-db"] / 20)
    runs = []; s = None
    for k, v in enumerate(rms + [1.0]):
        if v < thr and s is None: s = k
        elif v >= thr and s is not None:
            if (k - s) * win / sr >= opts["--min-run"]: runs.append((s * win / sr, k * win / sr))
            s = None

    # edits: (source_time, cut_seconds>0 | pad_seconds<0), keeping --pause (or --stop) of each run
    word_end_near = lambda t: min((abs(w["end"] - t), w) for w in words)[1]
    edits = []
    used_stop = set()
    for (r0, r1) in runs:
        dur = r1 - r0
        tgt = opts["--pause"]
        for st in stop_times:
            if r0 - 0.15 <= st <= r1 + 0.15: tgt = opts["--stop"]; used_stop.add(st)
        if dur > tgt: edits.append(((r0 + r1) / 2, dur - tgt))
        elif tgt == opts["--stop"] and dur < tgt: edits.append(((r0 + r1) / 2, dur - tgt))
    for st in stop_times:                              # stop with no silence at all: inject one
        if st not in used_stop: edits.append((st, -opts["--stop"]))
    edits.sort()

    FADE = int(0.006 * sr); S = lambda t: max(0, min(len(pcm), int(round(t * sr))))
    out = array("h"); cur = 0.0; mapping = []          # (source_t_after_edit, out_t_after_edit)
    def emit(t0, t1):
        seg = pcm[S(t0):S(t1)]
        for k in range(min(FADE, len(seg) // 2)):
            seg[k] = int(seg[k] * k / FADE); seg[-1 - k] = int(seg[-1 - k] * k / FADE)
        out.extend(seg)
    lead = min(words[0]["start"], 0.15)                # trim long leading silence
    if words[0]["start"] > lead: cur = words[0]["start"] - lead; mapping.append((cur, 0.0))
    for (t, amt) in edits:
        if amt > 0:                                    # cut amt seconds centred on t
            emit(cur, t - amt / 2); cur = t + amt / 2
        else:                                          # pad -amt seconds at t
            emit(cur, t); out.extend(array("h", [0] * int(-amt * sr))); cur = t
        mapping.append((cur, len(out) / sr))
    emit(cur, len(pcm) / sr)

    def remap(t):
        r = t
        for (s_, o_) in mapping:
            if t >= s_: r = o_ + (t - s_)
        return max(0.0, round(r, 4))
    nw = [dict(w, start=round(remap(w["start"]), 3), end=round(remap(w["end"]), 3)) for w in words]

    o = wave.open(vout, "w"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes(out.tobytes()); o.close()
    if opts["--tempo"] != 1.0:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", vout, "-filter:a",
                        f"atempo={opts['--tempo']}", vout + ".t.wav"], check=True)
        subprocess.run(["mv", vout + ".t.wav", vout], check=True)
        nw = [dict(w, start=round(w["start"] / opts["--tempo"], 3), end=round(w["end"] / opts["--tempo"], 3)) for w in nw]
    json.dump({"words": nw}, open(wout, "w"))
    print(f"paced: {words[-1]['end']:.2f}s -> {nw[-1]['end']:.2f}s · {len(runs)} pauses found · "
          f"{len(stop_times)} hard stops @ {opts['--stop']}s · tempo x{opts['--tempo']}")

if __name__ == "__main__":
    main()
