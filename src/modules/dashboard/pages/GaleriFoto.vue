<script setup>
/** Reorder pakai tombol naik/turun (bukan drag-and-drop) — tidak ada
 * library drag di project ini, dan ini tetap mencapai hasil yang sama.
 * Halaman ini tidak punya form "tambah/ubah" seperti 3 halaman CRUD
 * lain (upload langsung, caption diedit inline per-baris), jadi tidak
 * memakai useEditableForm — hanya komponen dasar (BaseInput/BaseButton)
 * yang dipakai bersama. */
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { useGalleryPhotos } from '../../invitation/composables/useGalleryPhotos';
import { assetUrl } from '../../invitation/composables/assets';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, upload, updateCaption, remove, reorder } = useGalleryPhotos(invitationId);

const file = ref(null);
const caption = ref('');
const err = ref('');

function onFile(e) { file.value = e.target.files[0] ?? null; }

async function submit() {
  err.value = '';
  if (!file.value) return;
  try {
    await upload.mutateAsync({ file: file.value, caption: caption.value });
    file.value = null; caption.value = '';
  } catch (e) { err.value = e.response?.data?.message || 'Gagal mengunggah foto.'; }
}

function saveCaption(p, value) {
  if (value !== p.caption) updateCaption.mutate({ id: p.id, caption: value });
}

function move(index, dir) {
  const photos = [...list.data.value];
  const target = index + dir;
  if (target < 0 || target >= photos.length) return;
  [photos[index], photos[target]] = [photos[target], photos[index]];
  reorder.mutate(photos.map((p) => p.id));
}
</script>

<template>
  <InvitationGate ref="gate" title="Galeri Foto" subtitle="Foto yang tampil di section Galeri undangan.">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <form class="grid gap-2 sm:grid-cols-[auto_1fr_auto]" @submit.prevent="submit">
        <input type="file" accept="image/*" class="text-sm" required @change="onFile" />
        <BaseInput v-model="caption" placeholder="Keterangan (opsional)" maxlength="255" />
        <BaseButton type="submit" :disabled="upload.isPending.value">Unggah</BaseButton>
      </form>
      <p v-if="err" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ err }}</p>
    </div>

    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat galeri…</p>
    <p v-else-if="!list.data.value?.length" class="text-sm opacity-60">Belum ada foto. Unggah lewat form di atas.</p>
    <ul v-else class="grid gap-2 sm:grid-cols-2">
      <li v-for="(p, i) in list.data.value" :key="p.id" class="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <img :src="assetUrl(p.path)" class="aspect-square w-full rounded-lg object-cover" alt="" />
        <input
          :value="p.caption" placeholder="Keterangan"
          class="rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
          @change="saveCaption(p, $event.target.value)"
        />
        <div class="flex items-center justify-between gap-1">
          <div class="flex gap-1">
            <BaseButton variant="pill" :disabled="i === 0" @click="move(i, -1)">↑</BaseButton>
            <BaseButton variant="pill" :disabled="i === list.data.value.length - 1" @click="move(i, 1)">↓</BaseButton>
          </div>
          <BaseButton variant="pill-danger" @click="remove.mutate(p.id)">Hapus</BaseButton>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
