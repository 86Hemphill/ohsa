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

function createCardSequence(maxCards, options = {}) {
  ensurePositiveInteger(maxCards, 'maxCards')
  const playSingleCardRoundTwice = Boolean(options.playSingleCardRoundTwice)

  const rounds = []
  for (let i = maxCards; i >= 1; i -= 1) rounds.push(i)
  for (let i = playSingleCardRoundTwice ? 1 : 2; i <= maxCards; i += 1) rounds.push(i)
  return rounds
}

function getDealerForRound(players, roundIndex) {
  ensurePlayers(players)

  if (!Number.isInteger(roundIndex) || roundIndex < 0) {
    throw new Error('roundIndex must be a non-negative integer')
  }

  return players[roundIndex % players.length]
}

function createGameEntries(players, maxCards, options = {}) {
  ensurePlayers(players)

  return createCardSequence(maxCards, options).map((cards, roundIndex) => ({
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
