import fs from "fs";

let echecs = 0;

for (const f of ["dist/index.html", "dist/tournages.html"]) {
  const h = fs.readFileSync(f, "utf-8");
  const blocs = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  console.log(`\n=== ${f} ===`);
  console.log(`blocs structures : ${blocs.length}`);

  const types = [];
  for (const b of blocs) {
    try {
      const o = JSON.parse(b[1]);
      types.push(o["@type"]);
      if (o["@type"] === "EventVenue") {
        const eq = (o.amenityFeature || []).map((a) => a.name);
        console.log(`  EventVenue — equipements : ${eq.join(" | ") || "(aucun)"}`);
        console.log(`  parking mentionne : ${eq.some((n) => /parking/i.test(n)) ? "OUI" : "non"}`);
      }
      if (o["@type"] === "FAQPage") {
        console.log(`  FAQPage — ${o.mainEntity.length} questions`);
      }
    } catch (e) {
      console.log("  ECHEC : JSON invalide —", e.message);
      echecs++;
    }
  }

  if (!types.includes("EventVenue")) { console.log("  ECHEC : EventVenue absente"); echecs++; }
  if (!types.includes("FAQPage")) { console.log("  ECHEC : FAQPage absente"); echecs++; }

  const ns = (h.match(/<noscript>([\s\S]*?)<\/noscript>/) || [, ""])[1];
  console.log(`  mots lisibles : ${ns.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length}`);
  console.log(`  "parking" dans le texte lisible : ${/parking/i.test(ns) ? "OUI" : "non"}`);
}

console.log(`\n${echecs === 0 ? "Tout est conforme." : echecs + " probleme(s)."}`);
process.exit(echecs === 0 ? 0 : 1);
