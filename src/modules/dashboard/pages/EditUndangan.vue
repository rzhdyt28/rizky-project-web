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
 *
 * Halaman ini cuma orkestrasi (fetch + save + rakit komponen section); shape
 * form & deepMerge ada di useInvitationForm.js, markup tiap section ada di
 * components/edit-sections/*.
 */
import { reactive, ref, watch } from 'vue';
import { useActiveInvitation } from '../../invitation/composables/useInvitation';
import { useThemes } from '../../invitation/composables/useThemes';
import { uploadThemeFile } from '../../invitation/composables/useThemeUpload';
import { api } from '../../../shared/api/client';
import { useInvitationForm } from '../composables/useInvitationForm';
import SectionVisibilityChecklist from '../components/SectionVisibilityChecklist.vue';
import HeroSectionFields from '../components/edit-sections/HeroSectionFields.vue';
import CoupleSectionFields from '../components/edit-sections/CoupleSectionFields.vue';
import EventsSectionFields from '../components/edit-sections/EventsSectionFields.vue';
import CountdownSectionFields from '../components/edit-sections/CountdownSectionFields.vue';
import LoveStorySectionFields from '../components/edit-sections/LoveStorySectionFields.vue';
import GallerySectionFields from '../components/edit-sections/GallerySectionFields.vue';
import VideoSectionFields from '../components/edit-sections/VideoSectionFields.vue';
import RsvpGuestbookSectionFields from '../components/edit-sections/RsvpGuestbookSectionFields.vue';
import GiftSectionFields from '../components/edit-sections/GiftSectionFields.vue';
import CoHostSectionFields from '../components/edit-sections/CoHostSectionFields.vue';
import GlobalStyleSectionFields from '../components/edit-sections/GlobalStyleSectionFields.vue';
import GlobalTypographySectionFields from '../components/edit-sections/GlobalTypographySectionFields.vue';

const { invitation, isLoading, isError, error } = useActiveInvitation();
const { data: themes } = useThemes();

const { form, applyInvitation, applyLook } = useInvitationForm();
const saving = ref(false);
const saveOk = ref(false);
const saveErr = ref('');

watch(invitation, applyInvitation, { immediate: true });

// Pengaturan visual (warna, font, gaya kartu, layout hero, dst) hidup di
// default_options CHILD THEME, TERPISAH dari data utama undangan -- lihat
// InvitationController::look() di backend. Dimuat begitu invitation.id ada.
watch(invitation, async (inv) => {
  if (!inv) return;
  const { data } = await api.get(`/api/invitation/${inv.id}/look`);
  applyLook(data.default_options);
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

async function submit() {
  saving.value = true; saveOk.value = false; saveErr.value = '';
  try {
    // Data utama (slug, nama, tema, dst) & tampilan visual (default_options
    // child theme) hidup di 2 resource BEDA di backend -- lihat catatan di
    // InvitationController::look()/updateLook(). Disimpan sebagai 2 request.
    const { theme_options, ...invitationData } = form;
    await Promise.all([
      api.put(`/api/invitation/${invitation.value.id}`, invitationData),
      api.put(`/api/invitation/${invitation.value.id}/look`, { default_options: theme_options }),
    ]);
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

      <SectionVisibilityChecklist :form="form" />

      <HeroSectionFields :form="form" :invitation-id="invitation.id" :handle-upload="handleUpload" />
      <CoupleSectionFields :form="form" :invitation-id="invitation.id" :handle-upload="handleUpload" />
      <EventsSectionFields :form="form" :invitation-id="invitation.id" />
      <CountdownSectionFields :form="form" :invitation-id="invitation.id" :handle-upload="handleUpload" />
      <LoveStorySectionFields :form="form" :invitation-id="invitation.id" />
      <GallerySectionFields :form="form" :invitation-id="invitation.id" />
      <VideoSectionFields :form="form" :invitation-id="invitation.id" :handle-upload="handleUpload" />
      <RsvpGuestbookSectionFields :form="form" :invitation-id="invitation.id" />
      <GiftSectionFields :form="form" :invitation-id="invitation.id" />
      <CoHostSectionFields :form="form" :invitation-id="invitation.id" />
      <GlobalStyleSectionFields :form="form" :uploading="uploading" :handle-upload="handleUpload" :handle-slideshow-upload="handleSlideshowUpload" />
      <GlobalTypographySectionFields :form="form" :uploading="uploading" :handle-upload="handleUpload" />

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
