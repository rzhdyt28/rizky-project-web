<script setup>
import { computed, ref } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  photos: { type: Array, default: () => [] },
  labels: { type: Object, required: true },
  bg:     { type: Object, default: null },
});

/* Carousel + pagination: 1 slide berisi maksimal 4 foto (grid 2x2). */
const PER_PAGE = 4;
const page = ref(0);
const pages = computed(() => {
  const out = [];
  for (let i = 0; i < props.photos.length; i += PER_PAGE) {
    out.push(props.photos.slice(i, i + PER_PAGE));
  }
  return out;
});
const total = computed(() => pages.value.length);
const prev = () => (page.value = (page.value - 1 + total.value) % total.value);
const next = () => (page.value = (page.value + 1) % total.value);
</script>

<template>
  <SectionWrapper v-if="photos?.length" :title="labels.title_gallery" :bg="bg">
    <div class="relative mx-auto max-w-md overflow-hidden">
      <div
        class="flex transition-transform duration-500"
        :style="{ transform: `translateX(-${page * 100}%)` }"
      >
        <div
          v-for="(group, gi) in pages" :key="gi"
          class="grid w-full shrink-0 grid-cols-2 gap-2 px-1"
        >
          <img
            v-for="p in group" :key="p.id"
            :src="assetUrl(p.path)"
            :alt="p.caption || 'Galeri'"
            loading="lazy"
            class="aspect-[3/4] w-full object-cover"
          />
        </div>
      </div>

      <template v-if="total > 1">
        <button
          class="absolute left-1 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0"
          :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
          aria-label="Sebelumnya" @click="prev"
        >‹</button>
        <button
          class="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0"
          :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
          aria-label="Berikutnya" @click="next"
        >›</button>
      </template>
    </div>

    <div v-if="total > 1" class="mt-3 flex justify-center gap-1.5">
      <button
        v-for="(g, i) in pages" :key="i"
        class="h-2 w-2 cursor-pointer rounded-full border-0 p-0"
        :style="{ background: i === page ? 'var(--t-accent)' : 'color-mix(in srgb, var(--t-accent) 25%, transparent)' }"
        :aria-label="`Halaman ${i + 1}`"
        @click="page = i"
      />
    </div>
  </SectionWrapper>
</template>
