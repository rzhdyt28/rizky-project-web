<script setup>
/**
 * _CORE / Kisah Kami — 4 MODEL, dipilih dari Filament (love_story.style):
 *   stacked  : daftar polos bertumpuk (perilaku lama, default)
 *   timeline : garis putus-putus vertikal + penanda hati, kartu foto+teks
 *              di tiap simpul (ref desain "Kisah Cinta" bergaya album senja)
 *   alternate: zigzag kiri-kanan terhubung garis vertikal di tengah (desktop),
 *              bertumpuk di HP
 *   polaroid : kartu foto miring ala polaroid/scrapbook, selang-seling
 * SEMUA model menghormati toggle "Tampilkan foto kisah" (showPhotos) — kalau
 * mati, tetap tampil sebagai teks (tanggal/judul/cerita) tanpa foto. Foto
 * dipakai LIGHTBOX yang sama di semua model (klik foto -> popup, panah, Esc).
 * Tiap simpul (timeline/alternate) punya animasi masuk sendiri lewat
 * v-reveal, terpisah dari animasi section secara keseluruhan.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';
import { vReveal } from '../../../composables/useReveal';

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
    <!-- ============ 1) STACKED (default, perilaku lama) ============ -->
    <div v-if="styleName === 'stacked'" class="grid max-w-md gap-6 mx-auto c-story__list">
      <article v-for="story in stories" :key="story.id" class="text-left c-story__item">
        <button
          v-if="showPhotos && story.photo"
          type="button"
          class="block w-full p-0 mb-3 overflow-hidden border-0 cursor-pointer rounded-xl"
          @click="openLightbox(story)"
        >
          <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-[4/3] w-full object-cover" />
        </button>
        <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
          {{ dateLong(story.happened_at) }}
        </p>
        <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
        <p class="text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
      </article>
    </div>

    <!-- ============ 2) TIMELINE — garis putus-putus + penanda hati ============ -->
    <div v-else-if="styleName === 'timeline'" class="relative max-w-md mx-auto c-story__timeline">
      <span class="c-story__spine" aria-hidden="true" />
      <article
        v-for="story in stories" :key="story.id"
        v-reveal="{ preset: 'fade-up', y: 36 }"
        class="relative pb-10 text-center c-story__tl-item last:pb-0"
      >
        <span class="relative z-10 grid mx-auto mb-4 c-story__node place-items-center">♥</span>
        <button
          v-if="showPhotos && story.photo"
          type="button"
          class="block w-full max-w-xs p-0 mx-auto mb-3 overflow-hidden border-0 cursor-pointer c-story__tl-card"
          @click="openLightbox(story)"
        >
          <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-[4/5] w-full object-cover" />
        </button>
        <div class="max-w-xs mx-auto" :class="{ 'c-story__tl-card c-story__tl-card--text px-4 py-4': !(showPhotos && story.photo) }">
          <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
            {{ dateLong(story.happened_at) }}
          </p>
          <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
          <p class="text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
        </div>
      </article>
    </div>

    <!-- ============ 3) ALTERNATE — zigzag kiri-kanan, garis di tengah (desktop) ============ -->
    <div class="relative max-w-2xl mx-auto c-story__alt" v-else-if="styleName === 'alternate'">
      <span class="c-story__spine c-story__spine--alt" aria-hidden="true" />
      <article
        v-for="(story, i) in stories" :key="story.id"
        v-reveal="{ preset: i % 2 === 0 ? 'fade-right' : 'fade-left', x: i % 2 === 0 ? -50 : 50 }"
        class="relative flex flex-col items-center gap-4 pb-10 c-story__alt-item last:pb-0 sm:flex-row"
        :class="i % 2 === 1 ? 'sm:flex-row-reverse' : ''"
      >
        <span class="absolute z-10 hidden -translate-x-1/2 c-story__node c-story__node--sm left-1/2 sm:grid place-items-center" aria-hidden="true">♥</span>
        <button
          v-if="showPhotos && story.photo"
          type="button"
          class="block w-full max-w-[13rem] flex-1 overflow-hidden rounded-2xl border-0 p-0 cursor-pointer c-story__tl-card mx-auto sm:mx-0"
          @click="openLightbox(story)"
        >
          <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-[4/3] w-full object-cover" />
        </button>
        <div class="flex-1 max-w-xs mx-auto text-center sm:mx-0" :class="i % 2 === 0 ? 'sm:text-left' : 'sm:text-right'">
          <p v-if="story.happened_at" class="c-story__date mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
            {{ dateLong(story.happened_at) }}
          </p>
          <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
          <p class="text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
        </div>
      </article>
    </div>

    <!-- ============ 4) POLAROID — kartu foto miring ala scrapbook ============ -->
    <div v-else-if="styleName === 'polaroid'" class="grid max-w-md gap-8 mx-auto c-story__polaroid">
      <article
        v-for="(story, i) in stories" :key="story.id"
        v-reveal="{ preset: 'zoom', scale: 0.94 }"
        class="text-center c-story__poly-item"
      >
        <button
          v-if="showPhotos && story.photo"
          type="button"
          class="block p-2 pb-6 mx-auto bg-white border-0 cursor-pointer c-story__poly-card"
          :class="i % 2 === 0 ? 'rotate-[-3deg]' : 'rotate-[3deg]'"
          @click="openLightbox(story)"
        >
          <img :src="assetUrl(story.photo)" :alt="story.title" loading="lazy" class="aspect-square w-56 max-w-full object-cover" />
        </button>
        <p v-if="story.happened_at" class="c-story__date mt-3 mb-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
          {{ dateLong(story.happened_at) }}
        </p>
        <h4 class="mb-1 text-lg c-story__title" :style="{ fontFamily: 'var(--t-font-head)' }">{{ story.title }}</h4>
        <p class="max-w-xs mx-auto text-sm leading-relaxed c-story__text opacity-90">{{ story.story }}</p>
      </article>
    </div>

    <!-- ============ LIGHTBOX (hanya kisah berfoto) — dipakai semua model ============ -->
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
          <img :src="assetUrl(currentStory.photo)" :alt="currentStory.title" class="max-h-[85vh] max-w-full object-contain" />
          <figcaption class="mt-2 text-sm text-center text-white/80">{{ currentStory.title }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </SectionWrapper>
</template>

<style scoped>
.c-story__date  { color: var(--t-gold, #b08d4a); }
.c-story__title { color: var(--t-accent); }

/* ===== garis putus-putus bersama (timeline & alternate) ===== */
.c-story__spine {
  position: absolute;
  top: 0.5rem; bottom: 0.5rem; left: 50%;
  width: 0; border-left: 2px dotted color-mix(in srgb, var(--t-accent) 45%, transparent);
  transform: translateX(-50%);
  z-index: 0;
}
.c-story__spine--alt { display: none; }
@media (min-width: 640px) { .c-story__spine--alt { display: block; } }

.c-story__node {
  width: 1.9rem; height: 1.9rem; border-radius: 9999px;
  background: var(--t-paper); color: var(--t-accent);
  border: 1.5px solid color-mix(in srgb, var(--t-accent) 55%, transparent);
  font-size: 0.9rem; line-height: 1;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.25);
}
.c-story__node--sm { width: 1.6rem; height: 1.6rem; font-size: 0.75rem; }

/* ===== kartu foto (timeline & alternate) ===== */
.c-story__tl-card {
  border-radius: 1.25rem;
  box-shadow: 0 16px 34px -18px rgba(0, 0, 0, 0.45);
  background: var(--t-paper);
}
.c-story__tl-card--text {
  border: 1px solid color-mix(in srgb, var(--t-accent) 18%, transparent);
}

/* ===== polaroid ===== */
.c-story__poly-card {
  border-radius: 4px;
  box-shadow: 0 14px 28px -16px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease;
}
.c-story__poly-card:hover { transform: rotate(0deg) scale(1.03); }
</style>
