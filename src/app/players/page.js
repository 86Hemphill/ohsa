'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import setup from '../../game/setup'

const { hasGameProgress } = setup

export default function PlayersPage() {
  const [nameInput, setNameInput] = useState('')
  const [names, setNames] = useState([])
  const [maxCards, setMaxCards] = useState(7)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = window.localStorage.getItem('ohsa-game')
    if (!stored) return

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed.names) || hasGameProgress(parsed)) {
      return
    }

    setNames(parsed.names)
    if (Number.isInteger(parsed.maxCards) && parsed.maxCards > 0) {
      setMaxCards(parsed.maxCards)
    }
  }, [])

  const addPlayer = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setError('Player name cannot be empty.')
      return
    }

    if (names.includes(trimmed)) {
      setError('Player names must be unique.')
      return
    }

    setNames((prev) => [...prev, trimmed])
    setNameInput('')
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addPlayer()
  }

  const removePlayer = (nameToRemove) => {
    setNames((prev) => prev.filter((name) => name !== nameToRemove))
    setError('')
  }

  const continueToRules = () => {
    if (names.length < 2) {
      setError('Add at least 2 players to start.')
      return
    }

    const n = Number(maxCards)
    if (!Number.isInteger(n) || n < 1) {
      setError('Max cards must be a positive whole number.')
      return
    }

    const stored = window.localStorage.getItem('ohsa-game')
    const parsed = stored ? JSON.parse(stored) : null
    const game = {
      ...(parsed && !hasGameProgress(parsed) ? parsed : {}),
      names,
      maxCards: n,
      progressed: false,
      status: 'in_progress',
    }
    window.localStorage.setItem('ohsa-game', JSON.stringify(game))
    router.push('/rules')
  }

  return (
    <main className="screen">
      <div className="stack appShell">
        <div className="panel stack roomy">
          <div>
            <h2>Setup</h2>
            <p className="muted">Add players in order of play, starting with the dealer for round 1.</p>
          </div>

          <div className="setupGrid">
            <section className="rosterPanel">
              <div className="row split">
                <div>
                  <p className="eyebrow">Players</p>
                </div>
                <span className="countBadge">{names.length}</span>
              </div>
              <form className="stack compact" onSubmit={handleSubmit}>
                <div className="row">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter player name"
                    className="input"
                  />
                  <button type="submit" className="button">
                    Add
                  </button>
                </div>
              </form>
              {names.length ? (
                <ol className="rosterList">
                  {names.map((name, index) => (
                    <li key={name} className="rosterItem">
                      <span className="rosterIndex">{index + 1}</span>
                      <span>{name}</span>
                      <button type="button" className="rosterRemove" onClick={() => removePlayer(name)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="emptyState">No players added yet.</p>
              )}
            </section>

            <section className="rosterPanel">
              <div className="row split">
                <div>
                  <p className="eyebrow">Max Cards</p>
                </div>
                <span className="countBadge">{maxCards}</span>
              </div>
              <input
                id="max-cards"
                className="input"
                type="number"
                min="1"
                value={maxCards}
                onChange={(e) => setMaxCards(e.target.value)}
              />
              <p className="muted">Set the highest number of cards dealt in a round.</p>
            </section>
          </div>

          {error ? <p className="error">{error}</p> : null}

          <button onClick={continueToRules} className="button primary">
            Continue
          </button>
        </div>
      </div>
    </main>
  )
}
