<script setup>
/**
 * TEMA MILDNESS — Layout v3.
 * - Background halaman 2 lapis: foto pengantin (belakang) + ornamen (depan),
 *   keduanya DI LUAR kartu (fixed), diatur dari Filament.
 * - Floral 4 sudut, tiap sudut dipilih bebas dari Pustaka Aset
 *   (florals.tl/tr/bl/br); kosong semua -> floral SVG bawaan (tl+br).
 * - Tiap section tampil FULL LAYAR (min-height 100svh, konten di tengah).
 * - Toggle kartu (layout.card dari Filament): ON -> konten dalam kartu
 *   mengambang; OFF -> konten full-bleed & tiap section bisa punya
 *   background foto sendiri (sectionBg).
 * - Animasi scroll GSAP lewat v-reveal (global, composables/useReveal).
 */
import { computed, ref } from 'vue';
import './theme.css';
import Cover from './sections/Cover.vue';
import FloatingCard from '../../components/FloatingCard.vue';
import FloralCorner from '../../components/FloralCorner.vue';
import SectionRenderer from '../../components/SectionRenderer.vue';
import FooterSection from '../_core/sections/FooterSection.vue';
import MusicPlayer from '../_core/ui/MusicPlayer.vue';
import BrandingFooter from '../_core/ui/BrandingFooter.vue';
import { assetUrl } from '../../composables/assets';
import { vReveal } from '../../composables/useReveal';

const props = defineProps({
  invitation:   { type: Object, required: true },
  guestName:    { type: String, default: '' },
  guestbook:    { type: Array, default: () => [] },
  slug:         { type: String, required: true },
  can:          { type: Object, required: true },
  labels:       { type: Object, required: true },
  sectionOrder: { type: Array, required: true },
  cover:        { type: Object, default: () => ({}) },
  florals:      { type: Object, default: () => ({}) },
  background:   { type: Object, default: () => ({}) },
  layoutOpts:   { type: Object, default: () => ({ card: true }) },
  sectionBg:    { type: Function, default: () => null },
  countdown:    { type: Object, default: () => ({}) },
  animation:    { type: String, default: 'fade-up' },
});

const opened  = ref(false);
const useCard = computed(() => props.layoutOpts.card !== false);

/* HERO berdiri sendiri: 'card' | 'plain' | 'inherit' (ikut section konten). */
const heroUseCard = computed(() => {
  const h = props.layoutOpts.heroCard ?? 'inherit';
  if (h === 'card')  return true;
  if (h === 'plain') return false;
  return useCard.value;
});

/* Solusi gap: tinggi section 'full' (satu layar) atau 'auto' (setinggi konten). */
const screenClass = computed(() =>
  props.layoutOpts.sectionHeight === 'auto' ? 'm-screen m-screen--auto' : 'm-screen'
);

const ctx = computed(() => ({
  invitation: props.invitation,
  guestName:  props.guestName,
  guestbook:  props.guestbook,
  slug:       props.slug,
  can:        props.can,
  labels:     props.labels,
  sectionOrder: props.sectionOrder,
  countdown:  props.countdown,
}));

/* Sudut yang aktif: hanya yang dipilih adminnya. Kosong semua -> default SVG. */
const activeCorners = computed(() =>
  ['tl', 'tr', 'bl', 'br'].filter((c) => props.florals?.[c])
);

/* Style background per-section (hanya mode tanpa kartu). */
function screenStyle(key) {
  const bg = !useCard.value ? props.sectionBg(key) : null;
  return bg ? { backgroundImage: `url(${assetUrl(bg)})` } : null;
}
</script>

<template>
  <div
    class="relative min-h-screen font-light theme-mildness"
    :style="{ color: 'var(--t-ink)', fontFamily: 'var(--t-font-body)' }"
  >
    <!-- ===== LAPIS BACKGROUND HALAMAN (di belakang semua konten) ===== -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- lapis 1: foto pengantin (desktop; disembunyikan di HP bila ada
           versi mobile) + foto potret khusus HP -->
      <div
        v-if="background.photo"
        class="m-bg-photo m-bg-photo--desktop"
        :class="{ 'm-bg-photo--swap': background.photo_mobile }"
        :style="{ backgroundImage: `url(${assetUrl(background.photo)})` }"
      />
      <div
        v-if="background.photo_mobile"
        class="m-bg-photo m-bg-photo--mobile"
        :style="{ backgroundImage: `url(${assetUrl(background.photo_mobile)})` }"
      />
      <div v-if="background.photo || background.photo_mobile" class="m-bg-veil" />
      <!-- lapis 2: ornamen di atas foto -->
      <div
        v-if="background.ornament"
        class="m-bg-ornament"
        :style="{ backgroundImage: `url(${assetUrl(background.ornament)})` }"
      />
      <!-- lapis 3: floral sudut -->
      <template v-if="activeCorners.length">
        <FloralCorner v-for="c in activeCorners" :key="c" :corner="c" :image="florals[c]" />
      </template>
      <template v-else>
        <FloralCorner corner="tl" />
        <FloralCorner corner="br" />
      </template>
    </div>

    <!-- ===== COVER (satu layar penuh) ===== -->
    <section v-if="!opened" class="relative z-10 m-screen">
      <div class="m-frame">
        <FloatingCard v-if="heroUseCard">
          <Cover
            :invitation="invitation"
            :countdown-event="can.countdown ? invitation.events?.[0] : null"
            :guest-name="guestName"
            :labels="labels"
            :cover="cover"
            :countdown-opts="countdown"
            @open="opened = true"
          />
        </FloatingCard>
        <Cover
          v-else
          :invitation="invitation"
          :countdown-event="can.countdown ? invitation.events?.[0] : null"
          :guest-name="guestName"
          :labels="labels"
          :cover="cover"
          :countdown-opts="countdown"
          @open="opened = true"
        />
      </div>
    </section>

    <!-- ===== SECTIONS: tiap section = satu layar penuh ===== -->
    <template v-else>
      <SectionRenderer :ctx="ctx" v-slot="{ entry }">
        <section
          v-reveal="animation"
          class="relative z-10"
          :class="[screenClass, { 'm-screen--bg': !useCard && sectionBg(entry.key) }]"
          :style="screenStyle(entry.key)"
        >
          <div class="m-frame">
            <FloatingCard v-if="useCard">
              <component :is="entry.comp" v-bind="entry.props" />
            </FloatingCard>
            <div v-else class="m-full">
              <component :is="entry.comp" v-bind="entry.props" />
            </div>
          </div>
        </section>
      </SectionRenderer>

      <section v-reveal="animation" class="relative z-10 m-screen m-screen--short">
        <div class="m-frame">
          <FloatingCard v-if="useCard">
            <FooterSection :invitation="invitation" />
          </FloatingCard>
          <div v-else class="m-full">
            <FooterSection :invitation="invitation" />
          </div>
          <BrandingFooter v-if="can.branding" />
        </div>
      </section>
    </template>

    <MusicPlayer v-if="opened && can.music" :url="invitation.music_url" />
  </div>
</template>