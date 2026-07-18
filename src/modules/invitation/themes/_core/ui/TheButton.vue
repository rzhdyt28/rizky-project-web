<script setup>
defineProps({
  ghost: { type: Boolean, default: false },
});
</script>

<template>
  <button
    class="c-btn cursor-pointer border px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] transition hover:opacity-85"
    :class="ghost ? 'c-btn--ghost' : 'c-btn--solid'"
    :style="ghost
      ? { borderColor: 'var(--t-btn-bg)', color: 'var(--t-btn-bg)', background: 'transparent' }
      : { borderColor: 'var(--t-btn-bg)', background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }"
  >
    <slot />
  </button>
</template>
