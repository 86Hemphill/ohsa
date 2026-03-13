# Oh Hell Scorekeeper

A mobile-first scorekeeping app for the card game **Oh Hell**.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f2fd6dd-769a-49f0-a8b4-eb1c8390b29d/deploy-status)](https://app.netlify.com/sites/ohhell/deploys)

## What it does

Oh Hell Scorekeeper helps you run a full game without passing paper around the table. It supports:

- player setup in order of play
- rotating dealer tracking
- configurable round sequences
- `Classic` and `Competitive` scoring
- optional `Screw the Dealer`
- running totals and per-round score history
- mobile-friendly bid and got entry

## Rules supported

### Scoring

- `Classic`
  Exact bid scores `10 + got`.
  Missed bid scores `got`.

- `Competitive`
  Exact bid scores `10 + got`.
  Missed bid scores `-10` for each trick over or under the bid.

### Options

- `Screw the Dealer`
  The dealer cannot make the total bids equal the number of cards dealt that round.

- `Play 1-card round twice`
  `On`: `3 2 1 1 2 3`
  `Off`: `3 2 1 2 3`

## App flow

- `/` home
- `/players` add players in order of play
- `/cards` choose the highest card count
- `/rules` choose scoring and round options
- `/scoreboard` track bids, got, round scores, and totals

## Tech

- Next.js 14
- React 18
- App Router
- Netlify

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Testing

```bash
npm test
```

## Production build

```bash
npm run build
```

## Deployment

The app is configured for Netlify with repo-based build settings in [`netlify.toml`](./netlify.toml).

## Repository name

If you want the repo name to match the product better, I would rename it to one of these:

- `oh-hell-scorekeeper`
- `oh-hell-score-app`

My preference is `oh-hell-scorekeeper`. It is clearer than `ohsa` for visitors and shared links.
