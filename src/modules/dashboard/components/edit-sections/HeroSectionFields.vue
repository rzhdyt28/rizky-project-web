<script setup>
/** Section 1 — Hero (Sampul). `form` adalah objek reaktif penuh dari
 * useInvitationForm, dimutasi langsung (sama seperti pola SectionDisplayFields). */
import { CARD_STYLES } from '../../composables/invitationFormOptions';

defineProps({
  form: { type: Object, required: true },
  uploading: { type: Object, required: true },
  handleUpload: { type: Function, required: true },
  handleSlideshowUpload: { type: Function, required: true },
});

const HERO_ELEMENTS = [
  ['eyebrow', 'Label "Undangan Pernikahan"'],
  ['photo', 'Foto berbingkai (dari "Foto utama")'],
  ['names', 'Nama pasangan'],
  ['date', 'Tanggal acara'],
  ['countdown', 'Countdown'],
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
          <option value="custom">5. Custom — atur urutan &amp; rata tiap elemen sendiri</option>
        </select>
        <p class="mt-1 text-xs opacity-60">Model Framed/Split/Custom memakai "Foto utama (desktop)" di bawah sebagai foto berbingkai.</p>
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
      <div>
        <label class="mb-1 block text-xs opacity-70">Posisi konten hero</label>
        <select v-model="form.theme_options.hero.position" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="">Split (rekomendasi)</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Efek pergantian</label>
        <select v-model="form.theme_options.hero.effect" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="fade">Fade</option>
          <option value="kenburns">Ken Burns</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Foto utama (desktop)</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'covers', (p) => form.theme_options.background.photo = p)" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Foto versi HP (opsional)</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'covers', (p) => form.theme_options.background.photo_mobile = p)" />
      </div>
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs opacity-70">Slideshow background (maks 3 foto, opsional — menggantikan foto utama)</label>
        <input type="file" accept="image/*" multiple class="text-sm" @change="handleSlideshowUpload" />
        <span v-if="uploading.slideshow" class="ml-2 text-xs opacity-60">Mengunggah…</span>
        <span v-else-if="form.theme_options.hero.slideshow.length" class="ml-2 text-xs opacity-60">{{ form.theme_options.hero.slideshow.length }} foto tersimpan</span>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Jeda per foto (detik)</label>
        <input v-model.number="form.theme_options.hero.interval" type="number" min="4" max="12" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Ornamen transparan (upload)</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'ornaments', (p) => form.theme_options.background.ornament_upload = p)" />
      </div>
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
      <div>
        <label class="mb-1 block text-xs opacity-70">Font nama pasangan di hero</label>
        <input v-model="form.theme_options.hero.name_font" list="script-fonts" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ikut font kaligrafi global" />
      </div>
      <label class="flex items-center gap-2 text-sm sm:col-span-2">
        <input v-model="form.theme_options.sections.countdown_hero.visible" type="checkbox" /> Countdown di hero
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.theme_options.hero.dresscode_enabled" type="checkbox" /> Tampilkan dresscode
      </label>
      <input v-if="form.theme_options.hero.dresscode_enabled" v-model="form.theme_options.hero.dresscode" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. Batik / Earth Tone" />
    </div>
  </details>
</template>
