# Manza Hoops — Daily NBA Brief System

> The engine behind the **Daily NBA rundown** series. Records each morning in Lithuania, covering the full previous US day of NBA news. This doc defines how the system works, the cue-sheet format, and how to tune it. Anyone (or any session) can read this and run the show.

_Created: 2026-07-01 · Owner: Manza (Xavier Campaz)_

---

## The idea

Manza is in Lithuania (UTC+3, EEST). The US NBA day finishes overnight for him, so every morning he can record a video that compiles **everything that happened in the NBA the previous US day**. This system does the research automatically and leaves a ready-to-read **cue sheet** waiting for him — so recording is the only manual step.

**Trial:** run 1 week, keep if sustainable.

---

## The flow (research → synthesize → deliver)

Each morning, automatically:

```
        ┌─────────────────────────────────────────────┐
        │  1. DETECT SEASON PHASE                      │
        │     offseason / FA / summer league /         │
        │     preseason / regular / playoffs / draft   │
        └───────────────────┬─────────────────────────┘
                            │  (picks which sections matter today)
        ┌───────────────────▼─────────────────────────┐
        │  2. FAN-OUT RESEARCH  (parallel searches)    │
        │     • Breaking / top stories                 │
        │     • Game recaps & scores (or FA/SL)        │
        │     • Trades, signings, rumors               │
        │     • Injuries & availability                │
        │     • Quotes, drama, social/viral            │
        └───────────────────┬─────────────────────────┘
        ┌───────────────────▼─────────────────────────┐
        │  3. SYNTHESIZE → CUE SHEET                    │
        │     dedupe, rank, tighten to bullets,        │
        │     separate CONFIRMED vs RUMOR,             │
        │     add content angles + sources             │
        └───────────────────┬─────────────────────────┘
        ┌───────────────────▼─────────────────────────┐
        │  4. DELIVER                                  │
        │     • save briefs/YYYY-MM-DD.md to folder    │
        │     • create Gmail draft (brief in inbox)    │
        └─────────────────────────────────────────────┘
```

"Agents and loops" in practice: step 2 is a **fan-out** (several searches running in parallel, one per beat), step 3 is the **synthesis** that merges them, and there's a weekly **feedback loop** (see below) that learns what to cover more of.

---

## Source priority (updated July 3, 2026)

Always check these in order — they are the most reliable real-time sources:

1. **Shams Charania Instagram** — https://www.instagram.com/shams/ — real-time breaking transactions. *(Instagram requires login so cannot be fetched directly; instead search "@ShamsCharania" and look for his tweets embedded in NBA.com's live blog and search results.)*
2. **NBA.com Free Agency Roundup** — https://www.nba.com/news/2026-nba-offseason-roundup — official live blog. *(JS-rendered; use Chrome extension if available, or fall back to the search results that quote it.)*
3. **CBS Sports FA Tracker** — https://www.cbssports.com/nba/news/2026-nba-free-agency-rankings-tracker/ — comprehensive top-40 table, static HTML.
4. ESPN Buzz, Yahoo Sports Live, Bleacher Report Tracker, SI Tracker, HoopsHype, ClutchPoints.

---

## Comprehensiveness rule (updated July 3, 2026)

**Every day's brief must include EVERY signing, EVERY extension, and EVERY trade — no exceptions.** During free agency, add a 📊 COMPLETE MASTER TRACKER section inside the Free Agency section. The tracker table should show:
- All confirmed trades (with full return packages)
- All confirmed signings and extensions (player → deal → team)
- All player options exercised or declined
- All remaining top free agents still unsigned

On **Day 3 and beyond**, the master tracker should accumulate ALL moves since free agency opened — not just that day's moves — so that each brief stands alone as a complete reference.

---

## Cue-sheet format (the daily output)

Tight bullets, organized by subject, breaking news up top. Order is deliberate — it's the running order for the video.

1. **🔴 BREAKING / TOP STORIES** — the 2–4 biggest things, the lead. One line + why it matters. This is the cold open.
2. **🚨 INJURY REPORT & AVAILABILITY** — key injuries, returns, timelines. (Kept near the top because it's high-value and time-sensitive.)
3. **🏀 GAME RECAPS & SCORES** — last night's results + standout stat lines. *In the offseason this slot becomes "FREE AGENCY / SUMMER LEAGUE" + MASTER TRACKER.*
4. **🔁 TRADES, SIGNINGS & RUMORS** — split into **CONFIRMED** (done deals) vs **RUMOR MILL** (reported/rumored). Never blur the two.
5. **🎤 QUOTES, DRAMA & SOCIAL** — soundbites, beef, press-conference lines, viral moments.
6. **📅 LOOKING AHEAD** — tonight's slate / storylines to watch / upcoming dates.
7. **💡 CONTENT ANGLES (for Manza)** — 2–3 suggested takes, hooks, or hot-take framings to build the video around. Plus a couple of title/thumbnail ideas.
8. **🔗 SOURCES** — grouped links so any claim can be verified before going on camera. Always list Shams Instagram and NBA.com roundup first.
9. **🎙️ TELEPROMPTER SCRIPT** — a camera-ready, spoken-word version of the cue sheet (no emojis/links), read straight through. This is what the app's teleprompter scrolls.

Rules: every factual bullet stays one or two lines; a rumor is always labeled as a rumor; each big claim has a source; the video running order = the section order.

---

## Season-phase adaptation

The brief reshapes itself so it's never padded with empty sections:

- **Regular season / playoffs** — Game Recaps is the star; injuries and standings matter most.
- **Offseason / Free agency (now)** — Recaps slot becomes Free Agency; trades/signings dominate; "confirmed vs rumor" is critical.
- **Summer League (Jul 9–19, 2026, Las Vegas)** — rookie performances, standout stat lines, buzz.
- **Draft week** — picks, grades, trades around picks.
- **Preseason** — camp battles, rotations, debuts.

---

## Timing (important — tune this)

- Lithuania is **UTC+3 (EEST)** in summer; US Eastern is UTC−4 → **7-hour gap**.
- **In-season catch:** West Coast games can end ~1am PT = **~11am Vilnius**. To capture *every* game, the brief should run late morning Vilnius time. Running earlier (e.g. 8am) is fine now (offseason) but in-season it may miss late West-Coast finals — those would roll into the next day's brief.
- **Default schedule:** 8:00 AM Europe/Vilnius. Recommended in-season: bump to ~11:00 AM, or accept a one-day lag on West-Coast late games.

To change the time: ask to "reschedule the daily NBA brief" or edit the scheduled task.

---

## Weekly feedback loop (optional upgrade)

Every Sunday, auto-compile the week's 7 briefs into a **"Week in Review"** + note which storylines are still running (continuity for the audience). Over time, log which stories Manza actually covered vs. how those videos performed, and bias future briefs toward what resonates.

---

## Ideas backlog — what else this could do

- **Content angles & titles** (already in the brief) — expand to full title + description + tag drafts.
- **Thumbnail text suggestions** — 3–4 word punchy overlays per top story.
- **Storyline tracker** — a running file of ongoing sagas (e.g. "LeBron's next team") so the audience gets continuity.
- **Clip/B-roll sourcing** — link the specific highlight/press clips to cut over narration.
- **Trending radar** — what's going viral on NBA social right now, to ride the algorithm.
- **Week in Review** — auto weekly recap from the dailies.
- **Performance loop** — log covered stories vs. video analytics; learn what to lead with.
- **Multi-language** — a Lithuanian-language variant of the cue sheet if he ever localizes.

> This whole workflow is a strong candidate for a reusable **Claude Skill** — if the format stabilizes after the trial week, package it so it triggers on demand ("make today's NBA brief") without rebuilding the prompt. Revisit after ~1 week of use and update this doc with what worked.

---

## Files

- `SYSTEM.md` — this doc.
- `briefs/YYYY-MM-DD.md` — one cue sheet per day.
