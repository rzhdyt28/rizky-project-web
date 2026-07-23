<script setup>
/** Ucapan & Doa -- gaya "wall": daftar ucapan jadi kartu 2 kolom (dinding ucapan), form di atas. */
import TheButton from '../../ui/TheButton.vue';

defineProps({
  guestbook: { type: Array, default: () => [] },
  form:      { type: Object, required: true },
  error:     { type: String, default: '' },
  pending:   { type: Boolean, default: false },
});
defineEmits(['submit']);
</script>

<template>
  <div class="mx-auto max-w-lg">
    <form class="c-panel grid max-w-sm gap-2.5 mx-auto mb-6 border bg-white/60 p-5"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
      @submit.prevent="$emit('submit')"
    >
      <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
      <input v-model="form.guest_name" required maxlength="120" placeholder="Nama"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <textarea v-model="form.message" required maxlength="1000" rows="3" placeholder="Tulis ucapan &amp; doa"
        class="c-input resize-none border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <TheButton :disabled="pending">Kirim Ucapan</TheButton>
    </form>

    <div class="grid gap-3 text-left sm:grid-cols-2">
      <div
        v-for="w in guestbook" :key="w.id"
        class="p-3 text-sm rounded-lg c-guestbook__wall-card"
      >
        <strong class="font-normal" :style="{ color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">{{ w.guest_name }}</strong>
        <p class="mt-0.5" :style="{ color: 'var(--el-text-color)', fontSize: 'var(--el-text-size)' }">{{ w.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-guestbook__wall-card {
  background: color-mix(in srgb, var(--t-accent) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--t-accent) 15%, transparent);
}
</style>
