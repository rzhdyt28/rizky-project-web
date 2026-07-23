<script setup>
/** Mempelai -- gaya "ribbon": dua foto berdampingan disatukan pita/badge "&" di tengah, saling tumpuk-tindih. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  people: { type: Array, required: true },
});
</script>

<template>
  <div class="relative grid grid-cols-2 gap-0 max-w-sm mx-auto c-couple__ribbon-wrap">
    <figure v-for="(p, i) in people" :key="p.name" class="grid justify-items-center gap-2" :class="i === 0 ? 'c-couple__ribbon-left' : 'c-couple__ribbon-right'">
      <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__ribbonimg aspect-[3/4] w-full object-cover" />
      <figcaption class="px-1">
        <h2 class="text-lg c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.125rem)' }">{{ p.name }}</h2>
        <p v-if="p.parents" class="text-[11px] opacity-80" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size)' }">{{ p.parentLabel }} {{ p.parents }}</p>
      </figcaption>
    </figure>
    <span class="c-couple__ribbon-badge" :style="{ fontFamily: 'var(--t-font-script)' }">&amp;</span>
  </div>
</template>

<style scoped>
.c-couple__ribbon-wrap { align-items: start; }
.c-couple__ribbonimg { border-radius: 0.75rem; box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35); }
.c-couple__ribbon-left  { padding-right: 0.4rem; }
.c-couple__ribbon-right { padding-left: 0.4rem; margin-top: 1.5rem; }
.c-couple__ribbon-badge {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--t-gold, #b08d4a);
  color: #fff;
  font-size: 1.35rem;
  box-shadow: 0 10px 22px -10px rgba(0, 0, 0, 0.5);
}
</style>
