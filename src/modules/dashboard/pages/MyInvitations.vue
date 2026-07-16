<script setup>
import { useMyInvitations } from '../../invitation/composables/useInvitation';
import { useAuthStore } from '../../../shared/stores/auth';

const auth = useAuthStore();
const { data, isLoading } = useMyInvitations();
</script>

<template>
  <main class="dash">
    <header>
      <h1>Dashboard</h1>
      <div>
        <span>{{ auth.user?.name }}</span>
        <button @click="auth.logout().then(() => $router.push('/'))">Keluar</button>
      </div>
    </header>

    <section>
      <h2>Undangan Saya</h2>
      <p v-if="isLoading">Memuat…</p>
      <p v-else-if="!data?.data?.length">Belum ada undangan. (Editor pembuatan undangan = pengembangan berikutnya.)</p>
      <ul v-else>
        <li v-for="inv in data.data" :key="inv.id">
          <strong>{{ inv.groom_name }} &amp; {{ inv.bride_name }}</strong>
          — <code>/{{ inv.slug }}</code> — {{ inv.status }}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.dash { max-width: 860px; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: Jost, sans-serif; }
header { display: flex; justify-content: space-between; align-items: center; }
h1, h2 { font-family: 'Cormorant Garamond', serif; }
h2 { margin: 2rem 0 .75rem; }
button { margin-left: 1rem; border: 1px solid #2F4A3C; background: none; padding: .35rem .9rem; cursor: pointer; }
li { padding: .6rem 0; border-bottom: 1px dashed rgba(34,48,31,.2); }
</style>
