// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // --- Tvoje původní nastavení (PONECHÁNO) ---
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  ssr: false, 
  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Character Creator RPG',
      short_name: 'RPG Creator',
      description: 'Offline tvorba postav pro vaše RPG',
      theme_color: '#2c1810',
      background_color: '#2c1810',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,json,woff2}'],
      navigateFallback: '/',
    },
  },

  nitro: {
    static: true,
    prerender: {
      routes: ['/']
    }
  }
})