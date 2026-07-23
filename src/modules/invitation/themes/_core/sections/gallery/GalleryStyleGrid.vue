<script setup>
/** Galeri -- gaya "grid": kotak rapi 2 kolom (paginasi dari dispatcher). */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  pagedPhotos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="grid max-w-md grid-cols-2 gap-2 mx-auto c-gallery__grid">
    <button
      v-for="p in pagedPhotos" :key="p.id"
      type="button" class="p-0 border-0 cursor-pointer"
      @click="emit('open-flat', p._flatIndex)"
    >
      <img
        :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
        class="object-cover w-full rounded-md aspect-square"
      />
    </button>
  </div>
</template>
