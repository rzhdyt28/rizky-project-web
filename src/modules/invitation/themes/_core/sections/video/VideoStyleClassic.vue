<script setup>
/** Video -- gaya "classic" (default, perilaku lama): eyebrow + caption + video 16:9 + credit di bawah. */
defineProps({
  eyebrow:     { type: String, default: '' },
  caption:     { type: String, default: '' },
  embedSrc:    { type: String, default: null },
  isLocalFile: { type: Boolean, default: false },
  invitation:  { type: Object, default: () => ({}) },
  creditDate:  { type: String, default: '' },
});
</script>

<template>
  <div>
    <p class="c-video__eyebrow -mt-4 mb-1 uppercase tracking-[0.35em]" :style="{ color: 'var(--el-eyebrow-color, var(--t-gold))', fontSize: 'var(--el-eyebrow-size, 10px)' }">
      {{ eyebrow }}
    </p>
    <p class="max-w-md mx-auto mb-5 italic c-video__caption opacity-90" :style="{ color: 'var(--el-caption-color)', fontSize: 'var(--el-caption-size, 0.875rem)' }">
      {{ caption }}
    </p>
    <div class="max-w-md mx-auto overflow-hidden border rounded-lg aspect-video"
      :style="{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }"
    >
      <video v-if="isLocalFile" :src="embedSrc" controls playsinline class="object-cover w-full h-full" />
      <iframe
        v-else
        :src="embedSrc"
        class="w-full h-full border-0"
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <p class="c-video__credit mt-4 uppercase tracking-[0.2em] opacity-70" :style="{ color: 'var(--el-credit-color)', fontSize: 'var(--el-credit-size, 0.75rem)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      <template v-if="creditDate"> · {{ creditDate }}</template>
    </p>
  </div>
</template>
