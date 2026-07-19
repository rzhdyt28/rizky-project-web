<script setup>
/**
 * LANDING — difokuskan penuh ke produk UNDANGAN ONLINE.
 * Desain orisinal: palet dusty-blue + ivory (serasi dengan tema Mildness),
 * mobile-first. Portofolio/monitoring tak lagi dipromosikan di sini —
 * cukup tautan kecil di footer.
 */
import { RouterLink } from 'vue-router';
import mildnessTokens from '../../invitation/themes/mildness/tokens';

/* Galeri tema dirakit dari tokens asli tiap tema — swatch warnanya selalu
   sinkron dengan kenyataan, bukan hardcode yang bisa basi. */
const THEMES = [
  { key: 'mildness', name: 'Mildness', desc: 'Dusty-blue lembut, kartu mengambang, nama kaligrafi.', tokens: mildnessTokens, demo: '/i/via-andra' },
  ];

const FEATURES = [
  { icon: 'M12 8v4l2.5 2.5M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', title: 'Hitung Mundur', desc: 'Countdown otomatis menuju hari bahagia.' },
  { icon: 'M5 8h14M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2M5 8l7 5 7-5M5 18h14a0 0 0 0 0 0 0V8H5v10z', title: 'Link Personal Tamu', desc: 'Setiap tamu dapat link dengan namanya sendiri, siap dibagikan lewat WhatsApp.' },
  { icon: 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13z', title: 'RSVP Kehadiran', desc: 'Tamu konfirmasi hadir langsung dari undangan; rekapnya masuk dashboard Anda.' },
  { icon: 'M7 8h10M7 12h6m-8 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-3 3z', title: 'Ucapan & Doa', desc: 'Buku tamu digital untuk doa dan ucapan hangat.' },
  { icon: 'M4 7h3l2-3h6l2 3h3v13H4V7zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', title: 'Galeri Foto', desc: 'Momen prewedding tampil dalam galeri yang ringan dibuka di HP.' },
  { icon: 'M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', title: 'Musik Latar', desc: 'Lagu pilihan mengiringi tamu membuka undangan.' },
];

const STEPS = [
  { no: '1', title: 'Pilih tema', desc: 'Tentukan gaya yang paling menggambarkan kalian.' },
  { no: '2', title: 'Isi cerita kalian', desc: 'Nama, acara, kisah cinta, galeri — semua lewat dashboard.' },
  { no: '3', title: 'Sebarkan link-nya', desc: 'Bagikan link personal ke tiap tamu lewat WhatsApp.' },
];
</script>

<template>
  <main class="lp">
    <!-- ===== NAV ===== -->
    <nav class="nav">
      <span class="brand">Rizky<span>Invite</span></span>
      <div class="nav-links">
        <a href="#tema">Tema</a>
        <a href="#fitur">Fitur</a>
        <RouterLink class="nav-cta" to="/login">Masuk</RouterLink>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <header class="hero">
      <p class="eyebrow">Undangan Pernikahan Digital</p>
      <h1>Kabar bahagia kalian,<br /><em>dalam satu tautan.</em></h1>
      <p class="sub">
        Undangan online dengan tema pilihan, RSVP, galeri, musik, dan link
        personal untuk setiap tamu — siap dibagikan lewat WhatsApp.
      </p>
      <div class="cta">
        <RouterLink class="btn solid" to="/login">Buat Undangan</RouterLink>
        <a class="btn ghost" href="#tema">Lihat Tema</a>
      </div>

      <!-- mini mock undangan (murni CSS, orisinal) -->
      <div class="mock" aria-hidden="true">
        <div class="mock-card">
          <span class="mock-eyebrow">Undangan Pernikahan</span>
          <span class="mock-names">Aisha &amp; Raka</span>
          <span class="mock-date">Sabtu · 12 · 09 · 2026</span>
          <span class="mock-btn">Buka Undangan</span>
        </div>
      </div>
    </header>

    <!-- ===== CARA KERJA ===== -->
    <section class="steps">
      <article v-for="s in STEPS" :key="s.no">
        <span class="no">{{ s.no }}</span>
        <h3>{{ s.title }}</h3>
        <p>{{ s.desc }}</p>
      </article>
    </section>

    <!-- ===== TEMA ===== -->
    <section id="tema" class="themes">
      <h2>Pilih gaya kalian</h2>
      <p class="section-sub">Ganti tema kapan saja — isi undangan tidak berubah, hanya tampilannya.</p>
      <div class="theme-grid">
        <article v-for="t in THEMES" :key="t.key" class="theme-card">
          <div class="swatch-row">
            <span v-for="c in [t.tokens.colors.accent, t.tokens.colors.gold, t.tokens.colors.paper]"
              :key="c" class="swatch" :style="{ background: c }" />
          </div>
          <h3 :style="{ fontFamily: `'${t.tokens.fonts.heading}', serif` }">{{ t.name }}</h3>
          <p>{{ t.desc }}</p>
          <a v-if="t.demo" class="demo-link" :href="t.demo" target="_blank" rel="noopener">Lihat demo →</a>
          <span v-else class="demo-soon">Demo segera</span>
        </article>
      </div>
    </section>

    <!-- ===== FITUR ===== -->
    <section id="fitur" class="features">
      <h2>Semua yang tamu kalian butuhkan</h2>
      <div class="feature-grid">
        <article v-for="f in FEATURES" :key="f.title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="f.icon" />
          </svg>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ===== CTA AKHIR ===== -->
    <section class="closing">
      <h2>Siap menyebar kabar bahagia?</h2>
      <RouterLink class="btn solid lg" to="/login">Mulai Sekarang</RouterLink>
    </section>

    <footer class="foot">
      <span>© {{ new Date().getFullYear() }} Rizky Project</span>
      <nav>
        <RouterLink to="/portfolio">Portofolio</RouterLink>
        <RouterLink to="/login">Masuk</RouterLink>
      </nav>
    </footer>
  </main>
</template>

<style scoped>
/* ====== dasar (mobile-first) ====== */
.lp {
  --acc: #3f5b7c; --gold: #8aa1bc; --ink: #46586a; --paper: #f5f8fb; --card: #ffffff;
  font-family: 'Jost', sans-serif; color: var(--ink); background: var(--paper);
  min-height: 100vh;
}
h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; }
h2 { font-size: clamp(1.7rem, 4.5vw, 2.4rem); text-align: center; }
.section-sub { text-align: center; opacity: .75; margin: .4rem auto 0; max-width: 34rem; padding: 0 1.25rem; }

/* ====== nav ====== */
.nav { display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem; max-width: 1060px; margin: 0 auto; }
.brand { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; letter-spacing: .02em; }
.brand span { color: var(--acc); font-style: italic; }
.nav-links { display: flex; gap: 1.1rem; align-items: center; font-size: .85rem; }
.nav-links a { color: inherit; text-decoration: none; }
.nav-cta { border: 1px solid var(--acc); color: var(--acc) !important;
  padding: .38rem 1rem; border-radius: 999px; }

/* ====== hero ====== */
.hero { text-align: center; padding: 3rem 1.25rem 2.5rem; max-width: 720px; margin: 0 auto; }
.eyebrow { letter-spacing: .32em; text-transform: uppercase; font-size: .66rem; color: var(--acc); }
.hero h1 { font-size: clamp(2.1rem, 7vw, 3.4rem); line-height: 1.12; margin: .9rem 0; }
.hero em { font-family: 'Great Vibes', cursive; font-style: normal; color: var(--acc);
  font-size: 1.15em; }
.sub { opacity: .8; max-width: 32rem; margin: 0 auto; }
.cta { display: flex; gap: .8rem; justify-content: center; margin-top: 1.6rem; flex-wrap: wrap; }
.btn { padding: .78rem 1.9rem; border-radius: 999px; text-decoration: none;
  letter-spacing: .1em; text-transform: uppercase; font-size: .72rem; }
.btn.solid { background: var(--acc); color: #fff; }
.btn.ghost { border: 1px solid var(--acc); color: var(--acc); }
.btn.lg { padding: .95rem 2.4rem; }

/* mock kartu undangan */
.mock { margin: 2.4rem auto 0; max-width: 300px; }
.mock-card { background: var(--card); border-radius: 1.4rem; padding: 2rem 1.4rem;
  display: grid; gap: .55rem; justify-items: center;
  box-shadow: 0 24px 50px -24px rgba(63, 91, 124, .4); }
.mock-eyebrow { font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; opacity: .7; }
.mock-names { font-family: 'Great Vibes', cursive; font-size: 2rem; color: var(--acc); }
.mock-date { font-size: .72rem; letter-spacing: .12em; }
.mock-btn { margin-top: .5rem; background: var(--acc); color: #fff; font-size: .62rem;
  letter-spacing: .12em; text-transform: uppercase; padding: .55rem 1.4rem; border-radius: 999px; }

/* ====== langkah ====== */
.steps { display: grid; gap: 1rem; padding: 2.5rem 1.25rem; max-width: 900px; margin: 0 auto; }
.steps article { background: var(--card); border-radius: 1rem; padding: 1.4rem;
  box-shadow: 0 14px 30px -22px rgba(63, 91, 124, .45); }
.no { display: inline-grid; place-items: center; width: 2rem; height: 2rem;
  border-radius: 999px; background: var(--acc); color: #fff; font-size: .85rem; }
.steps h3 { margin: .6rem 0 .2rem; font-size: 1.15rem; }
.steps p { font-size: .9rem; opacity: .8; }

/* ====== tema ====== */
.themes { padding: 2.5rem 1.25rem; }
.theme-grid { display: grid; gap: 1rem; max-width: 960px; margin: 1.6rem auto 0; }
.theme-card { background: var(--card); border-radius: 1.1rem; padding: 1.5rem;
  box-shadow: 0 14px 30px -22px rgba(63, 91, 124, .45); }
.swatch-row { display: flex; gap: .4rem; margin-bottom: .8rem; }
.swatch { width: 1.35rem; height: 1.35rem; border-radius: 999px;
  border: 1px solid rgba(70, 88, 106, .18); }
.theme-card h3 { font-size: 1.5rem; }
.theme-card p { font-size: .9rem; opacity: .8; margin: .3rem 0 .8rem; }
.demo-link { color: var(--acc); text-decoration: none; font-size: .85rem; }
.demo-soon { font-size: .8rem; opacity: .5; }

/* ====== fitur ====== */
.features { padding: 2.5rem 1.25rem; }
.feature-grid { display: grid; gap: 1rem; max-width: 960px; margin: 1.6rem auto 0; }
.features article { background: var(--card); border-radius: 1.1rem; padding: 1.3rem;
  box-shadow: 0 14px 30px -22px rgba(63, 91, 124, .45); }
.features svg { width: 1.7rem; height: 1.7rem; color: var(--acc); }
.features h3 { font-size: 1.1rem; margin: .5rem 0 .15rem; }
.features p { font-size: .88rem; opacity: .8; }

/* ====== penutup + footer ====== */
.closing { text-align: center; padding: 3rem 1.25rem; }
.closing .btn { margin-top: 1.2rem; display: inline-block; }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  max-width: 1060px; margin: 0 auto; padding: 1.4rem 1.25rem; font-size: .8rem; opacity: .75; }
.foot nav { display: flex; gap: 1rem; }
.foot a { color: inherit; text-decoration: none; }

/* ====== tablet ke atas ====== */
@media (min-width: 640px) {
  .steps { grid-template-columns: repeat(3, 1fr); }
  .theme-grid { grid-template-columns: repeat(3, 1fr); }
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
  .hero { padding-top: 4.5rem; }
}
</style>
