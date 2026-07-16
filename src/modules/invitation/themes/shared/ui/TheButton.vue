<script setup>
defineProps({
  ghost:    { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button
    :disabled="disabled"
    class="inline-block cursor-pointer border px-7 py-2.5 text-[11px] uppercase tracking-[0.15em] transition disabled:opacity-50"
    :style="ghost
      ? { background: 'transparent', color: 'var(--t-accent)', borderColor: 'var(--t-accent)' }
      : { background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)', borderColor: 'var(--t-btn-bg)' }"
  >
    <slot />
  </button>
</template>
