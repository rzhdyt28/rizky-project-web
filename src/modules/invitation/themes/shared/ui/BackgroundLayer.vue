<script setup>
import { computed } from 'vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  bg: { type: Object, default: null },   // {type, value, image, overlay_opacity}
});

const style = computed(() => {
  const b = props.bg;
  if (!b || b.type === 'inherit') return null;
  if (b.type === 'image' && (b.image || b.value)) {
    return {
      backgroundImage: `url(${assetUrl(b.image || b.value)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  if (b.type === 'color' && b.value) return { backgroundColor: b.value };
  return null;
});

const overlay = computed(() => Number(props.bg?.overlay_opacity ?? 0));
</script>

<template>
  <div v-if="style" class="absolute inset-0 -z-10" :style="style">
    <div
      v-if="overlay > 0"
      class="absolute inset-0"
      :style="{ backgroundColor: `rgba(0,0,0,${overlay})` }"
    />
  </div>
</template>
