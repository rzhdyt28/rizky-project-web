<script setup>
/**
 * BERANDA — kartu ringkasan per undangan (status, tamu, RSVP, sisa masa aktif
 * plan) + shortcut aksi cepat. "Aktivitas terkini" (tamu/RSVP/ucapan BARU)
 * sengaja belum dibuat di Fase 1: backend belum punya endpoint riwayat waktu
 * kejadian (timeline), baru total agregat — lihat catatan di plan.
 */
import { reactive, watchEffect } from 'vue';
import { useMyInvitations } from '../../invitation/composables/useInvitation';
import { useAuthStore } from '../../../shared/stores/auth';
import { api } from '../../../shared/api/client';
import { useGuestShare, STATUS_LABEL, viewUrl } from '../composables/useGuestShare';

const auth = useAuthStore();
const { data, isLoading, isError, error } = useMyInvitations();
const { copy, copied } = useGuestShare();

const apiBase = import.meta.env.VITE_API_URL || '';
const adminUrl = `${apiBase}/admin`;

const stats = reactive({}); // { [id]: { guests, rsvpTotal } }

watchEffect(async () => {
  for (const inv of data.value?.data ?? []) {
    if (stats[inv.id]) continue;
    stats[inv.id] = { guests: null, rsvpTotal: null };
    try {
      const [guests, rsvps] = await Promise.all([
        api.get(`/api/invitation/${inv.id}/guests`),
        api.get(`/api/invitation/${inv.id}/rsvps`),
      ]);
      stats[inv.id].guests = guests.data.length;
      stats[inv.id].rsvpTotal = (rsvps.data.summary ?? []).reduce((sum, r) => sum + r.total, 0);
    } catch { /* kartu tetap tampil tanpa angka kalau gagal */ }
  }
});

function daysLeft(endsAt) {
  if (!endsAt) return null;
  const diff = Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000);
  return Math.max(0, diff);
}

function shareText(inv) {
  return [
    `Undangan pernikahan ${inv.groom_name} & ${inv.bride_name}:`,
    `${location.origin}${viewUrl(inv)}`,
  ].join('\n');
}
function shareHref(inv) {
  return `https://wa.me/?text=${encodeURIComponent(shareText(inv))}`;
}
</script>

<template>
  <div class="grid gap-6">
    <div>
      <h1 class="font-serif text-2xl" style="font-family: 'Cormorant Garamond', serif">Beranda</h1>
      <p class="text-sm opacity-70">Ringkasan undangan dan aktivitasmu.</p>
    </div>

    <!-- pintasan admin -->
    <section v-if="auth.isAdmin" class="grid gap-3 sm:grid-cols-2">
      <a class="grid gap-0.5 rounded-2xl bg-slate-800 p-4 text-white no-underline dark:bg-slate-700" :href="adminUrl" target="_blank" rel="noopener">
        <strong>Panel Admin</strong>
        <span class="text-sm opacity-85">Kelola undangan, tema, pustaka aset, paket &amp; pelanggan (Filament).</span>
      </a>
      <RouterLink class="grid gap-0.5 rounded-2xl bg-slate-800 p-4 text-white no-underline dark:bg-slate-700" to="/agent">
        <strong>Agent Monitoring</strong>
        <span class="text-sm opacity-85">Pantau agen lamaran otomatis.</span>
      </RouterLink>
    </section>

    <!-- plan aktif -->
    <div v-if="auth.subscription" class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs uppercase tracking-wide opacity-60">Paket Aktif</p>
      <p class="mt-1 text-lg font-medium">{{ auth.subscription.plan_name ?? '—' }}</p>
      <p class="text-sm opacity-70">Sisa {{ daysLeft(auth.subscription.ends_at) }} hari lagi</p>
    </div>

    <p v-if="isLoading" class="text-sm opacity-60">Memuat…</p>
    <div v-else-if="isError" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      Gagal memuat data undangan: {{ error?.response?.data?.message || error?.message || 'terjadi kesalahan.' }}
    </div>
    <div v-else-if="!data?.data?.length" class="rounded-2xl border border-slate-200 bg-white p-4 text-sm opacity-70 dark:border-slate-800 dark:bg-slate-900">
      Belum ada undangan atas akun ini.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <article
        v-for="inv in data.data" :key="inv.id"
        class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg">{{ inv.groom_name }} &amp; {{ inv.bride_name }}</h3>
          <span
            class="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
            :class="{
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300': inv.status === 'published',
              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300': inv.status === 'draft',
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400': inv.status === 'archived',
            }"
          >{{ STATUS_LABEL[inv.status] ?? inv.status }}</span>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div class="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-800">
            <strong class="block text-lg">{{ stats[inv.id]?.guests ?? '…' }}</strong>
            <span class="opacity-60">Tamu</span>
          </div>
          <div class="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-800">
            <strong class="block text-lg">{{ stats[inv.id]?.rsvpTotal ?? '…' }}</strong>
            <span class="opacity-60">RSVP</span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <a class="rounded-full border border-slate-200 px-3 py-1.5 dark:border-slate-700" :href="viewUrl(inv)" target="_blank" rel="noopener">
            {{ inv.status === 'published' ? 'Lihat' : 'Pratinjau' }}
          </a>
          <button class="rounded-full border border-slate-200 px-3 py-1.5 dark:border-slate-700" @click="copy(`${location.origin}${viewUrl(inv)}`, `share${inv.id}`)">
            {{ copied === `share${inv.id}` ? 'Tersalin ✓' : 'Salin link' }}
          </button>
          <a class="rounded-full border border-emerald-300 px-3 py-1.5 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400" :href="shareHref(inv)" target="_blank" rel="noopener">
            Bagikan WhatsApp
          </a>
          <RouterLink class="rounded-full border border-slate-200 px-3 py-1.5 dark:border-slate-700" to="/dashboard/undangan">
            Kelola tamu &amp; RSVP
          </RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>
