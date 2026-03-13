'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import setup from '../game/setup'

const { GAME_STATUS, createRematchGame } = setup

export default function HomeActions() {
  const [savedGame, setSavedGame] = useState(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('ohsa-game')
    setSavedGame(stored ? JSON.parse(stored) : null)
  }, [])

  const startRematch = () => {
    if (!savedGame) return
    const rematch = createRematchGame(savedGame)
    window.localStorage.setItem('ohsa-game', JSON.stringify(rematch))
    window.location.href = '/scoreboard'
  }

  const hasSavedGame = Boolean(savedGame)
  const isFinishedGame = savedGame?.status === GAME_STATUS.FINISHED

  return (
    <div className="heroActions">
      <Link href="/players" className="button primary">
        New Game
      </Link>
      {hasSavedGame ? (
        <>
          <Link href="/scoreboard" className="button secondary">
            {isFinishedGame ? 'View Final Results' : 'Resume Saved Game'}
          </Link>
          {isFinishedGame ? (
            <button type="button" className="button secondary" onClick={startRematch}>
              Rematch Same Table
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
