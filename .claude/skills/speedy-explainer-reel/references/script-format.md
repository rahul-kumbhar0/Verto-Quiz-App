# Beat-sheet format

Write the whole video as a typed beat sheet BEFORE any component code. One beat = one exhibit idea.

```ts
// src/beats.ts (data — the engine consumes this)
export type CaptionWord = {
  t: string;                 // the word
  style?: 'muted' | 'bold' | 'box';  // default muted
  at?: number;               // frame offset within beat when it appears (default: even spacing)
};

export type Beat = {
  id: string;                // 'hook', 'explode', ...
  dur: number;               // frames
  lines: CaptionWord[][];    // 1–2 caption lines, chunked as spoken
  pose: MascotPose | 'hidden';
  // exhibit is a React component keyed by id in Reel.tsx
  footnote?: string[];       // 1–2 lines
};
```

## Writing rules (this is what makes it feel like the original)

1. **Narration voice**: 2nd person, present tense, short punchy clauses. "Every key on your iPhone is smaller than your fingertip." Never lecture — reveal. Each beat ends on a mini-cliffhanger or payoff.
2. **One visual claim per beat.** If the sentence has two facts, split it into two beats.
3. **Show, don't say**: every number in the VO must appear on screen; every object named must be drawn; every "invisible/hidden/under" word triggers an x-ray/explode exhibit.
4. **Emphasis mapping**: nouns that carry the surprise get `box` (max 2 per beat); verbs/adjectives of change get `bold`; everything else `muted`.
5. **Structure template** (adapt to any topic):
   - HOOK (0–7s): impossible close-up + the counterintuitive claim.
   - QUESTION (7–10s): "So how is that possible?" — mascot confused.
   - MECHANISM (10–27s): explode/x-ray the system, name the hidden part.
   - LIVE DEMO (27–43s): the mechanism working in real time with real data.
   - ESCALATION (43–57s): edge case / the numbers get crazy.
   - ORIGIN/AUTHORITY (57–69s): the history, a real person, a real source (patent, book, paper) — with citations drawn as footnotes.
   - BONUS TRICK (69–76s): "and there's a second trick…"
   - CTA (76–79s): share/send framing inside a DM mockup.
6. **Honesty footnotes**: whenever the visualization dramatizes ("zones drawn visible"), add the disclaimer footnote. It's part of the brand.
7. Target 170–200 words of VO for ~75–80s.

## Voiceover + timing pipeline

**Default voice (user preference): Indian English — `en-IN-PrabhatNeural` via edge-tts (free).**

```
pip install edge-tts
python -m edge_tts --voice en-IN-PrabhatNeural --rate "+12%" --text "<line>" --write-media public/vo/b<N>.mp3
```
Female alternative: `en-IN-NeerjaNeural`; Hindi: `hi-IN-MadhurNeural`. Spell out digits and
acronyms ("WPA3" → "WPA 3", "12345678" → "one two three…"). Then steps 4–6 below apply the same
(mp3 instead of wav).

**Offline fallback: open-source local TTS (Piper) — free, no account, proven on this machine.**

1. Finalize narration from the beat sheet: ONE short line per beat (spell out digits/acronyms for the TTS: "WPA 3", "one, two, three…").
2. Install once: `pip install piper-tts`. Voice model (already downloaded once to scratchpad; re-download if gone):
   `en_US-ryan-high.onnx` + `.onnx.json` from huggingface.co/rhasspy/piper-voices (`en/en_US/ryan/high/`).
3. Generate one wav PER BEAT into `public/vo/`:
   `echo "<line>" | python -m piper -m ryan.onnx --length-scale 0.92 --sentence-silence 0.15 -f public/vo/b<N>.wav`
   (`--length-scale` <1 = faster; 0.90–0.95 fits the style's pace.)
4. Measure each: `ffprobe -show_entries format=duration`. Set each beat's `dur = ceil(seconds*30) + 15–20` frames, never less than the beat's last animation frame.
5. In the timeline, give each beat `vo: 'bN'` and render `<Audio src={staticFile('vo/'+b.vo+'.wav')}/>` inside that beat's `<Sequence>` — per-beat clips mean captions/animations never drift from the audio.
6. Set each beat's Captions `spreadFrames ≈ audioFrames × 0.8` so words pop roughly as spoken (no word-level alignment needed with per-beat clips).

Alternative (paid, better quality): ElevenLabs connector — energetic young male, speed ~1.1; it returns word-level alignment you can write into the `at` fields. Ask the user before spending credits.
