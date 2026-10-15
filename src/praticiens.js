// Petites fonctions d'affichage des praticiens
import { praticiens } from './config.js'

// Retrouve un praticien à partir de son identifiant
export function trouverPraticien(id) {
  return praticiens.find((p) => p.id === id)
}

// Nom complet avec le titre éventuel (ex. "Dre Anne-Laure Chappuis")
export function nomComplet(praticien) {
  return [praticien.titre, praticien.prenom, praticien.nom].filter(Boolean).join(' ')
}

// Initiales, pour l'avatar (ex. "AC" pour Anne-Laure Chappuis)
export function initiales(praticien) {
  return praticien.prenom[0] + praticien.nom[0]
}
