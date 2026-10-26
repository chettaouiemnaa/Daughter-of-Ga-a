"""Génère le kit de lancement Instagram de Daughter of Gaïa.

Sources : les photos du site (daughter-of-gaia/public/images) et les
couleurs / typographies de l'identité (voir le README du site).
Sortie : instagram/posts, instagram/stories, instagram/profil.

    python3 instagram/generer.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

RACINE = Path(__file__).resolve().parent
PHOTOS = RACINE.parent / "daughter-of-gaia" / "public" / "images"
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
    im = ImageOps.exif_transpose(Image.open(PHOTOS / nom)).convert("RGB")
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


def posts():
    out = RACINE / "posts"
    sur = "PRIVATE EXPERIENCES  •  BY RESERVATION"

    # 01 — l'annonce du nom
    sauver(carte(SABLE, ENCRE, [
        (sur, sans(22, 400), OLIVE, 330, 5),
        ("Daughter", serif(150), None, 470, 0),
        ("of Gaïa", italique(150), None, 620, 0),
        ("Un domaine privé où chaque", serif(46), None, 880, 0),
        ("expérience célèbre le vivant.", serif(46), None, 935, 0),
        ("LA SOUKRA  —  TUNIS", sans(22, 400), TERRA, 1080, 5),
    ]), out / "01-annonce.jpg")

    sauver(photo("jardin-soir.jpg", POST, (0.5, 0.6)), out / "02-jardin-soir.jpg")

    # 03 — la citation du site
    sauver(carte(OLIVE, BLANC, [
        ("“", serif(200), FILET, 330, 0),
        ("There are places", italique(84), None, 540, 0),
        ("you visit.", italique(84), None, 635, 0),
        ("And there are places", italique(84), None, 760, 0),
        ("you feel.", italique(84), None, 855, 0),
        ("DAUGHTER OF GAÏA", sans(22, 400), SABLE, 1060, 6),
    ]), out / "03-citation.jpg")

    sauver(photo("cheval-noir-blanc.jpg", POST, (0.5, 0.45)), out / "04-cheval-noir-blanc.jpg")

    # 05 — le refuge
    sauver(carte(TERRA, BLANC, [
        ("LE REFUGE", sans(24, 400), SABLE, 330, 7),
        ("Sauvés,", serif(120), None, 450, 0),
        ("réhabilités,", serif(120), None, 580, 0),
        ("et chez eux.", italique(120), None, 710, 0),
        ("Sept chevaux recueillis depuis l'ouverture.", serif(42), SABLE, 920, 0),
        ("Quatre vivent ici aujourd'hui.", serif(42), SABLE, 972, 0),
    ]), out / "05-refuge.jpg")

    sauver(photo("bar-nuit.jpg", POST, (0.5, 0.5)), out / "06-bar-nuit.jpg")

    # 07 — ce que le domaine accueille (la maison n'apparaît sur aucun visuel)
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
    ]), out / "07-experiences.jpg")

    sauver(photo("trois-chevaux.jpg", POST, (0.5, 0.6)), out / "08-trois-chevaux.jpg")
    sauver(photo("cheval-bar.jpg", POST, (0.5, 0.55)), out / "09-cheval-bar.jpg")
    sauver(photo("lanternes.jpg", POST, (0.45, 0.5)), out / "10-lanternes.jpg")
    sauver(photo("chevaux-fenetre.jpg", POST, (0.5, 0.6)), out / "11-chevaux-fenetre.jpg")

    # 12 — le domaine en chiffres
    sauver(carte(ENCRE, BLANC, [
        ("LE DOMAINE", sans(24, 400), FILET, 300, 7),
        ("4 000 m²", serif(150), None, 420, 0),
        ("où la ville disparaît", italique(70), SABLE, 600, 0),
        ("80 invités  ·  domaine privatisé  ·  7 chevaux sauvés", sans(28, 300), FILET, 820, 1),
        ("Sur réservation", serif(48), None, 960, 0),
        ("daughterofgaia.com", sans(26, 400), TERRA, 1040, 2),
    ]), out / "12-domaine.jpg")


def stories():
    out = RACINE / "stories"
    # L'annonce à publier depuis le compte perso.
    fond = photo("trois-chevaux.jpg", STORY, (0.5, 0.55))
    voile = Image.new("RGB", STORY, ENCRE)
    im = Image.blend(fond, voile, 0.55)
    d = ImageDraw.Draw(im)
    W = STORY[0]
    centre(d, 380, "LE NOM DU PROJET", sans(28, 400), SABLE, W, 8)
    centre(d, 520, "Daughter", serif(170), BLANC, W)
    centre(d, 690, "of Gaïa", italique(170), BLANC, W)
    centre(d, 960, "Un domaine privé où chaque", serif(54), SABLE, W)
    centre(d, 1025, "expérience célèbre le vivant.", serif(54), SABLE, W)
    # Emplacement laissé libre pour l'autocollant « Mention » ou « Lien ».
    centre(d, 1420, "Suivez l'aventure", sans(30, 400), SABLE, W, 3)
    centre(d, 1700, "LA SOUKRA  —  TUNIS", sans(24, 400), FILET, W, 6)
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

    # Couvertures des stories à la une.
    for nom, fond, enc in [("Le domaine", SABLE, ENCRE), ("Le refuge", TERRA, BLANC),
                           ("Expériences", OLIVE, BLANC),
                           ("Réserver", ENCRE, BLANC)]:
        im = Image.new("RGB", (t, t), fond)
        d = ImageDraw.Draw(im)
        centre(d, 430, nom, italique(150), enc, t)
        fichier = nom.lower().replace("é", "e").replace("è", "e").replace(" ", "-")
        sauver(im, out / f"une-{fichier}.jpg")


def apercu():
    """La grille telle qu'elle apparaîtra, du plus récent au plus ancien."""
    fichiers = ["12-domaine", "11-chevaux-fenetre", "10-lanternes", "09-cheval-bar",
                "08-trois-chevaux", "07-experiences", "06-bar-nuit", "05-refuge",
                "04-cheval-noir-blanc", "03-citation", "02-jardin-soir", "01-annonce"]
    c, g = 360, 4  # vignettes 3:4, comme la grille actuelle d'Instagram
    h = c * 4 // 3
    im = Image.new("RGB", (3 * c + 2 * g, 4 * h + 3 * g), "white")
    for i, f in enumerate(fichiers):
        v = ImageOps.fit(Image.open(RACINE / "posts" / f"{f}.jpg"), (c, h), Image.LANCZOS)
        im.paste(v, ((i % 3) * (c + g), (i // 3) * (h + g)))
    sauver(im, RACINE / "apercu-grille.jpg")


if __name__ == "__main__":
    posts()
    stories()
    profil()
    apercu()
    print("ok")
