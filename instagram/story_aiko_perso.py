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


def safe_place():
    """Sa deuxième mise en page, avec « My safe place » en petit sous la photo
    en couleur : en capitales espacées, ou en minuscules, en Jost léger."""
    src = Image.open(RACINE / "photos" / "aiko-perso-nb-2.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    y = 1600  # sous la photo en couleur, dont le bas tombe vers y = 1531
    voile = Image.new("L", (1, H), 0)
    for v in range(y - 80, y + 80):
        voile.putpixel((0, v), int(120 * min(1.0, (v - y + 80) / 50, (y + 80 - v) / 50)))
    fond = Image.new("RGBA", (W, H), "#0E0E0E")
    fond.putalpha(voile.resize((W, H)))

    def jost(taille, graisse):
        f = ImageFont.truetype(str(POLICES / "Jost[wght].ttf"), taille)
        f.set_variation_by_axes([graisse])
        return f

    for nom, texte, f, esp in (("capitales", "MY SAFE PLACE", jost(34, 400), 12),
                               ("minuscules", "my safe place", jost(44, 300), 3)):
        calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(calque)
        larg = sum(d.textlength(c, font=f) for c in texte) + esp * (len(texte) - 1)
        x = W / 2 - larg / 2
        for c in texte:
            d.text((x, y), c, font=f, fill=BLANC, anchor="lm")
            x += d.textlength(c, font=f) + esp
        im = Image.alpha_composite(src.convert("RGBA"), Image.alpha_composite(fond, ombre_douce(calque, force=0.5, flou=12)))
        im.convert("RGB").save(RACINE / "stories" / f"aiko-my-safe-place-{nom}.jpg", quality=92)


if __name__ == "__main__":
    if sys.argv[1:] == ["photo"]:
        version_photo()
        safe_place()
        sys.exit()
    video = Path(sys.argv[1])
    out = RACINE / "stories" / "video"
    rendre(video, out / "aiko-perso.mp4")
    png = out / "aiko-perso-phrase.png"
    calque().save(png)
    rendre(video, out / "aiko-perso-phrase.mp4", png)
