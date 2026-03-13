'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import setup from '../../game/setup'

const { createGameEntries } = setup

export default function RulesPage() {
  const router = useRouter()
  const game = useMemo(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('ohsa-game')
    return stored ? JSON.parse(stored) : null
  }, [])
  const hasStartedGame = Boolean(game?.entries?.length)
  const hasProgress = Boolean(
    game?.entries?.some(
      (entry) => Object.keys(entry.bids || {}).length > 0 || Object.keys(entry.tricks || {}).length > 0
    )
  )
  const [scoringMethod, setScoringMethod] = useState(game?.rules?.scoringMethod || 'classic')
  const [screwTheDealer, setScrewTheDealer] = useState(Boolean(game?.rules?.screwTheDealer))
  const [error, setError] = useState('')

  const startGame = () => {
    if (hasStartedGame) {
      router.push('/scoreboard')
      return
    }

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
      <div className="stack appShell">
        <div className="panel stack roomy">
          <div>
            <h2>Rules</h2>
            <p className="muted">
              Add players in seating order starting with the dealer. The app rotates the dealer each
              round from that order.
            </p>
          </div>

          <section className="stack compact">
            <div>
              <p className="eyebrow">Scoring</p>
              <div className="segmentedGrid">
                <button
                  type="button"
                  className={scoringMethod === 'classic' ? 'choiceCard active' : 'choiceCard'}
                  disabled={hasStartedGame}
                  onClick={() => setScoringMethod('classic')}
                >
                  <strong>Classic</strong>
                  <span>Exact bid scores 10 + tricks. Missed bids score tricks taken.</span>
                </button>
                <button
                  type="button"
                  className={scoringMethod === 'competitive' ? 'choiceCard active' : 'choiceCard'}
                  disabled={hasStartedGame}
                  onClick={() => setScoringMethod('competitive')}
                >
                  <strong>Competitive</strong>
                  <span>Exact bid scores 10 + tricks. Missed bids lose 10 per trick off.</span>
                </button>
              </div>
            </div>

            <div>
              <p className="eyebrow">Bidding</p>
              <button
                type="button"
                className={screwTheDealer ? 'choiceCard toggleCard active' : 'choiceCard toggleCard'}
                disabled={hasStartedGame}
                onClick={() => setScrewTheDealer((current) => !current)}
              >
                <div className="row split">
                  <strong>Screw the Dealer</strong>
                  <span className={screwTheDealer ? 'togglePill on' : 'togglePill'}>
                    {screwTheDealer ? 'On' : 'Off'}
                  </span>
                </div>
                <span>When all bids are entered, total bids cannot equal cards dealt in that round.</span>
              </button>
            </div>
          </section>

          {game?.names?.length ? (
            <div className="panel stack compact insetPanel">
              <p className="eyebrow">Dealer Order</p>
              <p className="muted">Round 1 dealer: {game.names[0]}</p>
              <p className="muted">Dealer rotates in the same player order every round.</p>
              {hasProgress ? (
                <p className="muted">Rules are locked once the game has started.</p>
              ) : null}
            </div>
          ) : null}

          {error ? <p className="error">{error}</p> : null}

          <div className="row wrap">
            <button
              className="button secondary"
              onClick={() => router.push(hasStartedGame ? '/scoreboard' : '/cards')}
            >
              Back
            </button>
            <button className="button primary" onClick={startGame}>
              {hasStartedGame ? 'Return to Game' : 'Start Game'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
