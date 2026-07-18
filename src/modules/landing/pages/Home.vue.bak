<script setup>
// LANDING PAGE — kustom sepenuhnya (bukan dari Filament).
// Silakan kembangkan: hero, daftar fitur, harga paket, testimoni, CTA.
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="landing">
    <header class="hero">
      <p class="eyebrow">Rizky Project</p>
      <h1>Satu platform,<br />banyak aplikasi.</h1>
      <p class="sub">Undangan online, portofolio, dan monitoring — semua dalam satu tempat.</p>
      <nav class="cta">
        <RouterLink class="btn" to="/login">Masuk Dashboard</RouterLink>
        <RouterLink class="btn ghost" to="/portfolio">Lihat Portofolio</RouterLink>
      </nav>
    </header>

    <section class="grid">
      <article>
        <h2>Undangan Online</h2>
        <p>Buat undangan digital dengan tema pilihan, RSVP, buku ucapan, dan link personal untuk tiap tamu.</p>
      </article>
      <article>
        <h2>Portofolio</h2>
        <p>Profil, pengalaman, dan sertifikasi yang dikelola lewat dashboard — dua bahasa sekaligus.</p>
      </article>
      <article>
        <h2>Agent Monitoring</h2>
        <p>Pantau lamaran kerja otomatis: terkirim, diblokir scam-filter, dan skor kecocokan.</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.landing { min-height: 100vh; font-family: Jost, sans-serif; color: #22301F; background: #F7F4EC; }
.hero { max-width: 800px; margin: 0 auto; padding: 6rem 1.5rem 4rem; text-align: center; }
.eyebrow { letter-spacing: .3em; text-transform: uppercase; font-size: .7rem; color: #B08D4A; }
h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1; margin: 1rem 0; }
.sub { opacity: .8; }
.cta { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
.btn { padding: .8rem 2rem; background: #2F4A3C; color: #F7F4EC; text-decoration: none;
  letter-spacing: .12em; text-transform: uppercase; font-size: .72rem; }
.btn.ghost { background: transparent; color: #2F4A3C; border: 1px solid #2F4A3C; }
.grid { max-width: 960px; margin: 0 auto; padding: 0 1.5rem 6rem; display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.grid article { background: #fff; border: 1px solid rgba(47,74,60,.2); padding: 1.75rem; }
.grid h2 { font-family: 'Cormorant Garamond', serif; margin-bottom: .5rem; }
</style>
