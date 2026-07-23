<script setup>
/** Countdown -- gaya isi "simple" (default), juga menampung "date" (tanggal
    di atas timer) dan "quote" (kutipan di atas timer) -- sama-sama cuma
    beda teks pembuka, bukan layout berbeda, jadi tetap 1 file. */
import { computed } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';

const props = defineProps({
  event:        { type: Object, default: null },
  invitation:   { type: Object, default: null },
  parts:        { type: Array, required: true },
  numeralStyle: { type: String, default: 'circle' },
  layout:       { type: String, default: 'simple' }, // simple|date|quote
  opts:         { type: Object, default: () => ({}) },
});

const dateLong = computed(() => {
  const d = props.event?.starts_at ? new Date(props.event.starts_at) : null;
  return d
    ? d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';
});

const quoteText = computed(() =>
  props.opts.quote || 'Dengan penuh syukur dan bahagia, kami menanti hari istimewa kami.'
);
</script>

<template>
  <SectionWrapper class="c-countdown" :class="`c-countdown--${layout}`">
    <p class="c-countdown__eyebrow mb-3 text-[10px] uppercase tracking-[0.35em]">Menuju hari bahagia</p>

    <p v-if="layout === 'date'" class="mb-4 capitalize c-countdown__date">{{ dateLong }}</p>
    <p v-if="layout === 'quote'" class="max-w-xs mx-auto mb-5 italic leading-relaxed c-countdown__quote">
      {{ quoteText }}
    </p>

    <div class="flex flex-wrap justify-center gap-3 c-countdown__timer" :class="`c-countdown__timer--${numeralStyle}`">
      <div v-for="p in parts" :key="p.lbl" class="c-countdown__box">
        <div class="c-countdown__num">{{ String(p.num).padStart(2, '0') }}</div>
        <div class="c-countdown__label">{{ p.lbl }}</div>
      </div>
    </div>
  </SectionWrapper>
</template>

<style scoped>
/* --hero-el-countdown_label-* menang kalau countdown ini tertanam di dalam
   hero (lihat Cover.vue mildness) -- fallback ke --el-eyebrow (countdown
   berdiri sendiri) lalu default tema. */
.c-countdown__eyebrow { font-family: var(--hero-el-countdown_label-font, var(--el-eyebrow-font, inherit)); color: var(--hero-el-countdown_label-color, var(--el-eyebrow-color, var(--t-gold, #b08d4a))); font-size: var(--hero-el-countdown_label-size, var(--el-eyebrow-size, 10px)); }
.c-countdown__date    { font-family: var(--el-date-font, var(--t-font-head, serif)); color: var(--el-date-color, var(--t-accent)); font-size: var(--el-date-size, 1.25rem); }
.c-countdown__quote   { font-family: var(--el-quote-font, inherit); color: var(--el-quote-color, var(--t-ink)); opacity: 0.85; font-size: var(--el-quote-size, 0.9rem); }

.c-countdown__box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 58px; padding: 0.5rem 0.65rem; border-radius: 0.5rem;
  background: color-mix(in srgb, var(--t-accent) 8%, transparent);
}
.c-countdown__num   { font-family: var(--t-font-head, serif); color: var(--t-accent); font-size: 1.5rem; line-height: 1.1; }
.c-countdown__label { font-size: var(--el-label-size, 9px); text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.7; color: var(--el-label-color, var(--t-ink)); }
</style>
