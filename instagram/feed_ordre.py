"""Maquette de l'ordre proposé pour le fil (cases en 3:4, comme le profil).

    python3 instagram/feed_ordre.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

CAPTURE = Path("/root/.claude/uploads/d41b07ab-1b43-599c-b938-a68ca148d6b2/9f263d79-image.png")
CW, CH, GAP = 360, 480, 4


def case_fichier(chemin):
    im = en_srgb(Image.open(RACINE / chemin))
    w, h = im.size
    if h / w > 1.5:  # Reel 9:16 : la grille en montre le centre 3:4
        im = im.crop((0, round(h * 240 / 1920), w, round(h * 1680 / 1920)))
    return ImageOps.fit(im, (CW, CH), Image.LANCZOS)


def case_capture():
    """Pour la photo que je n'ai pas : sa partie visible sur la capture du
    profil (entre la barre d'état et le compteur de vues), posée sur le mur
    ocre prolongé en aplat au-dessus et en dessous."""
    cap = Image.open(CAPTURE).convert("RGB")
    f = cap.width / 921
    vis = cap.crop((round(617 * f) + 4, round(112 * f), round(921 * f), round(303 * f)))
    w, hv = vis.size
    h = round(w * CH / CW)
    mur_haut = ImageStat.Stat(vis.crop((0, 0, 30, 40))).mean
    mur_bas = ImageStat.Stat(vis.crop((0, hv - 25, w, hv))).mean
    toile = Image.new("RGB", (w, h))
    dt = ImageDraw.Draw(toile)
    y = round(h * 0.26)
    dt.rectangle((0, 0, w, y + hv // 2), fill=tuple(int(v) for v in mur_haut))
    dt.rectangle((0, y + hv // 2, w, h), fill=tuple(int(v) for v in mur_bas))
    # Raccord en fondu de 24 px entre l'aplat et la photo, en haut et en bas.
    masque = Image.new("L", (w, hv), 255)
    dm = ImageDraw.Draw(masque)
    for k in range(24):
        dm.line((0, k, w, k), fill=int(255 * k / 24))
        dm.line((0, hv - 1 - k, w, hv - 1 - k), fill=int(255 * k / 24))
    toile.paste(vis, (0, y), masque)
    return toile.resize((CW, CH), Image.LANCZOS)


ORDRE = [
    case_fichier("fin-video/couverture-reel.jpg"),
    case_fichier("a-publier/feu-cheval-pie.jpg"),
    case_fichier("posts/09-terrasse-vasque.jpg"),
    case_fichier("posts/07-domaine.jpg"),
    case_fichier("posts/10-trois-chevaux.jpg"),
    case_fichier("posts/11-cheval-noir-blanc.jpg"),
    case_fichier("posts/05-chevaux-pie-broutent.jpg"),
    case_fichier("posts/06-refuge.jpg"),
    case_fichier("posts/03-fenetre-chevaux-statuettes.jpg"),
    case_fichier("posts/04-chevaux-fenetre.jpg"),
    case_fichier("posts/08-ecuries.jpg"),
    case_fichier("posts/01-citation.jpg"),
    case_capture(),
    case_fichier("posts/02-cheval-bar.jpg"),
    None,
]

im = Image.new("RGB", (3 * CW + 2 * GAP, 5 * CH + 4 * GAP), "white")
d = ImageDraw.Draw(im)
for i, c in enumerate(ORDRE):
    x, y = (i % 3) * (CW + GAP), (i // 3) * (CH + GAP)
    if c is None:
        d.rectangle((x, y, x + CW, y + CH), fill=BLANC)
        for k in range(x + 20, x + CW - 20, 16):
            d.line((k, y + 20, k + 8, y + 20), fill=FILET, width=2)
            d.line((k, y + CH - 20, k + 8, y + CH - 20), fill=FILET, width=2)
        for k in range(y + 20, y + CH - 20, 16):
            d.line((x + 20, k, x + 20, k + 8), fill=FILET, width=2)
            d.line((x + CW - 20, k, x + CW - 20, k + 8), fill=FILET, width=2)
        centre(d, y + CH / 2 - 30, "Ta prochaine", italique(40, 300), ENCRE, 2 * x + CW)
        centre(d, y + CH / 2 + 15, "publication", italique(40, 300), ENCRE, 2 * x + CW)
    else:
        im.paste(c, (x, y))
sauver(im, RACINE / "compte-perso" / "ordre-propose.jpg")
print("ok")
