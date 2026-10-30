"""Story Halloween : la fenêtre aux bougies et aux chevaux de bois, la nuit.

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
HAUT_PHOTO = 150
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


def story():
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "fenetre-bougies.jpg")).convert("RGB")
    photo = src.resize((W, round(src.height * W / src.width)), Image.LANCZOS)
    im = Image.new("RGB", (W, H))
    # Prolonge le plafond vers le haut et le mur vers le bas, en étirant la
    # première et la dernière ligne, assombries en s'éloignant de la photo.
    im.paste(photo.crop((0, 0, W, 1)).resize((W, HAUT_PHOTO)), (0, 0))
    bas = HAUT_PHOTO + photo.height
    im.paste(photo.crop((0, photo.height - 1, W, photo.height)).resize((W, H - bas)), (0, bas))
    im.paste(photo, (0, HAUT_PHOTO))
    im = im.filter(ImageFilter.GaussianBlur(0)).convert("RGBA")
    ombre = Image.new("L", (1, H))
    for y in range(H):
        t = max(0.0, (HAUT_PHOTO - y) / HAUT_PHOTO, (y - bas) / (H - bas))
        ombre.putpixel((0, y), int(150 * t))
    noir = Image.new("RGBA", (W, H), "#120A03")
    noir.putalpha(ombre.resize((W, H)))
    im = Image.alpha_composite(im, noir)

    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    d.text((W / 2, 1290), "Happy Halloween", font=police("CormorantGaramond-Italic[wght].ttf", 128, 400),
           fill=BOUGIE, anchor="mt")
    sig = signature(BOUGIE, BOUGIE)
    sig = sig.resize((460, round(sig.height * 460 / sig.width)), Image.LANCZOS)
    calque.paste(sig, ((W - sig.width) // 2, 1500), sig)
    return Image.alpha_composite(im, halo(calque)).convert("RGB")


if __name__ == "__main__":
    story().save(RACINE / "stories" / "halloween.jpg", quality=92)
