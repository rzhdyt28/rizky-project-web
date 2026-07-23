<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSkripsiAuthStore } from '../stores/auth';

const auth = useSkripsiAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const busy = ref(false);

async function submit() {
  busy.value = true; error.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push(route.query.redirect || '/skripsi/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal masuk. Periksa email/password.';
  } finally { busy.value = false; }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <form @submit.prevent="submit" class="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold text-slate-800">Masuk — Skripsi</h1>
        <p class="text-sm text-slate-500">Akses studi kasus SPK/ML Anda.</p>
      </div>

      <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{{ error }}</p>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input v-model="email" type="email" required autocomplete="email"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Password</span>
        <input v-model="password" type="password" required autocomplete="current-password"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </label>

      <button :disabled="busy" type="submit"
        class="w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60">
        {{ busy ? 'Memproses…' : 'Masuk' }}
      </button>

      <p class="text-center text-sm text-slate-500">
        Belum punya akun?
        <router-link to="/skripsi/register" class="text-indigo-600 font-medium hover:underline">Daftar</router-link>
      </p>
    </form>
  </main>
</template>
