import './globals.css'

const siteUrl = 'https://ohhell.netlify.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Oh Hell Scorekeeper',
    template: '%s | Oh Hell Scorekeeper',
  },
  description: 'Track bids, got, and running scores for Oh Hell on mobile.',
  applicationName: 'Oh Hell Scorekeeper',
  keywords: ['Oh Hell', 'scorekeeper', 'card game', 'bids', 'tricks'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Oh Hell Scorekeeper',
    description: 'Track bids, got, and running scores for Oh Hell on mobile.',
    siteName: 'Oh Hell Scorekeeper',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Oh Hell Scorekeeper preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oh Hell Scorekeeper',
    description: 'Track bids, got, and running scores for Oh Hell on mobile.',
    images: ['/opengraph-image.png'],
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#208576',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
