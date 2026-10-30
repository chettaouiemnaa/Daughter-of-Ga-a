"""Story qui annonce le post de la fenêtre sans le montrer.

La photo du post, floutée comme derrière une vitre dépolie : on devine le mur
ocre et la fenêtre, pas ce qu'il y a derrière. Le post partagé se cache sous
cette image (voir TEXTES-STORIES.md), et un toucher l'ouvre.

    python3 instagram/story_teaser_fenetre.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from signature import BLANC, ENCRE, POLICES, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def story():
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "fenetre-mur-ocre.png")).convert("RGB")
    fond = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.5, 0.55))
    fond = fond.filter(ImageFilter.GaussianBlur(28)).convert("RGBA")
    voile = Image.new("RGBA", (W, H), ENCRE)
    voile.putalpha(60)
    fond = Image.alpha_composite(fond, voile)

    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    titre = police("CormorantGaramond[wght].ttf", 96, 400)
    ital = police("CormorantGaramond-Italic[wght].ttf", 96, 400)
    d.text((W / 2, 700), "Jetez un œil", font=titre, fill=BLANC, anchor="mt")
    d.text((W / 2, 812), "par la fenêtre…", font=ital, fill=BLANC, anchor="mt")

    # « NOUVEAU POST » en petites capitales espacées, puis l'invitation.
    caps, esp = police("Jost[wght].ttf", 30, 500), 9
    texte = "NOUVEAU POST"
    larg = sum(d.textlength(c, font=caps) for c in texte) + esp * (len(texte) - 1)
    x = W / 2 - larg / 2
    for c in texte:
        d.text((x, 1000), c, font=caps, fill=BLANC, anchor="lt")
        x += d.textlength(c, font=caps) + esp
    d.text((W / 2, 1062), "Touchez pour découvrir", font=police("CormorantGaramond-Italic[wght].ttf", 58, 400),
           fill=BLANC, anchor="mt")

    sig = signature(BLANC, BLANC, g_nom=450, g_lieu=500)
    sig = sig.resize((440, round(sig.height * 440 / sig.width)), Image.LANCZOS)
    im.paste(sig, ((W - sig.width) // 2, 1620), sig)
    return Image.alpha_composite(fond, ombre_douce(im, force=0.45)).convert("RGB")


if __name__ == "__main__":
    story().save(RACINE / "stories" / "teaser-fenetre.jpg", quality=92)
