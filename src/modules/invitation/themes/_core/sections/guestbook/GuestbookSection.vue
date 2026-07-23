<script setup>
/**
 * _CORE / Ucapan & Doa — DISPATCHER. State form (submit, error) dipakai
 * semua gaya, tetap di sini. Tambah gaya baru: buat
 * GuestbookStyle<Nama>.vue di folder ini, daftarkan di map STYLES di bawah,
 * tambah opsi ke ThemeOptionsSchema::GUESTBOOK_STYLES (backend).
 */
import { computed, ref } from 'vue';
import SectionWrapper from '../../ui/SectionWrapper.vue';
import { useGuestbook } from '../../../../composables/useInvitation';
import GuestbookStyleList from './GuestbookStyleList.vue';
import GuestbookStyleWall from './GuestbookStyleWall.vue';
import GuestbookStyleQuotes from './GuestbookStyleQuotes.vue';

const props = defineProps({
  slug:      { type: String, required: true },
  guestName: { type: String, default: '' },
  guestbook: { type: Array, default: () => [] },
  labels:    { type: Object, required: true },
  styleName: { type: String, default: 'list' }, // list|wall|quotes
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

const STYLES = {
  list: GuestbookStyleList,
  wall: GuestbookStyleWall,
  quotes: GuestbookStyleQuotes,
};
const activeStyle = computed(() => STYLES[props.styleName] ?? GuestbookStyleList);
</script>

<template>
  <SectionWrapper :title="labels.title_guestbook">
    <component
      :is="activeStyle"
      :guestbook="guestbook"
      :form="form"
      :error="error"
      :pending="gb.isPending?.value"
      @submit="submit"
    />
  </SectionWrapper>
</template>
