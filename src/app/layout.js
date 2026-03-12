import './globals.css'

export const metadata = {
  title: 'OHSA - Oh Hell Score App',
  description: 'Mobile-friendly score tracking for Oh Hell',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
