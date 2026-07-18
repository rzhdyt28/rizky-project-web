<script setup>
/**
 * GLOBAL — Ornamen sudut. Kalau `image` diisi (upload/pustaka aset dari
 * Filament), pakai gambar itu; kalau kosong, fallback ke SVG floral
 * ORISINAL bawaan (bentuk dasar kelopak+daun, bukan aset unduhan).
 * Warna SVG ikut CSS var tema, jadi otomatis serasi di tema mana pun.
 */
import { assetUrl } from '../composables/assets';

defineProps({
  corner: { type: String, default: 'tl' }, // tl | tr | bl | br
  image:  { type: String, default: null },
});
</script>

<template>
  <img
    v-if="image"
    :src="assetUrl(image)"
    alt=""
    class="g-floral pointer-events-none absolute select-none object-contain"
    :class="`g-floral--${corner}`"
  />
  <svg
    v-else
    viewBox="0 0 220 220"
    class="g-floral pointer-events-none absolute select-none"
    :class="`g-floral--${corner}`"
  >
    <g fill="none" stroke="var(--t-accent)" stroke-width="1.1" opacity="0.55">
      <path d="M10 120 Q 40 60 90 40 Q 130 24 150 10" />
      <path d="M20 150 Q 55 95 100 75" />
      <path d="M35 170 Q 70 130 95 105" />
    </g>
    <g opacity="0.9">
      <ellipse cx="55" cy="55" rx="26" ry="18" fill="var(--t-paper)" stroke="var(--t-accent)" stroke-width="1.2" transform="rotate(20 55 55)" />
      <ellipse cx="70" cy="42" rx="20" ry="14" fill="var(--t-gold)" opacity="0.35" stroke="var(--t-accent)" stroke-width="1" transform="rotate(-15 70 42)" />
      <circle cx="60" cy="52" r="9" fill="var(--t-gold)" opacity="0.5" />
    </g>
    <g opacity="0.85">
      <ellipse cx="105" cy="30" rx="14" ry="10" fill="var(--t-paper)" stroke="var(--t-accent)" stroke-width="1" transform="rotate(10 105 30)" />
      <circle cx="105" cy="30" r="5" fill="var(--t-gold)" opacity="0.55" />
    </g>
    <g opacity="0.7">
      <ellipse cx="30" cy="95" rx="12" ry="9" fill="var(--t-paper)" stroke="var(--t-accent)" stroke-width="1" transform="rotate(-25 30 95)" />
      <circle cx="30" cy="95" r="4" fill="var(--t-gold)" opacity="0.5" />
    </g>
    <g fill="var(--t-accent)" opacity="0.3">
      <ellipse cx="45" cy="130" rx="7" ry="16" transform="rotate(35 45 130)" />
      <ellipse cx="80" cy="95" rx="6" ry="13" transform="rotate(-10 80 95)" />
      <ellipse cx="120" cy="55" rx="6" ry="13" transform="rotate(60 120 55)" />
    </g>
  </svg>
</template>

<style scoped>
/* Ukuran responsif: mobile dulu, membesar di tablet/desktop.
   Tema bisa menyetel via --floral-size di theme.css. */
.g-floral {
  width: var(--floral-size, 7rem);
  height: var(--floral-size, 7rem);
}
@media (min-width: 640px)  { .g-floral { width: var(--floral-size-sm, 9rem);  height: var(--floral-size-sm, 9rem); } }
@media (min-width: 768px)  { .g-floral { width: var(--floral-size-md, 13rem); height: var(--floral-size-md, 13rem); } }
@media (min-width: 1024px) { .g-floral { width: var(--floral-size-lg, 15rem); height: var(--floral-size-lg, 15rem); } }

.g-floral--tl { left: 0; top: 0; }
.g-floral--tr { right: 0; top: 0; transform: scaleX(-1); }
.g-floral--bl { left: 0; bottom: 0; transform: scaleY(-1); }
.g-floral--br { right: 0; bottom: 0; transform: scale(-1, -1); }
</style>
