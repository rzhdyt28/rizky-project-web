# _template — Menambah modul frontend baru

Kembaran dari `app/Modules/_template` di repo API. Langkah:

1. Copy folder ini: `cp -r src/modules/_template src/modules/toko`
2. Buat halaman di `src/modules/toko/pages/TokoHome.vue`
3. Daftarkan route di `src/router/index.js`:
   ```js
   { path: '/toko', component: () => import('../modules/toko/pages/TokoHome.vue') },
   ```
4. Fetch data lewat client bersama:
   ```js
   import { api } from '../../shared/api/client';
   const { data } = await api.get('/api/toko/products');
   ```
5. Komponen yang dipakai lintas modul taruh di `src/shared/components/`.

Aturan: modul TIDAK boleh mengimpor file dari modul lain — hanya boleh dari
`shared/`. Ini menjaga tiap modul tetap bisa dilepas-pasang.
