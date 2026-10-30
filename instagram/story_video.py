"""Pose la signature, en grand et bien lisible, sur une vidéo de story.

    python3 instagram/story_video.py VIDEO.mov SORTIE.mp4 ["Une phrase."]

Le nom est en blanc cassé, détaché du fond par une ombre douce, dans le haut
de l'image : sous la barre de progression d'Instagram, loin de la barre de
réponse en bas.
"""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from signature import BLANC, ENCRE, POLICES, signature

W, H = 1080, 1920
LARGEUR = 900   # largeur de la signature sur la story
HAUT = 330      # haut du bloc : sous la barre de progression et le nom du compte


def ombre_douce(im, force=0.7, flou=22, garder_texte=True):
    """Ombre douce sous l'encre : lisible sur le feuillage comme sur le ciel."""
    ombre = im.getchannel("A").filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(flou))
    fond = Image.new("RGBA", im.size, ENCRE)
    fond.putalpha(ombre.point(lambda v: int(v * force)))
    return Image.alpha_composite(fond, im) if garder_texte else fond


def calque(phrase=None):
    # Un peu plus gras que sur les posts : la vidéo bouge et le fond est chargé.
    sig = signature(BLANC, BLANC, g_nom=450, g_lieu=500)
    sig = sig.resize((LARGEUR, round(sig.height * LARGEUR / sig.width)), Image.LANCZOS)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = HAUT
    if phrase:
        f = ImageFont.truetype(str(POLICES / "CormorantGaramond-Italic[wght].ttf"), 72)
        f.set_variation_by_axes([500])
        d = ImageDraw.Draw(im)
        d.text((W / 2, y), phrase, font=f, fill=BLANC, anchor="mt")
        y = im.getbbox()[3] + 34
    im.paste(sig, ((W - sig.width) // 2, y), sig)

    fond = ombre_douce(im, garder_texte=False)
    # Et un voile sombre qui descend du haut, pour calmer le feuillage.
    voile = Image.new("L", (1, H))
    bas = im.getbbox()[3] + 260
    for y in range(H):
        voile.putpixel((0, y), int(115 * max(0.0, 1 - y / bas) ** 1.4))
    fond = Image.alpha_composite(Image.merge("RGBA", (*Image.new("RGB", (W, H), ENCRE).split(), voile.resize((W, H)))), fond)
    return Image.alpha_composite(fond, im)


if __name__ == "__main__":
    video, sortie = Path(sys.argv[1]), Path(sys.argv[2])
    phrase = sys.argv[3] if len(sys.argv) > 3 else None
    png = sortie.with_suffix(".png")
    calque(phrase).save(png)
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(png),
        "-filter_complex", f"[0:v]scale={W}:{H},setsar=1[v];[v][1:v]overlay=0:0,format=yuv420p",
        "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-r", "30",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(sortie),
    ], check=True)
