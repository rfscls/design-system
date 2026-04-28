# Eurofiscalis Design System

Design System officiel Eurofiscalis — tokens, composants et règles d'usage pour tous nos sites, apps et supports.

- **Tout en CSS vanilla** : pas de Sass, pas de PostCSS, aucun build step.
- **JS companion a11y** : 12 kB, vanilla, auto-init.
- **Surfaces** : `.f-deep`, `.f-dark`, `.f-light` + 5 textures empilables.
- **Accent brand** : `#5ECD8C`.

La doc visuelle complète est dans **`design-system.html`** (à ouvrir dans un navigateur).

---

## Installation

### 1 — Dépendance locale (monorepo ou repo frère)

Dans le `package.json` du projet consommateur :

```json
{
  "dependencies": {
    "@eurofiscalis/design-system": "file:../design-system"
  }
}
```

Puis `npm install`.

### 2 — Via tag Git (repo privé)

Ce package est **interne** et n'est pas publié sur le registre npm public. Pour l'installer depuis un autre projet, pointer directement sur un tag du repo privé :

```bash
npm install github:rfscls/design-system#v1.0.0
```

Ou dans le `package.json` :

```json
{
  "dependencies": {
    "@eurofiscalis/design-system": "github:rfscls/design-system#v1.0.0"
  }
}
```

---

## Usage

### Avec bundler (Next.js, Vite, Webpack…)

```js
// 1. CSS — à importer une fois, au point d'entrée (_app.tsx, main.ts…)
import '@eurofiscalis/design-system/css';

// 2. JS — à importer côté client, une fois
import '@eurofiscalis/design-system/js';
```

Le JS s'initialise **automatiquement** au `DOMContentLoaded`. Pour du contenu ajouté dynamiquement (modales, tabs créés en React par exemple), appeler :

```js
window.DS.init();           // réinitialise tout
window.DS.initTabs();       // ou ciblé par composant
window.DS.initDropdowns();
// initModals / initTooltips / initAvatars / initTables / initIndeterminate
```

### Sans bundler (HTML statique, CDN)

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700&family=Caveat:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/path/to/design-system.css">
  <script src="/path/to/design-system.js" defer></script>
</head>
```

### Logos officiels

```js
// Avec bundler
import logo from '@eurofiscalis/design-system/brand/logo-white.png';
```

La famille complète est listée dans la section `#logo` de la doc (`design-system.html`).

### Sprite SVG des icônes système

Les composants `.alert` (et plus tard d'autres) référencent des icônes via `<use href="#ico-X"/>` — il faut donc poser le sprite SVG une fois dans le `<body>` du consommateur.

#### Avec Astro / Vite (recommandé pour SSG)

```astro
---
import iconsSprite from '@eurofiscalis/design-system/icons.svg?raw';
---
<body>
  <Fragment set:html={iconsSprite} />
  <!-- reste du markup -->
</body>
```

Le `?raw` (Vite) importe le fichier comme string. `set:html` l'injecte au build → présent dans le HTML statique → indexable par les crawlers, pas de FOUC, compatible SSG.

#### Sans bundler (HTML statique)

Copier-coller directement le contenu de `node_modules/@eurofiscalis/design-system/assets/icons.svg` dans le `<body>` de la page.

#### Référencer une icône

```html
<svg><use href="#ico-check"/></svg>
```

4 IDs disponibles : `ico-check`, `ico-info`, `ico-warn`, `ico-danger`. Les 4 héritent de `currentColor` — la couleur est portée par le composant parent (`.alert-icon`, etc.).

---

## Squelette HTML a11y-compliant

Chaque page consommatrice du DS doit respecter ce squelette minimal :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Titre spécifique — Eurofiscalis</title>
  <!-- imports CSS/JS du DS -->
</head>
<body>
  <a href="#main" class="skip-link">Aller au contenu</a>
  <nav class="nav" aria-label="Navigation principale">…</nav>
  <main id="main">
    <h1>Titre de la page (un seul h1)</h1>
    <!-- contenu : hiérarchie h2 → h3 → h4, sans saut -->
  </main>
  <footer class="footer">…</footer>
</body>
</html>
```

**Ce que le consommateur DOIT ajouter** (le DS ne peut pas le faire pour toi) :

1. `<html lang="fr">` — langue de la page
2. `<main id="main">` autour du contenu principal
3. `<a href="#main" class="skip-link">` en **premier élément focusable** du `<body>`
4. `alt=""` sur toutes les `<img>` (vide pour les décoratives)
5. `<label for="…">` explicite sur chaque `<input>`
6. Hiérarchie des titres cohérente (un seul h1, pas de saut de niveau)
7. Audit Lighthouse/axe DevTools avant prod (score a11y ≥ 95)

Voir la section `#a11y` de la doc pour le détail.

---

## Composants

### Surfaces et textures

- `.f-deep` · `.f-dark` · `.f-light` — surfaces principales
- Patterns : `.bg-stars` · `.bg-dots` · `.bg-grid` · `.bg-topo` · `.bg-noise`
- Ambients : `.bg-halo` · `.bg-mint-glow` · `.bg-fade-deep` · `.bg-fade-dark` · `.bg-fade-light`
- **Règle** : max 1 pattern + 1 ambient par section. Fades uniquement entre deux surfaces sombres proches.

### Light mode

Deux triggers, un seul comportement :
- `<body class="is-light">` — page entière en thème clair
- `<section class="f-light">` — section en thème clair au milieu d'une page sombre

Le CSS unifie les deux via `:where(.is-light, .f-light)`.

### Liste des composants

| Composant | Classes principales | JS requis |
|---|---|---|
| Boutons | `.btn` + variantes (`-primary`, `-ghost`, `-glass`, `-holographic`…) | non |
| Labels / Chips | `.label`, `.chip` | non |
| Cards | `.card` + styles (`-glass`, `-outline`, `-tint`, `-duo`, `-dash`) | non |
| Alerts | `.alert`, `.alert-rich`, `.alert-compact` | close auto |
| Tabs | `.tabs`, `.tab-list`, `.tab`, `.tab-panel` | auto (clavier ←/→, Home, End) |
| Accordion | `.accordion` sur `<details>` | natif HTML |
| Tooltip | `.tooltip[data-tooltip]` | auto (aria-label) |
| Table | `.table`, `.table-data`, `.table-dense` | auto (select-all, sort) |
| Pagination | `.pagination` | non |
| Breadcrumb | `.breadcrumb` | non |
| Modal | `<dialog class="modal">` + `data-modal-open`/`data-modal-close` | auto (backdrop, ESC natif) |
| Loaders | `.progress`, `.skeleton`, `.spinner` | non |
| Dropdown | `.dropdown-menu[popover]` | auto (clavier ↑/↓, Home, End) |
| Avatar | `.avatar` | auto (couleur algo) |
| Form controls | `.field`, `.switch`, `.checkbox`, `.radio`, `.select` | `data-indeterminate` auto |

---

## Tokens CSS

Tous les tokens sont déclarés dans `:root`. Les plus utilisés :

```css
/* Surfaces */
--deep, --dark, --light, --warm

/* Brand */
--accent (#5ECD8C), --accent-2, --accent-dk, --teal, --teal2

/* Texte dark */
--head, --text, --muted

/* Texte light */
--lt-head, --lt-text, --lt-muted

/* Semantic */
--success, --warning, --danger, --info (+ -bg variantes)

/* Typo */
--ff-display (Fraunces), --ff-body (Lato), --ff-em (Georgia italic),
--ff-hand (Caveat), --ff-mono (JetBrains Mono)

/* Espacement (rem-based) */
--s-1 (0.25rem) … --s-12 (6.25rem)

/* Radii */
--r-sm (10px) … --r-2xl (32px), --r-pill
```

### Override d'un token

Le CSS est organisé en `@layer tokens, base, components, utilities`. Tout code CSS du consommateur (hors layer) gagne automatiquement :

```css
/* Dans le CSS du site consommateur */
:root {
  --accent: #7DE5A8;  /* override */
}
```

Plus d'infos dans la doc section `#colors`.

---

## Accessibilité

Ce que le DS gère automatiquement :
- Contraste AA (tokens `--muted` et `--lt-muted` ajustés pour 4.5:1)
- Focus visible (`:focus-visible` double ring sur les interactifs)
- Scale typographique (`font-size` en rem → respecte le réglage utilisateur)
- Reduced motion (`@media (prefers-reduced-motion: reduce)`)
- Navigation clavier complète sur tabs, dropdowns, modals, tables
- ARIA states (`aria-selected`, `aria-expanded`, `aria-sort`, `aria-label`) posés automatiquement par le JS
- Tap targets WCAG 2.5.5 (44×44 mini sur mobile)
- Helpers `.sr-only`, `.skip-link`

Ce que **le consommateur doit fournir** : voir section "Squelette HTML a11y-compliant" plus haut.

---

## Versioning et mise à jour

`@eurofiscalis/design-system` suit le [semver](https://semver.org/lang/fr/) :

- **Major** (2.0.0) — breaking change : renommage de classe, suppression de token, refactor des layers
- **Minor** (1.1.0) — ajout de composant, ajout de variante, nouveau token
- **Patch** (1.0.1) — correction visuelle, ajustement de contraste, fix JS

### Mettre à jour le DS dans un projet consommateur

Procédure standard, à appliquer dans n'importe quelle app qui dépend du DS (webb, etc.) :

1. **Lire le `CHANGELOG.md`** du DS pour la version cible — savoir ce qui change avant d'installer.
2. **Bumper le tag** dans le `package.json` du consommateur :
   ```json
   "@eurofiscalis/design-system": "git+ssh://git@github.com/rfscls/design-system.git#v1.0.4"
   ```
3. **Réinstaller** : `pnpm install` (ou `npm install`). Le lockfile fige le commit hash → reproductible.
4. **Tester en dev** : `pnpm dev`, parcourir les pages clés (article, home, services). Pour un bump **minor** ou **major**, prévoir un test plus large.
5. **Commit** avec un message explicite : `chore: bump @eurofiscalis/design-system v1.0.3 → v1.0.4`.

### En cas de régression visuelle

Le tag git rend le rollback trivial — il suffit de remettre l'ancien tag dans `package.json` et de `pnpm install`. Aucune dépendance transitive ne bouge, c'est immédiat.

Reporter ensuite le bug au mainteneur du DS (cf. section Mainteneur). Les patches correctifs sont prioritaires.

### Pour le mainteneur du DS

Workflow détaillé (bump, tag, push, rollback, hotfix) : voir [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Mainteneur

Max Comet ([mcomet@eurofiscalis.com](mailto:mcomet@eurofiscalis.com)) — questions, bugs, demandes de nouveau composant.

Pas de PR attendue des consommateurs — le DS est prescriptif, pas collaboratif.

Pour le workflow de release (bump, tag, propagation), voir [CONTRIBUTING.md](CONTRIBUTING.md).
