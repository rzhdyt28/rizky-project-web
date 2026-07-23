<script setup>
/** Mempelai -- gaya "circle": foto lingkaran besar, "&" kaligrafi di tengah. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="grid gap-2 justify-items-center">
    <template v-for="(p, i) in people" :key="p.name">
      <div class="grid gap-2 justify-items-center">
        <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="object-cover rounded-full c-couple__circleimg h-36 w-36 sm:h-40 sm:w-40" />
        <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.5rem)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-xs opacity-80" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </div>
      <div v-if="i === 0" class="py-1 text-4xl c-couple__amp" :style="{ fontFamily: 'var(--t-font-script)', color: 'var(--t-gold)' }">&amp;</div>
    </template>
  </div>
</template>

<style scoped>
.c-couple__circleimg {
  border: 3px solid var(--t-gold, #b08d4a);
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
</style>
