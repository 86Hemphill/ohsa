# OHSA — Oh Hell Score App

A web app for tracking scores in the card game **Oh Hell**, designed to be usable on mobile devices.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f2fd6dd-769a-49f0-a8b4-eb1c8390b29d/deploy-status)](https://app.netlify.com/sites/ohhell/deploys)

## Current status

This repo includes the original flow scaffold:

1. Landing screen
2. Add players
3. Choose card count
4. Scoreboard grid shell

Routes:

- `/` → `src/pages/index.js`
- `/players` → `src/pages/players.js`
- `/cards` → `src/pages/cards.js`
- `/scoreboard` → `src/pages/scoreboard.js`

## Phase 1 (started): stabilize core game logic

### ✅ Implemented in this phase so far

- Added a **framework-agnostic scoring engine** in `src/game/scoring.js`.
- Added **automated tests** in `test/scoring.test.js` using Node's built-in test runner.
- Updated `npm test` to run the scoring tests.

Current scoring rule implemented:

- Exact bid: `10 + bid`
- Missed bid: `-abs(bid - tricks)`

## Framework recommendation (if we move off Gatsby)

If we want a modern, relevant framework today, I recommend **Next.js (App Router) + TypeScript**.

Why:

- Large ecosystem and long-term support.
- Excellent mobile/web performance defaults.
- Easy deployment options (Vercel, Netlify, Docker, etc.).
- Great fit if we later add auth, sync, or multiplayer features.

If you want a lighter SPA-only stack, **Vite + React + TypeScript** is also a strong option.

## Next concrete steps

1. Wire `src/game/scoring.js` into the scoreboard UI.
2. Replace manual DOM mutations in `players.js` with React state updates.
3. Add localStorage persistence (resume last game).
4. Add input validation (duplicate names, blank names, invalid round/card values).
5. Start migration branch to Next.js or Vite once behavior is stable.
