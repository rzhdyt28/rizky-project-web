<script setup>
/**
 * GLOBAL — Slideshow background hero (v3).
 * Maks 3 foto (dibatasi juga di Filament — rekomendasi: 1 utama + 2 tambahan,
 * lebih dari itu memberatkan loading HP). Semua layer dirender bertumpuk dan
 * di-crossfade lewat opacity; efek 'kenburns' menambah zoom perlahan (ease)
 * pada layer aktif. Menghormati prefers-reduced-motion: berhenti di foto
 * pertama tanpa animasi.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { assetUrl } from '../composables/assets';

const props = defineProps({
  images:   { type: Array, default: () => [] },
  effect:   { type: String, default: 'fade' },   // fade|kenburns
  interval: { type: Number, default: 6 },        // detik per foto (4-12)
});

const active = ref(0);
let timer = null;

const list = computed(() => (props.images ?? []).filter(Boolean).slice(0, 3));

onMounted(() => {
  if (list.value.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  timer = setInterval(() => {
    active.value = (active.value + 1) % list.value.length;
  }, Math.min(12, Math.max(4, props.interval)) * 1000);
});
onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <div class="bgss" aria-hidden="true">
    <div
      v-for="(img, i) in list"
      :key="img"
      class="bgss__layer"
      :class="{ 'bgss__layer--active': i === active, 'bgss__layer--kenburns': effect === 'kenburns' && i === active }"
      :style="{ backgroundImage: `url(${assetUrl(img)})` }"
    />
  </div>
</template>

<style scoped>
.bgss { position: absolute; inset: 0; overflow: hidden; }
.bgss__layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.4s ease-in-out;
  will-change: opacity, transform;
}
.bgss__layer--active { opacity: 1; }
/* Ken Burns: zoom masuk perlahan selama layer aktif (ease). Durasi 14s
   sengaja lebih panjang dari interval maksimum supaya tak pernah "mentok". */
.bgss__layer--kenburns { animation: bgssZoom 14s ease-out forwards; }
@keyframes bgssZoom {
  from { transform: scale(1); }
  to   { transform: scale(1.09); }
}
@media (prefers-reduced-motion: reduce) {
  .bgss__layer { transition: none; }
  .bgss__layer--kenburns { animation: none; }
}
</style>
