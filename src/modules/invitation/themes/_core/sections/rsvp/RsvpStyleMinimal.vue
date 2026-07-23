<script setup>
/** RSVP -- gaya "minimal": tanpa kotak, field underline tipis, sangat bersih. */
import TheButton from '../../ui/TheButton.vue';

defineProps({
  form:    { type: Object, required: true },
  done:    { type: Boolean, default: false },
  error:   { type: String, default: '' },
  pending: { type: Boolean, default: false },
  labelBtn: { type: String, default: '' },
});
defineEmits(['submit']);
</script>

<template>
  <div class="max-w-sm mx-auto text-center">
    <p v-if="done" class="font-normal" :style="{ color: 'var(--t-accent)' }">
      Terima kasih, konfirmasimu sudah kami terima.
    </p>
    <form v-else class="grid gap-3" @submit.prevent="$emit('submit')">
      <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
      <input v-model="form.guest_name" required maxlength="120" placeholder="Nama" class="c-rsvp__underline" />
      <input v-model="form.phone" maxlength="30" placeholder="No. WhatsApp (opsional)" class="c-rsvp__underline" />
      <select v-model="form.attendance" class="c-rsvp__underline">
        <option value="attending">Hadir</option>
        <option value="not_attending">Berhalangan</option>
        <option value="maybe">Belum pasti</option>
      </select>
      <input v-model.number="form.pax" type="number" min="1" max="10" placeholder="Jumlah tamu" class="c-rsvp__underline" />
      <TheButton :disabled="pending" class="mx-auto mt-2">{{ labelBtn }}</TheButton>
    </form>
  </div>
</template>

<style scoped>
.c-rsvp__underline {
  width: 100%;
  border: 0;
  border-bottom: 1.5px solid color-mix(in srgb, var(--t-accent) 35%, transparent);
  background: transparent;
  padding: 0.5rem 0.25rem;
  font-size: 0.875rem;
  text-align: center;
}
.c-rsvp__underline:focus { outline: none; border-bottom-color: var(--t-accent); }
</style>
