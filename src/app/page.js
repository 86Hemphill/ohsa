import Image from 'next/image'
import HomeActions from './home-actions'
import ohHellArt from '../images/ohHell.jpg'

export default function HomePage() {
  return (
    <main className="homeScreen">
      <section className="heroShell">
        <div className="heroArtwork">
          <Image
            src={ohHellArt}
            alt="Oh Hell title art"
            priority
            className="heroImage"
            sizes="(max-width: 700px) 82vw, 420px"
          />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">Mobile Scorekeeper</p>
          <h1>Oh Hell Score App</h1>
          <p className="heroLead">
            Keep rounds moving, track bids and tricks cleanly, and keep the full table on the same
            page.
          </p>
          <HomeActions />
        </div>
      </section>
    </main>
  )
}
