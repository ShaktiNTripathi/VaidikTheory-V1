/** True when the Vite build targets Vercel standalone demo (browser-only API). */
export function isStandaloneDemo(): boolean {
  return import.meta.env.VITE_STANDALONE === 'true';
}
