<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const { data, isLoading, isError } = useQuery({
  queryKey: ['agent-stats'],
  queryFn: async () => (await api.get('/api/agent-monitoring/stats')).data,
  refetchInterval: 60_000,
});
</script>

<template>
  <main class="agent">
    <h1>Auto Apply Agent</h1>
    <p v-if="isLoading">Memuat…</p>
    <p v-else-if="isError">Data agent belum tersedia (cek sinkronisasi AGENT_DB_PATH).</p>
    <template v-else>
      <div class="stats">
        <div class="stat"><span>{{ data.total }}</span>Total lamaran</div>
        <div class="stat"><span>{{ data.scam_blocked }}</span>Scam diblokir</div>
        <div class="stat"><span>{{ data.avg_match }}%</span>Rata-rata match</div>
      </div>
      <h2>Per platform</h2>
      <ul><li v-for="(n, p) in data.by_platform" :key="p">{{ p }}: {{ n }}</li></ul>
      <h2>Run terakhir</h2>
      <ul><li v-for="r in data.last_runs" :key="r.id">{{ r.platform }} — {{ r.jobs_found }} lowongan</li></ul>
    </template>
  </main>
</template>

<style scoped>
.agent { max-width: 860px; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: Jost, sans-serif; }
h1, h2 { font-family: 'Cormorant Garamond', serif; } h2 { margin-top: 1.5rem; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1rem; }
.stat { background: #fff; border: 1px solid rgba(47,74,60,.2); padding: 1.25rem; }
.stat span { display: block; font-size: 1.8rem; font-weight: 500; color: #2F4A3C; }
</style>
