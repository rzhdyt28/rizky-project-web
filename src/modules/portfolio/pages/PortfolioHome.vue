<script setup>
import { onMounted, computed, nextTick, reactive } from "vue";
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

onMounted(async () => {
  await fetchPortfolio();
  // Bug fix: kalau datang dari halaman lain dengan hash (mis. dari
  // /portfolio/documentation kembali ke /portfolio#contact), Vue Router
  // tidak otomatis scroll ke section-nya karena itu perpindahan route,
  // bukan sekadar anchor di halaman yang sama. Scroll manual di sini.
  if (route.hash) {
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ behavior: "smooth" });
  }
});

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
        <div class="pt-hero__location">// {{ profile?.location }}</div>
        <h1 class="pt-hero__name">{{ profile?.full_name }}</h1>
        <p class="pt-hero__role">{{ t(profile?.headline) }}</p>
        <p class="pt-hero__desc">{{ t(profile?.about) }}</p>
        <div class="pt-hero__cta">
          <a href="#contact" class="pt-btn pt-btn--solid">{{
            lang === "id" ? "Hubungi Saya" : "Contact Me"
          }}</a>
          <a v-if="profile?.cv_path" :href="profile.cv_path" class="pt-btn">{{
            lang === "id" ? "Unduh CV ↓" : "Download CV ↓"
          }}</a>
        </div>

        <div class="pt-window">
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
            <div><span class="pt-prompt">$</span>whoami</div>
            <div style="color: var(--text-dim)">{{ t(profile?.headline) }}</div>
            <div style="margin-top: 8px">
              <span class="pt-prompt">$</span>status<span
                class="pt-cursor"
              ></span>
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
        <p style="color: var(--text-dim); max-width: 640px">
          {{ t(profile?.about) }}
        </p>
      </section>

      <!-- SKILLS -->
      <section id="skills" class="pt-section">
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
            <div class="pt-skill-card__path">~/{{ category }}</div>
            <div v-for="s in items" :key="s.id">
              <div class="pt-skill-card__title">{{ t(s.title) }}</div>
              <div class="pt-skill-card__desc">{{ t(s.description) }}</div>
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
        <div v-for="exp in experiences" :key="exp.id" class="pt-timeline-item">
          <div class="pt-timeline-item__date">{{ fmtDate(exp) }}</div>
          <div class="pt-timeline-item__title">{{ t(exp.role) }}</div>
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
      </section>

      <!-- EDUCATION -->
      <section id="education" class="pt-section">
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

        <div class="pt-edu-group">
          <div class="pt-edu-group__label">/education</div>
          <div v-for="e in educations" :key="e.id" class="pt-edu-item">
            <div class="pt-edu-item__date">{{ e.period }}</div>
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
      </section>

      <!-- CONTACT -->
      <section id="contact" class="pt-section">
        <div class="pt-section__eyebrow">
          05 · {{ lang === "id" ? "kontak" : "contact" }}
        </div>
        <h2 class="pt-section__title">
          {{ lang === "id" ? "Mari Terhubung" : "Let's Connect" }}
        </h2>

        <div class="pt-contact-grid" style="margin-bottom: 32px">
          <div v-if="profile?.socials?.email" class="pt-contact-item">
            <strong>email</strong>
            <a :href="'mailto:' + profile.socials.email">{{
              profile.socials.email
            }}</a>
          </div>
          <div v-if="profile?.socials?.whatsapp" class="pt-contact-item">
            <strong>whatsapp</strong>
            <a :href="'https://wa.me/' + profile.socials.whatsapp">{{
              profile.socials.whatsapp
            }}</a>
          </div>
          <div v-if="profile?.socials?.linkedin" class="pt-contact-item">
            <strong>linkedin</strong>
            <a :href="profile.socials.linkedin" target="_blank">{{
              profile.socials.linkedin
            }}</a>
          </div>
          <div v-if="profile?.socials?.github" class="pt-contact-item">
            <strong>github</strong>
            <a :href="profile.socials.github" target="_blank">{{
              profile.socials.github
            }}</a>
          </div>
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
              <p style="color: var(--accent)">
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
    </template>
  </div>
</template>
