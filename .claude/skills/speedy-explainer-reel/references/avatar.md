# The presenter: poses, timing, and using your own character

The bottom third of every frame is a cartoon presenter who reacts to the line being spoken.
`assets/template/avatar.js` ships a generic flat-vector presenter (SVG, recoloured through
`style`) so the pipeline works with zero assets; swap in your own character with PNG pose sheets
when you have them (recommended for a real account — the character IS the brand).

## Pose library (`Avatar.POSES`, 20 poses)
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
