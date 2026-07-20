<script setup>
/**
 * _CORE / Acara — 4 MODEL, dipilih dari Filament (events.style):
 *   card     : panel bertepi klasik (default, perilaku lama)
 *   elegant  : flourish SVG + tipografi vintage ala undangan cetak
 *   timeline : garis putus-putus vertikal + penanda, selaras Kisah Kami
 *   minimal  : tanpa kotak, teks rapi dipisah garis tipis putus-putus
 * SEMUA model tetap menghormati showMaps (peta tertanam atau tombol link).
 */
import SectionWrapper from '../ui/SectionWrapper.vue';
import TheButton from '../ui/TheButton.vue';
import { toMapsEmbed } from '../../../composables/useThemeOptions';

defineProps({
  events:    { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  showMaps:  { type: Boolean, default: false },
  styleName: { type: String, default: 'card' }, // card|elegant|timeline|minimal
});

const dateLong = (d) => new Date(d).toLocaleDateString('id-ID',
  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeShort = (d) => new Date(d).toLocaleTimeString('id-ID',
  { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <SectionWrapper :title="labels.title_events">
    <!-- ============ 1) CARD (default, perilaku lama) ============ -->
    <div v-if="styleName === 'card'" class="grid gap-4">
      <article
        v-for="ev in events" :key="ev.id"
        class="p-5 border c-panel bg-white/60"
        :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 25%, transparent)' }"
      >
        <h4 class="text-xl" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">{{ ev.title }}</h4>
        <p class="text-sm">{{ dateLong(ev.starts_at) }}</p>
        <p class="text-sm">
          Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
        </p>
        <p class="mt-1 text-sm font-normal">{{ ev.venue_name }}</p>
        <p v-if="ev.address" class="text-xs opacity-75">{{ ev.address }}</p>
        <iframe
          v-if="showMaps && ev.maps_url"
          :src="toMapsEmbed(ev.maps_url)"
          class="mt-3 h-44 w-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Peta lokasi"
        />
        <a v-else-if="ev.maps_url" :href="ev.maps_url" target="_blank" rel="noopener" class="inline-block mt-3">
          <TheButton ghost>Lihat lokasi</TheButton>
        </a>
      </article>
    </div>

    <!-- ============ 2) ELEGANT — flourish + tipografi vintage ============ -->
    <div v-else-if="styleName === 'elegant'" class="grid max-w-md gap-10 mx-auto">
      <article v-for="ev in events" :key="ev.id" class="text-center c-event__elegant">
        <p class="mb-2 text-[11px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">{{ ev.title }}</p>
        <svg viewBox="0 0 120 20" class="w-24 h-4 mx-auto mb-4 c-event__flourish" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M0 10 H45 M75 10 H120" />
          <circle cx="60" cy="10" r="4" />
        </svg>
        <p class="mb-1 text-lg capitalize c-event__date" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">
          {{ dateLong(ev.starts_at) }}
        </p>
        <p class="mb-4 text-sm">
          Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
        </p>
        <p class="text-sm font-normal">{{ ev.venue_name }}</p>
        <p v-if="ev.address" class="max-w-xs mx-auto text-xs opacity-75">{{ ev.address }}</p>
        <iframe
          v-if="showMaps && ev.maps_url"
          :src="toMapsEmbed(ev.maps_url)"
          class="mt-4 h-44 w-full border-0 rounded-xl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Peta lokasi"
        />
        <a v-else-if="ev.maps_url" :href="ev.maps_url" target="_blank" rel="noopener" class="inline-block mt-4">
          <TheButton ghost>Google Maps</TheButton>
        </a>
      </article>
    </div>

    <!-- ============ 3) TIMELINE — garis putus-putus (selaras Kisah Kami) ============ -->
    <div v-else-if="styleName === 'timeline'" class="relative max-w-md mx-auto c-event__timeline">
      <span class="c-event__spine" aria-hidden="true" />
      <article v-for="ev in events" :key="ev.id" class="relative pb-10 text-center c-event__tl-item last:pb-0">
        <span class="relative z-10 grid mx-auto mb-4 c-event__node place-items-center">✦</span>
        <div class="max-w-xs px-4 py-4 mx-auto c-event__tl-card">
          <h4 class="mb-1 text-lg" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">{{ ev.title }}</h4>
          <p class="mb-1 text-sm capitalize">{{ dateLong(ev.starts_at) }}</p>
          <p class="text-sm">
            Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
          </p>
          <p class="mt-1 text-sm font-normal">{{ ev.venue_name }}</p>
          <p v-if="ev.address" class="text-xs opacity-75">{{ ev.address }}</p>
          <iframe
            v-if="showMaps && ev.maps_url"
            :src="toMapsEmbed(ev.maps_url)"
            class="mt-3 h-40 w-full border-0 rounded-lg"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Peta lokasi"
          />
          <a v-else-if="ev.maps_url" :href="ev.maps_url" target="_blank" rel="noopener" class="inline-block mt-3">
            <TheButton ghost>Lihat lokasi</TheButton>
          </a>
        </div>
      </article>
    </div>

    <!-- ============ 4) MINIMAL — tanpa kotak, garis tipis pemisah ============ -->
    <div
      v-else class="grid max-w-md gap-6 mx-auto divide-y divide-dashed c-event__minimal"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 25%, transparent)' }"
    >
      <article v-for="ev in events" :key="ev.id" class="pt-6 text-center first:pt-0">
        <h4 class="mb-1 text-lg" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">{{ ev.title }}</h4>
        <p class="text-sm">
          {{ dateLong(ev.starts_at) }} &middot; Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
        </p>
        <p class="mt-1 text-sm font-normal">{{ ev.venue_name }}</p>
        <p v-if="ev.address" class="text-xs opacity-75">{{ ev.address }}</p>
        <iframe
          v-if="showMaps && ev.maps_url"
          :src="toMapsEmbed(ev.maps_url)"
          class="mt-3 h-40 w-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Peta lokasi"
        />
        <a v-else-if="ev.maps_url" :href="ev.maps_url" target="_blank" rel="noopener" class="inline-block mt-3">
          <TheButton ghost>Lihat lokasi</TheButton>
        </a>
      </article>
    </div>
  </SectionWrapper>
</template>

<style scoped>
.c-event__flourish { color: var(--t-gold, #b08d4a); }
.c-event__date { color: var(--t-accent); }

.c-event__spine {
  position: absolute;
  top: 0.5rem; bottom: 0.5rem; left: 50%;
  width: 0; border-left: 2px dotted color-mix(in srgb, var(--t-accent) 45%, transparent);
  transform: translateX(-50%);
  z-index: 0;
}
.c-event__node {
  width: 1.9rem; height: 1.9rem; border-radius: 9999px;
  background: var(--t-paper); color: var(--t-accent);
  border: 1.5px solid color-mix(in srgb, var(--t-accent) 55%, transparent);
  font-size: 0.95rem; line-height: 1;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.25);
}
.c-event__tl-card {
  border-radius: 1.25rem;
  background: var(--t-paper);
  border: 1px solid color-mix(in srgb, var(--t-accent) 18%, transparent);
  box-shadow: 0 16px 34px -18px rgba(0, 0, 0, 0.4);
}
</style>
