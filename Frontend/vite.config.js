import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Mirrors the Vercel rewrites in production: the app always talks to its own
  // origin, and /api + /uploads are forwarded to the backend. One origin means
  // the auth cookie is first-party, so it can stay sameSite=strict.
  const backend = env.DEV_BACKEND_ORIGIN || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': { target: backend, changeOrigin: false },
        '/uploads': { target: backend, changeOrigin: false },
      },
    },
  }
})
