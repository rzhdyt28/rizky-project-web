<script setup>
/**
 * _CORE / Kisah Kami — DISPATCHER. Lightbox foto (state + keyboard + body
 * scroll-lock) dipakai SEMUA gaya, jadi tetap hidup di sini dan diteruskan
 * ke anak lewat prop `showPhotos` + event `open-lightbox`, BUKAN
 * diduplikasi ke tiap file gaya.
 *
 * Tambah gaya baru: buat LoveStoryStyle<Nama>.vue di folder ini, daftarkan
 * di map STYLES di bawah, tambah opsi ke
 * ThemeOptionsSchema::LOVE_STORY_STYLES (backend).
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import { assetUrl } from '../../../../composables/assets';
import LoveStoryStyleStacked from './LoveStoryStyleStacked.vue';
import LoveStoryStyleTimeline from './LoveStoryStyleTimeline.vue';
import LoveStoryStyleAlternate from './LoveStoryStyleAlternate.vue';
import LoveStoryStylePolaroid from './LoveStoryStylePolaroid.vue';
import LoveStoryStyleLetter from './LoveStoryStyleLetter.vue';
import LoveStoryStyleGrid from './LoveStoryStyleGrid.vue';
import LoveStoryStyleMinimal from './LoveStoryStyleMinimal.vue';

const props = defineProps({
  stories:    { type: Array, default: () => [] },
  labels:     { type: Object, required: true },
  showPhotos: { type: Boolean, default: false },
  styleName:  { type: String, default: 'stacked' }, // stacked|timeline|alternate|polaroid
});

/* Kisah dengan foto (hanya relevan kalau showPhotos aktif), untuk lightbox. */
const photoStories = computed(() =>
  props.showPhotos ? props.stories.filter((s) => s.photo) : []
);

const lightboxIndex = ref(null); // index di photoStories, null = tertutup
const openLightbox = (story) => {
  if (!props.showPhotos || !story.photo) return;
  const i = photoStories.value.findIndex((s) => s.id === story.id);
  if (i !== -1) lightboxIndex.value = i;
};
const closeLightbox = () => { lightboxIndex.value = null; };
const lightboxPrev = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + photoStories.value.length) % photoStories.value.length;
};
const lightboxNext = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % photoStories.value.length;
};
const currentStory = computed(() =>
  lightboxIndex.value !== null ? photoStories.value[lightboxIndex.value] : null
);

function onKeydown(e) {
  if (lightboxIndex.value === null) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

/* Swipe (HP): geser foto di lightbox. */
const SWIPE_THRESHOLD = 40;
let touchStartX = 0;
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > SWIPE_THRESHOLD) lightboxPrev();
  else if (dx < -SWIPE_THRESHOLD) lightboxNext();
}

watch(currentStory, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
onBeforeUnmount(() => { document.body.style.overflow = ''; });

const STYLES = {
  stacked: LoveStoryStyleStacked,
  timeline: LoveStoryStyleTimeline,
  alternate: LoveStoryStyleAlternate,
  polaroid: LoveStoryStylePolaroid,
  letter: LoveStoryStyleLetter,
  grid: LoveStoryStyleGrid,
  minimal: LoveStoryStyleMinimal,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? LoveStoryStyleStacked);
</script>

<template>
  <SectionWrapper v-if="stories?.length" :title="labels.title_story">
    <component
      :is="activeStyle"
      :stories="stories"
      :show-photos="showPhotos"
      @open-lightbox="openLightbox"
    />
  </SectionWrapper>

  <!-- ============ LIGHTBOX (hanya kisah berfoto) — dipakai semua gaya ============ -->
  <Teleport to="body">
    <div
      v-if="currentStory"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4"
      @click.self="closeLightbox"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <button
        class="absolute grid text-lg border-0 rounded-full cursor-pointer right-4 top-4 h-9 w-9 place-items-center bg-white/10 text-white/90 hover:bg-white/20"
        aria-label="Tutup" @click="closeLightbox"
      >✕</button>

      <button
        v-if="photoStories.length > 1"
        class="c-story__navbtn absolute left-2 top-1/2 md:left-6"
        aria-label="Sebelumnya" @click.stop="lightboxPrev"
      >‹</button>
      <button
        v-if="photoStories.length > 1"
        class="c-story__navbtn absolute right-2 top-1/2 md:right-6"
        aria-label="Berikutnya" @click.stop="lightboxNext"
      >›</button>

      <figure class="max-h-[85vh] max-w-full">
        <img :src="assetUrl(currentStory.photo)" :alt="currentStory.title" class="max-h-[85vh] max-w-full object-contain" />
        <figcaption class="mt-2 text-sm text-center text-white/80">{{ currentStory.title }}</figcaption>
      </figure>
    </div>
  </Teleport>
</template>

<style scoped>
.c-story__navbtn {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  transform: translateY(-50%);
  font-size: 1.75rem;
  line-height: 1;
  background: var(--t-gold, #b08d4a);
  color: #fff;
  box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.6);
  transition: transform 0.15s ease, filter 0.15s ease;
}
.c-story__navbtn:hover { filter: brightness(1.1); }
.c-story__navbtn:active { transform: translateY(-50%) scale(0.92); }
</style>
