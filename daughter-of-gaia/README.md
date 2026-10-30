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
   `V_PALMIERS`, `V_SALON` (la villa de tournage). Ce sont des chemins vers
   `public/images`, servis tels quels. Les fichiers sont encore en JPEG pleine
   taille : voir « Points à traiter ».
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

## Ce qui est en place

**Sécurité.** Le code d'accès n'est pas dans la page. Il est envoyé à
`api/dates.js`, qui le compare à la variable d'environnement `ADMIN_CODE` avec
`crypto.timingSafeEqual`. Cinq échecs depuis une même adresse ferment la porte
un quart d'heure. Les en-têtes de sécurité sont déclarés dans `vercel.json`.

**Persistance.** Les dates bloquées vivent dans Redis (`REDIS_URL`, `KV_URL` ou
`STORAGE_URL`), donc partagées entre tous les visiteurs. Si la base ne répond
pas, le calendrier s'affiche sans date barrée plutôt que de barrer au hasard.

**Formulaire de devis.** Envoyé à `formsubmit.co`, qui dépose la demande dans
`contact@daughterofgaia.com`. Champ leurre anti-robot, garde anti-double-clic,
et l'adresse affichée en repli si le relais refuse.

**Routage.** `/` et `/tournages` sont de vraies adresses, avec historique de
navigation. `generer-pages.mjs` fabrique un HTML propre pour `/tournages` au
moment de la construction.

**Référencement.** Données structurées `EventVenue` et `FAQPage`, sitemap,
robots.txt, aperçus de partage, et un `<noscript>` qui contient un vrai texte
de présentation.

## Points à traiter

**Images — le plus rentable.** 4,4 Mo de JPEG dans `public/images`, dont six
fichiers en 1800 × 2400 servis tels quels aux téléphones. Mesuré : passer en
WebP sans changer les dimensions ne gagne que 23 %, mais servir une version
800 px aux petits écrans fait −70 %. À faire : plusieurs tailles et un `srcset`.
Le chargement différé, lui, est en place partout.

**Pages légales.** Le site recueille nom, e-mail, téléphone et description de
projet, et les fait transiter par un tiers. Il n'a ni mentions légales ni
politique de confidentialité.

**Version anglaise.** Le site est bilingue mais la langue n'est qu'un état
interne : aucune URL anglaise, aucun `hreflang`, donc rien d'indexable. La
piste : faire produire `/en` et `/en/tournages` par `generer-pages.mjs`.

**Trace des demandes.** Le formulaire n'écrit nulle part. Un e-mail perdu est
une demande perdue, et rien ne permet de les compter. Redis est déjà branché.

**Accessibilité — ce qui reste.** La galerie horizontale ne se parcourt pas au
clavier, le contenu n'est dans aucune balise `<main>`, l'attribut `lang` du
`<html>` ne suit pas le sélecteur de langue, et le parallaxe (piloté en
JavaScript) ignore `prefers-reduced-motion`.

**Calendrier.** Les dates se barrent à la main. Une réservation confirmée ne
bloque pas sa date automatiquement.

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
| Olive | `#626A4E` |
| Terracotta | `#B5654A` |
| Terracotta lisible | `#97543E` |
| Filet | `#C7B79A` |
| Filet de champ | `#8C816D` |
| Mention | `#6D6654` |

Les quatre dernières valeurs existent pour le contraste : le terracotta de
marque (3,38:1 sur le sable) reste aux titres et aux accents, sa variante
sombre porte les messages d'erreur ; le filet clair reste décoratif, le filet
sombre dessine les champs de formulaire.

Titres en **Cormorant Garamond** (graisse 300), textes en **Jost** (300),
mentions en **IBM Plex Mono**. Appelées depuis Google Fonts par un
`<link rel="stylesheet">` dans le `<head>` d'`index.html`. Les héberger en
`@font-face` local reste le prochain gain.

Parti pris visuel : aucun trait de séparation, tout centré sauf la section
« Le refuge », photographies plutôt qu'illustrations, mouvement lent et continu.

## Contenu à venir

- Une page « Le refuge » racontant l'histoire de chacun des sept chevaux recueillis.
- Les photos définitives du domaine, une fois les aménagements terminés.
- Le tarif à la journée pour les tournages.
