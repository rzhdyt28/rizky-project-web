<script setup>
/** Section 8 — RSVP dan Section 9 — Ucapan & Doa (Guestbook). Keduanya
 * cuma toggle aktif + tampilan section, jadi digabung satu file. */
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

const RSVP_ELEMENTS = [
  ['title', 'Judul section ("Konfirmasi Kehadiran")'],
  ['button', 'Tombol/chip kehadiran (independen dari warna aksen tema)'],
];
const GUESTBOOK_ELEMENTS = [
  ['title', 'Judul section ("Ucapan & Doa")'],
  ['name', 'Nama penulis ucapan'],
  ['text', 'Isi ucapan'],
];
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">8 — Section RSVP</summary>
    <label class="mt-2 flex items-center gap-2 text-sm">
      <input v-model="form.rsvp_enabled" type="checkbox" /> RSVP aktif
    </label>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.rsvp.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="card">1. Card — panel bertepi (default)</option>
        <option value="minimal">2. Minimal — tanpa kotak, underline tipis</option>
        <option value="chips">3. Chips — kehadiran dipilih via tombol</option>
      </select>
    </label>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.rsvp.elements" :list="RSVP_ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.rsvp"
      :section-bg="form.theme_options.section_bg.rsvp"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.rsvp = $event"
    />
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">9 — Section Ucapan &amp; Doa</summary>
    <label class="mt-2 flex items-center gap-2 text-sm">
      <input v-model="form.guestbook_enabled" type="checkbox" /> Buku ucapan aktif
    </label>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.guestbook.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="list">1. List — form di atas, daftar bertumpuk (default)</option>
        <option value="wall">2. Wall — daftar jadi kartu 2 kolom</option>
        <option value="quotes">3. Quotes — tiap ucapan ala kutipan</option>
      </select>
    </label>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.guestbook.elements" :list="GUESTBOOK_ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.guestbook"
      :section-bg="form.theme_options.section_bg.guestbook"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.guestbook = $event"
    />
  </details>
</template>
