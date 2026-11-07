# Real product UI in reels (owner, 1 Nov 2026: "when we talk about Claude and type in it, show the exact Claude UI — same for GitHub — so it looks real")

Kit: `assets/template/ui.js` + `ui.css` (namespace `R.ui`). Built from live screenshots of github.com and claude.ai
(dark themes, 1 Nov 2026), GitHub's own icons (Primer Octicons, MIT — `OCTICONS-LICENSE.txt`), Inter + Source Serif 4
(OFL). Worked example: `assets/examples/real-ui-demo/` (GitHub repo page → Claude chat with a real freehire result).

## Components
| call | renders | animate with |
|---|---|---|
| `R.ui.github(el, {owner, repo, stars, forks, watch, issues, prs, branches, tags, about, url, topics, commit, files})` | the repo page at native 1280 px (header, tabs, title + Sponsor/Watch/Fork/Star, branch bar, green Code button, commit row, file list, About + topics + links) | `R.ui.ghStar(el,t,at)` (Star → Starred), rows `#<id>-row<k>.hi`, camera push with the P→Q formula in the example |
| `R.ui.claudeChat(el, {title, initial, model, tool:{name,fn}, answer:[html lines]})` | claude.ai chat column (wordmark + spark, title, user bubble, tool-call chip, answer, input box with + / model / orange send) | `R.ui.claudePlay(el,t,{text,at,cps,toolDur,wps})` → types in the input, send press, bubble, spark thinking, tool chip ✓, answer streams by word |
| `R.ui.claudeHome(el, {greeting, placeholder, model})` | the new-chat screen with the serif greeting + spark | type into `.cl-typed` |
| `R.ui.terminal(el,{title})` + `R.ui.termPlay(el,t,lines)` | Claude Code style terminal (`❯` commands typed, `⏺` Claude lines, `✓` results) | lines `[{t,text,kind}]` |
| `R.ui.browser(el,{url})` | Chrome-style window around any page | — |
| `R.ui.icon(name)` / `R.ui.spark(size)` | an Octicon / the Claude spark | — |

## Rules
1. **Native size, camera framing.** Build the page at its real web width, then frame it like a screen recording:
   start on the readable region (scale ≈ 0.95–1.0), push/pan to the detail on its spoken word (scale 1.5–1.7). Never
   shrink a whole desktop page to fit 1080 px; it becomes unreadable on a phone. Chat columns render at 1.15–1.2×.
2. **Real data only.** Repo numbers, file names and commit lines come from the live page (screenshot it first with the
   PullRows browser tools or Playwright); chat answers come from a REAL run (connector/MCP/API output) — if it is
   illustrative, the footnote says "sample". Always a dated footnote pill ("numbers as of 1 Nov 2026").
3. **Never fake identity or outcomes:** no invented stars/likes, no other person's account, no "Starred" count bump
   (the count stays real; only the button state changes).
4. Keep the look around it (graphite stage, presenter, captions, rail); the UI itself keeps the product's real colours.
5. Before a reel about another product (Gmail, Canva, Notion, LinkedIn, Zerodha…), screenshot it first and add a
   `R.ui.<product>` builder the same way (sampled colours, real icons where the licence allows).
