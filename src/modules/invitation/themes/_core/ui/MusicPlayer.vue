<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  url:      { type: String, default: null },
  autoplay: { type: Boolean, default: true },
});

const audio = ref(null);
const playing = ref(false);

function toggle() {
  if (!audio.value) return;
  if (playing.value) { audio.value.pause(); playing.value = false; }
  else { audio.value.play().then(() => (playing.value = true)).catch(() => {}); }
}

watch(audio, (el) => {
  if (el && props.autoplay) {
    el.play().then(() => (playing.value = true)).catch(() => { playing.value = false; });
  }
});
onBeforeUnmount(() => audio.value?.pause());
</script>

<template>
  <div v-if="url" class="c-music fixed bottom-4 right-4 z-50">
    <audio ref="audio" :src="assetUrl(url)" loop preload="none" />
    <button
      class="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 shadow-lg"
      :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
      :aria-label="playing ? 'Jeda musik' : 'Putar musik'"
      @click="toggle"
    >
      <span v-if="playing" class="c-music__bars" aria-hidden="true"><i /><i /><i /></span>
      <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </button>
  </div>
</template>

<style scoped>
.c-music__bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
.c-music__bars i { width: 3px; background: currentColor; animation: eq 1s ease-in-out infinite; }
.c-music__bars i:nth-child(2) { animation-delay: .2s; }
.c-music__bars i:nth-child(3) { animation-delay: .4s; }
@keyframes eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }
</style>
