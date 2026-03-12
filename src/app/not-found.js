import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="screen">
      <section className="panel stack">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The route you requested does not exist in this app.</p>
        <Link className="buttonLink" href="/">
          Return home
        </Link>
      </section>
    </main>
  )
}
