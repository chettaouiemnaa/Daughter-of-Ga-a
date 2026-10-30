"""Stories Halloween : la fenêtre aux bougies et aux chevaux de bois, la nuit,
vue de l'intérieur puis du dehors (avec l'ombre d'un cheval sur le mur).

Toute la photo est gardée (la fenêtre est trop large pour un recadrage 9:16) ;
le haut et le bas de la story prolongent le plafond et le mur sombre.
« Happy Halloween » et la signature sont posés sur le mur, sous la fenêtre,
dans la couleur chaude des bougies.

    python3 instagram/story_halloween.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from signature import POLICES, signature

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
# Pour chaque photo : où la poser, et où écrire (haut du texte, haut de la signature).
PHOTOS = {
# rogne_haut : bande retirée en haut de la photo (le ciel du dehors).
    "halloween": ("fenetre-bougies.jpg", 0, 150, 1290, 1500),
    "halloween-dehors": ("fenetre-bougies-dehors.png", 45, 200, 1250, 1450),
}
BOUGIE = "#F4DDB0"  # le blanc chaud de la flamme


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def halo(calque, couleur="#E9A94F", force=0.55, flou=30):
    """Lueur chaude autour du texte, comme éclairé par les bougies."""
    lueur = calque.getchannel("A").filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(flou))
    fond = Image.new("RGBA", calque.size, couleur)
    fond.putalpha(lueur.point(lambda v: int(v * force)))
    return Image.alpha_composite(fond, calque)


def teinte(im, boite):
    return im.crop(boite).resize((1, 1), Image.BOX).getpixel((0, 0))


def story(fichier, rogne_haut, HAUT_PHOTO, y_texte, y_sig):
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / fichier)).convert("RGB")
    src = src.crop((0, rogne_haut, src.width, src.height))
    photo = src.resize((W, round(src.height * W / src.width)), Image.LANCZOS)
    bas = HAUT_PHOTO + photo.height
    # Au-dessus et au-dessous, la teinte moyenne du bord de la photo, unie ;
    # la photo s'y fond sur une bande dégradée, sans raccord visible.
    im = Image.new("RGB", (W, H), teinte(photo, (0, photo.height - 40, W, photo.height)))
    im.paste(teinte(photo, (0, 0, W, 40)), (0, 0, W, HAUT_PHOTO + 90))
    masque = Image.new("L", (1, photo.height), 255)
    for fondu, en_haut in ((90, True), (260, False)):
        if en_haut and not HAUT_PHOTO:
            continue
        for y in range(fondu):
            masque.putpixel((0, y if en_haut else photo.height - 1 - y), int(255 * (y / fondu) ** 1.5))
    im.paste(photo, (0, HAUT_PHOTO), masque.resize(photo.size))
    im = im.convert("RGBA")
    ombre = Image.new("L", (1, H))
    for y in range(H):
        t = max(0.0, (HAUT_PHOTO - y) / HAUT_PHOTO, (y - bas) / (H - bas))
        ombre.putpixel((0, y), int(150 * t))
    noir = Image.new("RGBA", (W, H), "#120A03")
    noir.putalpha(ombre.resize((W, H)))
    im = Image.alpha_composite(im, noir)

    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    d.text((W / 2, y_texte), "Happy Halloween", font=police("CormorantGaramond-Italic[wght].ttf", 128, 400),
           fill=BOUGIE, anchor="mt")
    sig = signature(BOUGIE, BOUGIE)
    sig = sig.resize((460, round(sig.height * 460 / sig.width)), Image.LANCZOS)
    calque.paste(sig, ((W - sig.width) // 2, y_sig), sig)
    return Image.alpha_composite(im, halo(calque)).convert("RGB")


if __name__ == "__main__":
    for nom, reglages in PHOTOS.items():
        story(*reglages).save(RACINE / "stories" / f"{nom}.jpg", quality=92)
