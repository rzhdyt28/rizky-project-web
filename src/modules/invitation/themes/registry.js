import { defineAsyncComponent } from 'vue';
import elegantTokens from './elegant/tokens';
import rusticTokens from './rustic/tokens';
import mildnessTokens from './mildness/tokens';

/**
 * THEME REGISTRY — plug & play.
 * Tambah tema: buat folder (copy _template) -> tambah 1 baris di sini ->
 * buat record Theme di Filament dengan component_key yang sama.
 * tokens = default warna/font tema di frontend; default_options di DB
 * hanyalah override admin di atasnya.
 */
export const themes = {
  elegant:  { layout: defineAsyncComponent(() => import('./elegant/Layout.vue')),  tokens: elegantTokens },
  rustic:   { layout: defineAsyncComponent(() => import('./rustic/Layout.vue')),   tokens: rusticTokens },
  mildness: { layout: defineAsyncComponent(() => import('./mildness/Layout.vue')), tokens: mildnessTokens },
};

export const resolveTheme = (key) => themes[key] ?? themes.elegant;
export const themeClass = (key) => (themes[key] ? `theme-${key}` : 'theme-elegant');
