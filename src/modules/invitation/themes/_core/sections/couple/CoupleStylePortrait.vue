<script setup>
/** Mempelai -- gaya "portrait": foto potret besar bertumpuk (bukan berdampingan), nama besar di bawah tiap foto. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="grid max-w-xs gap-8 mx-auto">
    <figure v-for="p in people" :key="p.name" class="grid justify-items-center gap-3">
      <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__portraitimg aspect-[4/5] w-full object-cover" />
      <figcaption>
        <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.5rem)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-xs opacity-80" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.c-couple__portraitimg {
  border-radius: 1.5rem;
  box-shadow: 0 22px 46px -22px rgba(0, 0, 0, 0.4);
}
</style>
