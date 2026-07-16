<script setup>
import SealMonogram from '../ui/SealMonogram.vue';
import OrnamentDivider from '../ui/OrnamentDivider.vue';

defineProps({
  invitation: { type: Object, required: true },
  bg:         { type: Object, default: null },
});
</script>

<template>
  <footer class="relative grid justify-items-center gap-2.5 px-4 py-10 text-center">
    <OrnamentDivider />
    <SealMonogram small :groom="invitation.groom_name" :bride="invitation.bride_name" />
    <p class="text-base" :style="{ fontFamily: 'var(--t-font-head)' }">
      {{ invitation.groom_name }} &amp; {{ invitation.bride_name }}
    </p>
    <p class="max-w-xs text-xs opacity-60">
      Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
    </p>
    <OrnamentDivider flip />
  </footer>
</template>
