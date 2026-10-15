// Fonctions utiles pour manipuler les dates et les horaires d'ouverture.
import { horaires, dureeCreneau } from './config.js'

// Horaires du jour d'une date (ex. { ouverture: '08:00', fermeture: '18:00' }),
// ou "undefined" si le centre est fermé ce jour-là (ex. le dimanche)
export function horairesDuJour(date) {
  return horaires.find((h) => h.jours.includes(date.getDay()))
}

// Vrai si le centre est ouvert ce jour-là
export function estOuvert(date) {
  return horairesDuJour(date) !== undefined
}

// Numéros des jours de fermeture (0 = dimanche), pour le DatePicker
export const joursFermes = [0, 1, 2, 3, 4, 5, 6].filter(
  (jour) => !horaires.some((h) => h.jours.includes(jour))
)

// Date d'aujourd'hui, à minuit
export function aujourdhui() {
  const maintenant = new Date()
  return new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate())
}

// Ajoute (ou retire, si "nombre" est négatif) des jours à une date
export function ajouterJours(date, nombre) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + nombre)
}

// Prochain jour d'ouverture, avant (sens = -1) ou après (sens = +1) une date.
// Les jours de fermeture (dimanche) sont sautés.
export function jourOuvertVoisin(date, sens) {
  let jour = ajouterJours(date, sens)
  while (!estOuvert(jour)) {
    jour = ajouterJours(jour, sens)
  }
  return jour
}

// Date au format AAAA-MM-JJ (format utilisé pour enregistrer les réservations)
export function dateIso(date) {
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mois}-${jour}`
}

// Convertit "08:30" en nombre de minutes depuis minuit (510)
export function enMinutes(texte) {
  const [h, m] = texte.split(':').map(Number)
  return h * 60 + m
}

// Convertit un nombre de minutes depuis minuit (510) en "08:30"
export function enTexte(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m}`
}

// Liste des créneaux d'un jour, selon ses horaires d'ouverture.
// Exemple : [{ debut: '08:00', fin: '08:30' }, { debut: '08:30', fin: '09:00' }, ...]
// Liste vide si le centre est fermé.
export function creneauxDuJour(date) {
  const h = horairesDuJour(date)
  if (!h) return []
  const creneaux = []
  for (let debut = enMinutes(h.ouverture); debut + dureeCreneau <= enMinutes(h.fermeture); debut += dureeCreneau) {
    creneaux.push({ debut: enTexte(debut), fin: enTexte(debut + dureeCreneau) })
  }
  return creneaux
}

// Heure affichée : en Suisse, les 4 langues écrivent les heures de la même façon
// (24 heures, ex. "08:30"), donc on garde simplement le texte de la configuration.
export function formatHeure(texte) {
  return texte
}
