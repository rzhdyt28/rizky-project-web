<script setup>
import { onBeforeUnmount, ref } from 'vue';

const props = defineProps({ url: { type: String, required: true } });

const audio = new Audio(props.url);
audio.loop = true;
const playing = ref(false);

function toggle() {
  playing.value ? audio.pause() : audio.play().catch(() => {});
  playing.value = !playing.value;
}

onBeforeUnmount(() => { audio.pause(); audio.src = ''; });
</script>

<template>
  <button
    class="fixed bottom-4 right-4 z-50 grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0"
    :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
    :aria-label="playing ? 'Jeda musik' : 'Putar musik'"
    @click="toggle"
  >
    <svg v-if="!playing" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
    <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
  </button>
</template>
