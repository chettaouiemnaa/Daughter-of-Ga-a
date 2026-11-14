/* =========================================================
   L'offre : tout ce qui se vend est ici, et nulle part ailleurs.
   Pour changer un prix, une option ou une catégorie, on ne touche
   qu'à ce fichier.
   ========================================================= */

export const NOM_SITE = "Cachet"; // nom provisoire
export const DEVISE = "DT";

/* Numéro WhatsApp qui reçoit les commandes (format international, sans +).
   À remplacer par le numéro dédié à l'activité invitations. */
export const WHATSAPP_COMMANDES = "21628980970";

export const PRIX_BASE = 129;
export const PRIX_LANGUE_SUP = 29;

/* Ce qui est compris dans toutes les invitations, sans supplément. */
export const INCLUS = [
  { id: "couleurs", nom: "Couleurs assorties à votre décoration", detail: "Enveloppe, cachet et papier dans la palette de votre choix." },
  { id: "musique", nom: "Musique à l'ouverture", detail: "Une ambiance choisie dans notre bibliothèque libre de droits." },
  { id: "rebours", nom: "Compte à rebours", detail: "Vos invités voient combien de jours il reste avant le grand jour." },
  { id: "rappel", nom: "Rappel la veille", detail: "Ajout au calendrier en un geste, avec rappel automatique." },
  { id: "acces", nom: "Itinéraire et calendrier", detail: "Google Maps et ajout à l'agenda directement depuis l'invitation." },
  { id: "rsvp", nom: "Confirmation par WhatsApp", detail: "Vos invités confirment en un geste, avec un message déjà rédigé." },
];

/* Options proposées dans toutes les catégories. */
export const OPTIONS_COMMUNES = [
  { id: "noms", nom: "Le nom de chaque invité", prix: 39, detail: "Un lien par invité : l'enveloppe s'ouvre à son nom, avec son nombre de places." },
  { id: "initiales", nom: "Cachet à vos initiales", prix: 29, detail: "Votre monogramme gravé dans la cire." },
  { id: "decor", nom: "Décor illustré d'après vos photos", prix: 79, detail: "Votre lieu ou votre portrait, redessiné en illustration." },
  { id: "galerie", nom: "Galerie photos", prix: 25, detail: "Vos plus belles photos, à feuilleter dans l'invitation." },
  { id: "suivi", nom: "Suivi des réponses et relances", prix: 39, detail: "Qui vient, combien, régimes alimentaires ; relance de ceux qui n'ont pas répondu." },
  { id: "souvenirs", nom: "Page souvenirs", prix: 39, detail: "Après l'événement, vos invités y déposent leurs photos. Ouverte 6 mois." },
  { id: "express", nom: "Livraison express 48 h", prix: 40, detail: "Votre invitation prête en deux jours au lieu de cinq." },
];

/* Les catégories. Chacune a ses textes par défaut et ses options propres.
   `inclus` : options communes offertes dans cette catégorie. */
export const CATEGORIES = [
  {
    id: "mariage",
    nom: "Mariage",
    sous: "Mariage, fiançailles, henné",
    palette: "terracotta",
    hotesEx: "Sarra & Youssef",
    pluriel: true,
    titre: { fr: "à leur mariage", en: "to their wedding", ar: "لحفل زفافهما" },
    options: [
      { id: "savedate", nom: "Save the date", prix: 29, detail: "Une annonce envoyée des mois avant : « Réservez la date, invitation à suivre »." },
      { id: "multi", nom: "Plusieurs événements", prix: 49, detail: "Henné, outya, mariage : chaque invité ne voit que les soirées où il est convié." },
      { id: "table", nom: "Trouvez votre table", prix: 29, detail: "Le jour J, chaque invité retrouve sa table depuis son invitation." },
      { id: "cadeaux", nom: "Liste de cadeaux ou cagnotte", prix: 19, detail: "Un lien vers votre liste, ou vos coordonnées RIB, D17, Flouci." },
      { id: "hebergement", nom: "Hébergement et transport", prix: 25, detail: "Hôtels conseillés et navettes, pour les invités venus de loin." },
    ],
  },
  {
    id: "commercial",
    nom: "Événement commercial",
    sous: "Lancement, dîner de chef, vente privée",
    palette: "olive",
    hotesEx: "Maison Aïcha",
    pluriel: false,
    titre: { fr: "au dîner du chef", en: "to the chef's dinner", ar: "إلى عشاء الشيف" },
    inclus: ["suivi"],
    options: [
      { id: "billetterie", nom: "Billetterie et paiement en ligne", prix: 0, commission: "4 %", detail: "Vos invités règlent leur place depuis l'invitation. Commission sur les ventes." },
      { id: "qr", nom: "QR code d'entrée", prix: 49, detail: "Chaque invité reçoit son QR code, scanné à la porte." },
      { id: "places", nom: "Places limitées et liste d'attente", prix: 19, detail: "Les inscriptions se ferment d'elles-mêmes une fois la salle pleine." },
      { id: "promo", nom: "Codes promo", prix: 19, detail: "Des tarifs réduits pour vos partenaires ou vos fidèles." },
      { id: "stats", nom: "Statistiques", prix: 29, detail: "Qui a ouvert l'invitation, qui a réservé, à quel moment." },
    ],
  },
  {
    id: "corporate",
    nom: "Corporate",
    sous: "Séminaire, soirée d'entreprise",
    palette: "nuit",
    hotesEx: "Groupe Atlas",
    pluriel: false,
    titre: { fr: "à sa soirée annuelle", en: "to its annual evening", ar: "إلى أمسيتها السنوية" },
    inclus: ["suivi"],
    options: [
      { id: "marque", nom: "Aux couleurs de l'entreprise", prix: 59, detail: "Votre logo et votre charte, sans notre signature." },
      { id: "sessions", nom: "Programme en plusieurs sessions", prix: 29, detail: "Conférences, ateliers, dîner : un programme détaillé et lisible." },
      { id: "inscription", nom: "Formulaire d'inscription", prix: 39, detail: "Entreprise, poste, régime alimentaire : tout est recueilli à la confirmation." },
      { id: "export", nom: "Export Excel des inscrits", prix: 19, detail: "La liste à jour, prête pour l'accueil." },
      { id: "qr", nom: "QR code d'entrée", prix: 49, detail: "Chaque invité reçoit son QR code, scanné à la porte." },
    ],
  },
  {
    id: "bebe",
    nom: "Baby shower",
    sous: "Baby shower, naissance",
    palette: "ciel",
    hotesEx: "Inès & Karim",
    pluriel: true,
    titre: { fr: "à la baby shower", en: "to the baby shower", ar: "لحفل استقبال المولود" },
    options: [
      { id: "revelation", nom: "Révélation du sexe", prix: 29, detail: "L'invitation s'ouvre sur du rose ou du bleu." },
      { id: "pronostics", nom: "Jeu de pronostics", prix: 19, detail: "Date, poids, prénom : vos invités parient." },
      { id: "liste", nom: "Liste de naissance", prix: 19, detail: "Un lien vers votre liste, directement dans l'invitation." },
      { id: "fairepart", nom: "Faire-part de naissance", prix: 49, detail: "Après l'arrivée de bébé, le faire-part dans le même style." },
    ],
  },
  {
    id: "anniversaire",
    nom: "Anniversaire",
    sous: "Enfants et adultes",
    palette: "nuit",
    hotesEx: "Nour",
    pluriel: false,
    titre: { fr: "à son anniversaire", en: "to a birthday celebration", ar: "لحفل عيد ميلاده" },
    options: [
      { id: "surprise", nom: "Mode surprise", prix: 15, detail: "Rien ne doit fuiter : un rappel discret pour chaque invité." },
      { id: "cagnotte", nom: "Cagnotte cadeau commun", prix: 19, detail: "Chacun participe au cadeau depuis l'invitation." },
      { id: "playlist", nom: "Playlist des invités", prix: 15, detail: "Chacun propose ses chansons pour la soirée." },
      { id: "videos", nom: "Messages vidéo", prix: 29, detail: "Les invités enregistrent un mot, réuni en une vidéo." },
    ],
  },
];

/* Palettes : couleur de l'enveloppe, de la cire et du texte d'accueil.
   L'enveloppe est la couleur « éclairée » : la texture du papier l'assombrit. */
export const PALETTES = [
  { id: "terracotta", nom: "Terracotta", env: "#C8643A", cire: "#6A6A33", intro: "#F0CC98" },
  { id: "olive", nom: "Olive", env: "#7C8562", cire: "#B48F4C", intro: "#F3E6C9" },
  { id: "sable", nom: "Sable", env: "#E6D2B0", cire: "#7E2F22", intro: "#5B3E25" },
  { id: "ivoire", nom: "Ivoire", env: "#F4EDE1", cire: "#A3803E", intro: "#6B5B45" },
  { id: "rose", nom: "Rose poudré", env: "#E2B3AB", cire: "#A9824A", intro: "#FFF6F1" },
  { id: "ciel", nom: "Bleu ciel", env: "#B4CCDD", cire: "#5D7FA3", intro: "#FFFFFF" },
  { id: "emeraude", nom: "Émeraude", env: "#2A5E4C", cire: "#C9A55A", intro: "#EEDDB4" },
  { id: "bordeaux", nom: "Bordeaux", env: "#7E2633", cire: "#C9A55A", intro: "#F2DCB8" },
  { id: "nuit", nom: "Nuit", env: "#2C3347", cire: "#B08E48", intro: "#EAD6A8" },
];

export const MUSIQUES = [
  { id: "aucune", nom: "Sans musique" },
  { id: "piano", nom: "Piano doux" },
  { id: "oud", nom: "Oud et cordes" },
  { id: "jazz", nom: "Jazz feutré" },
  { id: "berceuse", nom: "Boîte à musique" },
];

export const LANGUES = [
  { id: "fr", nom: "Français", court: "FR" },
  { id: "en", nom: "English", court: "EN" },
  { id: "ar", nom: "العربية", court: "ع" },
];

export const categorie = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
export const palette = id => PALETTES.find(p => p.id === id) || PALETTES[0];

/* Toutes les options d'une catégorie, communes puis propres, avec leur prix effectif. */
export function optionsDe(catId) {
  const c = categorie(catId);
  const inclus = new Set(c.inclus || []);
  return [
    ...OPTIONS_COMMUNES.map(o => ({ ...o, offerte: inclus.has(o.id) })),
    ...c.options.map(o => ({ ...o, propre: true })),
  ];
}

/* Détail du prix : base, langues en plus, options choisies. */
export function devis(cfg) {
  const opts = optionsDe(cfg.categorie);
  const lignes = [{ nom: "Formule de base", prix: PRIX_BASE }];
  const sup = Math.max(0, (cfg.langues || []).length - 1);
  if (sup) lignes.push({ nom: `Langue${sup > 1 ? "s" : ""} en plus (${sup})`, prix: sup * PRIX_LANGUE_SUP });
  for (const o of opts) {
    if (o.offerte) { lignes.push({ nom: o.nom, prix: 0, note: "offert" }); continue; }
    if (!cfg.options?.includes(o.id)) continue;
    lignes.push({ nom: o.nom, prix: o.prix, note: o.commission ? `+ ${o.commission} des ventes` : "" });
  }
  return { lignes, total: lignes.reduce((s, l) => s + l.prix, 0) };
}

export const fmtPrix = n => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${DEVISE}`;
