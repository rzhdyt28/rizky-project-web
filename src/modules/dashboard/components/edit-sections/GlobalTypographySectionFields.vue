<script setup>
/** Global — Tipografi, Musik Latar, Override Warna. */
import { HEADING_FONTS, BODY_FONTS, SCRIPT_FONTS } from '../../composables/invitationFormOptions';

defineProps({
  form: { type: Object, required: true },
  uploading: { type: Object, required: true },
  handleUpload: { type: Function, required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Tipografi (Judul &amp; Isi)</summary>
    <datalist id="heading-fonts"><option v-for="f in HEADING_FONTS" :key="f" :value="f" /></datalist>
    <datalist id="body-fonts"><option v-for="f in BODY_FONTS" :key="f" :value="f" /></datalist>
    <datalist id="script-fonts"><option v-for="f in SCRIPT_FONTS" :key="f" :value="f" /></datalist>
    <div class="mt-3 grid gap-2 sm:grid-cols-3">
      <input v-model="form.theme_options.fonts.heading" list="heading-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font judul" />
      <input v-model.number="form.theme_options.type.title_size" type="number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ukuran judul (px)" />
      <input v-model="form.theme_options.type.title_color" type="color" class="h-9 rounded-lg border border-slate-200 dark:border-slate-700" />
      <input v-model="form.theme_options.fonts.body" list="body-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font isi" />
      <input v-model.number="form.theme_options.type.body_size" type="number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ukuran isi (px)" />
      <input v-model="form.theme_options.type.body_color" type="color" class="h-9 rounded-lg border border-slate-200 dark:border-slate-700" />
      <input v-model="form.theme_options.fonts.script" list="script-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font kaligrafi" />
      <input v-model="form.theme_options.fonts.css_url" type="url" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="URL CSS font (opsional)" />
    </div>
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Musik Latar (Premium+)</summary>
    <input type="file" accept="audio/mpeg,audio/mp3" class="mt-3 text-sm" @change="handleUpload($event, 'music', (p) => form.music_url = p)" />
    <span v-if="uploading.music" class="ml-2 text-xs opacity-60">Mengunggah…</span>
    <span v-else-if="form.music_url" class="ml-2 text-xs opacity-60">Tersimpan: {{ form.music_url }}</span>
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Override Warna</summary>
    <div class="mt-3 grid grid-cols-3 gap-2">
      <div>
        <label class="mb-1 block text-xs opacity-70">Aksen</label>
        <input v-model="form.theme_options.colors.accent" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Permukaan kartu</label>
        <input v-model="form.theme_options.colors.paper" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Teks</label>
        <input v-model="form.theme_options.colors.ink" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
    </div>
  </details>
</template>
