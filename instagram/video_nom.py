"""Vidéo de 6 s (9:16) : la photo des trois chevaux reste fixe, le logo
prend vie sur le mur ocre, comme à l'ouverture du site. Les lettres se
resserrent en apparaissant, puis les traits se déploient et « DOMAINE ·
LA SOUKRA » arrive en fondu.

    python3 instagram/video_nom.py
"""
import subprocess
import sys
import tempfile
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "fin-video"
W, H = STORY
FPS, DUREE = 30, 6
fond = photo("trois-chevaux-envoyee.jpg", STORY, (0.42, 0.5)).convert("RGBA")
t = taille_logo(820)
f_nom = serif(t, 300)
f_lieu = sans(30, 400)
Y_NOM = 330
CREME = (246, 241, 231)


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 4


def teinte(couleur, alpha):
    """Couleur d'encre : un entier pour un masque « L », RVBA sinon."""
    return alpha if couleur is None else couleur + (alpha,)


def ligne(d, y, couleur, p_traits, p_texte):
    """« —— DOMAINE • LA SOUKRA —— » : traits déployés depuis le texte."""
    mots, esp, gap = ("DOMAINE", "LA SOUKRA"), 7, 24

    def chasse(m):
        return sum(d.textlength(c, font=f_lieu) for c in m) + esp * (len(m) - 1)

    larg = chasse(mots[0]) + 2 * gap + chasse(mots[1])
    haut = f_lieu.getbbox("D", anchor="lt")
    milieu = y + (haut[1] + haut[3]) / 2
    x = W / 2 - larg / 2
    if p_texte > 0:
        c = teinte(couleur, int(255 * p_texte))
        for mot, xm in ((mots[0], x), (mots[1], x + chasse(mots[0]) + 2 * gap)):
            for ch in mot:
                d.text((xm, y), ch, font=f_lieu, fill=c, anchor="lt")
                xm += d.textlength(ch, font=f_lieu) + esp
        px = x + chasse(mots[0]) + gap
        d.ellipse((px - 3.5, milieu - 3.5, px + 3.5, milieu + 3.5), fill=c)
    if p_traits > 0:
        l = 80 * p_traits
        for x0, x1 in ((x - 26 - l, x - 26), (x + larg + 26, x + larg + 26 + l)):
            d.rectangle((x0, milieu - 1, x1, milieu + 1), fill=teinte(couleur, 255))


def image(s):
    p_nom = ease((s - 0.4) / 1.8)
    p_traits = ease((s - 1.9) / 1.2)
    p_texte = ease((s - 2.3) / 1.0)
    y_lieu = Y_NOM + f_nom.getmetrics()[0] + 70
    # Ombre douce, à la mesure de ce qui est visible, pour détacher le texte du mur.
    masque = Image.new("L", STORY, 0)
    dm = ImageDraw.Draw(masque)
    centre(dm, Y_NOM, LOGO, f_nom, int(255 * p_nom), W, t * 0.5 * (1 - p_nom))
    ligne(dm, y_lieu, None, p_traits, p_texte)
    # Le flou ne porte que sur la bande du texte : bien plus rapide.
    bande = (0, 150, W, 800)
    ombre = Image.new("L", STORY, 0)
    ombre.paste(masque.crop(bande).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(24))
                .point(lambda v: int(v * 0.55)), bande[:2])
    calque = Image.new("RGBA", STORY, (0, 0, 0, 0))
    calque.paste(Image.new("RGBA", STORY, ENCRE), (0, 0), ombre)
    im = Image.alpha_composite(fond, calque)
    texte = Image.new("RGBA", STORY, (0, 0, 0, 0))
    d = ImageDraw.Draw(texte)
    centre(d, Y_NOM, LOGO, f_nom, CREME + (int(255 * p_nom),), W, t * 0.5 * (1 - p_nom))
    ligne(d, y_lieu, CREME, p_traits, p_texte)
    return Image.alpha_composite(im, texte).convert("RGB")


with tempfile.TemporaryDirectory() as tmp:
    for i in range(FPS * DUREE):
        image(i / FPS).save(f"{tmp}/{i:04d}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/%04d.png",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    str(OUT / "nom-sur-photo.mp4")], check=True)
sauver(image(DUREE), OUT / "nom-sur-photo-fin.jpg")
print("ok")
