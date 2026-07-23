<script setup>
/** Kisah Kami -- gaya "minimal": teks di tengah, dipisah garis tipis, foto (kalau ada) jadi kecil bulat di atas judul. */
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
  <div class="grid max-w-sm gap-8 mx-auto divide-y divide-dashed c-story__minimal">
    <article v-for="story in stories" :key="story.id" class="pt-8 text-center first:pt-0">
      <button
        v-if="showPhotos && story.photo"
        type="button"
        class="mx-auto mb-3 overflow-hidden border-0 rounded-full cursor-pointer h-14 w-14"
        @click="$emit('open-lightbox', story)"
      >
        <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="object-cover w-full h-full" />
      </button>
      <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{{ dateLong(story.happened_at) }}</p>
      <h4 class="mb-2 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
      <p class="max-w-xs mx-auto text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
    </article>
  </div>
</template>

<style scoped>
.c-story__minimal { border-color: color-mix(in srgb, var(--t-accent) 20%, transparent); }
.c-story__date  { color: var(--el-date-color, var(--t-gold, #b08d4a)); font-size: var(--el-date-size); }
.c-story__title { color: var(--el-name-color, var(--t-accent)); font-size: var(--el-name-size); }
.c-story__text  { color: var(--el-text-color); font-size: var(--el-text-size); }
</style>
