# OHSA — Oh Hell Score App

A Gatsby-based web app for tracking scores in the card game **Oh Hell**, designed to be usable on mobile devices.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f2fd6dd-769a-49f0-a8b4-eb1c8390b29d/deploy-status)](https://app.netlify.com/sites/ohhell/deploys)

## What exists today

The current app already has the core flow scaffolded:

1. **Landing screen**
2. **Add players**
3. **Choose card count**
4. **Render scoreboard grid**

Pages live under `src/pages` and route in this order:

- `/` → `index.js`
- `/players` → `players.js`
- `/cards` → `cards.js`
- `/scoreboard` → `scoreboard.js`

## Current limitations (from a quick code review)

- Uses an older Gatsby/React stack (`gatsby@2`, `react@16`).
- Several starter-template leftovers still exist in metadata/config.
- Player entry and score interactions mix React with direct DOM manipulation.
- Scoreboard interaction logic is not implemented yet (`setBid` is stubbed).
- No automated tests are configured.

## Getting started locally

```bash
npm install
npm run develop
```

Then open: `http://localhost:8000/ohsa/`

## Suggested roadmap

### Phase 1 — Stabilize the current app

- Remove starter-template leftovers and clean imports/components.
- Replace direct DOM mutation with React state updates.
- Add validation (blank player names, duplicate names, invalid card count).
- Implement editable bids/tricks and round scoring rules.
- Persist game state in local storage.

### Phase 2 — Mobile-first polish

- Improve responsive table UX (sticky player headers, larger touch targets).
- Add game setup presets and quick actions for common player counts.
- Add “new game”, “resume game”, and “undo last change”.

### Phase 3 — Modernize tech stack

- Upgrade to a modern framework baseline (new Gatsby or Next.js + React 18/19).
- Add TypeScript, linting, formatter, and CI checks.
- Add unit tests for scoring logic and e2e tests for game flow.

## Great "opening act" ideas for Codex

If you want to use this as your first Codex showcase, these are high-impact and realistic:

1. **Implement complete Oh Hell scoring engine** as pure functions + tests.
2. **Refactor UI flow to modern React hooks** and remove manual DOM updates.
3. **Add save/resume game from localStorage**.
4. **Ship a polished mobile scoreboard** with tap-to-edit interactions.
5. **Deploy a refreshed version** and add a short changelog.

---

If you want, the next Codex step can be: **“Build Phase 1 in small PRs”**, starting with scoring logic + tests first.
