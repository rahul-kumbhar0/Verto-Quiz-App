#!/usr/bin/env python3
"""Voice dynamics: lift or drop the voice at marked moments (the "voice up / voice down" of a real performer).

usage: python3 dynamics.py voice_paced.wav words.json dyn.json out.wav [--ramp 0.12] [--max 4]

words.json = the PACED word timings ({"words":[{text,start,end},...]}); dyn.json = from mark_script.py:
{"marks":[{"at": <word index>, "db": +2.0}, ...]}. A mark's gain starts 60 ms before its word and HOLDS until the
next mark (a <0> mark resets). Ramps are --ramp s (cosine), gains are clamped to +-max dB, so nothing clips: the
whole file is then peak-normalised back to its original peak. Script marks: <up> (+2 dB) <down> (-2.5 dB) <+3> <-4> <0>.
Where they go (voice.md § Dynamics): up on the twist and the payoff number, down right before a reveal and on the
honest catch, back to 0 on the CTA. The ElevenLabs tags shape the TONE; this shapes the LEVEL, after pacing.
"""
import json, math, sys, wave
from array import array

def main():
    a = sys.argv[1:]
    opts = {"--ramp": 0.12, "--max": 4.0}
    pos = []
    i = 0
    while i < len(a):
        if a[i] in opts: opts[a[i]] = float(a[i + 1]); i += 2
        else: pos.append(a[i]); i += 1
    if len(pos) != 4: print(__doc__); sys.exit(1)
    src, wj, dj, out = pos
    words = json.load(open(wj))["words"]; marks = json.load(open(dj)).get("marks", [])
    w = wave.open(src); sr, ch, sw, n = w.getframerate(), w.getnchannels(), w.getsampwidth(), w.getnframes()
    assert sw == 2, "16-bit wav only"
    pcm = array("h"); pcm.frombytes(w.readframes(n)); w.close()
    N = n * ch
    # gain curve per frame
    pts = []
    for m in marks:
        k = max(0, min(len(words) - 1, int(m["at"]))); t0 = max(0.0, words[k]["start"] - 0.06)
        pts.append((t0, max(-opts["--max"], min(opts["--max"], float(m["db"])))))
    pts.sort()
    if not pts: print("no marks: copying"); open(out, "wb").write(open(src, "rb").read()); return
    ramp = opts["--ramp"]
    def gain_at(t):
        g = 0.0
        for (t0, db) in pts:
            if t >= t0 + ramp: g = db
            elif t >= t0: p = (t - t0) / ramp; g = g + (db - g) * (0.5 - 0.5 * math.cos(math.pi * p))
            else: break
        return g
    peak_in = max(1, max(abs(x) for x in pcm))
    outp = array("h", [0]) * N
    step = 441  # evaluate the curve every 10 ms, interpolate linearly inside
    frames = n
    gcache = [10 ** (gain_at(f / sr) / 20) for f in range(0, frames + step, step)]
    for f in range(frames):
        j, r = divmod(f, step); g = gcache[j] + (gcache[j + 1] - gcache[j]) * (r / step)
        for c in range(ch):
            v = int(pcm[f * ch + c] * g); outp[f * ch + c] = max(-32768, min(32767, v))
    peak_out = max(1, max(abs(x) for x in outp))
    if peak_out > peak_in:
        k = peak_in / peak_out
        for i2 in range(N): outp[i2] = int(outp[i2] * k)
    o = wave.open(out, "wb"); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(outp.tobytes()); o.close()
    print(f"dynamics: {len(pts)} marks " + " ".join(f"{t0:.2f}s:{db:+.1f}dB" for t0, db in pts) + f" -> {out}")

if __name__ == "__main__": main()
