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

// Vrai si deux réservations se chevauchent dans le temps (le même jour).
// Exemple : 09:00–10:00 et 09:30–10:00 se chevauchent ; 09:00–09:30 et 09:30–10:00 non.
function seChevauchent(a, b) {
  const debutA = enMinutes(a.debut)
  const debutB = enMinutes(b.debut)
  return a.date === b.date && debutA < debutB + b.duree && debutB < debutA + a.duree
}

// Prépare un nom pour la comparaison : sans majuscules ni espaces.
// " Marie  Exemple" et "marie exemple" donnent tous deux "marieexemple".
function nomSansMajusculesNiEspaces(texte) {
  return texte.toLocaleLowerCase().replace(/\s+/g, '')
}

// Vrai si deux réservations concernent le même patient (même nom et même prénom)
function memePatient(a, b) {
  return (
    nomSansMajusculesNiEspaces(a.patientNom) === nomSansMajusculesNiEspaces(b.patientNom) &&
    nomSansMajusculesNiEspaces(a.patientPrenom) === nomSansMajusculesNiEspaces(b.patientPrenom)
  )
}

// Vérifie une nouvelle réservation avant de l'enregistrer.
// Renvoie la liste des erreurs trouvées (liste vide si tout va bien).
// Chaque erreur est un objet { cle, ... } : "cle" désigne le message à afficher
// (section "reservation.erreurs" des traductions), les autres champs le complètent.
// "maintenant" est la date et l'heure actuelles (modifiable pour les tests).
export function verifierReservation(r, maintenant = new Date()) {
  const erreurs = []

  // 1. Champs obligatoires : tous, sauf les champs patient pour un type sans patient (réunion)
  const type = typesRendezVous.find((t) => t.id === r.type)
  // (dans l'ordre du formulaire, pour que la liste des champs manquants le suive)
  const avecPatient = !type || type.patient
  const obligatoires = ['salleId', 'date', 'debut', 'duree', 'praticienId', 'type']
  if (avecPatient) obligatoires.push('patientNom', 'patientPrenom')
  obligatoires.push('motif')
  const manquants = obligatoires.filter((champ) => !String(r[champ] ?? '').trim())
  if (manquants.length > 0) erreurs.push({ cle: 'champsObligatoires', champs: manquants })

  // Sans date ni heure, on ne peut pas vérifier le reste
  if (!r.date || !r.debut || !r.duree) return erreurs

  const [annee, mois, jour] = r.date.split('-').map(Number)
  const jourChoisi = new Date(annee, mois - 1, jour)
  const debut = enMinutes(r.debut)
  const fin = debut + r.duree

  // 2. Pas de réservation un jour de fermeture (le dimanche)
  const horaires = horairesDuJour(jourChoisi)
  if (!horaires) {
    erreurs.push({ cle: 'jourFerme', jour: jourChoisi.getDay() })
  } else if (debut < enMinutes(horaires.ouverture) || fin > enMinutes(horaires.fermeture)) {
    // 3. Pas de réservation hors des horaires, y compris si elle déborde de la fermeture
    erreurs.push({
      cle: 'horsHoraires',
      debut: r.debut,
      fin: enTexte(fin),
      ouverture: horaires.ouverture,
      fermeture: horaires.fermeture
    })
  }

  // 4. Pas de réservation dans le passé (un jour passé, ou une heure déjà passée aujourd'hui)
  const debutReservation = new Date(annee, mois - 1, jour, Math.floor(debut / 60), debut % 60)
  if (debutReservation < maintenant) erreurs.push({ cle: 'passe' })

  // Réservations existantes qui se chevauchent avec la nouvelle
  const chevauchements = lireReservations().filter((autre) => seChevauchent(r, autre))

  // 5. Une salle ne peut pas avoir deux rendez-vous en même temps
  const conflitSalle = chevauchements.find((autre) => autre.salleId === r.salleId)
  if (r.salleId && conflitSalle) erreurs.push({ cle: 'salleOccupee', reservation: conflitSalle })

  // 6. Un praticien ne peut pas avoir deux rendez-vous en même temps
  const conflitPraticien = chevauchements.find((autre) => autre.praticienId === r.praticienId)
  if (r.praticienId && conflitPraticien) erreurs.push({ cle: 'praticienOccupe', reservation: conflitPraticien })

  // 7. Un patient ne peut pas avoir deux rendez-vous en même temps
  if (avecPatient && r.patientNom.trim() && r.patientPrenom.trim()) {
    const conflitPatient = chevauchements.find((autre) => autre.patientNom && memePatient(r, autre))
    if (conflitPatient) erreurs.push({ cle: 'patientOccupe', reservation: conflitPatient })
  }

  return erreurs
}
