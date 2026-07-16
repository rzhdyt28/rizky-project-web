<script setup>
import { assetUrl } from '../../../composables/assets';
import SealMonogram from '../ui/SealMonogram.vue';
import OrnamentDivider from '../ui/OrnamentDivider.vue';
import TheButton from '../ui/TheButton.vue';

import CountdownSection from './CountdownSection.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName:  { type: String, default: '' },
  labels:     { type: Object, required: true },
  cover: { type: Object, default: () => ({}) },  // {bg_image, ornament_top, ornament_bottom, show_monogram}
  countdownEvent: { type: Object, default: null },  
});

const emit = defineEmits(['open']);

const dateLong = (d) => d ? new Date(d).toLocaleDateString('id-ID',
  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
</script>

<template>
  <section
    class="relative flex flex-col items-center justify-center min-h-screen gap-3 px-6 py-12 overflow-hidden text-center"
    :style="cover.bg_image
      ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)), url(${assetUrl(cover.bg_image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {}"
  >
    <span class="absolute w-16 h-16 border-t border-l pointer-events-none left-4 top-4 opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="absolute w-16 h-16 border-t border-r pointer-events-none right-4 top-4 opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="absolute w-16 h-16 border-b border-l pointer-events-none bottom-4 left-4 opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="absolute w-16 h-16 border-b border-r pointer-events-none bottom-4 right-4 opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />

    <OrnamentDivider :image="cover.ornament_top" />
    <p class="text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">Undangan Pernikahan</p>

    <SealMonogram
      v-if="cover.show_monogram !== false"
      :groom="invitation.groom_name"
      :bride="invitation.bride_name"
    />

    <h1 class="text-4xl leading-tight sm:text-5xl" :style="{ fontFamily: 'var(--t-font-head)' }">
      {{ invitation.groom_name }}
      <span class="italic" :style="{ color: 'var(--t-gold)' }">&amp;</span>
      {{ invitation.bride_name }}
    </h1>

    <p v-if="invitation.events?.length" class="text-sm tracking-[0.12em]">
      {{ dateLong(invitation.events[0].starts_at) }}
    </p>
     <CountdownSection v-if="countdownEvent" :event="countdownEvent" class="w-full" />

    <div v-if="guestName" class="mt-1 grid gap-0.5 border-t pt-3" :style="{ borderColor: 'var(--t-gold)' }">
      <small class="text-[9px] uppercase tracking-[0.2em] opacity-70">Kepada Yth.</small>
      <strong class="font-normal">{{ guestName }}</strong>
    </div>

    <TheButton class="mt-2" @click="emit('open')">{{ labels.btn_open }}</TheButton>
    <OrnamentDivider :image="cover.ornament_bottom" flip />
  </section>
</template>
