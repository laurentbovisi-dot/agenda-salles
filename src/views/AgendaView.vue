<script setup>
// Page Agenda : grille d'un jour, avec une colonne par salle
// et une ligne par créneau de 30 minutes.
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import { Flower } from '@lucide/vue'
import FormulaireReservation from '../components/FormulaireReservation.vue'
import BlocRendezVous from '../components/BlocRendezVous.vue'
import { salles, typesRendezVous, dureeCreneau } from '../config.js'
import { formatDateLongue } from '../i18n.js'
import {
  aujourdhui,
  creneauxDuJour,
  dateIso,
  estOuvert,
  formatHeure,
  joursFermes,
  jourOuvertVoisin
} from '../dates.js'
import { reservationsDuJour, supprimerReservation, heureFin } from '../reservations.js'
import { nomComplet, trouverPraticien } from '../praticiens.js'
import { iconesTypes } from '../icones.js'

const { t } = useI18n()
const toast = useToast()

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

// --- Réservations ---

// Compteur incrémenté à chaque ajout ou suppression,
// pour que Vue relise les réservations dans le localStorage
const version = ref(0)

// Réservations du jour affiché
const reservations = computed(() => {
  version.value // lu pour recalculer après un ajout ou une suppression
  return reservationsDuJour(dateIso(jourAffiche.value))
})

// Contenu de chaque case de la grille, rangé par heure puis par salle.
// Une case peut être :
//  - { etat: 'libre' } : rien de réservé ;
//  - { etat: 'debut', reservation, lignes } : une réservation commence ici
//    et s'étend sur "lignes" créneaux ;
//  - { etat: 'occupee' } : couverte par une réservation commencée plus haut
//    (on n'affiche pas de case, la réservation la recouvre déjà).
const cases = computed(() => {
  const tableau = {}
  for (const creneau of creneaux.value) {
    tableau[creneau.debut] = {}
    for (const salle of salles) tableau[creneau.debut][salle.id] = { etat: 'libre' }
  }
  for (const r of reservations.value) {
    const lignes = r.duree / dureeCreneau
    const indexDebut = creneaux.value.findIndex((c) => c.debut === r.debut)
    if (indexDebut === -1) continue // réservation hors des horaires du jour : ignorée
    for (let i = 0; i < lignes && indexDebut + i < creneaux.value.length; i++) {
      const heure = creneaux.value[indexDebut + i].debut
      tableau[heure][r.salleId] = i === 0 ? { etat: 'debut', reservation: r, lignes } : { etat: 'occupee' }
    }
  }
  return tableau
})

// Couleur d'un type de rendez-vous
function couleurType(typeId) {
  return typesRendezVous.find((type) => type.id === typeId)?.couleur
}

// Nom du praticien d'une réservation
function nomPraticien(reservation) {
  const praticien = trouverPraticien(reservation.praticienId)
  return praticien ? nomComplet(praticien) : ''
}

// Horaire d'une réservation, ex. « 09:00 – 10:00 »
function horaire(reservation) {
  return t('reservation.horaire', { debut: reservation.debut, fin: heureFin(reservation) })
}

// --- Formulaire de réservation ---

const formulaireVisible = ref(false)
const valeursDepart = ref({})

// Ouvre le formulaire, éventuellement pré-rempli (clic sur une case libre)
function ouvrirFormulaire(salleId = null, debut = null) {
  valeursDepart.value = { salleId, debut, date: estOuvert(jourAffiche.value) ? jourAffiche.value : null }
  formulaireVisible.value = true
}

// Après l'enregistrement : afficher le jour de la réservation et rafraîchir la grille
function apresEnregistrement(reservation) {
  const [annee, mois, jour] = reservation.date.split('-').map(Number)
  jourAffiche.value = new Date(annee, mois - 1, jour)
  version.value++
  toast.add({ severity: 'success', summary: t('reservation.enregistree'), life: 3000 })
}

// --- Détails et suppression d'une réservation ---

const reservationChoisie = ref(null)

const detailsVisible = computed({
  get: () => reservationChoisie.value !== null,
  set: (ouvert) => {
    if (!ouvert) reservationChoisie.value = null
  }
})

function supprimer() {
  supprimerReservation(reservationChoisie.value.id)
  reservationChoisie.value = null
  version.value++
  toast.add({ severity: 'info', summary: t('reservation.supprimee'), life: 3000 })
}

// Nom de la salle d'une réservation
function nomSalle(reservation) {
  return salles.find((s) => s.id === reservation.salleId)?.nom
}

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
      <Button
        :label="t('reservation.nouvelle')"
        icon="pi pi-plus"
        class="bouton-nouvelle"
        @click="ouvrirFormulaire()"
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
            <template v-for="salle in salles" :key="salle.id">
              <!-- Case libre : un clic ouvre le formulaire pré-rempli -->
              <td v-if="cases[creneau.debut][salle.id].etat === 'libre'" class="case">
                <button
                  type="button"
                  class="case-libre"
                  :aria-label="t('reservation.reserverCreneau', { salle: salle.nom, heure: creneau.debut })"
                  @click="ouvrirFormulaire(salle.id, creneau.debut)"
                ></button>
              </td>
              <!-- Début d'une réservation : la case s'étend sur toute sa durée -->
              <td
                v-else-if="cases[creneau.debut][salle.id].etat === 'debut'"
                class="case"
                :rowspan="cases[creneau.debut][salle.id].lignes"
              >
                <BlocRendezVous
                  :reservation="cases[creneau.debut][salle.id].reservation"
                  @click="reservationChoisie = cases[creneau.debut][salle.id].reservation"
                />
              </td>
              <!-- Case "occupee" : rien à afficher, la réservation du dessus la recouvre -->
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulaire de nouvelle réservation -->
    <FormulaireReservation
      v-model:visible="formulaireVisible"
      :depart="valeursDepart"
      @enregistree="apresEnregistrement"
    />

    <!-- Détails d'une réservation, avec le bouton de suppression -->
    <Dialog
      v-model:visible="detailsVisible"
      modal
      :header="t('reservation.details')"
      :style="{ width: '26rem' }"
      :breakpoints="{ '640px': '95vw' }"
    >
      <dl v-if="reservationChoisie" class="details">
        <dt>{{ t('reservation.type') }}</dt>
        <dd>
          <component
            :is="iconesTypes[reservationChoisie.type]"
            :color="couleurType(reservationChoisie.type)"
            :size="16"
            aria-hidden="true"
          />
          {{ t(`reservation.types.${reservationChoisie.type}`) }}
        </dd>
        <dt>{{ t('reservation.salle') }}</dt>
        <dd>{{ nomSalle(reservationChoisie) }}</dd>
        <dt>{{ t('reservation.date') }}</dt>
        <dd>{{ dateEnLettres }}, {{ horaire(reservationChoisie) }}</dd>
        <dt>{{ t('reservation.praticien') }}</dt>
        <dd>{{ nomPraticien(reservationChoisie) }}</dd>
        <template v-if="reservationChoisie.patientNom">
          <dt>{{ t('reservation.patient') }}</dt>
          <dd>{{ reservationChoisie.patientPrenom }} {{ reservationChoisie.patientNom }}</dd>
        </template>
        <template v-if="reservationChoisie.motif">
          <dt>{{ t('reservation.motif') }}</dt>
          <dd>{{ reservationChoisie.motif }}</dd>
        </template>
      </dl>
      <template #footer>
        <Button :label="t('reservation.fermer')" severity="secondary" text @click="detailsVisible = false" />
        <Button :label="t('reservation.supprimer')" icon="pi pi-trash" severity="secondary" @click="supprimer" />
      </template>
    </Dialog>
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
  height: 2.75rem;
  padding: 0;
  position: relative;
}

/* Case libre : bouton invisible qui occupe toute la case */
.case-libre {
  position: absolute;
  inset: 0;
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.case-libre:hover,
.case-libre:focus-visible {
  background: var(--fond-clair);
  box-shadow: inset 0 0 0 2px #d5e0ec;
  outline: none;
}

/* Bouton « Nouvelle réservation » poussé à droite */
.bouton-nouvelle {
  margin-left: auto;
}

/* Fenêtre de détails */
.details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
}

.details dt {
  font-weight: 600;
  color: var(--texte-doux);
}

.details dd {
  margin: 0;
}

.details dd svg {
  vertical-align: -3px;
}
</style>
