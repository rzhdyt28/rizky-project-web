<script setup>
/**
 * _CORE / Mempelai — DISPATCHER. Fallback data ("tanpa foto -> paksa ke
 * classic") dan intro eyebrow/opening_text dipakai semua gaya, tetap di
 * sini. Tambah gaya baru: buat CoupleStyle<Nama>.vue di folder ini,
 * daftarkan di map STYLES di bawah, tambah opsi ke
 * ThemeOptionsSchema::COUPLE_STYLES (backend).
 */
import { computed } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import CoupleStyleClassic from './CoupleStyleClassic.vue';
import CoupleStyleCards from './CoupleStyleCards.vue';
import CoupleStyleCircle from './CoupleStyleCircle.vue';
import CoupleStyleArch from './CoupleStyleArch.vue';
import CoupleStylePortrait from './CoupleStylePortrait.vue';
import CoupleStyleRibbon from './CoupleStyleRibbon.vue';
import CoupleStylePolaroid from './CoupleStylePolaroid.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  opts:       { type: Object, default: () => ({}) }, // { style, show_photos, groom_photo, bride_photo, show_eyebrow, eyebrow_text }
});

const showEyebrow = computed(() => props.opts.show_eyebrow ?? true);
const eyebrowText = computed(() => props.opts.eyebrow_text || 'Bismillahirrahmanirrahim');

const hasPhotos = computed(
  () => !!props.opts.show_photos && !!(props.opts.groom_photo || props.opts.bride_photo)
);
const styleName = computed(() => {
  const s = props.opts.style ?? 'classic';
  return s !== 'classic' && !hasPhotos.value ? 'classic' : s;
});

const people = computed(() => [
  { name: props.invitation.groom_name, parents: props.invitation.groom_parents, parentLabel: 'Putra dari', photo: props.opts.groom_photo },
  { name: props.invitation.bride_name, parents: props.invitation.bride_parents, parentLabel: 'Putri dari', photo: props.opts.bride_photo },
]);

const STYLES = {
  classic: CoupleStyleClassic,
  cards: CoupleStyleCards,
  circle: CoupleStyleCircle,
  arch: CoupleStyleArch,
  portrait: CoupleStylePortrait,
  ribbon: CoupleStyleRibbon,
  polaroid: CoupleStylePolaroid,
};
const activeStyle = computed(() => STYLES[styleName.value] ?? CoupleStyleClassic);
</script>

<template>
  <SectionWrapper>
    <p
      v-if="showEyebrow"
      class="mb-2 uppercase tracking-[0.35em]"
      :style="{ color: 'var(--el-eyebrow-color, var(--t-gold))', fontSize: 'var(--el-eyebrow-size, 10px)' }"
    >
      {{ eyebrowText }}
    </p>
    <p
      class="max-w-md mx-auto mb-6 italic"
      :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-opening-color)', fontSize: 'var(--el-opening-size, 0.875rem)' }"
    >
      {{ invitation.opening_text || 'Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.' }}
    </p>

    <component :is="activeStyle" :people="people" />
  </SectionWrapper>
</template>
