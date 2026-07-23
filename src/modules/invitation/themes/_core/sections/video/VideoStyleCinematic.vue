<script setup>
/** Video -- gaya "cinematic": video lebar 21:9 penuh (ala layar bioskop), eyebrow+caption+credit di bawah, gelap & dramatis. */
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
    <p class="mb-1 uppercase tracking-[0.35em] text-center" :style="{ fontFamily: 'var(--el-eyebrow-font, var(--t-font-accent))', color: 'var(--el-eyebrow-color, var(--t-gold))', fontSize: 'var(--el-eyebrow-size, 10px)' }">{{ eyebrow }}</p>
    <div class="w-full max-w-2xl mx-auto overflow-hidden bg-black rounded-xl c-video__cinematic">
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
    <p class="max-w-md mx-auto mt-4 italic text-center c-video__caption opacity-90" :style="{ fontFamily: 'var(--el-caption-font, var(--t-font-body))', color: 'var(--el-caption-color)', fontSize: 'var(--el-caption-size, 0.875rem)' }">{{ caption }}</p>
    <p class="mt-2 tracking-[0.2em] uppercase text-center opacity-70" :style="{ fontFamily: 'var(--el-credit-font, var(--t-font-accent))', color: 'var(--el-credit-color)', fontSize: 'var(--el-credit-size, 0.75rem)' }">
      {{ invitation.bride_name }} &amp; {{ invitation.groom_name }}
      <template v-if="creditDate"> · {{ creditDate }}</template>
    </p>
  </div>
</template>

<style scoped>
.c-video__cinematic { aspect-ratio: 21 / 9; box-shadow: 0 24px 50px -24px rgba(0, 0, 0, 0.5); }
</style>
