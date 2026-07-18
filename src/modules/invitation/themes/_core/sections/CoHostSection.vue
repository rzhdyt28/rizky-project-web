<script setup>
import SectionWrapper from '../ui/SectionWrapper.vue';

defineProps({
  coHosts: { type: Array, default: () => [] },
  labels:  { type: Object, required: true },
});
</script>

<template>
  <SectionWrapper v-if="coHosts?.length" :title="labels.title_co_host">
    <ul class="mx-auto grid max-w-sm gap-1.5">
      <li
        v-for="(name, i) in coHosts" :key="i"
        class="text-sm"
        :style="{ fontFamily: 'var(--t-font-head)', fontSize: '1rem' }"
      >
        {{ name }}
      </li>
    </ul>
  </SectionWrapper>
</template>
