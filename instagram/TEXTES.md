# Daughter of Gaïa — lancement Instagram

Le lancement donne des **indices** (private experiences, 4 000 m², le refuge)
mais ne dit **rien des événements** qu'on pourra y faire. On garde le
mystère jusqu'à l'annonce du concept.

- `posts/` : les 12 premiers posts, de 01 à 12, dans l'ordre de publication (le 12 : ta vidéo)
- `fin-video/` : les écrans de fin pour ta vidéo, et sa couverture
- `stories/annonce-compte-perso.jpg` : l'annonce sur ton compte perso
- `profil/photo-profil.jpg` : la photo de profil
- `plus-tard/` : la carte « Ce que le domaine accueille », les couvertures
  « à la une » et les anciennes légendes, pour le moment où tu voudras
  parler des événements.

Pour régénérer après un changement : `python3 instagram/generer.py`.

---

## 1. La phrase sous le nom

Actuellement sur la story d'annonce (la couverture de ta vidéo montre le nom seul, pour qu'il ressorte au maximum) :

> **Là où la ville s'arrête.**

Autres pistes, au choix (il suffit de changer `PHRASE` en haut de `generer.py`) :

- Le début d'une histoire.
- Quelque chose se prépare.
- Bientôt, ici.
- Une terre, des chevaux, et le temps de vivre.
- Il y a des lieux que l'on visite. Et des lieux que l'on ressent.
- Pas de phrase du tout, juste le nom.

---

## 2. Le compte

**Nom d'utilisateur** : `@daughterofgaiatunis`
**Nom affiché** : `Daughter of Gaïa`
**Photo de profil** : `profil/photo-profil.jpg`
**Lien** : rien pour l'instant, ou le site s'il doit être en ligne au moment de l'annonce

### Bio

```
Private experiences 🌿
📍 La Soukra, Tunis
Bientôt.
```

Variante :

```
Là où la ville s'arrête.
📍 La Soukra, Tunis
L'histoire commence ici.
```

Pas de « stories à la une » au lancement : elles arriveront avec le concept.

---

## 3. L'annonce sur ton compte perso

**Story** : `stories/annonce-compte-perso.jpg`
Ajouter l'autocollant **Mention** `@daughterofgaiatunis` sous « Suivez l'aventure ».

**Légende du post :**

```
Il a enfin un nom.

Daughter of Gaïa.

Je vous en dis plus très bientôt.
En attendant, tout se passe ici 👉 @daughterofgaiatunis
```

> Publier les 12 posts du nouveau compte **avant** l'annonce, pour que les
> personnes qui cliquent arrivent sur un profil déjà rempli.

---

## 4. Les 12 posts

Publier de 01 à 12. Le 12, ta vidéo qui révèle le nom, arrive en dernier :
elle s'affichera en haut à gauche du profil.

Légendes courtes exprès : on montre, on n'explique pas.

**01 — `01-citation.jpg`**
```
There are places you visit. And there are places you feel.

Il y a des lieux que l'on visite. Et il y a des lieux que l'on ressent.
```

**02 — `02-cheval-bar.jpg`**
```
Il a ses habitudes. 🐎
```

**03 — `03-fenetre-chevaux-statuettes.jpg`**
```
Les voisins sont curieux.
```

**04 — `04-chevaux-fenetre.jpg`**
```
Le long du mur ocre.
```

**05 — `05-chevaux-pie-broutent.jpg`**
```
Le grand et le petit.
```

**06 — `06-refuge.jpg`**
```
Le refuge.

Sept chevaux recueillis. Quatre vivent ici aujourd'hui.
Les trois autres sont repartis une fois remis sur pied — et c'était bien le but.
```

**07 — `07-domaine.jpg`**
```
4 000 m² de nature préservée, aux portes de Tunis.
Le reste, très bientôt.
```

**08 — `08-ecuries.jpg`**
```
Chacun sa porte.
```

**09 — `09-terrasse-vasque.jpg`**
```
Deux curieux à la terrasse.
```

**10 — `10-trois-chevaux.jpg`**
```
Ils sont chez eux.
```

**11 — `11-cheval-noir-blanc.jpg`**
```
Il s'avance. Vous aussi ?
```

**12 — ta vidéo** (couverture : `fin-video/fin-sable.jpg`, voir la section 5)
```
Il a enfin un nom.

Daughter of Gaïa.
Gaïa, la Terre, dans la mythologie grecque.

L'histoire commence ici. 🌿
📍 La Soukra, Tunis
```

Si la vidéo n'est pas prête, la carte `posts/12-daughter-of-gaia.jpg` prend
sa place, avec la même légende : la grille reste identique.

Hashtags à ajouter en fin de légende (ou en premier commentaire) :
`#daughterofgaia #lasoukra #tunis #tunisie #chevaux #horses`

---

## 5. Publier ta vidéo (post 12)

1. Nouveau Reel → ta vidéo CapCut, en vertical 9:16.
2. **Couverture** : « Modifier la couverture » → « Ajouter depuis la galerie »
   → `fin-video/fin-sable.jpg`. Dans la grille, Instagram n'en montre que le
   centre : on y voit le nom comme sur la carte logo, et la grille reste
   celle de l'aperçu.
3. Vérifier que **« Afficher aussi dans le fil »** est activé, sinon la vidéo
   n'apparaît pas dans la grille du profil.
4. Légende : celle du 12 ci-dessus.

---

## 6. En réserve, pour les semaines suivantes

Trois images prêtes dans `plus-tard/`, à publier une par une après le
lancement pour faire vivre le compte :

**`plus-tard/gaia.jpg`**
```
Pourquoi Daughter of Gaïa ?

Gaïa, c'est la Terre dans la mythologie grecque.
Et ici, tout commence par elle. 🌿
```

**`plus-tard/suspension.jpg`**
```
Le verre, le fer, et la lumière du jardin.
```

**`plus-tard/jardin.jpg`**
```
Le jardin, en fin d'après-midi.
```
