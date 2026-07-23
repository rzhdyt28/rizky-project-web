<script setup>
/**
 * SENJA/Cover — hero satu layar penuh DI DALAM panel kanan.
 * Foto pengantin (Background Halaman dari Filament) memenuhi hero dengan
 * selubung gradasi senja; nama bertumpuk (Nama / & / Nama) gaya kaligrafi,
 * tanggal, countdown (gaya angka ikut Filament), tombol "Buka Undangan"
 * pil krem, dan "Kepada: {tamu}". Setelah dibuka, tombol hilang —
 * countdown & "Kepada" tetap (mengikuti referensi screenshot 2).
 *
 * CATATAN: tema ini TIDAK membaca `hero.style` (classic/framed/split/
 * minimal/custom, lihat ThemeOptionsSchema::HERO_STYLES di backend) —
 * Senja sengaja cuma punya satu layout hero tetap (split-screen di atas).
 * Kalau admin memilih hero.style untuk undangan bertema Senja, pilihan itu
 * disimpan tapi diabaikan di sini. Hanya `hero.position` yang dipakai
 * (untuk varian CSS, lihat `senja-hero--${hero.position}` di bawah).
 */
import { computed } from 'vue';
import BgSlideshow from '../../../components/BgSlideshow.vue';
import BgVideo from '../../../components/BgVideo.vue';
import CountdownSection from '../../_core/sections/countdown/CountdownSection.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  invitation:     { type: Object, required: true },
  background:     { type: Object, default: () => ({}) },
  guestName:      { type: String, default: '' },
  labels:         { type: Object, required: true },
  countdownEvent: { type: Object, default: null },
  countdownOpts:  { type: Object, default: () => ({}) },
  opened:         { type: Boolean, default: false },
  /* v3: posisi konten, slideshow bg, efek, interval, dresscode. */
  hero:           { type: Object, default: () => ({}) },
});

const emit = defineEmits(['open']);

/* Di hero, varian isi selalu 'simple' — GAYA ANGKA tetap ikut Filament. */
const coverCd = computed(() => ({ ...props.countdownOpts, layout: 'simple' }));

/* Ukuran & warna PER-ELEMEN (default_options.hero.elements.$key.size/color) --
   pola SAMA dengan Mildness (lihat Cover.vue mildness): diteruskan sebagai
   CSS var ke elemen anak (var(--hero-el-$key-color, ...)), dibind di root
   <section> supaya mewarisi ke semua elemen teks di bawahnya. */
const TEXT_ELEMENTS = ['eyebrow', 'names', 'date', 'countdown_label', 'dresscode', 'guest', 'button'];
const elVars = computed(() => {
  const vars = {};
  const els = props.hero?.elements ?? {};
  for (const key of TEXT_ELEMENTS) {
    const el = els[key];
    if (!el) continue;
    if (el.font)  vars[`--hero-el-${key}-font`]  = `'${el.font}', serif`;
    if (el.size)  vars[`--hero-el-${key}-size`]  = `${el.size}px`;
    if (el.color) vars[`--hero-el-${key}-color`] = el.color;
  }
  // Field lama "Font nama pasangan di hero" -> tulis ke var lama juga supaya
  // .senja-hero__names (var(--hero-name-font, ...)) tetap otomatis ikut.
  const nameFont = els.names?.font || props.hero?.nameFont;
  if (nameFont) vars['--hero-name-font'] = `'${nameFont}', cursive`;
  return vars;
});

const firstEvent = computed(() => props.invitation.events?.[0] ?? null);

const heroSlides = computed(() => props.hero?.slideshow ?? []);

const dateLong = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  return d
    ? d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';
});
</script>

<template>
  <section class="senja-hero" :style="elVars">
    <!-- lapis 0: VIDEO (menang atas slideshow/foto kalau diisi) -->
    <BgVideo
      v-if="hero.videoUrl"
      :src="assetUrl(hero.videoUrl)"
      :effect="hero.videoEffect"
    />
    <!-- v3: SLIDESHOW (bila diisi) menggantikan foto statis -->
    <BgSlideshow
      v-else-if="heroSlides.length"
      :images="heroSlides"
      :effect="hero.effect"
      :interval="hero.interval"
    />
    <!-- Foto statis fallback: desktop + versi HP (pola swap sama dengan mildness) -->
    <div
      v-else-if="background.photo"
      class="senja-hero__photo senja-hero__photo--desktop"
      :class="{ 'senja-hero__photo--swap': background.photo_mobile }"
      :style="{ backgroundImage: `url(${assetUrl(background.photo)})` }"
    />
    <div
      v-if="!hero.videoUrl && !heroSlides.length && background.photo_mobile"
      class="senja-hero__photo senja-hero__photo--mobile"
      :style="{ backgroundImage: `url(${assetUrl(background.photo_mobile)})` }"
    />
    <div class="senja-hero__veil" />

    <div class="senja-hero__content">
      <p class="senja-hero__eyebrow">Undangan Pernikahan</p>

      <div class="senja-hero__bottom">
        <h1 class="senja-hero__names">
          <span>{{ invitation.bride_name }}</span>
          <span class="senja-hero__amp">&amp;</span>
          <span>{{ invitation.groom_name }}</span>
        </h1>

        <p v-if="dateLong" class="capitalize senja-hero__date">{{ dateLong }}</p>

        <CountdownSection
          v-if="countdownEvent"
          :event="countdownEvent"
          :opts="coverCd"
          class="senja-hero__countdown"
        />

        <!-- v3: DRESSCODE — di bawah countdown hero (toggle dari Filament) -->
        <div v-if="hero.dresscodeEnabled && hero.dresscode" class="senja-hero__dresscode">
          <small>Dress Code</small>
          <span>{{ hero.dresscode }}</span>
        </div>

        <button
          v-if="!opened"
          class="c-btn senja-hero__btn"
          @click="emit('open')"
        >
          <svg viewBox="0 0 24 24" class="senja-hero__btn-icon" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          {{ labels.btn_open }}
        </button>

        <div v-if="guestName" class="senja-hero__guest">
          <small>Kepada:</small>
          <strong>{{ guestName }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>
