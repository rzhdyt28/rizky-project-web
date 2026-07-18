<script setup>
import SectionWrapper from '../ui/SectionWrapper.vue';

defineProps({
  invitation: { type: Object, required: true },
});
</script>

<template>
  <SectionWrapper>
    <p class="c-couple__eyebrow mb-2 text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">
      Bismillahirrahmanirrahim
    </p>
    <p class="mx-auto mb-6 max-w-md text-sm italic" :style="{ fontFamily: 'var(--t-font-head)' }">
      {{ invitation.opening_text || 'Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.' }}
    </p>
    <div class="grid gap-3">
      <div>
        <h2 class="c-couple__name text-2xl" :style="{ fontFamily: 'var(--t-font-head)' }">{{ invitation.groom_name }}</h2>
        <p v-if="invitation.groom_parents" class="text-sm">Putra dari {{ invitation.groom_parents }}</p>
      </div>
      <div class="c-couple__amp text-2xl italic" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-gold)' }">&amp;</div>
      <div>
        <h2 class="c-couple__name text-2xl" :style="{ fontFamily: 'var(--t-font-head)' }">{{ invitation.bride_name }}</h2>
        <p v-if="invitation.bride_parents" class="text-sm">Putri dari {{ invitation.bride_parents }}</p>
      </div>
    </div>
  </SectionWrapper>
</template>
