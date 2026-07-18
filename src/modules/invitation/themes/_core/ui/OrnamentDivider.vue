<script setup>
import { assetUrl } from '../../../composables/assets';

defineProps({
  image: { type: String, default: null },
  flip:  { type: Boolean, default: false },
});
</script>

<template>
  <img
    v-if="image"
    :src="assetUrl(image)"
    alt=""
    class="c-divider mx-auto h-8 w-auto select-none opacity-80"
    :class="{ 'rotate-180': flip }"
    loading="lazy"
  />
  <svg v-else viewBox="0 0 120 14" class="c-divider mx-auto h-3 w-28 select-none" :class="{ 'rotate-180': flip }">
    <path
      d="M4 7 Q 30 1 60 7 T 116 7"
      fill="none" stroke="var(--t-gold)" stroke-width="1.2" opacity="0.8"
    />
    <circle cx="60" cy="7" r="2.4" fill="var(--t-gold)" opacity="0.9" />
  </svg>
</template>
