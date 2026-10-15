// Réservations enregistrées dans le navigateur (localStorage).
//
// Une réservation ressemble à :
// {
//   id: 'rmgr3k2x0a1b2c3',    identifiant unique
//   salleId: 'lavande',
//   date: '2026-10-15',       format AAAA-MM-JJ
//   debut: '09:00',
//   duree: 60,                en minutes (30, 60 ou 90)
//   praticienId: 'chappuis',
//   type: 'consultation',     consultation, examen ou reunion
//   patientNom: 'Exemple',    vide pour une réunion
//   patientPrenom: 'Marie',   vide pour une réunion
//   motif: 'Contrôle annuel'
// }
import { aujourdhui, dateIso, enMinutes, enTexte, horairesDuJour } from './dates.js'
import { typesRendezVous } from './config.js'

const CLE_RESERVATIONS = 'agenda-salles.reservations'

// Renvoie la liste de toutes les réservations (liste vide s'il n'y en a pas)
export function lireReservations() {
  try {
    return JSON.parse(localStorage.getItem(CLE_RESERVATIONS)) ?? []
  } catch {
    return []
  }
}

// Enregistre la liste complète des réservations
function ecrireReservations(liste) {
  localStorage.setItem(CLE_RESERVATIONS, JSON.stringify(liste))
}

// Crée un identifiant unique : l'heure actuelle + une partie au hasard
// (l'heure seule ne suffit pas : deux réservations créées dans la même
// milliseconde auraient le même identifiant)
function nouvelIdentifiant() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Ajoute une réservation et la renvoie avec son identifiant
export function ajouterReservation(reservation) {
  const nouvelle = { ...reservation, id: nouvelIdentifiant() }
  ecrireReservations([...lireReservations(), nouvelle])
  return nouvelle
}

// Supprime la réservation qui a cet identifiant
export function supprimerReservation(id) {
  ecrireReservations(lireReservations().filter((r) => r.id !== id))
}

// Réservations d'un jour (date au format AAAA-MM-JJ)
export function reservationsDuJour(date) {
  return lireReservations().filter((r) => r.date === date)
}

// Nombre de réservations d'une salle pour aujourd'hui
export function nombreReservationsDuJour(salleId) {
  const date = dateIso(aujourdhui())
  return lireReservations().filter((r) => r.salleId === salleId && r.date === date).length
}

// Heure de fin d'une réservation (ex. début "09:00" + 60 min = "10:00")
export function heureFin(reservation) {
  return enTexte(enMinutes(reservation.debut) + reservation.duree)
}

// Vrai si deux réservations se chevauchent dans le temps (le même jour)
function seChevauchent(a, b) {
  const debutA = enMinutes(a.debut)
  const debutB = enMinutes(b.debut)
  return a.date === b.date && debutA < debutB + b.duree && debutB < debutA + a.duree
}

// Vérifie une nouvelle réservation avant de l'enregistrer.
// Renvoie null si tout va bien, sinon un objet { cle, valeurs } décrivant l'erreur
// ("cle" est une clé de traduction dans la section "reservation.erreurs").
export function verifierReservation(r) {
  // Champs obligatoires (les champs patient seulement si le type concerne un patient)
  const type = typesRendezVous.find((t) => t.id === r.type)
  const champs = [r.salleId, r.date, r.debut, r.duree, r.praticienId, r.type]
  if (type?.patient) champs.push(r.patientNom.trim(), r.patientPrenom.trim())
  if (champs.some((valeur) => !valeur)) return { cle: 'champsObligatoires' }

  // Le centre doit être ouvert ce jour-là
  const [annee, mois, jour] = r.date.split('-').map(Number)
  const horaires = horairesDuJour(new Date(annee, mois - 1, jour))
  if (!horaires) return { cle: 'jourFerme' }

  // La réservation doit se terminer avant la fermeture
  if (enMinutes(r.debut) + r.duree > enMinutes(horaires.fermeture)) {
    return { cle: 'horsHoraires', valeurs: { heure: horaires.fermeture } }
  }

  // La salle ne doit pas être déjà réservée sur ce créneau
  const autres = lireReservations().filter((autre) => seChevauchent(r, autre))
  if (autres.some((autre) => autre.salleId === r.salleId)) return { cle: 'salleOccupee' }

  // Le praticien ne peut pas être à deux endroits en même temps
  if (autres.some((autre) => autre.praticienId === r.praticienId)) return { cle: 'praticienOccupe' }

  return null
}
