<script setup>
/** RSVP -- gaya "chips": kehadiran dipilih lewat 3 tombol chip (bukan dropdown), lebih ramah sentuh di HP. */
import TheButton from '../../ui/TheButton.vue';

defineProps({
  form:    { type: Object, required: true },
  done:    { type: Boolean, default: false },
  error:   { type: String, default: '' },
  pending: { type: Boolean, default: false },
  labelBtn: { type: String, default: '' },
});
defineEmits(['submit']);

const OPTIONS = [
  { value: 'attending', label: 'Hadir' },
  { value: 'not_attending', label: 'Berhalangan' },
  { value: 'maybe', label: 'Belum pasti' },
];
</script>

<template>
  <div class="c-panel mx-auto max-w-sm border bg-white/60 p-5 rounded-2xl"
    :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
  >
    <p v-if="done" class="font-normal" :style="{ color: 'var(--t-accent)' }">
      Terima kasih, konfirmasimu sudah kami terima.
    </p>
    <form v-else class="grid gap-3" @submit.prevent="$emit('submit')">
      <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
      <input v-model="form.guest_name" required maxlength="120" placeholder="Nama"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <input v-model="form.phone" maxlength="30" placeholder="No. WhatsApp (opsional)"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="opt in OPTIONS" :key="opt.value" type="button"
          class="c-rsvp__chip" :class="{ 'c-rsvp__chip--active': form.attendance === opt.value }"
          @click="form.attendance = opt.value"
        >{{ opt.label }}</button>
      </div>
      <input v-model.number="form.pax" type="number" min="1" max="10" placeholder="Jumlah tamu"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <TheButton :disabled="pending">{{ labelBtn }}</TheButton>
    </form>
  </div>
</template>

<style scoped>
/* Warna chip independen dari --t-accent global (bisa diatur sendiri lewat
   "Ukuran & Warna tiap elemen teks section" > elemen "button", tidak WAJIB
   ikut warna aksen tema). */
.c-rsvp__chip {
  padding: 0.5rem 0.3rem;
  border-radius: 999px;
  font-size: var(--el-button-size, 0.72rem);
  cursor: pointer;
  border: 1.5px solid color-mix(in srgb, var(--el-button-color, var(--t-accent)) 30%, transparent);
  background: transparent;
  color: inherit;
}
.c-rsvp__chip--active {
  background: var(--el-button-color, var(--t-accent));
  color: var(--t-paper, #fff);
  border-color: var(--el-button-color, var(--t-accent));
}
</style>
