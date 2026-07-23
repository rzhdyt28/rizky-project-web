<script setup>
/** Turut Mengundang -- gaya "compact": satu daftar padat, label pihak inline di depan tiap nama (tanpa 2 kolom lebar). */
defineProps({
  spesial: { type: Array, default: () => [] },
  pria:    { type: Array, default: () => [] },
  wanita:  { type: Array, default: () => [] },
});
</script>

<template>
  <div class="max-w-sm mx-auto">
    <ul class="grid gap-2 text-sm">
      <li v-for="(it, i) in spesial" :key="`s-${i}`" class="flex items-baseline gap-2">
        <span class="c-cohost__compact-tag">Kehormatan</span><span class="c-cohost__compact-name">{{ it.name }}</span>
      </li>
      <li v-for="(it, i) in pria" :key="`p-${i}`" class="flex items-baseline gap-2">
        <span class="c-cohost__compact-tag">Pria</span><span class="c-cohost__compact-name">{{ it.name }}</span>
      </li>
      <li v-for="(it, i) in wanita" :key="`w-${i}`" class="flex items-baseline gap-2">
        <span class="c-cohost__compact-tag">Wanita</span><span class="c-cohost__compact-name">{{ it.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.c-cohost__compact-tag {
  flex-shrink: 0;
  min-width: 5.5rem;
  font-family: var(--el-label-font, var(--t-font-accent));
  font-size: var(--el-label-size, 10px);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--el-label-color, var(--t-gold, #b08d4a));
}
.c-cohost__compact-name {
  font-family: var(--el-name-font, var(--t-font-head, serif));
  font-size: var(--el-name-size);
  color: var(--el-name-color, inherit);
}
</style>
