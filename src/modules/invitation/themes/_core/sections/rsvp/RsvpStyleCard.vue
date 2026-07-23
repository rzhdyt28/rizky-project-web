<script setup>
/** RSVP -- gaya "card" (default, perilaku lama): panel bertepi, field bertumpuk. */
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
  <div class="c-panel mx-auto max-w-sm border bg-white/60 p-5"
    :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
  >
    <p v-if="done" class="font-normal" :style="{ color: 'var(--t-accent)' }">
      Terima kasih, konfirmasimu sudah kami terima.
    </p>
    <form v-else class="grid gap-2.5" @submit.prevent="$emit('submit')">
      <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
      <input v-model="form.guest_name" required maxlength="120" placeholder="Nama"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <input v-model="form.phone" maxlength="30" placeholder="No. WhatsApp (opsional)"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <select v-model="form.attendance" class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }">
        <option value="attending">Hadir</option>
        <option value="not_attending">Berhalangan</option>
        <option value="maybe">Belum pasti</option>
      </select>
      <input v-model.number="form.pax" type="number" min="1" max="10" placeholder="Jumlah tamu"
        class="c-input border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
      <TheButton :disabled="pending">{{ labelBtn }}</TheButton>
    </form>
  </div>
</template>
