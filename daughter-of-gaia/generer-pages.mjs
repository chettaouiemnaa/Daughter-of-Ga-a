import fs from "fs";
import path from "path";

/* ═══════════════════════════════════════════════════════════════
   Génère une page HTML distincte pour /tournages.

   Le site est une application où tout est construit par JavaScript.
   Sans ce traitement, l'adresse /tournages renverrait le HTML de
   l'accueil : Google y lirait le titre, la description et le texte
   de la page d'accueil, et ne pourrait pas la référencer sur ses
   propres termes. Ici, chaque adresse reçoit son propre HTML.
   ═══════════════════════════════════════════════════════════════ */

const DIST = "dist";
const source = path.join(DIST, "index.html");

if (!fs.existsSync(source)) {
  console.error("dist/index.html introuvable — lancez d'abord la construction du site.");
  process.exit(1);
}

let html = fs.readFileSync(source, "utf-8");

const TITRE = "Lieu de tournage près de Tunis — Daughter of Gaïa, La Soukra";
const DESCRIPTION =
  "Décor de tournage à 20 minutes de Tunis : cinq décors extérieurs, une maison entièrement filmable, lumière naturelle toute la journée et des chevaux sur place.";
const URL_PAGE = "https://www.daughterofgaia.com/tournages";

const CONTENU = `
      <div style="max-width:40rem;margin:4rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;line-height:1.7;color:#2B2118;">
        <h1 style="font-weight:400;">Lieu de tournage près de Tunis — Daughter of Gaïa</h1>

        <p>Daughter of Gaïa met son domaine privé de 4 000 m² à disposition des productions, à vingt minutes du centre de Tunis, à La Soukra (Ariana). Un décor qui n'a pas besoin d'être construit : cinq décors extérieurs, une maison entièrement filmable et de la lumière naturelle toute la journée.</p>

        <h2 style="font-weight:400;">Cinq décors extérieurs</h2>
        <p>Le salon de jardin sous la pergola, avec canapés en teck, four à pain en pierre et bougainvilliers en fleur. La piscine et le bar extérieur, arcades en pierre et bassin turquoise, plein sud. Le jardin sous les bougainvilliers, autour d'un olivier centenaire. La pelouse et les palmiers, dégagée et praticable pour les travellings. Le salon sous voûte de brique, plafond à chevrons, marbre et portes cintrées — un intérieur colonial que l'on ne reconstitue pas en studio.</p>

        <h2 style="font-weight:400;">Des chevaux dans le cadre, sans logistique</h2>
        <p>Des chevaux recueillis vivent sur le domaine et entrent naturellement à l'image, sans transport ni prestataire animalier extérieur.</p>

        <h2 style="font-weight:400;">Une base technique sur place</h2>
        <p>La maison accueille loges, maquillage, régie, repas d'équipe et stockage du matériel, dans un espace couvert, climatisé et fermé, à quelques pas des décors extérieurs. Quarante places de parking à l'entrée. Le domaine est réservé à une seule production à la fois, sans aucun événement en parallèle. L'hébergement n'est pas proposé sur place.</p>

        <h2 style="font-weight:400;">Organiser un repérage</h2>
        <p>Les tournages se déroulent en journée, afin de préserver la tranquillité des animaux et du voisinage. Chaque projet fait l'objet d'une visite technique préalable.</p>
        <p>
          Écrivez-nous à <a href="mailto:contact@daughterofgaia.com">contact@daughterofgaia.com</a>
          ou appelez le <a href="tel:+21628980970">+216 28 980 970</a>.<br />
          64 avenue Fattouma Bourguiba, La Soukra, Tunis.
          <a href="https://www.daughterofgaia.com/">Découvrir le domaine</a>
        </p>
      </div>`;

/* Questions propres au tournage. La page d'accueil a les siennes, tournées
   vers l'événementiel : les reprendre ici décrirait un contenu absent de
   cette page. */
const FAQ_TOURNAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où se situe le lieu de tournage ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "À La Soukra, dans le gouvernorat de l'Ariana, à une vingtaine de minutes du centre de Tunis. Adresse : 64 avenue Fattouma Bourguiba.",
      },
    },
    {
      "@type": "Question",
      name: "Quels décors sont disponibles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cinq décors extérieurs — un salon de jardin sous pergola avec four à pain en pierre, une piscine avec bar en brique et arcades, un jardin sous bougainvilliers autour d'un olivier centenaire, une pelouse dégagée bordée de palmiers — et un intérieur colonial sous voûte de brique, marbre et portes cintrées.",
      },
    },
    {
      "@type": "Question",
      name: "Des animaux peuvent-ils apparaître à l'image ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Des chevaux recueillis vivent sur le domaine et entrent naturellement dans le cadre, sans transport ni prestataire animalier extérieur.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles installations techniques sont prévues ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La maison accueille loges, maquillage, régie, repas d'équipe et stockage du matériel, dans un espace couvert, climatisé et fermé, à quelques pas des décors extérieurs. Quarante places de parking à l'entrée. L'hébergement n'est pas proposé sur place.",
      },
    },
    {
      "@type": "Question",
      name: "Plusieurs tournages peuvent-ils avoir lieu en même temps ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le domaine est réservé à une seule production à la fois, sans aucun événement en parallèle.",
      },
    },
    {
      "@type": "Question",
      name: "Comment organiser un repérage ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Chaque projet fait l'objet d'une visite technique préalable. Envoyez vos dates, la nature du projet et le nombre de personnes attendues à contact@daughterofgaia.com ou appelez le +216 28 980 970. Les tournages se déroulent en journée.",
      },
    },
  ],
};

/* Remplacements ciblés. Chacun est vérifié : si un motif ne correspond
   plus (après une refonte du gabarit), on s'arrête plutôt que de
   produire une page à moitié juste. */
const remplacements = [
  [/<title>[^<]*<\/title>/, `<title>${TITRE}</title>`],
  [/(<meta name="description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`],
  [/(<link rel="canonical" href=")[^"]*(")/, `$1${URL_PAGE}$2`],
  [/(<meta property="og:url" content=")[^"]*(")/, `$1${URL_PAGE}$2`],
  [/(<meta property="og:title" content=")[^"]*(")/, `$1Daughter of Gaïa — Lieu de tournage près de Tunis$2`],
  [/(<meta property="og:description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`],
  [/(<meta name="twitter:title" content=")[^"]*(")/, `$1Daughter of Gaïa — Lieu de tournage près de Tunis$2`],
  [/(<meta name="twitter:description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`],
  [/<noscript>.*?<\/noscript>/s, `<noscript>${CONTENU}\n    </noscript>`],
];

let echecs = 0;
for (const [re, remplacement] of remplacements) {
  if (!re.test(html)) {
    console.error("Motif introuvable :", re);
    echecs++;
    continue;
  }
  html = html.replace(re, remplacement);
}

/* Remplacement du bloc de questions, traité à part : une expression
   régulière couvrant plusieurs blocs de données structurées avalait aussi
   la fiche d'établissement. On repère donc chaque bloc individuellement. */
const blocs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
const blocFaq = blocs.find((b) => b[1].includes('"FAQPage"'));

if (!blocFaq) {
  console.error("Bloc de questions introuvable dans le gabarit.");
  echecs++;
} else {
  html =
    html.slice(0, blocFaq.index) +
    `<script type="application/ld+json">\n${JSON.stringify(FAQ_TOURNAGE, null, 2)}\n    </script>` +
    html.slice(blocFaq.index + blocFaq[0].length);
}

if (echecs > 0) {
  console.error(`\n${echecs} remplacement(s) impossible(s) — page non generee.`);
  process.exit(1);
}

const sortie = path.join(DIST, "tournages.html");
fs.writeFileSync(sortie, html, "utf-8");

const mots = (CONTENU.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean)).length;
console.log(`${sortie} genere — titre propre, ${mots} mots indexables`);
