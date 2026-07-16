<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  usePortfolio,
  usePortfolioDocumentation,
} from "../composables/usePortfolio";
import PortfolioNav from "../components/PortfolioNav.vue";
import "../styles/terminal-theme.css";

const route = useRoute();

const { lang, toggleLang, t } = usePortfolio();
const { experiences, loading, error, fetchDocumentation } =
  usePortfolioDocumentation();

const lightboxUrl = ref(null);

function openLightbox(url) {
  lightboxUrl.value = url;
  document.body.style.overflow = "hidden"; // bug fix: cegah background ikut scroll saat lightbox terbuka
}

function closeLightbox() {
  lightboxUrl.value = null;
  document.body.style.overflow = "";
}

function handleKeydown(e) {
  if (e.key === "Escape") closeLightbox();
}

onMounted(async () => {
  window.addEventListener("keydown", handleKeydown);
  await fetchDocumentation();
  if (route.hash) {
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ behavior: "smooth" });
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = ""; // bug fix: jaga-jaga kalau unmount saat lightbox masih terbuka
});

const navLinks = computed(() => [
  {
    to: "/portfolio",
    label: lang.value === "id" ? "← Kembali ke Beranda" : "← Back to Home",
  },
  {
    to: "/portfolio#contact",
    label: lang.value === "id" ? "Kontak" : "Contact",
  },
]);

function fmtDate(exp) {
  const start = exp.start_date
    ? new Date(exp.start_date).toLocaleDateString(
        lang.value === "id" ? "id-ID" : "en-US",
        { month: "short", year: "numeric" },
      )
    : "";
  const end = exp.end_date
    ? new Date(exp.end_date).toLocaleDateString(
        lang.value === "id" ? "id-ID" : "en-US",
        { month: "short", year: "numeric" },
      )
    : lang.value === "id"
      ? "Sekarang"
      : "Present";
  return `${start} – ${end}`;
}
</script>

<template>
  <div class="portfolio-terminal">
    <PortfolioNav
      brand="rzhdyt@portfolio"
      :lang="lang"
      :links="navLinks"
      @toggle-lang="toggleLang"
    />

    <section class="pt-hero" style="padding-top: 70px; padding-bottom: 20px">
      <div class="pt-hero__location">$ ls ~/portfolio/</div>
      <h1 class="pt-hero__name" style="font-size: 1.8rem">
        {{
          lang === "id"
            ? "Portofolio & Dokumentasi Kerja"
            : "Portfolio & Work Documentation"
        }}
      </h1>
      <p class="pt-hero__desc">
        {{
          lang === "id"
            ? "Dokumentasi foto dan hasil pekerjaan dari setiap pengalaman kerja. Klik gambar untuk memperbesar."
            : "Photo documentation and work results from each role. Click any image to enlarge."
        }}
      </p>
    </section>

    <div v-if="loading" class="pt-section">// loading...</div>

    <div v-else-if="error" class="pt-section">
      <p style="color: #ff6b6b">
        {{
          lang === "id"
            ? "Gagal memuat data dokumentasi."
            : "Failed to load documentation data."
        }}
      </p>
      <button class="pt-btn" @click="fetchDocumentation">
        {{ lang === "id" ? "Coba lagi" : "Retry" }}
      </button>
    </div>

    <section v-else class="pt-section" style="padding-top: 0">
      <div
        v-for="exp in experiences"
        :id="exp.slug"
        :key="exp.id"
        class="pt-doc-group"
      >
        <div class="pt-timeline-item__date">{{ fmtDate(exp) }}</div>
        <h2 style="color: #fff; font-size: 1.3rem; margin: 4px 0 8px">
          {{ t(exp.role) }} — {{ exp.company }}
        </h2>
        <div v-if="exp.tags?.length" class="pt-doc-group__tags">
          {{ exp.tags.join(" · ") }}
        </div>

        <div v-if="exp.photos?.length" class="pt-doc-grid">
          <figure
            v-for="photo in exp.photos"
            :key="photo.id"
            class="pt-doc-photo"
          >
            <img
              :src="photo.url"
              :alt="t(photo.caption)"
              loading="lazy"
              @click="openLightbox(photo.url)"
            />
            <figcaption class="pt-doc-photo__caption">
              {{ t(photo.caption) }}
            </figcaption>
          </figure>
        </div>
        <p v-else style="color: var(--text-dim); font-size: 0.85rem">
          {{
            lang === "id"
              ? "Belum ada foto dokumentasi."
              : "No documentation photos yet."
          }}
        </p>
      </div>
    </section>

    <div v-if="lightboxUrl" class="pt-lightbox" @click="closeLightbox">
      <button
        class="pt-lightbox__close"
        @click.stop="closeLightbox"
        aria-label="Close"
      >
        ✕
      </button>
      <img :src="lightboxUrl" alt="" @click.stop />
    </div>
  </div>
</template>
