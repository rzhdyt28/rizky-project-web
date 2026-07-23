<script setup>
/** Galeri -- gaya "framed": 1 kolom, foto besar dengan bingkai ornamen ganda (paginasi dari dispatcher). */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  pagedPhotos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="grid max-w-xs gap-6 mx-auto">
    <button
      v-for="p in pagedPhotos" :key="p.id"
      type="button" class="p-0 border-0 cursor-pointer c-gallery__framed-btn"
      @click="emit('open-flat', p._flatIndex)"
    >
      <img :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy" class="object-cover w-full aspect-[4/5]" />
    </button>
  </div>
</template>

<style scoped>
.c-gallery__framed-btn {
  padding: 0.5rem;
  border-radius: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--t-gold, #b08d4a) 55%, transparent) !important;
  box-shadow: inset 0 0 0 4px color-mix(in srgb, var(--t-paper, #fff) 90%, transparent), 0 16px 34px -18px rgba(0, 0, 0, 0.4);
}
</style>
