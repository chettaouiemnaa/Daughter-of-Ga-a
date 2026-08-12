import crypto from "node:crypto";

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

const BASE_URL = process.env.KV_REST_API_URL;
const BASE_TOKEN = process.env.KV_REST_API_TOKEN;
const CODE = process.env.ADMIN_CODE;

/* Appel à la base clé-valeur via son API REST (aucune dépendance à installer). */
async function base(...commande) {
  if (!BASE_URL || !BASE_TOKEN) {
    throw new Error("base_non_configuree");
  }
  const r = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BASE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commande),
  });
  if (!r.ok) throw new Error(`base_erreur_${r.status}`);
  const data = await r.json();
  return data.result;
}

async function lireDates() {
  const brut = await base("GET", CLE);
  if (!brut) return [];
  try {
    const v = typeof brut === "string" ? JSON.parse(brut) : brut;
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

async function ecrireDates(dates) {
  await base("SET", CLE, JSON.stringify(dates));
}

/* Comparaison à durée constante : une comparaison ordinaire s'arrête au
   premier caractère différent, ce qui laisse deviner le code peu à peu. */
function codeValide(fourni) {
  if (!CODE || typeof fourni !== "string") return false;
  const a = Buffer.from(String(fourni));
  const b = Buffer.from(String(CODE));
  if (a.length !== b.length) {
    // On compare quand même, pour ne pas révéler la longueur par le temps de réponse
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
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

    if (!CODE) {
      return res.status(500).json({ erreur: "code_non_configure" });
    }
    if (!codeValide(code)) {
      return res.status(401).json({ erreur: "code_incorrect" });
    }

    /* ── Vérification du code seule (écran de connexion) ── */
    if (action === "verifier") {
      return res.status(200).json({ ok: true, dates: await lireDates() });
    }

    /* ── Bloquer ou libérer une date ── */
    if (action === "basculer") {
      if (!dateValide(date)) {
        return res.status(400).json({ erreur: "date_invalide" });
      }
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
