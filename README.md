# OHSA — Oh Hell Score App

A mobile-friendly scorekeeper for the card game **Oh Hell**.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f2fd6dd-769a-49f0-a8b4-eb1c8390b29d/deploy-status)](https://app.netlify.com/sites/ohhell/deploys)

## Migration status

This project has now moved from Gatsby starter code to a **Next.js (App Router)** structure.

### App routes

- `/` – start screen
- `/players` – add players with validation
- `/cards` – set max cards and generate round sequence
- `/scoreboard` – mobile-first scoring table with sticky round column and tap-friendly bid/trick controls

## Phases

### ✅ Phase 1 complete

- Framework-agnostic scoring engine (`src/game/scoring.js`)
- Unit tests (`test/scoring.test.js`)

### ✅ Phase 2 started

- Next.js app shell and route flow implemented in `src/app/*`
- Mobile-oriented scoreboard interactions (large + / - controls)
- Local storage persistence for in-progress setup/game data

## Netlify: where it was configured

You were already using Netlify on site **`ohhell`**, visible from:

- The README deploy badge link: `https://app.netlify.com/sites/ohhell/deploys`

No `netlify.toml` existed previously in this repo, so settings were likely configured in the Netlify UI.

This repo now includes a minimal `netlify.toml` with the build command and publish directory only. For modern Next.js (13.5+), Netlify applies its current adapter automatically, so pinning `@netlify/plugin-nextjs` in `netlify.toml` is not necessary unless you intentionally want to lock to a specific runtime version.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Testing

```bash
npm test
```
