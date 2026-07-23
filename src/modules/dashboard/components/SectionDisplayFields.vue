<script setup>
/**
 * Mencerminkan InvitationLookResource::sectionDisplayFields() Filament: trio
 * kartu (mix)/gaya kartu/background section. `section` = objek reaktif
 * theme_options.sections.{key} (dimutasi langsung).
 * CATATAN: background "tanpa kartu" disimpan di theme_options.section_bg.{key}
 * (SIBLING dari `sections`, bukan di dalamnya) -- makanya component ini juga
 * menerima prop terpisah `sectionBg` (v-model via update:sectionBg). Background
 * "di dalam kartu" (v5) adalah field TERPISAH (section.card_bg_photo),
 * independen dari section_bg, tidak perlu prop tambahan karena sudah bagian
 * dari `section` yang sama.
 */
import { ref } from 'vue';
import { CARD_STYLES } from '../composables/invitationFormOptions';
import { uploadThemeFile } from '../../invitation/composables/useThemeUpload';

const props = defineProps({
  section: { type: Object, required: true },
  sectionBg: { type: String, default: '' },
  invitationId: { type: [Number, String], required: true },
});
const emit = defineEmits(['update:sectionBg']);

const uploading = ref(false);
async function onBgFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try { emit('update:sectionBg', await uploadThemeFile(props.invitationId, file, 'section-bg')); }
  finally { uploading.value = false; }
}

const uploadingCard = ref(false);
async function onCardBgFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadingCard.value = true;
  try { props.section.card_bg_photo = await uploadThemeFile(props.invitationId, file, 'section-bg'); }
  finally { uploadingCard.value = false; }
}
</script>

<template>
  <div class="grid gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700 sm:grid-cols-2">
    <p class="text-xs font-medium opacity-70 sm:col-span-2">Tampilan section (kartu, background)</p>
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
    <div>
      <label class="mb-1 block text-xs opacity-70">Warna kartu section ini</label>
      <input v-model="section.card_bg" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      <p class="mt-1 text-[11px] opacity-60">Menimpa warna kartu global HANYA untuk section ini. Berguna kalau gaya kartu Glass/Outline/Gradient (tembus pandang) tercampur warna background foto/video.</p>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Background section (mode tanpa kartu)</label>
      <input type="file" accept="image/*" class="text-sm" @change="onBgFile" />
      <span v-if="uploading" class="ml-2 text-xs opacity-60">Mengunggah…</span>
      <span v-else-if="sectionBg" class="ml-2 text-xs opacity-60">Tersimpan ✓</span>
      <p class="mt-1 text-[11px] opacity-60">Latar section PENUH -- hanya kalau section ini TANPA kartu.</p>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Background di dalam kartu</label>
      <input type="file" accept="image/*" class="text-sm" @change="onCardBgFile" />
      <span v-if="uploadingCard" class="ml-2 text-xs opacity-60">Mengunggah…</span>
      <span v-else-if="section.card_bg_photo" class="ml-2 text-xs opacity-60">Tersimpan ✓</span>
      <p class="mt-1 text-[11px] opacity-60">Foto TERPISAH, khusus tampil DI DALAM kartu -- hanya kalau section ini BERKARTU.</p>
    </div>
    <div>
      <label class="mb-1 block text-xs opacity-70">Warna background section ini</label>
      <input v-model="section.bg_color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      <p class="mt-1 text-[11px] opacity-60">Tampil di belakang section ini, berkartu maupun tanpa kartu.</p>
    </div>
  </div>
</template>
