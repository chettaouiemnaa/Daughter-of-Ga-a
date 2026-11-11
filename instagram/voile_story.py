"""Voile crème à poser par-dessus une publication partagée en story : une
arche laisse voir un petit bout de la photo, le reste est voilé.
Sort un PNG transparent (le calque) et un aperçu sur la photo du brasero.

    python3 instagram/voile_story.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "stories" / "voile"
W, H = STORY
CREME = (227, 214, 190)
OPACITE = 0.9
AW, AH, AY = 470, 640, 560          # l'arche découpée dans le voile


def arche(w, h):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.pieslice((0, 0, w, w), 180, 360, fill=255)
    d.rectangle((0, w // 2, w, h), fill=255)
    return m


# Le voile : crème translucide partout, sauf dans l'arche (bord adouci).
alpha = Image.new("L", STORY, int(255 * OPACITE))
trou = Image.new("L", STORY, 0)
trou.paste(arche(AW, AH), ((W - AW) // 2, AY))
trou = trou.filter(ImageFilter.GaussianBlur(2))
alpha = ImageChops.subtract(alpha, trou)
calque = Image.new("RGBA", STORY, CREME + (0,))
calque.putalpha(alpha)

# Le texte, dans les polices du logo, hors des zones recouvertes par Instagram.
texte = Image.new("RGBA", STORY, (0, 0, 0, 0))
d = ImageDraw.Draw(texte)
centre(d, 330, "Un autre petit bout de", italique(64, 300), ENCRE, W)
f_logo = serif(taille_logo(560), 300)
y_nom = AY + AH + 70
centre(d, y_nom, LOGO, f_logo, ENCRE, W)
ligne_domaine(d, W / 2, y_nom + f_logo.getmetrics()[0] + 45, TERRA, taille=22, esp=7, graisse=300, ep=1.5)
calque = Image.alpha_composite(calque, texte)
OUT.mkdir(parents=True, exist_ok=True)
calque.save(OUT / "voile-arche.png")

# Aperçu : la publication telle qu'Instagram la pose en story, puis le voile.
fond = Image.new("RGB", STORY, (40, 34, 30))
post = photo("feu-cheval-pie.jpg", (800, 1000), (0.5, 0.0))
# On place la publication pour que le cheval tombe dans l'arche.
fond.paste(post, (300, 360))
apercu = Image.alpha_composite(fond.convert("RGBA"), calque).convert("RGB")
sauver(apercu, OUT / "apercu-voile.jpg")
print("ok")
