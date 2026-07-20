<script setup>
/**
 * Mencerminkan InvitationResource::sectionDisplayFields() Filament: trio
 * kartu (mix)/gaya kartu/background, plus tipografi per-section (Fase 1).
 * `section` = objek reaktif theme_options.sections.{key} (dimutasi langsung,
 * bukan lewat emit — sama seperti pola Filament's array field).
 */
import { ref } from 'vue';
import { uploadThemeFile } from '../../invitation/composables/useThemeUpload';

const props = defineProps({
  section: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

const CARD_STYLES = {
  glass: 'Glass — kaca buram (blur)', outline: 'Outline — garis tepi, tanpa isi',
  flat: 'Flat — polos tanpa shadow', gradient: 'Gradient — gradasi lembut',
  stamp: 'Stamp — tepi perangko', default: 'Polos bawaan tema',
};

const uploading = ref(false);
async function onBgFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try { props.section.section_bg = await uploadThemeFile(props.invitationId, file, 'section-bg'); }
  finally { uploading.value = false; }
}
</script>

<template>
  <div class="grid gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700 sm:grid-cols-2">
    <div>
      <label class="mb-1 block text-xs opacity-70">Kartu section ini</label>
      <select v-model="section.card" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="">Ikut pengaturan global</option>
        <option value="on">Selalu pakai kartu</option>
        <option value="off">Tanpa kartu (full)</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Gaya kartu section ini</label>
      <select v-model="section.card_style" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="">Ikut gaya global</option>
        <option v-for="(label, v) in CARD_STYLES" :key="v" :value="v">{{ label }}</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Tinggi section ini</label>
      <select v-model="section.height" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="">Ikut pengaturan global</option>
        <option value="full">Satu layar penuh</option>
        <option value="auto">Setinggi konten (tanpa gap)</option>
        <option value="smart">Otomatis (penuh jika ada background)</option>
      </select>
    </div>
    <div class="sm:col-span-2">
      <label class="mb-1 block text-xs opacity-70">Background section (mode tanpa kartu)</label>
      <input type="file" accept="image/*" class="text-sm" @change="onBgFile" />
      <span v-if="uploading" class="ml-2 text-xs opacity-60">Mengunggah…</span>
      <span v-else-if="section.section_bg" class="ml-2 text-xs opacity-60">Tersimpan: {{ section.section_bg }}</span>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Font judul section ini</label>
      <input v-model="section.font_heading" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ikut font global" />
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Font isi section ini</label>
      <input v-model="section.font_body" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ikut font global" />
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Ukuran judul (px)</label>
      <input v-model="section.title_size" type="number" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Warna judul</label>
      <input v-model="section.title_color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Ukuran isi (px)</label>
      <input v-model="section.body_size" type="number" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Warna isi</label>
      <input v-model="section.body_color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
    </div>
  </div>
</template>
