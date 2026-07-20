<script setup>
/** Section 5 — Kisah Kami. Isi kisah dikelola di halaman "Kisah Cinta". */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">5 — Section Kisah Kami</summary>
    <p class="mt-2 text-xs opacity-60">Isi kisah dikelola di halaman "Kisah Cinta".</p>
    <label class="mt-2 flex items-center gap-2 text-sm">
      <input v-model="form.theme_options.love_story.show_photos" type="checkbox" /> Tampilkan foto kisah
    </label>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.love_story.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="stacked">1. Stacked — daftar polos bertumpuk (default)</option>
        <option value="timeline">2. Timeline — garis putus-putus + penanda hati</option>
        <option value="alternate">3. Alternate — zigzag kiri-kanan</option>
        <option value="polaroid">4. Polaroid — kartu foto miring ala scrapbook</option>
      </select>
    </label>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.love_story" :invitation-id="invitationId" />
  </details>
</template>
