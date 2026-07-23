<script setup>
/** Kisah Kami -- gaya "polaroid": kartu foto miring ala polaroid/scrapbook, selang-seling. */
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
  <div class="grid max-w-md gap-8 mx-auto c-story__polaroid">
    <article
      v-for="(story, i) in stories" :key="story.id"
      v-reveal="{ preset: 'zoom', scale: 0.94 }"
      class="text-center c-story__poly-item"
    >
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="block p-2 pb-6 mx-auto bg-white border-0 cursor-pointer c-story__poly-card"
        :class="i % 2 === 0 ? 'rotate-[-3deg]' : 'rotate-[3deg]'"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-square w-56 max-w-full object-cover" />
      </button>
      <p v-if="story.happened_at" class="c-story__date mt-3 mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
        {{ dateLong(story.happened_at) }}
      </p>
      <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
      <p class="max-w-xs mx-auto text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
    </article>
  </div>
</template>

<style scoped>
.c-story__date  { color: var(--el-date-color, var(--t-gold, #b08d4a)); font-size: var(--el-date-size); }
.c-story__title { color: var(--el-name-color, var(--t-accent)); font-size: var(--el-name-size); }
.c-story__text  { color: var(--el-text-color); font-size: var(--el-text-size); }

.c-story__poly-card {
  border-radius: 4px;
  box-shadow: 0 14px 28px -16px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease;
}
.c-story__poly-card:hover { transform: rotate(0deg) scale(1.03); }
</style>
