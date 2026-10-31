"""Story : l'allée qui mène au portail, et un cheval qui attend derrière.

Plein écran. La phrase en blanc en haut, sur le feuillage sombre ; la
signature en bas, en brun foncé, sur les pierres claires de l'allée.

    python3 instagram/story_allee.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from signature import BLANC, ENCRE, POLICES, SABLE, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
VERSIONS = {
    "allee": None,
    "allee-phrase": ("Quelqu'un vous attend", "au bout du chemin."),
}


def story(phrase):
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "allee-portail.png")).convert("RGB")
    fond = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.5, 0.5)).convert("RGBA")
    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = 260
    if phrase:
        f = ImageFont.truetype(str(POLICES / "CormorantGaramond-Italic[wght].ttf"), 72)
        f.set_variation_by_axes([500])
        d = ImageDraw.Draw(calque)
        for ligne in phrase:
            d.text((W / 2, y), ligne, font=f, fill=BLANC, anchor="mt")
            y += 86
    im = Image.alpha_composite(fond, ombre_douce(calque, force=0.8))
    # Sur le gravier moucheté, l'encre seule se perd : un halo sable, large et
    # doux, la détache du fond.
    sig = signature(ENCRE, ENCRE, g_nom=500, g_lieu=600)
    sig = sig.resize((560, round(sig.height * 560 / sig.width)), Image.LANCZOS)
    pose = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pose.paste(sig, ((W - sig.width) // 2, 1620), sig)
    lueur = pose.getchannel("A").filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(26))
    halo = Image.new("RGBA", (W, H), SABLE)
    halo.putalpha(lueur.point(lambda v: min(255, int(v * 1.1))))
    im = Image.alpha_composite(Image.alpha_composite(im, halo), pose)
    return im.convert("RGB")


if __name__ == "__main__":
    for nom, phrase in VERSIONS.items():
        story(phrase).save(RACINE / "stories" / f"{nom}.jpg", quality=92)
