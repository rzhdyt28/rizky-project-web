<script setup>
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { usePublicInvitation } from "../composables/useInvitation";
import { useThemeOptions } from "../composables/useThemeOptions";
import { resolveTheme } from "../themes/registry";

const route = useRoute();

// Slug dari path (/i/:slug) atau subdomain tenant (reza-mega.rizky.com)
const slug = computed(
  () => route.params.slug || location.hostname.split(".")[0],
);

// ?preview=1 -> pemilik/admin yang login bisa melihat draft sebelum publish
const { data, isLoading, isError } = usePublicInvitation(
  slug.value,
  route.query.to,
  route.query.preview === "1",
);

const invitation = computed(() => data.value?.invitation ?? null);
const features = computed(() => data.value?.features ?? {});

const theme = computed(() => resolveTheme(invitation.value?.theme?.component_key));
const tokens = computed(() => theme.value.tokens);

const { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, countdown, animation } =
  useThemeOptions(invitation, features, tokens);

const ThemeLayout = computed(() => theme.value.layout);

// Judul tab browser mengikuti nama pasangan (terlihat saat link dibagikan)
watchEffect(() => {
  if (invitation.value) {
    document.title = `Undangan ${invitation.value.groom_name} & ${invitation.value.bride_name}`;
  }
});
</script>

<template>
  <div v-if="isLoading" class="grid min-h-screen font-sans place-items-center">
    Memuat undangan…
  </div>
  <div
    v-else-if="isError || !invitation"
    class="grid min-h-screen px-6 font-sans text-center place-items-center"
  >
    <div>
      <p class="mb-1 text-lg">Undangan tidak ditemukan.</p>
      <p class="text-sm opacity-60">Periksa kembali tautan yang kamu terima.</p>
    </div>
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
      :cover="cover"
      :florals="florals"
      :background="background"
      :layout-opts="layoutOpts"
      :section-bg="sectionBg"
      :countdown="countdown"
      :animation="animation"
    />
  </div>
</template>
