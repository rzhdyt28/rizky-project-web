<script setup>
/** Mempelai -- gaya "arch": bingkai lengkung ala gerbang, berdampingan di desktop. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="grid gap-5 c-couple__cards sm:grid-cols-2">
    <figure v-for="p in people" :key="p.name" class="grid gap-2 justify-items-center">
      <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__archimg aspect-[3/4] w-full max-w-[13rem] object-cover" />
      <figcaption>
        <h2 class="text-xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.25rem)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-xs opacity-80" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.c-couple__archimg {
  border-radius: 999px 999px 14px 14px;
  border: 2px solid color-mix(in srgb, var(--t-gold, #b08d4a) 65%, transparent);
}
</style>
