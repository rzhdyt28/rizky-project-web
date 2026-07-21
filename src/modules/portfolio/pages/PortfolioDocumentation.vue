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
const showScrollTop = ref(false);

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

function handleScroll() {
  showScrollTop.value = window.scrollY > 400;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(async () => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", handleScroll, { passive: true });
  await fetchDocumentation();
  if (route.hash) {
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ behavior: "smooth" });
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("scroll", handleScroll);
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

    <header class="pt-page-head">
      <p class="pt-hero__location mono">$ ls ~/portfolio/</p>
      <h1 class="pt-page-title">
        {{
          lang === "id"
            ? "Portofolio & Dokumentasi Kerja"
            : "Portfolio & Work Documentation"
        }}
      </h1>
      <p class="pt-page-lead">
        {{
          lang === "id"
            ? "Dokumentasi foto dan hasil pekerjaan dari setiap pengalaman kerja. Klik gambar untuk memperbesar."
            : "Photo documentation and work results from each role. Click any image to enlarge."
        }}
      </p>

      <nav v-if="experiences.length" class="pt-jump-nav">
        <a
          v-for="exp in experiences"
          :key="exp.id"
          :href="'#' + exp.slug"
          class="pt-jump"
          >{{ exp.slug }}/</a
        >
      </nav>
    </header>

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
        <p class="pt-timeline-item__date mono">{{ fmtDate(exp) }}</p>
        <h2 class="pt-page-title" style="font-size: clamp(20px, 3vw, 27px); margin: 6px 0 12px">
          {{ t(exp.role) }} — {{ exp.company }}
        </h2>
        <div v-if="exp.tags?.length" class="pt-doc-group__tags mono">
          {{ exp.tags.join(" · ") }}
        </div>

        <div v-if="exp.photos?.length" class="pt-doc-grid">
          <figure
            v-for="photo in exp.photos"
            :key="photo.id"
            class="pt-doc-photo"
            @click="openLightbox(photo.url)"
          >
            <img :src="photo.url" :alt="t(photo.caption)" loading="lazy" />
            <figcaption class="pt-doc-photo__caption">
              {{ t(photo.caption) }}
            </figcaption>
          </figure>
        </div>
        <p v-else style="color: var(--muted); font-size: 0.85rem">
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

    <button
      class="pt-scroll-top"
      :class="{ 'is-visible': showScrollTop }"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>
