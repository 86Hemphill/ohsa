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

const traditionalRules = [
  {
    title: 'Goal',
    body: 'Call how many tricks you expect to win, then try to hit that number exactly.',
  },
  {
    title: 'Bidding order',
    body: 'Bidding usually starts to the dealer’s left, and the dealer bids last.',
  },
  {
    title: 'Trick-taking',
    body: 'Players follow suit if they can. Highest card of the led suit wins unless a trump suit is being used.',
  },
  {
    title: 'House rules vary',
    body: 'Oh Hell has many local variations. This app supports a practical subset of the most common ones.',
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
      'When Screw the Dealer is on, the dealer cannot make the total bids equal the cards dealt for that round. Illegal dealer bids are blocked before play can start.',
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
  {
    question: 'Does this page replace a full rulebook?',
    answer:
      'No. It gives a solid overview of common Oh Hell play plus the exact rules this app supports, without trying to document every house variation.',
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
              A practical guide to common Oh Hell rules and the way this scorekeeper handles them.
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
              <p className="eyebrow">Traditional Rules</p>
              <h2>How Oh Hell Is Commonly Played</h2>
              <p className="muted">
                These are the core ideas most tables use. Exact details can vary by house rules.
              </p>
            </div>
            <div className="faqGrid">
              {traditionalRules.map((item) => (
                <article key={item.title} className="faqCard">
                  <strong>{item.title}</strong>
                  <p className="muted">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel stack roomy">
            <div>
              <p className="eyebrow">App Flow</p>
              <h2>Start a Game in This App</h2>
              <p className="muted">This is the fastest way to get a table running inside the app.</p>
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
              <p className="muted">The app supports two scoring styles that cover the most common tables we discussed.</p>
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
              <p className="muted">Each round opens in bidding mode. Enter the table’s bids before switching to play.</p>
            </article>
            <article className="faqCard">
              <strong>Track tricks</strong>
              <p className="muted">After the hand is played, record how many tricks each player actually got.</p>
            </article>
            <article className="faqCard">
              <strong>Let totals close the round</strong>
              <p className="muted">
                A round only closes when the total tricks recorded matches the cards dealt for that round.
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

        <section className="panel stack roomy">
          <div>
            <p className="eyebrow">Sources</p>
            <h2>External References</h2>
            <p className="muted">These references informed the general gameplay section.</p>
          </div>
          <div className="faqGrid">
            <article className="faqCard">
              <strong>Pagat: Oh Hell</strong>
              <a href="https://www.pagat.com/exact/ohhell.html" target="_blank" rel="noreferrer">
                pagat.com/exact/ohhell.html
              </a>
            </article>
            <article className="faqCard">
              <strong>BoardGameGeek Wiki</strong>
              <a href="https://boardgamegeek.com/wiki/page/thing%3A1116" target="_blank" rel="noreferrer">
                boardgamegeek.com/wiki/page/thing:1116
              </a>
            </article>
            <article className="faqCard">
              <strong>BoardGameGeek Entry</strong>
              <a href="https://boardgamegeek.com/boardgame/1116/oh-hell" target="_blank" rel="noreferrer">
                boardgamegeek.com/boardgame/1116/oh-hell
              </a>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
