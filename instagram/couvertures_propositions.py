"""Trois couvertures plus remplies, fond crème, photos intégrées."""
import sys
sys.argv = ["x"]
sys.path.insert(0, "/home/user/Daughter-of-Ga-a/instagram")
import generer as g
from PIL import Image, ImageDraw, ImageOps

OUT = g.RACINE / "fin-video" / "propositions"
OUT.mkdir(parents=True, exist_ok=True)
W, H = g.STORY
CREME = "#E3D6BE"
f_nom = g.serif(g.taille_logo(800), 300)


def textes(d, haut, sur="THE STORY BEHIND"):
    """Bloc texte commun : petite ligne, logo, ligne du domaine."""
    g.centre(d, haut, sur, g.sans(26, 300), g.OLIVE, W, 10)
    y_nom = haut + 70
    g.centre(d, y_nom, g.LOGO, f_nom, g.ENCRE, W)
    g.ligne_domaine(d, W / 2, y_nom + f_nom.getmetrics()[0] + 60, g.TERRA, taille=26, esp=7, graisse=300, ep=1.5)


def masque_arche(w, h):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.pieslice((0, 0, w, w), 180, 360, fill=255)
    d.rectangle((0, w // 2, w, h), fill=255)
    return m


# 1. L'arche : les trois chevaux dans une fenêtre en arc, comme une porte du domaine.
im = Image.new("RGB", (W, H), CREME)
aw, ah = 620, 860
photo = g.photo("trois-chevaux.jpg", (aw, ah), (0.5, 0.6))
im.paste(photo, ((W - aw) // 2, 330), masque_arche(aw, ah))
textes(ImageDraw.Draw(im), 1290)
g.sauver(im, OUT / "1-arche.jpg")

# 2. Le médaillon : le visage d'Aïko dans un rond, avec un fin cercle autour.
im = Image.new("RGB", (W, H), CREME)
d = ImageDraw.Draw(im)
r = 330
cx, cy = W // 2, 720
src = Image.open(g.PHOTOS_KIT / "aiko.jpg").convert("RGB").crop((225, 255, 835, 865)).resize((2 * r, 2 * r), Image.LANCZOS)
rond = Image.new("L", (2 * r, 2 * r), 0)
ImageDraw.Draw(rond).ellipse((0, 0, 2 * r, 2 * r), fill=255)
im.paste(src, (cx - r, cy - r), rond)
d.ellipse((cx - r - 22, cy - r - 22, cx + r + 22, cy + r + 22), outline=g.TERRA, width=2)
textes(d, 1190)
g.sauver(im, OUT / "2-medaillon.jpg")

# 3. Les quatre : Aïko, Iris et Stella, Ponette, en trois bandes, et leurs prénoms.
im = Image.new("RGB", (W, H), CREME)
d = ImageDraw.Draw(im)
bw, bh, gap, top = 290, 640, 24, 380
x0 = (W - (3 * bw + 2 * gap)) // 2
bandes = [("aiko.jpg", (0.5, 0.4), "AÏKO"), ("chevaux-fenetre.jpg", (0.55, 0.6), "IRIS & STELLA"),
          ("trois-chevaux.jpg", (0.62, 0.85), "PONETTE")]
for i, (nom, pos, prenom) in enumerate(bandes):
    x = x0 + i * (bw + gap)
    im.paste(g.photo(nom, (bw, bh), pos), (x, top))
    g.centre(d, top + bh + 22, prenom, g.sans(19, 400), g.OLIVE, 2 * x + bw, 5)
textes(d, 1180)
g.sauver(im, OUT / "3-les-quatre.jpg")

# Aperçu : entières, puis telles que la grille les montre (centre 3:4).
noms = ["1-arche", "2-medaillon", "3-les-quatre"]
pl = Image.new("RGB", (3 * 400, 600 + 20 + 420), "white")
for i, n in enumerate(noms):
    c = Image.open(OUT / f"{n}.jpg")
    pl.paste(c.resize((338, 600)), (i * 400 + 31, 0))
    pl.paste(c.crop((0, 240, W, 1680)).resize((315, 420)), (i * 400 + 42, 620))
g.sauver(pl, OUT / "apercu.jpg")
print("ok")
