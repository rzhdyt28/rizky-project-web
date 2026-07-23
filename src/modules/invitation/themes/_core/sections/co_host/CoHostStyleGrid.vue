<script setup>
/** Turut Mengundang -- gaya "grid": tiap nama jadi chip/kartu kecil dalam grid rapi, cocok untuk daftar panjang. */
defineProps({
  spesial: { type: Array, default: () => [] },
  pria:    { type: Array, default: () => [] },
  wanita:  { type: Array, default: () => [] },
});
</script>

<template>
  <div>
    <div v-if="spesial.length" class="max-w-sm mx-auto mb-7">
      <p class="c-cohost__special-label mb-2 text-[10px] uppercase tracking-[0.3em] text-center">Tamu Kehormatan</p>
      <div class="flex flex-wrap justify-center gap-2">
        <span v-for="(it, i) in spesial" :key="`s-${i}`" class="c-cohost__chip c-cohost__chip--gold">{{ it.name }}</span>
      </div>
    </div>

    <div v-if="pria.length || wanita.length" class="grid max-w-lg gap-6 mx-auto sm:grid-cols-2">
      <div v-if="pria.length">
        <h4 class="c-cohost__side mb-2 text-xs text-center uppercase tracking-[0.22em]">Pihak Mempelai Pria</h4>
        <div class="flex flex-wrap justify-center gap-2">
          <span v-for="(it, i) in pria" :key="`p-${i}`" class="c-cohost__chip">{{ it.name }}</span>
        </div>
      </div>
      <div v-if="wanita.length">
        <h4 class="c-cohost__side mb-2 text-xs text-center uppercase tracking-[0.22em]">Pihak Mempelai Wanita</h4>
        <div class="flex flex-wrap justify-center gap-2">
          <span v-for="(it, i) in wanita" :key="`w-${i}`" class="c-cohost__chip">{{ it.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-cohost__special-label { color: var(--el-label-color, var(--t-gold, #b08d4a)); font-size: var(--el-label-size); }
.c-cohost__side { color: var(--el-label-color, var(--t-gold, #b08d4a)); font-size: var(--el-label-size); }
.c-cohost__chip {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: var(--el-name-size, 0.85rem);
  font-family: var(--t-font-head, serif);
  color: var(--el-name-color, inherit);
  background: color-mix(in srgb, var(--t-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--t-accent) 20%, transparent);
}
.c-cohost__chip--gold {
  color: var(--t-accent);
  background: color-mix(in srgb, var(--t-gold, #b08d4a) 12%, transparent);
  border-color: color-mix(in srgb, var(--t-gold, #b08d4a) 45%, transparent);
}
</style>
