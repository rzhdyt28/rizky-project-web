<script setup>
/**
 * _CORE / Kisah Kami — daftar kisah (StoriesRelationManager: title,
 * happened_at, story, photo opsional per-kisah). Foto TIAP kisah hanya
 * tampil kalau showPhotos true (toggle "Tampilkan foto kisah" di Filament,
 * theme_options.love_story.show_photos) — menyalakan/mematikan SEMUA foto
 * kisah sekaligus, foto per-kisah diupload di tab "Kisah Cinta".
 * Klik foto -> lightbox (sama pola dengan GallerySection).
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  stories:    { type: Array, default: () => [] },
  labels:     { type: Object, required: true },
  showPhotos: { type: Boolean, default: false },
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

watch(currentStory, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
onBeforeUnmount(() => { document.body.style.overflow = ''; });

function dateLong(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
</script>

<template>
  <SectionWrapper v-if="stories?.length" :title="labels.title_story">
    <div class="grid max-w-md gap-6 mx-auto c-story__list">
      <article v-for="story in stories" :key="story.id" class="text-left c-story__item">
        <button
          v-if="showPhotos && story.photo"
          type="button"
          class="block w-full p-0 mb-3 overflow-hidden border-0 cursor-pointer rounded-xl"
          @click="openLightbox(story)"
        >
          <img
            :src="assetUrl(story.photo)"
            :alt="story.title"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover"
          />
        </button>
        <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
          {{ dateLong(story.happened_at) }}
        </p>
        <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">
          {{ story.title }}
        </h4>
        <p class="text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
      </article>
    </div>

    <!-- ============ LIGHTBOX (hanya kisah berfoto) ============ -->
    <Teleport to="body">
      <div
        v-if="currentStory"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4"
        @click.self="closeLightbox"
      >
        <button
          class="absolute grid text-lg border-0 rounded-full cursor-pointer right-4 top-4 h-9 w-9 place-items-center bg-white/10 text-white/90 hover:bg-white/20"
          aria-label="Tutup" @click="closeLightbox"
        >✕</button>

        <button
          v-if="photoStories.length > 1"
          class="absolute grid w-10 h-10 text-xl -translate-y-1/2 border-0 rounded-full cursor-pointer left-2 top-1/2 place-items-center bg-white/10 text-white/90 hover:bg-white/20 md:left-6"
          aria-label="Sebelumnya" @click.stop="lightboxPrev"
        >‹</button>
        <button
          v-if="photoStories.length > 1"
          class="absolute grid w-10 h-10 text-xl -translate-y-1/2 border-0 rounded-full cursor-pointer right-2 top-1/2 place-items-center bg-white/10 text-white/90 hover:bg-white/20 md:right-6"
          aria-label="Berikutnya" @click.stop="lightboxNext"
        >›</button>

        <figure class="max-h-[85vh] max-w-full">
          <img
            :src="assetUrl(currentStory.photo)"
            :alt="currentStory.title"
            class="max-h-[85vh] max-w-full object-contain"
          />
          <figcaption class="mt-2 text-sm text-center text-white/80">{{ currentStory.title }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </SectionWrapper>
</template>

<style scoped>
.c-story__date  { color: var(--t-gold, #b08d4a); }
.c-story__title { color: var(--t-accent); }
</style>
