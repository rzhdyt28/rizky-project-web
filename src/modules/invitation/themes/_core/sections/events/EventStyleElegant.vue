<script setup>
/** Acara -- gaya "elegant": flourish SVG + tipografi vintage ala undangan cetak. */
import TheButton from '../../ui/TheButton.vue';
import { toMapsEmbed } from '../../../../composables/useThemeOptions';

defineProps({
  events:   { type: Array, default: () => [] },
  showMaps: { type: Boolean, default: false },
});

const dateLong = (d) => new Date(d).toLocaleDateString('id-ID',
  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeShort = (d) => new Date(d).toLocaleTimeString('id-ID',
  { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="grid max-w-md gap-10 mx-auto">
    <article v-for="ev in events" :key="ev.id" class="text-center c-event__elegant">
      <p class="mb-2 text-[11px] uppercase tracking-[0.35em]" :style="{ color: 'var(--el-name-color, var(--t-gold))', fontSize: 'var(--el-name-size)' }">{{ ev.title }}</p>
      <svg viewBox="0 0 120 20" class="w-24 h-4 mx-auto mb-4 c-event__flourish" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M0 10 H45 M75 10 H120" />
        <circle cx="60" cy="10" r="4" />
      </svg>
      <p class="mb-1 text-lg capitalize c-event__date" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-date-color, var(--t-accent))', fontSize: 'var(--el-date-size, 1.125rem)' }">
        {{ dateLong(ev.starts_at) }}
      </p>
      <p class="mb-4 text-sm" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">
        Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
      </p>
      <p class="text-sm font-normal" :style="{ color: 'var(--el-venue-color)', fontSize: 'var(--el-venue-size)' }">{{ ev.venue_name }}</p>
      <p v-if="ev.address" class="max-w-xs mx-auto text-xs opacity-75" :style="{ color: 'var(--el-venue-color)' }">{{ ev.address }}</p>
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
</template>

<style scoped>
.c-event__flourish { color: var(--t-gold, #b08d4a); }
.c-event__date { color: var(--t-accent); }
</style>
