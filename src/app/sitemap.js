export default function sitemap() {
  const routes = ['', '/players', '/cards', '/rules', '/scoreboard']
  const now = new Date()

  return routes.map((route) => ({
    url: `https://ohhell.netlify.app${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
