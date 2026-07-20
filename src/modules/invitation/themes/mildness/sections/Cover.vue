<script setup>
/**
 * MILDNESS/Cover — hidup DI DALAM kartu mengambang (dibungkus Layout).
 * 4 MODEL (hero.style), selaras pola multi-style section lain:
 *   classic : nama kaligrafi + tanggal titik-pisah + countdown (default lama)
 *   framed  : + foto pasangan (background.photo) dalam bingkai bulat kecil
 *             di atas nama
 *   split   : dua kolom di layar lebar — teks di kiri, foto berbingkai di
 *             kanan; bertumpuk di HP (foto di atas)
 *   minimal : nama besar + garis tipis emas + tanggal + tombol, tanpa
 *             eyebrow/countdown supaya sangat bersih
 * Semua model tetap menghormati dresscode & "Kepada" bila diisi.
 */
import { computed, watchEffect } from 'vue';
import CountdownSection from '../../_core/sections/CountdownSection.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName:  { type: String, default: '' },
  labels:     { type: Object, required: true },
  cover:      { type: Object, default: () => ({}) },
  background: { type: Object, default: () => ({}) },
  countdownEvent: { type: Object, default: null },
  countdownOpts:  { type: Object, default: () => ({}) },
  /* v3: opsi hero — style, dresscode, font nama. */
  hero:           { type: Object, default: () => ({}) },
});

const emit = defineEmits(['open']);

/* Harus sinkron dengan ThemeOptionsSchema::HERO_STYLES di backend
   (app/Filament/Support/ThemeOptionsSchema.php) — itu daftar resmi opsi
   yang admin bisa pilih. */
const KNOWN_HERO_STYLES = ['classic', 'framed', 'split', 'minimal', 'custom'];

const heroStyle = computed(() => props.hero?.style ?? 'classic');
const heroPhoto = computed(() => props.background?.photo ?? null);

if (import.meta.env.DEV) {
  watchEffect(() => {
    if (!KNOWN_HERO_STYLES.includes(heroStyle.value)) {
      console.warn(
        `[mildness/Cover] hero.style tidak dikenal: "${heroStyle.value}". Jatuh ke tampilan "minimal" sebagai fallback aman. Cek data theme_options.hero.style undangan ini.`
      );
    }
  });
}

/* ===== MODE CUSTOM: tiap elemen punya order + align sendiri (bebas) ===== */
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
</script>

<template>
  <!-- ============ 1) CLASSIC (default, perilaku lama) ============ -->
  <div v-if="heroStyle === 'classic'" class="relative flex flex-col items-center w-full gap-4 px-6 py-10 text-center mild-cover">
    <p class="text-xs tracking-[0.15em]" :style="{ color: 'var(--t-ink)', opacity: 0.75 }">Undangan Pernikahan</p>
    <h1 class="text-4xl leading-tight sm:text-5xl" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--t-accent)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
    </h1>
    <div v-if="firstEvent" class="mt-1 flex flex-col items-center gap-0.5 text-sm" :style="{ color: 'var(--t-ink)' }">
      <span class="capitalize">{{ weekday }}</span>
      <span>{{ dateDots }}</span>
    </div>
    <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
    <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode">
      <span class="mild-dresscode__label">Dress Code</span>
      <span class="mild-dresscode__text">{{ hero.dresscode }}</span>
    </div>
    <div v-if="guestName" class="grid gap-1 mt-1">
      <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
      <strong class="text-base font-normal">{{ guestName }}</strong>
    </div>
    <button class="c-btn mt-3 inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
      :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }" @click="emit('open')">
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
      </svg>
      {{ labels.btn_open }}
    </button>
  </div>

  <!-- ============ 2) FRAMED — foto bulat di atas nama ============ -->
  <div v-else-if="heroStyle === 'framed'" class="relative flex flex-col items-center w-full gap-4 px-6 py-10 text-center mild-cover">
    <img v-if="heroPhoto" :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
      class="object-cover rounded-full mild-cover__framed h-32 w-32 sm:h-36 sm:w-36" />
    <p class="text-xs tracking-[0.15em]" :style="{ color: 'var(--t-ink)', opacity: 0.75 }">Undangan Pernikahan</p>
    <h1 class="text-3xl leading-tight sm:text-4xl" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--t-accent)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
    </h1>
    <div v-if="firstEvent" class="mt-1 flex flex-col items-center gap-0.5 text-sm" :style="{ color: 'var(--t-ink)' }">
      <span class="capitalize">{{ weekday }}</span>
      <span>{{ dateDots }}</span>
    </div>
    <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
    <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode">
      <span class="mild-dresscode__label">Dress Code</span>
      <span class="mild-dresscode__text">{{ hero.dresscode }}</span>
    </div>
    <div v-if="guestName" class="grid gap-1 mt-1">
      <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
      <strong class="text-base font-normal">{{ guestName }}</strong>
    </div>
    <button class="c-btn mt-3 inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
      :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }" @click="emit('open')">
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
      </svg>
      {{ labels.btn_open }}
    </button>
  </div>

  <!-- ============ 3) SPLIT — teks & foto berbingkai dua kolom (lebar) ============ -->
  <div v-else-if="heroStyle === 'split'" class="grid items-center w-full gap-6 px-6 py-10 text-center mild-cover sm:grid-cols-2 sm:text-left">
    <img v-if="heroPhoto" :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
      class="object-cover w-full mx-auto mild-cover__split max-w-[14rem] rounded-2xl aspect-[3/4] sm:order-2 sm:max-w-none" />
    <div class="flex flex-col items-center gap-4 sm:order-1 sm:items-start">
      <p class="text-xs tracking-[0.15em]" :style="{ color: 'var(--t-ink)', opacity: 0.75 }">Undangan Pernikahan</p>
      <h1 class="text-3xl leading-tight sm:text-4xl" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--t-accent)' }">
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h1>
      <div v-if="firstEvent" class="flex flex-col gap-0.5 text-sm" :style="{ color: 'var(--t-ink)' }">
        <span class="capitalize">{{ weekday }}</span>
        <span>{{ dateDots }}</span>
      </div>
      <CountdownSection v-if="countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
      <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode sm:items-start">
        <span class="mild-dresscode__label">Dress Code</span>
        <span class="mild-dresscode__text">{{ hero.dresscode }}</span>
      </div>
      <div v-if="guestName" class="grid gap-1">
        <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
        <strong class="text-base font-normal">{{ guestName }}</strong>
      </div>
      <button class="c-btn inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
        :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }" @click="emit('open')">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
        </svg>
        {{ labels.btn_open }}
      </button>
    </div>
  </div>

  <!-- ============ 5) CUSTOM — tiap elemen bebas urutan & rata sendiri ============ -->
  <div v-else-if="heroStyle === 'custom'" class="relative flex flex-col w-full gap-4 px-6 py-10 mild-cover">
    <template v-for="el in orderedElements" :key="el.key">
      <p v-if="el.key === 'eyebrow'" class="text-xs tracking-[0.15em]" :style="{ color: 'var(--t-ink)', opacity: 0.75, textAlign: el.align }">
        Undangan Pernikahan
      </p>
      <img
        v-else-if="el.key === 'photo' && heroPhoto"
        :src="assetUrl(heroPhoto)" :alt="`${invitation.bride_name} & ${invitation.groom_name}`" loading="lazy"
        class="object-cover rounded-full mild-cover__framed h-28 w-28"
        :style="alignMargin(el.align)"
      />
      <h1
        v-else-if="el.key === 'names'" class="text-4xl leading-tight sm:text-5xl"
        :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--t-accent)', textAlign: el.align }"
      >
        {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      </h1>
      <div
        v-else-if="el.key === 'date' && firstEvent" class="flex flex-col gap-0.5 text-sm"
        :style="{ color: 'var(--t-ink)', textAlign: el.align, alignItems: alignItems(el.align) }"
      >
        <span class="capitalize">{{ weekday }}</span>
        <span>{{ dateDots }}</span>
      </div>
      <CountdownSection v-else-if="el.key === 'countdown' && countdownEvent" :event="countdownEvent" :opts="coverCd" class="w-full" />
      <div v-else-if="el.key === 'dresscode' && hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode" :style="{ justifyItems: alignItems(el.align) }">
        <span class="mild-dresscode__label">Dress Code</span>
        <span class="mild-dresscode__text">{{ hero.dresscode }}</span>
      </div>
      <div v-else-if="el.key === 'guest' && guestName" class="grid gap-1" :style="{ justifyItems: alignItems(el.align) }">
        <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
        <strong class="text-base font-normal">{{ guestName }}</strong>
      </div>
      <div v-else-if="el.key === 'button'" :style="{ display: 'flex', justifyContent: alignJustify(el.align) }">
        <button
          class="c-btn inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
          :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }" @click="emit('open')"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
          </svg>
          {{ labels.btn_open }}
        </button>
      </div>
    </template>
  </div>

  <!-- ============ 4) MINIMAL — nama besar + garis tipis, sangat bersih ============ -->
  <!-- Juga dipakai sebagai fallback untuk heroStyle yang tidak dikenal (lihat
       KNOWN_HERO_STYLES + console.warn di <script setup>) — bukan lagi v-else
       diam-diam, tapi dua kondisi eksplisit yang berbagi tampilan yang sama. -->
  <div v-else-if="heroStyle === 'minimal' || !KNOWN_HERO_STYLES.includes(heroStyle)" class="relative flex flex-col items-center w-full gap-3 px-6 py-14 text-center mild-cover">
    <h1 class="text-4xl leading-tight sm:text-5xl" :style="{ fontFamily: 'var(--hero-name-font, var(--t-font-script))', color: 'var(--t-accent)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
    </h1>
    <span class="mild-cover__rule" aria-hidden="true" />
    <div v-if="firstEvent" class="flex flex-col items-center gap-0.5 text-sm" :style="{ color: 'var(--t-ink)' }">
      <span class="capitalize">{{ weekday }}</span>
      <span>{{ dateDots }}</span>
    </div>
    <div v-if="hero.dresscodeEnabled && hero.dresscode" class="mild-dresscode">
      <span class="mild-dresscode__label">Dress Code</span>
      <span class="mild-dresscode__text">{{ hero.dresscode }}</span>
    </div>
    <div v-if="guestName" class="grid gap-1 mt-1">
      <small class="text-xs tracking-[0.1em]" :style="{ opacity: 0.7 }">Kepada:</small>
      <strong class="text-base font-normal">{{ guestName }}</strong>
    </div>
    <button class="c-btn mt-3 inline-flex cursor-pointer items-center gap-2 border-0 px-7 py-3 text-xs uppercase tracking-[0.12em] transition hover:opacity-90"
      :style="{ background: 'var(--t-btn-bg)', color: 'var(--t-btn-text)' }" @click="emit('open')">
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
      </svg>
      {{ labels.btn_open }}
    </button>
  </div>
</template>

<style scoped>
.mild-cover { animation: mildFade 1.1s ease-out both; }
.mild-cover__framed,
.mild-cover__split {
  border: 3px solid var(--t-gold, #b08d4a);
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
.mild-cover__rule {
  width: 3.5rem; height: 1px;
  background: color-mix(in srgb, var(--t-gold, #b08d4a) 70%, transparent);
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
  color: var(--t-gold);
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
