<script setup>
/** Hero -- gaya "split": dua kolom TETAP di semua ukuran layar (teks kiri,
    foto berbingkai kanan) -- termasuk mobile, TIDAK bertumpuk lagi (perbaikan
    2026-07-24: sebelumnya cuma split di >=640px via sm:grid-cols-2, di bawah
    itu jadi 1 kolom foto-di-atas). Teks selalu rata tengah di semua ukuran. */
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
  <div class="grid grid-cols-2 items-center w-full gap-3 px-3 py-6 text-center mild-cover sm:gap-6 sm:px-6 sm:py-10">
    <img v-if="heroPhoto" :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
      class="object-cover w-full mx-auto mild-cover__split rounded-xl aspect-[3/4] order-2 sm:rounded-2xl" />
    <div class="flex flex-col items-center order-1 gap-2 sm:gap-4">
      <p class="text-[10px] tracking-[0.1em] sm:text-xs sm:tracking-[0.15em]" :style="{ fontFamily: 'var(--hero-el-eyebrow-font, var(--t-font-accent))', color: 'var(--hero-el-eyebrow-color, var(--t-ink))', fontSize: 'var(--hero-el-eyebrow-size, 0.75rem)', opacity: 0.75 }">Undangan Pernikahan</p>
      <h1 class="leading-tight" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--hero-el-names-color, var(--t-accent))', fontSize: 'var(--hero-el-names-size, clamp(1.35rem, 6vw, 2.5rem))' }">
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h1>
      <div v-if="firstEvent" class="flex flex-col gap-0.5" :style="{ color: 'var(--hero-el-date-color, var(--t-ink))', fontSize: 'var(--hero-el-date-size, 0.875rem)' }">
        <span class="capitalize">{{ weekday }}</span>
        <span>{{ dateDots }}</span>
      </div>
      <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
      <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode" :style="{ color: 'var(--hero-el-dresscode-color)' }">
        <span class="mild-dresscode__label" :style="{ fontSize: 'var(--hero-el-dresscode-size, 10px)' }">Dress Code</span>
        <span class="mild-dresscode__text" :style="{ fontSize: 'var(--hero-el-dresscode-size, 0.9rem)' }">{{ hero.dresscode }}</span>
      </div>
      <div v-if="guestName" class="grid gap-1" :style="{ color: 'var(--hero-el-guest-color)', fontSize: 'var(--hero-el-guest-size)' }">
        <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
        <strong class="font-normal">{{ guestName }}</strong>
      </div>
      <button class="c-btn inline-flex cursor-pointer items-center gap-1.5 border-0 px-3 py-2 text-[10px] uppercase tracking-[0.1em] transition hover:opacity-90 sm:gap-2 sm:px-7 sm:py-3 sm:text-xs sm:tracking-[0.12em]"
        :style="{ background: 'var(--hero-el-button-color, var(--t-btn-bg))', color: 'var(--t-btn-text)', fontSize: 'var(--hero-el-button-size, 0.75rem)' }" @click="$emit('open')">
        <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
        </svg>
        {{ labels.btn_open }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mild-cover { animation: mildFade 1.1s ease-out both; }
.mild-cover__split {
  border: 3px solid var(--t-gold, #b08d4a);
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
.mild-dresscode {
  display: grid;
  gap: 0.15rem;
  justify-items: center;
}
.mild-dresscode__label {
  font-size: 10px;
  font-family: var(--t-font-accent);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--hero-el-dresscode-color, var(--t-gold));
}
.mild-dresscode__text {
  font-size: 0.9rem;
  font-style: italic;
  font-family: var(--t-font-head);
}
@keyframes mildFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .mild-cover { animation: none; }
}
</style>
