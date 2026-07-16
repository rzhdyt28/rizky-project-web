/** Path file dari Filament (storage) atau URL penuh -> URL yang bisa dirender. */
export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/storage/${path}`;
}
