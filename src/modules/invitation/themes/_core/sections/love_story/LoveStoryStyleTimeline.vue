<script setup>
/** Kisah Kami -- gaya "timeline": garis putus-putus vertikal + penanda hati, kartu foto+teks tiap simpul. */
import { assetUrl } from '../../../../composables/assets';
import { vReveal } from '../../../../composables/useReveal';

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
  <div class="relative max-w-md mx-auto c-story__timeline">
    <span class="c-story__spine" aria-hidden="true" />
    <article
      v-for="story in stories" :key="story.id"
      v-reveal="{ preset: 'fade-up', y: 36 }"
      class="relative pb-10 text-center c-story__tl-item last:pb-0"
    >
      <span class="relative z-10 grid mx-auto mb-4 c-story__node place-items-center">♥</span>
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="block w-full max-w-xs p-0 mx-auto mb-3 overflow-hidden border-0 cursor-pointer c-story__tl-card"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-[4/5] w-full object-cover" />
      </button>
      <div class="max-w-xs mx-auto" :class="{ 'c-story__tl-card c-story__tl-card--text px-4 py-4': !(showPhotos && story.photo) }">
        <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
          {{ dateLong(story.happened_at) }}
        </p>
        <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
        <p class="text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.c-story__date  { color: var(--el-date-color, var(--t-gold, #b08d4a)); font-size: var(--el-date-size); }
.c-story__title { color: var(--el-name-color, var(--t-accent)); font-size: var(--el-name-size); }
.c-story__text  { color: var(--el-text-color); font-size: var(--el-text-size); }

.c-story__spine {
  position: absolute;
  top: 0.5rem; bottom: 0.5rem; left: 50%;
  width: 0; border-left: 2px dotted color-mix(in srgb, var(--t-accent) 45%, transparent);
  transform: translateX(-50%);
  z-index: 0;
}
.c-story__node {
  width: 1.9rem; height: 1.9rem; border-radius: 9999px;
  background: var(--t-paper); color: var(--t-accent);
  border: 1.5px solid color-mix(in srgb, var(--t-accent) 55%, transparent);
  font-size: 0.9rem; line-height: 1;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.25);
}
.c-story__tl-card {
  border-radius: 1.25rem;
  box-shadow: 0 16px 34px -18px rgba(0, 0, 0, 0.45);
  background: var(--t-paper);
}
.c-story__tl-card--text {
  border: 1px solid color-mix(in srgb, var(--t-accent) 18%, transparent);
}
</style>
