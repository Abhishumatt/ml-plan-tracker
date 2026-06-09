# ML Mastery 18-Week Tracker

A daily tracker for the 18-week ML mastery & placement plan. Tracks what needs to be done each day, logs completion, and surfaces L0 metrics on a dashboard.

**Live app (phone + Mac):** https://abhishumatt.github.io/ml-plan-tracker/

## Features

- **Today** — Daily routine (Tracks A/B/C), study topic, outreach counters, time logging, notes
- **Dashboard** — L0 metrics: completion %, streak, track breakdown, outreach totals, 14-day trend
- **Milestones** — Deliverables, 9 algorithms, 7 projects, 18-week roadmap
- **Cloud sync** — Mac ↔ phone via private GitHub Gist (optional)
- **Manual backup** — Export/import JSON file

## Use on your phone

1. Open **https://abhishumatt.github.io/ml-plan-tracker/** in Safari on your iPhone.
2. Tap Share → **Add to Home Screen** (optional, feels like an app).
3. In **Settings**, set up cloud sync (one-time, ~2 min):

### One-time cloud sync setup

1. Create a GitHub token with **gist** scope only:  
   https://github.com/settings/tokens/new?scopes=gist&description=ML%20Plan%20Tracker%20sync

2. **On your Mac** (in the app → Settings):
   - Paste the token → **Create cloud sync**
   - Copy the **Gist ID** shown

3. **On your phone** (same Settings page):
   - Paste the same token
   - Paste the Gist ID → **Connect on this device**

Changes sync automatically within a few seconds. Open the app on your phone anytime to check or update progress.

## Run locally (development)

```bash
git clone git@github.com:Abhishumatt/ml-plan-tracker.git
cd ml-plan-tracker
npm install
npm run dev
```

Open http://localhost:5173

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via GitHub Actions.

If Pages is not live yet: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Requirements

- Node.js 18+ and npm (local dev only)
- Phone/Mac browser for the hosted app
