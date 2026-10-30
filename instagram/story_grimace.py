"""Story d'Aïko qui tire la langue derrière le cheval en bois.

Même style que les stories « Merci » : fond sable, photo en arche, la phrase
en Cormorant, la signature dessous.

    python3 instagram/story_grimace.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

from signature import ENCRE, POLICES, SABLE, TERRA, signature

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
PHOTO_L = 820  # largeur de l'arche
PHRASES = {
    "immobile": ("Moi aussi je peux rester immobile.", "Regardez."),
    "sans-texte": None,
}


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def arche(im):
    """Coupe le haut de l'image en demi-cercle."""
    w, h = im.size
    masque = Image.new("L", (w * 4, h * 4), 0)
    d = ImageDraw.Draw(masque)
    d.ellipse((0, 0, w * 4, w * 4), fill=255)
    d.rectangle((0, w * 2, w * 4, h * 4), fill=255)
    im = im.convert("RGBA")
    im.putalpha(masque.resize((w, h), Image.LANCZOS))
    return im


def story(lignes):
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "aiko-grimace.png")).convert("RGB")
    photo = arche(src.resize((PHOTO_L, round(src.height * PHOTO_L / src.width)), Image.LANCZOS))
    sig = signature(ENCRE, TERRA)
    sig = sig.resize((470, round(sig.height * 470 / sig.width)), Image.LANCZOS)

    # On empile phrase, photo, signature, puis on centre le tout dans la zone
    # libre de la story (entre la barre de progression et la barre de réponse).
    im = Image.new("RGBA", (W, H), SABLE)
    d = ImageDraw.Draw(im)
    blocs, y = [], 0
    if lignes:
        polices = (police("CormorantGaramond[wght].ttf", 60, 400),
                   police("CormorantGaramond-Italic[wght].ttf", 60, 400))
        for texte, f in zip(lignes, polices):
            blocs.append(("texte", texte, f, y))
            y += 76
        y += 40
    blocs.append(("photo", photo, None, y))
    y += photo.height + 46
    blocs.append(("photo", sig, None, y))
    y += sig.height
    haut = (250 + 1700) / 2 - y / 2
    for genre, contenu, f, yb in blocs:
        if genre == "texte":
            d.text((W / 2, haut + yb), contenu, font=f, fill=ENCRE, anchor="mt")
        else:
            im.paste(contenu, ((W - contenu.width) // 2, round(haut + yb)), contenu)
    return im.convert("RGB")


if __name__ == "__main__":
    out = RACINE / "stories"
    for nom, lignes in PHRASES.items():
        story(lignes).save(out / f"grimace-{nom}.jpg", quality=92)
