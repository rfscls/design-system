# Workflow mainteneur

Ce document décrit le processus pour faire évoluer `@eurofiscalis/design-system` et propager les changements aux projets consommateurs. Tu es le seul mainteneur — ce workflow est pour ton futur toi.

---

## TL;DR — checklist rapide

Pour n'importe quelle modif :

1. Édite `assets/design-system.css` (ou `design-system.js`, `design-system.html` pour la doc).
2. Ouvre `design-system.html` dans le navigateur pour vérifier le rendu.
3. Décide du type de bump : **patch** · **minor** · **major** (voir Versioning).
4. Mets à jour `version` dans `package.json`.
5. Ajoute une entrée dans `CHANGELOG.md`.
6. `git add . && git commit -m "…"`.
7. `git tag vX.Y.Z && git push && git push --tags`.
8. Préviens les consommateurs (bump côté app).

---

## Versioning (semver)

| Bump | Quand | Exemple |
|---|---|---|
| **patch** (1.0.0 → 1.0.1) | Correction visuelle, fix JS, ajustement de contraste, typo dans la doc, rien qui casse l'existant | Fix d'un hover cassé, correction d'un contraste AA |
| **minor** (1.0.0 → 1.1.0) | Ajout sans breaking : nouveau composant, nouvelle variante, nouveau token, nouvelle utility | `.btn-toast`, `.card-compact-sm`, token `--accent-3` |
| **major** (1.0.0 → 2.0.0) | Breaking change : renommage de classe publique, suppression de token, changement de comportement JS, refactor des `@layer` | `.btn-primary` → `.btn-solid`, suppression de `.card-dash` |

**Règle d'or** : un consommateur doit pouvoir `npm update` sans rien changer dans son code, sauf au passage d'un major.

### Déprécier avant de supprimer

Pour un breaking change (ex. renommer `.card-glass` en `.card-frost`) :

1. **Version N** (minor) : ajouter `.card-frost` en gardant `.card-glass` comme alias. Noter la dépréciation dans le CHANGELOG.
2. **Version N+1 ou N+2** (major) : retirer `.card-glass`.

Ça donne aux consommateurs une fenêtre pour migrer.

---

## Workflow détaillé

### 1. Faire la modif

```bash
cd /Users/max/Dev/design-system

# Ouvrir la doc pour vérifier visuellement
open design-system.html
# ou lancer un serveur statique
python3 -m http.server 8080
```

Vérifications à faire à l'œil :
- La section concernée rend bien en dark ET en light (`.f-light`)
- Les `.preview-box` dans `design-system.html` ne sont pas cassés
- Rien dans la console navigateur (pas de 404 sur une classe supprimée dans la doc)

### 2. Bumper la version

```bash
# Dans package.json — édite la clé "version"
# ou avec npm :
npm version patch   # ou minor, major
# npm version crée aussi le tag git automatiquement (voir plus bas)
```

**Attention** : `npm version` crée un commit ET un tag automatiquement. Si tu veux faire plusieurs modifs avant de tagger, édite juste le `package.json` à la main et tag manuellement à l'étape 5.

### 3. Mettre à jour le CHANGELOG

Ajoute un bloc en haut de `CHANGELOG.md` :

```md
## [1.0.1] — 2026-05-12

### Fixed
- Contraste du `.btn-ghost-lt` sur fond `.f-light` passé de 3.8:1 à 4.6:1.

### Changed
- `:root` : `--muted` ajusté de `#7C9289` à `#7F9590` pour meilleure lisibilité AA.
```

Sections standards :
- `Added` — nouveau
- `Changed` — modif non-breaking
- `Deprecated` — marqué à supprimer
- `Removed` — supprimé (major)
- `Fixed` — correction
- `Security` — vulnérabilité

### 4. Commit

```bash
git add -A
git commit -m "v1.0.1 — fix contraste btn-ghost-lt sur f-light"
```

Convention de message : `vX.Y.Z — résumé en une ligne`. Pas de Co-Authored-By (instruction globale).

### 5. Tag et push

```bash
git tag -a v1.0.1 -m "Release v1.0.1 — voir CHANGELOG.md"
git push
git push --tags
```

Le tag **doit correspondre exactement** à la version dans `package.json`. Sinon le `github:rfscls/design-system#v1.0.1` pointera dans le vide.

### 6. Vérifier sur GitHub

```bash
gh repo view rfscls/design-system --web
# ou
gh release create v1.0.1 --notes-from-tag
```

Optionnel mais propre : créer une GitHub Release depuis le tag, elle sera visible dans la UI du repo et dans les notifications des consommateurs.

---

## Propagation aux consommateurs

Les projets qui dépendent du DS pointent vers un tag git :

```json
{
  "dependencies": {
    "@eurofiscalis/design-system": "github:rfscls/design-system#v1.0.0"
  }
}
```

### Mise à jour manuelle côté consommateur

Dans chaque app qui consomme le DS :

```bash
# 1. Bumper le tag dans package.json
# "github:rfscls/design-system#v1.0.0" → "#v1.0.1"

# 2. Réinstaller
npm install

# 3. Rebuilder / redéployer
npm run build
```

### Astuce — `npm install` sans modifier package.json

```bash
npm install github:rfscls/design-system#v1.0.1
```

Ça met à jour `package.json` et `node_modules` en une commande.

### Préviens les consommateurs

Pour les bumps **minor** et **major**, préviens les équipes/toi-même qui maintiennent les apps. Pour les **patch**, ils peuvent rester sur leur version — ils migrent à leur rythme.

---

## Rollback

Si tu publies une version cassée :

### Option 1 — revert + nouveau patch (recommandé)

```bash
git revert <commit-cassé>
# bumper en 1.0.2 (ou 1.0.Y+1)
# re-tagger
git tag -a v1.0.2 -m "Revert v1.0.1 — …"
git push && git push --tags
```

Propre, historique préservé, consommateurs bumpent vers 1.0.2.

### Option 2 — supprimer le tag (à éviter)

```bash
# Supprime local et distant
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
```

**Ne fais ça que si personne n'a encore tiré le tag**. Sinon leurs `npm install` vont casser.

---

## Cas particuliers

### Hotfix sur une version plus ancienne

Les consommateurs restés sur `1.0.0` ne peuvent pas prendre un correctif qui part du `main` actuel si tu as déjà sorti des `1.1.x`.

Dans ce cas :

```bash
# Créer une branche depuis le tag ancien
git checkout -b hotfix/1.0.x v1.0.0
# Appliquer le fix
# Tagger v1.0.1
git tag -a v1.0.1 -m "Hotfix …"
git push origin hotfix/1.0.x --tags
# Revenir sur main et cherry-pick si le fix s'y applique aussi
git checkout main
git cherry-pick <commit-hotfix>
```

Rare dans ton cas, mais sache que la voie existe.

### Breaking change pressé

Si tu DOIS casser vite (ex. faille de sécurité dans un composant) :

1. Sors le correctif en **major** (ex. `v2.0.0`).
2. Dans le CHANGELOG, documente clairement **ce qui casse** et **comment migrer**.
3. Préviens individuellement chaque consommateur.

### Modif de la doc seule

Si tu ne touches qu'à `design-system.html` (correction de typo, meilleure description), c'est un **patch**. La doc fait partie du livrable mais n'affecte pas le comportement du DS.

### Modif de logos (`img/brand/`)

**Breaking potentiel** : si tu remplaces le fichier, les consommateurs qui font `import logo from '.../brand/logo-white.png'` prennent la nouvelle version automatiquement. Si tu renommes, c'est breaking → **major**.

---

## Règles d'hygiène

- **Pas de commit direct sans tag** sur `main` pour une version distribuable — ça crée des versions fantômes que les consommateurs ne peuvent pas pinner. Soit tu commits-et-tu-tagues, soit tu bosses sur une branche.
- **Le `main` = toujours buildable** — ne commit pas un CSS cassé ou un JS qui throw, même en work-in-progress.
- **Une release par commit** — n'accumule pas 5 fixes en un seul bump. Plusieurs petits patches valent mieux qu'un mega-patch.
- **CHANGELOG tenu à jour à CHAQUE release** — pas rétroactivement 3 mois plus tard, tu ne te rappelleras plus.
- **Teste sur un projet consommateur** avant un bump **minor** ou **major**. Au moins une fois, sur une page réelle.

---

## Aide-mémoire commandes

```bash
# Éditer puis vérifier
open design-system.html

# Checker ce qui va partir dans le package
npm pack --dry-run

# Bumper + commit + tag en une commande (npm s'en charge)
npm version patch   # → 1.0.0 → 1.0.1, crée tag v1.0.1

# Push tout
git push && git push --tags

# Voir les tags existants
git tag -l

# Voir le diff entre deux versions
git diff v1.0.0 v1.0.1

# Créer une GitHub Release depuis le tag (optionnel mais propre)
gh release create v1.0.1 --notes-from-tag
```
