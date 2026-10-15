<script setup>
// Structure commune à toutes les pages : barre de navigation + contenu de la page
import BarreNavigation from './components/BarreNavigation.vue'
</script>

<template>
  <BarreNavigation />
  <main>
    <RouterView />
  </main>
</template>
