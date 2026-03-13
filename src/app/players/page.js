'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlayersPage() {
  const [nameInput, setNameInput] = useState('')
  const [names, setNames] = useState([])
  const [maxCards, setMaxCards] = useState(7)
  const [error, setError] = useState('')
  const router = useRouter()

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

    const game = { names, maxCards: n }
    window.localStorage.setItem('ohsa-game', JSON.stringify(game))
    router.push('/rules')
  }

  return (
    <main className="screen">
      <div className="stack appShell">
        <div className="panel stack roomy">
          <div>
            <h2>Players</h2>
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

          {error ? <p className="error">{error}</p> : null}

          <button onClick={continueToRules} className="button primary">
            Continue
          </button>
        </div>
      </div>
    </main>
  )
}
