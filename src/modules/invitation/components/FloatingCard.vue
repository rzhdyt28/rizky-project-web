<script setup>
/**
 * GLOBAL — Kartu mengambang yang dipakai lintas tema.
 * Tampilan detail (radius, bayangan, warna) dikendalikan CSS var sehingga
 * tiap tema bisa menyetel lewat theme.css-nya tanpa menyentuh file ini:
 *   --card-bg, --card-radius, --card-shadow
 * `variant` = gaya kartu dari Filament (theme_options.card.style):
 *   default | glass | outline | flat | gradient | stamp
 */
defineProps({
  as:      { type: String, default: 'div' },
  variant: { type: String, default: 'default' },
  /* URL foto (sudah di-resolve assetUrl oleh pemanggil) untuk mode "Foto di
     dalam kartu" per-section (theme_options.sections.$key.card_photo_mode). */
  photo:   { type: String, default: null },
});
</script>

<template>
  <component
    :is="as"
    class="g-card"
    :class="[variant !== 'default' ? `g-card--${variant}` : null, photo ? 'g-card--photo' : null]"
    :style="photo ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : null"
  >
    <div class="g-card__inner">
      <slot />
    </div>
  </component>
</template>

<style scoped>
/* Foto DI DALAM kartu ("Foto di dalam kartu" per section di Filament):
   ::before jadi scrim gelap tipis di atas foto supaya isi (judul/teks) tetap
   terbaca, konten asli didorong ke lapis atas lewat .g-card__inner. */
.g-card--photo { position: relative; color: #fff; }
.g-card--photo::before {
  content: '';
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
}
.g-card__inner { position: relative; z-index: 1; }

.g-card {
  overflow: hidden;
  /* Prioritas: override admin (--ov-*) > default tema (--card-*) > default global.
     Untuk tema yang MENDEKLARASI --card-* di theme.css-nya (mis. mildness),
     override sudah dikonsumsi di sana; baris ini menjaga tema yang TIDAK
     mendeklarasi --card-* (mis. elegant/rustic) tetap menghormati override. */
  background: var(--ov-card-bg, var(--card-bg, var(--t-paper, #fff)));
  /* RADIUS PER SUDUT (v3): --ov-card-rtl/rtr/rbl/rbr (dari Filament, per
     sudut) > --ov-card-radius (radius tunggal lama) > --card-radius (tema). */
  border-top-left-radius:     var(--ov-card-rtl, var(--ov-card-radius, var(--card-radius, 1.25rem)));
  border-top-right-radius:    var(--ov-card-rtr, var(--ov-card-radius, var(--card-radius, 1.25rem)));
  border-bottom-left-radius:  var(--ov-card-rbl, var(--ov-card-radius, var(--card-radius, 1.25rem)));
  border-bottom-right-radius: var(--ov-card-rbr, var(--ov-card-radius, var(--card-radius, 1.25rem)));
  box-shadow: var(--ov-card-shadow, var(--card-shadow, 0 18px 40px -22px rgba(0, 0, 0, 0.35)));
}

/* ===== VARIAN GAYA KARTU (dipilih dari Filament: card.style) =====
   Tiap varian menimpa background/border/shadow-nya sendiri, tapi tetap
   menghormati override warna admin (--ov-card-bg) bila diisi. */

/* GLASS — kaca buram. Warna kartu (--ov-card-bg) dipakai sebagai TINT dasar
   di balik efek blur (bukan warna solid penuh) supaya "Warna Kartu" tetap
   kelihatan berubah, tapi ciri khas glass (buram/transparan) tidak hilang.
   Saturate diturunkan (dari 1.25 -> 1.05) supaya warna tint admin lebih
   DOMINAN dibanding warna-warna dari background foto/video yang nge-blur
   di baliknya -- kalau butuh 100% solid tanpa campuran latar sama sekali,
   pakai override "Warna kartu section ini" (per-section) atau gaya
   Default/Flat. */
.g-card--glass {
  background: var(--ov-card-bg, rgba(255, 255, 255, 0.16));
  -webkit-backdrop-filter: blur(14px) saturate(1.05);
  backdrop-filter: blur(14px) saturate(1.05);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: var(--ov-card-shadow, 0 18px 40px -22px rgba(0, 0, 0, 0.3));
}
/* Browser tanpa backdrop-filter: naikkan opacity supaya teks tetap terbaca. */
@supports not (backdrop-filter: blur(1px)) {
  .g-card--glass { background: var(--ov-card-bg, rgba(255, 255, 255, 0.82)); }
}

/* OUTLINE — garis tepi tipis, isi nyaris transparan, tanpa shadow.
   --ov-card-bg (kalau diisi) di-mix ke transparan (65%, dinaikkan dari 55%
   supaya warna admin lebih dominan), jadi "Warna Kartu" tetap terasa
   sebagai tint lembut tanpa membuat outline jadi solid. */
.g-card--outline {
  background: var(--ov-card-bg, color-mix(in srgb, var(--t-paper, #fff) 55%, transparent));
  border: 1.5px solid color-mix(in srgb, var(--t-accent, #555) 55%, transparent);
  box-shadow: none;
}

/* FLAT — permukaan polos tanpa shadow (minimalis). Kartu solid, jadi warna
   kartu global (--ov-card-bg) MEMANG relevan di sini — dipakai dari .g-card. */
.g-card--flat { box-shadow: none; }

/* GRADIENT — gradasi lembut warna-dasar -> sentuhan accent. Warna dasarnya
   ikut --ov-card-bg kalau diisi (jatuh ke --t-paper kalau kosong), supaya
   "Warna Kartu" tetap mengubah nuansa gradasinya. */
.g-card--gradient {
  background: linear-gradient(
    165deg,
    var(--ov-card-bg, var(--t-paper, #fff)) 0%,
    color-mix(in srgb, var(--ov-card-bg, var(--t-paper, #fff)) 88%, var(--t-accent, #888)) 100%
  );
}

/* STAMP — tepi bergerigi ala perangko. Dua lapis mask (union/add):
   lapis 1 = kotak solid untuk INTERIOR (inset 2r dari tepi), lapis 2 = pola
   lubang yang pusat lingkarannya TEPAT di garis tepi (offset -2r) sehingga
   hanya menggigit takik setengah-lingkaran di pinggir — interior tak bolong. */
.g-card--stamp {
  --stamp-r: 6px;
  border-radius: 4px;
  box-shadow: none;
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.18));
  -webkit-mask-image:
    linear-gradient(#000 0 0),
    radial-gradient(circle, transparent calc(var(--stamp-r) - 0.5px), #000 var(--stamp-r));
  mask-image:
    linear-gradient(#000 0 0),
    radial-gradient(circle, transparent calc(var(--stamp-r) - 0.5px), #000 var(--stamp-r));
  -webkit-mask-size:
    calc(100% - var(--stamp-r) * 4) calc(100% - var(--stamp-r) * 4),
    calc(var(--stamp-r) * 4) calc(var(--stamp-r) * 4);
  mask-size:
    calc(100% - var(--stamp-r) * 4) calc(100% - var(--stamp-r) * 4),
    calc(var(--stamp-r) * 4) calc(var(--stamp-r) * 4);
  -webkit-mask-position: center, calc(var(--stamp-r) * -2) calc(var(--stamp-r) * -2);
  mask-position: center, calc(var(--stamp-r) * -2) calc(var(--stamp-r) * -2);
  -webkit-mask-repeat: no-repeat, round;
  mask-repeat: no-repeat, round;
}
</style>
