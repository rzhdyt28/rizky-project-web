<script setup>
/** Kisah Kami -- gaya "letter": tiap kisah tampil ala surat/postcard, foto kecil di pojok. */
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
  <div class="grid max-w-md gap-6 mx-auto">
    <article v-for="story in stories" :key="story.id" class="c-story__letter">
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="c-story__letter-photo-btn"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="object-cover w-full h-full" />
      </button>
      <div class="text-left">
        <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{{ dateLong(story.happened_at) }}</p>
        <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-script, var(--t-font-head))' }">{{ story.title }}</h4>
        <p class="text-sm italic leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.c-story__letter {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.1rem;
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--t-paper, #fff) 92%, var(--t-accent, #888) 8%);
  border: 1px solid color-mix(in srgb, var(--t-gold, #b08d4a) 30%, transparent);
}
.c-story__letter-photo-btn {
  flex-shrink: 0;
  width: 4.5rem; height: 4.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 0; padding: 0; cursor: pointer;
}
.c-story__date  { color: var(--el-date-color, var(--t-gold, #b08d4a)); font-size: var(--el-date-size); }
.c-story__title { color: var(--el-name-color, var(--t-accent)); font-size: var(--el-name-size); }
.c-story__text  { color: var(--el-text-color); font-size: var(--el-text-size); }
</style>
