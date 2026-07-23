<script setup>
/**
 * MILDNESS/Cover — DISPATCHER hero. State yang dipakai SEMUA gaya (heroPhoto,
 * firstEvent, weekday, dateDots, coverCd, KNOWN_HERO_STYLES+dev-warning)
 * tetap di sini, diteruskan sebagai props. Mode "custom" (urutan+rata bebas
 * per elemen) sepenuhnya mandiri di HeroStyleCustom.vue karena tidak dipakai
 * gaya lain.
 *
 * Tambah gaya baru: buat HeroStyle<Nama>.vue di folder ini, daftarkan di
 * map STYLES di bawah, tambah opsi ke ThemeOptionsSchema::HERO_STYLES
 * (backend), dan (opsional) tambah ke KNOWN_HERO_STYLES supaya tidak kena
 * fallback warning.
 */
import { computed, watchEffect } from 'vue';
import HeroStyleClassic from './HeroStyleClassic.vue';
import HeroStyleFramed from './HeroStyleFramed.vue';
import HeroStyleSplit from './HeroStyleSplit.vue';
import HeroStyleCustom from './HeroStyleCustom.vue';
import HeroStyleMinimal from './HeroStyleMinimal.vue';
import HeroStyleArch from './HeroStyleArch.vue';
import HeroStyleMonogram from './HeroStyleMonogram.vue';
import HeroStylePolaroid from './HeroStylePolaroid.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName:  { type: String, default: '' },
  labels:     { type: Object, required: true },
  cover:      { type: Object, default: () => ({}) },
  background: { type: Object, default: () => ({}) },
  countdownEvent: { type: Object, default: null },
  countdownOpts:  { type: Object, default: () => ({}) },
  hero:           { type: Object, default: () => ({}) },
});

const emit = defineEmits(['open']);

/* Harus sinkron dengan ThemeOptionsSchema::HERO_STYLES di backend
   (app/Filament/Support/ThemeOptionsSchema.php) — itu daftar resmi opsi
   yang admin bisa pilih. */
const KNOWN_HERO_STYLES = ['classic', 'framed', 'split', 'minimal', 'arch', 'monogram', 'polaroid', 'custom'];

const heroStyle = computed(() => props.hero?.style ?? 'classic');
/* Foto berbingkai (Framed/Split/Arch/Polaroid/Custom): field upload KHUSUS
   (hero.framed_photo, tab Hero) -- TERPISAH dari background halaman
   (hero.slideshow/video_url, tab Global). Fallback ke data lama (slideshow[0]/
   background.photo) untuk undangan yang sempat memakai konvensi lama. */
const heroPhoto = computed(() => props.hero?.framedPhoto ?? props.hero?.slideshow?.[0] ?? props.background?.photo ?? null);

/* Ukuran & warna PER-ELEMEN (default_options.hero.elements.$key.size/color) --
   diteruskan sebagai CSS var ke elemen anak (var(--hero-el-$key-color, ...)),
   berlaku di SEMUA gaya (bukan cuma Custom). Dibind sebagai :style di root
   <component>, otomatis di-merge Vue ke root elemen tiap HeroStyle*.vue
   (fallthrough attrs, komponen2 itu tidak set inheritAttrs:false).
   'countdown_label' menimpa eyebrow "Menuju hari bahagia" pada countdown YANG
   TERTANAM di hero saja (lihat CountdownLayoutSimple/Photo.vue fallback chain --
   var ini otomatis tidak berlaku untuk countdown section berdiri sendiri,
   karena hanya di-set di dalam subtree Cover ini). */
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
  // Field lama "Font nama pasangan di hero" (hero.name_font) SUDAH DIHAPUS dari
  // form -- digantikan elements.names.font di atas. Tetap tulis ke var LAMA
  // (--hero-name-font) supaya semua konsumen existing (tiap HeroStyle*.vue,
  // theme.css senja) otomatis ikut tanpa perlu diganti satu-satu.
  const nameFont = els.names?.font || props.hero?.nameFont;
  if (nameFont) vars['--hero-name-font'] = `'${nameFont}', cursive`;
  return vars;
});

if (import.meta.env.DEV) {
  watchEffect(() => {
    if (!KNOWN_HERO_STYLES.includes(heroStyle.value)) {
      console.warn(
        `[mildness/Cover] hero.style tidak dikenal: "${heroStyle.value}". Jatuh ke tampilan "minimal" sebagai fallback aman. Cek data theme_options.hero.style undangan ini.`
      );
    }
  });
}

const firstEvent = computed(() => props.invitation.events?.[0] ?? null);

/* Di dalam kartu hero, varian isi selalu 'simple' (foto/kutipan tidak muat
   rapi di kartu) — tapi GAYA ANGKA tetap mengikuti pilihan Filament. */
const coverCd = computed(() => ({ ...props.countdownOpts, layout: 'simple' }));

const weekday = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  return d ? d.toLocaleDateString('id-ID', { weekday: 'long' }) : '';
});

/* "28 • 03 • 2026" */
const dateDots = computed(() => {
  const d = firstEvent.value?.starts_at ? new Date(firstEvent.value.starts_at) : null;
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd} • ${mm} • ${d.getFullYear()}`;
});

const STYLES = {
  classic: HeroStyleClassic,
  framed: HeroStyleFramed,
  split: HeroStyleSplit,
  custom: HeroStyleCustom,
  minimal: HeroStyleMinimal,
  arch: HeroStyleArch,
  monogram: HeroStyleMonogram,
  polaroid: HeroStylePolaroid,
};
/* Style tak dikenal -> fallback ke 'minimal' (sama seperti perilaku lama). */
const activeStyle = computed(() => STYLES[heroStyle.value] ?? HeroStyleMinimal);
</script>

<template>
  <component
    :is="activeStyle"
    :style="elVars"
    :invitation="invitation"
    :guest-name="guestName"
    :labels="labels"
    :hero="hero"
    :hero-photo="heroPhoto"
    :first-event="firstEvent"
    :weekday="weekday"
    :date-dots="dateDots"
    :countdown-event="countdownEvent"
    :cover-cd="coverCd"
    @open="emit('open')"
  />
</template>
