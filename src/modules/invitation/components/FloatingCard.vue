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
});
</script>

<template>
  <component
    :is="as"
    class="g-card"
    :class="variant !== 'default' ? `g-card--${variant}` : null"
  >
    <slot />
  </component>
</template>

<style scoped>
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

/* GLASS — kaca buram: paling terlihat di atas foto Background Halaman.
   Sengaja TIDAK memakai --ov-card-bg (warna/opacity kartu global): warna
   itu untuk gaya 'default'/'flat' (kartu solid), sedangkan glass identik
   dengan efek buram-nya sendiri — kalau --ov-card-bg dipaksakan di sini,
   memilih "Glass" jadi terlihat sama saja dengan gaya lain saat admin sudah
   mengisi warna/opacity global (bug: ganti gaya kartu tidak kelihatan). */
.g-card--glass {
  background: rgba(255, 255, 255, 0.16);
  -webkit-backdrop-filter: blur(14px) saturate(1.25);
  backdrop-filter: blur(14px) saturate(1.25);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: var(--ov-card-shadow, 0 18px 40px -22px rgba(0, 0, 0, 0.3));
}
/* Browser tanpa backdrop-filter: naikkan opacity supaya teks tetap terbaca. */
@supports not (backdrop-filter: blur(1px)) {
  .g-card--glass { background: rgba(255, 255, 255, 0.82); }
}

/* OUTLINE — garis tepi tipis, isi nyaris transparan, tanpa shadow.
   Sama alasannya dengan glass: background TIDAK memakai --ov-card-bg,
   supaya tetap tampil "nyaris transparan" walau warna kartu global diisi. */
.g-card--outline {
  background: color-mix(in srgb, var(--t-paper, #fff) 55%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--t-accent, #555) 55%, transparent);
  box-shadow: none;
}

/* FLAT — permukaan polos tanpa shadow (minimalis). Kartu solid, jadi warna
   kartu global (--ov-card-bg) MEMANG relevan di sini — dipakai dari .g-card. */
.g-card--flat { box-shadow: none; }

/* GRADIENT — gradasi lembut paper -> sentuhan accent. TIDAK memakai
   --ov-card-bg (warna solid tunggal tak bisa menampilkan gradasi apa pun). */
.g-card--gradient {
  background: linear-gradient(
    165deg,
    var(--t-paper, #fff) 0%,
    color-mix(in srgb, var(--t-paper, #fff) 88%, var(--t-accent, #888)) 100%
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
