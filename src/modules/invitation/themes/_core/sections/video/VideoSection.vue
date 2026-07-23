<script setup>
/**
 * _CORE / Video — DISPATCHER. Deteksi sumber (link YouTube vs file upload
 * lokal) dan data bersama (eyebrow, caption, credit) dipakai semua gaya,
 * tetap di sini. Tambah gaya baru: buat VideoStyle<Nama>.vue di folder ini,
 * daftarkan di map STYLES di bawah, tambah opsi ke
 * ThemeOptionsSchema::VIDEO_STYLES (backend).
 */
import { computed } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import { toEmbedUrl } from '../../../../composables/useThemeOptions';
import { assetUrl } from '../../../../composables/assets';
import VideoStyleClassic from './VideoStyleClassic.vue';
import VideoStyleCinematic from './VideoStyleCinematic.vue';
import VideoStyleFramed from './VideoStyleFramed.vue';

const props = defineProps({
  videoUrl:   { type: String, default: null },
  labels:     { type: Object, required: true },
  invitation: { type: Object, default: () => ({}) },
  opts:       { type: Object, default: () => ({}) }, // { eyebrow, caption, style }
});

const eyebrow = computed(() => props.opts.eyebrow || 'Wedding Film');
const caption = computed(
  () => props.opts.caption
    || 'Sepenggal momen perjalanan kami menuju hari bahagia. Selamat menyaksikan.'
);

/* Upload lokal (path relatif, mis. "videos/xxxx.mp4") vs link YouTube (http...). */
const isLocalFile = computed(() => !!props.videoUrl && !/^https?:\/\//i.test(props.videoUrl));
const embedSrc = computed(() => (isLocalFile.value ? assetUrl(props.videoUrl) : toEmbedUrl(props.videoUrl)));

const creditDate = computed(() => {
  const d = props.invitation?.events?.[0]?.starts_at;
  return d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
});

const STYLES = {
  classic: VideoStyleClassic,
  cinematic: VideoStyleCinematic,
  framed: VideoStyleFramed,
};
const activeStyle = computed(() => STYLES[props.opts.style] ?? VideoStyleClassic);
</script>

<template>
  <SectionWrapper v-if="videoUrl" :title="labels.title_video">
    <component
      :is="activeStyle"
      :eyebrow="eyebrow"
      :caption="caption"
      :embed-src="embedSrc"
      :is-local-file="isLocalFile"
      :invitation="invitation"
      :credit-date="creditDate"
    />
  </SectionWrapper>
</template>
