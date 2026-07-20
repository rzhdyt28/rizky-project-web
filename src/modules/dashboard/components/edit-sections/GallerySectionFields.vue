<script setup>
/** Section 6 — Galeri. Isi foto dikelola di halaman "Galeri Foto". */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">6 — Section Galeri</summary>
    <p class="mt-2 text-xs opacity-60">Isi foto dikelola di halaman "Galeri Foto".</p>
    <div class="mt-2 grid gap-2 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs opacity-70">Model galeri</label>
        <select v-model="form.theme_options.gallery.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="carousel">Carousel</option>
          <option value="grid">Grid</option>
          <option value="masonry">Masonry</option>
          <option value="polaroid">Polaroid</option>
          <option value="floating">Floating (thumbnail + panah)</option>
        </select>
      </div>
    </div>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.gallery" :invitation-id="invitationId" />
  </details>
</template>
