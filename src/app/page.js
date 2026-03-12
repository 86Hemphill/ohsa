import HomeActions from './home-actions'

export default function HomePage() {
  return (
    <main className="centered">
      <div className="card hero">
        <h1>OHSA</h1>
        <p>Track your Oh Hell games on mobile.</p>
        <HomeActions />
      </div>
    </main>
  )
}
