import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Mail, Phone, MapPin,
  Users, Lock, LogOut, Loader2, Plus, Minus,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   PHOTOS DU DOMAINE
   Photos réelles du domaine, servies depuis /public/images.
   ═══════════════════════════════════════════════════════════ */
const P_BAR_NUIT = "/images/bar-nuit.jpg";
const P_CHEVAL_BAR = "/images/cheval-bar.jpg";
const P_JARDIN = "/images/domaine.jpg";
const P_LANTERNES = "/images/lanternes.jpg";
const P_TERRASSE = "/images/terrasse.jpg";
const P_COUVERT = "/images/espace-couvert.jpg";

const IMAGES = {
  hero: P_BAR_NUIT,
  lieu: P_JARDIN,
  histoire: P_LANTERNES,
  animaux: P_CHEVAL_BAR,
};

const V_HERO = "/images/tournage-hero.jpg";
const V_PERGOLA = "/images/pergola.jpg";
const V_PISCINE = "/images/piscine.jpg";
const V_JARDIN_V = "/images/jardin-bougainvilliers.jpg";
const V_PALMIERS = "/images/palmiers.jpg";
const V_SALON = "/images/salon.jpg";

const DECOR_IMG = [
  { src: V_PERGOLA,  pos: "center 55%" },
  { src: V_PISCINE,  pos: "center 45%" },
  { src: V_JARDIN_V, pos: "center 40%" },
  { src: V_PALMIERS, pos: "center 50%" },
  { src: V_SALON,    pos: "center 45%" },
];

const MOIS = {
  fr: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};
const JOURS = { fr: ["L","M","M","J","V","S","D"], en: ["M","T","W","T","F","S","S"] };
const STORAGE_KEY = "gaia-dates-bloquees";
const CODE_ADMIN = "EraErosZelda2024";

/* Palette : sable #EDE4D3 · blanc cassé #F6F1E7 · encre #2B2118
   olive #6B7355 · terracotta #B5654A · ligne #C7B79A */

const T = {
fr: {
  hero: { sur: "Private Experiences \u00a0•\u00a0 By Reservation",
    accroche: "Un domaine privé où chaque expérience célèbre le vivant.",
    btn1: "Découvrir le domaine", btn2: "Demander un devis" },
  nav: { domaine: "Le domaine", histoire: "Histoire", experiences: "Expériences", galerie: "Galerie",
    refuge: "Le refuge", tournages: "Tournages", dispo: "Disponibilités", devis: "Devis",
    menu: "Menu", ouvrirMenu: "Ouvrir le menu", fermerMenu: "Fermer le menu" },
  mission: { titre: "Bien plus qu'un lieu de réception. Un refuge vivant où chaque expérience contribue à une histoire plus grande.",
    texte: "Chaque réservation contribue directement au bien-être des animaux recueillis sur le domaine et au développement de Daughter of Gaïa." },
  valeurs: [
    { t: "Une évasion aux portes de la ville", d: "L'impression d'être à des kilomètres de la ville. La réalité\u00a0? Vous êtes au début de la Soukra." },
    { t: "Respect du vivant", d: "Chaque décision est pensée dans le respect des animaux, de la nature et de l'équilibre du lieu." },
    { t: "Des animaux sauvés", d: "Chaque cheval présent ici a été sauvé, recueilli ou réhabilité, faisant de Daughter of Gaïa un véritable lieu de vie avant d'être un lieu d'événements." },
    { t: "Un domaine entièrement privatisé", d: "Chaque réservation vous offre l'exclusivité du domaine, pour vivre pleinement votre événement." },
  ],
  domaine: { eyebrow: "Le domaine", titre: "4 000 m² où la ville disparaît",
    texte: "Des espaces pensés pour s'adapter naturellement à votre événement. Une terrasse tournée vers le jardin, un espace intérieur en matériaux naturels, une cuisine prête à recevoir.",
    citation: "Et partout autour, une nature qui n'a jamais été dessinée pour impressionner, mais pour être vécue.",
    alt: "Le jardin et l'espace couvert" },
  espaces: [
    { t: "Le domaine", v: "4 000 m²" }, { t: "Espace aménagé", v: "500 m²" },
    { t: "Espace couvert", v: "120 m²" }, { t: "Capacité idéale", v: "80 invités" },
    { t: "Parking privé", v: "40 voitures" }, { t: "Sauvés et réhabilités", v: "7 chevaux" },
  ],
  histoire: { eyebrow: "L'histoire", titre: "Avant d'être un lieu, une conviction.",
    p0: "L'idée n'a jamais été de créer un simple lieu événementiel.",
    p1: "Daughter of Gaïa est née d'une envie différente — imaginer un domaine où les événements s'intègrent au lieu, plutôt que l'inverse. Un endroit où la nature et les animaux ne deviennent jamais un décor, mais restent au cœur de chaque expérience.",
    p2: "Le nom trouve son origine dans Gaïa, déesse de la Terre dans la mythologie grecque. Il rappelle une conviction simple. Le respect du vivant guide chacune de nos décisions.",
    p3: "C'est pourquoi nous privilégions des événements qui s'intègrent naturellement au domaine, dans le respect de son environnement et du bien-être des animaux qui y vivent.",
    p4: "Ici, chaque détail a été imaginé avec une même intention — offrir des moments d'exception sans jamais compromettre l'essentiel.",
    citation: "There are places you visit. And there are places you feel.",
    alt: "Les lanternes et les portes en bois" },
  experiences: { eyebrow: "Expériences", titre: "Ce que le domaine accueille", bientot: "bientôt",
    note: "Les événements en journée sont privilégiés, afin de préserver la tranquillité des animaux et du voisinage." },
  prestations: [
    { t: "Lancements de produits & de marques", d: "Un écrin naturel qui met votre marque en valeur, loin des showrooms conventionnels." },
    { t: "Événements d'entreprise", d: "Séminaires et journées d'équipe dans un cadre qui change le rythme des échanges." },
    { t: "Anniversaires", d: "Une célébration privée, en petit comité, avec la nature pour décor." },
    { t: "Événements enfants", d: "Un grand terrain, de la verdure, et des animaux à observer respectueusement." },
    { t: "Baby showers", d: "Un moment doux et intimiste, au jardin ou sous la terrasse couverte." },
    { t: "Brunchs privés", d: "Cuisine équipée et terrasse — tout est là pour recevoir sans contrainte." },
    { t: "Table d'hôte", d: "Une longue table dressée pour un repas partagé au rythme du domaine, entourée d'animaux en liberté et du chant des oiseaux." },
    { t: "Shootings photo & vidéo", d: "Lumière naturelle, décors variés, présence animale — un terrain de jeu pour les créatifs." },
    { t: "Tournages de films", d: "Décors multiples en extérieur, une maison entièrement filmable, et de la lumière naturelle toute la journée." },
    { t: "Mariages intimistes", d: "Petits mariages et événements liés au mariage.", soon: true },
  ],
  appel: { eyebrow: "Tournages & production", titre: "Un décor qui n'a pas besoin d'être construit.",
    texte: "Cinq décors extérieurs, une maison entièrement filmable, et des chevaux qui entrent naturellement dans le cadre.",
    lien: "Découvrir la page tournages" },
  bandeau: ["Respect du vivant", "Animaux sauvés", "Nature préservée", "Domaine privatisé", "Sur réservation"],
  galerie: { eyebrow: "Galerie", titre: "Le domaine en images", faire: "Faites défiler",
    legendes: ["Le jardin", "Le bar, à la nuit tombée", "Les lanternes", "Ils sont chez eux", "La terrasse", "L'espace couvert"] },
  refuge: { eyebrow: "Le refuge", titre: "Sauvés, réhabilités, et chez eux.",
    p1: "Chaque cheval, chien ou autre animal présent ici a été sauvé, recueilli ou réhabilité. Ils ne sont ni une attraction, ni une animation. Ils évoluent dans leur environnement, à leur rythme, et leur bien-être passe avant l'événement.",
    p2: "Sept chevaux ont été recueillis depuis l'ouverture. Quatre vivent ici aujourd'hui. Les trois autres sont repartis une fois remis sur pied, et c'était bien le but.",
    liste: ["Aucune interaction imposée", "Observation à distance, dans le calme", "Niveaux sonores et horaires encadrés", "Zones de repos strictement préservées"],
    alt: "Un cheval accoudé au bar du domaine" },
  dispo: { eyebrow: "Disponibilités", titre: "Choisissez une date", note: "Les dates barrées ne sont plus disponibles" },
  devis: { eyebrow: "Demande de devis", titre: "Parlez-nous de votre projet",
    texte: "Chaque événement est étudié individuellement. Décrivez-nous ce que vous imaginez, nous revenons vers vous avec une proposition adaptée.",
    date: "Date souhaitée", datePh: "Sélectionnez une date dans le calendrier", nom: "Nom", email: "Email",
    tel: "Téléphone", invites: "Invités", type: "Type d'expérience", autre: "Autre", projet: "Votre projet",
    projetPh: "Horaires envisagés, ambiance recherchée, besoins particuliers…", envoyer: "Envoyer ma demande",
    merci: "Merci.", confirm1: "Votre demande a bien été transmise", confirm2: "pour le",
    confirm3: "Nous revenons vers vous rapidement avec une proposition personnalisée." },
  faqT: { eyebrow: "Questions fréquentes", titre: "Bon à savoir" },
  faq: [
    { q: "Le lieu est-il ouvert au public\u00a0?", r: "Non. Daughter of Gaïa accueille uniquement des événements privés, sur réservation. Chaque réservation privatise entièrement le domaine, et vous êtes les seuls sur place." },
    { q: "Peut-on approcher les animaux\u00a0?", r: "Les animaux vivent chez eux et ne sont pas une attraction. Ils sont observables à distance, dans le respect de leur tranquillité. Aucune interaction n'est organisée." },
    { q: "Pourquoi privilégier les événements en journée\u00a0?", r: "Pour préserver le calme des animaux et le repos du voisinage. Les formats en journée sont donc favorisés." },
    { q: "Combien de personnes le lieu peut-il accueillir\u00a0?", r: "Jusqu'à 80 invités, avec un parking de 40 places à l'entrée. Le nombre idéal dépend du format de votre événement et des espaces mobilisés — décrivez-nous votre projet, nous vous conseillerons." },
    { q: "La cuisine est-elle utilisable\u00a0?", r: "Oui, l'ensemble couvert dispose d'une cuisine entièrement équipée. Vous pouvez recevoir votre traiteur ou cuisiner sur place." },
    { q: "Comment obtenir un devis\u00a0?", r: "Choisissez une date dans le calendrier, décrivez votre projet, et nous revenons vers vous avec une proposition adaptée." },
  ],
  contact: { sur: "Private Experiences \u00a0•\u00a0 By Reservation",
    acces: "Domaine privé, accessible uniquement sur réservation confirmée.", devis: "Demander un devis", admin: "Espace propriétaire" },
  tournages: {
    sur: "Daughter of Gaïa \u00a0•\u00a0 Production",
    titre: "Un décor qui n'a pas besoin d'être construit.",
    accroche: "Villa coloniale, piscine, jardins, pergola et chevaux en liberté — plusieurs décors sur un seul site, à quelques minutes de Tunis.",
    btn: "Voir les décors",
    nav: { decors: "Les décors", maison: "La maison", pratique: "En pratique", domaine: "Le domaine", contact: "Contact" },
    introT: "Cinq univers sur un seul site, sans un mètre de décor à monter.",
    intro: "Une villa coloniale à voûtes de brique, une piscine bordée d'arcades en pierre, une pergola ouverte sur le jardin, des palmiers, des bougainvilliers — et des chevaux qui vivent là et entrent naturellement dans le cadre. Un vocabulaire assez large pour jouer l'Andalousie, le Maghreb ou le Levant.",
    decorsE: "Repérage", decorsT: "Du jardin au séjour",
    maisonE: "La maison", maisonT: "Un décor à part entière, et une base pour vos équipes",
    maison1: "La maison se filme autant qu'elle s'utilise. Séjour sous voûte de brique posée à chevrons, sol en marbre, lustre en cristal, portes cintrées ouvrant sur le jardin — un intérieur colonial complet, disponible pour vos plans comme pour vos besoins techniques.",
    maison2: "Elle accueille aussi vos loges, le maquillage, la régie, les repas d'équipe et le stockage du matériel, dans un espace couvert, climatisé et fermé, à quelques pas des décors extérieurs. Sans hébergement toutefois, les nuitées ne sont pas proposées sur le domaine.",
    pratiqueE: "En pratique", pratiqueT: "Ce que le domaine vous apporte",
    pratiqueN: "Les tournages se déroulent en journée, afin de préserver la tranquillité des animaux et du voisinage. Chaque projet fait l'objet d'une visite technique préalable.",
    contactE: "Contact production", contactT: "Parlons de votre tournage.",
    contactP: "Envoyez-nous vos dates, la nature du projet et le nombre de personnes attendues. Nous organisons une visite technique et revenons vers vous avec une proposition.",
    retour: "Retour au domaine",
  },
  decors: [
    { n: "01", t: "Le salon de jardin sous la pergola", d: "Canapés en teck, four à pain en pierre, bougainvilliers en fleur — et des chevaux qui broutent à quelques mètres, dans le même plan. Aucun figurant animalier à faire venir." },
    { n: "02", t: "La piscine et le bar extérieur", d: "Arcades en pierre, bar en brique, bassin turquoise. Plein sud, lumière franche du matin jusqu'en fin d'après-midi." },
    { n: "03", t: "Le jardin sous les bougainvilliers", d: "Un olivier centenaire, un mur de fleurs, des banquettes à l'ombre. Un décor plus intime, pour les plans rapprochés." },
    { n: "04", t: "La pelouse et les palmiers", d: "Un grand espace dégagé, praticable pour les travellings et l'installation du matériel, avec des ombres portées toute la journée." },
    { n: "05", t: "Le salon sous voûte de brique", d: "Plafond en brique posée à chevrons, lustre en cristal, sol en marbre, portes cintrées ouvrant sur la piscine. Un intérieur colonial que l'on ne reconstitue pas en studio." },
  ],
  atouts: [
    { t: "Lumière naturelle", d: "Orientation dégagée, sans vis-à-vis. Le soleil traverse le domaine du matin au soir." },
    { t: "Intérieur et extérieur", d: "Villa coloniale, jardin, piscine, pré et écuries — plusieurs univers sur un seul site." },
    { t: "Chevaux sur place", d: "Des chevaux qui vivent sur le domaine, visibles à l'image sans transport ni prestataire extérieur." },
    { t: "Accès et parking", d: "40 places sur site, à l'entrée du domaine, à quelques minutes de Tunis." },
    { t: "Maison filmable", d: "Voûtes de brique, marbre et arcades — un décor intérieur complet, doublé d'une base technique." },
    { t: "Privatisation totale", d: "Le domaine est réservé à une seule production à la fois. Aucun autre événement en parallèle." },
  ],
  admin: { titre: "Daughter of Gaïa · Administration", quitter: "Quitter", acces: "Accès réservé",
    code: "Entrez votre code", codePh: "Code d'accès", erreur: "Code incorrect.", ouvrir: "Ouvrir",
    dispo: "Disponibilités", bloquer: "Bloquer ou libérer une date",
    aide: "Cliquez sur une date pour la rendre indisponible. Cliquez à nouveau pour la libérer.",
    enreg: "enregistrement…", bloquees: "Dates bloquées", aucune: "Aucune date bloquée." },
},
en: {
  hero: { sur: "Private Experiences \u00a0•\u00a0 By Reservation",
    accroche: "A private estate where every experience celebrates the living.",
    btn1: "Discover the estate", btn2: "Request a quote" },
  nav: { domaine: "The estate", histoire: "Story", experiences: "Experiences", galerie: "Gallery",
    refuge: "The sanctuary", tournages: "Filming", dispo: "Availability", devis: "Quote",
    menu: "Menu", ouvrirMenu: "Open menu", fermerMenu: "Close menu" },
  mission: { titre: "Far more than a venue. A living sanctuary where every experience contributes to a larger story.",
    texte: "Every booking directly supports the wellbeing of the animals taken in on the estate, and the growth of Daughter of Gaïa." },
  valeurs: [
    { t: "An escape at the city's edge", d: "It feels like you are miles from the city. In truth? You are at the entrance of La Soukra." },
    { t: "Respect for the living", d: "Every decision is made with the animals, the land and the balance of the place in mind." },
    { t: "Rescued animals", d: "Every horse here was rescued, taken in or rehabilitated, making Daughter of Gaïa a true home before it is a venue." },
    { t: "An entirely private estate", d: "Each booking gives you exclusive use of the estate, so you can live your event to the full." },
  ],
  domaine: { eyebrow: "The estate", titre: "4,000 m² where the city disappears",
    texte: "Spaces designed to adapt naturally to your event. A terrace facing the garden, an interior in natural materials, a kitchen ready to receive.",
    citation: "And all around, a landscape that was never designed to impress, but to be lived in.",
    alt: "The garden and the covered space" },
  espaces: [
    { t: "The estate", v: "4 000 m²" }, { t: "Landscaped area", v: "500 m²" },
    { t: "Covered space", v: "120 m²" }, { t: "Ideal capacity", v: "80 guests" },
    { t: "Private parking", v: "40 cars" }, { t: "Rescued and rehabilitated", v: "7 horses" },
  ],
  histoire: { eyebrow: "The story", titre: "Before it was a place, it was a conviction.",
    p0: "The idea was never to create just another event venue.",
    p1: "Daughter of Gaïa was born of a different ambition — to imagine an estate where events fit into the place, rather than the other way round. Somewhere nature and animals never become scenery, but stay at the heart of every experience.",
    p2: "The name comes from Gaia, goddess of the Earth in Greek mythology. It stands for a simple conviction. Respect for the living guides every decision we make.",
    p3: "That is why we favour events that fit naturally into the estate, with respect for its environment and for the wellbeing of the animals who live here.",
    p4: "Here, every detail was imagined with a single intention — to offer exceptional moments without ever compromising what matters.",
    citation: "There are places you visit. And there are places you feel.",
    alt: "The lanterns and the wooden doors" },
  experiences: { eyebrow: "Experiences", titre: "What the estate hosts", bientot: "soon",
    note: "Daytime events are favoured, to preserve the peace of the animals and of the neighbourhood." },
  prestations: [
    { t: "Product & brand launches", d: "A natural setting that puts your brand forward, far from conventional showrooms." },
    { t: "Corporate events", d: "Seminars and team days in a setting that changes the rhythm of a conversation." },
    { t: "Birthdays", d: "A private celebration, in small numbers, with nature as the backdrop." },
    { t: "Children's events", d: "Open ground, greenery, and animals to observe respectfully." },
    { t: "Baby showers", d: "A gentle, intimate moment, in the garden or under the covered terrace." },
    { t: "Private brunches", d: "Fitted kitchen and terrace — everything is here to receive without constraint." },
    { t: "Table d'hôte", d: "One long table set for a shared meal at the estate's own pace, surrounded by free-roaming animals and birdsong." },
    { t: "Photo & video shoots", d: "Natural light, varied settings, animals on site — a playground for creatives." },
    { t: "Film shoots", d: "Multiple outdoor locations, a house you can film throughout, and natural light all day long." },
    { t: "Intimate weddings", d: "Small weddings and wedding-related events.", soon: true },
  ],
  appel: { eyebrow: "Filming & production", titre: "A set that does not need building.",
    texte: "Five outdoor locations, a house you can film throughout, and horses that walk naturally into frame.",
    lien: "See the filming page" },
  bandeau: ["Respect for the living", "Rescued animals", "Protected nature", "Private estate", "By reservation"],
  galerie: { eyebrow: "Gallery", titre: "The estate in pictures", faire: "Scroll across",
    legendes: ["The garden", "The bar after dark", "The lanterns", "They live here", "The terrace", "The covered space"] },
  refuge: { eyebrow: "The sanctuary", titre: "Rescued, rehabilitated, and home.",
    p1: "Every horse, dog or other animal here was rescued, taken in or rehabilitated. They are neither an attraction nor an act. They move through their own environment, at their own pace, and their wellbeing comes before the event.",
    p2: "Seven horses have been taken in since we opened. Four live here today. The other three left once they were back on their feet, which was the whole point.",
    liste: ["No forced interaction", "Observation from a distance, in quiet", "Sound levels and hours kept in check", "Resting areas strictly preserved"],
    alt: "A horse leaning over the estate bar" },
  dispo: { eyebrow: "Availability", titre: "Choose a date", note: "Crossed-out dates are no longer available" },
  devis: { eyebrow: "Request a quote", titre: "Tell us about your project",
    texte: "Every event is considered individually. Describe what you have in mind and we will come back to you with a tailored proposal.",
    date: "Preferred date", datePh: "Select a date in the calendar", nom: "Name", email: "Email",
    tel: "Phone", invites: "Guests", type: "Type of experience", autre: "Other", projet: "Your project",
    projetPh: "Timings, atmosphere, particular requirements…", envoyer: "Send my request",
    merci: "Thank you.", confirm1: "Your request has been sent", confirm2: "for",
    confirm3: "We will come back to you shortly with a personalised proposal." },
  faqT: { eyebrow: "Frequently asked", titre: "Good to know" },
  faq: [
    { q: "Is the estate open to the public?", r: "No. Daughter of Gaïa hosts private events by reservation only. Each booking privatises the entire estate, and you are the only ones on site." },
    { q: "Can we approach the animals?", r: "The animals are at home here and are not an attraction. They can be observed from a distance, with respect for their quiet. No interaction is arranged." },
    { q: "Why favour daytime events?", r: "To preserve the calm of the animals and the rest of the neighbourhood. Daytime formats are therefore preferred." },
    { q: "How many people can the estate host?", r: "Up to 80 guests, with 40 parking spaces at the entrance. The ideal number depends on your format and the spaces used — describe your project and we will advise you." },
    { q: "Can we use the kitchen?", r: "Yes, the covered space has a fully fitted kitchen. You are welcome to bring your caterer or cook on site." },
    { q: "How do I get a quote?", r: "Choose a date in the calendar, describe your project, and we will come back to you with a tailored proposal." },
  ],
  contact: { sur: "Private Experiences \u00a0•\u00a0 By Reservation",
    acces: "Private estate, accessible only with a confirmed reservation.", devis: "Request a quote", admin: "Owner access" },
  tournages: {
    sur: "Daughter of Gaïa \u00a0•\u00a0 Production",
    titre: "A set that does not need building.",
    accroche: "Colonial villa, pool, gardens, pergola and free-roaming horses — several locations on one site, minutes from Tunis.",
    btn: "See the locations",
    nav: { decors: "Locations", maison: "The house", pratique: "Practical", domaine: "The estate", contact: "Contact" },
    introT: "Five worlds on a single site, without a metre of set to build.",
    intro: "A colonial villa with brick vaulting, a pool framed by stone arcades, a pergola opening onto the garden, palms, bougainvillea — and horses that live here and walk naturally into frame. A vocabulary broad enough to play Andalusia, the Maghreb or the Levant.",
    decorsE: "Location scout", decorsT: "From the garden to the drawing room",
    maisonE: "The house", maisonT: "A location in its own right, and a base for your crew",
    maison1: "The house is as much to film as to use. A living room under herringbone brick vaulting, marble floors, a crystal chandelier, arched doors opening onto the garden — a complete colonial interior, available for your shots as much as for your technical needs.",
    maison2: "It also takes your dressing rooms, make-up, production office, crew meals and equipment storage, in a covered, air-conditioned and secure space a few steps from the outdoor locations. No accommodation however, overnight stays are not offered on the estate.",
    pratiqueE: "Practical", pratiqueT: "What the estate gives you",
    pratiqueN: "Shoots take place during the day, to preserve the peace of the animals and of the neighbourhood. Every project begins with a technical visit.",
    contactE: "Production contact", contactT: "Let's talk about your shoot.",
    contactP: "Send us your dates, the nature of the project and the number of people expected. We will arrange a technical visit and come back to you with a proposal.",
    retour: "Back to the estate",
  },
  decors: [
    { n: "01", t: "The garden lounge under the pergola", d: "Teak sofas, a stone bread oven, bougainvillea in flower — and horses grazing a few metres away, in the same shot. No animal wrangler to bring in." },
    { n: "02", t: "The pool and outdoor bar", d: "Stone arcades, a brick bar, a turquoise basin. Due south, with clean light from morning until late afternoon." },
    { n: "03", t: "The garden under the bougainvillea", d: "A century-old olive tree, a wall of flowers, benches in the shade. A more intimate setting, for close shots." },
    { n: "04", t: "The lawn and the palms", d: "A large open area, workable for dolly shots and equipment set-up, with cast shadows throughout the day." },
    { n: "05", t: "The drawing room under brick vaulting", d: "Herringbone brick ceiling, crystal chandelier, marble floor, arched doors opening onto the pool. A colonial interior you do not rebuild in a studio." },
  ],
  atouts: [
    { t: "Natural light", d: "Open orientation, nothing overlooking. The sun crosses the estate from morning to evening." },
    { t: "Indoors and out", d: "Colonial villa, garden, pool, paddock and stables — several worlds on a single site." },
    { t: "Horses on site", d: "Horses that live on the estate, available on camera without transport or an outside supplier." },
    { t: "Access and parking", d: "40 spaces on site, at the entrance to the estate, minutes from Tunis." },
    { t: "A house you can film", d: "Brick vaulting, marble and arcades — a complete interior location, doubling as a technical base." },
    { t: "Full privatisation", d: "The estate is reserved for one production at a time. No other event running alongside." },
  ],
  admin: { titre: "Daughter of Gaïa · Administration", quitter: "Exit", acces: "Restricted access",
    code: "Enter your code", codePh: "Access code", erreur: "Incorrect code.", ouvrir: "Open",
    dispo: "Availability", bloquer: "Block or release a date",
    aide: "Click a date to make it unavailable. Click again to release it.",
    enreg: "saving…", bloquees: "Blocked dates", aucune: "No blocked dates." },
},
};

/* ─────────── Fond photo, avec repli dégradé ─────────── */
function Photo({ src, alt = "", className = "", tone = 0, zoom = false, pos = "center", children }) {
  const tones = [
    "linear-gradient(160deg,#d9c9a8 0%,#c2a87f 38%,#a8825c 70%,#7d6247 100%)",
    "linear-gradient(200deg,#e3d8c2 0%,#c9bb9c 45%,#8e9174 100%)",
    "linear-gradient(140deg,#efe6d4 0%,#d3c4a6 50%,#9a8b6b 100%)",
    "linear-gradient(170deg,#c9a97f 0%,#a5825d 45%,#6f5c46 100%)",
  ];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className={`w-full h-full object-cover ${zoom ? "slow-zoom" : ""}`} style={{ objectPosition: pos }} />
      ) : (
        <div className={`w-full h-full ${zoom ? "slow-zoom" : ""}`} style={{ background: tones[tone % tones.length] }} />
      )}
      {children}
    </div>
  );
}


/* ═══════════ COUCHES DE MOUVEMENT ═══════════ */

/* Menu plein écran pour mobile et tablette.
   La navigation de bureau est masquée sous 1024px : sans lui, aucun accès
   aux sections ni au devis depuis un téléphone. */
function MenuMobile({ ouvert, fermer, t, lang, setLang, entrees = [], masqueDes = "lg" }) {
  const panneau = useRef(null);

  /* Le focus entre dans le panneau à l'ouverture (lecteurs d'écran, clavier) */
  useEffect(() => {
    if (ouvert && panneau.current) panneau.current.focus();
  }, [ouvert]);

  return (
    <div className={`${masqueDes === "sm" ? "sm:hidden" : "lg:hidden"} fixed inset-0 z-[90] transition-opacity duration-500`}
      style={{ opacity: ouvert ? 1 : 0, pointerEvents: ouvert ? "auto" : "none" }}
      aria-hidden={!ouvert}>
      <div ref={panneau} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t.nav.menu}
        className="absolute inset-0 flex flex-col outline-none"
        style={{ background: "#EDE4D3" }}>

        <div className="flex items-center justify-between px-8 py-5">
          <span className="display text-base tracking-[0.08em]" style={{ color: "#2B2118" }}>Daughter of Gaïa</span>
          <button onClick={fermer} className="flex items-center justify-center w-11 h-11 -mr-2"
            aria-label={t.nav.fermerMenu}>
            <span className="relative block w-5 h-5">
              <span className="absolute top-1/2 left-0 block h-px w-5" style={{ background: "#2B2118", transform: "rotate(45deg)" }} />
              <span className="absolute top-1/2 left-0 block h-px w-5" style={{ background: "#2B2118", transform: "rotate(-45deg)" }} />
            </span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8 gap-1 overflow-y-auto">
          {entrees.map((e, i) => {
            const style = { color: e.accent ? "#B5654A" : "#2B2118", fontWeight: 300,
                            transform: ouvert ? "none" : "translateY(14px)",
                            transitionDelay: ouvert ? `${120 + i * 55}ms` : "0ms" };
            const classe = "display text-3xl py-3 text-left transition-transform duration-500";
            return e.href ? (
              <a key={e.href + i} href={e.href} style={style} className={classe}
                onClick={(ev) => { fermer(); e.onClick && e.onClick(ev); }}>
                {e.texte}
              </a>
            ) : (
              <button key={"b" + i} style={style} className={classe}
                onClick={() => { fermer(); e.onClick && e.onClick(); }}>
                {e.texte}
              </button>
            );
          })}
        </nav>

        <div className="px-8 pb-10 pt-4 flex items-center gap-3">
          {["fr", "en"].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className="mono text-xs uppercase tracking-[0.2em] px-5 h-11 rounded-full transition-colors duration-500"
              style={{ border: "1px solid #C7B79A",
                       background: lang === l ? "#2B2118" : "transparent",
                       color: lang === l ? "#F6F1E7" : "#6B7355" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Rideau d'ouverture : le nom apparaît, puis le voile se lève */
function Rideau() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 1150);
    const b = setTimeout(() => setPhase(2), 2400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === 2) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ background: "#1a130c", clipPath: phase >= 1 ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
               transition: "clip-path 1.4s cubic-bezier(.76,0,.24,1)" }}>
      <div style={{ opacity: phase >= 1 ? 0 : 1, transition: "opacity .7s ease" }} className="text-center">
        <p className="display text-3xl sm:text-5xl intro-name" style={{ color: "#EDE4D3", fontWeight: 300 }}>Daughter of Gaïa</p>
        <div className="intro-rule h-px mt-6 mx-auto" style={{ background: "#B5654A", width: 90 }} />
      </div>
    </div>
  );
}

/* Grain de pellicule sur toute la page */
function Grain() {
  return <div className="fixed inset-0 z-[60] pointer-events-none grain" aria-hidden="true" />;
}

/* Fond abstrait : nappes de couleur très floues qui dérivent lentement.
   Aucune forme identifiable — seulement de la matière et de la profondeur. */
function FondAbstrait({ intensite = 1 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"
      style={{ opacity: intensite }}>
      <div className="wash wash-a" />
      <div className="wash wash-b" />
      <div className="wash wash-c" />
      <div className="grain-doux" />
    </div>
  );
}

/* Ombres portées : lumière filtrée par le feuillage, comme au soleil couchant.
   Trois nappes très floues qui dérivent lentement et se croisent, plus un
   passage de lumière chaude toutes les vingt secondes. */
function LumiereFiltree() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="nappe nappe-a" />
      <div className="nappe nappe-b" />
      <div className="nappe nappe-c" />
      <div className="balayage" />
    </div>
  );
}

/* Photos qui se succèdent en fondu, avec zoom lent */
function Diaporama({ images, interval = 6500, overlay }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((im, k) => (
        <img key={k} src={im.src} alt={im.alt} className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: im.pos || "center",
            opacity: k === i ? 1 : 0,
            transform: k === i ? "scale(1.14)" : "scale(1.02)",
            transition: "opacity 2.4s ease, transform 8s ease-out",
          }} />
      ))}
      {overlay}
    </div>
  );
}

/* Bouton qui suit légèrement le curseur */
function Magnetique({ children, className = "", style = {}, href, onClick }) {
  const ref = useRef(null);
  const [d, setD] = useState({ x: 0, y: 0 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setD({ x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3 });
  };
  return (
    <a ref={ref} href={href} onClick={onClick} className={className} onMouseMove={move} onMouseLeave={() => setD({ x: 0, y: 0 })}
      style={{ ...style, transform: `translate(${d.x}px,${d.y}px)`, transition: "transform .45s cubic-bezier(.22,1,.36,1)" }}>
      {children}
    </a>
  );
}

/* Titre révélé lettre par lettre.
   Les lettres sont regroupées par mot : chaque lettre étant un inline-block
   et les espaces insécables, sans ce groupement le navigateur coupait la
   ligne entre deux lettres quelconques et brisait les mots en deux sur les
   écrans étroits. */
function LetterReveal({ children, className = "", style = {}, delay = 0 }) {
  const mots = String(children).split(" ");
  let rang = 0;
  return (
    <span className={className} style={style}>
      {mots.map((mot, im) => {
        const depart = rang;
        rang += mot.length + 1;
        return (
          <React.Fragment key={im}>
            <span className="inline-block whitespace-nowrap align-baseline">
              {mot.split("").map((c, k) => (
                <span key={k} className="inline-block letter align-baseline"
                  style={{ animationDelay: `${delay + (depart + k) * 42}ms` }}>
                  {c}
                </span>
              ))}
            </span>
            {im < mots.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </span>
  );
}

/* Galerie qui défile horizontalement au scroll */
function GalerieHorizontale({ items }) {
  const outer = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [x, setX] = useState(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 400);
    return () => { window.removeEventListener("resize", measure); clearTimeout(t); };
  }, [items.length]);

  useEffect(() => {
    const on = () => {
      const el = outer.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const k = Math.min(1, Math.max(0, -r.top / total));
      setP(k); setX(-k * dist);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [dist]);

  return (
    <>
      {/* Mobile : défilement tactile classique */}
      <div className="lg:hidden overflow-x-auto pb-6" style={{ scrollSnapType: "x mandatory" }}>
        <div className="flex gap-4 px-8" style={{ width: "max-content" }}>
          {items.map((g, i) => (
            <figure key={i} className="shrink-0 relative overflow-hidden gal-fig" style={{ width: "76vw", height: "58vh", scrollSnapAlign: "center" }}>
              <img src={g.src} alt={g.l} className="w-full h-full object-cover gal-img" style={{ objectPosition: g.pos || "center" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,14,8,.55), transparent 50%)" }} />
              <figcaption className="absolute bottom-5 inset-x-0 text-center mono text-[9px] uppercase tracking-[0.24em]" style={{ color: "rgba(246,241,231,.95)" }}>
                {g.l}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Écran large : défilement piloté par le scroll */}
      <div ref={outer} style={{ height: `calc(100vh + ${dist}px)` }} className="relative hidden lg:block">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div ref={track} className="flex gap-5 sm:gap-8 px-8 will-change-transform"
          style={{ transform: `translate3d(${x}px,0,0)`, width: "max-content" }}>
          {items.map((g, i) => (
            <figure key={i} className="shrink-0 relative overflow-hidden gal-fig group"
              style={{ width: g.w, height: g.h }}>
              <img src={g.src} alt={g.l} className="w-full h-full object-cover gal-img"
                style={{ objectPosition: g.pos || "center" }} />
              <div className="absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                style={{ background: "linear-gradient(to top, rgba(20,14,8,.55), transparent 55%)" }} />
              <figcaption className="absolute bottom-5 inset-x-0 text-center mono text-[9px] uppercase tracking-[0.24em]"
                style={{ color: "rgba(246,241,231,.95)", textShadow: "0 1px 14px rgba(0,0,0,.7)" }}>
                {g.l}
              </figcaption>
            </figure>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}


/* Curseur personnalisé qui grossit sur les éléments actifs */
function Curseur() {
  const [p, setP] = useState({ x: -100, y: -100 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    const move = (e) => {
      setP({ x: e.clientX, y: e.clientY });
      const t = e.target;
      setBig(!!(t.closest && t.closest("a,button,figure,input,select,textarea")));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div className="fixed z-[90] pointer-events-none hidden md:block" aria-hidden="true"
      style={{
        left: p.x, top: p.y, width: big ? 44 : 9, height: big ? 44 : 9,
        marginLeft: big ? -22 : -4.5, marginTop: big ? -22 : -4.5,
        borderRadius: "9999px", border: `1px solid ${big ? "rgba(181,101,74,.85)" : "rgba(181,101,74,.55)"}`,
        background: big ? "rgba(181,101,74,.1)" : "rgba(181,101,74,.55)",
        transition: "width .35s cubic-bezier(.22,1,.36,1), height .35s cubic-bezier(.22,1,.36,1), margin .35s cubic-bezier(.22,1,.36,1), background .35s, border-color .35s",
      }} />
  );
}

/* Fine ligne de progression de lecture */
function Progression() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] pointer-events-none" aria-hidden="true">
      <div style={{ width: `${p}%`, height: "100%", background: "linear-gradient(90deg,#6B7355,#B5654A)", transition: "width .1s linear" }} />
    </div>
  );
}

/* Étiquette verticale en marge de section */
function EtiquetteVerticale({ children }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-4"
      style={{ writingMode: "vertical-rl", opacity: seen ? 1 : 0, transform: `translateY(-50%) translateX(${seen ? 0 : -14}px)`, transition: "opacity 1.2s ease .3s, transform 1.2s cubic-bezier(.22,1,.36,1) .3s" }}>
      <span className="mono text-[9px] uppercase tracking-[0.4em]" style={{ color: "#a89a7f" }}>{children}</span>
    </div>
  );
}

/* Paragraphe qui se dévoile ligne après ligne, sous un masque */
function MaskText({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .25 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="overflow-hidden">
      <p className={className} style={{
        ...style,
        transform: seen ? "none" : "translateY(105%)",
        opacity: seen ? 1 : 0,
        transition: `transform 1.1s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity .9s ease ${delay}ms`,
      }}>{children}</p>
    </div>
  );
}

/* Image révélée par deux volets qui s'écartent */
function VoletsReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .18 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "#EDE4D3", transformOrigin: "top",
        transform: seen ? "scaleY(0)" : "scaleY(.5)", top: 0, bottom: "50%",
        transition: `transform 1.25s cubic-bezier(.76,0,.24,1) ${delay}ms`,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "#EDE4D3", transformOrigin: "bottom",
        transform: seen ? "scaleY(0)" : "scaleY(.5)", top: "50%", bottom: 0,
        transition: `transform 1.25s cubic-bezier(.76,0,.24,1) ${delay}ms`,
      }} />
    </div>
  );
}

/* Projecteur qui suit le curseur */
function Projecteur({ children, className = "" }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  return (
    <div ref={ref} className={className}
      onMouseMove={(e) => { const r = ref.current.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true }); }}
      onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}>
      {children}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(243,220,174,.16), transparent 62%)`,
        opacity: pos.on ? 1 : 0, transition: "opacity .7s ease",
      }} />
    </div>
  );
}


/* Descend vers la section suivante — la flèche et le bouton "Découvrir le domaine" */
function versSuite(e) {
  if (e) e.preventDefault();
  const el = document.getElementById("mission");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: y, behavior: "smooth" });
}

/* Amène au formulaire de devis, quel que soit l'endroit de la page */
function versDevis(e) {
  if (e) e.preventDefault();
  const el = document.getElementById("devis");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: y, behavior: "smooth" });
  setTimeout(() => {
    const champ = document.getElementById("champ-nom");
    if (champ) champ.focus({ preventScroll: true });
  }, 900);
}

/* ─────────── Mouvements ─────────── */
function Reveal({ children, delay = 0, className = "", y = 26 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: seen ? 1 : 0,
      transform: seen ? "none" : `translateY(${y}px)`,
      transition: `opacity 1.2s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 1.2s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function WordReveal({ children, className = "", style = {}, delay = 0, as: Tag = "h2" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={className} style={style}>
      {String(children).split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="inline-block" style={{
            transform: seen ? "none" : "translateY(105%)",
            opacity: seen ? 1 : 0,
            transition: `transform .95s cubic-bezier(.22,1,.36,1) ${delay + i * 60}ms, opacity .8s ease ${delay + i * 60}ms`,
          }}>{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
}

/* Balayage : le bloc se dévoile comme un rideau */
function WipeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      clipPath: seen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
      transition: `clip-path 1.3s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function Parallax({ children, speed = 0.07, className = "" }) {
  const ref = useRef(null);
  const [off, setOff] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      setOff(-(r.top + r.height / 2 - window.innerHeight / 2) * speed);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [speed]);
  return <div ref={ref} className={className} style={{ transform: `translate3d(0,${off}px,0)` }}>{children}</div>;
}

function CountUp({ value, delay = 0 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const target = parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = String(value).replace(/[\s0-9]/g, "");
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const lancer = () => {
        const t0 = performance.now(), dur = 2000;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          setN(Math.round(target * (1 - Math.pow(1 - k, 4))));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      setTimeout(lancer, delay);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, delay]);
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {n.toLocaleString("fr-FR")} <span style={{ fontSize: ".62em", letterSpacing: ".04em" }}>{suffix}</span>
    </span>
  );
}

/* Filet horizontal qui se dessine */
function Rule({ delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-px w-full" style={{
      background: "#C7B79A", transform: seen ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
      transition: `transform 1.5s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }} aria-hidden="true" />
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <p className="uppercase tracking-[0.32em] text-[10px] mb-5 mono"
      style={{ color: light ? "rgba(246,241,231,.75)" : "#B5654A" }}>
      {children}
    </p>
  );
}

/* ─────────── Calendrier ─────────── */
function Calendrier({ blocked, onDayClick, admin = false, lang = "fr" }) {
  const MOIS_L = MOIS[lang], JOURS_L = JOURS[lang];
  const [monthOffset, setMonthOffset] = useState(0);
  const [fade, setFade] = useState(false);
  const today = useMemo(() => new Date(2026, 6, 29), []);
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset + (admin ? 0 : 1), 1);
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const shift = (n) => { setFade(true); setTimeout(() => { setMonthOffset((m) => m + n); setFade(false); }, 190); };
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-md w-full">
      <div className="flex items-center justify-between py-5">
        <button onClick={() => shift(-1)} disabled={monthOffset <= 0}
          className="flex items-center justify-center w-11 h-11 -ml-2 disabled:opacity-25 transition-transform hover:-translate-x-1" aria-label="Mois précédent"><ChevronLeft size={18} /></button>
        <span className="mono text-xs uppercase tracking-[0.25em] transition-opacity duration-200" style={{ opacity: fade ? 0 : 1 }}>{MOIS_L[month]} {year}</span>
        <button onClick={() => shift(1)} disabled={monthOffset >= 11}
          className="flex items-center justify-center w-11 h-11 -mr-2 disabled:opacity-25 transition-transform hover:translate-x-1" aria-label="Mois suivant"><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 mb-3">
        {JOURS_L.map((d, i) => <span key={i} className="mono text-[9px] text-center tracking-widest" style={{ color: "#9a8f76" }}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 pb-6 transition-opacity duration-200" style={{ opacity: fade ? 0 : 1 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = `${year}-${month + 1}-${d}`;
          const isBlocked = blocked.has(key);
          return (
            <button key={i} onClick={() => onDayClick(key, lang === "fr" ? `${d} ${MOIS_L[month]} ${year}` : `${MOIS_L[month]} ${d}, ${year}`, isBlocked)}
              disabled={!admin && isBlocked} className="day-cell fu aspect-square text-sm body-font relative"
              style={{
                animationDelay: `${i * 14}ms`, animationDuration: ".8s",
                color: isBlocked ? (admin ? "#B5654A" : "#c2b79f") : "#2B2118",
                textDecoration: isBlocked && !admin ? "line-through" : "none",
                cursor: !admin && isBlocked ? "not-allowed" : "pointer",
                fontWeight: isBlocked && admin ? 600 : 400,
              }}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function FaqItem({ q, r, i }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 60}>
      <div>
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-center gap-4 py-5 group">
          <span className="body-font text-[15px]">{q}</span>
          <span className="shrink-0 transition-transform duration-500" style={{ color: "#B5654A", transform: open ? "rotate(180deg)" : "none" }}>
            {open ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>
        <div style={{ maxHeight: open ? 260 : 0, opacity: open ? 1 : 0, overflow: "hidden", transition: "max-height .6s cubic-bezier(.22,1,.36,1), opacity .5s" }}>
          <p className="body-font text-sm pb-8 leading-relaxed max-w-md mx-auto" style={{ color: "#5a4f42" }}>{r}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function App() {
  const [blocked, setBlocked] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [page, setPage] = useState("accueil");
  const [lang, setLang] = useState("fr");
  const [menuOuvert, setMenuOuvert] = useState(false);
  const t = T[lang];

  const allerA = (p) => { setPage(p); setMenuOuvert(false); window.scrollTo({ top: 0, behavior: "auto" }); };

  /* Menu mobile : fige le fond, ferme sur Échap, libère au démontage */
  useEffect(() => {
    if (!menuOuvert) return;
    const posInitiale = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const surTouche = (e) => { if (e.key === "Escape") setMenuOuvert(false); };
    window.addEventListener("keydown", surTouche);
    return () => {
      document.body.style.overflow = posInitiale;
      window.removeEventListener("keydown", surTouche);
    };
  }, [menuOuvert]);

  /* Repasse en affichage bureau : le menu plein écran n'a plus lieu d'être */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => { if (mq.matches) setMenuOuvert(false); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const on = () => { setScrollY(window.scrollY); setNavSolid(window.scrollY > window.innerHeight * 0.85); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => { (async () => {
    try { const r = await window.storage.get(STORAGE_KEY, true); if (r?.value) setBlocked(new Set(JSON.parse(r.value))); }
    catch { /* rien enregistré */ } setLoading(false);
  })(); }, []);

  async function toggleBlocked(key) {
    const next = new Set(blocked);
    next.has(key) ? next.delete(key) : next.add(key);
    setBlocked(next); setSaving(true);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify([...next]), true); } catch { setBlocked(blocked); }
    setSaving(false);
  }

  const styleTag = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&family=IBM+Plex+Mono:wght@300;400&display=swap');
      .display{font-family:'Cormorant Garamond',serif;}
      .body-font{font-family:'Jost',sans-serif;font-weight:300;}
      .mono{font-family:'IBM Plex Mono',monospace;}
      html{scroll-behavior:smooth;}

      @keyframes fadeUp{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:none;}}
      @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
      @keyframes slowZoom{0%{transform:scale(1.02);}50%{transform:scale(1.14);}100%{transform:scale(1.02);}}
      @keyframes cueBob{0%,100%{transform:translateY(0);opacity:.75;}50%{transform:translateY(6px);opacity:1;}}
      @keyframes lineGrow{from{transform:scaleY(0);}to{transform:scaleY(1);}}
      @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}

      .fu{animation:fadeUp 1.5s cubic-bezier(.22,1,.36,1) both;}
      .fi{animation:fadeIn 2.2s ease both;}
      .slow-zoom{animation:slowZoom 34s ease-in-out infinite;}
      .cue{animation:cueBob 2.8s ease-in-out infinite;}
      .vline{animation:lineGrow 1.4s cubic-bezier(.22,1,.36,1) both;transform-origin:top;}
      .marquee{animation:marquee 60s linear infinite;width:max-content;}
      .marquee:hover{animation-play-state:paused;}

      @keyframes moteFloat{0%{transform:translate(0,0);opacity:0;}12%{opacity:1;}88%{opacity:1;}100%{transform:translate(var(--dx),var(--dy));opacity:0;}}
      @keyframes grainShift{0%{transform:translate(0,0);}10%{transform:translate(-4%,-3%);}20%{transform:translate(-8%,3%);}30%{transform:translate(3%,-8%);}40%{transform:translate(-2%,7%);}50%{transform:translate(-8%,4%);}60%{transform:translate(5%,0);}70%{transform:translate(0,6%);}80%{transform:translate(-6%,-2%);}90%{transform:translate(4%,4%);}100%{transform:translate(0,0);}}
      @keyframes letterIn{from{opacity:0;transform:translateY(52%) rotate(3deg);}to{opacity:1;transform:none;}}
      @keyframes introName{from{opacity:0;letter-spacing:.5em;}to{opacity:1;letter-spacing:.02em;}}
      @keyframes introRule{from{transform:scaleX(0);}to{transform:scaleX(1);}}
      @keyframes glowPulse{0%,100%{opacity:.25;}50%{opacity:.6;}}
      @keyframes tick{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}

      .mote{position:absolute;border-radius:9999px;animation-name:moteFloat;animation-timing-function:ease-out;animation-iteration-count:infinite;filter:blur(.4px);}
      .grain{opacity:.055;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");animation:grainShift 1s steps(2) infinite;}
      .letter{animation:letterIn 1.1s cubic-bezier(.22,1,.36,1) both;}
      .intro-name{animation:introName 1.6s cubic-bezier(.22,1,.36,1) both;}
      .intro-rule{animation:introRule 1.4s cubic-bezier(.22,1,.36,1) both .6s;transform-origin:center;}
      .halo{animation:glowPulse 7s ease-in-out infinite;}
      .tick{animation:tick 3s ease-in-out infinite;}
      .gal-fig{transition:transform .8s cubic-bezier(.22,1,.36,1);}
      .gal-fig:hover{transform:translateY(-10px);}
      .gal-img{transition:transform 1.6s cubic-bezier(.22,1,.36,1),filter 1s;filter:saturate(.94);}
      .gal-fig:hover .gal-img{transform:scale(1.08);filter:saturate(1.1);}
      @keyframes derive1{0%{transform:translate3d(-14%,-8%,0) scale(1.15);}50%{transform:translate3d(16%,10%,0) scale(1.35);}100%{transform:translate3d(-14%,-8%,0) scale(1.15);}}
      @keyframes derive2{0%{transform:translate3d(18%,12%,0) scale(1.3);}50%{transform:translate3d(-12%,-10%,0) scale(1.1);}100%{transform:translate3d(18%,12%,0) scale(1.3);}}
      @keyframes derive3{0%{transform:translate3d(4%,-16%,0) scale(1.2);}50%{transform:translate3d(-8%,14%,0) scale(1.45);}100%{transform:translate3d(4%,-16%,0) scale(1.2);}}
      @keyframes passage{0%{transform:translateX(-130%) skewX(-14deg);opacity:0;}8%{opacity:.5;}22%{opacity:.5;}34%{transform:translateX(130%) skewX(-14deg);opacity:0;}100%{transform:translateX(130%) skewX(-14deg);opacity:0;}}

      .nappe{position:absolute;border-radius:50%;filter:blur(70px);will-change:transform;}
      .nappe-a{width:75%;height:85%;left:-10%;top:-14%;background:radial-gradient(circle,rgba(20,14,8,.42),transparent 66%);animation:derive1 46s ease-in-out infinite;}
      .nappe-b{width:70%;height:80%;right:-12%;bottom:-16%;background:radial-gradient(circle,rgba(20,14,8,.34),transparent 64%);animation:derive2 62s ease-in-out infinite;}
      .nappe-c{width:60%;height:70%;left:26%;top:8%;background:radial-gradient(circle,rgba(243,220,174,.20),transparent 62%);animation:derive3 54s ease-in-out infinite;}
      .balayage{position:absolute;inset:-25% -60%;background:linear-gradient(100deg,transparent 38%,rgba(248,231,196,.16) 48%,rgba(248,231,196,.26) 52%,rgba(248,231,196,.16) 56%,transparent 66%);animation:passage 20s ease-in-out infinite;will-change:transform;}
      .sep-col{border-right:none;}
      @media (min-width:1024px){ .sep-col{border-right:1px solid #C7B79A;} }
      @keyframes washA{0%{transform:translate3d(-12%,-6%,0) scale(1.1);}50%{transform:translate3d(14%,8%,0) scale(1.4);}100%{transform:translate3d(-12%,-6%,0) scale(1.1);}}
      @keyframes washB{0%{transform:translate3d(16%,10%,0) scale(1.35);}50%{transform:translate3d(-10%,-8%,0) scale(1.1);}100%{transform:translate3d(16%,10%,0) scale(1.35);}}
      @keyframes washC{0%{transform:translate3d(2%,-14%,0) scale(1.2);}50%{transform:translate3d(-6%,12%,0) scale(1.5);}100%{transform:translate3d(2%,-14%,0) scale(1.2);}}
      .wash{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform;}
      .wash-a{width:70%;height:80%;left:-14%;top:-18%;background:radial-gradient(circle,rgba(107,115,85,.20),transparent 68%);animation:washA 58s ease-in-out infinite;}
      .wash-b{width:66%;height:76%;right:-16%;bottom:-20%;background:radial-gradient(circle,rgba(181,101,74,.16),transparent 66%);animation:washB 74s ease-in-out infinite;}
      .wash-c{width:58%;height:66%;left:30%;top:12%;background:radial-gradient(circle,rgba(199,183,154,.30),transparent 64%);animation:washC 66s ease-in-out infinite;}
      .grain-doux{position:absolute;inset:0;opacity:.05;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E");}
      .day-cell{transition:color .3s,transform .25s;}
      .day-cell:hover:not(:disabled){transform:scale(1.25);color:#B5654A;}
      .link-u{position:relative;}
      .link-u::after{content:'';position:absolute;left:0;bottom:-4px;height:1px;width:100%;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .6s cubic-bezier(.22,1,.36,1);}
      .link-u:hover::after{transform:scaleX(1);transform-origin:left;}
      .btn{position:relative;overflow:hidden;transition:color .5s;}
      /* Le voile de survol prend --btn-fill. On n'utilise plus currentColor :
         un color défini en ligne l'emporte sur la règle :hover, et le voile
         se remplissait alors de la couleur du texte, le rendant illisible. */
      .btn::before{content:'';position:absolute;inset:0;background:var(--btn-fill,#2B2118);transform:translateY(101%);transition:transform .6s cubic-bezier(.22,1,.36,1);}
      .btn:hover::before{transform:translateY(0);}
      .btn span{position:relative;z-index:1;transition:color .5s;}
      .btn-solid:hover span{color:var(--btn-fill-text,#F6F1E7);}
      .zoom-wrap img,.zoom-wrap>div{transition:transform 1.4s cubic-bezier(.22,1,.36,1),filter 1s;}
      .zoom-wrap:hover img,.zoom-wrap:hover>div{transform:scale(1.07);}
      .presta{transition:padding-left .6s cubic-bezier(.22,1,.36,1),color .5s;}
      .presta:hover{padding-left:16px;}
      .presta .arr{opacity:0;transform:translateX(-8px);transition:opacity .5s,transform .5s;}
      .presta:hover .arr{opacity:1;transform:translateX(0);}
      input,select,textarea{transition:border-color .4s,background .4s;}
      /* text-align seul ne centre pas la valeur affichée d'une liste
         déroulante : c'est text-align-last qui gouverne cette ligne. */
      select{text-align:center;text-align-last:center;}
      select option{text-align:center;}
      input:focus,select:focus,textarea:focus{outline:none;border-color:#6B7355 !important;}
      ::selection{background:#B5654A;color:#F6F1E7;}
      @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none !important;transition-duration:.01ms !important;}}
    `}</style>
  );

  const selecteurHero = (
    <div className="fu flex items-center justify-center gap-0 rounded-full overflow-hidden mx-auto mb-8"
      style={{ animationDelay: "2.1s", border: "1px solid rgba(246,241,231,.45)",
               background: "rgba(30,22,14,.32)", backdropFilter: "blur(8px)", width: "fit-content" }}>
      {["fr", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className="mono text-[10px] uppercase tracking-[0.22em] px-5 min-h-[44px] transition-colors duration-500"
          style={{ background: lang === l ? "#F6F1E7" : "transparent",
                   color: lang === l ? "#2B2118" : "rgba(246,241,231,.9)" }}>
          {l}
        </button>
      ))}
    </div>
  );

  const selecteurNav = (
    <div className="flex items-center rounded-full overflow-hidden" style={{ border: "1px solid #C7B79A" }}>
      {["fr", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className="mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 transition-colors duration-500"
          style={{ background: lang === l ? "#2B2118" : "transparent",
                   color: lang === l ? "#F6F1E7" : "#6B7355" }}>
          {l}
        </button>
      ))}
    </div>
  );

  /* ══════════ ADMIN ══════════ */
  if (adminOpen) {
    return (
      <div style={{ background: "#EDE4D3", color: "#2B2118" }} className="min-h-screen">
        {styleTag}
        <header className="max-w-3xl mx-auto px-8 pt-10 flex justify-between items-center">
          <span className="display text-xl tracking-wide">{t.admin.titre}</span>
          <button onClick={() => { setAdminOpen(false); setIsAdmin(false); setCodeInput(""); }}
            className="mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2 link-u" style={{ color: "#B5654A" }}><LogOut size={13} /> {t.admin.quitter}</button>
        </header>
        <div className="max-w-3xl mx-auto px-8 py-16 fu">
          {!isAdmin ? (
            <form onSubmit={(e) => { e.preventDefault(); codeInput === CODE_ADMIN ? (setIsAdmin(true), setCodeError("")) : setCodeError(t.admin.erreur); }} className="max-w-sm">
              <Eyebrow>{t.admin.acces}</Eyebrow>
              <h1 className="display text-4xl mb-8" style={{ fontWeight: 300 }}>{t.admin.code}</h1>
              <input type="password" value={codeInput} onChange={(e) => setCodeInput(e.target.value)}
                className="body-font w-full px-0 py-3 bg-transparent" style={{ borderBottom: "1px solid #C7B79A" }} placeholder={t.admin.codePh} />
              {codeError && <p className="body-font text-sm mt-3" style={{ color: "#B5654A" }}>{codeError}</p>}
              <button type="submit" className="btn btn-solid body-font mt-8 px-10 py-3.5 text-sm uppercase tracking-[0.2em]"
                style={{ background: "#6B7355", color: "#F6F1E7" }}><span>{t.admin.ouvrir}</span></button>
            </form>
          ) : (
            <>
              <Eyebrow>{t.admin.dispo}</Eyebrow>
              <h1 className="display text-4xl mb-4" style={{ fontWeight: 300 }}>{t.admin.bloquer}</h1>
              <p className="body-font text-sm mb-10 max-w-lg" style={{ color: "#5a4f42" }}>
                {t.admin.aide}
              </p>
              {loading ? <Loader2 className="animate-spin" color="#B5654A" /> : <Calendrier blocked={blocked} admin lang={lang} onDayClick={toggleBlocked} />}
              {saving && <p className="mono text-[10px] flex items-center gap-2 mt-2" style={{ color: "#6B7355" }}><Loader2 size={11} className="animate-spin" /> {t.admin.enreg}</p>}
              <div className="mt-12 max-w-xl">
                <p className="mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: "#6B7355" }}>{t.admin.bloquees} — {blocked.size}</p>
                {blocked.size === 0 ? <p className="body-font text-sm" style={{ color: "#5a4f42" }}>{t.admin.aucune}</p> : (
                  <div className="flex flex-wrap gap-2">
                    {[...blocked].sort().map((k) => { const [y, m, d] = k.split("-");
                      return <button key={k} onClick={() => toggleBlocked(k)} className="mono text-[10px] px-3 py-1.5 transition-colors hover:opacity-70"
                        style={{ border: "1px solid #B5654A", color: "#B5654A" }}>{d}/{m}/{y} ×</button>; })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ══════════ PAGE TOURNAGES ══════════ */
  if (page === "tournages") {
    return (
      <div style={{ background: "#EDE4D3", color: "#2B2118", overflowX: "clip" }} className="min-h-screen">
        {styleTag}
        <Grain />
        <Progression />

        {/* HERO */}
        <section className="relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0" style={{ transform: `translate3d(0,${scrollY * 0.3}px,0)` }}>
            <img src={V_HERO} alt={t.decors[1].t}
              className="w-full h-full object-cover slow-zoom" style={{ objectPosition: "center 55%" }} />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,14,8,.56) 0%, rgba(20,14,8,.28) 36%, rgba(20,14,8,.44) 68%, rgba(20,14,8,.76) 100%)" }} />
          <LumiereFiltree />

          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pb-20"
            style={{ opacity: Math.max(0, 1 - scrollY / 620) }}>
            {selecteurHero}
            <p className="fi mono uppercase tracking-[0.45em] text-[9px] sm:text-[11px] mb-9"
              style={{ color: "rgba(246,241,231,.82)", animationDelay: ".3s" }}>
              {t.tournages.sur}
            </p>
            <h1 className="fu display leading-[0.98] text-[10vw] sm:text-[4.6rem] lg:text-[6rem] max-w-4xl"
              style={{ color: "#F6F1E7", fontWeight: 300, animationDelay: ".6s", textShadow: "0 4px 40px rgba(0,0,0,.4)" }}>
              {t.tournages.titre}
            </h1>
            <p className="fu body-font text-base sm:text-xl max-w-xl leading-relaxed mt-10"
              style={{ color: "rgba(246,241,231,.94)", animationDelay: "1.1s", textShadow: "0 2px 20px rgba(0,0,0,.4)" }}>
              {t.tournages.accroche}
            </p>
            <div className="fu mt-12" style={{ animationDelay: "1.4s" }}>
              <a href="#decors" className="btn btn-solid body-font px-11 py-4 text-[11px] uppercase tracking-[0.28em] inline-block"
                style={{ background: "#F6F1E7", color: "#2B2118" }}><span>{t.tournages.btn}</span></a>
            </div>
          </div>

          <div className="absolute bottom-7 inset-x-0 flex justify-center z-10 pointer-events-none">
            <a href="#intro-t" className="cue pointer-events-auto p-3" aria-label="Faire défiler">
              <ChevronDown size={20} color="rgba(246,241,231,.8)" />
            </a>
          </div>
        </section>

        {/* NAV */}
        <nav className="sticky top-0 z-40 transition-all duration-700"
          style={{ background: navSolid ? "rgba(237,228,211,.94)" : "rgba(237,228,211,0)", backdropFilter: navSolid ? "blur(8px)" : "none" }}>
          <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col items-center gap-3 transition-opacity duration-500"
            style={{ opacity: navSolid ? 1 : 0, pointerEvents: navSolid ? "auto" : "none" }}>
            <div className="w-full flex items-center justify-center relative">
              <button onClick={() => allerA("accueil")} className="display text-base tracking-[0.08em] flex items-center min-h-[44px]">Daughter of Gaïa</button>
              <button onClick={() => setMenuOuvert(true)}
                className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end justify-center gap-[5px] w-11 h-11"
                aria-label={t.nav.ouvrirMenu} aria-expanded={menuOuvert}>
                <span className="block h-px w-6" style={{ background: "#2B2118" }} />
                <span className="block h-px w-4" style={{ background: "#2B2118" }} />
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-8 mono text-[10px] uppercase tracking-[0.2em] leading-none" style={{ color: "#6B7355" }}>
              <a href="#decors" className="link-u">{t.tournages.nav.decors}</a>
              <a href="#maison" className="link-u">{t.tournages.nav.maison}</a>
              <a href="#pratique" className="link-u">{t.tournages.nav.pratique}</a>
              <button onClick={() => allerA("accueil")} className="link-u uppercase tracking-[0.2em]">{t.tournages.nav.domaine}</button>
              <a href="#contact-t" className="link-u" style={{ color: "#B5654A" }}>{t.tournages.nav.contact}</a>
              {selecteurNav}
            </div>
          </div>
        </nav>

        {/* MENU MOBILE — la nav ci-dessus disparaît sous 640px */}
        <MenuMobile ouvert={menuOuvert} fermer={() => setMenuOuvert(false)}
          t={t} lang={lang} setLang={setLang} masqueDes="sm"
          entrees={[
            { href: "#decors", texte: t.tournages.nav.decors },
            { href: "#maison", texte: t.tournages.nav.maison },
            { href: "#pratique", texte: t.tournages.nav.pratique },
            { texte: t.tournages.nav.domaine, onClick: () => allerA("accueil") },
            { href: "#contact-t", texte: t.tournages.nav.contact, accent: true },
          ]} />

        {/* INTRO */}
        <section id="intro-t" className="relative max-w-4xl mx-auto px-8 pt-32 pb-24 text-center">
          <FondAbstrait intensite={0.85} />
          <div className="relative">
            <Reveal>
              <WordReveal className="display text-3xl sm:text-5xl leading-[1.15]" style={{ fontWeight: 300 }}>
                {t.tournages.introT}
              </WordReveal>
            </Reveal>
            <Reveal delay={350}>
              <p className="body-font text-sm sm:text-base mt-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#5a4f42" }}>
                {t.tournages.intro}
              </p>
            </Reveal>
          </div>
        </section>

        {/* LES DÉCORS */}
        <section id="decors" className="py-16">
          <div className="max-w-4xl mx-auto px-8 text-center mb-16">
            <Reveal><Eyebrow>{t.tournages.decorsE}</Eyebrow></Reveal>
            <WordReveal className="display text-4xl sm:text-6xl" style={{ fontWeight: 300 }}>
              {t.tournages.decorsT}
            </WordReveal>
          </div>
          <div className="space-y-24">
            {t.decors.map((d, i) => (
              <div key={i}>
                <VoletsReveal className="relative w-full h-[50vh] sm:h-[74vh] zoom-wrap">
                  <Parallax speed={-0.06} className="absolute inset-0 -top-14 -bottom-14">
                    <img src={DECOR_IMG[i].src} alt={d.t} className="w-full h-full object-cover" style={{ objectPosition: DECOR_IMG[i].pos }} />
                  </Parallax>
                </VoletsReveal>
                <Reveal delay={120}>
                  <div className="max-w-2xl mx-auto px-8 mt-10 text-center">
                    <span className="mono text-[10px]" style={{ color: "#B5654A" }}>{d.n}</span>
                    <h3 className="display text-2xl sm:text-4xl mt-3 mb-4" style={{ fontWeight: 300 }}>{d.t}</h3>
                    <p className="body-font leading-relaxed max-w-xl mx-auto" style={{ color: "#5a4f42" }}>{d.d}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* LA MAISON */}
        <section id="maison" className="relative max-w-3xl mx-auto px-8 py-32 text-center">
          <FondAbstrait intensite={0.6} />
          <div className="relative">
            <Reveal><Eyebrow>{t.tournages.maisonE}</Eyebrow></Reveal>
            <WordReveal className="display text-4xl sm:text-6xl mb-8" style={{ fontWeight: 300 }}>
              {t.tournages.maisonT}
            </WordReveal>
            <Reveal delay={200}>
              <p className="body-font leading-relaxed max-w-xl mx-auto" style={{ color: "#5a4f42" }}>
                {t.tournages.maison1}
              </p>
              <p className="body-font leading-relaxed max-w-xl mx-auto mt-6" style={{ color: "#5a4f42" }}>
                {t.tournages.maison2}
              </p>
            </Reveal>
          </div>
        </section>

        {/* EN PRATIQUE */}
        <section id="pratique" className="relative max-w-5xl mx-auto px-8 py-24 text-center">
          <FondAbstrait intensite={0.5} />
          <div className="relative">
            <Reveal><Eyebrow>{t.tournages.pratiqueE}</Eyebrow></Reveal>
            <WordReveal className="display text-4xl sm:text-6xl mb-16" style={{ fontWeight: 300 }}>
              {t.tournages.pratiqueT}
            </WordReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {t.atouts.map((a, i) => (
                <Reveal key={i} delay={i * 110}>
                  <div className="text-center">
                    <span className="mono text-[10px]" style={{ color: "#B5654A" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="display text-2xl mt-4 mb-3" style={{ fontWeight: 400 }}>{a.t}</h3>
                    <p className="body-font text-sm leading-relaxed" style={{ color: "#5a4f42" }}>{a.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <p className="body-font text-sm mt-16 max-w-xl mx-auto" style={{ color: "#8a7d63" }}>
                {t.tournages.pratiqueN}
              </p>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <footer id="contact-t" style={{ background: "#2B2118", color: "#EDE4D3" }}>
          <div className="max-w-3xl mx-auto px-8 py-28 text-center">
            <Reveal>
              <Eyebrow light>{t.tournages.contactE}</Eyebrow>
              <p className="display text-4xl sm:text-6xl leading-tight" style={{ fontWeight: 300 }}>
                {t.tournages.contactT}
              </p>
              <p className="body-font text-sm mt-8 max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(237,228,211,.75)" }}>
                {t.tournages.contactP}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-14 space-y-4">
                <a href="mailto:contact@daughterofgaia.com" className="body-font text-sm flex items-center justify-center gap-3 link-u w-fit mx-auto min-h-[44px] py-2">
                  <Mail size={14} /> contact@daughterofgaia.com
                </a>
                <a href="tel:+21628980970" className="body-font text-sm flex items-center justify-center gap-3 link-u w-fit mx-auto min-h-[44px] py-2">
                  <Phone size={14} /> +216 28 980 970
                </a>
                <p className="body-font text-sm flex items-center justify-center gap-3" style={{ color: "rgba(237,228,211,.82)" }}>
                  <MapPin size={14} /> 64 avenue Fattouma Bourguiba, Soukra, Tunis
                </p>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <button onClick={() => allerA("accueil")}
                className="body-font text-[10px] uppercase tracking-[0.25em] inline-flex items-center gap-3 mt-16 min-h-[44px] px-2 link-u"
                style={{ color: "rgba(237,228,211,.6)" }}>
                <ArrowLeft size={12} /> {t.tournages.retour}
              </button>
            </Reveal>
          </div>
        </footer>
      </div>
    );
  }

  /* ══════════ SITE ══════════ */
  return (
    <div style={{ background: "#EDE4D3", color: "#2B2118", overflowX: "clip" }} className="min-h-screen">
      {styleTag}
      <Rideau />
      <Grain />
      <Progression />

      {/* ── HERO ── */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translate3d(0,${scrollY * 0.32}px,0)` }}>
          <Diaporama images={[
            { src: IMAGES.animaux, alt: t.refuge.alt, pos: "58% center" },
            { src: IMAGES.lieu, alt: t.domaine.alt, pos: "center 45%" },
            { src: IMAGES.hero, alt: t.galerie.legendes[1], pos: "center" },
          ]} />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,14,8,.52) 0%, rgba(20,14,8,.26) 34%, rgba(20,14,8,.42) 66%, rgba(20,14,8,.74) 100%)" }} />
        <LumiereFiltree />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pb-20 sm:pb-14"
          style={{ opacity: Math.max(0, 1 - scrollY / 620) }}>
          {selecteurHero}
          <p className="fi mono uppercase tracking-[0.45em] text-[9px] sm:text-[11px] mb-10"
            style={{ color: "rgba(246,241,231,.82)", animationDelay: "2.4s" }}>
            {t.hero.sur}
          </p>

          <h1 className="display leading-[0.94] px-2" style={{ color: "#F6F1E7", fontWeight: 300 }}>
            <LetterReveal className="block text-[15vw] sm:text-[7.5rem] lg:text-[10rem]" delay={2600}
              style={{ letterSpacing: "-0.015em", textShadow: "0 4px 40px rgba(0,0,0,.35)" }}>
              Daughter of Gaïa
            </LetterReveal>
          </h1>

          <p className="fu body-font text-base sm:text-xl max-w-xl leading-relaxed mt-12"
            style={{ color: "rgba(246,241,231,.94)", animationDelay: "3.7s", textShadow: "0 2px 20px rgba(0,0,0,.4)" }}>
            {t.hero.accroche}
          </p>

          <div className="fu flex flex-col sm:flex-row items-center gap-5 mt-12" style={{ animationDelay: "4s" }}>
            <Magnetique href="#mission" onClick={versSuite} className="btn btn-solid body-font px-11 py-4 text-[11px] uppercase tracking-[0.28em] inline-block"
              style={{ background: "#F6F1E7", color: "#2B2118" }}><span>{t.hero.btn1}</span></Magnetique>
            <Magnetique href="#devis" onClick={versDevis} className="body-font link-u text-[11px] uppercase tracking-[0.28em] px-3 py-4 inline-block"
              style={{ color: "rgba(246,241,231,.88)" }}>{t.hero.btn2}</Magnetique>
          </div>
        </div>

        <div className="absolute bottom-7 inset-x-0 flex justify-center z-10 pointer-events-none">
          <a href="#mission" onClick={versSuite} className="cue pointer-events-auto p-3" aria-label="Faire défiler">
            <ChevronDown size={20} color="rgba(246,241,231,.8)" />
          </a>
        </div>
      </section>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-40 transition-all duration-700"
        style={{ background: navSolid ? "rgba(237,228,211,.94)" : "rgba(237,228,211,0)", backdropFilter: navSolid ? "blur(8px)" : "none" }}>
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col items-center gap-3 transition-opacity duration-500"
          style={{ opacity: navSolid ? 1 : 0, pointerEvents: navSolid ? "auto" : "none" }}>

          {/* Sur mobile le nom se décale pour laisser place au bouton menu */}
          <div className="w-full flex items-center justify-center relative">
            <a href="#" className="display text-base tracking-[0.08em] flex items-center min-h-[44px]">Daughter of Gaïa</a>
            <button onClick={() => setMenuOuvert(true)}
              className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end justify-center gap-[5px] w-11 h-11"
              aria-label={t.nav.ouvrirMenu} aria-expanded={menuOuvert}>
              <span className="block h-px w-6 transition-all duration-500" style={{ background: "#2B2118" }} />
              <span className="block h-px w-4 transition-all duration-500" style={{ background: "#2B2118" }} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8 mono text-[10px] uppercase tracking-[0.2em] leading-none" style={{ color: "#6B7355" }}>
            <a href="#domaine" className="link-u">{t.nav.domaine}</a>
            <a href="#histoire" className="link-u">{t.nav.histoire}</a>
            <a href="#experiences" className="link-u">{t.nav.experiences}</a>
            <a href="#galerie" className="link-u">{t.nav.galerie}</a>
            <a href="#refuge" className="link-u">{t.nav.refuge}</a>
            <button onClick={() => allerA("tournages")} className="link-u uppercase tracking-[0.2em]">{t.nav.tournages}</button>
            <a href="#disponibilites" className="link-u">{t.nav.dispo}</a>
            <a href="#devis" onClick={versDevis} className="link-u" style={{ color: "#B5654A" }}>{t.nav.devis}</a>
            {selecteurNav}
          </div>
        </div>
      </nav>

      {/* ── MENU MOBILE ── */}
      <MenuMobile ouvert={menuOuvert} fermer={() => setMenuOuvert(false)}
        t={t} lang={lang} setLang={setLang}
        entrees={[
          { href: "#domaine", texte: t.nav.domaine },
          { href: "#histoire", texte: t.nav.histoire },
          { href: "#experiences", texte: t.nav.experiences },
          { href: "#galerie", texte: t.nav.galerie },
          { href: "#refuge", texte: t.nav.refuge },
          { href: "#disponibilites", texte: t.nav.dispo },
          { texte: t.nav.tournages, onClick: () => allerA("tournages") },
          { href: "#devis", texte: t.nav.devis, accent: true, onClick: versDevis },
        ]} />

      {/* ── MISSION ── */}
      <section id="mission" className="relative max-w-4xl mx-auto px-8 pt-32 sm:pt-44 pb-24 sm:pb-32 text-center">
        <FondAbstrait intensite={0.9} />
        <div className="relative">
        <Reveal>
          <WordReveal className="display text-3xl sm:text-5xl leading-[1.15]" style={{ fontWeight: 300 }}>
            {t.mission.titre}
          </WordReveal>
        </Reveal>
        <Reveal delay={400}>
          <p className="body-font text-sm sm:text-base mt-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#5a4f42" }}>
            {t.mission.texte}
          </p>
        </Reveal>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="max-w-6xl mx-auto px-8 pt-20 sm:pt-28 pb-36">
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10">
          {t.valeurs.map((v, i) => (
            <Reveal key={i} delay={i * 130}>
              <div className="text-center px-2">
                <span className="mono text-[10px]" style={{ color: "#B5654A" }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-2xl mt-4 mb-3" style={{ fontWeight: 400 }}>{v.t}</h3>
                <p className="body-font text-sm leading-relaxed" style={{ color: "#5a4f42" }}>{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LE DOMAINE ── */}
      <section id="domaine" className="relative py-24">
        <FondAbstrait intensite={0.55} />
        <div className="relative max-w-3xl mx-auto px-8 text-center">
          <Reveal><Eyebrow>{t.domaine.eyebrow}</Eyebrow></Reveal>
          <WordReveal className="display text-4xl sm:text-6xl mb-8" style={{ fontWeight: 300 }}>
            {t.domaine.titre}
          </WordReveal>
          <MaskText delay={160} className="body-font leading-relaxed max-w-xl mx-auto" style={{ color: "#5a4f42" }}>
            {t.domaine.texte}
          </MaskText>
          <Reveal delay={320}>
            <p className="display italic text-xl sm:text-2xl mt-9 max-w-2xl mx-auto leading-snug" style={{ color: "#6B7355", fontWeight: 300 }}>
              {t.domaine.citation}
            </p>
          </Reveal>
        </div>

        <VoletsReveal className="relative w-full h-[52vh] sm:h-[72vh] mt-16 overflow-hidden">
          <LumiereFiltree />
          <Parallax speed={-0.07} className="absolute inset-0 -top-16 -bottom-16">
            <Photo src={IMAGES.lieu} alt={t.domaine.alt} className="w-full h-full" tone={1} pos="center 45%" />
          </Parallax>
        </VoletsReveal>

        <div className="relative max-w-5xl mx-auto px-8 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-14 gap-x-8 max-w-3xl mx-auto">
            {t.espaces.map((e, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="text-center">
                  <p className="display text-3xl sm:text-4xl" style={{ fontWeight: 300 }}>
                    {/^\d/.test(e.v) ? <CountUp value={e.v} delay={i * 160} /> : e.v}
                  </p>
                  <p className="mono text-[9px] uppercase tracking-[0.2em] mt-2.5" style={{ color: "#6B7355" }}>{e.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTOIRE ── */}
      <section id="histoire" className="py-24">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Reveal><Eyebrow>{t.histoire.eyebrow}</Eyebrow></Reveal>
          <WordReveal className="display text-4xl sm:text-6xl mb-10" style={{ fontWeight: 300 }}>
            {t.histoire.titre}
          </WordReveal>
          <MaskText delay={120} className="body-font text-lg leading-relaxed mb-7 max-w-2xl mx-auto" style={{ color: "#3f362b" }}>
            {t.histoire.p0}
          </MaskText>
          <Reveal delay={240}>
            <div className="max-w-2xl mx-auto space-y-6 body-font leading-relaxed" style={{ color: "#5a4f42" }}>
              <p>
                {t.histoire.p1}
              </p>
              <p>
                {t.histoire.p2}
              </p>
              <p>
                {t.histoire.p3}
              </p>
              <p>
                {t.histoire.p4}
              </p>
            </div>
            <p className="display italic text-xl sm:text-2xl mt-14 max-w-xl mx-auto" style={{ color: "#B5654A", fontWeight: 300 }}>
              {t.histoire.citation}
            </p>
          </Reveal>
        </div>

        <VoletsReveal className="relative w-full h-[48vh] sm:h-[66vh] mt-20 overflow-hidden">
          <Parallax speed={-0.06} className="absolute inset-0 -top-16 -bottom-16">
            <Photo src={IMAGES.histoire} alt={t.histoire.alt} className="w-full h-full" tone={2} pos="center 45%" />
          </Parallax>
        </VoletsReveal>
      </section>

      {/* ── EXPÉRIENCES ── */}
      <section id="experiences" className="relative max-w-4xl mx-auto px-8 py-28 text-center">
        <FondAbstrait intensite={0.7} />
        <div className="relative">
        <Reveal><Eyebrow>{t.experiences.eyebrow}</Eyebrow></Reveal>
        <WordReveal className="display text-4xl sm:text-6xl mb-16" style={{ fontWeight: 300 }}>
          {t.experiences.titre}
        </WordReveal>
        <div className="space-y-12">
          {t.prestations.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <div>
                <span className="mono text-[10px] block mb-3" style={{ color: "#B5654A" }}>{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <h3 className="display text-2xl sm:text-3xl" style={{ fontWeight: 400 }}>{p.t}</h3>
                  {p.soon && <span className="mono text-[8px] uppercase tracking-[0.2em] px-2 py-1" style={{ color: "#6B7355", background: "#e5dcc8" }}>{t.experiences.bientot}</span>}
                </div>
                <p className="body-font text-sm mt-3 leading-relaxed max-w-lg mx-auto" style={{ color: "#5a4f42" }}>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="body-font text-sm mt-16 max-w-xl mx-auto" style={{ color: "#8a7d63" }}>
            {t.experiences.note}
          </p>
        </Reveal>
        </div>
      </section>

      {/* ── BANDEAU ── */}
      <div className="overflow-hidden py-10">
        <div className="marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="flex items-center">
              {t.bandeau.map((mot, i) => (
                <span key={i} className="display text-2xl sm:text-4xl flex items-center" style={{ color: "#c0b298", fontWeight: 300 }}>
                  <span className="px-10">{mot}</span>
                  <span style={{ color: "#B5654A", fontSize: ".4em" }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── APPEL TOURNAGES ── */}
      <section className="relative w-full overflow-hidden my-16">
        <button onClick={() => allerA("tournages")} className="block w-full text-left group">
          <VoletsReveal className="relative w-full h-[56vh] sm:h-[70vh]">
            <img src={V_PERGOLA} alt={t.decors[0].t}
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              style={{ objectPosition: "center 55%" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,14,8,.30), rgba(20,14,8,.70))" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <Reveal><Eyebrow light>{t.appel.eyebrow}</Eyebrow></Reveal>
              <WordReveal className="display text-4xl sm:text-6xl mb-6 max-w-3xl" style={{ color: "#F6F1E7", fontWeight: 300 }}>
                {t.appel.titre}
              </WordReveal>
              <Reveal delay={200}>
                <p className="body-font max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(246,241,231,.9)" }}>
                  {t.appel.texte}
                </p>
                <span className="body-font inline-flex items-center gap-3 mt-9 text-[11px] uppercase tracking-[0.28em] link-u"
                  style={{ color: "#F6F1E7" }}>{t.appel.lien} <ArrowRight size={14} /></span>
              </Reveal>
            </div>
          </VoletsReveal>
        </button>
      </section>

      {/* ── GALERIE ── */}
      <section id="galerie" className="pt-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Reveal><Eyebrow>{t.galerie.eyebrow}</Eyebrow></Reveal>
          <WordReveal className="display text-4xl sm:text-6xl mb-6" style={{ fontWeight: 300 }}>
            {t.galerie.titre}
          </WordReveal>
          <Reveal delay={200}>
            <p className="mono text-[10px] uppercase tracking-[0.24em] mb-4 tick flex items-center justify-center gap-3" style={{ color: "#9a8f76" }}>
              {t.galerie.faire} <ArrowRight size={12} />
            </p>
          </Reveal>
        </div>
        <GalerieHorizontale items={[
          { src: IMAGES.lieu, l: t.galerie.legendes[0], pos: "center 30%", w: "min(78vw,420px)", h: "min(64vh,560px)" },
          { src: IMAGES.hero, l: t.galerie.legendes[1], pos: "70% center", w: "min(88vw,640px)", h: "min(52vh,450px)" },
          { src: IMAGES.histoire, l: t.galerie.legendes[2], pos: "center 20%", w: "min(72vw,380px)", h: "min(68vh,590px)" },
          { src: IMAGES.animaux, l: t.galerie.legendes[3], pos: "45% center", w: "min(80vw,460px)", h: "min(58vh,510px)" },
          { src: P_TERRASSE, l: t.galerie.legendes[4], pos: "20% center", w: "min(86vw,600px)", h: "min(50vh,430px)" },
          { src: P_COUVERT, l: t.galerie.legendes[5], pos: "center 78%", w: "min(74vw,400px)", h: "min(66vh,575px)" },
        ]} />
      </section>

      {/* ── LE REFUGE ── */}
      <section id="refuge" className="relative min-h-[92svh] lg:min-h-[85vh] flex items-center overflow-hidden">
        <Projecteur className="absolute inset-0">
          <Photo src={IMAGES.animaux} alt={t.refuge.alt} className="w-full h-full" tone={3} zoom pos="62% center" />
          <div className="absolute inset-0" style={{ background: "rgba(22,16,10,.44)" }} />
          <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(to right, rgba(22,16,10,.66) 0%, rgba(22,16,10,.22) 62%, transparent 100%)" }} />
          <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(to bottom, rgba(22,16,10,.26) 0%, rgba(22,16,10,.6) 100%)" }} />
          <LumiereFiltree />
        </Projecteur>
        <div className="relative w-full max-w-6xl mx-auto px-8 sm:px-12 py-28">
          <div className="max-w-xl">
          <Reveal><Eyebrow light>{t.refuge.eyebrow}</Eyebrow></Reveal>
          <WordReveal className="display text-4xl sm:text-6xl mb-8" style={{ color: "#F6F1E7", fontWeight: 300 }}>
            {t.refuge.titre}
          </WordReveal>
          <Reveal delay={200}>
            <p className="body-font leading-relaxed" style={{ color: "rgba(246,241,231,.9)" }}>
              {t.refuge.p1}
            </p>
            <p className="body-font leading-relaxed mt-5" style={{ color: "rgba(246,241,231,.9)" }}>
              {t.refuge.p2}
            </p>
          </Reveal>
          <Reveal delay={340}>
            <ul className="body-font text-sm mt-12 space-y-4" style={{ color: "rgba(246,241,231,.82)" }}>
              {t.refuge.liste.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ── DISPONIBILITÉS ── */}
      <section id="disponibilites" className="relative max-w-3xl mx-auto px-8 py-28 text-center">
        <FondAbstrait intensite={0.6} />
        <div className="relative">
        <Reveal><Eyebrow>{t.dispo.eyebrow}</Eyebrow></Reveal>
        <WordReveal className="display text-4xl sm:text-6xl mb-12" style={{ fontWeight: 300 }}>
          {t.dispo.titre}
        </WordReveal>
        <Reveal delay={150}>
          {loading ? <Loader2 className="animate-spin mx-auto" color="#B5654A" /> : (
            <>
              <div className="flex justify-center">
                <Calendrier blocked={blocked} lang={lang} onDayClick={(k, label, isB) => {
                  if (isB) return; setSelectedDate(label); versDevis();
                }} />
              </div>
              <p className="mono text-[10px] uppercase tracking-[0.2em] mt-6" style={{ color: "#9a8f76" }}>
                {t.dispo.note}
              </p>
            </>
          )}
        </Reveal>
        </div>
      </section>

      {/* ── DEVIS ── */}
      <section id="devis" className="max-w-2xl mx-auto px-8 py-28 text-center">
        <Reveal><Eyebrow>{t.devis.eyebrow}</Eyebrow></Reveal>
        <WordReveal className="display text-4xl sm:text-6xl mb-6" style={{ fontWeight: 300 }}>
          {t.devis.titre}
        </WordReveal>
        <Reveal delay={150}>
          <p className="body-font text-sm mb-14 leading-relaxed max-w-lg mx-auto" style={{ color: "#5a4f42" }}>
            {t.devis.texte}
          </p>
          {submitted ? (
            <div className="fu py-10">
              <p className="display text-3xl mb-4" style={{ fontWeight: 300 }}>{t.devis.merci}</p>
              <p className="body-font text-sm max-w-md mx-auto" style={{ color: "#5a4f42" }}>
                {t.devis.confirm1}{selectedDate ? ` ${t.devis.confirm2} ${selectedDate}` : ""}. {t.devis.confirm3}
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8 text-left">
              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.date}</label>
                <input type="text" readOnly value={selectedDate || ""} placeholder={t.devis.datePh}
                  className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }} />
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.nom}</label>
                  <input id="champ-nom" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }} /></div>
                <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.email}</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.tel}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }} /></div>
                <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.invites}</label>
                  <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }} /></div>
              </div>
              <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.type}</label>
                <select value={form.type || t.prestations[0].t} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm text-center" style={{ borderBottom: "1px solid #C7B79A" }}>
                  {t.prestations.map((p) => <option key={p.t}>{p.t}</option>)}<option>{t.devis.autre}</option>
                </select></div>
              <div><label className="mono text-[9px] uppercase tracking-[0.25em] block text-center" style={{ color: "#6B7355" }}>{t.devis.projet}</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t.devis.projetPh}
                  className="body-font w-full mt-3 px-0 py-3 bg-transparent text-sm resize-none text-center" style={{ borderBottom: "1px solid #C7B79A" }} /></div>
              <div className="text-center pt-4">
                <button type="submit" className="btn btn-solid body-font px-12 py-4 text-[11px] uppercase tracking-[0.28em]"
                  style={{ background: "#6B7355", color: "#F6F1E7" }}><span>{t.devis.envoyer}</span></button>
              </div>
            </form>
          )}
        </Reveal>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative max-w-2xl mx-auto px-8 py-28 text-center">
        <FondAbstrait intensite={0.5} />
        <div className="relative">
        <Reveal><Eyebrow>{t.faqT.eyebrow}</Eyebrow></Reveal>
        <WordReveal className="display text-4xl sm:text-6xl mb-14" style={{ fontWeight: 300 }}>
          {t.faqT.titre}
        </WordReveal>
        <div className="space-y-3">
          {t.faq.map((f, i) => <FaqItem key={i} {...f} i={i} />)}
        </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <footer id="contact" style={{ background: "#2B2118", color: "#EDE4D3" }}>
        <div className="max-w-4xl mx-auto px-8 py-28 text-center">
          <Reveal>
            <p className="display text-4xl sm:text-6xl" style={{ fontWeight: 300 }}>Daughter of Gaïa</p>
            <p className="mono uppercase tracking-[0.4em] text-[9px] mt-6" style={{ color: "rgba(237,228,211,.55)" }}>
              {t.contact.sur}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-20 space-y-4">
              <a href="mailto:contact@daughterofgaia.com" className="body-font text-sm flex items-center justify-center gap-3 link-u w-fit mx-auto min-h-[44px] py-2">
                <Mail size={14} /> contact@daughterofgaia.com
              </a>
              <a href="tel:+21628980970" className="body-font text-sm flex items-center justify-center gap-3 link-u w-fit mx-auto min-h-[44px] py-2">
                <Phone size={14} /> +216 28 980 970
              </a>
              <p className="body-font text-sm flex items-center justify-center gap-3" style={{ color: "rgba(237,228,211,.82)" }}>
                <MapPin size={14} /> 64 avenue Fattouma Bourguiba, Soukra, Tunis
              </p>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <p className="body-font text-xs mt-10" style={{ color: "rgba(237,228,211,.5)" }}>
              {t.contact.acces}
            </p>
            <div className="mt-12">
              <a href="#devis" onClick={versDevis} className="btn body-font inline-block px-10 py-4 text-[10px] uppercase tracking-[0.25em]"
                style={{ border: "1px solid rgba(237,228,211,.4)", color: "#EDE4D3" }}><span>{t.contact.devis}</span></a>
            </div>
            <button onClick={() => setAdminOpen(true)} className="mono text-[10px] flex items-center gap-2 mt-14 mx-auto px-4 min-h-[44px] opacity-40 hover:opacity-90 transition-opacity">
              <Lock size={10} /> {t.contact.admin}
            </button>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
