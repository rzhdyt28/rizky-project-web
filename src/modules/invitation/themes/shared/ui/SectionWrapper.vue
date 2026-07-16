<script setup>
import BackgroundLayer from './BackgroundLayer.vue';

defineProps({
  title: { type: String, default: '' },
  bg:    { type: Object, default: null },   // background khusus section (null = ikut global)
});
</script>

<template>
  <section class="relative overflow-hidden px-5 py-10 text-center">
    <BackgroundLayer :bg="bg" />
    <h3
      v-if="title"
      class="relative mb-6 text-2xl"
      :style="{ fontFamily: 'var(--t-font-head)' }"
    >
      {{ title }}
      <span class="mx-auto mt-2 block h-px w-10" :style="{ background: 'var(--t-gold)' }" />
    </h3>
    <div class="relative">
      <slot />
    </div>
  </section>
</template>
