/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/example/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3001,
    allowedHosts: true,
    ws: {
      path: '/ws',
      clientPort: 443,
      protocol: 'wss',
    },
  },
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
