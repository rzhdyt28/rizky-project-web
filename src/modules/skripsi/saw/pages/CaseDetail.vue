<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../../../../shared/api/client';

const route = useRoute();
const router = useRouter();
const caseId = route.params.id;

const title = ref('');
const alternativeLabel = ref('Alternatif');
const description = ref('');
const showDescription = ref(true);
const editingDescription = ref(false);
const descriptionDraft = ref('');

const criteria = ref([]);
const alternatives = ref([]);
const result = ref(null);
const calculatedAt = ref(null);
const busy = ref(false);
const error = ref('');

const newCriterion = reactive({ name: '', weight: 1, type: 'benefit' });
const newAlternative = ref('');

/** value[alternativeId][criterionId] = nilai matriks, disinkron dari load(). */
const values = reactive({});

function scoreOf(alternative, criterionId) {
  return values[alternative.id]?.[criterionId] ?? '';
}

async function load() {
  const { data } = await api.get(`/api/skripsi/cases/${caseId}`);
  title.value = data.title;
  alternativeLabel.value = data.alternative_label || 'Alternatif';
  description.value = data.description || '';
  showDescription.value = data.show_description;
  criteria.value = data.criteria;
  alternatives.value = data.alternatives;
  result.value = data.result_snapshot;
  calculatedAt.value = data.calculated_at;

  for (const alt of data.alternatives) {
    values[alt.id] = {};
    for (const s of alt.scores || []) values[alt.id][s.criterion_id] = s.value;
  }
}
load();

function startEditDescription() {
  descriptionDraft.value = description.value;
  editingDescription.value = true;
}

async function saveDescription() {
  await api.put(`/api/skripsi/cases/${caseId}`, { description: descriptionDraft.value });
  description.value = descriptionDraft.value;
  editingDescription.value = false;
}

async function toggleShowDescription() {
  showDescription.value = !showDescription.value;
  await api.put(`/api/skripsi/cases/${caseId}`, { show_description: showDescription.value });
}

async function addCriterion() {
  if (!newCriterion.name.trim()) return;
  await api.post(`/api/skripsi/cases/${caseId}/criteria`, { ...newCriterion });
  newCriterion.name = ''; newCriterion.weight = 1; newCriterion.type = 'benefit';
  await load();
}

async function removeCriterion(id) {
  await api.delete(`/api/skripsi/cases/${caseId}/criteria/${id}`);
  await load();
}

async function addAlternative() {
  if (!newAlternative.value.trim()) return;
  await api.post(`/api/skripsi/cases/${caseId}/alternatives`, { name: newAlternative.value });
  newAlternative.value = '';
  await load();
}

async function removeAlternative(id) {
  await api.delete(`/api/skripsi/cases/${caseId}/alternatives/${id}`);
  await load();
}

async function saveScore(alternativeId, criterionId, value) {
  if (value === '' || value === null) return;
  await api.put(`/api/skripsi/cases/${caseId}/alternatives/${alternativeId}/scores`, {
    criterion_id: criterionId,
    value: Number(value),
  });
}

const canCalculate = computed(() => criteria.value.length > 0 && alternatives.value.length > 0);

async function calculate() {
  busy.value = true; error.value = '';
  try {
    const { data } = await api.post(`/api/skripsi/cases/${caseId}/calculate`);
    result.value = data.result;
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal menghitung.';
  } finally { busy.value = false; }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="router.push('/skripsi/dashboard')" class="text-sm text-slate-500 hover:text-slate-700">&larr; Dashboard</button>
        <router-link to="/skripsi/algoritma/saw" class="text-sm text-indigo-600 hover:underline">Cara kerja SAW</router-link>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 class="text-2xl font-semibold text-slate-800">{{ title }} <span class="text-sm font-normal text-slate-400">(SAW)</span></h1>

      <!-- Penjelasan -->
      <section class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-indigo-900 uppercase tracking-wide">Penjelasan</h2>
          <div class="flex items-center gap-3 text-sm">
            <button @click="toggleShowDescription" class="text-indigo-600 hover:underline">
              {{ showDescription ? 'Sembunyikan' : 'Tampilkan' }}
            </button>
            <button v-if="showDescription && !editingDescription" @click="startEditDescription" class="text-indigo-600 hover:underline">
              Edit
            </button>
          </div>
        </div>

        <template v-if="showDescription">
          <textarea v-if="editingDescription" v-model="descriptionDraft" rows="6"
            class="mt-3 w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          <p v-else class="mt-3 text-sm text-indigo-900 whitespace-pre-line">{{ description }}</p>

          <div v-if="editingDescription" class="mt-3 flex gap-2">
            <button @click="saveDescription" class="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 hover:bg-indigo-700">Simpan</button>
            <button @click="editingDescription = false" class="text-sm text-slate-500 hover:text-slate-700">Batal</button>
          </div>
        </template>
      </section>

      <!-- Kriteria -->
      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">1. Kriteria</h2>
        <form @submit.prevent="addCriterion" class="flex flex-wrap gap-2 mb-4">
          <input v-model="newCriterion.name" placeholder="Nama kriteria" required
            class="flex-1 min-w-[140px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model.number="newCriterion.weight" type="number" step="0.01" min="0" placeholder="Bobot" required
            class="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select v-model="newCriterion.type"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
          <button class="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700">Tambah</button>
        </form>
        <ul class="divide-y divide-slate-100">
          <li v-for="c in criteria" :key="c.id" class="py-2 flex items-center justify-between text-sm">
            <span class="text-slate-700">{{ c.name }} — bobot {{ c.weight }} <span class="text-slate-400">({{ c.type }})</span></span>
            <button @click="removeCriterion(c.id)" class="text-red-500 hover:underline">Hapus</button>
          </li>
        </ul>
      </section>

      <!-- Alternatif (label kustom) -->
      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">2. {{ alternativeLabel }}</h2>
        <form @submit.prevent="addAlternative" class="flex gap-2 mb-4">
          <input v-model="newAlternative" :placeholder="`Nama ${alternativeLabel.toLowerCase()}`" required
            class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button class="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700">Tambah</button>
        </form>
        <ul class="divide-y divide-slate-100">
          <li v-for="a in alternatives" :key="a.id" class="py-2 flex items-center justify-between text-sm">
            <span class="text-slate-700">{{ a.name }}</span>
            <button @click="removeAlternative(a.id)" class="text-red-500 hover:underline">Hapus</button>
          </li>
        </ul>
      </section>

      <!-- Matriks -->
      <section v-if="criteria.length && alternatives.length" class="bg-white rounded-2xl border border-slate-200 p-6 overflow-x-auto">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">3. Matriks Nilai</h2>
        <table class="matrix w-full text-sm border-collapse">
          <thead>
            <tr>
              <th class="text-left border-b border-slate-200 py-2 pr-3">{{ alternativeLabel }}</th>
              <th v-for="c in criteria" :key="c.id" class="text-center border-b border-slate-200 py-2 px-3">{{ c.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in alternatives" :key="a.id">
              <td class="py-2 pr-3 text-slate-700">{{ a.name }}</td>
              <td v-for="c in criteria" :key="c.id" class="py-2 px-3 text-center">
                <input
                  type="number"
                  step="any"
                  :value="scoreOf(a, c.id)"
                  @change="e => { values[a.id][c.id] = e.target.value; saveScore(a.id, c.id, e.target.value); }"
                  class="w-24 rounded-lg border border-slate-300 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Hasil -->
      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">4. Hasil</h2>
        <p v-if="error" class="text-sm text-red-600 mb-3">{{ error }}</p>
        <button :disabled="!canCalculate || busy" @click="calculate"
          class="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-50">
          {{ busy ? 'Menghitung…' : 'Hitung Ranking' }}
        </button>
        <p v-if="calculatedAt" class="text-xs text-slate-400 mt-2">Terakhir dihitung: {{ new Date(calculatedAt).toLocaleString() }}</p>

        <table v-if="result?.length" class="ranking w-full text-sm border-collapse mt-4">
          <thead>
            <tr>
              <th class="text-left border-b border-slate-200 py-2">Peringkat</th>
              <th class="text-left border-b border-slate-200 py-2">{{ alternativeLabel }}</th>
              <th class="text-left border-b border-slate-200 py-2">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in result" :key="r.alternative_id" :class="r.rank === 1 ? 'bg-indigo-50 font-semibold' : ''">
              <td class="py-2">{{ r.rank }}</td>
              <td class="py-2">{{ r.name }}</td>
              <td class="py-2">{{ r.score }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>
