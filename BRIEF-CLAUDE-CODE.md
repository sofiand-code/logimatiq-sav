# Brief pour Claude Code — Logimatiq SAV

> Ce fichier est destiné à être lu par Claude Code au démarrage du projet.
> Il contient tout le contexte nécessaire pour reprendre le travail sans perte d'info.

---

## 1. Contexte projet

Je suis **Sofian**, je travaille chez **Logimatiq**. On fabrique des machines industrielles : EPIMAT, DistEPI, routeur GSM, PC de pilotage, lecteurs de badge, colonnes.

Je veux construire une **application interne de diagnostic SAV** qui guide pas-à-pas un technicien (ou un client en intervention rapide) dans la résolution d'une panne, sous forme d'arbre de décision interactif type quiz.

L'app doit être **mobile-first**, utilisable sur le terrain (atelier, intervention chez un client), et devra évoluer ensuite vers une vraie base de connaissances SAV (recherche par symptôme, fiches pannes, historique des interventions).

---

## 2. Ce qui existe déjà dans ce dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Maquette HTML cliquable mobile-first, autonome (Tailwind via CDN, vanilla JS, JSON intégré). Elle implémente déjà toute la branche EPIMAT — écran noir / synchro / bureau Windows / modem / badge — issue de mon arbre Miro (36 nœuds). |
| `ARCHITECTURE.md` | Document de conception complet : design system, organisation des écrans, schéma de données, choix techniques, roadmap S1→S7. **À lire en premier.** |
| `BRIEF-CLAUDE-CODE.md` | Ce fichier. |

**Lis `ARCHITECTURE.md` en entier avant toute action**, ça te donne le design system, les conventions de nommage, et le schéma JSON exact des nœuds.

---

## 3. Direction technique validée

- **Type d'app** : PWA (Progressive Web App) — installable sur mobile sans App Store, hors-ligne hybride.
- **Stack cible** : Vite + Vanilla JS (ou React si la complexité le justifie plus tard) + Tailwind + `vite-plugin-pwa`.
- **Hébergement cible** : Cloudflare Pages, déploiement automatique depuis GitHub.
- **Persistance v1** : `localStorage` pour l'historique. Pas de backend pour l'instant.
- **CMS futur (S5)** : Sanity ou Directus pour que je puisse éditer l'arbre sans toucher au code.
- **Mobile-first strict** : viewport 375–414 px de référence, cibles tactiles ≥ 44 px, fort contraste pour usage atelier.

---

## 4. Première mission : industrialiser la maquette

L'objectif du Sprint 1 (toi + moi en pair-coding) :
**transformer `index.html` autonome en un vrai projet Vite déployable, sans rien casser visuellement**.

### Tâches dans l'ordre

1. **Initialiser un projet Vite vanilla** dans ce dossier (sans React pour l'instant — on garde simple).
   - `npm create vite@latest . -- --template vanilla`
   - Configurer Tailwind via PostCSS (pas le CDN) avec ma palette `brand` / `accent` / Inter (cf. ARCHITECTURE.md §2).
   - Vérifier que `npm run dev` lance la maquette à l'identique.

2. **Découper `index.html` en modules ES**, sans changer le rendu :
   - `src/data/tree.json` ou `src/data/tree.js` : la constante `DATA` (machines + symptoms + nodes).
   - `src/screens/` : un fichier par écran (`splash.js`, `home.js`, `symptoms.js`, `diag.js`, `kb.js`, `history.js`).
   - `src/components/` : `media.js`, `progress.js`, etc.
   - `src/state.js` : l'objet `STATE` et la navigation `nav()`.
   - `src/main.js` : point d'entrée qui boote sur splash.

3. **Ajouter `vite-plugin-pwa`** :
   - `manifest.json` : nom "Logimatiq SAV", icône, theme color `#0F4C81`, mode `standalone`, orientation `portrait`.
   - Service worker en mode `autoUpdate`, stratégie `precache` pour l'app shell + `stale-while-revalidate` pour les futurs médias.
   - Tester l'installation (Chrome DevTools → Application → Manifest).

4. **Initialiser Git** et faire un premier commit propre.
   - `.gitignore` standard Node.
   - Commit messages en français, conventionnels (`feat:`, `fix:`, `chore:`).

5. **Préparer le déploiement Cloudflare Pages** :
   - Vérifier `npm run build` produit bien un `dist/`.
   - Me dire quoi faire ensuite côté Cloudflare (création du projet, branchement GitHub).

### Critères d'acceptation

- `npm run dev` ouvre la maquette à l'identique (pas de régression visuelle ni fonctionnelle).
- Toutes les branches du diagnostic EPIMAT restent cliquables jusqu'à la solution.
- L'historique en `localStorage` continue de fonctionner.
- Lighthouse PWA score > 90.
- Le projet est poussable sur GitHub et déployable en un clic sur Cloudflare Pages.

---

## 5. Sprints suivants (pour info — ne pas attaquer maintenant)

- **S2** : intégrer de vraies photos terrain (à fournir par moi) dans les nœuds existants.
- **S3** : compléter les arbres DistEPI / routeur GSM / badge / colonnes.
- **S4** : extraire la `DATA` vers Sanity Studio (CMS) pour que je puisse éditer sans toucher au code.
- **S5** : backend léger (auth + sync historique entre techniciens + création de tickets SAV).
- **S6** : dashboard analytique (top pannes, taux de résolution, MTTR par machine).

---

## 6. Conventions à respecter

- **Nommage** : `camelCase` pour les variables JS, `kebab-case` pour les fichiers, `snake_case` interdit.
- **Pas de framework UI** (shadcn, MUI, etc.) tant qu'on est en vanilla — Tailwind suffit.
- **Pas d'emoji dans le code** sauf si je le demande explicitement.
- **Commenter en français** quand le contexte métier l'exige (vocabulaire SAV : voyant, fusible, RJ45, DISTEPI, AUTOMAT INI...).
- **Garder le vocabulaire exact** des techniciens dans les questions affichées (cf. arbre Miro).
- Toujours **me proposer les choix techniques avant de les coder** quand il y a plus d'une option valable (ex: tree.json statique vs tree.js avec exports).

---

## 7. Question à me poser avant de commencer

Pose-moi ces 2 questions avant de lancer la moindre commande :

1. As-tu un compte GitHub prêt ? Veux-tu que je nomme le repo `logimatiq-sav` ou autre ?
2. Tu veux qu'on parte tout de suite sur React, ou on reste en Vanilla pour le Sprint 1 (recommandé pour ne pas réécrire la maquette) ?

Une fois ces réponses obtenues, attaque la tâche 1 du Sprint 1.
