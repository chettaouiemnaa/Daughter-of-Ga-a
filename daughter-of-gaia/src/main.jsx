import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* ─────────────────────────────────────────────────────────────
   window.storage n'existe que dans l'aperçu Claude.
   Hors de cet environnement, on le remplace par localStorage
   pour que les dates bloquées survivent au rechargement.
   À remplacer par de vrais appels API lors de la mise en ligne.
   ───────────────────────────────────────────────────────────── */
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      if (value === null) throw new Error("clé absente");
      return { key, value, shared: true };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value, shared: true };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: true };
    },
    async list(prefix = "") {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared: true };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
