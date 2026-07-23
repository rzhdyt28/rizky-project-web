<script setup>
/** Galeri -- gaya "carousel" (default, perilaku lama): geser per halaman 4 foto. */
import { computed, ref } from 'vue';
import { assetUrl } from '../../../../composables/assets';

/* Template ini punya 2 root (carousel + dots) -- Vue tidak bisa auto-inherit
   attrs fallthrough (mis. paged-photos yang dikirim GallerySection.vue ke
   SEMUA gaya secara seragam, padahal Carousel paginasi sendiri dari `photos`
   penuh, tidak butuh itu) ke root ganda, makanya perlu inheritAttrs:false
   supaya tidak muncul warning "Extraneous non-props attributes". */
defineOptions({ inheritAttrs: false });

const props = defineProps({
  photos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-lightbox']);

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

/* Swipe (HP): geser halaman carousel langsung dengan jari. */
const SWIPE_THRESHOLD = 40;
let touchStartX = 0;
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > SWIPE_THRESHOLD) prev();
  else if (dx < -SWIPE_THRESHOLD) next();
}
</script>

<template>
  <div class="relative max-w-md mx-auto overflow-hidden" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div
      class="flex transition-transform duration-500"
      :style="{ transform: `translateX(-${page * 100}%)` }"
    >
      <div
        v-for="(group, gi) in pages" :key="gi"
        class="grid w-full grid-cols-2 gap-2 px-1 shrink-0"
      >
        <button
          v-for="(p, pi) in group" :key="p.id"
          type="button"
          class="p-0 border-0 cursor-pointer"
          @click="emit('open-lightbox', gi, pi)"
        >
          <img
            :src="assetUrl(p.path)"
            :alt="p.caption || 'Galeri'"
            loading="lazy"
            class="aspect-[3/4] w-full object-cover"
          />
        </button>
      </div>
    </div>

    <template v-if="total > 1">
      <button
        class="absolute grid w-10 h-10 -translate-y-1/2 border-0 rounded-full cursor-pointer left-1 top-1/2 place-items-center text-lg shadow-lg"
        :style="{ background: 'var(--t-gold, #b08d4a)', color: '#fff' }"
        aria-label="Sebelumnya" @click="prev"
      >‹</button>
      <button
        class="absolute grid w-10 h-10 -translate-y-1/2 border-0 rounded-full cursor-pointer right-1 top-1/2 place-items-center text-lg shadow-lg"
        :style="{ background: 'var(--t-gold, #b08d4a)', color: '#fff' }"
        aria-label="Berikutnya" @click="next"
      >›</button>
    </template>
  </div>

  <div v-if="total > 1" class="mt-3 flex justify-center gap-1.5">
    <button
      v-for="(g, i) in pages" :key="i"
      class="w-2 h-2 p-0 border-0 rounded-full cursor-pointer"
      :style="{ background: i === page ? 'var(--t-accent)' : 'color-mix(in srgb, var(--t-accent) 25%, transparent)' }"
      :aria-label="`Halaman ${i + 1}`"
      @click="page = i"
    />
  </div>
</template>
