'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CardsPage() {
  const [maxCards, setMaxCards] = useState(7)
  const [error, setError] = useState('')
  const router = useRouter()

  const startGame = () => {
    const stored = window.localStorage.getItem('ohsa-game')
    if (!stored) {
      setError('No game found. Add players first.')
      return
    }

    const parsed = JSON.parse(stored)
    const n = Number(maxCards)

    if (!Number.isInteger(n) || n < 1) {
      setError('Max cards must be a positive whole number.')
      return
    }

    const game = {
      ...parsed,
      maxCards: n,
    }

    window.localStorage.setItem('ohsa-game', JSON.stringify(game))
    router.push('/rules')
  }

  return (
    <main className="screen">
      <h2>How many cards?</h2>
      <div className="stack">
        <input
          className="input"
          type="number"
          min="1"
          value={maxCards}
          onChange={(e) => setMaxCards(e.target.value)}
        />
        <button onClick={startGame} className="button primary">
          Continue
        </button>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </main>
  )
}
