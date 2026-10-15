// Traduction des composants PrimeVue (calendrier du DatePicker).
// Les noms des jours et des mois viennent des fichiers de traduction (section "dates").

// Met à jour la langue de PrimeVue.
// "config" vient de usePrimeVue(), "t" et "tm" de useI18n().
// tm() renvoie une liste brute ; rt() la transforme en textes.
export function traduirePrimeVue(config, t, tm, rt) {
  const liste = (cle) => tm(cle).map((texte) => rt(texte))
  Object.assign(config.locale, {
    dayNames: liste('dates.jours'),
    dayNamesShort: liste('dates.joursCourts'),
    dayNamesMin: liste('dates.joursCourts'),
    monthNames: liste('dates.mois'),
    monthNamesShort: liste('dates.moisCourts'),
    firstDayOfWeek: 1, // la semaine commence le lundi en Suisse
    dateFormat: 'dd.mm.yy', // format suisse : 17.10.2026
    today: t('agenda.aujourdhui'),
    clear: t('agenda.calendrier.effacer'),
    weekHeader: t('agenda.calendrier.semaine'),
    chooseDate: t('agenda.choisirDate'),
    chooseMonth: t('agenda.calendrier.choisirMois'),
    chooseYear: t('agenda.calendrier.choisirAnnee'),
    prevMonth: t('agenda.calendrier.moisPrecedent'),
    nextMonth: t('agenda.calendrier.moisSuivant'),
    prevYear: t('agenda.calendrier.anneePrecedente'),
    nextYear: t('agenda.calendrier.anneeSuivante')
  })
}
