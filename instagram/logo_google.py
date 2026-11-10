"""Logos carrés pour la fiche Google (Google Business Profile).

Google demande un logo carré (720 × 720 conseillé, PNG ou JPG) et l'affiche en
petit, parfois rogné en cercle : on garde tout le contenu au centre.

    python3 instagram/logo_google.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

from signature import BLANC, ENCRE, POLICES, SABLE, TERRA

RACINE = Path(__file__).resolve().parent
SORTIE = RACINE / "logo-google"
C = 1080  # exporté en 1080 : Google le réduit sans perte


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def ligne_lieu(d, cx, y, couleur, taille=34, esp=9, gap=24, trait=60, ecart=22, ep=2.5):
    """« —— DOMAINE • LA SOUKRA —— », haut des capitales en y."""
    f = police("Jost[wght].ttf", taille, 500)
    mots = ("DOMAINE", "LA SOUKRA")

    def chasse(m):
        return sum(d.textlength(c, font=f) for c in m) + esp * (len(m) - 1)

    larg = chasse(mots[0]) + 2 * gap + chasse(mots[1])
    cap = f.getbbox("D", anchor="lt")
    milieu = y + (cap[1] + cap[3]) / 2
    x = cx - larg / 2
    for mot, xm in ((mots[0], x), (mots[1], x + chasse(mots[0]) + 2 * gap)):
        for c in mot:
            d.text((xm, y), c, font=f, fill=couleur, anchor="lt")
            xm += d.textlength(c, font=f) + esp
    px = x + chasse(mots[0]) + gap
    d.ellipse((px - 4, milieu - 4, px + 4, milieu + 4), fill=couleur)
    for a, b in ((x - ecart - trait, x - ecart), (x + larg + ecart, x + larg + ecart + trait)):
        d.rectangle((a, milieu - ep / 2, b, milieu + ep / 2), fill=couleur)


def recentrer(im, fond):
    """Recentre verticalement le bloc sur son encre réelle."""
    boite = Image.new("RGB", im.size, fond)
    from PIL import ImageChops
    x0, y0, x1, y1 = ImageChops.difference(im, boite).getbbox()
    bloc = im.crop((0, y0, C, y1))
    neuf = Image.new("RGB", im.size, fond)
    neuf.paste(bloc, (0, (C - bloc.height) // 2))
    return neuf


def nom(fond, encre, filet):
    """Le nom sur deux lignes, puis la ligne du lieu."""
    im = Image.new("RGB", (C, C), fond)
    d = ImageDraw.Draw(im)
    f = police("CormorantGaramond[wght].ttf", 190, 400)
    d.text((C / 2, 300), "Daughter", font=f, fill=encre, anchor="ms")
    d.text((C / 2, 500), "of Gaïa", font=f, fill=encre, anchor="ms")
    ligne_lieu(d, C / 2, 590, filet)
    return recentrer(im, fond)


def monogramme(fond, encre):
    """Le « G » seul, comme la photo de profil Instagram : lisible en tout petit."""
    im = Image.new("RGB", (C, C), fond)
    ImageDraw.Draw(im).text((C / 2, C / 2), "G", font=police("CormorantGaramond[wght].ttf", 640, 300),
                            fill=encre, anchor="mm")
    return im


def icones_du_site():
    """Favicon et icônes du site, pour que Google affiche le logo à côté du
    lien daughterofgaia.com. Le « G » crème sur terracotta, comme la fiche
    Google ; un peu plus gras, pour rester lisible en 16 px."""
    public = RACINE.parent / "daughter-of-gaia" / "public"
    im = Image.new("RGB", (C, C), TERRA)
    ImageDraw.Draw(im).text((C / 2, C / 2), "G", font=police("CormorantGaramond[wght].ttf", 700, 500),
                            fill=BLANC, anchor="mm")
    # Google veut un favicon carré, en multiple de 48 px.
    im.save(public / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    for fichier, t in (("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)):
        im.resize((t, t), Image.LANCZOS).save(public / fichier, optimize=True)
    # Le logo complet, référencé dans les données structurées de la page.
    nom(TERRA, BLANC, BLANC).resize((512, 512), Image.LANCZOS).save(public / "logo.png", optimize=True)


if __name__ == "__main__":
    icones_du_site()
    SORTIE.mkdir(exist_ok=True)
    versions = {
        "1-nom-sable": nom(SABLE, ENCRE, TERRA),
        "2-nom-terracotta": nom(TERRA, BLANC, BLANC),
        "3-nom-nuit": nom("#1A130C", SABLE, TERRA),
        "4-monogramme-sable": monogramme(SABLE, ENCRE),
    }
    for n, im in versions.items():
        im.save(SORTIE / f"{n}.png", optimize=True)
    # Planche d'aperçu, chaque logo vu en carré et rogné en cercle.
    p = 300
    planche = Image.new("RGB", (len(versions) * (p + 30) + 30, 2 * p + 90), "white")
    for i, im in enumerate(versions.values()):
        petit = im.resize((p, p), Image.LANCZOS)
        x = 30 + i * (p + 30)
        planche.paste(petit, (x, 30))
        masque = Image.new("L", (p, p), 0)
        ImageDraw.Draw(masque).ellipse((0, 0, p, p), fill=255)
        planche.paste(petit, (x, p + 60), masque)
    planche.save(SORTIE / "apercu.jpg", quality=90)
