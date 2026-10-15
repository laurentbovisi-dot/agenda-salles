<script setup>
// Barre de navigation commune : embleme, nom de l'établissement,
// liens vers les pages et sélecteur de langue.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import { etablissement, languesInterface } from '../config.js'
import { changerLangue } from '../i18n.js'

const { t, locale } = useI18n()

// Chemin de l'embleme (tient compte du chemin de base /agenda-salles/)
const embleme = `${import.meta.env.BASE_URL}logo-embleme.png`

// Liens de navigation (recalculés quand la langue change)
const liens = computed(() => [
  { route: '/', libelle: t('nav.accueil'), icone: 'pi pi-home' },
  { route: '/agenda', libelle: t('nav.agenda'), icone: 'pi pi-calendar' }
])

// Langue sélectionnée : lue depuis vue-i18n, modifiée via changerLangue()
const langue = computed({
  get: () => locale.value,
  set: (code) => changerLangue(code)
})
</script>

<template>
  <header class="barre">
    <div class="conteneur barre-contenu">
      <RouterLink to="/" class="marque">
        <img :src="embleme" alt="" class="embleme" />
        <span class="nom">{{ etablissement.nom }}</span>
      </RouterLink>

      <nav class="liens">
        <RouterLink v-for="lien in liens" :key="lien.route" :to="lien.route" class="lien">
          <i :class="lien.icone" aria-hidden="true"></i>
          {{ lien.libelle }}
        </RouterLink>
      </nav>

      <Select
        v-model="langue"
        :options="languesInterface"
        option-label="libelle"
        option-value="code"
        :aria-label="t('nav.langue')"
        class="choix-langue"
      />
    </div>
  </header>
</template>

<style scoped>
.barre {
  background: #ffffff;
  border-bottom: 1px solid #e3e8e3;
  position: sticky;
  top: 0;
  z-index: 10;
}

.barre-contenu {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.marque {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--bleu-marine);
  font-weight: 700;
  margin-right: auto;
}

.embleme {
  width: 48px;
  height: 48px;
}

.liens {
  display: flex;
  gap: 0.25rem;
}

.lien {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--texte);
}

.lien:hover {
  background: var(--fond-clair);
}

/* Lien de la page affichée */
.lien.router-link-exact-active {
  color: var(--bleu-marine);
  font-weight: 600;
  box-shadow: inset 0 -3px 0 var(--vert-sauge);
}

.choix-langue {
  min-width: 9rem;
}
</style>
