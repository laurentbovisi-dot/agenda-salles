import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuration de Vite.
// "base" doit correspondre au nom du dépôt, car GitHub Pages publie
// le site à l'adresse https://<utilisateur>.github.io/agenda-salles/
export default defineConfig({
  base: '/agenda-salles/',
  plugins: [vue()]
})
