"""La signature Daughter of Gaïa en PNG transparent, à poser dans CapCut.

Même dessin que sur les posts et les stories : le logo en Cormorant Garamond
léger, puis « —— DOMAINE • LA SOUKRA —— » en Jost, le point et les traits
à mi-hauteur des capitales.

    python3 instagram/signature.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parent
POLICES = RACINE / "polices"
SORTIE = RACINE / "signature"

SABLE, BLANC, ENCRE, TERRA = "#EDE4D3", "#F6F1E7", "#2B2118", "#B5654A"
LOGO = "Daughter of Gaïa"
LARGEUR_LOGO = 1400  # en px : assez grand pour rester net une fois réduit
MARGE = 40


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def signature(c_nom, c_lieu, avec_lieu=True):
    mesure = ImageDraw.Draw(Image.new("L", (1, 1)))
    taille = round(100 * LARGEUR_LOGO / mesure.textlength(LOGO, font=police("CormorantGaramond[wght].ttf", 100, 300)))
    f_nom = police("CormorantGaramond[wght].ttf", taille, 300)
    # Mêmes rapports que la ligne des stories (logo ≈ 5,3 × le corps du lieu).
    k = LARGEUR_LOGO / 160
    f_lieu = police("Jost[wght].ttf", round(5.2 * k), 400)
    esp, gap, trait, ecart, ep = 1.6 * k, 5.5 * k, 17 * k, 6 * k, max(2, 0.45 * k)

    W, H = LARGEUR_LOGO + 1200, taille * 3
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((W / 2, taille * 0.4), LOGO, font=f_nom, fill=c_nom, anchor="mt")

    if avec_lieu:
        bas_nom = im.getbbox()[3]
        y = bas_nom + 0.30 * taille
        mots = ("DOMAINE", "LA SOUKRA")

        def chasse(m):
            return sum(d.textlength(c, font=f_lieu) for c in m) + esp * (len(m) - 1)

        larg = chasse(mots[0]) + 2 * gap + chasse(mots[1])
        haut = f_lieu.getbbox("D", anchor="lt")
        milieu = y + (haut[1] + haut[3]) / 2
        x = W / 2 - larg / 2
        for mot, xm in ((mots[0], x), (mots[1], x + chasse(mots[0]) + 2 * gap)):
            for c in mot:
                d.text((xm, y), c, font=f_lieu, fill=c_lieu, anchor="lt")
                xm += d.textlength(c, font=f_lieu) + esp
        r = max(3, f_lieu.size / 9)
        px = x + chasse(mots[0]) + gap
        d.ellipse((px - r, milieu - r, px + r, milieu + r), fill=c_lieu)
        for x0, x1 in ((x - ecart - trait, x - ecart), (x + larg + ecart, x + larg + ecart + trait)):
            d.rectangle((x0, milieu - ep / 2, x1, milieu + ep / 2), fill=c_lieu)

    # Recadre au plus près de l'encre, avec une marge égale tout autour.
    x0, y0, x1, y1 = im.getbbox()
    return im.crop((x0 - MARGE, y0 - MARGE, x1 + MARGE, y1 + MARGE))


def apercu(fichiers):
    """Planche de contrôle : chaque version sur un fond où elle se lit."""
    fonds = {"blanc": "#5A4A3A", "sable": "#3A2E24", "encre": SABLE, "encre-terracotta": SABLE}
    ims = [(n, Image.open(SORTIE / f"{n}.png")) for n in fichiers]
    w = max(i.width for _, i in ims) + 160
    planche = Image.new("RGB", (w, sum(i.height + 120 for _, i in ims)), "white")
    y = 0
    for n, i in ims:
        bande = Image.new("RGB", (w, i.height + 120), fonds[n.replace("-seul", "")])
        bande.paste(i, ((w - i.width) // 2, 60), i)
        planche.paste(bande, (0, y))
        y += bande.height
    planche.thumbnail((1400, 4000))
    planche.save(SORTIE / "apercu.jpg", quality=90)


if __name__ == "__main__":
    SORTIE.mkdir(exist_ok=True)
    versions = {
        "blanc": (BLANC, BLANC, True),
        "sable": (SABLE, SABLE, True),
        "encre": (ENCRE, ENCRE, True),
        "encre-terracotta": (ENCRE, TERRA, True),
        "blanc-seul": (BLANC, BLANC, False),
    }
    for nom, (c_nom, c_lieu, lieu) in versions.items():
        signature(c_nom, c_lieu, lieu).save(SORTIE / f"{nom}.png", optimize=True)
    apercu(list(versions))
