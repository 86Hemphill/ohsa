'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import scoring from '../../game/scoring'
import setup from '../../game/setup'

const { buildScoreboardProgress, normalizeRules, isRoundComplete } = scoring
const { getDealerForRound } = setup

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

function getBidOrder(players, dealer) {
  const dealerIndex = players.indexOf(dealer)
  if (dealerIndex === -1) return players

  return players
    .slice(dealerIndex + 1)
    .concat(players.slice(0, dealerIndex + 1))
}

function getNextBidder(entry, players) {
  const bidOrder = getBidOrder(players, entry.dealer)
  return bidOrder.find((player) => !hasRecordedValue(entry, 'bids', player)) || null
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
      rank,
      label: getOrdinal(rank),
    }
  })
}

function getRoundState(entry, players, roundProgress) {
  if (roundProgress.complete) return 'complete'
  const hasAnyInput = players.some(
    (player) => hasRecordedValue(entry, 'bids', player) || hasRecordedValue(entry, 'tricks', player)
  )
  return hasAnyInput ? 'active' : 'pending'
}

export default function ScoreboardPage() {
  const router = useRouter()
  const [version, setVersion] = useState(0)
  const [warning, setWarning] = useState('')

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
  const bidTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
    : 0
  const gotTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.tricks?.[name]), 0)
    : 0
  const nextBidder = activeRound ? getNextBidder(activeRound, game.names) : null
  const currentRoundPlacement = getPlacings(game.names, board.totals)
  const dealerRestrictedBid =
    activeRound && rules.screwTheDealer && nextBidder === activeRound.dealer
      ? activeRound.cards -
        game.names
          .filter((name) => name !== activeRound.dealer)
          .reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
      : null

  const setValue = (roundIndex, player, field, delta, maxForRound) => {
    const clone = structuredClone(game)
    const round = clone.entries[roundIndex]
    const current = hasRecordedValue(round, field, player) ? toNumber(round[field][player]) : 0
    const next = Math.min(maxForRound, Math.max(0, current + delta))
    const isActiveRound = roundIndex === activeRoundIndex
    let nextWarning = ''

    if (
      field === 'bids' &&
      isActiveRound &&
      player === round.dealer &&
      round.cards > 1 &&
      game.names.filter((name) => name !== player).every((name) => !hasRecordedValue(round, 'bids', name))
    ) {
      setWarning(`The dealer bids last unless it is a one-card round.`)
      return
    }

    if (field === 'bids' && isActiveRound && nextBidder && player !== nextBidder) {
      nextWarning = `Bid order reminder: ${nextBidder} is next to bid.`
    }

    if (field === 'bids' && isActiveRound && rules.screwTheDealer && player === round.dealer) {
      const totalWithoutDealer = game.names
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
    }))

    window.localStorage.setItem(
      'ohsa-game',
      JSON.stringify({
        ...game,
        entries: resetEntries,
      })
    )
    setWarning('')
    setVersion((v) => v + 1)
  }

  const clearGame = () => {
    window.localStorage.removeItem('ohsa-game')
    router.push('/')
  }

  return (
    <main className="screen wide">
      <div className="stack wideStack">
        <div className="panel stack compact">
          <div className="row split">
            <div>
              <p className="eyebrow">Game in progress</p>
              <h2>Scoreboard</h2>
              {activeRound ? (
                <p className="muted">
                  Round {activeRoundIndex + 1} of {entries.length} - {activeRound.cards} cards
                </p>
              ) : null}
              <p className="muted">
                {rules.scoringMethod === 'competitive' ? 'Competitive Scoring' : 'Classic Scoring'}
              </p>
              <p className="muted">Screw the Dealer is {rules.screwTheDealer ? 'On' : 'Off'}</p>
            </div>
            <div className="row wrap">
              <Link href="/rules" className="button secondary">
                View Rules
              </Link>
              <button className="button secondary" onClick={resetGame}>
                Reset Scores
              </button>
              <button className="button danger" onClick={clearGame}>
                End Game
              </button>
            </div>
          </div>
          {activeRound ? (
            <div className="statusGrid">
              <div className="statusCard">
                <span className="statusLabel">Active round</span>
                <strong>Round {activeRoundIndex + 1}</strong>
              </div>
              <div className="statusCard">
                <span className="statusLabel">Dealer</span>
                <strong>{activeRound.dealer}</strong>
              </div>
              <div className="statusCard">
                <span className="statusLabel">Next bid</span>
                <strong>{nextBidder || 'Bidding complete'}</strong>
              </div>
              <div className="statusCard">
                <span className="statusLabel">Bid total</span>
                <strong>{bidTotal}</strong>
              </div>
              <div className="statusCard">
                <span className="statusLabel">Got total</span>
                <strong>
                  {gotTotal} / {activeRound.cards}
                </strong>
              </div>
            </div>
          ) : null}
          {warning ? <p className="error">{warning}</p> : null}
        </div>
      </div>
      <div className="scoreboardWrap">
        <table className="scoreboard">
          <thead>
            <tr>
              <th className="stickyLeft">Round</th>
              {game.names.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, roundIndex) => {
              const roundState = getRoundState(entry, game.names, board.rounds[roundIndex])
              const activeRowNote =
                roundIndex === activeRoundIndex
                  ? dealerRestrictedBid !== null && dealerRestrictedBid >= 0
                    ? `Dealer can't say ${dealerRestrictedBid}`
                    : gotTotal !== entry.cards
                      ? `Got total must equal ${entry.cards}`
                      : null
                  : null

              return (
                <tr key={`${entry.cards}-${roundIndex}`}>
                  <td className={`stickyLeft roundStateCell ${roundState}`}>
                    <div className="roundMeta">
                      <strong>{entry.cards} cards</strong>
                      <span className="muted smallText">Dealer: {entry.dealer}</span>
                      {activeRowNote ? <span className="roundNote">{activeRowNote}</span> : null}
                      <span className={`roundStateIndicator ${roundState}`} />
                    </div>
                  </td>
                  {game.names.map((name) => {
                    const max = entry.cards
                    const bid = toNumber(entry.bids?.[name])
                    const got = toNumber(entry.tricks?.[name])
                    const isDealer = entry.dealer === name
                    const roundScore = board.rounds[roundIndex].scores?.[name]?.roundScore
                    const runningTotal = board.rounds[roundIndex].totals?.[name]
                    const isNextBidder = roundIndex === activeRoundIndex && nextBidder === name

                    return (
                      <td
                        key={`${name}-${roundIndex}`}
                        className={isNextBidder ? 'activeBidderCell' : undefined}
                      >
                        <div className="cellControl">
                          <span>{isDealer ? 'Bid (D):' : 'Bid:'} {bid}</span>
                          <div>
                            <button onClick={() => setValue(roundIndex, name, 'bids', -1, max)}>-</button>
                            <button onClick={() => setValue(roundIndex, name, 'bids', 1, max)}>+</button>
                          </div>
                          <span>Got: {got}</span>
                          <div>
                            <button onClick={() => setValue(roundIndex, name, 'tricks', -1, max)}>-</button>
                            <button onClick={() => setValue(roundIndex, name, 'tricks', 1, max)}>+</button>
                          </div>
                          <strong>{roundScore === undefined ? '-' : formatSignedScore(roundScore)}</strong>
                          <span className="runningTotal">
                            Total: {runningTotal === undefined ? board.totals[name] || 0 : runningTotal}
                          </span>
                          {isNextBidder ? <span className="turnHint">Next to bid</span> : null}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className="stickyLeft">Final</th>
              {game.names.map((name) => {
                const placing = currentRoundPlacement.find((entry) => entry.name === name)
                return (
                  <th key={`total-${name}`}>
                    <div className="totalSummary">
                      <span>{name}</span>
                      <strong>{board.totals[name] || 0}</strong>
                      <span className="totalPlace">{placing?.label || '-'}</span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  )
}
