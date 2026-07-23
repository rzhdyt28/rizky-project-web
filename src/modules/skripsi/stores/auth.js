import { defineStore } from 'pinia';
import { api, csrf } from '../../../shared/api/client';

/**
 * Auth store project Skripsi — TERPISAH dari shared/stores/auth.js (yang
 * dipakai produk Undangan). Skripsi punya User & login sendiri di backend
 * (/api/skripsi/auth/*), tidak ada tenant/subscription.
 */
export const useSkripsiAuthStore = defineStore('skripsiAuth', {
  state: () => ({ user: null, loaded: false }),

  getters: {
    isLoggedIn: (s) => !!s.user,
  },

  actions: {
    async fetchMe() {
      try {
        const { data } = await api.get('/api/skripsi/auth/me');
        this.user = data.user;
      } catch { this.user = null; }
      finally { this.loaded = true; }
    },
    async login(email, password) {
      await csrf();
      const { data } = await api.post('/api/skripsi/auth/login', { email, password });
      this.user = data.user;
    },
    async register(payload) {
      await csrf();
      const { data } = await api.post('/api/skripsi/auth/register', payload);
      this.user = data.user;
    },
    async logout() {
      await api.post('/api/skripsi/auth/logout');
      this.$reset();
    },
  },
});
