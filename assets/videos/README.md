# Vidéo de fond — recyclage

Un fichier vidéo est maintenant présent ici et s'affiche automatiquement en fond sur la
page d'accueil (section "Le recyclage en direct", juste après le hero) :

```
recycling-hero.mp4        — la vidéo (8 secondes, en boucle, 1280×720, ~300 Ko)
recycling-hero-poster.jpg — l'image affichée pendant le chargement
```

## D'où vient cette vidéo

Je ne peux ni filmer de vraies images, ni télécharger de séquence protégée depuis les
banques de vidéos (mon environnement n'a pas accès à ces sites). Cette vidéo est donc une
**animation générée par programme** (Python + Pillow, encodée en MP4 avec ffmpeg) plutôt
qu'une vraie prise de vue : elle illustre le principe du recyclage de façon stylisée —
bouteille, carton et canette qui dérivent vers un symbole de recyclage tournant, puis en
ressortent sous forme d'objet déco — avec les couleurs de la marque Decorna. Elle boucle
sans coupure visible et pèse très peu (autoplay fluide, y compris sur mobile).

## Remplacer par une vraie vidéo d'atelier

Si vous filmez un jour votre atelier réel (élèves en train de trier, coller, poncer...),
remplacez simplement ce fichier par le vôtre, en gardant exactement le même nom :

```
decorna/assets/videos/recycling-hero.mp4
```

Recommandations : format MP4 (H.264), muet (la vidéo est lue en `muted autoplay loop`),
10 à 20 secondes en boucle, résolution 1280×720 ou 1920×1080, quelques Mo maximum pour ne
pas ralentir le chargement.

Quelques banques de vidéos gratuites si besoin d'appoint, avec la recherche déjà pointée
sur "recycling" :

- Pexels Videos — https://www.pexels.com/search/videos/recycling/
- Pixabay Videos — https://pixabay.com/videos/search/recycling/
- Mixkit — https://mixkit.co/free-stock-video/recycle/

## Filet de sécurité

Si ce fichier venait à être supprimé ou renommé par erreur, le site ne casse pas : une
animation CSS de secours (icônes ♻️ 🧴 📦 🌿 qui dérivent sur fond dégradé) prend
automatiquement le relais.

## Vidéo "Tous nos produits" (products-showcase.mp4)

Un deuxième fichier vidéo est présent : `products-showcase.mp4` (+ son poster
`products-showcase-poster.jpg`), affiché juste après la vidéo de recyclage sur la page
d'accueil.

Contrairement à la vidéo de recyclage (animation générée), celle-ci est un **vrai montage
construit à partir de vos 11 photos de produits réelles** déjà présentes dans
`assets/products/` (Vase Mawja, Lampe Lumina, Cadre Souvenir, Panier Nida, Horloge Cercle
Vert, Pot Racine, Miroir Reflet, Vase Aurore Corail, Vase Nomade, Coffret Rose Éternelle,
Suspension Feuilles Dorées) : chaque produit apparaît environ 2 secondes avec un léger
zoom, un fondu enchaîné vers le suivant, et son nom + prix affichés en bas.

Durée totale : ~23 secondes, en boucle. Poids : ~3 Mo.

Si vous ajoutez de nouveaux produits avec photo à l'avenir, dites-moi et je régénère cette
vidéo pour inclure les nouvelles pièces.
