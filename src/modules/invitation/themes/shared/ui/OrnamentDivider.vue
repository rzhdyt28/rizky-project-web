<script setup>
import { assetUrl } from '../../../composables/assets';

defineProps({
  image: { type: String, default: null },   // ornamen custom dari DB; null = garis default
  flip:  { type: Boolean, default: false },
});
</script>

<template>
  <img
    v-if="image"
    :src="assetUrl(image)"
    alt=""
    class="mx-auto h-8 w-auto opacity-60"
    :class="{ 'rotate-180': flip }"
  />
  <svg v-else viewBox="0 0 120 24" class="mx-auto h-6 w-28 opacity-40">
    <path
      :d="flip ? 'M10,12 Q30,22 60,12 Q90,2 110,12' : 'M10,12 Q30,2 60,12 Q90,22 110,12'"
      fill="none" stroke="var(--t-gold)" stroke-width="0.7"
    />
  </svg>
</template>
