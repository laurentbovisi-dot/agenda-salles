<script setup>
// Page Agenda : grille d'un jour, avec une colonne par salle
// et une ligne par créneau de 30 minutes.
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import { Flower } from '@lucide/vue'
import { salles } from '../config.js'
import { formatDateLongue } from '../i18n.js'
import {
  aujourdhui,
  creneauxDuJour,
  estOuvert,
  formatHeure,
  joursFermes,
  jourOuvertVoisin
} from '../dates.js'

const { t } = useI18n()

// Jour affiché dans la grille (aujourd'hui au départ)
const jourAffiche = ref(aujourdhui())

// Valeur du sélecteur de date.
// Si le champ est vidé, on garde simplement le jour affiché.
const dateChoisie = computed({
  get: () => jourAffiche.value,
  set: (date) => {
    if (date) jourAffiche.value = date
  }
})

// Boutons de navigation : les jours de fermeture (dimanche) sont sautés
function jourPrecedent() {
  jourAffiche.value = jourOuvertVoisin(jourAffiche.value, -1)
}

function jourSuivant() {
  jourAffiche.value = jourOuvertVoisin(jourAffiche.value, +1)
}

function allerAujourdhui() {
  jourAffiche.value = aujourdhui()
}

// Vrai si le jour affiché est aujourd'hui (le bouton « Aujourd'hui » est alors désactivé)
const estAujourdhui = computed(() => jourAffiche.value.getTime() === aujourdhui().getTime())

// Date en toutes lettres, ex. « samedi 17 octobre 2026 »
const dateEnLettres = computed(() => formatDateLongue(jourAffiche.value))

// Lignes de la grille : un créneau de 30 minutes par ligne
const creneaux = computed(() => creneauxDuJour(jourAffiche.value))

</script>

<template>
  <section class="conteneur agenda">
    <h1>{{ t('agenda.titre') }}</h1>

    <!-- Barre d'outils : navigation entre les jours et choix de la date -->
    <div class="outils">
      <Button
        icon="pi pi-chevron-left"
        severity="secondary"
        outlined
        :aria-label="t('agenda.precedent')"
        v-tooltip.bottom="t('agenda.precedent')"
        @click="jourPrecedent"
      />
      <DatePicker
        v-model="dateChoisie"
        :disabled-days="joursFermes"
        :manual-input="false"
        show-icon
        icon-display="input"
        :aria-label="t('agenda.choisirDate')"
        class="choix-date"
      />
      <Button
        icon="pi pi-chevron-right"
        severity="secondary"
        outlined
        :aria-label="t('agenda.suivant')"
        v-tooltip.bottom="t('agenda.suivant')"
        @click="jourSuivant"
      />
      <Button
        :label="t('agenda.aujourdhui')"
        icon="pi pi-calendar"
        severity="secondary"
        :disabled="estAujourdhui"
        @click="allerAujourdhui"
      />
    </div>

    <!-- Date du jour affiché, en toutes lettres -->
    <h2 class="date-lettres">{{ dateEnLettres }}</h2>

    <!-- Jour de fermeture : pas de grille -->
    <p v-if="!estOuvert(jourAffiche)" class="ferme">
      <i class="pi pi-lock" aria-hidden="true"></i>
      {{ t('agenda.ferme') }}
    </p>

    <!-- Grille : une colonne par salle, une ligne par créneau -->
    <div v-else class="grille-defilement">
      <table class="grille">
        <thead>
          <tr>
            <th scope="col" class="colonne-heure">{{ t('agenda.heure') }}</th>
            <th
              v-for="salle in salles"
              :key="salle.id"
              scope="col"
              class="entete-salle"
              :style="{ borderBottomColor: salle.couleur }"
            >
              <Flower :color="salle.couleur" :size="20" aria-hidden="true" />
              {{ salle.nom }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="creneau in creneaux" :key="creneau.debut">
            <th scope="row" class="colonne-heure">{{ formatHeure(creneau.debut) }}</th>
            <td v-for="salle in salles" :key="salle.id" class="case"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.agenda {
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.agenda h1 {
  margin-top: 0;
}

.outils {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.choix-date {
  width: 11rem;
}

.date-lettres {
  margin: 1.25rem 0 1rem;
  font-size: 1.4rem;
}

.ferme {
  background: #ffffff;
  border: 1px solid #e3e8e3;
  border-radius: 8px;
  padding: 1.5rem;
  color: var(--texte-doux);
}

/* Sur petit écran, la grille défile horizontalement */
.grille-defilement {
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #e3e8e3;
  border-radius: 8px;
}

.grille {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  table-layout: fixed;
}

.grille th,
.grille td {
  border-bottom: 1px solid #edf0ed;
  border-right: 1px solid #edf0ed;
}

/* En-têtes de colonne : nom de la salle, avec sa couleur en bordure */
.grille .entete-salle {
  padding: 0.6rem;
  border-bottom: 3px solid;
  color: var(--bleu-marine);
  font-weight: 600;
  text-align: left;
}

.entete-salle svg {
  vertical-align: -4px;
  margin-right: 0.3rem;
}

/* Première colonne : heure de début du créneau */
.colonne-heure {
  width: 5rem;
  padding: 0 0.6rem;
  text-align: right;
  font-weight: 500;
  color: var(--texte-doux);
  font-variant-numeric: tabular-nums;
}

.case {
  height: 2.5rem;
}

.case:hover {
  background: var(--fond-clair);
}
</style>
