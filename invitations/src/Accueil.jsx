import { useState } from "react";
import Invitation from "./Invitation.jsx";
import Cachet from "./Cachet.jsx";
import { aller } from "./App.jsx";
import { DEMO } from "./config.js";
import { CATEGORIES, INCLUS, OPTIONS_COMMUNES, PALETTES, PRIX_BASE, PRIX_LANGUE_SUP, NOM_SITE, fmtPrix, palette } from "./offre.js";

function Entete({ sansBouton = false }) {
  return (
    <header className="entete">
      <a className="marque" href="/" onClick={e => { e.preventDefault(); aller("/"); }}>
        <Cachet couleur="#6A6A33" initiales="C" className="marque-cachet" />
        <span>{NOM_SITE}</span>
      </a>
      {!sansBouton && <button className="bouton bouton-petit" onClick={() => aller("/creer")}>Créer mon invitation</button>}
    </header>
  );
}
export { Entete };

export default function Accueil() {
  const [rejouer, setRejouer] = useState(0);
  return (
    <div className="site">
      <Entete />

      <section className="hero">
        <div className="hero-texte">
          <p className="surtitre">Invitations digitales · Français · English · العربية</p>
          <h1>Une invitation qui s'ouvre comme une lettre.</h1>
          <p className="chapeau">
            Une enveloppe scellée à vos couleurs, un cachet de cire, puis votre événement qui se dévoile.
            Envoyée sur WhatsApp, ouverte au nom de chaque invité.
          </p>
          <div className="hero-actions">
            <button className="bouton" onClick={() => aller("/creer")}>Créer mon invitation</button>
            <span className="hero-prix">à partir de {fmtPrix(PRIX_BASE)}</span>
          </div>
          <p className="hero-note">Vous composez, nous livrons l'aperçu, vous payez une fois satisfait.</p>
        </div>
        <div className="hero-demo">
          <div className="telephone">
            <Invitation key={rejouer} cfg={DEMO} invite="Leïla Ben Salah" />
          </div>
          <button className="lien" onClick={() => setRejouer(r => r + 1)}>Touchez le cachet · Rejouer</button>
        </div>
      </section>

      <section className="bloc">
        <h2>Comment ça marche</h2>
        <ol className="etapes">
          <li><b>Choisissez votre événement</b><span>Mariage, baby shower, anniversaire, soirée d'entreprise ou lancement.</span></li>
          <li><b>Composez votre invitation</b><span>Textes, couleurs, langues et options : l'aperçu se met à jour sous vos yeux.</span></li>
          <li><b>Validez, payez, envoyez</b><span>Nous finalisons sous 5 jours. Vous payez par virement, Flouci ou D17 une fois l'aperçu validé.</span></li>
        </ol>
      </section>

      <section className="bloc">
        <h2>Pour chaque occasion</h2>
        <div className="categories">
          {CATEGORIES.map(c => {
            const p = palette(c.palette);
            return (
              <button key={c.id} className="carte-cat" onClick={() => aller(`/creer?categorie=${c.id}`)}>
                <span className="carte-env" style={{ "--env": p.env }}><Cachet couleur={p.cire} /></span>
                <b>{c.nom}</b>
                <span>{c.sous}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bloc bloc-deux">
        <div>
          <h2>Toujours inclus</h2>
          <ul className="liste-inclus">
            {INCLUS.map(i => <li key={i.id}><b>{i.nom}</b><span>{i.detail}</span></li>)}
          </ul>
        </div>
        <div>
          <h2>Les options</h2>
          <ul className="liste-options">
            {OPTIONS_COMMUNES.map(o => <li key={o.id}><span><b>{o.nom}</b><em>{o.detail}</em></span><i>+{fmtPrix(o.prix)}</i></li>)}
            <li><span><b>Une langue de plus</b><em>Français, anglais ou arabe, avec mise en page de droite à gauche.</em></span><i>+{fmtPrix(PRIX_LANGUE_SUP)}</i></li>
          </ul>
          <p className="petit">Chaque type d'événement a aussi ses options propres : save the date, révélation du sexe, QR code d'entrée, billetterie…</p>
        </div>
      </section>

      <section className="bloc">
        <h2>Neuf palettes, ou les vôtres</h2>
        <div className="palettes-vitrine">
          {PALETTES.map(p => (
            <span key={p.id} className="pastille" title={p.nom}>
              <span className="carte-env" style={{ "--env": p.env }}><Cachet couleur={p.cire} /></span>
              <small>{p.nom}</small>
            </span>
          ))}
        </div>
      </section>

      <section className="appel">
        <h2>Prêt à sceller votre invitation ?</h2>
        <button className="bouton" onClick={() => aller("/creer")}>Commencer</button>
      </section>

      <footer className="pied">
        <span>{NOM_SITE} · Invitations digitales</span>
        <span>Paiement après validation · Virement, Flouci, D17</span>
      </footer>
    </div>
  );
}
