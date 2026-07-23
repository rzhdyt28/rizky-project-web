<script setup>
/** Hadiah Digital -- gaya "panel" (default, perilaku lama): kartu bertepi putus-putus, bertumpuk. */
import { assetUrl } from '../../../../composables/assets';

defineProps({
  gifts:  { type: Array, default: () => [] },
  copied: { type: [String, Number], default: null },
});
defineEmits(['copy']);
</script>

<template>
  <div class="mx-auto grid max-w-sm gap-3">
    <div
      v-for="g in gifts" :key="g.id"
      class="c-panel border border-dashed bg-white/50 p-4 text-sm"
      :style="{ borderColor: 'var(--t-gold)' }"
    >
      <template v-if="g.type === 'address'">
        <h4 class="mb-1 text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">
          Alamat Pengiriman
        </h4>
        <p :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.shipping_address }}</p>
      </template>

      <template v-else-if="g.type === 'qris'">
        <h4 class="mb-2 text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">QRIS</h4>
        <img v-if="g.qris_image" :src="assetUrl(g.qris_image)" alt="QRIS" class="mx-auto w-40" loading="lazy" />
      </template>

      <template v-else>
        <h4 class="text-base" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">
          {{ g.provider }}
        </h4>
        <p class="text-lg tracking-[0.1em]" :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">{{ g.account_number }}</p>
        <p :style="{ color: 'var(--el-value-color)', fontSize: 'var(--el-value-size)' }">a.n. {{ g.account_name }}</p>
        <button
          class="mt-2 cursor-pointer border px-3 py-1 text-[10px] uppercase tracking-widest"
          :style="{ borderColor: 'var(--t-accent)', color: 'var(--t-accent)', background: 'transparent' }"
          @click="$emit('copy', g.account_number, g.id)"
        >
          {{ copied === g.id ? 'Tersalin ✓' : 'Salin nomor' }}
        </button>
      </template>
    </div>
  </div>
</template>
