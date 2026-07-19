<script setup>
/** Tamu — versi penuh (bukan panel kecil di Undangan Saya): tabel, tambah
 * manual, import Excel/CSV (maks 2000 baris), aksi per-tamu (reuse
 * useGuestShare seperti UndanganSaya.vue). */
import { computed, reactive, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { api } from '../../../shared/api/client';
import { useGuestShare } from '../composables/useGuestShare';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

const gate = ref(null);
const invitation = computed(() => gate.value?.invitation ?? null);
const invitationId = computed(() => invitation.value?.id ?? null);
const { guestLink, waMessage, waHref, copy, copied } = useGuestShare();

const qc = useQueryClient();
const guestsQuery = useQuery({
  queryKey: computed(() => ['guests', invitationId.value]),
  queryFn: async () => (await api.get(`/api/invitation/${invitationId.value}/guests`)).data,
  enabled: () => !!invitationId.value,
});

const form = reactive({ name: '', phone: '' });
const busy = ref(false);
const err = ref('');

async function addGuest() {
  if (!form.name.trim()) return;
  busy.value = true; err.value = '';
  try {
    await api.post(`/api/invitation/${invitationId.value}/guests`, { name: form.name.trim(), phone: form.phone.trim() || null });
    form.name = ''; form.phone = '';
    qc.invalidateQueries({ queryKey: ['guests', invitationId.value] });
  } catch (e) { err.value = e.response?.data?.message || 'Gagal menambah tamu.'; }
  finally { busy.value = false; }
}

async function removeGuest(g) {
  try {
    await api.delete(`/api/invitation/${invitationId.value}/guests/${g.id}`);
    qc.invalidateQueries({ queryKey: ['guests', invitationId.value] });
  } catch { err.value = 'Gagal menghapus tamu.'; }
}

/* ===== Import Excel/CSV ===== */
const importFile = ref(null);
const importing = ref(false);
const importResult = ref(null);

function onImportFile(e) { importFile.value = e.target.files[0] ?? null; importResult.value = null; }

async function submitImport() {
  if (!importFile.value) return;
  importing.value = true; importResult.value = null; err.value = '';
  const fd = new FormData();
  fd.append('file', importFile.value);
  try {
    const { data } = await api.post(`/api/invitation/${invitationId.value}/guests/import`, fd);
    importResult.value = data;
    importFile.value = null;
    qc.invalidateQueries({ queryKey: ['guests', invitationId.value] });
  } catch (e) { err.value = e.response?.data?.message || 'Gagal mengimpor file.'; }
  finally { importing.value = false; }
}
</script>

<template>
  <InvitationGate ref="gate" title="Tamu" subtitle="Kelola daftar tamu, link personal, dan pesan WhatsApp.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 class="mb-2 text-sm font-medium">Tambah tamu manual</h3>
      <form class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]" @submit.prevent="addGuest">
        <input v-model="form.name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Nama tamu" required maxlength="120" />
        <input v-model="form.phone" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="No. WA (opsional)" maxlength="30" />
        <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700" :disabled="busy">Tambah</button>
      </form>
      <p v-if="err" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ err }}</p>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 class="mb-2 text-sm font-medium">Import dari Excel/CSV</h3>
      <p class="mb-2 text-xs opacity-60">Kolom 1 = Nama, kolom 2 = No. WA. Baris pertama dianggap header. Maks 2000 baris.</p>
      <div class="flex flex-wrap items-center gap-2">
        <input type="file" accept=".xlsx,.csv,.txt" class="text-sm" @change="onImportFile" />
        <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" :disabled="!importFile || importing" @click="submitImport">
          {{ importing ? 'Mengimpor…' : 'Import' }}
        </button>
      </div>
      <p v-if="importResult" class="mt-2 text-sm">
        {{ importResult.created }} tamu berhasil ditambahkan.
        <span v-if="importResult.skipped.length" class="block opacity-70">
          {{ importResult.skipped.length }} baris dilewati: {{ importResult.skipped.slice(0, 5).join('; ') }}<span v-if="importResult.skipped.length > 5">, dst.</span>
        </span>
      </p>
    </div>

    <p v-if="guestsQuery.isLoading.value" class="text-sm opacity-60">Memuat tamu…</p>
    <p v-else-if="!guestsQuery.data.value?.length" class="text-sm opacity-60">Belum ada tamu.</p>
    <ul v-else class="grid gap-2">
      <li v-for="g in guestsQuery.data.value" :key="g.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <strong class="block text-sm">{{ g.name }}</strong>
          <small v-if="g.phone" class="opacity-60">{{ g.phone }}</small>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button class="rounded-full border border-slate-200 px-2.5 py-1 text-xs dark:border-slate-700" @click="copy(guestLink(invitation, g), `l${g.id}`)">
            {{ copied === `l${g.id}` ? 'Tersalin ✓' : 'Salin link' }}
          </button>
          <button class="rounded-full border border-slate-200 px-2.5 py-1 text-xs dark:border-slate-700" @click="copy(waMessage(invitation, g), `m${g.id}`)">
            {{ copied === `m${g.id}` ? 'Tersalin ✓' : 'Salin pesan' }}
          </button>
          <a class="rounded-full border border-emerald-300 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-400" :href="waHref(invitation, g)" target="_blank" rel="noopener">WhatsApp</a>
          <button class="rounded-full border border-red-300 px-2.5 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="removeGuest(g)">Hapus</button>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
