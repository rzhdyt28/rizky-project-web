<script setup>
import { computed } from 'vue';

const props = defineProps({
  groom: { type: String, default: '' },
  bride: { type: String, default: '' },
  small: { type: Boolean, default: false },
});

const initials = computed(() =>
  `${(props.groom[0] ?? '').toUpperCase()}·${(props.bride[0] ?? '').toUpperCase()}`
);
</script>

<template>
  <span
    class="c-monogram grid place-items-center rounded-full"
    :class="small ? 'h-12 w-12 text-sm' : 'h-20 w-20 text-xl'"
    :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)', fontFamily: 'var(--t-font-head)' }"
  >
    {{ initials }}
  </span>
</template>
