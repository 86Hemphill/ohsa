'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomeActions() {
  const [hasSavedGame, setHasSavedGame] = useState(false)

  useEffect(() => {
    setHasSavedGame(Boolean(window.localStorage.getItem('ohsa-game')))
  }, [])

  return (
    <div className="stack compact">
      <Link href="/players" className="button primary">
        Start New Game
      </Link>
      {hasSavedGame ? (
        <Link href="/scoreboard" className="button secondary">
          Resume Saved Game
        </Link>
      ) : null}
    </div>
  )
}
