export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],

  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Character Creator',
      short_name: 'Char Creator',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
      scope: '/',
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/',
      globDirectory: 'dist',
      globPatterns: [
        '**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp,json}',
        'index.html'
      ],
      templatedURLs: {
        '/': 'index.html'
      },
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxAgeSeconds: 2592000
            }
          }
        }
      ],
    },
    devOptions: {
      enabled: true,
      type: 'classic',
    }
  },
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'public, max-age=1209600, s-maxage=1209600, immutable',
      }
    }
  }
})