"""Deux stories à publier avant la vidéo qui révèle le nom. Le nom n'y
apparaît pas : la vidéo le révèle.

Elles ne reprennent rien du texte de la vidéo (la nature, Gaïa, la Terre,
« ralentir ») : la première pose la question, la seconde présente ceux qui
vivent ici. Le texte reste hors des zones qu'Instagram recouvre (photo de
profil en haut, barre de réponse en bas).

    python3 instagram/stories_avant_video.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "stories"
W, H = STORY
CREME = "#E3D6BE"
f_titre = serif(92, 300)
f_italique = italique(92, 300)


def lignes(d, y, textes, f, couleur, interligne):
    for t in textes:
        centre(d, y, t, f, couleur, W)
        y += interligne
    return y


# Story 1 : la question.
im = Image.new("RGB", STORY, CREME)
d = ImageDraw.Draw(im)
centre(d, 560, "AVANT LA VIDÉO", sans(26, 300), OLIVE, W, 10)
y = lignes(d, 660, ["Un nom ne se choisit", "pas au hasard."], f_titre, ENCRE, 112)
y = lignes(d, y + 60, ["Celui-ci, je l'ai porté", "longtemps avant", "de le prononcer."], f_italique, ENCRE, 112)
ligne_domaine(d, W / 2, y + 110, TERRA, taille=26, esp=7, graisse=300, ep=1.5)
sauver(recentrer(im, CREME, H / 2), OUT / "avant-video-1.jpg")

# Story 2 : ceux qui vivent ici, et le rendez-vous.
im = Image.new("RGB", STORY, CREME)
d = ImageDraw.Draw(im)
centre(d, 330, "ILS VIVENT ICI", sans(26, 300), OLIVE, W, 10)
bw, bh, gap, top = 290, 560, 24, 410
x0 = (W - (3 * bw + 2 * gap)) // 2
bandes = [("aiko.jpg", (0.5, 0.4), "AÏKO"), ("chevaux-fenetre.jpg", (0.55, 0.6), "IRIS & STELLA"),
          ("trois-chevaux.jpg", (0.62, 0.85), "PONETTE")]
for i, (nom, pos, prenom) in enumerate(bandes):
    x = x0 + i * (bw + gap)
    im.paste(photo(nom, (bw, bh), pos), (x, top))
    centre(d, top + bh + 24, prenom, sans(20, 400), OLIVE, 2 * x + bw, 5)
y = lignes(d, 1130, ["Ce nom leur ressemble."], f_titre, ENCRE, 112)
y = lignes(d, y + 30, ["Je vous raconte pourquoi,", "dans quelques instants."], f_italique, ENCRE, 100)
sauver(im, OUT / "avant-video-2.jpg")
print("ok")
