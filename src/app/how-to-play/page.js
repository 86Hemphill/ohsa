import Link from 'next/link'

export const metadata = {
  title: 'How to Play',
  description: 'Learn how Oh Hell Scorekeeper handles setup, bidding, scoring, and common game rules.',
}

const setupSteps = [
  'Enter players in table order, starting with the dealer for round 1.',
  'Set the highest card count for the game.',
  'Choose scoring, Screw the Dealer, and whether the 1-card round is played twice.',
  'Start the game and enter bids before moving into trick tracking.',
]

const scoringNotes = [
  {
    title: 'Classic',
    body: 'Exact bids score 10 plus tricks taken. Missed bids score tricks taken.',
  },
  {
    title: 'Competitive',
    body: 'Exact bids score 10 plus tricks taken. Missed bids lose 10 points per trick off the bid.',
  },
]

const faqItems = [
  {
    question: 'How does dealer order work?',
    answer: 'The first player listed deals round 1. The dealer rotates in that same player order every round.',
  },
  {
    question: 'What does Screw the Dealer do in this app?',
    answer:
      'When Screw the Dealer is on, the dealer cannot make the total bids equal the number of cards dealt. Illegal dealer bids are blocked before play can start.',
  },
  {
    question: 'When is a round complete?',
    answer:
      'A round is complete only after every player has a bid and a got value recorded, and the total tricks got equals the number of cards dealt that round.',
  },
  {
    question: 'What does Play 1-card round twice do?',
    answer:
      'It changes the round sequence from a single one-card midpoint to two one-card rounds in the middle of the game.',
  },
  {
    question: 'Can I correct a finished round?',
    answer:
      'Yes. Completed rounds can be expanded and edited. Finished games can also be reopened if the saved results need correction.',
  },
  {
    question: 'What happens when I finish a game?',
    answer:
      'The app saves a final-results view with standings, round history, and actions for rematch, reopen, or clearing the saved game.',
  },
]

export default function HowToPlayPage() {
  return (
    <main className="screen">
      <div className="stack wideStack helpShell">
        <section className="panel stack roomy">
          <div>
            <p className="eyebrow">Guide</p>
            <h1>How to Play</h1>
            <p className="muted">
              This page covers how the app works and how the supported Oh Hell rule options behave.
            </p>
          </div>
          <div className="row wrap helpActions">
            <Link href="/" className="button secondary">
              Home
            </Link>
            <Link href="/players" className="button primary">
              Start Setup
            </Link>
          </div>
        </section>

        <div className="helpGrid">
          <section className="panel stack roomy">
            <div>
              <p className="eyebrow">Setup Flow</p>
              <h2>Start a Game</h2>
            </div>
            <ol className="helpList">
              {setupSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="panel stack roomy">
            <div>
              <p className="eyebrow">Scoring</p>
              <h2>Supported Methods</h2>
            </div>
            <div className="faqGrid">
              {scoringNotes.map((item) => (
                <article key={item.title} className="faqCard">
                  <strong>{item.title}</strong>
                  <p className="muted">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="panel stack roomy">
          <div>
            <p className="eyebrow">Round Flow</p>
            <h2>During Play</h2>
          </div>
          <div className="faqGrid">
            <article className="faqCard">
              <strong>Bid first</strong>
              <p className="muted">The active round starts in bidding mode. Enter bids for the table before starting play.</p>
            </article>
            <article className="faqCard">
              <strong>Track tricks</strong>
              <p className="muted">Once play starts, record how many tricks each player actually got.</p>
            </article>
            <article className="faqCard">
              <strong>Let totals close the round</strong>
              <p className="muted">
                The app advances only when total tricks match the number of cards dealt for that round.
              </p>
            </article>
          </div>
        </section>

        <section className="panel stack roomy">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Common Questions</h2>
          </div>
          <div className="faqGrid">
            {faqItems.map((item) => (
              <article key={item.question} className="faqCard">
                <strong>{item.question}</strong>
                <p className="muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
