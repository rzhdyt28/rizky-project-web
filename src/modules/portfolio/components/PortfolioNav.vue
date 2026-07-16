<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  brand: { type: String, default: "portfolio" },
  lang: { type: String, default: "id" },
  links: { type: Array, default: () => [] }, // [{ to, label }]
});
defineEmits(["toggle-lang"]);

const isOpen = ref(false);

// Bug fix: kalau menu mobile dibiarkan terbuka lalu layar di-resize
// ke ukuran desktop (>768px), pastikan state ditutup supaya tidak
// nyangkut kebuka saat balik ke ukuran mobile lagi.
function handleResize() {
  if (window.innerWidth > 768) isOpen.value = false;
}

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<template>
  <nav class="pt-nav">
    <div class="pt-nav__row">
      <span class="pt-nav__brand">{{ brand }}▊</span>

      <button
        class="pt-nav__burger"
        :aria-expanded="isOpen"
        aria-label="Toggle menu"
        @click="isOpen = !isOpen"
      >
        <span :class="{ 'is-open': isOpen }"></span>
      </button>

      <div class="pt-nav__links pt-nav__links--desktop">
        <component
          :is="l.to.startsWith('#') ? 'a' : 'router-link'"
          v-for="l in links"
          :key="l.to"
          :href="l.to.startsWith('#') ? l.to : undefined"
          :to="l.to.startsWith('#') ? undefined : l.to"
        >
          {{ l.label }}
        </component>
        <button class="pt-lang-toggle" @click="$emit('toggle-lang')">
          {{ lang }} | {{ lang === "id" ? "en" : "id" }}
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="pt-nav__links pt-nav__links--mobile">
      <component
        :is="l.to.startsWith('#') ? 'a' : 'router-link'"
        v-for="l in links"
        :key="l.to"
        :href="l.to.startsWith('#') ? l.to : undefined"
        :to="l.to.startsWith('#') ? undefined : l.to"
        @click="isOpen = false"
      >
        {{ l.label }}
      </component>
      <button class="pt-lang-toggle" @click="$emit('toggle-lang')">
        {{ lang }} | {{ lang === "id" ? "en" : "id" }}
      </button>
    </div>
  </nav>
</template>
