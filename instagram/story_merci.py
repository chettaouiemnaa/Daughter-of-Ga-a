"""Story de remerciement après la révélation du nom : merci pour les
commentaires et les messages. Deux versions : crème avec Aïko dans l'arche,
ou la photo des deux pies sous le texte.

    python3 instagram/story_merci.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "stories"
W, H = STORY
CREME = "#E3D6BE"
f_titre = serif(76, 300)
f_italique = italique(76, 300)
PHRASE = "Merci pour chacun de vos mots."
f_logo = serif(taille_logo(560), 300)
SUITE = "Ils m'ont profondément touchée."


def masque_arche(w, h):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.pieslice((0, 0, w, w), 180, 360, fill=255)
    d.rectangle((0, w // 2, w, h), fill=255)
    return m


def textes(d, y, couleur, c_ligne):
    centre(d, y, PHRASE, f_titre, couleur, W)
    centre(d, y + 100, SUITE, f_italique, couleur, W)
    # Toujours la signature complète : le logo, puis la ligne du domaine.
    y_nom = y + 260
    centre(d, y_nom, LOGO, f_logo, couleur, W)
    return ligne_domaine(d, W / 2, y_nom + f_logo.getmetrics()[0] + 45, c_ligne, taille=24, esp=7, graisse=300, ep=1.5)


# 1. Crème : Aïko s'avance dans l'arche.
im = Image.new("RGB", STORY, CREME)
d = ImageDraw.Draw(im)
aw, ah = 600, 820
im.paste(photo("aiko.jpg", (aw, ah), (0.5, 0.55)), ((W - aw) // 2, 330), masque_arche(aw, ah))
textes(d, 1220, ENCRE, TERRA)
sauver(recentrer(im, CREME, H / 2), OUT / "merci-1-arche.jpg")

# 2. Les deux pies qui broutent, le texte posé au-dessus sur le crème.
im = Image.new("RGB", STORY, CREME)
haut = 940
im.paste(photo("chevaux-pie-broutent.jpg", (W, H - haut), (0.5, 0.75)), (0, haut))
textes(ImageDraw.Draw(im), 290, ENCRE, TERRA)
sauver(im, OUT / "merci-2-photo.jpg")

# 3. Autres photos dans l'arche : Iris et Stella, les chevaux à la vasque, Iris au bar.
# Chaque photo est d'abord recadrée (zone en px) pour approcher les chevaux.
AUTRES = [("chevaux-fenetre.jpg", (30, 330, 790, 1370), "merci-3-iris-stella"),
          ("terrasse-vasque.jpg", (0, 260, 700, 1218), "merci-4-vasque"),
          ("cheval-bar.jpg", None, "merci-5-bar")]
for nom, zone, sortie in AUTRES:
    src = ImageOps.exif_transpose(Image.open(PHOTOS / nom)).convert("RGB")
    if zone:
        src = src.crop(zone)
    im = Image.new("RGB", STORY, CREME)
    im.paste(ImageOps.fit(src, (aw, ah), Image.LANCZOS), ((W - aw) // 2, 330), masque_arche(aw, ah))
    textes(ImageDraw.Draw(im), 1220, ENCRE, TERRA)
    sauver(recentrer(im, CREME, H / 2), OUT / f"{sortie}.jpg")

# Aperçu côte à côte.
APERCU = ["merci-1-arche", "merci-2-photo"] + [a[2] for a in AUTRES]
pl = Image.new("RGB", (len(APERCU) * 560, 960), "white")
for i, n in enumerate(APERCU):
    pl.paste(Image.open(OUT / f"{n}.jpg").resize((540, 960)), (i * 560 + 10, 0))
sauver(pl, OUT / "merci-apercu.jpg")
print("ok")
