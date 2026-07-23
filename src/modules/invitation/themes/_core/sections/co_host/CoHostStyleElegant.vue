<script setup>
/** Turut Mengundang -- gaya "elegant": flourish tipis pemisah, tipografi vintage ala undangan cetak. */
defineProps({
  spesial: { type: Array, default: () => [] },
  pria:    { type: Array, default: () => [] },
  wanita:  { type: Array, default: () => [] },
});
</script>

<template>
  <div class="text-center">
    <div v-if="spesial.length" class="max-w-sm mx-auto mb-8">
      <p class="mb-2 text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--el-label-color, var(--t-gold))', fontSize: 'var(--el-label-size)' }">Tamu Kehormatan</p>
      <p v-for="(it, i) in spesial" :key="`s-${i}`" class="c-cohost__elegant-name">{{ it.name }}</p>
    </div>

    <svg viewBox="0 0 120 20" class="w-24 h-4 mx-auto mb-6 c-cohost__flourish" fill="none" stroke="currentColor" stroke-width="1">
      <path d="M0 10 H45 M75 10 H120" />
      <circle cx="60" cy="10" r="4" />
    </svg>

    <div v-if="pria.length || wanita.length" class="grid max-w-lg gap-8 mx-auto sm:grid-cols-2">
      <div v-if="pria.length">
        <h4 class="mb-3 text-xs uppercase tracking-[0.22em]" :style="{ color: 'var(--el-label-color, var(--t-gold))', fontSize: 'var(--el-label-size)' }">Pihak Mempelai Pria</h4>
        <p v-for="(it, i) in pria" :key="`p-${i}`" class="c-cohost__elegant-name">{{ it.name }}</p>
      </div>
      <div v-if="wanita.length">
        <h4 class="mb-3 text-xs uppercase tracking-[0.22em]" :style="{ color: 'var(--el-label-color, var(--t-gold))', fontSize: 'var(--el-label-size)' }">Pihak Mempelai Wanita</h4>
        <p v-for="(it, i) in wanita" :key="`w-${i}`" class="c-cohost__elegant-name">{{ it.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-cohost__flourish { color: var(--t-gold, #b08d4a); }
.c-cohost__elegant-name {
  font-family: var(--t-font-head, serif);
  font-style: italic;
  font-size: var(--el-name-size, 1.05rem);
  margin-bottom: 0.35rem;
  color: var(--el-name-color, inherit);
}
</style>
