# Cachet — site d'invitations digitales (nom provisoire)

Le client choisit son type d'événement, remplit ses informations, choisit couleurs,
langues et options, voit son invitation s'animer en direct et le prix se calculer.
Il envoie sa commande sur WhatsApp ; il paie après validation de l'aperçu
(virement, Flouci, D17).

Projet indépendant du site du domaine (`../daughter-of-gaia`), dans le même dépôt
pour démarrer. À déplacer dans son propre dépôt quand le nom sera choisi.

## Lancer

```bash
cd invitations
npm install
npm run dev        # http://localhost:5173
```

## Mettre en ligne (Vercel)

Nouveau projet Vercel sur ce dépôt, **Root Directory : `invitations`**.
`vercel.json` renvoie toutes les adresses vers `index.html`.

## Les pages

| Adresse | Contenu |
|---|---|
| `/` | Accueil, avec l'invitation de démonstration |
| `/creer` | Le configurateur (`/creer?categorie=bebe` présélectionne une catégorie) |
| `/apercu?c=…` | L'invitation en plein écran, telle que l'invité la verra. `#prenom-nom` à la fin affiche le nom d'un invité si l'option est prise |

## Où changer quoi

| Pour changer… | Fichier |
|---|---|
| Prix, options, catégories, palettes, musiques, numéro WhatsApp des commandes, nom du site | `src/offre.js` |
| Textes fixes de l'invitation en français, anglais, arabe | `src/langues.js` |
| L'invitation animée (enveloppe, branches, feuille d'informations) | `src/Invitation.jsx`, `src/invitation.css` |
| Le cachet de cire (couleur, initiales, motif d'olivier) | `src/Cachet.jsx` |
| Le configurateur | `src/Configurateur.jsx` |
| L'accueil | `src/Accueil.jsx` |
| Valeurs de départ, démo, lien d'aperçu | `src/config.js` |

Les images du modèle (papier, branches, oiseaux, décor du domaine) sont dans
`public/modele/`. Le papier est une texture en niveaux de gris : la couleur de
l'enveloppe vient de la palette (`background-blend-mode: multiply`).

## Ce que fait cette première version, et ce qui reste

Fait :
- 5 catégories, chacune avec ses options propres, plus les options communes
- aperçu animé en direct : palette, cachet à initiales, nom de l'invité,
  compte à rebours, galerie, billetterie, QR, suivi des réponses (bouton de démo)
- invitation en français, anglais, arabe (de droite à gauche), sélecteur de langue
- devis détaillé, commande envoyée sur WhatsApp avec le lien de l'aperçu

À faire :
- **base de données** : enregistrer commandes et invitations, une vraie adresse
  par invitation, la liste des invités saisie par le client
- **suivi des réponses** : enregistrer les « oui / non », tableau de bord, relances
- **page souvenirs** : dépôt de photos par les invités (stockage à prévoir)
- **paiement en ligne** (Konnect, Flouci) une fois le compte marchand ouvert
- musique : bibliothèque de morceaux libres de droits
- site lui-même en anglais et en arabe (seule l'invitation l'est aujourd'hui)
- traduction automatique des textes du client dans les autres langues
