<script setup>
/** Section 11 — Turut Mengundang (Premium+). Mutator array co_hosts hidup
 * di sini karena murni lokal ke section ini. */
import SectionDisplayFields from '../SectionDisplayFields.vue';

const props = defineProps({
  form: { type: Object, required: true },
  invitationId: { type: [Number, String], required: true },
});

function addCoHost() { props.form.co_hosts.push({ name: '', side: 'pria' }); }
function removeCoHost(i) { props.form.co_hosts.splice(i, 1); }
</script>

<template>
  <details class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <summary class="cursor-pointer font-medium">11 — Section Turut Mengundang (Premium+)</summary>
    <div class="mt-3 grid gap-2">
      <div v-for="(c, i) in form.co_hosts" :key="i" class="grid grid-cols-[1fr_auto_auto] items-center gap-2">
        <input v-model="c.name" class="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="mis. Kel. Besar Bpk. H. Ahmad" />
        <select v-model="c.side" class="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="pria">Pihak Pria</option>
          <option value="wanita">Pihak Wanita</option>
          <option value="spesial">Tamu Spesial</option>
        </select>
        <button type="button" class="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400" @click="removeCoHost(i)">Hapus</button>
      </div>
      <button type="button" class="w-fit rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700" @click="addCoHost">+ Tambah nama</button>
    </div>
    <SectionDisplayFields class="mt-3" :section="form.theme_options.sections.co_host" :invitation-id="invitationId" />
  </details>
</template>
