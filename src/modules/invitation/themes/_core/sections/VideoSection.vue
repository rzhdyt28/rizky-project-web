<script setup>
/**
 * _CORE / Video (v3) — bukan iframe polos lagi. Struktur yang direkomendasikan
 * & diimplementasikan:
 *   1. Eyebrow kecil ("Wedding Film" — bisa diganti dari Filament)
 *   2. Judul section (label title_video)
 *   3. Kalimat pengantar (video.caption; ada default hangat bila kosong)
 *   4. Video embed
 *   5. Credit line otomatis: nama pasangan + tanggal acara pertama
 */
import { computed } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { toEmbedUrl } from '../../../composables/useThemeOptions';

const props = defineProps({
  videoUrl:   { type: String, default: null },
  labels:     { type: Object, required: true },
  invitation: { type: Object, default: () => ({}) },
  opts:       { type: Object, default: () => ({}) }, // { eyebrow, caption }
});

const eyebrow = computed(() => props.opts.eyebrow || 'Wedding Film');
const caption = computed(
  () => props.opts.caption
    || 'Sepenggal momen perjalanan kami menuju hari bahagia. Selamat menyaksikan.'
);

const creditDate = computed(() => {
  const d = props.invitation?.events?.[0]?.starts_at;
  return d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
});
</script>

<template>
  <SectionWrapper v-if="videoUrl" :title="labels.title_video">
    <p class="c-video__eyebrow -mt-4 mb-1 text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">
      {{ eyebrow }}
    </p>
    <p class="max-w-md mx-auto mb-5 text-sm italic c-video__caption opacity-90">
      {{ caption }}
    </p>
    <div class="max-w-md mx-auto overflow-hidden border rounded-lg aspect-video"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
    >
      <iframe
        :src="toEmbedUrl(videoUrl)"
        class="w-full h-full border-0"
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <p class="c-video__credit mt-4 text-xs uppercase tracking-[0.2em] opacity-70">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      <template v-if="creditDate"> · {{ creditDate }}</template>
    </p>
  </SectionWrapper>
</template>
