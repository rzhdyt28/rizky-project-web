<script setup>
/**
 * _CORE / Galeri (v3) — 5 MODEL, dipilih dari Filament (gallery.style):
 *   carousel : geser per halaman 4 foto (perilaku lama, default)
 *   grid     : kotak rapi 2 kolom (dipaginasi tiap 3 baris)
 *   masonry  : susun bata (CSS columns) mengikuti tinggi asli foto (dipaginasi tiap 3 baris)
 *   polaroid : kartu foto bertepi putih, miring selang-seling (dipaginasi tiap 3 baris)
 *   floating : foto besar mengambang + strip thumbnail & panah + rel tombol kembali-ke-atas
 * SEMUA model memakai LIGHTBOX yang sama (klik foto -> popup, panah, Esc).
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  photos:    { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'carousel' }, // carousel|grid|masonry|polaroid|floating
});

/* ---- Paginasi (model grid/masonry/polaroid): 2 kolom x 3 baris = 6/halaman.
   Reset ke halaman 1 tiap kali admin ganti model galeri. ---- */
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

/* ---- Model 'floating': strip thumbnail per 4 foto + 1 foto besar terpilih ---- */
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

/* ---- Carousel (khusus model 'carousel'): 1 slide = 4 foto (grid 2x2) ---- */
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

/* ---- Lightbox bersama — indeks FLAT merujuk props.photos ---- */
const lightboxIndex = ref(null); // null = tertutup

const openFlat = (index) => { lightboxIndex.value = index; };
const openLightbox = (groupIndex, indexInGroup) => {
  lightboxIndex.value = groupIndex * PER_PAGE + indexInGroup;
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

/* Kunci scroll halaman belakang selagi popup terbuka. */
watch(currentPhoto, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
onBeforeUnmount(() => { document.body.style.overflow = ''; });
</script>

<template>
  <SectionWrapper v-if="photos?.length" :title="labels.title_gallery">
    <!-- ============ 1) CAROUSEL (default) ============ -->
    <template v-if="styleName === 'carousel'">
      <div class="relative max-w-md mx-auto overflow-hidden">
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
              @click="openLightbox(gi, pi)"
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
            class="absolute grid w-8 h-8 -translate-y-1/2 border-0 rounded-full cursor-pointer left-1 top-1/2 place-items-center"
            :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
            aria-label="Sebelumnya" @click="prev"
          >‹</button>
          <button
            class="absolute grid w-8 h-8 -translate-y-1/2 border-0 rounded-full cursor-pointer right-1 top-1/2 place-items-center"
            :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
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

    <!-- ============ 2) GRID — kotak rapi 2 kolom ============ -->
    <div v-else-if="styleName === 'grid'" class="grid max-w-md grid-cols-2 gap-2 mx-auto c-gallery__grid">
      <button
        v-for="p in pagedPhotos" :key="p.id"
        type="button" class="p-0 border-0 cursor-pointer"
        @click="openFlat(p._flatIndex)"
      >
        <img
          :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
          class="object-cover w-full rounded-md aspect-square"
        />
      </button>
    </div>

    <!-- ============ 3) MASONRY — susun bata (CSS columns) ============ -->
    <div v-else-if="styleName === 'masonry'" class="max-w-md gap-2 mx-auto c-gallery__masonry columns-2">
      <button
        v-for="p in pagedPhotos" :key="p.id"
        type="button" class="block w-full p-0 mb-2 border-0 cursor-pointer break-inside-avoid"
        @click="openFlat(p._flatIndex)"
      >
        <img
          :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
          class="object-cover w-full rounded-md"
        />
      </button>
    </div>

    <!-- ============ 4) POLAROID — miring selang-seling ============ -->
    <div v-else-if="styleName === 'polaroid'" class="grid max-w-md grid-cols-2 gap-4 mx-auto c-gallery__polaroid">
      <button
        v-for="p in pagedPhotos" :key="p.id"
        type="button"
        class="p-2 pb-6 bg-white border-0 cursor-pointer c-gallery__polaroid-item"
        :class="p._flatIndex % 2 === 0 ? 'rotate-[-2.5deg]' : 'rotate-[2.5deg]'"
        @click="openFlat(p._flatIndex)"
      >
        <img
          :src="assetUrl(p.path)" :alt="p.caption || 'Galeri'" loading="lazy"
          class="object-cover w-full aspect-square"
        />
        <span v-if="p.caption" class="mt-1 block truncate text-[11px] text-neutral-600">{{ p.caption }}</span>
      </button>
    </div>

    <!-- ============ 5) FLOATING — foto besar + strip thumbnail + rel tombol ============ -->
    <div v-else-if="styleName === 'floating'" class="relative max-w-sm mx-auto c-gallery__floating">
      <div class="overflow-hidden shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] rounded-3xl">
        <button type="button" class="block w-full p-0 border-0 cursor-pointer" @click="openFlat(floatingIndex)">
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

    <!-- Pager bersama untuk grid/masonry/polaroid — muncul kalau foto > 3 baris (6 foto). -->
    <div
      v-if="['grid', 'masonry', 'polaroid'].includes(styleName) && gridPageCount > 1"
      class="flex items-center justify-center gap-3 mt-3"
    >
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

    <!-- ============ LIGHTBOX bersama semua model ============ -->
    <Teleport to="body">
      <div
        v-if="currentPhoto"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4"
        @click.self="closeLightbox"
      >
        <button
          class="absolute grid text-lg border-0 rounded-full cursor-pointer right-4 top-4 h-9 w-9 place-items-center bg-white/10 text-white/90 hover:bg-white/20"
          aria-label="Tutup" @click="closeLightbox"
        >✕</button>

        <button
          v-if="photos.length > 1"
          class="absolute grid w-10 h-10 text-xl -translate-y-1/2 border-0 rounded-full cursor-pointer left-2 top-1/2 place-items-center bg-white/10 text-white/90 hover:bg-white/20 md:left-6"
          aria-label="Sebelumnya" @click.stop="lightboxPrev"
        >‹</button>
        <button
          v-if="photos.length > 1"
          class="absolute grid w-10 h-10 text-xl -translate-y-1/2 border-0 rounded-full cursor-pointer right-2 top-1/2 place-items-center bg-white/10 text-white/90 hover:bg-white/20 md:right-6"
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
  </SectionWrapper>
</template>

<style scoped>
.c-gallery__polaroid-item {
  border-radius: 4px;
  box-shadow: 0 12px 26px -14px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease;
}
.c-gallery__polaroid-item:hover { transform: rotate(0deg) scale(1.03); }

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
