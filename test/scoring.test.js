const test = require('node:test')
const assert = require('node:assert/strict')

const {
  SCORING_METHODS,
  DEFAULT_RULES,
  DEFAULT_SCORING_CONFIG,
  isRoundComplete,
  calculatePlayerRoundScore,
  calculateRoundScores,
  buildScoreboard,
  buildScoreboardProgress,
} = require('../src/game/scoring')

test('calculatePlayerRoundScore gives bonus+bid when bid is exact', () => {
  const score = calculatePlayerRoundScore({ bid: 3, tricks: 3 })
  assert.equal(score, DEFAULT_SCORING_CONFIG.exactBonus + 3)
})

test('classic scoring awards tricks taken on a missed bid', () => {
  const score = calculatePlayerRoundScore({ bid: 4, tricks: 1 })
  assert.equal(score, 1)
})

test('competitive scoring penalizes missed bids by 10 per trick off', () => {
  const score = calculatePlayerRoundScore({
    bid: 4,
    tricks: 1,
    rules: { scoringMethod: SCORING_METHODS.COMPETITIVE },
  })
  assert.equal(score, -30)
})

test('calculateRoundScores returns round and running totals', () => {
  const players = ['Ava', 'Bo']
  const result = calculateRoundScores({
    players,
    bids: { Ava: 2, Bo: 1 },
    tricks: { Ava: 2, Bo: 0 },
    previousTotals: { Ava: 5, Bo: 2 },
  })

  assert.deepEqual(result, {
    Ava: {
      roundScore: 12,
      total: 17,
      bid: 2,
      tricks: 2,
    },
    Bo: {
      roundScore: 0,
      total: 2,
      bid: 1,
      tricks: 0,
    },
  })
})

test('buildScoreboard computes totals across multiple rounds', () => {
  const players = ['Ava', 'Bo']
  const board = buildScoreboard({
    players,
    rounds: [
      {
        bids: { Ava: 1, Bo: 1 },
        tricks: { Ava: 1, Bo: 0 },
      },
      {
        bids: { Ava: 0, Bo: 2 },
        tricks: { Ava: 0, Bo: 2 },
      },
    ],
  })

  assert.deepEqual(board.totals, {
    Ava: 21,
    Bo: 12,
  })
  assert.equal(board.rounds.length, 2)
})

test('buildScoreboard supports competitive scoring rules', () => {
  const board = buildScoreboard({
    players: ['Ava', 'Bo'],
    rounds: [
      {
        bids: { Ava: 2, Bo: 1 },
        tricks: { Ava: 1, Bo: 2 },
      },
    ],
    rules: {
      ...DEFAULT_RULES,
      scoringMethod: SCORING_METHODS.COMPETITIVE,
    },
  })

  assert.deepEqual(board.totals, {
    Ava: -10,
    Bo: -10,
  })
})

test('buildScoreboard throws when round input is missing players', () => {
  assert.throws(() =>
    buildScoreboard({
      players: ['Ava', 'Bo'],
      rounds: [
        {
          bids: { Ava: 1 },
          tricks: { Ava: 1, Bo: 0 },
        },
      ],
    })
  )
})

test('isRoundComplete returns false when a round is still missing values', () => {
  assert.equal(
    isRoundComplete({
      players: ['Ava', 'Bo'],
      bids: { Ava: 1, Bo: 2 },
      tricks: { Ava: 1 },
    }),
    false
  )
})

test('isRoundComplete returns false when tricks do not add up to the cards dealt', () => {
  assert.equal(
    isRoundComplete({
      players: ['Ava', 'Bo'],
      bids: { Ava: 1, Bo: 0 },
      tricks: { Ava: 1, Bo: 1 },
      cards: 1,
    }),
    false
  )
})

test('buildScoreboardProgress skips incomplete rounds in totals', () => {
  const board = buildScoreboardProgress({
    players: ['Ava', 'Bo'],
    rounds: [
      {
        bids: { Ava: 1, Bo: 0 },
        tricks: { Ava: 1, Bo: 0 },
        cards: 1,
      },
      {
        bids: { Ava: 2 },
        tricks: {},
        cards: 3,
      },
    ],
  })

  assert.equal(board.rounds[0].complete, true)
  assert.equal(board.rounds[1].complete, false)
  assert.equal(board.rounds[1].scores, null)
  assert.deepEqual(board.totals, {
    Ava: 11,
    Bo: 10,
  })
})
