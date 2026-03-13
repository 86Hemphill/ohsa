const SCORING_METHODS = {
  CLASSIC: 'classic',
  COMPETITIVE: 'competitive',
}

const DEFAULT_RULES = {
  scoringMethod: SCORING_METHODS.CLASSIC,
  screwTheDealer: false,
  playSingleCardRoundTwice: false,
}

const DEFAULT_SCORING_CONFIG = {
  exactBonus: 10,
}

function ensureNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${label} must be a valid number`)
  }
}

function normalizeRules(rules = DEFAULT_RULES) {
  const scoringMethod = rules.scoringMethod || DEFAULT_RULES.scoringMethod

  if (!Object.values(SCORING_METHODS).includes(scoringMethod)) {
    throw new Error(`unsupported scoring method: ${scoringMethod}`)
  }

  return {
    scoringMethod,
    screwTheDealer: Boolean(rules.screwTheDealer),
    playSingleCardRoundTwice: Boolean(rules.playSingleCardRoundTwice),
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

function calculatePlayerRoundScore({
  bid,
  tricks,
  config = DEFAULT_SCORING_CONFIG,
  rules = DEFAULT_RULES,
}) {
  ensureNumber(bid, 'bid')
  ensureNumber(tricks, 'tricks')

  const normalizedRules = normalizeRules(rules)
  const delta = Math.abs(bid - tricks)

  if (delta === 0) {
    return config.exactBonus + tricks
  }

  if (normalizedRules.scoringMethod === SCORING_METHODS.CLASSIC) {
    return tricks
  }

  return -(delta * config.exactBonus)
}

function isRoundComplete({ players, bids, tricks, cards }) {
  if (!Array.isArray(players) || players.length === 0) {
    return false
  }

  if (!bids || typeof bids !== 'object' || !tricks || typeof tricks !== 'object') {
    return false
  }

  const allValuesRecorded = players.every(
    (player) =>
      Object.prototype.hasOwnProperty.call(bids, player) &&
      Object.prototype.hasOwnProperty.call(tricks, player) &&
      typeof bids[player] === 'number' &&
      !Number.isNaN(bids[player]) &&
      typeof tricks[player] === 'number' &&
      !Number.isNaN(tricks[player])
  )

  if (!allValuesRecorded) {
    return false
  }

  if (typeof cards !== 'number' || Number.isNaN(cards)) {
    return true
  }

  const totalTricks = players.reduce((sum, player) => sum + tricks[player], 0)
  return totalTricks === cards
}

function calculateRoundScores({
  players,
  bids,
  tricks,
  previousTotals = {},
  config = DEFAULT_SCORING_CONFIG,
  rules = DEFAULT_RULES,
}) {
  validateRoundInput({ players, bids, tricks })
  const normalizedRules = normalizeRules(rules)

  return players.reduce((acc, player) => {
    const roundScore = calculatePlayerRoundScore({
      bid: bids[player],
      tricks: tricks[player],
      config,
      rules: normalizedRules,
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

function buildScoreboard({
  players,
  rounds,
  config = DEFAULT_SCORING_CONFIG,
  rules = DEFAULT_RULES,
}) {
  if (!Array.isArray(rounds)) {
    throw new Error('rounds must be an array')
  }

  const results = []
  let totals = {}
  const normalizedRules = normalizeRules(rules)

  rounds.forEach((round, roundIndex) => {
    const roundResult = calculateRoundScores({
      players,
      bids: round.bids,
      tricks: round.tricks,
      previousTotals: totals,
      config,
      rules: normalizedRules,
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

function buildScoreboardProgress({
  players,
  rounds,
  config = DEFAULT_SCORING_CONFIG,
  rules = DEFAULT_RULES,
}) {
  if (!Array.isArray(rounds)) {
    throw new Error('rounds must be an array')
  }

  const normalizedRules = normalizeRules(rules)
  const results = []
  let totals = {}

  rounds.forEach((round, roundIndex) => {
    if (!isRoundComplete({ players, bids: round.bids, tricks: round.tricks, cards: round.cards })) {
      results.push({
        round: roundIndex + 1,
        complete: false,
        scores: null,
        totals: { ...totals },
      })
      return
    }

    const roundResult = calculateRoundScores({
      players,
      bids: round.bids,
      tricks: round.tricks,
      previousTotals: totals,
      config,
      rules: normalizedRules,
    })

    totals = players.reduce((acc, player) => {
      acc[player] = roundResult[player].total
      return acc
    }, {})

    results.push({
      round: roundIndex + 1,
      complete: true,
      scores: roundResult,
      totals: { ...totals },
    })
  })

  return {
    rounds: results,
    totals,
  }
}

module.exports = {
  SCORING_METHODS,
  DEFAULT_RULES,
  DEFAULT_SCORING_CONFIG,
  normalizeRules,
  isRoundComplete,
  validateRoundInput,
  calculatePlayerRoundScore,
  calculateRoundScores,
  buildScoreboard,
  buildScoreboardProgress,
}
