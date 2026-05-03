export type QuizOption = {
  id: string;
  label: string;
  tag: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  progressPct: number;
  insightAfter?: Record<string, string> | string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "metier",
    question: "Vous exercez dans quel secteur ?",
    progressPct: 16,
    options: [
      { id: "btp", label: "🔧 Artisan BTP (plombier, électricien, couvreur, maçon...)", tag: "btp" },
      { id: "sante", label: "🏥 Professionnel de santé (kiné, dentiste, ostéo...)", tag: "sante" },
      { id: "commerce", label: "🍽️ Commerce local (restaurant, salon, boutique...)", tag: "commerce" },
      { id: "services", label: "💼 Prestataire de services (coach, consultant, formateur...)", tag: "services" },
      { id: "autre", label: "🏢 Autre", tag: "autre" },
    ],
  },
  {
    id: "site_actuel",
    question: "Vous avez un site web aujourd'hui ?",
    progressPct: 33,
    options: [
      { id: "non", label: "❌ Non, je n'en ai pas encore", tag: "no_site" },
      { id: "mauvais", label: "😕 Oui, mais il ne ramène aucun client", tag: "bad_site" },
      { id: "basique", label: "🤔 Oui, un site basique — je veux mieux", tag: "basic_site" },
    ],
    insightAfter: {
      non: "**87 %** des clients locaux cherchent sur Google avant d'appeler.\nSans site professionnel, ils ne vous trouvent pas — ils appellent votre concurrent.",
      mauvais: "Les sites qui ne convertissent pas ont un point commun :\npas d'appel à l'action visible, pas de numéro cliquable, chargement trop lent.\nOn corrige ça en 48h.",
      basique: "**87 %** des clients locaux cherchent sur Google avant d'appeler.\nSans site professionnel, ils ne vous trouvent pas — ils appellent votre concurrent.",
    },
  },
  {
    id: "contacts",
    question: "Combien de nouveaux clients vous contactent via internet chaque mois ?",
    progressPct: 50,
    options: [
      { id: "zero", label: "0 — aucun, tout vient du bouche-à-oreille", tag: "contacts_0" },
      { id: "peu", label: "1 à 3 — très peu", tag: "contacts_1_3" },
      { id: "quelques", label: "4 à 10 — quelques-uns", tag: "contacts_4_10" },
      { id: "beaucoup", label: "Plus de 10", tag: "contacts_10plus" },
    ],
  },
  {
    id: "blocage",
    question: "Quel est votre plus gros problème aujourd'hui ?",
    progressPct: 66,
    options: [
      { id: "invisible", label: "🔍 Je suis invisible sur Google", tag: "seo" },
      { id: "concurrents", label: "🏆 Mes concurrents ont un meilleur site que moi", tag: "competition" },
      { id: "perte", label: "📞 Je perds des clients faute de site professionnel", tag: "losing_clients" },
      { id: "vitrine", label: "📸 Je n'ai pas de vitrine pour montrer mes réalisations", tag: "no_showcase" },
    ],
    insightAfter: {
      btp: "Les artisans avec un site professionnel reçoivent en moyenne **+7 demandes de devis par mois**\nque ceux qui n'en ont pas. Pour un couvreur, ça représente 2 à 4 chantiers supplémentaires.",
      sante: "Les cabinets avec un site professionnel remplissent leur agenda **2x plus vite**\nque ceux qui dépendent uniquement des recommandations.",
      commerce: "64 % des consommateurs consultent le site d'un commerce avant de s'y rendre.\nSans site, la moitié de vos clients potentiels passent à côté.",
      services: "Un site professionnel est votre commercial disponible 24h/24.\nIl qualifie, il convainc, il prend les RDV — même quand vous dormez.",
      autre: "Un site professionnel est votre commercial disponible 24h/24.\nIl qualifie, il convainc, il prend les RDV — même quand vous dormez.",
    },
  },
  {
    id: "valeur_client",
    question: "En moyenne, combien vaut un nouveau client pour vous ?",
    progressPct: 83,
    options: [
      { id: "moins_500", label: "Moins de 500 € (petites missions)", tag: "value_low" },
      { id: "500_2000", label: "500 € à 2 000 € (missions moyennes)", tag: "value_mid" },
      { id: "2000_10000", label: "2 000 € à 10 000 € (grands chantiers / contrats)", tag: "value_high" },
      { id: "10000plus", label: "Plus de 10 000 €", tag: "value_very_high" },
    ],
  },
  {
    id: "urgence",
    question: "Quand voulez-vous votre site en ligne ?",
    progressPct: 100,
    options: [
      { id: "cette_semaine", label: "🚀 Cette semaine — le plus vite possible", tag: "urgent" },
      { id: "2_3_semaines", label: "📅 Dans les 2-3 prochaines semaines", tag: "soon" },
      { id: "1_2_mois", label: "🗓️ Dans 1-2 mois", tag: "medium" },
      { id: "exploration", label: "💭 Je cherche encore des infos", tag: "cold" },
    ],
    insightAfter: {
      cette_semaine: "Bonne nouvelle — avec UpLift, votre site est livré en **48 heures**.\nUn appel de 15 min lundi, et votre site est en ligne mercredi.",
      "1_2_mois": "Chaque semaine sans site = clients perdus au profit de vos concurrents.\nLa bonne nouvelle : 48h suffisent. Vous pouvez démarrer dès cette semaine.",
    },
  },
];

export type QuizSegment =
  | "artisan_sans_site"
  | "artisan_refonte"
  | "sante"
  | "commerce"
  | "services"
  | "default";

export type QuizResult = {
  displayScore: number;
  segment: QuizSegment;
  roiMultiplier: string;
  urgencyFlag: boolean;
};

export function computeResult(answers: Record<string, string>): QuizResult {
  let score = 0;

  if (answers.site_actuel === "non") score += 3;
  else if (answers.site_actuel === "mauvais") score += 2;

  if (answers.contacts === "zero") score += 3;
  else if (answers.contacts === "peu") score += 2;

  score += 2; // Q4 always adds 2

  const valeur = answers.valeur_client;
  const roiMultiplier =
    valeur === "2000_10000" || valeur === "10000plus" ? "4x" : valeur === "500_2000" ? "2x" : "1x";

  const urgencyFlag = answers.urgence === "cette_semaine";

  const displayScore = 10 - Math.min(score, 8);

  const metier = answers.metier;
  const site = answers.site_actuel;

  let segment: QuizSegment = "default";
  if (metier === "btp" && site === "non") segment = "artisan_sans_site";
  else if (metier === "btp" && (site === "mauvais" || site === "basique")) segment = "artisan_refonte";
  else if (metier === "sante") segment = "sante";
  else if (metier === "commerce") segment = "commerce";
  else if (metier === "services") segment = "services";

  return { displayScore, segment, roiMultiplier, urgencyFlag };
}

export const SEGMENT_DATA: Record<QuizSegment, { title: string; scoreLabel: string; headline: string; paywallArg: string }> = {
  artisan_sans_site: {
    title: "Artisan BTP",
    scoreLabel: "🟡",
    headline: "Voici ce que vous perdez chaque mois.",
    paywallArg: "+7 devis/mois. 1 chantier rembourse 4x le site.",
  },
  artisan_refonte: {
    title: "Artisan BTP",
    scoreLabel: "🟠",
    headline: "Votre site ne convertit pas. Voilà pourquoi.",
    paywallArg: "Score Google 98/100 vs votre site actuel.",
  },
  sante: {
    title: "Professionnel de santé",
    scoreLabel: "🟡",
    headline: "Votre agenda pourrait se remplir 2x plus vite.",
    paywallArg: "Agenda rempli 2x plus vite avec un site pro.",
  },
  commerce: {
    title: "Commerce local",
    scoreLabel: "🟡",
    headline: "64% de vos clients potentiels cherchent un site avant de venir.",
    paywallArg: "64% consultent le site d'un commerce avant de se déplacer.",
  },
  services: {
    title: "Prestataire de services",
    scoreLabel: "🟡",
    headline: "Votre site devrait travailler pour vous 24h/24.",
    paywallArg: "Votre commercial disponible 24h/24.",
  },
  default: {
    title: "Professionnel",
    scoreLabel: "🟡",
    headline: "Voici votre plan de présence web personnalisé.",
    paywallArg: "Site professionnel livré en 48h, visible sur Google.",
  },
};
