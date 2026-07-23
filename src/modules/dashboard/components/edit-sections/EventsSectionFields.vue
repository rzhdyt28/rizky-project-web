<script setup>
/** Section 3 — Acara. Isi acara itu sendiri dikelola di halaman "Acara"; di
 * sini hanya visibilitas & tampilan section. */
import SectionDisplayFields from '../SectionDisplayFields.vue';
import SectionElementStyleFields from '../SectionElementStyleFields.vue';

defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

const ELEMENTS = [
  ['title', 'Judul section ("Rangkaian Acara")'],
  ['name', 'Nama acara (mis. "Akad Nikah")'],
  ['date', 'Tanggal & jam'],
  ['venue', 'Nama & alamat lokasi'],
];
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">3 — Section Acara</summary>
    <p class="mt-2 text-xs opacity-60">Isi acara (Akad, Resepsi, tanggal, lokasi) dikelola di halaman "Acara".</p>
    <label class="mt-3 block text-sm">
      <span class="mb-1 block text-xs opacity-70">Model tampilan</span>
      <select v-model="form.theme_options.events.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="card">1. Card — panel bertepi (default)</option>
        <option value="elegant">2. Elegant — flourish &amp; tipografi vintage</option>
        <option value="timeline">3. Timeline — garis putus-putus + penanda</option>
        <option value="minimal">4. Minimal — tanpa kotak, garis tipis</option>
        <option value="badge">5. Badge — nomor urut bulat + detail di samping</option>
        <option value="ticket">6. Ticket — kartu ala tiket sobek</option>
        <option value="compact">7. Compact — daftar padat</option>
      </select>
    </label>
    <label class="mt-3 flex items-center gap-2 text-sm">
      <input v-model="form.theme_options.events.show_maps" type="checkbox" /> Tampilkan peta (embed Google Maps)
    </label>
    <p class="mt-1 text-[11px] opacity-60">Butuh fitur "Peta Lokasi" aktif di paket langganan. Kalau dimatikan (atau paket tidak punya fitur ini), tamu tetap dapat tombol "Lihat lokasi" langsung ke aplikasi peta.</p>
    <SectionElementStyleFields class="mt-3" :elements="form.theme_options.sections.events.elements" :list="ELEMENTS" />
    <SectionDisplayFields
      class="mt-3"
      :section="form.theme_options.sections.events"
      :section-bg="form.theme_options.section_bg.events"
      :invitation-id="invitationId"
      @update:section-bg="form.theme_options.section_bg.events = $event"
    />
  </details>
</template>
