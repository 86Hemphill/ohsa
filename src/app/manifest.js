export default function manifest() {
  return {
    name: 'Oh Hell Scorekeeper',
    short_name: 'Oh Hell',
    description: 'Track bids, got, and running scores for Oh Hell on mobile.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#208576',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
