import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = (id) => `/api/invitation/${id}/gifts`;

function toFormData(payload, spoofMethod = null) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (v !== null && v !== undefined) fd.append(k, v);
  }
  if (spoofMethod) fd.append('_method', spoofMethod);
  return fd;
}

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useGifts(invitationId) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['gifts', invitationId] });

  const list = useQuery({
    queryKey: ['gifts', invitationId],
    queryFn: async () => (await api.get(base(unref(invitationId)))).data,
    enabled: () => !!unref(invitationId),
  });

  const create = useMutation({
    mutationFn: (payload) => api.post(base(unref(invitationId)), toFormData(payload)),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }) => api.post(`${base(unref(invitationId))}/${id}`, toFormData(payload, 'PUT')),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`${base(unref(invitationId))}/${id}`),
    onSuccess: invalidate,
  });

  return { list, create, update, remove };
}
