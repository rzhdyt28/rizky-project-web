<script setup>
/** Video -- gaya "framed": video dalam bingkai ornamen dengan padding tebal & sudut membulat besar, caption di dalam kartu bawah. */
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
  <div class="max-w-md mx-auto text-center c-video__framed">
    <p class="mb-3 uppercase tracking-[0.35em]" :style="{ fontFamily: 'var(--el-eyebrow-font, var(--t-font-accent))', color: 'var(--el-eyebrow-color, var(--t-gold))', fontSize: 'var(--el-eyebrow-size, 10px)' }">{{ eyebrow }}</p>
    <div class="overflow-hidden aspect-video rounded-2xl c-video__framed-box">
      <video v-if="isLocalFile" :src="embedSrc" controls playsinline class="object-cover w-full h-full rounded-xl" />
      <iframe
        v-else
        :src="embedSrc"
        class="w-full h-full border-0 rounded-xl"
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <p class="mt-4 italic c-video__caption opacity-90" :style="{ fontFamily: 'var(--el-caption-font, var(--t-font-body))', color: 'var(--el-caption-color)', fontSize: 'var(--el-caption-size, 0.875rem)' }">{{ caption }}</p>
    <p class="mt-2 tracking-[0.2em] uppercase opacity-70" :style="{ fontFamily: 'var(--el-credit-font, var(--t-font-accent))', color: 'var(--el-credit-color)', fontSize: 'var(--el-credit-size, 0.75rem)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      <template v-if="creditDate"> · {{ creditDate }}</template>
    </p>
  </div>
</template>

<style scoped>
.c-video__framed-box {
  padding: 0.6rem;
  border: 2px solid color-mix(in srgb, var(--t-gold, #b08d4a) 55%, transparent);
  box-shadow: 0 20px 42px -20px rgba(0, 0, 0, 0.4);
}
</style>
