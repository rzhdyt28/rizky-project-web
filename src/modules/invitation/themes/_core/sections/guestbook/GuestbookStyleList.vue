<script setup>
/** Ucapan & Doa -- gaya "list" (default, perilaku lama): form di atas, daftar bertumpuk dipisah garis putus-putus. */
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

    <ul class="mt-5 grid gap-3 text-left">
      <li
        v-for="w in guestbook" :key="w.id"
        class="border-b border-dashed pb-2.5 text-sm"
        :style="{ borderColor: 'color-mix(in srgb, var(--t-ink) 20%, transparent)' }"
      >
        <strong class="font-normal" :style="{ color: 'var(--el-name-color, var(--t-accent))', fontSize: 'var(--el-name-size)' }">{{ w.guest_name }}</strong>
        <p :style="{ color: 'var(--el-text-color)', fontSize: 'var(--el-text-size)' }">{{ w.message }}</p>
      </li>
    </ul>
  </div>
</template>
