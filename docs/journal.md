# Journal du projet agenda-salles

Ce journal recense, par ordre chronologique (le plus récent en haut), les changements majeurs du site, les investigations menées et les erreurs rencontrées.

Chaque entrée suit ce format :

- **Date** et **type** : Changement, Investigation ou Erreur
- **Description** : ce qui a été fait ou constaté
- **Détails** : fichiers concernés, cause, solution, décisions prises

---

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
