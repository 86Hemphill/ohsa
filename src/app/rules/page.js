'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import setup from '../../game/setup'

const { createGameEntries } = setup

export default function RulesPage() {
  const router = useRouter()
  const [scoringMethod, setScoringMethod] = useState('classic')
  const [screwTheDealer, setScrewTheDealer] = useState(false)
  const [error, setError] = useState('')

  const game = useMemo(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('ohsa-game')
    return stored ? JSON.parse(stored) : null
  }, [])

  const startGame = () => {
    if (!game || !Array.isArray(game.names) || !game.names.length) {
      setError('No player order found. Add players first.')
      return
    }

    if (!Number.isInteger(game.maxCards) || game.maxCards < 1) {
      setError('No card count found. Set cards first.')
      return
    }

    const nextGame = {
      ...game,
      rules: {
        scoringMethod,
        screwTheDealer,
      },
      entries: createGameEntries(game.names, game.maxCards),
    }

    window.localStorage.setItem('ohsa-game', JSON.stringify(nextGame))
    router.push('/scoreboard')
  }

  return (
    <main className="screen">
      <div className="stack">
        <div>
          <h2>Rules</h2>
          <p className="muted">
            Add players in seating order starting with the dealer. The app rotates the dealer each
            round from that order.
          </p>
        </div>

        <section className="panel stack compact">
          <div>
            <p className="eyebrow">Scoring</p>
            <div className="optionList">
              <label className="optionCard">
                <input
                  type="radio"
                  name="scoring"
                  value="classic"
                  checked={scoringMethod === 'classic'}
                  onChange={() => setScoringMethod('classic')}
                />
                <div>
                  <strong>Classic</strong>
                  <p className="muted">Exact bid scores 10 + tricks. Missed bids score tricks taken.</p>
                </div>
              </label>
              <label className="optionCard">
                <input
                  type="radio"
                  name="scoring"
                  value="competitive"
                  checked={scoringMethod === 'competitive'}
                  onChange={() => setScoringMethod('competitive')}
                />
                <div>
                  <strong>Competitive</strong>
                  <p className="muted">Exact bid scores 10 + tricks. Missed bids lose 10 per trick off.</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <p className="eyebrow">Bidding</p>
            <label className="optionCard">
              <input
                type="checkbox"
                checked={screwTheDealer}
                onChange={(event) => setScrewTheDealer(event.target.checked)}
              />
              <div>
                <strong>Screw the Dealer</strong>
                <p className="muted">
                  When all bids are entered, total bids cannot equal cards dealt in that round.
                </p>
              </div>
            </label>
          </div>
        </section>

        {game?.names?.length ? (
          <div className="panel stack compact">
            <p className="eyebrow">Dealer Order</p>
            <p className="muted">Round 1 dealer: {game.names[0]}</p>
            <p className="muted">Dealer rotates in the same player order every round.</p>
          </div>
        ) : null}

        {error ? <p className="error">{error}</p> : null}

        <div className="row wrap">
          <button className="button secondary" onClick={() => router.push('/cards')}>
            Back
          </button>
          <button className="button primary" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    </main>
  )
}
