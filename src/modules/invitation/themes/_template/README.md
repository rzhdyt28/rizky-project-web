# Membuat Tema Baru

Satu tema = satu folder di `themes/`. Tidak menyentuh folder lain.

## Langkah
1. Copy folder `_template/` → rename jadi `themes/<component_key>/` (huruf kecil).
2. `Layout.vue`  : ganti class `theme-namatema` → `theme-<component_key>`.
3. `theme.css`   : ganti scope `.theme-namatema`, tulis semua gaya khas di sini.
4. `tokens.js`   : isi palet & font default tema.
5. `registry.js` : tambah 1 baris (layout + tokens).
6. Filament → Themes → Create → `component_key` sama persis.

## Membedakan satu section saja
Buat `sections/NamaSection.vue` di folder tema, lalu di Layout:
`<SectionRenderer :ctx="ctx" :overrides="{ countdown: MyCountdown }" ...>`
Kontrak props tiap section ada di `components/SectionRenderer.vue` (propsFor).

## Menambah varian gaya pada section (contoh: hero.style baru)

Setiap section yang punya beberapa "gaya tampilan" pilihan admin (hero,
mempelai, acara, countdown, kisah, galeri, dst) selalu perlu 2-3 tempat
disentuh — tidak ada tempat tunggal karena backend (yang menyediakan
pilihan di dropdown Filament) dan frontend (yang benar-benar merender
gaya itu) adalah dua repo terpisah:

1. **Backend — `app/Filament/Support/ThemeOptionsSchema.php`** (repo
   `rizky-project`): tambah key baru ke const yang relevan, mis.
   `HERO_STYLES`, `EVENTS_STYLES`, `GALLERY_STYLES`, dst. File ini adalah
   **satu-satunya sumber** daftar opsi gaya — dipakai oleh `ThemeResource`
   (tema, prefix `default_options.*`) dan `InvitationResource` (undangan,
   prefix `theme_options.*`) sekaligus, supaya pilihan yang admin lihat di
   dua form itu tidak pernah berbeda. Menambah key di sini otomatis
   memunculkannya di dropdown admin.
2. **Frontend — `themes/<nama-tema>/sections/<Section>.vue`** (repo ini):
   tambah cabang `v-else-if` baru yang merender gaya tersebut. **Ini
   dilakukan PER TEMA** — tiap tema (`senja`, `mildness`, dst) punya file
   Cover/section sendiri dan me-render sesuai kemampuannya masing-masing.
   Tidak semua tema wajib mendukung semua gaya: contohnya `senja` sengaja
   cuma satu layout hero tetap, sedangkan `mildness` punya 5 varian
   (`classic/framed/split/minimal/custom`) — itu keputusan desain per
   tema, bukan keharusan. Kalau sebuah tema tidak mengimplementasikan
   suatu gaya, pilihan itu tetap tersimpan di data tapi diam-diam
   diabaikan tema itu — beri komentar di file section-nya biar developer
   lain tahu itu memang disengaja (lihat contoh di `senja/sections/Cover.vue`).
3. **`theme.css`** tema terkait: tambah class/style baru kalau varian
   gaya itu butuh tampilan visual di luar yang sudah ada.

Untuk gaya yang punya lebih dari satu kemungkinan nilai (enum), pastikan
komponen Vue-nya punya fallback yang EKSPLISIT untuk nilai yang tidak
dikenal (jangan andalkan `v-else` polos tanpa keterangan) — lihat pola
`KNOWN_HERO_STYLES` + `console.warn` di
`themes/mildness/sections/Cover.vue` sebagai contoh.

## Checklist sebelum rilis tema
- [ ] Uji lebar 360px (WhatsApp in-app browser) SEBELUM desktop.
- [ ] Uji dengan & tanpa foto sampul, dengan & tanpa ornamen.
- [ ] Uji nama pasangan panjang (>15 huruf) — tidak boleh terpotong.
- [ ] Semua warna lewat CSS var `--t-*`, bukan hex hardcode.
- [ ] Tidak ada `:deep()` ke komponen _core — pakai class hook `c-*`.
