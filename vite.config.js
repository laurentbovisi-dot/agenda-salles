import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuration de Vite.
// "base" doit correspondre au nom du dépôt, car GitHub Pages publie
// le site à l'adresse https://<utilisateur>.github.io/agenda-salles/
export default defineConfig({
  base: '/agenda-salles/',
  plugins: [vue()],
  build: {
    // Vue + PrimeVue (thème Aura) + vue-i18n pèsent un peu plus de 500 ko
    // (environ 130 ko compressés) : c'est normal, on relève le seuil d'alerte.
    chunkSizeWarningLimit: 600
  }
})
