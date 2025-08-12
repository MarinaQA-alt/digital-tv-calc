import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Edit base if deploying under repo subpath, e.g. '/digital-tv-calc/'
export default defineConfig({
  plugins: [react()],
  base: './', // change to '/<repo-name>/' for GitHub Pages if not using Actions that set it
})
