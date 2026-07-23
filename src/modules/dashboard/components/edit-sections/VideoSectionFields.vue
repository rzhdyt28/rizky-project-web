<script setup>
/** Section 7 — Video. */
import { ref, watch } from 'vue';
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

const props = defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
  handleUpload: { type: Function, required: true },
});

const ELEMENTS = [
  ['title', 'Judul section ("Video")'],
  ['eyebrow', 'Label kecil (mis. "Wedding Film")'],
  ['caption', 'Kalimat pengantar'],
  ['credit', 'Credit (nama & tanggal di bawah video)'],
];

/* Sumber video: link YouTube vs file upload lokal -- SALING EKSKLUSIF (sama
   seperti Filament) supaya tidak ada data video_url nyangkut dari mode lain.
   Ref lokal (bukan computed dari form.video_url) supaya radio-nya stabil
   dipilih user, lalu ganti sumber langsung mengosongkan field yang lain. */
const videoSource = ref(props.form.video_url && !/^https?:\/\//i.test(props.form.video_url) ? 'upload' : 'link');
watch(videoSource, () => { props.form.video_url = ''; });
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">7 — Section Video</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div class="flex items-center gap-4 text-sm sm:col-span-2">
        <label class="flex items-center gap-1"><input v-model="videoSource" type="radio" value="link" /> Link YouTube</label>
        <label class="flex items-center gap-1"><input v-model="videoSource" type="radio" value="upload" /> Upload file video</label>
      </div>
      <input
        v-if="videoSource === 'link'"
        v-model="form.video_url" type="url"
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2"
        placeholder="URL video YouTube"
      />
      <div v-else class="sm:col-span-2">
        <input type="file" accept="video/mp4" class="text-sm" @change="handleUpload($event, 'videos', (p) => form.video_url = p)" />
        <p class="mt-1 text-[11px] opacity-60">Upload file .mp4 (maks. 50MB) -- dipakai kalau tidak punya link YouTube.</p>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Model tampilan</label>
        <select v-model="form.theme_options.video.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="classic">1. Classic — 16:9, eyebrow &amp; caption di atas</option>
          <option value="cinematic">2. Cinematic — lebar 21:9 gelap</option>
          <option value="framed">3. Framed — bingkai ornamen tebal</option>
        </select>
      </div>
      <input v-model="form.theme_options.video.eyebrow" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Eyebrow (mis. Wedding Film)" />
      <textarea v-model="form.theme_options.video.caption" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Kalimat pengantar" />
    </div>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.video.elements" :list="ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.video"
      :section-bg="form.theme_options.section_bg.video"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.video = $event"
    />
  </details>
</template>
