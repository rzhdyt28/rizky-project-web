<script setup>
import SectionWrapper from '../ui/SectionWrapper.vue';
import TheButton from '../ui/TheButton.vue';
import { toMapsEmbed } from '../../../composables/useThemeOptions';

defineProps({
  events:   { type: Array, default: () => [] },
  labels:   { type: Object, required: true },
  showMaps: { type: Boolean, default: false },   // fitur paket Premium+
  bg:       { type: Object, default: null },
});

const dateLong = (d) => new Date(d).toLocaleDateString('id-ID',
  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeShort = (d) => new Date(d).toLocaleTimeString('id-ID',
  { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <SectionWrapper :title="labels.title_events" :bg="bg">
    <div class="grid gap-4">
      <article
        v-for="ev in events" :key="ev.id"
        class="border bg-white/60 p-5"
        :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 25%, transparent)' }"
      >
        <h4 class="text-xl" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">
          {{ ev.title }}
        </h4>
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
        <a
          v-else-if="ev.maps_url"
          :href="ev.maps_url" target="_blank" rel="noopener"
          class="mt-3 inline-block"
        >
          <TheButton ghost>Lihat lokasi</TheButton>
        </a>
      </article>
    </div>
  </SectionWrapper>
</template>
