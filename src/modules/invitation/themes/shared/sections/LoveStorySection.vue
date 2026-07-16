<script setup>
import SectionWrapper from '../ui/SectionWrapper.vue';

defineProps({
  stories: { type: Array, default: () => [] },
  labels:  { type: Object, required: true },
  bg:      { type: Object, default: null },
});
</script>

<template>
  <SectionWrapper v-if="stories?.length" :title="labels.title_story" :bg="bg">
    <ol class="mx-auto max-w-md border-l text-left" :style="{ borderColor: 'var(--t-gold)' }">
      <li v-for="s in stories" :key="s.id" class="relative pb-5 pl-5">
        <span
          class="absolute -left-1 top-1.5 h-2 w-2 rounded-full"
          :style="{ background: 'var(--t-gold)' }"
        />
        <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">
          {{ s.title }}
        </h4>
        <p class="text-sm">{{ s.story }}</p>
      </li>
    </ol>
  </SectionWrapper>
</template>
