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
import { computed, onMounted, ref } from 'vue';
import './theme.css';
import Cover from './sections/hero/Cover.vue';
import BgSlideshow from '../../components/BgSlideshow.vue';
import BgVideo from '../../components/BgVideo.vue';
import FloatingCard from '../../components/FloatingCard.vue';
import FloralCorner from '../../components/FloralCorner.vue';
import SectionRenderer from '../../components/SectionRenderer.vue';
import FooterSection from '../_core/sections/FooterSection.vue';
import MusicPlayer from '../_core/ui/MusicPlayer.vue';
import BrandingFooter from '../_core/ui/BrandingFooter.vue';
import { assetUrl } from '../../composables/assets';
import { vReveal, setRevealScroller } from '../../composables/useReveal';

/* Mildness scroll di window biasa -- pastikan scroller kustom dari tema
   lain (Senja) tidak "nyangkut" kalau navigasi SPA antar tema tanpa full
   reload. */
onMounted(() => setRevealScroller(null));

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
  /* v3: resolver kartu PER-SECTION (bisa di-mix) — dari useThemeOptions. */
  sectionCard:  { type: Function, default: null },
  /* v3: resolver tinggi/gap PER-SECTION (bisa di-mix) — dari useThemeOptions. */
  sectionHeight: { type: Function, default: null },
  /* Font override PER-SECTION (sections.{key}.font_heading/font_body). */
  sectionFontVars: { type: Function, default: () => ({}) },
  /* Foto KHUSUS di dalam kartu (sections.{key}.card_bg_photo, v5). */
  sectionCardBgPhoto: { type: Function, default: () => null },
  /* v3: opsi hero (posisi, slideshow, efek, interval, dresscode, gaya kartu). */
  hero:         { type: Object, default: () => ({}) },
  countdown:    { type: Object, default: () => ({}) },
  animation:    { type: String, default: 'fade-up' },
});

const opened  = ref(false);
const useCard = computed(() => props.layoutOpts.card !== false);

/* KARTU PER-SECTION (v3): tiap section boleh beda (mix). */
function cardOf(key) {
  if (props.sectionCard) return props.sectionCard(key);
  return { use: useCard.value, style: props.layoutOpts.cardStyle };
}

/* HERO berdiri sendiri: 'card' | 'plain' | 'inherit' (ikut section konten). */
const heroUseCard = computed(() => {
  const h = props.layoutOpts.heroCard ?? 'inherit';
  if (h === 'card')  return true;
  if (h === 'plain') return false;
  return useCard.value;
});
const heroCardStyle = computed(() => props.hero?.cardStyle ?? props.layoutOpts.cardStyle);
const heroSlides = computed(() => props.hero?.slideshow ?? []);

/* Solusi gap — tinggi section:
   'full'  : semua satu layar penuh;
   'auto'  : semua setinggi konten;
   'smart' : PER-SECTION — penuh hanya jika section itu punya background
             (mode tanpa kartu); selain itu setinggi konten (tanpa gap). */
function sectionScreenClass(key) {
  const h = props.sectionHeight ? props.sectionHeight(key) : props.layoutOpts.sectionHeight;
  if (h === 'auto') return 'm-screen m-screen--auto';
  if (h === 'smart') {
    const hasBg = !cardOf(key).use && !!props.sectionBg(key);
    return hasBg ? 'm-screen' : 'm-screen m-screen--auto';
  }
  return 'm-screen';
}

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
  const bg = !cardOf(key).use ? props.sectionBg(key) : null;
  return bg ? { backgroundImage: `url(${assetUrl(bg)})` } : null;
}

/* Foto KHUSUS di dalam kartu (upload terpisah, v5: sections.{key}.card_bg_photo)
   -- hanya masuk akal saat section BERKARTU (mode tanpa kartu pakai screenStyle). */
function cardPhotoUrl(key) {
  const bg = props.sectionCardBgPhoto(key);
  return cardOf(key).use && bg ? assetUrl(bg) : null;
}

/* HERO tidak lewat SectionRenderer (blok <section> sendiri di atas) -- jadi
   font/warna/background per-section ("Tampilan section" di tab Hero) & style
   background di-terapkan manual di sini, sama seperti section konten lain. */
const heroScreenStyle = computed(() => {
  const bg = !heroUseCard.value ? props.sectionBg('hero') : null;
  return bg ? { backgroundImage: `url(${assetUrl(bg)})` } : null;
});
const heroFontVars = computed(() => props.sectionFontVars('hero'));
/* Foto KHUSUS di dalam kartu untuk hero -- field terpisah (v5), sama pola
   dengan cardPhotoUrl() di atas. */
const heroCardPhotoUrl = computed(() => {
  const bg = props.sectionCardBgPhoto('hero');
  return heroUseCard.value && bg ? assetUrl(bg) : null;
});
</script>

<template>
  <div
    class="relative min-h-screen font-light theme-mildness"
    :style="{
      color: 'var(--ov-body-color, var(--t-ink))',
      fontSize: 'var(--ov-body-size, 1rem)',
      fontFamily: 'var(--t-font-body)',
      ...(background.color ? { '--page-bg': background.color } : {}),
    }"
  >
    <!-- ===== LAPIS BACKGROUND HALAMAN (di belakang semua konten) ===== -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- lapis 0: VIDEO (menang atas slideshow/foto kalau diisi) -->
      <BgVideo
        v-if="hero.videoUrl"
        :src="assetUrl(hero.videoUrl)"
        :effect="hero.videoEffect"
      />
      <!-- lapis 1: SLIDESHOW (v3, bila diisi) MENGGANTIKAN foto statis -->
      <BgSlideshow
        v-else-if="heroSlides.length"
        :images="heroSlides"
        :effect="hero.effect"
        :interval="hero.interval"
      />
      <!-- lapis 1 fallback: foto statis (desktop; disembunyikan di HP
           bila ada versi mobile) + foto potret khusus HP -->
      <div
        v-else-if="background.photo"
        class="m-bg-photo m-bg-photo--desktop"
        :class="{ 'm-bg-photo--swap': background.photo_mobile }"
        :style="{ backgroundImage: `url(${assetUrl(background.photo)})` }"
      />
      <div
        v-if="!hero.videoUrl && !heroSlides.length && background.photo_mobile"
        class="m-bg-photo m-bg-photo--mobile"
        :style="{ backgroundImage: `url(${assetUrl(background.photo_mobile)})` }"
      />
      <div v-if="hero.videoUrl || heroSlides.length || background.photo || background.photo_mobile" class="m-bg-veil" />
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
    <section
      v-if="!opened"
      class="relative z-10 m-screen m-hero-screen"
      :style="[heroScreenStyle, heroFontVars]"
    >
      <div class="m-frame">
        <FloatingCard v-if="heroUseCard" :variant="heroCardStyle" :photo="heroCardPhotoUrl">
          <Cover
            :hero="hero"
            :invitation="invitation"
            :countdown-event="can.countdown_hero ? invitation.events?.[0] : null"
            :guest-name="guestName"
            :labels="labels"
            :cover="cover"
            :background="background"
            :countdown-opts="countdown"
            @open="opened = true"
          />
        </FloatingCard>
        <Cover
          v-else
          :hero="hero"
          :invitation="invitation"
          :countdown-event="can.countdown_hero ? invitation.events?.[0] : null"
          :guest-name="guestName"
          :labels="labels"
          :cover="cover"
          :background="background"
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
          :class="[sectionScreenClass(entry.key), { 'm-screen--bg': !cardOf(entry.key).use && sectionBg(entry.key) }]"
          :style="[screenStyle(entry.key), sectionFontVars(entry.key)]"
        >
          <div class="m-frame">
            <FloatingCard v-if="cardOf(entry.key).use" :variant="cardOf(entry.key).style" :photo="cardPhotoUrl(entry.key)">
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
          <FloatingCard v-if="useCard" :variant="layoutOpts.cardStyle">
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