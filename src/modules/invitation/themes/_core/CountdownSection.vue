<script setup>
/**
 * _CORE / Countdown — kini punya:
 * - 4 VARIAN ISI (opts.layout): simple | photo | date | quote
 * - 5 GAYA ANGKA (opts.style): circle | boxed | minimal | pill | flip
 * Semua warna lewat CLASS HOOK + CSS var (tanpa inline style) supaya
 * tema bebas menimpa dari theme.css — akar masalah "angka tak terbaca"
 * sebelumnya adalah inline style yang mengalahkan CSS tema.
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  event:      { type: Object, default: null },
  invitation: { type: Object, default: null },
  labels:     { type: Object, default: () => ({}) },
  opts:       { type: Object, default: () => ({}) }, // { style, layout, photo, quote }
});

const style  = computed(() => props.opts.style ?? 'circle');
const layout = computed(() => props.opts.layout ?? 'simple');

const now = ref(Date.now());
const timer = setInterval(() => (now.value = Date.now()), 1000);
onBeforeUnmount(() => clearInterval(timer));

const parts = computed(() => {
  const target = props.event ? new Date(props.event.starts_at).getTime() : 0;
  let diff = Math.max(0, Math.floor((target - now.value) / 1000));
  const d = Math.floor(diff / 86400); diff -= d * 86400;
  const h = Math.floor(diff / 3600);  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;
  return [
    { num: d, lbl: 'Hari' }, { num: h, lbl: 'Jam' },
    { num: m, lbl: 'Menit' }, { num: s, lbl: 'Detik' },
  ];
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
  <template v-if="event">
    <!-- ===== VARIAN "PHOTO": foto sendiri + nama pasangan + timer ===== -->
    <div
      v-if="layout === 'photo'"
      class="c-countdown c-countdown--photo relative overflow-hidden py-14 px-6 text-center"
      :style="opts.photo ? { backgroundImage: `url(${assetUrl(opts.photo)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
    >
      <span class="c-countdown__veil absolute inset-0" />
      <div class="relative">
        <p class="c-countdown__eyebrow mb-2 text-[10px] uppercase tracking-[0.35em]">Menuju hari bahagia</p>
        <h3 v-if="invitation" class="c-countdown__names mb-5 text-3xl">
          {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
        </h3>
        <div class="c-countdown__timer flex flex-wrap justify-center gap-3" :class="`c-countdown__timer--${style}`">
          <div v-for="p in parts" :key="p.lbl" class="c-countdown__box">
            <div class="c-countdown__num">{{ String(p.num).padStart(2, '0') }}</div>
            <div class="c-countdown__label">{{ p.lbl }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== VARIAN simple / date / quote (dibungkus SectionWrapper) ===== -->
    <SectionWrapper v-else class="c-countdown" :class="`c-countdown--${layout}`">
      <p class="c-countdown__eyebrow mb-3 text-[10px] uppercase tracking-[0.35em]">Menuju hari bahagia</p>

      <p v-if="layout === 'date'" class="c-countdown__date mb-4 text-xl capitalize">{{ dateLong }}</p>
      <p v-if="layout === 'quote'" class="c-countdown__quote mx-auto mb-5 max-w-xs italic leading-relaxed">
        {{ quoteText }}
      </p>

      <div class="c-countdown__timer flex flex-wrap justify-center gap-3" :class="`c-countdown__timer--${style}`">
        <div v-for="p in parts" :key="p.lbl" class="c-countdown__box">
          <div class="c-countdown__num">{{ String(p.num).padStart(2, '0') }}</div>
          <div class="c-countdown__label">{{ p.lbl }}</div>
        </div>
      </div>
    </SectionWrapper>
  </template>
</template>

<style scoped>
/* ====== DEFAULT NETRAL (bisa ditimpa penuh dari theme.css tiap tema) ====== */
.c-countdown__eyebrow { color: var(--t-gold, #b08d4a); }
.c-countdown__names   { font-family: var(--t-font-script, cursive); color: var(--t-accent); }
.c-countdown__date    { font-family: var(--t-font-head, serif); color: var(--t-accent); }
.c-countdown__quote   { color: var(--t-ink); opacity: 0.85; font-size: 0.9rem; }

.c-countdown__box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 58px; padding: 0.5rem 0.65rem; border-radius: 0.5rem;
  background: color-mix(in srgb, var(--t-accent) 8%, transparent);
}
.c-countdown__num   { font-family: var(--t-font-head, serif); color: var(--t-accent); font-size: 1.5rem; line-height: 1.1; }
.c-countdown__label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.7; color: var(--t-ink); }

/* Varian photo: selubung gelap agar teks putih terbaca di atas foto. */
.c-countdown--photo { background-color: var(--t-accent); }
.c-countdown__veil  { background: linear-gradient(rgba(20, 28, 38, 0.35), rgba(20, 28, 38, 0.6)); }
.c-countdown--photo .c-countdown__eyebrow,
.c-countdown--photo .c-countdown__names,
.c-countdown--photo .c-countdown__num,
.c-countdown--photo .c-countdown__label { color: #fff; }
.c-countdown--photo .c-countdown__box   { background: rgba(255, 255, 255, 0.14); }
</style>
