<script setup>
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { useEvents } from '../../invitation/composables/useEvents';
import { useEditableForm } from '../composables/useEditableForm';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useEvents(invitationId);

const EMPTY = { title: '', starts_at: '', ends_at: '', venue_name: '', address: '', maps_url: '', sort_order: 0 };

const { editingId, form, err, startEdit, resetForm, submit } = useEditableForm(EMPTY, {
  defaultErrorMessage: 'Gagal menyimpan acara.',
  mapToForm: (ev) => ({
    title: ev.title, starts_at: ev.starts_at?.slice(0, 16) ?? '', ends_at: ev.ends_at?.slice(0, 16) ?? '',
    venue_name: ev.venue_name, address: ev.address ?? '', maps_url: ev.maps_url ?? '', sort_order: ev.sort_order ?? 0,
  }),
  onSubmit: (payload, id) => (id ? update.mutateAsync({ id, payload }) : create.mutateAsync(payload)),
});
</script>

<template>
  <InvitationGate ref="gate" title="Acara" subtitle="Kelola Akad, Resepsi, dan acara lainnya.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2 sm:grid-cols-2" @submit.prevent="submit">
        <BaseInput v-model="form.title" placeholder="Nama acara (mis. Akad)" required maxlength="150" />
        <BaseInput v-model="form.venue_name" placeholder="Nama tempat" required maxlength="150" />
        <BaseInput v-model="form.starts_at" type="datetime-local" required />
        <BaseInput v-model="form.ends_at" type="datetime-local" />
        <BaseInput v-model="form.address" placeholder="Alamat (opsional)" maxlength="500" wide />
        <BaseInput v-model="form.maps_url" type="url" placeholder="Link Google Maps (opsional)" wide />
        <div class="flex gap-2 sm:col-span-2">
          <BaseButton type="submit" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Acara' }}
          </BaseButton>
          <BaseButton v-if="editingId" variant="secondary" @click="resetForm">Batal</BaseButton>
        </div>
      </form>
      <p v-if="err" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ err }}</p>
    </div>

    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat acara…</p>
    <p v-else-if="!list.data.value?.length" class="text-sm opacity-60">Belum ada acara. Tambahkan lewat form di atas.</p>
    <ul v-else class="grid gap-2">
      <li v-for="ev in list.data.value" :key="ev.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <strong class="block">{{ ev.title }}</strong>
          <span class="text-sm opacity-70">{{ new Date(ev.starts_at).toLocaleString('id-ID') }} — {{ ev.venue_name }}</span>
        </div>
        <div class="flex gap-2">
          <BaseButton variant="pill" @click="startEdit(ev)">Ubah</BaseButton>
          <BaseButton variant="pill-danger" @click="remove.mutate(ev.id)">Hapus</BaseButton>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
