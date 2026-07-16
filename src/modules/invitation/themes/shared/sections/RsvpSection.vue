<script setup>
import { ref } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import TheButton from '../ui/TheButton.vue';
import { useRsvp } from '../../../composables/useInvitation';

const props = defineProps({
  slug:      { type: String, required: true },
  guestName: { type: String, default: '' },
  labels:    { type: Object, required: true },
  bg:        { type: Object, default: null },
});

const rsvp = useRsvp(props.slug);
const done = ref(false);
const error = ref('');
const form = ref({ guest_name: props.guestName, phone: '', attendance: 'attending', pax: 1 });

async function submit() {
  error.value = '';
  try {
    await rsvp.mutateAsync(form.value);
    done.value = true;
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal mengirim. Coba lagi.';
  }
}
</script>

<template>
  <SectionWrapper :title="labels.title_rsvp" :bg="bg">
    <div class="mx-auto max-w-sm border bg-white/60 p-5"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
    >
      <p v-if="done" class="font-normal" :style="{ color: 'var(--t-accent)' }">
        Terima kasih, konfirmasimu sudah kami terima.
      </p>
      <form v-else class="grid gap-2.5" @submit.prevent="submit">
        <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
        <input v-model="form.guest_name" required maxlength="120" placeholder="Nama"
          class="border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
        <input v-model="form.phone" maxlength="30" placeholder="No. WhatsApp (opsional)"
          class="border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
        <select v-model="form.attendance" class="border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }">
          <option value="attending">Hadir</option>
          <option value="not_attending">Berhalangan</option>
          <option value="maybe">Belum pasti</option>
        </select>
        <input v-model.number="form.pax" type="number" min="1" max="10" placeholder="Jumlah tamu"
          class="border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
        <TheButton :disabled="rsvp.isPending?.value">{{ labels.btn_rsvp }}</TheButton>
      </form>
    </div>
  </SectionWrapper>
</template>
