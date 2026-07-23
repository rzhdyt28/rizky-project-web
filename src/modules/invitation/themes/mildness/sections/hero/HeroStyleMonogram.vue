<script setup>
/** Hero -- gaya "monogram": inisial pasangan besar di tengah lingkaran tipis, nama kecil di bawah. Sangat minimalis. */
import { computed } from 'vue';
import CountdownSection from '../../../_core/sections/countdown/CountdownSection.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName: { type: String, default: '' },
  labels: { type: Object, required: true },
  hero: { type: Object, default: () => ({}) },
  firstEvent: { type: Object, default: null },
  weekday: { type: String, default: '' },
  dateDots: { type: String, default: '' },
  countdownEvent: { type: Object, default: null },
  coverCd: { type: Object, default: () => ({}) },
});
defineEmits(['open']);

const initials = computed(() => {
  const b = (props.invitation.bride_name || '?').trim().charAt(0).toUpperCase();
  const g = (props.invitation.groom_name || '?').trim().charAt(0).toUpperCase();
  return `${g}${b}`;
});
</script>

<template>
  <div class="relative flex flex-col items-center w-full gap-4 px-6 py-14 text-center mild-cover">
    <div class="mild-monogram" :style="{ color: 'var(--hero-el-names-color, var(--t-accent))' }">{{ initials }}</div>
    <p class="text-xs tracking-[0.15em]" :style="{ fontFamily: 'var(--hero-el-eyebrow-font, var(--t-font-accent))', color: 'var(--hero-el-eyebrow-color, var(--t-ink))', fontSize: 'var(--hero-el-eyebrow-size, 0.75rem)', opacity: 0.75 }">Undangan Pernikahan</p>
    <h1 class="leading-tight" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--hero-el-names-color, var(--t-accent))', fontSize: 'var(--hero-el-names-size, 1.5rem)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
    </h1>
    <div v-if="firstEvent" class="flex flex-col items-center gap-0.5" :style="{ color: 'var(--hero-el-date-color, var(--t-ink))', fontSize: 'var(--hero-el-date-size, 0.875rem)' }">
      <span class="capitalize">{{ weekday }}</span>
      <span>{{ dateDots }}</span>
    </div>
    <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
    <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode" :style="{ color: 'var(--hero-el-dresscode-color)' }">
      <span class="mild-dresscode__label" :style="{ fontSize: 'var(--hero-el-dresscode-size, 10px)' }">Dress Code</span>
      <span class="mild-dresscode__text" :style="{ fontSize: 'var(--hero-el-dresscode-size, 0.9rem)' }">{{ hero.dresscode }}</span>
    </div>
    <div v-if="guestName" class="grid gap-1 mt-1" :style="{ color: 'var(--hero-el-guest-color)', fontSize: 'var(--hero-el-guest-size)' }">
      <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
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
</template>

<style scoped>
.mild-cover { animation: mildFade 1.1s ease-out both; }
.mild-monogram {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--t-gold, #b08d4a) 70%, transparent);
  font-family: var(--t-font-head);
  font-size: 2.25rem;
  letter-spacing: 0.05em;
}
.mild-dresscode { display: grid; gap: 0.15rem; justify-items: center; }
.mild-dresscode__label { letter-spacing: 0.35em; text-transform: uppercase; font-family: var(--t-font-accent); color: var(--hero-el-dresscode-color, var(--t-gold)); }
.mild-dresscode__text { font-style: italic; font-family: var(--t-font-head); }
@keyframes mildFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .mild-cover { animation: none; }
}
</style>
