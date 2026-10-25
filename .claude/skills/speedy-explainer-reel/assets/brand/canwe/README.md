# canwe.ai brand marks
Open logo.html (renders from ../../template fonts + avatar.js). Re-export: node shoot_logo.mjs \$PWD/logo.html \$PWD (needs playwright).
A = cw in selection box, B = mascot in selection box, C = terminal prompt. Wordmark: canwe + .ai in the selection box.
Colours: bg #0F0F11, selection blue #3B82F6, accent green #3ECF8E.

## House rule (from the account owner): option B, the mascot, is THE canwe.ai logo
Use `canwe-logo.svg` (or the round PNGs) everywhere the canwe.ai account appears:
- the Instagram and YouTube profile picture (`canwe-logo-1080.png`; the apps crop it to a circle)
- inside reels: every profile picture or DM-sender avatar of the account (`BRAND.logo` in the template fills `.pav` / `.blogo`)
- covers: pass `"logo": "<path>/canwe-logo.svg"` in cover.json so the brand mark shows the mascot next to the handle
- web pages (DM guides etc.): header logo + favicon (`/logo.svg`)
Never fall back to the old purple "CW" logo or the plain "cw" text circle.
