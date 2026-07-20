<script setup>
/**
 * Tombol Tailwind bergaya seragam. `variant` memilih salah satu gaya yang
 * berulang di halaman-halaman CRUD dashboard (submit utama, batal, aksi
 * kecil bulat, aksi kecil bulat berbahaya).
 */
const VARIANT_CLASS = {
  primary: 'rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700',
  secondary: 'rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700',
  pill: 'rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700',
  'pill-danger': 'rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400',
};

defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button :type="type" :class="VARIANT_CLASS[variant]" :disabled="disabled">
    <slot />
  </button>
</template>
