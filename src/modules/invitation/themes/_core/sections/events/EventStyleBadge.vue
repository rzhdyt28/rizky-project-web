<script setup>
/** Acara -- gaya "badge": nomor urut bulat di kiri, detail acara di kanan (baris horizontal). */
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
  <div class="grid max-w-md gap-5 mx-auto">
    <article v-for="(ev, i) in events" :key="ev.id" class="flex items-start gap-4 text-left">
      <span class="c-event__badge" :style="{ fontFamily: 'var(--el-name-font, var(--t-font-head))' }">{{ i + 1 }}</span>
      <div class="flex-1 pt-1">
        <h4 class="text-lg" :style="{ fontFamily: 'var(--el-name-font, var(--t-font-head))', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size, 1.125rem)' }">{{ ev.title }}</h4>
        <p class="text-sm capitalize" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">{{ dateLong(ev.starts_at) }}</p>
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
.c-event__badge {
  display: flex; flex-shrink: 0; align-items: center; justify-content: center;
  width: 2.4rem; height: 2.4rem; border-radius: 50%;
  background: color-mix(in srgb, var(--t-accent) 10%, transparent);
  color: var(--t-accent);
  font-size: 1.1rem;
}
</style>
