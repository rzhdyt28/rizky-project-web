<script setup>
/**
 * Shell dashboard pelanggan — sidebar nav + topbar (toggle gelap/terang +
 * logout) + <router-view> untuk tiap halaman. Item menu yang fiturnya belum
 * dibangun (Fase 2+) ditandai `soon: true` — tampil tapi non-klik, supaya
 * struktur menu penuh terlihat dari awal.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../shared/stores/auth';
import { useThemeStore } from '../../../shared/stores/theme';

const auth = useAuthStore();
const theme = useThemeStore();
const router = useRouter();

const sidebarOpen = ref(false);

const MENU = [
  { icon: '📊', label: 'Beranda', to: '/dashboard' },
  { icon: '💌', label: 'Undangan Saya', to: '/dashboard/undangan' },
  { icon: '✏️', label: 'Edit Undangan', to: '/dashboard/edit' },
  { icon: '👥', label: 'Tamu', to: '/dashboard/tamu' },
  { icon: '📅', label: 'Acara', to: '/dashboard/acara' },
  { icon: '📖', label: 'Kisah Cinta', to: '/dashboard/kisah-cinta' },
  { icon: '🖼️', label: 'Galeri Foto', to: '/dashboard/galeri' },
  { icon: '🎁', label: 'Kado Digital', to: '/dashboard/kado' },
  { icon: '📬', label: 'RSVP', to: '/dashboard/rsvp' },
  { icon: '💬', label: 'Ucapan & Doa', to: '/dashboard/ucapan' },
  { icon: '⚙️', label: 'Akun & Langganan', soon: true },
];

async function logout() {
  await auth.logout();
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <!-- overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-slate-200 bg-white p-5 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
    >
      <div class="mb-8 flex items-center gap-2 px-1">
        <span class="text-xl">💍</span>
        <span class="font-serif text-lg" style="font-family: 'Cormorant Garamond', serif">Dashboard</span>
      </div>

      <nav class="flex flex-col gap-1">
        <template v-for="item in MENU" :key="item.label">
          <RouterLink
            v-if="!item.soon"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
            active-class="bg-slate-100 font-medium dark:bg-slate-800"
            @click="sidebarOpen = false"
          >
            <span>{{ item.icon }}</span>{{ item.label }}
          </RouterLink>
          <span
            v-else
            class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 dark:text-slate-600"
            title="Segera hadir"
          >
            <span class="opacity-50">{{ item.icon }}</span>{{ item.label }}
            <span class="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide dark:bg-slate-800">Segera</span>
          </span>
        </template>
      </nav>
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
        <button class="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" @click="sidebarOpen = true" aria-label="Buka menu">
          ☰
        </button>
        <div class="hidden text-sm opacity-70 lg:block">Halo, {{ auth.user?.name }}</div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
            @click="theme.toggle()"
            :aria-label="theme.isDark ? 'Mode terang' : 'Mode gelap'"
          >
            {{ theme.isDark ? '☀️' : '🌙' }}
          </button>
          <button
            class="rounded-full border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
            @click="logout"
          >Keluar</button>
        </div>
      </header>

      <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
