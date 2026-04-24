# Changelog

Toutes les évolutions notables de `@eurofiscalis/design-system` sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et le projet respecte [Semantic Versioning](https://semver.org/lang/fr/).

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
