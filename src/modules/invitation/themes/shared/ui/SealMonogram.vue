<script setup>
import { computed } from 'vue';

const props = defineProps({
  groom: { type: String, default: '' },
  bride: { type: String, default: '' },
  small: { type: Boolean, default: false },
});

const monogram = computed(() => `${props.groom?.[0] ?? ''}·${props.bride?.[0] ?? ''}`);
</script>

<template>
  <div
    class="grid place-items-center rounded-full"
    :class="small ? 'h-11 w-11 text-sm' : 'h-20 w-20 text-2xl'"
    :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)', fontFamily: 'var(--t-font-head)' }"
  >
    {{ monogram }}
  </div>
</template>
