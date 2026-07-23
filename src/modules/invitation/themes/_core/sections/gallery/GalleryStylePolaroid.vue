<script setup>
/** Galeri -- gaya "polaroid": kartu foto bertepi putih, miring selang-seling. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  pagedPhotos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);
</script>

<template>
  <div class="grid max-w-md grid-cols-2 gap-4 mx-auto c-gallery__polaroid">
    <button
      v-for="p in pagedPhotos" :key="p.id"
      type="button"
      class="p-2 pb-6 bg-white border-0 cursor-pointer c-gallery__polaroid-item"
      :class="p._flatIndex % 2 === 0 ? 'rotate-[-2.5deg]' : 'rotate-[2.5deg]'"
      @click="emit('open-flat', p._flatIndex)"
    >
      <img
        :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
        class="object-cover w-full aspect-square"
      />
      <span v-if="p.caption" class="mt-1 block truncate text-[11px] text-neutral-600">{{ p.caption }}</span>
    </button>
  </div>
</template>

<style scoped>
.c-gallery__polaroid-item {
  border-radius: 4px;
  box-shadow: 0 12px 26px -14px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease;
}
.c-gallery__polaroid-item:hover { transform: rotate(0deg) scale(1.03); }
</style>
