'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import setup from '../../game/setup'

const { createGameEntries, hasGameProgress } = setup

export default function RulesPage() {
  const router = useRouter()
  const game = useMemo(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('ohsa-game')
    return stored ? JSON.parse(stored) : null
  }, [])
  const hasStartedGame = Boolean(game?.entries?.length)
  const hasProgress = hasGameProgress(game)
  const [scoringMethod, setScoringMethod] = useState(game?.rules?.scoringMethod || 'classic')
  const [screwTheDealer, setScrewTheDealer] = useState(Boolean(game?.rules?.screwTheDealer))
  const [playSingleCardRoundTwice, setPlaySingleCardRoundTwice] = useState(
    Boolean(game?.rules?.playSingleCardRoundTwice)
  )
  const [error, setError] = useState('')

  const startGame = () => {
    if (hasProgress) {
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
      progressed: false,
      rules: {
        scoringMethod,
        screwTheDealer,
        playSingleCardRoundTwice,
      },
      entries: createGameEntries(game.names, game.maxCards, {
        playSingleCardRoundTwice,
      }),
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
          </div>

          <section className="stack compact">
            <div>
              <p className="eyebrow">Scoring</p>
              <div className="segmentedGrid">
                <button
                  type="button"
                  className={scoringMethod === 'classic' ? 'choiceCard active' : 'choiceCard'}
                  disabled={hasProgress}
                  onClick={() => setScoringMethod('classic')}
                >
                  <strong>Classic</strong>
                  <span>Exact bid scores 10 + tricks. Missed bids score tricks taken.</span>
                </button>
                <button
                  type="button"
                  className={scoringMethod === 'competitive' ? 'choiceCard active' : 'choiceCard'}
                  disabled={hasProgress}
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
                disabled={hasProgress}
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

            <div>
              <p className="eyebrow">Rounds</p>
              <button
                type="button"
                className={
                  playSingleCardRoundTwice ? 'choiceCard toggleCard active' : 'choiceCard toggleCard'
                }
                disabled={hasProgress}
                onClick={() => setPlaySingleCardRoundTwice((current) => !current)}
              >
                <div className="row split">
                  <strong>Play 1-card round twice</strong>
                  <span className={playSingleCardRoundTwice ? 'togglePill on' : 'togglePill'}>
                    {playSingleCardRoundTwice ? 'On' : 'Off'}
                  </span>
                </div>
                <span>
                  {playSingleCardRoundTwice
                    ? 'Sequence example: 3 2 1 1 2 3'
                    : 'Sequence example: 3 2 1 2 3'}
                </span>
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
            <Link href="/how-to-play" className="button secondary">
              How to Play
            </Link>
            <button
              className="button secondary"
              onClick={() => router.push(hasProgress ? '/scoreboard' : '/players')}
            >
              Back
            </button>
            <button className="button primary" onClick={startGame}>
              {hasProgress ? 'Return to Game' : 'Start Game'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
