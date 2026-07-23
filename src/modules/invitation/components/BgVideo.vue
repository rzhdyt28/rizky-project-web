<script setup>
/**
 * GLOBAL — Background video hero. Menggantikan slideshow/foto kalau diisi
 * (lihat useThemeOptions.js -> hero.videoUrl, saling eksklusif dengan
 * hero.slideshow di Filament -- lihat InvitationLookResource).
 * Video di-loop, mute, autoplay -- browser mewajibkan muted untuk autoplay
 * tanpa interaksi user.
 */
defineProps({
  src:    { type: String, required: true },
  effect: { type: String, default: 'none' }, // none|sepia|bw|vintage|blur|brightness|contrast|saturate|hue-rotate
});
</script>

<template>
  <div class="bgv" aria-hidden="true">
    <video
      class="bgv__video"
      :class="`bgv__video--${effect}`"
      :src="src"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    />
  </div>
</template>

<style scoped>
.bgv { position: absolute; inset: 0; overflow: hidden; }
.bgv__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bgv__video--sepia      { filter: sepia(0.75); }
.bgv__video--bw         { filter: grayscale(1); }
.bgv__video--vintage    { filter: sepia(0.4) contrast(0.9) brightness(0.95) saturate(0.85); }
.bgv__video--blur       { filter: blur(3px); }
.bgv__video--brightness { filter: brightness(1.25); }
.bgv__video--contrast   { filter: contrast(1.35); }
.bgv__video--saturate   { filter: saturate(1.6); }
.bgv__video--hue-rotate { filter: hue-rotate(45deg); }
</style>
