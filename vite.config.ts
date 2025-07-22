import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only use SSL plugin in development mode to avoid GitHub Pages deployment issues
    process.env.NODE_ENV !== 'production' ? basicSsl() : null
  ].filter(Boolean),
  base: '/webxr-instrument/',
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
