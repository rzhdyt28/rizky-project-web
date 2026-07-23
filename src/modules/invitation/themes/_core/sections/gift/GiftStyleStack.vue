<script setup>
/** Hadiah Digital -- gaya "stack": daftar padat satu baris per kado, ikon bulat jenis kado di kiri. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  gifts:  { type: Array, default: () => [] },
  copied: { type: [String, Number], default: null },
});
defineEmits(['copy']);

const ICONS = { address: '📦', qris: '🔳', bank: '🏦' };
function iconFor(g) { return ICONS[g.type] ?? '🎁'; }
</script>

<template>
  <div class="mx-auto grid max-w-sm gap-2">
    <div v-for="g in gifts" :key="g.id" class="flex items-start gap-3 py-3 c-gift__stack-row">
      <span class="c-gift__icon">{{ iconFor(g) }}</span>
      <div class="flex-1 text-sm text-left">
        <template v-if="g.type === 'address'">
          <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">Alamat Pengiriman</h4>
          <p :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.shipping_address }}</p>
        </template>
        <template v-else-if="g.type === 'qris'">
          <h4 class="mb-2 text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">QRIS</h4>
          <img v-if="g.qris_image" :src="assetUrl(g.qris_image)" alt="QRIS" class="w-32" loading="lazy" />
        </template>
        <template v-else>
          <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">{{ g.provider }}</h4>
          <p class="tracking-[0.1em]" :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.account_number }} &middot; a.n. {{ g.account_name }}</p>
          <button
            class="mt-1 cursor-pointer border px-3 py-1 text-[10px] uppercase tracking-widest"
            :style="{ borderColor: 'var(--t-accent)', color: 'var(--t-accent)', background: 'transparent' }"
            @click="$emit('copy', g.account_number, g.id)"
          >{{ copied === g.id ? 'Tersalin ✓' : 'Salin nomor' }}</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-gift__stack-row + .c-gift__stack-row { border-top: 1px solid color-mix(in srgb, var(--t-accent) 15%, transparent); }
.c-gift__icon { flex-shrink: 0; font-size: 1.5rem; line-height: 1; }
</style>
