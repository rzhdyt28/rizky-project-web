<script setup>
/** Section 6 — Galeri. Isi foto dikelola di halaman "Galeri Foto". */
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

const ELEMENTS = [
  ['title', 'Judul section ("Galeri")'],
  ['caption', 'Kalimat pengantar'],
];
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
          <option value="circles">Circles (thumbnail bulat)</option>
          <option value="strip">Strip (scroll horizontal, swipe HP)</option>
          <option value="framed">Framed (1 kolom besar berbingkai)</option>
        </select>
        <p class="mt-1 text-[11px] opacity-60">Semua gaya sudah bisa di-swipe di HP dan punya paginasi.</p>
      </div>
      <textarea
        v-model="form.theme_options.gallery.caption"
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2"
        rows="2" placeholder="Kalimat pengantar (opsional, di bawah judul)"
      />
    </div>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.gallery.elements" :list="ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.gallery"
      :section-bg="form.theme_options.section_bg.gallery"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.gallery = $event"
    />
  </details>
</template>
