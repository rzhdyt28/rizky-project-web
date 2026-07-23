<script setup>
/** Section 1 — Hero (Sampul). `form` adalah objek reaktif penuh dari
 * useInvitationForm, dimutasi langsung (sama seperti pola SectionDisplayFields).
 * Background foto/slideshow/video PINDAH ke Global (lihat GlobalStyleSectionFields.vue) --
 * bersifat halaman penuh, bukan cuma hero. */
import { CARD_STYLES } from '../../composables/invitationFormOptions';
import SectionDisplayFields from '../SectionDisplayFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
  handleUpload: { type: Function, required: true },
});

const HERO_ELEMENTS = [
  ['eyebrow', 'Label "Undangan Pernikahan"'],
  ['photo', 'Foto berbingkai (upload di bawah)'],
  ['names', 'Nama pasangan'],
  ['date', 'Tanggal acara'],
  ['countdown', 'Countdown'],
  ['dresscode', 'Dress code'],
  ['guest', 'Kepada (nama tamu)'],
  ['button', 'Tombol "Buka Undangan"'],
];

/* Elemen teks yang punya font+ukuran+warna sendiri (semua KECUALI photo/countdown -- tidak punya teks). */
const HERO_TEXT_ELEMENTS = [
  ['eyebrow', 'Label "Undangan Pernikahan"'],
  ['names', 'Nama pasangan'],
  ['date', 'Tanggal acara'],
  ['countdown_label', 'Label "Menuju hari bahagia" (countdown di hero)'],
  ['dresscode', 'Dress code'],
  ['guest', 'Kepada (nama tamu)'],
  ['button', 'Tombol "Buka Undangan"'],
];
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">1 — Section Hero (Sampul)</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs opacity-70">Model tampilan hero</label>
        <select v-model="form.theme_options.hero.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="classic">1. Classic — nama &amp; tanggal bertumpuk (default)</option>
          <option value="framed">2. Framed — foto bulat berbingkai di atas nama</option>
          <option value="split">3. Split — teks &amp; foto berbingkai dua kolom</option>
          <option value="minimal">4. Minimal — nama besar + garis tipis, sangat bersih</option>
          <option value="arch">5. Arch — foto besar berbingkai lengkung</option>
          <option value="monogram">6. Monogram — inisial besar, sangat minimalis</option>
          <option value="polaroid">7. Polaroid — foto gaya polaroid miring</option>
          <option value="custom">8. Custom — atur urutan &amp; rata tiap elemen sendiri</option>
        </select>
        <p class="mt-1 text-xs opacity-60">Model Framed/Split/Custom/Arch/Polaroid memakai "Foto Berbingkai" di bawah -- WAJIB diisi, kalau tidak foto tidak akan tampil (field ini TERPISAH dari background halaman di Global).</p>
      </div>
      <div
        v-if="['framed', 'split', 'custom', 'arch', 'polaroid'].includes(form.theme_options.hero.style)"
        class="sm:col-span-2"
      >
        <label class="mb-1 block text-xs opacity-70">Foto Berbingkai Hero</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'covers', (p) => form.theme_options.hero.framed_photo = p)" />
        <p class="mt-1 text-[11px] opacity-60">Khusus foto berbingkai hero -- terpisah dari background halaman.</p>
      </div>
      <div v-if="form.theme_options.hero.style === 'custom'" class="grid gap-2 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-700 sm:col-span-2">
        <p class="text-xs font-medium opacity-70">Atur bebas tiap elemen</p>
        <div v-for="[key, label] in HERO_ELEMENTS" :key="key" class="grid grid-cols-2 items-center gap-2">
          <span class="text-xs opacity-70">{{ label }}</span>
          <div class="grid grid-cols-2 gap-2">
            <select v-model="form.theme_options.hero.elements[key].align" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Tengah</option>
              <option value="left">Kiri</option>
              <option value="right">Kanan</option>
            </select>
            <input v-model.number="form.theme_options.hero.elements[key].order" type="number" min="1" max="8" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Urutan" />
          </div>
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.theme_options.sections.countdown_hero.visible" type="checkbox" /> Countdown di hero
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.theme_options.hero.dresscode_enabled" type="checkbox" /> Tampilkan dresscode
      </label>
      <input v-if="form.theme_options.hero.dresscode_enabled" v-model="form.theme_options.hero.dresscode" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. Batik / Earth Tone" />
    </div>

    <div class="mt-3 grid gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
      <p class="text-xs font-medium opacity-70">Tipografi, Ukuran &amp; Warna tiap elemen teks hero</p>
      <div v-for="[key, label] in HERO_TEXT_ELEMENTS" :key="key" class="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
        <span class="text-xs opacity-70">{{ label }}</span>
        <input v-model="form.theme_options.hero.elements[key].font" list="element-fonts" placeholder="Font (bawaan)" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input v-model.number="form.theme_options.hero.elements[key].size" type="number" placeholder="Ukuran (px)" class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input v-model="form.theme_options.hero.elements[key].color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
    </div>

    <div class="mt-3 grid gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700 sm:grid-cols-2">
      <p class="text-xs font-medium opacity-70 sm:col-span-2">Tampilan section (kartu, background)</p>
      <div>
        <label class="mb-1 block text-xs opacity-70">Kartu hero</label>
        <select v-model="form.theme_options.layout.hero_card" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="inherit">Ikut pengaturan konten</option>
          <option value="card">Selalu pakai kartu</option>
          <option value="plain">Tanpa kartu (full-foto)</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Gaya kartu hero</label>
        <select v-model="form.theme_options.hero.card_style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="">Ikut gaya global</option>
          <option v-for="(label, v) in CARD_STYLES" :key="v" :value="v">{{ label }}</option>
        </select>
      </div>
    </div>
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.hero"
      :section-bg="form.theme_options.section_bg.hero"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.hero = $event"
    />
  </details>
</template>
