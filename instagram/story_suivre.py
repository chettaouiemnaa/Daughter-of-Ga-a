"""Story qui invite à suivre @daughterofgaiatunis, à publier depuis le compte
perso. Un espace est laissé libre sous le compte pour l'autocollant
« Mention » : c'est lui qui rend le compte cliquable.

    python3 instagram/story_suivre.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

W, H = STORY
CREME = "#E3D6BE"


def masque_arche(w, h):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.pieslice((0, 0, w, w), 180, 360, fill=255)
    d.rectangle((0, w // 2, w, h), fill=255)
    return m


im = Image.new("RGB", STORY, CREME)
d = ImageDraw.Draw(im)
centre(d, 300, "SUIVEZ L’AVENTURE", sans(26, 300), OLIVE, W, 10)
aw, ah = 560, 720
im.paste(photo("trois-chevaux-envoyee.jpg", (aw, ah), (0.45, 0.6)), ((W - aw) // 2, 380), masque_arche(aw, ah))
f_nom = serif(taille_logo(800), 300)
y_nom = 1170
centre(d, y_nom, LOGO, f_nom, ENCRE, W)
y = ligne_domaine(d, W / 2, y_nom + f_nom.getmetrics()[0] + 55, TERRA, taille=26, esp=7, graisse=300, ep=1.5)
centre(d, y + 85, "@daughterofgaiatunis", sans(34, 300), ENCRE, W, 2)
# Emplacement de l'autocollant « Mention » : un fin cadre en pointillés, à recouvrir.
y0, y1, x0, x1 = y + 170, y + 290, W / 2 - 230, W / 2 + 230
for x in range(int(x0), int(x1), 18):
    d.line((x, y0, min(x + 9, x1), y0), fill=FILET, width=2)
    d.line((x, y1, min(x + 9, x1), y1), fill=FILET, width=2)
for yy in range(int(y0), int(y1), 18):
    d.line((x0, yy, x0, min(yy + 9, y1)), fill=FILET, width=2)
    d.line((x1, yy, x1, min(yy + 9, y1)), fill=FILET, width=2)
sauver(im, RACINE / "stories" / "suivre-la-page.jpg")

# Version sans le cadre, si l'autocollant est placé ailleurs.
im2 = im.copy()
ImageDraw.Draw(im2).rectangle((x0 - 2, y0 - 2, x1 + 2, y1 + 2), fill=CREME)
sauver(im2, RACINE / "stories" / "suivre-la-page-sans-cadre.jpg")
print("ok")
