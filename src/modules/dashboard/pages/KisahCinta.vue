<script setup>
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { useStories } from '../../invitation/composables/useStories';
import { assetUrl } from '../../invitation/composables/assets';
import { useEditableForm } from '../composables/useEditableForm';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, create, update, remove } = useStories(invitationId);

const EMPTY = { title: '', happened_at: '', story: '' };
const photoFile = ref(null);

const { editingId, form, err, startEdit, resetForm, submit } = useEditableForm(EMPTY, {
  defaultErrorMessage: 'Gagal menyimpan kisah.',
  mapToForm: (s) => ({ title: s.title, happened_at: s.happened_at?.slice(0, 10) ?? '', story: s.story }),
  onReset: () => { photoFile.value = null; },
  onSubmit: (form, id) => {
    const payload = { ...form, photo: photoFile.value };
    return id ? update.mutateAsync({ id, payload }) : create.mutateAsync(payload);
  },
});

function onFile(e) { photoFile.value = e.target.files[0] ?? null; }
</script>

<template>
  <InvitationGate ref="gate" title="Kisah Cinta" subtitle="Cerita perjalanan kalian, tampil berurutan di undangan.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2" @submit.prevent="submit">
        <BaseInput v-model="form.title" placeholder="Judul kisah" required maxlength="150" />
        <BaseInput v-model="form.happened_at" type="date" />
        <BaseInput v-model="form.story" as="textarea" rows="3" placeholder="Cerita" required maxlength="2000" />
        <input type="file" accept="image/*" class="text-sm" @change="onFile" />
        <div class="flex gap-2">
          <BaseButton type="submit" :disabled="create.isPending.value || update.isPending.value">
            {{ editingId ? 'Simpan Perubahan' : 'Tambah Kisah' }}
          </BaseButton>
          <BaseButton v-if="editingId" variant="secondary" @click="resetForm">Batal</BaseButton>
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
          <BaseButton variant="pill" @click="startEdit(s)">Ubah</BaseButton>
          <BaseButton variant="pill-danger" @click="remove.mutate(s.id)">Hapus</BaseButton>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
