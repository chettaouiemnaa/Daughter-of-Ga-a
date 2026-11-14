import { useEffect, useState } from "react";
import Accueil from "./Accueil.jsx";
import Configurateur from "./Configurateur.jsx";
import Invitation from "./Invitation.jsx";
import { decoder } from "./config.js";

/* Trois pages : l'accueil (/), le configurateur (/creer) et l'aperçu partagé (/apercu?c=…) */
export function aller(chemin) {
  history.pushState(null, "", chemin);
  dispatchEvent(new PopStateEvent("popstate"));
  scrollTo(0, 0);
}

function Apercu() {
  const p = new URLSearchParams(location.search);
  const cfg = decoder(p.get("c") || "");
  if (!cfg) return <p style={{ padding: 32 }}>Ce lien d'aperçu n'est pas valide.</p>;
  /* comme pour la vraie invitation : #prenom-nom à la fin du lien affiche le nom de l'invité */
  const slug = decodeURIComponent(location.hash.slice(1));
  const invite = slug ? slug.split("-").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ") : cfg.inviteExemple;
  return (
    <div className="apercu-plein">
      <div className="apercu-cadre"><Invitation cfg={cfg} invite={invite} /></div>
    </div>
  );
}

export default function App() {
  const [chemin, setChemin] = useState(location.pathname);
  useEffect(() => {
    const f = () => setChemin(location.pathname);
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);
  if (chemin.startsWith("/apercu")) return <Apercu />;
  if (chemin.startsWith("/creer")) return <Configurateur />;
  return <Accueil />;
}
