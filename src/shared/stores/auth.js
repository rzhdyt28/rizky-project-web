import { defineStore } from 'pinia';
import { api, csrf } from '../api/client';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, tenant: null, roles: [], loaded: false }),

  getters: {
    isLoggedIn: (s) => !!s.user,
    isAdmin:    (s) => s.roles.includes('super-admin') || s.roles.includes('admin'),
  },

  actions: {
    async fetchMe() {
      try {
        const { data } = await api.get('/api/auth/me');
        this.user = data.user; this.tenant = data.tenant; this.roles = data.roles;
      } catch { this.user = null; }
      finally { this.loaded = true; }
    },
    async login(email, password) {
      await csrf();
      const { data } = await api.post('/api/auth/login', { email, password });
      this.user = data.user;
      await this.fetchMe();
    },
    async register(payload) {
      await csrf();
      const { data } = await api.post('/api/auth/register', payload);
      this.user = data.user;
      await this.fetchMe();
    },
    async logout() {
      await api.post('/api/auth/logout');
      this.$reset();
    },
  },
});
