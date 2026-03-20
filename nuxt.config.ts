export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Character Creator',
      short_name: 'Char Creator',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
    },
    workbox: {
      navigateFallback: '/',
            globDirectory: '.output/public',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp,json}'],
            maximumFileSizeToCacheInBytes: 5000000, // 5MB
    },
    devOptions: {
      enabled: true,
      type: 'classic',
    }
  },
})