import axios from 'axios';

/**
 * SATU-SATUNYA pintu ke backend. Semua modul memakai instance ini.
 * - Dev  : baseURL kosong -> Vite proxy meneruskan ke Laravel lokal.
 * - Prod : set VITE_API_URL=https://api.rizky.com di .env.production
 * withCredentials WAJIB true untuk Sanctum cookie-based auth.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
});

/** Panggil sekali sebelum login/register (mengambil cookie CSRF Sanctum). */
export function csrf() {
  return api.get('/sanctum/csrf-cookie');
}
