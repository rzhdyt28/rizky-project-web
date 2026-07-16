<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../../shared/stores/auth';

const auth = useAuthStore();
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
    router.push(route.query.redirect || '/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal masuk. Periksa email/password.';
  } finally { busy.value = false; }
}
</script>

<template>
  <main class="auth">
    <form @submit.prevent="submit">
      <h1>Masuk</h1>
      <p v-if="error" class="err">{{ error }}</p>
      <input v-model="email" type="email" required placeholder="Email" autocomplete="email" />
      <input v-model="password" type="password" required placeholder="Password" autocomplete="current-password" />
      <button :disabled="busy">{{ busy ? 'Memproses…' : 'Masuk' }}</button>
    </form>
  </main>
</template>

<style scoped>
.auth { min-height: 100vh; display: grid; place-items: center; background: #F7F4EC; font-family: Jost, sans-serif; }
form { background: #fff; border: 1px solid rgba(47,74,60,.2); padding: 2.5rem; width: min(360px, 90vw); display: grid; gap: .9rem; }
h1 { font-family: 'Cormorant Garamond', serif; text-align: center; }
input { padding: .75rem 1rem; border: 1px solid rgba(34,48,31,.25); font: inherit; }
button { padding: .8rem; background: #2F4A3C; color: #F7F4EC; border: 0; cursor: pointer;
  letter-spacing: .12em; text-transform: uppercase; font-size: .72rem; }
.err { color: #a33; font-size: .85rem; }
</style>
