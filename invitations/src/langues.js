/* Textes fixes de l'invitation, dans les trois langues.
   Les textes saisis par le client (noms, titre, programme…) restent dans sa langue ;
   nous les traduisons à la livraison. */

const NB_FR = ["une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];
const NB_EN = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export const T = {
  fr: {
    intro: "Une invitation vous attend",
    introPour: g => `Une invitation pour ${g}`,
    toucher: "Touchez le cachet pour découvrir",
    phrase: (pl, inv) => `${pl ? "ont" : "a"} le plaisir de ${inv ? "convier" : "vous convier"}`,
    heures: (a, b) => (b ? `de ${h(a)} à ${h(b)}` : `à ${h(a)}`),
    rebours: n => (n === 0 ? "C'est aujourd'hui" : n === 1 ? "C'est demain" : `Dans ${n} jours`),
    infos: "Informations",
    programme: "Au programme",
    dress: "Dress code",
    acces: "Accès",
    itineraire: "Itinéraire",
    calendrier: "Ajouter au calendrier",
    rappel: "Un rappel vous sera envoyé la veille.",
    votre: "Votre invitation",
    places: n => `Valable pour ${NB_FR[n - 1] || n} personne${n > 1 ? "s" : ""}`,
    confirmer: "Confirmer ma présence",
    noteWa: "La confirmation s'ouvre dans WhatsApp, avec un message déjà prêt.",
    oui: "Je serai présent·e",
    non: "Je ne pourrai pas venir",
    merci: "Merci, votre réponse est enregistrée.",
    participation: p => `Participation : ${p} par personne`,
    reserver: "Réserver ma place",
    qr: "Votre QR code d'entrée vous sera envoyé après confirmation.",
    galerie: "Galerie",
    souvenirs: "Page souvenirs",
    souvenirsTxt: "Après l'événement, déposez ici vos photos de la soirée.",
    contact: "Contact",
    msg: (g, n, d) => `Bonjour${g ? `, c'est ${g}` : ""}. ${n > 1 ? `Je vous confirme notre présence (${NB_FR[n - 1] || n} personnes)` : "Je vous confirme ma présence"} le ${d}. À très bientôt !`,
  },
  en: {
    intro: "An invitation awaits you",
    introPour: g => `An invitation for ${g}`,
    toucher: "Tap the seal to open",
    phrase: (pl, inv) => `${pl ? "are" : "is"} delighted to invite${inv ? "" : " you"}`,
    heures: (a, b) => (b ? `from ${a} to ${b}` : `at ${a}`),
    rebours: n => (n === 0 ? "It's today" : n === 1 ? "It's tomorrow" : `In ${n} days`),
    infos: "Details",
    programme: "Programme",
    dress: "Dress code",
    acces: "Getting there",
    itineraire: "Directions",
    calendrier: "Add to calendar",
    rappel: "We'll send you a reminder the day before.",
    votre: "Your invitation",
    places: n => `Valid for ${NB_EN[n - 1] || n} guest${n > 1 ? "s" : ""}`,
    confirmer: "Confirm attendance",
    noteWa: "Confirmation opens in WhatsApp with a ready-made message.",
    oui: "I'll be there",
    non: "I can't make it",
    merci: "Thank you, your answer has been saved.",
    participation: p => `Ticket: ${p} per person`,
    reserver: "Book my seat",
    qr: "Your entry QR code will be sent after confirmation.",
    galerie: "Gallery",
    souvenirs: "Memories",
    souvenirsTxt: "After the event, share your photos of the evening here.",
    contact: "Contact",
    msg: (g, n, d) => `Hello${g ? `, this is ${g}` : ""}. ${n > 1 ? `I confirm we will attend (${n} guests)` : "I confirm I will attend"} on ${d}. See you soon!`,
  },
  ar: {
    intro: "دعوة في انتظارك",
    introPour: g => `دعوة خاصة بـ ${g}`,
    toucher: "المس الختم لفتح الدعوة",
    phrase: (pl, inv) => (inv ? "يسعدنا دعوة" : "يسعدنا دعوتكم"),
    heures: (a, b) => (b ? `من ${a} إلى ${b}` : `على الساعة ${a}`),
    rebours: n => (n === 0 ? "اليوم" : n === 1 ? "غدًا" : `بعد ${n} يومًا`),
    infos: "التفاصيل",
    programme: "البرنامج",
    dress: "اللباس",
    acces: "العنوان",
    itineraire: "الاتجاهات",
    calendrier: "أضف إلى التقويم",
    rappel: "سيصلك تذكير قبل يوم من المناسبة.",
    votre: "دعوتك",
    places: n => (n === 1 ? "صالحة لشخص واحد" : n === 2 ? "صالحة لشخصين" : `صالحة لـ ${n} أشخاص`),
    confirmer: "تأكيد الحضور",
    noteWa: "يُفتح التأكيد في واتساب برسالة جاهزة.",
    oui: "سأحضر",
    non: "لن أتمكن من الحضور",
    merci: "شكرًا، تم تسجيل ردك.",
    participation: p => `المساهمة: ${p} للشخص`,
    reserver: "احجز مكاني",
    qr: "سيصلك رمز الدخول (QR) بعد التأكيد.",
    galerie: "معرض الصور",
    souvenirs: "صفحة الذكريات",
    souvenirsTxt: "بعد المناسبة، شاركوا هنا صوركم من السهرة.",
    contact: "للتواصل",
    msg: (g, n, d) => `مرحبًا${g ? `، معكم ${g}` : ""}. ${n > 1 ? `أؤكد حضورنا (${n} أشخاص)` : "أؤكد حضوري"} يوم ${d}. إلى اللقاء!`,
  },
};

/* « 20:30 » → « 20 h 30 », « 11:00 » → « 11 h » */
function h(v) {
  const [hh, mm] = String(v || "").split(":");
  if (!hh) return "";
  return `${Number(hh)} h${mm && mm !== "00" ? ` ${mm}` : ""}`;
}

const LOCALE = { fr: "fr-FR", en: "en-GB", ar: "ar-TN-u-nu-latn" };

export function dateLongue(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d)) return "";
  const s = new Intl.DateTimeFormat(LOCALE[lang] || "fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  return lang === "ar" ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

export function joursRestants(iso) {
  if (!iso) return null;
  const cible = new Date(iso + "T00:00:00");
  const auj = new Date();
  auj.setHours(0, 0, 0, 0);
  const n = Math.round((cible - auj) / 86400000);
  return isNaN(n) || n < 0 ? null : n;
}
