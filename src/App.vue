<script setup>
// Structure commune à toutes les pages : barre de navigation + contenu de la page
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePrimeVue } from 'primevue/config'
import Toast from 'primevue/toast'
import BarreNavigation from './components/BarreNavigation.vue'
import { traduirePrimeVue } from './localePrimeVue.js'

const { t, tm, rt, locale } = useI18n()
const primevue = usePrimeVue()

// Traduit les composants PrimeVue au démarrage, puis à chaque changement de langue
watch(locale, () => traduirePrimeVue(primevue.config, t, tm, rt), { immediate: true })
</script>

<template>
  <BarreNavigation />
  <main>
    <RouterView />
  </main>
  <!-- Zone d'affichage des messages de confirmation -->
  <Toast position="bottom-right" />
</template>
