<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  brand: { type: String, default: "portfolio" },
  lang: { type: String, default: "id" },
  links: { type: Array, default: () => [] }, // [{ to, label }]
});
defineEmits(["toggle-lang"]);

const isOpen = ref(false);
const isSticky = ref(false);

function handleResize() {
  if (window.innerWidth > 720) isOpen.value = false;
}

function handleScroll() {
  isSticky.value = window.scrollY > 20;
}

function closeMenu() {
  isOpen.value = false;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav class="pt-nav" :class="{ 'is-sticky': isSticky }">
    <div class="pt-nav__row">
      <span class="pt-nav__brand">{{ brand }}</span>

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

      <button
        class="pt-nav__burger"
        :aria-expanded="isOpen"
        aria-label="Toggle menu"
        @click="isOpen = !isOpen"
      >
        <span :class="{ 'is-open': isOpen }"></span>
      </button>
    </div>

    <div
      class="pt-nav__links pt-nav__links--mobile"
      :class="{ 'is-open': isOpen }"
    >
      <component
        :is="l.to.startsWith('#') ? 'a' : 'router-link'"
        v-for="l in links"
        :key="l.to"
        :href="l.to.startsWith('#') ? l.to : undefined"
        :to="l.to.startsWith('#') ? undefined : l.to"
        @click="closeMenu"
      >
        {{ l.label }}
      </component>
      <button class="pt-lang-toggle" @click="$emit('toggle-lang')">
        {{ lang }} | {{ lang === "id" ? "en" : "id" }}
      </button>
    </div>
  </nav>
</template>
