<script setup>
import { computed, ref } from 'vue';
import InvitationGate from '../components/InvitationGate.vue';
import { useRsvpList, rsvpExportUrl } from '../../invitation/composables/useRsvpList';

const gate = ref(null);
const invitationId = computed(() => gate.value?.invitation?.id ?? null);
const { list } = useRsvpList(invitationId);

const ATTENDANCE_LABEL = { attending: 'Hadir', not_attending: 'Berhalangan', maybe: 'Ragu' };

function count(key) {
  const row = list.data.value?.summary?.find((r) => r.attendance === key);
  return { total: row?.total ?? 0, pax: row?.pax ?? 0 };
}
</script>

<template>
  <InvitationGate ref="gate" title="RSVP" subtitle="Rekap konfirmasi kehadiran tamu.">
    <p v-if="list.isLoading.value" class="text-sm opacity-60">Memuat…</p>
    <template v-else>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950">
          <strong class="block text-xl">{{ count('attending').total }}</strong>
          <span class="text-xs opacity-70">Hadir ({{ count('attending').pax }} org)</span>
        </div>
        <div class="rounded-xl bg-red-50 p-3 text-center dark:bg-red-950">
          <strong class="block text-xl">{{ count('not_attending').total }}</strong>
          <span class="text-xs opacity-70">Berhalangan</span>
        </div>
        <div class="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950">
          <strong class="block text-xl">{{ count('maybe').total }}</strong>
          <span class="text-xs opacity-70">Ragu</span>
        </div>
      </div>

      <a
        v-if="invitationId"
        class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700"
        :href="rsvpExportUrl(invitationId)"
      >⬇️ Export ke Excel</a>

      <p v-if="!list.data.value?.items?.data?.length" class="text-sm opacity-60">Belum ada RSVP masuk.</p>
      <div v-else class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-3 py-2">Nama</th>
              <th class="px-3 py-2">Kehadiran</th>
              <th class="px-3 py-2">Jumlah</th>
              <th class="px-3 py-2">No. HP</th>
              <th class="px-3 py-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in list.data.value.items.data" :key="r.id" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-3 py-2">{{ r.guest_name }}</td>
              <td class="px-3 py-2">{{ ATTENDANCE_LABEL[r.attendance] ?? r.attendance }}</td>
              <td class="px-3 py-2">{{ r.pax }}</td>
              <td class="px-3 py-2">{{ r.phone || '—' }}</td>
              <td class="px-3 py-2">{{ new Date(r.created_at).toLocaleString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </InvitationGate>
</template>
