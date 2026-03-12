function ensurePositiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive whole number`)
  }
}

function ensurePlayers(players) {
  if (!Array.isArray(players) || players.length < 2) {
    throw new Error('players must contain at least two names')
  }
}

function createCardSequence(maxCards) {
  ensurePositiveInteger(maxCards, 'maxCards')

  const rounds = []
  for (let i = maxCards; i >= 1; i -= 1) rounds.push(i)
  for (let i = 2; i <= maxCards; i += 1) rounds.push(i)
  return rounds
}

function getDealerForRound(players, roundIndex) {
  ensurePlayers(players)

  if (!Number.isInteger(roundIndex) || roundIndex < 0) {
    throw new Error('roundIndex must be a non-negative integer')
  }

  return players[roundIndex % players.length]
}

function createGameEntries(players, maxCards) {
  ensurePlayers(players)

  return createCardSequence(maxCards).map((cards, roundIndex) => ({
    cards,
    dealer: getDealerForRound(players, roundIndex),
    bids: {},
    tricks: {},
  }))
}

module.exports = {
  createCardSequence,
  getDealerForRound,
  createGameEntries,
}
