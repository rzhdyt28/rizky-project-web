<script setup>
import { computed, ref } from "vue";
import CoverSection from "../shared/sections/CoverSection.vue";
import CountdownSection from "../shared/sections/CountdownSection.vue";
import CoupleSection from "../shared/sections/CoupleSection.vue";
import EventSection from "../shared/sections/EventSection.vue";
import CoHostSection from "../shared/sections/CoHostSection.vue";
import LoveStorySection from "../shared/sections/LoveStorySection.vue";
import GallerySection from "../shared/sections/GallerySection.vue";
import VideoSection from "../shared/sections/VideoSection.vue";
import RsvpSection from "../shared/sections/RsvpSection.vue";
import GuestbookSection from "../shared/sections/GuestbookSection.vue";
import GiftSection from "../shared/sections/GiftSection.vue";
import FooterSection from "../shared/sections/FooterSection.vue";
import BackgroundLayer from "../shared/ui/BackgroundLayer.vue";
import MusicPlayer from "../shared/ui/MusicPlayer.vue";
import BrandingFooter from "../shared/ui/BrandingFooter.vue";

const props = defineProps({
  invitation: { type: Object, required: true },
  guestName: { type: String, default: "" },
  guestbook: { type: Array, default: () => [] },
  slug: { type: String, required: true },
  can: { type: Object, required: true },
  labels: { type: Object, required: true },
  sectionOrder: { type: Array, required: true },
  sectionBg: { type: Function, required: true },
  globalBg: { type: Object, default: null },
  cover: { type: Object, default: () => ({}) },
});

const opened = ref(false);

/* Peta section key -> komponen + props dinamisnya (urutan dari sectionOrder). */
const SECTION_MAP = computed(() => ({
  couple: {
    comp: CoupleSection,
    props: { invitation: props.invitation, bg: props.sectionBg("couple") },
    show: props.can.couple,
  },
  // countdown: {
  //   comp: CountdownSection,
  //   props: {
  //     event: props.invitation.events?.[0],
  //     bg: props.sectionBg("countdown"),
  //   },
  //   show: props.can.countdown,
  // },
  events: {
    comp: EventSection,
    props: {
      events: props.invitation.events,
      labels: props.labels,
      showMaps: props.can.maps,
      bg: props.sectionBg("events"),
    },
    show: props.can.events,
  },
  co_host: {
    comp: CoHostSection,
    props: {
      coHosts: props.invitation.co_hosts,
      labels: props.labels,
      bg: props.sectionBg("co_host"),
    },
    show: props.can.co_host,
  },
  love_story: {
    comp: LoveStorySection,
    props: {
      stories: props.invitation.stories,
      labels: props.labels,
      bg: props.sectionBg("love_story"),
    },
    show: props.can.love_story,
  },
  gallery: {
    comp: GallerySection,
    props: {
      photos: props.invitation.photos,
      labels: props.labels,
      bg: props.sectionBg("gallery"),
    },
    show: props.can.gallery,
  },
  video: {
    comp: VideoSection,
    props: {
      videoUrl: props.invitation.video_url,
      labels: props.labels,
      bg: props.sectionBg("video"),
    },
    show: props.can.video,
  },
  rsvp: {
    comp: RsvpSection,
    props: {
      slug: props.slug,
      guestName: props.guestName,
      labels: props.labels,
      bg: props.sectionBg("rsvp"),
    },
    show: props.can.rsvp,
  },
  guestbook: {
    comp: GuestbookSection,
    props: {
      slug: props.slug,
      guestName: props.guestName,
      guestbook: props.guestbook,
      labels: props.labels,
      bg: props.sectionBg("guestbook"),
    },
    show: props.can.guestbook,
  },
  gift: {
    comp: GiftSection,
    props: {
      gifts: props.invitation.gifts,
      labels: props.labels,
      bg: props.sectionBg("gift"),
    },
    show: props.can.gift,
  },
}));

const orderedSections = computed(() =>
  props.sectionOrder
    .map((key) => ({ key, ...SECTION_MAP.value[key] }))
    .filter((s) => s.comp && s.show),
);
</script>

<template>
  <!-- class="relative min-h-screen font-light" -->
  <!-- <div class="max-w-xl mx-auto"> -->
  <div
    class="relative min-h-screen font-light"
    :style="{
      background: 'var(--t-paper)',
      color: 'var(--t-ink)',
      fontFamily: 'var(--t-font-body)',
    }"
  >
    <BackgroundLayer :bg="globalBg" />

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
      <div class="w-full max-w-sm mx-auto">
        <component
          v-for="s in orderedSections"
          :key="s.key"
          :is="s.comp"
          v-bind="s.props"
        />
        <FooterSection :invitation="invitation" />
      </div>
      <MusicPlayer v-if="can.music" :url="invitation.music_url" />
      <BrandingFooter v-if="can.branding" />
    </template>
  </div>
</template>
