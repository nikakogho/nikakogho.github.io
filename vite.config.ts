// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add the assetsInclude option here:
  assetsInclude: ['**/*.md'], // Tell Vite to treat .md files as assets
  server: {
    fs: {
      allow: [
        // Ensure these paths are correct for your project structure
        path.resolve(__dirname, '..'),
        path.resolve(__dirname),
      ],
    },
  },
})