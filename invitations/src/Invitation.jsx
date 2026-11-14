/* =========================================================
   L'invitation animée, réutilisable pour tous les clients.
   Enveloppe à deux volets + cachet, puis les branches s'écartent
   sur le décor et le texte se pose. Feuille d'informations dessous.
   ========================================================= */
import { useEffect, useMemo, useRef, useState } from "react";
import Cachet from "./Cachet.jsx";
import { T, dateLongue, joursRestants } from "./langues.js";
import { categorie, palette, fmtPrix } from "./offre.js";
import "./invitation.css";

const M = "/modele/";
const ETATS = ["s-press", "s-open", "s-part", "s-gone", "s-mist", "s-done"];

function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646);
}
const f1 = n => Math.round(n * 10) / 10;

/* Grandes branches peintes qui ferment la vue, puis s'écartent */
function useBranches(cadre) {
  return useMemo(() => {
    const r = rng(23), out = [];
    /* stay : sans photo de décor, quelques branches restent au bord et encadrent le texte */
    const add = (src, L, y, size, dur, z, stay = false) => {
      const ox = stay ? -(size * 0.5 + r() * 6) : -(size + 25 + r() * 20);
      out.push({
        src, z,
        style: {
          [L ? "left" : "right"]: "-8%", top: `${f1(y)}%`, width: `${f1(size)}%`, zIndex: z,
          "--ox": `${f1(L ? ox : -ox)}cqw`, "--oy": `${stay ? f1(y < 50 ? -4 - r() * 3 : -7 - r() * 3) : f1((r() - 0.5) * 8)}cqh`,
          "--r": `${f1((r() - 0.5) * 34)}deg`, "--f": L ? 1 : -1, "--dur": `${f1(dur)}s`,
        },
      });
    };
    for (let i = 0; i < 8; i++) add(M + "branche-2.webp", i % 2 === 0, -8 + (i >> 1) * 25 + r() * 8, 120 + r() * 60, 5.2 + r() * 0.9, 1, cadre && i < 2);
    for (let i = 0; i < 10; i++) add(M + `branche-${i % 2}.webp`, i % 2 === 1, -12 + (i >> 1) * 21 + r() * 8, 95 + r() * 55, 4.1 + r(), 2);
    add(M + "branche-3.webp", true, 4, 190, 3.3, 4);
    add(M + "branche-3.webp", false, 40, 205, 3.6, 4);
    add(M + "branche-3.webp", true, 70, 185, 3.1, 4);
    return out;
  }, [cadre]);
}

const enc = encodeURIComponent;

export default function Invitation({ cfg, invite = "", places = 1, etatInitial = "ferme", onLangue, lang: langForcee }) {
  const racine = useRef(null);
  const timers = useRef([]);
  const [etat, setEtat] = useState([]);
  const [instant, setInstant] = useState(false);
  const [langLocale, setLangLocale] = useState(cfg.langues?.[0] || "fr");
  const [reponse, setReponse] = useState(null);

  const langues = cfg.langues?.length ? cfg.langues : ["fr"];
  const lang = langForcee && langues.includes(langForcee) ? langForcee : langues.includes(langLocale) ? langLocale : langues[0];
  const t = T[lang];
  const cat = categorie(cfg.categorie);
  const pal = palette(cfg.palette);
  const opts = new Set([...(cfg.options || []), ...(cat.inclus || [])]);
  const nom = opts.has("noms") ? invite : "";
  const titre = cfg.titreModifie ? cfg.titre : cat.titre[lang];
  const date = dateLongue(cfg.date, lang);
  const reste = joursRestants(cfg.date);
  const decor = cfg.photo || cfg.decor === "domaine" ? (cfg.photo || M + "domaine.webp") : "";
  const branches = useBranches(!decor);

  /* séquence d'ouverture */
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const ouvert = etat.includes("s-open");
  function ouvrir() {
    if (ouvert) return;
    setEtat(["s-press"]);
    at(140, () => setEtat(["s-open", "s-part"]));
    at(2900, () => setEtat(e => [...e, "s-gone"]));
    at(4700, () => setEtat(e => [...e, "s-mist"]));
    at(7300, () => setEtat(e => [...e, "s-done"]));
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setInstant(true);
    setEtat(etatInitial === "ouvert" ? ETATS.slice(1) : []);
    if (racine.current) racine.current.scrollTop = 0;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(id);
  }, [etatInitial]);

  /* taille de référence : --u = 1 % de la largeur, plafonnée */
  useEffect(() => {
    const el = racine.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.style.setProperty("--u", Math.min(el.clientWidth, 430) / 100 + "px"));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lieu = cfg.adresse || "";
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + enc(lieu);
  const jour = (cfg.date || "").replace(/-/g, "");
  const hh = v => (v || "").replace(":", "") + "00";
  const calUrl = jour
    ? "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + enc(`${cfg.hotes} — ${titre}`) +
      `&dates=${jour}T${cfg.heureDebut ? hh(cfg.heureDebut) : "120000"}/${jour}T${cfg.heureFin ? hh(cfg.heureFin) : cfg.heureDebut ? hh(cfg.heureDebut) : "130000"}` +
      "&location=" + enc(lieu)
    : "#";
  const tel = (cfg.whatsapp || "").replace(/[^\d]/g, "");
  const waUrl = "https://wa.me/" + tel + "?text=" + enc(t.msg(nom, places, date));
  const billetterie = opts.has("billetterie") && Number(cfg.prixPlace) > 0;

  const classes = ["inv", ...etat, nom ? "has-guest" : "", instant ? "inv-instant" : "", lang === "ar" ? "inv-ar" : "", decor ? "has-decor" : ""].join(" ");

  return (
    <div
      ref={racine}
      className={classes}
      dir={lang === "ar" ? "rtl" : "ltr"}
      lang={lang}
      style={{ "--env": pal.env, "--intro": pal.intro }}
      onClick={ouvrir}
      role={ouvert ? undefined : "button"}
      tabIndex={ouvert ? undefined : 0}
      aria-label={ouvert ? undefined : t.toucher}
      onKeyDown={e => { if (!ouvert && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ouvrir(); } }}
    >
      <div className="inv-monde">
        {decor ? (
          <div className="inv-ph">
            <img className="p-bg" alt="" src={decor} />
            {cfg.decor === "domaine" && !cfg.photo && <img className="p-soft" alt="" src={M + "domaine-flou.jpg"} />}
          </div>
        ) : (
          <div className="inv-fond" />
        )}
        <div className="inv-brume" />
        <div className="inv-oiseaux" aria-hidden="true">
          {[0, 1, 2].map(i => <span key={i} className={`inv-oiseau o${i}`}><img alt="" src={M + `oiseau-${i}.png`} /></span>)}
        </div>
        <div className="inv-sombre" />
        <div className="inv-branches" aria-hidden="true">
          {branches.map((b, i) => <img key={i} alt="" src={b.src} style={b.style} />)}
        </div>
        <div className="inv-texte">
          <p className="inv-hotes">{cfg.hotes || cat.hotesEx}</p>
          <p className="inv-phrase">{t.phrase(cat.pluriel, !!nom)}</p>
          {nom && <p className="inv-invite">{nom}</p>}
          <h1 className="inv-titre">{titre}</h1>
          {date && <p className="inv-date">{date}</p>}
          {cfg.heureDebut && <p className="inv-heure">{t.heures(cfg.heureDebut, cfg.heureFin)}</p>}
          {cfg.ville && <p className="inv-ville">{cfg.ville}</p>}
          {reste !== null && <p className="inv-rebours">{t.rebours(reste)}</p>}
        </div>
      </div>

      {langues.length > 1 && (
        <div className="inv-langues" onClick={e => e.stopPropagation()}>
          {langues.map(l => (
            <button key={l} type="button" className={l === lang ? "on" : ""} onClick={() => { setLangLocale(l); onLangue && onLangue(l); }}>
              {l === "ar" ? "ع" : l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <section className="inv-plus" aria-label={t.infos}>
        <button className="inv-cue" type="button" onClick={e => { e.stopPropagation(); const el = racine.current; el.scrollTo({ top: el.querySelector(".inv-plus").offsetTop - el.clientHeight * 0.06, behavior: "smooth" }); }}>
          <span>{t.infos}</span><i />
        </button>

        {cfg.programme && (
          <><div className="inv-bloc"><p className="inv-l">{t.programme}</p><p className="inv-v inv-pre">{cfg.programme}</p></div><span className="inv-filet" /></>
        )}
        {cfg.dress && (
          <><div className="inv-bloc"><p className="inv-l">{t.dress}</p><p className="inv-v">{cfg.dress}</p></div><span className="inv-filet" /></>
        )}
        {opts.has("galerie") && (
          <>
            <div className="inv-bloc">
              <p className="inv-l">{t.galerie}</p>
              <div className="inv-galerie">
                {(cfg.photo ? [cfg.photo] : []).concat([M + "domaine-flou.jpg", M + "papier.jpg"]).slice(0, 3).map((s, i) => <img key={i} alt="" src={s} />)}
              </div>
            </div>
            <span className="inv-filet" />
          </>
        )}
        {lieu && (
          <>
            <div className="inv-bloc">
              <p className="inv-l">{t.acces}</p>
              <p className="inv-v inv-sm">{lieu}</p>
              <div className="inv-btns" onClick={e => e.stopPropagation()}>
                <a className="inv-btn" href={mapsUrl} target="_blank" rel="noopener">{t.itineraire}</a>
                <a className="inv-btn" href={calUrl} target="_blank" rel="noopener">{t.calendrier}</a>
              </div>
              <p className="inv-n inv-xs">{t.rappel}</p>
            </div>
            <span className="inv-filet" />
          </>
        )}
        <div className="inv-bloc" onClick={e => e.stopPropagation()}>
          <p className="inv-l">{t.votre}</p>
          {nom && <p className="inv-v">{t.places(places)}</p>}
          {billetterie && <p className="inv-n">{t.participation(fmtPrix(Number(cfg.prixPlace)))}</p>}
          {opts.has("suivi") && !billetterie ? (
            reponse ? <p className="inv-n inv-merci">{t.merci}</p> : (
              <div className="inv-btns">
                <button type="button" className="inv-btn inv-main" onClick={() => setReponse("oui")}>{t.oui}</button>
                <button type="button" className="inv-btn" onClick={() => setReponse("non")}>{t.non}</button>
              </div>
            )
          ) : (
            <>
              <a className="inv-btn inv-main" href={waUrl} target="_blank" rel="noopener">{billetterie ? t.reserver : t.confirmer}</a>
              {!billetterie && <p className="inv-n inv-xs">{t.noteWa}</p>}
            </>
          )}
          {opts.has("qr") && <p className="inv-n inv-xs">{t.qr}</p>}
        </div>
        {opts.has("souvenirs") && (
          <><span className="inv-filet" /><div className="inv-bloc"><p className="inv-l">{t.souvenirs}</p><p className="inv-n">{t.souvenirsTxt}</p></div></>
        )}
        {cfg.whatsapp && (
          <><span className="inv-filet" /><div className="inv-bloc"><p className="inv-l">{t.contact}</p><a className="inv-v inv-tel" dir="ltr" href={"tel:+" + tel} onClick={e => e.stopPropagation()}>{cfg.whatsapp}</a></div></>
        )}
      </section>

      <div className="inv-env">
        <div className="inv-volet inv-vg"><div className="inv-papier" /><div className="inv-ombre" /></div>
        <div className="inv-volet inv-vd"><div className="inv-papier" /><div className="inv-ombre" /></div>
        <div className="inv-intro">
          <p className="inv-i1">{nom ? t.introPour(nom) : t.intro}</p>
          <span className="inv-i2" />
          <p className="inv-i3">{t.toucher}</p>
        </div>
        <Cachet className="inv-cachet" couleur={pal.cire} initiales={opts.has("initiales") ? cfg.initiales || "" : ""} />
      </div>
    </div>
  );
}
