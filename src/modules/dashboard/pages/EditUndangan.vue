<script setup>
/**
 * EDIT UNDANGAN — mencerminkan InvitationResource::form() Filament (11 section
 * + global), tapi disimpan lewat PUT /api/invitation/{id} yang sudah ada.
 * Upload file (foto hero, background, ornamen, musik, dst) lewat endpoint
 * generik /api/invitation/{id}/upload (lihat useThemeUpload.js) — hasilnya
 * (path) disimpan ke field theme_options yang sesuai sebelum submit.
 *
 * Pustaka Aset (ThemeAsset, dipakai Filament untuk florals/ornamen) BELUM
 * punya API publik, jadi floral 4 sudut & ornamen di sini pakai UPLOAD
 * langsung per posisi (bukan pilih dari pustaka) — beda dari Filament tapi
 * hasil akhirnya sama (path tersimpan di key theme_options yang identik).
 */
import { computed, reactive, ref, watch } from 'vue';
import { useActiveInvitation } from '../../invitation/composables/useInvitation';
import { useThemes } from '../../invitation/composables/useThemes';
import { uploadThemeFile } from '../../invitation/composables/useThemeUpload';
import { api } from '../../../shared/api/client';
import SectionDisplayFields from '../components/SectionDisplayFields.vue';

const { invitation, isLoading, isError, error } = useActiveInvitation();
const { data: themes } = useThemes();

const CARD_STYLES = {
  glass: 'Glass — kaca buram (blur)', outline: 'Outline — garis tepi, tanpa isi',
  flat: 'Flat — polos tanpa shadow', gradient: 'Gradient — gradasi lembut',
  stamp: 'Stamp — tepi perangko', default: 'Polos bawaan tema',
};
const HEADING_FONTS = ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'Lora', 'EB Garamond', 'Marcellus'];
const BODY_FONTS = ['Jost', 'Poppins', 'Lato', 'Open Sans', 'Nunito', 'Inter', 'Mulish'];
const SCRIPT_FONTS = ['Great Vibes', 'Dancing Script', 'Parisienne', 'Allura', 'Sacramento', 'Alex Brush'];
const SECTION_KEYS = ['couple', 'events', 'countdown', 'love_story', 'gallery', 'video', 'rsvp', 'guestbook', 'gift', 'co_host'];

function blankSection() {
  return { visible: true, card: '', card_style: '', section_bg: '', font_heading: '', font_body: '', title_size: '', title_color: '', body_size: '', body_color: '' };
}

const form = reactive(blankForm());
const saving = ref(false);
const saveOk = ref(false);
const saveErr = ref('');

function blankForm() {
  const sections = {};
  for (const k of SECTION_KEYS) sections[k] = blankSection();
  sections.countdown_hero = { visible: true };
  return {
    slug: '', status: 'draft', theme_id: null,
    groom_name: '', bride_name: '', groom_parents: '', bride_parents: '', opening_text: '',
    video_url: '', music_url: '', rsvp_enabled: true, guestbook_enabled: true,
    co_hosts: [],
    theme_options: {
      hero: { position: '', effect: 'fade', interval: 6, dresscode_enabled: false, dresscode: '', card_style: '', name_font: '', slideshow: [] },
      background: { photo: '', photo_mobile: '', ornament_upload: '' },
      layout: { card: true, hero_card: 'inherit', section_height: 'full' },
      couple: { style: '', show_photos: false, groom_photo: '', bride_photo: '' },
      countdown: { style: 'circle', layout: 'simple', photo: '', quote: '' },
      love_story: { show_photos: false },
      gallery: { style: 'carousel' },
      video: { eyebrow: '', caption: '' },
      florals: { tl: '', tr: '', bl: '', br: '' },
      animation: { preset: 'fade-up' },
      fonts: { heading: '', body: '', script: '', css_url: '' },
      type: { title_size: '', title_color: '', body_size: '', body_color: '' },
      card: { style: '', bg: '', opacity: '', shadow_color: '', shadow_size: '', radius_tl: '', radius_tr: '', radius_bl: '', radius_br: '' },
      colors: { accent: '', paper: '', ink: '' },
      sections,
    },
  };
}

/** Isi `form` dari data invitation asli — merge dalam supaya key yang tidak
 * ada di data lama tetap punya default aman (form tidak pernah undefined). */
function deepMerge(target, source) {
  if (!source) return;
  for (const k of Object.keys(target)) {
    if (source[k] === undefined || source[k] === null) continue;
    if (typeof target[k] === 'object' && !Array.isArray(target[k]) && target[k] !== null) {
      deepMerge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
  // section keys tak terduga di data lama tetap dimasukkan apa adanya
  if (source.sections) {
    for (const k of Object.keys(source.sections)) {
      if (!target.sections[k]) target.sections[k] = blankSection();
      deepMerge(target.sections[k], source.sections[k]);
    }
  }
}

watch(invitation, (inv) => {
  if (!inv) return;
  Object.assign(form, blankForm());
  form.slug = inv.slug; form.status = inv.status; form.theme_id = inv.theme_id;
  form.groom_name = inv.groom_name; form.bride_name = inv.bride_name;
  form.groom_parents = inv.groom_parents ?? ''; form.bride_parents = inv.bride_parents ?? '';
  form.opening_text = inv.opening_text ?? '';
  form.video_url = inv.video_url ?? ''; form.music_url = inv.music_url ?? '';
  form.rsvp_enabled = inv.rsvp_enabled ?? true; form.guestbook_enabled = inv.guestbook_enabled ?? true;
  form.co_hosts = Array.isArray(inv.co_hosts) ? inv.co_hosts.map((c) => ({ ...c })) : [];
  deepMerge(form.theme_options, inv.theme_options);
}, { immediate: true });

/* ===== upload helpers (langsung upload saat file dipilih, simpan path) ===== */
const uploading = reactive({});
async function handleUpload(e, directory, setPath) {
  const file = e.target.files[0];
  if (!file || !invitation.value) return;
  uploading[directory] = true;
  try { setPath(await uploadThemeFile(invitation.value.id, file, directory)); }
  finally { uploading[directory] = false; }
}
async function handleSlideshowUpload(e) {
  const files = Array.from(e.target.files).slice(0, 3);
  if (!files.length || !invitation.value) return;
  uploading.slideshow = true;
  try {
    const paths = await Promise.all(files.map((f) => uploadThemeFile(invitation.value.id, f, 'covers')));
    form.theme_options.hero.slideshow = paths;
  } finally { uploading.slideshow = false; }
}

function addCoHost() { form.co_hosts.push({ name: '', side: 'pria' }); }
function removeCoHost(i) { form.co_hosts.splice(i, 1); }

async function submit() {
  saving.value = true; saveOk.value = false; saveErr.value = '';
  try {
    await api.put(`/api/invitation/${invitation.value.id}`, { ...form });
    saveOk.value = true;
    setTimeout(() => { saveOk.value = false; }, 2500);
  } catch (e) {
    saveErr.value = e.response?.data?.message || 'Gagal menyimpan undangan.';
  } finally { saving.value = false; }
}
</script>

<template>
  <div class="grid gap-4 pb-16">
    <div>
      <h1 class="font-serif text-2xl" style="font-family: 'Cormorant Garamond', serif">Edit Undangan</h1>
      <p class="text-sm opacity-70">Semua pengaturan tampilan &amp; isi undangan.</p>
    </div>

    <p v-if="isLoading" class="text-sm opacity-60">Memuat…</p>
    <div v-else-if="isError" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      Gagal memuat undangan: {{ error?.response?.data?.message || error?.message }}
    </div>
    <div v-else-if="!invitation" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm opacity-70 dark:border-slate-800 dark:bg-slate-900">
      Belum ada undangan atas akun ini.
    </div>

    <form v-else class="grid gap-4" @submit.prevent="submit">
      <!-- DATA UTAMA -->
      <details open class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Data Utama</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs opacity-70">Slug (URL)</label>
            <input v-model="form.slug" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" required />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Tema</label>
            <select v-model.number="form.theme_id" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Status</label>
            <select v-model="form.status" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </details>

      <!-- DATA MEMPELAI -->
      <details open class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Data Mempelai</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <input v-model="form.groom_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Mempelai Pria" required />
          <input v-model="form.bride_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Mempelai Wanita" required />
          <input v-model="form.groom_parents" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Orang Tua Pria" />
          <input v-model="form.bride_parents" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Orang Tua Wanita" />
          <textarea v-model="form.opening_text" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Teks pembuka" />
        </div>
      </details>

      <!-- SECTION HERO -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">1 — Section Hero (Sampul)</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs opacity-70">Posisi konten hero</label>
            <select v-model="form.theme_options.hero.position" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Split (rekomendasi)</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Efek pergantian</label>
            <select v-model="form.theme_options.hero.effect" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="fade">Fade</option>
              <option value="kenburns">Ken Burns</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Foto utama (desktop)</label>
            <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'covers', (p) => form.theme_options.background.photo = p)" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Foto versi HP (opsional)</label>
            <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'covers', (p) => form.theme_options.background.photo_mobile = p)" />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-xs opacity-70">Slideshow background (maks 3 foto, opsional — menggantikan foto utama)</label>
            <input type="file" accept="image/*" multiple class="text-sm" @change="handleSlideshowUpload" />
            <span v-if="uploading.slideshow" class="ml-2 text-xs opacity-60">Mengunggah…</span>
            <span v-else-if="form.theme_options.hero.slideshow.length" class="ml-2 text-xs opacity-60">{{ form.theme_options.hero.slideshow.length }} foto tersimpan</span>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Jeda per foto (detik)</label>
            <input v-model.number="form.theme_options.hero.interval" type="number" min="4" max="12" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Ornamen transparan (upload)</label>
            <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'ornaments', (p) => form.theme_options.background.ornament_upload = p)" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Kartu hero</label>
            <select v-model="form.theme_options.layout.hero_card" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="inherit">Ikut pengaturan konten</option>
              <option value="card">Selalu pakai kartu</option>
              <option value="plain">Tanpa kartu (full-foto)</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Gaya kartu hero</label>
            <select v-model="form.theme_options.hero.card_style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Ikut gaya global</option>
              <option v-for="(label, v) in CARD_STYLES" :key="v" :value="v">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Font nama pasangan di hero</label>
            <input v-model="form.theme_options.hero.name_font" list="script-fonts" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ikut font kaligrafi global" />
          </div>
          <label class="flex items-center gap-2 text-sm sm:col-span-2">
            <input v-model="form.theme_options.sections.countdown_hero.visible" type="checkbox" /> Countdown di hero
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.theme_options.hero.dresscode_enabled" type="checkbox" /> Tampilkan dresscode
          </label>
          <input v-if="form.theme_options.hero.dresscode_enabled" v-model="form.theme_options.hero.dresscode" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. Batik / Earth Tone" />
        </div>
      </details>

      <!-- SECTION MEMPELAI -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">2 — Section Mempelai</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <label class="flex items-center gap-2 text-sm sm:col-span-2">
            <input v-model="form.theme_options.sections.couple.visible" type="checkbox" /> Tampilkan section
          </label>
          <div>
            <label class="mb-1 block text-xs opacity-70">Desain tampilan</label>
            <select v-model="form.theme_options.couple.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Classic (default)</option>
              <option value="cards">Cards</option>
              <option value="circle">Circle</option>
              <option value="arch">Arch</option>
            </select>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.theme_options.couple.show_photos" type="checkbox" /> Tampilkan foto mempelai
          </label>
          <template v-if="form.theme_options.couple.show_photos">
            <div>
              <label class="mb-1 block text-xs opacity-70">Foto Mempelai Pria</label>
              <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'couple', (p) => form.theme_options.couple.groom_photo = p)" />
            </div>
            <div>
              <label class="mb-1 block text-xs opacity-70">Foto Mempelai Wanita</label>
              <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'couple', (p) => form.theme_options.couple.bride_photo = p)" />
            </div>
          </template>
        </div>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.couple" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION ACARA -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">3 — Section Acara</summary>
        <p class="mt-2 text-xs opacity-60">Isi acara (Akad, Resepsi, tanggal, lokasi) dikelola di halaman "Acara".</p>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.theme_options.sections.events.visible" type="checkbox" /> Tampilkan section
        </label>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.events" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION COUNTDOWN -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">4 — Section Countdown (isi)</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <label class="flex items-center gap-2 text-sm sm:col-span-2">
            <input v-model="form.theme_options.sections.countdown.visible" type="checkbox" /> Tampilkan section
          </label>
          <div>
            <label class="mb-1 block text-xs opacity-70">Gaya angka</label>
            <select v-model="form.theme_options.countdown.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="circle">Bulat</option>
              <option value="boxed">Kotak berbingkai</option>
              <option value="minimal">Minimal</option>
              <option value="pill">Pil memanjang</option>
              <option value="flip">Flip clock</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Isi section</label>
            <select v-model="form.theme_options.countdown.layout" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="simple">Sederhana</option>
              <option value="photo">Foto + nama pasangan</option>
              <option value="date">Tanggal besar</option>
              <option value="quote">Kutipan pembuka</option>
            </select>
          </div>
          <div v-if="form.theme_options.countdown.layout === 'photo'">
            <label class="mb-1 block text-xs opacity-70">Foto latar countdown</label>
            <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'section-bg', (p) => form.theme_options.countdown.photo = p)" />
          </div>
          <textarea v-if="form.theme_options.countdown.layout === 'quote'" v-model="form.theme_options.countdown.quote" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Teks kutipan" />
        </div>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.countdown" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION KISAH KAMI -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">5 — Section Kisah Kami</summary>
        <p class="mt-2 text-xs opacity-60">Isi kisah dikelola di halaman "Kisah Cinta".</p>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.theme_options.sections.love_story.visible" type="checkbox" /> Tampilkan section
        </label>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.theme_options.love_story.show_photos" type="checkbox" /> Tampilkan foto kisah
        </label>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.love_story" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION GALERI -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">6 — Section Galeri</summary>
        <p class="mt-2 text-xs opacity-60">Isi foto dikelola di halaman "Galeri Foto".</p>
        <div class="mt-2 grid gap-2 sm:grid-cols-2">
          <label class="flex items-center gap-2 text-sm sm:col-span-2">
            <input v-model="form.theme_options.sections.gallery.visible" type="checkbox" /> Tampilkan section
          </label>
          <div>
            <label class="mb-1 block text-xs opacity-70">Model galeri</label>
            <select v-model="form.theme_options.gallery.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="carousel">Carousel</option>
              <option value="grid">Grid</option>
              <option value="masonry">Masonry</option>
              <option value="polaroid">Polaroid</option>
              <option value="floating">Floating (thumbnail + panah)</option>
            </select>
          </div>
        </div>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.gallery" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION VIDEO -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">7 — Section Video</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <label class="flex items-center gap-2 text-sm sm:col-span-2">
            <input v-model="form.theme_options.sections.video.visible" type="checkbox" /> Tampilkan section
          </label>
          <input v-model="form.video_url" type="url" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="URL video YouTube" />
          <input v-model="form.theme_options.video.eyebrow" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Eyebrow (mis. Wedding Film)" />
          <textarea v-model="form.theme_options.video.caption" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" rows="2" placeholder="Kalimat pengantar" />
        </div>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.video" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION RSVP -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">8 — Section RSVP</summary>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.rsvp_enabled" type="checkbox" /> RSVP aktif
        </label>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.rsvp" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION UCAPAN -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">9 — Section Ucapan &amp; Doa</summary>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.guestbook_enabled" type="checkbox" /> Buku ucapan aktif
        </label>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.guestbook" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION KADO -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">10 — Section Kado</summary>
        <p class="mt-2 text-xs opacity-60">Isi rekening/e-wallet/QRIS dikelola di halaman "Kado Digital".</p>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.theme_options.sections.gift.visible" type="checkbox" /> Tampilkan section
        </label>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.gift" :invitation-id="invitation.id" />
      </details>

      <!-- SECTION TURUT MENGUNDANG -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">11 — Section Turut Mengundang (Premium+)</summary>
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input v-model="form.theme_options.sections.co_host.visible" type="checkbox" /> Tampilkan section
        </label>
        <div class="mt-3 grid gap-2">
          <div v-for="(c, i) in form.co_hosts" :key="i" class="grid grid-cols-[1fr_auto_auto] items-center gap-2">
            <input v-model="c.name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. Kel. Besar Bpk. H. Ahmad" />
            <select v-model="c.side" class="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="pria">Pihak Pria</option>
              <option value="wanita">Pihak Wanita</option>
              <option value="spesial">Tamu Spesial</option>
            </select>
            <button type="button" class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="removeCoHost(i)">Hapus</button>
          </div>
          <button type="button" class="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700" @click="addCoHost">+ Tambah nama</button>
        </div>
        <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.co_host" :invitation-id="invitation.id" />
      </details>

      <!-- GLOBAL: TATA LETAK & KARTU DEFAULT -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Tata Letak &amp; Kartu Default</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-3">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.theme_options.layout.card" type="checkbox" /> Kartu untuk section konten (default)
          </label>
          <div>
            <label class="mb-1 block text-xs opacity-70">Tinggi section</label>
            <select v-model="form.theme_options.layout.section_height" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="full">Satu layar penuh</option>
              <option value="auto">Setinggi konten</option>
              <option value="smart">Otomatis</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Gaya kartu (default global)</label>
            <select v-model="form.theme_options.card.style" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Bawaan tema</option>
              <option v-for="(label, v) in CARD_STYLES" :key="v" :value="v">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Warna kartu</label>
            <input v-model="form.theme_options.card.bg" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Opacity (%)</label>
            <input v-model.number="form.theme_options.card.opacity" type="number" min="0" max="100" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Warna shadow</label>
            <input v-model="form.theme_options.card.shadow_color" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Ketebalan shadow</label>
            <select v-model="form.theme_options.card.shadow_size" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
              <option value="">Sedang (default)</option>
              <option value="none">Tanpa shadow</option>
              <option value="lembut">Lembut</option>
              <option value="sedang">Sedang</option>
              <option value="kuat">Kuat</option>
            </select>
          </div>
          <div v-for="corner in ['radius_tl', 'radius_tr', 'radius_bl', 'radius_br']" :key="corner">
            <label class="mb-1 block text-xs opacity-70">Radius {{ corner.replace('radius_', '') }} (px)</label>
            <input v-model.number="form.theme_options.card[corner]" type="number" min="0" max="120" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>
      </details>

      <!-- GLOBAL: FLORAL 4 SUDUT -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Floral 4 Sudut Halaman</summary>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <div v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner">
            <label class="mb-1 block text-xs opacity-70">Floral {{ corner.toUpperCase() }}</label>
            <input type="file" accept="image/*" class="text-sm" @change="handleUpload($event, 'ornaments', (p) => form.theme_options.florals[corner] = p)" />
          </div>
        </div>
      </details>

      <!-- GLOBAL: ANIMASI SCROLL -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Animasi Scroll</summary>
        <select v-model="form.theme_options.animation.preset" class="mt-3 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="fade-up">Muncul dari bawah</option>
          <option value="fade-down">Muncul dari atas</option>
          <option value="fade-left">Geser dari kanan</option>
          <option value="fade-right">Geser dari kiri</option>
          <option value="zoom">Zoom lembut</option>
          <option value="none">Tanpa animasi</option>
        </select>
      </details>

      <!-- GLOBAL: TIPOGRAFI -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Tipografi (Judul &amp; Isi)</summary>
        <datalist id="heading-fonts"><option v-for="f in HEADING_FONTS" :key="f" :value="f" /></datalist>
        <datalist id="body-fonts"><option v-for="f in BODY_FONTS" :key="f" :value="f" /></datalist>
        <datalist id="script-fonts"><option v-for="f in SCRIPT_FONTS" :key="f" :value="f" /></datalist>
        <div class="mt-3 grid gap-2 sm:grid-cols-3">
          <input v-model="form.theme_options.fonts.heading" list="heading-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font judul" />
          <input v-model.number="form.theme_options.type.title_size" type="number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ukuran judul (px)" />
          <input v-model="form.theme_options.type.title_color" type="color" class="h-9 rounded-lg border border-slate-200 dark:border-slate-700" />
          <input v-model="form.theme_options.fonts.body" list="body-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font isi" />
          <input v-model.number="form.theme_options.type.body_size" type="number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Ukuran isi (px)" />
          <input v-model="form.theme_options.type.body_color" type="color" class="h-9 rounded-lg border border-slate-200 dark:border-slate-700" />
          <input v-model="form.theme_options.fonts.script" list="script-fonts" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Font kaligrafi" />
          <input v-model="form.theme_options.fonts.css_url" type="url" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="URL CSS font (opsional)" />
        </div>
      </details>

      <!-- GLOBAL: MUSIK -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Musik Latar (Premium+)</summary>
        <input type="file" accept="audio/mpeg,audio/mp3" class="mt-3 text-sm" @change="handleUpload($event, 'music', (p) => form.music_url = p)" />
        <span v-if="uploading.music" class="ml-2 text-xs opacity-60">Mengunggah…</span>
        <span v-else-if="form.music_url" class="ml-2 text-xs opacity-60">Tersimpan: {{ form.music_url }}</span>
      </details>

      <!-- GLOBAL: OVERRIDE WARNA -->
      <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary class="cursor-pointer font-medium">Global — Override Warna</summary>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <div>
            <label class="mb-1 block text-xs opacity-70">Aksen</label>
            <input v-model="form.theme_options.colors.accent" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Permukaan kartu</label>
            <input v-model="form.theme_options.colors.paper" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label class="mb-1 block text-xs opacity-70">Teks</label>
            <input v-model="form.theme_options.colors.ink" type="color" class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      </details>

      <!-- SUBMIT (sticky) -->
      <div class="sticky bottom-0 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <button class="rounded-lg bg-slate-800 px-5 py-2.5 text-sm text-white dark:bg-slate-700" :disabled="saving">
          {{ saving ? 'Menyimpan…' : 'Simpan Perubahan' }}
        </button>
        <span v-if="saveOk" class="text-sm text-emerald-600 dark:text-emerald-400">Tersimpan ✓</span>
        <span v-if="saveErr" class="text-sm text-red-600 dark:text-red-400">{{ saveErr }}</span>
      </div>
    </form>
  </div>
</template>
