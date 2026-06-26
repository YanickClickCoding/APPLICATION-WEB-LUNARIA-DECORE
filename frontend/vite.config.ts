import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // DEV UNIQUEMENT : expose le serveur sur le réseau local (Wi-Fi) pour
    // tester depuis un téléphone via l'URL « Network » affichée au démarrage.
    // Sans effet en production (le build statique ne lance pas ce serveur).
    host: true,
    port: 5173,
    proxy: {
      // Le backend a globalPrefix 'api' → on garde /api (pas de rewrite)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Images téléversées en local (stockage disque sans Cloudinary)
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // WebSocket de la messagerie temps réel (socket.io) — proxifié pour
      // fonctionner aussi depuis un téléphone via l'URL réseau de Vite.
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
