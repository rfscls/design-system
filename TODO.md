# TODO — Design System

Backlog des pistes d'amélioration du DS. Ajouter les idées ici pour les retrouver à la prochaine session.

---

## Perf — sortir la texture `topo` du CSS (SVG inline → fichier externe)

**Fichier concerné** : `assets/topo-generated.css` (~122 KB), généré par le topo-generator.

**Constat** : le CSS définit deux variables `:root { --topo-dark / --topo-light }` qui contiennent chacune un **gros SVG inline en data-URI** (motif topographique). Ces variables sont consommées par `.bg-topo::after { background-image: var(--topo-dark) }` dans `design-system.css`.

**Problème** :
- Ces ~122 KB sont si lourds qu'ils **ne peuvent pas** être chargés globalement (côté conso `webb`, l'import global faisait tomber Lighthouse perf de 100 → 84). Résultat : chaque projet doit importer `@eurofiscalis/design-system/topo` **par page** (code-split manuel), ce qui est fragile et facile à oublier — vécu côté `webb` : 9 pages avaient un hero `.bg-topo` sans charger la texture (motif silencieusement absent).
- Comme c'est du data-URI dans le CSS, la texture est **ré-embarquée dans le bundle CSS de chaque route** qui l'importe → pas de mutualisation, pas de cache HTTP dédié.

**Piste** : servir le motif en **fichier `.svg` externe** (`background-image: url('.../topo-dark.svg')`) plutôt qu'en data-URI dans une variable CSS.
- ✅ Fichier **cacheable une seule fois** pour tout le site, quel que soit le nombre de routes.
- ✅ Le CSS `.bg-topo` redevient **léger** → potentiellement importable globalement, ce qui **supprimerait** le besoin d'import par page (et donc la classe de bug de l'oubli).
- ⚠️ À vérifier : chemin de l'asset selon le bundler du consommateur (Astro/Vite), et thème dark/light (2 fichiers ou 1 avec `currentColor`/mask).

**Priorité** : nice-to-have. Non bloquant, mais bon combo perf + robustesse (fait disparaître le couplage manuel classe ↔ import).

*(Remonté depuis le projet `webb`, 2026-07-08.)*
