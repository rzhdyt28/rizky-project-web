<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { usePublicInvitation } from "../composables/useInvitation";
import { useThemeOptions } from "../composables/useThemeOptions";
import { resolveTheme } from "../themes/registry";

const route = useRoute();

// Slug dari path (/i/:slug) atau subdomain tenant (reza-mega.rizky.com)
const slug = computed(
  () => route.params.slug || location.hostname.split(".")[0],
);

const { data, isLoading, isError } = usePublicInvitation(
  slug.value,
  route.query.to,
);

const invitation = computed(() => data.value?.invitation ?? null);
const features = computed(() => data.value?.features ?? {});

const { cssVars, can, sectionOrder, labels, sectionBg, globalBg, cover } =
  useThemeOptions(invitation, features);

const ThemeLayout = computed(() =>
  resolveTheme(invitation.value?.theme?.component_key),
);
</script>

<template>
  <div v-if="isLoading" class="grid min-h-screen place-items-center font-sans">
    Memuat undangan…
  </div>
  <div
    v-else-if="isError || !invitation"
    class="grid min-h-screen place-items-center font-sans"
  >
    Undangan tidak ditemukan.
  </div>
  <div v-else :style="cssVars">
    <component
      :is="ThemeLayout"
      :invitation="invitation"
      :guest-name="data.guest_name || ''"
      :guestbook="data.guestbook"
      :slug="slug"
      :can="can"
      :labels="labels"
      :section-order="sectionOrder"
      :section-bg="sectionBg"
      :global-bg="globalBg"
      :cover="cover"
    />
  </div>
</template>
