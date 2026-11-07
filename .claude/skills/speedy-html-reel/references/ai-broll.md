# AI B-roll shots (optional lane) — cinematic prompt recipe

When a reel needs a REAL-looking shot our HTML can't draw (a phone in a hand at night, a laptop on a hostel desk, a
crowded placement hall), generate ONE short clip/still with the Video_Create MCP (Nano Banana image → Gemini Omni
video, 9:16) and use it as a background plate or a hook cutaway under our captions/presenter. Costs credits per
generation: estimate/confirm with the owner, one take, never retry blindly. Never generate a real person, a brand's
ad, or a fake screenshot of a result; label it "AI-generated" in the footnote.

Prompt recipe (camera vocabulary adapted from Open-Higgsfield-AI `src/lib/promptUtils.js`, MIT):
`<subject + action + place>, shot on a <camera>, using a <lens> at <focal>mm (<perspective>), aperture <f>, <depth>,
cinematic lighting, natural color science, high dynamic range, ultra-detailed` + our LOOK: warm ember key light,
graphite/near-black surroundings, one terracotta accent, no neon, no candy colours.
| control | options → words |
|---|---|
| camera | full-frame digital cinema camera · Super 35 studio digital camera · classic 16mm film camera (texture) · grand format 70mm film camera (epic) |
| lens | premium modern prime · warm-toned cinema prime · classic anamorphic (flares, wide) · extreme macro (UI/keys close-ups) · halation diffusion filter (soft glow) |
| focal | 14 wide-angle · 24 wide-angle dynamic · 35 natural cinematic · 50 standard · 85 classic portrait |
| aperture | f/1.4 shallow depth of field, creamy bokeh · f/4 balanced · f/11 deep focus |
Example: "a student's hands typing on a laptop in a dim hostel room at night, screen glow on the face, shot on a
full-frame digital cinema camera, using a warm-toned cinema prime at 35mm (natural cinematic perspective), aperture
f/1.4, shallow depth of field, creamy bokeh, warm ember key light, graphite surroundings, cinematic lighting".

Not used (checked 1 Nov 2026): `higgsfield-ai/higgsfield` = a GPU training framework for LLMs (Apache-2.0), nothing
for video; `Open-Higgsfield-AI` app itself = a UI over the paid muapi.ai API (key + credits, not reachable from our
sandbox) — we only borrow its prompt vocabulary.
