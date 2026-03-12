'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import scoring from '@/game/scoring'

const { buildScoreboard } = scoring

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function ScoreboardPage() {
  const router = useRouter()
  const [version, setVersion] = useState(0)

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

  const roundsForEngine = game.entries.map((entry) => ({
    bids: game.names.reduce((acc, name) => {
      acc[name] = toNumber(entry.bids?.[name])
      return acc
    }, {}),
    tricks: game.names.reduce((acc, name) => {
      acc[name] = toNumber(entry.tricks?.[name])
      return acc
    }, {}),
  }))

  const board = buildScoreboard({ players: game.names, rounds: roundsForEngine })

  const setValue = (roundIndex, player, field, delta, maxForRound) => {
    const clone = structuredClone(game)
    const current = toNumber(clone.entries[roundIndex][field][player])
    const next = Math.min(maxForRound, Math.max(0, current + delta))
    clone.entries[roundIndex][field][player] = next
    window.localStorage.setItem('ohsa-game', JSON.stringify(clone))
    setVersion((v) => v + 1)
  }

  return (
    <main className="screen wide">
      <h2>Scoreboard</h2>
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
            {game.entries.map((entry, roundIndex) => (
              <tr key={`${entry.cards}-${roundIndex}`}>
                <td className="stickyLeft">{entry.cards}</td>
                {game.names.map((name) => {
                  const max = entry.cards
                  const bid = toNumber(entry.bids[name])
                  const tricks = toNumber(entry.tricks[name])
                  return (
                    <td key={`${name}-${roundIndex}`}>
                      <div className="cellControl">
                        <span>B: {bid}</span>
                        <div>
                          <button onClick={() => setValue(roundIndex, name, 'bids', -1, max)}>-</button>
                          <button onClick={() => setValue(roundIndex, name, 'bids', 1, max)}>+</button>
                        </div>
                        <span>T: {tricks}</span>
                        <div>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', -1, max)}>-</button>
                          <button onClick={() => setValue(roundIndex, name, 'tricks', 1, max)}>+</button>
                        </div>
                        <strong>+{board.rounds[roundIndex].scores[name].roundScore}</strong>
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
