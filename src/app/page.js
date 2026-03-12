import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="centered">
      <div className="card hero">
        <h1>OHSA</h1>
        <p>Track your Oh Hell games on mobile.</p>
        <Link href="/players" className="button primary">
          Start New Game
        </Link>
      </div>
    </main>
  )
}
