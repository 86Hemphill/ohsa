const GAME_STATUS = {
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
}

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

function hasGameProgress(game) {
  if (game?.progressed) {
    return true
  }

  return Boolean(
    game?.entries?.some(
      (entry) =>
        Object.values(entry.bids || {}).some((value) => Number(value) !== 0) ||
        Object.values(entry.tricks || {}).some((value) => Number(value) !== 0) ||
        entry.phase === 'playing'
    )
  )
}

function isForbiddenDealerBid({ players, dealer, bids, cards, candidateBid }) {
  ensurePlayers(players)
  ensurePositiveInteger(cards, 'cards')

  if (typeof dealer !== 'string' || !players.includes(dealer)) {
    throw new Error('dealer must be one of the players')
  }

  if (!bids || typeof bids !== 'object') {
    throw new Error('bids must be an object keyed by player name')
  }

  if (!Number.isInteger(candidateBid) || candidateBid < 0) {
    throw new Error('candidateBid must be a whole number zero or greater')
  }

  const totalWithoutDealer = players
    .filter((name) => name !== dealer)
    .reduce((sum, name) => sum + Number(bids[name] || 0), 0)

  return candidateBid === cards - totalWithoutDealer
}

function createRematchGame(game) {
  if (!game || typeof game !== 'object') {
    throw new Error('game is required')
  }

  ensurePlayers(game.names)
  ensurePositiveInteger(game.maxCards, 'maxCards')

  const rules = {
    ...(game.rules || {}),
  }

  return {
    names: [...game.names],
    maxCards: game.maxCards,
    rules,
    progressed: false,
    status: GAME_STATUS.IN_PROGRESS,
    entries: createGameEntries(game.names, game.maxCards, {
      playSingleCardRoundTwice: Boolean(rules.playSingleCardRoundTwice),
    }),
  }
}

module.exports = {
  GAME_STATUS,
  createCardSequence,
  getDealerForRound,
  createGameEntries,
  hasGameProgress,
  isForbiddenDealerBid,
  createRematchGame,
}
