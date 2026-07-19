import { defineAsyncComponent } from 'vue';
import mildnessTokens from './mildness/tokens';
import senjaTokens from './senja/tokens';

/**
 * THEME REGISTRY — plug & play.
 * KEPUTUSAN v2.2: tema elegant & rustic DIHAPUS. mildness = tema induk
 * universal (semua tema baru cukup dibuat sebagai ANAK-nya di Filament:
 * isi parent_id + default_options pembeda, TANPA folder Vue baru).
 * Folder Vue baru hanya perlu bila STRUKTUR layoutnya beda (mis. senja
 * yang split-screen).
 */
export const themes = {
  mildness: { layout: defineAsyncComponent(() => import('./mildness/Layout.vue')), tokens: mildnessTokens },
  senja:    { layout: defineAsyncComponent(() => import('./senja/Layout.vue')),    tokens: senjaTokens },
};

/**
 * PEWARISAN TEMA: menerima satu key ATAU array key berurutan
 * [tema ini, parent, kakek, ...] dari backend (theme.component_keys).
 * Key pertama yang punya folder Vue dipakai; fallback akhir = mildness.
 */
export const resolveTheme = (keyOrKeys) => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  for (const k of keys) {
    if (k && themes[k]) return themes[k];
  }
  return themes.mildness;
};

export const themeClass = (keyOrKeys) => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  for (const k of keys) {
    if (k && themes[k]) return `theme-${k}`;
  }
  return 'theme-mildness';
};
