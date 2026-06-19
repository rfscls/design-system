# Changelog

Toutes les évolutions notables de `@eurofiscalis/design-system` sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et le projet respecte [Semantic Versioning](https://semver.org/lang/fr/).

## [1.2.4] — 2026-06-19

### Fixed
- **Rognage du glyphe italique (suite de 1.2.3)** — `0.12em` ne suffisait pas pour le débordement de l'italique Fraunces à taille display (le crochet supérieur du « f » restait coupé). Valeur portée à `0.28em` sur `h1 em,h2 em`. Sans incidence de layout : la marge négative associée compense intégralement, donc surdimensionner ne décale rien.

## [1.2.3] — 2026-06-19

### Fixed
- **Rognage du dernier glyphe italique des `<em>` de titres** — les `<em>` de `h1`/`h2` sont peints avec `background-clip:text; color:transparent` (gradient brand). En italique, `background-clip:text` rogne la peinture sur la chasse des glyphes : le jambage penché du dernier caractère (ex. le « f » de « take care of », ou un mot brand en fin de titre) était coupé à droite (bug WebKit/Blink). Ajout de `padding-right:0.12em; margin-right:-0.12em` sur `h1 em,h2 em` : la boîte du clip englobe désormais le débordement, et la marge négative compense pour ne décaler ni le texte qui suit (cas des `<em>` en milieu de titre) ni l'alignement.

### Migration
Aucune.

## [1.2.2] — 2026-06-15

### Fixed
- **Alignement du menu sur le footer** — la gouttière latérale du menu était portée par le conteneur interne (`.mx`/`.mx-lg`, `padding-inline:clamp(20px,4vw,48px)`), alors que le footer la porte par son bandeau (`.footer`), `.footer-inner` n'ayant aucun padding. Conséquence : sur grand écran, le contenu du menu était rentré d'environ 48px par rapport au contenu du footer (ex. à 1440px : menu à x=128, footer à x=80). La gouttière passe désormais sur le bandeau `.nav` et `.nav .mx`/`.nav .mx-lg` ont `padding-inline:0` → le contenu du menu s'aligne exactement sur celui du footer (au ras de la boîte `--w-container`).

### Migration
Aucune. Le contenu du menu se décale vers les bords pour s'aligner sur le footer.

## [1.2.1] — 2026-06-15

### Changed
- **Largeur de conteneur unique portée à 1280px** — `--w-container` passe de 1200px à 1280px, soit la largeur déjà utilisée par `.mx-lg` sur la majorité des pages (home, blog, glossaire, hubs…). `.mx`, `.mx-lg` et `.footer-inner` valent maintenant tous 1280px : le menu, le contenu et le footer ont exactement la même largeur sur **toutes** les pages, quel que soit le `containerSize`. `.mx` et `.mx-lg` sont désormais identiques.

### Migration
Aucune migration de code. Le contenu et le footer des pages qui n'étaient pas déjà en `.mx-lg` s'élargissent de 1200px à 1280px.

## [1.2.0] — 2026-06-15

### Added
- **Tokens de largeur de conteneur** — `--w-container` (1200px), `--w-container-sm` (880px), `--w-container-lg` (1280px) dans `:root`. Source de vérité unique pour les largeurs de layout : `.mx`, `.mx-sm`, `.mx-lg` et `.footer-inner` consomment désormais ces tokens.

### Changed
- **`.mx` aligné sur `.footer-inner` (1140px → 1200px)** — le conteneur standard `.mx` (contenu de page + menu de navigation) était plus étroit que le footer (`.footer-inner`, 1200px), créant un désalignement des bords entre le chrome (header/footer) et le contenu sur toutes les pages. `.mx` passe à 1200px : header, contenu et footer partagent maintenant exactement la même largeur. `.mx-lg` (1280px, pages éditoriales 3 colonnes) et `.mx-sm` (880px) inchangés.

### Migration
Aucune migration de code. Le contenu des pages utilisant `.mx` s'élargit de 60px — vérifier les mises en page tendues (héros, grilles serrées) calibrées pour 1140px.

## [1.1.3] — 2026-05-11

### Fixed
- **`.card h3` et `.card p` dans `.f-deep`/`.f-dark`/`.hero`** — le fix 1.1.1/1.1.2 sur les headings ne couvrait pas les `.card h3` et `.card p` à cause d'une règle plus spécifique du DS : `:where(.is-light, .f-light) .card h3 { color: --lt-head }` (spécificité 0,1,1) battait `.f-deep :is(h1...)` (0,1,1) à égalité ou inférieure selon l'ordre. Résultat : sur les pages avec `body.is-light`, les titres et descriptions des `.card` à l'intérieur d'une section `.f-deep`/`.f-dark` restaient en couleur sombre, illisibles.

Réinversions ajoutées avec spécificité supérieure (0,2,1) :
- `.f-deep .card h3, .f-dark .card h3, .hero .card h3 { color: var(--head) }`
- `.f-deep .card :is(h1,h2,h4,h5,h6), ... { color: var(--head) }`
- `.f-deep .card p, .f-dark .card p, .hero .card p { color: var(--text) }`

### Migration
Aucune. Les consommateurs qui forçaient localement la couleur des `.card h3`/`.card p` dans leurs sections sombres peuvent retirer ces overrides.

## [1.1.2] — 2026-05-11

### Fixed
- **Extension du fix 1.1.1 au composant `.hero`** — le `.hero` pose son propre fond gradient sombre intégré (radial deep + teal + accent) mais n'est ni `.f-deep` ni `.f-dark`. Du coup, sous un `body.is-light`, ses headings et son body text restaient en couleurs claires (lt-head / lt-text) → invisibles sur le fond sombre du hero.

`.hero` ajouté aux trois règles posées en 1.1.1 :
- `.hero :is(h1...) { color: var(--head) }`
- `.hero :is(h1,h2) em { background: gradient accent lumineux }`
- `.hero { color: var(--text) }` + `.hero .sub { color: var(--text) }`

### Migration
Aucune. Si vous patchiez localement la couleur du h1 dans votre hero pour le faire ressortir sur fond sombre, vous pouvez retirer cet override.

## [1.1.1] — 2026-05-11

### Fixed
- **Headings & body text dans `.f-deep`/`.f-dark` imbriqués sous `body.is-light`** — quand une section `.f-deep` ou `.f-dark` était posée à l'intérieur d'un `<body class="is-light">` (cas courant : page principalement claire avec quelques sections sombres), les `h1`–`h6` héritaient de `:where(.is-light, .f-light) :is(h1,...) { color: --lt-head }` → couleur sombre sur fond sombre, quasi-invisible. Idem pour les `<em>` brand qui prenaient le gradient `accent-dk` (foncé, prévu pour fond clair) au lieu du gradient `accent`/`accent-2` lumineux. Et idem pour le body text (`<p>`, `.sub`) qui restait en `--lt-text`.

Trois règles ajoutées qui re-forcent la couleur appropriée pour la surface locale :
- `.f-deep :is(h1...), .f-dark :is(h1...) { color: var(--head) }`
- `.f-deep :is(h1,h2) em, .f-dark :is(h1,h2) em { background: gradient accent lumineux }`
- `.f-deep, .f-dark { color: var(--text) }` + `.f-deep .sub, .f-dark .sub { color: var(--text) }`

### Why
Le DS posait `:where(.is-light, .f-light)` sur `<body>` mais ne prévoyait pas la situation inverse : surface sombre imbriquée dans un body clair. La spécificité `(0,1,1)` des nouvelles règles bat le `(0,0,1)` du sélecteur d'origine, peu importe l'ordre dans la cascade.

### Migration
Aucune action requise. Les consommateurs qui patchaient manuellement la couleur de leurs headings sur `.f-deep`/`.f-dark` peuvent retirer ces overrides.

## [1.1.0] — 2026-05-04

### Added
- **Variante éditoriale `.prose .alert`** — quand un `.alert` (callout) vit dans un contexte `.prose`, il adopte automatiquement le look "callout d'expertise" : layout grid icône+contenu, fond teinté doux, sans bordure ni ombre, radius 14px. Couleurs AA-compliant (≥6:1) par variante via `--alert-c` / `--alert-c-soft` :
  - default (success) = `#1f6238` sur fond vert 10%
  - `.alert-warn` = `#8a5202` sur fond ambre 10%
  - `.alert-danger` = `#8a1414` sur fond rouge 10%
  - `.alert-info` = `#1e3a8a` sur fond bleu 10%

### Why
Ce style était dupliqué dans `BlogDetailPage.astro` (et sur le point de l'être dans `GlossaireDetailPage.astro`). `.prose` et `.alert` sont tous deux des composants DS — la composition mérite d'être canonique. Tout `.alert` à l'intérieur d'un `.prose` hérite désormais du même look éditorial, sans patch côté consommateur.

### Migration
Aucune action requise. Les pages qui scopaient leurs overrides `.alert` à un wrapper local (`.article-body-col` etc.) peuvent désormais retirer ces blocs — le DS prend le relais via `.prose .alert`.

## [1.0.15] — 2026-05-04

### Fixed
- **Aération interne des callouts (`.alert`) dans `.prose`** : la règle `.prose p { margin-bottom: 22px }` cassait la mise en page des `<p>` à l'intérieur d'un `.alert-body`. Override ajouté pour neutraliser ce margin et rétablir un espacement propre (10px) uniquement entre `<p>` consécutifs.

### Why
Dupliqué jusqu'ici dans chaque page consommatrice (`BlogDetailPage`, `GlossaireDetailPage`). `.prose` et `.alert` sont tous deux des composants DS — la collision doit être résolue à la source.

## [1.0.14] — 2026-04-30

### Changed
- **`.lead` passe de `1.3125rem` (21px) à `1.25rem` (20px)** : taille du chapô / lead paragraph légèrement réduite. Garde le contraste typo avec le body (`1.125rem` / 18px) — ratio 1.11 — sans paraître surdimensionné.

### Why
Sur les pages article (template Astro consommateur), un chapô à 22px (override local) puis 21px (`.lead` DS) paraissait trop pesant face au body 18px. 20px conserve la hiérarchie « lead vs body » tout en restant discret. Convention éditoriale standard (NYT/Medium font 18-20 sur leur lead).

### Migration
Aucune. Les usages de `.lead` rapetissent légèrement (1px) — différence visuelle imperceptible sur la majorité des écrans. Si un consommateur souhaitait l'ancienne valeur, override local : `font-size: 1.3125rem`.

## [1.0.11] — 2026-04-29

### Changed
- **Reset curseur étendu à tous les éléments interactifs natifs** : la règle ne couvre plus seulement `a[href]` mais aussi `button:not(:disabled)`, `[role="button"]:not([aria-disabled="true"])`, `summary`, `label[for]`, et tous leurs descendants. Approche philosophique « si c'est interactif, c'est pointer ».

### Why
Sur les navigateurs modernes (Chrome/Firefox), `<button>` natif a `cursor: default` par défaut (UA stylesheet) — contre-intuitif. La classe `.btn` du DS posait `cursor: pointer`, mais un `<button>` brut sans `.btn` (form natif, dropdown trigger, etc.) restait en flèche. Idem pour `<summary>`, `<label for>`, et les éléments avec `role="button"` qui ne sont pas des `<button>` natifs (divs ARIA-isés). Les apps consommatrices se retrouvaient à patcher au cas par cas. Cette règle systémique élimine la classe entière de bugs.

Les états désactivés (`[disabled]`, `[aria-disabled="true"]`) sont volontairement exclus pour préserver leur `cursor: not-allowed`.

### Migration
Aucune. Tout élément qui devait être `pointer` l'est désormais sans intervention. Les workarounds locaux (cursor: pointer manuel dans les composants apps) deviennent redondants et peuvent être retirés.

## [1.0.10] — 2026-04-29

### Changed
- **Reset curseur sur `a[href]` simplifié** : la règle `a[href] *{cursor:inherit}` (v1.0.9) est remplacée par `a[href],a[href] *{cursor:pointer}`. La chaîne d'héritage `inherit` pouvait être fragile selon l'ordre des `@layer` après bundling Vite/Astro et ne propageait pas systématiquement le `pointer` jusqu'aux feuilles. La règle directe garantit le bon curseur sur tous les descendants d'un lien actif.

### Why
Les apps consommatrices reportaient encore des cas où le curseur restait en I-beam sur du texte enfant d'une card cliquable malgré v1.0.9. La cause probable : `cursor: inherit` peut être écrasé par la valeur initiale `auto` si une règle non-layered intervient quelque part dans la cascade. La règle directe ne souffre pas de ce risque.

### Migration
Aucune. Comportement identique pour tous les liens, plus robuste.

## [1.0.9] — 2026-04-29

### Fixed
- **Curseur `pointer` manquant sur les `<a href>` qui wrappent du contenu riche** : ajout dans le reset (`@layer base`) de `a[href] { cursor: pointer }` et `a[href] * { cursor: inherit }`. Les liens natifs ont déjà `cursor:pointer` via la stylesheet UA, mais sur un pattern « stretched link » (ex. card cliquable wrappant `<p>`, `<h3>`...), le navigateur affichait l'I-beam contextuel sur le texte enfant au lieu du pointer. Le force désormais à la propagation explicite.

### Why
Pattern récurrent dans les apps consommatrices (author cards, article cards, country cards) : on enveloppe une carte entière dans un `<a>` pour tout rendre cliquable. Sans ce reset, l'utilisateur voit alternativement la main et la flèche/I-beam selon où il survole — affordance brouillée. Le fix est défensif et ne touche pas les `<a>` sans `href` (ancres décoratives, placeholders) qui restent au comportement par défaut.

### Migration
Aucune. Les consommateurs qui posaient un workaround `cursor: pointer` en local peuvent le retirer (devient redondant), mais aucun changement obligatoire.

## [1.0.8] — 2026-04-28

### Fixed
- **Cascade `@layer` sur les titres en mode light** : suppression de deux règles dupliquées dans `@layer utilities` (`:where(.is-light, .f-light) :is(h2,h3){color:var(--lt-head)}` et `:where(.is-light, .f-light) .sub{color:var(--lt-muted)}`). Ces règles étaient déjà définies dans `@layer base` (lignes 216 et 235) — leur promotion en utilities cassait la cascade pour les composants comme `.cta-final h2` qui définissent leur propre couleur (`var(--head)` blanc) en `@layer components`.

### Why
Un `.cta-final` au sein d'une page `body.is-light` rendait son `<h2>` en `var(--lt-head)` (noir) au lieu de `var(--head)` (blanc), parce qu'`utilities > components` dans la cascade des layers. Le composant a un fond intrinsèquement dark — son `<h2>` doit rester blanc, peu importe le mode global de la page. Symptôme visible : titre quasi illisible sur le bloc CTA fin d'article.

### Migration
Aucun impact sur l'API. Les consommateurs qui dépendaient de la priorité élevée de ces règles (override `h2 { color: red }` sans layer dans leur CSS) doivent maintenant utiliser `@layer base` ou augmenter leur specificity. Cas de figure rare et anti-pattern.

## [1.0.7] — 2026-04-28

### Added
- **Spacing inter-blocs dans `.prose`** — règle `.prose > .table-wrap, .prose > figure, .prose > .alert { margin: 30px 0 }`. Ces blocs « insertions » (tables, figures, callouts) reçoivent maintenant un rythme vertical cohérent avec `blockquote` au lieu de coller au paragraphe précédent.

### Why
Sans cette règle, dans un article qui enchaîne « paragraphe → table → callout », les blocs s'empilaient sans respiration. Le rythme typographique d'un texte de lecture longue exige une rupture visuelle nette autour des éléments non-textuels.

## [1.0.6] — 2026-04-28

### Added
- **`assets/icons.svg`** — sprite SVG des 4 icônes système (`ico-check`, `ico-info`, `ico-warn`, `ico-danger`) utilisées par `.alert` et ses variantes. Disponible via l'export `@eurofiscalis/design-system/icons.svg`.
- Section **« Sprite SVG des icônes système »** dans le README, avec le pattern d'import recommandé pour Astro/Vite (`?raw` + `<Fragment set:html>`) et la procédure HTML statique.

### Why
Les composants `.alert` du DS référencent les icônes via `<use href="#ico-X"/>`. Jusqu'ici, chaque consommateur devait dupliquer le sprite SVG dans son markup (cf. la doc HTML qui le pose inline en haut du `<body>`). Cette duplication était fragile et empêchait les évolutions du DS d'icônes de se propager. Le sprite est maintenant un asset officiel du package.

### Migration
Aucune ancienne API cassée. Côté consommateur, remplacer un sprite SVG dupliqué par :

```astro
import iconsSprite from '@eurofiscalis/design-system/icons.svg?raw';
<Fragment set:html={iconsSprite} />
```

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
