"""Génère le kit de lancement Instagram de Daughter of Gaïa.

Sources : les photos du site (daughter-of-gaia/public/images) et les
couleurs / typographies de l'identité (voir le README du site).
Sortie : instagram/posts, instagram/stories, instagram/profil, instagram/plus-tard.

    python3 instagram/generer.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat

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
    # Les y ci-dessus placent les lignes entre elles, pas le bloc dans la carte.
    return recentrer(im, fond)


def recentrer(im, fond, milieu=None):
    """Recentre verticalement le contenu sur son encre réelle."""
    W, H = im.size
    boite = ImageChops.difference(im, Image.new("RGB", im.size, fond)).getbbox()
    if not boite:
        return im
    bloc = im.crop((0, boite[1], W, boite[3]))
    neuf = Image.new("RGB", im.size, fond)
    neuf.paste(bloc, (0, int((milieu or H / 2) - bloc.height / 2)))
    return neuf


# Le logo, tel que le site l'affiche à l'ouverture : Cormorant Garamond
# léger (300), droit, sur une seule ligne. Sans le filet du site.
LOGO = "Daughter of Gaïa"
NUIT = "#1A130C"  # le fond du rideau d'ouverture du site


def logo(d, y, taille, couleur, W=1080, espacement=0.0):
    """Dessine le logo, haut du texte en y, et renvoie où placer la ligne
    suivante. espacement en em : 0,5 au début de l'animation du site, 0 à la fin."""
    f = serif(taille, 300)
    if espacement:
        centre(d, y, LOGO, f, couleur, W, taille * espacement)
    else:
        centre(d, y, LOGO, f, couleur, W)
    largeur = d.textlength(LOGO, font=f)
    return y + f.getmetrics()[0] + largeur * 0.06


def taille_logo(largeur_voulue):
    """Corps de police qui donne au nom la largeur voulue, en pixels."""
    d = ImageDraw.Draw(Image.new("L", (1, 1)))
    return round(100 * largeur_voulue / d.textlength(LOGO, font=serif(100, 300)))


def avec_ombre(fond, dessiner, force=0.75, flou=26):
    """Pose ce que dessine dessiner(d, couleur) sur fond, détaché par une
    ombre douce : lisible sur n'importe quelle image."""
    masque = Image.new("L", fond.size, 0)
    dessiner(ImageDraw.Draw(masque), 255)
    ombre = masque.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(flou))
    im = fond.convert("RGBA")
    calque = Image.new("RGBA", fond.size, (0, 0, 0, 0))
    calque.paste(Image.new("RGBA", fond.size, ENCRE), (0, 0), ombre.point(lambda v: int(v * force)))
    im = Image.alpha_composite(im, calque)
    dessiner(ImageDraw.Draw(im), BLANC)
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
    """La carte logo : le logo du site, avec l'indice et le lieu."""
    W, H = POST
    im = Image.new("RGB", POST, SABLE)
    d = ImageDraw.Draw(im)
    t = taille_logo(780)
    centre(d, 500, "PRIVATE EXPERIENCES", sans(24, 400), OLIVE, W, 7)
    yf = logo(d, 560, t, ENCRE)
    centre(d, yf + 90, "LA SOUKRA  —  TUNIS", sans(24, 400), TERRA, W, 6)
    return recentrer(im, SABLE)


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


# Les photos où l'on voit les chevaux : ce sont elles qu'on signe.
AVEC_CHEVAUX = {"cheval-bar", "fenetre-chevaux-statuettes", "chevaux-fenetre", "chevaux-pie-broutent",
                "terrasse-vasque", "trois-chevaux", "cheval-noir-blanc"}


def luminance(rgb):
    """Luminance relative (WCAG) d'une couleur RVB 0-255."""
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, v, b = (canal(c) for c in rgb[:3])
    return 0.2126 * r + 0.7152 * v + 0.0722 * b


def contraste(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def signer(im):
    """Signature en bas au centre : le logo en petit, un fin filet juste
    dessous, et « LA SOUKRA ». Une seule couleur de la palette Gaïa, sans
    ombre : la première de sable, encre, blanc cassé qui contraste assez
    avec le fond (4:1), sinon la plus contrastée. Olive et terracotta,
    tons moyens comme les sols des photos, ne ressortent pas en petit."""
    W, H = im.size
    t = taille_logo(210)
    f = serif(t, 400)
    f_lieu = sans(17, 400)
    d = ImageDraw.Draw(im)
    largeur = d.textlength(LOGO, font=f)
    filet, ep = largeur / 2.42, 2
    y_lieu = H - 44 - f_lieu.getmetrics()[0]
    y_filet = y_lieu - 22
    y = y_filet - largeur * 0.07 - f.getmetrics()[0]
    zone = im.convert("RGB").crop((int((W - largeur) / 2), int(y), int((W + largeur) / 2), H - 40))
    fond = ImageStat.Stat(zone).mean
    palette = [ImageColor.getrgb(c) for c in (SABLE, ENCRE, BLANC)]
    couleur = next((c for c in palette if contraste(c, fond) >= 4), None) or max(palette, key=lambda c: contraste(c, fond))
    centre(d, y, LOGO, f, couleur, W)
    d.rectangle(((W - filet) / 2, y_filet, (W + filet) / 2, y_filet + ep - 1), fill=couleur)
    centre(d, y_lieu, "LA SOUKRA", f_lieu, couleur, W, 5)
    return im


def posts():
    out = RACINE / "posts"
    for i, (nom, source) in enumerate(LANCEMENT, 1):
        if callable(source):
            im = source()
        else:
            im = photo(source[0], POST, source[1])
            if nom in AVEC_CHEVAUX:
                im = signer(im)
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
    W = STORY[0]
    t = taille_logo(820)

    # L'annonce à publier depuis le compte perso : le logo sur le mur ocre,
    # et un emplacement libre pour l'autocollant « Mention » ou « Lien ».
    def textes(d, c):
        centre(d, 460, "LE NOM DU PROJET", sans(28, 400), c, W, 8)
        logo(d, 530, t, c, W)
        centre(d, 1600, "Suivez l'aventure", sans(32, 400), c, W, 3)
    fond = photo("trois-chevaux.jpg", STORY, (0.5, 0.55))
    sauver(avec_ombre(fond, textes).convert("RGB"), out / "annonce-compte-perso.jpg")


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
    Le texte reste au-dessus du centre de l'image : en Reels, le bas est
    couvert par la légende et la droite par les boutons."""
    import subprocess
    import tempfile
    out = RACINE / "fin-video"
    out.mkdir(exist_ok=True)
    W, H = STORY
    t = taille_logo(820)
    MILIEU = 900

    def ecran(d, c_sur, c_nom, c_sous, sur="PRIVATE EXPERIENCES", y=760):
        if sur:
            centre(d, y - 80, sur, sans(28, 400), c_sur, W, 8)
        yf = logo(d, y, t, c_nom, W)
        centre(d, yf + 100, "LA SOUKRA  —  TUNIS", sans(26, 400), c_sous, W, 7)
        centre(d, yf + 157, "@daughterofgaiatunis", sans(30, 400), c_sous, W, 1)

    # Fond sable : aussi la couverture de la vidéo dans la grille.
    im = Image.new("RGB", STORY, SABLE)
    ecran(ImageDraw.Draw(im), OLIVE, ENCRE, TERRA)
    sauver(recentrer(im, SABLE, MILIEU), out / "fin-sable.jpg")

    # Fond nuit : exactement le rideau d'ouverture du site.
    im = Image.new("RGB", STORY, NUIT)
    ecran(ImageDraw.Draw(im), FILET, SABLE, FILET)
    sauver(recentrer(im, NUIT, MILIEU), out / "fin-encre.jpg")

    # Calque transparent à poser sur le dernier plan de la vidéo, dans CapCut
    # (« Incrustation »).
    vide = Image.new("RGBA", STORY, (0, 0, 0, 0))
    avec_ombre(vide, lambda d, c: ecran(d, c, c, c)).save(out / "nom-transparent.png")

    # Sur la photo des trois chevaux : le lieu et le logo sur le mur ocre,
    # au-dessus des chevaux.
    def sur_photo(d, c):
        centre(d, 330, "LA SOUKRA  —  TUNIS", sans(28, 400), c, W, 8)
        logo(d, 400, t, c, W)
    fond = photo("trois-chevaux.jpg", STORY, (0.5, 0.55))
    sauver(avec_ombre(fond, sur_photo).convert("RGB"), out / "fin-photo.jpg")

    # Version animée : l'ouverture du site. Les lettres se resserrent (0,5 em
    # vers 0) en apparaissant, puis le
    # lieu et le compte arrivent en fondu.
    def ease(x):
        x = min(max(x, 0.0), 1.0)
        return 1 - (1 - x) ** 4
    fixe = Image.new("RGB", STORY, NUIT)
    ecran(ImageDraw.Draw(fixe), FILET, SABLE, FILET)
    boite = ImageChops.difference(fixe, Image.new("RGB", STORY, NUIT)).getbbox()
    dy = int(MILIEU - (boite[1] + boite[3]) / 2)
    y_nom = 760 + dy
    fps, duree = 30, 5
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(fps * duree):
            s_ = i / fps
            p_nom = ease((s_ - 0.3) / 1.6)
            p_sous = ease((s_ - 2.0) / 1.0)
            im = Image.new("RGB", STORY, NUIT)
            calque = Image.new("RGBA", STORY, (0, 0, 0, 0))
            d = ImageDraw.Draw(calque)
            a = int(255 * p_nom)
            logo(d, y_nom, t, (237, 228, 211, a), W, espacement=0.5 * (1 - p_nom))
            im.paste(calque, (0, 0), calque)
            yf = logo(ImageDraw.Draw(Image.new("L", (1, 1))), y_nom, t, 0, W)
            if p_sous > 0:
                c3 = Image.new("RGBA", STORY, (0, 0, 0, 0))
                d3 = ImageDraw.Draw(c3)
                b = int(255 * p_sous)
                centre(d3, y_nom - 80, "PRIVATE EXPERIENCES", sans(28, 400), (199, 183, 154, b), W, 8)
                centre(d3, yf + 100, "LA SOUKRA  —  TUNIS", sans(26, 400), (199, 183, 154, b), W, 7)
                centre(d3, yf + 157, "@daughterofgaiatunis", sans(30, 400), (199, 183, 154, b), W, 1)
                im.paste(c3, (0, 0), c3)
            im.save(f"{tmp}/{i:04d}.png")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(fps), "-i", f"{tmp}/%04d.png",
                        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
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
