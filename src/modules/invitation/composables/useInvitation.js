import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = '/api/invitation';

export function usePublicInvitation(slug, guest, preview = false) {
  return useQuery({
    queryKey: ['invitation', slug, preview],
    queryFn: async () => (await api.get(`${base}/p/${slug}`, {
      params: { to: guest, ...(preview ? { preview: 1 } : {}) },
    })).data,
  });
}

export function useRsvp(slug) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post(`${base}/p/${slug}/rsvp`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitation', slug] }),
  });
}

export function useGuestbook(slug) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post(`${base}/p/${slug}/guestbook`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitation', slug] }),
  });
}

export function useMyInvitations() {
  return useQuery({
    queryKey: ['my-invitations'],
    // TANPA trailing slash: rutenya persis /api/invitation (apiResource '/').
    // Dengan slash, Apache 301-redirect ke Location absolut (host backend
    // asli), yang lolos dari proxy dev Vite dan jadi cross-origin nyata ->
    // browser blokir sebagai "Network Error".
    queryFn: async () => (await api.get(base)).data,
    retry: 1,
  });
}

/**
 * Undangan yang sedang "aktif" di halaman CRUD (Acara, Kisah Cinta, dst).
 * Kuota paket saat ini membatasi 1 undangan/tenant, jadi diambil yang
 * pertama — halaman pemakainya cukup tunggu `invitation` terisi sebelum
 * memanggil composable resource (useEvents, dst) dengan id-nya.
 */
export function useActiveInvitation() {
  const { data, isLoading, isError, error } = useMyInvitations();
  const invitations = computed(() => data.value?.data ?? []);
  const invitation = computed(() => invitations.value[0] ?? null);

  return { invitation, invitations, isLoading, isError, error };
}
