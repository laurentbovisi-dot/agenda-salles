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

// --- Dates en toutes lettres ---
// Les noms des jours et des mois sont dans les fichiers de traduction (section "dates"),
// car les navigateurs ne connaissent pas tous le romanche (Chromium affichait de l'anglais).

const t = i18n.global.t

// Nom d'un jour de la semaine (0 = dimanche), ex. "lundi"
export function nomDuJour(numero) {
  return t(`dates.jours.${numero}`)
}

// Date en toutes lettres, selon le format suisse de la langue
// ex. "samedi 17 octobre 2026" (fr) ou "Samstag, 17. Oktober 2026" (de)
export function formatDateLongue(date) {
  return t('dates.dateLongue', {
    jour: nomDuJour(date.getDay()),
    numero: date.getDate(),
    mois: t(`dates.mois.${date.getMonth()}`),
    annee: date.getFullYear()
  })
}
