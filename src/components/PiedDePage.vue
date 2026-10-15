<script setup>
// Pied de page : coordonnées de l'établissement et mention de démonstration
import { useI18n } from 'vue-i18n'
import { etablissement } from '../config.js'

const { t } = useI18n()
</script>

<template>
  <footer class="pied">
    <div class="conteneur pied-contenu">
      <div>
        <strong>{{ etablissement.nom }}</strong><br />
        <i class="pi pi-map-marker" aria-hidden="true"></i>
        {{ etablissement.adresse }}, {{ etablissement.npaVille }}<br />
        <i class="pi pi-phone" aria-hidden="true"></i>
        <a :href="`tel:${etablissement.telephone.replaceAll(' ', '')}`">{{ etablissement.telephone }}</a>
      </div>
      <p class="demo">{{ t('pied.demo') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.pied {
  margin-top: 3rem;
  background: var(--bleu-marine);
  color: #ffffff;
  padding: 1.5rem 0;
}

.pied-contenu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pied a {
  color: #ffffff;
}

.pi {
  margin-right: 0.3rem;
  font-size: 0.85rem;
}

.demo {
  margin: 0;
  font-style: italic;
  opacity: 0.85;
}
</style>
