<script setup>
/**
 * _CORE / Turut Mengundang — kini TERBAGI:
 * - Tamu SPESIAL: blok kehormatan di paling atas (konvensi umum undangan:
 *   tamu kehormatan dibaca lebih dulu).
 * - Pihak PRIA & Pihak WANITA: 2 kolom di desktop, BERTUMPUK penuh-lebar
 *   di HP (dua kolom sempit berisi nama panjang sulit dibaca di layar HP).
 * Kompatibel data lama: entri string dinormalisasi backend jadi
 * { name, side: 'pria' }.
 */
import { computed } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';

const props = defineProps({
  coHosts: { type: Array, default: () => [] },
  labels:  { type: Object, required: true },
});

/* Normalisasi ganda (jaga-jaga bila data mentah string lolos dari backend). */
const items = computed(() =>
  (props.coHosts ?? []).map((it) =>
    typeof it === 'string' ? { name: it, side: 'pria' } : { side: 'pria', ...it }
  ).filter((it) => it.name)
);

const spesial = computed(() => items.value.filter((it) => it.side === 'spesial'));
const pria    = computed(() => items.value.filter((it) => it.side === 'pria'));
const wanita  = computed(() => items.value.filter((it) => it.side === 'wanita'));
</script>

<template>
  <SectionWrapper v-if="items.length" :title="labels.title_co_host">
    <!-- TAMU SPESIAL — blok kehormatan di atas -->
    <div v-if="spesial.length" class="max-w-sm mx-auto c-cohost__special mb-7">
      <p class="c-cohost__special-label mb-2 text-[10px] uppercase tracking-[0.3em]">
        Tamu Kehormatan
      </p>
      <ul class="grid gap-1.5">
        <li v-for="(it, i) in spesial" :key="`s-${i}`" class="c-cohost__special-name">
          {{ it.name }}
        </li>
      </ul>
    </div>

    <!-- PIHAK PRIA & WANITA — 2 kolom desktop, bertumpuk di HP -->
    <div
      v-if="pria.length || wanita.length"
      class="grid max-w-lg mx-auto c-cohost__cols gap-7 sm:grid-cols-2 sm:gap-6"
    >
      <div v-if="pria.length" class="c-cohost__col">
        <h4 class="c-cohost__side mb-2 text-xs uppercase tracking-[0.22em]">
          Pihak Mempelai Pria
        </h4>
        <ul class="grid gap-1.5">
          <li v-for="(it, i) in pria" :key="`p-${i}`" class="c-cohost__name">{{ it.name }}</li>
        </ul>
      </div>
      <div v-if="wanita.length" class="c-cohost__col">
        <h4 class="c-cohost__side mb-2 text-xs uppercase tracking-[0.22em]">
          Pihak Mempelai Wanita
        </h4>
        <ul class="grid gap-1.5">
          <li v-for="(it, i) in wanita" :key="`w-${i}`" class="c-cohost__name">{{ it.name }}</li>
        </ul>
      </div>
    </div>
  </SectionWrapper>
</template>

<style scoped>
/* ===== DEFAULT NETRAL — tema bebas menimpa lewat class hook c-cohost__* ===== */
.c-cohost__special {
  padding: 0.9rem 1.1rem;
  border-radius: 0.8rem;
  border: 1px solid color-mix(in srgb, var(--t-gold, #b08d4a) 55%, transparent);
  background: color-mix(in srgb, var(--t-gold, #b08d4a) 8%, transparent);
}
.c-cohost__special-label { color: var(--t-gold, #b08d4a); }
.c-cohost__special-name  { font-family: var(--t-font-head, serif); font-size: 1.05rem; color: var(--t-accent); }
.c-cohost__side { color: var(--t-gold, #b08d4a); }
.c-cohost__name { font-family: var(--t-font-head, serif); font-size: 1rem; }
</style>
