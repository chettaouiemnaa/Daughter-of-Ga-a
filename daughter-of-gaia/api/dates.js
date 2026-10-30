import crypto from "node:crypto";
import { createClient } from "redis";

/* ═══════════════════════════════════════════════════════════════
   Disponibilités du domaine — stockage partagé et vérification du
   code propriétaire, côté serveur.

   Jusqu'ici les dates bloquées vivaient dans le navigateur de la
   personne qui les avait saisies : aucun visiteur ne les voyait.
   Elles sont désormais dans une base commune.

   Le code d'accès n'est plus dans le fichier du site (où n'importe
   qui pouvait le lire) mais dans une variable d'environnement,
   comparée ici, sur le serveur.
   ═══════════════════════════════════════════════════════════════ */

const CLE = "gaia-dates-bloquees";

/* Le code etait verifie sans limite : rien n'empechait un robot d'en essayer
   des milliers par minute. On compte les echecs par adresse, et on ferme la
   porte un quart d'heure au bout de cinq. */
const ESSAIS_MAX = 5;
const DUREE_BLOCAGE = 15 * 60;   // secondes

/* Selon le connecteur choisi, Vercel expose l'adresse sous des noms
   différents. On les accepte tous plutôt que d'en imposer un. */
const URL_BASE =
  process.env.REDIS_URL ||
  process.env.KV_URL ||
  process.env.STORAGE_URL;

const CODE = process.env.ADMIN_CODE;

/* Une fonction serverless peut servir plusieurs requêtes successives :
   on garde la connexion ouverte entre deux appels plutôt que de la
   rétablir à chaque fois. */
let clientPromesse = null;

async function client() {
  if (!URL_BASE) throw new Error("base_non_configuree");
  if (!clientPromesse) {
    const c = createClient({ url: URL_BASE });
    c.on("error", (e) => {
      console.error("Redis :", e && e.message);
      clientPromesse = null;   // la prochaine requête retentera une connexion
    });
    clientPromesse = c.connect().then(() => c);
  }
  return clientPromesse;
}

async function lireDates() {
  const c = await client();
  const brut = await c.get(CLE);
  if (!brut) return [];
  try {
    const v = JSON.parse(brut);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

async function ecrireDates(dates) {
  const c = await client();
  await c.set(CLE, JSON.stringify(dates));
}

/* Comparaison à durée constante : une comparaison ordinaire s'arrête au
   premier caractère différent, ce qui laisse deviner le code peu à peu. */
function codeValide(fourni) {
  if (!CODE || typeof fourni !== "string") return false;
  const a = Buffer.from(String(fourni));
  const b = Buffer.from(String(CODE));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(b, b);   // durée comparable, ne révèle pas la longueur
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

/* Derriere Vercel, l'adresse du visiteur arrive dans x-forwarded-for ;
   la premiere valeur de la liste est celle du client. */
function adresse(req) {
  const entete = req.headers["x-forwarded-for"];
  const premiere = (Array.isArray(entete) ? entete[0] : String(entete || "")).split(",")[0];
  return premiere.trim() || (req.socket && req.socket.remoteAddress) || "inconnue";
}

const cleEssais = (ip) => `gaia-essais:${ip}`;

async function essaisRecents(ip) {
  const c = await client();
  return Number(await c.get(cleEssais(ip))) || 0;
}

/* Le compteur expire de lui-meme : le premier echec arme le delai. */
async function noterEchec(ip) {
  const c = await client();
  const cle = cleEssais(ip);
  const n = await c.incr(cle);
  if (n === 1) await c.expire(cle, DUREE_BLOCAGE);
  return n;
}

async function oublierEchecs(ip) {
  const c = await client();
  await c.del(cleEssais(ip));
}

/* Une date valide ressemble à 2026-7-20 (année-mois-jour, sans zéro devant) */
function dateValide(d) {
  return typeof d === "string" && /^\d{4}-\d{1,2}-\d{1,2}$/.test(d);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    /* ── Lecture publique : le calendrier du site en a besoin ── */
    if (req.method === "GET") {
      return res.status(200).json({ dates: await lireDates() });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ erreur: "methode_non_autorisee" });
    }

    const corps = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { code, action, date } = corps;

    if (!CODE) return res.status(500).json({ erreur: "code_non_configure" });

    const ip = adresse(req);
    if (await essaisRecents(ip) >= ESSAIS_MAX) {
      res.setHeader("Retry-After", String(DUREE_BLOCAGE));
      return res.status(429).json({ erreur: "trop_d_essais" });
    }
    if (!codeValide(code)) {
      const n = await noterEchec(ip);
      return res.status(401).json({ erreur: "code_incorrect", restants: Math.max(0, ESSAIS_MAX - n) });
    }
    await oublierEchecs(ip);

    /* ── Vérification du code seule (écran de connexion) ── */
    if (action === "verifier") {
      return res.status(200).json({ ok: true, dates: await lireDates() });
    }

    /* ── Bloquer ou libérer une date ── */
    if (action === "basculer") {
      if (!dateValide(date)) return res.status(400).json({ erreur: "date_invalide" });
      const dates = await lireDates();
      const i = dates.indexOf(date);
      if (i === -1) dates.push(date);
      else dates.splice(i, 1);
      await ecrireDates(dates);
      return res.status(200).json({ ok: true, dates });
    }

    return res.status(400).json({ erreur: "action_inconnue" });
  } catch (e) {
    const message = String(e && e.message);
    if (message === "base_non_configuree") {
      return res.status(503).json({ erreur: "base_non_configuree" });
    }
    console.error("api/dates :", e);
    return res.status(500).json({ erreur: "erreur_serveur" });
  }
}
