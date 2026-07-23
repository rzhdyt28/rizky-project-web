<script setup>
/**
 * _CORE / Countdown — DISPATCHER. Pilih gaya isi (opts.layout) dan render
 * komponen anak yang sesuai. Timer (parts) dihitung DI SINI (dipakai semua
 * gaya) dan diteruskan sebagai props -- bukan diduplikasi tiap gaya.
 * "Gaya angka" (opts.style: circle|boxed|minimal|pill|flip) BUKAN branch
 * template terpisah, cuma CSS class (c-countdown__timer--${style}) yang
 * dipakai identik di semua gaya isi -- makanya cukup diteruskan sebagai prop
 * `numeralStyle`, tidak perlu file terpisah per gaya angka.
 *
 * Tambah gaya isi baru: buat CountdownLayout<Nama>.vue di folder ini,
 * daftarkan di map LAYOUTS di bawah, tambah opsi ke
 * ThemeOptionsSchema::COUNTDOWN_LAYOUTS (backend).
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import CountdownLayoutSimple from './CountdownLayoutSimple.vue';
import CountdownLayoutPhoto from './CountdownLayoutPhoto.vue';

/* Template dispatcher cuma 1 root (<component :is>), tapi anak-anaknya
   (Simple pakai SectionWrapper, Photo pakai div biasa) beda root tag --
   attrs (mis. class dari pemanggil) tetap harus diteruskan manual. */
defineOptions({ inheritAttrs: false });

const props = defineProps({
  event:      { type: Object, default: null },
  invitation: { type: Object, default: null },
  labels:     { type: Object, default: () => ({}) },
  opts:       { type: Object, default: () => ({}) }, // { style, layout, photo, quote }
});

const numeralStyle = computed(() => props.opts.style ?? 'circle');
const layout = computed(() => props.opts.layout ?? 'simple');

const now = ref(Date.now());
const timer = setInterval(() => (now.value = Date.now()), 1000);
onBeforeUnmount(() => clearInterval(timer));

const parts = computed(() => {
  const target = props.event ? new Date(props.event.starts_at).getTime() : 0;
  let diff = Math.max(0, Math.floor((target - now.value) / 1000));
  const d = Math.floor(diff / 86400); diff -= d * 86400;
  const h = Math.floor(diff / 3600);  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;
  return [
    { num: d, lbl: 'Hari' }, { num: h, lbl: 'Jam' },
    { num: m, lbl: 'Menit' }, { num: s, lbl: 'Detik' },
  ];
});

const LAYOUTS = { photo: CountdownLayoutPhoto };
const activeLayout = computed(() => LAYOUTS[layout.value] ?? CountdownLayoutSimple);
</script>

<template>
  <template v-if="event">
    <component
      :is="activeLayout"
      v-bind="$attrs"
      :layout="layout"
      :numeral-style="numeralStyle"
      :parts="parts"
      :opts="opts"
      :event="event"
      :invitation="invitation"
      :labels="labels"
    />
  </template>
</template>
