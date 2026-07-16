import { defineAsyncComponent } from 'vue';

/**
 * THEME REGISTRY — plug & play.
 * Tambah tema: buat folder Layout.vue baru -> daftarkan di sini ->
 * tambah baris di Filament (Themes) dengan component_key yang sama.
 */
export const themes = {
  elegant: defineAsyncComponent(() => import('./elegant/Layout.vue')),
  rustic:  defineAsyncComponent(() => import('./rustic/Layout.vue')),
};

export const resolveTheme = (key) => themes[key] ?? themes.elegant;
