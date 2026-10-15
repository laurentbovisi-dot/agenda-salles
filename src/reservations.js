// Lecture des réservations enregistrées dans le navigateur (localStorage).
// Une réservation ressemble à : { salleId: 'lavande', date: '2026-10-15', debut: '09:00', fin: '09:30' }

const CLE_RESERVATIONS = 'agenda-salles.reservations'

// Renvoie la liste de toutes les réservations (liste vide s'il n'y en a pas)
export function lireReservations() {
  try {
    return JSON.parse(localStorage.getItem(CLE_RESERVATIONS)) ?? []
  } catch {
    return []
  }
}

// Date du jour au format AAAA-MM-JJ, selon l'heure locale
export function dateDuJour() {
  const maintenant = new Date()
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0')
  const jour = String(maintenant.getDate()).padStart(2, '0')
  return `${maintenant.getFullYear()}-${mois}-${jour}`
}

// Nombre de réservations d'une salle pour aujourd'hui
export function nombreReservationsDuJour(salleId) {
  const aujourdhui = dateDuJour()
  return lireReservations().filter((r) => r.salleId === salleId && r.date === aujourdhui).length
}
