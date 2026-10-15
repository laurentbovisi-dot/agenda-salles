<script setup>
// Page d'accueil : bandeau, horaires, équipe, salles et pied de page.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import { Flower } from '@lucide/vue'
import PiedDePage from '../components/PiedDePage.vue'
import { etablissement, horaires, praticiens, salles } from '../config.js'
import { formatHeure, joursFermes } from '../dates.js'
import { nomDuJour } from '../i18n.js'
import { nombreReservationsDuJour } from '../reservations.js'

const { t } = useI18n()

const logo = `${import.meta.env.BASE_URL}logo.png`

// Jours d'une plage : "lundi – vendredi" ou "samedi"
function nomDesJours(jours) {
  const premier = nomDuJour(jours[0])
  if (jours.length === 1) return premier
  return `${premier} – ${nomDuJour(jours[jours.length - 1])}`
}

// Lignes du tableau des horaires (recalculées quand la langue change)
const lignesHoraires = computed(() => {
  const lignes = horaires.map((h) => ({
    jours: nomDesJours(h.jours),
    heures: `${formatHeure(h.ouverture)} – ${formatHeure(h.fermeture)}`,
    ferme: false
  }))
  for (const jour of joursFermes) {
    lignes.push({ jours: nomDuJour(jour), heures: t('accueil.ferme'), ferme: true })
  }
  return lignes
})

// Initiales d'un praticien, pour son avatar (ex. "AC" pour Anne-Laure Chappuis)
function initiales(praticien) {
  return praticien.prenom[0] + praticien.nom[0]
}

// Nom complet avec le titre éventuel (ex. "Dre Anne-Laure Chappuis")
function nomComplet(praticien) {
  return [praticien.titre, praticien.prenom, praticien.nom].filter(Boolean).join(' ')
}

// Salles avec leur nombre de réservations du jour
const sallesDuJour = salles.map((salle) => ({
  ...salle,
  reservations: nombreReservationsDuJour(salle.id)
}))
</script>

<template>
  <!-- Bandeau : logo, présentation, bouton de réservation -->
  <section class="bandeau">
    <div class="conteneur bandeau-contenu">
      <img :src="logo" :alt="etablissement.nom" class="logo" />
      <div>
        <p class="presentation">{{ t('accueil.presentation') }}</p>
        <RouterLink to="/agenda" custom v-slot="{ navigate }">
          <Button :label="t('accueil.reserver')" icon="pi pi-calendar-plus" size="large" @click="navigate" />
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Horaires d'ouverture -->
  <section class="conteneur section">
    <h2 class="titre-section">{{ t('accueil.horaires') }}</h2>
    <table class="horaires">
      <tbody>
        <tr v-for="ligne in lignesHoraires" :key="ligne.jours">
          <th scope="row">{{ ligne.jours }}</th>
          <td :class="{ ferme: ligne.ferme }">{{ ligne.heures }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Équipe : une carte par praticien -->
  <section class="conteneur section">
    <h2 class="titre-section">{{ t('accueil.equipe') }}</h2>
    <div class="grille">
      <Card v-for="praticien in praticiens" :key="praticien.id">
        <template #title>
          <div class="praticien-entete">
            <Avatar :label="initiales(praticien)" shape="circle" size="large" class="avatar" />
            <div>
              <div class="praticien-nom">{{ nomComplet(praticien) }}</div>
              <div class="praticien-specialite">{{ t(`praticiens.${praticien.id}.specialite`) }}</div>
            </div>
          </div>
        </template>
        <template #content>
          <p class="cv">{{ t(`praticiens.${praticien.id}.cv`) }}</p>
          <div class="langues">
            <span class="langues-titre">{{ t('accueil.langues') }} :</span>
            <Tag
              v-for="code in praticien.langues"
              :key="code"
              :value="t(`langues.${code}`)"
              severity="secondary"
            />
          </div>
        </template>
      </Card>
    </div>
  </section>

  <!-- Les salles, avec le nombre de réservations du jour -->
  <section class="conteneur section">
    <h2 class="titre-section">{{ t('accueil.salles') }}</h2>
    <div class="grille grille-salles">
      <div v-for="salle in sallesDuJour" :key="salle.id" class="salle" :style="{ borderTopColor: salle.couleur }">
        <Flower :color="salle.couleur" :size="36" aria-hidden="true" />
        <h3 class="salle-nom">{{ salle.nom }}</h3>
        <p class="salle-reservations">{{ t('accueil.reservationsDuJour', salle.reservations) }}</p>
      </div>
    </div>
  </section>

  <PiedDePage />
</template>

<style scoped>
/* Bandeau sur fond blanc : le logo doit toujours être sur fond clair */
.bandeau {
  background: #ffffff;
  border-bottom: 1px solid #e3e8e3;
  padding: 2rem 0;
}

.bandeau-contenu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.logo {
  width: 280px;
  max-width: 100%;
  height: auto;
}

.bandeau-contenu > div {
  flex: 1 1 320px;
  max-width: 520px;
}

.presentation {
  font-size: 1.2rem;
  margin: 0 0 1.5rem;
}

.section {
  padding-top: 2.5rem;
}

/* Tableau des horaires */
.horaires {
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  min-width: min(100%, 420px);
}

.horaires th,
.horaires td {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #e3e8e3;
  text-align: left;
}

.horaires th {
  font-weight: 600;
  text-transform: capitalize;
}

.horaires .ferme {
  color: var(--texte-doux);
  font-style: italic;
}

/* Grille de cartes qui s'adapte à la largeur de l'écran */
.grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.praticien-entete {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  background: var(--bleu-marine);
  color: #ffffff;
  flex-shrink: 0;
}

.praticien-nom {
  font-size: 1.1rem;
}

.praticien-specialite {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vert-sauge);
}

.cv {
  margin-top: 0;
}

.langues {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.langues-titre {
  color: var(--texte-doux);
  font-size: 0.9rem;
}

/* Cartes des salles, avec la couleur de la fleur en accent */
.grille-salles {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.salle {
  background: #ffffff;
  border: 1px solid #e3e8e3;
  border-top: 4px solid;
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.salle-nom {
  margin: 0.5rem 0 0.25rem;
}

.salle-reservations {
  margin: 0;
  color: var(--texte-doux);
}
</style>
