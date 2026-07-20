<script setup>
/** "Data Mempelai" + Section 2 — Mempelai. */
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
  handleUpload: { type: Function, required: true },
});
</script>

<template>
  <details open class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Data Mempelai</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <input v-model="form.groom_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Mempelai Pria" required />
      <input v-model="form.bride_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Mempelai Wanita" required />
      <input v-model="form.groom_parents" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Orang Tua Pria" />
      <input v-model="form.bride_parents" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Orang Tua Wanita" />
      <textarea v-model="form.opening_text" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Teks pembuka" />
    </div>
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">2 — Section Mempelai</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs opacity-70">Desain tampilan</label>
        <select v-model="form.theme_options.couple.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="">Classic (default)</option>
          <option value="cards">Cards</option>
          <option value="circle">Circle</option>
          <option value="arch">Arch</option>
        </select>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.theme_options.couple.show_photos" type="checkbox" /> Tampilkan foto mempelai
      </label>
      <template v-if="form.theme_options.couple.show_photos">
        <div>
          <label class="mb-1 block text-xs opacity-70">Foto Mempelai Pria</label>
          <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'couple', (p) => form.theme_options.couple.groom_photo = p)" />
        </div>
        <div>
          <label class="mb-1 block text-xs opacity-70">Foto Mempelai Wanita</label>
          <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'couple', (p) => form.theme_options.couple.bride_photo = p)" />
        </div>
      </template>
    </div>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.couple" :invitation-id="invitationId" />
  </details>
</template>
