"""Génère le kit de lancement Instagram de Daughter of Gaïa.

Sources : les photos du site (daughter-of-gaia/public/images) et les
couleurs / typographies de l'identité (voir le README du site).
Sortie : instagram/posts, instagram/stories, instagram/profil, instagram/plus-tard.

    python3 instagram/generer.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

RACINE = Path(__file__).resolve().parent
PHOTOS = RACINE.parent / "daughter-of-gaia" / "public" / "images"
PHOTOS_KIT = RACINE / "photos"  # photos propres au kit, absentes du site
POLICES = Path(sys.argv[1]) if len(sys.argv) > 1 else RACINE / "polices"

SABLE, BLANC, ENCRE = "#EDE4D3", "#F6F1E7", "#2B2118"
OLIVE, TERRA, FILET = "#6B7355", "#B5654A", "#C7B79A"

POST = (1080, 1350)   # 4:5, le format portrait du fil
STORY = (1080, 1920)  # 9:16


def police(nom, taille, graisse=300):
    f = ImageFont.truetype(str(POLICES / nom), taille)
    try:
        f.set_variation_by_axes([graisse])
    except Exception:
        pass
    return f


def serif(t, g=300): return police("CormorantGaramond[wght].ttf", t, g)
def italique(t, g=300): return police("CormorantGaramond-Italic[wght].ttf", t, g)
def sans(t, g=300): return police("Jost[wght].ttf", t, g)


def photo(nom, taille, centre=(0.5, 0.5)):
    src = PHOTOS_KIT / nom if (PHOTOS_KIT / nom).exists() else PHOTOS / nom
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    return ImageOps.fit(im, taille, Image.LANCZOS, centering=centre)


def centre(d, y, texte, f, couleur, larg, espacement=0):
    """Écrit une ligne centrée ; espacement = interlettrage en px."""
    if espacement:
        w = sum(d.textlength(c, font=f) for c in texte) + espacement * (len(texte) - 1)
        x = (larg - w) / 2
        for c in texte:
            d.text((x, y), c, font=f, fill=couleur)
            x += d.textlength(c, font=f) + espacement
    else:
        w = d.textlength(texte, font=f)
        d.text(((larg - w) / 2, y), texte, font=f, fill=couleur)


def carte(fond, encre, lignes, taille=POST):
    """Carte typographique. lignes = [(texte, police, couleur|None, y, interlettrage)]."""
    im = Image.new("RGB", taille, fond)
    d = ImageDraw.Draw(im)
    for texte, f, c, y, esp in lignes:
        centre(d, y, texte, f, c or encre, taille[0], esp)
    return im


def sauver(im, chemin):
    chemin.parent.mkdir(parents=True, exist_ok=True)
    im.save(chemin, quality=92, optimize=True)


# La phrase sous le nom. Une seule ligne à changer pour en essayer une autre
# (pistes dans TEXTES.md). Elle ne dit rien du concept, pas encore annoncé.
PHRASE = "Là où la ville s'arrête."


def titre_sur_photo(nom, taille, pos, y0, voile=0.18, sur=None):
    """Le nom posé sur une photo, avec un voile sombre fondu sous le texte."""
    W, H = taille
    im = Image.blend(photo(nom, taille, pos), Image.new("RGB", taille, ENCRE), voile)
    masque = Image.new("L", taille, 0)
    ImageDraw.Draw(masque).rectangle((0, y0 - 140, W, y0 + 500), fill=175)
    masque = masque.filter(ImageFilter.GaussianBlur(140))
    im = Image.composite(Image.new("RGB", taille, ENCRE), im, masque)
    d = ImageDraw.Draw(im)
    if sur:
        centre(d, y0 - 90, sur, sans(24, 400), SABLE, W, 7)
    centre(d, y0, "Daughter", serif(150), BLANC, W)
    centre(d, y0 + 150, "of Gaïa", italique(150), BLANC, W)
    centre(d, y0 + 360, PHRASE, italique(58), BLANC, W)
    return im


def citation():
    return carte(OLIVE, BLANC, [
        ("“", serif(200), FILET, 330, 0),
        ("There are places", italique(84), None, 540, 0),
        ("you visit.", italique(84), None, 635, 0),
        ("And there are places", italique(84), None, 760, 0),
        ("you feel.", italique(84), None, 855, 0),
        ("DAUGHTER OF GAÏA", sans(22, 400), SABLE, 1060, 6),
    ])


def refuge():
    return carte(TERRA, BLANC, [
        ("LE REFUGE", sans(24, 400), SABLE, 330, 7),
        ("Sauvés,", serif(120), None, 450, 0),
        ("réhabilités,", serif(120), None, 580, 0),
        ("et chez eux.", italique(120), None, 710, 0),
        ("Sept chevaux recueillis.", serif(42), SABLE, 920, 0),
        ("Quatre vivent ici aujourd'hui.", serif(42), SABLE, 972, 0),
    ])


def domaine():
    # « où la ville disparaît » ferait doublon avec la phrase sous le nom.
    return carte(ENCRE, BLANC, [
        ("LE DOMAINE", sans(24, 400), FILET, 330, 7),
        ("4 000 m²", serif(150), None, 460, 0),
        ("de nature préservée", italique(70), SABLE, 650, 0),
        ("LA SOUKRA  —  TUNIS", sans(24, 400), TERRA, 950, 6),
    ])


def gaia():
    """Le sens du nom, sans rien dire du concept."""
    return carte(BLANC, ENCRE, [
        ("GAÏA", sans(24, 400), OLIVE, 330, 9),
        ("Fille", italique(130), None, 440, 0),
        ("de la Terre.", serif(130), None, 585, 0),
        ("Gaïa, déesse de la Terre", serif(44), TERRA, 900, 0),
        ("dans la mythologie grecque.", serif(44), TERRA, 955, 0),
    ])


def lustre():
    """Détail : la suspension aux verres soufflés de l'espace couvert."""
    im = Image.open(PHOTOS / "salle-lustre.jpg").convert("RGB")
    return im.crop((110, 0, 1150, 1300)).resize(POST, Image.LANCZOS)


def nom_avec_ombre(im, y0, taille=176, sur="PRIVATE EXPERIENCES"):
    """Le nom en crème, détaché par une ombre douce autour des lettres
    plutôt que par un voile : la photo garde toutes ses couleurs."""
    W = im.size[0]
    lignes = [(y0 - 45, sur, sans(24, 400), 7), (y0, "Daughter", serif(taille, 400), 0),
              (y0 + taille * 0.97, "of Gaïa", italique(taille, 400), 0)]
    ombre = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(ombre)
    for y, texte, f, esp in lignes:
        centre(d, y, texte, f, 255, W, esp)
    ombre = ombre.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(22))
    im = Image.composite(Image.new("RGB", im.size, ENCRE), im, ombre.point(lambda v: int(v * 0.7)))
    d = ImageDraw.Draw(im)
    for y, texte, f, esp in lignes:
        centre(d, y, texte, f, BLANC, W, esp)
    return im


def nom_du_projet():
    """Le logo en carte, dans le même esprit que les autres cartes texte."""
    return carte(SABLE, ENCRE, [
        ("PRIVATE EXPERIENCES", sans(24, 400), OLIVE, 330, 7),
        ("Daughter", serif(190, 400), None, 420, 0),
        ("of Gaïa", italique(190, 400), None, 605, 0),
        ("LA SOUKRA  —  TUNIS", sans(24, 400), TERRA, 1010, 6),
    ])


VIDEO = RACINE.parent / "daughter-of-gaia" / "public" / "videos" / "ouverture-jardin.mp4"


def reel():
    """Variante : le logo qui apparaît sur la vidéo du jardin, en Reel.
    Le nom reste dans le centre de l'image : le bas est couvert par la
    légende et les boutons de Reels, et la grille n'affiche que le centre."""
    import subprocess, tempfile
    out = RACINE / "reel"
    out.mkdir(exist_ok=True)
    calque = Image.new("RGBA", STORY, (0, 0, 0, 0))
    lignes = [(515, "PRIVATE EXPERIENCES", sans(26, 400), 7), (560, "Daughter", serif(184, 400), 0),
              (738, "of Gaïa", italique(184, 400), 0)]
    masque = Image.new("L", STORY, 0)
    for y, texte, f, esp in lignes:
        centre(ImageDraw.Draw(masque), y, texte, f, 255, STORY[0], esp)
    ombre = masque.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(26))
    calque.paste(Image.new("RGBA", STORY, ENCRE), (0, 0), ombre.point(lambda v: int(v * 0.8)))
    d = ImageDraw.Draw(calque)
    for y, texte, f, esp in lignes:
        centre(d, y, texte, f, BLANC, STORY[0], esp)
    with tempfile.TemporaryDirectory() as tmp:
        png = f"{tmp}/logo.png"
        calque.save(png)
        # Deux boucles de la vidéo (≈ 10 s) ; le nom apparaît en fondu.
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "1", "-i", str(VIDEO),
                        "-loop", "1", "-i", png, "-filter_complex",
                        "[1:v]format=rgba,fade=in:st=0.6:d=1.4:alpha=1[t];[0:v][t]overlay=0:0:shortest=1,format=yuv420p",
                        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-r", "30",
                        "-movflags", "+faststart", str(out / "reel-daughter-of-gaia.mp4")], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "3", "-i", str(out / "reel-daughter-of-gaia.mp4"),
                        "-frames:v", "1", "-q:v", "2", str(out / "couverture.jpg")], check=True)


# Les 12 posts, du premier publié au dernier. Le 12 arrive en dernier pour
# s'afficher en haut à gauche du profil : c'est la vidéo qui révèle le nom,
# avec fin-video/fin-sable.jpg en couverture ; la carte logo ci-dessous la
# remplace si la vidéo n'est pas prête. Les cartes forment un zigzag ; les
# photos du même duo de chevaux ne se touchent jamais, même par un coin.
LANCEMENT = [
    ("citation", citation),
    ("cheval-bar", ("cheval-bar.jpg", (0.5, 0.55))),
    ("fenetre-chevaux-statuettes", ("fenetre-chevaux-statuettes.jpg", (0.5, 0.45))),
    ("chevaux-fenetre", ("chevaux-fenetre.jpg", (0.5, 0.6))),
    ("chevaux-pie-broutent", ("chevaux-pie-broutent.jpg", (0.5, 0.72))),
    ("refuge", refuge),
    ("domaine", domaine),
    ("ecuries", ("domaine.jpg", (0.5, 0.6))),
    ("terrasse-vasque", ("terrasse-vasque.jpg", (0.5, 0.5))),
    ("trois-chevaux", ("trois-chevaux.jpg", (0.5, 0.6))),
    ("cheval-noir-blanc", ("cheval-noir-blanc.jpg", (0.5, 0.45))),
    ("daughter-of-gaia", nom_du_projet),
]


def posts():
    out = RACINE / "posts"
    for i, (nom, source) in enumerate(LANCEMENT, 1):
        im = source() if callable(source) else photo(source[0], POST, source[1])
        sauver(im, out / f"{i:02d}-{nom}.jpg")


def plus_tard():
    """Ce qui parle des événements : à publier une fois le concept annoncé."""
    out = RACINE / "plus-tard"
    # En réserve pour les semaines qui suivent le lancement.
    sauver(gaia(), out / "gaia.jpg")
    sauver(lustre(), out / "suspension.jpg")
    sauver(photo("jardin-video.jpg", POST, (0.5, 0.62)), out / "jardin.jpg")
    sauver(carte(BLANC, ENCRE, [
        ("EXPÉRIENCES", sans(24, 400), OLIVE, 250, 7),
        ("Ce que le domaine", serif(82), None, 330, 0),
        ("accueille", italique(82), None, 425, 0),
        ("Séminaires & journées d'équipe", serif(46), None, 610, 0),
        ("Lancements de marque", serif(46), None, 675, 0),
        ("Anniversaires  ·  Baby showers", serif(46), None, 740, 0),
        ("Brunchs privés  ·  Tables d'hôte", serif(46), None, 805, 0),
        ("Shootings photo & vidéo", serif(46), None, 870, 0),
        ("DOMAINE PRIVATISÉ  —  SUR RÉSERVATION", sans(22, 400), TERRA, 1040, 5),
    ]), out / "experiences.jpg")

    # Couvertures des stories à la une, une fois qu'il y aura de quoi les remplir.
    t = 1080
    for nom, fond, enc in [("Le domaine", SABLE, ENCRE), ("Le refuge", TERRA, BLANC),
                           ("Expériences", OLIVE, BLANC), ("Réserver", ENCRE, BLANC)]:
        im = Image.new("RGB", (t, t), fond)
        centre(ImageDraw.Draw(im), 430, nom, italique(150), enc, t)
        fichier = nom.lower().replace("é", "e").replace("è", "e").replace(" ", "-")
        sauver(im, out / f"une-{fichier}.jpg")


def stories():
    out = RACINE / "stories"
    # L'annonce à publier depuis le compte perso.
    im = nom_avec_ombre(photo("trois-chevaux.jpg", STORY, (0.5, 0.55)), 400, sur="LE NOM DU PROJET")
    d = ImageDraw.Draw(im)
    W = STORY[0]
    # Emplacement laissé libre pour l'autocollant « Mention » ou « Lien ».
    ombre = Image.new("L", STORY, 0)
    centre(ImageDraw.Draw(ombre), 1600, "Suivez l'aventure", sans(32, 400), 255, W, 3)
    ombre = ombre.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(16))
    im = Image.composite(Image.new("RGB", STORY, ENCRE), im, ombre.point(lambda v: int(v * 0.6)))
    centre(ImageDraw.Draw(im), 1600, "Suivez l'aventure", sans(32, 400), BLANC, W, 3)
    sauver(im, out / "annonce-compte-perso.jpg")


def profil():
    out = RACINE / "profil"
    # Photo de profil : monogramme, lisible même en tout petit.
    t = 1080
    im = Image.new("RGB", (t, t), SABLE)
    d = ImageDraw.Draw(im)
    # Pas de texte en plus : Instagram rogne en cercle et l'affiche à 110 px.
    d.text((t / 2, t / 2), "G", font=serif(640, 300), fill=ENCRE, anchor="mm")
    sauver(im, out / "photo-profil.jpg")


def fin_de_video():
    """Écrans de fin pour la vidéo qui révèle le nom (format Reels, 9:16).
    Le texte reste dans le centre de l'image : en Reels, le bas est couvert
    par la légende et la droite par les boutons."""
    import subprocess
    out = RACINE / "fin-video"
    out.mkdir(exist_ok=True)
    W, H = STORY
    lignes = [(700, "PRIVATE EXPERIENCES", sans(28, 400), 8, "sur"),
              (700, "LA SOUKRA  —  TUNIS", sans(28, 400), 8, "lieu"),
              (760, "Daughter", serif(200, 400), 0, "nom"),
              (958, "of Gaïa", italique(200, 400), 0, "nom"),
              (1255, "LA SOUKRA  —  TUNIS", sans(26, 400), 7, "sous"),
              (1312, "@daughterofgaiatunis", sans(30, 400), 1, "sous")]

    def ecrire(im, couleurs):
        d = ImageDraw.Draw(im)
        for y, texte, f, esp, role in lignes:
            if role in couleurs:
                centre(d, y, texte, f, couleurs[role], W, esp)
        return im

    # Fonds unis, aux couleurs de l'identité.
    sauver(ecrire(Image.new("RGB", STORY, SABLE), {"sur": OLIVE, "nom": ENCRE, "sous": TERRA}), out / "fin-sable.jpg")
    sauver(ecrire(Image.new("RGB", STORY, ENCRE), {"sur": FILET, "nom": BLANC, "sous": TERRA}), out / "fin-encre.jpg")

    # Calque transparent à poser sur le dernier plan de la vidéo, dans CapCut
    # (« Incrustation »). Une ombre douce détache le nom de n'importe quelle image.
    def calque_nom(dy=0, roles=("sur", "nom", "sous")):
        choix = [l for l in lignes if l[4] in roles]
        masque = Image.new("L", STORY, 0)
        d = ImageDraw.Draw(masque)
        for y, texte, f, esp, _ in choix:
            centre(d, y + dy, texte, f, 255, W, esp)
        ombre = masque.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(26)).point(lambda v: int(v * 0.75))
        calque = Image.new("RGBA", STORY, (0, 0, 0, 0))
        calque.paste(Image.new("RGBA", STORY, ENCRE), (0, 0), ombre)
        d = ImageDraw.Draw(calque)
        for y, texte, f, esp, role in choix:
            centre(d, y + dy, texte, f, SABLE if role != "nom" else BLANC, W, esp)
        return calque
    calque_nom().save(out / "nom-transparent.png")

    # Le même nom posé sur une photo du domaine, remonté sur le mur ocre
    # pour ne pas couvrir les chevaux ; le lieu passe au-dessus du nom.
    sauver(Image.alpha_composite(photo("trois-chevaux.jpg", STORY, (0.5, 0.55)).convert("RGBA"),
                                 calque_nom(-400, ("lieu", "nom"))).convert("RGB"), out / "fin-photo.jpg")

    # Version animée de 4 s : fond encre, le nom apparaît en fondu.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={ENCRE}:s={W}x{H}:d=4:r=30",
                    "-loop", "1", "-i", str(out / "nom-transparent.png"), "-filter_complex",
                    "[1:v]format=rgba,fade=in:st=0.4:d=1.6:alpha=1[t];[0:v][t]overlay=0:0:shortest=1,format=yuv420p",
                    "-t", "4", "-an", "-c:v", "libx264", "-crf", "18", "-movflags", "+faststart",
                    str(out / "fin-encre-anime.mp4")], check=True)


def apercu():
    """La grille telle qu'elle apparaîtra, du plus récent au plus ancien."""
    fichiers = sorted((RACINE / "posts").glob("*.jpg"), reverse=True)
    c, g = 360, 4  # vignettes 3:4, comme la grille actuelle d'Instagram
    h = c * 4 // 3
    lignes = len(fichiers) // 3
    im = Image.new("RGB", (3 * c + 2 * g, lignes * h + (lignes - 1) * g), "white")
    for i, f in enumerate(fichiers):
        v = ImageOps.fit(Image.open(f), (c, h), Image.LANCZOS)
        im.paste(v, ((i % 3) * (c + g), (i // 3) * (h + g)))
    sauver(im, RACINE / "apercu-grille.jpg")
    # Même grille, avec le Reel en haut à gauche (la grille montre le
    # centre de la vidéo, en 3:4).
    couv = ImageOps.fit(Image.open(RACINE / "reel" / "couverture.jpg"), (c, h), Image.LANCZOS)
    im.paste(couv, (0, 0))
    sauver(im, RACINE / "reel" / "apercu-grille-reel.jpg")


if __name__ == "__main__":
    posts()
    reel()
    plus_tard()
    stories()
    profil()
    fin_de_video()
    apercu()
    print("ok")
