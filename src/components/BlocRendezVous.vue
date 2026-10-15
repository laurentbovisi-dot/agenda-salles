<script setup>
// Bloc d'un rendez-vous dans la grille de l'agenda :
// praticien, patient (ou type pour une réunion) et horaire.
// Il est teinté de la couleur de son type. Un clic émet l'événement "click".
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { typesRendezVous, dureeCreneau } from '../config.js'
import { heureFin } from '../reservations.js'
import { nomComplet, trouverPraticien } from '../praticiens.js'
import { iconesTypes } from '../icones.js'

const props = defineProps({
  reservation: { type: Object, required: true }
})

const { t } = useI18n()

const couleur = computed(() => typesRendezVous.find((type) => type.id === props.reservation.type)?.couleur)

const praticien = computed(() => {
  const p = trouverPraticien(props.reservation.praticienId)
  return p ? nomComplet(p) : ''
})

// Deuxième ligne : le patient, ou le type pour une réunion
const sousTitre = computed(() => {
  const r = props.reservation
  if (r.patientNom) return `${r.patientPrenom} ${r.patientNom}`
  return t(`reservation.types.${r.type}`)
})

const horaire = computed(() =>
  t('reservation.horaire', { debut: props.reservation.debut, fin: heureFin(props.reservation) })
)
</script>

<template>
  <button type="button" class="rendez-vous" :style="{ '--couleur-type': couleur }" :title="`${praticien} – ${sousTitre} (${horaire})`">
    <span class="praticien">
      <component :is="iconesTypes[reservation.type]" :size="14" aria-hidden="true" />
      {{ praticien }}
    </span>
    <span>{{ sousTitre }}</span>
    <!-- L'horaire n'est affiché que s'il y a la place (plus d'un créneau) -->
    <span v-if="reservation.duree > dureeCreneau" class="horaire">{{ horaire }}</span>
  </button>
</template>

<style scoped>
.rendez-vous {
  position: absolute;
  inset: 2px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  overflow: hidden;
  padding: 0.2rem 0.45rem;
  border: 0;
  border-left: 4px solid var(--couleur-type);
  border-radius: 4px;
  background: color-mix(in srgb, var(--couleur-type) 14%, white);
  color: var(--texte);
  font: inherit;
  font-size: 0.8rem;
  line-height: 1.2;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.rendez-vous:hover,
.rendez-vous:focus-visible {
  background: color-mix(in srgb, var(--couleur-type) 24%, white);
  outline: none;
}

.praticien {
  font-weight: 600;
  color: var(--bleu-marine);
}

.praticien svg {
  color: var(--couleur-type);
  vertical-align: -2px;
}

.horaire {
  color: var(--texte-doux);
}
</style>
