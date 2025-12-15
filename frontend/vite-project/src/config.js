// Primary backend URL - Vite exposes variables at build time via `import.meta.env`.
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_URL = BACKEND_URL;

export function api(path) {
  // ensure leading slash
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_URL}${path}`;
}

export default API_URL;
