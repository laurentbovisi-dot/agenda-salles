// Navigation entre les pages.
// Le mode "hash" (adresses en #/agenda) fonctionne sur GitHub Pages sans configuration du serveur.
import { createRouter, createWebHashHistory } from 'vue-router'
import AccueilView from './views/AccueilView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'accueil', component: AccueilView },
    // La page Agenda n'est chargée qu'à la première visite (fichier plus léger au démarrage)
    { path: '/agenda', name: 'agenda', component: () => import('./views/AgendaView.vue') }
  ],
  // Revenir en haut de la page à chaque changement de page
  scrollBehavior: () => ({ top: 0 })
})
