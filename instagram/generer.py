"""Génère le kit de lancement Instagram de Daughter of Gaïa.

Sources : les photos du site (daughter-of-gaia/public/images) et les
couleurs / typographies de l'identité (voir le README du site).
Sortie : instagram/posts, instagram/stories, instagram/profil, instagram/plus-tard.

    python3 instagram/generer.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

RACINE = Path(__file__).resolve().parent
PHOTOS = RACINE.parent / "daughter-of-gaia" / "public" / "images"
PHOTOS_KIT = RACINE / "photos"  # photos propres au kit, absentes du site
POLICES = Path(sys.argv[1]) if len(sys.argv) > 1 else RACINE / "polices"

SABLE, BLANC, ENCRE = "#EDE4D3", "#F6F1E7", "#2B2118"
OLIVE, TERRA, FILET = "#6B7355", "#B5654A", "#C7B79A"

POST = (1080, 1350)   # 4:5, le format portrait du fil
STORY = (1080, 1920)  # 9:16


def police(nom, taille, graisse=300):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    try:
        f.set_variation_by_axes([graisse])
    except Exception:
        pass
    return f


def serif(t, g=300): return police("CormorantGaramond[wght].ttf", t, g)
def italique(t, g=300): return police("CormorantGaramond-Italic[wght].ttf", t, g)
def sans(t, g=300): return police("Jost[wght].ttf", t, g)


def photo(nom, taille, centre=(0.5, 0.5)):
    src = PHOTOS_KIT / nom if (PHOTOS_KIT / nom).exists() else PHOTOS / nom
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    return ImageOps.fit(im, taille, Image.LANCZOS, centering=centre)


def centre(d, y, texte, f, couleur, larg, espacement=0):
    """Écrit une ligne centrée ; espacement = interlettrage en px."""
    if espacement:
        w = sum(d.textlength(c, font=f) for c in texte) + espacement * (len(texte) - 1)
        x = (larg - w) / 2
        for c in texte:
            d.text((x, y), c, font=f, fill=couleur)
            x += d.textlength(c, font=f) + espacement
    else:
        w = d.textlength(texte, font=f)
        d.text(((larg - w) / 2, y), texte, font=f, fill=couleur)


def carte(fond, encre, lignes, taille=POST):
    """Carte typographique. lignes = [(texte, police, couleur|None, y, interlettrage)]."""
    im = Image.new("RGB", taille, fond)
    d = ImageDraw.Draw(im)
    for texte, f, c, y, esp in lignes:
        centre(d, y, texte, f, c or encre, taille[0], esp)
    return im


def sauver(im, chemin):
    chemin.parent.mkdir(parents=True, exist_ok=True)
    im.save(chemin, quality=92, optimize=True)


# La phrase sous le nom. Une seule ligne à changer pour en essayer une autre
# (pistes dans TEXTES.md). Elle ne dit rien du concept, pas encore annoncé.
PHRASE = "Là où la ville s'arrête."


def titre_sur_photo(nom, taille, pos, y0, voile=0.18):
    """Le nom posé sur une photo, avec un voile sombre fondu sous le texte."""
    W, H = taille
    im = Image.blend(photo(nom, taille, pos), Image.new("RGB", taille, ENCRE), voile)
    masque = Image.new("L", taille, 0)
    ImageDraw.Draw(masque).rectangle((0, y0 - 40, W, y0 + 500), fill=175)
    masque = masque.filter(ImageFilter.GaussianBlur(140))
    im = Image.composite(Image.new("RGB", taille, ENCRE), im, masque)
    d = ImageDraw.Draw(im)
    centre(d, y0, "Daughter", serif(150), BLANC, W)
    centre(d, y0 + 150, "of Gaïa", italique(150), BLANC, W)
    centre(d, y0 + 360, PHRASE, italique(58), BLANC, W)
    return im


# Les 9 premiers posts, du premier publié au dernier. Le 9 (le nom) arrive
# en dernier pour s'afficher en haut à gauche du profil.
LANCEMENT = [
    ("bar-nuit.jpg", (0.5, 0.5)),
    ("trois-chevaux.jpg", (0.5, 0.6)),
    ("cheval-bar.jpg", (0.5, 0.55)),
    ("fenetre-chevaux-statuettes.jpg", (0.5, 0.45)),
    ("chevaux-pie-broutent.jpg", (0.5, 0.72)),
    ("chevaux-fenetre.jpg", (0.5, 0.6)),
    ("terrasse-vasque.jpg", (0.5, 0.5)),
    ("cheval-noir-blanc.jpg", (0.5, 0.45)),
]


def posts():
    out = RACINE / "posts"
    for i, (nom, pos) in enumerate(LANCEMENT, 1):
        sauver(photo(nom, POST, pos), out / f"{i:02d}-{nom.rsplit('.', 1)[0]}.jpg")
    sauver(titre_sur_photo("jardin-soir.jpg", POST, (0.5, 0.6), 380), out / "09-daughter-of-gaia.jpg")


def plus_tard():
    """Cartes qui expliquent le concept : à publier une fois celui-ci annoncé."""
    out = RACINE / "plus-tard"
    sauver(carte(OLIVE, BLANC, [
        ("“", serif(200), FILET, 330, 0),
        ("There are places", italique(84), None, 540, 0),
        ("you visit.", italique(84), None, 635, 0),
        ("And there are places", italique(84), None, 760, 0),
        ("you feel.", italique(84), None, 855, 0),
        ("DAUGHTER OF GAÏA", sans(22, 400), SABLE, 1060, 6),
    ]), out / "citation.jpg")
    sauver(carte(TERRA, BLANC, [
        ("LE REFUGE", sans(24, 400), SABLE, 330, 7),
        ("Sauvés,", serif(120), None, 450, 0),
        ("réhabilités,", serif(120), None, 580, 0),
        ("et chez eux.", italique(120), None, 710, 0),
        ("Sept chevaux recueillis depuis l'ouverture.", serif(42), SABLE, 920, 0),
        ("Quatre vivent ici aujourd'hui.", serif(42), SABLE, 972, 0),
    ]), out / "refuge.jpg")
    sauver(carte(BLANC, ENCRE, [
        ("EXPÉRIENCES", sans(24, 400), OLIVE, 250, 7),
        ("Ce que le domaine", serif(82), None, 330, 0),
        ("accueille", italique(82), None, 425, 0),
        ("Séminaires & journées d'équipe", serif(46), None, 610, 0),
        ("Lancements de marque", serif(46), None, 675, 0),
        ("Anniversaires  ·  Baby showers", serif(46), None, 740, 0),
        ("Brunchs privés  ·  Tables d'hôte", serif(46), None, 805, 0),
        ("Shootings photo & vidéo", serif(46), None, 870, 0),
        ("DOMAINE PRIVATISÉ  —  SUR RÉSERVATION", sans(22, 400), TERRA, 1040, 5),
    ]), out / "experiences.jpg")
    sauver(carte(ENCRE, BLANC, [
        ("LE DOMAINE", sans(24, 400), FILET, 300, 7),
        ("4 000 m²", serif(150), None, 420, 0),
        ("où la ville disparaît", italique(70), SABLE, 600, 0),
        ("80 invités  ·  domaine privatisé  ·  7 chevaux sauvés", sans(28, 300), FILET, 820, 1),
        ("Sur réservation", serif(48), None, 960, 0),
        ("daughterofgaia.com", sans(26, 400), TERRA, 1040, 2),
    ]), out / "domaine.jpg")

    # Couvertures des stories à la une, une fois qu'il y aura de quoi les remplir.
    t = 1080
    for nom, fond, enc in [("Le domaine", SABLE, ENCRE), ("Le refuge", TERRA, BLANC),
                           ("Expériences", OLIVE, BLANC), ("Réserver", ENCRE, BLANC)]:
        im = Image.new("RGB", (t, t), fond)
        centre(ImageDraw.Draw(im), 430, nom, italique(150), enc, t)
        fichier = nom.lower().replace("é", "e").replace("è", "e").replace(" ", "-")
        sauver(im, out / f"une-{fichier}.jpg")


def stories():
    out = RACINE / "stories"
    # L'annonce à publier depuis le compte perso.
    im = titre_sur_photo("trois-chevaux.jpg", STORY, (0.5, 0.55), 560, voile=0.35)
    d = ImageDraw.Draw(im)
    W = STORY[0]
    centre(d, 440, "LE NOM DU PROJET", sans(28, 400), SABLE, W, 8)
    # Emplacement laissé libre pour l'autocollant « Mention » ou « Lien ».
    centre(d, 1420, "Suivez l'aventure", sans(30, 400), SABLE, W, 3)
    sauver(im, out / "annonce-compte-perso.jpg")


def profil():
    out = RACINE / "profil"
    # Photo de profil : monogramme, lisible même en tout petit.
    t = 1080
    im = Image.new("RGB", (t, t), SABLE)
    d = ImageDraw.Draw(im)
    # Pas de texte en plus : Instagram rogne en cercle et l'affiche à 110 px.
    d.text((t / 2, t / 2), "G", font=serif(640, 300), fill=ENCRE, anchor="mm")
    sauver(im, out / "photo-profil.jpg")


def apercu():
    """La grille telle qu'elle apparaîtra, du plus récent au plus ancien."""
    fichiers = sorted((RACINE / "posts").glob("*.jpg"), reverse=True)
    c, g = 360, 4  # vignettes 3:4, comme la grille actuelle d'Instagram
    h = c * 4 // 3
    lignes = len(fichiers) // 3
    im = Image.new("RGB", (3 * c + 2 * g, lignes * h + (lignes - 1) * g), "white")
    for i, f in enumerate(fichiers):
        v = ImageOps.fit(Image.open(f), (c, h), Image.LANCZOS)
        im.paste(v, ((i % 3) * (c + g), (i // 3) * (h + g)))
    sauver(im, RACINE / "apercu-grille.jpg")


if __name__ == "__main__":
    posts()
    plus_tard()
    stories()
    profil()
    apercu()
    print("ok")
