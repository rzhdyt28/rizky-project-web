<script setup>
/** Countdown -- gaya isi "photo": foto sendiri + nama pasangan + timer. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  invitation:   { type: Object, default: null },
  parts:        { type: Array, required: true },
  numeralStyle: { type: String, default: 'circle' },
  opts:         { type: Object, default: () => ({}) },
});
</script>

<template>
  <div
    class="relative px-6 overflow-hidden text-center c-countdown c-countdown--photo py-14"
    :style="opts.photo ? { backgroundImage: `url(${assetUrl(opts.photo)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
  >
    <span class="absolute inset-0 c-countdown__veil" />
    <div class="relative">
      <p class="c-countdown__eyebrow mb-2 text-[10px] uppercase tracking-[0.35em]">Menuju hari bahagia</p>
      <h3 v-if="invitation" class="mb-5 text-3xl c-countdown__names">
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h3>
      <div class="flex flex-wrap justify-center gap-3 c-countdown__timer" :class="`c-countdown__timer--${numeralStyle}`">
        <div v-for="p in parts" :key="p.lbl" class="c-countdown__box">
          <div class="c-countdown__num">{{ String(p.num).padStart(2, '0') }}</div>
          <div class="c-countdown__label">{{ p.lbl }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-countdown__eyebrow { font-family: var(--hero-el-countdown_label-font, var(--el-eyebrow-font, var(--t-font-accent))); color: var(--hero-el-countdown_label-color, var(--el-eyebrow-color, var(--t-gold, #b08d4a))); font-size: var(--hero-el-countdown_label-size, var(--el-eyebrow-size, 10px)); }
.c-countdown__names   { font-family: var(--t-font-script, cursive); color: var(--t-accent); }

.c-countdown__box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 58px; padding: 0.5rem 0.65rem; border-radius: 0.5rem;
  background: color-mix(in srgb, var(--t-accent) 8%, transparent);
}
.c-countdown__num   { font-family: var(--t-font-head, serif); color: var(--t-accent); font-size: 1.5rem; line-height: 1.1; }
.c-countdown__label { font-family: var(--el-label-font, var(--t-font-accent)); font-size: var(--el-label-size, 9px); text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.7; color: var(--el-label-color, var(--t-ink)); }

.c-countdown--photo { background-color: var(--t-accent); }
.c-countdown__veil  { background: linear-gradient(rgba(20, 28, 38, 0.35), rgba(20, 28, 38, 0.6)); }
/* Foto latar: label tetap ikut override admin bila diisi, kalau tidak fallback putih (kontras foto). */
.c-countdown--photo .c-countdown__eyebrow,
.c-countdown--photo .c-countdown__names,
.c-countdown--photo .c-countdown__num { color: #fff; }
.c-countdown--photo .c-countdown__label { color: var(--el-label-color, #fff); }
.c-countdown--photo .c-countdown__box   { background: rgba(255, 255, 255, 0.14); }
</style>
