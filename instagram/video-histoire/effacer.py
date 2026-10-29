"""Efface les sous-titres incrustés (texte blanc cerné de noir, en bas)."""
import cv2, numpy as np

Y0, Y1 = 0.74, 0.97
k = lambda n: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))

def masque(img):
    h, w = img.shape[:2]
    y0, y1 = int(h * Y0), int(h * Y1)
    b = img[y0:y1]
    mn, mx = b.min(2).astype(int), b.max(2).astype(int)
    blanc = ((mn > 185) & (mx - mn < 45)).astype(np.uint8)
    sombre = (mx < 85).astype(np.uint8)
    lettres = blanc & cv2.dilate(sombre, k(9))
    # Seules les lignes riches en lettres sont du texte ; on borne aussi en largeur.
    lignes = lettres.sum(1)
    ok = cv2.dilate((lignes > 8).astype(np.uint8).reshape(-1, 1), np.ones((11, 1), np.uint8)).ravel()
    lettres[ok == 0] = 0
    cols = np.where(lettres.sum(0) > 0)[0]
    if len(cols) < 20:
        return np.zeros((h, w), np.uint8)
    lettres[:, :max(cols.min() - 10, 0)] = 0
    lettres[:, cols.max() + 10:] = 0
    contour = sombre & cv2.dilate(lettres, k(9))
    m = cv2.dilate(lettres | contour, k(7))
    full = np.zeros((h, w), np.uint8)
    full[y0:y1] = m * 255
    return full

def effacer(img, m):
    return img if m.max() == 0 else cv2.inpaint(img, m, 6, cv2.INPAINT_TELEA)
