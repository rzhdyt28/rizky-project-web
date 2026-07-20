<script setup>
/** Section 3 — Acara. Isi acara itu sendiri dikelola di halaman "Acara"; di
 * sini hanya visibilitas & tampilan section. */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">3 — Section Acara</summary>
    <p class="mt-2 text-xs opacity-60">Isi acara (Akad, Resepsi, tanggal, lokasi) dikelola di halaman "Acara".</p>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.events.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="card">1. Card — panel bertepi (default)</option>
        <option value="elegant">2. Elegant — flourish &amp; tipografi vintage</option>
        <option value="timeline">3. Timeline — garis putus-putus + penanda</option>
        <option value="minimal">4. Minimal — tanpa kotak, garis tipis</option>
      </select>
    </label>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.events" :invitation-id="invitationId" />
  </details>
</template>
