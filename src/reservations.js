// Lecture des réservations enregistrées dans le navigateur (localStorage).
// Une réservation ressemble à : { salleId: 'lavande', date: '2026-10-15', debut: '09:00', fin: '09:30' }

import { aujourdhui, dateIso } from './dates.js'

const CLE_RESERVATIONS = 'agenda-salles.reservations'

// Renvoie la liste de toutes les réservations (liste vide s'il n'y en a pas)
export function lireReservations() {
  try {
    return JSON.parse(localStorage.getItem(CLE_RESERVATIONS)) ?? []
  } catch {
    return []
  }
}

// Nombre de réservations d'une salle pour aujourd'hui
export function nombreReservationsDuJour(salleId) {
  const date = dateIso(aujourdhui())
  return lireReservations().filter((r) => r.salleId === salleId && r.date === date).length
}
