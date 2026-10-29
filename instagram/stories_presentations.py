"""Stories « Faire connaissance » : une introduction, puis un cheval par
story, avec son prénom, son âge et une phrase. Même arche que les autres
stories ; signature complète en bas. Le texte reste hors des zones
qu'Instagram recouvre.

    python3 instagram/stories_presentations.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "stories" / "presentations"
OUT.mkdir(parents=True, exist_ok=True)
W, H = STORY
CREME = "#E3D6BE"
f_logo = serif(taille_logo(440), 300)

# (fichier, zone recadrée en px ou None, prénom, âge, phrase en deux lignes)
CHEVAUX = [
    ("aiko.jpg", None, "Aïko", "22 MOIS",
     ["Il n'a pas encore deux ans,", "et déjà toute sa place ici."]),
    ("cheval-bar.jpg", None, "Iris", "18 ANS",
     ["La plus sage du domaine.", "Et la maman de Stella."]),
    ("fenetre-chevaux-statuettes.jpg", (590, 470, 1010, 1040), "Stella", "6 MOIS",
     ["La fille d'Iris,", "et la plus jeune de la famille."]),
    ("trois-chevaux.jpg", (320, 740, 790, 1360), "Ponette", "8 ANS",
     ["Petite par la taille,", "immense par le caractère."]),
]


def source(nom, zone):
    src = PHOTOS_KIT / nom if (PHOTOS_KIT / nom).exists() else PHOTOS / nom
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    return im.crop(zone) if zone else im


def masque_arche(w, h):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.pieslice((0, 0, w, w), 180, 360, fill=255)
    d.rectangle((0, w // 2, w, h), fill=255)
    return m


def signature(d, y):
    centre(d, y, LOGO, f_logo, ENCRE, W)
    return ligne_domaine(d, W / 2, y + f_logo.getmetrics()[0] + 40, TERRA,
                         taille=20, esp=6, graisse=300, ep=1.5, trait=50, ecart=18)


# Introduction : les quatre dans de petites arches, puis l'invitation.
im = Image.new("RGB", STORY, CREME)
d = ImageDraw.Draw(im)
centre(d, 250, "FAIRE CONNAISSANCE", sans(26, 300), OLIVE, W, 10)
aw, ah, gap = 210, 300, 22
x0 = (W - (4 * aw + 3 * gap)) // 2
for i, (nom, zone, prenom, _, _) in enumerate(CHEVAUX):
    x = x0 + i * (aw + gap)
    im.paste(ImageOps.fit(source(nom, zone), (aw, ah), Image.LANCZOS), (x, 340), masque_arche(aw, ah))
    centre(d, 340 + ah + 22, prenom.upper(), sans(19, 400), OLIVE, 2 * x + aw, 5)
y = 860
for t in ["Ils sont le cœur", "de ce lieu."]:
    centre(d, y, t, serif(86, 300), ENCRE, W)
    y += 104
for t in ["Laissez-moi vous les présenter,", "un par un."]:
    centre(d, y + 30, t, italique(64, 300), ENCRE, W)
    y += 80
signature(d, y + 130)
sauver(recentrer(im, CREME, H / 2), OUT / "0-introduction.jpg")

# Un cheval par story.
aw, ah = 560, 760
for i, (nom, zone, prenom, age, phrase) in enumerate(CHEVAUX, 1):
    im = Image.new("RGB", STORY, CREME)
    d = ImageDraw.Draw(im)
    centre(d, 250, f"FAIRE CONNAISSANCE  ·  {i}/4", sans(24, 300), OLIVE, W, 8)
    im.paste(ImageOps.fit(source(nom, zone), (aw, ah), Image.LANCZOS), ((W - aw) // 2, 330), masque_arche(aw, ah))
    f_nom = serif(150, 300)
    centre(d, 1120, prenom, f_nom, ENCRE, W)
    centre(d, 1315, age, sans(24, 400), TERRA, W, 8)
    y = 1370
    for t in phrase:
        centre(d, y, t, italique(58, 300), ENCRE, W)
        y += 70
    signature(d, y + 60)
    sauver(recentrer(im, CREME, H / 2), OUT / f"{i}-{prenom.lower().replace('ï', 'i')}.jpg")

# Aperçu de la série.
noms = ["0-introduction", "1-aiko", "2-iris", "3-stella", "4-ponette"]
pl = Image.new("RGB", (5 * 440, 780), "white")
for i, n in enumerate(noms):
    pl.paste(Image.open(OUT / f"{n}.jpg").resize((430, 764)), (i * 440 + 5, 8))
sauver(pl, OUT / "apercu.jpg")
print("ok")
