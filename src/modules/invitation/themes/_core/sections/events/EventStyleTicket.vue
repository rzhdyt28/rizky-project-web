<script setup>
/** Acara -- gaya "ticket": kartu ala tiket sobek (garis putus-putus + notch kiri-kanan), playful. */
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
  <div class="grid max-w-md gap-6 mx-auto">
    <article v-for="ev in events" :key="ev.id" class="text-center c-event__ticket">
      <div class="c-event__ticket-notch c-event__ticket-notch--l" aria-hidden="true" />
      <div class="c-event__ticket-notch c-event__ticket-notch--r" aria-hidden="true" />
      <h4 class="text-lg" :style="{ fontFamily: 'var(--el-name-font, var(--t-font-head))', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size, 1.125rem)' }">{{ ev.title }}</h4>
      <span class="c-event__ticket-rule" aria-hidden="true" />
      <p class="text-sm capitalize" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">{{ dateLong(ev.starts_at) }}</p>
      <p class="text-sm" :style="{ color: 'var(--el-date-color)', fontSize: 'var(--el-date-size)' }">
        Pukul {{ timeShort(ev.starts_at) }}<span v-if="ev.ends_at"> – {{ timeShort(ev.ends_at) }}</span> WIB
      </p>
      <p class="mt-1 text-sm font-normal" :style="{ color: 'var(--el-venue-color)', fontSize: 'var(--el-venue-size)' }">{{ ev.venue_name }}</p>
      <p v-if="ev.address" class="text-xs opacity-75" :style="{ color: 'var(--el-venue-color)' }">{{ ev.address }}</p>
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
</template>

<style scoped>
.c-event__ticket {
  position: relative;
  padding: 1.5rem 1.25rem;
  border: 1.5px dashed color-mix(in srgb, var(--t-accent) 45%, transparent);
  border-radius: 0.9rem;
  background: var(--t-paper);
}
.c-event__ticket-notch {
  position: absolute;
  top: 50%;
  width: 1.1rem; height: 1.1rem;
  background: var(--page-bg, #fff);
  border-radius: 50%;
  transform: translateY(-50%);
}
.c-event__ticket-notch--l { left: -0.6rem; }
.c-event__ticket-notch--r { right: -0.6rem; }
.c-event__ticket-rule {
  display: block;
  width: 2.5rem; height: 1px;
  margin: 0.6rem auto 0.7rem;
  background: color-mix(in srgb, var(--t-gold, #b08d4a) 70%, transparent);
}
</style>
