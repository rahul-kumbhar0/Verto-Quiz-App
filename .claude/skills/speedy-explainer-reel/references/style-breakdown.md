# SPEEDY style: full breakdown of the reference reels

Reverse-engineered frame by frame from two @speedy_devv Instagram reels (both 1080×1920, 30 fps,
VP9 → re-encode to H.264 for upload):

| Reel | Length | Words | Pace | Chapters | Theme flips | Avatar pose changes | Stage changes |
|---|---|---|---|---|---|---|---|
| "Every key on your iPhone keyboard is smaller than your thumb" (hidden-mechanism format) | 78.6 s | ≈300 | ≈2.6 w/s | 4 implicit (mechanism → example → history → second trick) | dark, with ONE light section (history/credibility, 29–42 s) | 41 (≈ every 1.9 s) | 5 big cuts, continuous small motion |
| "Let's design Supabase" (system-design format) | 154 s | ≈420 | ≈2.8 w/s | 8 on a rail: SERVER · API · SECURITY · STORAGE · LIVE · BACKUP+REPLICA · FUNCTIONS · VIRAL | 9 flips, alternating per chapter | 84 (≈ every 1.8 s) | 18 big cuts |

See `ref-frames/` for contact sheets, key frames and the presenter pose catalogue. Look at them
before building; they are the target.

## Contents
1. The three zones (layout bands)
2. Kinetic headline = the captions (the signature)
3. The stage: what the visuals are made of
4. The presenter (cartoon avatar)
5. Themes, chapters, rail and live counter
6. Hook, credibility and CTA patterns
7. Motion and rhythm
8. Sound
9. What the style is NOT

## 1. The three zones (1080×1920)
| Band | y range | Content |
|---|---|---|
| Instagram header | 0–230 | empty |
| **Headline/captions** | 300–470 | 1–2 lines, centred, ≈62 px Inter-like sans, max ~6 words per page |
| Chapter rail (system-design format only) | 565–645 | bolt/brand glyph · dots + labels · live counter at right |
| **Stage** | 640–1330 (500–1330 when there is no rail) | ONE hero object: phone, card, server, keyboard, diagram, photo + caption, patent |
| Footnotes | 1250–1350, corners | small grey honesty notes ("Magnified illustration", "Zone sizes from English word counts, not Apple's own model") |
| Watermark (CTA only) | ≈1380 right | `◎ instagram.com/handle` |
| **Presenter** | 1420–1920 | cartoon avatar, ≈460 px wide, centred (x≈310–770), cut off at the bottom edge |
| Instagram UI | 1536–1920 | overlaps the avatar's chest only; nothing important lives here |

Props may break the bands on purpose: the giant finger slides in from the bottom-left corner over
the avatar; the phone mock can extend down to y≈1600 behind the avatar's head.

## 2. Kinetic headline (captions)
- Pages of 1–6 words. Words APPEAR ONE AT A TIME as spoken (blur 14 px → 0, tiny rise), and stay;
  the whole page blurs out ≈0.15 s before the next page starts. Nothing is ever shown before it is
  said. Two lines max; the second line is the continuation of the phrase.
- Three weights per page: filler words **grey regular** (#8E8E93 on dark, #8A8A8E on light); 1–2
  structural words **bold white/black**; and exactly ONE keyword in a **blue selection box**
  (2.5 px #3B82F6 border, ~15 % blue fill, two small solid blue dot handles top-left and
  bottom-right — a Figma selection). The boxed word is the noun/number/verb that carries the idea:
  `keyboard`, `thumb`, `invisible`, `catches`, `"time"`, `44`, `320`, `patented`, `Supabase.`,
  `EC2`, `Postgres,`, `SQL`, `token`, `write-ahead`, `Supavisor,`, `RLS.`, `Follow`.
- Quoted tokens keep their quotes (`"timw"`); numbers are one token (`10,000`); an emoji may sit
  inline before a word (`👍 thumb`) once or twice per reel.
- The box never changes colour with the theme; everything else does.
- The box lands on the word's start time; its handles pop 60 ms later.

## 3. The stage
Everything on the stage is a crisp UI mock or a 3D-ish prop; no stock footage, no screen recordings.
Recurring building blocks (all re-created in `assets/template/`):
- **Cards**: dark #161618 / light #FFFFFF, 1.5 px hairline border, radius ≈26, deep soft shadow,
  mac dots + centred title, Inter 24–30 px, JetBrains-Mono for identifiers, paths, LSNs, regions.
- **Phone mock** (dark iMessage / light app): status bar 9:41, contact avatar, blue/grey bubbles,
  input field with caret, keyboard. In the keyboard reel it is the running example ("dinner
  tonight?" → "what ti…").
- **iOS keyboard, magnified**, with invisible **hit zones drawn as glowing gold regions** that
  resize per key; a letter **preview** pops above the pressed key; a **dimension callout** (44 px /
  41 px / 320 px) with tick lines.
- **Giant 3D finger/thumb** sliding in from the bottom-left to press keys and tap buttons.
- **Server/box isometric render** with region label (`eu-central-1`), vendor logo strip, fans, a
  chip card for the database; the same box is re-used across chapters with new labels stacked on
  it (PostgREST, Auth, Storage, Realtime…).
- **Translator pipe**: input (URL in a browser bar) → machine (PostgREST bar) → output (SQL card).
- **Token card**: JWT drawn as three coloured segments with `header · payload · signature` legend
  and a decoded `"sub": "7f3a…c21"` line.
- **Journal/WAL** as a yellow legal pad with LSN rows; a table card below with the same rows.
- **Globe** with region pins and a latency table (`ROUND TRIP FROM TOKYO · Frankfurt 229 ms`).
- **Connection matrix**: 500 cells filling green, turning red at the cap, with the error line
  `FATAL: sorry, too many clients already`; **pooler ring** with 128 lanes; a **scatter of users**
  with a count (9,890 → 12,000).
- **Photo + name card** for a real person (engineer portrait, name, role), **book cover + year**,
  **real patent drawing** — the credibility beats.
- **Recap rack**: all layers stacked bottom-up in one card (AWS base → EC2+Postgres → PostgREST →
  Auth+RLS → Realtime → Edge Functions), each with a chapter tag at the right.
- **Footnotes**: 22–24 px grey, bottom corner of the stage, whenever a visual exaggerates or
  simplifies reality.
Only ONE hero object per beat; the next beat replaces or re-labels it. Cards enter with a short
blur+rise (≈0.4 s); labels pop on the exact word; nothing drifts aimlessly.

## 4. The presenter
A flat-vector cartoon man (brown swept hair, mirrored green sport sunglasses, red tee, small
moustache) framed chest-up at the bottom centre, mouth flapping while he speaks, idle sway when
silent. He changes **pose on almost every phrase (~every 1.8 s)**; the pose is a comment on the
line, not decoration. Catalogue (from 51 sampled poses, see `ref-frames/presenter-pose-catalogue.jpg`):

| Pose | Used when the line… |
|---|---|
| point up / point at the stage | introduces the visual ("Under every letter…", "Click new project") |
| index finger "one", peace "two" | enumerates, cites a number |
| open palms / explain | states a mechanism plainly |
| shrug | "So how is that possible?", "nothing moves" |
| facepalm / hands on head | the pain, the viral overload ("stops at 500") |
| thumbs up / fist pump | the payoff ("gives it to the E", "zero backend code") |
| stop hand | "Before changing anything", "what stops them" |
| pinch (small) | "a small Go server", "a little off" |
| finger to chin | "Now imagine…" |
| hand to ear / shh | "quietly guessing" |
| point at camera | "Follow me" |
| wave | "share it with the friend" |

He is hidden only during the first 2–6 s hook and during full-stage inserts (the magnified
keyboard close-up, the patent sheet). He is never covered by cards; props (finger) may pass in
front of him.

## 5. Themes, chapters, rail, counter
- Two canvases: near-black #0F0F11 with a faint 60 px grid + vignette, and off-white #F7F7F8 with
  the same grid. The flip is a **hard cut** at a chapter boundary (we use a 0.2 s crossfade).
- System-design format: a **rail** under the headline — brand glyph at left, one dot per chapter
  with an uppercase mono label, the line fills green to the active chapter, done dots filled, the
  active label green. At the right a **live counter** that tells the running example's state in
  mono (`0 messages` → `1,042` → `1,043` → `1,047 messages` → `183 connections`). The counter
  ticks on the beat where the story adds a message. The rail appears with chapter 1 and leaves
  before the CTA.
- Hidden-mechanism format: no rail; the one light section is the "history / who built it" chapter.

## 6. Hook, credibility, CTA
- **Hook (0–3 s), no presenter**: a cinematic close-up that states the paradox visually (thumb
  over glowing zones + "Every key…"), or the exploded architecture of the product rising with all
  its labels + a mono stat (`1,000,000 new databases / week`) while the headline says "Let's design
  Supabase." Something moves in the first 0.5 s.
- **Credibility beat** (one per reel): the named engineer with photo and role, the book with its
  year, the actual patent page; or exact numbers with units (44 px, 320 px, 2007, 229 ms, 500).
- **CTA (last 5–6 s)**: "Follow (me / for more breakdowns)" → Instagram profile card (handle,
  posts/followers/following, bio, Follow button) with the giant finger tapping Follow → "and
  send/share this to the friend who …" → the Instagram **share sheet** (search, 2×4 friend
  avatars, one selected with a blue check, Add to story / Copy link / Share to…, message box,
  Send) or a **DM thread** showing the reel being shared with a two-line joke. The punchline names a
  specific person type tied to the topic ("who blames autocorrect for everything", "whose
  vibe-coded app has no RLS"). Watermark `instagram.com/handle` bottom-right of the stage.

## 7. Motion and rhythm
- A visible change every 1–2 s (word, pose, label or card); a big stage change every 5–10 s.
- Entrances: blur+rise 0.35–0.5 s ease-out; pops with a damped spring; labels on the exact word.
- Camera: slow 1–2 % push-in on each scene; props slide in from off-screen bottom-left.
- The counter and matrices count up over 0.6–1.4 s, never instantly.
- Scenes are hard cuts; the headline is the continuity.

## 8. Sound (assumed; verify on your own uploads)
Calm, single male voice, no music bed audible under speech in the keyboard reel; soft UI SFX on
pops and taps are plausible. Mix target −14 LUFS. Our pipeline: voice + `sfx.py` cues from the
engine (pop/click/whoosh/ding) + optional `music.py` bed at −20 dB.

## 9. What the style is NOT
- Not talking-head footage, not screen recordings, not stock b-roll, not emoji captions.
- No gradients on the canvas, no neon glows except the gold hit zones and the green rail.
- Never more than one boxed word per page; never a wall of text; nothing appears before it is spoken.
- No invented numbers: every figure on screen is spoken, sourced, or footnoted as illustrative.
