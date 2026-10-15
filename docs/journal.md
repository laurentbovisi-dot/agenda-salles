# Journal du projet agenda-salles

Ce journal recense, par ordre chronologique (le plus récent en haut), les changements majeurs du site, les investigations menées et les erreurs rencontrées.

Chaque entrée suit ce format :

- **Date** et **type** : Changement, Investigation ou Erreur
- **Description** : ce qui a été fait ou constaté
- **Détails** : fichiers concernés, cause, solution, décisions prises

---

## 2026-10-15 — Changement : grille quotidienne de l'agenda

- **Description** : la page Agenda affiche une grille d'un jour : une colonne par salle (en-tête avec la fleur Lucide et une bordure à la couleur de la salle), une ligne par créneau de 30 minutes selon les horaires du jour (20 lignes en semaine, 8 le samedi). Au-dessus : boutons « jour précédent » / « jour suivant » (qui sautent les jours de fermeture), DatePicker PrimeVue (dimanches désactivés, format 17.10.2026, semaine commençant le lundi), bouton « Aujourd'hui » (désactivé si on y est déjà), et la date en toutes lettres (« samedi 17 octobre 2026 »). Un jour de fermeture affiche « Le centre est fermé ce jour-là. » au lieu de la grille.
- **Détails** :
  - Nouveau `src/dates.js` : horaires du jour, jours de fermeture (calculés depuis `horaires`, donc `joursFermes` a été retiré de `config.js`), jour ouvert précédent/suivant, liste des créneaux.
  - Nouveau `src/localePrimeVue.js` : traduction du calendrier PrimeVue, appliquée dans `App.vue` à chaque changement de langue.
  - Infobulles PrimeVue (`v-tooltip`) enregistrées dans `main.js`.
  - La page Agenda est chargée à la demande (`import()` dans `router.js`) ; le seuil d'alerte de taille de Vite est relevé à 600 ko (Vue + PrimeVue + vue-i18n ≈ 500 ko, 130 ko compressés : rien d'anormal après analyse).
  - Testé dans Chromium avec une date simulée : samedi → suivant = lundi, lundi → précédent = samedi, dimanche grisé dans le calendrier, dimanche affiché comme fermé, changement de langue en direct, affichage mobile (la grille défile horizontalement).

## 2026-10-15 — Erreur : dates en anglais en romanche, virgule en trop en français

- **Constat** : avec `Intl.DateTimeFormat`, la date française sortait « samedi, 17 octobre 2026 » (avec une virgule), et en romanche tout s'affichait en anglais (« Wednesday, October 21, 2026 »), y compris les horaires de la page d'accueil.
- **Cause** : Chromium n'inclut pas les données de langue du romanche (`rm-CH`) et se rabat sur l'anglais (Node.js, lui, les connaît : le problème n'apparaît que dans le navigateur).
- **Solution** : les noms des jours et des mois, ainsi que le modèle de date longue de chaque langue (`dates.dateLongue`), sont maintenant dans les fichiers de traduction (section `dates`). `formatDateLongue()` et `nomDuJour()` sont dans `src/i18n.js`. Les heures restent au format 24 h « 08:30 », identique dans les 4 langues. Le champ `format` (fr-CH…) de `languesInterface` dans `config.js`, devenu inutile, a été retiré.

## 2026-10-15 — Erreur : premier déploiement GitHub Pages refusé

- **Description** : la première exécution de l'action « Déploiement GitHub Pages » a compilé le site sans problème (étape `build` réussie), mais l'étape `deploy` a échoué avec `HttpError: Not Found` (404, « Ensure GitHub Pages has been enabled »).
- **Cause** : GitHub Pages n'est pas encore activé sur le dépôt.
- **Solution** : dans Settings → Pages, choisir la source « GitHub Actions », puis relancer l'action (Actions → Déploiement GitHub Pages → Re-run jobs) ou pousser un nouveau commit.
- **Remarque** : GitHub avertit que `actions/deploy-pages@v4` cible Node.js 20, désormais déprécié (exécuté de force sous Node.js 24). Sans conséquence pour l'instant ; à mettre à jour quand une nouvelle version majeure sera publiée.

## 2026-10-15 — Changement : initialisation du projet Vue 3

- **Description** : création du site Vue 3 + Vite avec PrimeVue (thème Aura, bleu marine #173855), Vue Router (mode hash), vue-i18n (fr, de, it, rm) et Lucide. Deux pages : Accueil (`/`) et Agenda (`/agenda`, contenu à venir), avec une barre de navigation commune (emblème, nom, liens, sélecteur de langue mémorisé dans localStorage).
- **Détails** :
  - Accueil : bandeau (logo, présentation, bouton « Réserver une salle »), horaires lus depuis la configuration, cartes des praticiens (avatar à initiales, spécialité, CV, langues), 4 salles (icône `Flower` de Lucide à la couleur de la fleur, nombre de réservations du jour lu dans localStorage), pied de page.
  - `src/config.js` : établissement, salles, horaires, créneaux de 30 min, praticiens, langues de l'interface.
  - `src/locales/*.json` : tous les textes traduits, y compris spécialités et CV (clé = identifiant du praticien). Écart volontaire avec « CV dans le fichier de configuration » : les textes traduisibles restent dans les fichiers de langue.
  - `.github/workflows/deploy.yml` : compilation et publication sur GitHub Pages à chaque push sur `main` ; `base` de Vite = `/agenda-salles/`.
  - `npm run build` réussi ; rendu vérifié dans Chromium (bureau et mobile, français et allemand), sans erreur dans la console.
- **À faire** : dans les réglages du dépôt (Settings → Pages), choisir « GitHub Actions » comme source, sinon le déploiement échoue. Faire relire les traductions allemandes, italiennes et surtout romanches (rédigées automatiquement).

## 2026-10-15 — Investigation : versions des dépendances

- **PrimeVue 5** (dernière version) n'est plus sous licence MIT : elle exige une clé de licence (licence « PrimeUI »), sans quoi un avertissement de licence peut s'afficher. **Décision** : utiliser PrimeVue 4.5 (MIT), avec `@primeuix/themes` 2.x et `primeicons` 7.x (MIT, la version 8 change aussi de licence).
- **lucide-vue-next** est déprécié : remplacé par le paquet officiel `@lucide/vue`.

## 2026-10-15 — Changement : création du journal

- **Description** : ajout de ce fichier `docs/journal.md` pour documenter l'évolution du site.
- **Détails** : ajout de deux règles à la fin de la section « Règles » du `CLAUDE.md` : travail direct sur `main` et mise à jour obligatoire de ce journal.

## 2026-10-15 — Changement : ajout du cahier des charges et des logos

- **Description** : ajout manuel (téléversement sur GitHub) du fichier `CLAUDE.md`, qui décrit l'établissement fictif, les salles, les praticiens, la pile technique et les règles, ainsi que des logos dans `public/` (`logo.png`, `logo-embleme.png`, `favicon.png`).
- **Erreur rencontrée** : le premier push du journal a été refusé (non fast-forward) car ce téléversement avait modifié `main` entre-temps, et la version locale du `CLAUDE.md` entrait en conflit. Solution : récupération de `main`, conservation du `CLAUDE.md` téléversé et ajout des deux nouvelles règles à la fin.

## 2026-10-15 — Décision : travail directement sur `main`

- **Description** : toutes les modifications sont faites et poussées directement sur la branche `main`, sans branche de fonctionnalité ni pull request.

## 2026-10-15 — Changement : création du site vide

- **Description** : premier commit du dépôt, qui crée la branche `main`.
- **Détails** : `index.html` est une page HTML5 minimale (langue `fr`, encodage UTF-8, titre « Agenda des salles », corps vide).
