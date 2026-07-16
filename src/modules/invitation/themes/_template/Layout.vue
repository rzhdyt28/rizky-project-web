<script setup>
/**
 * TEMPLATE TEMA BARU — copy folder ini, ganti nama, lalu:
 * 1. Atur gaya khas tema di class wrapper / style scoped di bawah.
 * 2. (Opsional) ganti section shared dengan versi custom milik tema ini.
 * 3. Daftarkan di ../registry.js dan di Filament (Themes).
 * Props yang diterima SAMA untuk semua tema — jangan diubah.
 */
import ElegantLayout from "../elegant/Layout.vue";

defineProps({
  invitation: Object,
  guestName: String,
  guestbook: Array,
  slug: String,
  can: Object,
  labels: Object,
  sectionOrder: Array,
  sectionBg: Function,
  globalBg: Object,
  cover: Object,
});
</script>

<template>
  <!-- Cara tercepat memulai: bungkus layout lain lalu ubah nuansanya via CSS -->
  <ElegantLayout v-bind="$props" />
</template>
