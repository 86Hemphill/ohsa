'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import scoring from '../../game/scoring'
import setup from '../../game/setup'

const { buildScoreboardProgress, normalizeRules, isRoundComplete } = scoring
const { GAME_STATUS, createRematchGame, getDealerForRound } = setup

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function hasRecordedValue(entry, field, player) {
  return Object.prototype.hasOwnProperty.call(entry[field] || {}, player)
}

function formatSignedScore(score) {
  if (score > 0) return `+${score}`
  return `${score}`
}

function getOrdinal(rank) {
  if (rank % 100 >= 11 && rank % 100 <= 13) return `${rank}th`
  if (rank % 10 === 1) return `${rank}st`
  if (rank % 10 === 2) return `${rank}nd`
  if (rank % 10 === 3) return `${rank}rd`
  return `${rank}th`
}

function getPlacings(players, totals) {
  const ordered = [...players].sort((a, b) => (totals[b] || 0) - (totals[a] || 0))
  let previousScore = null
  let previousRank = 0

  return ordered.map((name, index) => {
    const score = totals[name] || 0
    const rank = score === previousScore ? previousRank : index + 1
    previousScore = score
    previousRank = rank
    return {
      name,
      score,
      label: getOrdinal(rank),
    }
  })
}

function getRoundState(entry, players, progress) {
  if (progress.complete) return 'complete'
  const hasAnyInput = players.some(
    (player) => hasRecordedValue(entry, 'bids', player) || hasRecordedValue(entry, 'tricks', player)
  )
  return hasAnyInput ? 'active' : 'pending'
}

function getCardsLabel(cards) {
  return `${cards} ${cards === 1 ? 'card' : 'cards'}`
}

function isGameFinished(game, entries, currentRoundIndex) {
  if (game?.status === GAME_STATUS.FINISHED) return true
  return Array.isArray(entries) && entries.length > 0 && currentRoundIndex === -1
}

export default function ScoreboardPage() {
  const router = useRouter()
  const [version, setVersion] = useState(0)
  const [warning, setWarning] = useState('')
  const [expandedRounds, setExpandedRounds] = useState({})
  const [editingRounds, setEditingRounds] = useState({})

  const game = useMemo(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('ohsa-game')
    return stored ? JSON.parse(stored) : null
  }, [version])

  if (!game || !Array.isArray(game.names) || !Array.isArray(game.entries)) {
    return (
      <main className="screen">
        <p>No game loaded.</p>
        <button className="button" onClick={() => router.push('/players')}>
          Back to setup
        </button>
      </main>
    )
  }

  const rules = normalizeRules(game.rules)
  const entries = game.entries.map((entry, roundIndex) => ({
    ...entry,
    dealer: entry.dealer || getDealerForRound(game.names, roundIndex),
  }))

  const roundsForEngine = entries.map((entry) => ({
    cards: entry.cards,
    bids: game.names.reduce((acc, name) => {
      if (hasRecordedValue(entry, 'bids', name)) acc[name] = toNumber(entry.bids?.[name])
      return acc
    }, {}),
    tricks: game.names.reduce((acc, name) => {
      if (hasRecordedValue(entry, 'tricks', name)) acc[name] = toNumber(entry.tricks?.[name])
      return acc
    }, {}),
  }))

  const board = buildScoreboardProgress({
    players: game.names,
    rounds: roundsForEngine,
    rules,
  })

  const currentRoundIndex = entries.findIndex(
    (entry) =>
      !isRoundComplete({
        players: game.names,
        bids: entry.bids,
        tricks: entry.tricks,
        cards: entry.cards,
      })
  )
  const activeRoundIndex = currentRoundIndex === -1 ? entries.length - 1 : currentRoundIndex
  const activeRound = entries[activeRoundIndex]
  const gameFinished = isGameFinished(game, entries, currentRoundIndex)
  const bidTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
    : 0
  const gotTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.tricks?.[name]), 0)
    : 0
  const activePhase = activeRound?.phase || 'bidding'
  const placings = getPlacings(game.names, board.totals)
  const dealerRestrictedBid =
    activeRound && !gameFinished && rules.screwTheDealer && activePhase === 'bidding'
      ? activeRound.cards -
        game.names
          .filter((name) => name !== activeRound.dealer)
          .reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
      : null

  useEffect(() => {
    if (!game || gameFinished || activeRoundIndex < 0 || !game.entries?.[activeRoundIndex]) return

    const currentEntry = game.entries[activeRoundIndex]
    const zeroBids = {}
    const zeroTricks = {}
    let needsUpdate = !currentEntry.phase

    for (const name of game.names) {
      zeroBids[name] = toNumber(currentEntry.bids?.[name])
      zeroTricks[name] = toNumber(currentEntry.tricks?.[name])

      if (!hasRecordedValue(currentEntry, 'bids', name) || !hasRecordedValue(currentEntry, 'tricks', name)) {
        needsUpdate = true
      }
    }

    if (!needsUpdate) return

    const clone = structuredClone(game)
    clone.entries[activeRoundIndex].bids = zeroBids
    clone.entries[activeRoundIndex].tricks = zeroTricks
    clone.entries[activeRoundIndex].phase = clone.entries[activeRoundIndex].phase || 'bidding'
    window.localStorage.setItem('ohsa-game', JSON.stringify(clone))
    setVersion((v) => v + 1)
  }, [activeRoundIndex, game, gameFinished])

  const setValue = (roundIndex, player, field, delta, maxForRound) => {
    if (gameFinished && !editingRounds[roundIndex]) {
      setWarning('Reopen the game or edit a completed round before changing scores.')
      return
    }

    const clone = structuredClone(game)
    const round = clone.entries[roundIndex]
    const current = hasRecordedValue(round, field, player) ? toNumber(round[field][player]) : 0
    const next = Math.min(maxForRound, Math.max(0, current + delta))
    const isActiveRound = roundIndex === activeRoundIndex
    const roundPhase = round.phase || 'bidding'
    let nextWarning = ''

    if (
      field === 'bids' &&
      isActiveRound &&
      roundPhase === 'bidding' &&
      player === round.dealer &&
      round.cards > 1 &&
      next > 0 &&
      game.names.filter((name) => name !== player).every((name) => toNumber(round.bids?.[name]) === 0)
    ) {
      setWarning('The dealer bids last unless it is a one-card round.')
      return
    }

    if (field === 'tricks' && roundPhase !== 'playing') {
      setWarning('Start play before recording tricks.')
      return
    }

    if (field === 'bids' && isActiveRound && rules.screwTheDealer && player === round.dealer) {
      const totalWithoutDealer = clone.names
        .filter((name) => name !== player)
        .reduce((sum, name) => sum + toNumber(round.bids?.[name]), 0)
      if (next === round.cards - totalWithoutDealer) {
        nextWarning = `Screw the Dealer is On. ${player} can't say ${next}.`
      }
    }

    round[field][player] = next
    window.localStorage.setItem('ohsa-game', JSON.stringify(clone))
    setWarning(nextWarning)
    setVersion((v) => v + 1)
  }

  const resetGame = () => {
    const resetEntries = entries.map((entry) => ({
      ...entry,
      bids: {},
      tricks: {},
      phase: 'bidding',
    }))

    window.localStorage.setItem(
      'ohsa-game',
      JSON.stringify({
        ...game,
        status: GAME_STATUS.IN_PROGRESS,
        entries: resetEntries,
      })
    )
    setWarning('')
    setVersion((v) => v + 1)
  }

  const finishGame = () => {
    window.localStorage.setItem(
      'ohsa-game',
      JSON.stringify({
        ...game,
        status: GAME_STATUS.FINISHED,
      })
    )
    setWarning('')
    setVersion((v) => v + 1)
  }

  const clearSavedGame = () => {
    window.localStorage.removeItem('ohsa-game')
    router.push('/')
  }

  const toggleRoundDetails = (roundIndex) => {
    setExpandedRounds((current) => ({
      ...current,
      [roundIndex]: !current[roundIndex],
    }))
  }

  const toggleRoundEditing = (roundIndex) => {
    setEditingRounds((current) => ({
      ...current,
      [roundIndex]: !current[roundIndex],
    }))
  }

  const setRoundPhase = (roundIndex, phase) => {
    const clone = structuredClone(game)
    clone.status = GAME_STATUS.IN_PROGRESS
    clone.entries[roundIndex].phase = phase
    window.localStorage.setItem('ohsa-game', JSON.stringify(clone))
    setWarning('')
    setVersion((v) => v + 1)
  }

  const reopenGame = () => {
    window.localStorage.setItem(
      'ohsa-game',
      JSON.stringify({
        ...game,
        status: GAME_STATUS.IN_PROGRESS,
      })
    )
    setWarning('')
    setVersion((v) => v + 1)
  }

  const startRematch = () => {
    const rematch = createRematchGame(game)
    window.localStorage.setItem('ohsa-game', JSON.stringify(rematch))
    setExpandedRounds({})
    setEditingRounds({})
    setWarning('')
    setVersion((v) => v + 1)
  }

  return (
    <main className="screen wide">
      <div className="stack wideStack scoreboardShell">
        <section className="panel scoreboardSummary">
          <div className="row split">
            <div className="stack compact">
              <div>
                <p className="eyebrow">{gameFinished ? 'Final results' : 'Game in progress'}</p>
                <h2>{gameFinished ? 'Results' : 'Scoreboard'}</h2>
                {activeRound ? (
                  <p className="muted">
                    Round {activeRoundIndex + 1} of {entries.length} - {getCardsLabel(activeRound.cards)}
                  </p>
                ) : null}
              </div>
              <div className="ruleList">
                <span className="ruleChip">
                  {rules.scoringMethod === 'competitive' ? 'Competitive Scoring' : 'Classic Scoring'}
                </span>
                <span className="ruleChip">Screw the Dealer: {rules.screwTheDealer ? 'On' : 'Off'}</span>
                <span className="ruleChip">
                  1-card round twice: {rules.playSingleCardRoundTwice ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            <div className="row wrap">
              <Link href="/rules" className="button secondary">
                View Rules
              </Link>
              {gameFinished ? (
                <>
                  <button className="button secondary" onClick={reopenGame}>
                    Reopen Game
                  </button>
                  <button className="button secondary" onClick={startRematch}>
                    Rematch
                  </button>
                  <button className="button danger" onClick={clearSavedGame}>
                    Clear Saved Game
                  </button>
                </>
              ) : (
                <>
                  <button className="button secondary" onClick={resetGame}>
                    Reset Scores
                  </button>
                  <button className="button danger" onClick={finishGame}>
                    Finish Game
                  </button>
                </>
              )}
            </div>
          </div>

          {activeRound && !gameFinished ? (
            <div className="statusRow">
              <span className="statusInline">Dealer {activeRound.dealer}</span>
              <span className="statusInline">{activePhase === 'playing' ? 'Play' : 'Bid'} phase</span>
              <span className="statusInline">Bid {bidTotal}</span>
              <span className="statusInline">
                Got {gotTotal} / {activeRound.cards}
              </span>
            </div>
          ) : null}

          <div className="standingsStrip">
            {placings.map((entry) => (
              <div key={entry.name} className="standingCard">
                <span className="standingPlace">{entry.label}</span>
                <strong>{entry.name}</strong>
                <span>{entry.score}</span>
              </div>
            ))}
          </div>

          {gameFinished ? (
            <div className="finalSummary">
              <p className="muted">The current standings are locked in as your saved final results.</p>
              <p className="muted">Use Rematch to start over with the same players, rules, and card count.</p>
            </div>
          ) : null}
        </section>

        <section className="roundList">
          {entries.map((entry, roundIndex) => {
            const roundProgress = board.rounds[roundIndex]
            const roundState = getRoundState(entry, game.names, roundProgress)
            const isActiveRound = roundIndex === activeRoundIndex
            const isExpanded = roundState !== 'complete' || expandedRounds[roundIndex]
            const isEditingRound = Boolean(editingRounds[roundIndex])
            const roundPhase = entry.phase || 'bidding'
            const rowNote =
              isActiveRound &&
              !gameFinished &&
              roundPhase === 'bidding' &&
              dealerRestrictedBid !== null &&
              dealerRestrictedBid >= 0
                ? `Dealer can't say ${dealerRestrictedBid}`
                : null
            const roundStateLabel =
              roundState === 'complete'
                ? 'Done'
                : gameFinished
                  ? 'Saved'
                  : isActiveRound
                    ? roundPhase === 'playing'
                      ? 'Play'
                      : 'Bid'
                    : 'Next'
            const showRoundWarning = isActiveRound && !gameFinished && warning
            const canEditBid = gameFinished ? isEditingRound : isActiveRound ? roundPhase !== 'playing' : isEditingRound
            const canEditGot = gameFinished ? isEditingRound : isActiveRound ? roundPhase === 'playing' : isEditingRound

            return (
              <article key={`${entry.cards}-${roundIndex}`} className={`roundCard ${roundState}`}>
                <div className="roundCardHeader">
                  <div className="roundHeaderMain">
                    <h3>
                      Round {roundIndex + 1}
                    </h3>
                    <div className="roundHeaderMeta">
                      <span className="roundCardCount">{getCardsLabel(entry.cards)}</span>
                      <span>Dealer {entry.dealer}</span>
                      {isActiveRound && !gameFinished ? (
                        <>
                          <span>Bid {bidTotal}</span>
                          <span>
                            Got {gotTotal} / {entry.cards}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {rowNote ? <p className="roundNote">{rowNote}</p> : null}
                    {showRoundWarning ? <p className="roundAlert">{warning}</p> : null}
                  </div>
                  <div className="roundHeaderSide">
                    <span className={`roundStatePill ${roundState} ${isActiveRound ? roundPhase : ''}`}>
                      {roundStateLabel}
                    </span>
                    {isActiveRound && !gameFinished && roundState !== 'complete' ? (
                      <button
                        className="button secondary roundToggle"
                        onClick={() => setRoundPhase(roundIndex, roundPhase === 'playing' ? 'bidding' : 'playing')}
                      >
                        {roundPhase === 'playing' ? 'Edit bids' : 'Start play'}
                      </button>
                    ) : null}
                    {roundState === 'complete' ? (
                      <div className="roundActionGroup">
                        {isExpanded ? (
                          <button className="button secondary roundToggle" onClick={() => toggleRoundEditing(roundIndex)}>
                            {isEditingRound ? 'Lock round' : 'Edit round'}
                          </button>
                        ) : null}
                        <button className="button secondary roundToggle" onClick={() => toggleRoundDetails(roundIndex)}>
                          {isExpanded ? 'Hide details' : 'Show details'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {roundState === 'complete' && !isExpanded ? (
                  <div className="roundSummaryGrid">
                    {game.names.map((name) => {
                      const roundScore = roundProgress.scores?.[name]?.roundScore
                      const runningTotal = roundProgress.totals?.[name] ?? board.totals[name] ?? 0

                      return (
                        <div key={`${name}-${roundIndex}`} className="roundSummaryItem">
                          <strong>{name}</strong>
                          <span>{roundScore === undefined ? '-' : formatSignedScore(roundScore)}</span>
                          <span>Total {runningTotal}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="roundRows">
                    {game.names.map((name) => {
                      const max = entry.cards
                      const bid = toNumber(entry.bids?.[name])
                      const got = toNumber(entry.tricks?.[name])
                      const isDealer = entry.dealer === name
                      const roundScore = roundProgress.scores?.[name]?.roundScore
                      const runningTotal = roundProgress.totals?.[name] ?? board.totals[name] ?? 0

                      return (
                        <div key={`${name}-${roundIndex}`} className="playerRoundRow">
                          <div className="playerRoundIdentity">
                            <strong>{name}</strong>
                            {isDealer ? <span className="dealerTag">Dealer</span> : null}
                          </div>
                          <div className={`controlCluster ${isActiveRound && roundPhase === 'bidding' ? 'focus' : ''}`}>
                            <span className="controlLabel">Bid</span>
                            <div className="stepper">
                              <button
                                onClick={() => setValue(roundIndex, name, 'bids', -1, max)}
                                disabled={!canEditBid}
                              >
                                -
                              </button>
                              <strong>{bid}</strong>
                              <button
                                onClick={() => setValue(roundIndex, name, 'bids', 1, max)}
                                disabled={!canEditBid}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className={`controlCluster ${isActiveRound && roundPhase === 'playing' ? 'focus' : ''}`}>
                            <span className="controlLabel">Got</span>
                            <div className="stepper">
                              <button
                                onClick={() => setValue(roundIndex, name, 'tricks', -1, max)}
                                disabled={!canEditGot}
                              >
                                -
                              </button>
                              <strong>{got}</strong>
                              <button
                                onClick={() => setValue(roundIndex, name, 'tricks', 1, max)}
                                disabled={!canEditGot}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="scoreMeta">
                            <span className="controlLabel">Round</span>
                            <strong>{roundScore === undefined ? '-' : formatSignedScore(roundScore)}</strong>
                          </div>
                          <div className="scoreMeta">
                            <span className="controlLabel">Total</span>
                            <strong>{runningTotal}</strong>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
