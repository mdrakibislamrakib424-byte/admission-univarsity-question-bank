import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Native app (Capacitor) build config.
// base is relative ('./') because the app will be loaded from the
// device's local filesystem inside the Android WebView, not from a
// GitHub Pages subfolder. Do NOT set this to '/repo-name/' anymore.
export default defineConfig({
  base: './',
  plugins: [react()]
})
