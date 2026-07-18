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

## Checklist sebelum rilis tema
- [ ] Uji lebar 360px (WhatsApp in-app browser) SEBELUM desktop.
- [ ] Uji dengan & tanpa foto sampul, dengan & tanpa ornamen.
- [ ] Uji nama pasangan panjang (>15 huruf) — tidak boleh terpotong.
- [ ] Semua warna lewat CSS var `--t-*`, bukan hex hardcode.
- [ ] Tidak ada `:deep()` ke komponen _core — pakai class hook `c-*`.
