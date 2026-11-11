"""Teaser du post brasero, sur le principe du teaser de la fenêtre : un calque
au format du post (4:5), à poser exactement sur le post partagé en story. Le haut de la photo, le cheval et le
pavillon, est flouté comme derrière une vitre dépolie, avec le texte et la
signature ; le gazon et le brasero restent nets. Aussi une version story plein écran.

    python3 instagram/story_teaser_brasero.py
"""
import sys
sys.argv = sys.argv[:1]
from generer import *

OUT = RACINE / "stories"
C = 1080
HAUT_CARRE = 135          # le carré pris dans le post 1080 × 1350
NET_DES = 930             # sous cette ligne (dans le post), la photo reste nette
FONDU = 120


def post_floute(taille, haut_net, fondu, flou=26):
    """La photo du post, floutée au-dessus de haut_net, avec un fondu."""
    im = photo("feu-cheval-pie.jpg", taille, (0.5, 0.0))
    flou_im = im.filter(ImageFilter.GaussianBlur(flou))
    voile = Image.new("RGB", taille, ENCRE)
    flou_im = Image.blend(flou_im, voile, 70 / 255)
    m = Image.new("L", taille, 0)
    d = ImageDraw.Draw(m)
    d.rectangle((0, 0, taille[0], haut_net - fondu), fill=255)
    for k in range(fondu):
        d.line((0, haut_net - fondu + k, taille[0], haut_net - fondu + k), fill=int(255 * (1 - k / fondu)))
    im.paste(flou_im, (0, 0), m)
    return im


def ombre(calque, force=0.4, r=18):
    a = calque.getchannel("A").filter(ImageFilter.GaussianBlur(r)).point(lambda v: int(v * force))
    o = Image.new("RGBA", calque.size, ENCRE)
    o.putalpha(a)
    return Image.alpha_composite(o, calque)


def textes(d, cx, milieu, invitation):
    centre(d, milieu - 130, "Un autre petit bout", serif(84, 400), BLANC, 2 * cx)
    centre(d, milieu - 32, "du domaine…", italique(84, 400), BLANC, 2 * cx)
    centre(d, milieu + 95, "NOUVEAU POST", sans(26, 500), BLANC, 2 * cx, 8)
    if invitation:
        centre(d, milieu + 145, "Touchez pour découvrir", italique(46, 400), BLANC, 2 * cx)


def signature(calque, cx, y):
    d = ImageDraw.Draw(calque)
    f = serif(taille_logo(430), 300)
    centre(d, y, LOGO, f, SABLE, 2 * cx)
    ligne_domaine(d, cx, y + f.getmetrics()[0] + 30, SABLE, taille=18, esp=6, graisse=400, ep=1.5,
                  trait=44, ecart=16)


# 1. Le calque au format exact du post (4:5, coins arrondis comme dans la
# story), fait à partir de l'image publiée : posé dessus, il la recouvre
# entièrement. La signature du post, en bas, reste telle quelle.
publie = en_srgb(Image.open(RACINE / "a-publier" / "feu-cheval-pie.jpg"))
flou = Image.blend(publie.filter(ImageFilter.GaussianBlur(26)), Image.new("RGB", POST, ENCRE), 70 / 255)
m = Image.new("L", POST, 0)
dm = ImageDraw.Draw(m)
dm.rectangle((0, 0, C, NET_DES - FONDU), fill=255)
for k in range(FONDU):
    dm.line((0, NET_DES - FONDU + k, C, NET_DES - FONDU + k), fill=int(255 * (1 - k / FONDU)))
post = publie.copy()
post.paste(flou, (0, 0), m)
calque = Image.new("RGBA", POST, (0, 0, 0, 0))
textes(ImageDraw.Draw(calque), C / 2, 440, False)
im = Image.alpha_composite(post.convert("RGBA"), ombre(calque))
coins = Image.new("L", POST, 0)
ImageDraw.Draw(coins).rounded_rectangle((0, 0, C - 1, POST[1] - 1), radius=30, fill=255)
im.putalpha(coins)
im.save(OUT / "teaser-brasero-4x5.png")
# Sans transparence ni coins arrondis : Instagram arrondit lui-même les
# autocollants photo, et certains téléphones remplissent la transparence de blanc.
sauver(Image.alpha_composite(post.convert("RGBA"), ombre(calque)).convert("RGB"), OUT / "teaser-brasero-4x5.jpg")

# 2. Plein écran, pour une story seule.
W, H = STORY
st = post_floute(STORY, 1330, 200)
calque = Image.new("RGBA", STORY, (0, 0, 0, 0))
textes(ImageDraw.Draw(calque), W / 2, 760, True)
signature(calque, W / 2, 1010)
sauver(Image.alpha_composite(st.convert("RGBA"), ombre(calque)).convert("RGB"), OUT / "teaser-brasero.jpg")
print("ok")
