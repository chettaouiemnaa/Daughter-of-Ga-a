"""Agrandit une photo ×2 avec un réseau de super-résolution (EDSR, OpenCV).

Il faut opencv-contrib-python-headless et le modèle EDSR_x2.pb
(github.com/Saafke/EDSR_Tensorflow, dossier models). Compter plusieurs minutes.

    python3 instagram/agrandir.py MODELE.pb ENTREE SORTIE
"""
import sys

import cv2

if __name__ == "__main__":
    modele, entree, sortie = sys.argv[1:4]
    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    sr.readModel(modele)
    sr.setModel("edsr", 2)
    cv2.imwrite(sortie, sr.upsample(cv2.imread(entree)))
