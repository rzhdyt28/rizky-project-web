<script setup>
/**
 * MILDNESS/Cover — hidup DI DALAM kartu mengambang (dibungkus Layout).
 * Nama kaligrafi + tanggal titik-pisah "28 • 03 • 2026" + countdown
 * lingkaran + tombol amplop.
 * Kontrak cover: ornament (slot atas), ornament_bottom (slot bawah, opsional).
 */
import { computed } from 'vue';
import OrnamentDivider from '../../_core/ui/OrnamentDivider.vue';
import CountdownSection from '../../_core/sections/CountdownSection.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName:  { type: String, default: '' },
  labels:     { type: Object, required: true },
  cover:      { type: Object, default: () => ({}) },
  countdownEvent: { type: Object, default: null },
  countdownOpts:  { type: Object, default: () => ({}) },
});

const emit = defineEmits(['open']);

const ornament = computed(() => props.cover.ornament ?? props.cover.ornament_top ?? null);

const firstEvent = computed(() => props.invitation.events?.[0] ?? null);

/* Di dalam kartu hero, varian isi selalu 'simple' (foto/kutipan tidak muat
   rapi di kartu) — tapi GAYA ANGKA tetap mengikuti pilihan Filament. */
const coverCd = computed(() => ({ ...props.countdownOpts, layout: 'simple' }));

const weekday = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  return d ? d.toLocaleDateString('id-ID', { weekday: 'long' }) : '';
});

/* "28 • 03 • 2026" */
const dateDots = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd} • ${mm} • ${d.getFullYear()}`;
});
</script>

<template>
  <!-- Foto pengantin TIDAK lagi jadi latar kartu — foto kini lapis
       background halaman (di belakang kartu), diatur dari Filament. -->
  <div class="relative flex flex-col items-center w-full gap-4 px-6 py-10 text-center mild-cover">
    <OrnamentDivider :image="ornament" />

    <p class="text-xs tracking-[0.15em]" :style="{ color: 'var(--t-ink)', opacity: 0.75 }">
      Undangan Pernikahan
    </p>

    <h1
      class="text-4xl leading-tight sm:text-5xl"
      :style="{ fontFamily: 'var(--t-font-script)', color: 'var(--t-accent)' }"
    >
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
    </h1>

    <div v-if="firstEvent" class="mt-1 flex flex-col items-center gap-0.5 text-sm" :style="{ color: 'var(--t-ink)' }">
      <span class="capitalize">{{ weekday }}</span>
      <span>{{ dateDots }}</span>
    </div>

    <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />

    <div v-if="guestName" class="grid gap-1 mt-1">
      <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
      <strong class="text-base font-normal">{{ guestName }}</strong>
    </div>

    <button
      class="c-btn mt-3 inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
      :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }"
      @click="emit('open')"
    >
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
      {{ labels.btn_open }}
    </button>

    <OrnamentDivider v-if="cover.ornament_bottom" :image="cover.ornament_bottom" flip />
  </div>
</template>

<style scoped>
.mild-cover { animation: mildFade 1.1s ease-out both; }
@keyframes mildFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .mild-cover { animation: none; }
}
</style>
