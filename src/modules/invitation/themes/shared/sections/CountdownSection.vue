<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';

const props = defineProps({
  event: { type: Object, default: null },
  bg:    { type: Object, default: null },
});

const now = ref(Date.now());
const timer = setInterval(() => (now.value = Date.now()), 1000);
onBeforeUnmount(() => clearInterval(timer));

const parts = computed(() => {
  const target = props.event ? new Date(props.event.starts_at).getTime() : 0;
  let diff = Math.max(0, Math.floor((target - now.value) / 1000));
  const d = Math.floor(diff / 86400); diff -= d * 86400;
  const h = Math.floor(diff / 3600);  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;
  return [
    { num: d, lbl: 'Hari' }, { num: h, lbl: 'Jam' },
    { num: m, lbl: 'Menit' }, { num: s, lbl: 'Detik' },
  ];
});
</script>

<template>
  <SectionWrapper v-if="event" :bg="bg">
    <p class="mb-3 text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">
      Menuju hari bahagia
    </p>
    <div class="flex justify-center gap-3">
      <div
        v-for="p in parts" :key="p.lbl"
        class="min-w-[60px] px-3 py-2"
        :style="{ background: 'color-mix(in srgb, var(--t-accent) 8%, transparent)' }"
      >
        <div class="text-2xl" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-accent)' }">
          {{ String(p.num).padStart(2, '0') }}
        </div>
        <div class="text-[9px] uppercase tracking-widest opacity-70">{{ p.lbl }}</div>
      </div>
    </div>
  </SectionWrapper>
</template>
