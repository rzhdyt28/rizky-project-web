<script setup>
/**
 * SENJA/Cover — hero satu layar penuh DI DALAM panel kanan.
 * Foto pengantin (Background Halaman dari Filament) memenuhi hero dengan
 * selubung gradasi senja; nama bertumpuk (Nama / & / Nama) gaya kaligrafi,
 * tanggal, countdown (gaya angka ikut Filament), tombol "Buka Undangan"
 * pil krem, dan "Kepada: {tamu}". Setelah dibuka, tombol hilang —
 * countdown & "Kepada" tetap (mengikuti referensi screenshot 2).
 */
import { computed } from 'vue';
import BgSlideshow from '../../../components/BgSlideshow.vue';
import CountdownSection from '../../_core/sections/CountdownSection.vue';
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
  <section class="senja-hero" :class="`senja-hero--${hero.position ?? 'split'}`">
    <!-- v3: SLIDESHOW (bila diisi) menggantikan foto statis -->
    <BgSlideshow
      v-if="heroSlides.length"
      :images="heroSlides"
      :effect="hero.effect"
      :interval="hero.interval"
    />
    <!-- Foto statis fallback: desktop + versi HP (pola swap sama dengan mildness) -->
    <div
      v-if="!heroSlides.length && background.photo"
      class="senja-hero__photo senja-hero__photo--desktop"
      :class="{ 'senja-hero__photo--swap': background.photo_mobile }"
      :style="{ backgroundImage: `url(${assetUrl(background.photo)})` }"
    />
    <div
      v-if="!heroSlides.length && background.photo_mobile"
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
