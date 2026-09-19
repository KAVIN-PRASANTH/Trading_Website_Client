import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      ignored: ['**/scratch/**', '**/.git/**'],
    },
  },
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{ts,tsx,js,jsx}'],
  },
})
