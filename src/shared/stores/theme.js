import { defineStore } from 'pinia';

const STORAGE_KEY = 'dashboard-theme'; // 'light' | 'dark'

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function apply(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: localStorage.getItem(STORAGE_KEY) || (systemPrefersDark() ? 'dark' : 'light'),
  }),

  getters: {
    isDark: (s) => s.mode === 'dark',
  },

  actions: {
    init() {
      apply(this.mode);
    },
    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, this.mode);
      apply(this.mode);
    },
  },
});
