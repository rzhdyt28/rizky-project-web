<script setup>
import { computed, reactive, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { useEvents } from '../../invitation/composables/useEvents';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useEvents(invitationId);

const EMPTY = { title: '', starts_at: '', ends_at: '', venue_name: '', address: '', maps_url: '', sort_order: 0 };
const editingId = ref(null);
const form = reactive({ ...EMPTY });
const err = ref('');

function startEdit(ev) {
  editingId.value = ev.id;
  Object.assign(form, {
    title: ev.title, starts_at: ev.starts_at?.slice(0, 16) ?? '', ends_at: ev.ends_at?.slice(0, 16) ?? '',
    venue_name: ev.venue_name, address: ev.address ?? '', maps_url: ev.maps_url ?? '', sort_order: ev.sort_order ?? 0,
  });
}
function resetForm() { editingId.value = null; Object.assign(form, EMPTY); }

async function submit() {
  err.value = '';
  try {
    if (editingId.value) await update.mutateAsync({ id: editingId.value, payload: { ...form } });
    else await create.mutateAsync({ ...form });
    resetForm();
  } catch (e) { err.value = e.response?.data?.message || 'Gagal menyimpan acara.'; }
}
</script>

<template>
  <InvitationGate ref="gate" title="Acara" subtitle="Kelola Akad, Resepsi, dan acara lainnya.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2 sm:grid-cols-2" @submit.prevent="submit">
        <input v-model="form.title" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Nama acara (mis. Akad)" required maxlength="150" />
        <input v-model="form.venue_name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Nama tempat" required maxlength="150" />
        <input v-model="form.starts_at" type="datetime-local" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" required />
        <input v-model="form.ends_at" type="datetime-local" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input v-model="form.address" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="Alamat (opsional)" maxlength="500" />
        <input v-model="form.maps_url" type="url" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="Link Google Maps (opsional)" />
        <div class="flex gap-2 sm:col-span-2">
          <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Acara' }}
          </button>
          <button v-if="editingId" type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" @click="resetForm">Batal</button>
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
          <button class="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700" @click="startEdit(ev)">Ubah</button>
          <button class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="remove.mutate(ev.id)">Hapus</button>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
