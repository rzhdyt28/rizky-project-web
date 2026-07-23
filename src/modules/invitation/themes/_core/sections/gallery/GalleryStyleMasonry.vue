<script setup>
/** Galeri -- gaya "masonry": susun bata (CSS columns), paginasi dari dispatcher. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  pagedPhotos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="max-w-md gap-2 mx-auto c-gallery__masonry columns-2">
    <button
      v-for="p in pagedPhotos" :key="p.id"
      type="button" class="block w-full p-0 mb-2 border-0 cursor-pointer break-inside-avoid"
      @click="emit('open-flat', p._flatIndex)"
    >
      <img
        :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
        class="object-cover w-full rounded-md"
      />
    </button>
  </div>
</template>
