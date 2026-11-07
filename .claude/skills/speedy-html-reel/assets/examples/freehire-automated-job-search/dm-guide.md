# How I automated my job search with freehire + Claude

*From @canwe.ai. Not sponsored. freehire is an open-source project by Ilya Strelov (MIT licence). All credit to them.*

---

## 1. The repo

- **GitHub:** https://github.com/strelov1/freehire (give it a ⭐ if it helps you)
- **Website:** https://freehire.me

**What it does:**
- Pulls 3.3M+ live IT jobs straight from company career pages (Workday, Greenhouse, Lever and 100+ other hiring systems).
- Shows a job posted on three sites only once.
- Every listing links to the company's own page.
- Flags "ghost jobs" that probably aren't really hiring.
- Search is free. No sign-up needed to search.

---

## 2. Connect it to Claude (5 minutes)

### Option A: Claude app or claude.ai (easiest, no key)
1. Open **Settings → Connectors → Add custom connector**.
2. Paste this URL: `https://freehire.me/api/v1/mcp`
3. Done. Claude can now search every job on freehire for you.

### Option B: Claude Code
Run this inside Claude Code:
```
/plugin install freehire --marketplace strelov1/freehire-mcp
```

### Option C: Full version (save jobs, track applications, tailor your CV)
1. Make a free account on freehire.me.
2. Go to **account menu → API keys** and create a key (it starts with `fhk_`).
3. Add this to your Claude config (Claude Desktop: **Settings → Developer → Edit config**):
```json
{
  "mcpServers": {
    "freehire": {
      "command": "npx",
      "args": ["-y", "freehire-mcp"],
      "env": { "FREEHIRE_TOKEN": "fhk_your_key_here" }
    }
  }
}
```
Never share your key with anyone.

---

## 3. My 3 prompts (copy-paste)

**Find jobs**
> Find Python or data internships in Bangalore or remote in India. Use the facets tool first so the filters are valid. Show me the 10 newest with company, location, link and one line on why each fits a fresher.

**What to learn next**
> My skills are Python, SQL and Git. Use market_fit to check them against live internship demand in India and tell me the ONE skill that would unlock the most new matches.

**Before you apply**
> Read this job: [paste link]. List what it asks for that I don't have yet, and suggest 3 resume bullet points using only my real projects below. Don't invent anything.
> [paste your projects]

---

## 4. Daily alerts on Telegram

1. On freehire.me, run your search (for example Python · Internship · Bangalore).
2. Save the search.
3. Turn on the digest for Telegram (or email). New matches come to you every day.

---

## 5. Let it fill the application form

1. Install the **freehire** extension from the Chrome Web Store.
2. Open any job's application page and click **Fill this form**.
3. **Always read everything before you submit.** The extension fills the form; you stay in control.

---

Found this useful? Follow **@canwe.ai** for more tools that actually help you get hired. 🚀
