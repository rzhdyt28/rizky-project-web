<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSkripsiAuthStore } from '../stores/auth';

const auth = useSkripsiAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nim: '',
  universitas: '',
  jurusan: '',
  angkatan: '',
  dosen_pembimbing: '',
});
const error = ref('');
const busy = ref(false);

async function submit() {
  busy.value = true; error.value = '';
  try {
    await auth.register({ ...form.value });
    router.push('/skripsi/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal mendaftar. Periksa isian Anda.';
  } finally { busy.value = false; }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
    <form @submit.prevent="submit" class="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold text-slate-800">Daftar Akun Skripsi</h1>
        <p class="text-sm text-slate-500">Isi data diri untuk mulai membuat studi kasus SPK/ML.</p>
      </div>

      <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{{ error }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-slate-700">Nama Lengkap</span>
          <input v-model="form.name" type="text" required autocomplete="name"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-slate-700">Email</span>
          <input v-model="form.email" type="email" required autocomplete="email"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">NIM</span>
          <input v-model="form.nim" type="text" required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Angkatan</span>
          <input v-model="form.angkatan" type="text" placeholder="mis. 2022"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-slate-700">Universitas</span>
          <input v-model="form.universitas" type="text" required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Jurusan</span>
          <input v-model="form.jurusan" type="text" required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Dosen Pembimbing</span>
          <input v-model="form.dosen_pembimbing" type="text" placeholder="Opsional"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-slate-700">Password</span>
          <input v-model="form.password" type="password" required autocomplete="new-password" placeholder="Min. 8 karakter"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-slate-700">Ulangi Password</span>
          <input v-model="form.password_confirmation" type="password" required autocomplete="new-password"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>
      </div>

      <button :disabled="busy" type="submit"
        class="w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60">
        {{ busy ? 'Memproses…' : 'Daftar' }}
      </button>

      <p class="text-center text-sm text-slate-500">
        Sudah punya akun?
        <router-link to="/skripsi/login" class="text-indigo-600 font-medium hover:underline">Masuk</router-link>
      </p>
    </form>
  </main>
</template>
