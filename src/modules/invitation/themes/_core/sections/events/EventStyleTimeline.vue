<script setup>
/** Acara -- gaya "timeline": garis putus-putus (selaras Kisah Kami). */
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
  <div class="relative max-w-md mx-auto c-event__timeline">
    <span class="c-event__spine" aria-hidden="true" />
    <article v-for="ev in events" :key="ev.id" class="relative pb-10 text-center c-event__tl-item last:pb-0">
      <span class="relative z-10 grid mx-auto mb-4 c-event__node place-items-center">✦</span>
      <div class="max-w-xs px-4 py-4 mx-auto c-event__tl-card">
        <h4 class="mb-1 text-lg" :style="{ fontFamily: 'var(--el-name-font, var(--t-font-head))', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size, 1.125rem)' }">{{ ev.title }}</h4>
        <p class="mb-1 text-sm capitalize" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">{{ dateLong(ev.starts_at) }}</p>
        <p class="text-sm" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">
          Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
        </p>
        <p class="mt-1 text-sm font-normal" :style="{ color: 'var(--el-venue-color)', fontSize: 'var(--el-venue-size)' }">{{ ev.venue_name }}</p>
        <p v-if="ev.address" class="text-xs opacity-75" :style="{ color: 'var(--el-venue-color)' }">{{ ev.address }}</p>
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
</template>

<style scoped>
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
