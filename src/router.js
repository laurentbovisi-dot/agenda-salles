// Navigation entre les pages.
// Le mode "hash" (adresses en #/agenda) fonctionne sur GitHub Pages sans configuration du serveur.
import { createRouter, createWebHashHistory } from 'vue-router'
import AccueilView from './views/AccueilView.vue'
import AgendaView from './views/AgendaView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'accueil', component: AccueilView },
    { path: '/agenda', name: 'agenda', component: AgendaView }
  ],
  // Revenir en haut de la page à chaque changement de page
  scrollBehavior: () => ({ top: 0 })
})
