<script setup>
/**
 * TEMA SENJA — layout SPLIT-SCREEN (dari referensi screenshot):
 * - DESKTOP: dua panel. KIRI = "punggung" undangan yang DIAM (nama pengantin,
 *   tanggal, kutipan, "Kepada") di atas latar coklat senja bertabur titik
 *   cahaya. KANAN = kolom undangan (lebar ala HP) yang PUNYA SCROLL SENDIRI —
 *   klik "Buka Undangan" hanya menggulir panel kanan; panel kiri tak bergerak.
 * - MOBILE (<1024px): panel kiri disembunyikan, panel kanan jadi undangan
 *   satu kolom penuh seperti biasa.
 * - Kontrak props SAMA dengan tema lain (mildness) — semua kontrol Filament
 *   (kartu, gaya kartu, countdown, tinggi section, background per-section,
 *   animasi) berlaku di sini juga.
 */
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import './theme.css';
import Cover from './sections/Cover.vue';
import FloatingCard from '../../components/FloatingCard.vue';
import SectionRenderer from '../../components/SectionRenderer.vue';
import FooterSection from '../_core/sections/FooterSection.vue';
import MusicPlayer from '../_core/ui/MusicPlayer.vue';
import BrandingFooter from '../_core/ui/BrandingFooter.vue';
import { assetUrl } from '../../composables/assets';
import { vReveal, setRevealScroller } from '../../composables/useReveal';

/* Bug fix: v-reveal DI DALAM section (mis. tiap kartu kisah cinta di
   LoveStorySection) tidak tahu Senja punya scroll container sendiri
   ('.senja-right', bukan window) -- animasinya jadi permanen macet di
   opacity 0 (kelihatan cuma garis/kerangka section, teks & foto baru
   muncul lewat lightbox saat diklik, bukan lewat animasi normal).
   Daftarkan scroller default di sini supaya SEMUA v-reveal di section
   manapun otomatis ikut, reset saat pindah ke tema lain. */
onMounted(() => setRevealScroller('.senja-right'));
onUnmounted(() => setRevealScroller(null));

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
  /* v3: resolver kartu PER-SECTION (mix) + opsi hero. */
  sectionCard:  { type: Function, default: null },
  /* v3: resolver tinggi/gap PER-SECTION (bisa di-mix) — dari useThemeOptions. */
  sectionHeight: { type: Function, default: null },
  /* Font override PER-SECTION (sections.{key}.font_heading/font_body). */
  sectionFontVars: { type: Function, default: () => ({}) },
  /* Foto KHUSUS di dalam kartu (sections.{key}.card_bg_photo, v5). */
  sectionCardBgPhoto: { type: Function, default: () => null },
  hero:         { type: Object, default: () => ({}) },
  countdown:    { type: Object, default: () => ({}) },
  animation:    { type: String, default: 'fade-up' },
});

const opened        = ref(false);
const sectionsStart = ref(null);

const useCard = computed(() => props.layoutOpts.card !== false);

/* KARTU PER-SECTION (v3): tiap section boleh beda (mix). */
function cardOf(key) {
  if (props.sectionCard) return props.sectionCard(key);
  return { use: useCard.value, style: props.layoutOpts.cardStyle };
}

/* Panel kanan adalah scroll container sendiri — ScrollTrigger default hanya
   memantau window, jadi v-reveal diberi scroller eksplisit (useReveal v2). */
const reveal = computed(() => ({ preset: props.animation, scroller: '.senja-right' }));

/* Klik "Buka": hanya panel KANAN yang menggulir ke section pertama;
   panel kiri tidak berubah sama sekali (permintaan panah no. 2). */
async function open() {
  opened.value = true;
  await nextTick();
  sectionsStart.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

/* Tinggi section — logika sama dengan mildness (full/auto/smart). */
function sectionScreenClass(key) {
  const h = props.sectionHeight ? props.sectionHeight(key) : props.layoutOpts.sectionHeight;
  if (h === 'auto') return 's-screen s-screen--auto';
  if (h === 'smart') {
    const hasBg = !cardOf(key).use && !!props.sectionBg(key);
    return hasBg ? 's-screen' : 's-screen s-screen--auto';
  }
  return 's-screen';
}

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

/* Panel kiri/kanan: prioritas latar = foto > warna > gradient asli
   (video kiri dirender terpisah sebagai elemen <video>, tidak lewat CSS var
   ini -- lihat template). Digabung 1 var supaya reuse pola fallback yang
   sudah ada di theme.css (var(--x, <gradient asli>)) tanpa background-image
   longhand yang bisa tabrakan urutan dengan background shorthand. */
const leftBgStyle = computed(() => {
  const style = {};
  if (props.hero?.senjaLeftPhoto) style['--senja-left-bg'] = `url(${assetUrl(props.hero.senjaLeftPhoto)})`;
  else if (props.hero?.senjaLeftBg) style['--senja-left-bg'] = props.hero.senjaLeftBg;
  if (props.hero?.senjaLeftText) style['--senja-left-text'] = props.hero.senjaLeftText;
  return style;
});
const rightBgStyle = computed(() => {
  const style = {};
  if (props.hero?.senjaRightPhoto) style['--senja-right-bg'] = `url(${assetUrl(props.hero.senjaRightPhoto)})`;
  else if (props.hero?.senjaRightBg) style['--senja-right-bg'] = props.hero.senjaRightBg;
  return style;
});

/* ===== Isi panel KIRI (panah no. 1): identitas undangan yang diam ===== */
const firstEvent = computed(() => props.invitation.events?.[0] ?? null);

const dateLong = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  return d
    ? d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';
});

const quote = computed(() =>
  props.invitation.opening_text ||
  'Dengan memohon rahmat dan ridha Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan kami.'
);
</script>

<template>
  <div
    class="font-light theme-senja senja-root"
    :style="{
      color: 'var(--ov-body-color, var(--t-ink))',
      fontSize: 'var(--ov-body-size, 1rem)',
      fontFamily: 'var(--t-font-body)',
      ...(background.color ? { '--page-bg': background.color } : {}),
    }"
  >
    <!-- ===== PANEL KIRI — DIAM (desktop saja) ===== -->
    <!-- background/teks: override admin (Global Tampilan > Split Layout,
         lihat InvitationLookResource) kalau diisi -- kosong = fallback
         gradient/warna asli di theme.css, tidak berubah. -->
    <aside class="senja-left" :style="leftBgStyle">
      <!-- video menang atas foto & warna kalau diisi (lihat InvitationLookResource) -->
      <video
        v-if="hero.senjaLeftVideo"
        class="senja-left__video"
        :src="assetUrl(hero.senjaLeftVideo)"
        autoplay muted loop playsinline preload="auto"
      />
      <div v-if="hero.senjaLeftVideo || hero.senjaLeftPhoto" class="senja-left__veil" />
      <div class="senja-left__sparkles" aria-hidden="true" />
      <div class="senja-left__inner">
        <p class="senja-left__eyebrow">Undangan Pernikahan</p>
        <h1 class="senja-left__names">
          {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
        </h1>
        <p v-if="dateLong" class="capitalize senja-left__date">{{ dateLong }}</p>
        <span class="senja-left__rule" />
        <p class="senja-left__quote">{{ quote }}</p>
        <div v-if="guestName" class="senja-left__guest">
          <small>Kepada:</small>
          <strong>{{ guestName }}</strong>
        </div>
      </div>
    </aside>

    <!-- ===== PANEL KANAN — SCROLL SENDIRI ===== -->
    <main class="senja-right" :style="rightBgStyle">
      <Cover
        :hero="hero"
        :invitation="invitation"
        :background="background"
        :guest-name="guestName"
        :labels="labels"
        :countdown-event="can.countdown_hero ? invitation.events?.[0] : null"
        :countdown-opts="countdown"
        :opened="opened"
        @open="open"
      />

      <div v-if="opened" ref="sectionsStart" class="senja-sections">
        <SectionRenderer :ctx="ctx" v-slot="{ entry }">
          <section
            v-reveal="reveal"
            class="relative"
            :class="[sectionScreenClass(entry.key), { 's-screen--bg': !cardOf(entry.key).use && sectionBg(entry.key) }]"
            :style="[screenStyle(entry.key), sectionFontVars(entry.key)]"
          >
            <div class="senja-frame">
              <FloatingCard v-if="cardOf(entry.key).use" :variant="cardOf(entry.key).style" :photo="cardPhotoUrl(entry.key)">
                <component :is="entry.comp" v-bind="entry.props" />
              </FloatingCard>
              <div v-else class="senja-full">
                <component :is="entry.comp" v-bind="entry.props" />
              </div>
            </div>
          </section>
        </SectionRenderer>

        <section v-reveal="reveal" class="relative s-screen s-screen--auto">
          <div class="senja-frame">
            <FloatingCard v-if="useCard" :variant="layoutOpts.cardStyle">
              <FooterSection :invitation="invitation" />
            </FloatingCard>
            <div v-else class="senja-full">
              <FooterSection :invitation="invitation" />
            </div>
            <BrandingFooter v-if="can.branding" />
          </div>
        </section>
      </div>
    </main>

    <MusicPlayer v-if="opened && can.music" :url="invitation.music_url" />
  </div>
</template>
