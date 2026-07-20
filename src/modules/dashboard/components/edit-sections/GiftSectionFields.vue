<script setup>
/** Section 10 — Kado. Isi rekening/e-wallet/QRIS dikelola di halaman "Kado Digital". */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">10 — Section Kado</summary>
    <p class="mt-2 text-xs opacity-60">Isi rekening/e-wallet/QRIS dikelola di halaman "Kado Digital".</p>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.gift" :invitation-id="invitationId" />
  </details>
</template>
