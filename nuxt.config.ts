// Nuxt is the Vue framework used by this project. Keep Nuxt; emit a static site for GitHub Pages.
// GitHub Actions sets NUXT_APP_BASE_URL=/space-impact-browser/ in production.
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Space Impact | Browser Edition',
      meta: [{ name: 'description', content: 'Play an unofficial retro space shooter inspired by classic Nokia-era gaming.' }],
    },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
