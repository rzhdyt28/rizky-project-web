<script setup>
/**
 * _CORE — Cover netral (dipakai elegant/rustic apa adanya).
 * Kontrak cover BARU (dari Filament):
 *   cover.photo    : foto prewedding / gambar monogram (background sampul)
 *   cover.ornament : ornamen dekoratif (upload/pustaka aset)
 *   cover.show_monogram : tampilkan lingkaran monogram inisial
 * Kunci lama (bg_image, ornament_top/bottom) tetap dibaca sebagai fallback
 * supaya data lama tidak rusak.
 */
import { computed } from 'vue';
import { assetUrl } from '../../../composables/assets';
import SealMonogram from '../ui/SealMonogram.vue';
import OrnamentDivider from '../ui/OrnamentDivider.vue';
import TheButton from '../ui/TheButton.vue';
import CountdownSection from './CountdownSection.vue';

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName:  { type: String, default: '' },
  labels:     { type: Object, required: true },
  cover:      { type: Object, default: () => ({}) },
  countdownEvent: { type: Object, default: null },
});

const emit = defineEmits(['open']);

const photo    = computed(() => props.cover.photo ?? props.cover.bg_image ?? null);
const ornament = computed(() => props.cover.ornament ?? props.cover.ornament_top ?? null);

const dateLong = (d) => d ? new Date(d).toLocaleDateString('id-ID',
  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
</script>

<template>
  <section
    class="c-cover relative flex min-h-screen flex-col items-center justify-center gap-3 overflow-hidden px-6 py-12 text-center"
    :style="photo
      ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)), url(${assetUrl(photo)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {}"
  >
    <span class="c-cover__corner pointer-events-none absolute left-4 top-4 h-16 w-16 border-l border-t opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="c-cover__corner pointer-events-none absolute right-4 top-4 h-16 w-16 border-r border-t opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="c-cover__corner pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b border-l opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />
    <span class="c-cover__corner pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b border-r opacity-30" :style="{ borderColor: 'var(--t-gold)' }" />

    <OrnamentDivider :image="ornament" />
    <p class="text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">Undangan Pernikahan</p>

    <SealMonogram
      v-if="cover.show_monogram !== false"
      :groom="invitation.groom_name"
      :bride="invitation.bride_name"
    />

    <h1 class="c-cover__names text-4xl leading-tight sm:text-5xl" :style="{ fontFamily: 'var(--t-font-head)' }">
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
    <OrnamentDivider :image="ornament" flip />
  </section>
</template>
