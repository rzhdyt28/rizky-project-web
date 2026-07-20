<script setup>
/** Global — Tata Letak & Kartu Default, Floral 4 Sudut, Animasi Scroll. */
import { CARD_STYLES } from '../../composables/invitationFormOptions';

defineProps({
  form: { type: Object, required: true },
  handleUpload: { type: Function, required: true },
});
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Tata Letak &amp; Kartu Default</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-3">
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.theme_options.layout.card" type="checkbox" /> Kartu untuk section konten (default)
      </label>
      <div>
        <label class="mb-1 block text-xs opacity-70">Tinggi section</label>
        <select v-model="form.theme_options.layout.section_height" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="full">Satu layar penuh</option>
          <option value="auto">Setinggi konten</option>
          <option value="smart">Otomatis</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Gaya kartu (default global)</label>
        <select v-model="form.theme_options.card.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="">Bawaan tema</option>
          <option v-for="(label, v) in CARD_STYLES" :key="v" :value="v">{{ label }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Warna kartu</label>
        <input v-model="form.theme_options.card.bg" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Opacity (%)</label>
        <input v-model.number="form.theme_options.card.opacity" type="number" min="0" max="100" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Warna shadow</label>
        <input v-model="form.theme_options.card.shadow_color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
      </div>
      <div>
        <label class="mb-1 block text-xs opacity-70">Ketebalan shadow</label>
        <select v-model="form.theme_options.card.shadow_size" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="">Sedang (default)</option>
          <option value="none">Tanpa shadow</option>
          <option value="lembut">Lembut</option>
          <option value="sedang">Sedang</option>
          <option value="kuat">Kuat</option>
        </select>
      </div>
      <div v-for="corner in ['radius_tl', 'radius_tr', 'radius_bl', 'radius_br']" :key="corner">
        <label class="mb-1 block text-xs opacity-70">Radius {{ corner.replace('radius_', '') }} (px)</label>
        <input v-model.number="form.theme_options.card[corner]" type="number" min="0" max="120" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
      </div>
    </div>
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Floral 4 Sudut Halaman</summary>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner">
        <label class="mb-1 block text-xs opacity-70">Floral {{ corner.toUpperCase() }}</label>
        <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'ornaments', (p) => form.theme_options.florals[corner] = p)" />
      </div>
    </div>
  </details>

  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">Global — Animasi Scroll</summary>
    <select v-model="form.theme_options.animation.preset" class="mt-3 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
      <option value="fade-up">Muncul dari bawah</option>
      <option value="fade-down">Muncul dari atas</option>
      <option value="fade-left">Geser dari kanan</option>
      <option value="fade-right">Geser dari kiri</option>
      <option value="zoom">Zoom lembut</option>
      <option value="none">Tanpa animasi</option>
    </select>
  </details>
</template>
