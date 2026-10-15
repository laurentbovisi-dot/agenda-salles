<script setup>
// Formulaire de réservation, affiché dans une fenêtre (Dialog).
// La page Agenda l'ouvre avec des valeurs de départ (salle, date, heure)
// et reçoit l'événement "enregistree" quand une réservation est créée.
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { Flower } from '@lucide/vue'
import { salles, praticiens, durees, typesRendezVous } from '../config.js'
import { creneauxDuJour, dateIso, joursFermes } from '../dates.js'
import { ajouterReservation, verifierReservation } from '../reservations.js'
import { nomComplet } from '../praticiens.js'
import { iconesTypes } from '../icones.js'

// "visible" : fenêtre ouverte ou fermée (utilisé avec v-model:visible)
// "depart" : valeurs de départ, ex. { salleId: 'lavande', date: new Date(), debut: '09:00' }
const visible = defineModel('visible', { type: Boolean })
const props = defineProps({
  depart: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['enregistree'])

const { t } = useI18n()

// Valeurs du formulaire
const formulaire = ref({})
// Message d'erreur affiché en rouge (null s'il n'y en a pas)
const erreur = ref(null)

// À chaque ouverture, on repart d'un formulaire neuf avec les valeurs de départ
watch(visible, (ouvert) => {
  if (!ouvert) return
  erreur.value = null
  formulaire.value = {
    salleId: props.depart.salleId ?? null,
    date: props.depart.date ?? null,
    debut: props.depart.debut ?? null,
    duree: durees[0],
    praticienId: null,
    type: typesRendezVous[0].id,
    patientNom: '',
    patientPrenom: '',
    motif: ''
  }
})

// Heures de début possibles : les créneaux du jour choisi
const heuresPossibles = computed(() => {
  if (!formulaire.value.date) return []
  return creneauxDuJour(formulaire.value.date).map((c) => c.debut)
})

// Si l'heure choisie n'existe pas le nouveau jour (ex. 14:00 un samedi), on l'efface
watch(heuresPossibles, (heures) => {
  if (!heures.includes(formulaire.value.debut)) formulaire.value.debut = null
})

// Listes de choix, traduites
const choixDurees = computed(() =>
  durees.map((d) => ({ valeur: d, libelle: t('reservation.minutes', { n: d }) }))
)
const choixTypes = computed(() =>
  typesRendezVous.map((type) => ({ ...type, libelle: t(`reservation.types.${type.id}`) }))
)
const choixPraticiens = computed(() =>
  praticiens.map((p) => ({
    id: p.id,
    libelle: nomComplet(p),
    specialite: t(`praticiens.${p.id}.specialite`)
  }))
)

// Les champs patient ne sont affichés que pour les types qui concernent un patient
const avecPatient = computed(
  () => typesRendezVous.find((type) => type.id === formulaire.value.type)?.patient ?? true
)

// Validation du formulaire
function enregistrer() {
  const f = formulaire.value
  const reservation = {
    salleId: f.salleId,
    date: f.date ? dateIso(f.date) : null,
    debut: f.debut,
    duree: f.duree,
    praticienId: f.praticienId,
    type: f.type,
    // Pour une réunion, on n'enregistre aucune donnée patient
    patientNom: avecPatient.value ? f.patientNom.trim() : '',
    patientPrenom: avecPatient.value ? f.patientPrenom.trim() : '',
    motif: f.motif.trim()
  }

  const probleme = verifierReservation(reservation)
  if (probleme) {
    erreur.value = t(`reservation.erreurs.${probleme.cle}`, probleme.valeurs ?? {})
    return
  }

  const nouvelle = ajouterReservation(reservation)
  visible.value = false
  emit('enregistree', nouvelle)
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('reservation.titreFormulaire')"
    :style="{ width: '34rem' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <form class="formulaire" @submit.prevent="enregistrer">
      <!-- Salle -->
      <div class="champ">
        <label for="res-salle">{{ t('reservation.salle') }}</label>
        <Select
          v-model="formulaire.salleId"
          input-id="res-salle"
          :options="salles"
          option-label="nom"
          option-value="id"
          :placeholder="t('reservation.choisir')"
        >
          <template #option="{ option }">
            <Flower :color="option.couleur" :size="16" aria-hidden="true" class="icone" />
            {{ option.nom }}
          </template>
        </Select>
      </div>

      <!-- Date et heure de début, côte à côte -->
      <div class="ligne">
        <div class="champ">
          <label for="res-date">{{ t('reservation.date') }}</label>
          <DatePicker
            v-model="formulaire.date"
            input-id="res-date"
            :disabled-days="joursFermes"
            :manual-input="false"
            show-icon
            icon-display="input"
          />
        </div>
        <div class="champ">
          <label for="res-debut">{{ t('reservation.heureDebut') }}</label>
          <Select
            v-model="formulaire.debut"
            input-id="res-debut"
            :options="heuresPossibles"
            :placeholder="t('reservation.choisir')"
          />
        </div>
      </div>

      <!-- Durée -->
      <div class="champ">
        <span class="etiquette" id="res-duree">{{ t('reservation.duree') }}</span>
        <SelectButton
          v-model="formulaire.duree"
          :options="choixDurees"
          option-label="libelle"
          option-value="valeur"
          :allow-empty="false"
          aria-labelledby="res-duree"
        />
      </div>

      <!-- Praticien, avec sa spécialité -->
      <div class="champ">
        <label for="res-praticien">{{ t('reservation.praticien') }}</label>
        <Select
          v-model="formulaire.praticienId"
          input-id="res-praticien"
          :options="choixPraticiens"
          option-label="libelle"
          option-value="id"
          :placeholder="t('reservation.choisir')"
        >
          <template #option="{ option }">
            <div>
              <div>{{ option.libelle }}</div>
              <small class="specialite">{{ option.specialite }}</small>
            </div>
          </template>
        </Select>
      </div>

      <!-- Type de rendez-vous -->
      <div class="champ">
        <span class="etiquette" id="res-type">{{ t('reservation.type') }}</span>
        <SelectButton
          v-model="formulaire.type"
          :options="choixTypes"
          option-label="libelle"
          option-value="id"
          :allow-empty="false"
          aria-labelledby="res-type"
        >
          <template #option="{ option }">
            <component :is="iconesTypes[option.id]" :color="option.couleur" :size="16" aria-hidden="true" />
            {{ option.libelle }}
          </template>
        </SelectButton>
      </div>

      <!-- Patient : masqué pour une réunion -->
      <div v-if="avecPatient" class="ligne">
        <div class="champ">
          <label for="res-nom">{{ t('reservation.patientNom') }}</label>
          <InputText id="res-nom" v-model="formulaire.patientNom" autocomplete="off" />
        </div>
        <div class="champ">
          <label for="res-prenom">{{ t('reservation.patientPrenom') }}</label>
          <InputText id="res-prenom" v-model="formulaire.patientPrenom" autocomplete="off" />
        </div>
      </div>

      <!-- Motif (facultatif) -->
      <div class="champ">
        <label for="res-motif">
          {{ t('reservation.motif') }} <small>({{ t('reservation.facultatif') }})</small>
        </label>
        <Textarea id="res-motif" v-model="formulaire.motif" rows="2" auto-resize />
      </div>

      <!-- Erreur de validation (en rouge) -->
      <Message v-if="erreur" severity="error" icon="pi pi-exclamation-circle">{{ erreur }}</Message>

      <div class="boutons">
        <Button :label="t('reservation.annuler')" severity="secondary" text @click="visible = false" />
        <Button type="submit" :label="t('reservation.enregistrer')" icon="pi pi-check" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.champ {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.champ label,
.etiquette {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Deux champs côte à côte (l'un sous l'autre sur petit écran) */
.ligne {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.ligne .champ {
  flex: 1 1 12rem;
}

.icone {
  margin-right: 0.4rem;
  vertical-align: -3px;
}

.specialite {
  color: var(--texte-doux);
}

.boutons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
