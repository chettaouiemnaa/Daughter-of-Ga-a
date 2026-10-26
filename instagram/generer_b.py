"""Variante B du kit Instagram : grille « éditoriale ».

Une bannière panoramique sur toute la première ligne, puis chaque photo
posée dans un cadre sable avec une légende façon magazine.
Sortie : instagram/variante-b.

    python3 instagram/generer_b.py
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from generer import (RACINE, POLICES, POST, SABLE, BLANC, ENCRE, OLIVE, TERRA, FILET,
                     serif, italique, sans, photo, centre, carte, sauver)

OUT = RACINE / "variante-b"


def mono(t):
    return ImageFont.truetype(str(POLICES / "IBMPlexMono-Regular.ttf"), t)


def cadre(nom, num, legende, pos=(0.5, 0.5)):
    """Photo dans un cadre sable. Marges latérales larges : la grille
    d'Instagram rogne 34 px de chaque côté des posts 4:5."""
    im = Image.new("RGB", POST, SABLE)
    m, haut, bas = 96, 96, 210
    im.paste(photo(nom, (POST[0] - 2 * m, POST[1] - haut - bas), pos), (m, haut))
    d = ImageDraw.Draw(im)
    y = POST[1] - bas + 62
    d.text((m, y), f"N° {num:02d}", font=mono(24), fill=TERRA)
    texte = legende.upper()
    d.text((POST[0] - m - d.textlength(texte, font=mono(24)), y), texte, font=mono(24), fill=ENCRE)
    return im


def banniere():
    """Une image coupée en trois posts. Le nom est entièrement dans la
    tuile du milieu, pour que chaque post reste lisible seul dans le fil."""
    W, H = POST[0] * 3, POST[1]
    fond = photo("lanternes.jpg", (W, H), (0.5, 0.55))
    im = Image.blend(fond, Image.new("RGB", (W, H), ENCRE), 0.42)
    x0 = POST[0]
    # Voile plus dense sous le texte, fondu vers les bords de la tuile.
    masque = Image.new("L", (W, H), 0)
    ImageDraw.Draw(masque).rectangle((x0 + 60, 330, 2 * x0 - 60, 1120), fill=150)
    masque = masque.filter(ImageFilter.GaussianBlur(120))
    im = Image.composite(Image.new("RGB", (W, H), ENCRE), im, masque)
    for texte, f, c, y, esp in [
        ("PRIVATE EXPERIENCES", sans(22, 400), FILET, 400, 6),
        ("Daughter", serif(150), BLANC, 480, 0),
        ("of Gaïa", italique(150), BLANC, 630, 0),
        ("Un domaine privé où chaque", serif(42), SABLE, 880, 0),
        ("expérience célèbre le vivant.", serif(42), SABLE, 932, 0),
        ("LA SOUKRA  —  TUNIS", sans(22, 400), FILET, 1060, 6),
    ]:
        tuile = Image.new("RGBA", POST, (0, 0, 0, 0))
        centre(ImageDraw.Draw(tuile), y, texte, f, c, POST[0], esp)
        im.paste(tuile, (x0, 0), tuile)
    # Publiées de droite à gauche : la dernière publiée s'affiche à gauche.
    for i, n in enumerate([12, 11, 10]):
        sauver(im.crop((i * POST[0], 0, (i + 1) * POST[0], H)), OUT / f"{n:02d}-banniere-{'gauche milieu droite'.split()[i]}.jpg")


def posts():
    photos = [
        (1, "cheval-noir-blanc.jpg", "Il avance", (0.5, 0.45)),
        (2, "jardin-soir.jpg", "Le jardin, le soir", (0.5, 0.6)),
        (3, "bar-nuit.jpg", "Le bar, à la nuit tombée", (0.5, 0.5)),
        (4, "trois-chevaux.jpg", "Ils sont chez eux", (0.5, 0.6)),
        (6, "cheval-bar.jpg", "Un habitué", (0.5, 0.55)),
        (7, "chevaux-fenetre.jpg", "Le long du mur ocre", (0.5, 0.6)),
        (8, "chevaux-pie-broutent.jpg", "Côte à côte", (0.5, 0.72)),
        (9, "fenetre-chevaux-statuettes.jpg", "Les voisins", (0.5, 0.45)),
    ]
    for num, nom, leg, pos in photos:
        sauver(cadre(nom, num, leg, pos), OUT / f"{num:02d}-{nom.rsplit('.', 1)[0]}.jpg")

    # 05 — au centre de la grille, la seule carte texte
    sauver(carte(TERRA, BLANC, [
        ("LE REFUGE", sans(24, 400), SABLE, 330, 7),
        ("Sauvés,", serif(120), None, 450, 0),
        ("réhabilités,", serif(120), None, 580, 0),
        ("et chez eux.", italique(120), None, 710, 0),
        ("Sept chevaux recueillis depuis l'ouverture.", serif(42), SABLE, 920, 0),
        ("Quatre vivent ici aujourd'hui.", serif(42), SABLE, 972, 0),
    ]), OUT / "05-refuge.jpg")


def apercu():
    fichiers = sorted(OUT.glob("[0-9][0-9]-*.jpg"), key=lambda p: p.name, reverse=True)
    # 12, 11, 10 sont la bannière : gauche, milieu, droite.
    c, g = 360, 4
    h = c * 4 // 3
    im = Image.new("RGB", (3 * c + 2 * g, 4 * h + 3 * g), "white")
    for i, f in enumerate(fichiers):
        v = ImageOps.fit(Image.open(f), (c, h), Image.LANCZOS)
        im.paste(v, ((i % 3) * (c + g), (i // 3) * (h + g)))
    sauver(im, OUT / "apercu-grille.jpg")


if __name__ == "__main__":
    banniere()
    posts()
    apercu()
    print("ok")
