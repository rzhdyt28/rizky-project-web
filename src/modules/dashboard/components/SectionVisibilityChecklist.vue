<script setup>
/**
 * Checklist "Section Aktif" — SATU tempat terpusat untuk nyala/mati tiap
 * section (dulu tersebar sebagai checkbox "Tampilkan section" di dalam
 * masing-masing section 2-11). Belum pernah diubah -> tetap dianggap AKTIF
 * (lihat blankSection()/deepMerge() di useInvitationForm.js: key yang tidak
 * ada di data tersimpan TIDAK menimpa default `visible: true`).
 */
defineProps({
  form: { type: Object, required: true },
});

const SECTIONS = [
  ['couple', 'Mempelai'],
  ['events', 'Acara'],
  ['countdown', 'Countdown (isi)'],
  ['countdown_hero', 'Countdown di Hero'],
  ['love_story', 'Kisah Kami'],
  ['gallery', 'Galeri'],
  ['video', 'Video'],
  ['rsvp', 'RSVP'],
  ['guestbook', 'Ucapan & Doa'],
  ['gift', 'Kado'],
  ['co_host', 'Turut Mengundang'],
];
</script>

<template>
  <details open class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Section Aktif</summary>
    <p class="mt-2 text-xs opacity-60">Nyala/mati tiap section untuk undangan ini. Section Hero selalu tampil.</p>
    <div class="mt-3 grid gap-2 sm:grid-cols-3">
      <label
        v-for="[key, label] in SECTIONS" :key="key"
        class="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
      >
        <span>{{ label }}</span>
        <input v-model="form.theme_options.sections[key].visible" type="checkbox" />
      </label>
    </div>
  </details>
</template>
