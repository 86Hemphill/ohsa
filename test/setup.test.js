const test = require('node:test')
const assert = require('node:assert/strict')

const { GAME_STATUS, createCardSequence, getDealerForRound, createGameEntries, createRematchGame } = require('../src/game/setup')

test('createCardSequence builds a down and up round order', () => {
  assert.deepEqual(createCardSequence(3), [3, 2, 1, 2, 3])
})

test('createCardSequence can include the one-card round twice', () => {
  assert.deepEqual(createCardSequence(3, { playSingleCardRoundTwice: true }), [3, 2, 1, 1, 2, 3])
})

test('getDealerForRound rotates by player order', () => {
  const players = ['Ava', 'Bo', 'Cy']
  assert.equal(getDealerForRound(players, 0), 'Ava')
  assert.equal(getDealerForRound(players, 1), 'Bo')
  assert.equal(getDealerForRound(players, 3), 'Ava')
})

test('createGameEntries includes cards and dealer metadata', () => {
  const entries = createGameEntries(['Ava', 'Bo'], 2)
  assert.deepEqual(entries, [
    { cards: 2, dealer: 'Ava', bids: {}, tricks: {} },
    { cards: 1, dealer: 'Bo', bids: {}, tricks: {} },
    { cards: 2, dealer: 'Ava', bids: {}, tricks: {} },
  ])
})

test('createGameEntries respects the double one-card round option', () => {
  const entries = createGameEntries(['Ava', 'Bo'], 2, { playSingleCardRoundTwice: true })
  assert.deepEqual(
    entries.map((entry) => entry.cards),
    [2, 1, 1, 2]
  )
})

test('createRematchGame rebuilds a fresh in-progress game with the same table rules', () => {
  const rematch = createRematchGame({
    names: ['Ava', 'Bo'],
    maxCards: 3,
    rules: {
      scoringMethod: 'competitive',
      screwTheDealer: true,
      playSingleCardRoundTwice: true,
    },
    status: GAME_STATUS.FINISHED,
    entries: [{ cards: 99, dealer: 'Ava', bids: { Ava: 1 }, tricks: { Ava: 1 } }],
  })

  assert.equal(rematch.status, GAME_STATUS.IN_PROGRESS)
  assert.deepEqual(rematch.names, ['Ava', 'Bo'])
  assert.equal(rematch.maxCards, 3)
  assert.deepEqual(rematch.rules, {
    scoringMethod: 'competitive',
    screwTheDealer: true,
    playSingleCardRoundTwice: true,
  })
  assert.deepEqual(
    rematch.entries.map((entry) => entry.cards),
    [3, 2, 1, 1, 2, 3]
  )
})
