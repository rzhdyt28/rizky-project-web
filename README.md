# rizky-project-web

Frontend Vue 3 **terpisah** dari backend. Semua data diambil via API
(`rizky-project-api`) menggunakan fetch/axios + Sanctum cookie auth.

## Struktur — satu modul, satu folder

```
src/
├── shared/                    # dipakai bersama SEMUA modul
│   ├── api/client.js          # SATU pintu axios ke backend (+ csrf())
│   ├── stores/auth.js         # Pinia: login/register/me/logout
│   └── components/            # komponen lintas modul
├── router/index.js            # sadar-domain: rizky.com vs <slug>.rizky.com
└── modules/                   # SATU FOLDER = SATU PROJECT
    ├── landing/               # landing page kustom (bukan Filament)
    ├── portfolio/             # portofolio bilingual ID/EN
    ├── invitation/            # undangan publik + tema plug&play + composables
    ├── dashboard/             # login + dashboard user pemilik undangan
    ├── agent-monitoring/      # panel monitoring auto-apply agent
    └── _template/             # COPY INI untuk project baru (baca README-nya)
```

Aturan modul: hanya boleh mengimpor dari `shared/`, tidak boleh dari modul lain.

## Menjalankan (dev)

```bash
npm install
npm run dev            # http://localhost:5173
```

Vite dev-server otomatis mem-proxy `/api` dan `/sanctum` ke Laravel lokal
(`http://127.0.0.1:8000`) — jadi tidak perlu setting CORS saat dev, cukup
jalankan `php artisan serve` di repo API.

## Peta domain (produksi, semua di VPS)

| Domain                | Isi                              |
|-----------------------|----------------------------------|
| rizky.com             | landing, /portfolio, /dashboard  |
| <slug>.rizky.com      | undangan tenant (router deteksi subdomain) |
| custom-domain klien   | undangan tenant (Pola C)         |
| api.rizky.com         | Laravel API (repo satunya)       |
| admin.rizky.com/admin | Filament                         |

Build produksi diatur `VITE_API_URL` + `VITE_CENTRAL_HOSTS`
(lihat `.github/workflows/deploy.yml`). Nginx menyajikan folder `dist/`
sebagai static — konfigurasi lengkap ada di repo API `deploy/nginx/`.

## Deploy

Push ke `main` → GitHub Actions build → rsync `dist/` ke
`/var/www/rizky-project-web/` di VPS. Secrets yang dibutuhkan sama dengan
repo API: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.
