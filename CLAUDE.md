# Agenda des salles – démo

## Établissement (fictif)
- Centre de Soins Les Jardins du Bugnon, Rue du Bugnon 88, 1011 Lausanne, tél. 021 000 00 00.
- Salles : Lavande, Tournesol, Bleuet, Camélia (dans cet ordre). Définies une seule fois dans un fichier de configuration.
- Horaires d'ouverture (dans le même fichier de configuration) :
  - lundi à vendredi : 8h–18h ;
  - samedi : 8h–12h ;
  - dimanche : fermé.
- Créneaux de 30 minutes.
- Praticiens (fictifs, dans le même fichier de configuration), avec un court CV :
  - Dre Anne-Laure Chappuis – médecine générale. Diplômée de l'Université de Lausanne, 15 ans d'expérience en cabinet. Langues : français, allemand.
  - Dr Pierre-Alain Rochat – cardiologie. Formé à Lausanne et Berne, spécialiste de la prévention cardiovasculaire. Langues : français, allemand, anglais.
  - Dre Valérie Dubuis – pédiatrie. Formée à Genève, suivi des enfants de 0 à 16 ans. Langues : français, italien.
  - Dr Jean-Daniel Pasche – dermatologie. Formé à Lausanne et Zurich, dermatologie générale et dépistage. Langues : français, allemand.
  - Sophie Cuendet – physiothérapie. Diplômée de la HESAV, rééducation du sport et du dos. Langues : français, anglais.
  - Nicolas Favre – infirmier. Diplômé de l'Institut La Source, soins ambulatoires et vaccinations. Langues : français, romanche.
- Présentation de l'établissement : centre de soins pluridisciplinaire au cœur de Lausanne, proche du CHUV, accessible en métro (ligne M2).

## Logo
- public/logo.png : logo complet (fond transparent), pour le bandeau de la page d'accueil.
- public/logo-embleme.png : emblème sans texte, pour la barre de navigation.
- public/favicon.png : icône de l'onglet du navigateur.
- Toujours afficher le logo sur fond blanc ou très clair.

## Technique
- Framework : Vue 3 (Composition API, <script setup>) avec Vite.
- Interface : PrimeVue, thème Aura, couleur principale bleu marine du logo (#173855), couleur secondaire vert sauge (#769971).
- Mode clair uniquement (le logo n'est pas lisible sur fond sombre).
- Icônes : PrimeIcons pour l'interface ; Lucide uniquement pour les icônes métier (types de rendez-vous, salles).
- Traductions : vue-i18n.
- Navigation : Vue Router en mode hash (createWebHashHistory), pour GitHub Pages.
- Stockage : localStorage du navigateur.
- Hébergement : GitHub Pages, déployé par une GitHub Action.
- Pas d'autre dépendance sans me demander.

## Règles
- Langues de l'interface : les 4 langues nationales suisses — français (par défaut), allemand, italien, romanche.
  - Traductions avec vue-i18n, un fichier par langue (fr, de, it, rm).
  - Sélecteur de langue dans la barre de navigation ; choix mémorisé dans localStorage.
  - Dates et heures au format local suisse (fr-CH, de-CH, it-CH, rm-CH).
  - Les noms des salles et de l'établissement ne sont pas traduits.
- Couleurs : rouge réservé aux erreurs ; une couleur par type de rendez-vous.
- Chaque salle reprend la couleur de sa fleur dans le logo, en accent discret (icône, bordure de l'en-tête de colonne) : Lavande #7263a4, Tournesol #f5a539, Bleuet #467cc6, Camélia #f07988.
- Données fictives uniquement, jamais de données patients réelles.
- Code simple et commenté, lisible par un débutant.
- Toutes les modifications sont faites et poussées directement sur la branche `main` (pas de branche de fonctionnalité, pas de pull request).
- Le fichier `docs/journal.md` est mis à jour, dans le même commit, à chaque changement majeur du site, investigation ou erreur rencontrée (entrées les plus récentes en haut).
