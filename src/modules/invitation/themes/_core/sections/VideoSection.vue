<script setup>
import SectionWrapper from '../ui/SectionWrapper.vue';
import { toEmbedUrl } from '../../../composables/useThemeOptions';

defineProps({
  videoUrl: { type: String, default: null },
  labels:   { type: Object, required: true },
});
</script>

<template>
  <SectionWrapper v-if="videoUrl" :title="labels.title_video">
    <div class="mx-auto aspect-video max-w-md overflow-hidden border"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
    >
      <iframe
        :src="toEmbedUrl(videoUrl)"
        class="h-full w-full border-0"
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
  </SectionWrapper>
</template>
