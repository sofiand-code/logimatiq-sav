# Logimatiq SAV — Architecture & conception

Document d'accompagnement de la maquette `index.html`. Il décrit les choix de design, la structure de données, l'organisation des écrans et la trajectoire d'évolution vers une vraie application terrain.

---

## 1. Vision produit

Une application **mobile-first** qui guide pas à pas un technicien (ou un client en intervention rapide) dans le diagnostic d'une panne sur une machine Logimatiq (EPIMAT, DistEPI, routeur GSM, PC, badge, colonnes).

Trois usages, dans cet ordre de priorité :

1. **Diagnostic guidé** — l'utilisateur démarre sur la machine concernée, choisit un symptôme, répond à des questions et reçoit soit une procédure de résolution, soit une consigne d'escalade SAV.
2. **Base de connaissances** — recherche transversale par symptôme / pièce / procédure, avec accès aux tutoriels PDF, photos, vidéos courtes.
3. **Historique & statistiques** — chaque diagnostic terminé est archivé (chemin parcouru, réponses, issue) pour améliorer l'arbre dans le temps.

---

## 2. Design global

### Principes UX

- **Mobile-first strict** : viewport 375–414 px de référence, tous les éléments interactifs ≥ 44 px de hauteur (compatible doigts gantés).
- **Une seule action principale par écran** : un bouton CTA visible, secondaires en filaire.
- **Lisibilité terrain** : fort contraste, typographie Inter, fond clair par défaut (utilisation extérieure et atelier).
- **Retour d'état immédiat** : chaque tap a un feedback visuel (`active:scale-98`).
- **Toujours réversible** : bouton retour à chaque étape, "Quitter" explicite pendant un diagnostic.

### Système visuel

| Élément | Valeur |
|---|---|
| Couleur primaire | Bleu profond Logimatiq `#0F4C81` |
| Accent / CTA | Orange `#F59E0B` |
| Succès | Vert `#10B981` |
| Erreur / SAV | Rouge `#EF4444` |
| Neutres | Gamme `slate` Tailwind |
| Typo | Inter (system fallback) |
| Coins | `rounded-2xl` (16 px) sur cards et boutons |
| Ombres | très légères `shadow-sm`, jamais lourdes |

### Charte tonale

Phrases courtes, vocabulaire métier réel ("LED", "voyant", "RJ45", "DISTEPI"). Pas de jargon développeur côté utilisateur. On garde le vocabulaire **exact** de l'arbre Miro pour ne pas perturber les techniciens habitués.

---

## 3. Organisation des écrans

```
[Splash]
    ↓
[Accueil]  ──→  [Base de connaissances]
    │      ──→  [Historique]
    ↓
[Sélection symptôme] (par machine)
    ↓
[Diagnostic — boucle]
    ├── Question (avec média optionnel)
    ├── Action / Procédure (steps numérotés)
    └── Solution
          ├── Résolu → retour accueil
          └── Escalade SAV → "Créer un ticket"
```

Sept écrans principaux : Splash, Accueil, Symptômes, Diagnostic (polymorphe), Base de connaissances, Historique, et un viewer média implicite (PDF/vidéo) déclenché depuis les nodes.

---

## 4. Structure de données — du Miro au JSON

L'arbre Miro a été modélisé avec **trois types de nœuds** seulement, ce qui le rend simple à maintenir et à étendre par un non-développeur (ex: fichier JSON modifiable dans une interface admin future).

### Schéma

```jsonc
{
  "machines": [
    { "id": "epimat", "name": "EPIMAT", "icon": "machine", "color": "bg-brand-600" }
  ],

  "symptoms": {
    "epimat": [
      {
        "id": "t.epimat.screen",
        "title": "Écran noir / pas d'image / synchro",
        "category": "Affichage",
        "rootNode": "q1"
      }
    ]
  },

  "nodes": {
    "q1": {
      "type": "question",
      "title": "L'écran est-il noir ?",
      "help": "Regarde l'écran principal de la machine.",
      "media": { "type": "photo", "label": "..." },   // optionnel
      "answers": [
        { "label": "Oui", "next": "q2" },
        { "label": "Non", "next": "q10", "color": "green" }
      ]
    },

    "a_reset_open": {
      "type": "action",
      "title": "Réinitialiser et ouvrir la machine",
      "steps": [
        "Débrancher la machine",
        "Attendre 20 secondes",
        "Rebrancher la machine"
      ],
      "media": { "type": "video", "label": "Procédure (45 s)" },
      "next": "q_voyant"
    },

    "sol_change_pc": {
      "type": "solution",
      "outcome": "replace",       // "resolved" | "sav" | "replace" | "info"
      "title": "Changer le PC",
      "message": "Le PC ne démarre plus...",
      "sav": true                 // affiche le bouton "Créer un ticket SAV"
    }
  }
}
```

### Règles de modélisation

- Un **arbre = un point d'entrée** (`rootNode`) attaché à un symptôme. On peut avoir plusieurs arbres par machine (écran, modem, badge…).
- Une **question** a 2 à 4 réponses, chacune pointe vers un autre nœud (`next`).
- Une **action** liste des étapes numérotées et a **un seul** `next` (la suite logique : généralement une question "ça marche ?").
- Une **solution** est terminale. Elle déclenche l'enregistrement dans l'historique.
- Les **nœuds peuvent être réutilisés** entre arbres (`a_check_vga` est partagé entre la branche "vert + LED PC OK" et la branche "prob sync + LED PC OK").

### Pourquoi pas un format graphe (nodes + edges séparés) ?

Pour un arbre de cette taille (≈ 30 nœuds), le format "dictionnaire de nœuds avec `next` inline" est plus lisible et plus facile à éditer à la main. Si on dépasse 100 nœuds avec du croisement complexe, on bascule vers une vraie représentation graphe.

### Pipeline d'import depuis Miro

Court-terme, copier-coller manuel (déjà fait). Moyen-terme, possibilité d'utiliser l'API Miro pour exporter les sticky notes et leur position en JSON, puis transformer en `nodes` via un script Node simple. C'est cette voie qui rendra l'arbre maintenable sans toucher au code.

---

## 5. Médias dans le diagnostic

Chaque nœud peut porter **un seul** champ `media` (volontairement, pour ne pas surcharger l'écran). Trois types :

| Type | Usage typique |
|---|---|
| `photo` | Repérer un connecteur, un voyant, un emplacement physique |
| `video` | Procédure courte (< 60 s) — ouverture capot, remplacement fusible |
| `pdf` | Document de référence existant (Manuel EPIMAT, fiche badges Kalistrut…) |

Dans la maquette, les médias sont rendus en **placeholders réalistes** (pas de vrais fichiers) pour ne pas polluer le repo. En prod, ils pointeront vers :
- un bucket S3 / Cloudflare R2 pour les images et vidéos (versioning automatique)
- les PDF déjà existants dans le dossier (`Manuel Maintenance EPIMAT_eng.pdf`, `tuto EPIMAT.pdf`, etc.) servis via le backend.

Pour l'aspect **hors-ligne**, ces fichiers seront pré-cachés par le service worker au premier chargement (cf. §7).

---

## 6. Historique & analytics

À chaque solution atteinte, on enregistre dans `localStorage` (clé `logimatiq_sav_history_v1`) :

```json
{
  "date": "2026-05-07T14:30:00Z",
  "machineId": "epimat",
  "symptomId": "t.epimat.screen",
  "path": ["q1", "q2", "q3", "a_reset_open", "q_voyant", "a_change_fuse", "q_works_after_fuse", "sol_resolved"],
  "answers": ["Oui, écran noir", "Oui, branché", "Oui", "Procédure faite", "Éteint", "Procédure faite", "Oui"],
  "outcome": "resolved",
  "outcomeLabel": "Problème résolu"
}
```

Cela permet déjà côté terrain :
- Reprendre rapidement un diagnostic récent ("Bonjour, on rappelle pour la même panne")
- Voir le taux de résolution (affiché sur l'écran Historique)

Et préparer côté serveur (quand on aura un backend) :
- Quels nœuds sont des **culs-de-sac fréquents** → améliorer l'arbre
- Quelles **pièces de rechange** sont le plus souvent demandées → optimiser le stock SAV
- Quelles **machines** génèrent le plus de SAV → priorités produit

---

## 7. Architecture technique évolutive

L'architecture est volontairement **simple et progressive** : on peut rester en client-only longtemps, et basculer en client-serveur seulement quand le besoin apparaît.

### Étape 1 — PWA client-only (aujourd'hui)

```
┌────────────────────────────────────┐
│  index.html (Tailwind via CDN)     │
│  ├─ DATA = { machines, symptoms,   │
│  │          nodes }                │
│  ├─ Render fonctions vanilla JS    │
│  └─ Persistance: localStorage      │
└────────────────────────────────────┘
```

- Aucun backend.
- Déployable sur un Netlify / Vercel / GitHub Pages en 5 minutes.
- Hors-ligne via Service Worker (cache l'app entière + médias référencés).
- Suffisant pour 1 à 50 utilisateurs internes.

### Étape 2 — Données dynamiques

```
┌──────────────┐      ┌──────────────────┐
│   PWA        │──→   │  /api/trees.json │   (Vercel/Cloudflare Worker)
│              │      │  /api/media/...  │
└──────────────┘      └──────────────────┘
                              │
                       ┌──────────────┐
                       │ Headless CMS │   (Sanity / Strapi / Directus)
                       │  arbres +    │
                       │  médias      │
                       └──────────────┘
```

- L'arbre devient éditable par un non-dev via une interface CMS.
- Versioning des arbres (rollback possible).
- Toujours hors-ligne via cache.

### Étape 3 — Backend complet

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   PWA        │←→  │  API REST/GraphQL│←→  │  Postgres    │
│              │    │   (Node/Bun)     │    │  - users     │
│              │    │                  │    │  - tickets   │
│              │    │                  │    │  - history   │
└──────────────┘    └──────────────────┘    │  - trees     │
                                            └──────────────┘
```

- Authentification (SSO interne).
- Création de tickets SAV depuis l'app, suivi de leur cycle de vie.
- Synchronisation de l'historique entre techniciens.
- Tableau de bord analytique (taux de résolution par machine, MTTR, top pannes).

### Stack recommandée

| Couche | Choix | Pourquoi |
|---|---|---|
| Front | Vanilla JS + Tailwind (étape 1), React/Vite (étape 2+) | Simple à démarrer, montée en charge propre |
| Build | Vite | Rapide, simple, bonne PWA out-of-box |
| Hébergement | Cloudflare Pages / Vercel | Edge, gratuit jusqu'à pas mal d'usage |
| CMS | Sanity (cloud) ou Directus (self-host) | Édition simple par non-devs |
| Backend (étape 3) | Node + Hono ou Fastify, Postgres (Neon/Supabase) | Léger, rapide, bon support TypeScript |
| Stockage médias | Cloudflare R2 ou Supabase Storage | Pas cher, CDN global |

---

## 8. Hors-ligne (cache + sync)

Pattern **stale-while-revalidate** via Service Worker :

1. **App shell** (HTML, CSS, JS) → cache au premier chargement, servi en local au reload.
2. **Arbre + médias** → téléchargés au chargement initial du symptôme, servis depuis le cache si pas de réseau.
3. **Historique** → écrit en localStorage immédiatement (synchrone), poussé au backend (`POST /api/history`) dès que le réseau revient via une queue d'événements.

Le tout en ~80 lignes de SW. À ajouter dans une étape 1.5.

---

## 9. Roadmap proposée

| Sprint | Livrable |
|---|---|
| **S1** (en cours) | Maquette HTML cliquable validée par toi (ce repo) |
| **S2** | Service worker + manifeste PWA → installable sur mobile, fonctionne hors-ligne |
| **S3** | Vrais médias (photos terrain, 5 vidéos courtes) intégrés dans les nœuds existants |
| **S4** | Compléter les arbres DistEPI, GSM, badge, colonnes |
| **S5** | Migrer la data vers Sanity (CMS) — tu peux modifier l'arbre sans demander à un dev |
| **S6** | Backend léger : auth + sync historique + création de tickets |
| **S7** | Dashboard analytique (top pannes, taux résolution) |

---

## 10. Comment éditer l'arbre

Tant qu'on est en client-only, l'arbre est dans `index.html`, dans la constante `DATA.nodes`. Pour ajouter une question :

```js
DATA.nodes.q_new = {
  type: 'question',
  title: 'Ta nouvelle question ?',
  answers: [
    { label: 'Oui', next: 'sol_resolved' },
    { label: 'Non', next: 'sol_change_pc' }
  ]
};
```

Et brancher `next: 'q_new'` depuis le nœud parent.

C'est tout. On garde cette simplicité jusqu'à ce qu'on bascule sur un CMS.
