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

export default function middleware(request: Request): Response | undefined {
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
