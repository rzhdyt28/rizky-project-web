<script setup>
/** Mempelai -- gaya "cards": dua kartu foto berdampingan, nama di bawah foto. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="grid gap-4 c-couple__cards sm:grid-cols-2">
    <figure v-for="p in people" :key="p.name" class="c-couple__carditem">
      <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__cardimg aspect-[3/4] w-full object-cover" />
      <figcaption class="pt-3">
        <h2 class="text-xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.25rem)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-xs opacity-80" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.c-couple__cardimg {
  border-radius: 0.9rem;
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
</style>
