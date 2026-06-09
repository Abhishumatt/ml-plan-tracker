# ML Mastery 18-Week Tracker

A daily tracker for the 18-week ML mastery & placement plan. Tracks what needs to be done each day, logs completion, and surfaces L0 metrics on a dashboard.

## Features

- **Today** — Daily routine (Tracks A/B/C), study topic for the current plan day, outreach counters, time logging, and daily notes
- **Dashboard** — L0 metrics: today/week completion %, streak, track breakdown, outreach totals, algorithms/projects/deliverables progress, 14-day trend
- **Milestones** — Phase 0 setup, weekly deliverables, 9 algorithms, 7 projects, full 18-week roadmap
- **Settings** — Configure plan start date; all data persists in localStorage

## Requirements

- Node.js 18+ and npm

## Run on any machine

```bash
git clone <your-repo-url>
cd ml-plan-tracker
npm install
npm run dev
```

Open http://localhost:5173 and set your plan start date under **Settings**.

## Production build

```bash
npm run build
npm run preview
```

The static build in `dist/` can be deployed to GitHub Pages, Netlify, Vercel, or any static host.

## Push to GitHub (first time)

```bash
# From this directory, after creating an empty repo on GitHub:
git remote add origin https://github.com/<your-username>/ml-plan-tracker.git
git push -u origin main
```
