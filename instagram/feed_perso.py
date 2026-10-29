"""Le fil de @daughterofgaiatunis, recomposé à partir des fichiers d'origine
(sans les compteurs de vues), pour l'annoncer depuis le compte perso.
Chaque case montre le centre 3:4, comme la grille du profil.

    python3 instagram/feed_perso.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "compte-perso"
OUT.mkdir(exist_ok=True)
GRILLE = [
    ("fin-video/couverture-reel.jpg", "09-terrasse-vasque"),
    "posts/11-cheval-noir-blanc.jpg", "posts/09-terrasse-vasque.jpg",
    "posts/10-trois-chevaux.jpg", "posts/08-ecuries.jpg", "posts/07-domaine.jpg",
    "posts/06-refuge.jpg", "posts/05-chevaux-pie-broutent.jpg", "posts/04-chevaux-fenetre.jpg",
    "posts/03-fenetre-chevaux-statuettes.jpg", "posts/02-cheval-bar.jpg", "posts/01-citation.jpg",
]
CW, CH, GAP = 720, 960, 6


def case(chemin):
    im = Image.open(RACINE / chemin).convert("RGB")
    w, h = im.size
    if h / w > 1.5:  # Reel 9:16 : la grille en montre le centre 3:4
        im = im.crop((0, 240, w, 1680))
    else:            # post 4:5 : centre 3:4
        cw = round(h * 3 / 4)
        im = im.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
    return im.resize((CW, CH), Image.LANCZOS)


def grille(fond="white"):
    im = Image.new("RGB", (3 * CW + 2 * GAP, 4 * CH + 3 * GAP), fond)
    for i, c in enumerate(GRILLE):
        chemin = c[0] if isinstance(c, tuple) else c
        im.paste(case(chemin), ((i % 3) * (CW + GAP), (i // 3) * (CH + GAP)))
    return im


g = grille()
sauver(g, OUT / "fil-sans-vues.jpg")
print(g.size)

# Story pour le compte perso : le fil au centre, la signature et le compte.
W, H = STORY
# Fond blanc cassé : la couverture du Reel, crème, se détache ainsi du fond.
im = Image.new("RGB", STORY, BLANC)
d = ImageDraw.Draw(im)
centre(d, 250, "SUIVEZ L’AVENTURE", sans(26, 300), OLIVE, W, 10)
gh = 1000
gw = round(gh * g.width / g.height)
im.paste(grille(BLANC).resize((gw, gh), Image.LANCZOS), ((W - gw) // 2, 330))
f_logo = serif(taille_logo(440), 300)
y_nom = 330 + gh + 70
centre(d, y_nom, LOGO, f_logo, ENCRE, W)
y = ligne_domaine(d, W / 2, y_nom + f_logo.getmetrics()[0] + 45, TERRA, taille=20, esp=6, graisse=300, ep=1.5, trait=50, ecart=18)
centre(d, y + 55, "@daughterofgaiatunis", sans(28, 300), ENCRE, W, 2)
sauver(recentrer(im, BLANC, H / 2), OUT / "story-fil.jpg")
print("ok")
