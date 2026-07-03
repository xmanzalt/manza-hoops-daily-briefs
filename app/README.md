# Manza Hoops — Daily News Database (app)

A small local app that turns the `.md` briefs in `../briefs/` into an easy-to-read
**digital cabinet** with a built-in **teleprompter**.

## How to start it

**Easiest:** double-click **`Start Manza Hoops News.command`** in the `NBA-Daily` folder.
It launches the app and opens it in your browser. A Terminal window stays open while
it runs — close it (or press `Ctrl+C`) when you're done.

**Manual:** in a terminal, run:
```
cd "NBA-Daily/app"
node server.js
```
then open http://localhost:4321

> Requires Node.js (you already have it — it runs your dashboard). Nothing to install.

## What it does

- **Cabinet (left):** every brief filed automatically by **Season → Month → Day**, newest first. Search by date, weekday, or phase.
- **Brief tab:** the full cue sheet, rendered clean and readable (no raw markdown).
- **Script tab:** the camera-ready spoken script.
- **▶ Teleprompter:** full-screen scroller.
  - `Space` = play/pause · `↑`/`↓` = speed · `Esc` = close
  - Sliders for **speed** and **font size**, plus a **Mirror** toggle for teleprompter glass.
- **↻ Refresh:** re-reads the folder. New daily briefs appear automatically — no rebuild.

## How it stays current

The morning scheduled task writes each new brief (including its teleprompter script)
into `../briefs/`. Because the app reads that folder **live**, tomorrow's brief shows up
the moment you refresh — zero manual steps.

## Files
- `server.js` — zero-dependency Node server (reads `../briefs/`, serves the app).
- `public/index.html` — the whole UI (cabinet + reader + teleprompter).
