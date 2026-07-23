<script setup>
/** Hero -- gaya "poster": foto latar penuh (dari "Foto Berbingkai Hero") dengan
    selubung gradasi gelap di bawah, nama besar menumpuk di atas foto dekat
    bagian bawah -- editorial & dramatis, beda karakter dari gaya lain yang
    fotonya kecil/berbingkai. MENGGANTIKAN gaya "custom" (dihapus 2026-07-24). */
import CountdownSection from '../../../_core/sections/countdown/CountdownSection.vue';
import { assetUrl } from '../../../../composables/assets';

defineProps({
  invitation: { type: Object, required: true },
  guestName: { type: String, default: '' },
  labels: { type: Object, required: true },
  hero: { type: Object, default: () => ({}) },
  heroPhoto: { type: String, default: null },
  firstEvent: { type: Object, default: null },
  weekday: { type: String, default: '' },
  dateDots: { type: String, default: '' },
  countdownEvent: { type: Object, default: null },
  coverCd: { type: Object, default: () => ({}) },
});
defineEmits(['open']);
</script>

<template>
  <div class="relative flex flex-col items-center justify-end w-full overflow-hidden text-center mild-poster">
    <img v-if="heroPhoto" :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
      class="absolute inset-0 object-cover w-full h-full" />
    <div class="absolute inset-0 mild-poster__scrim" />

    <div class="relative z-10 flex flex-col items-center w-full gap-3 px-6 pt-20 pb-8">
      <p class="text-xs tracking-[0.15em]" :style="{ fontFamily: 'var(--hero-el-eyebrow-font, var(--t-font-accent))', color: 'var(--hero-el-eyebrow-color, #fdf8f0)', fontSize: 'var(--hero-el-eyebrow-size, 0.75rem)', opacity: 0.85 }">Undangan Pernikahan</p>
      <h1 class="leading-tight" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--hero-el-names-color, #fdf8f0)', fontSize: 'var(--hero-el-names-size, clamp(2.25rem, 7vw, 3.5rem))' }">
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h1>
      <div v-if="firstEvent" class="flex flex-col gap-0.5" :style="{ color: 'var(--hero-el-date-color, #fdf8f0)', fontSize: 'var(--hero-el-date-size, 0.875rem)' }">
        <span class="capitalize">{{ weekday }}</span>
        <span>{{ dateDots }}</span>
      </div>
      <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
      <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode" :style="{ color: 'var(--hero-el-dresscode-color, #fdf8f0)' }">
        <span class="mild-dresscode__label" :style="{ fontSize: 'var(--hero-el-dresscode-size, 10px)' }">Dress Code</span>
        <span class="mild-dresscode__text" :style="{ fontSize: 'var(--hero-el-dresscode-size, 0.9rem)' }">{{ hero.dresscode }}</span>
      </div>
      <div v-if="guestName" class="grid gap-1 mt-1" :style="{ color: 'var(--hero-el-guest-color, #fdf8f0)', fontSize: 'var(--hero-el-guest-size)' }">
        <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.8 }">Kepada:</small>
        <strong class="font-normal">{{ guestName }}</strong>
      </div>
      <button class="c-btn mt-3 inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 uppercase tracking-[0.12em] transition hover:opacity-90"
        :style="{ background: 'var(--hero-el-button-color, var(--t-btn-bg))', color: 'var(--t-btn-text)', fontSize: 'var(--hero-el-button-size, 0.75rem)' }" @click="$emit('open')">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
        </svg>
        {{ labels.btn_open }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mild-poster {
  min-height: min(78vh, 38rem);
  animation: mildFade 1.1s ease-out both;
}
/* Scrim gradasi gelap di bawah supaya teks putih tetap terbaca di atas foto
   apa pun -- lebih gelap di dasar (tempat teks menumpuk), nyaris transparan
   di atas (supaya foto tetap terlihat jelas). */
.mild-poster__scrim {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 45%, rgba(0, 0, 0, 0.75) 100%);
}
.mild-dresscode { display: grid; gap: 0.15rem; justify-items: center; }
.mild-dresscode__label { font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; font-family: var(--t-font-accent); opacity: 0.85; }
.mild-dresscode__text { font-size: 0.9rem; font-style: italic; font-family: var(--t-font-head); }
@keyframes mildFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .mild-poster { animation: none; }
}
</style>
