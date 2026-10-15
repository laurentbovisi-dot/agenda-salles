// Point d'entrée de l'application
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import './style.css'

import App from './App.vue'
import { router } from './router.js'
import { i18n } from './i18n.js'
import { ThemeJardins } from './theme.js'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: ThemeJardins,
    // Mode clair uniquement : le mode sombre n'est jamais activé,
    // car le logo n'est pas lisible sur fond sombre
    options: { darkModeSelector: false }
  }
})

document.documentElement.lang = i18n.global.locale.value
app.mount('#app')
