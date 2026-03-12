const test = require('node:test')
const assert = require('node:assert/strict')

const {
  DEFAULT_SCORING_CONFIG,
  calculatePlayerRoundScore,
  calculateRoundScores,
  buildScoreboard,
} = require('../src/game/scoring')

test('calculatePlayerRoundScore gives bonus+bid when bid is exact', () => {
  const score = calculatePlayerRoundScore({ bid: 3, tricks: 3 })
  assert.equal(score, DEFAULT_SCORING_CONFIG.exactBonus + 3)
})

test('calculatePlayerRoundScore applies per-trick miss penalty', () => {
  const score = calculatePlayerRoundScore({ bid: 4, tricks: 1 })
  assert.equal(score, -3)
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
      roundScore: -1,
      total: 1,
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
    Bo: 11,
  })
  assert.equal(board.rounds.length, 2)
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
