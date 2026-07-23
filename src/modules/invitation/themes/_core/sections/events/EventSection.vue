<script setup>
/**
 * _CORE / Acara — DISPATCHER. SectionWrapper (judul) tetap di sini karena
 * dipakai semua gaya secara identik. Tambah gaya baru: buat
 * EventStyle<Nama>.vue di folder ini, daftarkan di map STYLES di bawah,
 * tambah opsi ke ThemeOptionsSchema::EVENTS_STYLES (backend).
 */
import { computed } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import EventStyleCard from './EventStyleCard.vue';
import EventStyleElegant from './EventStyleElegant.vue';
import EventStyleTimeline from './EventStyleTimeline.vue';
import EventStyleMinimal from './EventStyleMinimal.vue';
import EventStyleBadge from './EventStyleBadge.vue';
import EventStyleTicket from './EventStyleTicket.vue';
import EventStyleCompact from './EventStyleCompact.vue';

const props = defineProps({
  events:    { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  showMaps:  { type: Boolean, default: false },
  styleName: { type: String, default: 'card' }, // card|elegant|timeline|minimal|badge|ticket|compact
});

const STYLES = {
  card: EventStyleCard,
  elegant: EventStyleElegant,
  timeline: EventStyleTimeline,
  minimal: EventStyleMinimal,
  badge: EventStyleBadge,
  ticket: EventStyleTicket,
  compact: EventStyleCompact,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? EventStyleCard);
</script>

<template>
  <SectionWrapper :title="labels.title_events">
    <component :is="activeStyle" :events="events" :show-maps="showMaps" />
  </SectionWrapper>
</template>
