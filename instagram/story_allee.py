"""Story : l'allée qui mène au portail, et un cheval qui attend derrière.

L'allée est redressée pour être bien droite et au centre : les haies de gauche
et de droite tombent alors à la même distance. La phrase est en blanc en haut,
sur le feuillage ; la signature est écrite en brun foncé à même les dalles,
le nom sur une dalle et « DOMAINE • LA SOUKRA » sur la suivante.

    python3 instagram/story_allee.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from signature import BLANC, ENCRE, POLICES, TERRA
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
# Sur la photo d'origine, l'axe de l'allée part du poteau du portail (x = 560,
# y = 790) et glisse vers la gauche de 0,088 px par ligne en descendant.
AXE_X, AXE_Y, PENTE = 560, 790, 0.088
# Les dalles qui portent la signature, une fois la story à 1080 × 1920
# (mesurées sur le profil de luminosité de l'allée redressée).
DALLE_NOM, DALLE_LIEU = (1606, 1648), (1698, 1731)
PHRASE = ("Quelqu'un vous attend", "au bout du chemin.")


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def redresser(src):
    """Décale chaque ligne sous le portail pour rendre l'axe de l'allée vertical
    (avec une entrée en douceur sur 80 lignes, sans cassure)."""
    a = np.asarray(src)
    h, w, _ = a.shape
    out = np.empty_like(a)
    for y in range(h):
        t = y - AXE_Y
        s = 0 if t <= 0 else (PENTE * t * t / 160 if t < 80 else PENTE * (t - 40))
        xs = np.clip(np.arange(w) - s, 0, w - 1)
        x0 = np.floor(xs).astype(int)
        x1 = np.minimum(x0 + 1, w - 1)
        f = (xs - x0)[:, None]
        out[y] = (a[y, x0] * (1 - f) + a[y, x1] * f).astype(np.uint8)
    im = Image.fromarray(out)
    cw = round(h * 9 / 16)
    gauche = AXE_X - cw // 2
    return im.crop((gauche, 0, gauche + cw, h)).resize((W, H), Image.LANCZOS)


def nom_sur_dalle(d, dalle):
    """« Daughter of Gaïa » centré sur la dalle, à la hauteur de la dalle."""
    haut, bas = dalle
    taille = 10
    while True:
        f = police("CormorantGaramond[wght].ttf", taille + 1, 500)
        x0, y0, x1, y1 = f.getbbox("Daughter of Gaïa", anchor="ls")
        if y1 - y0 > (bas - haut) * 1.08:
            break
        taille += 1
    f = police("CormorantGaramond[wght].ttf", taille, 500)
    x0, y0, x1, y1 = f.getbbox("Daughter of Gaïa", anchor="ls")
    base = (haut + bas) / 2 - (y0 + y1) / 2
    d.text((W / 2 - (x0 + x1) / 2, base), "Daughter of Gaïa", font=f, fill=ENCRE, anchor="ls")


def lieu_sur_dalle(d, dalle, couleur=TERRA):
    """« —— DOMAINE • LA SOUKRA —— » centré sur la dalle suivante."""
    haut, bas = dalle
    f, esp, gap = police("Jost[wght].ttf", 15, 600), 4.5, 12
    mots = ("DOMAINE", "LA SOUKRA")

    def chasse(m):
        return sum(d.textlength(c, font=f) for c in m) + esp * (len(m) - 1)

    larg = chasse(mots[0]) + 2 * gap + chasse(mots[1])
    cap = f.getbbox("D", anchor="ls")
    base = (haut + bas) / 2 - (cap[1] + cap[3]) / 2
    milieu = base + (cap[1] + cap[3]) / 2
    x = W / 2 - larg / 2
    for mot, xm in ((mots[0], x), (mots[1], x + chasse(mots[0]) + 2 * gap)):
        for c in mot:
            d.text((xm, base), c, font=f, fill=couleur, anchor="ls")
            xm += d.textlength(c, font=f) + esp
    px = x + chasse(mots[0]) + gap
    d.ellipse((px - 2, milieu - 2, px + 2, milieu + 2), fill=couleur)
    for a, b in ((x - 12 - 32, x - 12), (x + larg + 12, x + larg + 12 + 32)):
        d.rectangle((a, milieu - 1, b, milieu + 1), fill=couleur)


def story():
    fond = redresser(Image.open(RACINE / "photos" / "allee-portail.png").convert("RGB")).convert("RGBA")

    texte = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(texte)
    f = police("CormorantGaramond-Italic[wght].ttf", 72, 500)
    for i, ligne in enumerate(PHRASE):
        d.text((W / 2, 260 + i * 86), ligne, font=f, fill=BLANC, anchor="mt")
    im = Image.alpha_composite(fond, ombre_douce(texte, force=0.8))

    dalles = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(dalles)
    nom_sur_dalle(d, DALLE_NOM)
    lieu_sur_dalle(d, DALLE_LIEU, ENCRE)
    return Image.alpha_composite(im, dalles).convert("RGB")


if __name__ == "__main__":
    story().save(RACINE / "stories" / "allee-phrase.jpg", quality=92)
