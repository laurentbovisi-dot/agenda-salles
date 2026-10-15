# Journal du projet agenda-salles

Ce journal recense, par ordre chronologique (le plus récent en haut), les changements majeurs du site, les investigations menées et les erreurs rencontrées.

Chaque entrée suit ce format :

- **Date** et **type** : Changement, Investigation ou Erreur
- **Description** : ce qui a été fait ou constaté
- **Détails** : fichiers concernés, cause, solution, décisions prises

---

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
