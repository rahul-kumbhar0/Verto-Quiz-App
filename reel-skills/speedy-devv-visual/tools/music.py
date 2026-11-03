#!/usr/bin/env python3
"""music.py <duration_s> <out.wav> [bpm=84]
Original slowed dark-ambient beat in the spirit of the reference account's audio
(sub bass + soft kick + sparse hats + minor pad + vinyl hiss). No samples, pure synthesis.
"""
import sys, wave, struct
import numpy as np

dur = float(sys.argv[1]); out = sys.argv[2]
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 84.0
sr = 44100
n = int(dur * sr)
t = np.arange(n) / sr
beat = 60.0 / bpm
mix = np.zeros(n)

def add(sig, at, gain=1.0):
    i = int(at * sr)
    if i >= n: return
    m = min(n - i, len(sig))
    mix[i:i+m] += sig[:m] * gain

# --- kick: 55Hz pitch-dropping sine, every beat ---
kt = np.arange(int(0.28 * sr)) / sr
kick = np.sin(2*np.pi*(55*kt - 30*kt**2/0.28)) * np.exp(-kt*22)
# --- sub bass: D1/F1/A0 pattern, on beats 1 and 3 of each 4/4 bar ---
def sub(freq, length):
    st = np.arange(int(length*sr))/sr
    s = np.sin(2*np.pi*freq*st) + 0.35*np.sin(4*np.pi*freq*st)
    env = np.minimum(st/0.02, 1) * np.exp(-st*2.2)
    return s*env
roots = [36.71, 36.71, 43.65, 32.70]   # D1 D1 F1 C1 — minor, moody
# --- hat: filtered noise, 8ths, ghosted ---
ht = np.arange(int(0.05*sr))/sr
rng = np.random.default_rng(7)
hat = rng.standard_normal(len(ht)) * np.exp(-ht*90)
hat -= np.convolve(hat, np.ones(8)/8, 'same')      # crude highpass

bar = 4*beat
b = 0.0; bi = 0
while b < dur:
    add(kick, b, 0.9)                        # beat 1
    add(kick, b+2*beat, 0.75)                # beat 3
    add(sub(roots[bi % 4], 1.6*beat), b, 0.8)
    add(sub(roots[bi % 4]*1.5, 1.2*beat), b+2*beat, 0.5)
    for e in range(8):
        if e % 2 == 1:
            add(hat, b+e*beat/2, 0.05 + 0.03*(e % 4 == 3))
    b += bar; bi += 1

# --- pad: Dm chord drone (D3 F3 A3), slow tremolo + lowpass feel ---
pad = np.zeros(n)
for f, g in [(146.83, .5), (174.61, .4), (220.0, .35), (293.66, .15)]:
    pad += g*np.sin(2*np.pi*f*t + 0.6*np.sin(2*np.pi*0.1*t))
pad *= 0.11 * (0.75 + 0.25*np.sin(2*np.pi*t/ (2*bar)))
mix += pad

# --- vinyl hiss + crackle ---
hiss = rng.standard_normal(n)*0.006
crack = (rng.random(n) > 0.99985).astype(float)*rng.standard_normal(n)*0.12
mix += hiss + np.convolve(crack, np.exp(-np.arange(200)/40), 'same')[:n]

# fades + soft clip + normalize to ~-14 LUFS ballpark
mix *= np.minimum(t/1.2, 1) * np.minimum((dur-t)/1.8, 1).clip(0, 1)
mix = np.tanh(mix*1.4)
mix *= 0.35/max(1e-9, np.sqrt(np.mean(mix**2)))*0.12**0.5
mix = np.clip(mix, -0.99, 0.99)

pcm = (mix*32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(pcm.tobytes())
print(f"wrote {out}: {dur}s @ {bpm}bpm")
