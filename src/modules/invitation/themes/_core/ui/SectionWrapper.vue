<script setup>
/**
 * _CORE — Kerangka section netral: judul + isi. TANPA background layer
 * (fitur background per-section sudah dihapus dari produk).
 * Class hook (c-section, c-section__title) disediakan supaya theme.css
 * tiap tema bisa menata TANPA :deep() ke internal komponen.
 */
defineProps({
  title: { type: String, default: '' },
});
</script>

<template>
  <section class="c-section relative overflow-hidden px-5 py-10 text-center">
    <h3
      v-if="title"
      class="c-section__title relative mb-6 text-2xl"
      :style="{ fontFamily: 'var(--t-font-head)' }"
    >
      {{ title }}
      <span class="c-section__rule mx-auto mt-2 block h-px w-10" :style="{ background: 'var(--t-gold)' }" />
    </h3>
    <div class="relative">
      <slot />
    </div>
  </section>
</template>
