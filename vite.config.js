import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: true, // enables access from mobile
    historyApiFallback: true // handle client-side routing
  },
  preview: {
    host: true,
    historyApiFallback: true
  }
})
