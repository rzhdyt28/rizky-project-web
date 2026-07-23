<script setup>
/** Section 4 — Countdown (isi). */
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
  handleUpload: { type: Function, required: true },
});

const ELEMENTS = [
  ['eyebrow', 'Label "Menuju hari bahagia"'],
  ['date', 'Tanggal (khusus isi "Tanggal")'],
  ['quote', 'Kutipan (khusus isi "Kutipan")'],
  ['label', 'Label Hari/Jam/Menit/Detik'],
];
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">4 — Section Countdown (isi)</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs opacity-70">Gaya angka</label>
        <select v-model="form.theme_options.countdown.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="circle">Bulat</option>
          <option value="boxed">Kotak berbingkai</option>
          <option value="minimal">Minimal</option>
          <option value="pill">Pil memanjang</option>
          <option value="flip">Flip clock</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Isi section</label>
        <select v-model="form.theme_options.countdown.layout" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="simple">Sederhana</option>
          <option value="photo">Foto + nama pasangan</option>
          <option value="date">Tanggal besar</option>
          <option value="quote">Kutipan pembuka</option>
        </select>
      </div>
      <div v-if="form.theme_options.countdown.layout === 'photo'">
        <label class="mb-1 block text-xs opacity-70">Foto latar countdown</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'section-bg', (p) => form.theme_options.countdown.photo = p)" />
      </div>
      <textarea v-if="form.theme_options.countdown.layout === 'quote'" v-model="form.theme_options.countdown.quote" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Teks kutipan" />
    </div>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.countdown.elements" :list="ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.countdown"
      :section-bg="form.theme_options.section_bg.countdown"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.countdown = $event"
    />
  </details>
</template>
