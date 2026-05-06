import { type Locale } from "@lib/i18n/routing";

export type LocaleCopy = Record<Locale, string>;

export const t = (locale: Locale, dict: LocaleCopy): string => dict[locale];

/** All redesign-only strings live here so we can extract to JSON later. */
export const COPY = {
  freeEntry: {
    nl: "Gratis inkom",
    fr: "Entrée libre",
    en: "Free entry",
  },
  edition: {
    nl: "Editie",
    fr: "Édition",
    en: "Edition",
  },
  scroll: {
    nl: "Scroll naar beneden",
    fr: "Scroller vers le bas",
    en: "Scroll down",
  },
  daysAway: {
    nl: "tot we doorgaan",
    fr: "avant le festival",
    en: "until the festival",
  },
  ticker: {
    nl: [
      "Gratis inkom",
      "Drie dagen",
      "Live muziek",
      "Petanque",
      "Paella",
      "Zin in zomer",
    ],
    fr: [
      "Entrée libre",
      "Trois jours",
      "Musique live",
      "Pétanque",
      "Paella",
      "Envie d'été",
    ],
    en: [
      "Free entry",
      "Three days",
      "Live music",
      "Pétanque",
      "Paella",
      "Bring on summer",
    ],
  },
  introEyebrow: {
    nl: "Wat is Zomaar Zomert?",
    fr: "Qu'est-ce que Zomaar Zomert?",
    en: "What is Zomaar Zomert?",
  },
  introTitle: {
    nl: "Een dorpsfeest met festivalallure.",
    fr: "Une fête de village au cachet festival.",
    en: "A village fête with festival vibes.",
  },
  introBody: {
    nl: "Het laatste weekend van juli neemt de Sint-Anna-Pedekerk in Itterbeek drie dagen lang vrij. Live muziek, koud bier, paella, petanque en duizenden vrienden die nog komen. Geen tickets, geen polsbandjes — gewoon binnenstappen en zomeren tot de zon onder gaat.",
    fr: "Le dernier week-end de juillet, l'église Sainte-Anne d'Itterbeek prend trois jours de congé. Musique live, bière fraîche, paella, pétanque et des milliers d'amis encore à rencontrer. Pas de billets, pas de bracelets — entrez, c'est l'été.",
    en: "On the last weekend of July, the Sint-Anna church in Itterbeek calls in sick for three days. Live music, cold beer, paella, pétanque and a few thousand friends you haven't met yet. No tickets, no wristbands — just walk in and stretch summer until sundown.",
  },
  storyEyebrow: {
    nl: "Sinds 2014",
    fr: "Depuis 2014",
    en: "Since 2014",
  },
  programTitle: {
    nl: "Drie dagen, drie sferen.",
    fr: "Trois jours, trois ambiances.",
    en: "Three days, three vibes.",
  },
  programBody: {
    nl: "Vrijdag opent de poort, zaterdag draaien we vol gas en zondag rollen we uit met een dorpsbrunch. Klik een dag aan om de uren en namen te bekijken.",
    fr: "Vendredi on ouvre, samedi on accélère, dimanche on déploie avec un brunch de village. Cliquez sur un jour pour les noms et les horaires.",
    en: "Friday we open the gates, Saturday we hit full throttle, Sunday we wind down with a village brunch. Tap a day to see who's playing when.",
  },
  seeLineup: {
    nl: "Bekijk dag",
    fr: "Voir le jour",
    en: "See day",
  },
  lineupEyebrow: {
    nl: "Headliners 2026",
    fr: "Têtes d'affiche 2026",
    en: "Headliners 2026",
  },
  lineupTitle: {
    nl: "De namen die het dak eraf gooien.",
    fr: "Les noms qui font sauter la toiture.",
    en: "The acts that'll lift the roof.",
  },
  lineupAll: {
    nl: "Volledige line-up",
    fr: "Programmation complète",
    en: "Full line-up",
  },
  activitiesEyebrow: {
    nl: "Doe mee",
    fr: "Participez",
    en: "Get involved",
  },
  activitiesTitle: {
    nl: "Méér dan muziek.",
    fr: "Plus que de la musique.",
    en: "More than just music.",
  },
  activitiesPaellaTitle: {
    nl: "Paella op zondag",
    fr: "Paella du dimanche",
    en: "Sunday paella",
  },
  activitiesPaellaBody: {
    nl: "Lange tafels, één gigantische pan en je buren als gezelschap. Inschrijven verplicht — en het loopt elk jaar volzee.",
    fr: "Longues tablées, une poêle géante et vos voisins en compagnie. Inscription obligatoire — chaque année à guichets fermés.",
    en: "Long tables, one giant pan, your neighbours for company. Sign-up required — sells out every year.",
  },
  activitiesPetanqueTitle: {
    nl: "Petanque-tornooi",
    fr: "Tournoi de pétanque",
    en: "Pétanque tournament",
  },
  activitiesPetanqueBody: {
    nl: "Drie ballen, één zandbak, en de eer van je straat. Beginners welkom, kampioenen ook.",
    fr: "Trois boules, un bac de sable, et l'honneur de votre rue. Débutants bienvenus, champions aussi.",
    en: "Three balls, one sandpit, and your street's honour on the line. Beginners welcome, champions too.",
  },
  videoEyebrow: {
    nl: "Aftermovie",
    fr: "Aftermovie",
    en: "Aftermovie",
  },
  videoTitle: {
    nl: "Zo zag vorige zomer eruit.",
    fr: "L'été dernier, c'était ça.",
    en: "Here's how last summer looked.",
  },
  galleryEyebrow: {
    nl: "De vibe",
    fr: "L'ambiance",
    en: "The vibe",
  },
  galleryTitle: {
    nl: "Foto's zeggen meer dan een bandenbericht.",
    fr: "Les photos en disent plus qu'un communiqué.",
    en: "Photos beat any press release.",
  },
  numbersEyebrow: {
    nl: "Even tellen",
    fr: "Quelques chiffres",
    en: "By the numbers",
  },
  numberDays: { nl: "Dagen", fr: "Jours", en: "Days" },
  numberArtists: { nl: "Artiesten", fr: "Artistes", en: "Artists" },
  numberFree: { nl: "Gratis", fr: "Gratuit", en: "Free" },
  numberVisitors: { nl: "Bezoekers", fr: "Visiteurs", en: "Visitors" },
  partnersEyebrow: {
    nl: "Mogelijk gemaakt door",
    fr: "Rendu possible par",
    en: "Made possible by",
  },
  partnersTitle: {
    nl: "100% Gratis. 0% Toeval.",
    fr: "100% Gratuit. 0% Hasard.",
    en: "100% Free. 0% Coincidence.",
  },
  partnersBody: {
    nl: "Zomaar Zomert is gratis omdat een hele bende lokale ondernemers, vrijwilligers en sponsors er hun schouders onder zet. Wil je mee zorgen voor de volgende editie?",
    fr: "Zomaar Zomert est gratuit parce qu'une bande d'entrepreneurs locaux, bénévoles et sponsors y mettent du leur. Envie de soutenir la prochaine édition?",
    en: "Zomaar Zomert is free because a whole crew of local businesses, volunteers and sponsors keep it that way. Want to help shape the next edition?",
  },
  partnersAll: {
    nl: "Alle partners",
    fr: "Tous les partenaires",
    en: "All partners",
  },
  partnersBecome: {
    nl: "Word partner",
    fr: "Devenir partenaire",
    en: "Become a partner",
  },
  ctaEyebrow: {
    nl: "Save the date",
    fr: "Save the date",
    en: "Save the date",
  },
  ctaTitle: {
    nl: "Tot de laatste zaterdag van juli.",
    fr: "Rendez-vous le dernier samedi de juillet.",
    en: "See you the last Saturday of July.",
  },
  ctaBody: {
    nl: "Geen tickets. Geen gedoe. Wel: een zomer die je wil onthouden. Volg ons op Instagram of stuur ons een mailtje.",
    fr: "Pas de tickets. Pas de prise de tête. Mais : un été à se rappeler. Suivez-nous sur Instagram ou écrivez-nous.",
    en: "No tickets. No fuss. Just a summer worth remembering. Follow us on Instagram or drop us a line.",
  },
  contact: {
    nl: "Contact",
    fr: "Contact",
    en: "Contact",
  },
  becomePartnerLink: {
    nl: "/contact",
    fr: "/contact",
    en: "/contact",
  },
} as const;
