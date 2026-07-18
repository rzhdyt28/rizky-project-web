<script setup>
/**
 * TEMPLATE TEMA BARU — cara pakai:
 * 1. Copy folder ini, rename sesuai component_key (mis. themes/romantic).
 * 2. Ganti "namatema" di theme.css & class root di bawah.
 * 3. Sesuaikan tokens.js (palet + font).
 * 4. Daftarkan di ../registry.js  +  buat record Theme di Filament
 *    dengan component_key yang sama.
 * 5. (Opsional) buat folder sections/ berisi section yang mau dibedakan,
 *    lalu oper lewat :overrides pada SectionRenderer.
 * WAJIB: uji lebar 360px (mobile) dulu sebelum desktop.
 */
import { computed, ref } from 'vue';
import './theme.css';
import SectionRenderer from '../../components/SectionRenderer.vue';
import CoverSection from '../_core/sections/CoverSection.vue';
import FooterSection from '../_core/sections/FooterSection.vue';
import MusicPlayer from '../_core/ui/MusicPlayer.vue';
import BrandingFooter from '../_core/ui/BrandingFooter.vue';

const props = defineProps({
  invitation:   { type: Object, required: true },
  guestName:    { type: String, default: '' },
  guestbook:    { type: Array, default: () => [] },
  slug:         { type: String, required: true },
  can:          { type: Object, required: true },
  labels:       { type: Object, required: true },
  sectionOrder: { type: Array, required: true },
  cover:        { type: Object, default: () => ({}) },
});

const opened = ref(false);

const ctx = computed(() => ({
  invitation: props.invitation,
  guestName:  props.guestName,
  guestbook:  props.guestbook,
  slug:       props.slug,
  can:        props.can,
  labels:     props.labels,
  sectionOrder: props.sectionOrder,
}));
</script>

<template>
  <div
    class="theme-namatema relative min-h-screen"
    :style="{ color: 'var(--t-ink)', fontFamily: 'var(--t-font-body)' }"
  >
    <CoverSection
      v-if="!opened"
      :invitation="invitation"
      :countdown-event="can.countdown ? invitation.events?.[0] : null"
      :guest-name="guestName"
      :labels="labels"
      :cover="cover"
      @open="opened = true"
    />

    <template v-else>
      <div class="mx-auto w-full max-w-md">
        <SectionRenderer :ctx="ctx" />
        <FooterSection :invitation="invitation" />
      </div>
      <MusicPlayer v-if="can.music" :url="invitation.music_url" />
      <BrandingFooter v-if="can.branding" />
    </template>
  </div>
</template>
