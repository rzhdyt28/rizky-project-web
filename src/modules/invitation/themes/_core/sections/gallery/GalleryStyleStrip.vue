<script setup>
/** Galeri -- gaya "strip": satu baris scroll horizontal (scroll-snap) -- native swipe di HP, tanpa perlu tombol/paginasi. */
import { assetUrl } from '../../../../composables/assets';

/* Tidak butuh paged-photos (scroll native dari `photos` penuh, tanpa
   paginasi) -- inheritAttrs:false supaya tidak bocor jadi atribut DOM. */
defineOptions({ inheritAttrs: false });

defineProps({
  photos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="flex gap-3 px-4 pb-2 mx-auto overflow-x-auto max-w-md c-gallery__strip">
    <button
      v-for="(p, i) in photos" :key="p.id"
      type="button" class="flex-shrink-0 p-0 border-0 cursor-pointer c-gallery__strip-item"
      @click="emit('open-flat', i)"
    >
      <img :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy" class="object-cover w-full h-full" />
    </button>
  </div>
</template>

<style scoped>
.c-gallery__strip {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.c-gallery__strip-item {
  width: 68vw;
  max-width: 15rem;
  aspect-ratio: 3 / 4;
  border-radius: 1rem;
  overflow: hidden;
  scroll-snap-align: center;
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
</style>
