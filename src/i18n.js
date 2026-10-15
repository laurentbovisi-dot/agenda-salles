// Mise en place des traductions avec vue-i18n.
// Un fichier par langue dans src/locales/.
import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'
import rm from './locales/rm.json'
import { languesInterface } from './config.js'

// Clé utilisée pour mémoriser la langue choisie dans le navigateur
const CLE_LANGUE = 'agenda-salles.langue'

// Langue mémorisée, ou français par défaut
function langueInitiale() {
  try {
    const code = localStorage.getItem(CLE_LANGUE)
    if (languesInterface.some((l) => l.code === code)) return code
  } catch {
    // localStorage indisponible (navigation privée) : on garde le français
  }
  return 'fr'
}

export const i18n = createI18n({
  legacy: false, // API "Composition" (useI18n)
  locale: langueInitiale(),
  fallbackLocale: 'fr',
  messages: { fr, de, it, rm }
})

// Change la langue de l'interface et la mémorise
export function changerLangue(code) {
  i18n.global.locale.value = code
  document.documentElement.lang = code
  try {
    localStorage.setItem(CLE_LANGUE, code)
  } catch {
    // Pas grave : la langue ne sera simplement pas mémorisée
  }
}

// Renvoie le format suisse (ex. "fr-CH") de la langue actuelle,
// à utiliser pour afficher les dates et les heures
export function formatLocal() {
  const code = i18n.global.locale.value
  return languesInterface.find((l) => l.code === code).format
}
