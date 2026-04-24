/**
 * HTTP Basic Auth via Vercel Edge Middleware.
 * Protège toute la doc hormis les endpoints internes Vercel.
 *
 * Env vars requises :
 *   SITE_USER      — login (défaut : "eurofiscalis")
 *   SITE_PASSWORD  — mot de passe partagé
 *
 * Si SITE_PASSWORD n'est pas défini, l'auth est désactivée (fallback ouvert).
 */
export const config = {
  matcher: '/((?!_next/|_vercel/|favicon.ico).*)',
};

// Assets publics — consommables sans auth depuis n'importe quel site
// (landings, emails, prototypes, apps externes qui importent le DS).
// La doc HTML reste protégée — seule la mécanique publique est ouverte.
const PUBLIC_PATHS = new Set([
  '/assets/design-system.css',
  '/assets/design-system.js',
  '/assets/topo-generated.css',
]);
const PUBLIC_PREFIXES = ['/img/brand/'];

export default function middleware(request: Request): Response | undefined {
  const pathname = new URL(request.url).pathname;

  // Whitelist publique — skip auth
  if (PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return;
  }

  const expectedUser = process.env.SITE_USER || 'eurofiscalis';
  const expectedPass = process.env.SITE_PASSWORD;

  // Pas de mot de passe configuré → laisse passer (deploy preview initial)
  if (!expectedPass) return;

  const auth = request.headers.get('authorization');

  if (auth && auth.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(':');
    const user = idx >= 0 ? decoded.slice(0, idx) : '';
    const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
    if (user === expectedUser && pass === expectedPass) {
      return; // Accès autorisé
    }
  }

  return new Response('Authentification requise', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Eurofiscalis Design System", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
