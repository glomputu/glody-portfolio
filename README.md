# Portfolio professionnel de GloDi MPUTU

Portfolio React/Vite bilingue avec Worker Cloudflare, sauvegarde D1 et livraison transactionnelle des messages de contact. Le contenu public et les CV sont limités aux informations professionnelles validées de GloDi MPUTU.

## Démarrage local

```bash
npm install
npm run dev
```

Le serveur Vite démarre l’interface, le Worker `/api/contact` et une base D1 locale.

## Vérifications

```bash
npm run lint
npm run build
npm run test:email
npm run test:contact -- http://localhost:3000
```

Le test email vérifie les deux messages transactionnels, les `Reply-To`, l’échappement HTML, l’idempotence et les pannes partielles du fournisseur. Le test de contact vérifie la validation serveur, le honeypot, l’idempotence, la persistance D1, le repli sans perte en cas d’indisponibilité email et la limitation de débit. Le serveur local doit être lancé avant le second test.

## Organisation

- `src/i18n/translations.ts` : toutes les chaînes publiques françaises et anglaises ;
- `src/config/siteConfig.ts` : coordonnées publiques, réseaux sociaux et sources du portrait ;
- `src/data/portfolioData.ts` : données bilingues centralisées des réalisations, avec séparation entre entrées publiques et brouillons ;
- `docs/realizations-audit.md` : provenance des informations publiées, commits vérifiés et limites de publication ;
- `src/data/resumeContent.json` : source structurée commune au site et aux CV ;
- `worker/index.ts` : endpoint sécurisé et sauvegarde D1 du formulaire ;
- `worker/email.ts` : notification propriétaire et accusé de réception via Resend ;
- `db/schema.ts` et `drizzle/` : schéma et migration D1 ;
- `scripts/generate-resume.py` : génération reproductible des CV FR et EN ;
- `scripts/optimize-images.py` : variantes AVIF, WebP et JPEG du portrait ;
- `public/boot.js` : préférence de langue et de thème appliquée avant React pour éviter le flash initial.

## Configuration publique

Copier `.env.example` vers `.env.local` et ne renseigner que les informations que le propriétaire souhaite publier. Les variables `VITE_*` sont intégrées au frontend et ne doivent jamais contenir de secret.

## Portrait et CV

L’image source est `public/images/profile/glodi-mputu.jpeg`. Les variantes de production sont générées par :

```bash
npm run optimize:images
```

Le composant `ProfilePortrait` essaie toujours la photo et n’affiche les initiales qu’après une véritable erreur de chargement. Les CV déployés se trouvent dans `public/documents/` et peuvent être régénérés avec `npm run generate:resume`.

## Contact

Le frontend envoie les messages au Worker same-origin `/api/contact`. Le Worker valide et enregistre d’abord la demande dans D1, puis envoie la notification propriétaire et l’accusé de réception. Un échec du fournisseur ne supprime jamais la demande : son statut reste enregistré pour permettre une reprise avec la même clé d’idempotence.

Variables serveur nécessaires en production :

- `RESEND_API_KEY` : secret Cloudflare ;
- `CONTACT_TO_EMAIL` : adresse de réception du propriétaire ;
- `CONTACT_FROM_EMAIL` : expéditeur appartenant à un domaine vérifié chez Resend.

Aucun secret, mot de passe SMTP ou jeton d’API ne doit être placé dans une variable `VITE_*` ou dans le navigateur.

## Réalisations

La section « Réalisations / Selected Work » est générée depuis `src/data/portfolioData.ts`. Une entrée n’est visible que si sa propriété `visibility` vaut `public`. Les captures et liens externes ne sont rendus que lorsqu’ils sont réellement fournis et publiables ; aucun placeholder n’est affiché en production. Les dépôts privés peuvent rester documentés dans les données avec `repositoryPublic: false` sans créer de lien inaccessible pour le visiteur.
