<script setup>
/** Mempelai -- gaya "classic" (default): teks bertumpuk klasik, tanpa foto. */
defineProps({
  people: { type: Array, required: true }, // [groom, bride], masing-masing { name, parents, parentLabel }
});
</script>

<template>
  <div class="grid gap-3">
    <div>
      <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.5rem)' }">{{ people[0].name }}</h2>
      <p v-if="people[0].parents" class="text-sm" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size, 0.875rem)' }">{{ people[0].parentLabel }} {{ people[0].parents }}</p>
    </div>
    <div class="text-2xl italic c-couple__amp" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-gold)' }">&amp;</div>
    <div>
      <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-names-color, var(--t-ink))', fontSize: 'var(--el-names-size, 1.5rem)' }">{{ people[1].name }}</h2>
      <p v-if="people[1].parents" class="text-sm" :style="{ color: 'var(--el-parents-color)', fontSize: 'var(--el-parents-size, 0.875rem)' }">{{ people[1].parentLabel }} {{ people[1].parents }}</p>
    </div>
  </div>
</template>
