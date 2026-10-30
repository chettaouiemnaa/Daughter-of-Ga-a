"""Post : la fenêtre du mur ocre et les chevaux en bois, au format 4:5 du fil.

La signature est posée sur le mur, au milieu de l'espace entre le bas de la
fenêtre et la ceinture du soubassement, centrée sous la fenêtre.

    python3 instagram/post_fenetre.py
"""
from pathlib import Path
from PIL import Image, ImageOps

import generer
from signature import BLANC, ENCRE, signature

RACINE = Path(__file__).resolve().parent
# Repères mesurés sur l'image recadrée (1080 × 1350).
BAS_FENETRE, CEINTURE = 991, 1244
CENTRE_FENETRE = 546
LARGEUR = 500

if __name__ == "__main__":
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "fenetre-mur-ocre.png")).convert("RGB")
    # On rogne un peu plus en haut qu'en bas : les branches restent, et le mur
    # sous la fenêtre garde toute sa place.
    fond = ImageOps.fit(src, generer.POST, Image.LANCZOS, centering=(0.5, 0.6)).convert("RGBA")
    for nom, couleur in (("creme", BLANC), ("encre", ENCRE)):
        sig = signature(couleur, couleur)
        sig = sig.resize((LARGEUR, round(sig.height * LARGEUR / sig.width)), Image.LANCZOS)
        im = fond.copy()
        milieu = (BAS_FENETRE + CEINTURE) / 2
        im.alpha_composite(sig, (round(CENTRE_FENETRE - sig.width / 2), round(milieu - sig.height / 2)))
        generer.sauver(im.convert("RGB"), RACINE / "posts" / f"fenetre-chevaux-de-bois-{nom}.jpg")
