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
    (entry) => !isRoundComplete({ players: game.names, bids: entry.bids, tricks: entry.tricks })
  )
  const activeRoundIndex = currentRoundIndex === -1 ? entries.length - 1 : currentRoundIndex
  const activeRound = entries[activeRoundIndex]
  const bidTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
    : 0
  const trickTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.tricks?.[name]), 0)
    : 0
  const nextBidder = activeRound ? getNextBidder(activeRound, game.names) : null
  const biddingLockedTo = nextBidder
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
    const current = toNumber(round[field][player])
    const next = Math.min(maxForRound, Math.max(0, current + delta))
    const isActiveRound = roundIndex === activeRoundIndex

    if (field === 'bids' && isActiveRound && biddingLockedTo && player !== biddingLockedTo) {
      setWarning(`It is ${biddingLockedTo}'s turn to bid.`)
      return
    }

    if (field === 'bids' && isActiveRound && rules.screwTheDealer && player === round.dealer) {
      const totalWithoutDealer = game.names
        .filter((name) => name !== player)
        .reduce((sum, name) => sum + toNumber(round.bids?.[name]), 0)
      if (next === round.cards - totalWithoutDealer) {
        setWarning(`Screw the Dealer is On. ${player} can't say ${next}.`)
        return
      }
    }

    round[field][player] = next
    window.localStorage.setItem('ohsa-game', JSON.stringify(clone))
    setWarning('')
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
              <p className="muted">
                Screw the Dealer is {rules.screwTheDealer ? 'On' : 'Off'} {rules.screwTheDealer ? '✓' : '✕'}
              </p>
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
                <span className="statusLabel">Actual total</span>
                <strong>
                  {trickTotal} / {activeRound.cards}
                </strong>
              </div>
            </div>
          ) : null}
          {dealerRestrictedBid !== null && dealerRestrictedBid >= 0 ? (
            <p className="muted">Dealer restriction: {activeRound.dealer} can't say {dealerRestrictedBid}.</p>
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
            {entries.map((entry, roundIndex) => (
              <tr key={`${entry.cards}-${roundIndex}`}>
                <td className="stickyLeft">
                  <div className="roundMeta">
                    <strong>{entry.cards} cards</strong>
                    <span className="muted smallText">Dealer: {entry.dealer}</span>
                    <span className={roundIndex === activeRoundIndex ? 'roundBadge active' : 'roundBadge'}>
                      {board.rounds[roundIndex].complete
                        ? 'Done'
                        : roundIndex === activeRoundIndex
                          ? 'Active'
                          : 'Pending'}
                    </span>
                  </div>
                </td>
                {game.names.map((name) => {
                  const max = entry.cards
                  const bid = hasRecordedValue(entry, 'bids', name) ? toNumber(entry.bids[name]) : null
                  const tricks = hasRecordedValue(entry, 'tricks', name) ? toNumber(entry.tricks[name]) : null
                  const isDealer = entry.dealer === name
                  const roundScore = board.rounds[roundIndex].scores?.[name]?.roundScore
                  const runningTotal = board.rounds[roundIndex].totals?.[name]
                  const bidDisabled =
                    roundIndex === activeRoundIndex && biddingLockedTo && biddingLockedTo !== name

                  return (
                    <td key={`${name}-${roundIndex}`}>
                      <div className="cellControl">
                        <span>{isDealer ? 'Bid (D):' : 'Bid:'} {bid ?? '-'}</span>
                        <div>
                          <button disabled={bidDisabled} onClick={() => setValue(roundIndex, name, 'bids', -1, max)}>
                            -
                          </button>
                          <button disabled={bidDisabled} onClick={() => setValue(roundIndex, name, 'bids', 1, max)}>
                            +
                          </button>
                        </div>
                        <span>Actual: {tricks ?? '-'}</span>
                        <div>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', -1, max)}>-</button>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', 1, max)}>+</button>
                        </div>
                        <strong>{roundScore === undefined ? '-' : formatSignedScore(roundScore)}</strong>
                        <span className="runningTotal">
                          Total: {runningTotal === undefined ? board.totals[name] || 0 : runningTotal}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="stickyLeft">Total</th>
              {game.names.map((name) => (
                <th key={`total-${name}`}>{board.totals[name] || 0}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  )
}
