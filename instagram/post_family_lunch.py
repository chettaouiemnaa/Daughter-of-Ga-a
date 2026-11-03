"""Post et story : Iris, Stella et Ponette qui broutent entre deux troncs.

« Family lunch » en haut, dans le feuillage ; la signature en bas, sur la
terre. Les deux sont centrés entre les deux grands troncs (sans compter le
fin tronc du milieu).

    python3 instagram/post_family_lunch.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

from signature import BLANC, POLICES, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
# Repères mesurés sur la photo d'origine (1086 × 1448) : le milieu de l'espace
# entre les deux grands troncs, au niveau du titre (de 216 à 784) et au niveau
# de la signature (de 280 à 734), et la hauteur de ces deux lignes.
CENTRE_HAUT, CENTRE_BAS = 501, 507
Y_TITRE, Y_SIGNATURE = 196, 1232


def composer(taille, gauche, haut, echelle, corps, largeur_sig):
    """Recadre la photo (coin gauche/haut et échelle donnés) et pose le titre
    et la signature aux repères, convertis dans le cadre."""
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "trio-arbres.png")).convert("RGB")
    W, H = taille
    cadre = src.crop((gauche, haut, gauche + W / echelle, haut + H / echelle)).resize(taille, Image.LANCZOS)

    def x(v):
        return (v - gauche) * echelle

    def y(v):
        return (v - haut) * echelle

    calque = Image.new("RGBA", taille, (0, 0, 0, 0))
    f = ImageFont.truetype(str(POLICES / "CormorantGaramond-Italic[wght].ttf"), corps)
    f.set_variation_by_axes([500])
    # Centré sur l'encre réelle des lettres (l'italique décale la chasse).
    x0, _, x1, _ = f.getbbox("Family lunch", anchor="lt")
    ImageDraw.Draw(calque).text((x(CENTRE_HAUT) - (x0 + x1) / 2, y(Y_TITRE)), "Family lunch",
                                font=f, fill=BLANC, anchor="lt")
    sig = signature(BLANC, BLANC, g_nom=450, g_lieu=500)
    sig = sig.resize((largeur_sig, round(sig.height * largeur_sig / sig.width)), Image.LANCZOS)
    calque.paste(sig, (round(x(CENTRE_BAS) - sig.width / 2), round(y(Y_SIGNATURE))), sig)
    return Image.alpha_composite(cadre.convert("RGBA"), ombre_douce(calque, force=0.75)).convert("RGB")


if __name__ == "__main__":
    # Post 4:5 : toute la largeur, un peu rogné en haut et en bas.
    e = 1080 / 1086
    composer((1080, 1350), 0, (1448 - 1350 / e) / 2, e, 82, 340).save(
        RACINE / "posts" / "family-lunch.jpg", quality=97, subsampling=0)
    # Story 9:16 : toute la hauteur, recadrée pour que l'espace entre les
    # troncs tombe au milieu de l'écran.
    e = 1920 / 1448
    composer((1080, 1920), CENTRE_BAS - 540 / e, 0, e, 108, 450).save(
        RACINE / "stories" / "family-lunch.jpg", quality=97, subsampling=0)
