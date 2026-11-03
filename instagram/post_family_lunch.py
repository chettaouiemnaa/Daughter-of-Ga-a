"""Post : Iris, Stella et Ponette qui broutent entre deux troncs.

« Family lunch » en haut, dans le feuillage entre les deux troncs ; la
signature en bas, sur la terre entre les troncs. Format 4:5 du fil.

    python3 instagram/post_family_lunch.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

from signature import BLANC, POLICES, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1350
# Le milieu de l'espace entre les deux grands troncs (sans compter le fin
# tronc du milieu), mesuré sur l'image 4:5 : en haut de 215 à 780, en bas
# de 278 à 730.
CENTRE_HAUT, CENTRE_BAS = 498, 504


def post():
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "trio-arbres.png")).convert("RGB")
    fond = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.5, 0.5)).convert("RGBA")
    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    f = ImageFont.truetype(str(POLICES / "CormorantGaramond-Italic[wght].ttf"), 82)
    f.set_variation_by_axes([500])
    # Centré sur l'encre réelle des lettres (l'italique décale la chasse).
    x0, _, x1, _ = f.getbbox("Family lunch", anchor="lt")
    ImageDraw.Draw(calque).text((CENTRE_HAUT - (x0 + x1) / 2, 150), "Family lunch", font=f, fill=BLANC, anchor="lt")
    sig = signature(BLANC, BLANC, g_nom=450, g_lieu=500)
    sig = sig.resize((340, round(sig.height * 340 / sig.width)), Image.LANCZOS)
    calque.paste(sig, (round(CENTRE_BAS - sig.width / 2), 1180), sig)
    return Image.alpha_composite(fond, ombre_douce(calque, force=0.75)).convert("RGB")


if __name__ == "__main__":
    post().save(RACINE / "posts" / "family-lunch.jpg", quality=97, subsampling=0)
