"""Story perso : Aïko couché dans le sable, la tête contre elle.

La vidéo est un enregistrement d'écran de la Photothèque : on retire
l'en-tête (« Photothèque », la date, « Sélect. ») en zoomant légèrement,
puis on écrit, en option, une phrase sous la photo.

    python3 instagram/story_aiko_perso.py VIDEO.mov
    python3 instagram/story_aiko_perso.py photo     # la version noir et blanc
"""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

from signature import BLANC, ENCRE, POLICES
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
W, H = 1080, 1920
Y0 = 110                      # sous l'en-tête de la Photothèque
CH = H - Y0
CW = round(CH * 9 / 16)
X0 = (W - CW) // 2
LIGNES = (("Il ne se couche que", False), ("lorsqu'il se sent en sécurité.", False),
          ("Ce soir, il s'est couché contre moi.", True))


def police(nom, graisse):
    f = ImageFont.truetype(str(POLICES / nom), 60)
    f.set_variation_by_axes([graisse])
    return f


def calque(haut=1440, teinte=ENCRE):
    # Un voile sombre sous la photo calme la grille, pour que la phrase se lise.
    voile = Image.new("L", (1, H), 0)
    for y in range(haut, haut + 360):
        t = min(1.0, (y - haut) / 90, (haut + 360 - y) / 90)
        voile.putpixel((0, y), int(170 * t))
    fond = Image.new("RGBA", (W, H), teinte)
    fond.putalpha(voile.resize((W, H)))

    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    droite, italique = police("CormorantGaramond[wght].ttf", 450), police("CormorantGaramond-Italic[wght].ttf", 450)
    y = haut + 60
    for ligne, ital in LIGNES:
        if ital:
            y += 24
        d.text((W / 2, y), ligne, font=italique if ital else droite, fill=BLANC, anchor="mt")
        y += 76
    return Image.alpha_composite(fond, ombre_douce(im, force=0.6, flou=16))


def rendre(video, sortie, png=None):
    filtre = f"[0:v]crop={CW}:{CH}:{X0}:{Y0},scale={W}:{H},setsar=1"
    entrees = ["-i", str(video)]
    if png:
        entrees += ["-i", str(png)]
        filtre += "[v];[v][1:v]overlay=0:0"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *entrees, "-filter_complex", filtre + ",format=yuv420p",
                    "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-r", "30",
                    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(sortie)], check=True)


def version_photo():
    """La version qu'elle a préférée : sa photo en couleur sur la grille en noir
    et blanc (une image, faite par elle), avec la même phrase sous la photo."""
    src = Image.open(RACINE / "photos" / "aiko-perso-nb.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    # Voile neutre sur la grille en noir et blanc, et texte remonté au ras de
    # la photo en couleur pour rester au-dessus de la barre de réponse.
    im = Image.alpha_composite(src.convert("RGBA"), calque(haut=1455, teinte="#0E0E0E")).convert("RGB")
    im.save(RACINE / "stories" / "aiko-perso-nb-phrase.jpg", quality=92)


if __name__ == "__main__":
    if sys.argv[1:] == ["photo"]:
        version_photo()
        sys.exit()
    video = Path(sys.argv[1])
    out = RACINE / "stories" / "video"
    rendre(video, out / "aiko-perso.mp4")
    png = out / "aiko-perso-phrase.png"
    calque().save(png)
    rendre(video, out / "aiko-perso-phrase.mp4", png)
