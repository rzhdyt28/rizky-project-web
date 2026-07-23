<script setup>
import { ref } from 'vue';
import { api } from '../../../shared/api/client';

const cases = ref([]);
const loading = ref(true);

async function load() {
  loading.value = true;
  const { data } = await api.get('/api/skripsi/cases');
  cases.value = data;
  loading.value = false;
}
load();

async function removeCase(id) {
  await api.delete(`/api/skripsi/cases/${id}`);
  await load();
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/skripsi/dashboard" class="text-sm text-slate-500 hover:text-slate-700">&larr; Dashboard</router-link>
        <h1 class="text-lg font-semibold text-slate-800">Semua Studi Kasus SAW</h1>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <div v-for="c in cases" :key="c.id" class="p-4 flex items-center justify-between">
          <router-link :to="`/skripsi/saw/${c.id}`" class="text-slate-700 hover:text-indigo-600 font-medium">{{ c.title }}</router-link>
          <button @click="removeCase(c.id)" class="text-sm text-red-500 hover:underline">Hapus</button>
        </div>
        <div v-if="!loading && cases.length === 0" class="p-8 text-center text-sm text-slate-400">
          Belum ada studi kasus.
          <router-link to="/skripsi/dashboard" class="text-indigo-600 hover:underline">Buat di dashboard</router-link>.
        </div>
      </div>
    </div>
  </main>
</template>
