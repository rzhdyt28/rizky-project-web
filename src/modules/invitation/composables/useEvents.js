import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = (id) => `/api/invitation/${id}/events`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useEvents(invitationId) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['events', invitationId] });

  const list = useQuery({
    queryKey: ['events', invitationId],
    queryFn: async () => (await api.get(base(unref(invitationId)))).data,
    enabled: () => !!unref(invitationId),
  });

  const create = useMutation({
    mutationFn: (payload) => api.post(base(unref(invitationId)), payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }) => api.put(`${base(unref(invitationId))}/${id}`, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`${base(unref(invitationId))}/${id}`),
    onSuccess: invalidate,
  });

  return { list, create, update, remove };
}
