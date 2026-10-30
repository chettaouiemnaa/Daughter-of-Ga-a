"""Post : la fenêtre du mur ocre et les chevaux en bois, au format 4:5 du fil,
signé comme les autres photos (signer() du kit, voir generer.py).

    python3 instagram/post_fenetre.py
"""
from pathlib import Path
from PIL import Image, ImageOps

import generer

RACINE = Path(__file__).resolve().parent

if __name__ == "__main__":
    src = ImageOps.exif_transpose(Image.open(RACINE / "photos" / "fenetre-mur-ocre.png")).convert("RGB")
    # On rogne un peu plus en haut qu'en bas : les branches restent, et le pied
    # du mur garde la place de la signature.
    im = ImageOps.fit(src, generer.POST, Image.LANCZOS, centering=(0.5, 0.6))
    generer.sauver(generer.signer(im), RACINE / "posts" / "fenetre-chevaux-de-bois.jpg")
