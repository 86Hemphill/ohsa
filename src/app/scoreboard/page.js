'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import scoring from '../../game/scoring'
import setup from '../../game/setup'

const { buildScoreboard, normalizeRules } = scoring
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

function entryIsComplete(entry, players) {
  return players.every(
    (name) => hasRecordedValue(entry, 'bids', name) && hasRecordedValue(entry, 'tricks', name)
  )
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
      acc[name] = toNumber(entry.bids?.[name])
      return acc
    }, {}),
    tricks: game.names.reduce((acc, name) => {
      acc[name] = toNumber(entry.tricks?.[name])
      return acc
    }, {}),
  }))

  const board = buildScoreboard({
    players: game.names,
    rounds: roundsForEngine,
    rules,
  })

  const currentRoundIndex = entries.findIndex((entry) => !entryIsComplete(entry, game.names))
  const activeRoundIndex = currentRoundIndex === -1 ? entries.length - 1 : currentRoundIndex
  const activeRound = entries[activeRoundIndex]
  const bidTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.bids?.[name]), 0)
    : 0
  const trickTotal = activeRound
    ? game.names.reduce((sum, name) => sum + toNumber(activeRound.tricks?.[name]), 0)
    : 0

  const setValue = (roundIndex, player, field, delta, maxForRound) => {
    const clone = structuredClone(game)
    const current = toNumber(clone.entries[roundIndex][field][player])
    const next = Math.min(maxForRound, Math.max(0, current + delta))

    if (field === 'bids' && rules.screwTheDealer) {
      const nextBids = { ...clone.entries[roundIndex].bids, [player]: next }
      const allBidsRecorded = game.names.every((name) =>
        name === player ? true : hasRecordedValue(clone.entries[roundIndex], 'bids', name)
      )

      if (allBidsRecorded) {
        const totalBids = game.names.reduce((sum, name) => sum + toNumber(nextBids[name]), 0)
        if (totalBids === clone.entries[roundIndex].cards) {
          setWarning(
            `Screw the Dealer is on. Round ${roundIndex + 1} bids cannot total ${clone.entries[roundIndex].cards}.`
          )
          return
        }
      }
    }

    clone.entries[roundIndex][field][player] = next
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
                {rules.scoringMethod === 'competitive' ? 'Competitive' : 'Classic'} scoring
                {rules.screwTheDealer ? ' - Screw the Dealer on' : ''}
              </p>
            </div>
            <div className="row wrap">
              <Link href="/rules" className="button secondary">
                Edit Setup
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
                <span className="statusLabel">Bid total</span>
                <strong>{bidTotal}</strong>
              </div>
              <div className="statusCard">
                <span className="statusLabel">Trick total</span>
                <strong>
                  {trickTotal} / {activeRound.cards}
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
            {entries.map((entry, roundIndex) => (
              <tr key={`${entry.cards}-${roundIndex}`}>
                <td className="stickyLeft">
                  <div className="roundMeta">
                    <strong>{entry.cards} cards</strong>
                    <span className="muted smallText">Dealer: {entry.dealer}</span>
                    <span className={roundIndex === activeRoundIndex ? 'roundBadge active' : 'roundBadge'}>
                      {entryIsComplete(entry, game.names)
                        ? 'Done'
                        : roundIndex === activeRoundIndex
                          ? 'Active'
                          : 'Pending'}
                    </span>
                  </div>
                </td>
                {game.names.map((name) => {
                  const max = entry.cards
                  const bid = toNumber(entry.bids[name])
                  const tricks = toNumber(entry.tricks[name])
                  const isDealer = entry.dealer === name

                  return (
                    <td key={`${name}-${roundIndex}`}>
                      <div className="cellControl">
                        <span>{isDealer ? 'B (D):' : 'B:'} {bid}</span>
                        <div>
                          <button onClick={() => setValue(roundIndex, name, 'bids', -1, max)}>-</button>
                          <button onClick={() => setValue(roundIndex, name, 'bids', 1, max)}>+</button>
                        </div>
                        <span>T: {tricks}</span>
                        <div>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', -1, max)}>-</button>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', 1, max)}>+</button>
                        </div>
                        <strong>{formatSignedScore(board.rounds[roundIndex].scores[name].roundScore)}</strong>
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
                <th key={`total-${name}`}>{board.totals[name]}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  )
}
