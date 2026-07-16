<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({ url: { type: String, required: true } });

// assetUrl() aman untuk dua kasus: path storage baru (mis. "music/xxx.mp3")
// maupun URL eksternal lama yang masih tersimpan (dikembalikan apa adanya).
const audio = new Audio(assetUrl(props.url));
audio.loop = true;
const playing = ref(false);

function toggle() {
  playing.value ? audio.pause() : audio.play().catch(() => {});
  playing.value = !playing.value;
}

onMounted(() => {
  // MusicPlayer HANYA di-mount setelah tombol "Buka Undangan" diklik
  // (lihat v-else di Layout.vue tiap tema) — jadi ini masih dianggap
  // browser sebagai hasil interaksi user, dan autoplay diizinkan.
  audio.play().then(() => {
    playing.value = true;
  }).catch(() => {
    // Kasus langka: browser tetap memblokir -> biarkan user tekan tombol manual.
    playing.value = false;
  });
});

onBeforeUnmount(() => { audio.pause(); audio.src = ''; });
</script>

<template>
  <button
    class="fixed z-50 grid border-0 rounded-full cursor-pointer bottom-4 right-4 h-11 w-11 place-items-center"
    :style="{ background: 'var(--t-accent)', color: 'var(--t-paper)' }"
    :aria-label="playing ? 'Jeda musik' : 'Putar musik'"
    @click="toggle"
  >
    <svg v-if="!playing" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
    <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
  </button>
</template>