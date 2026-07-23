<script setup>
/** Mempelai -- gaya "polaroid": dua foto gaya polaroid miring berlawanan arah, playful/vintage. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-6">
    <figure v-for="(p, i) in people" :key="p.name" class="c-couple__polaroid" :class="i === 0 ? 'c-couple__polaroid--left' : 'c-couple__polaroid--right'">
      <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="object-cover w-full aspect-[4/5]" />
      <figcaption class="pt-2">
        <h2 class="text-base c-couple__polaroid-name" :style="{ color: 'var(--el-names-color)', fontSize: 'var(--el-names-size)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-[11px] opacity-70 c-couple__polaroid-name" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.c-couple__polaroid {
  width: min(60vw, 12rem);
  padding: 0.55rem 0.55rem 0.9rem;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 18px 36px -18px rgba(0, 0, 0, 0.4);
  text-align: center;
}
.c-couple__polaroid--left  { transform: rotate(-4deg); }
.c-couple__polaroid--right { transform: rotate(4deg); margin-top: 1.25rem; }
.c-couple__polaroid-name { color: #2b2b2b; font-family: var(--t-font-head); }
</style>
