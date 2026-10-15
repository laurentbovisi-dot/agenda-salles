<script setup>
// Page Agenda (contenu à venir)
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="conteneur agenda">
    <h1>{{ t('agenda.titre') }}</h1>
    <p>{{ t('agenda.bientot') }}</p>
  </section>
</template>

<style scoped>
.agenda {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
