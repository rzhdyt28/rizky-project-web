<script setup>
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { useGifts } from '../../invitation/composables/useGifts';
import { assetUrl } from '../../invitation/composables/assets';
import { useEditableForm } from '../composables/useEditableForm';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useGifts(invitationId);

const TYPE_LABEL = { bank: 'Rekening Bank', ewallet: 'E-Wallet', qris: 'QRIS', address: 'Alamat Kirim' };
const EMPTY = { type: 'bank', provider: '', account_name: '', account_number: '', shipping_address: '' };
const qrisFile = ref(null);

const { editingId, form, err, startEdit, resetForm, submit } = useEditableForm(EMPTY, {
  defaultErrorMessage: 'Gagal menyimpan metode kado.',
  mapToForm: (g) => ({
    type: g.type, provider: g.provider ?? '', account_name: g.account_name ?? '',
    account_number: g.account_number ?? '', shipping_address: g.shipping_address ?? '',
  }),
  onReset: () => { qrisFile.value = null; },
  onSubmit: (form, id) => {
    const payload = { ...form, qris_image: qrisFile.value };
    return id ? update.mutateAsync({ id, payload }) : create.mutateAsync(payload);
  },
});

function onFile(e) { qrisFile.value = e.target.files[0] ?? null; }
</script>

<template>
  <InvitationGate ref="gate" title="Kado Digital" subtitle="Rekening, e-wallet, QRIS, atau alamat kirim kado.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2" @submit.prevent="submit">
        <select v-model="form.type" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option v-for="(label, v) in TYPE_LABEL" :key="v" :value="v">{{ label }}</option>
        </select>

        <template v-if="form.type === 'bank' || form.type === 'ewallet'">
          <BaseInput v-model="form.provider" placeholder="mis. BCA, OVO, Dana" />
          <BaseInput v-model="form.account_name" placeholder="Atas nama" />
          <BaseInput v-model="form.account_number" placeholder="Nomor rekening/HP" />
        </template>
        <input v-if="form.type === 'qris'" type="file" accept="image/*" class="text-sm" @change="onFile" />
        <BaseInput v-if="form.type === 'address'" v-model="form.shipping_address" as="textarea" rows="2" placeholder="Alamat kirim kado" />

        <div class="flex gap-2">
          <BaseButton type="submit" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Metode' }}
          </BaseButton>
          <BaseButton v-if="editingId" variant="secondary" @click="resetForm">Batal</BaseButton>
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
          <BaseButton variant="pill" @click="startEdit(g)">Ubah</BaseButton>
          <BaseButton variant="pill-danger" @click="remove.mutate(g.id)">Hapus</BaseButton>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
