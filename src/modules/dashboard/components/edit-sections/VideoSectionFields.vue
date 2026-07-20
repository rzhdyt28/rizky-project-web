<script setup>
/** Section 7 — Video. */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">7 — Section Video</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <input v-model="form.video_url" type="url" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="URL video YouTube" />
      <input v-model="form.theme_options.video.eyebrow" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Eyebrow (mis. Wedding Film)" />
      <textarea v-model="form.theme_options.video.caption" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Kalimat pengantar" />
    </div>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.video" :invitation-id="invitationId" />
  </details>
</template>
