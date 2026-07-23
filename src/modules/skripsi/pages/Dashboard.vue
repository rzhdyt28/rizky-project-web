<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../../shared/api/client';
import { useSkripsiAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useSkripsiAuthStore();

const user = ref(null);
const totalCases = ref(0);
const recentCases = ref([]);
const loading = ref(true);

const showNewCaseForm = ref(false);
const newTitle = ref('');
const newAlternativeLabel = ref('');
const busy = ref(false);

async function load() {
  loading.value = true;
  const { data } = await api.get('/api/skripsi/dashboard');
  user.value = data.user;
  totalCases.value = data.total_cases;
  recentCases.value = data.recent_cases;
  loading.value = false;
}
load();

async function createCase() {
  if (!newTitle.value.trim()) return;
  busy.value = true;
  try {
    const { data } = await api.post('/api/skripsi/cases', {
      title: newTitle.value,
      alternative_label: newAlternativeLabel.value || undefined,
    });
    router.push(`/skripsi/saw/${data.id}`);
  } finally { busy.value = false; }
}

async function logout() {
  await auth.logout();
  router.push('/skripsi/login');
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-lg font-semibold text-slate-800">Skripsi — Dashboard</h1>
        <div class="flex items-center gap-4">
          <router-link to="/skripsi/algoritma/saw" class="text-sm text-indigo-600 hover:underline">Panduan Algoritma SAW</router-link>
          <button @click="logout" class="text-sm text-slate-500 hover:text-slate-700">Keluar</button>
        </div>
      </div>
    </header>

    <div v-if="!loading" class="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <!-- Sambutan -->
      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="text-xl font-semibold text-slate-800">Halo, {{ user.name }} 👋</h2>
        <dl class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><dt class="text-slate-400">NIM</dt><dd class="text-slate-700 font-medium">{{ user.nim || '—' }}</dd></div>
          <div><dt class="text-slate-400">Universitas</dt><dd class="text-slate-700 font-medium">{{ user.universitas || '—' }}</dd></div>
          <div><dt class="text-slate-400">Jurusan</dt><dd class="text-slate-700 font-medium">{{ user.jurusan || '—' }}</dd></div>
          <div><dt class="text-slate-400">Dosen Pembimbing</dt><dd class="text-slate-700 font-medium">{{ user.dosen_pembimbing || '—' }}</dd></div>
        </dl>
      </section>

      <!-- Ringkasan -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <p class="text-sm text-slate-400">Total Studi Kasus</p>
          <p class="text-3xl font-semibold text-slate-800 mt-1">{{ totalCases }}</p>
        </div>
        <div class="sm:col-span-2 bg-indigo-600 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p class="text-indigo-100 text-sm">Mulai analisis baru</p>
            <p class="text-white font-semibold">Buat Studi Kasus SAW</p>
          </div>
          <button @click="showNewCaseForm = !showNewCaseForm"
            class="bg-white text-indigo-600 font-medium rounded-lg px-4 py-2 text-sm hover:bg-indigo-50 transition">
            {{ showNewCaseForm ? 'Batal' : '+ Buat Baru' }}
          </button>
        </div>
      </section>

      <!-- Form buat studi kasus baru -->
      <section v-if="showNewCaseForm" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 class="font-medium text-slate-800">Studi Kasus Baru</h3>
        <form @submit.prevent="createCase" class="grid sm:grid-cols-2 gap-4">
          <label class="block sm:col-span-2">
            <span class="text-sm font-medium text-slate-700">Judul Studi Kasus</span>
            <input v-model="newTitle" required placeholder="mis. Pemilihan Karyawan Terbaik"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-medium text-slate-700">Sebutan pengganti "Alternatif"</span>
            <input v-model="newAlternativeLabel" placeholder='Opsional, mis. "Karyawan", "Supplier", "Produk"'
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span class="text-xs text-slate-400">Kosongkan untuk pakai "Alternatif" (default).</span>
          </label>
          <button :disabled="busy" type="submit"
            class="sm:col-span-2 rounded-lg bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60">
            {{ busy ? 'Membuat…' : 'Buat & Mulai Isi Data' }}
          </button>
        </form>
      </section>

      <!-- Studi kasus terbaru -->
      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-slate-800">Studi Kasus Terbaru</h3>
          <router-link to="/skripsi/cases" class="text-sm text-indigo-600 hover:underline">Lihat semua</router-link>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-for="c in recentCases" :key="c.id" class="py-3 flex items-center justify-between">
            <router-link :to="`/skripsi/saw/${c.id}`" class="text-slate-700 hover:text-indigo-600 font-medium">{{ c.title }}</router-link>
            <span class="text-xs text-slate-400">{{ c.calculated_at ? 'Sudah dihitung' : 'Belum dihitung' }}</span>
          </li>
          <li v-if="recentCases.length === 0" class="py-6 text-center text-sm text-slate-400">
            Belum ada studi kasus. Buat yang pertama di atas.
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>
