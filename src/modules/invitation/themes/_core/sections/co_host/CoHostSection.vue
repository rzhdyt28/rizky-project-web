<script setup>
/**
 * _CORE / Turut Mengundang — DISPATCHER. Normalisasi data (string lama ->
 * {name, side}) dan pemisahan spesial/pria/wanita dipakai semua gaya, tetap
 * di sini. Tambah gaya baru: buat CoHostStyle<Nama>.vue di folder ini,
 * daftarkan di map STYLES di bawah, tambah opsi ke
 * ThemeOptionsSchema::CO_HOST_STYLES (backend).
 */
import { computed } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import CoHostStyleClassic from './CoHostStyleClassic.vue';
import CoHostStyleGrid from './CoHostStyleGrid.vue';
import CoHostStyleElegant from './CoHostStyleElegant.vue';
import CoHostStyleCompact from './CoHostStyleCompact.vue';

const props = defineProps({
  coHosts:   { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'classic' }, // classic|grid|elegant|compact
});

/* Normalisasi ganda (jaga-jaga bila data mentah string lolos dari backend). */
const items = computed(() =>
  (props.coHosts ?? []).map((it) =>
    typeof it === 'string' ? { name: it, side: 'pria' } : { side: 'pria', ...it }
  ).filter((it) => it.name)
);

const spesial = computed(() => items.value.filter((it) => it.side === 'spesial'));
const pria    = computed(() => items.value.filter((it) => it.side === 'pria'));
const wanita  = computed(() => items.value.filter((it) => it.side === 'wanita'));

const STYLES = {
  classic: CoHostStyleClassic,
  grid: CoHostStyleGrid,
  elegant: CoHostStyleElegant,
  compact: CoHostStyleCompact,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? CoHostStyleClassic);
</script>

<template>
  <SectionWrapper v-if="items.length" :title="labels.title_co_host">
    <component :is="activeStyle" :spesial="spesial" :pria="pria" :wanita="wanita" />
  </SectionWrapper>
</template>
