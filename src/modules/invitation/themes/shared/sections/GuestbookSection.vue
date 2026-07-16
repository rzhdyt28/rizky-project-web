<script setup>
import { ref } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import TheButton from '../ui/TheButton.vue';
import { useGuestbook } from '../../../composables/useInvitation';

const props = defineProps({
  slug:      { type: String, required: true },
  guestName: { type: String, default: '' },
  guestbook: { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  bg:        { type: Object, default: null },
});

const gb = useGuestbook(props.slug);
const error = ref('');
const form = ref({ guest_name: props.guestName, message: '' });

async function submit() {
  error.value = '';
  try {
    await gb.mutateAsync(form.value);
    form.value.message = '';
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal mengirim. Coba lagi.';
  }
}
</script>

<template>
  <SectionWrapper :title="labels.title_guestbook" :bg="bg">
    <div class="mx-auto max-w-sm">
      <form class="grid gap-2.5 border bg-white/60 p-5"
        :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
        @submit.prevent="submit"
      >
        <p v-if="error" class="text-xs text-red-700">{{ error }}</p>
        <input v-model="form.guest_name" required maxlength="120" placeholder="Nama"
          class="border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
        <textarea v-model="form.message" required maxlength="1000" rows="3" placeholder="Tulis ucapan &amp; doa"
          class="resize-none border px-3 py-2.5 text-sm" :style="{ background: 'var(--t-paper)' }" />
        <TheButton :disabled="gb.isPending?.value">Kirim Ucapan</TheButton>
      </form>

      <ul class="mt-5 grid gap-3 text-left">
        <li
          v-for="w in guestbook" :key="w.id"
          class="border-b border-dashed pb-2.5 text-sm"
          :style="{ borderColor: 'color-mix(in srgb, var(--t-ink) 20%, transparent)' }"
        >
          <strong class="font-normal" :style="{ color: 'var(--t-accent)' }">{{ w.guest_name }}</strong>
          <p>{{ w.message }}</p>
        </li>
      </ul>
    </div>
  </SectionWrapper>
</template>
