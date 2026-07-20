<script setup>
/** Section 8 — RSVP dan Section 9 — Ucapan & Doa (Guestbook). Keduanya
 * cuma toggle aktif + tampilan section, jadi digabung satu file. */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">8 — Section RSVP</summary>
    <label class="mt-2 flex items-center gap-2 text-sm">
      <input v-model="form.rsvp_enabled" type="checkbox" /> RSVP aktif
    </label>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.rsvp" :invitation-id="invitationId" />
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">9 — Section Ucapan &amp; Doa</summary>
    <label class="mt-2 flex items-center gap-2 text-sm">
      <input v-model="form.guestbook_enabled" type="checkbox" /> Buku ucapan aktif
    </label>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.guestbook" :invitation-id="invitationId" />
  </details>
</template>
