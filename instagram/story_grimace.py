"""Story d'Aïko qui tire la langue derrière le cheval en bois.

Photo plein écran. La phrase en haut, sur la crinière, au-dessus des yeux ;
la signature en petit en bas au centre, comme sur les photos du fil.

    python3 instagram/story_grimace.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

from signature import BLANC, POLICES, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
# Cadrage un peu à gauche du centre : la queue du cheval en bois reste entière.
CADRAGE = (0.37, 0.5)
PHRASES = {
    "clown": "Le clown du domaine",
    "sans-texte": None,
}


def calque(phrase):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if phrase:
        f = ImageFont.truetype(str(POLICES / "CormorantGaramond-Italic[wght].ttf"), 92)
        f.set_variation_by_axes([500])
        ImageDraw.Draw(im).text((W / 2, 235), phrase, font=f, fill=BLANC, anchor="mt")
    sig = signature(BLANC, BLANC, g_nom=450, g_lieu=500)
    sig = sig.resize((440, round(sig.height * 440 / sig.width)), Image.LANCZOS)
    im.paste(sig, ((W - sig.width) // 2, 1650), sig)
    return ombre_douce(im)


if __name__ == "__main__":
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "aiko-grimace.png")).convert("RGB")
    fond = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=CADRAGE).convert("RGBA")
    for nom, phrase in PHRASES.items():
        im = Image.alpha_composite(fond, calque(phrase)).convert("RGB")
        im.save(RACINE / "stories" / f"grimace-{nom}.jpg", quality=92)
