/**
 * Lightweight client-side route manager for MOMSARASA
 * Supports /dashboard, / and hash #/dashboard
 */

export type AppRoute = 'home' | 'dashboard';

export function getRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    pathname.includes('/dashboard') ||
    hash.includes('dashboard') ||
    search.includes('page=dashboard')
  ) {
    return 'dashboard';
  }
  return 'home';
}

export function navigateTo(path: '/dashboard' | '/') {
  if (typeof window === 'undefined') return;
  try {
    window.history.pushState({}, '', path);
  } catch {
    // If pushState is restricted in iframe, fallback to hash
    window.location.hash = path === '/dashboard' ? '#/dashboard' : '#/';
  }
  window.dispatchEvent(new Event('route-change'));
}
