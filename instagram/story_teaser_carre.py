"""Teaser carré du post fenêtre, à poser sur le post partagé en story.

Le post (4:5) dépasse en haut et en bas de ce carré : c'est là qu'on touche
pour l'ouvrir. Seule la vitre est floutée, comme dépolie ; le mur, les
branches et la signature restent nets, au même endroit que sur le post.

    python3 instagram/story_teaser_carre.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

import generer
from post_fenetre import BAS_FENETRE, CEINTURE, CENTRE_FENETRE
from signature import BLANC, ENCRE, POLICES, signature
from story_video import ombre_douce

RACINE = Path(__file__).resolve().parent
C = 1080
HAUT_CARRE = 135                      # le carré pris dans le post 1080 × 1350
VITRE = (156, 388, 936, 975)          # l'intérieur du cadre noir, dans le post
LARGEUR_SIG = 500


def police(nom, taille, graisse):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    f.set_variation_by_axes([graisse])
    return f


def carre():
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "fenetre-mur-ocre.png")).convert("RGB")
    post = ImageOps.fit(src, generer.POST, Image.LANCZOS, centering=(0.5, 0.6))

    # Vitre dépolie : flou fort et léger voile, seulement dans le cadre.
    vitre = post.crop(VITRE).filter(ImageFilter.GaussianBlur(26)).convert("RGBA")
    voile = Image.new("RGBA", vitre.size, ENCRE)
    voile.putalpha(70)
    post.paste(Image.alpha_composite(vitre, voile).convert("RGB"), VITRE[:2])

    calque = Image.new("RGBA", post.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    milieu = (VITRE[1] + VITRE[3]) / 2
    d.text((CENTRE_FENETRE, milieu - 120), "Jetez un œil", font=police("CormorantGaramond[wght].ttf", 84, 400),
           fill=BLANC, anchor="mt")
    d.text((CENTRE_FENETRE, milieu - 22), "par la fenêtre…", font=police("CormorantGaramond-Italic[wght].ttf", 84, 400),
           fill=BLANC, anchor="mt")
    caps, esp, texte = police("Jost[wght].ttf", 26, 500), 8, "NOUVEAU POST"
    larg = sum(d.textlength(c, font=caps) for c in texte) + esp * (len(texte) - 1)
    x = CENTRE_FENETRE - larg / 2
    for c in texte:
        d.text((x, milieu + 105), c, font=caps, fill=BLANC, anchor="lt")
        x += d.textlength(c, font=caps) + esp
    texte_ombre = ombre_douce(calque, force=0.4)

    # La signature, comme sur le post : entre la fenêtre et la ceinture.
    sig = signature(BLANC, BLANC)
    sig = sig.resize((LARGEUR_SIG, round(sig.height * LARGEUR_SIG / sig.width)), Image.LANCZOS)
    texte_ombre.alpha_composite(sig, (round(CENTRE_FENETRE - sig.width / 2),
                                      round((BAS_FENETRE + CEINTURE) / 2 - sig.height / 2)))

    im = Image.alpha_composite(post.convert("RGBA"), texte_ombre).convert("RGB")
    return im.crop((0, HAUT_CARRE, C, HAUT_CARRE + C))


if __name__ == "__main__":
    carre().save(RACINE / "stories" / "teaser-fenetre-carre.jpg", quality=92)
