<script setup>
/**
 * GLOBAL — SATU-SATUNYA tempat pemetaan section->komponen hidup.
 * Semua Layout tema memakai ini, jadi kalau kontrak props sebuah section
 * berubah, cukup edit file ini — bukan tiap tema.
 *
 * Pemakaian di Layout tema:
 *   <SectionRenderer :ctx="ctx" :overrides="{ countdown: MyCountdown }"
 *     v-slot="{ entry }">
 *     <FloatingCard><component :is="entry.comp" v-bind="entry.props" /></FloatingCard>
 *   </SectionRenderer>
 *
 * - ctx      : bundel props dari InvitationPublic (lihat di bawah).
 * - overrides: peta { sectionKey: KomponenTema } — tema hanya menimpa
 *              section yang memang mau dibedakan, sisanya pakai _core.
 * - Slot default menentukan PEMBUNGKUS tiap section (kartu, polos, dll).
 *   Tanpa slot, section dirender polos.
 */
import { computed } from 'vue';
import CountdownSection from '../themes/_core/sections/CountdownSection.vue';
import CoupleSection from '../themes/_core/sections/CoupleSection.vue';
import EventSection from '../themes/_core/sections/EventSection.vue';
import CoHostSection from '../themes/_core/sections/CoHostSection.vue';
import LoveStorySection from '../themes/_core/sections/LoveStorySection.vue';
import GallerySection from '../themes/_core/sections/GallerySection.vue';
import VideoSection from '../themes/_core/sections/VideoSection.vue';
import RsvpSection from '../themes/_core/sections/RsvpSection.vue';
import GuestbookSection from '../themes/_core/sections/GuestbookSection.vue';
import GiftSection from '../themes/_core/sections/GiftSection.vue';

const props = defineProps({
  ctx:       { type: Object, required: true },
  overrides: { type: Object, default: () => ({}) },
});

const CORE = {
  countdown:  CountdownSection,
  couple:     CoupleSection,
  events:     EventSection,
  co_host:    CoHostSection,
  love_story: LoveStorySection,
  gallery:    GallerySection,
  video:      VideoSection,
  rsvp:       RsvpSection,
  guestbook:  GuestbookSection,
  gift:       GiftSection,
};

/** Props tiap section — kontrak tunggal. Opsi tampilan per-section (v3)
 *  dibaca langsung dari invitation.theme_options (sudah ter-merge backend). */
function propsFor(key) {
  const c = props.ctx;
  const to = c.invitation.theme_options ?? {};
  switch (key) {
    case 'countdown':  return { event: c.invitation.events?.[0], invitation: c.invitation, labels: c.labels, opts: c.countdown ?? {} };
    case 'couple':     return { invitation: c.invitation, opts: to.couple ?? {} };
    case 'events':     return { events: c.invitation.events, labels: c.labels, showMaps: c.can.maps, styleName: to.events?.style ?? 'card' };
    case 'co_host':    return { coHosts: c.invitation.co_hosts, labels: c.labels };
    case 'love_story': return { stories: c.invitation.stories, labels: c.labels, showPhotos: to.love_story?.show_photos ?? false, styleName: to.love_story?.style ?? 'stacked' };
    case 'gallery':    return { photos: c.invitation.photos, labels: c.labels, styleName: to.gallery?.style ?? 'carousel' };
    case 'video':      return { videoUrl: c.invitation.video_url, labels: c.labels, invitation: c.invitation, opts: to.video ?? {} };
    case 'rsvp':       return { slug: c.slug, guestName: c.guestName, labels: c.labels };
    case 'guestbook':  return { slug: c.slug, guestName: c.guestName, guestbook: c.guestbook, labels: c.labels };
    case 'gift':       return { gifts: c.invitation.gifts, labels: c.labels };
    default:           return {};
  }
}

const entries = computed(() =>
  props.ctx.sectionOrder
    .filter((key) => CORE[key] && props.ctx.can[key])
    .map((key) => ({
      key,
      comp: props.overrides[key] ?? CORE[key],
      props: propsFor(key),
    }))
);
</script>

<template>
  <template v-for="entry in entries" :key="entry.key">
    <slot :entry="entry">
      <component :is="entry.comp" v-bind="entry.props" />
    </slot>
  </template>
</template>
