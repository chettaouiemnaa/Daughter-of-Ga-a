import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* ═══════════════════════════════════════════════════════════════
   Génération des photographies du site avec Higgsfield (Soul).

   Le site est une vitrine : ses images sont des fichiers statiques
   servis depuis public/images. On ne génère donc rien pendant la
   visite — ce serait lent, payant à chaque affichage, et la clé
   d'API se retrouverait dans le navigateur. Ce script se lance à
   la main, une fois, et écrit le fichier sur le disque.

   Usage :
     node generer-images.mjs                 la liste des photos
     node generer-images.mjs pergola salon   génère celles-ci
     node generer-images.mjs --tous          génère tout
     node generer-images.mjs pergola --remplacer   écrase l'existant

   Identifiants (les mêmes noms que le SDK officiel) :
     HF_CREDENTIALS="cle:secret"
     ou HF_API_KEY / HF_API_SECRET
   Ils se créent sur https://higgsfield.ai, espace API.
   ═══════════════════════════════════════════════════════════════ */

const BASE = "https://platform.higgsfield.ai";
/* Chemin absolu : le script marche quel que soit le dossier
   depuis lequel on le lance. */
const DOSSIER = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "public/images"
);

/* Formats acceptés par Soul. La liste est fermée : toute autre
   valeur est refusée par l'API. */
const FORMAT = {
  PAYSAGE_LARGE: "2048x1152",
  PAYSAGE: "2048x1536",
  CARRE: "1536x1536",
  PORTRAIT: "1536x2048",
};

/* Le vocabulaire visuel du site, répété dans chaque description :
   lumière basse, sable et olive, aucune personne au premier plan,
   photographie et non illustration. */
const STYLE =
  "photographie d'architecture et d'hôtellerie, lumière naturelle douce, " +
  "palette sable, olive et terracotta, méditerranéen tunisien, " +
  "grain argentique léger, aucune personne reconnaissable, " +
  "pas de texte ni de logo dans l'image";

/* Une entrée par fichier de public/images. Le nom de la clé est le
   nom du fichier écrit. Modifier la description ici, relancer, et
   la photo est remplacée. */
const PHOTOS = {
  "bar-nuit": {
    format: FORMAT.PAYSAGE_LARGE,
    sujet:
      "bar extérieur d'un domaine privé à la tombée de la nuit, comptoir en " +
      "bois patiné, guirlandes d'ampoules chaudes, oliviers en arrière-plan, " +
      "verres posés, ambiance calme avant l'arrivée des invités",
  },
  "cheval-bar": {
    format: FORMAT.PAYSAGE_LARGE,
    sujet:
      "un cheval bai debout près d'une clôture en bois au crépuscule, " +
      "un bâtiment bas éclairé au loin, poussière en suspension dans la lumière",
  },
  domaine: {
    format: FORMAT.PAYSAGE_LARGE,
    sujet:
      "vue d'ensemble d'un domaine privé en fin d'après-midi, allée bordée " +
      "d'oliviers, murs blanchis à la chaux, jardin sec, ciel dégagé",
  },
  "espace-couvert": {
    format: FORMAT.PAYSAGE,
    sujet:
      "grand espace de réception couvert, charpente en bois clair, tables " +
      "dressées en lin écru, ouverture sur le jardin, lumière traversante",
  },
  "jardin-bougainvilliers": {
    format: FORMAT.PAYSAGE,
    sujet:
      "mur blanc couvert de bougainvilliers en fleur, sol en terre battue, " +
      "ombres portées du milieu de journée",
  },
  lanternes: {
    format: FORMAT.PORTRAIT,
    sujet:
      "lanternes en métal ajouré suspendues au-dessus d'une allée de jardin, " +
      "flammes de bougies, nuit tiède, arrière-plan flou",
  },
  palmiers: {
    format: FORMAT.PORTRAIT,
    sujet:
      "hauts palmiers dattiers vus depuis le sol, lumière rasante de fin de " +
      "journée, ciel pâle",
  },
  partage: {
    format: FORMAT.CARRE,
    sujet:
      "grande table de banquet en bois vue de dessus, plats méditerranéens " +
      "partagés, céramique artisanale, nappe en lin froissé",
  },
  pergola: {
    format: FORMAT.PAYSAGE,
    sujet:
      "pergola en bois habillée de plantes grimpantes, longue table dessous, " +
      "lumière filtrée par le feuillage, dallage en pierre claire",
  },
  piscine: {
    format: FORMAT.PAYSAGE,
    sujet:
      "piscine rectangulaire calme bordée de pierre claire, transats en toile " +
      "écrue, palmiers reflétés à la surface, milieu de matinée",
  },
  salon: {
    format: FORMAT.PAYSAGE,
    sujet:
      "salon intérieur d'une villa méditerranéenne, murs chaulés, banquettes " +
      "basses en tissu naturel, tapis berbère, lumière entrant par une " +
      "grande ouverture",
  },
  terrasse: {
    format: FORMAT.PAYSAGE_LARGE,
    sujet:
      "terrasse en pierre surplombant le jardin, mobilier bas en bois, " +
      "coussins écrus, fin d'après-midi",
  },
  "tournage-hero": {
    format: FORMAT.PAYSAGE_LARGE,
    sujet:
      "villa méditerranéenne blanche vue depuis le jardin, façade épurée, " +
      "cadrage large et symétrique adapté à un décor de tournage",
  },
};

/* ── Identifiants ─────────────────────────────────────────────── */

function identifiants() {
  const paire = process.env.HF_CREDENTIALS || process.env.HF_KEY;
  if (paire && paire.includes(":")) {
    const [cle, secret] = paire.split(":");
    if (cle && secret) return { cle, secret };
  }
  const cle = process.env.HF_API_KEY;
  const secret = process.env.HF_API_SECRET;
  if (cle && secret) return { cle, secret };
  throw new Error(
    "Identifiants Higgsfield absents. Exportez HF_CREDENTIALS=\"cle:secret\" " +
      "ou HF_API_KEY et HF_API_SECRET."
  );
}

async function appel(chemin, options = {}) {
  const { cle, secret } = identifiants();
  const r = await fetch(BASE + chemin, {
    ...options,
    headers: {
      "hf-api-key": cle,
      "hf-secret": secret,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const texte = await r.text();
  if (!r.ok) {
    const detail = texte.slice(0, 300).replace(/\s+/g, " ").trim();
    if (r.status === 401) throw new Error(`Identifiants refusés (401). ${detail}`);
    /* 403 : soit le compte n'a plus de crédits, soit la requête n'est
       jamais arrivée (proxy d'entreprise, réseau filtré). Le corps de
       la réponse tranche, on le montre. */
    if (r.status === 403)
      throw new Error(
        `Accès refusé (403) — crédits épuisés, ou requête bloquée avant ` +
          `d'atteindre Higgsfield. ${detail}`
      );
    throw new Error(`Higgsfield a répondu ${r.status} : ${detail}`);
  }
  return texte ? JSON.parse(texte) : null;
}

/* ── Génération ───────────────────────────────────────────────── */

/* L'API est asynchrone : la requête rend un lot de tâches, qu'on
   interroge jusqu'à ce qu'elles aboutissent. */
async function generer(description, format) {
  const lot = await appel("/v1/text2image/soul", {
    method: "POST",
    body: JSON.stringify({
      params: {
        prompt: description,
        width_and_height: format,
        quality: "1080p",
        batch_size: 1,
      },
    }),
  });

  const debut = Date.now();
  const limite = 10 * 60 * 1000;
  let taches = lot.jobs || [];
  let fini = false;

  while (!fini) {
    fini =
      taches.length > 0 &&
      taches.every((t) =>
        ["completed", "failed", "nsfw", "canceled"].includes(t.status)
      );
    if (fini) break;
    if (Date.now() - debut > limite) {
      throw new Error("La génération dépasse dix minutes, abandon.");
    }
    await new Promise((r) => setTimeout(r, 3000));
    const etat = await appel(`/v1/job-sets/${lot.id}`);
    taches = etat.jobs || [];
  }

  const bonne = taches.find(
    (t) => t.status === "completed" && t.results?.raw?.url
  );
  if (!bonne) {
    /* « nsfw » arrive sur des descriptions parfaitement anodines :
       c'est le filtre du modèle, pas une erreur de votre part. */
    const statut = taches.map((t) => t.status).join(", ") || "aucune tâche";
    throw new Error(`Aucune image produite (${statut}).`);
  }
  return bonne.results.raw.url;
}

/* Higgsfield ne garde le fichier qu'une heure : on le rapatrie
   tout de suite. Passage par sharp quand il est installé, pour
   ne pas mettre en ligne un JPEG de plusieurs mégaoctets. */
async function telecharger(url, destination) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Téléchargement impossible (${r.status}).`);
  const brut = Buffer.from(await r.arrayBuffer());

  let final = brut;
  try {
    const { default: sharp } = await import("sharp");
    final = await sharp(brut)
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    console.warn("   sharp absent : image enregistrée sans compression.");
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, final);
  return final.length;
}

/* ── Entrée ───────────────────────────────────────────────────── */

async function main() {
  const args = process.argv.slice(2);
  const remplacer = args.includes("--remplacer");
  const tous = args.includes("--tous");
  const noms = args.filter((a) => !a.startsWith("--"));

  const aFaire = tous ? Object.keys(PHOTOS) : noms;

  if (aFaire.length === 0) {
    console.log("Photos disponibles :\n");
    for (const [nom, p] of Object.entries(PHOTOS)) {
      console.log(`  ${nom.padEnd(24)} ${p.format}`);
    }
    console.log("\nnode generer-images.mjs <nom> [<nom>…] [--remplacer]");
    console.log("node generer-images.mjs --tous");
    return;
  }

  const inconnus = aFaire.filter((n) => !PHOTOS[n]);
  if (inconnus.length) {
    throw new Error(`Photo inconnue : ${inconnus.join(", ")}`);
  }

  identifiants();   // échoue tout de suite plutôt qu'après la première image

  for (const nom of aFaire) {
    const destination = path.join(DOSSIER, `${nom}.jpg`);
    const existe = await fs
      .access(destination)
      .then(() => true)
      .catch(() => false);

    if (existe && !remplacer) {
      console.log(`${nom} : le fichier existe déjà, ignoré (--remplacer pour l'écraser).`);
      continue;
    }

    const { sujet, format } = PHOTOS[nom];
    console.log(`${nom} : génération…`);
    try {
      const url = await generer(`${sujet}. ${STYLE}`, format);
      const octets = await telecharger(url, destination);
      console.log(
        `   → ${path.relative(process.cwd(), destination)} (${Math.round(octets / 1024)} ko)`
      );
    } catch (e) {
      console.error(`   × ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
