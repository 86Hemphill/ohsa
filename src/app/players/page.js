'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlayersPage() {
  const [nameInput, setNameInput] = useState('')
  const [names, setNames] = useState([])
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

  const continueToCards = () => {
    if (names.length < 2) {
      setError('Add at least 2 players to start.')
      return
    }

    const game = { names }
    window.localStorage.setItem('ohsa-game', JSON.stringify(game))
    router.push('/cards')
  }

  return (
    <main className="screen">
      <h2>Players</h2>
      <div className="stack">
        <p className="muted">Add players in order of play, starting with the dealer for round 1.</p>
        <div className="row">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter player name"
            className="input"
          />
          <button onClick={addPlayer} className="button">
            Add
          </button>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <ul className="playerList">
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <button onClick={continueToCards} className="button primary">
          Continue
        </button>
      </div>
    </main>
  )
}
