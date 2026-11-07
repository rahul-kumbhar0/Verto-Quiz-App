# The two reference scripts, recovered word-for-word from the on-screen captions

Markup: `[word]` = blue selection box, `*word*` = bold, plain = grey. Chapter and theme notes in
`//` lines. Use these as the quality bar for pacing, sentence shape and emphasis density
(roughly one box every 6–8 words, one bold every 3–4 words).

## A · Hidden-mechanism format — "Every key is smaller than your thumb" (78.6 s, ≈300 words)
```
// 0–3 s HOOK, dark, no presenter: magnified 3D thumb over a keyboard with gold hit zones.
// footnotes: "Magnified illustration" · "Zones drawn visible. On a real iPhone they are invisible."
*Every* key on your *iPhone* [keyboard] is *smaller* than your 👍 [thumb], and *you* still hit the *right* letter almost [every] *time.*
So *how* is that [possible?]
// MECHANISM, dark — keyboard close-up, zones resizing
Because the *keys* you *see* *are* not the *keys* you [touch,] and the ones you touch change [size] while you [type.]
Under every [letter] there is an [invisible] hit zone, and that *zone* is *what* actually [catches] your *tap.*
// EXAMPLE, dark — iMessage phone "dinner tonight?" → "what ti"
Imagine you're [texting] a friend *and* you've just *typed* *T,* *I,*
Your *iPhone* is already guessing about what *comes* [next,] because ["time"] is a *word* *and* ["timw"] is *not.*
So *before* your *thumb* even *comes* [down,] the *invisible* zone around the *E* gets *bigger,* *and* the zones *get* [squeezed.]
On *the* *screen,* [nothing] *moves.* Every *key* looks *exactly* the [same] *size.*
But *if* your tap *lands* a *little* [off,] [halfway] between the E and the [W,] the *iPhone* gives it to the [E.]
Then you *type* the [next] letter *and* every *zone* *changes* [again,] for *every* [single] letter you *type.*
// HISTORY / CREDIBILITY, LIGHT section (29–42 s) — first iPhone render, 44 px / 320 px callouts, engineer photo, book 2018, patent
Apple built *this* into the *very* [first] iPhone, in 2007, because a comfortable *button* *needed* [44] *pixels* and the whole *screen* was *only* [320] pixels *wide.*
*Ken* *Kocienda,* the *engineer* that made *that* [keyboard,] tells the *story* in *his* 📘 book, *and* Apple *later* [patented] *it.*
// SECOND TRICK, dark — key preview popping above the finger
And it *comes* with a [second] *trick.* Your *thumb* hides the *key* you're *pressing,* which is why the letter *pops* above *your* [finger,] so you *can* see what *you* actually [hit.]
// RECAP
*So* *that* is how you type so fast *with* your *thumbs.*
*Your* iPhone *is* *quietly* guessing *the* key *to* where your *thumb* was about to [land.]
// CTA, dark — profile card + finger tap; DM thread "autocorrect again" / "ok so it was never autocorrect"
[Follow] me, and send this *to* *the* friend who blames [autocorrect] *for* *everything.*
```

## B · System-design format — "Let's design Supabase" (154 s, ≈420 words)
```
// 0–2.4 s HOOK, dark, no presenter: exploded 3D stack with labels (Supavisor, Realtime, PostgREST, EC2, Edge Functions, Auth, Postgres, S3) + "1,000,000 new databases / week"
Let's *design* [Supabase.]
// WHAT IT IS, LIGHT (2.4–10 s) — login form, code card "server.js 314 lines", AWS box, bolt logo on top
Supabase gives *you* a [database,] [logins] *and* an *API* without *writing* a [backend.]
*Underneath* it's [AWS,] with *Supabase's* own [software] on *top.* Let's *build* a [chat] app on *it.*
// SERVER, dark — rail appears (SERVER · API · SECURITY · STORAGE · LIVE · BACKUP+REPLICA · FUNCTIONS · VIRAL), counter "0 messages"; new-project form, isometric server "eu-central-1", PostgreSQL chip, "messages 0 rows"
*First,* the [database.] *Click* [new] *project,* and Supabase *starts* a *whole* [server] *for* you: an [EC2] *instance,* a *computer* *Amazon* [rents] *out.*
On it runs [Postgres,] the [open-source] *database,* with every *Supabase* service running [next] to it.
// API, LIGHT — "Normally you'd write a backend route" code card; PostgREST translator: URL → SQL; phone shows /messages; "zero backend code" pill
Next, the [API.] *Normally* you'd write a backend [route] for every *table.*
*Supabase* *runs* [PostgREST,] *a* server that [reads] your *tables* and turns *every* URL into a [SQL] query *automatically.*
So [/messages] *returns* your *messages,* *with* [zero] backend code.
// SECURITY, dark — key in browser devtools; RLS policy card; Chatty sign-in → Supabase Auth (Go) → JWT segments → sub; rows filtered
Then, [security.] Every *request* *carries* a [key,] and it sits in your [browser] where *anyone* can *copy* it.
What [stops] them is *Row* Level [Security,] a rule *Postgres* *checks* on *every* [row.]
When you *log* in, *Supabase* Auth, a small [Go] *server,* signs a [token] with *your* user *ID.* Postgres *returns* *only* the rows that [match] *it.*
// STORAGE, dark — Supabase Storage → Amazon S3 bucket photo; storage.objects row; signed URL with expiry, counter 1,045
*Then,* [files.] Supabase *Storage* *sends* a chat photo *to* *an* Amazon bucket. *Postgres* keeps *one* [row] for it, so the same *kind* *of* rule *decides* who can *open* it.
To share *it,* *Storage* [signs] a link with a *small* [token] that *expires* in *an* [hour.]
// LIVE, LIGHT — write-ahead log legal pad with LSN rows + table; Realtime (Elixir) fan-out to phones
*Then,* [live] *messages.* *Before* *changing* *anything,* *Postgres* writes it in a [journal] called the [write-ahead] *log:* every *insert,* *update* *and* [delete] in *order.* That's how *it* recovers after a [crash.]
*Supabase* [Realtime,] written in [Elixir,] reads *that* journal *and* pushes *each* new *message* to *everyone* in the *chat* who's [allowed] to see it.
// BACKUP, dark — WAL-G → S3; timeline rewind 18:41:58 → 18:35:30
That same *journal* is your [backup.] Every two *minutes,* *WAL-G* *copies* it *to* [S3,] *Amazon's* *file* *storage,* so you *can* [rewind] *your* database to any [moment.]
// REPLICA, LIGHT — globe, Frankfurt eu-central-1 → read replica ap-northeast-1, "ROUND TRIP FROM TOKYO 229 ms", phone loading → loaded
The journal also *fixes* [distance.] Your *server* *lives* in [one] *region,* *so* a user *across* the *world* [waits.]
A read *replica* *is* a *second* Postgres in their [region] that [replays] the *same* *journal.* Same *data,* [close] to *them.*
// FUNCTIONS, dark — code card "jobs"; push notification 6:44; Stripe $8.96 → $9.00 Succeeded; summarize prompt; isolate/sandbox labels; counter 1,047
*Then,* your own *code.* Some jobs *need* a [real] *server:* *sending* a [push] *notification,* *charging* a *card* with [Stripe,] or *calling* an [AI] model.
Those *are* [Edge] *Functions.* *Each* one *runs* in an *isolate,* a [sealed] sandbox from *Chrome's* *JavaScript* [engine,] on *Supabase's* *own* [Rust] *runtime.*
// VIRAL, dark — Postgres 1 → 48 → 500/500 red matrix "FATAL: sorry, too many clients already"; functions grid 22×10 = 220; Supavisor ring 128 lanes; 9,890 → 12,000 users; counter "183 connections"
Now *imagine* your *app* goes [viral.] *Postgres* *starts* a whole *process* for every [connection,] *so* even the *biggest* *server* stops *at* [500.]
*Serverless* functions open [ten] each, and a few [dozen] use *them* all. *So* *Supabase* built [Supavisor,] a [pooler.]
*It* keeps a *few* real *connections* open to *Postgres,* [lends] one to a *request* *only* while *its* query *runs,* *then* takes it [back] for the *next.* So [thousands] of users share the *same* [few] *connections.*
// RECAP, dark — the rack: AWS · EC2 Postgres · PostgREST · Auth RLS · Realtime · Supavisor · Edge Functions
So Supabase is *AWS* *plus* its *own* [layer.] [EC2] runs *Postgres* and [PostgREST] *writes* the *API.* Auth and [RLS] guard *every* row.
[One] journal powers live *messages,* [backups] *and* *replicas.* All *so* you [never] write a *backend.*
// CTA, LIGHT — profile card; share sheet (Ava, Omar ✓, Chloe, Hana, Leo, Nina, Sam, Marc); "users 2,184 rows · RLS Unrestricted" card in the message; Send
[Follow] for more *breakdowns,* and [share] it with *the* *friend* whose *vibe-coded* app *has* no [RLS.]
```

## What these two scripts have in common (copy the shape, not the words)
1. Hook = a paradox in physical terms, or "Let's design X." + what X gives you in one sentence.
2. "So how is that possible?" / "Let's build a chat app on it." — the pivot that promises a tour.
3. ONE running example threads every chapter (texting "dinner tonight?"; the Chatty app with Mei,
   #weekend-trip, "I've got the speaker"). The live counter is that example's state.
4. Chapter openers are two words: "First, the database." "Next, the API." "Then, security."
   "Then, files." "Then, live messages." "Now imagine your app goes viral."
5. Every component gets name → gloss in ≤6 plain words → what it does in the example → consequence.
   ("an EC2 instance, a computer Amazon rents out" · "an isolate, a sealed sandbox from Chrome's
   JavaScript engine")
6. Numbers are exact and have units: 44 pixels, 320 pixels wide, 2007, 229 ms, every two minutes,
   expires in an hour, stops at 500, open ten each.
7. One credibility beat: named engineer + book + patent, or the real architecture facts.
8. "Now imagine …" stress-test near the end, then a one-breath recap ("So X is A plus B. C does D.
   One journal powers E, F and G. All so you never ___.").
9. CTA: "Follow …, and send/share this to the friend who <topic punchline>."
10. Honesty footnotes whenever the picture exaggerates.
