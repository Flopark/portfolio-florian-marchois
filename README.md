# Portfolio Florian Marchois

Site statique autonome, neuf pages et une page 404. Le dossier `dist` peut être publié tel quel sur Sites, Netlify, Vercel ou GitHub Pages. Aucun serveur applicatif, compte visiteur ou base de données.

## Modifier les pages

Modifier `build.py`, puis lancer `python build.py`. Les styles et interactions sont dans `dist/assets/style.css` et `dist/assets/site.js`. Le site fonctionne avec les liens `.html`, y compris dans un sous-dossier GitHub Pages.

## Contenu et confidentialité

Les quatre projets ont été validés par Florian. Les textes distinguent projets collectifs, recommandations académiques et résultats mesurés. Aucun rapport intégral, document interne, numéro privé, adresse personnelle ou donnée administrative n'est publié. Le CV est une synthèse publique créée à partir des éléments vérifiés.

Les cinq captures Air France fournies ont été transcrites intégralement pour les commentaires visibles, avec anonymisation des rédacteurs. Les originaux ne sont pas présents dans le site. La lettre et son formulaire associé ne sont pas présentés comme des observations indépendantes. Aucune responsabilité de sécurité des vols n’est attribuée à Florian.

Les éléments de traçabilité restent dans le dossier d'analyse du travail, hors du site et hors du dépôt publié.

## Vérification

`python check_site.py` vérifie les liens locaux, les identifiants, les assets et les attributs essentiels. Une vérification visuelle et fonctionnelle a également lieu dans le navigateur avant publication.

## Couche immersive — version locale

`experience.py` enrichit les pages de `build.py`, sans remplacer les contenus existants. `dist/assets/immersive.js` utilise Three.js 0.180.0, fourni localement avec sa licence MIT. `immersive.css` gère le storytelling et ses variantes mobile, impression et mouvement réduit. Aucun changement de framework.

La scène évolue par le scroll natif : empilement, déploiement, postes de production reliés par un convoyeur, Airbus A350. Les vues 3D sont chargées à proximité de l’écran et rendues à la demande ; seule la lame anime en continu après action explicite. Le rendu est suspendu hors écran et lorsque l’onglet est masqué. Densité de pixels plafonnée à 1 sur mobile et 1,5 sur grand écran. Modèle GLB fourni par Florian (222 Ko, texture intégrée), chargé localement, sans post-traitement. Repli graphique et contenu HTML disponibles sans WebGL.

Le mode réduit suit le système et peut aussi être activé par le bouton du site. Les textes et preuves restent tous accessibles, sans défilement forcé. La lame est une illustration qualitative ; les données Abaqus et mesures originales restent distinctes.

`python optimize_assets.py` génère les versions WebP avec Pillow, sans supprimer les JPG. Exécuter ensuite `python build.py`. Les formats allégés totalisent 858 142 octets contre 2 517 353 octets pour les JPG correspondants.

État initial conservé par le tag Git `baseline-portfolio-v1`. Publication GitHub Pages demandée explicitement par Florian pour cette évolution.

## Illustrations et scènes métier — 25 septembre 2026

Les quatre couvertures sont des illustrations générées et signalées comme telles. Les photographies, diagrammes, sons et mesures réels du Compositeauphone restent dans sa page. Les fichiers générés ont été copiés dans les assets du projet au format WebP.

`project_scenes.py` et `assets/project-scenes.js/css` remplacent les réseaux génériques Chanel/Boscha. La carte Chanel reprend le fond de carte du PDF et distingue les warehouses C (slides 4–7) des trois hubs B nommés dans les slides 12–13. Les flux animés sont explicatifs, sans débit simulé. Le schéma Boscha illustre le partage du CU22 entre boîtiers et SFPACK et permet de retrouver le plan original.

Les mouvements au curseur sont amortis et plus amples. L’A350 change d’angle au fil des évaluations et réagit au curseur sur toute la section. Le modèle détaillé `A350_nologo.glb` fourni par Florian remplace la géométrie procédurale. Sa texture originale sans logo est conservée.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` publie uniquement `dist/`. Dans Settings → Pages, sélectionner GitHub Actions. Les fichiers de génération restent dans le dépôt ; les documents sources privés restent hors dépôt.

La scène industrielle est une illustration de principe, et non le plan d’une usine cliente. Les pièces suivent le défilement sur les convoyeurs.
