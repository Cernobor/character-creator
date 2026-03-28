export default defineNuxtConfig({
  ssr: false, 

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
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/index.html', 
      
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        }
      ],
      globDirectory: 'dist',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp,json}'],
      maximumFileSizeToCacheInBytes: 5000000, // 5MB
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