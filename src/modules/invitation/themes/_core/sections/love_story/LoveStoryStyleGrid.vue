<script setup>
/** Kisah Kami -- gaya "grid": mosaic foto 2 kolom, judul+teks singkat di bawah tiap foto. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  stories:    { type: Array, default: () => [] },
  showPhotos: { type: Boolean, default: false },
});
defineEmits(['open-lightbox']);

function dateLong(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
</script>

<template>
  <div class="grid max-w-lg gap-5 mx-auto sm:grid-cols-2">
    <article v-for="story in stories" :key="story.id" class="text-center">
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="block w-full p-0 mb-3 overflow-hidden border-0 cursor-pointer rounded-xl"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-square w-full object-cover" />
      </button>
      <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{{ dateLong(story.happened_at) }}</p>
      <h4 class="mb-1 text-base c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
      <p class="text-xs leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
    </article>
  </div>
</template>

<style scoped>
.c-story__date  { color: var(--el-date-color, var(--t-gold, #b08d4a)); font-size: var(--el-date-size); }
.c-story__title { color: var(--el-name-color, var(--t-accent)); font-size: var(--el-name-size); }
.c-story__text  { color: var(--el-text-color); font-size: var(--el-text-size); }
</style>
