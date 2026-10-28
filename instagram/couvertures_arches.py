import sys
sys.argv = ["x"]
sys.path.insert(0, "/home/user/Daughter-of-Ga-a/instagram")
import generer as g
from PIL import Image, ImageDraw, ImageOps
exec(open("/home/user/Daughter-of-Ga-a/instagram/couvertures_propositions.py").read().split("# 1. L'arche")[0].split("OUT.mkdir")[1].split("\n", 1)[1])
OUT = g.RACINE / "fin-video" / "propositions"
for nom, src, pos in [("arche-portrait", "portrait-gaia.jpg", (0.45, 0.35))]:
    im = Image.new("RGB", (W, H), CREME)
    aw, ah = 620, 860
    im.paste(g.photo(src, (aw, ah), pos), ((W - aw) // 2, 330), masque_arche(aw, ah))
    textes(ImageDraw.Draw(im), 1290)
    g.sauver(im, OUT / f"{nom}.jpg")
# Les deux premières lignes du profil avec chaque couverture.
grille = Image.open(g.RACINE / "apercu-grille.jpg")
c = (grille.width - 8) // 3; h = c * 4 // 3
pl = Image.new("RGB", (2 * grille.width + 40, 2 * h + 4), "white")
for i, nom in enumerate(["arche-portrait"]):
    g2 = grille.crop((0, 0, grille.width, 2 * h + 4)).copy()
    couv = Image.open(OUT / f"{nom}.jpg").crop((0, 240, W, 1680))
    g2.paste(ImageOps.fit(couv, (c, h)), (0, 0))
    pl.paste(g2, (i * (grille.width + 40), 0))
g.sauver(pl, OUT / "apercu-portrait-grille.jpg")
print("ok")
