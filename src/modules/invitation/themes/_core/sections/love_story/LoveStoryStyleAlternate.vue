<script setup>
/** Kisah Kami -- gaya "alternate": zigzag kiri-kanan, garis di tengah (desktop), bertumpuk di HP. */
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
  <div class="relative max-w-2xl mx-auto c-story__alt">
    <span class="c-story__spine c-story__spine--alt" aria-hidden="true" />
    <article
      v-for="(story, i) in stories" :key="story.id"
      v-reveal="{ preset: i % 2 === 0 ? 'fade-right' : 'fade-left', x: i % 2 === 0 ? -50 : 50 }"
      class="relative flex flex-col items-center gap-4 pb-10 c-story__alt-item last:pb-0 sm:flex-row"
      :class="i % 2 === 1 ? 'sm:flex-row-reverse' : ''"
    >
      <span class="absolute z-10 hidden -translate-x-1/2 c-story__node c-story__node--sm left-1/2 sm:grid place-items-center" aria-hidden="true">♥</span>
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="block w-full max-w-[13rem] flex-1 overflow-hidden rounded-2xl border-0 p-0 cursor-pointer c-story__tl-card mx-auto sm:mx-0"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-[4/3] w-full object-cover" />
      </button>
      <div class="flex-1 max-w-xs mx-auto text-center sm:mx-0" :class="i % 2 === 0 ? 'sm:text-left' : 'sm:text-right'">
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
.c-story__spine--alt { display: none; }
@media (min-width: 640px) { .c-story__spine--alt { display: block; } }

.c-story__node {
  width: 1.9rem; height: 1.9rem; border-radius: 9999px;
  background: var(--t-paper); color: var(--t-accent);
  border: 1.5px solid color-mix(in srgb, var(--t-accent) 55%, transparent);
  font-size: 0.9rem; line-height: 1;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.25);
}
.c-story__node--sm { width: 1.6rem; height: 1.6rem; font-size: 0.75rem; }

.c-story__tl-card {
  border-radius: 1.25rem;
  box-shadow: 0 16px 34px -18px rgba(0, 0, 0, 0.45);
  background: var(--t-paper);
}
</style>
