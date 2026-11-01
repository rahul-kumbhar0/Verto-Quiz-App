"""Synthesize a subtle UI sound-effects track from cue times.

usage: python3 sfx.py cues.json duration out.wav
cues.json: the list exported by `render.mjs --cues` ([{type, t, t2?}, ...], types:
whoosh | pop | type (t..t2) | click | ding | swish | impact | riser (t..t2) | glitch | shutter), or the legacy dict form
{"whoosh":[...], "pop":[...], "type":[[a,b,cps]], "ding":[...]}.
All sounds are generated here (no samples), so there are no licensing questions.
"""
import json, sys, wave
import numpy as np

SR = 48000
cues_path, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
rng = np.random.default_rng(7)
track = np.zeros(int(SR * dur))

def env(n, a, r):
    e = np.ones(n); a = max(1, int(a)); r = max(1, int(r))
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e

def whoosh(d=0.55):
    n = int(SR * d); x = rng.standard_normal(n)
    cut = np.interp(np.arange(n), [0, n * .55, n], [300, 3800, 900])
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y * env(n, n * .5, n * .5) * 1.6

def pop(f0=520):
    n = int(SR * .12); t = np.arange(n) / SR
    f = f0 + 900 * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32) * .55

def tick():
    n = int(SR * .025); t = np.arange(n) / SR
    x = np.diff(rng.standard_normal(n), prepend=0)
    return x * np.exp(-t * 260) * .18

def click():
    n = int(SR * .06); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 120) * .35 + np.diff(rng.standard_normal(n), prepend=0) * np.exp(-t * 400) * .2)

def ding():
    n = int(SR * 1.4); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(1318.5, 1), (1975.5, .45), (2637, .2)])
    return y * np.exp(-t * 3.2) * env(n, 60, 2000) * .32

def swish(d=0.22):
    n = int(SR * d); x = rng.standard_normal(n); y = np.zeros(n); s = 0.0
    cut = np.interp(np.arange(n), [0, n * .4, n], [1200, 7000, 2500]); a = np.exp(-2 * np.pi * cut / SR)
    for i in range(n): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y * env(n, n * .35, n * .65) * 1.3

def impact():
    n = int(SR * 0.9); t = np.arange(n) / SR
    f = 42 + 70 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    crack = rng.standard_normal(n) * np.exp(-t * 60) * .35
    return (body + crack) * .7

def riser(d):
    n = int(SR * max(.2, d)); t = np.arange(n) / SR; x = rng.standard_normal(n); y = np.zeros(n); s = 0.0
    cut = np.linspace(400, 9000, n); a = np.exp(-2 * np.pi * cut / SR)
    for i in range(n): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    tone = np.sin(2 * np.pi * np.cumsum(np.linspace(220, 880, n)) / SR) * .25
    return (y * 1.2 + tone) * (t / t[-1]) ** 2 * .5

def glitch():
    n = int(SR * .18); x = np.sign(np.sin(2 * np.pi * np.cumsum(rng.choice([180, 360, 1200, 2400], n)) / SR))
    return x * (rng.random(n) > .3) * env(n, 20, n * .3) * .16

def shutter():
    n = int(SR * .09); t = np.arange(n) / SR
    return np.diff(rng.standard_normal(n), prepend=0) * (np.exp(-t * 300) + .6 * np.exp(-((t - .045) ** 2) / 1e-5)) * .3

def place(sig, at, gain=1.0):
    i = int(max(0, at) * SR); j = min(len(track), i + len(sig))
    if i < len(track): track[i:j] += sig[: j - i] * gain

cues = json.load(open(cues_path))
if isinstance(cues, dict):  # legacy form
    cues = ([{"type": "whoosh", "t": t} for t in cues.get("whoosh", [])] + [{"type": "pop", "t": t} for t in cues.get("pop", [])]
            + [{"type": "type", "t": a, "t2": b} for a, b, *_ in cues.get("type", [])] + [{"type": "ding", "t": t} for t in cues.get("ding", [])])
cues.sort(key=lambda c: c["t"])
last_pop = -9
for k, c in enumerate(cues):
    ty, t = c["type"], c["t"]
    if ty == "whoosh": place(whoosh(), t - 0.3, .5)
    elif ty == "pop":
        if t - last_pop < 0.07: continue           # merge pops that land together
        place(pop(480 + 60 * (k % 4)), t, .8); last_pop = t
    elif ty == "type":
        cps = 18
        for i in range(int((c["t2"] - t) * cps)): place(tick(), t + i / cps + rng.uniform(-.008, .008), rng.uniform(.6, 1))
    elif ty == "click": place(click(), t, .9)
    elif ty == "ding": place(ding(), t)
    elif ty == "swish": place(swish(), t - .08, .6)
    elif ty == "impact": place(impact(), t, .55 if c.get("soft") else .8)
    elif ty == "riser": place(riser(c.get("t2", t + 1) - t), t, .5)
    elif ty == "glitch": place(glitch(), t)
    elif ty == "shutter": place(shutter(), t, .8)

track = np.clip(track, -1, 1)
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((track * 32767).astype(np.int16).tobytes())
print("wrote", out, f"{dur}s,", len(cues), "cues")
