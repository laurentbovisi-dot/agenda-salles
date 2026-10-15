// Configuration de l'établissement (données fictives).
// Tout ce qui décrit le centre est défini ici, une seule fois.
// Les textes à traduire (spécialités, CV, présentation) sont dans src/locales/.

// Coordonnées de l'établissement (non traduites)
export const etablissement = {
  nom: 'Centre de Soins Les Jardins du Bugnon',
  adresse: 'Rue du Bugnon 88',
  npaVille: '1011 Lausanne',
  telephone: '021 000 00 00'
}

// Les salles, dans l'ordre d'affichage.
// "couleur" reprend la couleur de la fleur dans le logo.
export const salles = [
  { id: 'lavande', nom: 'Lavande', couleur: '#7263a4' },
  { id: 'tournesol', nom: 'Tournesol', couleur: '#f5a539' },
  { id: 'bleuet', nom: 'Bleuet', couleur: '#467cc6' },
  { id: 'camelia', nom: 'Camélia', couleur: '#f07988' }
]

// Horaires d'ouverture.
// Les jours sont numérotés comme en JavaScript : 0 = dimanche, 1 = lundi, ..., 6 = samedi.
// Un jour absent de cette liste est un jour de fermeture (ici le dimanche).
export const horaires = [
  { jours: [1, 2, 3, 4, 5], ouverture: '08:00', fermeture: '18:00' },
  { jours: [6], ouverture: '08:00', fermeture: '12:00' }
]

// Durée d'un créneau de réservation, en minutes
export const dureeCreneau = 30

// Durées possibles d'une réservation, en minutes
export const durees = [30, 60, 90]

// Types de rendez-vous, avec une couleur chacun (jamais de rouge : réservé aux erreurs).
// "patient" indique si le type concerne un patient (nom et prénom demandés).
// Les icônes Lucide de chaque type sont choisies dans src/icones.js.
export const typesRendezVous = [
  { id: 'consultation', couleur: '#769971', patient: true },
  { id: 'examen', couleur: '#4f78a3', patient: true },
  { id: 'reunion', couleur: '#8a7e72', patient: false }
]

// Les praticiens.
// "id" sert de clé pour retrouver la spécialité et le CV dans les fichiers de traduction.
// "langues" contient des codes de langue (fr, de, it, en, rm), traduits à l'affichage.
export const praticiens = [
  { id: 'chappuis', titre: 'Dre', prenom: 'Anne-Laure', nom: 'Chappuis', langues: ['fr', 'de'] },
  { id: 'rochat', titre: 'Dr', prenom: 'Pierre-Alain', nom: 'Rochat', langues: ['fr', 'de', 'en'] },
  { id: 'dubuis', titre: 'Dre', prenom: 'Valérie', nom: 'Dubuis', langues: ['fr', 'it'] },
  { id: 'pasche', titre: 'Dr', prenom: 'Jean-Daniel', nom: 'Pasche', langues: ['fr', 'de'] },
  { id: 'cuendet', titre: '', prenom: 'Sophie', nom: 'Cuendet', langues: ['fr', 'en'] },
  { id: 'favre', titre: '', prenom: 'Nicolas', nom: 'Favre', langues: ['fr', 'rm'] }
]

// Langues de l'interface (code vue-i18n et nom affiché dans le sélecteur)
export const languesInterface = [
  { code: 'fr', libelle: 'Français' },
  { code: 'de', libelle: 'Deutsch' },
  { code: 'it', libelle: 'Italiano' },
  { code: 'rm', libelle: 'Rumantsch' }
]
