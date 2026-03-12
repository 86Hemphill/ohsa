const DEFAULT_SCORING_CONFIG = {
  exactBonus: 10,
  missPenaltyPerTrick: 1,
}

function ensureNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${label} must be a valid number`)
  }
}

function validateRoundInput({ players, bids, tricks }) {
  if (!Array.isArray(players) || players.length === 0) {
    throw new Error('players must be a non-empty array')
  }

  if (!bids || typeof bids !== 'object') {
    throw new Error('bids must be an object keyed by player name')
  }

  if (!tricks || typeof tricks !== 'object') {
    throw new Error('tricks must be an object keyed by player name')
  }

  players.forEach((player) => {
    if (!Object.prototype.hasOwnProperty.call(bids, player)) {
      throw new Error(`missing bid for player: ${player}`)
    }

    if (!Object.prototype.hasOwnProperty.call(tricks, player)) {
      throw new Error(`missing trick count for player: ${player}`)
    }

    ensureNumber(bids[player], `bid for ${player}`)
    ensureNumber(tricks[player], `tricks for ${player}`)
  })
}

function calculatePlayerRoundScore({ bid, tricks, config = DEFAULT_SCORING_CONFIG }) {
  ensureNumber(bid, 'bid')
  ensureNumber(tricks, 'tricks')

  const delta = Math.abs(bid - tricks)

  if (delta === 0) {
    return config.exactBonus + bid
  }

  return -(delta * config.missPenaltyPerTrick)
}

function calculateRoundScores({
  players,
  bids,
  tricks,
  previousTotals = {},
  config = DEFAULT_SCORING_CONFIG,
}) {
  validateRoundInput({ players, bids, tricks })

  return players.reduce((acc, player) => {
    const roundScore = calculatePlayerRoundScore({
      bid: bids[player],
      tricks: tricks[player],
      config,
    })

    const total = (previousTotals[player] || 0) + roundScore

    acc[player] = {
      roundScore,
      total,
      bid: bids[player],
      tricks: tricks[player],
    }

    return acc
  }, {})
}

function buildScoreboard({ players, rounds, config = DEFAULT_SCORING_CONFIG }) {
  if (!Array.isArray(rounds)) {
    throw new Error('rounds must be an array')
  }

  const results = []
  let totals = {}

  rounds.forEach((round, roundIndex) => {
    const roundResult = calculateRoundScores({
      players,
      bids: round.bids,
      tricks: round.tricks,
      previousTotals: totals,
      config,
    })

    totals = players.reduce((acc, player) => {
      acc[player] = roundResult[player].total
      return acc
    }, {})

    results.push({
      round: roundIndex + 1,
      scores: roundResult,
    })
  })

  return {
    rounds: results,
    totals,
  }
}

module.exports = {
  DEFAULT_SCORING_CONFIG,
  validateRoundInput,
  calculatePlayerRoundScore,
  calculateRoundScores,
  buildScoreboard,
}
