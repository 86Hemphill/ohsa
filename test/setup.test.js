const test = require('node:test')
const assert = require('node:assert/strict')

const { createCardSequence, getDealerForRound, createGameEntries } = require('../src/game/setup')

test('createCardSequence builds a down and up round order', () => {
  assert.deepEqual(createCardSequence(4), [4, 3, 2, 1, 2, 3, 4])
})

test('getDealerForRound rotates by player order', () => {
  const players = ['Ava', 'Bo', 'Cy']
  assert.equal(getDealerForRound(players, 0), 'Ava')
  assert.equal(getDealerForRound(players, 1), 'Bo')
  assert.equal(getDealerForRound(players, 2), 'Cy')
  assert.equal(getDealerForRound(players, 3), 'Ava')
})

test('createGameEntries includes cards and dealer metadata', () => {
  const entries = createGameEntries(['Ava', 'Bo'], 3)

  assert.deepEqual(
    entries.map((entry) => ({ cards: entry.cards, dealer: entry.dealer })),
    [
      { cards: 3, dealer: 'Ava' },
      { cards: 2, dealer: 'Bo' },
      { cards: 1, dealer: 'Ava' },
      { cards: 2, dealer: 'Bo' },
      { cards: 3, dealer: 'Ava' },
    ]
  )
})
