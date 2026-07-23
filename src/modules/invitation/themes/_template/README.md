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

Sejak refactor "1 file per gaya" (Fase 2), section yang punya beberapa
gaya tampilan TIDAK LAGI ditulis sebagai rantai `v-if`/`v-else-if` dalam
1 file — tiap gaya adalah file `.vue` tersendiri, dipilih oleh 1 file
"dispatcher" per section. Tambah gaya baru selalu 2-3 tempat, karena
backend (dropdown Filament) dan frontend (render) adalah 2 repo terpisah:

1. **Backend — `app/Filament/Support/ThemeOptionsSchema.php`** (repo
   `rizky-project`): tambah key baru ke const yang relevan, mis.
   `HERO_STYLES`, `EVENTS_STYLES`, `GALLERY_STYLES`, dst. File ini
   **satu-satunya sumber** daftar opsi gaya — dipakai `ThemeResource` DAN
   `InvitationLookResource` sekaligus, supaya pilihan yang admin lihat di
   dua form itu tidak pernah berbeda. Menambah key di sini otomatis
   memunculkannya di dropdown admin.
2. **Frontend — buat file gaya baru, daftarkan di dispatcher-nya**:
   - Section **bersama lintas-tema** (`_core/sections/<nama>/`, mis.
     countdown/love_story/events/gallery/couple): buat
     `<Section>Style<Nama>.vue` di folder section itu, import + daftarkan
     di map `STYLES` pada file dispatcher-nya (`<Section>.vue` di folder
     yang sama). State/UI yang dipakai LINTAS gaya (mis. lightbox foto,
     wrapper judul) hidup di dispatcher, DITERUSKAN ke anak lewat
     props/emit — jangan diduplikasi ke tiap file gaya.
   - **Hero** khusus per-tema (bukan `_core`), karena tidak semua tema
     mendukung banyak gaya hero — cuma `mildness` yang punya banyak varian
     hero saat ini (`themes/mildness/sections/hero/`, dispatcher
     `hero/Cover.vue`). Tema lain (`senja`) sengaja 1 layout hero tetap,
     TIDAK perlu folder `hero/` — kalau nanti tema itu juga mau banyak
     gaya hero, baru dipecah dengan pola yang sama.
   - Tidak semua tema wajib mendukung semua gaya section — kalau tema
     tidak mengimplementasikan suatu gaya, gaya itu tetap tersimpan di
     data tapi diabaikan tema itu (beri komentar biar developer lain tahu
     itu disengaja).
3. **`theme.css`** tema terkait: tambah class/style baru kalau varian
   gaya itu butuh tampilan visual di luar yang sudah ada.

Untuk gaya yang punya lebih dari satu kemungkinan nilai (enum), pastikan
dispatcher-nya punya fallback yang EKSPLISIT untuk nilai yang tidak
dikenal (jangan andalkan `?? Style<PertamaDiMap>` tanpa keterangan) —
lihat pola `KNOWN_HERO_STYLES` + `console.warn` di
`themes/mildness/sections/hero/Cover.vue` sebagai contoh.

## Checklist sebelum rilis tema
- [ ] Uji lebar 360px (WhatsApp in-app browser) SEBELUM desktop.
- [ ] Uji dengan & tanpa foto sampul, dengan & tanpa ornamen.
- [ ] Uji nama pasangan panjang (>15 huruf) — tidak boleh terpotong.
- [ ] Semua warna lewat CSS var `--t-*`, bukan hex hardcode.
- [ ] Tidak ada `:deep()` ke komponen _core — pakai class hook `c-*`.
