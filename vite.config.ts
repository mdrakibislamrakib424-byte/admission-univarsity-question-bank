import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANT: change "base" to match your GitHub repository name
// e.g. if your repo is github.com/yourname/admission-bank -> base: '/admission-bank/'
export default defineConfig({
  base: '/admission-question-bank/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'প্রশ্নব্যাংক - University Admission Prep',
        short_name: 'প্রশ্নব্যাংক',
        description: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সম্পূর্ণ প্রশ্নব্যাংক ও প্রস্তুতি',
        theme_color: '#0E1420',
        background_color: '#0E1420',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/admission-question-bank/',
        scope: '/admission-question-bank/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'question-data-cache' }
          }
        ]
      }
    })
  ]
})
