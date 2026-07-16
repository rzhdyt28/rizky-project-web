# Membuat Tema Baru

1. `cp -r _template nama-temamu` (atau copy folder elegant untuk mulai dari layout penuh)
2. Edit `Layout.vue` — atur nuansa: warna default, spacing, radius, animasi.
   Semua section diimpor dari `../shared/sections/` — JANGAN tulis ulang RSVP/galeri.
3. Ingin section tampil beda hanya di tema ini? Buat file di folder tema
   (mis. `nama-temamu/CustomGallery.vue`) lalu pakai itu di SECTION_MAP
   menggantikan versi shared.
4. Daftarkan di `../registry.js`:
   `namaTemamu: defineAsyncComponent(() => import('./nama-temamu/Layout.vue'))`
5. Di Filament: Themes -> Create -> component_key = nama folder, tier, default_options.

Props kontrak (SAMA semua tema): invitation, guestName, guestbook, slug,
can, labels, sectionOrder, sectionBg, globalBg, cover.
