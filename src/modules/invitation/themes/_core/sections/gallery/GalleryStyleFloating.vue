<script setup>
/** Galeri -- gaya "floating": foto besar mengambang + strip thumbnail & panah + rel tombol kembali-ke-atas. */
import { computed, ref } from 'vue';
import { assetUrl } from '../../../../composables/assets';

/* Tidak butuh paged-photos (paginasi sendiri dari `photos` penuh) -- dengan
   inheritAttrs:false, attr itu tidak "bocor" jadi atribut DOM asal-asalan
   di root div (root tunggal, jadi Vue akan auto-apply tanpa ini). */
defineOptions({ inheritAttrs: false });

const props = defineProps({
  photos: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-flat']);

const FLOAT_PER_PAGE = 4;
const floatingPageIdx = ref(0);
const floatingIndex = ref(0);
const floatingPagesRaw = computed(() => {
  const out = [];
  for (let i = 0; i < props.photos.length; i += FLOAT_PER_PAGE) {
    out.push(props.photos.slice(i, i + FLOAT_PER_PAGE).map((p, j) => ({ ...p, _flatIndex: i + j })));
  }
  return out;
});
const floatingThumbs = computed(() => floatingPagesRaw.value[floatingPageIdx.value] ?? []);
function floatingPrevPage() {
  floatingPageIdx.value = (floatingPageIdx.value - 1 + floatingPagesRaw.value.length) % floatingPagesRaw.value.length;
  floatingIndex.value = floatingThumbs.value[0]?._flatIndex ?? 0;
}
function floatingNextPage() {
  floatingPageIdx.value = (floatingPageIdx.value + 1) % floatingPagesRaw.value.length;
  floatingIndex.value = floatingThumbs.value[0]?._flatIndex ?? 0;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Swipe (HP): geser foto utama ke foto sebelum/berikutnya (lintas halaman thumbnail). */
const SWIPE_THRESHOLD = 40;
let touchStartX = 0;
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > SWIPE_THRESHOLD) floatingIndex.value = (floatingIndex.value - 1 + photos.length) % photos.length;
  else if (dx < -SWIPE_THRESHOLD) floatingIndex.value = (floatingIndex.value + 1) % photos.length;
}
</script>

<template>
  <div class="relative max-w-sm mx-auto c-gallery__floating">
    <div class="overflow-hidden shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] rounded-3xl" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <button type="button" class="block w-full p-0 border-0 cursor-pointer" @click="emit('open-flat', floatingIndex)">
        <img
          :src="assetUrl(photos[floatingIndex]?.path)"
          :alt="photos[floatingIndex]?.caption || 'Galeri'"
          class="aspect-[3/4] w-full object-cover"
        />
      </button>
    </div>

    <div class="flex items-center gap-2 mt-3">
      <button
        v-if="floatingPagesRaw.length > 1"
        type="button" class="grid border-0 rounded-full cursor-pointer h-7 w-7 shrink-0 place-items-center"
        :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
        aria-label="Thumbnail sebelumnya" @click="floatingPrevPage"
      >‹</button>
      <div class="grid flex-1 grid-cols-4 gap-2">
        <button
          v-for="p in floatingThumbs" :key="p.id"
          type="button"
          class="p-0 overflow-hidden border-0 cursor-pointer rounded-xl c-gallery__floating-thumb"
          :class="{ 'c-gallery__floating-thumb--active': floatingIndex === p._flatIndex }"
          @click="floatingIndex = p._flatIndex"
        >
          <img :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy" class="object-cover w-full aspect-square" />
        </button>
      </div>
      <button
        v-if="floatingPagesRaw.length > 1"
        type="button" class="grid border-0 rounded-full cursor-pointer h-7 w-7 shrink-0 place-items-center"
        :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
        aria-label="Thumbnail berikutnya" @click="floatingNextPage"
      >›</button>
    </div>

    <!-- rel tombol samping (kembali ke atas) — disembunyikan di layar sangat sempit -->
    <div class="absolute flex-col items-center hidden gap-2 -translate-y-1/2 c-gallery__floating-rail right-[-3.25rem] top-1/3 sm:flex">
      <button
        type="button" class="grid border-0 rounded-full shadow cursor-pointer h-9 w-9 place-items-center"
        :style="{ background: 'var(--t-paper)', color: 'var(--t-accent)' }"
        aria-label="Kembali ke atas" @click="scrollToTop"
      >↑</button>
      <span class="text-[10px] tracking-widest opacity-60 [writing-mode:vertical-rl]">TOP</span>
    </div>
  </div>
</template>

<style scoped>
.c-gallery__floating-thumb {
  opacity: 0.55;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: opacity 0.2s ease, outline-color 0.2s ease;
}
.c-gallery__floating-thumb--active {
  opacity: 1;
  outline-color: var(--t-accent, #888);
}
</style>
