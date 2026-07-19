<script setup>
import { computed, reactive, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { useStories } from '../../invitation/composables/useStories';
import { assetUrl } from '../../invitation/composables/assets';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useStories(invitationId);

const EMPTY = { title: '', happened_at: '', story: '' };
const editingId = ref(null);
const form = reactive({ ...EMPTY });
const photoFile = ref(null);
const err = ref('');

function startEdit(s) {
  editingId.value = s.id;
  Object.assign(form, { title: s.title, happened_at: s.happened_at?.slice(0, 10) ?? '', story: s.story });
  photoFile.value = null;
}
function resetForm() { editingId.value = null; Object.assign(form, EMPTY); photoFile.value = null; }
function onFile(e) { photoFile.value = e.target.files[0] ?? null; }

async function submit() {
  err.value = '';
  const payload = { ...form, photo: photoFile.value };
  try {
    if (editingId.value) await update.mutateAsync({ id: editingId.value, payload });
    else await create.mutateAsync(payload);
    resetForm();
  } catch (e) { err.value = e.response?.data?.message || 'Gagal menyimpan kisah.'; }
}
</script>

<template>
  <InvitationGate ref="gate" title="Kisah Cinta" subtitle="Cerita perjalanan kalian, tampil berurutan di undangan.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2" @submit.prevent="submit">
        <input v-model="form.title" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Judul kisah" required maxlength="150" />
        <input v-model="form.happened_at" type="date" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <textarea v-model="form.story" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" rows="3" placeholder="Cerita" required maxlength="2000" />
        <input type="file" accept="image/*" class="text-sm" @change="onFile" />
        <div class="flex gap-2">
          <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-slate-700" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Kisah' }}
          </button>
          <button v-if="editingId" type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" @click="resetForm">Batal</button>
        </div>
      </form>
      <p v-if="err" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ err }}</p>
    </div>

    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat kisah…</p>
    <p v-else-if="!list.data.value?.length" class="text-sm opacity-60">Belum ada kisah. Tambahkan lewat form di atas.</p>
    <ul v-else class="grid gap-2">
      <li v-for="s in list.data.value" :key="s.id" class="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex gap-3">
          <img v-if="s.photo" :src="assetUrl(s.photo)" class="h-14 w-14 rounded-lg object-cover" alt="" />
          <div>
            <strong class="block">{{ s.title }}</strong>
            <p class="max-w-md text-sm opacity-70">{{ s.story }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700" @click="startEdit(s)">Ubah</button>
          <button class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="remove.mutate(s.id)">Hapus</button>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
