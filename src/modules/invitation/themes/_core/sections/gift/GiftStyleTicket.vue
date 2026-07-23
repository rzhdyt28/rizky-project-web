<script setup>
/** Hadiah Digital -- gaya "ticket": kartu ala tiket sobek (garis putus-putus + notch kiri-kanan), sama pola dengan Acara/Ticket. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  gifts:  { type: Array, default: () => [] },
  copied: { type: [String, Number], default: null },
});
defineEmits(['copy']);
</script>

<template>
  <div class="mx-auto grid max-w-sm gap-4">
    <div v-for="g in gifts" :key="g.id" class="text-sm text-center c-gift__ticket">
      <div class="c-gift__ticket-notch c-gift__ticket-notch--l" aria-hidden="true" />
      <div class="c-gift__ticket-notch c-gift__ticket-notch--r" aria-hidden="true" />

      <template v-if="g.type === 'address'">
        <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">Alamat Pengiriman</h4>
        <p class="mt-1" :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.shipping_address }}</p>
      </template>
      <template v-else-if="g.type === 'qris'">
        <h4 class="mb-2 text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">QRIS</h4>
        <img v-if="g.qris_image" :src="assetUrl(g.qris_image)" alt="QRIS" class="mx-auto w-40" loading="lazy" />
      </template>
      <template v-else>
        <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">{{ g.provider }}</h4>
        <p class="text-lg tracking-[0.1em]" :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.account_number }}</p>
        <p :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">a.n. {{ g.account_name }}</p>
        <button
          class="mt-2 cursor-pointer border px-3 py-1 text-[10px] uppercase tracking-widest"
          :style="{ borderColor: 'var(--t-accent)', color: 'var(--t-accent)', background: 'transparent' }"
          @click="$emit('copy', g.account_number, g.id)"
        >{{ copied === g.id ? 'Tersalin ✓' : 'Salin nomor' }}</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.c-gift__ticket {
  position: relative;
  padding: 1.25rem;
  border: 1.5px dashed color-mix(in srgb, var(--t-accent) 45%, transparent);
  border-radius: 0.9rem;
  background: var(--t-paper);
}
.c-gift__ticket-notch {
  position: absolute;
  top: 50%;
  width: 1.1rem; height: 1.1rem;
  background: var(--page-bg, #fff);
  border-radius: 50%;
  transform: translateY(-50%);
}
.c-gift__ticket-notch--l { left: -0.6rem; }
.c-gift__ticket-notch--r { right: -0.6rem; }
</style>
