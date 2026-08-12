import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* Les disponibilités passent désormais par /api/dates, adossé à une base
   commune : elles sont les mêmes pour tous les visiteurs. L'adaptateur de
   stockage local qui vivait ici ne servait plus — il enregistrait les dates
   dans le seul navigateur du propriétaire, invisibles pour le public. */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
