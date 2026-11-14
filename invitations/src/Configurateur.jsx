import { useMemo, useState } from "react";
import Invitation from "./Invitation.jsx";
import Cachet from "./Cachet.jsx";
import { Entete } from "./Accueil.jsx";
import { configDepart, lienApercu } from "./config.js";
import {
  CATEGORIES, INCLUS, LANGUES, MUSIQUES, PALETTES, PRIX_LANGUE_SUP, WHATSAPP_COMMANDES, NOM_SITE,
  categorie, devis, fmtPrix, optionsDe, palette,
} from "./offre.js";

function Champ({ label, aide, children }) {
  return (
    <label className="champ">
      <span className="champ-l">{label}</span>
      {children}
      {aide && <span className="champ-aide">{aide}</span>}
    </label>
  );
}

function Etape({ n, titre, children }) {
  return (
    <section className="etape">
      <h2><span className="etape-n">{n}</span>{titre}</h2>
      {children}
    </section>
  );
}

export default function Configurateur() {
  const catUrl = new URLSearchParams(location.search).get("categorie");
  const [cfg, setCfg] = useState(() => configDepart(CATEGORIES.some(c => c.id === catUrl) ? catUrl : "mariage"));
  const [client, setClient] = useState({ nom: "", tel: "", email: "", message: "" });
  const [rejouer, setRejouer] = useState(0);
  const [vueOuverte, setVueOuverte] = useState(false);
  const [plein, setPlein] = useState(false);
  const [copie, setCopie] = useState(false);
  const [erreur, setErreur] = useState("");

  const cat = categorie(cfg.categorie);
  const opts = optionsDe(cfg.categorie);
  const { lignes, total } = useMemo(() => devis(cfg), [cfg]);
  const maj = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const a = k => cfg.options.includes(k) || (cat.inclus || []).includes(k);
  const basculer = k => setCfg(c => ({ ...c, options: c.options.includes(k) ? c.options.filter(x => x !== k) : [...c.options, k] }));

  function changerCategorie(id) {
    const n = categorie(id);
    setCfg(c => {
      const garder = new Set([...optionsDe(id).map(o => o.id)]);
      return {
        ...c,
        categorie: id,
        palette: n.palette,
        hotes: CATEGORIES.some(x => x.hotesEx === c.hotes) ? n.hotesEx : c.hotes,
        titre: c.titreModifie ? c.titre : n.titre.fr,
        options: c.options.filter(o => garder.has(o)),
      };
    });
  }

  function basculerLangue(l) {
    setCfg(c => {
      const has = c.langues.includes(l);
      if (has && c.langues.length === 1) return c;
      const langues = has ? c.langues.filter(x => x !== l) : [...c.langues, l];
      return { ...c, langues: LANGUES.map(x => x.id).filter(x => langues.includes(x)) };
    });
  }

  function choisirPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => maj("photo", r.result);
    r.readAsDataURL(f);
  }

  const lien = lienApercu(cfg);
  async function copier() {
    try { await navigator.clipboard.writeText(lien); setCopie(true); setTimeout(() => setCopie(false), 2500); }
    catch { prompt("Copiez ce lien :", lien); }
  }

  function commander() {
    if (!client.nom.trim() || !client.tel.trim()) { setErreur("Indiquez votre nom et votre numéro de téléphone, pour que nous puissions vous répondre."); return; }
    setErreur("");
    const pal = palette(cfg.palette);
    const nomsOpts = opts.filter(o => a(o.id)).map(o => `• ${o.nom}${o.offerte ? " (offert)" : o.commission ? ` (${o.commission} des ventes)` : ""}`);
    const txt = [
      `Nouvelle commande ${NOM_SITE}`,
      ``,
      `Événement : ${cat.nom}`,
      `Hôtes : ${cfg.hotes}`,
      `Titre : ${cfg.titreModifie ? cfg.titre : cat.titre.fr}`,
      `Date : ${cfg.date || "à préciser"}${cfg.heureDebut ? ` à ${cfg.heureDebut}` : ""}`,
      `Lieu : ${[cfg.ville, cfg.adresse].filter(Boolean).join(" — ") || "à préciser"}`,
      `Langues : ${cfg.langues.map(l => LANGUES.find(x => x.id === l).nom).join(", ")}`,
      `Palette : ${pal.nom} · Musique : ${MUSIQUES.find(m => m.id === cfg.musique)?.nom}`,
      ...(nomsOpts.length ? [`Options :`, ...nomsOpts] : [`Options : aucune`]),
      cfg.photo ? `Photo de décor : je vous l'envoie ici.` : "",
      ``,
      `Total : ${fmtPrix(total)}`,
      ``,
      `Client : ${client.nom} · ${client.tel}${client.email ? ` · ${client.email}` : ""}`,
      client.message ? `Message : ${client.message}` : "",
      ``,
      `Aperçu : ${lien}`,
    ].filter(l => l !== "").join("\n");
    open(`https://wa.me/${WHATSAPP_COMMANDES}?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  }

  const apercu = (
    <Invitation
      key={`${rejouer}-${vueOuverte}`}
      cfg={cfg}
      invite={cfg.inviteExemple}
      etatInitial={vueOuverte ? "ouvert" : "ferme"}
    />
  );

  return (
    <div className="site">
      <Entete sansBouton />
      <div className="atelier">
        <div className="formulaire">
          <header className="atelier-tete">
            <p className="surtitre">Créer mon invitation</p>
            <h1>Composez, l'aperçu suit.</h1>
          </header>

          <Etape n="1" titre="Votre événement">
            <div className="choix-cat">
              {CATEGORIES.map(c => (
                <button key={c.id} type="button" className={"tuile" + (c.id === cfg.categorie ? " on" : "")} onClick={() => changerCategorie(c.id)}>
                  <b>{c.nom}</b><span>{c.sous}</span>
                </button>
              ))}
            </div>
          </Etape>

          <Etape n="2" titre="Les informations">
            <div className="grille">
              <Champ label="Qui invite"><input value={cfg.hotes} onChange={e => maj("hotes", e.target.value)} placeholder={cat.hotesEx} /></Champ>
              <Champ label="Le titre" aide="La ligne sous « ont le plaisir de vous convier ».">
                <input value={cfg.titreModifie ? cfg.titre : cat.titre.fr} onChange={e => setCfg(c => ({ ...c, titre: e.target.value, titreModifie: true }))} />
              </Champ>
              <Champ label="Date"><input type="date" value={cfg.date} onChange={e => maj("date", e.target.value)} /></Champ>
              <div className="grille-2">
                <Champ label="Début"><input type="time" value={cfg.heureDebut} onChange={e => maj("heureDebut", e.target.value)} /></Champ>
                <Champ label="Fin (facultatif)"><input type="time" value={cfg.heureFin} onChange={e => maj("heureFin", e.target.value)} /></Champ>
              </div>
              <Champ label="Ville ou lieu" aide="Affiché sous l'heure."><input value={cfg.ville} onChange={e => maj("ville", e.target.value)} placeholder="La Marsa" /></Champ>
              <Champ label="Adresse complète" aide="Pour l'itinéraire Google Maps."><input value={cfg.adresse} onChange={e => maj("adresse", e.target.value)} placeholder="12 rue des Jasmins, La Marsa" /></Champ>
              <Champ label="Programme (facultatif)"><textarea rows="3" value={cfg.programme} onChange={e => maj("programme", e.target.value)} placeholder={"Cocktail au coucher du soleil\nDîner et soirée dansante"} /></Champ>
              <Champ label="Dress code (facultatif)"><input value={cfg.dress} onChange={e => maj("dress", e.target.value)} placeholder="Chic champêtre" /></Champ>
              <Champ label="WhatsApp pour les réponses" aide="Le numéro qui reçoit les confirmations."><input inputMode="tel" value={cfg.whatsapp} onChange={e => maj("whatsapp", e.target.value)} placeholder="+216 20 000 000" /></Champ>
              {a("billetterie") && (
                <Champ label="Prix d'une place (DT)"><input inputMode="numeric" value={cfg.prixPlace} onChange={e => maj("prixPlace", e.target.value.replace(/[^\d]/g, ""))} placeholder="120" /></Champ>
              )}
            </div>
            {cfg.langues.length > 1 && <p className="petit">Écrivez dans la langue de votre choix : nous traduisons vos textes dans les autres langues à la livraison.</p>}
          </Etape>

          <Etape n="3" titre="Le style">
            <p className="champ-l">Palette <em className="gratuit">inclus</em></p>
            <div className="palettes">
              {PALETTES.map(p => (
                <button key={p.id} type="button" className={"pastille" + (p.id === cfg.palette ? " on" : "")} onClick={() => maj("palette", p.id)} aria-pressed={p.id === cfg.palette}>
                  <span className="carte-env" style={{ "--env": p.env }}><Cachet couleur={p.cire} /></span>
                  <small>{p.nom}</small>
                </button>
              ))}
            </div>
            <div className="grille">
              <Champ label={<>Musique à l'ouverture <em className="gratuit">inclus</em></>}>
                <select value={cfg.musique} onChange={e => maj("musique", e.target.value)}>
                  {MUSIQUES.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </Champ>
              <Champ label="Photo de décor (facultatif)" aide={a("decor") ? "Nous la redessinerons en illustration." : "Affichée telle quelle. Avec l'option « Décor illustré », nous la redessinons."}>
                <input type="file" accept="image/*" onChange={choisirPhoto} />
              </Champ>
            </div>
            {cfg.photo && <button type="button" className="lien" onClick={() => maj("photo", null)}>Retirer la photo</button>}
            <div className="option-ligne">
              <label className="interrupteur"><input type="checkbox" checked={a("initiales")} onChange={() => basculer("initiales")} /><span /></label>
              <div><b>Cachet à vos initiales</b> <i>+{fmtPrix(29)}</i>
                {a("initiales") && <input className="mini" maxLength={3} value={cfg.initiales} onChange={e => maj("initiales", e.target.value.toUpperCase())} placeholder="S Y" />}
              </div>
            </div>
          </Etape>

          <Etape n="4" titre="Les langues">
            <p className="petit">Une langue incluse, {fmtPrix(PRIX_LANGUE_SUP)} par langue en plus. Vos invités passent de l'une à l'autre dans l'invitation.</p>
            <div className="langues">
              {LANGUES.map(l => (
                <button key={l.id} type="button" className={"tuile tuile-langue" + (cfg.langues.includes(l.id) ? " on" : "")} onClick={() => basculerLangue(l.id)} aria-pressed={cfg.langues.includes(l.id)}>
                  <b lang={l.id}>{l.nom}</b>
                </button>
              ))}
            </div>
          </Etape>

          <Etape n="5" titre="Les options">
            <div className="options">
              {opts.filter(o => o.id !== "initiales").map(o => (
                <div key={o.id} className={"option-ligne" + (a(o.id) ? " on" : "")}>
                  <label className="interrupteur">
                    <input type="checkbox" checked={a(o.id)} disabled={o.offerte} onChange={() => basculer(o.id)} aria-label={o.nom} /><span />
                  </label>
                  <div>
                    <b>{o.nom}</b>{" "}
                    <i>{o.offerte ? "Offert" : o.commission ? `${o.commission} des ventes` : `+${fmtPrix(o.prix)}`}</i>
                    {o.propre && <small className="propre">{cat.nom}</small>}
                    <p>{o.detail}</p>
                    {o.id === "noms" && a("noms") && (
                      <input className="mini large" value={cfg.inviteExemple} onChange={e => maj("inviteExemple", e.target.value)} placeholder="Nom d'un invité, pour l'aperçu" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="inclus-rappel">
              <p className="champ-l">Toujours inclus</p>
              <p>{INCLUS.map(i => i.nom).join(" · ")}</p>
            </div>
          </Etape>

          <Etape n="6" titre="Récapitulatif et commande">
            <table className="devis">
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i}><td>{l.nom}{l.note && <small> · {l.note}</small>}</td><td>{l.prix ? fmtPrix(l.prix) : l.note === "offert" ? "—" : ""}</td></tr>
                ))}
              </tbody>
              <tfoot><tr><td>Total</td><td>{fmtPrix(total)}</td></tr></tfoot>
            </table>
            <div className="grille">
              <Champ label="Votre nom"><input value={client.nom} onChange={e => setClient({ ...client, nom: e.target.value })} autoComplete="name" /></Champ>
              <Champ label="Téléphone / WhatsApp"><input inputMode="tel" value={client.tel} onChange={e => setClient({ ...client, tel: e.target.value })} autoComplete="tel" /></Champ>
              <Champ label="E-mail (facultatif)"><input type="email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} autoComplete="email" /></Champ>
              <Champ label="Un mot pour nous (facultatif)"><textarea rows="2" value={client.message} onChange={e => setClient({ ...client, message: e.target.value })} /></Champ>
            </div>
            {erreur && <p className="erreur" role="alert">{erreur}</p>}
            <div className="actions">
              <button type="button" className="bouton" onClick={commander}>Envoyer ma commande sur WhatsApp</button>
              <button type="button" className="bouton bouton-clair" onClick={copier}>{copie ? "Lien copié" : "Copier le lien de l'aperçu"}</button>
            </div>
            <p className="petit">Rien à payer maintenant. Nous vous renvoyons l'invitation finalisée sous {a("express") ? "48 heures" : "5 jours"} ; vous payez par virement, Flouci ou D17 une fois l'aperçu validé.</p>
          </Etape>
        </div>

        <aside className="apercu">
          <div className="apercu-colle">
            <div className="telephone">{apercu}</div>
            <div className="apercu-outils">
              <button type="button" className="lien" onClick={() => { setVueOuverte(false); setRejouer(r => r + 1); }}>Rejouer l'ouverture</button>
              <button type="button" className="lien" onClick={() => { setVueOuverte(true); setRejouer(r => r + 1); }}>Voir ouverte</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="barre-mobile">
        <span><small>Total</small><b>{fmtPrix(total)}</b></span>
        <button type="button" className="bouton bouton-petit" onClick={() => { setVueOuverte(false); setRejouer(r => r + 1); setPlein(true); }}>Voir l'aperçu</button>
      </div>
      {plein && (
        <div className="plein" role="dialog" aria-modal="true" aria-label="Aperçu de l'invitation">
          <div className="plein-cadre">{apercu}</div>
          <button type="button" className="plein-fermer" onClick={() => setPlein(false)} aria-label="Fermer l'aperçu">×</button>
        </div>
      )}
    </div>
  );
}
