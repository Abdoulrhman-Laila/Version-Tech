import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})