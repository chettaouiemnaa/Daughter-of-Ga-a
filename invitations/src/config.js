/* Configuration d'une invitation : valeurs de départ et lien d'aperçu partageable. */
import { categorie } from "./offre.js";

function dansJours(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function configDepart(catId = "mariage") {
  const c = categorie(catId);
  return {
    categorie: c.id,
    hotes: c.hotesEx,
    titre: c.titre.fr,
    titreModifie: false,
    date: dansJours(60),
    heureDebut: "19:30",
    heureFin: "",
    ville: "La Marsa",
    adresse: "",
    programme: "",
    dress: "",
    whatsapp: "",
    prixPlace: "",
    palette: c.palette,
    musique: "piano",
    photo: null,
    initiales: "",
    langues: ["fr"],
    options: [],
    inviteExemple: "Leïla Ben Salah",
  };
}

/* Exemple affiché sur la page d'accueil */
export const DEMO = {
  ...configDepart("commercial"),
  hotes: "Daughter of Gaïa",
  titre: "à la découverte du domaine",
  titreModifie: true,
  date: "2026-12-12",
  heureDebut: "11:00",
  heureFin: "17:00",
  ville: "à La Soukra",
  adresse: "64 avenue Fattouma Bourguiba, La Soukra, Tunis",
  programme: "Une table signée par un chef\n& un show",
  dress: "Chic champêtre",
  palette: "terracotta",
  decor: "domaine",
  initiales: "DG",
  langues: ["fr", "en", "ar"],
  options: ["noms", "initiales"],
};

/* La photo n'entre pas dans le lien (trop lourde) : elle est envoyée à part. */
export function encoder(cfg) {
  const { photo, ...reste } = cfg;
  const json = JSON.stringify(reste);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decoder(s) {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return { ...configDepart(), ...JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return null;
  }
}

export const lienApercu = cfg => `${location.origin}/apercu?c=${encoder(cfg)}`;
