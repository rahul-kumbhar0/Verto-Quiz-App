#!/usr/bin/env python3
"""sfx_pro.py - place earshot bank takes on our cues with earshot's measured sync + levels.

usage: python3 sfx_pro.py cues.json duration out_sfx.wav [--music music.wav --music-out music_sd.wav] [--bank DIR]

Rules (from Leonxlnx/earshot kits/launch.json, medians measured on licensed reference clips):
  taps/knocks/clicks LEAD the cut (-60/-40/-11 ms) · pop-in thumps land +30 ms after · whoosh PEAKS land
  ~+37 ms after the cut · a riser PEAKS ~23 ms before it · keys every >= 87 ms, a new take per key ·
  one gesture at a time: the music steps DOWN 6-12 dB for 0.3-0.5 s before a hit/drop/big whoosh/swell
  and comes back ON the hit; nothing ducks under the effects.
Takes are rendered once by `earshot sfx render` into the bank dir as <role>_<n>.wav.
"""
import argparse, glob, json, math, os, re
import numpy as np
import soundfile as sf

SR = 48000
# role: (level dB, align "onset"|"peak", offset ms, min gap ms)   — levels = earshot level_db
ROLE = {"pop": (-8.0, "onset", 4, 114), "land": (-5.5, "onset", 30, 159), "tap": (-10.0, "onset", -60, 115),
        "tock": (-1.5, "onset", -40, 100), "hit": (-9.0, "onset", 0, 300), "drop": (-8.5, "onset", 0, 300),
        "whoosh": (-5.5, "peak", 37, 200), "swish": (-6.0, "peak", 37, 200), "whooshbig": (-6.5, "peak", 3, 400),
        "riser": (-3.5, "peak", -23, 2000), "swell": (-5.5, "peak", 42, 2000), "key": (-1.0, "onset", 8, 87),
        "keyret": (-0.5, "onset", 8, 87), "click": (0.0, "onset", -11, 85), "ding": (-8.5, "onset", 0, 300),
        "snap": (-7.0, "onset", 9, 66), "tick": (0.0, "onset", 0, 66), "glitch": (-6.0, "onset", 0, 200)}
# our engine's cue types -> earshot roles (a cue may fire a layered pair)
MAP = {"pop": ["pop"], "swish": ["swish"], "whoosh": ["whoosh"], "impact": ["hit", "drop"], "click": ["click"],
       "ding": ["ding"], "shutter": ["snap"], "glitch": ["glitch"], "riser": ["riser"], "land": ["land"],
       "tap": ["tap"], "tick": ["tick"], "tock": ["tock"], "swell": ["swell"], "bigwhoosh": ["whooshbig"]}
STOPDOWN = {"hit", "drop", "whooshbig", "swell"}


def load(bank):
    T = {}
    for f in sorted(glob.glob(os.path.join(bank, "*.wav"))):
        role = re.sub(r"_\d+$", "", os.path.basename(f)[:-4])
        x, sr = sf.read(f, always_2d=True); x = x.mean(1)
        if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
        env = np.convolve(np.abs(x), np.ones(240) / 240, "same")  # 5 ms envelope
        on = int(np.argmax(env > env.max() * 0.0316)); pk = int(np.argmax(env))
        T.setdefault(role, []).append((x.astype(np.float32), on, pk))
    return T


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("cues"); ap.add_argument("dur", type=float); ap.add_argument("out")
    ap.add_argument("--bank", default="/root/reel-work/sfxbank/earshot"); ap.add_argument("--music"); ap.add_argument("--music-out")
    ap.add_argument("--gain", type=float, default=0.0, help="dB on the whole effects bus")
    a = ap.parse_args()
    T = load(a.bank); n = int(a.dur * SR) + SR; bus = np.zeros(n, np.float32)
    raw = json.load(open(a.cues)); cues = raw if isinstance(raw, list) else raw.get("cues", [])
    ev = []  # (time, role, level offset)
    for c in cues:
        typ, t = c.get("type"), float(c.get("t", 0))
        if typ == "type":  # one key per character-ish: every 87-120 ms between t and t2, return key at the end
            t2 = float(c.get("t2", t + 0.6)); k = 0; x = t
            while x < t2 - 0.05:
                ev.append((x, "key", -3.0 * (k % 3 == 1))); x += 0.087 + 0.033 * ((k * 7) % 3) / 2; k += 1
            ev.append((t2, "keyret", 0.0)); continue
        for r in MAP.get(typ, []):
            ev.append((t, r, -4.0 if c.get("soft") else 0.0))
    ev.sort()
    last, used, placed, stops = {}, {}, 0, []
    for t, r, lo in ev:
        if r not in T: continue
        lvl, align, off, gap = ROLE[r]
        if t - last.get(r, -9) < gap / 1000: continue
        last[r] = t
        takes = T[r]; i = used.get(r, 0); used[r] = i + 1; x, on, pk = takes[i % len(takes)]
        anchor = (pk if align == "peak" else on)
        s = int((t + off / 1000) * SR) - anchor
        g = 10 ** ((lvl + lo) / 20) / (np.abs(x).max() + 1e-9) * 0.5
        a0, b0 = max(0, s), min(n, s + len(x))
        if b0 > a0: bus[a0:b0] += x[a0 - s:b0 - s] * g; placed += 1
        if r in STOPDOWN: stops.append(t)
    bus *= 10 ** (a.gain / 20)
    pk = np.abs(bus).max()
    if pk > 0.89: bus *= 0.89 / pk
    sf.write(a.out, bus[:int(a.dur * SR)], SR, subtype="PCM_24")
    dens = placed / a.dur * 10
    print(f"sfx_pro: {placed} effects placed from {len(cues)} cues ({dens:.1f} per 10 s), {len(set(stops))} stop-downs -> {a.out}")
    if a.music and a.music_out:  # music stop-down: -9 dB for 0.4 s before each hit, back ON the hit
        m, sr = sf.read(a.music, always_2d=True); tt = np.arange(len(m)) / sr; gdb = np.zeros(len(m))
        for h in sorted(set(round(s, 3) for s in stops)):
            down = (tt >= h - 0.42) & (tt < h)
            ramp = np.clip((tt - (h - 0.42)) / 0.06, 0, 1)  # 60 ms fall into the hole
            gdb = np.where(down, np.minimum(gdb, -9.0 * ramp), gdb)
        m = m * (10 ** (gdb / 20))[:, None]
        sf.write(a.music_out, m, sr, subtype="PCM_24"); print(f"music stop-downs written -> {a.music_out}")


if __name__ == "__main__":
    main()
