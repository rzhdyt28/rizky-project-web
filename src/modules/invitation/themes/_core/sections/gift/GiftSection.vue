<script setup>
/**
 * _CORE / Hadiah Digital — DISPATCHER. State "salin nomor rekening" (dipakai
 * semua gaya) tetap di sini, diteruskan sebagai props+event. Tambah gaya
 * baru: buat GiftStyle<Nama>.vue di folder ini, daftarkan di map STYLES di
 * bawah, tambah opsi ke ThemeOptionsSchema::GIFT_STYLES (backend).
 */
import { computed, ref } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import GiftStylePanel from './GiftStylePanel.vue';
import GiftStyleStack from './GiftStyleStack.vue';
import GiftStyleTicket from './GiftStyleTicket.vue';

const props = defineProps({
  gifts:     { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'panel' }, // panel|stack|ticket
});

const copied = ref(null);
async function copy(text, id) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = id;
    setTimeout(() => (copied.value = null), 1500);
  } catch { /* clipboard tidak tersedia */ }
}

const STYLES = {
  panel: GiftStylePanel,
  stack: GiftStyleStack,
  ticket: GiftStyleTicket,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? GiftStylePanel);
</script>

<template>
  <SectionWrapper v-if="gifts?.length" :title="labels.title_gift">
    <component :is="activeStyle" :gifts="gifts" :copied="copied" @copy="copy" />
  </SectionWrapper>
</template>
