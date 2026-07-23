<script setup>
/**
 * _CORE / RSVP — DISPATCHER. State form (submit, error, done) dipakai semua
 * gaya, tetap di sini, diteruskan sebagai props (form-nya object reaktif,
 * anak boleh v-model langsung ke propertinya). Tambah gaya baru: buat
 * RsvpStyle<Nama>.vue di folder ini, daftarkan di map STYLES di bawah,
 * tambah opsi ke ThemeOptionsSchema::RSVP_STYLES (backend).
 */
import { computed, ref } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import { useRsvp } from '../../../../composables/useInvitation';
import RsvpStyleCard from './RsvpStyleCard.vue';
import RsvpStyleMinimal from './RsvpStyleMinimal.vue';
import RsvpStyleChips from './RsvpStyleChips.vue';

const props = defineProps({
  slug:      { type: String, required: true },
  guestName: { type: String, default: '' },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'card' }, // card|minimal|chips
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

const STYLES = {
  card: RsvpStyleCard,
  minimal: RsvpStyleMinimal,
  chips: RsvpStyleChips,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? RsvpStyleCard);
</script>

<template>
  <SectionWrapper :title="labels.title_rsvp">
    <component
      :is="activeStyle"
      :form="form"
      :done="done"
      :error="error"
      :pending="rsvp.isPending?.value"
      :label-btn="labels.btn_rsvp"
      @submit="submit"
    />
  </SectionWrapper>
</template>
