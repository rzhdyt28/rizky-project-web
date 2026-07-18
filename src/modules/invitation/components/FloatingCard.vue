<script setup>
/**
 * GLOBAL — Kartu mengambang yang dipakai lintas tema.
 * Tampilan detail (radius, bayangan, warna) dikendalikan CSS var sehingga
 * tiap tema bisa menyetel lewat theme.css-nya tanpa menyentuh file ini:
 *   --card-bg, --card-radius, --card-shadow
 */
defineProps({
  as: { type: String, default: 'div' },
});
</script>

<template>
  <component :is="as" class="g-card">
    <slot />
  </component>
</template>

<style scoped>
.g-card {
  overflow: hidden;
  background: var(--card-bg, var(--t-paper, #fff));
  border-radius: var(--card-radius, 1.25rem);
  box-shadow: var(--card-shadow, 0 18px 40px -22px rgba(0, 0, 0, 0.35));
}
</style>
