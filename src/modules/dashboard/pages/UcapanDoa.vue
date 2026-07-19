<script setup>
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { useGuestbookAdmin } from '../../invitation/composables/useGuestbookAdmin';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list, setApproved, remove } = useGuestbookAdmin(invitationId);
</script>

<template>
  <InvitationGate ref="gate" title="Ucapan & Doa" subtitle="Sembunyikan atau hapus ucapan yang tidak pantas tampil.">
    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat ucapan…</p>
    <p v-else-if="!list.data.value?.length" class="text-sm opacity-60">Belum ada ucapan masuk.</p>
    <ul v-else class="grid gap-2">
      <li v-for="e in list.data.value" :key="e.id" class="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900" :class="{ 'opacity-50': !e.is_approved }">
        <div>
          <strong class="block">{{ e.guest_name }}</strong>
          <p class="max-w-md text-sm opacity-80">{{ e.message }}</p>
          <span class="text-xs opacity-50">{{ new Date(e.created_at).toLocaleString('id-ID') }}</span>
        </div>
        <div class="flex gap-2">
          <button
            class="rounded-full border px-3 py-1 text-xs"
            :class="e.is_approved ? 'border-slate-200 dark:border-slate-700' : 'border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'"
            @click="setApproved.mutate({ id: e.id, is_approved: !e.is_approved })"
          >{{ e.is_approved ? 'Sembunyikan' : 'Tampilkan' }}</button>
          <button class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="remove.mutate(e.id)">Hapus</button>
        </div>
      </li>
    </ul>
  </InvitationGate>
</template>
