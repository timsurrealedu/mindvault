import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MindVault frontend dev server. The /api proxy points at the optional
// Node.js + Prisma backend scaffold (server/) so the same fetch calls work
// in the prototype (mocked) and against a real API later.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
