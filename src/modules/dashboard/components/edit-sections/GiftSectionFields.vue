<script setup>
/** Section 10 — Kado. Isi rekening/e-wallet/QRIS dikelola di halaman "Kado Digital". */
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

const ELEMENTS = [
  ['title', 'Judul section ("Hadiah Digital")'],
  ['name', 'Judul kado (mis. nama bank/QRIS)'],
  ['value', 'Nomor rekening / alamat'],
];
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">10 — Section Kado</summary>
    <p class="mt-2 text-xs opacity-60">Isi rekening/e-wallet/QRIS dikelola di halaman "Kado Digital".</p>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.gift.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="panel">1. Panel — kartu bertepi putus-putus (default)</option>
        <option value="stack">2. Stack — daftar padat dengan ikon</option>
        <option value="ticket">3. Ticket — kartu ala tiket sobek</option>
      </select>
    </label>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.gift.elements" :list="ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.gift"
      :section-bg="form.theme_options.section_bg.gift"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.gift = $event"
    />
  </details>
</template>
