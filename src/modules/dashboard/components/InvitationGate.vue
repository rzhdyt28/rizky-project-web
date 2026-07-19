<script setup>
/** Bungkus umum: tunggu undangan aktif termuat sebelum render konten halaman. */
import { useActiveInvitation } from '../../invitation/composables/useInvitation';

defineProps({ title: { type: String, required: true }, subtitle: { type: String, default: '' } });

const { invitation, isLoading, isError, error } = useActiveInvitation();
defineExpose({ invitation });
</script>

<template>
  <div class="grid gap-4">
    <div>
      <h1 class="font-serif text-2xl" style="font-family: 'Cormorant Garamond', serif">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm opacity-70">{{ subtitle }}</p>
    </div>

    <p v-if="isLoading" class="text-sm opacity-60">Memuat…</p>
    <div v-else-if="isError" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      Gagal memuat undangan: {{ error?.response?.data?.message || error?.message || 'terjadi kesalahan.' }}
    </div>
    <div v-else-if="!invitation" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm opacity-70 dark:border-slate-800 dark:bg-slate-900">
      Belum ada undangan atas akun ini.
    </div>

    <slot v-else :invitation="invitation" />
  </div>
</template>
