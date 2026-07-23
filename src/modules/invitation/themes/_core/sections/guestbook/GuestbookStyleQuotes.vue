<script setup>
/** Ucapan & Doa -- gaya "quotes": tiap ucapan tampil ala kutipan bertanda petik besar, form di atas. */
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
  <div class="mx-auto max-w-sm">
    <form class="c-panel grid gap-2.5 border bg-white/60 p-5"
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

    <div class="grid gap-5 mt-6 text-center">
      <blockquote v-for="w in guestbook" :key="w.id" class="c-guestbook__quote">
        <span class="c-guestbook__mark" aria-hidden="true">&ldquo;</span>
        <p class="italic leading-relaxed" :style="{ color: 'var(--el-text-color)', fontSize: 'var(--el-text-size, 0.875rem)' }">{{ w.message }}</p>
        <footer class="mt-1" :style="{ color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size, 0.75rem)' }">&mdash; {{ w.guest_name }}</footer>
      </blockquote>
    </div>
  </div>
</template>

<style scoped>
.c-guestbook__mark {
  display: block;
  font-family: var(--t-font-head, serif);
  font-size: 2.5rem;
  line-height: 1;
  color: var(--t-gold, #b08d4a);
}
</style>
