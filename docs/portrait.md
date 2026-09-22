# Portrait de production

La source validée est `public/images/profile/glodi-mputu.jpeg` (960 × 1280). Le script `npm run optimize:images` produit un cadrage vertical 4:5 de 720 × 900 pixels en AVIF, WebP et JPEG, sans modifier l’original.

`ProfilePortrait` utilise l’ordre AVIF → WebP → JPEG → source originale. Le cadrage CSS conserve le visage dans la zone utile sur mobile et desktop. Les initiales « GM » ne sont affichées qu’après un véritable échec du chargement de toutes les sources prises en charge.

Pour remplacer la photo, conserver le même nom de source puis relancer l’optimisation. Vérifier visuellement les deux thèmes et les largeurs 320, 768 et 1440 px avant publication.
