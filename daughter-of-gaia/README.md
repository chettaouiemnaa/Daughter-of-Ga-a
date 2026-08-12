# Daughter of Gaïa — site du domaine

Site vitrine et réservation d'un domaine privé événementiel à la Soukra (Tunis).
Deux pages, bilingue français / anglais.

## Lancer le projet

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`.

## Structure

```
src/
  App.jsx     tout le site — un seul composant, ~2000 lignes
  main.jsx    point d'entrée + adaptateur de stockage
  index.css   Tailwind
```

Le site tient volontairement dans un seul fichier. C'est la première chose
à découper si le projet est repris sérieusement (voir « Pistes » plus bas).

## Ce que contient App.jsx

En haut du fichier, dans l'ordre :

1. **Constantes d'images** — `P_BAR_NUIT`, `P_CHEVAL_BAR`, `P_JARDIN`,
   `P_LANTERNES` (le domaine) et `V_PERGOLA`, `V_PISCINE`, `V_JARDIN_V`,
   `V_PALMIERS`, `V_SALON` (la villa de tournage). Ce sont des data-URI
   base64 fortement compressées, uniquement pour la maquette.
   **À remplacer par des URL d'images hébergées.**
2. **`T`** — dictionnaire de traduction `{ fr: {...}, en: {...} }`.
   Tout le texte visible du site est là, et nulle part ailleurs.
   Les deux arbres de clés sont identiques.
3. **Composants d'animation** — `Reveal`, `WordReveal`, `MaskText`,
   `VoletsReveal`, `Parallax`, `CountUp`, `LetterReveal`, `Diaporama`,
   `GalerieHorizontale`, `Projecteur`, `LumiereFiltree`, `FondAbstrait`,
   `Rideau`, `Grain`, `Magnetique`.
4. **`Calendrier`** et **`FaqItem`**.
5. **`App`** — état, page admin, page tournages, page d'accueil.

## Les deux pages

Navigation par état local (`page`), pas de routeur.

- **accueil** — hero en diaporama, mission, 4 valeurs, le domaine + 6 chiffres,
  l'histoire, 10 expériences, bandeau défilant, appel vers les tournages,
  galerie horizontale, le refuge, calendrier, formulaire de devis, FAQ, contact.
- **tournages** — hero, intro, 5 décors, la maison, 6 atouts pratiques, contact production.

Un espace **administration** est accessible par le bouton discret en pied de page.
Il permet de bloquer ou libérer des dates dans le calendrier.

## Points à traiter avant mise en ligne

**Sécurité — critique.** Le code d'accès administrateur est en clair dans
`App.jsx` (constante `CODE_ADMIN`). N'importe qui peut le lire dans le source.
Il faut une authentification côté serveur avant toute publication.

**Persistance.** Les dates bloquées passent par `window.storage`, remplacé par
`localStorage` hors de l'aperçu Claude (voir `main.jsx`). Il faut une vraie base
de données pour que les disponibilités soient partagées entre visiteurs.

**Formulaire de devis.** Il ne fait qu'afficher un message de confirmation.
Aucun envoi. À brancher sur un service d'e-mail ou une API.

**Images.** Les base64 doivent sortir du fichier. Prévoir des formats modernes
(AVIF / WebP), plusieurs tailles, et `loading="lazy"` déjà en place.

**Routage.** Remplacer l'état `page` par de vraies URL (`/`, `/tournages`)
pour le référencement et le partage de liens.

**Référencement.** Métadonnées minimales dans `index.html`. À compléter :
données structurées, sitemap, balises alternates fr/en.

## Pistes de découpage

```
src/
  App.jsx
  i18n/textes.js
  data/images.js
  components/animations/
  components/Calendrier.jsx
  components/FaqItem.jsx
  pages/Accueil.jsx
  pages/Tournages.jsx
  pages/Admin.jsx
```

## Identité

| | |
|---|---|
| Sable | `#EDE4D3` |
| Blanc cassé | `#F6F1E7` |
| Encre | `#2B2118` |
| Olive | `#6B7355` |
| Terracotta | `#B5654A` |
| Filet | `#C7B79A` |

Titres en **Cormorant Garamond** (graisse 300), textes en **Jost** (300),
mentions en **IBM Plex Mono**. Chargées depuis Google Fonts dans le `<style>`
du composant — à basculer en `@font-face` local pour la performance.

Parti pris visuel : aucun trait de séparation, tout centré sauf la section
« Le refuge », photographies plutôt qu'illustrations, mouvement lent et continu.

## Contenu à venir

- Une page « Le refuge » racontant l'histoire de chacun des sept chevaux recueillis.
- Les photos définitives du domaine, une fois les aménagements terminés.
- Le tarif à la journée pour les tournages.
