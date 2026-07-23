<script setup>
/** Hero -- gaya "custom": tiap elemen punya order + rata sendiri (bebas).
    State pengurutan/align ini KHUSUS gaya ini saja, tidak dipakai gaya lain. */
import { computed } from 'vue';
import CountdownSection from '../../../_core/sections/countdown/CountdownSection.vue';
import { assetUrl } from '../../../../composables/assets';

const props = defineProps({
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

const ELEMENT_DEFAULTS = {
  eyebrow:   { order: 1, align: 'center' },
  photo:     { order: 2, align: 'center' },
  names:     { order: 3, align: 'center' },
  date:      { order: 4, align: 'center' },
  countdown: { order: 5, align: 'center' },
  dresscode: { order: 6, align: 'center' },
  guest:     { order: 7, align: 'center' },
  button:    { order: 8, align: 'center' },
};
const orderedElements = computed(() => {
  const cfg = props.hero?.elements ?? {};
  return Object.keys(ELEMENT_DEFAULTS)
    .map((key) => ({
      key,
      order: Number(cfg[key]?.order ?? ELEMENT_DEFAULTS[key].order),
      align: cfg[key]?.align || ELEMENT_DEFAULTS[key].align,
    }))
    .sort((a, b) => a.order - b.order);
});
const alignItems  = (align) => (align === 'left' ? 'start' : align === 'right' ? 'end' : 'center');
const alignMargin = (align) => (align === 'left' ? { marginRight: 'auto' } : align === 'right' ? { marginLeft: 'auto' } : { marginLeft: 'auto', marginRight: 'auto' });
const alignJustify = (align) => (align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center');
</script>

<template>
  <div class="relative flex flex-col w-full gap-4 px-6 py-10 mild-cover">
    <template v-for="el in orderedElements" :key="el.key">
      <p v-if="el.key === 'eyebrow'" class="text-xs tracking-[0.15em]" :style="{ color: 'var(--hero-el-eyebrow-color, var(--t-ink))', fontSize: 'var(--hero-el-eyebrow-size, 0.75rem)', opacity: 0.75, textAlign: el.align }">
        Undangan Pernikahan
      </p>
      <img
        v-else-if="el.key === 'photo' && heroPhoto"
        :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
        class="object-cover rounded-full mild-cover__framed h-28 w-28"
        :style="alignMargin(el.align)"
      />
      <h1
        v-else-if="el.key === 'names'" class="leading-tight"
        :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--hero-el-names-color, var(--t-accent))', fontSize: 'var(--hero-el-names-size, clamp(2.25rem, 5vw, 3rem))', textAlign: el.align }"
      >
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h1>
      <div
        v-else-if="el.key === 'date' && firstEvent" class="flex flex-col gap-0.5"
        :style="{ color: 'var(--hero-el-date-color, var(--t-ink))', fontSize: 'var(--hero-el-date-size, 0.875rem)', textAlign: el.align, alignItems: alignItems(el.align) }"
      >
        <span class="capitalize">{{ weekday }}</span>
        <span>{{ dateDots }}</span>
      </div>
      <CountdownSection v-else-if="el.key === 'countdown' && countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
      <div v-else-if="el.key === 'dresscode' && hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode" :style="{ justifyItems: alignItems(el.align), color: 'var(--hero-el-dresscode-color)' }">
        <span class="mild-dresscode__label" :style="{ fontSize: 'var(--hero-el-dresscode-size, 10px)' }">Dress Code</span>
        <span class="mild-dresscode__text" :style="{ fontSize: 'var(--hero-el-dresscode-size, 0.9rem)' }">{{ hero.dresscode }}</span>
      </div>
      <div v-else-if="el.key === 'guest' && guestName" class="grid gap-1" :style="{ justifyItems: alignItems(el.align), color: 'var(--hero-el-guest-color)', fontSize: 'var(--hero-el-guest-size)' }">
        <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
        <strong class="font-normal">{{ guestName }}</strong>
      </div>
      <div v-else-if="el.key === 'button'" :style="{ display: 'flex', justifyContent: alignJustify(el.align) }">
        <button
          class="c-btn inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 uppercase tracking-[0.12em] transition hover:opacity-90"
          :style="{ background: 'var(--hero-el-button-color, var(--t-btn-bg))', color: 'var(--t-btn-text)', fontSize: 'var(--hero-el-button-size, 0.75rem)' }" @click="$emit('open')"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
          </svg>
          {{ labels.btn_open }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mild-cover { animation: mildFade 1.1s ease-out both; }
.mild-cover__framed {
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
