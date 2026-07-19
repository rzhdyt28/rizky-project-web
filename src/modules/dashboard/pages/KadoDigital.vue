<script setup>
import { computed, reactive, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { useGifts } from '../../invitation/composables/useGifts';
import { assetUrl } from '../../invitation/composables/assets';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useGifts(invitationId);

const TYPE_LABEL = { bank: 'Rekening Bank', ewallet: 'E-Wallet', qris: 'QRIS', address: 'Alamat Kirim' };
const EMPTY = { type: 'bank', provider: '', account_name: '', account_number: '', shipping_address: '' };
const editingId = ref(null);
const form = reactive({ ...EMPTY });
const qrisFile = ref(null);
const err = ref('');

function startEdit(g) {
  editingId.value = g.id;
  Object.assign(form, {
    type: g.type, provider: g.provider ?? '', account_name: g.account_name ?? '',
    account_number: g.account_number ?? '', shipping_address: g.shipping_address ?? '',
  });
  qrisFile.value = null;
}
function resetForm() { editingId.value = null; Object.assign(form, EMPTY); qrisFile.value = null; }
function onFile(e) { qrisFile.value = e.target.files[0] ?? null; }

async function submit() {
  err.value = '';
  const payload = { ...form, qris_image: qrisFile.value };
  try {
    if (editingId.value) await update.mutateAsync({ id: editingId.value, payload });
    else await create.mutateAsync(payload);
    resetForm();
  } catch (e) { err.value = e.response?.data?.message || 'Gagal menyimpan metode kado.'; }
}
</script>

<template>
  <InvitationGate ref="gate" title="Kado Digital" subtitle="Rekening, e-wallet, QRIS, atau alamat kirim kado.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2" @submit.prevent="submit">
        <select v-model="form.type" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option v-for="(label, v) in TYPE_LABEL" :key="v" :value="v">{{ label }}</option>
        </select>

        <template v-if="form.type === 'bank' || form.type === 'ewallet'">
          <input v-model="form.provider" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. BCA, OVO, Dana" />
          <input v-model="form.account_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Atas nama" />
          <input v-model="form.account_number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Nomor rekening/HP" />
        </template>
        <input v-if="form.type === 'qris'" type="file" accept="image/*" class="text-sm" @change="onFile" />
        <textarea v-if="form.type === 'address'" v-model="form.shipping_address" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" rows="2" placeholder="Alamat kirim kado" />

        <div class="flex gap-2">
          <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Metode' }}
          </button>
          <button v-if="editingId" type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" @click="resetForm">Batal</button>
        </div>
      </form>
      <p v-if="err" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ err }}</p>
    </div>

    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat…</p>
    <p v-else-if="!list.data.value?.length" class="text-sm opacity-60">Belum ada metode kado. Tambahkan lewat form di atas.</p>
    <ul v-else class="grid gap-2">
      <li v-for="g in list.data.value" :key="g.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <img v-if="g.qris_image" :src="assetUrl(g.qris_image)" class="h-12 w-12 rounded-lg object-cover" alt="" />
          <div>
            <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{ TYPE_LABEL[g.type] }}</span>
            <p class="mt-1 text-sm">{{ [g.provider, g.account_name, g.account_number].filter(Boolean).join(' — ') || g.shipping_address }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700" @click="startEdit(g)">Ubah</button>
          <button class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="remove.mutate(g.id)">Hapus</button>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
