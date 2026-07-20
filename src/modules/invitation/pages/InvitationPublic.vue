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

// PEWARISAN TEMA: backend mengirim component_keys = [tema ini, parent, ...].
// resolveTheme mencoba berurutan — tema anak tanpa folder Vue sendiri otomatis
// memakai layout parent-nya. Fallback ke component_key tunggal (data lama).
const theme = computed(() =>
  resolveTheme(
    invitation.value?.theme?.component_keys ?? invitation.value?.theme?.component_key,
  ),
);
const tokens = computed(() => theme.value.tokens);

const { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, hero } =
  useThemeOptions(invitation, features, tokens);

const ThemeLayout = computed(() => theme.value.layout);

// Judul tab browser mengikuti nama pasangan (terlihat saat link dibagikan)
watchEffect(() => {
  if (invitation.value) {
    document.title = `Undangan ${invitation.value.groom_name} & ${invitation.value.bride_name}`;
  }
});

/* ===== PEMUAT FONT DINAMIS =====
   index.html hanya mem-preload Cormorant Garamond + Jost. Font lain yang
   dipilih admin (nama Google Fonts bebas diketik di Filament) ATAU font
   bawaan tema (tokens.js) dimuat otomatis di sini; font non-Google lewat
   fonts.css_url. <link> di-dedupe per href supaya tidak dobel. */
const PRELOADED = ["Cormorant Garamond", "Jost"];

function injectStylesheet(href) {
  if (!href || document.querySelector(`link[data-inv-font][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-inv-font", "");
  document.head.appendChild(link);
}

watchEffect(() => {
  if (!invitation.value) return;
  const optFonts = invitation.value.theme_options?.fonts ?? {};
  const tokFonts = tokens.value?.fonts ?? {};

  // 1) Stylesheet kustom (Adobe Fonts / self-host @font-face)
  if (optFonts.css_url) injectStylesheet(optFonts.css_url);

  // 2) Nilai efektif tiap slot (override admin > token tema), lalu muat
  //    yang belum ter-preload dari Google Fonts dalam SATU request.
  const families = [
    optFonts.heading ?? tokFonts.heading,
    optFonts.body ?? tokFonts.body,
    optFonts.script ?? tokFonts.script,
  ].filter((f) => f && !PRELOADED.includes(f));

  if (families.length) {
    const q = [...new Set(families)]
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
      .join("&");
    injectStylesheet(`https://fonts.googleapis.com/css2?${q}&display=swap`);
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
      :section-height="sectionHeight"
      :section-card="sectionCard"
      :section-font-vars="sectionFontVars"
      :hero="hero"
      :countdown="countdown"
      :animation="animation"
    />
  </div>
</template>
