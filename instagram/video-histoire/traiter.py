"""Deux passes : 1) masque du sous-titre de chaque image ; 2) masque fiabilisé
sur une fenêtre de ±R images (le sous-titre dure plusieurs secondes), puis
inpainting, et réencodage avec le son d'origine."""
import sys, subprocess
import cv2, numpy as np
from effacer import masque, effacer, Y0, Y1

src, dst = sys.argv[1], sys.argv[2]
R = 3

cap = cv2.VideoCapture(src)
w, h = int(cap.get(3)), int(cap.get(4))
y0, y1 = int(h * Y0), int(h * Y1)
masques = []
while True:
    ok, img = cap.read()
    if not ok:
        break
    masques.append(np.packbits(masque(img)[y0:y1] > 0))
cap.release()
forme = (y1 - y0, w)
deballe = lambda p: np.unpackbits(p)[: forme[0] * forme[1]].reshape(forme)
actif = [p.any() for p in masques]

ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}",
                       "-r", "30", "-i", "-", "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264",
                       "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy",
                       "-movflags", "+faststart", dst], stdin=subprocess.PIPE)
cap = cv2.VideoCapture(src)
for i in range(len(masques)):
    ok, img = cap.read()
    fen = range(max(0, i - R), min(len(masques), i + R + 1))
    voisins = [j for j in fen if actif[j]]
    m = np.zeros((h, w), np.uint8)
    # Un vrai sous-titre est présent sur la majorité des images voisines.
    if len(voisins) >= 4:
        m[y0:y1] = np.maximum.reduce([deballe(masques[j]) for j in voisins]) * 255
    ff.stdin.write(effacer(img, m).tobytes())
ff.stdin.close()
ff.wait()
print("images", len(masques))
