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
    queryFn: async () => (await api.get(`${base}/`)).data,
  });
}
