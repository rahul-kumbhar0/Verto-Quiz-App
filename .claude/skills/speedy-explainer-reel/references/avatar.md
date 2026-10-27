# The presenter: poses, timing, and using your own character

The bottom third of every frame is a cartoon presenter who reacts to the line being spoken.
`assets/template/avatar.js` ships THREE flat-vector looks, selected with `avatar:{look:…}`:
- **`"street"` (default — the house character)**: oversized boxy tee (charcoal, drop-shoulder
  seams, wide draping sleeves with cuff folds, ribbed collar, hem fold), green bolt chest print,
  gold chain with pendant + earring, messy dark mop hair with choppy fringe and side chunks,
  rounded shades with a green→cyan gradient. Recolour via `style`: `shirt`, `print` (brand
  accent; `"none"` removes it), `chain` (`"none"` removes chain + earring), `hair`, `skin`,
  `lens1/lens2`.
- **`"classic"`**: the fitted red tee + sport sunglasses of the reference reels.
- **`"hoodie"`**: purple pullover hoodie (hood folded behind the neck, white drawstrings,
  kangaroo pocket, long sleeves with cuffs) and pink→purple shades. Recolour via `style`:
  `shirt`/`shirtLine`/`under` (hoodie body, outline, inner hood), `string`, `lens1/lens2`, `hair`.
All share the same rig, poses, mouth and timing, so a reel switches look with one word.
Vary the look/colour between consecutive reels on one page so the feed doesn't feel like
reruns, e.g. `look:"classic", style:{shirt:"#0A66C2", shirtLine:"#06427E", lens1:"#93C5FD", lens2:"#3B82F6"}`
(LinkedIn-blue tee, used on the referral reel).
Swap in your own character with PNG pose sheets when you have them (the character IS the brand).

## Auto-direction (default since 27 Oct 2026): the presenter moves with the words
`R.speedy({ …, poses: "auto" })` makes the presenter direct itself from the caption words + timings
(`R.autoPoses` in speedy.js). Your `{pose}` pins still win: pass them as `poses:[…]` together with
`autoPoses:{}` and every auto move within 1.2 s of a pin is dropped. What it reacts to:
| Words / idea | Move · expression |
|---|---|
| 1 / one / first · 2 / two / both · 3 / three | count on fingers: `one` · `two` · `three` |
| numbers ≥ 100, "10K", "₹21L", million, thousand, lakh, every, entire | `big` (arms wide) · surprised |
| tiny, small, little | `small` (pinch in front) · think |
| never, no, not, don't, skip, nobody, without | `stop` (palm out) · serious |
| myth, fake, wrong, mistake, scam | `wag` (finger wag) · serious |
| type, paste, write, code, prompt, search, drafts, fills, tailors | `typing` · think |
| free, done, works, easy, best, perfect, safe | `thumbs` · happy |
| offer, hired, win, success, finally | `celebrate` (V arms) · excited |
| crazy, wow, insane, imagine | `hands_head` · surprised (max 2 per reel) |
| think, why, how, decide, idea, catch, smart | `think` · think |
| a sentence ending in "?" | `think` (why/how) or `shrug` · unsure |
| a sentence starting with "you/your" | `point_cam` · happy |
| this, here, look, watch, see, screen, link | `point_stage` |
| called, meet, introducing | `present` · happy |
| "Comment" (CTA) → last line | `point_cam` → `wave` sign-off |
| any other sentence start | rotates explain / present / point_stage / talk |
Rules built in: ≥ 1.5 s between moves (`gap`), a stronger cue may follow after 0.9 s (`minGap`),
never the same pose twice in a row, comedy poses capped at 2 (`maxComedy`). `window.AUTO_POSES` lists
every choice with the word that triggered it (show it in a debug chip, as the demo does). Tune the
word lists in `LEX` (speedy.js) per niche.

**Life on top of the poses** (automatic): brows + resting mouth follow each pose's expression
(`Avatar.EXPR`: neutral happy excited surprised think serious unsure; a surprised mouth stays an "o"),
a head nod + arm bump on every boxed word (the beat), per-pose body lean, slow breathing, animated
gestures (wave, wag, clap, typing). Demo: `assets/examples/presenter-auto-demo/` (career-ops voice,
zero manual poses, chip shows word → move · expression).

## Reactions, gags, props, outfits, signature (automatic with `poses: "auto"`)
`R.autoReactions` (speedy.js) reads the words too; turn it off with `reactions: false`, tune with
`reactions: { maxGags, gagGap, signature: false }`. `window.AUTO_REACTIONS` lists what it picked.
| Trigger | What happens |
|---|---|
| idea, trick, secret, smart, hack | 💡 bulb pops over the head |
| a sentence ending in "?" | ??? floats over the head |
| placement, deadline, stress, rejected, exam | 💧 sweat drop slides down |
| free, best, offer, hired, easy | ✨ sparkles |
| scam, fake, ghosted, spam | 💨 steam from the ears |
| a shocking number (₹, lakh, 1,000+, 10K, 21L) or crazy / insane / wow | **shades-slide gag**: shades drop to the chin, cartoon eyes pop, face goes "surprised" (max 2 per reel, ≥ 8 s apart) |
| resume / CV · phone / app · chai / coffee · search / find | **prop in hand** (paper · phone · cup with steam · magnifier), held at shoulder height until the sentence ends (pose `hold`) |
| first word of the reel | **signature flip**: shades lift and drop back with a glint |
| the last line after a "Comment …" CTA | sign-off `double_thumbs` (excited) |
Outfits: `avatar: { accessory: "grad" | "headset" | "detective" }` (graduation cap for students/
placements, headset for interviews, detective hat for myth-busting). Never use single-index-finger
poses on covers or held still: an upright lone finger can read as a rude gesture (removed
`shades_push`/`finger_guns` for this reason).
Demo: `assets/examples/prompt-reel/` (the "which jobs do you fit" reel: flip, paper prop, ???,
eyes-pop gag on "crazy", 💡 on "smart", magnifier on "search", ✨ on "Free", double thumbs).

## Pose library (`Avatar.POSES`, 28 poses; new: three, big, small, typing, celebrate, wag, clap, lean_in)
| Pose | Reads as | Use on |
|---|---|---|
| `talk` | neutral, hands low | default between gestures (rarely needed; the tween does it) |
| `explain` | both palms open | plain mechanism statements |
| `present` | left palm showing the stage | "here is the thing" |
| `point_stage` | right index up-right at the visual | chapter openers, "Under every letter", "Click new project" |
| `point_up` | right arm straight up | "First," "Next," the big claim |
| `point_side` | right arm horizontal | pointing at a phone/card on the right |
| `point_cam` | big finger at the viewer | "Follow me", "you" |
| `one` / `two` | counting | enumerations, "a second trick" |
| `thumbs` | thumbs up | payoffs, "zero backend code", "gives it to the E" |
| `fist_pump` | yes! | the win |
| `shrug` | both palms up, head tilt | "So how is that possible?", "nothing moves" |
| `think` | fist under chin | "Now imagine…" |
| `pinch` | fingers almost touching | "a small Go server", "a little off" |
| `stop` | palm out | "Before changing anything", "What stops them" |
| `facepalm` | hand over the glasses | pain, "too many clients already" |
| `hands_head` | both hands on head | overload, the viral moment |
| `shh` | finger on lips | "quietly guessing" |
| `wave` | waving (animated) | "share it with the friend" |
| `cross` | arms crossed | "nothing happens", refusing |

Timing: the reference changes pose about every 1.8 s. Anchor each pose to a phrase with
`[at("phrase"), "pose"]`; the puppet tweens over 0.3 s with a slight overshoot, so you never need a
"return to neutral". Mouth flaps automatically from the caption tokens (open while a word is
spoken, light flap in short gaps, closed in pauses). Head bobs slightly while talking; the body
sways when idle. `avatar.hide:[[a,b]]` hides him for full-stage inserts; `avatar.in` is when he
first rises in (after the hook).

Placement: `avatar:{x:240, y:1330, w:600}` puts the head top at y≈1430 and the chest at the
bottom edge, centred. Shift `x` to 300–340 when a tall phone mock needs the left side.

## Recolouring the stock puppet
```js
avatar: { style: { shirt: "#1E88E5", shirtLine: "#1565C0", hair: "#2B2B2B", hairHi: "#444", lens1: "#FF8A65", lens2: "#FFB74D", skin: "#D9A47A", skinLine: "#9C6B45" } }
```
Keep the glasses — a face without eyes to animate is what lets a vector puppet feel alive at this
size; it also makes the character readable at 200 px tall in the feed.

## Using your own character (PNG mode)
1. Make one PNG per pose name above (transparent, chest-up, same framing and scale, ≈1200×1280,
   head top at ~15 % from the top). Generate them with an image model from one reference
   render of your character ("same character, same lighting, pose: pointing up-right with the index
   finger, mouth closed"), then optionally `<pose>_open.png` with the mouth open for lip flap.
2. Put them in `<project>/avatar/` and configure:
   ```js
   avatar: { x: 240, y: 1330, w: 600, mode: "png", png: { dir: "avatar" } }
   ```
   Missing `_open` files are skipped automatically; the pose list and timing stay identical, so a
   reel authored with the stock puppet re-renders unchanged with your character.
3. Check 3 stills: the head must not touch the stage band (y<1330) and nothing may cover the mouth.

## Rules that keep it from looking cheap
- Never leave him static for more than ~3 s while the voice is talking.
- The pose must match the meaning of THIS phrase, not the previous one (anchor on the word).
- One reaction per consequence, not per word; comedy poses (facepalm, hands_head) at most twice.
- He never points at nothing: `point_stage`/`point_side` only when a visual is on screen.
