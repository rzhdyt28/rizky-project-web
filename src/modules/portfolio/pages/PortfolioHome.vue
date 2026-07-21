<script setup>
import { onMounted, onUnmounted, computed, nextTick, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { usePortfolio } from "../composables/usePortfolio";
import PortfolioNav from "../components/PortfolioNav.vue";
import "../styles/terminal-theme.css";

const route = useRoute();

const {
  profile,
  skillEntries,
  experiences,
  educations,
  certifications,
  loading,
  error,
  lang,
  toggleLang,
  t,
  fetchPortfolio,
  contactStatus,
  contactError,
  submitContactMessage,
  resetContactStatus,
} = usePortfolio();

const contactForm = reactive({
  sender_name: "",
  sender_email: "",
  message: "",
  website: "", // honeypot, tidak ditampilkan ke user
});

async function handleContactSubmit() {
  await submitContactMessage(contactForm);
  if (contactStatus.value === "success") {
    contactForm.sender_name = "";
    contactForm.sender_email = "";
    contactForm.message = "";
  }
}

// ---------- Scroll-to-top button ----------
const showScrollTop = ref(false);
function handleScroll() {
  showScrollTop.value = window.scrollY > 400;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Hero terminal typing animation ----------
const termLines = ref([]); // { prompt, cmd, out, oks, done }
const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function buildTermLines() {
  const headline = t(profile.value?.headline);
  return [
    { cmd: "whoami", out: headline },
    { cmd: "status", out: null },
  ];
}

async function typeCmd(lineIndex, text) {
  for (let i = 1; i <= text.length; i++) {
    termLines.value[lineIndex].typed = text.slice(0, i);
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 45));
  }
  await new Promise((r) => setTimeout(r, 200));
}

async function runTypingAnimation() {
  const lines = buildTermLines();
  termLines.value = lines.map((l) => ({ ...l, typed: "", shown: false }));

  if (reduceMotion) {
    termLines.value = termLines.value.map((l) => ({
      ...l,
      typed: l.cmd,
      shown: true,
    }));
    return;
  }

  for (let i = 0; i < termLines.value.length; i++) {
    termLines.value[i].shown = true;
    await typeCmd(i, termLines.value[i].cmd);
  }
}

// ---------- Experience pagination (3 per page) ----------
const perPage = 3;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(experiences.value.length / perPage)),
);
const pagedExperiences = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return experiences.value.slice(start, start + perPage);
});
function goToPage(page, scroll) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
  if (scroll) {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
  }
}

// ---------- Currently learning — progress bars ----------
const learningItems = [
  {
    name: "ubuntu-server-administration",
    progress: 70,
    desc: {
      id: "Manajemen sistem Linux: instalasi, user & permission, layanan, backup & patching.",
      en: "Linux system management: installation, users & permissions, services, backup & patching.",
    },
  },
  {
    name: "network-services-config",
    progress: 60,
    desc: {
      id: "Konfigurasi layanan jaringan dan administrasi server di lingkungan Ubuntu Server.",
      en: "Network service configuration and server administration on Ubuntu Server.",
    },
  },
  {
    name: "advanced-networking (vlan · routing · firewall)",
    progress: 55,
    desc: {
      id: "Pendalaman VLAN, routing, dan firewall dasar sebagai lanjutan dari fondasi CCNA.",
      en: "Deeper study of VLANs, routing, and basic firewalls, building on CCNA foundations.",
    },
  },
];
const learnDisplay = reactive(learningItems.map(() => 0));
const learnSection = ref(null);
let learnObserver = null;

function animateLearning() {
  learningItems.forEach((item, idx) => {
    if (reduceMotion) {
      learnDisplay[idx] = item.progress;
      return;
    }
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const progress = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      learnDisplay[idx] = Math.round(item.progress * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const navLinks = computed(() => [
  { to: "#home", label: lang.value === "id" ? "Beranda" : "Home" },
  { to: "#about", label: lang.value === "id" ? "Tentang" : "About" },
  { to: "#skills", label: lang.value === "id" ? "Keahlian" : "Skills" },
  {
    to: "#experience",
    label: lang.value === "id" ? "Pengalaman" : "Experience",
  },
  { to: "#education", label: lang.value === "id" ? "Pendidikan" : "Education" },
  { to: "#contact", label: lang.value === "id" ? "Kontak" : "Contact" },
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

onMounted(async () => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  await fetchPortfolio();
  runTypingAnimation();

  if ("IntersectionObserver" in window && learnSection.value) {
    learnObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateLearning();
            learnObserver?.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    learnObserver.observe(learnSection.value);
  } else {
    animateLearning();
  }

  // Bug fix: kalau datang dari halaman lain dengan hash (mis. dari
  // /portfolio/documentation kembali ke /portfolio#contact), Vue Router
  // tidak otomatis scroll ke section-nya karena itu perpindahan route,
  // bukan sekadar anchor di halaman yang sama. Scroll manual di sini.
  if (route.hash) {
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ behavior: "smooth" });
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  learnObserver?.disconnect();
});
</script>

<template>
  <div class="portfolio-terminal">
    <PortfolioNav
      :brand="profile?.full_name ?? '...'"
      :lang="lang"
      :links="navLinks"
      @toggle-lang="toggleLang"
    />

    <div v-if="loading" class="pt-section">// loading...</div>

    <div v-else-if="error" class="pt-section">
      <p style="color: #ff6b6b">
        {{
          lang === "id"
            ? "Gagal memuat data portofolio."
            : "Failed to load portfolio data."
        }}
      </p>
      <button class="pt-btn" @click="fetchPortfolio">
        {{ lang === "id" ? "Coba lagi" : "Retry" }}
      </button>
    </div>

    <template v-else>
      <!-- HERO -->
      <section id="home" class="pt-hero">
        <div class="pt-hero__grid">
          <div class="pt-hero__text">
            <div class="pt-hero__location">// {{ profile?.location }}</div>
            <h1 class="pt-hero__name">{{ profile?.full_name }}</h1>
            <p class="pt-hero__role">{{ t(profile?.headline) }}</p>
            <p class="pt-hero__desc">{{ t(profile?.about) }}</p>
            <div class="pt-hero__cta">
              <a href="#contact" class="pt-btn pt-btn--solid">{{
                lang === "id" ? "Hubungi Saya" : "Contact Me"
              }}</a>
              <a
                v-if="profile?.cv_path"
                :href="profile.cv_path"
                target="_blank"
                class="pt-btn"
                >{{ lang === "id" ? "Unduh CV ↓" : "Download CV ↓" }}</a
              >
            </div>
          </div>

          <div class="pt-window" aria-hidden="true">
            <div class="pt-window__bar">
              <span class="pt-dot pt-dot--red"></span>
              <span class="pt-dot pt-dot--yellow"></span>
              <span class="pt-dot pt-dot--green"></span>
              <span style="margin-left: 8px"
                >{{
                  profile?.full_name?.toLowerCase().replaceAll(" ", "")
                }}@portfolio: ~</span
              >
            </div>
            <div class="pt-window__body">
              <template v-for="(line, i) in termLines" :key="i">
                <div v-if="line.shown">
                  <span class="pt-prompt">$</span>{{ line.typed
                  }}<span
                    v-if="line.typed.length < line.cmd.length"
                    class="pt-cursor"
                  ></span>
                </div>
                <div
                  v-if="line.shown && line.out && line.typed === line.cmd"
                  style="color: var(--muted); padding-left: 16px"
                >
                  {{ line.out }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- ABOUT -->
      <section id="about" class="pt-section">
        <div class="pt-section__eyebrow">
          01 · {{ lang === "id" ? "tentang" : "about" }}
        </div>
        <h2 class="pt-section__title">
          {{ lang === "id" ? "Tentang Saya" : "About Me" }}
        </h2>

        <div class="pt-about-grid">
          <div v-if="profile?.photo_path" class="pt-about-photo">
            <img :src="profile.photo_path" :alt="profile.full_name" loading="lazy" />
          </div>
          <div class="pt-about-copy" :style="!profile?.photo_path ? 'grid-column: 1 / -1' : ''">
            <p>{{ t(profile?.about) }}</p>
            <ul class="pt-facts">
              <li v-if="profile?.location">
                <span class="pt-fact-k mono">location</span>
                <span class="pt-fact-v">{{ profile.location }}</span>
              </li>
              <li v-if="profile?.headline">
                <span class="pt-fact-k mono">focus</span>
                <span class="pt-fact-v">{{ t(profile.headline) }}</span>
              </li>
            </ul>
            <a
              v-if="profile?.cv_path"
              :href="profile.cv_path"
              target="_blank"
              class="pt-btn pt-btn--solid"
              >{{ lang === "id" ? "Unduh CV (PDF)" : "Download CV (PDF)" }}</a
            >
          </div>
        </div>
      </section>

      <!-- SKILLS -->
      <section id="skills" class="pt-section pt-section--alt">
        <div class="pt-section__inner">
          <div class="pt-section__eyebrow">
            02 · {{ lang === "id" ? "keahlian" : "skills" }}
          </div>
          <h2 class="pt-section__title">
            {{ lang === "id" ? "Keahlian Utama" : "Core Skills" }}
          </h2>
          <div class="pt-skills-grid">
            <div
              v-for="[category, items] in skillEntries"
              :key="category"
              class="pt-skill-card"
            >
              <div class="pt-skill-card__path mono">~/{{ category }}</div>
              <div v-for="s in items" :key="s.id">
                <div class="pt-skill-card__title">{{ t(s.title) }}</div>
                <div class="pt-skill-card__desc">{{ t(s.description) }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXPERIENCE -->
      <section id="experience" class="pt-section">
        <div class="pt-section__eyebrow">
          03 · {{ lang === "id" ? "pengalaman" : "experience" }}
        </div>
        <h2 class="pt-section__title">
          {{ lang === "id" ? "Pengalaman Kerja" : "Work Experience" }}
        </h2>
        <div class="pt-timeline">
          <div
            v-for="exp in pagedExperiences"
            :key="exp.id"
            class="pt-timeline-item"
          >
            <div class="pt-timeline-item__date mono">{{ fmtDate(exp) }}</div>
            <div class="pt-timeline-item__body">
              <div class="pt-timeline-item__title">
                <router-link
                  v-if="exp.slug"
                  :to="{ path: '/portfolio/documentation', hash: '#' + exp.slug }"
                >
                  {{ t(exp.role) }}
                </router-link>
                <template v-else>{{ t(exp.role) }}</template>
              </div>
              <div class="pt-timeline-item__company">
                {{ exp.company }}{{ exp.location ? " — " + exp.location : "" }}
              </div>
              <ul class="pt-timeline-item__bullets">
                <li v-for="(b, i) in exp.bullets" :key="i">{{ t(b) }}</li>
              </ul>
              <router-link
                v-if="exp.slug"
                :to="{ path: '/portfolio/documentation', hash: '#' + exp.slug }"
                class="pt-timeline-item__link"
              >
                {{
                  lang === "id"
                    ? "Lihat portofolio & dokumentasi →"
                    : "View portfolio & documentation →"
                }}
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="pt-pagination">
          <button
            class="pt-pg-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1, true)"
          >
            ‹ prev
          </button>
          <div class="pt-pg-pages">
            <button
              v-for="p in totalPages"
              :key="p"
              class="pt-pg-num"
              :class="{ 'is-active': p === currentPage }"
              @click="goToPage(p, true)"
            >
              {{ p }}
            </button>
          </div>
          <button
            class="pt-pg-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1, true)"
          >
            next ›
          </button>
        </div>
      </section>

      <!-- EDUCATION -->
      <section id="education" class="pt-section pt-section--alt">
        <div class="pt-section__inner">
          <div class="pt-section__eyebrow">
            04 · {{ lang === "id" ? "pendidikan" : "education" }}
          </div>
          <h2 class="pt-section__title">
            {{
              lang === "id"
                ? "Pendidikan & Sertifikasi"
                : "Education & Certifications"
            }}
          </h2>

          <div class="pt-edu-grid">
            <div class="pt-edu-group">
              <div class="pt-edu-group__label">/education</div>
              <div v-for="e in educations" :key="e.id" class="pt-edu-item">
                <div class="pt-edu-item__date mono">{{ e.period }}</div>
                <div class="pt-edu-item__title">{{ t(e.degree) }}</div>
                <div class="pt-edu-item__meta">
                  {{ e.institution }}<span v-if="e.gpa"> · GPA {{ e.gpa }}</span>
                </div>
              </div>
            </div>

            <div class="pt-edu-group">
              <div class="pt-edu-group__label">/certifications</div>
              <div v-for="c in certifications" :key="c.id" class="pt-edu-item">
                <div class="pt-edu-item__title">{{ t(c.degree) }}</div>
                <div class="pt-edu-item__meta">{{ c.institution }}</div>
              </div>
            </div>
          </div>

          <!-- CURRENTLY LEARNING -->
          <div ref="learnSection" class="pt-learning">
            <div class="pt-learning__head">
              <h3 class="pt-learning__title">
                {{ lang === "id" ? "Sedang Dipelajari" : "Currently Learning" }}
              </h3>
              <p class="pt-learning__sub">
                {{
                  lang === "id"
                    ? "Peta belajar menuju peran Junior System Administrator — progres diperbarui seiring waktu."
                    : "Learning roadmap toward a Junior System Administrator role — progress updated over time."
                }}
              </p>
            </div>

            <div class="pt-window pt-learn-terminal">
              <div class="pt-window__bar">
                <span class="pt-dot pt-dot--red"></span>
                <span class="pt-dot pt-dot--yellow"></span>
                <span class="pt-dot pt-dot--green"></span>
                <span style="margin-left: 8px">~/learning</span>
              </div>
              <div class="pt-window__body pt-learn-body">
                <div class="pt-learn-line">
                  <span class="pt-prompt">$</span
                  >sudo apt install junior-sysadmin-skills
                </div>
                <div class="pt-learn-out">
                  {{
                    lang === "id"
                      ? "Membaca daftar paket... Selesai. Paket berikut sedang dipasang:"
                      : "Reading package lists... Done. The following packages are being installed:"
                  }}
                </div>

                <div
                  v-for="(item, idx) in learningItems"
                  :key="item.name"
                  class="pt-learn-item"
                >
                  <div class="pt-learn-row">
                    <span class="pt-learn-name mono">{{ item.name }}</span>
                    <span class="pt-learn-pct mono">{{ learnDisplay[idx] }}%</span>
                  </div>
                  <div class="pt-learn-bar">
                    <div
                      class="pt-learn-fill"
                      :style="{ width: learnDisplay[idx] + '%' }"
                    ></div>
                  </div>
                  <p class="pt-learn-desc">{{ t(item.desc) }}</p>
                </div>

                <div class="pt-learn-lab">
                  <span class="pt-prompt">$</span
                  ><span class="mono">ls ~/lab/</span>
                  <div class="pt-learn-lab-items">
                    <router-link
                      to="/portfolio/documentation#in-progress"
                      class="pt-lab-chip"
                    >
                      homelab-virtualbox/
                      <span class="pt-badge-mini">{{
                        lang === "id" ? "berjalan" : "ongoing"
                      }}</span>
                    </router-link>
                    <router-link
                      to="/portfolio/documentation#in-progress"
                      class="pt-lab-chip"
                    >
                      confluent-kafka/
                      <span class="pt-badge-mini">{{
                        lang === "id" ? "eksplorasi" : "exploring"
                      }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section id="contact" class="pt-section">
        <div class="pt-section__eyebrow">
          05 · {{ lang === "id" ? "kontak" : "contact" }}
        </div>
        <h2 class="pt-section__title">
          {{ lang === "id" ? "Mari Terhubung" : "Let's Connect" }}
        </h2>
        <p class="pt-contact-lead">
          {{
            lang === "id"
              ? "Terbuka untuk peluang di bidang System Administration, IT Support, dan Network Implementation. Silakan hubungi melalui salah satu kanal berikut, atau kirim pesan langsung di bawah."
              : "Open to opportunities in System Administration, IT Support, and Network Implementation. Feel free to reach out through any of the channels below, or send a message directly."
          }}
        </p>

        <div class="pt-contact-grid" style="margin-bottom: 32px">
          <a
            v-if="profile?.socials?.email"
            class="pt-contact-item"
            :href="'mailto:' + profile.socials.email"
          >
            <strong>email</strong>
            <span>{{ profile.socials.email }}</span>
          </a>
          <a
            v-if="profile?.socials?.whatsapp"
            class="pt-contact-item"
            :href="'https://wa.me/' + profile.socials.whatsapp"
            target="_blank"
            rel="noopener"
          >
            <strong>whatsapp</strong>
            <span>{{ profile.socials.whatsapp }}</span>
          </a>
          <a
            v-if="profile?.socials?.linkedin"
            class="pt-contact-item"
            :href="profile.socials.linkedin"
            target="_blank"
            rel="noopener"
          >
            <strong>linkedin</strong>
            <span>{{ profile.socials.linkedin }}</span>
          </a>
          <a
            v-if="profile?.socials?.github"
            class="pt-contact-item"
            :href="profile.socials.github"
            target="_blank"
            rel="noopener"
          >
            <strong>github</strong>
            <span>{{ profile.socials.github }}</span>
          </a>
        </div>

        <div class="pt-window">
          <div class="pt-window__bar">
            <span class="pt-dot pt-dot--red"></span>
            <span class="pt-dot pt-dot--yellow"></span>
            <span class="pt-dot pt-dot--green"></span>
            <span style="margin-left: 8px">send_message.sh</span>
          </div>
          <div class="pt-window__body">
            <template v-if="contactStatus === 'success'">
              <p style="color: var(--green)">
                <span class="pt-prompt">$</span
                >{{
                  lang === "id"
                    ? "Pesan terkirim. Terima kasih!"
                    : "Message sent. Thank you!"
                }}
              </p>
              <button class="pt-btn" @click="resetContactStatus">
                {{
                  lang === "id" ? "Kirim pesan lain" : "Send another message"
                }}
              </button>
            </template>

            <form
              v-else
              class="pt-contact-form"
              @submit.prevent="handleContactSubmit"
            >
              <!-- honeypot: kosong & tersembunyi dari mata manusia, bot biasanya mengisi semua field -->
              <input
                v-model="contactForm.website"
                type="text"
                name="website"
                autocomplete="off"
                tabindex="-1"
                class="pt-contact-form__honeypot"
                aria-hidden="true"
              />

              <label class="pt-contact-form__field">
                <span class="pt-prompt">$</span
                >{{ lang === "id" ? "nama" : "name" }}
                <input
                  v-model="contactForm.sender_name"
                  type="text"
                  required
                  :disabled="contactStatus === 'sending'"
                />
              </label>

              <label class="pt-contact-form__field">
                <span class="pt-prompt">$</span>email
                <input
                  v-model="contactForm.sender_email"
                  type="email"
                  required
                  :disabled="contactStatus === 'sending'"
                />
              </label>

              <label class="pt-contact-form__field">
                <span class="pt-prompt">$</span
                >{{ lang === "id" ? "pesan" : "message" }}
                <textarea
                  v-model="contactForm.message"
                  rows="4"
                  required
                  :disabled="contactStatus === 'sending'"
                ></textarea>
              </label>

              <p
                v-if="contactStatus === 'error'"
                style="color: #ff6b6b; font-size: 0.85rem"
              >
                {{
                  lang === "id"
                    ? "Gagal mengirim pesan. Coba lagi."
                    : "Failed to send message. Please try again."
                }}
              </p>

              <button
                type="submit"
                class="pt-btn pt-btn--solid"
                :disabled="contactStatus === 'sending'"
              >
                {{
                  contactStatus === "sending"
                    ? lang === "id"
                      ? "Mengirim..."
                      : "Sending..."
                    : lang === "id"
                      ? "Kirim Pesan"
                      : "Send Message"
                }}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer class="pt-footer">
        <div class="pt-footer__inner">
          <span class="mono">© 2026 {{ profile?.full_name }}</span>
        </div>
      </footer>
    </template>

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
