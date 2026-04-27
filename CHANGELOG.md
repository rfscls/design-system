# Changelog

Toutes les évolutions notables de `@eurofiscalis/design-system` sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et le projet respecte [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.5] — 2026-04-27

### Fixed
- **`.prose h3`** : `font-family: var(--ff-display)` (Fraunces) → **`var(--ff-body)` (Lato)**, `font-weight: 800 → 700`, `letter-spacing: -0.02em → -0.01em`.

### Why
Correction d'asymétrie : `h3` standard est en Lato 700, mais `.prose h3` était re-overridé en Fraunces 800. Ça faisait du h3 le seul niveau dont la police varie selon le contexte, contredisant la doc qui annonce "h3/h4 en Lato". On aligne sur le comportement attendu : tous les h3 du DS sont désormais en Lato 700, cohérents entre UI et lecture éditoriale. La distinction des sous-titres dans `.prose` reste assurée par la taille (28px max) et le poids 700.

## [1.0.4] — 2026-04-27

### Changed
- **Police body** : `Plus Jakarta Sans` → **`Lato`**. Plus lisible pour les articles et la lecture longue. Charger avec `family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700`.
- **Échelle typographique refondue autour d'un body 18px** (vs 17px précédemment). Toutes les classes éditoriales suivent un ratio modulaire ~1.2 :
  - `body p` : 17 / 1.65 → **18 / 1.6**
  - `.lead` : 19 / 1.6 → **21 / 1.5**
  - `h1` : `clamp(34, 5vw, 58)` → **`clamp(36, 5vw, 64)`**
  - `h2` : `clamp(30, 4.4vw, 50)` → **`clamp(32, 4.4vw, 54)`**
  - `h3` : `clamp(17, 2vw, 21)` → **`clamp(22, 2vw, 28)`** (correction d'incohérence : plancher remonté pour distinction claire avec le body)
  - `h4-h6` : 16 → **19** (correction d'incohérence : h4 ne doit jamais être < body)
  - `.caption` : 13 → **14**
  - `.eyebrow` : 11 → **12**
  - `.read-lg/md/sm/xs` : 19/17/15.5/13.5 → **20/18/16/14**
  - `.card p` : 14.5 → **15**
  - `.prose p` : 17 / 1.75 → **18 / 1.7**
  - `.prose h2` : `clamp(28, 3vw, 38)` → **`clamp(30, 3vw, 40)`**
  - `.prose h3` : 22 → **28**
  - `.prose li` : 16.5 → **18**
  - `.prose blockquote` : 17 → **18**
- Tous les `font-family: monospace` ou `'Courier New', monospace` inline ont été remplacés par `var(--ff-mono)` pour garantir JetBrains Mono partout (et éviter le fallback navigateur sur Menlo/Consolas/etc.).

### Documentation
- **Refactor complet de `design-system.html`** : la page de doc utilise maintenant les classes natives du DS (`.lead`, `.eyebrow.eyebrow-accent`, `.icode`, `.caption`) au lieu de classes custom propres à la doc (`.ds-section-sub`, `.ds-block-title`, `.ds-icode-name/-desc`). 207 remplacements de classes + 115 inline `font-size` retirés. La doc devient l'exemple ultime de l'usage du DS.
- `assets/design-system-doc.css` : tous les overrides typographiques retirés. Ne conserve que les contraintes structurelles (padding, margin, max-width). Override doc-only : `.ds-section .lead` est ramené à la taille de `.read-md` (18 / 1.7) pour ne pas surcharger les introductions de section.
- `README.md` enrichi avec une procédure consommateur claire (« Mettre à jour le DS dans un projet consommateur ») + procédure de rollback.

### Why
- **Lato** : lecture plus confortable sur des articles longs (`/blog/...`) que Plus Jakarta Sans, qui était plus typé interface dashboard.
- **Body 18px** : standard éditorial moderne (NYT, Stripe, Substack, Medium tournent à 18-21px). 17px commençait à montrer ses limites sur de la prose dense.
- **h4 ≥ body** : un titre, même mineur, ne doit jamais être plus petit que le texte qu'il chapeaute. Anti-pattern typographique corrigé.
- **JetBrains Mono partout** : sans `var(--ff-mono)` explicite, le navigateur tombe sur la mono système (Menlo macOS, Consolas Windows…). Fix global.

### Migration
Aucun changement d'API CSS — toutes les classes existantes restent supportées. **Mais l'impact visuel est significatif** (tailles, police, hiérarchie). Tester chaque page consommatrice après bump.

## [1.0.1] — 2026-04-24

### Changed
- **Middleware Vercel** : les assets consommables (`/assets/design-system.css`, `/assets/design-system.js`, `/assets/topo-generated.css`, `/img/brand/*`) sont désormais accessibles **sans authentification**. La doc HTML reste protégée (règles d'usage, matrices, decisions de brand).

### Why
Permet aux landings, emails, prototypes et apps externes d'importer le DS directement depuis `design-system.eurofiscalis.app` sans prompt de login. Pattern standard pour un DS distribué (cf Shadcn, Radix, Adobe Spectrum).

## [1.0.0] — 2026-04-24

Première version publiable.

### Added
- **`assets/design-system.js`** — companion JS a11y (12 kB, vanilla, auto-init). Couvre tabs, modal, dropdown, tooltip, alert, avatar, table, checkbox. Exposé via `window.DS`.
- **`@layer tokens, base, components, utilities`** — organisation CSS qui élimine les guerres de spécificité et permet aux consommateurs d'override naturellement.
- **`package.json`** + exports `./css`, `./js`, `./topo`, `./brand/*` — livrable via `file:` ou git dependency.
- **`README.md`** complet : installation, usage bundler/CDN, squelette HTML a11y, liste des composants, tokens, versioning.
- Note a11y sur le scaling typographique dans la section `#a11y` de la doc.

### Changed
- **Typographie en `rem`** — toutes les `font-size` et les tokens d'espacement `--s-1` à `--s-12` respectent désormais la taille de police utilisateur (réglage navigateur/OS). Les paddings, tailles de cibles et border-radii restent en `px` pour garantir les cibles tactiles WCAG 2.5.5.
- **Light mode unifié** — les 3 triggers historiques (`body.is-light`, `.f-light`, `.preview-box-lt`) sont remplacés par `:where(.is-light, .f-light)`. `.preview-box-lt` est supprimé du DS (doc-only).
- Table `th[data-sort]` expose maintenant `aria-sort` ("ascending" / "descending" / "none") via le JS.

### Removed
- **Variantes de palette expérimentales** (`body[data-palette="contrast|fiscal|forest|nocturne"]`) — la palette officielle est figée, ces overrides n'ont plus lieu d'être.

### Accessibility
- Focus management clavier complet sur tabs (←/→/Home/End + roving tabindex) et dropdowns (↑/↓/Home/End, focus du 1er item à l'ouverture).
- ARIA states (`role`, `aria-controls`, `aria-labelledby`, `aria-selected`, `aria-sort`) posés automatiquement par le JS — le consommateur n'a rien à déclarer côté HTML.
- `:where(.is-light, .f-light)` met la spécificité à zéro sur le trigger de thème, rendant les overrides consommateur plus prévisibles.
