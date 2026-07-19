import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = (id) => `/api/invitation/${id}/guestbook`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useGuestbookAdmin(invitationId) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['guestbook-admin', invitationId] });

  const list = useQuery({
    queryKey: ['guestbook-admin', invitationId],
    queryFn: async () => (await api.get(base(unref(invitationId)))).data,
    enabled: () => !!unref(invitationId),
  });

  const setApproved = useMutation({
    mutationFn: ({ id, is_approved }) => api.put(`${base(unref(invitationId))}/${id}`, { is_approved }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`${base(unref(invitationId))}/${id}`),
    onSuccess: invalidate,
  });

  return { list, setApproved, remove };
}
