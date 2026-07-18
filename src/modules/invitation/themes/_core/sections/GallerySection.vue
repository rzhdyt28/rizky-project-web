<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  photos: { type: Array, default: () => [] },
  labels: { type: Object, required: true },
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

/* ---- Lightbox (popup) saat foto diklik ----
 * Indeksnya "flat" merujuk ke props.photos, bukan ke grup slide,
 * jadi tombol prev/next di dalam popup bisa menjelajah SEMUA foto,
 * tidak terbatas pada 4 foto di slide yang sedang aktif. */
const lightboxIndex = ref(null); // null = tertutup

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

    <!-- Lightbox: popup full-screen saat sebuah foto diklik -->
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