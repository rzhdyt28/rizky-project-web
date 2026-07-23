<script setup>
/**
 * _CORE / Galeri — DISPATCHER. Lightbox (state + keyboard + scroll-lock)
 * dan paginasi grid/masonry/polaroid (dipakai 3 gaya sekaligus + pager UI
 * bersama) tetap hidup di sini, diteruskan ke anak lewat props + event.
 * Carousel & Floating punya paginasi SENDIRI (khusus 1 gaya), jadi state-nya
 * dipindah masuk ke file gaya masing-masing.
 *
 * Tambah gaya baru: buat GalleryStyle<Nama>.vue di folder ini, daftarkan
 * di map STYLES di bawah, tambah opsi ke ThemeOptionsSchema::GALLERY_STYLES
 * (backend). Kalau gaya barunya butuh paginasi grid biasa, pakai prop
 * `pagedPhotos` + emit `open-flat` seperti grid/masonry/polaroid.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import { assetUrl } from '../../../../composables/assets';
import GalleryStyleCarousel from './GalleryStyleCarousel.vue';
import GalleryStyleGrid from './GalleryStyleGrid.vue';
import GalleryStyleMasonry from './GalleryStyleMasonry.vue';
import GalleryStylePolaroid from './GalleryStylePolaroid.vue';
import GalleryStyleFloating from './GalleryStyleFloating.vue';
import GalleryStyleCircles from './GalleryStyleCircles.vue';
import GalleryStyleStrip from './GalleryStyleStrip.vue';
import GalleryStyleFramed from './GalleryStyleFramed.vue';

const props = defineProps({
  photos:    { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'carousel' }, // carousel|grid|masonry|polaroid|floating|circles|strip|framed
  caption:   { type: String, default: '' }, // kalimat pengantar opsional di bawah judul (theme_options.gallery.caption)
});

/* ---- Paginasi bersama (grid/masonry/polaroid): 2 kolom x 3 baris = 6/halaman. ---- */
const GRID_COLS = 2;
const GRID_ROWS = 3;
const GRID_PER_PAGE = GRID_COLS * GRID_ROWS;
const gridPage = ref(0);
const gridPageCount = computed(() => Math.max(1, Math.ceil(props.photos.length / GRID_PER_PAGE)));
const pagedPhotos = computed(() => {
  const start = gridPage.value * GRID_PER_PAGE;
  return props.photos.slice(start, start + GRID_PER_PAGE).map((p, i) => ({ ...p, _flatIndex: start + i }));
});
const gridPrev = () => (gridPage.value = (gridPage.value - 1 + gridPageCount.value) % gridPageCount.value);
const gridNext = () => (gridPage.value = (gridPage.value + 1) % gridPageCount.value);
watch(() => props.styleName, () => { gridPage.value = 0; });

/* ---- Lightbox bersama semua gaya — indeks FLAT merujuk props.photos ---- */
const lightboxIndex = ref(null); // null = tertutup
const openFlat = (index) => { lightboxIndex.value = index; };
/* Dipakai carousel: 1 grup = 4 foto (grid 2x2). */
const openLightbox = (groupIndex, indexInGroup) => {
  lightboxIndex.value = groupIndex * 4 + indexInGroup;
};
const closeLightbox = () => { lightboxIndex.value = null; };
const lightboxPrev = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + props.photos.length) % props.photos.length;
};
const lightboxNext = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.photos.length;
};
const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? props.photos[lightboxIndex.value] : null
);

function onKeydown(e) {
  if (lightboxIndex.value === null) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

/* Swipe (HP): geser gambar di lightbox tanpa perlu kena tombol panah kecil. */
const SWIPE_THRESHOLD = 40;
let touchStartX = 0;
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > SWIPE_THRESHOLD) lightboxPrev();
  else if (dx < -SWIPE_THRESHOLD) lightboxNext();
}

watch(currentPhoto, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
onBeforeUnmount(() => { document.body.style.overflow = ''; });

const STYLES = {
  carousel: GalleryStyleCarousel,
  grid: GalleryStyleGrid,
  masonry: GalleryStyleMasonry,
  polaroid: GalleryStylePolaroid,
  floating: GalleryStyleFloating,
  circles: GalleryStyleCircles,
  strip: GalleryStyleStrip,
  framed: GalleryStyleFramed,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? GalleryStyleCarousel);
const usesGridPager = computed(() => ['grid', 'masonry', 'polaroid', 'circles', 'framed'].includes(props.styleName));
</script>

<template>
  <SectionWrapper v-if="photos?.length" :title="labels.title_gallery">
    <p
      v-if="caption"
      class="max-w-md mx-auto mb-5 -mt-4 text-sm italic c-gallery__caption"
      :style="{ fontFamily: 'var(--el-caption-font, var(--t-font-body))', color: 'var(--el-caption-color)', fontSize: 'var(--el-caption-size)' }"
    >{{ caption }}</p>
    <component
      :is="activeStyle"
      :photos="photos"
      :paged-photos="pagedPhotos"
      @open-flat="openFlat"
      @open-lightbox="openLightbox"
    />

    <!-- Pager bersama untuk grid/masonry/polaroid — muncul kalau foto > 3 baris (6 foto). -->
    <div v-if="usesGridPager && gridPageCount > 1" class="flex items-center justify-center gap-3 mt-3">
      <button
        type="button" class="grid w-7 h-7 border-0 rounded-full cursor-pointer place-items-center"
        :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
        aria-label="Halaman sebelumnya" @click="gridPrev"
      >‹</button>
      <span class="text-xs opacity-70">{{ gridPage + 1 }} / {{ gridPageCount }}</span>
      <button
        type="button" class="grid w-7 h-7 border-0 rounded-full cursor-pointer place-items-center"
        :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
        aria-label="Halaman berikutnya" @click="gridNext"
      >›</button>
    </div>
  </SectionWrapper>

  <!-- ============ LIGHTBOX bersama semua gaya ============ -->
  <Teleport to="body">
    <div
      v-if="currentPhoto"
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
        v-if="photos.length > 1"
        class="c-gallery__navbtn absolute left-2 top-1/2 md:left-6"
        aria-label="Sebelumnya" @click.stop="lightboxPrev"
      >‹</button>
      <button
        v-if="photos.length > 1"
        class="c-gallery__navbtn absolute right-2 top-1/2 md:right-6"
        aria-label="Berikutnya" @click.stop="lightboxNext"
      >›</button>

      <figure class="max-h-[85vh] max-w-full">
        <img
          :src="assetUrl(currentPhoto.path)"
          :alt="currentPhoto.caption || 'Galeri'"
          class="max-h-[85vh] max-w-full object-contain"
        />
        <figcaption
          v-if="currentPhoto.caption"
          class="mt-2 text-sm text-center text-white/80"
        >{{ currentPhoto.caption }}</figcaption>
      </figure>
    </div>
  </Teleport>
</template>

<style scoped>
/* Tombol navigasi lightbox dibuat besar + kontras (gold solid, bukan
   transparan tipis) supaya jelas terlihat di atas foto apa pun -- request:
   "warna pada kursor kanan dan kiri dibuat agak lebih besar dan keliatan". */
.c-gallery__navbtn {
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
.c-gallery__navbtn:hover { filter: brightness(1.1); }
.c-gallery__navbtn:active { transform: translateY(-50%) scale(0.92); }
</style>
