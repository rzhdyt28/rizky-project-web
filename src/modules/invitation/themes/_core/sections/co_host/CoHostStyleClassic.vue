<script setup>
/** Turut Mengundang -- gaya "classic" (default, perilaku lama): tamu spesial di atas, 2 kolom pria/wanita di bawah. */
defineProps({
  spesial: { type: Array, default: () => [] },
  pria:    { type: Array, default: () => [] },
  wanita:  { type: Array, default: () => [] },
});
</script>

<template>
  <div>
    <div v-if="spesial.length" class="max-w-sm mx-auto c-cohost__special mb-7">
      <p class="c-cohost__special-label mb-2 text-[10px] uppercase tracking-[0.3em]">
        Tamu Kehormatan
      </p>
      <ul class="grid gap-1.5">
        <li v-for="(it, i) in spesial" :key="`s-${i}`" class="c-cohost__special-name">
          {{ it.name }}
        </li>
      </ul>
    </div>

    <div
      v-if="pria.length || wanita.length"
      class="grid max-w-lg mx-auto c-cohost__cols gap-7 sm:grid-cols-2 sm:gap-6"
    >
      <div v-if="pria.length" class="c-cohost__col">
        <h4 class="c-cohost__side mb-2 text-xs uppercase tracking-[0.22em]">
          Pihak Mempelai Pria
        </h4>
        <ul class="grid gap-1.5">
          <li v-for="(it, i) in pria" :key="`p-${i}`" class="c-cohost__name">{{ it.name }}</li>
        </ul>
      </div>
      <div v-if="wanita.length" class="c-cohost__col">
        <h4 class="c-cohost__side mb-2 text-xs uppercase tracking-[0.22em]">
          Pihak Mempelai Wanita
        </h4>
        <ul class="grid gap-1.5">
          <li v-for="(it, i) in wanita" :key="`w-${i}`" class="c-cohost__name">{{ it.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-cohost__special {
  padding: 0.9rem 1.1rem;
  border-radius: 0.8rem;
  border: 1px solid color-mix(in srgb, var(--t-gold, #b08d4a) 55%, transparent);
  background: color-mix(in srgb, var(--t-gold, #b08d4a) 8%, transparent);
}
.c-cohost__special-label { font-family: var(--el-label-font, var(--t-font-accent)); color: var(--el-label-color, var(--t-gold, #b08d4a)); font-size: var(--el-label-size); }
.c-cohost__special-name  { font-family: var(--el-name-font, var(--t-font-head, serif)); font-size: var(--el-name-size, 1.05rem); color: var(--el-name-color, var(--t-accent)); }
.c-cohost__side { font-family: var(--el-label-font, var(--t-font-accent)); color: var(--el-label-color, var(--t-gold, #b08d4a)); font-size: var(--el-label-size); }
.c-cohost__name { font-family: var(--el-name-font, var(--t-font-head, serif)); font-size: var(--el-name-size, 1rem); color: var(--el-name-color); }
</style>
