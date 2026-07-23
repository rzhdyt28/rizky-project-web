<script setup>
/** Acara -- gaya "compact": daftar padat satu baris per acara, cocok untuk banyak acara sekaligus. */
import TheButton from '../../ui/TheButton.vue';
import { toMapsEmbed } from '../../../../composables/useThemeOptions';

defineProps({
  events:   { type: Array, default: () => [] },
  showMaps: { type: Boolean, default: false },
});

const dateShort = (d) => new Date(d).toLocaleDateString('id-ID',
  { day: 'numeric', month: 'short', year: 'numeric' });
const timeShort = (d) => new Date(d).toLocaleTimeString('id-ID',
  { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="grid max-w-md gap-3 mx-auto">
    <article v-for="ev in events" :key="ev.id" class="flex items-center gap-3 py-3 c-event__compact-row">
      <div class="grid text-center c-event__compact-date">
        <span class="text-xs uppercase tracking-wide" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">{{ dateShort(ev.starts_at) }}</span>
      </div>
      <span class="c-event__compact-sep" aria-hidden="true" />
      <div class="flex-1 text-left">
        <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size, 1rem)' }">{{ ev.title }}</h4>
        <p class="text-xs" :style="{ color: 'var(--el-venue-color)', fontSize: 'var(--el-venue-size)' }">
          {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB &middot; {{ ev.venue_name }}
        </p>
        <iframe
          v-if="showMaps && ev.maps_url"
          :src="toMapsEmbed(ev.maps_url)"
          class="mt-2 h-32 w-full border-0 rounded-lg"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Peta lokasi"
        />
        <a v-else-if="ev.maps_url" :href="ev.maps_url" target="_blank" rel="noopener" class="inline-block mt-2">
          <TheButton ghost>Lihat lokasi</TheButton>
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.c-event__compact-row + .c-event__compact-row { border-top: 1px solid color-mix(in srgb, var(--t-accent) 15%, transparent); }
.c-event__compact-date { min-width: 3.5rem; color: var(--t-accent); }
.c-event__compact-sep { width: 1px; align-self: stretch; background: color-mix(in srgb, var(--t-accent) 20%, transparent); }
</style>
