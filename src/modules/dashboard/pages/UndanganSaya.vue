<script setup>
/**
 * UNDANGAN SAYA — daftar undangan milik user + panel Tamu & RSVP per undangan
 * (tambah/hapus tamu, salin link personal, bagikan WA). Direlokasi dari bekas
 * MyInvitations.vue (logikanya sama, hanya dipindah ke dalam shell dashboard
 * + restyle dark/light + isError kini ditangani).
 */
import { computed, reactive, ref } from 'vue';
import { useMyInvitations } from '../../invitation/composables/useInvitation';
import { api } from '../../../shared/api/client';
import { useGuestShare, STATUS_LABEL, viewUrl } from '../composables/useGuestShare';

const { data, isLoading, isError, error } = useMyInvitations();
const { guestLink, waMessage, waHref, copy, copied } = useGuestShare();
const invitations = computed(() => data.value?.data ?? []);

const open = ref(null); // id undangan yang panelnya sedang terbuka
const panel = reactive({}); // { [id]: { guests, rsvp, busy, err, form:{name,phone} } }

async function togglePanel(inv) {
  if (open.value === inv.id) { open.value = null; return; }
  open.value = inv.id;
  if (!panel[inv.id]) {
    panel[inv.id] = { guests: [], rsvp: null, busy: false, err: '', form: { name: '', phone: '' } };
    await Promise.all([loadGuests(inv), loadRsvp(inv)]);
  }
}

async function loadGuests(inv) {
  try { panel[inv.id].guests = (await api.get(`/api/invitation/${inv.id}/guests`)).data; }
  catch { panel[inv.id].err = 'Gagal memuat tamu.'; }
}

async function loadRsvp(inv) {
  try { panel[inv.id].rsvp = (await api.get(`/api/invitation/${inv.id}/rsvps`)).data.summary; }
  catch { /* rekap opsional; biarkan kosong */ }
}

async function addGuest(inv) {
  const p = panel[inv.id];
  if (!p.form.name.trim()) return;
  p.busy = true; p.err = '';
  try {
    await api.post(`/api/invitation/${inv.id}/guests`, {
      name: p.form.name.trim(),
      phone: p.form.phone.trim() || null,
    });
    p.form.name = ''; p.form.phone = '';
    await loadGuests(inv);
  } catch (e) {
    p.err = e.response?.data?.message || 'Gagal menambah tamu.';
  } finally { p.busy = false; }
}

async function removeGuest(inv, guest) {
  const p = panel[inv.id];
  try {
    await api.delete(`/api/invitation/${inv.id}/guests/${guest.id}`);
    p.guests = p.guests.filter((g) => g.id !== guest.id);
  } catch { p.err = 'Gagal menghapus tamu.'; }
}

function rsvpCount(summary, key) {
  const row = summary?.find((r) => r.attendance === key);
  return { total: row?.total ?? 0, pax: row?.pax ?? 0 };
}
</script>

<template>
  <div class="grid gap-4">
    <div>
      <h1 class="font-serif text-2xl" style="font-family: 'Cormorant Garamond', serif">Undangan Saya</h1>
      <p class="text-sm opacity-70">Kelola tamu, RSVP, dan bagikan link undanganmu.</p>
    </div>

    <p v-if="isLoading" class="text-sm opacity-60">Memuat…</p>
    <div v-else-if="isError" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      Gagal memuat undangan: {{ error?.response?.data?.message || error?.message || 'terjadi kesalahan.' }}
    </div>

    <div v-else-if="!invitations.length" class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p>Belum ada undangan atas akun ini.</p>
      <p class="mt-1 text-sm opacity-60">Hubungi admin untuk pembuatan undangan pertama Anda — setelah dibuat, kelola tamunya dari sini.</p>
    </div>

    <template v-else>
    <article
      v-for="inv in invitations" :key="inv.id"
      class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 class="text-lg">{{ inv.groom_name }} &amp; {{ inv.bride_name }}</h3>
          <p class="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">/{{ inv.slug }}</code>
            <span
              class="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
              :class="{
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300': inv.status === 'published',
                'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300': inv.status === 'draft',
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400': inv.status === 'archived',
              }"
            >{{ STATUS_LABEL[inv.status] ?? inv.status }}</span>
            <span v-if="inv.theme" class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{ inv.theme.name }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1.5 text-xs uppercase tracking-wide dark:border-slate-700" :href="viewUrl(inv)" target="_blank" rel="noopener">
            {{ inv.status === 'published' ? 'Lihat' : 'Pratinjau' }}
          </a>
          <button class="rounded-full bg-slate-800 px-3 py-1.5 text-xs uppercase tracking-wide text-white dark:bg-slate-700" @click="togglePanel(inv)">
            {{ open === inv.id ? 'Tutup' : 'Tamu & RSVP' }}
          </button>
        </div>
      </div>

      <div v-if="open === inv.id && panel[inv.id]" class="mt-4 border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
        <div v-if="panel[inv.id].rsvp" class="mb-4 grid grid-cols-3 gap-2">
          <div class="rounded-xl bg-emerald-50 p-2 text-center dark:bg-emerald-950">
            <strong class="block text-lg">{{ rsvpCount(panel[inv.id].rsvp, 'attending').total }}</strong>
            <span class="text-xs opacity-70">Hadir ({{ rsvpCount(panel[inv.id].rsvp, 'attending').pax }} org)</span>
          </div>
          <div class="rounded-xl bg-red-50 p-2 text-center dark:bg-red-950">
            <strong class="block text-lg">{{ rsvpCount(panel[inv.id].rsvp, 'not_attending').total }}</strong>
            <span class="text-xs opacity-70">Berhalangan</span>
          </div>
          <div class="rounded-xl bg-amber-50 p-2 text-center dark:bg-amber-950">
            <strong class="block text-lg">{{ rsvpCount(panel[inv.id].rsvp, 'maybe').total }}</strong>
            <span class="text-xs opacity-70">Ragu</span>
          </div>
        </div>

        <form class="mb-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]" @submit.prevent="addGuest(inv)">
          <input v-model="panel[inv.id].form.name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Nama tamu" required maxlength="120" />
          <input v-model="panel[inv.id].form.phone" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="No. WA (opsional)" maxlength="30" />
          <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700" :disabled="panel[inv.id].busy">Tambah</button>
        </form>
        <p v-if="panel[inv.id].err" class="mb-2 text-sm text-red-600 dark:text-red-400">{{ panel[inv.id].err }}</p>

        <p v-if="!panel[inv.id].guests.length" class="text-sm opacity-60">
          Belum ada tamu. Tambahkan nama di atas — tiap tamu otomatis mendapat link undangan dengan namanya.
        </p>
        <ul v-else class="grid gap-2">
          <li v-for="g in panel[inv.id].guests" :key="g.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <div>
              <strong class="block text-sm">{{ g.name }}</strong>
              <small v-if="g.phone" class="opacity-60">{{ g.phone }}</small>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button class="rounded-full border border-slate-200 px-2.5 py-1 text-xs dark:border-slate-700" @click="copy(guestLink(inv, g), `l${g.id}`)">
                {{ copied === `l${g.id}` ? 'Tersalin ✓' : 'Salin link' }}
              </button>
              <button class="rounded-full border border-slate-200 px-2.5 py-1 text-xs dark:border-slate-700" @click="copy(waMessage(inv, g), `m${g.id}`)">
                {{ copied === `m${g.id}` ? 'Tersalin ✓' : 'Salin pesan' }}
              </button>
              <a class="rounded-full border border-emerald-300 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-400" :href="waHref(inv, g)" target="_blank" rel="noopener">WhatsApp</a>
              <button class="rounded-full border border-red-300 px-2.5 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="removeGuest(inv, g)">Hapus</button>
            </div>
          </li>
        </ul>
      </div>
    </article>
    </template>
  </div>
</template>
