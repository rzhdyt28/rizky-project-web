<script setup>
/** Galeri -- gaya "circles": thumbnail bulat 3 kolom (paginasi dari dispatcher), playful & ringan. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  pagedPhotos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="grid max-w-sm grid-cols-3 gap-3 mx-auto place-items-center">
    <button
      v-for="p in pagedPhotos" :key="p.id"
      type="button" class="p-0 border-0 cursor-pointer c-gallery__circle-btn"
      @click="emit('open-flat', p._flatIndex)"
    >
      <img :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy" class="object-cover w-full h-full" />
    </button>
  </div>
</template>

<style scoped>
.c-gallery__circle-btn {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--t-gold, #b08d4a) !important;
  box-shadow: 0 10px 22px -12px rgba(0, 0, 0, 0.4);
}
</style>
